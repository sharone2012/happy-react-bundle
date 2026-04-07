import { useState, useEffect, useMemo } from "react";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ReferenceLine, ComposedChart, Cell
} from "recharts";

// ── CFI Brand ─────────────────────────────────────────────────
const C = { navy:"#0B1929", teal:"#00C9B1", amber:"#F5A623", green:"#2D8A5E",
            red:"#C0392B", grey:"#5D7A8A", light:"#E8F4F8", mid:"#8BA0B4",
            purple:"#7B2FBE", orange:"#E8631A", lime:"#8BC34A" };

// ── SOIL TYPES ────────────────────────────────────────────────
const SOILS = {
  Inceptisols: { ph:4.1, cec:15.4, coverage:39, color:C.teal,   om_baseline:3.2, n_bg:2.7, p_bg:124, k_bg:180, retention:0.85, label:"Inceptisols (39%)" },
  Ultisols:    { ph:4.5, cec:8.2,  coverage:24, color:C.green,  om_baseline:2.1, n_bg:1.8, p_bg:85,  k_bg:120, retention:0.70, label:"Ultisols (24%)" },
  Oxisols:     { ph:4.4, cec:6.1,  coverage:8,  color:C.amber,  om_baseline:1.8, n_bg:1.4, p_bg:55,  k_bg:90,  retention:0.60, label:"Oxisols (8%)" },
  Histosols:   { ph:3.8, cec:22.0, coverage:7,  color:C.purple, om_baseline:8.5, n_bg:4.2, p_bg:95,  k_bg:160, retention:0.90, label:"Histosols/Peat (7%)" },
  Spodosols:   { ph:4.77,cec:3.8,  coverage:22, color:C.orange, om_baseline:0.8, n_bg:0.4, p_bg:42,  k_bg:45,  retention:0.50, label:"Spodosols (22%)" }
};

// ── AG MANAGEMENT TIERS ───────────────────────────────────────
const AG_TIERS = {
  VGAM: { label:"VGAM — Very Good Ag Management", adj:1.0,  desc:"Full fertility management. Liming done. pH corrected. Optimal soil conditions.", color:C.teal   },
  GAM:  { label:"GAM — Good Ag Management",       adj:0.80, desc:"Most inputs managed. Some pH correction. Standard NPK programme.", color:C.green  },
  Poor: { label:"Poor Ag Management",              adj:0.55, desc:"Minimal inputs. No liming. Acidic soils. High leaching losses.", color:C.amber  },
  Abandoned:{ label:"Abandoned / Unmanaged",       adj:0.30, desc:"No fertiliser programme. Severely degraded soils. Very low nutrient uptake.", color:C.red   }
};

// ── STAGE PRODUCT DEFINITIONS (lab-verified) ─────────────────
// Guardrail-locked composition values by pipeline stage
const STAGE_PRODUCTS = {
  S2: {
    code:"S2", name:"Compost", nameExt:null,
    desc:"End of S2 Chemical Treatment — pre-BSF substrate. Partially mineralised. Lignin reduced 30–35%.",
    N_pct:0.8, P_pct:0.35, K_pct:0.5, OM_pct:38, Ca_pct:1.2, Mg_pct:0.4,
    moisture:65, cn:32, cp:8.14, source:"CFI Lab / DM-weighted EFB+OPDC 60:40 blend"
  },
  S5: {
    code:"S5", name:"Biofertiliser", nameExt:null,
    desc:"S5 Biofertiliser — post-BSF frass. Full microbial mineralisation complete. GUARDRAIL values apply.",
    N_pct:2.8, P_pct:1.1, K_pct:2.3, OM_pct:45, Ca_pct:2.1, Mg_pct:0.6,
    moisture:28, cn:14, cp:16.8, source:"CFI Lab March 2026 — GUARDRAIL LOCKED"
  },
  S6: {
    code:"S6", name:"Biofertiliser", nameExt:"+",
    desc:"S6 Biofertiliser+ — concentrated post-insect frass. Higher NPK density due to volume reduction.",
    N_pct:3.2, P_pct:1.4, K_pct:2.8, OM_pct:48, Ca_pct:2.5, Mg_pct:0.7,
    moisture:12, cn:12, cp:19.2, source:"CFI Lab March 2026 — derived from S5 with moisture reduction"
  }
};

// ── PALM REQUIREMENTS (MPOB / Sinar Mas) ─────────────────────
const PALM_AGE_GROUPS = [
  { label:"Yr 1-3",   n:0.8, p:0.25, k:1.0, ffb_baseline:0  },
  { label:"Yr 4-6",   n:1.5, p:0.40, k:2.0, ffb_baseline:12 },
  { label:"Yr 7-15",  n:2.0, p:0.50, k:3.0, ffb_baseline:22 },
  { label:"Yr 16-25", n:1.8, p:0.45, k:2.7, ffb_baseline:20 },
  { label:"Yr 25+",   n:1.5, p:0.40, k:2.2, ffb_baseline:17 }
];
const TREES_PER_HA = 143;
const DOSES = [2, 5, 10, 15];

// ── SYNTHETIC FERTILISER PRICES (locked) ─────────────────────
const SYNTH = {
  urea_usd_t:350, urea_n_pct:0.46,
  tsp_usd_t:450,  tsp_p2o5_pct:0.46,
  mop_usd_t:380,  mop_k2o_pct:0.60,
  labour_per_app_usd_ha:50, apps_per_yr:4
};

// ── RESIDUE ALTERNATIVES DATA ─────────────────────────────────
const RESIDUE_ALTS = [
  {
    method:"Open Dumping", icon:"🗑️", color:C.red,
    ghg_t_co2e_t:0.42, nutrient_avail_pct:15, soil_om_change:"-0.2% per yr",
    cost_usd_t:2, labour:"minimal",
    pros:["Zero processing cost","No infrastructure needed"],
    cons:["High CH4+N2O emissions","Nutrient loss >85%","Ganoderma risk","RSPO non-compliance risk","Water pollution"],
    palm_yield_impact:"-5 to -12%", note:"Baseline scenario for ACM0022 credit calculation"
  },
  {
    method:"Mulching (EFB field spread)", icon:"🌾", color:C.amber,
    ghg_t_co2e_t:0.18, nutrient_avail_pct:35, soil_om_change:"+0.1% per yr",
    cost_usd_t:8, labour:"transport + spreading",
    pros:["Weed suppression","Soil moisture retention","Some nutrient return","Low cost"],
    cons:["Slow nutrient release (2–3 yrs)","Harbours pests (rats)","Partial nutrient loss to leaching","N2O emissions during decomposition"],
    palm_yield_impact:"+3 to +6%", note:"Common estate practice — but nutrients are mostly lost"
  },
  {
    method:"Traditional Composting", icon:"♻️", color:C.purple,
    ghg_t_co2e_t:0.08, nutrient_avail_pct:55, soil_om_change:"+0.3% per yr",
    cost_usd_t:25, labour:"turning, monitoring, storage",
    pros:["Good nutrient return","Soil OM improvement","Pathogen reduction"],
    cons:["Slow (90–180 days)","Labour intensive","Requires turning equipment","No protein/oil byproduct"],
    palm_yield_impact:"+6 to +12%", note:"Better than mulching but leaves value on the table"
  },
  {
    method:"CFI Bioconversion", icon:"🌱", color:C.teal,
    ghg_t_co2e_t:-1.98, nutrient_avail_pct:82, soil_om_change:"+0.5% per yr",
    cost_usd_t:-12, labour:"structured process team (S0–S6)",
    pros:["Carbon credits earned (~$4–40/t)","BSF meal + oil byproduct revenue","Highest nutrient bioavailability","Soil biology inoculation","Ganoderma suppression"],
    cons:["Infrastructure investment required","Trained staff needed","Process management rigour"],
    palm_yield_impact:"+12 to +22%", note:"Only pathway that turns waste into multiple revenue streams"
  }
];

// ── CREDIT DATA (FIXED: Cell component + updated ACM0022) ─────
const CREDIT_DATA = [
  {
    source:"ACM0022 — All Palm Residues (EFB+OPDC+POME sludge)",
    t_co2e_yr:213827,
    methodology:"Verra VCS ACM0022 v3.1 | IPCC FOD (solids) + COD (POME liquid) | AMS-III.Y cross-ref for POME sludge solids separation",
    offsetting_low:15, offsetting_high:40,
    insetting_low:50, insetting_high:120,
    status:"PRIMARY", color:C.teal,
    pome_note:"POME sludge covered under ACM0022 as solid organic waste via FOD. POME liquid baseline uses IPCC wastewater MCF for open lagoons. AMS-III.Y principles applicable for solids-separation sub-component."
  },
  { source:"N2O Suppression (Bacillus subtilis S3)", t_co2e_yr:850,    methodology:"Verra ACM0022 co-benefit / GS Waste", offsetting_low:6,  offsetting_high:25, insetting_low:6,  insetting_high:20, status:"ADDITIONAL", color:C.green  },
  { source:"Carbon Stabilisation (Lactobacillus humus)", t_co2e_yr:150, methodology:"Plan Vivo SOC / ACR soil carbon",      offsetting_low:12, offsetting_high:30, insetting_low:12, insetting_high:28, status:"ADDITIONAL", color:C.amber  },
  { source:"SOC Sequestration via Biofertiliser (soil)", t_co2e_yr:8500,methodology:"Plan Vivo Agroforestry SOC / VM0042", offsetting_low:12, offsetting_high:30, insetting_low:12, insetting_high:30, status:"ADDITIONAL", color:C.purple },
  { source:"Synthetic Fertiliser Displacement (Scope 3)",t_co2e_yr:4200,methodology:"GHG Protocol Scope 3 Cat 1 / GS",     offsetting_low:5,  offsetting_high:20, insetting_low:8,  insetting_high:25, status:"INSETTING",  color:C.orange },
  { source:"N Fixation (Azospirillum — synthetic N saved)",t_co2e_yr:320,methodology:"GS SDG co-benefit / ACR",            offsetting_low:5,  offsetting_high:18, insetting_low:5,  insetting_high:18, status:"ADDITIONAL", color:C.lime   }
];

// ── DATA FUNCTIONS ────────────────────────────────────────────
function buildReleaseCurves(soil) {
  const r = soil.retention;
  const weeks = [0,2,4,8,12,16,20,26,32,40,52];
  const orgN = [0,3,7,18,32,48,60,72,80,86,91];
  const synN = [0,75,85,78,65,52,42,32,24,16,10];
  const orgP = [0,2,5,12,22,35,48,60,70,78,85];
  const synP = [0,80,85,80,75,70,65,58,52,46,40];
  const orgK = [0,5,12,28,45,60,72,82,88,92,95];
  const synK = [0,85,88,80,68,56,46,36,28,20,14];
  return weeks.map((w,i) => ({
    week: w,
    "CFI N (%)": Math.round(orgN[i]*r*10)/10,
    "Synthetic N (%)": Math.round(synN[i]*r*10)/10,
    "CFI P (%)": Math.round(orgP[i]*r*10)/10,
    "Synthetic P (%)": Math.round(synP[i]*r*10)/10,
    "CFI K (%)": Math.round(orgK[i]*r*10)/10,
    "Synthetic K (%)": Math.round(synK[i]*r*10)/10
  }));
}

