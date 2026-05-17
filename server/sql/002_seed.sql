-- Seed sample products (run after 001_schema.sql)
-- For admin user with correct bcrypt hash, run: npm run seed (from server/)

INSERT INTO products (name, category, description, price, stock) VALUES
  ('Turmeric Powder (Haldi)', 'Ground Spices', 'Bright golden turmeric, stone-ground for curries, golden milk, and marinades. 200g pack.', 149, 48),
  ('Garam Masala Blend', 'Spice Blends', 'Aromatic North Indian blend with cardamom, cinnamon, cloves, and black pepper. 150g jar.', 199, 35),
  ('Kashmiri Red Chili', 'Chilies & Peppers', 'Mild, vibrant red chilies prized for color and gentle heat. Ideal for tandoori and gravies. 100g.', 129, 22),
  ('Whole Cumin Seeds (Jeera)', 'Whole Spices', 'Earthy whole jeera for tempering dals, rice, and vegetable dishes. 250g pouch.', 89, 60),
  ('Green Cardamom Pods', 'Whole Spices', 'Premium elaichi with intense floral sweetness for sweets, chai, and biryanis. 50g.', 349, 18),
  ('Coriander Powder', 'Ground Spices', 'Freshly milled dhania with citrusy, mellow notes. Essential for everyday Indian cooking. 200g.', 79, 40)
ON CONFLICT DO NOTHING;
