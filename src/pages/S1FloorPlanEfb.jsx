import { useState } from "react";
import { useNavigate } from "react-router-dom";

const F = "'DM Sans', sans-serif";

/* ── Colour tokens (white/formal — matching S1 Engineering Complete) ── */
const T = {
  bg: "#FFFFFF",
  border: "#E2E6EC",
  borderD: "#CBD2DC",
  teal: "#00897B",
  tealL: "#E0F2F1",
  amber: "#E65100",
  amberL: "#FFF3E0",
  green: "#2E7D32",
  greenL: "#E8F5E9",
  red: "#C62828",
  redL: "#FFEBEE",
  navy: "#1A2332",
  grey: "#78909C",
  greyL: "#B0BEC5",
  text: "#263238",
  textL: "#546E7A",
};

/* ── Equipment node data (S1C EFB — 10 nodes, 298 kW) ── */
const NODES = [
  { id: 1, tag: "RCV-EFB-01", name: "Efb Receiving Hopper", specs: [["Type", "Steel hopper with hydraulic gate"], ["Volume", "50 m\u00b3 (~20 t capacity)"], ["Material", "Carbon steel + epoxy lining"], ["Slope", "60\u00b0 sidewalls"], ["Gate", "Hydraulic sliding gate 1200\u00d7800mm"], ["Discharge", "Bottom gravity feed to conveyor"]], footer: "To CVB-EFB-01 drag chain conveyor" },
  { id: 2, tag: "CVB-EFB-01", name: "Efb Drag Chain Conveyor", specs: [["Type", "Heavy-duty drag chain"], ["Length", "12 m"], ["Width", "600 mm"], ["Motor", "7.5 kW \u00b7 3-phase \u00b7 VFD"], ["Throughput", "20 t/h EFB (62.5% MC)"], ["Chain", "100mm pitch carbon steel"]], footer: "Elevates +2.5m to ESD-01 shredder feed" },
  { id: 3, tag: "ESD-01", name: "Efb Primary Shredder", specs: [["Type", "Twin-shaft low-speed shredder"], ["Motor", "2\u00d737 kW (74 kW total) \u00b7 VFD"], ["Throughput", "20 t/h @ 62.5% MC"], ["Shaft RPM", "15\u201325"], ["Blades", "30\u201340 per shaft"], ["Output", "~100\u2013150mm ribbons"]], footer: "Shredded EFB drops to CVB-EFB-02" },
  { id: 4, tag: "CVB-EFB-02", name: "Shredder Discharge Conveyor", specs: [["Type", "Belt conveyor with cleated belt"], ["Length", "8 m"], ["Width", "600 mm"], ["Motor", "3.7 kW \u00b7 3-phase"], ["Throughput", "20 t/h shredded EFB"], ["Incline", "15\u00b0 to trommel feed"]], footer: "Feeds ETR-EFB-01 trommel screen" },
  { id: 5, tag: "ETR-EFB-01", name: "Efb Trommel Screen", specs: [["Type", "Rotary trommel screen"], ["Diameter", "1500 mm"], ["Length", "4000 mm"], ["Motor", "5.5 kW \u00b7 geared drive"], ["Screen size", "50mm perforations"], ["Throughput", "20 t/h"]], footer: "Oversize recirculates to shredder \u00b7 undersize to press" },
  { id: 6, tag: "ESP-EFB-01", name: "Efb Screw Press", specs: [["Type", "Single-screw dewatering press"], ["Motor", "15 kW \u00b7 VFD"], ["Throughput", "20 t/h @ 62.5% MC in \u2192 ~55% MC out"], ["Pressure", "3\u20135 bar progressive"], ["Screen", "Wedge wire 0.5mm slot"], ["Filtrate", "To mill POME system"]], footer: "Pressed EFB to hammer mill" },
  { id: 7, tag: "EHM-EFB-01", name: "Efb Hammer Mill", specs: [["Type", "Hammer mill with 2mm screen"], ["Motor", "110 kW \u00b7 direct drive"], ["Throughput", "13 t/h (post-press, 55% MC)"], ["Hammer tips", "24 swing hammers"], ["Screen", "2mm perforated plate"], ["Speed", "1500 RPM"]], footer: "Noise zone \u2014 85+ dBA \u00b7 PPE required" },
  { id: 8, tag: "EVS-EFB-01", name: "Efb Vibrating Screen", specs: [["Type", "Single-deck vibrating screen"], ["Motor", "2.2 kW vibratory"], ["Screen size", "2mm mesh"], ["Throughput", "13 t/h milled EFB"], ["Oversize", "Return to hammer mill"], ["Undersize", "To buffer bin"]], footer: "Oversize return loop to EHM-EFB-01" },
  { id: 9, tag: "EDC-EFB-01", name: "Efb Baghouse Dust Collector", specs: [["Type", "Pulse-jet baghouse"], ["Air volume", "5000 m\u00b3/h"], ["Motor", "7.5 kW fan"], ["Filter area", "50 m\u00b2"], ["Emission", "<50 mg/Nm\u00b3"], ["Bags", "Polyester needle-felt"]], footer: "Serves hammer mill + vibrating screen zone" },
  { id: 10, tag: "BIN-EFB-201", name: "Efb Buffer Storage Bin", specs: [["Type", "Steel buffer bin with live-bottom"], ["Volume", "80 m\u00b3 (~32 t at 55% MC)"], ["Material", "Carbon steel + anti-bridging"], ["Discharge", "Twin-screw live-bottom feeder"], ["Motor", "2\u00d73.7 kW"], ["Capacity", "8-hour buffer"]], footer: "Feeds S2 Chemical Treatment at controlled rate" },
];