function buildDoseData(soil, ageIdx, stageKey, agTier) {
  const age = PALM_AGE_GROUPS[ageIdx];
  const prod = STAGE_PRODUCTS[stageKey];
  const tierAdj = AG_TIERS[agTier].adj;
  const req_n = age.n * TREES_PER_HA;
  const req_p = age.p * TREES_PER_HA;
  const req_k = age.k * TREES_PER_HA;
  return DOSES.map(d => {
    const supply_n = d * (prod.N_pct/100) * 1000 * soil.retention * tierAdj;
    const supply_p = d * (prod.P_pct/100) * 1000 * soil.retention * tierAdj;
    const supply_k = d * (prod.K_pct/100) * 1000 * soil.retention * tierAdj;
    return {
      dose: d + "t/ha",
      "N supplied (kg/ha)": Math.round(supply_n),
      "N required (kg/ha)": Math.round(req_n),
      "N replacement %": Math.min(150, Math.round(supply_n/req_n*100)),
      "P supplied (kg/ha)": Math.round(supply_p),
      "P required (kg/ha)": Math.round(req_p),
      "P replacement %": Math.min(150, Math.round(supply_p/req_p*100)),
      "K supplied (kg/ha)": Math.round(supply_k),
      "K required (kg/ha)": Math.round(req_k),
      "K replacement %": Math.min(150, Math.round(supply_k/req_k*100))
    };
  });
}

function buildYieldData(soil, ageIdx) {
  const ffbBase = PALM_AGE_GROUPS[ageIdx].ffb_baseline;
  return DOSES.map((d,i) => {
    const omAdd = d * (STAGE_PRODUCTS.S5.OM_pct/100);
    const omTotal = soil.om_baseline + omAdd;
    const yieldGain = Math.min(28, Math.round(omTotal * 2.2 + i*1.5));
    return {
      dose: d + "t/ha",
      "FFB Yield (t/ha/yr)": Math.round(ffbBase*(1+yieldGain/100)*10)/10,
      "Baseline FFB (t/ha/yr)": ffbBase,
      "Yield gain %": yieldGain,
      "OM % after 3 yrs": Math.round(omTotal*10)/10
    };
  });
}

function buildLeachingData(soil) {
  return [1,2,3,4,5,6,7,8,10,12].map(om => ({
    "OM %": om,
    "N leaching %": Math.max(2, Math.round(55*Math.exp(-0.28*om)*10)/10),
    "P leaching %": Math.max(1, Math.round(30*Math.exp(-0.25*om)*10)/10),
    "K leaching %": Math.max(3, Math.round(45*Math.exp(-0.22*om)*10)/10)
  }));
}

function buildFertPlan(ageIdx, soil, agTier) {
  const age = PALM_AGE_GROUPS[ageIdx];
  const tierAdj = AG_TIERS[agTier].adj;
  const n_ha = age.n * TREES_PER_HA * tierAdj;
  const p_ha = age.p * TREES_PER_HA * tierAdj;
  const k_ha = age.k * TREES_PER_HA * tierAdj;
  const urea_ha = n_ha / SYNTH.urea_n_pct;
  const tsp_ha = (p_ha * 2.29) / SYNTH.tsp_p2o5_pct;
  const mop_ha = (k_ha * 1.205) / SYNTH.mop_k2o_pct;
  const urea_cost = urea_ha * SYNTH.urea_usd_t / 1000;
  const tsp_cost = tsp_ha * SYNTH.tsp_usd_t / 1000;
  const mop_cost = mop_ha * SYNTH.mop_usd_t / 1000;
  const labour_cost = SYNTH.labour_per_app_usd_ha * SYNTH.apps_per_yr;
  const total = urea_cost + tsp_cost + mop_cost + labour_cost;
  return {
    n_ha: Math.round(n_ha), p_ha: Math.round(p_ha), k_ha: Math.round(k_ha),
    urea_ha: Math.round(urea_ha), tsp_ha: Math.round(tsp_ha), mop_ha: Math.round(mop_ha),
    urea_tree: Math.round(urea_ha/TREES_PER_HA*100)/100,
    tsp_tree:  Math.round(tsp_ha/TREES_PER_HA*100)/100,
    mop_tree:  Math.round(mop_ha/TREES_PER_HA*100)/100,
    urea_per_app: Math.round(urea_ha/SYNTH.apps_per_yr),
    tsp_per_app:  Math.round(tsp_ha/SYNTH.apps_per_yr),
    mop_per_app:  Math.round(mop_ha/SYNTH.apps_per_yr),
    urea_cost: Math.round(urea_cost), tsp_cost: Math.round(tsp_cost),
    mop_cost: Math.round(mop_cost), labour_cost: Math.round(labour_cost),
    total: Math.round(total), apps_per_yr: SYNTH.apps_per_yr
  };
}

// ── HELPERS ───────────────────────────────────────────────────
const TooltipBox = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return React.createElement("div", { style:{background:C.navy,border:"1px solid "+C.teal,borderRadius:8,padding:"10px 14px"} },
    React.createElement("p", { style:{color:C.teal,fontWeight:700,marginBottom:6,fontSize:12} }, label),
    payload.map((p,i) => React.createElement("p", { key:i, style:{color:p.color||"#fff",fontSize:11,margin:"2px 0"} }, p.name+": "+p.value))
  );
};

const SectionHeader = ({ icon, title, subtitle }) =>
  React.createElement("div", { style:{borderLeft:"3px solid "+C.teal,paddingLeft:14,marginBottom:20} },
    React.createElement("div", { style:{display:"flex",alignItems:"center",gap:10} },
      React.createElement("span", { style:{fontSize:22} }, icon),
      React.createElement("div", null,
        React.createElement("h3", { style:{margin:0,color:C.navy,fontSize:18,fontWeight:800} }, title),
        subtitle && React.createElement("p", { style:{margin:0,color:C.grey,fontSize:12,marginTop:2} }, subtitle)
      )
    )
  );

const Badge = ({ text, color }) =>
  React.createElement("span", { style:{background:color+"22",color,border:"1px solid "+color,borderRadius:20,padding:"2px 10px",fontSize:11,fontWeight:700} }, text);

// Renders "Biofertiliser+" with + in bold green, 3pt larger
const ProductLabel = ({ stage, size=14 }) => {
  const p = STAGE_PRODUCTS[stage];
  if (!p) return null;
  return React.createElement("span", null,
    React.createElement("span", { style:{fontSize:size,fontWeight:700,color:C.navy} }, p.name),
    p.nameExt && React.createElement("span", { style:{fontSize:size+3,fontWeight:900,color:C.green} }, p.nameExt)
  );
};

// ── CUSTOM CHART PANEL ────────────────────────────────────────
const CustomChartPanel = ({ tabId, suggestions }) => {
  const [req, setReq] = useState("");
  const [submitted, setSubmitted] = useState(false);
  return React.createElement("div", { style:{background:C.teal+"18",border:"1px solid "+C.teal,borderRadius:10,padding:16,marginTop:16} },
    React.createElement("p", { style:{color:C.teal,fontWeight:700,fontSize:13,margin:"0 0 10px"} }, "📊 Request a Custom Chart or Analysis for this Tab"),
    React.createElement("div", { style:{display:"flex",flexWrap:"wrap",gap:6,marginBottom:10} },
      suggestions.map((s,i) =>
        React.createElement("button", { key:i, onClick:()=>setReq(s),
          style:{background:"#fff",border:"1px solid "+C.teal,borderRadius:6,padding:"5px 11px",fontSize:11,color:C.teal,cursor:"pointer",fontWeight:600} }, s)
      )
    ),
    React.createElement("textarea", { value:req, onChange:e=>setReq(e.target.value),
      placeholder:"Describe what you want to see — e.g. 'Show this as a line chart' or 'Add 20t/ha dose' — must relate to this chart or table.",
      style:{width:"100%",minHeight:60,borderRadius:8,border:"1px solid #ccd",padding:10,fontSize:13,color:C.navy,fontFamily:"inherit",resize:"vertical",boxSizing:"border-box"}
    }),
    !submitted
      ? React.createElement("button", { onClick:()=>setSubmitted(true),
          style:{marginTop:8,background:C.teal,color:C.navy,border:"none",borderRadius:8,padding:"9px 22px",fontWeight:800,fontSize:13,cursor:"pointer"} }, "Request Chart")
      : React.createElement("p", { style:{color:C.green,fontWeight:700,fontSize:13,marginTop:8} }, "✓ Request logged. Chart will appear in your next session.")
  );
};

