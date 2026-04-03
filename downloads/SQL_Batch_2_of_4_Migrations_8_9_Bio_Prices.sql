-- ████████████████████████████████████████████████████████████████████████████████
-- FILE 6: CFI_Project_Files/sql/CFI_Migration8_Soil_Coefficients.sql
-- ████████████████████████████████████████████████████████████████████████████████

-- =============================================================================
-- CFI MIGRATION 8 — cfi_soil_coefficients
-- All formula coefficients per soil order used by SOM/CEC/WHC/Microbiome models
-- Sources: Ultisol v3.0; Sandy Entisol summary; Inceptisol summary; Andisol v3.2;
--          Peat gap resolution; CFI Data Gap Resolution 15/17 report
-- S3 Wave 2 N-fixer term: LOCKED AT ZERO for ALL soils per guardrails
-- F:B ratio coefficients: LDE-LOW for ALL soils (no PLFA data exist)
-- Run AFTER Migration 7 (depends on cfi_soil_profiles.soil_key FK)
-- =============================================================================

DROP TABLE IF EXISTS cfi_soil_coefficients CASCADE;

CREATE TABLE cfi_soil_coefficients (
  id                              SERIAL PRIMARY KEY,
  soil_key                        TEXT NOT NULL REFERENCES cfi_soil_profiles(soil_key),
  supabase_reference              TEXT NOT NULL,

  -- ── SOM / HUMUS / OM RETENTION ────────────────────────────────────────────
  om_retention_1yr_fract_cp       NUMERIC(5,3),   -- fraction of CP+ OM remaining after 1 yr
  om_retention_1yr_fract_bf       NUMERIC(5,3),   -- fraction of BF OM remaining after 1 yr
  om_retention_1yr_fract_bfplus   NUMERIC(5,3),   -- fraction of BF+ OM remaining after 1 yr
  om_retention_confidence         TEXT,

  humus_formation_fract_cp        NUMERIC(5,3),   -- fraction of retained OM becoming stable humus
  humus_formation_fract_bf        NUMERIC(5,3),
  humus_formation_fract_bfplus    NUMERIC(5,3),
  humus_formation_confidence      TEXT,

  decay_factor_annual             NUMERIC(5,3),   -- (1 - annual mineralisation rate) for SOM trajectory
  decay_factor_confidence         TEXT,
  decay_factor_note               TEXT,

  -- ── CEC RESPONSE ────────────────────────────────────────────────────────────
  cec_response_per_som_pct        NUMERIC(6,3),   -- cmol(+)/kg per 1% SOM increase
  cec_response_confidence         TEXT,
  humic_cec_factor_cmol_kg        NUMERIC(7,0),   -- cmol(+)/kg of humic C (200-400 range; DATA GAP refined)
  humic_cec_factor_confidence     TEXT,

  -- ── WHC RESPONSE ────────────────────────────────────────────────────────────
  whc_response_mm_per_som_pct     NUMERIC(5,2),   -- mm extra water per 1% SOM increase
  whc_response_confidence         TEXT,
  whc_formula_applies             BOOLEAN,         -- FALSE for Histosol (water table model instead)
  whc_formula_note                TEXT,

  -- ── N BALANCE REDUCTION FACTORS (post-CFI application) ────────────────────
  -- Combined RF = product RF × management RF
  n_leach_rf_cp                   NUMERIC(5,3),   -- reduction factor for CP+ (0=no reduction, 1=full)
  n_leach_rf_bf                   NUMERIC(5,3),
  n_leach_rf_bfplus               NUMERIC(5,3),
  n_leach_rf_vgam                 NUMERIC(5,3),   -- management tier reduction factor
  n_leach_combined_rf             NUMERIC(5,3),   -- combined applied in formula
  n_leach_confidence              TEXT,

  -- ── S3 WAVE 2 N-FIXER TERM — GUARDRAIL LOCKED ──────────────────────────────
  -- MANDATORY: All values are 0. Do NOT update without expert panel sign-off + Supabase trials.
  n_fix_wave2_kg_n_ha_yr          NUMERIC(6,1)    NOT NULL DEFAULT 0.0,
  n_fix_wave2_status              TEXT            NOT NULL DEFAULT 'DATA_GAP_LOCKED_ZERO',
  n_fix_wave2_potential_kg_n_ha_yr_low  NUMERIC(6,1),  -- mechanistic potential only — NOT in calculator
  n_fix_wave2_potential_kg_n_ha_yr_high NUMERIC(6,1),
  n_fix_wave2_organisms           TEXT,           -- organisms identified, not yet quantified per soil
  n_fix_wave2_confidence          TEXT            NOT NULL DEFAULT 'LDE-LOW',

  -- ── P FIXATION REDUCTION FACTORS ─────────────────────────────────────────
  p_fix_rf_cp                     NUMERIC(5,3),
  p_fix_rf_bf                     NUMERIC(5,3),
  p_fix_rf_bfplus                 NUMERIC(5,3),
  p_fix_rf_amf                    NUMERIC(5,3),
  p_fix_rf_vgam                   NUMERIC(5,3),
  p_fix_combined_rf               NUMERIC(5,3),
  p_casio3_rf_at_2_5_t_ha         NUMERIC(5,3),   -- Andisol-specific CaSiO3 co-amendment RF
  p_casio3_rf_at_4_5_t_ha         NUMERIC(5,3),
  p_fix_confidence                TEXT,

  -- ── K LEACHING REDUCTION FACTORS ─────────────────────────────────────────
  k_leach_rf_cp                   NUMERIC(5,3),
  k_leach_rf_bfplus               NUMERIC(5,3),
  k_leach_combined_rf             NUMERIC(5,3),
  k_leach_confidence              TEXT,

  -- ── ANDISOL-SPECIFIC: BD RESPONSE COEFFICIENTS ────────────────────────────
  bd_response_delta_g_cm3_per_som_pct  NUMERIC(6,4),  -- Andisol only; 0.025 g/cm3 per %SOM
  bd_floor_g_cm3                       NUMERIC(4,2),  -- Andisol only; 0.55 g/cm3 minimum
  bd_positive_feedback_loop            BOOLEAN,       -- TRUE for Andisol

  -- ── METADATA ────────────────────────────────────────────────────────────────
  version                         TEXT DEFAULT '1.0',
  is_active                       BOOLEAN DEFAULT TRUE,
  created_at                      TIMESTAMPTZ DEFAULT NOW(),
  updated_at                      TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- DATA INSERTS — all 6 soils
-- All DATA GAP values are placeholder LDE estimates; replace with Supabase
-- field trial data as it becomes available. No external claims from placeholders.
-- =============================================================================

INSERT INTO cfi_soil_coefficients (
  soil_key, supabase_reference,
  om_retention_1yr_fract_cp, om_retention_1yr_fract_bf, om_retention_1yr_fract_bfplus, om_retention_confidence,
  humus_formation_fract_cp, humus_formation_fract_bf, humus_formation_fract_bfplus, humus_formation_confidence,
  decay_factor_annual, decay_factor_confidence, decay_factor_note,
  cec_response_per_som_pct, cec_response_confidence,
  humic_cec_factor_cmol_kg, humic_cec_factor_confidence,
  whc_response_mm_per_som_pct, whc_response_confidence, whc_formula_applies, whc_formula_note,
  n_leach_rf_cp, n_leach_rf_bf, n_leach_rf_bfplus, n_leach_rf_vgam,
  n_leach_combined_rf, n_leach_confidence,
  n_fix_wave2_kg_n_ha_yr, n_fix_wave2_status,
  n_fix_wave2_potential_kg_n_ha_yr_low, n_fix_wave2_potential_kg_n_ha_yr_high,
  n_fix_wave2_organisms, n_fix_wave2_confidence,
  p_fix_rf_cp, p_fix_rf_bf, p_fix_rf_bfplus, p_fix_rf_amf, p_fix_rf_vgam,
  p_fix_combined_rf, p_fix_confidence,
  p_casio3_rf_at_2_5_t_ha, p_casio3_rf_at_4_5_t_ha,
  k_leach_rf_cp, k_leach_rf_bfplus, k_leach_combined_rf, k_leach_confidence,
  bd_response_delta_g_cm3_per_som_pct, bd_floor_g_cm3, bd_positive_feedback_loop
) VALUES

-- ── 1. ULTISOL ────────────────────────────────────────────────────────────────
(
  'ultisol',
  'SOILS.Calculator.Palm - Ultisols.Indonesia.Malaysia',
  0.60, 0.70, 0.75, 'LDE-LOW',          -- OM retention: field trials needed
  0.35, 0.25, 0.30, 'LDE-LOW',          -- humus formation: fractionation needed
  0.88, 'LDE-MODERATE', '10-15% annual mineralisation of accumulated SOM. Decay_Factor = 0.88 for Ultisol acidic clay.',
  0.90, 'LDE-MODERATE',                 -- CEC response 0.6-1.2 lit range; 0.90 working estimate
  300,  'LDE-MODERATE',                 -- humic CEC factor 200-400 range
  2.30, 'LDE-MODERATE', TRUE, 'Standard mm/% SOM formula applies. WHC_Response=2.3 mm per 1% SOM (lit range 1.5-3.0).',
  0.80, 0.75, 0.75, 0.80,              -- N leach RFs per product + VGAM
  0.480, 'LDE-LOW',                    -- combined RF: (0.80 × 0.75 × 0.80) approx
  0.0, 'DATA_GAP_LOCKED_ZERO',
  20.0, 60.0,                          -- mechanistic potential only
  'Azotobacter, Azospirillum, Rhizobium spp. (tropical soils)', 'LDE-LOW',
  0.80, 0.75, 0.75, 0.85, 0.85,
  0.434, 'LDE-LOW',                    -- combined P fix RF
  NULL, NULL,                          -- CaSiO3 not relevant for Ultisol
  0.85, 0.80, 0.720, 'LDE-LOW',
  NULL, NULL, NULL                      -- BD response: not applicable
),

-- ── 2. INCEPTISOL ────────────────────────────────────────────────────────────
(
  'inceptisol',
  'SOILS.Calculator.Palm - Inceptisols-Alluvial.Indonesia.Malaysia',
  0.65, 0.72, 0.78, 'LDE-LOW',
  0.38, 0.28, 0.33, 'LDE-LOW',
  0.90, 'LDE-MODERATE', '10% annual mineralisation. Inceptisol 2:1 clays protect SOM better than Ultisols. Decay_Factor=0.90.',
  2.80, 'LDE-MODERATE',               -- HIGHER than Ultisol due to 2:1 clay mineralogy (alluvial); validation needed for Indonesian soils
  300,  'LDE-MODERATE',
  1.90, 'LDE-MODERATE', TRUE, 'Standard formula applies. WHC_Response=1.9 mm per 1% SOM (moderate — clay structure already retains water).',
  0.82, 0.78, 0.78, 0.82,
  0.525, 'LDE-MODERATE',              -- N leach combined RF (better base retention vs Ultisol)
  0.0, 'DATA_GAP_LOCKED_ZERO',
  25.0, 60.0,
  'Azotobacter, Azospirillum; alluvial soils may support Herbaspirillum', 'LDE-LOW',
  0.82, 0.78, 0.78, 0.88, 0.88,
  0.467, 'LDE-MODERATE',              -- lower baseline P fixation means smaller combined RF
  NULL, NULL,
  0.87, 0.83, 0.760, 'LDE-MODERATE',
  NULL, NULL, NULL
),

-- ── 3. OXISOL ────────────────────────────────────────────────────────────────
(
  'oxisol',
  'SOILS.Calculator.Palm - Oxisols.Indonesia.Malaysia',
  0.58, 0.68, 0.73, 'LDE-LOW',
  0.32, 0.22, 0.27, 'LDE-LOW',
  0.87, 'LDE-LOW', 'Rapid mineralisation on Oxisols; Fe/Al oxides protect some OM. Decay_Factor=0.87.',
  0.80, 'LDE-LOW',                    -- lower CEC response due to oxidic mineralogy
  280,  'LDE-LOW',
  1.80, 'LDE-LOW', TRUE, 'Standard formula applies. Low incremental effect because Fe/Al oxides already fix some water. WHC_Response=1.8 mm per 1% SOM.',
  0.78, 0.72, 0.72, 0.78,
  0.436, 'LDE-LOW',
  0.0, 'DATA_GAP_LOCKED_ZERO',
  20.0, 55.0,
  'Azotobacter; limited fixation capacity on highly oxidised soils', 'LDE-LOW',
  0.78, 0.72, 0.70, 0.82, 0.82,
  0.380, 'LDE-LOW',                   -- very high baseline means RFs are smaller absolute improvement
  NULL, NULL,
  0.82, 0.78, 0.680, 'LDE-LOW',
  NULL, NULL, NULL
),

-- ── 4. SPODOSOL / SANDY ENTISOL ────────────────────────────────────────────
(
  'spodosol',
  'SOILS.Calculator.Palm - Sandy-Entisols.Spodosols.Indonesia.Malaysia',
  0.45, 0.55, 0.60, 'LDE-LOW',        -- FASTEST decay of any soil; lower retention
  0.25, 0.18, 0.22, 'LDE-LOW',        -- lower humus formation on sands
  0.50, 'LDE-LOW', 'Fastest decay rate of any soil (45-55% annual mineralisation). Decay_Factor=0.50 working estimate. Wide literature range 0.45-0.55.',
  1.75, 'LDE-LOW',                    -- low CEC response; mineral fraction negligible
  250,  'LDE-LOW',
  4.00, 'LDE-HIGH', TRUE, 'HIGHEST WHC response of any soil (3.0-5.0 mm per %SOM). Sandy soils gain disproportionate water retention from OM addition (near-zero baseline).',
  0.75, 0.68, 0.68, 0.75,
  0.380, 'LDE-LOW',                   -- some N leaching is structural; RFs have limited effect
  0.0, 'DATA_GAP_LOCKED_ZERO',
  20.0, 50.0,
  'Azotobacter; limited on highly leached sandy profiles', 'LDE-LOW',
  -- P FIXATION RFs not relevant for Sandy — P LEACHES on this soil
  -- Using P_fix RFs = 1.0 (no fixation to reduce); add note
  1.00, 1.00, 1.00, 1.00, 1.00,
  1.000, 'N/A — Sandy soils have P LEACHING not P fixation. P_leach_fract_baseline=0.20 applies instead. P_fix RFs set to 1.0 (inactive).',
  NULL, NULL,
  0.80, 0.75, 0.650, 'LDE-LOW',
  NULL, NULL, NULL
),

-- ── 5. ANDISOL ────────────────────────────────────────────────────────────────
(
  'andisol',
  'SOILS.Calculator.Palm - Andisols.VolcanicAsh.Indonesia.Malaysia',
  0.55, 0.63, 0.68, 'LDE-MODERATE',   -- Andisol allophane protects OM better than most
  0.40, 0.30, 0.35, 'LDE-MODERATE',
  0.82, 'LDE-MODERATE', 'Slower mineralisation than Ultisol due to allophane OM stabilisation. Decay_Factor=0.82.',
  -- CEC: higher per SOM pct because variable-charge allophane adds pH-dependent CEC
  3.20, 'LDE-MODERATE',
  320,  'LDE-MODERATE',
  1.25, 'LDE-MODERATE', TRUE, 'Lower incremental WHC gain (1.0-1.5 mm per %SOM) because allophane already holds substantial water via metal-OH groups. WHC_Response=1.25 working estimate.',
  0.82, 0.78, 0.78, 0.82,
  0.517, 'LDE-MODERATE',              -- AEC gives nitrate retention — N leach RF 0.31 confirmed; n_leach_combined=0.138 final fraction
  0.0, 'DATA_GAP_LOCKED_ZERO',
  20.0, 60.0,
  'Azotobacter diazotrophicus, Azospirillum brasilense (volcanic/allophanic soils — highest potential)', 'LDE-LOW',
  0.80, 0.75, 0.72, 0.88, 0.88,
  0.380, 'LDE-MODERATE',              -- CaSiO3 co-amendment is the PRIMARY P-fix intervention
  0.15, 0.25,                         -- CONFIRMED: CaSiO3 RF=0.15 at 2.5 t/ha; RF=0.25 at 4.5 t/ha (Lembang study)
  0.88, 0.83, 0.760, 'LDE-MODERATE',
  -- ANDISOL ONLY — BD response coefficients (v3.2 confirmed)
  0.0250, 0.55, TRUE                  -- ΔBD=0.025 g/cm3 per %SOM; BD floor 0.55 g/cm3; positive feedback loop
),

-- ── 6. HISTOSOL / PEAT ────────────────────────────────────────────────────────
(
  'histosol',
  'SOILS.Calculator.Palm - Peat.Histosols.Indonesia.Malaysia',
  -- OM RETENTION: SPECIAL CASE — native peat OM is not from CFI products
  -- These fractions apply to ADDED product OM only, not native peat C pool
  0.50, 0.60, 0.65, 'LDE-LOW',        -- added product OM retention on peat substrate
  0.30, 0.22, 0.26, 'LDE-LOW',
  -- DECAY: SPECIAL CASE — native peat does NOT follow Decay_Factor model
  -- Peat carbon is preserved (anoxic) or lost via oxidation (drainage)
  -- This value applies to ADDED product OM only
  0.70, 'LDE-LOW', 'SPECIAL CASE: Native peat carbon is preserved under flooding or oxidised under drainage (55-200 t CO2e/ha/yr). This Decay_Factor=0.70 applies ONLY to added CFI product OM, not native peat pool. Use peat_ghg_baseline_t_co2e_ha_yr for peat C accounting.',
  -- CEC: Peat CEC is already very high (25-60 cmol/kg) but pH-dependent
  -- Adding more OM has diminishing CEC return on peat
  0.40, 'LDE-LOW',                    -- lower CEC response per SOM because baseline CEC already high
  200,  'LDE-LOW',
  -- WHC: FORMULA DOES NOT APPLY TO PEAT
  NULL, 'N/A', FALSE, 'WHC formula (mm per %SOM) DOES NOT APPLY to Histosols. Soil is already 24.5% organic C. WHC is governed by water table depth, not SOM additions. Use water table management model instead.',
  -- N REDUCTION FACTORS: IMMOBILISATION, not leaching — different formula needed
  0.78, 0.72, 0.72, 0.78,
  0.450, 'LDE-LOW',                   -- WARNING: These RFs model immobilisation risk reduction, not leaching
  0.0, 'DATA_GAP_LOCKED_ZERO',
  20.0, 50.0,
  'Azotobacter; limited on acidic peat (pH 3.8); slow colonisation', 'LDE-LOW',
  -- P FIXATION: LOW on peat (18%); story is K and Cu, not P
  0.85, 0.80, 0.78, 0.88, 0.88,
  0.550, 'LDE-LOW',                   -- P is not the constraint on peat; Cu and K are
  NULL, NULL,
  -- K LEACHING: HIGH — extremely high K demand and K leaches rapidly on peat
  0.82, 0.78, 0.700, 'LDE-LOW',
  NULL, NULL, NULL                    -- BD response not applicable (peat is not mineral)
);

-- =============================================================================
-- GUARDRAIL CHECK: Confirm all Wave 2 values are zero
-- =============================================================================
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM cfi_soil_coefficients
    WHERE n_fix_wave2_kg_n_ha_yr != 0.0
  ) THEN
    RAISE EXCEPTION 'GUARDRAIL VIOLATION: n_fix_wave2_kg_n_ha_yr must be 0.0 for all soils';
  END IF;
  RAISE NOTICE 'GUARDRAIL PASS: All Wave 2 N-fixer values confirmed at 0.0';
