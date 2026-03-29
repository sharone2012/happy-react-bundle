import { useState, useCallback, useMemo } from "react";

const F = "'DM Sans', sans-serif";

/* ── colour tokens ── */
const C = {
  navy: "#0B1422", navyMid: "#153352", navyLt: "#1A3A5C", navyDk: "#070D16",
  teal: "#00C9B1", tealDk: "#009E8C", tealLt: "#5EEADA", tealBright: "#40D7C5",
  amber: "#F5A623", amberLt: "#FFD080", red: "#E84040", green: "#3DCB7A",
  blue: "#4A9EDB", white: "#F0F4F8", grey: "#8BA0B4", greyLt: "#C4D3E0",
  bg: "#F8FAFC", border: "#E2E8F0", cardBg: "#FFFFFF", text: "#0B1422",
  textMuted: "#64748B", badgeAmberBg: "#FEF3C7", badgeAmberText: "#92400E",
  badgeRedBg: "#FEE2E2", badgeRedText: "#991B1B",
};

/* ── stage nav ── */
const STAGES = [
  { code: "S0", label: "Mill Config", route: "/" },
  { code: "S1", label: "Pre-Processing", route: "/s1-index", active: true },
  { code: "S2", label: "Chemical", route: "#" },
  { code: "S3", label: "Biological", route: "/s3" },
  { code: "S4", label: "BSF", route: "#" },
  { code: "S5", label: "Soil", route: "#" },
  { code: "S6", label: "Carbon", route: "#" },
];

/* ── equipment data ── */
const EFB_NODES = [
  { id: 1, tag: "AF-01", name: "Hydraulic Feeder", tph: 20, mcIn: 62.5, mcOut: 62.5, elev: "±0.0m", kw: 18, gate: null, enforcement: null, capex: 15000, supplier: "PT Jayatech Palmindo", desc: "Floor-level pusher plate feeder, 20 t/h" },
  { id: 2, tag: "BC-01/02", name: "Incline Conveyor 600mm", tph: 20, mcIn: 62.5, mcOut: 62.5, elev: "±0.0→+2.0m", kw: 22, gate: null, enforcement: null, capex: 18000, supplier: "PT Sinar Surya Lestari", desc: "Heavy-duty apron, 15m long, 20 t/h, 15-20° inclination, rubber-lined chute" },
  { id: 3, tag: "TR-2060", name: "Trommel Screen 50mm", tph: 19, mcIn: 62.5, mcOut: 62.5, elev: "+6.0m", kw: 11, gate: null, enforcement: null, capex: 8000, supplier: "PT Hans Jaya Utama", desc: "2×3m×0.4m, +3.0m, Rubber isolators ×4 corners" },
  { id: 4, tag: "OBM-01", name: "Overband Magnet", tph: 19, mcIn: 62.5, mcOut: 62.5, elev: "+6.0m", kw: 3, gate: null, enforcement: null, capex: null, supplier: null, desc: "2×2m, +3.5m, Suspended, ferrous removal" },
  { id: 5, tag: "PR-01", name: "Screw Press + PKSA", tph: 14, mcIn: 62.5, mcOut: 47.5, elev: "+6.0m", kw: 30, gate: "B.G2", enforcement: "MC ≥ 40% LOCKED (CLASS A)", capex: null, supplier: null, desc: "2×2m×0.5m, +3.2m, M24×8 anchors, 600mm embedment" },
  { id: 6, tag: "SD-01", name: "Primary Shredder", tph: 14, mcIn: 47.5, mcOut: 47.5, elev: "+6.0m", kw: 75, gate: null, enforcement: null, capex: 45000, supplier: "CV Has Engineering", desc: "3×3m×0.6m, +4.0m, M30×8 anchors, 800mm embedment, 50-100mm output" },
  { id: 7, tag: "HM-01", name: "Hammer Mill", tph: 14, mcIn: 47.5, mcOut: 47.5, elev: "+6.0m", kw: 110, gate: "SPRING-ISO", enforcement: "SPRING ISOLATION ONLY, D90≤2mm target", capex: 35000, supplier: "Cakrawala Mesin Multindo", desc: "2.5×2.5m×0.6m, +4.0m, SPRING ISOLATION ONLY, D90≤2mm target" },
  { id: 8, tag: "VS-01", name: "Vibrating Screen 2mm", tph: 13, mcIn: 47.5, mcOut: 47.5, elev: "+6.0m", kw: 11, gate: "B.G1", enforcement: null, capex: 12000, supplier: "CV Has Engineering", desc: "2×2m×0.3m, +4.0m, 2mm aperture, flexible mount" },
  { id: 9, tag: "DC-01", name: "Baghouse (Shared)", tph: 13, mcIn: 47.5, mcOut: 47.5, elev: "+6.0m", kw: 18, gate: null, enforcement: null, capex: null, supplier: null, desc: "5000 m³/hr, outside, 99% capture, carbon steel. Shared with S1B" },
  { id: 10, tag: "BIN-EFB-01", name: "Buffer Bin 50m³", tph: 13, mcIn: 47.5, mcOut: 47.5, elev: "+6.0m", kw: 0, gate: null, enforcement: null, capex: 25000, supplier: "PT BSB (Bangun Sarana Baja)", desc: "50 m³, +2.5m, Live-bottom auger" },
];

