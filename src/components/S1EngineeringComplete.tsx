import { useState, useCallback, useMemo } from "react";

/*
 * ═══════════════════════════════════════════════════════════════
 * CFI Deep Tech — S1 Mechanical Processing · Engineering Complete
 * ═══════════════════════════════════════════════════════════════
 */

const T = {
  navy: "#060C14", navyM: "#0B1827", navyL: "#0D1E30", navyLL: "#112236",
  border: "#1E4060", borderT: "rgba(64,215,197,.25)", teal: "#40D7C5",
  teal2: "rgba(64,215,197,.12)", amber: "#F5A623", green: "#3DCB7A",
  red: "#E84040", blue: "#60A5FA", violet: "#A78BFA", grey: "#8BA0B4",
  greyL: "#C4D3E0", white: "#EAF3F8",
};

const F = "'DM Sans', sans-serif";

const S1C_NODES = [
  { id: "c1", tag: "AF-01", name: "Hydraulic Feeder", th: 20, mcIn: "62.5%", mcOut: "62.5%", elev: "0m", kw: 18, capex: 15000, supplier: "PT Jayatech Palmindo", gate: "", warn: "", desc: "20 t/h input feeder for EFB. Standard reciprocating action, no pre-processing." },
  { id: "c2", tag: "BC-01/02", name: "Incline Conveyor 600mm", th: 20, mcIn: "62.5%", mcOut: "62.5%", elev: "2m", kw: 22, capex: 18000, supplier: "PT Sinar Surya Lestari", gate: "", warn: "", desc: "600mm belt conveyor. 20 t/h throughput, 62.5% MC. Incline lift to 2m elevation." },
  { id: "c3", tag: "TR-2060", name: "Trommel Screen 50mm", th: 19, mcIn: "62.5%", mcOut: "62.5%", elev: "6m", kw: 11, capex: 8000, supplier: "PT Hans Jaya Utama", gate: "", warn: "", desc: "50mm opening. Removes oversized fibre bundles. 19 t/h output to next stage." },
  { id: "c4", tag: "OBM-01", name: "Overband Magnet", th: 19, mcIn: "62.5%", mcOut: "62.5%", elev: "6m", kw: 3, capex: 0, supplier: "", gate: "", warn: "", desc: "Ferrous metal detection. No cost data available. Critical for mill safety." },
  { id: "c5", tag: "PR-01", name: "Screw Press + PKSA", th: 14, mcIn: "62.5%", mcOut: "47.5%", elev: "6m", kw: 30, capex: 0, supplier: "", gate: "Gate B.G2", warn: "GUARD: MC ≥ 40% LOCKED (CLASS A)", desc: "Moisture reduction from 62.5% to 47.5% MC. CLASS A minimum moisture constraint." },
  { id: "c6", tag: "SD-01", name: "Primary Shredder", th: 14, mcIn: "47.5%", mcOut: "47.5%", elev: "6m", kw: 75, capex: 45000, supplier: "CV Has Engineering", gate: "", warn: "GUARD: Temp < 85°C", desc: "Coarse size reduction. 14 t/h input. 75 kW primary shredding stage." },
  { id: "c7", tag: "HM-01", name: "Hammer Mill", th: 14, mcIn: "47.5%", mcOut: "47.5%", elev: "6m", kw: 110, capex: 35000, supplier: "Cakrawala Mesin Multindo", gate: "SPRING-ISO gate", warn: "GUARD: Temp < 85°C", desc: "Fine shredding to 2mm target. 110 kW. Largest power consumer on EFB line. SPRING-ISO gate required." },
  { id: "c8", tag: "VS-01", name: "Vibrating Screen 2mm", th: 13, mcIn: "47.5%", mcOut: "47.5%", elev: "6m", kw: 11, capex: 12000, supplier: "CV Has Engineering", gate: "Gate B.G1", warn: "", desc: "2mm screening. Separates fines for pneumatic transport. 13 t/h throughput." },
  { id: "c9", tag: "DC-01", name: "Baghouse (Shared)", th: 13, mcIn: "47.5%", mcOut: "47.5%", elev: "6m", kw: 18, capex: 0, supplier: "", gate: "", warn: "", desc: "Dust collection shared with S1B OPDC line. 18 kW total. Maintains air quality." },
  { id: "c10", tag: "BIN-EFB-01", name: "Buffer Bin 50m³", th: 13, mcIn: "47.5%", mcOut: "47.5%", elev: "6m", kw: 0, capex: 25000, supplier: "PT BSB", gate: "", warn: "GUARD: ADL < 12% DM (BSF) · C:N 15–22 optimal · CEC > 20 cmol/kg", desc: "50m³ buffer storage. Final output bin. Ready for S2 mixing stage. 13 t/h nominal." },
];