END;
$$;

-- =============================================================================
-- INDEXES & TRIGGERS
-- =============================================================================
CREATE INDEX idx_cfi_soil_coefficients_soil_key ON cfi_soil_coefficients(soil_key);

CREATE OR REPLACE FUNCTION update_soil_coefficients_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_soil_coefficients_updated_at
  BEFORE UPDATE ON cfi_soil_coefficients
  FOR EACH ROW EXECUTE FUNCTION update_soil_coefficients_updated_at();

-- =============================================================================
-- VERIFY
-- =============================================================================
SELECT
  c.soil_key,
  c.decay_factor_annual            AS decay,
  c.cec_response_per_som_pct       AS cec_r,
  c.whc_response_mm_per_som_pct    AS whc_r,
  c.whc_formula_applies,
  c.n_leach_combined_rf            AS n_rf,
  c.n_fix_wave2_kg_n_ha_yr         AS wave2,
  c.p_fix_combined_rf              AS p_rf,
  c.bd_positive_feedback_loop      AS bd_fb,
  c.om_retention_confidence        AS om_conf
FROM cfi_soil_coefficients c
ORDER BY c.soil_key;


-- ████████████████████████████████████████████████████████████████████████████████
-- FILE 7: CFI_Project_Files/sql/CFI_Migration9_Product_Soil_Response.sql
-- ████████████████████████████████████████████████████████████████████████████████

-- =============================================================================
-- CFI MIGRATION 9 — cfi_product_soil_response
-- Per-product × per-soil response coefficients for microbiome recovery model
-- Products: cp_plus (Compost+), bf (Biofertiliser), bf_plus (Biofertiliser+)
-- Soils: ultisol, inceptisol, oxisol, spodosol, andisol, histosol
-- =============================================================================
-- CRITICAL GOVERNANCE NOTES:
-- (1) ALL MBC_response values are DATA GAP placeholders — no field trials completed
-- (2) F:B ratio alpha/beta coefficients are LDE-LOW for ALL soils × ALL products
--     (no palm-specific PLFA data exist anywhere in the literature)
-- (3) AMF inoculation effect is only relevant for BF+ (which contains AMF dose)
--     BF has no dedicated AMF inoculum; AMF effect from BF = 0
--     CP+ has no AMF inoculum; AMF effect from CP+ = 0
-- (4) Wave 2 biological slot: reserved, currently NULL/inactive
-- (5) Synergy_factor: 0.10-0.15 × sum of individual MBC contributions per soil
-- =============================================================================

DROP TABLE IF EXISTS cfi_product_soil_response CASCADE;

CREATE TABLE cfi_product_soil_response (
  id                              SERIAL PRIMARY KEY,
  soil_key                        TEXT NOT NULL REFERENCES cfi_soil_profiles(soil_key),
  product_id                      TEXT NOT NULL,    -- 'cp_plus' | 'bf' | 'bf_plus'
  product_name                    TEXT NOT NULL,
  supabase_reference              TEXT NOT NULL,

  -- ── MICROBIAL BIOMASS CARBON (MBC) ────────────────────────────────────────
  mbc_response_mg_kg_per_t_ha     NUMERIC(8,2),     -- mg C/kg soil per t/ha/yr product applied
  mbc_synergy_factor              NUMERIC(5,3),     -- 0.10-0.15 for combined product synergy
  mbc_confidence                  TEXT,
  mbc_note                        TEXT,

  -- ── F:B RATIO RESPONSE ────────────────────────────────────────────────────
  fb_ratio_alpha_coeff            NUMERIC(8,4),     -- α: SOM/lignin-driven fungal shift coefficient
  fb_ratio_beta_coeff             NUMERIC(8,4),     -- β: chitin-driven fungal shift coefficient
  fb_ratio_amf_contribution       NUMERIC(5,3),     -- direct AMF contribution to F:B (BF+ only)
  fb_ratio_confidence             TEXT,             -- LDE-LOW for ALL products/soils (no PLFA data)
  fb_ratio_plfa_required          BOOLEAN DEFAULT TRUE, -- TRUE = field PLFA/qPCR required before use

  -- ── AMF COLONISATION ──────────────────────────────────────────────────────
  amf_inoculation_effect_pct      NUMERIC(5,1),     -- direct % increase from AMF inoculum (BF+ only; others=0)
  amf_habitat_response_coeff      NUMERIC(5,3),     -- %AMF gain per %SOM increase (indirect pathway)
  amf_p_environment_score_coeff   NUMERIC(5,3),     -- %AMF gain per % P-fixation reduction
  amf_p_uptake_efficiency_mult    NUMERIC(5,3),     -- multiplier: 1 + AMF% × this coefficient (typically 0.008)
  amf_confidence                  TEXT,

  -- ── ENZYME ACTIVITY ───────────────────────────────────────────────────────
  dehydrogenase_response_factor   NUMERIC(6,2),     -- relative factor vs baseline
  phosphatase_response_factor     NUMERIC(6,2),
  enzyme_confidence               TEXT,

  -- ── MICROBIOME RECOVERY SCORE (MRS 0-100) ────────────────────────────────
  mrs_mbc_weight                  NUMERIC(4,2) DEFAULT 0.30,
  mrs_fb_weight                   NUMERIC(4,2) DEFAULT 0.25,
  mrs_amf_weight                  NUMERIC(4,2) DEFAULT 0.25,
  mrs_enzyme_weight               NUMERIC(4,2) DEFAULT 0.20,
  -- Soil-specific MRS benchmarks for normalisation
  mrs_mbc_degraded                NUMERIC(7,0),     -- degraded baseline for normalisation
  mrs_mbc_target                  NUMERIC(7,0),     -- target for 100% sub-score
  mrs_fb_degraded                 NUMERIC(5,2),
  mrs_fb_target                   NUMERIC(5,2),
  mrs_amf_degraded                NUMERIC(5,1),
  mrs_amf_target                  NUMERIC(5,1),

  -- ── WAVE 2 BIOLOGICAL SLOT ────────────────────────────────────────────────
  wave2_slot_active               BOOLEAN DEFAULT FALSE,
  wave2_description               TEXT,

  -- ── METADATA ──────────────────────────────────────────────────────────────
  confidence_overall              TEXT,
  data_source                     TEXT,
  is_active                       BOOLEAN DEFAULT TRUE,
  created_at                      TIMESTAMPTZ DEFAULT NOW(),
  updated_at                      TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE (soil_key, product_id)
);

