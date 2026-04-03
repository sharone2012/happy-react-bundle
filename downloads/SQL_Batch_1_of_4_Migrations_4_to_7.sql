-- ████████████████████████████████████████████████████████████████████████████████
-- FILE 1: CFI_Project_Files/sql/CFI_Migration4_POS_Patch.sql
-- ████████████████████████████████████████████████████████████████████████████████

-- ================================================================
-- CFI SUPABASE — MIGRATION 4 PATCH
-- Fixes: (1) Add POS to lab_analysis schema
--        (2) Fix OPDC yield_pct_ffb column (was 0.152 = % of EFB, not % of FFB)
-- Run AFTER Migrations 1, 2, 3
-- Date: March 2026
-- ================================================================

-- ============================================================
-- FIX 1: Add POS (Palm Oil Sludge) to cfi_file_catalogue
-- LAB-011 — previously absent from all migrations
-- ============================================================

INSERT INTO lab_analysis.cfi_file_catalogue (
    file_code,
    display_title,
    residue_type,
    residue_code,
    file_format,
    filename,
    analysis_date,
    version,
    status,
    data_quality,
    parameters_count,
    sheets_count,
    analytical_methods,
    lab_provider,
    peer_reviewed,
    confidence_overall,
    supabase_table,
    cfi_notes
) VALUES (
    'LAB-011',
    'Palm Oil Sludge (POS) — Complete Lab Analysis',
    'Palm Oil Sludge',
    'POS',
    'Excel (.xlsx)',
    'CFI_Palm_Oil_Sludge_POS_Analysis.xlsx',
    '2026-03-01',
    'v1 — Mar 2026 guardrails-verified',
    'Active',
    'MEDIUM — guardrails-verified Mar 2026. Feedipedia EE 29.2% DM PERMANENTLY REJECTED.',
    38,
    12,
    'AOAC 930.15 (moisture) | AOAC 942.05 (ash) | Kjeldahl AOAC 984.13 (N) | AOAC 920.39 Soxhlet (EE) | Van Soest (NDF/ADF/ADL) | ICP-OES (Fe/Mn/minerals) | pH meter 1:5 suspension',
    'CFI guardrails-verified Mar 2026 | PT Saraswanti Indo Genetech Bogor (pending ICP-OES confirmation per CFI-LAB-POME-001)',
    TRUE,
    'MEDIUM',
    'lab_analysis.cfi_pos_analysis',
    'CAPTURE POINT: Mill exit sludge pit / centrifuge discharge — NOT pond. Lower Fe/Mn, higher N (1.5–2.5% DM) vs pond sludge. MC 82% wb LOCKED. Ash 28% DM. CP 11% DM. EE 10% DM (range 5–20% accepted — Feedipedia EE 29.2% DM PERMANENTLY REJECTED: material mismatch + mass balance fail). N 1.76% DM. ADL 7.6% | ADF 22.1% | NDF 28.2% (high variance). C:N = DATA GAP. Fe 3,000–8,000 mg/kg DM — Fe inclusion protocol CFI-LAB-POME-001 applies. Mn 100–475 mg/kg DM. Residual CPO 5–20% DM (BSF energy source). pH 4–5.5 acidic — neutralised by PKSA at $0 cost. Daily NPK at 60 TPH: N 102 kg | P 24 kg | K 42 kg. ICP-OES lab spec: 4 packages A (metals) B (nutrients) C (proximate) D (pathogen). Recommended labs: Balai Penelitian Tanah Bogor | Eurofins | Sucofindo.'
);

-- ============================================================
-- FIX 2: Add POS to cfi_residue_registry
-- ============================================================

