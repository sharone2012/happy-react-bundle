import { useNavigate } from "react-router-dom";

const F = "'DM Sans', sans-serif";
const FH = "'EB Garamond', serif";

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
    <div style={{ fontFamily: F, color: "#111" }}>
      {/* ═══ PERSISTENT CFI GLOBAL HEADER ═══ */}
      <div style={{
        height: 83, background: "#0A1628",
        borderBottom: "1px solid rgba(51, 212, 188, 0.075)",
        display: "flex", alignItems: "center", padding: "0 32px",
        position: "sticky", top: 0, zIndex: 301,
      }}>
        <span style={{ fontFamily: FH, fontSize: 26, fontWeight: 700, color: "#FFFFFF", letterSpacing: "0.06em" }}>CFI</span>
        <span style={{ fontFamily: FH, fontSize: 26, fontWeight: 700, color: "#33D4BC", letterSpacing: "0.06em", marginLeft: 10 }}>Deep Tech</span>
        <div style={{ width: 3, height: 44, background: "#33D4BC", margin: "0 20px 0 14px" }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" }}>
            <span style={{ color: "#FFFFFF", minWidth: 150, display: "inline-block" }}>Precision Engineering</span>
            <span style={{ color: "#33D4BC" }}>Circular Nutrient Recovery in Agricultural Systems</span>
          </div>
          <div style={{ fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" }}>
            <span style={{ color: "#FFFFFF", minWidth: 150, display: "inline-block" }}>Applied Biology</span>
            <span style={{ color: "#33D4BC" }}>Rebalancing Soil&apos;s Microbiome &amp; Reducing Synthetic Fertiliser Use</span>
          </div>
        </div>
      </div>

      {/* ── Back to S1 Master ── */}
      <div style={{ background: "#060C14", padding: "8px 32px" }}>
        <a href="/s1-index" style={{ color: "#33D4BC", fontSize: 12, fontWeight: 600, textDecoration: "none", fontFamily: F }}
          onMouseEnter={e => e.currentTarget.style.opacity = 0.7}
          onMouseLeave={e => e.currentTarget.style.opacity = 1}>
          ← S1 Master Index
        </a>
      </div>

      {/* ═══ PAGE ═══ */}
      <div style={{ background: "#e0e0e0", display: "flex", justifyContent: "center", padding: "30px 0", minHeight: "calc(100vh - 83px)" }}>
        <div style={{ width: 1100, background: "#FFFFFF", border: "3px solid #111", overflow: "hidden" }}>

          {/* Topbar */}
          <div style={{ background: "#0B1422", padding: "10px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 10, color: "#4A9EDB", fontWeight: 700 }}>CFI S1A — POS LINE · ENGINEERING SPEC</span>
            <span style={{ fontSize: 10, color: "#8BA0B4" }}>60 TPH FFB Mill · 30 t/day · 1.5 t/h · Bogor, West Java · March 2026</span>
          </div>

          {/* Hero */}
          <div style={{ background: "#060C14", padding: "28px 30px", borderBottom: "3px solid #111" }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#4A9EDB" }}>POS Line — Engineering Specification</div>
            <div style={{ fontSize: 12, color: "#8BA0B4", marginTop: 4 }}>Detailed equipment register extracted from S1A POS ASCII process flow diagram.</div>
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              {[
                { text: "S1A", bg: "rgba(74,158,219,.12)", border: "rgba(74,158,219,.3)", color: "#4A9EDB" },
                { text: "POS", bg: "rgba(74,158,219,.12)", border: "rgba(74,158,219,.3)", color: "#4A9EDB" },
                { text: "30 t/day", bg: "rgba(74,158,219,.12)", border: "rgba(74,158,219,.3)", color: "#4A9EDB" },
                { text: "7 units", bg: "rgba(74,158,219,.12)", border: "rgba(74,158,219,.3)", color: "#4A9EDB" },
                { text: `${totalPower} kW total`, bg: "rgba(245,166,35,.12)", border: "rgba(245,166,35,.3)", color: "#F5A623" },
              ].map((b, i) => (
                <span key={i} style={{ fontSize: 9, fontWeight: 700, padding: "3px 9px", borderRadius: 2, background: b.bg, border: `1px solid ${b.border}`, color: b.color }}>{b.text}</span>
              ))}
            </div>
          </div>

          {/* Equipment Table */}
          <div style={{ padding: "24px 30px" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#111", marginBottom: 12 }}>Equipment Register — POS Line (7 Units)</div>
            <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
              <thead>
                <tr style={{ background: "#f5f5f5", borderBottom: "2px solid #ddd" }}>
                  {["Tag", "Equipment", "Capacity", "Power (kW)", "Elevation", "Dimensions", "Material / Notes", "Status"].map(h => (
                    <th key={h} style={{ padding: "8px 8px", textAlign: "left", fontWeight: 700, color: "#555", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {equipment.map((row, ri) => (
                  <tr key={ri} style={{ borderBottom: "1px solid #eee", background: ri % 2 === 1 ? "#fafafa" : "#fff" }}>
                    <td style={{ padding: "7px 8px", fontWeight: 700, color: "#0B1422", whiteSpace: "nowrap" }}>{row.tag}</td>
                    <td style={{ padding: "7px 8px" }}>{row.name}</td>
                    <td style={{ padding: "7px 8px", whiteSpace: "nowrap" }}>{row.capacity}</td>
                    <td style={{ padding: "7px 8px", whiteSpace: "nowrap" }}>{row.power}</td>
                    <td style={{ padding: "7px 8px", whiteSpace: "nowrap" }}>{row.elevation}</td>
                    <td style={{ padding: "7px 8px" }}>{row.dims}</td>
                    <td style={{ padding: "7px 8px", fontSize: 10, color: "#555" }}>{row.material}</td>
                    <td style={{ padding: "7px 8px" }}>
                      <span style={{
                        fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 2, whiteSpace: "nowrap",
                        background: row.status === "Spec'd" ? "rgba(74,158,219,.12)" : "rgba(245,166,35,.12)",
                        color: row.status === "Spec'd" ? "#4A9EDB" : "#F5A623",
                      }}>{row.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>

          {/* Gates & Guardrails */}
          <div style={{ padding: "16px 30px", borderTop: "1px solid #eee" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#111", marginBottom: 10 }}>Gates &amp; Guardrails</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>
              {[
                { label: "ICP-OES Fe CHECKPOINT (BLUE GATE)", desc: "Fe <3,000→CaCO₃ 20% w/w | Fe 3,000-5,000→10-15% | Fe 5,000-8,000→5-10% | Fe >8,000→protocol review", color: "#4A9EDB", bg: "rgba(74,158,219,.08)" },
                { label: "Fe TARGET", desc: "Fe <3,000 mg/kg DM — required for safe composting and BSF substrate use", color: "#4A9EDB", bg: "rgba(74,158,219,.06)" },
              ].map((g, i) => (
                <div key={i} style={{ background: g.bg, border: "1px solid #eee", borderRadius: 4, padding: "10px 12px" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: g.color }}>{g.label}</div>
                  <div style={{ fontSize: 10, color: "#555", marginTop: 3 }}>{g.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div style={{ padding: "16px 30px", background: "#fafafa", borderTop: "1px solid #eee" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#555", marginBottom: 8 }}>Line Summary</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10 }}>
              {[
                { label: "Total Installed Power", value: `${totalPower} kW` },
                { label: "Fe Threshold", value: "<3,000 mg/kg DM" },
                { label: "Throughput", value: "30 t/day (1.5 t/h)" },
                { label: "Filter Press MC", value: "82%→65-70%" },
              ].map((s, i) => (
                <div key={i} style={{ border: "1px solid #eee", borderRadius: 3, padding: "8px 10px", background: "#fff" }}>
                  <div style={{ fontSize: 10, color: "#888" }}>{s.label}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#111", marginTop: 2 }}>{s.value}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
