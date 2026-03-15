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