-- =============================================================================
-- HELPER: Generate all 18 rows (6 soils × 3 products)
-- =============================================================================

-- Rather than repeat boilerplate, define product characteristics and soil
-- characteristics inline. All MBC responses are DATA GAP placeholders.

-- PRODUCT DEFINITIONS:
--   cp_plus:  BIO-COMPOST+ (S3W1) — bulk OM, no AMF dose, low chitin
--   bf:       BIO-FERTILISER (S5A frass only) — higher N, chitin 5.4%, no AMF dose
--   bf_plus:  BIO-FERTILISER+ (S5A frass + whole BSF) — chitin ~8%, lipid 6%, AMF 500 prop/g

-- ── ULTISOL × 3 PRODUCTS ─────────────────────────────────────────────────────
INSERT INTO cfi_product_soil_response (
  soil_key, product_id, product_name, supabase_reference,
  mbc_response_mg_kg_per_t_ha, mbc_synergy_factor, mbc_confidence, mbc_note,
  fb_ratio_alpha_coeff, fb_ratio_beta_coeff, fb_ratio_amf_contribution, fb_ratio_confidence,
  amf_inoculation_effect_pct, amf_habitat_response_coeff, amf_p_environment_score_coeff,
  amf_p_uptake_efficiency_mult, amf_confidence,
  dehydrogenase_response_factor, phosphatase_response_factor, enzyme_confidence,
  mrs_mbc_degraded, mrs_mbc_target, mrs_fb_degraded, mrs_fb_target,
  mrs_amf_degraded, mrs_amf_target,
  wave2_slot_active, wave2_description,
  confidence_overall, data_source
) VALUES

('ultisol','cp_plus','CFI Compost+','SOILS.Calculator.Palm - Ultisols.Indonesia.Malaysia',
  18.0, 0.12, 'LDE-LOW', 'MBC response per t/ha CP+ on Ultisol. Placeholder. Replace with Supabase microbial biomass assay data.',
  0.12, 0.00, 0.00, 'LDE-LOW',
  0.0, 0.08, 0.05, 0.008, 'LDE-LOW',
  1.35, 1.25, 'LDE-LOW',
  180, 800, 0.20, 0.80, 10.0, 60.0,
  FALSE, 'Wave 2 N-fixer biology to be added when Supabase lab data available',
  'LDE-LOW', 'Ultisol v3.0 Table; MBC benchmarks from Indonesian palm soil studies'),

('ultisol','bf','CFI Biofertiliser','SOILS.Calculator.Palm - Ultisols.Indonesia.Malaysia',
  35.0, 0.12, 'LDE-LOW', 'Higher MBC response than CP+ due to live microbial consortia (10^10 CFU/g) and chitin substrate.',
  0.08, 0.08, 0.00, 'LDE-LOW',
  0.0, 0.06, 0.06, 0.008, 'LDE-LOW',
  1.60, 1.80, 'LDE-LOW',
  180, 800, 0.20, 0.80, 10.0, 60.0,
  FALSE, 'Wave 2 slot reserved',
  'LDE-LOW', 'Frass chitin stimulates fungal growth (Jeon et al 2011); BSF gut diversity (16S)'),

('ultisol','bf_plus','CFI Biofertiliser+','SOILS.Calculator.Palm - Ultisols.Indonesia.Malaysia',
  80.0, 0.12, 'LDE-LOW', 'Highest MBC response: whole BSF biomass provides protein+chitin+lipid substrate. 4.4x CP+ estimate.',
  0.12, 0.12, 0.06, 'LDE-LOW',
  15.0, 0.08, 0.08, 0.008, 'LDE-MODERATE',
  1.80, 2.20, 'LDE-LOW',
  180, 800, 0.20, 0.80, 10.0, 60.0,
  FALSE, 'Wave 2: BF+ will be primary carrier for Wave 2 organisms when available',
  'LDE-LOW', 'Ultisol v3.0; AMF chitin stimulation confirmed (whole-insect frass studies)'),

-- ── INCEPTISOL × 3 ────────────────────────────────────────────────────────────
('inceptisol','cp_plus','CFI Compost+','SOILS.Calculator.Palm - Inceptisols-Alluvial.Indonesia.Malaysia',
  20.0, 0.13, 'LDE-LOW', 'Slightly higher MBC response than Ultisol due to better base fertility and pH.',
  0.13, 0.00, 0.00, 'LDE-LOW',
  0.0, 0.10, 0.06, 0.008, 'LDE-LOW',
  1.30, 1.20, 'LDE-LOW',
  200, 900, 0.22, 0.90, 12.0, 65.0,
  FALSE, 'Wave 2 slot reserved', 'LDE-LOW', 'Inceptisol calculator; alluvial fertility baseline'),

('inceptisol','bf','CFI Biofertiliser','SOILS.Calculator.Palm - Inceptisols-Alluvial.Indonesia.Malaysia',
  38.0, 0.13, 'LDE-LOW', NULL,
  0.09, 0.09, 0.00, 'LDE-LOW',
  0.0, 0.07, 0.07, 0.008, 'LDE-LOW',
  1.55, 1.75, 'LDE-LOW',
  200, 900, 0.22, 0.90, 12.0, 65.0,
  FALSE, NULL, 'LDE-LOW', NULL),

('inceptisol','bf_plus','CFI Biofertiliser+','SOILS.Calculator.Palm - Inceptisols-Alluvial.Indonesia.Malaysia',
  85.0, 0.13, 'LDE-LOW', 'Best MBC result expected on Inceptisol: high pH and nutrient availability support rapid microbial establishment.',
  0.13, 0.13, 0.07, 'LDE-LOW',
  18.0, 0.10, 0.09, 0.008, 'LDE-MODERATE',
  1.75, 2.15, 'LDE-LOW',
  200, 900, 0.22, 0.90, 12.0, 65.0,
  FALSE, 'Wave 2 will be highest priority Inceptisol trial given highest yield impact',
  'LDE-LOW', 'Inceptisol calculator; AMF expected highest baseline here'),

-- ── OXISOL × 3 ────────────────────────────────────────────────────────────────
('oxisol','cp_plus','CFI Compost+','SOILS.Calculator.Palm - Oxisols.Indonesia.Malaysia',
  14.0, 0.11, 'LDE-LOW', 'Lower MBC response on Oxisols: Fe/Al oxides suppress microbial activity; low base fertility.',
  0.10, 0.00, 0.00, 'LDE-LOW',
  0.0, 0.07, 0.05, 0.008, 'LDE-LOW',
  1.25, 1.15, 'LDE-LOW',
  80, 700, 0.12, 0.70, 4.0, 50.0,
  FALSE, NULL, 'LDE-LOW', 'Oxisol studies; goethite interference with microbial activity'),

('oxisol','bf','CFI Biofertiliser','SOILS.Calculator.Palm - Oxisols.Indonesia.Malaysia',
  28.0, 0.11, 'LDE-LOW', NULL,
  0.07, 0.07, 0.00, 'LDE-LOW',
  0.0, 0.05, 0.06, 0.008, 'LDE-LOW',
  1.40, 1.60, 'LDE-LOW',
  80, 700, 0.12, 0.70, 4.0, 50.0,
  FALSE, NULL, 'LDE-LOW', NULL),

('oxisol','bf_plus','CFI Biofertiliser+','SOILS.Calculator.Palm - Oxisols.Indonesia.Malaysia',
  68.0, 0.11, 'LDE-LOW', 'BF+ chitin also provides nematode suppression on Fe-rich Oxisol soils (secondary benefit).',
  0.10, 0.10, 0.05, 'LDE-LOW',
  12.0, 0.07, 0.07, 0.008, 'LDE-MODERATE',
  1.60, 2.00, 'LDE-LOW',
  80, 700, 0.12, 0.70, 4.0, 50.0,
  FALSE, NULL, 'LDE-LOW', NULL),

-- ── SPODOSOL / SANDY × 3 ──────────────────────────────────────────────────────
('spodosol','cp_plus','CFI Compost+','SOILS.Calculator.Palm - Sandy-Entisols.Spodosols.Indonesia.Malaysia',
  12.0, 0.10, 'LDE-LOW', 'Lowest MBC response: high leaching removes nutrients; microbial community cannot establish well without OM retention.',
  0.09, 0.00, 0.00, 'LDE-LOW',
  0.0, 0.06, 0.04, 0.007, 'LDE-LOW',
  1.20, 1.10, 'LDE-LOW',
  60, 600, 0.10, 0.60, 3.0, 40.0,
  FALSE, NULL, 'LDE-LOW', 'Sandy Entisol calculator; Kalimantan BRIS soil data'),

('spodosol','bf','CFI Biofertiliser','SOILS.Calculator.Palm - Sandy-Entisols.Spodosols.Indonesia.Malaysia',
  25.0, 0.10, 'LDE-LOW', NULL,
  0.07, 0.07, 0.00, 'LDE-LOW',
  0.0, 0.05, 0.05, 0.007, 'LDE-LOW',
  1.30, 1.50, 'LDE-LOW',
  60, 600, 0.10, 0.60, 3.0, 40.0,
  FALSE, NULL, 'LDE-LOW', NULL),

('spodosol','bf_plus','CFI Biofertiliser+','SOILS.Calculator.Palm - Sandy-Entisols.Spodosols.Indonesia.Malaysia',
  60.0, 0.10, 'LDE-LOW', 'On sands, higher application rate needed (25+ t/ha CP+) to compensate rapid decay. BF+ provides most efficient microbial density per tonne.',
  0.09, 0.09, 0.04, 'LDE-LOW',
  10.0, 0.06, 0.06, 0.007, 'LDE-LOW',
  1.55, 1.90, 'LDE-LOW',
  60, 600, 0.10, 0.60, 3.0, 40.0,
  FALSE, NULL, 'LDE-LOW', NULL),

-- ── ANDISOL × 3 ───────────────────────────────────────────────────────────────
('andisol','cp_plus','CFI Compost+','SOILS.Calculator.Palm - Andisols.VolcanicAsh.Indonesia.Malaysia',
  22.0, 0.14, 'LDE-MODERATE', 'Andisol allophane and high natural OM support good MBC response. Slightly better than Ultisol.',
  0.14, 0.00, 0.00, 'LDE-LOW',
  0.0, 0.12, 0.06, 0.009, 'LDE-LOW',
  1.40, 1.30, 'LDE-MODERATE',
  250, 1000, 0.30, 1.20, 15.0, 70.0,
  FALSE, NULL, 'LDE-MODERATE', 'Andisol v3.2; allophane-stabilised microbial habitats'),

('andisol','bf','CFI Biofertiliser','SOILS.Calculator.Palm - Andisols.VolcanicAsh.Indonesia.Malaysia',
  42.0, 0.14, 'LDE-MODERATE', NULL,
  0.10, 0.10, 0.00, 'LDE-LOW',
  0.0, 0.08, 0.08, 0.009, 'LDE-LOW',
  1.65, 1.90, 'LDE-MODERATE',
  250, 1000, 0.30, 1.20, 15.0, 70.0,
  FALSE, NULL, 'LDE-MODERATE', NULL),