const BUILDING = { name: "Building A5 \u2014 Efb Processing Hall", width: "30m", length: "60m", height: "12m", area: "1,800 m\u00b2" };

const SUMMARY = [
  ["Throughput", "20 t/h @ 62.5% MC", "13 t/h @ 55% MC"],
  ["Source", "Mill EFB press discharge", "Milled fibre to S2"],
  ["Daily Input", "~300 t fresh", "~195 t milled"],
  ["Installed Power", "~298 kW total", ""],
];

const LEGEND = [
  "MC = Moisture Content (wet basis %)",
  "EFB = Empty Fruit Bunch (palm oil mill waste fibre)",
  "VFD = Variable Frequency Drive",
  "Oversize from vibrating screen returns to hammer mill \u2014 closed loop",
  "Noise zone = >85 dBA \u2014 mandatory hearing PPE",
];

/* ── Node card (white/formal) ── */
function NodeCard({ node }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      onClick={() => setExpanded(!expanded)}
      style={{
        background: T.bg,
        border: `1px solid ${expanded ? T.teal : T.border}`,
        borderLeft: `4px solid ${expanded ? T.teal : T.border}`,
        borderRadius: 6,
        padding: "14px 18px",
        marginBottom: 8,
        cursor: "pointer",
        transition: "all .15s",
        boxShadow: expanded ? "0 2px 8px rgba(0,137,123,.1)" : "0 1px 3px rgba(0,0,0,.04)",
      }}
    >
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{
          width: 30, height: 30, borderRadius: 6,
          background: T.teal, color: "#fff",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: F, fontSize: 11, fontWeight: 700, flexShrink: 0,
        }}>{node.id}</div>
        <div style={{ fontFamily: F, fontSize: 12, fontWeight: 700, color: T.amber, minWidth: 100 }}>{node.tag}</div>
        <div style={{ flex: 1, fontFamily: F, fontSize: 13, fontWeight: 600, color: T.navy }}>{node.name}</div>
        <span style={{ fontFamily: F, fontSize: 11, color: T.grey }}>{expanded ? "\u25b2" : "\u25bc"}</span>
      </div>

      {/* Spec grid */}
      {expanded && (
        <div style={{ marginTop: 12 }}>
          <div style={{
            display: "grid", gridTemplateColumns: "auto 1fr", gap: "6px 14px",
            background: "#F5F7FA", padding: 14, borderRadius: 6, fontSize: 12,
          }}>
            {node.specs.map(([label, value], i) => (
              <div key={i} style={{ display: "contents" }}>
                <span style={{ fontFamily: F, color: T.grey, fontWeight: 600, fontSize: 11 }}>{label}</span>
                <span style={{ fontFamily: F, fontWeight: 500, color: T.text }}>{value}</span>
              </div>
            ))}
          </div>
          <div style={{
            marginTop: 10, paddingTop: 8, borderTop: `1px solid ${T.border}`,
            fontFamily: F, fontSize: 11, color: T.textL,
          }}>{node.footer}</div>
        </div>
      )}
    </div>
  );
}

