-- ============================================================================
-- ReelBite Seed Data
-- Run this after creating the schema to populate with initial test data
-- NOTE: For profiles/creators, you need real auth.users first.
--       This seeds restaurants, menus, and sample data that doesn't require auth.
-- ============================================================================

-- ─── RESTAURANTS ────────────────────────────────────────────────────────────
INSERT INTO public.restaurants (id, name, slug, description, cuisine_type, price_level, phone, email, website, address_line1, address_line2, city, state, zip_code, country, latitude, longitude, operating_hours, average_rating, total_reviews, total_videos, accepts_reservations, accepts_online_orders, is_featured) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Bella Napoli', 'bella-napoli', 'Authentic Neapolitan pizza and pasta in a cozy, rustic setting. Wood-fired oven imported directly from Naples.', ARRAY['Italian', 'Pizza'], 2, '(555) 123-4567', 'info@bellanapoli.com', 'https://bellanapoli.com', '123 Main Street', NULL, 'New York', 'NY', '10001', 'US', 40.7484, -73.9967, '{"mon":{"open":"11:00","close":"22:00"},"tue":{"open":"11:00","close":"22:00"},"wed":{"open":"11:00","close":"22:00"},"thu":{"open":"11:00","close":"23:00"},"fri":{"open":"11:00","close":"23:00"},"sat":{"open":"10:00","close":"23:00"},"sun":{"open":"10:00","close":"21:00"}}', 4.7, 328, 12, TRUE, TRUE, TRUE),

  ('00000000-0000-0000-0000-000000000002', 'Sakura Sushi', 'sakura-sushi', 'Premium omakase experience with fish flown in daily from Tokyo''s Tsukiji market.', ARRAY['Japanese', 'Sushi'], 4, '(555) 234-5678', NULL, NULL, '456 Oak Avenue', 'Suite 200', 'New York', 'NY', '10002', 'US', 40.7527, -73.9772, '{"tue":{"open":"17:00","close":"22:00"},"wed":{"open":"17:00","close":"22:00"},"thu":{"open":"17:00","close":"22:00"},"fri":{"open":"17:00","close":"23:00"},"sat":{"open":"17:00","close":"23:00"},"sun":{"open":"17:00","close":"21:00"}}', 4.9, 156, 8, TRUE, FALSE, TRUE),

  ('00000000-0000-0000-0000-000000000003', 'La Cocina de Abuela', 'la-cocina-de-abuela', 'Traditional Mexican home cooking just like grandma used to make. Famous for our birria tacos.', ARRAY['Mexican'], 1, '(555) 345-6789', NULL, NULL, '789 Elm Street', NULL, 'New York', 'NY', '10003', 'US', 40.7316, -73.9897, '{"mon":{"open":"09:00","close":"21:00"},"tue":{"open":"09:00","close":"21:00"},"wed":{"open":"09:00","close":"21:00"},"thu":{"open":"09:00","close":"21:00"},"fri":{"open":"09:00","close":"22:00"},"sat":{"open":"08:00","close":"22:00"},"sun":{"open":"08:00","close":"20:00"}}', 4.5, 512, 18, FALSE, TRUE, FALSE),

  ('00000000-0000-0000-0000-000000000004', 'The Ember Room', 'the-ember-room', 'Premium steakhouse featuring dry-aged cuts and an extensive wine list in an upscale atmosphere.', ARRAY['American', 'Steakhouse'], 4, '(555) 456-7890', 'reserve@theemberroom.com', NULL, '321 Park Avenue', NULL, 'New York', 'NY', '10004', 'US', 40.7580, -73.9712, '{"mon":{"open":"17:00","close":"23:00"},"tue":{"open":"17:00","close":"23:00"},"wed":{"open":"17:00","close":"23:00"},"thu":{"open":"17:00","close":"23:00"},"fri":{"open":"17:00","close":"00:00"},"sat":{"open":"16:00","close":"00:00"},"sun":{"open":"16:00","close":"22:00"}}', 4.8, 234, 9, TRUE, FALSE, TRUE),

  ('00000000-0000-0000-0000-000000000005', 'Bangkok Garden', 'bangkok-garden', 'Authentic Thai street food experience with dishes cooked in traditional woks over high heat.', ARRAY['Thai'], 2, '(555) 567-8901', NULL, NULL, '654 Broadway', NULL, 'New York', 'NY', '10005', 'US', 40.7245, -73.9980, '{"mon":{"open":"11:30","close":"22:00"},"tue":{"open":"11:30","close":"22:00"},"wed":{"open":"11:30","close":"22:00"},"thu":{"open":"11:30","close":"22:00"},"fri":{"open":"11:30","close":"23:00"},"sat":{"open":"12:00","close":"23:00"},"sun":{"open":"12:00","close":"21:00"}}', 4.3, 445, 14, TRUE, TRUE, FALSE),

  ('00000000-0000-0000-0000-000000000006', 'Spice Route', 'spice-route', 'Northern Indian cuisine with recipes passed down through five generations. Our butter chicken is legendary.', ARRAY['Indian'], 2, '(555) 678-9012', NULL, NULL, '987 Lexington Ave', NULL, 'New York', 'NY', '10006', 'US', 40.7690, -73.9625, '{"mon":{"open":"11:00","close":"22:00"},"tue":{"open":"11:00","close":"22:00"},"wed":{"open":"11:00","close":"22:00"},"thu":{"open":"11:00","close":"22:00"},"fri":{"open":"11:00","close":"23:00"},"sat":{"open":"11:00","close":"23:00"},"sun":{"open":"12:00","close":"21:00"}}', 4.6, 389, 11, TRUE, TRUE, FALSE);

