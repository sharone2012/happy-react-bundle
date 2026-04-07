-- ══════════════════════════════════════════════════════════════════════════
-- MIGRATION 037: Table & Column Documentation (COMMENT statements)
-- Date: April 4, 2026
-- Purpose: Add missing COMMENT ON TABLE / COLUMN statements identified
--          in the schema analysis documentation gap section
-- Based on: CFI_DATABASE_SCHEMA_ANALYSIS.md — Documentation Gaps
-- ══════════════════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────────────────────
-- biological_library
-- ─────────────────────────────────────────────────────────────────────────
COMMENT ON TABLE biological_library IS
  'Master catalog of biological organisms (bacteria, fungi, nematodes, enzymes) used in CFI '
  'bioconversion processing stages (S1-S6). Contains generic performance scores, cost data, '
  'stage compatibility, and Sharon approval gate. AI-generated rows must be approved before '
  'they are surfaced in the application.';

COMMENT ON COLUMN biological_library.organism_name IS
  'Scientific name of the organism (UNIQUE, NOT NULL). Primary join key across all related tables.';

COMMENT ON COLUMN biological_library.common_name IS
  'Colloquial or trade name (e.g., "Provibio", "EM1"). May be NULL for unnamed strains.';

COMMENT ON COLUMN biological_library.cfi_category IS
  'CFI classification: Bacteria, Fungi, Nematode, Enzyme, Probiotic Mix, etc.';

COMMENT ON COLUMN biological_library.wave_assignment IS
  'Production deployment wave (W1, W2, W3) — determines rollout priority.';

COMMENT ON COLUMN biological_library.one_nine_score IS
  'Generic performance score on 1-9 scale. Soil-agnostic overall effectiveness. '
  'Do NOT use for final recommendations — use soil_specific_score from cfi_soil_organism_performance instead.';

COMMENT ON COLUMN biological_library.stage_compatibility IS
  'Array of processing stage codes this organism can be applied at (e.g. {S0,S1,S2}). '
  'Stored as text[] for UI consumption. Cross-reference with cfi_master_prompts.applies_to.';

COMMENT ON COLUMN biological_library.conflict_with IS
  'Array of organism names that conflict with this organism (competitive inhibition or pH war). '
  'Checked by the Treatment Optimizer before generating inoculation plans.';

COMMENT ON COLUMN biological_library.cost_per_tonne_fw IS
  'Cost in USD per tonne of fresh-weight feedstock. Used in value-ratio calculations in ranking queries.';

COMMENT ON COLUMN biological_library.is_ai_generated IS
  'TRUE if this row was created by an AI research agent (Deep Research, Claude, etc.). '
  'All AI-generated rows begin with is_approved = FALSE.';

COMMENT ON COLUMN biological_library.is_approved IS
  'Sharon approval gate: FALSE = AI-generated, pending review. TRUE = approved for production use. '
  'The application MUST filter WHERE is_approved = TRUE for all user-facing queries.';

COMMENT ON COLUMN biological_library.is_locked IS
  'Lock flag. When TRUE, the row cannot be modified by application-layer writes. '
  'Only the service role (Supabase admin) can modify locked rows.';

COMMENT ON COLUMN biological_library.lock_class IS
  'Lock tier: A = permanently locked (canonical literature values), '
  'B = locked until field trials complete, C = freely editable.';

-- ─────────────────────────────────────────────────────────────────────────
-- cfi_soil_organism_performance
-- ─────────────────────────────────────────────────────────────────────────
COMMENT ON TABLE cfi_soil_organism_performance IS
  'Soil-specific performance scores for each organism × soil type combination. '
  'Rows are derived from Deep Research validation and Sharon review. '
  'This table REPLACES biological_library.one_nine_score for all recommendation queries.';

COMMENT ON COLUMN cfi_soil_organism_performance.soil_type IS
  'Soil order (Inceptisol, Ultisol, Oxisol, Histosol, Spodosol, Andisol). '
  'Matches cfi_mills_60tph.confirmed_soil_type and cfi_soil_profiles.soil_type.';

