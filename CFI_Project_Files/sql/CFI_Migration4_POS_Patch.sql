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
