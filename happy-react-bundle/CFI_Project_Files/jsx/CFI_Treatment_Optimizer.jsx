import { useState, useMemo } from "react";

// ─── COLOUR TOKENS ────────────────────────────────────────────────────────────
const C = {
  navy:"#07121E", navyMid:"#0D1F30", navyLt:"#132840",
  navyCard:"#0F2235", navyBorder:"#1A3550",
  teal:"#00C9B1", tealDk:"#009E8C", tealLt:"#80E4D8",
  amber:"#F5A623", amberLt:"#FFD080", amberDk:"#C07800",
  red:"#E84040", redLt:"#FF8080",
  green:"#3DCB7A", greenDk:"#28A55F",
  blue:"#4A9EDB", purple:"#9B7EDE",
  gold:"#FFD700",
  white:"#F0F4F8", grey:"#6B8299", greyLt:"#A8BFCE",
};

// ─── 31 CHEMICALS ─────────────────────────────────────────────────────────────
const CHEMICALS = [
  {id:1,  name:"NaOH",             group:"Alkaline",        score:3, efb:4, opdc:3, bsf:"⚠️", rspo:2, alert:"⚠️ Na⁺ residue harms BSF — confirm rinse before biology", cost:0.45, dose:"10-15 kg/t", unit:"kg/t"},
  {id:2,  name:"KOH",              group:"Alkaline",        score:3, efb:4, opdc:3, bsf:"⚠️", rspo:2, alert:"⚠️ Strong alkali — confirm neutralisation before biology", cost:0.55, dose:"10-15 kg/t", unit:"kg/t"},
  {id:3,  name:"Ca(OH)₂",         group:"Alkaline",        score:4, efb:4, opdc:5, bsf:"✅", rspo:5, cost:0.08, dose:"5-10 kg/t", unit:"kg/t"},
  {id:4,  name:"CaO",              group:"Alkaline",        score:4, efb:4, opdc:5, bsf:"✅", rspo:5, cost:0.06, dose:"5-10 kg/t", unit:"kg/t"},
  {id:5,  name:"CaCO₃",           group:"Alkaline Buffer", score:4, efb:3, opdc:4, bsf:"✅", rspo:5, cost:0.08, dose:"10-20 kg/t", unit:"kg/t"},
  {id:6,  name:"MgCO₃",           group:"Alkaline Buffer", score:3, efb:3, opdc:4, bsf:"✅", rspo:5, cost:0.12, dose:"5-10 kg/t", unit:"kg/t"},
  {id:7,  name:"K₂CO₃",           group:"Alkaline",        score:3, efb:4, opdc:2, bsf:"⚠️", rspo:3, alert:"⚠️ Moderate alkali — neutralise before biology inoculation", cost:0.28, dose:"8-12 kg/t", unit:"kg/t"},
  {id:8,  name:"H₂SO₄",           group:"Acid",            score:2, efb:2, opdc:2, bsf:"⚠️", rspo:2, alert:"⚠️ Strong acid — neutralise to pH 7 before any biology", cost:0.15, dose:"2-5 kg/t", unit:"kg/t"},
  {id:9,  name:"HCl",              group:"Acid",            score:2, efb:2, opdc:2, bsf:"⚠️", rspo:2, alert:"⚠️ Strong acid — Cl⁻ residue, neutralise fully before biology", cost:0.18, dose:"2-5 kg/t", unit:"kg/t"},
  {id:10, name:"Citric Acid",      group:"pH Correction",   score:3, efb:3, opdc:2, bsf:"✅", rspo:5, cost:1.20, dose:"1-3 kg/t", unit:"kg/t"},
  {id:11, name:"PAA",              group:"Oxidative",       score:4, efb:5, opdc:3, bsf:"⚠️", rspo:1, alert:"⚠️ Oxidant — KI paper test required before biology (48h)", cost:2.80, dose:"2-5 L/t", unit:"L/t"},
  {id:12, name:"H₂O₂",            group:"Oxidative",       score:3, efb:4, opdc:2, bsf:"⚠️", rspo:3, alert:"⚠️ Residual oxidant harmful to microbes — confirm dissipation", cost:0.80, dose:"2-5 L/t", unit:"L/t"},
  {id:13, name:"Gypsum",          group:"Amendment",       score:4, efb:3, opdc:5, bsf:"✅", rspo:5, cost:0.06, dose:"10-20 kg/t", unit:"kg/t"},
  {id:14, name:"Biochar (PKS)",   group:"Amendment",       score:5, efb:4, opdc:5, bsf:"✅", rspo:5, cost:0.10, dose:"20-50 kg/t", unit:"kg/t"},
  {id:15, name:"Zeolite",         group:"Amendment",       score:4, efb:3, opdc:4, bsf:"✅", rspo:5, cost:0.35, dose:"10-20 kg/t", unit:"kg/t"},
  {id:16, name:"Cellulase",       group:"Enzyme",          score:5, efb:5, opdc:4, bsf:"✅", rspo:5, cost:0.63, dose:"0.01-0.05% DM", unit:"% DM"},
  {id:17, name:"Xylanase",        group:"Enzyme",          score:5, efb:5, opdc:3, bsf:"✅", rspo:5, cost:0.57, dose:"0.01-0.05% DM", unit:"% DM"},
  {id:18, name:"Laccase",         group:"Enzyme",          score:4, efb:5, opdc:3, bsf:"✅", rspo:5, cost:1.00, dose:"0.01-0.03% DM", unit:"% DM"},
  {id:19, name:"MnP",             group:"Enzyme",          score:4, efb:5, opdc:2, bsf:"✅", rspo:5, cost:2.10, dose:"0.01-0.03% DM", unit:"% DM"},
  {id:20, name:"LiP",             group:"Enzyme",          score:4, efb:5, opdc:2, bsf:"✅", rspo:5, cost:2.60, dose:"0.01-0.03% DM", unit:"% DM"},
  {id:21, name:"Provibio (9-org)",group:"Microbial",       score:5, efb:4, opdc:5, bsf:"✅", rspo:5, cost:0.65, dose:"0.1% DM", unit:"% DM"},
  {id:22, name:"FeSO₄·7H₂O",     group:"N-Retention",     score:4, efb:3, opdc:5, bsf:"✅", rspo:5, cost:0.22, dose:"1-2 kg/t", unit:"kg/t"},
  {id:23, name:"Humic Acid",      group:"Amendment",       score:4, efb:4, opdc:4, bsf:"✅", rspo:5, cost:1.50, dose:"2-5 kg/t", unit:"kg/t"},
  {id:24, name:"Wood Vinegar",    group:"pH Correction",   score:4, efb:4, opdc:3, bsf:"✅", rspo:5, cost:0.80, dose:"2-5 L/t", unit:"L/t"},
  {id:25, name:"Molasses",        group:"Carrier",         score:4, efb:4, opdc:4, bsf:"✅", rspo:5, cost:0.40, dose:"2-5 kg/t", unit:"kg/t"},
  {id:26, name:"EM4",             group:"Microbial",       score:4, efb:3, opdc:4, bsf:"✅", rspo:5, cost:0.17, dose:"0.1-0.3 L/t", unit:"L/t"},
  {id:27, name:"Nat. Phosphate Rock",group:"P-Amendment",  score:3, efb:2, opdc:3, bsf:"✅", rspo:5, cost:0.25, dose:"5-10 kg/t", unit:"kg/t"},
  {id:28, name:"Dolomite",        group:"Alkaline Buffer", score:4, efb:3, opdc:5, bsf:"✅", rspo:5, cost:0.09, dose:"10-20 kg/t", unit:"kg/t"},
  {id:29, name:"⚡ PKSA",         group:"Alkaline+K",      score:5, efb:5, opdc:4, bsf:"✅", rspo:5, pksa:true, cost:0.00, dose:"6-10 kg/t", unit:"kg/t"},
  {id:30, name:"Volcanic Sulfur", group:"pH Correction",   score:3, efb:3, opdc:3, bsf:"✅", rspo:5, cost:0.30, dose:"2-5 kg/t", unit:"kg/t"},
  {id:31, name:"Bentonite",       group:"Amendment",       score:4, efb:3, opdc:4, bsf:"✅", rspo:5, cost:0.45, dose:"5-10 kg/t", unit:"kg/t"},
];

