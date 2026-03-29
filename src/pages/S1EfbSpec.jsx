import { useNavigate } from "react-router-dom";

const F = "'DM Sans', sans-serif";
const FH = "'EB Garamond', serif";

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
          <div style={{ background: "#0B3A4A", padding: "10px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 10, color: "#40C8C0", fontWeight: 700 }}>CFI S1C — EFB LINE · ENGINEERING SPEC</span>
            <span style={{ fontSize: 10, color: "#8BA0B4" }}>60 TPH FFB Mill · 20 t/h · 600mm belt · Bogor, West Java · March 2026</span>
          </div>

          {/* Hero */}
          <div style={{ background: "#060C14", padding: "28px 30px", borderBottom: "3px solid #111" }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#40C8C0" }}>EFB Line — Engineering Specification</div>
            <div style={{ fontSize: 12, color: "#8BA0B4", marginTop: 4 }}>Detailed equipment register extracted from S1C EFB ASCII process flow diagram.</div>
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              {[
                { text: "S1C", bg: "rgba(64,215,197,.12)", border: "rgba(64,215,197,.3)", color: "#40D7C5" },
                { text: "EFB", bg: "rgba(64,215,197,.12)", border: "rgba(64,215,197,.3)", color: "#40D7C5" },
                { text: "20 t/h", bg: "rgba(64,215,197,.12)", border: "rgba(64,215,197,.3)", color: "#40D7C5" },
                { text: "10 units", bg: "rgba(64,215,197,.12)", border: "rgba(64,215,197,.3)", color: "#40D7C5" },
                { text: `${totalPower} kW total`, bg: "rgba(245,166,35,.12)", border: "rgba(245,166,35,.3)", color: "#F5A623" },
              ].map((b, i) => (
                <span key={i} style={{ fontSize: 9, fontWeight: 700, padding: "3px 9px", borderRadius: 2, background: b.bg, border: `1px solid ${b.border}`, color: b.color }}>{b.text}</span>
              ))}
            </div>
          </div>

          {/* Equipment Table */}
          <div style={{ padding: "24px 30px" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#111", marginBottom: 12 }}>Equipment Register — EFB Line (10 Units)</div>
            <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
              <thead>
                <tr style={{ background: "#f5f5f5", borderBottom: "2px solid #ddd" }}>
                  {["Tag", "Equipment", "Capacity", "Power (kW)", "Elevation", "Dimensions / Pad", "Material / Notes", "Status"].map(h => (
                    <th key={h} style={{ padding: "8px 8px", textAlign: "left", fontWeight: 700, color: "#555", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {equipment.map((row, ri) => (
                  <tr key={ri} style={{ borderBottom: "1px solid #eee", background: ri % 2 === 1 ? "#fafafa" : "#fff" }}>
                    <td style={{ padding: "7px 8px", fontWeight: 700, color: "#0B3A4A", whiteSpace: "nowrap" }}>{row.tag}</td>
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
                { label: "GATE B.G2 — EPR-01", desc: "Amber Gate: Operator confirms MC ≤50% before shredder", color: "#7a4800", bg: "rgba(200,134,10,.08)" },
                { label: "GATE B.G1 — EHM-01", desc: "Red Gate: Shift sieve confirms D90 ≤2mm before S2 transfer", color: "#8b0000", bg: "rgba(204,34,34,.08)" },
                { label: "NOISE ZONE", desc: "85+ dBA — Hearing protection + dust mask mandatory (nodes 6-8)", color: "#cc2222", bg: "rgba(204,34,34,.06)" },
                { label: "SPRING ISOLATION", desc: "EHM-01 hammer mill: spring mounts only, never rigid-anchor to slab", color: "#8b0000", bg: "rgba(204,34,34,.06)" },
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
                { label: "Belt Width", value: "600 mm" },
                { label: "Throughput", value: "20 t/h (15 t/h derated at HM)" },
                { label: "DM Target", value: "D90 ≤2mm, MC 45-50%" },
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
