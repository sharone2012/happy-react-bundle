import { useState, useEffect, useCallback, useMemo } from "react";

/*
 * ═══════════════════════════════════════════════════════════════
 * CFI Deep Tech — S3 · Apple UX
 * ═══════════════════════════════════════════════════════════════
 * 1:1 replica of S3_Apple_UX_v18_1.html
 * Modifications per Sharon 30 Mar 2026:
 *   - Header: white/light background, CFI logo on top
 *   - Removed "CFI Deep Tech | Sinar Mas…" info row
 *   - Starts at Substrate Flow
 *   - ALL text + numbers in DM Sans (no Syne, no DM Mono)
 *   - Teal matched to logo: #40D7C5
 *   - All guardrails, data, organisms preserved 1:1
 * ═══════════════════════════════════════════════════════════════
 */

// ── COLOUR TOKENS (logo teal) ──
const T = {
  navy:    "#060C14",
  navyM:   "#0B1827",
  navyL:   "#0D1E30",
  navyLL:  "#112236",
  border:  "#1E4060",
  borderT: "rgba(64,215,197,.25)",
  teal:    "#40D7C5",
  teal2:   "rgba(64,215,197,.12)",
  amber:   "#F5A623",
  green:   "#3DCB7A",
  red:     "#E84040",
  blue:    "#60A5FA",
  violet:  "#A78BFA",
  grey:    "#8BA0B4",
  greyL:   "#C4D3E0",
  white:   "#EAF3F8",
};

// ── FONT (DM Sans only) ──
const F = "'DM Sans', sans-serif";

// ── WAVE DEFINITIONS ──
const WAVES = [
  { key: "pre", label: "Pre-Wave — Stream B Algae", waveLabel: "Pre-Wave", color: T.green, border: "rgba(61,203,122,.4)", bg: "rgba(61,203,122,.08)", sub: "Applied as hydration water before inoculation. Replaces plain water. $0 ongoing OpEx — CapEx only.", warn: "", tl: "tl-pre" },
  { key: "1a", label: "Wave 1A — Apply Day 0", waveLabel: "Wave 1A", color: T.teal, border: "rgba(64,215,197,.4)", bg: "rgba(64,215,197,.08)", sub: "All Wave 1A organisms applied together at substrate loading. No sequencing required.", warn: "", tl: "tl-1a" },
  { key: "1b", label: "Wave 1B — Day 3+ only", waveLabel: "Wave 1B", color: T.red, border: "rgba(232,64,64,.4)", bg: "rgba(232,64,64,.08)", sub: "Apply only after white Rhizopus mycelium is visible on substrate surface.", warn: "Adding Wave 1B before Day 3 will kill Rhizopus oligosporus. Trichoderma is a mycoparasite.", tl: "tl-1b" },
  { key: "2", label: "Wave 2 — Day 5+ · Substrate temp <50°C", waveLabel: "Wave 2", color: T.blue, border: "rgba(96,165,250,.4)", bg: "rgba(96,165,250,.08)", sub: "Apply after substrate cools below 50°C. Measure temperature before applying N-fixers.", warn: "N-fixing enzymes (nitrogenase) are irreversibly denatured above 50°C substrate temperature.", tl: "tl-2" },
  { key: "cond", label: "Conditional — Restricted Use", waveLabel: "Conditional", color: T.amber, border: "rgba(245,166,35,.4)", bg: "rgba(245,166,35,.08)", sub: "Requires hard gate confirmation before S4 BSF loading. Lab titre confirmation mandatory.", warn: "Hard gate: Confirm titre decay to <10⁴ CFU/g before any BSF introduction. BSF is Diptera — Bt is directly lethal to BSF larvae.", tl: "tl-cond" },
];