const S1B_NODES = [
  { id: "b1", tag: "SF-01", name: "Reciprocating Feeder", th: 5, mcIn: "72.5%", mcOut: "72.5%", elev: "0m", kw: 7.5, capex: 10000, supplier: "", gate: "", warn: "", desc: "5 t/h input feeder for Oil Palm Decanter Cake. Reciprocating action for denser material." },
  { id: "b2", tag: "BC-10/11", name: "Incline Conveyor 500mm", th: 5, mcIn: "72.5%", mcOut: "72.5%", elev: "2m", kw: 15, capex: 8000, supplier: "PT Sinar Surya Lestari", gate: "", warn: "", desc: "500mm belt conveyor. 5 t/h throughput. Incline lift to 2m elevation." },
  { id: "b3", tag: "TR-OPDC-01", name: "Trommel Screen 50mm", th: 4.8, mcIn: "72.5%", mcOut: "72.5%", elev: "6m", kw: 9, capex: 5000, supplier: "PT Hans Jaya Utama", gate: "", warn: "", desc: "50mm opening. Oversized OPDC removal. 4.8 t/h to next stage." },
  { id: "b4", tag: "OBM-02", name: "Overband Magnet", th: 4.8, mcIn: "72.5%", mcOut: "72.5%", elev: "6m", kw: 3, capex: 0, supplier: "", gate: "", warn: "", desc: "Ferrous metal detection on OPDC line. No cost data available." },
  { id: "b5", tag: "DC-PRESS-01", name: "Screw Press + PKSA", th: 3.5, mcIn: "72.5%", mcOut: "61%", elev: "6m", kw: 30, capex: 0, supplier: "", gate: "Gate B.G2", warn: "GUARD: MC ≥ 40% MIN CLASS A", desc: "Moisture reduction from 72.5% to 61% MC. CLASS A minimum constraint enforced." },
  { id: "b6", tag: "LB-01", name: "Lump Breaker", th: 3.5, mcIn: "61%", mcOut: "61%", elev: "6m", kw: 37, capex: 0, supplier: "", gate: "", warn: "", desc: "Breaks agglomerated lumps in OPDC. 37 kW. Critical for consistent downstream processing." },
  { id: "b7", tag: "HM-02", name: "Hammer Mill", th: 3.5, mcIn: "61%", mcOut: "61%", elev: "6m", kw: 90, capex: 0, supplier: "Zhengzhou Sinoder", gate: "SPRING-ISO", warn: "GUARD: Temp < 85°C", desc: "Fine shredding to 2mm target. 90 kW. SPRING-ISO gate required." },
  { id: "b8", tag: "VS-02", name: "Vibrating Screen 2mm", th: 3.3, mcIn: "61%", mcOut: "61%", elev: "6m", kw: 9, capex: 0, supplier: "", gate: "Gate B.G1", warn: "", desc: "2mm screening for OPDC. Separates fines for pneumatic transport. 3.3 t/h." },
  { id: "b9", tag: "DC-01", name: "Baghouse (Shared)", th: 3.3, mcIn: "61%", mcOut: "61%", elev: "6m", kw: 0, capex: 0, supplier: "", gate: "", warn: "", desc: "Dust collection shared with S1C EFB line. Integrated into EFB DC-01 baghouse." },
  { id: "b10", tag: "BIN-OPDC-24HR", name: "Buffer Bin 85m³ + Rake", th: 3.3, mcIn: "61%", mcOut: "61%", elev: "6m", kw: 5.5, capex: 15000, supplier: "PT BSB", gate: "Gate C.G2/G3", warn: "GUARD: ADL < 12% DM (BSF) · C:N 15–22 optimal · pH 8.0–9.0", desc: "85m³ buffer storage with rake agitation. 24-hour residence time. pH 8.0–9.0 target." },
];

const S1A_NODES = [
  { id: "a1", tag: "RH-OPDC-101", name: "Sludge Pit 15m³", th: 1.25, mcIn: "82%", mcOut: "82%", elev: "0m", kw: 0, capex: 0, supplier: "", gate: "ICP-OES-Fe gate", warn: "GUARD: Fe < 3,000 mg/kg DM · No Cr > 20 mg/kg", desc: "15m³ sludge pit. 1.25 t/h DM input (~30 t/day FW). ICP-OES iron gate enforcement." },
  { id: "a2", tag: "DRS-SLD-01", name: "Rotary Drum Screen", th: 1.17, mcIn: "82%", mcOut: "78%", elev: "1.5m", kw: 7, capex: 0, supplier: "", gate: "", warn: "", desc: "Removes stones and grit. Moisture reduction from 82% to 78% MC. 1.17 t/h throughput." },
  { id: "a3", tag: "DEC-SLD-101", name: "Decanter Centrifuge", th: 0.56, mcIn: "78%", mcOut: "65%", elev: "3m", kw: 55, capex: 0, supplier: "Alfa Laval preferred", gate: "", warn: "", desc: "Moisture reduction from 78% to 65% MC. 55 kW high-speed centrifugation. RFQ $80K–$150K pending." },
  { id: "a4", tag: "BIN-OPDC-301", name: "Buffer Tank 15m³", th: 0.56, mcIn: "65%", mcOut: "65%", elev: "3m", kw: 0, capex: 0, supplier: "", gate: "", warn: "GUARD: ADL < 12% DM (BSF) · C:N 15–22 optimal · CEC > 20 cmol/kg", desc: "15m³ buffer tank. 0.56 t/h final output. Ready for S2 mixing stage." },
];

