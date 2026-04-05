-- ============================================================================
-- Referral Tracking System
-- Tracks every user action that drives business to restaurants via ReelBite
-- ============================================================================

CREATE TABLE public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  creator_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  video_id UUID REFERENCES public.videos(id) ON DELETE SET NULL,
  action TEXT NOT NULL CHECK (action IN ('order', 'reservation', 'website', 'call', 'menu_view', 'direction')),
  referral_code TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_referrals_restaurant ON public.referrals(restaurant_id);
CREATE INDEX idx_referrals_creator ON public.referrals(creator_id);
CREATE INDEX idx_referrals_created ON public.referrals(created_at DESC);
CREATE INDEX idx_referrals_action ON public.referrals(action);
CREATE INDEX idx_referrals_code ON public.referrals(referral_code);

-- RLS: anyone can insert (even anonymous for tracking), restaurant owners can read their own
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create referrals" ON public.referrals
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own referrals" ON public.referrals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Restaurant owners can view their referrals" ON public.referrals
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.restaurants WHERE id = restaurant_id AND owner_id = auth.uid())
  );

-- Add payment_url to restaurants for direct order links
ALTER TABLE public.restaurants ADD COLUMN IF NOT EXISTS payment_url TEXT;
ALTER TABLE public.restaurants ADD COLUMN IF NOT EXISTS menu_url TEXT;