COMMENT ON COLUMN cfi_soil_organism_performance.soil_specific_score IS
  'Overall performance score on a 1-9 scale for this organism in this specific soil type. '
  'The primary sort key for rank_organisms_by_objective().';

COMMENT ON COLUMN cfi_soil_organism_performance.p_releaser_score_soil IS
  'Phosphorus solubilisation effectiveness score (1-9) for this soil type. '
  'Weighted higher for degraded soils with Bray P below 10 mg/kg.';

COMMENT ON COLUMN cfi_soil_organism_performance.lignin_score_soil IS
  'Lignocellulose breakdown score (1-9) for this soil type. '
  'Key driver for Stage 1 (Chemical) and Stage 2 (Biological) selection.';

COMMENT ON COLUMN cfi_soil_organism_performance.confidence_level IS
  'Data quality tier: HIGH = lab-confirmed, MEDIUM = peer-reviewed literature, LOW = LDE estimate.';

COMMENT ON COLUMN cfi_soil_organism_performance.validated_by IS
  'Who validated this row (e.g. "Deep Research v1", "Sharon Chen 2026-03").';

-- ─────────────────────────────────────────────────────────────────────────
-- canonical_lab_data
-- ─────────────────────────────────────────────────────────────────────────
COMMENT ON TABLE canonical_lab_data IS
  'Locked reference values for feedstream nutrient analysis. '
  'CLASS A = permanently locked (e.g. EFB N = 0.76% DM — never override). '
  'CLASS B = locked until field trials. CLASS C = editable. '
  'Used as the source of truth for all calculator guardrails in the CFI frontend.';

COMMENT ON COLUMN canonical_lab_data.stream IS
  'Residue stream code: EFB, OPDC, POS, POME, PKE, PMF, OPF, OPT.';

COMMENT ON COLUMN canonical_lab_data.parameter IS
  'Nutrient or measurement name (e.g. "N_pct_DM", "K_pct_DM", "moisture_pct").';

COMMENT ON COLUMN canonical_lab_data.lock_class IS
  'Lock tier: A = permanently locked, B = locked pending field trials, C = editable.';

COMMENT ON COLUMN canonical_lab_data.guardrail_note IS
  'Human-readable explanation of why this value is locked and the risk of overriding it.';

-- ─────────────────────────────────────────────────────────────────────────
-- cfi_mills_60tph
-- ─────────────────────────────────────────────────────────────────────────
COMMENT ON TABLE cfi_mills_60tph IS
  'Registry of Indonesian palm oil mills with capacity >= 60 TPH (tonnes per hour FFB). '
  'Used for mill selection cascade in the CFI S0 dashboard (SectionAB). '
  'Source: GAPKI 2024 + satellite verification. ~105 mills in dataset.';

COMMENT ON COLUMN cfi_mills_60tph.confirmed_soil_type IS
  'GPS-verified soil order for this mill location. Populated via get_soil_acidity_class(lat, lon) RPC. '
  'Matches soil_type keys in cfi_soil_organism_performance and cfi_soil_profiles.';

COMMENT ON COLUMN cfi_mills_60tph.capacity_tph IS
  'Mill throughput in tonnes of fresh fruit bunch (FFB) per hour. '
  'All rows in this table have capacity_tph >= 60 (enforced by partial index idx_mills_capacity_60tph).';

-- ─────────────────────────────────────────────────────────────────────────
-- cfi_soil_profiles
-- ─────────────────────────────────────────────────────────────────────────
COMMENT ON TABLE cfi_soil_profiles IS
  'Soil chemistry profiles by soil type (one row per soil order). '
  'Contains 100+ columns covering: degraded state values, restoration target values, '
  'micronutrient ranges, and peat-specific parameters. '
  'Read-mostly table — changes require Sharon approval and a new migration.';

-- ─────────────────────────────────────────────────────────────────────────
-- cfi_feedstock_values
-- ─────────────────────────────────────────────────────────────────────────
COMMENT ON TABLE cfi_feedstock_values IS
  'Nutrient and physical parameters for each CFI residue stream (EFB, OPDC, POS, POME, PKE, PMF). '
  'Used in feedstock calculator to determine blend ratios and nutrient inputs. '
  'Values are LDE-calibrated against canonical_lab_data CLASS A references.';
