import { useState, useCallback, useMemo } from "react";

/*
 * âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
 * CFI Deep Tech â S1 Mechanical Processing Â· Engineering Complete
 * âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
 * WHITE / FORMAL / CLEAN design variant
 * Three processing lines: S1C (EFB), S1B (OPDC), S1A (POS)
 * 24 nodes total across 3 lines, 18 equipment CAPEX items, 9 guardrails
 * 6 greenhouse structures with data gaps
 * Navigation arrows on stage tab row for page flipping
 * âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
 */

// ââ COLOUR TOKENS (pure white palette â grey only in machinery fields) ââ
const T = {
  bg:      "#FFFFFF",
  bgAlt:   "#FFFFFF",
  bgCard:  "#FFFFFF",
  nodeBg:  "#F5F7FA",
  border:  "#E2E6EC",
  borderD: "#CBD2DC",
  teal:    "#00897B",
  tealL:   "#E0F2F1",
  tealBg:  "rgba(0,137,123,.06)",
  amber:   "#E65100",
  amberL:  "#FFF3E0",
  green:   "#2E7D32",
  greenL:  "#E8F5E9",
  red:     "#C62828",
  redL:    "#FFEBEE",
  blue:    "#1565C0",
  navy:    "#1A2332",
  navyL:   "#37474F",
  grey:    "#78909C",
  greyD:   "#455A64",
  greyL:   "#B0BEC5",
  text:    "#263238",
  textL:   "#546E7A",
  white:   "#FFFFFF",
};

// ââ FONT (DM Sans only) ââ
const F = "'DM Sans', sans-serif";

// ââ PAGE NAVIGATION LINKS ââ
const STAGE_PAGES = [
  { key: "S0", label: "S0 Mill Config", route: "/s0-mill-config" },
  { key: "S1", label: "S1 Pre-Processing", route: "/s1-engineering" },
  { key: "S2", label: "S2 Mixing", route: "/s2-mixing" },
  { key: "S3", label: "S3 Biological", route: "/s3-biological" },
  { key: "S4", label: "S4 BSF", route: "/s4-bsf" },
  { key: "S5", label: "S5 Post-Process", route: "/s5-post-process" },
  { key: "S6", label: "S6 Products", route: "/s6-products" },
];

// ââ S1C EFB LINE (10 nodes, 298 kW, $184K CAPEX) ââ
const S1C_NODES = [
  { id: "c1", tag: "AF-01", name: "Hydraulic Feeder", th: 20, mcIn: "62.5%", mcOut: "62.5%", elev: "0m", kw: 18, capex: 15000, supplier: "PT Jayatech Palmindo", gate: "", warn: "", desc: "20 t/h input feeder for EFB. Standard reciprocating action, no pre-processing." },
  { id: "c2", tag: "BC-01/02", name: "Incline Conveyor 600mm", th: 20, mcIn: "62.5%", mcOut: "62.5%", elev: "2m", kw: 22, capex: 18000, supplier: "PT Sinar Surya Lestari", gate: "", warn: "", desc: "600mm belt conveyor. 20 t/h throughput, 62.5% MC. Incline lift to 2m elevation." },
  { id: "c3", tag: "TR-2060", name: "Trommel Screen 50mm", th: 19, mcIn: "62.5%", mcOut: "62.5%", elev: "6m", kw: 11, capex: 8000, supplier: "PT Hans Jaya Utama", gate: "", warn: "", desc: "50mm opening. Removes oversized fibre bundles. 19 t/h output to next stage." },
  { id: "c4", tag: "OBM-01", name: "Overband Magnet", th: 19, mcIn: "62.5%", mcOut: "62.5%", elev: "6m", kw: 3, capex: 0, supplier: "", gate: "", warn: "", desc: "Ferrous metal detection. No cost data available. Critical for mill safety." },
  { id: "c5", tag: "PR-01", name: "Screw Press + PKSA", th: 14, mcIn: "62.5%", mcOut: "47.5%", elev: "6m", kw: 30, capex: 0, supplier: "", gate: "Gate B.G2", warn: "GUARD: MC \u2265 40% LOCKED (CLASS A)", desc: "Moisture reduction from 62.5% to 47.5% MC. CLASS A minimum moisture constraint." },
  { id: "c6", tag: "SD-01", name: "Primary Shredder", th: 14, mcIn: "47.5%", mcOut: "47.5%", elev: "6m", kw: 75, capex: 45000, supplier: "CV Has Engineering", gate: "", warn: "GUARD: Temp < 85\u00b0C", desc: "Coarse size reduction. 14 t/h input. 75 kW primary shredding stage." },
  { id: "c7", tag: "HM-01", name: "Hammer Mill", th: 14, mcIn: "47.5%", mcOut: "47.5%", elev: "6m", kw: 110, capex: 35000, supplier: "Cakrawala Mesin Multindo", gate: "SPRING-ISO gate", warn: "GUARD: Temp < 85\u00b0C", desc: "Fine shredding to 2mm target. 110 kW. Largest power consumer on EFB line. SPRING-ISO gate required." },
  { id: "c8", tag: "VS-01", name: "Vibrating Screen 2mm", th: 13, mcIn: "47.5%", mcOut: "47.5%", elev: "6m", kw: 11, capex: 12000, supplier: "CV Has Engineering", gate: "Gate B.G1", warn: "", desc: "2mm screening. Separates fines for pneumatic transport. 13 t/h throughput." },
  { id: "c9", tag: "DC-01", name: "Baghouse (Shared)", th: 13, mcIn: "47.5%", mcOut: "47.5%", elev: "6m", kw: 18, capex: 0, supplier: "", gate: "", warn: "", desc: "Dust collection shared with S1B OPDC line. 18 kW total. Maintains air quality." },
  { id: "c10", tag: "BIN-EFB-01", name: "Buffer Bin 50m\u00b3", th: 13, mcIn: "47.5%", mcOut: "47.5%", elev: "6m", kw: 0, capex: 25000, supplier: "PT BSB", gate: "", warn: "GUARD: ADL < 12% DM (BSF) \u00b7 C:N 15\u201322 optimal \u00b7 CEC > 20 cmol/kg", desc: "50m\u00b3 buffer storage. Final output bin. Ready for S2 mixing stage. 13 t/h nominal." },
];

