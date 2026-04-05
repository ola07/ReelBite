-- ============================================================================
-- Creator Economy: Brand Deals + Creator Contests
-- ============================================================================

-- ─── Campaigns ────────────────────────────────────────────────────────────────
CREATE TABLE public.campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('deal', 'contest')),
  title TEXT NOT NULL,
  description TEXT,
  brief_url TEXT,
  budget NUMERIC(10,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed', 'cancelled')),
  requirements JSONB NOT NULL DEFAULT '{}',
  target_regions TEXT[] NOT NULL DEFAULT '{}',
  max_submissions INTEGER,
  deadline TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_campaigns_restaurant ON public.campaigns(restaurant_id);
CREATE INDEX idx_campaigns_status ON public.campaigns(status);
CREATE INDEX idx_campaigns_type ON public.campaigns(type);
CREATE INDEX idx_campaigns_deadline ON public.campaigns(deadline);

-- ─── Submissions ──────────────────────────────────────────────────────────────
CREATE TABLE public.submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  caption TEXT,
  proposed_bid NUMERIC(10,2),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'declined', 'revision_requested', 'published')),
  feedback TEXT,
  views_count INTEGER NOT NULL DEFAULT 0,
  engagement_score NUMERIC(5,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_submissions_campaign ON public.submissions(campaign_id);
CREATE INDEX idx_submissions_creator ON public.submissions(creator_id);
CREATE INDEX idx_submissions_status ON public.submissions(status);

-- ─── Contest Winners ──────────────────────────────────────────────────────────
CREATE TABLE public.contest_winners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  submission_id UUID NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
  rank INTEGER NOT NULL,
  prize_amount NUMERIC(10,2) NOT NULL,
  paid_at TIMESTAMPTZ
);

CREATE INDEX idx_contest_winners_campaign ON public.contest_winners(campaign_id);

-- ─── Payouts ──────────────────────────────────────────────────────────────────
CREATE TABLE public.payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID REFERENCES public.submissions(id) ON DELETE SET NULL,
  contest_winner_id UUID REFERENCES public.contest_winners(id) ON DELETE SET NULL,
  creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL,
  platform_fee NUMERIC(10,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  payment_method TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payouts_creator ON public.payouts(creator_id);
CREATE INDEX idx_payouts_status ON public.payouts(status);

-- ─── Updated_at triggers ──────────────────────────────────────────────────────
CREATE TRIGGER set_campaigns_updated_at BEFORE UPDATE ON public.campaigns
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_submissions_updated_at BEFORE UPDATE ON public.submissions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ─── RLS ──────────────────────────────────────────────────────────────────────
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contest_winners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;

-- Campaigns: public read active, restaurant owners CRUD own
CREATE POLICY "Active campaigns are viewable" ON public.campaigns
  FOR SELECT USING (status = 'active' OR EXISTS (
    SELECT 1 FROM public.restaurants WHERE id = restaurant_id AND owner_id = auth.uid()
  ));

CREATE POLICY "Restaurant owners can create campaigns" ON public.campaigns
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM public.restaurants WHERE id = restaurant_id AND owner_id = auth.uid()
  ));

CREATE POLICY "Restaurant owners can update own campaigns" ON public.campaigns
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM public.restaurants WHERE id = restaurant_id AND owner_id = auth.uid()
  ));

-- Submissions: creators CRUD own, restaurant owners read for their campaigns
CREATE POLICY "Creators can view own submissions" ON public.submissions
  FOR SELECT USING (
    creator_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.campaigns c
      JOIN public.restaurants r ON r.id = c.restaurant_id
      WHERE c.id = campaign_id AND r.owner_id = auth.uid()
    )
  );

CREATE POLICY "Creators can submit" ON public.submissions
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Submission status updates" ON public.submissions
  FOR UPDATE USING (
    creator_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.campaigns c
      JOIN public.restaurants r ON r.id = c.restaurant_id
      WHERE c.id = campaign_id AND r.owner_id = auth.uid()
    )
  );

-- Contest winners: viewable by campaign participants
CREATE POLICY "Contest winners are viewable" ON public.contest_winners
  FOR SELECT USING (true);

CREATE POLICY "Restaurant owners can pick winners" ON public.contest_winners
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM public.campaigns c
    JOIN public.restaurants r ON r.id = c.restaurant_id
    WHERE c.id = campaign_id AND r.owner_id = auth.uid()
  ));

-- Payouts: creators see own
CREATE POLICY "Creators can view own payouts" ON public.payouts
  FOR SELECT USING (creator_id = auth.uid());

CREATE POLICY "System can create payouts" ON public.payouts
  FOR INSERT WITH CHECK (true);
