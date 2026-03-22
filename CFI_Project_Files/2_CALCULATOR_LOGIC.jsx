// ═══════════════════════════════════════════════════════
// CFI CODE EXPORT — CALCULATOR LOGIC
// All calculation functions, constants, guardrails,
// useMemo/useCallback hooks, unit conversions, clamps
// ═══════════════════════════════════════════════════════


// ======================================================================
// FILE: src/CFI_EFB_DM_Calc.jsx
// SIZE: 25596 chars / 360 lines
// ======================================================================

const { useState, useMemo } = React;

const C = {
  navy:"#0B1929", navyMid:"#0F2236", navyLt:"#162E45", navyDk:"#070F1A",
  teal:"#00C9B1", tealDk:"#009E8C", tealLt:"#5EEADA",
  amber:"#F5A623", amberLt:"#FFD080",
  green:"#3DCB7A", red:"#E84040", purple:"#9B59B6", blue:"#4A9EE0",
  orange:"#E8803A",
  white:"#F0F4F8", grey:"#8BA0B4", greyLt:"#C4D3E0",
};

// CFI canonical EFB values
const EFB_CANONICAL = {
  yieldPctFFB: 22.5,      // % of FFB fresh weight
  mcDefault: 62.5,        // % moisture wet basis
  lignin: 22.0,           // % DM
  protein: 4.75,          // % DM (N×4.67)
  cn: 60,                 // C:N ratio
  ash: 5.5,               // % DM
  ndk: 1.02,              // % DM — N
  pdk: 0.15,              // % DM — P2O5
  kdk: 2.90,              // % DM — K2O
  cadk: 0.23,             // % DM — Ca
  mgdk: 0.13,             // % DM — Mg
};

const MC_OPTIONS = [55, 58, 60, 62, 62.5, 65, 67];

