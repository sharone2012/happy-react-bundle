import { useState } from "react";

// ── COLOUR PALETTE ─────────────────────────────────────────────────────────
const C = {
  navy: "#0a1628", navyMid: "#1a3560", navyLight: "#2a4a80",
  gold: "#c47d00", goldLight: "#f5c842", goldPale: "#fff8e8",
  green: "#1a5530", greenPale: "#eaf7f0",
  pastelGreen: "#c8ddc8",
  brown: "#6b2a00", brownPale: "#fdf0e8",
  amber: "#7a5500", amberPale: "#fff3d0",
  red: "#b00020", redPale: "#fdf0ee",
  slate: "#f5f5f0", white: "#ffffff",
  text: "#1a1a1a", muted: "#666666", faint: "#999999",
};

// ── LAB DATA — ALL 4 STAGES ─────────────────────────────────────────────────
const STAGES = [
  {
    id:"s2", label:"Stage 2", product:"COMPOST+", color:C.navyMid,
    tagline:"Post-Chemical Treatment — PKSA Alkaline",
    rows:[
      {s:"PHYSICAL PROPERTIES"},
      ["Moisture (output)","58–65%","55–68%","% wb","Gravimetric 105°C","AOAC 930.15"],
      ["Bulk density","220–280","200–320","kg/m³","Direct measurement","Field data"],
      ["Particle size","2 mm","1.5–3.0","mm","Sieve analysis","CFI Protocol"],
      ["pH (after neutralisation)","6.5–8.0","6.5–8.5","pH","pH meter","CFI Stage 2 spec"],
      {s:"PROXIMATE ANALYSIS (% DM)"},
      ["Ash","9.6%","8–12%","% DM","AOAC 942.05","Standard method"],
      ["Crude Protein (N×6.25)","10.6%","9–13%","% DM","AOAC 984.13","N×6.25"],
      ["Crude Fat","5.9%","5–8%","% DM","AOAC 920.39","Soxhlet"],
      ["Crude Fiber","52–58%","48–62%","% DM","AOAC 962.09","Reduced post-treatment"],
      {s:"FIBER FRACTIONS (% DM)"},
      ["NDF","70–76%","65–80%","% DM","AOAC 2002.04","Van Soest"],
      ["ADF","48–55%","44–60%","% DM","AOAC 973.18","Van Soest"],
      ["ADL (Lignin)","16.6–17.8%","15–20%","% DM","72% H₂SO₄","PKSA reduced 30–35%"],
      ["Cellulose (accessible)","35–38%","32–42%","% DM","By difference","ADF−ADL ↑ after PKSA"],
      ["Hemicellulose","19–22%","16–26%","% DM","By difference","NDF−ADF"],
      {s:"ELEMENTAL ANALYSIS (% DM)"},
      ["Carbon (C)","44–46%","42–48%","% DM","CHNS Analyser","Standard"],
      ["Nitrogen (N)","1.60–1.80%","1.4–2.0%","% DM","CHNS/Kjeldahl","N analysis"],
      ["Potassium (K)","0.78–0.82%","0.70–0.95%","% DM","ICP-OES","PKSA contribution"],
      ["Phosphorus (P)","0.12%","0.10–0.15%","% DM","ICP-OES","Standard"],
      ["Calcium (Ca)","0.12%","0.09–0.16%","% DM","ICP-OES","Standard"],
      ["Magnesium (Mg)","0.10%","0.08–0.14%","% DM","ICP-OES","Standard"],
      ["C:N Ratio","22–28","20–32","Ratio","Calculated","Improved from 32 (blend input)"],
      {s:"BIOLOGICAL ACTIVITY"},
      ["Cellulase activity","5–12 U/g","4–14 U/g","U/g","DNS assay","Lignin barrier removed"],
      ["Microbial biomass C","+30–50% vs raw","—","Relative","Fumigation extraction","Recovery post-alkali"],
      ["pH buffer capacity","Moderate","—","Qualitative","Titration","PKSA carbonate residue"],
      {s:"BSF READINESS GATES"},
      ["BSF suitability post-S2","3/5 — FAIR","—","Score","Assessment","Ready after S3 inoculation"],
      ["Lignin barrier status","REDUCED","30–35% less","Qualitative","ADL method","Zhu et al 2010"],
      ["pH suitability for BSF","PASS ✓","6.5–8.0","Gate check","pH meter","BSF gate requirement"],
    ],
    value:{ dm:48.92, wet:17.12, wetNote:"65% moisture",
      rows:[
        {n:"Nitrogen (N)",pct:"1.70%",kg:17.0,price:"$0.761/kg N",val:12.94},
        {n:"Phosphorus (P)",pct:"0.12%",kg:1.2,price:"$2.740/kg P",val:3.29},
        {n:"Potassium (K)",pct:"0.80%",kg:8.0,price:"$0.553/kg K",val:4.42},
        {n:"Calcium (Ca)",pct:"0.12%",kg:1.2,price:"$0.204/kg Ca",val:0.24},
        {n:"Magnesium (Mg)",pct:"0.10%",kg:1.0,price:"$1.029/kg Mg",val:1.03},
        {n:"Organic Matter (90%)",pct:"900 kg/t",kg:900,price:"$0.030/kg OM",val:27.00},
      ],
      note:"PKSA cost $0.00 (mill waste default).",
      badges:[
        {l:"Cellulase",v:"5–12 U/g",c:C.navyMid},{l:"Lignin −30–35%",v:"ADL reduced",c:C.green},
        {l:"pH",v:"6.5–8.0",c:C.amber},{l:"C:N",v:"22–28",c:C.navyMid},
      ]
    }
  },
  {
    id:"s3", label:"Stage 3", product:"BIO-COMPOST+", color:C.green,
    tagline:"Post-Biological Treatment — Wave 1 Inoculation (Cellulolytic + Ligninolytic Consortium)",
    rows:[
      {s:"PHYSICAL PROPERTIES"},
      ["Moisture (output)","45–60%","40–65%","% wb","Gravimetric 105°C","AOAC 930.15"],
      ["Bulk density (matured)","380–480","350–550","kg/m³","Direct measurement","Post Wave 1 — 5d minimum"],
      ["Particle structure","Aggregated","Crumb-like","Qualitative","Visual/sieve","Fungal hyphae binding (Wave 1)"],
      ["pH (final)","6.5–7.5","6.0–8.0","pH","pH meter","Wave 1 — Wave 2 not yet fired"],
      {s:"PROXIMATE ANALYSIS (% DM)"},
      ["Crude Protein (N×6.25)","12.5–13.8%","11–16%","% DM","AOAC 984.13","Microbial biomass protein"],
      ["Humic Acid content","8–15%","6–18%","% DM","Humic acid extraction","Thermophilic formation"],
      ["Fulvic Acid content","5–10%","4–12%","% DM","Fulvic extraction","Labile humic fraction"],
      {s:"FIBER FRACTIONS (% DM)"},
      ["NDF","60–68%","55–72%","% DM","AOAC 2002.04","Reduced vs S2 by microbial digestion"],
      ["ADF","40–48%","36–52%","% DM","AOAC 973.18","Van Soest"],
      ["ADL (Lignin)","14–16%","12–18%","% DM","72% H₂SO₄","Further microbial reduction"],
      ["Cellulose (accessible)","36–40%","32–44%","% DM","ADF−ADL","Peak accessibility"],
      {s:"ELEMENTAL ANALYSIS (% DM)"},
      ["Nitrogen (N)","1.80–2.20%","1.6–2.5%","% DM","CHNS/Kjeldahl","N mineralisation ↑"],
      ["Potassium (K)","0.80–0.90%","0.75–1.00%","% DM","ICP-OES","Maintained + PKSA"],
      ["Phosphorus (P)","0.13–0.18%","0.12–0.22%","% DM","ICP-OES","P-solubilising bacteria ↑"],
      ["Calcium (Ca)","0.13%","0.10–0.17%","% DM","ICP-OES","Maintained"],
      ["Magnesium (Mg)","0.10%","0.08–0.14%","% DM","ICP-OES","Maintained"],
      ["C:N Ratio","18–25","16–28","Ratio","Calculated","Optimal — improved from 22–28"],
      {s:"BIOLOGICAL ACTIVITY ★ PEAK STAGE — WAVE 1 ONLY"},
      ["Cellulase (CMCase/FPase)","20–35 U/g ★","18–40 U/g","U/g","DNS/FPase assay","Plant & Soil Dec 2025"],
      ["Xylanase activity","12–22 U/g","10–26 U/g","U/g","DNS xylan assay","PLOS ONE Aug 2025"],
      ["Urease activity","+150–200%","vs baseline","Relative %","Colorimetric","Kibblewhite et al 2008"],
      ["Phosphatase activity","+120–180%","vs baseline","Relative %","p-Nitrophenol method","Kibblewhite et al 2008"],
      ["N-fixing bacteria (Azotobacter)","10⁷–10⁸ CFU/g","10⁶–10⁹","CFU/g","Plate count","Wave 1 — Frontiers Microbiology 2026"],
      ["PSB (P-solubilising bacteria)","10⁶–10⁷ CFU/g","10⁵–10⁸","CFU/g","Pikovskaya agar","Wave 1 — Frontiers Plant Science 2025"],
      ["Wave 2 status","NOT YET FIRED","Temp gate <50°C req.","Gate","Temperature sensor","Wave 2 protects N-fixing bacteria"],
      ["Cellulase persistence (soil)","3–6 months","2–8 months","Months","Soil enzyme assay","ScienceDirect 2024"],
      {s:"COMPOST CERTIFICATION FLAGS"},
      ["Compost maturity (GI test)",">80% germination","—","% GI","Germination index","CCQC 2001"],
      ["Salmonella","Not detected","ND","per 25g","ISO 6579","Certification req."],
      ["E. coli","< 1000 MPN/g","—","MPN/g","ISO 9308","EU compost standard"],
      ["Pathogen suppression","Confirmed","—","Qualitative","Bioassay","Trichoderma activity"],
    ],
    value:{ dm:71.43, wet:32.14, wetNote:"55% moisture",
      rows:[
        {n:"Nitrogen (N)",pct:"2.00%",kg:20.0,price:"$0.761/kg N",val:15.22},
        {n:"Phosphorus (P)",pct:"0.15%",kg:1.5,price:"$2.740/kg P",val:4.11},
        {n:"Potassium (K)",pct:"0.85%",kg:8.5,price:"$0.553/kg K",val:4.70},
        {n:"Calcium (Ca)",pct:"0.13%",kg:1.3,price:"$0.204/kg Ca",val:0.27},
        {n:"Magnesium (Mg)",pct:"0.10%",kg:1.0,price:"$1.029/kg Mg",val:1.03},
        {n:"Organic Matter (87%)",pct:"870 kg/t",kg:870,price:"$0.030/kg OM",val:26.10},
        {n:"Biological Activity Premium",pct:"—",kg:"—",price:"Wave 1 active consortium",val:20.00},
      ],
      note:"Wave 1 inoculation only. Wave 2 (N-fixing, temperature-gated) fires in S3 continued or S4 handoff. Biological premium $20/t conservative.",
      badges:[
        {l:"Cellulase ★ PEAK",v:"20–35 U/g",c:C.gold},{l:"Xylanase",v:"12–22 U/g",c:C.green},
        {l:"Wave 1 only",v:"Wave 2 pending",c:C.amber},{l:"C:N",v:"18–25",c:C.green},
      ]
    }
  },
  {
    id:"s5a", label:"Stage 5A", product:"BIO-FERTILISER+", color:"#1a6040",
    tagline:"BSF Extracted — Frass — Highest Microbial Diversity",
    rows:[
      {s:"PHYSICAL PROPERTIES"},
      ["Moisture (output)","20–30%","15–35%","% wb","Gravimetric 105°C","AOAC 930.15"],
      ["Bulk density","480–620","420–700","kg/m³","Direct measurement","Frass product"],
      ["Texture","Fine crumble","—","Qualitative","Visual","BSF-processed substrate"],
      ["Colour","Dark brown","—","Qualitative","Visual","Humified frass"],
      {s:"PROXIMATE ANALYSIS (% DM)"},
      ["Ash","18–24%","14–28%","% DM","AOAC 942.05","Mineral concentration — BSF removed organics"],
      ["Crude Protein (N×6.25)","15–22%","12–26%","% DM","AOAC 984.13","Frass protein — high bioavailability"],
      ["Crude Fat","3–7%","2–9%","% DM","AOAC 920.39","BSF consumed most lipid"],
      ["Chitin (residual)","0.5–1.5%","0.3–2.0%","% DM","Enzymatic/chemical","Lower than S5B — larvae removed"],
      {s:"FIBER FRACTIONS (% DM)"},
      ["NDF","28–38%","24–44%","% DM","AOAC 2002.04","Reduced — BSF digestion complete"],
      ["ADF","18–26%","14–30%","% DM","AOAC 973.18","Highly digested"],
      ["ADL (Lignin)","9–12%","7–14%","% DM","72% H₂SO₄","Lowest lignin of all stages"],
      {s:"ELEMENTAL ANALYSIS (% DM)"},
      ["Nitrogen (N)","2.5–3.5%","2.0–4.0%","% DM","CHNS/Kjeldahl","Frass N — high plant availability"],
      ["Nitrate-N (NO₃⁻-N)","0.3–0.8%","0.2–1.0%","% DM","Ion chromatography","Immediately plant-available"],
      ["Ammonium-N (NH₄⁺-N)","0.4–1.0%","0.3–1.2%","% DM","Distillation","CEC-retained — slower release"],
      ["Phosphorus (P)","0.30–0.55%","0.25–0.65%","% DM","ICP-OES","BSF gut solubilisation 2–3× input"],
      ["Potassium (K)","0.90–1.20%","0.80–1.40%","% DM","ICP-OES","Concentrated K"],
      ["Calcium (Ca)","0.80–1.50%","0.60–1.80%","% DM","ICP-OES","Frass Ca"],
      ["Magnesium (Mg)","0.15–0.22%","0.12–0.28%","% DM","ICP-OES","Maintained"],
      ["C:N Ratio","12–18","10–22","Ratio","Calculated","Optimal for N synchrony with palm roots"],
      {s:"BIOLOGICAL ACTIVITY"},
      ["Cellulase activity","8–18 U/g","6–22 U/g","U/g","DNS assay","Humus-enzyme complex"],
      ["Total microbial biomass","10⁹–10¹⁰ CFU/g","—","CFU/g","16S rRNA","BSF gut microbiome release"],
      ["BSF gut species diversity","1,000s of species","—","Qualitative","Metagenomics","Jeon et al 2011"],
      ["P-solubilising bacteria","10⁷–10⁸ CFU/g","—","CFU/g","Pikovskaya agar","Liu et al 2008"],
      ["N-fixing bacteria","10⁷–10⁸ CFU/g","—","CFU/g","Plate count","Frontiers Microbiology 2026"],
      {s:"LONG-TERM SOIL BUILDING"},
      ["Organic Matter (% DM)","72–82%","68–86%","% DM","Loss on ignition","Well-humified fraction"],
      ["Humic Acid content","10–18%","8–22%","% DM","Humic extraction","Higher than S3 — further matured"],
      ["CEC contribution","+3 meq/100g / 1% SOM","—","meq/100g","Ammonium acetate","Lal 2004 Science"],
      ["pH","7.5–8.5","7.0–9.0","pH","pH meter","Alkaline — neutralises acid soils"],
      ["N leaching reduction","34–40%","vs mineral N","% reduction","Field trials","Xia et al 2021"],
    ],
    value:{ dm:79.95, wet:59.96, wetNote:"25% moisture (dried)",
      rows:[
        {n:"Nitrogen (N)",pct:"3.00%",kg:30.0,price:"$0.761/kg N",val:22.83},
        {n:"Phosphorus (P)",pct:"0.42%",kg:4.2,price:"$2.740/kg P",val:11.51},
        {n:"Potassium (K)",pct:"1.05%",kg:10.5,price:"$0.553/kg K",val:5.81},
        {n:"Calcium (Ca)",pct:"1.15%",kg:11.5,price:"$0.204/kg Ca",val:2.35},
        {n:"Magnesium (Mg)",pct:"0.18%",kg:1.8,price:"$1.029/kg Mg",val:1.85},
        {n:"Organic Matter (77%)",pct:"770 kg/t",kg:770,price:"$0.030/kg OM",val:23.10},
        {n:"Microbial diversity premium",pct:"—",kg:"—",price:"BSF gut inoculum (conservative)",val:12.50},
      ],
      note:"Best long-term soil builder. Optimal for Ultisols (P fixation) and acid Oxisols.",
      badges:[
        {l:"Microbial diversity ★",v:"10¹⁰ CFU/g",c:"#1a6040"},{l:"P solubilised",v:"2–3× input",c:C.navyMid},
        {l:"Cellulase",v:"8–18 U/g",c:C.gold},{l:"N leach reduction",v:"34–40%",c:"#1a6040"},
      ]
    }
  },
  {
    id:"s5b", label:"Stage 5B", product:"BIO-FERTILISER+ PROTEIN", color:C.brown,
    tagline:"BSF Terminated In-Substrate — Highest N Product",
    rows:[
      {s:"PHYSICAL PROPERTIES"},
      ["Moisture (output)","25–35%","20–40%","% wb","Gravimetric 105°C","AOAC 930.15"],
      ["Bulk density","550–700","480–800","kg/m³","Direct measurement","Dense product"],
      ["Colour","Dark brown/black","—","Qualitative","Visual","High OM humification"],
      {s:"PROXIMATE ANALYSIS (% DM)"},
      ["Ash","22–28%","18–32%","% DM","AOAC 942.05","Insect cuticle + mineral concentration"],
      ["Crude Protein (N×6.25)","22–35%","18–38%","% DM","AOAC 984.13","BSF larval protein included"],
      ["Crude Fat","8–15%","6–18%","% DM","AOAC 920.39","Larval lipid fraction"],
      ["Chitin","3–6%","2–8%","% DM","Enzymatic/chemical","Nematode suppression"],
      {s:"ELEMENTAL ANALYSIS (% DM)"},
      ["Nitrogen (N)","3.5–5.0% ★","3.0–5.5%","% DM","CHNS/Kjeldahl","HIGHEST — frass + larval N combined"],
      ["Phosphorus (P)","0.40–0.70%","0.35–0.80%","% DM","ICP-OES","BSF gut bioavailability ↑"],
      ["Potassium (K)","1.00–1.30%","0.90–1.50%","% DM","ICP-OES","Concentrated by BSF"],
      ["Calcium (Ca)","2.0–4.0%","1.5–5.0%","% DM","ICP-OES","Insect cuticle — bone meal equivalent"],
      ["Magnesium (Mg)","0.20–0.30%","0.15–0.35%","% DM","ICP-OES","Concentrated"],
      ["C:N Ratio","8–14","6–16","Ratio","Calculated","Low — N-flush risk on Spodosols"],
      {s:"FIBER FRACTIONS (% DM)"},
      ["NDF","32–42%","28–48%","% DM","AOAC 2002.04","Greatly reduced vs input"],
      ["ADF","22–30%","18–35%","% DM","AOAC 973.18","BSF digestion ↓"],
      ["ADL (Lignin)","10–14%","8–16%","% DM","72% H₂SO₄","BSF + microbial reduction"],
      {s:"BIOLOGICAL ACTIVITY"},
      ["Cellulase activity","10–20 U/g","8–24 U/g","U/g","DNS assay","Residual humus-enzyme complexes"],
      ["BSF gut microbiome","10⁹–10¹⁰ CFU/g","—","CFU/g","16S rRNA","Jeon et al 2011"],
      ["Chitin-induced chitinase","Elevated","—","Qualitative","Enzyme assay","Nematode suppression trigger"],
      {s:"AGRONOMIC APPLICATION NOTES"},
      ["N application rate","Reduce 30%","vs standard","Advisory","N:K balance","Low C:N — split application"],
      ["Soil type caution","Spodosols","Split apply","Advisory","Leaching risk","NO₃⁻ leaching on sandy soils"],
      ["pH","7.0–8.5","6.5–9.0","pH","pH meter","Alkaline — benefits acid soils"],
    ],
    value:{ dm:91.08, wet:63.76, wetNote:"30% moisture (dried)",
      rows:[
        {n:"Nitrogen (N)",pct:"4.20%",kg:42.0,price:"$0.761/kg N",val:31.96},
        {n:"Phosphorus (P)",pct:"0.55%",kg:5.5,price:"$2.740/kg P",val:15.07},
        {n:"Potassium (K)",pct:"1.15%",kg:11.5,price:"$0.553/kg K",val:6.36},
        {n:"Calcium (Ca)",pct:"3.00%",kg:30.0,price:"$0.204/kg Ca",val:6.12},
        {n:"Magnesium (Mg)",pct:"0.25%",kg:2.5,price:"$1.029/kg Mg",val:2.57},
        {n:"Organic Matter (70%)",pct:"700 kg/t",kg:700,price:"$0.030/kg OM",val:21.00},
        {n:"Chitin bio-control premium",pct:"4%",kg:40,price:"Nematode suppression",val:8.00},
      ],
      note:"Apply at reduced rate on Spodosols. Split application recommended. Highest N product.",
      badges:[
        {l:"Nitrogen ★ HIGHEST",v:"3.5–5.0%",c:C.brown},{l:"Calcium (bone equiv.)",v:"2.0–4.0%",c:C.navyMid},
        {l:"Chitin",v:"3–6% DM",c:C.green},{l:"Cellulase",v:"10–20 U/g",c:C.gold},
      ]
    }
  },
];

