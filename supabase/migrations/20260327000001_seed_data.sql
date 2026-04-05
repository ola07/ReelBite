-- ============================================================================
-- ReelBite Seed Data
-- Populates the database with sample restaurants, creators, videos, etc.
-- ============================================================================

-- ─── Clean up any existing data (order matters due to FK constraints) ─────────
DELETE FROM public.reviews WHERE restaurant_id IN (SELECT id FROM public.restaurants);
DELETE FROM public.order_items WHERE order_id IN (SELECT id FROM public.orders);
DELETE FROM public.orders WHERE restaurant_id IN (SELECT id FROM public.restaurants);
DELETE FROM public.reservations WHERE restaurant_id IN (SELECT id FROM public.restaurants);
DELETE FROM public.comments WHERE video_id IN (SELECT id FROM public.videos);
DELETE FROM public.likes WHERE video_id IN (SELECT id FROM public.videos);
DELETE FROM public.bookmarks WHERE video_id IN (SELECT id FROM public.videos);
DELETE FROM public.videos;
DELETE FROM public.menu_items;
DELETE FROM public.menu_categories;
DELETE FROM public.restaurants;
DELETE FROM public.follows;
DELETE FROM public.creators;
-- Don't delete profiles of real users, only seed users
DELETE FROM public.profiles WHERE id IN (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000003',
  '00000000-0000-0000-0000-000000000004',
  '00000000-0000-0000-0000-000000000011',
  '00000000-0000-0000-0000-000000000012',
  '00000000-0000-0000-0000-000000000013'
);
DELETE FROM auth.identities WHERE user_id IN (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000003',
  '00000000-0000-0000-0000-000000000004',
  '00000000-0000-0000-0000-000000000011',
  '00000000-0000-0000-0000-000000000012',
  '00000000-0000-0000-0000-000000000013'
);
DELETE FROM auth.users WHERE id IN (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000003',
  '00000000-0000-0000-0000-000000000004',
  '00000000-0000-0000-0000-000000000011',
  '00000000-0000-0000-0000-000000000012',
  '00000000-0000-0000-0000-000000000013'
);