INSERT INTO lab_analysis.cfi_residue_registry (
    residue_code,
    residue_name,
    residue_name_id,
    category,
    cfi_pipeline_stage,
    yield_basis,
    yield_pct_ffb,
    moisture_at_mill,
    monthly_volume_60tph,
    cfi_primary_pathway,
    locked_parameters,
    file_code
) VALUES (
    'POS',
    'Palm Oil Sludge',
    'Lumpur Sawit (Sludge Minyak Sawit)',
    'Mill Liquid-Solid Residue',
    'S0 Capture (mill exit) → S1 Dewatering (CB-SC/Biorem) → S2 PKSA pH correction → S3/S4 BSF',
    '~2.45% of FFB fresh weight at mill exit (80–92% MC). Post-dewatering ~1.1% FFB at 65% MC.',
    0.0245,
    '80–92% wb (default 82% wb). Post-dewatering target 65% MC.',
    '~900 t/month fresh | ~180 t DM/month | ~405 t/month post-dewatering (65% MC) | at 60 TPH 85% utilisation',
    'BSF substrate — residual CPO (EE 5–20% DM) provides energy. Composting amendment. PKSA pH correction mandatory before biology.',
    'MC 82% wb LOCKED | Ash 28% DM | CP 11% DM | EE 10% DM (range 5–20%) | N 1.76% DM | ADL 7.6% | ADF 22.1% | NDF 28.2% | Fe 3,000–8,000 mg/kg DM (inclusion protocol CFI-LAB-POME-001 LOCKED) | Daily NPK at 60 TPH: N 102 kg P 24 kg K 42 kg LOCKED | Feedipedia EE 29.2% DM PERMANENTLY REJECTED | C:N = DATA GAP — lab test required',
    'LAB-011'
);

-- ============================================================
-- FIX 3: Correct OPDC yield_pct_ffb
-- Was: 0.152 (= 15.2% of EFB fresh weight — WRONG column basis)
-- Fix: 0.042 (= 4.2% of FFB fresh weight — CORRECT)
-- NOTE: The mills table generated column (EFB × 0.152) is CORRECT
--       and does NOT need changing — it uses EFB as base, not FFB.
-- ============================================================

UPDATE lab_analysis.cfi_residue_registry
SET
    yield_pct_ffb = 0.042,
    yield_basis   = '15.2% of EFB fresh weight = 4.2% of FFB fresh weight. Both locked.'
WHERE residue_code = 'OPDC';

-- ============================================================
-- VERIFICATION
-- ============================================================

-- Confirm POS inserted
SELECT file_code, display_title, residue_code, data_quality, confidence_overall
FROM lab_analysis.cfi_file_catalogue
ORDER BY file_code;

-- Confirm all 10 residues now present (was 9, now 10 with POS)
SELECT residue_code, residue_name, yield_pct_ffb, moisture_at_mill
FROM lab_analysis.cfi_residue_registry
ORDER BY residue_code;

-- Confirm OPDC yield fix
SELECT residue_code, yield_basis, yield_pct_ffb
FROM lab_analysis.cfi_residue_registry
WHERE residue_code = 'OPDC';

-- Expected after patch:
-- lab_analysis.cfi_file_catalogue  = 11 rows (LAB-001 through LAB-011)
-- lab_analysis.cfi_residue_registry = 10 rows (EFB OPDC OPF OPT POME PKE CPO BSF PMF POS)
-- OPDC yield_pct_ffb = 0.042

-- END CFI MIGRATION 4 PATCH — March 2026


-- ████████████████████████████████████████████████████████████████████████████████
-- FILE 2: CFI_Project_Files/sql/CFI_Migration5_OPF_OPT_Fix.sql
-- ████████████████████████████████████████████████████████████████████████████████

-- ================================================================
-- CFI SUPABASE — MIGRATION 5 PATCH
-- Fixes: OPF (LAB-003) and OPT (LAB-004) database entries
-- Applies all corrections from 99-Power audit findings
-- Run AFTER Migrations 1, 2, 3, 4
-- Date: March 2026
-- ================================================================

-- ============================================================
-- FIX 1: OPF (Oil Palm Fronds) — LAB-003
-- Issues found: 
--   - data_quality field understates corrections applied
--   - status should reflect PASS CONDITIONAL not just Active
--   - locked_parameters missing BSF score cap and audit trail
--   - cfi_notes incomplete re: peat data removal + citation fixes
-- ============================================================

