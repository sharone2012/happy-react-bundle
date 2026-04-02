import { useState } from "react";
import { useNavigate } from "react-router-dom";

/* ── S0 Design Tokens (dark navy theme) ── */
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

/* ── Node card (dark navy) ── */
function NodeCard({ node }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      onClick={() => setExpanded(!expanded)}
      style={{
        background: C.navyCard,
        border: `1px solid ${expanded ? C.tealBdr : C.bdrIdle}`,
        borderLeft: `4px solid ${expanded ? C.teal : C.bdrCalc}`,
        borderRadius: 6, padding: "14px 18px", marginBottom: 8,
        cursor: "pointer", transition: "all .15s",
        boxShadow: expanded ? "0 2px 12px rgba(64,215,197,.10)" : "none",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{
          width: 30, height: 30, borderRadius: 6, background: C.teal, color: C.navy,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: Fnt.mono, fontSize: 11, fontWeight: 700, flexShrink: 0,
        }}>{node.id}</div>
        <div style={{ fontFamily: Fnt.mono, fontSize: 12, fontWeight: 700, color: C.amber, minWidth: 100 }}>{node.tag}</div>
        <div style={{ flex: 1, fontFamily: Fnt.syne, fontSize: 13, fontWeight: 600, color: C.white }}>{node.name}</div>
        <span style={{ fontFamily: Fnt.dm, fontSize: 11, color: C.grey }}>{expanded ? "\u25b2" : "\u25bc"}</span>
      </div>
      {expanded && (
        <div style={{ marginTop: 12 }}>
          <div style={{
            display: "grid", gridTemplateColumns: "auto 1fr", gap: "6px 14px",
            background: C.navyField, padding: 14, borderRadius: 6, fontSize: 12,
            border: `1px solid ${C.bdrIdle}`,
          }}>
            {node.specs.map(([label, value], i) => (
              <div key={i} style={{ display: "contents" }}>
                <span style={{ fontFamily: Fnt.dm, color: C.grey, fontWeight: 600, fontSize: 11 }}>{label}</span>
                <span style={{ fontFamily: Fnt.mono, fontWeight: 500, color: C.white }}>{value}</span>
              </div>
            ))}
          </div>
          <div style={{
            marginTop: 10, paddingTop: 8, borderTop: `1px solid ${C.bdrCalc}`,
            fontFamily: Fnt.dm, fontSize: 11, color: C.greyLt,
          }}>{node.footer}</div>
        </div>
      )}
    </div>
  );
}

/* ── Building diagram (dark navy, no height for Pos) ── */
function BuildingDiagram() {
  return (
    <div style={{ margin: "24px 0", maxWidth: 500 }}>
      <div style={{ textAlign: "center", marginBottom: 8 }}>
        <div style={{ fontFamily: Fnt.dm, fontSize: 11, fontWeight: 600, color: C.teal }}>Width</div>
        <div style={{ height: 2, background: C.bdrCalc, margin: "4px auto", maxWidth: 400, position: "relative" }}>
          <div style={{ position: "absolute", left: 0, top: -4, width: 2, height: 10, background: C.tealBdr }} />
          <div style={{ position: "absolute", right: 0, top: -4, width: 2, height: 10, background: C.tealBdr }} />
        </div>
        <div style={{ fontFamily: Fnt.mono, fontSize: 13, fontWeight: 700, color: C.teal }}>{BUILDING.width}</div>
      </div>
      <div style={{
        border: `2px solid ${C.tealBdr}`, background: C.tealDim,
        padding: 24, position: "relative", maxWidth: 400, margin: "0 auto",
        borderRadius: 6,
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: Fnt.syne, fontSize: 14, fontWeight: 700, color: C.white, marginBottom: 4 }}>{BUILDING.name}</div>
          <div style={{ fontFamily: Fnt.dm, fontSize: 12, color: C.grey }}>S1 Mechanical Equipment Layout</div>
          <div style={{ fontFamily: Fnt.mono, fontSize: 12, color: C.grey, marginTop: 4 }}>Area: {BUILDING.area}</div>
        </div>
      </div>
    </div>
  );
}