/* ── Building diagram (white variant) ── */
function BuildingDiagram() {
  return (
    <div style={{ margin: "24px 0", maxWidth: 500 }}>
      <div style={{ textAlign: "center", marginBottom: 8 }}>
        <div style={{ fontFamily: F, fontSize: 11, fontWeight: 600, color: T.teal }}>Width</div>
        <div style={{ height: 2, background: T.border, margin: "4px auto", maxWidth: 400, position: "relative" }}>
          <div style={{ position: "absolute", left: 0, top: -4, width: 2, height: 10, background: T.border }} />
          <div style={{ position: "absolute", right: 0, top: -4, width: 2, height: 10, background: T.border }} />
        </div>
        <div style={{ fontFamily: F, fontSize: 13, fontWeight: 700, color: T.teal }}>{BUILDING.width}</div>
      </div>
      <div style={{
        border: `2px solid ${T.teal}`, background: T.tealL,
        padding: 24, position: "relative", maxWidth: 400, margin: "0 auto",
      }}>
        <div style={{
          position: "absolute", right: -60, top: 0, bottom: 0,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{ width: 2, flex: 1, background: T.border, position: "relative" }}>
            <div style={{ position: "absolute", top: 0, left: -4, width: 10, height: 2, background: T.border }} />
            <div style={{ position: "absolute", bottom: 0, left: -4, width: 10, height: 2, background: T.border }} />
          </div>
          <div style={{ fontFamily: F, fontSize: 11, fontWeight: 600, color: T.teal, writingMode: "vertical-rl", transform: "rotate(180deg)", margin: "8px 0" }}>Height</div>
          <div style={{ fontFamily: F, fontSize: 13, fontWeight: 700, color: T.teal, writingMode: "vertical-rl", transform: "rotate(180deg)" }}>{BUILDING.height}</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: F, fontSize: 14, fontWeight: 700, color: T.navy, marginBottom: 4 }}>{BUILDING.name}</div>
          <div style={{ fontFamily: F, fontSize: 12, color: T.grey }}>S1 Mechanical Equipment Layout</div>
          <div style={{ fontFamily: F, fontSize: 12, color: T.grey, marginTop: 4 }}>Area: {BUILDING.area}</div>
        </div>
      </div>
    </div>
  );
}

