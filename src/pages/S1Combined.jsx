import { useState } from "react";
import { useNavigate } from "react-router-dom";

const F = "'DM Sans', sans-serif";
const FH = "'EB Garamond', serif";

/* ─── SVG icon helpers ─── */
function HopperSVG() {
  return (
    <svg viewBox="0 0 100 100" width="90" height="90">
      <polygon points="20,20 80,20 70,80 30,80" fill="none" stroke="#333" strokeWidth="2"/>
      <line x1="50" y1="80" x2="50" y2="95" stroke="#333" strokeWidth="2"/>
    </svg>
  );
}
function ConveyorSVG() {
  return (
    <svg viewBox="0 0 110 60" width="100" height="55">
      <line x1="10" y1="50" x2="100" y2="20" stroke="#333" strokeWidth="2"/>
      <circle cx="10" cy="50" r="6" fill="none" stroke="#333" strokeWidth="2"/>
      <circle cx="100" cy="20" r="6" fill="none" stroke="#333" strokeWidth="2"/>
      <line x1="10" y1="56" x2="100" y2="26" stroke="#333" strokeWidth="1" strokeDasharray="3"/>
    </svg>
  );
}
function ShredderSVG() {
  return (
    <svg viewBox="0 0 100 100" width="90" height="90">
      <rect x="15" y="15" width="70" height="70" rx="4" fill="none" stroke="#333" strokeWidth="2"/>
      <circle cx="38" cy="50" r="12" fill="none" stroke="#333" strokeWidth="1.5"/>
      <circle cx="62" cy="50" r="12" fill="none" stroke="#333" strokeWidth="1.5"/>
      <line x1="38" y1="38" x2="38" y2="62" stroke="#333" strokeWidth="1"/>
      <line x1="26" y1="50" x2="50" y2="50" stroke="#333" strokeWidth="1"/>
    </svg>
  );
}
function BinSVG({ label }) {
  return (
    <svg viewBox="0 0 100 100" width="90" height="90">
      <rect x="25" y="10" width="50" height="60" rx="3" fill="none" stroke="#333" strokeWidth="2"/>
      <polygon points="25,70 75,70 65,90 35,90" fill="none" stroke="#333" strokeWidth="2"/>
      {label && <text x="50" y="55" textAnchor="middle" fontSize="12" fill="#333" fontFamily={F}>{label}</text>}
    </svg>
  );
}
function MillSVG() {
  return (
    <svg viewBox="0 0 100 100" width="90" height="90">
      <rect x="15" y="20" width="70" height="60" rx="4" fill="none" stroke="#333" strokeWidth="2"/>
      <circle cx="50" cy="50" r="18" fill="none" stroke="#333" strokeWidth="2"/>
      <line x1="50" y1="32" x2="50" y2="68" stroke="#333" strokeWidth="1.5"/>
      <line x1="32" y1="50" x2="68" y2="50" stroke="#333" strokeWidth="1.5"/>
      <line x1="37" y1="37" x2="63" y2="63" stroke="#333" strokeWidth="1"/>
      <line x1="63" y1="37" x2="37" y2="63" stroke="#333" strokeWidth="1"/>
    </svg>
  );
}
function ScreenSVG() {
  return (
    <svg viewBox="0 0 110 70" width="100" height="63">
      <rect x="5" y="10" width="100" height="50" rx="3" fill="none" stroke="#333" strokeWidth="2"/>
      <line x1="5" y1="35" x2="105" y2="35" stroke="#333" strokeWidth="1" strokeDasharray="4,3"/>
      <line x1="30" y1="10" x2="30" y2="60" stroke="#333" strokeWidth="0.5" strokeDasharray="2"/>
      <line x1="55" y1="10" x2="55" y2="60" stroke="#333" strokeWidth="0.5" strokeDasharray="2"/>
      <line x1="80" y1="10" x2="80" y2="60" stroke="#333" strokeWidth="0.5" strokeDasharray="2"/>
    </svg>
  );
}
function PressSVG() {
  return (
    <svg viewBox="0 0 100 100" width="90" height="90">
      <rect x="10" y="15" width="80" height="70" rx="4" fill="none" stroke="#333" strokeWidth="2"/>
      <rect x="30" y="25" width="40" height="50" rx="2" fill="none" stroke="#333" strokeWidth="1.5"/>
      <line x1="50" y1="5" x2="50" y2="15" stroke="#333" strokeWidth="3"/>
      <line x1="35" y1="40" x2="65" y2="40" stroke="#333" strokeWidth="1"/>
      <line x1="35" y1="50" x2="65" y2="50" stroke="#333" strokeWidth="1"/>
      <line x1="35" y1="60" x2="65" y2="60" stroke="#333" strokeWidth="1"/>
    </svg>
  );
}
function TankSVG() {
  return (
    <svg viewBox="0 0 100 100" width="90" height="90">
      <ellipse cx="50" cy="25" rx="30" ry="10" fill="none" stroke="#333" strokeWidth="2"/>
      <line x1="20" y1="25" x2="20" y2="75" stroke="#333" strokeWidth="2"/>
      <line x1="80" y1="25" x2="80" y2="75" stroke="#333" strokeWidth="2"/>
      <ellipse cx="50" cy="75" rx="30" ry="10" fill="none" stroke="#333" strokeWidth="2"/>
    </svg>
  );
}
function DecanterSVG() {
  return (
    <svg viewBox="0 0 120 70" width="110" height="64">
      <ellipse cx="60" cy="35" rx="50" ry="25" fill="none" stroke="#333" strokeWidth="2"/>
      <line x1="10" y1="35" x2="110" y2="35" stroke="#333" strokeWidth="1" strokeDasharray="4"/>
      <circle cx="60" cy="35" r="8" fill="none" stroke="#333" strokeWidth="1.5"/>
    </svg>
  );
}