-- ─── Create seed auth users first (profiles FK references auth.users) ─────────
-- The handle_new_user trigger will auto-create profiles, but we'll update them after
-- Using pre-hashed bcrypt password for 'password123'

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at, confirmation_token, recovery_token)
VALUES
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'sarah@reelbite.test', '$2a$10$PznUGt4dsNBCmBCU36hMOeKxPwT9tMovzFLHBp/LrRFj7cCJPKlaW', NOW(), '{"username":"foodie_sarah","display_name":"Sarah Chen"}'::jsonb, NOW(), NOW(), '', ''),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'mike@reelbite.test', '$2a$10$PznUGt4dsNBCmBCU36hMOeKxPwT9tMovzFLHBp/LrRFj7cCJPKlaW', NOW(), '{"username":"tasty_mike","display_name":"Mike Johnson"}'::jsonb, NOW(), NOW(), '', ''),
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'ana@reelbite.test', '$2a$10$PznUGt4dsNBCmBCU36hMOeKxPwT9tMovzFLHBp/LrRFj7cCJPKlaW', NOW(), '{"username":"eat_with_ana","display_name":"Ana Rodriguez"}'::jsonb, NOW(), NOW(), '', ''),
  ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'jay@reelbite.test', '$2a$10$PznUGt4dsNBCmBCU36hMOeKxPwT9tMovzFLHBp/LrRFj7cCJPKlaW', NOW(), '{"username":"bites_by_jay","display_name":"Jay Patel"}'::jsonb, NOW(), NOW(), '', ''),
  ('00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'alex@reelbite.test', '$2a$10$PznUGt4dsNBCmBCU36hMOeKxPwT9tMovzFLHBp/LrRFj7cCJPKlaW', NOW(), '{"username":"pizza_lover","display_name":"Alex Kim"}'::jsonb, NOW(), NOW(), '', ''),
  ('00000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'jordan@reelbite.test', '$2a$10$PznUGt4dsNBCmBCU36hMOeKxPwT9tMovzFLHBp/LrRFj7cCJPKlaW', NOW(), '{"username":"foodie99","display_name":"Jordan Lee"}'::jsonb, NOW(), NOW(), '', ''),
  ('00000000-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'riley@reelbite.test', '$2a$10$PznUGt4dsNBCmBCU36hMOeKxPwT9tMovzFLHBp/LrRFj7cCJPKlaW', NOW(), '{"username":"date_night_pro","display_name":"Riley Martinez"}'::jsonb, NOW(), NOW(), '', '')
ON CONFLICT (id) DO NOTHING;

-- Also insert into auth.identities (required for Supabase auth to work)
INSERT INTO auth.identities (id, user_id, provider_id, provider, identity_data, last_sign_in_at, created_at, updated_at)
VALUES
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'email', '{"sub":"00000000-0000-0000-0000-000000000001","email":"sarah@reelbite.test"}'::jsonb, NOW(), NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'email', '{"sub":"00000000-0000-0000-0000-000000000002","email":"mike@reelbite.test"}'::jsonb, NOW(), NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003', 'email', '{"sub":"00000000-0000-0000-0000-000000000003","email":"ana@reelbite.test"}'::jsonb, NOW(), NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000004', 'email', '{"sub":"00000000-0000-0000-0000-000000000004","email":"jay@reelbite.test"}'::jsonb, NOW(), NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000011', 'email', '{"sub":"00000000-0000-0000-0000-000000000011","email":"alex@reelbite.test"}'::jsonb, NOW(), NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000012', 'email', '{"sub":"00000000-0000-0000-0000-000000000012","email":"jordan@reelbite.test"}'::jsonb, NOW(), NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000013', 'email', '{"sub":"00000000-0000-0000-0000-000000000013","email":"riley@reelbite.test"}'::jsonb, NOW(), NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- The handle_new_user trigger already created profiles, now update them with extra data
UPDATE public.profiles SET bio = 'NYC food explorer | 500+ restaurants reviewed', is_creator = TRUE WHERE id = '00000000-0000-0000-0000-000000000001';
UPDATE public.profiles SET bio = 'Food photographer & video creator', is_creator = TRUE WHERE id = '00000000-0000-0000-0000-000000000002';
UPDATE public.profiles SET bio = 'Mexican food enthusiast | Taco connoisseur', is_creator = TRUE WHERE id = '00000000-0000-0000-0000-000000000003';
UPDATE public.profiles SET bio = 'Street food lover | Asian cuisine specialist', is_creator = TRUE WHERE id = '00000000-0000-0000-0000-000000000004';

-- ─── Creators ─────────────────────────────────────────────────────────────────
INSERT INTO public.creators (id, bio, total_followers, total_likes, total_videos, is_verified, created_at, updated_at) VALUES
  ('00000000-0000-0000-0000-000000000001', 'NYC food explorer | 500+ restaurants reviewed | Helping you find the best bites in the city', 125000, 890000, 245, TRUE, NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000002', 'Food photographer & video creator | Always hunting for the next great meal', 89000, 560000, 178, TRUE, NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000003', 'Mexican food enthusiast | Taco connoisseur | Supporting local restaurants', 45000, 320000, 92, FALSE, NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000004', 'Street food lover | Asian cuisine specialist | Eat with me!', 32000, 210000, 67, FALSE, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ─── Restaurants ──────────────────────────────────────────────────────────────
INSERT INTO public.restaurants (id, owner_id, name, slug, description, cuisine_type, price_level, phone, email, website, address_line1, address_line2, city, state, zip_code, country, latitude, longitude, operating_hours, cover_image_url, cover_video_url, gallery_urls, average_rating, total_reviews, total_videos, accepts_reservations, accepts_online_orders, is_featured, is_active, created_at, updated_at) VALUES
  (
    '10000000-0000-0000-0000-000000000001', NULL, 'Bella Napoli', 'bella-napoli',
    'Authentic Neapolitan pizza and pasta in a cozy, rustic setting. Wood-fired oven imported directly from Naples.',
    ARRAY['Italian', 'Pizza'], 2, '(555) 123-4567', 'info@bellanapoli.com', 'https://bellanapoli.com',
    '123 Main Street', NULL, 'New York', 'NY', '10001', 'US',
    40.7484, -73.9967,
    '{"mon":{"open":"11:00","close":"22:00"},"tue":{"open":"11:00","close":"22:00"},"wed":{"open":"11:00","close":"22:00"},"thu":{"open":"11:00","close":"23:00"},"fri":{"open":"11:00","close":"23:00"},"sat":{"open":"10:00","close":"23:00"},"sun":{"open":"10:00","close":"21:00"}}'::jsonb,
    NULL, NULL, '{}',
    4.7, 3, 12, TRUE, TRUE, TRUE, TRUE,
    '2025-01-15T00:00:00Z', NOW()
  ),
  (
    '10000000-0000-0000-0000-000000000002', NULL, 'Sakura Sushi', 'sakura-sushi',
    'Premium omakase experience with fish flown in daily from Tokyo''s Tsukiji market.',
    ARRAY['Japanese', 'Sushi'], 4, '(555) 234-5678', NULL, NULL,
    '456 Oak Avenue', 'Suite 200', 'New York', 'NY', '10002', 'US',
    40.7527, -73.9772,
    '{"tue":{"open":"17:00","close":"22:00"},"wed":{"open":"17:00","close":"22:00"},"thu":{"open":"17:00","close":"22:00"},"fri":{"open":"17:00","close":"23:00"},"sat":{"open":"17:00","close":"23:00"},"sun":{"open":"17:00","close":"21:00"}}'::jsonb,
    NULL, NULL, '{}',
    4.9, 0, 8, TRUE, FALSE, TRUE, TRUE,
    '2025-02-01T00:00:00Z', NOW()
  ),
  (
    '10000000-0000-0000-0000-000000000003', NULL, 'La Cocina de Abuela', 'la-cocina-de-abuela',
    'Traditional Mexican home cooking just like grandma used to make. Famous for our birria tacos.',
    ARRAY['Mexican'], 1, '(555) 345-6789', NULL, NULL,
    '789 Elm Street', NULL, 'New York', 'NY', '10003', 'US',
    40.7316, -73.9897,
    '{"mon":{"open":"09:00","close":"21:00"},"tue":{"open":"09:00","close":"21:00"},"wed":{"open":"09:00","close":"21:00"},"thu":{"open":"09:00","close":"21:00"},"fri":{"open":"09:00","close":"22:00"},"sat":{"open":"08:00","close":"22:00"},"sun":{"open":"08:00","close":"20:00"}}'::jsonb,
    NULL, NULL, '{}',
    4.5, 0, 18, FALSE, TRUE, FALSE, TRUE,
    '2025-03-01T00:00:00Z', NOW()
  ),
  (
    '10000000-0000-0000-0000-000000000004', NULL, 'The Ember Room', 'the-ember-room',
    'Premium steakhouse featuring dry-aged cuts and an extensive wine list in an upscale atmosphere.',
    ARRAY['American', 'Steakhouse'], 4, '(555) 456-7890', 'reserve@theemberroom.com', NULL,
    '321 Park Avenue', NULL, 'New York', 'NY', '10004', 'US',
    40.7580, -73.9712,
    '{"mon":{"open":"17:00","close":"23:00"},"tue":{"open":"17:00","close":"23:00"},"wed":{"open":"17:00","close":"23:00"},"thu":{"open":"17:00","close":"23:00"},"fri":{"open":"17:00","close":"00:00"},"sat":{"open":"16:00","close":"00:00"},"sun":{"open":"16:00","close":"22:00"}}'::jsonb,
    NULL, NULL, '{}',
    4.8, 0, 9, TRUE, FALSE, TRUE, TRUE,
    '2025-01-20T00:00:00Z', NOW()
  ),
  (
    '10000000-0000-0000-0000-000000000005', NULL, 'Bangkok Garden', 'bangkok-garden',
    'Authentic Thai street food experience with dishes cooked in traditional woks over high heat.',
    ARRAY['Thai'], 2, '(555) 567-8901', NULL, NULL,
    '654 Broadway', NULL, 'New York', 'NY', '10005', 'US',
    40.7245, -73.9980,
    '{"mon":{"open":"11:30","close":"22:00"},"tue":{"open":"11:30","close":"22:00"},"wed":{"open":"11:30","close":"22:00"},"thu":{"open":"11:30","close":"22:00"},"fri":{"open":"11:30","close":"23:00"},"sat":{"open":"12:00","close":"23:00"},"sun":{"open":"12:00","close":"21:00"}}'::jsonb,
    NULL, NULL, '{}',
    4.3, 0, 14, TRUE, TRUE, FALSE, TRUE,
    '2025-04-01T00:00:00Z', NOW()
  ),
  (
    '10000000-0000-0000-0000-000000000006', NULL, 'Spice Route', 'spice-route',
    'Northern Indian cuisine with recipes passed down through five generations. Our butter chicken is legendary.',
    ARRAY['Indian'], 2, '(555) 678-9012', NULL, NULL,
    '987 Lexington Ave', NULL, 'New York', 'NY', '10006', 'US',
    40.7690, -73.9625,
    '{"mon":{"open":"11:00","close":"22:00"},"tue":{"open":"11:00","close":"22:00"},"wed":{"open":"11:00","close":"22:00"},"thu":{"open":"11:00","close":"22:00"},"fri":{"open":"11:00","close":"23:00"},"sat":{"open":"11:00","close":"23:00"},"sun":{"open":"12:00","close":"21:00"}}'::jsonb,
    NULL, NULL, '{}',
    4.6, 0, 11, TRUE, TRUE, FALSE, TRUE,
    '2025-05-01T00:00:00Z', NOW()
  )
ON CONFLICT (id) DO NOTHING;

-- ─── Menu Categories (Bella Napoli) ───────────────────────────────────────────
INSERT INTO public.menu_categories (id, restaurant_id, name, description, sort_order, is_active) VALUES
  ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Appetizers', NULL, 0, TRUE),
  ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'Pizza', NULL, 1, TRUE),
  ('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', 'Pasta', NULL, 2, TRUE),
  ('20000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000001', 'Desserts', NULL, 3, TRUE),
  -- Sakura Sushi categories
  ('20000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000002', 'Nigiri', NULL, 0, TRUE),
  ('20000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000002', 'Rolls', NULL, 1, TRUE),
  ('20000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000002', 'Omakase', NULL, 2, TRUE),
  -- La Cocina de Abuela categories
  ('20000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000003', 'Tacos', NULL, 0, TRUE),
  ('20000000-0000-0000-0000-000000000009', '10000000-0000-0000-0000-000000000003', 'Burritos', NULL, 1, TRUE),
  ('20000000-0000-0000-0000-000000000010', '10000000-0000-0000-0000-000000000003', 'Sides', NULL, 2, TRUE),
  -- The Ember Room categories
  ('20000000-0000-0000-0000-000000000011', '10000000-0000-0000-0000-000000000004', 'Starters', NULL, 0, TRUE),
  ('20000000-0000-0000-0000-000000000012', '10000000-0000-0000-0000-000000000004', 'Steaks', NULL, 1, TRUE),
  ('20000000-0000-0000-0000-000000000013', '10000000-0000-0000-0000-000000000004', 'Sides', NULL, 2, TRUE),
  -- Bangkok Garden categories
  ('20000000-0000-0000-0000-000000000014', '10000000-0000-0000-0000-000000000005', 'Starters', NULL, 0, TRUE),
  ('20000000-0000-0000-0000-000000000015', '10000000-0000-0000-0000-000000000005', 'Noodles', NULL, 1, TRUE),
  ('20000000-0000-0000-0000-000000000016', '10000000-0000-0000-0000-000000000005', 'Curries', NULL, 2, TRUE),
  -- Spice Route categories
  ('20000000-0000-0000-0000-000000000017', '10000000-0000-0000-0000-000000000006', 'Starters', NULL, 0, TRUE),
  ('20000000-0000-0000-0000-000000000018', '10000000-0000-0000-0000-000000000006', 'Mains', NULL, 1, TRUE),
  ('20000000-0000-0000-0000-000000000019', '10000000-0000-0000-0000-000000000006', 'Breads', NULL, 2, TRUE)
ON CONFLICT (id) DO NOTHING;

-- ─── Menu Items ───────────────────────────────────────────────────────────────

-- Bella Napoli
INSERT INTO public.menu_items (id, restaurant_id, category_id, name, description, price, image_url, tags, calories, customizations, is_popular, is_available, sort_order) VALUES
  ('30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'Bruschetta', 'Toasted bread with fresh tomatoes, garlic, and basil', 12.99, NULL, ARRAY['vegetarian'], 280, '[]'::jsonb, TRUE, TRUE, 0),
  ('30000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'Arancini', 'Crispy risotto balls stuffed with mozzarella', 14.99, NULL, ARRAY['vegetarian'], 420, '[]'::jsonb, FALSE, TRUE, 1),
  ('30000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'Calamari Fritti', 'Lightly fried calamari with marinara sauce', 15.99, NULL, ARRAY['seafood'], 380, '[]'::jsonb, TRUE, TRUE, 2),
  ('30000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000002', 'Margherita Pizza', 'San Marzano tomatoes, fresh mozzarella, basil', 18.99, NULL, ARRAY['vegetarian', 'signature'], 820, '[{"name":"Size","required":true,"options":[{"label":"10 inch","price_delta":0},{"label":"14 inch","price_delta":4},{"label":"18 inch","price_delta":8}]}]'::jsonb, TRUE, TRUE, 0),
  ('30000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000002', 'Diavola Pizza', 'Spicy salami, chili flakes, mozzarella', 21.99, NULL, ARRAY['spicy'], 920, '[{"name":"Size","required":true,"options":[{"label":"10 inch","price_delta":0},{"label":"14 inch","price_delta":4},{"label":"18 inch","price_delta":8}]}]'::jsonb, TRUE, TRUE, 1),
  ('30000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000002', 'Quattro Formaggi', 'Mozzarella, gorgonzola, fontina, parmesan', 22.99, NULL, ARRAY['vegetarian'], 950, '[]'::jsonb, FALSE, TRUE, 2),
  ('30000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000003', 'Cacio e Pepe', 'Classic Roman pasta with pecorino and black pepper', 19.99, NULL, ARRAY['vegetarian', 'signature'], 680, '[]'::jsonb, TRUE, TRUE, 0),
  ('30000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000003', 'Bolognese', 'Slow-cooked meat ragu with pappardelle', 22.99, NULL, ARRAY[]::text[], 780, '[]'::jsonb, FALSE, TRUE, 1),
  ('30000000-0000-0000-0000-000000000009', '10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000004', 'Tiramisu', 'Classic Italian coffee-flavored dessert', 11.99, NULL, ARRAY['vegetarian'], 450, '[]'::jsonb, TRUE, TRUE, 0),
  ('30000000-0000-0000-0000-000000000010', '10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000004', 'Panna Cotta', 'Vanilla bean cream with berry compote', 10.99, NULL, ARRAY['vegetarian', 'gluten-free'], 320, '[]'::jsonb, FALSE, TRUE, 1),

  -- Sakura Sushi
  ('30000000-0000-0000-0000-000000000011', '10000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000005', 'Salmon Nigiri', 'Fresh Atlantic salmon, 2 pieces', 8.99, NULL, ARRAY['gluten-free'], 120, '[]'::jsonb, TRUE, TRUE, 0),
  ('30000000-0000-0000-0000-000000000012', '10000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000005', 'Toro Nigiri', 'Fatty tuna belly, 2 pieces', 14.99, NULL, ARRAY['gluten-free', 'signature'], 140, '[]'::jsonb, TRUE, TRUE, 1),
  ('30000000-0000-0000-0000-000000000013', '10000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000006', 'Dragon Roll', 'Eel, avocado, cucumber, unagi sauce', 18.99, NULL, ARRAY[]::text[], 380, '[]'::jsonb, TRUE, TRUE, 0),
  ('30000000-0000-0000-0000-000000000014', '10000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000006', 'Rainbow Roll', 'Assorted fish over California roll', 22.99, NULL, ARRAY['signature'], 350, '[]'::jsonb, TRUE, TRUE, 1),
  ('30000000-0000-0000-0000-000000000015', '10000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000007', 'Chef''s Omakase (12 course)', 'Seasonal selection by Chef Tanaka', 180.00, NULL, ARRAY['signature'], 900, '[]'::jsonb, TRUE, TRUE, 0),

  -- La Cocina de Abuela
  ('30000000-0000-0000-0000-000000000016', '10000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000008', 'Birria Tacos', 'Slow-braised beef with consomme dip, 3 pieces', 14.99, NULL, ARRAY['spicy', 'signature'], 620, '[]'::jsonb, TRUE, TRUE, 0),
  ('30000000-0000-0000-0000-000000000017', '10000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000008', 'Al Pastor Tacos', 'Marinated pork with pineapple, 3 pieces', 12.99, NULL, ARRAY[]::text[], 540, '[]'::jsonb, TRUE, TRUE, 1),
  ('30000000-0000-0000-0000-000000000018', '10000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000008', 'Carnitas Tacos', 'Crispy pulled pork, 3 pieces', 12.99, NULL, ARRAY[]::text[], 580, '[]'::jsonb, FALSE, TRUE, 2),
  ('30000000-0000-0000-0000-000000000019', '10000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000009', 'Carne Asada Burrito', 'Grilled steak, rice, beans, pico de gallo', 15.99, NULL, ARRAY[]::text[], 890, '[]'::jsonb, TRUE, TRUE, 0),
  ('30000000-0000-0000-0000-000000000020', '10000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000010', 'Elote', 'Mexican street corn with mayo, cotija, chili', 6.99, NULL, ARRAY['vegetarian'], 320, '[]'::jsonb, TRUE, TRUE, 0),

  -- The Ember Room
  ('30000000-0000-0000-0000-000000000021', '10000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000011', 'Bone Marrow', 'Roasted bone marrow with herb gremolata', 18.99, NULL, ARRAY[]::text[], 420, '[]'::jsonb, TRUE, TRUE, 0),
  ('30000000-0000-0000-0000-000000000022', '10000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000011', 'Wedge Salad', 'Iceberg, blue cheese, bacon, tomatoes', 14.99, NULL, ARRAY['gluten-free'], 380, '[]'::jsonb, FALSE, TRUE, 1),
  ('30000000-0000-0000-0000-000000000023', '10000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000012', 'Dry-Aged Ribeye', '16oz, 45-day dry-aged, truffle butter', 68.99, NULL, ARRAY['signature', 'gluten-free', 'keto'], 1100, '[{"name":"Temperature","required":true,"options":[{"label":"Rare","price_delta":0},{"label":"Medium Rare","price_delta":0},{"label":"Medium","price_delta":0},{"label":"Medium Well","price_delta":0},{"label":"Well Done","price_delta":0}]}]'::jsonb, TRUE, TRUE, 0),
  ('30000000-0000-0000-0000-000000000024', '10000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000012', 'Filet Mignon', '8oz center-cut, peppercorn sauce', 58.99, NULL, ARRAY['gluten-free', 'keto'], 680, '[{"name":"Temperature","required":true,"options":[{"label":"Rare","price_delta":0},{"label":"Medium Rare","price_delta":0},{"label":"Medium","price_delta":0},{"label":"Medium Well","price_delta":0},{"label":"Well Done","price_delta":0}]}]'::jsonb, TRUE, TRUE, 1),
  ('30000000-0000-0000-0000-000000000025', '10000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000013', 'Truffle Mac & Cheese', 'Three-cheese blend with black truffle', 16.99, NULL, ARRAY['vegetarian'], 650, '[]'::jsonb, TRUE, TRUE, 0),

  -- Bangkok Garden
  ('30000000-0000-0000-0000-000000000026', '10000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000014', 'Spring Rolls', 'Crispy vegetable spring rolls, 4 pieces', 8.99, NULL, ARRAY['vegan'], 280, '[]'::jsonb, TRUE, TRUE, 0),
  ('30000000-0000-0000-0000-000000000027', '10000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000014', 'Tom Yum Soup', 'Spicy & sour shrimp soup with lemongrass', 12.99, NULL, ARRAY['spicy', 'gluten-free'], 180, '[]'::jsonb, TRUE, TRUE, 1),
  ('30000000-0000-0000-0000-000000000028', '10000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000015', 'Pad Thai', 'Classic stir-fried rice noodles with shrimp', 16.99, NULL, ARRAY['signature', 'gluten-free'], 620, '[{"name":"Spice Level","required":true,"options":[{"label":"Mild","price_delta":0},{"label":"Medium","price_delta":0},{"label":"Spicy","price_delta":0},{"label":"Thai Spicy","price_delta":0}]}]'::jsonb, TRUE, TRUE, 0),
  ('30000000-0000-0000-0000-000000000029', '10000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000015', 'Drunken Noodles', 'Flat noodles with basil, chili, and vegetables', 15.99, NULL, ARRAY['spicy'], 580, '[]'::jsonb, FALSE, TRUE, 1),
  ('30000000-0000-0000-0000-000000000030', '10000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000016', 'Green Curry', 'Coconut green curry with chicken and Thai basil', 17.99, NULL, ARRAY['spicy', 'gluten-free'], 520, '[]'::jsonb, TRUE, TRUE, 0),

  -- Spice Route
  ('30000000-0000-0000-0000-000000000031', '10000000-0000-0000-0000-000000000006', '20000000-0000-0000-0000-000000000017', 'Samosa', 'Crispy pastry filled with spiced potatoes, 3 pieces', 9.99, NULL, ARRAY['vegetarian', 'vegan'], 360, '[]'::jsonb, TRUE, TRUE, 0),
  ('30000000-0000-0000-0000-000000000032', '10000000-0000-0000-0000-000000000006', '20000000-0000-0000-0000-000000000017', 'Paneer Tikka', 'Grilled cottage cheese with spiced yogurt marinade', 13.99, NULL, ARRAY['vegetarian', 'gluten-free'], 340, '[]'::jsonb, TRUE, TRUE, 1),
  ('30000000-0000-0000-0000-000000000033', '10000000-0000-0000-0000-000000000006', '20000000-0000-0000-0000-000000000018', 'Butter Chicken', 'Creamy tomato sauce with tender chicken', 18.99, NULL, ARRAY['signature', 'gluten-free', 'halal'], 580, '[{"name":"Spice Level","required":true,"options":[{"label":"Mild","price_delta":0},{"label":"Medium","price_delta":0},{"label":"Spicy","price_delta":0}]}]'::jsonb, TRUE, TRUE, 0),
  ('30000000-0000-0000-0000-000000000034', '10000000-0000-0000-0000-000000000006', '20000000-0000-0000-0000-000000000018', 'Lamb Rogan Josh', 'Slow-cooked lamb in aromatic Kashmiri spices', 22.99, NULL, ARRAY['spicy', 'gluten-free', 'halal'], 620, '[]'::jsonb, TRUE, TRUE, 1),
  ('30000000-0000-0000-0000-000000000035', '10000000-0000-0000-0000-000000000006', '20000000-0000-0000-0000-000000000018', 'Palak Paneer', 'Spinach and cottage cheese in creamy sauce', 16.99, NULL, ARRAY['vegetarian', 'gluten-free'], 420, '[]'::jsonb, FALSE, TRUE, 2),
  ('30000000-0000-0000-0000-000000000036', '10000000-0000-0000-0000-000000000006', '20000000-0000-0000-0000-000000000019', 'Garlic Naan', 'Freshly baked with garlic butter', 4.99, NULL, ARRAY['vegetarian'], 280, '[]'::jsonb, TRUE, TRUE, 0),
  ('30000000-0000-0000-0000-000000000037', '10000000-0000-0000-0000-000000000006', '20000000-0000-0000-0000-000000000019', 'Cheese Naan', 'Stuffed with melted cheese blend', 5.99, NULL, ARRAY['vegetarian'], 350, '[]'::jsonb, FALSE, TRUE, 1)
ON CONFLICT (id) DO NOTHING;

-- ─── Videos ───────────────────────────────────────────────────────────────────
INSERT INTO public.videos (id, creator_id, restaurant_id, title, description, video_url, thumbnail_url, duration_seconds, aspect_ratio, tags, dish_name, view_count, like_count, comment_count, share_count, bookmark_count, engagement_score, is_active, created_at, updated_at) VALUES
  (
    '40000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    'Best Margherita in Town',
    'This pizza is absolutely incredible. Fresh mozzarella, San Marzano tomatoes, and the crispiest crust you''ve ever seen!',
    'https://assets.mixkit.co/videos/44001/44001-720.mp4',
    NULL, 15, '9:16',
    ARRAY['pizza', 'italian', 'margherita'], 'Margherita Pizza',
    125400, 8920, 342, 567, 1205, 95.50, TRUE,
    '2026-03-10T12:00:00Z', '2026-03-10T12:00:00Z'
  ),
  (
    '40000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000002',
    '10000000-0000-0000-0000-000000000002',
    'Omakase Experience',
    '12-course omakase that blew my mind. Each piece of sushi was a work of art.',
    'https://assets.mixkit.co/videos/32518/32518-720.mp4',
    NULL, 22, '9:16',
    ARRAY['sushi', 'japanese', 'omakase'], 'Chef''s Omakase',
    89300, 6540, 218, 890, 2340, 88.20, TRUE,
    '2026-03-09T18:00:00Z', '2026-03-09T18:00:00Z'
  ),
  (
    '40000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000003',
    '10000000-0000-0000-0000-000000000003',
    'Spicy Birria Tacos',
    'These birria tacos are dripping with consomme and cheese. The crunch is unreal!',
    'https://assets.mixkit.co/videos/42474/42474-720.mp4',
    NULL, 18, '9:16',
    ARRAY['tacos', 'mexican', 'birria', 'spicy'], 'Birria Tacos',
    203000, 15200, 892, 2100, 4500, 97.10, TRUE,
    '2026-03-08T20:00:00Z', '2026-03-08T20:00:00Z'
  ),
  (
    '40000000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000004',
    'Truffle Butter Steak',
    'Dry-aged ribeye with truffle butter. This steakhouse does NOT miss.',
    'https://assets.mixkit.co/videos/45729/45729-720.mp4',
    NULL, 20, '9:16',
    ARRAY['steak', 'american', 'truffle'], 'Dry-Aged Ribeye',
    156000, 11200, 567, 1340, 3200, 92.40, TRUE,
    '2026-03-07T15:00:00Z', '2026-03-07T15:00:00Z'
  ),
  (
    '40000000-0000-0000-0000-000000000005',
    '00000000-0000-0000-0000-000000000004',
    '10000000-0000-0000-0000-000000000005',
    'Pad Thai Street Style',
    'Authentic pad thai cooked in a wok right in front of you. The flavors are perfectly balanced.',
    'https://assets.mixkit.co/videos/46010/46010-720.mp4',
    NULL, 16, '9:16',
    ARRAY['thai', 'padthai', 'streetfood'], 'Pad Thai',
    67800, 4320, 156, 345, 890, 78.90, TRUE,
    '2026-03-06T11:00:00Z', '2026-03-06T11:00:00Z'
  ),
  (
    '40000000-0000-0000-0000-000000000006',
    '00000000-0000-0000-0000-000000000002',
    '10000000-0000-0000-0000-000000000006',
    'Butter Chicken Heaven',
    'Creamy, rich butter chicken with the fluffiest naan bread. This place is a hidden gem!',
    'https://assets.mixkit.co/videos/46673/46673-720.mp4',
    NULL, 19, '9:16',
    ARRAY['indian', 'butterchicken', 'curry'], 'Butter Chicken',
    98500, 7100, 289, 678, 1560, 85.30, TRUE,
    '2026-03-05T14:00:00Z', '2026-03-05T14:00:00Z'
  )
ON CONFLICT (id) DO NOTHING;

-- ─── Reviews (Bella Napoli) ──────────────────────────────────────────────────
-- Note: The handle_review_change trigger will auto-update restaurant average_rating
INSERT INTO public.reviews (id, user_id, restaurant_id, order_id, rating, title, body, image_urls, helpful_count, created_at, updated_at) VALUES
  ('50000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000011', '10000000-0000-0000-0000-000000000001', NULL, 5, 'Best pizza in NYC!', 'The Margherita pizza is perfection. Crispy crust, fresh ingredients, and the ambiance is wonderful. Will definitely come back!', '{}', 24, '2026-03-01T00:00:00Z', '2026-03-01T00:00:00Z'),
  ('50000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000012', '10000000-0000-0000-0000-000000000001', NULL, 4, 'Great food, a bit pricey', 'Everything we ordered was delicious. The Cacio e Pepe was outstanding. Only knocking off a star because it''s a bit expensive for the portion sizes.', '{}', 12, '2026-02-20T00:00:00Z', '2026-02-20T00:00:00Z'),
  ('50000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000013', '10000000-0000-0000-0000-000000000001', NULL, 5, 'Perfect date night spot', 'Romantic atmosphere, incredible food, and the staff was so attentive. The tiramisu is a must-try!', '{}', 18, '2026-02-14T00:00:00Z', '2026-02-14T00:00:00Z')
ON CONFLICT (id) DO NOTHING;