// ─── 40 ORGANISMS ─────────────────────────────────────────────────────────────
const ORGANISMS = [
  {id:1,  cat:"🔥 Thermo Fungi",   name:"Thermomyces lanuginosus",  func:"Thermophilic cellulase/xylanase",     temp:"50-60", bsf:"✅", cost:4.38,  rank:4},
  {id:2,  cat:"🔥 Thermo Fungi",   name:"Myceliophthora thermophila",func:"C1 cellulase system, industrial",    temp:"45-55", bsf:"✅", cost:5.25,  rank:4},
  {id:3,  cat:"🔥 Thermo Fungi",   name:"Chaetomium thermophilum",  func:"Thermophilic cellulase",             temp:"50-60", bsf:"✅", cost:3.68,  rank:3},
  {id:4,  cat:"🔥 Thermo Bact.",   name:"Geobacillus stearothermophilus",func:"Thermophilic amylase/protease", temp:"55-70", bsf:"✅", cost:2.63,  rank:3},
  {id:5,  cat:"🔥 Thermo Bact.",   name:"Bacillus licheniformis",   func:"Thermotolerant protease/amylase",    temp:"50-65", bsf:"✅", cost:1.40,  rank:4},
  {id:6,  cat:"🔥 Thermo Actino.", name:"Thermobifida fusca",       func:"Thermophilic actinomycete, cellulase",temp:"50-55",bsf:"✅", cost:2.80,  rank:3},
  {id:7,  cat:"🍄 WRF Fungi",      name:"Phanerochaete sp. ICBB9182",func:"Primary lignin destroyer (LiP/MnP/Laccase)",temp:"25-42",bsf:"✅",cost:4.00, rank:5},
  {id:8,  cat:"🍄 WRF Fungi",      name:"Phanerochaete chrysosporium",func:"Strongest lignin degrader",        temp:"37-42", bsf:"✅", cost:4.00,  rank:5},
  {id:9,  cat:"🍄 WRF Fungi",      name:"Pleurotus ostreatus",      func:"Selective lignin (preserves cellulose)",temp:"20-28",bsf:"✅",cost:0.15, rank:5},
  {id:10, cat:"🍄 WRF Fungi",      name:"Trametes versicolor",      func:"Laccase producer, lignin oxidation", temp:"25-30", bsf:"✅", cost:0.60,  rank:4},
  {id:11, cat:"🍄 WRF Fungi",      name:"Ganoderma lucidum",        func:"Lignin degrader (⚠️ palm pathogen)", temp:"25-30", bsf:"⚠️", cost:0.45, rank:2, alert:"⚠️ Ganoderma is a known palm oil pathogen — use only on isolated waste, NOT near living palms"},
  {id:12, cat:"🍄 WRF Fungi",      name:"Trichoderma harzianum ICBB9127",func:"Cellulase + Ganoderma biocontrol",temp:"25-35",bsf:"✅",cost:0.75, rank:5},
  {id:13, cat:"🍄 WRF Fungi",      name:"Aspergillus niger",        func:"Industrial cellulase/pectinase",     temp:"30-37", bsf:"✅", cost:1.50,  rank:4},
  {id:14, cat:"🍄 WRF Fungi",      name:"Aspergillus oryzae",       func:"Koji mold, amylase/protease",       temp:"30-35", bsf:"✅", cost:1.50,  rank:3},
  {id:15, cat:"🍺 Yeast",          name:"Saccharomyces cerevisiae ICBB8808",func:"Anti-odour, 50% NH₃ retention",temp:"25-35",bsf:"✅",cost:0.12, rank:5},
  {id:16, cat:"🦠 Bacteria",       name:"Microbacterium lactium ICBB7125",func:"Primary cellulose decomposer → glucose",temp:"30-40",bsf:"✅",cost:1.50,rank:5},
  {id:17, cat:"🦠 Bacteria",       name:"Paenibacillus macerans ICBB8810",func:"Hemicellulase + nif genes",   temp:"30-45", bsf:"✅", cost:1.50,  rank:5},
  {id:18, cat:"🦠 Bacteria",       name:"Bacillus subtilis ICBB8780",func:"PGPR, endospore shelf-life",       temp:"25-50", bsf:"✅", cost:0.06,  rank:5},
  {id:19, cat:"🦠 Bacteria",       name:"Lactobacillus sp. ICBB6099",func:"LAB pH buffering 5.5-6.0",         temp:"25-40", bsf:"✅", cost:0.05,  rank:5},
  {id:20, cat:"🦠 Bacteria",       name:"Bacillus megaterium",      func:"P-solubiliser (gluconic acid)",     temp:"25-37", bsf:"✅", cost:0.45,  rank:4},
  {id:21, cat:"🦠 Bacteria",       name:"Cellulomonas fimi",        func:"Cellulolytic bacterium",            temp:"30-37", bsf:"✅", cost:1.20,  rank:3},
  {id:22, cat:"❄️ N-Fixer",       name:"Azotobacter vinelandii ICBB9098",func:"Free N₂ fixer 10-20mg N/kg/day",temp:"<50⚠️",bsf:"✅",cost:0.20, rank:5},
  {id:23, cat:"❄️ N-Fixer",       name:"Azospirillum lipoferum ICBB6088",func:"Associative N-fixer + IAA",   temp:"<50⚠️",bsf:"✅", cost:0.50, rank:5},
  {id:24, cat:"❄️ N-Fixer",       name:"Bradyrhizobium japonicum ICBB9251",func:"Root-nodule N-fixer (soil phase)",temp:"<45",bsf:"✅",cost:0.45,rank:4},
  {id:25, cat:"🧪 P-Solubiliser",  name:"Pseudomonas fluorescens",  func:"P-sol + HCN biocontrol vs Ganoderma",temp:"25-30",bsf:"✅",cost:1.20, rank:5},
  {id:26, cat:"🧪 P-Solubiliser",  name:"Bacillus coagulans",       func:"P-solubiliser, probiotic",          temp:"35-50", bsf:"✅", cost:0.60,  rank:4},
  {id:27, cat:"⚗️ K-Mobiliser",   name:"Bacillus mucilaginosus",   func:"K-solubiliser from silicates",      temp:"25-37", bsf:"✅", cost:0.90,  rank:3},
  {id:28, cat:"⚗️ K-Mobiliser",   name:"Frateuria aurantia",       func:"K-mobiliser specialist",            temp:"25-30", bsf:"✅", cost:1.20,  rank:4},
  {id:29, cat:"🌿 Actinomycete",   name:"Streptomyces sp. ICBB9155",func:"Lignocellulolytic + antibiotics",  temp:"25-37", bsf:"✅", cost:1.00,  rank:4},
  {id:30, cat:"🌿 Actinomycete",   name:"Streptomyces sp. ICBB9469",func:"Complementary antibiotic profile", temp:"25-37", bsf:"✅", cost:1.00,  rank:4},
  {id:31, cat:"⚠️ ALERT ORGANISM", name:"Bacillus thuringiensis ICBB6095",func:"Bt bioinsecticide — Cry proteins TOXIC TO BSF Diptera — non-BSF use only",temp:"25-45",bsf:"❌",cost:0.15,rank:0, btAlert:true, alert:"🔴 BSF PATHWAY WARNING: Bt Cry proteins are acutely toxic to Black Soldier Fly (Diptera). NEVER activate on any BSF rearing pathway. Permitted only for non-BSF insect pest control applications — confirm pathway in writing before use."},
  {id:32, cat:"⚙️ Enzyme",        name:"Cellulase (T. reesei) EC3.2.1.4",func:"+35-45% IVDMD, glucose release",temp:"45-55",bsf:"✅",cost:1.58, rank:5},
  {id:33, cat:"⚙️ Enzyme",        name:"Xylanase EC3.2.1.8",       func:"Hemicellulose shield removal",      temp:"40-55", bsf:"✅", cost:1.36,  rank:5},
  {id:34, cat:"⚙️ Enzyme",        name:"Laccase EC1.10.3.2",       func:"Phenolic detox, lignin surface",    temp:"30-50", bsf:"✅", cost:1.00,  rank:4},
  {id:35, cat:"⚙️ Enzyme",        name:"Pectinase EC3.2.1.15",     func:"Pectin breakdown, cell wall soften",temp:"40-50", bsf:"✅", cost:0.42,  rank:3},
  {id:36, cat:"⚙️ Enzyme",        name:"Lipase EC3.1.1.3",         func:"Fat breakdown for OPDC 3-8% lipid",temp:"35-45", bsf:"✅", cost:0.63,  rank:4},
  {id:37, cat:"⚙️ Enzyme",        name:"Protease EC3.4.x.x",       func:"Protein accessibility for BSF",    temp:"40-55", bsf:"✅", cost:0.35,  rank:4},
  {id:38, cat:"⚙️ Enzyme",        name:"Amylase EC3.2.1.1",        func:"Starch → glucose",                 temp:"55-70", bsf:"✅", cost:0.56,  rank:3},
  {id:39, cat:"⚙️ Enzyme",        name:"Mannanase EC3.2.1.78",     func:"Mannan breakdown (palm kernel)",   temp:"45-55", bsf:"✅", cost:0.77,  rank:4},
  {id:40, cat:"⚙️ Enzyme",        name:"β-glucosidase EC3.2.1.21", func:"Final cellulose step → glucose",   temp:"45-55", bsf:"✅", cost:0.88,  rank:4},
];