const CAPEX_ITEMS = [
  { line: "S1C EFB", item: "AF-01 Hydraulic Feeder", cost: 15000 },
  { line: "S1C EFB", item: "BC-01/02 Incline Conveyor 600mm", cost: 18000 },
  { line: "S1C EFB", item: "TR-2060 Trommel Screen", cost: 8000 },
  { line: "S1C EFB", item: "SD-01 Primary Shredder", cost: 45000 },
  { line: "S1C EFB", item: "HM-01 Hammer Mill", cost: 35000 },
  { line: "S1C EFB", item: "VS-01 Vibrating Screen", cost: 12000 },
  { line: "S1C EFB", item: "BIN-EFB-01 Buffer Bin 50m³", cost: 25000 },
  { line: "S1B OPDC", item: "SF-01 Reciprocating Feeder", cost: 10000 },
  { line: "S1B OPDC", item: "BC-10/11 Incline Conveyor 500mm", cost: 8000 },
  { line: "S1B OPDC", item: "TR-OPDC-01 Trommel Screen", cost: 5000 },
  { line: "S1B OPDC", item: "BIN-OPDC-24HR Buffer Bin 85m³", cost: 15000 },
  { line: "Shared", item: "DC-01 Baghouse (Shared)", cost: 0 },
  { line: "Shared", item: "Limestone Station", cost: 6000 },
  { line: "Shared", item: "2× Wheel Loaders (2 × $85K)", cost: 170000 },
];

const GREENHOUSES = [
  { id: "gh1", name: "GH-1", dims: "40m × 8m × 2.5m", type: "Arched tunnel", matl: "Mild steel 42mm poles, shade net + PE film, brick wall, 300mm foundation", cost: "DATA GAP" },
  { id: "gh2", name: "GH-2", dims: "40m × 8m × 2.5m", type: "Arched tunnel", matl: "Mild steel 42mm poles, shade net + PE film, brick wall, 300mm foundation", cost: "DATA GAP" },
  { id: "gh3", name: "GH-3", dims: "40m × 8m × 2.5m", type: "Arched tunnel", matl: "Mild steel 42mm poles, shade net + PE film, brick wall, 300mm foundation", cost: "DATA GAP" },
  { id: "gh4", name: "GH-4", dims: "40m × 8m × 2.5m", type: "Arched tunnel", matl: "Mild steel 42mm poles, shade net + PE film, brick wall, 300mm foundation", cost: "DATA GAP" },
  { id: "store", name: "Store", dims: "11m × 5m × 3m", type: "Standard", matl: "Brick walls, corrugated iron roof", cost: "DATA GAP" },
  { id: "shade", name: "Shredder Machine Shade", dims: "6m × 9m × 3m", type: "Open frame", matl: "Square hollow section, wire mesh sides", cost: "DATA GAP" },
];

const GUARDRAILS = [
  { id: "g1", name: "MC ≥ 40% LOCKED (CLASS A)", nodes: ["Screw Press nodes"], severity: "CRITICAL", color: T.red, desc: "Minimum moisture content constraint for all CLASS A equipment. Failure causes equipment blockage." },
  { id: "g2", name: "Fe < 3,000 mg/kg DM target", nodes: ["POS Sludge Pit"], severity: "HIGH", color: T.amber, desc: "ICP-OES iron concentration gate. Prevents ferrous contamination in downstream S2." },
  { id: "g3", name: "ADL < 12% DM for BSF", nodes: ["Buffer Bins"], severity: "HIGH", color: T.amber, desc: "Acid-insoluble lignin limit for Black Soldier Fly feed acceptability." },
  { id: "g4", name: "C:N 15–22 optimal", nodes: ["Buffer Bins"], severity: "STANDARD", color: T.amber, desc: "Carbon-to-nitrogen ratio for microbial balance in S2/S3 fermentation." },
  { id: "g5", name: "pH 8.0–9.0 range (OPDC buffer)", nodes: ["BIN-OPDC-24HR"], severity: "STANDARD", color: T.amber, desc: "pH target for oil palm decanter cake buffer bin. Maintains biological activity." },
  { id: "g6", name: "No Cr > 20 mg/kg", nodes: ["Sludge Pit"], severity: "CRITICAL", color: T.red, desc: "Chromium contamination gate. Prevents heavy metal pass-through to S2." },
  { id: "g7", name: "CEC > 20 cmol/kg target", nodes: ["Buffer Bins"], severity: "STANDARD", color: T.amber, desc: "Cation exchange capacity target for soil amendment potential in final product." },
  { id: "g8", name: "Belt speed locked at spec", nodes: ["Conveyor nodes"], severity: "STANDARD", color: T.amber, desc: "All conveyor belt speeds locked to design specification. No operator override." },
  { id: "g9", name: "All temps < 85°C", nodes: ["Hammer Mill, Shredder"], severity: "HIGH", color: T.red, desc: "Temperature gate to prevent decomposition of organic matter. Critical for S2 input quality." },
];