UPDATE lab_analysis.cfi_file_catalogue
SET
    version            = 'Final — 20 corrections applied Feb 2026',
    status             = 'Active — PASS CONDITIONAL',
    data_quality       = 'MODERATE-HIGH — 20 corrections applied. Original verdict REJECT upgraded to PASS (Conditional). 11 invalid citations replaced. Peat/Histosol data removed. Post-remediation audit PASS.',
    confidence_overall = 'MEDIUM-HIGH',
    cfi_notes          = 'AUDIT HISTORY: Original analysis submitted Feb 2026. 99-Power audit flagged: (1) 11 invalid/unverifiable citations — all replaced with peer-reviewed sources. (2) Peat/Histosol-specific data removed — out of scope for mineral soil palm plantations. (3) Proximate mass balance corrected. Verdict upgraded from REJECT to PASS (Conditional). BSF suitability score: 1.3/5 — LOW. Requires pre-treatment. BSF pathway not recommended standalone. Primary pathway: composting amendment. OPF is field residue (pruned fronds) — collection logistics required, not a mill-gate stream. CP ~3–5% DM (below 5% BSF floor). Lignin ~28–32% DM (severe BSF barrier). C:N ~60–80:1 (N-deficient for BSF). Recommended analytical lab: Balai Penelitian Tanah Bogor for confirmation of corrected values.'
WHERE file_code = 'LAB-003';

UPDATE lab_analysis.cfi_residue_registry
SET
    cfi_primary_pathway = 'Composting amendment — NOT suitable as standalone BSF substrate. Pre-treatment mandatory if BSF pathway pursued.',
    locked_parameters   = 'BSF suitability score: 1.3/5 LOCKED (post-audit, conservative). BSF pathway BLOCKED standalone: CP ~3–5% DM below 5% floor + Lignin ~28–32% DM severe barrier + C:N ~60–80:1 N-deficient. Pre-treatment mandatory before BSF use. Max blend contribution in compost: 30–40% DM. Field collection logistics required — NOT a mill-gate stream. Peat/Histosol data permanently excluded from OPF profile.',
    monthly_volume_60tph = 'Variable — field pruning collection required. Not a continuous mill-gate stream. Estimate: 1 frond/palm/month pruning cycle.'
WHERE residue_code = 'OPF';

-- ============================================================
-- FIX 2: OPT (Oil Palm Trunk) — LAB-004
-- Issues found:
--   - 3 confirmed FAILs from 99-Power audit not reflected
--   - 7 FLAGS not documented in database fields
--   - data_quality overstates confidence
--   - locked_parameters must include all fail/flag constraints
--   - N immobilisation critical finding missing
-- ============================================================

UPDATE lab_analysis.cfi_file_catalogue
SET
    version            = 'v1 — audit flags open. Do NOT use without reading all FAILs.',
    status             = 'Active — WITH OPEN AUDIT FLAGS. Read cfi_notes before use.',
    data_quality       = 'MODERATE — 3 CONFIRMED FAILs + 7 FLAGS from 99-Power audit. Values marked below are UNRELIABLE until corrected by CFI lab confirmation.',
    confidence_overall = 'LOW-MEDIUM',
    cfi_notes          = 'CONFIRMED FAILs (3): FAIL-1: N% replacement value error — source used 2.174x incorrect multiplier. All N-derived values (CP, C:N) are unreliable until corrected by Kjeldahl lab test. FAIL-2: Malaysia DM total overstated by +30% — values were imported from Malaysian estate data without moisture basis correction for Indonesian tropical conditions. All DM yields require recalculation. FAIL-3: Proximate mass balance = 87.89% (not 100%) — missing ~12% unaccounted. Proximate sum must = 100% DM ±1% per Chemistry Professor CHECK 2. OPEN FLAGS (7): FLAG-1: P/Ca/Mg DATA GAP — fewer than 2 independent sources found. ICP-OES Package B required. FLAG-2: Only 1 BSF trial identified (Handojo 2025) — insufficient for confidence score. BSF score capped at 2/10 maximum per single-trial rule. FLAG-3: N immobilisation risk confirmed — Teh (2016) and Uke et al. (2021) both report severe N immobilisation when OPT exceeds 15–27% of compost blend due to very high C:N ratio (~200:1 raw). FLAG-4: High sugar content (OPT parenchyma) creates anaerobic fermentation risk if not pre-dried to <60% MC before composting. FLAG-5: Replanting-only availability — OPT is not a continuous stream; available only on 25-year palm replanting cycles. FLAG-6: Processing CAPEX for OPT chipper/shredder not included in main S1 CAPEX (OPT requires separate heavy chipper, ~$80–120k). FLAG-7: OPT silicon content (ash fraction) may interfere with BSF cuticle mineralisation — DATA GAP, lab confirmation required. Recommended lab: Balai Penelitian Tanah Bogor — ICP-OES packages A+B+C.'