export default function S1FloorPlanPos() {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: Fnt.dm, color: C.white, background: C.navy, minHeight: "100vh" }}>

      {/* ── S0 Header (S1 highlighted) ── */}
      <div style={{ background:C.navyMid, display:'flex', alignItems:'center', padding:'0 28px', height:80, gap:18, position:'sticky', top:0, zIndex:100 }}>
        <div style={{ display:'flex', alignItems:'center', flexShrink:0, maxWidth:340 }}>
          <div>
            <div style={{ display:'flex', alignItems:'baseline' }}>
              <span style={{ fontFamily:Fnt.brand, fontWeight:700, fontSize:26, color:'#FFF', letterSpacing:'0.02em' }}>CFI</span>
              <span style={{ fontFamily:Fnt.brand, fontSize:22, color:'rgba(255,255,255,0.25)', margin:'0 8px' }}>&middot;</span>
              <span style={{ fontFamily:Fnt.brand, fontWeight:700, fontSize:20, color:C.teal, letterSpacing:'0.10em' }}>DEEP TECH</span>
            </div>
            <div style={{ fontSize:11, color:C.teal, marginTop:4, fontFamily:Fnt.dm }}>Soil Microbiome Engineering &amp; Biofertiliser Production for Closed&#8209;Loop Nutrient Recycling</div>
          </div>
        </div>
        <div style={{ display:'flex', gap:4, marginLeft:'auto', alignItems:'center', flexShrink:0 }}>
          {['S0','S1','S2','S3','S4','S5','S6','CAPEX','\u03a3'].map((s,i)=>(
            <div key={s} style={{ background:i===1?C.teal:'rgba(168,189,208,0.09)', border:`1px solid ${i===1?C.teal:'rgba(168,189,208,0.18)'}`, borderRadius:4, padding:'3px 9px', fontFamily:Fnt.mono, fontSize:11, fontWeight:700, color:i===1?C.navy:C.grey, cursor:'pointer' }}>{s}</div>
          ))}
        </div>
      </div>

      {/* Breadcrumb */}
      <div style={{
        background: C.navyMid, borderBottom: `1px solid ${C.bdrIdle}`,
        padding: "8px 40px", display: "flex", alignItems: "center", gap: 8,
        fontSize: 11, fontFamily: Fnt.dm, color: C.grey,
      }}>
        <span style={{ color: C.teal, fontWeight: 700, cursor: "pointer" }} onClick={() => navigate("/")}>CFI Platform</span>
        <span style={{ color: C.greyLt }}>&rsaquo;</span>
        <span style={{ cursor: "pointer" }} onClick={() => navigate("/s1-capex-opex")}>S1 Pre-Processing</span>
        <span style={{ color: C.greyLt }}>&rsaquo;</span>
        <span style={{ color: C.teal, fontWeight: 700 }}>Pos Floor Plan</span>
      </div>

      {/* Residue nav tabs */}
      <div style={{ borderBottom: `1px solid ${C.bdrIdle}`, padding: "0 40px", display: "flex", gap: 0, background: C.navyMid }}>
        {[
          { label: "Efb Line", path: "/s1-floor-efb", active: false },
          { label: "Opdc Line", path: "/s1-floor-opdc", active: false },
          { label: "Pos Line", path: "/s1-floor-pos", active: true },
          { label: "Combined View", path: "/s1-combined", active: false },
        ].map((t, i) => (
          <button key={i} onClick={() => navigate(t.path)} style={{
            fontFamily: Fnt.dm, fontSize: 12, fontWeight: 700, padding: "10px 20px",
            background: "transparent", border: "none", cursor: "pointer",
            color: t.active ? C.teal : C.grey,
            borderBottom: `2px solid ${t.active ? C.teal : "transparent"}`,
            transition: "all .15s",
          }}>{t.label}</button>
        ))}
      </div>

      {/* Title row */}
      <div style={{
        padding: "20px 40px", display: "flex", alignItems: "center", gap: 12,
        borderBottom: `1px solid ${C.bdrIdle}`, background: C.navy,
      }}>
        <span style={{
          background: C.teal, color: C.navy, fontWeight: 700, fontSize: 12,
          padding: "4px 12px", borderRadius: 4, letterSpacing: ".08em", fontFamily: Fnt.mono,
        }}>S1a</span>
        <span style={{ fontFamily: Fnt.syne, fontWeight: 700, fontSize: 20, color: C.white }}>
          Pos Line &mdash; Palm Oil Sludge Pre-Skimming
        </span>
        <span style={{ fontFamily: Fnt.mono, fontSize: 11, color: C.grey, marginLeft: "auto" }}>
          4 nodes &middot; 20 kW &middot; Building A7
        </span>
      </div>

      {/* Ticker bar */}
      <div style={{
        borderBottom: `1px solid ${C.bdrIdle}`, padding: "8px 40px",
        display: "flex", gap: 0, overflowX: "auto", background: C.navyMid,
      }}>
        {[
          { label: "Throughput In", val: "1.5 t/h", color: C.teal },
          { label: "Throughput Out", val: "~0.55 t/h", color: C.teal },
          { label: "MC In", val: "82%", color: C.white },
          { label: "MC Out", val: "65%", color: C.white },
          { label: "Installed Power", val: "~20 kW", color: C.amber },
          { label: "Daily Input", val: "~30 t", color: C.green },
          { label: "Daily Output", val: "~13.5 t", color: C.green },
        ].map((k, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 8, padding: "0 20px",
            borderRight: i < 6 ? `1px solid ${C.bdrCalc}` : "none", whiteSpace: "nowrap",
          }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: C.grey, textTransform: "uppercase", letterSpacing: ".06em", fontFamily: Fnt.dm }}>{k.label}</span>
            <span style={{ fontFamily: Fnt.mono, fontSize: 14, fontWeight: 700, color: k.color }}>{k.val}</span>
          </div>
        ))}
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 40px 60px" }}>
        <div style={{
          fontFamily: Fnt.syne, fontSize: 14, fontWeight: 700, color: C.teal,
          textTransform: "uppercase", letterSpacing: ".06em",
          marginBottom: 14, paddingBottom: 8, borderBottom: `2px solid ${C.tealBdr}`,
        }}>Equipment Nodes</div>

        {NODES.map((node) => <NodeCard key={node.id} node={node} />)}

        <div style={{
          fontFamily: Fnt.syne, fontSize: 14, fontWeight: 700, color: C.teal,
          textTransform: "uppercase", letterSpacing: ".06em",
          marginTop: 32, marginBottom: 14, paddingBottom: 8, borderBottom: `2px solid ${C.tealBdr}`,
        }}>Building Dimensions</div>
        <BuildingDiagram />

        <div style={{
          fontFamily: Fnt.syne, fontSize: 14, fontWeight: 700, color: C.teal,
          textTransform: "uppercase", letterSpacing: ".06em",
          marginTop: 32, marginBottom: 14, paddingBottom: 8, borderBottom: `2px solid ${C.tealBdr}`,
        }}>Line Summary</div>
        <div style={{
          background: C.navyCard, border: `1px solid ${C.bdrCalc}`, borderRadius: 8,
          overflow: "hidden", marginBottom: 24,
        }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, fontFamily: Fnt.dm }}>
            <thead>
              <tr style={{ background: C.navyField }}>
                <th style={{ padding: 10, textAlign: "left", fontWeight: 700, color: C.grey, borderBottom: `1px solid ${C.bdrCalc}`, fontFamily: Fnt.dm }}>Parameter</th>
                <th style={{ padding: 10, textAlign: "left", fontWeight: 700, color: C.grey, borderBottom: `1px solid ${C.bdrCalc}`, fontFamily: Fnt.dm }}>Input</th>
                <th style={{ padding: 10, textAlign: "left", fontWeight: 700, color: C.grey, borderBottom: `1px solid ${C.bdrCalc}`, fontFamily: Fnt.dm }}>Output</th>
              </tr>
            </thead>
            <tbody>
              {SUMMARY.map(([param, input, output], i) => (
                <tr key={i}>
                  <td style={{ padding: 10, color: C.grey, borderBottom: `1px solid ${C.bdrIdle}`, fontWeight: 500 }}>{param}</td>
                  <td style={{ padding: 10, color: C.white, borderBottom: `1px solid ${C.bdrIdle}`, fontFamily: Fnt.mono }}>{input}</td>
                  <td style={{ padding: 10, color: C.white, borderBottom: `1px solid ${C.bdrIdle}`, fontFamily: Fnt.mono }}>{output || "\u2014"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ background: C.navyCard, border: `1px solid ${C.bdrCalc}`, borderRadius: 8, padding: 16 }}>
          <div style={{ fontFamily: Fnt.syne, fontWeight: 700, fontSize: 13, color: C.teal, marginBottom: 10 }}>Legend</div>
          {LEGEND.map((item, i) => (
            <div key={i} style={{ fontFamily: Fnt.dm, fontSize: 11, color: C.greyLt, marginBottom: 5, paddingLeft: 16, position: "relative" }}>
              <span style={{ position: "absolute", left: 0, color: C.teal }}>&bull;</span>
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
