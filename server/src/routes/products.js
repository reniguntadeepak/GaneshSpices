import { Router } from 'express';
import multer from 'multer';
import sharp from 'sharp';
import { supabase, BUCKET } from '../db.js';
import { authRequired, requireAdmin } from '../middleware/auth.js';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

function mapProduct(row) {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    description: row.description,
    price: Number(row.price),
    stock: row.stock,
    image: row.image_url || null,
    image_url: row.image_url || null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

router.get('/', async (_req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data.map(mapProduct));
  } catch (err) {
    next(err);
  }
});

router.post('/', authRequired, requireAdmin, async (req, res, next) => {
  try {
    const { name, category, description, price, stock } = req.body;
    if (!name?.trim() || !category || description == null || price == null) {
      return res.status(400).json({ error: 'Missing required product fields.' });
    }

    const { data, error } = await supabase
      .from('products')
      .insert({
        name: String(name).trim(),
        category,
        description: String(description).trim(),
        price: Number(price),
        stock: stock != null ? parseInt(stock, 10) : 50,
      })
      .select('*')
      .single();

    if (error) throw error;
    res.status(201).json(mapProduct(data));
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', authRequired, requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = {};
    const allowed = ['name', 'category', 'description', 'price', 'stock', 'image_url'];
    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }
    if (updates.name) updates.name = String(updates.name).trim();
    if (updates.description) updates.description = String(updates.description).trim();
    if (updates.price != null) updates.price = Number(updates.price);
    if (updates.stock != null) updates.stock = parseInt(updates.stock, 10);
    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Product not found.' });
    res.json(mapProduct(data));
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', authRequired, requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
    await supabase.storage.from(BUCKET).remove([`${id}.jpg`]);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

router.post(
  '/:id/image',
  authRequired,
  requireAdmin,
  upload.single('image'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!req.file) {
        return res.status(400).json({ error: 'Image file is required.' });
      }

      const buffer = await sharp(req.file.buffer)
        .resize(640, 640, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 82 })
        .toBuffer();

      const path = `${id}.jpg`;
      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(path, buffer, {
          contentType: 'image/jpeg',
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);
      const imageUrl = urlData.publicUrl;

      const { data, error } = await supabase
        .from('products')
        .update({ image_url: imageUrl, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select('*')
        .single();

      if (error) throw error;
      res.json(mapProduct(data));
    } catch (err) {
      next(err);
    }
  }
);

export default router;