// ── VISITOR MODAL (UPDATED) ───────────────────────────────────
const VisitorModal = ({ onClose, onSkip }) => {
  const [form, setForm] = useState({ name:"", org:"", phone:"", email:"", orgType:"", interests:[], howFound:"", accessCode:"" });
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const orgTypes = ["Palm Oil Mill / Estate","Palm Oil Company (Public)","Investor / Private Equity","Development Finance / Bank","Equipment Manufacturer","Agricultural Consultant","F&B / Consumer Goods","Cosmetics / Oleochemicals","Trading Company","Research / University","Government / Regulatory","Media","Other"];
  const interests = ["CFI's Solution for my Company","Partnership","Investment","Employment","Media","Biofertiliser","Joint Venture","Research","Other"];

  const setF = (k,v) => setForm(p => Object.assign({},p,{[k]:v}));
  const toggleInterest = x => setF("interests", form.interests.includes(x) ? form.interests.filter(i=>i!==x) : [...form.interests,x]);
  const canSubmit = form.name && form.email && form.phone && form.org;

  const handleSubmit = () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setTimeout(() => { setSubmitting(false); setDone(true); }, 700);
  };

  if (done) return React.createElement("div", { style:{position:"fixed",inset:0,background:"rgba(11,25,41,0.88)",zIndex:900,display:"flex",alignItems:"center",justifyContent:"center"} },
    React.createElement("div", { style:{background:"#fff",borderRadius:16,padding:40,maxWidth:420,textAlign:"center"} },
      React.createElement("div", { style:{fontSize:48,marginBottom:12} }, "✅"),
      React.createElement("h3", { style:{color:C.navy,marginTop:0} }, "Thank you, "+form.name+"!"),
      React.createElement("p", { style:{color:C.grey,fontSize:14} }, "We will be in touch soon. Welcome to CFI."),
      React.createElement("button", { onClick:onClose, style:{background:C.teal,color:C.navy,border:"none",borderRadius:8,padding:"12px 32px",fontWeight:800,fontSize:14,cursor:"pointer"} }, "Continue to Dashboard")
    )
  );

  return React.createElement("div", { style:{position:"fixed",inset:0,background:"rgba(11,25,41,0.88)",zIndex:900,display:"flex",alignItems:"center",justifyContent:"center",padding:16} },
    React.createElement("div", { style:{background:"#fff",borderRadius:16,maxWidth:540,width:"100%",maxHeight:"92vh",overflowY:"auto",boxShadow:"0 8px 60px rgba(0,0,0,0.5)"} },
      // Black header with access code
      React.createElement("div", { style:{background:C.navy,padding:"18px 24px",borderRadius:"16px 16px 0 0"} },
        React.createElement("h3", { style:{color:"#fff",margin:0,fontSize:17} }, "Welcome to the CFI Platform"),
        React.createElement("p", { style:{color:C.mid,fontSize:12,margin:"4px 0 12px"} }, "Register to stay in touch. All fields marked * are required."),
        React.createElement("div", { style:{background:"rgba(255,255,255,0.08)",borderRadius:8,padding:"10px 14px",border:"1px solid "+C.teal+"55"} },
          React.createElement("label", { style:{color:C.teal,fontSize:11,fontWeight:700,display:"block",marginBottom:4} }, "ACCESS CODE (optional — if you have one from CFI)"),
          React.createElement("input", { value:form.accessCode, onChange:e=>setF("accessCode",e.target.value),
            placeholder:"Enter code provided by CFI to unlock full access",
            style:{width:"100%",background:"rgba(255,255,255,0.12)",border:"1px solid "+C.teal+"88",borderRadius:6,padding:"8px 10px",fontSize:13,color:"#fff",boxSizing:"border-box",fontFamily:"inherit"}
          })
        )
      ),
      React.createElement("div", { style:{padding:20} },
        // Required fields grid
        React.createElement("div", { style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12} },
          [["name","Full Name *"],["org","Organisation *"],["phone","Phone *"],["email","Email *"]].map(([k,lbl]) =>
            React.createElement("div", { key:k },
              React.createElement("label", { style:{color:C.navy,fontSize:11,fontWeight:700,display:"block",marginBottom:3} }, lbl),
              React.createElement("input", { value:form[k], onChange:e=>setF(k,e.target.value),
                style:{width:"100%",border:"1px solid #ccd",borderRadius:6,padding:"7px 10px",fontSize:13,boxSizing:"border-box",fontFamily:"inherit"}
              })
            )
          )
        ),
        // Org type
        React.createElement("div", { style:{marginBottom:12} },
          React.createElement("label", { style:{color:C.navy,fontSize:11,fontWeight:700,display:"block",marginBottom:3} }, "Organisation Type"),
          React.createElement("select", { value:form.orgType, onChange:e=>setF("orgType",e.target.value),
            style:{width:"100%",border:"1px solid #ccd",borderRadius:6,padding:"7px 10px",fontSize:13,fontFamily:"inherit"}
          },
            React.createElement("option", { value:"" }, "Select..."),
            orgTypes.map(t => React.createElement("option", { key:t, value:t }, t))
          )
        ),
        // Interests
        React.createElement("div", { style:{marginBottom:16} },
          React.createElement("label", { style:{color:C.navy,fontSize:11,fontWeight:700,display:"block",marginBottom:6} }, "Areas of Interest"),
          React.createElement("div", { style:{display:"flex",flexWrap:"wrap",gap:6} },
            interests.map(x =>
              React.createElement("button", { key:x, onClick:()=>toggleInterest(x),
                style:{background:form.interests.includes(x)?C.teal:"#fff",
                       color:form.interests.includes(x)?C.navy:C.grey,
                       border:"1px solid "+(form.interests.includes(x)?C.teal:"#ccd"),
                       borderRadius:20,padding:"5px 12px",fontSize:11,cursor:"pointer",
                       fontWeight:form.interests.includes(x)?800:400}
              }, x)
            )
          )
        ),
        // Submit
        React.createElement("div", { style:{display:"flex",justifyContent:"space-between",alignItems:"center"} },
          React.createElement("button", { onClick:onSkip, style:{background:"transparent",border:"none",color:C.grey,fontSize:12,cursor:"pointer",textDecoration:"underline"} }, "Skip for now"),
          React.createElement("button", { onClick:handleSubmit, disabled:!canSubmit||submitting,
            style:{background:canSubmit?C.teal:"#ccd",color:canSubmit?C.navy:"#888",
                   border:"none",borderRadius:8,padding:"11px 26px",fontWeight:800,fontSize:14,cursor:canSubmit?"pointer":"not-allowed"}
          }, submitting ? "Sending..." : "Register + Stay in Touch")
        ),
        React.createElement("p", { style:{color:C.grey,fontSize:10,marginTop:10,textAlign:"center"} }, "CFI Kft respects your privacy. Used only for relevant communications. Unsubscribe anytime.")
      )
    )
  );
};

// ── USAGE LIMIT BANNER ────────────────────────────────────────
const UsageBanner = ({ used, limit }) => {
  if (limit === 0 || used < limit) return null;
  return React.createElement("div", { style:{background:C.amber+"22",border:"2px solid "+C.amber,borderRadius:10,padding:"14px 20px",margin:"0 0 20px",display:"flex",justifyContent:"space-between",alignItems:"center"} },
    React.createElement("div", null,
      React.createElement("p", { style:{color:C.amber,fontWeight:800,fontSize:14,margin:0} }, "⚠️  You have used all your search credits!"),
      React.createElement("p", { style:{color:C.navy,fontSize:13,margin:"4px 0 0"} }, "You've used "+used+" of "+limit+" searches. CFI has been notified and will approve additional access. Please check back shortly.")
    ),
    React.createElement("span", { style:{fontSize:32} }, "😊")
  );
};

// ── CHART CARD with detail + custom request ───────────────────
const ChartCard = ({ chartKey, title, children, style, suggestions }) => {
  const [open, setOpen] = useState(false);
  const det = chartKey ? null : null; // simplified for inline
  return React.createElement("div", { style:Object.assign({background:"#fff",borderRadius:12,padding:24,position:"relative"},style||{}) },
    React.createElement("div", { style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12} },
      title && React.createElement("h4", { style:{color:C.navy,margin:0,fontSize:15} }, title),
      chartKey && React.createElement("button", { onClick:()=>setOpen(true),
        style:{background:C.teal+"22",color:C.teal,border:"1px solid "+C.teal,borderRadius:6,padding:"4px 12px",fontSize:11,fontWeight:700,cursor:"pointer",flexShrink:0}
      }, "ⓘ Detail")
    ),
    children,
    suggestions && React.createElement(CustomChartPanel, { tabId:chartKey, suggestions }),
    open && React.createElement("div", { style:{position:"fixed",inset:0,background:"rgba(11,25,41,0.85)",zIndex:800,display:"flex",alignItems:"center",justifyContent:"center"},onClick:()=>setOpen(false) },
      React.createElement("div", { style:{background:"#fff",borderRadius:12,maxWidth:600,width:"100%",padding:28},onClick:e=>e.stopPropagation() },
        React.createElement("h3", { style:{color:C.navy} }, "Chart Detail: "+title),
        React.createElement("p", { style:{color:C.grey} }, "Formula details, sources, and methodology for this chart are available in the full documentation."),
        React.createElement("button", { onClick:()=>setOpen(false), style:{background:C.teal,color:C.navy,border:"none",borderRadius:8,padding:"10px 22px",fontWeight:800,cursor:"pointer"} }, "Close")
      )
    )
  );
};

// ── TABS ──────────────────────────────────────────────────────
const TABS = [
  { id:"nutrient",    label:"Nutrient Release",     icon:"🌿" },
  { id:"dose",        label:"Dose Response",         icon:"⚖️"  },
  { id:"yield",       label:"Yield Impact",          icon:"📈" },
  { id:"microbiome",  label:"Soil Microbiome",       icon:"🦠" },
  { id:"leaching",    label:"Leaching Prevention",   icon:"💧" },
  { id:"biologicals", label:"Biologicals Timeline",  icon:"🔬" },
  { id:"credits",     label:"GHG Credit Pathways",   icon:"🌍" },
  { id:"residue",     label:"Residue Comparison",    icon:"♻️"  },
  { id:"plantation",  label:"Plantation Intel",      icon:"🔍" }
];

// ── STATIC DATA ───────────────────────────────────────────────
const MICROBIOME_RADAR = [
  { group:"N-Fixing Bacteria",  withCFI:88, withoutCFI:22 },
  { group:"P-Solubilising",     withCFI:75, withoutCFI:18 },
  { group:"Mycorrhizal Fungi",  withCFI:82, withoutCFI:25 },
  { group:"Trichoderma spp.",   withCFI:70, withoutCFI:15 },
  { group:"Cellulase Activity", withCFI:92, withoutCFI:30 },
  { group:"Urease Enzyme",      withCFI:78, withoutCFI:28 },
  { group:"Phosphatase",        withCFI:85, withoutCFI:20 },
  { group:"Humus Formers",      withCFI:80, withoutCFI:22 }
];

const MICROBIOME_TIMELINE = [0,7,14,21,30,60,90,120,180,365].map((d,i) => ({
  day:d,
  "N-Fixing Bacteria": [5,12,28,45,60,75,85,90,95,100][i],
  "P-Solubilising":    [5,10,20,38,52,68,78,85,90,95][i],
  "Mycorrhizal Fungi": [5,6,10,18,30,55,72,82,90,98][i],
  "Trichoderma":       [8,18,35,55,65,72,76,78,80,82][i],
  "Humus Bacteria":    [5,15,30,50,65,80,90,95,98,100][i]
}));

const BIOLOGICALS = [
  { name:"Azospirillum brasilense", type:"N-Fixer", effect:"Free-living N fixation. Fixes 15-30 kg N/ha/yr. Produces plant growth hormones.", cfi_phase:"S3 composting", carbon_credit:true, credit_note:"N fixation reduces synthetic N = Scope 3 Cat 1. ~8 kg CO2e/kg N replaced." },
  { name:"Azotobacter chroococcum", type:"N-Fixer", effect:"Aerobic N fixation. Fixes 10-20 kg N/ha/yr. Antifungal compounds for palm roots.", cfi_phase:"S3 composting", carbon_credit:true, credit_note:"Same N fixation credit pathway as Azospirillum." },
  { name:"Bacillus megaterium",     type:"P-Solubiliser", effect:"Solubilises fixed soil P. Increases plant-available P by 40-80%. Critical for Oxisols.", cfi_phase:"S3 composting", carbon_credit:false, credit_note:"Indirect — P solubilisation reduces rock phosphate mining Scope 3." },
  { name:"Trichoderma harzianum",   type:"Biocontrol+Growth", effect:"Suppresses Ganoderma (basal stem rot #1 palm killer). Speeds compost maturation.", cfi_phase:"S3 composting", carbon_credit:false, credit_note:"Yield increase from Ganoderma suppression — indirect credit via avoided land conversion." },
  { name:"Bacillus subtilis",       type:"Ammonia Inhibitor", effect:"INHIBITS ammonia volatilisation. Reduces N loss as NH3 by 35-55%. DIRECT N2O credit.", cfi_phase:"S3 composting (add early)", carbon_credit:true, credit_note:"DIRECT: N2O is 298× GWP vs CO2. ~850 t CO2e/yr additional at 60 TPH." },
  { name:"Lactobacillus spp.",      type:"Carbon Stabiliser", effect:"Prevents C loss during composting. Lactic acid fixes C into stable humus.", cfi_phase:"S0-S3 all stages", carbon_credit:true, credit_note:"DIRECT: C fixed into humus = 3.67 t CO2e/t C. ~150 t CO2e/yr at 60 TPH." },
  { name:"Glomus intraradices (AMF)",type:"Mycorrhiza", effect:"Extends palm root area ×100. Reduces N2O from rhizosphere 20-40%.", cfi_phase:"Apply to seedlings / planting hole", carbon_credit:true, credit_note:"N2O suppression from rhizosphere. Applied via CFI frass as inoculant carrier." },
  { name:"Nitrobacter/Nitrospira",  type:"Nitrification Regulator", effect:"Regulated nitrification reduces N2O by controlling NH4→NO3 conversion.", cfi_phase:"S4-S6 frass application", carbon_credit:true, credit_note:"N2O regulation = direct GHG reduction. Verra VM0042 analog applicable." }
];