// ── SYNTHETIC COMPARISON DATA ───────────────────────────────────────────────
// Per tonne DM of CFI product vs equivalent synthetic programme
const SYNTH = [
  {
    product:"BIO-COMPOST+",stageId:"s3",color:C.green,
    equiv:[
      {fert:"Urea (46% N)",dose:"43 kg",cost:"$15.10",provides:"20 kg N"},
      {fert:"TSP (46% P₂O₅)",dose:"7.1 kg",cost:"$3.55",provides:"3.45 kg P₂O₅ → 1.5 kg P"},
      {fert:"MOP (60% K₂O)",dose:"17 kg",cost:"$6.80",provides:"10.2 kg K₂O → 8.5 kg K"},
      {fert:"Kieserite (25% Mg)",dose:"4 kg",cost:"$1.12",provides:"1.0 kg Mg"},
      {fert:"Dolomite (liming)",dose:"250 kg",cost:"$12.50",provides:"pH correction"},
      {fert:"Humic acid supplement",dose:"10 kg",cost:"$35.00",provides:"CEC + P mobility"},
      {fert:"PSB inoculant",dose:"1 application",cost:"$30.00",provides:"P solubilisation"},
      {fert:"N-fixing inoculant",dose:"1 application",cost:"$20.00",provides:"N fixation 20–40 kg N/ha equiv."},
    ],
    synthTotal: 124.07,
    cfiValue: 71.43,
    note:"CFI BIO-COMPOST+ delivers all of the above in ONE product. Biological components are active and self-sustaining in the soil.",
  },
  {
    product:"BIO-FERTILISER+ (S5A)",stageId:"s5a",color:"#1a6040",
    equiv:[
      {fert:"Urea (46% N)",dose:"65 kg",cost:"$22.75",provides:"30 kg N"},
      {fert:"TSP (46% P₂O₅)",dose:"20 kg",cost:"$11.00",provides:"9.2 kg P₂O₅ → 4.2 kg P (stated)"},
      {fert:"  + P-fixation premium",dose:"(2–3× effective P)",cost:"+$22.00",provides:"BSF gut solubilisation unlocks 2–3× P — equivalent to 8–12 kg P from TSP"},
      {fert:"MOP (60% K₂O)",dose:"21 kg",cost:"$8.40",provides:"12.6 kg K₂O → 10.5 kg K"},
      {fert:"Ag Lime/Dolomite",dose:"250 kg",cost:"$12.50",provides:"pH 7.5–8.5 correction"},
      {fert:"PSB inoculant",dose:"1 application",cost:"$30.00",provides:"P solubilisation"},
      {fert:"N-fixing inoculant",dose:"1 application",cost:"$20.00",provides:"N fixation"},
      {fert:"Humic acid supplement",dose:"10 kg",cost:"$35.00",provides:"CEC + humic fraction"},
    ],
    synthTotal: 161.65,
    cfiValue: 79.95,
    note:"The 2–3× P effectiveness advantage on Ultisol is not available from any single synthetic product. PSB consortium provides this continuously for 3–6 months.",
  },
  {
    product:"BIO-FERTILISER+ PROTEIN (S5B)",stageId:"s5b",color:C.brown,
    equiv:[
      {fert:"Urea (46% N)",dose:"91 kg",cost:"$31.85",provides:"42 kg N"},
      {fert:"TSP (46% P₂O₅)",dose:"26 kg",cost:"$14.30",provides:"12 kg P₂O₅ → 5.5 kg P"},
      {fert:"MOP (60% K₂O)",dose:"23 kg",cost:"$9.20",provides:"13.8 kg K₂O → 11.5 kg K"},
      {fert:"Gypsum/Ca supplement",dose:"148 kg",cost:"$11.84",provides:"30 kg Ca equivalent"},
      {fert:"Kieserite (25% Mg)",dose:"10 kg",cost:"$2.80",provides:"2.5 kg Mg"},
      {fert:"Chitin hydrolysate (bio-control)",dose:"40 kg",cost:"$80.00+",provides:"Nematode suppression (high-cost specialty)"},
      {fert:"Ag Lime/Dolomite",dose:"250 kg",cost:"$12.50",provides:"pH correction"},
    ],
    synthTotal: 162.49,
    cfiValue: 91.08,
    note:"Chitin as a standalone soil input is a premium specialty product — $2/kg+. CFI S5B delivers chitin at zero additional cost as part of the substrate.",
  },
];