// ── ALL 43 ORGANISMS (complete, no placeholders) ──
const ORGS = [
  // PRE-WAVE
  { id: 42, name: "Arthrospira platensis", short: "Spirulina", icbb: "—", wave: "pre", cost: 0, dose: 0, n: 0, p: 0, lig: 0, cp: 0, bsf: 4, one: false, nine: false, src: "CFI on-site POME raceway · $0 ongoing OpEx (CapEx ~$32,400)", what: "Replaces plain water in substrate wetting. Delivers 65% CP algae protein — Methionine and Lysine — the two amino acids BSF larvae need most. Grown free in POME raceways using tropical sunlight.", how: "1,850 L hydration water per tonne EFB DM delivers 2.31 kg Spirulina DM to substrate. Methionine sufficiency → BSF neonate survival +22%. Lysine + Met completeness → FCR −0.7. BSF meal protein rises from 52% to 56% DM.", outcomes: [["BSF Meal CP", "52% → 56% DM"], ["Neonate survival", "+22%"], ["FCR", "−0.7"], ["OpEx", "$0/month"]], timing: "Pre-Wave — applied during substrate hydration before any organism inoculation.", warn: "" },
  { id: 43, name: "Chlorella vulgaris", short: "Chlorella", icbb: "—", wave: "pre", cost: 0, dose: 0, n: 0, p: 0, lig: 0, cp: 0, bsf: 2, one: false, nine: false, src: "CFI on-site POME raceway — backup to Spirulina", what: "Stream B backup if Spirulina culture fails. Green microalgae grown in POME raceways. Lower protein than Spirulina but faster doubling time.", how: "45% CP DM (vs Spirulina 65%). Faster growth (2–4 day doubling vs 3–5 days). May require centrifuge harvest. BSF meal uplift: 52% → 51% CP DM. POME BOD removal 35–50% as co-benefit.", outcomes: [["BSF Meal CP", "52% → 51% DM"], ["Neonate survival", "+15%"], ["FCR", "−0.5"], ["OpEx", "$0/month"]], timing: "Pre-Wave backup option. Use if Spirulina culture crashes.", warn: "" },

  // WAVE 1A
  { id: 41, name: "Rhizopus oligosporus", short: "Rhizopus", icbb: "—", wave: "1a", cost: 0.5, dose: 0.10, n: 0, p: 0.01, lig: 0, cp: 0.5, one: false, nine: true, src: "Tokopedia (ragi tempe) · $0.50/kg · same-day purchase anywhere in Indonesia", what: "The tempe mold. Grows white fluffy mycelium across substrate fibres by Day 3, adding fungal protein directly. Also releases bound phosphorus and reduces OPDC lipid content.", how: "Mycelial protein biosynthesis adds Lysine + Methionine amino acids. Phytase (EC 3.1.3.26) releases phytate-bound P. Lipase reduces OPDC residual CPO (3–8% DM) which can hurt BSF FCR. Result: CP +0.5% DM, P +0.01% DM.", outcomes: [["CP uplift", "+0.5% DM"], ["P bioavailable", "+0.01% DM"], ["Lysine + Met", "improved for BSF"], ["Visual gate", "White fuzz Day 3"]], timing: "FIRST organism in 9-org stack. Add BEFORE Trichoderma by 48–72h. Trichoderma will kill Rhizopus if added simultaneously.", warn: "9-ORG STACK: Add Trichoderma (Wave 1B, Day 3+) ONLY after Rhizopus white mycelium is visibly established." },
  { id: 15, name: "Saccharomyces cerevisiae", short: "Saccharomyces", icbb: "ICBB 8808", wave: "1a", cost: 0.3, dose: 0.10, n: 0.18, p: 0, lig: 0, cp: 0.3, one: true, nine: true, src: "Fermipan (any Indonesian supermarket) · Provibio ICBB 8808 · $0.30/kg", what: "Locks ammonia in the substrate before it escapes as gas. Without it, 50% of substrate nitrogen evaporates into the air and is permanently lost.", how: "Glutamate dehydrogenase pathway assimilates NH3 directly into yeast protein biomass. pH synergy with Lactobacillus: pH below 6.0 chemically shifts NH3 (volatile gas) → NH4+ (ion, stays in substrate). Combined effect: 50% less N loss.", outcomes: [["NH3 emissions", "−50%"], ["N retained", "+0.18% DM"], ["CP uplift", "+0.3% DM"], ["Stack", "One-Shot + 9-Org"]], timing: "Day 0, Wave 1A. No conflicts.", warn: "" },
  { id: 21, name: "Lactobacillus sp.", short: "Lactobacillus", icbb: "ICBB 6099", wave: "1a", cost: 0.86, dose: 0.08, n: 0, p: 0, lig: 0, cp: 0, one: true, nine: true, src: "EM-4 (Effective Microorganisms-4) · any Indonesian agri store · Rp 25k/L · Provibio ICBB 6099", what: "Drives pH from 8–10 (post-PKSA) down to 5.5–6.0 within 48 hours, which kills the methane-producing bacteria that would otherwise release CH4.", how: "Lactic acid fermentation produces acid that lowers substrate pH. Methanogens require pH 6.8+ — pH drop kills them. Result: CH4 suppression 70–80%. pH 5.5–6.0 also creates ideal conditions for Aspergillus and Trichoderma. Synergy with Saccharomyces: N-Trap effect locks NH4+ at low pH.", outcomes: [["CH4 emissions", "−70–80%"], ["pH target", "5.5–6.0 by Day 2"], ["NH3 reduction", "−50% (synergy)"], ["Stack", "One-Shot + 9-Org"]], timing: "Day 0, Wave 1A. No conflicts.", warn: "" },
  { id: 18, name: "Bacillus subtilis", short: "B. subtilis", icbb: "ICBB 8780", wave: "1a", cost: 0.2, dose: 0.04, n: 0, p: 0, lig: 0, cp: 0.1, one: true, nine: true, src: "Ansel Biotech India · $0.20/kg · cheapest effective organism in the library", what: "The workhorse bacteria. Produces enzymes, protects against pathogens, and enhances root growth when frass is applied to oil palm. Survives heat as endospores.", how: "Endospores survive >70°C — remains viable through thermophilic phase. PGPR (Plant Growth Promoting Rhizobacterium) — produces IAA phytohormone, siderophores. Produces initial cellulase + lipase. H2S suppression via aerobic microenvironment.", outcomes: [["PGPR effect", "in frass field application"], ["Endospore", "2-year shelf life"], ["H2S", "suppressed"], ["Stack", "One-Shot + 9-Org"]], timing: "Day 0, Wave 1A. No conflicts.", warn: "" },
  { id: 19, name: "Bacillus coagulans", short: "B. coagulans", icbb: "—", wave: "1a", cost: 2, dose: 0.03, n: 0, p: 0.02, lig: 0, cp: 0.1, one: false, nine: true, src: "Commercial / Alibaba · $2.00/kg", what: "Bridge organism that stays active as substrate cools from 50°C to 30°C — a temperature range where most other bacteria slow down. Also releases phosphorus from bound complexes.", how: "Thermotolerant lactic acid bacteria forming endospores. Bridges between Bacilli (50°C) and LAB (35°C) temperature guilds. Produces gluconic acid → P-solubilisation. Lactic acid assists Lactobacillus pH drop.", outcomes: [["P solubilisation", "+0.02% DM"], ["Temperature bridge", "50°C → 30°C"], ["Stack", "9-Org"]], timing: "Day 0, Wave 1A. No conflicts.", warn: "" },
  { id: 5, name: "Bacillus licheniformis", short: "B. licheniformis", icbb: "—", wave: "1a", cost: 8, dose: 0.04, n: 0, p: 0, lig: 0, cp: 0.2, one: false, nine: true, src: "Indotrading / Alibaba · $8.00/kg", what: "Produces heat-stable protease that keeps working at 50–65°C — breaking down protein while other organisms cannot survive the heat.", how: "Subtilisin-family protease (Carlsberg protease) stable to 65°C. Cleaves OPDC protein fraction (14.5% CP DM) into bioavailable amino acids. Also produces alpha-amylase for starch hydrolysis.", outcomes: [["CP accessibility", "+0.2% DM"], ["Temp range", "50–65°C active"], ["Stack", "9-Org"]], timing: "Day 0, Wave 1A. 9-org dose locked at 0.04% DM.", warn: "" },
  { id: 13, name: "Aspergillus niger", short: "A. niger", icbb: "—", wave: "1a", cost: 5, dose: 0.05, n: 0, p: 0, lig: 1, cp: 0.2, one: false, nine: true, src: "Indotrading / Alibaba · $5.00/kg", what: "Industrial black mold producing cellulase, pectinase and citric acid — breaking fibres while naturally acidifying the substrate to help Lactobacillus.", how: "Cellulase (Cel3A β-glucosidase) + Pectinase (breaks OPDC pectin) + Citric acid (substrate pH assist 4–6). Commonly co-cultured with Rhizopus — neutral compatibility. Important when OPDC fraction >30% of blend.", outcomes: [["CP uplift", "+0.2% DM"], ["Cellulose access", "improved"], ["pH assist", "citric acid"], ["Stack", "9-Org"]], timing: "Day 0, Wave 1A. Neutral synergy with Rhizopus.", warn: "" },
  { id: 32, name: "Cellulase (T. reesei)", short: "Cellulase", icbb: "EC 3.2.1.4", wave: "1a", cost: 15, dose: 0.03, n: 0, p: 0, lig: 2, cp: 0.3, one: false, nine: true, src: "Novozymes Indonesia · $15/kg", what: "The industrial gold standard enzyme for breaking cellulose chains into glucose that BSF larvae can digest. 3–5× more effective when combined with xylanase and β-glucosidase.", how: "Three enzyme types work together: Cellobiohydrolase I + II process from both chain ends releasing cellobiose. Endoglucanase creates new chain ends. β-glucosidase converts cellobiose → glucose preventing product inhibition. Must pair with Xylanase (xylan coat blocks access to cellulose).", outcomes: [["IVDMD uplift", "+35–45%"], ["Cellulose hydrolysis", "complete cascade"], ["Stack", "9-Org"]], timing: "Day 0. Always pair with Xylanase + β-glucosidase.", warn: "Must pair with Xylanase and β-glucosidase for full cascade effect." },
  { id: 33, name: "Xylanase", short: "Xylanase", icbb: "EC 3.2.1.8", wave: "1a", cost: 17, dose: 0.02, n: 0, p: 0, lig: 1, cp: 0.2, one: false, nine: true, src: "Alibaba bulk · $17/kg", what: "Removes the hemicellulose \"coat\" that physically blocks cellulase from reaching cellulose fibres. Without it, cellulase efficiency drops 40–60%.", how: "Cleaves xylan beta-1,4 bonds exposing underlying cellulose microfibrils. Must be applied simultaneously with cellulase on Day 0.", outcomes: [["Cellulase efficiency", "+40–60% when paired"], ["Hemicellulose", "removed"], ["Stack", "9-Org"]], timing: "Day 0. Apply simultaneously with Cellulase.", warn: "No value as standalone — must pair with Cellulase." },
  { id: 40, name: "β-glucosidase", short: "β-glucosidase", icbb: "EC 3.2.1.21", wave: "1a", cost: 25, dose: 0.01, n: 0, p: 0, lig: 1, cp: 0.1, one: false, nine: true, src: "Novozymes · $25/kg", what: "Prevents cellulase from poisoning itself. As cellulase works, it produces cellobiose — which then blocks (inhibits) further cellulase activity. β-glucosidase removes cellobiose continuously.", how: "Cleaves cellobiose → 2 glucose molecules. Without this enzyme, cellobiose accumulates to inhibitory levels (Ki ~2mM) and cellulase activity drops 40–60% over 48 hours.", outcomes: [["Cellulase inhibition", "prevented"], ["Glucose availability", "maximised"], ["Stack", "9-Org"]], timing: "Day 0. Always pair with Cellulase. No value as standalone.", warn: "" },
  { id: 7, name: "Phanerochaete ICBB 9182", short: "Phanerochaete", icbb: "ICBB 9182", wave: "1a", cost: 8, dose: 0.10, n: 0, p: 0, lig: 5, cp: 0, one: false, nine: false, src: "Provibio / IPB Bogor ICBB collection · $8/kg", what: "The most powerful lignin-destroying organism available. Deploys the complete ligninolytic system to break down the tough lignin polymer that protects EFB fibres from biological attack.", how: "LiP (Lignin Peroxidase) + MnP (Manganese Peroxidase) + Laccase — all three working together. LiP oxidises non-phenolic lignin units. MnP oxidises Mn2+ → Mn3+ which attacks phenolics. Laccase oxidises phenolics directly. ICBB 9182 verified for palm residues at IPB Bogor.", outcomes: [["Lignin ADL reduction", "−4 to −6% DM"], ["Cellulose access", "↑ 35–50%"], ["BSF digestibility", "significantly improved"]], timing: "Day 0, Wave 1A. IPB-verified for EFB substrate.", warn: "" },
  { id: 38, name: "Amylase (EC 3.2.1.1)", short: "Amylase", icbb: "EC 3.2.1.1", wave: "1a", cost: 8, dose: 0.02, n: 0, p: 0, lig: 0, cp: 0, bsf: 3, one: false, nine: false, src: "Commercial enzyme supplier · $8.00/kg", what: "Starch → glucose. Relevant for POME sludge blend (starch residue).", how: "Hydrolyses α-1,4-glycosidic bonds in starch granules releasing maltose and glucose. Relevant when substrate blend includes POME sludge which contains residual starch.", outcomes: [["Starch hydrolysis", "complete"], ["Glucose availability", "improved for BSF"]], timing: "Day 0, Wave 1A. No conflicts.", warn: "" },
  { id: 14, name: "Aspergillus oryzae", short: "A. oryzae", icbb: "—", wave: "1a", cost: 3, dose: 0.10, n: 0, p: 0, lig: 0, cp: 0.4, bsf: 3, one: false, nine: false, src: "Koji culture supplier · $3.00/kg", what: "Koji mold — amylase/protease. Fermentation substrate softening.", how: "Produces amylase and protease enzymes. Traditional koji fermentation organism. Softens substrate fibres through enzymatic degradation of starch and protein matrices.", outcomes: [["CP uplift", "+0.4% DM"], ["Substrate softening", "improved"]], timing: "Day 0, Wave 1A. No conflicts.", warn: "" },
  { id: 20, name: "Cellulomonas fimi", short: "Cellulomonas", icbb: "—", wave: "1a", cost: 4, dose: 0.055, n: 0, p: 0, lig: 1.5, cp: 0, bsf: 3, one: false, nine: false, src: "Commercial · $4.00/kg", what: "Cellulolytic bacterium — cellulose and hemicellulose breakdown.", how: "Produces both cellulase and hemicellulase enzyme systems. Breaks down cellulose and hemicellulose in EFB fibres. Complementary to fungal cellulase producers.", outcomes: [["Cellulose breakdown", "active"], ["Hemicellulose", "co-degradation"]], timing: "Day 0, Wave 1A. No conflicts.", warn: "" },
  { id: 3, name: "Chaetomium thermophilum", short: "Chaetomium", icbb: "—", wave: "1a", cost: 35, dose: 0.055, n: 0, p: 0, lig: 1.5, cp: 0.2, bsf: 3, one: false, nine: false, src: "Specialty culture · $35.00/kg", what: "Thermophilic cellulase model organism.", how: "Thermophilic fungus active at 50-60°C during hot composting phase. Produces cellulase system that works at elevated temperatures where mesophilic organisms cannot.", outcomes: [["CP uplift", "+0.2% DM"], ["Temp range", "50-60°C active"]], timing: "Day 0, Wave 1A. Active during thermophilic phase.", warn: "" },
  { id: 11, name: "Ganoderma lucidum", short: "Ganoderma", icbb: "—", wave: "1a", cost: 1.5, dose: 0.055, n: 0, p: 0, lig: 5, cp: 0, bsf: 2, one: false, nine: false, src: "Mushroom culture supplier · $1.50/kg", what: "Lignin degrader — CAUTION: related to oil palm pathogen Ganoderma boninense.", how: "White-rot fungus producing laccase and MnP for lignin degradation. NOTE: While this is a different species from G. boninense (the oil palm BSR pathogen), use with caution near palm plantations. Trichoderma + Pseudomonas provide biocontrol coverage.", outcomes: [["Lignin ADL reduction", "active"], ["CAUTION", "related to palm pathogen"]], timing: "Day 0, Wave 1A. Use with Trichoderma biocontrol.", warn: "CAUTION: Related to Ganoderma boninense (oil palm BSR pathogen). Always deploy Trichoderma + Pseudomonas as biocontrol agents alongside." },
  { id: 4, name: "Geobacillus stearothermophilus", short: "Geobacillus", icbb: "—", wave: "1a", cost: 15, dose: 0.10, n: 0, p: 0, lig: 0, cp: 0.4, bsf: 3, one: false, nine: false, src: "Specialty culture · $15.00/kg", what: "Thermophilic amylase/protease producer. Survives 70°C.", how: "Extreme thermophile active during hottest composting phase (60-70°C). Produces heat-stable amylase and protease. Only organism in library active above 65°C.", outcomes: [["CP accessibility", "+0.4% DM"], ["Temp range", "60-70°C active"]], timing: "Day 0, Wave 1A. Active during peak thermophilic phase.", warn: "" },
  { id: 34, name: "Laccase (EC 1.10.3.2)", short: "Laccase", icbb: "EC 1.10.3.2", wave: "1a", cost: 20, dose: 0.02, n: 0, p: 0, lig: 3, cp: 0, bsf: 3, one: false, nine: false, src: "Novozymes · $20.00/kg", what: "Phenolic detoxification — opens lignin surface for fungal attack. Optional booster.", how: "Oxidises phenolic compounds on lignin surface using O2 as electron acceptor. Removes toxic phenolics that inhibit fungal growth. Enhances effectiveness of Phanerochaete and Trametes.", outcomes: [["Phenolic removal", "active"], ["Fungal efficiency", "improved"]], timing: "Day 0, Wave 1A. Optional booster enzyme.", warn: "" },
  { id: 36, name: "Lipase (EC 3.1.1.3)", short: "Lipase", icbb: "EC 3.1.1.3", wave: "1a", cost: 18, dose: 0.013, n: 0, p: 0, lig: 0, cp: 0, bsf: 3, one: false, nine: false, src: "Commercial enzyme · $18.00/kg", what: "Fat/lipid breakdown. Relevant for OPDC 3-8% lipid content reduction.", how: "Hydrolyses ester bonds in triglycerides → glycerol + fatty acids. Reduces residual CPO in OPDC fraction (3-8% DM lipid). Excess lipids reduce BSF FCR.", outcomes: [["Lipid reduction", "OPDC 3-8% → lower"], ["BSF FCR", "improved"]], timing: "Day 0, Wave 1A. Most relevant when OPDC fraction >30%.", warn: "" },
  { id: 39, name: "Mannanase (EC 3.2.1.78)", short: "Mannanase", icbb: "EC 3.2.1.78", wave: "1a", cost: 22, dose: 0.013, n: 0, p: 0, lig: 0, cp: 0, bsf: 3, one: false, nine: false, src: "Specialty enzyme · $22.00/kg", what: "Mannan breakdown — important for palm kernel substrate (PKM/PKE blends).", how: "Cleaves β-1,4-mannosidic bonds in galactomannan. Palm kernel meal/expeller contains 30-35% mannan. Without mannanase, this fraction is indigestible to BSF.", outcomes: [["Mannan hydrolysis", "active"], ["PKM digestibility", "improved"]], timing: "Day 0, Wave 1A. Essential when PKM/PKE in blend.", warn: "" },
  { id: 16, name: "Microbacterium lactium", short: "Microbacterium", icbb: "ICBB 7125", wave: "1a", cost: 3, dose: 0.075, n: 0, p: 0, lig: 1.5, cp: 0, bsf: 3, one: false, nine: false, src: "Provibio / IPB Bogor ICBB · $3.00/kg", what: "Primary cellulose decomposer → glucose. ICBB palm specialist.", how: "ICBB-verified cellulolytic bacterium isolated from palm residue environments. Produces endoglucanase and β-glucosidase. Works synergistically with fungal cellulase systems.", outcomes: [["Cellulose decomposition", "active"], ["ICBB verified", "palm residues"]], timing: "Day 0, Wave 1A. No conflicts.", warn: "" },
  { id: 2, name: "Myceliophthora thermophila", short: "Myceliophthora", icbb: "—", wave: "1a", cost: 30, dose: 0.075, n: 0, p: 0, lig: 1.5, cp: 0.2, bsf: 3, one: false, nine: false, src: "Industrial enzyme culture · $30.00/kg", what: "C1 cellulase system, industrial enzyme source.", how: "Thermophilic fungus with the C1 cellulase system — a complete cellulolytic enzyme complex. Active at 45-55°C. Source organism for many commercial cellulase preparations.", outcomes: [["CP uplift", "+0.2% DM"], ["C1 cellulase", "complete system"]], timing: "Day 0, Wave 1A. Active during thermophilic phase.", warn: "" },
  { id: 17, name: "Paenibacillus macerans", short: "Paenibacillus", icbb: "ICBB 8810", wave: "1a", cost: 3, dose: 0.075, n: 0.15, p: 0, lig: 1.5, cp: 0.2, bsf: 3, one: false, nine: false, src: "Provibio / IPB ICBB · $3.00/kg", what: "Hemicellulase + nif genes (N-fixation). Bridges cellulase and N-fixer guilds.", how: "Unusual dual function: hemicellulase production AND nitrogen fixation (nif gene cluster). Bridges the cellulase guild (Wave 1A) and the N-fixer guild (Wave 1B/2). ICBB palm-verified.", outcomes: [["N added", "+0.15% DM"], ["CP uplift", "+0.2% DM"], ["Hemicellulose", "degradation"]], timing: "Day 0, Wave 1A. No conflicts.", warn: "" },
  { id: 35, name: "Pectinase (EC 3.2.1.15)", short: "Pectinase", icbb: "EC 3.2.1.15", wave: "1a", cost: 12, dose: 0.013, n: 0, p: 0, lig: 0, cp: 0, bsf: 3, one: false, nine: false, src: "Commercial enzyme · $12.00/kg", what: "Pectin breakdown — softens cell walls. Useful for OPDC blend.", how: "Hydrolyses pectin polysaccharides in plant cell wall middle lamella. Softens and separates cells. Most relevant when OPDC fraction is >30% of substrate blend.", outcomes: [["Cell wall softening", "active"], ["OPDC processing", "improved"]], timing: "Day 0, Wave 1A. Most value with high OPDC blend.", warn: "" },
  { id: 8, name: "Phanerochaete chrysosporium", short: "P. chrysosporium", icbb: "Wild-type", wave: "1a", cost: 8, dose: 0.10, n: 0, p: 0, lig: 5, cp: 0, bsf: 3, one: false, nine: false, src: "Culture collection · $8.00/kg", what: "Strongest white-rot lignin degrader. LiP dominant.", how: "Wild-type reference strain. Produces LiP (Lignin Peroxidase) as dominant enzyme — more aggressive than ICBB 9182 on pure lignin but less EFB-specific. Use alongside ICBB 9182 for maximum lignin attack.", outcomes: [["Lignin ADL reduction", "−4 to −6% DM"], ["LiP dominant", "aggressive lignin attack"]], timing: "Day 0, Wave 1A. Complementary to ICBB 9182.", warn: "" },
  { id: 9, name: "Pleurotus ostreatus", short: "Pleurotus", icbb: "—", wave: "1a", cost: 0.3, dose: 0.10, n: 0, p: 0, lig: 5, cp: 0, bsf: 3, one: false, nine: false, src: "Oyster mushroom spawn · $0.30/kg", what: "Selective lignin degrader — preserves cellulose for BSF.", how: "Turkey tail relative. SELECTIVE white-rot: preferentially degrades lignin while preserving cellulose. This selectivity is critical — non-selective organisms waste cellulose that BSF larvae need.", outcomes: [["Lignin reduction", "selective"], ["Cellulose preserved", "for BSF"]], timing: "Day 0, Wave 1A. No conflicts.", warn: "" },
  { id: 37, name: "Protease (EC 3.4.x.x)", short: "Protease", icbb: "EC 3.4", wave: "1a", cost: 10, dose: 0.013, n: 0, p: 0, lig: 0, cp: 0.35, bsf: 3, one: false, nine: false, src: "Commercial enzyme · $10.00/kg", what: "Protein accessibility for BSF larvae. Cleaves intact protein structures.", how: "Broad-spectrum protease cleaving peptide bonds in substrate protein fraction. Makes amino acids directly available to BSF larvae without requiring their own proteolytic digestion.", outcomes: [["CP accessibility", "+0.35% DM"], ["Protein digestion", "pre-processed for BSF"]], timing: "Day 0, Wave 1A. No conflicts.", warn: "" },
  { id: 6, name: "Thermobifida fusca", short: "Thermobifida", icbb: "—", wave: "1a", cost: 40, dose: 0.035, n: 0, p: 0, lig: 1.5, cp: 0.2, bsf: 3, one: false, nine: false, src: "Specialty culture · $40.00/kg", what: "Thermophilic actinomycete, true cellulase (CelA, CelB).", how: "Actinomycete (not a fungus) producing true cellulase enzymes CelA and CelB. Active at 50-55°C. Particularly effective on crystalline cellulose which is harder to degrade.", outcomes: [["CP uplift", "+0.2% DM"], ["Crystalline cellulose", "active"]], timing: "Day 0, Wave 1A. Active during thermophilic phase.", warn: "" },
  { id: 1, name: "Thermomyces lanuginosus", short: "Thermomyces", icbb: "—", wave: "1a", cost: 25, dose: 0.10, n: 0, p: 0, lig: 1.5, cp: 0.2, bsf: 3, one: false, nine: false, src: "Industrial culture · $25.00/kg", what: "Thermophilic cellulase/xylanase producer — active during 50-60°C hot phase.", how: "Produces both cellulase and xylanase at elevated temperatures (50-60°C). One of few organisms active during peak thermophilic composting phase. Xylanase production complements separate Xylanase enzyme dosing.", outcomes: [["CP uplift", "+0.2% DM"], ["Xylanase", "thermophilic production"]], timing: "Day 0, Wave 1A. Active during thermophilic phase.", warn: "" },
  { id: 10, name: "Trametes versicolor", short: "Trametes", icbb: "—", wave: "1a", cost: 2, dose: 0.065, n: 0, p: 0, lig: 5, cp: 0, bsf: 3, one: false, nine: false, src: "Mushroom culture supplier · $2.00/kg", what: "Laccase-dominant lignin oxidizer. Turkey tail fungus.", how: "White-rot basidiomycete with laccase as dominant ligninolytic enzyme (vs LiP-dominant Phanerochaete). Complementary lignin attack mechanism. Also produces MnP. Widely available as turkey tail mushroom spawn.", outcomes: [["Lignin oxidation", "laccase-dominant"], ["Complementary", "to Phanerochaete"]], timing: "Day 0, Wave 1A. No conflicts.", warn: "" },

  // WAVE 1B
  { id: 12, name: "Trichoderma harzianum", short: "Trichoderma", icbb: "ICBB 9127", wave: "1b", cost: 1.5, dose: 0.08, n: 0, p: 0, lig: 3, cp: 0, one: true, nine: true, src: "Super Bio Boost (Tokopedia) / Provibio ICBB 9127 · $1.50/kg", what: "Two things in one: a cellulase producer (breaks fibres) AND a biological control agent against Ganoderma — the most destructive oil palm disease. Critical timing rule: must come AFTER Rhizopus.", how: "CMCase (endo-β-1,4-glucanase) peak: 20–35 U/g DM at Day 7. Ganoderma biocontrol: Trichoderma hyphae coil around and penetrate Ganoderma hyphae, secreting glucanase + chitinase to dissolve Ganoderma cell wall (mycoparasitism). CRITICAL: Trichoderma is also a mycoparasite of Rhizopus. Must wait 48–72h for Rhizopus to establish.", outcomes: [["CMCase peak", "20–35 U/g DM at Day 7"], ["Lignin ADL reduction", "−3% DM"], ["Ganoderma control", "independent biocontrol pathway"], ["Stack", "One-Shot + 9-Org"]], timing: "9-org stack: Wave 1B — Day 3+ ONLY after Rhizopus mycelium visible. Standard One-Shot: Day 0 (no Rhizopus conflict).", warn: "TIMING CRITICAL in 9-org stack: Add ONLY after white Rhizopus fuzz is visible on substrate (Day 3+). Trichoderma is a mycoparasite and will kill Rhizopus if added on Day 0." },
  { id: 23, name: "Azotobacter vinelandii", short: "Azotobacter", icbb: "ICBB 9098", wave: "1b", cost: 0.4, dose: 0.10, n: 0.34, p: 0, lig: 0, cp: 0.76, one: true, nine: true, src: "Provibio / PT Pupuk Kaltim · $0.40/kg", what: "Pulls nitrogen directly from the air — for free. The highest rate free-living nitrogen-fixing organism known. Adds 0.34% N DM to the substrate from atmospheric N2.", how: "nifH gene complex catalyses: N2 + 8H+ + 16ATP → 2NH3 (ammonia for substrate). Rate: 10–20 mg N/kg DM/day. HARD GATE: nitrogenase enzyme is irreversibly denatured above 50°C substrate temperature. Must wait for substrate to cool.", outcomes: [["N added", "+0.34% DM (from air)"], ["CP uplift", "+0.76% DM"], ["Cost of N", "$0 — atmospheric"], ["Stack", "One-Shot + 9-Org"]], timing: "9-org: Wave 1B Day 3+. Standard: Day 5+. HARD GATE: substrate temp must be below 50°C.", warn: "HARD GATE: Measure substrate temperature before applying. Above 50°C destroys nitrogenase permanently." },

  // WAVE 2
  { id: 26, name: "Pseudomonas fluorescens", short: "Pseudomonas", icbb: "—", wave: "2", cost: 2.4, dose: 0.08, n: 0, p: 0.04, lig: 0, cp: 0, one: false, nine: false, src: "Katyayani Organics India · $2.40/kg", what: "Releases phosphorus trapped in Indonesian soils and produces hydrogen cyanide that kills Ganoderma — a second independent Ganoderma biocontrol pathway separate from Trichoderma.", how: "Gluconic + citric acid chelate Fe3+ in Fe-Al-P soil complexes, releasing orthophosphate (plant-available P). HCN directly inhibits cytochrome c oxidase in Ganoderma respiratory chain. Two complementary Ganoderma attack mechanisms when combined with Trichoderma.", outcomes: [["P bioavailable", "+0.04% DM"], ["P plant uptake", "2–3× improvement"], ["Ganoderma HCN", "independent pathway"]], timing: "Day 5+, Wave 2. Or Day 14+ booster.", warn: "HCN producer — do not apply in sealed or poorly-ventilated spaces." },
  { id: 24, name: "Azospirillum lipoferum", short: "Azospirillum", icbb: "ICBB 6088", wave: "2", cost: 1.0, dose: 0.08, n: 0.15, p: 0, lig: 0, cp: 0.34, one: false, nine: false, src: "Provibio / Jaipur Bio India · $1.00/kg", what: "Nitrogen-fixer that also produces a plant hormone (IAA) which improves oil palm root absorption when frass is applied to soil.", how: "Associative N-fixation: 0.15% N DM added. IAA (indole-3-acetic acid) enhances root hair development — frass agronomic value improves. Temp gate same as Azotobacter.", outcomes: [["N added", "+0.15% DM"], ["IAA hormone", "root uptake enhanced"], ["CP uplift", "+0.34% DM"]], timing: "Day 5+, Wave 2. Temp gate: <50°C required.", warn: "TEMP GATE: <50°C before applying." },
  { id: 22, name: "Bacillus megaterium", short: "B. megaterium", icbb: "—", wave: "2", cost: 1.5, dose: 0.04, n: 0, p: 0.02, lig: 0, cp: 0, one: false, nine: false, src: "IndiaMART · $1.50/kg", what: "Late-stage phosphorus booster. Produces phytase enzyme that releases P trapped in phytate complexes. Best applied Day 14+ or directly into frass.", how: "Phytase (EC 3.1.3.26) releases phytate-bound P. No conflicts with any other organism. Enhances frass NPK profile.", outcomes: [["P solubilisation", "+0.02% DM"], ["Frass NPK", "improved"], ["No conflicts", "any wave"]], timing: "Day 14+ or frass direct application.", warn: "" },
  { id: 29, name: "Streptomyces ICBB 9155", short: "Streptomyces 9155", icbb: "ICBB 9155", wave: "2", cost: 5, dose: 0.03, n: 0, p: 0, lig: 0, cp: 0, one: false, nine: false, src: "Provibio / IPB ICBB Bogor · $5.00/kg", what: "Final-stage treatment that builds humic acids (improving soil fertility) and produces antibiotics that kill pathogens before substrate goes to BSF.", how: "Humic acid polymerisation increases frass CEC (Cation Exchange Capacity) 40–60% — nutrients stay in soil longer. Antibiotic production suppresses pathogenic bacteria and fungi. ICBB 9155 IPB-verified for palm residues.", outcomes: [["Frass CEC", "+40–60%"], ["Pathogen suppression", "broad spectrum"], ["Humic acid", "stable carbon fraction"]], timing: "Day 14–21 only. Pair with ICBB 9469 for broad-spectrum cover.", warn: "Apply Day 14–21 only." },
  { id: 30, name: "Streptomyces ICBB 9469", short: "Streptomyces 9469", icbb: "ICBB 9469", wave: "2", cost: 5, dose: 0.03, n: 0, p: 0, lig: 0, cp: 0, one: false, nine: false, src: "Provibio / IPB ICBB Bogor · $5.00/kg", what: "Companion to ICBB 9155 — different antibiotic profile means together they cover a broader range of pathogens.", how: "Complementary antibiotic spectrum to ICBB 9155. Together: broad-spectrum cover for all major bacterial and fungal pathogens. Both produce humic acid precursors.", outcomes: [["Pathogen cover", "broad-spectrum with 9155"], ["Humic acid", "co-formation"], ["IPB verified", "palm residues"]], timing: "Day 14–21 only. Always use alongside ICBB 9155.", warn: "Apply Day 14–21 only." },
  { id: 27, name: "Bacillus mucilaginosus", short: "B. mucilaginosus", icbb: "—", wave: "2", cost: 3, dose: 0.05, n: 0, p: 0, lig: 0, cp: 0, one: false, nine: false, src: "IndiaMART / Alibaba · $3.00/kg", what: "Solubilises potassium from silicate minerals. Most valuable in soil/frass application rather than substrate — where the silicate minerals are.", how: "Produces acidic exopolysaccharides that dissolve silicate minerals releasing K+. K in substrate (1.90% DM) is already high and mostly plant-available. Main benefit is in frass field application.", outcomes: [["K bioavailable", "uplift in field"], ["Best use", "frass application"], ["Silicate sol.", "active"]], timing: "Day 14+ or frass direct application.", warn: "" },
  { id: 25, name: "Bradyrhizobium japonicum", short: "Bradyrhizobium", icbb: "ICBB 9251", wave: "2", cost: 1.5, dose: 0.04, n: 0.15, p: 0, lig: 0, cp: 0.34, bsf: 3, one: false, nine: false, src: "Provibio / IPB ICBB · $1.50/kg", what: "Soil-phase N-fixer. Benefits frass fertiliser in-field.", how: "Slow-growing rhizobial N-fixer. Primary value is in frass application — fixes atmospheric N2 in rhizosphere when frass is applied to oil palm. Enhances frass NPK agronomic value.", outcomes: [["N added", "+0.15% DM"], ["CP uplift", "+0.34% DM"], ["Best use", "frass application"]], timing: "Day 14+ or frass direct application.", warn: "" },
  { id: 28, name: "Frateuria aurantia", short: "Frateuria", icbb: "—", wave: "2", cost: 4, dose: 0.04, n: 0, p: 0, lig: 0, cp: 0, bsf: 3, one: false, nine: false, src: "Specialty culture · $4.00/kg", what: "K-mobiliser specialist — highest K release rate of any biofertiliser.", how: "Produces organic acids that solubilise potassium from silicate minerals. Highest K-release rate of any known biofertiliser organism. Primary value in frass field application.", outcomes: [["K mobilisation", "highest rate"], ["Best use", "frass application"]], timing: "Day 14+ or frass direct application.", warn: "" },

  // CONDITIONAL
  { id: 31, name: "Bt ICBB 6095", short: "Bt ICBB 6095", icbb: "ICBB 6095", wave: "cond", cost: 0.15, dose: 0, n: 0, p: 0, lig: 0, cp: 0, one: false, nine: false, cond: true, src: "Provibio · CONDITIONAL USE ONLY · Status changed EXCLUDED → CONDITIONAL March 2026", what: "A biological pesticide that kills pest flies in S3 composting. CRITICAL: BSF (Black Soldier Fly) is the same insect order (Diptera) as the pest flies it targets. It is DIRECTLY LETHAL to BSF larvae.", how: "Cry protein crystal (delta-endotoxin) specifically targets Diptera gut epithelium. Binds gut receptors, forms pores, lyses cells. BSF is Diptera — larvae exposed to active Bt will die. The titre must fully decay to <10⁴ CFU/g before any BSF can be introduced.", outcomes: [["Pest fly control", "active in S3"], ["BSF safety", "REQUIRES titre decay"], ["Titre gate", "<10⁴ CFU/g lab-confirmed"], ["Status", "CONDITIONAL only"]], timing: "S3 composting phase ONLY before any BSF introduction. Apply Wave 1 if pest fly pressure is severe.", warn: "HARD GATE: Lab-confirm Bt titre has decayed to <10⁴ CFU/g BEFORE any BSF introduction. BSF is Diptera — active Bt is directly lethal to BSF larvae. Never apply when BSF larvae are present." },
];

