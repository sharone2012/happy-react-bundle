-- ══════════════════════════════════════════════════════════════════════════
-- MIGRATION 036: Materialized View — Organism Rankings (OPT-2)
-- Date: April 4, 2026
-- Purpose: Pre-compute organism ranking scores per soil type to replace
--          repeated runtime calculations in rank_organisms_by_objective()
-- Based on: CFI_DATABASE_SCHEMA_ANALYSIS.md — OPT-2 (MEDIUM)
-- Performance gain: 5-20x for ranking queries
-- ══════════════════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────────────────────
-- DROP EXISTING VIEW (safe re-run)
-- ─────────────────────────────────────────────────────────────────────────
DROP MATERIALIZED VIEW IF EXISTS organism_rankings;

-- ─────────────────────────────────────────────────────────────────────────
-- CREATE MATERIALIZED VIEW
-- Joins biological_library (master catalog) with
-- cfi_soil_organism_performance (soil-specific scores)
-- Only approved organisms are included — unapproved are excluded.
-- ─────────────────────────────────────────────────────────────────────────
CREATE MATERIALIZED VIEW organism_rankings AS
SELECT
  -- Identity
  sop.id                          AS perf_id,
  bl.id                           AS organism_id,
  bl.organism_name,
  bl.common_name,
  bl.cfi_category,
  bl.wave_assignment,

  -- Soil context
  sop.soil_type,

  -- Core scores (soil-specific)
  sop.soil_specific_score,
  sop.p_releaser_score_soil,
  sop.lignin_score_soil,
  sop.n_fixer_score_soil,
  sop.k_solubiliser_score_soil,

  -- Cost
  sop.cost_per_tonne_fw,

  -- Pre-computed value ratio (score per dollar)
  -- NULL when cost is zero or NULL to avoid division by zero
  CASE
    WHEN sop.cost_per_tonne_fw > 0
    THEN ROUND((sop.soil_specific_score / sop.cost_per_tonne_fw)::numeric, 4)
    ELSE NULL
  END                             AS value_ratio,

  -- Pre-computed P value ratio
  CASE
    WHEN sop.cost_per_tonne_fw > 0
    THEN ROUND((sop.p_releaser_score_soil / sop.cost_per_tonne_fw)::numeric, 4)
    ELSE NULL
  END                             AS p_value_ratio,

  -- Stage compatibility (kept as array for UI consumption)
  bl.stage_compatibility,

  -- Approval state (should always be TRUE here, but stored for transparency)
  sop.is_approved,
  bl.is_approved                  AS bl_is_approved,

  -- Confidence
  sop.confidence_level,

  -- Timestamps for staleness detection
  sop.updated_at                  AS perf_updated_at,
  bl.updated_at                   AS bl_updated_at

FROM cfi_soil_organism_performance sop
JOIN biological_library bl
  ON sop.organism_name = bl.organism_name
WHERE
  sop.is_approved = TRUE
  AND bl.is_approved = TRUE;

-- ─────────────────────────────────────────────────────────────────────────
-- INDEXES ON THE MATERIALIZED VIEW
-- These replace runtime sort/filter costs for ranking queries
-- ─────────────────────────────────────────────────────────────────────────

-- Primary access pattern: filter by soil_type then rank
CREATE INDEX IF NOT EXISTS idx_org_rankings_soil_type
  ON organism_rankings (soil_type);

-- Secondary: category filter inside a soil type
CREATE INDEX IF NOT EXISTS idx_org_rankings_soil_category
  ON organism_rankings (soil_type, cfi_category);

-- Sorting by value_ratio (most common ranking objective)
CREATE INDEX IF NOT EXISTS idx_org_rankings_value_ratio
  ON organism_rankings (soil_type, value_ratio DESC NULLS LAST);

-- Sorting by overall score
CREATE INDEX IF NOT EXISTS idx_org_rankings_score
  ON organism_rankings (soil_type, soil_specific_score DESC);

-- ─────────────────────────────────────────────────────────────────────────
-- REFRESH FUNCTION
-- Call after any INSERT/UPDATE/DELETE on biological_library or
-- cfi_soil_organism_performance. Wire this to a Supabase DB webhook or
-- cron job (pg_cron) in production.
-- ─────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION refresh_organism_rankings()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  REFRESH MATERIALIZED VIEW CONCURRENTLY organism_rankings;
$$;

-- ─────────────────────────────────────────────────────────────────────────
-- COMMENT
-- ─────────────────────────────────────────────────────────────────────────
COMMENT ON MATERIALIZED VIEW organism_rankings IS
  'Pre-computed organism rankings per soil type. Joins biological_library + cfi_soil_organism_performance. '
  'Refresh with SELECT refresh_organism_rankings() after any organism data change. '
  'Only includes rows where both sop.is_approved AND bl.is_approved are TRUE.';