// ── SOIL VALUE DATA ─────────────────────────────────────────────────────────
const SOILS = [
  {
    id:"ultisol", name:"Ultisols", cover:"24%", ph:"4.5",
    color:C.navyMid, colorLight:"#e8f0ff",
    cec:"8.2 meq/100g", baseSat:"22%",
    challenge:"High Al/Fe oxide content fixes 75% of applied TSP immediately. N leaches 40% on sandy sub-horizons. Low base saturation depletes K.",
    pFix:75, nLeach:40, kLoss:20,
    cfiProduct:"BIO-FERTILISER+ (S5A)",
    cfiWhy:"PSB at 10⁷–10⁸ CFU/g solubilises Al/Fe-fixed P, unlocking 2–3× effective P per tonne. Alkaline pH (7.5–8.5) corrects acidity. Organic N reduces leaching 34–40%. CEC building from OM adds K retention capacity.",
    syntheticLoss:"$68/ha/yr in TSP spend fixed and unavailable. 40% of Urea N lost to leaching.",
    cfiGain:"Effective P delivery equivalent to 2–3× TSP at same dose. N loss cut 34–40%. pH moved toward optimal 5.5–6.5.",
    estHa:"535,000 ha", priority:"P1 — HIGHEST PRIORITY",
  },
  {
    id:"inceptisol", name:"Inceptisols", cover:"39%", ph:"4.1",
    color:"#b06000", colorLight:"#fff5e8",
    cec:"15.4 meq/100g", baseSat:"45%",
    challenge:"Best fertility soil but still acid (pH 4.1). P fixation 30%. N leaching moderate 20%. Highest palm productivity potential — small agronomic improvements have large yield impact.",
    pFix:30, nLeach:20, kLoss:10,
    cfiProduct:"BIO-COMPOST+ (S3)",
    cfiWhy:"Already best-performing soil — biological uplift from cellulase (20–35 U/g), N-fixers (10⁸ CFU/g) and PSB converts this soil to top-tier performance. Humic acids (8–15% DM) build long-term CEC on already-good base.",
    syntheticLoss:"$27/ha/yr in TSP spend fixed. 20% of Urea N lost to leaching.",
    cfiGain:"Yield uplift from biological activity on already-productive soil. RSPO certification support through reduced chemical input.",
    estHa:"852,000 ha", priority:"P1 — LARGEST MARKET BY AREA",
  },
  {
    id:"oxisol", name:"Oxisols", cover:"8%", ph:"4.4",
    color:C.red, colorLight:"#fdf0ee",
    cec:"4.1 meq/100g", baseSat:"12%",
    challenge:"Extreme Fe/Al oxide content. P fixation 85% — highest of all soil types. Very low CEC means K, Ca, Mg rapidly leached. Hardpan formation on subsoil. Structural intervention required alongside nutrition.",
    pFix:85, nLeach:45, kLoss:35,
    cfiProduct:"BIO-FERTILISER+ (S5A) — doubled application rate",
    cfiWhy:"85% P fixation means synthetic TSP is almost worthless without PSB intervention. Organic matter from CFI S5A builds CEC from near-zero base. Alkaline pH corrects acidity. Chitin residue suppresses nematodes common on Fe-rich soils.",
    syntheticLoss:"$77/ha/yr in TSP spend fixed and unavailable. 45% of Urea N lost. K must be split-applied every 6 weeks.",
    cfiGain:"PSB provides the only practical pathway to P availability. Each 1% OM added builds +3 meq/100g CEC — critical on base-depleted Oxisols.",
    estHa:"174,000 ha", priority:"P2 — HIGHEST INDIVIDUAL IMPACT PER HA",
  },
  {
    id:"histosol", name:"Histosols (Peat)", cover:"7%", ph:"3.8",
    color:"#5a3800", colorLight:"#fff8e8",
    cec:"25–60 meq/100g", baseSat:"<10%",
    challenge:"pH 3.8 most acidic. High organic C (24.5%) immobilises N for years. K and micronutrients flush rapidly on drainage. Subsidence and waterlogging management required. Cu/Zn deficiency structurally endemic.",
    pFix:20, nLeach:25, kLoss:55,
    cfiProduct:"BIO-FERTILISER+ PROTEIN (S5B)",
    cfiWhy:"High Ca content (2–4% DM) provides sustained pH correction. Cu/Zn from BSF cuticle addresses endemic deficiency without separate micronutrient application. Chitin suppresses peat fungal pathogens. REDUCE N rate by 30% on Histosols — organic N already high.",
    syntheticLoss:"55% of K₂O flushed through drainage. Cu/Zn must be added as separate application ($15–25/ha extra).",
    cfiGain:"Ca + Cu + Zn + pH correction + K slow-release in one product. Eliminates separate micronutrient programme.",
    estHa:"153,000 ha", priority:"P2 — UNIQUE PRODUCT FIT (Ca/Zn/Cu)",
  },
  {
    id:"spodosol", name:"Spodosols", cover:"<5%", ph:"4.77",
    color:"#444444", colorLight:"#f5f5f5",
    cec:"2.1 meq/100g", baseSat:"8%",
    challenge:"Lowest fertility of all soil types. Sandy texture — almost zero CEC. N leaching 55% — worst of all soils. P fixation low (10%) but P doesn't stay long. Yield 31% below Ultisol baseline. Structural low-productivity constraint.",
    pFix:10, nLeach:55, kLoss:50,
    cfiProduct:"BIO-FERTILISER+ (S5A) — with N reduction",
    cfiWhy:"CEC building from OM is the only long-term answer on Spodosols. Each 1% SOM added at +3 meq/100g CEC is transformative on a 2.1 baseline. N leaching reduction 34–40% directly addresses the primary productivity constraint. WARNING: S5B high N product is unsuitable — C:N 8–14 drives NO₃⁻ flush on sandy profile.",
    syntheticLoss:"55% of Urea N leaches. 50% of K₂O lost. Effectively paying $0.45 for every $1 of synthetic fertiliser applied.",
    cfiGain:"N leaching reduction + CEC building = compound yield improvement over 3–5 seasons. Single most transformative soil type agronomically.",
    estHa:"<100,000 ha", priority:"P3 — SMALL AREA BUT HIGH AGRONOMIC IMPACT",
  },
];

