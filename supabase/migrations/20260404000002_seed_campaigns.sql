-- ============================================================================
-- Seed Campaign Data
-- ============================================================================

-- 5 campaigns across different restaurants
INSERT INTO public.campaigns (id, restaurant_id, type, title, description, budget, status, requirements, target_regions, max_submissions, deadline) VALUES
  (
    '60000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    'deal',
    'Review Our New Truffle Pizza',
    'We just launched our Black Truffle Pizza and want food creators to try it and share an honest review. Show the first bite reaction!',
    75.00,
    'active',
    '{"min_duration_sec": 15, "max_duration_sec": 45, "hashtags": ["BellaNapoli", "TrufflePizza", "ReelBite"], "must_include": ["first bite reaction", "cheese pull shot"], "style_notes": "Authentic, fun, casual vibe. No scripts."}'::jsonb,
    ARRAY['New York'],
    20,
    NOW() + INTERVAL '14 days'
  ),
  (
    '60000000-0000-0000-0000-000000000002',
    '10000000-0000-0000-0000-000000000002',
    'contest',
    'Sakura Sushi Video Challenge',
    'Create the best video showcasing our Omakase experience. Top 3 videos win cash prizes! Film your entire 12-course journey.',
    500.00,
    'active',
    '{"min_duration_sec": 30, "max_duration_sec": 60, "hashtags": ["SakuraSushi", "OmakaseChallenge", "ReelBite"], "must_include": ["at least 3 courses", "chef interaction"], "style_notes": "Cinematic, high quality. Show the artistry."}'::jsonb,
    ARRAY['New York'],
    50,
    NOW() + INTERVAL '21 days'
  ),
  (
    '60000000-0000-0000-0000-000000000003',
    '10000000-0000-0000-0000-000000000003',
    'deal',
    'Birria Tacos Taste Test',
    'Show yourself trying our famous Birria Tacos for the first time. We want that genuine reaction — the consomme dip, the cheese pull, everything!',
    50.00,
    'active',
    '{"min_duration_sec": 15, "max_duration_sec": 30, "hashtags": ["BirriaTime", "LaCocina", "ReelBite"], "must_include": ["consomme dip shot"], "style_notes": "Street food energy. Casual and real."}'::jsonb,
    ARRAY['New York'],
    30,
    NOW() + INTERVAL '10 days'
  ),
  (
    '60000000-0000-0000-0000-000000000004',
    '10000000-0000-0000-0000-000000000004',
    'contest',
    'Best Steak Video of the Month',
    'Film the ultimate steak experience at The Ember Room. Show the sizzle, the cut, the first bite. Top video gets featured on our Instagram!',
    1000.00,
    'active',
    '{"min_duration_sec": 20, "max_duration_sec": 60, "hashtags": ["EmberRoom", "SteakPorn", "ReelBite"], "must_include": ["steak cutting shot", "medium rare money shot"], "style_notes": "Premium, moody lighting preferred."}'::jsonb,
    ARRAY['New York'],
    25,
    NOW() + INTERVAL '30 days'
  ),
  (
    '60000000-0000-0000-0000-000000000005',
    '10000000-0000-0000-0000-000000000006',
    'deal',
    'Butter Chicken Comfort Food Review',
    'Try our legendary Butter Chicken with garlic naan and share your honest review. Perfect for the comfort food content niche.',
    60.00,
    'active',
    '{"min_duration_sec": 15, "max_duration_sec": 45, "hashtags": ["SpiceRoute", "ButterChicken", "ComfortFood", "ReelBite"], "must_include": ["naan dip shot"], "style_notes": "Cozy, warm tones. ASMR welcome."}'::jsonb,
    ARRAY['New York'],
    15,
    NOW() + INTERVAL '7 days'
  )
ON CONFLICT (id) DO NOTHING;

-- 8 sample submissions from seed creators
INSERT INTO public.submissions (id, campaign_id, creator_id, video_url, caption, proposed_bid, status, views_count, engagement_score) VALUES
  ('70000000-0000-0000-0000-000000000001', '60000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'https://assets.mixkit.co/videos/44001/44001-720.mp4', 'OMG this truffle pizza is insane! The aroma hit me before I even took a bite 🤯', 75.00, 'approved', 12400, 89.5),
  ('70000000-0000-0000-0000-000000000002', '60000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', 'https://assets.mixkit.co/videos/42474/42474-720.mp4', 'Bella Napoli truffle pizza - worth the hype? YES.', 70.00, 'pending', 0, 0),
  ('70000000-0000-0000-0000-000000000003', '60000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'https://assets.mixkit.co/videos/32518/32518-720.mp4', '12 courses of pure art. Chef Tanaka is a genius.', NULL, 'published', 45200, 94.2),
  ('70000000-0000-0000-0000-000000000004', '60000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'https://assets.mixkit.co/videos/46673/46673-720.mp4', 'The Omakase at Sakura is an experience, not just a meal', NULL, 'published', 32100, 87.8),
  ('70000000-0000-0000-0000-000000000005', '60000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000004', 'https://assets.mixkit.co/videos/46010/46010-720.mp4', 'First time trying 12-course omakase... mind blown!', NULL, 'published', 18700, 76.3),
  ('70000000-0000-0000-0000-000000000006', '60000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', 'https://assets.mixkit.co/videos/45729/45729-720.mp4', 'These birria tacos are dripping with flavor!', 50.00, 'approved', 8900, 82.1),
  ('70000000-0000-0000-0000-000000000007', '60000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'https://assets.mixkit.co/videos/45729/45729-720.mp4', 'Dry-aged ribeye perfection. The sizzle says it all.', NULL, 'published', 67800, 96.1),
  ('70000000-0000-0000-0000-000000000008', '60000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000003', 'https://assets.mixkit.co/videos/44001/44001-720.mp4', 'The Ember Room steaks hit different at night', NULL, 'published', 23400, 81.5)
ON CONFLICT (id) DO NOTHING;
