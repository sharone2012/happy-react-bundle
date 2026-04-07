import { useState, useMemo } from "react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, ReferenceLine, Legend
} from "recharts";

// ══ COLOUR CONSTANTS (CFI standard) ═══════════════════════════════════════════
const C = {
  navy:"#060e1e", navyMid:"#0a1628", navyLt:"#0f2040",
  teal:"#14b8a6", tealLt:"#5eead4",
  amber:"#f59e0b", amberLt:"#fcd34d",
  green:"#22c55e", greenLt:"#86efac",
  blue:"#3b82f6", blueLt:"#93c5fd",
  red:"#ef4444",  redLt:"#fca5a5",
  purple:"#a855f7",purpleLt:"#d8b4fe",
  orange:"#f97316",orangeLt:"#fdba74",
  grey:"#94a3b8", greyLt:"#cbd5e1",
  white:"#e8f0fe",
};

// ══ BIOAVAILABILITY CURVE DATA ════════════════════════════════════════════════
// Arrays of {d: day, v: pct_available} per soil × nutrient × source
// Sources: urea (synthetic N), tsp (synthetic P), cirp (rock phosphate),
//          mop (synthetic K), frass (CFI biofertiliser)

const BIOAVAIL = {
  N: {
    // Urea N bioavailability curves (% plant-available) — IPCC-consistent
    inceptisol: [{d:0,v:5},{d:3,v:28},{d:7,v:52},{d:14,v:65},{d:21,v:62},{d:30,v:52},
                 {d:45,v:40},{d:60,v:30},{d:90,v:22},{d:120,v:15},{d:180,v:10},{d:270,v:7},{d:365,v:5}],
    ultisol:    [{d:0,v:5},{d:3,v:25},{d:7,v:48},{d:14,v:55},{d:21,v:48},{d:30,v:38},
                 {d:45,v:25},{d:60,v:16},{d:90,v:10},{d:120,v:6},{d:180,v:4},{d:270,v:2},{d:365,v:1}],
    oxisol:     [{d:0,v:5},{d:3,v:22},{d:7,v:44},{d:14,v:50},{d:21,v:40},{d:30,v:28},
                 {d:45,v:16},{d:60,v:9},{d:90,v:5},{d:120,v:3},{d:180,v:2},{d:270,v:1},{d:365,v:1}],
    histosol:   [{d:0,v:4},{d:3,v:18},{d:7,v:32},{d:14,v:38},{d:21,v:35},{d:30,v:30},
                 {d:45,v:24},{d:60,v:18},{d:90,v:13},{d:120,v:9},{d:180,v:6},{d:270,v:4},{d:365,v:3}],
    spodosol:   [{d:0,v:5},{d:3,v:20},{d:7,v:40},{d:14,v:45},{d:21,v:35},{d:30,v:22},
                 {d:45,v:12},{d:60,v:7},{d:90,v:4},{d:120,v:2},{d:180,v:1},{d:270,v:1},{d:365,v:1}],
    // CFI frass N — protein-bound, slow but sustained release
    frass:      [{d:0,v:6},{d:3,v:10},{d:7,v:16},{d:14,v:24},{d:21,v:30},{d:30,v:36},
                 {d:45,v:42},{d:60,v:44},{d:90,v:42},{d:120,v:38},{d:180,v:30},{d:270,v:22},{d:365,v:16}],
    criticalThreshold: 15,   // % — below this, re-application window opens
    peakDay: {inceptisol:14, ultisol:14, oxisol:14, histosol:14, spodosol:14, frass:60},
  },
  P: {
    // TSP P bioavailability (% remaining available after fixation/retention)
    inceptisol_tsp: [{d:0,v:100},{d:3,v:78},{d:7,v:68},{d:14,v:58},{d:30,v:50},{d:60,v:46},{d:90,v:44},{d:180,v:42},{d:365,v:40}],
    ultisol_tsp:    [{d:0,v:100},{d:3,v:62},{d:7,v:48},{d:14,v:36},{d:30,v:26},{d:60,v:22},{d:90,v:20},{d:180,v:18},{d:365,v:17}],
    oxisol_tsp:     [{d:0,v:100},{d:3,v:45},{d:7,v:30},{d:14,v:20},{d:30,v:15},{d:60,v:13},{d:90,v:12},{d:180,v:11},{d:365,v:10}],
    histosol_tsp:   [{d:0,v:100},{d:3,v:80},{d:7,v:70},{d:14,v:63},{d:30,v:58},{d:60,v:55},{d:90,v:53},{d:180,v:52},{d:365,v:51}],
    spodosol_tsp:   [{d:0,v:100},{d:3,v:74},{d:7,v:62},{d:14,v:52},{d:30,v:44},{d:60,v:40},{d:90,v:38},{d:180,v:36},{d:365,v:35}],
    // CIRP (Ciamis Rock Phosphate) — slow-release, soil-independent dissolution
    cirp:           [{d:0,v:15},{d:7,v:20},{d:14,v:28},{d:30,v:40},{d:60,v:52},{d:90,v:60},{d:180,v:67},{d:270,v:70},{d:365,v:70}],
    // CFI frass P — enzymatic release, bypasses Fe/Al fixation
    frass:          [{d:0,v:22},{d:7,v:34},{d:14,v:50},{d:30,v:64},{d:60,v:70},{d:90,v:72},{d:180,v:68},{d:270,v:62},{d:365,v:58}],
    fixationPct: {inceptisol:28, ultisol:52, oxisol:72, histosol:35, spodosol:35},
    loadingFactor: {inceptisol:1.30, ultisol:1.75, oxisol:2.20, histosol:1.55, spodosol:1.60},
  },
  K: {
    // MOP K bioavailability (% retained in plant-available form) — leaching curve
    inceptisol: [{d:0,v:98},{d:7,v:88},{d:14,v:78},{d:30,v:65},{d:60,v:54},{d:90,v:46},{d:180,v:38},{d:270,v:32},{d:365,v:28}],
    ultisol:    [{d:0,v:98},{d:7,v:83},{d:14,v:68},{d:30,v:52},{d:60,v:38},{d:90,v:29},{d:180,v:22},{d:270,v:18},{d:365,v:15}],
    oxisol:     [{d:0,v:98},{d:7,v:76},{d:14,v:56},{d:30,v:36},{d:60,v:23},{d:90,v:16},{d:180,v:10},{d:270,v:7},{d:365,v:6}],
    histosol:   [{d:0,v:98},{d:7,v:90},{d:14,v:82},{d:30,v:72},{d:60,v:62},{d:90,v:55},{d:180,v:48},{d:270,v:42},{d:365,v:38}],
    spodosol:   [{d:0,v:98},{d:7,v:65},{d:14,v:42},{d:30,v:25},{d:60,v:14},{d:90,v:8},{d:180,v:5},{d:270,v:3},{d:365,v:2}],
    frass:      [{d:0,v:98},{d:7,v:92},{d:14,v:84},{d:30,v:74},{d:60,v:65},{d:90,v:56},{d:180,v:48},{d:270,v:40},{d:365,v:35}],
    luxuryCeiling: {desc:"Excess K uptake above 1.2% DM leaf K yields no additional FFB. Monitor leaf K to avoid luxury consumption masking true requirement."},
  },
};

// ══ AGE PHASE REQUIREMENTS ════════════════════════════════════════════════════
// kg nutrient per tree per year × soil type (143 palms/ha)
// Source: IOPRI/MPOB phase-specific schedules, adjusted per soil
const AGE_PHASES = {
  phases: [
    {id:"juvenile", label:"Juvenile", years:"Yr 0–3", desc:"Pre-bearing; root establishment; critical micronutrient window",
     nMultiplier:0.35, pMultiplier:0.50, kMultiplier:0.40, mgMultiplier:0.45,
     note:"Micronutrient demand 40–60% higher relative to N than mature palms. B and Cu deficiency in Yr 1–2 causes permanent canopy deformity.",
     highlight:"High micronutrient / low NPK phase — foliar applications preferred for B, Zn, Cu"},
    {id:"immature", label:"Immature", years:"Yr 3–5", desc:"Canopy closing; first production; ramp-up",
     nMultiplier:0.65, pMultiplier:0.75, kMultiplier:0.70, mgMultiplier:0.70,
     note:"Rapidly increasing K demand as FFB production begins. N split into smaller applications as root system develops.",
     highlight:"Ramp-up phase — increase K ahead of first significant harvest"},
    {id:"prime", label:"Prime Bearing", years:"Yr 7–15", desc:"Peak FFB; maximum nutrient demand; standard recommendation basis",
     nMultiplier:1.00, pMultiplier:1.00, kMultiplier:1.00, mgMultiplier:1.00,
     note:"Standard IOPRI/MPOB recommendation basis. All per-tree values in SOILS data refer to this phase.",
     highlight:"Maximum input phase — full NPK + correctives programme"},
    {id:"senescent", label:"Senescent", years:"Yr 16–25+", desc:"Declining yield; replanting cycle approaching; reduced N, maintained K",
     nMultiplier:0.80, pMultiplier:0.70, kMultiplier:0.95, mgMultiplier:0.85,
     note:"Reduce N as canopy thins. Maintain K to support remaining crop load. P can be reduced — residual soil P from prior years accumulates.",
     highlight:"Wind-down phase — reduce N; maintain K; watch Mg:K ratio"},
  ],
  // Micronutrient requirements by phase (kg element/tree/yr)
  micronutrients: {
    juvenile:  {B:0.08, Cu:0.04, Zn:0.03, Mn:0.02, Fe:0.0, foliarOnly:true,
                note:"Histosol juveniles need 0.10 kg B + 0.05 kg Cu. Spodosol juveniles: all 5 micronutrients foliar."},
    immature:  {B:0.06, Cu:0.03, Zn:0.02, Mn:0.01, Fe:0.0, foliarOnly:false},
    prime:     {B:0.05, Cu:0.02, Zn:0.02, Mn:0.01, Fe:0.0, foliarOnly:false},
    senescent: {B:0.04, Cu:0.01, Zn:0.01, Mn:0.0,  Fe:0.0, foliarOnly:false},
  },
};

// ══ N LEACHING TOP-UP CALCULATOR ════════════════════════════════════════════
// kg N / tree top-up required after cumulative rainfall events
// Based on soil leaching coefficients from IOPRI/BPT Bogor data
const N_TOPUP = {
  thresholds: [25, 50, 100, 150, 200],
  // kg N / tree required as compensatory top-up
  inceptisol: [0.01, 0.03, 0.07, 0.11, 0.15],
  ultisol:    [0.02, 0.05, 0.12, 0.18, 0.25],
  oxisol:     [0.03, 0.07, 0.16, 0.24, 0.35],
  histosol:   [0.02, 0.06, 0.14, 0.21, 0.30],
  spodosol:   [0.04, 0.09, 0.21, 0.33, 0.45],
  // Volatilisation loss (% of applied N as NH3 from surface urea)
  volatilisation: {
    inceptisol:{pct:8,  note:"Moderate urease activity; pH 4.1 limits volatilisation"},
    ultisol:   {pct:12, note:"Higher surface pH micro-zones after urea hydrolysis"},
    oxisol:    {pct:10, note:"Rapid leaching reduces NH3 contact time"},
    histosol:  {pct:22, note:"Very high urease in peat OM; highest volatilisation risk"},
    spodosol:  {pct:9,  note:"Low OM limits urease; rapid leaching competes"},
  },
  // Denitrification loss (% of applied N as N2O + N2)
  denitrification: {
    inceptisol:{pct:2,  note:"Moderate drainage; occasional anaerobic pockets"},
    ultisol:   {pct:4,  note:"Argillic B horizon creates waterlogging seasonally"},
    oxisol:    {pct:3,  note:"Good drainage; lower denitrification than Ultisol"},
    histosol:  {pct:15, note:"Waterlogged peat — highest denitrification; N2O emissions 8x mineral"},
    spodosol:  {pct:5,  note:"Spodic horizon waterlogging seasonally; elevated loss"},
  },
  // Biological immobilisation (% locked by microbial biomass)
  immobilisation: {
    inceptisol:{pct:8,  note:"Moderate C:N; manageable immobilisation"},
    ultisol:   {pct:10, note:"OM inputs from leaf litter compete for N"},
    oxisol:    {pct:6,  note:"Low OM means less microbial competition"},
    histosol:  {pct:35, note:"CRITICAL: Peat C:N >50 causes severe N immobilisation. Effective N 35% less than applied."},
    spodosol:  {pct:20, note:"Spodic organic matter horizon immobilises N; humus-N turnover slow"},
  },
};

// ══ GHG EMISSIONS DATA ═══════════════════════════════════════════════════════
// IPCC Tier 1 calculations, mature stand prime bearing
const GHG = {
  EF1_mineral: 0.010,   // 1.0% N applied as N2O-N (IPCC 2006 Vol4 Ch11)
  EF1_organic: 0.080,   // 8.0% for organic soils (Histosol)
  EF5: 0.011,           // Indirect N2O from leaching
  GWP_AR5: 265,         // N2O GWP100 IPCC AR5
  GWP_AR6: 273,         // N2O GWP100 IPCC AR6
  conv_N2O: 44/28,      // N2O-N to N2O
  // Scope 3 production emissions (kg CO2e / kg product N, P2O5, K2O, MgO)
  scope3: {
    urea:      {factor:2.40, unit:"kg CO2e/kg N",     label:"Urea (Haber-Bosch)"},
    tsp:       {factor:1.80, unit:"kg CO2e/kg P2O5",  label:"TSP (acidulation)"},
    mop:       {factor:0.50, unit:"kg CO2e/kg K2O",   label:"MOP (mining)"},
    kieserite: {factor:0.30, unit:"kg CO2e/kg MgO",   label:"Kieserite (mining)"},
    lime:      {factor:0.70, unit:"kg CO2e/kg CaO",   label:"Lime (calcination)"},
    gypsum:    {factor:0.10, unit:"kg CO2e/kg",        label:"Gypsum"},
  },
};

// ══ CORRECTIVE MINERALS PROGRAMME ════════════════════════════════════════════
// Per-soil mandatory / optional / not-recommended product classification
const CORRECTIVES = [
  {product:"Dolomitic Lime",   formula:"CaMg(CO3)2",  function:"pH + Ca + Mg",
   inceptisol:{status:"MANDATORY",   dose:"1,500 kg/ha every 3–4 yr", timing:"Pre-wet season"},
   ultisol:   {status:"MANDATORY",   dose:"2,000 kg/ha every 3 yr",   timing:"Pre-wet season"},
   oxisol:    {status:"OPTIONAL",    dose:"1,000 kg/ha",               timing:"Where Mg also low"},
   histosol:  {status:"NOT REC",     dose:"—",                         timing:"Water-table mgmt only"},
   spodosol:  {status:"OPTIONAL",    dose:"500 kg/ha",                 timing:"When Mg very low"},
   note:"Histosol: NO lime — peat pH managed by water table. Lime on peat causes explosive CH4 release."},
  {product:"Calcitic Lime",    formula:"CaCO3",       function:"pH + Ca",
   inceptisol:{status:"OPTIONAL",    dose:"—",                         timing:"If Mg not limiting"},
   ultisol:   {status:"OPTIONAL",    dose:"2,000 kg/ha every 3 yr",   timing:"Alternative to dolomite"},
   oxisol:    {status:"MANDATORY",   dose:"2,500 kg/ha every 2–3 yr", timing:"Pre-wet season"},
   histosol:  {status:"NOT REC",     dose:"—",                         timing:"—"},
   spodosol:  {status:"MANDATORY",   dose:"3,000 kg/ha every 2 yr",   timing:"Split — dry season only"},
   note:"Oxisol and Spodosol need aggressive liming — highest Al buffering + highest acidification rate."},
  {product:"Gypsum",           formula:"CaSO4.2H2O",  function:"Subsoil Ca + S",
   inceptisol:{status:"NOT REC",     dose:"—",                         timing:"Risk Ca:Mg imbalance"},
   ultisol:   {status:"MANDATORY",   dose:"250 kg/ha every 2 yr",     timing:"Pre-wet season, broadcast"},
   oxisol:    {status:"OPTIONAL",    dose:"200 kg/ha every 2 yr",     timing:"Where S also deficient"},
   histosol:  {status:"NOT REC",     dose:"—",                         timing:"SO4 to H2S in anaerobic peat"},
   spodosol:  {status:"MANDATORY",   dose:"400 kg Ca/ha/yr",           timing:"Annual — Ca-deficient"},
   note:"CRITICAL: Histosol — gypsum generates H2S in waterlogged peat (phytotoxic). Never apply."},
  {product:"Rock Phosphate (CIRP)",formula:"Ca3(PO4)2",function:"Slow-release P",
   inceptisol:{status:"OPTIONAL",    dose:"Blend 30:70 CIRP:TSP",     timing:"2x per year"},
   ultisol:   {status:"RECOMMENDED", dose:"Blend 50:50 CIRP:TSP",     timing:"2x per year"},
   oxisol:    {status:"MANDATORY",   dose:"400 kg P2O5/ha/yr split 2x",timing:"Primary P source"},
   histosol:  {status:"OPTIONAL",    dose:"Blend 20:80 CIRP:TSP",     timing:"1x per year"},
   spodosol:  {status:"RECOMMENDED", dose:"300 kg P2O5/ha/yr banded",  timing:"3x per year banded"},
   note:"CIRP outperforms TSP on high-fixation soils (Oxisol, Ultisol) after 60 days. Break-even: P fixation > 50%."},
  {product:"Kieserite",        formula:"MgSO4.H2O",   function:"Mg + S",
   inceptisol:{status:"MANDATORY",   dose:"71 kg MgO/ha/yr",          timing:"2x/yr with Urea"},
   ultisol:   {status:"MANDATORY",   dose:"100 kg MgO/ha/yr",         timing:"3x/yr with Urea"},
   oxisol:    {status:"MANDATORY",   dose:"114 kg MgO/ha/yr",         timing:"4x/yr with K applications"},
   histosol:  {status:"MANDATORY",   dose:"129 kg MgO/ha/yr",         timing:"4x/yr — K antagonism risk"},
   spodosol:  {status:"MANDATORY",   dose:"140 kg MgO/ha/yr",         timing:"4–5x/yr — extreme Mg leaching"},
   note:"Mandatory on all soils. Kieserite also supplies SO4-S critical for protein synthesis."},
  {product:"Calcium Silicate", formula:"CaSiO3",      function:"Si + P mobilisation",
   inceptisol:{status:"OPTIONAL",    dose:"300 kg/ha every 3 yr",     timing:"Dry season"},
   ultisol:   {status:"OPTIONAL",    dose:"300 kg/ha every 3 yr",     timing:"Dry season"},
   oxisol:    {status:"MANDATORY",   dose:"500 kg/ha every 3 yr",     timing:"Dry season"},
   histosol:  {status:"NOT REC",     dose:"—",                         timing:"Not applicable on peat"},
   spodosol:  {status:"OPTIONAL",    dose:"200 kg/ha every 3 yr",     timing:"Where Si deficiency noted"},
   note:"Oxisol: Si competes with P for goethite/gibbsite fixation sites — increases plant-available P 15–25%."},
  {product:"Colemanite (Boron)",formula:"CaB6O11",    function:"B — slow release",
   inceptisol:{status:"MANDATORY",   dose:"7 kg B/ha/yr",             timing:"1x granular + foliar yr 0–5"},
   ultisol:   {status:"MANDATORY",   dose:"9 kg B/ha/yr",             timing:"1–2x yr split"},
   oxisol:    {status:"MANDATORY",   dose:"10 kg B/ha/yr",            timing:"1x granular + 2x foliar"},
   histosol:  {status:"MANDATORY",   dose:"12 kg B/ha/yr",            timing:"3–4x/yr — peat immobilises B"},
   spodosol:  {status:"MANDATORY",   dose:"11 kg B/ha/yr",            timing:"All foliar — soil B leaches"},
   note:"Histosol needs highest B dose — peat OM forms stable B complexes. Spodosol: foliar only (soil leaches B immediately)."},
  {product:"Copper Sulphate",  formula:"CuSO4.5H2O",  function:"Cu deficiency",
   inceptisol:{status:"OPTIONAL",    dose:"2 kg Cu/ha/yr",            timing:"Foliar if deficiency"},
   ultisol:   {status:"OPTIONAL",    dose:"2–3 kg Cu/ha/yr",          timing:"Foliar"},
   oxisol:    {status:"MANDATORY",   dose:"3 kg Cu/ha/yr",            timing:"2-yr cycle; planting hole"},
   histosol:  {status:"MANDATORY",   dose:"4–5 kg Cu/ha/yr",          timing:"1x/yr foliar on juvenile"},
   spodosol:  {status:"MANDATORY",   dose:"4 kg Cu/ha/yr",            timing:"All foliar"},
   note:"Histosol CRITICAL: peat has near-zero available Cu. 'Little leaf' disease endemic on unmanaged peat palms."},
  {product:"Zinc Sulphate",    formula:"ZnSO4.7H2O",  function:"Zn deficiency",
   inceptisol:{status:"OPTIONAL",    dose:"2 kg Zn/ha/yr",            timing:"Foliar if pH <4.5"},
   ultisol:   {status:"RECOMMENDED", dose:"2–3 kg Zn/ha/yr",          timing:"Foliar preferred"},
   oxisol:    {status:"RECOMMENDED", dose:"3 kg Zn/ha/yr",            timing:"Foliar + planting hole"},
   histosol:  {status:"MANDATORY",   dose:"3 kg Zn/ha/yr",            timing:"Foliar — peat chelates soil Zn"},
   spodosol:  {status:"MANDATORY",   dose:"3 kg Zn/ha/yr",            timing:"All foliar"},
   note:"Zn solubility decreases rapidly below pH 5.0. Foliar application 3x more efficient than soil on acid soils."},
  {product:"Bentonite/Zeolite",formula:"—",           function:"CEC amendment",
   inceptisol:{status:"NOT REC",     dose:"—",                         timing:"CEC already adequate"},
   ultisol:   {status:"NOT REC",     dose:"—",                         timing:"Clay content provides CEC"},
   oxisol:    {status:"OPTIONAL",    dose:"2,000 kg/ha once",          timing:"Pre-plant"},
   histosol:  {status:"NOT REC",     dose:"—",                         timing:"Peat CEC already high"},
   spodosol:  {status:"MANDATORY",   dose:"2,000–5,000 kg/ha once",   timing:"Yr 0 pre-plant — critical"},
   note:"SPODOSOL MANDATORY: CEC of 2 meq cannot hold any nutrient without amendment. Single most impactful structural intervention."},
  {product:"EFB Mulch / CFI Frass",formula:"Organic",function:"OM + all nutrients + CEC",
   inceptisol:{status:"RECOMMENDED", dose:"30 t fresh/ha every 2 yr", timing:"Ring placement"},
   ultisol:   {status:"RECOMMENDED", dose:"40 t fresh/ha every 2 yr", timing:"Ring placement"},
   oxisol:    {status:"MANDATORY",   dose:"50 t fresh/ha every 2 yr", timing:"Ring placement — CEC critical"},
   histosol:  {status:"RECOMMENDED", dose:"20 t fresh/ha/yr",         timing:"Ring placement — no peat compaction"},
   spodosol:  {status:"MANDATORY",   dose:"50 t fresh/ha every 2 yr", timing:"Ring placement — transformative CEC"},
   note:"Spodosol & Oxisol: CEC rebuilding from compost is the single most transformative 5-year investment. Frass > EFB for nutrient density."},
];

