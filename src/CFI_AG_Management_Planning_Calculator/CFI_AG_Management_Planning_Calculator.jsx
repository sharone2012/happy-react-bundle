import { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { runCalc } from '../store/slices/calcSlice';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from "recharts";

// ══════════════════════════════════════════════════════════════════════════
// CFI AG MANAGEMENT PLANNING CALCULATOR BY SOIL TYPE
// ──────────────────────────────────────────────────
// ALL nutrient values sourced exclusively from CFI_Stage_Lab_Display.jsx
// kgPerT values in lab display = DM basis
// Wet-basis conversion: kgPerT_wet = kgPerT_DM × (1 − moisture/100)
// Application rate input = tonnes WET PRODUCT per ha per year
// ══════════════════════════════════════════════════════════════════════════

const C = {
  navy:"#060e1e", navyMid:"#0a1628", navyLt:"#0f2040",
  teal:"#14b8a6", tealLt:"#5eead4",
  amber:"#f59e0b", amberLt:"#fcd34d",
  green:"#22c55e", greenLt:"#86efac",
  blue:"#3b82f6", blueLt:"#93c5fd",
  red:"#ef4444",  redLt:"#fca5a5",
  purple:"#a855f7",
  orange:"#f97316",
  grey:"#64748b",  greyLt:"#94a3b8",
  white:"#e2e8f0",
};

// ══ PRODUCTS ── sourced from CFI_Stage_Lab_Display.jsx ═══════════════════
// moisture = % wb from lab display
// N/P/K/Ca/Mg = kgPerT_DM × (1 − moisture/100) → kg per tonne WET product
// S3W1: DM values: N 20.0, P 1.5, K 8.5, Ca 1.3, Mg 1.0 | moisture 55%  → × 0.45
// S5A:  DM values: N 30.0, P 4.2, K 10.5, Ca 11.5, Mg 1.8 | moisture 25% → × 0.75
// S5B:  DM values: N 42.0, P 5.5, K 11.5, Ca 30.0, Mg 2.5 | moisture 30% → × 0.70

const PRODUCTS = [
  {
    id:"s3w1", stage:"S3", wave:"Wave 1",
    name:"BIO-COMPOST+", tag:"S3 · W1",
    color:"#1a5530", colorBright:C.green,
    status:"live",
    moisture:55,              // % wb — lab display S3
    valueWet:32.14,           // $/t wet — lab display S3
    valueDM:71.43,            // $/t DM  — lab display S3
    // Per tonne WET product (DM × 0.45)
    N:9.00, P:0.675, K:3.825, Ca:0.585, Mg:0.45, OM:391.5,
    defaultRateHa:25,         // t/ha/yr wet — high-moisture bulk product
    features:["Wave 1 biology active","Cellulase 20–35 U/g ★","C:N 18–25","N-fixers 10⁸ CFU/g","Xylanase 12–22 U/g"],
    note:"Best for bulk soil improvement. High OM + active Wave 1 biology. Wave 2 slot available — add when lab data is ready.",
    caution:null,
  },
  {
    id:"s3w2", stage:"S3", wave:"Wave 2",
    name:"BIO-COMPOST+ W2", tag:"S3 · W2",
    color:"#0f3020", colorBright:"#4ade80",
    status:"pending",
    moisture:null, valueWet:null, valueDM:null,
    N:null, P:null, K:null, Ca:null, Mg:null, OM:null,
    defaultRateHa:null,
    features:["Wave 2: N-fixing bacteria (temp-gated <50°C)","PSB inoculation","Mesophilic consortium","Enhanced N-fixation vs W1"],
    note:"Lab analysis pending. Build S3 Wave 2 stage in Lab Analysis Calculator to activate this slot.",
    caution:"Lab data not yet available — slot reserved for when S3 Wave 2 lab is built.",
  },
  {
    id:"s3w3", stage:"S3", wave:"Wave 3+",
    name:"BIO-COMPOST+ W3+", tag:"S3 · W3+",
    color:"#0a2015", colorBright:"#34d399",
    status:"pending",
    moisture:null, valueWet:null, valueDM:null,
    N:null, P:null, K:null, Ca:null, Mg:null, OM:null,
    defaultRateHa:null,
    features:["Additional wave inoculation","User-defined consortium","Progressive nutrient uplift"],
    note:"Reserved for additional wave passes. Add wave data to Lab Analysis Calculator to activate.",
    caution:"Lab data not yet available — slot reserved for future waves.",
  },
  {
    id:"s5a", stage:"S5A", wave:null,
    name:"BIO-FERTILISER+", tag:"S5A",
    color:"#1a6040", colorBright:C.teal,
    status:"live",
    moisture:25,              // % wb — lab display S5A
    valueWet:59.96,           // $/t wet
    valueDM:79.95,            // $/t DM
    // Per tonne WET product (DM × 0.75)
    N:22.50, P:3.15, K:7.875, Ca:8.625, Mg:1.35, OM:577.5,
    defaultRateHa:10,         // t/ha/yr wet — concentrated product
    features:["Microbial diversity 10¹⁰ CFU/g ★","P solubilised 2–3× input","N leach −34–40%","C:N 12–18","Cellulase 8–18 U/g"],
    note:"Best long-term soil builder. Optimal for Ultisols (P fixation bypass) and Spodosols (CEC rebuilding).",
    caution:null,
  },
  {
    id:"s5b", stage:"S5B", wave:null,
    name:"BIO-FERTILISER+ PROTEIN", tag:"S5B",
    color:"#6b2a00", colorBright:C.amber,
    status:"live",
    moisture:30,              // % wb — lab display S5B
    valueWet:63.76,           // $/t wet
    valueDM:91.08,            // $/t DM
    // Per tonne WET product (DM × 0.70)
    N:29.40, P:3.85, K:8.05, Ca:21.00, Mg:1.75, OM:490.0,
    defaultRateHa:8,          // t/ha/yr wet
    features:["Highest N ★ 3.5–5.0% DM","Ca bone-meal equiv 2.0–4.0% DM","Chitin 3–6% — nematode suppression","Cellulase 10–20 U/g"],
    note:"Highest N product. Ideal for K-deficient soils and as Ca source on peat.",
    caution:"⚠ Spodosols: reduce rate 30% — C:N 8–14 risks NO₃⁻ flush on sandy profile. Split application mandatory.",
  },
];

// ══ AGE BANDS ═════════════════════════════════════════════════════════════
const AGE_BANDS = [
  { id:"nursery",  label:"Nursery",      years:"0–1 yr",   factor:0.10, color:C.grey,
    note:"Pre-field. Foliar-dominant. Ground application minimal." },
  { id:"immature", label:"Immature",     years:"1–3 yr",   factor:0.35, color:C.blue,
    note:"Rapid vegetative growth. N priority. Root system still shallow." },
  { id:"young",    label:"Young Mature", years:"4–6 yr",   factor:0.72, color:C.teal,
    note:"First bearing. P fixation beginning to impact yield. Full programme starting." },
  { id:"peak",     label:"Peak",         years:"7–15 yr",  factor:1.00, color:C.amber,
    note:"Maximum fertiliser requirement. All soil data is benchmarked to this age band." },
  { id:"mature",   label:"Mature",       years:"16–25 yr", factor:0.85, color:C.orange,
    note:"Declining FFB. Rates modestly reduced. Soil health increasingly important." },
  { id:"old",      label:"Old Stand",    years:"25+ yr",   factor:0.70, color:C.purple,
    note:"Replanting decision zone. Nutrient cycling and soil rehabilitation priority." },
];

// ══ SOILS ── sourced from CFI_Soil_Calculator_v3.jsx ═════════════════════
// All perTreeKg values = PEAK stand (yr 7–15), 143 palms/ha
// unitCost = $/kg nutrient element applied (from soil calculator)
const SOILS = [
  {
    id:"inceptisol", name:"Inceptisols", local:"Kambisol / Gleisol",
    color:C.teal, pct:"39%", totalCostHa:580, cfiSubPct:35,
    fertReq:{ n:{kg:1.8,uc:0.35}, p:{kg:0.45,uc:0.45}, k:{kg:2.8,uc:0.38},
              mg:{kg:0.5,uc:0.28}, b:{kg:0.05,uc:1.20}, cu:{kg:0,uc:1.80},
              lime:{kgHa:1500,cycle:3.5,uc:0.08} },
    leachNote:"N leaching moderate 35%. Slow-release urea recommended.",
    fixNote:"P fixation low–moderate 28%. CFI organic P 60–80% available vs 40% TSP.",
    cfiPitch:"Mycorrhizal + PSB inoculants in S3. Moderate substitution but strong certification story.",
  },
  {
    id:"ultisol", name:"Ultisols", local:"Podsolik Merah Kuning",
    color:C.amber, pct:"24%", totalCostHa:720, cfiSubPct:47,
    fertReq:{ n:{kg:2.2,uc:0.35}, p:{kg:0.65,uc:0.45}, k:{kg:3.2,uc:0.38},
              mg:{kg:0.7,uc:0.28}, b:{kg:0.06,uc:1.20}, cu:{kg:0,uc:1.80},
              lime:{kgHa:2000,cycle:3,uc:0.08} },
    leachNote:"N leaching severe 50%. Coated or NBPT-treated urea recommended.",
    fixNote:"P fixation severe 52–65%. Industry applies 140–160% of crop P. CFI organic P is 2–3× TSP on this soil.",
    cfiPitch:"PRIMARY MARKET. P fixation bypass is the strongest CFI value proposition. Lead with P cost data to CFO.",
  },
  {
    id:"oxisol", name:"Oxisols", local:"Latosol / Ferralsol",
    color:C.orange, pct:"8%", totalCostHa:920, cfiSubPct:57,
    fertReq:{ n:{kg:2.5,uc:0.42}, p:{kg:1.0,uc:0.52}, k:{kg:3.8,uc:0.38},
              mg:{kg:0.8,uc:0.28}, b:{kg:0.07,uc:1.20}, cu:{kg:0.02,uc:1.80},
              lime:{kgHa:2500,cycle:2.5,uc:0.08} },
    leachNote:"N leaching extreme 60%. Coated slow-release urea mandatory. 4×/yr split applications.",
    fixNote:"P fixation catastrophic 72–80%. Industry applies 200–250% of crop P. CFI organic P bypasses goethite adsorption entirely.",
    cfiPitch:"Highest CFI substitution of any soil (57%). Every tonne CFI replaces up to 2–3 tonnes TSP equivalent. Strongest CFO pitch.",
  },
  {
    id:"histosol", name:"Histosols (Peat)", local:"Tanah Gambut",
    color:C.purple, pct:"7%", totalCostHa:840, cfiSubPct:40,
    fertReq:{ n:{kg:0.9,uc:0.35}, p:{kg:0.35,uc:0.45}, k:{kg:4.2,uc:0.38},
              mg:{kg:0.6,uc:0.28}, b:{kg:0.07,uc:1.20}, cu:{kg:0.03,uc:1.80},
              lime:{kgHa:1200,cycle:2.5,uc:0.08} },
    leachNote:"N immobilisation in peat — different mechanism from mineral soils. Standard urea. Moderate N requirement.",
    fixNote:"P fixation low 18%. NOT the CFI story on peat — redirect to K supply and Cu deficiency.",
    cfiPitch:"PRIMARY VALUE: K supply (highest K demand of any soil) + Cu deficiency correction (mandatory on peat). S5B Ca also reduces dolomite spend.",
  },
  {
    id:"spodosol", name:"Spodosols", local:"Podsolik / Podzol",
    color:C.grey, pct:"<5%", totalCostHa:1050, cfiSubPct:50,
    fertReq:{ n:{kg:3.0,uc:0.42}, p:{kg:0.6,uc:0.45}, k:{kg:4.5,uc:0.38},
              mg:{kg:0.9,uc:0.28}, b:{kg:0.08,uc:1.20}, cu:{kg:0,uc:1.80},
              lime:{kgHa:1000,cycle:2,uc:0.08} },
    leachNote:"N leaching extreme 70%. Sandy profile — slow-release/NBPT mandatory. 5–6×/yr micro-applications.",
    fixNote:"P fixation moderate 35%. Banded P application only — broadcast loses >50% to leaching.",
    cfiPitch:"CEC rebuilding from OM is the only long-term answer. 5-year transformation story. N leaching reduction 34–40% addresses primary constraint.",
  },
];

const PALMS = 143; // palms/ha — Indonesian standard

// ══ CALCULATION ENGINE ════════════════════════════════════════════════════
function calc(soil, band, product, rateHa, cfiPriceWet, estateHa) {
  const f = band.factor;
  const fr = soil.fertReq;
  // Scaled crop requirements per tree at this age band
  const req = {
    N:  fr.n.kg  * f,
    P:  fr.p.kg  * f,
    K:  fr.k.kg  * f,
    Mg: fr.mg.kg * f,
    B:  fr.b.kg  * f,
    Cu: fr.cu.kg * f,
  };
  // Annualised lime kg/tree
  const limeKgTree = (fr.lime.kgHa / PALMS) / fr.lime.cycle * f;

  // Full synthetic cost $/ha (scaled from peak by age factor)
  const synthCostHa = soil.totalCostHa * f;
  const synthCostTree = synthCostHa / PALMS;

  if (!product || product.status !== "live") {
    return { req, limeKgTree, synthCostHa, synthCostTree, pending:true };
  }

  // CFI nutrients delivered per ha per year
  const cfiHa = {
    N:  product.N  * rateHa,
    P:  product.P  * rateHa,
    K:  product.K  * rateHa,
    Ca: product.Ca * rateHa,
    Mg: product.Mg * rateHa,
    OM: product.OM * rateHa,
  };
  // Per tree
  const cfiTree = { N: cfiHa.N/PALMS, P: cfiHa.P/PALMS, K: cfiHa.K/PALMS,
                    Ca: cfiHa.Ca/PALMS, Mg: cfiHa.Mg/PALMS, OM: cfiHa.OM/PALMS };

  // Coverage % per nutrient (cap at 100%)
  const cov = {
    N:  Math.min(100, req.N  > 0 ? cfiTree.N  / req.N  * 100 : 0),
    P:  Math.min(100, req.P  > 0 ? cfiTree.P  / req.P  * 100 : 0),
    K:  Math.min(100, req.K  > 0 ? cfiTree.K  / req.K  * 100 : 0),
    Mg: Math.min(100, req.Mg > 0 ? cfiTree.Mg / req.Mg * 100 : 0),
  };

  // Remaining synthetic gap per tree (kg element)
  const gap = {
    N:  Math.max(0, req.N  - cfiTree.N),
    P:  Math.max(0, req.P  - cfiTree.P),
    K:  Math.max(0, req.K  - cfiTree.K),
    Mg: Math.max(0, req.Mg - cfiTree.Mg),
    B:  req.B,   // CFI covers B partially via bio-activity, retain full requirement
    Cu: req.Cu,  // Cu: S5B delivers ~0 wet-basis on this scale, retain full
  };

  // Gap costs $/tree
  const gapCost = {
    N:  gap.N  * fr.n.uc,
    P:  gap.P  * fr.p.uc,
    K:  gap.K  * fr.k.uc,
    Mg: gap.Mg * fr.mg.uc,
    B:  gap.B  * fr.b.uc,
    Cu: gap.Cu * fr.cu.uc,
    lime: limeKgTree * fr.lime.uc * 0.60, // CFI Ca reduces lime spend by ~40%
  };
  const totalGapCostTree = Object.values(gapCost).reduce((a,b)=>a+b,0);
  const totalGapCostHa   = totalGapCostTree * PALMS;

  // CFI cost per ha
  const cfiCostHa   = rateHa * cfiPriceWet;
  const cfiCostTree = cfiCostHa / PALMS;

  // Total CFI programme cost (CFI product + remaining synth)
  const cfiProgCostHa   = cfiCostHa + totalGapCostHa;
  const cfiProgCostTree = cfiProgCostHa / PALMS;

  // Saving vs full synthetic
  const savingHa   = synthCostHa - cfiProgCostHa;
  const savingTree = savingHa / PALMS;
  const savingEstate = savingHa * estateHa;
  const savingPct  = synthCostHa > 0 ? savingHa / synthCostHa * 100 : 0;

  // DM delivered per ha
  const dmHa = rateHa * (1 - product.moisture / 100);

  return {
    req, limeKgTree, synthCostHa, synthCostTree,
    cfiHa, cfiTree, cov, gap, gapCost,
    totalGapCostHa, totalGapCostTree,
    cfiCostHa, cfiCostTree,
    cfiProgCostHa, cfiProgCostTree,
    savingHa, savingTree, savingEstate, savingPct,
    dmHa, pending:false,
  };
}

// ══ SMALL COMPONENTS ══════════════════════════════════════════════════════
const s = {
  card: (extra={}) => ({
    background:C.navyMid, borderRadius:10,
    border:`1px solid ${C.navyLt}`, padding:14, ...extra }),
  hdr: (color=C.teal) => ({
    fontSize:9, fontWeight:800, color, letterSpacing:"0.12em",
    textTransform:"uppercase", marginBottom:8,
    paddingBottom:6, borderBottom:`1px solid ${color}33` }),
  kpi: (color=C.teal) => ({
    background:C.navyLt, borderRadius:8, padding:"8px 10px",
    border:`1px solid ${color}33`, textAlign:"center" }),
  label: { fontSize:8, color:C.greyLt, letterSpacing:"0.07em",
           textTransform:"uppercase", marginBottom:2 },
};

function KPI({label,value,unit,color=C.teal,size="md",note}) {
  const fs = size==="lg"?20:size==="sm"?13:16;
  return (
    <div style={s.kpi(color)}>
      <div style={s.label}>{label}</div>
      <div style={{fontSize:fs,fontWeight:900,color,fontFamily:"'Courier New',monospace"}}>{value}</div>
      {unit&&<div style={{fontSize:8,color:C.greyLt,marginTop:1}}>{unit}</div>}
      {note&&<div style={{fontSize:8,color:C.greyLt,marginTop:2,fontStyle:"italic",lineHeight:1.3}}>{note}</div>}
    </div>
  );
}

function Badge({text,color=C.grey,xs}) {
  return (
    <span style={{background:color+"22",border:`1px solid ${color}55`,color,
      fontSize:xs?8:9,fontWeight:700,borderRadius:4,padding:xs?"1px 5px":"2px 7px",
      letterSpacing:"0.04em",whiteSpace:"nowrap",display:"inline-block"}}>
      {text}
    </span>
  );
}

function CovBar({pct,color}) {
  const p = Math.min(100,pct||0);
  const col = p>=80?C.green:p>=50?C.amber:p>=25?C.orange:C.red;
  return (
    <div style={{display:"flex",alignItems:"center",gap:6}}>
      <div style={{flex:1,background:C.navyLt,borderRadius:3,height:8,overflow:"hidden"}}>
        <div style={{width:`${p}%`,height:"100%",background:col,borderRadius:3,
          transition:"width 0.5s ease"}}/>
      </div>
      <span style={{fontSize:9,color:col,fontWeight:800,minWidth:32,textAlign:"right",
        fontFamily:"'Courier New',monospace"}}>{p.toFixed(0)}%</span>
    </div>
  );
}

// ══ MAIN ══════════════════════════════════════════════════════════════════
export default function CFI_AG_Management_Planning_Calculator() {
  const [soilId,    setSoilId]    = useState("ultisol");
  const [bandId,    setBandId]    = useState("peak");
  const [productId, setProductId] = useState("s5a");
  const [rateHa,    setRateHa]    = useState(10);
  const [cfiPrice,  setCfiPrice]  = useState(120);
  const [estateHa,  setEstateHa]  = useState(1000);

  const soil    = SOILS.find(x=>x.id===soilId)||SOILS[1];
  const band    = AGE_BANDS.find(x=>x.id===bandId)||AGE_BANDS[3];
  const product = PRODUCTS.find(x=>x.id===productId)||PRODUCTS[3];

  // Auto-set default rate when product changes
  const handleProductSelect = (pid) => {
    setProductId(pid);
    const p = PRODUCTS.find(x=>x.id===pid);
    if (p?.defaultRateHa) setRateHa(p.defaultRateHa);
  };

  const dispatch = useDispatch();
  const r       = useSelector(function(s) { return s.calc.results['ag-management'] || { pending:true, req:{N:0,P:0,K:0,Mg:0,B:0,Cu:0}, limeKgTree:0, synthCostHa:0, synthCostTree:0, cov:{N:0,P:0,K:0,Mg:0}, gap:{N:0,P:0,K:0,Mg:0,B:0,Cu:0}, gapCost:{N:0,P:0,K:0,Mg:0,B:0,Cu:0,lime:0}, totalGapCostHa:0, totalGapCostTree:0, cfiCostHa:0, cfiCostTree:0, cfiProgCostHa:0, cfiProgCostTree:0, savingHa:0, savingTree:0, savingEstate:0, savingPct:0, dmHa:0 }; });
  const loading = useSelector(function(s) { return s.calc.loading['ag-management'] || false; });
  useEffect(()=>{
    dispatch(runCalc({ name:'ag-management', body:{ soilId, bandId, productId, rateHa, cfiPriceWet: cfiPrice, estateHa } }));
  }, [soilId, bandId, productId, rateHa, cfiPrice, estateHa, dispatch]);

  const fmt2 = v => v==null?"—":`$${v.toFixed(2)}`;
  const fmt0 = v => v==null?"—":`$${Math.round(v).toLocaleString()}`;
  const fmtN = (v,dp=1) => v==null?"—":v.toFixed(dp);

  // Nutrient comparison chart data
  const nutrData = r.pending ? [] : [
    { name:"N",  req:+r.req.N.toFixed(2),  cfi:+Math.min(r.req.N, r.cfiTree.N).toFixed(2),
      gap:+r.gap.N.toFixed(2) },
    { name:"P",  req:+r.req.P.toFixed(2),  cfi:+Math.min(r.req.P, r.cfiTree.P).toFixed(2),
      gap:+r.gap.P.toFixed(2) },
    { name:"K",  req:+r.req.K.toFixed(2),  cfi:+Math.min(r.req.K, r.cfiTree.K).toFixed(2),
      gap:+r.gap.K.toFixed(2) },
    { name:"Mg", req:+r.req.Mg.toFixed(2), cfi:+Math.min(r.req.Mg, r.cfiTree.Mg).toFixed(2),
      gap:+r.gap.Mg.toFixed(2) },
  ];

  return (
    <div style={{background:C.navy,minHeight:"100vh",color:C.white,
      fontFamily:"'DM Sans', sans-serif",fontSize:12,padding:"0 0 40px"}}>

      {/* ═══ PERSISTENT CFI GLOBAL HEADER ═══ */}
      <div style={{
        height: 83, background: "#0A1628",
        borderBottom: "1px solid rgba(51, 212, 188, 0.075)",
        display: "flex", alignItems: "center", padding: "0 32px",
        position: "sticky", top: 0, zIndex: 301,
      }}>
        <div style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
          <span style={{ fontFamily: "'EB Garamond', serif", fontSize: 26, fontWeight: 700, color: "#FFFFFF", letterSpacing: "0.06em" }}>CFI</span>
          <span style={{ fontFamily: "'EB Garamond', serif", fontSize: 26, fontWeight: 700, color: "#33D4BC", letterSpacing: "0.06em", marginLeft: 10 }}>Deep Tech</span>
        </div>
        <div style={{ width: 3, height: 44, background: "#33D4BC", margin: "0 20px 0 14px" }} />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 4, height: 44 }}>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700, lineHeight: 1.3, whiteSpace: "nowrap", display: "flex" }}>
            <span style={{ color: "#FFFFFF", minWidth: 150, display: "inline-block" }}>Precision Engineering</span>
            <span style={{ color: "#33D4BC" }}>Circular Nutrient Recovery in Agricultural Systems</span>
          </div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700, lineHeight: 1.3, whiteSpace: "nowrap", display: "flex" }}>
            <span style={{ color: "#FFFFFF", minWidth: 150, display: "inline-block" }}>Applied Biology</span>
            <span style={{ color: "#33D4BC" }}>Rebalancing Soil&apos;s Microbiome &amp; Reducing Synthetic Fertiliser Use</span>
          </div>
        </div>
      </div>

      {/* ── HEADER ── */}
      <div style={{background:`linear-gradient(135deg,${C.navyMid},#040a14)`,
        borderBottom:`2px solid ${soil.color}66`,padding:"14px 20px"}}>
        <div style={{fontSize:8,color:C.teal,letterSpacing:"0.25em",marginBottom:3}}>
          CIRCULAR FERTILISER INDUSTRIES · BOGOR, WEST JAVA · 60 TPH FFB MILL
        </div>
        <div style={{fontSize:18,fontWeight:900,letterSpacing:"-0.01em"}}>
          AG MANAGEMENT PLANNING CALCULATOR
        </div>
        <div style={{fontSize:9,color:C.greyLt,marginTop:2}}>
          By Soil Type · All nutrient data sourced from CFI Lab Analysis Calculator
        </div>
      </div>

      <div style={{padding:"16px 16px 0",display:"flex",flexDirection:"column",gap:14}}>
        {loading&&<div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",marginBottom:8}}><div style={{width:18,height:18,borderRadius:"50%",border:`3px solid ${C.teal}44`,borderTopColor:C.teal,animation:"cfi-spin 0.7s linear infinite"}}/><span style={{color:C.greyLt,fontSize:12}}>Calculating…</span></div>}
        {/* ══ SECTION 1: PRODUCT SELECTION ══════════════════════════════ */}
        <div style={s.card()}>
          <div style={s.hdr(C.teal)}>① Select CFI Product</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:8}}>
            {PRODUCTS.map(p=>{
              const sel = p.id===productId;
              const pending = p.status==="pending";
              return (
                <div key={p.id}
                  onClick={()=>!pending&&handleProductSelect(p.id)}
                  style={{background:sel?p.color+"44":C.navyLt,
                    border:`2px solid ${sel?p.colorBright:pending?"#222":p.color+"66"}`,
                    borderRadius:8,padding:10,cursor:pending?"not-allowed":"pointer",
                    opacity:pending?0.5:1,transition:"all 0.2s",position:"relative"}}>
                  {/* badges */}
                  <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:6}}>
                    <Badge text={p.tag} color={p.colorBright}/>
                    {p.wave&&<Badge text={p.wave} color={pending?C.grey:p.colorBright} xs/>}
                    {pending&&<Badge text="LAB PENDING" color={C.red} xs/>}
                    {sel&&!pending&&<Badge text="SELECTED ✓" color={C.green} xs/>}
                  </div>
                  <div style={{fontSize:10,fontWeight:800,color:pending?C.grey:C.white,
                    lineHeight:1.3,marginBottom:6}}>{p.name}</div>
                  {pending ? (
                    <div style={{fontSize:8,color:C.grey,fontStyle:"italic",lineHeight:1.4}}>
                      {p.caution}
                    </div>
                  ) : (
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:3}}>
                      {[
                        ["Moisture", `${p.moisture}% wb`],
                        ["N/t wet",  `${p.N} kg`],
                        ["P/t wet",  `${p.P.toFixed(2)} kg`],
                        ["K/t wet",  `${p.K.toFixed(2)} kg`],
                        ["$/t wet",  `$${p.valueWet}`],
                        ["$/t DM",   `$${p.valueDM}`],
                      ].map(([k,v])=>(
                        <div key={k} style={{background:C.navy+"88",borderRadius:4,
                          padding:"3px 6px"}}>
                          <div style={{fontSize:7,color:C.greyLt}}>{k}</div>
                          <div style={{fontSize:9,color:p.colorBright,fontWeight:700}}>{v}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {/* Selected product features */}
          {product.status==="live"&&(
            <div style={{marginTop:10,padding:"8px 10px",background:product.color+"33",
              borderRadius:6,border:`1px solid ${product.colorBright}44`}}>
              <div style={{fontSize:8,color:product.colorBright,fontWeight:700,
                marginBottom:4}}>LAB REFERENCE: {product.labRef||"CFI_Stage_Lab_Display"}</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:4}}>
                {product.features.map(f=><Badge key={f} text={f} color={product.colorBright} xs/>)}
              </div>
              <div style={{fontSize:8,color:C.greyLt}}>{product.note}</div>
              {product.caution&&<div style={{fontSize:8,color:C.amber,marginTop:4,fontWeight:700}}>
                {product.caution}</div>}
            </div>
          )}
        </div>

        {/* ══ SECTION 2: SOIL + AGE BAND ════════════════════════════════ */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>

          {/* Soil */}
          <div style={s.card()}>
            <div style={s.hdr(C.amber)}>② Soil Type</div>
            <div style={{display:"flex",flexDirection:"column",gap:5}}>
              {SOILS.map(so=>{
                const sel=so.id===soilId;
                return (
                  <div key={so.id} onClick={()=>setSoilId(so.id)}
                    style={{background:sel?so.color+"33":C.navyLt,
                      border:`2px solid ${sel?so.color:"#1e2d45"}`,
                      borderRadius:6,padding:"8px 10px",cursor:"pointer",transition:"all 0.15s"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <div>
                        <span style={{fontSize:10,fontWeight:800,
                          color:sel?so.color:C.white}}>{so.name}</span>
                        <span style={{fontSize:8,color:C.grey,marginLeft:6}}>{so.local}</span>
                      </div>
                      <div style={{display:"flex",gap:4,alignItems:"center"}}>
                        <Badge text={so.pct+" of ID"} color={so.color} xs/>
                        {sel&&<Badge text="✓" color={C.green} xs/>}
                      </div>
                    </div>
                    {sel&&(
                      <div style={{marginTop:6,display:"grid",
                        gridTemplateColumns:"repeat(3,1fr)",gap:3}}>
                        {[
                          ["Fert $/ha",`$${so.totalCostHa}`],
                          ["CFI sub",`${so.cfiSubPct}%`],
                          ["Palms/ha","143"],
                        ].map(([k,v])=>(
                          <div key={k} style={{background:C.navy+"88",borderRadius:4,
                            padding:"2px 6px",textAlign:"center"}}>
                            <div style={{fontSize:7,color:C.greyLt}}>{k}</div>
                            <div style={{fontSize:9,color:so.color,fontWeight:700}}>{v}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Age Band + Inputs */}
          <div style={{display:"flex",flexDirection:"column",gap:10}}>

            <div style={s.card()}>
              <div style={s.hdr(C.blue)}>③ Tree Age Band</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5}}>
                {AGE_BANDS.map(b=>{
                  const sel=b.id===bandId;
                  return (
                    <div key={b.id} onClick={()=>setBandId(b.id)}
                      style={{background:sel?b.color+"33":C.navyLt,
                        border:`2px solid ${sel?b.color:"#1e2d45"}`,
                        borderRadius:6,padding:"7px 8px",cursor:"pointer",
                        transition:"all 0.15s"}}>
                      <div style={{fontSize:10,fontWeight:800,
                        color:sel?b.color:C.white}}>{b.label}</div>
                      <div style={{fontSize:8,color:C.grey}}>{b.years}</div>
                      {sel&&<div style={{fontSize:8,color:b.color,marginTop:3,lineHeight:1.3}}>
                        Factor: {b.factor}× peak</div>}
                    </div>
                  );
                })}
              </div>
              {bandId&&<div style={{marginTop:8,fontSize:8,color:C.greyLt,
                padding:"5px 8px",background:C.navyLt,borderRadius:5}}>
                {band.note}
              </div>}
            </div>

            {/* ── Application inputs ── */}
            <div style={s.card()}>
              <div style={s.hdr(C.purple)}>④ Application & Pricing</div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {[
                  { label:"Application rate", value:rateHa, set:setRateHa,
                    unit:"t/ha/yr wet", min:1, max:60, step:0.5,
                    note:product.status==="live"?
                      `DM delivered: ${(rateHa*(1-product.moisture/100)).toFixed(1)} t/ha/yr`:"—",
                    color:C.teal },
                  { label:"CFI product price", value:cfiPrice, set:setCfiPrice,
                    unit:"$/t wet", min:50, max:300, step:5,
                    note:`=$${(cfiPrice*rateHa).toFixed(0)}/ha/yr product cost`, color:C.amber },
                  { label:"Estate area", value:estateHa, set:setEstateHa,
                    unit:"ha", min:100, max:20000, step:100,
                    note:`${(estateHa*143).toLocaleString()} palms total`, color:C.blue },
                ].map(inp=>(
                  <div key={inp.label}>
                    <div style={{display:"flex",justifyContent:"space-between",
                      alignItems:"center",marginBottom:3}}>
                      <div style={{fontSize:9,fontWeight:700,color:inp.color}}>
                        {inp.label}
                      </div>
                      <div style={{fontSize:10,fontWeight:900,color:inp.color,
                        fontFamily:"'Courier New',monospace"}}>
                        {inp.value} <span style={{fontSize:8,color:C.grey}}>{inp.unit}</span>
                      </div>
                    </div>
                    <input type="range" min={inp.min} max={inp.max} step={inp.step}
                      value={inp.value}
                      onChange={e=>inp.set(+e.target.value)}
                      style={{width:"100%",accentColor:inp.color,height:4}}/>
                    {inp.note&&<div style={{fontSize:8,color:C.grey,marginTop:2}}>
                      {inp.note}</div>}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* ══ SECTION 3: NUTRIENT COVERAGE ══════════════════════════════ */}
        <div style={s.card()}>
          <div style={s.hdr(C.green)}>⑤ Nutrient Coverage — {soil.name} · {band.label}
            {product.status==="live"&&` · ${product.name} @ ${rateHa} t/ha wet`}</div>

          {r.pending ? (
            <div style={{padding:"20px",textAlign:"center",color:C.grey,fontSize:10}}>
              Select a live product to see nutrient coverage analysis
            </div>
          ) : (
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>

              {/* Coverage bars */}
              <div>
                <div style={{fontSize:8,color:C.greyLt,marginBottom:8}}>
                  Per tree per year · Scaled to {band.label} (factor {band.factor}×)
                </div>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:9}}>
                  <thead>
                    <tr>
                      {["Nutrient","Req kg/tree","CFI kg/tree","Remaining","Coverage"].map(h=>(
                        <th key={h} style={{padding:"4px 6px",color:C.grey,
                          fontWeight:600,textAlign:"left",fontSize:8,
                          borderBottom:`1px solid ${C.navyLt}`}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {k:"N",  label:"Nitrogen",   cov:r.cov.N,  req:r.req.N,
                        cfi:r.cfiTree.N,  gap:r.gap.N,  color:C.teal},
                      {k:"P",  label:"Phosphorus", cov:r.cov.P,  req:r.req.P,
                        cfi:r.cfiTree.P,  gap:r.gap.P,  color:C.blue},
                      {k:"K",  label:"Potassium",  cov:r.cov.K,  req:r.req.K,
                        cfi:r.cfiTree.K,  gap:r.gap.K,  color:C.amber},
                      {k:"Mg", label:"Magnesium",  cov:r.cov.Mg, req:r.req.Mg,
                        cfi:r.cfiTree.Mg, gap:r.gap.Mg, color:C.purple},
                      {k:"B",  label:"Boron",      cov:5, req:r.req.B,
                        cfi:0.001, gap:r.req.B, color:C.orange},
                    ].map(row=>(
                      <tr key={row.k}>
                        <td style={{padding:"5px 6px",color:row.color,fontWeight:700}}>
                          {row.label}</td>
                        <td style={{padding:"5px 6px",fontFamily:"monospace",
                          color:C.white}}>{row.req.toFixed(3)}</td>
                        <td style={{padding:"5px 6px",fontFamily:"monospace",
                          color:row.cov>=80?C.green:row.cov>=50?C.amber:C.red}}>
                          {Math.min(row.req,row.cfi).toFixed(3)}</td>
                        <td style={{padding:"5px 6px",fontFamily:"monospace",
                          color:row.gap>0?C.redLt:C.greenLt}}>
                          {row.gap.toFixed(3)}</td>
                        <td style={{padding:"5px 6px",minWidth:100}}>
                          <CovBar pct={row.cov} color={row.color}/></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Bar chart */}
              <div>
                <div style={{fontSize:8,color:C.greyLt,marginBottom:8}}>
                  kg/tree requirement vs CFI delivery (N, P, K, Mg)
                </div>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={nutrData} margin={{top:0,right:0,left:-20,bottom:0}}>
                    <CartesianGrid strokeDasharray="3 3" stroke={C.navyLt}/>
                    <XAxis dataKey="name" tick={{fill:C.greyLt,fontSize:9}}/>
                    <YAxis tick={{fill:C.greyLt,fontSize:8}}/>
                    <Tooltip
                      contentStyle={{background:C.navyMid,border:`1px solid ${C.navyLt}`,
                        fontSize:9,color:C.white}}
                      formatter={(v,n)=>[v.toFixed(3)+" kg/tree",
                        n==="cfi"?"CFI covers":n==="gap"?"Remaining gap":"Required"]}
                    />
                    <Legend wrapperStyle={{fontSize:8,color:C.greyLt}}/>
                    <Bar dataKey="cfi"  name="CFI covers" stackId="a" fill={C.green} radius={0}/>
                    <Bar dataKey="gap"  name="Remaining gap" stackId="a" fill={C.red+"88"} radius={[3,3,0,0]}/>
                  </BarChart>
                </ResponsiveContainer>
              </div>

            </div>
          )}
        </div>

        {/* ══ SECTION 4: PROGRAMME COMPARISON ══════════════════════════ */}
        {!r.pending&&(
          <div style={s.card()}>
            <div style={s.hdr(C.amber)}>⑥ Programme Cost Comparison — {band.label} stand · per ha/yr</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:12}}>
              <KPI label="Full Synthetic" value={`$${r.synthCostHa.toFixed(0)}`}
                unit="$/ha/yr" color={C.red} size="lg"/>
              <KPI label="CFI Product Cost" value={`$${r.cfiCostHa.toFixed(0)}`}
                unit="$/ha/yr" color={C.amber}/>
              <KPI label="Remaining Synth Gap" value={`$${r.totalGapCostHa.toFixed(0)}`}
                unit="$/ha/yr" color={C.orange}/>
              <KPI label="CFI Programme Total" value={`$${r.cfiProgCostHa.toFixed(0)}`}
                unit="$/ha/yr" color={C.blue}/>
            </div>

            {/* Saving highlight */}
            <div style={{background:r.savingHa>0?C.green+"22":C.red+"22",
              border:`1px solid ${r.savingHa>0?C.green:C.red}44`,
              borderRadius:8,padding:"10px 14px",
              display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
              <KPI label="Net Saving per Tree"
                value={r.savingTree>=0?`$${r.savingTree.toFixed(2)}`:`-$${Math.abs(r.savingTree).toFixed(2)}`}
                unit="per palm per year"
                color={r.savingTree>=0?C.green:C.red} size="lg"/>
              <KPI label={`Net Saving at ${estateHa.toLocaleString()} ha`}
                value={r.savingHa>=0?`$${Math.round(r.savingHa*estateHa/1000).toLocaleString()}k`
                  :`-$${Math.abs(Math.round(r.savingHa*estateHa/1000)).toLocaleString()}k`}
                unit="per year total estate"
                color={r.savingHa>=0?C.green:C.red} size="lg"/>
              <KPI label="Cost Reduction"
                value={r.savingPct>=0?`${r.savingPct.toFixed(1)}%`:`${r.savingPct.toFixed(1)}%`}
                unit="vs full synthetic programme"
                color={r.savingPct>=0?C.green:C.red} size="lg"
                note={r.savingPct<0?"Increase application rate or reduce CFI price to achieve saving":null}/>
            </div>

            {/* Per-tree breakdown */}
            <div style={{marginTop:10,overflowX:"auto"}}>
              <div style={{fontSize:8,color:C.greyLt,marginBottom:6}}>
                Cost breakdown per tree per year
              </div>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:9}}>
                <thead>
                  <tr style={{borderBottom:`1px solid ${C.navyLt}`}}>
                    {["Line","Full Synth $/tree","CFI covers $/tree",
                      "Remaining $/tree","Note"].map(h=>(
                      <th key={h} style={{padding:"4px 8px",color:C.grey,
                        fontWeight:600,textAlign:"left",fontSize:8}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    {line:"Nitrogen",  full:+(r.req.N*soil.fertReq.n.uc).toFixed(2),
                      cov:+(Math.min(r.req.N,r.cfiTree.N)*soil.fertReq.n.uc).toFixed(2),
                      rem:+r.gapCost.N.toFixed(2), note:`${r.cov.N.toFixed(0)}% covered`},
                    {line:"Phosphorus",full:+(r.req.P*soil.fertReq.p.uc).toFixed(2),
                      cov:+(Math.min(r.req.P,r.cfiTree.P)*soil.fertReq.p.uc).toFixed(2),
                      rem:+r.gapCost.P.toFixed(2), note:`${r.cov.P.toFixed(0)}% covered`},
                    {line:"Potassium", full:+(r.req.K*soil.fertReq.k.uc).toFixed(2),
                      cov:+(Math.min(r.req.K,r.cfiTree.K)*soil.fertReq.k.uc).toFixed(2),
                      rem:+r.gapCost.K.toFixed(2), note:`${r.cov.K.toFixed(0)}% covered`},
                    {line:"Magnesium", full:+(r.req.Mg*soil.fertReq.mg.uc).toFixed(2),
                      cov:+(Math.min(r.req.Mg,r.cfiTree.Mg)*soil.fertReq.mg.uc).toFixed(2),
                      rem:+r.gapCost.Mg.toFixed(2), note:`${r.cov.Mg.toFixed(0)}% covered`},
                    {line:"Boron + micro",
                      full:+(r.req.B*soil.fertReq.b.uc + r.req.Cu*soil.fertReq.cu.uc).toFixed(2),
                      cov:0, rem:+(r.gapCost.B+r.gapCost.Cu).toFixed(2),
                      note:"B/Cu not meaningfully covered at this rate"},
                    {line:"Lime (annualised)",
                      full:+r.limeKgTree.toFixed(3),
                      cov:+(r.limeKgTree*0.40).toFixed(3),
                      rem:+r.gapCost.lime.toFixed(3),
                      note:"CFI Ca reduces lime spend ~40%"},
                    {line:"CFI product",  full:0,
                      cov:0, rem:+r.cfiCostTree.toFixed(2), note:"CFI purchase cost"},
                  ].map((row,i)=>(
                    <tr key={row.line}
                      style={{background:i%2===0?C.navyLt+"44":"transparent",
                        borderBottom:`1px solid ${C.navyLt}44`}}>
                      <td style={{padding:"5px 8px",color:C.white,fontWeight:600}}>
                        {row.line}</td>
                      <td style={{padding:"5px 8px",fontFamily:"monospace",
                        color:C.redLt}}>${row.full}</td>
                      <td style={{padding:"5px 8px",fontFamily:"monospace",
                        color:C.green}}>${row.cov}</td>
                      <td style={{padding:"5px 8px",fontFamily:"monospace",
                        color:C.amber}}>${row.rem}</td>
                      <td style={{padding:"5px 8px",fontSize:8,color:C.grey}}>
                        {row.note}</td>
                    </tr>
                  ))}
                  {/* Totals row */}
                  <tr style={{borderTop:`2px solid ${C.navyLt}`,fontWeight:900}}>
                    <td style={{padding:"6px 8px",color:C.white}}>TOTAL</td>
                    <td style={{padding:"6px 8px",fontFamily:"monospace",
                      color:C.red}}>${r.synthCostTree.toFixed(2)}</td>
                    <td style={{padding:"6px 8px",color:C.grey}}>—</td>
                    <td style={{padding:"6px 8px",fontFamily:"monospace",
                      color:C.blue}}>${r.cfiProgCostTree.toFixed(2)}</td>
                    <td style={{padding:"6px 8px",fontSize:9,
                      color:r.savingTree>=0?C.green:C.red,fontWeight:900}}>
                      {r.savingTree>=0?"▼ SAVING":"▲ COST INCREASE"} $
                      {Math.abs(r.savingTree).toFixed(2)}/tree</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ══ SECTION 5: CFI PITCH + REMAINING GAP NOTES ════════════════ */}
        {!r.pending&&(
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>

            <div style={s.card({border:`1px solid ${soil.color}44`})}>
              <div style={s.hdr(soil.color)}>Commercial Pitch — {soil.name}</div>
              <div style={{fontSize:9,color:C.greyLt,lineHeight:1.6}}>
                {soil.cfiPitch}
              </div>
              <div style={{marginTop:8,padding:"6px 8px",background:soil.color+"22",
                borderRadius:5,fontSize:8,color:C.greyLt,lineHeight:1.5}}>
                <div style={{color:soil.color,fontWeight:700,marginBottom:2}}>
                  N LEACHING</div>{soil.leachNote}
              </div>
              <div style={{marginTop:6,padding:"6px 8px",background:soil.color+"22",
                borderRadius:5,fontSize:8,color:C.greyLt,lineHeight:1.5}}>
                <div style={{color:soil.color,fontWeight:700,marginBottom:2}}>
                  P FIXATION</div>{soil.fixNote}
              </div>
            </div>

            <div style={s.card({border:`1px solid ${product.colorBright}44`})}>
              <div style={s.hdr(product.colorBright)}>
                Remaining Synthetic Programme — what CFI doesn't cover
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:5}}>
                {[
                  {k:"N remaining", v:`${r.gap.N.toFixed(2)} kg/tree = supply as ${soil.fertReq.n.uc>0.40?"coated/NBPT urea":"split urea"}`},
                  {k:"P remaining", v:`${r.gap.P.toFixed(2)} kg/tree = supply as TSP${r.cov.P>70?" — small top-up only":" — significant gap, consider CIRP blend"}`},
                  {k:"K remaining", v:`${r.gap.K.toFixed(2)} kg/tree = MOP split ${soil.fertReq.k.uc>0.38?"3–5×/yr":"2–3×/yr"}`},
                  {k:"Mg remaining",v:`${r.gap.Mg.toFixed(2)} kg/tree = Kieserite — ${r.cov.Mg>80?"small top-up":"mandatory supplement"}`},
                  {k:"B",           v:`${r.req.B.toFixed(3)} kg/tree = CFI bio-activity provides trace — granular supplement retained`},
                  {k:"Lime cycle",  v:`${soil.fertReq.lime.kgHa} kg/ha every ${soil.fertReq.lime.cycle} yr — CFI Ca reduces frequency`},
                ].map(row=>(
                  <div key={row.k} style={{display:"flex",gap:8,padding:"4px 6px",
                    background:C.navyLt,borderRadius:4}}>
                    <span style={{fontSize:8,fontWeight:700,color:C.amber,
                      minWidth:80,flexShrink:0}}>{row.k}</span>
                    <span style={{fontSize:8,color:C.greyLt,lineHeight:1.4}}>{row.v}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ══ FOOTER ── data provenance ══════════════════════════════════ */}
        <div style={{padding:"8px 12px",background:C.navyLt,borderRadius:8,
          fontSize:8,color:C.grey,lineHeight:1.6}}>
          <span style={{color:C.teal,fontWeight:700}}>DATA SOURCES — </span>
          Nutrient values (N/P/K/Ca/Mg per tonne wet) sourced exclusively from
          CFI_Stage_Lab_Display.jsx kgPerT (DM basis) × (1−moisture%) wet-basis conversion.
          Soil nutrient requirements sourced from CFI_Soil_Calculator_v3.jsx fertReq
          (IOPRI/MPOB standards, 143 palms/ha, peak stand yr 7–15). Age band scaling applied
          as factor × peak requirement. S3 Wave 2/3+ slots reserved — activate by adding
          lab data to Lab Analysis Calculator. CFI price is user-set $/t wet product.
        </div>

      </div>
    </div>
  );
}