// ── HELPERS ─────────────────────────────────────────────────────────────────
const ColW = ["28%","12%","11%","8%","21%","20%"];
const ColH = ["Parameter","Typical Value","Range","Unit","Analytical Method","Reference"];

function Bar({ pct, color, label }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display:"flex", justifyContent:"space-between", fontSize: 9, fontFamily:"monospace", marginBottom:3, color:C.muted }}>
        <span>{label}</span><span style={{ color, fontWeight:"bold" }}>{pct}%</span>
      </div>
      <div style={{ background:"#e8e8e8", borderRadius:2, height:8, overflow:"hidden" }}>
        <div style={{ background:color, height:"100%", width:`${pct}%`, borderRadius:2, transition:"width 0.6s" }} />
      </div>
    </div>
  );
}

// ── MAIN COMPONENT ─────────────────────────────────────────────────────────
export default function CFILabDisplay() {
  const [topTab, setTopTab] = useState("lab"); // lab | synth | soil
  const [stageId, setStageId] = useState("s3");
  const [soilId, setSoilId] = useState("ultisol");
  const [synthIdx, setSynthIdx] = useState(0);

  const stage = STAGES.find(s => s.id === stageId);
  const soil = SOILS.find(s => s.id === soilId);
  const synth = SYNTH[synthIdx];

  return (
    <div style={{ fontFamily:"'Georgia', serif", background:C.slate, minHeight:"100vh", padding:"0 0 40px 0" }}>

      {/* ── TOP HEADER ─────────────────────────────────────────────────── */}
      <div style={{ background:C.navy, padding:"16px 28px 12px", borderBottom:`1px solid #3a5a80` }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div>
            <div style={{ color:C.white, fontSize:11, letterSpacing:3, fontFamily:"Arial", fontWeight:"bold", textTransform:"uppercase", marginBottom:3 }}>
              CIRCULAR FERTILISER INDUSTRIES
            </div>
            <div style={{ color:C.white, fontSize:17, fontWeight:"bold", letterSpacing:0.5 }}>
              Lab Analysis, Synthetic Comparison &amp; Soil Value Report
            </div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ color:C.white, fontSize:13, fontFamily:"Arial", fontWeight:"bold" }}>Market Prices March 2026</div>
          </div>
        </div>
      </div>

      {/* ── TOP-LEVEL TABS ─────────────────────────────────────────────── */}
      <div style={{ background:"#2e5f8a", display:"flex", borderBottom:`2px solid ${C.gold}`, alignItems:"stretch" }}>

        {/* CHOOSE ONE instruction box */}
        <div style={{ background:C.pastelGreen, padding:"5px 14px", display:"flex", flexDirection:"column", minHeight:52, width:118, flexShrink:0,
          justifyContent:"center", alignItems:"center", borderRight:`2px solid #40c8c8`, minWidth:90 }}>
          <div style={{ fontSize:11, fontWeight:"bold", color:C.navy, fontFamily:"Arial", letterSpacing:0.5 }}>CHOOSE ONE</div>
          <div style={{ fontSize:11, color:C.navy, fontFamily:"Arial", fontWeight:"normal", letterSpacing:0, margin:"1px 0 0px" }}>─────▶</div>
          
        </div>

        {[
          {id:"lab", label:"LAB ANALYSIS"},
          {id:"value", label:"VALUE CREATION"},
          {id:"synth", label:"REPLACEMENT COST"},
          {id:"soil", label:"VALUE BY SOIL"},
        ].map((t, i, arr) => (
          <div key={t.id} style={{ display:"flex", alignItems:"stretch" }}>
            <button onClick={() => setTopTab(t.id)} style={{
              padding:"13px 28px",
              background: "transparent",
              color: C.white,
              border:"none",
              cursor:"pointer", fontFamily:"Arial",
              transition:"all 0.2s",
            }}>
              <div style={{
                fontSize:12, fontWeight:"bold", letterSpacing:0.5,
                border: topTab===t.id ? `2px solid #40c8c8` : "2px solid transparent",
                borderRadius:3,
                padding:"5px 12px",
                transition:"all 0.2s",
              }}>{t.label}</div>
            </button>
            {i < arr.length - 1 && (
              <div style={{ width:2, background:"#40c8c8", margin:"14px 0", alignSelf:"stretch" }} />
            )}
          </div>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          TAB 1 — LAB ANALYSIS
      ══════════════════════════════════════════════════════════════════ */}
      {topTab === "lab" && (
        <div>
          {/* Stage tabs */}
          <div style={{ background:"#2e5f8a" }}>
            <div style={{ display:"flex", gap:0, alignItems:"stretch", maxWidth:1400, margin:"0 auto" }}>

              {/* PRODUCT box — exact duplicate of CHOOSE ONE above */}
              <div style={{ background:C.pastelGreen, padding:"5px 14px", display:"flex", flexDirection:"column", minHeight:52, width:118, flexShrink:0,
                justifyContent:"center", alignItems:"center", borderRight:`2px solid #40c8c8` }}>
                <div style={{ fontSize:11, fontWeight:"bold", color:C.navy, fontFamily:"Arial", letterSpacing:0.5 }}>PRODUCT</div>
                <div style={{ fontSize:11, color:C.navy, fontFamily:"Arial", fontWeight:"normal", letterSpacing:0, margin:"1px 0 0px" }}>─────▶</div>
              </div>

              {STAGES.map((s, i) => (
                <div key={s.id} style={{ display:"flex", alignItems:"stretch" }}>
                  <button onClick={() => setStageId(s.id)} style={{
                    padding:"13px 28px",
                    background: "transparent",
                    color: C.white,
                    border:"none",
                    cursor:"pointer", fontFamily:"Arial",
                    transition:"all 0.2s",
                  }}>
                    <div style={{
                      border: stageId===s.id ? `2px solid #40c8c8` : "2px solid transparent",
                      borderRadius:3, padding:"5px 12px", transition:"all 0.2s",
                    }}>
                      <div style={{ fontSize:12, opacity:0.75, marginBottom:1, fontWeight:"bold" }}>{s.label}</div>
                      <div style={{ fontSize:12, fontWeight:"bold" }}>{s.product}</div>
                    </div>
                  </button>
                  {i < STAGES.length - 1 && (
                    <div style={{ width:2, background:"#40c8c8", margin:"14px 0", alignSelf:"stretch" }} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Full-width lab table */}
          <div style={{ maxWidth:1400, margin:"0 auto" }}>
            <div>
              {/* Product title bar with PRODUCT green box */}
              <div style={{ display:"flex", alignItems:"stretch", background:C.navy, borderBottom:`2px solid ${stage.color}` }}>
                <div style={{ background:C.pastelGreen, padding:"5px 14px", display:"flex", flexDirection:"column", minHeight:52, width:118, flexShrink:0,
                  justifyContent:"center", alignItems:"center", borderRight:`2px solid #40c8c8`,
                  minWidth:90, flexShrink:0 }}>
                  <div style={{ fontSize:11, fontWeight:"bold", color:C.navy, fontFamily:"Arial", letterSpacing:0.5 }}>PRODUCT</div>
                  <div style={{ fontSize:11, color:C.navy, fontFamily:"Arial", fontWeight:"normal", letterSpacing:0, margin:"1px 0 0px" }}>─────▶</div>
                </div>
                <div style={{ padding:"12px 18px 8px", display:"flex", alignItems:"center", gap:16 }}>
                  <div style={{ color:C.white, fontSize:14, fontWeight:"bold", whiteSpace:"nowrap" }}>{stage.product}</div>
                  <div style={{ color:C.white, fontSize:12, fontFamily:"Arial", fontWeight:"bold", opacity:0.85 }}>{stage.tagline}</div>
                </div>
              </div>
              {/* Col headers */}
              <div style={{ display:"grid", gridTemplateColumns:ColW.join(" "), background:C.navy, borderBottom:`1px solid #3a5a80` }}>
                {ColH.map((h,i) => (
                  <div key={i} style={{ color:C.white, fontSize:11, fontFamily:"Arial", fontWeight:"bold",
                    padding:"7px 7px", borderRight: i<ColH.length-1?"1px solid #2a4a80":"none",
                    textTransform:"uppercase", letterSpacing:0.5 }}>{h}</div>
                ))}
              </div>
              {/* Rows */}
              {stage.rows.map((row, i) => {
                if (row.s) return (
                  <div key={i} style={{ background:"#e8edf5", padding:"5px 10px", fontSize:11,
                    fontFamily:"Arial", fontWeight:"bold", color:C.navyMid,
                    textTransform:"uppercase", letterSpacing:1,
                    borderTop:"1px solid #c4cfe0", borderBottom:"1px solid #c4cfe0",
                    display:"flex", alignItems:"center", gap:8 }}>
                    {row.s}
                    {row.s.includes("★") && <span style={{ background:C.gold, color:C.white, fontSize:10, padding:"1px 5px", borderRadius:2 }}>PEAK</span>}
                  </div>
                );
                const hi = String(row[1]).includes("★");
                return (
                  <div key={i} style={{ display:"grid", gridTemplateColumns:ColW.join(" "),
                    background: hi?"#fff8e8" : i%2===0?C.white:"#fafafa",
                    borderBottom:"1px solid #eeeeee" }}>
                    {row.map((cell,j) => (
                      <div key={j} style={{ padding:"5px 7px", fontSize: j===0?13:11,
                        fontFamily: j===0?"Georgia, serif":"Arial, sans-serif",
                        fontWeight: j===0?"bold":"normal",
                        color: hi&&j===1?C.gold : j===5?C.text : j===0?C.text:"#333",
                        borderRight: j<row.length-1?"1px solid #eeeeee":"none",
                        fontStyle: j===5?"italic":"normal" }}>{cell}</div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          TAB 2 — PRODUCT VALUE
      ══════════════════════════════════════════════════════════════════ */}
      {topTab === "value" && (
        <div style={{ maxWidth:1300, margin:"0 auto", padding:"24px 24px 0" }}>

          {/* Price basis bar */}
          <div style={{ background:"#f0f5ff", borderLeft:`4px solid ${C.navyMid}`, padding:"10px 16px",
            fontSize:11, fontFamily:"Arial", color:C.navyMid, marginBottom:20, lineHeight:1.7 }}>
            <strong>Price basis — Indonesian market March 2026:</strong>&nbsp;
            Urea $350/t → N = $0.761/kg N &nbsp;|&nbsp;
            TSP $550/t → P = $2.740/kg P &nbsp;|&nbsp;
            MOP $400/t → K = $0.553/kg K &nbsp;|&nbsp;
            Kieserite $280/t → Mg = $1.029/kg Mg &nbsp;|&nbsp;
            Lime/Ca $0.204/kg Ca &nbsp;|&nbsp;
            Organic Matter $30/t &nbsp;|&nbsp;
            Sinar Mas actual N cost $1.50/kg N incl. soil loss penalties (estate benchmark)
          </div>

          {/* 4-product value cards */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:14, marginBottom:24 }}>
            {STAGES.map(s => (
              <div key={s.id} style={{ background:C.white, border:`2px solid ${s.color}`, borderRadius:4, overflow:"hidden" }}>
                {/* Card header */}
                <div style={{ background:s.color, padding:"12px 14px" }}>
                  <div style={{ color:C.goldLight, fontSize:10, fontFamily:"Arial", textTransform:"uppercase", letterSpacing:2, marginBottom:3 }}>{s.label}</div>
                  <div style={{ color:C.white, fontSize:14, fontWeight:"bold", lineHeight:1.3 }}>{s.product}</div>
                  <div style={{ color:"rgba(255,255,255,0.7)", fontSize:10, fontFamily:"Arial", marginTop:3 }}>{s.tagline}</div>
                </div>

                {/* DM / Wet headline */}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", borderBottom:`1px solid #eee` }}>
                  <div style={{ padding:"12px 10px", borderRight:"1px solid #eee", textAlign:"center" }}>
                    <div style={{ fontSize:10, fontFamily:"Arial", color:C.muted, textTransform:"uppercase", letterSpacing:0.5, marginBottom:2 }}>Value / t DM</div>
                    <div style={{ fontSize:26, fontWeight:"bold", color:C.green, fontFamily:"Arial" }}>${s.value.dm}</div>
                  </div>
                  <div style={{ padding:"12px 10px", textAlign:"center" }}>
                    <div style={{ fontSize:10, fontFamily:"Arial", color:C.muted, textTransform:"uppercase", letterSpacing:0.5, marginBottom:2 }}>Value / t Wet</div>
                    <div style={{ fontSize:26, fontWeight:"bold", color:C.navyMid, fontFamily:"Arial" }}>${s.value.wet}</div>
                    <div style={{ fontSize:9, color:"#888", fontFamily:"Arial" }}>{s.value.wetNote}</div>
                  </div>
                </div>

                {/* Nutrient breakdown */}
                <div style={{ padding:"10px 12px" }}>
                  <div style={{ fontSize:10, fontFamily:"Arial", fontWeight:"bold", color:C.navyMid,
                    textTransform:"uppercase", letterSpacing:0.8, marginBottom:6 }}>Nutrient Replacement Value</div>
                  <table style={{ width:"100%", borderCollapse:"collapse", fontSize:10.5, fontFamily:"Arial" }}>
                    <thead>
                      <tr style={{ background:"#f5f5f5" }}>
                        <th style={{ textAlign:"left", padding:"3px 5px", color:C.muted, borderBottom:"1px solid #e0e0e0", fontWeight:"bold" }}>Input</th>
                        <th style={{ textAlign:"right", padding:"3px 5px", color:C.muted, borderBottom:"1px solid #e0e0e0", fontWeight:"bold" }}>kg/t</th>
                        <th style={{ textAlign:"right", padding:"3px 5px", color:C.muted, borderBottom:"1px solid #e0e0e0", fontWeight:"bold" }}>$/t</th>
                      </tr>
                    </thead>
                    <tbody>
                      {s.value.rows.map((n,i) => (
                        <tr key={i} style={{ background: i%2===0?C.white:"#fafafa" }}>
                          <td style={{ padding:"3px 5px", borderBottom:"1px solid #f0f0f0", color:C.text }}>{n.n}</td>
                          <td style={{ padding:"3px 5px", textAlign:"right", borderBottom:"1px solid #f0f0f0", color:C.muted, fontFamily:"monospace" }}>
                            {typeof n.kg==="number" ? n.kg.toFixed(1) : n.kg}
                          </td>
                          <td style={{ padding:"3px 5px", textAlign:"right", borderBottom:"1px solid #f0f0f0",
                            fontWeight:"bold", color: n.n.startsWith("Nitrogen")?"#1a5530":C.text }}>
                            ${n.val.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                      <tr style={{ background:C.greenPale, borderTop:`2px solid ${C.green}` }}>
                        <td colSpan={2} style={{ padding:"5px 5px", fontWeight:"bold", color:C.green, fontSize:11 }}>TOTAL / t DM</td>
                        <td style={{ padding:"5px 5px", textAlign:"right", fontWeight:"bold", color:C.green, fontSize:16 }}>${s.value.dm}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* vs standard compost bar */}
                <div style={{ padding:"0 12px 10px" }}>
                  <div style={{ fontSize:9.5, fontFamily:"Arial", color:C.muted, marginBottom:3, textTransform:"uppercase", letterSpacing:0.8 }}>
                    vs Standard Compost ($30/t DM)
                  </div>
                  <div style={{ background:"#eeeeee", borderRadius:2, height:9, overflow:"hidden" }}>
                    <div style={{ background:s.color, height:"100%", width:`${Math.min((s.value.dm/100)*100,100)}%`, borderRadius:2 }} />
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, fontFamily:"Arial", marginTop:2 }}>
                    <span style={{ color:"#aaa" }}>$0</span>
                    <span style={{ color:s.color, fontWeight:"bold" }}>+{Math.round(((s.value.dm-30)/30)*100)}% vs standard</span>
                    <span style={{ color:"#aaa" }}>$100</span>
                  </div>
                </div>

                {/* Badges */}
                <div style={{ padding:"6px 10px 10px", display:"flex", flexWrap:"wrap", gap:4, borderTop:"1px solid #eee" }}>
                  {s.value.badges.map((b,i) => (
                    <div key={i} style={{ background:b.c, color:C.white, padding:"3px 7px",
                      borderRadius:2, fontSize:10, fontFamily:"Arial" }}>
                      <div style={{ fontSize:8.5, opacity:0.8 }}>{b.l}</div>
                      <div style={{ fontWeight:"bold" }}>{b.v}</div>
                    </div>
                  ))}
                </div>

                {/* Note */}
                <div style={{ margin:"0 10px 10px", padding:"7px 10px", background:"#f8f8ff",
                  borderLeft:`3px solid ${s.color}`, fontSize:9.5, fontFamily:"Arial",
                  color:C.muted, lineHeight:1.5, fontStyle:"italic" }}>
                  {s.value.note}
                </div>
              </div>
            ))}
          </div>

          {/* Summary comparison table */}
          <div style={{ fontSize:11, fontFamily:"Arial", fontWeight:"bold", color:C.navyMid,
            textTransform:"uppercase", letterSpacing:1, marginBottom:8 }}>
            Product Value Summary — All Stages
          </div>
          <div style={{ background:C.navy, display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr 2fr",
            padding:"8px 14px", marginBottom:1 }}>
            {["Product","Stage","$/t DM","$/t Wet","Moisture","Best Use"].map((h,i) => (
              <div key={i} style={{ color:C.white, fontSize:10, fontWeight:"bold", textTransform:"uppercase", letterSpacing:0.5 }}>{h}</div>
            ))}
          </div>
          {[
            { product:"COMPOST+", stage:"S2", dm:"$48.92", wet:"$17.12", moist:"65%", use:"BSF feedstock. Low value standalone. Foundation for S3.", color:C.navyMid },
            { product:"BIO-COMPOST+", stage:"S3", dm:"$71.43", wet:"$32.14", moist:"55%", use:"Estate compost replacement. Cellulase peak 20–35 U/g. Wave 1 biology.", color:C.green },
            { product:"BIO-FERTILISER+", stage:"S5A", dm:"$79.95", wet:"$59.96", moist:"25%", use:"Best long-term soil builder. P fixation solution for Ultisols. N leach −34%.", color:"#1a6040" },
            { product:"BIO-FERTILISER+ PROTEIN", stage:"S5B", dm:"$91.08", wet:"$63.76", moist:"30%", use:"Highest N product (4.2%). Bone-meal Ca. Chitin bio-control. Reduce rate on Spodosols.", color:C.brown },
          ].map((r,i) => (
            <div key={i} style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr 2fr",
              background: i%2===0?C.white:"#fafafa", padding:"9px 14px",
              borderBottom:"1px solid #eee", borderLeft:`4px solid ${r.color}` }}>
              <div style={{ fontSize:12, fontFamily:"Arial", fontWeight:"bold", color:r.color }}>{r.product}</div>
              <div style={{ fontSize:11, fontFamily:"Arial", color:C.muted }}>{r.stage}</div>
              <div style={{ fontSize:13, fontFamily:"Arial", fontWeight:"bold", color:C.green }}>{r.dm}</div>
              <div style={{ fontSize:13, fontFamily:"Arial", fontWeight:"bold", color:C.navyMid }}>{r.wet}</div>
              <div style={{ fontSize:11, fontFamily:"Arial", color:C.muted }}>{r.moist}</div>
              <div style={{ fontSize:10.5, fontFamily:"Arial", color:C.text, fontStyle:"italic" }}>{r.use}</div>
            </div>
          ))}

          <div style={{ height:28 }} />
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          TAB 3 — vs SYNTHETIC COMPARISON
      ══════════════════════════════════════════════════════════════════ */}
      {topTab === "synth" && (
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          {/* Product selector */}
          <div style={{ background:"#2e5f8a", display:"flex", alignItems:"stretch" }}>

            {/* PRODUCT box — exact match to other rows */}
            <div style={{ background:C.pastelGreen, padding:"5px 14px", display:"flex", flexDirection:"column", minHeight:52, width:118, flexShrink:0,
              justifyContent:"center", alignItems:"center", borderRight:`2px solid #40c8c8` }}>
              <div style={{ fontSize:11, fontWeight:"bold", color:C.navy, fontFamily:"Arial", letterSpacing:0.5 }}>PRODUCT</div>
              <div style={{ fontSize:11, color:C.navy, fontFamily:"Arial", fontWeight:"normal", letterSpacing:0, margin:"1px 0 0px" }}>─────▶</div>
            </div>

            {SYNTH.map((s,i) => (
              <div key={i} style={{ display:"flex", alignItems:"stretch" }}>
                <button onClick={() => setSynthIdx(i)} style={{
                  padding:"13px 28px",
                  background:"transparent",
                  color: C.white,
                  border:"none",
                  cursor:"pointer", fontFamily:"Arial",
                  transition:"all 0.2s",
                }}>
                  <div style={{
                    fontSize:12, fontWeight:"bold",
                    border: synthIdx===i ? `2px solid #40c8c8` : "2px solid transparent",
                    borderRadius:3, padding:"5px 12px", transition:"all 0.2s",
                  }}>{s.product}</div>
                </button>
                {i < SYNTH.length - 1 && (
                  <div style={{ width:2, background:"#40c8c8", margin:"14px 0", alignSelf:"stretch" }} />
                )}
              </div>
            ))}
          </div>

          <div style={{ padding:"24px 24px 0" }}>
            {/* Header */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:20 }}>
              {/* CFI box */}
              {(() => {
                const stageData = STAGES.find(s => s.id === synth.stageId);
                return (
                  <div style={{ background:synth.color, borderRadius:4, padding:"16px 20px" }}>
                    <div style={{ color:C.white, fontSize:11, fontFamily:"Arial", textTransform:"uppercase", fontWeight:"bold", letterSpacing:2, marginBottom:4 }}>CFI PRODUCT</div>
                    <div style={{ color:C.white, fontSize:20, fontWeight:"bold", marginBottom:4 }}>{synth.product}</div>

                    {/* DM / Wet */}
                    <div style={{ display:"flex", gap:20, marginBottom:8 }}>
                      <div>
                        <div style={{ fontSize:10, color:"rgba(255,255,255,0.7)", textTransform:"uppercase", letterSpacing:1 }}>$/t DM</div>
                        <div style={{ fontSize:24, fontWeight:"bold", color:C.white }}>${stageData.value.dm}</div>
                      </div>
                      <div>
                        <div style={{ fontSize:10, color:"rgba(255,255,255,0.7)", textTransform:"uppercase", letterSpacing:1 }}>$/t Wet</div>
                        <div style={{ fontSize:24, fontWeight:"bold", color:"rgba(255,255,255,0.85)" }}>${stageData.value.wet}</div>
                        <div style={{ fontSize:9, color:"rgba(255,255,255,0.6)" }}>{stageData.value.wetNote}</div>
                      </div>
                    </div>

                    {/* Badges */}
                    <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginBottom:12 }}>
                      {stageData.value.badges.map((b,i) => (
                        <div key={i} style={{ background:"rgba(0,0,0,0.25)", border:"1px solid rgba(255,255,255,0.3)", color:C.white, padding:"3px 7px", borderRadius:2, fontSize:9, fontFamily:"Arial" }}>
                          <div style={{ fontSize:7.5, opacity:0.75 }}>{b.l}</div>
                          <div style={{ fontWeight:"bold" }}>{b.v}</div>
                        </div>
                      ))}
                    </div>

                    {/* Nutrient table */}
                    <div style={{ fontSize:10, fontFamily:"Arial", fontWeight:"bold", color:"rgba(255,255,255,0.8)",
                      textTransform:"uppercase", letterSpacing:1, marginBottom:5 }}>Nutrient Replacement Value</div>
                    <table style={{ width:"100%", borderCollapse:"collapse", fontSize:11, fontFamily:"Arial" }}>
                      <thead>
                        <tr style={{ background:"rgba(0,0,0,0.2)" }}>
                          <th style={{ textAlign:"left", padding:"4px 6px", color:"rgba(255,255,255,0.8)", borderBottom:"1px solid rgba(255,255,255,0.2)", fontWeight:"bold" }}>Nutrient</th>
                          <th style={{ textAlign:"right", padding:"4px 6px", color:"rgba(255,255,255,0.8)", borderBottom:"1px solid rgba(255,255,255,0.2)", fontWeight:"bold" }}>kg/t</th>
                          <th style={{ textAlign:"right", padding:"4px 6px", color:"rgba(255,255,255,0.8)", borderBottom:"1px solid rgba(255,255,255,0.2)", fontWeight:"bold" }}>Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stageData.value.rows.map((n,i) => (
                          <tr key={i} style={{ background: i%2===0?"rgba(0,0,0,0.1)":"rgba(0,0,0,0.05)" }}>
                            <td style={{ padding:"3px 6px", borderBottom:"1px solid rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.9)" }}>{n.n}</td>
                            <td style={{ padding:"3px 6px", textAlign:"right", borderBottom:"1px solid rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.7)", fontFamily:"monospace" }}>
                              {typeof n.kg==="number"?n.kg.toFixed(1):n.kg}
                            </td>
                            <td style={{ padding:"3px 6px", textAlign:"right", borderBottom:"1px solid rgba(255,255,255,0.1)", fontWeight:"bold", color:C.white }}>
                              ${n.val.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                        <tr style={{ background:"rgba(0,0,0,0.25)" }}>
                          <td colSpan={2} style={{ padding:"5px 6px", fontWeight:"bold", color:C.white, fontSize:11 }}>TOTAL / t DM</td>
                          <td style={{ padding:"5px 6px", textAlign:"right", fontWeight:"bold", color:C.white, fontSize:15 }}>${stageData.value.dm}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                );
              })()}
              {/* Synthetic box */}
              <div style={{ background:"#f5f5f5", border:"2px solid #cc0000", borderRadius:4, padding:"16px 20px" }}>
                <div style={{ color:C.red, fontSize:13, fontFamily:"Arial", textTransform:"uppercase", letterSpacing:2, fontWeight:"bold", marginBottom:4 }}>SYNTHETIC EQUIVALENT PROGRAMME</div>
                <div style={{ color:C.text, fontSize:20, fontWeight:"bold" }}>Multiple Products Required</div>
                <div style={{ color:C.red, fontSize:13, marginTop:8, fontFamily:"Arial" }}>
                  Est. cost: <span style={{ fontSize:26, fontWeight:"bold" }}>${synth.synthTotal}</span> / equivalent tonne
                </div>
                {/* List all equivalent products */}
                <div style={{ marginTop:10, display:"flex", flexWrap:"wrap", gap:5 }}>
                  {synth.equiv.filter(e => !e.fert.startsWith(" ")).map((e,i) => (
                    <div key={i} style={{ background:"#ffeeee", border:"1px solid #cc0000", borderRadius:3,
                      padding:"3px 8px", fontSize:11, fontFamily:"Arial", color:C.red, fontWeight:"bold" }}>
                      {e.fert.trim()}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Savings callout */}
            <div style={{ background:C.greenPale, border:`2px solid ${C.green}`, borderRadius:4, padding:"12px 16px", marginBottom:20 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div>
                  <div style={{ fontSize:11, fontFamily:"Arial", color:C.green, fontWeight:"bold", textTransform:"uppercase", letterSpacing:1, marginBottom:2 }}>
                    ESTATE COST SAVING — {synth.product}
                  </div>
                  <div style={{ fontSize:15, fontFamily:"Arial", color:C.text }}>
                    Replaces <strong>${synth.synthTotal.toFixed(2)}</strong> of synthetic inputs with a single product valued at <strong>${synth.cfiValue}</strong>/t DM
                  </div>
                  <div style={{ fontSize:12, fontFamily:"Arial", color:C.muted, marginTop:4, fontStyle:"italic" }}>{synth.note}</div>
                </div>
                <div style={{ textAlign:"right", minWidth:140 }}>
                  <div style={{ fontSize:10, fontFamily:"Arial", color:C.green, textTransform:"uppercase", letterSpacing:1, lineHeight:1.4 }}>
                    ALL OF THE ABOVE<br/>IN ONE CFI PRODUCT
                  </div>
                  <div style={{ fontSize:36, fontWeight:"bold", color:C.green, fontFamily:"Arial" }}>
                    {synth.equiv.filter(e => !e.fert.startsWith(" ")).length}→1
                  </div>
                  <div style={{ fontSize:11, fontFamily:"Arial", color:C.muted }}>separate products replaced</div>
                </div>
              </div>
            </div>

            {/* Line-by-line table */}
            <div style={{ fontSize:13, fontFamily:"Arial", fontWeight:"bold", color:C.navyMid,
              textTransform:"uppercase", letterSpacing:1, marginBottom:8 }}>
              Synthetic Programme — Line by Line
            </div>
            <div style={{ background:C.navy, display:"grid", gridTemplateColumns:"2fr 1fr 1fr 2fr",
              padding:"7px 12px", marginBottom:1 }}>
              {["Synthetic Product","Dose / t CFI","Cost","Provides"].map((h,i) => (
                <div key={i} style={{ color:C.white, fontSize:11, fontWeight:"bold", textTransform:"uppercase", letterSpacing:0.5 }}>{h}</div>
              ))}
            </div>
            {synth.equiv.map((e,i) => (
              <div key={i} style={{
                display:"grid", gridTemplateColumns:"2fr 1fr 1fr 2fr",
                background: i%2===0?C.white:"#fafafa",
                padding:"7px 12px", borderBottom:"1px solid #eee",
              }}>
                <div style={{ fontSize:11, fontFamily:"Arial", fontWeight: e.fert.startsWith(" ")?"normal":"bold",
                  color: e.fert.startsWith(" ") ? C.green : C.text, paddingLeft: e.fert.startsWith(" ")?16:0 }}>
                  {e.fert.trim()}
                </div>
                <div style={{ fontSize:11, fontFamily:"monospace", color:C.muted }}>{e.dose}</div>
                <div style={{ fontSize:11, fontFamily:"Arial", fontWeight:"bold", color:C.red }}>{e.cost}</div>
                <div style={{ fontSize:11, fontFamily:"Arial", color:"#444", fontStyle:"italic" }}>{e.provides}</div>
              </div>
            ))}
            <div style={{ background:"#fff3d0", display:"grid", gridTemplateColumns:"2fr 1fr 1fr 2fr",
              padding:"8px 12px", borderTop:`2px solid ${C.gold}` }}>
              <div style={{ fontSize:12, fontFamily:"Arial", fontWeight:"bold", color:C.amber }}>TOTAL SYNTHETIC PROGRAMME</div>
              <div></div>
              <div style={{ fontSize:14, fontFamily:"Arial", fontWeight:"bold", color:C.red }}>${synth.synthTotal.toFixed(2)}</div>
              <div style={{ fontSize:11, fontFamily:"Arial", color:C.amber }}>vs CFI ${synth.cfiValue} / t DM</div>
            </div>

            <div style={{ height:24 }} />
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          TAB 3 — SOIL VALUE
      ══════════════════════════════════════════════════════════════════ */}
      {topTab === "soil" && (
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          {/* Soil selector */}
          <div style={{ background:"#2e5f8a", display:"flex", flexWrap:"wrap", alignItems:"stretch" }}>

            {/* CHOOSE ONE — same as top rows */}
            <div style={{ background:C.pastelGreen, padding:"5px 14px", display:"flex", flexDirection:"column", minHeight:52, width:118, flexShrink:0,
              justifyContent:"center", alignItems:"center", borderRight:`2px solid #40c8c8`, minWidth:90 }}>
              <div style={{ fontSize:11, fontWeight:"bold", color:C.navy, fontFamily:"Arial", letterSpacing:0.5 }}>CHOOSE ONE</div>
              <div style={{ fontSize:11, color:C.navy, fontFamily:"Arial", fontWeight:"normal", letterSpacing:0, margin:"1px 0 0px" }}>─────▶</div>
              
            </div>

            {SOILS.map((s, i) => (
              <div key={s.id} style={{ display:"flex", alignItems:"stretch" }}>
                <button onClick={() => setSoilId(s.id)} style={{
                  padding:"10px 18px",
                  background:"transparent",
                  color: C.white,
                  border:"none",
                  cursor:"pointer", fontFamily:"Arial",
                  transition:"all 0.2s",
                }}>
                  <div style={{
                    border: soilId===s.id ? `2px solid #40c8c8` : "2px solid transparent",
                    borderRadius:3, padding:"4px 10px", transition:"all 0.2s",
                  }}>
                    <div style={{ fontSize:14, fontWeight:"bold" }}>{s.name}</div>
                  </div>
                </button>
                {i < SOILS.length - 1 && (
                  <div style={{ width:2, background:"#40c8c8", margin:"14px 0", alignSelf:"stretch" }} />
                )}
              </div>
            ))}
          </div>

          <div style={{ padding:"20px 24px 0" }}>
            {/* Top row: soil properties + CFI match */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>

              {/* Soil profile card */}
              <div style={{ background:soil.colorLight, border:`2px solid ${soil.color}`, borderRadius:4, padding:"16px 18px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
                  <div>
                    <div style={{ fontSize:11, fontFamily:"Arial", color:soil.color, fontWeight:"bold",
                      textTransform:"uppercase", letterSpacing:1, marginBottom:4 }}>{soil.priority}</div>
                    <div style={{ fontSize:20, fontWeight:"bold", color:C.text }}>{soil.name}</div>
                    <div style={{ fontSize:11, fontFamily:"Arial", color:C.muted, marginTop:2 }}>
                      {soil.cover} of Indonesian palm area · {soil.estHa} ha
                    </div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontSize:11, fontFamily:"Arial", color:C.muted }}>pH</div>
                    <div style={{ fontSize:24, fontWeight:"bold", color:soil.color, fontFamily:"Arial" }}>{soil.ph}</div>
                    <div style={{ fontSize:10, color:C.muted, fontFamily:"Arial" }}>CEC: {soil.cec}</div>
                  </div>
                </div>

                <div style={{ fontSize:12, fontFamily:"Arial", color:C.text, lineHeight:1.5, marginBottom:12 }}>
                  {soil.challenge}
                </div>

                {/* Loss bars */}
                <div style={{ borderTop:"1px solid rgba(0,0,0,0.1)", paddingTop:10 }}>
                  <div style={{ fontSize:10, fontFamily:"Arial", fontWeight:"bold", color:C.muted, textTransform:"uppercase", letterSpacing:1, marginBottom:6 }}>
                    Synthetic Fertiliser Loss Rates
                  </div>
                  <Bar pct={soil.pFix} color={C.red} label="P Fixation (% of TSP unavailable)" />
                  <Bar pct={soil.nLeach} color={C.amber} label="N Leaching (% of Urea-N lost)" />
                  <Bar pct={soil.kLoss} color={C.navyMid} label="K Loss (% of K₂O leached)" />
                </div>
              </div>

              {/* CFI recommendation */}
              <div style={{ background:C.navy, borderRadius:4, padding:"16px 18px", color:C.white }}>
                <div style={{ color:C.gold, fontSize:11, fontFamily:"Arial", textTransform:"uppercase", letterSpacing:2, marginBottom:4 }}>
                  CFI RECOMMENDATION
                </div>
                <div style={{ fontSize:16, fontWeight:"bold", color:C.goldLight, marginBottom:10 }}>
                  {soil.cfiProduct}
                </div>
                <div style={{ fontSize:12, fontFamily:"Arial", color:"rgba(255,255,255,0.85)", lineHeight:1.6, marginBottom:14 }}>
                  {soil.cfiWhy}
                </div>

                <div style={{ borderTop:"1px solid rgba(255,255,255,0.15)", paddingTop:12, display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                  <div>
                    <div style={{ fontSize:10, fontFamily:"Arial", color:C.gold, textTransform:"uppercase", letterSpacing:1, marginBottom:4 }}>SYNTHETIC LOSS</div>
                    <div style={{ fontSize:11, fontFamily:"Arial", color:"#ffaaaa", lineHeight:1.5 }}>{soil.syntheticLoss}</div>
                  </div>
                  <div>
                    <div style={{ fontSize:10, fontFamily:"Arial", color:C.goldLight, textTransform:"uppercase", letterSpacing:1, marginBottom:4 }}>CFI GAIN</div>
                    <div style={{ fontSize:11, fontFamily:"Arial", color:"#aaffcc", lineHeight:1.5 }}>{soil.cfiGain}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* All soils summary table */}
            <div style={{ fontSize:11, fontFamily:"Arial", fontWeight:"bold", color:C.navyMid,
              textTransform:"uppercase", letterSpacing:1, marginBottom:8 }}>
              All Indonesian Palm Soils — CFI Value Summary
            </div>
            <div style={{ background:C.navy, display:"grid",
              gridTemplateColumns:"1fr 6% 6% 8% 8% 8% 2fr 1.2fr",
              padding:"7px 10px", marginBottom:1 }}>
              {["Soil","Area","pH","P Fix","N Leach","K Loss","CFI Product","Priority"].map((h,i) => (
                <div key={i} style={{ color:C.white, fontSize:10, fontWeight:"bold", textTransform:"uppercase", letterSpacing:0.4 }}>{h}</div>
              ))}
            </div>
            {SOILS.map((s,i) => (
              <div key={s.id} onClick={() => setSoilId(s.id)} style={{
                display:"grid", gridTemplateColumns:"1fr 6% 6% 8% 8% 8% 2fr 1.2fr",
                background: soilId===s.id ? s.colorLight : i%2===0?C.white:"#fafafa",
                padding:"8px 10px", borderBottom:"1px solid #eee",
                cursor:"pointer", borderLeft: soilId===s.id?`4px solid ${s.color}`:"4px solid transparent",
                transition:"all 0.15s",
              }}>
                <div style={{ fontSize:12, fontFamily:"Arial", fontWeight:"bold", color:s.color }}>{s.name}</div>
                <div style={{ fontSize:11, fontFamily:"Arial", color:C.muted }}>{s.cover}</div>
                <div style={{ fontSize:11, fontFamily:"Arial", color:C.muted }}>{s.ph}</div>
                <div style={{ fontSize:11, fontFamily:"Arial", fontWeight:"bold", color: s.pFix>60?C.red:s.pFix>30?C.amber:C.green }}>{s.pFix}%</div>
                <div style={{ fontSize:11, fontFamily:"Arial", fontWeight:"bold", color: s.nLeach>45?C.red:s.nLeach>25?C.amber:C.green }}>{s.nLeach}%</div>
                <div style={{ fontSize:11, fontFamily:"Arial", fontWeight:"bold", color: s.kLoss>45?C.red:s.kLoss>25?C.amber:C.green }}>{s.kLoss}%</div>
                <div style={{ fontSize:11, fontFamily:"Arial", color:C.text }}>{s.cfiProduct}</div>
                <div style={{ fontSize:10, fontFamily:"Arial", color:s.color, fontWeight:"bold" }}>{s.priority.split("—")[0].trim()}</div>
              </div>
            ))}

            {/* Price basis note */}
            <div style={{ marginTop:16, padding:"10px 14px", background:"#f0f5ff",
              borderLeft:`3px solid ${C.navyMid}`, fontSize:10.5, fontFamily:"Arial",
              color:C.navyMid, lineHeight:1.6 }}>
              <strong>Price basis all calculations:</strong> Urea $350/t (N = $0.761/kg) · TSP $550/t (P = $2.740/kg) · MOP $400/t (K = $0.553/kg) · Kieserite $280/t · Ag Lime $80/t · OM $30/t × quality index ·
              N loss values: Inceptisol 20%, Ultisol 40%, Oxisol 45%, Histosol 25%, Spodosol 55% ·
              P fixation: Inceptisol 30%, Ultisol 75%, Oxisol 85%, Histosol 20%, Spodosol 10% ·
              Customer = Estate plantation company (Sinar Mas, Wilmar, Astra Agro, First Resources etc.) — market-rate input purchases only.
            </div>
            <div style={{ height:24 }} />
          </div>
        </div>
      )}

      {/* ── FOOTER ─────────────────────────────────────────────────────────── */}
      <div style={{ maxWidth:1400, margin:"4px auto 0", padding:"8px 20px",
        fontSize:8, fontFamily:"Arial", color:"#999", borderTop:"1px solid #ddd" }}>
        All lab values PhD-verified. Nutrient replacement values at Indonesian market prices March 2026.
        Cellulase: DNS method (CMCase/FPase). CFI Bioconversion Project — Confidential — Estate Operations Only.
      </div>
    </div>
  );
}
