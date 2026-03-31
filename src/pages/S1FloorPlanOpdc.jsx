import { useState } from "react";
import { useNavigate } from "react-router-dom";

const F = "'DM Sans', sans-serif";

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

const NODES = [
  { id: 1, tag: "RCV-OPDC-01", name: "Opdc Receiving Bay", specs: [["Type", "Concrete receiving bay with push-wall"], ["Volume", "25 m\u00b3 (~12 t)"], ["Material", "Reinforced concrete + epoxy floor"], ["Discharge", "Front-end loader to feeder"]], footer: "Wheel loader feeds RH-OPDC-101" },
  { id: 2, tag: "RH-OPDC-101", name: "Opdc Reciprocating Feeder", specs: [["Type", "Hydraulic reciprocating feeder"], ["Motor", "5.5 kW hydraulic"], ["Throughput", "5 t/h OPDC (70% MC)"], ["Stroke", "600mm"], ["Width", "800mm"]], footer: "Meters OPDC onto belt conveyor" },
  { id: 3, tag: "CV-OPDC-101", name: "Opdc Belt Conveyor", specs: [["Type", "Enclosed belt conveyor"], ["Length", "15 m"], ["Width", "500 mm"], ["Motor", "3.7 kW \u00b7 3-phase"], ["Throughput", "5 t/h"], ["Incline", "12\u00b0"]], footer: "To OPR-01 screw press" },
  { id: 4, tag: "OPR-01", name: "Opdc Screw Press", specs: [["Type", "Twin-screw dewatering press"], ["Motor", "22 kW \u00b7 VFD"], ["Throughput", "5 t/h @ 70% MC in \u2192 60% MC out"], ["Pressure", "5\u20138 bar"], ["Screen", "Wedge wire 0.75mm"], ["Gate", "Class A \u2014 mandatory QC checkpoint"]], footer: "Class A gate \u2014 moisture sample before release" },
  { id: 5, tag: "OTR-01", name: "Opdc Trommel Screen", specs: [["Type", "Rotary trommel"], ["Diameter", "1200 mm"], ["Length", "3000 mm"], ["Motor", "4 kW \u00b7 geared"], ["Screen", "30mm perforations"], ["Throughput", "3.3 t/h (post-press)"]], footer: "Removes oversized contaminants" },
  { id: 6, tag: "ODR-01", name: "Opdc Rotary Dryer", specs: [["Type", "Direct-fired rotary drum dryer"], ["Motor", "15 kW drum + 7.5 kW fan"], ["Throughput", "3.3 t/h @ 60% MC in \u2192 45% MC out"], ["Diameter", "1500 mm"], ["Length", "8000 mm"], ["Fuel", "Palm kernel shell (PKS)"]], footer: "Reduces MC for hammer mill processing" },
  { id: 7, tag: "OHM-01", name: "Opdc Hammer Mill", specs: [["Type", "Hammer mill with 3mm screen"], ["Motor", "75 kW \u00b7 direct drive"], ["Throughput", "3.3 t/h (45% MC)"], ["Hammer tips", "18 swing hammers"], ["Screen", "3mm perforated plate"], ["Speed", "1500 RPM"]], footer: "Noise zone \u2014 85+ dBA \u00b7 PPE required" },
  { id: 8, tag: "OVS-01", name: "Opdc Vibrating Screen", specs: [["Type", "Single-deck vibrating screen"], ["Motor", "1.5 kW vibratory"], ["Screen", "3mm mesh"], ["Throughput", "3.3 t/h milled OPDC"], ["Oversize", "Return to hammer mill"], ["Undersize", "To product bin"]], footer: "Oversize loop to OHM-01" },
  { id: 9, tag: "ODC-01", name: "Opdc Dust Collector", specs: [["Type", "Pulse-jet baghouse"], ["Air volume", "3500 m\u00b3/h"], ["Motor", "5.5 kW fan"], ["Filter area", "35 m\u00b2"], ["Emission", "<50 mg/Nm\u00b3"]], footer: "Serves dryer + hammer mill zone" },
  { id: 10, tag: "BIN-OPDC-301", name: "Opdc Product Bin", specs: [["Type", "Steel product bin with 24-hour dwell"], ["Volume", "40 m\u00b3 (~18 t)"], ["Material", "Carbon steel + moisture barrier"], ["Dwell time", "24 hours minimum"], ["Discharge", "Screw conveyor to S2"], ["Gate", "24hr dwell gate \u2014 mandatory hold"]], footer: "24hr dwell gate \u2014 holds product before S2 release" },
];

const BUILDING = { name: "Building A6 \u2014 Opdc Processing Hall", width: "18m", length: "36m", height: "10m", area: "648 m\u00b2" };

const SUMMARY = [
  ["Throughput", "5 t/h @ 70% MC", "3.3 t/h @ 45% MC"],
  ["Source", "Mill decanter cake", "Dried/milled cake to S2"],
  ["Daily Input", "~75 t fresh", "~50 t processed"],
  ["Installed Power", "~206 kW total", ""],
];

