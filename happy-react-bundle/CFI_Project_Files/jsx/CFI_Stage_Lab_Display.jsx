import { useState } from "react";

// ── EXACT FORMAT from EFB Lab Analysis tab ─────────────────────────────────
// Each stage has: title, subtitle, sections (with section headers + rows)
// Each row: [parameter, typicalValue, range, unit, method, reference]
// Section header rows have only the first cell filled → rendered as full-width divider

const STAGES = [
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
  const [activeStage, setActiveStage] = useState("s3");
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

          {/* Column headers */}
          <div style={{ display: "grid", gridTemplateColumns: COL_WIDTHS.join(" "), background: "#1a3560" }}>
            {COL_HEADERS.map((h, i) => (
              <div key={i} style={{
                color: "#ffffff", fontSize: 9, fontFamily: "Arial", fontWeight: "bold",
                padding: "7px 8px", borderRight: i < COL_HEADERS.length - 1 ? "1px solid #2a4a80" : "none",
                textTransform: "uppercase", letterSpacing: 0.5
              }}>{h}</div>
            ))}
          </div>

          {/* Rows */}
          {stage.rows.map((row, i) => {
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
          })}
        </div>

        {/* ── RIGHT: PRODUCT VALUE PANEL ── */}
        <div style={{ background: "#ffffff", borderLeft: "2px solid #dddddd", display: "flex", flexDirection: "column" }}>

          {/* Product title */}
          <div style={{ background: stage.productColor, padding: "14px 16px" }}>
            <div style={{ color: "#f5c842", fontSize: 9, fontFamily: "Arial", letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>
              PRODUCT VALUE
            </div>
            <div style={{ color: "#ffffff", fontSize: 14, fontWeight: "bold", lineHeight: 1.3 }}>
              {stage.product}
            </div>
            <div style={{ color: "#f5c842", fontSize: 9, fontFamily: "Arial", marginTop: 4, lineHeight: 1.4 }}>
              {stage.tagline}
            </div>
          </div>

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
