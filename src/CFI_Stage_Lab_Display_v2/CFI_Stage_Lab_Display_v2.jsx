import { useState } from "react";

// ── EXACT FORMAT from EFB Lab Analysis tab ─────────────────────────────────
// Each stage has: title, subtitle, sections (with section headers + rows)
// Each row: [parameter, typicalValue, range, unit, method, reference]
// Section header rows have only the first cell filled → rendered as full-width divider

// ── S0 ROW FORMAT: [param, efb, opdc, pome, unit, method, reference] ─────────
// Section headers: { section: "..." }  (same as single-stream stages)
// threeStream: true triggers separate column rendering

const S0_ROWS = [
  { section: "PHYSICAL PROPERTIES" },
  ["Moisture Content",       "62.5%",       "70%",         "82% wb",        "% wb",    "Gravimetric 105°C",  "AOAC 930.15 — canonical CFI values"],
  ["Bulk Density",           "100–150",      "450–600",     "850–1050",      "kg/m³",   "Direct measurement", "Field data"],
  ["Particle Size",          "200–300 mm",   "5–10 mm",     "Liquid/slurry", "mm",      "Sieve / visual",     "Mill discharge observation"],
  ["pH (as received)",       "6.8–7.2",      "4.5–5.5",     "4.0–5.5",       "pH",      "pH meter, direct",   "Literature + CFI-LAB-POME-001"],
  ["Delivery state",         "Whole bunches","Wet cake/slurry","Sludge/liquid","—",      "Visual inspection",  "Mill discharge"],

  { section: "PROXIMATE ANALYSIS (% DM BASIS)" },
  ["Ash Content",            "5.0%",         "16.5%",       "28.0% ★",       "% DM",    "AOAC 942.05",        "Canonical CFI — POME ash verified Mar 2026"],
  ["Crude Protein (N×6.25)", "4.75%",        "14.5%",       "11.0%",         "% DM",    "AOAC 984.13",        "Canonical CFI confirmed values"],
  ["Ether Extract (Fat)",    "3.5–5.0%",     "25–35%",      "10.0%",         "% DM",    "AOAC 920.39 Soxhlet","POME: Feedipedia 29.2% REJECTED — mismatch"],
  ["NFE (by difference)",    "~28%",         "~12%",        "~41%",          "% DM",    "Calculation",        "100 − Ash − CP − EE − Lignin − Cellulose"],
  ["Organic Matter",         "95%",          "83.5%",       "72.0%",         "% DM",    "Calculated",         "100 − Ash"],

  { section: "FIBRE FRACTIONS — VAN SOEST (% DM)" },
  ["NDF (Total Cell Wall)",  "82%",          "58%",         "28.2%",         "% DM",    "AOAC 2002.04",       "Van Soest — canonical"],
  ["ADF (Lignin + Cellulose)","62.8%",       "52%",         "22.1%",         "% DM",    "AOAC 973.18",        "Van Soest — canonical"],
  ["ADL (Lignin)",           "22.0% ★",      "30.7% ★",     "7.6%",          "% DM",    "72% H₂SO₄",          "Canonical — KEY limiting parameter"],
  ["Cellulose (ADF−ADL)",    "40.8%",        "21.3%",       "14.5%",         "% DM",    "By difference",      "Physically locked behind lignin at S0"],
  ["Hemicellulose (NDF−ADF)","19.2%",        "6.0%",        "6.1%",          "% DM",    "By difference",      "NDF − ADF"],

  { section: "ELEMENTAL / NUTRIENT ANALYSIS (% DM)" },
  ["Carbon (C)",             "~45.6%",       "~46.4%",      "DATA GAP ⚠",    "% DM",    "CHNS Analyser",      "Estimated from C:N. C:N gap = blocking for POME"],
  ["Nitrogen (N)",           "0.76%",        "2.32%",       "1.76%",         "% DM",    "CHNS/Kjeldahl",      "CP÷6.25 verified. POME canonical Mar 2026"],
  ["C:N Ratio",              "60",           "20",          "DATA GAP ⚠",    "Ratio",   "Calculated C÷N",     "POME C:N = confirmed data gap — see guardrail"],
  ["Phosphorus (P)",         "0.06%",        "0.40%",       "0.40–0.80%",    "% DM",    "ICP-OES",            "POME range — Fe drives inclusion limit"],
  ["Potassium (K)",          "2.0%",         "0.55%",       "0.70%",         "% DM",    "ICP-OES",            "EFB high K — primary product value driver"],
  ["Calcium (Ca)",           "0.30%",        "0.40%",       "0.35%",         "% DM",    "ICP-OES",            "Literature"],
  ["Magnesium (Mg)",         "0.18%",        "0.25%",       "0.20%",         "% DM",    "ICP-OES",            "Literature"],

  { section: "HEAVY METALS — KEY CONCERNS (mg/kg DM)" },
  ["Iron (Fe)",              "200–800",      "500–1500",    "3,000–8,000 ★", "mg/kg DM","ICP-OES Package A",  "⚠ POME Fe drives inclusion rate. CFI-LAB-POME-001"],
  ["Manganese (Mn)",         "50–200",       "100–300",     "100–475",       "mg/kg DM","ICP-OES Package A",  "No current legal limit — monitor trend"],
  ["Zinc (Zn)",              "10–50",        "30–80",       "20–60",         "mg/kg DM","ICP-OES Package A",  "Sub-threshold"],
  ["Copper (Cu)",            "5–20",         "10–30",       "8–25",          "mg/kg DM","ICP-OES Package A",  "Sub-threshold"],

  { section: "BSF SUITABILITY ASSESSMENT (S0 — RAW STATE)" },
  ["BSF suitability",        "NOT READY ✗",  "NOT READY ✗", "NOT READY ✗",   "Gate",    "Multi-param check",  "All 3 streams require S1+S2 pre-processing"],
  ["Lignin barrier",         "CRITICAL ✗",   "CRITICAL ✗",  "Low (pass)",    "Gate",    "ADL %",              "EFB/OPDC require PKSA delignification at S2"],
  ["Moisture gate",          "High — press", "High — press","High — dewater","Gate",    "% wb",               "S1 pressing/dewatering required before biology"],
  ["Protein (CP%)",          "FAIL <5%",     "PASS 14.5%",  "MARGINAL 11%",  "Gate",    "CP % DM",            "EFB needs OPDC protein supplement to reach ≥8%"],
  ["pH gate",                "PASS ~7.0",    "PASS ~5.0",   "FAIL — acidic", "Gate",    "pH",                 "POME pH 4–5.5 corrected by S2 PKSA neutralisation"],
];