export default function S1EngineeringComplete() {
  const [activeTab, setActiveTab] = useState<string>("S1C");
  const [expandedNode, setExpandedNode] = useState<string | null>(null);

  const lines: Record<string, { nodes: typeof S1C_NODES; name: string; throughput: string; belt: string; building: string; totalKw: number; totalCapex: number; monthlyElec: string }> = {
    "S1C": { nodes: S1C_NODES, name: "Empty Fruit Bunch (EFB)", throughput: "20 t/h input", belt: "600mm", building: "15m × 35m × 10m", totalKw: 298, totalCapex: 184000, monthlyElec: "$14,191" },
    "S1B": { nodes: S1B_NODES, name: "Oil Palm Decanter Cake (OPDC)", throughput: "5 t/h input", belt: "500mm", building: "15m × 35m × 10m (shared)", totalKw: 206, totalCapex: 38000, monthlyElec: "$6,651" },
    "S1A": { nodes: S1A_NODES, name: "Palm Oil Sludge (POS)", throughput: "1.25 t/h DM", belt: "N/A", building: "12m × 18m × 6m", totalKw: 62, totalCapex: 0, monthlyElec: "$1,806" },
  };

  const activeLine = lines[activeTab];

  const s: Record<string, any> = {
    page: { background: T.navy, color: T.greyL, fontFamily: F, fontSize: 13, lineHeight: 1.5, minHeight: "100vh" },
    header: { position: "sticky" as const, top: 0, zIndex: 100, background: "#FFFFFF", borderBottom: "1px solid #E0E0E0", padding: "0 24px", display: "flex", alignItems: "center", height: 56, gap: 16 },
    logo: { display: "flex", alignItems: "center", gap: 10 },
    logoMark: { width: 36, height: 36, borderRadius: 8, background: `linear-gradient(135deg, ${T.teal}, #0B1827)`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: F, fontWeight: 800, fontSize: 16, letterSpacing: "-.02em" },
    logoText: { fontFamily: F, fontSize: 18, fontWeight: 800, color: "#0B1827", letterSpacing: "-.01em" },
    stageNav: { display: "flex", gap: 2, marginLeft: "auto" },
    ticker: { background: "rgba(6,12,20,.95)", borderBottom: `1px solid ${T.border}`, padding: "6px 24px", display: "flex", gap: 0, overflowX: "auto" as const },
    tick: { display: "flex", alignItems: "center", gap: 6, padding: "0 16px", borderRight: `1px solid ${T.border}`, whiteSpace: "nowrap" as const },
    tickLbl: { fontSize: 9, fontWeight: 700, color: T.grey, textTransform: "uppercase" as const, letterSpacing: ".06em", fontFamily: F },
    tabBar: { background: T.navyM, borderBottom: `1px solid ${T.borderT}`, padding: "0 24px", display: "flex", gap: 0 },
    section: { padding: "20px 24px" },
    sectionTitle: { fontFamily: F, fontSize: 13, fontWeight: 700, color: T.teal, textTransform: "uppercase" as const, letterSpacing: ".08em", marginBottom: 10 },
    lineSummary: { background: T.navyL, border: `1.5px solid ${T.border}`, borderRadius: 8, padding: "14px 16px", marginBottom: 16, display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 16 },
    lsItem: { display: "flex", flexDirection: "column" as const, gap: 3 },
    lsLbl: { fontFamily: F, fontSize: 10, fontWeight: 700, color: T.grey, textTransform: "uppercase" as const, letterSpacing: ".05em" },
    lsVal: { fontFamily: F, fontSize: 13, fontWeight: 700, color: T.greyL },
    nodeBadge: { display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: 4, background: T.teal, color: T.navy, fontFamily: F, fontSize: 10, fontWeight: 700, flexShrink: 0 },
    nodeTag: { fontFamily: F, fontSize: 11, fontWeight: 700, color: T.amber, minWidth: 70 },
    nodeName: { flex: 1, fontFamily: F, fontSize: 12, fontWeight: 700, color: T.greyL },
    nodeDetail: { display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 10, fontSize: 10, marginBottom: 10 },
    ndItem: { display: "flex", flexDirection: "column" as const, gap: 2 },
    ndLbl: { color: T.grey, fontWeight: 600, fontSize: 9 },
    ndVal: { fontFamily: F, fontSize: 11, fontWeight: 700, color: T.teal },
    nodeMeta: { display: "flex", gap: 8, flexWrap: "wrap" as const, alignItems: "center", marginBottom: 8 },
    supplier: { fontFamily: F, fontSize: 9, color: T.grey },
    nodeDesc: { fontFamily: F, fontSize: 11, color: T.grey, lineHeight: 1.5, paddingTop: 10, borderTop: `1px solid ${T.border}` },
    capexGrid: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 },
    capexCard: { background: T.navyL, border: `1.5px solid ${T.border}`, borderRadius: 8, padding: "14px", display: "flex", flexDirection: "column" as const, gap: 10 },
    ccTitle: { fontFamily: F, fontSize: 11, fontWeight: 700, color: T.teal, textTransform: "uppercase" as const, letterSpacing: ".05em" },
    ccItems: { display: "flex", flexDirection: "column" as const, gap: 6 },
    ccItem: { display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 6, borderBottom: `1px solid ${T.border}` },
    ccItemName: { fontFamily: F, fontSize: 10, color: T.greyL },
    ccItemCost: { fontFamily: F, fontSize: 11, fontWeight: 700, color: T.amber },
    ccTotal: { display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 10, borderTop: `1.5px solid ${T.teal}` },
    ccTotalLbl: { fontFamily: F, fontSize: 11, fontWeight: 700, color: T.teal },
    ccTotalVal: { fontFamily: F, fontSize: 12, fontWeight: 700, color: T.teal },
    opexGrid: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 },
    opexCard: { background: T.navyL, border: `1.5px solid ${T.border}`, borderRadius: 8, padding: "14px" },
    ocTitle: { fontFamily: F, fontSize: 11, fontWeight: 700, color: T.teal, textTransform: "uppercase" as const, letterSpacing: ".05em", marginBottom: 12 },
    ocRow: { display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 8, borderBottom: `1px solid ${T.border}`, marginBottom: 8 },
    ocLbl: { fontFamily: F, fontSize: 10, color: T.greyL },
    ocVal: { fontFamily: F, fontSize: 11, fontWeight: 700, color: T.amber },
    ocTotal: { display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 8, fontWeight: 700, color: T.teal },
    ghGrid: { display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12 },
    ghCard: { background: T.navyL, border: `1.5px solid ${T.border}`, borderRadius: 8, padding: "14px" },
    ghName: { fontFamily: F, fontSize: 12, fontWeight: 700, color: T.teal, marginBottom: 8 },
    ghRow: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", paddingBottom: 6, marginBottom: 6, borderBottom: `1px solid ${T.border}` },
    ghLbl: { fontFamily: F, fontSize: 9, color: T.grey, textTransform: "uppercase" as const, fontWeight: 600 },
    ghVal: { fontFamily: F, fontSize: 10, color: T.greyL, textAlign: "right" as const },
    datGap: { fontFamily: F, fontSize: 10, fontWeight: 700, color: T.amber, background: "rgba(245,166,35,.1)", padding: "6px 10px", borderRadius: 4, marginTop: 8 },
    grailGrid: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 },
    resultsBar: { position: "sticky" as const, bottom: 0, zIndex: 90, background: T.navyM, borderTop: `2px solid ${T.borderT}`, padding: "10px 24px", display: "flex", alignItems: "center", gap: 16, boxShadow: "0 -8px 32px rgba(0,0,0,.5)" },
    rbItem: { display: "flex", flexDirection: "column" as const, gap: 1 },
    rbLbl: { fontSize: 9, fontWeight: 700, color: T.grey, textTransform: "uppercase" as const, letterSpacing: ".05em" },
    rbDivider: { width: 1, height: 30, background: T.border },
  };

  const stageBtn = (active: boolean): React.CSSProperties => ({
    fontFamily: F, fontSize: 10, fontWeight: 700, padding: "4px 10px", borderRadius: 4,
    border: `1px solid ${active ? T.teal : "#D0D0D0"}`, color: active ? "#fff" : "#888",
    background: active ? T.teal : "transparent", cursor: "pointer", transition: "all .12s",
  });

  const tickVal = (c: string): React.CSSProperties => ({ fontFamily: F, fontSize: 13, fontWeight: 700, color: c });

  const tab = (active: boolean): React.CSSProperties => ({
    fontFamily: F, fontSize: 11, fontWeight: 700, color: active ? T.teal : T.grey,
    borderBottom: `2px solid ${active ? T.teal : "transparent"}`, padding: "10px 18px",
    cursor: "pointer", transition: "all .15s", textTransform: "uppercase", letterSpacing: ".05em",
    background: "transparent", border: "none", borderBottomWidth: 2, borderBottomStyle: "solid",
    borderBottomColor: active ? T.teal : "transparent",
  });

  const nodeCard = (expanded: boolean): React.CSSProperties => ({
    background: expanded ? "rgba(64,215,197,.08)" : T.navyL,
    border: `1.5px solid ${expanded ? T.teal : T.border}`, borderRadius: 8,
    padding: "12px 14px", marginBottom: 8, cursor: "pointer", transition: "all .15s",
  });

  const gateBadge = (warn: boolean): React.CSSProperties => ({
    fontFamily: F, fontSize: 9, fontWeight: 700, padding: "3px 10px", borderRadius: 4,
    border: `1px solid ${warn ? T.red : T.amber}`, color: warn ? T.red : T.amber,
    background: warn ? "rgba(232,64,64,.1)" : "rgba(245,166,35,.1)",
  });

  const capexBadge = (cost: number): React.CSSProperties => ({
    fontFamily: F, fontSize: 10, fontWeight: 700, padding: "4px 12px", borderRadius: 4,
    color: cost === 0 ? T.grey : T.teal, background: cost === 0 ? "rgba(139,160,180,.1)" : "rgba(64,215,197,.1)",
  });

  const grailCard = (color: string): React.CSSProperties => ({
    background: T.navyL, border: `1.5px solid ${color}33`, borderRadius: 8,
    padding: "12px", display: "flex", flexDirection: "column", gap: 8,
  });

  const grailBadge = (color: string): React.CSSProperties => ({
    fontFamily: F, fontSize: 9, fontWeight: 700, padding: "4px 10px", borderRadius: 4,
    color: color, border: `1px solid ${color}`, background: `${color}15`,
    textTransform: "uppercase", width: "fit-content",
  });

  const rbVal = (c: string): React.CSSProperties => ({ fontFamily: F, fontSize: 14, fontWeight: 700, color: c });

  return (
    <div style={s.page}>
      {/* HEADER */}
      <div style={s.header}>
        <div style={s.logo}>
          <div style={s.logoMark}>CFI</div>
          <div style={s.logoText}>CFI Deep Tech</div>
        </div>
        <div style={s.stageNav}>
          {["S0", "S1", "S2", "S3", "S4", "S5", "S6"].map((stage) => (
            <button key={stage} style={stageBtn(stage === "S1")}>{stage}</button>
          ))}
        </div>
      </div>

      {/* TICKER BAR */}
      <div style={s.ticker}>
        {[
          { lbl: "Total Lines", val: "3", c: T.teal },
          { lbl: "Total Power", val: "566 kW", c: T.teal },
          { lbl: "Equipment CAPEX", val: "$398K", c: T.amber },
          { lbl: "Monthly OpEx", val: "$37,957/mo", c: T.amber },
          { lbl: "Building CAPEX", val: "$1.37M", c: T.amber },
          { lbl: "Electricity", val: "$22,648/mo", c: T.green },
        ].map((t) => (
          <div key={t.lbl} style={s.tick}>
            <span style={s.tickLbl}>{t.lbl}</span>
            <span style={tickVal(t.c)}>{t.val}</span>
          </div>
        ))}
      </div>

      {/* LINE SELECTOR TABS */}
      <div style={s.tabBar}>
        {Object.entries(lines).map(([key, line]) => (
          <button key={key} style={tab(activeTab === key)} onClick={() => setActiveTab(key)}>
            {key} — {line.nodes.length} nodes · {line.totalKw} kW
          </button>
        ))}
      </div>

      {/* ACTIVE LINE SECTION */}
      <div style={s.section}>
        <div style={s.sectionTitle}>{activeLine.name}</div>
        <div style={s.lineSummary}>
          {[
            { lbl: "Throughput", val: activeLine.throughput },
            { lbl: "Belt Width", val: activeLine.belt },
            { lbl: "Building", val: activeLine.building },
            { lbl: "Total Power", val: `${activeLine.totalKw} kW` },
          ].map((i) => (
            <div key={i.lbl} style={s.lsItem}>
              <span style={s.lsLbl}>{i.lbl}</span>
              <span style={s.lsVal}>{i.val}</span>
            </div>
          ))}
        </div>

        {/* NODE CARDS */}
        {activeLine.nodes.map((node, idx) => {
          const isExpanded = expandedNode === node.id;
          return (
            <div key={node.id} style={nodeCard(isExpanded)} onClick={() => setExpandedNode(isExpanded ? null : node.id)}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: isExpanded ? 10 : 0 }}>
                <div style={s.nodeBadge}>{idx + 1}</div>
                <div style={s.nodeTag}>{node.tag}</div>
                <div style={s.nodeName}>{node.name}</div>
              </div>
              {!isExpanded && (
                <div style={s.nodeDetail}>
                  {[
                    { lbl: "t/h", val: node.th },
                    { lbl: "MC In", val: node.mcIn },
                    { lbl: "MC Out", val: node.mcOut },
                    { lbl: "Elevation", val: node.elev },
                    { lbl: "Power", val: `${node.kw} kW` },
                    { lbl: "CAPEX", val: node.capex === 0 ? "RFQ" : `$${(node.capex / 1000).toFixed(0)}K` },
                  ].map((d) => (
                    <div key={d.lbl} style={s.ndItem}>
                      <span style={s.ndLbl}>{d.lbl}</span>
                      <span style={s.ndVal}>{d.val}</span>
                    </div>
                  ))}
                </div>
              )}
              {isExpanded && (
                <div style={{ paddingTop: 10 }}>
                  <div style={s.nodeMeta}>
                    {node.gate && <div style={gateBadge(false)}>{node.gate}</div>}
                    {node.warn && <div style={gateBadge(true)}>{node.warn.split(":")[0]}</div>}
                    <div style={capexBadge(node.capex)}>
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

        {/* LINE TOTALS */}
        <div style={{ background: T.navyLL, border: `1.5px solid ${T.borderT}`, borderRadius: 8, padding: "12px 14px", marginTop: 12, display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
          {[
            { lbl: "Total Power", val: `${activeLine.totalKw} kW`, c: T.teal },
            { lbl: "Equipment CAPEX", val: `$${(activeLine.totalCapex / 1000).toFixed(0)}K`, c: T.amber },
            { lbl: "Monthly Electricity", val: activeLine.monthlyElec, c: T.green },
            { lbl: "Throughput", val: activeLine.throughput, c: T.greyL },
          ].map((i) => (
            <div key={i.lbl}>
              <div style={{ fontFamily: F, fontSize: 9, color: T.grey, textTransform: "uppercase" as const, fontWeight: 700 }}>{i.lbl}</div>
              <div style={{ fontFamily: F, fontSize: 14, fontWeight: 700, color: i.c, marginTop: 4 }}>{i.val}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CAPEX BREAKDOWN */}
      <div style={s.section}>
        <div style={s.sectionTitle}>Equipment CAPEX Breakdown</div>
        <div style={s.capexGrid}>
          {[
            { title: "S1C EFB Line", filter: "S1C EFB", total: "$184K" },
            { title: "S1B OPDC Line", filter: "S1B OPDC", total: "$38K" },
            { title: "Shared Equipment", filter: "Shared", total: "$176K" },
          ].map((group) => (
            <div key={group.title} style={s.capexCard}>
              <div style={s.ccTitle}>{group.title}</div>
              <div style={s.ccItems}>
                {CAPEX_ITEMS.filter((c) => c.line === group.filter).map((item, i) => (
                  <div key={i} style={s.ccItem}>
                    <span style={s.ccItemName}>{item.item}</span>
                    <span style={s.ccItemCost}>{item.cost === 0 ? "Shared" : `$${(item.cost / 1000).toFixed(0)}K`}</span>
                  </div>
                ))}
              </div>
              <div style={s.ccTotal}>
                <span style={s.ccTotalLbl}>Total</span>
                <span style={s.ccTotalVal}>{group.total}</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ ...s.lineSummary, marginTop: 12 }}>
          {[
            { lbl: "Combined Equipment CAPEX", val: "$398,000", c: T.amber },
            { lbl: "POS Decanter RFQ", val: "$80K–$150K pending", c: T.amber },
            { lbl: "Building CAPEX", val: "$1,374,610", c: T.amber },
            { lbl: "Total S1 CAPEX", val: "~$1.77M–$1.85M", c: T.teal },
          ].map((i) => (
            <div key={i.lbl} style={s.lsItem}>
              <span style={s.lsLbl}>{i.lbl}</span>
              <span style={{ ...s.lsVal, color: i.c }}>{i.val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* OPEX SECTION */}
      <div style={s.section}>
        <div style={s.sectionTitle}>Monthly Operating Expenditure</div>
        <div style={s.opexGrid}>
          <div style={s.opexCard}>
            <div style={s.ocTitle}>Labour</div>
            <div style={s.ocRow}><span style={s.ocLbl}>7 headcount</span><span style={s.ocVal}>—</span></div>
            <div style={s.ocRow}><span style={s.ocLbl}>Monthly wage pool</span><span style={s.ocVal}>$3,576</span></div>
            <div style={s.ocTotal}><span>Total</span><span style={{ color: T.amber }}>$3,576/mo</span></div>
          </div>
          <div style={s.opexCard}>
            <div style={s.ocTitle}>Electricity</div>
            {[
              { lbl: "S1C EFB", val: "$14,191" },
              { lbl: "S1B OPDC", val: "$6,651" },
              { lbl: "S1A POS", val: "$1,806" },
            ].map((r) => (
              <div key={r.lbl} style={s.ocRow}><span style={s.ocLbl}>{r.lbl}</span><span style={s.ocVal}>{r.val}</span></div>
            ))}
            <div style={s.ocTotal}><span>Total</span><span style={{ color: T.green }}>$22,648/mo</span></div>
          </div>
          <div style={s.opexCard}>
            <div style={s.ocTitle}>Maintenance & Other</div>
            {[
              { lbl: "Equipment maintenance", val: "—" },
              { lbl: "Repairs & parts", val: "—" },
              { lbl: "Contingency", val: "—" },
            ].map((r) => (
              <div key={r.lbl} style={s.ocRow}><span style={s.ocLbl}>{r.lbl}</span><span style={s.ocVal}>{r.val}</span></div>
            ))}
            <div style={s.ocTotal}><span>Total</span><span style={{ color: T.amber }}>$11,733/mo</span></div>
          </div>
        </div>
        <div style={{ ...s.lineSummary, marginTop: 12 }}>
          {[
            { lbl: "Labour", val: "$3,576/mo", c: T.amber },
            { lbl: "Electricity", val: "$22,648/mo", c: T.green },
            { lbl: "Maint. & Other", val: "$11,733/mo", c: T.amber },
            { lbl: "Total Monthly OpEx", val: "$37,957/mo", c: T.amber },
          ].map((i) => (
            <div key={i.lbl} style={s.lsItem}>
              <span style={s.lsLbl}>{i.lbl}</span>
              <span style={{ ...s.lsVal, color: i.c }}>{i.val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* GREENHOUSE SECTION */}
      <div style={s.section}>
        <div style={s.sectionTitle}>Greenhouse Infrastructure</div>
        <div style={{ marginBottom: 12, fontFamily: F, fontSize: 11, color: T.grey }}>
          Site layout: 98m × 85m. 2 rows × 2 columns with 6m central access road.
        </div>
        <div style={s.ghGrid}>
          {GREENHOUSES.map((gh) => (
            <div key={gh.id} style={s.ghCard}>
              <div style={s.ghName}>{gh.name}</div>
              {[
                { lbl: "Dimensions", val: gh.dims },
                { lbl: "Type", val: gh.type },
                { lbl: "Materials", val: gh.matl },
              ].map((r) => (
                <div key={r.lbl} style={s.ghRow}>
                  <span style={s.ghLbl}>{r.lbl}</span>
                  <span style={s.ghVal}>{r.val}</span>
                </div>
              ))}
              <div style={s.datGap}>{gh.cost}</div>
            </div>
          ))}
        </div>
      </div>

      {/* GUARDRAILS SECTION */}
      <div style={s.section}>
        <div style={s.sectionTitle}>Hard Guardrails</div>
        <div style={s.grailGrid}>
          {GUARDRAILS.map((gr) => (
            <div key={gr.id} style={grailCard(gr.color)}>
              <div style={grailBadge(gr.color)}>{gr.severity}</div>
              <div style={{ fontFamily: F, fontSize: 11, fontWeight: 700, color: T.greyL }}>{gr.name}</div>
              <div style={{ fontFamily: F, fontSize: 9, color: T.grey }}>{gr.nodes.join(" · ")}</div>
              <div style={{ fontFamily: F, fontSize: 9, color: T.grey, lineHeight: 1.4 }}>{gr.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ height: 80 }} />

      {/* RESULTS BAR */}
      <div style={s.resultsBar}>
        {[
          { lbl: "Active Line", val: activeTab, c: T.teal },
          null,
          { lbl: "Total Power", val: `${activeLine.totalKw} kW`, c: T.teal },
          null,
          { lbl: "Equipment CAPEX", val: `$${(activeLine.totalCapex / 1000).toFixed(0)}K`, c: T.amber },
          null,
          { lbl: "Monthly OpEx", val: "$37,957/mo", c: T.amber },
          null,
          { lbl: "Throughput", val: activeLine.throughput, c: T.green },
        ].map((item, idx) =>
          item === null ? (
            <div key={`d${idx}`} style={s.rbDivider} />
          ) : (
            <div key={item.lbl} style={s.rbItem}>
              <div style={s.rbLbl}>{item.lbl}</div>
              <div style={rbVal(item.c)}>{item.val}</div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
