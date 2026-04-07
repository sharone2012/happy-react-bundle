const { useState, useMemo } = React;

const C = {
  navy:"#0B1929", navyMid:"#0F2236", navyLt:"#162E45", navyDk:"#070F1A",
  teal:"#00C9B1", tealDk:"#009E8C", tealLt:"#5EEADA",
  amber:"#F5A623", amberLt:"#FFD080",
  green:"#3DCB7A", red:"#E84040", purple:"#9B59B6", blue:"#4A9EE0",
  orange:"#E8803A", gold:"#D4A017",
  white:"#F0F4F8", grey:"#8BA0B4", greyLt:"#C4D3E0",
};

// CFI canonical OPDC values — LOCKED, never change
const OPDC_CANONICAL = {
  yieldPctFFB: 4.2,        // % of FFB fresh weight — LOCKED
  yieldPctEFB: 15.2,       // % of EFB fresh weight — LOCKED (cross-check only)
  mcDefault: 70,           // % moisture wet basis
  mcMin: 40,               // HARD FLOOR — press discharge must never go below
  lignin: 30.7,            // % DM
  protein: 14.5,           // % DM (N×4.67)
  cn: 20,                  // C:N ratio
  ash: 4.8,                // % DM
  ndk: 3.11,               // % DM — N (14.5/4.67)
  pdk: 0.42,               // % DM — P2O5
  kdk: 1.85,               // % DM — K2O
  cadk: 0.31,              // % DM — Ca
  mgdk: 0.18,              // % DM — Mg
  // Self-sufficiency
  selfSuffRatio: 0.38,     // natural OPDC supply vs BSF requirement
  importRequired: 42,      // t DM/day from sister mills at 60 TPH
};

const MC_OPTIONS = [40, 50, 60, 65, 68, 70, 72, 75];

function NumInput({ label, unit, value, onChange, min, max, step, note, locked, warn }) {
  return React.createElement("div", { style:{ marginBottom:14 } },
    React.createElement("div", { style:{ color:C.grey, fontSize:10, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:4 } },
      label,
      unit ? React.createElement("span", { style:{ color:C.teal, marginLeft:4 } }, "[", unit, "]") : null,
      locked ? React.createElement("span", { style:{ color:C.amber, marginLeft:6, fontSize:9, fontWeight:700 } }, "CANONICAL") : null,
      warn  ? React.createElement("span", { style:{ color:C.red,   marginLeft:6, fontSize:9, fontWeight:700 } }, "⚠ GUARDRAIL") : null
    ),
    React.createElement("input", { type:"number", value:value, min:min, max:max, step:step||0.1,
      onChange:function(e){ onChange(parseFloat(e.target.value)||0); },
      style:{ background: warn?"#2A1A1A": locked?"#1A2E20":"#1A3550",
              border:"1px solid "+(warn?C.red:locked?C.green:C.teal)+"55",
              borderRadius:5, color: warn?C.red: locked?C.green:C.amberLt,
              padding:"7px 10px", fontSize:14, fontWeight:700, width:"100%", outline:"none", boxSizing:"border-box" } }),
    note ? React.createElement("div", { style:{ color: warn?C.red+"CC":C.grey, fontSize:10, marginTop:3 } }, note) : null
  );
}

function KPI({ label, value, unit, color, large, alert }) {
  return React.createElement("div", {
    style:{ background: alert?C.red+"11":C.navyLt, borderRadius:8,
            padding:large?"14px 16px":"10px 14px",
            border:"1px solid "+(alert?C.red:color||C.teal)+"33", textAlign:"center" }
  },
    React.createElement("div", { style:{ color:C.grey, fontSize:10, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:4 } }, label),
    React.createElement("div", { style:{ color: alert?C.red: color||C.teal, fontSize:large?22:16, fontWeight:900 } }, value),
    unit ? React.createElement("div", { style:{ color: alert?C.red+"99":C.grey, fontSize:10, marginTop:2 } }, unit) : null
  );
}

function Badge({ label, color }) {
  return React.createElement("span", {
    style:{ background:(color||C.teal)+"22", border:"1px solid "+(color||C.teal)+"55",
            borderRadius:10, padding:"2px 7px", color:color||C.teal, fontSize:9, fontWeight:700, marginLeft:6 }
  }, label);
}