// ─── CONFLICT RULES ───────────────────────────────────────────────────────────
const CONFLICT_RULES = [
  {ids:[1,2],   type:"redundant", msg:"NaOH + KOH: Dual strong alkali — choose one only"},
  {ids:[1,29],  type:"redundant", msg:"NaOH + PKSA: PKSA already alkaline — NaOH is redundant and increases Na⁺ risk"},
  {ids:[2,29],  type:"redundant", msg:"KOH + PKSA: PKSA already alkaline — KOH is redundant"},
  {ids:[8,29],  type:"conflict",  msg:"H₂SO₄ + PKSA: Strong acid CONFLICTS with strong alkali — pH cancellation"},
  {ids:[9,29],  type:"conflict",  msg:"HCl + PKSA: Strong acid CONFLICTS with strong alkali"},
  {ids:[8,3],   type:"conflict",  msg:"H₂SO₄ + Ca(OH)₂: Acid/alkali conflict — gypsum formed, waste of reagents"},
  {ids:[11,12], type:"conflict",  msg:"PAA + H₂O₂: Dual oxidants — overdose toxicity risk to all microbes"},
  {ids:[1,3],   type:"conflict",  msg:"NaOH + Ca(OH)₂: Dual alkalis — excess pH >13 damages substrate"},
  {ids:[8,9],   type:"redundant", msg:"H₂SO₄ + HCl: Both strong acids — choose one only"},
  {ids:[30,3],  type:"conflict",  msg:"Volcanic Sulfur (acid) + Ca(OH)₂ (alkali): pH conflict"},
  {ids:[30,28], type:"conflict",  msg:"Volcanic Sulfur (acid) + Dolomite (alkali): pH conflict"},
];

// ─── SOILS ────────────────────────────────────────────────────────────────────
const SOILS = [
  {id:"inceptisols", name:"Inceptisols", pct:"39%", ph:4.1, cec:15.4, note:"Best fertility; standard reference", nAdj:"-40%", pAdj:"-50%", color:C.green},
  {id:"ultisols",    name:"Ultisols",    pct:"24%", ph:4.5, cec:8.2,  note:"Clay-rich, acidic; standard NPK baseline", nAdj:"0%", pAdj:"0%", color:C.teal},
  {id:"oxisols",     name:"Oxisols",     pct:"8%",  ph:4.4, cec:5.1,  note:"Fe/Al oxides, low P retention", nAdj:"+10%", pAdj:"+25%", color:C.amber},
  {id:"histosols",   name:"Histosols",   pct:"7%",  ph:3.8, cec:42.0, note:"Peat/organic; drainage issues", nAdj:"-80%", pAdj:"-70%", color:C.purple},
  {id:"spodosols",   name:"Spodosols",   pct:"—",   ph:4.77,cec:2.1,  note:"Sandy, lowest fertility; 31% yield gap vs Ultisols", nAdj:"+20%", pAdj:"+30%", color:C.red},
];