// ══ LEAF TISSUE THRESHOLDS ════════════════════════════════════════════════════
const LEAF_THRESHOLDS = [
  {nutrient:"N",  leaflet:"Frond 17", adequate:"2.4–2.8%",  deficient:"<2.4%",  critical:"<2.2%",  toxicity:">3.2%",  symptom:"Yellow fronds, stunted spear"},
  {nutrient:"P",  leaflet:"Frond 17", adequate:"0.155–0.19%",deficient:"<0.155%",critical:"<0.14%", toxicity:">0.25%", symptom:"Dark green bronzing, reduced root growth"},
  {nutrient:"K",  leaflet:"Frond 17", adequate:"0.85–1.20%", deficient:"<0.85%", critical:"<0.75%", toxicity:">1.4%",  symptom:"Orange spotting, crown disease"},
  {nutrient:"Mg", leaflet:"Frond 17", adequate:"0.25–0.35%", deficient:"<0.25%", critical:"<0.22%", toxicity:">0.5%",  symptom:"Confluent orange spotting (frond 17+)"},
  {nutrient:"Ca", leaflet:"Frond 17", adequate:"0.50–0.75%", deficient:"<0.50%", critical:"<0.40%", toxicity:">1.0%",  symptom:"Leaf tip necrosis, root die-back"},
  {nutrient:"B",  leaflet:"Frond 9",  adequate:"12–25 ppm",  deficient:"<12 ppm",critical:"<9 ppm", toxicity:">30 ppm",symptom:"Blind pocket, fish-bone fronds"},
  {nutrient:"Cu", leaflet:"Frond 17", adequate:"5–12 ppm",   deficient:"<5 ppm", critical:"<3 ppm", toxicity:">20 ppm",symptom:"Little leaf, frond deformity (esp. Histosol)"},
  {nutrient:"Zn", leaflet:"Frond 17", adequate:"12–20 ppm",  deficient:"<12 ppm",critical:"<8 ppm", toxicity:">50 ppm",symptom:"Interveinal chlorosis, reduced growth"},
];

// ══ COMPLETE SOIL DATABASE ════════════════════════════════════════════════════
const SOILS = [
  {
    id:"inceptisol", name:"Inceptisols", nameLocal:"Kambisol / Gleisol",
    pctIndo:"39%", color:C.teal,
    ph:{min:3.8, max:4.5, typical:4.1}, cec:15.4, omPct:3.5, clayPct:28,
    texture:"Clay loam to silty clay loam", drainage:"Moderate to well-drained",
    description:"Young, weakly-developed mineral soils. Moderate weathering gives better fertility than older tropical soils — best mineral soil for palm in Indonesia.",
    palmCoverage:"~56 million ha. Dominant in North Sumatra, West Java, West Sumatra.",
    nLeach:{risk:"Moderate",riskScore:3,kgHaYr:{low:30,high:55,typical:42},
      mechanism:"Moderate CEC (15 meq/100g) retains some NH4+. NO3- still mobile in heavy rainfall.",
      cfiFix:"CFI biofertiliser slow-release N reduces leaching 35–50% vs urea on Inceptisols."},
    pFix:{risk:"Low–Moderate",riskScore:2,pctFixed:{low:20,high:38,typical:28},
      mechanism:"Moderate Fe/Al oxide content at pH 4.1. Liming to pH 5.5 releases 30–40% of fixed P.",
      cfiFix:"Mycorrhizal associations (S3 inoculant) mobilise fixed P — key CFI advantage."},
    problems:[
      {rank:1,issue:"Aluminium toxicity at pH <4.5",severity:"HIGH",detail:"Al3+ inhibits root elongation and P uptake. Affects 60–70% of Inceptisol palm areas."},
      {rank:2,issue:"Magnesium deficiency",severity:"HIGH",detail:"Ca:Mg imbalance. Orange-frond causes 10–15% yield loss."},
      {rank:3,issue:"Boron deficiency",severity:"MEDIUM",detail:"B leaches rapidly in high rainfall. Blind pocket disease."},
    ],
    fertReq:{
      plantingDensity:143,
      note:"IOPRI/MPOB Inceptisol, mature stand yr 7–15, 22–24 t FFB/ha/yr target.",
      n:  {perTreeKg:1.8, perHaKg:257, product:"Urea 46% N",        timing:"Split 2–3x/yr",     unitCost:0.35},
      p:  {perTreeKg:0.45,perHaKg:64,  product:"TSP / CIRP 18%",    timing:"2x/yr",              unitCost:0.45},
      k:  {perTreeKg:2.8, perHaKg:400, product:"MOP 60% K2O",       timing:"2–3x/yr",            unitCost:0.38},
      mg: {perTreeKg:0.5, perHaKg:71,  product:"Kieserite 27% MgO", timing:"2x/yr with Urea",   unitCost:0.28},
      b:  {perTreeKg:0.05,perHaKg:7,   product:"Colemanite 14% B",  timing:"1x/yr",              unitCost:1.20},
      lime:{perHaKg:1500,               product:"Dolomitic lime",    timing:"Every 3–4 yr",      unitCost:0.08},
      totalCostHaYr:580,
    },
    limeReq:{tonsHa:1.5, targetPH:5.2, note:"Dolomitic lime — raises pH + supplies Mg."},
    cfiAdvantage:"HIGH — 30–40% mineral fertiliser substitution expected.",
    cfiSubstitutionPct:35,
    radarScores:{fertility:72,nRetention:58,pAvailability:65,drainability:75,yieldPotential:80,cfiResponse:70},
    cfiValue:{nLossFrac:0.35,pFixedFrac:0.28,nVal:57.13,pVal:25.69,kVal:17.23,total:100.05,
      note:"Best mineral soil — CFI value premium modest because fewer nutrients are wasted."},
    // GHG emissions (mature stand, prime bearing)
    ghg:{
      nApplied:257, leachedKg:42,
      directN2O_AR5:null, directN2O_AR6:null, indirectN2O:null,
      scope3_urea:null, scope3_tsp:null, scope3_mop:null, scope3_mg:null,
      totalScope3:null, totalGHG_AR5:null, cfiSavingPct:35,
    },
    appSchedule:{
      vgam:{N:3,P:2,K:3,Mg:2,B:1,lime:0.25},
      gam: {N:2,P:2,K:2,Mg:2,B:1,lime:0.25},
      poor:{N:2,P:1,K:2,Mg:1,B:1,lime:0},
      note:"Split N into minimum 3x at VGAM to match leaching intervals. Lime every 4 years = 0.25/yr.",
    },
  },
  {
    id:"ultisol", name:"Ultisols", nameLocal:"Podsolik Merah Kuning (PMK)",
    pctIndo:"24%", color:C.amber,
    ph:{min:4.0, max:5.0, typical:4.5}, cec:8.2, omPct:2.1, clayPct:42,
    texture:"Clay, argillic B horizon", drainage:"Moderate — impeded by clay B",
    description:"Deeply weathered, clay-rich soils. Characterised by strong Al toxicity and severe P fixation. The industry baseline reference soil for Indonesian palm.",
    palmCoverage:"~35 million ha. Dominant across Kalimantan lowlands, lowland Sumatra.",
    nLeach:{risk:"High",riskScore:4,kgHaYr:{low:50,high:85,typical:65},
      mechanism:"Low CEC (8 meq/100g). Argillic clay creates lateral flow. Up to 40% urea lost in first rainfall event.",
      cfiFix:"CFI slow-release protein N: 50–65% leaching reduction vs urea. Most impactful soil for CFI N case."},
    pFix:{risk:"High",riskScore:4,pctFixed:{low:40,high:65,typical:52},
      mechanism:"High Fe2O3/Al2O3 in Bt horizon. Industry applies 140–160% of crop P requirement.",
      cfiFix:"CFI organic P (phytate) not subject to Fe/Al fixation. 70–80% P availability vs 35–40% TSP."},
    problems:[
      {rank:1,issue:"Severe P fixation — deficiency despite heavy application",severity:"CRITICAL",detail:"Up to 65% of TSP unavailable. Largest single fertiliser cost driver."},
      {rank:2,issue:"Aluminium toxicity — root zone pH <4.5",severity:"HIGH",detail:"Al3+ causes root pruning. Critical in subsoil."},
      {rank:3,issue:"Low CEC — nutrient leaching",severity:"HIGH",detail:"K, Mg, Ca leach rapidly. Requires frequent smaller applications."},
    ],
    fertReq:{
      plantingDensity:143,
      note:"IOPRI PMK standard, mature stand yr 7–15, 20–22 t FFB/ha/yr, Kalimantan baseline.",
      n:  {perTreeKg:2.2, perHaKg:315, product:"Urea 46% N",        timing:"3–4x/yr split",     unitCost:0.35},
      p:  {perTreeKg:0.65,perHaKg:93,  product:"TSP + CIRP 50:50",  timing:"2x/yr",              unitCost:0.45},
      k:  {perTreeKg:3.2, perHaKg:458, product:"MOP 60% K2O",       timing:"3x/yr",              unitCost:0.38},
      mg: {perTreeKg:0.7, perHaKg:100, product:"Kieserite 27% MgO", timing:"3x/yr with Urea",   unitCost:0.28},
      b:  {perTreeKg:0.06,perHaKg:9,   product:"Colemanite/Borate", timing:"1x/yr",              unitCost:1.20},
      lime:{perHaKg:2000,               product:"Agricultural lime", timing:"Every 3 yr",        unitCost:0.08},
      totalCostHaYr:720,
    },
    limeReq:{tonsHa:2.0, targetPH:5.0, note:"Target pH 5.0–5.2. Deep clay soils buffer lime heavily."},
    cfiAdvantage:"VERY HIGH — P fixation bypass strongest CFI value. 40–55% substitution potential.",
    cfiSubstitutionPct:47,
    radarScores:{fertility:48,nRetention:38,pAvailability:32,drainability:52,yieldPotential:65,cfiResponse:88},
    cfiValue:{nLossFrac:0.50,pFixedFrac:0.80,nVal:74.00,pVal:99.21,kVal:17.23,total:190.44,
      note:"N. Sumatra Ultisol anchor value. Jambi/Kalimantan Acrisol equivalent: $220.67/t at P fixed 0.85."},
    ghg:{nApplied:315,leachedKg:65,directN2O_AR5:null,indirectN2O:null,scope3_urea:null,totalScope3:null,totalGHG_AR5:null,cfiSavingPct:47},
    appSchedule:{
      vgam:{N:4,P:2,K:3,Mg:3,B:1,lime:0.33},
      gam: {N:3,P:2,K:3,Mg:2,B:1,lime:0.33},
      poor:{N:2,P:1,K:2,Mg:1,B:1,lime:0},
      note:"Ultisol at VGAM: 4x N mandatory due to argillic bypass flow. 3x K to prevent leaching between applications.",
    },
  },
  {
    id:"oxisol", name:"Oxisols", nameLocal:"Latosol / Ferralsol",
    pctIndo:"8%", color:C.orange,
    ph:{min:4.0, max:4.8, typical:4.4}, cec:5.0, omPct:1.8, clayPct:55,
    texture:"Heavy clay (kaolinite + Fe/Al oxides)", drainage:"Good — stable aggregates",
    description:"Most highly weathered soils. Fe/Al oxides consume phosphate. Very low CEC. Require most intensive P management of any Indonesian soil.",
    palmCoverage:"~12 million ha. Central and East Kalimantan, parts of Sulawesi.",
    nLeach:{risk:"Very High",riskScore:5,kgHaYr:{low:65,high:100,typical:82},
      mechanism:"CEC 3–5 meq/100g. Pseudo-sand macro-aggregates create high hydraulic conductivity. 35–45% of urea-N lost within 7 days.",
      cfiFix:"CFI protein-N has 4–6x longer residence time on Oxisols. Humus rebuilds CEC over time."},
    pFix:{risk:"Very High — Highest of all 5 soils",riskScore:5,pctFixed:{low:60,high:82,typical:72},
      mechanism:"Goethite and gibbsite surfaces adsorb up to 800–1200 mg P/kg soil. Industry applies 200–250% of crop P requirement.",
      cfiFix:"CFI organic P bypasses goethite adsorption entirely. Frass raises Bray-P from <3 to 12–15 mg/kg in 2 cycles."},
    problems:[
      {rank:1,issue:"Catastrophic P fixation — fertiliser almost completely unavailable",severity:"CRITICAL",detail:"Industry norm: 200–250% of crop P demand applied. Still Bray-P rarely >5–8 mg/kg."},
      {rank:2,issue:"Extreme K and Mg leaching",severity:"HIGH",detail:"Very low CEC. Application frequency must be >=4x/yr."},
      {rank:3,issue:"Cu and Zn deficiency",severity:"HIGH",detail:"Micronutrients co-precipitate with Fe/Al oxides."},
    ],
    fertReq:{
      plantingDensity:143,
      note:"Modified IOPRI for Oxisol (Latosol) — P doubled, K split 4x, Cu/Zn included.",
      n:  {perTreeKg:2.5, perHaKg:358, product:"Coated urea / NBPT", timing:"4x/yr max 200g",   unitCost:0.42},
      p:  {perTreeKg:1.0, perHaKg:143, product:"CIRP + Humate-P",    timing:"3x/yr",             unitCost:0.52},
      k:  {perTreeKg:3.8, perHaKg:543, product:"MOP + SOP",          timing:"4x/yr max 400g",   unitCost:0.38},
      mg: {perTreeKg:0.8, perHaKg:114, product:"Kieserite 27% MgO",  timing:"4x/yr with K",     unitCost:0.28},
      b:  {perTreeKg:0.07,perHaKg:10,  product:"Borate 48% / Solubor",timing:"1x + 2x foliar",  unitCost:1.20},
      cu: {perTreeKg:0.02,perHaKg:3,   product:"Copper sulphate",    timing:"2-yr cycle",        unitCost:1.80},
      lime:{perHaKg:2500,               product:"Agricultural lime",  timing:"Every 2–3 yr",     unitCost:0.08},
      totalCostHaYr:920,
    },
    limeReq:{tonsHa:2.5, targetPH:5.0, note:"Highest lime requirement — high Al buffering. Lime also partially neutralises P fixation."},
    cfiAdvantage:"EXTREME — CFI organic P 3–5x more available than TSP. 50–65% substitution long-term.",
    cfiSubstitutionPct:57,
    radarScores:{fertility:32,nRetention:25,pAvailability:20,drainability:82,yieldPotential:58,cfiResponse:95},
    cfiValue:{nLossFrac:0.60,pFixedFrac:0.72,nVal:92.88,pVal:86.73,kVal:17.23,total:196.84,
      note:"Highest total CFI value of any soil. Extreme P fixation + high N loss."},
    ghg:{nApplied:358,leachedKg:82,directN2O_AR5:null,indirectN2O:null,scope3_urea:null,totalScope3:null,totalGHG_AR5:null,cfiSavingPct:57},
    appSchedule:{
      vgam:{N:4,P:3,K:4,Mg:4,B:2,lime:0.40},
      gam: {N:3,P:2,K:4,Mg:3,B:1,lime:0.33},
      poor:{N:2,P:2,K:3,Mg:2,B:1,lime:0},
      note:"Oxisol at VGAM: K must be 4x/yr minimum (CEC 5 cannot hold K between applications). P always 3x minimum.",
    },
  },
  {
    id:"histosol", name:"Histosols (Peat)", nameLocal:"Tanah Gambut / Organosol",
    pctIndo:"7%", color:C.green,
    ph:{min:3.5, max:4.2, typical:3.8}, cec:35.0, omPct:85, clayPct:0,
    texture:"Fibric to sapric peat — no mineral particles", drainage:"Artificially drained (canal systems)",
    description:"Partially decomposed forest biomass. High CEC from OM but key elements (Cu, Zn, K) absent. pH 3.8 inhibits nitrification. GHG emissions 6–10x mineral soils.",
    palmCoverage:"~10 million ha. Riau, Jambi, West/Central Kalimantan. Controversial under RSPO.",
    nLeach:{risk:"Moderate (but high N2O emissions)",riskScore:3,kgHaYr:{low:60,high:120,typical:90},
      mechanism:"High CEC retains NH4+ (less leaching) BUT nitrification inhibited below pH 4.5. N2O emissions 8x mineral soils (IPCC). Volatilisation very high (22%) due to urease in peat OM.",
      cfiFix:"CFI N on peat: slow-release protein N reduces volatilisation. Primary advantage is emission reduction, not just leaching."},
    pFix:{risk:"Low–Moderate (OM-bound)",riskScore:2,pctFixed:{low:25,high:40,typical:35},
      mechanism:"No Fe/Al oxides. P fixed by organic matter complexation and Ca-P precipitation. Lower fixation than mineral soils.",
      cfiFix:"P fixation is NOT the primary CFI story on peat. Lead with K deficiency and Cu deficiency."},
    problems:[
      {rank:1,issue:"GHG emissions — N2O 8x mineral soils",severity:"CRITICAL",detail:"IPCC EF1 = 8% of applied N as N2O-N. Histosols are CO2e emission hotspots for estate carbon accounting."},
      {rank:2,issue:"Cu deficiency — 'Little leaf' disease",severity:"CRITICAL",detail:"Peat has near-zero available Cu. Endemic on unmanaged peat palm. Juvenile palms most affected."},
      {rank:3,issue:"K deficiency + Ca:Mg:K antagonism",severity:"HIGH",detail:"No mineral K in peat. Max 4 kg K2O/tree/yr — excess causes Mg crash and 20–30% yield loss."},
      {rank:4,issue:"Peat subsidence and fire risk",severity:"HIGH",detail:"Drainage oxidises peat — 2–5 cm/yr subsidence. Fire risk in dry season. RSPO compliance critical."},
    ],
    fertReq:{
      plantingDensity:143,
      note:"IOPRI Gambut schedule. K capped at 4 kg K2O/tree/yr. Cu mandatory every year. NO lime.",
      n:  {perTreeKg:4.0, perHaKg:572, product:"Urea + split mandatory", timing:"4–5x/yr max 200g",  unitCost:0.35},
      p:  {perTreeKg:0.6, perHaKg:86,  product:"TSP",                    timing:"2x/yr",              unitCost:0.45},
      k:  {perTreeKg:4.0, perHaKg:572, product:"MOP — NEVER exceed 4 kg K2O/tree/yr",timing:"4x/yr max 1 kg K2O/app",unitCost:0.38},
      mg: {perTreeKg:0.9, perHaKg:129, product:"Kieserite",              timing:"4–5x/yr K antagonism",unitCost:0.28},
      b:  {perTreeKg:0.08,perHaKg:11,  product:"Colemanite — split 3–4x",timing:"3–4x/yr — peat immobilises B",unitCost:1.20},
      cu: {perTreeKg:0.03,perHaKg:4,   product:"Copper sulphate MANDATORY",timing:"1x/yr foliar juvenile; soil mature",unitCost:1.80},
      lime:{perHaKg:0,                  product:"NO LIME — water table management only",timing:"NEVER — lime on peat causes CH4 release",unitCost:0},
      totalCostHaYr:1100,
    },
    limeReq:{tonsHa:0, targetPH:3.8, note:"GUARDRAIL: No lime on peat. pH managed by water table control ONLY."},
    cfiAdvantage:"HIGH — Cu and K supply from frass critical. N2O emission reduction (slow-release N) most important. 35–45% substitution.",
    cfiSubstitutionPct:40,
    radarScores:{fertility:42,nRetention:62,pAvailability:58,drainability:22,yieldPotential:55,cfiResponse:80},
    cfiValue:{nLossFrac:0.58,pFixedFrac:0.40,nVal:88.10,pVal:36.74,kVal:17.23,total:142.07,
      note:"Riau/C. Kalimantan Histosol. CFI pitch on peat: GHG reduction + Cu supply + K split management."},
    ghg:{nApplied:572,leachedKg:90,directN2O_AR5:null,indirectN2O:null,scope3_urea:null,totalScope3:null,totalGHG_AR5:null,cfiSavingPct:40,isOrganic:true},
    appSchedule:{
      vgam:{N:5,P:2,K:4,Mg:4,B:3,lime:0},
      gam: {N:4,P:2,K:4,Mg:4,B:2,lime:0},
      poor:{N:3,P:1,K:4,Mg:3,B:2,lime:0},
      note:"HISTOSOL: K ALWAYS 4x/yr regardless of tier — K splitting to prevent Ca:Mg:K antagonism is mandatory, not optional.",
    },
  },
  {
    id:"spodosol", name:"Spodosols", nameLocal:"Podsolik / Podzol",
    pctIndo:"~22%", color:C.grey,
    ph:{min:4.2, max:5.2, typical:4.77}, cec:2.0, omPct:1.2, clayPct:5,
    texture:"Sand to loamy sand, bleached E horizon", drainage:"Variable — impeded by spodic horizon",
    description:"Sandy soils. Lowest CEC of any Indonesian palm soil. Every applied fertiliser rapidly leaches. Yield potential 30–40% below Ultisols even with optimum nutrition.",
    palmCoverage:"~5 million ha. Coastal West/Central Kalimantan, coastal East Sumatra.",
    nLeach:{risk:"Extreme",riskScore:5,kgHaYr:{low:85,high:130,typical:108},
      mechanism:"CEC 1–3 meq/100g. All applied N moves through within 48–72 hours of rain on sandy profiles.",
      cfiFix:"CFI compost on Spodosol: highest leaching reduction of any soil (~60–70% efficiency gain). CEC rebuilds from 2 to 8+ meq/100g after 5 years."},
    pFix:{risk:"Moderate (spodic horizon P; surface sand leaches P)",riskScore:3,pctFixed:{low:25,high:45,typical:35},
      mechanism:"Sandy surface: minimal fixation. Spodic horizon strongly adsorbs P. Most P loss via leaching not fixation.",
      cfiFix:"CFI compost banding — organic P stays in root zone far longer than TSP solution on sand."},
    problems:[
      {rank:1,issue:"Extreme nutrient leaching — all elements lost rapidly",severity:"CRITICAL",detail:"Every application must be micro-dosed. Cost per unit nutrient delivered to palm 2–3x other soils."},
      {rank:2,issue:"Waterlogging above spodic horizon",severity:"HIGH",detail:"Impermeable spodic layer. Root zone becomes anaerobic. Fe2+ toxicity, Ganoderma pressure."},
      {rank:3,issue:"Very low water-holding capacity",severity:"HIGH",detail:"Sandy cannot hold water. Yield losses 20–30% in dry years without irrigation."},
    ],
    fertReq:{
      plantingDensity:143,
      note:"IOPRI Sandy/Podzolic schedule. Very high application frequency. Foliar programme essential.",
      n:  {perTreeKg:3.0, perHaKg:429, product:"Slow-release/NBPT urea MANDATORY",timing:"5–6x/yr max 150g",  unitCost:0.42},
      p:  {perTreeKg:0.6, perHaKg:86,  product:"TSP — banded only",              timing:"3x/yr banded",      unitCost:0.45},
      k:  {perTreeKg:4.5, perHaKg:644, product:"MOP — highest frequency",         timing:"5–6x/yr max 0.5 kg K2O/app",unitCost:0.38},
      mg: {perTreeKg:0.9, perHaKg:129, product:"Kieserite",                        timing:"4–5x/yr",          unitCost:0.28},
      b:  {perTreeKg:0.08,perHaKg:11,  product:"Solubor foliar primary",           timing:"3x foliar + 1x granular",unitCost:1.20},
      cu: {perTreeKg:0.03,perHaKg:4,   product:"Copper sulphate",                  timing:"1x/yr foliar",     unitCost:1.80},
      lime:{perHaKg:3000,               product:"Agricultural lime — surface only", timing:"Every 2 yr",      unitCost:0.08},
      totalCostHaYr:1050,
    },
    limeReq:{tonsHa:1.0, targetPH:5.2, note:"Surface application only. Lime leaches through sandy profile — reapply every 2 years."},
    cfiAdvantage:"VERY HIGH (transformative long-term) — CEC rebuilding from 2 to 8+ meq/100g. 45–55% substitution once CEC rebuilds.",
    cfiSubstitutionPct:50,
    radarScores:{fertility:22,nRetention:18,pAvailability:42,drainability:65,yieldPotential:42,cfiResponse:90},
    cfiValue:{nLossFrac:0.70,pFixedFrac:0.35,nVal:123.84,pVal:28.92,kVal:17.23,total:169.99,
      note:"Extreme N loss drives highest N value of any soil ($123.84/t). CEC rebuilding from compost = multi-year ROI."},
    ghg:{nApplied:429,leachedKg:108,directN2O_AR5:null,indirectN2O:null,scope3_urea:null,totalScope3:null,totalGHG_AR5:null,cfiSavingPct:50},
    appSchedule:{
      vgam:{N:6,P:3,K:6,Mg:5,B:3,lime:0.50},
      gam: {N:5,P:3,K:5,Mg:4,B:2,lime:0.50},
      poor:{N:4,P:2,K:5,Mg:3,B:2,lime:0},
      note:"SPODOSOL: Minimum 4-5x N applications per year at all tiers — CEC cannot hold nutrients between applications. K max 0.5 kg K2O/application.",
    },
  },
];