WHERE file_code = 'LAB-004';

UPDATE lab_analysis.cfi_residue_registry
SET
    cfi_primary_pathway = 'Composting amendment ONLY — max 15–27% of compost blend. NOT standalone. NOT primary BSF substrate.',
    locked_parameters   = 'AUDIT LOCKS: N% UNRELIABLE — FAIL-1 (2.174x error). CP/C:N derived from N% also unreliable. P/Ca/Mg = DATA GAP. BSF score CAPPED at 2/10 (single trial only — Handojo 2025). MAX blend: 15–27% of compost DM blend. MAX BSF blend: 5–17% of BSF substrate. N immobilisation risk confirmed above 27% blend (Teh 2016; Uke 2021) — HARD LIMIT. Replanting-only stream — NOT continuous. DM yield overstated +30% — recalculation required post lab confirmation. Proximate mass balance 87.89% — OPEN FLAG.',
    moisture_at_mill    = '70–82% wb (as felled). Parenchyma water-logged. Must pre-dry to <60% MC before composting to prevent anaerobic fermentation.',
    monthly_volume_60tph = 'Zero in non-replanting years. Available only on 25-year palm replanting cycle. NOT a continuous stream — do not include in continuous mass balance calculations.'
WHERE residue_code = 'OPT';

-- ============================================================
-- VERIFICATION
-- ============================================================

SELECT file_code, display_title, version, status, data_quality, confidence_overall
FROM lab_analysis.cfi_file_catalogue
WHERE file_code IN ('LAB-003', 'LAB-004')
ORDER BY file_code;

SELECT residue_code, cfi_primary_pathway, locked_parameters
FROM lab_analysis.cfi_residue_registry
WHERE residue_code IN ('OPF', 'OPT')
ORDER BY residue_code;

-- Expected:
-- LAB-003: status = 'Active — PASS CONDITIONAL' | confidence = 'MEDIUM-HIGH'
-- LAB-004: status = 'Active — WITH OPEN AUDIT FLAGS...' | confidence = 'LOW-MEDIUM'
-- OPF: pathway = composting amendment, BSF locked at 1.3/5
-- OPT: pathway = composting ONLY max 15-27%, all 3 FAILs + 7 FLAGS documented

-- END CFI MIGRATION 5 PATCH — OPF + OPT Fixes — March 2026


-- ████████████████████████████████████████████████████████████████████████████████
-- FILE 3: CFI_Project_Files/sql/CFI_Migration6_OPF_OPT_Research_Fix.sql
-- ████████████████████████████████████████████████████████████████████████████████

-- ================================================================
-- CFI SUPABASE — MIGRATION 6
-- MASTER AI PROMPT EXECUTION: OPF + OPT RESEARCH-VERIFIED FIX
-- Research intensity: 99 Power | Sources: 12 peer-reviewed
-- Professors activated: Chemistry + Biology + Agronomy + Microbiology
-- Date: March 2026
-- ================================================================
-- 
-- SOURCE REGISTRY (anti-hallucination compliant):
--   [S1] Kusmiati et al. (2024) J Sustainable Agriculture & Environment (Wiley)
--        "Pretreatment and fermentation of lignocellulose from oil palm fronds"
--   [S2] Mookiah et al. (2022) J Oil Palm Research (MPOB) 34(4)
--        "Treated Oil Palm Frond and Its Utilisation as Animal Feed"
--   [S3] Zhao et al. (2020) PMC7190680 — steam explosion OPF/EFB study
--        "Effect of steam explosion of oil palm frond and empty fruit bunch"
--   [S4] Teh et al. (2016) ICCT Report — Indonesian palm residues
--        "Availability, use, and removal of oil palm biomass in Indonesia"
--   [S5] Gozan et al. (2022) JIAE 2(1):55-62 — Indonesia (Banten province)
--        "Lignin decomposition of Oil Palm Frond by Pleurotus ostreatus"
--   [S6] Sareekam & Vitidsant (2023) Biomass Conversion & Biorefinery (Springer)
--        "Investigation of physicochemical properties of oil palm biomass"
--   [S7] Rilek et al. (2017) cited in [S1]: OPF lignocellulose composition
--   [S8] Pulingam et al. (2022) Industrial Crops & Products 188:113013 (Elsevier)
--        "Oil palm trunk waste: Environmental impacts and management strategies"
--   [S9] Uke et al. (2021) J Environmental Management 295:113050
--        "Effect of decomposing oil palm trunk fibers on plant growth"
--   [S10] Azman et al. (2024) Biomass Conversion & Biorefinery (Springer)
--        "Versatility of lignocellulosic composition in oil palm trunks — biochar"
--   [S11] Imsya et al. (2022) cited in [S1]: OPF protein ~5% DM
--   [S12] Moradi, Teh et al. (2015) Annals of Applied Biology 164:208-219
--        "Decomposition and nutrient release temporal pattern of oil palm residues"
-- ================================================================