const OPDC_NODES = [
  { id: 1, tag: "SF-01", name: "Reciprocating Feeder", tph: 5, mcIn: 72.5, mcOut: 72.5, elev: "±0.0m", kw: 7.5, gate: null, enforcement: null, capex: 10000, supplier: "Local fabricator", desc: "Pusher feeder 5 t/h" },
  { id: 2, tag: "BC-10/11", name: "Incline Conveyor 500mm", tph: 5, mcIn: 72.5, mcOut: 72.5, elev: "±0.0→+2.0m", kw: 15, gate: null, enforcement: null, capex: 8000, supplier: "PT Sinar Surya Lestari", desc: "Belt or screw 10m" },
  { id: 3, tag: "TR-OPDC-01", name: "Trommel Screen 50mm", tph: 4.8, mcIn: 72.5, mcOut: 72.5, elev: "+6.0m", kw: 9, gate: null, enforcement: null, capex: 5000, supplier: "PT Hans Jaya Utama", desc: "Concrete bay for decanter cake reception" },
  { id: 4, tag: "OBM-02", name: "Overband Magnet", tph: 4.8, mcIn: 72.5, mcOut: 72.5, elev: "+6.0m", kw: 3, gate: null, enforcement: null, capex: null, supplier: null, desc: null },
  { id: 5, tag: "DC-PRESS-01", name: "Screw Press + PKSA", tph: 3.5, mcIn: 72.5, mcOut: 61, elev: "+6.0m", kw: 30, gate: "B.G2", enforcement: "MC ≥ 40% MIN CLASS A", capex: null, supplier: null, desc: null },
  { id: 6, tag: "LB-01", name: "Lump Breaker", tph: 3.5, mcIn: 61, mcOut: 61, elev: "+6.0m", kw: 37, gate: null, enforcement: null, capex: null, supplier: null, desc: null },
  { id: 7, tag: "HM-02", name: "Hammer Mill", tph: 3.5, mcIn: 61, mcOut: 61, elev: "+6.0m", kw: 90, gate: "SPRING-ISO", enforcement: null, capex: null, supplier: null, desc: null },
  { id: 8, tag: "VS-02", name: "Vibrating Screen 2mm", tph: 3.3, mcIn: 61, mcOut: 61, elev: "+6.0m", kw: 9, gate: "B.G1", enforcement: null, capex: null, supplier: null, desc: null },
  { id: 9, tag: "DC-01", name: "Baghouse (Shared)", tph: 3.3, mcIn: 61, mcOut: 61, elev: "+6.0m", kw: 0, gate: null, enforcement: "Shared with S1A", capex: null, supplier: null, desc: "Shared with S1A" },
  { id: 10, tag: "BIN-OPDC-24HR", name: "Buffer Bin 85m³ + Rake", tph: 3.3, mcIn: 61, mcOut: 61, elev: "+6.0m", kw: 5.5, gate: "C.G2/G3", enforcement: "pH 8.0–9.0 post-24hr dwell", capex: 15000, supplier: "PT BSB", desc: "Steel bin 20 m³" },
];