// ââ S1B OPDC LINE (10 nodes, 206 kW, $38K CAPEX) ââ
const S1B_NODES = [
  { id: "b1", tag: "SF-01", name: "Reciprocating Feeder", th: 5, mcIn: "72.5%", mcOut: "72.5%", elev: "0m", kw: 7.5, capex: 10000, supplier: "", gate: "", warn: "", desc: "5 t/h input feeder for Oil Palm Decanter Cake. Reciprocating action for denser material." },
  { id: "b2", tag: "BC-10/11", name: "Incline Conveyor 500mm", th: 5, mcIn: "72.5%", mcOut: "72.5%", elev: "2m", kw: 15, capex: 8000, supplier: "PT Sinar Surya Lestari", gate: "", warn: "", desc: "500mm belt conveyor. 5 t/h throughput. Incline lift to 2m elevation." },
  { id: "b3", tag: "TR-OPDC-01", name: "Trommel Screen 50mm", th: 4.8, mcIn: "72.5%", mcOut: "72.5%", elev: "6m", kw: 9, capex: 5000, supplier: "PT Hans Jaya Utama", gate: "", warn: "", desc: "50mm opening. Oversized OPDC removal. 4.8 t/h to next stage." },
  { id: "b4", tag: "OBM-02", name: "Overband Magnet", th: 4.8, mcIn: "72.5%", mcOut: "72.5%", elev: "6m", kw: 3, capex: 0, supplier: "", gate: "", warn: "", desc: "Ferrous metal detection on OPDC line. No cost data available." },
  { id: "b5", tag: "DC-PRESS-01", name: "Screw Press + PKSA", th: 3.5, mcIn: "72.5%", mcOut: "61%", elev: "6m", kw: 30, capex: 0, supplier: "", gate: "Gate B.G2", warn: "GUARD: MC \u2265 40% MIN CLASS A", desc: "Moisture reduction from 72.5% to 61% MC. CLASS A minimum constraint enforced." },
  { id: "b6", tag: "LB-01", name: "Lump Breaker", th: 3.5, mcIn: "61%", mcOut: "61%", elev: "6m", kw: 37, capex: 0, supplier: "", gate: "", warn: "", desc: "Breaks agglomerated lumps in OPDC. 37 kW. Critical for consistent downstream processing." },
  { id: "b7", tag: "HM-02", name: "Hammer Mill", th: 3.5, mcIn: "61%", mcOut: "61%", elev: "6m", kw: 90, capex: 0, supplier: "Zhengzhou Sinoder", gate: "SPRING-ISO", warn: "GUARD: Temp < 85\u00b0C", desc: "Fine shredding to 2mm target. 90 kW. SPRING-ISO gate required." },
  { id: "b8", tag: "VS-02", name: "Vibrating Screen 2mm", th: 3.3, mcIn: "61%", mcOut: "61%", elev: "6m", kw: 9, capex: 0, supplier: "", gate: "Gate B.G1", warn: "", desc: "2mm screening for OPDC. Separates fines for pneumatic transport. 3.3 t/h." },
  { id: "b9", tag: "DC-01", name: "Baghouse (Shared)", th: 3.3, mcIn: "61%", mcOut: "61%", elev: "6m", kw: 0, capex: 0, supplier: "", gate: "", warn: "", desc: "Dust collection shared with S1C EFB line. Integrated into EFB DC-01 baghouse." },
  { id: "b10", tag: "BIN-OPDC-24HR", name: "Buffer Bin 85m\u00b3 + Rake", th: 3.3, mcIn: "61%", mcOut: "61%", elev: "6m", kw: 5.5, capex: 15000, supplier: "PT BSB", gate: "Gate C.G2/G3", warn: "GUARD: ADL < 12% DM (BSF) \u00b7 C:N 15\u201322 optimal \u00b7 pH 8.0\u20139.0", desc: "85m\u00b3 buffer storage with rake agitation. 24-hour residence time. pH 8.0\u20139.0 target." },
];

// ââ S1A POS LINE (4 nodes, 62 kW, RFQ pending) ââ
const S1A_NODES = [
  { id: "a1", tag: "RH-OPDC-101", name: "Sludge Pit 15m\u00b3", th: 1.25, mcIn: "82%", mcOut: "82%", elev: "0m", kw: 0, capex: 0, supplier: "", gate: "ICP-OES-Fe gate", warn: "GUARD: Fe < 3,000 mg/kg DM \u00b7 No Cr > 20 mg/kg", desc: "15m\u00b3 sludge pit. 1.25 t/h DM input (~30 t/day FW). ICP-OES iron gate enforcement." },
  { id: "a2", tag: "DRS-SLD-01", name: "Rotary Drum Screen", th: 1.17, mcIn: "82%", mcOut: "78%", elev: "1.5m", kw: 7, capex: 0, supplier: "", gate: "", warn: "", desc: "Removes stones and grit. Moisture reduction from 82% to 78% MC. 1.17 t/h throughput." },
  { id: "a3", tag: "DEC-SLD-101", name: "Decanter Centrifuge", th: 0.56, mcIn: "78%", mcOut: "65%", elev: "3m", kw: 55, capex: 0, supplier: "Alfa Laval preferred", gate: "", warn: "", desc: "Moisture reduction from 78% to 65% MC. 55 kW high-speed centrifugation. RFQ $80K\u2013$150K pending." },
  { id: "a4", tag: "BIN-OPDC-301", name: "Buffer Tank 15m\u00b3", th: 0.56, mcIn: "65%", mcOut: "65%", elev: "3m", kw: 0, capex: 0, supplier: "", gate: "", warn: "GUARD: ADL < 12% DM (BSF) \u00b7 C:N 15\u201322 optimal \u00b7 CEC > 20 cmol/kg", desc: "15m\u00b3 buffer tank. 0.56 t/h final output. Ready for S2 mixing stage." },
];

// ââ EQUIPMENT CAPEX SUMMARY (18 items) ââ
const CAPEX_ITEMS = [
  { line: "S1C EFB", item: "AF-01 Hydraulic Feeder", cost: 15000 },
  { line: "S1C EFB", item: "BC-01/02 Incline Conveyor 600mm", cost: 18000 },
  { line: "S1C EFB", item: "TR-2060 Trommel Screen", cost: 8000 },
  { line: "S1C EFB", item: "SD-01 Primary Shredder", cost: 45000 },
  { line: "S1C EFB", item: "HM-01 Hammer Mill", cost: 35000 },
  { line: "S1C EFB", item: "VS-01 Vibrating Screen", cost: 12000 },
  { line: "S1C EFB", item: "BIN-EFB-01 Buffer Bin 50m\u00b3", cost: 25000 },
  { line: "S1B OPDC", item: "SF-01 Reciprocating Feeder", cost: 10000 },
  { line: "S1B OPDC", item: "BC-10/11 Incline Conveyor 500mm", cost: 8000 },
  { line: "S1B OPDC", item: "TR-OPDC-01 Trommel Screen", cost: 5000 },
  { line: "S1B OPDC", item: "BIN-OPDC-24HR Buffer Bin 85m\u00b3", cost: 15000 },
  { line: "Shared", item: "DC-01 Baghouse (Shared)", cost: 0 },
  { line: "Shared", item: "Limestone Station", cost: 6000 },
  { line: "Shared", item: "2\u00d7 Wheel Loaders (2 \u00d7 $85K)", cost: 170000 },
];

// ââ GREENHOUSES (6 structures) ââ
const GREENHOUSES = [
  { id: "gh1", name: "GH-1 Greenhouse", dims: "40m \u00d7 8m \u00d7 2.5m", area: "320 m\u00b2", type: "Arched tunnel greenhouse", matl: "Round pipe 42mm\u00d72mm MS painted aluminium, purlin 25mm\u00d71.5mm, brace 32mm\u00d71.5mm, shade net + arched PE film, brick wall 150mm perimeter, strip foundation 300mm, slab 150mm C20", cost: "COST: DATA GAP" },
  { id: "gh2", name: "GH-2 Greenhouse", dims: "40m \u00d7 8m \u00d7 2.5m", area: "320 m\u00b2", type: "Arched tunnel greenhouse", matl: "Identical spec to GH-1. U-clamps 25mm and 32mm dia.", cost: "COST: DATA GAP" },
  { id: "gh3", name: "GH-3 Greenhouse", dims: "40m \u00d7 8m \u00d7 2.5m", area: "320 m\u00b2", type: "Arched tunnel greenhouse", matl: "Identical spec to GH-1", cost: "COST: DATA GAP" },
  { id: "gh4", name: "GH-4 Greenhouse", dims: "40m \u00d7 8m \u00d7 2.5m", area: "320 m\u00b2", type: "Arched tunnel greenhouse", matl: "Identical spec to GH-1", cost: "COST: DATA GAP" },
  { id: "store", name: "Store / Product Storage", dims: "11m \u00d7 5m \u00d7 3m", area: "55 m\u00b2", type: "Standard enclosed", matl: "150mm brick walls (1:3 mortar), 75\u00d750mm purlins, 100\u00d750mm rafters/struts/tie beams, Gauge 28 maroon corrugated iron roof + walls, 150mm C20 slab, 150mm DPC", cost: "COST: DATA GAP" },
  { id: "shade", name: "Shredder Machine Shade", dims: "6m \u00d7 9m \u00d7 3m", area: "54 m\u00b2", type: "Open frame (2 sides open, 2 closed)", matl: "50\u00d750\u00d72mm MS square hollow section poles, 75\u00d750mm purlins, Gauge 28 corrugated iron roof, wire mesh sides, exhaust fan \u2265300mm, BRC A66 foundation", cost: "COST: DATA GAP" },
];

