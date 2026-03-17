const { useState, useMemo } = React;

const C = {
  navy:"#0B1929", navyMid:"#0F2236", navyLt:"#162E45", navyDk:"#070F1A",
  teal:"#00C9B1", tealDk:"#009E8C", tealLt:"#5EEADA",
  amber:"#F5A623", amberLt:"#FFD080",
  green:"#3DCB7A", red:"#E84040", purple:"#9B59B6", blue:"#4A9EE0",
  white:"#F0F4F8", grey:"#8BA0B4", greyLt:"#C4D3E0",
};

const REFS = [
  { id:"R1", tag:"Loh et al. 2013", detail:"MPOB Eng. Bulletin 127. 0.65–0.75 m³ POME/t FFB; clarification sludge ≈60% of POME volume to decanter." },
  { id:"R2", tag:"Habib et al. 1997", detail:"Proximate composition of POME-derived materials; DM fraction calibration." },
  { id:"R3", tag:"Ahmad et al. 2003", detail:"POME sludge TS 30,000–70,000 mg/L; dewatered sludge DM 60–80%. Raw decanter sludge 20–35% DM." },
  { id:"R4", tag:"Bello & Ahmad 2010", detail:"Sludge production 8–15 kg wet/m³ POME. Mass-balance logic for POME→sludge." },
  { id:"R5", tag:"Zahrim et al. 2009", detail:"Suspended solids in POME. Supports 30–50% TS capture fraction with 2nd decanter." },
  { id:"R6", tag:"Hau et al. 2020", detail:"Mixed EFB–POME composting mass balance. Validates DM recovery factors (Scenario B)." },
  { id:"R7", tag:"Ma 2000; IntechOpen 2018", detail:"TS, VS, N, P, K per m³ POME. TS range 40,000–60,000 mg/L cross-checked across multi-mill datasets." },
  { id:"R8", tag:"CFI POME RAW Liquid Analysis (2025)", detail:"Internal workbook aggregating R1–R7. Derives 1–3 kg DM/t FFB (Scenario A) and 5–10 kg DM/t FFB (Scenario B) under guardrails methodology." },
];

const PROCESS_STEPS = [
  { num:"1", title:"POME Collection", color:C.teal,
    desc:"Sterilizer condensate (~36%) + clarifier sludge (~60%) + hydrocyclone water (~4%) into common POME sump.",
    spec:"0.65–0.75 m³/t FFB · 80–90°C · 4–5% TS · 50,000 mg/L COD",
    atFFB60:"39–45 m³/h POME flow" },
  { num:"2", title:"Cooling + Equalisation", color:C.teal,
    desc:"Flash cooler / heat exchanger cools POME 80–90°C → 35–40°C. Equalisation tank buffers flow and homogenises COD/solids.",
    spec:"EQ tank 500–1,000 m³ (12–24 h HRT)",
    atFFB60:"EQ tank sized for 39–45 m³/h" },
  { num:"3", title:"Primary Solids — Existing Clarifier Decanter", color:C.amber,
    desc:"Mill's existing high-solids clarifier stream to decanter/sludge separator. Baseline CFI capture point.",
    spec:"8–15 kg wet sludge/m³ · 20–35% DM",
    atFFB60:"Yields ≈ 1–3 kg DM/t FFB (Scenario A)" },
  { num:"4", title:"Secondary Solids — New Full-POME Decanter", color:C.amber,
    desc:"High-solids decanter centrifuge on full POME flow from EQ tank. 30–50% TS capture from total POME stream.",
    spec:"40–50 m³/h duty · 3-phase or 2-phase · 3,000–4,000g",
    atFFB60:"+2–7 kg DM/t FFB → total 5–10 kg DM/t FFB (Scenario B)" },
  { num:"5", title:"Sludge Handling", color:C.green,
    desc:"Decanter sludge pump → buffer tank → Option A: direct truck to BSF/compost site. Option B: screw press to 30–35% DM for cheaper transport.",
    spec:"Buffer tank 10–30 m³ (4–8 h residence) · Press 3–5 m³/h",
    atFFB60:"Net sludge DM: 5–10 kg/t FFB combined" },
  { num:"6", title:"Downstream POME Treatment (Liquid)", color:C.blue,
    desc:"Remaining liquid POME → anaerobic digestion (biogas) → aerobic polishing. ~50% of original TS and all dissolved COD remain after solids capture.",
    spec:"28 m³ biogas/m³ POME · 15.4 m³ CH₄/m³ · HRT 22d · BOD < 100 mg/L target",
    atFFB60:"336–420 kg CO₂e/m³ avoided vs. open ponding" },
];

const SUPPLIERS = [
  { name:"Alfa Laval", type:"International", range:"30–100 m³/h", note:"Decanter centrifuges and high-solids POME separators — widely deployed in 30–60 TPH Indonesian/Malaysian mills.", capex:"$300–600k equipment · >$1M all-in installed" },
  { name:"GEA Westfalia", type:"International", range:"20–100 m³/h", note:"3-phase decanters for POME and CPO clarification. Full-POME centrifuge configurations available.", capex:"$300–600k equipment · >$1M all-in installed" },
  { name:"Flottweg", type:"International", range:"20–100 m³/h", note:"Decanter centrifuges for POME and sludge thickening. Similar capacity range to GEA/Alfa Laval.", capex:"$300–600k equipment · >$1M all-in installed" },
  { name:"Mectech / Dolphin / Chinese OEMs", type:"Asian OEM", range:"10–60 m³/h", note:"Lower-cost option via Jakarta/Medan/Johor agents. 30–50% lower purchase price but higher mechanical and separation-efficiency risk.", capex:"30–50% lower than international · Still hundreds of kUSD installed" },
];

