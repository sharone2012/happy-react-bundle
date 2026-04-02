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

export default function S1EfbSpec() {
  const navigate = useNavigate();

  const equipment = [
    { tag: "RH-EFB-101", name: "Hydraulic Reciprocating Feeder", capacity: "20 t/h", power: "7.5", elevation: "±0.0m", dims: "—", material: "Carbon steel, VFD, anti-bridging", status: "Spec'd" },
    { tag: "CV-EFB-101", name: "Incline Apron Conveyor", capacity: "20 t/h", power: "7.5", elevation: "±0.0→+3.0m", dims: "15m × 600mm", material: "15-20° inclination, rubber-lined chute", status: "Spec'd" },
    { tag: "ETR-01", name: "Trommel Screen", capacity: "20 t/h", power: "11", elevation: "+3.0m", dims: "Pad 8m×3m×0.4m", material: "Rubber isolators ×4 corners", status: "Spec'd" },
    { tag: "OBM-01", name: "Overband Magnet", capacity: "20 t/h", power: "3", elevation: "+3.5m", dims: "3m×2m", material: "Suspended, ferrous removal", status: "Spec'd" },
    { tag: "EPR-01", name: "Screw Press", capacity: "20 t/h", power: "37", elevation: "+3.2m", dims: "Pad 3m×2m×0.5m", material: "M24×8 anchors, 600mm embedment", status: "RFQ Pending" },
    { tag: "ESD-01", name: "Primary Shredder", capacity: "20 t/h", power: "37", elevation: "+4.0m", dims: "Pad 4m×3m×0.6m", material: "M30×8 anchors, 800mm embedment, 50-100mm output", status: "RFQ Pending" },
    { tag: "EHM-01", name: "Hammer Mill", capacity: "15 t/h (derated)", power: "37", elevation: "+4.0m", dims: "Pad 3m×2.5m×0.6m", material: "SPRING ISOLATION ONLY, D90≤2mm target", status: "RFQ Pending" },
    { tag: "EVS-01", name: "Vibrating Screen", capacity: "15 t/h", power: "7.5", elevation: "+4.0m", dims: "Pad 2m×2m×0.3m", material: "2mm aperture, flexible mount", status: "Spec'd" },
    { tag: "EDC-01", name: "Baghouse Dust Filter", capacity: "3,000 m³/hr", power: "15", elevation: "Outside", dims: "—", material: "99% capture, carbon steel", status: "RFQ Pending" },
    { tag: "BIN-EFB-201", name: "Buffer Bin — EFB", capacity: "50 m³", power: "3", elevation: "+2.5m", dims: "—", material: "Live-bottom auger, 4-6hr buffer", status: "Spec'd" },
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

          {/* Topbar — EFB = teal accent */}
          <div style={{ background: C.tealDim, padding: "10px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${C.tealBdr}` }}>
            <span style={{ fontSize: 10, color: C.teal, fontWeight: 700, fontFamily: Fnt.mono }}>CFI S1C — EFB LINE · ENGINEERING SPEC</span>
            <span style={{ fontSize: 10, color: C.grey, fontFamily: Fnt.mono }}>60 TPH FFB Mill · 20 t/h · 600mm belt · Bogor, West Java · March 2026</span>
          </div>

          {/* Hero */}
          <div style={{ background: C.navyMid, padding: "28px 30px", borderBottom: `1px solid ${C.bdrCalc}` }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: C.teal, fontFamily: Fnt.syne }}>EFB Line — Engineering Specification</div>
            <div style={{ fontSize: 12, color: C.grey, marginTop: 4, fontFamily: Fnt.dm }}>Detailed equipment register extracted from S1C EFB ASCII process flow diagram.</div>
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              {[
                { text: "S1C", bg: C.tealDim, border: C.tealBdr, color: C.teal },
                { text: "EFB", bg: C.tealDim, border: C.tealBdr, color: C.teal },
                { text: "20 t/h", bg: C.tealDim, border: C.tealBdr, color: C.teal },
                { text: "10 units", bg: C.tealDim, border: C.tealBdr, color: C.teal },
                { text: `${totalPower} kW total`, bg: C.amberDim, border: "rgba(245,166,35,0.3)", color: C.amber },
              ].map((b, i) => (
                <span key={i} style={{ fontSize: 9, fontWeight: 700, padding: "3px 9px", borderRadius: 2, background: b.bg, border: `1px solid ${b.border}`, color: b.color, fontFamily: Fnt.mono }}>{b.text}</span>
              ))}
            </div>
          </div>

          {/* Equipment Table */}
          <div style={{ padding: "24px 30px" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.white, marginBottom: 12, fontFamily: Fnt.syne }}>Equipment Register — EFB Line (10 Units)</div>
            <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
              <thead>
                <tr style={{ background: C.navyField, borderBottom: `2px solid ${C.bdrCalc}` }}>
                  {["Tag", "Equipment", "Capacity", "Power (kW)", "Elevation", "Dimensions / Pad", "Material / Notes", "Status"].map(h => (
                    <th key={h} style={{ padding: "8px 8px", textAlign: "left", fontWeight: 700, color: C.grey, whiteSpace: "nowrap", fontFamily: Fnt.mono, fontSize: 10 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {equipment.map((row, ri) => (
                  <tr key={ri} style={{ borderBottom: `1px solid ${C.bdrIdle}`, background: ri % 2 === 1 ? C.navyField : 'transparent' }}>
                    <td style={{ padding: "7px 8px", fontWeight: 700, color: C.teal, whiteSpace: "nowrap", fontFamily: Fnt.mono }}>{row.tag}</td>
                    <td style={{ padding: "7px 8px", color: C.white }}>{row.name}</td>
                    <td style={{ padding: "7px 8px", whiteSpace: "nowrap", color: C.white, fontFamily: Fnt.mono }}>{row.capacity}</td>
                    <td style={{ padding: "7px 8px", whiteSpace: "nowrap", color: C.amber, fontFamily: Fnt.mono }}>{row.power}</td>
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
                { label: "GATE B.G2 — EPR-01", desc: "Amber Gate: Operator confirms MC ≤50% before shredder", color: C.amber, bg: C.amberDim },
                { label: "GATE B.G1 — EHM-01", desc: "Red Gate: Shift sieve confirms D90 ≤2mm before S2 transfer", color: C.red, bg: C.redDim },
                { label: "NOISE ZONE", desc: "85+ dBA — Hearing protection + dust mask mandatory (nodes 6-8)", color: C.red, bg: C.redDim },
                { label: "SPRING ISOLATION", desc: "EHM-01 hammer mill: spring mounts only, never rigid-anchor to slab", color: C.red, bg: C.redDim },
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
                { label: "Belt Width", value: "600 mm" },
                { label: "Throughput", value: "20 t/h (15 t/h derated at HM)" },
                { label: "DM Target", value: "D90 ≤2mm, MC 45-50%" },
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