// ─── AG PRACTICES ─────────────────────────────────────────────────────────────
const AG_PRACTICES = [
  {id:"frass_mch",  name:"Frass Mulch (direct)",   benefit:"Slow-release N+K, moisture retention", uplift:"+15% NUE", compatible:["inceptisols","ultisols","histosols"]},
  {id:"biochar_am", name:"Biochar + Frass",         benefit:"CEC booster, pH buffer", uplift:"+20% NUE", compatible:["ultisols","oxisols","spodosols"]},
  {id:"compost_bl", name:"Compost Blend",           benefit:"Balanced NPK + OM", uplift:"+18% NUE", compatible:["inceptisols","ultisols","oxisols"]},
  {id:"liq_frac",   name:"Liquid Frass Inject.",    benefit:"Immediate N, fertigation", uplift:"+22% NUE", compatible:["ultisols","inceptisols"]},
  {id:"strip_app",  name:"Strip Application",       benefit:"Concentrated zone nutrition", uplift:"+12% NUE", compatible:["inceptisols","ultisols","oxisols","spodosols","histosols"]},
  {id:"biomix",     name:"Bio-Inoculant Mix",       benefit:"Mycorrhiza + N-fixer blend", uplift:"+25% NUE", compatible:["inceptisols","ultisols","oxisols"]},
  {id:"ph_lime",    name:"pH Correction (lime)",    benefit:"pH raise + Ca supply", uplift:"+15% base saturation", compatible:["ultisols","oxisols","spodosols","histosols"]},
  {id:"pome_sludge",name:"POME Sludge (blended)",   benefit:"N+micronutrients, C:N balance", uplift:"+18% soil C", compatible:["inceptisols","ultisols","oxisols"]},
  {id:"pkg_pellet", name:"Pelleted Frass",          benefit:"Storage + precision dosing", uplift:"$40-60/t premium", compatible:["inceptisols","ultisols","oxisols","spodosols","histosols"]},
  {id:"cert_org",   name:"Organic Cert. Premium",   benefit:"MSPO/SNI certified product", uplift:"+3-5× price", compatible:["inceptisols","ultisols","oxisols","spodosols","histosols"]},
];

// ─── STYLES ──────────────────────────────────────────────────────────────────
const S = {
  wrap: {fontFamily:"'IBM Plex Mono', 'Courier New', monospace", background:C.navy, minHeight:"100vh", color:C.white, padding:0},
  header: {background:C.navyMid, borderBottom:`2px solid ${C.teal}33`, padding:"14px 20px", display:"flex", alignItems:"center", gap:12},
  logo: {color:C.teal, fontSize:16, fontWeight:700, letterSpacing:"0.12em"},
  sub: {color:C.grey, fontSize:10, letterSpacing:"0.08em", marginTop:2},
  tabs: {display:"flex", gap:0, borderBottom:`1px solid ${C.navyBorder}`, background:C.navyMid, padding:"0 12px"},
  tab: (a) => ({padding:"10px 16px", cursor:"pointer", fontSize:11, fontWeight:700, letterSpacing:"0.08em",
    color: a ? C.teal : C.grey, borderBottom: a ? `2px solid ${C.teal}` : "2px solid transparent",
    transition:"all 0.15s", background:"none", border:"none", borderBottomStyle:"solid",
    borderBottomWidth:2, borderBottomColor: a ? C.teal : "transparent"}),
  body: {padding:"16px 20px", maxHeight:"calc(100vh - 100px)", overflowY:"auto"},
  card: {background:C.navyCard, border:`1px solid ${C.navyBorder}`, borderRadius:6, padding:"12px 14px", marginBottom:10},
  cardHdr: {fontSize:11, color:C.grey, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:8, display:"flex", alignItems:"center", gap:6},
  row2: {display:"grid", gridTemplateColumns:"1fr 1fr", gap:10},
  row3: {display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10},
  badge: (c, sz="sm") => ({background:`${c}18`, border:`1px solid ${c}55`, borderRadius:10,
    padding: sz==="xs" ? "1px 6px" : "2px 8px", color:c, fontSize: sz==="xs" ? 9 : 10, fontWeight:700, display:"inline-block"}),
  tog: (on) => ({width:36, height:20, borderRadius:10, background: on ? C.teal : C.navyBorder,
    cursor:"pointer", position:"relative", transition:"background 0.2s", flexShrink:0, border:"none"}),
  togKnob: (on) => ({position:"absolute", top:2, left: on ? 18 : 2, width:16, height:16,
    borderRadius:"50%", background: on ? C.navy : C.grey, transition:"left 0.2s"}),
  score: (n) => ({color: n>=5?C.gold:n>=4?C.green:n>=3?C.teal:n>=2?C.amber:C.red, fontWeight:700, fontSize:12}),
  alert: {background:`${C.amber}12`, border:`1px solid ${C.amber}44`, borderRadius:4, padding:"6px 10px",
    color:C.amberLt, fontSize:10, marginTop:6},
  conflict: {background:`${C.red}12`, border:`1px solid ${C.red}44`, borderRadius:4, padding:"8px 12px",
    color:C.redLt, fontSize:11, marginBottom:8},
  excluded: {background:`${C.red}10`, border:`1px solid ${C.red}33`, borderRadius:4, padding:"6px 10px",
    color:C.red, fontSize:10, fontWeight:700},
  sectionHdr: {color:C.teal, fontSize:11, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase",
    borderBottom:`1px solid ${C.navyBorder}`, paddingBottom:6, marginBottom:10, marginTop:14},
  statBox: {background:C.navyCard, border:`1px solid ${C.navyBorder}`, borderRadius:6, padding:"10px 14px",
    textAlign:"center"},
  statVal: {color:C.teal, fontSize:20, fontWeight:700},
  statLabel: {color:C.grey, fontSize:9, letterSpacing:"0.06em", marginTop:2},
  tblHdr: {background:C.navyLt, padding:"6px 10px", fontSize:10, color:C.grey, letterSpacing:"0.06em", fontWeight:700},
  tblCell: (alt) => ({padding:"6px 10px", fontSize:11, background: alt ? `${C.navyLt}50` : "transparent", borderBottom:`1px solid ${C.navyBorder}30`}),
};

// ─── TOGGLE HELPERS ──────────────────────────────────────────────────────────
function Toggle({on, onClick}) {
  return (
    <button style={S.tog(on)} onClick={onClick}>
      <div style={S.togKnob(on)}/>
    </button>
  );
}

