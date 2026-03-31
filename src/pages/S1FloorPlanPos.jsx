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
  { id: 1, tag: "PIT-POS-01", name: "Pos Sludge Hopper", specs: [["Type", "At-grade hopper (not in-ground)"], ["Volume", "8 m\u00b3"], ["Material", "Epoxy-coated RC concrete"], ["Discharge", "Submersible pump to buffer tank"]], footer: "Receives mill decanter discharge" },
  { id: 2, tag: "T-SLD-101", name: "Pos Buffer Tank", specs: [["Type", "Agitated buffer tank \u00b7 sealed dome"], ["Volume", "5\u20138 m\u00b3"], ["Material", "SS304 stainless steel"], ["Agitator", "3.7 kW low-speed"], ["Throughput", "1.25 t/h @ 82% MC"]], footer: "Homogenises sludge before screening" },
  { id: 3, tag: "SCR-POS-01", name: "Pos Rotary Drum Screen", specs: [["Type", "Rotary drum screen"], ["Motor", "3.7 kW"], ["Screen", "1mm wedge wire"], ["Throughput", "1.25 t/h"], ["Reject", "Fibre + shell to EFB line"]], footer: "ICP-OES Fe gate checkpoint \u2014 protocol CFI-LAB-POME-001" },
  { id: 4, tag: "FP-POS-01", name: "Pos Filter Press", specs: [["Type", "Plate-and-frame filter press"], ["Motor", "11 kW hydraulic"], ["Plates", "40 \u00d7 800mm chambers"], ["Throughput", "1.25 t/h \u2192 ~0.56 t/h cake"], ["Cake MC", "~65%"], ["Cycle", "45 min press + 15 min discharge"]], footer: "Dewatered POS cake to S2 conditioning mixer" },
];

const BUILDING = { name: "Building A7 \u2014 Utility Building (Pos)", width: "12m", length: "18m", height: null, area: "216 m\u00b2" };

const SUMMARY = [
  ["Throughput", "1.5 t/h @ 82% MC", "~0.55 t/h @ 65% MC"],
  ["Source", "Mill decanter sludge discharge", "Dewatered cake"],
  ["Daily Input", "~30 t fresh (80\u201392% MC)", "~13.5 t to S2"],
  ["Installed Power", "~20 kW total", ""],
];

const LEGEND = [
  "MC = Moisture Content (wet basis %)",
  "POS = Palm Oil Sludge (decanter discharge slurry) \u2014 not POME liquid effluent",
  "ICP-OES Fe gate: protocol CFI-LAB-POME-001 determines POS inclusion rate in S2 blend",
  "PIT-POS-01: at-grade hopper (not in-ground) \u2014 epoxy-coated RC concrete",
  "T-SLD-101: 5\u20138 m\u00b3 \u00b7 SS304 \u00b7 3.7kW agitator \u00b7 sealed dome",
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
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: F, fontSize: 14, fontWeight: 700, color: T.navy, marginBottom: 4 }}>{BUILDING.name}</div>
          <div style={{ fontFamily: F, fontSize: 12, color: T.grey }}>S1 Mechanical Equipment Layout</div>
          <div style={{ fontFamily: F, fontSize: 12, color: T.grey, marginTop: 4 }}>Area: {BUILDING.area}</div>
        </div>
      </div>
    </div>
  );
}

export default function S1FloorPlanPos() {
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
        <span style={{ color: T.teal, fontWeight: 700 }}>Pos Floor Plan</span>
      </div>

      {/* Residue nav tabs */}
      <div style={{ borderBottom: `1px solid ${T.border}`, padding: "0 40px", display: "flex", gap: 0, background: T.bg }}>
        {[
          { label: "Efb Line", path: "/s1-floor-efb", active: false },
          { label: "Opdc Line", path: "/s1-floor-opdc", active: false },
          { label: "Pos Line", path: "/s1-floor-pos", active: true },
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
        }}>S1a</span>
        <span style={{ fontFamily: F, fontWeight: 700, fontSize: 20, color: T.navy }}>
          Pos Line \u2014 Palm Oil Sludge Pre-Skimming
        </span>
        <span style={{ fontFamily: F, fontSize: 11, color: T.grey, marginLeft: "auto" }}>
          4 nodes \u00b7 20 kW \u00b7 Building A7
        </span>
      </div>

      {/* Ticker bar */}
      <div style={{
        borderBottom: `1px solid ${T.border}`, padding: "8px 40px",
        display: "flex", gap: 0, overflowX: "auto", background: T.bg,
      }}>
        {[
          { label: "Throughput In", val: "1.5 t/h", color: T.teal },
          { label: "Throughput Out", val: "~0.55 t/h", color: T.teal },
          { label: "MC In", val: "82%", color: T.navy },
          { label: "MC Out", val: "65%", color: T.navy },
          { label: "Installed Power", val: "~20 kW", color: T.amber },
          { label: "Daily Input", val: "~30 t", color: T.green },
          { label: "Daily Output", val: "~13.5 t", color: T.green },
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
