import { useNavigate } from "react-router-dom";

const F = "'DM Sans', sans-serif";
const FH = "'EB Garamond', serif";

export default function S1OpdcSpec() {
  const navigate = useNavigate();

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
        <div style={{ width: 1000, background: "#FFFFFF", border: "3px solid #111", overflow: "hidden" }}>

          {/* Topbar */}
          <div style={{ background: "#2A1800", padding: "10px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 10, color: "#F5A623", fontWeight: 700 }}>CFI S1B — OPDC LINE . ENGINEERING SPEC</span>
            <span style={{ fontSize: 10, color: "#8BA0B4" }}>60 TPH FFB Mill · 5 t/h · 500mm belt · Bogor, West Java · March 2026</span>
          </div>

          {/* Hero */}
          <div style={{ background: "#060C14", padding: "28px 30px", borderBottom: "3px solid #111" }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#F5A623" }}>OPDC Line — Engineering Specification</div>
            <div style={{ fontSize: 12, color: "#8BA0B4", marginTop: 4 }}>Detailed equipment specs, datasheets, and mechanical drawings for the S1B OPDC pre-processing line.</div>
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              {[
                { text: "S1B", bg: "rgba(245,166,35,.12)", border: "rgba(245,166,35,.3)", color: "#F5A623" },
                { text: "OPDC", bg: "rgba(245,166,35,.12)", border: "rgba(245,166,35,.3)", color: "#F5A623" },
                { text: "5 t/h", bg: "rgba(245,166,35,.12)", border: "rgba(245,166,35,.3)", color: "#F5A623" },
                { text: "DRAFT", bg: "rgba(245,166,35,.12)", border: "rgba(245,166,35,.3)", color: "#F5A623" },
              ].map((b, i) => (
                <span key={i} style={{ fontSize: 9, fontWeight: 700, padding: "3px 9px", borderRadius: 2, background: b.bg, border: `1px solid ${b.border}`, color: b.color }}>{b.text}</span>
              ))}
            </div>
          </div>

          {/* Equipment Table */}
          <div style={{ padding: "24px 30px" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#111", marginBottom: 12 }}>Equipment Register — OPDC Line</div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
              <thead>
                <tr style={{ background: "#f5f5f5", borderBottom: "2px solid #ddd" }}>
                  {["Tag", "Equipment", "Capacity", "Power (kW)", "Supplier Status"].map(h => (
                    <th key={h} style={{ padding: "8px 10px", textAlign: "left", fontWeight: 700, color: "#555" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["ORC-01", "Receiving Hopper", "5 t/h", "—", "Spec'd"],
                  ["OLB-01", "Lump Breaker", "5 t/h", "15", "RFQ Pending"],
                  ["OSC-01", "Screw Conveyor", "5 t/h", "4.0", "Spec'd"],
                  ["OPR-01", "CLASS A Gate (MC≥40%)", "5 t/h", "—", "Spec'd"],
                  ["BIN-OPDC-301", "24hr Dwell Bin", "20 m³", "—", "Spec'd"],
                  ["OBC-01", "Belt Conveyor (500mm)", "5 t/h", "3.7", "Spec'd"],
                  ["OBC-02", "Transfer Conveyor", "5 t/h", "3.0", "Spec'd"],
                  ["ODR-01", "Rotary Dryer", "5 t/h", "45", "RFQ Pending"],
                  ["OHM-01", "Hammer Mill", "5 t/h", "55", "RFQ Pending"],
                  ["ODS-01", "Discharge Bin (15m³)", "15 m³", "—", "Spec'd"],
                ].map((row, ri) => (
                  <tr key={ri} style={{ borderBottom: "1px solid #eee", background: ri % 2 === 1 ? "#fafafa" : "#fff" }}>
                    <td style={{ padding: "7px 10px", fontWeight: 700, color: "#2A1800" }}>{row[0]}</td>
                    <td style={{ padding: "7px 10px" }}>{row[1]}</td>
                    <td style={{ padding: "7px 10px" }}>{row[2]}</td>
                    <td style={{ padding: "7px 10px" }}>{row[3]}</td>
                    <td style={{ padding: "7px 10px" }}>
                      <span style={{
                        fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 2,
                        background: row[4] === "Spec'd" ? "rgba(64,215,197,.12)" : "rgba(245,166,35,.12)",
                        color: row[4] === "Spec'd" ? "#40D7C5" : "#F5A623",
                      }}>{row[4]}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div style={{ padding: "16px 30px", background: "#fafafa", borderTop: "1px solid #eee" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#555", marginBottom: 8 }}>Line Summary</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10 }}>
              {[
                { label: "Total Installed Power", value: "125.7 kW" },
                { label: "Belt Width", value: "500 mm" },
                { label: "Throughput", value: "5 t/h" },
                { label: "CLASS A Gate", value: "MC ≥40%" },
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