// ── GOAL PRESETS ──
const GOAL_DATA = {
  N:      { sel: ["Saccharomyces", "Lactobacillus", "Azotobacter", "Paenibacillus", "Bradyrhizobium"] },
  P:      { sel: ["Pseudomonas", "B. megaterium", "Frateuria"] },
  LIG:    { sel: ["Phanerochaete", "Trichoderma", "Trametes", "Pleurotus", "Ganoderma"] },
  CP:     { sel: ["Rhizopus", "A. niger", "Saccharomyces", "A. oryzae", "Protease"] },
  GAS:    { sel: ["Lactobacillus", "Saccharomyces", "B. subtilis"] },
  COST:   { sel: ["Lactobacillus", "Saccharomyces", "B. subtilis", "Azotobacter", "Trichoderma"] },
  CUSTOM: { sel: [] },
};

// ── SOIL COEFFICIENTS ──
const SOIL_COEFFS = {
  inceptisol: { label: "Inceptisol", ph: "4.0–5.0", nLeach: 0.53, pFix: 20, desc: "39% IDN · highest base fertility · pH 4.1" },
  ultisol:    { label: "Ultisol",    ph: "4.5–5.5", nLeach: 0.62, pFix: 35, desc: "24% IDN · clay-rich · moderate leaching" },
  oxisol:     { label: "Oxisol",     ph: "4.4–5.2", nLeach: 0.58, pFix: 55, desc: "8% IDN · Fe/Al oxides · high P fixation" },
  histosol:   { label: "Histosol",   ph: "3.5–4.2", nLeach: 0.78, pFix: 10, desc: "7% IDN · peat · extreme N leaching · lime prohibited" },
  spodosol:   { label: "Spodosol",   ph: "4.5–5.2", nLeach: 0.71, pFix: 28, desc: "Sandy · lowest fertility · 31% lower yield vs Ultisols" },
  andisol:    { label: "Andisol",    ph: "5.0–6.0", nLeach: 0.44, pFix: 42, desc: "Volcanic · high P retention · good structure" },
};