const LEGEND = [
  "MC = Moisture Content (wet basis %)",
  "OPDC = Oil Palm Decanter Cake (solid fraction from 3-phase decanter)",
  "Class A gate = mandatory moisture QC before next process step",
  "24hr dwell gate = product must rest 24h minimum in bin before S2 release",
  "PKS = Palm Kernel Shell (fuel for rotary dryer)",
];

function NodeCard({ node }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      onClick={() => setExpanded(!expanded)}
      style={{
        background: T.bg,
        border: `1px solid ${expanded ? T.teal : T.border}`,
        borderLeft: `4px solid ${expanded ? T.teal : T.border}`,
        borderRadius: 6, padding: "14px 18px", marginBottom: 8,
        cursor: "pointer", transition: "all .15s",
        boxShadow: expanded ? "0 2px 8px rgba(0,137,123,.1)" : "0 1px 3px rgba(0,0,0,.04)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{
          width: 30, height: 30, borderRadius: 6, background: T.teal, color: "#fff",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: F, fontSize: 11, fontWeight: 700, flexShrink: 0,
        }}>{node.id}</div>
        <div style={{ fontFamily: F, fontSize: 12, fontWeight: 700, color: T.amber, minWidth: 100 }}>{node.tag}</div>
        <div style={{ flex: 1, fontFamily: F, fontSize: 13, fontWeight: 600, color: T.navy }}>{node.name}</div>
        <span style={{ fontFamily: F, fontSize: 11, color: T.grey }}>{expanded ? "\u25b2" : "\u25bc"}</span>
      </div>
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

export default function S1FloorPlanOpdc() {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: F, color: T.text, background: T.bg, minHeight: "100vh" }}>
      {/* Header */}
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

      {/* Breadcrumb */}
      <div style={{
        background: T.bg, borderBottom: `1px solid ${T.border}`,
        padding: "8px 40px", display: "flex", alignItems: "center", gap: 8,
        fontSize: 11, fontFamily: F, color: T.grey,
      }}>
        <span style={{ color: T.teal, fontWeight: 700, cursor: "pointer" }} onClick={() => navigate("/")}>CFI Platform</span>
        <span style={{ color: T.greyL }}>\u203a</span>
        <span style={{ cursor: "pointer" }} onClick={() => navigate("/s1-capex-opex")}>S1 Pre-Processing</span>
        <span style={{ color: T.greyL }}>\u203a</span>
        <span style={{ color: T.teal, fontWeight: 700 }}>Opdc Floor Plan</span>
      </div>

      {/* Residue nav tabs */}
      <div style={{ borderBottom: `1px solid ${T.border}`, padding: "0 40px", display: "flex", gap: 0, background: T.bg }}>
        {[
          { label: "Efb Line", path: "/s1-floor-efb", active: false },
          { label: "Opdc Line", path: "/s1-floor-opdc", active: true },
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

      {/* Title row */}
      <div style={{
        padding: "20px 40px", display: "flex", alignItems: "center", gap: 12,
        borderBottom: `1px solid ${T.border}`,
      }}>
        <span style={{
          background: T.teal, color: "#fff", fontWeight: 700, fontSize: 12,
          padding: "4px 12px", borderRadius: 4, letterSpacing: ".08em",
        }}>S1b</span>
        <span style={{ fontFamily: F, fontWeight: 700, fontSize: 20, color: T.navy }}>
          Opdc Line \u2014 Oil Palm Decanter Cake Processing
        </span>
        <span style={{ fontFamily: F, fontSize: 11, color: T.grey, marginLeft: "auto" }}>
          10 nodes \u00b7 206 kW \u00b7 Building A6
        </span>
      </div>

      {/* Ticker bar */}
      <div style={{
        borderBottom: `1px solid ${T.border}`, padding: "8px 40px",
        display: "flex", gap: 0, overflowX: "auto", background: T.bg,
      }}>
        {[
          { label: "Throughput In", val: "5 t/h", color: T.teal },
          { label: "Throughput Out", val: "3.3 t/h", color: T.teal },
          { label: "MC In", val: "70%", color: T.navy },
          { label: "MC Out", val: "45%", color: T.navy },
          { label: "Installed Power", val: "~206 kW", color: T.amber },
          { label: "Daily Input", val: "~75 t", color: T.green },
          { label: "Daily Output", val: "~50 t", color: T.green },
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

      {/* Content */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 40px 60px" }}>
        <div style={{
          fontFamily: F, fontSize: 14, fontWeight: 700, color: T.navy,
          textTransform: "uppercase", letterSpacing: ".06em",
          marginBottom: 14, paddingBottom: 8, borderBottom: `2px solid ${T.teal}`,
        }}>Equipment Nodes</div>

        {NODES.map((node) => <NodeCard key={node.id} node={node} />)}

        <div style={{
          fontFamily: F, fontSize: 14, fontWeight: 700, color: T.navy,
          textTransform: "uppercase", letterSpacing: ".06em",
          marginTop: 32, marginBottom: 14, paddingBottom: 8, borderBottom: `2px solid ${T.teal}`,
        }}>Building Dimensions</div>
        <BuildingDiagram />

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

        <div style={{ background: "#F5F7FA", border: `1px solid ${T.border}`, borderRadius: 8, padding: 16 }}>
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