const POS_NODES = [
  { id: 1, tag: "RH-OPDC-101", name: "Sludge Pit 15m³", tph: 1.25, mcIn: 82, mcOut: 82, elev: "±0.0m", kw: 0, gate: "ICP-OES-Fe", enforcement: "Fe result sets S2 inclusion", capex: null, supplier: null, desc: null },
  { id: 2, tag: "DRS-SLD-01", name: "Rotary Drum Screen", tph: 1.17, mcIn: 82, mcOut: 78, elev: "+1.5m", kw: 7, gate: null, enforcement: null, capex: null, supplier: null, desc: null },
  { id: 3, tag: "DEC-SLD-101", name: "Decanter Centrifuge", tph: 0.56, mcIn: 78, mcOut: 65, elev: "+3.0m", kw: 55, gate: null, enforcement: "Alfa Laval preferred", capex: null, supplier: "PT Kharismapratama / SCK-Modipalm / Alfa Laval", desc: "Horizontal 3-phase centrifuge, 3 m³/h, bowl 250-350mm. RFQ $80K–$150K" },
  { id: 4, tag: "BIN-OPDC-301", name: "Buffer Tank 15m³", tph: 0.56, mcIn: 65, mcOut: 65, elev: "+3.0m", kw: 0, gate: null, enforcement: null, capex: null, supplier: null, desc: null },
];

const LINES = [
  { key: "efb", label: "S1C EFB", sub: "10 nodes", nodes: EFB_NODES, totalKw: 298, capex: "$184,000", elecMo: "$14,191/mo", elecKwh: "155,199 kWh/mo" },
  { key: "opdc", label: "S1B OPDC", sub: "10 nodes", nodes: OPDC_NODES, totalKw: 206, capex: "$38,000", elecMo: "$6,651/mo", elecKwh: "72,742 kWh/mo" },
  { key: "pos", label: "S1A POS", sub: "4 nodes", nodes: POS_NODES, totalKw: 62, capex: "RFQ pending", elecMo: "$1,806/mo", elecKwh: "19,747 kWh/mo" },
];

/* ── CAPEX items ── */
const CAPEX_ITEMS = [
  { group: "EFB Line (10 items)", total: "$184,000", items: [
    { code: "TR-EFB-101", name: "EFB Truck Receiving Bay", cost: "$8,000" },
    { code: "RH-EFB-101", name: "EFB Hydraulic Reciprocating Feeder", cost: "$15,000" },
    { code: "CV-EFB-101", name: "EFB Apron Conveyor to Shredder", cost: "$18,000" },
    { code: "SH-EFB-101", name: "EFB Primary Shredder", cost: "$45,000" },
    { code: "CV-EFB-102", name: "Shredder Discharge Conveyor", cost: "$8,000" },
    { code: "ML-EFB-101", name: "EFB Hammer Mill (2mm)", cost: "$35,000" },
    { code: "SC-EFB-101", name: "EFB Vibrating Screen", cost: "$12,000" },
    { code: "CV-EFB-103", name: "Screen Undersize Conveyor", cost: "$10,000" },
    { code: "CV-EFB-104", name: "Screen Oversize Return", cost: "$8,000" },
    { code: "BIN-EFB-201", name: "EFB Buffer Storage Bin", cost: "$25,000" },
  ]},
  { group: "OPDC Line (5 items)", total: "$38,000", items: [
    { code: "TR-OPDC-101", name: "OPDC Receiving Bay", cost: "$5,000" },
    { code: "RH-OPDC-101", name: "OPDC Reciprocating Feeder", cost: "$10,000" },
    { code: "CV-OPDC-101", name: "OPDC Feed Conveyor", cost: "$8,000" },
    { code: "BIN-OPDC-301", name: "OPDC Buffer Bin", cost: "$15,000" },
  ]},
  { group: "POS Line", total: "RFQ pending", items: [
    { code: "DEC-SLD-101", name: "POS 3-Phase Decanter", cost: "RFQ $80K–$150K" },
  ]},
  { group: "Shared (2 items)", total: "$176,000", items: [
    { code: "S-LIME-01", name: "Limestone Storage and Dosing", cost: "$6,000" },
    { code: "V-LOADER-ROW-A-01", name: "Wheel Loader — Duty", cost: "$85,000" },
    { code: "V-LOADER-ROW-A-02", name: "Wheel Loader — Standby", cost: "$85,000" },
  ]},
];

/* ── OpEx ── */
const LABOUR = [
  { role: "S1C EFB Line Operator", hc: 2, monthly: "$949" },
  { role: "S1B OPDC Line Operator", hc: 2, monthly: "$949" },
  { role: "Maintenance Technician", hc: 1, monthly: "$570" },
  { role: "Quality and Gate Checker", hc: 1, monthly: "$411" },
  { role: "S1 Shift Supervisor", hc: 1, monthly: "$696" },
];

const ELEC = [
  { line: "S1C EFB Pre-Processing", monthly: "$14,191" },
  { line: "S1B OPDC Pre-Processing", monthly: "$6,651" },
  { line: "S1A POS Pre-Skimming", monthly: "$1,806" },
];

