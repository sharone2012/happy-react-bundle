import { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { runCalc } from '../store/slices/calcSlice';

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
  const dispatch = useDispatch();
  const C_      = useSelector(function(s) { return s.calc.results['npk-value'] || { comTot:0, smTot:0, comHa:0, smHa:0, soilsTable:[], streams:[], soil:{name:'',id:'ultisol'}, rawComVal:0, rawSmVal:0, pipelineEff:0, ffbDay:0, rawN:0, rawP:0, rawK:0, annN:0, annP:0, annK:0 }; });
  const loading = useSelector(function(s) { return s.calc.loading['npk-value'] || false; });
  useEffect(() => {
    dispatch(runCalc({ name:'npk-value', body:{ mill, estate, rec } }));
  }, [mill, estate, rec, dispatch]);

  const maxSm = Math.max(0, ...C_.soilsTable.map(r=>r.sm));

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

      {loading&&<div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",marginBottom:8}}><div style={{width:18,height:18,borderRadius:"50%",border:"3px solid "+C.teal+"44",borderTopColor:C.teal,animation:"cfi-spin 0.7s linear infinite"}}/><span style={{color:C.muted,fontSize:12}}>Calculating…</span></div>}

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