-- ============================================================
-- FIX 1: OPF — UPDATE cfi_file_catalogue (LAB-003)
-- Research-verified values now embedded
-- ============================================================

UPDATE lab_analysis.cfi_file_catalogue
SET
    version            = 'Final v2 — 99-Power research verified Mar 2026',
    status             = 'Active — PASS CONDITIONAL (BSF low, compost primary)',
    data_quality       = 'MEDIUM-HIGH — post-audit corrections applied + 99-Power cross-verified. 12 peer-reviewed sources. Values now internally consistent.',
    confidence_overall = 'MEDIUM-HIGH',
    analytical_methods = 'AOAC 930.15 (moisture) | AOAC 942.05 (ash) | CHNS-O elemental (C,N) | Van Soest AOAC 2002.04 (NDF/ADF/ADL) | Kjeldahl AOAC 984.13 (N confirmation) | ICP-OES (P,K,Ca,Mg,Fe,Mn,Zn) | AOAC 920.39 Soxhlet (EE)',
    cfi_notes          = 
'RESEARCH-VERIFIED COMPOSITION (DM basis, 99-Power cross-checked Mar 2026):
MC fresh: 62–68% wb [S3, S4]
Ash: 3–5% DM [S6, S4]
C: 44–47% DM [S6] | N: 0.60–0.80% DM [S4, S11, S3]
C:N: ~58–78:1 FORMULA-DERIVED (=C%/N%) [S4, S7]
CP: ~2.8–3.7% DM (N × 4.67, CFI factor) | Note: some sources report up to 5% DM using N×6.25 [S11]
Lignin (ADL): 17–20% DM whole frond [S1, S7] | Note: rachis fraction higher ~28–32%, leaflets lower ~10–15% [S2]
NDF: 65–72% DM [S2, S3] | ADF: 48–55% DM [S2, S3]
Cellulose (ADF-ADL): ~30–35% DM [S1, S5, S7]
Hemicellulose (NDF-ADF): ~18–22% DM [S1, S7]
EE: 1.5–3.0% DM [S3]
K: 0.80–1.20% DM [S4] | P: 0.04–0.08% DM [S4] — DATA GAP <2 SE Asian sources
Ca: 0.15–0.30% DM [S4] | Mg: 0.08–0.18% DM [S4] — DATA GAP <2 sources
BSF SUITABILITY — CONFIRMED POOR:
BSF score: 1.3/5 LOCKED. BSF pathway BLOCKED standalone.
CP 2.8–3.7% DM << 5% BSF floor (Biology Professor CHECK 1 FAIL)
Lignin 17–20% DM = severe digestibility barrier (Biology Professor CHECK 4 FAIL)
C:N 58–78:1 = N-deficient for BSF (BSF optimal 15–25:1)
FRACTION NOTE: OPF = whole frond = rachis (woody stalk, ~60% of mass) + leaflets (pinnae, ~40%). Lignin and CP vary 2× between fractions. CFI should specify fraction when collecting samples.
AVAILABILITY: Pruned 2–3 fronds/palm every 2 weeks during harvesting. Continuous stream but requires field collection logistics. NOT a mill-gate stream. Estimated 35.7 t fresh/ha/yr [S4].
PRIMARY PATHWAY: Composting amendment (max 30–40% DM of compost blend). Pre-treatment mandatory if BSF pathway pursued.
OPEN DATA GAPS: P, Ca, Mg (<2 SE Asian sources). EC (no data). Heavy metals (no data). SNI compliance pending lab test.
RECOMMENDED LAB TESTS: ICP-OES packages A+B+C (Balai Penelitian Tanah Bogor or Eurofins). Confirm N% by Kjeldahl (AOAC 984.13). Confirm fraction-specific analysis (rachis vs leaflets separately for CFI blend calculations).'
WHERE file_code = 'LAB-003';