function NumInput({ label, unit, value, onChange, min, max, step, note, locked }) {
  return React.createElement("div", { style:{ marginBottom:14 } },
    React.createElement("div", { style:{ color:C.grey, fontSize:10, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:4 } },
      label,
      unit ? React.createElement("span", { style:{ color:C.teal, marginLeft:4 } }, "[", unit, "]") : null,
      locked ? React.createElement("span", { style:{ color:C.amber, marginLeft:6, fontSize:9, fontWeight:700 } }, "CANONICAL") : null
    ),
    React.createElement("input", { type:"number", value:value, min:min, max:max, step:step||0.1,
      onChange:function(e){ onChange(parseFloat(e.target.value)||0); },
      style:{ background:locked?"#1A2E20":"#1A3550",
              border:"1px solid "+(locked?C.green:C.teal)+"55",
              borderRadius:5, color:locked?C.green:C.amberLt,
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
    sub ? React.createElement("div", { style:{ color:C.grey, fontSize:9, marginTop:3, fontStyle:"italic" } }, sub) : null
  );
}

function Badge({ label, color }) {
  return React.createElement("span", {
    style:{ background:(color||C.teal)+"22", border:"1px solid "+(color||C.teal)+"55",
            borderRadius:10, padding:"2px 7px", color:color||C.teal,
            fontSize:9, fontWeight:700, marginLeft:6 }
  }, label);
}

export default function CFI_EFB_DM_Calc() {
  const [ffb,        setFfb]       = useState(60);
  const [util,       setUtil]      = useState(85);
  const [hrs,        setHrs]       = useState(24);
  const [days,       setDays]      = useState(30);
  const [yieldPct,   setYieldPct]  = useState(EFB_CANONICAL.yieldPctFFB);
  const [mc,         setMc]        = useState(EFB_CANONICAL.mcDefault);
  const [lockedMC,   setLockedMC]  = useState(62.5);
  const [showNutr,   setShowNutr]  = useState(false);
  const [showComp,   setShowComp]  = useState(false);

  const effFFB    = +(ffb * util / 100).toFixed(2);
  const ffbDay    = +(effFFB * hrs).toFixed(1);
  const ffbMonth  = +(ffbDay * days).toFixed(0);

  // EFB fresh weight
  const efbFWhr   = +(effFFB * yieldPct / 100).toFixed(2);
  const efbFWday  = +(efbFWhr * hrs).toFixed(1);
  const efbFWmonth= +(efbFWday * days).toFixed(0);

  // EFB dry matter
  const dmFrac    = (100 - mc) / 100;
  const efbDMhr   = +(efbFWhr * dmFrac).toFixed(3);
  const efbDMday  = +(efbFWday * dmFrac).toFixed(2);
  const efbDMmonth= +(efbDMday * days).toFixed(1);

  // Water
  const waterDay  = +(efbFWday - efbDMday).toFixed(2);

  // Nutrient loads (kg/day) — DM basis
  const nDay  = +(efbDMday * 1000 * EFB_CANONICAL.ndk  / 100).toFixed(1);
  const pDay  = +(efbDMday * 1000 * EFB_CANONICAL.pdk  / 100).toFixed(1);
  const kDay  = +(efbDMday * 1000 * EFB_CANONICAL.kdk  / 100).toFixed(1);
  const caDay = +(efbDMday * 1000 * EFB_CANONICAL.cadk / 100).toFixed(1);
  const mgDay = +(efbDMday * 1000 * EFB_CANONICAL.mgdk / 100).toFixed(1);

  // Lignin and protein loads
  const ligninDay  = +(efbDMday * EFB_CANONICAL.lignin  / 100).toFixed(2);
  const proteinDay = +(efbDMday * EFB_CANONICAL.protein / 100).toFixed(2);

  // MC comparison rows
  const rows = useMemo(function() {
    return MC_OPTIONS.map(function(mcOpt) {
      var df  = (100 - mcOpt) / 100;
      var fw  = +(efbDMday / df).toFixed(1);
      var dm  = efbDMday;
      var wt  = +(fw - dm).toFixed(1);
      var pct = +(fw / ffbDay * 100).toFixed(2);
      return { mc:mcOpt, fw:fw, dm:dm, water:wt, pctFFB:pct };
    });
  }, [efbDMday, ffbDay]);

  var lockedRow = rows.find(function(r){ return r.mc===lockedMC; }) ||
                  { mc:mc, fw:efbFWday, dm:efbDMday, water:waterDay, pctFFB:+(efbFWday/ffbDay*100).toFixed(2) };

  return React.createElement("div", {
    style:{ background:C.navy, minHeight:"100vh", fontFamily:"'DM Sans',system-ui,sans-serif", color:C.white, padding:"0 0 60px" }
  },

    // HEADER
    React.createElement("div", {
      style:{ background:"linear-gradient(135deg,"+C.navyMid+" 0%,#0A1E10 100%)", borderBottom:"2px solid "+C.green+"44", padding:"14px 20px" }
    },
      React.createElement("div", { style:{ display:"flex", alignItems:"center", justifyContent:"space-between" } },
        React.createElement("div", { style:{ display:"flex", alignItems:"center", gap:10 } },
          React.createElement("div", { style:{ background:C.green, width:36, height:36, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 } }, "\uD83C\uDF34"),
          React.createElement("div", null,
            React.createElement("div", { style:{ color:C.green, fontWeight:900, fontSize:14, letterSpacing:"0.07em" } }, "CFI \u2014 EFB DRY MATTER CALCULATOR"),
            React.createElement("div", { style:{ color:C.grey, fontSize:10 } }, "Empty Fruit Bunch \u00B7 Mill exit stream \u00B7 Canonical: 22.5% of FFB \u00B7 62.5% MC")
          )
        ),
        React.createElement("div", { style:{ display:"flex", gap:6 } },
          React.createElement("button", {
            onClick:function(){ setShowNutr(!showNutr); },
            style:{ background:showNutr?C.green+"22":"transparent", border:"1px solid "+C.green+"55", borderRadius:6, color:C.green, padding:"5px 10px", fontSize:10, cursor:"pointer", fontWeight:700 }
          }, showNutr?"\u25BC Nutrients":"\u25B6 Nutrients"),
          React.createElement("button", {
            onClick:function(){ setShowComp(!showComp); },
            style:{ background:showComp?C.amber+"22":"transparent", border:"1px solid "+C.amber+"55", borderRadius:6, color:C.amber, padding:"5px 10px", fontSize:10, cursor:"pointer", fontWeight:700 }
          }, showComp?"\u25BC Composition":"\u25B6 Composition")
        )
      )
    ),

    React.createElement("div", { style:{ maxWidth:920, margin:"0 auto", padding:"16px 14px" } },

      // MAIN GRID: inputs | KPIs
      React.createElement("div", { style:{ display:"grid", gridTemplateColumns:"310px 1fr", gap:12, marginBottom:12 } },

        // LEFT — inputs
        React.createElement("div", { style:{ background:C.navyMid, borderRadius:8, padding:14, border:"1px solid "+C.green+"22" } },
          React.createElement("div", { style:{ color:C.green, fontWeight:800, fontSize:11, letterSpacing:"0.06em", marginBottom:12, borderLeft:"3px solid "+C.green, paddingLeft:8 } }, "\u2699\uFE0F  MILL PARAMETERS"),
          React.createElement(NumInput, { label:"FFB Mill Capacity", unit:"TPH", value:ffb, onChange:setFfb, min:10, max:200, step:5 }),
          React.createElement(NumInput, { label:"Utilisation", unit:"%", value:util, onChange:setUtil, min:50, max:100, step:1 }),
          React.createElement(NumInput, { label:"Operating Hours", unit:"hrs/day", value:hrs, onChange:setHrs, min:8, max:24, step:1 }),
          React.createElement(NumInput, { label:"Operating Days", unit:"days/month", value:days, onChange:setDays, min:20, max:31, step:1 }),
          React.createElement("hr", { style:{ border:"none", borderTop:"1px solid "+C.navyLt, margin:"10px 0" } }),
          React.createElement("div", { style:{ color:C.green, fontWeight:800, fontSize:11, letterSpacing:"0.06em", marginBottom:10, borderLeft:"3px solid "+C.green, paddingLeft:8 } }, "\uD83C\uDF34  EFB STREAM PARAMETERS"),
          React.createElement(NumInput, { label:"EFB Yield", unit:"% of FFB (FW)", value:yieldPct, onChange:setYieldPct, min:18, max:28, step:0.5, note:"Canonical: 22.5% · Range: 20–24%", locked:yieldPct===22.5 }),
          React.createElement(NumInput, { label:"Moisture Content", unit:"% wet basis", value:mc, onChange:setMc, min:50, max:75, step:0.5, note:"Canonical: 62.5% · Range: 58–67%", locked:mc===62.5 }),
          React.createElement("div", { style:{ display:"flex", gap:6, marginTop:4 } },
            React.createElement("button", { onClick:function(){ setYieldPct(22.5); setMc(62.5); },
              style:{ background:C.green+"22", border:"1px solid "+C.green+"55", borderRadius:5, color:C.green, padding:"5px 10px", fontSize:10, cursor:"pointer", fontWeight:700, flex:1 }
            }, "\u21BA Reset to Canonical")
          )
        ),

        // RIGHT — KPIs
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

          // EFB Fresh Weight
          React.createElement("div", { style:{ background:C.navyMid, borderRadius:8, padding:12, border:"1px solid "+C.orange+"44" } },
            React.createElement("div", { style:{ color:C.orange, fontWeight:800, fontSize:11, letterSpacing:"0.06em", marginBottom:10, borderLeft:"3px solid "+C.orange, paddingLeft:8 } },
              "\uD83D\uDCE6  EFB FRESH WEIGHT",
              React.createElement(Badge, { label:yieldPct+"% of FFB", color:C.orange })
            ),
            React.createElement("div", { style:{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 } },
              React.createElement(KPI, { label:"FW per Hour", value:efbFWhr+" t", unit:"t FW/hr", color:C.orange }),
              React.createElement(KPI, { label:"FW per Day", value:efbFWday.toLocaleString()+" t", unit:"t FW/day", color:C.orange, large:true }),
              React.createElement(KPI, { label:"FW per Month", value:efbFWmonth.toLocaleString()+" t", unit:"t FW/month", color:C.amberLt })
            )
          ),

          // EFB DM
          React.createElement("div", { style:{ background:C.navyMid, borderRadius:8, padding:12, border:"2px solid "+C.green+"55" } },
            React.createElement("div", { style:{ color:C.green, fontWeight:800, fontSize:11, letterSpacing:"0.06em", marginBottom:10, borderLeft:"3px solid "+C.green, paddingLeft:8 } },
              "\u2696\uFE0F  EFB DRY MATTER",
              React.createElement(Badge, { label:"MC "+mc+"%", color:C.green }),
              React.createElement(Badge, { label:"DM "+(100-mc).toFixed(1)+"%", color:C.tealLt })
            ),
            React.createElement("div", { style:{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:8 } },
              React.createElement(KPI, { label:"DM per Hour", value:efbDMhr+" t", unit:"t DM/hr", color:C.green }),
              React.createElement(KPI, { label:"DM per Day", value:efbDMday+" t", unit:"t DM/day", color:C.green, large:true }),
              React.createElement(KPI, { label:"DM per Month", value:efbDMmonth+" t", unit:"t DM/month", color:C.green, large:true }),
              React.createElement(KPI, { label:"Water/Day", value:waterDay+" t", unit:"t water/day", color:C.grey })
            ),
            React.createElement("div", { style:{ marginTop:8, background:C.navyDk, borderRadius:6, padding:"6px 10px", fontSize:11, color:C.grey, lineHeight:1.8 } },
              React.createElement("span", { style:{ color:C.green } }, "DM = "),
              "EFB FW/day × (1 − MC/100) = ",
              efbFWday," × (1 − ",mc,"/100) = ",
              React.createElement("span", { style:{ color:C.green, fontWeight:700 } }, efbDMday," t DM/day")
            )
          )
        )
      ),

      // MC TABLE
      React.createElement("div", { style:{ background:C.navyMid, borderRadius:8, padding:14, border:"1px solid "+C.amber+"33", marginBottom:12 } },
        React.createElement("div", { style:{ color:C.amber, fontWeight:800, fontSize:11, letterSpacing:"0.06em", marginBottom:10, borderLeft:"3px solid "+C.amber, paddingLeft:8 } },
          "\uD83D\uDCA7  EFB MOISTURE CONTENT COMPARISON \u2014 CLICK TO LOCK"
        ),
        React.createElement("div", { style:{ display:"grid", gridTemplateColumns:"70px 1fr 1fr 1fr 1fr 1fr 56px", gap:4, marginBottom:5, padding:"0 6px" } },
          ["MC%","FW t/day","Water t/day","DM t/day","% of FFB","FW t/month",""].map(function(h) {
            return React.createElement("div", { key:h, style:{ color:C.grey, fontSize:9, textTransform:"uppercase", letterSpacing:"0.05em", fontWeight:700 } }, h);
          })
        ),
        rows.map(function(row) {
          var active=row.mc===lockedMC;
          var isCanon=row.mc===62.5;
          return React.createElement("div", { key:row.mc, onClick:function(){ setLockedMC(row.mc); },
            style:{ display:"grid", gridTemplateColumns:"70px 1fr 1fr 1fr 1fr 1fr 56px",
                    gap:4, padding:"8px 6px", borderRadius:6, marginBottom:2, cursor:"pointer",
                    background:active?C.green+"22":C.navyLt, border:"1px solid "+(active?C.green:"transparent"), transition:"all 0.12s" }
          },
            React.createElement("div", { style:{ color:active?C.green:C.white, fontWeight:active?900:600, fontSize:13, display:"flex", alignItems:"center", gap:4 } },
              row.mc+"%",
              isCanon ? React.createElement("span", { style:{ color:C.amber, fontSize:8, fontWeight:700 } }, "\u2605") : null
            ),
            React.createElement("div", { style:{ color:active?C.tealLt:C.white, fontWeight:700, fontSize:12 } }, row.fw.toFixed(1)+" t"),
            React.createElement("div", { style:{ color:active?C.tealLt:C.grey, fontSize:12 } }, row.water.toFixed(1)+" t"),
            React.createElement("div", { style:{ color:C.green, fontSize:12, fontWeight:700 } }, row.dm.toFixed(2)+" t"),
            React.createElement("div", { style:{ color:active?C.amber:C.grey, fontSize:12 } }, row.pctFFB+"%"),
            React.createElement("div", { style:{ color:active?C.teal:C.grey, fontSize:12 } }, (row.fw*days).toFixed(0)+" t"),
            React.createElement("div", { style:{ background:active?C.green+"33":"transparent", border:"1px solid "+(active?C.green:"transparent"), borderRadius:10, padding:"1px 5px", color:active?C.green:"transparent", fontSize:9, fontWeight:700, textAlign:"center" } }, active?"LOCKED":"\u00A0")
          );
        }),
        React.createElement("div", { style:{ marginTop:6, padding:"0 6px", color:C.grey, fontSize:9 } }, "\u2605 = CFI canonical value (62.5%)")
      ),

      // LOCKED SPEC
      React.createElement("div", { style:{ background:C.navyDk, borderRadius:8, padding:14, border:"2px solid "+C.green+"66", marginBottom:12 } },
        React.createElement("div", { style:{ color:C.green, fontWeight:800, fontSize:11, letterSpacing:"0.06em", marginBottom:12, borderLeft:"3px solid "+C.green, paddingLeft:8 } },
          "\u2705  LOCKED EFB SPECIFICATION \u2014 MC "+lockedMC+"% \u00B7 YIELD "+yieldPct+"% FFB"
        ),
        React.createElement("div", { style:{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:8, marginBottom:10 } },
          React.createElement(KPI, { label:"Fresh Weight/Day", value:lockedRow.fw.toFixed(1)+" t", unit:"t FW/day", color:C.orange, large:true }),
          React.createElement(KPI, { label:"Dry Matter/Day", value:lockedRow.dm.toFixed(2)+" t", unit:"t DM/day", color:C.green, large:true }),
          React.createElement(KPI, { label:"Moisture", value:lockedMC+"%", unit:"wet basis — locked", color:C.amber, large:true }),
          React.createElement(KPI, { label:"Water/Day", value:lockedRow.water.toFixed(1)+" t", color:C.grey }),
          React.createElement(KPI, { label:"% of FFB (FW)", value:lockedRow.pctFFB+"%", unit:"EFB yield factor", color:C.tealLt })
        ),
        React.createElement("div", { style:{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:8, marginBottom:10 } },
          React.createElement(KPI, { label:"Monthly FW", value:efbFWmonth.toLocaleString()+" t", color:C.orange }),
          React.createElement(KPI, { label:"Monthly DM", value:efbDMmonth+" t", color:C.green }),
          React.createElement(KPI, { label:"Annual DM", value:(+(efbDMmonth*12).toFixed(0)).toLocaleString()+" t", color:C.tealLt }),
          React.createElement(KPI, { label:"Lignin Load/Day", value:ligninDay+" t", unit:EFB_CANONICAL.lignin+"% DM", color:C.purple })
        ),
        React.createElement("div", { style:{ background:"#050E18", borderRadius:6, padding:"8px 12px", fontFamily:"monospace", fontSize:11, color:C.grey, lineHeight:2.0 } },
          React.createElement("div", { style:{ color:C.green, fontWeight:700, marginBottom:2 } }, "FORMULA AUDIT"),
          React.createElement("div", null, "effFFB      = ",ffb," × ",util,"% = ",effFFB," t/hr"),
          React.createElement("div", null, "FFB/day     = ",effFFB," × ",hrs," hrs = ",ffbDay," t/day"),
          React.createElement("div", null, "EFB FW/day  = ",ffbDay," × ",yieldPct,"% = ",React.createElement("span",{style:{color:C.orange,fontWeight:700}},efbFWday," t FW/day")),
          React.createElement("div", null, "EFB DM/day  = ",efbFWday," × (1 − ",lockedMC,"/100) = ",React.createElement("span",{style:{color:C.green,fontWeight:700}},lockedRow.dm.toFixed(2)," t DM/day")),
          React.createElement("div", null, "Water/day   = ",efbFWday," − ",lockedRow.dm.toFixed(2)," = ",React.createElement("span",{style:{color:C.grey}},lockedRow.water.toFixed(1)," t water/day"))
        )
      ),

      // NUTRIENT PANEL
      showNutr ? React.createElement("div", { style:{ background:C.navyMid, borderRadius:8, padding:14, border:"1px solid "+C.green+"44", marginBottom:12 } },
        React.createElement("div", { style:{ color:C.green, fontWeight:800, fontSize:11, letterSpacing:"0.06em", marginBottom:12, borderLeft:"3px solid "+C.green, paddingLeft:8 } },
          "\uD83C\uDF31  NUTRIENT LOADS \u2014 DM BASIS \u00B7 ",efbDMday," t DM/day"
        ),
        React.createElement("div", { style:{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:8, marginBottom:10 } },
          React.createElement(KPI, { label:"N / day", value:nDay+" kg", unit:EFB_CANONICAL.ndk+"% DM", color:C.green }),
          React.createElement(KPI, { label:"P₂O₅ / day", value:pDay+" kg", unit:EFB_CANONICAL.pdk+"% DM", color:C.blue }),
          React.createElement(KPI, { label:"K₂O / day", value:kDay+" kg", unit:EFB_CANONICAL.kdk+"% DM", color:C.amber }),
          React.createElement(KPI, { label:"Ca / day", value:caDay+" kg", unit:EFB_CANONICAL.cadk+"% DM", color:C.tealLt }),
          React.createElement(KPI, { label:"Mg / day", value:mgDay+" kg", unit:EFB_CANONICAL.mgdk+"% DM", color:C.grey })
        ),
        React.createElement("div", { style:{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:8 } },
          React.createElement(KPI, { label:"N / month", value:(nDay*days).toFixed(0)+" kg", color:C.green }),
          React.createElement(KPI, { label:"P₂O₅ / month", value:(pDay*days).toFixed(0)+" kg", color:C.blue }),
          React.createElement(KPI, { label:"K₂O / month", value:(kDay*days).toFixed(0)+" kg", color:C.amber }),
          React.createElement(KPI, { label:"Ca / month", value:(caDay*days).toFixed(0)+" kg", color:C.tealLt }),
          React.createElement(KPI, { label:"Mg / month", value:(mgDay*days).toFixed(0)+" kg", color:C.grey })
        ),
        React.createElement("div", { style:{ marginTop:10, background:C.navyDk, borderRadius:6, padding:"8px 10px", fontSize:10, color:C.grey } },
          "Nutrient values on DM basis from CFI canonical dataset. N = 1.02% DM (CP = N×4.67 = ",React.createElement("span",{style:{color:C.orange}},(EFB_CANONICAL.ndk*4.67).toFixed(2)+"% = "+EFB_CANONICAL.protein+"% CP"),"). C:N = ",EFB_CANONICAL.cn,". Lignin = ",EFB_CANONICAL.lignin,"% DM — primary structural resistance to BSF/compost."
        )
      ) : null,

      // COMPOSITION PANEL
      showComp ? React.createElement("div", { style:{ background:C.navyMid, borderRadius:8, padding:14, border:"1px solid "+C.purple+"44", marginBottom:12 } },
        React.createElement("div", { style:{ color:C.purple, fontWeight:800, fontSize:11, letterSpacing:"0.06em", marginBottom:12, borderLeft:"3px solid "+C.purple, paddingLeft:8 } },
          "\uD83D\uDCCA  EFB COMPOSITION \u2014 CANONICAL VALUES (DM BASIS)"
        ),
        React.createElement("div", { style:{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 } },
          React.createElement("div", null,
            React.createElement("div", { style:{ color:C.grey, fontSize:10, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:8 } }, "Proximate"),
            [
              { label:"Moisture (wet basis)", value:"62.5%", note:"Range: 58–67%", color:C.blue },
              { label:"Crude Protein (N×4.67)", value:"4.75%", note:"BSF FLOOR = 5% — EFB is SUB-THRESHOLD", color:C.red },
              { label:"Lignin", value:"22.0%", note:"High structural resistance — PKSA target", color:C.purple },
              { label:"Ash", value:"5.5%", note:"DM basis", color:C.grey },
              { label:"C:N Ratio", value:"60", note:"Very wide — needs blending with OPDC/POME", color:C.amber },
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
            React.createElement("div", { style:{ color:C.grey, fontSize:10, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:8 } }, "Structural + Biology Flags"),
            [
              { label:"BSF Suitability", value:"❌ FAIL", note:"CP 4.75% < 5% BSF floor → compost pathway only", color:C.red },
              { label:"Pathway", value:"S2→S5B", note:"PKSA pre-treatment → compost biofertiliser", color:C.teal },
              { label:"PKSA Target", value:"Lignin", note:"33% lignin reduction target via alkaline treatment", color:C.amber },
              { label:"C:N for Blending", value:"60", note:"Must blend with OPDC (C:N 20) to reach target ≤40", color:C.orange },
              { label:"EFB:OPDC Blend C:N", value:"~32–37", note:"60/40 blend → C:N 32; 70/30 → C:N 37", color:C.green },
            ].map(function(r) {
              return React.createElement("div", { key:r.label,
                style:{ display:"grid", gridTemplateColumns:"1fr 80px", gap:8, padding:"7px 10px", borderRadius:6, background:C.navyLt, marginBottom:3,
                        border: r.color===C.red ? "1px solid "+C.red+"44" : "1px solid transparent" }
              },
                React.createElement("div", null,
                  React.createElement("div", { style:{ color:C.greyLt, fontSize:11 } }, r.label),
                  React.createElement("div", { style:{ color:C.grey, fontSize:10 } }, r.note)
                ),
                React.createElement("div", { style:{ color:r.color, fontWeight:900, fontSize:12, textAlign:"right", alignSelf:"center" } }, r.value)
              );
            })
          )
        )
      ) : null

    )
  );
}



// ======================================================================
// FILE: src/CFI_OPDC_DM_Calc.jsx
// SIZE: 32927 chars / 457 lines
// ======================================================================

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



// ======================================================================
// FILE: src/CFI_POS_DM_v4.jsx
// SIZE: 45723 chars / 568 lines
// ======================================================================

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
  const [lockedMC,  setLockedMC] = useState(82);
  const [panel,     setPanel]    = useState("");   // "flow"|"equip"|"deriv"|"refs"|"biogas"|""

  // DC-POME-01 uplift states
  const [dec2Active,  setDec2Active]  = useState(false);
  const [dec2TSSin,   setDec2TSSin]   = useState(10000);
  const [dec2TSSrem,  setDec2TSSrem]  = useState(77);
  const [dec2CakeMC,  setDec2CakeMC]  = useState(78);

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

  // DC-POME-01 uplift (2nd decanter on POME centrate)
  const dec2WetSolids = dec2Active ? +(dec2TSSin * (dec2TSSrem/100) * +pomeM3day / 1000000).toFixed(2) : 0;
  const dec2DM        = dec2Active ? +(dec2WetSolids * (1 - dec2CakeMC/100)).toFixed(3) : 0;
  const totalPomeDMday   = +(pomeDMday + dec2DM).toFixed(3);
  const totalPomeDMmonth = +(totalPomeDMday * days).toFixed(2);

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

      // DC-POME-01 UPLIFT TOGGLE PANEL
      React.createElement("div", { style:{ background:dec2Active?C.navyDk:"#0A1420", borderRadius:8, padding:"10px 14px", marginBottom:12, border:"2px solid "+(dec2Active?C.purple:C.grey)+"44" } },
        React.createElement("div", { style:{ display:"flex", alignItems:"center", gap:10, marginBottom: dec2Active?12:0 } },
          React.createElement("button", { onClick:function(){ setDec2Active(!dec2Active); },
            style:{ background:dec2Active?C.purple+"33":"transparent", border:"2px solid "+(dec2Active?C.purple:C.grey)+"66",
                    borderRadius:6, color:dec2Active?C.purple:C.grey, padding:"5px 14px", fontSize:11, cursor:"pointer", fontWeight:900, flexShrink:0 }
          }, dec2Active ? "\u25FC ON" : "\u25FB OFF"),
          React.createElement("div", { style:{ flex:1 } },
            React.createElement("div", { style:{ color:dec2Active?C.purple:C.grey, fontWeight:800, fontSize:11 } }, "\uD83D\uDD04  DC-POME-01 — 2nd Decanter POS Uplift"),
            React.createElement("div", { style:{ color:C.grey, fontSize:9, marginTop:1 } },
              "CFI-owned decanter on POME centrate (in series after mill decanter) \u00B7 see CFI_POS_Decanter_Module for full CAPEX/OPEX"
            )
          ),
          dec2Active ? React.createElement("div", { style:{ textAlign:"right", flexShrink:0 } },
            React.createElement("div", { style:{ color:C.purple, fontWeight:900, fontSize:16 } }, "+"+dec2DM+" t DM/day"),
            React.createElement("div", { style:{ color:C.grey, fontSize:9 } }, "uplift to POS stream")
          ) : null
        ),
        dec2Active ? React.createElement("div", null,
          React.createElement("div", { style:{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:10 } },
            React.createElement("div", null,
              React.createElement("div", { style:{ color:C.grey, fontSize:9, textTransform:"uppercase", marginBottom:4 } }, "TSS entering DC-POME-01 [mg/L]"),
              React.createElement("input", { type:"number", value:dec2TSSin, min:3000, max:20000, step:500,
                onChange:function(e){ setDec2TSSin(parseFloat(e.target.value)||0); },
                style:{ background:dec2TSSin!==10000?"#1C1A08":"#162E45", border:"1px solid "+(dec2TSSin!==10000?C.amber:C.teal)+"44",
                        borderRadius:5, color:dec2TSSin!==10000?C.amberLt:C.white, padding:"5px 8px", fontSize:12, fontWeight:700,
                        width:"100%", boxSizing:"border-box", outline:"none", textAlign:"center" } }),
              React.createElement("div", { style:{ color:C.grey, fontSize:8, marginTop:2 } }, "After mill 1st decanter · default 10,000")
            ),
            React.createElement("div", null,
              React.createElement("div", { style:{ color:C.grey, fontSize:9, textTransform:"uppercase", marginBottom:4 } }, "TSS removal [%]"),
              React.createElement("input", { type:"number", value:dec2TSSrem, min:50, max:92, step:1,
                onChange:function(e){ setDec2TSSrem(parseFloat(e.target.value)||0); },
                style:{ background:dec2TSSrem!==77?"#1C1A08":"#162E45", border:"1px solid "+(dec2TSSrem!==77?C.amber:C.teal)+"44",
                        borderRadius:5, color:dec2TSSrem!==77?C.amberLt:C.white, padding:"5px 8px", fontSize:12, fontWeight:700,
                        width:"100%", boxSizing:"border-box", outline:"none", textAlign:"center" } }),
              React.createElement("div", { style:{ color:C.grey, fontSize:8, marginTop:2 } }, "2-phase centrifuge default 77%")
            ),
            React.createElement("div", null,
              React.createElement("div", { style:{ color:C.grey, fontSize:9, textTransform:"uppercase", marginBottom:4 } }, "Cake MC [%]"),
              React.createElement("input", { type:"number", value:dec2CakeMC, min:65, max:85, step:1,
                onChange:function(e){ setDec2CakeMC(parseFloat(e.target.value)||0); },
                style:{ background:dec2CakeMC!==78?"#1C1A08":"#162E45", border:"1px solid "+(dec2CakeMC!==78?C.amber:C.teal)+"44",
                        borderRadius:5, color:dec2CakeMC!==78?C.amberLt:C.white, padding:"5px 8px", fontSize:12, fontWeight:700,
                        width:"100%", boxSizing:"border-box", outline:"none", textAlign:"center" } }),
              React.createElement("div", { style:{ color:C.grey, fontSize:8, marginTop:2 } }, "Fine fraction default 78%")
            )
          ),
          React.createElement("div", { style:{ background:C.navyMid, borderRadius:6, padding:"8px 12px", display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8 } },
            React.createElement("div", { style:{ textAlign:"center" } },
              React.createElement("div", { style:{ color:C.grey, fontSize:9, textTransform:"uppercase" } }, "Wet solids"),
              React.createElement("div", { style:{ color:C.teal, fontWeight:700, fontSize:13 } }, dec2WetSolids+" t FW/day")
            ),
            React.createElement("div", { style:{ textAlign:"center" } },
              React.createElement("div", { style:{ color:C.grey, fontSize:9, textTransform:"uppercase" } }, "DM uplift"),
              React.createElement("div", { style:{ color:C.purple, fontWeight:700, fontSize:13 } }, dec2DM+" t DM/day")
            ),
            React.createElement("div", { style:{ textAlign:"center" } },
              React.createElement("div", { style:{ color:C.grey, fontSize:9, textTransform:"uppercase" } }, "Total POS DM/day"),
              React.createElement("div", { style:{ color:C.green, fontWeight:900, fontSize:16 } }, totalPomeDMday+" t")
            ),
            React.createElement("div", { style:{ textAlign:"center" } },
              React.createElement("div", { style:{ color:C.grey, fontSize:9, textTransform:"uppercase" } }, "Total POS DM/month"),
              React.createElement("div", { style:{ color:C.green, fontWeight:700, fontSize:13 } }, totalPomeDMmonth+" t")
            )
          )
        ) : null
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



// ======================================================================
// FILE: src/CFI_POME_DM_Calculator_v3.jsx
// SIZE: 39033 chars / 487 lines
// ======================================================================

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



// ======================================================================
// FILE: src/CFI_GH_Calculator.jsx
// SIZE: 39030 chars / 563 lines
// ======================================================================

import { useState, useMemo } from "react";

const C = {
  bg:"#0b0f14", panel:"#111820", border:"#1e2d3d", input:"#0d1f35",
  blue:"#4da6ff", green:"#3ddc84", amber:"#f0a030", red:"#ff5555",
  teal:"#22b89e", purple:"#b06aff", white:"#e8edf2", grey:"#6b8099",
  dimgrey:"#3a4f60", label:"#8ba8c0", gold:"#f5c842",
};
const mono = "'JetBrains Mono','Courier New',monospace";
const sans = "'IBM Plex Sans','Segoe UI',sans-serif";

function uCol(p){return p>85?C.red:p>65?C.amber:C.green;}
function fmt(n,d=1){return n!=null?n.toFixed(d):"—";}
function fmtk(n){return n!=null?"$"+Math.round(n).toLocaleString():"—";}

function Inp({label,unit,value,onChange,min=0,max=99999,step=1,note}){
  return(
    <div style={{marginBottom:9}}>
      <div style={{display:"flex",alignItems:"center",gap:6}}>
        <div style={{width:188,fontSize:11,color:C.label,fontFamily:sans,lineHeight:1.3}}>{label}</div>
        <div style={{display:"flex",alignItems:"center",gap:4,background:C.input,border:"1px solid "+C.blue,borderRadius:4,padding:"3px 8px"}}>
          <input type="number" min={min} max={max} step={step} value={value}
            onChange={e=>onChange(parseFloat(e.target.value)||0)}
            style={{width:66,background:"transparent",border:"none",outline:"none",color:C.blue,fontFamily:mono,fontSize:13,fontWeight:700}}/>
          <span style={{fontFamily:mono,fontSize:10,color:C.dimgrey}}>{unit}</span>
        </div>
      </div>
      {note&&<div style={{fontSize:9,color:C.dimgrey,marginTop:2,paddingLeft:4}}>{note}</div>}
    </div>
  );
}

function KV({k,v,col}){
  return(
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",padding:"5px 0",borderBottom:"1px solid "+C.border}}>
      <span style={{fontSize:11,color:C.label,fontFamily:sans}}>{k}</span>
      <span style={{fontFamily:mono,fontSize:12,color:col||C.green,fontWeight:600,textAlign:"right",marginLeft:8}}>{v}</span>
    </div>
  );
}

function UBar({label,pct}){
  const c=uCol(pct);
  return(
    <div style={{marginBottom:7}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
        <span style={{fontSize:10,color:C.label,fontFamily:sans}}>{label}</span>
        <span style={{fontFamily:mono,fontSize:10,color:c,fontWeight:700}}>{fmt(pct,1)}%</span>
      </div>
      <div style={{height:4,background:C.border,borderRadius:2}}>
        <div style={{width:Math.min(pct,100)+"%",height:"100%",background:c,borderRadius:2,transition:"width 0.4s"}}/>
      </div>
    </div>
  );
}

function Panel({title,colour,children,compact}){
  return(
    <div style={{background:C.panel,border:"1px solid "+(colour?colour+"44":C.border),borderTop:colour?"3px solid "+colour:undefined,borderRadius:6,padding:compact?12:16}}>
      {title&&<div style={{fontFamily:mono,fontSize:10,color:colour||C.label,letterSpacing:2,marginBottom:10,textTransform:"uppercase"}}>{title}</div>}
      {children}
    </div>
  );
}

function StatCard({label,value,unit,col}){
  return(
    <div style={{background:C.panel,border:"1px solid "+C.border,borderRadius:6,padding:12}}>
      <div style={{fontSize:9,color:C.label,textTransform:"uppercase",letterSpacing:1,marginBottom:3}}>{label}</div>
      <div style={{fontFamily:mono,fontSize:20,fontWeight:700,color:col||C.green,lineHeight:1}}>{value}</div>
      <div style={{fontFamily:mono,fontSize:9,color:C.grey,marginTop:2}}>{unit}</div>
    </div>
  );
}

function SHead({title,colour}){
  return <div style={{padding:"5px 10px",background:colour+"18",fontFamily:mono,fontSize:9,color:colour,letterSpacing:2,textTransform:"uppercase",borderTop:"1px solid "+colour+"33"}}>── {title}</div>;
}

function ERow({tag,name,qty,cost,note,isNew}){
  return(
    <div style={{display:"grid",gridTemplateColumns:"148px 1fr 36px 90px",gap:6,padding:"5px 10px",borderBottom:"1px solid "+C.border,background:isNew?"#0d2a1a":"transparent",borderLeft:isNew?"2px solid "+C.green:"2px solid transparent"}}>
      <div style={{fontFamily:mono,fontSize:10,color:isNew?C.green:C.teal,wordBreak:"break-all"}}>{tag}</div>
      <div>
        <div style={{fontFamily:sans,fontSize:11,color:C.white}}>{name}</div>
        {note&&<div style={{fontFamily:sans,fontSize:9,color:C.grey,marginTop:1}}>{note}</div>}
      </div>
      <div style={{fontFamily:mono,fontSize:11,color:C.white,textAlign:"center"}}>{qty}</div>
      <div style={{fontFamily:mono,fontSize:11,color:C.amber,textAlign:"right"}}>{cost?fmtk(cost):"TBD"}</div>
    </div>
  );
}

function SLabel({text}){
  return <div style={{fontSize:9,fontFamily:mono,color:C.dimgrey,letterSpacing:2,textTransform:"uppercase",margin:"14px 0 6px",paddingBottom:4,borderBottom:"1px solid "+C.border}}>{text}</div>;
}

export default function CFI_GH(){
  const [feedTpd,setFeedTpd]=useState(326);
  const [feedMc,setFeedMc]=useState(55);
  const [s3Days,setS3Days]=useState(15);
  const [s4Days,setS4Days]=useState(14);
  const [s3Frac,setS3Frac]=useState(60);
  const [bedDepth,setBedDepth]=useState(0.5);
  const [bulkDen,setBulkDen]=useState(0.8);
  const [ghW,setGhW]=useState(100);
  const [ghL,setGhL]=useState(200);
  const [laneW,setLaneW]=useState(5);
  const [truckPayload,setTruckPayload]=useState(8);
  const [nTrucks,setNTrucks]=useState(3);
  const [haulDist,setHaulDist]=useState(400);
  const [truckSpd,setTruckSpd]=useState(15);
  const [tipTime,setTipTime]=useState(20);
  const [truckCost,setTruckCost]=useState(20000);
  const [miniTph,setMiniTph]=useState(5);
  const [miniCost,setMiniCost]=useState(15000);
  const [ghStruct,setGhStruct]=useState(55);
  const [sprRate,setSprRate]=useState(8);
  const [slab150Mat,setSlab150Mat]=useState(13);
  const [slab150Lab,setSlab150Lab]=useState(9);
  const [slab200Mat,setSlab200Mat]=useState(17);
  const [slab200Lab,setSlab200Lab]=useState(10);
  const [tab,setTab]=useState("overview");

  const r=useMemo(()=>{
    const ghArea=ghW*ghL;
    const laneArea=laneW*ghL;
    const bedArea=ghArea-laneArea;
    const s3BedArea=bedArea*s3Frac/100;
    const s4BedArea=bedArea*(1-s3Frac/100);
    const feedTph=feedTpd/24;
    const feedDm=feedTpd*(1-feedMc/100);
    const s3Inv=feedTpd*s3Days;
    const s3Vol=s3Inv/bulkDen;
    const s3AreaNeed=s3Vol/bedDepth;
    const s3Util=s3AreaNeed/s3BedArea*100;
    const s4Feed=feedTpd*0.95;
    const s4Inv=s4Feed*s4Days;
    const s4Vol=s4Inv/bulkDen;
    const s4AreaNeed=s4Vol/bedDepth;
    const s4Util=s4AreaNeed/s4BedArea*100;
    const totalAreaNeed=s3AreaNeed+s4AreaNeed;
    const totalAreaUtil=totalAreaNeed/bedArea*100;
    const haulMin=(haulDist/1000)/(truckSpd/60);
    const cycleMin=haulMin*2+tipTime;
    const tripsPerDay=(24*60)/cycleMin;
    const capPerTruck=tripsPerDay*truckPayload;
    const trucksNeeded=Math.ceil(feedTpd/capPerTruck);
    const truckUtil=feedTpd/(nTrucks*capPerTruck)*100;
    const miniWorking=Math.ceil(feedTph/miniTph);
    const nMinis=miniWorking+2;
    const miniUtil=feedTph/(miniWorking*miniTph)*100;
    const nFans=Math.ceil((ghArea*4*20/3600)/(35000/3600));
    const nSprinklers=Math.ceil(ghArea/9);
    const slab150Area=ghArea-laneArea;
    const aggArea=ghArea+10000;
    const clearCost=35000*0.75;
    const compactCost=35000*1.25;
    const aggCost=aggArea*15;
    const sandCost=aggArea*8.5;
    const drainCivil=aggArea*18;
    const subtotalSubbase=clearCost+compactCost+aggCost+sandCost+drainCivil;
    const slab150Cost=slab150Area*(slab150Mat+slab150Lab);
    const slab200Cost=laneArea*(slab200Mat+slab200Lab);
    const extRoadCost=6000*4;
    const extApronCost=4000*22;
    const subtotalSlab=slab150Cost+slab200Cost+extRoadCost+extApronCost;
    const ghStructCost=ghArea*ghStruct;
    const sprinklerCost=ghArea*sprRate;
    const washdownCost=12000;
    const trenchHwCost=30000;
    const fanCost=nFans*2000;
    const subtotalMEP=sprinklerCost+washdownCost+trenchHwCost+fanCost;
    const truckFleetCost=nTrucks*truckCost;
    const miniFleetCost=nMinis*miniCost;
    const subtotalMobile=truckFleetCost+miniFleetCost;
    const total=subtotalSubbase+subtotalSlab+ghStructCost+subtotalMEP+subtotalMobile;
    return{
      ghArea,laneArea,bedArea,slab150Area,s3BedArea,s4BedArea,aggArea,
      feedTph,feedDm,
      s3Inv,s3Vol,s3AreaNeed,s3Util,
      s4Feed,s4Inv,s4Vol,s4AreaNeed,s4Util,
      totalAreaNeed,totalAreaUtil,
      haulMin,cycleMin,tripsPerDay,capPerTruck,trucksNeeded,truckUtil,
      miniWorking,nMinis,miniUtil,
      nFans,nSprinklers,
      capex:{clearCost,compactCost,aggCost,sandCost,drainCivil,subtotalSubbase,
        slab150Cost,slab200Cost,extRoadCost,extApronCost,subtotalSlab,
        ghStructCost,sprinklerCost,washdownCost,trenchHwCost,fanCost,subtotalMEP,
        truckFleetCost,miniFleetCost,subtotalMobile,total},
    };
  },[feedTpd,feedMc,s3Days,s4Days,s3Frac,bedDepth,bulkDen,ghW,ghL,laneW,
     truckPayload,nTrucks,haulDist,truckSpd,tipTime,truckCost,
     miniTph,miniCost,ghStruct,sprRate,slab150Mat,slab150Lab,slab200Mat,slab200Lab]);

  const overFit=r.totalAreaUtil>100;
  const truckShort=nTrucks<r.trucksNeeded;
  const TABS=["overview","s3-zone","s4-zone","fleet","capex","equipment"];

  return(
    <div style={{background:C.bg,minHeight:"100vh",fontFamily:sans,color:C.white,display:"flex",flexDirection:"column"}}>
      <div style={{background:C.panel,borderBottom:"1px solid "+C.border,padding:"12px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
        <div>
          <div style={{fontFamily:mono,fontSize:9,color:C.teal,letterSpacing:3,textTransform:"uppercase"}}>CFI · Greenhouse Calculator — S3 + S4</div>
          <div style={{fontSize:17,fontWeight:700,color:C.white,marginTop:1}}>Bioconversion Greenhouse — Dynamic CAPEX Model</div>
        </div>
        <div style={{display:"flex",gap:12,alignItems:"center"}}>
          {overFit&&<div style={{background:"#2a0d0d",border:"1px solid "+C.red,borderRadius:4,padding:"4px 10px",fontFamily:mono,fontSize:10,color:C.red}}>⚠ BED AREA OVERFIT</div>}
          {truckShort&&<div style={{background:"#2a0d0d",border:"1px solid "+C.red,borderRadius:4,padding:"4px 10px",fontFamily:mono,fontSize:10,color:C.red}}>⚠ TRUCKS UNDERSIZED</div>}
          <div style={{textAlign:"right"}}>
            <div style={{fontFamily:mono,fontSize:10,color:C.grey}}>{feedTpd} t/day · {feedMc}% MC</div>
            <div style={{fontFamily:mono,fontSize:14,color:C.gold,fontWeight:700}}>{fmtk(r.capex.total)} TOTAL CAPEX</div>
          </div>
        </div>
      </div>

      <div style={{display:"flex",flex:1,overflow:"hidden"}}>
        <div style={{width:284,flexShrink:0,background:C.panel,borderRight:"1px solid "+C.border,overflowY:"auto",padding:"14px 12px"}}>
          <div style={{fontFamily:mono,fontSize:9,color:C.teal,letterSpacing:2,marginBottom:10,textTransform:"uppercase"}}>Master Inputs</div>
          <SLabel text="S2 Feed (from blend point)"/>
          <Inp label="Blended feed rate" unit="t/day" value={feedTpd} onChange={setFeedTpd} min={50} max={2000} step={5} note="Link: S1/S2 calc → r.b.tpd"/>
          <Inp label="Feed moisture" unit="% WB" value={feedMc} onChange={setFeedMc} min={40} max={70} step={0.5} note="Row A exit ≈55% WB"/>
          <SLabel text="Residence Times"/>
          <Inp label="S3 microbial residence" unit="days" value={s3Days} onChange={setS3Days} min={7} max={45}/>
          <Inp label="S4 BSF larval cycle" unit="days" value={s4Days} onChange={setS4Days} min={7} max={21}/>
          <Inp label="S3 share of bed floor" unit="% area" value={s3Frac} onChange={setS3Frac} min={20} max={80} step={5}/>
          <SLabel text="Bed Parameters"/>
          <Inp label="Max bed depth" unit="m" value={bedDepth} onChange={setBedDepth} min={0.3} max={0.5} step={0.05} note="Hard limit 0.5m per spec"/>
          <Inp label="Bulk density (design)" unit="t/m³" value={bulkDen} onChange={setBulkDen} min={0.5} max={1.0} step={0.05} note="0.8 = conservative"/>
          <SLabel text="Greenhouse Geometry"/>
          <Inp label="Width" unit="m" value={ghW} onChange={setGhW} min={50} max={300} step={10}/>
          <Inp label="Length" unit="m" value={ghL} onChange={setGhL} min={100} max={500} step={10}/>
          <Inp label="Truck lane width" unit="m" value={laneW} onChange={setLaneW} min={4} max={8}/>
          <SLabel text="Trucks — Hino Dutro 130HD"/>
          <Inp label="Truck payload" unit="t" value={truckPayload} onChange={setTruckPayload} min={4} max={15}/>
          <Inp label="Number of trucks" unit="units" value={nTrucks} onChange={setNTrucks} min={1} max={10}/>
          <Inp label="One-way haul distance" unit="m" value={haulDist} onChange={setHaulDist} min={50} max={3000} step={50} note="S2 blend → GH door"/>
          <Inp label="Loaded speed" unit="km/h" value={truckSpd} onChange={setTruckSpd} min={5} max={30} step={5}/>
          <Inp label="Load + tip time" unit="min" value={tipTime} onChange={setTipTime} min={10} max={60} step={5}/>
          <Inp label="Truck unit cost" unit="USD" value={truckCost} onChange={setTruckCost} min={10000} max={80000} step={1000}/>
          <SLabel text="Mini Loaders — LTMG LT750D"/>
          <Inp label="Throughput per mini" unit="t/h" value={miniTph} onChange={setMiniTph} min={2} max={10} step={0.5}/>
          <Inp label="Mini unit cost (landed)" unit="USD" value={miniCost} onChange={setMiniCost} min={8000} max={30000} step={1000}/>
          <SLabel text="Civil Unit Rates"/>
          <Inp label="GH structure + film" unit="$/m²" value={ghStruct} onChange={setGhStruct} min={40} max={90} step={5}/>
          <Inp label="Sprinkler system" unit="$/m²" value={sprRate} onChange={setSprRate} min={6} max={12}/>
          <Inp label="150mm slab materials" unit="$/m²" value={slab150Mat} onChange={setSlab150Mat} min={8} max={22}/>
          <Inp label="150mm slab labour" unit="$/m²" value={slab150Lab} onChange={setSlab150Lab} min={5} max={16}/>
          <Inp label="200mm slab materials" unit="$/m²" value={slab200Mat} onChange={setSlab200Mat} min={12} max={28}/>
          <Inp label="200mm slab labour" unit="$/m²" value={slab200Lab} onChange={setSlab200Lab} min={6} max={18}/>
        </div>

        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
          <div style={{display:"flex",borderBottom:"1px solid "+C.border,background:C.panel,flexShrink:0}}>
            {TABS.map(t=>(
              <button key={t} onClick={()=>setTab(t)} style={{background:"transparent",border:"none",
                borderBottom:tab===t?"2px solid "+C.teal:"2px solid transparent",
                color:tab===t?C.white:C.grey,fontFamily:mono,fontSize:10,textTransform:"uppercase",
                letterSpacing:1,padding:"10px 14px",cursor:"pointer"}}>{t.replace("-"," ")}</button>
            ))}
          </div>

          <div style={{flex:1,overflowY:"auto",padding:18}}>

            {tab==="overview"&&(
              <div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:10,marginBottom:18}}>
                  <StatCard label="Feed Rate" value={fmt(r.feedTph,1)} unit="t/h continuous" col={C.white}/>
                  <StatCard label="GH Floor" value={(r.ghArea/1000).toFixed(0)+"k"} unit="m² total" col={C.teal}/>
                  <StatCard label="Bed Area" value={r.bedArea.toLocaleString()} unit="m² available" col={C.teal}/>
                  <StatCard label="Floor Util" value={fmt(r.totalAreaUtil,0)+"%"} unit="beds used" col={uCol(r.totalAreaUtil)}/>
                  <StatCard label="Trucks" value={nTrucks} unit={truckShort?"need "+r.trucksNeeded+" ⚠":"sufficient ✓"} col={truckShort?C.red:C.green}/>
                  <StatCard label="Mini Loaders" value={r.nMinis} unit={r.miniWorking+" working + 2 reserve"} col={C.green}/>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14,marginBottom:14}}>
                  <Panel title="S3 — Microbial Zone" colour={C.teal}>
                    <KV k="Residence" v={s3Days+" days"}/>
                    <KV k="In-house inventory" v={r.s3Inv.toFixed(0)+" t"} col={C.amber}/>
                    <KV k={"Vol @ "+bulkDen+" t/m³"} v={r.s3Vol.toFixed(0)+" m³"}/>
                    <KV k={"Floor @ "+bedDepth+"m"} v={r.s3AreaNeed.toFixed(0)+" m² needed"}/>
                    <KV k="Zone allocated" v={r.s3BedArea.toFixed(0)+" m²"} col={C.teal}/>
                    <div style={{marginTop:8}}><UBar label="S3 zone utilisation" pct={r.s3Util}/></div>
                  </Panel>
                  <Panel title="S4 — BSF Larval Zone" colour={C.purple}>
                    <KV k="Larval cycle" v={s4Days+" days"}/>
                    <KV k="Feed to S4" v={fmt(r.s4Feed,0)+" t/day"} col={C.grey}/>
                    <KV k="In-house inventory" v={r.s4Inv.toFixed(0)+" t"} col={C.amber}/>
                    <KV k={"Floor @ "+bedDepth+"m"} v={r.s4AreaNeed.toFixed(0)+" m² needed"}/>
                    <KV k="Zone allocated" v={r.s4BedArea.toFixed(0)+" m²"} col={C.purple}/>
                    <div style={{marginTop:8}}><UBar label="S4 zone utilisation" pct={r.s4Util}/></div>
                  </Panel>
                  <Panel title="Fleet Summary" colour={C.amber}>
                    <KV k="Cycle time" v={fmt(r.cycleMin,0)+" min"}/>
                    <KV k="Payload/truck/day" v={fmt(r.capPerTruck,0)+" t"}/>
                    <KV k="Trucks needed" v={r.trucksNeeded} col={truckShort?C.red:C.green}/>
                    <KV k="Trucks specified" v={nTrucks} col={C.amber}/>
                    <KV k="Mini loaders" v={r.nMinis+" ("+r.miniWorking+"W | 1C | 1S)"} col={C.green}/>
                    <KV k="Sprinkler heads" v={r.nSprinklers.toLocaleString()}/>
                    <KV k="Exhaust fans" v={r.nFans+" units"}/>
                    <div style={{marginTop:8}}><UBar label="Truck utilisation" pct={r.truckUtil}/></div>
                  </Panel>
                </div>
                <Panel title="Floor Zone Layout — Schematic">
                  <pre style={{fontFamily:mono,fontSize:10,color:C.teal,lineHeight:1.65,margin:0,overflowX:"auto"}}>{
`Y=0m  INBOUND — trucks tip, Wave 1 inoculation at GH entry
┌──────────────────────────────────────────────────────────────────┐
│  INBOUND DOORS              HIGH ROOF 7–8m over central lane     │
│                                                                  │
│  S3 MICROBIAL BEDS  (${s3Frac}% floor = ${r.s3BedArea.toFixed(0)} m²)              │
│  [S3][S3][S3][S3][S3][S3]  ║ ${laneW}m  ║  200mm RC slab        │
│   ·   ·   ·   ·   ·   ·   ║TRUCK║  ${nTrucks}× Hino Dutro 130HD  │
│  Wave 1: pH≤8.0            ║LANE ║  ${truckPayload}t payload each          │
│  Wave 2: T<50°C            ║     ║                               │
│  BSF gate: T≤30°C ────────→ S4   ║                               │
├────────────────────────────╫─────╫───────────────────────────────┤
│  S4 BSF LARVAL BEDS  (${100-s3Frac}% floor = ${r.s4BedArea.toFixed(0)} m²)            │
│  [S4][S4][S4][S4][S4][S4]  ║     ║  ${r.nMinis}× LTMG LT750D        │
│   ·   ·   ·   ·   ·   ·   ║     ║  ${r.miniWorking} working | 1 charge   │
│  5-day bio floor           ║     ║  1 spare                      │
│  CP ≥ 5% DM required       ║     ║                               │
│                             ║     ║                               │
│  FLOOR 1.5% slope → TD-L TRENCH DRAIN → POME/LEACHATE POND      │
└──────────────────────────────────────────────────────────────────┘
Y=${ghL}m  OUTBOUND — conditioned substrate exit to S5

[S3]=microbial beds  [S4]=BSF larval beds  ·=sprinkler heads 3m×3m`
                  }</pre>
                </Panel>
              </div>
            )}

            {tab==="s3-zone"&&(
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                <Panel title="S3 Mass Balance" colour={C.teal}>
                  <KV k="Feed from S2 blend point" v={feedTpd+" t/day"} col={C.white}/>
                  <KV k="Feed moisture" v={feedMc+"% WB"}/>
                  <KV k="Dry matter" v={fmt(r.feedDm,1)+" t DM/day"} col={C.grey}/>
                  <KV k="Throughput" v={fmt(r.feedTph,2)+" t/h"} col={C.teal}/>
                  <KV k="S3 residence" v={s3Days+" days"}/>
                  <KV k="In-house inventory" v={r.s3Inv.toFixed(0)+" t"} col={C.amber}/>
                  <KV k={"Volume @ "+bulkDen+" t/m³"} v={r.s3Vol.toFixed(0)+" m³"}/>
                  <KV k={"Floor @ "+bedDepth+"m depth"} v={r.s3AreaNeed.toFixed(0)+" m² needed"}/>
                  <KV k="Zone allocated" v={r.s3BedArea.toFixed(0)+" m²"} col={r.s3Util>100?C.red:C.teal}/>
                  <KV k="Utilisation" v={fmt(r.s3Util,1)+"%"} col={uCol(r.s3Util)}/>
                  <div style={{marginTop:8}}><UBar label="S3 zone utilisation" pct={r.s3Util}/></div>
                  {r.s3Util>100&&<div style={{background:"#2a0d0d",border:"1px solid "+C.red,borderRadius:4,padding:8,marginTop:8}}><div style={{fontSize:10,color:C.red,fontWeight:700}}>⚠ S3 UNDERSIZED — expand GH, reduce S3 days, or increase S3 floor %</div></div>}
                </Panel>
                <Panel title="S3 Process Gates + Movement" colour={C.teal}>
                  <KV k="Input" v="S2 blended EFB+OPDC+POME @ pH 6.5–8.0"/>
                  <KV k="Wave 1 gate" v="pH ≤ 8.0 on blender discharge" col={C.green}/>
                  <KV k="Wave 2 gate" v="Substrate temp < 50°C" col={C.green}/>
                  <KV k="BSF introduction gate" v="Substrate temp ≤ 30°C" col={C.green}/>
                  <KV k="5-day bio floor" v="Hard minimum — cannot be overridden" col={C.amber}/>
                  <KV k="Moisture target" v="~60% via sprinklers"/>
                  <KV k="Output" v="Conditioned substrate → S4 zone" col={C.teal}/>
                  <div style={{background:"#0d1a2e",border:"1px solid "+C.teal+"44",borderRadius:4,padding:10,marginTop:12}}>
                    <div style={{fontSize:10,color:C.teal,fontWeight:700,marginBottom:5}}>ZONE MOVEMENT PATTERN</div>
                    <pre style={{fontFamily:mono,fontSize:9,color:C.grey,margin:0,lineHeight:1.9}}>{
`Y≈0–40m    INBOUND
  Trucks tip → minis push to S3 beds
  Wave 1 inoculation at GH entry

Y≈40–120m  CONDITIONING
  Sprinklers hold 60% MC
  Minis turn/re-mound periodically
  Wave 2 when T < 50°C

Y≈120m     S3→S4 HANDOVER
  T ≤ 30°C confirmed
  Minis move substrate into S4 zone`}
                    </pre>
                  </div>
                </Panel>
              </div>
            )}

            {tab==="s4-zone"&&(
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                <Panel title="S4 Mass Balance" colour={C.purple}>
                  <KV k="Feed from S3 (5% DM loss)" v={fmt(r.s4Feed,0)+" t/day"} col={C.white}/>
                  <KV k="BSF larval cycle" v={s4Days+" days"}/>
                  <KV k="In-house inventory" v={r.s4Inv.toFixed(0)+" t"} col={C.amber}/>
                  <KV k={"Volume @ "+bulkDen+" t/m³"} v={r.s4Vol.toFixed(0)+" m³"}/>
                  <KV k={"Floor @ "+bedDepth+"m depth"} v={r.s4AreaNeed.toFixed(0)+" m² needed"}/>
                  <KV k="Zone allocated" v={r.s4BedArea.toFixed(0)+" m²"} col={r.s4Util>100?C.red:C.purple}/>
                  <KV k="Utilisation" v={fmt(r.s4Util,1)+"%"} col={uCol(r.s4Util)}/>
                  <div style={{marginTop:8}}><UBar label="S4 zone utilisation" pct={r.s4Util}/></div>
                  {r.s4Util>100&&<div style={{background:"#2a0d0d",border:"1px solid "+C.red,borderRadius:4,padding:8,marginTop:8}}><div style={{fontSize:10,color:C.red,fontWeight:700}}>⚠ S4 UNDERSIZED — increase S4 floor %, reduce BSF days, or expand GH</div></div>}
                </Panel>
                <Panel title="S4 Guardrails + Infrastructure Notes" colour={C.purple}>
                  <KV k="BSF intro gate" v="Substrate T ≤ 30°C" col={C.green}/>
                  <KV k="5-day bio floor" v="Hard-coded — cannot be overridden" col={C.amber}/>
                  <KV k="CP floor" v="≥ 5% CP DM — binding biological constraint" col={C.amber}/>
                  <KV k="Moisture target" v="60–70% for larval activity"/>
                  <KV k="BSF colony" v="Centralised CFI supply — delivery cost = economic floor"/>
                  <KV k="S4 outputs" v="Prepupae (BSF larvae) + frass biofertiliser" col={C.purple}/>
                  <div style={{background:"#1a0d2e",border:"1px solid "+C.purple+"44",borderRadius:4,padding:10,marginTop:12}}>
                    <div style={{fontSize:10,color:C.purple,fontWeight:700,marginBottom:5}}>S4-SPECIFIC CAPEX NOT INCLUDED</div>
                    <div style={{fontSize:10,color:C.grey,lineHeight:1.8}}>
                      Separate S4 CAPEX block required for:<br/>
                      · Larval collection troughs + harvest ramps<br/>
                      · Prepupae separation + washing<br/>
                      · Harvest conveyors to S5 processing<br/>
                      · Frass collection + bagging lines<br/>
                      · Temp/humidity sensor network
                    </div>
                  </div>
                </Panel>
              </div>
            )}

            {tab==="fleet"&&(
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                <Panel title="Truck Fleet — Hino Dutro 130HD" colour={C.amber}>
                  <KV k="Model" v="Hino Dutro 130HD Dump" col={C.white}/>
                  <KV k="Class" v="8-ton GVW light/medium dump"/>
                  <KV k="Indonesian price" v="~$19,922 (Oto.com — Dutro Dump 130HD)" col={C.grey}/>
                  <KV k="Agent" v="Astra/Hino Indonesia dealer network" col={C.grey}/>
                  <KV k="Tipping height @ 60°" v="~5.0–5.5m (clears 7–8m roof)"/>
                  <div style={{height:1,background:C.border,margin:"8px 0"}}/>
                  <KV k="Payload" v={truckPayload+" t"}/>
                  <KV k="One-way haul" v={haulDist+" m"}/>
                  <KV k="Travel time (one-way)" v={fmt(r.haulMin,1)+" min @ "+truckSpd+" km/h"}/>
                  <KV k="Load + tip time" v={tipTime+" min"}/>
                  <KV k="Full cycle" v={fmt(r.cycleMin,0)+" min"} col={C.amber}/>
                  <KV k="Trips/truck/day" v={fmt(r.tripsPerDay,1)}/>
                  <KV k="Capacity/truck/day" v={fmt(r.capPerTruck,0)+" t"}/>
                  <KV k="Trucks NEEDED (calc)" v={r.trucksNeeded} col={truckShort?C.red:C.green}/>
                  <KV k="Trucks SPECIFIED" v={nTrucks} col={C.amber}/>
                  <div style={{marginTop:10}}><UBar label="Fleet utilisation" pct={r.truckUtil}/></div>
                  {truckShort&&<div style={{background:"#2a0d0d",border:"1px solid "+C.red,borderRadius:4,padding:8,marginTop:8}}><div style={{fontSize:10,color:C.red,fontWeight:700}}>⚠ ADD {r.trucksNeeded-nTrucks} TRUCK(S) or reduce haul distance</div></div>}
                </Panel>
                <Panel title="Mini Loader Fleet — LTMG LT750D" colour={C.green}>
                  <KV k="Model" v="LTMG LT750D Electric Mini Skid-Steer" col={C.white}/>
                  <KV k="Manufacturer" v="LTMG Machinery Group, China"/>
                  <KV k="Rated load" v="400 kg"/>
                  <KV k="Bucket volume" v="0.15 m³ (≈0.18–0.20 t wet residue)"/>
                  <KV k="Machine weight" v="1,200 kg"/>
                  <KV k="Working width" v="980 mm — fits 1–2m greenhouse aisles"/>
                  <KV k="Pushing capacity" v="~1.0–1.5 t on concrete"/>
                  <KV k="Runtime per charge" v="~4h moderate duty"/>
                  <KV k="Charge time (220V)" v="6–8h (0→100% SOC)"/>
                  <KV k="Supplier" v="Chinese OEM via Indonesian heavy equipment importer" col={C.grey}/>
                  <KV k="Warranty" v="1yr / 2,000h; CE certified"/>
                  <div style={{height:1,background:C.border,margin:"8px 0"}}/>
                  <KV k="Required throughput" v={fmt(r.feedTph,2)+" t/h"}/>
                  <KV k="Per-mini throughput" v={miniTph+" t/h (25–30 cycles/h)"}/>
                  <KV k="Working simultaneously" v={r.miniWorking+" units"} col={C.amber}/>
                  <KV k="+ 1 on charge" v="1 unit" col={C.grey}/>
                  <KV k="+ 1 spare/maintenance" v="1 unit" col={C.grey}/>
                  <KV k="Total fleet" v={r.nMinis+" units"} col={C.green}/>
                  <div style={{marginTop:10}}><UBar label="Working mini utilisation" pct={r.miniUtil}/></div>
                </Panel>
              </div>
            )}

            {tab==="capex"&&(
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                <div style={{display:"flex",flexDirection:"column",gap:14}}>
                  <Panel title="Civil — Earthworks + Sub-base" colour={C.blue} compact>
                    <KV k="Land clearing + grading (35,000 m²)" v={fmtk(r.capex.clearCost)} col={C.amber}/>
                    <KV k="Compaction 95% Proctor (35,000 m²)" v={fmtk(r.capex.compactCost)} col={C.amber}/>
                    <KV k={"Crushed aggregate 100–200mm ("+r.aggArea.toLocaleString()+" m²)"} v={fmtk(r.capex.aggCost)} col={C.amber}/>
                    <KV k={"Sand bedding 25–50mm ("+r.aggArea.toLocaleString()+" m²)"} v={fmtk(r.capex.sandCost)} col={C.amber}/>
                    <KV k="Drainage earthworks + pipes + manholes" v={fmtk(r.capex.drainCivil)} col={C.amber}/>
                    <KV k="SUBTOTAL" v={fmtk(r.capex.subtotalSubbase)} col={C.white}/>
                  </Panel>
                  <Panel title="Civil — Slabs + External" colour={C.blue} compact>
                    <KV k={"150mm slab beds+aisles ("+r.slab150Area?.toLocaleString()+" m²)"} v={fmtk(r.capex.slab150Cost)} col={C.amber}/>
                    <KV k="200mm slab truck lane (1,000 m²)" v={fmtk(r.capex.slab200Cost)} col={C.amber}/>
                    <KV k="External gravel roads (6,000 m²)" v={fmtk(r.capex.extRoadCost)} col={C.amber}/>
                    <KV k="External concrete aprons (4,000 m²)" v={fmtk(r.capex.extApronCost)} col={C.amber}/>
                    <KV k="SUBTOTAL" v={fmtk(r.capex.subtotalSlab)} col={C.white}/>
                  </Panel>
                  <Panel title="Structure" colour={C.teal} compact>
                    <KV k={"Steel + PVC film ("+r.ghArea.toLocaleString()+" m² @ $"+ghStruct+"/m²)"} v={fmtk(r.capex.ghStructCost)} col={C.amber}/>
                  </Panel>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:14}}>
                  <Panel title="MEP — Water / Drainage / Ventilation" colour={C.green} compact>
                    <KV k={"Sprinklers "+r.nSprinklers.toLocaleString()+" heads ("+r.ghArea.toLocaleString()+" m² @ $"+sprRate+"/m²)"} v={fmtk(r.capex.sprinklerCost)} col={C.amber}/>
                    <KV k="Wash-down ring main + 22 hose stations" v={fmtk(r.capex.washdownCost)} col={C.amber}/>
                    <KV k="Trench drain TD-L + TD-X + HD gratings" v={fmtk(r.capex.trenchHwCost)} col={C.amber}/>
                    <KV k={"Exhaust fans "+r.nFans+"× axial @ $2,000 ea"} v={fmtk(r.capex.fanCost)} col={C.amber}/>
                    <KV k="SUBTOTAL" v={fmtk(r.capex.subtotalMEP)} col={C.white}/>
                  </Panel>
                  <Panel title="Mobile Equipment" colour={C.amber} compact>
                    <KV k={"Hino Dutro 130HD ("+nTrucks+"× @ $"+truckCost.toLocaleString()+")"} v={fmtk(r.capex.truckFleetCost)} col={C.amber}/>
                    <KV k={"LTMG LT750D mini loaders ("+r.nMinis+"× @ $"+miniCost.toLocaleString()+")"} v={fmtk(r.capex.miniFleetCost)} col={C.amber}/>
                    <KV k="SUBTOTAL" v={fmtk(r.capex.subtotalMobile)} col={C.white}/>
                  </Panel>
                  <Panel compact>
                    {[
                      {l:"Earthworks + sub-base",        v:r.capex.subtotalSubbase},
                      {l:"Slabs + external surfacing",    v:r.capex.subtotalSlab},
                      {l:"GH structure + PVC film",       v:r.capex.ghStructCost},
                      {l:"MEP (water/drainage/fans)",     v:r.capex.subtotalMEP},
                      {l:"Mobile equipment",              v:r.capex.subtotalMobile},
                    ].map(row=>(
                      <div key={row.l} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid "+C.border}}>
                        <span style={{fontSize:12,color:C.label,fontFamily:sans}}>{row.l}</span>
                        <span style={{fontFamily:mono,fontSize:12,color:C.amber,fontWeight:700}}>{fmtk(row.v)}</span>
                      </div>
                    ))}
                    <div style={{display:"flex",justifyContent:"space-between",padding:"14px 0 4px",marginTop:4,borderTop:"2px solid "+C.gold}}>
                      <span style={{fontSize:14,fontWeight:700,color:C.white}}>TOTAL GH CAPEX</span>
                      <span style={{fontFamily:mono,fontSize:20,fontWeight:700,color:C.gold}}>{fmtk(r.capex.total)}</span>
                    </div>
                    <div style={{fontSize:10,color:C.dimgrey,marginTop:6,lineHeight:1.6}}>Excludes: advanced controls/SCADA, internal electrical distribution, S4-specific BSF harvest equipment.</div>
                  </Panel>
                </div>
              </div>
            )}

            {tab==="equipment"&&(
              <div>
                <div style={{background:C.panel,border:"1px solid "+C.border,borderRadius:6,overflow:"hidden"}}>
                  <div style={{display:"grid",gridTemplateColumns:"148px 1fr 36px 90px",gap:6,padding:"6px 10px",background:C.border}}>
                    {["TAG","EQUIPMENT","QTY","UNIT COST"].map(h=><div key={h} style={{fontFamily:mono,fontSize:9,color:C.grey,textTransform:"uppercase"}}>{h}</div>)}
                  </div>
                  <SHead title="STRUCTURE" colour={C.blue}/>
                  <ERow tag="GH-STRUCT-01" name={"Multi-span Steel + PVC Film Greenhouse — "+ghW+"×"+ghL+"m = "+r.ghArea.toLocaleString()+" m²"} qty={1} cost={r.capex.ghStructCost} note={"Tropical spec, 4m gutters, 7–8m high-roof central strip over "+laneW+"m truck lane. $"+ghStruct+"/m²"}/>
                  <SHead title="SLABS + EARTHWORKS" colour={C.blue}/>
                  <ERow tag="GH-SLAB-150" name={"150mm RC C25/30 — Beds + Aisles — "+r.slab150Area?.toLocaleString()+" m²"} qty={1} cost={r.capex.slab150Cost} note={"8mm mesh @ 150–200mm ctrs, upper third, 50mm cover. $"+(slab150Mat+slab150Lab)+"/m²"}/>
                  <ERow tag="GH-SLAB-200" name={"200mm RC C25/30 — Truck Lane "+laneW+"m × "+ghL+"m = "+(laneW*ghL).toLocaleString()+" m²"} qty={1} cost={r.capex.slab200Cost} note="10mm mesh, dowel bars at joints, rated 20t GVW truck"/>
                  <ERow tag="GH-EARTH-01" name="Land Clearing + Grading — 35,000 m² @ $0.75/m²" qty={1} cost={r.capex.clearCost}/>
                  <ERow tag="GH-EARTH-02" name="Compaction to 95% Proctor — 35,000 m² @ $1.25/m²" qty={1} cost={r.capex.compactCost}/>
                  <ERow tag="GH-EARTH-03" name={"Crushed Aggregate 100–200mm — "+r.aggArea.toLocaleString()+" m² @ $15/m²"} qty={1} cost={r.capex.aggCost}/>
                  <ERow tag="GH-EARTH-04" name={"Sand Bedding 25–50mm — "+r.aggArea.toLocaleString()+" m² @ $8.50/m²"} qty={1} cost={r.capex.sandCost}/>
                  <ERow tag="GH-DRAIN-CIV" name={"Drainage Earthworks + PVC/HDPE Pipes + Manholes — "+r.aggArea.toLocaleString()+" m² @ $18/m²"} qty={1} cost={r.capex.drainCivil}/>
                  <ERow tag="GH-ROAD-EXT" name="External Gravel Access Roads — 6,000 m² @ $4/m²" qty={1} cost={r.capex.extRoadCost}/>
                  <ERow tag="GH-APRON-EXT" name="External Concrete Truck Aprons 150mm — 4,000 m² @ $22/m²" qty={1} cost={r.capex.extApronCost}/>
                  <SHead title="DRAINAGE — TRENCH SYSTEM" colour={C.teal}/>
                  <ERow tag="TD-L-01" name={"Longitudinal Trench Drain — "+ghL+"m length, 300–400mm wide, 300–500mm deep, 0.5% fall to outlet"} qty={1} cost={r.capex.trenchHwCost} note="Cast-in-place or polymer concrete; HD slip-resistant grating rated for truck wheels; removable for cleaning"/>
                  <ERow tag="TD-X-01/02" name="Cross Trench Drains — inbound + outbound doors, 200–300mm internal, 10–20m each" qty={2} note="0.5–1.0% fall into TD-L; grated flush with slab"/>
                  <ERow tag="GH-SUMP-01" name="Drop Pit / Sump at TD-L low end — buried pipe connection" qty={1}/>
                  <ERow tag="GH-PIPE-01" name="Buried Outfall Pipes 250–400mm PVC/HDPE → leachate pond, 0.5–1.0% slope" qty={1} note="Access manholes every 40–60m"/>
                  <SHead title="WATER + SPRINKLERS" colour={C.green}/>
                  <ERow tag="SPR-GH-01" name={"Overhead Sprinkler System — "+r.nSprinklers.toLocaleString()+" heads @ 3m×3m, 10–20 irrigation zones"} qty={1} cost={r.capex.sprinklerCost} note={"Laterals 32–40mm, cross-mains 63–75mm, header 90–110mm PE/PVC; moisture sensor control. $"+sprRate+"/m²"}/>
                  <ERow tag="WD-RING-01" name="Wash-down Ring Main 50–75mm + 22 Hose Stations @ 20–25m spacing" qty={1} cost={r.capex.washdownCost} note="20–30 L/min per station @ 3–4 bar; backflow prevention; design for 2 simultaneous"/>
                  <SHead title="VENTILATION" colour={C.teal}/>
                  <ERow tag="FAN-EXH-01" name={"Exhaust Axial Fans 1.0–1.2m dia — "+r.nFans+" units for 20 ACH target"} qty={r.nFans} cost={2000} note="35,000 m³/h each; mounted end + side walls; pulls air across beds and out"/>
                  <ERow tag="GH-VENT-RIDGE" name="Ridge Vents Continuous — ~3,000 m² openable (15% of floor)" qty={1} note="Manual or motorised actuators along all span peaks"/>
                  <ERow tag="GH-VENT-SIDE" name="Side Roll-up Film Vents — both long walls, 1.5–2.0m band" qty={1}/>
                  <SHead title="MOBILE — TRUCKS" colour={C.amber}/>
                  {Array.from({length:nTrucks},(_,i)=>(
                    <ERow key={"tr"+i} tag={"TR-GH-0"+(i+1)} name={"Hino Dutro 130HD Dump — "+truckPayload+"t payload, 8-ton GVW class"} qty={1} cost={truckCost} note="Astra/Hino Indonesia dealer; Dutro Dump 130HD ~$19,922 (Oto.com ref)"/>
                  ))}
                  <SHead title="MOBILE — MINI LOADERS" colour={C.green}/>
                  {Array.from({length:r.nMinis},(_,i)=>(
                    <ERow key={"ml"+i} tag={"ML-GH-0"+(i+1)} name={"LTMG LT750D 400kg Electric Mini Skid-Steer — "+(i<r.miniWorking?"WORKING":(i===r.miniWorking?"CHARGING":"SPARE"))} qty={1} cost={miniCost} note="980mm width, 0.15m³ bucket, ~4h runtime, 6–8h charge 220V; imported via Indonesian heavy equipment trader"/>
                  ))}
                </div>
                <div style={{marginTop:8,fontSize:9,color:C.grey,lineHeight:1.7}}>TBD = supplier quote required. S4 BSF harvest equipment (troughs, separation, frass bagging, conveyors to S5) not included — separate CAPEX block required.</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}



// ======================================================================
// FILE: src/CFI_S1S2_Calculator.jsx
// SIZE: 34851 chars / 544 lines
// ======================================================================

import { useState, useMemo } from "react";

const C = {
  bg: "#0b0f14", panel: "#111820", border: "#1e2d3d", borderBright: "#2a4060",
  input: "#0d1f35", blue: "#4da6ff", green: "#3ddc84", amber: "#f0a030",
  red: "#ff5555", teal: "#22b89e", white: "#e8edf2", grey: "#6b8099",
  dimgrey: "#3a4f60", label: "#8ba8c0",
};
const mono = "'JetBrains Mono','Fira Code','Courier New',monospace";
const sans = "'IBM Plex Sans','Segoe UI',sans-serif";

function calcBayA(pressCakeTpd, bayCapT) {
  return Math.ceil(pressCakeTpd / bayCapT + 3);
}
function calcMixerCount(inputTpd, batchT, cycleMin) {
  return Math.ceil((inputTpd / batchT) / ((24 * 60) / cycleMin));
}
function utilColour(pct) {
  return pct > 85 ? C.red : pct > 65 ? C.amber : C.green;
}

function Inp({ label, unit, value, onChange, min=0, max=9999, step=1 }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
      <div style={{ width:200, fontSize:11, color:C.label, fontFamily:sans }}>{label}</div>
      <div style={{ display:"flex", alignItems:"center", gap:4, background:C.input, border:`1px solid ${C.blue}`, borderRadius:4, padding:"3px 8px" }}>
        <input type="number" min={min} max={max} step={step} value={value}
          onChange={e => onChange(parseFloat(e.target.value)||0)}
          style={{ width:70, background:"transparent", border:"none", outline:"none", color:C.blue, fontFamily:mono, fontSize:13, fontWeight:700 }} />
        <span style={{ fontFamily:mono, fontSize:10, color:C.dimgrey }}>{unit}</span>
      </div>
    </div>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer", marginBottom:8 }} onClick={() => onChange(!checked)}>
      <div style={{ width:32, height:16, borderRadius:8, background:checked?C.teal:C.dimgrey, position:"relative", transition:"background 0.2s", flexShrink:0 }}>
        <div style={{ position:"absolute", top:2, left:checked?16:2, width:12, height:12, borderRadius:"50%", background:C.white, transition:"left 0.2s" }} />
      </div>
      <span style={{ fontSize:11, color:checked?C.white:C.grey, fontFamily:sans }}>{label}</span>
    </div>
  );
}

function KV({ k, v, col }) {
  return (
    <div style={{ display:"flex", justifyContent:"space-between", padding:"5px 0", borderBottom:`1px solid ${C.border}` }}>
      <span style={{ fontSize:12, color:C.label, fontFamily:sans }}>{k}</span>
      <span style={{ fontFamily:mono, fontSize:12, color:col||C.green }}>{v}</span>
    </div>
  );
}

function UtilBar({ label, pct }) {
  const col = utilColour(pct);
  return (
    <div style={{ marginBottom:8 }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
        <span style={{ fontSize:11, color:C.label, fontFamily:sans }}>{label}</span>
        <span style={{ fontFamily:mono, fontSize:11, color:col, fontWeight:700 }}>{pct.toFixed(1)}%</span>
      </div>
      <div style={{ height:5, background:C.border, borderRadius:3 }}>
        <div style={{ width:`${Math.min(pct,100)}%`, height:"100%", background:col, borderRadius:3, transition:"width 0.4s" }} />
      </div>
    </div>
  );
}

function ERow({ tag, name, qty, cost, isNew, note }) {
  return (
    <div style={{ display:"grid", gridTemplateColumns:"140px 1fr 40px 90px", gap:6, padding:"6px 10px",
      borderBottom:`1px solid ${C.border}`, background:isNew?"#0d2a1a":"transparent",
      borderLeft:isNew?`2px solid ${C.green}`:`2px solid transparent` }}>
      <div style={{ fontFamily:mono, fontSize:11, color:isNew?C.green:C.teal }}>{tag}</div>
      <div>
        <div style={{ fontFamily:sans, fontSize:12, color:C.white }}>{name}</div>
        {note && <div style={{ fontFamily:sans, fontSize:10, color:C.grey, marginTop:1 }}>{note}</div>}
      </div>
      <div style={{ fontFamily:mono, fontSize:12, color:C.white, textAlign:"center" }}>{qty}</div>
      <div style={{ fontFamily:mono, fontSize:12, color:C.amber, textAlign:"right" }}>
        {cost ? "$"+cost.toLocaleString() : "TBD"}
      </div>
    </div>
  );
}

function SectionHead({ title, colour }) {
  return (
    <div style={{ padding:"6px 10px", background:colour+"22", fontFamily:mono, fontSize:10, color:colour, letterSpacing:2 }}>
      {"── "+title+" ──────────────────────────────────"}
    </div>
  );
}

function Panel({ title, children }) {
  return (
    <div style={{ background:C.panel, border:`1px solid ${C.border}`, borderRadius:6, padding:16 }}>
      {title && <div style={{ fontSize:11, color:C.label, marginBottom:12, fontFamily:sans, fontWeight:600, textTransform:"uppercase", letterSpacing:1 }}>{title}</div>}
      {children}
    </div>
  );
}

function StreamCard({ title, colour, children }) {
  return (
    <div style={{ background:C.panel, border:`1px solid ${colour}44`, borderTop:`3px solid ${colour}`, borderRadius:6, padding:16 }}>
      <div style={{ fontFamily:mono, fontSize:10, color:colour, letterSpacing:2, marginBottom:12, textTransform:"uppercase" }}>{title}</div>
      {children}
    </div>
  );
}

export default function CFI_S1S2() {
  const [ffbTph, setFfbTph] = useState(60);
  const [opsH, setOpsH] = useState(24);
  const [efbRatio, setEfbRatio] = useState(23);
  const [opdcRatio, setOpdcRatio] = useState(4.2);
  const [pomeTpd, setPomeTpd] = useState(30);
  const [inclPome, setInclPome] = useState(true);
  const [efbMc, setEfbMc] = useState(62.5);
  const [opdcMc, setOpdcMc] = useState(70);
  const [pomeMc, setPomeMc] = useState(85);
  const [pressMc, setPressMc] = useState(52);
  const [bayCap, setBayCap] = useState(50);
  const [efbBatch, setEfbBatch] = useState(5);
  const [opdcBatch, setOpdcBatch] = useState(2);
  const [cycleMin, setCycleMin] = useState(75);
  const [pressRate, setPressRate] = useState(15);
  const [blendRate, setBlendRate] = useState(15);
  const [pksaDose, setPksaDose] = useState(8);
  const [limeDose, setLimeDose] = useState(5);
  const [bufferH, setBufferH] = useState(1);
  const [tab, setTab] = useState("overview");

  const r = useMemo(() => {
    const ffbTpd = ffbTph * opsH;
    // EFB
    const efbFresh = ffbTpd * efbRatio / 100;
    const efbDm = efbFresh * (1 - efbMc / 100);
    const efbCake = efbDm / (1 - pressMc / 100);
    const efbTph = efbCake / 24;
    const efbMixers = calcMixerCount(efbFresh, efbBatch, cycleMin);
    const efbMixCap = efbMixers * efbBatch * (24 * 60 / cycleMin);
    const efbMixUtil = efbFresh / efbMixCap * 100;
    const efbPresses = Math.ceil(efbTph / pressRate) + 1;
    const efbPressUtil = efbTph / (efbPresses * pressRate) * 100;
    const efbBayA = calcBayA(efbCake, bayCap);
    const efbRowA = efbDm / 0.45;
    const efbHopper = (efbRowA / 24 * bufferH) / 0.40;
    const efbFill = bayCap / efbTph;
    // OPDC + POME
    const opdcFresh = ffbTpd * opdcRatio / 100;
    const opdcDm = opdcFresh * (1 - opdcMc / 100);
    const pomeDm = inclPome ? pomeTpd * (1 - pomeMc / 100) : 0;
    const pomeDecanter = inclPome ? pomeDm / 0.35 : 0;
    const combinedDm = opdcDm + pomeDm;
    const opdcCake = combinedDm / (1 - pressMc / 100);
    const opdcTph = opdcCake / 24;
    const opdcMixInput = opdcFresh + pomeDecanter;
    const opdcMixers = calcMixerCount(opdcMixInput, opdcBatch, cycleMin);
    const opdcMixCap = opdcMixers * opdcBatch * (24 * 60 / cycleMin);
    const opdcMixUtil = opdcMixInput / opdcMixCap * 100;
    const opdcPressUtil = opdcTph / pressRate * 100;
    const opdcBayA = calcBayA(opdcCake, bayCap);
    const opdcRowA = combinedDm / 0.45;
    const opdcHopper = (opdcRowA / 24 * bufferH) / 0.40;
    const opdcFill = bayCap / opdcTph;
    // Blend
    const blendTpd = efbRowA + opdcRowA;
    const blendTph = blendTpd / 24;
    const efbPct = efbRowA / blendTpd * 100;
    const loadEach = blendTph / 2;
    const utilEach = loadEach / blendRate * 100;
    const limeKgDay = blendTpd * limeDose;
    // PKSA
    const pksa_efb = efbFresh * pksaDose;
    const pksa_opdc = opdcMixInput * pksaDose;
    // CAPEX delta
    const pressAdd = (efbPresses - 2) * 65000;
    const blendAdd = 2 * 45000;
    const hopperAdd = 2 * 18000 + 12000;
    const weighAdd = 3 * 8000;
    const limeAdd = 15000;
    const rowBSave = -8 * 8000;
    const net = pressAdd + blendAdd + hopperAdd + weighAdd + limeAdd + rowBSave;

    return {
      ffbTpd,
      efb: { fresh:efbFresh, dm:efbDm, cake:efbCake, tph:efbTph, mixers:efbMixers, mixUtil:efbMixUtil, presses:efbPresses, pressUtil:efbPressUtil, bayA:efbBayA, rowA:efbRowA, hopper:efbHopper, fill:efbFill, pksa:pksa_efb },
      opdc: { fresh:opdcFresh, dm:opdcDm, cake:opdcCake, tph:opdcTph, mixInput:opdcMixInput, mixers:opdcMixers, mixUtil:opdcMixUtil, pressUtil:opdcPressUtil, bayA:opdcBayA, rowA:opdcRowA, hopper:opdcHopper, fill:opdcFill, pksa:pksa_opdc },
      pome: { dm:pomeDm, decanter:pomeDecanter },
      blend: { tpd:blendTpd, tph:blendTph, efbPct, loadEach, utilEach, limeKgDay },
      capex: { pressAdd, blendAdd, hopperAdd, weighAdd, limeAdd, rowBSave, net },
    };
  }, [ffbTph, opsH, efbRatio, opdcRatio, pomeTpd, inclPome, efbMc, opdcMc, pomeMc, pressMc, bayCap, efbBatch, opdcBatch, cycleMin, pressRate, blendRate, pksaDose, limeDose, bufferH]);

  const TABS = ["overview","efb","opdc","blend","capex","equipment"];

  return (
    <div style={{ background:C.bg, minHeight:"100vh", fontFamily:sans, color:C.white, display:"flex", flexDirection:"column" }}>
      {/* Header */}
      <div style={{ background:C.panel, borderBottom:`1px solid ${C.border}`, padding:"14px 24px", display:"flex", justifyContent:"space-between", alignItems:"center", flexShrink:0 }}>
        <div>
          <div style={{ fontFamily:mono, fontSize:10, color:C.teal, letterSpacing:3, textTransform:"uppercase" }}>CFI · Dynamic Process Model</div>
          <div style={{ fontSize:19, fontWeight:700, color:C.white, marginTop:2 }}>Stage 1 / 2 Equipment Calculator</div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontFamily:mono, fontSize:11, color:C.grey }}>{ffbTph} TPH · {opsH}h/day · {r.ffbTpd.toFixed(0)} t FFB/day</div>
          <div style={{ fontFamily:mono, fontSize:14, color:C.amber, fontWeight:700 }}>{r.blend.tpd.toFixed(0)} t/day → S3</div>
        </div>
      </div>

      <div style={{ display:"flex", flex:1, overflow:"hidden" }}>
        {/* Sidebar */}
        <div style={{ width:286, flexShrink:0, background:C.panel, borderRight:`1px solid ${C.border}`, padding:"16px 14px", overflowY:"auto" }}>
          <div style={{ fontFamily:mono, fontSize:10, color:C.teal, letterSpacing:2, marginBottom:12, textTransform:"uppercase" }}>Master Inputs</div>

          <div style={{ fontSize:11, color:C.label, marginBottom:6, fontWeight:600 }}>Mill</div>
          <Inp label="FFB throughput" unit="TPH" value={ffbTph} onChange={setFfbTph} min={10} max={200} step={5} />
          <Inp label="Operating hours" unit="h/day" value={opsH} onChange={setOpsH} min={8} max={24} />

          <div style={{ fontSize:11, color:C.label, margin:"14px 0 6px", fontWeight:600 }}>Feedstock</div>
          <Inp label="EFB yield" unit="% FFB" value={efbRatio} onChange={setEfbRatio} min={15} max={30} step={0.5} />
          <Inp label="OPDC yield" unit="% FFB" value={opdcRatio} onChange={setOpdcRatio} min={2} max={8} step={0.1} />
          <Inp label="POME sludge fresh" unit="t/day" value={pomeTpd} onChange={setPomeTpd} min={0} max={100} step={5} />
          <Toggle label="Include POME sludge" checked={inclPome} onChange={setInclPome} />

          <div style={{ fontSize:11, color:C.label, margin:"14px 0 6px", fontWeight:600 }}>Moisture</div>
          <Inp label="EFB inlet MC" unit="% WB" value={efbMc} onChange={setEfbMc} min={50} max={75} step={0.5} />
          <Inp label="OPDC inlet MC" unit="% WB" value={opdcMc} onChange={setOpdcMc} min={55} max={80} step={0.5} />
          <Inp label="POME sludge MC" unit="% WB" value={pomeMc} onChange={setPomeMc} min={70} max={92} />
          <Inp label="Press cake target MC" unit="% WB" value={pressMc} onChange={setPressMc} min={45} max={60} />

          <div style={{ fontSize:11, color:C.label, margin:"14px 0 6px", fontWeight:600 }}>Equipment</div>
          <Inp label="Bay capacity" unit="t" value={bayCap} onChange={setBayCap} min={20} max={100} step={5} />
          <Inp label="EFB mixer batch" unit="t/batch" value={efbBatch} onChange={setEfbBatch} min={2} max={10} step={0.5} />
          <Inp label="OPDC mixer batch" unit="t/batch" value={opdcBatch} onChange={setOpdcBatch} min={1} max={5} step={0.5} />
          <Inp label="Mixer cycle" unit="min" value={cycleMin} onChange={setCycleMin} min={60} max={120} step={5} />
          <Inp label="Press rated cap" unit="t/h" value={pressRate} onChange={setPressRate} min={5} max={30} step={5} />
          <Inp label="Blender rated cap" unit="t/h" value={blendRate} onChange={setBlendRate} min={5} max={30} step={5} />
          <Inp label="PKSA dose" unit="kg/t wet" value={pksaDose} onChange={setPksaDose} min={4} max={15} />
          <Inp label="Limestone dose" unit="kg/t WB" value={limeDose} onChange={setLimeDose} min={2} max={15} />
          <Inp label="Hopper buffer" unit="h" value={bufferH} onChange={setBufferH} min={0.5} max={4} step={0.5} />
        </div>

        {/* Main */}
        <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
          {/* Tabs */}
          <div style={{ display:"flex", borderBottom:`1px solid ${C.border}`, flexShrink:0, background:C.panel }}>
            {TABS.map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                background:"transparent", border:"none",
                borderBottom: tab===t ? `2px solid ${C.teal}` : "2px solid transparent",
                color: tab===t ? C.white : C.grey,
                fontFamily:mono, fontSize:11, textTransform:"uppercase", letterSpacing:1,
                padding:"11px 16px", cursor:"pointer"
              }}>{t}</button>
            ))}
          </div>

          <div style={{ flex:1, overflowY:"auto", padding:20 }}>

            {/* ── OVERVIEW ── */}
            {tab === "overview" && (
              <div>
                {/* KPI strip */}
                <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:10, marginBottom:20 }}>
                  {[
                    { label:"FFB Daily", val:r.ffbTpd.toFixed(0), unit:"t/day", col:C.white },
                    { label:"Total → S3", val:r.blend.tpd.toFixed(0), unit:"t/day", col:C.green },
                    { label:"Blend Rate", val:r.blend.tph.toFixed(1), unit:"t/h", col:C.green },
                    { label:"EFB : OPDC", val:`${r.blend.efbPct.toFixed(0)}:${(100-r.blend.efbPct).toFixed(0)}`, unit:"ratio", col:C.teal },
                    { label:"Limestone/day", val:(r.blend.limeKgDay/1000).toFixed(2), unit:"t/day", col:C.amber },
                  ].map(k => (
                    <div key={k.label} style={{ background:C.panel, border:`1px solid ${C.border}`, borderRadius:6, padding:14 }}>
                      <div style={{ fontSize:10, color:C.label, textTransform:"uppercase", letterSpacing:1, marginBottom:4 }}>{k.label}</div>
                      <div style={{ fontFamily:mono, fontSize:22, fontWeight:700, color:k.col }}>{k.val}</div>
                      <div style={{ fontFamily:mono, fontSize:10, color:C.grey }}>{k.unit}</div>
                    </div>
                  ))}
                </div>

                {/* Stream cards */}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14 }}>
                  <StreamCard title="EFB Line" colour={C.blue}>
                    <KV k="Fresh input" v={r.efb.fresh.toFixed(1)+" t/day"} />
                    <KV k="Press cake @52%" v={r.efb.cake.toFixed(1)+" t/day"} col={C.teal} />
                    <KV k="Row A bays" v={r.efb.bayA+" units"} col={C.amber} />
                    <KV k="Mixers" v={r.efb.mixers+" units"} col={utilColour(r.efb.mixUtil)} />
                    <KV k="Presses (incl N+1)" v={r.efb.presses+" units"} col={C.green} />
                    <KV k="Bay fill time" v={r.efb.fill.toFixed(1)+"h"} col={C.grey} />
                    <div style={{ marginTop:10 }}>
                      <UtilBar label="Mixer util" pct={r.efb.mixUtil} />
                      <UtilBar label="Press util" pct={r.efb.pressUtil} />
                    </div>
                  </StreamCard>

                  <StreamCard title={inclPome ? "OPDC + POME" : "OPDC Line"} colour={C.teal}>
                    <KV k="OPDC fresh" v={r.opdc.fresh.toFixed(1)+" t/day"} />
                    {inclPome && <KV k="POME decanter cake" v={r.pome.decanter.toFixed(1)+" t/day"} col={C.grey} />}
                    <KV k="Combined to mixers" v={r.opdc.mixInput.toFixed(1)+" t/day"} col={C.teal} />
                    <KV k="Press cake @52%" v={r.opdc.cake.toFixed(1)+" t/day"} />
                    <KV k="Row A bays" v={r.opdc.bayA+" units"} col={C.amber} />
                    <KV k="Mixers required" v={r.opdc.mixers+" units"} col={utilColour(r.opdc.mixUtil)} />
                    <div style={{ marginTop:10 }}>
                      <UtilBar label="Mixer util" pct={r.opdc.mixUtil} />
                      <UtilBar label="Press util (1 press)" pct={r.opdc.pressUtil} />
                    </div>
                  </StreamCard>

                  <StreamCard title="Blend Point → S3" colour={C.amber}>
                    <KV k="Total to blenders" v={r.blend.tph.toFixed(2)+" t/h"} col={C.amber} />
                    <KV k="Blenders (locked 2×)" v="2 units" col={C.green} />
                    <KV k="Load each" v={r.blend.loadEach.toFixed(2)+" t/h"} />
                    <KV k="Util each" v={r.blend.utilEach.toFixed(1)+"%"} col={utilColour(r.blend.utilEach)} />
                    <KV k="EFB hopper" v={(r.efb.hopper/2).toFixed(0)+" m³ × 2"} col={C.grey} />
                    <KV k="OPDC hopper" v={r.opdc.hopper.toFixed(0)+" m³"} col={C.grey} />
                    <div style={{ marginTop:10 }}>
                      <UtilBar label="Each blender" pct={r.blend.utilEach} />
                    </div>
                    <div style={{ background:"#0d2216", border:`1px solid ${C.green}33`, borderRadius:4, padding:8, marginTop:8 }}>
                      <div style={{ fontSize:10, color:C.green, fontWeight:700, marginBottom:3 }}>ROW B ELIMINATED</div>
                      <div style={{ fontSize:10, color:C.grey }}>Limestone dosed at blender inlet. pH sensor = Wave 1 trigger.</div>
                    </div>
                  </StreamCard>
                </div>

                {/* Util summary */}
                <div style={{ marginTop:16 }}>
                  <Panel title="All Equipment Utilisation">
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
                      <div>
                        <div style={{ fontSize:11, color:C.blue, marginBottom:8 }}>EFB LINE</div>
                        <UtilBar label={"EFB Mixers ("+r.efb.mixers+"×)"} pct={r.efb.mixUtil} />
                        <UtilBar label={"EFB Presses ("+r.efb.presses+"×)"} pct={r.efb.pressUtil} />
                      </div>
                      <div>
                        <div style={{ fontSize:11, color:C.teal, marginBottom:8 }}>OPDC LINE + BLEND</div>
                        <UtilBar label={"OPDC Mixers ("+r.opdc.mixers+"×)"} pct={r.opdc.mixUtil} />
                        <UtilBar label="OPDC Press (1×)" pct={r.opdc.pressUtil} />
                        <UtilBar label={"Blenders (2× "+blendRate+" t/h)"} pct={r.blend.utilEach} />
                      </div>
                    </div>
                  </Panel>
                </div>
              </div>
            )}

            {/* ── EFB ── */}
            {tab === "efb" && (
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                <Panel title="EFB Mass Balance">
                  <KV k="FFB daily" v={r.ffbTpd.toFixed(0)+" t/day"} />
                  <KV k={"EFB fresh @ "+efbMc+"%"} v={r.efb.fresh.toFixed(1)+" t/day"} />
                  <KV k="EFB dry matter" v={r.efb.dm.toFixed(1)+" t DM/day"} />
                  <KV k={"Press cake @ "+pressMc+"%"} v={r.efb.cake.toFixed(1)+" t/day ("+r.efb.tph.toFixed(2)+" t/h)"} col={C.teal} />
                  <KV k="Row A exit @ 55%" v={r.efb.rowA.toFixed(1)+" t/day ("+(r.efb.rowA/24).toFixed(2)+" t/h)"} col={C.green} />
                  <KV k="PKSA consumption" v={(r.efb.pksa/1000).toFixed(2)+" t/day"} col={C.amber} />
                </Panel>
                <Panel title="EFB Equipment Counts">
                  <KV k="Paddle mixers" v={r.efb.mixers+" units ("+r.efb.mixUtil.toFixed(1)+"%)"} col={utilColour(r.efb.mixUtil)} />
                  <KV k="Screw presses (N+1)" v={r.efb.presses+" units ("+r.efb.pressUtil.toFixed(1)+"%)"} col={utilColour(r.efb.pressUtil)} />
                  <KV k="Row A bays" v={r.efb.bayA+" × "+bayCap+"t"} col={C.amber} />
                  <KV k="Row B bays" v="ELIMINATED" col={C.green} />
                  <KV k="Dispatch hoppers" v={"2 × "+(r.efb.hopper/2).toFixed(0)+" m³ ("+bufferH+"h)"} col={C.teal} />
                  <KV k="Bay fill time" v={r.efb.fill.toFixed(1)+"h"} col={C.grey} />
                  <div style={{ background:C.input, borderRadius:4, padding:10, marginTop:10, fontFamily:mono, fontSize:11, color:C.grey, lineHeight:1.8 }}>
                    {r.efb.cake.toFixed(1)} t/day ÷ {bayCap}t = {(r.efb.cake/bayCap).toFixed(2)} SS<br/>
                    + 3 operational slots = {(r.efb.cake/bayCap+3).toFixed(2)}<br/>
                    → <span style={{ color:C.amber, fontWeight:700 }}>{r.efb.bayA} bays</span>
                  </div>
                </Panel>
              </div>
            )}

            {/* ── OPDC ── */}
            {tab === "opdc" && (
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                <Panel title="OPDC + POME Mass Balance">
                  <KV k={"OPDC fresh @ "+opdcMc+"%"} v={r.opdc.fresh.toFixed(1)+" t/day"} />
                  {inclPome && <KV k={"POME fresh @ "+pomeMc+"%"} v={pomeTpd+" t/day"} col={C.grey} />}
                  {inclPome && <KV k="POME post-decanter @ 65%" v={r.pome.decanter.toFixed(1)+" t/day → BIN-OPDC-301"} col={C.grey} />}
                  <KV k="Combined to mixers" v={r.opdc.mixInput.toFixed(1)+" t/day"} col={C.teal} />
                  <KV k={"Press cake @ "+pressMc+"%"} v={r.opdc.cake.toFixed(1)+" t/day ("+r.opdc.tph.toFixed(2)+" t/h)"} />
                  <KV k="Row A exit @ 55%" v={r.opdc.rowA.toFixed(1)+" t/day ("+(r.opdc.rowA/24).toFixed(2)+" t/h)"} col={C.green} />
                </Panel>
                <Panel title="OPDC Equipment Counts">
                  <KV k="Paddle mixers" v={r.opdc.mixers+" units ("+r.opdc.mixUtil.toFixed(1)+"%)"} col={utilColour(r.opdc.mixUtil)} />
                  <KV k="Screw press" v={"1 unit ("+r.opdc.pressUtil.toFixed(1)+"% — no N+1)"} col={utilColour(r.opdc.pressUtil)} />
                  <KV k="Row A bays" v={r.opdc.bayA+" × "+bayCap+"t"} col={C.amber} />
                  <KV k="Row B bays" v="ELIMINATED" col={C.green} />
                  <KV k="Dispatch hopper" v={r.opdc.hopper.toFixed(0)+" m³ ("+bufferH+"h)"} col={C.teal} />
                  <KV k="Bay fill time" v={r.opdc.fill.toFixed(1)+"h"} col={C.grey} />
                  {r.opdc.mixUtil > 85 && (
                    <div style={{ background:"#2a0d0d", border:`1px solid ${C.red}`, borderRadius:4, padding:8, marginTop:10 }}>
                      <div style={{ color:C.red, fontSize:11, fontWeight:700 }}>⚠ MIXER UTIL {r.opdc.mixUtil.toFixed(1)}% — ADD MIXER OR REDUCE POME RATE</div>
                    </div>
                  )}
                </Panel>
              </div>
            )}

            {/* ── BLEND ── */}
            {tab === "blend" && (
              <div>
                <div style={{ background:"#0d1a10", border:`1px solid ${C.green}44`, borderRadius:6, padding:16, marginBottom:16 }}>
                  <div style={{ fontSize:12, color:C.green, fontWeight:700, marginBottom:8 }}>ROW B ELIMINATION — DESIGN RATIONALE</div>
                  <div style={{ fontSize:12, color:C.grey, lineHeight:1.7 }}>
                    Row B concrete bays cannot mix limestone homogeneously through fibrous material — a front-end loader turning a 50t pile creates stratification, not even distribution.
                    New design: material exits Row A directly to dispatch hoppers. Weigh belts meter the correct EFB:OPDC ratio. Limestone auger injects at blender inlet. Paddle blender achieves intimate contact in ~5 min. pH sensor on discharge = Wave 1 trigger.
                  </div>
                  <div style={{ fontFamily:mono, fontSize:13, color:C.green, fontWeight:700, marginTop:10 }}>
                    Saves 8 × $8,000 = $64,000
                  </div>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                  <Panel title="Flow to Blenders">
                    <KV k="EFB from hopper" v={(r.efb.rowA/24).toFixed(2)+" t/h ("+r.blend.efbPct.toFixed(1)+"%)"} />
                    <KV k="OPDC from hopper" v={(r.opdc.rowA/24).toFixed(2)+" t/h ("+(100-r.blend.efbPct).toFixed(1)+"%)"} />
                    <KV k="Total to 2 blenders" v={r.blend.tph.toFixed(2)+" t/h"} col={C.amber} />
                    <KV k="Load per blender" v={r.blend.loadEach.toFixed(2)+" t/h"} />
                    <KV k="Util each blender" v={r.blend.utilEach.toFixed(1)+"%"} col={utilColour(r.blend.utilEach)} />
                    <KV k="Limestone injection" v={(r.blend.limeKgDay).toFixed(0)+" kg/day"} col={C.amber} />
                    <KV k="pH target out" v="6.5 – 8.0" col={C.teal} />
                    <KV k="Wave 1 trigger" v="pH sensor ≤ 8.0" col={C.green} />
                    <div style={{ marginTop:10 }}>
                      <UtilBar label="Blender #1" pct={r.blend.utilEach} />
                      <UtilBar label="Blender #2" pct={r.blend.utilEach} />
                    </div>
                  </Panel>
                  <Panel title="Dispatch Hoppers">
                    <KV k="EFB hopper (×2)" v={"2 × "+(r.efb.hopper/2).toFixed(0)+" m³"} />
                    <KV k="EFB buffer time" v={bufferH+"h each"} col={C.grey} />
                    <KV k="OPDC hopper (×1)" v={r.opdc.hopper.toFixed(0)+" m³"} />
                    <KV k="OPDC buffer time" v={bufferH+"h"} col={C.grey} />
                    <KV k="Feeder type" v="Live bottom + weigh belt" col={C.teal} />
                    <KV k="Control mode" v="Ratio-locked EFB:OPDC" col={C.teal} />
                    <KV k="N+1 check" v={"Single blender covers "+(r.blend.tph/blendRate*100).toFixed(1)+"%"} col={utilColour(r.blend.tph/blendRate*100)} />
                  </Panel>
                </div>
              </div>
            )}

            {/* ── CAPEX ── */}
            {tab === "capex" && (
              <div>
                <Panel title="CAPEX Delta vs Original Specification">
                  {[
                    { label:"EFB Press(es) added vs original 2", val:r.capex.pressAdd, add:r.capex.pressAdd>0 },
                    { label:"2 × Continuous paddle blenders", val:r.capex.blendAdd, add:true },
                    { label:"Dispatch hoppers (2 EFB + 1 OPDC)", val:r.capex.hopperAdd, add:true },
                    { label:"Weigh belt feeders (3 units)", val:r.capex.weighAdd, add:true },
                    { label:"Limestone dosing system at blender", val:r.capex.limeAdd, add:true },
                    { label:"Row B bays ELIMINATED (8 × $8,000)", val:r.capex.rowBSave, add:false },
                  ].map(row => (
                    <div key={row.label} style={{ display:"flex", justifyContent:"space-between", padding:"10px 0", borderBottom:`1px solid ${C.border}` }}>
                      <span style={{ fontSize:12, color:C.white, fontFamily:sans }}>{row.label}</span>
                      <span style={{ fontFamily:mono, fontSize:13, fontWeight:700, color:row.add?C.amber:C.green }}>
                        {row.val>=0?"+":""}{row.val.toLocaleString("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0})}
                      </span>
                    </div>
                  ))}
                  <div style={{ display:"flex", justifyContent:"space-between", padding:"14px 0 0" }}>
                    <span style={{ fontSize:14, fontWeight:700, color:C.white }}>NET CAPEX CHANGE</span>
                    <span style={{ fontFamily:mono, fontSize:18, fontWeight:700, color:r.capex.net>0?C.amber:C.green }}>
                      {r.capex.net>=0?"+":""}{r.capex.net.toLocaleString("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0})}
                    </span>
                  </div>
                </Panel>
              </div>
            )}

            {/* ── EQUIPMENT ── */}
            {tab === "equipment" && (
              <div>
                <div style={{ background:C.panel, border:`1px solid ${C.border}`, borderRadius:6, overflow:"hidden" }}>
                  <div style={{ display:"grid", gridTemplateColumns:"140px 1fr 40px 90px", gap:6, padding:"8px 10px", background:C.border }}>
                    {["TAG","EQUIPMENT","QTY","UNIT COST"].map(h=>(
                      <div key={h} style={{ fontFamily:mono, fontSize:10, color:C.grey, textTransform:"uppercase" }}>{h}</div>
                    ))}
                  </div>

                  <SectionHead title="EFB STAGE 1" colour={C.blue} />
                  <ERow tag="TR-EFB-101" name="EFB Truck Receiving Bay" qty={1} cost={8000} />
                  <ERow tag="RH-EFB-101" name="EFB Hydraulic Reciprocating Feeder" qty={1} cost={15000} />
                  <ERow tag="ML-EFB-101" name="EFB Hammer Mill (2mm)" qty={1} cost={35000} />
                  <ERow tag="SC-EFB-101" name="EFB Vibrating Screen" qty={1} cost={12000} />
                  <ERow tag="BIN-EFB-201" name="EFB Buffer Storage Bin" qty={1} cost={25000} />

                  <SectionHead title="EFB STAGE 2" colour={C.blue} />
                  {Array.from({length:r.efb.mixers},(_,i)=>(
                    <ERow key={"em"+i} tag={"M-EFB-PKSA-0"+(i+1)} name={"EFB PKSA Paddle Mixer #"+(i+1)} qty={1} cost={22000} />
                  ))}
                  {Array.from({length:r.efb.presses},(_,i)=>(
                    <ERow key={"ep"+i} tag={"M-EFB-PRESS-0"+(i+1)} name={"EFB Twin Screw Press #"+(i+1)+(i===r.efb.presses-1?" (N+1)":"")} qty={1} cost={65000} isNew={i>=2} note={i===2?"Added — N+1 redundancy":null} />
                  ))}
                  <ERow tag="CV-EFB-COL-01" name="EFB Collection Screw (Press 1+2)" qty={1} cost={12000} />
                  <ERow tag="CV-EFB-COL-02" name="EFB Collection Screw (Press 3 dedicated)" qty={1} cost={12000} isNew note="Added with Press #3" />
                  <ERow tag="CV-EFB-INCL-01" name="EFB Inclined Conveyor to Bay Level" qty={1} cost={15000} />
                  <ERow tag="CV-EFB-DIST-01" name="EFB Overhead Distribution Conveyor (drop gates)" qty={1} cost={25000} />
                  <ERow tag={"C-EFB-BAY-A-01to"+String(r.efb.bayA).padStart(2,"0")} name={"EFB Row A Neutralisation Bays — "+r.efb.bayA+" units, "+bayCap+"t each"} qty={r.efb.bayA} cost={8000} />
                  <ERow tag="H-EFB-301/302" name={"EFB Dispatch Hoppers — 2 × "+(r.efb.hopper/2).toFixed(0)+"m³, live bottom + weigh belt"} qty={2} cost={18000} isNew note="Replaces Row B bays" />

                  <SectionHead title="OPDC + POME SLUDGE STAGE 1" colour={C.teal} />
                  <ERow tag="P-SLD-101A/B" name="Sludge Feed Pumps (Duty/Standby)" qty={2} cost={8000} />
                  <ERow tag="T-SLD-101" name="Sludge Buffer Tank (5–8 m³)" qty={1} cost={12000} />
                  <ERow tag="DEC-SLD-101" name="Palm Oil Sludge 3-Phase Decanter" qty={1} cost={null} />
                  <ERow tag="CV-SLD-CAKE-01" name="Sludge Cake Conveyor → BIN-OPDC-301" qty={1} cost={10000} isNew note="Added — transport path was missing" />
                  <ERow tag="P-CENT-101" name="Decanter Centrate Return Pump" qty={1} cost={4000} isNew note="Added — centrate return to pond" />
                  <ERow tag="TR-OPDC-101" name="OPDC Receiving Bay" qty={1} cost={5000} />
                  <ERow tag="BIN-OPDC-301" name="OPDC Buffer Bin (30m³, dual-feed OPDC+POME)" qty={1} cost={20000} note="Upsized 20→30m³" />

                  <SectionHead title="OPDC STAGE 2" colour={C.teal} />
                  {Array.from({length:r.opdc.mixers},(_,i)=>(
                    <ERow key={"om"+i} tag={"M-OPDC-PKSA-0"+(i+1)} name={"OPDC PKSA Paddle Mixer #"+(i+1)+(i===2?" (Required — sludge load)":"")} qty={1} cost={18000} isNew={i>=2} note={i===2?"Added — 2-mixer util was 95.5%":null} />
                  ))}
                  <ERow tag="M-OPDC-PRESS-01" name="OPDC Twin Screw Press (CB-15TC)" qty={1} cost={65000} isNew note="Added — press was missing from original spec" />
                  <ERow tag="CV-OPDC-COL-02" name="OPDC Press Cake Discharge Screw" qty={1} cost={8000} isNew />
                  <ERow tag={"C-OPDC-BAY-A-01to0"+r.opdc.bayA} name={"OPDC Row A Neutralisation Bays — "+r.opdc.bayA+" units"} qty={r.opdc.bayA} cost={8000} />
                  <ERow tag="H-OPDC-301" name={"OPDC Dispatch Hopper — "+r.opdc.hopper.toFixed(0)+"m³, live bottom + weigh belt"} qty={1} cost={12000} isNew note="Replaces Row B bays" />

                  <SectionHead title="BLEND POINT — END OF S2" colour={C.amber} />
                  <ERow tag="WB-EFB-01" name="EFB Weigh Belt Feeder (ratio control)" qty={1} cost={8000} isNew />
                  <ERow tag="WB-OPDC-01" name="OPDC Weigh Belt Feeder (ratio control)" qty={1} cost={8000} isNew />
                  <ERow tag="S-LIME-BLEND-01" name={"Limestone Auto-Auger Dosing — "+r.blend.limeKgDay.toFixed(0)+" kg/day @ "+limeDose+" kg/t"} qty={1} cost={15000} isNew />
                  <ERow tag="B-BLEND-01" name={"Continuous Paddle Blender #1 — "+blendRate+" t/h rated, "+r.blend.utilEach.toFixed(1)+"% util"} qty={1} cost={45000} isNew />
                  <ERow tag="B-BLEND-02" name={"Continuous Paddle Blender #2 — "+blendRate+" t/h rated, N+1 redundancy"} qty={1} cost={45000} isNew />
                  <ERow tag="pH-SENS-01/02" name="Inline pH Sensors on Blender Discharge (Wave 1 trigger)" qty={2} cost={3500} isNew />
                </div>
                <div style={{ marginTop:8, fontSize:10, color:C.grey }}>
                  Green border = new item added. Unit cost shown — multiply by Qty for line total.
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}



// ======================================================================
// FILE: src/CFI_NPK_Value_Dashboard.jsx
// SIZE: 30476 chars / 590 lines
// ======================================================================

import { useState, useMemo } from "react";

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const SOILS = [
  { id:"ultisol",    name:"Ultisols",    pct:"24%", ph:"4.5", cec:"8.2",  nAdj:0,     pAdj:0,     desc:"Standard reference — clay-rich, acidic, low base saturation" },
  { id:"inceptisol", name:"Inceptisols", pct:"39%", ph:"4.1", cec:"15.4", nAdj:-0.40, pAdj:-0.50, desc:"Best fertility — 40% less N, 50% less P needed. CFI primary target." },
  { id:"oxisol",     name:"Oxisols",     pct:"8%",  ph:"4.4", cec:"5.0",  nAdj:0.10,  pAdj:0.20,  desc:"Fe/Al oxide fixation — 20% more P required. CFI P efficiency premium." },
  { id:"histosol",   name:"Histosols",   pct:"7%",  ph:"3.8", cec:"35.0", nAdj:-0.80, pAdj:-0.70, desc:"Peat soil — 80% less N, 70% less P needed. Extreme CFI advantage." },
  { id:"spodosol",   name:"Spodosols",   pct:"—",   ph:"4.77",cec:"2.0",  nAdj:0.20,  pAdj:0.15,  desc:"Sandy, lowest fertility. High NPK demand baseline." },
];

// Fertiliser commodity prices
const COM = { n: 0.761, p: 0.978, k: 0.633 };  // $/kg N, $/kg P₂O₅, $/kg K₂O
// Sinar Mas estate actual costs (incl. soil loss penalty)
const SM  = { n: 1.50,  p: 1.80,  k: 0.90  };

// Stream nutrient profiles (% DM) — CFI canonical values
const STR = {
  efb:  { n:0.76,  p:0.06, k:0.74, mc:62.5, ffbRatio:0.225, opdcRatio:null, label:"EFB" },
  opdc: { n:2.32,  p:0.30, k:0.75, mc:70.0, ffbRatio:null,  opdcRatio:0.152,label:"OPDC" },
  pome: { n:1.76,  p:0.40, k:0.70, mc:82.0, ffbRatio:0.0245,opdcRatio:null, label:"POME Sludge" },
};

const C = {
  bg:"#07120A", card:"#0C1B0E", card2:"#0F220F",
  border:"#193519", border2:"#234A23",
  teal:"#00C4A1", tealDk:"#009E85", tealBg:"#051F1A",
  gold:"#D4A017", goldBg:"#1F1500",
  green:"#3CB371", greenBg:"#0A1F0E",
  amber:"#E8A020", red:"#E74C3C",
  blue:"#5B9BD5",
  text:"#C8E8C8", muted:"#6A8A6A", white:"#EEF8EE",
};

const fmt    = (n, d=0) => Number(n).toLocaleString("en-US", { minimumFractionDigits:d, maximumFractionDigits:d });
const fmtUSD = (n)      => "$" + fmt(n);
const fmtK   = (n)      => n >= 1000000 ? "$"+fmt(n/1000000,2)+"M" : "$"+fmt(n);

// ─── SUBCOMPONENTS ────────────────────────────────────────────────────────────
const Card = ({children, style={}}) => (
  <div style={{background:C.card, border:`1px solid ${C.border}`, borderRadius:8, padding:16, ...style}}>
    {children}
  </div>
);

const SectionTitle = ({icon, title, sub}) => (
  <div style={{marginBottom:14, paddingBottom:10, borderBottom:`1px solid ${C.border}`}}>
    <div style={{display:"flex", alignItems:"center", gap:8}}>
      <span style={{fontSize:15}}>{icon}</span>
      <span style={{color:C.teal, fontSize:11, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase"}}>{title}</span>
    </div>
    {sub && <div style={{color:C.muted, fontSize:10, marginTop:4, fontStyle:"italic"}}>{sub}</div>}
  </div>
);

const Lbl = ({children}) => (
  <div style={{color:C.muted, fontSize:10, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:3}}>{children}</div>
);

const Row = ({label, children, tight}) => (
  <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom: tight?5:9}}>
    <span style={{color:C.muted, fontSize:11}}>{label}</span>
    {children}
  </div>
);

const Inp = ({value, onChange, min, max, step=1, unit, w=72}) => (
  <div style={{display:"flex", alignItems:"center", gap:4}}>
    <input type="number" value={value} onChange={e=>onChange(+e.target.value)} min={min} max={max} step={step}
      style={{width:w, background:"#060F08", border:`1px solid ${C.border2}`, borderRadius:4,
        color:"#7CC8FF", fontSize:12, fontFamily:"'Courier New', monospace", padding:"3px 6px", textAlign:"right", outline:"none"}}/>
    {unit && <span style={{color:C.muted, fontSize:10, minWidth:22}}>{unit}</span>}
  </div>
);

const Toggle = ({checked, onChange}) => (
  <div onClick={()=>onChange(!checked)} style={{
    width:36, height:20, borderRadius:10, cursor:"pointer",
    background: checked ? C.teal : "#152015", border:`1px solid ${checked?C.teal:C.border}`,
    position:"relative", transition:"background 0.2s, border-color 0.2s",
  }}>
    <div style={{width:16, height:16, borderRadius:8, background:"#fff", position:"absolute",
      top:2, left: checked ? 18 : 2, transition:"left 0.2s"}}/>
  </div>
);

const Metric = ({label, value, sub, col, large}) => (
  <Card style={{textAlign:"center"}}>
    <Lbl>{label}</Lbl>
    <div style={{color: col||C.teal, fontSize: large?34:24, fontFamily:"'Courier New', monospace",
      fontWeight:700, marginTop:6, lineHeight:1}}>{value}</div>
    {sub && <div style={{color:C.muted, fontSize:10, marginTop:5}}>{sub}</div>}
  </Card>
);

const NpkPill = ({label, n, p, k, col, selected}) => {
  const tot = n+p+k;
  return (
    <div style={{padding:"8px 10px", background: selected?"#0D2A10":"#060F08",
      borderRadius:6, border:`1px solid ${selected?C.teal:C.border}`, marginBottom:7}}>
      <div style={{display:"flex", justifyContent:"space-between", marginBottom:5}}>
        <span style={{color:col||C.text, fontSize:11, fontWeight:600}}>{label}</span>
        <span style={{color:C.muted, fontSize:10}}>{fmt(tot,0)} kg N+P+K /day</span>
      </div>
      <div style={{display:"flex", height:7, borderRadius:3, overflow:"hidden", background:C.border}}>
        <div style={{flex:n/tot, background:C.teal}}/>
        <div style={{flex:p/tot, background:C.gold}}/>
        <div style={{flex:k/tot, background:C.green}}/>
      </div>
      <div style={{display:"flex", gap:10, marginTop:4}}>
        {[{l:"N",v:n,c:C.teal},{l:"P",v:p,c:C.gold},{l:"K",v:k,c:C.green}].map(({l,v,c})=>(
          <span key={l} style={{color:c, fontSize:10, fontFamily:"'Courier New', monospace"}}>
            {l} {fmt(v,0)} kg
          </span>
        ))}
      </div>
    </div>
  );
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function CFI_NPK_Value_Dashboard() {

  const [mill, setMill] = useState({
    tph: 60, hrsDay: 20, daysYear: 330,
    efbCapture: 100,
    inclOpdc: true, inclPome: true,
    pomeInclPct: 15,
  });

  const [estate, setEstate] = useState({
    ha: 3000, soilId: "ultisol", pathway: "s5b",
  });

  const [rec, setRec] = useState({ n:68, p:82, k:88 });

  // ─── CALCULATIONS ──────────────────────────────────────────────────────────
  const C_ = useMemo(() => {
    const { tph, hrsDay, daysYear, efbCapture, inclOpdc, inclPome, pomeInclPct } = mill;
    const soil = SOILS.find(s=>s.id===estate.soilId) || SOILS[0];

    const ffbDay  = tph * hrsDay;

    // EFB
    const efbFW  = ffbDay * STR.efb.ffbRatio * (efbCapture/100);
    const efbDM  = efbFW  * (1 - STR.efb.mc/100);
    const efbN   = efbDM  * STR.efb.n/100 * 1000;
    const efbP   = efbDM  * STR.efb.p/100 * 1000;
    const efbK   = efbDM  * STR.efb.k/100 * 1000;

    // OPDC
    const opdcFW = inclOpdc ? efbFW * STR.opdc.opdcRatio : 0;
    const opdcDM = opdcFW * (1 - STR.opdc.mc/100);
    const opdcN  = opdcDM * STR.opdc.n/100 * 1000;
    const opdcP  = opdcDM * STR.opdc.p/100 * 1000;
    const opdcK  = opdcDM * STR.opdc.k/100 * 1000;

    // POME sludge
    const pomeFW = inclPome ? ffbDay * STR.pome.ffbRatio * (pomeInclPct/100) : 0;
    const pomeDM = pomeFW * (1 - STR.pome.mc/100);
    const pomeN  = pomeDM * STR.pome.n/100 * 1000;
    const pomeP  = pomeDM * STR.pome.p/100 * 1000;
    const pomeK  = pomeDM * STR.pome.k/100 * 1000;

    // Raw totals (kg/day)
    const rawN = efbN + opdcN + pomeN;
    const rawP = efbP + opdcP + pomeP;
    const rawK = efbK + opdcK + pomeK;

    // Annual raw (t/yr)
    const annN = rawN * daysYear / 1000;
    const annP = rawP * daysYear / 1000;
    const annK = rawK * daysYear / 1000;

    // Pipeline-recovered (t/yr)
    const rN = annN * rec.n/100;
    const rP = annP * rec.p/100;
    const rK = annK * rec.k/100;
    // Convert to fertiliser equivalent forms
    const rP2O5 = rP * 2.29;
    const rK2O  = rK * 1.20;

    // Soil-adjusted effective values
    const eN = rN    * (1 + soil.nAdj);
    const eP = rP2O5 * (1 + soil.pAdj);
    const eK = rK2O;   // K: no soil adjustment

    // Value at commodity prices ($/yr)
    const comN = eN*1000*COM.n;
    const comP = eP*1000*COM.p;
    const comK = eK*1000*COM.k;
    const comTot = comN+comP+comK;

    // Value at estate actual prices ($/yr)
    const smN  = eN*1000*SM.n;
    const smP  = eP*1000*SM.p;
    const smK  = eK*1000*SM.k;
    const smTot = smN+smP+smK;

    // Per-hectare
    const ha = estate.ha || 1;
    const comHa = comTot/ha;
    const smHa  = smTot/ha;

    // Raw inventory value (what the mill is discarding)
    const rawComVal = annN*1000*COM.n + annP*2.29*1000*COM.p + annK*1.20*1000*COM.k;
    const rawSmVal  = annN*1000*SM.n  + annP*2.29*1000*SM.p  + annK*1.20*1000*SM.k;
    const pipelineEff = rawComVal > 0 ? comTot/rawComVal*100 : 0;

    // All-soils table
    const soilsTable = SOILS.map(s => {
      const sN = rN    * (1+s.nAdj);
      const sP = rP2O5 * (1+s.pAdj);
      const sK = rK2O;
      const com = sN*1000*COM.n + sP*1000*COM.p + sK*1000*COM.k;
      const sm  = sN*1000*SM.n  + sP*1000*SM.p  + sK*1000*SM.k;
      return {...s, com, sm, comHa:com/ha, smHa:sm/ha};
    });

    const streams = [
      {label:"EFB",        n:efbN,  p:efbP,  k:efbK,  col:C.teal},
      ...(inclOpdc?[{label:"OPDC", n:opdcN, p:opdcP, k:opdcK, col:C.gold}]:[]),
      ...(inclPome?[{label:"POME Sludge", n:pomeN, p:pomeP, k:pomeK, col:C.green}]:[]),
    ];

    return {
      ffbDay, rawN, rawP, rawK, annN, annP, annK,
      rN, rP2O5, rK2O, eN, eP, eK,
      comN, comP, comK, comTot, smN, smP, smK, smTot,
      comHa, smHa, rawComVal, rawSmVal, pipelineEff,
      soilsTable, streams, soil,
    };
  }, [mill, estate, rec]);

  const maxSm = Math.max(...C_.soilsTable.map(r=>r.sm));

  return (
    <div style={{background:C.bg, minHeight:"100vh", color:C.text,
      fontFamily:"'Georgia', 'Times New Roman', serif", padding:"20px 24px", boxSizing:"border-box"}}>

      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-end",
        marginBottom:20, paddingBottom:16, borderBottom:`1px solid ${C.border}`}}>
        <div>
          <div style={{color:C.muted, fontSize:10, letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:5}}>
            Circular Fertiliser Industries · Indonesia · Commercial In Confidence
          </div>
          <div style={{color:C.white, fontSize:24, fontWeight:700, letterSpacing:"-0.5px", lineHeight:1.1}}>
            NPK Fertiliser Replacement Value
          </div>
          <div style={{color:C.muted, fontSize:12, marginTop:5}}>
            Palm mill waste nutrient inventory → estate fertiliser savings calculator
          </div>
        </div>
        <div style={{textAlign:"right", display:"flex", gap:14}}>
          {[
            {label:"Commodity Floor /yr",  val:fmtK(Math.round(C_.comTot)),  col:C.teal},
            {label:"Estate Actual /yr",    val:fmtK(Math.round(C_.smTot)),   col:C.gold},
          ].map(({label,val,col},i) => (
            <div key={i} style={{
              background:"#080F08", border:`1px solid ${col}22`,
              borderRadius:8, padding:"10px 18px", minWidth:130,
            }}>
              <div style={{color:C.muted, fontSize:10, letterSpacing:"0.1em", textTransform:"uppercase"}}>{label}</div>
              <div style={{color:col, fontSize:28, fontFamily:"'Courier New', monospace", fontWeight:700, lineHeight:1.1, marginTop:2}}>{val}</div>
              <div style={{color:C.muted, fontSize:10, marginTop:2}}>
                {col===C.teal ? fmtUSD(Math.round(C_.comHa)) : fmtUSD(Math.round(C_.smHa))}/ha · {C_.soil.name}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{display:"grid", gridTemplateColumns:"280px 1fr", gap:18, alignItems:"start"}}>

        {/* ── LEFT INPUTS PANEL ──────────────────────────────────────────────── */}
        <div style={{display:"flex", flexDirection:"column", gap:12}}>

          <Card>
            <SectionTitle icon="🏭" title="Mill Parameters"/>
            <Row label="Mill Capacity"><Inp value={mill.tph} onChange={v=>setMill(m=>({...m,tph:v}))} min={10} max={120} unit="TPH"/></Row>
            <Row label="Effective Hours/Day"><Inp value={mill.hrsDay} onChange={v=>setMill(m=>({...m,hrsDay:v}))} min={8} max={24} unit="hr"/></Row>
            <Row label="Operating Days/Year"><Inp value={mill.daysYear} onChange={v=>setMill(m=>({...m,daysYear:v}))} min={200} max={365} unit="days"/></Row>
            <div style={{marginTop:8, padding:"8px 10px", background:"#060F08", borderRadius:5, border:`1px solid ${C.border2}`}}>
              <div style={{color:C.muted, fontSize:9, letterSpacing:"0.1em", textTransform:"uppercase"}}>Daily FFB throughput</div>
              <div style={{color:C.teal, fontSize:20, fontFamily:"'Courier New', monospace", fontWeight:700}}>
                {fmt(C_.ffbDay)} t/day
              </div>
              <div style={{color:C.muted, fontSize:9}}>{fmt(C_.ffbDay*mill.daysYear/1000,1)}k t/year</div>
            </div>
          </Card>

          <Card>
            <SectionTitle icon="🌴" title="Feedstock Streams"/>
            <Row label="EFB Capture Rate" tight><Inp value={mill.efbCapture} onChange={v=>setMill(m=>({...m,efbCapture:v}))} min={50} max={100} unit="%"/></Row>
            <Row label="Include OPDC" tight><Toggle checked={mill.inclOpdc} onChange={v=>setMill(m=>({...m,inclOpdc:v}))}/></Row>
            <Row label="Include POME Sludge" tight><Toggle checked={mill.inclPome} onChange={v=>setMill(m=>({...m,inclPome:v}))}/></Row>
            {mill.inclPome && (
              <Row label="POME Inclusion Rate" tight>
                <Inp value={mill.pomeInclPct} onChange={v=>setMill(m=>({...m,pomeInclPct:v}))} min={5} max={20} unit="%"/>
              </Row>
            )}
          </Card>

          <Card>
            <SectionTitle icon="🌿" title="Estate Parameters"/>
            <Row label="Estate Area"><Inp value={estate.ha} onChange={v=>setEstate(e=>({...e,ha:v}))} min={500} max={50000} step={100} unit="ha" w={80}/></Row>
            <Row label="Soil Type">
              <select value={estate.soilId} onChange={e=>setEstate(p=>({...p,soilId:e.target.value}))}
                style={{background:"#060F08", border:`1px solid ${C.border2}`, color:"#7CC8FF",
                  fontSize:10, borderRadius:4, padding:"3px 5px", fontFamily:"'Courier New', monospace"}}>
                {SOILS.map(s=><option key={s.id} value={s.id}>{s.name} ({s.pct})</option>)}
              </select>
            </Row>
            <Row label="BSF Pathway">
              <select value={estate.pathway} onChange={e=>setEstate(p=>({...p,pathway:e.target.value}))}
                style={{background:"#060F08", border:`1px solid ${C.border2}`, color:"#7CC8FF",
                  fontSize:10, borderRadius:4, padding:"3px 5px", fontFamily:"'Courier New', monospace"}}>
                <option value="s5a">S5A — Extract Larvae</option>
                <option value="s5b">S5B — Terminate In-Substrate</option>
              </select>
            </Row>
            <div style={{marginTop:8, padding:"6px 10px", background:"#060F08", borderRadius:4,
              fontSize:10, color:C.muted, fontStyle:"italic", borderLeft:`3px solid ${C.teal}`}}>
              {C_.soil.desc}
            </div>
          </Card>

          <Card>
            <SectionTitle icon="🔬" title="Pipeline Recovery %" sub="% of raw stream nutrients in final product"/>
            {[
              {k:"n", label:"Nitrogen (N)", hint:"BSF consumes ~30–35% for larval protein", col:C.teal},
              {k:"p", label:"Phosphorus (P)", hint:"High retention ~80–85%", col:C.gold},
              {k:"k", label:"Potassium (K)", hint:"Near-conservative ~85–90%", col:C.green},
            ].map(({k,label,hint,col})=>(
              <div key={k} style={{marginBottom:12}}>
                <div style={{display:"flex", justifyContent:"space-between", marginBottom:3}}>
                  <span style={{color:C.text, fontSize:11}}>{label}</span>
                  <span style={{color:col, fontSize:13, fontFamily:"'Courier New', monospace", fontWeight:700}}>{rec[k]}%</span>
                </div>
                <input type="range" min={30} max={100} value={rec[k]}
                  onChange={e=>setRec(r=>({...r,[k]:+e.target.value}))}
                  style={{width:"100%", accentColor:col, cursor:"pointer"}}/>
                <div style={{color:C.muted, fontSize:9}}>{hint}</div>
              </div>
            ))}
          </Card>
        </div>

        {/* ── RIGHT OUTPUTS ─────────────────────────────────────────────────── */}
        <div style={{display:"flex", flexDirection:"column", gap:16}}>

          {/* Hero 4-metric row */}
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:12}}>
            <Metric label="Raw NPK Inventory" value={fmtK(Math.round(C_.rawComVal))}
              sub="commodity value in waste streams/yr" col={C.muted}/>
            <Metric label="CFI Delivered Value" value={fmtK(Math.round(C_.comTot))}
              sub="Urea/TSP/MOP floor price/yr" col={C.teal}/>
            <Metric label="At Estate Actual Cost" value={fmtK(Math.round(C_.smTot))}
              sub="incl. Sinar Mas soil-loss penalty/yr" col={C.gold}/>
            <Metric label="Pipeline Efficiency" value={C_.pipelineEff.toFixed(1)+"%"}
              sub="of raw inventory reaching product" col={C.green}/>
          </div>

          {/* NPK streams + annual breakdown */}
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:16}}>

            {/* Daily stream breakdown */}
            <Card>
              <SectionTitle icon="📊" title="Daily Nutrient Streams (Raw, Pre-Pipeline)"/>
              {C_.streams.map((s,i)=>(
                <NpkPill key={i} label={s.label} n={s.n} p={s.p} k={s.k} col={s.col}/>
              ))}
              <div style={{marginTop:10, paddingTop:10, borderTop:`1px solid ${C.border}`}}>
                <NpkPill label="COMBINED TOTAL" n={C_.rawN} p={C_.rawP} k={C_.rawK} col={C.white} selected/>
              </div>
            </Card>

            {/* Annual value table */}
            <Card>
              <SectionTitle icon="💰" title="Annual Fertiliser Replacement Value"/>
              <table style={{width:"100%", borderCollapse:"collapse", fontSize:12}}>
                <thead>
                  <tr>
                    {["","Recovered","Urea/TSP/MOP","Estate Actual"].map((h,i)=>(
                      <th key={i} style={{color:C.muted, fontSize:9, textAlign:i===0?"left":"right",
                        paddingBottom:8, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase",
                        borderBottom:`1px solid ${C.border}`, paddingRight:4}}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    {nm:"N",    rec:`${fmt(C_.rN,1)} t N`,   com:C_.comN, sm:C_.smN, col:C.teal},
                    {nm:"P₂O₅",rec:`${fmt(C_.rP2O5,1)} t`,  com:C_.comP, sm:C_.smP, col:C.gold},
                    {nm:"K₂O", rec:`${fmt(C_.rK2O,1)} t`,   com:C_.comK, sm:C_.smK, col:C.green},
                  ].map(({nm,rec,com,sm,col})=>(
                    <tr key={nm} style={{borderBottom:`1px solid ${C.border}`}}>
                      <td style={{padding:"8px 4px 8px 0", color:col, fontWeight:700}}>{nm}</td>
                      <td style={{padding:"8px 4px", textAlign:"right", color:C.text,
                        fontFamily:"'Courier New', monospace", fontSize:11}}>{rec}/yr</td>
                      <td style={{padding:"8px 4px", textAlign:"right", color:C.teal,
                        fontFamily:"'Courier New', monospace"}}>{fmtUSD(Math.round(com))}</td>
                      <td style={{padding:"8px 4px", textAlign:"right", color:C.gold,
                        fontFamily:"'Courier New', monospace"}}>{fmtUSD(Math.round(sm))}</td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={2} style={{padding:"10px 0", color:C.white, fontWeight:700, fontSize:13}}>TOTAL / year</td>
                    <td style={{padding:"10px 4px", textAlign:"right", color:C.teal,
                      fontFamily:"'Courier New', monospace", fontWeight:700, fontSize:15}}>
                      {fmtUSD(Math.round(C_.comTot))}
                    </td>
                    <td style={{padding:"10px 4px", textAlign:"right", color:C.gold,
                      fontFamily:"'Courier New', monospace", fontWeight:700, fontSize:15}}>
                      {fmtUSD(Math.round(C_.smTot))}
                    </td>
                  </tr>
                  <tr style={{borderTop:`1px solid ${C.border}`}}>
                    <td colSpan={2} style={{padding:"6px 0", color:C.muted, fontSize:10}}>
                      Per hectare ({fmt(estate.ha)} ha)
                    </td>
                    <td style={{padding:"6px 4px", textAlign:"right", color:C.teal,
                      fontFamily:"'Courier New', monospace", fontSize:12}}>
                      {fmtUSD(Math.round(C_.comHa))}/ha
                    </td>
                    <td style={{padding:"6px 4px", textAlign:"right", color:C.gold,
                      fontFamily:"'Courier New', monospace", fontSize:12}}>
                      {fmtUSD(Math.round(C_.smHa))}/ha
                    </td>
                  </tr>
                </tbody>
              </table>
            </Card>
          </div>

          {/* All-Soils Matrix */}
          <Card>
            <SectionTitle icon="🗺️"
              title={`5-Soil NPK Value Matrix — ${estate.pathway==="s5a"?"S5A Extract Larvae":"S5B Terminate In-Substrate"} · ${fmt(estate.ha)} ha estate`}
              sub="Click any row to change selected soil"/>
            <table style={{width:"100%", borderCollapse:"collapse", fontSize:11}}>
              <thead>
                <tr>
                  {["Soil Type","Coverage","pH","N adj","P adj","Annual (Commodity)","Annual (Estate)","$/ha (Commodity)","$/ha (Estate)","Profile"].map((h,i)=>(
                    <th key={i} style={{color:C.muted, fontSize:9, textAlign:i<5?"left":"right",
                      paddingBottom:8, fontWeight:700, letterSpacing:"0.07em", textTransform:"uppercase",
                      borderBottom:`1px solid ${C.border}`, paddingRight:6}}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {C_.soilsTable.map((row,i)=>{
                  const sel   = row.id === estate.soilId;
                  const top   = row.sm === maxSm;
                  const rowBg = sel ? "#0D2A10" : "transparent";
                  return (
                    <tr key={row.id} onClick={()=>setEstate(e=>({...e,soilId:row.id}))}
                      style={{cursor:"pointer", background:rowBg,
                        borderLeft:`3px solid ${sel?C.teal:"transparent"}`,
                        transition:"background 0.12s"}}>
                      <td style={{padding:"9px 6px 9px 8px", color:sel?C.teal:C.text, fontWeight:sel?700:400}}>
                        {row.name} {sel&&"◀"}
                      </td>
                      <td style={{padding:"9px 6px", color:C.muted, fontFamily:"monospace"}}>{row.pct}</td>
                      <td style={{padding:"9px 6px", color:C.muted, fontFamily:"monospace"}}>{row.ph}</td>
                      <td style={{padding:"9px 6px", color: row.nAdj<0?C.green:row.nAdj>0?C.red:C.muted,
                        fontFamily:"monospace", fontSize:10}}>
                        {row.nAdj>0?"+":""}{(row.nAdj*100).toFixed(0)}%
                      </td>
                      <td style={{padding:"9px 6px", color: row.pAdj<0?C.green:row.pAdj>0?C.red:C.muted,
                        fontFamily:"monospace", fontSize:10}}>
                        {row.pAdj>0?"+":""}{(row.pAdj*100).toFixed(0)}%
                      </td>
                      <td style={{padding:"9px 6px", textAlign:"right", color:C.teal, fontFamily:"monospace"}}>
                        {fmtUSD(Math.round(row.com))}
                      </td>
                      <td style={{padding:"9px 6px", textAlign:"right",
                        color:top?C.gold:C.amber, fontFamily:"monospace", fontWeight:top?700:400}}>
                        {fmtUSD(Math.round(row.sm))} {top&&"★"}
                      </td>
                      <td style={{padding:"9px 6px", textAlign:"right", color:C.teal,
                        fontFamily:"monospace", fontSize:11}}>
                        {fmtUSD(Math.round(row.comHa))}
                      </td>
                      <td style={{padding:"9px 6px", textAlign:"right",
                        color:top?C.gold:C.amber, fontFamily:"monospace", fontSize:11, fontWeight:top?700:400}}>
                        {fmtUSD(Math.round(row.smHa))}
                      </td>
                      <td style={{padding:"9px 6px", color:C.muted, fontSize:9, fontStyle:"italic",
                        maxWidth:140, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>
                        {row.desc}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Callout pills */}
            <div style={{marginTop:12, display:"flex", gap:10, flexWrap:"wrap"}}>
              <div style={{padding:"4px 12px", background:C.goldBg, border:`1px solid ${C.gold}44`,
                borderRadius:20, fontSize:10, color:C.gold}}>
                ★ Highest estate value: {C_.soilsTable.reduce((a,b)=>a.sm>b.sm?a:b).name}
                {" → "}{fmtUSD(Math.round(maxSm/estate.ha))}/ha/yr
              </div>
              <div style={{padding:"4px 12px", background:C.tealBg, border:`1px solid ${C.teal}44`,
                borderRadius:20, fontSize:10, color:C.teal}}>
                N adjustment range: {((Math.min(...C_.soilsTable.map(r=>r.nAdj))*100).toFixed(0))}% to +{((Math.max(...C_.soilsTable.map(r=>r.nAdj))*100).toFixed(0))}% vs baseline Ultisol
              </div>
            </div>
          </Card>

          {/* Bottom: S5 pathway + methodology */}
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:16}}>

            <Card>
              <SectionTitle icon="🔀" title="S5A vs S5B — Pathway Selector"/>
              <div style={{color:C.muted, fontSize:10, marginBottom:12, lineHeight:1.6}}>
                BSF larvae consume ~30–35% of substrate N for body protein synthesis.
                S5A extracts larvae for insect meal/oil revenue — frass has lower N.
                S5B retains full substrate — maximum N/P/K in biofertiliser product.
              </div>
              {[
                {pw:"s5a", label:"S5A — Extract Larvae",          nDM:"1.8%", note:"Higher insect revenue. Lower frass NPK."},
                {pw:"s5b", label:"S5B — Terminate In-Substrate",   nDM:"4.2%", note:"Maximum frass NPK. No insect revenue."},
              ].map(({pw,label,nDM,note})=>{
                const active = estate.pathway===pw;
                return (
                  <div key={pw} onClick={()=>setEstate(e=>({...e,pathway:pw}))}
                    style={{padding:"10px 14px", borderRadius:6, cursor:"pointer", marginBottom:8,
                      background: active?"#0D2A10":"#060F08",
                      border:`1px solid ${active?C.teal:C.border}`, transition:"all 0.15s"}}>
                    <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                      <span style={{color:active?C.teal:C.text, fontWeight:active?700:400, fontSize:12}}>
                        {label}
                      </span>
                      <span style={{color:active?C.gold:C.muted, fontFamily:"'Courier New', monospace",
                        fontSize:13, fontWeight:active?700:400}}>
                        N {nDM} DM
                      </span>
                    </div>
                    <div style={{color:C.muted, fontSize:10, marginTop:3}}>{note}</div>
                  </div>
                );
              })}
            </Card>

            <Card>
              <SectionTitle icon="📋" title="Data Sources & Methodology"/>
              <div style={{fontSize:10, color:C.muted, lineHeight:1.8}}>
                <div style={{marginBottom:8}}>
                  <span style={{color:C.teal, fontWeight:600}}>Raw NPK inputs:</span>{" "}
                  EFB 22.5% FFB, 62.5% MC, N 0.76% DM · OPDC 15.2% EFB, 70% MC, N 2.32% DM ·
                  POME sludge 2.45% FFB × inclusion %, 82% MC, N 1.76% DM (CFI canonical, verified Mar 2026)
                </div>
                <div style={{marginBottom:8}}>
                  <span style={{color:C.gold, fontWeight:600}}>Pipeline recovery:</span>{" "}
                  N loss via BSF larval protein synthesis (S4). P/K near-conservative through bioconversion.
                  User-adjustable sliders — defaults: N 68%, P 82%, K 88%.
                </div>
                <div style={{marginBottom:8}}>
                  <span style={{color:C.green, fontWeight:600}}>Soil adjustment:</span>{" "}
                  Bioavailability correction by Indonesia soil type per CFI agronomic database.
                  P converted to P₂O₅ (×2.29), K to K₂O (×1.20).
                </div>
                <div>
                  <span style={{color:C.amber, fontWeight:600}}>Fertiliser pricing:</span>{" "}
                  Commodity: Urea $350/t ($0.761/kg N) · TSP $450/t ($0.978/kg P₂O₅) · MOP $380/t ($0.633/kg K₂O).
                  Estate actual (Sinar Mas): $1.50/kg N incl. soil loss penalty · $1.80/kg P₂O₅ · $0.90/kg K₂O.
                </div>
              </div>
            </Card>
          </div>

        </div>
      </div>

      <div style={{marginTop:20, textAlign:"center", color:C.muted, fontSize:9,
        letterSpacing:"0.12em", paddingTop:12, borderTop:`1px solid ${C.border}`}}>
        CFI CIRCULAR FERTILISER INDUSTRIES · NPK REPLACEMENT VALUE DASHBOARD v1.0 · CONFIDENTIAL
      </div>
    </div>
  );
}



// ======================================================================
// FILE: src/CFI_Nutrient_Ledger.jsx
// SIZE: 36342 chars / 482 lines
// ======================================================================

import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, LineChart, Line } from "recharts";

// ─── CANONICAL DATA FROM CFI_Lab_Analysis__Value__PKSA__Best_Biologicals_.xlsx ───

const STAGES = ["S0 Raw","S1 Mech","S2 PKSA","S3 Bio","S4 BSF 12d","S5A Term","S5B Frass"];
const STAGE_SHORT = ["S0","S1","S2","S3","S4","S5A","S5B"];
const STAGE_COLORS = ["#374151","#4b5563","#0d9488","#059669","#d97706","#dc2626","#7c3aed"];

const STAGE_DATA = [
  { stage:"S0 Raw",    npk:35.81, minerals:12.69, om:54.60,  total:103.10, omQI:1.00, omPct:91,  lignin:25.03, cn:32, humif:"Slow",     cellulase:"—",   cp:8.14,  n:1.41, p:0.37, k:2.20, mg:0.33, ca:0.48, fe:2674, ph:5.3  },
  { stage:"S1 Mech",   npk:35.81, minerals:12.69, om:62.79,  total:111.29, omQI:1.15, omPct:91,  lignin:25.03, cn:32, humif:"Slow+",    cellulase:"—",   cp:8.14,  n:1.41, p:0.37, k:2.20, mg:0.33, ca:0.48, fe:2674, ph:5.3  },
  { stage:"S2 PKSA",   npk:47.53, minerals:19.57, om:89.64,  total:156.74, omQI:1.80, omPct:83,  lignin:16.27, cn:29, humif:"Medium",   cellulase:"—",   cp:8.14,  n:1.41, p:0.45, k:3.50, mg:0.55, ca:1.00, fe:2500, ph:7.0  },
  { stage:"S3 Bio",    npk:47.50, minerals:19.40, om:138.60, total:205.50, omQI:2.80, omPct:82.5, lignin:13.50, cn:23, humif:"Fast",     cellulase:195,   cp:9.20,  n:1.65, p:0.47, k:3.20, mg:0.55, ca:1.00, fe:2300, ph:6.8  },
  { stage:"S4 BSF",    npk:75.01, minerals:30.69, om:133.92, total:239.62, omQI:3.10, omPct:72,  lignin:32.00, cn:17, humif:"Very Fast", cellulase:"Gut", cp:14.00, n:2.40, p:1.00, k:4.50, mg:0.80, ca:2.50, fe:3800, ph:8.0  },
  { stage:"S5A Term",  npk:78.78, minerals:31.63, om:134.19, total:244.60, omQI:3.15, omPct:71,  lignin:33.00, cn:16, humif:"Very Fast", cellulase:"—",   cp:15.00, n:2.50, p:1.10, k:4.60, mg:0.82, ca:2.60, fe:4000, ph:8.1  },
  { stage:"S5B Frass", npk:71.89, minerals:33.07, om:147.00, total:251.96, omQI:3.50, omPct:70,  lignin:32.00, cn:15, humif:"Excellent", cellulase:"—",   cp:17.50, n:2.80, p:1.27, k:2.90, mg:0.85, ca:2.80, fe:4200, ph:7.5  },
];

// VGAM: effective value USD/t DM per stage per soil
const VGAM = {
  "Inceptisols": { pct:"39%", ph:"4.1", desc:"Best fertility. High CEC 15.4, lower losses.", nAvail:85, pAvail:65, kAvail:90, mgAvail:85, agMgmt:"Standard rate. Best ROI soil. No rate reduction needed.", values:[95.19,103.38,146.22,194.80,221.44,225.33,232.12] },
  "Ultisols":    { pct:"24%", ph:"4.5", desc:"Clay-rich, acidic. High P fixation.", nAvail:70, pAvail:45, kAvail:85, mgAvail:75, agMgmt:"Increase P dose +20% to overcome fixation. Standard N+K.", values:[90.18,98.37,139.75,188.09,210.32,213.55,219.81] },
  "Histosols":   { pct:"7%",  ph:"3.8", desc:"Peat/organic. N locked. K critical.", nAvail:20, pAvail:30, kAvail:80, mgAvail:85, agMgmt:"Reduce N 80% (locked in peat). Reduce P 70%. K+Mg = primary value. PKSA strategy targets first.", values:[83.64,91.83,133.04,180.51,198.30,200.82,206.10] },
  "Oxisols":     { pct:"8%",  ph:"4.4", desc:"Fe/Al oxides. Extreme P fixation.", nAvail:75, pAvail:25, kAvail:85, mgAvail:80, agMgmt:"P effectiveness <25%. Double application rate or use banded placement. K+Mg high priority.", values:[89.51,97.70,139.02,187.36,207.84,210.69,216.34] },
  "Spodosols":   { pct:"10%", ph:"4.77",desc:"Sandy. High N+K leaching. Lowest fertility.", nAvail:55, pAvail:60, kAvail:70, mgAvail:65, agMgmt:"Split application essential (3×/yr min). Add PKSA-sourced K immediately pre-rain. 31% lower baseline yield.", values:[86.40,94.59,134.15,182.62,203.61,206.89,215.24] },
};

// Nutrient line items per stage — values USD/t DM
const NUTRIENTS = [
  { label:"N (Nitrogen)",    unit:"% DM", icon:"🌿", color:"#10b981", values:[10.73,10.73,10.73,12.55,18.26,19.02,21.30], thresh:1 },
  { label:"P₂O₅ (Phosphate)",unit:"% DM", icon:"🔵", color:"#3b82f6", values:[8.29,8.29,10.09,10.53,22.41,24.65,28.46],  thresh:1 },
  { label:"K₂O (Potash)",    unit:"% DM", icon:"🟡", color:"#f59e0b", values:[16.79,16.79,26.71,24.42,34.34,35.11,22.13], thresh:1 },
  { label:"MgO (Magnesium)", unit:"% DM", icon:"🟠", color:"#f97316", values:[9.01,9.01,15.02,15.02,21.85,22.39,23.21],   thresh:1 },
  { label:"CaO (Calcium)",   unit:"% DM", icon:"⚪", color:"#94a3b8", values:[0.96,0.96,2.00,2.00,5.00,5.20,5.60],         thresh:1 },
  { label:"Fe (Iron)",       unit:"mg/kg",icon:"🔴", color:"#ef4444", values:[2.01,2.01,1.88,1.72,2.85,3.00,3.15],         thresh:1 },
  { label:"Mg (Kieserite eq)",unit:"% DM",icon:"—",  color:"#8b5cf6", values:[9.01,9.01,15.02,15.02,21.85,22.39,23.21],   thresh:1 },
  { label:"OM Quality Value", unit:"QI",  icon:"🌱", color:"#14b8a6", values:[54.60,62.79,89.64,138.60,133.92,134.19,147.00],thresh:1},
];

// OM soil science formulas per stage
const OM_FORMULAS = [
  { param:"CEC contribution",       formula:"OM% × 1.8 cmol/kg per 1% OM",  unit:"cmol/kg added", values:[16.4,16.4,14.9,14.9,13.0,12.8,12.6] },
  { param:"Humification rate",      formula:"f(lignin%, C:N, cellulase)",    unit:"grade",         values:["Slow","Slow+","Medium","Fast","Very Fast","Very Fast","Excellent"] },
  { param:"WHC (water holding)",    formula:"f(OM%, cellulose accessibility)",unit:"grade",        values:["Low","Low+","Medium","High","High","High","Very High"] },
  { param:"C:N ratio",              formula:"C% ÷ N%",                        unit:"ratio",        values:[32,32,29,23,17,16,15] },
  { param:"N immobilisation risk",  formula:"C:N > 25 → net immob",          unit:"flag",          values:["⚠️ Immob","⚠️ Immob","⚠️ Marginal","✅ OK","✅ OK","✅ OK","✅ OK"] },
  { param:"Liming equivalent",      formula:"Ca% × 1.79 = CaCO₃ equiv t/t", unit:"kg CaCO₃/t DM", values:[8.6,8.6,17.9,17.9,44.8,46.6,50.1] },
  { param:"Cellulase activity",     formula:"FPU filter paper assay",         unit:"FPU/g",        values:["—","—","—",195,"Gut","—","—"] },
  { param:"OM Quality Index",       formula:"(1 − lignin/25) × C:N factor × cellulase factor",unit:"index", values:[1.00,1.15,1.80,2.80,3.10,3.15,3.50] },
];

const SOIL_COLORS = { "Inceptisols":"#10b981","Ultisols":"#3b82f6","Histosols":"#f59e0b","Oxisols":"#f97316","Spodosols":"#94a3b8" };

export default function CFINutrientLedger() {
  const [activeStageIdx, setActiveStageIdx] = useState(6); // default S5B
  const [activeSoil, setActiveSoil] = useState("Inceptisols");
  const [activeTab, setActiveTab] = useState("ladder");

  const stageD = STAGE_DATA[activeStageIdx];

  // Build chart data for stacked bar
  const ladderData = STAGE_DATA.map((s,i) => ({
    name: STAGE_SHORT[i],
    NPK: +s.npk.toFixed(1),
    Minerals: +s.minerals.toFixed(1),
    "OM Quality": +s.om.toFixed(1),
    total: +s.total.toFixed(1),
  }));

  // Build VGAM line chart
  const vgamLineData = STAGES.map((s,i) => {
    const row = { name: STAGE_SHORT[i] };
    Object.entries(VGAM).forEach(([soil,d]) => { row[soil] = d.values[i]; });
    return row;
  });

  const tabs = [
    { id:"ladder", label:"💰 Value Ladder" },
    { id:"soil",   label:"🌍 Soil Adjustments" },
    { id:"nutrients",label:"🧪 Nutrient Detail" },
    { id:"om",     label:"🌱 OM Formulas" },
  ];

  return (
    <div style={{ background:"#040d1a", minHeight:"100vh", fontFamily:"'IBM Plex Mono', 'Courier New', monospace", color:"#e2e8f0", padding:"0" }}>

      {/* HEADER */}
      <div style={{ background:"linear-gradient(135deg,#0a1f3d 0%,#0d2647 50%,#071527 100%)", borderBottom:"2px solid #14b8a6", padding:"20px 28px 16px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:8 }}>
          <div>
            <div style={{ fontSize:10, color:"#14b8a6", letterSpacing:4, marginBottom:4 }}>CFI · CIRCULAR FERTILISER INDUSTRIES · BOGOR</div>
            <div style={{ fontSize:18, fontWeight:700, color:"#f1f5f9", letterSpacing:1 }}>NUTRIENT VALUE LEDGER</div>
            <div style={{ fontSize:10, color:"#64748b", marginTop:3 }}>60:40 EFB:OPDC · 60 TPH FFB Mill · All values USD/t DM · VGAM soil-adjusted</div>
          </div>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
            {STAGE_DATA.map((s,i) => (
              <button key={i} onClick={()=>setActiveStageIdx(i)}
                style={{ padding:"5px 10px", fontSize:10, fontFamily:"inherit", borderRadius:4, border:"1px solid", cursor:"pointer", fontWeight:activeStageIdx===i?700:400,
                  background: activeStageIdx===i ? STAGE_COLORS[i] : "transparent",
                  borderColor: activeStageIdx===i ? STAGE_COLORS[i] : "#1e3a5f", color: activeStageIdx===i ? "#fff" : "#94a3b8" }}>
                {STAGE_SHORT[i]}<br/><span style={{fontSize:9}}>${s.total}</span>
              </button>
            ))}
          </div>
        </div>

        {/* KPI strip */}
        <div style={{ display:"flex", gap:12, marginTop:14, flexWrap:"wrap" }}>
          {[
            { label:"FULL VALUE", val:`$${stageD.total}`, sub:"/t DM", color:"#14b8a6" },
            { label:"NPK VALUE",  val:`$${stageD.npk}`,   sub:"/t DM", color:"#3b82f6" },
            { label:"OM QUALITY", val:`$${stageD.om}`,    sub:"/t DM · QI "+stageD.omQI, color:"#10b981" },
            { label:"MINERALS",   val:`$${stageD.minerals}`,sub:"/t DM",color:"#f59e0b" },
            { label:"VS S0",      val:"+"+(((stageD.total-103.10)/103.10)*100).toFixed(0)+"%", sub:"uplift", color:"#a78bfa" },
            { label:"OM QI",      val:stageD.omQI+"×",    sub:"base", color:"#f97316" },
            { label:"C:N",        val:stageD.cn+":1",      sub:"ratio", color:"#ec4899" },
          ].map((k,i)=>(
            <div key={i} style={{ background:"rgba(255,255,255,0.04)", border:`1px solid ${k.color}30`, borderRadius:6, padding:"7px 14px", minWidth:90 }}>
              <div style={{ fontSize:8, color:"#64748b", letterSpacing:2 }}>{k.label}</div>
              <div style={{ fontSize:16, fontWeight:700, color:k.color }}>{k.val}</div>
              <div style={{ fontSize:9, color:"#475569" }}>{k.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* TABS */}
      <div style={{ display:"flex", borderBottom:"1px solid #1e3a5f", background:"#071527" }}>
        {tabs.map(t=>(
          <button key={t.id} onClick={()=>setActiveTab(t.id)}
            style={{ padding:"11px 20px", fontSize:11, fontFamily:"inherit", background:"transparent", border:"none",
              borderBottom: activeTab===t.id ? "2px solid #14b8a6" : "2px solid transparent",
              color: activeTab===t.id ? "#14b8a6" : "#475569", cursor:"pointer", letterSpacing:1 }}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ padding:"20px 24px" }}>

        {/* ─── TAB 1: VALUE LADDER ─── */}
        {activeTab==="ladder" && (
          <div>
            <div style={{ fontSize:11, color:"#14b8a6", letterSpacing:3, marginBottom:16 }}>COMPONENT VALUE BUILD — S0 THROUGH S5B</div>

            <div style={{ background:"#071d34", borderRadius:8, border:"1px solid #1e3a5f", padding:16, marginBottom:20 }}>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={ladderData} margin={{top:10,right:20,left:0,bottom:0}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
                  <XAxis dataKey="name" tick={{fill:"#94a3b8",fontSize:11,fontFamily:"IBM Plex Mono,monospace"}} />
                  <YAxis tick={{fill:"#64748b",fontSize:10,fontFamily:"IBM Plex Mono,monospace"}} tickFormatter={v=>`$${v}`} />
                  <Tooltip contentStyle={{background:"#0a1f3d",border:"1px solid #14b8a6",borderRadius:6,fontFamily:"IBM Plex Mono,monospace",fontSize:11}}
                    formatter={(val,name)=>[`$${val}`,name]} />
                  <Legend wrapperStyle={{fontSize:11,fontFamily:"IBM Plex Mono,monospace",color:"#94a3b8"}} />
                  <Bar dataKey="NPK" stackId="a" fill="#3b82f6" radius={[0,0,0,0]} />
                  <Bar dataKey="Minerals" stackId="a" fill="#f59e0b" />
                  <Bar dataKey="OM Quality" stackId="a" fill="#10b981" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Stage summary table */}
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:11 }}>
                <thead>
                  <tr style={{ background:"#0a1f3d" }}>
                    {["STAGE","LIGNIN %","C:N","N %","K %","P %","Mg %","Ca %","OM QI","OM VAL","NPK VAL","MIN VAL","TOTAL $/t DM","vs S0"].map(h=>(
                      <th key={h} style={{ padding:"8px 10px", color:"#14b8a6", fontSize:9, letterSpacing:2, textAlign:"left", borderBottom:"1px solid #1e3a5f", whiteSpace:"nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {STAGE_DATA.map((s,i)=>{
                    const uplift = (((s.total-103.10)/103.10)*100).toFixed(0);
                    const isActive = i===activeStageIdx;
                    return (
                      <tr key={i} onClick={()=>setActiveStageIdx(i)} style={{ cursor:"pointer",
                        background: isActive ? "rgba(20,184,166,0.1)" : i%2===0?"transparent":"rgba(255,255,255,0.015)",
                        borderLeft: isActive ? "3px solid #14b8a6" : "3px solid transparent" }}>
                        <td style={{ padding:"9px 10px", color: STAGE_COLORS[i], fontWeight:700 }}>{STAGE_SHORT[i]}</td>
                        <td style={{ padding:"9px 10px", color: s.lignin>20?"#ef4444":s.lignin>15?"#f59e0b":"#10b981" }}>{s.lignin}%</td>
                        <td style={{ padding:"9px 10px", color: s.cn>25?"#ef4444":s.cn>20?"#f59e0b":"#10b981" }}>{s.cn}:1</td>
                        <td style={{ padding:"9px 10px", color:"#94a3b8" }}>{s.n}%</td>
                        <td style={{ padding:"9px 10px", color:"#94a3b8" }}>{s.k}%</td>
                        <td style={{ padding:"9px 10px", color:"#94a3b8" }}>{s.p}%</td>
                        <td style={{ padding:"9px 10px", color:"#94a3b8" }}>{s.mg}%</td>
                        <td style={{ padding:"9px 10px", color:"#94a3b8" }}>{s.ca}%</td>
                        <td style={{ padding:"9px 10px", color:"#a78bfa" }}>{s.omQI}×</td>
                        <td style={{ padding:"9px 10px", color:"#10b981" }}>${s.om}</td>
                        <td style={{ padding:"9px 10px", color:"#3b82f6" }}>${s.npk}</td>
                        <td style={{ padding:"9px 10px", color:"#f59e0b" }}>${s.minerals}</td>
                        <td style={{ padding:"9px 10px", color:"#14b8a6", fontWeight:700 }}>${s.total}</td>
                        <td style={{ padding:"9px 10px", color: +uplift>50?"#10b981":+uplift>0?"#f59e0b":"#ef4444" }}>{+uplift>0?"+":""}{uplift}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div style={{ marginTop:12, padding:"10px 14px", background:"rgba(59,130,246,0.08)", border:"1px solid #1e3a5f", borderRadius:6, fontSize:10, color:"#64748b" }}>
              💡 <span style={{color:"#94a3b8"}}>OM% decreases as PKSA ash dilutes the organic fraction — but OM Quality Index rises at every stage.</span> The &apos;OM Quality Value&apos; row represents the dollar premium earned by faster humification, higher WHC, and higher CEC relative to raw OM at $60/t × QI multiplier.
            </div>
          </div>
        )}

        {/* ─── TAB 2: SOIL ADJUSTMENTS ─── */}
        {activeTab==="soil" && (
          <div>
            <div style={{ fontSize:11, color:"#14b8a6", letterSpacing:3, marginBottom:16 }}>VGAM EFFECTIVE VALUE — ALL STAGES × 5 INDONESIAN SOIL TYPES</div>

            {/* Soil selector */}
            <div style={{ display:"flex", gap:8, marginBottom:20, flexWrap:"wrap" }}>
              {Object.entries(VGAM).map(([soil,d])=>(
                <button key={soil} onClick={()=>setActiveSoil(soil)}
                  style={{ padding:"7px 14px", fontSize:10, fontFamily:"inherit", borderRadius:4, border:`1px solid ${SOIL_COLORS[soil]}`,
                    background: activeSoil===soil ? SOIL_COLORS[soil]+"30" : "transparent",
                    color: activeSoil===soil ? SOIL_COLORS[soil] : "#64748b", cursor:"pointer" }}>
                  {soil} <span style={{opacity:0.6}}>{d.pct}</span>
                </button>
              ))}
            </div>

            {/* Active soil detail card */}
            <div style={{ background:"#071d34", border:`1px solid ${SOIL_COLORS[activeSoil]}50`, borderRadius:8, padding:"16px 20px", marginBottom:20 }}>
              <div style={{ display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
                <div>
                  <div style={{ fontSize:16, fontWeight:700, color:SOIL_COLORS[activeSoil], marginBottom:4 }}>{activeSoil}</div>
                  <div style={{ fontSize:11, color:"#94a3b8" }}>{VGAM[activeSoil].desc}</div>
                  <div style={{ fontSize:10, color:"#64748b", marginTop:4 }}>pH {VGAM[activeSoil].ph} · Indonesia coverage {VGAM[activeSoil].pct}</div>
                </div>
                <div style={{ background:"rgba(255,255,255,0.04)", borderRadius:6, padding:"10px 16px", fontSize:10 }}>
                  <div style={{ color:"#64748b", marginBottom:6, letterSpacing:2 }}>NUTRIENT AVAILABILITY</div>
                  {[["N",VGAM[activeSoil].nAvail],["P₂O₅",VGAM[activeSoil].pAvail],["K₂O",VGAM[activeSoil].kAvail],["MgO",VGAM[activeSoil].mgAvail]].map(([n,v])=>(
                    <div key={n} style={{ display:"flex", gap:8, alignItems:"center", marginBottom:4 }}>
                      <span style={{ color:"#64748b", width:36 }}>{n}</span>
                      <div style={{ width:100, height:6, background:"#1e3a5f", borderRadius:3 }}>
                        <div style={{ width:`${v}%`, height:"100%", background:SOIL_COLORS[activeSoil], borderRadius:3 }} />
                      </div>
                      <span style={{ color: v<40?"#ef4444":v<65?"#f59e0b":"#10b981" }}>{v}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ marginTop:12, padding:"8px 12px", background:"rgba(255,255,255,0.03)", borderRadius:4, fontSize:10, color:"#f59e0b" }}>
                📋 AG MANAGEMENT: {VGAM[activeSoil].agMgmt}
              </div>
            </div>

            {/* VGAM line chart */}
            <div style={{ background:"#071d34", borderRadius:8, border:"1px solid #1e3a5f", padding:16, marginBottom:20 }}>
              <div style={{ fontSize:10, color:"#64748b", marginBottom:12, letterSpacing:2 }}>EFFECTIVE VALUE PROGRESSION BY SOIL TYPE (USD/t DM)</div>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={vgamLineData} margin={{top:5,right:20,left:0,bottom:0}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
                  <XAxis dataKey="name" tick={{fill:"#94a3b8",fontSize:11,fontFamily:"IBM Plex Mono,monospace"}} />
                  <YAxis tick={{fill:"#64748b",fontSize:10,fontFamily:"IBM Plex Mono,monospace"}} tickFormatter={v=>`$${v}`} domain={[70,260]} />
                  <Tooltip contentStyle={{background:"#0a1f3d",border:"1px solid #14b8a6",borderRadius:6,fontFamily:"IBM Plex Mono,monospace",fontSize:11}}
                    formatter={(val,name)=>[`$${val}`,name]} />
                  <Legend wrapperStyle={{fontSize:10,fontFamily:"IBM Plex Mono,monospace"}} />
                  {Object.keys(VGAM).map(soil=>(
                    <Line key={soil} type="monotone" dataKey={soil} stroke={SOIL_COLORS[soil]}
                      strokeWidth={soil===activeSoil?3:1.5} strokeOpacity={soil===activeSoil?1:0.4}
                      dot={soil===activeSoil} />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* VGAM matrix table */}
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:11 }}>
                <thead>
                  <tr style={{ background:"#0a1f3d" }}>
                    <th style={{ padding:"8px 12px", color:"#14b8a6", fontSize:9, letterSpacing:2, textAlign:"left", borderBottom:"1px solid #1e3a5f" }}>SOIL TYPE</th>
                    <th style={{ padding:"8px 8px", color:"#64748b", fontSize:9, letterSpacing:1, textAlign:"center", borderBottom:"1px solid #1e3a5f" }}>INDO %</th>
                    {STAGE_SHORT.map(s=>(
                      <th key={s} style={{ padding:"8px 8px", color:"#64748b", fontSize:9, letterSpacing:1, textAlign:"right", borderBottom:"1px solid #1e3a5f" }}>{s}</th>
                    ))}
                    <th style={{ padding:"8px 8px", color:"#14b8a6", fontSize:9, letterSpacing:1, textAlign:"right", borderBottom:"1px solid #1e3a5f" }}>S5B GAIN</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(VGAM).map(([soil,d],si)=>(
                    <tr key={soil} style={{ background: soil===activeSoil ? `${SOIL_COLORS[soil]}12` : si%2===0?"transparent":"rgba(255,255,255,0.015)",
                      borderLeft: soil===activeSoil ? `3px solid ${SOIL_COLORS[soil]}` : "3px solid transparent",
                      cursor:"pointer" }} onClick={()=>setActiveSoil(soil)}>
                      <td style={{ padding:"9px 12px", color:SOIL_COLORS[soil], fontWeight:700 }}>{soil}</td>
                      <td style={{ padding:"9px 8px", color:"#64748b", textAlign:"center" }}>{d.pct}</td>
                      {d.values.map((v,i)=>{
                        const fullVal = STAGE_DATA[i].total;
                        const pct = ((v/fullVal)*100).toFixed(0);
                        return (
                          <td key={i} style={{ padding:"9px 8px", textAlign:"right",
                            color: i===activeStageIdx ? SOIL_COLORS[soil] : "#94a3b8",
                            fontWeight: i===activeStageIdx ? 700 : 400 }}>
                            ${v}<br/><span style={{fontSize:8,color:"#475569"}}>{pct}%</span>
                          </td>
                        );
                      })}
                      <td style={{ padding:"9px 8px", textAlign:"right", color:"#10b981", fontWeight:700 }}>
                        +{((d.values[6]-d.values[0])/d.values[0]*100).toFixed(0)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr style={{ background:"rgba(20,184,166,0.08)", borderTop:"1px solid #1e3a5f" }}>
                    <td style={{ padding:"9px 12px", color:"#14b8a6", fontWeight:700, fontSize:9 }}>FULL VALUE (no loss)</td>
                    <td style={{ padding:"9px 8px", color:"#64748b", textAlign:"center", fontSize:9 }}>—</td>
                    {STAGE_DATA.map((s,i)=>(
                      <td key={i} style={{ padding:"9px 8px", textAlign:"right", color:"#14b8a6", fontWeight:700, fontSize:10 }}>${s.total}</td>
                    ))}
                    <td style={{ padding:"9px 8px", textAlign:"right", color:"#14b8a6", fontWeight:700 }}>+144%</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {/* ─── TAB 3: NUTRIENT DETAIL ─── */}
        {activeTab==="nutrients" && (
          <div>
            <div style={{ fontSize:11, color:"#14b8a6", letterSpacing:3, marginBottom:16 }}>NUTRIENT VALUE TABLE — {STAGES[activeStageIdx].toUpperCase()} · ALL >$1/t DM ITEMS</div>

            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:11 }}>
                <thead>
                  <tr style={{ background:"#0a1f3d" }}>
                    {["NUTRIENT","CONTENT","kg/t DM","SYNTH EQUIV","$/kg","VALUE/t DM","S0 BASE","DELTA","THRESHOLD"].map(h=>(
                      <th key={h} style={{ padding:"8px 10px", color:"#14b8a6", fontSize:9, letterSpacing:2, textAlign:"left", borderBottom:"1px solid #1e3a5f", whiteSpace:"nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { n:"N (Nitrogen)",      content: stageD.n+"%",        kgdm:(stageD.n*10).toFixed(1)+" kg", synth:"Urea $350/t",    pkg:"$0.76", val:[10.73,10.73,10.73,12.55,18.26,19.02,21.30], thresh:true  },
                    { n:"P₂O₅ (Phosphate)",  content: (stageD.p*2.29).toFixed(2)+"%",  kgdm:(stageD.p*22.9).toFixed(1)+" kg", synth:"TSP $450/t",   pkg:"$0.98", val:[8.29,8.29,10.09,10.53,22.41,24.65,28.46], thresh:true  },
                    { n:"K₂O (Potash)",      content: (stageD.k*1.205).toFixed(2)+"%", kgdm:(stageD.k*12.05).toFixed(1)+" kg", synth:"MOP $380/t",  pkg:"$0.63", val:[16.79,16.79,26.71,24.42,34.34,35.11,22.13], thresh:true  },
                    { n:"MgO (Magnesium)",   content: (stageD.mg*1.66).toFixed(2)+"%", kgdm:(stageD.mg*16.6).toFixed(1)+" kg", synth:"Kieserite $280/t",pkg:"$1.65",val:[9.01,9.01,15.02,15.02,21.85,22.39,23.21], thresh:true  },
                    { n:"CaO (Calcium)",     content: (stageD.ca*1.4).toFixed(2)+"%",  kgdm:(stageD.ca*14).toFixed(1)+" kg", synth:"Ag Lime $80/t", pkg:"$0.14", val:[0.96,0.96,2.00,2.00,5.00,5.20,5.60],  thresh: activeStageIdx>=2 },
                    { n:"Fe (Iron)",         content: (activeStageIdx===0||activeStageIdx===1?2674:activeStageIdx===2?2500:activeStageIdx===3?2300:activeStageIdx===4?3800:activeStageIdx===5?4000:4200)+" mg/kg",
                      kgdm:((activeStageIdx===0||activeStageIdx===1?2674:activeStageIdx===2?2500:activeStageIdx===3?2300:activeStageIdx===4?3800:activeStageIdx===5?4000:4200)/1000).toFixed(2)+" kg",
                      synth:"Chelated Fe $150/t", pkg:"$0.75", val:[2.01,2.01,1.88,1.72,2.85,3.00,3.15], thresh:true  },
                    { n:"OM Quality Value",  content: stageD.omPct+"% × QI "+stageD.omQI,
                      kgdm:(stageD.omPct*10).toFixed(0)+" kg", synth:"Compost+ $60/t × QI", pkg:"$"+(60*stageD.omQI).toFixed(0)+"/t OM",
                      val:[54.60,62.79,89.64,138.60,133.92,134.19,147.00], thresh:true  },
                    { n:"S (Sulfur)",        content: (activeStageIdx===0?0.24:activeStageIdx===1?0.24:activeStageIdx===2?0.22:activeStageIdx===3?0.22:activeStageIdx===4?0.28:activeStageIdx===5?0.30:0.32)+"%",
                      kgdm:((activeStageIdx===0?0.24:activeStageIdx===1?0.24:activeStageIdx===2?0.22:activeStageIdx===3?0.22:activeStageIdx===4?0.28:activeStageIdx===5?0.30:0.32)*10).toFixed(1)+" kg",
                      synth:"Elemental S $120/t", pkg:"$0.12", val:[0.29,0.29,0.27,0.27,0.34,0.36,0.39], thresh:false },
                  ].map((row,ri)=>{
                    const curVal = row.val[activeStageIdx];
                    const s0Val  = row.val[0];
                    const delta  = curVal - s0Val;
                    return (
                      <tr key={ri} style={{ background: ri%2===0?"rgba(255,255,255,0.015)":"transparent",
                        opacity: row.thresh ? 1 : 0.5 }}>
                        <td style={{ padding:"9px 10px", color: row.thresh ? "#e2e8f0" : "#475569", fontWeight:row.thresh?600:400 }}>{row.n}</td>
                        <td style={{ padding:"9px 10px", color:"#94a3b8" }}>{row.content}</td>
                        <td style={{ padding:"9px 10px", color:"#94a3b8" }}>{row.kgdm}</td>
                        <td style={{ padding:"9px 10px", color:"#64748b", fontSize:10 }}>{row.synth}</td>
                        <td style={{ padding:"9px 10px", color:"#64748b" }}>{row.pkg}</td>
                        <td style={{ padding:"9px 10px", color: row.thresh?"#14b8a6":"#475569", fontWeight:700 }}>${curVal.toFixed(2)}</td>
                        <td style={{ padding:"9px 10px", color:"#475569" }}>${s0Val.toFixed(2)}</td>
                        <td style={{ padding:"9px 10px", color: delta>0?"#10b981":delta<0?"#ef4444":"#64748b" }}>
                          {delta>0?"+":""}{delta.toFixed(2)}
                        </td>
                        <td style={{ padding:"9px 10px" }}>
                          <span style={{ padding:"2px 7px", borderRadius:3, fontSize:9, fontWeight:700,
                            background: row.thresh ? "rgba(20,184,166,0.15)" : "rgba(71,85,105,0.3)",
                            color: row.thresh ? "#14b8a6" : "#475569" }}>
                            {row.thresh ? "✅ >$1" : "— <$1"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {/* TOTAL ROW */}
                  <tr style={{ background:"rgba(20,184,166,0.08)", borderTop:"2px solid #14b8a6" }}>
                    <td colSpan={5} style={{ padding:"10px 10px", color:"#14b8a6", fontWeight:700, letterSpacing:2, fontSize:10 }}>TOTAL VALUE / tonne DM — {STAGE_SHORT[activeStageIdx]}</td>
                    <td style={{ padding:"10px 10px", color:"#14b8a6", fontWeight:700, fontSize:14 }}>${stageD.total}</td>
                    <td style={{ padding:"10px 10px", color:"#475569" }}>$103.10</td>
                    <td style={{ padding:"10px 10px", color:"#10b981", fontWeight:700 }}>+${(stageD.total-103.10).toFixed(2)}</td>
                    <td />
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={{ marginTop:16, padding:"12px 16px", background:"rgba(30,58,95,0.4)", borderRadius:6, fontSize:10, color:"#64748b", lineHeight:1.8 }}>
              <span style={{color:"#94a3b8"}}>💡 Price basis:</span> Urea $350/t ÷ 46%N = $0.76/kg N · TSP $450/t ÷ 46%P₂O₅ = $0.98/kg · MOP $380/t ÷ 60%K₂O = $0.63/kg · Kieserite $280/t ÷ 27%MgO = $1.65/kg · Ag Lime $80/t ÷ 55%CaO = $0.14/kg<br/>
              <span style={{color:"#94a3b8"}}>OM basis:</span> $60/t raw OM × Quality Index (QI). QI = composite function of lignin%, C:N, cellulase activity, WHC. QI rises from 1.00 (S0) to 3.50 (S5B Frass).
            </div>
          </div>
        )}

        {/* ─── TAB 4: OM FORMULAS ─── */}
        {activeTab==="om" && (
          <div>
            <div style={{ fontSize:11, color:"#14b8a6", letterSpacing:3, marginBottom:16 }}>ORGANIC MATTER SOIL SCIENCE FORMULAS — ALL STAGES</div>

            <div style={{ overflowX:"auto", marginBottom:20 }}>
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:11 }}>
                <thead>
                  <tr style={{ background:"#0a1f3d" }}>
                    <th style={{ padding:"8px 12px", color:"#14b8a6", fontSize:9, letterSpacing:2, textAlign:"left", borderBottom:"1px solid #1e3a5f", minWidth:160 }}>PARAMETER</th>
                    <th style={{ padding:"8px 12px", color:"#14b8a6", fontSize:9, letterSpacing:2, textAlign:"left", borderBottom:"1px solid #1e3a5f", minWidth:220 }}>FORMULA / METHOD</th>
                    <th style={{ padding:"8px 8px", color:"#64748b", fontSize:9, letterSpacing:1, textAlign:"center", borderBottom:"1px solid #1e3a5f" }}>UNIT</th>
                    {STAGE_SHORT.map(s=>(
                      <th key={s} style={{ padding:"8px 8px", color:"#64748b", fontSize:9, textAlign:"right", borderBottom:"1px solid #1e3a5f" }}>{s}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {OM_FORMULAS.map((row,ri)=>(
                    <tr key={ri} style={{ background: ri%2===0?"rgba(255,255,255,0.015)":"transparent",
                      borderLeft: ri===7 ? "3px solid #14b8a6" : ri===0?"3px solid #10b981":"3px solid transparent" }}>
                      <td style={{ padding:"9px 12px", color:"#e2e8f0", fontWeight:600 }}>{row.param}</td>
                      <td style={{ padding:"9px 12px", color:"#64748b", fontSize:10 }}>{row.formula}</td>
                      <td style={{ padding:"9px 8px", color:"#475569", textAlign:"center", fontSize:10 }}>{row.unit}</td>
                      {row.values.map((v,i)=>{
                        const isActive = i===activeStageIdx;
                        let color = "#94a3b8";
                        if (typeof v === "number") {
                          if (row.param === "C:N ratio") color = v > 25 ? "#ef4444" : v > 20 ? "#f59e0b" : "#10b981";
                          else if (row.param === "OM Quality Index") color = v >= 3 ? "#10b981" : v >= 2 ? "#f59e0b" : "#94a3b8";
                          else if (row.param === "Liming equivalent") color = v > 30 ? "#10b981" : "#94a3b8";
                          else if (row.param === "CEC contribution") color = "#3b82f6";
                        } else if (typeof v === "string") {
                          if (v.includes("✅")) color = "#10b981";
                          else if (v.includes("⚠️")) color = "#f59e0b";
                          else if (["Fast","Very Fast","Excellent"].includes(v)) color="#10b981";
                          else if (v==="Medium") color="#f59e0b";
                        }
                        return (
                          <td key={i} style={{ padding:"9px 8px", textAlign:"right", fontSize:10,
                            color: isActive ? "#14b8a6" : color,
                            fontWeight: isActive ? 700 : 400,
                            background: isActive ? "rgba(20,184,166,0.06)" : "transparent" }}>
                            {v}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* CEC narrative */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              {[
                { title:"CEC — Cation Exchange Capacity", color:"#10b981",
                  content:"Each 1% OM increase adds ~1.8 cmol/kg CEC to degraded Indonesian soils (Spodosols +2.5, Oxisols +2.2). S5B frass at QI 3.5 effectively delivers 3.5× the CEC uplift of raw EFB applied directly to soil. Formula: ΔCEC ≈ OM% × 1.8 × QI adjustment." },
                { title:"Liming Value — pH Correction", color:"#f59e0b",
                  content:"PKSA treatment adds Ca and neutralises acidity. CaO content at S5B = 2.8% → 50.1 kg CaCO₃ equiv/t DM. At pH 3.8 Histosols, this alone corrects 0.3–0.5 pH units per t/ha application. Value: $0.14/kg Ca × 39.17 kg = $5.60/t at S5B." },
                { title:"N Mineralisation — C:N Driven", color:"#3b82f6",
                  content:"C:N > 25 = net N immobilisation (N locked up by microbes). C:N < 20 = net N mineralisation (N released to crops). S0 raw (C:N 32) will temporarily rob soil N. S3 Bio (C:N 23) is marginal. S4+ (C:N 15–17) drives immediate N release — critical for oil palm uptake." },
                { title:"OM Quality Index — Composite Score", color:"#a78bfa",
                  content:"QI = composite of: (1) lignin reduction factor (lower lignin → faster microbial access), (2) C:N mineralisation factor, (3) cellulase activity FPU/g. QI 1.00 at S0 → QI 3.50 at S5B. Applied to OM value: $60/t × QI → $210/t OM at S5B. This is the core value-capture argument for full bioconversion." },
              ].map((card,i)=>(
                <div key={i} style={{ background:"#071d34", border:`1px solid ${card.color}30`, borderRadius:8, padding:"14px 16px" }}>
                  <div style={{ fontSize:11, fontWeight:700, color:card.color, marginBottom:8 }}>{card.title}</div>
                  <div style={{ fontSize:10, color:"#64748b", lineHeight:1.8 }}>{card.content}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div style={{ padding:"12px 24px", borderTop:"1px solid #1e3a5f", display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:8 }}>
        <div style={{ fontSize:9, color:"#1e3a5f", letterSpacing:2 }}>CFI · NUTRIENT VALUE LEDGER · v1.0 · MARCH 2026</div>
        <div style={{ fontSize:9, color:"#1e3a5f" }}>SOURCE: CFI_Lab_Analysis_Value_PKSA_Best_Biologicals.xlsx · Urea $350/t · TSP $450/t · MOP $380/t · Kieserite $280/t · Ag Lime $80/t</div>
      </div>
    </div>
  );
}



// ======================================================================
// FILE: src/CFI_AG_Management_Planning_Calculator.jsx
// SIZE: 42063 chars / 832 lines
// ======================================================================

import { useState, useMemo } from "react";
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

  const r = useMemo(
    ()=>calc(soil, band, product, rateHa, cfiPrice, estateHa),
    [soil, band, product, rateHa, cfiPrice, estateHa]
  );

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
      fontFamily:"'Courier New',monospace",fontSize:12,padding:"0 0 40px"}}>

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



// ======================================================================
// FILE: src/CFI_Treatment_Optimizer.jsx
// SIZE: 45329 chars / 674 lines
// ======================================================================

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



// ======================================================================
// FILE: src/CFI_Soil_Calculator_v4_PUBLISHED.jsx
// SIZE: 147308 chars / 2286 lines
// ======================================================================

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


// ======================================================================
// FILE: src/CFI_Final_Lab_Display.jsx
// SIZE: 66121 chars / 1028 lines
// ======================================================================

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



// ======================================================================
// FILE: src/CFI_Stage_Lab_Display_v2.jsx
// SIZE: 83133 chars / 1312 lines
// ======================================================================

import { useState } from "react";

// ── EXACT FORMAT from EFB Lab Analysis tab ─────────────────────────────────
// Each stage has: title, subtitle, sections (with section headers + rows)
// Each row: [parameter, typicalValue, range, unit, method, reference]
// Section header rows have only the first cell filled → rendered as full-width divider

// ── S0 ROW FORMAT: [param, efb, opdc, pome, unit, method, reference] ─────────
// Section headers: { section: "..." }  (same as single-stream stages)
// threeStream: true triggers separate column rendering

const S0_ROWS = [
  { section: "PHYSICAL PROPERTIES" },
  ["Moisture Content",       "62.5%",       "70%",         "82% wb",        "% wb",    "Gravimetric 105°C",  "AOAC 930.15 — canonical CFI values"],
  ["Bulk Density",           "100–150",      "450–600",     "850–1050",      "kg/m³",   "Direct measurement", "Field data"],
  ["Particle Size",          "200–300 mm",   "5–10 mm",     "Liquid/slurry", "mm",      "Sieve / visual",     "Mill discharge observation"],
  ["pH (as received)",       "6.8–7.2",      "4.5–5.5",     "4.0–5.5",       "pH",      "pH meter, direct",   "Literature + CFI-LAB-POME-001"],
  ["Delivery state",         "Whole bunches","Wet cake/slurry","Sludge/liquid","—",      "Visual inspection",  "Mill discharge"],

  { section: "PROXIMATE ANALYSIS (% DM BASIS)" },
  ["Ash Content",            "5.0%",         "16.5%",       "28.0% ★",       "% DM",    "AOAC 942.05",        "Canonical CFI — POME ash verified Mar 2026"],
  ["Crude Protein (N×6.25)", "4.75%",        "14.5%",       "11.0%",         "% DM",    "AOAC 984.13",        "Canonical CFI confirmed values"],
  ["Ether Extract (Fat)",    "3.5–5.0%",     "25–35%",      "10.0%",         "% DM",    "AOAC 920.39 Soxhlet","POME: Feedipedia 29.2% REJECTED — mismatch"],
  ["NFE (by difference)",    "~28%",         "~12%",        "~41%",          "% DM",    "Calculation",        "100 − Ash − CP − EE − Lignin − Cellulose"],
  ["Organic Matter",         "95%",          "83.5%",       "72.0%",         "% DM",    "Calculated",         "100 − Ash"],

  { section: "FIBRE FRACTIONS — VAN SOEST (% DM)" },
  ["NDF (Total Cell Wall)",  "82%",          "58%",         "28.2%",         "% DM",    "AOAC 2002.04",       "Van Soest — canonical"],
  ["ADF (Lignin + Cellulose)","62.8%",       "52%",         "22.1%",         "% DM",    "AOAC 973.18",        "Van Soest — canonical"],
  ["ADL (Lignin)",           "22.0% ★",      "30.7% ★",     "7.6%",          "% DM",    "72% H₂SO₄",          "Canonical — KEY limiting parameter"],
  ["Cellulose (ADF−ADL)",    "40.8%",        "21.3%",       "14.5%",         "% DM",    "By difference",      "Physically locked behind lignin at S0"],
  ["Hemicellulose (NDF−ADF)","19.2%",        "6.0%",        "6.1%",          "% DM",    "By difference",      "NDF − ADF"],

  { section: "ELEMENTAL / NUTRIENT ANALYSIS (% DM)" },
  ["Carbon (C)",             "~45.6%",       "~46.4%",      "DATA GAP ⚠",    "% DM",    "CHNS Analyser",      "Estimated from C:N. C:N gap = blocking for POME"],
  ["Nitrogen (N)",           "0.76%",        "2.32%",       "1.76%",         "% DM",    "CHNS/Kjeldahl",      "CP÷6.25 verified. POME canonical Mar 2026"],
  ["C:N Ratio",              "60",           "20",          "DATA GAP ⚠",    "Ratio",   "Calculated C÷N",     "POME C:N = confirmed data gap — see guardrail"],
  ["Phosphorus (P)",         "0.06%",        "0.40%",       "0.40–0.80%",    "% DM",    "ICP-OES",            "POME range — Fe drives inclusion limit"],
  ["Potassium (K)",          "2.0%",         "0.55%",       "0.70%",         "% DM",    "ICP-OES",            "EFB high K — primary product value driver"],
  ["Calcium (Ca)",           "0.30%",        "0.40%",       "0.35%",         "% DM",    "ICP-OES",            "Literature"],
  ["Magnesium (Mg)",         "0.18%",        "0.25%",       "0.20%",         "% DM",    "ICP-OES",            "Literature"],

  { section: "HEAVY METALS — KEY CONCERNS (mg/kg DM)" },
  ["Iron (Fe)",              "200–800",      "500–1500",    "3,000–8,000 ★", "mg/kg DM","ICP-OES Package A",  "⚠ POME Fe drives inclusion rate. CFI-LAB-POME-001"],
  ["Manganese (Mn)",         "50–200",       "100–300",     "100–475",       "mg/kg DM","ICP-OES Package A",  "No current legal limit — monitor trend"],
  ["Zinc (Zn)",              "10–50",        "30–80",       "20–60",         "mg/kg DM","ICP-OES Package A",  "Sub-threshold"],
  ["Copper (Cu)",            "5–20",         "10–30",       "8–25",          "mg/kg DM","ICP-OES Package A",  "Sub-threshold"],

  { section: "BSF SUITABILITY ASSESSMENT (S0 — RAW STATE)" },
  ["BSF suitability",        "NOT READY ✗",  "NOT READY ✗", "NOT READY ✗",   "Gate",    "Multi-param check",  "All 3 streams require S1+S2 pre-processing"],
  ["Lignin barrier",         "CRITICAL ✗",   "CRITICAL ✗",  "Low (pass)",    "Gate",    "ADL %",              "EFB/OPDC require PKSA delignification at S2"],
  ["Moisture gate",          "High — press", "High — press","High — dewater","Gate",    "% wb",               "S1 pressing/dewatering required before biology"],
  ["Protein (CP%)",          "FAIL <5%",     "PASS 14.5%",  "MARGINAL 11%",  "Gate",    "CP % DM",            "EFB needs OPDC protein supplement to reach ≥8%"],
  ["pH gate",                "PASS ~7.0",    "PASS ~5.0",   "FAIL — acidic", "Gate",    "pH",                 "POME pH 4–5.5 corrected by S2 PKSA neutralisation"],
];

const STAGES = [
  {
    id: "s0",
    label: "Stage 0",
    product: "RAW FEEDSTOCK",
    productColor: "#3a2000",
    tagline: "As-Received at Mill Gate — Three Independent Streams",
    title: "S0 — RAW FEEDSTOCK BASELINE: EFB · OPDC/DC · POME SLUDGE",
    subtitle: "CFI Bioconversion Stage 0 | 60 TPH FFB Mill — Bogor, West Java | March 2026",
    threeStream: true,
    streams: ["EFB", "OPDC / DC", "POME Sludge"],
    streamColors: ["#1a5530", "#1a3560", "#5a2070"],
    rows: S0_ROWS,
    value: {
      totalDM: "—",
      totalWet: "—",
      wetBasis: "Not a sellable product",
      isBaseline: true,
      streams: [
        {
          name: "EFB",
          color: "#1a5530",
          mc: 62.5,
          daily_wet: 331,
          // kg/t WET at 62.5% MC (× 0.375 DM fraction)
          nutrients: [
            { name: "Nitrogen (N)",   kgPerTWet: 2.85, kgPerTDM: 7.60,  note: "N 0.76% DM × 37.5% DM" },
            { name: "Phosphorus (P)", kgPerTWet: 0.23, kgPerTDM: 0.60,  note: "P 0.06% DM × 37.5% DM" },
            { name: "Potassium (K)",  kgPerTWet: 7.50, kgPerTDM: 20.00, note: "K 2.0% DM × 37.5% DM" },
            { name: "Calcium (Ca)",   kgPerTWet: 1.13, kgPerTDM: 3.00,  note: "Ca 0.30% DM × 37.5% DM" },
            { name: "Magnesium (Mg)", kgPerTWet: 0.68, kgPerTDM: 1.80,  note: "Mg 0.18% DM × 37.5% DM" },
          ],
        },
        {
          name: "OPDC / DC",
          color: "#1a3560",
          mc: 70.0,
          daily_wet: 50,
          // kg/t WET at 70% MC (× 0.30 DM fraction)
          nutrients: [
            { name: "Nitrogen (N)",   kgPerTWet: 6.96, kgPerTDM: 23.20, note: "N 2.32% DM × 30% DM" },
            { name: "Phosphorus (P)", kgPerTWet: 1.20, kgPerTDM: 4.00,  note: "P 0.40% DM × 30% DM" },
            { name: "Potassium (K)",  kgPerTWet: 1.65, kgPerTDM: 5.50,  note: "K 0.55% DM × 30% DM" },
            { name: "Calcium (Ca)",   kgPerTWet: 1.20, kgPerTDM: 4.00,  note: "Ca 0.40% DM × 30% DM" },
            { name: "Magnesium (Mg)", kgPerTWet: 0.75, kgPerTDM: 2.50,  note: "Mg 0.25% DM × 30% DM" },
          ],
        },
        {
          name: "POME Sludge",
          color: "#5a2070",
          mc: 82.0,
          daily_wet: 30,
          // kg/t WET at 82% MC (× 0.18 DM fraction)
          nutrients: [
            { name: "Nitrogen (N)",   kgPerTWet: 3.17, kgPerTDM: 17.60, note: "N 1.76% DM × 18% DM — canonical" },
            { name: "Phosphorus (P)", kgPerTWet: 1.08, kgPerTDM: 6.00,  note: "P 0.60% DM typical × 18% DM" },
            { name: "Potassium (K)",  kgPerTWet: 1.26, kgPerTDM: 7.00,  note: "K 0.70% DM × 18% DM" },
            { name: "Calcium (Ca)",   kgPerTWet: 0.63, kgPerTDM: 3.50,  note: "Ca 0.35% DM × 18% DM" },
            { name: "Magnesium (Mg)", kgPerTWet: 0.36, kgPerTDM: 2.00,  note: "Mg 0.20% DM × 18% DM" },
          ],
        },
      ],
      badges: [
        { label: "EFB MC",       val: "62.5% wb",      color: "#1a5530" },
        { label: "OPDC MC",      val: "70% wb",        color: "#1a3560" },
        { label: "POME MC",      val: "82% wb",        color: "#5a2070" },
        { label: "EFB Lignin",   val: "22% DM ★",      color: "#7a0000" },
        { label: "OPDC Lignin",  val: "30.7% DM ★",    color: "#7a0000" },
        { label: "POME Fe",      val: "3–8k mg/kg ⚠", color: "#b05000" },
        { label: "C:N gap",      val: "POME = DATA GAP",color: "#888888" },
      ],
      note: "S0 = process entry point. No sellable product. Values shown are baseline inputs for mass balance and nutrient ledger.",
      // Soil × AG Management value matrix — sourced from CFI_Soil_Calculator_v3.jsx
      // $/t DM finished product. Computed as: nVal + pFixAdvantage[tier].pVal + kVal
      soilMatrix: [
        { id:"inceptisol", name:"Inceptisols",    pct:"39%", color:"#14b8a6", primary:true,
          tiers:{ VGAM:195, Normal:243, Poor:326 },
          pMult:{ VGAM:2.20, Normal:3.06, Poor:4.58 },
          nLoss:"35%", pitch:"P + mycorrhizal inoculant story" },
        { id:"ultisol",    name:"Ultisols (PMK)", pct:"24%", color:"#f59e0b", primary:true,
          tiers:{ VGAM:243, Normal:293, Poor:470 },
          pMult:{ VGAM:2.75, Normal:3.67, Poor:6.88 },
          nLoss:"50%", pitch:"★ PRIMARY — P fixation bypass" },
        { id:"oxisol",     name:"Oxisols",        pct:"8%",  color:"#f97316", primary:true,
          tiers:{ VGAM:312, Normal:413, Poor:488 },
          pMult:{ VGAM:3.67, Normal:5.50, Poor:6.88 },
          nLoss:"60%", pitch:"★ HIGHEST VALUE — goethite P" },
        { id:"histosol",   name:"Histosols (Peat)","pct":"7%", color:"#a855f7", primary:false,
          tiers:{ VGAM:192, Normal:226, Poor:274 },
          pMult:{ VGAM:1.57, Normal:2.20, Poor:3.06 },
          nLoss:"58%", pitch:"Lead with K + Cu, not P" },
        { id:"spodosol",   name:"Spodosols",      pct:"<5%", color:"#64748b", primary:false,
          tiers:{ VGAM:249, Normal:292, Poor:343 },
          pMult:{ VGAM:1.96, Normal:2.75, Poor:3.67 },
          nLoss:"70%", pitch:"CEC rebuild 5-yr story" },
      ],
    },
  },
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
  // ── S3 WAVE 2 — delta-column format ───────────────────────────────────────
  {
    id: "s3w2",
    label: "Stage 3 W2",
    product: "BIO-COMPOST+ W2",
    productColor: "#0d4020",
    tagline: "Wave 2 — N-Fixers + PSB Activated · Mesophilic Phase",
    title: "BIO-COMPOST+ W2 — WAVE 2 MICROBIAL INOCULATION",
    subtitle: "CFI Bioconversion Stage 3 Wave 2 | N-Fixing + P-Solubilising Bacteria Activation | Date: 2026",
    deltaStage: true,
    rows: [
      { section: "PHYSICAL PROPERTIES" },
      ["Moisture",               "% wb",    "45–60%",     "40–55%",      "↓",  "Gravimetric 105°C",        "Evaporation during mesophilic phase"],
      ["Temperature",            "°C",      "45–55°C",    "35–45°C",     "↓",  "Thermometer probe",        "Thermophilic → mesophilic transition"],
      ["pH",                     "pH",      "6.5–7.5",    "6.8–7.5",     "→",  "pH meter",                 "Stable — N-fixer optimum range"],
      ["Bulk density",           "kg/m³",   "380–480",    "400–520",     "↑",  "Direct measurement",       "Compaction + humification"],
      { section: "PROXIMATE ANALYSIS (% DM)" },
      ["Crude Protein (N×6.25)", "% DM",    "12.5–13.8%", "14.0–16.0%",  "↑",  "AOAC 984.13",              "N fixation adds to protein pool"],
      ["Ash",                    "% DM",    "10–12%",     "11–14%",      "↑",  "AOAC 942.05",              "OM respiration concentrates mineral fraction"],
      ["Crude Fat",              "% DM",    "5–7%",       "4–6%",        "↓",  "AOAC 920.39",              "Slight lipid catabolism by mesophiles"],
      ["Humic Acid",             "% DM",    "8–15%",      "12–20%",      "↑",  "Humic acid extraction",    "Humification accelerates — mesophilic ligninase"],
      ["Fulvic Acid",            "% DM",    "5–10%",      "8–14%",       "↑",  "Fulvic extraction",        "Labile fraction — highest bioavailability"],
      { section: "FIBRE FRACTIONS (% DM)" },
      ["ADL (Lignin)",           "% DM",    "14–16%",     "11–14%",      "↓",  "72% H\u2082SO\u2084",    "Mesophilic white-rot fungi continue delignification"],
      ["NDF",                    "% DM",    "60–68%",     "55–65%",      "↓",  "AOAC 2002.04",             "Continued microbial digestion"],
      ["ADF",                    "% DM",    "40–48%",     "36–44%",      "↓",  "AOAC 973.18",              "Van Soest — further reduction"],
      ["Cellulose accessible",   "% DM",    "36–40%",     "35–40%",      "→",  "ADF−ADL",                  "Stable — BSF-ready structural carbohydrate"],
      { section: "ELEMENTAL ANALYSIS (% DM)" },
      ["Nitrogen (N)",           "% DM",    "1.80–2.20%", "2.20–2.50% ★","↑",  "CHNS/Kjeldahl",            "★ N fixation — Azotobacter/Azospirillum active"],
      ["C:N Ratio",              "Ratio",   "18–25",      "14–20",       "↓",  "Calculated",               "Approaching BSF optimal window"],
      ["Phosphorus (P)",         "% DM",    "0.13–0.18%", "0.18–0.26% ★","↑",  "ICP-OES",                  "★ PSB peak — Bacillus megaterium + A. niger"],
      ["Potassium (K)",          "% DM",    "0.80–0.90%", "0.82–0.95%",  "→",  "ICP-OES",                  "PKSA K maintained"],
      ["Calcium (Ca)",           "% DM",    "0.13%",      "0.13–0.16%",  "→",  "ICP-OES",                  "Stable"],
      ["Magnesium (Mg)",         "% DM",    "0.10%",      "0.10–0.13%",  "→",  "ICP-OES",                  "Stable"],
      { section: "BIOLOGICAL ACTIVITY — WAVE 2 PEAK ★" },
      ["N-fixing bacteria",      "CFU/g",   "10\u2077–10\u2078","10\u2078–10\u2079 ★","↑","Plate count","★ PEAK — temp gate <50°C triggered Wave 2"],
      ["PSB (B. megaterium)",    "CFU/g",   "10\u2076–10\u2077","10\u2077–10\u2078 ★","↑","Pikovskaya agar","★ PEAK — acidic exudates dissolving Ca-P bonds"],
      ["Cellulase (CMCase)",     "U/g",     "20–35 ★",    "12–22",       "↓",  "DNS assay",                "Declining — thermophilic phase passed. W1 was peak."],
      ["Phosphatase activity",   "Relative","+120–180%",  "+200–280% ★", "↑",  "p-Nitrophenol",            "★ PEAK phosphatase — PSB-driven"],
      ["Trichoderma",            "CFU/g",   "10\u2075–10\u2076","10\u2076–10\u2077","↑","Selective agar","Building — persists to soil application"],
      { section: "BSF READINESS GATE" },
      ["CP gate (≥8%)",          "Gate",    "PASS ✓ 12.5%","PASS ✓ 14–16%","↑", "AOAC 984.13",             "Above 8% biological floor"],
      ["Temperature gate",       "Gate",    "COOLING",    "≤30°C target ✓","↓", "Thermometer",             "BSF inoculation gate: temp must reach ≤30°C"],
      ["C:N gate",               "Ratio",   "18–25",      "14–20 ✓",     "↓",  "Calculated",               "Optimal BSF range (15–25) reached"],
      ["Lignin gate",            "% DM",    "14–16%",     "11–14% ✓",    "↓",  "ADL 72%H\u2082SO\u2084", "Below 18% — BSF capable of penetration"],
      ["Overall BSF gate",       "Gate",    "READY ✓",    "INOCULATE ★", "→",  "Multi-param",              "All gates passed. Optimal W2 inoculation window."],
    ],
    value: {
      totalDM: 78.50,
      totalWet: 35.33,
      wetBasis: "55% moisture",
      nutrients: [
        { name: "Nitrogen (N)",        pct: "2.35%",   kgPerT: 23.5, price: "$0.761/kg N", val: 17.88 },
        { name: "Phosphorus (P)",       pct: "0.22%",   kgPerT: 2.2,  price: "$2.740/kg P", val: 6.03  },
        { name: "Potassium (K)",        pct: "0.88%",   kgPerT: 8.8,  price: "$0.553/kg K", val: 4.87  },
        { name: "Calcium (Ca)",         pct: "0.15%",   kgPerT: 1.5,  price: "$0.204/kg Ca",val: 0.31  },
        { name: "Magnesium (Mg)",       pct: "0.12%",   kgPerT: 1.2,  price: "$1.029/kg Mg",val: 1.23  },
        { name: "Organic Matter (87%)", pct: "870 kg/t",kgPerT: 870,  price: "$0.030/kg OM",val: 26.10 },
        { name: "Biological Premium W2",pct: "—",       kgPerT: "—",  price: "PSB + N-fixer peak", val: 22.08 },
      ],
      badges: [
        { label: "N-fixers ★ PEAK", val: "10\u2079 CFU/g",   color: "#0d4020" },
        { label: "PSB ★ PEAK",      val: "10\u2078 CFU/g",   color: "#1a3560" },
        { label: "Phosphatase ★",   val: "+280% vs base",     color: "#7a5500" },
        { label: "C:N",             val: "14–20",             color: "#1a5530" },
      ],
      note: "W2 is the optimal BSF inoculation window. N-fixers and PSB at peak — inoculate when temp ≤30°C.",
    },
  },

  // ── STAGE 4 — BSF ACTIVE REARING: timeline format ─────────────────────────
  {
    id: "s4",
    label: "Stage 4",
    product: "BSF ACTIVE REARING",
    productColor: "#2d0060",
    tagline: "GH-A Greenhouse · D0→D14 · S4 End = S5B",
    title: "STAGE 4 — BSF ACTIVE REARING: IN-PROCESS QC TRAJECTORY",
    subtitle: "CFI Bioconversion Stage 4 | GH-A Greenhouse | 14-Day Bioconversion | Harvest Fork at Prepupae Stage | Date: 2026",
    timeline: true,
    rows: [
      { section: "PHYSICAL — SUBSTRATE" },
      ["Moisture (substrate)",     "% wb",   "50–60%",         "60–65% ↑",       "55–65%",            "Gravimetric — larvae maintain substrate MC"],
      ["Temperature",              "°C",     "25–30°C",        "28–32°C ↑",      "26–30°C ↓",         "Larval metabolic heat — peaks D4–8"],
      ["pH (substrate)",           "pH",     "6.8–7.5",        "6.5–7.2",        "6.0–7.0",           "Larval excretion slowly acidifies"],
      ["Particle size",            "mm",     "2 mm",           "< 1.5 mm",       "< 0.5 mm fine",     "BSF mandibles fragment substrate"],
      { section: "PROXIMATE — SUBSTRATE DEPLETION (% DM)" },
      ["Crude Protein (substrate)","% DM",   "14–16%",         "10–13% ↓↓",      "7–10% ↓↓↓",         "Larvae consuming substrate protein"],
      ["Crude Fat",                "% DM",   "4–6%",           "2–4% ↓↓",        "1–3% ↓↓↓",          "Lipid = primary larval energy source"],
      ["NFE / Carbohydrates",      "% DM",   "22–28%",         "12–18% ↓↓",      "6–12% ↓↓↓",         "Rapid carbohydrate consumption"],
      ["Ash (relative)",           "% DM",   "11–14%",         "14–18% ↑",       "18–26% ↑↑",         "Concentrates as organic matter consumed"],
      ["ADL (Lignin)",             "% DM",   "11–14%",         "10–13%",         "9–13%",             "BSF cannot digest lignin — slight relative rise"],
      { section: "ELEMENTAL — FRASS ACCUMULATION (% DM)" },
      ["Total Nitrogen (N)",       "% DM",   "2.20–2.50%",     "2.8–3.5% ↑↑",    "3.5–5.0% ↑↑↑ ★",   "Frass N accumulation — larval excretion"],
      ["NH\u2084\u207A-N",       "% DM",   "0.2–0.4%",       "0.5–1.0% ↑↑",    "0.8–1.5% ↑↑↑",     "Larval excretion product"],
      ["Phosphorus (P)",           "% DM",   "0.18–0.26%",     "0.25–0.45% ↑",   "0.40–0.70% ↑↑ ★",  "Gut solubilisation 2–3× input"],
      ["Potassium (K)",            "% DM",   "0.82–0.95%",     "0.90–1.10% ↑",   "1.00–1.30% ↑↑",    "Concentration by OM loss"],
      ["Calcium (Ca)",             "% DM",   "0.13–0.16%",     "0.5–1.5% ↑↑",    "2.0–4.0% ↑↑↑ ★",   "Larval cuticle — BSF highest Ca of all insects"],
      ["C:N Ratio",                "Ratio",  "14–20",          "10–14 ↓↓",        "8–14 ↓↓↓",          "Low C:N — split application advisory at D14"],
      { section: "LARVAL BIOMASS (per kg substrate DM input)" },
      ["Larval fresh weight",      "g/kg DM","0 (inoculated)", "8–15 g",          "20–30 g ★",         "Direct weighing — D14 = prepupae target"],
      ["Individual larval weight", "mg",     "2–5 (neonate)",  "80–150",          "180–280 prepupae ★","Individual weighing"],
      ["Feed conversion ratio",    "kg/kg",  "—",              "~5:1",            "~3.5:1 ★",          "FCR improves toward prepupae"],
      ["Larval length",            "mm",     "1–3",            "8–12",            "18–25 prepupae ★",  "Physical measurement"],
      { section: "HARVEST DECISION GATE — PREPUPAE FORK ⚡" },
      ["Extract larvae → S5A",    "Gate",   "—",              "—",               "→ S5A FRASS",       "Larvae removed → frass = BIO-FERTILISER+"],
      ["Terminate in-sub → S5B",  "Gate",   "—",              "—",               "→ S5B = S4 END ★",  "Larvae remain → full biomass product"],
      ["S5A substrate value",     "$/t DM", "—",              "—",               "$79.95/t DM",       "Frass — larvae sold separately as insect meal"],
      ["S5B substrate value",     "$/t DM", "—",              "—",               "$91.08/t DM ★",     "S4 end state — highest N + Ca substrate"],
      ["Value delta A→B",         "$/t DM", "—",              "—",               "+$11.13 for S5B",   "S5B premium for soil-facing fertiliser product"],
    ],
    value: {
      isHarvestFork: true,
      productA: { name: "S5A — Frass (larvae extracted)", value: 79.95, mc: 20, color: "#1a5530" },
      productB: { name: "S5B = S4 End (terminate in-sub)", value: 91.08, mc: 30, color: "#6b2a00" },
      delta: 11.13,
      keyMetrics: [
        { label: "Larval yield D14",  val: "20–30 g/kg DM", note: "prepupae stage" },
        { label: "FCR at D14",        val: "~3.5 : 1",      note: "kg feed/kg larvae" },
        { label: "Substrate N D14",   val: "3.5–5.0% DM",   note: "frass accumulation" },
        { label: "Ca D14",            val: "2.0–4.0% DM",   note: "cuticle — highest in range" },
        { label: "P D14",             val: "0.40–0.70% DM", note: "2–3× gut solubilisation" },
      ],
      badges: [
        { label: "Larval weight ★",  val: "180–280 mg",    color: "#2d0060" },
        { label: "Substrate N★",     val: "3.5–5.0% DM",  color: "#0d4020" },
        { label: "FCR",              val: "3.5:1",         color: "#1a3560" },
        { label: "S5B premium",      val: "+$11.13/t DM",  color: "#6b2a00" },
      ],
      soilMatrix: [
        { id:"inceptisol", name:"Inceptisols",    pct:"39%", color:"#14b8a6",
          s5a:{ VGAM:195, Normal:243, Poor:326 }, s5b:{ VGAM:210, Normal:260, Poor:345 } },
        { id:"ultisol",    name:"Ultisols (PMK)", pct:"24%", color:"#f59e0b",
          s5a:{ VGAM:243, Normal:293, Poor:470 }, s5b:{ VGAM:258, Normal:308, Poor:485 } },
        { id:"oxisol",     name:"Oxisols",        pct:"8%",  color:"#f97316",
          s5a:{ VGAM:312, Normal:413, Poor:488 }, s5b:{ VGAM:327, Normal:428, Poor:503 } },
        { id:"histosol",   name:"Histosols (Peat)","pct":"7%",color:"#a855f7",
          s5a:{ VGAM:192, Normal:226, Poor:274 }, s5b:{ VGAM:207, Normal:241, Poor:289 } },
        { id:"spodosol",   name:"Spodosols",      pct:"<5%", color:"#64748b",
          s5a:{ VGAM:249, Normal:292, Poor:343 }, s5b:{ VGAM:264, Normal:307, Poor:358 } },
      ],
      note: "S4 end (D14–18, no extraction) = S5B. The harvest decision is the only fork. S5B substrate includes larval protein and Ca uplift.",
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
  const [activeStage, setActiveStage] = useState("s0");
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

          {/* Column headers — three-stream vs delta vs timeline vs standard */}
          {stage.threeStream ? (
            <div style={{ display: "grid", gridTemplateColumns: "26% 14% 14% 14% 8% 14% 10%", background: "#1a3560" }}>
              {["Parameter", "EFB", "OPDC / DC", "POME Sludge", "Unit", "Analytical Method", "Reference"].map((h, i) => (
                <div key={i} style={{
                  color: i === 1 ? "#86efac" : i === 2 ? "#93c5fd" : i === 3 ? "#d8b4fe" : "#ffffff",
                  fontSize: 9, fontFamily: "Arial", fontWeight: "bold",
                  padding: "7px 8px", borderRight: i < 6 ? "1px solid #2a4a80" : "none",
                  textTransform: "uppercase", letterSpacing: 0.5
                }}>{h}</div>
              ))}
            </div>
          ) : stage.deltaStage ? (
            <div style={{ display: "grid", gridTemplateColumns: "24% 7% 14% 14% 5% 18% 18%", background: "#0d4020" }}>
              {["Parameter", "Unit", "W1 Output", "W2 Result", "Δ", "Analytical Method", "Reference / Note"].map((h, i) => (
                <div key={i} style={{
                  color: i === 2 ? "#86efac" : i === 3 ? "#fde68a" : i === 4 ? "#f9a8d4" : "#ffffff",
                  fontSize: 9, fontFamily: "Arial", fontWeight: "bold",
                  padding: "7px 8px", borderRight: i < 6 ? "1px solid #1a5530" : "none",
                  textTransform: "uppercase", letterSpacing: 0.5
                }}>{h}</div>
              ))}
            </div>
          ) : stage.timeline ? (
            <div style={{ display: "grid", gridTemplateColumns: "22% 7% 17% 17% 20% 17%", background: "#2d0060" }}>
              {["Parameter", "Unit", "D0 — Entry", "D6 — Active", "D14 — Harvest Fork", "Method / Note"].map((h, i) => (
                <div key={i} style={{
                  color: i === 2 ? "#c4b5fd" : i === 3 ? "#a78bfa" : i === 4 ? "#fde68a" : "#ffffff",
                  fontSize: 9, fontFamily: "Arial", fontWeight: "bold",
                  padding: "7px 8px", borderRight: i < 5 ? "1px solid #4c1d95" : "none",
                  textTransform: "uppercase", letterSpacing: 0.5
                }}>{h}</div>
              ))}
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: COL_WIDTHS.join(" "), background: "#1a3560" }}>
              {COL_HEADERS.map((h, i) => (
                <div key={i} style={{
                  color: "#ffffff", fontSize: 9, fontFamily: "Arial", fontWeight: "bold",
                  padding: "7px 8px", borderRight: i < COL_HEADERS.length - 1 ? "1px solid #2a4a80" : "none",
                  textTransform: "uppercase", letterSpacing: 0.5
                }}>{h}</div>
              ))}
            </div>
          )}

          {/* Rows — three-stream vs delta vs timeline vs standard */}
          {stage.threeStream ? (
            stage.rows.map((row, i) => {
              if (row.section) {
                return (
                  <div key={i} style={{
                    background: "#e8edf5", padding: "5px 10px", fontSize: 9,
                    fontFamily: "Arial", fontWeight: "bold", color: "#1a3560",
                    textTransform: "uppercase", letterSpacing: 1,
                    borderTop: "1px solid #c4cfe0", borderBottom: "1px solid #c4cfe0",
                  }}>{row.section}</div>
                );
              }
              // row = [param, efb, opdc, pome, unit, method, reference]
              const hasAlert = String(row[1]).includes("✗") || String(row[1]).includes("⚠") ||
                               String(row[2]).includes("★") || String(row[3]).includes("★") ||
                               String(row[1]).includes("NOT READY") || String(row[3]).includes("DATA GAP");
              const rowBg = hasAlert ? "#fff8e8" : i % 2 === 0 ? "#ffffff" : "#fafafa";
              const cellColor = (v) => {
                if (String(v).includes("NOT READY") || String(v).includes("CRITICAL") || String(v).includes("FAIL")) return "#b00020";
                if (String(v).includes("★")) return "#c47d00";
                if (String(v).includes("DATA GAP")) return "#888888";
                if (String(v).includes("PASS") || String(v).includes("READY")) return "#1a5530";
                return "#333333";
              };
              return (
                <div key={i} style={{
                  display: "grid", gridTemplateColumns: "26% 14% 14% 14% 8% 14% 10%",
                  background: rowBg, borderBottom: "1px solid #eeeeee",
                }}>
                  {row.map((cell, j) => (
                    <div key={j} style={{
                      padding: "5px 8px",
                      fontSize: j === 0 ? 10 : 9,
                      fontFamily: j === 0 ? "Georgia, serif" : "Arial, sans-serif",
                      fontWeight: j === 0 ? "bold" : j >= 1 && j <= 3 ? "600" : "normal",
                      color: j === 0 ? "#000000" :
                             j === 1 ? cellColor(cell) :
                             j === 2 ? cellColor(cell) :
                             j === 3 ? cellColor(cell) :
                             j === 6 ? "#1a55cc" : "#555555",
                      borderRight: j < row.length - 1 ? "1px solid #eeeeee" : "none",
                      fontStyle: j === 6 ? "italic" : "normal",
                    }}>{cell}</div>
                  ))}
                </div>
              );
            })
          ) : stage.deltaStage ? (
            // ── Delta-column rendering (S3W2): [param, unit, w1, w2, delta, method, ref] ──
            stage.rows.map((row, i) => {
              if (row.section) {
                return (
                  <div key={i} style={{
                    background: "#d4edda", padding: "5px 10px", fontSize: 9,
                    fontFamily: "Arial", fontWeight: "bold", color: "#0d4020",
                    textTransform: "uppercase", letterSpacing: 1,
                    borderTop: "1px solid #a8d5b5", borderBottom: "1px solid #a8d5b5",
                  }}>
                    {row.section}
                    {row.section.includes("★") && (
                      <span style={{ background: "#0d4020", color: "#fde68a", fontSize: 8, padding: "1px 6px", borderRadius: 3, marginLeft: 8 }}>PEAK</span>
                    )}
                  </div>
                );
              }
              // row = [param, unit, w1, w2, delta, method, ref]
              const delta = row[4];
              const deltaColor = delta === "↑" ? "#1a5530" : delta === "↓" ? "#b00020" : "#888888";
              const hasHighlight = String(row[3]).includes("★");
              return (
                <div key={i} style={{
                  display: "grid", gridTemplateColumns: "24% 7% 14% 14% 5% 18% 18%",
                  background: hasHighlight ? "#fffbeb" : i % 2 === 0 ? "#ffffff" : "#f6fef9",
                  borderBottom: "1px solid #e0ede5",
                }}>
                  {row.map((cell, j) => (
                    <div key={j} style={{
                      padding: "5px 8px", fontSize: j === 0 ? 10 : 9,
                      fontFamily: j === 0 ? "Georgia, serif" : "Arial, sans-serif",
                      fontWeight: j === 0 ? "bold" : j === 3 ? "600" : "normal",
                      color: j === 0 ? "#000" :
                             j === 2 ? "#555" :
                             j === 3 ? (hasHighlight ? "#c47d00" : "#0d4020") :
                             j === 4 ? deltaColor :
                             j === 6 ? "#1a55cc" : "#444",
                      borderRight: j < row.length - 1 ? "1px solid #e8f0ec" : "none",
                      fontStyle: j === 6 ? "italic" : "normal",
                      fontSize: j === 4 ? 13 : j === 0 ? 10 : 9,
                      textAlign: j === 4 ? "center" : "left",
                    }}>{cell}</div>
                  ))}
                </div>
              );
            })
          ) : stage.timeline ? (
            // ── Timeline rendering (S4): [param, unit, d0, d6, d14, method] ──
            stage.rows.map((row, i) => {
              if (row.section) {
                return (
                  <div key={i} style={{
                    background: "#ede9fe", padding: "5px 10px", fontSize: 9,
                    fontFamily: "Arial", fontWeight: "bold", color: "#2d0060",
                    textTransform: "uppercase", letterSpacing: 1,
                    borderTop: "1px solid #c4b5fd", borderBottom: "1px solid #c4b5fd",
                  }}>
                    {row.section}
                    {row.section.includes("★") && (
                      <span style={{ background: "#2d0060", color: "#fde68a", fontSize: 8, padding: "1px 6px", borderRadius: 3, marginLeft: 8 }}>KEY</span>
                    )}
                  </div>
                );
              }
              // row = [param, unit, d0, d6, d14, method]
              const isFork = String(row[4]).includes("S5A") || String(row[4]).includes("S5B") || String(row[4]).includes("S4 END");
              const isKey = String(row[4]).includes("★") || String(row[0]).includes("Harvest");
              const d14Color = isFork
                ? (String(row[4]).includes("S5B") ? "#6b2a00" : "#1a5530")
                : isKey ? "#c47d00" : "#333";
              return (
                <div key={i} style={{
                  display: "grid", gridTemplateColumns: "22% 7% 17% 17% 20% 17%",
                  background: isFork ? "#fff8f0" : isKey ? "#fefce8" : i % 2 === 0 ? "#ffffff" : "#faf8ff",
                  borderBottom: "1px solid #ede9fe",
                }}>
                  {row.map((cell, j) => (
                    <div key={j} style={{
                      padding: "5px 8px", fontSize: j === 0 ? 10 : 9,
                      fontFamily: j === 0 ? "Georgia, serif" : "Arial, sans-serif",
                      fontWeight: j === 0 ? "bold" : j === 4 ? "600" : "normal",
                      color: j === 0 ? "#000" :
                             j === 2 ? "#6d6d6d" :
                             j === 3 ? "#2d0060" :
                             j === 4 ? d14Color :
                             j === 5 ? "#1a55cc" : "#444",
                      borderRight: j < row.length - 1 ? "1px solid #ede9fe" : "none",
                      fontStyle: j === 5 ? "italic" : "normal",
                      background: j === 4 && isFork ? (String(row[4]).includes("S5B") ? "#fff0e8" : "#edfaf3") : "transparent",
                    }}>{cell}</div>
                  ))}
                </div>
              );
            })
          ) : (
            stage.rows.map((row, i) => {
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
            })
          )}
        </div>

        {/* ── RIGHT: PRODUCT VALUE / BASELINE PANEL ── */}
        <div style={{ background: "#ffffff", borderLeft: "2px solid #dddddd", display: "flex", flexDirection: "column" }}>

          {/* Product title */}
          <div style={{ background: stage.productColor, padding: "14px 16px" }}>
            <div style={{ color: "#f5c842", fontSize: 9, fontFamily: "Arial", letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>
              {stage.value.isBaseline ? "BASELINE INPUTS" : stage.value.isHarvestFork ? "IN-PROCESS QC · HARVEST FORK" : "PRODUCT VALUE"}
            </div>
            <div style={{ color: "#ffffff", fontSize: 14, fontWeight: "bold", lineHeight: 1.3 }}>
              {stage.product}
            </div>
            <div style={{ color: "#f5c842", fontSize: 9, fontFamily: "Arial", marginTop: 4, lineHeight: 1.4 }}>
              {stage.tagline}
            </div>
          </div>

          {/* Right panel: baseline (S0) | harvest fork (S4) | standard product */}
          {stage.value.isBaseline ? (
            <div style={{ flex: 1, overflowY: "auto" }}>

              {/* Total daily inputs at 60 TPH mill */}
              <div style={{ padding: "10px 12px", background: "#f5f5ee", borderBottom: "1px solid #ddd" }}>
                <div style={{ fontSize: 9, fontFamily: "Arial", fontWeight: "bold", color: "#3a2000",
                              textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>
                  Daily Feedstock Volume — 60 TPH Mill (24/7)
                </div>
                {stage.value.streams.map((sv, si) => (
                  <div key={si} style={{ display: "flex", justifyContent: "space-between",
                    padding: "3px 6px", borderRadius: 3, marginBottom: 3,
                    background: sv.color + "18",
                    border: `1px solid ${sv.color}44` }}>
                    <span style={{ fontSize: 9, fontFamily: "Arial", fontWeight: "bold",
                      color: sv.color }}>{sv.name}</span>
                    <span style={{ fontSize: 9, fontFamily: "Arial", color: "#555" }}>
                      ~{sv.daily_wet} t/day wet
                    </span>
                  </div>
                ))}
              </div>

              {/* Per-stream nutrient tables */}
              {stage.value.streams.map((sv, si) => {
                return (
                  <div key={si} style={{ padding: "8px 12px", borderBottom: "1px solid #eee" }}>
                    <div style={{ fontSize: 9, fontFamily: "Arial", fontWeight: "bold",
                      color: sv.color, textTransform: "uppercase", letterSpacing: 0.5,
                      marginBottom: 4, display: "flex", justifyContent: "space-between" }}>
                      <span>{sv.name}</span>
                      <span style={{ color: "#888", fontWeight: "normal" }}>MC: {sv.mc}% wb</span>
                    </div>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 8.5, fontFamily: "Arial" }}>
                      <thead>
                        <tr style={{ background: "#f0f0f0" }}>
                          <th style={{ textAlign: "left", padding: "3px 4px", color: "#333", borderBottom: "1px solid #ddd" }}>Nutrient</th>
                          <th style={{ textAlign: "right", padding: "3px 4px", color: "#333", borderBottom: "1px solid #ddd" }}>kg/t wet</th>
                          <th style={{ textAlign: "right", padding: "3px 4px", color: "#333", borderBottom: "1px solid #ddd" }}>kg/t DM</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sv.nutrients.map((n, ni) => (
                          <tr key={ni} style={{ background: ni % 2 === 0 ? "#fff" : "#fafafa" }}>
                            <td style={{ padding: "3px 4px", color: "#222", borderBottom: "1px solid #f0f0f0", fontSize: 8 }}>{n.name}</td>
                            <td style={{ padding: "3px 4px", textAlign: "right", color: sv.color, fontWeight: "bold", borderBottom: "1px solid #f0f0f0" }}>{n.kgPerTWet.toFixed(2)}</td>
                            <td style={{ padding: "3px 4px", textAlign: "right", color: "#555", borderBottom: "1px solid #f0f0f0" }}>{n.kgPerTDM.toFixed(1)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })}

              {/* Soil × AG Management Value Matrix */}
              {stage.value.soilMatrix && (
                <div style={{ padding: "10px 12px", borderBottom: "1px solid #eee" }}>
                  <div style={{ fontSize: 9, fontFamily: "Arial", fontWeight: "bold", color: "#1a3560",
                    textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>
                    CFI Product Value by Soil × AG Management — $/t DM
                  </div>

                  {/* Tier legend */}
                  <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                    {[
                      { tier: "VGAM",   color: "#22c55e", label: "VGAM" },
                      { tier: "Normal", color: "#14b8a6", label: "Normal" },
                      { tier: "Poor",   color: "#ef4444", label: "Poor" },
                    ].map(t => (
                      <div key={t.tier} style={{ display: "flex", alignItems: "center", gap: 3 }}>
                        <div style={{ width: 10, height: 10, borderRadius: 2, background: t.color }} />
                        <span style={{ fontSize: 8, fontFamily: "Arial", color: "#555" }}>{t.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Grid: soil rows × tier columns */}
                  {/* Header row */}
                  <div style={{ display: "grid", gridTemplateColumns: "auto 1fr 1fr 1fr 1fr", gap: 0,
                    background: "#f0f0f0", borderRadius: "3px 3px 0 0", border: "1px solid #ddd",
                    borderBottom: "none" }}>
                    {["Soil", "N loss", "VGAM", "Normal", "Poor"].map((h, i) => (
                      <div key={i} style={{ padding: "4px 6px", fontSize: 8, fontFamily: "Arial",
                        fontWeight: "bold", color: "#333",
                        textAlign: i === 0 ? "left" : "center",
                        borderRight: i < 4 ? "1px solid #ddd" : "none" }}>
                        {h}
                      </div>
                    ))}
                  </div>

                  {/* Soil rows */}
                  {stage.value.soilMatrix.map((soil, si) => {
                    const maxVal = Math.max(...Object.values(soil.tiers));
                    return (
                      <div key={si} style={{ display: "grid", gridTemplateColumns: "auto 1fr 1fr 1fr 1fr",
                        background: si % 2 === 0 ? "#fff" : "#fafafa",
                        border: "1px solid #ddd", borderTop: "none",
                        borderRadius: si === stage.value.soilMatrix.length - 1 ? "0 0 3px 3px" : 0 }}>

                        {/* Soil name */}
                        <div style={{ padding: "5px 6px", borderRight: "1px solid #ddd" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                            <div style={{ width: 6, height: 6, borderRadius: "50%", background: soil.color, flexShrink: 0 }} />
                            <div>
                              <div style={{ fontSize: 8.5, fontFamily: "Arial", fontWeight: "bold",
                                color: "#222", whiteSpace: "nowrap" }}>{soil.name}</div>
                              <div style={{ fontSize: 7.5, color: "#888", fontFamily: "Arial" }}>{soil.pct} of estates</div>
                            </div>
                          </div>
                        </div>

                        {/* N loss */}
                        <div style={{ padding: "5px 6px", textAlign: "center", borderRight: "1px solid #ddd",
                          display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <span style={{ fontSize: 8, fontFamily: "Arial", color: "#b00020",
                            fontWeight: "bold" }}>{soil.nLoss}</span>
                        </div>

                        {/* VGAM / Normal / Poor cells */}
                        {["VGAM", "Normal", "Poor"].map((tier, ti) => {
                          const val = soil.tiers[tier];
                          const tierColors = { VGAM: "#22c55e", Normal: "#14b8a6", Poor: "#ef4444" };
                          const bgOpacity = val === maxVal ? "25" : "10";
                          return (
                            <div key={tier} style={{
                              padding: "4px 5px", textAlign: "center",
                              borderRight: ti < 2 ? "1px solid #ddd" : "none",
                              background: val === maxVal ? tierColors[tier] + "22" : "transparent",
                              display: "flex", flexDirection: "column", alignItems: "center",
                              justifyContent: "center"
                            }}>
                              <div style={{ fontSize: 9.5, fontWeight: "bold", fontFamily: "Arial",
                                color: val === maxVal ? tierColors[tier] : "#333" }}>
                                ${val}
                              </div>
                              <div style={{ fontSize: 7, color: "#888", fontFamily: "Arial" }}>
                                {soil.pMult[tier]}× P
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}

                  {/* Pitch note per selected soil — static callouts for the two primary targets */}
                  <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
                    {stage.value.soilMatrix.filter(s => s.primary).map((soil, si) => (
                      <div key={si} style={{ padding: "5px 8px", borderRadius: 3,
                        background: soil.color + "15", border: `1px solid ${soil.color}44`,
                        fontSize: 8, fontFamily: "Arial", color: "#333", lineHeight: 1.5 }}>
                        <span style={{ fontWeight: "bold", color: soil.color }}>{soil.name}: </span>
                        {soil.pitch}
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: 6, fontSize: 7.5, fontFamily: "Arial", color: "#999",
                    fontStyle: "italic" }}>
                    Value basis: N leach-avoided + P fixation-bypassed (soil-specific) + K replacement. Source: CFI_Soil_Calculator_v3. Price basis: Urea $350/t · TSP $550/t · MOP $400/t.
                  </div>
                </div>
              )}
              <div style={{ margin: "8px 12px 12px", padding: "8px 10px",
                background: "#fff3cd", border: "1px solid #f59e0b",
                borderRadius: 4, fontSize: 8.5, fontFamily: "Arial", lineHeight: 1.6 }}>
                <div style={{ fontWeight: "bold", color: "#92400e", marginBottom: 4 }}>⚠ ACTIVE GUARDRAILS AT S0</div>
                <div>• <strong>POME C:N</strong> = confirmed DATA GAP (Mar 2026)</div>
                <div>• <strong>POME Fe</strong> 3–8k mg/kg DM — submit CFI-LAB-POME-001 Pkg A to unlock full inclusion</div>
                <div>• <strong>Feedipedia POME EE 29.2%</strong> — REJECTED. Use 10% DM canonical value only</div>
                <div>• Streams are NOT blended at S0 — blend occurs at S3+ only after independent S1+S2</div>
              </div>

              {/* Quality badges */}
              <div style={{ padding: "8px 12px", borderTop: "1px solid #eee", display: "flex", flexWrap: "wrap", gap: 5 }}>
                {stage.value.badges.map((b, i) => (
                  <div key={i} style={{
                    background: b.color, color: "white", padding: "4px 8px",
                    borderRadius: 3, fontSize: 9, fontFamily: "Arial", lineHeight: 1.4,
                  }}>
                    <div style={{ fontSize: 8, opacity: 0.8 }}>{b.label}</div>
                    <div style={{ fontWeight: "bold" }}>{b.val}</div>
                  </div>
                ))}
              </div>

            </div>

          ) : stage.value.isHarvestFork ? (
            // ── S4 Harvest Fork Panel ──
            <div style={{ flex: 1, overflowY: "auto" }}>

              {/* Fork header */}
              <div style={{ background: "#1a0040", padding: "10px 12px", borderBottom: "1px solid #4c1d95" }}>
                <div style={{ fontSize: 9, fontFamily: "Arial", fontWeight: "bold", color: "#c4b5fd",
                  textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>
                  ⚡ HARVEST DECISION FORK — D14 PREPUPAE
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                  {[stage.value.productA, stage.value.productB].map((p, pi) => (
                    <div key={pi} style={{ background: p.color, padding: "8px 10px", borderRadius: 4 }}>
                      <div style={{ fontSize: 8, color: "rgba(255,255,255,0.7)", fontFamily: "Arial", marginBottom: 2 }}>
                        {pi === 0 ? "OPTION A — Extract Larvae" : "OPTION B — Terminate In-Sub ★"}
                      </div>
                      <div style={{ fontSize: 9, color: "#fff", fontFamily: "Arial", fontWeight: "bold", lineHeight: 1.3, marginBottom: 4 }}>
                        {p.name}
                      </div>
                      <div style={{ fontSize: 18, color: "#fde68a", fontFamily: "Arial", fontWeight: "bold" }}>
                        ${p.value}
                      </div>
                      <div style={{ fontSize: 8, color: "rgba(255,255,255,0.7)", fontFamily: "Arial" }}>
                        /t DM · {p.mc}% MC delivery
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 8, background: "#4c1d95", padding: "6px 10px", borderRadius: 3,
                  display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 9, fontFamily: "Arial", color: "#fde68a", fontWeight: "bold" }}>
                    S5B premium over S5A substrate:
                  </span>
                  <span style={{ fontSize: 16, fontFamily: "Arial", fontWeight: "bold", color: "#fde68a" }}>
                    +${stage.value.delta.toFixed(2)}/t DM
                  </span>
                </div>
              </div>

              {/* Key metrics at D14 */}
              <div style={{ padding: "10px 12px", borderBottom: "1px solid #eee" }}>
                <div style={{ fontSize: 9, fontFamily: "Arial", fontWeight: "bold", color: "#2d0060",
                  textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>
                  Substrate Metrics at D14
                </div>
                {stage.value.keyMetrics.map((m, mi) => (
                  <div key={mi} style={{ display: "flex", justifyContent: "space-between",
                    padding: "3px 0", borderBottom: "1px solid #f0eeff" }}>
                    <span style={{ fontSize: 8.5, fontFamily: "Arial", color: "#555" }}>{m.label}</span>
                    <div style={{ textAlign: "right" }}>
                      <span style={{ fontSize: 9, fontFamily: "Arial", fontWeight: "bold", color: "#2d0060" }}>{m.val}</span>
                      <span style={{ fontSize: 7.5, color: "#999", fontFamily: "Arial", marginLeft: 4 }}>{m.note}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Soil × S5A vs S5B value matrix */}
              <div style={{ padding: "10px 12px", borderBottom: "1px solid #eee" }}>
                <div style={{ fontSize: 9, fontFamily: "Arial", fontWeight: "bold", color: "#2d0060",
                  textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>
                  Product Value by Soil — S5A vs S5B ($/t DM · Normal mgmt)
                </div>
                {stage.value.soilMatrix.map((soil, si) => (
                  <div key={si} style={{ display: "flex", alignItems: "center", gap: 6,
                    padding: "4px 0", borderBottom: "1px solid #f0eeff" }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: soil.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 8.5, fontFamily: "Arial", color: "#333", flex: 1 }}>{soil.name}</span>
                    <span style={{ fontSize: 8.5, fontFamily: "Arial", color: "#1a5530", fontWeight: "bold", width: 36, textAlign: "right" }}>
                      ${soil.s5a.Normal}
                    </span>
                    <span style={{ fontSize: 8, color: "#888", fontFamily: "Arial" }}>→</span>
                    <span style={{ fontSize: 8.5, fontFamily: "Arial", color: "#6b2a00", fontWeight: "bold", width: 36, textAlign: "right" }}>
                      ${soil.s5b.Normal}
                    </span>
                    <span style={{ fontSize: 7.5, fontFamily: "Arial", color: "#c47d00", width: 30, textAlign: "right" }}>
                      +${soil.s5b.Normal - soil.s5a.Normal}
                    </span>
                  </div>
                ))}
                <div style={{ fontSize: 7.5, color: "#888", fontFamily: "Arial", marginTop: 4, fontStyle: "italic" }}>
                  S5A / S5B · Normal management. S5B = S4 D14 end state — no extraction required.
                </div>
              </div>

              {/* Badges */}
              <div style={{ padding: "8px 12px", display: "flex", flexWrap: "wrap", gap: 5 }}>
                {stage.value.badges.map((b, bi) => (
                  <div key={bi} style={{ background: b.color, color: "white", padding: "4px 8px",
                    borderRadius: 3, fontSize: 9, fontFamily: "Arial", lineHeight: 1.4 }}>
                    <div style={{ fontSize: 8, opacity: 0.8 }}>{b.label}</div>
                    <div style={{ fontWeight: "bold" }}>{b.val}</div>
                  </div>
                ))}
              </div>

              <div style={{ margin: "0 12px 12px", padding: "6px 8px", background: "#faf5ff",
                border: "1px solid #c4b5fd", borderRadius: 3, fontSize: 8, fontFamily: "Arial",
                color: "#5b21b6", lineHeight: 1.5, fontStyle: "italic" }}>
                {stage.value.note}
              </div>
            </div>

          ) : (
            // ── Standard product value panel (S2, S3, S5A, S5B) ──
            <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>

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
          )}
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



// ======================================================================
// FILE: src/CFI_SoilAcidity_Lookup.jsx
// SIZE: 13653 chars / 290 lines
// ======================================================================

import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

// ─── DESIGN SYSTEM v3 ─────────────────────────────────────────────
const ds = {
  bg:        "#060C14",
  bgInput:   "#1A3A5C",
  bgInfo:    "#153352",
  border:    "1.5px solid #1E6B8C",
  amber:     "#F5A623",
  teal:      "#00C9B1",
  green:     "#A8E6C1",
  white:     "#FFFFFF",
  muted:     "#8BA5BE",
  red:       "#FF6B6B",
};

// Acidity class metadata
const CLASS_META = {
  1: { label: "Excessively Acid",   range: "<4.0",     lime: true,  palm: "Critical",  color: "#CC0000" },
  2: { label: "Extremely Acid",     range: "4.0–4.5",  lime: true,  palm: "Poor",      color: "#E05000" },
  3: { label: "Very Strongly Acid", range: "4.6–5.0",  lime: true,  palm: "Marginal",  color: "#E08000" },
  4: { label: "Strongly Acid",      range: "5.0–5.5",  lime: false, palm: "Suitable",  color: "#C8A000" },
  5: { label: "Moderately Acid",    range: "5.6–6.0",  lime: false, palm: "Good",      color: "#8CC000" },
  6: { label: "Slightly Acid",      range: "6.1–6.5",  lime: false, palm: "Optimal",   color: "#00A040" },
  7: { label: "Neutral",            range: "6.6–7.3",  lime: false, palm: "Optimal",   color: "#00C060" },
  8: { label: "Slightly Alkaline",  range: "7.4–7.8",  lime: false, palm: "Monitor",   color: "#0060A0" },
};

// CFI frass application modifiers by acidity class
const CFI_MODIFIERS = {
  1: { n_mult: 1.6, p_mult: 2.0, k_mult: 1.2, frass_rate: "High (8–12 t/ha/yr)", lime_rec: "3–5 t/ha dolomite" },
  2: { n_mult: 1.4, p_mult: 1.7, k_mult: 1.1, frass_rate: "High (6–10 t/ha/yr)", lime_rec: "2–4 t/ha dolomite" },
  3: { n_mult: 1.2, p_mult: 1.4, k_mult: 1.0, frass_rate: "Medium-High (5–8 t/ha/yr)", lime_rec: "1–2 t/ha dolomite" },
  4: { n_mult: 1.1, p_mult: 1.2, k_mult: 1.0, frass_rate: "Medium (4–6 t/ha/yr)", lime_rec: "Monitor only" },
  5: { n_mult: 1.0, p_mult: 1.0, k_mult: 1.0, frass_rate: "Standard (3–5 t/ha/yr)", lime_rec: "None required" },
  6: { n_mult: 0.9, p_mult: 0.9, k_mult: 1.0, frass_rate: "Standard (3–4 t/ha/yr)", lime_rec: "None required" },
  7: { n_mult: 0.9, p_mult: 0.9, k_mult: 1.0, frass_rate: "Standard (3–4 t/ha/yr)", lime_rec: "None required" },
  8: { n_mult: 0.9, p_mult: 0.8, k_mult: 1.0, frass_rate: "Low (2–3 t/ha/yr)", lime_rec: "Sulphur amendment possible" },
};

function SectionTitle({ letter, title }) {
  return (
    <div style={{ borderBottom: ds.border, paddingBottom: 8, marginBottom: 16 }}>
      <span style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 18, color: ds.teal }}>
        Section {letter}: {title}
      </span>
    </div>
  );
}

function InfoRow({ label, value, highlight }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
      borderBottom: `1px solid #1E3A5C`, padding: "6px 0" }}>
      <span style={{ fontFamily: "DM Sans", fontSize: 13, color: ds.muted }}>{label}</span>
      <span style={{ fontFamily: "DM Mono", fontSize: 14, color: highlight || ds.white, fontWeight: 600 }}>
        {value}
      </span>
    </div>
  );
}

export default function CFI_SoilAcidity_Lookup() {
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [millName, setMillName] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);

  const lookup = useCallback(async () => {
    const latN = parseFloat(lat);
    const lonN = parseFloat(lon);
    if (isNaN(latN) || isNaN(lonN)) { setError("Enter valid lat/lon."); return; }
    if (latN < -9.2 || latN > 4.5 || lonN < 108.5 || lonN > 141.1) {
      setError("Coordinates outside Indonesia coverage.");
      return;
    }
    setLoading(true); setError(null); setResult(null); setSaved(false);
    try {
      const { data, error: fnErr } = await supabase.rpc("get_soil_acidity_class", {
        p_lat: latN,
        p_lon: lonN,
        p_max_distance_km: 25,
      });
      if (fnErr) throw fnErr;
      if (!data || data.length === 0) {
        setError("No data within 25km. Location may be outside raster coverage.");
      } else {
        setResult(data[0]);
      }
    } catch (e) {
      setError(e.message || "Lookup failed.");
    }
    setLoading(false);
  }, [lat, lon]);

  const saveToMill = useCallback(async () => {
    if (!result || !millName) return;
    const { error: insertErr } = await supabase
      .from("cfi_mill_soil_acidity")
      .upsert({
        mill_name: millName,
        mill_lat: parseFloat(lat),
        mill_lon: parseFloat(lon),
        acidity_class: result.acidity_class,
        lookup_distance_km: result.distance_km,
      }, { onConflict: "mill_name" });
    if (!insertErr) setSaved(true);
  }, [result, millName, lat, lon]);

  const cls = result ? CLASS_META[result.acidity_class] : null;
  const mod = result ? CFI_MODIFIERS[result.acidity_class] : null;

  return (
    <div style={{ background: ds.bg, minHeight: "100vh", padding: 24, fontFamily: "DM Sans" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 22, color: ds.white }}>
            Soil Acidity Lookup
          </div>
          <div style={{ color: ds.muted, fontSize: 13, marginTop: 4 }}>
            IFPRI/HarvestChoice · Indonesia · 5km grid · 8 pH classes
          </div>
        </div>

        {/* Section A: Inputs */}
        <div style={{ background: ds.bgInput, border: ds.border, borderRadius: 8,
          padding: 20, marginBottom: 16 }}>
          <SectionTitle letter="A" title="Mill Location" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            <div>
              <div style={{ color: ds.teal, fontSize: 12, fontFamily: "DM Sans", marginBottom: 4 }}>
                Latitude (°N / °S negative)
              </div>
              <input
                value={lat}
                onChange={e => setLat(e.target.value)}
                placeholder="-6.5950 (Bogor)"
                style={{ width: "100%", background: ds.bg, border: ds.border, borderRadius: 4,
                  color: ds.white, fontFamily: "DM Mono", fontSize: 14, padding: "8px 10px",
                  boxSizing: "border-box" }}
              />
            </div>
            <div>
              <div style={{ color: ds.teal, fontSize: 12, fontFamily: "DM Sans", marginBottom: 4 }}>
                Longitude (°E)
              </div>
              <input
                value={lon}
                onChange={e => setLon(e.target.value)}
                placeholder="106.8167 (Bogor)"
                style={{ width: "100%", background: ds.bg, border: ds.border, borderRadius: 4,
                  color: ds.white, fontFamily: "DM Mono", fontSize: 14, padding: "8px 10px",
                  boxSizing: "border-box" }}
              />
            </div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ color: ds.teal, fontSize: 12, fontFamily: "DM Sans", marginBottom: 4 }}>
              Mill Name (optional — to save result)
            </div>
            <input
              value={millName}
              onChange={e => setMillName(e.target.value)}
              placeholder="e.g. Bogor Mill #1"
              style={{ width: "100%", background: ds.bg, border: ds.border, borderRadius: 4,
                color: ds.white, fontFamily: "DM Sans", fontSize: 14, padding: "8px 10px",
                boxSizing: "border-box" }}
            />
          </div>
          <button
            onClick={lookup}
            disabled={loading}
            style={{ background: ds.teal, color: "#000", fontFamily: "DM Sans", fontWeight: 700,
              fontSize: 14, border: "none", borderRadius: 6, padding: "10px 24px", cursor: "pointer" }}
          >
            {loading ? "Looking Up..." : "Lookup Soil Acidity"}
          </button>
          {error && (
            <div style={{ marginTop: 10, color: ds.red, fontFamily: "DM Mono", fontSize: 13 }}>
              ⚠ {error}
            </div>
          )}
        </div>

        {/* Section B: Result */}
        {result && cls && (
          <div style={{ background: ds.bgInfo, border: ds.border, borderRadius: 8, padding: 20, marginBottom: 16 }}>
            <SectionTitle letter="B" title="Soil Acidity Classification" />

            {/* Class badge */}
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20,
              padding: "14px 16px", background: ds.bg, borderRadius: 6, border: ds.border }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: cls.color,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "DM Mono", fontWeight: 700, fontSize: 20, color: "#fff", flexShrink: 0 }}>
                {result.acidity_class}
              </div>
              <div>
                <div style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 18, color: ds.amber }}>
                  {cls.label}
                </div>
                <div style={{ fontFamily: "DM Mono", fontSize: 14, color: ds.white }}>
                  pH {cls.range} · Palm Suitability: {cls.palm}
                </div>
              </div>
            </div>

            <InfoRow label="pH Range" value={cls.range} />
            <InfoRow label="pH Midpoint" value={result.ph_midpoint} highlight={ds.amber} />
            <InfoRow label="Nearest Grid Point" value={`${result.distance_km} km`} />
            <InfoRow label="Liming Required" value={cls.lime ? "YES" : "No"} highlight={cls.lime ? ds.red : ds.green} />
            <InfoRow label="Palm Suitability" value={cls.palm} highlight={["Optimal","Good"].includes(cls.palm) ? ds.green : ds.amber} />

            <div style={{ marginTop: 12, padding: "10px 14px", background: ds.bg, borderRadius: 6,
              borderLeft: `3px solid ${ds.teal}` }}>
              <div style={{ fontFamily: "DM Sans", fontSize: 13, color: ds.muted, marginBottom: 4 }}>
                CFI Note
              </div>
              <div style={{ fontFamily: "DM Sans", fontSize: 13, color: ds.white }}>
                {result.cfi_note}
              </div>
            </div>
          </div>
        )}

        {/* Section C: CFI Application Modifiers */}
        {result && mod && (
          <div style={{ background: ds.bgInfo, border: ds.border, borderRadius: 8, padding: 20, marginBottom: 16 }}>
            <SectionTitle letter="C" title="CFI Frass Application Modifiers" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
              {[
                { label: "N Multiplier", val: `×${mod.n_mult.toFixed(1)}`, color: mod.n_mult > 1 ? ds.amber : ds.green },
                { label: "P Multiplier", val: `×${mod.p_mult.toFixed(1)}`, color: mod.p_mult > 1 ? ds.amber : ds.green },
                { label: "K Multiplier", val: `×${mod.k_mult.toFixed(1)}`, color: mod.k_mult > 1 ? ds.amber : ds.green },
              ].map(({ label, val, color }) => (
                <div key={label} style={{ background: ds.bg, border: ds.border, borderRadius: 6,
                  padding: "12px 14px", textAlign: "center" }}>
                  <div style={{ fontFamily: "DM Sans", fontSize: 12, color: ds.muted, marginBottom: 6 }}>{label}</div>
                  <div style={{ fontFamily: "DM Mono", fontSize: 22, fontWeight: 700, color }}>{val}</div>
                </div>
              ))}
            </div>
            <InfoRow label="Recommended Frass Rate" value={mod.frass_rate} highlight={ds.amber} />
            <InfoRow label="Lime Recommendation" value={mod.lime_rec} highlight={cls.lime ? ds.red : ds.muted} />

            {cls.lime && (
              <div style={{ marginTop: 12, padding: "10px 14px", background: "#1A0A00", borderRadius: 6,
                border: "1.5px solid #F5A623" }}>
                <div style={{ fontFamily: "DM Sans", fontWeight: 700, color: ds.amber, fontSize: 13 }}>
                  ⚠ PKSA INTERACTION NOTE
                </div>
                <div style={{ fontFamily: "DM Sans", fontSize: 13, color: ds.white, marginTop: 4 }}>
                  PKSA alkaline pre-treatment (pH 10–12) partially offsets soil acidity in application zone. 
                  Still recommend dolomite at field level per {mod.lime_rec}.
                </div>
              </div>
            )}
          </div>
        )}

        {/* Section D: Save to Mill Registry */}
        {result && millName && (
          <div style={{ background: ds.bgInput, border: ds.border, borderRadius: 8, padding: 20 }}>
            <SectionTitle letter="D" title="Save To Mill Registry" />
            <button
              onClick={saveToMill}
              disabled={saved}
              style={{ background: saved ? "#1A5C3A" : ds.amber, color: "#000", fontFamily: "DM Sans",
                fontWeight: 700, fontSize: 14, border: "none", borderRadius: 6,
                padding: "10px 24px", cursor: saved ? "default" : "pointer" }}
            >
              {saved ? "✓ Saved to cfi_mill_soil_acidity" : `Save: ${millName}`}
            </button>
            <div style={{ marginTop: 10, color: ds.muted, fontSize: 12, fontFamily: "DM Sans" }}>
              Saved records are auto-loaded in S0 Mill Configuration when mill name matches.
            </div>
          </div>
        )}

      </div>
    </div>
  );
}



// ======================================================================
// FILE: src/CFI_SoilBio_Viz_v3.jsx
// SIZE: 82436 chars / 1182 lines
// ======================================================================

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


