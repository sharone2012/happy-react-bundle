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