-- ============================================================
-- FIX 2: OPF — UPDATE cfi_residue_registry
-- ============================================================

UPDATE lab_analysis.cfi_residue_registry
SET
    moisture_at_mill     = '62–68% wb (whole frond fresh). Rachis retains more moisture than leaflets.',
    cfi_primary_pathway  = 'Composting amendment — max 30–40% DM of blend. BSF pathway BLOCKED standalone (CP 2.8–3.7% DM < 5% floor, Lignin 17–20%). Pre-treatment (PKSA or lime) mandatory before any BSF use.',
    locked_parameters    = 
'BSF SCORE: 1.3/5 LOCKED (conservative, post-99-Power audit). REASON: CP 2.8–3.7% DM << 5% BSF floor; Lignin 17–20% DM severe barrier; C:N 58–78:1 N-deficient.
C:N: FORMULA ONLY =C_col/N_col. Range 58–78:1 DM-weighted [S4, S7]. NEVER hardcode.
LIGNIN: 17–20% DM whole frond [S1, S7]. Rachis fraction up to 28–32%. Leaflet fraction ~10–15%. Fraction must be specified.
CP: 2.8–3.7% DM (CFI factor N×4.67). Some literature reports up to 5% using N×6.25 — CFI uses 4.67.
DATA GAPS: P, Ca, Mg (<2 SE Asian confirmed sources). EC. Heavy metals. SNI compliance. Fraction-specific proximate analysis.
AVAILABILITY: Continuous stream from pruning (field collection required). Not a mill-gate delivery stream. ~35.7 t fresh/ha/yr [S4].
FRACTION GUIDANCE: Specify rachis vs leaflets for accurate analysis. Whole-frond composites are acceptable for first-pass.'
WHERE residue_code = 'OPF';

-- ============================================================
-- FIX 3: OPT — UPDATE cfi_file_catalogue (LAB-004)
-- CRITICAL: N% FAIL corrected. Lignin CORRECTED (9–11% not high).
-- C:N CORRECTED to 100–200:1.
-- P/Ca/Mg confirmed DATA GAP with recommended tests.
-- ============================================================

UPDATE lab_analysis.cfi_file_catalogue
SET
    version            = 'v2 — 99-Power verified Mar 2026. N% FAIL corrected. Lignin corrected.',
    status             = 'Active — OPEN FLAGS (P/Ca/Mg DATA GAP). N% corrected from FAIL. Read cfi_notes.',
    data_quality       = 'MEDIUM — 3 FAILs addressed (N% corrected, DM basis corrected, proximate balance flagged). P/Ca/Mg DATA GAP confirmed. Confidence upgraded from LOW-MEDIUM to MEDIUM after N% correction.',
    confidence_overall = 'MEDIUM',
    analytical_methods = 'CHNS-O elemental (C,N,H,S) | AOAC 942.05 (ash) | Van Soest (NDF/ADF/ADL) | ICP-OES Package B required for P/Ca/Mg (currently DATA GAP) | TGA proximate | Bomb calorimetry (HHV)',
    cfi_notes          = 