const STAGES = [
  {
    id: "s0",
    label: "Stage 0",
    product: "RAW FEEDSTOCK",
    productColor: "#3a2000",
    tagline: "As-Received at Mill Gate — Three Independent Streams",
    title: "S0 — RAW FEEDSTOCK BASELINE: EFB · OPDC/DC · POME SLUDGE",
    subtitle: "CFI Bioconversion Stage 0 | 60 TPH FFB Mill — Bogor, West Java | March 2026",
    threeStream: true,
    streams: ["EFB", "OPDC / DC", "POME Sludge"],
    streamColors: ["#1a5530", "#1a3560", "#5a2070"],
    rows: S0_ROWS,
    value: {
      totalDM: "—",
      totalWet: "—",
      wetBasis: "Not a sellable product",
      isBaseline: true,
      streams: [
        {
          name: "EFB",
          color: "#1a5530",
          mc: 62.5,
          daily_wet: 331,
          // kg/t WET at 62.5% MC (× 0.375 DM fraction)
          nutrients: [
            { name: "Nitrogen (N)",   kgPerTWet: 2.85, kgPerTDM: 7.60,  note: "N 0.76% DM × 37.5% DM" },
            { name: "Phosphorus (P)", kgPerTWet: 0.23, kgPerTDM: 0.60,  note: "P 0.06% DM × 37.5% DM" },
            { name: "Potassium (K)",  kgPerTWet: 7.50, kgPerTDM: 20.00, note: "K 2.0% DM × 37.5% DM" },
            { name: "Calcium (Ca)",   kgPerTWet: 1.13, kgPerTDM: 3.00,  note: "Ca 0.30% DM × 37.5% DM" },
            { name: "Magnesium (Mg)", kgPerTWet: 0.68, kgPerTDM: 1.80,  note: "Mg 0.18% DM × 37.5% DM" },
          ],
        },
        {
          name: "OPDC / DC",
          color: "#1a3560",
          mc: 70.0,
          daily_wet: 50,
          // kg/t WET at 70% MC (× 0.30 DM fraction)
          nutrients: [
            { name: "Nitrogen (N)",   kgPerTWet: 6.96, kgPerTDM: 23.20, note: "N 2.32% DM × 30% DM" },
            { name: "Phosphorus (P)", kgPerTWet: 1.20, kgPerTDM: 4.00,  note: "P 0.40% DM × 30% DM" },
            { name: "Potassium (K)",  kgPerTWet: 1.65, kgPerTDM: 5.50,  note: "K 0.55% DM × 30% DM" },
            { name: "Calcium (Ca)",   kgPerTWet: 1.20, kgPerTDM: 4.00,  note: "Ca 0.40% DM × 30% DM" },
            { name: "Magnesium (Mg)", kgPerTWet: 0.75, kgPerTDM: 2.50,  note: "Mg 0.25% DM × 30% DM" },
          ],
        },
        {
          name: "POME Sludge",
          color: "#5a2070",
          mc: 82.0,
          daily_wet: 30,
          // kg/t WET at 82% MC (× 0.18 DM fraction)
          nutrients: [
            { name: "Nitrogen (N)",   kgPerTWet: 3.17, kgPerTDM: 17.60, note: "N 1.76% DM × 18% DM — canonical" },
            { name: "Phosphorus (P)", kgPerTWet: 1.08, kgPerTDM: 6.00,  note: "P 0.60% DM typical × 18% DM" },
            { name: "Potassium (K)",  kgPerTWet: 1.26, kgPerTDM: 7.00,  note: "K 0.70% DM × 18% DM" },
            { name: "Calcium (Ca)",   kgPerTWet: 0.63, kgPerTDM: 3.50,  note: "Ca 0.35% DM × 18% DM" },
            { name: "Magnesium (Mg)", kgPerTWet: 0.36, kgPerTDM: 2.00,  note: "Mg 0.20% DM × 18% DM" },
          ],
        },
      ],
      badges: [
        { label: "EFB MC",       val: "62.5% wb",      color: "#1a5530" },
        { label: "OPDC MC",      val: "70% wb",        color: "#1a3560" },
        { label: "POME MC",      val: "82% wb",        color: "#5a2070" },
        { label: "EFB Lignin",   val: "22% DM ★",      color: "#7a0000" },
        { label: "OPDC Lignin",  val: "30.7% DM ★",    color: "#7a0000" },
        { label: "POME Fe",      val: "3–8k mg/kg ⚠", color: "#b05000" },
        { label: "C:N gap",      val: "POME = DATA GAP",color: "#888888" },
      ],
      note: "S0 = process entry point. No sellable product. Values shown are baseline inputs for mass balance and nutrient ledger.",
      // Soil × AG Management value matrix — sourced from CFI_Soil_Calculator_v3.jsx
      // $/t DM finished product. Computed as: nVal + pFixAdvantage[tier].pVal + kVal
      soilMatrix: [
        { id:"inceptisol", name:"Inceptisols",    pct:"39%", color:"#14b8a6", primary:true,
          tiers:{ VGAM:195, Normal:243, Poor:326 },
          pMult:{ VGAM:2.20, Normal:3.06, Poor:4.58 },
          nLoss:"35%", pitch:"P + mycorrhizal inoculant story" },
        { id:"ultisol",    name:"Ultisols (PMK)", pct:"24%", color:"#f59e0b", primary:true,
          tiers:{ VGAM:243, Normal:293, Poor:470 },
          pMult:{ VGAM:2.75, Normal:3.67, Poor:6.88 },
          nLoss:"50%", pitch:"★ PRIMARY — P fixation bypass" },
        { id:"oxisol",     name:"Oxisols",        pct:"8%",  color:"#f97316", primary:true,
          tiers:{ VGAM:312, Normal:413, Poor:488 },
          pMult:{ VGAM:3.67, Normal:5.50, Poor:6.88 },
          nLoss:"60%", pitch:"★ HIGHEST VALUE — goethite P" },
        { id:"histosol",   name:"Histosols (Peat)","pct":"7%", color:"#a855f7", primary:false,
          tiers:{ VGAM:192, Normal:226, Poor:274 },
          pMult:{ VGAM:1.57, Normal:2.20, Poor:3.06 },
          nLoss:"58%", pitch:"Lead with K + Cu, not P" },
        { id:"spodosol",   name:"Spodosols",      pct:"<5%", color:"#64748b", primary:false,
          tiers:{ VGAM:249, Normal:292, Poor:343 },
          pMult:{ VGAM:1.96, Normal:2.75, Poor:3.67 },
          nLoss:"70%", pitch:"CEC rebuild 5-yr story" },
      ],
    },
  },
  {
    id: "s2",
    label: "Stage 2",
    product: "COMPOST+",
    productColor: "#1a3560",
    tagline: "Post-Chemical Treatment (PKSA)",
    title: "COMPOST+ — POST-CHEMICAL TREATMENT OUTPUT",
    subtitle: "CFI Bioconversion Stage 2 | PKSA Alkaline Pre-Treatment | Date: 2026",
    rows: [
      { section: "PHYSICAL PROPERTIES" },
      ["Moisture (output)", "58–65%", "55–68%", "% wb", "Gravimetric 105°C", "AOAC 930.15"],
      ["Bulk density", "220–280", "200–320", "kg/m³", "Direct measurement", "Field data"],
      ["Particle size", "2 mm", "1.5–3.0", "mm", "Sieve analysis", "CFI Protocol"],
      ["pH (after neutralisation)", "6.5–8.0", "6.5–8.5", "pH", "pH meter", "CFI Stage 2 spec"],
      { section: "PROXIMATE ANALYSIS (% DM)" },
      ["Ash", "9.6%", "8–12%", "% DM", "AOAC 942.05", "Standard method"],
      ["Crude Protein (N×6.25)", "10.6%", "9–13%", "% DM", "AOAC 984.13", "N×6.25"],
      ["Crude Fat", "5.9%", "5–8%", "% DM", "AOAC 920.39", "Soxhlet"],
      ["Crude Fiber", "52–58%", "48–62%", "% DM", "AOAC 962.09", "Reduced post-treatment"],
      ["NFE", "17–22%", "14–26%", "% DM", "Calculation", "By difference"],
      { section: "FIBER FRACTIONS (% DM)" },
      ["NDF", "70–76%", "65–80%", "% DM", "AOAC 2002.04", "Van Soest"],
      ["ADF", "48–55%", "44–60%", "% DM", "AOAC 973.18", "Van Soest"],
      ["ADL (Lignin)", "16.6–17.8%", "15–20%", "% DM", "72% H₂SO₄", "PKSA reduced 30–35%"],
      ["Cellulose (accessible)", "35–38%", "32–42%", "% DM", "By difference", "ADF−ADL ↑ after PKSA"],
      ["Hemicellulose", "19–22%", "16–26%", "% DM", "By difference", "NDF−ADF"],
      { section: "ELEMENTAL ANALYSIS (% DM)" },
      ["Carbon (C)", "44–46%", "42–48%", "% DM", "CHNS Analyser", "Standard"],
      ["Nitrogen (N)", "1.60–1.80%", "1.4–2.0%", "% DM", "CHNS/Kjeldahl", "N analysis"],
      ["Potassium (K)", "0.78–0.82%", "0.70–0.95%", "% DM", "ICP-OES", "PKSA contribution"],
      ["Phosphorus (P)", "0.12%", "0.10–0.15%", "% DM", "ICP-OES", "Standard"],
      ["Calcium (Ca)", "0.12%", "0.09–0.16%", "% DM", "ICP-OES", "Standard"],
      ["Magnesium (Mg)", "0.10%", "0.08–0.14%", "% DM", "ICP-OES", "Standard"],
      ["C:N Ratio", "22–28", "20–32", "Ratio", "Calculated", "Improved from 32 (input)"],
      { section: "BIOLOGICAL ACTIVITY" },
      ["Cellulase activity", "5–12 U/g", "4–14 U/g", "U/g", "DNS assay", "Lignin barrier removed"],
      ["Microbial biomass C", "+30–50% vs raw", "—", "Relative", "Fumigation extraction", "Recovery post-alkali"],
      ["pH buffer capacity", "Moderate", "—", "Qualitative", "Titration", "PKSA carbonate residue"],
      { section: "BSF READINESS" },
      ["BSF suitability post-S2", "3/5", "FAIR", "Score", "Assessment", "Ready for inoculation"],
      ["Lignin barrier status", "REDUCED", "30–35% less", "Qualitative", "ADL method", "Zhu et al 2010"],
      ["pH suitability for BSF", "PASS", "6.5–8.0 ✓", "Gate check", "pH meter", "BSF gate requirement"],
    ],
    value: {
      totalDM: 48.92,
      totalWet: 17.12,
      wetBasis: "65% moisture",
      nutrients: [
        { name: "Nitrogen (N)", pct: "1.70%", kgPerT: 17.0, price: "$0.761/kg N", val: 12.94 },
        { name: "Phosphorus (P)", pct: "0.12%", kgPerT: 1.2, price: "$2.740/kg P", val: 3.29 },
        { name: "Potassium (K)", pct: "0.80%", kgPerT: 8.0, price: "$0.553/kg K", val: 4.42 },
        { name: "Calcium (Ca)", pct: "0.12%", kgPerT: 1.2, price: "$0.204/kg Ca", val: 0.24 },
        { name: "Magnesium (Mg)", pct: "0.10%", kgPerT: 1.0, price: "$1.029/kg Mg", val: 1.03 },
        { name: "Organic Matter (90%)", pct: "900 kg/t", kgPerT: 900, price: "$0.030/kg OM", val: 27.00 },
      ],
      badges: [
        { label: "Cellulase", val: "5–12 U/g", color: "#1a3560" },
        { label: "Lignin reduced", val: "−30–35%", color: "#1a5530" },
        { label: "pH", val: "6.5–8.0", color: "#7a5500" },
        { label: "C:N", val: "22–28", color: "#1a3560" },
      ],
      note: "Value basis: Indonesian market prices March 2026. PKSA cost $0.00 (mill waste).",
    },
  },
  {
    id: "s3",
    label: "Stage 3",
    product: "BIO-COMPOST+",
    productColor: "#1a5530",
    tagline: "Post-Biological Treatment (Consortium Inoculation)",
    title: "BIO-COMPOST+ — POST-BIOLOGICAL TREATMENT OUTPUT",
    subtitle: "CFI Bioconversion Stage 3 | Two-Wave Microbial Inoculation (27-Organism Consortium) | Date: 2026",
    rows: [
      { section: "PHYSICAL PROPERTIES" },
      ["Moisture (output)", "45–60%", "40–65%", "% wb", "Gravimetric 105°C", "AOAC 930.15"],
      ["Bulk density (matured)", "380–480", "350–550", "kg/m³", "Direct measurement", "Post-5d biological"],
      ["Particle structure", "Aggregated", "Crumb-like", "Qualitative", "Visual/sieve", "Fungal hyphae binding"],
      ["pH (final)", "6.5–7.5", "6.0–8.0", "pH", "pH meter", "Wave 2 neutralisation"],
      { section: "PROXIMATE ANALYSIS (% DM)" },
      ["Ash", "10–12%", "9–14%", "% DM", "AOAC 942.05", "Slight increase by ash from respiration"],
      ["Crude Protein (N×6.25)", "12.5–13.8%", "11–16%", "% DM", "AOAC 984.13", "Microbial biomass protein"],
      ["Crude Fat", "5–7%", "4–8%", "% DM", "AOAC 920.39", "Soxhlet"],
      ["Humic Acid content", "8–15%", "6–18%", "% DM", "Humic acid extraction", "Thermophilic formation"],
      ["Fulvic Acid content", "5–10%", "4–12%", "% DM", "Fulvic extraction", "Labile humic fraction"],
      { section: "FIBER FRACTIONS (% DM)" },
      ["NDF", "60–68%", "55–72%", "% DM", "AOAC 2002.04", "Reduced vs S2 by microbial digestion"],
      ["ADF", "40–48%", "36–52%", "% DM", "AOAC 973.18", "Van Soest"],
      ["ADL (Lignin)", "14–16%", "12–18%", "% DM", "72% H₂SO₄", "Further microbial reduction"],
      ["Cellulose (accessible)", "36–40%", "32–44%", "% DM", "ADF−ADL", "Peak accessibility"],
      ["Hemicellulose", "18–22%", "14–26%", "% DM", "NDF−ADF", "Xylanase digestion ongoing"],
      { section: "ELEMENTAL ANALYSIS (% DM)" },
      ["Carbon (C)", "42–45%", "40–47%", "% DM", "CHNS Analyser", "Slight decrease — CO₂ respiration"],
      ["Nitrogen (N)", "1.80–2.20%", "1.6–2.5%", "% DM", "CHNS/Kjeldahl", "N mineralisation ↑"],
      ["Potassium (K)", "0.80–0.90%", "0.75–1.00%", "% DM", "ICP-OES", "Maintained + PKSA"],
      ["Phosphorus (P)", "0.13–0.18%", "0.12–0.22%", "% DM", "ICP-OES", "P-solubilising bacteria"],
      ["Calcium (Ca)", "0.13%", "0.10–0.17%", "% DM", "ICP-OES", "Maintained"],
      ["Magnesium (Mg)", "0.10%", "0.08–0.14%", "% DM", "ICP-OES", "Maintained"],
      ["C:N Ratio", "18–25", "16–28", "Ratio", "Calculated", "Optimal — improved from 22–28"],
      { section: "BIOLOGICAL ACTIVITY ★ PEAK STAGE" },
      ["Cellulase (CMCase/FPase)", "20–35 U/g ★", "18–40 U/g", "U/g", "DNS / FPase assay", "Plant & Soil Dec 2025"],
      ["Xylanase activity", "12–22 U/g", "10–26 U/g", "U/g", "DNS xylan assay", "PLOS ONE Aug 2025"],
      ["Urease activity", "+150–200%", "vs baseline", "Relative %", "Colorimetric", "Kibblewhite et al 2008"],
      ["Phosphatase activity", "+120–180%", "vs baseline", "Relative %", "p-Nitrophenol method", "Kibblewhite et al 2008"],
      ["N-fixing bacteria (Azotobacter)", "10⁷–10⁸ CFU/g", "10⁶–10⁹", "CFU/g", "Plate count", "Frontiers Microbiology 2026"],
      ["PSB (P-solubilising)", "10⁶–10⁷ CFU/g", "10⁵–10⁸", "CFU/g", "Pikovskaya agar", "Frontiers Plant Science 2025"],
      ["Cellulase persistence (soil)", "3–6 months", "2–8 months", "Months", "Soil enzyme assay", "ScienceDirect 2024"],
      { section: "BSF / COMPOST CERTIFICATION FLAGS" },
      ["Compost maturity (GI test)", ">80% germination", "—", "% GI", "Germination index", "CCQC 2001"],
      ["Salmonella", "Not detected", "ND", "per 25g", "ISO 6579", "Certification req."],
      ["E. coli", "< 1000 MPN/g", "—", "MPN/g", "ISO 9308", "EU compost standard"],
      ["Pathogen suppression", "Confirmed", "—", "Qualitative", "Bioassay", "Trichoderma activity"],
    ],
    value: {
      totalDM: 71.43,
      totalWet: 32.14,
      wetBasis: "55% moisture",
      nutrients: [
        { name: "Nitrogen (N)", pct: "2.00%", kgPerT: 20.0, price: "$0.761/kg N", val: 15.22 },
        { name: "Phosphorus (P)", pct: "0.15%", kgPerT: 1.5, price: "$2.740/kg P", val: 4.11 },
        { name: "Potassium (K)", pct: "0.85%", kgPerT: 8.5, price: "$0.553/kg K", val: 4.70 },
        { name: "Calcium (Ca)", pct: "0.13%", kgPerT: 1.3, price: "$0.204/kg Ca", val: 0.27 },
        { name: "Magnesium (Mg)", pct: "0.10%", kgPerT: 1.0, price: "$1.029/kg Mg", val: 1.03 },
        { name: "Organic Matter (87%)", pct: "870 kg/t", kgPerT: 870, price: "$0.030/kg OM", val: 26.10 },
        { name: "Biological Activity Premium", pct: "—", kgPerT: "—", price: "Active consortium", val: 20.00 },
      ],
      badges: [
        { label: "Cellulase ★ PEAK", val: "20–35 U/g", color: "#c47d00" },
        { label: "Xylanase", val: "12–22 U/g", color: "#1a5530" },
        { label: "N-fixers", val: "10⁸ CFU/g", color: "#1a3560" },
        { label: "C:N", val: "18–25", color: "#1a5530" },
      ],
      note: "Biological activity premium $20/t estimated conservatively. Certification unlocks further uplift.",
    },
  },
  // ── S3 WAVE 2 — delta-column format ───────────────────────────────────────
  {
    id: "s3w2",
    label: "Stage 3 W2",
    product: "BIO-COMPOST+ W2",
    productColor: "#0d4020",
    tagline: "Wave 2 — N-Fixers + PSB Activated · Mesophilic Phase",
    title: "BIO-COMPOST+ W2 — WAVE 2 MICROBIAL INOCULATION",
    subtitle: "CFI Bioconversion Stage 3 Wave 2 | N-Fixing + P-Solubilising Bacteria Activation | Date: 2026",
    deltaStage: true,
    rows: [
      { section: "PHYSICAL PROPERTIES" },
      ["Moisture",               "% wb",    "45–60%",     "40–55%",      "↓",  "Gravimetric 105°C",        "Evaporation during mesophilic phase"],
      ["Temperature",            "°C",      "45–55°C",    "35–45°C",     "↓",  "Thermometer probe",        "Thermophilic → mesophilic transition"],
      ["pH",                     "pH",      "6.5–7.5",    "6.8–7.5",     "→",  "pH meter",                 "Stable — N-fixer optimum range"],
      ["Bulk density",           "kg/m³",   "380–480",    "400–520",     "↑",  "Direct measurement",       "Compaction + humification"],
      { section: "PROXIMATE ANALYSIS (% DM)" },
      ["Crude Protein (N×6.25)", "% DM",    "12.5–13.8%", "14.0–16.0%",  "↑",  "AOAC 984.13",              "N fixation adds to protein pool"],
      ["Ash",                    "% DM",    "10–12%",     "11–14%",      "↑",  "AOAC 942.05",              "OM respiration concentrates mineral fraction"],
      ["Crude Fat",              "% DM",    "5–7%",       "4–6%",        "↓",  "AOAC 920.39",              "Slight lipid catabolism by mesophiles"],
      ["Humic Acid",             "% DM",    "8–15%",      "12–20%",      "↑",  "Humic acid extraction",    "Humification accelerates — mesophilic ligninase"],
      ["Fulvic Acid",            "% DM",    "5–10%",      "8–14%",       "↑",  "Fulvic extraction",        "Labile fraction — highest bioavailability"],
      { section: "FIBRE FRACTIONS (% DM)" },
      ["ADL (Lignin)",           "% DM",    "14–16%",     "11–14%",      "↓",  "72% H\u2082SO\u2084",    "Mesophilic white-rot fungi continue delignification"],
      ["NDF",                    "% DM",    "60–68%",     "55–65%",      "↓",  "AOAC 2002.04",             "Continued microbial digestion"],
      ["ADF",                    "% DM",    "40–48%",     "36–44%",      "↓",  "AOAC 973.18",              "Van Soest — further reduction"],
      ["Cellulose accessible",   "% DM",    "36–40%",     "35–40%",      "→",  "ADF−ADL",                  "Stable — BSF-ready structural carbohydrate"],
      { section: "ELEMENTAL ANALYSIS (% DM)" },
      ["Nitrogen (N)",           "% DM",    "1.80–2.20%", "2.20–2.50% ★","↑",  "CHNS/Kjeldahl",            "★ N fixation — Azotobacter/Azospirillum active"],
      ["C:N Ratio",              "Ratio",   "18–25",      "14–20",       "↓",  "Calculated",               "Approaching BSF optimal window"],
      ["Phosphorus (P)",         "% DM",    "0.13–0.18%", "0.18–0.26% ★","↑",  "ICP-OES",                  "★ PSB peak — Bacillus megaterium + A. niger"],
      ["Potassium (K)",          "% DM",    "0.80–0.90%", "0.82–0.95%",  "→",  "ICP-OES",                  "PKSA K maintained"],
      ["Calcium (Ca)",           "% DM",    "0.13%",      "0.13–0.16%",  "→",  "ICP-OES",                  "Stable"],
      ["Magnesium (Mg)",         "% DM",    "0.10%",      "0.10–0.13%",  "→",  "ICP-OES",                  "Stable"],
      { section: "BIOLOGICAL ACTIVITY — WAVE 2 PEAK ★" },
      ["N-fixing bacteria",      "CFU/g",   "10\u2077–10\u2078","10\u2078–10\u2079 ★","↑","Plate count","★ PEAK — temp gate <50°C triggered Wave 2"],
      ["PSB (B. megaterium)",    "CFU/g",   "10\u2076–10\u2077","10\u2077–10\u2078 ★","↑","Pikovskaya agar","★ PEAK — acidic exudates dissolving Ca-P bonds"],
      ["Cellulase (CMCase)",     "U/g",     "20–35 ★",    "12–22",       "↓",  "DNS assay",                "Declining — thermophilic phase passed. W1 was peak."],
      ["Phosphatase activity",   "Relative","+120–180%",  "+200–280% ★", "↑",  "p-Nitrophenol",            "★ PEAK phosphatase — PSB-driven"],
      ["Trichoderma",            "CFU/g",   "10\u2075–10\u2076","10\u2076–10\u2077","↑","Selective agar","Building — persists to soil application"],
      { section: "BSF READINESS GATE" },
      ["CP gate (≥8%)",          "Gate",    "PASS ✓ 12.5%","PASS ✓ 14–16%","↑", "AOAC 984.13",             "Above 8% biological floor"],
      ["Temperature gate",       "Gate",    "COOLING",    "≤30°C target ✓","↓", "Thermometer",             "BSF inoculation gate: temp must reach ≤30°C"],
      ["C:N gate",               "Ratio",   "18–25",      "14–20 ✓",     "↓",  "Calculated",               "Optimal BSF range (15–25) reached"],
      ["Lignin gate",            "% DM",    "14–16%",     "11–14% ✓",    "↓",  "ADL 72%H\u2082SO\u2084", "Below 18% — BSF capable of penetration"],
      ["Overall BSF gate",       "Gate",    "READY ✓",    "INOCULATE ★", "→",  "Multi-param",              "All gates passed. Optimal W2 inoculation window."],
    ],
    value: {
      totalDM: 78.50,
      totalWet: 35.33,
      wetBasis: "55% moisture",
      nutrients: [
        { name: "Nitrogen (N)",        pct: "2.35%",   kgPerT: 23.5, price: "$0.761/kg N", val: 17.88 },
        { name: "Phosphorus (P)",       pct: "0.22%",   kgPerT: 2.2,  price: "$2.740/kg P", val: 6.03  },
        { name: "Potassium (K)",        pct: "0.88%",   kgPerT: 8.8,  price: "$0.553/kg K", val: 4.87  },
        { name: "Calcium (Ca)",         pct: "0.15%",   kgPerT: 1.5,  price: "$0.204/kg Ca",val: 0.31  },
        { name: "Magnesium (Mg)",       pct: "0.12%",   kgPerT: 1.2,  price: "$1.029/kg Mg",val: 1.23  },
        { name: "Organic Matter (87%)", pct: "870 kg/t",kgPerT: 870,  price: "$0.030/kg OM",val: 26.10 },
        { name: "Biological Premium W2",pct: "—",       kgPerT: "—",  price: "PSB + N-fixer peak", val: 22.08 },
      ],
      badges: [
        { label: "N-fixers ★ PEAK", val: "10\u2079 CFU/g",   color: "#0d4020" },
        { label: "PSB ★ PEAK",      val: "10\u2078 CFU/g",   color: "#1a3560" },
        { label: "Phosphatase ★",   val: "+280% vs base",     color: "#7a5500" },
        { label: "C:N",             val: "14–20",             color: "#1a5530" },
      ],
      note: "W2 is the optimal BSF inoculation window. N-fixers and PSB at peak — inoculate when temp ≤30°C.",
    },
  },

  // ── STAGE 4 — BSF ACTIVE REARING: timeline format ─────────────────────────
  {
    id: "s4",
    label: "Stage 4",
    product: "BSF ACTIVE REARING",
    productColor: "#2d0060",
    tagline: "GH-A Greenhouse · D0→D14 · S4 End = S5B",
    title: "STAGE 4 — BSF ACTIVE REARING: IN-PROCESS QC TRAJECTORY",
    subtitle: "CFI Bioconversion Stage 4 | GH-A Greenhouse | 14-Day Bioconversion | Harvest Fork at Prepupae Stage | Date: 2026",
    timeline: true,
    rows: [
      { section: "PHYSICAL — SUBSTRATE" },
      ["Moisture (substrate)",     "% wb",   "50–60%",         "60–65% ↑",       "55–65%",            "Gravimetric — larvae maintain substrate MC"],
      ["Temperature",              "°C",     "25–30°C",        "28–32°C ↑",      "26–30°C ↓",         "Larval metabolic heat — peaks D4–8"],
      ["pH (substrate)",           "pH",     "6.8–7.5",        "6.5–7.2",        "6.0–7.0",           "Larval excretion slowly acidifies"],
      ["Particle size",            "mm",     "2 mm",           "< 1.5 mm",       "< 0.5 mm fine",     "BSF mandibles fragment substrate"],
      { section: "PROXIMATE — SUBSTRATE DEPLETION (% DM)" },
      ["Crude Protein (substrate)","% DM",   "14–16%",         "10–13% ↓↓",      "7–10% ↓↓↓",         "Larvae consuming substrate protein"],
      ["Crude Fat",                "% DM",   "4–6%",           "2–4% ↓↓",        "1–3% ↓↓↓",          "Lipid = primary larval energy source"],
      ["NFE / Carbohydrates",      "% DM",   "22–28%",         "12–18% ↓↓",      "6–12% ↓↓↓",         "Rapid carbohydrate consumption"],
      ["Ash (relative)",           "% DM",   "11–14%",         "14–18% ↑",       "18–26% ↑↑",         "Concentrates as organic matter consumed"],
      ["ADL (Lignin)",             "% DM",   "11–14%",         "10–13%",         "9–13%",             "BSF cannot digest lignin — slight relative rise"],
      { section: "ELEMENTAL — FRASS ACCUMULATION (% DM)" },
      ["Total Nitrogen (N)",       "% DM",   "2.20–2.50%",     "2.8–3.5% ↑↑",    "3.5–5.0% ↑↑↑ ★",   "Frass N accumulation — larval excretion"],
      ["NH\u2084\u207A-N",       "% DM",   "0.2–0.4%",       "0.5–1.0% ↑↑",    "0.8–1.5% ↑↑↑",     "Larval excretion product"],
      ["Phosphorus (P)",           "% DM",   "0.18–0.26%",     "0.25–0.45% ↑",   "0.40–0.70% ↑↑ ★",  "Gut solubilisation 2–3× input"],
      ["Potassium (K)",            "% DM",   "0.82–0.95%",     "0.90–1.10% ↑",   "1.00–1.30% ↑↑",    "Concentration by OM loss"],
      ["Calcium (Ca)",             "% DM",   "0.13–0.16%",     "0.5–1.5% ↑↑",    "2.0–4.0% ↑↑↑ ★",   "Larval cuticle — BSF highest Ca of all insects"],
      ["C:N Ratio",                "Ratio",  "14–20",          "10–14 ↓↓",        "8–14 ↓↓↓",          "Low C:N — split application advisory at D14"],
      { section: "LARVAL BIOMASS (per kg substrate DM input)" },
      ["Larval fresh weight",      "g/kg DM","0 (inoculated)", "8–15 g",          "20–30 g ★",         "Direct weighing — D14 = prepupae target"],
      ["Individual larval weight", "mg",     "2–5 (neonate)",  "80–150",          "180–280 prepupae ★","Individual weighing"],
      ["Feed conversion ratio",    "kg/kg",  "—",              "~5:1",            "~3.5:1 ★",          "FCR improves toward prepupae"],
      ["Larval length",            "mm",     "1–3",            "8–12",            "18–25 prepupae ★",  "Physical measurement"],
      { section: "HARVEST DECISION GATE — PREPUPAE FORK ⚡" },
      ["Extract larvae → S5A",    "Gate",   "—",              "—",               "→ S5A FRASS",       "Larvae removed → frass = BIO-FERTILISER+"],
      ["Terminate in-sub → S5B",  "Gate",   "—",              "—",               "→ S5B = S4 END ★",  "Larvae remain → full biomass product"],
      ["S5A substrate value",     "$/t DM", "—",              "—",               "$79.95/t DM",       "Frass — larvae sold separately as insect meal"],
      ["S5B substrate value",     "$/t DM", "—",              "—",               "$91.08/t DM ★",     "S4 end state — highest N + Ca substrate"],
      ["Value delta A→B",         "$/t DM", "—",              "—",               "+$11.13 for S5B",   "S5B premium for soil-facing fertiliser product"],
    ],
    value: {
      isHarvestFork: true,
      productA: { name: "S5A — Frass (larvae extracted)", value: 79.95, mc: 20, color: "#1a5530" },
      productB: { name: "S5B = S4 End (terminate in-sub)", value: 91.08, mc: 30, color: "#6b2a00" },
      delta: 11.13,
      keyMetrics: [
        { label: "Larval yield D14",  val: "20–30 g/kg DM", note: "prepupae stage" },
        { label: "FCR at D14",        val: "~3.5 : 1",      note: "kg feed/kg larvae" },
        { label: "Substrate N D14",   val: "3.5–5.0% DM",   note: "frass accumulation" },
        { label: "Ca D14",            val: "2.0–4.0% DM",   note: "cuticle — highest in range" },
        { label: "P D14",             val: "0.40–0.70% DM", note: "2–3× gut solubilisation" },
      ],
      badges: [
        { label: "Larval weight ★",  val: "180–280 mg",    color: "#2d0060" },
        { label: "Substrate N★",     val: "3.5–5.0% DM",  color: "#0d4020" },
        { label: "FCR",              val: "3.5:1",         color: "#1a3560" },
        { label: "S5B premium",      val: "+$11.13/t DM",  color: "#6b2a00" },
      ],
      soilMatrix: [
        { id:"inceptisol", name:"Inceptisols",    pct:"39%", color:"#14b8a6",
          s5a:{ VGAM:195, Normal:243, Poor:326 }, s5b:{ VGAM:210, Normal:260, Poor:345 } },
        { id:"ultisol",    name:"Ultisols (PMK)", pct:"24%", color:"#f59e0b",
          s5a:{ VGAM:243, Normal:293, Poor:470 }, s5b:{ VGAM:258, Normal:308, Poor:485 } },
        { id:"oxisol",     name:"Oxisols",        pct:"8%",  color:"#f97316",
          s5a:{ VGAM:312, Normal:413, Poor:488 }, s5b:{ VGAM:327, Normal:428, Poor:503 } },
        { id:"histosol",   name:"Histosols (Peat)","pct":"7%",color:"#a855f7",
          s5a:{ VGAM:192, Normal:226, Poor:274 }, s5b:{ VGAM:207, Normal:241, Poor:289 } },
        { id:"spodosol",   name:"Spodosols",      pct:"<5%", color:"#64748b",
          s5a:{ VGAM:249, Normal:292, Poor:343 }, s5b:{ VGAM:264, Normal:307, Poor:358 } },
      ],
      note: "S4 end (D14–18, no extraction) = S5B. The harvest decision is the only fork. S5B substrate includes larval protein and Ca uplift.",
    },
  },


  {
    id: "s5b",
    label: "Stage 5B",
    product: "BIO-FERTILISER+ PROTEIN INSIDE",
    productColor: "#6b2a00",
    tagline: "BSF Terminated In-Substrate — Highest N Product",
    title: "BIO-FERTILISER+ PROTEIN INSIDE — BSF TERMINATED IN-SUBSTRATE",
    subtitle: "CFI Bioconversion Stage 5B | BSF Grow-Out Day 6–18 (Operator Selected) | Larvae Terminated Within Substrate | Date: 2026",
    rows: [
      { section: "PHYSICAL PROPERTIES" },
      ["Moisture (output)", "25–35%", "20–40%", "% wb", "Gravimetric 105°C", "AOAC 930.15"],
      ["Bulk density", "550–700", "480–800", "kg/m³", "Direct measurement", "Dense product"],
      ["Texture", "Fine granular", "—", "Qualitative", "Visual", "BSF-digested substrate"],
      ["Colour", "Dark brown/black", "—", "Qualitative", "Visual", "High OM humification"],
      { section: "PROXIMATE ANALYSIS (% DM)" },
      ["Ash", "22–28%", "18–32%", "% DM", "AOAC 942.05", "Insect cuticle + mineral conc."],
      ["Crude Protein (N×6.25)", "22–35%", "18–38%", "% DM", "AOAC 984.13", "BSF larval protein included"],
      ["Crude Fat", "8–15%", "6–18%", "% DM", "AOAC 920.39", "Larval lipid fraction"],
      ["Chitin", "3–6%", "2–8%", "% DM", "Enzymatic/chemical", "Nematode suppression"],
      ["NFE", "15–22%", "12–26%", "% DM", "Calculation", "Reduced — BSF consumed carbs"],
      { section: "FIBER FRACTIONS (% DM)" },
      ["NDF", "32–42%", "28–48%", "% DM", "AOAC 2002.04", "Greatly reduced vs input"],
      ["ADF", "22–30%", "18–35%", "% DM", "AOAC 973.18", "BSF digestion ↓"],
      ["ADL (Lignin)", "10–14%", "8–16%", "% DM", "72% H₂SO₄", "Further microbial + BSF reduction"],
      ["Residual Cellulose", "12–18%", "10–22%", "% DM", "ADF−ADL", "Partially consumed by BSF"],
      { section: "ELEMENTAL ANALYSIS (% DM)" },
      ["Nitrogen (N)", "3.5–5.0%", "3.0–5.5%", "% DM", "CHNS/Kjeldahl", "HIGHEST — frass+larval N"],
      ["Phosphorus (P)", "0.40–0.70%", "0.35–0.80%", "% DM", "ICP-OES", "BSF gut bioavailability ↑"],
      ["Potassium (K)", "1.00–1.30%", "0.90–1.50%", "% DM", "ICP-OES", "Concentrated by BSF"],
      ["Calcium (Ca)", "2.0–4.0%", "1.5–5.0%", "% DM", "ICP-OES", "Insect cuticle — bone meal equiv."],
      ["Magnesium (Mg)", "0.20–0.30%", "0.15–0.35%", "% DM", "ICP-OES", "Concentrated"],
      ["Sodium (Na)", "0.05–0.10%", "0.03–0.15%", "% DM", "ICP-OES", "Trace"],
      ["C:N Ratio", "8–14", "6–16", "Ratio", "Calculated", "Low — high N flush risk on Spodosols"],
      { section: "BIOLOGICAL ACTIVITY" },
      ["Cellulase activity", "10–20 U/g", "8–24 U/g", "U/g", "DNS assay", "Residual humus-enzyme complexes"],
      ["BSF gut microbiome", "10⁹–10¹⁰ CFU/g", "—", "CFU/g", "16S rRNA", "Jeon et al 2011"],
      ["Chitin-induced chitinase", "Elevated", "—", "Qualitative", "Enzyme assay", "Nematode suppression trigger"],
      { section: "AGRONOMIC FLAGS" },
      ["N application rate", "Reduce 30%", "vs standard", "Advisory", "N:K balance", "Low C:N — split application"],
      ["Soil type caution", "Spodosols", "Split apply", "Advisory", "Leaching risk", "NO₃⁻ leaching on sandy soils"],
      ["Organic Matter (% DM)", "65–75%", "60–80%", "% DM", "Loss on ignition", "Reduced — consumed by BSF"],
      ["pH", "7.0–8.5", "6.5–9.0", "pH", "pH meter", "Slightly alkaline — benefits acid soils"],
    ],
    value: {
      totalDM: 91.08,
      totalWet: 63.76,
      wetBasis: "30% moisture (dried)",
      nutrients: [
        { name: "Nitrogen (N)", pct: "4.20%", kgPerT: 42.0, price: "$0.761/kg N", val: 31.96 },
        { name: "Phosphorus (P)", pct: "0.55%", kgPerT: 5.5, price: "$2.740/kg P", val: 15.07 },
        { name: "Potassium (K)", pct: "1.15%", kgPerT: 11.5, price: "$0.553/kg K", val: 6.36 },
        { name: "Calcium (Ca)", pct: "3.00%", kgPerT: 30.0, price: "$0.204/kg Ca", val: 6.12 },
        { name: "Magnesium (Mg)", pct: "0.25%", kgPerT: 2.5, price: "$1.029/kg Mg", val: 2.57 },
        { name: "Organic Matter (70%)", pct: "700 kg/t", kgPerT: 700, price: "$0.030/kg OM", val: 21.00 },
        { name: "Chitin bio-control premium", pct: "4%", kgPerT: 40, price: "Nematode suppression", val: 8.00 },
      ],
      badges: [
        { label: "Nitrogen ★ HIGHEST", val: "3.5–5.0%", color: "#6b2a00" },
        { label: "Calcium (bone equiv.)", val: "2.0–4.0%", color: "#1a3560" },
        { label: "Chitin", val: "3–6% DM", color: "#1a5530" },
        { label: "Cellulase", val: "10–20 U/g", color: "#7a5500" },
      ],
      note: "Highest N product in CFI range. Apply at reduced rate on Spodosols. Split application recommended.",
    },
  },
  {
    id: "s5a",
    label: "Stage 5A",
    product: "BIO-FERTILISER+",
    productColor: "#1a5530",
    tagline: "BSF Extracted — Frass — Highest Microbial Diversity",
    title: "BIO-FERTILISER+ — POST-BSF EXTRACTION (FRASS)",
    subtitle: "CFI Bioconversion Stage 5A | BSF Prepupae Extracted at Day 6–18 | Residual Frass + Substrate | Date: 2026",
    rows: [
      { section: "PHYSICAL PROPERTIES" },
      ["Moisture (output)", "20–30%", "15–35%", "% wb", "Gravimetric 105°C", "AOAC 930.15"],
      ["Bulk density", "480–620", "420–700", "kg/m³", "Direct measurement", "Frass product"],
      ["Texture", "Fine crumble", "—", "Qualitative", "Visual", "BSF-processed substrate"],
      ["Colour", "Dark brown", "—", "Qualitative", "Visual", "Humified frass"],
      { section: "PROXIMATE ANALYSIS (% DM)" },
      ["Ash", "18–24%", "14–28%", "% DM", "AOAC 942.05", "Mineral concentration — BSF removed organics"],
      ["Crude Protein (N×6.25)", "15–22%", "12–26%", "% DM", "AOAC 984.13", "Frass protein — high bioavailability"],
      ["Crude Fat", "3–7%", "2–9%", "% DM", "AOAC 920.39", "BSF consumed most lipid"],
      ["Chitin (residual)", "0.5–1.5%", "0.3–2.0%", "% DM", "Enzymatic/chemical", "Lower than S5B — larvae removed"],
      { section: "FIBER FRACTIONS (% DM)" },
      ["NDF", "28–38%", "24–44%", "% DM", "AOAC 2002.04", "Further reduced — BSF digestion complete"],
      ["ADF", "18–26%", "14–30%", "% DM", "AOAC 973.18", "Highly digested"],
      ["ADL (Lignin)", "9–12%", "7–14%", "% DM", "72% H₂SO₄", "Lowest lignin of all stages"],
      ["Residual Cellulose", "9–15%", "7–18%", "% DM", "ADF−ADL", "Mostly consumed"],
      { section: "ELEMENTAL ANALYSIS (% DM)" },
      ["Nitrogen (N)", "2.5–3.5%", "2.0–4.0%", "% DM", "CHNS/Kjeldahl", "Frass N — high plant availability"],
      ["Nitrate-N (NO₃⁻-N)", "0.3–0.8%", "0.2–1.0%", "% DM", "Ion chromatography", "Immediately plant-available"],
      ["Ammonium-N (NH₄⁺-N)", "0.4–1.0%", "0.3–1.2%", "% DM", "Distillation", "CEC-retained — slower release"],
      ["Phosphorus (P)", "0.30–0.55%", "0.25–0.65%", "% DM", "ICP-OES", "BSF gut solubilisation 2–3x input"],
      ["Potassium (K)", "0.90–1.20%", "0.80–1.40%", "% DM", "ICP-OES", "Concentrated K"],
      ["Calcium (Ca)", "0.80–1.50%", "0.60–1.80%", "% DM", "ICP-OES", "Frass Ca"],
      ["Magnesium (Mg)", "0.15–0.22%", "0.12–0.28%", "% DM", "ICP-OES", "Maintained"],
      ["C:N Ratio", "12–18", "10–22", "Ratio", "Calculated", "Optimal for N synchrony with palm roots"],
      { section: "BIOLOGICAL ACTIVITY" },
      ["Cellulase activity", "8–18 U/g", "6–22 U/g", "U/g", "DNS assay", "Residual — humus-enzyme complex"],
      ["Total microbial biomass", "10⁹–10¹⁰ CFU/g", "—", "CFU/g", "16S rRNA", "BSF gut microbiome release"],
      ["BSF gut species diversity", "1,000s of species", "—", "Qualitative", "Metagenomics", "Jeon et al 2011"],
      ["P-solubilising bacteria", "10⁷–10⁸ CFU/g", "—", "CFU/g", "Pikovskaya agar", "Liu et al 2008"],
      ["N-fixing bacteria", "10⁷–10⁸ CFU/g", "—", "CFU/g", "Plate count", "Frontiers Microbiology 2026"],
      { section: "LONG-TERM SOIL BUILDING" },
      ["Organic Matter (% DM)", "72–82%", "68–86%", "% DM", "Loss on ignition", "Well-humified fraction"],
      ["Humic Acid content", "10–18%", "8–22%", "% DM", "Humic extraction", "Higher than S3 — further matured"],
      ["CEC contribution", "+3 meq/100g / 1% SOM", "—", "meq/100g", "Ammonium acetate", "Lal 2004 Science"],
      ["pH", "7.5–8.5", "7.0–9.0", "pH", "pH meter", "Alkaline — neutralises acid soils"],
      ["N leaching reduction", "34–40%", "vs mineral N", "% reduction", "Field trials", "Xia et al 2021"],
    ],
    value: {
      totalDM: 79.95,
      totalWet: 59.96,
      wetBasis: "25% moisture (dried)",
      nutrients: [
        { name: "Nitrogen (N)", pct: "3.00%", kgPerT: 30.0, price: "$0.761/kg N", val: 22.83 },
        { name: "Phosphorus (P)", pct: "0.42%", kgPerT: 4.2, price: "$2.740/kg P", val: 11.51 },
        { name: "Potassium (K)", pct: "1.05%", kgPerT: 10.5, price: "$0.553/kg K", val: 5.81 },
        { name: "Calcium (Ca)", pct: "1.15%", kgPerT: 11.5, price: "$0.204/kg Ca", val: 2.35 },
        { name: "Magnesium (Mg)", pct: "0.18%", kgPerT: 1.8, price: "$1.029/kg Mg", val: 1.85 },
        { name: "Organic Matter (77%)", pct: "770 kg/t", kgPerT: 770, price: "$0.030/kg OM", val: 23.10 },
        { name: "Microbial diversity premium", pct: "—", kgPerT: "—", price: "BSF gut inoculum", val: 12.50 },
      ],
      badges: [
        { label: "Microbial diversity ★", val: "10¹⁰ CFU/g", color: "#1a5530" },
        { label: "P solubilised", val: "2–3× input", color: "#1a3560" },
        { label: "Cellulase", val: "8–18 U/g", color: "#7a5500" },
        { label: "N leach reduction", val: "34–40%", color: "#1a5530" },
      ],
      note: "Best long-term soil builder. Optimal for Ultisols (P1) and Spodosols (P2). N synchrony C:N 12–18.",
    },
  },
];