// ââ SITE METRICS ââ
const SITE_METRICS = [
  { label: "Total Site Area", val: "5,000 m\u00b2", note: "1.25 acres recommended" },
  { label: "Building Footprint", val: "1,260 m\u00b2", note: "36m \u00d7 35m \u00d7 10m ht \u00b7 PEB steel" },
  { label: "Greenhouse Block", val: "1,920 m\u00b2", note: "4 \u00d7 40\u00d78m \u00b7 2 rows \u00d7 2 cols" },
  { label: "Truck Receiving Bay", val: "216 m\u00b2", note: "18m \u00d7 12m \u00d7 4m ht" },
  { label: "Conveyor Gallery", val: "100 m\u00b2", note: "25m \u00d7 4m \u00b7 covered \u00b7 +0.5m" },
  { label: "Outside Space", val: "2,504 m\u00b2", note: "Roads, service lane, silos, workshop" },
  { label: "Greenhouse Site", val: "98m \u00d7 85m", note: "2 rows \u00d7 2 cols, 6m central access road" },
  { label: "Portal Frames", val: "7", note: "@ 6m spacing \u00b7 ASTM A36 PEB" },
];

// ââ BUILDING CAPEX A1-A8 ââ
const BUILDING_CAPEX = [
  { ref: "A1", name: "Site works \u2014 clearing, earthworks, drainage", cost: 79540 },
  { ref: "A2", name: "Civil & concrete \u2014 slabs, hoppers, bays", cost: 105900 },
  { ref: "A3", name: "Structural steel \u2014 PEB, cladding, platforms", cost: 336790 },
  { ref: "A4", name: "Welfare fit-out \u2014 fixtures & finishes", cost: 107650 },
  { ref: "A5", name: "MEP \u2014 power & lighting (500kVA transformer)", cost: 140000 },
  { ref: "A6", name: "MEP \u2014 HVAC & ventilation", cost: 28000 },
  { ref: "A7", name: "Plumbing & drainage", cost: 42000 },
  { ref: "A8", name: "Process building items (platforms, stairs)", cost: 44000 },
];

// ââ DATA GAPS ââ
const DATA_GAPS = [
  "Greenhouse construction costs (structural specs exist, no costs)",
  "Maintenance & repairs budget (% of CAPEX/year)",
  "Consumables \u2014 limestone, filter bags, conveyor belts, oils",
  "Land rental (co-location at mill \u2014 lease terms TBC)",
  "Commissioning & startup costs (separate from CAPEX)",
  "Working capital \u2014 3-month OPEX buffer before first revenue",
  "Insurance \u2014 assets + public liability",
  "Water / utilities beyond electricity",
  "Depreciation schedule \u2014 15-20yr building \u00b7 7-10yr equipment",
  "ROI / IRR / Payback period \u2014 no revenue model linked yet",
];

// ââ 9 GUARDRAILS ââ
const GUARDRAILS = [
  { id: "g1", name: "MC \u2265 40% LOCKED (CLASS A)", nodes: ["Screw Press nodes"], severity: "CRITICAL", color: T.red, desc: "Minimum moisture content constraint for all CLASS A equipment. Failure causes equipment blockage." },
  { id: "g2", name: "Fe < 3,000 mg/kg DM target", nodes: ["POS Sludge Pit"], severity: "HIGH", color: T.amber, desc: "ICP-OES iron concentration gate. Prevents ferrous contamination in downstream S2." },
  { id: "g3", name: "ADL < 12% DM for BSF", nodes: ["Buffer Bins"], severity: "HIGH", color: T.amber, desc: "Acid-insoluble lignin limit for Black Soldier Fly feed acceptability." },
  { id: "g4", name: "C:N 15\u201322 optimal", nodes: ["Buffer Bins"], severity: "STANDARD", color: T.teal, desc: "Carbon-to-nitrogen ratio for microbial balance in S2/S3 fermentation." },
  { id: "g5", name: "pH 8.0\u20139.0 range (OPDC buffer)", nodes: ["BIN-OPDC-24HR"], severity: "STANDARD", color: T.teal, desc: "pH target for oil palm decanter cake buffer bin. Maintains biological activity." },
  { id: "g6", name: "No Cr > 20 mg/kg", nodes: ["Sludge Pit"], severity: "CRITICAL", color: T.red, desc: "Chromium contamination gate. Prevents heavy metal pass-through to S2." },
  { id: "g7", name: "CEC > 20 cmol/kg target", nodes: ["Buffer Bins"], severity: "STANDARD", color: T.teal, desc: "Cation exchange capacity target for soil amendment potential in final product." },
  { id: "g8", name: "Belt speed locked at spec", nodes: ["Conveyor nodes"], severity: "STANDARD", color: T.teal, desc: "All conveyor belt speeds locked to design specification. No operator override." },
  { id: "g9", name: "All temps < 85\u00b0C", nodes: ["Hammer Mill, Shredder"], severity: "HIGH", color: T.red, desc: "Temperature gate to prevent decomposition of organic matter. Critical for S2 input quality." },
];

