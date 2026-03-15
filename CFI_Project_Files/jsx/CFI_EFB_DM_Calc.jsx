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