-- ─── MENU CATEGORIES (Bella Napoli) ─────────────────────────────────────────
INSERT INTO public.menu_categories (id, restaurant_id, name, sort_order) VALUES
  ('00000000-0000-0000-0001-000000000001', '00000000-0000-0000-0000-000000000001', 'Appetizers', 0),
  ('00000000-0000-0000-0001-000000000002', '00000000-0000-0000-0000-000000000001', 'Pizza', 1),
  ('00000000-0000-0000-0001-000000000003', '00000000-0000-0000-0000-000000000001', 'Pasta', 2),
  ('00000000-0000-0000-0001-000000000004', '00000000-0000-0000-0000-000000000001', 'Desserts', 3);

-- ─── MENU ITEMS (Bella Napoli) ──────────────────────────────────────────────
INSERT INTO public.menu_items (id, restaurant_id, category_id, name, description, price, tags, calories, customizations, is_popular, sort_order) VALUES
  ('00000000-0000-0000-0002-000000000001', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0001-000000000001', 'Bruschetta', 'Toasted bread with fresh tomatoes, garlic, and basil', 12.99, ARRAY['vegetarian'], 280, '[]', TRUE, 0),
  ('00000000-0000-0000-0002-000000000002', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0001-000000000001', 'Arancini', 'Crispy risotto balls stuffed with mozzarella', 14.99, ARRAY['vegetarian'], 420, '[]', FALSE, 1),
  ('00000000-0000-0000-0002-000000000003', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0001-000000000001', 'Calamari Fritti', 'Lightly fried calamari with marinara sauce', 15.99, ARRAY['seafood'], 380, '[]', TRUE, 2),
  ('00000000-0000-0000-0002-000000000004', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0001-000000000002', 'Margherita Pizza', 'San Marzano tomatoes, fresh mozzarella, basil', 18.99, ARRAY['vegetarian', 'signature'], 820, '[{"name":"Size","required":true,"options":[{"label":"10 inch","price_delta":0},{"label":"14 inch","price_delta":4},{"label":"18 inch","price_delta":8}]}]', TRUE, 0),
  ('00000000-0000-0000-0002-000000000005', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0001-000000000002', 'Diavola Pizza', 'Spicy salami, chili flakes, mozzarella', 21.99, ARRAY['spicy'], 920, '[{"name":"Size","required":true,"options":[{"label":"10 inch","price_delta":0},{"label":"14 inch","price_delta":4},{"label":"18 inch","price_delta":8}]}]', TRUE, 1),
  ('00000000-0000-0000-0002-000000000006', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0001-000000000002', 'Quattro Formaggi', 'Mozzarella, gorgonzola, fontina, parmesan', 22.99, ARRAY['vegetarian'], 950, '[]', FALSE, 2),
  ('00000000-0000-0000-0002-000000000007', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0001-000000000003', 'Cacio e Pepe', 'Classic Roman pasta with pecorino and black pepper', 19.99, ARRAY['vegetarian', 'signature'], 680, '[]', TRUE, 0),
  ('00000000-0000-0000-0002-000000000008', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0001-000000000003', 'Bolognese', 'Slow-cooked meat ragu with pappardelle', 22.99, ARRAY[]::TEXT[], 780, '[]', FALSE, 1),
  ('00000000-0000-0000-0002-000000000009', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0001-000000000004', 'Tiramisu', 'Classic Italian coffee-flavored dessert', 11.99, ARRAY['vegetarian'], 450, '[]', TRUE, 0),
  ('00000000-0000-0000-0002-000000000010', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0001-000000000004', 'Panna Cotta', 'Vanilla bean cream with berry compote', 10.99, ARRAY['vegetarian', 'gluten-free'], 320, '[]', FALSE, 1);

-- ─── MENU CATEGORIES & ITEMS (Sakura Sushi) ─────────────────────────────────
INSERT INTO public.menu_categories (id, restaurant_id, name, sort_order) VALUES
  ('00000000-0000-0000-0001-000000000005', '00000000-0000-0000-0000-000000000002', 'Nigiri', 0),
  ('00000000-0000-0000-0001-000000000006', '00000000-0000-0000-0000-000000000002', 'Rolls', 1),
  ('00000000-0000-0000-0001-000000000007', '00000000-0000-0000-0000-000000000002', 'Omakase', 2);

INSERT INTO public.menu_items (restaurant_id, category_id, name, description, price, tags, calories, customizations, is_popular, sort_order) VALUES
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0001-000000000005', 'Salmon Nigiri', 'Fresh Atlantic salmon, 2 pieces', 8.99, ARRAY['gluten-free'], 120, '[]', TRUE, 0),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0001-000000000005', 'Tuna Nigiri', 'Bluefin tuna, 2 pieces', 12.99, ARRAY['gluten-free'], 100, '[]', TRUE, 1),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0001-000000000005', 'Otoro Nigiri', 'Premium fatty tuna belly, 2 pieces', 18.99, ARRAY['gluten-free', 'premium'], 140, '[]', TRUE, 2),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0001-000000000006', 'Dragon Roll', 'Shrimp tempura, avocado, eel sauce', 16.99, ARRAY['signature'], 380, '[]', TRUE, 0),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0001-000000000006', 'Rainbow Roll', 'California roll topped with assorted sashimi', 18.99, ARRAY['signature'], 350, '[]', FALSE, 1),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0001-000000000007', 'Chef''s Omakase (12 course)', 'Seasonal selection by Chef Tanaka', 180.00, ARRAY['premium', 'signature'], NULL, '[]', TRUE, 0);

-- ─── MENU CATEGORIES & ITEMS (La Cocina de Abuela) ──────────────────────────
INSERT INTO public.menu_categories (id, restaurant_id, name, sort_order) VALUES
  ('00000000-0000-0000-0001-000000000008', '00000000-0000-0000-0000-000000000003', 'Tacos', 0),
  ('00000000-0000-0000-0001-000000000009', '00000000-0000-0000-0000-000000000003', 'Burritos', 1),
  ('00000000-0000-0000-0001-000000000010', '00000000-0000-0000-0000-000000000003', 'Sides', 2);

INSERT INTO public.menu_items (restaurant_id, category_id, name, description, price, tags, calories, customizations, is_popular, sort_order) VALUES
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0001-000000000008', 'Birria Tacos', 'Slow-braised beef in consomme, 3 tacos with dipping broth', 14.99, ARRAY['signature', 'spicy'], 520, '[{"name":"Spice Level","required":false,"options":[{"label":"Mild","price_delta":0},{"label":"Medium","price_delta":0},{"label":"Hot","price_delta":0}]}]', TRUE, 0),
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0001-000000000008', 'Carnitas Tacos', 'Crispy pulled pork, 3 tacos', 12.99, ARRAY[]::TEXT[], 480, '[]', TRUE, 1),
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0001-000000000008', 'Al Pastor Tacos', 'Marinated pork with pineapple, 3 tacos', 13.99, ARRAY['spicy'], 460, '[]', FALSE, 2),
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0001-000000000009', 'Carne Asada Burrito', 'Grilled steak, rice, beans, pico de gallo', 13.99, ARRAY[]::TEXT[], 780, '[]', TRUE, 0),
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0001-000000000010', 'Elote', 'Mexican street corn with cotija cheese', 5.99, ARRAY['vegetarian'], 220, '[]', TRUE, 0),
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0001-000000000010', 'Guacamole & Chips', 'Fresh-made guacamole with house tortilla chips', 8.99, ARRAY['vegetarian', 'vegan', 'gluten-free'], 340, '[]', FALSE, 1);

-- ─── MENU CATEGORIES & ITEMS (The Ember Room) ──────────────────────────────
INSERT INTO public.menu_categories (id, restaurant_id, name, sort_order) VALUES
  ('00000000-0000-0000-0001-000000000011', '00000000-0000-0000-0000-000000000004', 'Steaks', 0),
  ('00000000-0000-0000-0001-000000000012', '00000000-0000-0000-0000-000000000004', 'Sides', 1),
  ('00000000-0000-0000-0001-000000000013', '00000000-0000-0000-0000-000000000004', 'Desserts', 2);

INSERT INTO public.menu_items (restaurant_id, category_id, name, description, price, tags, calories, customizations, is_popular, sort_order) VALUES
  ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0001-000000000011', 'Dry-Aged Ribeye', '16oz dry-aged 45 days, truffle butter', 62.99, ARRAY['signature', 'gluten-free'], 980, '[{"name":"Temperature","required":true,"options":[{"label":"Rare","price_delta":0},{"label":"Medium Rare","price_delta":0},{"label":"Medium","price_delta":0},{"label":"Medium Well","price_delta":0},{"label":"Well Done","price_delta":0}]}]', TRUE, 0),
  ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0001-000000000011', 'Wagyu A5 Strip', '8oz imported Japanese wagyu', 120.00, ARRAY['premium', 'gluten-free'], 720, '[]', TRUE, 1),
  ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0001-000000000011', 'Filet Mignon', '10oz center cut, peppercorn sauce', 54.99, ARRAY['gluten-free'], 680, '[]', TRUE, 2),
  ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0001-000000000012', 'Truffle Mac & Cheese', 'Black truffle, gruyere, aged cheddar', 16.99, ARRAY['vegetarian'], 520, '[]', TRUE, 0),
  ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0001-000000000012', 'Creamed Spinach', 'Classic steakhouse style', 12.99, ARRAY['vegetarian', 'gluten-free'], 280, '[]', FALSE, 1),
  ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0001-000000000013', 'Chocolate Lava Cake', 'Warm molten center, vanilla ice cream', 14.99, ARRAY['vegetarian'], 580, '[]', TRUE, 0);

-- ─── MENU CATEGORIES & ITEMS (Bangkok Garden) ──────────────────────────────
INSERT INTO public.menu_categories (id, restaurant_id, name, sort_order) VALUES
  ('00000000-0000-0000-0001-000000000014', '00000000-0000-0000-0000-000000000005', 'Noodles', 0),
  ('00000000-0000-0000-0001-000000000015', '00000000-0000-0000-0000-000000000005', 'Curries', 1),
  ('00000000-0000-0000-0001-000000000016', '00000000-0000-0000-0000-000000000005', 'Starters', 2);

INSERT INTO public.menu_items (restaurant_id, category_id, name, description, price, tags, calories, customizations, is_popular, sort_order) VALUES
  ('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0001-000000000014', 'Pad Thai', 'Classic stir-fried rice noodles with shrimp', 15.99, ARRAY['signature'], 620, '[{"name":"Spice Level","required":false,"options":[{"label":"Mild","price_delta":0},{"label":"Medium","price_delta":0},{"label":"Spicy","price_delta":0},{"label":"Thai Hot","price_delta":0}]}]', TRUE, 0),
  ('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0001-000000000014', 'Drunken Noodles', 'Spicy flat noodles with basil and vegetables', 14.99, ARRAY['spicy'], 580, '[]', TRUE, 1),
  ('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0001-000000000015', 'Green Curry', 'Coconut milk, bamboo shoots, Thai basil', 16.99, ARRAY['spicy', 'gluten-free'], 480, '[]', TRUE, 0),
  ('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0001-000000000015', 'Massaman Curry', 'Rich peanut curry with potatoes', 17.99, ARRAY['gluten-free'], 520, '[]', FALSE, 1),
  ('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0001-000000000016', 'Spring Rolls', 'Crispy vegetable spring rolls, 4 pieces', 8.99, ARRAY['vegan'], 280, '[]', FALSE, 0),
  ('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0001-000000000016', 'Tom Yum Soup', 'Spicy lemongrass soup with shrimp', 12.99, ARRAY['spicy', 'gluten-free'], 180, '[]', TRUE, 1);

-- ─── MENU CATEGORIES & ITEMS (Spice Route) ─────────────────────────────────
INSERT INTO public.menu_categories (id, restaurant_id, name, sort_order) VALUES
  ('00000000-0000-0000-0001-000000000017', '00000000-0000-0000-0000-000000000006', 'Curries', 0),
  ('00000000-0000-0000-0001-000000000018', '00000000-0000-0000-0000-000000000006', 'Tandoori', 1),
  ('00000000-0000-0000-0001-000000000019', '00000000-0000-0000-0000-000000000006', 'Breads', 2);

INSERT INTO public.menu_items (restaurant_id, category_id, name, description, price, tags, calories, customizations, is_popular, sort_order) VALUES
  ('00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0001-000000000017', 'Butter Chicken', 'Creamy tomato sauce, tender chicken tikka', 17.99, ARRAY['signature'], 520, '[{"name":"Spice Level","required":false,"options":[{"label":"Mild","price_delta":0},{"label":"Medium","price_delta":0},{"label":"Hot","price_delta":0},{"label":"Extra Hot","price_delta":0}]}]', TRUE, 0),
  ('00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0001-000000000017', 'Palak Paneer', 'Spinach curry with homemade cheese', 15.99, ARRAY['vegetarian'], 380, '[]', TRUE, 1),
  ('00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0001-000000000017', 'Lamb Rogan Josh', 'Kashmiri-style braised lamb', 19.99, ARRAY['spicy'], 580, '[]', FALSE, 2),
  ('00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0001-000000000018', 'Tandoori Chicken', 'Half chicken marinated in yogurt and spices', 16.99, ARRAY['gluten-free'], 440, '[]', TRUE, 0),
  ('00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0001-000000000019', 'Garlic Naan', 'Fresh-baked with roasted garlic', 4.99, ARRAY['vegetarian'], 260, '[]', TRUE, 0),
  ('00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0001-000000000019', 'Cheese Naan', 'Stuffed with mozzarella and cheddar', 5.99, ARRAY['vegetarian'], 340, '[]', FALSE, 1);