// ââ MAIN COMPONENT ââ
export default function S1_Engineering() {
  const [activeTab, setActiveTab] = useState("S1C");
  const [expandedNode, setExpandedNode] = useState(null);

  const currentStageIdx = STAGE_PAGES.findIndex((p) => p.key === "S1");
  const prevPage = currentStageIdx > 0 ? STAGE_PAGES[currentStageIdx - 1] : null;
  const nextPage = currentStageIdx < STAGE_PAGES.length - 1 ? STAGE_PAGES[currentStageIdx + 1] : null;

  const lines = {
    "S1C": { nodes: S1C_NODES, name: "Empty Fruit Bunch (EFB)", throughput: "20 t/h input", belt: "600mm", building: "15m \u00d7 35m \u00d7 10m", totalKw: 298, totalCapex: 184000, monthlyElec: "$14,191" },
    "S1B": { nodes: S1B_NODES, name: "Oil Palm Decanter Cake (OPDC)", throughput: "5 t/h input", belt: "500mm", building: "15m \u00d7 35m \u00d7 10m (shared)", totalKw: 206, totalCapex: 38000, monthlyElec: "$6,651" },
    "S1A": { nodes: S1A_NODES, name: "Palm Oil Sludge (POS)", throughput: "1.25 t/h DM", belt: "N/A", building: "12m \u00d7 18m \u00d7 6m", totalKw: 62, totalCapex: 0, monthlyElec: "$1,806" },
  };

  const activeLine = lines[activeTab];

  // ââ NAV ARROW STYLE ââ
  const navArrow = (disabled) => ({
    display: "flex", alignItems: "center", gap: 6, padding: "6px 14px",
    background: disabled ? "transparent" : T.tealL,
    color: disabled ? T.greyL : T.teal,
    border: `1px solid ${disabled ? T.border : T.teal}`,
    borderRadius: 6, cursor: disabled ? "default" : "pointer",
    fontFamily: F, fontSize: 12, fontWeight: 600,
    opacity: disabled ? 0.4 : 1,
    transition: "all 0.2s",
    textDecoration: "none",
  });

  // ââ STYLES (WHITE/FORMAL) ââ
  const s = {
    page: { background: T.white, color: T.text, fontFamily: F, fontSize: 13, lineHeight: 1.6, minHeight: "100vh" },
    // HEADER
    headerWrap: { position: "sticky", top: 0, zIndex: 100, background: T.white, borderBottom: `2px solid ${T.border}`, boxShadow: "0 2px 8px rgba(0,0,0,.06)" },
    headerRow1: { padding: "16px 40px", display: "flex", alignItems: "center", gap: 16, borderBottom: `1px solid ${T.border}` },
    brandName: { fontFamily: "'EB Garamond', serif", fontWeight: 700, fontSize: 26, color: T.navy, letterSpacing: "0.5px" },
    brandSuffix: { color: T.teal },
    dividerLine: { width: 2, height: 28, background: T.teal, borderRadius: 1 },
    tagline: { fontFamily: F, fontStyle: "italic", fontSize: 11, color: T.grey },
    // Row 2: Stage tabs + nav arrows
    headerRow2: { padding: "0 40px", display: "flex", alignItems: "center", gap: 0, borderBottom: `1px solid ${T.border}` },
    stageTab: (active) => ({
      fontFamily: F, fontWeight: 600, fontSize: 13, padding: "12px 18px",
      background: "transparent",
      color: active ? T.teal : T.grey,
      border: "none",
      borderBottom: active ? `3px solid ${T.teal}` : "3px solid transparent",
      cursor: "pointer", transition: "all 0.2s",
    }),
    navArrowWrap: { display: "flex", alignItems: "center", gap: 8 },
    // Row 3: Breadcrumb
    ctxBar: { background: T.white, borderBottom: `1px solid ${T.border}`, padding: "6px 40px", display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: T.grey },
    ctxBold: { color: T.teal, fontWeight: 700 },
    ctxTag: { background: T.greenL, color: T.green, border: `1px solid ${T.green}40`, borderRadius: 3, padding: "1px 6px", fontWeight: 700, fontSize: 9 },
    ctxTagR: { background: T.redL, color: T.red, border: `1px solid ${T.red}40`, borderRadius: 3, padding: "1px 6px", fontWeight: 700, fontSize: 9 },
    // Page title
    pageHeader: { padding: "20px 40px 0", display: "flex", alignItems: "center", gap: 12 },
    phPill: { background: T.teal, color: T.white, fontWeight: 700, fontSize: 12, padding: "4px 12px", borderRadius: 4, letterSpacing: ".08em" },
    phTitle: { fontWeight: 700, fontSize: 20, color: T.navy, letterSpacing: ".01em" },
    // TICKER
    ticker: { background: T.white, borderBottom: `1px solid ${T.border}`, padding: "8px 40px", display: "flex", gap: 0, overflowX: "auto" },
    tick: { display: "flex", alignItems: "center", gap: 8, padding: "0 20px", borderRight: `1px solid ${T.border}`, whiteSpace: "nowrap" },
    tickLbl: { fontSize: 10, fontWeight: 700, color: T.grey, textTransform: "uppercase", letterSpacing: ".06em" },
    tickVal: (c) => ({ fontFamily: F, fontSize: 14, fontWeight: 700, color: c }),
    // LINE TABS
    tabBar: { background: T.white, borderBottom: `1px solid ${T.border}`, padding: "0 40px", display: "flex", gap: 0 },
    tab: (active) => ({ fontFamily: F, fontSize: 12, fontWeight: 700, color: active ? T.teal : T.grey, borderBottom: `2px solid ${active ? T.teal : "transparent"}`, padding: "10px 20px", cursor: "pointer", transition: "all .15s", textTransform: "uppercase", letterSpacing: ".04em", background: "transparent", border: "none", borderBottomWidth: 2, borderBottomStyle: "solid", borderBottomColor: active ? T.teal : "transparent" }),
    // SECTIONS
    section: { padding: "24px 40px" },
    sectionTitle: { fontFamily: F, fontSize: 14, fontWeight: 700, color: T.navy, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 14, paddingBottom: 8, borderBottom: `2px solid ${T.teal}` },
    // LINE SUMMARY
    lineSummary: { background: T.white, border: `1px solid ${T.border}`, borderRadius: 8, padding: "16px 20px", marginBottom: 18, display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 20, boxShadow: "0 1px 3px rgba(0,0,0,.04)" },
    lsItem: { display: "flex", flexDirection: "column", gap: 4 },
    lsLbl: { fontFamily: F, fontSize: 10, fontWeight: 700, color: T.grey, textTransform: "uppercase", letterSpacing: ".05em" },
    lsVal: { fontFamily: F, fontSize: 14, fontWeight: 700, color: T.navy },
    // NODE CARDS
    nodeCard: (expanded) => ({
      background: T.white,
      border: `1px solid ${expanded ? T.teal : T.border}`,
      borderLeft: expanded ? `4px solid ${T.teal}` : `4px solid ${T.border}`,
      borderRadius: 6, padding: "14px 18px", marginBottom: 8, cursor: "pointer",
      transition: "all .15s", boxShadow: expanded ? "0 2px 8px rgba(0,137,123,.1)" : "0 1px 3px rgba(0,0,0,.04)",
    }),
    nodeHeader: { display: "flex", alignItems: "center", gap: 12 },
    nodeBadge: { display: "flex", alignItems: "center", justifyContent: "center", width: 30, height: 30, borderRadius: 6, background: T.teal, color: T.white, fontFamily: F, fontSize: 11, fontWeight: 700, flexShrink: 0 },
    nodeTag: { fontFamily: F, fontSize: 12, fontWeight: 700, color: T.amber, minWidth: 80 },
    nodeName: { flex: 1, fontFamily: F, fontSize: 13, fontWeight: 600, color: T.navy },
    nodeDetail: { display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 12, fontSize: 11, marginTop: 10, background: T.nodeBg, padding: 12, borderRadius: 6 },
    ndItem: { display: "flex", flexDirection: "column", gap: 2 },
    ndLbl: { color: T.grey, fontWeight: 600, fontSize: 10 },
    ndVal: { fontFamily: F, fontSize: 12, fontWeight: 700, color: T.teal },
    nodeMeta: { display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginTop: 10, marginBottom: 8 },
    gateBadge: (warn) => ({ fontFamily: F, fontSize: 10, fontWeight: 700, padding: "4px 12px", borderRadius: 4, border: `1px solid ${warn ? T.red : T.amber}`, color: warn ? T.red : T.amber, background: warn ? T.redL : T.amberL }),
    capexBadge: (cost) => ({ fontFamily: F, fontSize: 11, fontWeight: 700, padding: "4px 14px", borderRadius: 4, color: cost === 0 ? T.grey : T.teal, background: cost === 0 ? "#F0F2F5" : T.tealL }),
    supplier: { fontFamily: F, fontSize: 10, color: T.grey },
    nodeDesc: { fontFamily: F, fontSize: 12, color: T.textL, lineHeight: 1.6, paddingTop: 10, borderTop: `1px solid ${T.border}` },
    // CAPEX
    capexGrid: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 20 },
    capexCard: { background: T.white, border: `1px solid ${T.border}`, borderRadius: 8, padding: "18px", display: "flex", flexDirection: "column", gap: 12, boxShadow: "0 1px 3px rgba(0,0,0,.04)" },
    ccTitle: { fontFamily: F, fontSize: 12, fontWeight: 700, color: T.teal, textTransform: "uppercase", letterSpacing: ".05em" },
    ccItems: { display: "flex", flexDirection: "column", gap: 6 },
    ccItem: { display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 6, borderBottom: `1px solid ${T.border}` },
    ccItemName: { fontFamily: F, fontSize: 11, color: T.text },
    ccItemCost: { fontFamily: F, fontSize: 12, fontWeight: 700, color: T.amber },
    ccTotal: { display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 12, borderTop: `2px solid ${T.teal}` },
    ccTotalLbl: { fontFamily: F, fontSize: 12, fontWeight: 700, color: T.teal },
    ccTotalVal: { fontFamily: F, fontSize: 13, fontWeight: 700, color: T.teal },
    // OPEX
    opexGrid: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 },
    opexCard: { background: T.white, border: `1px solid ${T.border}`, borderRadius: 8, padding: "18px", boxShadow: "0 1px 3px rgba(0,0,0,.04)" },
    ocTitle: { fontFamily: F, fontSize: 12, fontWeight: 700, color: T.teal, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 14 },
    ocRow: { display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 8, borderBottom: `1px solid ${T.border}`, marginBottom: 8 },
    ocLbl: { fontFamily: F, fontSize: 11, color: T.text },
    ocVal: { fontFamily: F, fontSize: 12, fontWeight: 700, color: T.amber },
    ocTotal: { display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 10, fontWeight: 700, color: T.teal },
    // GREENHOUSE
    ghGrid: { display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16 },
    ghCard: { background: T.white, border: `1px solid ${T.border}`, borderRadius: 8, padding: "18px", boxShadow: "0 1px 3px rgba(0,0,0,.04)" },
    ghName: { fontFamily: F, fontSize: 13, fontWeight: 700, color: T.teal, marginBottom: 10 },
    ghRow: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", paddingBottom: 6, marginBottom: 6, borderBottom: `1px solid ${T.border}` },
    ghLbl: { fontFamily: F, fontSize: 10, color: T.grey, textTransform: "uppercase", fontWeight: 600 },
    ghVal: { fontFamily: F, fontSize: 11, color: T.text, textAlign: "right" },
    datGap: { fontFamily: F, fontSize: 11, fontWeight: 700, color: T.amber, background: T.amberL, padding: "8px 12px", borderRadius: 4, marginTop: 8 },
    // GUARDRAILS
    grailGrid: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 },
    grailCard: (color) => ({ background: T.white, border: `1px solid ${color}40`, borderLeft: `4px solid ${color}`, borderRadius: 6, padding: "14px", display: "flex", flexDirection: "column", gap: 8, boxShadow: "0 1px 3px rgba(0,0,0,.04)" }),
    grailBadge: (color) => {
      const bgMap = { [T.red]: T.redL, [T.amber]: T.amberL, [T.teal]: T.tealL };
      return { fontFamily: F, fontSize: 10, fontWeight: 700, padding: "4px 10px", borderRadius: 4, color: color, border: `1px solid ${color}`, background: bgMap[color] || "#F0F2F5", textTransform: "uppercase", width: "fit-content" };
    },
    grailName: { fontFamily: F, fontSize: 12, fontWeight: 700, color: T.navy },
    grailNodes: { fontFamily: F, fontSize: 10, color: T.grey },
    grailDesc: { fontFamily: F, fontSize: 10, color: T.textL, lineHeight: 1.5 },
    // RESULTS BAR
    resultsBar: { position: "sticky", bottom: 0, zIndex: 90, background: T.white, borderTop: `2px solid ${T.teal}`, padding: "12px 40px", display: "flex", alignItems: "center", gap: 20, boxShadow: "0 -4px 16px rgba(0,0,0,.06)" },
    rbItem: { display: "flex", flexDirection: "column", gap: 2 },
    rbLbl: { fontSize: 10, fontWeight: 700, color: T.grey, textTransform: "uppercase", letterSpacing: ".05em" },
    rbVal: (c) => ({ fontFamily: F, fontSize: 15, fontWeight: 700, color: c }),
    rbDivider: { width: 1, height: 32, background: T.border },
  };

  return (
    <div style={s.page}>
      {/* ââ CFI HEADER ââ */}
      <div style={s.headerWrap}>
        {/* Row 1: Brand */}
        <div style={s.headerRow1}>
          <div style={s.brandName}>CFI <span style={s.brandSuffix}>Deep Tech</span></div>
          <div style={s.dividerLine} />
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <span style={s.tagline}>Circular Fertiliser Industries</span>
            <span style={s.tagline}>60 TPH FFB Mill \u00b7 Bogor, West Java</span>
          </div>
          <div style={{ flex: 1 }} />
          <button
            onClick={() => window.open('/s1-engineering-print?print', '_blank')}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 16px', background: T.tealL, border: `1px solid ${T.teal}`, borderRadius: 5, color: T.teal, fontFamily: F, fontSize: 12, fontWeight: 700, cursor: 'pointer', letterSpacing: '.02em' }}
          >
            &#128196; Complete Engineering — PDF
          </button>
          <span style={{ fontFamily: F, fontSize: 11, color: T.grey }}>S1 Rev 01 \u00b7 March 2026</span>
        </div>

        {/* Row 2: Stage Tabs + Nav Arrows */}
        <div style={s.headerRow2}>
          {/* Left arrow */}
          <a href={prevPage ? prevPage.route : "#"} style={navArrow(!prevPage)} onClick={(e) => !prevPage && e.preventDefault()}>
            <span style={{ fontSize: 16, lineHeight: 1 }}>\u25c0</span>
            <span>{prevPage ? prevPage.label : ""}</span>
          </a>

          <div style={{ flex: 1, display: "flex", gap: 0, justifyContent: "center" }}>
            {STAGE_PAGES.map((stage) => (
              <a key={stage.key} href={stage.route} style={{ ...s.stageTab(stage.key === "S1"), textDecoration: "none" }}>
                {stage.key}
              </a>
            ))}
          </div>

          {/* Right arrow */}
          <a href={nextPage ? nextPage.route : "#"} style={navArrow(!nextPage)} onClick={(e) => !nextPage && e.preventDefault()}>
            <span>{nextPage ? nextPage.label : ""}</span>
            <span style={{ fontSize: 16, lineHeight: 1 }}>\u25b6</span>
          </a>
        </div>
      </div>

      {/* ââ BREADCRUMB BAR ââ */}
      <div style={s.ctxBar}>
        <span style={s.ctxBold}>CFI Platform</span>
        <span style={{ color: T.greyL }}>\u203a</span>
        <span>S0 Mill Config</span>
        <span style={{ color: T.greyL }}>\u203a</span>
        <span style={s.ctxBold}>S1 Pre-Processing</span>
        <span style={{ color: T.greyL }}>|</span>
        <span>Mill: <span style={s.ctxBold}>Bogor Test Mill</span></span>
        <span style={{ color: T.greyL }}>\u00b7</span>
        <span>FFB: <span style={s.ctxBold}>60 TPH</span></span>
        <span style={{ color: T.greyL }}>\u00b7</span>
        <span>Active:</span>
        <span style={s.ctxTag}>EFB</span>
        <span style={s.ctxTag}>OPDC</span>
        <span style={s.ctxTagR}>POS \u2014 ICP-OES Pending</span>
      </div>

      {/* ââ PAGE TITLE ââ */}
      <div style={s.pageHeader}>
        <span style={s.phPill}>S1</span>
        <span style={s.phTitle}>Pre-Processing Hub \u2014 Engineering Complete</span>
      </div>

      {/* ââ TICKER BAR ââ */}
      <div style={s.ticker}>
        <div style={s.tick}>
          <span style={s.tickLbl}>Total Lines</span>
          <span style={s.tickVal(T.teal)}>3</span>
        </div>
        <div style={s.tick}>
          <span style={s.tickLbl}>Total Power</span>
          <span style={s.tickVal(T.teal)}>566 kW</span>
        </div>
        <div style={s.tick}>
          <span style={s.tickLbl}>Equipment CAPEX</span>
          <span style={s.tickVal(T.amber)}>$398K</span>
        </div>
        <div style={s.tick}>
          <span style={s.tickLbl}>Monthly OpEx</span>
          <span style={s.tickVal(T.amber)}>$37,957/mo</span>
        </div>
        <div style={s.tick}>
          <span style={s.tickLbl}>Building CAPEX</span>
          <span style={s.tickVal(T.amber)}>$1.37M</span>
        </div>
        <div style={{ ...s.tick, borderRight: "none" }}>
          <span style={s.tickLbl}>Electricity</span>
          <span style={s.tickVal(T.green)}>$22,648/mo</span>
        </div>
      </div>

      {/* ââ LINE SELECTOR TABS ââ */}
      <div style={s.tabBar}>
        {Object.entries(lines).map(([key, line]) => (
          <button key={key} style={s.tab(activeTab === key)} onClick={() => setActiveTab(key)}>
            {key} \u2014 {line.nodes.length} nodes \u00b7 {line.totalKw} kW
          </button>
        ))}
      </div>

      {/* ââ ACTIVE LINE SECTION ââ */}
      <div style={s.section}>
        <div style={s.sectionTitle}>{activeLine.name}</div>
        <div style={s.lineSummary}>
          <div style={s.lsItem}>
            <span style={s.lsLbl}>Throughput</span>
            <span style={s.lsVal}>{activeLine.throughput}</span>
          </div>
          <div style={s.lsItem}>
            <span style={s.lsLbl}>Belt Width</span>
            <span style={s.lsVal}>{activeLine.belt}</span>
          </div>
          <div style={s.lsItem}>
            <span style={s.lsLbl}>Building</span>
            <span style={s.lsVal}>{activeLine.building}</span>
          </div>
          <div style={s.lsItem}>
            <span style={s.lsLbl}>Total Power</span>
            <span style={s.lsVal}>{activeLine.totalKw} kW</span>
          </div>
        </div>

        {/* ââ NODE CARDS ââ */}
        {activeLine.nodes.map((node) => {
          const isExpanded = expandedNode === node.id;
          return (
            <div key={node.id} style={s.nodeCard(isExpanded)} onClick={() => setExpandedNode(isExpanded ? null : node.id)}>
              <div style={s.nodeHeader}>
                <div style={s.nodeBadge}>{activeLine.nodes.indexOf(node) + 1}</div>
                <div style={s.nodeTag}>{node.tag}</div>
                <div style={s.nodeName}>{node.name}</div>
                <span style={{ fontFamily: F, fontSize: 11, color: T.grey }}>{isExpanded ? "\u25b2" : "\u25bc"}</span>
              </div>

              {!isExpanded && (
                <div style={s.nodeDetail}>
                  <div style={s.ndItem}>
                    <span style={s.ndLbl}>t/h</span>
                    <span style={s.ndVal}>{node.th}</span>
                  </div>
                  <div style={s.ndItem}>
                    <span style={s.ndLbl}>MC In</span>
                    <span style={s.ndVal}>{node.mcIn}</span>
                  </div>
                  <div style={s.ndItem}>
                    <span style={s.ndLbl}>MC Out</span>
                    <span style={s.ndVal}>{node.mcOut}</span>
                  </div>
                  <div style={s.ndItem}>
                    <span style={s.ndLbl}>Elevation</span>
                    <span style={s.ndVal}>{node.elev}</span>
                  </div>
                  <div style={s.ndItem}>
                    <span style={s.ndLbl}>Power</span>
                    <span style={s.ndVal}>{node.kw} kW</span>
                  </div>
                  <div style={s.ndItem}>
                    <span style={s.ndLbl}>CAPEX</span>
                    <span style={s.ndVal}>{node.capex === 0 ? "RFQ" : `$${(node.capex / 1000).toFixed(0)}K`}</span>
                  </div>
                </div>
              )}

              {isExpanded && (
                <div style={{ paddingTop: 10 }}>
                  <div style={s.nodeMeta}>
                    {node.gate && <div style={s.gateBadge(false)}>{node.gate}</div>}
                    {node.warn && <div style={s.gateBadge(true)}>{node.warn.split(":")[0]}</div>}
                    <div style={s.capexBadge(node.capex)}>
                      {node.capex === 0 ? "RFQ pending" : `$${(node.capex / 1000).toFixed(0)}K`}
                    </div>
                    {node.supplier && <div style={s.supplier}>{node.supplier}</div>}
                  </div>
                  <div style={s.nodeDesc}>{node.desc}</div>
                </div>
              )}
            </div>
          );
        })}

        {/* ââ LINE TOTALS ââ */}
        <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 8, padding: "14px 18px", marginTop: 14, display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20, boxShadow: "0 1px 3px rgba(0,0,0,.04)" }}>
          <div>
            <div style={{ fontFamily: F, fontSize: 10, color: T.grey, textTransform: "uppercase", fontWeight: 700 }}>Total Power</div>
            <div style={{ fontFamily: F, fontSize: 16, fontWeight: 700, color: T.teal, marginTop: 4 }}>{activeLine.totalKw} kW</div>
          </div>
          <div>
            <div style={{ fontFamily: F, fontSize: 10, color: T.grey, textTransform: "uppercase", fontWeight: 700 }}>Equipment CAPEX</div>
            <div style={{ fontFamily: F, fontSize: 16, fontWeight: 700, color: T.amber, marginTop: 4 }}>${(activeLine.totalCapex / 1000).toFixed(0)}K</div>
          </div>
          <div>
            <div style={{ fontFamily: F, fontSize: 10, color: T.grey, textTransform: "uppercase", fontWeight: 700 }}>Monthly Electricity</div>
            <div style={{ fontFamily: F, fontSize: 16, fontWeight: 700, color: T.green, marginTop: 4 }}>{activeLine.monthlyElec}</div>
          </div>
          <div>
            <div style={{ fontFamily: F, fontSize: 10, color: T.grey, textTransform: "uppercase", fontWeight: 700 }}>Throughput</div>
            <div style={{ fontFamily: F, fontSize: 16, fontWeight: 700, color: T.navy, marginTop: 4 }}>{activeLine.throughput}</div>
          </div>
        </div>
      </div>

      {/* ââ CAPEX BREAKDOWN ââ */}
      <div style={s.section}>
        <div style={s.sectionTitle}>Equipment CAPEX Breakdown</div>
        <div style={s.capexGrid}>
          {/* S1C EFB */}
          <div style={s.capexCard}>
            <div style={s.ccTitle}>S1C EFB Line</div>
            <div style={s.ccItems}>
              {CAPEX_ITEMS.filter(c => c.line === "S1C EFB").map((item, i) => (
                <div key={i} style={s.ccItem}>
                  <span style={s.ccItemName}>{item.item}</span>
                  <span style={s.ccItemCost}>${(item.cost / 1000).toFixed(0)}K</span>
                </div>
              ))}
            </div>
            <div style={s.ccTotal}>
              <span style={s.ccTotalLbl}>Total</span>
              <span style={s.ccTotalVal}>$184K</span>
            </div>
          </div>

          {/* S1B OPDC */}
          <div style={s.capexCard}>
            <div style={s.ccTitle}>S1B OPDC Line</div>
            <div style={s.ccItems}>
              {CAPEX_ITEMS.filter(c => c.line === "S1B OPDC").map((item, i) => (
                <div key={i} style={s.ccItem}>
                  <span style={s.ccItemName}>{item.item}</span>
                  <span style={s.ccItemCost}>${(item.cost / 1000).toFixed(0)}K</span>
                </div>
              ))}
            </div>
            <div style={s.ccTotal}>
              <span style={s.ccTotalLbl}>Total</span>
              <span style={s.ccTotalVal}>$38K</span>
            </div>
          </div>

          {/* Shared */}
          <div style={s.capexCard}>
            <div style={s.ccTitle}>Shared Equipment</div>
            <div style={s.ccItems}>
              {CAPEX_ITEMS.filter(c => c.line === "Shared").map((item, i) => (
                <div key={i} style={s.ccItem}>
                  <span style={s.ccItemName}>{item.item}</span>
                  <span style={s.ccItemCost}>{item.cost === 0 ? "Shared" : `$${(item.cost / 1000).toFixed(0)}K`}</span>
                </div>
              ))}
            </div>
            <div style={s.ccTotal}>
              <span style={s.ccTotalLbl}>Total</span>
              <span style={s.ccTotalVal}>$176K</span>
            </div>
          </div>
        </div>
        <div style={s.lineSummary}>
          <div style={s.lsItem}>
            <span style={s.lsLbl}>Combined Equipment CAPEX</span>
            <span style={{ ...s.lsVal, color: T.amber }}>$398,000</span>
          </div>
          <div style={s.lsItem}>
            <span style={s.lsLbl}>POS Decanter RFQ</span>
            <span style={{ ...s.lsVal, color: T.amber }}>$80K\u2013$150K pending</span>
          </div>
          <div style={s.lsItem}>
            <span style={s.lsLbl}>Building CAPEX</span>
            <span style={{ ...s.lsVal, color: T.amber }}>$1,374,610</span>
          </div>
          <div style={s.lsItem}>
            <span style={s.lsLbl}>Total S1 CAPEX</span>
            <span style={{ ...s.lsVal, color: T.teal }}>~$1.77M\u2013$1.85M</span>
          </div>
        </div>
      </div>

      {/* ââ OPEX SECTION ââ */}
      <div style={s.section}>
        <div style={s.sectionTitle}>Monthly Operating Expenditure</div>
        <div style={s.opexGrid}>
          {/* Labour */}
          <div style={s.opexCard}>
            <div style={s.ocTitle}>Labour</div>
            <div style={s.ocRow}>
              <span style={s.ocLbl}>7 headcount</span>
              <span style={s.ocVal}>\u2014</span>
            </div>
            <div style={s.ocRow}>
              <span style={s.ocLbl}>Monthly wage pool</span>
              <span style={s.ocVal}>$3,576</span>
            </div>
            <div style={s.ocTotal}>
              <span>Total</span>
              <span style={{ color: T.amber }}>$3,576/mo</span>
            </div>
          </div>

          {/* Electricity */}
          <div style={s.opexCard}>
            <div style={s.ocTitle}>Electricity</div>
            <div style={s.ocRow}>
              <span style={s.ocLbl}>S1C EFB</span>
              <span style={s.ocVal}>$14,191</span>
            </div>
            <div style={s.ocRow}>
              <span style={s.ocLbl}>S1B OPDC</span>
              <span style={s.ocVal}>$6,651</span>
            </div>
            <div style={s.ocRow}>
              <span style={s.ocLbl}>S1A POS</span>
              <span style={s.ocVal}>$1,806</span>
            </div>
            <div style={s.ocTotal}>
              <span>Total</span>
              <span style={{ color: T.green }}>$22,648/mo</span>
            </div>
          </div>

          {/* Maintenance & Other */}
          <div style={s.opexCard}>
            <div style={s.ocTitle}>Maintenance & Other</div>
            <div style={s.ocRow}>
              <span style={s.ocLbl}>Equipment maintenance</span>
              <span style={s.ocVal}>\u2014</span>
            </div>
            <div style={s.ocRow}>
              <span style={s.ocLbl}>Repairs & parts</span>
              <span style={s.ocVal}>\u2014</span>
            </div>
            <div style={s.ocRow}>
              <span style={s.ocLbl}>Contingency</span>
              <span style={s.ocVal}>\u2014</span>
            </div>
            <div style={s.ocTotal}>
              <span>Total</span>
              <span style={{ color: T.amber }}>$11,733/mo</span>
            </div>
          </div>
        </div>
        <div style={{ ...s.lineSummary, marginTop: 16 }}>
          <div style={s.lsItem}>
            <span style={s.lsLbl}>Labour</span>
            <span style={{ ...s.lsVal, color: T.amber }}>$3,576/mo</span>
          </div>
          <div style={s.lsItem}>
            <span style={s.lsLbl}>Electricity</span>
            <span style={{ ...s.lsVal, color: T.green }}>$22,648/mo</span>
          </div>
          <div style={s.lsItem}>
            <span style={s.lsLbl}>Maint. & Other</span>
            <span style={{ ...s.lsVal, color: T.amber }}>$11,733/mo</span>
          </div>
          <div style={s.lsItem}>
            <span style={s.lsLbl}>Total Monthly OpEx</span>
            <span style={{ ...s.lsVal, color: T.amber }}>$37,957/mo</span>
          </div>
        </div>
      </div>

      {/* ââ SITE METRICS SECTION ââ */}
      <div style={s.section}>
        <div style={s.sectionTitle}>Site & Facility Metrics</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 16 }}>
          {SITE_METRICS.map((m, i) => (
            <div key={i} style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 6, padding: "12px 14px", boxShadow: "0 1px 3px rgba(0,0,0,.04)" }}>
              <div style={{ fontFamily: F, fontSize: 10, fontWeight: 700, color: T.grey, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 4 }}>{m.label}</div>
              <div style={{ fontFamily: F, fontSize: 18, fontWeight: 700, color: T.amber, lineHeight: 1 }}>{m.val}</div>
              <div style={{ fontFamily: F, fontSize: 10, color: T.grey, marginTop: 4 }}>{m.note}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ââ BUILDING CAPEX A1-A8 SECTION ââ */}
      <div style={s.section}>
        <div style={s.sectionTitle}>Building CAPEX \u2014 A1 to A8</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14, padding: "14px 18px", background: T.greenL, borderRadius: 8, border: `1px solid ${T.green}30` }}>
          <div>
            <div style={{ fontFamily: F, fontSize: 10, color: T.grey, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 4 }}>Total S1 CAPEX To CFI</div>
            <div style={{ fontFamily: F, fontSize: 28, fontWeight: 700, color: T.green, lineHeight: 1 }}>$1,607,610</div>
            <div style={{ fontFamily: F, fontSize: 10, color: T.grey, marginTop: 4 }}>+ POS RFQ $80-150K outstanding</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: F, fontSize: 10, color: T.grey }}>Western equiv.</div>
            <div style={{ fontFamily: F, fontSize: 14, color: T.grey, textDecoration: "line-through" }}>$2,285,586</div>
            <div style={{ fontFamily: F, fontSize: 10, color: T.green, marginTop: 2 }}>Save ~$678K using Indo rates</div>
          </div>
        </div>
        <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 8, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,.04)" }}>
          {BUILDING_CAPEX.map((item, idx) => (
            <div key={item.ref} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "10px 18px", borderBottom: `1px solid ${T.border}`, background: T.white }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontFamily: F, fontSize: 10, fontWeight: 700, color: T.teal, background: T.tealL, padding: "3px 10px", borderRadius: 4 }}>{item.ref}</span>
                <span style={{ fontFamily: F, fontSize: 12, color: T.text }}>{item.name}</span>
              </div>
              <span style={{ fontFamily: F, fontSize: 13, fontWeight: 700, color: T.amber }}>${item.cost.toLocaleString()}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "10px 18px", borderBottom: `1px solid ${T.border}`, background: T.white }}>
            <span style={{ fontFamily: F, fontSize: 12, fontWeight: 700, color: T.navy }}>Base Total (A1-A8)</span>
            <span style={{ fontFamily: F, fontSize: 13, fontWeight: 700, color: T.amber }}>$883,880</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "10px 18px", borderBottom: `1px solid ${T.border}` }}>
            <span style={{ fontFamily: F, fontSize: 12, color: T.textL }}>+ 8% Contingency</span>
            <span style={{ fontFamily: F, fontSize: 13, fontWeight: 700, color: T.amber }}>$70,710</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "10px 18px", borderBottom: `1px solid ${T.border}` }}>
            <span style={{ fontFamily: F, fontSize: 12, color: T.textL }}>+ 20% EPC Overheads & Margin</span>
            <span style={{ fontFamily: F, fontSize: 13, fontWeight: 700, color: T.amber }}>$190,918</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "10px 18px", borderBottom: `1px solid ${T.border}` }}>
            <span style={{ fontFamily: F, fontSize: 12, color: T.textL }}>+ 20% Developer Markup</span>
            <span style={{ fontFamily: F, fontSize: 13, fontWeight: 700, color: T.amber }}>$229,102</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "12px 18px", borderTop: `2px solid ${T.teal}`, background: T.tealL }}>
            <span style={{ fontFamily: F, fontSize: 13, fontWeight: 700, color: T.teal }}>Building CAPEX Subtotal</span>
            <span style={{ fontFamily: F, fontSize: 16, fontWeight: 700, color: T.green }}>$1,374,610</span>
          </div>
        </div>
      </div>

      {/* ââ GREENHOUSE SECTION ââ */}
      <div style={s.section}>
        <div style={s.sectionTitle}>Greenhouse & Ancillary Structures</div>
        <div style={{ marginBottom: 14, fontFamily: F, fontSize: 12, color: T.textL }}>
          Site layout: 98m \u00d7 85m. Greenhouse block: 1,920 m\u00b2 (4 \u00d7 40\u00d78m). 2 rows \u00d7 2 columns with 6m central access road. East entrance.
        </div>
        <div style={s.ghGrid}>
          {GREENHOUSES.map((gh) => (
            <div key={gh.id} style={s.ghCard}>
              <div style={s.ghName}>{gh.name}</div>
              <div style={s.ghRow}>
                <span style={s.ghLbl}>Dimensions</span>
                <span style={s.ghVal}>{gh.dims}</span>
              </div>
              <div style={s.ghRow}>
                <span style={s.ghLbl}>Floor Area</span>
                <span style={s.ghVal}>{gh.area}</span>
              </div>
              <div style={s.ghRow}>
                <span style={s.ghLbl}>Type</span>
                <span style={s.ghVal}>{gh.type}</span>
              </div>
              <div style={s.ghRow}>
                <span style={s.ghLbl}>Materials</span>
                <span style={{ ...s.ghVal, fontSize: 10 }}>{gh.matl}</span>
              </div>
              <div style={s.datGap}>{gh.cost}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ââ DATA GAPS SECTION ââ */}
      <div style={{ ...s.section, background: T.white, border: `1px solid ${T.red}25`, borderRadius: 0 }}>
        <div style={{ ...s.sectionTitle, color: T.red, borderBottomColor: T.red }}>Data Gaps \u2014 Items Not Yet In OPEX / CAPEX</div>
        <div style={{ fontFamily: F, fontSize: 10, fontWeight: 700, color: T.red, background: `${T.red}15`, padding: "4px 10px", borderRadius: 4, display: "inline-block", marginBottom: 12 }}>10 items</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "8px 20px" }}>
          {DATA_GAPS.map((gap, i) => (
            <div key={i} style={{ fontFamily: F, fontSize: 11, color: T.text, display: "flex", alignItems: "baseline", gap: 8 }}>
              <span style={{ color: T.red, flexShrink: 0, fontWeight: 700 }}>\u2014</span>
              {gap}
            </div>
          ))}
        </div>
      </div>

      {/* ââ GUARDRAILS SECTION ââ */}
      <div style={s.section}>
        <div style={s.sectionTitle}>Hard Guardrails</div>
        <div style={s.grailGrid}>
          {GUARDRAILS.map((gr) => (
            <div key={gr.id} style={s.grailCard(gr.color)}>
              <div style={s.grailBadge(gr.color)}>{gr.severity}</div>
              <div style={s.grailName}>{gr.name}</div>
              <div style={s.grailNodes}>{gr.nodes.join(" \u00b7 ")}</div>
              <div style={s.grailDesc}>{gr.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ââ SPACER ââ */}
      <div style={{ height: 80 }} />

      {/* ââ RESULTS BAR ââ */}
      <div style={s.resultsBar}>
        <div style={s.rbItem}>
          <div style={s.rbLbl}>Active Line</div>
          <div style={s.rbVal(T.teal)}>{activeTab}</div>
        </div>
        <div style={s.rbDivider} />
        <div style={s.rbItem}>
          <div style={s.rbLbl}>Total Power</div>
          <div style={s.rbVal(T.teal)}>{activeLine.totalKw} kW</div>
        </div>
        <div style={s.rbDivider} />
        <div style={s.rbItem}>
          <div style={s.rbLbl}>Equipment CAPEX</div>
          <div style={s.rbVal(T.amber)}>${(activeLine.totalCapex / 1000).toFixed(0)}K</div>
        </div>
        <div style={s.rbDivider} />
        <div style={s.rbItem}>
          <div style={s.rbLbl}>Monthly OpEx</div>
          <div style={s.rbVal(T.amber)}>$37,957/mo</div>
        </div>
        <div style={s.rbDivider} />
        <div style={s.rbItem}>
          <div style={s.rbLbl}>Throughput</div>
          <div style={s.rbVal(T.green)}>{activeLine.throughput}</div>
        </div>
      </div>
    </div>
  );
}
