-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- users table
CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text NOT NULL UNIQUE,
  name text NOT NULL,
  wallet_address text,
  commit_score integer NOT NULL DEFAULT 500,
  grade text NOT NULL DEFAULT 'C',
  total_staked numeric NOT NULL DEFAULT 0,
  total_earned numeric NOT NULL DEFAULT 0,
  pacts_completed integer NOT NULL DEFAULT 0,
  pacts_failed integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- pacts table
CREATE TABLE IF NOT EXISTS public.pacts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  description text,
  category text NOT NULL CHECK (category IN ('education', 'corporate', 'legal', 'government', 'personal')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'proof-pending', 'voting', 'completed', 'failed', 'disputed')),
  stake_per_member numeric NOT NULL,
  total_stake numeric NOT NULL,
  deadline timestamp with time zone NOT NULL,
  verification_method text NOT NULL,
  creator_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  blockchain_app_id text,
  blockchain_tx_id text,
  proof_data jsonb
);

-- pact_members table
CREATE TABLE IF NOT EXISTS public.pact_members (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  pact_id uuid NOT NULL REFERENCES public.pacts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  proof_status text NOT NULL DEFAULT 'pending' CHECK (proof_status IN ('pending', 'submitted', 'failed')),
  joined_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (pact_id, user_id)
);

-- proof_submissions table
CREATE TABLE IF NOT EXISTS public.proof_submissions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  pact_id uuid NOT NULL REFERENCES public.pacts(id) ON DELETE CASCADE,
  member_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  proof_type text NOT NULL CHECK (proof_type IN ('document', 'github_url', 'strava_data', 'api_verified')),
  proof_url text,
  proof_data jsonb,
  submitted_at timestamp with time zone NOT NULL DEFAULT now(),
  verified_at timestamp with time zone,
  verified_by uuid REFERENCES public.users(id) ON DELETE SET NULL
);

-- votes table
CREATE TABLE IF NOT EXISTS public.votes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  pact_id uuid NOT NULL REFERENCES public.pacts(id) ON DELETE CASCADE,
  proof_submission_id uuid NOT NULL REFERENCES public.proof_submissions(id) ON DELETE CASCADE,
  voter_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  vote text NOT NULL CHECK (vote IN ('approve', 'reject')),
  voted_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (proof_submission_id, voter_id)
);

-- waitlist table
CREATE TABLE IF NOT EXISTS public.waitlist (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text NOT NULL,
  organization text NOT NULL,
  role text NOT NULL,
  use_case text NOT NULL,
  submitted_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pact_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proof_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Users can only read/update their own data
DROP POLICY IF EXISTS users_select_own ON public.users;
CREATE POLICY users_select_own ON public.users
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS users_update_own ON public.users;
CREATE POLICY users_update_own ON public.users
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS users_insert_own ON public.users;
CREATE POLICY users_insert_own ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Pact members can read their pacts
DROP POLICY IF EXISTS pacts_select_members ON public.pacts;
CREATE POLICY pacts_select_members ON public.pacts
  FOR SELECT USING (
    creator_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.pact_members pm
      WHERE pm.pact_id = pacts.id AND pm.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS pacts_insert_creator ON public.pacts;
CREATE POLICY pacts_insert_creator ON public.pacts
  FOR INSERT WITH CHECK (creator_id = auth.uid());

DROP POLICY IF EXISTS pacts_update_creator ON public.pacts;
CREATE POLICY pacts_update_creator ON public.pacts
  FOR UPDATE USING (creator_id = auth.uid())
  WITH CHECK (creator_id = auth.uid());

DROP POLICY IF EXISTS pact_members_select_members ON public.pact_members;
CREATE POLICY pact_members_select_members ON public.pact_members
  FOR SELECT USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.pact_members self
      WHERE self.pact_id = pact_members.pact_id AND self.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS pact_members_insert_creator ON public.pact_members;
CREATE POLICY pact_members_insert_creator ON public.pact_members
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.pacts p
      WHERE p.id = pact_members.pact_id AND p.creator_id = auth.uid()
    )
  );

-- Only members can submit proof to their pact
DROP POLICY IF EXISTS proof_submissions_select_members ON public.proof_submissions;
CREATE POLICY proof_submissions_select_members ON public.proof_submissions
  FOR SELECT USING (
    member_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.pact_members pm
      WHERE pm.pact_id = proof_submissions.pact_id AND pm.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS proof_submissions_insert_member ON public.proof_submissions;
CREATE POLICY proof_submissions_insert_member ON public.proof_submissions
  FOR INSERT WITH CHECK (
    member_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.pact_members pm
      WHERE pm.pact_id = proof_submissions.pact_id AND pm.user_id = auth.uid()
    )
  );

-- Only members can vote on their pact
DROP POLICY IF EXISTS votes_select_members ON public.votes;
CREATE POLICY votes_select_members ON public.votes
  FOR SELECT USING (
    voter_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.pact_members pm
      WHERE pm.pact_id = votes.pact_id AND pm.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS votes_insert_members ON public.votes;
CREATE POLICY votes_insert_members ON public.votes
  FOR INSERT WITH CHECK (
    voter_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.pact_members pm
      WHERE pm.pact_id = votes.pact_id AND pm.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS waitlist_insert_public ON public.waitlist;
CREATE POLICY waitlist_insert_public ON public.waitlist
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS waitlist_select_authenticated ON public.waitlist;
CREATE POLICY waitlist_select_authenticated ON public.waitlist
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_pacts_category ON public.pacts(category);
CREATE INDEX IF NOT EXISTS idx_pacts_status ON public.pacts(status);
CREATE INDEX IF NOT EXISTS idx_pact_members_user ON public.pact_members(user_id);
CREATE INDEX IF NOT EXISTS idx_pact_members_pact ON public.pact_members(pact_id);