const SCENARIOS = {
  A:{ id:"A", label:"Scenario A — Decanter Discharge Only", sublabel:"Existing clarifier decanter · collect as-is · dewater off-site", dmLow:1, dmMid:2, dmHigh:3, color:C.teal,
    derivation:[
      { step:"1", desc:"Total POME generated", value:"0.65–0.75 m³/t FFB", ref:"R1" },
      { step:"2", desc:"Clarification sludge fraction (≈60%)", value:"0.4–0.5 m³/t FFB to decanter", ref:"R1" },
      { step:"3", desc:"Wet sludge at decanter discharge", value:"8–15 kg wet/m³ POME", ref:"R4" },
      { step:"4", desc:"DM of raw decanter sludge", value:"20–35% DM", ref:"R3,R4" },
      { step:"5", desc:"DM per m³ POME entering decanter", value:"1.6–5.3 kg DM/m³", ref:"R4" },
      { step:"\u2192", desc:"RESULT: Decanter-only DM per tonne FFB", value:"0.4–0.5 × 1.6–5.3 ≈ 1–3 kg DM/t FFB", ref:"R8", highlight:true },
    ]
  },
  B:{ id:"B", label:"Scenario B — Decanter + 2nd Full-POME Centrifuge", sublabel:"New 40–50 m³/h decanter on full POME flow · 2–4× more DM", dmLow:5, dmMid:7.5, dmHigh:10, color:C.amber,
    derivation:[
      { step:"1", desc:"Total POME TS (4–5%)", value:"26–38 kg TS/t FFB", ref:"R7,R8" },
      { step:"2", desc:"TS capturable with 2nd decanter (30–50%)", value:"8–19 kg TS/t FFB", ref:"R5" },
      { step:"3", desc:"DM of captured sludge", value:"20–35% DM", ref:"R3" },
      { step:"4", desc:"Extra DM from 2nd decanter", value:"8–19 × 20–35% ≈ 2–7 kg DM/t FFB", ref:"R5,R8" },
      { step:"5", desc:"Add Scenario A baseline (1–3 kg DM)", value:"1–3 + 2–7 = 3–10 kg DM/t FFB", ref:"R8" },
      { step:"\u2192", desc:"RESULT: Full capture DM per tonne FFB", value:"5–10 kg DM/t FFB (design band)", ref:"R8", highlight:true },
    ]
  }
};

function NumInput({ label, unit, value, onChange, min, max, step, note }) {
  return React.createElement("div", { style:{ marginBottom:14 } },
    React.createElement("div", { style:{ color:C.grey, fontSize:10, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:4 } },
      label, unit ? React.createElement("span", { style:{ color:C.teal, marginLeft:4 } }, "[", unit, "]") : null),
    React.createElement("input", { type:"number", value:value, min:min, max:max, step:step||1,
      onChange:function(e){ onChange(parseFloat(e.target.value)||0); },
      style:{ background:"#1A3550", border:"1px solid "+C.teal+"55", borderRadius:5, color:C.amberLt,
              padding:"7px 10px", fontSize:14, fontWeight:700, width:"100%", outline:"none", boxSizing:"border-box" } }),
    note ? React.createElement("div", { style:{ color:C.grey, fontSize:10, marginTop:3 } }, note) : null
  );
}

function KPI({ label, value, unit, color, large, sub }) {
  return React.createElement("div", {
    style:{ background:C.navyLt, borderRadius:8, padding:large?"14px 16px":"10px 14px",
            border:"1px solid "+(color||C.teal)+"33", textAlign:"center" }
  },
    React.createElement("div", { style:{ color:C.grey, fontSize:10, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:4 } }, label),
    React.createElement("div", { style:{ color:color||C.teal, fontSize:large?22:16, fontWeight:900 } }, value),
    unit ? React.createElement("div", { style:{ color:C.grey, fontSize:10, marginTop:2 } }, unit) : null,
    sub ? React.createElement("div", { style:{ color:C.grey, fontSize:9, marginTop:2, fontStyle:"italic" } }, sub) : null
  );
}

function CollapseBtn({ label, active, onClick, color }) {
  return React.createElement("button", {
    onClick:onClick,
    style:{ background:active?(color||C.teal)+"22":"transparent", border:"1px solid "+(color||C.teal)+"66",
            borderRadius:6, color:color||C.teal, padding:"6px 12px", fontSize:11, cursor:"pointer", fontWeight:700 }
  }, (active ? "\u25BC " : "\u25B6 ") + label);
}