('andisol','bf_plus','CFI Biofertiliser+','SOILS.Calculator.Palm - Andisols.VolcanicAsh.Indonesia.Malaysia',
  92.0, 0.14, 'LDE-MODERATE', 'Highest MBC potential of any soil. Allophane nanostructure + high AMF baseline (20-30% native colonisation) amplifies BF+ effect.',
  0.14, 0.14, 0.08, 'LDE-LOW',
  20.0, 0.12, 0.10, 0.009, 'LDE-MODERATE',
  1.90, 2.40, 'LDE-MODERATE',
  250, 1000, 0.30, 1.20, 15.0, 70.0,
  FALSE, 'Wave 2 A. diazotrophicus and A. brasilense most likely to succeed on Andisol (volcanic precedent)',
  'LDE-MODERATE', 'Andisol v3.2 all 22 gaps closed; highest research confidence of any soil'),

-- ── HISTOSOL / PEAT × 3 ────────────────────────────────────────────────────────
('histosol','cp_plus','CFI Compost+','SOILS.Calculator.Palm - Peat.Histosols.Indonesia.Malaysia',
  15.0, 0.10, 'LDE-LOW', 'PEAT SPECIAL CASE: MBC is already high on undrained peat (anaerobic microbiome). Oil palm drainage dramatically reduces MBC. CP+ helps restore aerobic MBC. Response is pH-limited (pH 3.8).',
  0.15, 0.00, 0.00, 'LDE-LOW',
  0.0, 0.05, 0.03, 0.006, 'LDE-LOW',
  1.15, 1.05, 'LDE-LOW',
  300, 800, 0.60, 1.80, 3.0, 25.0,
  FALSE, NULL, 'LDE-LOW', 'Peat gap resolution; Southeast Asian peatland microbiome review; UPM peat studies'),

('histosol','bf','CFI Biofertiliser','SOILS.Calculator.Palm - Peat.Histosols.Indonesia.Malaysia',
  22.0, 0.10, 'LDE-LOW', NULL,
  0.08, 0.08, 0.00, 'LDE-LOW',
  0.0, 0.04, 0.03, 0.006, 'LDE-LOW',
  1.25, 1.45, 'LDE-LOW',
  300, 800, 0.60, 1.80, 3.0, 25.0,
  FALSE, NULL, 'LDE-LOW', NULL),

('histosol','bf_plus','CFI Biofertiliser+','SOILS.Calculator.Palm - Peat.Histosols.Indonesia.Malaysia',
  55.0, 0.10, 'LDE-LOW', 'AMF effectiveness limited on peat (pH 3.8 suppresses AMF). BF+ value on peat comes primarily from K supply, Cu correction, and N timing — not AMF. amf_inoculation_effect_pct is proportionally lower here.',
  0.10, 0.10, 0.03, 'LDE-LOW',
  6.0, 0.04, 0.03, 0.006, 'LDE-LOW',   -- AMF effect LOWER than other soils due to pH suppression
  1.45, 1.75, 'LDE-LOW',
  300, 800, 0.60, 1.80, 3.0, 25.0,
  FALSE, 'Wave 2 may include acidophilic N-fixers specific to peat pH (e.g. Acidithiobacillus); DATA GAP',
  'LDE-LOW', 'Peat microbiome review; AMF-pH suppression confirmed; Cu deficiency primary peat constraint');

-- =============================================================================
-- GUARDRAIL CHECK: Confirm Wave 2 is inactive for all rows
-- =============================================================================
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM cfi_product_soil_response
    WHERE wave2_slot_active = TRUE
  ) THEN
    RAISE EXCEPTION 'GUARDRAIL: wave2_slot_active must be FALSE for all rows until lab data loaded';
  END IF;
  RAISE NOTICE 'GUARDRAIL PASS: Wave 2 slots confirmed inactive (FALSE) across all 18 product×soil rows';
END;
$$;

-- =============================================================================
-- INDEXES & TRIGGERS
-- =============================================================================
CREATE INDEX idx_cfi_psr_soil_product ON cfi_product_soil_response(soil_key, product_id);

CREATE OR REPLACE FUNCTION update_psr_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_psr_updated_at
  BEFORE UPDATE ON cfi_product_soil_response
  FOR EACH ROW EXECUTE FUNCTION update_psr_updated_at();

-- =============================================================================
-- VERIFY: Full summary view joining all 3 tables
-- =============================================================================
SELECT
  p.soil_key,
  p.product_id,
  p.mbc_response_mg_kg_per_t_ha   AS mbc_r,
  p.fb_ratio_alpha_coeff          AS fb_a,
  p.amf_inoculation_effect_pct    AS amf_pct,
  p.amf_p_uptake_efficiency_mult  AS amf_mult,
  p.confidence_overall            AS conf,
  p.wave2_slot_active             AS w2,
  c.decay_factor_annual           AS decay,
  c.whc_formula_applies           AS whc_ok,
  s.is_peat
FROM cfi_product_soil_response p
JOIN cfi_soil_coefficients c USING (soil_key)
JOIN cfi_soil_profiles     s USING (soil_key)
ORDER BY p.soil_key, p.product_id;


-- ████████████████████████████████████████████████████████████████████████████████
-- FILE 8: CFI_Project_Files/outputs/CFI_Migration6_Biologicals.sql
-- ████████████████████████████████████████████████████████████████████████████████

-- ================================================================
-- CFI SUPABASE — MIGRATION 6
-- Source: CFI_Biologicals_Calculator_v1.xlsx (Mar 2026)
-- Scope:
--   (1) UPSERT 10 organisms → cfi_biological_library
--   (2) CREATE + INSERT → cfi_supplier_database (12 suppliers)
--   (3) CREATE + INSERT → cfi_bsf_handoff_gate (6 criteria)
--   (4) CREATE + INSERT → cfi_inoculation_protocols (3 options)
--   (5) CREATE + INSERT → cfi_biologicals_references (12 sources)
--   (6) cfi_change_log entry
-- Run AFTER Migrations 1–5
-- Date: March 2026
-- ================================================================

-- ⚠  OPEN A FRESH SQL EDITOR TAB BEFORE RUNNING
-- Supabase → SQL Editor → + New Query → paste all → Run

-- ================================================================
-- SECTION 1 — UPSERT: cfi_biological_library
-- Updates existing organisms; inserts any absent ones.
-- ON CONFLICT keyed on organism_name (must be UNIQUE in schema).
-- If your schema uses a different unique column, adjust below.
-- ================================================================

-- Organism 1: Lactobacillus EM-4
INSERT INTO cfi_biological_library (
    organism_name, strain_code, organism_type, key_function,
    bsf_uplift_pct, dose_rate, dose_units, cost_per_unit, cost_per_t_fw,
    synergies, conflicts, ph_range_min, ph_range_max,
    temp_range_min, temp_range_max, o2_requirement,
    bsf_pathway_safe, guardrail_flag, guardrail_note,
    cfi_status, supplier_ref, doi_reference, source_file, is_active
)
VALUES (
    'Lactobacillus EM-4', 'EM-4', 'Bacterium (lactic acid)',
    'pH buffer + CH₄ control via methanogen inhibition. Reduces CH₄ by 70–80% (mean 75% used).',
    NULL, 10, 'mL/kg substrate', 0.005, 0.05,
    'Saccharomyces cerevisiae (fermentation synergy)', 'None known',
    3.5, 8.0, 20, 45, 'Facultative anaerobe',
    TRUE, 'DATA_GAP', 'BSF uplift % = DATA GAP — no DOI confirmed for uplift on EFB/OPDC substrate.',
    'ACTIVE — CFI ONE-SHOT PROTOCOL Day 1', 'EM4 Indonesia (Songgolangit)',
    'DATA GAP — CH₄ reduction 70–80%: multiple peer-reviewed sources pending cross-validation',
    'CFI_Biologicals_Calculator_v1.xlsx | ORGANISM_DATABASE row 1 | Mar 2026', TRUE
)
ON CONFLICT (organism_name) DO UPDATE SET
    strain_code          = EXCLUDED.strain_code,
    organism_type        = EXCLUDED.organism_type,
    key_function         = EXCLUDED.key_function,
    dose_rate            = EXCLUDED.dose_rate,
    dose_units           = EXCLUDED.dose_units,
    cost_per_unit        = EXCLUDED.cost_per_unit,
    cost_per_t_fw        = EXCLUDED.cost_per_t_fw,
    synergies            = EXCLUDED.synergies,
    conflicts            = EXCLUDED.conflicts,
    ph_range_min         = EXCLUDED.ph_range_min,
    ph_range_max         = EXCLUDED.ph_range_max,
    temp_range_min       = EXCLUDED.temp_range_min,
    temp_range_max       = EXCLUDED.temp_range_max,
    o2_requirement       = EXCLUDED.o2_requirement,
    bsf_pathway_safe     = EXCLUDED.bsf_pathway_safe,
    guardrail_flag       = EXCLUDED.guardrail_flag,
    guardrail_note       = EXCLUDED.guardrail_note,
    cfi_status           = EXCLUDED.cfi_status,
    supplier_ref         = EXCLUDED.supplier_ref,
    source_file          = EXCLUDED.source_file;

-- Organism 2: Saccharomyces cerevisiae
INSERT INTO cfi_biological_library (
    organism_name, strain_code, organism_type, key_function,
    bsf_uplift_pct, dose_rate, dose_units, cost_per_unit, cost_per_t_fw,
    synergies, conflicts, ph_range_min, ph_range_max,
    temp_range_min, temp_range_max, o2_requirement,
    bsf_pathway_safe, guardrail_flag, guardrail_note,
    cfi_status, supplier_ref, doi_reference, source_file, is_active
)
VALUES (
    'Saccharomyces cerevisiae', 'Commercial', 'Yeast',
    'NH₃ retention via NH₄⁺ assimilation + ethanol fermentation. Reduces NH₃ by 50%.',
    NULL, 5, 'mL/kg substrate', 0.022, 0.11,
    'Lactobacillus EM-4 (pH synergy)', 'None known',
    4.0, 8.0, 25, 40, 'Facultative anaerobe',
    TRUE, 'DATA_GAP', 'BSF uplift % = DATA GAP — no DOI confirmed for uplift on EFB/OPDC substrate.',
    'ACTIVE — CFI ONE-SHOT PROTOCOL Day 1', 'Angel Yeast Indonesia / local brew',
    'DATA GAP — NH₃ reduction 50%: systematic search required',
    'CFI_Biologicals_Calculator_v1.xlsx | ORGANISM_DATABASE row 2 | Mar 2026', TRUE
)
ON CONFLICT (organism_name) DO UPDATE SET
    strain_code = EXCLUDED.strain_code, key_function = EXCLUDED.key_function,
    dose_rate = EXCLUDED.dose_rate, cost_per_unit = EXCLUDED.cost_per_unit,
    cost_per_t_fw = EXCLUDED.cost_per_t_fw, synergies = EXCLUDED.synergies,
    ph_range_min = EXCLUDED.ph_range_min, ph_range_max = EXCLUDED.ph_range_max,
    temp_range_min = EXCLUDED.temp_range_min, temp_range_max = EXCLUDED.temp_range_max,
    o2_requirement = EXCLUDED.o2_requirement, bsf_pathway_safe = EXCLUDED.bsf_pathway_safe,
    guardrail_flag = EXCLUDED.guardrail_flag, source_file = EXCLUDED.source_file;

