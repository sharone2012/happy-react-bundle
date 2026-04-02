import { useNavigate } from "react-router-dom";

const C = {
  navy: '#060C14', navyMid: '#0A1628', navyCard: '#111E33', navyField: '#142030',
  teal: '#40D7C5', tealDim: 'rgba(64,215,197,0.12)', tealBdr: 'rgba(64,215,197,0.60)',
  amber: '#F5A623', amberDim: 'rgba(245,166,35,0.14)',
  green: '#00A249', greenDim: 'rgba(0,162,73,0.13)',
  red: '#E84040', redDim: 'rgba(232,64,64,0.13)',
  blue: '#4A9EDB', blueDim: 'rgba(74,158,219,0.12)', blueBdr: 'rgba(74,158,219,0.50)',
  grey: '#A8BDD0', greyLt: 'rgba(168,189,208,0.75)', white: '#E8F0FE',
  bdrIdle: 'rgba(255,255,255,0.06)', bdrCalc: 'rgba(139,160,180,0.18)',
};
const Fnt = {
  syne: "'Syne', sans-serif", dm: "'DM Sans', sans-serif",
  mono: "'DM Mono', monospace", brand: "'EB Garamond', serif",
};

export default function S1PosSpec() {
  const navigate = useNavigate();

  const equipment = [
    { tag: "POS-PIT-01", name: "Sludge Receiver Hopper", capacity: "15 m³", power: "—", elevation: "+0.8–1.0m", dims: "3.5m×2.5m×2.0m", material: "Reinforced concrete, epoxy-coated, 60° sloped walls, 150mm drain", status: "Spec'd" },
    { tag: "PMP-POS-01", name: "Progressive Cavity Pump", capacity: "1.5 t/h", power: "0.75", elevation: "—", dims: "DN100 pipe", material: "VFD-driven", status: "Spec'd" },
    { tag: "T-SLD-101", name: "Sludge Buffer Tank", capacity: "5-8 m³", power: "3.7", elevation: "0.0m", dims: "Ø2.2m × 1.8-2.2m", material: "SS304, sealed dome, vent→biofilter, top-entry agitator", status: "Spec'd" },
    { tag: "SCR-POS-01", name: "Rotary Drum Screen", capacity: "1.5 t/h", power: "1.5", elevation: "+0.5m", dims: "—", material: "SS316L drum, 2mm aperture, reject→EFB line", status: "Spec'd" },
    { tag: "ICP-POS-01", name: "ICP-OES Fe Checkpoint (BLUE GATE)", capacity: "—", power: "—", elevation: "—", dims: "—", material: "Fe thresholds: <3000→20% CaCO₃, 3000-5000→10-15%, 5000-8000→5-10%, >8000→review", status: "RFQ Pending" },
    { tag: "MIX-POS-01", name: "Conditioning Mixer", capacity: "500L batch", power: "2.2", elevation: "+0.3m", dims: "—", material: "SS304, paddle mixer, CaCO₃ dosing, pH 4.4→5.5-6.0, 15-20min", status: "RFQ Pending" },
    { tag: "FP-POS-01", name: "Chamber Filter Press", capacity: "1.5 t/h", power: "15", elevation: "0.0m", dims: "630mm×630mm plates", material: "25 chambers, MC 82%→65-70%, 45-60min cycle, filtrate→POME", status: "RFQ Pending" },
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

          {/* Topbar — POS = blue accent */}
          <div style={{ background: C.blueDim, padding: "10px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${C.blueBdr}` }}>
            <span style={{ fontSize: 10, color: C.blue, fontWeight: 700, fontFamily: Fnt.mono }}>CFI S1A — POS LINE · ENGINEERING SPEC</span>
            <span style={{ fontSize: 10, color: C.grey, fontFamily: Fnt.mono }}>60 TPH FFB Mill · 30 t/day · 1.5 t/h · Bogor, West Java · March 2026</span>
          </div>

          {/* Hero */}
          <div style={{ background: C.navyMid, padding: "28px 30px", borderBottom: `1px solid ${C.bdrCalc}` }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: C.blue, fontFamily: Fnt.syne }}>POS Line — Engineering Specification</div>
            <div style={{ fontSize: 12, color: C.grey, marginTop: 4, fontFamily: Fnt.dm }}>Detailed equipment register extracted from S1A POS ASCII process flow diagram.</div>
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              {[
                { text: "S1A", bg: C.blueDim, border: C.blueBdr, color: C.blue },
                { text: "POS", bg: C.blueDim, border: C.blueBdr, color: C.blue },
                { text: "30 t/day", bg: C.blueDim, border: C.blueBdr, color: C.blue },
                { text: "7 units", bg: C.blueDim, border: C.blueBdr, color: C.blue },
                { text: `${totalPower} kW total`, bg: C.amberDim, border: "rgba(245,166,35,0.3)", color: C.amber },
              ].map((b, i) => (
                <span key={i} style={{ fontSize: 9, fontWeight: 700, padding: "3px 9px", borderRadius: 2, background: b.bg, border: `1px solid ${b.border}`, color: b.color, fontFamily: Fnt.mono }}>{b.text}</span>
              ))}
            </div>
          </div>

          {/* Equipment Table */}
          <div style={{ padding: "24px 30px" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.white, marginBottom: 12, fontFamily: Fnt.syne }}>Equipment Register — POS Line (7 Units)</div>
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
                    <td style={{ padding: "7px 8px", fontWeight: 700, color: C.blue, whiteSpace: "nowrap", fontFamily: Fnt.mono }}>{row.tag}</td>
                    <td style={{ padding: "7px 8px", color: C.white }}>{row.name}</td>
                    <td style={{ padding: "7px 8px", whiteSpace: "nowrap", color: C.white, fontFamily: Fnt.mono }}>{row.capacity}</td>
                    <td style={{ padding: "7px 8px", whiteSpace: "nowrap", color: C.amber, fontFamily: Fnt.mono }}>{row.power}</td>
                    <td style={{ padding: "7px 8px", whiteSpace: "nowrap", color: C.greyLt, fontFamily: Fnt.mono }}>{row.elevation}</td>
                    <td style={{ padding: "7px 8px", color: C.greyLt, fontFamily: Fnt.mono }}>{row.dims}</td>
                    <td style={{ padding: "7px 8px", fontSize: 10, color: C.grey }}>{row.material}</td>
                    <td style={{ padding: "7px 8px" }}>
                      <span style={{
                        fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 2, whiteSpace: "nowrap", fontFamily: Fnt.mono,
                        background: row.status === "Spec'd" ? C.blueDim : C.amberDim,
                        color: row.status === "Spec'd" ? C.blue : C.amber,
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
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>
              {[
                { label: "ICP-OES Fe CHECKPOINT (BLUE GATE)", desc: "Fe <3,000→CaCO₃ 20% w/w | Fe 3,000-5,000→10-15% | Fe 5,000-8,000→5-10% | Fe >8,000→protocol review", color: C.blue, bg: C.blueDim },
                { label: "Fe TARGET", desc: "Fe <3,000 mg/kg DM — required for safe composting and BSF substrate use", color: C.blue, bg: C.blueDim },
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
                { label: "Fe Threshold", value: "<3,000 mg/kg DM" },
                { label: "Throughput", value: "30 t/day (1.5 t/h)" },
                { label: "Filter Press MC", value: "82%→65-70%" },
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
