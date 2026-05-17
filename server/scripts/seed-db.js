#!/usr/bin/env node
/**
 * Upsert admin user and sample products. Run after schema migration:
 *   node --env-file=.env scripts/seed-db.js
 */
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

const ADMIN_ID = 'a0000000-0000-4000-8000-000000000001';

const PRODUCTS = [
  ['Turmeric Powder (Haldi)', 'Ground Spices', 'Bright golden turmeric, stone-ground for curries, golden milk, and marinades. 200g pack.', 149, 48],
  ['Garam Masala Blend', 'Spice Blends', 'Aromatic North Indian blend with cardamom, cinnamon, cloves, and black pepper. 150g jar.', 199, 35],
  ['Kashmiri Red Chili', 'Chilies & Peppers', 'Mild, vibrant red chilies prized for color and gentle heat. Ideal for tandoori and gravies. 100g.', 129, 22],
  ['Whole Cumin Seeds (Jeera)', 'Whole Spices', 'Earthy whole jeera for tempering dals, rice, and vegetable dishes. 250g pouch.', 89, 60],
  ['Green Cardamom Pods', 'Whole Spices', 'Premium elaichi with intense floral sweetness for sweets, chai, and biryanis. 50g.', 349, 18],
  ['Coriander Powder', 'Ground Spices', 'Freshly milled dhania with citrusy, mellow notes. Essential for everyday Indian cooking. 200g.', 79, 40],
];

async function main() {
  const hash = await bcrypt.hash('admin123', 10);

  const { error: userError } = await supabase.from('users').upsert(
    {
      id: ADMIN_ID,
      username: 'admin',
      password_hash: hash,
      name: 'Ganesh Spices Admin',
      role: 'admin',
    },
    { onConflict: 'username' }
  );
  if (userError) throw userError;

  const { count } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true });

  if (count === 0) {
    const rows = PRODUCTS.map(([name, category, description, price, stock]) => ({
      name,
      category,
      description,
      price,
      stock,
    }));
    const { error: productsError } = await supabase.from('products').insert(rows);
    if (productsError) throw productsError;
    console.log(`Inserted ${rows.length} products.`);
  } else {
    console.log(`Products table already has ${count} rows; skipping product seed.`);
  }

  console.log('Seed complete. Admin: admin / admin123');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
