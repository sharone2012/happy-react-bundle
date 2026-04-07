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
