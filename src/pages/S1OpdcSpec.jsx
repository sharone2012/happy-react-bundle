import { useNavigate } from "react-router-dom";

const C = {
  navy: '#060C14', navyMid: '#0A1628', navyCard: '#111E33', navyField: '#142030',
  teal: '#40D7C5', tealDim: 'rgba(64,215,197,0.12)', tealBdr: 'rgba(64,215,197,0.60)',
  amber: '#F5A623', amberDim: 'rgba(245,166,35,0.14)',
  green: '#00A249', greenDim: 'rgba(0,162,73,0.13)',
  red: '#E84040', redDim: 'rgba(232,64,64,0.13)',
  grey: '#A8BDD0', greyLt: 'rgba(168,189,208,0.75)', white: '#E8F0FE',
  bdrIdle: 'rgba(255,255,255,0.06)', bdrCalc: 'rgba(139,160,180,0.18)',
};
const Fnt = {
  syne: "'Syne', sans-serif", dm: "'DM Sans', sans-serif",
  mono: "'DM Mono', monospace", brand: "'EB Garamond', serif",
};

export default function S1OpdcSpec() {
  const navigate = useNavigate();

  const equipment = [
    { tag: "RH-OPDC-101", name: "Receiving Hopper (anti-bridging)", capacity: "5 t/h", power: "0.75", elevation: "+1.0m", dims: "10 m³", material: "SS304, anti-bridging auger", status: "Spec'd" },
    { tag: "CV-OPDC-101", name: "Incline Belt Conveyor", capacity: "5 t/h", power: "1.1", elevation: "+1.0→+3.5m", dims: "12m × 500mm", material: "Enclosed belt", status: "Spec'd" },
    { tag: "OPR-01", name: "Screw Press — CLASS A GATE", capacity: "5 t/h", power: "7.5", elevation: "+3.5m", dims: "—", material: "MC 72%→45%, CLASS A MC≥40% LOCKED", status: "RFQ Pending" },
    { tag: "OLB-01", name: "Lump Breaker", capacity: "5 t/h", power: "3", elevation: "+3.0m", dims: "—", material: "Twin-roll, 30mm output", status: "RFQ Pending" },
    { tag: "CV-OPDC-201", name: "Belt Conveyor 2", capacity: "5 t/h", power: "—", elevation: "+3.0→+1.5m", dims: "8m × 500mm", material: "Decline belt", status: "Spec'd" },
    { tag: "OTR-01", name: "Trommel Screen", capacity: "5 t/h", power: "2.2", elevation: "+1.5m", dims: "1.8m dia × 4m", material: "25mm aperture, oversize→waste skip", status: "Spec'd" },
    { tag: "ODR-01", name: "Rotary Dryer", capacity: "5 t/h", power: "11", elevation: "+1.0m", dims: "—", material: "Co-current, 30min residence, MC≤35% target", status: "RFQ Pending" },
    { tag: "OHM-01", name: "Hammer Mill", capacity: "5 t/h", power: "22", elevation: "+0.8m", dims: "—", material: "6mm screen, 1500 RPM, SPRING ISOLATION ONLY", status: "RFQ Pending" },
    { tag: "OVS-01", name: "Vibrating Screen", capacity: "5 t/h", power: "2.2", elevation: "+0.5m", dims: "—", material: "3mm single deck, reject→OHM-01 re-mill", status: "Spec'd" },
    { tag: "BIN-OPDC-301", name: "Product Bin — 24HR DWELL", capacity: "20 m³", power: "—", elevation: "+0.3m", dims: "—", material: "Sealed, moisture-controlled, dwell≥24hrs, pH 8.0-9.0", status: "Spec'd" },
  ];

  const totalPower = equipment.reduce((s, e) => s + (parseFloat(e.power) || 0), 0);

  return (
    <div style={{ fontFamily: Fnt.dm, color: C.white, background: C.navy, minHeight: '100vh' }}>
      {/* ═══ S0 HEADER ═══ */}
      <div style={{ background:C.navyMid, display:'flex', alignItems:'center', padding:'0 28px', height:80, gap:18, position:'sticky', top:0, zIndex:100 }}>
        <div style={{ display:'flex', alignItems:'center', flexShrink:0, maxWidth:340 }}>
          <div>
            <div style={{ display:'flex', alignItems:'baseline' }}>
              <span style={{ fontFamily:Fnt.brand, fontWeight:700, fontSize:26, color:'#FFF', letterSpacing:'0.02em' }}>CFI</span>
              <span style={{ fontFamily:Fnt.brand, fontSize:22, color:'rgba(255,255,255,0.25)', margin:'0 8px' }}>·</span>
              <span style={{ fontFamily:Fnt.brand, fontWeight:700, fontSize:20, color:C.teal, letterSpacing:'0.10em' }}>DEEP TECH</span>
            </div>
            <div style={{ fontSize:11, color:C.teal, marginTop:4, fontFamily:Fnt.dm }}>Soil Microbiome Engineering &amp; Biofertiliser Production for Closed‑Loop Nutrient Recycling</div>
          </div>
        </div>
        <div style={{ display:'flex', gap:4, marginLeft:'auto', alignItems:'center', flexShrink:0 }}>
          {['S0','S1','S2','S3','S4','S5','S6','CAPEX','Σ'].map((s,i)=>(
            <div key={s} style={{ background:i===1?C.teal:'rgba(168,189,208,0.09)', border:`1px solid ${i===1?C.teal:'rgba(168,189,208,0.18)'}`, borderRadius:4, padding:'3px 9px', fontFamily:Fnt.mono, fontSize:11, fontWeight:700, color:i===1?C.navy:C.grey, cursor:'pointer' }}>{s}</div>
          ))}
        </div>
      </div>

      {/* ── Back to S1 Master ── */}
      <div style={{ background: C.navy, padding: "8px 32px" }}>
        <a href="/s1-index" style={{ color: C.teal, fontSize: 12, fontWeight: 600, textDecoration: "none", fontFamily: Fnt.dm }}
          onMouseEnter={e => e.currentTarget.style.opacity = 0.7}
          onMouseLeave={e => e.currentTarget.style.opacity = 1}>
          ← S1 Master Index
        </a>
      </div>

      {/* ═══ PAGE ═══ */}
      <div style={{ background: C.navy, display: "flex", justifyContent: "center", padding: "30px 0", minHeight: "calc(100vh - 80px)" }}>
        <div style={{ width: 1100, background: C.navyCard, border: `1px solid ${C.bdrCalc}`, borderRadius: 8, overflow: "hidden" }}>

          {/* Topbar — OPDC = amber accent */}
          <div style={{ background: C.amberDim, padding: "10px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid rgba(245,166,35,0.40)` }}>
            <span style={{ fontSize: 10, color: C.amber, fontWeight: 700, fontFamily: Fnt.mono }}>CFI S1B — OPDC LINE · ENGINEERING SPEC</span>
            <span style={{ fontSize: 10, color: C.grey, fontFamily: Fnt.mono }}>60 TPH FFB Mill · 5 t/h · 500mm belt · Bogor, West Java · March 2026</span>
          </div>

          {/* Hero */}
          <div style={{ background: C.navyMid, padding: "28px 30px", borderBottom: `1px solid ${C.bdrCalc}` }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: C.amber, fontFamily: Fnt.syne }}>OPDC Line — Engineering Specification</div>
            <div style={{ fontSize: 12, color: C.grey, marginTop: 4, fontFamily: Fnt.dm }}>Detailed equipment register extracted from S1B OPDC ASCII process flow diagram.</div>
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              {[
                { text: "S1B", bg: C.amberDim, border: "rgba(245,166,35,0.3)", color: C.amber },
                { text: "OPDC", bg: C.amberDim, border: "rgba(245,166,35,0.3)", color: C.amber },
                { text: "5 t/h", bg: C.amberDim, border: "rgba(245,166,35,0.3)", color: C.amber },
                { text: "10 units", bg: C.amberDim, border: "rgba(245,166,35,0.3)", color: C.amber },
                { text: `${totalPower} kW total`, bg: C.tealDim, border: C.tealBdr, color: C.teal },
              ].map((b, i) => (
                <span key={i} style={{ fontSize: 9, fontWeight: 700, padding: "3px 9px", borderRadius: 2, background: b.bg, border: `1px solid ${b.border}`, color: b.color, fontFamily: Fnt.mono }}>{b.text}</span>
              ))}
            </div>
          </div>

          {/* Equipment Table */}
          <div style={{ padding: "24px 30px" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.white, marginBottom: 12, fontFamily: Fnt.syne }}>Equipment Register — OPDC Line (10 Units)</div>
            <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
              <thead>
                <tr style={{ background: C.navyField, borderBottom: `2px solid ${C.bdrCalc}` }}>
                  {["Tag", "Equipment", "Capacity", "Power (kW)", "Elevation", "Dimensions", "Material / Notes", "Status"].map(h => (
                    <th key={h} style={{ padding: "8px 8px", textAlign: "left", fontWeight: 700, color: C.grey, whiteSpace: "nowrap", fontFamily: Fnt.mono, fontSize: 10 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {equipment.map((row, ri) => (
                  <tr key={ri} style={{ borderBottom: `1px solid ${C.bdrIdle}`, background: ri % 2 === 1 ? C.navyField : 'transparent' }}>
                    <td style={{ padding: "7px 8px", fontWeight: 700, color: C.amber, whiteSpace: "nowrap", fontFamily: Fnt.mono }}>{row.tag}</td>
                    <td style={{ padding: "7px 8px", color: C.white }}>{row.name}</td>
                    <td style={{ padding: "7px 8px", whiteSpace: "nowrap", color: C.white, fontFamily: Fnt.mono }}>{row.capacity}</td>
                    <td style={{ padding: "7px 8px", whiteSpace: "nowrap", color: C.teal, fontFamily: Fnt.mono }}>{row.power}</td>
                    <td style={{ padding: "7px 8px", whiteSpace: "nowrap", color: C.greyLt, fontFamily: Fnt.mono }}>{row.elevation}</td>
                    <td style={{ padding: "7px 8px", color: C.greyLt, fontFamily: Fnt.mono }}>{row.dims}</td>
                    <td style={{ padding: "7px 8px", fontSize: 10, color: C.grey }}>{row.material}</td>
                    <td style={{ padding: "7px 8px" }}>
                      <span style={{
                        fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 2, whiteSpace: "nowrap", fontFamily: Fnt.mono,
                        background: row.status === "Spec'd" ? C.tealDim : C.amberDim,
                        color: row.status === "Spec'd" ? C.teal : C.amber,
                      }}>{row.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>

          {/* Gates & Guardrails */}
          <div style={{ padding: "16px 30px", borderTop: `1px solid ${C.bdrCalc}` }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.white, marginBottom: 10, fontFamily: Fnt.syne }}>Gates &amp; Guardrails</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { label: "CLASS A GATE — OPR-01", desc: "MC floor ≥40% LOCKED — pore damage above 40% kills BSF colonisation, non-negotiable", color: C.red, bg: C.redDim },
                { label: "AMBER GATE — ODR-01", desc: "MC ≤35% target — operator confirms before hammer mill", color: C.amber, bg: C.amberDim },
                { label: "24HR DWELL GATE — BIN-OPDC-301", desc: "Dwell ≥24hrs, pH 8.0-9.0 required before S2 transfer", color: C.amber, bg: C.amberDim },
                { label: "NOISE ZONE", desc: "82+ dBA — Hearing protection + dust mask mandatory (nodes 8-9)", color: C.red, bg: C.redDim },
              ].map((g, i) => (
                <div key={i} style={{ background: g.bg, border: `1px solid ${C.bdrCalc}`, borderRadius: 4, padding: "10px 12px" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: g.color, fontFamily: Fnt.mono }}>{g.label}</div>
                  <div style={{ fontSize: 10, color: C.grey, marginTop: 3 }}>{g.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div style={{ padding: "16px 30px", background: C.navyMid, borderTop: `1px solid ${C.bdrCalc}` }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.grey, marginBottom: 8, fontFamily: Fnt.syne }}>Line Summary</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10 }}>
              {[
                { label: "Total Installed Power", value: `${totalPower} kW` },
                { label: "Belt Width", value: "500 mm" },
                { label: "Throughput", value: "5 t/h" },
                { label: "S2 Handoff", value: "≤35% MC, D90≤3mm, pH 8-9" },
              ].map((s, i) => (
                <div key={i} style={{ border: `1px solid ${C.bdrCalc}`, borderRadius: 3, padding: "8px 10px", background: C.navyField }}>
                  <div style={{ fontSize: 10, color: C.grey, fontFamily: Fnt.dm }}>{s.label}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.white, marginTop: 2, fontFamily: Fnt.mono }}>{s.value}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