-- Organism 3: Bacillus subtilis
INSERT INTO cfi_biological_library (
    organism_name, strain_code, organism_type, key_function,
    bsf_uplift_pct, dose_rate, dose_units, cost_per_unit, cost_per_t_fw,
    synergies, conflicts, ph_range_min, ph_range_max,
    temp_range_min, temp_range_max, o2_requirement,
    bsf_pathway_safe, guardrail_flag, guardrail_note,
    cfi_status, supplier_ref, doi_reference, source_file, is_active
)
VALUES (
    'Bacillus subtilis', 'ICBB / local', 'Bacterium (gram+)',
    'Cellulase & xylanase production. Replaces commercial enzyme (79× cheaper than Novozymes Cellic CTec3). Fast-track 7–10 day pathway compatible.',
    NULL, 1, 'g/kg substrate', 0.02, 0.02,
    'Trichoderma harzianum (enzyme synergy); Paenibacillus polymyxa', 'None known',
    5.5, 8.5, 25, 50, 'Aerobe',
    TRUE, 'AMBER', 'Iturin antimicrobial production risk at high field doses — MONITOR consortium compatibility.',
    'ACTIVE — CFI ONE-SHOT PROTOCOL Day 1', 'IPB-ICBB Bogor; Provibio',
    'Zhu F et al. 2025 — J Material Cycles Waste Management. DOI pending CFI verification.',
    'CFI_Biologicals_Calculator_v1.xlsx | ORGANISM_DATABASE row 3 | Mar 2026', TRUE
)
ON CONFLICT (organism_name) DO UPDATE SET
    key_function = EXCLUDED.key_function, dose_rate = EXCLUDED.dose_rate,
    cost_per_unit = EXCLUDED.cost_per_unit, cost_per_t_fw = EXCLUDED.cost_per_t_fw,
    synergies = EXCLUDED.synergies, ph_range_min = EXCLUDED.ph_range_min,
    ph_range_max = EXCLUDED.ph_range_max, temp_range_min = EXCLUDED.temp_range_min,
    temp_range_max = EXCLUDED.temp_range_max, guardrail_flag = EXCLUDED.guardrail_flag,
    guardrail_note = EXCLUDED.guardrail_note, source_file = EXCLUDED.source_file;

-- Organism 4: Azotobacter vinelandii
INSERT INTO cfi_biological_library (
    organism_name, strain_code, organism_type, key_function,
    bsf_uplift_pct, dose_rate, dose_units, cost_per_unit, cost_per_t_fw,
    synergies, conflicts, ph_range_min, ph_range_max,
    temp_range_min, temp_range_max, o2_requirement,
    bsf_pathway_safe, guardrail_flag, guardrail_note,
    cfi_status, supplier_ref, doi_reference, source_file, is_active
)
VALUES (
    'Azotobacter vinelandii', 'Strain N-Fix', 'Bacterium (gram-)',
    'Biological N₂-fixation. Adds +0.5% N/DM to substrate. Gut-survivable by BSF larvae at pH 2–8 (Sarpong et al. 2022). Applied Day 1 + optional Day 7 boost.',
    NULL, 2, 'g/kg substrate', 0.025, 0.05,
    'Trichoderma harzianum (compatible); Bacillus subtilis', 'Strict anaerobes (O₂ sensitive)',
    6.0, 8.0, 20, 40, 'Aerobe (strict)',
    TRUE, 'DATA_GAP', 'BSF uplift % = DATA GAP. Gut survival confirmed (Sarpong 2022) — DOI needs full verification.',
    'ACTIVE — CFI ONE-SHOT PROTOCOL Day 1 + optional Day 7 boost', 'IPB-ICBB Bogor',
    'Sarpong DB et al. 2022 — Applied & Environmental Microbiology. Full DOI pending CFI verification.',
    'CFI_Biologicals_Calculator_v1.xlsx | ORGANISM_DATABASE row 4 | Mar 2026', TRUE
)
ON CONFLICT (organism_name) DO UPDATE SET
    strain_code = EXCLUDED.strain_code, key_function = EXCLUDED.key_function,
    dose_rate = EXCLUDED.dose_rate, cost_per_unit = EXCLUDED.cost_per_unit,
    cost_per_t_fw = EXCLUDED.cost_per_t_fw, synergies = EXCLUDED.synergies,
    conflicts = EXCLUDED.conflicts, ph_range_min = EXCLUDED.ph_range_min,
    ph_range_max = EXCLUDED.ph_range_max, bsf_pathway_safe = EXCLUDED.bsf_pathway_safe,
    source_file = EXCLUDED.source_file;

-- Organism 5: Trichoderma harzianum (MANDATORY for plantation clients)
INSERT INTO cfi_biological_library (
    organism_name, strain_code, organism_type, key_function,
    bsf_uplift_pct, dose_rate, dose_units, cost_per_unit, cost_per_t_fw,
    synergies, conflicts, ph_range_min, ph_range_max,
    temp_range_min, temp_range_max, o2_requirement,
    bsf_pathway_safe, guardrail_flag, guardrail_note,
    cfi_status, supplier_ref, doi_reference, source_file, is_active
)
VALUES (
    'Trichoderma harzianum', 'T-22 / ICBB', 'Fungus',
    '⭐ MANDATORY for plantation clients (PTPN, Lonsum, SMART). Ganoderma boninense biocontrol via VOC antagonism (60–80% spore suppression) + mycoparasitism (40–70% colony reduction). Secondary: cellulase + xylanase enzyme production. Shelf life 6–12 months refrigerated at 2–8°C.',
    NULL, 2, 'g/kg substrate', 0.21, 0.42,
    'Bacillus subtilis (enzyme synergy); Azotobacter vinelandii (compatible)', 'Strict anaerobes; substrate pH >8.0',
    5.0, 7.5, 25, 40, 'Aerobe',
    TRUE, 'AMBER', 'Do NOT apply when substrate pH >8.0 — wait for neutralisation. Pile temperature >50°C kills fungi. BSF uplift % = DATA GAP.',
    'MANDATORY — PTPN / Lonsum / SMART plantation clients. CFI ONE-SHOT PROTOCOL Day 1.',
    'IPB-ICBB Bogor; Provibio; Koppert Indonesia (Trianum-P)',
    'CFI Plantation Contract Requirement (PTPN, Lonsum, SMART). Alvarez-Rivera G et al. 2023 — Biological Control (DOI pending verification).',
    'CFI_Biologicals_Calculator_v1.xlsx | ORGANISM_DATABASE row 5 + TRICHODERMA_BIOCONTROL sheet | Mar 2026', TRUE
)
ON CONFLICT (organism_name) DO UPDATE SET
    strain_code = EXCLUDED.strain_code, key_function = EXCLUDED.key_function,
    dose_rate = EXCLUDED.dose_rate, cost_per_unit = EXCLUDED.cost_per_unit,
    cost_per_t_fw = EXCLUDED.cost_per_t_fw, synergies = EXCLUDED.synergies,
    conflicts = EXCLUDED.conflicts, ph_range_min = EXCLUDED.ph_range_min,
    ph_range_max = EXCLUDED.ph_range_max, temp_range_min = EXCLUDED.temp_range_min,
    temp_range_max = EXCLUDED.temp_range_max, guardrail_flag = EXCLUDED.guardrail_flag,
    guardrail_note = EXCLUDED.guardrail_note, cfi_status = EXCLUDED.cfi_status,
    source_file = EXCLUDED.source_file;

-- Organism 6: Phanerochaete chrysosporium (SLOW-TRACK ONLY — 21d)
INSERT INTO cfi_biological_library (
    organism_name, strain_code, organism_type, key_function,
    bsf_uplift_pct, dose_rate, dose_units, cost_per_unit, cost_per_t_fw,
    synergies, conflicts, ph_range_min, ph_range_max,
    temp_range_min, temp_range_max, o2_requirement,
    bsf_pathway_safe, guardrail_flag, guardrail_note,
    cfi_status, supplier_ref, doi_reference, source_file, is_active
)
VALUES (
    'Phanerochaete chrysosporium', 'ATCC 24725', 'White-rot fungus',
    'Lignin degradation via LiP/MnP enzymes. Slow-track 21-day pathway only — INCOMPATIBLE with CFI 7–10 day fast-track.',
    NULL, 5, 'g/kg substrate', 0.80, 4.00,
    'None in 7–10 day fast-track', 'Anaerobes; fast-track incompatible',
    4.5, 6.5, 30, 40, 'Aerobe',
    FALSE, 'RED',
    'EXCLUDED from CFI fast-track (7–10 day) pathway. Slow-track 21-day only. High cost ($4/t FW). No DOI confirmed for EFB/OPDC uplift. Not recommended for current CFI design basis.',
    'SLOW-TRACK ONLY — 21d. Not approved for CFI standard protocol.',
    'Novozymes / research lab only',
    'DATA GAP — no specific DOI confirmed for lignin uplift on EFB/OPDC substrate.',
    'CFI_Biologicals_Calculator_v1.xlsx | ORGANISM_DATABASE row 6 | Mar 2026', TRUE
)
ON CONFLICT (organism_name) DO UPDATE SET
    key_function = EXCLUDED.key_function, dose_rate = EXCLUDED.dose_rate,
    cost_per_t_fw = EXCLUDED.cost_per_t_fw, bsf_pathway_safe = EXCLUDED.bsf_pathway_safe,
    guardrail_flag = EXCLUDED.guardrail_flag, guardrail_note = EXCLUDED.guardrail_note,
    cfi_status = EXCLUDED.cfi_status, source_file = EXCLUDED.source_file;

-- Organism 7: Pleurotus ostreatus (SLOW-TRACK ONLY — 21d)
INSERT INTO cfi_biological_library (
    organism_name, strain_code, organism_type, key_function,
    bsf_uplift_pct, dose_rate, dose_units, cost_per_unit, cost_per_t_fw,
    synergies, conflicts, ph_range_min, ph_range_max,
    temp_range_min, temp_range_max, o2_requirement,
    bsf_pathway_safe, guardrail_flag, guardrail_note,
    cfi_status, supplier_ref, doi_reference, source_file, is_active
)
VALUES (
    'Pleurotus ostreatus', 'P001', 'Edible fungus (ligninolytic)',
    'Selective lignin degradation with cellulose preservation. Slow-track 21-day pathway only — INCOMPATIBLE with CFI 7–10 day fast-track.',
    NULL, 10, 'g/kg substrate', 0.60, 6.00,
    'None in fast-track', '7–10 day fast-track incompatible',
    5.0, 7.5, 20, 30, 'Aerobe',
    FALSE, 'RED',
    'EXCLUDED from CFI fast-track pathway. Slow-track 21-day only. High cost ($6/t FW). No DOI confirmed. Not recommended for current CFI design basis.',
    'SLOW-TRACK ONLY — 21d. Not approved for CFI standard protocol.',
    'Local mushroom suppliers',
    'DATA GAP — no specific DOI confirmed for uplift on EFB/OPDC substrate.',
    'CFI_Biologicals_Calculator_v1.xlsx | ORGANISM_DATABASE row 7 | Mar 2026', TRUE
)
ON CONFLICT (organism_name) DO UPDATE SET
    key_function = EXCLUDED.key_function, dose_rate = EXCLUDED.dose_rate,
    cost_per_t_fw = EXCLUDED.cost_per_t_fw, bsf_pathway_safe = EXCLUDED.bsf_pathway_safe,
    guardrail_flag = EXCLUDED.guardrail_flag, guardrail_note = EXCLUDED.guardrail_note,
    cfi_status = EXCLUDED.cfi_status, source_file = EXCLUDED.source_file;

-- Organism 8: Aspergillus niger
INSERT INTO cfi_biological_library (
    organism_name, strain_code, organism_type, key_function,
    bsf_uplift_pct, dose_rate, dose_units, cost_per_unit, cost_per_t_fw,
    synergies, conflicts, ph_range_min, ph_range_max,
    temp_range_min, temp_range_max, o2_requirement,
    bsf_pathway_safe, guardrail_flag, guardrail_note,
    cfi_status, supplier_ref, doi_reference, source_file, is_active
)
VALUES (
    'Aspergillus niger', 'ICBB / AN400', 'Fungus',
    'Hemicellulose breakdown via xylanase + citric acid production. pH-sensitive — alkaline substrate INCOMPATIBLE.',
    NULL, 2, 'g/kg substrate', 0.15, 0.30,
    'Bacillus subtilis (enzyme synergy)', 'Alkaline pH incompatible (>6.5 inhibits growth)',
    2.0, 6.5, 25, 37, 'Aerobe',
    TRUE, 'AMBER',
    'CAUTION: Alkaline pH incompatible — do not apply until substrate pH <6.5. Apply after full neutralisation post-PKSA. BSF uplift % = DATA GAP.',
    'CONDITIONAL — Apply ONLY when substrate pH ≤6.5. Requires pH confirmation before use.',
    'IPB-ICBB Bogor; Sinopharm',
    'DATA GAP — no uplift DOI confirmed.',
    'CFI_Biologicals_Calculator_v1.xlsx | ORGANISM_DATABASE row 8 | Mar 2026', TRUE
)
ON CONFLICT (organism_name) DO UPDATE SET
    key_function = EXCLUDED.key_function, conflicts = EXCLUDED.conflicts,
    guardrail_flag = EXCLUDED.guardrail_flag, guardrail_note = EXCLUDED.guardrail_note,
    cfi_status = EXCLUDED.cfi_status, source_file = EXCLUDED.source_file;

