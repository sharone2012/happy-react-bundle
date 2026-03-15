-- =============================================================================
-- CFI MIGRATION 7 — cfi_soil_profiles
-- Baseline degraded vs target ranges per soil order (Indonesia & Malaysia)
-- All values are LDE (Literature-Derived Estimates) unless tagged lab_confirmed
-- Run in a fresh Supabase SQL Editor tab AFTER dropping any existing version
-- =============================================================================

-- STEP 0 — Safety drop
DROP TABLE IF EXISTS cfi_soil_profiles CASCADE;

-- =============================================================================
-- TABLE DEFINITION
-- =============================================================================
CREATE TABLE cfi_soil_profiles (
  id                          SERIAL PRIMARY KEY,
  soil_key                    TEXT NOT NULL UNIQUE,          -- canonical ID used as FK in other tables
  supabase_reference          TEXT NOT NULL,                 -- SOILS.Calculator.Palm - X.Indonesia.Malaysia
  soil_group_name             TEXT NOT NULL,                 -- display name
  local_name                  TEXT,                         -- Indonesian / Malaysian local name
  coverage_pct_indonesia      NUMERIC(5,1),                 -- % of Indonesian palm land
  -- ── PHYSICAL ────────────────────────────────────────────────────────────────
  texture_degraded            TEXT,
  texture_target              TEXT,
  bd_degraded_g_cm3_low       NUMERIC(4,2),
  bd_degraded_g_cm3_high      NUMERIC(4,2),
  bd_target_g_cm3_low         NUMERIC(4,2),
  bd_target_g_cm3_high        NUMERIC(4,2),
  -- ── CHEMISTRY ───────────────────────────────────────────────────────────────
  ph_degraded_low             NUMERIC(4,2),
  ph_degraded_high            NUMERIC(4,2),
  ph_target_low               NUMERIC(4,2),
  ph_target_high              NUMERIC(4,2),
  som_degraded_pct_low        NUMERIC(5,2),
  som_degraded_pct_high       NUMERIC(5,2),
  som_target_pct_low          NUMERIC(5,2),
  som_target_pct_high         NUMERIC(5,2),
  cec_degraded_cmol_low       NUMERIC(6,1),
  cec_degraded_cmol_high      NUMERIC(6,1),
  cec_target_cmol_low         NUMERIC(6,1),
  cec_target_cmol_high        NUMERIC(6,1),
  base_sat_degraded_pct_low   NUMERIC(5,1),
  base_sat_degraded_pct_high  NUMERIC(5,1),
  base_sat_target_pct_low     NUMERIC(5,1),
  base_sat_target_pct_high    NUMERIC(5,1),
  al_sat_degraded_pct_low     NUMERIC(5,1),          -- NULL for non-Ultisol/Oxisol
  al_sat_degraded_pct_high    NUMERIC(5,1),
  al_sat_target_pct_max       NUMERIC(5,1),
  p_fix_fraction_baseline     NUMERIC(5,3) NOT NULL, -- fraction of applied P fixed (0–1)
  avail_p_degraded_mg_kg_low  NUMERIC(6,1),
  avail_p_degraded_mg_kg_high NUMERIC(6,1),
  avail_p_target_mg_kg_low    NUMERIC(6,1),
  avail_p_target_mg_kg_high   NUMERIC(6,1),
  exch_k_degraded_cmol_low    NUMERIC(5,3),
  exch_k_degraded_cmol_high   NUMERIC(5,3),
  exch_k_target_cmol_low      NUMERIC(5,3),
  exch_k_target_cmol_high     NUMERIC(5,3),
  -- ── NUTRIENT LOSS BASELINES ──────────────────────────────────────────────────
  n_leach_fract_baseline      NUMERIC(5,3) NOT NULL, -- fraction of mineral N lost to leaching
  k_leach_fract_baseline      NUMERIC(5,3) NOT NULL, -- fraction of applied K lost
  p_leach_fract_baseline      NUMERIC(5,3),          -- Sandy only — others NULL (P fixation, not leaching)
  -- ── MICROBIOME BASELINES ────────────────────────────────────────────────────
  mbc_degraded_mg_kg_low      NUMERIC(7,0),
  mbc_degraded_mg_kg_high     NUMERIC(7,0),
  mbc_target_mg_kg_low        NUMERIC(7,0),
  mbc_target_mg_kg_high       NUMERIC(7,0),
  fb_ratio_degraded_low       NUMERIC(5,2),
  fb_ratio_degraded_high      NUMERIC(5,2),
  fb_ratio_target_low         NUMERIC(5,2),
  fb_ratio_target_high        NUMERIC(5,2),
  amf_colonisation_degraded_pct_low  NUMERIC(5,1),
  amf_colonisation_degraded_pct_high NUMERIC(5,1),
  amf_colonisation_target_pct_low    NUMERIC(5,1),
  amf_colonisation_target_pct_high   NUMERIC(5,1),
  -- ── PEAT-SPECIFIC FIELDS ─────────────────────────────────────────────────────
  is_peat                     BOOLEAN DEFAULT FALSE,
  peat_organic_c_pct          NUMERIC(5,1),          -- baseline organic C % (Histosol ~24.5%)
  peat_subsidence_cm_yr       NUMERIC(4,1),          -- expected subsidence without intervention
  peat_irreversible_dry_risk  BOOLEAN,               -- TRUE = must maintain water table
  peat_n_mechanism            TEXT,                  -- 'immobilisation' vs 'leaching'
  peat_ghg_baseline_t_co2e_ha_yr NUMERIC(8,1),       -- CO2e from drainage/oxidation (Histosol only)
  -- ── METADATA ─────────────────────────────────────────────────────────────────
  confidence_level            TEXT CHECK (confidence_level IN ('LDE-HIGH','LDE-MODERATE','LDE-LOW','LAB-CONFIRMED')),
  data_source                 TEXT,
  notes                       TEXT,
  is_active                   BOOLEAN DEFAULT TRUE,
  created_at                  TIMESTAMPTZ DEFAULT NOW(),
  updated_at                  TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- DATA — ALL 6 SOIL ORDERS
-- Sources: Ultisol v3.0 PDF Table 1; Sandy Entisol calculator summary;
-- Inceptisol calculator; Andisol v3.2 gap resolution; Peat data gap resolution;
-- CFI React soil calculator v4_PUBLISHED baseline data
-- =============================================================================

INSERT INTO cfi_soil_profiles (
  soil_key, supabase_reference, soil_group_name, local_name,
  coverage_pct_indonesia,
  texture_degraded, texture_target,
  bd_degraded_g_cm3_low, bd_degraded_g_cm3_high,
  bd_target_g_cm3_low,   bd_target_g_cm3_high,
  ph_degraded_low, ph_degraded_high,
  ph_target_low,   ph_target_high,
  som_degraded_pct_low, som_degraded_pct_high,
  som_target_pct_low,   som_target_pct_high,
  cec_degraded_cmol_low, cec_degraded_cmol_high,
  cec_target_cmol_low,   cec_target_cmol_high,
  base_sat_degraded_pct_low, base_sat_degraded_pct_high,
  base_sat_target_pct_low,   base_sat_target_pct_high,
  al_sat_degraded_pct_low, al_sat_degraded_pct_high, al_sat_target_pct_max,
  p_fix_fraction_baseline,
  avail_p_degraded_mg_kg_low, avail_p_degraded_mg_kg_high,
  avail_p_target_mg_kg_low,   avail_p_target_mg_kg_high,
  exch_k_degraded_cmol_low, exch_k_degraded_cmol_high,
  exch_k_target_cmol_low,   exch_k_target_cmol_high,
  n_leach_fract_baseline, k_leach_fract_baseline, p_leach_fract_baseline,
  mbc_degraded_mg_kg_low, mbc_degraded_mg_kg_high,
  mbc_target_mg_kg_low,   mbc_target_mg_kg_high,
  fb_ratio_degraded_low, fb_ratio_degraded_high,
  fb_ratio_target_low,   fb_ratio_target_high,
  amf_colonisation_degraded_pct_low, amf_colonisation_degraded_pct_high,
  amf_colonisation_target_pct_low,   amf_colonisation_target_pct_high,
  is_peat, peat_n_mechanism,
  confidence_level, data_source, notes
) VALUES

-- ── 1. ULTISOLS ────────────────────────────────────────────────────────────────
(
  'ultisol',
  'SOILS.Calculator.Palm - Ultisols.Indonesia.Malaysia',
  'Ultisols (Acidic Tropical Clays)',
  'Podsolik Merah Kuning',
  24.0,
  'clay–clay loam', 'clay–clay loam',
  1.30, 1.50,  0.90, 1.10,
  4.20, 5.00,  5.50, 6.50,
  0.80, 1.50,  2.50, 4.00,
  4.0, 8.0,    10.0, 15.0,
  20.0, 35.0,  60.0, 80.0,
  40.0, 70.0,  NULL, NULL,  20.0,
  0.700,                                   -- 70% baseline P fixation
  2.0, 8.0,    15.0, 25.0,
  0.10, 0.20,  0.30, 0.50,
  0.350, 0.200, NULL,                      -- N leach 35%; K leach 20%; no P leach
  100, 250,    500, 1000,
  0.10, 0.30,  0.50, 1.00,
  5.0, 15.0,   40.0, 70.0,
  FALSE, NULL,
  'LDE-HIGH',
  'Ultisol-Palm-Calculator.pdf v3.0; Indonesian Ultisol studies Sumatra/Kalimantan',
  'Primary CFI market. P fixation bypass is the strongest value proposition. Al saturation at pH<5 inhibits roots. CEC almost entirely SOM-driven at 75-85%.'
),

-- ── 2. INCEPTISOLS ────────────────────────────────────────────────────────────
(
  'inceptisol',
  'SOILS.Calculator.Palm - Inceptisols-Alluvial.Indonesia.Malaysia',
  'Inceptisols / Alluvial Soils',
  'Kambisol / Gleisol',
  39.0,
  'clay loam–silty clay', 'clay loam–silty clay',
  1.20, 1.40,  1.00, 1.20,
  4.00, 5.00,  5.50, 6.50,
  1.50, 2.50,  3.00, 5.00,
  10.0, 18.0,  15.0, 25.0,
  40.0, 60.0,  70.0, 85.0,
  NULL, NULL,  NULL, NULL,  NULL,          -- Inceptisols do not have Al saturation problem
  0.300,                                   -- 30% baseline P fixation (low-moderate)
  5.0, 15.0,   20.0, 35.0,
  0.15, 0.30,  0.35, 0.55,
  0.250, 0.150, NULL,                      -- N leach 25%; K leach 15%
  200, 400,    600, 1200,
  0.20, 0.40,  0.60, 1.20,
  10.0, 25.0,  45.0, 75.0,
  FALSE, NULL,
  'LDE-HIGH',
  'PTPN IV Riau plantation data; Kalimantan comparative studies; CFI Soil Calculator v4',
  'Largest market by area (39%). 2:1 clay mineralogy gives higher CEC response per SOM unit than Ultisols. CEC_Response=2.8 cmol/kg per 1% SOM. Best fertility baseline.'
),

-- ── 3. OXISOLS ────────────────────────────────────────────────────────────────
(
  'oxisol',
  'SOILS.Calculator.Palm - Oxisols.Indonesia.Malaysia',
  'Oxisols (Highly Weathered Tropical Clays)',
  'Latosol / Ferralsol',
  8.0,
  'clay', 'clay',
  1.20, 1.50,  0.90, 1.10,
  4.00, 4.80,  5.50, 6.50,
  0.50, 1.20,  2.00, 4.00,
  3.0, 6.0,    8.0, 14.0,
  10.0, 20.0,  60.0, 80.0,
  NULL, NULL,  NULL, NULL,  NULL,
  0.780,                                   -- 78% baseline P fixation (catastrophic goethite)
  1.0, 5.0,    15.0, 25.0,
  0.05, 0.15,  0.25, 0.45,
  0.500, 0.300, NULL,                      -- N leach 50%; K leach 30%
  80, 180,     400, 900,
  0.05, 0.20,  0.40, 0.90,
  3.0, 10.0,   30.0, 65.0,
  FALSE, NULL,
  'LDE-MODERATE',
  'CFI Soil Calculator v4; Kalimantan Oxisol studies',
  'Highest CFI substitution value (57%). Goethite P fixation near-total. CEC from OM is the ONLY long-term solution. Fe/Al oxides dominate mineralogy. Nematode suppression from chitin is secondary benefit.'
),

-- ── 4. SPODOSOLS / SANDY ENTISOLS ────────────────────────────────────────────
(
  'spodosol',
  'SOILS.Calculator.Palm - Sandy-Entisols.Spodosols.Indonesia.Malaysia',
  'Sandy Entisols / Spodosols (Coastal Sands)',
  'Podsolik / Podzol / BRIS Soils',
  5.0,
  'sand–loamy sand', 'sandy loam',
  1.40, 1.65,  1.10, 1.35,
  3.50, 4.50,  5.00, 6.00,
  0.30, 0.80,  1.50, 3.00,
  2.0, 5.0,    6.0, 12.0,
  5.0, 15.0,   50.0, 75.0,
  NULL, NULL,  NULL, NULL,  NULL,
  0.100,                                   -- 10% P fixation BUT P leaches instead
  2.0, 8.0,    12.0, 25.0,
  0.05, 0.12,  0.20, 0.40,
  0.500, 0.350, 0.200,                     -- N leach 50%; K leach 35%; P LEACH 20% (unique — leaching not fixation)
  60, 150,     350, 800,
  0.08, 0.25,  0.40, 0.80,
  2.0, 8.0,    25.0, 55.0,
  FALSE, NULL,
  'LDE-MODERATE',
  'Kalimantan Spodosol studies (Hartati 2021); Sarawak BRIS soils; Sandy Entisol calculator summary',
  'UNIQUE: P leaches rather than fixes on sands. N leaching extreme (0.50 baseline). Fastest OM Decay_Factor of any soil (0.45-0.55). WHC gain highest of any soil (3.0-5.0 mm per %SOM). CEC rebuilding from OM is the only long-term solution. NOTE: p_leach_fract_baseline field is active for this soil only.'
),

-- ── 5. ANDISOLS ───────────────────────────────────────────────────────────────
(
  'andisol',
  'SOILS.Calculator.Palm - Andisols.VolcanicAsh.Indonesia.Malaysia',
  'Andisols (Volcanic Ash Soils)',
  'Andosol / Tanah Vulkanik',
  NULL,                                    -- exact % not in documents — present in Sumatra/Java/Sulawesi
  'silt loam–clay loam', 'silt loam–clay loam',
  0.60, 0.90,  0.50, 0.80,                 -- low BD is characteristic (allophane aggregation)
  5.00, 6.00,  5.80, 6.80,
  3.00, 6.00,  5.00, 10.00,               -- naturally high SOM
  15.0, 30.0,  20.0, 40.0,               -- highest CEC of mineral soils
  50.0, 70.0,  70.0, 90.0,
  NULL, NULL,  NULL, NULL,  NULL,
  0.900,                                   -- 90% P fixation via allophane — highest in series
  2.0, 6.0,    15.0, 30.0,
  0.10, 0.25,  0.30, 0.55,
  0.200, 0.100, NULL,                      -- N leach 0.138 post-RF (AEC); K leach 0.08 post-RF
  250, 500,    700, 1500,
  0.25, 0.50,  0.70, 1.50,               -- naturally high F:B from volcanic OM
  15.0, 30.0,  50.0, 80.0,               -- highest AMF potential
  FALSE, NULL,
  'LDE-HIGH',
  'Andisol v3.2 gap resolution; Maeda et al 2003; Katou et al 2008; Lembang West Java studies',
  'All 22 data gaps CLOSED in v3.2. N leach RF=0.31 (AEC-driven nitrate retention). K leach RF=0.20. P fixation HIGHEST but CaSiO3 co-amendment RF=0.15-0.25 is definitive intervention. BD feedback loop: ΔBD=0.025 g/cm3 per %SOM, floor 0.55. NOT IN REACT — must be added.'
),

-- ── 6. HISTOSOLS / PEAT ────────────────────────────────────────────────────────
(
  'histosol',
  'SOILS.Calculator.Palm - Peat.Histosols.Indonesia.Malaysia',
  'Peat / Histosols',
  'Tanah Gambut',
  7.0,
  'amorphous organic', 'structured peat with drainage',
  0.10, 0.25,  0.10, 0.20,               -- extremely low BD — peat is mostly water+organic
  3.50, 4.50,  4.50, 5.50,
  24.50, 60.00, 20.00, 60.00,             -- SOM IS the soil — concept of adding OM to raise SOM is degenerate here
  25.0, 60.0,  25.0, 60.0,               -- CEC already very high but pH-dependent
  5.0, 15.0,   50.0, 75.0,               -- base saturation very low despite high CEC
  NULL, NULL,  NULL, NULL,  NULL,
  0.180,                                   -- 18% P fixation (LOW — NOT the story on peat; K and Cu are)
  5.0, 12.0,   15.0, 25.0,
  0.80, 1.50,  0.80, 1.50,               -- extremely high K demand; exchangeable K low despite additions
  0.200, 0.400, NULL,                     -- N immobilisation (NOT leaching) ~20-40% of applied N; K leach 40%
  300, 600,    600, 1200,                 -- microbial biomass present but anaerobic-dominated
  0.50, 1.50,  1.00, 3.00,               -- F:B elevated by default (anaerobic favours fungi)
  2.0, 8.0,    10.0, 30.0,               -- AMF works poorly at pH 3.8; low colonisation expected
  TRUE, 'immobilisation',                 -- CRITICAL: N mechanism is immobilisation not leaching
  'LDE-MODERATE',
  'Peat gap resolution report; Hooijer et al 2012; RSPO peat guidelines; Hashim & Teh UPM data',
  'SPECIAL CASE: (1) SOM concept is degenerate — soil IS OM, so OM_retention_1yr_fract_CP_Histosol applies only to ADDED product OM, not native peat. (2) N mechanism = immobilisation, not leaching — N balance formula structure differs from mineral soils. (3) WHC formula does not apply — use water table depth instead. (4) GHG from peat oxidation = 55-200 t CO2e/ha/yr baseline (field-specific). (5) Subsidence = 2-3 cm/yr under oil palm drainage. (6) Irreversible drying above critical VWC threshold. (7) LIME IS PROHIBITED — peat pH managed by water table, not amendment. (8) Cu deficiency is mandatory — not optional. See peat_ghg_baseline_t_co2e_ha_yr.'
);

-- Post-insert: add peat-specific fields
UPDATE cfi_soil_profiles
SET
  peat_organic_c_pct              = 24.5,
  peat_subsidence_cm_yr           = 2.5,
  peat_irreversible_dry_risk      = TRUE,
  peat_ghg_baseline_t_co2e_ha_yr  = 85.0     -- median estimate; range 55-200 t CO2e/ha/yr
WHERE soil_key = 'histosol';

-- =============================================================================
-- INDEXES & TRIGGERS
-- =============================================================================
CREATE INDEX idx_cfi_soil_profiles_soil_key ON cfi_soil_profiles(soil_key);

CREATE OR REPLACE FUNCTION update_soil_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_soil_profiles_updated_at
  BEFORE UPDATE ON cfi_soil_profiles
  FOR EACH ROW EXECUTE FUNCTION update_soil_profiles_updated_at();

-- =============================================================================
-- VERIFY
-- =============================================================================
SELECT
  soil_key,
  LEFT(soil_group_name, 35) AS soil,
  coverage_pct_indonesia    AS cov_pct,
  n_leach_fract_baseline    AS n_leach,
  p_fix_fraction_baseline   AS p_fix,
  k_leach_fract_baseline    AS k_leach,
  p_leach_fract_baseline    AS p_leach_sandy,
  is_peat,
  confidence_level
FROM cfi_soil_profiles
ORDER BY coverage_pct_indonesia DESC NULLS LAST;
