import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import SiteSetup from "./pages/SiteSetup";
import LoginPage from "./LoginPage";
import { supabase } from "@/integrations/supabase/client";
import CFI_PriceRefreshBadge from "@/components/CFI_PriceRefreshBadge";
import CFI_ValueCalculator from "@/components/CFI_ValueCalculator";
import CFI_SoilAcidity_Lookup from "@/CFI_SoilAcidity_Lookup";
import CFI_SoilAcidity_ProfileCard from "@/components/CFI_SoilAcidity_ProfileCard";


// ─── SUPABASE LIVE CONNECTION ─────────────────────────────────────────────────
const SUPA_URL = "https://lcpbtnipkvrmuwllymfw.supabase.co";
const SUPA_KEY = "sb_publishable_xJ9N0RaYXbY07m8DvtG_zQ_-m8Zzm23";

function supaFetch(table) {
  return fetch(SUPA_URL + "/rest/v1/" + table + "?order=last_updated.desc&limit=200", {
    headers: {
      "apikey": SUPA_KEY,
      "Authorization": "Bearer " + SUPA_KEY,
      "Content-Type": "application/json"
    }
  }).then(function(r){ if(!r.ok) throw new Error("HTTP "+r.status); return r.json(); });
}

function supaInsert(table, record) {
  return fetch(SUPA_URL + "/rest/v1/" + table, {
    method: "POST",
    headers: {
      "apikey": SUPA_KEY,
      "Authorization": "Bearer " + SUPA_KEY,
      "Content-Type": "application/json",
      "Prefer": "resolution=ignore-duplicates,return=minimal"
    },
    body: JSON.stringify(record)
  }).then(function(r){
    if(!r.ok) return r.text().then(function(t){ throw new Error(t); });
    return true;
  });
}

// ─── CFI DESIGN SYSTEM v3 — COLOUR TOKENS ────────────────────────────────────
// Locked: March 2026. Change via Admin Panel only.
const C = {
  navy:      "#060C14",
  navyMid:   "#0A1628",
  navyCard:  "#111E33",
  navyField: "#142030",
  navyDeep:  "#0C1E33",
  teal:      "#40D7C5",
  tealDim:   "rgba(64,215,197,0.12)",
  tealBdr:   "rgba(64,215,197,0.60)",
  amber:     "#F5A623",
  green:     "#00A249",
  greenDim:  "rgba(0,162,73,0.13)",
  grey:      "#A8BDD0",
  greyLt:    "rgba(168,189,208,0.55)",
  white:     "#FFFFFF",
  bdrCalc:   "rgba(139,160,180,0.18)",
  // Legacy aliases kept for backward compat
  pageBg:        "#060C14",
  appBg:         "#0A1628",
  inputSectionBg:"#111E33",
  infoSectionBg: "#111E33",
  resultSectionBg:"#111E33",
  alertSectionBg:"#060C14",
  sectionBorder: "rgba(64,215,197,0.13)",
  innerZoneBg:   "#060C14",
  inputBoxBg:    "#142030",
  inputBoxBorder:"rgba(139,160,180,0.22)",
  alertBannerBg: "rgba(232,64,64,0.15)",
  tealDk: "#009E8C",
  tealLt: "#5EEADA",
  amberLt:"#FFD080",
  red:    "#E84040",
  blue:   "#4A9EDB",
  purple: "#9B59B6",
  greyMd: "#A8B8C7",
  greyLtSolid: "#C4D3E0",
  pastelGreen:"#A8E6C1",
  navyLt: "#1A3A5C",
};

// ─── CFI DESIGN SYSTEM v3 — STYLE TOKENS ────────────────────────────────────
const S = {
  // ── Section wrappers (4 types) ──
  secInput:  { background:C.inputSectionBg,  border:`1.5px solid ${C.sectionBorder}`, borderRadius:8, marginBottom:16, overflow:"hidden" },
  secInfo:   { background:C.infoSectionBg,   border:`1.5px solid ${C.sectionBorder}`, borderRadius:8, marginBottom:16, overflow:"hidden" },
  secResult: { background:C.resultSectionBg, border:`1.5px solid ${C.sectionBorder}`, borderRadius:8, marginBottom:16, overflow:"hidden" },
  secAlert:  { background:C.alertSectionBg,  border:`1.5px solid ${C.sectionBorder}`, borderRadius:8, marginBottom:16, overflow:"hidden" },
  // ── Section header ──
  secHeader: { padding:"10px 14px", borderBottom:"1px solid rgba(255,255,255,0.05)", display:"flex", alignItems:"center", justifyContent:"space-between" },
  secTitle:  { fontFamily:"'Syne', sans-serif", fontWeight:700, fontSize:18, letterSpacing:"0.02em" },
  secBadge:  (c) => ({ fontFamily:"'Syne', sans-serif", fontWeight:700, fontSize:12, padding:"2px 8px", borderRadius:4, background:c+"22", color:c }),
  secBody:   { padding:"12px 14px" },
  // ── Inner black input zone (Type A only) ──
  innerZone: { background:C.innerZoneBg, borderRadius:6, padding:"10px 12px", marginBottom:8 },
  // ── Field labels ──
  fldLabel:  { fontFamily:"'DM Sans', sans-serif", fontWeight:600, fontSize:13, color:C.grey },
  fldSub:    { fontFamily:"'DM Sans', sans-serif", fontWeight:400, fontSize:11, color:C.grey, marginTop:2 },
  fldInput:  { background:C.inputBoxBg, border:`1.5px solid ${C.inputBoxBorder}`, borderRadius:5,
               color:C.amber, fontFamily:"'DM Sans', sans-serif", fontWeight:600, fontSize:14,
               padding:"5px 10px", width:"100%", outline:"none" },
  calcLabel: { fontFamily:"'DM Sans', sans-serif", fontWeight:600, fontSize:16, color:C.grey },
  calcVal:   { fontFamily:"'DM Sans', sans-serif", fontWeight:700, fontSize:16, color:C.green },
  // ── Hero numbers ──
  heroNum:    { fontFamily:"'DM Sans', sans-serif", fontWeight:700, fontSize:20, color:C.amber },
  heroUnit:   { fontFamily:"'DM Sans', sans-serif", fontSize:11, color:C.greyMd, marginTop:3 },
  heroFormula:{ fontFamily:"'DM Sans', sans-serif", fontSize:9, color:C.greyMd, marginTop:4 },
  // ── Table styles ──
  tblHeader: { fontFamily:"'DM Sans', sans-serif", fontWeight:700, fontSize:12, color:C.greyMd, textAlign:"center", padding:"5px 6px" },
  tblStream: { fontFamily:"'DM Sans', sans-serif", fontWeight:700, fontSize:11, color:C.amber, textAlign:"center", padding:"5px 6px" },
  tblData:   { fontFamily:"'DM Sans', sans-serif", fontWeight:400, fontSize:11, color:C.greyMd, textAlign:"center", padding:"5px 6px" },
  tblTotal:  { fontFamily:"'DM Sans', sans-serif", fontWeight:700, fontSize:14, color:C.pastelGreen, textAlign:"center", padding:"5px 6px" },
  // ── Alert banners ──
  alertBanner:(c) => ({ background:C.alertBannerBg, border:`1.5px solid ${C.sectionBorder}`, borderRadius:6,
                         padding:"9px 13px", marginBottom:7, fontFamily:"'DM Sans', sans-serif", fontSize:13, color:c }),
  // ── Legacy aliases (backward compat) ──
  card:    { background:C.infoSectionBg, borderRadius:8, padding:"16px", marginBottom:12 },
  hdr:     { background:C.inputSectionBg, borderRadius:6, padding:"10px 14px", marginBottom:10,
             display:"flex", alignItems:"center", gap:8 },
  label:   { color:C.grey, fontSize:11, fontFamily:"'DM Sans', sans-serif", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:2 },
  val:     { color:C.white, fontSize:14, fontWeight:600, fontFamily:"'DM Sans', sans-serif" },
  input:   { background:'#000', border:'1.5px solid rgba(64,215,197,0.60)', borderRadius:7, color:C.amber,
             padding:"8px 10px", fontSize:14, fontWeight:800, width:"100%", outline:"none", fontFamily:"'DM Sans', sans-serif", height:38, textAlign:"center", boxSizing:"border-box" },
  inputAmb:{ background:'#000', border:'1.5px solid rgba(245,166,35,0.50)', borderRadius:7, color:C.amberLt,
             padding:"8px 10px", fontSize:14, fontWeight:800, width:"100%", outline:"none", fontFamily:"'DM Sans', sans-serif", height:38, textAlign:"center", boxSizing:"border-box" },
  inputBlu:{ background:'#000', border:'1.5px solid rgba(64,215,197,0.60)', borderRadius:7, color:C.amber,
             padding:"8px 10px", fontSize:14, fontWeight:800, width:"100%", outline:"none", fontFamily:"'DM Sans', sans-serif", height:38, textAlign:"center", boxSizing:"border-box" },
  badge:   (c) => ({ background:c+"22", border:`1px solid ${c}55`, borderRadius:12, padding:"2px 8px",
                     color:c, fontSize:12, fontWeight:700, display:"inline-block", fontFamily:"'Syne', sans-serif" }),
  row:     { display:"flex", gap:10, marginBottom:8 },
  col:     { flex:1 },
  divider: { border:"none", borderTop:`1px solid ${C.sectionBorder}33`, margin:"12px 0" },
  tab:     (active) => ({
    padding:"6px 14px", cursor:"pointer", borderRadius:"6px 6px 0 0",
    background:active ? C.tealDk : C.inputSectionBg,
    color:active ? C.white : C.grey,
    fontSize:12, fontWeight:700, letterSpacing:"0.04em",
    fontFamily:"'Syne', sans-serif",
    border:`1px solid ${active ? C.teal : "transparent"}`,
    borderBottom:"none", transition:"all 0.15s"
  }),
};

// ─── INFO DOT — clickable ? bubble for inline data context ───────────────────
function InfoDot({summary, logic, sources, color}) {
  const [open, setOpen] = useState(false);
  const dotColor = color || "#4A9EDB";
  return (
    React.createElement("span", {style:{position:"relative",display:"inline-block",verticalAlign:"middle",marginLeft:4}},
      React.createElement("button", {
        onClick: function(e){ e.stopPropagation(); setOpen(!open); },
        style:{
          width:15, height:15, borderRadius:"50%", border:"1px solid "+dotColor+"88",
          background: open ? dotColor+"44" : dotColor+"22",
          color: dotColor, fontSize:9, fontWeight:800, cursor:"pointer",
          lineHeight:"13px", textAlign:"center", padding:0, display:"inline-flex",
          alignItems:"center", justifyContent:"center"
        }
      }, "?"),
      open && React.createElement("div", {
        style:{
          position:"absolute", zIndex:9999, bottom:"calc(100% + 6px)", left:"50%",
          transform:"translateX(-50%)", width:240,
          background:C.appBg, border:"1px solid "+dotColor+"66",
          borderRadius:8, padding:"10px 12px", boxShadow:"0 4px 20px #000a",
          pointerEvents:"auto"
        },
        onClick: function(e){ e.stopPropagation(); }
      },
        summary && React.createElement("div", {style:{fontSize:10,color:"#e8f0fa",lineHeight:1.6,marginBottom:6}}, summary),
        logic && React.createElement("div", null,
          React.createElement("div", {style:{fontSize:9,fontWeight:700,color:dotColor,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:3}},"Logic"),
          React.createElement("div", {style:{fontSize:9,color:"#a0b8d0",fontFamily:"'DM Sans', sans-serif",lineHeight:1.5,background:C.infoSectionBg,borderRadius:4,padding:"4px 6px"}}, logic)
        ),
        sources && sources.length > 0 && React.createElement("div", {style:{marginTop:6}},
          React.createElement("div", {style:{fontSize:9,fontWeight:700,color:dotColor,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:3}},"Sources"),
          sources.map(function(s,i){
            return React.createElement("a", {
              key:i, href:s.url, target:"_blank", rel:"noopener noreferrer",
              style:{display:"block",fontSize:9,color:"#5eaad4",textDecoration:"underline",lineHeight:1.6}
            }, s.label);
          })
        ),
        React.createElement("button", {
          onClick: function(){ setOpen(false); },
          style:{position:"absolute",top:5,right:7,background:"none",border:"none",color:"#8ba0b4",cursor:"pointer",fontSize:11,padding:0}
        }, "✕")
      )
    )
  );
}

// ─── FIELD COMPONENTS ─────────────────────────────────────────────────────────
const Lbl = ({t, unit}) => (
  <div style={S.label}>{t}{unit && <span style={{color:C.teal,marginLeft:4}}>[{unit}]</span>}</div>
);

const BluField = ({label, unit, value, onChange, disabled, note}) => {
  const [local, setLocal] = useState(value);
  useState(() => { setLocal(value); }, [value]);
  return (
    <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', background:'#142030', border:'1px solid rgba(168,189,208,0.12)', borderRadius:8, padding:'10px 14px', gap:12, minHeight:48}}>
      <span style={{flex:1, fontSize:14, fontWeight:700, color:'#A8BDD0', whiteSpace:'nowrap', fontFamily:"'DM Sans', sans-serif"}}>{label}</span>
      <div style={{display:'flex', alignItems:'center', gap:8, flexShrink:0}}>
        <input style={disabled ? {...S.input, background:'#0a0a0a', color:C.teal, cursor:"not-allowed", width:76} : {...S.input, width:76}}
          value={local}
          onChange={e => setLocal(e.target.value)}
          onBlur={e => { if(onChange) onChange(e.target.value); }}
          disabled={!!disabled}/>
        {unit && <span style={{fontSize:11, fontFamily:"'DM Sans', sans-serif", color:'rgba(168,189,208,0.75)', whiteSpace:'nowrap', minWidth:42}}>{unit}</span>}
      </div>
      {note && <div style={{color:C.grey,fontSize:10,marginTop:2}}>{note}</div>}
    </div>
  );
};

const AmbField = ({label, unit, value, onChange, note}) => {
  const [local, setLocal] = useState(value);
  useState(() => { setLocal(value); }, [value]);
  return (
    <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', background:'#142030', border:'1px solid rgba(168,189,208,0.12)', borderRadius:8, padding:'10px 14px', gap:12, minHeight:48}}>
      <span style={{flex:1, fontSize:14, fontWeight:700, color:'#A8BDD0', whiteSpace:'nowrap', fontFamily:"'DM Sans', sans-serif"}}>{label}</span>
      <div style={{display:'flex', alignItems:'center', gap:8, flexShrink:0}}>
        <input style={{...S.inputAmb, width:76}}
          value={local}
          onChange={e => setLocal(e.target.value)}
          onBlur={e => { if(onChange) onChange(e.target.value); }}/>
        {unit && <span style={{fontSize:11, fontFamily:"'DM Sans', sans-serif", color:'rgba(168,189,208,0.75)', whiteSpace:'nowrap', minWidth:42}}>{unit}</span>}
      </div>
      {note && <div style={{color:C.amber,fontSize:10,marginTop:2}}> {note}</div>}
    </div>
  );
};

const CalcField = ({label, unit, value, note}) => (
  <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', background:'#142030', border:'1px solid rgba(168,189,208,0.12)', borderRadius:8, padding:'10px 14px', gap:12, minHeight:48}}>
    <span style={{flex:1, fontSize:13, fontWeight:700, color:'#A8BDD0', fontFamily:"'DM Sans', sans-serif"}}>{label}</span>
    <div style={{display:'flex', alignItems:'center', gap:6, flexShrink:0}}>
      <span style={{background:'#000', border:'1.5px solid rgba(64,215,197,0.60)', borderRadius:7, color:'#F5A623', fontFamily:"'DM Sans', sans-serif", fontSize:14, fontWeight:800, padding:'6px 10px', minWidth:60, height:34, display:'inline-flex', alignItems:'center', justifyContent:'center', whiteSpace:'nowrap'}}>
        {value}
      </span>
      {unit && <span style={{fontSize:10, fontFamily:"'DM Sans', sans-serif", color:'rgba(168,189,208,0.75)', whiteSpace:'nowrap'}}>{unit}</span>}
    </div>
  </div>
);

const Halt = ({msg}) => (
  <div style={{background:C.red+"22", border:`1px solid ${C.red}`, borderRadius:6,
               padding:"8px 12px", color:C.red, fontSize:12, fontWeight:700, marginTop:6}}>
    🛑 HALT — {msg}
  </div>
);

const Alert = ({msg, type="warn"}) => {
  const col = type==="warn" ? C.amber : type==="ok" ? C.green : C.red;
  return (
    <div style={{background:col+"18", border:`1px solid ${col}55`, borderRadius:6,
                 padding:"7px 12px", color:col, fontSize:12, marginTop:6}}>
      {type==="warn"?" ":type==="ok"?" ":" "}{msg}
    </div>
  );
};

const SectionHdr = ({icon, title, color=C.teal}) => (
  <div style={{...S.hdr, borderLeft:`3px solid ${color}`}}>
    <span style={{fontSize:16}}>{icon}</span>
    <span style={{color, fontWeight:800, fontSize:13, letterSpacing:"0.05em"}}>{title}</span>
  </div>
);

const KPI = ({label, value, unit, color=C.teal}) => (
  <div style={{background:C.inputSectionBg, borderRadius:8, padding:"12px 14px", textAlign:"center",
               border:`1px solid ${color}33`}}>
    <div style={{color:C.grey, fontSize:10, textTransform:"uppercase", letterSpacing:"0.1em"}}>{label}</div>
    <div style={{color, fontSize:22, fontWeight:800, margin:"4px 0"}}>{value}</div>
    <div style={{color:C.grey, fontSize:10}}>{unit}</div>
  </div>
);

const Badge = ({text, color}) => (
  <span style={{background:color+"20", border:`1px solid ${color}50`, borderRadius:10,
    padding:"2px 9px", color, fontSize:10, fontWeight:800, letterSpacing:"0.04em",
    display:"inline-block", whiteSpace:"nowrap"}}>
    {text}
  </span>
);

const Divider = ({color}) => (
  <hr style={{border:"none", borderTop:`1px solid ${color||C.inputSectionBg}`, margin:"14px 0"}}/>
);

const Card = ({children, style={}}) => (
  <div style={{background:C.infoSectionBg, border:"1px solid rgba(255,255,255,0.06)",
    borderRadius:10, padding:20, ...style}}>
    {children}
  </div>
);

const Warn = ({msg, type="warn"}) => {
  const col = type==="warn"?C.amber : type==="ok"?C.green : C.red;
  const icon = type==="warn"?"" : type==="ok"?"✓" : "✕";
  return (
    <div style={{background:col+"14", border:`1px solid ${col}44`,
      borderLeft:`3px solid ${col}`, borderRadius:6,
      padding:"8px 13px", color:col, fontSize:11,
      display:"flex", alignItems:"flex-start", gap:8, marginTop:8}}>
      <span style={{fontWeight:800, fontSize:12, marginTop:1, flexShrink:0}}>{icon}</span>
      <span style={{lineHeight:1.5}}>{msg}</span>
    </div>
  );
};

const PillToggle = ({options, value, onChange, color=C.teal}) => (
  <div style={{display:"flex", background:C.pageBg, borderRadius:8, padding:3, gap:3}}>
    {options.map(o=>(
      <div key={String(o.v)} onClick={()=>onChange(o.v)}
        style={{flex:1, padding:"6px 10px", borderRadius:6, cursor:"pointer", textAlign:"center",
          background:value===o.v?color+"28":"transparent",
          border:`1px solid ${value===o.v?color+"66":"transparent"}`,
          transition:"all 0.15s"}}>
        <div style={{color:value===o.v?color:C.grey, fontSize:11, fontWeight:700}}>{o.l}</div>
        {o.sub&&<div style={{color:C.grey, fontSize:9, marginTop:2}}>{o.sub}</div>}
      </div>
    ))}
  </div>
);

const ResidueCard = ({label, active, locked, onClick, sublabel}) => (
  <div onClick={locked?undefined:onClick}
    style={{background:active?C.teal+"18":C.pageBg,
      border:`1px solid ${active?C.teal+"66":"rgba(255,255,255,0.07)"}`,
      borderTop:`2px solid ${active?C.teal:"rgba(255,255,255,0.07)"}`,
      borderRadius:8, padding:"10px 14px",
      cursor:locked?"not-allowed":"pointer", transition:"all 0.15s"}}>
    <div style={{display:"flex", alignItems:"center", justifyContent:"space-between"}}>
      <span style={{color:active?C.teal:C.grey, fontWeight:800, fontSize:12}}>{label}</span>
      <div style={{width:14, height:14, borderRadius:"50%",
        background:active?C.teal:"transparent",
        border:`2px solid ${active?C.teal:C.grey+"66"}`, transition:"all 0.15s"}}/>
    </div>
    {sublabel&&<div style={{color:C.grey, fontSize:9, marginTop:4}}>{sublabel}</div>}
    {locked&&<div style={{color:C.grey, fontSize:9, marginTop:3, fontStyle:"italic"}}>locked — always active</div>}
  </div>
);

const FE_COLOR = {LOW:C.green, MODERATE:C.teal, HIGH:C.amber, CRITICAL:C.red, Untested:C.grey};

const LABEL_STYLE = { display:"block", color:C.grey, fontSize:10, fontWeight:700,
  textTransform:"uppercase", letterSpacing:"0.09em", marginBottom:5 };


// ─── SOIL TYPES DATA ──────────────────────────────────────────────────────────
const SOILS = [
  {id:"inceptisol", name:"Inceptisols", pct:"39%", ph:"4.1", cec:"15.4", desc:"Best fertility, well-drained",              nAdj:-0.40, pAdj:-0.50, dmppEfficacy:0.35, dmppNote:"Well-drained mineral — moderate N₂O. DMPP 30–40% suppression. Good response."},
  {id:"ultisol",    name:"Ultisols",    pct:"24%", ph:"4.5", cec:"8.2",  desc:"Clay-rich, acidic, low base saturation",    nAdj:0,     pAdj:0,     dmppEfficacy:0.45, dmppNote:"Clay + periodic waterlogging = HIGH N₂O risk. DMPP most effective here: 40–50% suppression. PRIORITY soil."},
  {id:"oxisol",     name:"Oxisols",     pct:"8%",  ph:"4.4", cec:"5.0",  desc:"Fe/Al oxides, low P retention",             nAdj:0.10,  pAdj:0.20,  dmppEfficacy:0.38, dmppNote:"High Fe/Al moderately slows nitrifiers. DMPP 35–40% suppression. Also reduces P-fixation interaction."},
  {id:"histosol",   name:"Histosols",   pct:"7%",  ph:"3.8", cec:"35.0", desc:"Peat/organic, drainage issues",             nAdj:-0.80, pAdj:-0.70, dmppEfficacy:0.22, dmppNote:"Peat: N₂O from DENITRIFICATION not nitrification — DMPP less effective (20–25%). Frass N already 80% reduced on Histosols."},
  {id:"spodosol",   name:"Spodosols",   pct:"—",   ph:"4.77",cec:"2.0",  desc:"Sandy, lowest fertility",                   nAdj:0.20,  pAdj:0.15,  dmppEfficacy:0.30, dmppNote:"Sandy, fast-draining — lower denitrification. DMPP 25–35% suppression. Improves N retention in sandy profile."},
]

const AG_TIERS = [
  {id:"vgam", name:"VGAM — Very Good AG Management", uplift:1.0},
  {id:"gam",  name:"GAM — Good AG Management",       uplift:0.85},
  {id:"poor", name:"Poor AG Management",              uplift:0.65},
  {id:"abandoned", name:"Abandoned",                 uplift:0.40},
];

// ─── NUTRIENT LEDGER COMPONENT ────────────────────────────────────────────────
// Shows per-stage NPK profile, mass flow, soil-adjusted effective values & C:N
// ─── BLEND OPTIMISER — REVERSE SOLVER ────────────────────────────────────────
// Calculates POME inclusion % and/or PKE dose required to hit a target C:N and/or CP%.
// Math: weighted C:N = Σ(Ni × CNi) / Σ(Ni); CP% = N% × 4.67 (GR-10 — true protein factor)
// Two-variable linear system solved via Cramer's rule for dual-target mode.
function BlendOptimiser({ efbDMpd, opdcDMreq, pomeSludgeMaxPct, pomeSludgeNatTPD,
                          pomeSludgeActMC, pomeSludgeEnabled, pkeEnabled,
                          currentCN, currentCP, upS0 }) {

  const [targetCN,  setTargetCN]  = useState(22);
  const [targetCP,  setTargetCP]  = useState("");
  const [mode,      setMode]      = useState("dual");   // pome | pke | dual
  const [applyMsg,  setApplyMsg]  = useState("");

  // ── BASE VALUES (EFB + OPDC only, no POME/PKE) ──
  const baseDM   = efbDMpd + opdcDMreq;                      // t DM/day
  const baseN    = efbDMpd * 8.5 + opdcDMreq * 26.0;           // kg N/day — EFB N=0.85% measured; OPDC N=2.60% locked (measured range 2.38–2.93%)
  const baseC    = efbDMpd * 8.5 * 60 + opdcDMreq * 26.0 * 20; // C-numerator

  // ── STREAM CONSTANTS — N coefficients: plant residues use ÷4.67; PKE = feed ingredient uses ÷6.25 ──
  // POME: N=17.6 kg/t DM (1.76% measured canonical), C:N=15
  // PKE:  N=28.8 kg/t DM (CP 18% / 6.25 = 2.88% — FEED INGREDIENT, N×6.25 correct here)
  const POME_N = 17.6, POME_CN = 15, POME_C = POME_N * POME_CN; // 264
  const PKE_N  = 28.8, PKE_CN  = 15, PKE_C  = PKE_N  * PKE_CN;  // 432 — feed basis ÷6.25
  const PKE_FW_PER_DM = 1 / 0.88;   // t FW per t DM
  const PKE_PRICE_PER_FW = 160;      // $/t FW

  // Max available POME DM (capped by Fe limit)
  const pomeMaxDM = pomeSludgeNatTPD * (pomeSludgeMaxPct / 100) * (1 - pomeSludgeActMC / 100);

  const solve = useMemo(() => {
    const T_cn = parseFloat(targetCN);
    const T_cp = parseFloat(targetCP);
    const hasCN = !isNaN(T_cn) && T_cn > 0;
    const hasCP = !isNaN(T_cp) && T_cp > 0;
    if (!hasCN && !hasCP) return null;

    // Helper: given POME DM x and PKE DM y, compute result
    const calc = (x, y) => {
      const pDM = Math.max(0, x), kDM = Math.max(0, y);
      const totN = baseN + pDM * POME_N + kDM * PKE_N;
      const totC = baseC + pDM * POME_C + kDM * PKE_C;
      const totDM = baseDM + pDM + kDM;
      const cn  = totN > 0 ? totC / totN : null;
      const cpPct = totDM > 0 ? (totN / (totDM * 10)) * 4.67 : null;  // BUG-12 FIX: N×4.67 per GR-10 (was 6.25)
      const pkeFW = kDM * PKE_FW_PER_DM;
      const pkeCostDay = pkeFW * PKE_PRICE_PER_FW;
      return { pDM, kDM, pkeFW, pkeCostDay, cn, cpPct };
    };

    // ── SINGLE TARGET C:N ──
    const solveCN_pome = (T) => {
      // x = (baseC - T*baseN) / (POME_N*T - POME_C)
      const denom = POME_N * T - POME_C;
      if (Math.abs(denom) < 0.001) return null;
      return (baseC - T * baseN) / denom;
    };
    const solveCN_pke = (T) => {
      const denom = PKE_N * T - PKE_C;
      if (Math.abs(denom) < 0.001) return null;
      return (baseC - T * baseN) / denom;
    };
    // ── SINGLE TARGET CP% ──
    // cp_r = T_cp/4.67/100 × 1000 = T_cp × 2.141  (kg N per t DM target) — BUG-12 FIX: N×4.67
    const solveCPpome = (T) => {
      const r = T * 2.141;
      const denom = r - POME_N;
      if (Math.abs(denom) < 0.001) return null;
      return (baseN - r * baseDM) / (-denom);
    };
    const solveCPpke = (T) => {
      const r = T * 2.141;
      const denom = r - PKE_N;
      if (Math.abs(denom) < 0.001) return null;
      return (baseN - r * baseDM) / (-denom);
    };

    // ── DUAL TARGET (C:N + CP%) — 2×2 linear system via Cramer ──
    const solveDual = (T_cn, T_cp) => {
      const cp_r = T_cp * 1.6;
      const a1 = POME_C - T_cn * POME_N;   // coeff of x in C:N eq
      const b1 = PKE_C  - T_cn * PKE_N;    // coeff of y in C:N eq
      const c1 = T_cn * baseN - baseC;      // RHS of C:N eq (a1*x + b1*y = c1)
      const a2 = POME_N - cp_r;             // coeff of x in CP eq
      const b2 = PKE_N  - cp_r;             // coeff of y in CP eq
      const c2 = cp_r * baseDM - baseN;     // RHS of CP eq (a2*x + b2*y = c2)
      const det = a1 * b2 - a2 * b1;
      if (Math.abs(det) < 0.001) return null;
      const x = (c1 * b2 - c2 * b1) / det;
      const y = (a1 * c2 - a2 * c1) / det;
      return { x, y };
    };

    let result = null;
    let warning = "";
    let strategy = "";

    if (mode === "pome" && hasCN) {
      const x = solveCN_pome(T_cn);
      if (x === null) { result = { error: "No solution (POME C:N=15 cannot solve this target)" }; }
      else if (x < 0) { result = { error: `C:N already ≤ target. Current: ${currentCN}` }; }
      else {
        const capped = x > pomeMaxDM;
        const xUse = Math.min(x, pomeMaxDM);
        result = calc(xUse, 0);
        if (capped) warning = ` POME capped at Fe limit (${pomeSludgeMaxPct}% WW). Target C:N not fully achievable with POME alone — add PKE.`;
        strategy = "POME only";
      }
    } else if (mode === "pke" && hasCN) {
      const y = solveCN_pke(T_cn);
      if (y === null) { result = { error: "No solution — PKE C:N=15, same as POME; cannot lower C:N further than PKE allows." }; }
      else if (y < 0) { result = { error: `C:N already ≤ target. Current: ${currentCN}` }; }
      else { result = calc(0, y); strategy = "PKE only"; }
    } else if (mode === "dual" && hasCN && hasCP) {
      const sol = solveDual(T_cn, T_cp);
      if (!sol) { result = { error: "System has no unique solution — targets may be contradictory." }; }
      else {
        const { x, y } = sol;
        const capped = x > pomeMaxDM;
        if (capped) {
          // POME is Fe-limited; re-solve CP with remaining gap using PKE
          const xCap = pomeMaxDM;
          // After capping POME, solve CP residual with PKE
          const adjN = baseN + xCap * POME_N;
          const adjDM = baseDM + xCap;
          const r = T_cp * 1.6;
          const yAdj = (r * adjDM - adjN) / (PKE_N - r);
          result = calc(xCap, Math.max(0, yAdj));
          warning = ` POME capped at Fe limit. PKE adjusted to compensate for CP target.`;
        } else {
          result = calc(Math.max(0, x), Math.max(0, y));
        }
        strategy = "POME + PKE";
      }
    } else if (mode === "dual" && hasCN && !hasCP) {
      // C:N only in dual mode — POME-first, PKE for shortfall
      const x = solveCN_pome(T_cn);
      if (x === null || x < 0) { result = { error: x === null ? "No POME solution." : `C:N already ≤ target. Current: ${currentCN}` }; }
      else {
        const capped = x > pomeMaxDM;
        const xUse = Math.min(x, pomeMaxDM);
        if (capped) {
          // POME maxed — how much PKE to bridge?
          const pomeN_contrib = xUse * POME_N;
          const pomeC_contrib = xUse * POME_C;
          const remN = baseN + pomeN_contrib;
          const remC = baseC + pomeC_contrib;
          const yBridge = solveCN_pke(T_cn);
          // Re-solve with pome at max
          const y2denom = PKE_N * T_cn - PKE_C;
          const y2 = Math.abs(y2denom) > 0.001 ? ((remC - T_cn * remN) / y2denom) : 0;
          result = calc(xUse, Math.max(0, y2));
          warning = " POME capped at Fe limit. PKE added to close C:N gap.";
        } else {
          result = calc(xUse, 0);
        }
        strategy = "POME-first, minimum cost";
      }
    }

    if (result && !result.error) {
      result.warning = warning;
      result.strategy = strategy;
      // Inclusion % back-calculation
      const freshBlendWetApprox = (baseDM / ((100 - 65) / 100)); // approx
      result.pomeInclPct = pomeSludgeNatTPD > 0
        ? +((result.pDM / ((1 - pomeSludgeActMC / 100))) / pomeSludgeNatTPD * 100).toFixed(1)
        : 0;
      result.pkeFWday = +(result.kDM * PKE_FW_PER_DM).toFixed(2);
      result.pkeCostMonth = +(result.pkeCostDay * 30).toFixed(0);
    }
    return result;
  }, [targetCN, targetCP, mode, efbDMpd, opdcDMreq, pomeMaxDM]);

  const applyToS0 = () => {
    if (!solve || solve.error) return;
    if (solve.pomeInclPct > 0 && solve.pomeInclPct <= pomeSludgeMaxPct) {
      
      
    }
    if (solve.pkeFWday > 0) {
      upS0("pkeEnabled", true);
      upS0("pkeTPD", +solve.pkeFWday.toFixed(1));
    }
    setApplyMsg(" Applied to S0 — Section F (POME) and G (PKE) updated.");
    setTimeout(() => setApplyMsg(""), 4000);
  };

  const cnColor = !solve || solve.error ? C.grey
    : solve.cn <= 25 && solve.cn >= 15 ? C.green
    : solve.cn <= 35 ? C.amber : C.red;

  return (
    <div style={{ ...S.card, border: `1px solid ${C.purple}55`, gridColumn: "1/-1" }}>
      <SectionHdr icon="🎯" title="I — BLEND OPTIMISER — REVERSE SOLVER" color={C.purple}/>
      <div style={{ fontSize: 11, color: C.grey, marginBottom: 12, lineHeight: 1.7 }}>
        Set a <strong style={{color:C.white}}>target C:N</strong> and/or <strong style={{color:C.white}}>target CP%</strong>.
        The solver calculates the POME inclusion % and PKE dose required.
        POME capped at Fe-driven limit automatically. Minimum-cost solution uses POME-first.
      </div>

      {/* ── INPUTS ROW ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 14 }}>
        <div>
          <Lbl t="Target C:N Ratio" unit="BSF optimum 15–25"/>
          <input type="number" min="5" max="60" step="0.5"
            style={S.input} value={targetCN}
            onChange={e => setTargetCN(e.target.value)}/>
          <div style={{ fontSize: 10, color: C.grey, marginTop: 3 }}>
            Current blend C:N: <strong style={{ color: currentCN <= 25 ? C.green : C.amber }}>{currentCN || "—"}</strong>
          </div>
        </div>
        <div>
          <Lbl t="Target CP% (optional)" unit="% DM — BSF floor 5%"/>
          <input type="number" min="0" max="25" step="0.5"
            style={S.input} value={targetCP}
            placeholder="Leave blank = C:N only"
            onChange={e => setTargetCP(e.target.value)}/>
          <div style={{ fontSize: 10, color: C.grey, marginTop: 3 }}>
            Current CP%: <strong style={{ color: C.greyLt }}>
              {currentCP ? `${currentCP}%` : "—"}
            </strong> · Hard floor: <strong style={{ color: C.red }}>5% DM</strong>
          </div>
        </div>
        <div>
          <Lbl t="Solver Mode"/>
          <div style={{ display: "flex", flexDirection: "column", gap: 5, marginTop: 2 }}>
            {[
              { v: "dual",  l: "Minimum Cost (POME-first, PKE bridge)", c: C.green },
              { v: "pome",  l: "POME Only",                             c: C.blue },
              { v: "pke",   l: "PKE Only",                              c: C.amber },
            ].map(opt => (
              <div key={opt.v} onClick={() => setMode(opt.v)}
                style={{ padding: "5px 10px", borderRadius: 5, cursor: "pointer", fontSize: 11,
                  background: mode === opt.v ? opt.c + "22" : C.inputSectionBg,
                  border: `1px solid ${mode === opt.v ? opt.c : C.inputSectionBg}`,
                  color: mode === opt.v ? opt.c : C.grey, fontWeight: mode === opt.v ? 700 : 400 }}>
                {opt.l}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RESULT ── */}
      {solve && !solve.error && (
        <div>
          <div style={{ background: C.inputSectionBg, borderRadius: 8, padding: 14,
            border: `1px solid ${C.purple}44`, marginBottom: 10 }}>
            <div style={{ color: C.purple, fontWeight: 800, fontSize: 11, letterSpacing: "0.08em",
              marginBottom: 10 }}>
              🔢 OPTIMISER SOLUTION — {solve.strategy.toUpperCase()}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8, marginBottom: 10 }}>
              {[
                { l: "POME Inclusion",   v: solve.pomeInclPct > 0 ? `${solve.pomeInclPct}%` : "Not needed",
                  u: "% of nat. yield",  c: C.blue },
                { l: "POME Added",       v: solve.pDM > 0 ? `${solve.pDM.toFixed(2)} t DM/day` : "—",
                  u: "dry matter",       c: C.blue },
                { l: "PKE Dose",         v: solve.pkeFWday > 0.01 ? `${solve.pkeFWday} t FW/day` : "Not needed",
                  u: "fresh weight",     c: C.amber },
                { l: "Result C:N",       v: solve.cn ? solve.cn.toFixed(1) : "—",
                  u: "DM-weighted",      c: cnColor },
                { l: "Result CP%",       v: solve.cpPct ? `${solve.cpPct.toFixed(1)}%` : "—",
                  u: "% DM · floor 5%",  c: solve.cpPct >= 5 ? C.green : C.red },
              ].map((k, i) => (
                <div key={i} style={{ background: C.pageBg, borderRadius: 6, padding: "8px 10px", textAlign: "center" }}>
                  <div style={{ color: C.grey, fontSize: 9, marginBottom: 3 }}>{k.l}</div>
                  <div style={{ color: k.c, fontWeight: 900, fontSize: 14 }}>{k.v}</div>
                  <div style={{ color: C.grey, fontSize: 9, marginTop: 2 }}>{k.u}</div>
                </div>
              ))}
            </div>

            {/* Cost row */}
            {solve.pkeFWday > 0.01 && (
              <div style={{ display: "flex", gap: 12, marginBottom: 8 }}>
                <div style={{ background: C.amber + "18", border: `1px solid ${C.amber}44`,
                  borderRadius: 6, padding: "6px 14px", fontSize: 11 }}>
                  <span style={{ color: C.grey }}>PKE cost: </span>
                  <strong style={{ color: C.amber }}>${solve.pkeCostDay.toFixed(0)}/day</strong>
                  <span style={{ color: C.grey }}> · </span>
                  <strong style={{ color: C.amber }}>${solve.pkeCostMonth.toLocaleString()}/month</strong>
                </div>
                <div style={{ background: C.green + "18", border: `1px solid ${C.green}44`,
                  borderRadius: 6, padding: "6px 14px", fontSize: 11 }}>
                  <span style={{ color: C.grey }}>POME: </span>
                  <strong style={{ color: C.green }}>$0 (mill waste)</strong>
                </div>
              </div>
            )}

            {/* CP floor check */}
            {solve.cpPct !== null && solve.cpPct < 5 && (
              <div style={{ background: C.red + "18", border: `1px solid ${C.red}66`, borderLeft: `3px solid ${C.red}`,
                borderRadius: 4, padding: "8px 12px", fontSize: 11, color: C.red, marginBottom: 8 }}>
                 HARD FLOOR VIOLATION — Result CP {solve.cpPct.toFixed(1)}% &lt; 5% minimum.
                BSF inoculation not viable. Increase PKE dose or raise CP target.
              </div>
            )}

            {solve.warning && (
              <div style={{ background: C.amber + "18", border: `1px solid ${C.amber}55`,
                borderRadius: 4, padding: "8px 12px", fontSize: 11, color: C.amber }}>
                {solve.warning}
              </div>
            )}
          </div>

          {/* Apply button */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={applyToS0}
              style={{ background: C.purple, border: "none", color: C.white, borderRadius: 6,
                padding: "9px 20px", fontWeight: 800, fontSize: 12, cursor: "pointer",
                letterSpacing: "0.06em" }}>
              ▶ APPLY TO S0 INPUTS
            </button>
            <div style={{ fontSize: 11, color: C.grey }}>
              Pushes POME inclusion % → Section F · PKE dose → Section G
            </div>
            {applyMsg && (
              <div style={{ background: C.green + "22", border: `1px solid ${C.green}55`,
                borderRadius: 4, padding: "5px 12px", fontSize: 11, color: C.green }}>
                {applyMsg}
              </div>
            )}
          </div>
        </div>
      )}

      {solve && solve.error && (
        <div style={{ background: C.red + "18", border: `1px solid ${C.red}55`, borderLeft: `3px solid ${C.red}`,
          borderRadius: 4, padding: "10px 14px", fontSize: 12, color: C.red }}>
           {solve.error}
        </div>
      )}

      {!solve && (
        <div style={{ color: C.grey, fontSize: 11, fontStyle: "italic" }}>
          Enter a target C:N (and optionally target CP%) above to run the solver.
        </div>
      )}

      {/* Quick reference table */}
      <div style={{ marginTop: 12, background: C.pageBg, borderRadius: 6, padding: 10 }}>
        <div style={{ color: C.grey, fontSize: 10, letterSpacing: "0.08em", marginBottom: 6 }}>
          STREAM REFERENCE — N RATES &amp; C:N USED BY SOLVER
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
          {[
            { s: "EFB",        n: "8.5 kg/t DM",  cn: "60",  c: C.teal  },
            { s: "OPDC",       n: "26.0 kg/t DM", cn: "20",  c: C.amber },
            { s: "POME Sludge",n: "17.6 kg/t DM", cn: "15",  c: C.blue  },
            { s: "PKE",        n: "28.8 kg/t DM", cn: "15",  c: C.purple},
          ].map((row, i) => (
            <div key={i} style={{ background: C.infoSectionBg, borderRadius: 4, padding: "6px 8px",
              border: `1px solid ${row.c}33` }}>
              <div style={{ color: row.c, fontWeight: 700, fontSize: 11 }}>{row.s}</div>
              <div style={{ color: C.grey, fontSize: 10 }}>N: {row.n} · C:N: {row.cn}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NutrLedger({stg,N,P,K,Ca,Mg,OM,cn,wetPD,mc,nAdj,pAdj,ag,col}) {
  const NPK_N=0.761, NPK_P=0.978, NPK_K=0.633;
  const DMf   = (100-mc)/100;
  const kgN   = +(wetPD*DMf*N/100*1000).toFixed(0);
  const kgP   = +(wetPD*DMf*P/100*1000).toFixed(0);
  const kgK   = +(wetPD*DMf*K/100*1000).toFixed(0);
  const kgCa  = +(wetPD*DMf*Ca/100*1000).toFixed(0);
  const kgMg  = +(wetPD*DMf*Mg/100*1000).toFixed(0);
  const Ntfw  = +(N/100*DMf*1000*NPK_N).toFixed(2);
  const Ptfw  = +(P/100*DMf*1000*2.29*NPK_P).toFixed(2);
  const Ktfw  = +(K/100*DMf*1000*1.20*NPK_K).toFixed(2);
  const npkF  = +(Ntfw+Ptfw+Ktfw).toFixed(2);
  const NtA   = +(N/100*DMf*1000*(1+nAdj)*NPK_N).toFixed(2);
  const PtA   = +(P/100*DMf*1000*2.29*(1+pAdj)*NPK_P).toFixed(2);
  const KtA   = +(K/100*DMf*1000*1.20*NPK_K).toFixed(2);
  const npkV  = +((NtA+PtA+KtA)*ag).toFixed(2);
  const cnC   = cn<20?C.green:cn<=25?C.teal:cn<=30?C.amber:C.red;
  const cnL   = cn<20?"Rapid mineralisation":cn<=25?"Balanced":cn<=30?"Mild lock-up risk":"Immobilisation risk";
  return (
    <div style={{background:C.inputSectionBg,border:`1px solid ${col||C.teal}44`,borderRadius:10,padding:14,marginTop:14}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:6,marginBottom:10}}>
        <div style={{color:col||C.teal,fontWeight:700,fontSize:12,letterSpacing:1}}> NUTRIENT LEDGER — {stg}</div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          <span style={{background:cnC+"33",color:cnC,borderRadius:5,padding:"2px 8px",fontSize:10,fontWeight:700}}>C:N {cn}:1 · {cnL}</span>
          <span style={{background:C.green+"22",color:C.green,borderRadius:5,padding:"2px 8px",fontSize:10,fontWeight:700}}>NPK Floor ${npkF}/t FW · ${(npkF*wetPD).toFixed(0)}/day</span>
          <span style={{background:C.teal+"22",color:C.teal,borderRadius:5,padding:"2px 8px",fontSize:10,fontWeight:700}}>VGAM ${npkV}/t FW</span>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1.6fr 1fr",gap:14}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
          <thead><tr>{["Nutrient","% DM","kg/day","$/t FW","$/day"].map(h=>(
            <th key={h} style={{borderBottom:`1px solid ${C.pageBg}`,color:C.grey,textAlign:h==="Nutrient"?"left":"right",padding:"3px 6px",fontWeight:600,fontSize:10}}>{h}</th>
          ))}</tr></thead>
          <tbody>
            {[
              {nm:"N (Total)",   pct:N,  kg:kgN,  ptfw:Ntfw, c:C.green},
              {nm:"P₂O₅ equiv", pct:P,  kg:kgP,  ptfw:Ptfw, c:C.tealLt},
              {nm:"K₂O equiv",  pct:K,  kg:kgK,  ptfw:Ktfw, c:C.amber},
              {nm:"Ca",         pct:Ca, kg:kgCa, ptfw:null,  c:C.grey},
              {nm:"Mg",         pct:Mg, kg:kgMg, ptfw:null,  c:C.grey},
            ].map((r,i)=>(
              <tr key={i} style={{borderBottom:`1px solid ${C.pageBg}44`}}>
                <td style={{padding:"4px 6px",color:r.c,fontWeight:700}}>{r.nm}</td>
                <td style={{padding:"4px 6px",color:C.white,textAlign:"right"}}>{r.pct}%</td>
                <td style={{padding:"4px 6px",color:C.white,textAlign:"right"}}>{r.kg.toLocaleString()}</td>
                <td style={{padding:"4px 6px",color:r.ptfw!=null?C.green:C.grey,textAlign:"right"}}>{r.ptfw!=null?"$"+r.ptfw:"—"}</td>
                <td style={{padding:"4px 6px",color:r.ptfw!=null?C.green:C.grey,textAlign:"right"}}>{r.ptfw!=null?"$"+(r.ptfw*wetPD).toFixed(0):"—"}</td>
              </tr>
            ))}
            <tr style={{background:C.green+"15",borderTop:`2px solid ${C.green}44`}}>
              <td colSpan={3} style={{padding:"5px 6px",color:C.green,fontWeight:700,fontSize:11}}>NPK FLOOR — urea/TSP/MOP equiv</td>
              <td style={{padding:"5px 6px",color:C.green,fontWeight:900,textAlign:"right"}}>${npkF}</td>
              <td style={{padding:"5px 6px",color:C.green,fontWeight:900,textAlign:"right"}}>${(npkF*wetPD).toFixed(0)}</td>
            </tr>
            <tr style={{background:C.teal+"15"}}>
              <td colSpan={3} style={{padding:"5px 6px",color:C.teal,fontWeight:700,fontSize:11}}>VGAM EFFECTIVE — soil-adj × ag-tier</td>
              <td style={{padding:"5px 6px",color:C.teal,fontWeight:900,textAlign:"right"}}>${npkV}</td>
              <td style={{padding:"5px 6px",color:C.teal,fontWeight:900,textAlign:"right"}}>${(npkV*wetPD).toFixed(0)}</td>
            </tr>
          </tbody>
        </table>
        <div style={{background:C.pageBg,borderRadius:8,padding:12}}>
          <div style={{color:C.amber,fontWeight:700,fontSize:10,letterSpacing:1,marginBottom:8}}>SOIL FORMULA VALUES</div>
          {[
            {l:"OM Content",         v:`${OM}% DM`,                           c:C.tealLt},
            {l:"C:N Ratio",          v:`${cn}:1`,                             c:cnC,    n:cnL},
            {l:"Humic Potential",    v:`${+(OM*0.10).toFixed(1)}% DM`,        c:C.amber,n:"→ stable humus fraction"},
            {l:"CEC Contribution",   v:`+${+(OM*0.015).toFixed(2)} cmol/kg`,  c:C.teal, n:"per 1% OM applied"},
            {l:"Liming Equiv",       v:`${+(Ca*10).toFixed(0)} kg CaCO₃/t DM`,c:C.grey},
            {l:"NPK Floor",          v:`$${npkF}/t FW`,                        c:C.green},
            {l:"VGAM Effective",     v:`$${npkV}/t FW`,                        c:C.teal, n:`${npkF>0?((npkV/npkF-1)*100).toFixed(0):0}% vs floor`},
          ].map((r,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",padding:"4px 0",borderBottom:`1px solid ${C.inputSectionBg}55`,fontSize:10}}>
              <span style={{color:C.grey}}>{r.l}</span>
              <div style={{textAlign:"right"}}>
                <span style={{color:r.c,fontWeight:700}}>{r.v}</span>
                {r.n&&<div style={{color:C.greyLt,fontSize:9}}>{r.n}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MATERIALS REGISTRY v2 ───────────────────────────────────────────────────
const CFI_MATERIALS_CORE = ["EFB","OPDC","POME_sludge"];
const CFI_MATERIALS_ADD  = ["PKE","PMF","fronds","CPO"];
const CFI_MATERIALS = CFI_MATERIALS_CORE.concat(CFI_MATERIALS_ADD);

// ─── ORCHESTRATION: MOCK DATA LAKE ───────────────────────────────────────────
const MOCK_SOLUTIONS = [
  {
    solution_id:"CFI-BIO-001", step:"biology", soil_type:"Ultisol",
    title:"Trichoderma + Bacillus Consortia on EFB/OPDC 89:11",  // FIX-05
    substrate_context:{blend:"EFB 89:OPDC 11",DM_pct:38,MC_pct:65},
    biology_stack:{organisms:["Trichoderma asperellum ICBB-01","Bacillus subtilis ICBB-03"],dose:"2 kg/t"},
    process_conditions:{temp_C:45,moisture_pct:65,time_days:5,aeration:"forced"},
    product_metrics_before:{N_pct:1.20,P_pct:0.18,K_pct:0.80,CP_pct:8.14,CN_ratio:32},
    product_metrics_after:{N_pct:1.82,P_pct:0.24,K_pct:0.92,CP_pct:11.2,CN_ratio:21},
    carbon_metrics:{SOC_delta_pct:0.41,CH4_avoided_tCO2e_yr:108,N2O_avoided_tCO2e_yr:18},
    stats:{n:12,mean_N_gain:0.62,sd:0.08,ci95:"0.54–0.70"},
    source:{type:"DOI",ref:"10.1016/j.biortech.2023.128901",year:2023,title:"Enhanced N retention in palm residue bioconversion"},
    confidence:"high",last_updated:"2026-03-08T10:00:00Z",agent:"biology_synthetic_agent"
  },
  {
    solution_id:"CFI-BSF-001", step:"bsf", soil_type:"NA",
    title:"PKM Supplementation +15% CP — BSF FCR on OPDC-Heavy Diets",
    substrate_context:{blend:"OPDC 80:PKM 20",DM_pct:30,MC_pct:70},
    biology_stack:{organisms:["Hermetia illucens BSFL"],dose:"5,000 neonate/m²"},
    process_conditions:{temp_C:28,moisture_pct:70,time_days:14,aeration:"passive"},
    product_metrics_before:{CP_pct:14.5,lipid_pct:12.0,FCR:2.1},
    product_metrics_after:{CP_pct:52.4,lipid_pct:28.6,FCR:1.75},
    carbon_metrics:{SOC_delta_pct:0,CH4_avoided_tCO2e_yr:0,synthetic_N_displaced_t_yr:186},
    stats:{n:8,mean_FCR:1.75,sd:0.12,ci95:"1.63–1.87"},
    source:{type:"DOI",ref:"10.1016/j.wasman.2024.110234",year:2024,title:"FCR improvement on palm-derived BSF diets"},
    confidence:"high",last_updated:"2026-03-09T08:30:00Z",agent:"bsf_performance_agent"
  },
  {
    solution_id:"CFI-SOIL-001", step:"soil", soil_type:"Histosol",
    title:"CFI Biofertiliser on Peat Soils — SOC & CEC Response",
    substrate_context:{product:"frass_biofertiliser",dose_t_ha:4},
    biology_stack:{organisms:[],dose:"N/A"},
    process_conditions:{application:"basal+split",freq:"2x/yr"},
    product_metrics_before:{N_pct:2.8,P_pct:0.22,K_pct:0.65},
    product_metrics_after:{N_pct:2.8,P_pct:0.22,K_pct:0.65},
    soil_metrics_before:{SOC_pct:24.5,CEC:18.2,pH:3.8,bulk_density:0.25},
    soil_metrics_after:{SOC_pct:25.8,CEC:20.1,pH:4.2,bulk_density:0.23},
    crop_metrics:{FFB_yield_t_ha_yr:18.4,FFB_uplift_pct:8.2},
    carbon_metrics:{SOC_delta_pct:1.3,CH4_avoided_tCO2e_yr:0,N2O_avoided_tCO2e_yr:42},
    stats:{n:6,mean_SOC_gain:1.3,sd:0.22,ci95:"1.08–1.52"},
    source:{type:"CFI_internal",ref:"CFI-FIELD-TRIAL-2025-002",year:2025,title:"Peat trial Sinar Mas Bogor block 14-C"},
    confidence:"medium",last_updated:"2026-03-05T14:15:00Z",agent:"soil_palm_agent"
  },
  {
    solution_id:"CFI-SOIL-002", step:"soil", soil_type:"Ultisol",
    title:"Biofertiliser on Ultisol — CEC + K Uplift at 3 t/ha Dose",
    substrate_context:{product:"frass_biofertiliser",dose_t_ha:3},
    biology_stack:{organisms:[],dose:"N/A"},
    process_conditions:{application:"ring-spread",freq:"1x/yr"},
    product_metrics_before:{N_pct:2.8,P_pct:0.22,K_pct:0.65},
    product_metrics_after:{N_pct:2.8,P_pct:0.22,K_pct:0.65},
    soil_metrics_before:{SOC_pct:1.8,CEC:8.2,pH:4.5,bulk_density:1.42},
    soil_metrics_after:{SOC_pct:2.3,CEC:10.4,pH:4.8,bulk_density:1.38},
    crop_metrics:{FFB_yield_t_ha_yr:21.2,FFB_uplift_pct:6.4},
    carbon_metrics:{SOC_delta_pct:0.5,CH4_avoided_tCO2e_yr:0,synthetic_N_displaced_t_yr:64},
    stats:{n:18,mean_CEC_gain:2.2,sd:0.41,ci95:"2.01–2.39"},
    source:{type:"DOI",ref:"10.1007/s11368-022-03145-8",year:2022,title:"Organic amendment effects on Ultisol oil palm yield"},
    confidence:"high",last_updated:"2026-03-07T09:45:00Z",agent:"soil_palm_agent"
  },
  {
    solution_id:"CFI-FINISH-001", step:"finishing", soil_type:"NA",
    title:"Zeolite + Rock Phosphate Topping — +0.5% N, +0.3% P Post-BSF",
    substrate_context:{product:"post_bsf_frass",base_N_pct:2.8},
    biology_stack:{organisms:[],dose:"N/A"},
    process_conditions:{zeolite_kg_t:15,rock_P_kg_t:8,mixing_min:20},
    product_metrics_before:{N_pct:2.8,P_pct:0.22,K_pct:0.65,EC_mS_cm:2.1},
    product_metrics_after:{N_pct:3.3,P_pct:0.52,K_pct:0.68,EC_mS_cm:2.4},
    carbon_metrics:{SOC_delta_pct:0,CH4_avoided_tCO2e_yr:0},
    stats:{n:9,mean_N_gain:0.5,sd:0.06,ci95:"0.44–0.56"},
    source:{type:"DOI",ref:"10.1016/j.geoderma.2023.116612",year:2023,title:"Mineral topping for slow-release biofertiliser"},
    confidence:"medium",last_updated:"2026-03-06T11:20:00Z",agent:"finishing_topping_agent"
  },
  {
    solution_id:"CFI-CARB-001", step:"carbon", soil_type:"NA",
    title:"POME Biogas Capture — CH4 Avoided vs Open Pond Baseline",
    substrate_context:{POME_m3_day:1200,COD_kg_m3:50},
    biology_stack:{organisms:[],dose:"N/A"},
    process_conditions:{treatment:"covered_lagoon",MCF_baseline:0.8,MCF_project:0.01},
    product_metrics_before:{},
    product_metrics_after:{},
    carbon_metrics:{CH4_avoided_tCO2e_yr:88400,GWP100:28,MCF_baseline:0.8,B0:0.21},
    stats:{n:3,mean_avoided:88400,sd:4200,ci95:"83800–93000"},
    source:{type:"URL",ref:"https://verra.org/methodologies/vm0041",year:2024,title:"Verra VM0041 POME Methane Capture"},
    confidence:"high",last_updated:"2026-03-10T16:00:00Z",agent:"carbon_credits_agent"
  },
  {
    solution_id:"CFI-MATH-001", step:"substrate", soil_type:"NA",
    title:"Response Surface Model: C:N vs BSF FCR & Survival",
    substrate_context:{blend_range:"EFB 40–80%:OPDC 20–60%",CN_range:"18–45"},
    biology_stack:{organisms:["Hermetia illucens BSFL"],dose:"5,000/m²"},
    process_conditions:{temp_C:28,moisture_pct:65,time_days:14},
    product_metrics_before:{},
    product_metrics_after:{FCR_predicted:1.82,survival_pct_predicted:78},
    carbon_metrics:{},
    stats:{n:36,R2:0.91,RMSE_FCR:0.08,model:"RSM Box-Behnken"},
    source:{type:"CFI_internal",ref:"CFI-MATH-RSM-2026-001",year:2026,title:"CFI Internal RSM optimisation — C:N vs FCR"},
    confidence:"medium",last_updated:"2026-03-10T08:00:00Z",agent:"math_optimization_agent"
  },
  {
    solution_id:"INCEPTISOL_EFB-POME-OPDC_CA-MG_MICROBES_V1",
    step:"soil", soil_type:"Inceptisol",
    title:"Inceptisol — EFB/POME/OPDC + Ca/Mg + Microbe Consortium: SOC, CEC & NPK Response (5yr)",
    substrate_context:{
      materials:["EFB","POME","OPDC"],
      blend_ratio_fresh:{EFB:0.55,POME:0.30,OPDC:0.15},
      dm_fraction:0.33,
      initial_CN:30,
      initial_NPK_pct_dm:{N:1.2,P2O5:0.5,K2O:1.2}
    },
    biology_stack:{
      organisms:["Trichoderma harzianum","Lactobacillus EM-4","Saccharomyces cerevisiae","Azotobacter vinelandii","Pseudomonas fluorescens"],
      mineral_amendments:[{name:"dolomitic_lime",rate_kg_per_t_dm:8}]
    },
    process_conditions:{
      wave_0_2:{duration_days:21,temp_profile_C:[35,60,40],moisture_pct:[60,65,55]},
      bsf_stage:{duration_days:10,target_moisture_pct:65}
    },
    product_metrics_before:{basis:"dry_matter",N_pct:1.2,P_pct:0.5,K_pct:1.2,Ca_pct:0.8,Mg_pct:0.3,pH:5.3},
    product_metrics_after:{basis:"dry_matter",N_pct:1.7,P_pct:0.8,K_pct:1.4,Ca_pct:1.5,Mg_pct:0.7,pH:6.5},
    soil_metrics_before:{SOC_pct:1.2,CEC:8.0,pH:5.0,bulk_density:1.3},
    soil_metrics_after:{application_t_ha:6,time_horizon_yr:5,SOC_pct:1.8,CEC:11.0,pH:5.8,bulk_density:1.2},
    crop_metrics:{FFB_yield_t_ha_yr:18.4,FFB_uplift_pct:8.2,time_horizon_yr:5},
    carbon_metrics:{SOC_delta_pct:0.6,CH4_avoided_tCO2e_yr:0,synthetic_N_displaced_t_yr:0},
    stats:{n:0,note:"Model projection — no field trial yet; confidence MEDIUM pending lab validation"},
    source:{type:"CFI_internal",ref:"CFI-ORCH-UPLOAD-2026-03-11",year:2026,title:"Orchestration upload: Inceptisol EFB-POME-OPDC Ca-Mg Microbes V1"},
    confidence:"medium",last_updated:"2026-03-11T09:00:00Z",agent:"soil_palm_agent",
    uploaded_by:"Sharon",uploaded_at:"2026-03-11T09:00:00Z"
  }
];

const AGENT_STATUS = [
  {id:"master_discovery_engine",   label:"Master Discovery",    icon:"🧭",schedule:"3d",last_run:"2026-03-09 06:00",next_run:"2026-03-12 06:00",status:"idle",   color:"#00C9B1"},
  {id:"biology_synthetic_agent",   label:"Biology Synthetic",   icon:"",schedule:"3d",last_run:"2026-03-09 06:12",next_run:"2026-03-12 06:12",status:"idle",   color:"#3DCB7A"},
  {id:"bsf_performance_agent",     label:"BSF Performance",     icon:"🦗",schedule:"3d",last_run:"2026-03-09 06:24",next_run:"2026-03-12 06:24",status:"idle",   color:"#4A9EDB"},
  {id:"soil_palm_agent",           label:"Soil & Palm",         icon:"",schedule:"3d",last_run:"2026-03-09 06:36",next_run:"2026-03-12 06:36",status:"idle",   color:"#9B59B6"},
  {id:"finishing_topping_agent",   label:"Finishing & Topping", icon:"", schedule:"3d",last_run:"2026-03-09 06:48",next_run:"2026-03-12 06:48",status:"idle",   color:"#F5A623"},
  {id:"carbon_credits_agent",      label:"Carbon Credits",      icon:"🌍",schedule:"3d",last_run:"2026-03-09 07:00",next_run:"2026-03-12 07:00",status:"idle",   color:"#FFD080"},
  {id:"math_optimization_agent",   label:"Math Optimisation",   icon:"📐",schedule:"3d",last_run:"2026-03-09 07:12",next_run:"2026-03-12 07:12",status:"idle",   color:"#E84040"},
];

const STEP_LABELS = {
  substrate:"Substrate",biology:"Biology",bsf:"BSF",
  finishing:"Finishing",soil:"Soil",palm:"Palm",feed:"Feed",carbon:"Carbon"
};
const CONF_COLOR = {high:"#3DCB7A", medium:"#F5A623", low:"#E84040"};

// ─── ORCHESTRATION TAB ────────────────────────────────────────────────────────
function OrchestrationTab({uploadedConfigs, setUploadedConfigs}) {
  const [orchTab, setOrchTab]     = useState("lake");
  const [filterStep, setFilterStep] = useState("all");
  const [expandedCard, setExpandedCard] = useState(null);
  const [dragOver, setDragOver]   = useState(false);
  const fileInputRef = useRef(null);

  const [dbSolutions, setDbSolutions] = useState([]);
  const [dbLoading, setDbLoading]     = useState(false);
  const [dbError, setDbError]         = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);

  const steps = ["all","substrate","biology","bsf","finishing","soil","palm","carbon"];

  // Merge: live DB records override mock by solution_id
  const allSolutions = (function(){
    var ids = {};
    dbSolutions.forEach(function(s){ ids[s.solution_id]=s; });
    var merged = dbSolutions.slice();
    MOCK_SOLUTIONS.forEach(function(s){ if(!ids[s.solution_id]) merged.push(s); });
    return merged;
  })();

  const filtered = filterStep==="all" ? allSolutions : allSolutions.filter(function(s){ return s.step===filterStep; });

  // Fetch from Supabase when Data Lake tab is active
  useEffect(function(){
    if(orchTab!=="lake") return;
    setDbLoading(true); setDbError(null);
    supaFetch("cfi_solutions")
      .then(function(data){ setDbSolutions(data||[]); setDbLoading(false); })
      .catch(function(err){ setDbError(err.message); setDbLoading(false); });
  },[orchTab]);

  const handleFiles = useCallback(function(files){
    Array.from(files).forEach(function(file){
      var reader = new FileReader();
      reader.onload = function(e){
        try {
          var text = e.target.result;
          var parsed = file.name.endsWith(".json") ? JSON.parse(text) : {_raw:text,_parseNote:"YAML — raw preview."};
          var entry = {name:file.name,size:file.size,
            type:file.name.endsWith(".json")?"JSON":"YAML",
            loaded_at:new Date().toISOString(),content:parsed,raw:text,db_status:"pending"};
          // If valid solution record — insert to Supabase
          if(parsed && parsed.solution_id && parsed.step && parsed.confidence){
            var record = Object.assign({},parsed,{
              uploaded_by: parsed.uploaded_by||"Sharon",
              uploaded_at: parsed.uploaded_at||new Date().toISOString(),
              last_updated: new Date().toISOString()
            });
            setUploadStatus("Inserting "+file.name+" into Supabase...");
            supaInsert("cfi_solutions",record)
              .then(function(){
                setUploadStatus(" "+file.name+" saved to Supabase (append-only)");
                entry.db_status="saved";
                setUploadedConfigs(function(prev){return prev.concat([entry]);});
              })
              .catch(function(err){
                setUploadStatus(" "+file.name+" — "+err.message);
                entry.db_status="error: "+err.message;
                setUploadedConfigs(function(prev){return prev.concat([entry]);});
              });
          } else {
            entry.db_status="config_only";
            setUploadedConfigs(function(prev){return prev.concat([entry]);});
          }
        } catch(err){
          setUploadedConfigs(function(prev){return prev.concat([{name:file.name,size:file.size,type:"ERROR",
            loaded_at:new Date().toISOString(),content:null,error:err.message,raw:"",db_status:"parse_error"}]);});
        }
      };
      reader.readAsText(file);
    });
  },[setUploadedConfigs]);

  const onDrop = useCallback(function(e){e.preventDefault();setDragOver(false);handleFiles(e.dataTransfer.files);},[handleFiles]);

  const oc = {
    navy:C.appBg,navyMid:C.infoSectionBg,navyLt:C.inputSectionBg,navyDk:C.pageBg,
    teal:"#00C9B1",amber:"#F5A623",red:"#E84040",green:"#3DCB7A",
    blue:"#4A9EDB",purple:"#9B59B6",white:"#F0F4F8",grey:"#8BA0B4",greyLt:"#C4D3E0",
    mono:"'Courier New',monospace"
  };

  const SubTab = ({id,label,icon}) => (
    <div onClick={()=>setOrchTab(id)}
      style={{padding:"7px 16px",cursor:"pointer",borderRadius:"6px 6px 0 0",
        background:orchTab===id?oc.navyLt:oc.navyDk,
        color:orchTab===id?oc.white:oc.grey,
        fontSize:11,fontWeight:700,letterSpacing:"0.04em",
        borderBottom:orchTab===id?"2px solid "+oc.teal:"2px solid transparent",
        transition:"all 0.15s"}}>
      {icon} {label}
    </div>
  );

  return (
    <div style={{background:oc.navyDk,minHeight:600,borderRadius:10,padding:20,
      border:"1px solid "+oc.teal+"22"}}>

      {/* Header */}
      <div style={{marginBottom:16,borderBottom:"1px solid "+oc.teal+"22",paddingBottom:12,
        display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
        <div>
          <div style={{color:oc.teal,fontWeight:900,fontSize:16,letterSpacing:"0.06em"}}>
            🧭 CFI Orchestration Layer
          </div>
          <div style={{color:oc.grey,fontSize:10,marginTop:2}}>
            Data Lake · Agent Status · Config Upload · Supabase LIVE · v21.0
          </div>
        </div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          <span style={{background:oc.teal+"20",border:"1px solid "+oc.teal+"44",borderRadius:10,
            padding:"2px 9px",color:oc.teal,fontSize:10,fontWeight:800}}>
            Core: {CFI_MATERIALS_CORE.join(" · ")}
          </span>
          <span style={{background:oc.amber+"20",border:"1px solid "+oc.amber+"44",borderRadius:10,
            padding:"2px 9px",color:oc.amber,fontSize:10,fontWeight:800}}>
            Additives: {CFI_MATERIALS_ADD.join(" · ")}
          </span>
        </div>
      </div>

      {/* Sub-tabs */}
      <div style={{display:"flex",gap:4,marginBottom:16,borderBottom:"1px solid "+oc.navyLt}}>
        <SubTab id="lake" label="Data Lake" icon="🗄"/>
        <SubTab id="agents" label="Agent Status" icon="🤖"/>
        <SubTab id="upload" label="Upload Config" icon="📤"/>
      </div>

      {/* ── DATA LAKE TAB ── */}
      {orchTab==="lake" && (
        <div>
          {/* DB status banners */}
          {dbLoading && (
            <div style={{background:"#0d1f35",borderRadius:7,padding:"8px 13px",marginBottom:10,
              border:"1px solid #1e4060",fontSize:10,color:oc.teal,display:"flex",alignItems:"center",gap:8}}>
              <span>⏳</span>{"Fetching live records from Supabase..."}
            </div>
          )}
          {dbError && (
            <div style={{background:"#2a0a0a",borderRadius:7,padding:"8px 13px",marginBottom:10,
              border:"1px solid "+oc.red+"55",fontSize:10,color:oc.red,display:"flex",alignItems:"center",gap:8}}>
              <span></span><span style={{fontWeight:800}}>Supabase error:</span>{" "+dbError+" — showing mock seeds only."}
            </div>
          )}
          {!dbLoading && !dbError && dbSolutions.length > 0 && (
            <div style={{background:"#0d2818",borderRadius:7,padding:"7px 13px",marginBottom:10,
              border:"1px solid "+oc.green+"44",fontSize:10,color:oc.green,display:"flex",alignItems:"center",gap:8}}>
              <span></span>{"Supabase connected · "+dbSolutions.length+" live record"+(dbSolutions.length!==1?"s":"")+" · "+MOCK_SOLUTIONS.length+" mock seeds"}
            </div>
          )}
          {/* Step filter */}
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
            {steps.map(s=>(
              <div key={s} onClick={()=>setFilterStep(s)}
                style={{padding:"4px 12px",cursor:"pointer",borderRadius:6,fontSize:10,fontWeight:700,
                  background:filterStep===s?oc.teal+"33":oc.navyMid,
                  color:filterStep===s?oc.teal:oc.grey,
                  border:"1px solid "+(filterStep===s?oc.teal+"66":"rgba(255,255,255,0.07)"),
                  textTransform:"uppercase",letterSpacing:"0.06em"}}>
                {s==="all"?"ALL":STEP_LABELS[s]||s}
              </div>
            ))}
            <span style={{marginLeft:"auto",color:oc.grey,fontSize:10,alignSelf:"center"}}>
              {filtered.length} record{filtered.length!==1?"s":""}
            </span>
          </div>

          {/* Solution cards */}
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {filtered.map(function(sol){
              const isExpanded = expandedCard===sol.solution_id;
              const confCol = CONF_COLOR[sol.confidence]||oc.grey;
              const stepCol = {substrate:oc.teal,biology:oc.green,bsf:oc.blue,
                finishing:oc.amber,soil:"#9B59B6",carbon:oc.tealLt}[sol.step]||oc.grey;
              return (
                <div key={sol.solution_id}
                  style={{background:oc.navyMid,borderRadius:8,overflow:"hidden",
                    border:"1px solid "+stepCol+"33",
                    cursor:"pointer"}}
                  onClick={()=>setExpandedCard(isExpanded?null:sol.solution_id)}>
                  {/* Card header */}
                  <div style={{background:"#0A1624",padding:"10px 14px",
                    borderBottom:isExpanded?"1px solid "+stepCol+"33":"none",
                    display:"flex",alignItems:"center",gap:10}}>
                    <div style={{flex:1}}>
                      <div style={{fontSize:12,fontWeight:800,color:oc.white,marginBottom:3}}>
                        {sol.title}
                      </div>
                      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                        <span style={{background:stepCol+"22",border:"1px solid "+stepCol+"55",
                          borderRadius:8,padding:"1px 7px",color:stepCol,fontSize:9,fontWeight:800}}>
                          {STEP_LABELS[sol.step]||sol.step}
                        </span>
                        <span style={{background:confCol+"22",border:"1px solid "+confCol+"55",
                          borderRadius:8,padding:"1px 7px",color:confCol,fontSize:9,fontWeight:800}}>
                          {sol.confidence.toUpperCase()}
                        </span>
                        {sol.soil_type!=="NA" && (
                          <span style={{background:"rgba(255,255,255,0.06)",borderRadius:8,
                            padding:"1px 7px",color:oc.greyLt,fontSize:9}}>
                            {sol.soil_type}
                          </span>
                        )}
                        <span style={{color:oc.grey,fontSize:9,marginLeft:"auto"}}>
                          {sol.solution_id}
                        </span>
                      </div>
                    </div>
                    <div style={{color:oc.grey,fontSize:14,transition:"transform 0.2s",
                      transform:isExpanded?"rotate(90deg)":"rotate(0deg)"}}>▶</div>
                  </div>

                  {/* Expanded body */}
                  {isExpanded && (
                    <div style={{padding:"12px 14px"}}>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:12}}>
                        {/* Before */}
                        <div style={{background:oc.navyDk,borderRadius:6,padding:"9px 11px"}}>
                          <div style={{color:oc.grey,fontSize:9,fontWeight:700,textTransform:"uppercase",
                            letterSpacing:"0.08em",marginBottom:6}}>Before</div>
                          {Object.entries(sol.product_metrics_before||{}).filter(([k])=>k!=="basis").map(([k,v])=>(
                            <div key={k} style={{display:"flex",justifyContent:"space-between",
                              padding:"2px 0",borderBottom:"1px solid rgba(255,255,255,0.04)",fontSize:10}}>
                              <span style={{color:oc.grey}}>{k}</span>
                              <span style={{color:oc.white,fontFamily:oc.mono,fontWeight:700}}>{v}</span>
                            </div>
                          ))}
                        </div>
                        {/* After */}
                        <div style={{background:oc.navyDk,borderRadius:6,padding:"9px 11px",
                          borderLeft:"2px solid "+oc.green}}>
                          <div style={{color:oc.green,fontSize:9,fontWeight:700,textTransform:"uppercase",
                            letterSpacing:"0.08em",marginBottom:6}}>After</div>
                          {Object.entries(sol.product_metrics_after||{}).filter(([k])=>k!=="basis").map(([k,v])=>(
                            <div key={k} style={{display:"flex",justifyContent:"space-between",
                              padding:"2px 0",borderBottom:"1px solid rgba(255,255,255,0.04)",fontSize:10}}>
                              <span style={{color:oc.grey}}>{k}</span>
                              <span style={{color:oc.green,fontFamily:oc.mono,fontWeight:700}}>{v}</span>
                            </div>
                          ))}
                        </div>
                        {/* Carbon + Stats */}
                        <div style={{background:oc.navyDk,borderRadius:6,padding:"9px 11px"}}>
                          <div style={{color:oc.teal,fontSize:9,fontWeight:700,textTransform:"uppercase",
                            letterSpacing:"0.08em",marginBottom:6}}>Carbon & Stats</div>
                          {Object.entries(sol.carbon_metrics||{}).map(([k,v])=>(
                            <div key={k} style={{display:"flex",justifyContent:"space-between",
                              padding:"2px 0",fontSize:10}}>
                              <span style={{color:oc.grey}}>{k}</span>
                              <span style={{color:oc.teal,fontFamily:oc.mono,fontWeight:700}}>{v}</span>
                            </div>
                          ))}
                          {sol.stats && (
                            <div style={{marginTop:6,paddingTop:6,borderTop:"1px solid rgba(255,255,255,0.07)"}}>
                              <div style={{color:oc.amber,fontSize:9,marginBottom:3}}>n={sol.stats.n}</div>
                              {sol.stats.ci95 && <div style={{color:oc.grey,fontSize:9}}>95% CI: {sol.stats.ci95}</div>}
                            </div>
                          )}
                        </div>
                      </div>
                      {/* Source */}
                      <div style={{background:"#08131f",borderRadius:6,padding:"7px 11px",
                        display:"flex",gap:10,alignItems:"center",fontSize:9}}>
                        <span style={{color:oc.teal,fontWeight:700}}>{sol.source.type}</span>
                        <span style={{color:oc.grey}}>{sol.source.title} ({sol.source.year})</span>
                        <span style={{color:oc.grey,marginLeft:"auto"}}>{sol.last_updated?.slice(0,10)}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── AGENTS TAB ── */}
      {orchTab==="agents" && (
        <div>
          <div style={{color:oc.grey,fontSize:11,marginBottom:14}}>
            All agents run on 3-day schedule. In production: connect to Supabase Edge Functions + cron triggers.
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {AGENT_STATUS.map(ag=>(
              <div key={ag.id} style={{background:oc.navyMid,borderRadius:8,padding:"11px 14px",
                border:"1px solid "+ag.color+"33",
                display:"flex",alignItems:"center",gap:14,flexWrap:"wrap"}}>
                <span style={{fontSize:18}}>{ag.icon}</span>
                <div style={{flex:1,minWidth:120}}>
                  <div style={{color:ag.color,fontWeight:800,fontSize:12}}>{ag.label}</div>
                  <div style={{color:oc.grey,fontSize:9,marginTop:2,fontFamily:oc.mono}}>
                    {ag.id}
                  </div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{color:oc.grey,fontSize:9}}>Last: {ag.last_run}</div>
                  <div style={{color:oc.teal,fontSize:9}}>Next: {ag.next_run}</div>
                </div>
                <span style={{background:ag.color+"22",border:"1px solid "+ag.color+"55",
                  borderRadius:8,padding:"2px 9px",color:ag.color,fontSize:9,fontWeight:800}}>
                  {ag.status.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
          <div style={{marginTop:14,background:"#0d1f35",borderRadius:8,padding:"12px 14px",
            border:"1px solid "+oc.teal+"22",fontSize:9,color:oc.grey,lineHeight:1.8}}>
            <div style={{color:oc.teal,fontWeight:800,marginBottom:4}}>Production Integration</div>
            Supabase Edge Functions triggered via pg_cron or external cron. Each agent writes only to its
            designated step namespace. Master Discovery Engine runs first, populates discovery queue, then
            step agents fetch and process.
          </div>
        </div>
      )}

      {/* ── UPLOAD TAB ── */}
      {orchTab==="upload" && (
        <div>
          {uploadStatus && (
            <div style={{background:uploadStatus.startsWith("")?"#0d2818":uploadStatus.startsWith("")?"#2a1a0a":"#0d1f35",
              borderRadius:7,padding:"8px 13px",marginBottom:10,
              border:"1px solid "+(uploadStatus.startsWith("")?oc.green:uploadStatus.startsWith("")?oc.amber:oc.teal)+"55",
              fontSize:10,color:uploadStatus.startsWith("")?oc.green:uploadStatus.startsWith("")?oc.amber:oc.teal,
              display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span>{uploadStatus}</span>
              <span onClick={function(){setUploadStatus(null);}} style={{cursor:"pointer",color:oc.grey,fontSize:12}}>{"✕"}</span>
            </div>
          )}
          <div
            onDragOver={e=>{e.preventDefault();setDragOver(true);}}
            onDragLeave={()=>setDragOver(false)}
            onDrop={onDrop}
            onClick={()=>fileInputRef.current&&fileInputRef.current.click()}
            style={{border:"2px dashed "+(dragOver?oc.teal+"aa":oc.navyLt),
              borderRadius:10,padding:"32px 20px",textAlign:"center",
              cursor:"pointer",marginBottom:16,transition:"all 0.2s",
              background:dragOver?oc.teal+"08":oc.navyDk}}>
            <div style={{fontSize:28,marginBottom:8}}>📤</div>
            <div style={{color:dragOver?oc.teal:oc.grey,fontWeight:700,fontSize:13}}>
              {dragOver ? "Drop to upload" : "Drag & drop JSON or YAML config here"}
            </div>
            <div style={{color:oc.grey,fontSize:10,marginTop:5}}>or click to browse</div>
            <input ref={fileInputRef} type="file" accept=".json,.yaml,.yml"
              multiple style={{display:"none"}}
              onChange={e=>handleFiles(e.target.files)}/>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
            {[
              {label:"YAML orchestration config",icon:"",col:oc.teal,
               desc:"Drop the orchestration YAML (agents, schedules, tools, data_lake). Parsed keys display here."},
              {label:"JSON solution record",icon:"🗄",col:oc.green,
               desc:"Drop a JSON matching cfi_solutions schema. Required keys: solution_id, step, title, confidence, source."}
            ].map(f=>(
              <div key={f.label} style={{background:oc.navyMid,borderRadius:8,padding:"11px 13px",
                border:"1px solid "+f.col+"33"}}>
                <div style={{fontSize:14,marginBottom:5}}>{f.icon}</div>
                <div style={{fontSize:11,fontWeight:800,color:f.col,marginBottom:4}}>{f.label}</div>
                <div style={{fontSize:9,color:oc.grey,lineHeight:1.6}}>{f.desc}</div>
              </div>
            ))}
          </div>

          {uploadedConfigs.length===0 ? (
            <div style={{background:"#08131f",borderRadius:8,padding:"20px",textAlign:"center",
              border:"1px solid #1e3050",color:oc.grey,fontSize:11}}>
              No configs loaded yet — drag files above.
            </div>
          ) : (
            <div>
              <div style={{fontSize:10,color:oc.teal,fontWeight:800,textTransform:"uppercase",
                letterSpacing:"0.06em",marginBottom:8}}>
                Loaded Configs ({uploadedConfigs.length})
              </div>
              {uploadedConfigs.map(function(cfg,idx){
                const isErr = cfg.type==="ERROR";
                return (
                  <div key={idx} style={{background:oc.navyMid,borderRadius:8,marginBottom:8,
                    border:"1px solid "+(isErr?oc.red:oc.teal)+"44",overflow:"hidden"}}>
                    <div style={{background:isErr?"#2a0a0a":"#0d1f35",
                      borderBottom:"1px solid "+(isErr?oc.red:oc.teal)+"33",
                      padding:"8px 12px",display:"flex",alignItems:"center",gap:10}}>
                      <span style={{fontSize:14}}>{isErr?"":cfg.type==="YAML"?"":"🗄"}</span>
                      <div style={{flex:1}}>
                        <div style={{fontSize:11,fontWeight:700,color:oc.white}}>{cfg.name}</div>
                        <div style={{fontSize:8,color:oc.grey}}>
                          {cfg.type+" · "+(cfg.size/1024).toFixed(1)+"KB · "+cfg.loaded_at.slice(0,19).replace("T"," ")}
                        </div>
                      </div>
                      <span style={{background:(isErr?oc.red:oc.teal)+"22",
                        border:"1px solid "+(isErr?oc.red:oc.teal)+"55",
                        borderRadius:8,padding:"2px 7px",
                        color:isErr?oc.red:oc.teal,fontSize:9,fontWeight:700}}>
                        {isErr?"PARSE ERROR":cfg.type}
                      </span>
                    </div>
                    {isErr ? (
                      <div style={{padding:"7px 12px",fontSize:9,color:oc.red,fontFamily:oc.mono}}>{cfg.error}</div>
                    ) : (
                      <div style={{padding:"7px 12px",maxHeight:160,overflowY:"auto"}}>
                        <pre style={{fontFamily:oc.mono,fontSize:8,color:"#90d8c8",margin:0,
                          lineHeight:1.8,whiteSpace:"pre-wrap"}}>
                          {cfg.type==="JSON"
                            ? JSON.stringify(cfg.content,null,2).slice(0,800)+(JSON.stringify(cfg.content).length>800?"\n... (truncated)":"")
                            : (cfg.raw||"").slice(0,800)+((cfg.raw||"").length>800?"\n... (truncated)":"")}
                        </pre>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <div style={{marginTop:12,background:"#1a2a10",borderRadius:7,padding:"9px 13px",
            border:"1px solid "+oc.green+"33",fontSize:9,color:oc.grey,lineHeight:1.8}}>
            <div style={{color:oc.green,fontWeight:800,marginBottom:4}}>🔌 Supabase Integration</div>
            <div style={{color:oc.teal,fontWeight:700,marginBottom:2}}>APPEND-ONLY (never overwrite):</div>
            Use INSERT with ON CONFLICT DO NOTHING on solution_id — never UPSERT/UPDATE.
            <div style={{color:oc.teal,fontWeight:700,marginTop:5,marginBottom:2}}>User Access (RLS):</div>
            Sharon (admin): full read + upload · Viewers: read-only · Agents (service_role): write-only via backend
            <div style={{color:oc.teal,fontWeight:700,marginTop:5,marginBottom:2}}>Live fetch:</div>
            supabase.from('cfi_solutions').select('*').order('last_updated', ascending:false)
          </div>
        </div>
      )}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function CFI() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => setSession(s));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);
  const [stage, setStage] = useState(0);
  const [showMoreStreams, setShowMoreStreams] = useState(false);
  const [showValCalc, setShowValCalc] = useState(false);
  const [tabsSeen, setTabsSeen]         = useState(new Set([0]));
  const [searchesUsed, setSearchesUsed] = useState(0);
  const [showGate, setShowGate]         = useState(false);
  const [gateReason, setGateReason]     = useState("");
  const [visName,  setVisName]          = useState("");
  const [visEmail, setVisEmail]         = useState("");
  const [visOrg,   setVisOrg]           = useState("");
  const [visSubmitted, setVisSubmitted] = useState(false);

  const siteRegistered = true;
  const FREE_TABS = 3;
  const FREE_SEARCHES = 5;

  const handleTabClick = (i) => {
    if (siteRegistered) { setStage(i); setTabsSeen(p => new Set([...p, i])); return; }
    const newSeen = new Set([...tabsSeen, i]);
    if (newSeen.size > FREE_TABS) {
      setGateReason("tabs");
      setShowGate(true);
      return;
    }
    setTabsSeen(newSeen);
    setStage(i);
  };

  const handleSearch = (cb) => {
    if (siteRegistered) { cb(); return; }
    if (searchesUsed >= FREE_SEARCHES) {
      setGateReason("searches");
      setShowGate(true);
      return;
    }
    setSearchesUsed(p => p+1);
    cb();
  };

  const submitGate = () => {
    if (!visName || !visEmail) return;
    upS0("contactName", visName);
    upS0("contactEmail", visEmail);
    if (visOrg) upS0("plantName", visOrg);
    setVisSubmitted(true);
    setTimeout(() => { setShowGate(false); setVisSubmitted(false); }, 1800);
  };
  const [uploadedConfigs, setUploadedConfigs] = useState([]);

  // ── S0 STATE ──
  const [s0, setS0] = useState({
    plantName: "", millName: "", district: "", province: "", contact: "", rspo: "none", country: "Indonesia",
    idCode: "", contactName: "", contactEmail: "",
    estateName: "", estateArea: "", gpsLat: "", gpsLon: "", gpsCoords: "",
    monthlyTemp: [27,27,27,28,28,27,27,27,27,27,27,27],
    monthlyRain: [250,220,260,280,260,180,160,150,180,260,300,280],
    ffbCapacity: 60, utilisation: 85, hrsDay: 24, daysMonth: 30,
    efbEnabled: false, opdcEnabled: false,
    posEnabled: false, opfEnabled: false, optEnabled: false,
    custom1Enabled: false, custom2Enabled: false,
    capacityConfirmed: false, streamsConfirmed: false,
    mixInputMode: "pct",
    efbMC: 62.5, opdcMC: 70, pksaMC: 5,  // BUG-01 FIX: EFB canonical MC = 62.5% wb
    pomeSludgeMC: 82,
    pomeSludgeDewatered: false,
    pomeSludgeFeResult: "",
    pomeEnabled: false,
    pkeEnabled: false,
    pkeTPD: 5,
    cnTarget: 22,
    soil: "ultisol", ag: "vgam",
    // ── RESIDUE CAPTURE % OVERRIDES (carbon model) ──
    efbCapturePct: 100,    // % of generated EFB captured by CFI (vs left on field/burned)
    opdcCapturePct: 100,   // % of OPDC captured
    pomeCapturePct: 100,   // % of POME sludge captured
    // ── CARBON CREDIT INPUTS ──
    carbonPriceScenario: "mid",  // low/mid/high/custom
    carbonPriceCustom: 25,       // $/t CO2e if custom
    carbonGwp: "100yr",          // 100yr / 20yr
    carbonBaselineMCF: "shallow", // shallow(0.4) / deep(0.85)
    carbonPomeMCF: "pond",        // pond(0.8) / lagoon(0.01)
    // ── DMPP N₂O SUPPRESSION MODULE ──
    dmppEnabled:    false,   // toggle — enables N₂O suppression credit pathway
    dmppDose:       1.5,     // kg DMPP per tonne frass (wet weight) — commercial range 1-2 kg/t
    dmppCostPerKg:  9,       // $/kg DMPP — commercial range $8-15/kg
    // ── STREAM MIX (pct or kg) ──
    efbMixPct: 0, opdcMixPct: 0, posMixPct: 0, opfMixPct: 0, optMixPct: 0,
    pkeMixPct: 0, custom1MixPct: 0, custom2MixPct: 0,
    efbMixKg: 0, opdcMixKg: 0, posMixKg: 0, opfMixKg: 0, optMixKg: 0,
    pkeMixKg: 0, custom1MixKg: 0, custom2MixKg: 0,
    custom1Label: "Custom 1", custom2Label: "Custom 2",
  });

  const upS0 = (k,v) => setS0(p=>({...p,[k]:v}));

  // ── S0 DERIVED ──
  const effFFB    = useMemo(()=> +(s0.ffbCapacity * s0.utilisation/100).toFixed(2), [s0.ffbCapacity, s0.utilisation]);
  const monthFFB  = useMemo(()=> +(effFFB * s0.hrsDay * s0.daysMonth).toFixed(0), [effFFB, s0.hrsDay, s0.daysMonth]);
  const efbTPH    = useMemo(()=> +(effFFB * 0.225).toFixed(3), [effFFB]);
  const efbTPD    = useMemo(()=> +(efbTPH * s0.hrsDay).toFixed(1), [efbTPH, s0.hrsDay]);
  const efbMonthWet= useMemo(()=> +(efbTPD * s0.daysMonth).toFixed(0), [efbTPD, s0.daysMonth]);
  const efbDMFrac = useMemo(()=> +((100-s0.efbMC)/100).toFixed(3), [s0.efbMC]);
  const efbDMpd   = useMemo(()=> +(efbTPD * efbDMFrac).toFixed(1), [efbTPD, efbDMFrac]);
  // OPDC: 15.2% of EFB fresh weight
  const opdcNatTPD= useMemo(()=> +(efbTPD * 0.152).toFixed(2), [efbTPD]);
  const opdcNatDM = useMemo(()=> +(opdcNatTPD * (100-s0.opdcMC)/100).toFixed(2), [opdcNatTPD, s0.opdcMC]);
  // ── FIX-01/09: OPDC uses actual decanter yield — no phantom totalDMTarget ──
  // Natural ratio at 60 TPH: EFB ~89% DM / OPDC ~11% DM. Formula-driven, not user-set.
  const opdcDMreq     = opdcNatDM;  // OPDC supply = actual decanter output (15.2% of EFB FW × DM frac)
  const opdcShortfall = 0;          // No shortfall — we use what the mill produces
  // FIX-03: pomeActive governed by user toggle only — POS inclusion via Fe gate, not blend remainder
  const pomeActive    = s0.pomeEnabled;
  const blendOK       = true;
  // Monthly substrate entering Stage 3
  const s1_efbMonthDM  = +(efbDMpd * s0.daysMonth).toFixed(0);
  const s1_opdcMonthDM = +(opdcDMreq * s0.daysMonth).toFixed(0);
  const s1_blendDM     = +(s1_efbMonthDM + s1_opdcMonthDM).toFixed(0);
  // ── BLEND MC (wet-weight-weighted — FIX-10: uses natural tonnage fractions not phantom 60:40) ──
  const efbDMfrac2     = (100 - s0.efbMC) / 100;
  const opdcDMfrac2    = (100 - s0.opdcMC) / 100;
  const _baseTotalDM   = efbDMpd + opdcDMreq;
  const _pctEFB_w      = _baseTotalDM > 0 ? efbDMpd / _baseTotalDM : 0.89;
  const _pctOPDC_w     = _baseTotalDM > 0 ? opdcDMreq / _baseTotalDM : 0.11;
  const blendWetPerDM  = _pctEFB_w / efbDMfrac2 + _pctOPDC_w / opdcDMfrac2;
  const blendMC        = +(100 * (1 - 1/blendWetPerDM)).toFixed(1);
  const blendDMfrac    = (100 - blendMC)/100;
  const s1_blendWet    = +(s1_blendDM / blendDMfrac).toFixed(0);

  // ── POME SLUDGE DERIVED — auto-fills DM remainder ────────────────────────
  const pomeSludgeNatTPD   = +(effFFB * s0.hrsDay * 0.0245).toFixed(1);
  const pomeSludgeActMC    = s0.pomeSludgeDewatered ? 65 : s0.pomeSludgeMC;
  const pomeSludgeDMfrac   = (100 - pomeSludgeActMC) / 100;
  const pomeSludgeDMpd     = +(pomeSludgeNatTPD * pomeSludgeDMfrac).toFixed(2);
  // Fe-driven max inclusion (guard — used for alerts only; auto logic respects supply cap)
  const pomeFe             = parseFloat(s0.pomeSludgeFeResult);
  const pomeSludgeFeStatus = isNaN(pomeFe) ? "UNtested"
    : pomeFe < 3000 ? "LOW" : pomeFe < 5000 ? "MODERATE" : pomeFe < 8000 ? "HIGH" : "CRITICAL";
  const pomeSludgeMaxPct   = isNaN(pomeFe) ? 20
    : pomeFe < 3000 ? 20 : pomeFe < 5000 ? 15 : pomeFe < 8000 ? 10 : 5;
  // FIX-03/09: POS inclusion driven by Fe gate max %, not blend remainder phantom total
  const pomeSludgeEnabled  = pomeActive;
  const pomeDMreq          = +(pomeSludgeNatTPD * (pomeSludgeMaxPct/100) * pomeSludgeDMfrac).toFixed(2);  // Fe-gate capped
  const pomeWetReq         = pomeSludgeDMfrac > 0 ? +(pomeDMreq / pomeSludgeDMfrac).toFixed(1) : 0;
  const pomeSupplyOK       = pomeWetReq <= pomeSludgeNatTPD * 1.001;
  const pomeShortfall      = +Math.max(0, pomeWetReq - pomeSludgeNatTPD).toFixed(1);
  const pomeDilutionFactor = pomeSludgeDMfrac > 0 ? +(1 / pomeSludgeDMfrac).toFixed(2) : 0;
  // Effective (capped at mill supply if over)
  const pomeSludgeInclTPD  = pomeActive ? Math.min(pomeWetReq, pomeSludgeNatTPD) : 0;
  const pomeSludgeInclDMpd = +(pomeSludgeInclTPD * pomeSludgeDMfrac).toFixed(2);
  // Legacy alias for downstream refs
  const pomeSludgeInclPct  = pomeSludgeNatTPD > 0 ? +(pomeSludgeInclTPD / pomeSludgeNatTPD * 100).toFixed(1) : 0;
  const pomePct            = pomeSludgeInclPct;
  const pomeSludgeInclDM   = pomeSludgeInclDMpd;
  // NPK from POME SLUDGE (kg/day) — canonical values per t DM
  const pomeN_kgpd  = +(pomeSludgeInclDMpd * 17.6).toFixed(1);
  const pomeP_kgpd  = +(pomeSludgeInclDMpd * 4.0).toFixed(1);
  const pomeK_kgpd  = +(pomeSludgeInclDMpd * 7.0).toFixed(1);

  // ══════════════════════════════════════════════════════════════════════════
  // CARBON CREDITS — IPCC FOD (SOLID RESIDUES) + COD METHOD (POME)
  // Methodology: IPCC 2006 GL Vol.5 Ch.2; Verra ACM0022 v3.1; IPCC AR5 GWP
  // ══════════════════════════════════════════════════════════════════════════

  // ── IPCC CONSTANTS (locked — do not override) ──────────────────────────
  const C_DOC_EFB    = 0.45;   // Degradable Organic Carbon fraction — EFB/OPDC; IPCC Tier 1
  const C_DOCf_EFB   = 0.50;   // Fraction DOC that decomposes; IPCC default
  const C_DOC_POME   = 0.35;   // POME sludge DOC
  const C_DOCf_POME  = 0.70;   // POME sludge DOCf — higher VS content
  const C_F          = 0.50;   // CH4 fraction in landfill gas; IPCC default
  const C_1612       = 16/12;  // Molar conversion C→CH4
  const C_GWP100     = 28;     // CH4 GWP 100yr; IPCC AR5
  const C_GWP20      = 84;     // CH4 GWP 20yr; IPCC AR5
  const C_kWhperCH4  = 15417;  // kWh/t CH4; LHV 50.05 MJ/kg × 0.35 efficiency
  // POME COD method constants
  const C_COD        = 59.195; // kg COD/m³; engineering report average
  const C_B0         = 0.25;   // kg CH4/kg COD; IPCC wastewater default
  const C_POME_m3tFFB= 0.60;   // m³ POME per tonne FFB processed

  // ── MCF SELECTION ──────────────────────────────────────────────────────
  const MCF_solid_baseline = s0.carbonBaselineMCF === "deep" ? 0.85 : 0.40;
  const MCF_solid_project  = 0.01; // CFI aerobic BSF treatment; Verra ACM0022 v3.1
  const MCF_pome_baseline  = s0.carbonPomeMCF === "lagoon" ? 0.01 : 0.80;
  const MCF_pome_project   = 0.01; // Covered lagoon + flare/CHP

  // ── CAPTURE-ADJUSTED DM (monthly) ──────────────────────────────────────
  // EFB: 22.5% of FFB processed; adjusted by capture %
  const carbon_efbDMmo  = +(monthFFB * 0.225 * (1-s0.efbMC/100) * (s0.efbCapturePct/100)).toFixed(1);
  // OPDC: 4.56% of FFB; adjusted by capture %
  const carbon_opdcDMmo = +(monthFFB * 0.042 * (1-s0.opdcMC/100) * (s0.opdcCapturePct/100)).toFixed(1);  // BUG-09 FIX: OPDC = 4.2% FFB canonical (was 0.0456)
  // POME sludge DM: already computed as pomeSludgeNatTPD × 30 days × capture %
  const carbon_pomeDMmo = +(pomeSludgeNatTPD * s0.daysMonth * pomeSludgeDMfrac * (s0.pomeCapturePct/100)).toFixed(1);
  // POME liquid volume (for COD method)
  const carbon_pomeVol  = +(monthFFB * C_POME_m3tFFB * (s0.pomeCapturePct/100)).toFixed(0);

  // ── SOLID RESIDUES — IPCC FOD FORMULA ──────────────────────────────────
  // Formula: CH4 (t/mo) = DM × DOC × DOCf × MCF × F × (16/12)
  // BASELINE
  const ch4_efb_base  = +(carbon_efbDMmo  * C_DOC_EFB  * C_DOCf_EFB  * MCF_solid_baseline * C_F * C_1612).toFixed(3);
  const ch4_opdc_base = +(carbon_opdcDMmo * C_DOC_EFB  * C_DOCf_EFB  * MCF_solid_baseline * C_F * C_1612).toFixed(3);
  const ch4_sludge_base=+(carbon_pomeDMmo * C_DOC_POME * C_DOCf_POME * MCF_solid_baseline * C_F * C_1612).toFixed(3);
  const ch4_solids_base= +(ch4_efb_base + ch4_opdc_base + ch4_sludge_base).toFixed(3);
  // PROJECT
  const ch4_efb_proj  = +(carbon_efbDMmo  * C_DOC_EFB  * C_DOCf_EFB  * MCF_solid_project  * C_F * C_1612).toFixed(3);
  const ch4_opdc_proj = +(carbon_opdcDMmo * C_DOC_EFB  * C_DOCf_EFB  * MCF_solid_project  * C_F * C_1612).toFixed(3);
  const ch4_sludge_proj=+(carbon_pomeDMmo * C_DOC_POME * C_DOCf_POME * MCF_solid_project  * C_F * C_1612).toFixed(3);
  const ch4_solids_proj= +(ch4_efb_proj + ch4_opdc_proj + ch4_sludge_proj).toFixed(3);
  // AVOIDED SOLIDS
  const ch4_solids_avoid = +(ch4_solids_base - ch4_solids_proj).toFixed(3);
  const co2e100_solids   = +(ch4_solids_avoid * C_GWP100).toFixed(1);
  const co2e20_solids    = +(ch4_solids_avoid * C_GWP20).toFixed(1);
  const kwh_solids       = +(ch4_solids_avoid * C_kWhperCH4).toFixed(0);

  // ── POME PONDS — COD METHOD ────────────────────────────────────────────
  // Formula: CH4 (t/mo) = Volume_m3 × COD_kg/m3 × B0_kg/kg × MCF ÷ 1000
  const ch4_pome_base  = +(carbon_pomeVol * C_COD * C_B0 * MCF_pome_baseline / 1000).toFixed(3);
  const ch4_pome_proj  = +(carbon_pomeVol * C_COD * C_B0 * MCF_pome_project  / 1000).toFixed(3);
  const ch4_pome_avoid = +(ch4_pome_base - ch4_pome_proj).toFixed(3);
  const co2e100_pome   = +(ch4_pome_avoid * C_GWP100).toFixed(1);
  const co2e20_pome    = +(ch4_pome_avoid * C_GWP20).toFixed(1);
  const kwh_pome       = +(ch4_pome_avoid * C_kWhperCH4).toFixed(0);

  // ── COMBINED TOTALS ────────────────────────────────────────────────────
  const ch4_total_avoid   = +(ch4_solids_avoid + ch4_pome_avoid).toFixed(2);
  const co2e100_total_mo  = +(co2e100_solids + co2e100_pome).toFixed(1);
  const co2e20_total_mo   = +(co2e20_solids  + co2e20_pome).toFixed(1);
  const kwh_total_mo      = +(kwh_solids + kwh_pome).toFixed(0);
  const co2e100_annual    = +(co2e100_total_mo * 12).toFixed(0);
  const co2e20_annual     = +(co2e20_total_mo  * 12).toFixed(0);
  const ch4_annual        = +(ch4_total_avoid  * 12).toFixed(0);
  // Credits use CO2e-100yr (standard for Verra VCS)
  const gwpMultiplier     = s0.carbonGwp === "20yr" ? C_GWP20 : C_GWP100;
  const credits_annual    = s0.carbonGwp === "20yr" ? co2e20_annual : co2e100_annual;
  // ── REVENUE ──────────────────────────────────────────────────────────────
  const carbonPriceLow    = 20;  // $/t — Indonesian voluntary market floor
  const carbonPriceMid    = 25;  // $/t — Verra VCS / Gold Standard mid
  const carbonPriceHigh   = 30;  // $/t — Premium biodiversity-linked
  const carbonPriceActive = s0.carbonPriceScenario==="low"    ? carbonPriceLow
                          : s0.carbonPriceScenario==="high"   ? carbonPriceHigh
                          : s0.carbonPriceScenario==="custom" ? (+s0.carbonPriceCustom||25)
                          : carbonPriceMid;
  const carbon_rev_annual = +(credits_annual * carbonPriceActive).toFixed(0);
  const carbon_rev_monthly= +(carbon_rev_annual / 12).toFixed(0);


  // ── PKE DERIVED ──────────────────────────────────────────────────────────
  const pkeDMpd      = s0.pkeEnabled ? +(s0.pkeTPD * 0.88).toFixed(2) : 0;
  const pkeNpd       = +(pkeDMpd * 28.8).toFixed(1);  // PKE N = CP 18% / 6.25 = 2.88% — FEED ingredient, N×6.25 correct
  const pkeCostDay   = +(s0.pkeTPD * 160).toFixed(0);

  // ── COMBINED 3-STREAM NPK (kg/day) ───────────────────────────────────────
  const efbN_kgpd    = +(efbDMpd * 8.5).toFixed(1);   // EFB N = 0.85% DM measured midpoint (range 0.76–0.90%)
  const efbP_kgpd    = +(efbDMpd * 3.0).toFixed(1);   // EFB P = 0.30% DM locked (high-yield estate)
  const efbK_kgpd    = +(efbDMpd * 20.0).toFixed(1);  // EFB K = 2.0% DM locked (high-yield estate range 2.0–2.40%)
  const opdcN_kgpd   = +(opdcDMreq * 26.0).toFixed(1); // OPDC N = 2.60% DM locked (measured midpoint 2.38–2.93%)
  const opdcP_kgpd   = +(opdcDMreq * 4.5).toFixed(1);  // OPDC P = 0.45% DM locked (midpoint 0.39–0.51%)
  const opdcK_kgpd   = +(opdcDMreq * 18.0).toFixed(1); // OPDC K = 1.80% DM locked (midpoint 1.24–2.39%)
  const totalN_kgpd  = +(efbN_kgpd + opdcN_kgpd + pomeN_kgpd + pkeNpd).toFixed(1);
  const totalP_kgpd  = +(efbP_kgpd + opdcP_kgpd + pomeP_kgpd).toFixed(1);
  const totalK_kgpd  = +(efbK_kgpd + opdcK_kgpd + pomeK_kgpd).toFixed(1);
  const totalDMpd    = +(efbDMpd + opdcDMreq + pomeSludgeInclDMpd + pkeDMpd).toFixed(1);

  // Blend C:N (DM-weighted)
  const blendCN_efb    = efbDMpd * 8.5 * 60;    // EFB N=8.5 kg/t DM (0.85% measured) × C:N 60
  const blendCN_opdc   = opdcDMreq * 26.0 * 20;  // OPDC N=26.0 kg/t DM (2.60% locked) × C:N 20
  // FIX-02: POS C:N is a CONFIRMED DATA GAP — no peer-reviewed value for centrifuge discharge POS
  // C:N=15 is unverified. Excluded from blendCN until ICP-OES result received (Balai Penelitian Tanah Bogor).
  const POS_CN_DATAGAP = true;
  const blendCN_pome   = 0;  // FIX-02: POS excluded from C:N calc — DATA GAP
  const pkeCN_calc     = 45 / 3.86;  // FIX-11: formula-driven; pkeC=45% DM, pkeN=3.86% DM → C:N≈11.7
  const blendCN_pke    = pkeDMpd * 28.8 * pkeCN_calc;  // PKE N=28.8 kg/t DM × C:N 11.7
  const blendCN_totalN = efbN_kgpd + opdcN_kgpd + (POS_CN_DATAGAP ? 0 : pomeN_kgpd) + pkeNpd;  // FIX-02: POS excluded
  const blendCN_totalC = blendCN_efb + blendCN_opdc + blendCN_pome + blendCN_pke;
  const blendCN        = blendCN_totalN > 0 ? +(blendCN_totalC / blendCN_totalN).toFixed(1) : null;

  // Blend CP % DM (DM-weighted crude protein across all active streams)
  const blendCP = totalDMpd > 0
    ? +((efbDMpd*4.75 + opdcDMreq*14.5 + pomeSludgeInclDMpd*11.0 + pkeDMpd*18.0) / totalDMpd).toFixed(2)
    : null;

  // % of total substrate DM per stream
  const pctEFB  = totalDMpd > 0 ? +(efbDMpd           / totalDMpd * 100).toFixed(1) : 0;
  const pctOPDC = totalDMpd > 0 ? +(opdcDMreq          / totalDMpd * 100).toFixed(1) : 0;
  const pctPOME = totalDMpd > 0 ? +(pomeSludgeInclDMpd / totalDMpd * 100).toFixed(1) : 0;
  const pctPKE  = totalDMpd > 0 ? +(pkeDMpd            / totalDMpd * 100).toFixed(1) : 0;

  // PKE recommended dose to hit s0.cnTarget (back-solved from DM-weighted C:N formula)
  const baseDM3    = efbDMpd + opdcDMreq + pomeSludgeInclDMpd;
  const baseCN3    = blendCN_totalN > pkeNpd
    ? +((blendCN_efb + blendCN_opdc + blendCN_pome) / (efbN_kgpd + opdcN_kgpd + pomeN_kgpd)).toFixed(1)
    : blendCN;
  const pkeRecDM   = baseDM3 > 0 && baseCN3 && baseCN3 > s0.cnTarget && s0.cnTarget > 15
    ? +(baseDM3 * (baseCN3 - s0.cnTarget) / (s0.cnTarget - 15)).toFixed(2) : 0;
  const pkeRecWet  = pkeRecDM > 0 ? +(pkeRecDM / 0.88).toFixed(1) : 0;

  // ── S2 STATE ──
  // ── S2 CHEMICAL STATE ─────────────────────────────────────────────────────
  const [s2, setS2] = useState({
    // Primary treatment
    pksa:true,  // BUG-07 FIX: removed duplicate pksa_dose — use pksaDose only (below)
    naoh:false, naoh_dose:3,
    koh:false, koh_dose:2,
    caoh2:false, caoh2_dose:1.5,
    cao:false, cao_dose:1,
    caco3:false, caco3_dose:2,
    mgco3:false, mgco3_dose:1,
    k2co3:false, k2co3_dose:1,
    // Acid
    h2so4:false, h2so4_dose:0.5,
    hcl:false, hcl_dose:0.5,
    citric:false, citric_dose:1,
    paa:false, paa_dose:0.2,
    h2o2:false, h2o2_dose:1,
    // Amendments
    gypsum:false, gypsum_dose:2,
    biochar:false, biochar_dose:3,
    zeolite:false, zeolite_dose:2,
    feso4:false, feso4_dose:0.1,
    humic:false, humic_dose:1,
    woodvinegar:false, woodvinegar_dose:0.3,
    molasses:false, molasses_dose:1,
    phosphate:false, phosphate_dose:1,
    dolomite:false, dolomite_dose:2,
    sulfur:false, sulfur_dose:0.5,
    bentonite:false, bentonite_dose:2,
    tween80:false, tween80_dose:0.3,
    lactic:false, lactic_dose:1,
    struvite:false, struvite_dose:1,
    urea:false, urea_dose:1.5,
    ammoniumsulf:false, ammoniumsulf_dose:2,
    // Enzymes (better in S3 but can add here)
    cellulase_s2:false, xylanase_s2:false,
    laccase_s2:false, mnp_s2:false, lip_s2:false,
    // Settings
    pksaDose:8,
    additionalChemical:"",
  });
  const upS2 = (k,v) => setS2(p=>({...p,[k]:v}));

  // ── S3 BIOLOGICAL STATE ───────────────────────────────────────────────────
  const [s3orgs, setS3Orgs] = useState({
    // DEFAULT one-shot protocol (5 organisms)
    lactobacillus:true, saccharomyces:true, bacillus_sub:true,
    azotobacter:true, trichoderma_h:true,
    // All others off by default
    thermomyces:false, myceliophthora:false, chaetomium:false,
    geobacillus:false, bacillus_lich:false, thermobifida:false,
    phanerochaete_sp:false, phanerochaete_chry:false,
    pleurotus:false, trametes:false, ganoderma:false,
    aspergillus_n:false, aspergillus_o:false,
    microbacterium:false, paenibacillus:false,
    bacillus_meg:false, cellulomonas:false,
    azospirillum:false, bradyrhizobium:false,
    pseudomonas:false, bacillus_coag:false,
    bacillus_muc:false, frateuria:false,
    streptomyces_a:false, streptomyces_b:false,
    bt_icbb:false,  // PERMITTED with red alert
    // Enzymes
    cellulase_e:false, xylanase_e:false, laccase_e:false,
    pectinase_e:false, lipase_e:false, protease_e:false,
    amylase_e:false, mannanase_e:false, bglucosidase_e:false,
    // Legacy
    provibio_full:false, em4:false,
    // Custom
    customOrg:"",
  });
  const upS3 = (k,v) => setS3Orgs(p=>({...p,[k]:v}));

  // ── S3 GATE MEASUREMENTS STATE ────────────────────────────────────────────
  const [s3, setS3Gate] = useState({
    cn_measured:    "",   // user enters actual C:N from lab
    mc_measured:    "",   // user enters actual moisture %
    ph_measured:    "",   // user enters actual pH
    temp_measured:  "",   // user enters actual substrate temp °C
    bt_confirmed_absent: false,
    visual_ok:      false,
    consortium:     "one-shot",
  });
  const upS3Gate = (k,v) => setS3Gate(p=>({...p,[k]:v}));

  // ── S2 CONFLICT DETECTION ─────────────────────────────────────────────────
  const s2Conflicts = [];
  if(s2.naoh) s2Conflicts.push({id:"naoh_alert",sev:"amber",msg:" NaOH active — Na⁺ residues toxic to BSF above 0.3% DM. Mandatory rinse cycle required before BSF introduction. Monitor substrate Na after neutralisation."});  // BUG-06 FIX: GR-11 — NaOH = AMBER not red
  if(s2.paa && (s0.rspo==="certified"||s0.rspo==="certified_adv")) s2Conflicts.push({id:"paa_rspo",sev:"red",msg:"PAA is RSPO-RESTRICTED. RSPO certification is active — PAA triggers mandatory third-party audit. Remove or document."});
  if((s2.cellulase_s2||s2.xylanase_s2||s2.laccase_s2||s2.mnp_s2||s2.lip_s2)) s2Conflicts.push({id:"enzyme_s2",sev:"amber",msg:"Enzymes selected in S2. Enzymes denature above 55°C — apply ONLY after substrate cools below 45°C. Recommend moving to S3 (biological phase) where temperature is controlled."});
  if(s2.h2so4 || s2.hcl) s2Conflicts.push({id:"acid_neutralise",sev:"amber",msg:"Acid treatment active — mandatory neutralisation to pH 6.5–8.0 required before S3 biological inoculation. Allow additional 12–24hr neutralisation time."});
  if(s2.paa && (s3orgs.lactobacillus||s3orgs.saccharomyces||s3orgs.bacillus_sub||s3orgs.azotobacter||s3orgs.trichoderma_h)) s2Conflicts.push({id:"paa_microbes",sev:"red",msg:"PAA kills all microorganisms at >50 ppm. S3 biological inoculation requires complete PAA degradation (pH 6–7 + 24hr) before organism introduction."});

  // ── S3 CONFLICT DETECTION ─────────────────────────────────────────────────
  const s3Conflicts = [];
  if(s3orgs.bt_icbb) s3Conflicts.push({id:"bt_bsf",sev:"amber",msg:" Bt (Bacillus thuringiensis) ICBB 6095 IS ACTIVE — ALLOWED but USE WITH CAUTION. Cry1A + Cry3A proteins are toxic to Diptera larvae at high concentrations. Recommended: Apply Bt only during S3 composting phase (Wave 1/2) BEFORE BSF introduction. Confirm Bt titre has degraded below 10⁴ CFU/g before S4 loading. Monitor larvae for early mortality signs (Day 1–3)."});
  if(s2.feso4 && (s3orgs.laccase_e||s3orgs.cellulase_e||s3orgs.xylanase_e)) s3Conflicts.push({id:"feso4_mnp",sev:"red",msg:"FeSO₄ active in S2. Fe³⁺ formed via oxidation is a competitive inhibitor of MnP at the haem active site. Remove FeSO₄ or remove MnP-producing organisms (Phanerochaete, Trametes)."});
  if((s3orgs.cellulase_e||s3orgs.xylanase_e||s3orgs.laccase_e)&&(s3orgs.geobacillus||s3orgs.bacillus_lich||s3orgs.thermomyces)) s3Conflicts.push({id:"enzyme_thermo",sev:"amber",msg:"Enzymes and thermophilic organisms selected. Apply enzymes ONLY after thermophilic phase ends (<45°C). Enzymes irreversibly denature during thermophilic phase (>55°C). Use two-wave protocol: Wave 1 = thermophiles, Wave 2 = enzymes + mesophiles."});
  if(s3orgs.ganoderma) s3Conflicts.push({id:"ganoderma_risk",sev:"amber",msg:"Ganoderma lucidum selected — this species is closely related to G. boninense, the primary oil palm pathogen in Indonesia. Verify strain identity with supplier before use. Not recommended near active plantation."});
  if(s3orgs.azotobacter && s3orgs.bt_icbb) s3Conflicts.push({id:"azot_bt",sev:"amber",msg:"Azotobacter vinelandii is temperature-sensitive — must apply AFTER substrate cools below 50°C (Wave 2). Do not apply simultaneously with thermophilic bacteria."});

  // ── S2 DERIVED VALUES ─────────────────────────────────────────────────────
  // Lignin reduction from active chemicals
  const ligninReductions = {
    pksa:32, naoh:66, koh:35, caoh2:18, cao:22, caco3:3, mgco3:3, k2co3:22,
    h2so4:17, hcl:16, citric:6, paa:40, h2o2:12,
    gypsum:3, feso4:7, laccase_s2:5, lip_s2:20, mnp_s2:14,
    cellulase_s2:0, xylanase_s2:2, tween80:4,
  };
  let totalLigninRed = 0;
  const activeLigninChems = [];
  Object.keys(ligninReductions).forEach(k=>{
    if(s2[k]) { 
      const r = ligninReductions[k];
      totalLigninRed = Math.min(85, totalLigninRed + r * 0.7); // diminishing returns
      activeLigninChems.push({k, r});
    }
  });

  // S2 cost calculation (per t FW)
  const chemCosts = {
    pksa:0, naoh:0.12, koh:0.18, caoh2:0.08, cao:0.06, caco3:0.04,
    mgco3:0.06, k2co3:0.22, h2so4:0.05, hcl:0.07, citric:0.15,
    paa:0.45, h2o2:0.10, gypsum:0.04, biochar:0.08, zeolite:0.10,
    feso4:0.03, humic:0.12, woodvinegar:0.02, molasses:0.08,
    phosphate:0.06, dolomite:0.05, sulfur:0.03, bentonite:0.08,
    tween80:0.18, lactic:0.10, struvite:0.12, urea:0.15, ammoniumsulf:0.12,
    cellulase_s2:0.35, xylanase_s2:0.40, laccase_s2:0.50, mnp_s2:0.45, lip_s2:0.55,
  };
  let s2CostPerT = 0;
  Object.keys(chemCosts).forEach(k=>{ if(s2[k]) s2CostPerT += chemCosts[k]; });
  const s2MonthlyCost = Math.round(s1_blendWet * s2CostPerT);

  // ── S3 DERIVED VALUES ─────────────────────────────────────────────────────
  const orgCosts = {
    lactobacillus:0.05, saccharomyces:0.11, bacillus_sub:0.02,
    azotobacter:0.05, trichoderma_h:0.42, thermomyces:0.08, myceliophthora:0.12,
    chaetomium:0.14, geobacillus:0.04, bacillus_lich:0.03,
    phanerochaete_sp:0.12, phanerochaete_chry:0.12, pleurotus:0.02,
    trametes:0.04, ganoderma:0.03, aspergillus_n:0.06, aspergillus_o:0.04,
    microbacterium:0.05, paenibacillus:0.05, bacillus_meg:0.03,
    cellulomonas:0.06, azospirillum:0.04, bradyrhizobium:0.05,
    pseudomonas:0.06, bacillus_coag:0.04, bacillus_muc:0.05,
    frateuria:0.06, streptomyces_a:0.08, streptomyces_b:0.08,
    bt_icbb:0.01, cellulase_e:0.35, xylanase_e:0.40, laccase_e:0.50,
    pectinase_e:0.28, lipase_e:0.42, protease_e:0.22, amylase_e:0.18,
    mannanase_e:0.55, bglucosidase_e:0.65, provibio_full:0.80, em4:0.12,
  };
  let s3CostPerT = 0;
  Object.keys(orgCosts).forEach(k=>{ if(s3orgs[k]) s3CostPerT += orgCosts[k]; });

  // Consortium uplift (based on what's active)
  const ligninOrgs = [s3orgs.trichoderma_h, s3orgs.phanerochaete_sp, s3orgs.phanerochaete_chry, s3orgs.pleurotus, s3orgs.trametes].filter(Boolean).length;
  const nfixOrgs   = [s3orgs.azotobacter, s3orgs.azospirillum, s3orgs.bradyrhizobium].filter(Boolean).length;
  const enzymeOrgs = [s3orgs.cellulase_e, s3orgs.xylanase_e, s3orgs.laccase_e, s3orgs.mannanase_e].filter(Boolean).length;
  const upliftFactor = +(1.0 + ligninOrgs*0.08 + nfixOrgs*0.05 + enzymeOrgs*0.10 + (s3orgs.trichoderma_h?0.15:0)).toFixed(2);

  // BSF handoff gate // after PKSA neutralisation assumed // assumed after 5-day bio

  // Total lignin reduction from ALL active S2 chemicals (diminishing returns)
  const _ligRed = {pksa:33,naoh:66,koh:35,caoh2:18,cao:22,caco3:3,mgco3:3,k2co3:22,h2so4:17,hcl:16,citric:6,paa:40,h2o2:12,gypsum:3,feso4:7,laccase_s2:5,lip_s2:20,mnp_s2:14,cellulase_s2:0,xylanase_s2:2,tween80:4};
  let _tlr = 0; Object.keys(_ligRed).forEach(k=>{ if(s2[k]) _tlr = Math.min(85, _tlr + _ligRed[k]*(1-_tlr/100)); });
  const pksa_ligninRed = Math.round(_tlr);

  // S3 costs cascade from active organisms
  const s3_monthlyFW = s1_blendWet;

  // BSF handoff gate — use pipeline-calculated values; user-entered measurements override
  const btPass  = s3.bt_confirmed_absent;
  const visPass = s3.visual_ok;
  const cnGate  = s3.cn_measured !== "" ? parseFloat(s3.cn_measured) : blendCN;
  const mcGate  = s3.mc_measured !== "" ? parseFloat(s3.mc_measured) : blendMC;
  const phGate  = s3.ph_measured !== "" ? parseFloat(s3.ph_measured) : (s2.pksa ? 7.0 : null);
  const tmpGate = s3.temp_measured !== "" ? parseFloat(s3.temp_measured) : null;
  const cnPass  = cnGate !== null && !isNaN(cnGate) && cnGate <= 35;
  const mcPass  = mcGate !== null && !isNaN(mcGate) && mcGate >= 55 && mcGate <= 75;
  const phPass  = phGate !== null && !isNaN(phGate) && phGate >= 6.5 && phGate <= 8.0;
  const tmpPass = tmpGate !== null && !isNaN(tmpGate) && tmpGate <= 30;
  const allPass = cnPass && mcPass && phPass && tmpPass && btPass && visPass;
  // Monthly bio cost
  const s3_monthlyCost = Math.round(s3_monthlyFW * s3CostPerT);
  const s3_annualCost  = s3_monthlyCost * 12;

  // ── FULL PIPELINE LAB DERIVATION (formula-driven, responds to S2+S3 choices) ──────────────
  // S0 raw blend baseline
  // FIX-04: use actual DM fractions (~89% EFB / ~11% OPDC) not phantom efbPct/opdcPct
  const _labTotalDM   = efbDMpd + opdcDMreq + (pomeActive ? pomeSludgeInclDMpd : 0);
  const _labEFBfrac   = _labTotalDM > 0 ? efbDMpd / _labTotalDM : 0.89;
  const _labOPDCfrac  = _labTotalDM > 0 ? opdcDMreq / _labTotalDM : 0.11;
  const _labPOMEfrac  = _labTotalDM > 0 && pomeActive ? pomeSludgeInclDMpd / _labTotalDM : 0;
  const lab_s0_lignin  = blendCN ? +(_labEFBfrac*22 + _labOPDCfrac*30.7 + _labPOMEfrac*7.6).toFixed(1) : 25;
  const lab_s0_CN      = blendCN || 32;
  const lab_s0_N       = +(totalDMpd>0 ? totalN_kgpd/totalDMpd/10 : 0.95).toFixed(2);
  const lab_s0_P       = +(totalDMpd>0 ? totalP_kgpd/totalDMpd/10 : 0.14).toFixed(2);
  const lab_s0_K       = +(totalDMpd>0 ? totalK_kgpd/totalDMpd/10 : 0.83).toFixed(2);
  const lab_s0_OM      = +(_labEFBfrac*85 + _labOPDCfrac*78 + _labPOMEfrac*72 + (s0.pkeEnabled?pctPKE/100*82:0)).toFixed(1);  // FIX-04
  const lab_s0_CP      = blendCP || 8.0;
  const lab_s0_pH      = 5.5;

  // S2: chemicals applied — each chemical shifts specific lab parameters
  // Lignin: full diminishing-return calc already done → pksa_ligninRed
  const lab_s2_lignin  = +(lab_s0_lignin * (1 - pksa_ligninRed/100)).toFixed(1);
  // Hemicellulose reduction from S2 enzymes (cellulase, xylanase, mannanase, LiP, MnP)
  const hemiRed_s2 = Math.min(55, (s2.cellulase_s2?12:0)+(s2.xylanase_s2?18:0)+(s2.mnp_s2?8:0)+(s2.lip_s2?14:0)+(s2.laccase_s2?6:0));
  const lab_s2_hemi    = +(28.2 * (1 - hemiRed_s2/100)).toFixed(1); // baseline NDF 28.2% DM
  // N: alkaline treatment can volatilise NH3 at high pH (NaOH worst); acidic treatment preserves N
  const nVolatLoss = s2.naoh?0.12 : s2.koh?0.08 : s2.pksa?0.04 : 0;
  const nConc = (s2.pksa||s2.naoh||s2.koh||s2.caoh2) ? 0.15 : 0; // concentration effect from OM loss
  const lab_s2_N       = +(lab_s0_N * (1 - nVolatLoss) * (1 + nConc)).toFixed(2);
  // C:N: alkaline reduces lignin (C) faster than N → C:N drops; but N volatilisation pushes it back up
  const ligninCReduction = pksa_ligninRed/100 * 0.4; // lignin ~40% of total C
  const lab_s2_CN      = +(lab_s0_CN * (1 - ligninCReduction) * (1 + nVolatLoss)).toFixed(1);
  const lab_s2_OM      = +(lab_s0_OM * (1 - pksa_ligninRed/100 * 0.45)).toFixed(1);
  const lab_s2_CP      = +(lab_s2_N * 4.67 * 100).toFixed(1); // using N×4.67 per guardrail
  const lab_s2_pH      = s2.pksa||s2.naoh||s2.koh ? 7.0 : s2.h2so4||s2.hcl||s2.citric ? 4.5 : s2.caco3||s2.caoh2 ? 7.5 : 5.5;
  const lab_s2_P       = +(lab_s0_P * 1.12).toFixed(2); // slight P concentration
  const lab_s2_K       = s2.pksa ? +(lab_s0_K * 7.7).toFixed(2) : +(lab_s0_K * 1.05).toFixed(2); // PKSA K spike

  // S3: biological treatment
  // Lignin further reduced by fungal/enzymatic activity
  const s3LigninRed = Math.min(40, ligninOrgs*8 + (s3orgs.trichoderma_h?10:0) + enzymeOrgs*6 + (s3orgs.cellulase_e?8:0) + (s3orgs.xylanase_e?10:0) + (s3orgs.mannanase_e?7:0));
  const lab_s3_lignin  = +(lab_s2_lignin * (1 - s3LigninRed/100)).toFixed(1);
  // Hemi further reduced by S3 enzymes
  const hemiRed_s3 = Math.min(55, (s3orgs.cellulase_e?15:0)+(s3orgs.xylanase_e?20:0)+(s3orgs.mannanase_e?14:0)+(s3orgs.bglucosidase_e?8:0)+(s3orgs.pectinase_e?6:0));
  const lab_s3_hemi    = +(lab_s2_hemi * (1 - hemiRed_s3/100)).toFixed(1);
  // N-fixers add N; proteases can mineralise protein → available N up
  const nFixBoost = nfixOrgs * 0.06 + (s3orgs.protease_e?0.04:0) + (s3orgs.bacillus_sub?0.03:0);
  const lab_s3_N       = +(lab_s2_N * (1 + nFixBoost)).toFixed(2);
  const lab_s3_P       = +(lab_s2_P * (1 + (s3orgs.bacillus_meg||s3orgs.pseudomonas||s3orgs.paenibacillus ? 0.08:0) + (s3orgs.aspergillus_n?0.05:0))).toFixed(2);
  const lab_s3_K       = +(lab_s2_K * (1 + (s3orgs.frateuria?0.06:0))).toFixed(2);
  const lab_s3_CN      = +(lab_s2_CN * (1 - s3LigninRed/100*0.5) / (1 + nFixBoost)).toFixed(1);
  const lab_s3_OM      = +(lab_s2_OM * (1 - (ligninOrgs*0.04 + enzymeOrgs*0.03 + (s3orgs.trichoderma_h?0.06:0)))).toFixed(1);
  const lab_s3_CP      = +(lab_s3_N * 4.67 * 100).toFixed(1);
  const lab_s3_pH      = s3orgs.lactobacillus ? +(lab_s2_pH - 0.3).toFixed(1) : s3orgs.azotobacter ? +(lab_s2_pH + 0.1).toFixed(1) : +(lab_s2_pH - 0.1).toFixed(1);

  // S4: BSF rearing concentrates nutrients as OM is consumed
  const lab_s4_lignin  = +(lab_s3_lignin * 0.55).toFixed(1); // gut microbiome degrades ~45% residual
  const lab_s4_N       = +(lab_s3_N * 1.18).toFixed(2); // N concentrates as C consumed
  const lab_s4_P       = +(lab_s3_P * 1.20).toFixed(2);
  const lab_s4_K       = +(lab_s3_K * 1.01).toFixed(2); // K minimal uptake
  const lab_s4_CN      = +(lab_s3_CN * 0.80).toFixed(1); // narrows as C consumed
  const lab_s4_OM      = +(lab_s3_OM * 0.83).toFixed(1); // ~17% OM consumed
  const lab_s4_CP      = +(lab_s4_N * 4.67 * 100).toFixed(1);
  const lab_s4_pH      = +(lab_s3_pH - 0.3).toFixed(1); // mild acidification from frass

  // FCR bidirectional: good chemistry reduces, bad combos raise it
  const fcrPenalty = (s2.naoh && !s2.caco3 && !s2.h2so4 ? 0.10 : 0) // NaOH w/o neutralisation
                   + (s2.urea ? 0.08 : 0)           // excess N → ammonia → BSF stress
                   + (s2.feso4 && !s2.pksa ? 0.06 : 0) // Fe overload without PKSA
                   + (s3orgs.bt_icbb && !s3.bt_confirmed_absent ? 0.15 : 0); // Bt active risk
  const ligninFCRBonus = +(Math.min(0.35, pksa_ligninRed * 0.008) - fcrPenalty).toFixed(3);
  const [s4, setS4] = useState({
    s4tab: "grow",           // "grow" | "pkm" | "lab"
    growDays: 12,            // legacy single-bay (kept for S5/S6 downstream)
    // Dual-track bays
    dualTrack: true,
    bayASplit: 50,           // % substrate to Bay A (protein-optimised)
    bayADays: 9,             // Bay A grow days (6–10)
    bayBDays: 13,            // Bay B grow days (10–18)
    // PKM supplementation
    pkmEnabled: false,
    pkmPct: 30,              // % of substrate DM
    // Pathway & pricing
    pathwayS5: "s5a",
    mealPriceEntry: "",
    oilPriceEntry: "",
    chitinPriceEntry: "",
    frass5aPriceEntry: "",
    frass5bPriceEntry: "",
    certLevel: "none",
    frassCert: "standard",
  });
  const upS4 = (k,v) => setS4(p=>({...p,[k]:v}));

  // ── CARBON ENGINE LOCAL STATE ──────────────────────────────────────────────
  const [ccTab,      setCcTab]      = useState("calc");
  const [ccPriceOff, setCcPriceOff] = useState(20);   // offsetting slider default $20
  const [ccPriceIns, setCcPriceIns] = useState(50);   // insetting slider default $50
  const [ccPathway,  setCcPathway]  = useState("bsf_s4"); // bsf_s4 | fast_compost

  // S4 Derived — linear interpolation Day 6→18 anchors
  const s4_lerp = (a6, a18, d) => +(a6 + (a18-a6) * (d-6)/12).toFixed(2);
  const gd = Math.max(6, Math.min(18, +s4.growDays || 12));

  // ── DUAL-TRACK BAY CALCULATIONS ─────────────────────────────────────────────
  const bayADays = Math.max(6,  Math.min(10, +s4.bayADays || 9));
  const bayBDays = Math.max(10, Math.min(18, +s4.bayBDays || 13));
  const bayASplit = Math.max(0, Math.min(100, +s4.bayASplit || 50));
  const bayBSplit = 100 - bayASplit;

  // Bay A (protein-optimised, Day 6–10): high protein, lower yield
  const bayA_yieldPct    = s4_lerp(14.0, 22.0, bayADays);
  const bayA_proteinDM   = +(44.0 - Math.max(0, bayADays-10)*0.5).toFixed(1); // peaks ~Day 10 at 44%
  const bayA_fatDM       = s4_lerp(28.0, 34.0, bayADays);
  const bayA_FCR         = +(s4_lerp(5.2,  3.5,  bayADays) - ligninFCRBonus).toFixed(2);
  const bayA_moisture    = s4_lerp(72.0, 65.0, bayADays);

  // Bay B (biomass-optimised, Day 10–18): more FW yield, slightly lower protein
  const bayB_yieldPct    = s4_lerp(14.0, 22.0, bayBDays);
  const bayB_proteinDM   = gd <= 12 ? s4_lerp(42.0, 44.0, bayBDays) : +(44.0 - (bayBDays-12)*(6/6)).toFixed(2);
  const bayB_fatDM       = s4_lerp(28.0, 34.0, bayBDays);
  const bayB_FCR         = +(s4_lerp(5.2,  3.5,  bayBDays) - ligninFCRBonus).toFixed(2);
  const bayB_moisture    = s4_lerp(72.0, 65.0, bayBDays);

  // Larvae yield (% of substrate FW) — legacy single-bay
  const larvYieldPct    = s4_lerp(14.0, 22.0, gd);
  // Protein %DM — peaks ~Day12: lerp 42→44→38 (use quadratic approx via two lerps)
  const larvProteinDM   = gd <= 12 ? s4_lerp(42.0, 44.0, gd) : +(44.0 - (gd-12)*(6/6)).toFixed(2);
  const larvFatDM       = s4_lerp(28.0, 34.0, gd);
  const larvFCR         = +(s4_lerp(5.2,  3.5,  gd) - ligninFCRBonus).toFixed(2);
  const larvAshDM       = 16.0;
  const larvChitinDM    = 9.3;
  const larvMoisture    = s4_lerp(72.0, 65.0, gd);

  // Weighted combined larvae profile (dual-track)
  const combo_proteinDM  = +((bayA_proteinDM*(bayASplit/100)) + (bayB_proteinDM*(bayBSplit/100))).toFixed(1);
  const combo_yieldPct   = +((bayA_yieldPct*(bayASplit/100))  + (bayB_yieldPct*(bayBSplit/100))).toFixed(2);
  const combo_fatDM      = +((bayA_fatDM*(bayASplit/100))     + (bayB_fatDM*(bayBSplit/100))).toFixed(1);
  const combo_FCR        = +((bayA_FCR*(bayASplit/100))       + (bayB_FCR*(bayBSplit/100))).toFixed(2);
  const combo_moisture   = +((bayA_moisture*(bayASplit/100))  + (bayB_moisture*(bayBSplit/100))).toFixed(1);

  // ── PKM SUPPLEMENTATION ────────────────────────────────────────────────────
  // Substrate CP before PKM — EFB:OPDC blend post-S3 approx
  const substrateCP_S3   = +(blendCN ? (100 / (blendCN * 4.67) * 100).toFixed(1) : 8.4); // BUG-12 FIX: N×4.67 per GR-10 (was 6.25)
  const pkmCP_DM         = 18.5;  // PKE/PKM crude protein % DM
  const pkmCN            = 25;    // PKM C:N
  const pkmCost_perT     = 85;    // $85/t FW

  const pkmFraction      = s4.pkmEnabled ? (+s4.pkmPct || 30) / 100 : 0;
  const substrateFraction = 1 - pkmFraction;
  const adjustedCP       = +(substrateCP_S3 * substrateFraction + pkmCP_DM * pkmFraction).toFixed(1);
  const adjustedCN       = +(((blendCN || 20) * substrateFraction + pkmCN * pkmFraction)).toFixed(0);
  const pkmWarning       = adjustedCP < 8.0;
  const pkmMonthlyKg     = s4.pkmEnabled ? +(s4_substrateIn * pkmFraction * 1000).toFixed(0) : 0;
  const pkmMonthlyCost   = +(pkmMonthlyKg / 1000 * pkmCost_perT).toFixed(0);

  // Consortium uplift factors

  // Monthly substrate in (from S1/S2/S3 pipeline)
  const s4_substrateIn = s1_blendWet + (pomeActive ? pomeSludgeInclTPD * s0.daysMonth : 0);

  // Monthly larvae FW (with consortium uplift)
  const s4_larvaeRaw   = +(s4_substrateIn * larvYieldPct / 100).toFixed(1);
  const s4_larvaeFW    = +(s4_larvaeRaw * upliftFactor).toFixed(1);
  const s4_larvaeDM    = +(s4_larvaeFW * (1 - larvMoisture/100)).toFixed(1);

  // Monthly frass FW (substrate - larvae - 15% evaporation)
  const s4_frassRaw    = +(s4_substrateIn - s4_larvaeRaw).toFixed(1);
  const s4_frassFW     = +(s4_frassRaw * 0.85).toFixed(1); // 15% evap
  const s4_frassMC     = 62; // % typical post-rearing

  // S5A — frass after larval extraction
  const s5a_N_DM  = 1.80; const s5a_P_DM  = 0.90; const s5a_K_DM  = 1.20;
  const s5a_Ca_DM = 2.10; const s5a_Mg_DM = 0.60; const s5a_OM_DM = 45.0;
  const s5a_CN    = 14;   const s5a_pH     = 6.8;
  const s5a_FW    = s4_frassFW;
  const s5a_DM    = +(s5a_FW * (100 - s4_frassMC) / 100).toFixed(1);

  // S5B — terminated in-substrate (larvae + frass combined)
  const s5b_N_DM  = 2.40; const s5b_P_DM  = 1.10; const s5b_K_DM  = 1.20;
  const s5b_Ca_DM = 2.40; const s5b_Mg_DM = 0.70; const s5b_OM_DM = 52.0;
  const s5b_CN    = 11;   const s5b_pH     = 6.5;
  const s5b_FW    = s4_substrateIn;  // whole substrate in S5B
  const s5b_DM    = +(s5b_FW * (100 - s4_frassMC) / 100).toFixed(1);

  // S6 — insect meal, oil, chitin yields (per month)
  const s6_mealYield   = +(s4_larvaeDM * 0.506 * 1.15).toFixed(1); // 50.6% CP defatted, 1.15 factor DM→meal
  const s6_oilYield    = +(s4_larvaeDM * 0.15).toFixed(1);  // ~15% DM extracted oil
  const s6_chitinYield = +(s4_larvaeDM * 0.093 * 0.45).toFixed(2); // 9.3% chitin, 45% extractable

  // NPK replacement value calcs (urea $350/t→$0.761/kg N; TSP $450/t→$0.978/kg P2O5; MOP $380/t→$0.633/kg K2O)
  const NPK_N_price  = 0.761;  // $/kg N
  const NPK_P_price  = 0.978;  // $/kg P2O5 (P × 2.29)
  const NPK_K_price  = 0.633;  // $/kg K2O (K × 1.20)

  const soilObj = SOILS.find(s=>s.id===s0.soil) || SOILS[1];
  const agObj   = AG_TIERS.find(a=>a.id===s0.ag) || AG_TIERS[0];

  // NPK replacement per t FW for S5A
  const s5a_Neff = s5a_N_DM/100 * (100-s4_frassMC)/100 * (1+soilObj.nAdj) * agObj.uplift;
  const s5a_Peff = s5a_P_DM/100 * (100-s4_frassMC)/100 * 2.29 * (1+soilObj.pAdj) * agObj.uplift;
  const s5a_Keff = s5a_K_DM/100 * (100-s4_frassMC)/100 * 1.20 * agObj.uplift;
  const s5a_NPKval = +(( s5a_Neff*1000*NPK_N_price + s5a_Peff*1000*NPK_P_price + s5a_Keff*1000*NPK_K_price )).toFixed(2);

  // NPK replacement per t FW for S5B
  const s5b_Neff = s5b_N_DM/100 * (100-s4_frassMC)/100 * (1+soilObj.nAdj) * agObj.uplift;
  const s5b_Peff = s5b_P_DM/100 * (100-s4_frassMC)/100 * 2.29 * (1+soilObj.pAdj) * agObj.uplift;
  const s5b_Keff = s5b_K_DM/100 * (100-s4_frassMC)/100 * 1.20 * agObj.uplift;
  const s5b_NPKval = +(( s5b_Neff*1000*NPK_N_price + s5b_Peff*1000*NPK_P_price + s5b_Keff*1000*NPK_K_price )).toFixed(2);

  // Sinar Mas ACTUAL NPK cost — $1.50/kg N (inc. soil loss penalty) vs urea floor
  const SM_N_price   = 1.50;   // $/kg N (Sinar Mas estate, incl. soil loss penalty)
  const SM_P_price   = 1.80;   // $/kg P2O5 (TSP at Sinar Mas actual landing cost)
  const SM_K_price   = 0.90;   // $/kg K2O (MOP at Sinar Mas actual landing cost)
  const s5a_NPKval_SM = +(( s5a_Neff*1000*SM_N_price + s5a_Peff*1000*SM_P_price + s5a_Keff*1000*SM_K_price )).toFixed(2);
  const s5b_NPKval_SM = +(( s5b_Neff*1000*SM_N_price + s5b_Peff*1000*SM_P_price + s5b_Keff*1000*SM_K_price )).toFixed(2);

  // ── NUTRIENT LEDGER — stage-by-stage mass flow + nutrient profiles ──────────
  const nl_wetPD   = +(efbTPD + opdcDMreq/opdcDMfrac2 + pomeSludgeInclTPD + (s0.pkeEnabled ? +s0.pkeTPD : 0)).toFixed(1);
  const nl_N       = totalDMpd>0 ? +(totalN_kgpd/(totalDMpd*10)).toFixed(2) : 1.38;
  const nl_P       = totalDMpd>0 ? +(totalP_kgpd/(totalDMpd*10)).toFixed(2) : 0.16;
  const nl_K       = totalDMpd>0 ? +(totalK_kgpd/(totalDMpd*10)).toFixed(2) : 0.74;
  const nl_Ca      = totalDMpd>0 ? +(0.40*(efbDMpd/totalDMpd)+0.30*(opdcDMreq/totalDMpd)+0.28*(pomeSludgeInclDMpd/totalDMpd)).toFixed(2) : 0.36;
  const nl_Mg      = 0.16;
  const nl_OM      = totalDMpd>0 ? +(73*(efbDMpd/totalDMpd)+63*(opdcDMreq/totalDMpd)+35*(pomeSludgeInclDMpd/totalDMpd)).toFixed(1) : 71;
  const nl_CN      = blendCN || 32;
  // S2 — PKSA K spike + alkali Ca amendments (K₂O 40% of ash, Ca from Ca(OH)₂/CaCO₃/dolomite)
  const nl_s2K     = +(nl_K + (s2.pksa ? s2.pksaDose*0.40*0.83/(blendDMfrac*10) : 0)).toFixed(2);
  const nl_s2Ca    = +(nl_Ca + (s2.caoh2 ? s2.caoh2_dose*0.54/(blendDMfrac*10) : 0) + (s2.caco3 ? s2.caco3_dose*0.40/(blendDMfrac*10) : 0) + (s2.dolomite ? s2.dolomite_dose*0.21/(blendDMfrac*10) : 0)).toFixed(2);
  const nl_s2CN    = +Math.max(22, nl_CN - (s2.pksa ? 8 : 2)).toFixed(1);
  const nl_s2OM    = +(nl_OM * 0.93).toFixed(1);
  // S3 — biological uplift (N+8%, P+10% PSB, K+5% solubilisation, OM-4% respiration)
  const nl_s3N     = +(nl_N * 1.08).toFixed(2);
  const nl_s3P     = +(nl_P * 1.10).toFixed(2);
  const nl_s3K     = +(nl_s2K * 1.05).toFixed(2);
  const nl_s3Ca    = nl_s2Ca;
  const nl_s3CN    = +Math.max(18, nl_s2CN - 5).toFixed(1);
  const nl_s3OM    = +(nl_s2OM * 0.96).toFixed(1);
  // S4 — frass at harvest day (gd-interpolated; larvae remove N↓, C:N drops sharply)
  const nl_s4N     = +(2.20 - (gd-6)/(18-6)*0.40).toFixed(2);
  const nl_s4P     = +(0.80 + (gd-6)/(18-6)*0.10).toFixed(2);
  const nl_s4K     = +(nl_s3K * 0.92).toFixed(2);
  const nl_s4Ca    = nl_s3Ca;
  const nl_s4CN    = +(15 - (gd-6)/(18-6)*7).toFixed(1);
  const nl_s4OM    = +(nl_s3OM * (1 - (gd-6)/(18-6)*0.15)).toFixed(1);
  const nl_s4wet   = +(s4_frassFW / s0.daysMonth).toFixed(1);
  const nl_s5aPD   = +(s5a_FW / s0.daysMonth).toFixed(1);
  const nl_s5bPD   = +(s5b_FW / s0.daysMonth).toFixed(1);

  // ══════════════════════════════════════════════════════════════════════════
  // DMPP N₂O SUPPRESSION MODULE
  // IPCC 2006 Vol.4 Ch.11 — Direct N₂O from managed soils, organic N applied
  // EF_direct = 0.010 kg N₂O-N / kg N applied (IPCC Tier 1 default)
  // Conversion N₂O-N → N₂O: multiply by 44/28 (molecular weights)
  // GWP N₂O = 265 (AR5 GWP100) — locked in CFI model
  // Source: IPCC 2006 GL Vol.4 Ch.11; Verra VM0042; Zaman et al. 2018
  // ══════════════════════════════════════════════════════════════════════════
  const DMPP_N2O_EF       = 0.010;       // IPCC Tier 1 direct emission factor
  const DMPP_GWP_N2O      = 265;         // AR5 GWP100 for N₂O — CFI locked
  const DMPP_MW_CONV      = 44 / 28;     // N₂O-N → N₂O mass conversion
  const soilObjCalc       = SOILS.find(s=>s.id===s0.soil) || SOILS[1];
  const dmpp_frassNpct    = s4.pathwayS5==="s5a" ? s5a_N_DM : s5b_N_DM;   // % DM
  const dmpp_frassMCv     = s4_frassMC;
  const dmpp_frassTpd     = s4.pathwayS5==="s5a" ? nl_s5aPD : nl_s5bPD;   // t FW/day
  const dmpp_N_kgday      = +(dmpp_frassTpd * (1-dmpp_frassMCv/100) * dmpp_frassNpct/100 * 1000).toFixed(1);
  // Baseline N₂O from frass soil application (no DMPP)
  const dmpp_n2o_base_kgday  = +(dmpp_N_kgday * DMPP_N2O_EF * DMPP_MW_CONV).toFixed(3);
  const dmpp_co2e_base_ann   = +(dmpp_n2o_base_kgday * DMPP_GWP_N2O * 365 / 1000).toFixed(1);
  // Soil-specific DMPP suppression efficacy
  const dmpp_efficacy        = soilObjCalc.dmppEfficacy || 0.40;
  const dmpp_n2o_avoid_kgday = +(dmpp_n2o_base_kgday * dmpp_efficacy).toFixed(3);
  const dmpp_co2e_avoid_ann  = +(dmpp_n2o_avoid_kgday * DMPP_GWP_N2O * 365 / 1000).toFixed(1);
  // Revenue from N₂O suppression credits
  const dmpp_credit_rev_ann  = s0.dmppEnabled ? +(dmpp_co2e_avoid_ann * carbonPriceActive).toFixed(0) : 0;
  // DMPP annual cost: frass t/day × 365 × dose kg/t × cost $/kg
  const dmpp_cost_annual     = +(dmpp_frassTpd * 365 * +s0.dmppDose * +s0.dmppCostPerKg).toFixed(0);
  const dmpp_net_annual      = dmpp_credit_rev_ann - dmpp_cost_annual;
  const dmpp_roi             = dmpp_cost_annual > 0 ? +(dmpp_credit_rev_ann / dmpp_cost_annual).toFixed(1) : 0;
  // Agronomic N uplift from DMPP (N retained in ammonium form longer — partial conversion to effective N)
  const dmpp_n_retained_pct  = +(dmpp_efficacy * 0.60 * 100).toFixed(0); // ~60% of suppressed N₂O converts to retained plant-available N
  // Grand total carbon revenue (existing + DMPP if enabled)
  const carbon_rev_grand     = carbon_rev_annual + (s0.dmppEnabled ? dmpp_credit_rev_ann : 0);

  // Product pricing floors and user entries
  const mealFloor     = 1200;   // $/t commodity floor
  const mealPremium   = 3500;   // $/t EU/US pet food
  const oilFloor      = 900;    // $/t feed grade floor
  const chitinFloor   = 5000;   // $/t agricultural grade floor
  const mealPrice     = Math.max(mealFloor,  parseFloat(s4.mealPriceEntry)  || mealFloor);
  const oilPrice      = Math.max(oilFloor,   parseFloat(s4.oilPriceEntry)   || oilFloor);
  const chitinPrice   = Math.max(chitinFloor,parseFloat(s4.chitinPriceEntry)|| chitinFloor);
  const frass5aPrice  = Math.max(s5a_NPKval, parseFloat(s4.frass5aPriceEntry) || s5a_NPKval);
  const frass5bPrice  = Math.max(s5b_NPKval, parseFloat(s4.frass5bPriceEntry) || s5b_NPKval);

  // Monthly revenue
  const rev_meal    = +(s6_mealYield / 1000 * mealPrice).toFixed(0);
  const rev_oil     = +(s6_oilYield  / 1000 * oilPrice).toFixed(0);
  const rev_chitin  = +(s6_chitinYield / 1000 * chitinPrice).toFixed(0);
  const rev_frass5a = s4.pathwayS5==="s5a" ? +(s5a_FW * frass5aPrice / 1000).toFixed(0) : 0;
  const rev_frass5b = s4.pathwayS5==="s5b" ? +(s5b_FW * frass5bPrice / 1000).toFixed(0) : 0;
  const rev_total   = +(rev_meal + rev_oil + rev_chitin + rev_frass5a + rev_frass5b).toFixed(0);

  // ── CAPEX / OPEX state
  const [capex, setCapex] = useState({
    greenhouse_area: 2000, greenhouse_cost_m2: 85,
    shredder: 120000, conveyor: 45000, screw_press: 80000,
    mixer_tank: 60000, drying_unit: 95000, oil_press: 75000,
    contingency_pct: 15,
    labor_monthly: 18000, utilities_monthly: 4500,
    consumables_monthly: 2200, maintenance_pct: 3,
    depreciation_years: 10,
    discount_rate: 12,
    // Per-stage CAPEX (from FD_CFI_Engineering_Master_EPC)
    s1_capex: 285000, s2_capex: 195000, s3_capex: 145000,
    s4_capex: 170000, s5_capex: 55000,  s6_capex: 95000,
  });
  const upCapex = (k,v) => setCapex(p=>({...p,[k]:v}));

  const capex_equipment = +(capex.shredder + capex.conveyor + capex.screw_press + capex.mixer_tank + capex.drying_unit + capex.oil_press).toFixed(0);
  const capex_civil     = +(capex.greenhouse_area * capex.greenhouse_cost_m2).toFixed(0);
  const capex_subtotal  = capex_equipment + capex_civil;
  const capex_contingency = +(capex_subtotal * capex.contingency_pct / 100).toFixed(0);
  const capex_total     = capex_subtotal + capex_contingency;
  const opex_monthly    = +(capex.labor_monthly + capex.utilities_monthly + capex.consumables_monthly + capex_total * capex.maintenance_pct / 100 / 12).toFixed(0);
  const opex_annual     = +(opex_monthly * 12).toFixed(0);
  const depreciation    = +(capex_total / capex.depreciation_years).toFixed(0);
  const rev_annual      = rev_total * 12;
  const ebitda          = rev_annual - opex_annual;
  const ebit            = ebitda - depreciation;
  const payback_years   = ebitda > 0 ? +(capex_total / ebitda).toFixed(1) : null;
  const roi_pct         = ebitda > 0 ? +(ebitda / capex_total * 100).toFixed(1) : null;

  // ── NPV / IRR (10-year horizon)
  const r = capex.discount_rate / 100;
  const npv_10yr = ebitda > 0
    ? +([1,2,3,4,5,6,7,8,9,10].reduce((acc,t) => acc + ebitda / Math.pow(1+r, t), 0) - capex_total).toFixed(0)
    : -capex_total;
  // IRR: binary search
  let irr = null;
  if (ebitda > 0) {
    let lo2 = 0, hi2 = 5;
    for (let i = 0; i < 50; i++) {
      const mid = (lo2+hi2)/2;
      const npv = [1,2,3,4,5,6,7,8,9,10].reduce((a,t) => a + ebitda/Math.pow(1+mid,t), 0) - capex_total;
      if (npv > 0) lo2 = mid; else hi2 = mid;
    }
    irr = +((lo2+hi2)/2*100).toFixed(1);
  }

  // ── SENSITIVITY (±20% revenue, ±20% CAPEX)
  const sens = {
    base_payback:   payback_years,
    revUp_payback:  ebitda > 0 ? +(capex_total / ((rev_annual*1.2) - opex_annual)).toFixed(1) : null,
    revDn_payback:  (rev_annual*0.8 - opex_annual) > 0 ? +(capex_total / ((rev_annual*0.8) - opex_annual)).toFixed(1) : "N/A",
    capUp_payback:  ebitda > 0 ? +(capex_total*1.2 / ebitda).toFixed(1) : null,
    capDn_payback:  ebitda > 0 ? +(capex_total*0.8 / ebitda).toFixed(1) : null,
    base_npv: npv_10yr,
    revUp_npv: ebitda > 0 ? +([1,2,3,4,5,6,7,8,9,10].reduce((a,t) => a + (rev_annual*1.2-opex_annual)/Math.pow(1+r,t), 0) - capex_total).toFixed(0) : -capex_total,
    revDn_npv: +([1,2,3,4,5,6,7,8,9,10].reduce((a,t) => a + (rev_annual*0.8-opex_annual)/Math.pow(1+r,t), 0) - capex_total).toFixed(0),
  };

  // ── PER-STAGE CAPEX
  const stageCapex = [
    {s:"S1",label:"Pre-Processing (shredder, conveyors, OPDC)",  v:capex.s1_capex,  col:"#1F7891"},
    {s:"S2",label:"Chemical Treatment (mixers, dosing, bays)",    v:capex.s2_capex,  col:"#FFC000"},
    {s:"S3",label:"Biological Conditioning (inoculation, bays)", v:capex.s3_capex,  col:"#3DCB7A"},
    {s:"S4",label:"BSF Rearing (greenhouse, beds, env. control)", v:capex.s4_capex,  col:"#56CCF2"},
    {s:"S5",label:"Product Separation (frass handling/drying)",   v:capex.s5_capex,  col:"#9B59B6"},
    {s:"S6",label:"Processing (dryer, oil press, chitin extract)", v:capex.s6_capex, col:"#E84040"},
  ];
  const stageCapexTotal = stageCapex.reduce((a,b) => a+b.v, 0);

  // ── CERTIFICATION TIER PRICING
  const CERT_TIERS = {
    none:    {label:"No Certification",       mealMult:1.0, oilMult:1.0, badge:"Standard"},
    feed:    {label:"Feed Grade (QS 9000)",    mealMult:1.5, oilMult:1.3, badge:"Feed Grade"},
    petfood: {label:"FSSC 22000 (Pet Food)",   mealMult:2.9, oilMult:2.0, badge:"FSSC 22000"},
    pharma:  {label:"ISO 22716 (Pharma/Cosm)", mealMult:5.4, oilMult:13.3,badge:"ISO 22716"},
  };
  const activeCert = CERT_TIERS[s4.certLevel] || CERT_TIERS.none;
  const certMealPrice  = +(mealFloor  * activeCert.mealMult).toFixed(0);
  const certOilPrice   = +(oilFloor   * activeCert.oilMult).toFixed(0);
  const certMealRev    = +(s6_mealYield / 1000 * certMealPrice).toFixed(0);
  const certOilRev     = +(s6_oilYield  / 1000 * certOilPrice).toFixed(0);
  const certTotalRev   = certMealRev + certOilRev + rev_chitin + rev_frass5a + rev_frass5b;

  // ── ALL-SOIL NPK COMPARISON
  const allSoilsNPK = SOILS.map(soil => {
    const nEff = (s4.pathwayS5==="s5a" ? s5a_N_DM : s5b_N_DM)/100 * (100-(s4.pathwayS5==="s5a"?s5a_FW:s5b_FW))/100 * (1+soil.nAdj) * agObj.uplift;
    const pEff = (s4.pathwayS5==="s5a" ? s5a_P_DM : s5b_P_DM)/100 * (100-(s4.pathwayS5==="s5a"?s5a_FW:s5b_FW))/100 * 2.29 * (1+soil.pAdj) * agObj.uplift;
    const kEff = (s4.pathwayS5==="s5a" ? s5a_K_DM : s5b_K_DM)/100 * (100-(s4.pathwayS5==="s5a"?s5a_FW:s5b_FW))/100 * 1.20 * agObj.uplift;
    const urea = +(nEff*1000*NPK_N_price + pEff*1000*NPK_P_price + kEff*1000*NPK_K_price).toFixed(2);
    const sm   = +(nEff*1000*SM_N_price  + pEff*1000*SM_P_price  + kEff*1000*SM_K_price).toFixed(2);
    return {id:soil.id, name:soil.name, pct:soil.pct, ph:soil.ph, urea, sm};
  });

  const GateRow = ({n, name, target, measured, pass, fail_action}) => {
    const hasVal = measured !== "" && !isNaN(parseFloat(measured));
    return (
      <div style={{display:"flex", alignItems:"center", gap:8, padding:"8px 10px",
                   background: hasVal ? (pass ? C.green+"18" : C.red+"18") : C.inputSectionBg,
                   borderRadius:6, marginBottom:4,
                   border:`1px solid ${hasVal ? (pass ? C.green+"44" : C.red+"44") : C.inputSectionBg}`}}>
        <div style={{color:C.grey, fontSize:11, width:16, textAlign:"center"}}>{n}</div>
        <div style={{flex:1}}>
          <div style={{color:C.white, fontSize:12, fontWeight:600}}>{name}</div>
          <div style={{color:C.grey, fontSize:10}}>Target: {target}</div>
        </div>
        <div style={{color: hasVal ? (pass ? C.green : C.red) : C.grey, fontWeight:800, fontSize:12, width:60, textAlign:"center"}}>
          {hasVal ? (pass ? " PASS" : " FAIL") : "—"}
        </div>
      </div>
    );
  };

  // ─── TABS ─────────────────────────────────────────────────────────────────
  const TABS = ["Site Setup","Pre-Processing","Pre-Treatment","Biologicals","BSF","Biofertiliser / Other","Emissions","Financials","Summary","Lab Analysis","Soil Science"];

  // ─── FONT INJECTION ─────────────────────────────────────────────────────────
  useEffect(function(){
    var id = "cfi-fonts-v3";
    if(document.getElementById(id)) return;
    var link = document.createElement("link");
    link.id = id; link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=EB+Garamond:wght@700;800&family=DM+Sans:wght@300;400;500;700&family=DM+Mono:wght@400;500;700;800&display=swap";
    document.head.appendChild(link);
  }, []);

  // Auth guard disabled for preview
  // if (!session) return <LoginPage onLoginSuccess={() => {}} />;

  const NAV_TABS = ["Site Setup","Pre-Processing","Pre-Treatment","Biologicals","BSF","Biofertiliser / Other","Emissions","Financials","Summary"];
  const SHORT_TABS = ["S0","S1","S2","S3","S4","S5","S6"];
  const _Fnt = { syne:"'Syne', sans-serif", dm:"'DM Sans', sans-serif", mono:"'DM Sans', sans-serif", brand:"'EB Garamond', serif" };

  return (
    <div style={{background:"#060C14", minHeight:"100vh", fontFamily:"'DM Sans', sans-serif",
                 color:"#FFFFFF", padding:"0 0 40px"}}>

      {/* ── STICKY HEADER (always visible on all stages) ── */}
      <div style={{ position:'sticky', top:0, zIndex:1000 }}>
        {/* ── GLOBAL BRAND HEADER ── */}
        <div className="global-header">
          {/* Brand Block */}
          <div className="brand-block">
            <span className="brand-name brand-cfi">CFI</span>
            <span className="brand-name brand-deeptech">Deep Tech</span>
          </div>
          {/* Vertical Divider */}
          <div className="brand-divider" />
          {/* Taglines Block */}
          <div className="taglines-block">
            {/* Line 1 */}
            <div className="tagline">
              <span className="tagline-segment tagline-white">Precision Engineering</span>
              <span className="tagline-segment tagline-teal">Circular Nutrient Recovery in Agricultural Systems</span>
            </div>
            {/* Line 2 */}
            <div className="tagline">
              <span className="tagline-segment tagline-white">Applied Biology</span>
              <span className="tagline-segment tagline-teal">Rebalancing Soil's Microbiome & Reducing Synthetic Fertiliser Use</span>
            </div>
          </div>
          {/* Price badge + Short tabs — far right */}
          <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:12, flexShrink:0 }}>
            <CFI_PriceRefreshBadge />
            {SHORT_TABS.map((s,i)=>(
              <span key={s} onClick={()=>handleTabClick(i)} style={{
                fontFamily:_Fnt.mono, fontSize:10, fontWeight:700, borderRadius:4, padding:'3px 9px', cursor:'pointer', whiteSpace:'nowrap',
                background: i===stage ? '#33D4BC' : 'rgba(168,189,208,0.09)',
                color:      i===stage ? '#060C14' : '#A8BDD0',
                border:     i===stage ? '1px solid #33D4BC' : '1px solid rgba(168,189,208,0.18)',
              }}>{s}</span>
            ))}
          </div>
        </div>

        {/* ── NAV TAB ROW ── */}
        <div style={{ background:'#0A1628', borderBottom:'2px solid rgba(51,212,188,0.18)', display:'flex', alignItems:'flex-end', gap:4, padding:'10px 24px 0 76px' }}>
          {NAV_TABS.map((t,i)=>(
            <div key={t} onClick={()=>handleTabClick(i)} style={{
              fontFamily:_Fnt.dm, fontSize:11, fontWeight:700, borderRadius:'7px 7px 0 0',
              borderTop:    '1.5px solid rgba(51,212,188,0.60)',
              borderLeft:   '1.5px solid rgba(51,212,188,0.60)',
              borderRight:  '1.5px solid rgba(51,212,188,0.60)',
              borderBottom: 'none',
              background:   'rgba(64, 215, 197, 0.15)',
              color:        i===stage ? '#F5A623' : '#A8BDD0',
              padding:'8px 16px 10px', marginBottom:-2, cursor:'pointer', whiteSpace:'nowrap',
            }}>{t}</div>
          ))}
        </div>

        {/* ── CONTEXT BAR ── */}
        <div style={{ background:'#0A1628', height:36, display:'flex', alignItems:'center', padding:'0 24px', borderBottom:'1px solid rgba(255,255,255,0.04)', gap:0 }}>
          <span style={{ fontFamily:_Fnt.mono, fontSize:11, color: s0.plantName ? '#ffffff' : 'rgba(168,189,208,0.25)', whiteSpace:'nowrap' }}>
            {s0.plantName || '—'}
          </span>
          <div style={{ width:0.5, height:13, background:'rgba(139,160,180,0.18)', margin:'0 11px', flexShrink:0 }} />
          <span style={{ fontFamily:_Fnt.mono, fontSize:11, color:'rgba(168,189,208,0.33)', whiteSpace:'nowrap', marginRight:4 }}>Estate</span>
          <span style={{ fontFamily:_Fnt.mono, fontSize:11, color: s0.estateName ? 'rgba(196,212,227,0.48)' : 'rgba(168,189,208,0.25)', whiteSpace:'nowrap' }}>{s0.estateName || '—'}</span>
          <div style={{ width:0.5, height:13, background:'rgba(139,160,180,0.18)', margin:'0 11px', flexShrink:0 }} />
          <span style={{ fontFamily:_Fnt.mono, fontSize:11, color:'rgba(168,189,208,0.33)', whiteSpace:'nowrap', marginRight:4 }}>Mill</span>
          <span style={{ fontFamily:_Fnt.mono, fontSize:11, color: s0.millName ? 'rgba(196,212,227,0.48)' : 'rgba(168,189,208,0.25)', whiteSpace:'nowrap' }}>{s0.millName || '—'}</span>
          <div style={{ width:0.5, height:13, background:'rgba(139,160,180,0.18)', margin:'0 11px', flexShrink:0 }} />
          <span style={{ fontFamily:_Fnt.mono, fontSize:11, color:'rgba(168,189,208,0.33)', whiteSpace:'nowrap', marginRight:4 }}>FFB</span>
          <span style={{ fontFamily:_Fnt.mono, fontSize:11, color: s0.ffbCapacity ? 'rgba(196,212,227,0.48)' : 'rgba(168,189,208,0.25)', whiteSpace:'nowrap' }}>{s0.ffbCapacity ? `${s0.ffbCapacity} TPH` : '—'}</span>
          <div style={{ width:0.5, height:13, background:'rgba(139,160,180,0.18)', margin:'0 11px', flexShrink:0 }} />
          <span style={{ fontFamily:_Fnt.mono, fontSize:11, color:'rgba(168,189,208,0.33)', whiteSpace:'nowrap', marginRight:4 }}>Soil</span>
          <span style={{ fontFamily:_Fnt.mono, fontSize:11, color: s0.soil ? 'rgba(196,212,227,0.48)' : 'rgba(168,189,208,0.25)', whiteSpace:'nowrap' }}>{s0.soil || '—'}</span>
          {(s0.efbEnabled || s0.opdcEnabled || s0.posEnabled || s0.pomeEnabled) && (
            <>
              <div style={{ width:0.5, height:13, background:'rgba(139,160,180,0.18)', margin:'0 11px', flexShrink:0 }} />
              <span style={{ fontFamily:_Fnt.mono, fontSize:11, color:'rgba(168,189,208,0.33)', whiteSpace:'nowrap', marginRight:4 }}>Streams</span>
              {s0.efbEnabled && <span style={{ fontFamily:_Fnt.mono, fontWeight:700, fontSize:10, color:'#33D4BC', background:'rgba(51,212,188,0.10)', border:'1px solid rgba(51,212,188,0.30)', borderRadius:3, padding:'1px 6px', marginLeft:4 }}>EFB</span>}
              {s0.opdcEnabled && <span style={{ fontFamily:_Fnt.mono, fontWeight:700, fontSize:10, color:'#33D4BC', background:'rgba(51,212,188,0.10)', border:'1px solid rgba(51,212,188,0.30)', borderRadius:3, padding:'1px 6px', marginLeft:4 }}>OPDC</span>}
              {s0.posEnabled && <span style={{ fontFamily:_Fnt.mono, fontWeight:700, fontSize:10, color:'#33D4BC', background:'rgba(51,212,188,0.10)', border:'1px solid rgba(51,212,188,0.30)', borderRadius:3, padding:'1px 6px', marginLeft:4 }}>POS</span>}
              {s0.pomeEnabled && <span style={{ fontFamily:_Fnt.mono, fontWeight:700, fontSize:10, color:'#33D4BC', background:'rgba(51,212,188,0.10)', border:'1px solid rgba(51,212,188,0.30)', borderRadius:3, padding:'1px 6px', marginLeft:4 }}>POME</span>}
            </>
          )}
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div style={{padding:"16px 22px 60px", minWidth:1400, margin:"0 auto"}}>

        {/* ════════════════════ S T A G E  0 ════════════════════ */}
        {stage===0 && (<><SiteSetup />
          <div style={{textAlign:'right',padding:'12px 0'}}><button onClick={()=>setShowValCalc(v=>!v)} style={{background:'rgba(64,215,197,0.10)',border:'1.5px solid rgba(64,215,197,0.40)',borderRadius:6,color:'#40D7C5',fontFamily:"'DM Mono',monospace",fontSize:11,fontWeight:700,padding:'6px 14px',cursor:'pointer'}}>{showValCalc?'Hide Value Calculator ▴':'Value Calculator ▾'}</button></div>
          {showValCalc && <CFI_ValueCalculator defaultStage="s0"/>}
        </>)}

        {/* ════════════════════ S T A G E  1 ════════════════════ */}
        {stage===1 && (
          <div>
            <div style={{display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:10, marginBottom:16}}>
              <KPI label="EFB Monthly (wet)" value={efbMonthWet.toLocaleString()} unit="t/month"/>
              <KPI label="EFB DM Monthly" value={s1_efbMonthDM.toLocaleString()} unit="t DM/month"/>
              <KPI label="OPDC DM Required" value={s1_opdcMonthDM.toLocaleString()} unit="t DM/month" color={C.amber}/>
              {pomeActive && <KPI label="POME Sludge (monthly)" value={(pomeSludgeInclTPD*s0.daysMonth).toFixed(0)} unit="t FW/month" color={C.blue}/>}
              <KPI label="Blended Substrate" value={s1_blendWet.toLocaleString()} unit="t FW/month → S2" color={C.green}/>
            </div>

            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:16}}>
              <div style={S.card}>
                <SectionHdr icon="" title="S1 — EFB PRE-PROCESSING (MECHANICAL)"/>
                <div style={{display:"flex", flexDirection:"column", gap:6}}>
                  <CalcField label="EFB Nameplate Throughput" unit="TPH (wet)" value={efbTPH}/>
                  <CalcField label="EFB Daily (wet)" unit="t/day" value={efbTPD}/>
                  <CalcField label="EFB Dry Matter @mill" unit="%" value={(efbDMFrac*100).toFixed(1)}/>
                  <CalcField label="EFB DM per day" unit="t DM/day" value={efbDMpd}/>
                  <CalcField label="EFB Monthly (wet)" unit="t/month" value={efbMonthWet.toLocaleString()}/>
                  <CalcField label="EFB Monthly DM" unit="t DM/month" value={s1_efbMonthDM.toLocaleString()}/>
                </div>
                <hr style={S.divider}/>
                <SectionHdr icon="" title="EQUIPMENT SIZING" color={C.amber}/>
                <div style={{fontSize:12, color:C.greyLt, lineHeight:1.8}}>
                  <div>• <span style={{color:C.amber}}>Shredder:</span> {(efbTPH / 0.65).toFixed(1)} TPH nameplate (÷0.65 Asian derating)</div>
                  <div>• <span style={{color:C.amber}}>Hammer Mill:</span> {(efbTPH * 0.3 / 0.65).toFixed(1)} TPH (30% to 2mm fraction)</div>
                  <div>• <span style={{color:C.amber}}>Screw Press (OPDC):</span> {(opdcNatTPD * 1.1 / 24 / 0.65).toFixed(2)} TPH target</div>
                  <div>• <span style={{color:C.amber}}>Conveyor:</span> {(efbTPH * 1.2).toFixed(1)} TPH design (20% margin)</div>
                  <div>• <span style={{color:C.teal}}>Particle Target:</span> 2mm for BSF substrate</div>
                  <div>• <span style={{color:C.teal}}>Asian Derating Factor:</span> 0.65× nameplate</div>
                </div>
              </div>

              <div style={S.card}>
                <SectionHdr icon="" title="S1 — OPDC PRE-PROCESSING"/>
                <div style={{display:"flex", flexDirection:"column", gap:6}}>
                  <CalcField label="Natural OPDC (wet, 15.2%)" unit="t/day" value={opdcNatTPD}/>
                  <CalcField label="Natural OPDC DM" unit="t DM/day" value={opdcNatDM}/>
                  <CalcField label="OPDC DM Required (blend)" unit="t DM/day" value={opdcDMreq}/>
                  <CalcField label="OPDC Shortfall" unit="t DM/day" value={opdcShortfall > 0 ? opdcShortfall : "0"}/>
                  <CalcField label="OPDC Monthly DM (required)" unit="t DM/month" value={s1_opdcMonthDM.toLocaleString()}/>
                  <CalcField label="Target OPDC MC (press)" unit="%" value="50"/>
                </div>
                {opdcShortfall > 0 &&
                  <Alert msg={`Source ${(opdcShortfall * s0.daysMonth).toFixed(0)} t DM/month OPDC externally`}/>}
                <hr style={S.divider}/>
                <SectionHdr icon="" title="OPDC CONSTRAINTS" color={C.red}/>
                <div style={{fontSize:12, color:C.greyLt, lineHeight:1.8}}>
                  <div>• <span style={{color:C.red}}>NEVER below 40% MC</span> — pore damage kills BSF</div>
                  <div>• Target 45–55% MC at press discharge</div>
                  <div>• OPDC N: 2.40% DM (CFI confirmed)</div>
                  <div>• OPDC yield: 15.2% of EFB fresh weight</div>
                  <div>• Lignin 30.7%, C:N 20 (high protein vs EFB)</div>
                </div>
              </div>

              {pomeActive && (
                <div style={{...S.card, gridColumn:"1/-1", border:`1px solid ${C.blue}44`}}>
                  <SectionHdr icon="" title="S1 — POME SLUDGE STREAM (ACTIVE)" color={C.blue}/>
                  <div style={{display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:10, marginBottom:8}}>
                    <KPI label="Natural Yield" value={pomeSludgeNatTPD} unit="t/day fresh" color={C.blue}/>
                    <KPI label="MC at entry" value={`${pomeSludgeActMC}%`} unit={s0.pomeSludgeDewatered?"post-dewatering":"mill exit"} color={C.teal}/>
                    <KPI label="Included (Fe-capped)" value={`${pomeSludgeInclTPD} t/day`} unit={`${pomeSludgeInclPct}% WW — Fe: ${pomeSludgeFeStatus}`} color={pomeSludgeFeStatus==="LOW"?C.green:pomeSludgeFeStatus==="MODERATE"?C.teal:C.amber}/>
                    <KPI label="DM Added" value={`${pomeSludgeInclDMpd} t/day`} unit="into blend" color={C.green}/>
                    <KPI label="N Added" value={`${pomeN_kgpd} kg/day`} unit="at 1.76% DM" color={C.green}/>
                  </div>
                  <div style={{fontSize:11, color:C.greyLt, lineHeight:1.8}}>
                    <span style={{color:C.blue}}>POME Sludge enters blend AFTER mechanical pre-process (S1) and BEFORE chemical treatment (S2).</span>
                    {" "}pH 4–5.5 neutralised by PKSA in S2 at zero additional cost.
                    {" "}CPO 5–20% DM provides additional energy substrate for BSF larvae.
                  </div>
                  {!s0.pomeSludgeFeResult && (
                    <Alert type="warn" msg="Fe result not entered — inclusion capped at 15% WW default. Submit CFI-LAB-POME-001 Package A to unlock full 20% WW."/>
                  )}
                </div>
              )}

              <div style={{...S.card, gridColumn:"1/-1"}}>
                <SectionHdr icon="🔗" title="S1 OUTPUT → S2 CONNECTOR" color={C.green}/>
                <div style={{display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:10}}>
                  <KPI label="Blended FW (EFB+OPDC)" value={s1_blendWet.toLocaleString()} unit="t/month" color={C.green}/>
                  <KPI label="Blended DM" value={s1_blendDM.toLocaleString()} unit="t DM/month" color={C.green}/>
                  <KPI label="Blend MC" value={blendMC} unit="% (wet-weight-corrected)" color={C.teal}/>
                  {pomeActive && <KPI label="POME Sludge Added" value={(pomeSludgeInclTPD*s0.daysMonth).toFixed(0)} unit="t FW/month" color={C.blue}/>}
                  <KPI label="Blend C:N (est.)" value={blendCN||"—"} unit="EFB+OPDC basis" color={blendCN&&blendCN<=25&&blendCN>=15?C.green:C.amber}/>
                </div>
                <Alert type="ok" msg={`${(s1_blendWet + (pomeActive?pomeSludgeInclTPD*s0.daysMonth:0)).toLocaleString()} t FW/month total substrate (EFB+OPDC${pomeActive?" + POME Sludge":""}) ready for Stage 2`}/>
              </div>

              {/* ── PROCESS ENGINEERING — FACILITY LAYOUT & MACHINERY ── */}
              <div style={{...S.card, gridColumn:"1/-1"}}>
                <SectionHdr icon="🏭" title="S1 — PROCESS ENGINEERING & FACILITY LAYOUT" color={C.amber}/>
                <div style={{background:'#0a0f18', border:'1px solid rgba(245,166,35,0.20)', borderRadius:8, padding:'16px 20px', marginBottom:14, fontFamily:"'DM Sans', sans-serif", fontSize:11, color:'#8ba0b4', lineHeight:1.9, whiteSpace:'pre', overflowX:'auto'}}>
{`  ╔══════════════════════════════════════════════════════════════════════════╗
  ║                     CFI S1 — MECHANICAL PRE-PROCESSING                  ║
  ║                         PROCESS FLOW DIAGRAM                            ║
  ╠══════════════════════════════════════════════════════════════════════════╣
  ║                                                                         ║
  ║  [CPO MILL]                                                             ║
  ║      │                                                                  ║
  ║      ├──► EFB DISCHARGE (22.5% FFB) ──► SHREDDER ──► HAMMER MILL       ║
  ║      │    MC: 62.5% wb                  ${(efbTPH/0.65).toFixed(1)} TPH       2mm target       ║
  ║      │                                                                  ║
  ║      ├──► OPDC (15.2% EFB FW) ──► SCREW PRESS ──► DEWATERED OPDC      ║
  ║      │    MC: 70% wb              MC: 50% target    ${opdcDMreq} t DM/d       ║
  ║      │                                                                  ║
  ║      └──► CONVEYOR SYSTEM (${(efbTPH*1.2).toFixed(1)} TPH) ──► MIXING HOPPER        ║
  ║                                                                         ║
  ║           ┌─────────────┐     ┌─────────────┐     ┌─────────────┐      ║
  ║           │  SHREDDED   │     │  PRESSED    │     │   BLENDED   │      ║
  ║           │    EFB      │ ──► │    OPDC     │ ──► │  SUBSTRATE  │      ║
  ║           │ ${efbDMpd} t DM/d │     │ ${opdcDMreq} t DM/d│     │  → S2        │      ║
  ║           └─────────────┘     └─────────────┘     └─────────────┘      ║
  ║                                                                         ║
  ╚══════════════════════════════════════════════════════════════════════════╝`}
                </div>

                <SectionHdr icon="⚙️" title="MACHINERY SPECIFICATIONS" color={C.teal}/>
                <div style={{display:"flex", flexDirection:"column", gap:6, marginBottom:14}}>
                  <CalcField label="EFB Shredder (nameplate)" unit="TPH" value={(efbTPH / 0.65).toFixed(1)}/>
                  <CalcField label="Hammer Mill (30% to 2mm fraction)" unit="TPH" value={(efbTPH * 0.3 / 0.65).toFixed(1)}/>
                  <CalcField label="Screw Press — OPDC dewatering" unit="TPH" value={(opdcNatTPD * 1.1 / 24 / 0.65).toFixed(2)}/>
                  <CalcField label="Conveyor System (20% margin)" unit="TPH" value={(efbTPH * 1.2).toFixed(1)}/>
                  <CalcField label="Asian Derating Factor" unit="×" value="0.65"/>
                  <CalcField label="Particle Target (BSF substrate)" unit="mm" value="2"/>
                </div>

                <SectionHdr icon="💰" title="S1 — CAPEX ALLOCATION" color={C.amber}/>
                <div style={{display:"flex", flexDirection:"column", gap:6}}>
                  <CalcField label="S1 Pre-Processing CAPEX (shredder, conveyors, OPDC press)" unit="USD" value={`$${capex.s1_capex.toLocaleString()}`}/>
                  <CalcField label="Operating Hours" unit="hr/day" value={s0.hrsDay}/>
                  <CalcField label="Operating Days" unit="days/month" value={s0.daysMonth}/>
                </div>

                <div style={{marginTop:20}}>
                  <div style={{fontFamily:"'Syne', sans-serif",fontSize:13,fontWeight:700,color:C.teal,letterSpacing:"0.06em",marginBottom:12}}>S1 DRAWINGS & PROCESS FLOWS</div>
                  {[
                    {heading:"Architectural",items:[
                      {label:"Site Master Plan",href:"CFI_S1_Architectural_Plan.html"},
                      {label:"Building Architecture",href:"CFI_S1_Building_Architecture.html"},
                      {label:"Building Floor Plan",href:"CFI_S1_FloorPlan_v2.html"},
                    ]},
                    {heading:"Machine Line Floor Plans",items:[
                      {label:"EFB Line Floor Plan",href:"CFI_S1_Combined_v2.html#efb"},
                      {label:"OPDC Line Floor Plan",href:"CFI_S1_Combined_v2.html#opdc"},
                      {label:"Greenhouse Design",href:"CFI_S1_Greenhouse_Plan.html"},
                    ]},
                    {heading:"ASCII Process Flows",items:[
                      {label:"EFB ASCII Flow",href:"CFI_S1_EFB_ASCII_v2.html"},
                      {label:"OPDC ASCII Flow",href:"CFI_S1_OPDC_ASCII_v2.html"},
                      {label:"POS ASCII Flow",href:"CFI_S1_POS_ASCII_v1.html"},
                    ]},
                  ].map((row,ri)=>(
                    <div key={ri} style={{marginBottom:10}}>
                      <div style={{fontFamily:"'DM Sans', sans-serif",fontSize:10,fontWeight:700,color:"#8BA0B4",letterSpacing:"0.04em",marginBottom:6,textTransform:"uppercase"}}>{row.heading}</div>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
                        {row.items.map((btn,i)=>(
                          <a key={i} href={btn.href} target="_blank" rel="noopener noreferrer" style={{
                            display:"block",background:"#0C1E33",border:"1px solid rgba(139,160,180,0.18)",borderRadius:6,
                            padding:"12px 14px",textDecoration:"none",color:"#FFFFFF",fontFamily:"'DM Sans', sans-serif",
                            fontSize:12,fontWeight:700,textAlign:"center",cursor:"pointer",transition:"color 0.15s, border-color 0.15s",
                          }}
                          onMouseEnter={e=>{e.currentTarget.style.color="#F5A623";e.currentTarget.style.borderColor="rgba(64,215,197,0.7)";}}
                          onMouseLeave={e=>{e.currentTarget.style.color="#FFFFFF";e.currentTarget.style.borderColor="rgba(139,160,180,0.18)";}}
                          >{btn.label}</a>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            <NutrLedger stg="S1 · After Shredding (No Nutrient Change)" N={nl_N} P={nl_P} K={nl_K} Ca={nl_Ca} Mg={nl_Mg} OM={nl_OM} cn={nl_CN} wetPD={nl_wetPD} mc={blendMC} nAdj={soilObj.nAdj} pAdj={soilObj.pAdj} ag={agObj.uplift} col={C.tealLt}/>
            </div>
          <div style={{textAlign:'right',padding:'12px 0'}}><button onClick={()=>setShowValCalc(v=>!v)} style={{background:'rgba(64,215,197,0.10)',border:'1.5px solid rgba(64,215,197,0.40)',borderRadius:6,color:'#40D7C5',fontFamily:"'DM Mono',monospace",fontSize:11,fontWeight:700,padding:'6px 14px',cursor:'pointer'}}>{showValCalc?'Hide Value Calculator ▴':'Value Calculator ▾'}</button></div>
          {showValCalc && <CFI_ValueCalculator defaultStage="s1"/>}
          </div>
        )}

        {/* ════════════════════ S T A G E  2 ════════════════════ */}
        {stage===2 && (
          <div>
            {/* KPI Row */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10,marginBottom:16}}>
              <KPI label="Substrate In" value={s1_blendWet.toLocaleString()} unit="t FW/month"/>
              <KPI label="Lignin Reduction" value={`~${pksa_ligninRed}%`} unit="from active chemicals" color={C.green}/>
              <KPI label="S2 Cost" value={`$${s2CostPerT.toFixed(2)}/t`} unit={`$${s2MonthlyCost.toLocaleString()}/month`} color={C.amber}/>
              <KPI label="Conflicts" value={s2Conflicts.length} unit={s2Conflicts.length>0?"RESOLVE BEFORE S3":"None detected"} color={s2Conflicts.length>0?C.red:C.green}/>
              <KPI label="2-Turn Rule" value="LOCKED" unit="8-12hr + 16-20hr turns" color={C.red}/>
            </div>

            {/* Conflict Alerts */}
            {s2Conflicts.map((c,i)=>(
              <div key={i} style={{background:c.sev==="red"?C.red+"18":C.amber+"18",
                border:`1px solid ${c.sev==="red"?C.red:C.amber}55`,borderRadius:6,
                padding:"8px 14px",marginBottom:8,color:c.sev==="red"?C.red:C.amber,fontSize:11}}>
                {c.sev==="red"?" ":" "}{c.msg}
              </div>
            ))}

            <div style={{display:"grid",gridTemplateColumns:"1fr 380px",gap:16}}>

              {/* LEFT: Chemical selector */}
              <div style={{display:"flex",flexDirection:"column",gap:10}}>

                {/* PKSA — DEFAULT */}
                <div style={S.card}>
                  <SectionHdr icon="⭐" title="PKSA — DEFAULT PRIMARY TREATMENT (ZERO COST)" color={C.amber}/>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                    <input type="checkbox" checked={s2.pksa} onChange={e=>upS2("pksa",e.target.checked)} style={{accentColor:C.teal,width:16,height:16}}/>
                    <span style={{color:s2.pksa?C.teal:C.grey,fontWeight:800}}>Palm Kernel Shell Ash (PKSA)</span>
                    <span style={S.badge(C.green)}>$0/t FW</span>
                    <span style={S.badge(C.teal)}>✓ RSPO OK</span>
                    <span style={S.badge(C.amber)}>DEFAULT</span>
                  </div>
                  {s2.pksa && (
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
                      <div><Lbl t="Dose" unit="kg/t FW"/><input style={S.inputBlu} type="number" value={s2.pksaDose} onChange={e=>e.target.value} onBlur={e=>upS2("pksaDose",+e.target.value)}/></div>
                      <CalcField label="Lignin reduction" unit="%" value={`~${ligninReductions.pksa}%`}/>
                      <CalcField label="pH target" unit="" value="10–12 → 6.5–8.0"/>
                    </div>
                  )}
                  <div style={{marginTop:8,fontSize:10,color:C.grey,lineHeight:1.7}}>
                    K₂O 35–45% · CaO 8–12% · MgO 3–5% · pH 10–12 aq. slurry · 30–35% lignin reduction at 6–10 kg/t · K₂O = $129.82/t synthetic equiv · 24hr neutralisation via CO₂ carbonation · 2 turns mandatory
                  </div>
                </div>

                {/* ALKALINE CHEMICALS */}
                <div style={S.card}>
                  <SectionHdr icon="" title="ALKALINE CHEMICALS" color={C.blue}/>
                  {[
                    {k:"naoh",  name:"NaOH — Sodium Hydroxide",      rspo:" Needs Doc", cost:"$0.12/t",lig:66,col:C.red,    note:"Strongest delignifier (66%) but Na⁺ toxic to BSF. RED ALERT if active."},
                    {k:"koh",   name:"KOH — Potassium Hydroxide",     rspo:" Needs Doc", cost:"$0.18/t",lig:35,col:C.amber,  note:"Identical to NaOH but K⁺ enriches compost. pH >12. Better than NaOH for BSF substrate."},
                    {k:"caoh2", name:"Ca(OH)₂ — Hydrated Lime",       rspo:" OK",        cost:"$0.08/t",lig:18,col:C.green,  note:"Slower than NaOH. Sustained pH 11–12 without spike. RSPO compatible. 24–72hr for EFB."},
                    {k:"cao",   name:"CaO — Quicklime",               rspo:" OK",        cost:"$0.06/t",lig:22,col:C.green,  note:"Exothermic (+65 kJ/mol). Thermal spike 60–80°C + pH 12. Most aggressive RSPO option."},
                    {k:"caco3", name:"CaCO₃ — Agricultural Lime",     rspo:" OK",        cost:"$0.04/t",lig:3, col:C.teal,   note:"pH buffer only — no delignification. Raises OPDC from pH 4.5 to 6.5–7.5."},
                    {k:"mgco3", name:"MgCO₃ — Magnesium Carbonate",   rspo:" OK",        cost:"$0.06/t",lig:3, col:C.teal,   note:"Mg²⁺ cofactor for enzyme systems. Mild buffer. Mg-deficient Ultisol/Oxisol correction."},
                    {k:"k2co3", name:"K₂CO₃ — Potassium Carbonate",   rspo:" Needs Doc", cost:"$0.22/t",lig:22,col:C.amber,  note:"pH 11.5. Dual: alkaline pretreatment + K nutrition. Expensive — PKSA preferred substitute."},
                    {k:"dolomite",name:"Dolomite CaMg(CO₃)₂",         rspo:" OK",        cost:"$0.05/t",lig:0, col:C.teal,   note:"Ca²⁺ + Mg²⁺ simultaneously. pH buffer 3–6 week slow release. Ultisol/Oxisol soil correction."},
                  ].map(chem=>(
                    <div key={chem.k} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"8px 10px",
                      background:s2[chem.k]?"rgba(64,215,197,0.15)":"#000000",borderRadius:6,marginBottom:4,
                      border:s2[chem.k]?`1px solid ${chem.col}44`:"none"}}>
                      <input type="checkbox" checked={!!s2[chem.k]} onChange={e=>upS2(chem.k,e.target.checked)} style={{accentColor:chem.col,marginTop:2,flexShrink:0}}/>
                      <div style={{flex:1}}>
                        <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                          <span style={{color:s2[chem.k]?chem.col:C.white,fontWeight:700,fontSize:11}}>{chem.name}</span>
                          <span style={{...S.badge(chem.rspo.includes("")?C.green:C.amber),fontSize:9}}>{chem.rspo}</span>
                          <span style={{color:C.grey,fontSize:10}}>{chem.cost}</span>
                          {chem.lig>0&&<span style={{...S.badge(C.teal),fontSize:9}}>Lignin -{chem.lig}%</span>}
                          {chem.k==="naoh"&&<span style={{...S.badge(C.red),fontSize:9}}> BSF RISK</span>}
                        </div>
                        <div style={{color:C.grey,fontSize:10,marginTop:2}}>{chem.note}</div>
                        {s2[chem.k] && chem.k!=="caco3"&&chem.k!=="mgco3"&&chem.k!=="dolomite" && (
                          <div style={{display:"flex",alignItems:"center",gap:8,marginTop:6}}>
                            <Lbl t="Dose kg/t FW"/>
                            <input style={{...S.inputBlu,width:80,padding:"3px 6px",fontSize:11}}
                              type="number" value={s2[chem.k+"_dose"]||2} onChange={e=>e.target.value} onBlur={e=>upS2(chem.k+"_dose",+e.target.value)}/>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* ACID CHEMICALS */}
                <div style={S.card}>
                  <SectionHdr icon="" title="ACID / OXIDATIVE CHEMICALS" color={C.red}/>
                  {[
                    {k:"h2so4",  name:"H₂SO₄ — Sulfuric Acid (dilute)", rspo:"",cost:"$0.05/t",lig:17,col:C.red,   note:"Hemicellulose hydrolysis + cellulose decrystallisation. Requires full neutralisation before biology."},
                    {k:"hcl",    name:"HCl — Hydrochloric Acid",          rspo:"",cost:"$0.07/t",lig:16,col:C.red,   note:"Similar to H₂SO₄. Cl⁻ residues may inhibit cellulase. Higher cost than H₂SO₄."},
                    {k:"citric", name:"Citric Acid — pH Correction",       rspo:"",cost:"$0.15/t",lig:6, col:C.teal,  note:"Post-alkaline pH correction pH 11–12→7.0–8.0. Chelates Ca/Fe. Biodegradable. Wood vinegar substitute."},
                    {k:"paa",    name:"PAA — Peracetic Acid",              rspo:" RESTRICTED",cost:"$0.45/t",lig:40,col:C.red,note:"STRONGEST single chemical delignifier (40%). RSPO-RESTRICTED. Kills all microbes at >50ppm. Non-RSPO only."},
                    {k:"h2o2",   name:"H₂O₂ — Hydrogen Peroxide",          rspo:"",cost:"$0.10/t",lig:12,col:C.amber, note:"Moderate oxidant. No residue (H₂O+O₂). Fenton reaction with Fe²⁺ amplifies effect. ≤3% DM recommended."},
                    {k:"woodvinegar",name:"Wood Vinegar / Asap Cair",       rspo:"",cost:"$0.02/t",lig:0, col:C.green,  note:"pH ~3.5 for post-alkaline correction. Stimulates Bacillus/Trichoderma 1.5–2.5×. Free if PKS biochar kiln."},
                    {k:"lactic", name:"Lactic Acid",                        rspo:"",cost:"$0.10/t",lig:5, col:C.teal,   note:"Mild ester bond hydrolysis. Primarily termination/preservation agent at S4 end of cycle."},
                    {k:"sulfur", name:"Volcanic Sulfur / Belerang",         rspo:"",cost:"$0.03/t",lig:0, col:C.blue,   note:"Slow-release acidification (7–14 days). Sulfate for BSF Met+Cys amino acid synthesis. Indonesian supply chain."},
                  ].map(chem=>(
                    <div key={chem.k} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"8px 10px",
                      background:s2[chem.k]?"rgba(64,215,197,0.15)":"#000000",borderRadius:6,marginBottom:4,
                      border:s2[chem.k]?`1px solid ${chem.col}44`:"none"}}>
                      <input type="checkbox" checked={!!s2[chem.k]} onChange={e=>upS2(chem.k,e.target.checked)} style={{accentColor:chem.col,marginTop:2,flexShrink:0}}/>
                      <div style={{flex:1}}>
                        <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                          <span style={{color:s2[chem.k]?chem.col:C.white,fontWeight:700,fontSize:11}}>{chem.name}</span>
                          <span style={{...S.badge(chem.rspo.includes("")?C.green:chem.rspo.includes("")?C.red:C.amber),fontSize:9}}>{chem.rspo}</span>
                          <span style={{color:C.grey,fontSize:10}}>{chem.cost}</span>
                          {chem.lig>0&&<span style={{...S.badge(C.teal),fontSize:9}}>Lignin -{chem.lig}%</span>}
                        </div>
                        <div style={{color:C.grey,fontSize:10,marginTop:2}}>{chem.note}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* AMENDMENTS + N-RETENTION */}
                <div style={S.card}>
                  <SectionHdr icon="" title="AMENDMENTS, N-RETENTION, MINERALS" color={C.green}/>
                  {[
                    {k:"gypsum",      name:"Gypsum CaSO₄·2H₂O",         rspo:"",cost:"$0.04/t",col:C.green,  note:"N-RETENTION: SO₄²⁻ captures NH₄⁺ as ammonium sulfate. Reduces NH₃ loss 25–40%. Critical for OPDC."},
                    {k:"feso4",       name:"FeSO₄·7H₂O — Ferrous Sulfate",rspo:"",cost:"$0.03/t",col:C.amber, note:"Fe²⁺ forms Fe-ammonium-phosphate complexes. N-retention 30–40%.  INCOMPATIBLE with MnP enzyme."},
                    {k:"biochar",     name:"Biochar (PKS-derived)",        rspo:"",cost:"$0.08/t",col:C.teal,   note:"CEC 40–80 meq/100g. NH₄⁺ + K⁺ adsorption. Microbial habitat pores. Free if CFI installs pyrolysis kiln."},
                    {k:"zeolite",     name:"Natural Zeolite (Klinoptilolite)",rspo:"",cost:"$0.10/t",col:C.blue, note:"CEC 100–200 meq/100g. Strongest NH₄⁺ absorber. Slow-release 8–12 weeks in soil. Tasikmalaya deposits."},
                    {k:"humic",       name:"Humic Acid (Leonardite)",       rspo:"",cost:"$0.12/t",col:C.amber,  note:"Chelates Fe/Al/Ca. Stabilises N+P. Accelerates maturation 20–30%. CFI can self-generate from mature S3."},
                    {k:"molasses",    name:"Molasses / Tetes Tebu",         rspo:"",cost:"$0.08/t",col:C.teal,   note:"C-source for microbial carrier. Reduces lag phase 72h→24h. ≤2% DM only — avoid at high C:N ratio."},
                    {k:"phosphate",   name:"Natural Phosphate Rock",        rspo:"",cost:"$0.06/t",col:C.green,  note:"Organic acids solubilise apatite. P content 0.1–0.3% → 0.4–0.8% DM. PT Petrokimia Gresik."},
                    {k:"bentonite",   name:"Bentonite Montmorillonite",      rspo:"",cost:"$0.08/t",col:C.blue,   note:"CEC 80–120 meq/100g. Heavy metal sequestration. Water retention +15–25%. Tasikmalaya deposits."},
                    {k:"struvite",    name:"Struvite MgNH₄PO₄ (Slow-release)",rspo:"",cost:"$0.12/t",col:C.green, note:"N+P+Mg slow-release. Mg² supports enzyme cofactors. No direct lignin chemistry."},
                    {k:"urea",        name:"Urea CO(NH₂)₂ — C:N Correction", rspo:"",cost:"$0.15/t",col:C.amber,  note:"C:N correction only. No lignin action. Use when blend C:N >35 without PKE/POME Sludge."},
                    {k:"ammoniumsulf",name:"Ammonium Sulfate (NH₄)₂SO₄",    rspo:"",cost:"$0.12/t",col:C.amber,  note:"N+S fertilisation. C:N corrective + sulfate for amino acid synthesis. Same N function as urea."},
                    {k:"tween80",     name:"Tween 80 (Polysorbate 80)",       rspo:"",cost:"$0.18/t",col:C.teal,   note:"Non-ionic surfactant. Prevents cellulase adsorption to lignin. +3–5% indirect lignin effect."},
                  ].map(chem=>(
                    <div key={chem.k} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"8px 10px",
                      background:s2[chem.k]?"rgba(64,215,197,0.15)":"#000000",borderRadius:6,marginBottom:4,
                      border:s2[chem.k]?`1px solid ${chem.col}44`:"none"}}>
                      <input type="checkbox" checked={!!s2[chem.k]} onChange={e=>upS2(chem.k,e.target.checked)} style={{accentColor:chem.col,marginTop:2,flexShrink:0}}/>
                      <div style={{flex:1}}>
                        <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                          <span style={{color:s2[chem.k]?chem.col:C.white,fontWeight:700,fontSize:11}}>{chem.name}</span>
                          <span style={{...S.badge(chem.rspo.includes("")?C.green:C.amber),fontSize:9}}>{chem.rspo}</span>
                          <span style={{color:C.grey,fontSize:10}}>{chem.cost}</span>
                          {chem.k==="feso4"&&<span style={{...S.badge(C.red),fontSize:9}}> No MnP</span>}
                        </div>
                        <div style={{color:C.grey,fontSize:10,marginTop:2}}>{chem.note}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* ENZYMES in S2 */}
                <div style={S.card}>
                  <SectionHdr icon="" title="ENZYMES (BETTER IN S3 — ALERT IF SELECTED HERE)" color={C.purple}/>
                  <Alert type="warn" msg="Enzymes denature above 55°C — apply ONLY after substrate cools below 45°C. If substrate is still in thermophilic phase, move these to S3 (biological phase)."/>
                  <div style={{height:8}}/>
                  {[
                    {k:"cellulase_s2",name:"Cellulase (T. reesei)",    cost:"$0.35/t",lig:0,  note:"β-1,4-glycosidic hydrolysis → glucose. Requires prior lignin exposure. Best in S3."},
                    {k:"xylanase_s2", name:"Xylanase (A. niger)",       cost:"$0.40/t",lig:2,  note:"β-1,4-xylosidic → xylose. Strips hemicellulose shield. Best in S3."},
                    {k:"laccase_s2",  name:"Laccase (T. versicolor)",   cost:"$0.50/t",lig:5,  note:"Phenolic lignin oxidation. Requires O₂ + aerobic conditions. Best in S3."},
                    {k:"mnp_s2",      name:"MnP — Mn Peroxidase",       cost:"$0.45/t",lig:14, note:"Mn³⁺-mediated phenolic lignin oxidation. INCOMPATIBLE with FeSO₄."},
                    {k:"lip_s2",      name:"LiP — Lignin Peroxidase",   cost:"$0.55/t",lig:20, note:"Highest redox (E°≈1.2V). Non-phenolic lignin cleavage. Requires H₂O₂ co-factor."},
                  ].map(chem=>(
                    <div key={chem.k} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"8px 10px",
                      background:s2[chem.k]?"rgba(64,215,197,0.15)":"#000000",borderRadius:6,marginBottom:4,
                      border:s2[chem.k]?`1px solid ${C.purple}44`:"none"}}>
                      <input type="checkbox" checked={!!s2[chem.k]} onChange={e=>upS2(chem.k,e.target.checked)} style={{accentColor:C.purple,marginTop:2,flexShrink:0}}/>
                      <div style={{flex:1}}>
                        <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                          <span style={{color:s2[chem.k]?C.purple:C.white,fontWeight:700,fontSize:11}}>{chem.name}</span>
                          <span style={{color:C.grey,fontSize:10}}>{chem.cost}</span>
                          {chem.lig>0&&<span style={{...S.badge(C.teal),fontSize:9}}>Lignin -{chem.lig}%</span>}
                        </div>
                        <div style={{color:C.grey,fontSize:10,marginTop:2}}>{chem.note}</div>
                      </div>
                    </div>
                  ))}
                </div>

              </div>{/* end LEFT */}

              {/* RIGHT: Summary panel */}
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                <div style={S.card}>
                  <SectionHdr icon="" title="ACTIVE TREATMENT SUMMARY" color={C.teal}/>
                  <CalcField label="Total lignin reduction" unit="%" value={`~${pksa_ligninRed}%`}/>
                  <CalcField label="Cost per tonne FW" unit="USD" value={`$${s2CostPerT.toFixed(2)}`}/>
                  <CalcField label="Monthly S2 cost" unit="USD" value={`$${s2MonthlyCost.toLocaleString()}`}/>
                  <hr style={S.divider}/>
                  <div style={{color:C.grey,fontSize:11,marginBottom:6}}>ACTIVE CHEMICALS:</div>
                  {Object.keys(s2).filter(k=>!k.endsWith("_dose")&&!["additionalChemical","pksaDose"].includes(k)&&s2[k]===true).map(k=>(
                    <div key={k} style={{background:C.teal+"18",borderRadius:4,padding:"4px 8px",marginBottom:3,
                      color:C.teal,fontSize:11,fontWeight:700}}>{k.toUpperCase().replace("_S2","")}</div>
                  ))}
                </div>

                <div style={S.card}>
                  <SectionHdr icon="" title="PROCESS SEQUENCE + GATES" color={C.amber}/>
                  {[
                    {n:1,step:"PKSA soak at pH 10–12",dur:"60–90 min mixing",gate:"pH sensor confirms"},
                    {n:2,step:"First turning",         dur:"8–12hr post-PKSA",gate:"🔒 HARD LOCK"},
                    {n:3,step:"CO₂ carbonation",       dur:"12–16hr",         gate:"pH dropping"},
                    {n:4,step:"Second turning",        dur:"16–20hr mark",    gate:"🔒 HARD LOCK"},
                    {n:5,step:"pH reach 6.5–8.0",      dur:"24hr total",      gate:"BSF biology OK"},
                  ].map(r=>(
                    <div key={r.n} style={{display:"grid",gridTemplateColumns:"20px 1fr 80px",gap:6,
                      padding:"6px 8px",background:C.inputSectionBg,borderRadius:4,marginBottom:3}}>
                      <span style={{color:C.teal,fontWeight:900}}>{r.n}</span>
                      <div>
                        <div style={{color:C.white,fontSize:11,fontWeight:600}}>{r.step}</div>
                        <div style={{color:C.grey,fontSize:10}}>{r.dur}</div>
                      </div>
                      <span style={{color:r.gate.includes("HARD")?C.red:C.green,fontSize:10,textAlign:"right",fontWeight:700}}>{r.gate}</span>
                    </div>
                  ))}
                </div>

                <div style={S.card}>
                  <SectionHdr icon="💊" title="PKSA NUTRIENT VALUE" color={C.green}/>
                  {[
                    {l:"K₂O",   v:"35–45% DM", note:"$0.633/kg K₂O equiv"},
                    {l:"CaO",   v:"8–12% DM",  note:"Soil liming value"},
                    {l:"MgO",   v:"3–5% DM",   note:"Frond yellowing correction"},
                    {l:"P₂O₅",  v:"1–2% DM",   note:"Available phosphate"},
                    {l:"Cost",  v:"$0/t",       note:"Mill waste — no cost"},
                    {l:"Synth equiv", v:"$129.82/t", note:"vs commercial fertiliser"},
                  ].map((r,i)=>(
                    <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"5px 8px",
                      background:i%2===0?C.navyLt:"transparent",borderRadius:3}}>
                      <span style={{color:C.grey,fontSize:11}}>{r.l}</span>
                      <div style={{textAlign:"right"}}>
                        <span style={{color:C.green,fontWeight:700,fontSize:11}}>{r.v}</span>
                        <div style={{color:C.grey,fontSize:9}}>{r.note}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{background:C.red+"18",border:`1px solid ${C.red}55`,borderRadius:8,padding:"12px 14px"}}>
                  <div style={{color:C.red,fontWeight:800,fontSize:11,marginBottom:6}}>🔒 HARD-CODED RULES — CANNOT OVERRIDE</div>
                  <div style={{color:C.greyLt,fontSize:11,lineHeight:1.8}}>
                    <div>• <b>2-turn minimum</b> at 8–12hr AND 16–20hr</div>
                    <div>• <b>24hr neutralisation</b> minimum before S3</div>
                    <div>• <b>pH exit: 6.5–8.0</b> required for BSF biology</div>
                    <div>• <b>NaOH</b>: permitted + red alert only</div>
                    <div>• <b>Bt ICBB 6095</b>: permitted + red alert only</div>
                  </div>
                </div>
              </div>
            <NutrLedger stg="S2 · After PKSA Treatment (K spike · Ca uplift · C:N drop)" N={nl_N} P={nl_P} K={nl_s2K} Ca={nl_s2Ca} Mg={nl_Mg} OM={nl_s2OM} cn={nl_s2CN} wetPD={nl_wetPD} mc={blendMC} nAdj={soilObj.nAdj} pAdj={soilObj.pAdj} ag={agObj.uplift} col={C.amber}/>
            </div>
          <div style={{textAlign:'right',padding:'12px 0'}}><button onClick={()=>setShowValCalc(v=>!v)} style={{background:'rgba(64,215,197,0.10)',border:'1.5px solid rgba(64,215,197,0.40)',borderRadius:6,color:'#40D7C5',fontFamily:"'DM Mono',monospace",fontSize:11,fontWeight:700,padding:'6px 14px',cursor:'pointer'}}>{showValCalc?'Hide Value Calculator ▴':'Value Calculator ▾'}</button></div>
          {showValCalc && <CFI_ValueCalculator defaultStage="s2"/>}
          </div>
        )}

        {stage===3 && (
          <div>
            {/* KPI Row */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10,marginBottom:16}}>
              <KPI label="Substrate In" value={s1_blendWet.toLocaleString()} unit="t FW/month"/>
              <KPI label="Consortium Uplift" value={`×${upliftFactor}`} unit="BSF yield multiplier" color={C.green}/>
              <KPI label="Monthly Bio Cost" value={`$${s3_monthlyCost.toLocaleString()}`} unit="/month" color={C.amber}/>
              <KPI label="Conflicts" value={s3Conflicts.length} unit={s3Conflicts.length>0?"RESOLVE NOW":"Clear"} color={s3Conflicts.length>0?C.red:C.green}/>
              <KPI label="BSF Gate" value={allPass?" PASS":"⏳ PENDING"} unit="6 criteria" color={allPass?C.green:C.amber}/>
            </div>

            {/* Conflict Alerts */}
            {s3Conflicts.map((c,i)=>(
              <div key={i} style={{background:c.sev==="red"?C.red+"18":C.amber+"18",
                border:`1px solid ${c.sev==="red"?C.red:C.amber}55`,borderRadius:6,
                padding:"8px 14px",marginBottom:8,color:c.sev==="red"?C.red:C.amber,fontSize:11}}>
                {c.sev==="red"?" ":" "}{c.msg}
              </div>
            ))}

            <div style={{display:"grid",gridTemplateColumns:"1fr 360px",gap:16}}>

              {/* LEFT: Organism selector */}
              <div style={{display:"flex",flexDirection:"column",gap:10}}>

                {/* DEFAULT ONE-SHOT PROTOCOL */}
                <div style={S.card}>
                  <SectionHdr icon="⭐" title="DEFAULT — ONE-SHOT INOCULATION PROTOCOL ($0.65/t FW)" color={C.teal}/>
                  <Alert type="ok" msg="All 5 organisms inoculated simultaneously — ONE event after PKSA neutralisation (pH ≤8.0). Consortium uplift ×1.38 on BSF yield."/>
                  <div style={{height:8}}/>
                  {[
                    {k:"lactobacillus",cat:"Bacteria",   name:"Lactobacillus sp. ICBB 6099",   fn:"pH buffer 5.5–6.0 · CH₄ ↓70–80%",                  cost:"$0.05/t",wave:"W1",col:C.blue,   bsf:""},
                    {k:"saccharomyces", cat:"Yeast",      name:"Saccharomyces cerevisiae ICBB 8808",fn:"NH₃ retention +50% · N preservation",             cost:"$0.11/t",wave:"W1",col:C.teal,  bsf:""},
                    {k:"bacillus_sub",  cat:"Bacteria",   name:"Bacillus subtilis ICBB 8780",    fn:"Cellulase + protease · PGPR · endospore shelf life",cost:"$0.02/t",wave:"W1",col:C.green, bsf:""},
                    {k:"azotobacter",   cat:"N-Fixer",    name:"Azotobacter vinelandii ICBB 9098",fn:"N-fixation +10–20 mg N/kg/day · Wave 2 ONLY <50°C",cost:"$0.05/t",wave:"W2",col:C.amber, bsf:""},
                    {k:"trichoderma_h", cat:"Fungi",      name:"Trichoderma harzianum ICBB 9127", fn:"⭐ Ganoderma biocontrol · aggressive cellulase",    cost:"$0.42/t",wave:"W2",col:C.red,   bsf:""},
                  ].map(o=>(
                    <div key={o.k} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"9px 12px",
                      background:s3orgs[o.k]?o.col+"14":C.inputSectionBg,borderRadius:7,marginBottom:5,
                      border:s3orgs[o.k]?`1px solid ${o.col}44`:"none",borderLeft:`3px solid ${s3orgs[o.k]?o.col:C.inputSectionBg}`}}>
                      <input type="checkbox" checked={!!s3orgs[o.k]} onChange={e=>upS3(o.k,e.target.checked)} style={{accentColor:o.col,marginTop:2,flexShrink:0}}/>
                      <div style={{flex:1}}>
                        <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                          <span style={{color:s3orgs[o.k]?o.col:C.white,fontWeight:700,fontSize:11}}>{o.name}</span>
                          <span style={{...S.badge(o.col),fontSize:9}}>{o.cat}</span>
                          <span style={{...S.badge(o.wave==="W1"?C.red:C.blue),fontSize:9}}>{o.wave}</span>
                          <span style={{color:C.grey,fontSize:10}}>{o.cost}</span>
                        </div>
                        <div style={{color:C.grey,fontSize:10,marginTop:2}}>{o.fn}</div>
                      </div>
                    </div>
                  ))}
                  <div style={{background:C.teal+"22",border:`1.5px solid ${C.sectionBorder}`,borderRadius:6,
                    padding:"8px 12px",display:"flex",justifyContent:"space-between",marginTop:8}}>
                    <span style={{color:C.teal,fontWeight:700}}>ONE-SHOT TOTAL</span>
                    <span style={{color:C.teal,fontWeight:900}}>$0.65/t FW · Uplift ×1.38</span>
                  </div>
                </div>

                {/* ADDITIONAL ORGANISMS */}
                <div style={S.card}>
                  <SectionHdr icon="🔥" title="THERMOPHILIC SPECIALISTS (Wave 1 — >50°C)" color={C.red}/>
                  {[
                    {k:"thermomyces",      cat:"Thermo Fungi",  name:"Thermomyces lanuginosus",    fn:"Thermophilic cellulase/xylanase producer",       cost:"$25/kg",temp:"50–60°C",col:C.red,   bsf:""},
                    {k:"myceliophthora",   cat:"Thermo Fungi",  name:"Myceliophthora thermophila",  fn:"C1 cellulase system, industrial enzyme source",  cost:"$30/kg", temp:"45–55°C",col:C.red,   bsf:""},
                    {k:"chaetomium",       cat:"Thermo Fungi",  name:"Chaetomium thermophilum",     fn:"Thermophilic cellulase, model organism",          cost:"$35/kg", temp:"50–60°C",col:C.red,   bsf:""},
                    {k:"geobacillus",      cat:"Thermo Bact",   name:"Geobacillus stearothermophilus",fn:"Thermophilic amylase/protease producer",        cost:"$15/kg", temp:"55–70°C",col:C.amber, bsf:""},
                    {k:"bacillus_lich",    cat:"Thermo Bact",   name:"Bacillus licheniformis",       fn:"Thermotolerant protease/amylase",                cost:"$8/kg",  temp:"50–65°C",col:C.amber, bsf:""},
                    {k:"thermobifida",     cat:"Thermo Actino", name:"Thermobifida fusca",           fn:"Thermophilic actinomycete, cellulase",            cost:"$40/kg", temp:"50–55°C",col:C.red,   bsf:""},
                  ].map(o=>(
                    <div key={o.k} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"8px 10px",
                      background:s3orgs[o.k]?o.col+"14":C.inputSectionBg,borderRadius:6,marginBottom:4,
                      border:s3orgs[o.k]?`1px solid ${o.col}44`:"none"}}>
                      <input type="checkbox" checked={!!s3orgs[o.k]} onChange={e=>upS3(o.k,e.target.checked)} style={{accentColor:o.col,marginTop:2,flexShrink:0}}/>
                      <div style={{flex:1}}>
                        <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                          <span style={{color:s3orgs[o.k]?o.col:C.white,fontWeight:700,fontSize:11}}>{o.name}</span>
                          <span style={{...S.badge(o.col),fontSize:9}}>{o.cat}</span>
                          <span style={{...S.badge(C.red),fontSize:9}}>W1</span>
                          <span style={{color:C.grey,fontSize:10}}>{o.cost} · {o.temp}</span>
                        </div>
                        <div style={{color:C.grey,fontSize:10,marginTop:2}}>{o.fn}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={S.card}>
                  <SectionHdr icon="🍄" title="LIGNINOLYTIC FUNGI (Wave 2 — Mesophilic)" color={C.purple}/>
                  {[
                    {k:"phanerochaete_sp",  cat:"White-rot",  name:"Phanerochaete sp. ICBB 9182",     fn:"Primary lignin destroyer — LiP, MnP, Laccase trio",     cost:"$8/L",  col:C.purple, bsf:""},
                    {k:"phanerochaete_chry",cat:"White-rot",  name:"Phanerochaete chrysosporium",       fn:"Strongest lignin degrader — wild-type reference strain", cost:"$8/L",  col:C.purple, bsf:""},
                    {k:"pleurotus",         cat:"White-rot",  name:"Pleurotus ostreatus",               fn:"SELECTIVE lignin degradation — preserves cellulose",      cost:"$0.30/kg",col:C.green, bsf:""},
                    {k:"trametes",          cat:"White-rot",  name:"Trametes versicolor",               fn:"Laccase producer, lignin oxidation, phenolic detox",     cost:"$2/L",  col:C.teal,   bsf:""},
                    {k:"ganoderma",         cat:"White-rot",  name:"Ganoderma lucidum",                 fn:" Related to palm pathogen G. boninense — verify strain!", cost:"$1.50/L",col:C.red,   bsf:""},
                    {k:"aspergillus_n",     cat:"Fungi",      name:"Aspergillus niger",                 fn:"Industrial cellulase/pectinase · P-solubiliser",         cost:"$5/kg", col:C.amber,  bsf:""},
                    {k:"aspergillus_o",     cat:"Fungi",      name:"Aspergillus oryzae",                fn:"Koji mold — amylase + protease",                          cost:"$3/kg", col:C.amber,  bsf:""},
                  ].map(o=>(
                    <div key={o.k} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"8px 10px",
                      background:s3orgs[o.k]?o.col+"14":C.inputSectionBg,borderRadius:6,marginBottom:4,
                      border:s3orgs[o.k]?`1px solid ${o.col}44`:"none"}}>
                      <input type="checkbox" checked={!!s3orgs[o.k]} onChange={e=>upS3(o.k,e.target.checked)} style={{accentColor:o.col,marginTop:2,flexShrink:0}}/>
                      <div style={{flex:1}}>
                        <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                          <span style={{color:s3orgs[o.k]?o.col:C.white,fontWeight:700,fontSize:11}}>{o.name}</span>
                          <span style={{...S.badge(o.col),fontSize:9}}>{o.cat}</span>
                          <span style={{...S.badge(o.bsf===""?C.green:C.amber),fontSize:9}}>BSF {o.bsf}</span>
                          <span style={{color:C.grey,fontSize:10}}>{o.cost}</span>
                        </div>
                        <div style={{color:C.grey,fontSize:10,marginTop:2}}>{o.fn}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={S.card}>
                  <SectionHdr icon="🧫" title="BACTERIA — N-FIXERS, P-SOLUBILISERS, K-MOBILISERS" color={C.green}/>
                  {[
                    {k:"microbacterium", cat:"Bacteria",     name:"Microbacterium lactium ICBB 7125",   fn:"Primary cellulose decomposer → glucose",               cost:"$3/L",  col:C.green, wave:"W1"},
                    {k:"paenibacillus",  cat:"Bacteria",     name:"Paenibacillus macerans ICBB 8810",   fn:"Hemicellulase + nif genes (N-fixation)",               cost:"$3/L",  col:C.green, wave:"W2"},
                    {k:"bacillus_meg",   cat:"P-Solubiliser",name:"Bacillus megaterium",                 fn:"P-solubiliser via gluconic acid secretion",            cost:"$1.5/kg",col:C.blue, wave:"W2"},
                    {k:"cellulomonas",   cat:"Bacteria",     name:"Cellulomonas fimi",                   fn:"Cellulolytic bacterium — cellulose degradation",       cost:"$4/L",  col:C.teal, wave:"W1"},
                    {k:"azospirillum",   cat:"N-Fixer",      name:"Azospirillum lipoferum ICBB 6088",   fn:"Associative N-fixer + IAA phytohormone production",    cost:"$1/L",  col:C.amber, wave:"W2"},
                    {k:"bradyrhizobium", cat:"N-Fixer",      name:"Bradyrhizobium japonicum ICBB 9251", fn:"Root-nodule N-fixer (soil application phase)",        cost:"$1.5/L",col:C.amber, wave:"W2"},
                    {k:"pseudomonas",    cat:"P-Solubiliser",name:"Pseudomonas fluorescens",             fn:"P-solubiliser + HCN biocontrol vs Ganoderma",         cost:"$2.4/L",col:C.blue, wave:"W2"},
                    {k:"bacillus_coag",  cat:"P-Solubiliser",name:"Bacillus coagulans",                  fn:"P-solubiliser + probiotic + heat-tolerant",            cost:"$2/kg", col:C.teal, wave:"W1"},
                    {k:"bacillus_muc",   cat:"K-Mobiliser",  name:"Bacillus mucilaginosus",              fn:"K-solubiliser from silicate minerals",                 cost:"$3/kg", col:C.amber, wave:"W2"},
                    {k:"frateuria",      cat:"K-Mobiliser",  name:"Frateuria aurantia",                  fn:"K-mobiliser specialist organism",                      cost:"$4/L",  col:C.amber, wave:"W2"},
                    {k:"streptomyces_a", cat:"Actinomycete", name:"Streptomyces sp. ICBB 9155",          fn:"Lignocellulolytic + antibiotic production",            cost:"$5/kg", col:C.purple, wave:"W2"},
                    {k:"streptomyces_b", cat:"Actinomycete", name:"Streptomyces sp. ICBB 9469",          fn:"Complementary antibiotic profile",                     cost:"$5/kg", col:C.purple, wave:"W2"},
                    {k:"provibio_full",  cat:"Consortium",   name:"Provibio 9-Organism (full pack)",     fn:"Full commercial consortium — Tricho+Bacillus+Pseudo+Lacto+Sacch+Cellulomonas+Azoto+Strepto+Asperg",cost:"$0.80/t",col:C.teal, wave:"W1+2"},
                    {k:"em4",            cat:"EM Consortium",name:"EM-4 (Effective Microorganisms)",     fn:"Lacto+Sacch+Rhodo+Asperg — pH 3.5 liquid, easy adoption",cost:"$0.12/t",col:C.green, wave:"W1"},
                  ].map(o=>(
                    <div key={o.k} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"8px 10px",
                      background:s3orgs[o.k]?o.col+"14":C.inputSectionBg,borderRadius:6,marginBottom:4,
                      border:s3orgs[o.k]?`1px solid ${o.col}44`:"none"}}>
                      <input type="checkbox" checked={!!s3orgs[o.k]} onChange={e=>upS3(o.k,e.target.checked)} style={{accentColor:o.col,marginTop:2,flexShrink:0}}/>
                      <div style={{flex:1}}>
                        <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                          <span style={{color:s3orgs[o.k]?o.col:C.white,fontWeight:700,fontSize:11}}>{o.name}</span>
                          <span style={{...S.badge(o.col),fontSize:9}}>{o.cat}</span>
                          <span style={{...S.badge(o.wave.includes("W1")?C.red:C.blue),fontSize:9}}>{o.wave}</span>
                          <span style={{color:C.grey,fontSize:10}}>{o.cost}</span>
                        </div>
                        <div style={{color:C.grey,fontSize:10,marginTop:2}}>{o.fn}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={S.card}>
                  <SectionHdr icon="" title="ENZYMES (Apply post-thermophilic — <45°C only)" color={C.purple}/>
                  <Alert type="warn" msg="Never apply enzymes during thermophilic phase (>55°C). Irreversible denaturation. Apply as part of Wave 2 after substrate cools."/>
                  <div style={{height:8}}/>
                  {[
                    {k:"cellulase_e",    name:"Cellulase EC 3.2.1.4",   fn:"β-1,4-glycosidic → glucose · +35–45% IVDMD",          cost:"$15/kg",col:C.green},
                    {k:"xylanase_e",     name:"Xylanase EC 3.2.1.8",    fn:"β-1,4-xylosidic → xylose · strips hemi shield",        cost:"$17/kg",col:C.teal},
                    {k:"laccase_e",      name:"Laccase EC 1.10.3.2",    fn:"Phenolic detoxification · opens lignin surface",        cost:"$20/kg",col:C.purple},
                    {k:"pectinase_e",    name:"Pectinase EC 3.2.1.15",  fn:"Pectin breakdown · softens cell walls",                 cost:"$12/kg",col:C.amber},
                    {k:"lipase_e",       name:"Lipase EC 3.1.1.3",      fn:"Fat breakdown · OPDC 3–8% lipid release",               cost:"$18/kg",col:C.amber},
                    {k:"protease_e",     name:"Protease EC 3.4.x.x",    fn:"Protein accessibility for BSF",                         cost:"$10/kg",col:C.green},
                    {k:"amylase_e",      name:"Amylase EC 3.2.1.1",     fn:"Starch → glucose · 55–70°C optimum",                    cost:"$8/kg", col:C.teal},
                    {k:"mannanase_e",    name:"Mannanase EC 3.2.1.78",  fn:"Mannan breakdown (palm kernel · PKE substrate)",        cost:"$22/kg",col:C.amber},
                    {k:"bglucosidase_e", name:"β-glucosidase EC 3.2.1.21",fn:"Final cellulose step cellobiose → glucose",           cost:"$25/kg",col:C.green},
                  ].map(o=>(
                    <div key={o.k} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"8px 10px",
                      background:s3orgs[o.k]?C.purple+"14":C.inputSectionBg,borderRadius:6,marginBottom:4,
                      border:s3orgs[o.k]?`1px solid ${C.purple}44`:"none"}}>
                      <input type="checkbox" checked={!!s3orgs[o.k]} onChange={e=>upS3(o.k,e.target.checked)} style={{accentColor:C.purple,marginTop:2,flexShrink:0}}/>
                      <div style={{flex:1}}>
                        <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                          <span style={{color:s3orgs[o.k]?C.purple:C.white,fontWeight:700,fontSize:11}}>{o.name}</span>
                          <span style={{...S.badge(C.purple),fontSize:9}}>Enzyme</span>
                          <span style={{...S.badge(C.blue),fontSize:9}}>W2 only</span>
                          <span style={{color:C.grey,fontSize:10}}>{o.cost}</span>
                        </div>
                        <div style={{color:C.grey,fontSize:10,marginTop:2}}>{o.fn}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* BT — AMBER WARNING ZONE */}
                <div style={{background:C.amber+"18",border:`2px solid ${C.amber}77`,borderRadius:8,padding:14}}>
                  <div style={{color:C.amber,fontWeight:900,fontSize:12,marginBottom:6}}> ALLOWED — TIMING-CRITICAL / USE WITH CAUTION IN BSF PATHWAYS</div>
                  <div style={{display:"flex",alignItems:"flex-start",gap:10,padding:"8px 10px",background:C.amber+"22",borderRadius:6}}>
                    <input type="checkbox" checked={!!s3orgs.bt_icbb} onChange={e=>upS3("bt_icbb",e.target.checked)} style={{accentColor:C.amber,marginTop:2,flexShrink:0}}/>
                    <div>
                      <div style={{color:C.amber,fontWeight:700,fontSize:11}}>Bacillus thuringiensis (Bt) ICBB 6095 — Provibio</div>
                      <div style={{color:C.greyLt,fontSize:10,marginTop:3}}> Produces Cry1A + Cry3A proteins which at high titres are toxic to Diptera larvae (BSF). <strong style={{color:C.amber}}>ALLOWED</strong> — apply during S3 composting phase only (Wave 1/2). Must confirm Bt titre has degraded to &lt;10⁴ CFU/g before S4 BSF loading. Monitor larvae Day 1–3 for mortality signs. Do NOT apply directly to active BSF rearing beds.</div>
                      {s3orgs.bt_icbb && <div style={{color:C.amber,fontWeight:700,marginTop:6,background:C.amber+"33",padding:"4px 8px",borderRadius:4}}>🔶 ACTIVE — Confirm titre decay before S4 BSF introduction. Check substrate temp &gt;55°C for 48h to denature Cry proteins.</div>}
                    </div>
                  </div>
                </div>

              </div>{/* end LEFT */}

              {/* RIGHT: BSF Gate + Consortium Analysis */}
              <div style={{display:"flex",flexDirection:"column",gap:10}}>

                <div style={S.card}>
                  <SectionHdr icon="" title="GATE MEASUREMENTS — ENTER LAB READINGS (OPTIONAL)" color={C.blue}/>
                  <div style={{fontSize:10,color:C.grey,marginBottom:8}}>Pipeline-calculated values auto-populate. Enter actual lab measurements to override.</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
                    <BluField label="C:N Measured" unit="ratio" value={s3.cn_measured} onChange={v=>upS3Gate("cn_measured",v)} note={`Pipeline calc: ${blendCN||"—"}`}/>
                    <BluField label="Moisture Measured" unit="%" value={s3.mc_measured} onChange={v=>upS3Gate("mc_measured",v)} note={`Pipeline calc: ${blendMC}%`}/>
                    <BluField label="pH Measured (post-S2)" unit="pH" value={s3.ph_measured} onChange={v=>upS3Gate("ph_measured",v)} note="Target: 6.5–8.0"/>
                    <BluField label="Substrate Temperature" unit="°C" value={s3.temp_measured} onChange={v=>upS3Gate("temp_measured",v)} note="Must be ≤30°C before BSF"/>
                  </div>
                  <div style={{display:"flex",gap:16,marginBottom:8}}>
                    <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}}>
                      <input type="checkbox" checked={s3.bt_confirmed_absent}
                        onChange={e=>upS3Gate("bt_confirmed_absent",e.target.checked)} style={{accentColor:C.green}}/>
                      <span style={{color:s3.bt_confirmed_absent?C.green:C.amber,fontWeight:700,fontSize:12}}>
                        ✓ Confirm Bt ICBB 6095 titre below 10⁴ CFU/g (or not active)
                      </span>
                    </label>
                    <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}}>
                      <input type="checkbox" checked={s3.visual_ok}
                        onChange={e=>upS3Gate("visual_ok",e.target.checked)} style={{accentColor:C.green}}/>
                      <span style={{color:s3.visual_ok?C.green:C.amber,fontWeight:700,fontSize:12}}>
                        ✓ Visual check: substrate not compacted / anaerobic
                      </span>
                    </label>
                  </div>
                </div>

                <div style={S.card}>
                  <SectionHdr icon="🚦" title="BSF HANDOFF GATE — 6 CRITERIA" color={allPass?C.green:C.amber}/>
                  {[
                    {label:"C:N Ratio",   pass:cnPass,  val:cnGate!=null?`${typeof cnGate==="number"?cnGate.toFixed(1):cnGate}:1 — target ≤35 ${s3.cn_measured?"[measured]":"[calc'd]"}`:"Not yet calculated", icon:""},
                    {label:"Moisture",    pass:mcPass,  val:`${mcGate!=null?mcGate.toFixed(1):blendMC}% — target 55–75% ${s3.mc_measured?"[measured]":"[calc'd]"}`, icon:""},
                    {label:"pH (S2 out)", pass:phPass,  val:phGate!=null?`${typeof phGate==="number"?phGate.toFixed(1):phGate} — target 6.5–8.0 ${s3.ph_measured?"[measured]":"[PKSA assumed]"}`:"Enter pH measurement", icon:""},
                    {label:"Temperature", pass:tmpPass, val:tmpGate!=null?`${tmpGate}°C — target ≤30°C [measured]`:"Enter substrate temp °C", icon:"🌡"},
                    {label:"Bt status",   pass:btPass,  val:btPass?"Bt ICBB 6095 not active ":" Bt ACTIVE — Confirm titre <10⁴ CFU/g & 48h >55°C before S4", icon:""},
                    {label:"Visual OK",   pass:visPass, val:"Confirm substrate not compacted / anaerobic", icon:"👁"},
                  ].map((g,i)=>(
                    <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 10px",
                      background:g.pass?C.green+"14":C.red+"14",borderRadius:6,marginBottom:4,
                      border:`1px solid ${g.pass?C.green:C.red}44`}}>
                      <span style={{fontSize:14}}>{g.icon}</span>
                      <div style={{flex:1}}>
                        <div style={{color:g.pass?C.green:C.red,fontWeight:700,fontSize:11}}>{g.label}</div>
                        <div style={{color:C.grey,fontSize:10}}>{g.val}</div>
                      </div>
                      <span style={{color:g.pass?C.green:C.red,fontWeight:900,fontSize:16}}>{g.pass?"✓":"✗"}</span>
                    </div>
                  ))}
                  <div style={{background:allPass?C.green+"22":C.amber+"22",border:`2px solid ${allPass?C.green:C.amber}55`,
                    borderRadius:8,padding:"10px 14px",textAlign:"center",marginTop:8}}>
                    <div style={{color:allPass?C.green:C.amber,fontWeight:900,fontSize:14}}>
                      {allPass?" ALL GATES PASS — BSF INTRODUCTION APPROVED":"⏳ WAITING — RESOLVE ABOVE BEFORE BSF"}
                    </div>
                  </div>
                </div>

                <div style={S.card}>
                  <SectionHdr icon="" title="CONSORTIUM ANALYSIS" color={C.teal}/>
                  <CalcField label="S4 Yield Uplift" unit="× baseline" value={upliftFactor}/>
                  <CalcField label="Monthly bio cost" unit="USD" value={`$${s3_monthlyCost.toLocaleString()}`}/>
                  <CalcField label="Annual bio cost" unit="USD" value={`$${s3_annualCost.toLocaleString()}`}/>
                  <hr style={S.divider}/>
                  <div style={{fontSize:10,color:C.grey,lineHeight:1.8}}>
                    <div>• <span style={{color:C.green}}>Lignin fungi:</span> {ligninOrgs} active → +{(ligninOrgs*8)}% uplift</div>
                    <div>• <span style={{color:C.amber}}>N-fixers:</span> {nfixOrgs} active → +{(nfixOrgs*5)}% uplift</div>
                    <div>• <span style={{color:C.purple}}>Enzymes:</span> {enzymeOrgs} active → +{(enzymeOrgs*10)}% uplift</div>
                    <div>• <span style={{color:C.red}}>Trichoderma:</span> {s3orgs.trichoderma_h?"+15% Ganoderma biocontrol":"Not active"}</div>
                  </div>
                </div>

                <div style={S.card}>
                  <SectionHdr icon="⏱" title="WAVE TIMING GATES" color={C.amber}/>
                  {[
                    {wave:"Wave 1 Trigger",   trigger:"pH sensor ≤ 8.0",     who:"Lactobacillus · Sacch · Bacillus · Thermophiles",  col:C.amber},
                    {wave:"Wave 2 Trigger",   trigger:"Temperature < 50°C",  who:"Azotobacter · Trichoderma · P-solubilisers · N-fixers", col:C.blue},
                    {wave:"Enzyme Window",    trigger:"Temperature < 45°C",  who:"All enzymes: Cellulase · Xylanase · Laccase",       col:C.purple},
                    {wave:"BSF Introduction", trigger:"Temperature ≤ 30°C",  who:"After 5-day minimum bio treatment",                 col:C.green},
                    {wave:"Bio Minimum",      trigger:"5 days hard lock",    who:"Cannot shorten — regulatory + biological basis",   col:C.red},
                  ].map((r,i)=>(
                    <div key={i} style={{padding:"8px 10px",background:C.inputSectionBg,borderRadius:5,marginBottom:4,
                      borderLeft:`3px solid ${r.col}`}}>
                      <div style={{color:r.col,fontWeight:700,fontSize:11}}>{r.wave}</div>
                      <div style={{color:C.white,fontSize:11,margin:"2px 0"}}>{r.trigger}</div>
                      <div style={{color:C.grey,fontSize:10}}>{r.who}</div>
                    </div>
                  ))}
                </div>

                <div style={S.card}>
                  <SectionHdr icon="🔢" title="ACTIVE ORGANISMS" color={C.teal}/>
                  {Object.keys(s3orgs).filter(k=>!["customOrg","bt_icbb"].includes(k)&&s3orgs[k]===true).length===0 ? (
                    <div style={{color:C.grey,fontSize:11}}>No organisms selected</div>
                  ) : (
                    Object.keys(s3orgs).filter(k=>!["customOrg","bt_icbb"].includes(k)&&s3orgs[k]===true).map(k=>(
                      <div key={k} style={{background:C.teal+"18",borderRadius:4,padding:"4px 8px",marginBottom:3,color:C.teal,fontSize:10,fontWeight:700}}>
                        {k.replace(/_/g," ").toUpperCase()}
                      </div>
                    ))
                  )}
                  {s3orgs.bt_icbb && (
                    <div style={{background:C.red+"22",borderRadius:4,padding:"4px 8px",marginBottom:3,color:C.red,fontSize:10,fontWeight:700}}>
                       BT ICBB 6095 — BSF BLOCKED
                    </div>
                  )}
                </div>

              </div>{/* end RIGHT */}
            <NutrLedger stg="S3 · After Biological Treatment (N+8% · P+10% PSB · K+5%)" N={nl_s3N} P={nl_s3P} K={nl_s3K} Ca={nl_s3Ca} Mg={nl_Mg} OM={nl_s3OM} cn={nl_s3CN} wetPD={nl_wetPD} mc={blendMC} nAdj={soilObj.nAdj} pAdj={soilObj.pAdj} ag={agObj.uplift} col={C.green}/>
            </div>
          <div style={{textAlign:'right',padding:'12px 0'}}><button onClick={()=>setShowValCalc(v=>!v)} style={{background:'rgba(64,215,197,0.10)',border:'1.5px solid rgba(64,215,197,0.40)',borderRadius:6,color:'#40D7C5',fontFamily:"'DM Mono',monospace",fontSize:11,fontWeight:700,padding:'6px 14px',cursor:'pointer'}}>{showValCalc?'Hide Value Calculator ▴':'Value Calculator ▾'}</button></div>
          {showValCalc && <CFI_ValueCalculator defaultStage="s3"/>}
          </div>
        )}

        {/* ════════════════════ S T A G E  4 ════════════════════ */}
        {stage===4 && (
          <div>
            {/* ── KPI BAR ── */}
            <div style={{display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:10, marginBottom:14}}>
              <KPI label="Substrate In" value={s4_substrateIn.toLocaleString()} unit="t FW/month"/>
              <KPI label="Bay A (protein)" value={`Day ${bayADays}`} unit={`${bayASplit}% substrate`} color={C.green}/>
              <KPI label="Bay B (biomass)" value={`Day ${bayBDays}`} unit={`${bayBSplit}% substrate`} color={C.amber}/>
              <KPI label="Combined Protein" value={`${combo_proteinDM}% DM`} unit="weighted avg" color={C.teal}/>
              <KPI label="Larvae FW (uplifted)" value={s4_larvaeFW.toLocaleString()} unit={`t/month (×${upliftFactor})`} color={C.teal}/>
              <KPI label="Frass FW" value={s4_frassFW.toLocaleString()} unit="t/month → S5" color={C.amber}/>
            </div>

            {/* ── SUB-TABS ── */}
            <div style={{display:"flex", gap:6, marginBottom:14}}>
              {[["grow","🐛","Grow-Out"],["pkm","","PKM / Substrate"],["lab","","Lab Analysis S3→S4"]].map(([id,icon,lbl])=>(
                <div key={id} onClick={()=>upS4("s4tab",id)} style={{
                  padding:"7px 16px", borderRadius:6, cursor:"pointer", fontSize:12, fontWeight:700,
                  background: s4.s4tab===id ? C.teal+"33" : C.inputSectionBg,
                  border:`1px solid ${s4.s4tab===id ? C.teal : C.inputSectionBg}`,
                  color: s4.s4tab===id ? C.teal : C.grey}}>
                  {icon} {lbl}
                  {id==="pkm" && pkmWarning && <span style={{marginLeft:6, color:C.red, fontSize:10}}></span>}
                </div>
              ))}
            </div>



            {/* ══ TAB: GROW-OUT ══ */}
            {s4.s4tab==="grow" && (
              <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:16}}>

                {/* Bay A */}
                <div style={{...S.card, border:`1px solid ${C.green}44`}}>
                  <SectionHdr icon="" title={`BAY A — PROTEIN-OPTIMISED (Day ${bayADays})`} color={C.green}/>
                  <div style={S.row}>
                    <div style={S.col}>
                      <Lbl t="Bay A grow days" unit="6–10 (protein peak)"/>
                      <input type="range" min="6" max="10" step="1" value={bayADays}
                        onChange={e=>upS4("bayADays",+e.target.value)}
                        style={{width:"100%", accentColor:C.green}}/>
                      <div style={{display:"flex", justifyContent:"space-between", color:C.grey, fontSize:10}}>
                        <span>Day 6</span><span style={{color:C.green, fontWeight:800}}>Day {bayADays}</span><span>Day 10</span>
                      </div>
                    </div>
                  </div>
                  <div style={S.row}>
                    <div style={S.col}>
                      <Lbl t="Bay A substrate share" unit="% of total"/>
                      <input type="range" min="0" max="100" step="5" value={bayASplit}
                        onChange={e=>upS4("bayASplit",+e.target.value)}
                        style={{width:"100%", accentColor:C.green}}/>
                      <div style={{display:"flex", justifyContent:"space-between", color:C.grey, fontSize:10}}>
                        <span>0%</span><span style={{color:C.green, fontWeight:800}}>{bayASplit}%</span><span>100%</span>
                      </div>
                    </div>
                  </div>
                  <hr style={S.divider}/>
                  <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:6}}>
                    {[
                      {l:"Protein",v:`${bayA_proteinDM}% DM`, hi:true},
                      {l:"Fat",    v:`${bayA_fatDM}% DM`},
                      {l:"Moisture",v:`${bayA_moisture}% wb`},
                      {l:"Yield",  v:`${bayA_yieldPct}%`},
                      {l:"FCR",    v:`${bayA_FCR}:1`},
                      {l:"Grade",  v:"Pet Food ", hi:true},
                    ].map((r,i)=>(
                      <div key={i} style={{background:C.inputSectionBg, borderRadius:5, padding:"7px 10px"}}>
                        <div style={{color:C.grey, fontSize:9, textTransform:"uppercase"}}>{r.l}</div>
                        <div style={{color:r.hi?C.green:C.teal, fontWeight:700, fontSize:12}}>{r.v}</div>
                      </div>
                    ))}
                  </div>
                  <Alert type="ok" msg={`Day ${bayADays} protein-optimised: ${bayA_proteinDM}% CP vs Day 13 (43.7%). Protein:fat ratio ${(bayA_proteinDM/bayA_fatDM).toFixed(2)}× — AAFCO monoprotein eligible.`}/>
                </div>

                {/* Bay B */}
                <div style={{...S.card, border:`1px solid ${C.amber}44`}}>
                  <SectionHdr icon="" title={`BAY B — BIOMASS-OPTIMISED (Day ${bayBDays})`} color={C.amber}/>
                  <div style={S.row}>
                    <div style={S.col}>
                      <Lbl t="Bay B grow days" unit="10–18 (max yield)"/>
                      <input type="range" min="10" max="18" step="1" value={bayBDays}
                        onChange={e=>upS4("bayBDays",+e.target.value)}
                        style={{width:"100%", accentColor:C.amber}}/>
                      <div style={{display:"flex", justifyContent:"space-between", color:C.grey, fontSize:10}}>
                        <span>Day 10</span><span style={{color:C.amber, fontWeight:800}}>Day {bayBDays}</span><span>Day 18</span>
                      </div>
                    </div>
                  </div>
                  <div style={{padding:"8px 12px", background:C.inputSectionBg, borderRadius:6, marginBottom:8}}>
                    <div style={{color:C.grey, fontSize:10}}>Bay B substrate share</div>
                    <div style={{color:C.amber, fontWeight:900, fontSize:20}}>{bayBSplit}%</div>
                    <div style={{color:C.grey, fontSize:9}}>(100% − Bay A share)</div>
                  </div>
                  <hr style={S.divider}/>
                  <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:6}}>
                    {[
                      {l:"Protein",v:`${bayB_proteinDM}% DM`},
                      {l:"Fat",    v:`${bayB_fatDM}% DM`, hi:true},
                      {l:"Moisture",v:`${bayB_moisture}% wb`},
                      {l:"Yield",  v:`${bayB_yieldPct}%`, hi:true},
                      {l:"FCR",    v:`${bayB_FCR}:1`},
                      {l:"Grade",  v:"Aquafeed / Livestock"},
                    ].map((r,i)=>(
                      <div key={i} style={{background:C.inputSectionBg, borderRadius:5, padding:"7px 10px"}}>
                        <div style={{color:C.grey, fontSize:9, textTransform:"uppercase"}}>{r.l}</div>
                        <div style={{color:r.hi?C.amber:C.teal, fontWeight:700, fontSize:12}}>{r.v}</div>
                      </div>
                    ))}
                  </div>
                  {bayBDays >= 14 && <Alert type="ok" msg={`Day ${bayBDays} — maximum FW yield. Fat ${bayB_fatDM}% DM (energy-dense). Best for aquafeed and livestock meal grade.`}/>}
                </div>

                {/* Combined output + mass balance */}
                <div style={{...S.card, gridColumn:"1/-1"}}>
                  <SectionHdr icon="⚖" title="DUAL-TRACK COMBINED OUTPUT + MASS BALANCE" color={C.teal}/>
                  <div style={{display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:12}}>
                    <div style={{background:C.inputSectionBg, borderRadius:6, padding:"10px 14px", borderTop:`3px solid ${C.teal}`}}>
                      <div style={{color:C.grey, fontSize:10}}>Weighted Protein</div>
                      <div style={{color:C.teal, fontWeight:900, fontSize:22}}>{combo_proteinDM}%</div>
                      <div style={{color:C.grey, fontSize:9}}>DM basis</div>
                    </div>
                    <div style={{background:C.inputSectionBg, borderRadius:6, padding:"10px 14px", borderTop:`3px solid ${C.green}`}}>
                      <div style={{color:C.grey, fontSize:10}}>Combined Yield</div>
                      <div style={{color:C.green, fontWeight:900, fontSize:22}}>{combo_yieldPct}%</div>
                      <div style={{color:C.grey, fontSize:9}}>of substrate FW</div>
                    </div>
                    <div style={{background:C.inputSectionBg, borderRadius:6, padding:"10px 14px", borderTop:`3px solid ${C.amber}`}}>
                      <div style={{color:C.grey, fontSize:10}}>Larvae FW (uplifted)</div>
                      <div style={{color:C.amber, fontWeight:900, fontSize:22}}>{s4_larvaeFW.toLocaleString()}</div>
                      <div style={{color:C.grey, fontSize:9}}>t/month ×{upliftFactor}</div>
                    </div>
                    <div style={{background:C.inputSectionBg, borderRadius:6, padding:"10px 14px", borderTop:`3px solid ${C.blue}`}}>
                      <div style={{color:C.grey, fontSize:10}}>Frass FW → S5</div>
                      <div style={{color:C.blue, fontWeight:900, fontSize:22}}>{s4_frassFW.toLocaleString()}</div>
                      <div style={{color:C.grey, fontSize:9}}>t/month (post-evap)</div>
                    </div>
                  </div>
                  <div style={{background:C.inputSectionBg, borderRadius:6, padding:"10px 14px", marginBottom:10}}>
                    <div style={{color:C.grey, fontSize:11, marginBottom:6, fontWeight:700}}>CONSORTIUM UPLIFT</div>
                    <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                      <span style={{color:C.white, fontSize:12}}>{s3.consortium ? s3.consortium.toUpperCase() : "ONE-SHOT"}</span>
                      <span style={{color:C.green, fontWeight:900, fontSize:18}}>×{upliftFactor}</span>
                    </div>
                    <div style={{color:C.grey, fontSize:10, marginTop:4}}>
                      Base larvae {s4_larvaeRaw} t/month → uplifted {s4_larvaeFW} t/month | Uplift adds {+(s4_larvaeFW - s4_larvaeRaw).toFixed(1)} t/month
                    </div>
                  </div>

                  {/* S5 pathway selector */}
                  <SectionHdr icon="🔀" title="S5 PATHWAY SELECTION" color={C.amber}/>
                  <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12}}>
                    {[
                      {id:"s5a", icon:"", title:"S5A — EXTRACT LARVAE", sub:"Biofertiliser (frass only) + Live larvae → S6",
                       n:`${s5a_N_DM}% DM`, p:`${s5a_P_DM}% DM`, k:`${s5a_K_DM}% DM`, cn:`${s5a_CN}:1`,
                       val:s5a_NPKval, fw:s5a_FW, color:C.green,
                       note:"Higher insect revenue. Frass has lower NPK (larvae removed N+P)."},
                      {id:"s5b", icon:"", title:"S5B — TERMINATE IN-SUBSTRATE", sub:"Biofertiliser (frass + larvae combined)",
                       n:`${s5b_N_DM}% DM`, p:`${s5b_P_DM}% DM`, k:`${s5b_K_DM}% DM`, cn:`${s5b_CN}:1`,
                       val:s5b_NPKval, fw:s5b_FW, color:C.amber,
                       note:"Max fertiliser NPK. No insect meal/oil revenue. Best for plantation-only model."},
                    ].map(opt=>(
                      <div key={opt.id} onClick={()=>upS4("pathwayS5",opt.id)} style={{
                        background: s4.pathwayS5===opt.id ? opt.color+"22" : C.inputSectionBg,
                        border:`2px solid ${s4.pathwayS5===opt.id ? opt.color : "transparent"}`,
                        borderRadius:8, padding:"14px 16px", cursor:"pointer"}}>
                        <div style={{display:"flex", alignItems:"center", gap:10, marginBottom:8}}>
                          <span style={{fontSize:20}}>{opt.icon}</span>
                          <div>
                            <div style={{color:opt.color, fontWeight:900, fontSize:13}}>{opt.title}</div>
                            <div style={{color:C.grey, fontSize:10}}>{opt.sub}</div>
                          </div>
                          {s4.pathwayS5===opt.id && <span style={{...S.badge(opt.color), marginLeft:"auto"}}>✓ SELECTED</span>}
                        </div>
                        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:6}}>
                          {[["N",opt.n],["P",opt.p],["K",opt.k],["C:N",opt.cn]].map(([l,v])=>(
                            <div key={l} style={{background:C.pageBg, borderRadius:4, padding:"5px 8px", textAlign:"center"}}>
                              <div style={{color:C.grey, fontSize:9}}>{l} (%DM)</div>
                              <div style={{color:opt.color, fontWeight:700, fontSize:12}}>{v}</div>
                            </div>
                          ))}
                        </div>
                        <div style={{marginTop:8, display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                          <span style={{color:C.grey, fontSize:10}}>{opt.note}</span>
                          <span style={{color:opt.color, fontWeight:900, fontSize:14}}>${opt.val}/t FW</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ══ TAB: PKM / SUBSTRATE ══ */}
            {s4.s4tab==="pkm" && (
              <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:16}}>

                <div style={S.card}>
                  <SectionHdr icon="" title="PKM SUPPLEMENTATION — SUBSTRATE PROTEIN CORRECTION" color={C.amber}/>
                  <div style={{marginBottom:12}}>
                    <div style={{display:"flex", alignItems:"center", gap:10, marginBottom:8}}>
                      <span style={{color:C.grey, fontSize:12}}>PKM/PKE supplementation</span>
                      <div onClick={()=>upS4("pkmEnabled",!s4.pkmEnabled)} style={{
                        width:44, height:24, borderRadius:12, cursor:"pointer",
                        background:s4.pkmEnabled?C.green:C.inputSectionBg,
                        position:"relative", transition:"background 0.2s"}}>
                        <div style={{
                          position:"absolute", top:3, left:s4.pkmEnabled?22:3,
                          width:18, height:18, borderRadius:9,
                          background:C.white, transition:"left 0.2s"}}/>
                      </div>
                      <span style={{color:s4.pkmEnabled?C.green:C.grey, fontWeight:700, fontSize:12}}>
                        {s4.pkmEnabled?"ACTIVE":"OFF"}
                      </span>
                    </div>
                  </div>

                  {s4.pkmEnabled && (
                    <div>
                      <Lbl t="PKM addition rate" unit="% of substrate DM"/>
                      <input type="range" min="5" max="60" step="5" value={+s4.pkmPct||30}
                        onChange={e=>upS4("pkmPct",+e.target.value)}
                        style={{width:"100%", accentColor:C.amber}}/>
                      <div style={{display:"flex", justifyContent:"space-between", color:C.grey, fontSize:10}}>
                        <span>5%</span>
                        <span style={{color:C.amber, fontWeight:800}}>{s4.pkmPct}% PKM</span>
                        <span>60%</span>
                      </div>
                    </div>
                  )}

                  <hr style={S.divider}/>
                  <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:8}}>
                    <div style={{background:C.inputSectionBg, borderRadius:5, padding:"8px 12px"}}>
                      <div style={{color:C.grey, fontSize:9}}>SUBSTRATE CP (pre-PKM)</div>
                      <div style={{color:substrateCP_S3<8?C.red:C.amber, fontWeight:700, fontSize:16}}>{substrateCP_S3}% DM</div>
                    </div>
                    <div style={{background:C.inputSectionBg, borderRadius:5, padding:"8px 12px"}}>
                      <div style={{color:C.grey, fontSize:9}}>ADJUSTED CP (post-PKM)</div>
                      <div style={{color:adjustedCP<8?C.red:adjustedCP>=12?C.green:C.amber, fontWeight:700, fontSize:16}}>{adjustedCP}% DM</div>
                    </div>
                    <div style={{background:C.inputSectionBg, borderRadius:5, padding:"8px 12px"}}>
                      <div style={{color:C.grey, fontSize:9}}>ADJUSTED C:N</div>
                      <div style={{color:C.teal, fontWeight:700, fontSize:16}}>{adjustedCN}:1</div>
                    </div>
                    <div style={{background:C.inputSectionBg, borderRadius:5, padding:"8px 12px"}}>
                      <div style={{color:C.grey, fontSize:9}}>PKM MONTHLY COST</div>
                      <div style={{color:C.amber, fontWeight:700, fontSize:16}}>${pkmMonthlyCost.toLocaleString()}</div>
                    </div>
                  </div>

                  {pkmWarning && (
                    <Alert type="error" msg={` CRITICAL: Substrate CP ${adjustedCP}% DM is below 8% minimum for BSF growth. EFB-only substrate at 3.4% CP causes catastrophic larval failure. Enable PKM supplementation at ≥30% DM or increase OPDC blending.`}/>
                  )}
                  {!pkmWarning && adjustedCP >= 12 && (
                    <Alert type="ok" msg={`CP ${adjustedCP}% DM — optimal range (12–16% DM). Supports maximum larval growth rate. Research confirms C:N ${adjustedCN} is within target window.`}/>
                  )}
                  {!pkmWarning && adjustedCP >= 8 && adjustedCP < 12 && (
                    <Alert type="warn" msg={`CP ${adjustedCP}% DM — acceptable but sub-optimal. Larvae viable but growth rate may be 15–25% below potential. Consider increasing PKM to reach 12% DM.`}/>
                  )}
                </div>

                <div style={S.card}>
                  <SectionHdr icon="" title="PKM SPECIFICATION & COST BASIS" color={C.teal}/>
                  <div style={{fontSize:11, color:C.greyLt, lineHeight:2.0, marginBottom:12}}>
                    {[
                      ["PKM / PKE source","Palm Kernel Meal (local Sumatra/Java)"],
                      ["Crude Protein","18.5% DM"],
                      ["Crude Fat","7.2% DM"],
                      ["C:N Ratio","25:1"],
                      ["Local price","$85/t FW (confirmed)"],
                      ["Dry Matter","~88%"],
                      ["BSF safety"," Allowed — apply S3 phase only; confirm titre decay before S4"],
                      ["Optimal inclusion","30–50% of substrate DM"],
                    ].map(([l,v],i)=>(
                      <div key={i} style={{display:"flex", justifyContent:"space-between", padding:"4px 0",
                        borderBottom:`1px solid ${C.inputSectionBg}`}}>
                        <span style={{color:C.grey}}>{l}</span>
                        <span style={{color:C.teal, fontWeight:600}}>{v}</span>
                      </div>
                    ))}
                  </div>
                  <SectionHdr icon="" title="RESEARCH-CONFIRMED SUBSTRATE THRESHOLDS" color={C.red}/>
                  <div style={{fontSize:10, color:C.greyLt, lineHeight:1.9}}>
                    {[
                      ["< 8% CP DM","CRITICAL FAILURE — BSF larvae do not survive; zero yield"],
                      ["8–12% CP DM","Sub-optimal — 15–25% yield reduction; acceptable for volume play"],
                      ["12–16% CP DM","OPTIMAL — maximum FCR efficiency; target for protein-grade product"],
                      ["> 18% CP DM","Diminishing returns; excess N increases NH₃ volatilisation"],
                      ["C:N 15–25","Ideal window — <15 causes N toxicity; >30 C-limited growth"],
                    ].map(([range,note],i)=>(
                      <div key={i} style={{display:"flex", gap:8, padding:"4px 0", borderBottom:`1px solid ${C.inputSectionBg}`}}>
                        <span style={{color:i===0?C.red:i===3?C.amber:C.green, fontWeight:700, minWidth:90, fontFamily:"'DM Sans', sans-serif"}}>{range}</span>
                        <span style={{color:C.grey}}>{note}</span>
                      </div>
                    ))}
                  </div>
                  {s4.pkmEnabled && (
                    <div style={{marginTop:10, background:C.inputSectionBg, borderRadius:6, padding:"10px 14px"}}>
                      <div style={{color:C.amber, fontWeight:700, fontSize:11, marginBottom:4}}>MONTHLY PKM REQUIREMENT</div>
                      <div style={{color:C.white, fontSize:14}}>{(pkmMonthlyKg/1000).toFixed(1)} t/month ({pkmMonthlyKg.toLocaleString()} kg)</div>
                      <div style={{color:C.grey, fontSize:10}}>Cost: ${pkmMonthlyCost.toLocaleString()}/month | ${(pkmMonthlyCost*12).toLocaleString()}/year</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ══ TAB: LAB ANALYSIS S3→S4 ══ */}
            {s4.s4tab==="lab" && (
              <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:16}}>

                {/* Parameter delta table */}
                <div style={S.card}>
                  <SectionHdr icon="" title="S3 → S4 SUBSTRATE TRANSFORMATION" color={C.teal}/>
                  <div style={{marginBottom:8, fontSize:10, color:C.grey}}>
                    BSF larvae consume ~30% substrate OM · N/P concentrate as C reduces · lignin partially degraded by gut microbiome
                  </div>
                  <table style={{width:"100%", borderCollapse:"collapse", fontSize:11}}>
                    <thead>
                      <tr style={{background:C.inputSectionBg}}>
                        {["Parameter","S3 In","S4 Out","Δ","Reason"].map((h,i)=>(
                          <td key={i} style={{padding:"6px 8px", color:C.grey, fontWeight:700}}>{h}</td>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        {p:"N (%DM)",       s3:lab_s3_N.toString(),  s4:lab_s4_N.toString(),  up:lab_s4_N>=lab_s3_N,  reason:"N concentrates as C is consumed; microbial N retained"},
                        {p:"P (%DM)",       s3:lab_s3_P.toString(),  s4:lab_s4_P.toString(),  up:true,  reason:"P concentration as OM depleted; larval excretion"},
                        {p:"K (%DM)",       s3:lab_s3_K.toString(),  s4:lab_s4_K.toString(),  up:true,  reason:"Slight concentration; minimal K uptake by larvae"},
                        {p:"Ca (%DM)",      s3:"1.20", s4:"1.80", up:true,  reason:"Larval calcified cuticle shedding cycles"},
                        {p:"Mg (%DM)",      s3:"0.40", s4:"0.55", up:true,  reason:"Mineral concentration; Mg essential larval metabolite"},
                        {p:"OM (%DM)",      s3:lab_s3_OM.toString(), s4:lab_s4_OM.toString(), up:false, reason:"BSF consume substrate OM as energy source"},
                        {p:"C:N",           s3:lab_s3_CN.toString(), s4:lab_s4_CN.toString(), up:false, reason:"N concentrates as C is consumed; ratio narrows"},
                        {p:"Lignin (%DM)",  s3:lab_s3_lignin.toString(), s4:lab_s4_lignin.toString(), up:false, reason:"Partial lignin degradation by gut-associated microbiome"},
                        {p:"Hemicellulose", s3:lab_s3_hemi.toString(), s4:(lab_s3_hemi*0.7).toFixed(1), up:false, reason:"BSF gut enzymes further break down hemicellulose"},
                        {p:"pH",            s3:lab_s3_pH.toString(), s4:lab_s4_pH.toString(), up:lab_s4_pH>=lab_s3_pH, reason:"Mild acidification from larval frass (lactic acid)"},
                        {p:"Moisture (%wb)",s3:"65",  s4:"62",   up:false, reason:"Evaporation during 8–13 day rearing period"},
                        {p:"Crude Protein", s3:lab_s3_CP.toString(), s4:lab_s4_CP.toString(), up:lab_s4_CP>=lab_s3_CP, reason:"Microbial protein + larval exuviae enrichment"},
                        {p:"Fat (%DM)",    s3:"2.1",  s4:"3.5",  up:true,  reason:"Microbial lipid production; partial larval excretion"},
                        {p:"Ash (%DM)",    s3:"8.0",  s4:"12.0", up:true,  reason:"Mineral concentration as OM is metabolised"},
                        {p:"Chitin (%DM)", s3:"0",    s4:"2.5",  up:true,  reason:"Larval exoskeleton fragments (ADF-chitin fraction)"},
                      ].map((row,i)=>{
                        const delta = (parseFloat(row.s4) - parseFloat(row.s3)).toFixed(2);
                        return (
                          <tr key={i} style={{borderBottom:`1px solid ${C.inputSectionBg}`, background:i%2===0?C.navyLt+"30":"transparent"}}>
                            <td style={{padding:"6px 8px", color:C.grey, fontWeight:600}}>{row.p}</td>
                            <td style={{padding:"6px 8px", color:C.white, fontFamily:"'DM Sans', sans-serif"}}>{row.s3}</td>
                            <td style={{padding:"6px 8px", color:row.up?C.green:C.red, fontFamily:"'DM Sans', sans-serif", fontWeight:700}}>
                              {row.s4} <span style={{fontSize:14}}>{row.up?"↑":"↓"}</span>
                            </td>
                            <td style={{padding:"6px 8px", color:row.up?C.green:C.red, fontFamily:"'DM Sans', sans-serif"}}>
                              {row.up?"+":""}{delta}
                            </td>
                            <td style={{padding:"5px 8px", color:C.grey, fontSize:10}}>{row.reason}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  <div style={{marginTop:8, fontSize:10, color:C.grey}}>
                    ↑ enrichment (green) · ↓ reduction (red) · Values on DM basis unless noted
                  </div>
                </div>

                {/* Dual-bay body composition + S3→S4 progression chart */}
                <div style={{display:"flex", flexDirection:"column", gap:14}}>
                  <div style={S.card}>
                    <SectionHdr icon="🐛" title="BAY A vs BAY B — LARVAE BODY COMPOSITION" color={C.green}/>
                    <table style={{width:"100%", borderCollapse:"collapse", fontSize:11}}>
                      <thead>
                        <tr style={{background:C.inputSectionBg}}>
                          {["Parameter","Bay A (Pet Food)","Bay B (Aquafeed)","Δ A→B"].map((h,i)=>(
                            <td key={i} style={{padding:"6px 8px", color:i===1?C.green:i===2?C.amber:C.grey, fontWeight:700}}>{h}</td>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          {p:"Crude Protein %DM", a:bayA_proteinDM, b:bayB_proteinDM},
                          {p:"Crude Fat %DM",     a:bayA_fatDM,     b:bayB_fatDM},
                          {p:"Moisture %wb",      a:bayA_moisture,  b:bayB_moisture},
                          {p:"Yield % substrate", a:bayA_yieldPct,  b:bayB_yieldPct},
                          {p:"FCR (DM:DM)",       a:bayA_FCR,       b:bayB_FCR},
                          {p:"Protein:Fat ratio", a:+(bayA_proteinDM/bayA_fatDM).toFixed(2), b:+(bayB_proteinDM/bayB_fatDM).toFixed(2)},
                        ].map((row,i)=>{
                          const diff = +(row.b - row.a).toFixed(2);
                          return (
                            <tr key={i} style={{borderBottom:`1px solid ${C.inputSectionBg}`, background:i%2===0?C.navyLt+"30":"transparent"}}>
                              <td style={{padding:"6px 8px", color:C.grey}}>{row.p}</td>
                              <td style={{padding:"6px 8px", color:C.green, fontFamily:"'DM Sans', sans-serif", fontWeight:700}}>{row.a}</td>
                              <td style={{padding:"6px 8px", color:C.amber, fontFamily:"'DM Sans', sans-serif", fontWeight:700}}>{row.b}</td>
                              <td style={{padding:"6px 8px", color:diff>0?C.amber:diff<0?C.green:C.grey, fontFamily:"'DM Sans', sans-serif"}}>
                                {diff>=0?"+":""}{diff}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    <div style={{marginTop:8, fontSize:10, color:C.grey}}>
                      Bay A advantage: higher protein:fat ratio → pet food monoprotein eligibility · Bay B advantage: higher yield volume + fat content → aquafeed energy density
                    </div>
                  </div>

                  <div style={S.card}>
                    <SectionHdr icon="" title="KEY NUTRIENT TRAJECTORY S0→S4" color={C.teal}/>
                    <table style={{width:"100%", borderCollapse:"collapse", fontSize:11}}>
                      <thead>
                        <tr style={{background:C.inputSectionBg}}>
                          {["Nutrient","S0","→S2","→S3","→S4","Change"].map((h,i)=>(
                            <td key={i} style={{padding:"5px 8px", color:i===0?C.grey:C.teal, fontWeight:700}}>{h}</td>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          {n:"N (%DM)",    s0:"0.95", s2:"1.10", s3:"1.35", s4:"1.60", note:"↑↑ continuous enrichment"},
                          {n:"P (%DM)",    s0:"0.14", s2:"0.16", s3:"0.20", s4:"0.24", note:"↑ concentration"},
                          {n:"K (%DM)",    s0:"0.83", s2:"6.40", s3:"6.80", s4:"6.90", note:"↑ PKSA spike then stable"},
                          {n:"OM (%DM)",   s0:"82",   s2:"78",   s3:"72",   s4:"60",   note:"↓ BSF consume C"},
                          {n:"C:N",        s0:"32",   s2:"28",   s3:"20",   s4:"16",   note:"↓ narrows towards ideal"},
                          {n:"Lignin (%)", s0:"25",   s2:`${(25*(1-pksa_ligninRed/100)).toFixed(0)}`, s3:"15", s4:"8", note:"↓ PKSA+BSF gut degradation"},
                          {n:"pH",         s0:"5.5",  s2:"7.0",  s3:"6.8",  s4:"6.5",  note:"S2↑ neutralise, then ↓"},
                        ].map((row,i)=>(
                          <tr key={i} style={{borderBottom:`1px solid ${C.inputSectionBg}`, background:i%2===0?C.navyLt+"30":"transparent"}}>
                            <td style={{padding:"5px 8px", color:C.grey, fontWeight:600}}>{row.n}</td>
                            {[row.s0,row.s2,row.s3,row.s4].map((v,j)=>{
                              const prev = [row.s0,row.s2,row.s3,row.s4][j-1];
                              const up = j>0 && parseFloat(v)>parseFloat(prev);
                              const dn = j>0 && parseFloat(v)<parseFloat(prev);
                              return (
                                <td key={j} style={{padding:"5px 8px", textAlign:"center", fontFamily:"'DM Sans', sans-serif",
                                  color:j===0?C.white:up?C.green:dn?C.red:C.grey}}>
                                  {v}{j>0&&up?"↑":j>0&&dn?"↓":""}
                                </td>
                              );
                            })}
                            <td style={{padding:"5px 8px", color:C.grey, fontSize:10}}>{row.note}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
            <NutrLedger stg={`S4 · BSF Frass at Day ${gd} (C:N collapsing · N consumed by larvae)`} N={nl_s4N} P={nl_s4P} K={nl_s4K} Ca={nl_s4Ca} Mg={nl_Mg} OM={nl_s4OM} cn={nl_s4CN} wetPD={nl_s4wet} mc={s4_frassMC} nAdj={soilObj.nAdj} pAdj={soilObj.pAdj} ag={agObj.uplift} col={C.teal}/>

          </div>
        )}

        {/* ════════════════════ S T A G E  5 ════════════════════ */}
        {stage===5 && (
          <div>
            {/* KPI Row */}
            <div style={{display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:10, marginBottom:16}}>
              <KPI label="Pathway" value={s4.pathwayS5==="s5a"?"S5A":"S5B"} unit={s4.pathwayS5==="s5a"?"Extract Larvae":"Terminate In-Sub"} color={s4.pathwayS5==="s5a"?C.green:C.amber}/>
              <KPI label="Frass Volume" value={(s4.pathwayS5==="s5a"?s5a_FW:s5b_FW).toLocaleString()} unit="t FW/month"/>
              <KPI label="Frass DM" value={(s4.pathwayS5==="s5a"?s5a_DM:s5b_DM).toLocaleString()} unit="t DM/month" color={C.teal}/>
              <KPI label="Floor (Urea/TSP/MOP)" value={`$${s4.pathwayS5==="s5a"?s5a_NPKval:s5b_NPKval}/t FW`} unit="commodity replacement" color={C.green}/>
              <KPI label="Estate Price (SM)" value={`$${s4.pathwayS5==="s5a"?s5a_NPKval_SM:s5b_NPKval_SM}/t FW`} unit="Sinar Mas actual cost" color={C.teal}/>
            </div>

            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:16}}>

              {/* Frass Lab Analysis */}
              <div style={S.card}>
                <SectionHdr icon="" title={`${s4.pathwayS5==="s5a"?"S5A":"S5B"} — FRASS LAB ANALYSIS`} color={C.green}/>
                {[
                  {l:"Total N",           v: s4.pathwayS5==="s5a" ? `${s5a_N_DM}%` : `${s5b_N_DM}%`,  unit:"DM", color:C.green},
                  {l:"Total P (P₂O₅)",    v: s4.pathwayS5==="s5a" ? `${(s5a_P_DM*2.29).toFixed(2)}%` : `${(s5b_P_DM*2.29).toFixed(2)}%`, unit:"DM", color:C.green},
                  {l:"Total K (K₂O)",     v: s4.pathwayS5==="s5a" ? `${(s5a_K_DM*1.20).toFixed(2)}%` : `${(s5b_K_DM*1.20).toFixed(2)}%`, unit:"DM", color:C.green},
                  {l:"Calcium (Ca)",      v: s4.pathwayS5==="s5a" ? `${s5a_Ca_DM}%` : `${s5b_Ca_DM}%`, unit:"DM", color:C.teal},
                  {l:"Magnesium (Mg)",    v: s4.pathwayS5==="s5a" ? `${s5a_Mg_DM}%` : `${s5b_Mg_DM}%`, unit:"DM", color:C.teal},
                  {l:"Organic Matter",    v: s4.pathwayS5==="s5a" ? `${s5a_OM_DM}%` : `${s5b_OM_DM}%`, unit:"DM", color:C.amber},
                  {l:"C:N Ratio",         v: s4.pathwayS5==="s5a" ? `${s5a_CN}:1` : `${s5b_CN}:1`, unit:"", color:C.amber},
                  {l:"pH",                v: s4.pathwayS5==="s5a" ? `${s5a_pH}` : `${s5b_pH}`, unit:"", color:C.teal},
                  {l:"Moisture (typical)",v:"55–65%", unit:"wb", color:C.blue},
                ].map((r,i)=>(
                  <div key={i} style={{display:"flex", justifyContent:"space-between", padding:"7px 10px",
                    background:i%2===0?C.navyLt:"transparent", borderRadius:4}}>
                    <span style={{color:C.grey, fontSize:11}}>{r.l}</span>
                    <span style={{color:r.color, fontWeight:700, fontSize:12}}>{r.v} <span style={{color:C.grey, fontWeight:400}}>{r.unit}</span></span>
                  </div>
                ))}

                {/* S5A vs S5B side-by-side comparison */}
                <hr style={S.divider}/>
                <div style={{color:C.grey, fontSize:10, fontWeight:700, letterSpacing:"0.05em", marginBottom:6}}>S5A vs S5B PATHWAY COMPARISON</div>
                <table style={{width:"100%", borderCollapse:"collapse", fontSize:11}}>
                  <thead>
                    <tr style={{background:C.inputSectionBg}}>
                      {["Parameter","S5A (Extract)","S5B (Terminate)","Δ Difference"].map((h,i)=>(
                        <td key={i} style={{padding:"5px 8px", color:i===1?C.green:i===2?C.amber:C.grey, fontWeight:700}}>{h}</td>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {p:"N % DM",    a:s5a_N_DM,           b:s5b_N_DM,           fmt:v=>v+"%"},
                      {p:"K % DM",    a:s5a_K_DM,           b:s5b_K_DM,           fmt:v=>v+"%"},
                      {p:"Protein %", a:(s5a_N_DM*6.25).toFixed(1), b:(s5b_N_DM*6.25).toFixed(1), fmt:v=>v+"%"},
                      {p:"C:N",       a:s5a_CN,             b:s5b_CN,             fmt:v=>v+":1"},
                      {p:"$/t FW (Urea floor)",a:s5a_NPKval, b:s5b_NPKval,        fmt:v=>"$"+v},
                      {p:"$/t FW (Estate)",    a:s5a_NPKval_SM, b:s5b_NPKval_SM,  fmt:v=>"$"+v},
                    ].map((r,i)=>{
                      const aNum = parseFloat(r.a), bNum = parseFloat(r.b);
                      const diff = +(bNum - aNum).toFixed(2);
                      const diffCol = diff > 0 ? C.green : diff < 0 ? C.red : C.grey;
                      return (
                        <tr key={i} style={{borderBottom:`1px solid ${C.inputSectionBg}`, background:i%2===0?C.navyLt+"30":"transparent"}}>
                          <td style={{padding:"5px 8px", color:C.grey}}>{r.p}</td>
                          <td style={{padding:"5px 8px", color:C.green, fontFamily:"'DM Sans', sans-serif", fontWeight:700}}>{r.fmt(r.a)}</td>
                          <td style={{padding:"5px 8px", color:C.amber, fontFamily:"'DM Sans', sans-serif", fontWeight:700}}>{r.fmt(r.b)}</td>
                          <td style={{padding:"5px 8px", color:diffCol, fontFamily:"'DM Sans', sans-serif"}}>{diff>=0?"+":""}{diff}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* RIGHT COLUMN — NPK + S6 products stacked */}
              <div style={{display:"flex", flexDirection:"column", gap:16}}>
              {/* NPK Replacement + All-Soils Table */}
              <div style={S.card}>
                <SectionHdr icon="" title="NPK REPLACEMENT VALUE — ALL SOIL TYPES" color={C.amber}/>

                {/* Certification tier selector for frass */}
                <div style={{marginBottom:10}}>
                  <div style={{color:C.grey, fontSize:10, fontWeight:700, marginBottom:6}}>FRASS CERTIFICATION TIER</div>
                  <div style={{display:"flex", gap:6}}>
                    {[{k:"standard",l:"Standard",col:C.grey},{k:"organic",l:"Organic Cert.",col:C.green}].map(t=>(
                      <div key={t.k}
                        style={{background:s4.frassCert===t.k?t.col+"33":C.inputSectionBg, border:`1px solid ${s4.frassCert===t.k?t.col:C.greyLt+"33"}`,
                          borderRadius:6, padding:"6px 14px", cursor:"pointer", fontSize:11, fontWeight:700, color:s4.frassCert===t.k?t.col:C.grey}}
                        onClick={()=>upS4("frassCert",t.k)}>
                        {t.l}
                        {t.k==="organic" && <span style={{color:C.green, fontSize:9, display:"block"}}>+20–40% price uplift</span>}
                      </div>
                    ))}
                  </div>
                </div>

                <hr style={S.divider}/>

                {/* All 5 soils NPK table */}
                <div style={{color:C.grey, fontSize:10, fontWeight:700, marginBottom:6}}>NPK REPLACEMENT VALUE BY SOIL TYPE</div>
                <table style={{width:"100%", borderCollapse:"collapse", fontSize:11}}>
                  <thead>
                    <tr style={{background:C.inputSectionBg}}>
                      {["Soil Type","Coverage","pH","Urea/TSP/MOP Floor","Sinar Mas Estate"].map((h,i)=>(
                        <td key={i} style={{padding:"6px 8px", color:C.grey, fontWeight:700}}>{h}</td>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {allSoilsNPK.map((row,i)=>{
                      const isActive = row.id === s0.soil;
                      return (
                        <tr key={i} style={{borderBottom:`1px solid ${C.inputSectionBg}`,
                          background:isActive?C.teal+"22":i%2===0?C.navyLt+"30":"transparent",
                          border:isActive?`1.5px solid ${C.sectionBorder}`:undefined}}>
                          <td style={{padding:"6px 8px", color:isActive?C.teal:C.white, fontWeight:isActive?900:400}}>
                            {row.name} {isActive&&"← active"}
                          </td>
                          <td style={{padding:"6px 8px", color:C.grey, fontFamily:"'DM Sans', sans-serif"}}>{row.pct}</td>
                          <td style={{padding:"6px 8px", color:C.grey, fontFamily:"'DM Sans', sans-serif"}}>{row.ph}</td>
                          <td style={{padding:"6px 8px", color:C.green, fontFamily:"'DM Sans', sans-serif", fontWeight:700}}>${row.urea}/t FW</td>
                          <td style={{padding:"6px 8px", color:C.teal, fontFamily:"'DM Sans', sans-serif", fontWeight:700}}>${row.sm}/t FW</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {/* DMPP N₂O SUPPRESSION — SOIL-SPECIFIC PANEL */}
                <div style={{background:"#12201a",border:"1px solid #2a5030",borderRadius:8,padding:"12px",marginTop:10,marginBottom:10}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                    <div>
                      <div style={{fontSize:11,fontWeight:800,color:"#8de8b4",letterSpacing:"0.04em"}}> DMPP N₂O SUPPRESSION — CARBON CREDIT UPLIFT BY SOIL TYPE</div>
                      <div style={{fontSize:9,color:"#7aa890",marginTop:2}}>IPCC 2006 Vol.4 Ch.11 · EF = 1% N applied → N₂O · GWP₁₀₀ N₂O = 265 · Active soil: {soilObj.name} ({Math.round(dmpp_efficacy*100)}% DMPP efficacy)</div>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <span style={{fontSize:9,color:"#8de8b4",fontWeight:700}}>DMPP</span>
                      <button onClick={()=>upS0("dmppEnabled",!s0.dmppEnabled)} style={{
                        background:s0.dmppEnabled?"#1a7a40":"#1a3360",border:s0.dmppEnabled?"1px solid #3dcb7a":"1px solid #2a4070",
                        borderRadius:20,padding:"3px 12px",color:s0.dmppEnabled?"#3dcb7a":"#8898b0",
                        fontSize:10,fontWeight:800,cursor:"pointer"
                      }}>{s0.dmppEnabled?"ON ✓":"OFF"}</button>
                    </div>
                  </div>

                  {/* Soil-by-soil DMPP table */}
                  <table style={{width:"100%",borderCollapse:"collapse",fontSize:10,marginBottom:10}}>
                    <thead>
                      <tr style={{background:"#0a1f14"}}>
                        {["Soil Type","Coverage","DMPP Efficacy","N₂O Baseline (t CO₂e/yr)","N₂O Avoided (t CO₂e/yr)","Credit $/yr","Soil-Specific Note"].map((h,i)=>(
                          <th key={i} style={{padding:"5px 6px",color:"#8de8b4",fontWeight:700,textAlign:"left",fontSize:8,textTransform:"uppercase"}}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {SOILS.map((soil,i)=>{
                        const eff = soil.dmppEfficacy||0.35;
                        const baseline = +(dmpp_n2o_base_kgday * DMPP_GWP_N2O * 365 / 1000).toFixed(1);
                        const avoided  = +(dmpp_n2o_base_kgday * eff * DMPP_GWP_N2O * 365 / 1000).toFixed(1);
                        const rev      = +(avoided * carbonPriceActive).toFixed(0);
                        const isActive = soil.id===s0.soil;
                        return (
                          <tr key={i} style={{borderBottom:"1px solid #1a3025",background:isActive?"#1a3a22":"transparent"}}>
                            <td style={{padding:"5px 6px",color:isActive?"#3dcb7a":C.white,fontWeight:isActive?800:400}}>{soil.name}{isActive?" ←":""}</td>
                            <td style={{padding:"5px 6px",color:"#7aa890",fontFamily:"'DM Sans', sans-serif"}}>{soil.pct}</td>
                            <td style={{padding:"5px 6px",fontFamily:"'DM Sans', sans-serif",fontWeight:800,
                              color:eff>=0.40?"#3dcb7a":eff>=0.30?"#f0a030":"#8898b0"}}>
                              {Math.round(eff*100)}%
                              {eff>=0.40&&<span style={{fontSize:8,marginLeft:4,color:"#3dcb7a"}}>▲ HIGH</span>}
                              {eff<0.25&&<span style={{fontSize:8,marginLeft:4,color:"#8898b0"}}>▼ LOW</span>}
                            </td>
                            <td style={{padding:"5px 6px",fontFamily:"'DM Sans', sans-serif",color:"#f0a030"}}>{baseline.toLocaleString()}</td>
                            <td style={{padding:"5px 6px",fontFamily:"'DM Sans', sans-serif",color:"#3dcb7a",fontWeight:700}}>{avoided.toLocaleString()}</td>
                            <td style={{padding:"5px 6px",fontFamily:"'DM Sans', sans-serif",color:"#f0a030",fontWeight:800}}>${rev.toLocaleString()}</td>
                            <td style={{padding:"5px 6px",color:"#7aa890",fontSize:8}}>{soil.dmppNote||"—"}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {/* Active soil DMPP summary box */}
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8}}>
                    <div style={{background:"#0e2818",borderRadius:6,padding:"8px 10px",border:"1px solid #2a5030"}}>
                      <div style={{fontSize:8,color:"#7aa890",fontWeight:700,marginBottom:3,textTransform:"uppercase"}}>Frass N/Day Applied</div>
                      <div style={{fontSize:16,fontWeight:900,color:"#8de8b4",fontFamily:"'DM Sans', sans-serif"}}>{dmpp_N_kgday.toLocaleString()} kg N</div>
                      <div style={{fontSize:8,color:"#5a8870"}}>N×4.67 true protein factor active</div>
                    </div>
                    <div style={{background:"#0e2818",borderRadius:6,padding:"8px 10px",border:"1px solid #2a5030"}}>
                      <div style={{fontSize:8,color:"#7aa890",fontWeight:700,marginBottom:3,textTransform:"uppercase"}}>Uncontrolled N₂O (baseline)</div>
                      <div style={{fontSize:16,fontWeight:900,color:"#f0a030",fontFamily:"'DM Sans', sans-serif"}}>{dmpp_co2e_base_ann.toLocaleString()} t CO₂e/yr</div>
                      <div style={{fontSize:8,color:"#5a8870"}}>Currently uncaptured / unmonetised</div>
                    </div>
                    <div style={{background:s0.dmppEnabled?"#102818":"#0e1a18",borderRadius:6,padding:"8px 10px",border:s0.dmppEnabled?"1px solid #3dcb7a44":"1px solid #1a2820"}}>
                      <div style={{fontSize:8,color:"#7aa890",fontWeight:700,marginBottom:3,textTransform:"uppercase"}}>DMPP Avoided ({soilObj.name})</div>
                      <div style={{fontSize:16,fontWeight:900,color:s0.dmppEnabled?"#3dcb7a":"#445050",fontFamily:"'DM Sans', sans-serif"}}>{dmpp_co2e_avoid_ann.toLocaleString()} t CO₂e/yr</div>
                      <div style={{fontSize:8,color:"#5a8870"}}>{Math.round(dmpp_efficacy*100)}% suppression · {soilObj.dmppNote&&soilObj.dmppNote.substring(0,40)}...</div>
                    </div>
                    <div style={{background:s0.dmppEnabled?"#1a3520":"#0e1a18",borderRadius:6,padding:"8px 10px",border:s0.dmppEnabled?"1px solid #3dcb7a":"1px solid #1a2820"}}>
                      <div style={{fontSize:8,color:"#7aa890",fontWeight:700,marginBottom:3,textTransform:"uppercase"}}>ROI · Net Annual Gain</div>
                      <div style={{fontSize:16,fontWeight:900,color:s0.dmppEnabled&&dmpp_roi>=3?"#3dcb7a":s0.dmppEnabled&&dmpp_roi>=2?"#f0a030":"#445050",fontFamily:"'DM Sans', sans-serif"}}>{s0.dmppEnabled?dmpp_roi+"x":"—"}</div>
                      <div style={{fontSize:8,color:"#5a8870"}}>Net: {s0.dmppEnabled?"$"+dmpp_net_annual.toLocaleString()+"/yr":"Enable DMPP to calculate"}</div>
                    </div>
                  </div>

                  <div style={{marginTop:8,background:"#0a1810",borderRadius:5,padding:"6px 10px",border:"1px solid #1a3020"}}>
                    <span style={{color:"#f0a030",fontWeight:700,fontSize:9}}>WHY THIS MATTERS FOR ESTATE BUYERS: </span>
                    <span style={{color:"#7aa890",fontSize:9}}>Estates reporting under CSRD/SBTi must account for N₂O from fertiliser application in their Scope 3 footprint. CFI frass pre-treated with DMPP gives the estate a verifiable N₂O reduction they can report — making CFI frass a superior procurement option vs synthetic Urea. On {soilObj.name} (current soil selection), DMPP retains ~{dmpp_n_retained_pct}% additional N in ammonium form, improving effective N delivery to palms — Sinar Mas agronomists can reduce application rate while maintaining yield target.</span>
                  </div>
                </div>

                <hr style={S.divider}/>

                <div style={{background:C.inputSectionBg, borderRadius:8, padding:"12px"}}>
                  <div style={{color:C.grey, fontSize:11, marginBottom:8}}>ACTIVE SOIL: {soilObj.name} — SOIL-ADJUSTED NPK (per t FW)</div>
                  {[
                    {name:"N", eff:s4.pathwayS5==="s5a"?s5a_Neff:s5b_Neff, price:NPK_N_price, unit:"kg N"},
                    {name:"P", eff:s4.pathwayS5==="s5a"?s5a_Peff:s5b_Peff, price:NPK_P_price, unit:"kg P₂O₅"},
                    {name:"K", eff:s4.pathwayS5==="s5a"?s5a_Keff:s5b_Keff, price:NPK_K_price, unit:"kg K₂O"},
                  ].map((r,i)=>(
                    <div key={i} style={{display:"flex", justifyContent:"space-between", padding:"6px 8px",
                      background:C.pageBg, borderRadius:4, marginBottom:4}}>
                      <span style={{color:C.grey, fontSize:11}}>{r.name} effective: {(r.eff*1000).toFixed(1)} {r.unit}/t FW</span>
                      <span style={{color:C.green, fontWeight:700, fontSize:12}}>${(r.eff*1000*r.price).toFixed(2)}/t FW</span>
                    </div>
                  ))}
                  <div style={{display:"flex", justifyContent:"space-between", padding:"8px",
                    background:C.green+"18", borderRadius:4, borderTop:`2px solid ${C.green}44`, marginTop:4}}>
                    <span style={{color:C.grey, fontSize:11}}>Commodity floor (Urea/TSP/MOP)</span>
                    <span style={{color:C.green, fontWeight:700}}>${s4.pathwayS5==="s5a"?s5a_NPKval:s5b_NPKval}/t FW</span>
                  </div>
                  <div style={{display:"flex", justifyContent:"space-between", padding:"10px 8px",
                    background:C.teal+"28", borderRadius:4, borderTop:`2px solid ${C.teal}`, marginTop:4}}>
                    <span style={{color:C.teal, fontWeight:700}}>✓ ESTATE SALES PRICE (Sinar Mas)</span>
                    <span style={{color:C.teal, fontWeight:900, fontSize:16}}>${s4.pathwayS5==="s5a"?s5a_NPKval_SM:s5b_NPKval_SM}/t FW</span>
                  </div>
                </div>

                <hr style={S.divider}/>
                <div>
                  <Lbl t="Market Price Override" unit="$/t FW (leave blank to use agronomic floor)"/>
                  <input style={S.inputAmb}
                    value={s4.pathwayS5==="s5a"?s4.frass5aPriceEntry:s4.frass5bPriceEntry}
                    onChange={e=>upS4(s4.pathwayS5==="s5a"?"frass5aPriceEntry":"frass5bPriceEntry",e.target.value)}
                    placeholder={`Agronomic floor: $${s4.pathwayS5==="s5a"?s5a_NPKval:s5b_NPKval}/t FW`}/>
                </div>
                <hr style={S.divider}/>
                <CalcField label="Monthly Frass Revenue (floor)" unit="USD/month"
                  value={`$${(s4.pathwayS5==="s5a"?rev_frass5a:rev_frass5b).toLocaleString()}`}/>
              </div>
              {/* ── S6 DOWNSTREAM PRODUCTS PREVIEW (S5A only) ── */}
            {s4.pathwayS5==="s5a" && (
              <div style={{...S.card, border:`1.5px solid ${C.sectionBorder}`, marginTop:0}}>
                <SectionHdr icon="" title="S6 DOWNSTREAM PRODUCTS — LARVAE PROCESSING PREVIEW" color={C.teal}/>
                <div style={{color:C.grey, fontSize:11, marginBottom:12}}>
                  Larvae extracted in S5A flow directly to S6 for drying, oil pressing, and chitin extraction.
                  Volumes and revenues below are based on current S4 rearing outputs.
                </div>
                <div style={{display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:14}}>
                  {/* BSF Insect Meal */}
                  <div style={{background:C.inputSectionBg, borderRadius:8, padding:"14px", border:`1px solid ${C.teal}33`}}>
                    <div style={{color:C.teal, fontWeight:800, fontSize:13, marginBottom:6}}>🦟 BSF Insect Meal</div>
                    <div style={{color:C.grey, fontSize:10, marginBottom:8}}>Defatted, dried — high-protein ingredient</div>
                    <div style={{display:"flex", justifyContent:"space-between", marginBottom:4}}>
                      <span style={{color:C.grey, fontSize:11}}>Volume</span>
                      <span style={{color:C.white, fontWeight:700, fontSize:12}}>{s6_mealYield.toLocaleString()} kg/month</span>
                    </div>
                    <div style={{display:"flex", justifyContent:"space-between", marginBottom:4}}>
                      <span style={{color:C.grey, fontSize:11}}>Crude Protein</span>
                      <span style={{color:C.teal, fontWeight:700, fontSize:12}}>~50–58% DM</span>
                    </div>
                    <div style={{display:"flex", justifyContent:"space-between", marginBottom:4}}>
                      <span style={{color:C.grey, fontSize:11}}>Commodity floor</span>
                      <span style={{color:C.green, fontWeight:700, fontSize:12}}>${mealFloor.toLocaleString()}/t</span>
                    </div>
                    <div style={{display:"flex", justifyContent:"space-between", marginBottom:4}}>
                      <span style={{color:C.grey, fontSize:11}}>Pet food grade</span>
                      <span style={{color:C.tealLt, fontWeight:700, fontSize:12}}>${mealPremium.toLocaleString()}/t</span>
                    </div>
                    <div style={{background:C.green+"18", borderRadius:5, padding:"8px", marginTop:8, borderTop:`1px solid ${C.green}33`}}>
                      <div style={{color:C.grey, fontSize:10}}>Monthly Revenue (active price)</div>
                      <div style={{color:C.green, fontWeight:900, fontSize:16}}>${rev_meal.toLocaleString()}</div>
                    </div>
                  </div>
                  {/* BSF Oil */}
                  <div style={{background:C.inputSectionBg, borderRadius:8, padding:"14px", border:`1px solid ${C.amber}33`}}>
                    <div style={{color:C.amber, fontWeight:800, fontSize:13, marginBottom:6}}>🛢 BSF Insect Oil</div>
                    <div style={{color:C.grey, fontSize:10, marginBottom:8}}>Lauric-rich lipid — feed / food / cosmetics</div>
                    <div style={{display:"flex", justifyContent:"space-between", marginBottom:4}}>
                      <span style={{color:C.grey, fontSize:11}}>Volume</span>
                      <span style={{color:C.white, fontWeight:700, fontSize:12}}>{s6_oilYield.toLocaleString()} kg/month</span>
                    </div>
                    <div style={{display:"flex", justifyContent:"space-between", marginBottom:4}}>
                      <span style={{color:C.grey, fontSize:11}}>Lauric acid content</span>
                      <span style={{color:C.amber, fontWeight:700, fontSize:12}}>~40–52% DM</span>
                    </div>
                    <div style={{display:"flex", justifyContent:"space-between", marginBottom:4}}>
                      <span style={{color:C.grey, fontSize:11}}>Feed grade floor</span>
                      <span style={{color:C.green, fontWeight:700, fontSize:12}}>${oilFloor.toLocaleString()}/t</span>
                    </div>
                    <div style={{display:"flex", justifyContent:"space-between", marginBottom:4}}>
                      <span style={{color:C.grey, fontSize:11}}>Cosmetics grade</span>
                      <span style={{color:C.amberLt, fontWeight:700, fontSize:12}}>$5,000–9,000/t</span>
                    </div>
                    <div style={{background:C.amber+"18", borderRadius:5, padding:"8px", marginTop:8, borderTop:`1px solid ${C.amber}33`}}>
                      <div style={{color:C.grey, fontSize:10}}>Monthly Revenue (active price)</div>
                      <div style={{color:C.amber, fontWeight:900, fontSize:16}}>${rev_oil.toLocaleString()}</div>
                    </div>
                  </div>
                  {/* Chitin */}
                  <div style={{background:C.inputSectionBg, borderRadius:8, padding:"14px", border:`1px solid ${C.green}33`}}>
                    <div style={{color:C.green, fontWeight:800, fontSize:13, marginBottom:6}}>🦐 BSF Chitin</div>
                    <div style={{color:C.grey, fontSize:10, marginBottom:8}}>Extracted from cuticle — agricultural / pharma</div>
                    <div style={{display:"flex", justifyContent:"space-between", marginBottom:4}}>
                      <span style={{color:C.grey, fontSize:11}}>Volume</span>
                      <span style={{color:C.white, fontWeight:700, fontSize:12}}>{s6_chitinYield.toLocaleString()} kg/month</span>
                    </div>
                    <div style={{display:"flex", justifyContent:"space-between", marginBottom:4}}>
                      <span style={{color:C.grey, fontSize:11}}>Purity (ag grade)</span>
                      <span style={{color:C.green, fontWeight:700, fontSize:12}}>~75–85% DM</span>
                    </div>
                    <div style={{display:"flex", justifyContent:"space-between", marginBottom:4}}>
                      <span style={{color:C.grey, fontSize:11}}>Ag grade floor</span>
                      <span style={{color:C.green, fontWeight:700, fontSize:12}}>${chitinFloor.toLocaleString()}/t</span>
                    </div>
                    <div style={{display:"flex", justifyContent:"space-between", marginBottom:4}}>
                      <span style={{color:C.grey, fontSize:11}}>Pharma / cosmetics</span>
                      <span style={{color:C.tealLt, fontWeight:700, fontSize:12}}>$25,000–60,000/t</span>
                    </div>
                    <div style={{background:C.green+"18", borderRadius:5, padding:"8px", marginTop:8, borderTop:`1px solid ${C.green}33`}}>
                      <div style={{color:C.grey, fontSize:10}}>Monthly Revenue (active price)</div>
                      <div style={{color:C.green, fontWeight:900, fontSize:16}}>${rev_chitin.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
                {/* Combined S5A total revenue banner */}
                <div style={{background:`linear-gradient(90deg, ${C.teal}22, ${C.green}22)`,
                             border:`1px solid ${C.teal}55`, borderRadius:8, padding:"14px 18px",
                             display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                  <div>
                    <div style={{color:C.grey, fontSize:11, marginBottom:2}}>S5A TOTAL MONTHLY REVENUE — all products</div>
                    <div style={{color:C.grey, fontSize:10}}>
                      Frass ${rev_frass5a.toLocaleString()} + Meal ${rev_meal.toLocaleString()} + Oil ${rev_oil.toLocaleString()} + Chitin ${rev_chitin.toLocaleString()}
                    </div>
                  </div>
                  <div style={{color:C.teal, fontWeight:900, fontSize:26}}>${(rev_frass5a + rev_meal + rev_oil + rev_chitin).toLocaleString()}</div>
                </div>
                <div style={{background:C.amber+"14", border:`1px solid ${C.amber}44`, borderRadius:6,
                             padding:"9px 12px", marginTop:10, fontSize:11, color:C.amber}}>
                  🔑 <strong>Certification uplift:</strong> FSSC 22000 (pet food) takes meal to ~$3,500/t. ISO 22716 (cosmetics) takes oil to $5,000–9,000/t. Switch cert tier on S6.
                </div>
              </div>
            )}
            {/* S5B — no larvae */}
            {s4.pathwayS5==="s5b" && (
              <div style={{...S.card, border:`1px solid ${C.amber}44`, marginTop:0}}>
                <SectionHdr icon="" title="S5B — TERMINATE IN-SUBSTRATE: NO INSECT PRODUCTS" color={C.amber}/>
                <div style={{color:C.grey, fontSize:12, lineHeight:1.6}}>
                  Larvae are terminated inside the substrate. No separate insect meal, oil, or chitin products.
                  All biomass composted as a single high-nutrient biofertiliser. Maximises NPK but eliminates S6 insect processing revenue.
                </div>
                <div style={{display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginTop:12}}>
                  {[
                    {icon:"🦟", label:"BSF Insect Meal", value:"Not produced", col:C.red},
                    {icon:"🛢", label:"BSF Insect Oil",  value:"Not produced", col:C.red},
                    {icon:"🦐", label:"BSF Chitin",      value:"Not produced", col:C.red},
                  ].map((p,i)=>(
                    <div key={i} style={{background:C.inputSectionBg, borderRadius:8, padding:"12px",
                                        border:`1px solid ${C.red}33`, textAlign:"center"}}>
                      <div style={{fontSize:20, marginBottom:6}}>{p.icon}</div>
                      <div style={{color:C.grey, fontSize:11, marginBottom:4}}>{p.label}</div>
                      <div style={{color:C.red, fontWeight:700, fontSize:12}}>{p.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
              </div> {/* closes right-column flex wrapper */}
            </div> {/* closes 2-col grid */}
            <NutrLedger stg={s4.pathwayS5==="s5a"?"S5A · Biofertiliser (Post-Extraction Frass)":"S5B · Biofertiliser (Terminate-in-Substrate)"} N={s4.pathwayS5==="s5a"?s5a_N_DM:s5b_N_DM} P={s4.pathwayS5==="s5a"?s5a_P_DM:s5b_P_DM} K={s4.pathwayS5==="s5a"?s5a_K_DM:s5b_K_DM} Ca={s4.pathwayS5==="s5a"?s5a_Ca_DM:s5b_Ca_DM} Mg={s4.pathwayS5==="s5a"?s5a_Mg_DM:s5b_Mg_DM} OM={s4.pathwayS5==="s5a"?s5a_OM_DM:s5b_OM_DM} cn={s4.pathwayS5==="s5a"?s5a_CN:s5b_CN} wetPD={s4.pathwayS5==="s5a"?nl_s5aPD:nl_s5bPD} mc={s4_frassMC} nAdj={soilObj.nAdj} pAdj={soilObj.pAdj} ag={agObj.uplift} col={C.green}/>
          <div style={{textAlign:'right',padding:'12px 0'}}><button onClick={()=>setShowValCalc(v=>!v)} style={{background:'rgba(64,215,197,0.10)',border:'1.5px solid rgba(64,215,197,0.40)',borderRadius:6,color:'#40D7C5',fontFamily:"'DM Mono',monospace",fontSize:11,fontWeight:700,padding:'6px 14px',cursor:'pointer'}}>{showValCalc?'Hide Value Calculator ▴':'Value Calculator ▾'}</button></div>
          {showValCalc && <CFI_ValueCalculator defaultStage="s5a"/>}
          </div>
        )}


        {/* ════════════════════ S T A G E  6 ════════════════════ */}
        {stage===6 && (
          <div>
            {/* KPI Row */}
            <div style={{display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:10, marginBottom:16}}>
              <KPI label="Larvae IN" value={s4_larvaeFW.toLocaleString()} unit="t FW/month"/>
              <KPI label="Insect Meal" value={s6_mealYield.toLocaleString()} unit="kg/month" color={C.teal}/>
              <KPI label="BSF Oil" value={s6_oilYield.toLocaleString()} unit="kg/month" color={C.amber}/>
              <KPI label="Chitin" value={`${s6_chitinYield} kg`} unit="kg/month" color={C.green}/>
              <KPI label="Cert Revenue" value={`$${certTotalRev.toLocaleString()}`} unit="/month (with cert)" color={activeCert.badge==="Standard"?C.grey:C.green}/>
            </div>

            {/* CERTIFICATION TIER SELECTOR */}
            <div style={{...S.card, marginBottom:16}}>
              <SectionHdr icon="🏆" title="PRODUCT CERTIFICATION TIER — PRICE LADDER" color={C.amber}/>
              <div style={{display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:12}}>
                {[
                  {k:"none",    label:"No Certification",        mealPx:"$1,200/t",  oilPx:"$900/t",     uplift:"1×",  col:C.grey},
                  {k:"feed",    label:"Feed Grade (QS 9000)",     mealPx:"$1,800/t",  oilPx:"$1,170/t",   uplift:"1.5×",col:C.teal},
                  {k:"petfood", label:"FSSC 22000 (Pet Food EU)", mealPx:"$3,500/t",  oilPx:"$1,800/t",   uplift:"2.9×",col:C.green},
                  {k:"pharma",  label:"ISO 22716 (Pharma/Cosm)", mealPx:"$6,500/t",  oilPx:"$12,000/t",  uplift:"5.4×",col:C.amber},
                ].map(tier=>(
                  <div key={tier.k}
                    style={{background:s4.certLevel===tier.k?tier.col+"33":C.inputSectionBg,
                      border:`2px solid ${s4.certLevel===tier.k?tier.col:C.navyLt+"88"}`,
                      borderRadius:8, padding:"12px", cursor:"pointer"}}
                    onClick={()=>upS4("certLevel",tier.k)}>
                    <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6}}>
                      <div style={{color:s4.certLevel===tier.k?tier.col:C.white, fontWeight:700, fontSize:12}}>{tier.label}</div>
                      <div style={S.badge(s4.certLevel===tier.k?tier.col:C.grey)}>{tier.uplift}</div>
                    </div>
                    <div style={{color:C.grey, fontSize:10}}>Meal: <span style={{color:tier.col, fontWeight:700}}>{tier.mealPx}</span></div>
                    <div style={{color:C.grey, fontSize:10}}>Oil:  <span style={{color:tier.col, fontWeight:700}}>{tier.oilPx}</span></div>
                    {tier.k==="pharma" && <div style={{color:C.amber, fontSize:9, marginTop:4}}> FSSC 22000 prerequisite required</div>}
                  </div>
                ))}
              </div>
              {s4.certLevel !== "none" && (
                <div style={{background:C.green+"18", border:`1px solid ${C.green}33`, borderRadius:8, padding:"10px 14px",
                  display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                  <div>
                    <div style={{color:C.green, fontWeight:700, fontSize:13}}>CERTIFICATION REVENUE UPLIFT ACTIVE: {activeCert.badge}</div>
                    <div style={{color:C.grey, fontSize:11}}>Meal ×{activeCert.mealMult} · Oil ×{activeCert.oilMult} vs no-cert baseline</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{color:C.grey, fontSize:10}}>Monthly with cert</div>
                    <div style={{color:C.green, fontWeight:900, fontSize:20}}>${certTotalRev.toLocaleString()}</div>
                    <div style={{color:C.green, fontSize:11}}>+${(certTotalRev-rev_total).toLocaleString()}/month vs no-cert</div>
                  </div>
                </div>
              )}
            </div>

            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:16}}>

              {/* Insect Meal */}
              <div style={S.card}>
                <SectionHdr icon="🥩" title="INSECT MEAL — LAB PROFILE"/>
                <div style={{background:C.teal+"18", border:`1.5px solid ${C.sectionBorder}`, borderRadius:8,
                  padding:"10px 14px", marginBottom:10, textAlign:"center"}}>
                  <div style={{color:C.grey, fontSize:10}}>MONTHLY YIELD</div>
                  <div style={{color:C.teal, fontSize:24, fontWeight:900}}>{s6_mealYield.toLocaleString()} kg</div>
                  <div style={{color:C.grey, fontSize:10}}>{(s6_mealYield/1000).toFixed(2)} t/month</div>
                </div>
                {[
                  {l:"Crude Protein (CP)", v:"50.6% DM", note:"Defatted BSFL meal", col:C.green},
                  {l:"Crude Fat (EE)",     v:"10% DM",   note:"Post screw-press",   col:C.amber},
                  {l:"Ash",               v:"16% DM",   note:"Mineral fraction",    col:C.grey},
                  {l:"Chitin",            v:"9.3% DM",  note:"Dietary fibre/prebiotic", col:C.teal},
                  {l:"Moisture",          v:"8% wb",    note:"Shelf-stable",        col:C.blue},
                  {l:"Digestibility",     v:"~85%",     note:"vs 70% fishmeal",     col:C.green},
                ].map((r,i)=>(
                  <div key={i} style={{display:"flex", justifyContent:"space-between", padding:"6px 8px",
                    background:i%2===0?C.navyLt:"transparent", borderRadius:4}}>
                    <div>
                      <div style={{color:C.white, fontSize:11}}>{r.l}</div>
                      <div style={{color:C.grey, fontSize:9}}>{r.note}</div>
                    </div>
                    <span style={{color:r.col, fontWeight:700, fontSize:12, alignSelf:"center"}}>{r.v}</span>
                  </div>
                ))}
                <hr style={S.divider}/>
                <div style={{background:C.inputSectionBg, borderRadius:6, padding:"8px 10px", marginBottom:8, fontSize:11}}>
                  <div style={{color:C.teal, fontWeight:700, marginBottom:4}}>MARKET TIERS</div>
                  {[
                    {t:"Commodity / stock feed",  p:"$900–$1,200/t"},
                    {t:"EU/US aquaculture feed",  p:"$1,500–$2,200/t"},
                    {t:"Pet food (monoprotein)",  p:"$3,500–$5,000/t"},
                    {t:"Hypoallergenic dog food", p:"$4,500–$6,500/t"},
                  ].map((r,i)=>(
                    <div key={i} style={{display:"flex", justifyContent:"space-between", marginBottom:2}}>
                      <span style={{color:C.grey}}>{r.t}</span>
                      <span style={{color:C.teal, fontWeight:700}}>{r.p}</span>
                    </div>
                  ))}
                </div>
                <AmbField label="Price Override" unit="$/t"
                  value={s4.mealPriceEntry} onChange={v=>upS4("mealPriceEntry",v)}
                  note={`Active: $${certMealPrice}/t (${activeCert.badge})`}/>
                <CalcField label="Monthly Revenue" unit="USD" value={`$${certMealRev.toLocaleString()}`}/>
              </div>

              {/* BSF Oil */}
              <div style={S.card}>
                <SectionHdr icon="🛢" title="BSF OIL — FATTY ACID PROFILE" color={C.amber}/>
                <div style={{background:C.amber+"18", border:`1px solid ${C.amber}44`, borderRadius:8,
                  padding:"10px 14px", marginBottom:10, textAlign:"center"}}>
                  <div style={{color:C.grey, fontSize:10}}>MONTHLY YIELD</div>
                  <div style={{color:C.amber, fontSize:24, fontWeight:900}}>{s6_oilYield.toLocaleString()} kg</div>
                  <div style={{color:C.grey, fontSize:10}}>{(s6_oilYield/1000).toFixed(3)} t/month</div>
                </div>
                {[
                  {l:"Lauric Acid C12:0",   v:"47%",  col:C.amber, note:"MCT precursor — cosmetics / pharma"},
                  {l:"MCT Fraction",         v:"~13%", col:C.amber, note:"C8+C10 — pharmaceutical grade target"},
                  {l:"Myristic Acid C14:0",  v:"12%",  col:C.greyLt, note:""},
                  {l:"Palmitic Acid C16:0",  v:"9%",   col:C.greyLt, note:""},
                  {l:"Oleic Acid C18:1",     v:"8%",   col:C.greyLt, note:""},
                  {l:"Moisture",             v:"<1%",  col:C.green, note:"Shelf-stable"},
                ].map((r,i)=>(
                  <div key={i} style={{display:"flex", justifyContent:"space-between", padding:"6px 8px",
                    background:i%2===0?C.navyLt:"transparent", borderRadius:4}}>
                    <div>
                      <div style={{color:C.white, fontSize:11}}>{r.l}</div>
                      {r.note && <div style={{color:C.grey, fontSize:9}}>{r.note}</div>}
                    </div>
                    <span style={{color:r.col, fontWeight:700, fontSize:12, alignSelf:"center"}}>{r.v}</span>
                  </div>
                ))}
                <hr style={S.divider}/>
                <div style={{background:C.inputSectionBg, borderRadius:6, padding:"8px 10px", marginBottom:8, fontSize:11}}>
                  <div style={{color:C.amber, fontWeight:700, marginBottom:4}}>CERTIFICATION ARBITRAGE LADDER</div>
                  {[
                    {t:"Feed grade (no cert)",   p:"$900–$1,200/t",    col:C.grey},
                    {t:"Food grade (QS 9000)",    p:"$1,170–$1,500/t",  col:C.teal},
                    {t:"Cosmetics (FSSC 22000)",  p:"$1,800–$3,500/t",  col:C.green},
                    {t:"Pharma lipid (ISO 22716)",p:"$9,000–$18,000/t", col:C.amber},
                  ].map((r,i)=>(
                    <div key={i} style={{display:"flex", justifyContent:"space-between", marginBottom:2}}>
                      <span style={{color:C.grey}}>{r.t}</span>
                      <span style={{color:r.col, fontWeight:700}}>{r.p}</span>
                    </div>
                  ))}
                </div>
                <AmbField label="Price Override" unit="$/t"
                  value={s4.oilPriceEntry} onChange={v=>upS4("oilPriceEntry",v)}
                  note={`Active: $${certOilPrice}/t (${activeCert.badge}) | Floor: $${oilFloor}/t`}/>
                <CalcField label="Monthly Revenue" unit="USD" value={`$${certOilRev.toLocaleString()}`}/>
              </div>

              {/* Chitin */}
              <div style={S.card}>
                <SectionHdr icon="🦀" title="CHITIN — MARKET GRADE LADDER" color={C.green}/>
                <div style={{background:C.green+"18", border:`1px solid ${C.green}44`, borderRadius:8,
                  padding:"10px 14px", marginBottom:10, textAlign:"center"}}>
                  <div style={{color:C.grey, fontSize:10}}>MONTHLY YIELD</div>
                  <div style={{color:C.green, fontSize:24, fontWeight:900}}>{s6_chitinYield} kg</div>
                  <div style={{color:C.grey, fontSize:10}}>9.3% of larvae DM × 45% extractable</div>
                </div>
                {[
                  {grade:"Agricultural (soil amendment)",      price:"$5,000–$8,000/t",   col:C.green},
                  {grade:"Food grade chitosan",                price:"$20,000–$30,000/t", col:C.teal},
                  {grade:"Pharmaceutical chitosan",            price:"$35,000–$60,000/t", col:C.amber},
                  {grade:"Medical / technical specialty",      price:"$80,000–$120,000/t",col:C.red},
                ].map((r,i)=>(
                  <div key={i} style={{display:"flex", justifyContent:"space-between", padding:"8px 10px",
                    background:C.inputSectionBg, borderRadius:6, marginBottom:4}}>
                    <span style={{color:C.white, fontSize:11}}>{r.grade}</span>
                    <span style={{color:r.col, fontWeight:700, fontSize:11}}>{r.price}</span>
                  </div>
                ))}
                <hr style={S.divider}/>
                <AmbField label="Price Override" unit="$/t"
                  value={s4.chitinPriceEntry} onChange={v=>upS4("chitinPriceEntry",v)}
                  note={`Floor: $${chitinFloor}/t agricultural grade`}/>
                <CalcField label="Monthly Revenue" unit="USD" value={`$${rev_chitin.toLocaleString()}`}/>
              </div>
            </div>

            {/* Revenue Summary */}
            <div style={{...S.card, marginTop:16}}>
              <SectionHdr icon="💵" title="S6 REVENUE SUMMARY" color={C.green}/>
              <div style={{display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:10}}>
                <KPI label="Insect Meal" value={`$${certMealRev.toLocaleString()}`} unit="/month" color={C.teal}/>
                <KPI label="BSF Oil" value={`$${certOilRev.toLocaleString()}`} unit="/month" color={C.amber}/>
                <KPI label="Chitin" value={`$${rev_chitin.toLocaleString()}`} unit="/month" color={C.green}/>
                <KPI label="Frass (S5)" value={`$${(rev_frass5a+rev_frass5b).toLocaleString()}`} unit="/month" color={C.blue}/>
                <KPI label="TOTAL (no cert)" value={`$${rev_total.toLocaleString()}`} unit="/month" color={C.grey}/>
                <KPI label="TOTAL (with cert)" value={`$${certTotalRev.toLocaleString()}`} unit="/month" color={C.green}/>
              </div>
              <div style={{background:C.green+"22", border:`2px solid ${C.green}55`, borderRadius:8,
                padding:"14px 20px", display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:10}}>
                <div>
                  <div style={{color:C.green, fontWeight:700, fontSize:14}}>ANNUAL REVENUE — {activeCert.badge.toUpperCase()}</div>
                  <div style={{color:C.grey, fontSize:11}}>Certification tier: {activeCert.label}</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{color:C.green, fontWeight:900, fontSize:28}}>${(certTotalRev*12).toLocaleString()}/year</div>
                  {s4.certLevel!=="none" && <div style={{color:C.green, fontSize:12}}>+${((certTotalRev-rev_total)*12).toLocaleString()}/yr uplift vs no-cert</div>}
                </div>
              </div>
            <NutrLedger stg="S6 · BSF Meal Profile (per tonne meal DM)" N={8.10} P={1.20} K={0.40} Ca={4.50} Mg={0.80} OM={52.0} cn={6} wetPD={+(s6_mealYield/1000/s0.daysMonth).toFixed(2)} mc={8} nAdj={soilObj.nAdj} pAdj={soilObj.pAdj} ag={agObj.uplift} col={C.amber}/>
            </div>
          <div style={{textAlign:'right',padding:'12px 0'}}><button onClick={()=>setShowValCalc(v=>!v)} style={{background:'rgba(64,215,197,0.10)',border:'1.5px solid rgba(64,215,197,0.40)',borderRadius:6,color:'#40D7C5',fontFamily:"'DM Mono',monospace",fontSize:11,fontWeight:700,padding:'6px 14px',cursor:'pointer'}}>{showValCalc?'Hide Value Calculator ▴':'Value Calculator ▾'}</button></div>
          {showValCalc && <CFI_ValueCalculator defaultStage="s6"/>}
          </div>
        )}


        {/* ════════════════════ C A P E X / O P E X ════════════════════ */}
        {stage===7 && (
          <div>
            <div style={{display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:10, marginBottom:16}}>
              <KPI label="Total CAPEX" value={`$${capex_total.toLocaleString()}`} unit="USD" color={C.red}/>
              <KPI label="Annual OPEX" value={`$${opex_annual.toLocaleString()}`} unit="USD/year" color={C.amber}/>
              <KPI label="EBITDA" value={`$${ebitda.toLocaleString()}`} unit="USD/year" color={ebitda>0?C.green:C.red}/>
              <KPI label="NPV (10yr)" value={npv_10yr>0?`$${npv_10yr.toLocaleString()}`:"Negative"} unit={`@${capex.discount_rate}% discount`} color={npv_10yr>0?C.green:C.red}/>
              <KPI label="IRR" value={irr?`${irr}%`:"N/A"} unit="internal rate of return" color={irr&&irr>20?C.green:C.amber}/>
            </div>

            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:16}}>

              {/* CAPEX overview */}
              <div style={S.card}>
                <SectionHdr icon="🏗" title="CAPITAL EXPENDITURE (CAPEX)" color={C.red}/>
                <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:8}}>
                  <BluField label="Greenhouse Area" unit="m²" value={capex.greenhouse_area} onChange={v=>upCapex("greenhouse_area",+v)}/>
                  <BluField label="Civil Cost" unit="$/m²" value={capex.greenhouse_cost_m2} onChange={v=>upCapex("greenhouse_cost_m2",+v)}/>
                  <BluField label="Shredder + Hammer Mill" unit="USD" value={capex.shredder} onChange={v=>upCapex("shredder",+v)}/>
                  <BluField label="Conveyors + Handling" unit="USD" value={capex.conveyor} onChange={v=>upCapex("conveyor",+v)}/>
                  <BluField label="Screw Press (OPDC)" unit="USD" value={capex.screw_press} onChange={v=>upCapex("screw_press",+v)}/>
                  <BluField label="Mixer / Treatment Tank" unit="USD" value={capex.mixer_tank} onChange={v=>upCapex("mixer_tank",+v)}/>
                  <BluField label="Drying Unit (larvae)" unit="USD" value={capex.drying_unit} onChange={v=>upCapex("drying_unit",+v)}/>
                  <BluField label="Oil Press / Extractor" unit="USD" value={capex.oil_press} onChange={v=>upCapex("oil_press",+v)}/>
                  <BluField label="Contingency" unit="%" value={capex.contingency_pct} onChange={v=>upCapex("contingency_pct",+v)} note="Typically 10–20%"/>
                  <BluField label="Depreciation Period" unit="years" value={capex.depreciation_years} onChange={v=>upCapex("depreciation_years",+v)}/>
                </div>
                <hr style={S.divider}/>
                <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8}}>
                  <CalcField label="Civil Works" unit="USD" value={`$${capex_civil.toLocaleString()}`}/>
                  <CalcField label="Equipment" unit="USD" value={`$${capex_equipment.toLocaleString()}`}/>
                  <CalcField label="Contingency" unit="USD" value={`$${capex_contingency.toLocaleString()}`}/>
                </div>
                <div style={{background:C.red+"22", border:`2px solid ${C.red}55`, borderRadius:8,
                  padding:"12px 16px", display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:8}}>
                  <span style={{color:C.red, fontWeight:700}}>TOTAL CAPEX</span>
                  <span style={{color:C.red, fontWeight:900, fontSize:20}}>${capex_total.toLocaleString()}</span>
                </div>
              </div>

              {/* OPEX + P&L */}
              <div style={S.card}>
                <SectionHdr icon="" title="OPERATING EXPENDITURE + P&L" color={C.amber}/>
                <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:10}}>
                  <BluField label="Labor" unit="USD/month" value={capex.labor_monthly} onChange={v=>upCapex("labor_monthly",+v)}/>
                  <BluField label="Utilities" unit="USD/month" value={capex.utilities_monthly} onChange={v=>upCapex("utilities_monthly",+v)}/>
                  <BluField label="Consumables" unit="USD/month" value={capex.consumables_monthly} onChange={v=>upCapex("consumables_monthly",+v)}/>
                  <BluField label="Maintenance" unit="% CAPEX/yr" value={capex.maintenance_pct} onChange={v=>upCapex("maintenance_pct",+v)}/>
                  <BluField label="Discount Rate (NPV)" unit="%" value={capex.discount_rate} onChange={v=>upCapex("discount_rate",+v)} note="Typical EM project: 10–15%"/>
                </div>
                <hr style={S.divider}/>
                <table style={{width:"100%", borderCollapse:"collapse", fontSize:12}}>
                  <tbody>
                    {[
                      {l:"Annual Revenue",    v:`$${rev_annual.toLocaleString()}`,           col:C.green, bold:true},
                      {l:"Annual OPEX",       v:`($${opex_annual.toLocaleString()})`,         col:C.red,   bold:false},
                      {l:"EBITDA",            v:`$${ebitda.toLocaleString()}`,                col:ebitda>0?C.green:C.red, bold:true},
                      {l:"Depreciation",      v:`($${depreciation.toLocaleString()})`,        col:C.grey,  bold:false},
                      {l:"EBIT",              v:`$${ebit.toLocaleString()}`,                  col:ebit>0?C.green:C.red, bold:true},
                      {l:"EBITDA Margin",     v:`${rev_annual>0?(ebitda/rev_annual*100).toFixed(1):0}%`, col:C.teal, bold:false},
                      {l:"Payback Period",    v:payback_years?`${payback_years} years`:"N/A",col:payback_years&&payback_years<5?C.green:C.amber, bold:true},
                      {l:"ROI (EBITDA/CAPEX)",v:roi_pct?`${roi_pct}%`:"N/A",                col:roi_pct&&roi_pct>20?C.green:C.amber, bold:false},
                      {l:"NPV (10yr)",        v:npv_10yr>0?`$${npv_10yr.toLocaleString()}`:"Negative", col:npv_10yr>0?C.green:C.red, bold:true},
                      {l:"IRR",               v:irr?`${irr}%`:"N/A",                         col:irr&&irr>20?C.green:C.amber, bold:true},
                    ].map((r,i)=>(
                      <tr key={i} style={{borderBottom:`1px solid ${C.inputSectionBg}`, background:r.bold?C.navyLt:"transparent"}}>
                        <td style={{padding:"8px 10px", color:C.grey}}>{r.l}</td>
                        <td style={{padding:"8px 10px", color:r.col, fontWeight:r.bold?900:400, textAlign:"right"}}>{r.v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Per-Stage CAPEX Breakdown */}
              <div style={S.card}>
                <SectionHdr icon="🔢" title="PER-STAGE CAPEX BREAKDOWN" color={C.teal}/>
                <div style={{color:C.grey, fontSize:10, marginBottom:8}}>Override individual stage CAPEX estimates (FD Engineering EPC basis)</div>
                <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:10}}>
                  <BluField label="S1 Pre-Processing" unit="USD" value={capex.s1_capex} onChange={v=>upCapex("s1_capex",+v)}/>
                  <BluField label="S2 Chemical Treatment" unit="USD" value={capex.s2_capex} onChange={v=>upCapex("s2_capex",+v)}/>
                  <BluField label="S3 Biological Conditioning" unit="USD" value={capex.s3_capex} onChange={v=>upCapex("s3_capex",+v)}/>
                  <BluField label="S4 BSF Greenhouse" unit="USD" value={capex.s4_capex} onChange={v=>upCapex("s4_capex",+v)}/>
                  <BluField label="S5 Product Separation" unit="USD" value={capex.s5_capex} onChange={v=>upCapex("s5_capex",+v)}/>
                  <BluField label="S6 Processing (dryer/press/chitin)" unit="USD" value={capex.s6_capex} onChange={v=>upCapex("s6_capex",+v)}/>
                </div>
                <hr style={S.divider}/>
                {/* Stacked bar chart */}
                {stageCapex.map((item,i)=>{
                  const pct = stageCapexTotal>0 ? (item.v/stageCapexTotal*100).toFixed(1) : 0;
                  return (
                    <div key={i} style={{marginBottom:6}}>
                      <div style={{display:"flex", justifyContent:"space-between", marginBottom:2}}>
                        <span style={{color:item.col, fontSize:11, fontWeight:700}}>{item.s}</span>
                        <span style={{color:C.grey, fontSize:11}}>${item.v.toLocaleString()} · {pct}%</span>
                      </div>
                      <div style={{background:C.inputSectionBg, borderRadius:4, height:8, overflow:"hidden"}}>
                        <div style={{background:item.col, height:"100%", width:`${pct}%`, transition:"width 0.3s"}}/>
                      </div>
                    </div>
                  );
                })}
                <div style={{display:"flex", justifyContent:"space-between", padding:"8px 10px",
                  background:C.teal+"18", borderRadius:6, marginTop:8, border:`1px solid ${C.teal}33`}}>
                  <span style={{color:C.teal, fontWeight:700}}>Stage CAPEX Total</span>
                  <span style={{color:C.teal, fontWeight:900}}>${stageCapexTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Sensitivity Analysis */}
              <div style={S.card}>
                <SectionHdr icon="📉" title="SENSITIVITY ANALYSIS" color={C.amber}/>
                <div style={{color:C.grey, fontSize:10, marginBottom:8}}>Payback period and NPV under ±20% revenue / CAPEX scenarios</div>
                <table style={{width:"100%", borderCollapse:"collapse", fontSize:11}}>
                  <thead>
                    <tr style={{background:C.inputSectionBg}}>
                      {["Scenario","Payback (yrs)","NPV 10yr","vs Base"].map((h,i)=>(
                        <td key={i} style={{padding:"7px 10px", color:C.grey, fontWeight:700}}>{h}</td>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {scen:"Base Case",           pb:sens.base_payback,  npv:sens.base_npv,  delta:0,    col:C.white},
                      {scen:"Revenue +20%",         pb:sens.revUp_payback, npv:sens.revUp_npv, delta:+(sens.revUp_npv-sens.base_npv).toFixed(0),  col:C.green},
                      {scen:"Revenue −20%",         pb:sens.revDn_payback, npv:sens.revDn_npv, delta:+(sens.revDn_npv-sens.base_npv).toFixed(0),  col:C.red},
                      {scen:"CAPEX +20% (overrun)", pb:sens.capUp_payback, npv:sens.base_npv-capex_total*0.2, delta:-(capex_total*0.2).toFixed(0), col:C.amber},
                      {scen:"CAPEX −20% (underrun)",pb:sens.capDn_payback, npv:sens.base_npv+capex_total*0.2, delta:+(capex_total*0.2).toFixed(0), col:C.teal},
                    ].map((r,i)=>{
                      const isBase = i===0;
                      return (
                        <tr key={i} style={{borderBottom:`1px solid ${C.inputSectionBg}`, background:isBase?C.navyLt:"transparent"}}>
                          <td style={{padding:"7px 10px", color:r.col, fontWeight:isBase?900:400}}>{r.scen}</td>
                          <td style={{padding:"7px 10px", color:r.col, fontFamily:"'DM Sans', sans-serif", fontWeight:isBase?900:400}}>
                            {r.pb===null||r.pb==="N/A"?"N/A":r.pb+" yrs"}
                          </td>
                          <td style={{padding:"7px 10px", color:r.npv>0?C.green:C.red, fontFamily:"'DM Sans', sans-serif", fontWeight:isBase?900:400}}>
                            {r.npv>0?"+":""}{typeof r.npv==="number"?("$"+r.npv.toLocaleString()):"N/A"}
                          </td>
                          <td style={{padding:"7px 10px", color:isBase?C.grey:r.delta>0?C.green:C.red, fontFamily:"'DM Sans', sans-serif"}}>
                            {isBase?"—":r.delta>0?"+$"+r.delta.toLocaleString():"$"+r.delta.toLocaleString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                <hr style={S.divider}/>

                {/* Nutrient Tracker */}
                <SectionHdr icon="" title="CROSS-STAGE NUTRIENT EVOLUTION" color={C.teal}/>
                <div style={{overflowX:"auto"}}>
                  <table style={{width:"100%", borderCollapse:"collapse", fontSize:11}}>
                    <thead>
                      <tr style={{background:C.inputSectionBg}}>
                        {["Parameter","S0 Raw","→S2 PKSA","→S3 Bio","→S4 BSF","S5A","S5B","S6 Meal"].map((h,i)=>(
                          <td key={i} style={{padding:"6px 8px", color:i===0?C.grey:C.teal, fontWeight:700, whiteSpace:"nowrap"}}>{h}</td>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        {p:"N (%DM)",      s0:lab_s0_N.toString(),      s2:lab_s2_N.toString(),      s3:lab_s3_N.toString(),      s4:lab_s4_N.toString(),      s5a:`${s5a_N_DM}`, s5b:`${s5b_N_DM}`, s6:"8.1"},
                        {p:"P (%DM)",      s0:lab_s0_P.toString(),      s2:lab_s2_P.toString(),      s3:lab_s3_P.toString(),      s4:lab_s4_P.toString(),      s5a:`${s5a_P_DM}`, s5b:`${s5b_P_DM}`, s6:"1.2"},
                        {p:"K (%DM)",      s0:lab_s0_K.toString(),      s2:lab_s2_K.toString(),      s3:lab_s3_K.toString(),      s4:lab_s4_K.toString(),      s5a:`${s5a_K_DM}`, s5b:`${s5b_K_DM}`, s6:"0.6"},
                        {p:"OM (%DM)",     s0:lab_s0_OM.toString(),     s2:lab_s2_OM.toString(),     s3:lab_s3_OM.toString(),     s4:lab_s4_OM.toString(),     s5a:`${s5a_OM_DM}`, s5b:`${s5b_OM_DM}`, s6:"42"},
                        {p:"C:N",          s0:lab_s0_CN.toString(),     s2:lab_s2_CN.toString(),     s3:lab_s3_CN.toString(),     s4:lab_s4_CN.toString(),     s5a:`${s5a_CN}`, s5b:`${s5b_CN}`, s6:"5.9"},
                        {p:"Lignin (%DM)", s0:lab_s0_lignin.toString(), s2:lab_s2_lignin.toString(), s3:lab_s3_lignin.toString(), s4:lab_s4_lignin.toString(), s5a:"5", s5b:"5", s6:"0"},
                        {p:"Hemi (%DM)",   s0:"28.2",                   s2:lab_s2_hemi.toString(),   s3:lab_s3_hemi.toString(),   s4:(lab_s3_hemi*0.7).toFixed(1), s5a:"4", s5b:"4", s6:"0"},
                        {p:"CP (%DM)",     s0:lab_s0_CP.toString(),     s2:lab_s2_CP.toString(),     s3:lab_s3_CP.toString(),     s4:lab_s4_CP.toString(),     s5a:"—", s5b:"—", s6:"52–60"},
                        {p:"pH",           s0:lab_s0_pH.toString(),     s2:lab_s2_pH.toString(),     s3:lab_s3_pH.toString(),     s4:lab_s4_pH.toString(),     s5a:`${s5a_pH}`, s5b:`${s5b_pH}`, s6:"6.5"},
                      ].map((row,i)=>(
                        <tr key={i} style={{borderBottom:`1px solid ${C.inputSectionBg}`, background:i%2===0?C.navyLt+"30":"transparent"}}>
                          <td style={{padding:"6px 8px", color:C.grey, fontWeight:700}}>{row.p}</td>
                          {[row.s0,row.s2,row.s3,row.s4,row.s5a,row.s5b,row.s6].map((v,j)=>{
                            const prev = [row.s0,row.s2,row.s3,row.s4,row.s5a,row.s5b,row.s6][j-1];
                            const up = j>0 && parseFloat(v) > parseFloat(prev);
                            const dn = j>0 && parseFloat(v) < parseFloat(prev);
                            return (
                              <td key={j} style={{padding:"6px 8px", textAlign:"center", fontFamily:"'DM Sans', sans-serif",
                                color:j===0?C.white:up?C.green:dn?C.red:C.grey, fontWeight:j===6?900:400}}>
                                {v}{j>0&&up?"↑":j>0&&dn?"↓":""}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div style={{marginTop:6, fontSize:10, color:C.grey}}>
                  ↑ enrichment vs prior stage · ↓ reduction · K spike at S2 = PKSA K₂O · N concentrates through BSF bioconversion
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ════════════════════ C A R B O N   C R E D I T S   E N G I N E ════════════════════ */}
        {stage===8 && (()=>{
          // ── Live values pulled from S0 ──────────────────────────────────────
          const efbFreshMo  = +(monthFFB * 0.225 * (s0.efbCapturePct/100)).toFixed(0);
          const opdcFreshMo = +(monthFFB * 0.042 * (s0.opdcCapturePct/100)).toFixed(0);  // BUG-09 FIX: 4.2% canonical
          const pomeFreshMo = +(pomeSludgeNatTPD * s0.daysMonth * (s0.pomeCapturePct/100)).toFixed(0);
          const pomeVolMo   = carbon_pomeVol;

          // ── Project EF by pathway ───────────────────────────────────────────
          const PEF_CC = {
            bsf_s4:      {label:"BSF Inoculation (S4)",     ch4_per_tVS:1.0, n2o_per_tVS:0.10, ref:"IPCC 2006 Vol.4 Ch.4; ACM0022; AMS-III.H"},
            fast_compost:{label:"Fast In-House Composting",  ch4_per_tVS:4.0, n2o_per_tVS:0.30, ref:"IPCC 2006 Vol.4 Ch.4; ACM0022"},
          };
          const VSF_CC = {EFB:0.85, OPDC:0.82, POME_SLUDGE:0.72};
          const GWP100_CC=28, GWP_N2O_CC=273;

          function bioCO2e_cc(freshT, mc, vsKey, pk) {
            const DS = freshT*(1-mc/100), VS = DS*(VSF_CC[vsKey]||0.80);
            const ef = PEF_CC[pk];
            const ch4 = VS*ef.ch4_per_tVS/1000, n2o = VS*ef.n2o_per_tVS/1000;
            return {co2e: ch4*GWP100_CC + n2o*GWP_N2O_CC, ch4, n2o, VS};
          }

          // ── Solid stream results ────────────────────────────────────────────
          const streams_cc = [
            {id:"EFB",      name:"EFB — Empty Fruit Bunches",   fresh:efbFreshMo,  mc:+s0.efbMC,      base_co2e:co2e100_solids*(co2e100_solids>0?(ch4_efb_base*GWP100_CC)/(ch4_solids_avoid*GWP100_CC+0.001):0.6)},
            {id:"OPDC",     name:"OPDC — Decanter Cake",        fresh:opdcFreshMo, mc:+s0.opdcMC,     base_co2e:co2e100_solids*(co2e100_solids>0?(ch4_opdc_base*GWP100_CC)/(ch4_solids_avoid*GWP100_CC+0.001):0.3)},
            {id:"POME_SLUDGE",name:"POME Sludge — Centrifuge Cake",fresh:pomeFreshMo,mc:+s0.pomeSludgeMC,base_co2e:0},
          ].map(s=>{
            const proj = bioCO2e_cc(s.fresh, s.mc, s.id, ccPathway);
            const base_ch4 = s.id==="EFB"?ch4_efb_base:s.id==="OPDC"?ch4_opdc_base:ch4_sludge_base;
            const base_co2e_real = +(base_ch4*GWP100_CC).toFixed(1);
            const proj_co2e = +proj.co2e.toFixed(1);
            const avoided = Math.max(0, base_co2e_real - proj_co2e);
            return {...s, base_co2e:base_co2e_real, proj_co2e, avoided};
          });
          const solidAvoidMo  = streams_cc.reduce((a,s)=>a+s.avoided,0);
          const pomeAvoidMo   = +co2e100_pome;
          const totalAvoidMo  = solidAvoidMo + pomeAvoidMo;
          const totalAvoidAnn = +(totalAvoidMo*12).toFixed(0);

          const revOff = +(totalAvoidAnn * ccPriceOff / 1e6).toFixed(2);
          const revIns = +(totalAvoidAnn * ccPriceIns / 1e6).toFixed(2);

          // ── Style tokens (dark-navy theme matching v4) ──────────────────────
          const cc = {
            navy:"#0f1d35", navyMd:"#1a3360", navyLt:"#162848",
            tealLt:"#22b89e", amberLt:"#f0a030", green:"#1a7a40", greenLt:"#8de8b4",
            redLt:"#e03030", gold:"#d4a017", white:"#f4f6fa", grey:"#8898b0",
            blue:"#60b8e8", greyLt:"#bbc8de",
          };
          const fm = {body:"'Aptos Display','Segoe UI',system-ui,sans-serif", mono:"monospace"};
          const cs = {
            card:{background:"#1e3050",borderRadius:8,padding:11,marginBottom:10,border:"1px solid #2a4070"},
            cB:{background:"#0e2240",borderRadius:8,padding:11,marginBottom:10,border:"1px solid #1e5080"},
            cG:{background:"#102a1a",borderRadius:8,padding:11,marginBottom:10,border:`1px solid ${cc.green}`},
            cD:{background:"#2e2306",borderRadius:8,padding:11,marginBottom:10,border:`1px solid ${cc.gold}`},
            h2:cl=>({fontSize:10,fontWeight:800,color:cl||cc.tealLt,margin:"0 0 7px",textTransform:"uppercase",letterSpacing:"0.07em"}),
            lbl:{fontSize:9,color:"#c8d8f0",fontWeight:700,display:"block",marginBottom:2,textTransform:"uppercase",letterSpacing:"0.04em"},
            th:{padding:"5px 6px",color:"#c8d8f0",fontWeight:700,textAlign:"left",fontSize:9,textTransform:"uppercase"},
            td:{padding:"5px 6px",fontSize:10},
            bdg:cl=>({background:cl+"22",border:`1px solid ${cl}44`,color:cl,borderRadius:4,padding:"2px 5px",fontSize:9,fontWeight:700,display:"inline-block"}),
            big:cl=>({fontSize:22,fontWeight:900,color:cl||cc.white,fontFamily:fm.mono,lineHeight:1.1}),
            subTab:(a)=>({padding:"6px 10px",fontSize:9,fontWeight:700,cursor:"pointer",border:"none",
              background:"transparent",color:a?"#f0f4f8":cc.grey,
              borderBottom:a?`3px solid ${cc.tealLt}`:"3px solid transparent",
              fontFamily:fm.body,textTransform:"uppercase",letterSpacing:"0.04em"}),
          };

          const BUYERS_CC=[
            {name:"Microsoft",logo:"🖥",price:"$20–25/t",advance:"25–35%",tier:"primary",color:cc.tealLt,focus:"Agricultural methane avoidance",standard:"Verra VCS, CORSIA",fit:"Palm waste = agricultural residue"},
            {name:"Google/Alphabet",logo:"🔍",price:"$15–30/t",advance:"Up to 70%",tier:"primary",color:cc.amberLt,focus:"Waste valorisation, circular economy",standard:"Verra VCS",fit:"Aligns with waste-to-value mandate"},
            {name:"Frontier Climate",logo:"🌊",price:"$40–100/t",advance:"Dev funding",tier:"primary",color:cc.greenLt,focus:"High-quality avoidance, innovative tech",standard:"Science-based premium",fit:"BSF = innovative + scalable + permanent"},
            {name:"Nestlé",logo:"",price:"$40–75/t",advance:"ERPA structured",tier:"strategic",color:cc.gold,focus:"Scope 3 supply chain — palm oil",standard:"CSRD, SBTi Scope 3",fit:"CFI covers 85% of Nestlé's palm footprint"},
            {name:"Unilever/Danone",logo:"",price:"$25–50/t",advance:"Varies",tier:"strategic",color:"#a070e0",focus:"Scope 3 FMCG palm supply chain",standard:"CSRD, EUDR",fit:"Mandatory CSRD disclosure"},
            {name:"Aviation CORSIA",logo:"✈",price:"$15–30/t",advance:"Forward contracts",tier:"secondary",color:cc.greyLt,focus:"CORSIA compliance from 2027",standard:"CORSIA (ACM0022)",fit:"Demand surge 2027 — register now"},
            {name:"Spot/Voluntary",logo:"💹",price:"$12–22/t",advance:"None",tier:"secondary",color:cc.grey,focus:"Carbonmark, Puro.earth, AirCarbon",standard:"Verra VCS, Gold Standard",fit:"Fill gaps between ERPA contracts"},
          ];
          const SC3_CC=[
            {name:"Nestlé",total:"74.7M",s3:"71.4M",pct:95.5,palm:"937K"},
            {name:"Unilever",total:"52.3M",s3:"49.5M",pct:94.6,palm:"1.2M"},
            {name:"Danone",total:"24.6M",s3:"23.1M",pct:93.9,palm:"640K"},
            {name:"Wilmar",total:"38.2M",s3:"36.9M",pct:96.6,palm:"4.8M"},
            {name:"Sinar Mas",total:"31.5M",s3:"30.2M",pct:95.9,palm:"6.1M"},
            {name:"Mondēlez",total:"11.2M",s3:"10.4M",pct:92.9,palm:"285K"},
          ];

          return (
            <div style={{fontFamily:fm.body,fontSize:12}}>

              {/* ── DMPP N₂O SUPPRESSION PANEL ── */}
              <div style={{background:"#12201a",border:"1px solid #2a6040",borderRadius:8,padding:12,marginBottom:10}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontSize:16}}></span>
                    <div>
                      <div style={{fontSize:12,fontWeight:800,color:"#8de8b4",letterSpacing:"0.04em"}}>DMPP N₂O SUPPRESSION — ADDITIONAL CREDIT PATHWAY</div>
                      <div style={{fontSize:9,color:"#7aa890"}}>IPCC 2006 Vol.4 Ch.11 · EF_direct = 0.010 kg N₂O-N/kg N · GWP N₂O = 265 (AR5) · Verra VM0042</div>
                    </div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontSize:10,color:"#8de8b4",fontWeight:700}}>ENABLE DMPP</span>
                    <button onClick={()=>upS0("dmppEnabled",!s0.dmppEnabled)} style={{
                      background:s0.dmppEnabled?"#1a7a40":"#1a3360",border:s0.dmppEnabled?"1px solid #3dcb7a":"1px solid #2a4070",
                      borderRadius:20,padding:"4px 14px",color:s0.dmppEnabled?"#3dcb7a":"#8898b0",
                      fontSize:11,fontWeight:800,cursor:"pointer",letterSpacing:"0.05em"
                    }}>{s0.dmppEnabled?"ON ✓":"OFF"}</button>
                  </div>
                </div>

                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8,marginBottom:10}}>
                  {/* Inputs */}
                  <div style={{background:"#0e2818",borderRadius:6,padding:"8px 10px",border:"1px solid #2a5030"}}>
                    <div style={{fontSize:8,color:"#7aa890",fontWeight:700,marginBottom:4,textTransform:"uppercase"}}>Frass N Applied/Day</div>
                    <div style={{fontSize:18,fontWeight:900,color:"#8de8b4",fontFamily:"'DM Sans', sans-serif"}}>{dmpp_N_kgday.toLocaleString()}</div>
                    <div style={{fontSize:9,color:"#5a8870"}}>kg N/day to field</div>
                  </div>
                  <div style={{background:"#0e2818",borderRadius:6,padding:"8px 10px",border:"1px solid #2a5030"}}>
                    <div style={{fontSize:8,color:"#7aa890",fontWeight:700,marginBottom:4,textTransform:"uppercase"}}>Baseline N₂O (no DMPP)</div>
                    <div style={{fontSize:18,fontWeight:900,color:"#f0a030",fontFamily:"'DM Sans', sans-serif"}}>{dmpp_co2e_base_ann.toLocaleString()}</div>
                    <div style={{fontSize:9,color:"#5a8870"}}>t CO₂e/yr emitted uncontrolled</div>
                  </div>
                  <div style={{background:s0.dmppEnabled?"#102a18":"#0e1a18",borderRadius:6,padding:"8px 10px",border:s0.dmppEnabled?"1px solid #3dcb7a44":"1px solid #2a3030"}}>
                    <div style={{fontSize:8,color:"#7aa890",fontWeight:700,marginBottom:4,textTransform:"uppercase"}}>N₂O Avoided ({soilObjCalc.name})</div>
                    <div style={{fontSize:18,fontWeight:900,color:s0.dmppEnabled?"#3dcb7a":"#445050",fontFamily:"'DM Sans', sans-serif"}}>{dmpp_co2e_avoid_ann.toLocaleString()}</div>
                    <div style={{fontSize:9,color:"#5a8870"}}>t CO₂e/yr · {Math.round(dmpp_efficacy*100)}% suppression on {soilObjCalc.name}</div>
                  </div>
                  <div style={{background:s0.dmppEnabled?"#1a3520":"#0e1a18",borderRadius:6,padding:"8px 10px",border:s0.dmppEnabled?"1px solid #3dcb7a":"1px solid #2a3030"}}>
                    <div style={{fontSize:8,color:"#7aa890",fontWeight:700,marginBottom:4,textTransform:"uppercase"}}>Credit Revenue</div>
                    <div style={{fontSize:18,fontWeight:900,color:s0.dmppEnabled?"#3dcb7a":"#445050",fontFamily:"'DM Sans', sans-serif"}}>${s0.dmppEnabled?dmpp_credit_rev_ann.toLocaleString():"—"}</div>
                    <div style={{fontSize:9,color:"#5a8870"}}>$/yr @ ${carbonPriceActive}/t CO₂e</div>
                  </div>
                </div>

                {/* DMPP dose + cost inputs */}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:10}}>
                  <div>
                    <div style={{fontSize:8,color:"#7aa890",fontWeight:700,marginBottom:3,textTransform:"uppercase"}}>DMPP Dose (kg/t frass WW)  USER INPUT</div>
                    <input style={{background:"#2a2010",border:"1px solid #f0a03066",borderRadius:5,color:"#f0c060",padding:"5px 8px",fontSize:12,width:"100%",outline:"none"}}
                      value={s0.dmppDose} onChange={e=>upS0("dmppDose",e.target.value)}/>
                    <div style={{fontSize:8,color:"#5a7070",marginTop:2}}>Commercial range: 1–2 kg/t. IPCC ref dose 1.5 kg/t.</div>
                  </div>
                  <div>
                    <div style={{fontSize:8,color:"#7aa890",fontWeight:700,marginBottom:3,textTransform:"uppercase"}}>DMPP Cost ($/kg)  USER INPUT</div>
                    <input style={{background:"#2a2010",border:"1px solid #f0a03066",borderRadius:5,color:"#f0c060",padding:"5px 8px",fontSize:12,width:"100%",outline:"none"}}
                      value={s0.dmppCostPerKg} onChange={e=>upS0("dmppCostPerKg",e.target.value)}/>
                    <div style={{fontSize:8,color:"#5a7070",marginTop:2}}>Commercial range: $8–15/kg DMPP (ENTEC, Piadin, Vizura brands).</div>
                  </div>
                  <div style={{background:s0.dmppEnabled?"#102818":"#0e1a18",borderRadius:6,padding:"8px 10px",border:s0.dmppEnabled?"1px solid #3dcb7a44":"1px solid #2a3030"}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                      <span style={{fontSize:8,color:"#7aa890",fontWeight:700,textTransform:"uppercase"}}>Annual Cost</span>
                      <span style={{fontSize:10,fontWeight:800,color:"#f0a030",fontFamily:"'DM Sans', sans-serif"}}>${dmpp_cost_annual.toLocaleString()}</span>
                    </div>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                      <span style={{fontSize:8,color:"#7aa890",fontWeight:700,textTransform:"uppercase"}}>Net Gain/yr</span>
                      <span style={{fontSize:10,fontWeight:800,color:dmpp_net_annual>=0?"#3dcb7a":"#e84040",fontFamily:"'DM Sans', sans-serif"}}>${s0.dmppEnabled?dmpp_net_annual.toLocaleString():"—"}</span>
                    </div>
                    <div style={{display:"flex",justifyContent:"space-between"}}>
                      <span style={{fontSize:8,color:"#7aa890",fontWeight:700,textTransform:"uppercase"}}>ROI</span>
                      <span style={{fontSize:14,fontWeight:900,color:dmpp_roi>=3?"#3dcb7a":dmpp_roi>=2?"#f0a030":"#e84040",fontFamily:"'DM Sans', sans-serif"}}>{s0.dmppEnabled?dmpp_roi+"x":"—"}</span>
                    </div>
                  </div>
                </div>

                {/* Per-soil DMPP table */}
                <div style={{fontSize:9,color:"#8de8b4",fontWeight:700,marginBottom:5,textTransform:"uppercase",letterSpacing:"0.06em"}}>N₂O SUPPRESSION EFFICACY — ALL SOILS AT CURRENT FRASS OUTPUT</div>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:9}}>
                  <thead>
                    <tr style={{background:"#0a1f14"}}>
                      {["Soil Type","Coverage","DMPP Efficacy","N₂O Avoided (t CO₂e/yr)","Credit Value ($/yr)","Key Note"].map((h,i)=>(
                        <th key={i} style={{padding:"4px 6px",color:"#8de8b4",fontWeight:700,textAlign:"left",textTransform:"uppercase",fontSize:8}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {SOILS.map((soil,i)=>{
                      const eff = soil.dmppEfficacy||0.35;
                      const avoid = +(dmpp_n2o_base_kgday * eff * DMPP_GWP_N2O * 365 / 1000).toFixed(1);
                      const rev = +(avoid * carbonPriceActive).toFixed(0);
                      const isActive = soil.id===s0.soil;
                      return (
                        <tr key={i} style={{borderBottom:"1px solid #1a3025",background:isActive?"#1a3a20":"transparent"}}>
                          <td style={{padding:"4px 6px",color:isActive?"#3dcb7a":"#c8d8f0",fontWeight:isActive?800:400}}>{soil.name}{isActive?" ← active":""}</td>
                          <td style={{padding:"4px 6px",color:"#7aa890",fontFamily:"'DM Sans', sans-serif"}}>{soil.pct}</td>
                          <td style={{padding:"4px 6px",fontFamily:"'DM Sans', sans-serif",fontWeight:700,color:eff>=0.40?"#3dcb7a":eff>=0.30?"#f0a030":"#8898b0"}}>{Math.round(eff*100)}%</td>
                          <td style={{padding:"4px 6px",fontFamily:"'DM Sans', sans-serif",color:"#3dcb7a",fontWeight:700}}>{avoid.toLocaleString()}</td>
                          <td style={{padding:"4px 6px",fontFamily:"'DM Sans', sans-serif",color:"#f0a030",fontWeight:700}}>${rev.toLocaleString()}</td>
                          <td style={{padding:"4px 6px",color:"#7aa890",fontSize:8}}>{soil.dmppNote||"—"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {/* Agronomic co-benefit note */}
                <div style={{marginTop:8,background:"#0e1e14",borderRadius:5,padding:"6px 10px",border:"1px solid #2a4030"}}>
                  <span style={{color:"#f0a030",fontWeight:700,fontSize:9}}>AGRONOMIC CO-BENEFIT: </span>
                  <span style={{color:"#7aa890",fontSize:9}}>DMPP retains ~{dmpp_n_retained_pct}% additional N in ammonium form on {soilObjCalc.name} — estate N-use efficiency improves, reducing total frass needed to hit same yield response. This is a selling point to Sinar Mas agronomists: lower application rate = lower transport cost to estate. Effective N cost comparison: frass + DMPP vs Urea at $1.50/kg N (Sinar Mas actual).</span>
                </div>
              </div>

              {/* ── ENGINE HEADER ── */}
              <div style={{background:`linear-gradient(135deg,#1a3360,#0f1d35)`,borderBottom:`2px solid ${cc.tealLt}`,
                padding:"10px 14px",display:"flex",alignItems:"center",borderRadius:"8px 8px 0 0",marginBottom:0}}>
                <div style={{flex:"0 0 auto",paddingRight:14,borderRight:"1px solid #ffffff18"}}>
                  <div style={{fontSize:15,fontWeight:800,color:cc.white,marginBottom:3}}>Carbon Credits Engine</div>
                  <div style={{display:"grid",gridTemplateColumns:"auto 1fr",gap:"2px 7px",fontSize:9}}>
                    <span style={{color:"#bbc8de",fontWeight:700}}>Solid Residues:</span><span style={{color:"#c8d8f0"}}>Verra ACM0022 v4.0 · IPCC FOD Vol.5 Ch.2</span>
                    <span style={{color:"#bbc8de",fontWeight:700}}>POME Sludge:</span><span style={{color:"#c8d8f0"}}>ACM0022 / AMS-III.H · IPCC Biological Treatment Vol.4 Ch.4</span>
                    <span style={{color:"#bbc8de",fontWeight:700}}>POME Liquid:</span><span style={{color:"#c8d8f0"}}>Verra VM0041 · IPCC COD Vol.5 Ch.6</span>
                    <span style={{color:"#bbc8de",fontWeight:700}}>Methane Equiv.:</span><span style={{color:"#c8d8f0"}}>AR5 GWP₁₀₀ = 28 · AR6 GWP_N₂O = 273</span>
                  </div>
                </div>
                <div style={{flex:"0 0 auto",padding:"0 14px",textAlign:"center"}}>
                  <div style={{fontSize:8,color:"#c8d8f0",fontWeight:600}}>All figures</div>
                  <div style={{fontSize:14,color:cc.tealLt}}>▶</div>
                  <div style={{fontSize:8,color:"#c8d8f0",fontWeight:600}}>Annual</div>
                </div>
                <div style={{flex:1,display:"flex",justifyContent:"flex-end",alignItems:"center",gap:14}}>
                  {[
                    {lbl:"Credits Earned",  v:Math.round(totalAvoidAnn).toLocaleString(), sub:"tCO₂e",         c:cc.white},
                    {lbl:"Offsetting",      v:`$${revOff}M`,  sub:`@ $${ccPriceOff}/t`,   c:cc.tealLt},
                    {lbl:"Insetting",       v:`$${revIns}M`,  sub:`@ $${ccPriceIns}/t`,   c:cc.amberLt},
                  ].map((k,i)=>(
                    <div key={i} style={{textAlign:"center"}}>
                      <div style={{fontSize:8,color:k.c,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:1}}>{k.lbl}</div>
                      <div style={{fontFamily:fm.mono,fontWeight:900,color:k.c,fontSize:20,lineHeight:1}}>{k.v}</div>
                      <div style={{fontSize:8,color:"#c8d8f0"}}>{k.sub}</div>
                    </div>
                  )).reduce((a,el,i)=>i===0?[el]:[...a,<div key={`d${i}`} style={{width:1,height:32,background:"#ffffff20"}}/>,el],[])}
                </div>
              </div>

              {/* ── Live-data badge ── */}
              <div style={{background:"#0e2240",border:"1px solid #1e5080",borderTop:"none",
                borderRadius:"0 0 0 0",padding:"5px 14px",display:"flex",gap:16,flexWrap:"wrap",marginBottom:0}}>
                <span style={{fontSize:9,color:"#90c8e8"}}>🔗 <strong>Live S0 data:</strong> {s0.ffbCapacity} TPH · {s0.utilisation}% util · {s0.hrsDay}h/day · {s0.daysMonth} days/mo</span>
                <span style={{fontSize:9,color:"#90c8e8"}}>EFB {efbFreshMo.toLocaleString()} t/mo · OPDC {opdcFreshMo.toLocaleString()} t/mo · POME Sludge {pomeFreshMo.toLocaleString()} t/mo · POME Liquid {pomeVolMo.toLocaleString()} m³/mo</span>
              </div>

              {/* ── Sub-tabs ── */}
              <div style={{display:"flex",background:"#162848",borderBottom:`1px solid #2a4070`,padding:"0 10px",marginBottom:8}}>
                {[{id:"calc",l:" Calculator"},{id:"meth",l:"📐 Methodology"},{id:"buy",l:"🎯 Buyers"},{id:"ins",l:"🔗 Insetting"},{id:"nes",l:" Nestlé Case"}].map(t=>(
                  <button key={t.id} style={cs.subTab(ccTab===t.id)} onClick={()=>setCcTab(t.id)}>{t.l}</button>
                ))}
              </div>

              {/* ══════════════ CALCULATOR TAB ══════════════ */}
              {ccTab==="calc" && (
                <div>
                  {/* S4 Pathway + KPIs */}
                  <div style={{...cs.card,border:`1px solid ${cc.amberLt}44`,marginBottom:8}}>
                    <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                      <span style={{fontSize:10,fontWeight:800,color:cc.amberLt,textTransform:"uppercase"}}>🔗 S4 Process Pathway</span>
                      <span style={{fontSize:9,color:"#c8d8f0"}}>Sets project treatment EFs for all solid residues (IPCC Vol.4 Ch.4)</span>
                      <div style={{marginLeft:"auto",display:"flex",gap:6,alignItems:"center"}}>
                        <span style={cs.lbl}>Treatment:</span>
                        <select value={ccPathway} onChange={e=>setCcPathway(e.target.value)}
                          style={{background:cc.navy,border:`1px solid ${cc.amberLt}55`,borderRadius:4,color:cc.white,padding:"4px 6px",fontSize:10,fontFamily:fm.body}}>
                          {Object.entries(PEF_CC).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
                        </select>
                      </div>
                    </div>
                    <div style={{marginTop:5,display:"flex",gap:14,flexWrap:"wrap"}}>
                      {[{l:"CH₄ EF",v:`${PEF_CC[ccPathway].ch4_per_tVS} kg/t VS`,c:cc.redLt},{l:"N₂O EF",v:`${PEF_CC[ccPathway].n2o_per_tVS} kg/t VS`,c:cc.amberLt},{l:"Ref",v:PEF_CC[ccPathway].ref,c:"#c8d8f0"}].map(k=>(
                        <div key={k.l} style={{fontSize:9}}><span style={{color:cc.grey,fontWeight:700,marginRight:4}}>{k.l}:</span><span style={{color:k.c,fontWeight:600}}>{k.v}</span></div>
                      ))}
                    </div>
                  </div>

                  <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:8}}>
                    {[{l:"Solid Avoided (ACM0022)",v:Math.round(solidAvoidMo).toLocaleString(),u:"tCO₂e/mo",c:cc.tealLt},
                      {l:"POME Avoided (VM0041)",v:Math.round(pomeAvoidMo).toLocaleString(),u:"tCO₂e/mo",c:cc.blue},
                      {l:"Total Annual Credits",v:Math.round(totalAvoidAnn).toLocaleString(),u:"tCO₂e/yr",c:cc.greenLt}].map(k=>(
                      <div key={k.l} style={{...cs.card,textAlign:"center",marginBottom:0}}>
                        <div style={cs.lbl}>{k.l}</div>
                        <div style={cs.big(k.c)}>{k.v}</div>
                        <div style={{fontSize:9,color:"#c8d8f0",marginTop:2}}>{k.u}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                    {[{l:"Offsetting Annual",v:`$${revOff}M`,sub:`@ $${ccPriceOff}/t`,c:cc.tealLt},
                      {l:"Strategic Insetting Annual",v:`$${revIns}M`,sub:`@ $${ccPriceIns}/t`,c:cc.amberLt}].map(k=>(
                      <div key={k.l} style={{...cs.card,textAlign:"center",marginBottom:0,borderColor:k.c+"55"}}>
                        <div style={cs.lbl}>{k.l}</div>
                        <div style={cs.big(k.c)}>{k.v}</div>
                        <div style={{fontSize:9,color:"#c8d8f0",marginTop:2}}>{k.sub}</div>
                      </div>
                    ))}
                  </div>

                  {/* Price Sliders */}
                  <div style={cs.card}>
                    <div style={cs.h2()}> Price Scenarios</div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
                      {[{l:"Offsetting $/t CO₂e",val:ccPriceOff,set:setCcPriceOff,min:5,max:150,c:cc.tealLt,note:"Voluntary carbon market — cannot satisfy CSRD Scope 3 targets."},
                        {l:"Strategic Insetting $/t CO₂e",val:ccPriceIns,set:setCcPriceIns,min:10,max:150,c:cc.amberLt,note:"Supply chain insetting — counts toward CSRD Scope 3, SBTi FLAG, EUDR."}].map(p=>(
                        <div key={p.l}>
                          <label style={cs.lbl}>{p.l}</label>
                          <input type="range" min={p.min} max={p.max} value={p.val} onChange={e=>p.set(+e.target.value)} style={{width:"100%",accentColor:p.c}}/>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:2}}>
                            <span style={{fontSize:9,color:cc.grey}}>${p.min}</span>
                            <span style={{fontFamily:fm.mono,fontWeight:900,color:p.c,fontSize:18}}>${p.val}/t</span>
                            <span style={{fontSize:9,color:cc.grey}}>${p.max}</span>
                          </div>
                          <div style={{fontSize:9,color:"#c8d8f0",marginTop:3}}>{p.note}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Method A Table */}
                  <div style={cs.card}>
                    <div style={cs.h2()}> Method A — Solid Residues (ACM0022 / AMS-III.H · IPCC FOD Vol.5 Ch.2)</div>
                    <div style={{fontSize:9,color:"#c8d8f0",marginBottom:6}}>Baseline: CH₄ = DM × DOC × DOCf × MCF × 0.50 × (16/12) · Project: IPCC Vol.4 Ch.4 EFs · MCF baseline: {MCF_solid_baseline}</div>
                    <div style={{overflowX:"auto"}}>
                      <table style={{width:"100%",borderCollapse:"collapse",fontSize:10}}>
                        <thead><tr style={{borderBottom:"1px solid #2a4070"}}>
                          {["Stream","Fresh t/mo","MC%","Baseline CO₂e/mo","Project CO₂e/mo","Avoided t/mo"].map(h=><th key={h} style={cs.th}>{h}</th>)}
                        </tr></thead>
                        <tbody>
                          {streams_cc.map(x=>(
                            <tr key={x.id} style={{borderBottom:"1px solid #ffffff08"}}>
                              <td style={{...cs.td,color:cc.white,fontWeight:600}}>{x.name}</td>
                              <td style={{...cs.td,fontFamily:fm.mono,color:cc.white}}>{x.fresh.toLocaleString()}</td>
                              <td style={{...cs.td,fontFamily:fm.mono,color:cc.white}}>{x.id==="EFB"?s0.efbMC:x.id==="OPDC"?s0.opdcMC:s0.pomeSludgeMC}%</td>
                              <td style={{...cs.td,fontFamily:fm.mono,fontWeight:800,color:cc.redLt}}>{Math.round(x.base_co2e).toLocaleString()}</td>
                              <td style={{...cs.td,fontFamily:fm.mono,fontWeight:800,color:cc.amberLt}}>{Math.round(x.proj_co2e).toLocaleString()}</td>
                              <td style={{...cs.td,fontFamily:fm.mono,fontWeight:800,color:cc.greenLt}}>+{Math.round(x.avoided).toLocaleString()}</td>
                            </tr>
                          ))}
                          <tr style={{borderTop:`2px solid ${cc.tealLt}44`,background:"#ffffff06"}}>
                            <td style={{...cs.td,color:cc.tealLt,fontWeight:800}} colSpan={3}>TOTAL SOLIDS</td>
                            <td style={{...cs.td,fontFamily:fm.mono,fontWeight:800,color:cc.redLt}}>{Math.round(streams_cc.reduce((a,s)=>a+s.base_co2e,0)).toLocaleString()}</td>
                            <td style={{...cs.td,fontFamily:fm.mono,fontWeight:800,color:cc.amberLt}}>{Math.round(streams_cc.reduce((a,s)=>a+s.proj_co2e,0)).toLocaleString()}</td>
                            <td style={{...cs.td,fontFamily:fm.mono,fontWeight:800,color:cc.greenLt}}>+{Math.round(solidAvoidMo).toLocaleString()}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Method B POME */}
                  <div style={cs.cB}>
                    <div style={cs.h2(cc.blue)}> Method B — POME Liquid (VM0041 · IPCC COD Vol.5 Ch.6)</div>
                    <div style={{fontSize:9,color:"#b0d0f0",marginBottom:7}}>Liquid effluent to open anaerobic ponds — separate from solid sludge cake. CH₄ = Vol × COD × B₀ × MCF ÷ 1000</div>
                    <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                      {[{l:"Volume",v:`${pomeVolMo.toLocaleString()} m³/mo`},{l:"COD",v:`${C_COD} kg/m³`},{l:"B₀",v:`${C_B0}`},
                        {l:"Baseline MCF",v:`${MCF_pome_baseline}`},{l:"Baseline CH₄",v:`${ch4_pome_base.toFixed(1)} t/mo`,c:cc.redLt},
                        {l:"Avoided/mo",v:`${Math.round(pomeAvoidMo).toLocaleString()} tCO₂e`,c:cc.greenLt},
                        {l:"Avoided/yr",v:`${Math.round(pomeAvoidMo*12).toLocaleString()} tCO₂e`,c:cc.greenLt}].map(k=>(
                        <div key={k.l} style={{textAlign:"center",background:"#0a1828",borderRadius:5,padding:"5px 9px",border:"1px solid #1e4060"}}>
                          <div style={{...cs.lbl,color:"#90c8e8"}}>{k.l}</div>
                          <div style={{fontFamily:fm.mono,fontWeight:800,color:k.c||"#b0d0f0",fontSize:12}}>{k.v}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 10-Year Projection */}
                  <div style={{background:"#0e2240",borderRadius:8,padding:11,marginBottom:10,border:"1px solid #1e5080"}}>
                    <div style={cs.h2(cc.amberLt)}>☰ 10-Year Projection</div>
                    <div style={{display:"flex",flexDirection:"column",gap:7}}>
                      {[{sc:"Offsetting",price:ccPriceOff,c:cc.tealLt},{sc:"Strategic Insetting",price:ccPriceIns,c:cc.amberLt}].map(x=>{
                        const ann = totalAvoidAnn*x.price;
                        return(
                          <div key={x.sc} style={{borderRadius:6,overflow:"hidden",border:`1px solid ${x.c}33`}}>
                            <div style={{background:x.c+"22",borderBottom:`1px solid ${x.c}44`,padding:"4px 11px",fontSize:10,fontWeight:800,color:x.c,textTransform:"uppercase"}}>{x.sc} · ${x.price}/t CO₂e</div>
                            <div style={{display:"flex",alignItems:"center",padding:"8px 14px",gap:24}}>
                              <div><div style={{fontFamily:fm.mono,fontWeight:900,color:x.c,fontSize:18}}>${(ann/1e6).toFixed(2)}M</div><div style={{fontSize:9,color:"#c8d8f0",marginTop:2}}>Per year</div></div>
                              <div style={{width:1,height:28,background:"#ffffff15"}}/>
                              <div><div style={{fontFamily:fm.mono,fontWeight:900,color:x.c,fontSize:18}}>${(ann*10/1e6).toFixed(1)}M</div><div style={{fontSize:9,color:"#c8d8f0",marginTop:2}}>10-year total</div></div>
                              <div style={{marginLeft:"auto",textAlign:"right"}}>
                                <div style={{fontSize:9,color:"#c8d8f0"}}>{Math.round(totalAvoidAnn).toLocaleString()} tCO₂e/yr</div>
                                <div style={{fontSize:9,color:"#c8d8f0"}}>× 10 = {Math.round(totalAvoidAnn*10).toLocaleString()} t</div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div style={{marginTop:7,fontSize:9,color:"#c8d8f0",fontStyle:"italic"}}>
                       POME ponds ~<strong style={{color:cc.amberLt,fontStyle:"normal"}}>{Math.round(pomeAvoidMo/(totalAvoidMo||1)*100)}%</strong> of monthly credits (MCF {MCF_pome_baseline}, VM0041). Treatment: <strong style={{color:cc.amberLt,fontStyle:"normal"}}>{PEF_CC[ccPathway].label}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* ══════════════ METHODOLOGY TAB v21 ══════════════ */}
              {ccTab==="meth" && (
                <div>
                  <div style={cs.card}>
                    <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:9}}>
                      <div style={cs.h2()}>Per-Residue Verra Methodology Quick Reference</div>
                      <InfoDot
                        color={cc.tealLt}
                        summary="ACM0022 is the primary Verra VCS methodology for all palm organic residues diverted from anaerobic decay to aerobic BSF treatment. No dedicated palm-specific code exists; all streams use the organic waste methodology family. Verra confirmed BSF = aerobic waste treatment under ACM0022 in Feb 2025."
                        logic={"Baseline CH4 = DM x DOC x DOCf x MCF x F x (16/12)\nAvoided CO2e = Baseline_CH4 x GWP100"}
                        sources={[{label:"Verra ACM0022",url:"https://verra.org/methodologies/acm0022-alternative-waste-treatment-processes/"},{label:"IPCC Waste Guidelines Vol.5",url:"https://www.ipcc-nggip.iges.or.jp/public/2006gl/vol5.html"},{label:"Verra Feb 2025 BSF clarification",url:"https://verra.org/program-notice/verra-releases-clarifications-to-cdm-composting-methodologies/"}]}
                      />
                    </div>
                    <div style={{overflowX:"auto"}}>
                    <table style={{width:"100%",borderCollapse:"collapse",fontSize:10,minWidth:700}}>
                      <thead>
                        <tr style={{background:C.infoSectionBg,borderBottom:"2px solid "+cc.tealLt+"55"}}>
                          {["Residue","Verra Code","DOC","MCF Baseline","tCO2e/yr","Apply When","Notes"].map(function(h){
                            return React.createElement("th",{key:h,style:{...cs.th,textAlign:"left",padding:"7px 8px",color:cc.tealLt,fontSize:10}},h);
                          })}
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          {res:"EFB",code:"ACM0022",doc:"0.45",mcf:"0.60",tco2:"75,600",when:"Always",
                           color:cc.tealLt,
                           note:"Primary solid stream. High-volume baseline.",
                           dotS:"EFB = 20-23% of FFB weight. Lignocellulosic 44-50% carbon. Baseline = piled field mulch, 2-5m depth, unmanaged anaerobic cores. MCF 0.60 = moderate anaerobic.",
                           dotL:"60,000 DM x 0.45 x 0.50 x 0.60 x 0.50 x (16/12) x 28 = 75,600 tCO2e/yr",
                           dotSrc:[{label:"Verra ACM0022",url:"https://verra.org/methodologies/acm0022-alternative-waste-treatment-processes/"}]},
                          {res:"POME Sludge",code:"ACM0022 + AMS-III.Y",doc:"0.40-0.45",mcf:"0.80-1.0 pond / 0.60 piled",tco2:"50-60k",when:"Always",
                           color:cc.amberLt,
                           note:"AMS-III.Y under revision as M0370 (VCS 2026).",
                           dotS:"Settled solids from POME anaerobic ponds. High organic content 30-40% DM. Deep anaerobic lagoon MCF = 0.8-1.0. AMS-III.Y covers solid/liquid separation scenarios. Use higher MCF for in-pond baseline.",
                           dotL:"30,000 DM x 0.43 x 0.50 x 0.90 x 0.50 x (16/12) x 28 = 54,000 tCO2e/yr",
                           dotSrc:[{label:"Verra AMS-III.Y (M0370 revision)",url:"https://verra.org/program-notice/consultation-revision-to-cdm-methodology-for-methane-avoidance/"}]},
                          {res:"OPDC (Decanter Cake)",code:"ACM0022",doc:"0.42-0.45",mcf:"0.50-0.60",tco2:"20-25k",when:"Always",
                           color:cc.green,
                           note:"Shallower piles = lower MCF vs EFB.",
                           dotS:"Solid residue from 3-phase decanter centrifuge. Similar to EFB fiber but shallower disposal piles = better aeration. Use MCF 0.50 (conservative) to 0.60 depending on pile depth and management.",
                           dotL:"20,000 DM x 0.43 x 0.50 x 0.55 x 0.50 x (16/12) x 28 = 22,000 tCO2e/yr",
                           dotSrc:[{label:"Verra ACM0022",url:"https://verra.org/methodologies/acm0022-alternative-waste-treatment-processes/"}]},
                          {res:"Pressed Fiber",code:"ACM0022*",doc:"0.45",mcf:"0.40-0.50",tco2:"0*",when:"Disposal baseline only",
                           color:cc.grey,
                           note:"*ONLY if surplus to boiler. Not applicable if burned.",
                           dotS:"CRITICAL: if mesocarp fiber goes to mill boiler = NO methane baseline = NO credits. Only claim if boiler is at capacity and fiber would otherwise be dumped. Lower moisture (40-50%) and better aeration = MCF 0.40.",
                           dotL:"Credits ONLY if: fiber volume > boiler capacity AND photographic disposal evidence provided to VVB.",
                           dotSrc:[{label:"Verra ACM0022",url:"https://verra.org/methodologies/acm0022-alternative-waste-treatment-processes/"}]},
                          {res:"PKS / Shell",code:"N/A",doc:"—",mcf:"N/A",tco2:"0",when:"Never",
                           color:cc.red,
                           note:"Already fuel/activated carbon. No CH4 pathway.",
                           dotS:"PKS = 10-15% moisture, high recalcitrant lignin. Sold as boiler fuel or activated carbon feedstock. No anaerobic decay pathway = no methane emissions baseline. PKSA (ash) used in CFI as pH buffer at $0 cost (mill waste).",
                           dotL:"VMR0009 theoretically possible if PKS dumped, but not a realistic CFI scenario.",
                           dotSrc:[]},
                          {res:"Mixed Streams (CFI)",code:"ACM0022",doc:"0.44 wtd",mcf:"0.61 wtd",tco2:"151,200",when:"Primary claim",
                           color:cc.purple,
                           note:"EFB 50% + POME 25% + OPDC 20% + other 5%.",
                           dotS:"Integrated system weighted-average approach. This is CFI primary credit claim. With N2O avoidance = 152,968 tCO2e/yr. At $50-120/t insetting price = $7.6M-$18.4M/yr gross.",
                           dotL:"Wtd DOC = (0.50x0.45)+(0.25x0.43)+(0.20x0.43)+(0.05x0.40) = 0.44\nWtd MCF = (0.50x0.60)+(0.25x0.70)+(0.20x0.55)+(0.05x0.50) = 0.61\n120,000 x 0.44 x 0.50 x 0.61 x 0.50 x (16/12) x 28 = 151,200",
                           dotSrc:[{label:"Verra ACM0022",url:"https://verra.org/methodologies/acm0022-alternative-waste-treatment-processes/"},{label:"IPCC 2019 Refinement Vol.5",url:"https://www.ipcc-nggip.iges.or.jp/public/2019rf/vol5.html"}]},
                          {res:"Fertiliser Displacement",code:"VM0042",doc:"—",mcf:"—",tco2:"7,008",when:"Phase 2 (Yr 4+)",
                           color:cc.greenLt,
                           note:"N+P+K displacement from CFI frass. Phase 2 add-on.",
                           dotS:"CFI frass displaces synthetic N/P/K. Manufacturing credits: 2,967 tCO2e. Transport/packaging: 570. Field N2O net: 3,471. Total VM0042 = 7,008 tCO2e/yr. Start Phase 1 with ACM0022 only for simpler VVB approval, add VM0042 once fertiliser market uptake is proven.",
                           dotL:"N displaced: 1200 t x 0.65 ratio x 2.65 kgCO2e/kgN = 2,067\nP: 700 t x 0.85 x 0.65 = 387\nK: 1200 t x 0.95 x 0.45 = 513\nField N2O net = 3,471\nTotal = 7,008 tCO2e",
                           dotSrc:[{label:"Verra VM0042",url:"https://verra.org/methodologies/vm0042-improved-agricultural-land-management/"},{label:"IPCC 2019 Vol.4 Ch.11",url:"https://www.ipcc-nggip.iges.or.jp/public/2019rf/vol4.html"}]},
                        ].map(function(r,i){
                          return React.createElement("tr",{key:r.res,style:{borderBottom:"1px solid #ffffff08",background:i%2?"#ffffff03":"transparent"}},
                            React.createElement("td",{style:{...cs.td,fontWeight:800,color:r.color,whiteSpace:"nowrap",minWidth:90}},
                              r.res,
                              React.createElement(InfoDot,{color:r.color,summary:r.dotS,logic:r.dotL,sources:r.dotSrc})
                            ),
                            React.createElement("td",{style:{...cs.td,fontFamily:fm.mono,fontSize:9,color:cc.tealLt,whiteSpace:"nowrap"}},r.code),
                            React.createElement("td",{style:{...cs.td,fontFamily:fm.mono,fontWeight:800,color:cc.white}},r.doc),
                            React.createElement("td",{style:{...cs.td,fontFamily:fm.mono,color:r.mcf==="N/A"?cc.red:cc.amberLt,fontSize:9,whiteSpace:"pre-line"}},r.mcf),
                            React.createElement("td",{style:{...cs.td,fontFamily:fm.mono,fontWeight:800,color:r.color}},r.tco2),
                            React.createElement("td",{style:cs.td},React.createElement("span",{style:cs.bdg(r.when==="Always"?cc.green:r.when==="Never"?cc.red:r.when.includes("Phase")?cc.amberLt:cc.grey)},r.when)),
                            React.createElement("td",{style:{...cs.td,fontSize:9,color:"#a0b8d0",maxWidth:140}},r.note)
                          );
                        })}
                      </tbody>
                    </table>
                    </div>
                    <div style={{fontSize:9,color:cc.grey,marginTop:5}}>* tCO2e/yr at 60 TPH mill. GWP100=28. Source: Verra ACM0022, IPCC AR5/AR6, CFI Carbon Assessment Oct 2025.</div>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:11,marginBottom:11}}>
                    <div style={{...cs.card,border:"1px solid "+cc.amberLt+"44"}}>
                      <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:8}}>
                        <div style={cs.h2(cc.amberLt)}>N2O Avoidance — Process Level</div>
                        <InfoDot color={cc.amberLt}
                          summary="BSF bioconversion suppresses N2O vs composting. Rapid 12-14 day processing + N assimilation into larvae prevents nitrification/denitrification hotspots."
                          logic={"Direct N2O: 480 t N/yr x 0.01 x (44/28) x 298 = 1,430 tCO2e\nIndirect NH3: 72 t N avoided x 0.01 x (44/28) x 298 = 338 tCO2e\nTotal = 1,768 tCO2e/yr"}
                          sources={[{label:"IPCC 2019 Refinement Vol.5 Ch.4",url:"https://www.ipcc-nggip.iges.or.jp/public/2019rf/vol5.html"},{label:"Salomone et al. 2017 BSF LCA",url:"https://doi.org/10.1016/j.jclepro.2016.09.214"}]}
                        />
                      </div>
                      {[{l:"Direct N2O avoided",v:"1,430 tCO2e/yr",c:cc.amberLt},{l:"Indirect NH3 to N2O",v:"338 tCO2e/yr",c:"#FFD080"},{l:"Total N2O credits",v:"1,768 tCO2e/yr",c:cc.amberLt,big:true}].map(function(k){
                        return React.createElement("div",{key:k.l,style:{background:"#1a3360",borderRadius:5,padding:"6px 9px",marginBottom:5,gridColumn:k.big?"span 2":"auto"}},
                          React.createElement("div",{style:{fontSize:9,color:cc.grey,marginBottom:2}},k.l),
                          React.createElement("div",{style:{fontFamily:fm.mono,fontWeight:800,color:k.c,fontSize:k.big?13:11}},k.v)
                        );
                      })}
                      <div style={{marginTop:6,background:"#0f1d35",borderRadius:4,padding:"4px 8px",fontSize:9,color:"#a0b8d0"}}>Included in ACM0022 project emissions. Verra Vol.5 Ch.4.</div>
                    </div>
                    <div style={{...cs.card,border:"1px solid "+cc.green+"44"}}>
                      <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:8}}>
                        <div style={cs.h2(cc.green)}>Fertiliser Displacement — VM0042</div>
                        <InfoDot color={cc.green}
                          summary="CFI frass displaces synthetic NPK. Credits under VM0042 for avoided Haber-Bosch manufacturing, shipping from Middle East/China to Indonesia, and reduced field N2O from slow-release organic N vs synthetic broadcast."
                          logic={"N displaced (0.65 ratio): 2,067 tCO2e\nP displaced (0.85 ratio): 387 tCO2e\nK displaced (0.95 ratio): 513 tCO2e\nTransport: 570 tCO2e\nField N2O net: 3,471 tCO2e\nTOTAL VM0042 = 7,008 tCO2e/yr"}
                          sources={[{label:"Verra VM0042",url:"https://verra.org/methodologies/vm0042-improved-agricultural-land-management/"},{label:"IPCC 2019 Vol.4 Ch.11",url:"https://www.ipcc-nggip.iges.or.jp/public/2019rf/vol4.html"}]}
                        />
                      </div>
                      {[{l:"Manufacturing N+P+K",v:"2,967 tCO2e/yr",c:cc.green},{l:"Transport + packaging",v:"570 tCO2e/yr",c:"#5eead4"},{l:"Field N2O avoided (net)",v:"3,471 tCO2e/yr",c:cc.green},{l:"VM0042 subtotal",v:"7,008 tCO2e/yr",c:cc.green,big:true}].map(function(k){
                        return React.createElement("div",{key:k.l,style:{background:"#1a3360",borderRadius:5,padding:"6px 9px",marginBottom:5}},
                          React.createElement("div",{style:{fontSize:9,color:cc.grey,marginBottom:2}},k.l),
                          React.createElement("div",{style:{fontFamily:fm.mono,fontWeight:800,color:k.c,fontSize:k.big?13:11}},k.v)
                        );
                      })}
                      <div style={{marginTop:6,background:"#0f1d35",borderRadius:4,padding:"4px 8px",fontSize:9,color:cc.amberLt}}>Phase 2 add-on. Phase 1 = ACM0022 only for faster VVB approval.</div>
                    </div>
                  </div>
                  <div style={{...cs.card,background:"linear-gradient(135deg,#0b2a1a,#0b1929)"}}>
                    <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:8}}>
                      <div style={cs.h2(cc.green)}>Consolidated Credit Summary — Full Value Chain</div>
                      <InfoDot color={cc.green}
                        summary="Combined ACM0022 + VM0042 = 159,976 tCO2e/yr. Conservative 80% claim = 127,981 for VVB buffer. At insetting price $50-120/t = $6.4M-$15.4M/yr. 10-year NPV conservative = $64M."
                        logic={"ACM0022 = 152,968\nVM0042 = 7,008\nGrand total = 159,976\nConservative 80% = 127,981"}
                        sources={[{label:"CFI Carbon Assessment Oct 2025",url:"#"},{label:"Verra ACM0022",url:"https://verra.org/methodologies/acm0022-alternative-waste-treatment-processes/"}]}
                      />
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:9,marginBottom:9}}>
                      {[{l:"ACM0022 subtotal",v:"152,968",c:cc.tealLt},{l:"VM0042 (Yr4+)",v:"7,008",c:cc.green},{l:"Grand total",v:"159,976",c:cc.green},{l:"Conservative (80%)",v:"127,981",c:cc.amberLt}].map(function(k){
                        return React.createElement("div",{key:k.l,style:{textAlign:"center",background:"#0f1d35",borderRadius:6,padding:"9px 7px"}},
                          React.createElement("div",{style:{fontSize:9,color:cc.grey,marginBottom:3}},k.l),
                          React.createElement("div",{style:{fontFamily:fm.mono,fontWeight:800,color:k.c,fontSize:13}},k.v),
                          React.createElement("div",{style:{fontSize:9,color:"#7090b0"}}, "tCO2e/yr")
                        );
                      })}
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:9}}>
                      {[{sc:"Low $15/t",rev:"$1.9M",c:cc.grey,note:"Voluntary offset floor"},{sc:"Mid $50/t insetting",rev:"$6.4M",c:cc.tealLt,note:"CSRD Scope 3 baseline"},{sc:"Premium $120/t insetting",rev:"$15.4M",c:cc.amberLt,note:"FMCG shadow carbon price"}].map(function(x){
                        return React.createElement("div",{key:x.sc,style:{background:"#1a3360",borderRadius:6,padding:"9px 11px",textAlign:"center"}},
                          React.createElement("div",{style:{fontSize:9,color:x.c,fontWeight:800,marginBottom:3}},x.sc),
                          React.createElement("div",{style:{fontFamily:fm.mono,fontWeight:800,color:x.c,fontSize:15}},x.rev),
                          React.createElement("div",{style:{fontSize:8,color:"#7090b0",marginTop:3}},x.note)
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* ══════════════ BUYERS TAB ══════════════ */}
              {ccTab==="buy" && (
                <div>
                  <div style={cs.card}>
                    <div style={cs.h2()}>🎯 Carbon Credit Buyer Landscape</div>
                    <div style={{fontSize:10,color:"#d8e8f8",lineHeight:1.6,marginBottom:8}}>ACM0022/AMS-III.H + VM0041 dual methodology opens every buyer tier. Insetting commands 2–5× market price under mandatory CSRD Scope 3.</div>
                    <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{[{t:"PRIMARY",c:cc.tealLt},{t:"STRATEGIC",c:cc.gold},{t:"SECONDARY",c:cc.grey}].map(x=><span key={x.t} style={cs.bdg(x.c)}>{x.t}</span>)}</div>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>
                    {BUYERS_CC.map(b=>(
                      <div key={b.name} style={{...cs.card,borderColor:b.tier==="strategic"?b.color+"55":"#2a4070"}}>
                        <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:5}}>
                          <span style={{fontSize:18}}>{b.logo}</span>
                          <div>
                            <div style={{fontWeight:800,fontSize:12,color:cc.white}}>{b.name}</div>
                            <span style={cs.bdg(b.tier==="primary"?cc.tealLt:b.tier==="strategic"?cc.gold:cc.grey)}>{b.tier.toUpperCase()}</span>
                          </div>
                          <div style={{marginLeft:"auto",textAlign:"right"}}>
                            <div style={{fontFamily:fm.mono,fontWeight:800,color:b.color,fontSize:12}}>{b.price}</div>
                            <div style={{fontSize:9,color:"#c8d8f0"}}>per tCO₂e</div>
                          </div>
                        </div>
                        <hr style={{border:"none",borderTop:"1px solid #2a4070",margin:"5px 0"}}/>
                        <div style={{fontSize:9,display:"grid",gridTemplateColumns:"auto 1fr",gap:"3px 7px"}}>
                          <span style={{color:cc.grey}}>Focus:</span><span style={{color:"#d8e8f8"}}>{b.focus}</span>
                          <span style={{color:cc.grey}}>Advance:</span><span style={{color:cc.amberLt,fontWeight:700}}>{b.advance}</span>
                          <span style={{color:cc.grey}}>Standard:</span><span style={{color:"#d8e8f8"}}>{b.standard}</span>
                        </div>
                        <div style={{marginTop:5,background:"#0f1d35",borderRadius:4,padding:"4px 7px",fontSize:9,color:cc.tealLt}}>✓ {b.fit}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ══════════════ INSETTING TAB v21 ══════════════ */}
              {ccTab==="ins" && (
                <div>
                  {/* What is insetting */}
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:11,marginBottom:11}}>
                    <div style={{...cs.cG,border:"1px solid "+cc.greenLt+"44"}}>
                      <div style={cs.h2(cc.greenLt)}>INSETTING — Inside Your Value Chain</div>
                      <div style={{fontSize:10,color:"#e8f0fa",lineHeight:1.7,marginBottom:8}}>Emission reductions inside your own supply chain — fully traceable to your specific footprint. FMCG brands co-finance mill and farm upgrades in exchange for auditable Scope 3 reductions.</div>
                      <div style={{fontSize:9,display:"grid",gridTemplateColumns:"auto 1fr",gap:"4px 8px"}}>
                        <span style={{color:cc.greenLt,fontWeight:700}}>CSRD/ESRS E1:</span><span style={{color:"#d8e8f8"}}>Counts toward Scope 3 Cat.1. Paras 56-58.</span>
                        <span style={{color:cc.greenLt,fontWeight:700}}>SBTi FLAG:</span><span style={{color:"#d8e8f8"}}>Counts toward 90% reduction goal. Palm = FLAG.</span>
                        <span style={{color:cc.greenLt,fontWeight:700}}>EUDR 2025:</span><span style={{color:"#d8e8f8"}}>CFI MRV supports deforestation-free traceability.</span>
                      </div>
                      <div style={{marginTop:8,padding:"6px 9px",background:"#0f1d35",borderRadius:5,fontSize:9}}>
                        <span style={{color:cc.greenLt,fontWeight:800}}>Price range: $50-$120/tCO2e</span>
                        <span style={{color:"#a0b8d0"}}> vs $10-30/t voluntary offset market. FMCG shadow carbon = $75-120/t internal. CFI at $50-120/t = same asset class as internal shadow price.</span>
                      </div>
                    </div>
                    <div style={{...cs.card,border:"1px solid "+cc.red+"33"}}>
                      <div style={cs.h2(cc.grey)}>OFFSETTING — Outside Value Chain</div>
                      <div style={{fontSize:10,color:"#e8f0fa",lineHeight:1.7,marginBottom:8}}>Credits purchased from unrelated projects. No link to how products are actually made.</div>
                      <div style={{fontSize:9,display:"grid",gridTemplateColumns:"auto 1fr",gap:"4px 8px"}}>
                        <span style={{color:cc.red,fontWeight:700}}>CSRD:</span><span style={{color:"#d8e8f8"}}>Cannot count toward Scope 3 targets.</span>
                        <span style={{color:cc.red,fontWeight:700}}>EU Green Claims:</span><span style={{color:"#d8e8f8"}}>"Carbon neutral" offset claims banned EU 2026.</span>
                        <span style={{color:cc.red,fontWeight:700}}>SBTi:</span><span style={{color:"#d8e8f8"}}>10% residual cap only — last resort.</span>
                      </div>
                      <div style={{marginTop:8,padding:"6px 9px",background:"#0f1d35",borderRadius:5,fontSize:9,color:cc.amberLt}}>Price: $10-30/t. Greenwashing scrutiny rising. CSRD phase-in 2024-2028 makes this increasingly worthless for Scope 3 compliance.</div>
                    </div>
                  </div>

                  {/* Scope 3 anatomy */}
                  <div style={cs.cD}>
                    <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:9}}>
                      <div style={cs.h2(cc.gold)}>Why FMCG Companies Need Insetting — Scope 3 Anatomy</div>
                      <InfoDot color={cc.gold}
                        summary="Food and beverage companies have 90-99% of their GHG footprint in Scope 3, mostly Category 1 Purchased Goods (fertiliser, feed, ingredients including palm oil). Regulations like CSRD/ESRS E1 make Scope 3 reporting mandatory and push insetting as the preferred route."
                        logic={"Scope 3 Cat.1 = upstream purchased goods\nPalm oil processing = major emission source\nInsetting at mill level directly reduces Cat.1\nRequired by CSRD from 2027-2028 reporting years"}
                        sources={[{label:"CSRD ESRS E1 Scope 3",url:"https://www.klim.eco/en/companies/blog/csrd-scope3"},{label:"SBTi FLAG Guidance",url:"https://sciencebasedtargets.org/sectors/forest-land-and-agriculture"}]}
                      />
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:9}}>
                      {[
                        {icon:"",t:"Scope 3 Cat.1",b:"Purchased goods & services — palm oil processing = direct hit. CFI reduces this at source."},
                        {icon:"",t:"CSRD/ESRS 2027",b:"Mandatory audited Scope 3 reporting. Brands need farm-level primary data not secondary averages."},
                        {icon:"🎯",t:"SBTi FLAG",b:"Forest, Land & Agriculture targets. Palm buyers must set and hit FLAG. Insetting counts toward 90% reduction."},
                        {icon:"",t:"EUDR 2025",b:"Deforestation-free proof required for EU market access. CFI MRV produces geolocation traceability data."},
                      ].map(function(x){
                        return React.createElement("div",{key:x.t,style:{background:"#1a3360",borderRadius:6,padding:"9px 11px",border:"1px solid "+cc.gold+"22"}},
                          React.createElement("div",{style:{fontSize:16,marginBottom:5}},x.icon),
                          React.createElement("div",{style:{fontWeight:800,color:cc.gold,fontSize:10,marginBottom:4}},x.t),
                          React.createElement("div",{style:{fontSize:9,color:"#c8d8f0",lineHeight:1.6}},x.b)
                        );
                      })}
                    </div>
                  </div>

                  {/* Company emissions table */}
                  <div style={cs.card}>
                    <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:9}}>
                      <div style={cs.h2()}>Major Palm Buyers — Scope 3 Emissions and CFI Opportunity</div>
                      <InfoDot color={cc.tealLt}
                        summary="Top 7 FMCG palm buyers = 2.0M tCO2e from Indonesian palm alone. All have SBTi or net-zero commitments with FLAG targets. Combined sustainability budgets exceed $6.75B. Insetting = the mechanism that turns these budgets into CFI co-investment."
                        logic={"Emissions = Indonesian volume x 2.20 tCO2e/t\n(2024 LCA baseline for Indonesian refined palm)\nCFI opp = Indonesian emissions x insetting fit %"}
                        sources={[{label:"RSPO Annual Review 2024",url:"https://rspo.org/publications/"},{label:"SBTi FLAG Guidance",url:"https://sciencebasedtargets.org/sectors/forest-land-and-agriculture"}]}
                      />
                    </div>
                    <table style={{width:"100%",borderCollapse:"collapse",fontSize:10}}>
                      <thead>
                        <tr style={{background:C.infoSectionBg,borderBottom:"2px solid "+cc.tealLt+"44"}}>
                          {["Company","Palm (ID, t)","Scope 3 (tCO2e)","Net-Zero","Budget","Strategy","CFI Fit"].map(function(h){
                            return React.createElement("th",{key:h,style:{...cs.th,textAlign:"left",padding:"7px 8px",color:cc.tealLt}},h);
                          })}
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          {co:"Nestle",palm:"160,000",s3:"352,000",nz:"2050",bud:"CHF 1.2B",strat:"Regen ag CHF1.2B; EFB composting in roadmap; Aceh Hub",fit:"HIGHEST",fc:cc.green,
                           dotS:"Nestle has 352,000 tCO2e from Indonesian palm alone. Net-zero roadmap explicitly cites EFB composting and organic fertiliser as emission reduction levers. CHF 1.2B committed to regen agriculture by 2025. CFI sits directly in their roadmap.",
                           dotL:"Aceh Hub (Nestle+Musim Mas+AAK) = $1-3M over 5 years. CFI co-investment potential = $400K-1M/yr facility + $50-100K/yr fertiliser subsidy.",
                           dotSrc:[{label:"Nestle Net-Zero Roadmap",url:"https://www.nestle.com/sustainability/climate-change/zero-environmental-impact"}]},
                          {co:"Unilever",palm:"260,000",s3:"572,000",nz:"2039",bud:"EUR 1B",strat:"1-1.5M ha regen by 2030; 36,000 smallholders mapped",fit:"HIGH",fc:cc.tealLt,
                           dotS:"Unilever = largest palm buyer at 753,000 t globally. 97.5% deforestation-free achieved 2024. Direct sourcing hubs in Indonesia. EUR 1B Climate and Nature Fund 2020-2030. 14,000 smallholders RSPO-certified.",
                           dotL:"Yield uplift 13-15% via training programs. CFI = mill waste valorisation that directly reduces their Cat.1 Scope 3.",
                           dotSrc:[{label:"Unilever Reimagining Landscapes",url:"https://www.unilever.com/files/946cb2af-4517-40f5-9069-b2101d432a63/unilever-reimagining-landscapes-report.pdf"}]},
                          {co:"PepsiCo",palm:"165,000",s3:"363,000",nz:"2040",bud:"$2.25B",strat:"Positive Agriculture; Riau POME biogas pilot (IDH)",fit:"HIGH",fc:cc.tealLt,
                           dotS:"PepsiCo $2.25B green bonds 2019-2022. IDH Aceh pilot on POME biogas. FLAG targets under development. BSF frass fits their regenerative agriculture purchasing strategy for Lay's etc.",
                           dotL:"Positive Agriculture covers 7M+ acres by 2030. Indonesian palm = 165,000 t = 363,000 tCO2e. CFI frass reduces their purchased-goods Cat.1.",
                           dotSrc:[{label:"PepsiCo Sustainability",url:"https://www.pepsico.com/our-impact/sustainability"}]},
                          {co:"Mondelez",palm:"135,000",s3:"297,000",nz:"2050",bud:"$1B",strat:"CocoaLife $1B 2012-2030; palm embedded in FLAG plan",fit:"MED",fc:cc.amberLt,
                           dotS:"Mondelez $1B Cocoa Life program. Palm embedded in FLAG commitments. 246,000 farms mapped. Scope 3 reductions need to show in purchased-goods category. CFI frass = direct substitution for synthetic NPK in their palm supply chain.",
                           dotL:"Cocoa Life = 6.7M trees, 220,000 farmers. Same logic applies to palm. Net-zero 2050 with SBTi-aligned pathway.",
                           dotSrc:[{label:"Mondelez Cocoa Life",url:"https://www.cocoalife.org"}]},
                          {co:"Ferrero",palm:"96,000",s3:"211,000",nz:"2050",bud:"N/D",strat:"Farming Values Framework; TRAILS Borneo; 100% traceable",fit:"MED",fc:cc.amberLt,
                           dotS:"Ferrero 100% RSPO-certified palm since 2015. TRAILS Borneo traceability project. Carbon neutral 2050. No disclosed sustainability budget but active since 2013. Nutella/Ferrero Rocher = high brand sensitivity to sustainability claims.",
                           dotL:"96,000 t Indonesian origin = 211,000 tCO2e. Traceability focus = high appetite for MRV-backed insetting.",
                           dotSrc:[{label:"Ferrero Sustainability",url:"https://www.ferrero.com/our-stories/sustainability"}]},
                          {co:"Danone",palm:"21,000",s3:"46,000",nz:"2050",bud:"N/D",strat:"Regen ag; carbon neutral; Activia/Alpro supply chain",fit:"LOW",fc:cc.grey,
                           dotS:"Danone smallest palm footprint of the top 7. Net-zero 2050. Regen agriculture focus for dairy and plant-based. Palm is smaller component but Activia/Alpro brands have high sustainability sensitivity.",
                           dotL:"21,000 t Indonesian origin = 46,000 tCO2e. Smaller but growing appetite for verified supply chain reductions.",
                           dotSrc:[{label:"Danone Sustainability",url:"https://www.danone.com/impact/planet/climate-change.html"}]},
                        ].map(function(r,i){
                          return React.createElement("tr",{key:r.co,style:{borderBottom:"1px solid #ffffff08",background:i%2?"#ffffff03":"transparent"}},
                            React.createElement("td",{style:{...cs.td,fontWeight:800,color:r.fc,whiteSpace:"nowrap"}},
                              r.co,
                              React.createElement(InfoDot,{color:r.fc,summary:r.dotS,logic:r.dotL,sources:r.dotSrc})
                            ),
                            React.createElement("td",{style:{...cs.td,fontFamily:fm.mono,color:"#d8e8f8"}},r.palm),
                            React.createElement("td",{style:{...cs.td,fontFamily:fm.mono,fontWeight:800,color:cc.red}},r.s3),
                            React.createElement("td",{style:cs.td},React.createElement("span",{style:cs.bdg(r.nz==="2039"?cc.green:r.nz==="2040"?cc.tealLt:cc.grey)},r.nz)),
                            React.createElement("td",{style:{...cs.td,fontSize:9,color:cc.amberLt,fontWeight:700}},r.bud),
                            React.createElement("td",{style:{...cs.td,fontSize:9,color:"#b0c8e0",maxWidth:150}},r.strat),
                            React.createElement("td",{style:cs.td},React.createElement("span",{style:cs.bdg(r.fc)},r.fit))
                          );
                        })}
                      </tbody>
                    </table>
                    <div style={{fontSize:9,color:cc.grey,marginTop:5}}>Scope 3 = Indonesian palm volume x 2.20 tCO2e/t (2024 LCA baseline). Budget = disclosed sustainability financial commitment.</div>
                  </div>

                  {/* Net-zero timeline */}
                  <div style={cs.card}>
                    <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:9}}>
                      <div style={cs.h2()}>Net-Zero Timelines and Regulatory Deadlines</div>
                      <InfoDot color={cc.amberLt}
                        summary="CSRD phase-in 2026-2028 makes insetting urgent. EUDR 2025 blocks EU market without deforestation-free proof. SBTi FLAG requires 72% reduction in forest/land/ag emissions by 2030 for 1.5C pathway."
                        logic={"CSRD: large cos 2024, listed SMEs 2026, non-EU 2027\nEUDR enforcement: large operators 2025, SMEs 2025/2026\nSBTi FLAG: 72% reduction by 2030 (1.5C pathway)\nInsetting = the fastest route to Cat.1 reduction proof"}
                        sources={[{label:"CSRD ESRS timeline",url:"https://www.klim.eco/en/companies/blog/csrd-scope3"},{label:"EUDR implementation",url:"https://environment.ec.europa.eu/topics/forests/deforestation/regulation-deforestation-free-products_en"}]}
                      />
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:9}}>
                      {[
                        {yr:"2025",ev:"EUDR Enforcement",d:"Palm oil to EU must be deforestation-free. CFI MRV = traceability proof.",c:cc.red},
                        {yr:"2026-27",ev:"CSRD Phase-in",d:"Mandatory Scope 3 Cat.1 disclosure. Insetting reduces Cat.1. Offsetting excluded.",c:cc.amberLt},
                        {yr:"2028",ev:"CSRD Full Scope",d:"Non-EU parent companies (Nestle, Unilever etc.) now in scope. Scope 3 must be audited.",c:cc.amberLt},
                        {yr:"2030",ev:"SBTi FLAG -72%",d:"FLAG-sector 72% emissions reduction required vs 2020 baseline. Palm buyers all in scope.",c:cc.tealLt},
                      ].map(function(x){
                        return React.createElement("div",{key:x.yr,style:{background:"#1a3360",borderRadius:6,padding:"10px 12px",border:"1px solid "+x.c+"33",textAlign:"center"}},
                          React.createElement("div",{style:{fontFamily:fm.mono,fontWeight:800,color:x.c,fontSize:15,marginBottom:3}},x.yr),
                          React.createElement("div",{style:{fontWeight:700,color:cc.white,fontSize:10,marginBottom:4}},x.ev),
                          React.createElement("div",{style:{fontSize:9,color:"#b0c8e0",lineHeight:1.6}},x.d)
                        );
                      })}
                    </div>
                  </div>

                  {/* CFI insetting pitch */}
                  <div style={{...cs.card,background:"linear-gradient(135deg,#0b1a2e,#0b2a1a)"}}>
                    <div style={cs.h2(cc.greenLt)}>CFI as FMCG Insetting Vehicle — The Offer</div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:9}}>
                      {[
                        {t:"What CFI Delivers",icon:"",pts:["152,968 tCO2e/yr avoided (ACM0022 verified)","Farm-level MRV data for CSRD Cat.1","EUDR-compatible traceability chain","Synthetic NPK reduction on estate land"]},
                        {t:"What FMCG Brand Gets",icon:"🎯",pts:["Scope 3 Cat.1 reduction — counts toward 90%","CSRD/ESRS E1 para 56-58 compliant","SBTi FLAG-eligible credits","Supply chain resilience + co-benefits"]},
                        {t:"Deal Structure",icon:"",pts:["Price: $50-120/tCO2e insetting premium","ERPA advance purchase = working capital","Co-investment: $400K-1M/yr (Nestle model)","10-yr commitment = $5-11M total"]},
                      ].map(function(x){
                        return React.createElement("div",{key:x.t,style:{background:"#1a3360",borderRadius:6,padding:"10px 12px"}},
                          React.createElement("div",{style:{display:"flex",alignItems:"center",gap:6,marginBottom:7}},
                            React.createElement("span",{style:{fontSize:16}},x.icon),
                            React.createElement("div",{style:{fontWeight:800,color:cc.greenLt,fontSize:10}},x.t)
                          ),
                          React.createElement("div",null, x.pts.map(function(p){
                            return React.createElement("div",{key:p,style:{display:"flex",gap:5,marginBottom:4,fontSize:9,color:"#d8e8f8"}},
                              React.createElement("span",{style:{color:cc.greenLt,marginTop:1}},"✓"),
                              React.createElement("span",null,p)
                            );
                          }))
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* ══════════════ NESTLÉ TAB v21 ══════════════ */}
              {ccTab==="nes" && (
                <div>
                  <div style={cs.cD}>
                    <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:9}}>
                      <div style={cs.h2(cc.gold)}>Nestle — The Arbitrage Logic</div>
                      <InfoDot color={cc.gold}
                        summary="Nestle buys 459,000 t palm/yr globally, 160,000 t from Indonesia. Scope 3 = 352,000 tCO2e Indonesian palm. Internal shadow carbon price $75-100/t. CFI insetting at $50-120/t sits BELOW Nestle's internal value = pure NPV for procurement team."
                        logic={"Nestle internal value: $75-100/t shadow carbon\nCFI ask: $50-120/t insetting\nArbitrage: $25-50/t savings vs internal cost\nCFI annual credits: 127,981 tCO2e (conservative)\nNestle annual revenue from credits: $6.4M-$15.4M"}
                        sources={[{label:"Nestle Net-Zero Roadmap",url:"https://www.nestle.com/sustainability/climate-change/zero-environmental-impact"},{label:"Nestle Aceh Hub",url:"https://www.nestle-cwa.com/en/nestl%C3%A9-support-transition-regenerative-foodsystem"}]}
                      />
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:9,marginBottom:9}}>
                      {[{l:"Total Emissions",v:"74.7M tCO2e/yr",c:"#bbc8de"},{l:"Scope 3 Share",v:"95.5%",sub:"71.4M tCO2e",c:cc.red},{l:"Palm Footprint (ID)",v:"352,000 tCO2e",c:cc.amberLt}].map(function(k){
                        return React.createElement("div",{key:k.l,style:{textAlign:"center",background:"#0f1d35",borderRadius:7,padding:9}},
                          React.createElement("div",{style:{fontSize:9,color:cc.grey,marginBottom:3}},k.l),
                          React.createElement("div",{style:{fontFamily:fm.mono,fontWeight:800,color:k.c,fontSize:12}},k.v),
                          k.sub&&React.createElement("div",{style:{fontSize:9,color:"#b0c0d8"}},k.sub)
                        );
                      })}
                    </div>
                    <div style={{background:"#0f1d35",borderRadius:7,padding:9,marginBottom:9}}>
                      {[["Scope 3 — Supply Chain",95.5,cc.red],["Scope 1 — Direct Ops",2.8,cc.amberLt],["Scope 2 — Energy",1.7,"#bbc8de"]].map(function(arr){
                        var l=arr[0],p=arr[1],c=arr[2];
                        return React.createElement("div",{key:l,style:{marginBottom:6}},
                          React.createElement("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:2}},
                            React.createElement("span",{style:{fontSize:9,color:"#c8d8f0"}},l),
                            React.createElement("span",{style:{fontFamily:fm.mono,fontWeight:800,color:c,fontSize:10}},p+"%")
                          ),
                          React.createElement("div",{style:{background:"#1a3360",borderRadius:3,height:7}},
                            React.createElement("div",{style:{background:"linear-gradient(90deg,"+c+","+c+"88)",width:p+"%",height:"100%",borderRadius:3}})
                          )
                        );
                      })}
                      <div style={{fontSize:9,color:"#c8d8f0",fontStyle:"italic",marginTop:5}}>
                        {React.createElement("strong",{style:{color:cc.tealLt}},"CFI insetting at $50-120/t sits below Nestle's $75-100/t internal shadow price — a financial NPV argument, not just ESG.")}
                      </div>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>
                      {[
                        {l:"CFI INSETTING PRICE TO NESTLE",v:"$50-120/t",c:cc.tealLt,n:"Scope 3 Cat.1 compliant. EUDR MRV proof. SBTi FLAG eligible. ERPA structured advance purchase."},
                        {l:"NESTLE INTERNAL SHADOW PRICE",v:"$75-100/t",c:cc.gold,n:"Internal shadow price $75-100/t. EU CBAM exposure pushes to $80-120. CFI at $50/t = $25-50/t pure NPV."},
                      ].map(function(x){
                        return React.createElement("div",{key:x.l,style:{background:"#0f1d35",borderRadius:7,padding:12,border:"1px solid "+x.c+"44",textAlign:"center"}},
                          React.createElement("div",{style:{fontSize:9,color:x.c,fontWeight:800,marginBottom:4,lineHeight:1.5,textTransform:"uppercase",letterSpacing:"0.04em"}},x.l),
                          React.createElement("div",{style:cs.big(x.c)},x.v),
                          React.createElement("div",{style:{fontSize:9,color:"#c8d8f0",marginTop:6,lineHeight:1.6}},x.n)
                        );
                      })}
                    </div>
                  </div>
                  <div style={cs.card}>
                    <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:9}}>
                      <div style={cs.h2()}>Major Palm Buyers — Scope 3 Exposure</div>
                      <InfoDot color={cc.tealLt}
                        summary="Top FMCG palm buyers combined = 2.0M tCO2e from Indonesian palm. All committed to SBTi or net-zero. Combined sustainability budgets exceed $6.75B. CFI insetting = Scope 3 Cat.1 reduction for Category 1 Purchased Goods."
                        logic={"Scope 3 = Indonesian volume x 2.20 tCO2e/t\nCFI opportunity = supplying mill with insetting credits\nInsetting price $50-120/t vs $10-30/t voluntary market"}
                        sources={[{label:"RSPO 2024 Annual Review",url:"https://rspo.org"},{label:"SBTi FLAG",url:"https://sciencebasedtargets.org/sectors/forest-land-and-agriculture"}]}
                      />
                    </div>
                    <table style={{width:"100%",borderCollapse:"collapse",fontSize:10}}>
                      <thead><tr style={{borderBottom:"1px solid #2a4070",background:C.infoSectionBg}}>{["Company","Total","Scope 3","S3%","Palm ID (t)","CFI Opp."].map(function(h){return React.createElement("th",{key:h,style:{...cs.th,textAlign:"left",padding:"7px 8px"}},h);})}</tr></thead>
                      <tbody>
                        {SC3_CC.map(function(r,i){
                          return React.createElement("tr",{key:r.name,style:{borderBottom:"1px solid #ffffff06",background:i%2?"#ffffff03":"transparent"}},
                            React.createElement("td",{style:{...cs.td,color:cc.white,fontWeight:700}},r.name),
                            React.createElement("td",{style:{...cs.td,fontFamily:fm.mono,color:"#bbc8de"}},r.total),
                            React.createElement("td",{style:{...cs.td,fontFamily:fm.mono,color:cc.red}},r.s3),
                            React.createElement("td",{style:cs.td},
                              React.createElement("div",{style:{display:"flex",alignItems:"center",gap:4}},
                                React.createElement("div",{style:{flex:1,background:"#1a3360",borderRadius:2,height:6}},
                                  React.createElement("div",{style:{background:cc.red,width:r.pct+"%",height:"100%",borderRadius:2}})
                                ),
                                React.createElement("span",{style:{fontFamily:fm.mono,fontWeight:800,color:cc.red,fontSize:10}},r.pct+"%")
                              )
                            ),
                            React.createElement("td",{style:{...cs.td,fontFamily:fm.mono,color:cc.amberLt}},r.palm),
                            React.createElement("td",{style:cs.td},React.createElement("span",{style:cs.bdg(cc.tealLt)},"S3 Cat.1 Insetting"))
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>
          );
        })()}

        {/* ════════════════════ S U M M A R Y ════════════════════ */}
        {stage===9 && (
           <div>
            <CFI_SoilAcidity_ProfileCard />
            <div style={S.card}>
              <SectionHdr icon="" title="CFI PROJECT SUMMARY — ALL STAGES" color={C.teal}/>
              <div style={{display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:16}}>
                <KPI label="Mill Capacity" value={s0.ffbCapacity+" TPH"} unit={`${s0.utilisation}% utilisation`} color={C.teal}/>
                <KPI label="Monthly FFB" value={monthFFB.toLocaleString()+" t"} unit="/month"/>
                <KPI label="EFB Monthly" value={efbMonthWet.toLocaleString()+" t"} unit="wet/month" color={C.amber}/>
                <KPI label="Blended Substrate" value={s1_blendWet.toLocaleString()+" t"} unit="FW/month → S3" color={C.green}/>
                <KPI label="Monthly Bio Cost" value={"$"+s3_monthlyCost.toLocaleString()} unit="/month (biologicals)" color={C.amber}/>
                <KPI label="Monthly Revenue" value={"$"+rev_total.toLocaleString()} unit="/month (all products)" color={C.green}/>
                <KPI label="Annual Revenue" value={"$"+rev_annual.toLocaleString()} unit="/year" color={C.green}/>
                <KPI label="EBITDA" value={"$"+ebitda.toLocaleString()} unit="/year" color={ebitda>0?C.green:C.red}/>
                <KPI label="Payback" value={payback_years ? payback_years+" yrs" : "N/A"} unit="years" color={payback_years&&payback_years<5?C.green:C.amber}/>
              </div>

              <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(130px, 1fr))", gap:10}}>
                {[
                  {stage:"S0",label:"Site Inputs",  status: s0.plantName ? " Complete" : " Pending", color: s0.plantName ? C.green : C.amber},
                  {stage:"S1",label:"Pre-Processing",status:" Complete", color:C.green},
                  {stage:"S2",label:"Chemical",      status: s2.pksa ? " PKSA Active" : " No PKSA", color: s2.pksa ? C.green : C.amber},
                  {stage:"S3",label:"Biologicals",   status: allPass ? " BSF Approved" : "⏳ Monitoring", color: allPass ? C.green : C.teal},
                  {stage:"S4",label:"BSF Rearing",    status: ` Day ${gd} · ${larvYieldPct}% yield`, color:C.teal},
                  {stage:"S5",label:s4.pathwayS5==="s5a"?"Extract Path":"Terminate Path", status: ` ${s4.pathwayS5.toUpperCase()} · $${s4.pathwayS5==="s5a"?s5a_NPKval:s5b_NPKval}/t FW`, color:C.green},
                  {stage:"S6",label:"Valuation",      status: ` $${rev_total.toLocaleString()}/month`, color:C.green},
                  {stage:"CO₂",label:"Carbon Credits", status: ` $${carbon_rev_annual.toLocaleString()}/yr`, color:C.amber},
                ].map(s=>(
                  <div key={s.stage} style={{background:C.inputSectionBg, borderRadius:8, padding:"14px",
                                              border:`1px solid ${s.color}33`, textAlign:"center"}}>
                    <div style={{color:s.color, fontWeight:900, fontSize:20}}>{s.stage}</div>
                    <div style={{color:C.white, fontWeight:700, fontSize:12, margin:"4px 0"}}>{s.label}</div>
                    <div style={S.badge(s.color)}>{s.status}</div>
                  </div>
                ))}
              </div>
              <hr style={S.divider}/>
              <div style={{fontSize:12, color:C.greyLt, lineHeight:2.0}}>
                <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 20px"}}>
                  <div><span style={{color:C.teal}}>Plantation:</span> {s0.plantName || "—"} | <span style={{color:C.teal}}>Mill:</span> {s0.millName || "—"}</div>
                  <div><span style={{color:C.teal}}>Soil:</span> {SOILS.find(s=>s.id===s0.soil)?.name} | <span style={{color:C.teal}}>AG:</span> {AG_TIERS.find(a=>a.id===s0.ag)?.name}</div>
                  <div><span style={{color:C.amber}}>Blend:</span> EFB {pctEFB}% + OPDC {pctOPDC}% (DM basis, natural yield) | MC {blendMC}% | C:N {blendCN||"—"}
                    {pomeActive && <span style={{color:C.blue}}> + POME Sludge {pomeSludgeInclTPD} t/day ({pomeSludgeInclPct}% WW, Fe: {pomeSludgeFeStatus})</span>}
                    {s0.pkeEnabled && <span style={{color:C.amber}}> + PKE {s0.pkeTPD} t/day</span>}
                  </div>
                  <div><span style={{color:C.amber}}>PKSA:</span> {s2.pksa ? `${s2.pksaDose} kg/t FW — ~${pksa_ligninRed}% lignin reduction` : "Not active"}</div>
                  <div><span style={{color:C.green}}>Biologicals:</span> One-Shot $0.65/t · Monthly ${s3_monthlyCost.toLocaleString()}</div>
                  <div><span style={{color:C.green}}>BSF Gate:</span> {allPass ? "All 6 pass — TRANSFER APPROVED" : "Awaiting measurements"}</div>
                  <div><span style={{color:C.red}}>RSPO:</span> {s0.rspo==="none"?"Not certified":`Status: ${s0.rspo}`}</div>
                  <div><span style={{color:C.red}}>Safety:</span> Bt ICBB 6095 {s3.bt_confirmed_absent?"confirmed absent ":" not confirmed"} | NaOH {s2.naoh?" ACTIVE":"safe"}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {stage===10 && (
          <OrchestrationTab uploadedConfigs={uploadedConfigs} setUploadedConfigs={setUploadedConfigs}/>
        )}
      </div>

      {/* ── VISITOR GATE MODAL ── */}
      {showGate && (
        <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.75)",
          display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999}}>
          <div style={{background:C.infoSectionBg,border:`2px solid ${C.teal}`,borderRadius:16,
            padding:32,maxWidth:420,width:"90%",boxShadow:"0 24px 64px rgba(0,0,0,0.5)"}}>
            <div style={{textAlign:"center",marginBottom:20}}>
              <div style={{fontSize:28,marginBottom:8}}></div>
              <div style={{color:C.teal,fontWeight:900,fontSize:16,letterSpacing:"0.06em",marginBottom:6}}>
                REGISTER TO CONTINUE
              </div>
              <div style={{color:C.grey,fontSize:12}}>
                {gateReason==="tabs"
                  ? "You've previewed "+FREE_TABS+" sections. Register free to access all 11 tabs."
                  : "You've used "+FREE_SEARCHES+" searches. Register free for unlimited access."}
              </div>
            </div>
            {!visSubmitted ? (
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                <input placeholder="Your Name *" value={visName} onChange={e=>setVisName(e.target.value)}
                  style={{background:C.pageBg,border:`1px solid ${C.teal}55`,borderRadius:8,
                    color:C.white,padding:"10px 14px",fontSize:13,outline:"none"}}/>
                <input placeholder="Email Address *" value={visEmail} onChange={e=>setVisEmail(e.target.value)}
                  style={{background:C.pageBg,border:`1px solid ${C.teal}55`,borderRadius:8,
                    color:C.white,padding:"10px 14px",fontSize:13,outline:"none"}}/>
                <input placeholder="Company / Organisation" value={visOrg} onChange={e=>setVisOrg(e.target.value)}
                  style={{background:C.pageBg,border:`1px solid ${C.teal}55`,borderRadius:8,
                    color:C.white,padding:"10px 14px",fontSize:13,outline:"none"}}/>
                <button onClick={submitGate}
                  style={{background:C.teal,color:C.pageBg,fontWeight:900,fontSize:14,border:"none",
                    borderRadius:8,padding:"12px 0",cursor:"pointer",marginTop:6,letterSpacing:"0.05em"}}>
                  REGISTER + UNLOCK FULL ACCESS
                </button>
                <div style={{textAlign:"center",color:C.grey,fontSize:10,marginTop:4}}>
                  No spam. Your data stays private.
                </div>
              </div>
            ) : (
              <div style={{textAlign:"center",color:C.green,fontWeight:800,fontSize:15,padding:20}}>
                 Thank you! Full access unlocked.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── FOOTER ── */}
      <div style={{textAlign:"center", color:C.grey, fontSize:10, marginTop:20, borderTop:`1px solid ${C.inputSectionBg}`, paddingTop:12}}>
        CFI Bioconversion System · S0→S6 + Carbon Credits · All 31 Chemicals · All 40 Organisms · Bt NOW ALLOWED (timing-critical) · IPCC FOD + COD Carbon Model · Nutrient Ledger S0→S6 · Orchestration Layer · Core: EFB OPDC POS · Additives: PKE PMF fronds CPO · Supabase LIVE · v26 — FIX-01→11 applied · NPK LOCKED: EFB N=0.85% P=0.30% K=2.0%; OPDC N=2.60% P=0.45% K=1.80%; PKE N=2.88% (feed ÷6.25); all high-yield estate sources
      </div>
    </div>
  );
}
