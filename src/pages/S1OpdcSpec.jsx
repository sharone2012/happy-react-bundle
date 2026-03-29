import { useNavigate } from "react-router-dom";

const F = "'DM Sans', sans-serif";
const FH = "'EB Garamond', serif";

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
          <div style={{ background: "#2A1800", padding: "10px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 10, color: "#F5A623", fontWeight: 700 }}>CFI S1B — OPDC LINE · ENGINEERING SPEC</span>
            <span style={{ fontSize: 10, color: "#8BA0B4" }}>60 TPH FFB Mill · 5 t/h · 500mm belt · Bogor, West Java · March 2026</span>
          </div>

          {/* Hero */}
          <div style={{ background: "#060C14", padding: "28px 30px", borderBottom: "3px solid #111" }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#F5A623" }}>OPDC Line — Engineering Specification</div>
            <div style={{ fontSize: 12, color: "#8BA0B4", marginTop: 4 }}>Detailed equipment register extracted from S1B OPDC ASCII process flow diagram.</div>
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              {[
                { text: "S1B", bg: "rgba(245,166,35,.12)", border: "rgba(245,166,35,.3)", color: "#F5A623" },
                { text: "OPDC", bg: "rgba(245,166,35,.12)", border: "rgba(245,166,35,.3)", color: "#F5A623" },
                { text: "5 t/h", bg: "rgba(245,166,35,.12)", border: "rgba(245,166,35,.3)", color: "#F5A623" },
                { text: "10 units", bg: "rgba(245,166,35,.12)", border: "rgba(245,166,35,.3)", color: "#F5A623" },
                { text: `${totalPower} kW total`, bg: "rgba(64,215,197,.12)", border: "rgba(64,215,197,.3)", color: "#40D7C5" },
              ].map((b, i) => (
                <span key={i} style={{ fontSize: 9, fontWeight: 700, padding: "3px 9px", borderRadius: 2, background: b.bg, border: `1px solid ${b.border}`, color: b.color }}>{b.text}</span>
              ))}
            </div>
          </div>

          {/* Equipment Table */}
          <div style={{ padding: "24px 30px" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#111", marginBottom: 12 }}>Equipment Register — OPDC Line (10 Units)</div>
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
                    <td style={{ padding: "7px 8px", fontWeight: 700, color: "#2A1800", whiteSpace: "nowrap" }}>{row.tag}</td>
                    <td style={{ padding: "7px 8px" }}>{row.name}</td>
                    <td style={{ padding: "7px 8px", whiteSpace: "nowrap" }}>{row.capacity}</td>
                    <td style={{ padding: "7px 8px", whiteSpace: "nowrap" }}>{row.power}</td>
                    <td style={{ padding: "7px 8px", whiteSpace: "nowrap" }}>{row.elevation}</td>
                    <td style={{ padding: "7px 8px" }}>{row.dims}</td>
                    <td style={{ padding: "7px 8px", fontSize: 10, color: "#555" }}>{row.material}</td>
                    <td style={{ padding: "7px 8px" }}>
                      <span style={{
                        fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 2, whiteSpace: "nowrap",
                        background: row.status === "Spec'd" ? "rgba(64,215,197,.12)" : "rgba(245,166,35,.12)",
                        color: row.status === "Spec'd" ? "#40D7C5" : "#F5A623",
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
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { label: "CLASS A GATE — OPR-01", desc: "MC floor ≥40% LOCKED — pore damage above 40% kills BSF colonisation, non-negotiable", color: "#8b0000", bg: "rgba(204,34,34,.08)" },
                { label: "AMBER GATE — ODR-01", desc: "MC ≤35% target — operator confirms before hammer mill", color: "#7a4800", bg: "rgba(200,134,10,.08)" },
                { label: "24HR DWELL GATE — BIN-OPDC-301", desc: "Dwell ≥24hrs, pH 8.0-9.0 required before S2 transfer", color: "#7a4800", bg: "rgba(200,134,10,.08)" },
                { label: "NOISE ZONE", desc: "82+ dBA — Hearing protection + dust mask mandatory (nodes 8-9)", color: "#cc2222", bg: "rgba(204,34,34,.06)" },
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
                { label: "Belt Width", value: "500 mm" },
                { label: "Throughput", value: "5 t/h" },
                { label: "S2 Handoff", value: "≤35% MC, D90≤3mm, pH 8-9" },
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