-- Organism 9: Paenibacillus polymyxa
INSERT INTO cfi_biological_library (
    organism_name, strain_code, organism_type, key_function,
    bsf_uplift_pct, dose_rate, dose_units, cost_per_unit, cost_per_t_fw,
    synergies, conflicts, ph_range_min, ph_range_max,
    temp_range_min, temp_range_max, o2_requirement,
    bsf_pathway_safe, guardrail_flag, guardrail_note,
    cfi_status, supplier_ref, doi_reference, source_file, is_active
)
VALUES (
    'Paenibacillus polymyxa', 'NRRL B-4158', 'Bacterium',
    'Xylanase + hemicellulase production. N-fixation. Antifungal peptide secretion (Ganoderma suppression support).',
    NULL, 2, 'g/kg substrate', 0.10, 0.20,
    'Bacillus subtilis; Trichoderma harzianum', 'None known',
    5.5, 8.0, 25, 40, 'Facultative anaerobe',
    TRUE, 'DATA_GAP',
    'BSF uplift % = DATA GAP. No peer-reviewed DOI confirmed for EFB/OPDC substrate. Optional enhancement — not in core one-shot protocol.',
    'OPTIONAL — Not in CFI standard one-shot protocol. Future consideration pending DOI confirmation.',
    'IPB-ICBB Bogor',
    'DATA GAP — no uplift DOI confirmed.',
    'CFI_Biologicals_Calculator_v1.xlsx | ORGANISM_DATABASE row 9 | Mar 2026', TRUE
)
ON CONFLICT (organism_name) DO UPDATE SET
    strain_code = EXCLUDED.strain_code, key_function = EXCLUDED.key_function,
    dose_rate = EXCLUDED.dose_rate, cost_per_unit = EXCLUDED.cost_per_unit,
    cost_per_t_fw = EXCLUDED.cost_per_t_fw, synergies = EXCLUDED.synergies,
    bsf_pathway_safe = EXCLUDED.bsf_pathway_safe, source_file = EXCLUDED.source_file;

-- Organism 10: Bt ICBB 6095 — EXCLUDED from BSF pathway
-- ⚠  NOTE: Per CFI guardrails (March 2026), Bt ICBB 6095 is ALLOWED in
--    S3 COMPOSTING pathway only (amber warning) — NOT in BSF substrate.
--    This record marks it as EXCLUDED from BSF pathway specifically.
--    The composting-pathway amber flag is maintained in cfi_guardrails.
INSERT INTO cfi_biological_library (
    organism_name, strain_code, organism_type, key_function,
    bsf_pathway_safe, guardrail_flag, guardrail_note,
    cfi_status, doi_reference, source_file, is_active
)
VALUES (
    'Bt ICBB 6095', 'ICBB 6095', 'Bacterium (Bacillus thuringiensis)',
    'Insecticidal toxin production. Bt delta-endotoxin is lethal to BSF larvae (Diptera). NEVER apply to BSF substrates.',
    FALSE, 'RED',
    '❌ PERMANENTLY EXCLUDED from BSF pathway. Bt delta-endotoxin kills BSF larvae — incompatible with ALL BSF substrates. CFI guardrail (March 2026): Bt ALLOWED in S3 composting pathway ONLY (amber warning) — confirm titre decay <10⁴ CFU/g before S4 BSF loading. Never apply to S4 BSF substrate.',
    '❌ EXCLUDED from BSF pathway. S3 composting-only — amber guardrail applies.',
    'CFI Exclusion — Bt toxin confirmed lethal to BSF larvae (Diptera order).',
    'CFI_Biologicals_Calculator_v1.xlsx | ORGANISM_DATABASE row 10 | Mar 2026', TRUE
)
ON CONFLICT (organism_name) DO UPDATE SET
    bsf_pathway_safe = EXCLUDED.bsf_pathway_safe,
    guardrail_flag   = EXCLUDED.guardrail_flag,
    guardrail_note   = EXCLUDED.guardrail_note,
    cfi_status       = EXCLUDED.cfi_status,
    source_file      = EXCLUDED.source_file;

-- ================================================================
-- SECTION 2 — CREATE TABLE: cfi_supplier_database
-- ================================================================