export default function CFI_POME_DM_v3() {
  const [ffb,       setFfb]      = useState(60);
  const [util,      setUtil]     = useState(85);
  const [hrs,       setHrs]      = useState(24);
  const [days,      setDays]     = useState(30);
  const [scenario,  setScenario] = useState("A");
  const [dmPoint,   setDmPoint]  = useState("mid");
  const [lockedMC,  setLockedMC] = useState(80);
  const [panel,     setPanel]    = useState("");   // "flow"|"equip"|"deriv"|"refs"|"biogas"|""

  function togglePanel(p){ setPanel(function(prev){ return prev===p ? "" : p; }); }

  const MC_OPTIONS = [65, 70, 75, 78, 80, 82, 85];
  const sc = SCENARIOS[scenario];
  const dmVal = dmPoint==="low" ? sc.dmLow : dmPoint==="high" ? sc.dmHigh : sc.dmMid;

  const effFFB      = +(ffb * util / 100).toFixed(2);
  const ffbDay      = +(effFFB * hrs).toFixed(1);
  const ffbMonth    = +(ffbDay * days).toFixed(0);
  const pomeDMday   = +(ffbDay * dmVal / 1000).toFixed(3);
  const pomeDMmonth = +(pomeDMday * days).toFixed(2);
  const pomeM3hr    = +(effFFB * 0.7).toFixed(1);   // mid of 0.65–0.75
  const pomeM3day   = +(pomeM3hr * hrs).toFixed(0);
  const biogasDay   = +(pomeM3day * 28).toFixed(0);
  const ch4Day      = +(pomeM3day * 15.4).toFixed(0);
  const ghgAvoidedDay = +(pomeM3day * 378).toFixed(0);  // mid of 336–420

  const rows = useMemo(function() {
    return MC_OPTIONS.map(function(mc) {
      var dmFrac=(100-mc)/100;
      var fw=+(pomeDMday/dmFrac).toFixed(2);
      var water=+(fw-pomeDMday).toFixed(2);
      var pctFFB=ffbDay>0 ? +(fw/ffbDay*100).toFixed(3) : 0;
      return { mc:mc, fw:fw, water:water, pctFFB:pctFFB };
    });
  }, [pomeDMday, ffbDay]);

  var lockedRow = rows.find(function(r){ return r.mc===lockedMC; }) || rows[4];

  var rangeRows = ["A","B"].map(function(sid) {
    var s=SCENARIOS[sid];
    return ["low","mid","high"].map(function(pt) {
      var dv=pt==="low"?s.dmLow:pt==="high"?s.dmHigh:s.dmMid;
      var dm=+(ffbDay*dv/1000).toFixed(3);
      var fw=+(dm/((100-lockedMC)/100)).toFixed(2);
      return { scenario:sid, point:pt, dmKgFFB:dv, dm:dm, fw:fw };
    });
  }).flat();

  return React.createElement("div", {
    style:{ background:C.navy, minHeight:"100vh", fontFamily:"'DM Sans',system-ui,sans-serif", color:C.white, padding:"0 0 60px" }
  },

    // HEADER
    React.createElement("div", { style:{ background:"linear-gradient(135deg,"+C.navyMid+" 0%,#0A2030 100%)", borderBottom:"2px solid "+C.teal+"44", padding:"14px 20px" } },
      React.createElement("div", { style:{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 } },
        React.createElement("div", { style:{ display:"flex", alignItems:"center", gap:10 } },
          React.createElement("div", { style:{ background:C.teal, width:36, height:36, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 } }, "\uD83D\uDCA7"),
          React.createElement("div", null,
            React.createElement("div", { style:{ color:C.teal, fontWeight:900, fontSize:14, letterSpacing:"0.07em" } }, "CFI \u2014 POME SLUDGE DRY MATTER CALCULATOR v3"),
            React.createElement("div", { style:{ color:C.grey, fontSize:10 } }, "Decanter-capture scenarios \u00B7 Process flow \u00B7 Equipment sizing \u00B7 Biogas \u00B7 8 literature sources")
          )
        )
      ),
      React.createElement("div", { style:{ display:"flex", gap:6, flexWrap:"wrap" } },
        React.createElement(CollapseBtn, { label:"Process Flow", active:panel==="flow", onClick:function(){ togglePanel("flow"); }, color:C.teal }),
        React.createElement(CollapseBtn, { label:"Equipment & Suppliers", active:panel==="equip", onClick:function(){ togglePanel("equip"); }, color:C.amber }),
        React.createElement(CollapseBtn, { label:"Biogas & GHG", active:panel==="biogas", onClick:function(){ togglePanel("biogas"); }, color:C.green }),
        React.createElement(CollapseBtn, { label:"Derivation", active:panel==="deriv", onClick:function(){ togglePanel("deriv"); }, color:sc.color }),
        React.createElement(CollapseBtn, { label:"References", active:panel==="refs", onClick:function(){ togglePanel("refs"); }, color:C.purple })
      )
    ),

    React.createElement("div", { style:{ maxWidth:940, margin:"0 auto", padding:"16px 14px" } },

      // SCENARIO SELECTOR
      React.createElement("div", { style:{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:12 } },
        ["A","B"].map(function(sid) {
          var s=SCENARIOS[sid]; var active=scenario===sid;
          return React.createElement("div", { key:sid, onClick:function(){ setScenario(sid); },
            style:{ background:active?s.color+"18":C.navyMid, border:"2px solid "+(active?s.color:C.navyLt), borderRadius:8, padding:"12px 14px", cursor:"pointer", transition:"all 0.15s" }
          },
            React.createElement("div", { style:{ display:"flex", alignItems:"center", gap:8, marginBottom:4 } },
              React.createElement("div", { style:{ width:16, height:16, borderRadius:"50%", border:"2px solid "+s.color, background:active?s.color:"transparent" } }),
              React.createElement("div", { style:{ color:s.color, fontWeight:900, fontSize:12 } }, s.label)
            ),
            React.createElement("div", { style:{ color:C.grey, fontSize:10, marginLeft:24 } }, s.sublabel),
            React.createElement("div", { style:{ marginLeft:24, marginTop:6, display:"inline-block", background:C.navyDk, borderRadius:5, padding:"4px 8px" } },
              React.createElement("span", { style:{ color:C.grey, fontSize:10 } }, "Range: "),
              React.createElement("span", { style:{ color:s.color, fontWeight:900, fontSize:13 } }, s.dmLow+"–"+s.dmHigh),
              React.createElement("span", { style:{ color:C.grey, fontSize:10 } }, " kg DM/t FFB")
            )
          );
        })
      ),

      // DESIGN POINT
      React.createElement("div", { style:{ background:C.navyMid, borderRadius:8, padding:"10px 14px", marginBottom:12, border:"1px solid "+sc.color+"33" } },
        React.createElement("div", { style:{ color:C.grey, fontSize:10, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8 } }, "Design Point \u2014 kg DM per tonne FFB"),
        React.createElement("div", { style:{ display:"flex", gap:8 } },
          ["low","mid","high"].map(function(pt) {
            var dv=pt==="low"?sc.dmLow:pt==="high"?sc.dmHigh:sc.dmMid; var active=dmPoint===pt;
            return React.createElement("div", { key:pt, onClick:function(){ setDmPoint(pt); },
              style:{ flex:1, textAlign:"center", padding:"8px", borderRadius:7, cursor:"pointer",
                      background:active?sc.color+"22":C.navyLt, border:"2px solid "+(active?sc.color:"transparent"), transition:"all 0.15s" }
            },
              React.createElement("div", { style:{ color:C.grey, fontSize:10, textTransform:"uppercase", letterSpacing:"0.06em" } }, pt),
              React.createElement("div", { style:{ color:active?sc.color:C.white, fontWeight:900, fontSize:18 } }, dv),
              React.createElement("div", { style:{ color:C.grey, fontSize:10 } }, "kg DM/t FFB")
            );
          })
        )
      ),

      // MAIN GRID
      React.createElement("div", { style:{ display:"grid", gridTemplateColumns:"300px 1fr", gap:12, marginBottom:12 } },

        // LEFT inputs
        React.createElement("div", { style:{ background:C.navyMid, borderRadius:8, padding:14, border:"1px solid "+C.teal+"22" } },
          React.createElement("div", { style:{ color:C.teal, fontWeight:800, fontSize:11, letterSpacing:"0.06em", marginBottom:12, borderLeft:"3px solid "+C.teal, paddingLeft:8 } }, "\u2699\uFE0F  MILL PARAMETERS"),
          React.createElement(NumInput, { label:"FFB Mill Capacity", unit:"TPH", value:ffb, onChange:setFfb, min:10, max:200, step:5 }),
          React.createElement(NumInput, { label:"Utilisation", unit:"%", value:util, onChange:setUtil, min:50, max:100, step:1 }),
          React.createElement(NumInput, { label:"Operating Hours", unit:"hrs/day", value:hrs, onChange:setHrs, min:8, max:24, step:1 }),
          React.createElement(NumInput, { label:"Operating Days", unit:"days/month", value:days, onChange:setDays, min:20, max:31, step:1 }),
          React.createElement("hr", { style:{ border:"none", borderTop:"1px solid "+C.navyLt, margin:"10px 0" } }),
          React.createElement("div", { style:{ background:C.navyDk, borderRadius:6, padding:"8px 10px" } },
            React.createElement("div", { style:{ color:C.grey, fontSize:10, marginBottom:4 } }, "Active design point"),
            React.createElement("div", { style:{ color:sc.color, fontWeight:900, fontSize:17 } }, dmVal, " kg DM/t FFB"),
            React.createElement("div", { style:{ color:C.grey, fontSize:10 } }, sc.label.split("—")[0])
          )
        ),

        // RIGHT KPIs
        React.createElement("div", { style:{ display:"flex", flexDirection:"column", gap:10 } },
          React.createElement("div", { style:{ background:C.navyMid, borderRadius:8, padding:12, border:"1px solid "+C.teal+"22" } },
            React.createElement("div", { style:{ color:C.teal, fontWeight:800, fontSize:11, letterSpacing:"0.06em", marginBottom:10, borderLeft:"3px solid "+C.teal, paddingLeft:8 } }, "\uD83C\uDFED  FFB + POME THROUGHPUT"),
            React.createElement("div", { style:{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:8 } },
              React.createElement(KPI, { label:"Eff. Rate", value:effFFB+" t/hr", unit:"t/hr FFB", color:C.teal }),
              React.createElement(KPI, { label:"FFB/day", value:ffbDay.toLocaleString()+" t", color:C.teal }),
              React.createElement(KPI, { label:"POME Flow", value:pomeM3hr+" m³/hr", unit:"@ 0.70 m³/t mid", color:C.blue }),
              React.createElement(KPI, { label:"POME/day", value:pomeM3day.toLocaleString()+" m³", color:C.blue }),
              React.createElement(KPI, { label:"FFB/month", value:ffbMonth.toLocaleString()+" t", color:C.tealLt })
            )
          ),
          React.createElement("div", { style:{ background:C.navyMid, borderRadius:8, padding:12, border:"2px solid "+sc.color+"55" } },
            React.createElement("div", { style:{ color:sc.color, fontWeight:800, fontSize:11, letterSpacing:"0.06em", marginBottom:10, borderLeft:"3px solid "+sc.color, paddingLeft:8 } }, "\u2696\uFE0F  POME SLUDGE \u2014 DRY MATTER"),
            React.createElement("div", { style:{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8 } },
              React.createElement(KPI, { label:"DM/day", value:pomeDMday+" t", unit:"t DM/day", color:C.green, large:true }),
              React.createElement(KPI, { label:"DM/month", value:pomeDMmonth+" t", color:C.green, large:true }),
              React.createElement(KPI, { label:"DM/year", value:(+(pomeDMmonth*12).toFixed(1))+" t", color:C.tealLt }),
              React.createElement(KPI, { label:"Multiplier vs A mid", value:scenario==="B" ? (+(pomeDMday/+(ffbDay*2/1000).toFixed(3)).toFixed(1))+"×" : "1×", unit:"vs Sc-A mid 2 kg", color:C.amber })
            ),
            React.createElement("div", { style:{ marginTop:8, background:C.navyDk, borderRadius:6, padding:"6px 10px", fontSize:11, color:C.grey } },
              React.createElement("span", { style:{ color:C.green } }, "DM = "),
              ffbDay+" t FFB/day \u00D7 "+dmVal+" kg/t \u00F7 1000 = ",
              React.createElement("span", { style:{ color:C.green, fontWeight:700 } }, pomeDMday+" t DM/day")
            )
          )
        )
      ),

      // MC TABLE
      React.createElement("div", { style:{ background:C.navyMid, borderRadius:8, padding:14, border:"1px solid "+C.amber+"33", marginBottom:12 } },
        React.createElement("div", { style:{ color:C.amber, fontWeight:800, fontSize:11, letterSpacing:"0.06em", marginBottom:10, borderLeft:"3px solid "+C.amber, paddingLeft:8 } }, "\uD83D\uDCA7  MOISTURE CONTENT \u2014 CLICK ROW TO LOCK"),
        React.createElement("div", { style:{ display:"grid", gridTemplateColumns:"60px 1fr 1fr 1fr 1fr 1fr 56px", gap:4, marginBottom:5, padding:"0 6px" } },
          ["MC%","FW t/day","Water t/day","DM t/day","% FFB","FW t/mo",""].map(function(h) {
            return React.createElement("div", { key:h, style:{ color:C.grey, fontSize:9, textTransform:"uppercase", letterSpacing:"0.05em", fontWeight:700 } }, h);
          })
        ),
        rows.map(function(row) {
          var active=row.mc===lockedMC;
          return React.createElement("div", { key:row.mc, onClick:function(){ setLockedMC(row.mc); },
            style:{ display:"grid", gridTemplateColumns:"60px 1fr 1fr 1fr 1fr 1fr 56px",
                    gap:4, padding:"8px 6px", borderRadius:6, marginBottom:2, cursor:"pointer",
                    background:active?sc.color+"22":C.navyLt, border:"1px solid "+(active?sc.color:"transparent"), transition:"all 0.12s" }
          },
            React.createElement("div", { style:{ color:active?sc.color:C.white, fontWeight:active?900:600, fontSize:13 } }, row.mc+"%"),
            React.createElement("div", { style:{ color:active?C.tealLt:C.white, fontWeight:700, fontSize:12 } }, row.fw+" t"),
            React.createElement("div", { style:{ color:active?C.tealLt:C.grey, fontSize:12 } }, row.water+" t"),
            React.createElement("div", { style:{ color:C.green, fontSize:12, fontWeight:700 } }, pomeDMday+" t"),
            React.createElement("div", { style:{ color:active?C.amber:C.grey, fontSize:12 } }, row.pctFFB+"%"),
            React.createElement("div", { style:{ color:active?C.teal:C.grey, fontSize:12 } }, (row.fw*days).toFixed(1)+" t"),
            React.createElement("div", { style:{ background:active?sc.color+"33":"transparent", border:"1px solid "+(active?sc.color:"transparent"), borderRadius:10, padding:"1px 5px", color:active?sc.color:"transparent", fontSize:9, fontWeight:700, textAlign:"center" } }, active?"LOCKED":"\u00A0")
          );
        })
      ),

      // SCENARIO COMPARISON
      React.createElement("div", { style:{ background:C.navyMid, borderRadius:8, padding:14, border:"1px solid "+C.purple+"33", marginBottom:12 } },
        React.createElement("div", { style:{ color:C.purple, fontWeight:800, fontSize:11, letterSpacing:"0.06em", marginBottom:10, borderLeft:"3px solid "+C.purple, paddingLeft:8 } }, "\uD83D\uDCCA  ALL SCENARIOS \u2014 MC LOCKED "+lockedMC+"% · t/day"),
        React.createElement("div", { style:{ display:"grid", gridTemplateColumns:"1fr 70px 90px 90px 90px", gap:4, marginBottom:5, padding:"0 6px" } },
          ["Scenario","Point","kg DM/t FFB","DM t/day","FW t/day"].map(function(h) {
            return React.createElement("div", { key:h, style:{ color:C.grey, fontSize:9, textTransform:"uppercase", letterSpacing:"0.05em", fontWeight:700 } }, h);
          })
        ),
        rangeRows.map(function(r) {
          var s=SCENARIOS[r.scenario]; var isActive=r.scenario===scenario && r.point===dmPoint;
          return React.createElement("div", { key:r.scenario+r.point,
            style:{ display:"grid", gridTemplateColumns:"1fr 70px 90px 90px 90px", gap:4, padding:"6px 6px",
                    borderRadius:5, marginBottom:2, background:isActive?s.color+"22":C.navyLt, border:"1px solid "+(isActive?s.color:"transparent") }
          },
            React.createElement("div", { style:{ color:s.color, fontSize:11, fontWeight:isActive?800:400 } }, s.label.split("—")[0]),
            React.createElement("div", { style:{ color:C.grey, fontSize:11, textTransform:"uppercase" } }, r.point),
            React.createElement("div", { style:{ color:isActive?s.color:C.white, fontWeight:isActive?900:600, fontSize:12 } }, r.dmKgFFB),
            React.createElement("div", { style:{ color:C.green, fontSize:12, fontWeight:700 } }, r.dm+" t"),
            React.createElement("div", { style:{ color:C.amber, fontSize:12 } }, r.fw+" t")
          );
        })
      ),

      // LOCKED SPEC
      React.createElement("div", { style:{ background:C.navyDk, borderRadius:8, padding:14, border:"2px solid "+sc.color+"66", marginBottom:12 } },
        React.createElement("div", { style:{ color:sc.color, fontWeight:800, fontSize:11, letterSpacing:"0.06em", marginBottom:12, borderLeft:"3px solid "+sc.color, paddingLeft:8 } },
          "\u2705  LOCKED SPEC \u2014 "+sc.label.toUpperCase()+" \u00B7 "+dmPoint.toUpperCase()+" \u00B7 MC "+lockedMC+"%"
        ),
        React.createElement("div", { style:{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:8, marginBottom:10 } },
          React.createElement(KPI, { label:"Fresh Weight/Day", value:lockedRow.fw+" t", unit:"t FW/day", color:sc.color, large:true }),
          React.createElement(KPI, { label:"Dry Matter/Day", value:pomeDMday+" t", unit:"t DM/day", color:C.green, large:true }),
          React.createElement(KPI, { label:"Moisture", value:lockedMC+"%", unit:"wet basis — locked", color:C.amber, large:true }),
          React.createElement(KPI, { label:"Water/Day", value:lockedRow.water+" t", color:C.grey }),
          React.createElement(KPI, { label:"% of FFB (FW)", value:lockedRow.pctFFB+"%", unit:"post-decanter", color:C.tealLt })
        ),
        React.createElement("div", { style:{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:10 } },
          React.createElement(KPI, { label:"Monthly FW", value:(lockedRow.fw*days).toFixed(1)+" t", color:sc.color }),
          React.createElement(KPI, { label:"Monthly DM", value:pomeDMmonth+" t", color:C.green }),
          React.createElement(KPI, { label:"Annual DM", value:(+(pomeDMmonth*12).toFixed(1))+" t", color:C.tealLt })
        ),
        React.createElement("div", { style:{ background:"#050E18", borderRadius:6, padding:"8px 12px", fontFamily:"monospace", fontSize:11, color:C.grey, lineHeight:2.0 } },
          React.createElement("div", { style:{ color:sc.color, fontWeight:700, marginBottom:2 } }, "FORMULA AUDIT"),
          React.createElement("div", null, "effFFB = ",ffb," × ",util,"% = ",effFFB," t/hr"),
          React.createElement("div", null, "FFB/day = ",effFFB," × ",hrs," hrs = ",ffbDay," t/day"),
          React.createElement("div", null, "DM/day = ",ffbDay," × ",dmVal," ÷ 1000 = ",React.createElement("span",{style:{color:C.green,fontWeight:700}},pomeDMday," t DM/day")),
          React.createElement("div", null, "FW/day = ",pomeDMday," ÷ (1−",lockedMC,"/100) = ",React.createElement("span",{style:{color:sc.color,fontWeight:700}},lockedRow.fw," t FW/day"))
        )
      ),

      // ═══ PROCESS FLOW PANEL ═══
      panel==="flow" ? React.createElement("div", { style:{ background:C.navyMid, borderRadius:8, padding:16, border:"1px solid "+C.teal+"44", marginBottom:12 } },
        React.createElement("div", { style:{ color:C.teal, fontWeight:800, fontSize:12, letterSpacing:"0.06em", marginBottom:14, borderLeft:"3px solid "+C.teal, paddingLeft:8 } },
          "\uD83D\uDD04  POME PROCESS FLOW \u2014 6 STEPS (60 TPH REFERENCE MILL)"
        ),
        PROCESS_STEPS.map(function(s, i) {
          return React.createElement("div", { key:s.num,
            style:{ display:"grid", gridTemplateColumns:"36px 1fr", gap:10, marginBottom:6 }
          },
            React.createElement("div", { style:{ display:"flex", flexDirection:"column", alignItems:"center" } },
              React.createElement("div", { style:{ width:32, height:32, borderRadius:"50%", background:s.color+"22", border:"2px solid "+s.color, display:"flex", alignItems:"center", justifyContent:"center", color:s.color, fontWeight:900, fontSize:13 } }, s.num),
              i < PROCESS_STEPS.length-1 ? React.createElement("div", { style:{ width:2, height:"100%", minHeight:20, background:s.color+"33", margin:"2px 0" } }) : null
            ),
            React.createElement("div", { style:{ background:C.navyLt, borderRadius:7, padding:"10px 12px", marginBottom:4 } },
              React.createElement("div", { style:{ color:s.color, fontWeight:800, fontSize:12, marginBottom:4 } }, s.title),
              React.createElement("div", { style:{ color:C.greyLt, fontSize:11, marginBottom:5, lineHeight:1.5 } }, s.desc),
              React.createElement("div", { style:{ display:"flex", gap:8, flexWrap:"wrap" } },
                React.createElement("div", { style:{ background:C.navyDk, borderRadius:5, padding:"3px 8px", color:C.grey, fontSize:10 } }, s.spec),
                React.createElement("div", { style:{ background:s.color+"22", borderRadius:5, padding:"3px 8px", color:s.color, fontSize:10, fontWeight:700 } }, "@ "+ffb+" TPH: "+s.atFFB60)
              )
            )
          );
        })
      ) : null,

      // ═══ EQUIPMENT PANEL ═══
      panel==="equip" ? React.createElement("div", { style:{ background:C.navyMid, borderRadius:8, padding:16, border:"1px solid "+C.amber+"44", marginBottom:12 } },
        React.createElement("div", { style:{ color:C.amber, fontWeight:800, fontSize:12, letterSpacing:"0.06em", marginBottom:14, borderLeft:"3px solid "+C.amber, paddingLeft:8 } },
          "\uD83D\uDD27  EQUIPMENT SIZING \u2014 "+ffb+" TPH MILL \u00B7 SUPPLIERS \u00B7 CAPEX"
        ),
        // Sizing table
        React.createElement("div", { style:{ marginBottom:14 } },
          React.createElement("div", { style:{ color:C.grey, fontSize:10, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:8 } }, "KEY UNIT OPERATIONS"),
          [
            { unit:"POME Cooling / EQ", duty:pomeM3hr+"–"+Math.round(pomeM3hr*1.1)+" m³/h · 80–90°C → 35–40°C", note:"EQ tank "+Math.round(pomeM3hr*12)+"–"+Math.round(pomeM3hr*24)+" m³ for 12–24h HRT" },
            { unit:"Secondary Decanter (new)", duty:Math.round(pomeM3hr)+"–"+Math.round(pomeM3hr*1.1)+" m³/h full POME", note:"3-phase or 2-phase · 3,000–4,000 g · 30–50% TS capture" },
            { unit:"Sludge Buffer Tank", duty:"10–30 m³ · 4–8 h residence", note:"For trucking or on-site pressing" },
            { unit:"Sludge Press (optional)", duty:"3–5 m³/h sludge · 20→30–35% DM", note:"Screw press or belt filter" },
            { unit:"Anaerobic Reactor", duty:"28 m³ biogas/m³ POME · HRT 22d", note:"Covered lagoon or CSTR/EGSB" },
          ].map(function(r) {
            return React.createElement("div", { key:r.unit,
              style:{ display:"grid", gridTemplateColumns:"200px 1fr 1fr", gap:8, padding:"8px 10px", borderRadius:6, background:C.navyLt, marginBottom:3 }
            },
              React.createElement("div", { style:{ color:C.teal, fontSize:11, fontWeight:700 } }, r.unit),
              React.createElement("div", { style:{ color:C.white, fontSize:11 } }, r.duty),
              React.createElement("div", { style:{ color:C.grey, fontSize:10 } }, r.note)
            );
          })
        ),
        // Suppliers
        React.createElement("div", { style:{ color:C.grey, fontSize:10, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:8 } }, "EQUIPMENT SUPPLIERS"),
        SUPPLIERS.map(function(s) {
          return React.createElement("div", { key:s.name,
            style:{ display:"grid", gridTemplateColumns:"160px 90px 90px 1fr", gap:8, padding:"8px 10px", borderRadius:6, background:C.navyLt, marginBottom:3 }
          },
            React.createElement("div", { style:{ color:s.type==="International"?C.teal:C.amber, fontSize:11, fontWeight:700 } }, s.name),
            React.createElement("div", { style:{ background:s.type==="International"?C.teal+"22":C.amber+"22", borderRadius:4, padding:"2px 6px", color:s.type==="International"?C.teal:C.amber, fontSize:9, fontWeight:700, textAlign:"center", alignSelf:"center", height:"fit-content" } }, s.type),
            React.createElement("div", { style:{ color:C.grey, fontSize:10 } }, s.range),
            React.createElement("div", null,
              React.createElement("div", { style:{ color:C.greyLt, fontSize:11, marginBottom:2 } }, s.note),
              React.createElement("div", { style:{ color:C.amber, fontSize:10, fontWeight:700 } }, s.capex)
            )
          );
        }),
        React.createElement("div", { style:{ marginTop:10, background:C.navyDk, borderRadius:6, padding:"8px 12px", fontSize:10, color:C.grey } },
          "International OEM all-in CAPEX (equipment + foundations + E&I + engineering): ",
          React.createElement("span", { style:{ color:C.red, fontWeight:700 } }, ">$1M USD"),
          " for 40–50 m³/h duty at "+ffb+" TPH mill. Asian OEM 30–50% lower equipment cost but higher performance risk."
        )
      ) : null,

      // ═══ BIOGAS PANEL ═══
      panel==="biogas" ? React.createElement("div", { style:{ background:C.navyMid, borderRadius:8, padding:16, border:"1px solid "+C.green+"44", marginBottom:12 } },
        React.createElement("div", { style:{ color:C.green, fontWeight:800, fontSize:12, letterSpacing:"0.06em", marginBottom:14, borderLeft:"3px solid "+C.green, paddingLeft:8 } },
          "\u26A1  BIOGAS POTENTIAL \u2014 RESIDUAL LIQUID POME AFTER SOLIDS CAPTURE"
        ),
        React.createElement("div", { style:{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8, marginBottom:12 } },
          React.createElement(KPI, { label:"POME Flow", value:pomeM3day.toLocaleString()+" m³/day", unit:"@ 0.70 m³/t FFB mid", color:C.blue }),
          React.createElement(KPI, { label:"Biogas/Day", value:biogasDay.toLocaleString()+" m³", unit:"@ 28 m³/m³ POME", color:C.green, large:true }),
          React.createElement(KPI, { label:"Methane/Day", value:ch4Day.toLocaleString()+" m³", unit:"@ 15.4 m³ CH₄/m³", color:C.green, large:true }),
          React.createElement(KPI, { label:"CO₂e Avoided/Day", value:ghgAvoidedDay.toLocaleString()+" kg", unit:"vs open ponding · 378 kg/m³", color:C.amber })
        ),
        React.createElement("div", { style:{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:12 } },
          React.createElement(KPI, { label:"Biogas/Month", value:(biogasDay*days).toLocaleString()+" m³", color:C.tealLt }),
          React.createElement(KPI, { label:"CO₂e Avoided/Month", value:((ghgAvoidedDay*days)/1000).toFixed(0)+" t CO₂e", color:C.amber }),
          React.createElement(KPI, { label:"CO₂e Avoided/Year", value:((ghgAvoidedDay*days*12)/1000).toFixed(0)+" t CO₂e", color:C.red })
        ),
        React.createElement("div", { style:{ background:C.navyLt, borderRadius:6, padding:"10px 12px", marginBottom:8 } },
          React.createElement("div", { style:{ color:C.green, fontWeight:700, fontSize:11, marginBottom:6 } }, "POME SOLIDS MASS BALANCE AFTER CAPTURE"),
          React.createElement("div", { style:{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 } },
            React.createElement(KPI, { label:"Total TS/t FFB", value:"26–38 kg", unit:"in raw POME [R7]", color:C.grey }),
            React.createElement(KPI, { label:"TS Captured (Sc B)", value:"8–19 kg", unit:"30–50% removed as sludge", color:sc.color }),
            React.createElement(KPI, { label:"TS Remaining in Liquid", value:"18–30 kg", unit:"dissolved/fine — to biogas", color:C.blue })
          )
        ),
        React.createElement("div", { style:{ background:C.navyDk, borderRadius:6, padding:"8px 12px", fontSize:10, color:C.grey, lineHeight:1.8 } },
          React.createElement("span", { style:{ color:C.amber, fontWeight:700 } }, "Key: "),
          "Even with aggressive Scenario B solids capture (~50% TS), ~50% of original solids and nearly ALL dissolved COD remain in the POME liquid and must route to anaerobic digestion + aerobic polishing. Open ponding baseline: 336–420 kg CO\u2082e/m\u00B3 POME."
        )
      ) : null,

      // DERIVATION
      panel==="deriv" ? React.createElement("div", { style:{ background:C.navyMid, borderRadius:8, padding:14, border:"1px solid "+sc.color+"44", marginBottom:12 } },
        React.createElement("div", { style:{ color:sc.color, fontWeight:800, fontSize:11, letterSpacing:"0.06em", marginBottom:12, borderLeft:"3px solid "+sc.color, paddingLeft:8 } }, "\uD83D\uDD17  DERIVATION CHAIN \u2014 "+sc.label),
        sc.derivation.map(function(d) {
          return React.createElement("div", { key:d.step,
            style:{ display:"grid", gridTemplateColumns:"28px 1fr 200px 80px", gap:8, padding:"7px 8px", borderRadius:6, marginBottom:3,
                    background:d.highlight?sc.color+"22":C.navyLt, border:"1px solid "+(d.highlight?sc.color+"55":"transparent") }
          },
            React.createElement("div", { style:{ color:d.highlight?sc.color:C.grey, fontWeight:900, fontSize:13, textAlign:"center" } }, d.step),
            React.createElement("div", { style:{ color:d.highlight?C.white:C.greyLt, fontSize:11, fontWeight:d.highlight?700:400 } }, d.desc),
            React.createElement("div", { style:{ color:d.highlight?sc.color:C.amber, fontSize:11, fontWeight:d.highlight?900:600 } }, d.value),
            React.createElement("div", { style:{ color:C.grey, fontSize:10 } }, d.ref)
          );
        })
      ) : null,

      // REFS
      panel==="refs" ? React.createElement("div", { style:{ background:C.navyMid, borderRadius:8, padding:14, border:"1px solid "+C.purple+"44", marginBottom:12 } },
        React.createElement("div", { style:{ color:C.purple, fontWeight:800, fontSize:11, letterSpacing:"0.06em", marginBottom:12, borderLeft:"3px solid "+C.purple, paddingLeft:8 } }, "\uD83D\uDCDA  LITERATURE REFERENCES \u2014 8 SOURCES"),
        REFS.map(function(r) {
          return React.createElement("div", { key:r.id,
            style:{ display:"grid", gridTemplateColumns:"32px 160px 1fr", gap:10, padding:"7px 8px", borderRadius:6, marginBottom:3, background:C.navyLt }
          },
            React.createElement("div", { style:{ color:C.teal, fontWeight:900, fontSize:12, textAlign:"center" } }, r.id),
            React.createElement("div", { style:{ color:C.amber, fontSize:11, fontWeight:700, lineHeight:1.4 } }, r.tag),
            React.createElement("div", { style:{ color:C.grey, fontSize:11, lineHeight:1.5 } }, r.detail)
          );
        }),
        React.createElement("div", { style:{ marginTop:10, background:C.navyDk, borderRadius:6, padding:"8px 12px", fontSize:10, color:C.grey, lineHeight:1.8 } },
          React.createElement("div", { style:{ color:C.teal, fontWeight:700, marginBottom:4 } }, "EVIDENCE CHAIN SUMMARY"),
          React.createElement("div", null, "0.65–0.75 m³ POME/t FFB [R1] × 60% to clarifier [R1] = 0.4–0.5 m³/t FFB to decanter"),
          React.createElement("div", null, "8–15 kg wet/m³ [R4] × 20–35% DM [R3] = 1.6–5.3 kg DM/m³ → Sc-A: 1–3 kg DM/t FFB"),
          React.createElement("div", null, "Full POME TS 26–38 kg/t [R7] × 30–50% capture [R5] × 20–35% DM [R3] = +2–7 kg DM → Sc-B: 5–10 kg DM/t FFB")
        )
      ) : null

    )
  );
}
