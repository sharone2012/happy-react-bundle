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