export default function CFI_OPDC_DM_Calc() {
  const [ffb,       setFfb]      = useState(60);
  const [util,      setUtil]     = useState(85);
  const [hrs,       setHrs]      = useState(24);
  const [days,      setDays]     = useState(30);
  const [yieldPct,  setYieldPct] = useState(OPDC_CANONICAL.yieldPctFFB);
  const [mc,        setMc]       = useState(OPDC_CANONICAL.mcDefault);
  const [lockedMC,  setLockedMC] = useState(70);
  const [showNutr,  setShowNutr] = useState(false);
  const [showComp,  setShowComp] = useState(false);
  const [showSuff,  setShowSuff] = useState(false);

  const mcBelowFloor = mc < OPDC_CANONICAL.mcMin;

  const effFFB     = +(ffb * util / 100).toFixed(2);
  const ffbDay     = +(effFFB * hrs).toFixed(1);
  const ffbMonth   = +(ffbDay * days).toFixed(0);

  // OPDC fresh weight — anchored to 4.2% FFB
  const opdcFWhr    = +(effFFB * yieldPct / 100).toFixed(3);
  const opdcFWday   = +(opdcFWhr * hrs).toFixed(2);
  const opdcFWmonth = +(opdcFWday * days).toFixed(1);

  // OPDC DM
  const dmFrac      = (100 - mc) / 100;
  const opdcDMhr    = +(opdcFWhr * dmFrac).toFixed(4);
  const opdcDMday   = +(opdcFWday * dmFrac).toFixed(3);
  const opdcDMmonth = +(opdcDMday * days).toFixed(2);
  const waterDay    = +(opdcFWday - opdcDMday).toFixed(3);

  // Self-sufficiency
  const bsfReqDMday  = +(opdcDMday / OPDC_CANONICAL.selfSuffRatio).toFixed(2);
  const shortfallDM  = +(bsfReqDMday - opdcDMday).toFixed(2);
  const selfSuffPct  = +(opdcDMday / bsfReqDMday * 100).toFixed(1);

  // Nutrient loads
  const nDay  = +(opdcDMday * 1000 * OPDC_CANONICAL.ndk  / 100).toFixed(1);
  const pDay  = +(opdcDMday * 1000 * OPDC_CANONICAL.pdk  / 100).toFixed(1);
  const kDay  = +(opdcDMday * 1000 * OPDC_CANONICAL.kdk  / 100).toFixed(1);
  const caDay = +(opdcDMday * 1000 * OPDC_CANONICAL.cadk / 100).toFixed(1);
  const mgDay = +(opdcDMday * 1000 * OPDC_CANONICAL.mgdk / 100).toFixed(1);

  const ligninDay  = +(opdcDMday * OPDC_CANONICAL.lignin  / 100).toFixed(3);
  const proteinDay = +(opdcDMday * OPDC_CANONICAL.protein / 100).toFixed(3);

  // EFB cross-check
  const efbFWday     = +(ffbDay * 22.5 / 100).toFixed(1);
  const opdcPctEFB   = +(opdcFWday / efbFWday * 100).toFixed(2);

  // MC table
  const rows = useMemo(function() {
    return MC_OPTIONS.map(function(mcOpt) {
      var df   = (100 - mcOpt) / 100;
      var fw   = +(opdcDMday / df).toFixed(2);
      var wt   = +(fw - opdcDMday).toFixed(2);
      var pct  = +(fw / ffbDay * 100).toFixed(3);
      var flag = mcOpt < OPDC_CANONICAL.mcMin;
      return { mc:mcOpt, fw:fw, dm:opdcDMday, water:wt, pctFFB:pct, flag:flag };
    });
  }, [opdcDMday, ffbDay]);

  var lockedRow = rows.find(function(r){ return r.mc===lockedMC; }) ||
    { mc:mc, fw:opdcFWday, dm:opdcDMday, water:waterDay, pctFFB:+(opdcFWday/ffbDay*100).toFixed(3), flag:false };

  return React.createElement("div", {
    style:{ background:C.navy, minHeight:"100vh", fontFamily:"'DM Sans',system-ui,sans-serif", color:C.white, padding:"0 0 60px" }
  },

    // HEADER
    React.createElement("div", {
      style:{ background:"linear-gradient(135deg,"+C.navyMid+" 0%,#1A100A 100%)", borderBottom:"2px solid "+C.amber+"55", padding:"14px 20px" }
    },
      React.createElement("div", { style:{ display:"flex", alignItems:"center", justifyContent:"space-between" } },
        React.createElement("div", { style:{ display:"flex", alignItems:"center", gap:10 } },
          React.createElement("div", { style:{ background:C.amber, width:36, height:36, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 } }, "\uD83E\uDEA8"),
          React.createElement("div", null,
            React.createElement("div", { style:{ color:C.amber, fontWeight:900, fontSize:14, letterSpacing:"0.07em" } }, "CFI \u2014 OPDC DRY MATTER CALCULATOR"),
            React.createElement("div", { style:{ color:C.grey, fontSize:10 } },
              "Oil Palm Decanter Cake \u00B7 4.2% of FFB (locked) \u00B7 70% MC \u00B7 Press floor: 40% MC hard guardrail"
            )
          )
        ),
        React.createElement("div", { style:{ display:"flex", gap:6 } },
          React.createElement("button", { onClick:function(){ setShowNutr(!showNutr); },
            style:{ background:showNutr?C.green+"22":"transparent", border:"1px solid "+C.green+"55", borderRadius:6, color:C.green, padding:"5px 10px", fontSize:10, cursor:"pointer", fontWeight:700 }
          }, showNutr?"\u25BC Nutrients":"\u25B6 Nutrients"),
          React.createElement("button", { onClick:function(){ setShowComp(!showComp); },
            style:{ background:showComp?C.purple+"22":"transparent", border:"1px solid "+C.purple+"55", borderRadius:6, color:C.purple, padding:"5px 10px", fontSize:10, cursor:"pointer", fontWeight:700 }
          }, showComp?"\u25BC Composition":"\u25B6 Composition"),
          React.createElement("button", { onClick:function(){ setShowSuff(!showSuff); },
            style:{ background:showSuff?C.red+"22":"transparent", border:"1px solid "+C.red+"55", borderRadius:6, color:C.red, padding:"5px 10px", fontSize:10, cursor:"pointer", fontWeight:700 }
          }, showSuff?"\u25BC Self-Sufficiency":"\u25B6 Self-Sufficiency")
        )
      )
    ),

    // MC FLOOR ALERT
    mcBelowFloor ? React.createElement("div", {
      style:{ background:C.red+"22", borderBottom:"2px solid "+C.red, padding:"10px 20px", display:"flex", alignItems:"center", gap:10 }
    },
      React.createElement("div", { style:{ fontSize:20 } }, "\uD83D\uDED1"),
      React.createElement("div", null,
        React.createElement("div", { style:{ color:C.red, fontWeight:900, fontSize:13 } }, "GUARDRAIL VIOLATION \u2014 PRESS DISCHARGE MC BELOW 40% FLOOR"),
        React.createElement("div", { style:{ color:C.red+"CC", fontSize:11 } },
          "MC "+mc+"% is below the 40% minimum. Pore damage kills BSF colonisation. Set MC \u2265 40%."
        )
      )
    ) : null,

    React.createElement("div", { style:{ maxWidth:940, margin:"0 auto", padding:"16px 14px" } },

      // MAIN GRID
      React.createElement("div", { style:{ display:"grid", gridTemplateColumns:"310px 1fr", gap:12, marginBottom:12 } },

        // LEFT inputs
        React.createElement("div", { style:{ background:C.navyMid, borderRadius:8, padding:14, border:"1px solid "+C.amber+"22" } },
          React.createElement("div", { style:{ color:C.amber, fontWeight:800, fontSize:11, letterSpacing:"0.06em", marginBottom:12, borderLeft:"3px solid "+C.amber, paddingLeft:8 } }, "\u2699\uFE0F  MILL PARAMETERS"),
          React.createElement(NumInput, { label:"FFB Mill Capacity", unit:"TPH", value:ffb, onChange:setFfb, min:10, max:200, step:5 }),
          React.createElement(NumInput, { label:"Utilisation", unit:"%", value:util, onChange:setUtil, min:50, max:100, step:1 }),
          React.createElement(NumInput, { label:"Operating Hours", unit:"hrs/day", value:hrs, onChange:setHrs, min:8, max:24, step:1 }),
          React.createElement(NumInput, { label:"Operating Days", unit:"days/month", value:days, onChange:setDays, min:20, max:31, step:1 }),
          React.createElement("hr", { style:{ border:"none", borderTop:"1px solid "+C.navyLt, margin:"10px 0" } }),
          React.createElement("div", { style:{ color:C.amber, fontWeight:800, fontSize:11, letterSpacing:"0.06em", marginBottom:10, borderLeft:"3px solid "+C.amber, paddingLeft:8 } }, "\uD83E\uDEA8  OPDC STREAM PARAMETERS"),
          React.createElement(NumInput, {
            label:"OPDC Yield", unit:"% of FFB (FW)",
            value:yieldPct, onChange:setYieldPct, min:3.0, max:6.0, step:0.1,
            note:"Canonical: 4.2% · Range: 3.5–5.0% · Also = 15.2% of EFB FW",
            locked:yieldPct===OPDC_CANONICAL.yieldPctFFB
          }),
          React.createElement(NumInput, {
            label:"Moisture Content", unit:"% wet basis",
            value:mc, onChange:setMc, min:35, max:80, step:0.5,
            note: mc < 40 ? "⛔ BELOW 40% HARD FLOOR — pore damage kills BSF colonisation" : "Canonical: 70% · Press floor: 40% minimum — never go below",
            locked:mc===70, warn:mcBelowFloor
          }),
          React.createElement("div", { style:{ display:"flex", gap:6, marginTop:4 } },
            React.createElement("button", { onClick:function(){ setYieldPct(4.2); setMc(70); },
              style:{ background:C.amber+"22", border:"1px solid "+C.amber+"55", borderRadius:5, color:C.amber, padding:"5px 10px", fontSize:10, cursor:"pointer", fontWeight:700, flex:1 }
            }, "\u21BA Reset to Canonical"),
            React.createElement("button", { onClick:function(){ if(mc<40) setMc(40); },
              style:{ background:mc<40?C.red+"33":"transparent", border:"1px solid "+(mc<40?C.red:C.navyLt), borderRadius:5, color:mc<40?C.red:C.grey, padding:"5px 10px", fontSize:10, cursor:"pointer", fontWeight:700 }
            }, "Set MC=40% floor")
          ),

          // EFB cross-check panel
          React.createElement("div", { style:{ marginTop:12, background:C.navyDk, borderRadius:6, padding:"8px 10px", border:"1px solid "+C.teal+"33" } },
            React.createElement("div", { style:{ color:C.teal, fontSize:10, fontWeight:700, marginBottom:6, textTransform:"uppercase", letterSpacing:"0.05em" } }, "\u2194\uFE0F  EFB Cross-Check"),
            React.createElement("div", { style:{ color:C.grey, fontSize:10, lineHeight:1.8 } },
              "EFB FW/day = ",React.createElement("span",{style:{color:C.green}},efbFWday," t"),
              React.createElement("br"),
              "OPDC FW/day = ",React.createElement("span",{style:{color:C.amber}},opdcFWday," t"),
              React.createElement("br"),
              "OPDC as % EFB = ",
              React.createElement("span",{style:{color:Math.abs(opdcPctEFB-15.2)<0.5?C.green:C.red, fontWeight:700}},
                opdcPctEFB,"% ",Math.abs(opdcPctEFB-15.2)<0.5?"\u2713":"≠ 15.2% canonical"
              )
            )
          )
        ),

        // RIGHT KPIs
        React.createElement("div", { style:{ display:"flex", flexDirection:"column", gap:10 } },

          // FFB row
          React.createElement("div", { style:{ background:C.navyMid, borderRadius:8, padding:12, border:"1px solid "+C.teal+"22" } },
            React.createElement("div", { style:{ color:C.teal, fontWeight:800, fontSize:11, letterSpacing:"0.06em", marginBottom:10, borderLeft:"3px solid "+C.teal, paddingLeft:8 } }, "\uD83C\uDFED  FFB THROUGHPUT"),
            React.createElement("div", { style:{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 } },
              React.createElement(KPI, { label:"Effective Rate", value:effFFB+" t/hr", unit:ffb+" TPH × "+util+"%", color:C.teal }),
              React.createElement(KPI, { label:"FFB/Day", value:ffbDay.toLocaleString()+" t", color:C.teal }),
              React.createElement(KPI, { label:"FFB/Month", value:ffbMonth.toLocaleString()+" t", color:C.tealLt })
            )
          ),

          // OPDC Fresh Weight
          React.createElement("div", { style:{ background:C.navyMid, borderRadius:8, padding:12, border:"1px solid "+C.amber+"44" } },
            React.createElement("div", { style:{ color:C.amber, fontWeight:800, fontSize:11, letterSpacing:"0.06em", marginBottom:10, borderLeft:"3px solid "+C.amber, paddingLeft:8 } },
              "\uD83D\uDCE6  OPDC FRESH WEIGHT",
              React.createElement(Badge, { label:yieldPct+"% of FFB", color:C.amber }),
              React.createElement(Badge, { label:"=15.2% of EFB", color:C.tealLt })
            ),
            React.createElement("div", { style:{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 } },
              React.createElement(KPI, { label:"FW per Hour", value:opdcFWhr+" t", unit:"t FW/hr", color:C.amber }),
              React.createElement(KPI, { label:"FW per Day", value:opdcFWday+" t", unit:"t FW/day", color:C.amber, large:true }),
              React.createElement(KPI, { label:"FW per Month", value:opdcFWmonth+" t", unit:"t FW/month", color:C.amberLt })
            )
          ),

          // OPDC DM
          React.createElement("div", { style:{ background:C.navyMid, borderRadius:8, padding:12, border:"2px solid "+C.gold+"55" } },
            React.createElement("div", { style:{ color:C.gold, fontWeight:800, fontSize:11, letterSpacing:"0.06em", marginBottom:10, borderLeft:"3px solid "+C.gold, paddingLeft:8 } },
              "\u2696\uFE0F  OPDC DRY MATTER",
              React.createElement(Badge, { label:"MC "+mc+"%", color:mcBelowFloor?C.red:C.gold }),
              React.createElement(Badge, { label:"DM "+(100-mc).toFixed(1)+"%", color:C.tealLt }),
              mcBelowFloor ? React.createElement(Badge, { label:"\u26A0 FLOOR BREACH", color:C.red }) : null
            ),
            React.createElement("div", { style:{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:8 } },
              React.createElement(KPI, { label:"DM per Hour", value:opdcDMhr+" t", unit:"t DM/hr", color:C.gold }),
              React.createElement(KPI, { label:"DM per Day", value:opdcDMday+" t", unit:"t DM/day", color:C.gold, large:true }),
              React.createElement(KPI, { label:"DM per Month", value:opdcDMmonth+" t", unit:"t DM/month", color:C.gold, large:true }),
              React.createElement(KPI, { label:"Water/Day", value:waterDay+" t", unit:"t water/day", color:C.grey })
            ),
            React.createElement("div", { style:{ marginTop:8, background:C.navyDk, borderRadius:6, padding:"6px 10px", fontSize:11, color:C.grey, lineHeight:1.8 } },
              React.createElement("span", { style:{ color:C.gold } }, "DM = "),
              "OPDC FW/day × (1 − MC/100) = ",
              opdcFWday," × (1 − ",mc,"/100) = ",
              React.createElement("span", { style:{ color:C.gold, fontWeight:700 } }, opdcDMday," t DM/day")
            )
          )
        )
      ),

      // MC TABLE
      React.createElement("div", { style:{ background:C.navyMid, borderRadius:8, padding:14, border:"1px solid "+C.amber+"33", marginBottom:12 } },
        React.createElement("div", { style:{ color:C.amber, fontWeight:800, fontSize:11, letterSpacing:"0.06em", marginBottom:10, borderLeft:"3px solid "+C.amber, paddingLeft:8 } },
          "\uD83D\uDCA7  OPDC MOISTURE CONTENT COMPARISON \u2014 CLICK TO LOCK"
        ),
        // Floor warning row
        React.createElement("div", { style:{ background:C.red+"11", border:"1px solid "+C.red+"44", borderRadius:6, padding:"6px 10px", marginBottom:8, display:"flex", alignItems:"center", gap:8 } },
          React.createElement("span", { style:{ fontSize:14 } }, "\uD83D\uDED1"),
          React.createElement("span", { style:{ color:C.red, fontSize:11, fontWeight:700 } }, "HARD FLOOR: 40% MC \u2014 Press discharge must never go below this. Pore damage kills BSF colonisation.")
        ),
        React.createElement("div", { style:{ display:"grid", gridTemplateColumns:"70px 1fr 1fr 1fr 1fr 1fr 56px", gap:4, marginBottom:5, padding:"0 6px" } },
          ["MC%","FW t/day","Water t/day","DM t/day","% of FFB","FW t/month",""].map(function(h) {
            return React.createElement("div", { key:h, style:{ color:C.grey, fontSize:9, textTransform:"uppercase", letterSpacing:"0.05em", fontWeight:700 } }, h);
          })
        ),
        rows.map(function(row) {
          var active  = row.mc===lockedMC;
          var isCanon = row.mc===70;
          var isBad   = row.flag;
          return React.createElement("div", { key:row.mc, onClick:function(){ setLockedMC(row.mc); },
            style:{ display:"grid", gridTemplateColumns:"70px 1fr 1fr 1fr 1fr 1fr 56px",
                    gap:4, padding:"8px 6px", borderRadius:6, marginBottom:2, cursor:"pointer",
                    background: isBad?C.red+"11": active?C.amber+"22":C.navyLt,
                    border:"1px solid "+(isBad?C.red+"55":active?C.amber:"transparent"), transition:"all 0.12s" }
          },
            React.createElement("div", { style:{ color:isBad?C.red:active?C.amber:C.white, fontWeight:active?900:600, fontSize:13, display:"flex", alignItems:"center", gap:3 } },
              row.mc+"%",
              isBad ? React.createElement("span",{style:{color:C.red,fontSize:9,fontWeight:900}},"\u26A0") : null,
              isCanon ? React.createElement("span",{style:{color:C.amber,fontSize:9}},"\u2605") : null
            ),
            React.createElement("div", { style:{ color:isBad?C.red:active?C.amberLt:C.white, fontWeight:700, fontSize:12 } }, row.fw.toFixed(1)+" t"),
            React.createElement("div", { style:{ color:isBad?C.red+"99":active?C.amberLt:C.grey, fontSize:12 } }, row.water.toFixed(1)+" t"),
            React.createElement("div", { style:{ color:isBad?C.red:C.gold, fontSize:12, fontWeight:700 } }, row.dm.toFixed(3)+" t"),
            React.createElement("div", { style:{ color:isBad?C.red+"99":active?C.amber:C.grey, fontSize:12 } }, row.pctFFB+"%"),
            React.createElement("div", { style:{ color:isBad?C.red+"99":active?C.teal:C.grey, fontSize:12 } }, (row.fw*days).toFixed(1)+" t"),
            React.createElement("div", {
              style:{ background:isBad?C.red+"22":active?C.amber+"33":"transparent",
                      border:"1px solid "+(isBad?C.red:active?C.amber:"transparent"),
                      borderRadius:10, padding:"1px 5px", color:isBad?C.red:active?C.amber:"transparent",
                      fontSize:9, fontWeight:700, textAlign:"center" }
            }, isBad?"⛔":active?"LOCKED":"\u00A0")
          );
        }),
        React.createElement("div", { style:{ marginTop:6, padding:"0 6px", color:C.grey, fontSize:9 } }, "\u2605 = canonical 70% · \u26A0 = below 40% hard floor")
      ),

      // LOCKED SPEC
      React.createElement("div", { style:{ background:C.navyDk, borderRadius:8, padding:14, border:"2px solid "+C.amber+"55", marginBottom:12 } },
        React.createElement("div", { style:{ color:C.amber, fontWeight:800, fontSize:11, letterSpacing:"0.06em", marginBottom:12, borderLeft:"3px solid "+C.amber, paddingLeft:8 } },
          "\u2705  LOCKED OPDC SPECIFICATION \u2014 MC "+lockedMC+"% \u00B7 YIELD "+yieldPct+"% FFB"
        ),
        React.createElement("div", { style:{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:8, marginBottom:10 } },
          React.createElement(KPI, { label:"Fresh Weight/Day", value:lockedRow.fw.toFixed(2)+" t", unit:"t FW/day", color:C.amber, large:true }),
          React.createElement(KPI, { label:"Dry Matter/Day", value:lockedRow.dm.toFixed(3)+" t", unit:"t DM/day", color:C.gold, large:true }),
          React.createElement(KPI, { label:"Moisture", value:lockedMC+"%", unit:"wet basis — locked", color: lockedRow.flag?C.red:C.amber, large:true, alert:lockedRow.flag }),
          React.createElement(KPI, { label:"Water/Day", value:lockedRow.water.toFixed(2)+" t", color:C.grey }),
          React.createElement(KPI, { label:"% of FFB (FW)", value:lockedRow.pctFFB+"%", unit:"= 4.2% at canonical", color:C.tealLt })
        ),
        React.createElement("div", { style:{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:8, marginBottom:10 } },
          React.createElement(KPI, { label:"Monthly FW", value:opdcFWmonth+" t", color:C.amber }),
          React.createElement(KPI, { label:"Monthly DM", value:opdcDMmonth+" t", color:C.gold }),
          React.createElement(KPI, { label:"Annual DM", value:(+(opdcDMmonth*12).toFixed(1))+" t", color:C.tealLt }),
          React.createElement(KPI, { label:"Protein Load/Day", value:proteinDay+" t", unit:OPDC_CANONICAL.protein+"% DM — BSF feed", color:C.green })
        ),
        React.createElement("div", { style:{ background:"#050E18", borderRadius:6, padding:"8px 12px", fontFamily:"monospace", fontSize:11, color:C.grey, lineHeight:2.0 } },
          React.createElement("div", { style:{ color:C.amber, fontWeight:700, marginBottom:2 } }, "FORMULA AUDIT"),
          React.createElement("div", null, "effFFB       = ",ffb," × ",util,"% = ",effFFB," t/hr"),
          React.createElement("div", null, "FFB/day      = ",effFFB," × ",hrs," hrs = ",ffbDay," t/day"),
          React.createElement("div", null, "OPDC FW/day  = ",ffbDay," × ",yieldPct,"% = ",React.createElement("span",{style:{color:C.amber,fontWeight:700}},opdcFWday," t FW/day")),
          React.createElement("div", null, "OPDC DM/day  = ",opdcFWday," × (1 − ",lockedMC,"/100) = ",React.createElement("span",{style:{color:C.gold,fontWeight:700}},lockedRow.dm.toFixed(3)," t DM/day")),
          React.createElement("div", null, "EFB cross-chk: OPDC = EFB FW × 15.2% = ",efbFWday," × 15.2% = ",
            React.createElement("span",{style:{color:C.tealLt}},(efbFWday*0.152).toFixed(2)," t (vs ",opdcFWday," t — Δ ",(Math.abs(opdcFWday-(efbFWday*0.152))).toFixed(2)," t)"))
        )
      ),

      // SELF-SUFFICIENCY PANEL
      showSuff ? React.createElement("div", { style:{ background:C.navyMid, borderRadius:8, padding:14, border:"2px solid "+C.red+"44", marginBottom:12 } },
        React.createElement("div", { style:{ color:C.red, fontWeight:800, fontSize:11, letterSpacing:"0.06em", marginBottom:12, borderLeft:"3px solid "+C.red, paddingLeft:8 } },
          "\u26A0\uFE0F  OPDC SELF-SUFFICIENCY \u2014 SISTER-MILL IMPORT REQUIREMENT"
        ),
        React.createElement("div", { style:{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8, marginBottom:12 } },
          React.createElement(KPI, { label:"Natural OPDC DM/Day", value:opdcDMday+" t", unit:"from this mill only", color:C.amber }),
          React.createElement(KPI, { label:"BSF Required DM/Day", value:bsfReqDMday+" t", unit:"at self-suff ratio "+OPDC_CANONICAL.selfSuffRatio, color:C.blue }),
          React.createElement(KPI, { label:"Shortfall DM/Day", value:shortfallDM+" t", unit:"must import from sister mills", color:C.red, large:true }),
          React.createElement(KPI, { label:"Self-Sufficiency", value:selfSuffPct+"%", unit:"of BSF OPDC requirement", color:selfSuffPct<50?C.red:C.amber })
        ),
        React.createElement("div", { style:{ background:C.navyDk, borderRadius:6, padding:"10px 12px", fontSize:11, color:C.grey, lineHeight:1.9 } },
          React.createElement("div", { style:{ color:C.amber, fontWeight:700, marginBottom:4 } }, "WHY THE SHORTFALL EXISTS"),
          React.createElement("div", null, "At 60 TPH canonical, natural OPDC = 12.56 t DM/day from THIS mill."),
          React.createElement("div", null, "BSF rearing requires significantly more OPDC than any single mill produces naturally."),
          React.createElement("div", null, "Self-sufficiency ratio = 0.38 → ",React.createElement("span",{style:{color:C.red,fontWeight:700}},"62% of OPDC must be imported from sister mills.")),
          React.createElement("div", { style:{ marginTop:6, color:C.teal } }, "Current mill: ",opdcDMday," t DM/day natural · Shortfall: ",React.createElement("span",{style:{color:C.red,fontWeight:700}},shortfallDM," t DM/day to import"))
        )
      ) : null,

      // NUTRIENT PANEL
      showNutr ? React.createElement("div", { style:{ background:C.navyMid, borderRadius:8, padding:14, border:"1px solid "+C.green+"44", marginBottom:12 } },
        React.createElement("div", { style:{ color:C.green, fontWeight:800, fontSize:11, letterSpacing:"0.06em", marginBottom:12, borderLeft:"3px solid "+C.green, paddingLeft:8 } },
          "\uD83C\uDF31  NUTRIENT LOADS \u2014 DM BASIS \u00B7 ",opdcDMday," t DM/day"
        ),
        React.createElement("div", { style:{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:8, marginBottom:10 } },
          React.createElement(KPI, { label:"N / day", value:nDay+" kg", unit:OPDC_CANONICAL.ndk+"% DM", color:C.green }),
          React.createElement(KPI, { label:"P₂O₅ / day", value:pDay+" kg", unit:OPDC_CANONICAL.pdk+"% DM", color:C.blue }),
          React.createElement(KPI, { label:"K₂O / day", value:kDay+" kg", unit:OPDC_CANONICAL.kdk+"% DM", color:C.amber }),
          React.createElement(KPI, { label:"Ca / day", value:caDay+" kg", unit:OPDC_CANONICAL.cadk+"% DM", color:C.tealLt }),
          React.createElement(KPI, { label:"Mg / day", value:mgDay+" kg", unit:OPDC_CANONICAL.mgdk+"% DM", color:C.grey })
        ),
        React.createElement("div", { style:{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:8 } },
          React.createElement(KPI, { label:"N / month", value:(nDay*days).toFixed(0)+" kg", color:C.green }),
          React.createElement(KPI, { label:"P₂O₅ / month", value:(pDay*days).toFixed(0)+" kg", color:C.blue }),
          React.createElement(KPI, { label:"K₂O / month", value:(kDay*days).toFixed(0)+" kg", color:C.amber }),
          React.createElement(KPI, { label:"Ca / month", value:(caDay*days).toFixed(0)+" kg", color:C.tealLt }),
          React.createElement(KPI, { label:"Mg / month", value:(mgDay*days).toFixed(0)+" kg", color:C.grey })
        ),
        React.createElement("div", { style:{ marginTop:10, background:C.navyDk, borderRadius:6, padding:"8px 10px", fontSize:10, color:C.grey } },
          "N = 3.11% DM → CP = N×4.67 = ",React.createElement("span",{style:{color:C.green}},(OPDC_CANONICAL.ndk*4.67).toFixed(1)+"% = "+OPDC_CANONICAL.protein+"% CP"),
          " · C:N = ",OPDC_CANONICAL.cn," · OPDC is the ",
          React.createElement("span",{style:{color:C.amber,fontWeight:700}},"primary protein driver"),
          " of the EFB+OPDC blend — raises blend CP from 4.75% (EFB-only) to ≥8% in 60:40 blend."
        )
      ) : null,

      // COMPOSITION PANEL
      showComp ? React.createElement("div", { style:{ background:C.navyMid, borderRadius:8, padding:14, border:"1px solid "+C.purple+"44", marginBottom:12 } },
        React.createElement("div", { style:{ color:C.purple, fontWeight:800, fontSize:11, letterSpacing:"0.06em", marginBottom:12, borderLeft:"3px solid "+C.purple, paddingLeft:8 } },
          "\uD83D\uDCCA  OPDC COMPOSITION \u2014 CANONICAL VALUES (DM BASIS)"
        ),
        React.createElement("div", { style:{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 } },
          React.createElement("div", null,
            React.createElement("div", { style:{ color:C.grey, fontSize:10, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:8 } }, "Proximate"),
            [
              { label:"Moisture (wet basis)", value:"70%", note:"Canonical · Range: 65–75%", color:C.blue },
              { label:"Crude Protein (N×4.67)", value:"14.5%", note:"ABOVE 5% BSF floor ✅ — BSF-compatible", color:C.green },
              { label:"Lignin", value:"30.7%", note:"Higher than EFB (22%) — PKSA essential", color:C.purple },
              { label:"Ash", value:"4.8%", note:"DM basis", color:C.grey },
              { label:"C:N Ratio", value:"20", note:"Narrow — ideal BSF substrate when blended with EFB", color:C.green },
            ].map(function(r) {
              return React.createElement("div", { key:r.label,
                style:{ display:"grid", gridTemplateColumns:"1fr 70px", gap:8, padding:"7px 10px", borderRadius:6, background:C.navyLt, marginBottom:3 }
              },
                React.createElement("div", null,
                  React.createElement("div", { style:{ color:C.greyLt, fontSize:11 } }, r.label),
                  React.createElement("div", { style:{ color:C.grey, fontSize:10 } }, r.note)
                ),
                React.createElement("div", { style:{ color:r.color||C.teal, fontWeight:900, fontSize:14, textAlign:"right", alignSelf:"center" } }, r.value)
              );
            })
          ),
          React.createElement("div", null,
            React.createElement("div", { style:{ color:C.grey, fontSize:10, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:8 } }, "Biology + Blend Flags"),
            [
              { label:"BSF Suitability", value:"\u2705 PASS", note:"CP 14.5% >> 5% BSF floor → primary BSF substrate", color:C.green },
              { label:"Pathway", value:"S4→S5A", note:"BSF rearing pathway (larvae extracted)", color:C.amber },
              { label:"Press Floor", value:"40% MC", note:"NEVER go below — pore damage kills BSF colonisation", color:C.red },
              { label:"EFB+OPDC Blend C:N", value:"~32", note:"60:40 blend → C:N 32 · 70:30 → C:N 37", color:C.teal },
              { label:"Blend CP 60:40", value:"8.14%", note:"EFB 4.75% + OPDC 14.5% → blend above BSF floor", color:C.green },
            ].map(function(r) {
              return React.createElement("div", { key:r.label,
                style:{ display:"grid", gridTemplateColumns:"1fr 80px", gap:8, padding:"7px 10px", borderRadius:6, background:C.navyLt, marginBottom:3,
                        border:r.color===C.red?"1px solid "+C.red+"44":"1px solid transparent" }
              },
                React.createElement("div", null,
                  React.createElement("div", { style:{ color:C.greyLt, fontSize:11 } }, r.label),
                  React.createElement("div", { style:{ color:C.grey, fontSize:10 } }, r.note)
                ),
                React.createElement("div", { style:{ color:r.color, fontWeight:900, fontSize:11, textAlign:"right", alignSelf:"center" } }, r.value)
              );
            })
          )
        )
      ) : null

    )
  );
}