function Stars({n, max=5}) {
  return (
    <span>
      {Array.from({length:max}).map((_,i) => (
        <span key={i} style={{color: i<n ? C.gold : C.navyBorder, fontSize:11}}>★</span>
      ))}
    </span>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function CFITreatmentOptimizer() {
  const [tab, setTab] = useState(0);
  const [chemOn, setChemOn] = useState(() => {
    const init = {}; CHEMICALS.forEach(c => { init[c.id] = c.id===29; }); return init; // PKSA on by default
  });
  const [bioOn, setBioOn] = useState(() => {
    const init = {}; ORGANISMS.forEach(o => { init[o.id] = false; }); return init;
  });
  const [soil, setSoil] = useState("ultisols");
  const [agOn, setAgOn] = useState(() => {
    const init = {}; AG_PRACTICES.forEach(p => { init[p.id] = false; }); return init;
  });

  // Conflicts
  const activeChemIds = Object.entries(chemOn).filter(([,v])=>v).map(([k])=>Number(k));
  const conflicts = useMemo(() => CONFLICT_RULES.filter(r => r.ids.every(id => activeChemIds.includes(id))), [activeChemIds]);

  // Costs
  const chemCost = useMemo(() => CHEMICALS.filter(c=>chemOn[c.id]).reduce((s,c)=>s+c.cost,0), [chemOn]);
  const bioCost = useMemo(() => ORGANISMS.filter(o=>bioOn[o.id]).reduce((s,o)=>s+o.cost,0), [bioOn]);

  // Active organisms by category
  const orgCategories = useMemo(() => {
    const cats = {};
    ORGANISMS.forEach(o => { if(!cats[o.cat]) cats[o.cat]=[]; cats[o.cat].push(o); });
    return cats;
  }, []);

  const TABS = ["CHEMICALS","BIOLOGICALS","SOILS","AGRONOMICS","OPTIMIZER"];

  // ── CHEM TAB ──
  function ChemTab() {
    const groups = useMemo(() => {
      const g = {};
      CHEMICALS.forEach(c => { if(!g[c.group]) g[c.group]=[]; g[c.group].push(c); });
      return g;
    }, []);

    return (
      <div>
        {/* Stats row */}
        <div style={{display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:14}}>
          {[
            {v:activeChemIds.length, l:"ACTIVE", c:C.teal},
            {v:`$${chemCost.toFixed(2)}/t`, l:"EST. COST/t FW", c:C.green},
            {v:conflicts.filter(c=>c.type==="conflict").length, l:"CONFLICTS", c:conflicts.filter(c=>c.type==="conflict").length>0?C.red:C.green},
            {v:conflicts.filter(c=>c.type==="redundant").length, l:"REDUNDANT", c:conflicts.filter(c=>c.type==="redundant").length>0?C.amber:C.green},
          ].map((s,i) => (
            <div key={i} style={S.statBox}>
              <div style={{...S.statVal, color:s.c}}>{s.v}</div>
              <div style={S.statLabel}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Conflicts */}
        {conflicts.length>0 && (
          <div style={{marginBottom:12}}>
            {conflicts.map((cf,i) => (
              <div key={i} style={{...S.conflict, borderColor: cf.type==="conflict" ? `${C.red}66` : `${C.amber}66`,
                background: cf.type==="conflict" ? `${C.red}12` : `${C.amber}12`,
                color: cf.type==="conflict" ? C.redLt : C.amberLt}}>
                {cf.type==="conflict" ? "⚡ CONFLICT: " : "⚠️ REDUNDANT: "}{cf.msg}
              </div>
            ))}
          </div>
        )}

        {/* Chemical groups */}
        {Object.entries(groups).map(([grp, chems]) => (
          <div key={grp}>
            <div style={S.sectionHdr}>{grp}</div>
            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:4}}>
              {chems.map(c => (
                <div key={c.id} style={{...S.card, opacity: c.id===29&&!c.pksa?1:1,
                  border:`1px solid ${chemOn[c.id] ? `${C.teal}55` : C.navyBorder}`,
                  background: chemOn[c.id] ? `${C.teal}08` : C.navyCard}}>
                  <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start"}}>
                    <div style={{flex:1, minWidth:0}}>
                      <div style={{fontSize:12, fontWeight:700, color: c.pksa ? C.amber : C.white, marginBottom:4}}>
                        {c.name}
                        {c.pksa && <span style={{...S.badge(C.amber,"xs"), marginLeft:6}}>FREE</span>}
                      </div>
                      <div style={{display:"flex", gap:6, flexWrap:"wrap", alignItems:"center"}}>
                        <Stars n={c.score}/>
                        <span style={S.badge(c.bsf==="✅"?C.green:C.amber,"xs")}>BSF {c.bsf}</span>
                        <span style={{...S.badge(C.blue,"xs")}}>EFB {c.efb}/5</span>
                        <span style={{...S.badge(C.purple,"xs")}}>OPDC {c.opdc}/5</span>
                      </div>
                      <div style={{color:C.grey, fontSize:9, marginTop:4}}>
                        Dose: {c.dose} · {c.pksa ? "COST: $0.00 (mill waste)" : `$${c.cost.toFixed(2)}/${c.unit.split("/")[1]||"t"} FW`}
                      </div>
                    </div>
                    <Toggle on={!!chemOn[c.id]} onClick={()=>setChemOn(p=>({...p,[c.id]:!p[c.id]}))}/>
                  </div>
                  {c.alert && chemOn[c.id] && <div style={S.alert}>{c.alert}</div>}
                  {c.pksa && <div style={{...S.badge(C.amber,"xs"), marginTop:6}}>⚡ PKSA = Palm Kernel Shell Ash — available at zero cost from mill operations</div>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ── BIO TAB ──
  function BioTab() {
    const activeOrgs = ORGANISMS.filter(o=>bioOn[o.id]);
    return (
      <div>
        {/* Stats */}
        <div style={{display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:14}}>
          {[
            {v:activeOrgs.length, l:"ACTIVE ORGS", c:C.teal},
            {v:`$${bioCost.toFixed(2)}/t`, l:"COST/t FW", c:C.green},
            {v:activeOrgs.filter(o=>o.cat.includes("N-Fixer")).length, l:"N-FIXERS", c:C.blue},
            {v:activeOrgs.filter(o=>o.cat.includes("WRF")||o.cat.includes("Thermo")).length, l:"DECOMPOSERS", c:C.purple},
          ].map((s,i) => (
            <div key={i} style={S.statBox}>
              <div style={{...S.statVal, color:s.c}}>{s.v}</div>
              <div style={S.statLabel}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* One-shot protocol box */}
        <div style={{...S.card, border:`1px solid ${C.teal}44`, marginBottom:14}}>
          <div style={S.cardHdr}>⚡ ONE-SHOT INOCULATION PROTOCOL</div>
          <div style={{fontSize:11, color:C.greyLt, lineHeight:1.8}}>
            <div><span style={{color:C.teal}}>Wave 1 Trigger:</span> pH sensor ≤8.0 (post-PKSA neutralisation)</div>
            <div><span style={{color:C.teal}}>Wave 2 Trigger:</span> Temperature &lt;50°C (protects N-fixing bacteria)</div>
            <div><span style={{color:C.teal}}>BSF Gate:</span> Temperature ≤30°C + all 6 criteria PASS</div>
            <div><span style={{color:C.amber}}>Minimum S3 duration:</span> 5 days hard-coded — no override permitted</div>
          </div>
        </div>

        {/* Organism categories */}
        {Object.entries(orgCategories).map(([cat, orgs]) => (
          <div key={cat}>
            <div style={S.sectionHdr}>{cat}</div>
            <div style={{display:"flex", flexDirection:"column", gap:6, marginBottom:4}}>
              {orgs.map(o => (
                <div key={o.id} style={{...S.card,
                  border:`1px solid ${o.btAlert && bioOn[o.id] ? `${C.red}88` : bioOn[o.id] ? `${C.teal}55` : o.btAlert ? `${C.red}44` : C.navyBorder}`,
                  background: o.btAlert && bioOn[o.id] ? `${C.red}14` : bioOn[o.id] ? `${C.teal}08` : C.navyCard}}>
                  <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                    <div style={{flex:1, minWidth:0}}>
                      <div style={{display:"flex", alignItems:"center", gap:8, marginBottom:3}}>
                        <span style={{fontSize:11, fontWeight:700, color: o.btAlert ? C.red : C.white}}>
                          {o.name}
                        </span>
                        {o.btAlert
                          ? <span style={{...S.badge(C.red,"xs")}}>⚠️ BSF TOXIC</span>
                          : <span style={S.badge(o.bsf==="✅"?C.green:C.amber,"xs")}>BSF {o.bsf}</span>
                        }
                        <Stars n={o.rank}/>
                      </div>
                      <div style={{color:C.greyLt, fontSize:10}}>{o.func}</div>
                      <div style={{color:C.grey, fontSize:9, marginTop:2}}>
                        Temp: {o.temp}°C · Cost: ${o.cost.toFixed(2)}/t FW
                      </div>
                      {/* Always show amber caution when off; red full warning when on */}
                      {o.btAlert && !bioOn[o.id] && (
                        <div style={S.alert}>
                          ⚠️ Non-BSF use only. Toggle on to reveal full pathway warning.
                        </div>
                      )}
                      {o.btAlert && bioOn[o.id] && (
                        <div style={{...S.alert, background:`${C.red}18`, borderColor:`${C.red}66`, color:C.redLt}}>
                          🔴 ACTIVE WARNING: Bt Cry proteins are acutely toxic to Black Soldier Fly (Diptera). NEVER use on BSF rearing pathways. Permitted only for non-BSF insect pest control — confirm pathway in writing before deployment.
                        </div>
                      )}
                    </div>
                    <Toggle on={!!bioOn[o.id]} onClick={()=>setBioOn(p=>({...p,[o.id]:!p[o.id]}))}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ── SOILS TAB ──
  function SoilsTab() {
    const selectedSoil = SOILS.find(s=>s.id===soil);
    return (
      <div>
        <div style={S.sectionHdr}>INDONESIAN PALM SOIL TYPES — SELECT TARGET SOIL</div>
        <div style={{display:"flex", flexDirection:"column", gap:8, marginBottom:16}}>
          {SOILS.map(s => (
            <div key={s.id} onClick={()=>setSoil(s.id)} style={{...S.card, cursor:"pointer",
              border:`2px solid ${soil===s.id ? s.color : C.navyBorder}`,
              background: soil===s.id ? `${s.color}10` : C.navyCard}}>
              <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                <div>
                  <div style={{display:"flex", gap:8, alignItems:"center", marginBottom:4}}>
                    <span style={{fontWeight:700, color:soil===s.id?s.color:C.white, fontSize:13}}>{s.name}</span>
                    <span style={S.badge(s.color,"xs")}>{s.pct} of area</span>
                    <span style={{...S.badge(C.grey,"xs")}}>pH {s.ph}</span>
                    <span style={{...S.badge(C.blue,"xs")}}>CEC {s.cec}</span>
                  </div>
                  <div style={{color:C.greyLt, fontSize:10}}>{s.note}</div>
                </div>
                <div style={{width:16, height:16, borderRadius:"50%",
                  background: soil===s.id ? s.color : "transparent",
                  border:`2px solid ${s.color}`}}/>
              </div>
            </div>
          ))}
        </div>

        {selectedSoil && (
          <div style={{...S.card, border:`1px solid ${selectedSoil.color}55`}}>
            <div style={{...S.cardHdr, color:selectedSoil.color}}>⟶ {selectedSoil.name.toUpperCase()} — FERTILISER ADJUSTMENT GUIDE</div>
            <div style={{display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:12}}>
              {[
                {l:"N Adjustment", v:selectedSoil.nAdj, c: selectedSoil.nAdj.startsWith("-") ? C.green : C.amber},
                {l:"P Adjustment", v:selectedSoil.pAdj, c: selectedSoil.pAdj.startsWith("-") ? C.green : C.amber},
                {l:"Soil pH", v:selectedSoil.ph, c: selectedSoil.ph < 4.0 ? C.red : selectedSoil.ph < 4.5 ? C.amber : C.green},
              ].map((s,i) => (
                <div key={i} style={S.statBox}>
                  <div style={{...S.statVal, color:s.c}}>{s.v}</div>
                  <div style={S.statLabel}>{s.l}</div>
                </div>
              ))}
            </div>
            <div style={{fontSize:11, color:C.greyLt, lineHeight:1.8}}>
              {selectedSoil.id==="histosols" && <div style={S.alert}>🌿 Histosols (peat): High organic C (24.5%) locks N — apply 80% less N, 70% less P. Drainage management critical.</div>}
              {selectedSoil.id==="inceptisols" && <div style={{...S.alert, background:`${C.green}12`, borderColor:`${C.green}44`, color:C.green}}>✅ Inceptisols: Best natural fertility. CFI frass+PKSA targets these soils first for maximum agronomic ROI.</div>}
              {selectedSoil.id==="spodosols" && <div style={S.alert}>⚠️ Spodosols: Lowest fertility profile. 31% yield gap vs Ultisols. Biochar amendment strongly recommended.</div>}
              {selectedSoil.id==="oxisols" && <div style={S.alert}>⚠️ Oxisols: Fe/Al oxides fix phosphorus. Increase P rate by 25% and use P-solubilising organisms.</div>}
              {selectedSoil.id==="ultisols" && <div style={{...S.alert, background:`${C.teal}12`, borderColor:`${C.teal}44`, color:C.tealLt}}>ℹ Ultisols: Standard NPK baseline. CEC 8.2, base saturation 22% — lime recommended for optimal frass uptake.</div>}
            </div>
          </div>
        )}

        {/* NPK replacement pricing */}
        <div style={S.sectionHdr}>CANONICAL FERTILISER REPLACEMENT PRICES</div>
        <div style={{...S.card}}>
          <table style={{width:"100%", borderCollapse:"collapse"}}>
            <thead>
              <tr>
                {["FERTILISER","PRICE/t","NUTRIENT%","$/kg NUTRIENT","CFI BASIS"].map((h,i) => (
                  <td key={i} style={S.tblHdr}>{h}</td>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Urea","$350/t","46% N","$0.761/kg N","Urea actual; Sinar Mas $1.50/kg N incl. penalties"],
                ["TSP","$450/t","46% P₂O₅","$0.978/kg P₂O₅","Standard import price"],
                ["MOP","$380/t","60% K₂O","$0.633/kg K₂O","Standard import price"],
                ["Kieserite","$280/t","27% MgO","$1.037/kg Mg","Secondary nutrient replacement"],
                ["Ag Lime","$80/t","30% CaO","$0.267/kg Ca","For pH correction value"],
                ["OM Premium","$60/t×QI","—","—","Quality Index × $60/t"],
              ].map((r,i) => (
                <tr key={i}>
                  {r.map((cell,j) => (
                    <td key={j} style={{...S.tblCell(i%2===0), color: j===3?C.teal:j===0?C.white:C.greyLt}}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ── AGRONOMICS TAB ──
  function AgTab() {
    const selSoil = SOILS.find(s=>s.id===soil);
    return (
      <div>
        <div style={{...S.card, border:`1px solid ${C.blue}44`, marginBottom:14}}>
          <div style={S.cardHdr}>
            <span style={{color:C.blue}}>▶</span>
            CURRENT SOIL: {selSoil?.name.toUpperCase()} · TARGET: Sinar Mas / Wilmar / Astra Agro estates
          </div>
          <div style={{fontSize:10, color:C.greyLt}}>
            CFI direct customer = plantation estate company. Frass and biofertiliser products sold to estate agronomists, not smallholders.
          </div>
        </div>

        <div style={S.sectionHdr}>AGRONOMIC PRACTICES — TOGGLE APPLICABLE</div>
        <div style={{display:"flex", flexDirection:"column", gap:8}}>
          {AG_PRACTICES.map(p => {
            const compatible = p.compatible.includes(soil);
            return (
              <div key={p.id} style={{...S.card,
                border:`1px solid ${agOn[p.id] ? `${C.teal}55` : compatible ? `${C.navyBorder}` : `${C.red}22`}`,
                background: agOn[p.id] ? `${C.teal}08` : C.navyCard,
                opacity: compatible ? 1 : 0.6}}>
                <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                  <div>
                    <div style={{display:"flex", gap:8, alignItems:"center", marginBottom:3}}>
                      <span style={{fontWeight:700, color:C.white, fontSize:12}}>{p.name}</span>
                      <span style={S.badge(compatible?C.green:C.red,"xs")}>{compatible?"✓ COMPATIBLE":"× NOT RECOMMENDED"}</span>
                    </div>
                    <div style={{color:C.greyLt, fontSize:10}}>{p.benefit}</div>
                    <div style={{color:C.teal, fontSize:10, marginTop:2}}>Uplift: {p.uplift}</div>
                  </div>
                  <Toggle on={!!agOn[p.id]} onClick={()=>setAgOn(p2=>({...p2,[p.id]:!p2[p.id]}))}/>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── OPTIMIZER TAB ──
  function OptimizerTab() {
    const activeChems = CHEMICALS.filter(c=>chemOn[c.id]);
    const activeOrgs = ORGANISMS.filter(o=>bioOn[o.id]&&!o.btAlert);
    const activePractices = AG_PRACTICES.filter(p=>agOn[p.id]);
    const selSoil = SOILS.find(s=>s.id===soil);
    const hasPKSA = chemOn[29];
    const hasConflicts = conflicts.filter(c=>c.type==="conflict").length > 0;
    const hasRedundant = conflicts.filter(c=>c.type==="redundant").length > 0;
    const hasNFixer = activeOrgs.some(o=>o.cat.includes("N-Fixer"));
    const hasLigninFungi = activeOrgs.some(o=>o.cat.includes("WRF"));
    const hasPSol = activeOrgs.some(o=>o.cat.includes("P-Sol"));
    const hasEnzyme = activeOrgs.some(o=>o.cat.includes("Enzyme"));
    const totalCost = chemCost + bioCost;

    const score = Math.min(100, Math.round(
      (hasPKSA?20:0) +
      (activeOrgs.length>=5?15:activeOrgs.length*3) +
      (hasNFixer?10:0) +
      (hasLigninFungi?10:0) +
      (hasPSol?5:0) +
      (hasEnzyme?5:0) +
      (activePractices.length*3) -
      (hasConflicts?20:0) -
      (hasRedundant?5:0)
    ));

    const scoreColor = score>=80?C.green:score>=60?C.teal:score>=40?C.amber:C.red;
    const scoreLabel = score>=80?"EXCELLENT":score>=60?"GOOD":score>=40?"MARGINAL":"POOR";

    return (
      <div>
        {/* Overall score */}
        <div style={{...S.card, border:`1px solid ${scoreColor}55`, textAlign:"center", padding:"20px 14px", marginBottom:14}}>
          <div style={{fontSize:48, fontWeight:700, color:scoreColor, lineHeight:1}}>{score}</div>
          <div style={{...S.badge(scoreColor), margin:"8px auto 0", display:"inline-block", fontSize:13, padding:"3px 14px"}}>{scoreLabel}</div>
          <div style={{color:C.grey, fontSize:10, marginTop:6}}>PROTOCOL OPTIMISATION SCORE</div>
        </div>

        {/* Summary stats */}
        <div style={{display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:14}}>
          {[
            {v:activeChems.length, l:"CHEMICALS", c:C.teal},
            {v:activeOrgs.length, l:"ORGANISMS", c:C.green},
            {v:`$${totalCost.toFixed(2)}/t`, l:"TOTAL COST/t FW", c:C.amber},
          ].map((s,i) => (
            <div key={i} style={S.statBox}>
              <div style={{...S.statVal, color:s.c}}>{s.v}</div>
              <div style={S.statLabel}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Issues */}
        {(hasConflicts||hasRedundant) && (
          <div style={{marginBottom:12}}>
            <div style={S.sectionHdr}>⚠️ ISSUES TO RESOLVE</div>
            {conflicts.map((cf,i) => (
              <div key={i} style={{...S.conflict,
                borderColor: cf.type==="conflict" ? `${C.red}66` : `${C.amber}66`,
                background: cf.type==="conflict" ? `${C.red}12` : `${C.amber}12`,
                color: cf.type==="conflict" ? C.redLt : C.amberLt}}>
                {cf.type==="conflict" ? "⛔ " : "⚠️ "}{cf.msg}
              </div>
            ))}
          </div>
        )}

        {/* Recommendations */}
        <div style={S.sectionHdr}>RECOMMENDATIONS</div>
        <div style={{display:"flex", flexDirection:"column", gap:8}}>
          {!hasPKSA && (
            <div style={{...S.card, border:`1px solid ${C.amber}55`}}>
              <div style={{color:C.amber, fontSize:11, fontWeight:700}}>💡 Enable PKSA</div>
              <div style={{color:C.greyLt, fontSize:10, marginTop:4}}>PKSA is free mill waste with score 5/5. It provides alkaline pretreatment, 30-35% lignin reduction, and K supply. Should always be active as the primary S2 chemical.</div>
            </div>
          )}
          {!hasNFixer && (
            <div style={{...S.card, border:`1px solid ${C.blue}44`}}>
              <div style={{color:C.blue, fontSize:11, fontWeight:700}}>💡 Add N-Fixing Organisms</div>
              <div style={{color:C.greyLt, fontSize:10, marginTop:4}}>Azotobacter vinelandii (ICBB9098) fixes 10-20mg N/kg/day — critical for substrate N enrichment before BSF rearing. Add Azospirillum for IAA phytohormone benefit.</div>
            </div>
          )}
          {!hasLigninFungi && (
            <div style={{...S.card, border:`1px solid ${C.purple}44`}}>
              <div style={{color:C.purple, fontSize:11, fontWeight:700}}>💡 Add White-Rot Fungi</div>
              <div style={{color:C.greyLt, fontSize:10, marginTop:4}}>Phanerochaete sp. (ICBB9182) or Pleurotus ostreatus for biological lignin degradation. Complements PKSA chemical treatment for 40-52% BSF yield uplift.</div>
            </div>
          )}
          {activeOrgs.length < 5 && (
            <div style={{...S.card, border:`1px solid ${C.teal}44`}}>
              <div style={{color:C.teal, fontSize:11, fontWeight:700}}>💡 Build Full Consortium</div>
              <div style={{color:C.greyLt, fontSize:10, marginTop:4}}>A 5+ organism consortium (Thermo + WRF + Bacteria + N-Fixer + P-Sol) delivers 40-52% BSF yield uplift vs. no inoculation. Core IPB Provibio 9-organism pack: ~$0.65/t FW.</div>
            </div>
          )}
          {selSoil?.id==="histosols" && (
            <div style={{...S.alert}}>
              🌿 Histosol target detected: Apply 80% less N (N locked in peat). Prioritise K and P fractions. Drainage management required before frass application.
            </div>
          )}
          {score>=80 && (
            <div style={{...S.card, border:`1px solid ${C.green}55`, background:`${C.green}08`}}>
              <div style={{color:C.green, fontSize:11, fontWeight:700}}>✅ Protocol Optimised</div>
              <div style={{color:C.greyLt, fontSize:10, marginTop:4}}>All key components active. No conflicts. Estimated treatment cost ${totalCost.toFixed(2)}/t FW is within target range ($0.65–$2.50/t FW for full protocol).</div>
            </div>
          )}
        </div>

        {/* Active summary table */}
        <div style={{...S.sectionHdr, marginTop:16}}>ACTIVE PROTOCOL SUMMARY</div>
        <div style={S.card}>
          {[
            {label:"S2 Chemicals", items: activeChems.map(c=>c.name), color:C.teal},
            {label:"S3 Organisms", items: activeOrgs.map(o=>o.name.split(" ").slice(0,2).join(" ")), color:C.green},
            {label:"Soil Target", items:[selSoil?.name||"—"], color:C.amber},
            {label:"Ag Practices", items: activePractices.map(p=>p.name), color:C.blue},
          ].map((row,i) => (
            <div key={i} style={{display:"flex", gap:10, marginBottom:8, alignItems:"flex-start"}}>
              <div style={{color:row.color, fontSize:10, fontWeight:700, width:100, flexShrink:0, letterSpacing:"0.06em"}}>{row.label}</div>
              <div style={{flex:1, display:"flex", flexWrap:"wrap", gap:4}}>
                {row.items.length===0
                  ? <span style={{color:C.grey, fontSize:10}}>None selected</span>
                  : row.items.map((item,j) => <span key={j} style={S.badge(row.color,"xs")}>{item}</span>)
                }
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const tabContent = [<ChemTab/>, <BioTab/>, <SoilsTab/>, <AgTab/>, <OptimizerTab/>];

  return (
    <div style={S.wrap}>
      <div style={S.header}>
        <div>
          <div style={S.logo}>CFI TREATMENT OPTIMIZER</div>
          <div style={S.sub}>31 CHEMICALS · 40 ORGANISMS · 5 SOIL TYPES · 10 AG PRACTICES · LIVE CONFLICT DETECTION</div>
        </div>
        <div style={{marginLeft:"auto", display:"flex", gap:8, alignItems:"center"}}>
          {conflicts.filter(c=>c.type==="conflict").length > 0 && (
            <span style={S.badge(C.red)}>⚡ {conflicts.filter(c=>c.type==="conflict").length} CONFLICT{conflicts.filter(c=>c.type==="conflict").length>1?"S":""}</span>
          )}
          {conflicts.filter(c=>c.type==="redundant").length > 0 && (
            <span style={S.badge(C.amber)}>⚠️ {conflicts.filter(c=>c.type==="redundant").length} REDUNDANT</span>
          )}
          {conflicts.length===0 && <span style={S.badge(C.green)}>✓ NO CONFLICTS</span>}
          <span style={S.badge(C.teal)}>60 TPH · BOGOR</span>
        </div>
      </div>
      <div style={S.tabs}>
        {TABS.map((t,i) => (
          <button key={i} style={S.tab(tab===i)} onClick={()=>setTab(i)}>{t}</button>
        ))}
      </div>
      <div style={S.body}>
        {tabContent[tab]}
        <div style={{textAlign:"center", color:C.grey, fontSize:9, marginTop:20, paddingTop:12,
          borderTop:`1px solid ${C.navyBorder}`}}>
          CFI Bioconversion System · S2–S3 Treatment Optimizer · Bt ICBB6095 RED-FLAGGED (non-BSF use only) · PKSA $0.00 (mill waste) · v3.1
        </div>
      </div>
    </div>
  );
}