const COL_WIDTHS = ["28%", "12%", "11%", "8%", "20%", "21%"];
const COL_HEADERS = ["Parameter", "Typical Value", "Range", "Unit", "Analytical Method", "Primary Reference"];

export default function CFIStageLabDisplay() {
  const [activeStage, setActiveStage] = useState("s0");
  const stage = STAGES.find(s => s.id === activeStage);

  return (
    <div style={{ fontFamily: "'Georgia', serif", background: "#f5f5f0", minHeight: "100vh", padding: "0 0 40px 0" }}>

      {/* ── TOP HEADER ── */}
      <div style={{ background: "#0a1628", padding: "18px 32px 14px", borderBottom: "3px solid #c47d00" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ color: "#c47d00", fontSize: 10, letterSpacing: 3, fontFamily: "Arial", textTransform: "uppercase", marginBottom: 4 }}>
              CIRCULAR FERTILISER INDUSTRIES — BOGOR, WEST JAVA
            </div>
            <div style={{ color: "#ffffff", fontSize: 18, fontWeight: "bold", letterSpacing: 0.5 }}>
              Stage-End Lab Analysis &amp; Product Value Report
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: "#aaaaaa", fontSize: 9, fontFamily: "Arial" }}>60 TPH FFB MILL  |  EFB+OPDC 60:40</div>
            <div style={{ color: "#aaaaaa", fontSize: 9, fontFamily: "Arial" }}>PhD-Verified  |  March 2026</div>
          </div>
        </div>
      </div>

      {/* ── STAGE TABS ── */}
      <div style={{ background: "#1a3560", display: "flex", gap: 0, borderBottom: "2px solid #c47d00" }}>
        {STAGES.map(s => (
          <button
            key={s.id}
            onClick={() => setActiveStage(s.id)}
            style={{
              padding: "12px 22px",
              background: activeStage === s.id ? s.productColor : "transparent",
              color: activeStage === s.id ? "#ffffff" : "#adc8f0",
              border: "none",
              borderRight: "1px solid #2a4a80",
              cursor: "pointer",
              fontFamily: "Arial",
              fontSize: 11,
              fontWeight: activeStage === s.id ? "bold" : "normal",
              letterSpacing: 0.5,
              transition: "all 0.2s",
            }}
          >
            <div style={{ fontSize: 9, opacity: 0.8, marginBottom: 2 }}>{s.label}</div>
            <div>{s.product}</div>
          </button>
        ))}
      </div>

      {/* ── MAIN CONTENT — two columns ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 0, maxWidth: 1400, margin: "0 auto" }}>

        {/* ── LEFT: LAB ANALYSIS TABLE ── */}
        <div style={{ padding: "0 0 0 0" }}>

          {/* Table header block */}
          <div style={{ background: stage.productColor, padding: "14px 20px 10px" }}>
            <div style={{ color: "#ffffff", fontSize: 15, fontWeight: "bold", letterSpacing: 0.5, marginBottom: 3 }}>
              {stage.title}
            </div>
            <div style={{ color: "#f5c842", fontSize: 10, fontFamily: "Arial", letterSpacing: 0.5 }}>
              {stage.subtitle}
            </div>
          </div>

          {/* Column headers — three-stream vs delta vs timeline vs standard */}
          {stage.threeStream ? (
            <div style={{ display: "grid", gridTemplateColumns: "26% 14% 14% 14% 8% 14% 10%", background: "#1a3560" }}>
              {["Parameter", "EFB", "OPDC / DC", "POME Sludge", "Unit", "Analytical Method", "Reference"].map((h, i) => (
                <div key={i} style={{
                  color: i === 1 ? "#86efac" : i === 2 ? "#93c5fd" : i === 3 ? "#d8b4fe" : "#ffffff",
                  fontSize: 9, fontFamily: "Arial", fontWeight: "bold",
                  padding: "7px 8px", borderRight: i < 6 ? "1px solid #2a4a80" : "none",
                  textTransform: "uppercase", letterSpacing: 0.5
                }}>{h}</div>
              ))}
            </div>
          ) : stage.deltaStage ? (
            <div style={{ display: "grid", gridTemplateColumns: "24% 7% 14% 14% 5% 18% 18%", background: "#0d4020" }}>
              {["Parameter", "Unit", "W1 Output", "W2 Result", "Δ", "Analytical Method", "Reference / Note"].map((h, i) => (
                <div key={i} style={{
                  color: i === 2 ? "#86efac" : i === 3 ? "#fde68a" : i === 4 ? "#f9a8d4" : "#ffffff",
                  fontSize: 9, fontFamily: "Arial", fontWeight: "bold",
                  padding: "7px 8px", borderRight: i < 6 ? "1px solid #1a5530" : "none",
                  textTransform: "uppercase", letterSpacing: 0.5
                }}>{h}</div>
              ))}
            </div>
          ) : stage.timeline ? (
            <div style={{ display: "grid", gridTemplateColumns: "22% 7% 17% 17% 20% 17%", background: "#2d0060" }}>
              {["Parameter", "Unit", "D0 — Entry", "D6 — Active", "D14 — Harvest Fork", "Method / Note"].map((h, i) => (
                <div key={i} style={{
                  color: i === 2 ? "#c4b5fd" : i === 3 ? "#a78bfa" : i === 4 ? "#fde68a" : "#ffffff",
                  fontSize: 9, fontFamily: "Arial", fontWeight: "bold",
                  padding: "7px 8px", borderRight: i < 5 ? "1px solid #4c1d95" : "none",
                  textTransform: "uppercase", letterSpacing: 0.5
                }}>{h}</div>
              ))}
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: COL_WIDTHS.join(" "), background: "#1a3560" }}>
              {COL_HEADERS.map((h, i) => (
                <div key={i} style={{
                  color: "#ffffff", fontSize: 9, fontFamily: "Arial", fontWeight: "bold",
                  padding: "7px 8px", borderRight: i < COL_HEADERS.length - 1 ? "1px solid #2a4a80" : "none",
                  textTransform: "uppercase", letterSpacing: 0.5
                }}>{h}</div>
              ))}
            </div>
          )}

          {/* Rows — three-stream vs delta vs timeline vs standard */}
          {stage.threeStream ? (
            stage.rows.map((row, i) => {
              if (row.section) {
                return (
                  <div key={i} style={{
                    background: "#e8edf5", padding: "5px 10px", fontSize: 9,
                    fontFamily: "Arial", fontWeight: "bold", color: "#1a3560",
                    textTransform: "uppercase", letterSpacing: 1,
                    borderTop: "1px solid #c4cfe0", borderBottom: "1px solid #c4cfe0",
                  }}>{row.section}</div>
                );
              }
              // row = [param, efb, opdc, pome, unit, method, reference]
              const hasAlert = String(row[1]).includes("✗") || String(row[1]).includes("⚠") ||
                               String(row[2]).includes("★") || String(row[3]).includes("★") ||
                               String(row[1]).includes("NOT READY") || String(row[3]).includes("DATA GAP");
              const rowBg = hasAlert ? "#fff8e8" : i % 2 === 0 ? "#ffffff" : "#fafafa";
              const cellColor = (v) => {
                if (String(v).includes("NOT READY") || String(v).includes("CRITICAL") || String(v).includes("FAIL")) return "#b00020";
                if (String(v).includes("★")) return "#c47d00";
                if (String(v).includes("DATA GAP")) return "#888888";
                if (String(v).includes("PASS") || String(v).includes("READY")) return "#1a5530";
                return "#333333";
              };
              return (
                <div key={i} style={{
                  display: "grid", gridTemplateColumns: "26% 14% 14% 14% 8% 14% 10%",
                  background: rowBg, borderBottom: "1px solid #eeeeee",
                }}>
                  {row.map((cell, j) => (
                    <div key={j} style={{
                      padding: "5px 8px",
                      fontSize: j === 0 ? 10 : 9,
                      fontFamily: j === 0 ? "Georgia, serif" : "Arial, sans-serif",
                      fontWeight: j === 0 ? "bold" : j >= 1 && j <= 3 ? "600" : "normal",
                      color: j === 0 ? "#000000" :
                             j === 1 ? cellColor(cell) :
                             j === 2 ? cellColor(cell) :
                             j === 3 ? cellColor(cell) :
                             j === 6 ? "#1a55cc" : "#555555",
                      borderRight: j < row.length - 1 ? "1px solid #eeeeee" : "none",
                      fontStyle: j === 6 ? "italic" : "normal",
                    }}>{cell}</div>
                  ))}
                </div>
              );
            })
          ) : stage.deltaStage ? (
            // ── Delta-column rendering (S3W2): [param, unit, w1, w2, delta, method, ref] ──
            stage.rows.map((row, i) => {
              if (row.section) {
                return (
                  <div key={i} style={{
                    background: "#d4edda", padding: "5px 10px", fontSize: 9,
                    fontFamily: "Arial", fontWeight: "bold", color: "#0d4020",
                    textTransform: "uppercase", letterSpacing: 1,
                    borderTop: "1px solid #a8d5b5", borderBottom: "1px solid #a8d5b5",
                  }}>
                    {row.section}
                    {row.section.includes("★") && (
                      <span style={{ background: "#0d4020", color: "#fde68a", fontSize: 8, padding: "1px 6px", borderRadius: 3, marginLeft: 8 }}>PEAK</span>
                    )}
                  </div>
                );
              }
              // row = [param, unit, w1, w2, delta, method, ref]
              const delta = row[4];
              const deltaColor = delta === "↑" ? "#1a5530" : delta === "↓" ? "#b00020" : "#888888";
              const hasHighlight = String(row[3]).includes("★");
              return (
                <div key={i} style={{
                  display: "grid", gridTemplateColumns: "24% 7% 14% 14% 5% 18% 18%",
                  background: hasHighlight ? "#fffbeb" : i % 2 === 0 ? "#ffffff" : "#f6fef9",
                  borderBottom: "1px solid #e0ede5",
                }}>
                  {row.map((cell, j) => (
                    <div key={j} style={{
                      padding: "5px 8px", fontSize: j === 0 ? 10 : 9,
                      fontFamily: j === 0 ? "Georgia, serif" : "Arial, sans-serif",
                      fontWeight: j === 0 ? "bold" : j === 3 ? "600" : "normal",
                      color: j === 0 ? "#000" :
                             j === 2 ? "#555" :
                             j === 3 ? (hasHighlight ? "#c47d00" : "#0d4020") :
                             j === 4 ? deltaColor :
                             j === 6 ? "#1a55cc" : "#444",
                      borderRight: j < row.length - 1 ? "1px solid #e8f0ec" : "none",
                      fontStyle: j === 6 ? "italic" : "normal",
                      fontSize: j === 4 ? 13 : j === 0 ? 10 : 9,
                      textAlign: j === 4 ? "center" : "left",
                    }}>{cell}</div>
                  ))}
                </div>
              );
            })
          ) : stage.timeline ? (
            // ── Timeline rendering (S4): [param, unit, d0, d6, d14, method] ──
            stage.rows.map((row, i) => {
              if (row.section) {
                return (
                  <div key={i} style={{
                    background: "#ede9fe", padding: "5px 10px", fontSize: 9,
                    fontFamily: "Arial", fontWeight: "bold", color: "#2d0060",
                    textTransform: "uppercase", letterSpacing: 1,
                    borderTop: "1px solid #c4b5fd", borderBottom: "1px solid #c4b5fd",
                  }}>
                    {row.section}
                    {row.section.includes("★") && (
                      <span style={{ background: "#2d0060", color: "#fde68a", fontSize: 8, padding: "1px 6px", borderRadius: 3, marginLeft: 8 }}>KEY</span>
                    )}
                  </div>
                );
              }
              // row = [param, unit, d0, d6, d14, method]
              const isFork = String(row[4]).includes("S5A") || String(row[4]).includes("S5B") || String(row[4]).includes("S4 END");
              const isKey = String(row[4]).includes("★") || String(row[0]).includes("Harvest");
              const d14Color = isFork
                ? (String(row[4]).includes("S5B") ? "#6b2a00" : "#1a5530")
                : isKey ? "#c47d00" : "#333";
              return (
                <div key={i} style={{
                  display: "grid", gridTemplateColumns: "22% 7% 17% 17% 20% 17%",
                  background: isFork ? "#fff8f0" : isKey ? "#fefce8" : i % 2 === 0 ? "#ffffff" : "#faf8ff",
                  borderBottom: "1px solid #ede9fe",
                }}>
                  {row.map((cell, j) => (
                    <div key={j} style={{
                      padding: "5px 8px", fontSize: j === 0 ? 10 : 9,
                      fontFamily: j === 0 ? "Georgia, serif" : "Arial, sans-serif",
                      fontWeight: j === 0 ? "bold" : j === 4 ? "600" : "normal",
                      color: j === 0 ? "#000" :
                             j === 2 ? "#6d6d6d" :
                             j === 3 ? "#2d0060" :
                             j === 4 ? d14Color :
                             j === 5 ? "#1a55cc" : "#444",
                      borderRight: j < row.length - 1 ? "1px solid #ede9fe" : "none",
                      fontStyle: j === 5 ? "italic" : "normal",
                      background: j === 4 && isFork ? (String(row[4]).includes("S5B") ? "#fff0e8" : "#edfaf3") : "transparent",
                    }}>{cell}</div>
                  ))}
                </div>
              );
            })
          ) : (
            stage.rows.map((row, i) => {
              if (row.section) {
                return (
                  <div key={i} style={{
                    background: "#e8edf5",
                    padding: "5px 10px",
                    fontSize: 9,
                    fontFamily: "Arial",
                    fontWeight: "bold",
                    color: "#1a3560",
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    borderTop: "1px solid #c4cfe0",
                    borderBottom: "1px solid #c4cfe0",
                  }}>
                    {row.section}
                    {row.section.includes("★") && (
                      <span style={{ background: "#c47d00", color: "white", fontSize: 8, padding: "1px 6px", borderRadius: 3, marginLeft: 8 }}>
                        PEAK
                      </span>
                    )}
                  </div>
                );
              }
              const isHighlight = String(row[1]).includes("★") || String(row[0]).includes("Cellulase");
              return (
                <div key={i} style={{
                  display: "grid",
                  gridTemplateColumns: COL_WIDTHS.join(" "),
                  background: isHighlight ? "#fff8e8" : i % 2 === 0 ? "#ffffff" : "#fafafa",
                  borderBottom: "1px solid #eeeeee",
                }}>
                  {row.map((cell, j) => (
                    <div key={j} style={{
                      padding: "5px 8px",
                      fontSize: j === 0 ? 10 : 9,
                      fontFamily: j === 0 ? "Georgia, serif" : "Arial, sans-serif",
                      fontWeight: j === 0 ? "bold" : "normal",
                      color: isHighlight && j === 1 ? "#c47d00" :
                             j === 5 ? "#1a55cc" :
                             j === 0 ? "#000000" : "#333333",
                      borderRight: j < row.length - 1 ? "1px solid #eeeeee" : "none",
                      fontStyle: j === 5 ? "italic" : "normal",
                    }}>
                      {cell}
                    </div>
                  ))}
                </div>
              );
            })
          )}
        </div>

        {/* ── RIGHT: PRODUCT VALUE / BASELINE PANEL ── */}
        <div style={{ background: "#ffffff", borderLeft: "2px solid #dddddd", display: "flex", flexDirection: "column" }}>

          {/* Product title */}
          <div style={{ background: stage.productColor, padding: "14px 16px" }}>
            <div style={{ color: "#f5c842", fontSize: 9, fontFamily: "Arial", letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>
              {stage.value.isBaseline ? "BASELINE INPUTS" : stage.value.isHarvestFork ? "IN-PROCESS QC · HARVEST FORK" : "PRODUCT VALUE"}
            </div>
            <div style={{ color: "#ffffff", fontSize: 14, fontWeight: "bold", lineHeight: 1.3 }}>
              {stage.product}
            </div>
            <div style={{ color: "#f5c842", fontSize: 9, fontFamily: "Arial", marginTop: 4, lineHeight: 1.4 }}>
              {stage.tagline}
            </div>
          </div>

          {/* Right panel: baseline (S0) | harvest fork (S4) | standard product */}
          {stage.value.isBaseline ? (
            <div style={{ flex: 1, overflowY: "auto" }}>

              {/* Total daily inputs at 60 TPH mill */}
              <div style={{ padding: "10px 12px", background: "#f5f5ee", borderBottom: "1px solid #ddd" }}>
                <div style={{ fontSize: 9, fontFamily: "Arial", fontWeight: "bold", color: "#3a2000",
                              textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>
                  Daily Feedstock Volume — 60 TPH Mill (24/7)
                </div>
                {stage.value.streams.map((sv, si) => (
                  <div key={si} style={{ display: "flex", justifyContent: "space-between",
                    padding: "3px 6px", borderRadius: 3, marginBottom: 3,
                    background: sv.color + "18",
                    border: `1px solid ${sv.color}44` }}>
                    <span style={{ fontSize: 9, fontFamily: "Arial", fontWeight: "bold",
                      color: sv.color }}>{sv.name}</span>
                    <span style={{ fontSize: 9, fontFamily: "Arial", color: "#555" }}>
                      ~{sv.daily_wet} t/day wet
                    </span>
                  </div>
                ))}
              </div>

              {/* Per-stream nutrient tables */}
              {stage.value.streams.map((sv, si) => {
                return (
                  <div key={si} style={{ padding: "8px 12px", borderBottom: "1px solid #eee" }}>
                    <div style={{ fontSize: 9, fontFamily: "Arial", fontWeight: "bold",
                      color: sv.color, textTransform: "uppercase", letterSpacing: 0.5,
                      marginBottom: 4, display: "flex", justifyContent: "space-between" }}>
                      <span>{sv.name}</span>
                      <span style={{ color: "#888", fontWeight: "normal" }}>MC: {sv.mc}% wb</span>
                    </div>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 8.5, fontFamily: "Arial" }}>
                      <thead>
                        <tr style={{ background: "#f0f0f0" }}>
                          <th style={{ textAlign: "left", padding: "3px 4px", color: "#333", borderBottom: "1px solid #ddd" }}>Nutrient</th>
                          <th style={{ textAlign: "right", padding: "3px 4px", color: "#333", borderBottom: "1px solid #ddd" }}>kg/t wet</th>
                          <th style={{ textAlign: "right", padding: "3px 4px", color: "#333", borderBottom: "1px solid #ddd" }}>kg/t DM</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sv.nutrients.map((n, ni) => (
                          <tr key={ni} style={{ background: ni % 2 === 0 ? "#fff" : "#fafafa" }}>
                            <td style={{ padding: "3px 4px", color: "#222", borderBottom: "1px solid #f0f0f0", fontSize: 8 }}>{n.name}</td>
                            <td style={{ padding: "3px 4px", textAlign: "right", color: sv.color, fontWeight: "bold", borderBottom: "1px solid #f0f0f0" }}>{n.kgPerTWet.toFixed(2)}</td>
                            <td style={{ padding: "3px 4px", textAlign: "right", color: "#555", borderBottom: "1px solid #f0f0f0" }}>{n.kgPerTDM.toFixed(1)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })}

              {/* Soil × AG Management Value Matrix */}
              {stage.value.soilMatrix && (
                <div style={{ padding: "10px 12px", borderBottom: "1px solid #eee" }}>
                  <div style={{ fontSize: 9, fontFamily: "Arial", fontWeight: "bold", color: "#1a3560",
                    textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>
                    CFI Product Value by Soil × AG Management — $/t DM
                  </div>

                  {/* Tier legend */}
                  <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                    {[
                      { tier: "VGAM",   color: "#22c55e", label: "VGAM" },
                      { tier: "Normal", color: "#14b8a6", label: "Normal" },
                      { tier: "Poor",   color: "#ef4444", label: "Poor" },
                    ].map(t => (
                      <div key={t.tier} style={{ display: "flex", alignItems: "center", gap: 3 }}>
                        <div style={{ width: 10, height: 10, borderRadius: 2, background: t.color }} />
                        <span style={{ fontSize: 8, fontFamily: "Arial", color: "#555" }}>{t.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Grid: soil rows × tier columns */}
                  {/* Header row */}
                  <div style={{ display: "grid", gridTemplateColumns: "auto 1fr 1fr 1fr 1fr", gap: 0,
                    background: "#f0f0f0", borderRadius: "3px 3px 0 0", border: "1px solid #ddd",
                    borderBottom: "none" }}>
                    {["Soil", "N loss", "VGAM", "Normal", "Poor"].map((h, i) => (
                      <div key={i} style={{ padding: "4px 6px", fontSize: 8, fontFamily: "Arial",
                        fontWeight: "bold", color: "#333",
                        textAlign: i === 0 ? "left" : "center",
                        borderRight: i < 4 ? "1px solid #ddd" : "none" }}>
                        {h}
                      </div>
                    ))}
                  </div>

                  {/* Soil rows */}
                  {stage.value.soilMatrix.map((soil, si) => {
                    const maxVal = Math.max(...Object.values(soil.tiers));
                    return (
                      <div key={si} style={{ display: "grid", gridTemplateColumns: "auto 1fr 1fr 1fr 1fr",
                        background: si % 2 === 0 ? "#fff" : "#fafafa",
                        border: "1px solid #ddd", borderTop: "none",
                        borderRadius: si === stage.value.soilMatrix.length - 1 ? "0 0 3px 3px" : 0 }}>

                        {/* Soil name */}
                        <div style={{ padding: "5px 6px", borderRight: "1px solid #ddd" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                            <div style={{ width: 6, height: 6, borderRadius: "50%", background: soil.color, flexShrink: 0 }} />
                            <div>
                              <div style={{ fontSize: 8.5, fontFamily: "Arial", fontWeight: "bold",
                                color: "#222", whiteSpace: "nowrap" }}>{soil.name}</div>
                              <div style={{ fontSize: 7.5, color: "#888", fontFamily: "Arial" }}>{soil.pct} of estates</div>
                            </div>
                          </div>
                        </div>

                        {/* N loss */}
                        <div style={{ padding: "5px 6px", textAlign: "center", borderRight: "1px solid #ddd",
                          display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <span style={{ fontSize: 8, fontFamily: "Arial", color: "#b00020",
                            fontWeight: "bold" }}>{soil.nLoss}</span>
                        </div>

                        {/* VGAM / Normal / Poor cells */}
                        {["VGAM", "Normal", "Poor"].map((tier, ti) => {
                          const val = soil.tiers[tier];
                          const tierColors = { VGAM: "#22c55e", Normal: "#14b8a6", Poor: "#ef4444" };
                          const bgOpacity = val === maxVal ? "25" : "10";
                          return (
                            <div key={tier} style={{
                              padding: "4px 5px", textAlign: "center",
                              borderRight: ti < 2 ? "1px solid #ddd" : "none",
                              background: val === maxVal ? tierColors[tier] + "22" : "transparent",
                              display: "flex", flexDirection: "column", alignItems: "center",
                              justifyContent: "center"
                            }}>
                              <div style={{ fontSize: 9.5, fontWeight: "bold", fontFamily: "Arial",
                                color: val === maxVal ? tierColors[tier] : "#333" }}>
                                ${val}
                              </div>
                              <div style={{ fontSize: 7, color: "#888", fontFamily: "Arial" }}>
                                {soil.pMult[tier]}× P
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}

                  {/* Pitch note per selected soil — static callouts for the two primary targets */}
                  <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
                    {stage.value.soilMatrix.filter(s => s.primary).map((soil, si) => (
                      <div key={si} style={{ padding: "5px 8px", borderRadius: 3,
                        background: soil.color + "15", border: `1px solid ${soil.color}44`,
                        fontSize: 8, fontFamily: "Arial", color: "#333", lineHeight: 1.5 }}>
                        <span style={{ fontWeight: "bold", color: soil.color }}>{soil.name}: </span>
                        {soil.pitch}
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: 6, fontSize: 7.5, fontFamily: "Arial", color: "#999",
                    fontStyle: "italic" }}>
                    Value basis: N leach-avoided + P fixation-bypassed (soil-specific) + K replacement. Source: CFI_Soil_Calculator_v3. Price basis: Urea $350/t · TSP $550/t · MOP $400/t.
                  </div>
                </div>
              )}
              <div style={{ margin: "8px 12px 12px", padding: "8px 10px",
                background: "#fff3cd", border: "1px solid #f59e0b",
                borderRadius: 4, fontSize: 8.5, fontFamily: "Arial", lineHeight: 1.6 }}>
                <div style={{ fontWeight: "bold", color: "#92400e", marginBottom: 4 }}>⚠ ACTIVE GUARDRAILS AT S0</div>
                <div>• <strong>POME C:N</strong> = confirmed DATA GAP (Mar 2026)</div>
                <div>• <strong>POME Fe</strong> 3–8k mg/kg DM — submit CFI-LAB-POME-001 Pkg A to unlock full inclusion</div>
                <div>• <strong>Feedipedia POME EE 29.2%</strong> — REJECTED. Use 10% DM canonical value only</div>
                <div>• Streams are NOT blended at S0 — blend occurs at S3+ only after independent S1+S2</div>
              </div>

              {/* Quality badges */}
              <div style={{ padding: "8px 12px", borderTop: "1px solid #eee", display: "flex", flexWrap: "wrap", gap: 5 }}>
                {stage.value.badges.map((b, i) => (
                  <div key={i} style={{
                    background: b.color, color: "white", padding: "4px 8px",
                    borderRadius: 3, fontSize: 9, fontFamily: "Arial", lineHeight: 1.4,
                  }}>
                    <div style={{ fontSize: 8, opacity: 0.8 }}>{b.label}</div>
                    <div style={{ fontWeight: "bold" }}>{b.val}</div>
                  </div>
                ))}
              </div>

            </div>

          ) : stage.value.isHarvestFork ? (
            // ── S4 Harvest Fork Panel ──
            <div style={{ flex: 1, overflowY: "auto" }}>

              {/* Fork header */}
              <div style={{ background: "#1a0040", padding: "10px 12px", borderBottom: "1px solid #4c1d95" }}>
                <div style={{ fontSize: 9, fontFamily: "Arial", fontWeight: "bold", color: "#c4b5fd",
                  textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>
                  ⚡ HARVEST DECISION FORK — D14 PREPUPAE
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                  {[stage.value.productA, stage.value.productB].map((p, pi) => (
                    <div key={pi} style={{ background: p.color, padding: "8px 10px", borderRadius: 4 }}>
                      <div style={{ fontSize: 8, color: "rgba(255,255,255,0.7)", fontFamily: "Arial", marginBottom: 2 }}>
                        {pi === 0 ? "OPTION A — Extract Larvae" : "OPTION B — Terminate In-Sub ★"}
                      </div>
                      <div style={{ fontSize: 9, color: "#fff", fontFamily: "Arial", fontWeight: "bold", lineHeight: 1.3, marginBottom: 4 }}>
                        {p.name}
                      </div>
                      <div style={{ fontSize: 18, color: "#fde68a", fontFamily: "Arial", fontWeight: "bold" }}>
                        ${p.value}
                      </div>
                      <div style={{ fontSize: 8, color: "rgba(255,255,255,0.7)", fontFamily: "Arial" }}>
                        /t DM · {p.mc}% MC delivery
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 8, background: "#4c1d95", padding: "6px 10px", borderRadius: 3,
                  display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 9, fontFamily: "Arial", color: "#fde68a", fontWeight: "bold" }}>
                    S5B premium over S5A substrate:
                  </span>
                  <span style={{ fontSize: 16, fontFamily: "Arial", fontWeight: "bold", color: "#fde68a" }}>
                    +${stage.value.delta.toFixed(2)}/t DM
                  </span>
                </div>
              </div>

              {/* Key metrics at D14 */}
              <div style={{ padding: "10px 12px", borderBottom: "1px solid #eee" }}>
                <div style={{ fontSize: 9, fontFamily: "Arial", fontWeight: "bold", color: "#2d0060",
                  textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>
                  Substrate Metrics at D14
                </div>
                {stage.value.keyMetrics.map((m, mi) => (
                  <div key={mi} style={{ display: "flex", justifyContent: "space-between",
                    padding: "3px 0", borderBottom: "1px solid #f0eeff" }}>
                    <span style={{ fontSize: 8.5, fontFamily: "Arial", color: "#555" }}>{m.label}</span>
                    <div style={{ textAlign: "right" }}>
                      <span style={{ fontSize: 9, fontFamily: "Arial", fontWeight: "bold", color: "#2d0060" }}>{m.val}</span>
                      <span style={{ fontSize: 7.5, color: "#999", fontFamily: "Arial", marginLeft: 4 }}>{m.note}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Soil × S5A vs S5B value matrix */}
              <div style={{ padding: "10px 12px", borderBottom: "1px solid #eee" }}>
                <div style={{ fontSize: 9, fontFamily: "Arial", fontWeight: "bold", color: "#2d0060",
                  textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>
                  Product Value by Soil — S5A vs S5B ($/t DM · Normal mgmt)
                </div>
                {stage.value.soilMatrix.map((soil, si) => (
                  <div key={si} style={{ display: "flex", alignItems: "center", gap: 6,
                    padding: "4px 0", borderBottom: "1px solid #f0eeff" }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: soil.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 8.5, fontFamily: "Arial", color: "#333", flex: 1 }}>{soil.name}</span>
                    <span style={{ fontSize: 8.5, fontFamily: "Arial", color: "#1a5530", fontWeight: "bold", width: 36, textAlign: "right" }}>
                      ${soil.s5a.Normal}
                    </span>
                    <span style={{ fontSize: 8, color: "#888", fontFamily: "Arial" }}>→</span>
                    <span style={{ fontSize: 8.5, fontFamily: "Arial", color: "#6b2a00", fontWeight: "bold", width: 36, textAlign: "right" }}>
                      ${soil.s5b.Normal}
                    </span>
                    <span style={{ fontSize: 7.5, fontFamily: "Arial", color: "#c47d00", width: 30, textAlign: "right" }}>
                      +${soil.s5b.Normal - soil.s5a.Normal}
                    </span>
                  </div>
                ))}
                <div style={{ fontSize: 7.5, color: "#888", fontFamily: "Arial", marginTop: 4, fontStyle: "italic" }}>
                  S5A / S5B · Normal management. S5B = S4 D14 end state — no extraction required.
                </div>
              </div>

              {/* Badges */}
              <div style={{ padding: "8px 12px", display: "flex", flexWrap: "wrap", gap: 5 }}>
                {stage.value.badges.map((b, bi) => (
                  <div key={bi} style={{ background: b.color, color: "white", padding: "4px 8px",
                    borderRadius: 3, fontSize: 9, fontFamily: "Arial", lineHeight: 1.4 }}>
                    <div style={{ fontSize: 8, opacity: 0.8 }}>{b.label}</div>
                    <div style={{ fontWeight: "bold" }}>{b.val}</div>
                  </div>
                ))}
              </div>

              <div style={{ margin: "0 12px 12px", padding: "6px 8px", background: "#faf5ff",
                border: "1px solid #c4b5fd", borderRadius: 3, fontSize: 8, fontFamily: "Arial",
                color: "#5b21b6", lineHeight: 1.5, fontStyle: "italic" }}>
                {stage.value.note}
              </div>
            </div>

          ) : (
            // ── Standard product value panel (S2, S3, S5A, S5B) ──
            <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>

          {/* Total value callout */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: "1px solid #dddddd" }}>
            <div style={{ padding: "14px 12px", borderRight: "1px solid #eeeeee", textAlign: "center" }}>
              <div style={{ fontSize: 9, fontFamily: "Arial", color: "#666", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Value / tonne DM</div>
              <div style={{ fontSize: 28, fontWeight: "bold", color: "#1a5530", fontFamily: "Arial" }}>${stage.value.totalDM}</div>
            </div>
            <div style={{ padding: "14px 12px", textAlign: "center" }}>
              <div style={{ fontSize: 9, fontFamily: "Arial", color: "#666", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Value / tonne Wet</div>
              <div style={{ fontSize: 28, fontWeight: "bold", color: "#1a3560", fontFamily: "Arial" }}>${stage.value.totalWet}</div>
              <div style={{ fontSize: 8, color: "#888", fontFamily: "Arial" }}>{stage.value.wetBasis}</div>
            </div>
          </div>

          {/* Quality badges */}
          <div style={{ padding: "10px 12px", borderBottom: "1px solid #eeeeee", display: "flex", flexWrap: "wrap", gap: 5 }}>
            {stage.value.badges.map((b, i) => (
              <div key={i} style={{
                background: b.color,
                color: "white",
                padding: "4px 8px",
                borderRadius: 3,
                fontSize: 9,
                fontFamily: "Arial",
                lineHeight: 1.4,
              }}>
                <div style={{ fontSize: 8, opacity: 0.8 }}>{b.label}</div>
                <div style={{ fontWeight: "bold" }}>{b.val}</div>
              </div>
            ))}
          </div>

          {/* Nutrient value table */}
          <div style={{ padding: "10px 12px 0", flex: 1 }}>
            <div style={{ fontSize: 9, fontFamily: "Arial", fontWeight: "bold", color: "#1a3560",
                          textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>
              Nutrient Replacement Value
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 9, fontFamily: "Arial" }}>
              <thead>
                <tr style={{ background: "#f0f0f0" }}>
                  <th style={{ textAlign: "left", padding: "4px 5px", color: "#333", borderBottom: "1px solid #ddd" }}>Nutrient</th>
                  <th style={{ textAlign: "right", padding: "4px 5px", color: "#333", borderBottom: "1px solid #ddd" }}>kg/t DM</th>
                  <th style={{ textAlign: "right", padding: "4px 5px", color: "#333", borderBottom: "1px solid #ddd" }}>Value</th>
                </tr>
              </thead>
              <tbody>
                {stage.value.nutrients.map((n, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                    <td style={{ padding: "4px 5px", color: "#222", borderBottom: "1px solid #f0f0f0" }}>{n.name}</td>
                    <td style={{ padding: "4px 5px", textAlign: "right", color: "#444", borderBottom: "1px solid #f0f0f0" }}>
                      {typeof n.kgPerT === "number" ? n.kgPerT.toFixed(1) : n.kgPerT}
                    </td>
                    <td style={{ padding: "4px 5px", textAlign: "right", fontWeight: "bold",
                                  color: n.name === "Nitrogen (N)" ? "#1a5530" : "#000",
                                  borderBottom: "1px solid #f0f0f0" }}>
                      ${n.val.toFixed(2)}
                    </td>
                  </tr>
                ))}
                <tr style={{ background: "#e8f4e8", borderTop: "2px solid #1a5530" }}>
                  <td colSpan={2} style={{ padding: "6px 5px", fontWeight: "bold", color: "#1a5530", fontSize: 10 }}>
                    TOTAL VALUE / t DM
                  </td>
                  <td style={{ padding: "6px 5px", textAlign: "right", fontWeight: "bold", color: "#1a5530", fontSize: 13 }}>
                    ${stage.value.totalDM}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Price basis */}
          <div style={{ padding: "10px 12px", margin: "10px 12px 12px", background: "#f0f5ff",
                        borderLeft: "3px solid #1a55cc", fontSize: 8.5, fontFamily: "Arial",
                        color: "#1a55cc", lineHeight: 1.5, fontStyle: "italic" }}>
            <strong>Price basis:</strong> Urea $350/t (N $0.761/kg) · TSP $550/t (P $2.740/kg) · MOP $400/t (K $0.553/kg) · OM $30/t
            <br />{stage.value.note}
          </div>

          {/* Comparison bar vs standard compost */}
          <div style={{ padding: "0 12px 14px" }}>
            <div style={{ fontSize: 9, fontFamily: "Arial", color: "#666", marginBottom: 5, textTransform: "uppercase", letterSpacing: 1 }}>
              vs Standard Compost ($30/t DM)
            </div>
            <div style={{ background: "#eeeeee", borderRadius: 3, height: 12, overflow: "hidden" }}>
              <div style={{
                background: stage.productColor,
                height: "100%",
                width: `${Math.min((stage.value.totalDM / 100) * 100, 100)}%`,
                borderRadius: 3,
                transition: "width 0.5s",
              }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 8.5, fontFamily: "Arial", marginTop: 3 }}>
              <span style={{ color: "#888" }}>$0</span>
              <span style={{ color: stage.productColor, fontWeight: "bold" }}>+{Math.round(((stage.value.totalDM - 30) / 30) * 100)}% vs standard</span>
              <span style={{ color: "#888" }}>$100</span>
            </div>
          </div>

            </div>
          )}
        </div>
      </div>

      {/* ── FOOTER NOTE ── */}
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "10px 20px 0", fontSize: 8.5,
                    fontFamily: "Arial", color: "#888", borderTop: "1px solid #ddd", marginTop: 4 }}>
        All lab values PhD-verified. Nutrient replacement values at Indonesian market prices March 2026.
        Cellulase assay: DNS method (dinitrosalicylic acid) per standard carboxymethylcellulase protocol.
        CFI Bioconversion Project — Confidential.
      </div>
    </div>
  );
}
