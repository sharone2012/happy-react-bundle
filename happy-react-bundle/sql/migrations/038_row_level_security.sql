-- ══════════════════════════════════════════════════════════════════════════
-- MIGRATION 038: Row-Level Security (OPT-7)
-- Date: April 4, 2026
-- Purpose: Implement RLS on core tables to enforce approval gates at the
--          database layer, not just application layer.
-- Based on: CFI_DATABASE_SCHEMA_ANALYSIS.md — OPT-7 (HIGH)
--
-- ROLE MODEL:
--   anon          → public/unauthenticated access (Supabase anon key)
--                   Can only SELECT approved, non-locked rows
--   authenticated → logged-in users (Supabase auth session)
--                   Same as anon unless granted elevated role via user metadata
--   service_role  → Supabase admin / backend scripts
--                   Bypasses RLS entirely (Supabase built-in behaviour)
--
-- BEFORE APPLYING:
--   1. Verify that your application backend uses the service_role key for
--      admin writes (organism insert, approval updates). Service role bypasses RLS.
--   2. The anon key should be used for all read-only frontend queries.
--   3. To grant Sharon elevated access: set auth.users metadata 'role' = 'admin'
--      in the Supabase Auth dashboard for her account.
-- ══════════════════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────────────────────
-- HELPER FUNCTION: is_admin()
-- Returns TRUE if the current authenticated user has role = 'admin'
-- in their JWT app_metadata. Set via Supabase Auth dashboard or Edge Function.
-- ─────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT COALESCE(
    (auth.jwt() ->> 'app_metadata')::jsonb ->> 'role' = 'admin',
    false
  );
$$;

COMMENT ON FUNCTION is_admin() IS
  'Returns TRUE if the current JWT has app_metadata.role = "admin". '
  'Grant admin role to Sharon via Supabase Auth dashboard → user → app_metadata = {"role":"admin"}';

-- ─────────────────────────────────────────────────────────────────────────
-- TABLE: biological_library
-- ─────────────────────────────────────────────────────────────────────────
ALTER TABLE biological_library ENABLE ROW LEVEL SECURITY;

-- Public read: anon + authenticated can only see approved organisms
CREATE POLICY "Public reads approved organisms"
  ON biological_library
  FOR SELECT
  USING (is_approved = TRUE);

-- Admin read: admin users see all organisms (including unapproved AI drafts)
CREATE POLICY "Admin reads all organisms"
  ON biological_library
  FOR SELECT
  USING (is_admin());

-- Admin write: only admins can INSERT new organisms
CREATE POLICY "Admin inserts organisms"
  ON biological_library
  FOR INSERT
  WITH CHECK (is_admin());

-- Admin update: only admins can UPDATE (approve, lock, edit)
-- Note: service_role (backend) bypasses this automatically
CREATE POLICY "Admin updates organisms"
  ON biological_library
  FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

-- Nobody can DELETE from biological_library via client key
-- (service_role can still delete via Supabase admin)
CREATE POLICY "No client deletes"
  ON biological_library
  FOR DELETE
  USING (false);

-- ─────────────────────────────────────────────────────────────────────────
-- TABLE: cfi_soil_organism_performance
-- ─────────────────────────────────────────────────────────────────────────
ALTER TABLE cfi_soil_organism_performance ENABLE ROW LEVEL SECURITY;

-- Public read: only approved performance rows
CREATE POLICY "Public reads approved performance rows"
  ON cfi_soil_organism_performance
  FOR SELECT
  USING (is_approved = TRUE);

-- Admin read: all rows (including unapproved)
CREATE POLICY "Admin reads all performance rows"
  ON cfi_soil_organism_performance
  FOR SELECT
  USING (is_admin());

-- Admin write only
CREATE POLICY "Admin inserts performance rows"
  ON cfi_soil_organism_performance
  FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admin updates performance rows"
  ON cfi_soil_organism_performance
  FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "No client deletes from performance"
  ON cfi_soil_organism_performance
  FOR DELETE
  USING (false);

-- ─────────────────────────────────────────────────────────────────────────
-- TABLE: canonical_lab_data
-- Read-only for all client keys. Only service_role may write.
-- ─────────────────────────────────────────────────────────────────────────
ALTER TABLE canonical_lab_data ENABLE ROW LEVEL SECURITY;

-- Everyone can read canonical lab data (it is published reference data)
CREATE POLICY "Public reads canonical lab data"
  ON canonical_lab_data
  FOR SELECT
  USING (true);

-- No inserts, updates, or deletes from client keys
-- (service_role bypasses RLS — use Supabase admin or backend scripts)
CREATE POLICY "No client writes to canonical data"
  ON canonical_lab_data
  FOR INSERT
  WITH CHECK (false);

CREATE POLICY "No client updates to canonical data"
  ON canonical_lab_data
  FOR UPDATE
  USING (false);

CREATE POLICY "No client deletes from canonical data"
  ON canonical_lab_data
  FOR DELETE
  USING (false);

-- ─────────────────────────────────────────────────────────────────────────
-- TABLE: cfi_mills_60tph
-- Reference data — public read, admin write
-- ─────────────────────────────────────────────────────────────────────────
ALTER TABLE cfi_mills_60tph ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public reads mills"
  ON cfi_mills_60tph
  FOR SELECT
  USING (true);

CREATE POLICY "Admin writes mills"
  ON cfi_mills_60tph
  FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admin updates mills"
  ON cfi_mills_60tph
  FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "No client deletes mills"
  ON cfi_mills_60tph
  FOR DELETE
  USING (false);

-- ─────────────────────────────────────────────────────────────────────────
-- TABLE: cfi_soil_profiles
-- Reference data — public read, no client writes
-- ─────────────────────────────────────────────────────────────────────────
ALTER TABLE cfi_soil_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public reads soil profiles"
  ON cfi_soil_profiles
  FOR SELECT
  USING (true);

CREATE POLICY "No client writes to soil profiles"
  ON cfi_soil_profiles
  FOR INSERT
  WITH CHECK (false);

CREATE POLICY "No client updates to soil profiles"
  ON cfi_soil_profiles
  FOR UPDATE
  USING (false);

CREATE POLICY "No client deletes from soil profiles"
  ON cfi_soil_profiles
  FOR DELETE
  USING (false);

-- ─────────────────────────────────────────────────────────────────────────
-- TABLE: cfi_feedstock_values
-- Reference data — public read, admin write
-- ─────────────────────────────────────────────────────────────────────────
ALTER TABLE cfi_feedstock_values ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public reads feedstock values"
  ON cfi_feedstock_values
  FOR SELECT
  USING (true);

CREATE POLICY "Admin writes feedstock values"
  ON cfi_feedstock_values
  FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admin updates feedstock values"
  ON cfi_feedstock_values
  FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "No client deletes feedstock values"
  ON cfi_feedstock_values
  FOR DELETE
  USING (false);

-- ─────────────────────────────────────────────────────────────────────────
-- TABLE: cfi_master_prompts
-- Admin-only — prompt templates should not be readable by public
-- ─────────────────────────────────────────────────────────────────────────
ALTER TABLE cfi_master_prompts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin reads prompts"
  ON cfi_master_prompts
  FOR SELECT
  USING (is_admin());

CREATE POLICY "Admin writes prompts"
  ON cfi_master_prompts
  FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admin updates prompts"
  ON cfi_master_prompts
  FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "No client deletes prompts"
  ON cfi_master_prompts
  FOR DELETE
  USING (false);