/* ─── Machine card component ─── */
function MachineCard({ number, title, icon, specs, footer }) {
  return (
    <div style={{
      border: "2px solid #111", background: "#fff", display: "flex", flexDirection: "column",
      position: "relative", minHeight: 260,
    }}>
      <div style={{
        position: "absolute", top: 0, left: 0, background: "#111", color: "#fff",
        fontFamily: F, fontWeight: 500, fontSize: 18, padding: "6px 12px 6px 16px",
        borderBottomRightRadius: 8, zIndex: 2,
      }}>{number}</div>
      <div style={{ display: "flex", flex: 1 }}>
        <div style={{
          width: 130, background: "#f9f9f9", borderRight: "2px solid #ddd",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>{icon}</div>
        <div style={{ flex: 1, padding: "40px 16px 12px", display: "flex", flexDirection: "column" }}>
          <div style={{ fontFamily: F, fontWeight: 700, fontSize: 15, color: "#111", marginBottom: 10 }}>{title}</div>
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "6px 12px", fontSize: 13 }}>
            {specs.map((s, i) => {
              if (s.full) {
                return (
                  <div key={i} style={{ gridColumn: "1 / -1", display: "flex", gap: 16 }}>
                    {s.pairs.map((p, j) => (
                      <div key={j} style={{ display: "flex", gap: 6, ...(j > 0 ? { borderLeft: "1px solid #ddd", paddingLeft: 16 } : {}) }}>
                        <span style={{ fontFamily: F, color: "#666" }}>{p.label}:</span>
                        <span style={{ fontFamily: F, color: "#111", fontWeight: 500 }}>{p.value}</span>
                      </div>
                    ))}
                  </div>
                );
              }
              return [
                <span key={`l${i}`} style={{ fontFamily: F, color: "#666", whiteSpace: "nowrap" }}>{s.label}:</span>,
                <span key={`v${i}`} style={{ fontFamily: F, color: "#111", fontWeight: 500 }}>{s.value}</span>,
              ];
            })}
          </div>
        </div>
      </div>
      {footer && (
        <div style={{
          borderTop: "1px dashed #ccc", padding: "10px 16px",
          fontFamily: F, fontSize: 12, color: "#888", display: "flex", alignItems: "center", gap: 6,
        }}>
          <span style={{ color: "#aaa" }}>▾</span> {footer}
        </div>
      )}
    </div>
  );
}