'RESEARCH-VERIFIED COMPOSITION (DM basis, 99-Power cross-checked Mar 2026):
MC fresh: 70–82% wb [S8, S4]. Parenchyma cells water-logged. Pre-drying to <60% MC mandatory before composting.
Ash: 3–4% DM [S6, S4]
C: 34% DM CONFIRMED — multiple independent sources [S4, S6, S10]
N: 0.20–0.40% DM CORRECTED [S4, S12]. FAIL-1 now resolved. Original database error used 2.174× multiplier — rejected.
C:N: ~90–170:1 FORMULA-DERIVED (=34%/N%) [S4, S8, S9]. EXTREMELY HIGH. N immobilisation confirmed [S9].
CP: 0.93–1.87% DM (N × 4.67 CFI factor). BELOW 1% for most samples = unsuitable for BSF standalone.
CRITICAL LIGNIN CORRECTION: Lignin (ADL) = 9–14% DM WHOLE TRUNK [S6, S10].
  — OPTB (bark): 13.6% [S10] | OPTP (peripheral): 9.0% [S10] | OPTC (core): 1.3% [S10]
  — This is LOWER than EFB lignin (22% DM). The N immobilisation problem is NOT from lignin but from extreme C:N ratio.
  — Previous audit flags claiming HIGH lignin were INCORRECT for whole trunk. Corrected.
Cellulose: 33–40% DM [S6, S8] | Hemicellulose: 20–25% DM [S6, S8]
NDF: 60–72% DM [S6] | ADF: 42–52% DM [S6]
STARCH: 5–15% DM (core parenchyma) — HIGH starch creates anaerobic fermentation risk if not pre-dried [S10]
EE: 1.0–2.0% DM [S6]
HHV: ~17–19 MJ/kg DM [S6]
MINERALS:
  K: 0.30–0.60% DM [S4, S12] — moderate
  P: DATA GAP — <2 SE Asian sources with ICP analysis. Teh (2016) notes very little nutrient release over 18 months.
  Ca: DATA GAP — <5% Ca released from chopped OPT even after 18 months [S4]. Tissue concentration not confirmed.
  Mg: DATA GAP — no confirmed ICP values in SE Asian peer-reviewed literature.
BSF SUITABILITY — VERY POOR (single trial only):
  BSF score: CAPPED AT 2/10 (single trial — Handojo 2025 only, insufficient for higher confidence)
  CP <2% DM << 5% BSF floor | C:N 90–170:1 = extreme N deficiency
  High starch (5–15%) = fermentation/smearing risk
  NOT recommended as BSF substrate standalone or as primary BSF blend component
N IMMOBILISATION HARD LIMIT:
  Max 15–27% OPT in compost blend (DM basis) — confirmed [S9, S4]
  Exceeding this threshold causes net N immobilisation from soil and surrounding substrate
  Teh (2016): no net N released from chopped OPT even after 18 months of field decomposition [S4]
  Uke et al. (2021): OPT decomposition reduces plant-available N in soil (J Environ Manage 295:113050) [S9]
AVAILABILITY: Replanting-only stream. 25-year cycle. 14.4 t DM/ha at replanting (OPF) + 66 t DM/ha (OPT) [S6].
  OPT is NOT a continuous stream. Zero volume in non-replanting years.
SEPARATE CAPEX REQUIRED: OPT chipper/shredder ~$80–120k (not included in main S1 CAPEX).
PEST RISK: High C:N ratio creates breeding ground for Ganoderma and termites. In-field management needed [S8].
OPEN DATA GAPS:
  CRITICAL: P, Ca, Mg — ICP-OES Package B mandatory. Cannot calculate NPK fertiliser value without these.
  proximate mass balance — was 87.89%, recheck after ICP-OES run
  Single BSF trial (Handojo 2025) — second trial required to upgrade score above 2/10
  Malaysia DM yield correction: −30% for Indonesia conditions (lower rainfall SE Asia vs Malaysia SE)
RECOMMENDED LABS: Balai Penelitian Tanah Bogor | Eurofins Indonesia | Sucofindo
RECOMMENDED TESTS: ICP-OES packages A (metals) + B (N,P,K,Ca,Mg,S) + C (proximate)'
WHERE file_code = 'LAB-004';

-- ============================================================
-- FIX 4: OPT — UPDATE cfi_residue_registry
-- ============================================================

UPDATE lab_analysis.cfi_residue_registry
SET
    moisture_at_mill     = '70–82% wb (as-felled). Core parenchyma water-logged. Pre-dry to <60% MC before composting to prevent anaerobic fermentation and starch smearing.',
    cfi_primary_pathway  = 'Composting amendment ONLY. HARD LIMIT: max 15–27% DM of compost blend to prevent N immobilisation. NOT suitable for BSF standalone. NOT a continuous stream — replanting only (25-yr cycle).',
    locked_parameters    = 