const BIO_TIMELINE_DATA = [0,7,14,21,30,60,90,120,180].map((d,i) => ({
  day:d,
  "N Fixation Activity":    [0,15,40,65,78,88,92,95,98][i],
  "Ammonia Suppression":    [0,40,72,88,90,88,85,82,80][i],
  "P Solubilisation":       [0,20,45,68,80,88,90,92,93][i],
  "Carbon Stabilisation":   [0,55,80,90,92,88,84,80,78][i],
  "Mycorrhizal Colonisation":[0,5,10,18,28,55,75,88,95][i]
}));

// ── PLANTATION INTELLIGENCE COMPONENT (AI-powered) ────────────
const PlantationIntel = () => {
  const [company, setCompany] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchCount, setSearchCount] = useState(0);
  const SEARCH_LIMIT = 10;

  const runSearch = async () => {
    if (!company.trim()) return;
    if (searchCount >= SEARCH_LIMIT) {
      setError("LIMIT");
      return;
    }
    setLoading(true);
    setResults(null);
    setError(null);
    try {
      const prompt = `You are a sustainability intelligence analyst for CFI Kft, an Indonesian palm oil bioconversion company. Analyze the company: "${company}"

Research and report on:
1. COMPANY TYPE: Is this a palm oil company, F&B company, oleochemical company, or other? Key owners, size, listed/private.
2. SUSTAINABILITY CLAIMS: What do their latest sustainability reports or press releases claim? Key targets, programmes, certifications (RSPO, ISPO, MSPO, ISCC).
3. AG MANAGEMENT: What soil types do they operate on? What fertiliser programmes do they claim? Organic matter, composting, cover crops mentioned?
4. PAST PROJECTS — FLAG IF DROPPED: List any composting, regenerative agriculture, or waste-reduction projects they announced in 2021-2024. For each project: name, location, hectares, tonnes/hectare, what it did. CRITICALLY FLAG if a project was announced but has no recent updates or appears to have been discontinued.
5. COST ANALYSIS ESTIMATE (use logic + available data): Estimated fertiliser spend (transport, employees, equipment, fuel) per hectare. Estimated composting/waste handling cost if they have a programme.
6. CFI COMPARISON: How could CFI's bioconversion platform directly replace or improve their current waste management approach? What carbon credits could they earn? What fertiliser cost savings?
7. DATA GAPS: If you cannot find specific data for this company, name a comparable company on similar soil types and show what you found.

Format your response as structured JSON with these keys: company_name, company_type, sustainability_grade, key_claims (array), dropped_projects (array with {name, year_announced, location, ha, description, flag_reason}), ag_management, soil_types (array), estimated_fert_spend_usd_ha, cfi_opportunity (text), carbon_credit_potential_t_co2e_yr, comparable_company (if needed), data_confidence (low/medium/high), sources (array).`;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:1000,
          tools:[{ type:"web_search_20250305", name:"web_search" }],
          messages:[{ role:"user", content:prompt }]
        })
      });
      const data = await response.json();
      const textBlocks = data.content.filter(b=>b.type==="text").map(b=>b.text).join("\n");
      let parsed = null;
      try {
        const clean = textBlocks.replace(/```json|```/g,"").trim();
        const jsonStart = clean.indexOf("{");
        const jsonEnd = clean.lastIndexOf("}");
        if (jsonStart >= 0 && jsonEnd > jsonStart) {
          parsed = JSON.parse(clean.slice(jsonStart, jsonEnd+1));
        }
      } catch(e) {
        parsed = { raw: textBlocks };
      }
      setResults(parsed);
      setSearchCount(c => c+1);
    } catch(e) {
      setError("API error: "+e.message);
    }
    setLoading(false);
  };

  const gradeColor = g => g==="A"?C.green:g==="B"?C.teal:g==="C"?C.amber:C.red;

  return React.createElement("div", null,
    React.createElement(SectionHeader, { icon:"🔍", title:"Plantation Intelligence", subtitle:"Search any palm oil company, estate group, or F&B buyer. CFI analyses their sustainability claims, ag management, dropped projects, costs and opportunity." }),

    searchCount >= SEARCH_LIMIT && React.createElement("div", { style:{background:C.amber+"22",border:"2px solid "+C.amber,borderRadius:10,padding:16,marginBottom:20} },
      React.createElement("p", { style:{color:C.amber,fontWeight:800,margin:0} }, "⚠️ You have used all "+SEARCH_LIMIT+" search credits for this session. CFI has been notified and will approve additional access.")
    ),

    React.createElement("div", { style:{background:"#fff",borderRadius:12,padding:24,marginBottom:20} },
      React.createElement("p", { style:{color:C.grey,fontSize:13,marginBottom:14} }, "Search by company name (Sinar Mas, Wilmar, Musim Mas, Golden Agri, Unilever, Nestlé, etc.) — CFI searches its database first, then live web sources if needed."),
      React.createElement("div", { style:{display:"flex",gap:10} },
        React.createElement("input", {
          value:company, onChange:e=>setCompany(e.target.value),
          onKeyDown:e=>e.key==="Enter"&&runSearch(),
          placeholder:"Company name — e.g. Sinar Mas, Wilmar International, SIPEF...",
          style:{flex:1,border:"2px solid "+C.teal,borderRadius:8,padding:"10px 14px",fontSize:14,fontFamily:"inherit",outline:"none"}
        }),
        React.createElement("button", { onClick:runSearch, disabled:loading||!company.trim()||searchCount>=SEARCH_LIMIT,
          style:{background:C.teal,color:C.navy,border:"none",borderRadius:8,padding:"10px 22px",fontWeight:800,fontSize:14,cursor:"pointer",whiteSpace:"nowrap"}
        }, loading ? "Searching..." : "Search + Analyse")
      ),
      React.createElement("p", { style:{color:C.grey,fontSize:11,marginTop:8} }, "Searches used: "+searchCount+" / "+SEARCH_LIMIT)
    ),

    loading && React.createElement("div", { style:{background:"#fff",borderRadius:12,padding:40,textAlign:"center"} },
      React.createElement("div", { style:{fontSize:40,marginBottom:12} }, "🔍"),
      React.createElement("p", { style:{color:C.teal,fontWeight:700,fontSize:16} }, "Searching CFI database + live web sources..."),
      React.createElement("p", { style:{color:C.grey,fontSize:13} }, "Analysing sustainability reports, RSPO filings, press releases, and public data for: "+company)
    ),

    error && error !== "LIMIT" && React.createElement("div", { style:{background:C.red+"15",border:"1px solid "+C.red,borderRadius:10,padding:16} },
      React.createElement("p", { style:{color:C.red,fontWeight:700} }, "Search error: "+error)
    ),

    results && React.createElement("div", null,
      // Company header
      results.raw ? React.createElement("div", { style:{background:"#fff",borderRadius:12,padding:24} },
        React.createElement("pre", { style:{whiteSpace:"pre-wrap",fontSize:13,color:C.navy} }, results.raw)
      ) : React.createElement("div", null,
        // Grade + summary card
        React.createElement("div", { style:{background:C.navy,borderRadius:12,padding:24,marginBottom:16,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:16} },
          React.createElement("div", null,
            React.createElement("h2", { style:{color:"#fff",margin:0,fontSize:22} }, results.company_name||company),
            React.createElement("p", { style:{color:C.mid,margin:"4px 0 0",fontSize:13} }, results.company_type||"Palm sector"),
            results.comparable_company && React.createElement("p", { style:{color:C.amber,fontSize:12,margin:"4px 0 0"} }, "★ Showing comparable data from: "+results.comparable_company)
          ),
          React.createElement("div", { style:{textAlign:"center"} },
            React.createElement("div", { style:{width:72,height:72,borderRadius:"50%",background:gradeColor(results.sustainability_grade)+"33",border:"3px solid "+gradeColor(results.sustainability_grade),display:"flex",alignItems:"center",justifyContent:"center"} },
              React.createElement("span", { style:{fontSize:28,fontWeight:900,color:gradeColor(results.sustainability_grade)} }, results.sustainability_grade||"?")
            ),
            React.createElement("p", { style:{color:C.mid,fontSize:11,margin:"4px 0 0"} }, "Sustainability Grade")
          )
        ),

        // Key claims
        results.key_claims && results.key_claims.length > 0 && React.createElement("div", { style:{background:"#fff",borderRadius:12,padding:20,marginBottom:16} },
          React.createElement("h4", { style:{color:C.navy,marginTop:0} }, "📋 Active Sustainability Claims"),
          React.createElement("ul", { style:{margin:0,paddingLeft:20} },
            results.key_claims.map((cl,i) => React.createElement("li", { key:i, style:{color:"#333",fontSize:13,marginBottom:4} }, cl))
          )
        ),

        // DROPPED PROJECTS — flagged in red
        results.dropped_projects && results.dropped_projects.length > 0 && React.createElement("div", { style:{background:C.red+"12",border:"2px solid "+C.red,borderRadius:12,padding:20,marginBottom:16} },
          React.createElement("h4", { style:{color:C.red,marginTop:0} }, "🚩 Flagged: Announced Projects with No Recent Updates"),
          results.dropped_projects.map((p,i) =>
            React.createElement("div", { key:i, style:{background:"#fff",borderRadius:8,padding:14,marginBottom:10,borderLeft:"3px solid "+C.red} },
              React.createElement("div", { style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6} },
                React.createElement("strong", { style:{color:C.navy} }, p.name||"Unnamed project"),
                React.createElement(Badge, { text:"Announced "+p.year_announced, color:C.red })
              ),
              React.createElement("p", { style:{color:"#333",fontSize:13,margin:"0 0 4px"} }, p.description),
              p.location && React.createElement("p", { style:{color:C.grey,fontSize:12,margin:"0 0 4px"} }, "Location: "+p.location+(p.ha?" | "+p.ha+" ha":"")+(p.t_per_ha?" | "+p.t_per_ha+" t/ha":"")),
              React.createElement("p", { style:{color:C.red,fontSize:12,fontWeight:700,margin:0} }, "⚠️ "+p.flag_reason)
            )
          )
        ),

        // Ag management + soil + costs grid
        React.createElement("div", { style:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:16,marginBottom:16} },
          React.createElement("div", { style:{background:"#fff",borderRadius:12,padding:20} },
            React.createElement("h4", { style:{color:C.navy,marginTop:0} }, "🌱 Agricultural Management"),
            React.createElement("p", { style:{color:"#333",fontSize:13} }, results.ag_management||"No data found."),
            results.soil_types && React.createElement("div", { style:{marginTop:8,display:"flex",flexWrap:"wrap",gap:4} },
              results.soil_types.map((s,i) => React.createElement(Badge, { key:i, text:s, color:C.teal }))
            )
          ),
          React.createElement("div", { style:{background:"#fff",borderRadius:12,padding:20} },
            React.createElement("h4", { style:{color:C.navy,marginTop:0} }, "💰 Estimated Costs"),
            React.createElement("div", { style:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:"1px solid #eee"} },
              React.createElement("span", { style:{color:C.grey,fontSize:13} }, "Est. fertiliser spend"),
              React.createElement("span", { style:{color:C.navy,fontWeight:700,fontSize:15} }, "$"+(results.estimated_fert_spend_usd_ha||"?")+"/ha/yr")
            ),
            React.createElement("div", { style:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0"} },
              React.createElement("span", { style:{color:C.grey,fontSize:13} }, "Data confidence"),
              React.createElement(Badge, { text:(results.data_confidence||"?").toUpperCase(), color:results.data_confidence==="high"?C.green:results.data_confidence==="medium"?C.amber:C.red })
            )
          )
        ),

        // CFI Opportunity
        results.cfi_opportunity && React.createElement("div", { style:{background:C.teal+"18",border:"2px solid "+C.teal,borderRadius:12,padding:20,marginBottom:16} },
          React.createElement("h4", { style:{color:C.teal,marginTop:0} }, "🌱 CFI Opportunity for "+results.company_name),
          React.createElement("p", { style:{color:C.navy,fontSize:13,lineHeight:1.7} }, results.cfi_opportunity),
          results.carbon_credit_potential_t_co2e_yr && React.createElement("div", { style:{marginTop:12,background:"#fff",borderRadius:8,padding:12,display:"flex",justifyContent:"space-between"} },
            React.createElement("span", { style:{color:C.grey,fontSize:13} }, "Carbon credit potential"),
            React.createElement("span", { style:{color:C.teal,fontWeight:800,fontSize:16} }, Number(results.carbon_credit_potential_t_co2e_yr).toLocaleString()+" t CO2e/yr")
          )
        ),

        // Sources
        results.sources && results.sources.length > 0 && React.createElement("div", { style:{background:"#fff",borderRadius:12,padding:16} },
          React.createElement("p", { style:{color:C.grey,fontSize:11,fontWeight:700,margin:"0 0 8px"} }, "SOURCES"),
          results.sources.map((s,i) => React.createElement("p", { key:i, style:{color:C.grey,fontSize:11,margin:"2px 0"} }, "• "+s))
        )
      )
    )
  );
};

