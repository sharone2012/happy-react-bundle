import { useState } from "react";

// ─── COLOUR TOKENS ──────────────────────────────────────────────────────────
const C = {
  navy:    "#0B1929",
  navyMid: "#0F2236",
  navyLt:  "#162E45",
  navyDk:  "#070F1A",
  teal:    "#00C9B1",
  tealDk:  "#009E8C",
  tealLt:  "#5EEADA",
  amber:   "#F5A623",
  amberLt: "#FFD080",
  red:     "#E84040",
  green:   "#3DCB7A",
  blue:    "#4A9EDB",
  purple:  "#9B59B6",
  white:   "#F0F4F8",
  grey:    "#8BA0B4",
  greyLt:  "#C4D3E0",
};

// ─── ATOMS ───────────────────────────────────────────────────────────────────

const LABEL = { display:"block", color:C.grey, fontSize:10, fontWeight:700,
  textTransform:"uppercase", letterSpacing:"0.09em", marginBottom:5 };

const Card = ({children,style={}}) => (
  <div style={{background:C.navyMid, border:"1px solid rgba(255,255,255,0.06)",
    borderRadius:10, padding:20, ...style}}>
    {children}
  </div>
);

const Divider = ({color}) => (
  <hr style={{border:"none", borderTop:`1px solid ${color||C.navyLt}`, margin:"14px 0"}}/>
);

const SectionHdr = ({icon, title, color=C.teal, sub}) => (
  <div style={{background:"#0D1F33", borderLeft:`3px solid ${color}`,
    borderRadius:8, padding:"11px 14px", marginBottom:14,
    display:"flex", alignItems:"center", gap:10}}>
    <span style={{fontSize:17, lineHeight:1}}>{icon}</span>
    <div>
      <div style={{color, fontWeight:800, fontSize:12, letterSpacing:"0.07em", textTransform:"uppercase"}}>{title}</div>
      {sub && <div style={{color:C.grey, fontSize:10, marginTop:2}}>{sub}</div>}
    </div>
  </div>
);

const Lbl = ({t, unit, unitColor}) => (
  <label style={LABEL}>
    {t}
    {unit && <span style={{color:unitColor||C.tealLt, marginLeft:5, fontSize:9, fontWeight:600, letterSpacing:"0.04em"}}>[{unit}]</span>}
  </label>
);

const BluField = ({label, unit, value, onChange, disabled, note}) => (
  <div>
    <Lbl t={label} unit={unit}/>
    <input
      style={{background: disabled?"#0A1820":"#142030",
        border:`1px solid ${disabled?C.teal+"30":C.teal+"55"}`,
        borderRadius:6, color: disabled?C.teal:C.white,
        padding:"8px 12px", fontSize:13, width:"100%", outline:"none",
        boxSizing:"border-box", cursor:disabled?"not-allowed":"text"}}
      value={value}
      onChange={e=>onChange&&onChange(e.target.value)}
      disabled={!!disabled}
    />
    {note && <div style={{color:C.grey, fontSize:10, marginTop:3}}>{note}</div>}
  </div>
);

const AmbField = ({label, unit, value, onChange, note}) => (
  <div>
    <Lbl t={label} unit={unit} unitColor={C.amberLt}/>
    <input
      style={{background:"#1E1608", border:`1px solid ${C.amber}55`,
        borderRadius:6, color:C.amberLt,
        padding:"8px 12px", fontSize:13, width:"100%", outline:"none", boxSizing:"border-box"}}
      value={value}
      onChange={e=>onChange&&onChange(e.target.value)}
    />
    {note && (
      <div style={{color:C.amber+"bb", fontSize:10, marginTop:3, display:"flex", alignItems:"center", gap:4}}>
        <span>⚠</span><span>{note}</span>
      </div>
    )}
  </div>
);

const CalcField = ({label, unit, value, note}) => (
  <div>
    <Lbl t={label} unit={unit} unitColor={C.green+"99"}/>
    <div style={{background:"#0A1F12", border:`1px solid ${C.green}35`,
      borderRadius:6, color:C.green, padding:"8px 12px", fontSize:13,
      fontWeight:700, fontFamily:"'Courier New',monospace", letterSpacing:"0.02em"}}>
      {value}
    </div>
    {note && <div style={{color:C.green+"99", fontSize:10, marginTop:3}}>{note}</div>}
  </div>
);

const KPI = ({label, value, unit, color=C.teal}) => (
  <div style={{background:C.navyDk, border:`1px solid ${color}28`,
    borderTop:`2px solid ${color}`, borderRadius:8, padding:"14px 12px", textAlign:"center"}}>
    <div style={{color:C.grey, fontSize:9, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:6}}>{label}</div>
    <div style={{color, fontSize:20, fontWeight:900, letterSpacing:"-0.01em", lineHeight:1}}>{value}</div>
    {unit && <div style={{color:C.grey, fontSize:9, marginTop:5}}>{unit}</div>}
  </div>
);

const Badge = ({text, color}) => (
  <span style={{background:color+"20", border:`1px solid ${color}50`, borderRadius:10,
    padding:"2px 9px", color, fontSize:10, fontWeight:800, letterSpacing:"0.04em",
    display:"inline-block", whiteSpace:"nowrap"}}>
    {text}
  </span>
);

const Halt = ({msg}) => (
  <div style={{background:C.red+"18", border:`1px solid ${C.red}88`,
    borderLeft:`3px solid ${C.red}`, borderRadius:6, padding:"9px 13px",
    color:C.red, fontSize:12, fontWeight:700,
    display:"flex", alignItems:"center", gap:8, marginTop:8}}>
    <span style={{fontSize:15}}>🛑</span>
    <span>HALT — {msg}</span>
  </div>
);