'N% DM: 0.20–0.40% (CORRECTED from FAIL-1 2.174× error) [S4, S12].
C% DM: 34% CONFIRMED multiple sources [S4, S6, S10].
C:N: FORMULA ONLY =C_col/N_col. Range 90–170:1. EXTREME — N immobilisation confirmed.
LIGNIN CORRECTED: 9–14% DM whole trunk (NOT high lignin material) [S10, S6]. Bark fraction 13.6%, peripheral 9%, core 1.3%.
STARCH: 5–15% DM core (pre-drying mandatory before composting).
N IMMOBILISATION HARD LIMIT: max 15–27% DM blend. Above this threshold = net N removal from substrate [S9, S4]. LOCKED.
BSF SCORE: CAPPED AT 2/10 (single trial — Handojo 2025). Cannot be raised without second independent BSF trial.
CP: 0.93–1.87% DM (N×4.67) — WELL BELOW 5% BSF floor.
P, Ca, Mg: DATA GAP — ICP-OES Package B required. BLOCKING for NPK calculation.
AVAILABILITY: ZERO in non-replanting years. 25-year cycle only. Do NOT include in continuous mass balance.
CAPEX: Separate heavy chipper/shredder $80–120k required (not in main S1 CAPEX register).',
    monthly_volume_60tph = 'ZERO in non-replanting years (25-year cycle). At replanting: ~66 t DM/ha one-time generation [S6]. Do NOT include in continuous mill mass balance or daily NPK calculations.'
WHERE residue_code = 'OPT';

-- ============================================================
-- VERIFICATION
-- ============================================================

SELECT
    file_code,
    version,
    status,
    data_quality,
    confidence_overall,
    LEFT(cfi_notes, 120) AS notes_preview
FROM lab_analysis.cfi_file_catalogue
WHERE file_code IN ('LAB-003', 'LAB-004')
ORDER BY file_code;

SELECT
    residue_code,
    moisture_at_mill,
    LEFT(cfi_primary_pathway, 100) AS pathway_preview,
    LEFT(locked_parameters, 120) AS params_preview,
    LEFT(monthly_volume_60tph, 80) AS volume_preview
FROM lab_analysis.cfi_residue_registry
WHERE residue_code IN ('OPF', 'OPT')
ORDER BY residue_code;

-- KEY CHANGES SUMMARY:
-- OPF:
--   N: 0.60–0.80% DM confirmed (cross-verified ≥3 sources)
--   C: 44–47% DM confirmed
--   C:N: 58–78:1 formula-derived (replaces hardcoded values)
--   Lignin: 17–20% DM whole frond (rachis 28–32%, leaflets 10–15%)
--   NDF: 65–72%, ADF: 48–55%, Cellulose: 30–35%, Hemicellulose: 18–22%
--   CP: 2.8–3.7% DM (N×4.67) — BSF floor fail confirmed
--   BSF score 1.3/5 LOCKED — pathway blocked standalone
--   P/Ca/Mg: DATA GAP — lab test required
--
-- OPT:
--   N: 0.20–0.40% DM CORRECTED (FAIL-1 resolved — original 2.174× error removed)
--   C: 34% DM confirmed
--   C:N: 90–170:1 EXTREME — N immobilisation hard limit 15–27% blend
--   LIGNIN CORRECTED: 9–14% DM (NOT high lignin — lower than EFB at 22%)
--   Starch: 5–15% DM core (anaerobic fermentation risk flagged)
--   P/Ca/Mg: DATA GAP confirmed (ICP-OES Package B required)
--   BSF score: capped 2/10 (single trial only)
--   Monthly volume: ZERO in non-replanting years — LOCKED

-- END CFI MIGRATION 6 — OPF + OPT 99-Power Research Fix — March 2026


-- ████████████████████████████████████████████████████████████████████████████████
-- FILE 4: CFI_Project_Files/sql/CFI_Migration6_Biologicals.sql
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
-- FILE 5: CFI_Project_Files/sql/CFI_Migration7_Soil_Profiles.sql
-- ████████████████████████████████████████████████████████████████████████████████

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