// ══ COMPUTED GHG EMISSIONS ════════════════════════════════════════════════════
function computeGHG(soil) {
  const isOrg = soil.ghg.isOrganic || false;
  const EF1 = isOrg ? GHG.EF1_organic : GHG.EF1_mineral;
  const N = soil.ghg.nApplied;
  const L = soil.ghg.leachedKg;
  const fr = soil.fertReq;

  // Direct N2O
  const n2on_direct = N * EF1;
  const n2o_direct = n2on_direct * GHG.conv_N2O;
  const co2e_direct_AR5 = n2o_direct * GHG.GWP_AR5;
  const co2e_direct_AR6 = n2o_direct * GHG.GWP_AR6;

  // Indirect N2O from leaching
  const n2on_indirect = L * GHG.EF5;
  const n2o_indirect = n2on_indirect * GHG.conv_N2O;
  const co2e_indirect_AR5 = n2o_indirect * GHG.GWP_AR5;

  // Scope 3 production emissions
  const s3_n = N * GHG.scope3.urea.factor;
  const s3_p = (fr.p.perHaKg || 0) * GHG.scope3.tsp.factor;
  const s3_k = (fr.k.perHaKg || 0) * GHG.scope3.mop.factor;
  const s3_mg = (fr.mg.perHaKg || 0) * GHG.scope3.kieserite.factor;
  const limeAnnual = (fr.lime.perHaKg || 0) / 3.0;
  const s3_lime = limeAnnual * 0.7;
  const totalScope3 = s3_n + s3_p + s3_k + s3_mg + s3_lime;

  const totalGHG_AR5 = co2e_direct_AR5 + co2e_indirect_AR5 + totalScope3;
  const cfiSaving = totalGHG_AR5 * (soil.ghg.cfiSavingPct / 100);

  return {
    EF1, N, L,
    n2on_direct:+n2on_direct.toFixed(2),
    n2o_direct:+n2o_direct.toFixed(2),
    co2e_direct_AR5:+co2e_direct_AR5.toFixed(0),
    co2e_direct_AR6:+(n2o_direct * GHG.GWP_AR6).toFixed(0),
    co2e_indirect_AR5:+co2e_indirect_AR5.toFixed(0),
    s3_n:+s3_n.toFixed(0), s3_p:+s3_p.toFixed(0),
    s3_k:+s3_k.toFixed(0), s3_mg:+s3_mg.toFixed(0), s3_lime:+s3_lime.toFixed(0),
    totalScope3:+totalScope3.toFixed(0),
    totalGHG_AR5:+totalGHG_AR5.toFixed(0),
    cfiSaving:+cfiSaving.toFixed(0),
    perTree_AR5:+(totalGHG_AR5/143).toFixed(1),
  };
}

