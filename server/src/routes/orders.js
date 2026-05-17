import { Router } from 'express';
import { supabase } from '../db.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();

function mapOrder(row, items) {
  return {
    id: row.id,
    userId: row.user_id,
    total: Number(row.total),
    status: row.status,
    createdAt: row.created_at,
    shipping: {
      address: row.shipping_address,
      city: row.shipping_city,
      zip: row.shipping_zip,
    },
    items: (items || []).map((i) => ({
      productId: i.product_id,
      name: i.product_name,
      price: Number(i.unit_price),
      quantity: i.quantity,
    })),
  };
}

router.get('/', authRequired, async (req, res, next) => {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    if (!orders?.length) {
      return res.json([]);
    }

    const orderIds = orders.map((o) => o.id);
    const { data: items, error: itemsError } = await supabase
      .from('order_items')
      .select('*')
      .in('order_id', orderIds);

    if (itemsError) throw itemsError;

    const itemsByOrder = {};
    for (const item of items || []) {
      if (!itemsByOrder[item.order_id]) itemsByOrder[item.order_id] = [];
      itemsByOrder[item.order_id].push(item);
    }

    res.json(orders.map((o) => mapOrder(o, itemsByOrder[o.id])));
  } catch (err) {
    next(err);
  }
});

router.post('/', authRequired, async (req, res, next) => {
  try {
    const { items, total, shipping } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty.' });
    }
    if (!shipping?.address?.trim() || !shipping?.city?.trim() || !shipping?.zip?.trim()) {
      return res.status(400).json({ error: 'Shipping address is required.' });
    }

    const productIds = items.map((i) => i.productId);
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, price, stock')
      .in('id', productIds);

    if (productsError) throw productsError;

    const productMap = Object.fromEntries((products || []).map((p) => [p.id, p]));
    let computedTotal = 0;
    const rpcItems = [];

    for (const line of items) {
      const product = productMap[line.productId];
      if (!product) {
        return res.status(400).json({ error: `Product not found: ${line.productId}` });
      }
      const qty = parseInt(line.quantity, 10);
      if (qty < 1) {
        return res.status(400).json({ error: 'Invalid quantity.' });
      }
      if (product.stock < qty) {
        return res.status(400).json({
          error: `Insufficient stock for ${product.name}.`,
        });
      }
      const unitPrice = Number(product.price);
      computedTotal += unitPrice * qty;
      rpcItems.push({
        product_id: product.id,
        product_name: product.name,
        unit_price: unitPrice,
        quantity: qty,
      });
    }

    const orderTotal = Number(total);
    if (Math.abs(computedTotal - orderTotal) > 0.01) {
      return res.status(400).json({ error: 'Order total does not match cart.' });
    }

    const { data: orderId, error: rpcError } = await supabase.rpc('place_order', {
      p_user_id: req.user.id,
      p_total: computedTotal,
      p_address: shipping.address.trim(),
      p_city: shipping.city.trim(),
      p_zip: shipping.zip.trim(),
      p_items: rpcItems,
    });

    if (rpcError) {
      const msg = rpcError.message || 'Could not place order.';
      return res.status(400).json({ error: msg });
    }

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError) throw orderError;

    const { data: orderItems, error: itemsError } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', orderId);

    if (itemsError) throw itemsError;

    res.status(201).json(mapOrder(order, orderItems));
  } catch (err) {
    next(err);
  }
});

export default router;