/* ── Main page ── */
export default function S1FloorPlanEfb() {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: F, color: T.text, background: T.bg, minHeight: "100vh" }}>

      {/* ── Header ── */}
      <div style={{
        position: "sticky", top: 0, zIndex: 100, background: T.bg,
        borderBottom: `2px solid ${T.border}`, boxShadow: "0 2px 8px rgba(0,0,0,.06)",
      }}>
        <div style={{ padding: "16px 40px", display: "flex", alignItems: "center", gap: 16, borderBottom: `1px solid ${T.border}` }}>
          <div style={{ fontFamily: "'EB Garamond', serif", fontWeight: 700, fontSize: 26, color: T.navy, letterSpacing: "0.5px" }}>
            CFI <span style={{ color: T.teal }}>Deep Tech</span>
          </div>
          <div style={{ width: 2, height: 28, background: T.teal, borderRadius: 1 }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <span style={{ fontFamily: F, fontStyle: "italic", fontSize: 11, color: T.grey }}>Circular Fertiliser Industries</span>
            <span style={{ fontFamily: F, fontStyle: "italic", fontSize: 11, color: T.grey }}>60 TPH FFB Mill \u00b7 Bogor, West Java</span>
          </div>
          <div style={{ flex: 1 }} />
          <span style={{ fontFamily: F, fontSize: 11, color: T.grey }}>S1 Rev 02 \u00b7 March 2026</span>
        </div>
      </div>

      {/* ── Breadcrumb ── */}
      <div style={{
        background: T.bg, borderBottom: `1px solid ${T.border}`,
        padding: "8px 40px", display: "flex", alignItems: "center", gap: 8,
        fontSize: 11, fontFamily: F, color: T.grey,
      }}>
        <span style={{ color: T.teal, fontWeight: 700, cursor: "pointer" }} onClick={() => navigate("/")}>CFI Platform</span>
        <span style={{ color: T.greyL }}>\u203a</span>
        <span style={{ cursor: "pointer" }} onClick={() => navigate("/s1-capex-opex")}>S1 Pre-Processing</span>
        <span style={{ color: T.greyL }}>\u203a</span>
        <span style={{ color: T.teal, fontWeight: 700 }}>Efb Floor Plan</span>
      </div>

      {/* ── Residue nav tabs ── */}
      <div style={{ borderBottom: `1px solid ${T.border}`, padding: "0 40px", display: "flex", gap: 0, background: T.bg }}>
        {[
          { label: "Efb Line", path: "/s1-floor-efb", active: true },
          { label: "Opdc Line", path: "/s1-floor-opdc", active: false },
          { label: "Pos Line", path: "/s1-floor-pos", active: false },
          { label: "Combined View", path: "/s1-combined", active: false },
        ].map((t, i) => (
          <button key={i} onClick={() => navigate(t.path)} style={{
            fontFamily: F, fontSize: 12, fontWeight: 700, padding: "10px 20px",
            background: "transparent", border: "none", cursor: "pointer",
            color: t.active ? T.teal : T.grey,
            borderBottom: `2px solid ${t.active ? T.teal : "transparent"}`,
            transition: "all .15s",
          }}>{t.label}</button>
        ))}
      </div>

      {/* ── Title row (row 14) ── */}
      <div style={{
        padding: "20px 40px", display: "flex", alignItems: "center", gap: 12,
        borderBottom: `1px solid ${T.border}`,
      }}>
        <span style={{
          background: T.teal, color: "#fff", fontWeight: 700, fontSize: 12,
          padding: "4px 12px", borderRadius: 4, letterSpacing: ".08em",
        }}>S1c</span>
        <span style={{ fontFamily: F, fontWeight: 700, fontSize: 20, color: T.navy }}>
          Efb Line \u2014 Empty Fruit Bunch Processing
        </span>
        <span style={{ fontFamily: F, fontSize: 11, color: T.grey, marginLeft: "auto" }}>
          10 nodes \u00b7 298 kW \u00b7 Building A5
        </span>
      </div>

      {/* ── Ticker bar ── */}
      <div style={{
        borderBottom: `1px solid ${T.border}`, padding: "8px 40px",
        display: "flex", gap: 0, overflowX: "auto", background: T.bg,
      }}>
        {[
          { label: "Throughput In", val: "20 t/h", color: T.teal },
          { label: "Throughput Out", val: "13 t/h", color: T.teal },
          { label: "MC In", val: "62.5%", color: T.navy },
          { label: "MC Out", val: "55%", color: T.navy },
          { label: "Installed Power", val: "~298 kW", color: T.amber },
          { label: "Daily Input", val: "~300 t", color: T.green },
          { label: "Daily Output", val: "~195 t", color: T.green },
        ].map((k, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 8, padding: "0 20px",
            borderRight: i < 6 ? `1px solid ${T.border}` : "none", whiteSpace: "nowrap",
          }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: T.grey, textTransform: "uppercase", letterSpacing: ".06em" }}>{k.label}</span>
            <span style={{ fontFamily: F, fontSize: 14, fontWeight: 700, color: k.color }}>{k.val}</span>
          </div>
        ))}
      </div>

      {/* ── Content ── */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 40px 60px" }}>

        {/* Equipment nodes */}
        <div style={{
          fontFamily: F, fontSize: 14, fontWeight: 700, color: T.navy,
          textTransform: "uppercase", letterSpacing: ".06em",
          marginBottom: 14, paddingBottom: 8, borderBottom: `2px solid ${T.teal}`,
        }}>Equipment Nodes</div>

        {NODES.map((node) => (
          <NodeCard key={node.id} node={node} />
        ))}

        {/* Building dimensions */}
        <div style={{
          fontFamily: F, fontSize: 14, fontWeight: 700, color: T.navy,
          textTransform: "uppercase", letterSpacing: ".06em",
          marginTop: 32, marginBottom: 14, paddingBottom: 8, borderBottom: `2px solid ${T.teal}`,
        }}>Building Dimensions</div>
        <BuildingDiagram />

        {/* Summary table */}
        <div style={{
          fontFamily: F, fontSize: 14, fontWeight: 700, color: T.navy,
          textTransform: "uppercase", letterSpacing: ".06em",
          marginTop: 32, marginBottom: 14, paddingBottom: 8, borderBottom: `2px solid ${T.teal}`,
        }}>Line Summary</div>
        <div style={{
          background: T.bg, border: `1px solid ${T.border}`, borderRadius: 8,
          overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,.04)", marginBottom: 24,
        }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, fontFamily: F }}>
            <thead>
              <tr style={{ background: "#F5F7FA" }}>
                <th style={{ padding: 10, textAlign: "left", fontWeight: 700, color: T.grey, borderBottom: `1px solid ${T.border}` }}>Parameter</th>
                <th style={{ padding: 10, textAlign: "left", fontWeight: 700, color: T.grey, borderBottom: `1px solid ${T.border}` }}>Input</th>
                <th style={{ padding: 10, textAlign: "left", fontWeight: 700, color: T.grey, borderBottom: `1px solid ${T.border}` }}>Output</th>
              </tr>
            </thead>
            <tbody>
              {SUMMARY.map(([param, input, output], i) => (
                <tr key={i}>
                  <td style={{ padding: 10, color: T.textL, borderBottom: `1px solid ${T.border}`, fontWeight: 500 }}>{param}</td>
                  <td style={{ padding: 10, color: T.text, borderBottom: `1px solid ${T.border}` }}>{input}</td>
                  <td style={{ padding: 10, color: T.text, borderBottom: `1px solid ${T.border}` }}>{output || "\u2014"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div style={{
          background: "#F5F7FA", border: `1px solid ${T.border}`, borderRadius: 8, padding: 16,
        }}>
          <div style={{ fontFamily: F, fontWeight: 700, fontSize: 13, color: T.navy, marginBottom: 10 }}>Legend</div>
          {LEGEND.map((item, i) => (
            <div key={i} style={{ fontFamily: F, fontSize: 11, color: T.textL, marginBottom: 5, paddingLeft: 16, position: "relative" }}>
              <span style={{ position: "absolute", left: 0, color: T.greyL }}>\u2022</span>
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