const Warn = ({msg, type="warn"}) => {
  const col = type==="warn"?C.amber : type==="ok"?C.green : C.red;
  const icon = type==="warn"?"⚠" : type==="ok"?"✓" : "✕";
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

const SelectField = ({label, value, onChange, options}) => (
  <div>
    <Lbl t={label}/>
    <select
      style={{background:"#142030", border:`1px solid ${C.teal}55`,
        borderRadius:6, color:C.white, padding:"8px 28px 8px 12px",
        fontSize:13, width:"100%", outline:"none", cursor:"pointer",
        appearance:"none",
        backgroundImage:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%2300C9B1'/%3E%3C/svg%3E\")",
        backgroundRepeat:"no-repeat", backgroundPosition:"right 10px center", boxSizing:"border-box"}}
      value={value}
      onChange={e=>onChange(e.target.value)}
    >
      {options.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}
    </select>
  </div>
);

const PillToggle = ({options, value, onChange, color=C.teal}) => (
  <div style={{display:"flex", background:C.navyDk, borderRadius:8, padding:3, gap:3}}>
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
    style={{background:active?C.teal+"18":C.navyDk,
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

// ─── DATA ────────────────────────────────────────────────────────────────────
const SOILS = [
  {id:"inceptisol", name:"Inceptisols",  pct:"39%", ph:"4.1", cec:"15.4", desc:"Best fertility, well-drained",       nAdj:-0.40, pAdj:-0.50},
  {id:"ultisol",    name:"Ultisols",     pct:"24%", ph:"4.5", cec:"8.2",  desc:"Clay-rich, acidic, low base sat.",  nAdj:0,     pAdj:0    },
  {id:"oxisol",     name:"Oxisols",      pct:"8%",  ph:"4.4", cec:"5.0",  desc:"Fe/Al oxides, low P retention",    nAdj:0.10,  pAdj:0.20 },
  {id:"histosol",   name:"Histosols",    pct:"7%",  ph:"3.8", cec:"35.0", desc:"Peat/organic, drainage issues",    nAdj:-0.80, pAdj:-0.70},
  {id:"spodosol",   name:"Spodosols",    pct:"22%", ph:"4.77",cec:"2.0",  desc:"Sandy, lowest fertility",          nAdj:0.20,  pAdj:0.15 },
];
const AG_TIERS = [
  {id:"vgam",      name:"VGAM — Very Good Agronomy Management", uplift:1.00},
  {id:"gam",       name:"GAM — Good Agronomy Management",       uplift:0.85},
  {id:"poor",      name:"Poor Management",                       uplift:0.65},
  {id:"abandoned", name:"Abandoned / Degraded",                  uplift:0.40},
];
const FE_COLOR = {LOW:C.green, MODERATE:C.teal, HIGH:C.amber, CRITICAL:C.red, Untested:C.grey};

// ═══════════════════════════════════════════════════════════════════════════
export default function S0InputPage() {
  const [s0,setS0] = useState({
    plantName:"", estateName:"", millName:"", district:"", province:"", estateArea:"", gpsCoords:"", rspo:"none",
    ffbCapacity:60, utilisation:85, hrsDay:24, daysMonth:30,
    efbPct:60, opdcPct:40, efbEnabled:true, opdcEnabled:true,
    efbMC:70, opdcMC:70,
    pomeSludgeEnabled:false, pomeSludgeMC:82, pomeSludgeDewatered:false,
    pomeSludgeFeResult:"", pomeSludgeInclPct:15,
    pkeEnabled:false, pkeTPD:5,
    soil:"ultisol", ag:"vgam",
    efbCapturePct:100, opdcCapturePct:100, pomeCapturePct:100,
    carbonPriceScenario:"mid", carbonPriceCustom:25,
  });
  const up = (k,v) => setS0(p=>({...p,[k]:v}));

  // ── DERIVED ─────────────────────────────────────────────────────────────
  const effFFB        = +(s0.ffbCapacity*(s0.utilisation/100)).toFixed(2);
  const monthFFB      = +(effFFB*s0.hrsDay*s0.daysMonth).toFixed(0);
  const efbTPH        = +(effFFB*0.225).toFixed(3);
  const efbTPD        = +(efbTPH*s0.hrsDay).toFixed(1);
  const efbMonthWet   = +(efbTPD*s0.daysMonth).toFixed(0);
  const efbDMpd       = +(efbTPD*((100-s0.efbMC)/100)).toFixed(1);
  const opdcNatTPD    = +(efbTPD*0.152).toFixed(2);
  const opdcNatDM     = +(opdcNatTPD*((100-s0.opdcMC)/100)).toFixed(2);
  const opdcMonthWet  = +(opdcNatTPD*s0.daysMonth).toFixed(0);
  const blendTotal    = +s0.efbPct + +s0.opdcPct;
  const blendOK       = Math.abs(blendTotal-100) < 0.5;
  const opdcDMreq     = +(efbDMpd*(s0.opdcPct/s0.efbPct)).toFixed(1);
  const opdcShortfall = +(opdcDMreq-opdcNatDM).toFixed(1);
  const s1_blendDM    = +(efbDMpd*s0.daysMonth+opdcDMreq*s0.daysMonth).toFixed(0);
  const blendWetPerDM = (s0.efbPct/100)/((100-s0.efbMC)/100) + (s0.opdcPct/100)/((100-s0.opdcMC)/100);
  const blendMC       = +(100*(1-1/blendWetPerDM)).toFixed(1);
  const s1_blendWet   = +(s1_blendDM/((100-blendMC)/100)).toFixed(0);

  const pomeSludgeNatTPD  = +(effFFB*s0.hrsDay*0.0245).toFixed(1);
  const pomeMonthWet      = +(pomeSludgeNatTPD*s0.daysMonth).toFixed(0);
  const pomeSludgeActMC   = s0.pomeSludgeDewatered ? 65 : s0.pomeSludgeMC;
  const pomeSludgeDMfrac  = (100-pomeSludgeActMC)/100;
  const pomeSludgeDMpd    = +(pomeSludgeNatTPD*pomeSludgeDMfrac).toFixed(2);
  const pomeFe            = parseFloat(s0.pomeSludgeFeResult);
  const feStatus          = isNaN(pomeFe)?"Untested":pomeFe<3000?"LOW":pomeFe<5000?"MODERATE":pomeFe<8000?"HIGH":"CRITICAL";
  const pomeSludgeMaxPct  = isNaN(pomeFe)?15:pomeFe<3000?20:pomeFe<5000?15:pomeFe<8000?10:5;
  const inclPctCapped     = Math.min(+s0.pomeSludgeInclPct, pomeSludgeMaxPct);
  const pomeSludgeInclTPD = s0.pomeSludgeEnabled?+(pomeSludgeNatTPD*inclPctCapped/100).toFixed(1):0;
  const pomeSludgeInclDM  = +(pomeSludgeInclTPD*pomeSludgeDMfrac).toFixed(2);
  const pomeN = +(pomeSludgeInclDM*17.6).toFixed(1);
  const pomeP = +(pomeSludgeInclDM*4.0).toFixed(1);
  const pomeK = +(pomeSludgeInclDM*7.0).toFixed(1);

  const efbCapturedMonth  = +(efbMonthWet*(s0.efbCapturePct/100)).toFixed(0);
  const opdcCapturedMonth = +(opdcMonthWet*(s0.opdcCapturePct/100)).toFixed(0);
  const pomeCapturedMonth = +(pomeMonthWet*(s0.pomeCapturePct/100)).toFixed(0);

  const pkeDM   = s0.pkeEnabled?+(s0.pkeTPD*0.88).toFixed(1):0;
  const pkeN    = s0.pkeEnabled?+(pkeDM*29).toFixed(1):0;
  const pkeCost = s0.pkeEnabled?+(+s0.pkeTPD*160).toFixed(0):0;

  const efbN=+(efbDMpd*7.6).toFixed(1), efbP=+(efbDMpd*1.5).toFixed(1), efbK=+(efbDMpd*9.4).toFixed(1);
  const opdcN=+(opdcDMreq*23.2).toFixed(1), opdcP=+(opdcDMreq*3.2).toFixed(1), opdcK=+(opdcDMreq*4.2).toFixed(1);
  const totN=+(+efbN + +opdcN + +pomeN + +pkeN).toFixed(1);
  const totP=+(+efbP + +opdcP + +pomeP).toFixed(1);
  const totK=+(+efbK + +opdcK + +pomeK).toFixed(1);

  const totalDMcn = efbDMpd+opdcDMreq+pomeSludgeInclDM+pkeDM;
  const blendCN = totalDMcn>0
    ? +((efbDMpd*60+opdcDMreq*20+pomeSludgeInclDM*15+pkeDM*15)/totalDMcn).toFixed(1)
    : null;

  const cprice = s0.carbonPriceScenario==="low"?15:s0.carbonPriceScenario==="high"?45:25;
  const co2est = +(monthFFB*0.225*0.3*(s0.efbCapturePct/100)*28/1000).toFixed(0);
  const co2annual = co2est*12;
  const carbRev = +(co2annual*cprice).toFixed(0);

  const soilObj = SOILS.find(s=>s.id===s0.soil)||SOILS[1];
  const siteOK  = s0.plantName&&s0.millName&&s0.district;

  const g2 = {display:"grid", gridTemplateColumns:"1fr 1fr", gap:12};
  const g3 = {display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12};
  const g4 = {display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:12};

  return (
    <div style={{background:C.navy, minHeight:"100vh", fontFamily:"'Inter','Segoe UI',system-ui,sans-serif", color:C.white}}>

      {/* ── STICKY HEADER BAR ── */}
      <div style={{background:C.navyDk, borderBottom:`1px solid ${C.teal}22`,
        padding:"13px 24px", display:"flex", alignItems:"center",
        justifyContent:"space-between", position:"sticky", top:0, zIndex:100}}>
        <div style={{display:"flex", alignItems:"center", gap:12}}>
          <div style={{background:C.teal+"22", border:`1px solid ${C.teal}55`,
            borderRadius:8, padding:"6px 14px", color:C.teal,
            fontWeight:900, fontSize:14, letterSpacing:"0.12em"}}>S0</div>
          <div>
            <div style={{color:C.white, fontWeight:800, fontSize:15}}>Input Parameters</div>
            <div style={{color:C.grey, fontSize:11}}>Site identity · Mill capacity · Residue streams · Soil profile</div>
          </div>
        </div>
        <div style={{display:"flex", alignItems:"center", gap:8, flexWrap:"wrap"}}>
          {siteOK
            ? <Badge text="✓ Site configured" color={C.green}/>
            : <Badge text="Site data incomplete" color={C.amber}/>}
          {blendOK
            ? <Badge text="✓ Blend valid" color={C.green}/>
            : <Badge text="Blend error" color={C.red}/>}
          <Badge text={"Soil: "+soilObj.name} color={C.teal}/>
          {blendCN && <Badge text={"C:N "+blendCN} color={blendCN<=25?C.green:blendCN<=35?C.amber:C.red}/>}
        </div>
      </div>

      {/* ── MAIN GRID ── */}
      <div style={{padding:"20px 24px", maxWidth:1400, margin:"0 auto"}}>

        {/* ── TWO-COLUMN ROW: left = A+B stacked · right = C+Soil/AG stacked ── */}
        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, alignItems:"start"}}>

          {/* ════ LEFT COLUMN ════ */}
          <div style={{display:"flex", flexDirection:"column", gap:16}}>

            {/* ── A: SITE IDENTITY ── */}
            <Card>
              {/* Header row: section hdr + ID code box right-aligned */}
              <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14}}>
                <div style={{background:"#0D1F33", borderLeft:`3px solid ${C.teal}`,
                  borderRadius:8, padding:"11px 14px", display:"flex", alignItems:"center", gap:10, flex:1}}>
                  <span style={{fontSize:17, lineHeight:1}}>🏭</span>
                  <div style={{color:C.teal, fontWeight:800, fontSize:12, letterSpacing:"0.07em", textTransform:"uppercase"}}>
                    A — ENTER YOUR DETAILS IN THE FIELDS BELOW
                  </div>
                </div>
                <div style={{marginLeft:12, flexShrink:0}}>
                  <div style={{color:C.grey, fontSize:9, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.09em", marginBottom:4, textAlign:"right"}}>ID Code</div>
                  <input
                    style={{background:"#142030", border:`1px solid ${C.teal}55`, borderRadius:6,
                      color:C.white, padding:"8px 12px", fontSize:13, width:90, outline:"none",
                      boxSizing:"border-box", textAlign:"center"}}
                    value={s0.idCode||""} onChange={e=>up("idCode",e.target.value)}
                    placeholder="Number"/>
                </div>
              </div>
              {/* Row 1 */}
              <div style={g2}>
                <div>
                  <input style={{background:"#142030", border:`1px solid ${C.teal}55`, borderRadius:6,
                    color:C.white, padding:"8px 12px", fontSize:13, width:"100%", outline:"none", boxSizing:"border-box"}}
                    value={s0.plantName} onChange={e=>up("plantName",e.target.value)}
                    placeholder="Plantation / Company Name"/>
                </div>
                <div>
                  <input style={{background:"#142030", border:`1px solid ${C.teal}55`, borderRadius:6,
                    color:C.white, padding:"8px 12px", fontSize:13, width:"100%", outline:"none", boxSizing:"border-box"}}
                    value={s0.millName} onChange={e=>up("millName",e.target.value)}
                    placeholder="Mill Name / Unit"/>
                </div>
              </div>
              {/* Row 2 */}
              <div style={{...g2, marginTop:10}}>
                <div>
                  <input style={{background:"#142030", border:`1px solid ${C.teal}55`, borderRadius:6,
                    color:C.white, padding:"8px 12px", fontSize:13, width:"100%", outline:"none", boxSizing:"border-box"}}
                    value={s0.district} onChange={e=>up("district",e.target.value)}
                    placeholder="District / Kabupaten"/>
                </div>
                <div>
                  <input style={{background:"#142030", border:`1px solid ${C.teal}55`, borderRadius:6,
                    color:C.white, padding:"8px 12px", fontSize:13, width:"100%", outline:"none", boxSizing:"border-box"}}
                    value={s0.province} onChange={e=>up("province",e.target.value)}
                    placeholder="Province"/>
                </div>
              </div>
              {/* Row 3 — Name + Email replacing RSPO row */}
              <div style={{...g2, marginTop:10}}>
                <div>
                  <input style={{background:"#142030", border:`1px solid ${C.teal}55`, borderRadius:6,
                    color:C.white, padding:"8px 12px", fontSize:13, width:"100%", outline:"none", boxSizing:"border-box"}}
                    value={s0.contactName||""} onChange={e=>up("contactName",e.target.value)}
                    placeholder="First &amp; Last Name"/>
                </div>
                <div>
                  <input style={{background:"#142030", border:`1px solid ${C.teal}55`, borderRadius:6,
                    color:C.white, padding:"8px 12px", fontSize:13, width:"100%", outline:"none", boxSizing:"border-box"}}
                    value={s0.contactEmail||""} onChange={e=>up("contactEmail",e.target.value)}
                    placeholder="Email &amp; Telephone"/>
                </div>
              </div>
              {/* RSPO hidden select kept for logic — no UI shown */}
            </Card>

            {/* ── B: MILL CAPACITY ── */}
            <Card>
              <SectionHdr icon="⚙" title="B — Oil Palm Mill Fresh Fruit Bunch Processing Capacity" color={C.teal}/>

              {/* 4 inputs: label LEFT of box, unit below label */}
              <div style={{display:"flex", gap:16, flexWrap:"wrap", alignItems:"flex-end"}}>
                {/* FFB Processing */}
                <div style={{display:"flex", alignItems:"center", gap:10}}>
                  <div style={{textAlign:"right", minWidth:90}}>
                    <div style={{color:C.grey, fontSize:11, fontWeight:700, letterSpacing:"0.04em"}}>FFB Processing</div>
                    <div style={{color:C.grey, fontSize:10, marginTop:2}}>Tons per Hour</div>
                  </div>
                  <input style={{background:"#142030", border:`1px solid ${C.teal}55`, borderRadius:6,
                    color:C.white, padding:"10px 12px", fontSize:16, fontWeight:700,
                    width:72, outline:"none", boxSizing:"border-box", textAlign:"center"}}
                    value={s0.ffbCapacity} onChange={e=>up("ffbCapacity",+e.target.value)}/>
                </div>
                {/* Capacity Utilisation */}
                <div style={{display:"flex", alignItems:"center", gap:10}}>
                  <div style={{textAlign:"right", minWidth:70}}>
                    <div style={{color:C.grey, fontSize:11, fontWeight:700, letterSpacing:"0.04em"}}>Capacity</div>
                    <div style={{color:C.grey, fontSize:10, marginTop:2}}>Utilisation %</div>
                  </div>
                  <div>
                    <input style={{background:"#142030", border:`1px solid ${C.teal}55`, borderRadius:6,
                      color:C.white, padding:"10px 12px", fontSize:16, fontWeight:700,
                      width:72, outline:"none", boxSizing:"border-box", textAlign:"center"}}
                      value={s0.utilisation} onChange={e=>up("utilisation",+e.target.value)}/>
                    <div style={{color:C.grey, fontSize:10, marginTop:3}}>Default 85%</div>
                  </div>
                </div>
                {/* Operating Hours */}
                <div style={{display:"flex", alignItems:"center", gap:10}}>
                  <div style={{textAlign:"right", minWidth:80}}>
                    <div style={{color:C.grey, fontSize:11, fontWeight:700, letterSpacing:"0.04em"}}>Operating</div>
                    <div style={{color:C.grey, fontSize:10, marginTop:2}}>Hours / Day</div>
                  </div>
                  <input style={{background:"#142030", border:`1px solid ${C.teal}55`, borderRadius:6,
                    color:C.white, padding:"10px 12px", fontSize:16, fontWeight:700,
                    width:72, outline:"none", boxSizing:"border-box", textAlign:"center"}}
                    value={s0.hrsDay} onChange={e=>up("hrsDay",+e.target.value)}/>
                </div>
                {/* Operating Days */}
                <div style={{display:"flex", alignItems:"center", gap:10}}>
                  <div style={{textAlign:"right", minWidth:80}}>
                    <div style={{color:C.grey, fontSize:11, fontWeight:700, letterSpacing:"0.04em"}}>Operating</div>
                    <div style={{color:C.grey, fontSize:10, marginTop:2}}>Days / Month</div>
                  </div>
                  <input style={{background:"#142030", border:`1px solid ${C.teal}55`, borderRadius:6,
                    color:C.white, padding:"10px 12px", fontSize:16, fontWeight:700,
                    width:72, outline:"none", boxSizing:"border-box", textAlign:"center"}}
                    value={s0.daysMonth} onChange={e=>up("daysMonth",+e.target.value)}/>
                </div>
              </div>

              <Divider/>
              <div style={g4}>
                <KPI label="Effective FFB" value={effFFB} unit="TPH" color={C.green}/>
                <KPI label="Monthly FFB" value={monthFFB.toLocaleString()} unit="t/month" color={C.green}/>
                <KPI label="EFB at Discharge" value={efbTPH} unit="TPH wet" color={C.teal}/>
                <KPI label="EFB Monthly" value={efbMonthWet.toLocaleString()} unit="t/month wet" color={C.teal}/>
              </div>
              <Divider/>

              {/* ── D: Residue capture % ── */}
              <div style={{borderLeft:`3px solid ${C.teal}`, background:"#0D1F33", borderRadius:6, padding:"8px 12px", marginTop:14, marginBottom:10}}>
                <span style={{color:C.teal, fontWeight:800, fontSize:12}}>D — Residue capture %</span>
              </div>
              <div style={{background:C.navyDk, borderRadius:8, padding:"14px 16px", marginBottom:10}}>
                <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12}}>
                  {[
                    {label:"EFB capture", key:"efbCapturePct", base:efbMonthWet, captured:efbCapturedMonth},
                    {label:"OPDC capture", key:"opdcCapturePct", base:opdcMonthWet, captured:opdcCapturedMonth},
                    {label:"POME capture", key:"pomeCapturePct", base:pomeMonthWet, captured:pomeCapturedMonth},
                  ].map(f=>(
                    <div key={f.key}>
                      <div style={{color:C.grey, fontSize:11, fontWeight:700, marginBottom:4}}>{f.label} <span style={{fontWeight:500}}>%</span></div>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={s0[f.key]}
                        onChange={e=>up(f.key, Math.min(100, Math.max(0, +e.target.value)))}
                        style={{background:"#142030", border:`1px solid ${C.teal}66`, borderRadius:6, color:C.white, padding:"8px 12px", fontSize:13, width:"100%", outline:"none", boxSizing:"border-box"}}
                      />
                      <div style={{color:C.grey, fontSize:10, marginTop:4}}>= {f.captured.toLocaleString()} t FW/mo</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, marginBottom:10}}>
                {[
                  {label:"EFB captured", value:efbCapturedMonth},
                  {label:"OPDC captured", value:opdcCapturedMonth},
                  {label:"POME captured", value:pomeCapturedMonth},
                ].map(r=>(
                  <div key={r.label}>
                    <div style={{color:C.amber, fontWeight:700, fontSize:14}}>{r.value.toLocaleString()}</div>
                    <div style={{color:C.grey, fontSize:10}}>{r.label} · t FW/mo</div>
                  </div>
                ))}
              </div>

              {/* ── E: CARBON CREDITS PREVIEW ── */}
              <div style={{background:C.navyDk, border:`1px solid rgba(255,255,255,0.08)`, borderRadius:8, padding:12}}>
                <div style={{marginBottom:6}}>
                  <div style={{color:C.greyLt, fontWeight:800, fontSize:11, letterSpacing:"0.05em"}}>
                    E — 🌿 Carbon Credits Preview
                  </div>
                  <div style={{color:C.grey, fontSize:10, marginTop:3}}>Full methodology available in the CO₂ tab</div>
                </div>
                <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:8}}>
                  {[
                    {l:"Monthly CO₂e",   v:co2est.toLocaleString()+" t",   c:C.green},
                    {l:"Annual CO₂e",    v:co2annual.toLocaleString()+" t", c:C.green},
                    {l:"Annual Revenue", v:"$"+carbRev.toLocaleString(),    c:C.amber},
                    {l:"Carbon Price",   v:"$"+cprice+"/t",                 c:C.amberLt},
                  ].map((k,i)=>(
                    <div key={i} style={{textAlign:"center", minWidth:0}}>
                      <div style={{color:C.grey, fontSize:9, textTransform:"uppercase", letterSpacing:"0.07em", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis"}}>{k.l}</div>
                      <div style={{color:k.c, fontSize:13, fontWeight:900, marginTop:4, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis"}}>{k.v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

          </div>{/* end LEFT COLUMN */}

          {/* ════ RIGHT COLUMN ════ */}
          <div style={{display:"flex", flexDirection:"column", gap:16}}>

            {/* ── C: RESIDUE SELECTION ── */}
            <Card>
              <SectionHdr icon="🌿" title="C — Choose Residues for Biological Processing" color={C.teal}/>
              <div style={g4}>
                <ResidueCard label="EFB"         active={s0.efbEnabled}        onClick={()=>up("efbEnabled",!s0.efbEnabled)}               sublabel="Empty Fruit Bunches"/>
                <ResidueCard label="OPDC"        active={s0.opdcEnabled}       onClick={()=>up("opdcEnabled",!s0.opdcEnabled)}              sublabel="Decanter Cake"/>
            <ResidueCard label="POME SLUDGE"  active={s0.pomeSludgeEnabled}  onClick={()=>up("pomeSludgeEnabled",!s0.pomeSludgeEnabled)} sublabel="Mill Exit / Sludge Pit"/>
            <ResidueCard label="PKE"          active={s0.pkeEnabled}         onClick={()=>up("pkeEnabled",!s0.pkeEnabled)}           sublabel="Purchased Protein Booster"/>
          </div>
          <Divider/>
          <div style={{...g2, marginBottom:12}}>
            <BluField label="EFB Blend Fraction (DM basis)" unit="%" value={s0.efbPct} onChange={v=>up("efbPct",+v)}/>
            <BluField label="OPDC Blend Fraction (DM basis)" unit="%" value={s0.opdcPct} onChange={v=>up("opdcPct",+v)}/>
          </div>
          {!blendOK
            ? <Halt msg={"Blend total = "+blendTotal+"% — must equal 100%"}/>
            : <Warn type="ok" msg={"Blend valid — EFB "+s0.efbPct+"% + OPDC "+s0.opdcPct+"% = 100%"}/>}
          <Divider/>
          <div style={g3}>
            <CalcField label="Blended Moisture" unit="%" value={blendMC}/>
            <CalcField label="Blend DM Content" unit="%" value={(100-blendMC).toFixed(1)}/>
            <CalcField label="Blend C:N (DM-weighted)" unit="ratio" value={blendCN||"—"}
              note={blendCN?blendCN<=25?"✓ Optimal for BSF (15–25)":blendCN<=35?"⚠ Marginal — add POME/PKE":"✕ High — BSF yield penalty":undefined}/>
          </div>
          <div style={{...g2, marginTop:12}}>
            <CalcField label="Monthly Substrate → S3" unit="t FW/month" value={s1_blendWet.toLocaleString()}/>
            <CalcField label="Monthly Substrate DM" unit="t DM/month" value={s1_blendDM.toLocaleString()}/>
          </div>
        </Card>

            {/* ── E: SOIL TYPE & AG MANAGEMENT — below C in right column ── */}
            <Card>
              <SectionHdr icon="🌍" title="E — Soil Type &amp; Agronomy" color={C.teal}/>

              {/* Soil type */}
              <div style={LABEL}>Indonesian Soil Classification</div>
              <div style={{display:"flex", gap:8, flexWrap:"wrap", marginTop:8, marginBottom:4}}>
                {SOILS.map(so=>(
                  <div key={so.id} onClick={()=>up("soil",so.id)}
                    style={{background:s0.soil===so.id?C.teal+"20":C.navyDk,
                      border:`1px solid ${s0.soil===so.id?C.teal+"77":"rgba(255,255,255,0.07)"}`,
                      borderBottom:s0.soil===so.id?`2px solid ${C.teal}`:"2px solid transparent",
                      borderRadius:8, padding:"9px 13px", cursor:"pointer",
                      flex:"1 1 auto", minWidth:120, transition:"all 0.15s"}}>
                    <div style={{color:s0.soil===so.id?C.teal:C.white, fontWeight:700, fontSize:12}}>{so.name}</div>
                    <div style={{color:C.grey, fontSize:10, marginTop:3}}>{so.pct} · pH {so.ph} · CEC {so.cec}</div>
                    <div style={{color:C.grey, fontSize:9, marginTop:2}}>{so.desc}</div>
                  </div>
                ))}
              </div>
              {s0.soil==="histosol" && <Warn msg="Histosol (peat): ~80% less N and ~70% less P needed. CFI fertiliser highly competitive."/>}
              {s0.soil==="inceptisol" && <Warn type="ok" msg="Inceptisol: Best baseline fertility. Standard NPK application rates apply."/>}

              <Divider/>

              {/* AG Management tier */}
              <div style={LABEL}>Agronomy Management Tier</div>
              <div style={{display:"flex", flexDirection:"column", gap:6, marginTop:8}}>
                {AG_TIERS.map(ag=>(
                  <div key={ag.id} onClick={()=>up("ag",ag.id)}
                    style={{background:s0.ag===ag.id?C.amber+"18":C.navyDk,
                      border:`1px solid ${s0.ag===ag.id?C.amber+"66":"rgba(255,255,255,0.07)"}`,
                      borderLeft:s0.ag===ag.id?`3px solid ${C.amber}`:"3px solid transparent",
                      borderRadius:8, padding:"10px 14px", cursor:"pointer",
                      display:"flex", alignItems:"center", justifyContent:"space-between",
                      transition:"all 0.15s"}}>
                    <span style={{color:s0.ag===ag.id?C.amberLt:C.white, fontSize:12, fontWeight:600}}>{ag.name}</span>
                    <Badge text={Math.round(ag.uplift*100)+"% uplift"} color={s0.ag===ag.id?C.amber:C.grey}/>
                  </div>
                ))}
              </div>
            </Card>

          </div>{/* end RIGHT COLUMN */}

        </div>{/* end TWO-COLUMN ROW */}

        {/* ── FULL-WIDTH SECTIONS BELOW ── */}
        <div style={{display:"flex", flexDirection:"column", gap:16, marginTop:16}}>

        {/* ── F: POME SLUDGE ── */}
        <Card>
          <SectionHdr icon="💧" title="F — POME Sludge (Third Waste Stream)" color={C.blue}/>
          <div style={{display:"flex", alignItems:"center", gap:16, marginBottom:16}}>
            <label style={{display:"flex", alignItems:"center", gap:10, cursor:"pointer"}}>
              <input type="checkbox" checked={s0.pomeSludgeEnabled}
                onChange={e=>up("pomeSludgeEnabled",e.target.checked)}
                style={{accentColor:C.blue, width:16, height:16, cursor:"pointer"}}/>
              <span style={{color:s0.pomeSludgeEnabled?C.blue:C.grey, fontWeight:700, fontSize:13}}>
                Include POME Sludge — Mill Exit / Sludge Pit (Centrifuge Discharge)
              </span>
            </label>
            <Badge text="Zero Cost — Mill Waste" color={C.green}/>
          </div>
          <div style={g4}>
            <KPI label="Natural Yield" value={pomeSludgeNatTPD} unit="t/day fresh (at mill exit)" color={C.blue}/>
            <KPI label="DM Content" value={pomeSludgeDMpd+" t/day"} unit={"at "+pomeSludgeActMC+"% MC"} color={C.teal}/>
            <KPI label="Daily Nitrogen" value={pomeN+" kg"} unit="N/day (1.76% DM)" color={C.green}/>
            <KPI label="Fe Status" value={feStatus}
              unit={isNaN(pomeFe)?"ICP-OES pending":pomeFe+" mg/kg DM"}
              color={FE_COLOR[feStatus]||C.grey}/>
          </div>
          <Divider/>
          <div style={{display:"grid", gridTemplateColumns:"1.5fr 1fr 1fr 1.5fr", gap:12}}>
            <div>
              <div style={LABEL}>Moisture State</div>
              <PillToggle
                options={[{v:false,l:"Fresh (mill exit)",sub:"82% MC"},{v:true,l:"Post-dewatered",sub:"65% MC"}]}
                value={s0.pomeSludgeDewatered}
                onChange={v=>up("pomeSludgeDewatered",v)}
                color={C.blue}/>
            </div>
            <AmbField label="ICP-OES Fe Result" unit="mg/kg DM"
              value={s0.pomeSludgeFeResult} onChange={v=>up("pomeSludgeFeResult",v)}
              note="Run CFI-LAB-POME-001 Package A — drives max inclusion rate"/>
            <div>
              <div style={LABEL}>Inclusion Rate <span style={{color:C.blue+"aa", fontSize:9, fontWeight:600, letterSpacing:"0.04em"}}>[% WW of blend]</span></div>
              <input
                style={{background:"#142030",
                  border:`1px solid ${inclPctCapped>=pomeSludgeMaxPct?C.amber+"66":C.teal+"55"}`,
                  borderRadius:6,
                  color:inclPctCapped>=pomeSludgeMaxPct?C.amberLt:C.white,
                  padding:"8px 12px", fontSize:13, width:"100%", outline:"none", boxSizing:"border-box"}}
                value={s0.pomeSludgeInclPct}
                onChange={e=>up("pomeSludgeInclPct",+e.target.value)}/>
              <div style={{color:inclPctCapped>=pomeSludgeMaxPct?C.amber:C.green, fontSize:10, marginTop:3}}>
                Max allowed: {pomeSludgeMaxPct}% WW (Fe: {feStatus})
              </div>
            </div>
            <CalcField label="POME Sludge Added to Blend" unit="t/day"
              value={pomeSludgeInclTPD+" t/day  ("+pomeSludgeInclDM+" t DM)"}/>
          </div>
          {pomeFe>=8000 && <Halt msg="Fe >8,000 mg/kg DM — CaCO₃ amendment required before inclusion. Max 5% WW. Re-run ICP-OES after amendment."/>}
          {pomeFe>=5000&&pomeFe<8000 && <Warn msg="Fe 5,000–8,000 mg/kg DM — HIGH. Limit to 5–10% WW inclusion. Monitor Fe uptake in BSF larvae."/>}
          {pomeFe>=3000&&pomeFe<5000 && <Warn type="warn" msg="Fe 3,000–5,000 mg/kg DM — MODERATE. Max 10–15% WW inclusion. Acceptable for BSF with monitoring."/>}
          {(isNaN(pomeFe)||pomeFe===0)&&s0.pomeSludgeEnabled &&
            <Warn type="warn" msg="No ICP-OES Fe result entered. Using default 15% WW cap. Run CFI-LAB-POME-001 Package A before scale-up."/>}
          {pomeFe>0&&pomeFe<3000 &&
            <Warn type="ok" msg={"Fe LOW ("+pomeFe+" mg/kg DM) — max 20% WW inclusion permitted. POME Sludge cleared for standard use."}/>}
          <Divider/>
          <div style={{background:C.navyDk, borderRadius:6, padding:"10px 14px",
            display:"flex", flexWrap:"wrap", gap:"12px 28px"}}>
            {[
              {label:"Capture point:", text:"Mill Exit / Sludge Pit / Centrifuge Discharge — NOT pond (higher N, lower Fe)", color:C.blue},
              {label:"pH 4–5.5", text:"· neutralised by PKSA S2 at no cost", color:C.teal},
              {label:"CPO 5–20% DM", text:"— BSF energy boost", color:C.amber},
            ].map((item,i)=>(
              <span key={i} style={{color:C.grey, fontSize:11}}>
                <span style={{color:item.color, fontWeight:700}}>{item.label} </span>
                {item.text}
              </span>
            ))}
          </div>
        </Card>

        {/* ── G: PKE ── */}
        <Card>
          <SectionHdr icon="🌾" title="G — PKE Palm Kernel Expeller (Protein Booster — Optional)" color={C.amber}/>
          <div style={{display:"flex", alignItems:"center", gap:16, marginBottom:s0.pkeEnabled?16:0}}>
            <label style={{display:"flex", alignItems:"center", gap:10, cursor:"pointer"}}>
              <input type="checkbox" checked={s0.pkeEnabled}
                onChange={e=>up("pkeEnabled",e.target.checked)}
                style={{accentColor:C.amber, width:16, height:16, cursor:"pointer"}}/>
              <span style={{color:s0.pkeEnabled?C.amber:C.grey, fontWeight:700, fontSize:13}}>
                Include PKE — Purchased Protein Booster (raises substrate CP for BSF)
              </span>
            </label>
            <Badge text="$160 / t wet" color={C.amber}/>
            <Badge text="NOT MILL WASTE — PURCHASED INPUT" color={C.red}/>
          </div>
          {s0.pkeEnabled && (
            <div>
              <div style={{display:"grid", gridTemplateColumns:"1.5fr 1fr 1fr 1fr", gap:12, marginBottom:12}}>
                <BluField label="PKE Addition Rate" unit="t/day wet"
                  value={s0.pkeTPD} onChange={v=>up("pkeTPD",+v)}
                  note="Start at 5 t/day. Adjust by C:N target."/>
                <CalcField label="PKE Dry Matter" unit="t DM/day" value={pkeDM}/>
                <CalcField label="N Contribution (PKE)" unit="kg N/day" value={pkeN}/>
                <CalcField label="Daily PKE Cost" unit="USD/day" value={"$"+pkeCost.toLocaleString()}/>
              </div>
              <div style={{background:C.navyDk, borderRadius:6, padding:"10px 14px",
                display:"flex", flexWrap:"wrap", gap:"12px 28px"}}>
                <span style={{color:C.grey, fontSize:11}}>
                  <span style={{color:C.amber, fontWeight:700}}>PKE profile: </span>
                  CP 18% DM · N 2.9% DM · C:N 15 · Lignin 12.4% ADL · MC 12% · Fat 9% DM
                </span>
                <span style={{color:C.grey, fontSize:11}}>
                  <span style={{color:C.red, fontWeight:700}}>Monthly cost: </span>
                  {"$"+(pkeCost*s0.daysMonth).toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </Card>

        {/* ── H: COMBINED SUMMARY — conditional ── */}
        {(s0.pomeSludgeEnabled||s0.pkeEnabled) && (
          <Card style={{border:`1px solid ${C.green}33`}}>
            <SectionHdr icon="📊" title="H — Combined Multi-Stream Daily NPK Summary" color={C.green}/>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%", borderCollapse:"collapse", fontSize:11}}>
                <thead>
                  <tr style={{background:C.navyDk}}>
                    {["STREAM","t/day FW","t/day DM","N kg/day","P kg/day","K kg/day","C:N"].map((h,i)=>(
                      <td key={i} style={{padding:"9px 12px", color:C.grey, fontWeight:700,
                        letterSpacing:"0.07em", fontSize:10, textTransform:"uppercase",
                        borderBottom:`1px solid ${C.navyLt}`}}>{h}</td>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    {name:"EFB",               fw:efbTPD.toFixed(1),   dm:efbDMpd.toFixed(1),        n:efbN,  p:efbP,  k:efbK,  cn:"60",  col:C.teal},
                    {name:"OPDC (Decanter Cake)",fw:(opdcDMreq/(1-(s0.opdcMC/100))).toFixed(1), dm:opdcDMreq.toFixed(1), n:opdcN, p:opdcP, k:opdcK, cn:"20", col:C.amber},
                    ...(s0.pomeSludgeEnabled?[{name:"POME Sludge", fw:pomeSludgeInclTPD.toFixed(1), dm:pomeSludgeInclDM.toFixed(2), n:pomeN, p:pomeP, k:pomeK, cn:"~15", col:C.blue}]:[]),
                    ...(s0.pkeEnabled?[{name:"PKE (Protein Booster)", fw:(+s0.pkeTPD).toFixed(1), dm:pkeDM.toFixed(1), n:pkeN, p:"—", k:"—", cn:"15", col:C.purple}]:[]),
                  ].map((row,i)=>(
                    <tr key={i} style={{borderBottom:`1px solid ${C.navyLt}33`,
                      background:i%2===0?C.navyDk+"80":"transparent"}}>
                      <td style={{padding:"9px 12px", color:row.col, fontWeight:700}}>{row.name}</td>
                      <td style={{padding:"9px 12px", color:C.greyLt, fontFamily:"monospace"}}>{row.fw}</td>
                      <td style={{padding:"9px 12px", color:C.greyLt, fontFamily:"monospace"}}>{row.dm}</td>
                      <td style={{padding:"9px 12px", color:C.green, fontFamily:"monospace", fontWeight:700}}>{row.n}</td>
                      <td style={{padding:"9px 12px", color:C.teal, fontFamily:"monospace"}}>{row.p}</td>
                      <td style={{padding:"9px 12px", color:C.amber, fontFamily:"monospace"}}>{row.k}</td>
                      <td style={{padding:"9px 12px", color:C.greyLt, fontFamily:"monospace"}}>{row.cn}</td>
                    </tr>
                  ))}
                  <tr style={{background:C.green+"14", borderTop:`2px solid ${C.green}44`}}>
                    <td style={{padding:"10px 12px", color:C.green, fontWeight:900, fontSize:12}}>COMBINED TOTAL</td>
                    <td style={{padding:"10px 12px", color:C.green, fontFamily:"monospace", fontWeight:700}}>—</td>
                    <td style={{padding:"10px 12px", color:C.green, fontFamily:"monospace", fontWeight:700}}>
                      {(efbDMpd+opdcDMreq+pomeSludgeInclDM+pkeDM).toFixed(1)}
                    </td>
                    <td style={{padding:"10px 12px", color:C.green, fontFamily:"monospace", fontWeight:900}}>{totN}</td>
                    <td style={{padding:"10px 12px", color:C.teal, fontFamily:"monospace", fontWeight:700}}>{totP}</td>
                    <td style={{padding:"10px 12px", color:C.amber, fontFamily:"monospace", fontWeight:700}}>{totK}</td>
                    <td style={{padding:"10px 12px", color:C.white, fontFamily:"monospace", fontWeight:700}}>{blendCN||"—"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            {blendCN && (
              <div style={{marginTop:10}}>
                {blendCN<15  && <Warn msg={"C:N "+blendCN+" — BELOW optimum (15–25). Reduce PKE or POME Sludge, or increase EFB fraction."}/>}
                {blendCN>=15&&blendCN<=25 && <Warn type="ok" msg={"C:N "+blendCN+" — OPTIMAL range (15–25). Blend composition confirmed for BSF."}/>}
                {blendCN>25&&blendCN<=35  && <Warn type="warn" msg={"C:N "+blendCN+" — MARGINAL (target 15–25). Add more POME Sludge or PKE to lower."}/>}
                {blendCN>35 && <Warn msg={"C:N "+blendCN+" — HIGH. EFB dominance raising C:N. POME Sludge and PKE additions strongly recommended."}/>}
              </div>
            )}
          </Card>
        )}

        </div>{/* end full-width flex column */}
      </div>{/* end outer padding wrapper */}
    </div>
  );
}