/* ─── Guardrails component ─── */
function Guardrails({ title, items }) {
  const typeColors = {
    critical: { bg: "#ffe6e6", border: "#cc2222", color: "#cc2222" },
    process: { bg: "#fff4e6", border: "#9a6000", color: "#9a6000" },
    test: { bg: "#e6f3ff", border: "#185FA5", color: "#185FA5" },
    info: { bg: "#f5f5f5", border: "#999", color: "#666" },
  };
  return (
    <div style={{ marginTop: 24, padding: 16, border: "2px solid #ddd", borderRadius: 4, background: "#fafafa" }}>
      <div style={{ fontFamily: F, fontWeight: 700, fontSize: 16, color: "#111", marginBottom: 12 }}>{title}</div>
      {items.map((item, i) => {
        const c = typeColors[item.type] || typeColors.info;
        return (
          <div key={i} style={{
            fontFamily: F, fontSize: 13, padding: "8px 12px", marginBottom: 6, borderRadius: 3,
            display: "flex", alignItems: "center", gap: 8,
            background: c.bg, borderLeft: `4px solid ${c.border}`, color: c.color,
            ...(item.type === "info" ? { fontStyle: "italic" } : {}),
          }}>
            <span>⚠</span> {item.text}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Building dimensions ─── */
function BuildingDimension({ width, height, label, power, structure }) {
  return (
    <div style={{ margin: "24px 0", position: "relative" }}>
      <div style={{ textAlign: "center", marginBottom: 8 }}>
        <div style={{ fontFamily: F, fontSize: 12, color: "#185FA5", fontWeight: 500 }}>Width</div>
        <div style={{ height: 2, background: "#bbb", margin: "4px auto", maxWidth: 300, position: "relative" }}>
          <div style={{ position: "absolute", left: 0, top: -4, width: 2, height: 10, background: "#bbb" }} />
          <div style={{ position: "absolute", right: 0, top: -4, width: 2, height: 10, background: "#bbb" }} />
        </div>
        <div style={{ fontFamily: F, fontSize: 14, fontWeight: 700, color: "#185FA5" }}>{width}</div>
      </div>
      <div style={{ border: "2px solid #185FA5", padding: 20, background: "#f9fcff", position: "relative", marginRight: 60 }}>
        <div style={{ fontFamily: F, fontSize: 14, color: "#333", textAlign: "center", lineHeight: 1.8 }}>
          <strong>{label}</strong><br />
          {width} × {height}<br />
          Installed Power: ~{power}<br />
          {structure}
        </div>
        <div style={{
          position: "absolute", right: -55, top: 0, bottom: 0,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{ width: 2, flex: 1, background: "#bbb", position: "relative" }}>
            <div style={{ position: "absolute", top: 0, left: -4, width: 10, height: 2, background: "#bbb" }} />
            <div style={{ position: "absolute", bottom: 0, left: -4, width: 10, height: 2, background: "#bbb" }} />
          </div>
          <div style={{ fontFamily: F, fontSize: 12, color: "#185FA5", fontWeight: 500, writingMode: "vertical-rl", transform: "rotate(180deg)", margin: "6px 0" }}>Height</div>
          <div style={{ fontFamily: F, fontSize: 14, fontWeight: 700, color: "#185FA5", writingMode: "vertical-rl", transform: "rotate(180deg)" }}>{height}</div>
        </div>
      </div>
    </div>
  );
}

/* ─── Summary table ─── */
function SummaryTable({ rows }) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 16, fontSize: 13 }}>
      <thead>
        <tr>
          {rows[0].map((h, i) => (
            <th key={i} style={{ fontFamily: F, fontWeight: 700, background: "#f5f5f5", border: "1px solid #ddd", padding: 10, textAlign: "left" }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.slice(1).map((row, ri) => (
          <tr key={ri}>
            {row.map((cell, ci) => (
              <td key={ci} style={{ fontFamily: F, border: "1px solid #ddd", padding: 10 }}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/* ─── Legend ─── */
function Legend({ items }) {
  return (
    <div style={{ marginTop: 24, padding: 16, background: "#f9f9f9", border: "1px solid #ddd", borderRadius: 4 }}>
      <div style={{ fontFamily: F, fontWeight: 700, fontSize: 14, marginBottom: 10 }}>Legend</div>
      {items.map((item, i) => (
        <div key={i} style={{ fontFamily: F, fontSize: 12, color: "#666", marginBottom: 6, paddingLeft: 16, position: "relative" }}>
          <span style={{ position: "absolute", left: 0, color: "#999" }}>•</span>
          {item}
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════ */
/* ═══ EFB TAB DATA ═══ */
const efbCards = [
  { n: "①", title: "RCV-EFB-01 — EFB Receiving Hopper", icon: <HopperSVG />,
    specs: [
      { label: "Type", value: "Steel hopper with hydraulic gate" },
      { label: "Volume", value: "50 m³ (~20 t capacity)" },
      { label: "Material", value: "Carbon steel + epoxy lining" },
      { label: "Slope", value: "60° sidewalls" },
      { label: "Gate", value: "Hydraulic sliding gate 1200×800mm" },
      { label: "Discharge", value: "Bottom gravity feed to conveyor" },
    ], footer: "To CVB-EFB-01 drag chain conveyor" },
  { n: "②", title: "CVB-EFB-01 — EFB Drag Chain Conveyor", icon: <ConveyorSVG />,
    specs: [
      { label: "Type", value: "Heavy-duty drag chain" },
      { full: true, pairs: [{ label: "Length", value: "12 m" }, { label: "Width", value: "600 mm" }] },
      { label: "Motor", value: "7.5 kW · 3-phase · VFD" },
      { label: "Throughput", value: "20 t/h EFB (62.5% MC)" },
      { label: "Chain", value: "100mm pitch carbon steel" },
      { label: "Manufacturer", value: "TBC after RFQ" },
    ], footer: "Elevates +2.5m to ESD-01 shredder feed" },
  { n: "③", title: "ESD-01 — EFB Primary Shredder", icon: <ShredderSVG />,
    specs: [
      { label: "Type", value: "Twin-shaft low-speed shredder" },
      { label: "Motor", value: "2×37 kW (74 kW total) · VFD" },
      { label: "Throughput", value: "20 t/h @ 62.5% MC" },
      { full: true, pairs: [{ label: "Shaft RPM", value: "15–25" }, { label: "Blades", value: "30–40 per shaft" }] },
      { label: "Output", value: "~100–150mm ribbons" },
      { label: "Manufacturer", value: "TBC after RFQ" },
    ], footer: "To CVB-EFB-02 incline conveyor" },
  { n: "④", title: "CVB-EFB-02 — Incline Belt Conveyor", icon: <ConveyorSVG />,
    specs: [
      { label: "Type", value: "Cleated belt · 30° incline" },
      { full: true, pairs: [{ label: "Length", value: "8 m" }, { label: "Width", value: "600 mm" }] },
      { label: "Motor", value: "5.5 kW · 3-phase" },
      { label: "Lift", value: "+4.0 m elevation gain" },
      { label: "Cleats", value: "150mm height · 300mm spacing" },
      { label: "Manufacturer", value: "TBC after RFQ" },
    ], footer: "Feeds BIN-EFB-01 buffer bin at +4.0m" },
  { n: "⑤", title: "BIN-EFB-01 — EFB Buffer Bin", icon: <BinSVG />,
    specs: [
      { label: "Type", value: "Steel bin · conical bottom" },
      { label: "Volume", value: "50 m³ (~2.5hr buffer)" },
      { label: "Material", value: "Carbon steel 6mm + epoxy" },
      { full: true, pairs: [{ label: "Height", value: "6.5 m" }, { label: "Diameter", value: "3.5 m" }] },
      { label: "Discharge", value: "Screw feeder VFD-controlled" },
      { label: "Manufacturer", value: "TBC after RFQ" },
    ], footer: "Gravity discharge to ELB-01 lump breaker" },
  { n: "⑥", title: "ELB-01 — EFB Lump Breaker", icon: <ShredderSVG />,
    specs: [
      { label: "Type", value: "Twin-roller lump breaker" },
      { label: "Motor", value: "11 kW · 3-phase · VFD" },
      { label: "Roller gap", value: "30–50mm adjustable" },
      { full: true, pairs: [{ label: "Roller Ø", value: "400 mm" }, { label: "Length", value: "600 mm" }] },
      { label: "Output", value: "~30–50mm fragments" },
      { label: "Manufacturer", value: "TBC after RFQ" },
    ], footer: "To EHM-01 hammer mill via chute" },
  { n: "⑦", title: "EHM-01 — EFB Hammer Mill", icon: <MillSVG />,
    specs: [
      { label: "Type", value: "High-speed hammer mill · 2mm screen" },
      { label: "Motor", value: "37 kW nameplate (24 kW @ 65% Asian derate)" },
      { label: "Screen", value: "2.0mm perforated · D90 target" },
      { full: true, pairs: [{ label: "Rotor Ø", value: "600 mm" }, { label: "RPM", value: "1200–1500" }] },
      { label: "Isolation", value: "Spring mounts only (CLASS A lock)" },
      { label: "Manufacturer", value: "TBC after RFQ" },
    ], footer: "Oversize loops back to ⑦ · Baghouse EDC-01 parallel dust collection" },
  { n: "⑧", title: "ESC-01 — EFB Vibrating Screen", icon: <ScreenSVG />,
    specs: [
      { label: "Type", value: "Linear vibrating screen · 2mm mesh" },
      { label: "Motor", value: "2×1.5 kW (3 kW total) vibration motors" },
      { label: "Mesh", value: "2.0mm stainless steel" },
      { full: true, pairs: [{ label: "Deck", value: "1.2×2.5 m" }, { label: "Angle", value: "5°" }] },
      { label: "Undersize", value: "To BIN-EFB-301 (S2 ready)" },
      { label: "Manufacturer", value: "TBC after RFQ" },
    ], footer: "Oversize returns to EHM-01 ⑦ for re-milling" },
  { n: "⑨", title: "EPR-01 — EFB Screw Press", icon: <PressSVG />,
    specs: [
      { label: "Type", value: "Twin-screw dewatering press" },
      { label: "Motor", value: "15 kW · 3-phase · VFD" },
      { label: "Throughput", value: "20 t/h wet feed" },
      { label: "MC reduction", value: "62.5% → 45–50%" },
      { label: "Screen gap", value: "0.5mm wedge wire" },
      { label: "Manufacturer", value: "TBC after RFQ" },
    ], footer: "Filtrate to POME pond · Cake to BIN-EFB-301 (≤50% MC Gate B.G2)" },
  { n: "⑩", title: "BIN-EFB-301 — S2 Buffer Bin", icon: <BinSVG label="S2" />,
    specs: [
      { label: "Type", value: "Steel bin · live bottom screw" },
      { label: "Volume", value: "50 m³ (~2.5hr @ S2 rate)" },
      { label: "Material", value: "Carbon steel + epoxy · teal S2 marker" },
      { full: true, pairs: [{ label: "MC spec", value: "45–50%" }, { label: "D90", value: "≤2mm" }] },
      { label: "Gate", value: "B.G2 press MC ≤50%" },
      { label: "Manufacturer", value: "TBC after RFQ" },
    ], footer: "Stage 2 feed ready · EFB processing complete" },
];

const efbGuardrails = [
  { type: "critical", text: "EHM-01 hammer mill: spring isolation ONLY — never rigid anchor (vibration damage risk)" },
  { type: "critical", text: "Oversize return: always loops back to EHM-01 ⑦ hammer mill — never to ELB-01 ⑥ or ESD-01 ③" },
  { type: "process", text: "Press filtrate + all wash water → POME pond only — never to substrate" },
  { type: "process", text: "Gate B.G2: EPR-01 press cake MC ≤50% before BIN-EFB-301 acceptance" },
  { type: "test", text: "Asian equipment derate: 65% of nameplate — EHM-01 runs 24kW not 37kW" },
  { type: "info", text: "EDC-01 baghouse: parallel unit duct-fed from EHM-01 ⑦ — not inline" },
];

/* ═══ OPDC TAB DATA ═══ */
const opdcCards = [
  { n: "①", title: "RCV-OPDC-01 — OPDC Receiving Hopper", icon: <HopperSVG />,
    specs: [
      { label: "Type", value: "Steel hopper with hydraulic gate" },
      { label: "Volume", value: "20 m³ (~8 t capacity @ 70% MC)" },
      { label: "Material", value: "Carbon steel + epoxy lining" },
      { label: "Slope", value: "60° sidewalls" },
      { label: "Gate", value: "Hydraulic sliding gate 800×600mm" },
      { label: "Discharge", value: "Bottom gravity feed to conveyor" },
    ], footer: "To CVB-OPDC-01 drag chain conveyor" },
  { n: "②", title: "CVB-OPDC-01 — OPDC Drag Chain Conveyor", icon: <ConveyorSVG />,
    specs: [
      { label: "Type", value: "Heavy-duty drag chain" },
      { full: true, pairs: [{ label: "Length", value: "10 m" }, { label: "Width", value: "500 mm" }] },
      { label: "Motor", value: "5.5 kW · 3-phase · VFD" },
      { label: "Throughput", value: "5 t/h OPDC (70–75% MC)" },
      { label: "Chain", value: "100mm pitch carbon steel" },
      { label: "Manufacturer", value: "TBC after RFQ" },
    ], footer: "Elevates +2.5m to OSD-01 shredder feed" },
  { n: "③", title: "OSD-01 — OPDC Primary Shredder", icon: <ShredderSVG />,
    specs: [
      { label: "Type", value: "Twin-shaft low-speed shredder" },
      { label: "Motor", value: "2×22 kW (44 kW total) · VFD" },
      { label: "Throughput", value: "5 t/h @ 70–75% MC" },
      { full: true, pairs: [{ label: "Shaft RPM", value: "15–25" }, { label: "Blades", value: "25–35 per shaft" }] },
      { label: "Output", value: "~80–120mm fragments" },
      { label: "Manufacturer", value: "TBC after RFQ" },
    ], footer: "To CVB-OPDC-02 incline conveyor" },
  { n: "④", title: "CVB-OPDC-02 — Incline Belt Conveyor", icon: <ConveyorSVG />,
    specs: [
      { label: "Type", value: "Cleated belt · 30° incline" },
      { full: true, pairs: [{ label: "Length", value: "7 m" }, { label: "Width", value: "500 mm" }] },
      { label: "Motor", value: "4 kW · 3-phase" },
      { label: "Lift", value: "+3.5 m elevation gain" },
      { label: "Cleats", value: "120mm height · 250mm spacing" },
      { label: "Manufacturer", value: "TBC after RFQ" },
    ], footer: "Feeds BIN-OPDC-01 buffer bin at +3.5m" },
  { n: "⑤", title: "BIN-OPDC-01 — OPDC Buffer Bin", icon: <BinSVG />,
    specs: [
      { label: "Type", value: "Steel bin · conical bottom" },
      { label: "Volume", value: "20 m³ (~4hr buffer)" },
      { label: "Material", value: "Carbon steel 6mm + epoxy" },
      { full: true, pairs: [{ label: "Height", value: "5.5 m" }, { label: "Diameter", value: "2.5 m" }] },
      { label: "Discharge", value: "Screw feeder VFD-controlled" },
      { label: "Manufacturer", value: "TBC after RFQ" },
    ], footer: "Gravity discharge to OLB-01 lump breaker" },
  { n: "⑥", title: "OLB-01 — OPDC Lump Breaker", icon: <ShredderSVG />,
    specs: [
      { label: "Type", value: "Twin-roller lump breaker" },
      { label: "Motor", value: "7.5 kW · 3-phase · VFD" },
      { label: "Roller gap", value: "25–40mm adjustable" },
      { full: true, pairs: [{ label: "Roller Ø", value: "350 mm" }, { label: "Length", value: "500 mm" }] },
      { label: "Output", value: "~25–40mm fragments" },
      { label: "Manufacturer", value: "TBC after RFQ" },
    ], footer: "To OHM-01 hammer mill via chute" },
  { n: "⑦", title: "OHM-01 — OPDC Hammer Mill", icon: <MillSVG />,
    specs: [
      { label: "Type", value: "High-speed hammer mill · 2mm screen" },
      { label: "Motor", value: "22 kW nameplate (14 kW @ 65% Asian derate)" },
      { label: "Screen", value: "2.0mm perforated · D90 target" },
      { full: true, pairs: [{ label: "Rotor Ø", value: "500 mm" }, { label: "RPM", value: "1200–1500" }] },
      { label: "Isolation", value: "Spring mounts only (CLASS A lock)" },
      { label: "Manufacturer", value: "TBC after RFQ" },
    ], footer: "Oversize loops back to ⑦ · Baghouse ODC-01 parallel dust collection" },
  { n: "⑧", title: "OSC-01 — OPDC Vibrating Screen", icon: <ScreenSVG />,
    specs: [
      { label: "Type", value: "Linear vibrating screen · 2mm mesh" },
      { label: "Motor", value: "2×1.1 kW (2.2 kW total) vibration motors" },
      { label: "Mesh", value: "2.0mm stainless steel" },
      { full: true, pairs: [{ label: "Deck", value: "1.0×2.0 m" }, { label: "Angle", value: "5°" }] },
      { label: "Undersize", value: "To BIN-OPDC-301 (S2 ready)" },
      { label: "Manufacturer", value: "TBC after RFQ" },
    ], footer: "Oversize returns to OHM-01 ⑦ for re-milling" },
  { n: "⑨", title: "OPR-01 — OPDC Screw Press", icon: <PressSVG />,
    specs: [
      { label: "Type", value: "Twin-screw dewatering press" },
      { label: "Motor", value: "11 kW · 3-phase · VFD" },
      { label: "Throughput", value: "5 t/h wet feed" },
      { label: "MC reduction", value: "70% → 55–60%" },
      { label: "Screen gap", value: "0.5mm wedge wire" },
      { label: "Gate", value: "MC ≥ 40% LOCKED (CLASS A)" },
    ], footer: "Filtrate to POME pond · Cake to BIN-OPDC-301" },
  { n: "⑩", title: "BIN-OPDC-301 — S2 Buffer Bin + 24hr Dwell", icon: <BinSVG label="24H" />,
    specs: [
      { label: "Type", value: "Steel bin · live bottom rake + 24hr dwell" },
      { label: "Volume", value: "85 m³ (~24hr buffer)" },
      { label: "Material", value: "Carbon steel + epoxy" },
      { full: true, pairs: [{ label: "MC spec", value: "55–60%" }, { label: "D90", value: "≤2mm" }] },
      { label: "Gate", value: "C.G2/G3 pH 8.0–9.0 post-24hr dwell" },
      { label: "Manufacturer", value: "TBC after RFQ" },
    ], footer: "Stage 2 feed ready · OPDC processing complete after 24hr dwell" },
];

const opdcGuardrails = [
  { type: "critical", text: "OHM-01 hammer mill: spring isolation ONLY — never rigid anchor" },
  { type: "critical", text: "MC ≥ 40% LOCKED (CLASS A) — OPR-01 screw press minimum MC gate" },
  { type: "process", text: "24hr dwell in BIN-OPDC-301 mandatory before S2 transfer" },
  { type: "process", text: "pH 8.0–9.0 target post-24hr conditioning" },
  { type: "test", text: "Asian equipment derate: 65% of nameplate — OHM-01 runs 14kW not 22kW" },
  { type: "info", text: "ODC-01 baghouse: shared with EFB line EDC-01" },
];

/* ═══ POS TAB DATA ═══ */
const posCards = [
  { n: "①", title: "RCV-POS-01 — POS Sludge Receiving Hopper", icon: <HopperSVG />,
    specs: [
      { label: "Type", value: "Reinforced concrete · epoxy-coated" },
      { label: "Volume", value: "15 m³ (3.5m × 2.5m × 2.0m)" },
      { label: "Slope", value: "60° sidewalls" },
      { label: "MC In", value: "82%" },
      { label: "Drainage", value: "150mm bottom valve → POME system" },
      { label: "Gate", value: "ICP-OES Fe checkpoint" },
    ], footer: "To T-SLD-101 sludge buffer tank via pump PMP-POS-01" },
  { n: "②", title: "T-SLD-101 — Sludge Buffer Tank", icon: <TankSVG />,
    specs: [
      { label: "Type", value: "SS304 stainless · sealed dome + biofilter vent" },
      { label: "Volume", value: "5–8 m³ working (Ø2.2m × 1.8–2.2m)" },
      { label: "Agitator", value: "3.7 kW top-entry (prevents settling)" },
      { label: "Instruments", value: "Temp sensor · pH probe · Fe meter" },
      { label: "Feed pump", value: "0.75 kW · pipe DN100" },
      { label: "Manufacturer", value: "TBC after RFQ" },
    ], footer: "To SCR-POS-01 rotary drum screen" },
  { n: "③", title: "SCR-POS-01 — Rotary Drum Screen", icon: <ScreenSVG />,
    specs: [
      { label: "Type", value: "SS316L drum · 2mm aperture" },
      { label: "Motor", value: "1.5 kW" },
      { label: "Throughput", value: "1.5 t/h at 82% MC" },
      { label: "Function", value: "Removes fibrous solids > 2mm" },
      { label: "Reject", value: "To EFB composting line" },
      { label: "Manufacturer", value: "TBC after RFQ" },
    ], footer: "Screened sludge to MIX-POS-01 conditioning mixer" },
  { n: "④", title: "MIX-POS-01 — Conditioning Mixer", icon: <ShredderSVG />,
    specs: [
      { label: "Type", value: "SS304 · paddle mixer" },
      { label: "Motor", value: "2.2 kW" },
      { label: "Volume", value: "500L batch" },
      { label: "CaCO₃ dosing", value: "Based on Fe gate result" },
      { label: "pH target", value: "Raise from 4.4 → 5.5–6.0" },
      { label: "Residence", value: "15–20 min per batch" },
    ], footer: "To FP-POS-01 filter press" },
  { n: "⑤", title: "DEC-SLD-101 — Decanter Centrifuge", icon: <DecanterSVG />,
    specs: [
      { label: "Type", value: "Horizontal 3-phase centrifuge" },
      { label: "Motor", value: "55 kW" },
      { label: "Throughput", value: "3 m³/h · bowl 250–350mm" },
      { label: "MC reduction", value: "78% → 65%" },
      { label: "CAPEX", value: "RFQ $80K–$150K" },
      { label: "Supplier", value: "Alfa Laval / SCK-Modipalm / PT Kharismapratama" },
    ], footer: "Filtrate to POME treatment · Cake to S2 composting/BSF" },
];

const posGuardrails = [
  { type: "critical", text: "Fe < 3,000 mg/kg DM target — ICP-OES checkpoint at sludge pit" },
  { type: "critical", text: "No Cr > 20 mg/kg — heavy metal gate at sludge pit" },
  { type: "process", text: "CaCO₃ dosing based on Fe gate: <3000 = 20% w/w, 3000–5000 = 10–15%, 5000–8000 = 5–10%, >8000 = protocol review" },
  { type: "process", text: "pH target: raise from 4.4 → 5.5–6.0 via CaCO₃ conditioning" },
  { type: "test", text: "Decanter centrifuge: Alfa Laval preferred — RFQ $80K–$150K" },
  { type: "info", text: "Reject from drum screen → EFB composting line" },
];

/* ═══ MAIN COMPONENT ═══ */
export default function S1Combined() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("efb");

  const tabs = [
    { id: "efb", label: "EFB Line", color: "#40D7C5" },
    { id: "opdc", label: "OPDC Line", color: "#F5A623" },
    { id: "pos", label: "POS Line", color: "#4A9EDB" },
  ];

  const tabData = {
    efb: {
      title: "EFB LINE — Empty Fruit Bunch Processing",
      cards: efbCards,
      guardrails: efbGuardrails,
      building: { width: "15 m", height: "10 m", label: "EFB Processing Building", power: "115 kW", structure: "Steel frame · corrugated metal cladding · concrete slab" },
      summary: [
        ["Parameter", "Input", "Output (S2 Ready)"],
        ["Throughput", "20 t/h @ 62.5% MC", "~13 t/h @ 45–50% MC"],
        ["Particle Size", "Whole bunches + ribbons", "D90 ≤ 2mm (Gate B.G1)"],
        ["Monthly Input", "8,262 t fresh weight", "~5,400 t to S2"],
        ["Installed Power", "~115 kW (Asian derate applied)", ""],
      ],
      legend: [
        "MC = Moisture Content (wet basis %)",
        "D90 = 90th percentile particle diameter",
        "VFD = Variable Frequency Drive",
        "Gate B.G1 = particle size ≤2mm · Gate B.G2 = press MC ≤50%",
        "Asian derate = 65% of motor nameplate capacity",
        "Oversize return: ESC-01 ⑧ screen rejects loop back to EHM-01 ⑦ for re-milling",
        "EDC-01 baghouse: parallel dust collection unit duct-fed from hammer mill",
      ],
      meta: "EFB 300 t/day fresh · 112 t/day DM · MC 62.5%",
    },
    opdc: {
      title: "OPDC LINE — Oil Palm Decanter Cake Processing",
      cards: opdcCards,
      guardrails: opdcGuardrails,
      building: { width: "12 m", height: "9 m", label: "OPDC Processing Building", power: "85 kW", structure: "Steel frame · corrugated metal cladding · concrete slab" },
      summary: [
        ["Parameter", "Input", "Output (S2 Ready)"],
        ["Throughput", "5 t/h @ 70–75% MC", "~3.3 t/h @ 55–60% MC"],
        ["Particle Size", "Decanter cake lumps", "D90 ≤ 2mm"],
        ["Monthly Input", "1,256 t fresh weight", "~800 t to S2"],
        ["Installed Power", "~85 kW (Asian derate applied)", ""],
      ],
      legend: [
        "MC = Moisture Content (wet basis %)",
        "CLASS A = non-negotiable hard limit — MC ≥ 40%",
        "24hr dwell = mandatory conditioning period in BIN-OPDC-301",
        "C.G2/G3 = pH conditioning gate post-dwell",
        "Asian derate = 65% of motor nameplate capacity",
      ],
      meta: "OPDC 45 t/day fresh · 13.5 t/day DM · MC 70%",
    },
    pos: {
      title: "POS LINE — Palm Oil Sludge Pre-Skimming",
      cards: posCards,
      guardrails: posGuardrails,
      building: { width: "10 m", height: "6 m", label: "POS Processing Area", power: "62 kW", structure: "Covered open-sided structure · concrete slab" },
      summary: [
        ["Parameter", "Input", "Output (S2 Ready)"],
        ["Throughput", "1.25 t/h @ 82% MC", "~0.56 t/h @ 65% MC"],
        ["Monthly Input", "30 t/day", "~12 t/day to S2"],
        ["Installed Power", "~62 kW", ""],
      ],
      legend: [
        "ICP-OES = Inductively Coupled Plasma Optical Emission Spectroscopy",
        "Fe = Iron content (mg/kg dry matter)",
        "CaCO₃ = Calcium carbonate (limestone) — used for pH adjustment",
        "3-phase centrifuge = separates solids, light liquid, heavy liquid",
      ],
      meta: "POS 30 t/day fresh · 6 t/day DM · MC 82%",
    },
  };

  const current = tabData[tab];

  return (
    <div style={{ fontFamily: F, minHeight: "100vh", background: "#F1F5F9" }}>
      {/* ═══ PERSISTENT CFI GLOBAL HEADER ═══ */}
      <div style={{
        height: 83, background: "#0A1628",
        borderBottom: "1px solid rgba(51, 212, 188, 0.15)",
        display: "flex", alignItems: "center", padding: "0 32px",
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
          <span style={{ fontFamily: FH, fontSize: 26, fontWeight: 700, color: "#FFFFFF", letterSpacing: "0.06em" }}>CFI</span>
          <span style={{ fontFamily: FH, fontSize: 26, fontWeight: 700, color: "#33D4BC", letterSpacing: "0.06em", marginLeft: 10 }}>Deep Tech</span>
        </div>
        <div style={{ width: 3, height: 44, background: "#33D4BC", margin: "0 20px 0 14px" }} />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 4, height: 44 }}>
          <div style={{ fontFamily: F, fontSize: 12, fontWeight: 700, lineHeight: 1.3, whiteSpace: "nowrap", display: "flex" }}>
            <span style={{ color: "#FFFFFF", minWidth: 150, display: "inline-block" }}>Precision Engineering</span>
            <span style={{ color: "#33D4BC" }}>Circular Nutrient Recovery in Agricultural Systems</span>
          </div>
          <div style={{ fontFamily: F, fontSize: 12, fontWeight: 700, lineHeight: 1.3, whiteSpace: "nowrap", display: "flex" }}>
            <span style={{ color: "#FFFFFF", minWidth: 150, display: "inline-block" }}>Applied Biology</span>
            <span style={{ color: "#33D4BC" }}>Rebalancing Soil&apos;s Microbiome &amp; Reducing Synthetic Fertiliser Use</span>
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div style={{ height: 83 }} />

      {/* ═══ PAGE CONTENT ═══ */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "24px 20px 60px" }}>

        {/* ── Breadcrumb ── */}
        <div style={{ fontSize: 13, fontFamily: F, marginBottom: 16 }}>
          <a href="/" style={{ color: "#64748B", textDecoration: "none" }}
            onMouseEnter={e => e.currentTarget.style.color = "#00C9B1"}
            onMouseLeave={e => e.currentTarget.style.color = "#64748B"}>CFI Platform</a>
          <span style={{ color: "#94A3B8", margin: "0 8px" }}>›</span>
          <a href="/s1-index" style={{ color: "#64748B", textDecoration: "none" }}
            onMouseEnter={e => e.currentTarget.style.color = "#00C9B1"}
            onMouseLeave={e => e.currentTarget.style.color = "#64748B"}>S1 Pre-Processing</a>
          <span style={{ color: "#94A3B8", margin: "0 8px" }}>›</span>
          <span style={{ color: "#0B1422", fontWeight: 700 }}>Combined Floor Plans</span>
        </div>
        <a href="/s1-capex-opex" style={{ color: "#00C9B1", fontSize: 14, fontWeight: 500, textDecoration: "none", fontFamily: F, display: "inline-block", marginBottom: 20 }}
          onMouseEnter={e => e.currentTarget.style.opacity = 0.7}
          onMouseLeave={e => e.currentTarget.style.opacity = 1}>← Back to CapEx / OpEx</a>

        {/* ── Page container ── */}
        <div style={{ background: "#fff", border: "3px solid #111", padding: 24 }}>

          {/* Header */}
          <div style={{ borderBottom: "2px solid #111", paddingBottom: 16, marginBottom: 24 }}>
            <h1 style={{ fontFamily: F, fontWeight: 700, fontSize: 28, color: "#111", marginBottom: 8 }}>
              CFI S1 Mechanical — Combined Floor Plans
            </h1>
            <div style={{ fontFamily: F, fontSize: 13, color: "#666", display: "flex", gap: 24 }}>
              <span>Mill Size: 60 ton/hour</span>
              <span>Utilisation: 85% · 20 hr/day · 30 days/mo</span>
              <span>Bogor, West Java</span>
              <span>v2 FINAL · March 2026</span>
            </div>
          </div>

          {/* Stream summary bar */}
          <div style={{ display: "flex", gap: 16, marginBottom: 24, fontSize: 12, color: "#666", fontFamily: F }}>
            {tabs.map(t => (
              <span key={t.id} style={{ borderLeft: `3px solid ${t.color}`, paddingLeft: 8 }}>
                {tabData[t.id].meta}
              </span>
            ))}
          </div>

          {/* Tab navigation */}
          <div style={{ display: "flex", gap: 2, marginBottom: 24, borderBottom: "2px solid #ddd" }}>
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  fontFamily: F, fontWeight: 500, fontSize: 14, padding: "10px 20px",
                  border: "none", cursor: "pointer",
                  borderTopLeftRadius: 4, borderTopRightRadius: 4,
                  background: tab === t.id ? "#111" : "#f5f5f5",
                  color: tab === t.id ? "#fff" : "#666",
                  transition: "all 0.2s",
                }}
              >{t.label}</button>
            ))}
          </div>

          {/* Tab content */}
          <div>
            <div style={{ fontFamily: F, fontWeight: 700, fontSize: 24, color: "#111", marginBottom: 20, paddingBottom: 8, borderBottom: "2px solid #ddd" }}>
              {current.title}
            </div>

            {/* Machine grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: 20, marginBottom: 32 }}>
              {current.cards.map((card, i) => (
                <MachineCard key={i} number={card.n} title={card.title} icon={card.icon} specs={card.specs} footer={card.footer} />
              ))}
            </div>

            {/* Guardrails */}
            <Guardrails title={`${tabs.find(t => t.id === tab)?.label} Guardrails`} items={current.guardrails} />

            {/* Building dimensions */}
            <BuildingDimension {...current.building} />

            {/* Summary table */}
            <SummaryTable rows={current.summary} />

            {/* Legend */}
            <Legend items={current.legend} />
          </div>
        </div>
      </div>
    </div>
  );
}
