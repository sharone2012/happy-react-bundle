import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/*
 * ─────────────────────────────────────────────────────────────────────────────
 * CFI Deep Tech · S1 Floor Plan — Print / PDF Page
 * Route: /s1-floor-plan-print
 * ?line=all|efb|opdc|pos  (default: all)
 * ?print                  auto-triggers window.print() after 400ms
 * Greyscale A4-friendly formal document. Recoloured SVG icons from S1Combined.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const F  = "'DM Sans', sans-serif";
const FH = "'EB Garamond', serif";

/* ─── Greyscale print palette ─── */
const P = {
  bg:      "#FFFFFF",
  border:  "#CCCCCC",
  borderD: "#999999",
  card:    "#F8F8F8",
  iconBg:  "#F0F0F0",
  teal:    "#00695C",
  amber:   "#BF360C",
  navy:    "#1A2332",
  text:    "#111111",
  textM:   "#444444",
  textL:   "#666666",
  tag:     "#E8E8E8",
  tagText: "#333333",
  sectionPill: "#222222",
};

/* ─── CSS ─── */
const PRINT_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=EB+Garamond:wght@700&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #e8e8e8; }

  @media print {
    @page { size: A4 portrait; margin: 10mm; }
    body  { background: white; }
    .no-print { display: none !important; }
    .page-break { page-break-before: always; }
  }

  .no-print {
    position: sticky;
    top: 0;
    z-index: 1000;
    background: #1A2332;
    color: #FFFFFF;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 24px;
    font-family: 'DM Sans', sans-serif;
  }

  .fp-doc {
    max-width: 900px;
    margin: 20px auto;
    background: white;
    border: 1px solid #ccc;
    font-family: 'DM Sans', sans-serif;
  }

  @media print {
    .fp-doc { margin: 0; border: none; max-width: 100%; }
  }

  .fp-doc-header {
    background: #1A2332;
    color: white;
    padding: 20px 28px 16px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    flex-wrap: wrap;
    gap: 12px;
  }

  .section-block {
    border-top: 3px solid #111;
    margin: 0;
    padding: 20px 28px 28px;
  }

  .section-block + .section-block {
    border-top: 2px solid #DDDDDD;
  }

  .section-pill {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: #222;
    color: #fff;
    font-family: 'DM Sans', sans-serif;
    font-weight: 700;
    font-size: 13px;
    letter-spacing: .06em;
    text-transform: uppercase;
    padding: 5px 14px;
    border-radius: 4px;
    margin-bottom: 16px;
  }

  .summary-strip {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    margin-bottom: 20px;
  }

  .summary-cell {
    background: #F4F4F4;
    border: 1px solid #CCCCCC;
    border-radius: 5px;
    padding: 10px 14px;
  }

  .card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 14px;
    margin-bottom: 20px;
  }

  .machine-card {
    background: #F8F8F8;
    border: 1.5px solid #CCCCCC;
    border-radius: 6px;
    overflow: hidden;
    position: relative;
    break-inside: avoid;
  }

  .machine-card:hover { border-color: #555; }

  .card-num-badge {
    position: absolute;
    top: 0; left: 0;
    background: #222;
    color: #fff;
    font-family: 'DM Sans', sans-serif;
    font-weight: 700;
    font-size: 15px;
    padding: 4px 10px;
    border-bottom-right-radius: 6px;
    z-index: 2;
  }

  .card-body {
    display: flex;
  }

  .card-icon-pane {
    width: 120px;
    background: #EFEFEF;
    border-right: 1px solid #CCCCCC;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    padding: 8px;
  }

  .card-specs {
    flex: 1;
    padding: 36px 14px 12px 14px;
  }

  .card-title {
    font-family: 'DM Sans', sans-serif;
    font-weight: 700;
    font-size: 13px;
    color: #111;
    margin-bottom: 10px;
  }

  .spec-grid {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 5px 10px;
    font-size: 11px;
  }

  .spec-label { color: #666; white-space: nowrap; }
  .spec-value { color: #111; font-weight: 500; }

  .card-footer {
    border-top: 1px dashed #CCCCCC;
    padding: 8px 14px;
    font-size: 10px;
    color: #777;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .building-box {
    border: 1.5px solid #CCCCCC;
    border-radius: 5px;
    padding: 14px 18px;
    background: #FAFAFA;
    margin-bottom: 20px;
  }

  .summary-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 12px;
    margin-bottom: 16px;
  }

  .summary-table th {
    background: #EEEEEE;
    padding: 8px 10px;
    text-align: left;
    font-weight: 700;
    color: #444;
    text-transform: uppercase;
    font-size: 10px;
    letter-spacing: .05em;
    border: 1px solid #CCCCCC;
  }

  .summary-table td {
    padding: 8px 10px;
    color: #222;
    border: 1px solid #E0E0E0;
  }

  .summary-table tr:nth-child(even) td { background: #F8F8F8; }

  .legend-block {
    background: #F4F4F4;
    border: 1px solid #CCCCCC;
    border-radius: 5px;
    padding: 12px 16px;
  }

  .doc-footer {
    background: #F0F0F0;
    border-top: 2px solid #CCCCCC;
    padding: 12px 28px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 10px;
    color: #666;
  }
`;

/* ─── Greyscale SVG Icons ─── */
function HopperSVG() {
  return (
    <svg viewBox="0 0 100 100" width="80" height="80">
      <polygon points="20,15 80,15 70,75 30,75" fill="#e0e0e0" stroke="#555" strokeWidth="1.5"/>
      <rect x="38" y="75" width="24" height="8" fill="#ccc" stroke="#555" strokeWidth="1.5"/>
      <line x1="50" y1="83" x2="50" y2="95" stroke="#888" strokeWidth="1"/>
    </svg>
  );
}
function ConveyorSVG() {
  return (
    <svg viewBox="0 0 110 60" width="90" height="49">
      <line x1="10" y1="48" x2="100" y2="18" stroke="#555" strokeWidth="1.5"/>
      <circle cx="10" cy="48" r="5" fill="#e0e0e0" stroke="#555" strokeWidth="1.5"/>
      <circle cx="100" cy="18" r="5" fill="#e0e0e0" stroke="#555" strokeWidth="1.5"/>
      <line x1="10" y1="54" x2="100" y2="24" stroke="#999" strokeWidth="0.8" strokeDasharray="3"/>
    </svg>
  );
}
function ShredderSVG() {
  return (
    <svg viewBox="0 0 100 100" width="80" height="80">
      <rect x="15" y="15" width="70" height="70" rx="4" fill="#e0e0e0" stroke="#555" strokeWidth="1.5"/>
      <circle cx="38" cy="50" r="12" fill="#d0d0d0" stroke="#777" strokeWidth="1"/>
      <circle cx="62" cy="50" r="12" fill="#d0d0d0" stroke="#777" strokeWidth="1"/>
      <line x1="38" y1="38" x2="38" y2="62" stroke="#888" strokeWidth="0.8"/>
      <line x1="26" y1="50" x2="50" y2="50" stroke="#888" strokeWidth="0.8"/>
    </svg>
  );
}
function MillSVG() {
  return (
    <svg viewBox="0 0 100 100" width="80" height="80">
      <rect x="15" y="20" width="70" height="60" rx="4" fill="#e0e0e0" stroke="#555" strokeWidth="1.5"/>
      <circle cx="50" cy="50" r="18" fill="#d0d0d0" stroke="#777" strokeWidth="1.5"/>
      <line x1="50" y1="32" x2="50" y2="68" stroke="#888" strokeWidth="1"/>
      <line x1="32" y1="50" x2="68" y2="50" stroke="#888" strokeWidth="1"/>
      <line x1="37" y1="37" x2="63" y2="63" stroke="#aaa" strokeWidth="0.8"/>
      <line x1="63" y1="37" x2="37" y2="63" stroke="#aaa" strokeWidth="0.8"/>
    </svg>
  );
}
function ScreenSVG() {
  return (
    <svg viewBox="0 0 110 70" width="90" height="57">
      <rect x="5" y="10" width="100" height="50" rx="3" fill="#e0e0e0" stroke="#555" strokeWidth="1.5"/>
      <line x1="5" y1="35" x2="105" y2="35" stroke="#888" strokeWidth="0.8" strokeDasharray="4,3"/>
      <line x1="30" y1="10" x2="30" y2="60" stroke="#bbb" strokeWidth="0.4" strokeDasharray="2"/>
      <line x1="55" y1="10" x2="55" y2="60" stroke="#bbb" strokeWidth="0.4" strokeDasharray="2"/>
      <line x1="80" y1="10" x2="80" y2="60" stroke="#bbb" strokeWidth="0.4" strokeDasharray="2"/>
    </svg>
  );
}
function PressSVG() {
  return (
    <svg viewBox="0 0 110 60" width="90" height="49">
      <ellipse cx="55" cy="30" rx="45" ry="22" fill="#e0e0e0" stroke="#555" strokeWidth="1.5"/>
      <path d="M 25 30 Q 40 20 55 30 Q 70 40 85 30" fill="none" stroke="#888" strokeWidth="1"/>
      <line x1="10" y1="30" x2="25" y2="30" stroke="#888" strokeWidth="1"/>
      <line x1="85" y1="30" x2="100" y2="30" stroke="#888" strokeWidth="1"/>
    </svg>
  );
}
function BinSVG() {
  return (
    <svg viewBox="0 0 100 100" width="80" height="80">
      <rect x="25" y="10" width="50" height="55" rx="3" fill="#e0e0e0" stroke="#555" strokeWidth="1.5"/>
      <polygon points="25,65 75,65 65,90 35,90" fill="#d0d0d0" stroke="#555" strokeWidth="1.5"/>
    </svg>
  );
}
function BaghouseSVG() {
  return (
    <svg viewBox="0 0 80 100" width="64" height="80">
      <rect x="10" y="5" width="60" height="90" rx="4" fill="#e0e0e0" stroke="#555" strokeWidth="1.5"/>
      <line x1="10" y1="25" x2="70" y2="25" stroke="#888" strokeWidth="0.8"/>
      <line x1="25" y1="30" x2="25" y2="85" stroke="#aaa" strokeWidth="0.8" strokeDasharray="3"/>
      <line x1="40" y1="30" x2="40" y2="85" stroke="#aaa" strokeWidth="0.8" strokeDasharray="3"/>
      <line x1="55" y1="30" x2="55" y2="85" stroke="#aaa" strokeWidth="0.8" strokeDasharray="3"/>
    </svg>
  );
}
function FeederSVG() {
  return (
    <svg viewBox="0 0 100 60" width="80" height="48">
      <rect x="10" y="10" width="80" height="40" rx="3" fill="#e0e0e0" stroke="#555" strokeWidth="1.5"/>
      <line x1="50" y1="20" x2="80" y2="30" stroke="#888" strokeWidth="1.5"/>
      <polygon points="75,25 85,30 75,35" fill="#aaa"/>
    </svg>
  );
}
function DryerSVG() {
  return (
    <svg viewBox="0 0 110 60" width="90" height="49">
      <ellipse cx="55" cy="30" rx="48" ry="22" fill="#e0e0e0" stroke="#555" strokeWidth="1.5"/>
      <line x1="7" y1="30" x2="103" y2="30" stroke="#aaa" strokeWidth="0.5" strokeDasharray="3"/>
      <circle cx="25" cy="45" r="4" fill="#ccc"/>
      <circle cx="35" cy="48" r="3" fill="#ccc"/>
    </svg>
  );
}
function TankSVG() {
  return (
    <svg viewBox="0 0 80 100" width="64" height="80">
      <ellipse cx="40" cy="20" rx="28" ry="10" fill="#e0e0e0" stroke="#555" strokeWidth="1.5"/>
      <line x1="12" y1="20" x2="12" y2="80" stroke="#555" strokeWidth="1.5"/>
      <line x1="68" y1="20" x2="68" y2="80" stroke="#555" strokeWidth="1.5"/>
      <ellipse cx="40" cy="80" rx="28" ry="10" fill="#e0e0e0" stroke="#555" strokeWidth="1.5"/>
      <line x1="40" y1="25" x2="40" y2="75" stroke="#aaa" strokeWidth="0.8"/>
    </svg>
  );
}
function FilterPressSVG() {
  return (
    <svg viewBox="0 0 100 80" width="80" height="64">
      <rect x="15" y="10" width="10" height="60" rx="1" fill="#e0e0e0" stroke="#666" strokeWidth="1"/>
      <rect x="30" y="10" width="10" height="60" rx="1" fill="#e0e0e0" stroke="#666" strokeWidth="1"/>
      <rect x="45" y="10" width="10" height="60" rx="1" fill="#e0e0e0" stroke="#666" strokeWidth="1"/>
      <rect x="60" y="10" width="10" height="60" rx="1" fill="#e0e0e0" stroke="#666" strokeWidth="1"/>
      <rect x="75" y="10" width="10" height="60" rx="1" fill="#e0e0e0" stroke="#666" strokeWidth="1"/>
      <line x1="10" y1="40" x2="90" y2="40" stroke="#555" strokeWidth="1.5"/>
    </svg>
  );
}

const circleNums = ["①","②","③","④","⑤","⑥","⑦","⑧","⑨","⑩"];

/* ─── Greyscale Machine Card ─── */
function MachineCard({ num, title, icon, specs, footer }) {
  return (
    <div className="machine-card">
      <div className="card-num-badge">{circleNums[num - 1] || num}</div>
      <div className="card-body">
        <div className="card-icon-pane">{icon}</div>
        <div className="card-specs">
          <div className="card-title">{title}</div>
          <div className="spec-grid">
            {specs.map(([label, value], i) => (
              <div key={i} style={{ display: "contents" }}>
                <span className="spec-label">{label}:</span>
                <span className="spec-value">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="card-footer">
        <span style={{ color: "#bbb" }}>▾</span> {footer}
      </div>
    </div>
  );
}

/* ─── Building Dimension Diagram ─── */
function BuildingDiagram({ building }) {
  const b = building;
  if (!b) return null;
  return (
    <div className="building-box">
      <div style={{ fontFamily: F, fontWeight: 700, fontSize: 13, color: P.navy, marginBottom: 10 }}>{b.name}</div>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap", alignItems: "flex-start" }}>
        {/* Rectangle diagram */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <svg width="180" height="120">
            {/* Main building rectangle — proportional but capped */}
            <rect x="20" y="20" width="140" height="80" fill="#EFEFEF" stroke="#555" strokeWidth="1.5"/>
            {/* Width arrow */}
            <line x1="20" y1="110" x2="160" y2="110" stroke="#555" strokeWidth="0.8"/>
            <line x1="20" y1="106" x2="20" y2="114" stroke="#555" strokeWidth="0.8"/>
            <line x1="160" y1="106" x2="160" y2="114" stroke="#555" strokeWidth="0.8"/>
            {/* Length arrow */}
            <line x1="5" y1="20" x2="5" y2="100" stroke="#555" strokeWidth="0.8"/>
            <line x1="1" y1="20" x2="9" y2="20" stroke="#555" strokeWidth="0.8"/>
            <line x1="1" y1="100" x2="9" y2="100" stroke="#555" strokeWidth="0.8"/>
            {/* Labels */}
            <text x="90" y="118" textAnchor="middle" fontSize="9" fill="#555" fontFamily="DM Sans, sans-serif">{b.width}</text>
            <text x="5" y="64" textAnchor="middle" fontSize="9" fill="#555" fontFamily="DM Sans, sans-serif" transform="rotate(-90,5,64)">{b.length}</text>
          </svg>
        </div>
        {/* Dimension specs */}
        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "6px 16px", fontSize: 12 }}>
          {[
            ["Width",  b.width],
            ["Length", b.length],
            ...(b.height ? [["Ridge Height", b.height]] : []),
            ["Floor Area", b.area],
          ].map(([k, v], i) => (
            <div key={i} style={{ display: "contents" }}>
              <span style={{ fontFamily: F, color: "#666", whiteSpace: "nowrap" }}>{k}:</span>
              <span style={{ fontFamily: F, fontWeight: 700, color: "#111" }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── LINE SECTION ─── */
function LineSection({ sectionNum, lineKey, sectionTitle, cards, building, summary, legend, accent }) {
  return (
    <div className="section-block">
      {/* Section pill */}
      <div className="section-pill" style={{ background: P.sectionPill }}>
        <span style={{ background: accent, color: "#fff", padding: "2px 7px", borderRadius: 3, fontSize: 11 }}>§{sectionNum}</span>
        <span>{sectionTitle}</span>
      </div>

      {/* Summary strip */}
      <div className="summary-strip">
        {summary.map(([param, input, output], i) => (
          <div key={i} className="summary-cell">
            <div style={{ fontFamily: F, fontSize: 9, fontWeight: 700, color: "#666", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 4 }}>{param}</div>
            <div style={{ fontFamily: F, fontSize: 12, fontWeight: 700, color: "#111" }}>{input}</div>
            {output && <div style={{ fontFamily: F, fontSize: 11, color: "#555", marginTop: 2 }}>→ {output}</div>}
          </div>
        ))}
      </div>

      {/* Machine cards */}
      <div className="card-grid">
        {cards.map((card, i) => (
          <MachineCard key={i} {...card} />
        ))}
      </div>

      {/* Building diagram */}
      <div style={{ fontFamily: F, fontWeight: 700, fontSize: 13, color: "#333", borderBottom: "1px solid #DDD", paddingBottom: 6, marginBottom: 12 }}>
        Building Dimensions
      </div>
      <BuildingDiagram building={building} />

      {/* Line summary table */}
      <div style={{ fontFamily: F, fontWeight: 700, fontSize: 13, color: "#333", borderBottom: "1px solid #DDD", paddingBottom: 6, marginTop: 20, marginBottom: 12 }}>
        Line Summary
      </div>
      <table className="summary-table">
        <thead>
          <tr>
            <th>Parameter</th>
            <th>Input</th>
            <th>Output</th>
          </tr>
        </thead>
        <tbody>
          {summary.map(([param, input, output], i) => (
            <tr key={i}>
              <td style={{ fontWeight: 600 }}>{param}</td>
              <td>{input}</td>
              <td>{output || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Legend */}
      <div className="legend-block">
        <div style={{ fontFamily: F, fontWeight: 700, fontSize: 12, color: "#333", marginBottom: 8 }}>Legend</div>
        {legend.map((item, i) => (
          <div key={i} style={{ fontFamily: F, fontSize: 11, color: "#555", marginBottom: 4, paddingLeft: 14, position: "relative" }}>
            <span style={{ position: "absolute", left: 0, color: "#bbb" }}>•</span>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Card data (from S1Combined) ─── */
const efbCards = [
  { num: 1, title: "RCV-EFB-01 — EFB Receiving Hopper", icon: <HopperSVG/>, footer: "To CVB-EFB-01 drag chain conveyor", specs: [["Type","Steel hopper with hydraulic gate"],["Volume","50 m³ (~20 t capacity)"],["Material","Carbon steel + epoxy lining"],["Slope","60° sidewalls"],["Gate","Hydraulic sliding gate 1200×800mm"],["Discharge","Bottom gravity feed to conveyor"]] },
  { num: 2, title: "CVB-EFB-01 — EFB Drag Chain Conveyor", icon: <ConveyorSVG/>, footer: "Elevates +2.5m to ESD-01 shredder feed", specs: [["Type","Heavy-duty drag chain"],["Length","12 m"],["Width","600 mm"],["Motor","7.5 kW · 3-phase · VFD"],["Throughput","20 t/h EFB (62.5% MC)"],["Chain","100mm pitch carbon steel"]] },
  { num: 3, title: "ESD-01 — EFB Primary Shredder", icon: <ShredderSVG/>, footer: "Shredded EFB drops to CVB-EFB-02", specs: [["Type","Twin-shaft low-speed shredder"],["Motor","2×37 kW (74 kW total) · VFD"],["Throughput","20 t/h @ 62.5% MC"],["Shaft RPM","15–25"],["Blades","30–40 per shaft"],["Output","~100–150mm ribbons"]] },
  { num: 4, title: "CVB-EFB-02 — Shredder Discharge Conveyor", icon: <ConveyorSVG/>, footer: "Feeds ETR-EFB-01 trommel screen", specs: [["Type","Belt conveyor with cleated belt"],["Length","8 m"],["Width","600 mm"],["Motor","3.7 kW · 3-phase"],["Throughput","20 t/h shredded EFB"],["Incline","15° to trommel feed"]] },
  { num: 5, title: "ETR-EFB-01 — EFB Trommel Screen", icon: <ScreenSVG/>, footer: "Oversize recirculates to shredder · undersize to press", specs: [["Type","Rotary trommel screen"],["Diameter","1500 mm"],["Length","4000 mm"],["Motor","5.5 kW · geared drive"],["Screen size","50mm perforations"],["Throughput","20 t/h"]] },
  { num: 6, title: "ESP-EFB-01 — EFB Screw Press", icon: <PressSVG/>, footer: "Pressed EFB to hammer mill", specs: [["Type","Single-screw dewatering press"],["Motor","15 kW · VFD"],["Throughput","20 t/h @ 62.5% MC in → ~55% MC out"],["Pressure","3–5 bar progressive"],["Screen","Wedge wire 0.5mm slot"],["Filtrate","To mill POME system"]] },
  { num: 7, title: "EHM-EFB-01 — EFB Hammer Mill", icon: <MillSVG/>, footer: "NOISE ZONE — 85+ dBA · PPE required", specs: [["Type","Hammer mill with 2mm screen"],["Motor","110 kW · direct drive"],["Throughput","13 t/h (post-press, 55% MC)"],["Hammer tips","24 swing hammers"],["Screen","2mm perforated plate"],["Speed","1500 RPM"]] },
  { num: 8, title: "EVS-EFB-01 — EFB Vibrating Screen", icon: <ScreenSVG/>, footer: "Oversize return loop to EHM-EFB-01", specs: [["Type","Single-deck vibrating screen"],["Motor","2.2 kW vibratory"],["Screen size","2mm mesh"],["Throughput","13 t/h milled EFB"],["Oversize","Return to hammer mill"],["Undersize","To buffer bin"]] },
  { num: 9, title: "EDC-EFB-01 — EFB Baghouse Dust Collector", icon: <BaghouseSVG/>, footer: "Serves hammer mill + vibrating screen zone", specs: [["Type","Pulse-jet baghouse"],["Air volume","5000 m³/h"],["Motor","7.5 kW fan"],["Filter area","50 m²"],["Emission","<50 mg/Nm³"],["Bags","Polyester needle-felt"]] },
  { num: 10, title: "BIN-EFB-201 — EFB Buffer Storage Bin", icon: <BinSVG/>, footer: "Feeds S2 Chemical Treatment at controlled rate", specs: [["Type","Steel buffer bin with live-bottom"],["Volume","80 m³ (~32 t at 55% MC)"],["Material","Carbon steel + anti-bridging"],["Discharge","Twin-screw live-bottom feeder"],["Motor","2×3.7 kW"],["Capacity","8-hour buffer"]] },
];

const opdcCards = [
  { num: 1, title: "RCV-OPDC-01 — OPDC Receiving Bay", icon: <HopperSVG/>, footer: "Wheel loader feeds RH-OPDC-101", specs: [["Type","Concrete receiving bay with push-wall"],["Volume","25 m³ (~12 t)"],["Material","Reinforced concrete + epoxy floor"],["Discharge","Front-end loader to feeder"]] },
  { num: 2, title: "RH-OPDC-101 — OPDC Reciprocating Feeder", icon: <FeederSVG/>, footer: "Meters OPDC onto belt conveyor", specs: [["Type","Hydraulic reciprocating feeder"],["Motor","5.5 kW hydraulic"],["Throughput","5 t/h OPDC (70% MC)"],["Stroke","600mm"],["Width","800mm"]] },
  { num: 3, title: "CV-OPDC-101 — OPDC Belt Conveyor", icon: <ConveyorSVG/>, footer: "To OPR-01 screw press", specs: [["Type","Enclosed belt conveyor"],["Length","15 m"],["Width","500 mm"],["Motor","3.7 kW · 3-phase"],["Throughput","5 t/h"],["Incline","12°"]] },
  { num: 4, title: "OPR-01 — OPDC Screw Press", icon: <PressSVG/>, footer: "CLASS A GATE — moisture sample before release", specs: [["Type","Twin-screw dewatering press"],["Motor","22 kW · VFD"],["Throughput","5 t/h @ 70% MC in → 60% MC out"],["Pressure","5–8 bar"],["Screen","Wedge wire 0.75mm"],["Gate","CLASS A — mandatory QC checkpoint"]] },
  { num: 5, title: "OTR-01 — OPDC Trommel Screen", icon: <ScreenSVG/>, footer: "Removes oversized contaminants", specs: [["Type","Rotary trommel"],["Diameter","1200 mm"],["Length","3000 mm"],["Motor","4 kW · geared"],["Screen","30mm perforations"],["Throughput","3.3 t/h (post-press)"]] },
  { num: 6, title: "ODR-01 — OPDC Rotary Dryer", icon: <DryerSVG/>, footer: "Reduces MC for hammer mill processing", specs: [["Type","Direct-fired rotary drum dryer"],["Motor","15 kW drum + 7.5 kW fan"],["Throughput","3.3 t/h @ 60% MC in → 45% MC out"],["Diameter","1500 mm"],["Length","8000 mm"],["Fuel","Palm kernel shell (PKS)"]] },
  { num: 7, title: "OHM-01 — OPDC Hammer Mill", icon: <MillSVG/>, footer: "NOISE ZONE — 85+ dBA · PPE required", specs: [["Type","Hammer mill with 3mm screen"],["Motor","75 kW · direct drive"],["Throughput","3.3 t/h (45% MC)"],["Hammer tips","18 swing hammers"],["Screen","3mm perforated plate"],["Speed","1500 RPM"]] },
  { num: 8, title: "OVS-01 — OPDC Vibrating Screen", icon: <ScreenSVG/>, footer: "Oversize loop to OHM-01", specs: [["Type","Single-deck vibrating screen"],["Motor","1.5 kW vibratory"],["Screen","3mm mesh"],["Throughput","3.3 t/h milled OPDC"],["Oversize","Return to hammer mill"],["Undersize","To product bin"]] },
  { num: 9, title: "ODC-01 — OPDC Dust Collector", icon: <BaghouseSVG/>, footer: "Serves dryer + hammer mill zone", specs: [["Type","Pulse-jet baghouse"],["Air volume","3500 m³/h"],["Motor","5.5 kW fan"],["Filter area","35 m²"],["Emission","<50 mg/Nm³"]] },
  { num: 10, title: "BIN-OPDC-301 — OPDC Product Bin", icon: <BinSVG/>, footer: "24HR DWELL GATE — holds product before S2 release", specs: [["Type","Steel product bin with 24-hour dwell"],["Volume","40 m³ (~18 t)"],["Material","Carbon steel + moisture barrier"],["Dwell time","24 hours minimum"],["Discharge","Screw conveyor to S2"],["Gate","24HR DWELL GATE — mandatory hold"]] },
];

const posCards = [
  { num: 1, title: "PIT-POS-01 — POS Sludge Hopper", icon: <HopperSVG/>, footer: "Receives mill decanter discharge", specs: [["Type","At-grade hopper (not in-ground)"],["Volume","8 m³"],["Material","Epoxy-coated RC concrete"],["Discharge","Submersible pump to buffer tank"]] },
  { num: 2, title: "T-SLD-101 — POS Buffer Tank", icon: <TankSVG/>, footer: "Homogenises sludge before screening", specs: [["Type","Agitated buffer tank · sealed dome"],["Volume","5–8 m³"],["Material","SS304 stainless steel"],["Agitator","3.7 kW low-speed"],["Throughput","1.25 t/h @ 82% MC"]] },
  { num: 3, title: "SCR-POS-01 — POS Rotary Drum Screen", icon: <ScreenSVG/>, footer: "ICP-OES Fe gate checkpoint — protocol CFI-LAB-POME-001", specs: [["Type","Rotary drum screen"],["Motor","3.7 kW"],["Screen","1mm wedge wire"],["Throughput","1.25 t/h"],["Reject","Fibre + shell to EFB line"]] },
  { num: 4, title: "FP-POS-01 — POS Filter Press", icon: <FilterPressSVG/>, footer: "Dewatered POS cake to S2 conditioning mixer", specs: [["Type","Plate-and-frame filter press"],["Motor","11 kW hydraulic"],["Plates","40 × 800mm chambers"],["Throughput","1.25 t/h → ~0.56 t/h cake"],["Cake MC","~65%"],["Cycle","45 min press + 15 min discharge"]] },
];

const buildings = {
  efb:  { name: "Building A5 — EFB Processing Hall",        width: "30m", length: "60m", height: "12m", area: "1,800 m²" },
  opdc: { name: "Building A6 — OPDC Processing Hall",       width: "18m", length: "36m", height: "10m", area: "648 m²"   },
  pos:  { name: "Building A7 — Utility Building (POS)",     width: "12m", length: "18m", height: null,  area: "216 m²"   },
};

const summaries = {
  efb:  [["Throughput","20 t/h @ 62.5% MC","13 t/h @ 55% MC"],["Source","Mill EFB press discharge","Milled fibre to S2"],["Daily Input","~300 t fresh","~195 t milled"],["Installed Power","~298 kW total",""]],
  opdc: [["Throughput","5 t/h @ 70% MC","3.3 t/h @ 45% MC"],["Source","Mill decanter cake","Dried/milled cake to S2"],["Daily Input","~75 t fresh","~50 t processed"],["Installed Power","~206 kW total",""]],
  pos:  [["Throughput","1.5 t/h @ 82% MC","~0.55 t/h @ 65% MC"],["Source","Mill decanter sludge discharge","Dewatered cake"],["Daily Input","~30 t fresh (80–92% MC)","~13.5 t to S2"],["Installed Power","~20 kW total",""]],
};

const legends = {
  efb: [
    "MC = Moisture Content (wet basis %)",
    "EFB = Empty Fruit Bunch (palm oil mill waste fibre)",
    "VFD = Variable Frequency Drive",
    "Oversize from vibrating screen returns to hammer mill — closed loop",
    "NOISE ZONE = >85 dBA — mandatory hearing PPE",
  ],
  opdc: [
    "MC = Moisture Content (wet basis %)",
    "OPDC = Oil Palm Decanter Cake (solid fraction from 3-phase decanter)",
    "CLASS A gate = mandatory moisture QC before next process step",
    "24HR DWELL GATE = product must rest 24h minimum in bin before S2 release",
    "PKS = Palm Kernel Shell (fuel for rotary dryer)",
  ],
  pos: [
    "MC = Moisture Content (wet basis %)",
    "POS = Palm Oil Sludge (decanter discharge slurry) — NOT POME liquid effluent",
    "ICP-OES Fe gate: protocol CFI-LAB-POME-001 determines POS inclusion rate in S2 blend",
    "PIT-POS-01: at-grade hopper (not in-ground) — epoxy-coated RC concrete",
    "T-SLD-101: 5–8 m³ · SS304 · 3.7kW agitator · sealed dome",
  ],
};

const LINE_DEFS = [
  { key: "efb",  num: 1, sectionTitle: "EFB LINE — Empty Fruit Bunch Processing",        cards: efbCards,  accent: "#00695C" },
  { key: "opdc", num: 2, sectionTitle: "OPDC LINE — Oil Palm Decanter Cake Processing",  cards: opdcCards, accent: "#BF360C" },
  { key: "pos",  num: 3, sectionTitle: "POS LINE — Palm Oil Sludge Pre-Skimming",        cards: posCards,  accent: "#1565C0" },
];

const LINE_LABELS = { efb: "EFB Line", opdc: "OPDC Line", pos: "POS Line", all: "All Residues Combined" };

/* ─── Main component ─── */
export default function S1FloorPlanPrint() {
  const location  = useLocation();
  const navigate  = useNavigate();
  const params    = new URLSearchParams(location.search);
  const lineParam = params.get("line") || "all";
  const autoPrint = params.has("print");

  /* auto-trigger browser print dialog */
  useEffect(() => {
    if (!autoPrint) return;
    const t = setTimeout(() => window.print(), 400);
    return () => clearTimeout(t);
  }, [autoPrint]);

  /* Which lines to render */
  const activeLines = lineParam === "all"
    ? LINE_DEFS
    : LINE_DEFS.filter(l => l.key === lineParam);

  const docTitle = lineParam === "all"
    ? "S1 Floor Plan — All Residues Combined"
    : `S1 Floor Plan — ${LINE_LABELS[lineParam] || lineParam}`;

  const today = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <>
      <style>{PRINT_CSS}</style>

      {/* ── TOOLBAR (hidden on print) ── */}
      <div className="no-print">
        <button
          onClick={() => navigate("/s1-combined")}
          style={{
            padding: "6px 14px",
            background: "rgba(255,255,255,.12)",
            border: "1px solid rgba(255,255,255,.3)",
            borderRadius: 5,
            color: "#fff",
            fontFamily: F,
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          ← Back
        </button>
        <span style={{ fontFamily: F, fontSize: 13, fontWeight: 700, flex: 1 }}>{docTitle}</span>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {/* Line switcher */}
          {["all","efb","opdc","pos"].map(l => (
            <button
              key={l}
              onClick={() => navigate(`/s1-floor-plan-print?line=${l}`)}
              style={{
                padding: "5px 12px",
                background: lineParam === l ? "rgba(255,255,255,.25)" : "rgba(255,255,255,.07)",
                border: `1px solid ${lineParam === l ? "rgba(255,255,255,.6)" : "rgba(255,255,255,.2)"}`,
                borderRadius: 4,
                color: "#fff",
                fontFamily: F,
                fontSize: 11,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {LINE_LABELS[l]}
            </button>
          ))}
          <button
            onClick={() => window.print()}
            style={{
              padding: "6px 16px",
              background: "#00695C",
              border: "none",
              borderRadius: 5,
              color: "#fff",
              fontFamily: F,
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              marginLeft: 8,
            }}
          >
            &#128196; Print / PDF
          </button>
        </div>
      </div>

      {/* ── DOCUMENT ── */}
      <div className="fp-doc">

        {/* Document header */}
        <div className="fp-doc-header">
          <div>
            <div style={{ fontFamily: FH, fontWeight: 700, fontSize: 22, color: "#FFFFFF", letterSpacing: ".02em" }}>CFI Deep Tech</div>
            <div style={{ fontFamily: F, fontSize: 13, color: "rgba(255,255,255,0.6)", marginTop: 3 }}>S1 Mechanical Pre-Processing</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: F, fontSize: 16, fontWeight: 700, color: "#FFFFFF" }}>{docTitle}</div>
            <div style={{ fontFamily: F, fontSize: 11, color: "rgba(255,255,255,.55)", marginTop: 4 }}>
              Design Basis: 60 TPH FFB · v2 Final · March 2026
            </div>
            <div style={{ fontFamily: F, fontSize: 10, color: "rgba(255,255,255,.4)", marginTop: 2 }}>
              Printed: {today}
            </div>
          </div>
        </div>

        {/* Line indicator strip */}
        <div style={{
          background: "#F4F4F4",
          borderBottom: "1px solid #DDD",
          padding: "10px 28px",
          display: "flex",
          gap: 14,
          alignItems: "center",
          flexWrap: "wrap",
        }}>
          <span style={{ fontFamily: F, fontSize: 11, fontWeight: 700, color: "#444", textTransform: "uppercase", letterSpacing: ".06em" }}>
            Lines Shown:
          </span>
          {activeLines.map(l => (
            <span key={l.key} style={{
              padding: "3px 10px",
              background: "#222",
              color: "#fff",
              borderRadius: 3,
              fontFamily: F,
              fontSize: 11,
              fontWeight: 700,
            }}>{LINE_LABELS[l.key]}</span>
          ))}
          <span style={{ marginLeft: "auto", fontFamily: F, fontSize: 10, color: "#888" }}>
            CFI-S1-FP-{lineParam.toUpperCase()} · Rev 01
          </span>
        </div>

        {/* Line sections */}
        {activeLines.map((line) => (
          <LineSection
            key={line.key}
            sectionNum={line.num}
            lineKey={line.key}
            sectionTitle={line.sectionTitle}
            cards={line.cards}
            building={buildings[line.key]}
            summary={summaries[line.key]}
            legend={legends[line.key]}
            accent={line.accent}
          />
        ))}

        {/* Document footer */}
        <div className="doc-footer">
          <span>CFI Deep Tech · S1 Floor Plan · {lineParam === "all" ? "All Residues" : LINE_LABELS[lineParam]}</span>
          <span>CONFIDENTIAL — Internal Use Only</span>
          <span>Printed: {today}</span>
        </div>
      </div>
    </>
  );
}
