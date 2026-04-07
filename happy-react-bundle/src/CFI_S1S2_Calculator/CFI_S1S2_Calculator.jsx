import { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { runCalc } from '../store/slices/calcSlice';

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

  const dispatch = useDispatch();
  const r       = useSelector(function(s) { return s.calc.results['s1s2'] || { ffbTpd:0, efb:{}, opdc:{}, pome:{}, blend:{tpd:0,tph:0,efbPct:0,loadEach:0,utilEach:0,limeKgDay:0}, capex:{} }; });
  const loading = useSelector(function(s) { return s.calc.loading['s1s2'] || false; });
  useEffect(() => {
    dispatch(runCalc({ name:'s1s2', body:{ ffbTph, opsH, efbRatio, opdcRatio, pomeTpd, inclPome, efbMc, opdcMc, pomeMc, pressMc, bayCap, efbBatch, opdcBatch, cycleMin, pressRate, blendRate, pksaDose, limeDose, bufferH } }));
  }, [ffbTph, opsH, efbRatio, opdcRatio, pomeTpd, inclPome, efbMc, opdcMc, pomeMc, pressMc, bayCap, efbBatch, opdcBatch, cycleMin, pressRate, blendRate, pksaDose, limeDose, bufferH, dispatch]);

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

            {loading&&<div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",marginBottom:8}}><div style={{width:18,height:18,borderRadius:"50%",border:"3px solid "+C.teal+"44",borderTopColor:C.teal,animation:"cfi-spin 0.7s linear infinite"}}/><span style={{color:C.grey,fontSize:12}}>Calculating…</span></div>}

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