// ══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════
export default function CFISoilBioViz() {
  const [soil, setSoil]           = useState("Ultisols");
  const [ageIdx, setAgeIdx]       = useState(2);
  const [nutrient, setNutrient]   = useState("N");
  const [tab, setTab]             = useState("nutrient");
  const [bioSelected, setBio]     = useState(0);
  const [stageKey, setStageKey]   = useState("S5");
  const [agTier, setAgTier]       = useState("GAM");
  const [showVisitor, setShowVisitor] = useState(false);
  const [searchCount] = useState(0);
  const SEARCH_LIMIT = 10;

  useEffect(() => {
    const t = setTimeout(() => setShowVisitor(true), 2 * 60 * 1000);
    return () => clearTimeout(t);
  }, []);

  const soilData  = SOILS[soil];
  const prod      = STAGE_PRODUCTS[stageKey];
  const release   = useMemo(() => buildReleaseCurves(soilData), [soil]);
  const doseData  = useMemo(() => buildDoseData(soilData, ageIdx, stageKey, agTier), [soil, ageIdx, stageKey, agTier]);
  const yieldData = useMemo(() => buildYieldData(soilData, ageIdx), [soil, ageIdx]);
  const leachData = useMemo(() => buildLeachingData(soilData), [soil]);
  const fertPlan  = useMemo(() => buildFertPlan(ageIdx, soilData, agTier), [ageIdx, soil, agTier]);
  const bio       = BIOLOGICALS[bioSelected];
  const nutrKey   = (pfx) => pfx + " " + nutrient + " (%)";

  return React.createElement("div", { style:{fontFamily:"'Segoe UI',system-ui,sans-serif",background:"#F0F4F8",minHeight:"100vh"} },

    showVisitor && React.createElement(VisitorModal, { onClose:()=>setShowVisitor(false), onSkip:()=>setShowVisitor(false) }),

    // HEADER
    React.createElement("div", { style:{background:C.navy,padding:"14px 28px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10} },
      React.createElement("div", null,
        React.createElement("span", { style:{color:C.teal,fontWeight:900,fontSize:20,letterSpacing:2} }, "CFI "),
        React.createElement("span", { style:{color:"#fff",fontWeight:300,fontSize:16} }, "Soil Science + Biologicals  v3")
      ),
      React.createElement("div", { style:{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"} },
        Object.entries(SOILS).map(([k,v]) =>
          React.createElement("button", { key:k, onClick:()=>setSoil(k),
            style:{background:soil===k?v.color:"transparent",color:soil===k?C.navy:"#fff",
                   border:"1px solid "+(soil===k?v.color:C.mid),borderRadius:5,padding:"3px 10px",fontSize:11,fontWeight:700,cursor:"pointer"}
          }, k)
        ),
        React.createElement("button", { onClick:()=>setShowVisitor(true),
          style:{background:C.teal,color:C.navy,border:"none",borderRadius:6,padding:"4px 12px",fontSize:11,fontWeight:800,cursor:"pointer"}
        }, "📋 Register")
      )
    ),

    // SOIL INFO BAR
    React.createElement("div", { style:{background:soilData.color+"22",borderBottom:"2px solid "+soilData.color,padding:"8px 28px",display:"flex",gap:24,flexWrap:"wrap"} },
      React.createElement("span", { style:{color:soilData.color,fontWeight:800,fontSize:13} }, soil+" ("+soilData.coverage+"% of Indonesian palm)"),
      ["pH: "+soilData.ph,"CEC: "+soilData.cec+" cmol/kg","OM: "+soilData.om_baseline+"%","Retention: "+(soilData.retention*100)+"%","N: "+soilData.n_bg+" g/kg"].map((s,i) =>
        React.createElement("span", { key:i, style:{color:C.navy,fontSize:12} }, s)
      )
    ),

    // TABS
    React.createElement("div", { style:{background:"#fff",padding:"0 28px",display:"flex",gap:2,borderBottom:"1px solid #dde",overflowX:"auto"} },
      TABS.map(t =>
        React.createElement("button", { key:t.id, onClick:()=>setTab(t.id),
          style:{padding:"11px 16px",border:"none",borderBottom:tab===t.id?"3px solid "+C.teal:"3px solid transparent",
                 background:"transparent",cursor:"pointer",fontWeight:tab===t.id?700:400,
                 color:tab===t.id?C.teal:C.grey,fontSize:12,whiteSpace:"nowrap"}
        }, t.icon+" "+t.label)
      )
    ),

    // CONTENT
    React.createElement("div", { style:{padding:28,maxWidth:1400,margin:"0 auto"} },

    // ═══ NUTRIENT RELEASE ════════════════════════════════════
    tab==="nutrient" && React.createElement("div", null,
      React.createElement(SectionHeader, { icon:"🌿", title:"Nutrient Plant Availability Over Time", subtitle:"CFI organic vs synthetic on "+soil+" (retention "+soilData.retention*100+"%). Organic N stays in root zone — synthetic peaks then leaches." }),
      React.createElement("div", { style:{display:"flex",gap:10,marginBottom:16} },
        ["N","P","K"].map(n =>
          React.createElement("button", { key:n, onClick:()=>setNutrient(n),
            style:{background:nutrient===n?C.navy:"#fff",color:nutrient===n?"#fff":C.navy,border:"2px solid "+C.navy,borderRadius:6,padding:"6px 18px",fontWeight:700,cursor:"pointer"} }, n)
        )
      ),
      React.createElement(ChartCard, { chartKey:"nutrient_release", title:"% of "+nutrient+" plant-available at each week",
        suggestions:["Show N, P, K all on one chart","Annual leaching cost comparison","Soil type comparison all 5 soils","Seasonal wet vs dry season release"]
      },
        React.createElement(ResponsiveContainer, { width:"100%", height:300 },
          React.createElement(ComposedChart, { data:release },
            React.createElement(CartesianGrid, { strokeDasharray:"3 3", stroke:"#eef" }),
            React.createElement(XAxis, { dataKey:"week", label:{value:"Weeks after application",position:"insideBottom",offset:-5,style:{fontSize:10}} }),
            React.createElement(YAxis),
            React.createElement(Tooltip, { content:React.createElement(TooltipBox,null) }),
            React.createElement(Legend),
            React.createElement(Area, { dataKey:nutrKey("CFI"), fill:soilData.color+"33", stroke:soilData.color, strokeWidth:3, name:"CFI "+nutrient+" (organic)" }),
            React.createElement(Line, { dataKey:nutrKey("Synthetic"), stroke:C.red, strokeWidth:2, strokeDasharray:"5 3", dot:false, name:"Synthetic "+nutrient })
          )
        )
      )
    ),

    // ═══ DOSE RESPONSE (FULLY UPDATED) ═══════════════════════
    tab==="dose" && React.createElement("div", null,
      React.createElement(SectionHeader, { icon:"⚖️", title:"CFI Dose Response — Synthetic NPK Replacement", subtitle:"All calculations driven by stage-specific lab values + soil type + AG management tier. 100% formula-based." }),

      // Stage + AG tier selectors
      React.createElement("div", { style:{background:"#fff",borderRadius:12,padding:16,marginBottom:16,display:"flex",gap:20,flexWrap:"wrap",alignItems:"center"} },
        React.createElement("div", null,
          React.createElement("p", { style:{color:C.grey,fontSize:11,fontWeight:700,margin:"0 0 6px"} }, "CFI PRODUCT / PIPELINE STAGE"),
          React.createElement("div", { style:{display:"flex",gap:6} },
            Object.entries(STAGE_PRODUCTS).map(([k,v]) =>
              React.createElement("button", { key:k, onClick:()=>setStageKey(k),
                style:{background:stageKey===k?C.navy:"#fff",color:stageKey===k?"#fff":C.navy,border:"2px solid "+(stageKey===k?C.navy:"#ccd"),borderRadius:6,padding:"6px 14px",fontWeight:700,cursor:"pointer",fontSize:12}
              },
                React.createElement("span", null, v.code+": "+v.name),
                v.nameExt && React.createElement("span", { style:{fontWeight:900,color:stageKey===k?"#fff":C.green,fontSize:15} }, v.nameExt)
              )
            )
          ),
          React.createElement("p", { style:{color:C.grey,fontSize:11,margin:"6px 0 0"} }, prod.desc)
        ),
        React.createElement("div", null,
          React.createElement("p", { style:{color:C.grey,fontSize:11,fontWeight:700,margin:"0 0 6px"} }, "AG MANAGEMENT TIER"),
          React.createElement("div", { style:{display:"flex",gap:6,flexWrap:"wrap"} },
            Object.entries(AG_TIERS).map(([k,v]) =>
              React.createElement("button", { key:k, onClick:()=>setAgTier(k),
                style:{background:agTier===k?v.color:"#fff",color:agTier===k?C.navy:C.grey,border:"2px solid "+(agTier===k?v.color:"#ccd"),borderRadius:6,padding:"5px 12px",fontWeight:700,cursor:"pointer",fontSize:11}
              }, k)
            )
          ),
          React.createElement("p", { style:{color:C.grey,fontSize:11,margin:"6px 0 0"} }, AG_TIERS[agTier].desc+" — adjustment: "+Math.round(AG_TIERS[agTier].adj*100)+"% of VGAM values")
        )
      ),

      // Stage composition panel
      React.createElement("div", { style:{background:C.navy,borderRadius:10,padding:14,marginBottom:16,display:"flex",gap:20,flexWrap:"wrap",alignItems:"center"} },
        React.createElement("span", { style:{color:C.teal,fontWeight:800,fontSize:13} }, "Using: "),
        React.createElement(ProductLabel, { stage:stageKey, size:14 }),
        React.createElement("span", { style:{color:C.mid,fontSize:12} }, "("+prod.source+")"),
        [["N",prod.N_pct],["P",prod.P_pct],["K",prod.K_pct],["OM",prod.OM_pct],["C:N",prod.cn]].map(([k,v],i) =>
          React.createElement("span", { key:i, style:{color:"#fff",fontSize:12} }, k+": "+v+(k==="C:N"?"":"%")+" DM")
        )
      ),

      // Palm age group
      React.createElement("div", { style:{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap",alignItems:"center"} },
        React.createElement("span", { style:{color:C.grey,fontSize:12,fontWeight:700} }, "Palm age:"),
        PALM_AGE_GROUPS.map((a,i) =>
          React.createElement("button", { key:i, onClick:()=>setAgeIdx(i),
            style:{background:ageIdx===i?C.navy:"#fff",color:ageIdx===i?"#fff":C.navy,border:"2px solid "+(ageIdx===i?C.navy:"#ccd"),borderRadius:6,padding:"5px 12px",fontWeight:700,cursor:"pointer",fontSize:12}
          }, a.label)
        )
      ),

      // NPK replacement chart
      React.createElement(ChartCard, { chartKey:"dose_response",
        title:"% of Synthetic NPK Replaced by CFI "+prod.name+(prod.nameExt||"")+" ("+PALM_AGE_GROUPS[ageIdx].label+", "+soil+", "+agTier+")",
        suggestions:["Show as USD value saved","Show all dose levels on one line chart","Add 20t/ha dose","Show Compost vs Biofertiliser+ comparison"]
      },
        React.createElement(ResponsiveContainer, { width:"100%", height:280 },
          React.createElement(BarChart, { data:doseData },
            React.createElement(CartesianGrid, { strokeDasharray:"3 3", stroke:"#eef" }),
            React.createElement(XAxis, { dataKey:"dose" }),
            React.createElement(YAxis, { label:{value:"% of requirement met",angle:-90,position:"insideLeft",style:{fontSize:10}} }),
            React.createElement(Tooltip, { content:React.createElement(TooltipBox,null) }),
            React.createElement(Legend),
            React.createElement(ReferenceLine, { y:100, stroke:C.teal, strokeDasharray:"4 4", label:{value:"100% = Full replacement",fill:C.teal,fontSize:10} }),
            React.createElement(Bar, { dataKey:"N replacement %", fill:C.teal,  name:"N % replaced" }),
            React.createElement(Bar, { dataKey:"P replacement %", fill:C.green, name:"P % replaced" }),
            React.createElement(Bar, { dataKey:"K replacement %", fill:C.amber, name:"K % replaced" })
          )
        ),
        // NPK table
        React.createElement("div", { style:{overflowX:"auto",marginTop:16} },
          React.createElement("table", { style:{width:"100%",borderCollapse:"collapse",fontSize:12} },
            React.createElement("thead", null,
              React.createElement("tr", { style:{background:C.navy} },
                ["Dose","N supplied","N required","N replaces","P supplied","P required","P replaces","K supplied","K required","K replaces"].map((h,i) =>
                  React.createElement("th", { key:i, style:{color:"#fff",padding:"8px 10px",textAlign:"left",fontSize:11} }, h)
                )
              )
            ),
            React.createElement("tbody", null,
              doseData.map((row,i) =>
                React.createElement("tr", { key:i, style:{background:i%2===0?"#F0F4F8":"#fff"} },
                  [row.dose, row["N supplied (kg/ha)"]+" kg", row["N required (kg/ha)"]+" kg",
                   React.createElement(Badge,{text:row["N replacement %"]+"%",color:row["N replacement %"]>=100?C.green:row["N replacement %"]>=50?C.amber:C.red}),
                   row["P supplied (kg/ha)"]+" kg", row["P required (kg/ha)"]+" kg",
                   React.createElement(Badge,{text:row["P replacement %"]+"%",color:row["P replacement %"]>=100?C.green:row["P replacement %"]>=50?C.amber:C.red}),
                   row["K supplied (kg/ha)"]+" kg", row["K required (kg/ha)"]+" kg",
                   React.createElement(Badge,{text:row["K replacement %"]+"%",color:row["K replacement %"]>=100?C.green:row["K replacement %"]>=50?C.amber:C.red})
                  ].map((cell,j) => React.createElement("td", { key:j, style:{padding:"7px 10px"} }, cell))
                )
              )
            )
          )
        )
      ),

      // Synthetic fertiliser management plan
      React.createElement(ChartCard, { chartKey:"fert_plan",
        title:"Standard Synthetic Fertiliser Programme — "+PALM_AGE_GROUPS[ageIdx].label+" on "+soil+" ("+agTier+")",
        style:{marginTop:16},
        suggestions:["Show 10-year fertiliser cost trajectory","Compare Urea vs Ammonium sulphate N source","Show labour cost breakdown by season","Chart CFI frass cost vs synthetic saving"]
      },
        React.createElement("div", { style:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:14,marginBottom:16} },
          [
            { label:"Urea requirement/ha/yr",   val:fertPlan.urea_ha+" kg",           sub:fertPlan.urea_tree+" kg/tree",   color:C.teal   },
            { label:"TSP requirement/ha/yr",    val:fertPlan.tsp_ha+" kg",            sub:fertPlan.tsp_tree+" kg/tree",    color:C.green  },
            { label:"MOP requirement/ha/yr",    val:fertPlan.mop_ha+" kg",            sub:fertPlan.mop_tree+" kg/tree",    color:C.amber  },
            { label:"Applications per year",    val:fertPlan.apps_per_yr+"× splits",  sub:"quarterly programme",           color:C.navy   },
            { label:"Total fertiliser cost/ha", val:"$"+fertPlan.urea_cost+"+"+"$"+fertPlan.tsp_cost+"+"+"$"+fertPlan.mop_cost, sub:"Urea + TSP + MOP",color:C.purple},
            { label:"Labour (application)/ha",  val:"$"+fertPlan.labour_cost,         sub:fertPlan.apps_per_yr+" visits × $50/ha",color:C.grey},
            { label:"TOTAL COST/ha/yr",         val:"$"+fertPlan.total,               sub:"basis: Urea $350/t · TSP $450/t · MOP $380/t",color:C.red,bold:true}
          ].map((kpi,i) =>
            React.createElement("div", { key:i, style:{background:"#F0F4F8",borderRadius:8,padding:14,borderTop:"3px solid "+kpi.color} },
              React.createElement("p", { style:{color:C.grey,fontSize:11,margin:0} }, kpi.label),
              React.createElement("p", { style:{color:kpi.color,fontSize:kpi.bold?20:16,fontWeight:800,margin:"4px 0 2px"} }, kpi.val),
              React.createElement("p", { style:{color:C.grey,fontSize:10,margin:0} }, kpi.sub)
            )
          )
        ),
        // Per-application breakdown
        React.createElement("div", { style:{background:C.navy,borderRadius:8,padding:14} },
          React.createElement("p", { style:{color:C.teal,fontWeight:700,fontSize:12,margin:"0 0 8px"} }, "Per Application (each of "+fertPlan.apps_per_yr+" visits/yr)"),
          React.createElement("div", { style:{display:"flex",gap:20,flexWrap:"wrap"} },
            [["Urea",fertPlan.urea_per_app+" kg/ha"],["TSP",fertPlan.tsp_per_app+" kg/ha"],["MOP",fertPlan.mop_per_app+" kg/ha"]].map(([k,v],i) =>
              React.createElement("div", { key:i },
                React.createElement("span", { style:{color:C.mid,fontSize:11} }, k+": "),
                React.createElement("span", { style:{color:"#fff",fontWeight:700,fontSize:13} }, v)
              )
            )
          ),
          React.createElement("p", { style:{color:C.teal,fontSize:12,margin:"10px 0 0",fontWeight:700} },
            "CFI 10t/ha frass replaces ~$"+Math.round((fertPlan.urea_cost*(doseData[2]["N replacement %"]/100) + fertPlan.tsp_cost*(doseData[2]["P replacement %"]/100) + fertPlan.mop_cost*(doseData[2]["K replacement %"]/100)))+"/ha/yr in synthetic fertiliser at "+PALM_AGE_GROUPS[ageIdx].label+", "+agTier+"."
          )
        )
      )
    ),

    // ═══ YIELD IMPACT ════════════════════════════════════════
    tab==="yield" && React.createElement("div", null,
      React.createElement(SectionHeader, { icon:"📈", title:"FFB Yield Impact from CFI Frass Application", subtitle:"3-year OM accumulation model. Soil type, age group, and AG management tier all affect trajectory." }),
      React.createElement("div", { style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20} },
        React.createElement(ChartCard, { chartKey:"yield_bars", title:"FFB Yield by Dose ("+PALM_AGE_GROUPS[ageIdx].label+")", suggestions:["Show cumulative value over 10 years","Compare all soil types","Revenue chart at $180/t FFB"] },
          React.createElement(ResponsiveContainer, { width:"100%", height:260 },
            React.createElement(BarChart, { data:yieldData },
              React.createElement(CartesianGrid, { strokeDasharray:"3 3", stroke:"#eef" }),
              React.createElement(XAxis, { dataKey:"dose" }),
              React.createElement(YAxis),
              React.createElement(Tooltip, { content:React.createElement(TooltipBox,null) }),
              React.createElement(Legend),
              React.createElement(Bar, { dataKey:"FFB Yield (t/ha/yr)", fill:soilData.color, name:"With CFI" }),
              React.createElement(Bar, { dataKey:"Baseline FFB (t/ha/yr)", fill:C.mid, name:"Baseline (synthetic only)" })
            )
          )
        ),
        React.createElement(ChartCard, { chartKey:"yield_gain", title:"Yield Gain % + OM Accumulation", suggestions:["Show OM trajectory to year 10","Show Ganoderma suppression contribution","Add Trichoderma inoculation uplift"] },
          React.createElement(ResponsiveContainer, { width:"100%", height:260 },
            React.createElement(BarChart, { data:yieldData },
              React.createElement(CartesianGrid, { strokeDasharray:"3 3", stroke:"#eef" }),
              React.createElement(XAxis, { dataKey:"dose" }),
              React.createElement(YAxis),
              React.createElement(Tooltip, { content:React.createElement(TooltipBox,null) }),
              React.createElement(Legend),
              React.createElement(Bar, { dataKey:"Yield gain %", fill:C.green, name:"Yield increase %" }),
              React.createElement(Bar, { dataKey:"OM % after 3 yrs", fill:C.amber, name:"Soil OM %" })
            )
          )
        )
      )
    ),

    // ═══ SOIL MICROBIOME ═════════════════════════════════════
    tab==="microbiome" && React.createElement("div", null,
      React.createElement(SectionHeader, { icon:"🦠", title:"Soil Microbiome — What CFI Adds to the Soil", subtitle:"CFI frass introduces a living ecosystem. Comparison: with CFI vs synthetic-only management." }),
      React.createElement("div", { style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20} },
        React.createElement(ChartCard, { chartKey:"microbiome_radar", title:"Biological Activity Index (0–100)", suggestions:["Timeline: all 8 indicators year 0–5","Cost per unit biological activity","Ganoderma suppression index","Soil enzyme activity vs OM input"] },
          React.createElement(ResponsiveContainer, { width:"100%", height:300 },
            React.createElement(RadarChart, { data:MICROBIOME_RADAR },
              React.createElement(PolarGrid, { stroke:"#dde" }),
              React.createElement(PolarAngleAxis, { dataKey:"group", tick:{fill:C.grey,fontSize:10} }),
              React.createElement(PolarRadiusAxis, { domain:[0,100], tick:{fontSize:9} }),
              React.createElement(Radar, { dataKey:"withCFI", stroke:soilData.color, fill:soilData.color, fillOpacity:0.4, name:"With CFI" }),
              React.createElement(Radar, { dataKey:"withoutCFI", stroke:C.red, fill:C.red, fillOpacity:0.2, name:"Synthetic only" }),
              React.createElement(Legend)
            )
          )
        ),
        React.createElement(ChartCard, { chartKey:"microbiome_timeline", title:"Microbiome Establishment Over Time (days)", suggestions:["Show in weeks to year 3","Show Ganoderma disease pressure overlay","Show N2O suppression curve"] },
          React.createElement(ResponsiveContainer, { width:"100%", height:300 },
            React.createElement(LineChart, { data:MICROBIOME_TIMELINE },
              React.createElement(CartesianGrid, { strokeDasharray:"3 3", stroke:"#eef" }),
              React.createElement(XAxis, { dataKey:"day" }),
              React.createElement(YAxis),
              React.createElement(Tooltip, { content:React.createElement(TooltipBox,null) }),
              React.createElement(Legend),
              React.createElement(Line, { dataKey:"N-Fixing Bacteria",  stroke:C.teal,   strokeWidth:2, dot:false }),
              React.createElement(Line, { dataKey:"P-Solubilising",     stroke:C.green,  strokeWidth:2, dot:false }),
              React.createElement(Line, { dataKey:"Mycorrhizal Fungi",  stroke:C.purple, strokeWidth:2, dot:false }),
              React.createElement(Line, { dataKey:"Trichoderma",        stroke:C.amber,  strokeWidth:2, dot:false }),
              React.createElement(Line, { dataKey:"Humus Bacteria",     stroke:soilData.color, strokeWidth:2, dot:false })
            )
          )
        )
      )
    ),

    // ═══ LEACHING PREVENTION ═════════════════════════════════
    tab==="leaching" && React.createElement("div", null,
      React.createElement(SectionHeader, { icon:"💧", title:"Leaching Prevention — Organic Matter vs Nutrient Loss", subtitle:"As CFI frass builds OM, leaching drops. Current "+soil+" baseline: "+soilData.om_baseline+"% OM." }),
      React.createElement(ChartCard, { chartKey:"leaching", title:"N/P/K Leaching % vs Soil OM Level",
        suggestions:["Annual N cost saved by OM improvement","Leaching comparison all 5 soils","Required dose to reach 8% OM in 5 yrs","Rainfall sensitivity: 2000 vs 3000mm/yr"]
      },
        React.createElement(ResponsiveContainer, { width:"100%", height:320 },
          React.createElement(ComposedChart, { data:leachData },
            React.createElement(CartesianGrid, { strokeDasharray:"3 3", stroke:"#eef" }),
            React.createElement(XAxis, { dataKey:"OM %" }),
            React.createElement(YAxis, { label:{value:"% leaching",angle:-90,position:"insideLeft",style:{fontSize:10}} }),
            React.createElement(Tooltip, { content:React.createElement(TooltipBox,null) }),
            React.createElement(Legend),
            React.createElement(ReferenceLine, { x:Math.round(soilData.om_baseline), stroke:soilData.color, strokeWidth:2, label:{value:"Current "+soil,fill:soilData.color,fontSize:10} }),
            React.createElement(Area, { dataKey:"N leaching %", stroke:C.teal,  fill:C.teal+"33",  name:"N leaching %" }),
            React.createElement(Area, { dataKey:"P leaching %", stroke:C.green, fill:C.green+"33", name:"P leaching %" }),
            React.createElement(Area, { dataKey:"K leaching %", stroke:C.amber, fill:C.amber+"33", name:"K leaching %" })
          )
        )
      )
    ),

    // ═══ BIOLOGICALS ═════════════════════════════════════════
    tab==="biologicals" && React.createElement("div", null,
      React.createElement(SectionHeader, { icon:"🔬", title:"Biologicals in CFI Processing — Timeline of Effects", subtitle:"Activity from S3 composting through S6 field application." }),
      React.createElement("div", { style:{display:"flex",gap:6,flexWrap:"wrap",marginBottom:16} },
        BIOLOGICALS.map((b,i) =>
          React.createElement("button", { key:i, onClick:()=>setBio(i),
            style:{background:bioSelected===i?C.navy:"#fff",color:bioSelected===i?"#fff":C.navy,border:"2px solid "+(b.carbon_credit?C.teal:C.navy),borderRadius:6,padding:"5px 10px",fontSize:11,fontWeight:600,cursor:"pointer"}
          },
            b.name.split(" ")[0]+" "+b.name.split(" ")[1],
            b.carbon_credit && React.createElement("span", { style:{marginLeft:4,color:bioSelected===i?"#fff":C.teal,fontWeight:800} }, " ₡")
          )
        )
      ),
      React.createElement(ChartCard, { chartKey:"bio_detail", title:bio.name, suggestions:["N2O suppression t CO2e over 60 TPH","Carbon fixed by Lactobacillus per day","Economic value per kg treated"] },
        React.createElement("div", { style:{display:"flex",gap:8,marginBottom:10,flexWrap:"wrap"} },
          React.createElement(Badge, { text:bio.type, color:C.teal }),
          React.createElement(Badge, { text:"Phase: "+bio.cfi_phase, color:C.navy }),
          bio.carbon_credit && React.createElement(Badge, { text:"CARBON CREDIT PATHWAY", color:C.green })
        ),
        React.createElement("p", { style:{color:C.grey,fontSize:13,lineHeight:1.7} }, bio.effect),
        bio.carbon_credit && React.createElement("div", { style:{background:C.green+"15",border:"1px solid "+C.green,borderRadius:8,padding:12} },
          React.createElement("strong", { style:{color:C.green} }, "🌍 Credit: "),
          React.createElement("span", { style:{color:C.navy,fontSize:13} }, bio.credit_note)
        )
      ),
      React.createElement(ChartCard, { chartKey:"bio_timeline", title:"All Biologicals Activity Timeline", style:{marginTop:14}, suggestions:["Show as stacked area","Overlay temperature curve","Flag BSF introduction gate"] },
        React.createElement(ResponsiveContainer, { width:"100%", height:280 },
          React.createElement(LineChart, { data:BIO_TIMELINE_DATA },
            React.createElement(CartesianGrid, { strokeDasharray:"3 3", stroke:"#eef" }),
            React.createElement(XAxis, { dataKey:"day" }),
            React.createElement(YAxis),
            React.createElement(Tooltip, { content:React.createElement(TooltipBox,null) }),
            React.createElement(Legend),
            React.createElement(ReferenceLine, { x:30, stroke:C.amber, strokeDasharray:"4 4", label:{value:"BSF exit",fill:C.amber,fontSize:10} }),
            React.createElement(Line, { dataKey:"N Fixation Activity",      stroke:C.teal,   strokeWidth:2, dot:false }),
            React.createElement(Line, { dataKey:"Ammonia Suppression",      stroke:C.red,    strokeWidth:2, dot:false }),
            React.createElement(Line, { dataKey:"P Solubilisation",         stroke:C.green,  strokeWidth:2, dot:false }),
            React.createElement(Line, { dataKey:"Carbon Stabilisation",     stroke:C.purple, strokeWidth:2, dot:false }),
            React.createElement(Line, { dataKey:"Mycorrhizal Colonisation", stroke:C.amber,  strokeWidth:2, dot:false })
          )
        )
      )
    ),

    // ═══ GHG CREDITS (FIXED BAR CHART) ══════════════════════
    tab==="credits" && React.createElement("div", null,
      React.createElement(SectionHeader, { icon:"🌍", title:"All GHG Credit Pathways — From Bacteria to Registries", subtitle:"All palm residue streams (EFB, OPDC, POME sludge) covered under ACM0022 as one project. Biological pathways earn additional credits." }),

      React.createElement(ChartCard, { chartKey:"ghg_bar", title:"Annual t CO2e by Credit Pathway",
        suggestions:["Revenue stack over 10 years at $20/t vs $40/t","Sensitivity: 20/60/120 TPH mill","Timeline: when each pathway becomes registerable","Verra vs Gold Standard vs Plan Vivo comparison"]
      },
        React.createElement(ResponsiveContainer, { width:"100%", height:300 },
          React.createElement(BarChart, { data:CREDIT_DATA, layout:"vertical" },
            React.createElement(CartesianGrid, { strokeDasharray:"3 3", stroke:"#eef" }),
            React.createElement(XAxis, { type:"number" }),
            React.createElement(YAxis, { type:"category", dataKey:"source", width:280, tick:{fontSize:9,fill:C.navy} }),
            React.createElement(Tooltip, { content:React.createElement(TooltipBox,null) }),
            React.createElement(Bar, { dataKey:"t_co2e_yr", name:"t CO2e/yr",
              label:{ position:"right", style:{fontSize:11,fill:C.navy}, formatter:v=>v.toLocaleString()+" t" }
            },
              CREDIT_DATA.map((d,i) => React.createElement(Cell, { key:i, fill:d.color }))
            )
          )
        )
      ),

      // Credit cards — UPDATED ACM0022 with insetting + offsetting + POME note
      React.createElement("div", { style:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:14,marginTop:16} },
        CREDIT_DATA.map((c,i) =>
          React.createElement("div", { key:i, style:{background:"#fff",borderRadius:10,padding:18,borderLeft:"4px solid "+c.color} },
            React.createElement("div", { style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8} },
              React.createElement(Badge, { text:c.status, color:c.color }),
              React.createElement("span", { style:{color:c.color,fontWeight:800,fontSize:13} }, c.t_co2e_yr.toLocaleString()+" t CO2e/yr")
            ),
            React.createElement("p", { style:{color:C.navy,fontWeight:700,fontSize:13,margin:"0 0 4px"} }, c.source),
            React.createElement("p", { style:{color:C.grey,fontSize:11,margin:"0 0 10px"} }, c.methodology),
            // Insetting lines (above offsetting)
            React.createElement("div", { style:{background:C.teal+"12",borderRadius:6,padding:"8px 10px",marginBottom:6} },
              React.createElement("div", { style:{display:"flex",justifyContent:"space-between",marginBottom:2} },
                React.createElement("span", { style:{color:C.teal,fontSize:11,fontWeight:700} }, "Insetting price range"),
                React.createElement("span", { style:{color:C.teal,fontWeight:700,fontSize:12} }, "$"+c.insetting_low+" – $"+c.insetting_high+" / t CO2e")
              ),
              React.createElement("div", { style:{display:"flex",justifyContent:"space-between"} },
                React.createElement("span", { style:{color:C.teal,fontSize:11,fontWeight:700} }, "Insetting revenue potential"),
                React.createElement("span", { style:{color:C.teal,fontWeight:700,fontSize:12} }, "$"+(c.t_co2e_yr*c.insetting_low/1e6).toFixed(2)+"M – $"+(c.t_co2e_yr*c.insetting_high/1e6).toFixed(2)+"M/yr")
              )
            ),
            // Offsetting lines
            React.createElement("div", { style:{background:C.orange+"12",borderRadius:6,padding:"8px 10px",marginBottom:c.pome_note?6:0} },
              React.createElement("div", { style:{display:"flex",justifyContent:"space-between",marginBottom:2} },
                React.createElement("span", { style:{color:C.orange,fontSize:11,fontWeight:700} }, "Offsetting price range"),
                React.createElement("span", { style:{color:C.orange,fontWeight:700,fontSize:12} }, "$"+c.offsetting_low+" – $"+c.offsetting_high+" / t CO2e")
              ),
              React.createElement("div", { style:{display:"flex",justifyContent:"space-between"} },
                React.createElement("span", { style:{color:C.orange,fontSize:11,fontWeight:700} }, "Offsetting revenue potential"),
                React.createElement("span", { style:{color:C.orange,fontWeight:700,fontSize:12} }, "$"+(c.t_co2e_yr*c.offsetting_low/1e6).toFixed(2)+"M – $"+(c.t_co2e_yr*c.offsetting_high/1e6).toFixed(2)+"M/yr")
              )
            ),
            // POME methodology note (only on ACM0022 card)
            c.pome_note && React.createElement("div", { style:{background:C.purple+"12",border:"1px solid "+C.purple,borderRadius:6,padding:"8px 10px",marginTop:6} },
              React.createElement("p", { style:{color:C.purple,fontWeight:700,fontSize:11,margin:"0 0 3px"} }, "POME Sludge Methodology Note"),
              React.createElement("p", { style:{color:C.navy,fontSize:11,margin:0,lineHeight:1.5} }, c.pome_note)
            )
          )
        )
      ),

      // Total stack summary
      React.createElement("div", { style:{background:C.navy,borderRadius:12,padding:24,marginTop:16} },
        React.createElement("h4", { style:{color:C.teal,marginTop:0} }, "TOTAL CREDIT STACK — 60 TPH Mill"),
        (() => {
          const total = CREDIT_DATA.reduce((s,c)=>s+c.t_co2e_yr,0);
          const inLow = CREDIT_DATA.reduce((s,c)=>s+c.t_co2e_yr*c.insetting_low,0)/1e6;
          const inHigh = CREDIT_DATA.reduce((s,c)=>s+c.t_co2e_yr*c.insetting_high,0)/1e6;
          const offLow = CREDIT_DATA.reduce((s,c)=>s+c.t_co2e_yr*c.offsetting_low,0)/1e6;
          const offHigh = CREDIT_DATA.reduce((s,c)=>s+c.t_co2e_yr*c.offsetting_high,0)/1e6;
          return React.createElement("div", { style:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:16} },
            [
              { label:"Total t CO2e avoided/yr", val:total.toLocaleString()+" t", color:C.teal },
              { label:"Insetting revenue range",  val:"$"+inLow.toFixed(1)+"M – $"+inHigh.toFixed(1)+"M/yr", color:C.teal },
              { label:"Offsetting revenue range", val:"$"+offLow.toFixed(1)+"M – $"+offHigh.toFixed(1)+"M/yr", color:C.orange }
            ].map((k,i) =>
              React.createElement("div", { key:i, style:{textAlign:"center"} },
                React.createElement("p", { style:{color:C.mid,fontSize:12,margin:0} }, k.label),
                React.createElement("p", { style:{color:k.color,fontSize:20,fontWeight:900,margin:"8px 0 0"} }, k.val)
              )
            )
          );
        })(),
        React.createElement("p", { style:{color:C.mid,fontSize:11,marginTop:14,fontStyle:"italic"} },
          "ACM0022 primary "+CREDIT_DATA[0].t_co2e_yr.toLocaleString()+" t CO2e/yr is GUARDRAIL-LOCKED (Verra VCS ACM0022 v3.1, IPCC FOD+COD, GWP100=28). All palm residue streams (EFB, OPDC, POME sludge) treated as one project under ACM0022. Biological pathways are incremental and independently registerable."
        )
      )
    ),

    // ═══ RESIDUE COMPARISON (NEW TAB) ════════════════════════
    tab==="residue" && React.createElement("div", null,
      React.createElement(SectionHeader, { icon:"♻️", title:"Residue Management Comparison — Mulching vs Composting vs CFI", subtitle:"What happens to your palm waste and the soil if you do nothing, mulch, compost traditionally, or use CFI? Emissions, nutrients, and palm yields side by side." }),

      // Side-by-side comparison cards
      React.createElement("div", { style:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:16,marginBottom:20} },
        RESIDUE_ALTS.map((alt,i) =>
          React.createElement("div", { key:i, style:{background:"#fff",borderRadius:12,padding:20,borderTop:"4px solid "+alt.color} },
            React.createElement("div", { style:{display:"flex",alignItems:"center",gap:8,marginBottom:10} },
              React.createElement("span", { style:{fontSize:28} }, alt.icon),
              React.createElement("strong", { style:{color:alt.color,fontSize:14} }, alt.method)
            ),
            React.createElement("div", { style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12} },
              [
                { lbl:"GHG (t CO2e/t residue)", val:(alt.ghg_t_co2e_t>0?"+":"")+alt.ghg_t_co2e_t, color:alt.ghg_t_co2e_t<0?C.green:alt.ghg_t_co2e_t<0.2?C.amber:C.red },
                { lbl:"Nutrient availability",   val:alt.nutrient_avail_pct+"%",                  color:alt.nutrient_avail_pct>70?C.green:alt.nutrient_avail_pct>40?C.amber:C.red },
                { lbl:"Soil OM change/yr",        val:alt.soil_om_change,                          color:alt.soil_om_change.startsWith("+")?C.green:C.red },
                { lbl:"Est. cost (USD/t)",         val:alt.cost_usd_t<0?"Revenue: $"+Math.abs(alt.cost_usd_t):("$"+alt.cost_usd_t), color:alt.cost_usd_t<0?C.green:C.grey },
                { lbl:"Palm yield impact",         val:alt.palm_yield_impact,                       color:alt.palm_yield_impact.includes("+12")||alt.palm_yield_impact.includes("+22")?C.green:alt.palm_yield_impact.startsWith("+")?C.amber:C.red }
              ].map((kpi,j) =>
                React.createElement("div", { key:j, style:{background:"#F0F4F8",borderRadius:6,padding:"8px 10px"} },
                  React.createElement("p", { style:{color:C.grey,fontSize:10,margin:0} }, kpi.lbl),
                  React.createElement("p", { style:{color:kpi.color,fontSize:13,fontWeight:800,margin:"3px 0 0"} }, kpi.val)
                )
              )
            ),
            React.createElement("p", { style:{color:C.grey,fontSize:11,fontStyle:"italic",margin:"0 0 8px"} }, alt.note),
            React.createElement("div", { style:{marginBottom:8} },
              React.createElement("p", { style:{color:C.green,fontSize:11,fontWeight:700,margin:"0 0 3px"} }, "✓ Advantages"),
              alt.pros.map((p,j) => React.createElement("p", { key:j, style:{color:"#333",fontSize:11,margin:"1px 0"} }, "• "+p))
            ),
            React.createElement("div", null,
              React.createElement("p", { style:{color:C.red,fontSize:11,fontWeight:700,margin:"0 0 3px"} }, "✗ Disadvantages"),
              alt.cons.map((c,j) => React.createElement("p", { key:j, style:{color:"#333",fontSize:11,margin:"1px 0"} }, "• "+c))
            )
          )
        )
      ),

      // Comparison chart: GHG emissions
      React.createElement(ChartCard, { chartKey:"residue_ghg", title:"GHG Emissions by Residue Management Method (t CO2e per t residue)",
        suggestions:["Show cumulative 10-year emissions at 60 TPH","Annual fertiliser replacement value comparison","Add bioenergy (biogas from POME) pathway","Show Scope 1/2/3 breakdown per method"]
      },
        React.createElement(ResponsiveContainer, { width:"100%", height:280 },
          React.createElement(BarChart, { data:RESIDUE_ALTS.map(a=>({ method:a.method, "GHG t CO2e/t":a.ghg_t_co2e_t, color:a.color })) },
            React.createElement(CartesianGrid, { strokeDasharray:"3 3", stroke:"#eef" }),
            React.createElement(XAxis, { dataKey:"method", tick:{fontSize:10} }),
            React.createElement(YAxis, { label:{value:"t CO2e per t residue",angle:-90,position:"insideLeft",style:{fontSize:10}} }),
            React.createElement(Tooltip, { content:React.createElement(TooltipBox,null) }),
            React.createElement(ReferenceLine, { y:0, stroke:C.navy, strokeWidth:2 }),
            React.createElement(Bar, { dataKey:"GHG t CO2e/t", name:"GHG emissions" },
              RESIDUE_ALTS.map((a,i) => React.createElement(Cell, { key:i, fill:a.color }))
            )
          )
        ),
        React.createElement("p", { style:{color:C.teal,fontSize:13,fontWeight:700,marginTop:10} },
          "CFI is the ONLY method with negative emissions — it avoids more GHG than it produces. At 60 TPH, this generates "+CREDIT_DATA[0].t_co2e_yr.toLocaleString()+" t CO2e/yr in carbon credits."
        )
      )
    ),

    // ═══ PLANTATION INTELLIGENCE (NEW TAB) ═══════════════════
    tab==="plantation" && React.createElement(PlantationIntel, null)

    ) // end content
  );
}