// ══ HELPER COMPONENTS ═════════════════════════════════════════════════════════
function Card({children, style={}}) {
  return (
    <div style={{background:C.navyMid,borderRadius:12,padding:18,
      border:"1px solid #2a3a50",...style}}>{children}</div>
  );
}
function SecHdr({icon,title,color,sub}) {
  const c = color || C.teal;
  return (
    <div style={{marginBottom:14,paddingBottom:10,borderBottom:"1px solid #2a3a50"}}>
      <div>
        <span style={{fontSize:12,fontWeight:800,color:c,letterSpacing:"0.1em",textTransform:"uppercase",opacity:0.72}}>{title}</span>
      </div>
      {sub && <div style={{fontSize:10,color:C.grey,marginTop:3}}>{sub}</div>}
    </div>
  );
}
function Badge({text,color,size}) {
  const c = color || C.grey;
  const sm = size === "xs";
  return (
    <span style={{background:c+"22",border:"1px solid " + c + "55",color:c,
      fontSize:sm?8:9,fontWeight:700,borderRadius:4,
      padding:sm?"1px 5px":"2px 7px",letterSpacing:"0.05em",whiteSpace:"nowrap"}}>
      {text}
    </span>
  );
}
function KPI({label,value,unit,color,note}) {
  const c = color || C.teal;
  return (
    <div style={{background:C.navyLt,borderRadius:8,padding:"10px 14px",
      border:"1px solid " + c + "33",flex:1,minWidth:90}}>
      <div style={{fontSize:9,color:C.grey,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:4}}>{label}</div>
      <div style={{fontSize:22,fontWeight:900,color:c,fontFamily:"'Courier New',monospace",lineHeight:1}}>{value}</div>
      {unit && <div style={{fontSize:9,color:C.grey,marginTop:3}}>{unit}</div>}
      {note && <div style={{fontSize:8,color:C.grey,marginTop:4,fontStyle:"italic",lineHeight:1.4}}>{note}</div>}
    </div>
  );
}
function RiskBar({label,score,max,color}) {
  const m = max || 5;
  const cols=[C.green,C.green,C.amber,C.amber,C.orange,C.red];
  const c = color || cols[score] || C.red;
  const labels=["","Very Low","Low","Moderate","High","Very High","Extreme"];
  return (
    <div style={{marginBottom:8}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
        <span style={{fontSize:10,color:C.grey}}>{label}</span>
        <Badge text={labels[score]||"N/A"} color={c}/>
      </div>
      <div style={{background:C.navy,borderRadius:4,height:8,overflow:"hidden"}}>
        <div style={{height:"100%",borderRadius:4,background:c,
          width:((score/m)*100)+"%",transition:"width 0.5s ease",
          boxShadow:"0 0 6px " + c + "88"}}/>
      </div>
    </div>
  );
}


// ══ CFI FRASS COMPOSITION & DOSE CALCULATIONS ═══════════════════════════════
// Canonical frass composition: BSF-derived, palm waste substrates
// Moisture 40% (0.60 DM), all nutrient % on DM basis
const FRASS = {
  moistureFraction: 0.40,
  dmFraction: 0.60,
  // Nutrient % on DM basis (conservative — lab-verified range mid-points)
  nPctDM:    3.0,   // % N DM  (N x 4.67 true protein; not 6.25)
  p2o5PctDM: 2.8,   // % P2O5 DM
  k2oPctDM:  2.2,   // % K2O DM
  mgoPctDM:  1.0,   // % MgO DM
  // Per tonne FRESH weight (kg nutrient / t fresh):
  nKgT:    1000 * 0.60 * 0.030,   // 18.0 kg N / t
  p2o5KgT: 1000 * 0.60 * 0.028,   // 16.8 kg P2O5 / t
  k2oKgT:  1000 * 0.60 * 0.022,   // 13.2 kg K2O / t
  mgoKgT:  1000 * 0.60 * 0.010,   // 6.0  kg MgO / t
  // P availability advantage over TSP: frass P = phospholipid+phytate,
  // enzymatic release, bypasses Fe/Al fixation — effective pAvail ~72% gross
  pAvailFraction: 0.72,
  // K frass retention: organic matrix slows leaching vs MOP solution
  kRetentionBoost: 1.30,  // 30% better retention than MOP at same CEC
  // Cost assumption for ROI calculation
  costUsdTonne: 120,  // USD/t ex-mill
};

// N bioavailability — frass slow-release improvement factor vs urea
// Applied as multiplier to effective N content: frass loses less per soil loss pathway
const FRASS_N_UTIL = {
  inceptisol: Math.min(0.90, (1 - 0.35) * 1.55),  // ~0.88
  ultisol:    Math.min(0.85, (1 - 0.50) * 1.55),  // ~0.78
  oxisol:     Math.min(0.80, (1 - 0.60) * 1.55),  // ~0.62
  histosol:   Math.min(0.78, (1 - 0.58) * 1.55),  // ~0.65
  spodosol:   Math.min(0.72, (1 - 0.70) * 1.55),  // ~0.47
};

// Compute frass dose requirements for a soil + age phase
function calcFrassDose(soil, phaseId) {
  const ph = AGE_PHASES.phases.find(p => p.id === phaseId);
  const fr = soil.fertReq;
  const nReqHa  = fr.n.perHaKg  * ph.nMultiplier;
  const pReqHa  = fr.p.perHaKg  * ph.pMultiplier;
  const kReqHa  = fr.k.perHaKg  * ph.kMultiplier;
  const nUtil   = FRASS_N_UTIL[soil.id] || 0.60;
  const pUtil   = FRASS.pAvailFraction;
  const kUtil   = Math.min(0.95, (BIOAVAIL.K[soil.id][3] ? BIOAVAIL.K[soil.id][3].v/100 : 0.55) * FRASS.kRetentionBoost);

  const tForN = nReqHa / (FRASS.nKgT * nUtil);
  const tForP = pReqHa / (FRASS.p2o5KgT * pUtil);
  const tForK = kReqHa / (FRASS.k2oKgT * kUtil);
  const recommended = Math.max(tForN, tForP, tForK);
  const governing   = tForN >= tForP && tForN >= tForK ? "N" : tForP >= tForK ? "P" : "K";
  return {
    nReqHa:+nReqHa.toFixed(1), pReqHa:+pReqHa.toFixed(1), kReqHa:+kReqHa.toFixed(1),
    tForN:+tForN.toFixed(1), tForP:+tForP.toFixed(1), tForK:+tForK.toFixed(1),
    recommended:+recommended.toFixed(1), perTree:+(recommended/143).toFixed(2),
    perTreeKg: +(recommended/143*1000).toFixed(0),
    governing, nUtil:+nUtil.toFixed(2), pUtil, kUtil:+kUtil.toFixed(2),
    nKgFromDose:+(recommended * FRASS.nKgT * nUtil).toFixed(1),
    pKgFromDose:+(recommended * FRASS.p2o5KgT * pUtil).toFixed(1),
    kKgFromDose:+(recommended * FRASS.k2oKgT * kUtil).toFixed(1),
    annualCostHa:+(recommended * FRASS.costUsdTonne).toFixed(0),
    syntheticCostHa:+fr.totalCostHaYr.toFixed(0),
    saving:+(fr.totalCostHaYr * soil.cfiSubstitutionPct/100).toFixed(0),
  };
}

// Generate 13-month (0–390 days) N bioavailability data for a soil
// Returns array of {month, synth, frass} where each = kg N / tree available at that point
function buildMonthlyNData(soil) {
  const fr = soil.fertReq;
  const nPerTree = fr.n.perTreeKg;  // kg N / tree applied (synthetic)
  // Frass dose for prime bearing on this soil
  const frassDose = calcFrassDose(soil, "prime");
  const frassNApplied = frassDose.recommended / 143 * FRASS.nKgT;  // kg N/tree in frass

  // Build interpolated monthly curve from BIOAVAIL.N[soilId] (point-in-time % available)
  const synthCurve = BIOAVAIL.N[soil.id];
  const frassCurve = BIOAVAIL.N.frass;

  function interp(curve, dayTarget) {
    for (let i = 0; i < curve.length - 1; i++) {
      if (curve[i].d <= dayTarget && curve[i+1].d >= dayTarget) {
        const t = (dayTarget - curve[i].d) / (curve[i+1].d - curve[i].d);
        return curve[i].v + t * (curve[i+1].v - curve[i].v);
      }
    }
    return curve[curve.length-1].v;
  }

  const result = [];
  for (let m = 0; m <= 13; m++) {
    const d = m * 30;
    const synthPct = interp(synthCurve, d);
    const frassPct = interp(frassCurve, d);
    result.push({
      month: m,
      label: "M" + m,
      Urea_N_kg:   +(nPerTree * synthPct / 100).toFixed(3),
      Frass_N_kg:  +(frassNApplied * frassPct / 100).toFixed(3),
      frassApplied:+frassNApplied.toFixed(2),
      nPerTree:    +nPerTree.toFixed(2),
      diff:        +(frassNApplied * frassPct / 100 - nPerTree * synthPct / 100).toFixed(3),
    });
  }
  return result;
}

// Build cumulative N buildup over 5 years of annual applications (kg available N / ha)
// Year 1 applied at month 0; Year 2 at month 12; Year 3 at month 24...
function buildCumulativeBuildup(soil) {
  const fr = soil.fertReq;
  const nHa = fr.n.perHaKg;
  const frassDose = calcFrassDose(soil, "prime");
  const frassNHa = frassDose.recommended * FRASS.nKgT;  // kg N / ha in frass

  const synthCurve = BIOAVAIL.N[soil.id];
  const frassCurve = BIOAVAIL.N.frass;

  function interp(curve, dayTarget) {
    if (dayTarget < 0) return 0;
    if (dayTarget > 365) {
      // extrapolate: decay from last point
      const last = curve[curve.length-1];
      return Math.max(0, last.v * Math.exp(-0.002 * (dayTarget - last.d)));
    }
    for (let i = 0; i < curve.length - 1; i++) {
      if (curve[i].d <= dayTarget && curve[i+1].d >= dayTarget) {
        const t = (dayTarget - curve[i].d) / (curve[i+1].d - curve[i].d);
        return curve[i].v + t * (curve[i+1].v - curve[i].v);
      }
    }
    return curve[curve.length-1].v;
  }

  const result = [];
  for (let m = 0; m <= 60; m++) {
    const d = m * 30;
    // Sum contributions from each annual application (years 0-4)
    let synthSum = 0;
    let frassSum = 0;
    for (let yr = 0; yr <= 4; yr++) {
      const elapsed = d - yr * 365;
      if (elapsed >= 0) {
        synthSum += nHa    * interp(synthCurve, elapsed) / 100;
        frassSum += frassNHa * interp(frassCurve, elapsed) / 100;
      }
    }
    result.push({
      month: m,
      label: m % 12 === 0 ? "Yr " + (m/12) : "",
      Synthetic_N_ha:  +synthSum.toFixed(1),
      CFI_Frass_N_ha:  +frassSum.toFixed(1),
    });
  }
  return result;
}

// Build P fixation comparison over 26 weeks for active soil
function buildPCurveData(soil) {
  const points = [0,1,2,3,4,6,8,10,12,16,20,26];
  const tspK   = soil.id + "_tsp";
  const tspCurve  = BIOAVAIL.P[tspK]  || BIOAVAIL.P["ultisol_tsp"];
  const cirpCurve = BIOAVAIL.P.cirp;
  const frassCurve= BIOAVAIL.P.frass;

  function interp(curve, wkTarget) {
    const d = wkTarget * 7;
    for (let i = 0; i < curve.length - 1; i++) {
      if (curve[i].d <= d && curve[i+1].d >= d) {
        const t = (d - curve[i].d) / (curve[i+1].d - curve[i].d);
        return curve[i].v + t * (curve[i+1].v - curve[i].v);
      }
    }
    return curve[curve.length-1].v;
  }

  return points.map(wk => ({
    week: wk,
    label: "W" + wk,
    TSP_available_pct:  +interp(tspCurve, wk).toFixed(1),
    CIRP_available_pct: +interp(cirpCurve, wk).toFixed(1),
    CFI_Frass_P_pct:    +interp(frassCurve, wk).toFixed(1),
  }));
}

// All-soil frass dose comparison for a given phase
function allSoilFrassDose(phaseId) {
  return SOILS.map(s => {
    const d = calcFrassDose(s, phaseId);
    return {
      name: s.name.split(" ")[0],
      id:   s.id,
      color: s.color,
      tHa:  d.recommended,
      perTree: d.perTree,
      governing: d.governing,
      tForN: d.tForN,
      tForP: d.tForP,
      tForK: d.tForK,
      cost:  d.annualCostHa,
      saving:d.saving,
    };
  });
}

const TABS = ["Overview","Age Phases","Bioavailability","N Leaching","Emissions","Correctives","CFI Value","Cross-Soil","CFI Nutrition Charts"];

// ══ MAIN COMPONENT ════════════════════════════════════════════════════════════
export default function CFISoilCalculator() {
  const [activeSoil, setActiveSoil] = useState("inceptisol");
  const [activeTab, setActiveTab] = useState("Overview");
  const [bioNutrient, setBioNutrient] = useState("N");
  const [nRainfall, setNRainfall] = useState(50);
  const [ghgTier, setGhgTier] = useState("prime");
  const [emissionsGWP, setEmissionsGWP] = useState("AR5");
  const [agePhase, setAgePhase] = useState("prime");
  const [chartPhase, setChartPhase] = useState("prime");
  const [chartSoilOverlay, setChartSoilOverlay] = useState(false);

  const soil = useMemo(() => SOILS.find(s => s.id === activeSoil), [activeSoil]);
  const ghg = useMemo(() => computeGHG(soil), [soil]);
  const allGHG = useMemo(() => SOILS.map(s => ({...computeGHG(s), id:s.id, name:s.name, color:s.color})), []);
  const monthlyNData   = useMemo(() => buildMonthlyNData(soil), [soil]);
  const cumulativeData = useMemo(() => buildCumulativeBuildup(soil), [soil]);
  const pCurveData     = useMemo(() => buildPCurveData(soil), [soil]);
  const frassDosePhase = useMemo(() => calcFrassDose(soil, chartPhase), [soil, chartPhase]);
  const allSoilDose    = useMemo(() => allSoilFrassDose(chartPhase), [chartPhase]);

  // Build age-phase table for active soil
  const agePhaseData = useMemo(() => {
    const fr = soil.fertReq;
    return AGE_PHASES.phases.map(ph => ({
      ...ph,
      n_tree: +(fr.n.perTreeKg * ph.nMultiplier).toFixed(2),
      n_ha:   +(fr.n.perHaKg * ph.nMultiplier).toFixed(0),
      p_tree: +(fr.p.perTreeKg * ph.pMultiplier).toFixed(2),
      p_ha:   +(fr.p.perHaKg * ph.pMultiplier).toFixed(0),
      k_tree: +(fr.k.perTreeKg * ph.kMultiplier).toFixed(2),
      k_ha:   +(fr.k.perHaKg * ph.kMultiplier).toFixed(0),
      mg_tree:+(fr.mg.perTreeKg * ph.mgMultiplier).toFixed(2),
      mg_ha:  +(fr.mg.perHaKg * ph.mgMultiplier).toFixed(0),
    }));
  }, [soil]);

  // Bioavailability curve data
  const bioCurveData = useMemo(() => {
    const nut = bioNutrient;
    const sid = activeSoil;
    if (nut === "N") {
      const days = [0,3,7,14,21,30,45,60,90,120,180,270,365];
      const synth = BIOAVAIL.N[sid];
      const frass = BIOAVAIL.N.frass;
      return days.map((d,i) => ({
        d,
        Synthetic: synth[i] ? synth[i].v : null,
        Frass:     frass[i] ? frass[i].v : null,
      }));
    } else if (nut === "P") {
      const days = [0,3,7,14,30,60,90,180,365];
      const synthKey = sid + "_tsp";
      const synth = BIOAVAIL.P[synthKey];
      const cirp  = BIOAVAIL.P.cirp;
      const frass = BIOAVAIL.P.frass;
      return days.map((d,i) => ({
        d,
        TSP:   synth && synth[i] ? synth[i].v : null,
        CIRP:  cirp[i] ? cirp[i].v : null,
        Frass: frass[i] ? frass[i].v : null,
      }));
    } else {
      const days = [0,7,14,30,60,90,180,270,365];
      const synth = BIOAVAIL.K[sid];
      const frass = BIOAVAIL.K.frass;
      return days.map((d,i) => ({
        d,
        MOP:   synth[i] ? synth[i].v : null,
        Frass: frass[i] ? frass[i].v : null,
      }));
    }
  }, [bioNutrient, activeSoil]);

  // N leaching top-up for selected rainfall
  const topupData = useMemo(() => {
    const idx = N_TOPUP.thresholds.indexOf(nRainfall);
    return SOILS.map(s => ({
      name: s.name.replace("Histosols (Peat)","Histosols").replace("Inceptisols","Incept.").replace("Spodosols","Spodosol"),
      topupKg: idx >= 0 ? N_TOPUP[s.id][idx] : 0,
      color: s.color,
      id: s.id,
    }));
  }, [nRainfall]);

  // Emissions heatmap
  const emHeatData = useMemo(() => {
    return allGHG.map(g => ({
      name: SOILS.find(s=>s.id===g.id).name.replace("Histosols (Peat)","Histosols"),
      color: SOILS.find(s=>s.id===g.id).color,
      id:    g.id,
      directN2O: g.co2e_direct_AR5,
      indirectN2O: g.co2e_indirect_AR5,
      scope3: g.totalScope3,
      total: g.totalGHG_AR5,
      perTree: g.perTree_AR5,
      cfiSaving: g.cfiSaving,
    }));
  }, [allGHG]);

  const tabStyle = (t) => ({
    padding:"7px 14px", borderRadius:6, cursor:"pointer", fontSize:11,
    fontWeight: activeTab===t ? 800 : 500,
    background: activeTab===t ? (soil.color+"33") : "transparent",
    color: activeTab===t ? soil.color : C.grey,
    border: activeTab===t ? ("1px solid " + soil.color + "55") : "1px solid transparent",
    transition:"all 0.2s",whiteSpace:"nowrap",
  });

  const soilBtnStyle = (s) => ({
    padding:"8px 14px", borderRadius:8, cursor:"pointer", fontSize:11,
    fontWeight: activeSoil===s.id ? 800 : 400,
    background: activeSoil===s.id ? (s.color+"22") : "transparent",
    color: activeSoil===s.id ? s.color : C.grey,
    border: activeSoil===s.id ? ("1px solid " + s.color + "44") : "1px solid transparent",
  });

  return (
    <div style={{background:C.navy,color:C.white,minHeight:"100vh",
      fontFamily:"'Segoe UI',system-ui,sans-serif",padding:16,maxWidth:1400,margin:"0 auto"}}>

      {/* HEADER */}
      <div style={{borderBottom:"2px solid " + C.teal + "44",paddingBottom:14,marginBottom:16}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:8}}>
          <div>
            <div style={{fontSize:9,color:C.teal,letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:4}}>
              CFI SOIL ANALYSIS CALCULATOR v4 · AGRONOMIST AUDIT BUILD
            </div>
            <div style={{fontSize:20,fontWeight:900,color:C.white,letterSpacing:"-0.02em"}}>
              Indonesian Palm Soil Nutrition System
            </div>
            <div style={{fontSize:10,color:C.grey,marginTop:3}}>
              5 Soil Orders · IOPRI/MPOB/BPT Bogor Standards · IPCC AR5/AR6 GHG · Full Bioavailability Profiles
            </div>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
            {SOILS.map(s => (
              <button key={s.id} onClick={()=>setActiveSoil(s.id)} style={soilBtnStyle(s)}>
                {s.name.split(" ")[0]}
                <span style={{fontSize:8,opacity:0.7,marginLeft:4}}>{s.pctIndo}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ACTIVE SOIL BANNER */}
      <div style={{background:soil.color+"15",border:"1px solid " + soil.color + "44",borderRadius:10,
        padding:"10px 16px",marginBottom:14,display:"flex",gap:20,alignItems:"center",flexWrap:"wrap"}}>
        <div>
          <span style={{fontSize:11,fontWeight:900,color:soil.color}}>{soil.name}</span>
          <span style={{fontSize:10,color:C.grey,marginLeft:8}}>{soil.nameLocal}</span>
          <Badge text={soil.pctIndo + " of Indo palm"} color={soil.color} style={{marginLeft:8}}/>
        </div>
        <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
          <span style={{fontSize:10,color:C.grey}}>pH <strong style={{color:C.white}}>{soil.ph.typical}</strong></span>
          <span style={{fontSize:10,color:C.grey}}>CEC <strong style={{color:C.white}}>{soil.cec} meq</strong></span>
          <span style={{fontSize:10,color:C.grey}}>N leach <strong style={{color:C.amber}}>{soil.nLeach.kgHaYr.typical} kg/ha/yr</strong></span>
          <span style={{fontSize:10,color:C.grey}}>P fixed <strong style={{color:C.red}}>{soil.pFix.pctFixed.typical}%</strong></span>
          <span style={{fontSize:10,color:C.grey}}>CFI sub <strong style={{color:C.teal}}>{soil.cfiSubstitutionPct}%</strong></span>
          <span style={{fontSize:10,color:C.grey}}>Fert cost <strong style={{color:C.amberLt}}>${soil.fertReq.totalCostHaYr}/ha/yr</strong></span>
        </div>
      </div>

      {/* TABS — Charts tab excluded from strip; gets its own banner below */}
      <div style={{display:"flex",gap:6,marginBottom:0,overflowX:"auto",paddingBottom:4,flexWrap:"nowrap"}}>
        {TABS.filter(t => t !== "CFI Nutrition Charts").map(t => (
          <button key={t} onClick={()=>setActiveTab(t)} style={tabStyle(t)}>{t}</button>
        ))}
      </div>

      {/* ══ CHARTS CALLOUT BANNER — always visible above tab content ══════════ */}
      {activeTab !== "CFI Nutrition Charts" && (
        <div onClick={()=>setActiveTab("CFI Nutrition Charts")}
          style={{cursor:"pointer",margin:"10px 0 14px",borderRadius:10,
            background:"linear-gradient(135deg, " + soil.color + "22 0%, #0f2040 60%, " + soil.color + "11 100%)",
            border:"2px solid " + soil.color + "66",
            boxShadow:"0 0 18px " + soil.color + "33",
            padding:"12px 18px",
            display:"flex",alignItems:"flex-start",justifyContent:"flex-start",
            transition:"all 0.2s",gap:20}}>
          <div style={{background:soil.color,color:"#060e1e",fontWeight:900,
            borderRadius:8,padding:"14px 28px",whiteSpace:"nowrap",flexShrink:0,
            boxShadow:"0 0 16px "+soil.color+"77",textAlign:"center",minWidth:140}}>
            <div style={{fontSize:17,fontWeight:900,letterSpacing:"0.05em",lineHeight:1.2}}>
              {"CLICK HERE"}
            </div>
            <div style={{fontSize:13,fontWeight:800,letterSpacing:"0.1em",marginTop:3,opacity:0.85}}>
              {"CHARTS"}
            </div>
          </div>
          <div style={{alignSelf:"center"}}>
            <div style={{fontSize:15,fontWeight:900,color:soil.color,letterSpacing:"0.04em",
              textTransform:"uppercase",marginBottom:4}}>
              {"CFI Nutrition Charts"}
            </div>
            <div style={{fontSize:11,color:C.grey,lineHeight:1.6}}>
              {"N/P/K bioavailability · Frass t/ha dose by age · 5-year soil N reservoir · P fixation comparison · Frass vs synthetic equivalence"}
              <br/>
              <strong style={{color:soil.color}}>{soil.name}</strong>
              {" · Stage S5A frass · 60% DM · 3% N · 2.8% P₂O₅ · 2.2% K₂O"}
            </div>
          </div>
        </div>
      )}

      {/* Back strip when inside charts tab */}
      {activeTab === "CFI Nutrition Charts" && (
        <div style={{margin:"10px 0 14px",display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
          <button onClick={()=>setActiveTab("Overview")}
            style={{background:"#0f2040",border:"1px solid #94a3b844",color:"#94a3b8",
              borderRadius:6,padding:"6px 14px",cursor:"pointer",fontSize:10,fontWeight:600}}>
            {"← Back to Overview"}
          </button>
          <div style={{flex:1,background:soil.color+"15",border:"1px solid "+soil.color+"33",
            borderRadius:8,padding:"8px 14px",display:"flex",gap:16,alignItems:"center",flexWrap:"wrap"}}>
            <span style={{fontSize:10,color:soil.color,fontWeight:800}}>
              {"CFI NUTRITION CHARTS"}
            </span>
            <span style={{fontSize:9,color:"#94a3b8"}}>
              {"All charts — "}
              <strong style={{color:"#e8f0fe"}}>{soil.name}</strong>
              {" · N loss " + (soil.cfiValue.nLossFrac*100).toFixed(0) + "%"}
              {" · P fixed " + soil.pFix.pctFixed.typical + "%"}
              {" · CEC " + soil.cec + " meq"}
              {" · Source: Stage S5A BSF frass — 60% DM · 3% N · 2.8% P2O5 · 2.2% K2O"}
            </span>
          </div>
        </div>
      )}

      {/* ══ TAB: OVERVIEW ══════════════════════════════════════════════════════ */}
      {activeTab === "Overview" && (
        <div style={{display:"grid",gap:14}}>
          <Card>
            <SecHdr title="Soil Profile" color={soil.color}
              sub={soil.palmCoverage}/>
            <p style={{fontSize:10,color:C.grey,lineHeight:1.7,marginBottom:12}}>{soil.description}</p>
            <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:12}}>
              <KPI label="pH typical" value={soil.ph.typical} unit={"Range " + soil.ph.min + "–" + soil.ph.max} color={soil.color}/>
              <KPI label="CEC" value={soil.cec} unit="meq/100g" color={C.teal}/>
              <KPI label="Clay %" value={soil.clayPct + "%"} unit={soil.texture} color={C.blue}/>
              <KPI label="OM %" value={soil.omPct + "%"} unit="Organic Matter" color={C.green}/>
              <KPI label="Lime Target" value={soil.limeReq.targetPH} unit={soil.limeReq.tonsHa + " t/ha"} color={C.amber}/>
            </div>
            <div style={{marginBottom:10}}>
              <RiskBar label="N Leaching Risk" score={soil.nLeach.riskScore}/>
              <RiskBar label="P Fixation Risk" score={soil.pFix.riskScore}/>
            </div>
            {soil.id === "histosol" && (
              <div style={{background:C.red+"15",border:"2px solid " + C.red + "55",borderRadius:8,
                padding:"10px 14px",marginBottom:10}}>
                <span style={{color:C.red,fontWeight:800,fontSize:11}}>
                  GUARDRAIL: NO LIME ON PEAT
                </span>
                <p style={{color:C.redLt,fontSize:10,margin:"4px 0 0"}}>
                  Lime on Histosol causes explosive CH4 release and irreversible peat damage.
                  pH management through water table control ONLY. K cap: 4 kg K2O/tree/yr total.
                </p>
              </div>
            )}
            <div style={{fontSize:10,color:C.grey,fontStyle:"italic",borderTop:"1px solid " + C.navyLt,paddingTop:8}}>
              {soil.limeReq.note}
            </div>
          </Card>

          <Card>
            <SecHdr title="Key Agronomic Issues" color={C.red}
              sub="Ranked by severity — IOPRI/MPOB field data"/>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {soil.problems.map((p,i) => (
                <div key={i} style={{flex:"1 1 280px",display:"flex",flexDirection:"column",gap:4,
                  background:C.navyLt,borderRadius:8,padding:"10px 14px",
                  borderLeft:"3px solid " + (p.severity==="CRITICAL"?C.red:p.severity==="HIGH"?C.orange:C.amber),
                  border:"1px solid #2a3a50",borderLeftWidth:3,
                  borderLeftColor:(p.severity==="CRITICAL"?C.red:p.severity==="HIGH"?C.orange:C.amber)}}>
                  <div style={{display:"flex",gap:8,alignItems:"center"}}>
                    <Badge text={p.severity} color={p.severity==="CRITICAL"?C.red:p.severity==="HIGH"?C.orange:C.amber}/>
                    <span style={{fontSize:11,fontWeight:700,color:C.white}}>{p.issue}</span>
                  </div>
                  <p style={{fontSize:10,color:C.grey,margin:0,lineHeight:1.5}}>{p.detail}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <SecHdr title="Prime Bearing Fertiliser Programme" color={soil.color}
              sub={soil.fertReq.note}/>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:10}}>
                <thead>
                  <tr style={{background:C.navyLt}}>
                    {["Nutrient","Per Tree kg/yr","Per Ha kg/yr","Product","Timing","Unit Cost $/kg"].map((h,i) => (
                      <td key={i} style={{padding:"7px 10px",color:C.grey,fontWeight:700}}>{h}</td>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    {n:"N (Urea N)",    d:soil.fertReq.n},
                    {n:"P (P2O5)",      d:soil.fertReq.p},
                    {n:"K (K2O)",       d:soil.fertReq.k},
                    {n:"Mg (MgO)",      d:soil.fertReq.mg},
                    {n:"B",            d:soil.fertReq.b},
                  ].map((row,i) => (
                    <tr key={i} style={{borderBottom:"1px solid " + C.navyLt}}>
                      <td style={{padding:"7px 10px",color:C.teal,fontWeight:700}}>{row.n}</td>
                      <td style={{padding:"7px 10px",color:C.amberLt,fontFamily:"monospace",fontWeight:700}}>{row.d.perTreeKg}</td>
                      <td style={{padding:"7px 10px",color:C.white,fontFamily:"monospace"}}>{row.d.perHaKg}</td>
                      <td style={{padding:"7px 10px",color:C.grey,fontSize:9}}>{row.d.product}</td>
                      <td style={{padding:"7px 10px",color:C.grey,fontSize:9}}>{row.d.timing}</td>
                      <td style={{padding:"7px 10px",color:C.green,fontFamily:"monospace"}}>${row.d.unitCost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{marginTop:10,display:"flex",gap:10,flexWrap:"wrap"}}>
              <KPI label="Total Fert Cost" value={"$" + soil.fertReq.totalCostHaYr} unit="per ha per year" color={C.amber}/>
              <KPI label="Per Tree" value={"$" + (soil.fertReq.totalCostHaYr/143).toFixed(1)} unit="mature stand" color={C.amberLt}/>
              <KPI label="CFI Sub Potential" value={soil.cfiSubstitutionPct + "%"} unit="mineral fertiliser" color={C.teal}/>
              <KPI label="Est. Annual Saving" value={"$" + Math.round(soil.fertReq.totalCostHaYr*soil.cfiSubstitutionPct/100)} unit="per ha/yr with CFI" color={C.green}/>
            </div>
          </Card>
        </div>
      )}

      {/* ══ TAB: AGE PHASES ════════════════════════════════════════════════════ */}
      {activeTab === "Age Phases" && (
        <div style={{display:"grid",gap:14}}>
          <Card>
            <SecHdr title="Fertiliser Requirements by Palm Age Phase" color={soil.color}
              sub="4 nutritional phases — IOPRI/MPOB standard multipliers vs prime bearing baseline"/>
            <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>
              {AGE_PHASES.phases.map(ph => (
                <button key={ph.id} onClick={()=>setAgePhase(ph.id)} style={{
                  padding:"6px 12px",borderRadius:6,cursor:"pointer",fontSize:10,
                  fontWeight:agePhase===ph.id?800:400,
                  background:agePhase===ph.id?(soil.color+"22"):"transparent",
                  color:agePhase===ph.id?soil.color:C.grey,
                  border:agePhase===ph.id?("1px solid "+soil.color+"55"):"1px solid transparent",
                }}>
                  {ph.label}
                  <span style={{fontSize:8,opacity:0.7,marginLeft:4}}>{ph.years}</span>
                </button>
              ))}
            </div>
            {agePhaseData.filter(ph=>ph.id===agePhase).map(ph => (
              <div key={ph.id}>
                <div style={{background:soil.color+"15",border:"1px solid "+soil.color+"33",
                  borderRadius:8,padding:"10px 14px",marginBottom:12}}>
                  <div style={{fontSize:11,fontWeight:700,color:soil.color,marginBottom:4}}>
                    {ph.label} · {ph.years}
                  </div>
                  <p style={{fontSize:10,color:C.grey,margin:0,lineHeight:1.6}}>{ph.desc}</p>
                  <p style={{fontSize:10,color:C.amberLt,margin:"6px 0 0",fontStyle:"italic"}}>{ph.note}</p>
                  <div style={{marginTop:6,background:C.navyLt,borderRadius:6,padding:"6px 10px",
                    fontSize:9,color:C.teal,fontWeight:700}}>{ph.highlight}</div>
                </div>
                <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:12}}>
                  <KPI label="N / Tree / Yr" value={ph.n_tree + " kg"} unit={ph.n_ha + " kg/ha"} color={C.blue}/>
                  <KPI label="P2O5 / Tree / Yr" value={ph.p_tree + " kg"} unit={ph.p_ha + " kg/ha"} color={C.amber}/>
                  <KPI label="K2O / Tree / Yr" value={ph.k_tree + " kg"} unit={ph.k_ha + " kg/ha"} color={C.orange}/>
                  <KPI label="MgO / Tree / Yr" value={ph.mg_tree + " kg"} unit={ph.mg_ha + " kg/ha"} color={C.green}/>
                </div>
              </div>
            ))}
            {/* Full phase comparison table */}
            <div style={{marginTop:8}}>
              <div style={{fontSize:9,color:C.grey,letterSpacing:"0.07em",textTransform:"uppercase",marginBottom:8}}>
                All Phases — {soil.name} (kg nutrient / tree / year)
              </div>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:10}}>
                  <thead>
                    <tr style={{background:C.navyLt}}>
                      <td style={{padding:"6px 10px",color:C.grey,fontWeight:700}}>Phase</td>
                      <td style={{padding:"6px 10px",color:C.grey,fontWeight:700}}>Years</td>
                      <td style={{padding:"6px 10px",color:C.blue,fontWeight:700}}>N (kg)</td>
                      <td style={{padding:"6px 10px",color:C.blue,fontWeight:700}}>N (kg/ha)</td>
                      <td style={{padding:"6px 10px",color:C.amber,fontWeight:700}}>P2O5 (kg)</td>
                      <td style={{padding:"6px 10px",color:C.orange,fontWeight:700}}>K2O (kg)</td>
                      <td style={{padding:"6px 10px",color:C.green,fontWeight:700}}>MgO (kg)</td>
                      <td style={{padding:"6px 10px",color:C.grey,fontWeight:700}}>Est Cost/tree</td>
                    </tr>
                  </thead>
                  <tbody>
                    {agePhaseData.map((ph,i) => (
                      <tr key={i} style={{
                        borderBottom:"1px solid " + C.navyLt,
                        background:ph.id===agePhase?(soil.color+"11"):"transparent",
                      }}>
                        <td style={{padding:"7px 10px",color:ph.id===agePhase?soil.color:C.white,fontWeight:700}}>
                          {ph.label}
                        </td>
                        <td style={{padding:"7px 10px",color:C.grey,fontSize:9}}>{ph.years}</td>
                        <td style={{padding:"7px 10px",color:C.blue,fontFamily:"monospace",fontWeight:700}}>{ph.n_tree}</td>
                        <td style={{padding:"7px 10px",color:C.grey,fontFamily:"monospace",fontSize:9}}>{ph.n_ha}</td>
                        <td style={{padding:"7px 10px",color:C.amber,fontFamily:"monospace"}}>{ph.p_tree}</td>
                        <td style={{padding:"7px 10px",color:C.orange,fontFamily:"monospace"}}>{ph.k_tree}</td>
                        <td style={{padding:"7px 10px",color:C.green,fontFamily:"monospace"}}>{ph.mg_tree}</td>
                        <td style={{padding:"7px 10px",color:C.amberLt,fontFamily:"monospace"}}>
                          ${((ph.n_tree*0.35)+(ph.p_tree*0.45)+(ph.k_tree*0.38)+(ph.mg_tree*0.28)).toFixed(1)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>

          <Card>
            <SecHdr title="Micronutrient Programme by Phase" color={C.purple}
              sub="B, Cu, Zn requirements — critical in juvenile phase"/>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:10}}>
                <thead>
                  <tr style={{background:C.navyLt}}>
                    {["Phase","B (kg/tree)","Cu (kg/tree)","Zn (kg/tree)","Mn","Foliar?","Notes"].map((h,i) => (
                      <td key={i} style={{padding:"6px 10px",color:C.grey,fontWeight:700}}>{h}</td>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(AGE_PHASES.micronutrients).map(([phase, vals],i) => {
                    const phaseInfo = AGE_PHASES.phases.find(p=>p.id===phase);
                    return (
                      <tr key={i} style={{borderBottom:"1px solid " + C.navyLt,
                        background:phase===agePhase?(soil.color+"11"):"transparent"}}>
                        <td style={{padding:"7px 10px",color:phase===agePhase?soil.color:C.white,fontWeight:700}}>
                          {phaseInfo ? phaseInfo.label : phase}
                        </td>
                        <td style={{padding:"7px 10px",color:C.green,fontFamily:"monospace"}}>{vals.B}</td>
                        <td style={{padding:"7px 10px",color:C.orange,fontFamily:"monospace"}}>{vals.Cu}</td>
                        <td style={{padding:"7px 10px",color:C.blue,fontFamily:"monospace"}}>{vals.Zn}</td>
                        <td style={{padding:"7px 10px",color:C.grey,fontFamily:"monospace"}}>{vals.Mn}</td>
                        <td style={{padding:"7px 10px"}}>
                          <Badge text={vals.foliarOnly?"FOLIAR ONLY":"Soil + Foliar"} color={vals.foliarOnly?C.amber:C.teal}/>
                        </td>
                        <td style={{padding:"7px 10px",fontSize:9,color:C.grey,maxWidth:200}}>{vals.note||"—"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {(activeSoil === "histosol" || activeSoil === "spodosol") && (
              <div style={{marginTop:12,background:C.amber+"15",border:"1px solid "+C.amber+"44",
                borderRadius:8,padding:"10px 14px",fontSize:10,color:C.amberLt}}>
                {activeSoil === "histosol" &&
                  "HISTOSOL JUVENILE FLAG: Cu deficiency causes 'little leaf' disease. Apply 0.05 kg Cu/tree/yr in years 0–3 via foliar (soil Cu unavailable in peat). B demand 40–60% higher than mineral soils in juvenile phase."}
                {activeSoil === "spodosol" &&
                  "SPODOSOL JUVENILE FLAG: All 5 micronutrients (B, Cu, Zn, Mn, Fe) should be applied as foliar in years 0–3. Sandy soil cannot retain any micronutrient between applications. Foliar programme is mandatory, not optional."}
              </div>
            )}
          </Card>

          <Card>
            <SecHdr title="Application Frequency by AG Management Tier" color={C.teal}
              sub="Applications per year per nutrient — soil-adjusted"/>
            {["vgam","gam","poor"].map(tier => (
              <div key={tier} style={{marginBottom:12}}>
                <div style={{fontSize:10,fontWeight:800,color:tier==="vgam"?C.green:tier==="gam"?C.teal:C.orange,
                  marginBottom:6,textTransform:"uppercase",letterSpacing:"0.08em"}}>
                  {tier.toUpperCase()} — {tier==="vgam"?"Very Good Agronomic Management":tier==="gam"?"Good Agronomic Management":"Poor Management"}
                </div>
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  {Object.entries(soil.appSchedule[tier]).filter(([k])=>k!=="note").map(([nutrient,count],i) => (
                    <div key={i} style={{background:C.navyLt,borderRadius:6,padding:"6px 10px",
                      border:"1px solid " + C.navyLt,minWidth:70,textAlign:"center"}}>
                      <div style={{fontSize:8,color:C.grey,textTransform:"uppercase",marginBottom:2}}>{nutrient}</div>
                      <div style={{fontSize:18,fontWeight:900,color:C.white,fontFamily:"monospace"}}>{count}</div>
                      <div style={{fontSize:8,color:C.grey}}>x/yr</div>
                    </div>
                  ))}
                </div>
                {tier === "vgam" && soil.appSchedule.note && (
                  <div style={{marginTop:6,fontSize:9,color:C.grey,fontStyle:"italic"}}>
                    {soil.appSchedule.note}
                  </div>
                )}
              </div>
            ))}
          </Card>
        </div>
      )}

      {/* ══ TAB: BIOAVAILABILITY ═══════════════════════════════════════════════ */}
      {activeTab === "Bioavailability" && (
        <div style={{display:"grid",gap:14}}>
          <Card>
            <SecHdr title="Nutrient Bioavailability Curves" color={soil.color}
              sub="% plant-available nutrient remaining over 365 days post-application"/>
            <div style={{display:"flex",gap:8,marginBottom:14}}>
              {["N","P","K"].map(n => (
                <button key={n} onClick={()=>setBioNutrient(n)} style={{
                  padding:"7px 18px",borderRadius:6,cursor:"pointer",fontSize:12,fontWeight:800,
                  background:bioNutrient===n?(n==="N"?C.blue:n==="P"?C.amber:C.orange)+"33":"transparent",
                  color:bioNutrient===n?(n==="N"?C.blueLt:n==="P"?C.amberLt:C.orangeLt):C.grey,
                  border:bioNutrient===n?("2px solid "+(n==="N"?C.blue:n==="P"?C.amber:C.orange)+"55"):"2px solid transparent",
                }}>
                  {n === "N" ? "Nitrogen" : n === "P" ? "Phosphorus" : "Potassium"}
                </button>
              ))}
            </div>

            {bioNutrient === "N" && (
              <div>
                <div style={{display:"flex",gap:10,marginBottom:12,flexWrap:"wrap"}}>
                  <KPI label="Peak Day (Urea)" value={"Day " + BIOAVAIL.N.peakDay[activeSoil]} unit="nitrification peak" color={C.blue}/>
                  <KPI label="Critical Drop" value="Day 30–60" unit={"<15% threshold"} color={C.red}/>
                  <KPI label="Re-App Interval" value={soil.nLeach.riskScore>=5?"7–14 days":"21–30 days"} unit="VGAM N schedule" color={C.amber}/>
                  <KPI label="Frass Peak" value="Day 45–60" unit="sustained to day 120" color={C.teal}/>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={bioCurveData} margin={{top:10,right:20,left:0,bottom:0}}>
                    <CartesianGrid strokeDasharray="3 3" stroke={C.navyLt}/>
                    <XAxis dataKey="d" label={{value:"Days post-application",position:"insideBottom",offset:-5,fill:C.grey,fontSize:9}}
                      tick={{fill:C.grey,fontSize:9}}/>
                    <YAxis unit="%" tick={{fill:C.grey,fontSize:9}} domain={[0,80]}/>
                    <Tooltip contentStyle={{background:C.navyMid,border:"1px solid " + C.blue + "44",fontSize:10}}
                      formatter={(v,n)=>[v+"%",n]}/>
                    <Legend wrapperStyle={{fontSize:10,color:C.grey}}/>
                    <ReferenceLine y={15} stroke={C.red} strokeDasharray="6 3"
                      label={{value:"Critical Threshold 15%",fill:C.red,fontSize:8,position:"right"}}/>
                    <Line type="monotone" dataKey="Synthetic" name="Urea N" stroke={C.blue} strokeWidth={2.5}
                      dot={false} activeDot={{r:4}}/>
                    <Line type="monotone" dataKey="Frass" name="CFI Frass N" stroke={C.teal} strokeWidth={2.5}
                      strokeDasharray="8 4" dot={false} activeDot={{r:4}}/>
                  </LineChart>
                </ResponsiveContainer>
                <div style={{marginTop:10,padding:"10px 14px",background:C.navyLt,borderRadius:8,fontSize:9,
                  color:C.grey,lineHeight:1.7}}>
                  <strong style={{color:C.white}}>N Mechanism — {soil.name}:</strong>
                  {" "}Urease hydrolysis 0–7 days; nitrification peak 7–21 days; leaching dissipation 21–90 days.
                  {" "}{soil.id==="histosol"?"pH 3.8 inhibits nitrification — peak availability limited to ~38%. High volatilisation (22%) from peat urease."
                    :soil.id==="spodosol"?"CEC 2 meq — N drops below critical threshold by day 30. Minimum 5–6 applications/yr mandatory."
                    :"CFI frass N (protein-bound) sustains availability 3–4x longer than urea — peak at day 45–60 vs day 14 for urea."}
                </div>
              </div>
            )}

            {bioNutrient === "P" && (
              <div>
                <div style={{display:"flex",gap:10,marginBottom:12,flexWrap:"wrap"}}>
                  <KPI label="TSP Fixation %" value={soil.pFix.pctFixed.typical + "%"} unit="of applied P fixed" color={C.red}/>
                  <KPI label="Loading Factor" value={"×" + BIOAVAIL.P.loadingFactor[activeSoil]} unit="gross vs crop requirement" color={C.amber}/>
                  <KPI label="CIRP Break-Even" value="Day 50–70" unit="vs TSP on this soil" color={C.teal}/>
                  <KPI label="Frass P Efficiency" value="~72%" unit={"vs ~" + (100-soil.pFix.pctFixed.typical) + "% TSP"} color={C.green}/>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={bioCurveData} margin={{top:10,right:20,left:0,bottom:0}}>
                    <CartesianGrid strokeDasharray="3 3" stroke={C.navyLt}/>
                    <XAxis dataKey="d" label={{value:"Days post-application",position:"insideBottom",offset:-5,fill:C.grey,fontSize:9}}
                      tick={{fill:C.grey,fontSize:9}}/>
                    <YAxis unit="%" tick={{fill:C.grey,fontSize:9}} domain={[0,110]}/>
                    <Tooltip contentStyle={{background:C.navyMid,border:"1px solid "+C.amber+"44",fontSize:10}}
                      formatter={(v,n)=>[v+"%",n]}/>
                    <Legend wrapperStyle={{fontSize:10,color:C.grey}}/>
                    <Line type="monotone" dataKey="TSP" name="TSP" stroke={C.amber} strokeWidth={2.5} dot={false}/>
                    <Line type="monotone" dataKey="CIRP" name="CIRP (Rock Phosphate)" stroke={C.orange}
                      strokeWidth={2} strokeDasharray="8 3" dot={false}/>
                    <Line type="monotone" dataKey="Frass" name="CFI Frass P" stroke={C.teal}
                      strokeWidth={2.5} strokeDasharray="6 4" dot={false}/>
                  </LineChart>
                </ResponsiveContainer>
                <div style={{marginTop:10,padding:"10px 14px",background:C.navyLt,borderRadius:8,fontSize:9,
                  color:C.grey,lineHeight:1.7}}>
                  <strong style={{color:C.white}}>P Mechanism — {soil.name}:</strong>
                  {" "}TSP dissolves immediately but {soil.pFix.pctFixed.typical}% fixes to Fe/Al oxides within 7–14 days.
                  {" "}CIRP dissolves slowly (60–90 days) — less fixation but delayed availability.
                  {" "}CFI frass P is phospholipid/phytate — enzymatic release, bypasses Fe/Al fixation entirely.
                  {" "}{soil.id==="oxisol"?"Oxisol: TSP retains only 10–12% availability long-term — CIRP must be primary P source."
                    :soil.id==="histosol"?"Histosol: P mechanism is OM-complexation not Fe/Al fixation — frass advantage is retention not bypass."
                    :""}
                </div>
              </div>
            )}

            {bioNutrient === "K" && (
              <div>
                <div style={{display:"flex",gap:10,marginBottom:12,flexWrap:"wrap"}}>
                  <KPI label="K at Day 30" value={BIOAVAIL.K[activeSoil][3] ? BIOAVAIL.K[activeSoil][3].v + "%" : "—"} unit="retained (MOP)" color={C.orange}/>
                  <KPI label="K at Day 90" value={BIOAVAIL.K[activeSoil][5] ? BIOAVAIL.K[activeSoil][5].v + "%" : "—"} unit="retained" color={C.amber}/>
                  <KPI label="CEC K Retention" value={soil.cec > 15 ? "Good" : soil.cec > 8 ? "Moderate" : "POOR"} unit={soil.cec + " meq/100g"} color={C.teal}/>
                  <KPI label="K Application Freq" value={soil.appSchedule.vgam.K + "x/yr"} unit="VGAM tier minimum" color={C.red}/>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={bioCurveData} margin={{top:10,right:20,left:0,bottom:0}}>
                    <CartesianGrid strokeDasharray="3 3" stroke={C.navyLt}/>
                    <XAxis dataKey="d" label={{value:"Days post-application",position:"insideBottom",offset:-5,fill:C.grey,fontSize:9}}
                      tick={{fill:C.grey,fontSize:9}}/>
                    <YAxis unit="%" tick={{fill:C.grey,fontSize:9}} domain={[0,100]}/>
                    <Tooltip contentStyle={{background:C.navyMid,border:"1px solid "+C.orange+"44",fontSize:10}}
                      formatter={(v,n)=>[v+"%",n]}/>
                    <Legend wrapperStyle={{fontSize:10,color:C.grey}}/>
                    <ReferenceLine y={40} stroke={C.amber} strokeDasharray="5 3"
                      label={{value:"Deficiency risk <40%",fill:C.amber,fontSize:8,position:"right"}}/>
                    <Line type="monotone" dataKey="MOP" name="MOP (Synthetic K)" stroke={C.orange} strokeWidth={2.5} dot={false}/>
                    <Line type="monotone" dataKey="Frass" name="CFI Frass K" stroke={C.teal}
                      strokeWidth={2.5} strokeDasharray="6 4" dot={false}/>
                  </LineChart>
                </ResponsiveContainer>
                <div style={{marginTop:10,padding:"10px 14px",background:C.navyLt,borderRadius:8,fontSize:9,
                  color:C.grey,lineHeight:1.7}}>
                  <strong style={{color:C.white}}>K Mechanism — {soil.name}:</strong>
                  {" "}K is immediately available but CEC determines retention.
                  {" "}{soil.id==="spodosol"?"SPODOSOL CRITICAL: CEC 2 meq means K drops below deficiency risk within 14 days. Split K into 0.5 kg K2O/application, 5–6x/yr. Never broadcast large doses."
                    :soil.id==="histosol"?"HISTOSOL: High OM-CEC retains K well BUT excess K causes Mg crash (Ca:Mg:K antagonism). Hard cap: 1 kg K2O/tree/application, 4 kg total/yr."
                    :"Application frequency should match CEC retention capacity to avoid luxury consumption or leaching loss."}
                </div>
              </div>
            )}
          </Card>

          <Card>
            <SecHdr title="Leaf Tissue Critical Thresholds" color={C.purple}
              sub="Monitoring triggers for top-up applications — frond 17 standards (IOPRI/MPOB)"/>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:10}}>
                <thead>
                  <tr style={{background:C.navyLt}}>
                    {["Nutrient","Sample Point","Adequate Range","Deficient","Critical (<)","Toxicity (>)","Symptom"].map((h,i)=>(
                      <td key={i} style={{padding:"6px 10px",color:C.grey,fontWeight:700}}>{h}</td>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {LEAF_THRESHOLDS.map((row,i)=>(
                    <tr key={i} style={{borderBottom:"1px solid "+C.navyLt}}>
                      <td style={{padding:"7px 10px",color:C.teal,fontWeight:800}}>{row.nutrient}</td>
                      <td style={{padding:"7px 10px",color:C.grey,fontSize:9}}>{row.leaflet}</td>
                      <td style={{padding:"7px 10px",color:C.green,fontFamily:"monospace",fontSize:9}}>{row.adequate}</td>
                      <td style={{padding:"7px 10px",color:C.amber,fontFamily:"monospace",fontSize:9}}>{row.deficient}</td>
                      <td style={{padding:"7px 10px",color:C.red,fontFamily:"monospace",fontWeight:700}}>{row.critical}</td>
                      <td style={{padding:"7px 10px",color:C.orange,fontFamily:"monospace",fontSize:9}}>{row.toxicity}</td>
                      <td style={{padding:"7px 10px",color:C.grey,fontSize:9,maxWidth:160}}>{row.symptom}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ══ TAB: N LEACHING ═══════════════════════════════════════════════════ */}
      {activeTab === "N Leaching" && (
        <div style={{display:"grid",gap:14}}>
          <Card>
            <SecHdr title="Rainfall N Top-Up Calculator" color={C.blue}
              sub="Compensatory N dose required after cumulative rainfall event (IOPRI leaching coefficients)"/>
            <div style={{marginBottom:14}}>
              <div style={{fontSize:10,color:C.grey,marginBottom:8}}>
                Cumulative Rainfall Since Last N Application:
              </div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {N_TOPUP.thresholds.map(t => (
                  <button key={t} onClick={()=>setNRainfall(t)} style={{
                    padding:"8px 16px",borderRadius:6,cursor:"pointer",fontSize:12,fontWeight:700,
                    background:nRainfall===t?(C.blue+"33"):"transparent",
                    color:nRainfall===t?C.blueLt:C.grey,
                    border:nRainfall===t?("2px solid "+C.blue+"55"):"2px solid transparent",
                  }}>
                    {t} mm
                  </button>
                ))}
              </div>
            </div>

            <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:14}}>
              {topupData.map((s,i) => (
                <div key={i} style={{flex:1,minWidth:100,background:C.navyLt,borderRadius:8,
                  padding:"10px 14px",border:"1px solid "+(s.id===activeSoil?s.color+44:"transparent"),
                  outline:s.id===activeSoil?"2px solid "+s.color+"66":"none"}}>
                  <div style={{fontSize:9,color:s.color,fontWeight:700,marginBottom:2}}>{s.name}</div>
                  <div style={{fontSize:22,fontWeight:900,color:C.white,fontFamily:"'Courier New',monospace",lineHeight:1}}>
                    {s.topupKg}
                  </div>
                  <div style={{fontSize:8,color:C.grey}}>kg N / tree</div>
                  <div style={{fontSize:9,color:C.amber,marginTop:3,fontFamily:"monospace"}}>
                    {(s.topupKg/0.46*1000).toFixed(0)} g Urea
                  </div>
                </div>
              ))}
            </div>

            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={topupData} margin={{top:4,right:10,left:0,bottom:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.navyLt}/>
                <XAxis dataKey="name" tick={{fill:C.grey,fontSize:9}}/>
                <YAxis tick={{fill:C.grey,fontSize:9}} unit=" kg"/>
                <Tooltip contentStyle={{background:C.navyMid,border:"1px solid "+C.blue+"44",fontSize:10}}
                  formatter={(v)=>[v+" kg N/tree","Top-up dose"]}/>
                <Bar dataKey="topupKg" name="N Top-up kg/tree" radius={[4,4,0,0]}>
                  {topupData.map((s,i)=><Cell key={i} fill={s.id===activeSoil?s.color:C.grey+"55"}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card>
            <SecHdr title="N Loss Pathways by Soil" color={C.amber}
              sub="Volatilisation, denitrification, biological immobilisation (% of applied N)"/>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:10}}>
                <thead>
                  <tr style={{background:C.navyLt}}>
                    <td style={{padding:"7px 10px",color:C.grey,fontWeight:700}}>Soil</td>
                    <td style={{padding:"7px 10px",color:C.orange,fontWeight:700}}>Volatilisation %</td>
                    <td style={{padding:"7px 10px",color:C.red,fontWeight:700}}>Denitrification %</td>
                    <td style={{padding:"7px 10px",color:C.blue,fontWeight:700}}>Immobilisation %</td>
                    <td style={{padding:"7px 10px",color:C.green,fontWeight:700}}>Effective N %</td>
                    <td style={{padding:"7px 10px",color:C.grey,fontWeight:700}}>Key Note</td>
                  </tr>
                </thead>
                <tbody>
                  {SOILS.map((s,i) => {
                    const v = N_TOPUP.volatilisation[s.id].pct;
                    const d = N_TOPUP.denitrification[s.id].pct;
                    const im = N_TOPUP.immobilisation[s.id].pct;
                    const eff = 100 - v - d - im;
                    return (
                      <tr key={i} style={{borderBottom:"1px solid "+C.navyLt,
                        background:s.id===activeSoil?(s.color+"11"):"transparent"}}>
                        <td style={{padding:"7px 10px",color:s.id===activeSoil?s.color:C.white,fontWeight:s.id===activeSoil?800:400}}>
                          {s.name}
                        </td>
                        <td style={{padding:"7px 10px",color:C.orange,fontFamily:"monospace",fontWeight:700}}>{v}%</td>
                        <td style={{padding:"7px 10px",color:C.red,fontFamily:"monospace",fontWeight:700}}>{d}%</td>
                        <td style={{padding:"7px 10px",color:C.blue,fontFamily:"monospace"}}>{im}%</td>
                        <td style={{padding:"7px 10px",fontFamily:"monospace",fontWeight:800,
                          color:eff>70?C.green:eff>55?C.amber:C.red}}>{Math.max(0,eff)}%</td>
                        <td style={{padding:"7px 10px",fontSize:9,color:C.grey,maxWidth:200}}>
                          {N_TOPUP.volatilisation[s.id].note}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div style={{marginTop:10,background:C.amber+"11",border:"1px solid "+C.amber+"33",
              borderRadius:8,padding:"10px 14px",fontSize:9,color:C.amberLt,lineHeight:1.7}}>
              <strong>N Efficiency Key:</strong> Effective N = 100% - Volatilisation - Denitrification - Immobilisation.
              Histosol: combined losses can exceed 70% of applied urea under wet conditions — CFI slow-release N profile is the single most important agronomic intervention on peat.
              Spodosol: leaching (not shown here) accounts for a further 40–70% of N loss — multiply Spodosol N application rates by 1.5–2.0x vs Inceptisol baseline.
            </div>
          </Card>
        </div>
      )}

      {/* ══ TAB: EMISSIONS ════════════════════════════════════════════════════ */}
      {activeTab === "Emissions" && (
        <div style={{display:"grid",gap:14}}>
          <Card>
            <SecHdr title="GHG Emissions Scorecard — Synthetic Fertiliser Programme" color={C.teal}
              sub="IPCC Tier 1 · AR5/AR6 · Direct N2O + Indirect N2O + Scope 3 Manufacturing"/>
            <div style={{display:"flex",gap:8,marginBottom:12}}>
              {["AR5","AR6"].map(g => (
                <button key={g} onClick={()=>setEmissionsGWP(g)} style={{
                  padding:"6px 14px",borderRadius:6,cursor:"pointer",fontSize:10,fontWeight:700,
                  background:emissionsGWP===g?(C.red+"33"):"transparent",
                  color:emissionsGWP===g?C.redLt:C.grey,
                  border:emissionsGWP===g?("1px solid "+C.red+"55"):"1px solid transparent",
                }}>
                  IPCC {g} (GWP={g==="AR5"?265:273})
                </button>
              ))}
              <div style={{fontSize:9,color:C.grey,alignSelf:"center",marginLeft:8}}>
                EF1 mineral = 1.0% · EF1 Histosol = 8.0% (IPCC 2006 Vol4 Ch11) · EF5 = 0.011
              </div>
            </div>

            {/* All-soil emissions heatmap table */}
            <div style={{overflowX:"auto",marginBottom:14}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:10}}>
                <thead>
                  <tr style={{background:C.navyLt}}>
                    {["Soil","Direct N2O","Indirect N2O","Scope 3 (Mfg)","TOTAL kg CO2e/ha","Per Tree","CFI Saving (ha)"].map((h,i)=>(
                      <td key={i} style={{padding:"7px 10px",color:C.grey,fontWeight:700}}>{h}</td>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {emHeatData.map((row,i) => {
                    const maxTotal = Math.max(...emHeatData.map(r=>r.total));
                    const intensity = row.total / maxTotal;
                    const bgColor = intensity > 0.8 ? C.red+"33" : intensity > 0.5 ? C.orange+"22" : C.green+"11";
                    return (
                      <tr key={i} onClick={()=>setActiveSoil(row.id)} style={{
                        borderBottom:"1px solid "+C.navyLt, cursor:"pointer", background:bgColor}}>
                        <td style={{padding:"7px 10px",color:row.color,fontWeight:700}}>
                          {row.name}{row.id===activeSoil&&<span style={{color:row.color,fontSize:8,marginLeft:5}}>← ACTIVE</span>}
                        </td>
                        <td style={{padding:"7px 10px",color:C.red,fontFamily:"monospace",fontWeight:700}}>{row.directN2O}</td>
                        <td style={{padding:"7px 10px",color:C.orange,fontFamily:"monospace"}}>{row.indirectN2O}</td>
                        <td style={{padding:"7px 10px",color:C.amber,fontFamily:"monospace"}}>{row.scope3}</td>
                        <td style={{padding:"7px 10px",fontFamily:"monospace",fontWeight:900,fontSize:12,
                          color:row.total>5000?C.red:row.total>2000?C.orange:C.green}}>{row.total.toLocaleString()}</td>
                        <td style={{padding:"7px 10px",color:C.grey,fontFamily:"monospace"}}>{row.perTree}</td>
                        <td style={{padding:"7px 10px",color:C.teal,fontFamily:"monospace",fontWeight:700}}>-{row.cfiSaving.toLocaleString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div style={{background:C.red+"11",border:"1px solid "+C.red+"33",borderRadius:8,
              padding:"10px 14px",fontSize:9,color:C.redLt,lineHeight:1.7}}>
              Histosol N2O emissions are 6–10x mineral soils due to IPCC EF1 = 8.0% for organic soils (vs 1.0%).
              This is the single largest source of fertiliser-attributable GHG in Indonesian palm.
              CFI slow-release N on Histosol reduces direct N2O by 35–45% relative to urea broadcast.
              Per IPCC AR5 GWP100 = 265 for N2O; AR6 = 273.
            </div>
          </Card>

          <Card>
            <SecHdr title={"Active Soil: " + soil.name + " — Full Emissions Breakdown"} color={soil.color}
              sub="Scope 1 (direct) + Scope 3 (manufacturing) · Mature stand prime bearing"/>
            <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:14}}>
              <KPI label="Direct N2O (AR5)" value={ghg.co2e_direct_AR5.toLocaleString()} unit="kg CO2e/ha/yr"
                color={ghg.co2e_direct_AR5>5000?C.red:C.orange}/>
              <KPI label="Direct N2O (AR6)" value={ghg.co2e_direct_AR6.toLocaleString()} unit="kg CO2e/ha/yr" color={C.orange}/>
              <KPI label="Indirect N2O" value={ghg.co2e_indirect_AR5.toLocaleString()} unit="kg CO2e/ha/yr (leaching)" color={C.amber}/>
              <KPI label="Scope 3 Total" value={ghg.totalScope3.toLocaleString()} unit="kg CO2e/ha/yr (mfg)" color={C.blue}/>
              <KPI label="GRAND TOTAL" value={ghg.totalGHG_AR5.toLocaleString()} unit="kg CO2e/ha/yr (AR5)"
                color={soil.color} note={"EF1=" + (ghg.EF1*100).toFixed(0) + "% | N=" + ghg.N + "kg/ha"}/>
              <KPI label="CFI Net Saving" value={"-" + ghg.cfiSaving.toLocaleString()} unit="kg CO2e/ha/yr" color={C.green}/>
            </div>

            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:10}}>
                <thead>
                  <tr style={{background:C.navyLt}}>
                    {["Component","Calculation","kg CO2e/ha/yr","% of Total"].map((h,i)=>(
                      <td key={i} style={{padding:"7px 10px",color:C.grey,fontWeight:700}}>{h}</td>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    {label:"Direct N2O (EF1)",calc:ghg.N+"kg N × EF1 "+ghg.EF1+" × 44/28 × GWP265",val:ghg.co2e_direct_AR5,color:C.red},
                    {label:"Indirect N2O (EF5)",calc:ghg.L+"kg N leached × 0.011 × 44/28 × 265",val:ghg.co2e_indirect_AR5,color:C.orange},
                    {label:"Scope 3: Urea mfg",calc:ghg.N+" × 2.4 kg CO2e/kg N",val:ghg.s3_n,color:C.amber},
                    {label:"Scope 3: TSP mfg",calc:soil.fertReq.p.perHaKg+" × 1.8 kg CO2e/kg P2O5",val:ghg.s3_p,color:C.amberLt},
                    {label:"Scope 3: MOP mfg",calc:soil.fertReq.k.perHaKg+" × 0.5 kg CO2e/kg K2O",val:ghg.s3_k,color:C.blue},
                    {label:"Scope 3: Kieserite",calc:soil.fertReq.mg.perHaKg+" × 0.3 kg CO2e/kg MgO",val:ghg.s3_mg,color:C.blueLt},
                    {label:"Scope 3: Lime (annualised)",calc:(soil.fertReq.lime.perHaKg/3).toFixed(0)+" × 0.7 kg CO2e/kg CaO",val:ghg.s3_lime,color:C.grey},
                  ].map((row,i) => (
                    <tr key={i} style={{borderBottom:"1px solid "+C.navyLt}}>
                      <td style={{padding:"7px 10px",color:row.color,fontWeight:700}}>{row.label}</td>
                      <td style={{padding:"7px 10px",color:C.grey,fontSize:9,fontFamily:"monospace"}}>{row.calc}</td>
                      <td style={{padding:"7px 10px",color:row.color,fontFamily:"monospace",fontWeight:700}}>{row.val.toLocaleString()}</td>
                      <td style={{padding:"7px 10px",color:C.grey,fontFamily:"monospace"}}>
                        {ghg.totalGHG_AR5 > 0 ? (row.val/ghg.totalGHG_AR5*100).toFixed(1)+"%" : "—"}
                      </td>
                    </tr>
                  ))}
                  <tr style={{background:C.navyLt,fontWeight:900}}>
                    <td style={{padding:"8px 10px",color:soil.color,fontWeight:900}} colSpan={2}>TOTAL (AR5)</td>
                    <td style={{padding:"8px 10px",color:soil.color,fontFamily:"monospace",fontWeight:900,fontSize:13}}>
                      {ghg.totalGHG_AR5.toLocaleString()}
                    </td>
                    <td style={{padding:"8px 10px",color:C.grey}}>100%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ══ TAB: CORRECTIVES ══════════════════════════════════════════════════ */}
      {activeTab === "Correctives" && (
        <div style={{display:"grid",gap:14}}>
          <Card>
            <SecHdr title="Supplementary Mineral Programme" color={soil.color}
              sub="Full corrective schedule — mandatory vs optional vs not recommended per soil"/>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:9}}>
                <thead>
                  <tr style={{background:C.navyLt}}>
                    {["Product","Formula","Function","Status","Dose","Timing","Notes"].map((h,i)=>(
                      <td key={i} style={{padding:"7px 10px",color:C.grey,fontWeight:700,whiteSpace:"nowrap"}}>{h}</td>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {CORRECTIVES.map((row,i) => {
                    const sdata = row[activeSoil];
                    const statusColor = sdata.status==="MANDATORY"?C.red:
                      sdata.status==="RECOMMENDED"?C.amber:
                      sdata.status==="OPTIONAL"?C.teal:C.grey;
                    return (
                      <tr key={i} style={{borderBottom:"1px solid "+C.navyLt,
                        background:sdata.status==="MANDATORY"?(C.red+"08"):
                          sdata.status==="NOT REC"?(C.grey+"05"):"transparent"}}>
                        <td style={{padding:"7px 10px",color:C.white,fontWeight:700,whiteSpace:"nowrap"}}>{row.product}</td>
                        <td style={{padding:"7px 10px",color:C.grey,fontFamily:"monospace",fontSize:8}}>{row.formula}</td>
                        <td style={{padding:"7px 10px",color:C.teal,fontSize:9}}>{row.function}</td>
                        <td style={{padding:"7px 10px"}}>
                          <Badge text={sdata.status} color={statusColor} size={sdata.status==="NOT REC"?"xs":"sm"}/>
                        </td>
                        <td style={{padding:"7px 10px",color:C.amberLt,fontSize:9}}>{sdata.dose}</td>
                        <td style={{padding:"7px 10px",color:C.grey,fontSize:8}}>{sdata.timing}</td>
                        <td style={{padding:"7px 10px",color:C.grey,fontSize:8,maxWidth:200,lineHeight:1.4}}>{row.note}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          <Card>
            <SecHdr title="P Fixation Loading Factors" color={C.amber}
              sub="Gross application rate required to deliver net crop P requirement"/>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:10}}>
                <thead>
                  <tr style={{background:C.navyLt}}>
                    {["Soil","Fixation %","Loading Factor","Net P per kg TSP applied","CIRP Advantage","Frass vs TSP efficiency"].map((h,i)=>(
                      <td key={i} style={{padding:"7px 10px",color:C.grey,fontWeight:700}}>{h}</td>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {SOILS.map((s,i) => {
                    const fix = BIOAVAIL.P.fixationPct[s.id];
                    const lf  = BIOAVAIL.P.loadingFactor[s.id];
                    const net = (1 - fix/100).toFixed(2);
                    const cirpAdv = fix > 50 ? "SIGNIFICANT — CIRP outperforms TSP after day 60" : "Moderate — 50:50 blend recommended";
                    const frassEff = ((0.72 / (1 - fix/100)) * 100).toFixed(0);
                    return (
                      <tr key={i} style={{borderBottom:"1px solid "+C.navyLt,
                        background:s.id===activeSoil?(s.color+"11"):"transparent"}}>
                        <td style={{padding:"7px 10px",color:s.id===activeSoil?s.color:C.white,fontWeight:700}}>{s.name}</td>
                        <td style={{padding:"7px 10px",fontFamily:"monospace",fontWeight:700,
                          color:fix>60?C.red:fix>40?C.orange:C.amber}}>{fix}%</td>
                        <td style={{padding:"7px 10px",color:C.white,fontFamily:"monospace",fontWeight:800}}>×{lf}</td>
                        <td style={{padding:"7px 10px",color:C.green,fontFamily:"monospace"}}>{net} kg available</td>
                        <td style={{padding:"7px 10px",fontSize:9,color:fix>50?C.amber:C.grey}}>{cirpAdv}</td>
                        <td style={{padding:"7px 10px",fontFamily:"monospace",fontWeight:700,
                          color:C.teal}}>{frassEff}% more efficient</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ══ TAB: CFI VALUE ════════════════════════════════════════════════════ */}
      {activeTab === "CFI Value" && (
        <div style={{display:"grid",gap:14}}>
          {/* CFI Value entry banner — same style as Charts button */}
          <div style={{cursor:"default",borderRadius:10,
            background:"linear-gradient(135deg, " + soil.color + "22 0%, #0f2040 60%, " + soil.color + "11 100%)",
            border:"2px solid " + soil.color + "66",
            boxShadow:"0 0 18px " + soil.color + "33",
            padding:"12px 18px",
            display:"flex",alignItems:"flex-start",justifyContent:"flex-start",
            gap:20}}>
            <div style={{background:soil.color,color:"#060e1e",fontWeight:900,
              borderRadius:8,padding:"14px 28px",whiteSpace:"nowrap",flexShrink:0,
              boxShadow:"0 0 16px "+soil.color+"77",textAlign:"center",minWidth:140}}>
              <div style={{fontSize:17,fontWeight:900,letterSpacing:"0.05em",lineHeight:1.2}}>
                {"CFI VALUE"}
              </div>
              <div style={{fontSize:13,fontWeight:800,letterSpacing:"0.1em",marginTop:3,opacity:0.85}}>
                {"$/TONNE"}
              </div>
            </div>
            <div style={{alignSelf:"center"}}>
              <div style={{fontSize:15,fontWeight:900,color:soil.color,letterSpacing:"0.04em",
                textTransform:"uppercase",marginBottom:4}}>
                {"CFI Biofertiliser Replacement Value — " + soil.name}
              </div>
              <div style={{display:"flex",gap:14,flexWrap:"wrap",alignItems:"baseline"}}>
                <span style={{fontSize:13,color:C.blue,fontWeight:800}}>
                  {"N $" + soil.cfiValue.nVal.toFixed(0) + "/t"}
                  <span style={{fontSize:9,color:C.grey,marginLeft:4}}>{"N loss " + (soil.cfiValue.nLossFrac*100).toFixed(0) + "%"}</span>
                </span>
                <span style={{fontSize:13,color:C.amber,fontWeight:800}}>
                  {"P $" + soil.cfiValue.pVal.toFixed(0) + "/t"}
                  <span style={{fontSize:9,color:C.grey,marginLeft:4}}>{"P fixed " + (soil.cfiValue.pFixedFrac*100).toFixed(0) + "%"}</span>
                </span>
                <span style={{fontSize:13,color:C.orange,fontWeight:800}}>
                  {"K $" + soil.cfiValue.kVal.toFixed(0) + "/t"}
                </span>
                <span style={{fontSize:15,color:soil.color,fontWeight:900,
                  background:soil.color+"22",borderRadius:6,padding:"2px 10px",
                  border:"1px solid "+soil.color+"55"}}>
                  {"TOTAL $" + soil.cfiValue.total.toFixed(0) + "/t"}
                </span>
                <span style={{fontSize:11,color:C.teal,fontWeight:700}}>{soil.cfiSubstitutionPct + "% sub potential"}</span>
                <span style={{fontSize:11,color:C.green,fontWeight:700}}>
                  {"$" + Math.round(soil.fertReq.totalCostHaYr*soil.cfiSubstitutionPct/100) + "/ha saving"}
                </span>
              </div>
              <div style={{fontSize:9,color:C.grey,marginTop:6,fontStyle:"italic"}}>{soil.cfiValue.note}</div>
            </div>
          </div>
          <Card>
            <div style={{padding:"10px 14px",background:soil.color+"11",border:"1px solid "+soil.color+"33",
              borderRadius:8,fontSize:10,color:C.grey,lineHeight:1.7,marginBottom:0}}>
              {soil.cfiAdvantage}
            </div>
          </Card>

          <Card>
            <SecHdr title="Cross-Soil CFI Value Comparison" color={C.teal}
              sub="$/tonne frass — total nutrient replacement value at normal management"/>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={SOILS.map(s=>({name:s.name.split(" ")[0],total:s.cfiValue.total,id:s.id}))}
                margin={{top:4,right:10,left:0,bottom:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.navyLt}/>
                <XAxis dataKey="name" tick={{fill:C.grey,fontSize:9}}/>
                <YAxis tick={{fill:C.grey,fontSize:9}} unit="$"/>
                <Tooltip contentStyle={{background:C.navyMid,border:"1px solid "+C.amber+"44",fontSize:10}}
                  formatter={(v)=>["$"+v.toFixed(0)+"/t","CFI Value"]}/>
                <Bar dataKey="total" radius={[4,4,0,0]}>
                  {SOILS.map((s,i)=><Cell key={i} fill={s.id===activeSoil?s.color:C.grey+"55"}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}

      {/* ══ TAB: CROSS-SOIL ═══════════════════════════════════════════════════ */}
      {activeTab === "Cross-Soil" && (
        <div style={{display:"grid",gap:14}}>
          <Card>
            <SecHdr title="Cross-Soil Summary — All 5 Indonesian Palm Soils" color={C.teal}
              sub="Comparative fertiliser cost, emissions, and CFI substitution potential"/>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:10}}>
                <thead>
                  <tr style={{background:C.navyLt}}>
                    {["Soil","pH","CEC","N Leach","P Fix %","Fert $/ha","CFI Sub","GHG CO2e/ha","Annual Saving"].map((h,i)=>(
                      <td key={i} style={{padding:"7px 10px",color:C.grey,fontWeight:700}}>{h}</td>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {SOILS.map((s,i) => {
                    const g = allGHG.find(g=>g.id===s.id);
                    return (
                      <tr key={i} onClick={()=>setActiveSoil(s.id)} style={{
                        borderBottom:"1px solid "+C.navyLt, cursor:"pointer",
                        background:s.id===activeSoil?(s.color+"11"):"transparent"}}>
                        <td style={{padding:"7px 10px",color:s.id===activeSoil?s.color:C.white,fontWeight:700}}>
                          {s.name}{s.id===activeSoil&&<span style={{fontSize:8,color:s.color,marginLeft:5}}>← ACTIVE</span>}
                        </td>
                        <td style={{padding:"7px 10px",fontFamily:"monospace",color:C.grey}}>{s.ph.typical}</td>
                        <td style={{padding:"7px 10px",fontFamily:"monospace",color:C.grey}}>{s.cec}</td>
                        <td style={{padding:"7px 10px",fontFamily:"monospace",
                          color:s.nLeach.riskScore>=5?C.red:C.amber}}>{s.nLeach.kgHaYr.typical} kg</td>
                        <td style={{padding:"7px 10px",fontFamily:"monospace",
                          color:s.pFix.riskScore>=5?C.red:C.amber}}>{s.pFix.pctFixed.typical}%</td>
                        <td style={{padding:"7px 10px",fontFamily:"monospace",color:C.amberLt,fontWeight:700}}>
                          ${s.fertReq.totalCostHaYr}
                        </td>
                        <td style={{padding:"7px 10px",fontFamily:"monospace",color:C.teal,fontWeight:700}}>
                          {s.cfiSubstitutionPct}%
                        </td>
                        <td style={{padding:"7px 10px",fontFamily:"monospace",
                          color:g.totalGHG_AR5>5000?C.red:g.totalGHG_AR5>2000?C.orange:C.green,fontWeight:700}}>
                          {g.totalGHG_AR5.toLocaleString()}
                        </td>
                        <td style={{padding:"7px 10px",fontFamily:"monospace",color:C.green,fontWeight:700}}>
                          ${Math.round(s.fertReq.totalCostHaYr*s.cfiSubstitutionPct/100)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          <Card>
            <SecHdr title="Annual Fertiliser Cost vs GHG Emissions" color={C.amber}
              sub="Cost per ha and emissions per ha — mature stand prime bearing"/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
              <div>
                <div style={{fontSize:9,color:C.grey,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.07em"}}>
                  Fertiliser Cost $/ha/yr
                </div>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={SOILS.map(s=>({name:s.name.split(" ")[0],cost:s.fertReq.totalCostHaYr,id:s.id}))}
                    margin={{top:4,right:10,left:0,bottom:0}}>
                    <CartesianGrid strokeDasharray="3 3" stroke={C.navyLt}/>
                    <XAxis dataKey="name" tick={{fill:C.grey,fontSize:9}}/>
                    <YAxis tick={{fill:C.grey,fontSize:9}} unit="$"/>
                    <Tooltip contentStyle={{background:C.navyMid,fontSize:10}}/>
                    <Bar dataKey="cost" radius={[4,4,0,0]}>
                      {SOILS.map((s,i)=><Cell key={i} fill={s.id===activeSoil?s.color:C.grey+"55"}/>)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div>
                <div style={{fontSize:9,color:C.grey,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.07em"}}>
                  GHG Emissions kg CO2e/ha/yr (IPCC AR5)
                </div>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={emHeatData.map(g=>({name:SOILS.find(s=>s.id===g.id).name.split(" ")[0],total:g.total,id:g.id}))}
                    margin={{top:4,right:10,left:0,bottom:0}}>
                    <CartesianGrid strokeDasharray="3 3" stroke={C.navyLt}/>
                    <XAxis dataKey="name" tick={{fill:C.grey,fontSize:9}}/>
                    <YAxis tick={{fill:C.grey,fontSize:9}}/>
                    <Tooltip contentStyle={{background:C.navyMid,fontSize:10}}/>
                    <Bar dataKey="total" radius={[4,4,0,0]}>
                      {SOILS.map((s,i)=><Cell key={i} fill={s.id===activeSoil?s.color:C.grey+"55"}/>)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
        </div>
      )}


      {/* ══ TAB: CFI NUTRITION CHARTS ══════════════════════════════════════════ */}
      {activeTab === "CFI Nutrition Charts" && (
        <div style={{display:"grid",gap:14}}>

          {/* Phase selector strip */}
          <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap",
            background:C.navyMid,borderRadius:10,padding:"10px 16px",
            border:"1px solid " + soil.color + "33"}}>
            <span style={{fontSize:10,color:C.grey,fontWeight:700,marginRight:4}}>PALM AGE PHASE:</span>
            {AGE_PHASES.phases.map(ph => (
              <button key={ph.id} onClick={()=>setChartPhase(ph.id)} style={{
                padding:"6px 14px",borderRadius:6,cursor:"pointer",fontSize:10,
                fontWeight:chartPhase===ph.id?800:400,
                background:chartPhase===ph.id?(soil.color+"22"):"transparent",
                color:chartPhase===ph.id?soil.color:C.grey,
                border:chartPhase===ph.id?("1px solid "+soil.color+"55"):"1px solid transparent",
              }}>
                {ph.label}
                <span style={{fontSize:8,opacity:0.7,marginLeft:4}}>{ph.years}</span>
              </button>
            ))}
            <div style={{marginLeft:"auto",fontSize:9,color:C.grey}}>
              Frass: 60% DM · 3% N · 2.8% P2O5 · 2.2% K2O · 18kg N/t
            </div>
          </div>

          {/* CHART ROW 1 — N Bioavailability per tree over 13 months */}
          <Card>
            <SecHdr title="N Bioavailability Per Tree — 13 Months" color={soil.color}
              sub={"Urea (single dose) vs CFI Frass (single dose) · " + soil.name + " · kg plant-available N per tree"}/>
            <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:12}}>
              <KPI label="Urea N Applied" value={monthlyNData[0] ? monthlyNData[0].nPerTree + " kg" : "—"}
                unit="per tree (synthetic)" color={C.blue}
                note="All applied at day 0. Peak at day 7–14 then crash."/>
              <KPI label="Frass N Applied" value={monthlyNData[0] ? monthlyNData[0].frassApplied + " kg" : "—"}
                unit="per tree (in frass dose)" color={C.teal}
                note="Protein-bound N. Slow mineralisation — sustains to month 4–5."/>
              <KPI label="Frass Advantage" value={"+" + frassDosePhase.nUtil*100 .toFixed(0) + "% util"}
                unit={"vs " + (100-soil.cfiValue.nLossFrac*100).toFixed(0) + "% synthetic"} color={C.green}
                note={"Slow release cuts " + (soil.id==="histosol"?"volatilisation + N2O":"leaching loss") + " on " + soil.name}/>
              <KPI label="Re-App Trigger" value={soil.nLeach.riskScore>=5?"7–14 days":"21–30 days"}
                unit="urea re-application" color={C.amber}
                note="CFI frass needs re-application at month 3–4, not every 2–3 weeks."/>
            </div>
            <ResponsiveContainer width="100%" height={290}>
              <LineChart data={monthlyNData} margin={{top:10,right:30,left:10,bottom:20}}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.navyLt}/>
                <XAxis dataKey="label"
                  label={{value:"Months post-application",position:"insideBottom",offset:-10,fill:C.grey,fontSize:9}}
                  tick={{fill:C.grey,fontSize:9}}/>
                <YAxis
                  label={{value:"kg N / tree",angle:-90,position:"insideLeft",fill:C.grey,fontSize:9,offset:10}}
                  tick={{fill:C.grey,fontSize:9}}/>
                <Tooltip contentStyle={{background:C.navyMid,border:"1px solid "+soil.color+"44",fontSize:10}}
                  formatter={(v,n)=>[v.toFixed(3)+" kg N/tree",n]}/>
                <Legend wrapperStyle={{fontSize:10,color:C.grey,paddingTop:10}}/>
                <ReferenceLine y={0.05} stroke={C.red} strokeDasharray="4 3"
                  label={{value:"Deficiency risk",fill:C.red,fontSize:8,position:"right"}}/>
                <Line type="monotone" dataKey="Urea_N_kg" name="Urea (synthetic)"
                  stroke={C.blue} strokeWidth={2.5} dot={{r:3,fill:C.blue}} activeDot={{r:5}}/>
                <Line type="monotone" dataKey="Frass_N_kg" name="CFI Frass N"
                  stroke={soil.color} strokeWidth={2.5} strokeDasharray="8 4"
                  dot={{r:3,fill:soil.color}} activeDot={{r:5}}/>
              </LineChart>
            </ResponsiveContainer>
            <div style={{background:C.navyLt,borderRadius:8,padding:"10px 14px",fontSize:9,
              color:C.grey,lineHeight:1.8,marginTop:8}}>
              <strong style={{color:C.white}}>Reading this chart:</strong>
              {" "}The Y axis shows kg of plant-available N per tree at each month after a single application.
              {" "}Urea hydrolysis peaks in 1–2 weeks then crashes — on {soil.name} it drops below deficiency risk
              {" (< 0.05 kg/tree)"} by month {soil.nLeach.riskScore >= 5 ? "1–2" : "2–3"}, requiring
              {" " + soil.appSchedule.gam.N + " re-applications per year at GAM management."}
              {" "}CFI frass N (protein-bound) mineralises slowly — peaks at month 1.5–2, then sustains to month 4–5.
              {" "}This means frass needs only {Math.ceil(soil.appSchedule.gam.N * 0.55)} applications per year to maintain the same minimum N
              {" "}floor — reducing labour cost and leaching loss simultaneously.
              {" "}{soil.id === "histosol" ?
                "HISTOSOL CRITICAL: Urea peak is suppressed (pH 3.8 inhibits nitrification) — frass releases N via mineralisation pathway that bypasses the nitrification block." :
                soil.id === "spodosol" ?
                "SPODOSOL: Urea N leaches to groundwater within 48–72hr of rain. Frass N in organic matrix is physically protected from rapid leaching — the most important CFI advantage on sandy soils." :
                ""}
            </div>
          </Card>

          {/* CHART ROW 2 — CFI Frass Tonnes/ha by Age Phase (all soils overlay) */}
          <Card>
            <SecHdr title={"CFI Frass Required — t/ha by Age Phase · " + soil.name} color={soil.color}
              sub="Tonnes of frass to fully replace synthetic NPK programme (governed by N, P, or K — whichever requires more)"/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
              {/* Left: per-ha bar chart by phase for active soil */}
              <div>
                <div style={{fontSize:9,color:C.grey,marginBottom:8,textTransform:"uppercase",letterSpacing:"0.07em"}}>
                  Tonnes per hectare · {soil.name} · Each phase
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart
                    data={AGE_PHASES.phases.map(ph => {
                      const d = calcFrassDose(soil, ph.id);
                      return {
                        label: ph.label,
                        "N-governed": d.tForN,
                        "P-governed": d.tForP,
                        "K-governed": d.tForK,
                        recommended: d.recommended,
                        gov: d.governing,
                      };
                    })}
                    margin={{top:4,right:10,left:0,bottom:0}}>
                    <CartesianGrid strokeDasharray="3 3" stroke={C.navyLt}/>
                    <XAxis dataKey="label" tick={{fill:C.grey,fontSize:9}}/>
                    <YAxis tick={{fill:C.grey,fontSize:9}} unit=" t"/>
                    <Tooltip contentStyle={{background:C.navyMid,border:"1px solid "+soil.color+"44",fontSize:10}}
                      formatter={(v,n)=>[v.toFixed(1)+" t/ha",n]}/>
                    <Legend wrapperStyle={{fontSize:9,color:C.grey}}/>
                    <Bar dataKey="N-governed" fill={C.blue+"88"} radius={[2,2,0,0]} stackId="a"/>
                    <Bar dataKey="P-governed" fill={C.amber+"88"} radius={[2,2,0,0]} stackId="b"/>
                    <Bar dataKey="K-governed" fill={C.orange+"88"} radius={[2,2,0,0]} stackId="c"/>
                    <Bar dataKey="recommended" name="RECOMMENDED (max)" fill={soil.color} radius={[4,4,0,0]}/>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              {/* Right: all-soil comparison for selected phase */}
              <div>
                <div style={{fontSize:9,color:C.grey,marginBottom:8,textTransform:"uppercase",letterSpacing:"0.07em"}}>
                  All soils · {AGE_PHASES.phases.find(p=>p.id===chartPhase) ? AGE_PHASES.phases.find(p=>p.id===chartPhase).label : "Prime"} phase
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={allSoilDose} margin={{top:4,right:10,left:0,bottom:0}}>
                    <CartesianGrid strokeDasharray="3 3" stroke={C.navyLt}/>
                    <XAxis dataKey="name" tick={{fill:C.grey,fontSize:9}}/>
                    <YAxis tick={{fill:C.grey,fontSize:9}} unit=" t"/>
                    <Tooltip contentStyle={{background:C.navyMid,border:"1px solid "+C.teal+"44",fontSize:10}}
                      formatter={(v,n)=>[v.toFixed(1)+" t/ha",n]}/>
                    <Bar dataKey="tHa" name="Recommended t/ha" radius={[4,4,0,0]}>
                      {allSoilDose.map((s,i)=>(
                        <Cell key={i} fill={s.id===activeSoil?s.color:C.grey+"55"}/>
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            {/* Per-tree KPI strip for selected phase */}
            <div style={{marginTop:12,display:"flex",gap:10,flexWrap:"wrap"}}>
              <KPI label="Recommended t/ha" value={frassDosePhase.recommended + " t"} unit={"Governing: " + frassDosePhase.governing}
                color={soil.color} note={frassDosePhase.governing==="N"?"N-limited — P and K over-supplied at this dose":"P or K limited — N slightly under if frass applied at this rate"}/>
              <KPI label="Kg per Tree" value={frassDosePhase.perTreeKg + " kg"} unit={"= " + frassDosePhase.perTree + " t/tree"} color={C.teal}/>
              <KPI label="N Delivered" value={frassDosePhase.nKgFromDose + " kg"} unit={"req: " + frassDosePhase.nReqHa + " kg/ha"} color={C.blue}/>
              <KPI label="P2O5 Delivered" value={frassDosePhase.pKgFromDose + " kg"} unit={"req: " + frassDosePhase.pReqHa + " kg/ha"} color={C.amber}/>
              <KPI label="K2O Delivered" value={frassDosePhase.kKgFromDose + " kg"} unit={"req: " + frassDosePhase.kReqHa + " kg/ha"} color={C.orange}/>
              <KPI label="Est. Frass Cost" value={"$" + frassDosePhase.annualCostHa} unit="per ha/yr @ $120/t" color={C.red}/>
            </div>
            <div style={{background:C.navyLt,borderRadius:8,padding:"10px 14px",fontSize:9,
              color:C.grey,lineHeight:1.8,marginTop:10}}>
              <strong style={{color:C.white}}>How to read the governing nutrient:</strong>
              {" "}Each bar shows tonnes of frass required to fully supply N, P, or K separately (using that soil's N-loss fraction, P fixation factor, and K leaching CEC adjustment).
              {" "}The RECOMMENDED dose = the highest of the three — applying less will leave one nutrient underfed.
              {" "}On {soil.name}, the {frassDosePhase.governing}-requirement governs because
              {frassDosePhase.governing==="N" ?
                " N losses from leaching/volatilisation/immobilisation mean more frass is needed to supply N than P or K." :
                frassDosePhase.governing==="K" ?
                " K demand is very high and CEC retention is low — more frass tonnage is needed to maintain K supply between applications." :
                " P demand after fixation adjustment requires more frass than N or K at this management level."}
            </div>
          </Card>

          {/* CHART ROW 3 — Cumulative N reservoir buildup over 5 years */}
          <Card>
            <SecHdr title="Soil N Reservoir: Synthetic vs CFI Frass — 5-Year Buildup" color={C.green}
              sub={"kg plant-available N per hectare · Annual applications · " + soil.name + " · Shows residual accumulation effect"}/>
            <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:12}}>
              <KPI label="Year 1 Frass N" value={Math.round(calcFrassDose(soil,"prime").recommended * FRASS.nKgT) + " kg/ha"}
                unit="applied in frass dose" color={C.green}
                note="First-year availability fraction ~45%. Remainder carries to Year 2."/>
              <KPI label="Year 3+ Floor" value="Builds +" unit="residual each yr" color={C.teal}
                note="Repeated applications create a rising baseline. Synthetic stays flat."/>
              <KPI label="Synthetic N" value={soil.fertReq.n.perHaKg + " kg/ha"} unit="urea applied yr" color={C.blue}
                note="No residual accumulation. Crashes between applications."/>
              <KPI label="Frass Timing" value={(soil.appSchedule.gam.N - 1) + "-" + soil.appSchedule.gam.N + "x/yr"} unit={"vs " + soil.appSchedule.gam.N + "x urea"} color={C.amber}
                note="CFI needs fewer applications due to sustained release profile."/>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={cumulativeData} margin={{top:10,right:30,left:10,bottom:20}}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.navyLt}/>
                <XAxis dataKey="month"
                  label={{value:"Months (5 years, annual applications each year)",position:"insideBottom",offset:-10,fill:C.grey,fontSize:9}}
                  tick={{fill:C.grey,fontSize:9}}
                  tickFormatter={(v)=>v%12===0?("Yr "+(v/12)):""} />
                <YAxis
                  label={{value:"kg avail. N / ha",angle:-90,position:"insideLeft",fill:C.grey,fontSize:9,offset:10}}
                  tick={{fill:C.grey,fontSize:9}}/>
                <Tooltip contentStyle={{background:C.navyMid,border:"1px solid "+C.green+"44",fontSize:10}}
                  formatter={(v,n)=>[v.toFixed(1)+" kg N/ha",n]}
                  labelFormatter={(m)=>"Month " + m + " (Yr " + (m/12).toFixed(1) + ")"}/>
                <Legend wrapperStyle={{fontSize:10,color:C.grey,paddingTop:10}}/>
                <ReferenceLine x={12}  stroke={C.grey+"44"} strokeDasharray="3 3" label={{value:"Yr 2",fill:C.grey,fontSize:8}}/>
                <ReferenceLine x={24}  stroke={C.grey+"44"} strokeDasharray="3 3" label={{value:"Yr 3",fill:C.grey,fontSize:8}}/>
                <ReferenceLine x={36}  stroke={C.grey+"44"} strokeDasharray="3 3" label={{value:"Yr 4",fill:C.grey,fontSize:8}}/>
                <ReferenceLine x={48}  stroke={C.grey+"44"} strokeDasharray="3 3" label={{value:"Yr 5",fill:C.grey,fontSize:8}}/>
                <Line type="monotone" dataKey="Synthetic_N_ha" name="Urea programme"
                  stroke={C.blue} strokeWidth={2} dot={false} activeDot={{r:4}}/>
                <Line type="monotone" dataKey="CFI_Frass_N_ha" name="CFI Frass programme"
                  stroke={C.green} strokeWidth={2.5} strokeDasharray="8 4" dot={false} activeDot={{r:4}}/>
              </LineChart>
            </ResponsiveContainer>
            <div style={{background:C.green+"11",border:"1px solid "+C.green+"33",borderRadius:8,
              padding:"10px 14px",fontSize:9,color:C.grey,lineHeight:1.8,marginTop:8}}>
              <strong style={{color:C.white}}>The CFI N reservoir story:</strong>
              {" "}Urea N follows the same spike-and-crash cycle every year — no accumulation, no soil bank.
              {" "}CFI frass protein-N mineralises slowly: only ~45% releases in year of application, with ~16% still releasing in year 2.
              {" "}By year 3–4 of continuous frass application, the soil holds a growing baseline of slow-release N that provides
              {" "}a constant floor even before new applications.
              {" "}On {soil.name} this floor reaches approximately {Math.round(calcFrassDose(soil,"prime").recommended * FRASS.nKgT * 0.18)} kg N/ha by year 3,
              {" "}meaning year 4+ frass dose can be reduced by {Math.round(calcFrassDose(soil,"prime").nUtil * 18)} kg N/ha equivalent
              {" "}without any yield impact.
              {" "}{soil.id === "spodosol" ?
                "SPODOSOL NOTE: Sandy soil slows the reservoir buildup. Frass compost also physically improves CEC from 2→8 meq/100g over 5 years — this is the more transformative structural effect beyond just N." :
                soil.id === "histosol" ?
                "HISTOSOL NOTE: Peat already has very high organic N — the frass advantage is in K and micronutrient supply, and in cutting direct N2O emissions by replacing broadcast urea." : ""}
            </div>
          </Card>

          {/* CHART ROW 4 — P bioavailability: TSP vs CIRP vs CFI Frass */}
          <Card>
            <SecHdr title="P Bioavailability Over 26 Weeks — TSP vs CIRP vs CFI Frass" color={C.amber}
              sub={"% of applied P remaining plant-available · " + soil.name + " · Fixation and slow-release compared"}/>
            <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:12}}>
              <KPI label="TSP Fixed (typical)" value={soil.pFix.pctFixed.typical + "%"} unit="within 14 days" color={C.red}
                note={"Loading factor ×" + BIOAVAIL.P.loadingFactor[soil.id] + " required"}/>
              <KPI label="CIRP Break-Even" value="Wk 7–10" unit="vs TSP on this soil" color={C.orange}
                note="Slow dissolve avoids early fixation rush"/>
              <KPI label="Frass P at Wk 8" value={pCurveData[5] ? pCurveData[5].CFI_Frass_P_pct + "%" : "—"}
                unit={"vs TSP " + (pCurveData[5] ? pCurveData[5].TSP_available_pct + "%" : "-")} color={C.teal}
                note="Frass P bypasses Fe/Al fixation — enzymatic release"/>
              <KPI label="Frass P Long-Run" value={pCurveData[pCurveData.length-1] ? pCurveData[pCurveData.length-1].CFI_Frass_P_pct + "%" : "—"}
                unit="at Wk 26" color={C.green}
                note="Still releasing at 6 months — Wk 26 availability"/>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={pCurveData} margin={{top:10,right:30,left:10,bottom:20}}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.navyLt}/>
                <XAxis dataKey="label"
                  label={{value:"Weeks post-application",position:"insideBottom",offset:-10,fill:C.grey,fontSize:9}}
                  tick={{fill:C.grey,fontSize:9}}/>
                <YAxis unit="%" tick={{fill:C.grey,fontSize:9}} domain={[0,110]}
                  label={{value:"% available",angle:-90,position:"insideLeft",fill:C.grey,fontSize:9,offset:10}}/>
                <Tooltip contentStyle={{background:C.navyMid,border:"1px solid "+C.amber+"44",fontSize:10}}
                  formatter={(v,n)=>[v+"%",n]}/>
                <Legend wrapperStyle={{fontSize:10,color:C.grey,paddingTop:10}}/>
                <ReferenceLine y={50} stroke={C.amber+"66"} strokeDasharray="4 3"
                  label={{value:"50% threshold",fill:C.amber,fontSize:8,position:"right"}}/>
                <Line type="monotone" dataKey="TSP_available_pct" name="TSP (synthetic)"
                  stroke={C.amber} strokeWidth={2.5} dot={{r:3,fill:C.amber}}/>
                <Line type="monotone" dataKey="CIRP_available_pct" name="CIRP Rock Phosphate"
                  stroke={C.orange} strokeWidth={2} strokeDasharray="8 4" dot={{r:3,fill:C.orange}}/>
                <Line type="monotone" dataKey="CFI_Frass_P_pct" name="CFI Frass P"
                  stroke={C.teal} strokeWidth={2.5} strokeDasharray="6 3" dot={{r:3,fill:C.teal}}/>
              </LineChart>
            </ResponsiveContainer>
            <div style={{background:C.amber+"11",border:"1px solid "+C.amber+"33",borderRadius:8,
              padding:"10px 14px",fontSize:9,color:C.grey,lineHeight:1.8,marginTop:8}}>
              <strong style={{color:C.white}}>P source comparison on {soil.name}:</strong>
              {" "}TSP dissolves within 3 days — rapid availability but {soil.pFix.pctFixed.typical}% adsorbs onto
              {soil.id==="oxisol"?" goethite/gibbsite surfaces":soil.id==="ultisol"?" Bt horizon Fe/Al oxides":" soil mineral surfaces"}
              {" "}within 14 days. By week 8 only {pCurveData[5] ? (100-pCurveData[5].TSP_available_pct).toFixed(0) : "—"}% has been lost permanently.
              {" "}CIRP (Ciamis Rock Phosphate) dissolves slowly over 8–12 weeks — it misses the early root uptake window but avoids the worst of the early-flush fixation.
              {" "}On soils where fixation exceeds 50% (Ultisol, Oxisol), CIRP overtakes TSP in plant-available P after week 7–10.
              {" "}CFI frass P (phospholipid + phytate form) is released by phosphatase enzymes in the root zone —
              {" "}it does not enter soil solution until roots need it, so it is never in the right form for Fe/Al adsorption.
              {" "}At week 26 frass P availability is still {pCurveData[pCurveData.length-1] ? pCurveData[pCurveData.length-1].CFI_Frass_P_pct : "—"}%
              {" "}vs TSP long-run {pCurveData[pCurveData.length-1] ? pCurveData[pCurveData.length-1].TSP_available_pct + "%" : "—"}.
            </div>
          </Card>

          {/* CHART ROW 5 — Summary: kg CFI frass per tree vs synthetic per nutrient */}
          <Card>
            <SecHdr title={"Frass vs Synthetic Equivalence — " + (AGE_PHASES.phases.find(p=>p.id===chartPhase)||{label:"Prime"}).label + " Phase · " + soil.name} color={C.purple}
              sub="How many kg of frass per tree delivers equivalent plant-available NPK vs synthetic fertiliser"/>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:10}}>
                <thead>
                  <tr style={{background:C.navyLt}}>
                    {["Nutrient","Crop requirement","Synthetic applied","Synthetic available","Frass dose (kg/tree)","Frass N/P/K delivered","Efficiency gain","Governing?"].map((h,i)=>(
                      <td key={i} style={{padding:"7px 10px",color:C.grey,fontWeight:700,whiteSpace:"nowrap"}}>{h}</td>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    {nut:"N (kg N)",   req:frassDosePhase.nReqHa/143, synthApp:soil.fertReq.n.perTreeKg * (AGE_PHASES.phases.find(p=>p.id===chartPhase)||{nMultiplier:1}).nMultiplier,
                     avail:(soil.fertReq.n.perTreeKg * (AGE_PHASES.phases.find(p=>p.id===chartPhase)||{nMultiplier:1}).nMultiplier)*(1-soil.cfiValue.nLossFrac),
                     frassDoseKg:frassDosePhase.perTreeKg,
                     frassDelivered:frassDosePhase.nKgFromDose/143,
                     util:frassDosePhase.nUtil, gov:frassDosePhase.governing==="N", color:C.blue},
                    {nut:"P2O5 (kg)",  req:frassDosePhase.pReqHa/143, synthApp:soil.fertReq.p.perTreeKg * (AGE_PHASES.phases.find(p=>p.id===chartPhase)||{pMultiplier:1}).pMultiplier,
                     avail:(soil.fertReq.p.perTreeKg * (AGE_PHASES.phases.find(p=>p.id===chartPhase)||{pMultiplier:1}).pMultiplier)*(1-soil.pFix.pctFixed.typical/100),
                     frassDoseKg:frassDosePhase.perTreeKg,
                     frassDelivered:frassDosePhase.pKgFromDose/143,
                     util:FRASS.pAvailFraction, gov:frassDosePhase.governing==="P", color:C.amber},
                    {nut:"K2O (kg)",   req:frassDosePhase.kReqHa/143, synthApp:soil.fertReq.k.perTreeKg * (AGE_PHASES.phases.find(p=>p.id===chartPhase)||{kMultiplier:1}).kMultiplier,
                     avail:(soil.fertReq.k.perTreeKg * (AGE_PHASES.phases.find(p=>p.id===chartPhase)||{kMultiplier:1}).kMultiplier)*(BIOAVAIL.K[soil.id][3]?BIOAVAIL.K[soil.id][3].v/100:0.55),
                     frassDoseKg:frassDosePhase.perTreeKg,
                     frassDelivered:frassDosePhase.kKgFromDose/143,
                     util:frassDosePhase.kUtil, gov:frassDosePhase.governing==="K", color:C.orange},
                  ].map((row,i) => (
                    <tr key={i} style={{borderBottom:"1px solid "+C.navyLt,
                      background:row.gov?(row.color+"11"):"transparent"}}>
                      <td style={{padding:"7px 10px",color:row.color,fontWeight:800}}>{row.nut}</td>
                      <td style={{padding:"7px 10px",color:C.white,fontFamily:"monospace"}}>{row.req.toFixed(2)} kg</td>
                      <td style={{padding:"7px 10px",color:C.grey,fontFamily:"monospace"}}>{row.synthApp.toFixed(2)} kg</td>
                      <td style={{padding:"7px 10px",color:C.red,fontFamily:"monospace"}}>{row.avail.toFixed(2)} kg
                        <span style={{fontSize:8,color:C.grey,marginLeft:4}}>({(row.avail/row.synthApp*100).toFixed(0)}% util)</span>
                      </td>
                      <td style={{padding:"7px 10px",color:C.teal,fontFamily:"monospace",fontWeight:800}}>
                        {row.frassDoseKg} kg
                        <span style={{fontSize:8,color:C.grey,marginLeft:4}}>(= {(row.frassDoseKg/1000).toFixed(3)} t)</span>
                      </td>
                      <td style={{padding:"7px 10px",color:C.green,fontFamily:"monospace",fontWeight:700}}>{row.frassDelivered.toFixed(2)} kg
                        <span style={{fontSize:8,color:C.grey,marginLeft:4}}>({(row.util*100).toFixed(0)}% util)</span>
                      </td>
                      <td style={{padding:"7px 10px",fontFamily:"monospace",fontWeight:800,
                        color:row.frassDelivered>row.avail?C.green:C.amber}}>
                        {row.frassDelivered > row.avail ?
                          "+" + (row.frassDelivered/row.avail*100-100).toFixed(0)+"% more" :
                          (row.frassDelivered/row.avail*100).toFixed(0)+"% of synthetic"}
                      </td>
                      <td style={{padding:"7px 10px"}}>
                        {row.gov && <Badge text="GOVERNING" color={row.color}/>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{background:C.purple+"11",border:"1px solid "+C.purple+"33",borderRadius:8,
              padding:"10px 14px",fontSize:9,color:C.grey,lineHeight:1.8,marginTop:10}}>
              <strong style={{color:C.white}}>Frass dose equivalence logic:</strong>
              {" "}The recommended dose of {frassDosePhase.recommended} t/ha ({frassDosePhase.perTreeKg} kg/tree)
              {" "}is sized to fully replace the {frassDosePhase.governing}-limited nutrient after accounting for that soil's utilisation inefficiency.
              {" "}The {frassDosePhase.governing === "N" ? "other two nutrients (P, K)" : frassDosePhase.governing==="P" ? "N and K" : "N and P"}
              {" "}{frassDosePhase.governing !== "N" ? "may be slightly over-supplied at this dose — agronomically harmless at these levels." :
                "are supplied in excess at this dose — valuable soil building that reduces the next year's requirement."}
              {" "}Frass utilisation efficiency: N={Math.round(frassDosePhase.nUtil*100)}%, P=72%, K={Math.round(frassDosePhase.kUtil*100)}% —
              {" "}all higher than synthetic counterparts because slow release cuts pathway losses.
            </div>
          </Card>

        </div>
      )}

      <div style={{textAlign:"center",padding:"12px",fontSize:9,color:C.grey,
        borderTop:"1px solid "+C.navyLt,marginTop:14}}>
        CFI SOIL CALCULATOR v4 · FULL AGRONOMIST AUDIT · IOPRI/MPOB/BPT BOGOR STANDARDS · IPCC AR5/AR6
        · BIOAVAILABILITY CURVES · AGE PHASES · EMISSIONS · CORRECTIVES · MARCH 2026
      </div>
    </div>
  );
}