// ═══════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════
export default function S3() {
  const [sel, setSel] = useState({});
  const [activeGoal, setActiveGoal] = useState(null);
  const [modalId, setModalId] = useState(null);
  const [activeNote, setActiveNote] = useState(null);
  const [protoOpen, setProtoOpen] = useState(false);
  const [currentSoil, setCurrentSoil] = useState("inceptisol");
  const [closedSections, setClosedSections] = useState({});

  // ── TOGGLE ORGANISM ──
  const toggleOrg = useCallback((id) => {
    setSel((prev) => {
      const next = { ...prev };
      if (next[id]) delete next[id]; else next[id] = true;
      return next;
    });
  }, []);

  // ── SELECT GOAL ──
  const selectGoal = useCallback((key) => {
    setActiveGoal(key);
    const shorts = GOAL_DATA[key]?.sel || [];
    const next = {};
    ORGS.forEach((o) => { if (shorts.includes(o.short)) next[o.id] = true; });
    setSel(next);
  }, []);

  // ── COMPUTED VALUES ──
  const computed = useMemo(() => {
    let allN = 0, allP = 0, allLig = 0, allCp = 0, cost = 0, cnt = 0;
    ORGS.forEach((o) => {
      if (!sel[o.id]) return;
      cnt++; allN += o.n; allP += o.p; allLig += o.lig * 0.5; allCp += o.cp;
      cost += o.cost * o.dose * 8157 / 100;
    });
    const cpt = cost / 8157;
    let cmcase = 0;
    ORGS.forEach((o) => { if (sel[o.id] && o.lig > 0) cmcase += o.lig * 12; });
    let nh3 = 0;
    ORGS.forEach((o) => {
      if (!sel[o.id]) return;
      if (o.id === 15 || o.id === 21) nh3 += 50;
      else if (o.cp > 0) nh3 += 5;
    });
    nh3 = Math.min(nh3, 85);
    const hasBt = !!sel[31];
    return { allN, allP, allLig, allCp, cost, cnt, cpt, cmcase, nh3, hasBt };
  }, [sel]);

  // ── TOGGLE NOTE ──
  const toggleNote = (key) => setActiveNote((p) => (p === key ? null : key));

  // ── TOGGLE SECTION ──
  const toggleSection = (key) => setClosedSections((p) => ({ ...p, [key]: !p[key] }));

  // ── STYLES ──
  const s = {
    page: { background: T.navy, color: T.greyL, fontFamily: F, fontSize: 13, lineHeight: 1.5, minHeight: "100vh" },
    // HEADER — white/light, logo on top
    header: { position: "sticky", top: 0, zIndex: 100, background: "#FFFFFF", borderBottom: `1px solid #E0E0E0`, padding: "0 24px", display: "flex", alignItems: "center", height: 56, gap: 16 },
    logo: { display: "flex", alignItems: "center", gap: 10 },
    logoMark: { width: 36, height: 36, borderRadius: 8, background: `linear-gradient(135deg, ${T.teal}, #0B1827)`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: F, fontWeight: 800, fontSize: 16, letterSpacing: "-.02em" },
    logoText: { fontFamily: F, fontSize: 18, fontWeight: 800, color: "#0B1827", letterSpacing: "-.01em" },
    logoSpan: { color: T.teal },
    stageNav: { display: "flex", gap: 2, marginLeft: "auto" },
    stageBtn: (active) => ({ fontFamily: F, fontSize: 10, fontWeight: 700, padding: "4px 10px", borderRadius: 4, border: `1px solid ${active ? T.teal : "#D0D0D0"}`, color: active ? "#fff" : "#888", background: active ? T.teal : "transparent", cursor: "pointer", transition: "all .12s" }),
    // TICKER
    ticker: { background: "rgba(6,12,20,.95)", borderBottom: `1px solid ${T.border}`, padding: "6px 24px", display: "flex", gap: 0, overflowX: "auto" },
    tick: { display: "flex", alignItems: "center", gap: 6, padding: "0 16px", borderRight: `1px solid ${T.border}`, whiteSpace: "nowrap" },
    tickLbl: { fontSize: 9, fontWeight: 700, color: T.grey, textTransform: "uppercase", letterSpacing: ".06em", fontFamily: F },
    tickVal: (c) => ({ fontFamily: F, fontSize: 13, fontWeight: 700, color: c }),
    // SUBSTRATE STRIP LABEL
    stripLabel: { background: T.navyLL, borderBottom: `1px solid ${T.borderT}`, padding: "6px 24px", fontFamily: F, fontSize: 10, fontWeight: 700, color: T.teal, textTransform: "uppercase", letterSpacing: ".1em", display: "flex", alignItems: "center", gap: 12 },
    stripLabelSub: { fontFamily: F, fontWeight: 400, textTransform: "none", letterSpacing: 0, fontSize: 10, color: T.grey },
    // SUBSTRATE GRID
    rdWrapper: { display: "grid", gridTemplateColumns: "64px repeat(4,1fr) 64px 66px repeat(4,1fr)", width: "100%", borderBottom: `2px solid rgba(64,215,197,0.22)`, background: T.navy },
    rdLabel: (side) => ({ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", background: T.navyM, borderRight: side === "in" ? `1px solid rgba(64,215,197,0.25)` : "none", borderLeft: side === "out" ? `1px solid rgba(64,215,197,0.25)` : "none", padding: "0 10px", width: 64, writingMode: "vertical-rl", textOrientation: "mixed", transform: "rotate(180deg)", whiteSpace: "nowrap", cursor: "default" }),
    rdLabelWord: { fontFamily: F, fontSize: 16, fontWeight: 700, color: T.amber, letterSpacing: ".04em" },
    rdField: (isActive) => ({ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "18px 8px", cursor: "pointer", transition: "background .15s", position: "relative", background: isActive ? "rgba(64,215,197,0.08)" : "transparent" }),
    rdTitle: { fontFamily: F, fontSize: 10, fontWeight: 700, color: T.grey, textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 5, whiteSpace: "nowrap" },
    rdNum: (c) => ({ fontFamily: F, fontSize: 14, fontWeight: 700, color: c || T.amber, lineHeight: 1.2, whiteSpace: "nowrap" }),
    rdUnit: { fontFamily: F, fontSize: 10, color: T.grey, marginTop: 3, whiteSpace: "nowrap" },
    rdArrow: { display: "flex", alignItems: "center", justifyContent: "center", background: T.navy, fontFamily: F, fontSize: 99, fontWeight: 900, color: T.teal, lineHeight: 1 },
    rdNote: (show) => ({ display: show ? "block" : "none", gridColumn: "1/-1", background: "rgba(64,215,197,0.07)", borderTop: `1px solid rgba(64,215,197,0.25)`, padding: "11px 16px", fontFamily: F, fontSize: 12, color: T.greyL, lineHeight: 1.7 }),
    rdNoteSrc: { marginTop: 5, fontSize: 10, color: T.grey, fontFamily: F },
    // SECTION
    section: { padding: "20px 24px" },
    sectionTitle: { fontFamily: F, fontSize: 13, fontWeight: 700, color: T.teal, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 4 },
    sectionSub: { fontSize: 11, color: T.grey, marginBottom: 14 },
    // GOAL ROW
    goalRow: { display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 8 },
    goal: (isSel) => ({ background: isSel ? "rgba(64,215,197,.08)" : T.navyL, border: `${isSel ? 2 : 1.5}px solid ${isSel ? T.teal : T.border}`, borderRadius: 10, padding: "14px 10px", cursor: "pointer", transition: "all .15s", position: "relative", overflow: "hidden", textAlign: "center" }),
    goalBar: { content: "", position: "absolute", top: 0, left: 0, right: 0, height: 3, background: T.teal },
    goalName: (isSel) => ({ fontFamily: F, fontSize: 11, fontWeight: 700, color: isSel ? T.teal : T.greyL, marginBottom: 6, lineHeight: 1.3 }),
    goalDelta: (c) => ({ fontFamily: F, fontSize: 13, fontWeight: 700, color: c || T.green, marginBottom: 5 }),
    goalOrgs: { fontSize: 9, color: T.grey, lineHeight: 1.4 },
    // SOIL BAR
    soilBtn: (active) => ({ background: active ? "rgba(64,215,197,.10)" : T.navyL, border: `1px solid ${active ? "rgba(64,215,197,.55)" : "rgba(139,160,180,.18)"}`, color: active ? T.teal : T.grey, fontFamily: F, fontSize: 10, fontWeight: 700, padding: "4px 10px", borderRadius: 4, cursor: "pointer", transition: "all .15s" }),
    // TIMELINE
    timelineWrap: { margin: "0 24px 20px", border: `1.5px solid ${T.border}`, borderRadius: 10, overflow: "hidden" },
    waveLane: (color) => ({ display: "flex", alignItems: "stretch", minHeight: 52, borderBottom: `1px solid ${T.border}`, borderLeft: `3px solid ${color}` }),
    wlMeta: { width: 130, flexShrink: 0, padding: "10px 12px", borderRight: `1px solid ${T.border}`, display: "flex", flexDirection: "column", justifyContent: "center", background: T.navyM },
    wlWave: (c) => ({ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 2, color: c }),
    wlDay: { fontSize: 10, fontWeight: 700, color: T.greyL },
    wlNote: (c) => ({ fontSize: 8, color: c || T.grey, marginTop: 2, lineHeight: 1.4 }),
    wlOrgs: { flex: 1, display: "flex", flexWrap: "wrap", gap: 5, padding: "10px 12px", alignContent: "center" },
    wlSlot: (isSel) => ({ fontSize: 9, fontWeight: 700, padding: "4px 10px", borderRadius: 20, border: `1px ${isSel ? "solid" : "dashed"} ${isSel ? "rgba(61,203,122,.4)" : T.border}`, color: isSel ? T.green : T.border, background: isSel ? "rgba(61,203,122,.12)" : "transparent", cursor: "pointer", fontFamily: F, whiteSpace: "nowrap", transition: "all .12s" }),
    // ORGANISM SECTIONS
    orgSectionHdr: (bg, bdr) => ({ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: "7px 7px 0 0", cursor: "pointer", userSelect: "none", background: bg, border: `1.5px solid ${bdr}`, marginBottom: 0 }),
    oshWave: (c, bdr, bg) => ({ fontSize: 9, fontWeight: 700, padding: "3px 10px", borderRadius: 20, border: `1px solid ${bdr}`, fontFamily: F, color: c, background: bg }),
    oshTitle: { fontSize: 11, fontWeight: 700, color: T.greyL, flex: 1 },
    oshCount: { fontFamily: F, fontSize: 10, color: T.grey },
    oshChevron: (closed) => ({ fontSize: 10, color: T.grey, transition: "transform .2s", transform: closed ? "rotate(-90deg)" : "" }),
    oshWarn: (c) => ({ display: "block", padding: "6px 14px", fontSize: 10, color: c, lineHeight: 1.5 }),
    oshSub: (bdr) => ({ background: "rgba(0,0,0,.15)", borderLeft: `1.5px solid ${bdr}`, borderRight: `1.5px solid ${bdr}`, padding: "5px 14px", fontSize: 10, color: T.grey }),
    orgGrid: { display: "flex", flexWrap: "wrap", gap: 5, padding: "8px 12px 12px", border: `1.5px solid ${T.border}`, borderTop: "none", borderRadius: "0 0 7px 7px", background: "rgba(0,0,0,.2)" },
    orgBtn: (isSel, isWarn, isCond) => ({ display: "inline-flex", alignItems: "flex-start", gap: 8, padding: "7px 12px", borderRadius: 7, border: `1.5px solid ${isSel ? T.green : isCond ? T.amber : isWarn ? T.amber : T.border}`, background: isSel ? "rgba(61,203,122,.07)" : isCond ? "rgba(245,166,35,.04)" : T.navyL, cursor: "pointer", transition: "all .12s", flexDirection: "column" }),
    obChk: (isSel) => ({ width: 15, height: 15, borderRadius: 3, border: `1.5px solid ${isSel ? T.green : T.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 10, fontWeight: 900, color: isSel ? T.navy : "transparent", background: isSel ? T.green : "transparent", transition: "all .1s" }),
    obName: (isSel) => ({ fontSize: 11, fontWeight: 700, color: isSel ? T.green : T.greyL, fontFamily: F, flex: 1 }),
    obInfo: { fontSize: 10, fontWeight: 600, padding: "3px 10px", borderRadius: 4, border: `1.5px solid rgba(64,215,197,.4)`, color: T.teal, background: "rgba(64,215,197,.06)", cursor: "pointer", fontFamily: F, transition: "all .1s", flexShrink: 0, marginLeft: 4 },
    obPills: { display: "flex", gap: 5, alignItems: "center", flexWrap: "wrap", marginTop: 2 },
    obPill: (c, bdr, bg) => ({ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 5, border: `1.5px solid ${bdr}`, fontFamily: F, letterSpacing: ".01em", whiteSpace: "nowrap", color: c, background: bg }),
    // KPI
    kpiGrid: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 },
    kpiCard: { background: T.navyL, border: `1.5px solid ${T.border}`, borderRadius: 8, padding: "12px 14px", display: "flex", flexDirection: "column", gap: 4 },
    kpiHdr: { fontFamily: F, fontSize: 10, fontWeight: 700, color: T.teal, textTransform: "uppercase", letterSpacing: ".06em", borderBottom: `1px solid rgba(64,215,197,.2)`, paddingBottom: 5, marginBottom: 2 },
    kpiVal: (c) => ({ fontFamily: F, fontSize: 22, fontWeight: 700, color: c || T.greyL, lineHeight: 1.1 }),
    kpiUnit: { fontFamily: F, fontSize: 9, color: T.grey },
    // RESULTS BAR
    resultsBar: { position: "sticky", bottom: 0, zIndex: 90, background: T.navyM, borderTop: `2px solid ${T.borderT}`, padding: "10px 24px", display: "flex", alignItems: "center", gap: 16, boxShadow: "0 -8px 32px rgba(0,0,0,.5)" },
    rbItem: { display: "flex", flexDirection: "column", gap: 1 },
    rbLbl: { fontSize: 9, fontWeight: 700, color: T.grey, textTransform: "uppercase", letterSpacing: ".05em" },
    rbVal: (c) => ({ fontFamily: F, fontSize: 14, fontWeight: 700, color: c }),
    rbDivider: { width: 1, height: 30, background: T.border },
    rbBtn: (disabled) => ({ marginLeft: "auto", fontSize: 12, fontWeight: 700, padding: "9px 24px", borderRadius: 7, border: "none", background: disabled ? T.border : T.teal, color: disabled ? T.grey : T.navy, cursor: disabled ? "not-allowed" : "pointer", transition: "all .15s", whiteSpace: "nowrap", fontFamily: F }),
    // MODAL
    modalBg: { position: "fixed", inset: 0, zIndex: 500, background: "rgba(0,0,0,.7)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 },
    modal: { background: T.navyL, border: `1.5px solid ${T.borderT}`, borderRadius: 12, width: "100%", maxWidth: 580, maxHeight: "90vh", display: "flex", flexDirection: "column" },
    modalHdr: { background: T.navyM, borderBottom: `1.5px solid ${T.border}`, padding: "14px 52px 14px 18px", position: "relative", borderRadius: "12px 12px 0 0", flexShrink: 0 },
    modalName: { fontFamily: F, fontSize: 15, fontWeight: 700, color: T.teal, lineHeight: 1.3 },
    modalIcbb: { fontSize: 10, color: T.grey, fontFamily: F, marginTop: 2 },
    modalClose: { position: "absolute", top: 14, right: 16, display: "flex", alignItems: "center", gap: 5, fontSize: 10, fontWeight: 700, fontFamily: F, color: T.grey, border: `1px solid rgba(168,189,208,.25)`, borderRadius: 5, padding: "4px 10px", cursor: "pointer", background: T.navyM, zIndex: 10 },
    modalBody: { overflowY: "auto", padding: 0, flex: 1 },
    modalSection: { padding: "14px 18px", borderBottom: `1px solid ${T.border}` },
    msTag: { fontSize: 9, fontWeight: 700, color: T.teal, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 4 },
    msTitle: { fontSize: 12, fontWeight: 700, color: T.white, marginBottom: 6 },
    msBody: { fontSize: 11, color: T.grey, lineHeight: 1.7 },
    msSource: { fontSize: 10, color: T.grey, fontFamily: F },
    outcomeRow: { display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "5px 0", borderBottom: `1px solid rgba(30,64,96,.4)` },
    orLbl: { fontSize: 10, color: T.grey },
    orVal: { fontFamily: F, fontSize: 12, fontWeight: 700, color: T.green },
    codeLine: { background: "#000", border: `1px solid ${T.border}`, borderRadius: 5, padding: "8px 12px", fontFamily: F, fontSize: 10, color: T.teal, lineHeight: 1.7, marginTop: 6 },
    warnBanner: { background: "rgba(245,166,35,.07)", border: "1px solid rgba(245,166,35,.3)", borderRadius: 5, padding: "8px 12px", fontSize: 10, color: T.amber, lineHeight: 1.6, marginTop: 8 },
    errBanner: { background: "rgba(232,64,64,.07)", border: "1px solid rgba(232,64,64,.3)", borderRadius: 5, padding: "8px 12px", fontSize: 10, color: T.red, lineHeight: 1.6, marginTop: 8 },
    modalFtr: { background: T.navyM, borderTop: `1.5px solid ${T.border}`, padding: "12px 18px", display: "flex", alignItems: "center", gap: 10, borderRadius: "0 0 12px 12px", flexShrink: 0 },
    mfCost: { fontSize: 10, color: T.grey },
    mfBtn: (isSel) => ({ marginLeft: "auto", fontSize: 11, fontWeight: 700, fontFamily: F, padding: "7px 20px", borderRadius: 6, border: isSel ? `1.5px solid ${T.red}` : "none", cursor: "pointer", transition: "all .12s", background: isSel ? "rgba(232,64,64,.15)" : T.green, color: isSel ? T.red : T.navy }),
    // PROTOCOL PANEL
    protoPanel: (open) => ({ display: open ? "block" : "none", borderTop: `2px solid ${T.teal}`, background: T.navyM, padding: "20px 24px" }),
    protoGrid: { display: "grid", gridTemplateColumns: "1fr 280px", gap: 20 },
    protoTable: { width: "100%", borderCollapse: "collapse", fontSize: 11 },
    protoTh: { fontSize: 9, fontWeight: 700, color: T.grey, textTransform: "uppercase", letterSpacing: ".04em", padding: "6px 10px", textAlign: "left", borderBottom: `1px solid ${T.border}`, background: "rgba(0,0,0,.3)" },
    protoTd: { padding: "6px 10px", borderBottom: "1px solid rgba(30,64,96,.3)", color: T.greyL },
    outflowCard: { background: "rgba(0,0,0,.3)", border: `1.5px solid ${T.border}`, borderRadius: 8, padding: 14 },
    ocTitle: { fontSize: 10, fontWeight: 700, color: T.teal, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 10 },
    ocRow: { display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "5px 0", borderBottom: "1px solid rgba(30,64,96,.25)" },
    ocLbl: { fontSize: 10, color: T.grey },
    ocVal: { fontFamily: F, fontSize: 11, fontWeight: 700, color: T.teal },
    ocTotal: { marginTop: 10, padding: 8, background: "rgba(64,215,197,.07)", border: `1px solid rgba(64,215,197,.3)`, borderRadius: 5, textAlign: "center" },
    ocTotalVal: { fontFamily: F, fontSize: 18, fontWeight: 700, color: T.green },
  };

  // ── INFLOW/OUTFLOW NOTE DATA ──
  const NOTES = {
    "r-vol": { title: "Monthly Volume", body: "Post-S2 press and size-reduction weight. ~7,200 t FW/month entering S3. Exact figure requires S1/S2 mass balance confirmation from pilot.", src: "Source: S1/S2 mass balance · CFI Design Basis 60 TPH · Pilot confirmation pending (Alex, IPB)" },
    "r-moist": { title: "Moisture", body: "55–65% wb target. Below 55% organism establishment slows. Above 65% anaerobic pockets form and CH₄ risk rises.", src: "Source: CFI S2 process spec · OPDC press floor 40% MC CLASS A guardrail" },
    "r-cp": { title: "Crude Protein", body: "N × 6.25 (AOAC 984.13). EFB+OPDC 60:40 blend canonical: 8.14% CP DM. Day 0 baseline before biological uplift.", src: "Source: CFI Lab · EFB 4.75% CP · OPDC 14.5% CP · 60:40 blend = 8.14% · Locked Mar 2026" },
    "r-lig": { title: "Lignin ADL", body: "25% DM. Trichoderma and Phanerochaete target this — 10–25% reduction by Day 14.", src: "Source: CFI Lab · EFB 22% ADL · OPDC 30.7% ADL · 60:40 blend = 25% · Locked Mar 2026" },
    "r-sug": { title: "Reducing Sugars", body: "8–15% DM post-PKSA. Immediate carbon for Lactobacillus Day 0. Fermentation drops pH 8–10 → 5.5–6.0 within 48h, killing methanogens.", src: "Source: PKSA hydrolysis kinetics · DNS colorimetric assay" },
    "r-oc": { title: "Organic Carbon", body: "41% DM by CHNS analyser. Total carbon pool for biological metabolism and humic acid formation.", src: "Source: CFI CHNS analysis · EFB C 41.41% Malaysia combustion study 2023" },
    "r-cn": { title: "C:N Ratio", body: "32:1 DM-weighted for EFB+OPDC 60:40 blend. Narrows to 20:1 at Discharge as N is added biologically.", src: "Source: CFI canonical · EFB C:N 60 · OPDC C:N 20 · 60:40 weighted = 32:1 · Locked Mar 2026" },
    "r-npk": { title: "NPK", body: "N, P, K values read live from S0 feedstock inputs. Synthetic value calculated from S0 data pipeline.", src: "Source: S0 canonical_lab_data · Blend canonical Locked Mar 2026" },
    "d-vol": { title: "Outflow · Volume", body: "7,200 t FW confirmed at S3 exit. Volume integrity confirms no unaccounted diversion.", src: "Source: S3 mass balance · Azotobacter N-fixation adds <0.1% mass" },
    "d-moist": { title: "Outflow · Moisture", body: "60–70% wb. Adjusted via S3 sprinkler. BSF Handoff Gate Criterion #2.", src: "Source: BSF Handoff Gate Criterion #2 · S3 sprinkler spec" },
    "d-cp": { title: "Outflow · Crude Protein", body: "9.2%+ DM. +1.06% uplift via Azotobacter fixation + Saccharomyces NH₃ retention. Biological protein from atmospheric nitrogen — zero synthetic input.", src: "Source: Azotobacter nifH studies · Saccharomyces NH₃ assimilation pathway" },
    "d-lig": { title: "Outflow · Lignin ADL", body: "19–21% DM. −4–6% vs inflow. Trichoderma CMCase peak 20–35 U/g + Phanerochaete LiP/MnP/Laccase.", src: "Source: Trichoderma CMCase ICBB literature · Phanerochaete ligninase data" },
    "d-sug": { title: "Outflow · Red. Sugars", body: "2–5% DM. Drawdown from 8–15% confirms biological activity established Day 0.", src: "Source: Lactobacillus fermentation kinetics · DNS assay Day 14" },
    "d-oc": { title: "Outflow · Organic Carbon", body: "39–40% DM. Normal CO₂ respiration loss. Stable humic C fraction increases — improves soil CEC.", src: "Source: Composting C mineralisation kinetics · Humic acid formation pathway" },
    "d-cn": { title: "Outflow · C:N Ratio", body: "20:1. Narrowed from 32:1 — 12-point improvement. BSF Handoff Gate Criterion #1 requires 15–25:1.", src: "Source: BSF Handoff Gate Criterion #1 · Azotobacter + Saccharomyces N contribution" },
    "d-npk": { title: "Outflow · NPK", body: "N: 2.10% (+0.34%) · P: 0.36% (+0.06% via Pseudomonas) · K: 1.90% (=). Synthetic value: $7.11/t FW (+$1.25).", src: "Source: Azotobacter nifH + Saccharomyces data · Pseudomonas P-solubilisation literature" },
  };

  // ── MODAL ORGANISM ──
  const modalOrg = modalId != null ? ORGS.find((o) => o.id === modalId) : null;

  // ── ARROW HELPER ──
  const Arrow = ({ dir, color }) => {
    const map = { up: "↑", dn: "↓", eq: "=" };
    const cMap = { up: T.green, dn: T.red, eq: T.grey };
    return <span style={{ fontSize: 16, fontWeight: 900, color: color || cMap[dir], lineHeight: 1, fontFamily: F }}>{map[dir]}</span>;
  };

  // ── PILL HELPER ──
  const Pill = ({ c, bdr, bg, children }) => <span style={s.obPill(c, bdr, bg)}>{children}</span>;

  // ── SUBSTRATE FIELD ──
  const SubField = ({ noteKey, title, children, unit, gridCol, gridRow }) => (
    <div
      style={{ ...s.rdField(activeNote === noteKey), gridColumn: gridCol, gridRow: gridRow }}
      onClick={() => toggleNote(noteKey)}
    >
      <div style={s.rdTitle}>{title}</div>
      {children}
      {unit && <div style={s.rdUnit}>{unit}</div>}
    </div>
  );

  // ═══════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════
  return (
    <>
      {/* ── HEADER (white, logo on top — above entire page) ── */}
      <header style={s.header}>
        <div style={s.logo}>
          <div style={s.logoMark}>CFI</div>
          <div style={s.logoText}>CFI <span style={s.logoSpan}>Deep Tech</span></div>
        </div>
        <nav style={s.stageNav}>
          {["S0","S1","S2","S3","S4","S5","S6"].map((st) => (
            <button key={st} style={s.stageBtn(st === "S3")}>{st}</button>
          ))}
        </nav>
      </header>

      <div style={s.page}>

      {/* ── LIVE TICKER ── */}
      <div style={s.ticker}>
        {[
          { lbl: "Organisms", val: computed.cnt, c: T.teal },
          { lbl: "Cost", val: computed.cnt ? `$${computed.cpt.toFixed(2)}/t` : "$0.00/t", c: T.amber },
          { lbl: "Monthly OpEx", val: computed.cnt ? `$${Math.round(computed.cpt * 7200).toLocaleString()}/mo` : "$0/mo", c: T.amber },
          { lbl: "N uplift", val: `+${computed.allN.toFixed(2)}%`, c: T.green },
          { lbl: "P uplift", val: `+${computed.allP.toFixed(2)}%`, c: T.green },
          { lbl: "Lignin ADL", val: "25.0%", c: T.green },
          { lbl: "Crude Protein", val: "—", c: T.teal },
          { lbl: "Synthetic Value", val: "—", c: T.green },
        ].map((t, i) => (
          <div key={i} style={{ ...s.tick, ...(i === 0 ? { paddingLeft: 0 } : {}), ...(i === 7 ? { borderRight: "none" } : {}) }}>
            <div style={s.tickLbl}>{t.lbl}</div>
            <div style={s.tickVal(t.c)}>{t.val}</div>
          </div>
        ))}
      </div>

      {/* ── SUBSTRATE FLOW LABEL ── */}
      <div style={s.stripLabel}>
        Substrate Flow — S2 Reception → S3 Discharge
        <span style={s.stripLabelSub}>Click any Inflow field for source notes</span>
      </div>

      {/* ── SUBSTRATE FLOW GRID ── */}
      <div style={s.rdWrapper}>
        {/* INFLOWS LABEL */}
        <div style={{ ...s.rdLabel("in"), gridColumn: 1, gridRow: "1/3" }}>
          <div style={s.rdLabelWord}>Inflows</div>
        </div>
        {/* INFLOWS ROW 1 */}
        <SubField noteKey="r-vol" title="Monthly Volume" unit="FW / month · Post-S2" gridCol={2} gridRow={1}>
          <div style={s.rdNum()}>7,200 <span style={{ fontSize: 11 }}>t</span></div>
        </SubField>
        <SubField noteKey="r-moist" title="Moisture" unit="MC wb · Post-Press" gridCol={3} gridRow={1}>
          <div style={s.rdNum()}>55–65<span style={{ fontSize: 11 }}>%</span></div>
        </SubField>
        <SubField noteKey="r-cp" title="Crude Protein" unit="DM · S0 input" gridCol={4} gridRow={1}>
          <div style={s.rdNum(T.border)}>—<span style={{ fontSize: 11 }}>%</span></div>
        </SubField>
        <SubField noteKey="r-lig" title="Lignin ADL" unit="DM · S0 input" gridCol={5} gridRow={1}>
          <div style={s.rdNum(T.border)}>—<span style={{ fontSize: 11 }}>%</span></div>
        </SubField>
        {/* INFLOWS ROW 2 */}
        <SubField noteKey="r-sug" title="Red. Sugars" unit="DM · TRS · DNS" gridCol={2} gridRow={2}>
          <div style={s.rdNum()}>8–15<span style={{ fontSize: 11 }}>%</span></div>
        </SubField>
        <SubField noteKey="r-oc" title="Organic Carbon" unit="DM · S0 input" gridCol={3} gridRow={2}>
          <div style={s.rdNum(T.border)}>—<span style={{ fontSize: 11 }}>%</span></div>
        </SubField>
        <SubField noteKey="r-cn" title="C:N Ratio" unit="DM-Weighted" gridCol={4} gridRow={2}>
          <div style={s.rdNum(T.border)}>—<span style={{ fontSize: 11 }}>:1</span></div>
        </SubField>
        <SubField noteKey="r-npk" title="" unit="" gridCol={5} gridRow={2}>
          <div style={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "center" }}>
            {["N","P","K"].map((k) => (
              <div key={k} style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                <span style={{ fontFamily: F, fontSize: 10, fontWeight: 700, color: T.teal, width: 10 }}>{k}</span>
                <span style={{ fontFamily: F, fontSize: 11, fontWeight: 700, color: T.border }}>—</span>
                <span style={{ fontFamily: F, fontSize: 9, color: T.grey }}>% DM</span>
              </div>
            ))}
          </div>
        </SubField>

        {/* OUTFLOWS LABEL */}
        <div style={{ ...s.rdLabel("out"), gridColumn: 6, gridRow: "1/3" }}>
          <div style={s.rdLabelWord}>Outflows</div>
        </div>
        {/* ARROW */}
        <div style={{ ...s.rdArrow, gridColumn: 7, gridRow: "1/3" }}>→</div>
        {/* OUTFLOWS ROW 1 */}
        <SubField noteKey="d-vol" title="Monthly Volume" unit="FW / month · S3 Exit" gridCol={8} gridRow={1}>
          <div style={{ display: "flex", alignItems: "center", gap: 3 }}><Arrow dir="eq" /><span style={s.rdNum(T.teal)}>7,200 <span style={{ fontSize: 11 }}>t</span></span></div>
        </SubField>
        <SubField noteKey="d-moist" title="Moisture" unit="MC wb · BSF Gate" gridCol={9} gridRow={1}>
          <div style={{ display: "flex", alignItems: "center", gap: 3 }}><Arrow dir="up" /><span style={s.rdNum(T.teal)}>60–70<span style={{ fontSize: 11 }}>%</span></span></div>
        </SubField>
        <SubField noteKey="d-cp" title="Crude Protein" unit="DM · N×6.25" gridCol={10} gridRow={1}>
          <div style={{ display: "flex", alignItems: "center", gap: 3 }}><Arrow dir="up" /><span style={s.rdNum(T.teal)}>9.2+<span style={{ fontSize: 11 }}>%</span></span></div>
        </SubField>
        <SubField noteKey="d-lig" title="Lignin ADL" unit="DM · Day 14" gridCol={11} gridRow={1}>
          <div style={{ display: "flex", alignItems: "center", gap: 3 }}><Arrow dir="dn" /><span style={s.rdNum(T.teal)}>19–21<span style={{ fontSize: 11 }}>%</span></span></div>
        </SubField>
        {/* OUTFLOWS ROW 2 */}
        <SubField noteKey="d-sug" title="Red. Sugars" unit="DM · Biology Confirmed" gridCol={8} gridRow={2}>
          <div style={{ display: "flex", alignItems: "center", gap: 3 }}><Arrow dir="up" /><span style={s.rdNum(T.teal)}>2–5<span style={{ fontSize: 11 }}>%</span></span></div>
        </SubField>
        <SubField noteKey="d-oc" title="Organic Carbon" unit="DM · CO₂ Normal" gridCol={9} gridRow={2}>
          <div style={{ display: "flex", alignItems: "center", gap: 3 }}><Arrow dir="dn" /><span style={s.rdNum(T.teal)}>39–40<span style={{ fontSize: 11 }}>%</span></span></div>
        </SubField>
        <SubField noteKey="d-cn" title="C:N Ratio" unit="DM · BSF Gate" gridCol={10} gridRow={2}>
          <div style={{ display: "flex", alignItems: "center", gap: 3 }}><Arrow dir="dn" /><span style={s.rdNum(T.teal)}>20<span style={{ fontSize: 11 }}>:1</span></span></div>
        </SubField>
        <SubField noteKey="d-npk" title="" unit="" gridCol={11} gridRow={2}>
          <div style={{ display: "flex", flexDirection: "column", gap: 3, alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}><Arrow dir="up" color={T.green} /><span style={{ fontFamily: F, fontSize: 10, fontWeight: 700, color: T.teal, width: 10 }}>N</span><span style={{ fontFamily: F, fontSize: 12, fontWeight: 700, color: T.teal }}>2.10</span><span style={{ fontFamily: F, fontSize: 9, color: T.grey }}>% DM</span></div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}><Arrow dir="up" color={T.green} /><span style={{ fontFamily: F, fontSize: 10, fontWeight: 700, color: T.teal, width: 10 }}>P</span><span style={{ fontFamily: F, fontSize: 12, fontWeight: 700, color: T.teal }}>0.36</span><span style={{ fontFamily: F, fontSize: 9, color: T.grey }}>% DM</span></div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}><Arrow dir="eq" color={T.grey} /><span style={{ fontFamily: F, fontSize: 10, fontWeight: 700, color: T.teal, width: 10 }}>K</span><span style={{ fontFamily: F, fontSize: 12, fontWeight: 700, color: T.amber }}>1.90</span><span style={{ fontFamily: F, fontSize: 9, color: T.grey }}>% DM</span></div>
          </div>
        </SubField>

        {/* NOTES */}
        {Object.entries(NOTES).map(([key, note]) => (
          <div key={key} style={s.rdNote(activeNote === key)}>
            <strong style={{ color: T.teal }}>{note.title}</strong> — {note.body}
            <div style={s.rdNoteSrc}>{note.src}</div>
          </div>
        ))}
      </div>

      {/* ── GOAL SELECTOR ── */}
      <div style={s.section}>
        <div style={s.sectionTitle}>What is your goal for this batch?</div>
        <div style={s.sectionSub}>Your selection filters organisms by relevance and updates projected outcomes.</div>
        <div style={s.goalRow}>
          {[
            { key: "N", name: "Maximise Nitrogen", delta: "N +0.34%", c: T.green, orgs: "Azotobacter · Saccharomyces" },
            { key: "P", name: "Maximise Phosphorus", delta: "P +0.06%", c: T.red, orgs: "Pseudomonas · B. megaterium" },
            { key: "LIG", name: "Break Down Lignin", delta: "ADL -25%", c: T.violet, orgs: "Phanerochaete · Trichoderma" },
            { key: "CP", name: "Maximise Protein", delta: "CP 8.14→9.8%", c: T.blue, orgs: "Rhizopus · Aspergillus" },
            { key: "GAS", name: "Control Gas Emissions", delta: "CH4 -80%", c: T.blue, orgs: "Lactobacillus · Saccharomyces" },
            { key: "COST", name: "Lowest Cost Stack", delta: "$0.65/t FW", c: T.green, orgs: "5 organisms · One-Shot" },
            { key: "CUSTOM", name: "Custom Mix", delta: "I'll choose", c: T.grey, orgs: "All 43 organisms" },
          ].map((g) => {
            const isSel = activeGoal === g.key;
            return (
              <div key={g.key} style={s.goal(isSel)} onClick={() => selectGoal(g.key)}>
                {isSel && <div style={s.goalBar} />}
                <div style={s.goalName(isSel)}>{g.name}</div>
                <div style={s.goalDelta(g.c)}>{g.delta}</div>
                <div style={s.goalOrgs}>{g.orgs}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── SOIL TYPE BAR ── */}
      <div style={{ display: "flex", gap: 8, padding: "12px 24px 0", flexWrap: "wrap" }}>
        <span style={{ fontFamily: F, fontSize: 10, color: T.grey, alignSelf: "center", marginRight: 4 }}>SOIL TYPE</span>
        {Object.entries(SOIL_COEFFS).map(([key, sc]) => (
          <button key={key} style={s.soilBtn(currentSoil === key)} onClick={() => setCurrentSoil(key)}>{sc.label}</button>
        ))}
      </div>
      {computed.cnt > 0 && (
        <div style={{ padding: "6px 24px 4px", fontFamily: F, fontSize: 10, color: T.grey }}>
          Outflows adjusted for {SOIL_COEFFS[currentSoil].label} — N-leach factor {SOIL_COEFFS[currentSoil].nLeach} · P-fix {SOIL_COEFFS[currentSoil].pFix}% · pH {SOIL_COEFFS[currentSoil].ph} · {SOIL_COEFFS[currentSoil].desc}
        </div>
      )}

      {/* ── INOCULATION SCHEDULE ── */}
      <div style={{ ...s.section, paddingTop: 8 }}>
        <div style={s.sectionTitle}>Inoculation schedule</div>
        <div style={{ ...s.sectionSub, marginBottom: 10 }}>Click organism slots to select. Your choices populate here automatically.</div>
        <div style={s.timelineWrap}>
          {WAVES.map((w) => {
            const waveOrgs = ORGS.filter((o) => o.wave === w.key);
            if (w.key === "cond" && !waveOrgs.some((o) => sel[o.id])) return null;
            const laneColor = w.color;
            return (
              <div key={w.key} style={s.waveLane(laneColor)}>
                <div style={s.wlMeta}>
                  <div style={s.wlWave(w.color)}>{w.waveLabel}</div>
                  <div style={s.wlDay}>{w.key === "pre" ? "Before Day 0" : w.key === "1a" ? "Day 0 — Loading" : w.key === "1b" ? "Day 3+ only" : w.key === "2" ? "Day 5+ · Temp <50°C" : "Hard gate required"}</div>
                  <div style={s.wlNote(w.key === "1b" || w.key === "cond" ? T.amber : undefined)}>
                    {w.key === "pre" ? "Applied in hydration water" : w.key === "1a" ? "All applied together at substrate loading" : w.key === "1b" ? "After Rhizopus fuzz confirmed" : w.key === "2" ? "Measure temperature before applying" : "Titre <10⁴ CFU/g before S4"}
                  </div>
                </div>
                <div style={s.wlOrgs}>
                  {waveOrgs.map((o) => (
                    <div key={o.id} style={s.wlSlot(!!sel[o.id])} onClick={() => toggleOrg(o.id)}>{o.short}</div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── ORGANISM SECTIONS (WAVE-GROUPED) ── */}
      <div style={{ padding: "0 0 6px" }}>
        {WAVES.map((w) => {
          const waveOrgs = ORGS.filter((o) => o.wave === w.key);
          if (!waveOrgs.length) return null;
          const isClosed = closedSections[w.key];
          return (
            <div key={w.key} style={{ margin: "0 24px 6px" }}>
              <div style={s.orgSectionHdr(w.bg.replace(".08", ".05"), w.border)} onClick={() => toggleSection(w.key)}>
                <div style={s.oshWave(w.color, w.border, w.bg)}>{w.waveLabel}</div>
                <div style={s.oshTitle}>{w.label}</div>
                <div style={s.oshCount}>{waveOrgs.length} organisms</div>
                <div style={s.oshChevron(isClosed)}>▾</div>
              </div>
              {w.warn && (
                <div style={{ ...s.oshWarn(w.key === "cond" ? T.red : T.amber), background: "rgba(245,166,35,.07)", borderLeft: `1.5px solid ${w.border}`, borderRight: `1.5px solid ${w.border}` }}>{w.warn}</div>
              )}
              {w.sub && (
                <div style={{ ...s.oshSub(w.border) }}>{w.sub}</div>
              )}
              {!isClosed && (
                <div style={s.orgGrid}>
                  {waveOrgs.map((o) => {
                    const isSel = !!sel[o.id];
                    return (
                      <div key={o.id} style={s.orgBtn(isSel, !!o.warn && !isSel, !!o.cond)}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, width: "100%" }}>
                          <div style={s.obChk(isSel)} onClick={() => toggleOrg(o.id)}>{isSel ? "✓" : ""}</div>
                          <span style={s.obName(isSel)} onClick={() => toggleOrg(o.id)}>{o.name}</span>
                          <button style={s.obInfo} onClick={() => setModalId(o.id)}>Details</button>
                        </div>
                        <div style={s.obPills}>
                          {o.nine && <Pill c="#A78BFA" bdr="rgba(167,139,250,.5)" bg="rgba(167,139,250,.1)">9-Org Stack</Pill>}
                          {o.one && <Pill c={T.green} bdr="rgba(61,203,122,.5)" bg="rgba(61,203,122,.1)">One-Shot</Pill>}
                          {o.n > 0 && <Pill c="#4ADE80" bdr="rgba(74,222,128,.5)" bg="rgba(74,222,128,.1)">N Fixation +{o.n.toFixed(2)}%</Pill>}
                          {o.p > 0 && <Pill c="#F87171" bdr="rgba(248,113,113,.5)" bg="rgba(248,113,113,.1)">P Release +{o.p.toFixed(2)}%</Pill>}
                          {o.lig > 0 && <Pill c="#C084FC" bdr="rgba(192,132,252,.5)" bg="rgba(192,132,252,.1)">Lignin ADL -{o.lig}pt</Pill>}
                          {o.cp > 0 && <Pill c="#38BDF8" bdr="rgba(56,189,248,.5)" bg="rgba(56,189,248,.1)">Protein +{o.cp.toFixed(1)}%</Pill>}
                          {o.bsf && <Pill c={T.teal} bdr="rgba(64,215,197,.5)" bg="rgba(64,215,197,.1)">BSF Meal +{o.bsf}% CP</Pill>}
                          {o.cond && <Pill c={T.amber} bdr="rgba(245,166,35,.5)" bg="rgba(245,166,35,.1)">Conditional Use</Pill>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── BIO KPI CARDS ── */}
      <div style={{ padding: "20px 24px 8px" }}>
        <div style={{ ...s.sectionTitle, marginBottom: 12 }}>Biological Performance Indicators</div>
        <div style={s.kpiGrid}>
          <div style={s.kpiCard}><div style={s.kpiHdr}>Protocol Cost</div><div style={s.kpiVal()}>{computed.cnt ? `$${computed.cpt.toFixed(2)}` : "—"}</div><div style={s.kpiUnit}>$ / t FW</div></div>
          <div style={s.kpiCard}><div style={s.kpiHdr}>CMCase Peak</div><div style={s.kpiVal()}>{computed.cnt && computed.cmcase > 0 ? computed.cmcase : "—"}</div><div style={s.kpiUnit}>U / g DM · cellulase activity</div></div>
          <div style={s.kpiCard}><div style={s.kpiHdr}>NH₃ Retained</div><div style={s.kpiVal()}>{computed.cnt && computed.nh3 > 0 ? `+${computed.nh3}%` : "—"}</div><div style={s.kpiUnit}>% reduction vs unmanaged</div></div>
          <div style={s.kpiCard}><div style={s.kpiHdr}>Lignin Reduction</div><div style={s.kpiVal()}>—</div><div style={s.kpiUnit}>% of S0 baseline ADL</div></div>
          <div style={s.kpiCard}><div style={s.kpiHdr}>BSF Gate</div><div style={s.kpiVal(computed.cnt ? (computed.hasBt ? T.amber : T.green) : undefined)}>{!computed.cnt ? "—" : computed.hasBt ? "HOLD" : "PASS"}</div><div style={s.kpiUnit}>{!computed.cnt ? "select organisms to evaluate" : computed.hasBt ? "Bt titre must decay <10⁴ CFU/g before BSF load" : "No Bt conflict · clear for BSF introduction"}</div></div>
          <div style={s.kpiCard}><div style={s.kpiHdr}>Synthetic Value</div><div style={s.kpiVal()}>—</div><div style={s.kpiUnit}>$ / t FW · from S0 inputs</div></div>
          <div style={s.kpiCard}><div style={s.kpiHdr}>Organisms Deployed</div><div style={s.kpiVal()}>{computed.cnt}</div><div style={s.kpiUnit}>of 43 available</div></div>
          <div style={s.kpiCard}><div style={s.kpiHdr}>Biological Minimum</div><div style={s.kpiVal()}>—</div><div style={s.kpiUnit}>days · from S0 process config</div></div>
          <div style={s.kpiCard}><div style={s.kpiHdr}>Bt Titre</div><div style={s.kpiVal(computed.hasBt ? T.red : computed.cnt ? T.green : undefined)}>{computed.hasBt ? "ACTIVE" : computed.cnt ? "CLEAR" : "—"}</div><div style={s.kpiUnit}>{computed.hasBt ? "CFU/g · GATE HOLD — must decay before BSF" : computed.cnt ? "CFU/g · no Bt in protocol" : "CFU/g · conditional wave"}</div></div>
        </div>
      </div>

      {/* ── SPACER ── */}
      <div style={{ height: 80 }} />

      {/* ── PROTOCOL PANEL ── */}
      <div style={s.protoPanel(protoOpen)}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div style={s.sectionTitle}>Protocol + Projected Outcomes</div>
          <button onClick={() => setProtoOpen(false)} style={{ fontSize: 10, fontWeight: 700, fontFamily: F, color: T.grey, border: `1px solid ${T.border}`, borderRadius: 5, padding: "3px 10px", cursor: "pointer", background: "transparent", display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ color: T.red, fontSize: 12, fontWeight: 900 }}>✕</span> Close
          </button>
        </div>
        <div style={s.protoGrid}>
          <div>
            <table style={s.protoTable}>
              <thead><tr>{["Organism","Wave","$/kg","Dose %DM","kg/month","$/month"].map((h) => <th key={h} style={s.protoTh}>{h}</th>)}</tr></thead>
              <tbody>
                {ORGS.filter((o) => sel[o.id] && o.dose > 0).map((o) => {
                  const mo = Math.round(o.cost * o.dose * 8157 / 100);
                  const kg = Math.round(o.dose / 100 * 8157);
                  const wc = o.wave === "1a" ? T.teal : o.wave === "1b" ? T.red : T.blue;
                  return (
                    <tr key={o.id}>
                      <td style={{ ...s.protoTd, fontFamily: F, color: T.amber }}>{o.short}</td>
                      <td style={s.protoTd}><span style={{ fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 8, color: wc, border: `1px solid ${wc}33` }}>Wave {o.wave.toUpperCase()}</span></td>
                      <td style={{ ...s.protoTd, fontFamily: F }}>${o.cost.toFixed(2)}</td>
                      <td style={{ ...s.protoTd, fontFamily: F }}>{o.dose.toFixed(2)}%</td>
                      <td style={{ ...s.protoTd, fontFamily: F }}>{kg} kg</td>
                      <td style={{ ...s.protoTd, fontFamily: F, color: T.green }}>${mo.toLocaleString()}</td>
                    </tr>
                  );
                })}
                {computed.cnt > 0 && (
                  <tr><td colSpan={5} style={{ ...s.protoTd, textAlign: "right", color: T.grey, fontWeight: 700, borderTop: `2px solid ${T.border}` }}>Total</td><td style={{ ...s.protoTd, fontFamily: F, color: T.green, fontSize: 13, fontWeight: 700, borderTop: `2px solid ${T.border}` }}>${Math.round(computed.cost).toLocaleString()}/mo</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div style={s.outflowCard}>
            <div style={s.ocTitle}>Projected Outflows — Day 14</div>
            {[["Crude Protein","—"],["Lignin ADL","—"],["N % DM","—"],["P % DM","—"],["K % DM","1.90%"]].map(([lbl, val], i) => (
              <div key={i} style={s.ocRow}><span style={s.ocLbl}>{lbl}</span><span style={s.ocVal}>{val}</span></div>
            ))}
            <div style={s.ocTotal}>
              <div style={s.ocTotalVal}>—</div>
              <div style={{ fontSize: 9, color: T.grey, marginTop: 2 }}>Connect S0 for value</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── RESULTS BAR ── */}
      <div style={s.resultsBar}>
        <div style={s.rbItem}><div style={s.rbLbl}>Organisms</div><div style={s.rbVal(T.teal)}>{computed.cnt}</div></div>
        <div style={s.rbDivider} />
        <div style={s.rbItem}><div style={s.rbLbl}>Cost</div><div style={s.rbVal(T.amber)}>{computed.cnt ? `$${computed.cpt.toFixed(2)}/t` : "—"}</div></div>
        <div style={s.rbDivider} />
        <div style={s.rbItem}><div style={s.rbLbl}>Monthly OpEx</div><div style={s.rbVal(T.amber)}>{computed.cnt ? `$${Math.round(computed.cpt * 7200).toLocaleString()}/mo` : "—"}</div></div>
        <div style={s.rbDivider} />
        <div style={s.rbItem}><div style={s.rbLbl}>N uplift</div><div style={s.rbVal(T.green)}>{computed.cnt && computed.allN > 0 ? `+${computed.allN.toFixed(2)}% N` : "—"}</div></div>
        <div style={s.rbDivider} />
        <div style={s.rbItem}><div style={s.rbLbl}>Lignin</div><div style={s.rbVal(T.green)}>25.0%</div></div>
        <div style={s.rbDivider} />
        <div style={s.rbItem}><div style={s.rbLbl}>Synthetic Value</div><div style={s.rbVal(T.green)}>—</div></div>
        <button style={s.rbBtn(computed.cnt === 0)} onClick={() => computed.cnt > 0 && setProtoOpen(!protoOpen)} disabled={computed.cnt === 0}>
          {protoOpen ? "Close Outcomes ▲" : "View Protocol + Outcomes"}
        </button>
      </div>

      {/* ── MODAL ── */}
      {modalOrg && (
        <div style={s.modalBg} onClick={(e) => { if (e.target === e.currentTarget) setModalId(null); }}>
          <div style={s.modal}>
            <div style={s.modalHdr}>
              <div>
                <div style={s.modalName}>{modalOrg.name}</div>
                {modalOrg.icbb && modalOrg.icbb !== "—" && <div style={s.modalIcbb}>{modalOrg.icbb} · IPB-verified</div>}
              </div>
              <button style={s.modalClose} onClick={() => setModalId(null)}>
                <span style={{ color: T.red, fontSize: 13, fontWeight: 900 }}>✕</span> Close
              </button>
            </div>
            <div style={s.modalBody}>
              <div style={s.modalSection}>
                <div style={s.msTag}>SOURCE</div>
                <div style={s.msTitle}>{modalOrg.name}</div>
                <div style={s.msSource}>{modalOrg.src}</div>
                {modalOrg.warn && (
                  <div style={modalOrg.cond || modalOrg.warn.includes("HARD") || modalOrg.warn.includes("LETHAL") ? s.errBanner : s.warnBanner}>{modalOrg.warn}</div>
                )}
              </div>
              <div style={s.modalSection}><div style={s.msTag}>WHAT IT DOES</div><div style={s.msBody}>{modalOrg.what}</div></div>
              <div style={s.modalSection}><div style={s.msTag}>HOW IT WORKS</div><div style={s.msBody}>{modalOrg.how}</div></div>
              {modalOrg.outcomes?.length > 0 && (
                <div style={s.modalSection}>
                  <div style={s.msTag}>PROJECTED OUTCOMES</div>
                  {modalOrg.outcomes.map(([lbl, val], i) => (
                    <div key={i} style={{ ...s.outcomeRow, ...(i === modalOrg.outcomes.length - 1 ? { borderBottom: "none" } : {}) }}>
                      <span style={s.orLbl}>{lbl}</span><span style={s.orVal}>{val}</span>
                    </div>
                  ))}
                </div>
              )}
              <div style={{ ...s.modalSection, borderBottom: "none" }}><div style={s.msTag}>TIMING</div><div style={s.codeLine}>{modalOrg.timing}</div></div>
            </div>
            <div style={s.modalFtr}>
              <div style={s.mfCost}>
                <strong style={{ fontFamily: F, fontWeight: 700, color: T.amber }}>
                  {modalOrg.cost > 0 ? `$${modalOrg.cost.toFixed(2)}/kg · ${modalOrg.dose}% DM · est. $${Math.round(modalOrg.cost * modalOrg.dose * 8157 / 100).toLocaleString()}/month` : "$0 ongoing OpEx"}
                </strong>
              </div>
              <button style={s.mfBtn(!!sel[modalOrg.id])} onClick={() => toggleOrg(modalOrg.id)}>
                {sel[modalOrg.id] ? "- Remove from Consortium" : "+ Add to Consortium"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
