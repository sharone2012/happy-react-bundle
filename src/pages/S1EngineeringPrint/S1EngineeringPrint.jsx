import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/*
 * ─────────────────────────────────────────────────────────────────────────────
 * CFI Deep Tech · S1 Complete Engineering — Print / PDF Page
 * Route: /s1-engineering-print
 * All 3 processing lines combined in a white A4-friendly formal document.
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ── COLOUR TOKENS (white formal palette, same as S1EngineeringComplete) ──
const T = {
  bg:      "#FFFFFF",
  border:  "#E2E6EC",
  borderD: "#CBD2DC",
  teal:    "#00897B",
  tealL:   "#E0F2F1",
  amber:   "#E65100",
  amberL:  "#FFF3E0",
  green:   "#2E7D32",
  greenL:  "#E8F5E9",
  red:     "#C62828",
  redL:    "#FFEBEE",
  navy:    "#1A2332",
  grey:    "#78909C",
  greyL:   "#B0BEC5",
  text:    "#263238",
  textL:   "#546E7A",
  nodeBg:  "#F5F7FA",
};
const F = "'DM Sans', sans-serif";

// ── S1A POS LINE (4 nodes, 62 kW) ──
const S1A_NODES = [
  { tag: "RH-OPDC-101", name: "Sludge Pit 15m³", th: 1.25, mcIn: "82%", mcOut: "82%", kw: 0, capex: 0, supplier: "", gate: "ICP-OES-Fe gate", warn: "Fe < 3,000 mg/kg DM · No Cr > 20 mg/kg", desc: "15m³ sludge pit. 1.25 t/h DM input (~30 t/day FW). ICP-OES iron gate enforcement." },
  { tag: "DRS-SLD-01",  name: "Rotary Drum Screen", th: 1.17, mcIn: "82%", mcOut: "78%", kw: 7, capex: 0, supplier: "", gate: "", warn: "", desc: "Removes stones and grit. Moisture reduction from 82% to 78% MC." },
  { tag: "DEC-SLD-101", name: "Decanter Centrifuge", th: 0.56, mcIn: "78%", mcOut: "65%", kw: 55, capex: 0, supplier: "Alfa Laval preferred", gate: "", warn: "", desc: "Moisture reduction from 78% to 65% MC. 55 kW high-speed centrifugation. RFQ $80K–$150K pending." },
  { tag: "BIN-OPDC-301", name: "Buffer Tank 15m³", th: 0.56, mcIn: "65%", mcOut: "65%", kw: 0, capex: 0, supplier: "", gate: "", warn: "ADL < 12% DM (BSF) · C:N 15–22 optimal · CEC > 20 cmol/kg", desc: "15m³ buffer tank. 0.56 t/h final output. Ready for S2 mixing stage." },
];

// ── S1C EFB LINE (10 nodes, 298 kW, $184K) ──
const S1C_NODES = [
  { tag: "AF-01",     name: "Hydraulic Feeder",         th: 20,   mcIn: "62.5%", mcOut: "62.5%", kw: 18,  capex: 15000, supplier: "PT Jayatech Palmindo", gate: "", warn: "", desc: "20 t/h input feeder for EFB. Standard reciprocating action." },
  { tag: "BC-01/02",  name: "Incline Conveyor 600mm",   th: 20,   mcIn: "62.5%", mcOut: "62.5%", kw: 22,  capex: 18000, supplier: "PT Sinar Surya Lestari", gate: "", warn: "", desc: "600mm belt conveyor. 20 t/h throughput, 62.5% MC. Incline lift to 2m." },
  { tag: "TR-2060",   name: "Trommel Screen 50mm",      th: 19,   mcIn: "62.5%", mcOut: "62.5%", kw: 11,  capex: 8000,  supplier: "PT Hans Jaya Utama", gate: "", warn: "", desc: "50mm opening. Removes oversized fibre bundles. 19 t/h to next stage." },
  { tag: "OBM-01",    name: "Overband Magnet",          th: 19,   mcIn: "62.5%", mcOut: "62.5%", kw: 3,   capex: 0,     supplier: "", gate: "", warn: "", desc: "Ferrous metal detection. Critical for mill safety." },
  { tag: "PR-01",     name: "Screw Press + PKSA",       th: 14,   mcIn: "62.5%", mcOut: "47.5%", kw: 30,  capex: 0,     supplier: "", gate: "Gate B.G2", warn: "GUARD: MC ≥ 40% LOCKED (CLASS A)", desc: "Moisture reduction from 62.5% to 47.5% MC. CLASS A minimum moisture constraint." },
  { tag: "SD-01",     name: "Primary Shredder",         th: 14,   mcIn: "47.5%", mcOut: "47.5%", kw: 75,  capex: 45000, supplier: "CV Has Engineering", gate: "", warn: "GUARD: Temp < 85°C", desc: "Coarse size reduction. 14 t/h input. 75 kW primary shredding stage." },
  { tag: "HM-01",     name: "Hammer Mill",              th: 14,   mcIn: "47.5%", mcOut: "47.5%", kw: 110, capex: 35000, supplier: "Cakrawala Mesin Multindo", gate: "SPRING-ISO gate", warn: "GUARD: Temp < 85°C", desc: "Fine shredding to 2mm target. 110 kW. Largest power consumer on EFB line." },
  { tag: "VS-01",     name: "Vibrating Screen 2mm",     th: 13,   mcIn: "47.5%", mcOut: "47.5%", kw: 11,  capex: 12000, supplier: "CV Has Engineering", gate: "Gate B.G1", warn: "", desc: "2mm screening. Separates fines for pneumatic transport." },
  { tag: "DC-01",     name: "Baghouse (Shared)",        th: 13,   mcIn: "47.5%", mcOut: "47.5%", kw: 18,  capex: 0,     supplier: "", gate: "", warn: "", desc: "Dust collection shared with S1B OPDC line. Maintains air quality." },
  { tag: "BIN-EFB-01", name: "Buffer Bin 50m³",        th: 13,   mcIn: "47.5%", mcOut: "47.5%", kw: 0,   capex: 25000, supplier: "PT BSB", gate: "", warn: "GUARD: ADL < 12% DM (BSF) · C:N 15–22 optimal · CEC > 20 cmol/kg", desc: "50m³ buffer storage. Final output bin. Ready for S2 mixing stage." },
];

// ── S1B OPDC LINE (10 nodes, 206 kW, $38K) ──
const S1B_NODES = [
  { tag: "SF-01",        name: "Reciprocating Feeder",      th: 5,   mcIn: "72.5%", mcOut: "72.5%", kw: 7.5, capex: 10000, supplier: "", gate: "", warn: "", desc: "5 t/h input feeder for Oil Palm Decanter Cake." },
  { tag: "BC-10/11",     name: "Incline Conveyor 500mm",    th: 5,   mcIn: "72.5%", mcOut: "72.5%", kw: 15,  capex: 8000,  supplier: "PT Sinar Surya Lestari", gate: "", warn: "", desc: "500mm belt conveyor. 5 t/h throughput. Incline lift to 2m." },
  { tag: "TR-OPDC-01",   name: "Trommel Screen 50mm",       th: 4.8, mcIn: "72.5%", mcOut: "72.5%", kw: 9,   capex: 5000,  supplier: "PT Hans Jaya Utama", gate: "", warn: "", desc: "50mm opening. Oversized OPDC removal." },
  { tag: "OBM-02",       name: "Overband Magnet",           th: 4.8, mcIn: "72.5%", mcOut: "72.5%", kw: 3,   capex: 0,     supplier: "", gate: "", warn: "", desc: "Ferrous metal detection on OPDC line." },
  { tag: "DC-PRESS-01",  name: "Screw Press + PKSA",        th: 3.5, mcIn: "72.5%", mcOut: "61%",   kw: 30,  capex: 0,     supplier: "", gate: "Gate B.G2", warn: "GUARD: MC ≥ 40% MIN CLASS A", desc: "Moisture reduction from 72.5% to 61% MC. CLASS A minimum constraint enforced." },
  { tag: "LB-01",        name: "Lump Breaker",              th: 3.5, mcIn: "61%",   mcOut: "61%",   kw: 37,  capex: 0,     supplier: "", gate: "", warn: "", desc: "Breaks agglomerated lumps in OPDC. 37 kW. Critical for consistent downstream processing." },
  { tag: "HM-02",        name: "Hammer Mill",               th: 3.5, mcIn: "61%",   mcOut: "61%",   kw: 90,  capex: 0,     supplier: "Zhengzhou Sinoder", gate: "SPRING-ISO", warn: "GUARD: Temp < 85°C", desc: "Fine shredding to 2mm target. 90 kW." },
  { tag: "VS-02",        name: "Vibrating Screen 2mm",      th: 3.3, mcIn: "61%",   mcOut: "61%",   kw: 9,   capex: 0,     supplier: "", gate: "Gate B.G1", warn: "", desc: "2mm screening for OPDC. 3.3 t/h." },
  { tag: "DC-01",        name: "Baghouse (Shared)",         th: 3.3, mcIn: "61%",   mcOut: "61%",   kw: 0,   capex: 0,     supplier: "", gate: "", warn: "", desc: "Dust collection shared with S1C EFB line." },
  { tag: "BIN-OPDC-24HR", name: "Buffer Bin 85m³ + Rake", th: 3.3, mcIn: "61%",   mcOut: "61%",   kw: 5.5, capex: 15000, supplier: "PT BSB", gate: "Gate C.G2/G3", warn: "GUARD: ADL < 12% DM (BSF) · C:N 15–22 optimal · pH 8.0–9.0", desc: "85m³ buffer storage with rake agitation. 24-hour residence time." },
];

// ── EQUIPMENT CAPEX ──
const CAPEX_ITEMS = [
  { line: "S1C EFB",   item: "AF-01 Hydraulic Feeder",            cost: 15000 },
  { line: "S1C EFB",   item: "BC-01/02 Incline Conveyor 600mm",   cost: 18000 },
  { line: "S1C EFB",   item: "TR-2060 Trommel Screen",            cost: 8000  },
  { line: "S1C EFB",   item: "SD-01 Primary Shredder",            cost: 45000 },
  { line: "S1C EFB",   item: "HM-01 Hammer Mill",                 cost: 35000 },
  { line: "S1C EFB",   item: "VS-01 Vibrating Screen",            cost: 12000 },
  { line: "S1C EFB",   item: "BIN-EFB-01 Buffer Bin 50m³",        cost: 25000 },
  { line: "S1B OPDC",  item: "SF-01 Reciprocating Feeder",        cost: 10000 },
  { line: "S1B OPDC",  item: "BC-10/11 Incline Conveyor 500mm",   cost: 8000  },
  { line: "S1B OPDC",  item: "TR-OPDC-01 Trommel Screen",         cost: 5000  },
  { line: "S1B OPDC",  item: "BIN-OPDC-24HR Buffer Bin 85m³",     cost: 15000 },
  { line: "Shared",    item: "DC-01 Baghouse (Shared)",            cost: 0     },
  { line: "Shared",    item: "Limestone Station",                  cost: 6000  },
  { line: "Shared",    item: "2× Wheel Loaders (2 × $85K)",        cost: 170000 },
];

// ── BUILDING CAPEX A1-A8 ──
const BUILDING_CAPEX = [
  { ref: "A1", name: "Site works — clearing, earthworks, drainage",              cost: 79540 },
  { ref: "A2", name: "Civil & concrete — slabs, hoppers, bays",                 cost: 105900 },
  { ref: "A3", name: "Structural steel — PEB, cladding, platforms",             cost: 336790 },
  { ref: "A4", name: "Welfare fit-out — fixtures & finishes",                   cost: 107650 },
  { ref: "A5", name: "MEP — power & lighting (500kVA transformer)",             cost: 140000 },
  { ref: "A6", name: "MEP — HVAC & ventilation",                                cost: 28000  },
  { ref: "A7", name: "Plumbing & drainage",                                     cost: 42000  },
  { ref: "A8", name: "Process building items (platforms, stairs)",               cost: 44000  },
];

// ── GREENHOUSES ──
const GREENHOUSES = [
  { id: "gh1",   name: "GH-1 Greenhouse",         dims: "40m × 8m × 2.5m", area: "320 m²", type: "Arched tunnel greenhouse",     matl: "Round pipe 42mm×2mm MS painted aluminium, purlin 25mm×1.5mm, brace 32mm×1.5mm, shade net + arched PE film, brick wall 150mm perimeter, strip foundation 300mm, slab 150mm C20" },
  { id: "gh2",   name: "GH-2 Greenhouse",         dims: "40m × 8m × 2.5m", area: "320 m²", type: "Arched tunnel greenhouse",     matl: "Identical spec to GH-1. U-clamps 25mm and 32mm dia." },
  { id: "gh3",   name: "GH-3 Greenhouse",         dims: "40m × 8m × 2.5m", area: "320 m²", type: "Arched tunnel greenhouse",     matl: "Identical spec to GH-1" },
  { id: "gh4",   name: "GH-4 Greenhouse",         dims: "40m × 8m × 2.5m", area: "320 m²", type: "Arched tunnel greenhouse",     matl: "Identical spec to GH-1" },
  { id: "store", name: "Store / Product Storage", dims: "11m × 5m × 3m",   area: "55 m²",  type: "Standard enclosed",           matl: "150mm brick walls (1:3 mortar), 75×50mm purlins, 100×50mm rafters/struts/tie beams, Gauge 28 maroon corrugated iron roof + walls, 150mm C20 slab, 150mm DPC" },
  { id: "shade", name: "Shredder Machine Shade",  dims: "6m × 9m × 3m",    area: "54 m²",  type: "Open frame (2 sides open, 2 closed)", matl: "50×50×2mm MS square hollow section poles, 75×50mm purlins, Gauge 28 corrugated iron roof, wire mesh sides, exhaust fan ≥300mm, BRC A66 foundation" },
];

// ── SITE METRICS ──
const SITE_METRICS = [
  { label: "Total Site Area",    val: "5,000 m²",   note: "1.25 acres recommended" },
  { label: "Building Footprint", val: "1,260 m²",   note: "36m × 35m × 10m ht · PEB steel" },
  { label: "Greenhouse Block",   val: "1,920 m²",   note: "4 × 40×8m · 2 rows × 2 cols" },
  { label: "Truck Receiving Bay",val: "216 m²",     note: "18m × 12m × 4m ht" },
  { label: "Conveyor Gallery",   val: "100 m²",     note: "25m × 4m · covered · +0.5m" },
  { label: "Outside Space",      val: "2,504 m²",   note: "Roads, service lane, silos, workshop" },
  { label: "Greenhouse Site",    val: "98m × 85m",  note: "2 rows × 2 cols, 6m central access road" },
  { label: "Portal Frames",      val: "7",          note: "@ 6m spacing · ASTM A36 PEB" },
];

// ── NODE TABLE ROW ──
function NodeRow({ node, idx }) {
  const hasBadge = node.gate || node.warn;
  return (
    <tr style={{ borderBottom: `1px solid ${T.border}`, background: idx % 2 === 1 ? "#FAFBFC" : T.bg }}>
      <td style={{ padding: "8px 10px", fontFamily: F, fontSize: 11, fontWeight: 700, color: T.amber, whiteSpace: "nowrap" }}>{node.tag}</td>
      <td style={{ padding: "8px 10px", fontFamily: F, fontSize: 11, color: T.navy, fontWeight: 600 }}>{node.name}</td>
      <td style={{ padding: "8px 10px", fontFamily: F, fontSize: 11, color: T.text, textAlign: "center" }}>{node.th}</td>
      <td style={{ padding: "8px 10px", fontFamily: F, fontSize: 11, color: T.text, textAlign: "center" }}>{node.mcIn}</td>
      <td style={{ padding: "8px 10px", fontFamily: F, fontSize: 11, color: T.text, textAlign: "center" }}>{node.mcOut}</td>
      <td style={{ padding: "8px 10px", fontFamily: F, fontSize: 11, fontWeight: 700, color: T.teal, textAlign: "center" }}>{node.kw || "—"}</td>
      <td style={{ padding: "8px 10px", fontFamily: F, fontSize: 11, fontWeight: 700, color: node.capex === 0 ? T.grey : T.amber, textAlign: "center" }}>
        {node.capex === 0 ? "RFQ" : `$${(node.capex / 1000).toFixed(0)}K`}
      </td>
      <td style={{ padding: "8px 10px", fontFamily: F, fontSize: 10, color: T.grey }}>{node.supplier || "—"}</td>
      <td style={{ padding: "8px 10px" }}>
        {hasBadge && (
          <span style={{ fontFamily: F, fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 3,
            background: node.warn ? T.redL : T.amberL, color: node.warn ? T.red : T.amber,
            border: `1px solid ${node.warn ? T.red : T.amber}`, whiteSpace: "nowrap" }}>
            {node.warn ? "GUARD" : "GATE"}
          </span>
        )}
      </td>
    </tr>
  );
}

// ── LINE SECTION ──
function LineSection({ sectionNum, sectionTitle, lineCode, lineName, nodes, totalKw, totalCapex, monthlyElec, throughput }) {
  return (
    <div style={{ marginBottom: 0 }} className="print-section">
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14, paddingBottom: 10, borderBottom: `2px solid ${T.teal}` }}>
        <span style={{ background: T.teal, color: T.bg, fontFamily: F, fontWeight: 700, fontSize: 12, padding: "4px 12px", borderRadius: 4, letterSpacing: ".08em" }}>§{sectionNum}</span>
        <span style={{ fontFamily: F, fontWeight: 700, fontSize: 16, color: T.navy }}>{sectionTitle}</span>
        <span style={{ fontFamily: F, fontSize: 11, color: T.grey, marginLeft: 4 }}>— {nodes.length} nodes · {totalKw} kW installed</span>
      </div>

      {/* Summary strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 16, padding: "12px 16px", background: T.nodeBg, borderRadius: 6, border: `1px solid ${T.border}` }}>
        {[
          { lbl: "Throughput",     val: throughput,                        col: T.navy  },
          { lbl: "Total Power",    val: `${totalKw} kW`,                   col: T.teal  },
          { lbl: "Equipment CAPEX",val: totalCapex > 0 ? `$${(totalCapex/1000).toFixed(0)}K` : "RFQ pending", col: T.amber },
          { lbl: "Monthly Elec.",  val: monthlyElec,                       col: T.green },
        ].map((k, i) => (
          <div key={i}>
            <div style={{ fontFamily: F, fontSize: 9, fontWeight: 700, color: T.grey, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 3 }}>{k.lbl}</div>
            <div style={{ fontFamily: F, fontSize: 14, fontWeight: 700, color: k.col }}>{k.val}</div>
          </div>
        ))}
      </div>

      {/* Node table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", border: `1px solid ${T.border}`, borderRadius: 6, overflow: "hidden" }}>
          <thead>
            <tr style={{ background: T.navy }}>
              {["Tag", "Equipment Name", "t/h", "MC In", "MC Out", "kW", "CAPEX", "Supplier", "Flag"].map((h, i) => (
                <th key={i} style={{ padding: "8px 10px", fontFamily: F, fontSize: 10, fontWeight: 700, color: "#FFFFFF", textTransform: "uppercase", letterSpacing: ".05em", textAlign: i >= 2 && i <= 5 ? "center" : "left", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {nodes.map((node, i) => <NodeRow key={node.tag} node={node} idx={i} />)}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── MAIN COMPONENT ──
export default function S1EngineeringPrint() {
  const location = useLocation();
  const nav = useNavigate();

  // Auto-trigger window.print() if ?print query param is present
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("print") !== null) {
      const timer = setTimeout(() => window.print(), 400);
      return () => clearTimeout(timer);
    }
  }, [location.search]);

  const printStyles = `
    @media print {
      @page { size: A4 portrait; margin: 12mm; }
      .no-print { display: none !important; }
      .print-section { page-break-inside: avoid; }
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700&family=EB+Garamond:wght@400;700&display=swap');
  `;

  return (
    <div style={{ background: T.bg, color: T.text, fontFamily: F, fontSize: 13 }}>
      <style>{printStyles}</style>

      {/* ── PRINT TOOLBAR (no-print) ── */}
      <div className="no-print" style={{
        position: "sticky", top: 0, zIndex: 100,
        background: T.navy, padding: "10px 32px",
        display: "flex", alignItems: "center", gap: 16,
        boxShadow: "0 2px 8px rgba(0,0,0,.18)",
      }}>
        <button
          onClick={() => nav("/s1-engineering")}
          style={{ padding: "7px 16px", background: "transparent", border: "1.5px solid rgba(255,255,255,.35)", borderRadius: 5, color: "#FFFFFF", fontFamily: F, fontSize: 12, fontWeight: 600, cursor: "pointer", letterSpacing: ".02em" }}
        >
          ← Back to Engineering
        </button>
        <div style={{ flex: 1 }} />
        <span style={{ fontFamily: F, fontSize: 12, color: "rgba(255,255,255,.6)" }}>
          S1 Complete Engineering — All Residues Combined · CFI Deep Tech
        </span>
        <button
          onClick={() => window.print()}
          style={{ padding: "8px 22px", background: T.teal, border: "none", borderRadius: 5, color: "#FFFFFF", fontFamily: F, fontSize: 13, fontWeight: 700, cursor: "pointer", letterSpacing: ".03em", boxShadow: "0 2px 6px rgba(0,137,123,.4)" }}
        >
          🖨 Print / Export PDF
        </button>
      </div>

      {/* ── DOCUMENT BODY ── */}
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "40px 48px 80px" }}>

        {/* ── DOCUMENT HEADER ── */}
        <div style={{ marginBottom: 36, paddingBottom: 20, borderBottom: `3px solid ${T.navy}` }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
            <div>
              <div style={{ fontFamily: "'EB Garamond', serif", fontWeight: 700, fontSize: 30, color: T.navy, letterSpacing: ".5px", lineHeight: 1.1 }}>
                CFI <span style={{ color: T.teal }}>Deep Tech</span>
              </div>
              <div style={{ fontFamily: F, fontStyle: "italic", fontSize: 12, color: T.grey, marginTop: 4 }}>
                Circular Fertiliser Industries
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: F, fontSize: 10, color: T.grey, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 4 }}>Document Reference</div>
              <div style={{ fontFamily: F, fontSize: 12, fontWeight: 700, color: T.navy }}>CFI-S1-ENG-PRINT-R01</div>
              <div style={{ fontFamily: F, fontSize: 11, color: T.grey, marginTop: 2 }}>Rev 01 · March 2026</div>
            </div>
          </div>
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontFamily: F, fontWeight: 700, fontSize: 22, color: T.navy, lineHeight: 1.2, marginBottom: 6 }}>
              Stage 1 Mechanical Processing — Complete Engineering Documentation
            </div>
            <div style={{ fontFamily: F, fontSize: 13, color: T.textL, lineHeight: 1.6 }}>
              Process Engineering · Equipment Node Specifications · Architectural Specifications
              <span style={{ color: T.border }}> / </span>
              60 TPH FFB Design Basis · Bogor, West Java, Indonesia
            </div>
          </div>
          {/* Status badges */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
            {[
              { label: "EFB S1C — ACTIVE",     bg: T.tealL,  color: T.teal  },
              { label: "OPDC S1B — ACTIVE",    bg: T.amberL, color: T.amber },
              { label: "POS S1A — ICP-OES Pending", bg: T.redL, color: T.red },
              { label: "24 Equipment Nodes",   bg: T.nodeBg, color: T.navy  },
              { label: "566 kW Total Installed",bg: T.tealL, color: T.teal  },
            ].map((b, i) => (
              <span key={i} style={{ fontFamily: F, fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 4, background: b.bg, color: b.color, border: `1px solid ${b.color}33` }}>{b.label}</span>
            ))}
          </div>
        </div>

        {/* ── TABLE OF CONTENTS ── */}
        <div style={{ marginBottom: 32, padding: "16px 20px", background: T.nodeBg, borderRadius: 6, border: `1px solid ${T.border}` }}>
          <div style={{ fontFamily: F, fontWeight: 700, fontSize: 11, color: T.navy, textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 10 }}>Contents</div>
          {[
            { sec: "§1", title: "Facility Overview & Design Basis",       sub: "Combined totals · 3 lines · 60 TPH FFB" },
            { sec: "§2", title: "POS S1A Line — Complete Engineering",    sub: "4 nodes · 62 kW · Sludge pit → Decanter → Buffer" },
            { sec: "§3", title: "EFB S1C Line — Complete Engineering",    sub: "10 nodes · 298 kW · Feeder → Shredder → Mill → Screen" },
            { sec: "§4", title: "OPDC S1B Line — Complete Engineering",   sub: "10 nodes · 206 kW · Feeder → Press → Mill → Buffer" },
            { sec: "§5", title: "Architectural & Building Specifications", sub: "Site metrics · Greenhouses · CAPEX A1-A8" },
          ].map((row, i) => (
            <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 8, paddingBottom: 6, marginBottom: 6, borderBottom: i < 4 ? `1px solid ${T.border}` : "none" }}>
              <span style={{ fontFamily: F, fontSize: 11, fontWeight: 700, color: T.teal, minWidth: 24 }}>{row.sec}</span>
              <span style={{ fontFamily: F, fontSize: 11, fontWeight: 600, color: T.navy, minWidth: 260 }}>{row.title}</span>
              <span style={{ fontFamily: F, fontSize: 10, color: T.grey }}>{row.sub}</span>
            </div>
          ))}
        </div>

        {/* ── §1 FACILITY OVERVIEW ── */}
        <div style={{ marginBottom: 36 }} className="print-section">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14, paddingBottom: 10, borderBottom: `2px solid ${T.teal}` }}>
            <span style={{ background: T.teal, color: T.bg, fontFamily: F, fontWeight: 700, fontSize: 12, padding: "4px 12px", borderRadius: 4, letterSpacing: ".08em" }}>§1</span>
            <span style={{ fontFamily: F, fontWeight: 700, fontSize: 16, color: T.navy }}>Facility Overview & Design Basis</span>
          </div>

          {/* Design Basis */}
          <div style={{ marginBottom: 16, padding: "14px 18px", background: T.nodeBg, borderRadius: 6, border: `1px solid ${T.border}` }}>
            <div style={{ fontFamily: F, fontSize: 11, fontWeight: 700, color: T.grey, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 10 }}>Design Basis</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
              {[
                { lbl: "FFB Mill Throughput", val: "60 TPH FFB" },
                { lbl: "Operating Hours",     val: "20 hr/day" },
                { lbl: "Location",            val: "Bogor, West Java, Indonesia" },
                { lbl: "Design Revision",     val: "Rev 01 · March 2026" },
              ].map((k, i) => (
                <div key={i}>
                  <div style={{ fontFamily: F, fontSize: 9, fontWeight: 700, color: T.grey, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 3 }}>{k.lbl}</div>
                  <div style={{ fontFamily: F, fontSize: 13, fontWeight: 700, color: T.navy }}>{k.val}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 3-line summary */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 16 }}>
            {[
              { code: "S1A POS",  nodes: 4,  kw: 62,  capex: "RFQ $80–150K",  input: "1.25 t/h DM",  mc: "82% → 65%", accent: "#3B82F6" },
              { code: "S1C EFB",  nodes: 10, kw: 298, capex: "$184K",          input: "20 t/h",       mc: "62.5% → 47.5%", accent: T.teal  },
              { code: "S1B OPDC", nodes: 10, kw: 206, capex: "$38K",           input: "5 t/h",        mc: "72.5% → 61%", accent: T.amber },
            ].map((l, i) => (
              <div key={i} style={{ background: T.bg, border: `1px solid ${l.accent}44`, borderTop: `3px solid ${l.accent}`, borderRadius: 6, padding: "14px 16px" }}>
                <div style={{ fontFamily: F, fontSize: 14, fontWeight: 700, color: l.accent, marginBottom: 10 }}>{l.code}</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5px 12px" }}>
                  {[
                    { lbl: "Nodes",    val: l.nodes  },
                    { lbl: "Power",    val: `${l.kw} kW` },
                    { lbl: "Equip CAPEX", val: l.capex },
                    { lbl: "Input",    val: l.input  },
                    { lbl: "MC Range", val: l.mc     },
                  ].map((m, j) => (
                    <div key={j}>
                      <div style={{ fontFamily: F, fontSize: 9, fontWeight: 700, color: T.grey, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 1 }}>{m.lbl}</div>
                      <div style={{ fontFamily: F, fontSize: 12, fontWeight: 700, color: T.navy }}>{m.val}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Facility totals */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12, padding: "14px 18px", background: "#F0F9F8", borderRadius: 6, border: `1px solid ${T.teal}30` }}>
            {[
              { lbl: "Total Lines",          val: "3",          col: T.teal  },
              { lbl: "Total Equipment Nodes",val: "24",         col: T.navy  },
              { lbl: "Combined Installed kW",val: "566 kW",     col: T.teal  },
              { lbl: "Combined Equip CAPEX", val: "~$398K",     col: T.amber },
              { lbl: "Building CAPEX",       val: "$1.37M",     col: T.amber },
            ].map((k, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: F, fontSize: 9, fontWeight: 700, color: T.grey, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 4 }}>{k.lbl}</div>
                <div style={{ fontFamily: F, fontSize: 18, fontWeight: 700, color: k.col }}>{k.val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── §2 POS S1A LINE ── */}
        <div style={{ marginBottom: 36 }}>
          <LineSection
            sectionNum={2}
            sectionTitle="POS S1A Line — Complete Engineering"
            lineCode="S1A"
            lineName="Palm Oil Sludge"
            nodes={S1A_NODES}
            totalKw={62}
            totalCapex={0}
            monthlyElec="$1,806/mo"
            throughput="1.25 t/h DM"
          />
        </div>

        {/* ── §3 EFB S1C LINE ── */}
        <div style={{ marginBottom: 36 }}>
          <LineSection
            sectionNum={3}
            sectionTitle="EFB S1C Line — Complete Engineering"
            lineCode="S1C"
            lineName="Empty Fruit Bunch"
            nodes={S1C_NODES}
            totalKw={298}
            totalCapex={184000}
            monthlyElec="$14,191/mo"
            throughput="20 t/h FFB input"
          />
        </div>

        {/* ── §4 OPDC S1B LINE ── */}
        <div style={{ marginBottom: 36 }}>
          <LineSection
            sectionNum={4}
            sectionTitle="OPDC S1B Line — Complete Engineering"
            lineCode="S1B"
            lineName="Oil Palm Decanter Cake"
            nodes={S1B_NODES}
            totalKw={206}
            totalCapex={38000}
            monthlyElec="$6,651/mo"
            throughput="5 t/h OPDC input"
          />
        </div>

        {/* ── §5 ARCHITECTURAL & BUILDING SPECS ── */}
        <div style={{ marginBottom: 36 }} className="print-section">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, paddingBottom: 10, borderBottom: `2px solid ${T.teal}` }}>
            <span style={{ background: T.teal, color: T.bg, fontFamily: F, fontWeight: 700, fontSize: 12, padding: "4px 12px", borderRadius: 4, letterSpacing: ".08em" }}>§5</span>
            <span style={{ fontFamily: F, fontWeight: 700, fontSize: 16, color: T.navy }}>Architectural & Building Specifications</span>
          </div>

          {/* Site Metrics */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontFamily: F, fontWeight: 700, fontSize: 12, color: T.navy, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 10 }}>5.1 Site Metrics</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
              {SITE_METRICS.map((m, i) => (
                <div key={i} style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 5, padding: "10px 12px" }}>
                  <div style={{ fontFamily: F, fontSize: 9, fontWeight: 700, color: T.grey, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 3 }}>{m.label}</div>
                  <div style={{ fontFamily: F, fontSize: 15, fontWeight: 700, color: T.amber, lineHeight: 1, marginBottom: 3 }}>{m.val}</div>
                  <div style={{ fontFamily: F, fontSize: 10, color: T.grey }}>{m.note}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Greenhouse Structures */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontFamily: F, fontWeight: 700, fontSize: 12, color: T.navy, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 10 }}>5.2 Greenhouse & Ancillary Structures</div>
            <div style={{ fontFamily: F, fontSize: 11, color: T.textL, marginBottom: 10 }}>
              Site layout: 98m × 85m. Greenhouse block: 1,920 m² (4 × 40×8m). 2 rows × 2 columns with 6m central access road. East entrance.
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12 }}>
              {GREENHOUSES.map((gh) => (
                <div key={gh.id} style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 6, padding: "14px 16px" }}>
                  <div style={{ fontFamily: F, fontSize: 13, fontWeight: 700, color: T.teal, marginBottom: 8 }}>{gh.name}</div>
                  {[
                    { lbl: "Dimensions", val: gh.dims },
                    { lbl: "Floor Area",  val: gh.area },
                    { lbl: "Type",        val: gh.type },
                    { lbl: "Materials",   val: gh.matl },
                  ].map((r, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 8, paddingBottom: 6, marginBottom: 6, borderBottom: `1px solid ${T.border}` }}>
                      <span style={{ fontFamily: F, fontSize: 9, fontWeight: 700, color: T.grey, textTransform: "uppercase", letterSpacing: ".05em", flexShrink: 0 }}>{r.lbl}</span>
                      <span style={{ fontFamily: F, fontSize: 10, color: T.text, textAlign: "right" }}>{r.val}</span>
                    </div>
                  ))}
                  <div style={{ fontFamily: F, fontSize: 10, fontWeight: 700, color: T.amber, background: T.amberL, padding: "5px 10px", borderRadius: 4, marginTop: 4 }}>COST: DATA GAP</div>
                </div>
              ))}
            </div>
          </div>

          {/* Building CAPEX A1-A8 */}
          <div>
            <div style={{ fontFamily: F, fontWeight: 700, fontSize: 12, color: T.navy, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 10 }}>5.3 Building CAPEX — A1 to A8</div>

            {/* Total banner */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "14px 18px", background: T.greenL, borderRadius: 8, border: `1px solid ${T.green}30`, marginBottom: 12 }}>
              <div>
                <div style={{ fontFamily: F, fontSize: 10, color: T.grey, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 4 }}>Total S1 CAPEX To CFI</div>
                <div style={{ fontFamily: F, fontSize: 26, fontWeight: 700, color: T.green, lineHeight: 1 }}>$1,607,610</div>
                <div style={{ fontFamily: F, fontSize: 10, color: T.grey, marginTop: 4 }}>+ POS RFQ $80–150K outstanding</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: F, fontSize: 10, color: T.grey }}>Western equiv.</div>
                <div style={{ fontFamily: F, fontSize: 13, color: T.grey, textDecoration: "line-through" }}>$2,285,586</div>
                <div style={{ fontFamily: F, fontSize: 10, color: T.green, marginTop: 2 }}>Save ~$678K using Indo rates</div>
              </div>
            </div>

            {/* Line items */}
            <div style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 6, overflow: "hidden" }}>
              {BUILDING_CAPEX.map((item, idx) => (
                <div key={item.ref} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "9px 16px", borderBottom: `1px solid ${T.border}`, background: idx % 2 === 1 ? "#FAFBFC" : T.bg }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontFamily: F, fontSize: 10, fontWeight: 700, color: T.teal, background: T.tealL, padding: "2px 8px", borderRadius: 3 }}>{item.ref}</span>
                    <span style={{ fontFamily: F, fontSize: 11, color: T.text }}>{item.name}</span>
                  </div>
                  <span style={{ fontFamily: F, fontSize: 12, fontWeight: 700, color: T.amber }}>${item.cost.toLocaleString()}</span>
                </div>
              ))}
              {[
                { lbl: "Base Total (A1-A8)",              val: "$883,880",   bold: false },
                { lbl: "+ 8% Contingency",                val: "$70,710",    bold: false },
                { lbl: "+ 20% EPC Overheads & Margin",    val: "$190,918",   bold: false },
                { lbl: "+ 20% Developer Markup",          val: "$229,102",   bold: false },
              ].map((row, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "9px 16px", borderBottom: `1px solid ${T.border}` }}>
                  <span style={{ fontFamily: F, fontSize: 11, color: T.textL }}>{row.lbl}</span>
                  <span style={{ fontFamily: F, fontSize: 12, fontWeight: 700, color: T.amber }}>{row.val}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "11px 16px", borderTop: `2px solid ${T.teal}`, background: T.tealL }}>
                <span style={{ fontFamily: F, fontSize: 12, fontWeight: 700, color: T.teal }}>Building CAPEX Subtotal</span>
                <span style={{ fontFamily: F, fontSize: 15, fontWeight: 700, color: T.green }}>$1,374,610</span>
              </div>
            </div>

            {/* Equipment CAPEX summary table */}
            <div style={{ marginTop: 16 }}>
              <div style={{ fontFamily: F, fontWeight: 700, fontSize: 11, color: T.navy, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 8 }}>Equipment CAPEX Summary</div>
              <table style={{ width: "100%", borderCollapse: "collapse", border: `1px solid ${T.border}`, borderRadius: 6, overflow: "hidden" }}>
                <thead>
                  <tr style={{ background: T.navy }}>
                    {["Line", "Item", "Cost"].map((h, i) => (
                      <th key={i} style={{ padding: "7px 12px", fontFamily: F, fontSize: 10, fontWeight: 700, color: "#FFFFFF", textTransform: "uppercase", letterSpacing: ".05em", textAlign: i === 2 ? "right" : "left" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {CAPEX_ITEMS.map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: `1px solid ${T.border}`, background: idx % 2 === 1 ? "#FAFBFC" : T.bg }}>
                      <td style={{ padding: "7px 12px", fontFamily: F, fontSize: 10, fontWeight: 700, color: T.teal, whiteSpace: "nowrap" }}>{item.line}</td>
                      <td style={{ padding: "7px 12px", fontFamily: F, fontSize: 11, color: T.text }}>{item.item}</td>
                      <td style={{ padding: "7px 12px", fontFamily: F, fontSize: 11, fontWeight: 700, color: item.cost === 0 ? T.grey : T.amber, textAlign: "right" }}>
                        {item.cost === 0 ? "Shared" : `$${item.cost.toLocaleString()}`}
                      </td>
                    </tr>
                  ))}
                  <tr style={{ borderTop: `2px solid ${T.teal}`, background: T.tealL }}>
                    <td colSpan={2} style={{ padding: "9px 12px", fontFamily: F, fontSize: 12, fontWeight: 700, color: T.teal }}>Combined Equipment CAPEX</td>
                    <td style={{ padding: "9px 12px", fontFamily: F, fontSize: 13, fontWeight: 700, color: T.green, textAlign: "right" }}>$398,000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <div style={{ marginTop: 40, paddingTop: 16, borderTop: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontFamily: F, fontSize: 10, color: T.grey }}>CFI Deep Tech · Circular Fertiliser Industries · 60 TPH FFB · Bogor, West Java</div>
          <div style={{ fontFamily: F, fontSize: 10, color: T.grey }}>CFI-S1-ENG-PRINT-R01 · Rev 01 · March 2026 · CONFIDENTIAL</div>
        </div>
      </div>
    </div>
  );
}
