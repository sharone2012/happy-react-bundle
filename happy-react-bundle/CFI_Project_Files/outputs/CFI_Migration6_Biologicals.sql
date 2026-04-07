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
