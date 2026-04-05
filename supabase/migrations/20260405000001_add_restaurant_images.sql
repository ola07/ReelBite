-- Add cover images to all seed restaurants using Unsplash food photos
UPDATE public.restaurants SET cover_image_url = 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&h=600&fit=crop' WHERE id = '10000000-0000-0000-0000-000000000001'; -- Bella Napoli (pizza)
UPDATE public.restaurants SET cover_image_url = 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&h=600&fit=crop' WHERE id = '10000000-0000-0000-0000-000000000002'; -- Sakura Sushi
UPDATE public.restaurants SET cover_image_url = 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&h=600&fit=crop' WHERE id = '10000000-0000-0000-0000-000000000003'; -- La Cocina (tacos)
UPDATE public.restaurants SET cover_image_url = 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&h=600&fit=crop' WHERE id = '10000000-0000-0000-0000-000000000004'; -- Ember Room (steak)
UPDATE public.restaurants SET cover_image_url = 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800&h=600&fit=crop' WHERE id = '10000000-0000-0000-0000-000000000005'; -- Bangkok Garden (thai)
UPDATE public.restaurants SET cover_image_url = 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&h=600&fit=crop' WHERE id = '10000000-0000-0000-0000-000000000006'; -- Spice Route (indian)

-- Add menu item images for Bella Napoli
UPDATE public.menu_items SET image_url = 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400&h=300&fit=crop' WHERE id = '30000000-0000-0000-0000-000000000001'; -- Bruschetta
UPDATE public.menu_items SET image_url = 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop' WHERE id = '30000000-0000-0000-0000-000000000004'; -- Margherita Pizza
UPDATE public.menu_items SET image_url = 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&h=300&fit=crop' WHERE id = '30000000-0000-0000-0000-000000000007'; -- Cacio e Pepe
UPDATE public.menu_items SET image_url = 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop' WHERE id = '30000000-0000-0000-0000-000000000009'; -- Tiramisu

-- Sakura Sushi items
UPDATE public.menu_items SET image_url = 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=300&fit=crop' WHERE id = '30000000-0000-0000-0000-000000000011'; -- Salmon Nigiri
UPDATE public.menu_items SET image_url = 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=400&h=300&fit=crop' WHERE id = '30000000-0000-0000-0000-000000000013'; -- Dragon Roll

-- La Cocina items
UPDATE public.menu_items SET image_url = 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=300&fit=crop' WHERE id = '30000000-0000-0000-0000-000000000016'; -- Birria Tacos

-- Ember Room items
UPDATE public.menu_items SET image_url = 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop' WHERE id = '30000000-0000-0000-0000-000000000023'; -- Dry-Aged Ribeye

-- Bangkok Garden items
UPDATE public.menu_items SET image_url = 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400&h=300&fit=crop' WHERE id = '30000000-0000-0000-0000-000000000028'; -- Pad Thai

-- Spice Route items
UPDATE public.menu_items SET image_url = 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop' WHERE id = '30000000-0000-0000-0000-000000000033'; -- Butter Chicken
UPDATE public.menu_items SET image_url = 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop' WHERE id = '30000000-0000-0000-0000-000000000036'; -- Garlic Naan