CREATE TABLE IF NOT EXISTS cfi_supplier_database (
    id                  BIGSERIAL PRIMARY KEY,
    supplier_no         INTEGER,
    region              TEXT NOT NULL,
    supplier_name       TEXT NOT NULL,
    product_organism    TEXT NOT NULL,
    cfu_concentration   TEXT,
    pack_size           TEXT,
    est_price           TEXT,
    lead_time           TEXT,
    contact_website     TEXT,
    notes               TEXT,
    data_quality        TEXT DEFAULT 'INDICATIVE — verify directly with supplier',
    source_file         TEXT,
    is_active           BOOLEAN DEFAULT TRUE,
    created_at          TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO cfi_supplier_database (
    supplier_no, region, supplier_name, product_organism,
    cfu_concentration, pack_size, est_price, lead_time,
    contact_website, notes, source_file
) VALUES
(1, 'Indonesia', 'EM4 Indonesia (Songgolangit)',
 'EM-4 Pertanian (Lactobacillus consortium)',
 'Mixed LAB >10⁷ CFU/mL', '1 L bottle', 'IDR 25,000–35,000/L', 'Same day',
 'www.em4.co.id', 'Widely available in agricultural stores.',
 'CFI_Biologicals_Calculator_v1.xlsx | SUPPLIER_DATABASE row 1 | Mar 2026'),

(2, 'Indonesia', 'IPB-ICBB Bogor',
 'Bacillus subtilis, Azotobacter, Trichoderma strains',
 '10⁸–10⁹ CFU/g', '100 g – 1 kg', 'DATA GAP — contact directly', '2–4 weeks',
 'ICBB, IPB Campus Bogor, West Java',
 'Research-grade; non-GMO; Indonesian strains. CFI key partner — Prof. Dwi Andreas Santosa.',
 'CFI_Biologicals_Calculator_v1.xlsx | SUPPLIER_DATABASE row 2 | Mar 2026'),

(3, 'Indonesia', 'Provibio Indonesia',
 'Super Bio Boost (multi-organism consortium: Bacillus, Trichoderma, LAB)',
 '>10⁸ CFU/mL', '1 L / 5 L', 'DATA GAP — contact directly', '1–2 weeks',
 'DATA GAP — see Provibio Research PDF',
 'Contains Bacillus, Trichoderma, LAB. CFI partner — see Provibio consortium file.',
 'CFI_Biologicals_Calculator_v1.xlsx | SUPPLIER_DATABASE row 3 | Mar 2026'),

(4, 'Indonesia', 'PT Petrosida Gresik',
 'Trichoderma harzianum products',
 '10⁷–10⁸ spores/g', '250 g – 1 kg', 'DATA GAP — contact supplier', '1–2 weeks',
 'www.petrosida.co.id', 'PTPN-approved; available nationally.',
 'CFI_Biologicals_Calculator_v1.xlsx | SUPPLIER_DATABASE row 4 | Mar 2026'),

(5, 'Indonesia', 'Koppert Indonesia',
 'Trianum-P (Trichoderma harzianum T-22)',
 '1×10⁹ spores/g', '1 kg', 'USD 25–40/kg', '1–3 weeks',
 'www.koppert.com/id', 'Plantation-grade; cold chain required (2–8°C).',
 'CFI_Biologicals_Calculator_v1.xlsx | SUPPLIER_DATABASE row 5 | Mar 2026'),

(6, 'SE Asia', 'Kaishi Biotech (Malaysia)',
 'Bacillus subtilis consortium',
 '10⁸ CFU/g', '1 kg', 'USD 15–25/kg', '2–3 weeks',
 'www.kaishibiotech.com', 'Halal certified; palm oil sector experience.',
 'CFI_Biologicals_Calculator_v1.xlsx | SUPPLIER_DATABASE row 6 | Mar 2026'),

(7, 'SE Asia', 'Novagen Biotech (Thailand)',
 'Trichoderma + Bacillus blends',
 '10⁸ CFU/g', '1–5 kg', 'USD 20–35/kg', '2–4 weeks',
 'DATA GAP — contact supplier', 'SE Asia distribution.',
 'CFI_Biologicals_Calculator_v1.xlsx | SUPPLIER_DATABASE row 7 | Mar 2026'),

(8, 'China', 'Shanghai Kehua (Alibaba)',
 'Trichoderma harzianum powder',
 '10⁹ spores/g', '1 kg – 25 kg', 'USD 8–15/kg', '3–6 weeks (inc. shipping)',
 'Alibaba: search Trichoderma harzianum',
 'MOQ 1 kg; quality variable — always request Certificate of Analysis (COA). 65% nameplate derate applies per CFI equipment policy.',
 'CFI_Biologicals_Calculator_v1.xlsx | SUPPLIER_DATABASE row 8 | Mar 2026'),

(9, 'China', 'Angel Yeast Co. Ltd',
 'Saccharomyces cerevisiae active dry yeast',
 '10¹⁰ cells/g', '500 g – 25 kg', 'USD 3–8/kg', '3–4 weeks',
 'www.angelyeast.com', 'Food-grade available; high reliability.',
 'CFI_Biologicals_Calculator_v1.xlsx | SUPPLIER_DATABASE row 9 | Mar 2026'),

(10, 'Global', 'Novozymes A/S',
 'Cellic CTec3 (commercial cellulase enzyme)',
 '300 FPU/mL', '1 L – 200 L', 'USD 1.58/t FW equivalent', '4–8 weeks',
 'www.novozymes.com',
 '⚠ 79× more expensive than Bacillus cellulase — use ONLY if Bacillus subtilis fails field trial. Fallback option only.',
 'CFI_Biologicals_Calculator_v1.xlsx | SUPPLIER_DATABASE row 10 | Mar 2026'),

(11, 'Global', 'DSM (Firmenich)',
 'Bacillus-based biocontrol products',
 '10⁸–10⁹ CFU/g', '1 kg – 20 kg', 'DATA GAP', '4–8 weeks',
 'www.dsm.com', 'Premium quality; global regulatory support.',
 'CFI_Biologicals_Calculator_v1.xlsx | SUPPLIER_DATABASE row 11 | Mar 2026'),

(12, 'Global', 'BASF AgSolutions',
 'Serenade ASO (Bacillus subtilis QST 713)',
 '10⁹ CFU/mL', '1 L – 10 L', 'USD 40–80/L', '4–6 weeks',
 'www.agriculture.basf.com',
 'Registered biopesticide. Check Indonesian import regulations before purchasing.',
 'CFI_Biologicals_Calculator_v1.xlsx | SUPPLIER_DATABASE row 12 | Mar 2026')

ON CONFLICT DO NOTHING;

-- ================================================================
-- SECTION 3 — CREATE TABLE: cfi_bsf_handoff_gate
-- 6 criteria that ALL must PASS before BSF larvae introduction
-- ================================================================

CREATE TABLE IF NOT EXISTS cfi_bsf_handoff_gate (
    id              BIGSERIAL PRIMARY KEY,
    criterion_no    INTEGER NOT NULL,
    criterion_name  TEXT NOT NULL,
    description     TEXT NOT NULL,
    required_min    TEXT,
    required_max    TEXT,
    required_range  TEXT NOT NULL,
    kill_zone       TEXT NOT NULL,
    action_if_fail  TEXT NOT NULL,
    is_guardrail    BOOLEAN DEFAULT TRUE,
    source_file     TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO cfi_bsf_handoff_gate (
    criterion_no, criterion_name, description,
    required_min, required_max, required_range,
    kill_zone, action_if_fail, is_guardrail, source_file
) VALUES
(1, 'pH',
 'Substrate pH at point of BSF larvae introduction.',
 '6.5', '8.0', '6.5 – 8.0',
 '>9.0 kills microbes | <5.5 too acidic for BSF colonisation',
 'Wait 24–48h for pH to stabilise. Do NOT add more PKSA.',
 TRUE,
 'CFI_Biologicals_Calculator_v1.xlsx | BSF_HANDOFF_GATE row 1 | Mar 2026'),

(2, 'Temperature',
 'Substrate pile temperature (°C) at time of BSF larvae introduction.',
 '35', '45', '35 – 45°C',
 '>50°C kills fungi and denatures biological inoculants | <30°C too cold for BSF larval activity',
 'Turn pile to cool; add water; shade pile from direct sun if overheating.',
 TRUE,
 'CFI_Biologicals_Calculator_v1.xlsx | BSF_HANDOFF_GATE row 2 | Mar 2026'),

(3, 'Moisture',
 'Substrate moisture content (%) at time of BSF larvae introduction.',
 '50', '65', '50 – 65%',
 '<40% desiccates organisms and BSF larvae | >70% creates anaerobic zones incompatible with BSF',
 'Add water if MC <50%. Turn / aerate pile if MC >65%.',
 TRUE,
 'CFI_Biologicals_Calculator_v1.xlsx | BSF_HANDOFF_GATE row 3 | Mar 2026'),

(4, 'Time since PKSA application',
 'Minimum hours elapsed since PKSA was applied to substrate.',
 '24', NULL, '≥ 24 hours',
 '<24h = alkaline shock still active; organisms not yet established',
 'Wait until 24 hours have passed. Re-measure pH before proceeding.',
 TRUE,
 'CFI_Biologicals_Calculator_v1.xlsx | BSF_HANDOFF_GATE row 4 | Mar 2026'),

(5, 'Visual / Odour check',
 'No strong ammonia smell; no visible black or green mould blooms (white mycelium acceptable).',
 NULL, NULL, 'Earthy smell; white mycelium OK',
 'Strong NH₃ odour = nitrogen volatilisation active | Black or green mould = contamination risk',
 'Aerate pile. Re-dose Saccharomyces cerevisiae if NH₃ strong. Remove and quarantine black/green mould patches.',
 FALSE,
 'CFI_Biologicals_Calculator_v1.xlsx | BSF_HANDOFF_GATE row 5 | Mar 2026'),

(6, 'Biological pre-treatment confirmation',
 'All 5 one-shot organisms confirmed applied at least 24 hours before BSF larvae introduction.',
 NULL, NULL, 'All 5 organisms applied; ≥ 24h elapsed',
 'BSF introduced before biological inoculants have activated = poor colonisation result',
 'Apply any missing organisms. Wait minimum 24h before BSF larvae introduction.',
 TRUE,
 'CFI_Biologicals_Calculator_v1.xlsx | BSF_HANDOFF_GATE row 6 | Mar 2026')

ON CONFLICT DO NOTHING;

-- ================================================================
-- SECTION 4 — CREATE TABLE: cfi_inoculation_protocols
-- Three inoculation strategy options (A / B / C)
-- ================================================================

CREATE TABLE IF NOT EXISTS cfi_inoculation_protocols (
    id                  BIGSERIAL PRIMARY KEY,
    option_code         CHAR(1) NOT NULL UNIQUE,
    option_name         TEXT NOT NULL,
    description         TEXT NOT NULL,
    day1_organisms      TEXT NOT NULL,
    day1_cost_per_t_fw  NUMERIC(6,3) NOT NULL,
    day7_addon          TEXT,
    day7_cost_per_t_fw  NUMERIC(6,3) DEFAULT 0,
    day14_addon         TEXT,
    day14_cost_min      NUMERIC(6,3) DEFAULT 0,
    day14_cost_max      NUMERIC(6,3) DEFAULT 0,
    total_cost_min      NUMERIC(6,3) NOT NULL,
    total_cost_max      NUMERIC(6,3) NOT NULL,
    is_cfi_default      BOOLEAN DEFAULT FALSE,
    source_file         TEXT,
    created_at          TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO cfi_inoculation_protocols (
    option_code, option_name, description,
    day1_organisms, day1_cost_per_t_fw,
    day7_addon, day7_cost_per_t_fw,
    day14_addon, day14_cost_min, day14_cost_max,
    total_cost_min, total_cost_max, is_cfi_default, source_file
) VALUES
('A', 'ONE-SHOT (Default)',
 'Single inoculation at Day 1 (24h post-PKSA). All 5 organisms applied simultaneously. CFI recommended default for standard operations.',
 'Lactobacillus EM-4 + Saccharomyces cerevisiae + Bacillus subtilis + Azotobacter vinelandii + Trichoderma harzianum',
 0.65, NULL, 0, NULL, 0, 0, 0.65, 0.65, TRUE,
 'CFI_Biologicals_Calculator_v1.xlsx | INOCULATION_OPTIONS | Mar 2026'),

('B', 'TWO INOCULATIONS',
 'Day 1 one-shot + Day 7 Azotobacter N-fixer boost. Enhances nitrogen enrichment for premium NPK targets.',
 'All 5 core organisms (same as Option A)',
 0.65,
 'Azotobacter vinelandii (N-fixation boost dose)', 0.05,
 NULL, 0, 0, 0.70, 0.70, FALSE,
 'CFI_Biologicals_Calculator_v1.xlsx | INOCULATION_OPTIONS | Mar 2026'),

('C', 'THREE INOCULATIONS',
 'Day 1 + Day 7 + Day 14. Maximum biological activation. Day 14 adds Trichoderma maturation dose + optional commercial cellulase/xylanase enzyme boost.',
 'All 5 core organisms (same as Option A)',
 0.65,
 'Azotobacter vinelandii (N-fixation boost)', 0.05,
 'Trichoderma harzianum (maturation dose) + optional commercial cellulase/xylanase enzyme boost', 0.50, 1.50,
 1.20, 2.20, FALSE,
 'CFI_Biologicals_Calculator_v1.xlsx | INOCULATION_OPTIONS | Mar 2026')

ON CONFLICT (option_code) DO UPDATE SET
    description         = EXCLUDED.description,
    day1_organisms      = EXCLUDED.day1_organisms,
    day1_cost_per_t_fw  = EXCLUDED.day1_cost_per_t_fw,
    day7_addon          = EXCLUDED.day7_addon,
    day7_cost_per_t_fw  = EXCLUDED.day7_cost_per_t_fw,
    day14_addon         = EXCLUDED.day14_addon,
    day14_cost_min      = EXCLUDED.day14_cost_min,
    day14_cost_max      = EXCLUDED.day14_cost_max,
    total_cost_min      = EXCLUDED.total_cost_min,
    total_cost_max      = EXCLUDED.total_cost_max,
    is_cfi_default      = EXCLUDED.is_cfi_default;

-- ================================================================
-- SECTION 5 — CREATE TABLE: cfi_biologicals_references
-- Source registry — every DATA GAP flagged for resolution
-- ================================================================

CREATE TABLE IF NOT EXISTS cfi_biologicals_references (
    id              BIGSERIAL PRIMARY KEY,
    ref_no          INTEGER,
    authors         TEXT,
    year            TEXT,
    title           TEXT NOT NULL,
    journal         TEXT,
    doi_url         TEXT,
    what_it_supports TEXT NOT NULL,
    quality_check   TEXT,
    doi_status      TEXT DEFAULT 'PENDING VERIFICATION',
    source_file     TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO cfi_biologicals_references (
    ref_no, authors, year, title, journal, doi_url,
    what_it_supports, quality_check, doi_status, source_file
) VALUES
(1, 'Newton GL, Booram CV, Barker RW, Hale OM', '1977',
 'Dried Hermetia illucens larvae meal as a supplement for swine',
 'Journal of Animal Science', '10.2527/jas1977.44395x',
 'BSF protein quality as animal feed baseline', 'JCR-indexed; primary',
 'CONFIRMED', 'CFI_Biologicals_Calculator_v1.xlsx | REFERENCES_DOI row 1 | Mar 2026'),

(2, 'Nguyen TTX, Tomberlin JK, Vanlaerhoven S', '2015',
 'Ability of BSF larvae to recycle food waste',
 'Environmental Entomology', '10.1093/ee/nvv117',
 'BSF substrate conversion general baseline', 'JCR-indexed; primary',
 'CONFIRMED', 'CFI_Biologicals_Calculator_v1.xlsx | REFERENCES_DOI row 2 | Mar 2026'),

(3, 'Sarpong DB et al.', '2022',
 'Digestibility of Azotobacter by BSF gut (pH 2–8)',
 'Applied and Environmental Microbiology', 'DATA GAP — full citation to be verified',
 'Azotobacter gut survival in BSF; N-fixation protein source benefit',
 'CFI verified finding — DOI needed',
 'PENDING VERIFICATION',
 'CFI_Biologicals_Calculator_v1.xlsx | REFERENCES_DOI row 3 | Mar 2026'),

(4, 'Zhu F et al.', '2025',
 'Bacillus subtilis cellulase production at $0.02/t FW — 79× cheaper than commercial enzyme',
 'Journal of Material Cycles and Waste Management', 'DATA GAP — full citation to be verified',
 'Bacillus cellulase cost advantage over Novozymes Cellic CTec3',
 'CFI verified finding — DOI needed',
 'PENDING VERIFICATION',
 'CFI_Biologicals_Calculator_v1.xlsx | REFERENCES_DOI row 4 | Mar 2026'),

(5, 'Sarto MVM et al.', '2023',
 'Fast-track 7–10 day BSF pathway via Bacillus pre-treatment',
 'Waste Management', 'DATA GAP — full citation to be verified',
 'Fast-track 7–10 day pathway confirmation for Bacillus-pre-treated substrate',
 'CFI verified finding — DOI needed',
 'PENDING VERIFICATION',
 'CFI_Biologicals_Calculator_v1.xlsx | REFERENCES_DOI row 5 | Mar 2026'),

(6, 'Multiple authors (to be identified)', 'Various',
 'Lactobacillus pH reduction and methanogen inhibition — CH₄ reduction 70–80%',
 'Multiple journals', 'DATA GAP — systematic search required (10+ sources)',
 'CH₄ reduction 70–80% mechanism; GAS_EMISSIONS sheet CH₄ reduction factor',
 'Requires systematic search + 10+ source cross-validation',
 'DATA GAP — OPEN',
 'CFI_Biologicals_Calculator_v1.xlsx | REFERENCES_DOI row 6 | Mar 2026'),

(7, 'Multiple authors (to be identified)', 'Various',
 'Saccharomyces cerevisiae NH₄⁺ assimilation — NH₃ reduction 50%',
 'Multiple journals', 'DATA GAP — systematic search required (10+ sources)',
 'NH₃ reduction 50% mechanism; GAS_EMISSIONS sheet NH₃ reduction factor',
 'Requires systematic search + 10+ source cross-validation',
 'DATA GAP — OPEN',
 'CFI_Biologicals_Calculator_v1.xlsx | REFERENCES_DOI row 7 | Mar 2026'),

(8, 'CFI Internal', '2026',
 'CFI Locked Parameters: 60 TPH, 8,157 t FW/month, 62% MC, OPDC yield 15.2% EFB FW',
 'CFI Engineering Files', 'CFI Confirmed — not a public DOI',
 'All CFI-locked values in GREEN cells across biologicals calculator',
 'CFI engineering document — CLASS A guardrail',
 'CONFIRMED INTERNAL',
 'CFI_Biologicals_Calculator_v1.xlsx | REFERENCES_DOI row 8 | Mar 2026'),

(9, 'CFI Internal', '2026',
 'Trichoderma mandatory for PTPN, Lonsum, SMART plantations per CFI contract',
 'CFI Plantation Contract Requirement', 'CFI Confirmed — not a public DOI',
 'Trichoderma mandate for plantation clients (TRICHODERMA_BIOCONTROL sheet)',
 'CFI business requirement',
 'CONFIRMED INTERNAL',
 'CFI_Biologicals_Calculator_v1.xlsx | REFERENCES_DOI row 9 | Mar 2026'),

(10, 'CFI Internal', '2026',
 'PKSA K₂O content 35–45%; zero additional cost to CFI',
 'CFI Process Design', 'CFI Confirmed — not a public DOI',
 'POTASSIUM_PKSA sheet all values. K₂O contribution at $0 cost.',
 'CFI engineering document',
 'CONFIRMED INTERNAL',
 'CFI_Biologicals_Calculator_v1.xlsx | REFERENCES_DOI row 10 | Mar 2026'),

(11, 'Alvarez-Rivera G et al.', '2023',
 'Trichoderma harzianum VOC antagonism vs Ganoderma boninense — 60–80% spore suppression',
 'Biological Control', 'DATA GAP — full citation to be verified via Web of Science',
 'Trichoderma Ganoderma suppression mechanism (TRICHODERMA_BIOCONTROL sheet)',
 'DOI needed — search Web of Science',
 'PENDING VERIFICATION',
 'CFI_Biologicals_Calculator_v1.xlsx | REFERENCES_DOI row 11 | Mar 2026'),

(12, 'DATA GAP', '—',
 'BSF uplift (%) for each organism vs untreated EFB/OPDC control — systematic literature review required',
 'Multiple journals', 'DATA GAP — systematic search required per organism',
 'BSF Uplift (%) column — ALL organisms in ORGANISM_DATABASE and CONSORTIUMS_RANKED',
 'Requires 10+ sources per organism; priority for EIB documentation',
 'DATA GAP — OPEN (HIGH PRIORITY)',
 'CFI_Biologicals_Calculator_v1.xlsx | REFERENCES_DOI row 12 | Mar 2026')

ON CONFLICT DO NOTHING;

-- ================================================================
-- SECTION 6 — cfi_change_log
-- ================================================================

INSERT INTO cfi_change_log (
    change_type, description, affected_tables,
    source_file, class_level, changed_by, timestamp
) VALUES (
    'MIGRATION',
    'Migration 6: Biologicals Calculator v1.0 ingested. 10 organisms upserted to cfi_biological_library. 4 new tables created: cfi_supplier_database (12 rows), cfi_bsf_handoff_gate (6 criteria), cfi_inoculation_protocols (3 options A/B/C), cfi_biologicals_references (12 refs — 8 DATA GAPs flagged for resolution). Bt ICBB 6095 confirmed EXCLUDED from BSF pathway; S3 composting amber guardrail maintained in cfi_guardrails.',
    'cfi_biological_library, cfi_supplier_database, cfi_bsf_handoff_gate, cfi_inoculation_protocols, cfi_biologicals_references',
    'CFI_Biologicals_Calculator_v1.xlsx — Stage 3 | Mar 2026',
    'CLASS C',
    'Sharon (CFI Admin)',
    NOW()
);

-- ================================================================
-- VERIFICATION — run these SELECTs after migration to confirm
-- ================================================================

-- Expected: 10 organisms with updated flags
SELECT organism_name, bsf_pathway_safe, guardrail_flag, cost_per_t_fw
FROM cfi_biological_library
WHERE source_file LIKE '%Biologicals_Calculator%'
ORDER BY organism_name;

-- Expected: 12 supplier rows
SELECT supplier_no, region, supplier_name, est_price
FROM cfi_supplier_database
ORDER BY supplier_no;

-- Expected: 6 criteria, all is_guardrail = TRUE except row 5
SELECT criterion_no, criterion_name, required_range, is_guardrail
FROM cfi_bsf_handoff_gate
ORDER BY criterion_no;

-- Expected: 3 options (A/B/C), Option A is_cfi_default = TRUE
SELECT option_code, option_name, total_cost_min, total_cost_max, is_cfi_default
FROM cfi_inoculation_protocols
ORDER BY option_code;

-- Expected: 12 references, 8 PENDING/DATA GAP status flagged
SELECT ref_no, authors, year, doi_status
FROM cfi_biologicals_references
ORDER BY ref_no;

-- END CFI MIGRATION 6 — BIOLOGICALS — March 2026
-- ================================================================


-- ████████████████████████████████████████████████████████████████████████████████
-- FILE 9: sql/cfi_fertiliser_prices.sql
-- ████████████████████████████████████████████████████████████████████████████████

-- ═══════════════════════════════════════════════════════════════════════
-- CFI FERTILISER PRICES TABLE
-- ═══════════════════════════════════════════════════════════════════════
-- Purpose: Store CIF Indonesia fertiliser prices for value calculator
-- Updated by: Agent 6 (GitHub Actions price_agent.js)
-- Refresh: Every 15 days (1st + 16th of month)
-- ═══════════════════════════════════════════════════════════════════════

-- Drop table if exists (for clean migration)
DROP TABLE IF EXISTS public.cfi_fertiliser_prices;

-- Create table
CREATE TABLE public.cfi_fertiliser_prices (
  nutrient_id TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  price_usd_per_tonne NUMERIC(10,2) NOT NULL,
  source TEXT,
  price_date DATE,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT
);

-- Add indexes
CREATE INDEX idx_cfi_fertiliser_prices_updated ON public.cfi_fertiliser_prices(updated_at DESC);

-- Enable RLS
ALTER TABLE public.cfi_fertiliser_prices ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow public read access
CREATE POLICY "Allow public read access"
  ON public.cfi_fertiliser_prices
  FOR SELECT
  TO public
  USING (true);

-- RLS Policy: Allow service role full access
CREATE POLICY "Allow service role full access"
  ON public.cfi_fertiliser_prices
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Add comment
COMMENT ON TABLE public.cfi_fertiliser_prices IS 
  'CIF Indonesia fertiliser prices. Updated every 15 days by Agent 6 GitHub Actions workflow.';

-- ═══════════════════════════════════════════════════════════════════════
-- SEED DATA — MARCH 2026 BASELINE PRICES
-- ═══════════════════════════════════════════════════════════════════════
-- Source: ICIS CIF Indonesia + Industry estimates
-- These are fallback values — Agent 6 will update with live data
-- ═══════════════════════════════════════════════════════════════════════

INSERT INTO public.cfi_fertiliser_prices 
  (nutrient_id, display_name, price_usd_per_tonne, source, price_date, notes)
VALUES
  -- NPK Commodity Fertilisers
  ('urea_46_0_0', 'Urea (46-0-0)', 285.00, 'ICIS baseline', '2026-03-01', 
   'CIF Indonesia bulk. N content: 46% (460 kg N/t)'),
  
  ('dap_18_46_0', 'DAP (18-46-0)', 520.00, 'ICIS baseline', '2026-03-01', 
   'CIF Indonesia bulk. N: 18% (180 kg/t), P₂O₅: 46% (460 kg/t)'),
  
  ('mop_0_0_60', 'MOP (0-0-60)', 310.00, 'ICIS baseline', '2026-03-01', 
   'Potassium Chloride CIF Indonesia. K₂O: 60% (600 kg/t)'),
  
  -- Secondary Nutrients
  ('kieserite', 'Kieserite (MgSO₄)', 180.00, 'Industry avg', '2026-03-01', 
   'Magnesium sulphate. MgO: 27%, SO₃: 55%'),
  
  ('ag_lime_caco3', 'Ag Lime (CaCO₃)', 45.00, 'Industry avg', '2026-03-01', 
   'Agricultural limestone. CaCO₃: 85-95%'),
  
  -- Derived Nutrient Values (for reference)
  ('elemental_n', 'Elemental N', 0.62, 'Calculated', '2026-03-01', 
   'Derived: $285 Urea ÷ 460 kg N = $0.62/kg N'),
  
  ('elemental_p2o5', 'Elemental P₂O₅', 1.13, 'Calculated', '2026-03-01', 
   'Derived: $520 DAP ÷ 460 kg P₂O₅ = $1.13/kg P₂O₅'),
  
  ('elemental_k2o', 'Elemental K₂O', 0.52, 'Calculated', '2026-03-01', 
   'Derived: $310 MOP ÷ 600 kg K₂O = $0.52/kg K₂O'),
  
  ('elemental_mgo', 'Elemental MgO', 0.67, 'Calculated', '2026-03-01', 
   'Derived: $180 Kieserite ÷ 270 kg MgO = $0.67/kg MgO')

ON CONFLICT (nutrient_id) 
DO UPDATE SET
  price_usd_per_tonne = EXCLUDED.price_usd_per_tonne,
  source = EXCLUDED.source,
  price_date = EXCLUDED.price_date,
  updated_at = NOW();

-- ═══════════════════════════════════════════════════════════════════════
-- VERIFICATION
-- ═══════════════════════════════════════════════════════════════════════

-- Query to verify data
SELECT 
  nutrient_id,
  display_name,
  price_usd_per_tonne,
  source,
  price_date,
  TO_CHAR(updated_at, 'YYYY-MM-DD HH24:MI') as updated_at
FROM public.cfi_fertiliser_prices
ORDER BY 
  CASE 
    WHEN nutrient_id LIKE 'urea%' THEN 1
    WHEN nutrient_id LIKE 'dap%' THEN 2
    WHEN nutrient_id LIKE 'mop%' THEN 3
    WHEN nutrient_id = 'kieserite' THEN 4
    WHEN nutrient_id = 'ag_lime_caco3' THEN 5
    ELSE 6
  END;


-- ████████████████████████████████████████████████████████████████████████████████
-- FILE 10: sql/migrations/029_add_soil_micronutrient_metadata_columns.sql
-- ████████████████████████████████████████████████████████████████████████████████

-- ══════════════════════════════════════════════════════════════════════════
-- MIGRATION 29: Add Soil Micronutrient Metadata Columns
-- Date: March 26, 2026
-- Purpose: Add B, Zn, Cu, Fe, Mn columns to cfi_soil_profiles
-- ══════════════════════════════════════════════════════════════════════════

-- Add Boron (B) columns
ALTER TABLE cfi_soil_profiles
ADD COLUMN avail_b_degraded_mg_kg_low numeric,
ADD COLUMN avail_b_degraded_mg_kg_high numeric,
ADD COLUMN avail_b_target_mg_kg_low numeric,
ADD COLUMN avail_b_target_mg_kg_high numeric,
ADD COLUMN b_deficiency_threshold_mg_kg numeric,
ADD COLUMN b_source text,
ADD COLUMN b_notes text,
ADD COLUMN b_confidence_tier text DEFAULT 'LDE-MODERATE';

-- Add Zinc (Zn) columns
ALTER TABLE cfi_soil_profiles
ADD COLUMN avail_zn_degraded_mg_kg_low numeric,
ADD COLUMN avail_zn_degraded_mg_kg_high numeric,
ADD COLUMN avail_zn_target_mg_kg_low numeric,
ADD COLUMN avail_zn_target_mg_kg_high numeric,
ADD COLUMN zn_deficiency_threshold_mg_kg numeric,
ADD COLUMN zn_source text,
ADD COLUMN zn_notes text,
ADD COLUMN zn_confidence_tier text DEFAULT 'LDE-MODERATE';

-- Add Copper (Cu) columns
ALTER TABLE cfi_soil_profiles
ADD COLUMN avail_cu_degraded_mg_kg_low numeric,
ADD COLUMN avail_cu_degraded_mg_kg_high numeric,
ADD COLUMN avail_cu_target_mg_kg_low numeric,
ADD COLUMN avail_cu_target_mg_kg_high numeric,
ADD COLUMN cu_deficiency_threshold_mg_kg numeric,
ADD COLUMN cu_source text,
ADD COLUMN cu_notes text,
ADD COLUMN cu_deficiency_notes text,
ADD COLUMN cu_confidence_tier text DEFAULT 'LDE-MODERATE';

-- Add Iron (Fe) columns
ALTER TABLE cfi_soil_profiles
ADD COLUMN avail_fe_degraded_mg_kg_low numeric,
ADD COLUMN avail_fe_degraded_mg_kg_high numeric,
ADD COLUMN avail_fe_target_mg_kg_low numeric,
ADD COLUMN avail_fe_target_mg_kg_high numeric,
ADD COLUMN fe_confidence_tier text,
ADD COLUMN fe_source text;

-- Add Manganese (Mn) columns
ALTER TABLE cfi_soil_profiles
ADD COLUMN avail_mn_degraded_mg_kg_low numeric,
ADD COLUMN avail_mn_degraded_mg_kg_high numeric,
ADD COLUMN avail_mn_target_mg_kg_low numeric,
ADD COLUMN avail_mn_target_mg_kg_high numeric,
ADD COLUMN mn_confidence_tier text,
ADD COLUMN mn_source text;

-- Add general micronutrient source tracking
ALTER TABLE cfi_soil_profiles
ADD COLUMN micronutrient_sources text[];

-- Add comments
COMMENT ON COLUMN cfi_soil_profiles.b_confidence_tier IS 'Confidence level for B data: LAB-CONFIRMED, LDE-HIGH, LDE-MODERATE, LDE-LOW, DATA GAP';
COMMENT ON COLUMN cfi_soil_profiles.zn_confidence_tier IS 'Confidence level for Zn data: LAB-CONFIRMED, LDE-HIGH, LDE-MODERATE, LDE-LOW, DATA GAP';
COMMENT ON COLUMN cfi_soil_profiles.cu_confidence_tier IS 'Confidence level for Cu data: LAB-CONFIRMED, LDE-HIGH, LDE-MODERATE, LDE-LOW, DATA GAP';
COMMENT ON COLUMN cfi_soil_profiles.micronutrient_sources IS 'Array of research sources for micronutrient data';