const MAINTENANCE = [
  { cat: "Preventive Maintenance", monthly: "$639" },
  { cat: "EFB Wear Parts", monthly: "$271" },
  { cat: "OPDC Wear Parts", monthly: "$167" },
  { cat: "Conveyor Maintenance", monthly: "$367" },
  { cat: "Breakdown Repairs", monthly: "$154" },
  { cat: "Electrical Repairs", monthly: "$83" },
  { cat: "Filter Bags", monthly: "$83" },
  { cat: "Hydraulic Oil", monthly: "$33" },
  { cat: "Bearing Grease", monthly: "$25" },
  { cat: "Water and Dust Suppression", monthly: "$75" },
  { cat: "Administration", monthly: "$833" },
  { cat: "Building Depreciation", monthly: "$5,729" },
  { cat: "Equipment Depreciation", monthly: "$2,774" },
  { cat: "Utilities Misc", monthly: "$200" },
  { cat: "Transport and Logistics", monthly: "$300" },
];

/* ── Greenhouse ── */
const GREENHOUSES = [
  { id: "GH-A", name: "Greenhouse A — EFB Primary", dims: "40m × 8m", area: "320 m²", bays: 4, ventilation: "Ridge vent + side louvres", cost: "DATA GAP" },
  { id: "GH-B", name: "Greenhouse B — EFB Secondary", dims: "40m × 8m", area: "320 m²", bays: 4, ventilation: "Ridge vent + side louvres", cost: "DATA GAP" },
  { id: "GH-C", name: "Greenhouse C — OPDC Primary", dims: "40m × 8m", area: "320 m²", bays: 4, ventilation: "Ridge vent + side louvres", cost: "DATA GAP" },
  { id: "GH-D", name: "Greenhouse D — OPDC Secondary", dims: "40m × 8m", area: "320 m²", bays: 4, ventilation: "Ridge vent + side louvres", cost: "DATA GAP" },
  { id: "PAD-01", name: "Concrete Pad — Turning Area", dims: "20m × 15m", area: "300 m²", bays: null, ventilation: "Open air", cost: "DATA GAP" },
  { id: "DRAIN-01", name: "Leachate Collection System", dims: "Perimeter channel", area: "—", bays: null, ventilation: "—", cost: "DATA GAP" },
];

/* ── Guardrails ── */
const GUARDRAILS = [
  { code: "G1", text: "MC ≥ 40% LOCKED (CLASS A) — Screw press nodes", severity: "red" as const },
  { code: "G2", text: "Fe < 3,000 mg/kg DM target — POS Sludge Pit (ICP-OES)", severity: "red" as const },
  { code: "G3", text: "ADL < 12% DM for BSF — Buffer bin nodes", severity: "amber" as const },
  { code: "G4", text: "C:N 15–22 optimal — Buffer bin nodes", severity: "amber" as const },
  { code: "G5", text: "pH 4.0–5.0 range — OPDC buffer bin", severity: "amber" as const },
  { code: "G6", text: "No Cr > 20 mg/kg — Sludge pit", severity: "red" as const },
  { code: "G7", text: "CEC > 20 cmol/kg target — Buffer bin nodes", severity: "amber" as const },
  { code: "G8", text: "Belt speed locked at spec — Conveyor nodes", severity: "amber" as const },
  { code: "G9", text: "All temps < 85°C — Hammer mill and shredder nodes", severity: "amber" as const },
];

/* ═══════ SUB-COMPONENTS ═══════ */

function TickerCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div style={{ background: C.cardBg, border: `1px solid ${C.border}`, borderRadius: 8, padding: "14px 18px", flex: 1, minWidth: 160 }}>
      <div style={{ fontFamily: F, fontSize: 11, fontWeight: 500, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>{label}</div>
      <div style={{ fontFamily: F, fontSize: 22, fontWeight: 700, color: C.text }}>{value}</div>
      {sub && <div style={{ fontFamily: F, fontSize: 11, color: C.textMuted, marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

function NodeCard({ node, expanded, onToggle }: { node: typeof EFB_NODES[0]; expanded: boolean; onToggle: () => void }) {
  const fields = [
    ["Equipment Tag", node.tag],
    ["Equipment Name", node.name],
    ["Throughput (t/h)", node.tph],
    ["MC In (%)", node.mcIn != null ? `${node.mcIn}%` : null],
    ["MC Out (%)", node.mcOut != null ? `${node.mcOut}%` : null],
    ["Elevation", node.elev],
    ["Power (kW)", node.kw],
    ["Gate Code", node.gate],
    ["Gate Enforcement", node.enforcement],
    ["CAPEX (USD)", node.capex != null ? `$${node.capex.toLocaleString()}` : null],
    ["Supplier", node.supplier],
    ["Description", node.desc],
  ];

  return (
    <div style={{ background: C.cardBg, border: `1px solid ${C.border}`, borderRadius: 6, marginBottom: 8, overflow: "hidden" }}>
      <div onClick={onToggle} style={{ display: "flex", alignItems: "center", padding: "12px 16px", cursor: "pointer", gap: 16, fontSize: 14, userSelect: "none" }}>
        <span style={{ color: C.textMuted, fontWeight: 500, fontSize: 12, minWidth: 28, textAlign: "center", fontFamily: F }}>{node.id}</span>
        <span style={{ fontWeight: 700, color: C.text, minWidth: 100, fontSize: 13, fontFamily: F }}>{node.tag}</span>
        <span style={{ flex: 1, color: C.text, fontWeight: 400, fontSize: 14, fontFamily: F }}>{node.name}</span>
        <span style={{ color: C.textMuted, fontSize: 12, minWidth: 60, textAlign: "right", fontFamily: F }}>{node.kw} kW</span>
        <span style={{ color: C.textMuted, fontSize: 12, minWidth: 60, textAlign: "right", fontFamily: F }}>{node.tph} t/h</span>
        <span style={{ display: "inline-block", transition: "transform 0.2s", transform: expanded ? "rotate(90deg)" : "rotate(0deg)", fontSize: 14, color: "#94A3B8" }}>▸</span>
      </div>
      {expanded && (
        <div style={{ borderTop: `1px solid ${C.border}`, padding: "16px 16px 12px 60px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 32px" }}>
            {fields.map(([label, value]) => (
              <div key={label as string}>
                <div style={{ fontSize: 12, fontWeight: 500, color: C.textMuted, fontFamily: F, marginBottom: 2 }}>{label}</div>
                <div style={{ fontSize: 14, fontWeight: 400, color: C.text, fontFamily: F }}>{value || "—"}</div>
              </div>
            ))}
          </div>
          {node.enforcement && (
            <div style={{ marginTop: 12 }}>
              <span style={{ display: "inline-block", background: C.badgeAmberBg, color: C.badgeAmberText, fontSize: 11, fontFamily: F, fontWeight: 500, padding: "2px 8px", borderRadius: 4 }}>
                {node.enforcement}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SectionHeader({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, paddingBottom: 12, borderBottom: `1px solid ${C.border}` }}>
      <span style={{ fontFamily: F, fontWeight: 700, fontSize: 18, color: C.text }}>{title}</span>
      {children}
    </div>
  );
}

/* ═══════ MAIN COMPONENT ═══════ */
export default function S1EngineeringComplete() {
  const [activeLine, setActiveLine] = useState("efb");
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});
  const [allExpanded, setAllExpanded] = useState(false);
  const [capexOpen, setCapexOpen] = useState(false);
  const [opexOpen, setOpexOpen] = useState(false);
  const [ghOpen, setGhOpen] = useState(false);
  const [guardrailOpen, setGuardrailOpen] = useState(false);

  const currentLine = useMemo(() => LINES.find(l => l.key === activeLine)!, [activeLine]);

  const toggleNode = useCallback((key: string) => {
    setExpandedNodes(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const toggleAll = useCallback(() => {
    const next = !allExpanded;
    setAllExpanded(next);
    const map: Record<string, boolean> = {};
    currentLine.nodes.forEach(n => { map[`${activeLine}-${n.id}`] = next; });
    setExpandedNodes(map);
  }, [allExpanded, currentLine, activeLine]);

  return (
    <div style={{ fontFamily: F, color: C.text, minHeight: "100vh", background: C.bg }}>

      {/* ── Header ── */}
      <div style={{ background: C.cardBg, borderBottom: `1px solid ${C.border}`, padding: "12px 32px" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span style={{ fontFamily: F, fontWeight: 700, fontSize: 20, color: C.text }}>CFI</span>
            <span style={{ fontFamily: F, fontWeight: 400, fontSize: 14, color: C.textMuted, marginLeft: 12 }}>Circular Fertiliser Industries</span>
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            {STAGES.map(s => (
              <a key={s.code} href={s.route} style={{
                fontFamily: F, fontSize: 12, fontWeight: s.active ? 700 : 500,
                padding: "6px 12px", borderRadius: 4, textDecoration: "none",
                background: s.active ? C.teal : "transparent",
                color: s.active ? "#fff" : C.textMuted,
              }}>{s.code} {s.label}</a>
            ))}
          </div>
        </div>
      </div>

      {/* ── Breadcrumb ── */}
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "12px 32px 0" }}>
        <div style={{ fontFamily: F, fontSize: 13, color: C.textMuted }}>
          <a href="/" style={{ color: C.textMuted, textDecoration: "none" }}>CFI Platform</a>
          <span style={{ margin: "0 8px" }}>›</span>
          <a href="/s1-index" style={{ color: C.textMuted, textDecoration: "none" }}>S1 Pre-Processing</a>
          <span style={{ margin: "0 8px" }}>›</span>
          <span style={{ color: C.text, fontWeight: 700 }}>S1 Engineering Complete</span>
        </div>
      </div>

      {/* ── Ticker bar ── */}
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "16px 32px" }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <TickerCard label="Processing Lines" value="3 Active" sub="EFB · OPDC · POS" />
          <TickerCard label="Total Power" value="566 kW" sub="298 + 206 + 62" />
          <TickerCard label="Equipment CAPEX" value="$398,000" sub="POS decanter RFQ pending" />
          <TickerCard label="Monthly OpEx" value="$37,957/mo" sub="Labour + Elec + Maintenance" />
          <TickerCard label="Equipment Nodes" value="24" sub="10 + 10 + 4" />
        </div>
      </div>

      {/* ── Line tabs ── */}
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 32px" }}>
        <div style={{ display: "flex", gap: 2, borderBottom: `2px solid ${C.border}` }}>
          {LINES.map(line => (
            <button key={line.key} onClick={() => { setActiveLine(line.key); setExpandedNodes({}); setAllExpanded(false); }}
              style={{
                fontFamily: F, fontSize: 14, fontWeight: activeLine === line.key ? 700 : 500,
                padding: "12px 24px", border: "none", cursor: "pointer", background: "transparent",
                color: activeLine === line.key ? C.teal : C.textMuted,
                borderBottom: activeLine === line.key ? `2px solid ${C.teal}` : "2px solid transparent",
                marginBottom: -2,
              }}>
              {line.label} <span style={{ fontSize: 11, fontWeight: 400, color: C.textMuted, marginLeft: 6 }}>({line.sub})</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Node cards ── */}
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "24px 32px" }}>
        <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: 24 }}>
          <SectionHeader title={`${currentLine.label} — Engineering Specifications (${currentLine.sub})`}>
            <span onClick={toggleAll} style={{ fontFamily: F, fontWeight: 500, fontSize: 14, color: C.teal, cursor: "pointer" }}>
              {allExpanded ? "Collapse All" : "Expand All"}
            </span>
          </SectionHeader>

          {currentLine.nodes.map(node => (
            <NodeCard key={`${activeLine}-${node.id}`} node={node}
              expanded={!!expandedNodes[`${activeLine}-${node.id}`]}
              onToggle={() => toggleNode(`${activeLine}-${node.id}`)} />
          ))}

          <div style={{ marginTop: 16, borderTop: `1px solid ${C.border}`, paddingTop: 12 }}>
            <div style={{ fontFamily: F, fontWeight: 700, fontSize: 14, color: C.text, marginBottom: 4 }}>Total Line Power: {currentLine.totalKw} kW</div>
            <div style={{ fontFamily: F, fontWeight: 700, fontSize: 14, color: C.text, marginBottom: 4 }}>Line Equipment CAPEX: {currentLine.capex}</div>
            <div style={{ fontFamily: F, fontWeight: 500, fontSize: 14, color: C.textMuted }}>Monthly Electricity: {currentLine.elecMo} ({currentLine.elecKwh}) — PLN I-3 tariff IDR 1,444.70/kWh</div>
          </div>
        </div>
      </div>

      {/* ── CAPEX Summary ── */}
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 32px 24px" }}>
        <div style={{ background: C.cardBg, border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden" }}>
          <div onClick={() => setCapexOpen(!capexOpen)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px", cursor: "pointer" }}>
            <span style={{ fontFamily: F, fontWeight: 700, fontSize: 18, color: C.text }}>Equipment CAPEX Summary — $398,000</span>
            <span style={{ transform: capexOpen ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s", fontSize: 16, color: "#94A3B8" }}>▸</span>
          </div>
          {capexOpen && (
            <div style={{ padding: "0 24px 20px", borderTop: `1px solid ${C.border}` }}>
              {CAPEX_ITEMS.map(group => (
                <div key={group.group} style={{ marginTop: 16 }}>
                  <div style={{ fontFamily: F, fontWeight: 700, fontSize: 14, color: C.text, marginBottom: 8, display: "flex", justifyContent: "space-between" }}>
                    <span>{group.group}</span><span>{group.total}</span>
                  </div>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: F, fontSize: 13 }}>
                    <tbody>
                      {group.items.map(item => (
                        <tr key={item.code} style={{ borderBottom: `1px solid ${C.border}` }}>
                          <td style={{ padding: "8px 12px", color: C.textMuted, width: 130 }}>{item.code}</td>
                          <td style={{ padding: "8px 12px", color: C.text }}>{item.name}</td>
                          <td style={{ padding: "8px 12px", color: item.cost.includes("RFQ") ? C.amber : C.text, textAlign: "right", fontWeight: 500 }}>{item.cost}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Monthly OpEx ── */}
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 32px 24px" }}>
        <div style={{ background: C.cardBg, border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden" }}>
          <div onClick={() => setOpexOpen(!opexOpen)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px", cursor: "pointer" }}>
            <span style={{ fontFamily: F, fontWeight: 700, fontSize: 18, color: C.text }}>Monthly OpEx — $37,957/mo</span>
            <span style={{ transform: opexOpen ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s", fontSize: 16, color: "#94A3B8" }}>▸</span>
          </div>
          {opexOpen && (
            <div style={{ padding: "0 24px 20px", borderTop: `1px solid ${C.border}` }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24, marginTop: 16 }}>
                {/* Labour */}
                <div>
                  <div style={{ fontFamily: F, fontWeight: 700, fontSize: 14, color: C.text, marginBottom: 8 }}>Labour — $3,576/mo (7 HC)</div>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: F, fontSize: 12 }}>
                    <thead><tr style={{ borderBottom: `1px solid ${C.border}` }}>
                      <th style={{ textAlign: "left", padding: "6px 8px", color: C.textMuted, fontWeight: 500 }}>Role</th>
                      <th style={{ textAlign: "center", padding: "6px 8px", color: C.textMuted, fontWeight: 500 }}>HC</th>
                      <th style={{ textAlign: "right", padding: "6px 8px", color: C.textMuted, fontWeight: 500 }}>Monthly</th>
                    </tr></thead>
                    <tbody>{LABOUR.map(r => (
                      <tr key={r.role} style={{ borderBottom: `1px solid ${C.border}` }}>
                        <td style={{ padding: "6px 8px", color: C.text }}>{r.role}</td>
                        <td style={{ padding: "6px 8px", color: C.text, textAlign: "center" }}>{r.hc}</td>
                        <td style={{ padding: "6px 8px", color: C.text, textAlign: "right" }}>{r.monthly}</td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
                {/* Electricity */}
                <div>
                  <div style={{ fontFamily: F, fontWeight: 700, fontSize: 14, color: C.text, marginBottom: 8 }}>Electricity — $22,648/mo</div>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: F, fontSize: 12 }}>
                    <thead><tr style={{ borderBottom: `1px solid ${C.border}` }}>
                      <th style={{ textAlign: "left", padding: "6px 8px", color: C.textMuted, fontWeight: 500 }}>Line</th>
                      <th style={{ textAlign: "right", padding: "6px 8px", color: C.textMuted, fontWeight: 500 }}>Monthly</th>
                    </tr></thead>
                    <tbody>{ELEC.map(r => (
                      <tr key={r.line} style={{ borderBottom: `1px solid ${C.border}` }}>
                        <td style={{ padding: "6px 8px", color: C.text }}>{r.line}</td>
                        <td style={{ padding: "6px 8px", color: C.text, textAlign: "right" }}>{r.monthly}</td>
                      </tr>
                    ))}</tbody>
                  </table>
                  <div style={{ fontFamily: F, fontSize: 11, color: C.textMuted, marginTop: 8 }}>PLN I-3 tariff · IDR 1,444.70/kWh</div>
                </div>
                {/* Maintenance */}
                <div>
                  <div style={{ fontFamily: F, fontWeight: 700, fontSize: 14, color: C.text, marginBottom: 8 }}>Maintenance and Other — $11,733/mo</div>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: F, fontSize: 12 }}>
                    <thead><tr style={{ borderBottom: `1px solid ${C.border}` }}>
                      <th style={{ textAlign: "left", padding: "6px 8px", color: C.textMuted, fontWeight: 500 }}>Category</th>
                      <th style={{ textAlign: "right", padding: "6px 8px", color: C.textMuted, fontWeight: 500 }}>Monthly</th>
                    </tr></thead>
                    <tbody>{MAINTENANCE.map(r => (
                      <tr key={r.cat} style={{ borderBottom: `1px solid ${C.border}` }}>
                        <td style={{ padding: "6px 8px", color: C.text }}>{r.cat}</td>
                        <td style={{ padding: "6px 8px", color: C.text, textAlign: "right" }}>{r.monthly}</td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Greenhouse ── */}
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 32px 24px" }}>
        <div style={{ background: C.cardBg, border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden" }}>
          <div onClick={() => setGhOpen(!ghOpen)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px", cursor: "pointer" }}>
            <span style={{ fontFamily: F, fontWeight: 700, fontSize: 18, color: C.text }}>Greenhouse Structures (6)</span>
            <span style={{ transform: ghOpen ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s", fontSize: 16, color: "#94A3B8" }}>▸</span>
          </div>
          {ghOpen && (
            <div style={{ padding: "0 24px 20px", borderTop: `1px solid ${C.border}` }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: F, fontSize: 13, marginTop: 12 }}>
                <thead><tr style={{ borderBottom: `2px solid ${C.border}` }}>
                  {["ID", "Name", "Dimensions", "Area", "Bays", "Ventilation", "Cost"].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "8px 12px", color: C.textMuted, fontWeight: 500, fontSize: 12 }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>{GREENHOUSES.map(g => (
                  <tr key={g.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                    <td style={{ padding: "8px 12px", fontWeight: 500, color: C.text }}>{g.id}</td>
                    <td style={{ padding: "8px 12px", color: C.text }}>{g.name}</td>
                    <td style={{ padding: "8px 12px", color: C.text }}>{g.dims}</td>
                    <td style={{ padding: "8px 12px", color: C.text }}>{g.area}</td>
                    <td style={{ padding: "8px 12px", color: C.text }}>{g.bays ?? "—"}</td>
                    <td style={{ padding: "8px 12px", color: C.text }}>{g.ventilation}</td>
                    <td style={{ padding: "8px 12px", color: g.cost === "DATA GAP" ? C.amber : C.text, fontWeight: g.cost === "DATA GAP" ? 700 : 400 }}>{g.cost}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ── Hard Guardrails ── */}
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 32px 24px" }}>
        <div style={{ background: C.cardBg, border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden" }}>
          <div onClick={() => setGuardrailOpen(!guardrailOpen)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px", cursor: "pointer" }}>
            <span style={{ fontFamily: F, fontWeight: 700, fontSize: 18, color: C.text }}>9 Hard Guardrails</span>
            <span style={{ transform: guardrailOpen ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s", fontSize: 16, color: "#94A3B8" }}>▸</span>
          </div>
          {guardrailOpen && (
            <div style={{ padding: "12px 24px 20px", borderTop: `1px solid ${C.border}` }}>
              {GUARDRAILS.map(g => (
                <div key={g.code} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 12px", marginBottom: 6, borderRadius: 4,
                  background: g.severity === "red" ? C.badgeRedBg : C.badgeAmberBg }}>
                  <span style={{ fontFamily: F, fontWeight: 700, fontSize: 12, color: g.severity === "red" ? C.badgeRedText : C.badgeAmberText, minWidth: 28 }}>{g.code}</span>
                  <span style={{ fontFamily: F, fontSize: 13, color: g.severity === "red" ? C.badgeRedText : C.badgeAmberText }}>{g.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Sticky Results Bar ── */}
      <div style={{ position: "sticky", bottom: 0, background: C.cardBg, borderTop: `2px solid ${C.teal}`, padding: "10px 32px", zIndex: 100 }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: F, fontSize: 13 }}>
          <div style={{ display: "flex", gap: 24 }}>
            <span><strong>Lines:</strong> 3</span>
            <span><strong>Nodes:</strong> 24</span>
            <span><strong>Total Power:</strong> 566 kW</span>
          </div>
          <div style={{ display: "flex", gap: 24 }}>
            <span><strong>Equipment CAPEX:</strong> $398,000</span>
            <span><strong>Monthly OpEx:</strong> $37,957/mo</span>
            <span><strong>Guardrails:</strong> 9</span>
          </div>
        </div>
      </div>
    </div>
  );
}
