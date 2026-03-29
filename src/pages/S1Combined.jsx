import { useState } from "react";
import { useNavigate } from "react-router-dom";

const F = "'DM Sans', sans-serif";
const FH = "'EB Garamond', serif";

/* ─── SVG Icons ─── */
function HopperSVG() {
  return (
    <svg viewBox="0 0 100 100" width="90" height="90">
      <polygon points="20,15 80,15 70,75 30,75" fill="none" stroke="#40D7C5" strokeWidth="1.5" opacity="0.7"/>
      <rect x="38" y="75" width="24" height="8" fill="none" stroke="#40D7C5" strokeWidth="1.5" opacity="0.7"/>
      <line x1="50" y1="83" x2="50" y2="95" stroke="#40D7C5" strokeWidth="1" opacity="0.5"/>
    </svg>
  );
}
function ConveyorSVG() {
  return (
    <svg viewBox="0 0 110 60" width="100" height="55">
      <line x1="10" y1="48" x2="100" y2="18" stroke="#40D7C5" strokeWidth="1.5" opacity="0.7"/>
      <circle cx="10" cy="48" r="5" fill="none" stroke="#40D7C5" strokeWidth="1.5" opacity="0.7"/>
      <circle cx="100" cy="18" r="5" fill="none" stroke="#40D7C5" strokeWidth="1.5" opacity="0.7"/>
      <line x1="10" y1="54" x2="100" y2="24" stroke="#40D7C5" strokeWidth="0.8" strokeDasharray="3" opacity="0.4"/>
    </svg>
  );
}
function ShredderSVG() {
  return (
    <svg viewBox="0 0 100 100" width="90" height="90">
      <rect x="15" y="15" width="70" height="70" rx="4" fill="none" stroke="#40D7C5" strokeWidth="1.5" opacity="0.7"/>
      <circle cx="38" cy="50" r="12" fill="none" stroke="#40D7C5" strokeWidth="1" opacity="0.5"/>
      <circle cx="62" cy="50" r="12" fill="none" stroke="#40D7C5" strokeWidth="1" opacity="0.5"/>
      <line x1="38" y1="38" x2="38" y2="62" stroke="#40D7C5" strokeWidth="0.8" opacity="0.5"/>
      <line x1="26" y1="50" x2="50" y2="50" stroke="#40D7C5" strokeWidth="0.8" opacity="0.5"/>
    </svg>
  );
}
function MillSVG() {
  return (
    <svg viewBox="0 0 100 100" width="90" height="90">
      <rect x="15" y="20" width="70" height="60" rx="4" fill="none" stroke="#40D7C5" strokeWidth="1.5" opacity="0.7"/>
      <circle cx="50" cy="50" r="18" fill="none" stroke="#40D7C5" strokeWidth="1.5" opacity="0.5"/>
      <line x1="50" y1="32" x2="50" y2="68" stroke="#40D7C5" strokeWidth="1" opacity="0.5"/>
      <line x1="32" y1="50" x2="68" y2="50" stroke="#40D7C5" strokeWidth="1" opacity="0.5"/>
      <line x1="37" y1="37" x2="63" y2="63" stroke="#40D7C5" strokeWidth="0.8" opacity="0.4"/>
      <line x1="63" y1="37" x2="37" y2="63" stroke="#40D7C5" strokeWidth="0.8" opacity="0.4"/>
    </svg>
  );
}
function ScreenSVG() {
  return (
    <svg viewBox="0 0 110 70" width="100" height="63">
      <rect x="5" y="10" width="100" height="50" rx="3" fill="none" stroke="#40D7C5" strokeWidth="1.5" opacity="0.7"/>
      <line x1="5" y1="35" x2="105" y2="35" stroke="#40D7C5" strokeWidth="0.8" strokeDasharray="4,3" opacity="0.5"/>
      <line x1="30" y1="10" x2="30" y2="60" stroke="#40D7C5" strokeWidth="0.4" strokeDasharray="2" opacity="0.3"/>
      <line x1="55" y1="10" x2="55" y2="60" stroke="#40D7C5" strokeWidth="0.4" strokeDasharray="2" opacity="0.3"/>
      <line x1="80" y1="10" x2="80" y2="60" stroke="#40D7C5" strokeWidth="0.4" strokeDasharray="2" opacity="0.3"/>
    </svg>
  );
}
function PressSVG() {
  return (
    <svg viewBox="0 0 110 60" width="100" height="55">
      <ellipse cx="55" cy="30" rx="45" ry="22" fill="none" stroke="#40D7C5" strokeWidth="1.5" opacity="0.7"/>
      <path d="M 25 30 Q 40 20 55 30 Q 70 40 85 30" fill="none" stroke="#40D7C5" strokeWidth="1" opacity="0.5"/>
      <line x1="10" y1="30" x2="25" y2="30" stroke="#40D7C5" strokeWidth="1" opacity="0.5"/>
      <line x1="85" y1="30" x2="100" y2="30" stroke="#40D7C5" strokeWidth="1" opacity="0.5"/>
    </svg>
  );
}
function BinSVG() {
  return (
    <svg viewBox="0 0 100 100" width="90" height="90">
      <rect x="25" y="10" width="50" height="55" rx="3" fill="none" stroke="#40D7C5" strokeWidth="1.5" opacity="0.7"/>
      <polygon points="25,65 75,65 65,90 35,90" fill="none" stroke="#40D7C5" strokeWidth="1.5" opacity="0.7"/>
    </svg>
  );
}
function BaghouseSVG() {
  return (
    <svg viewBox="0 0 80 100" width="72" height="90">
      <rect x="10" y="5" width="60" height="90" rx="4" fill="none" stroke="#40D7C5" strokeWidth="1.5" opacity="0.7"/>
      <line x1="10" y1="25" x2="70" y2="25" stroke="#40D7C5" strokeWidth="0.8" opacity="0.4"/>
      <line x1="25" y1="30" x2="25" y2="85" stroke="#40D7C5" strokeWidth="0.8" strokeDasharray="3" opacity="0.4"/>
      <line x1="40" y1="30" x2="40" y2="85" stroke="#40D7C5" strokeWidth="0.8" strokeDasharray="3" opacity="0.4"/>
      <line x1="55" y1="30" x2="55" y2="85" stroke="#40D7C5" strokeWidth="0.8" strokeDasharray="3" opacity="0.4"/>
    </svg>
  );
}
function FeederSVG() {
  return (
    <svg viewBox="0 0 100 60" width="90" height="54">
      <rect x="10" y="10" width="80" height="40" rx="3" fill="none" stroke="#40D7C5" strokeWidth="1.5" opacity="0.7"/>
      <line x1="50" y1="20" x2="80" y2="30" stroke="#40D7C5" strokeWidth="1.5" opacity="0.5"/>
      <polygon points="75,25 85,30 75,35" fill="#40D7C5" opacity="0.4"/>
    </svg>
  );
}
function DryerSVG() {
  return (
    <svg viewBox="0 0 110 60" width="100" height="55">
      <ellipse cx="55" cy="30" rx="48" ry="22" fill="none" stroke="#40D7C5" strokeWidth="1.5" opacity="0.7"/>
      <line x1="7" y1="30" x2="103" y2="30" stroke="#40D7C5" strokeWidth="0.5" strokeDasharray="3" opacity="0.4"/>
      <circle cx="25" cy="45" r="4" fill="#F5A623" opacity="0.5"/>
      <circle cx="35" cy="48" r="3" fill="#F5A623" opacity="0.4"/>
    </svg>
  );
}
function TankSVG() {
  return (
    <svg viewBox="0 0 80 100" width="72" height="90">
      <ellipse cx="40" cy="20" rx="28" ry="10" fill="none" stroke="#40D7C5" strokeWidth="1.5" opacity="0.7"/>
      <line x1="12" y1="20" x2="12" y2="80" stroke="#40D7C5" strokeWidth="1.5" opacity="0.7"/>
      <line x1="68" y1="20" x2="68" y2="80" stroke="#40D7C5" strokeWidth="1.5" opacity="0.7"/>
      <ellipse cx="40" cy="80" rx="28" ry="10" fill="none" stroke="#40D7C5" strokeWidth="1.5" opacity="0.7"/>
      <line x1="40" y1="25" x2="40" y2="75" stroke="#40D7C5" strokeWidth="0.8" opacity="0.4"/>
    </svg>
  );
}
function FilterPressSVG() {
  return (
    <svg viewBox="0 0 100 80" width="90" height="72">
      <rect x="15" y="10" width="10" height="60" rx="1" fill="none" stroke="#40D7C5" strokeWidth="1" opacity="0.6"/>
      <rect x="30" y="10" width="10" height="60" rx="1" fill="none" stroke="#40D7C5" strokeWidth="1" opacity="0.6"/>
      <rect x="45" y="10" width="10" height="60" rx="1" fill="none" stroke="#40D7C5" strokeWidth="1" opacity="0.6"/>
      <rect x="60" y="10" width="10" height="60" rx="1" fill="none" stroke="#40D7C5" strokeWidth="1" opacity="0.6"/>
      <rect x="75" y="10" width="10" height="60" rx="1" fill="none" stroke="#40D7C5" strokeWidth="1" opacity="0.6"/>
      <line x1="10" y1="40" x2="90" y2="40" stroke="#40D7C5" strokeWidth="1.5" opacity="0.7"/>
    </svg>
  );
}

const circleNums = ["①","②","③","④","⑤","⑥","⑦","⑧","⑨","⑩"];

/* ─── Machine Card ─── */
function MachineCard({ num, title, icon, specs, footer }) {
  return (
    <div style={{
      background: "#111D2E", border: "1px solid #1A2A3A", borderRadius: 8,
      position: "relative", overflow: "hidden", transition: "border-color 0.2s",
    }}
      onMouseEnter={e => e.currentTarget.style.borderColor = "#40D7C5"}
      onMouseLeave={e => e.currentTarget.style.borderColor = "#1A2A3A"}
    >
      <div style={{
        position: "absolute", top: 0, left: 0, background: "#40D7C5", color: "#0B1422",
        fontFamily: F, fontWeight: 700, fontSize: 18, padding: "6px 12px 6px 12px",
        borderBottomRightRadius: 8, zIndex: 2,
      }}>{circleNums[num - 1] || num}</div>
      <div style={{ display: "flex" }}>
        <div style={{
          width: 138, background: "#0A1018", borderRight: "1px solid #1A2A3A",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>{icon}</div>
        <div style={{ flex: 1, padding: "40px 16px 12px 16px" }}>
          <div style={{ fontFamily: F, fontWeight: 700, fontSize: 16, color: "#FFFFFF", marginBottom: 12 }}>{title}</div>
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "8px 12px", fontSize: 13 }}>
            {specs.map(([label, value], i) => (
              <div key={i} style={{ display: "contents" }}>
                <span style={{ fontFamily: F, color: "#64748B", whiteSpace: "nowrap" }}>{label}:</span>
                <span style={{ fontFamily: F, fontWeight: 500, color: "#E2E8F0" }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{
        borderTop: "1px dashed #1A2A3A", padding: "10px 16px",
        fontFamily: F, fontSize: 12, color: "#64748B", display: "flex", alignItems: "center", gap: 6,
      }}>
        <span style={{ color: "#3a4a5a" }}>▾</span> {footer}
      </div>
    </div>
  );
}

/* ─── Data ─── */
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
  efb: { name: "Building A5 — EFB Processing Hall", width: "30m", length: "60m", height: "12m", area: "1,800 m²" },
  opdc: { name: "Building A6 — OPDC Processing Hall", width: "18m", length: "36m", height: "10m", area: "648 m²" },
  pos: { name: "Building A7 — Utility Building (POS)", width: "12m", length: "18m", height: null, area: "216 m²" },
};

const summaries = {
  efb: [["Throughput","20 t/h @ 62.5% MC","13 t/h @ 55% MC"],["Source","Mill EFB press discharge","Milled fibre to S2"],["Daily Input","~300 t fresh","~195 t milled"],["Installed Power","~298 kW total",""]],
  opdc: [["Throughput","5 t/h @ 70% MC","3.3 t/h @ 45% MC"],["Source","Mill decanter cake","Dried/milled cake to S2"],["Daily Input","~75 t fresh","~50 t processed"],["Installed Power","~206 kW total",""]],
  pos: [["Throughput","1.5 t/h @ 82% MC","~0.55 t/h @ 65% MC"],["Source","Mill decanter sludge discharge","Dewatered cake"],["Daily Input","~30 t fresh (80–92% MC)","~13.5 t to S2"],["Installed Power","~20 kW total",""]],
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

const tabs = [
  { id: "efb", label: "EFB Line", cards: efbCards, sectionTitle: "EFB LINE — Empty Fruit Bunch Processing" },
  { id: "opdc", label: "OPDC Line", cards: opdcCards, sectionTitle: "OPDC LINE — Oil Palm Decanter Cake Processing" },
  { id: "pos", label: "POS Line", cards: posCards, sectionTitle: "POS LINE — Palm Oil Sludge Pre-Skimming" },
];

/* ─── Building Dimension Diagram ─── */
function BuildingDiagram({ building }) {
  return (
    <div style={{ margin: "32px 0 24px", position: "relative", maxWidth: 700 }}>
      <div style={{ textAlign: "center", marginBottom: 8 }}>
        <div style={{ fontFamily: F, fontSize: 12, fontWeight: 500, color: "#40D7C5" }}>Width</div>
        <div style={{ height: 2, background: "#1A2A3A", margin: "4px auto", maxWidth: 400, position: "relative" }}>
          <div style={{ position: "absolute", left: 0, top: -4, width: 2, height: 10, background: "#1A2A3A" }} />
          <div style={{ position: "absolute", right: 0, top: -4, width: 2, height: 10, background: "#1A2A3A" }} />
        </div>
        <div style={{ fontFamily: F, fontSize: 14, fontWeight: 700, color: "#40D7C5" }}>{building.width}</div>
      </div>
      <div style={{ border: "2px solid #40D7C5", background: "#0A1018", padding: 24, position: "relative", maxWidth: 400, margin: "0 auto" }}>
        {building.height && (
          <div style={{
            position: "absolute", right: -60, top: 0, bottom: 0,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          }}>
            <div style={{ width: 2, flex: 1, background: "#1A2A3A", position: "relative" }}>
              <div style={{ position: "absolute", top: 0, left: -4, width: 10, height: 2, background: "#1A2A3A" }} />
              <div style={{ position: "absolute", bottom: 0, left: -4, width: 10, height: 2, background: "#1A2A3A" }} />
            </div>
            <div style={{ fontFamily: F, fontSize: 12, fontWeight: 500, color: "#40D7C5", writingMode: "vertical-rl", transform: "rotate(180deg)", margin: "8px 0" }}>Height</div>
            <div style={{ fontFamily: F, fontSize: 14, fontWeight: 700, color: "#40D7C5", writingMode: "vertical-rl", transform: "rotate(180deg)" }}>{building.height}</div>
          </div>
        )}
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: F, fontSize: 14, fontWeight: 700, color: "#E2E8F0", marginBottom: 4 }}>{building.name}</div>
          <div style={{ fontFamily: F, fontSize: 13, color: "#64748B" }}>S1 Mechanical Equipment Layout</div>
          <div style={{ fontFamily: F, fontSize: 13, color: "#64748B", marginTop: 4 }}>Area: {building.area}</div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
export default function S1Combined() {
  const [activeTab, setActiveTab] = useState("efb");
  const navigate = useNavigate();
  const tab = tabs.find(t => t.id === activeTab);

  return (
    <div style={{ fontFamily: F, color: "#E2E8F0", minHeight: "100vh", background: "#0B1422" }}>
      {/* ═══ CFI GLOBAL HEADER ═══ */}
      <div style={{
        height: 83, background: "#0A1628",
        borderBottom: "1px solid rgba(51, 212, 188, 0.15)",
        display: "flex", alignItems: "center", padding: "0 32px",
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 301,
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

      <div style={{ height: 83 }} />

      {/* ═══ PAGE HEADER ═══ */}
      <div style={{ background: "#0B1422", borderBottom: "1px solid #1A2A3A" }}>
        {/* Breadcrumb */}
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "12px 24px 0" }}>
          <div style={{ fontSize: 13, fontFamily: F }}>
            <a href="/" onClick={e => { e.preventDefault(); navigate("/"); }} style={{ color: "#64748B", textDecoration: "none" }}
              onMouseEnter={e => e.currentTarget.style.color = "#40D7C5"}
              onMouseLeave={e => e.currentTarget.style.color = "#64748B"}>CFI Platform</a>
            <span style={{ color: "#3a4a5a", margin: "0 8px" }}>›</span>
            <a href="/s1-index" onClick={e => { e.preventDefault(); navigate("/s1-index"); }} style={{ color: "#64748B", textDecoration: "none" }}
              onMouseEnter={e => e.currentTarget.style.color = "#40D7C5"}
              onMouseLeave={e => e.currentTarget.style.color = "#64748B"}>S1 Pre-Processing</a>
            <span style={{ color: "#3a4a5a", margin: "0 8px" }}>›</span>
            <span style={{ color: "#E2E8F0", fontWeight: 700 }}>Combined Floor Plans</span>
          </div>
        </div>

        {/* Title */}
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "16px 24px 20px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
          <div>
            <h1 style={{ fontFamily: F, fontWeight: 700, fontSize: 28, color: "#FFFFFF", margin: 0 }}>S1 Combined Floor Plans</h1>
            <div style={{ fontFamily: F, fontSize: 13, color: "#64748B", marginTop: 4 }}>Design Basis: 60 TPH FFB · v2 FINAL · March 2026</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: F, fontSize: 14, fontWeight: 500, color: "#E2E8F0" }}>Mill Size: 60 ton/hour</div>
            <div style={{ fontFamily: F, fontSize: 13, color: "#94A3B8", marginTop: 2 }}>EFB 20→13 t/h | OPDC 5→3.3 t/h | POS 1.25→0.56 t/h</div>
          </div>
        </div>
      </div>

      {/* ═══ TAB NAV ═══ */}
      <div style={{ background: "#111D2E", borderBottom: "2px solid #1A2A3A" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex" }}>
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                fontFamily: F, fontWeight: 500, fontSize: 14, padding: "12px 24px",
                border: "none", background: "transparent", cursor: "pointer",
                color: activeTab === t.id ? "#FFFFFF" : "#64748B",
                borderBottom: activeTab === t.id ? "2px solid #40D7C5" : "2px solid transparent",
                marginBottom: -2, transition: "color 0.15s",
              }}
              onMouseEnter={e => { if (activeTab !== t.id) e.currentTarget.style.color = "#94A3B8"; }}
              onMouseLeave={e => { if (activeTab !== t.id) e.currentTarget.style.color = "#64748B"; }}
            >{t.label}</button>
          ))}
        </div>
      </div>

      {/* ═══ TAB CONTENT ═══ */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px 60px" }}>
        {/* Section title */}
        <div style={{
          fontFamily: F, fontWeight: 700, fontSize: 22, color: "#40D7C5",
          borderBottom: "1px solid #1A2A3A", paddingBottom: 8, marginBottom: 24,
        }}>{tab.sectionTitle}</div>

        {/* Machine cards grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: 20, marginBottom: 32 }}>
          {tab.cards.map((card, i) => (
            <MachineCard key={`${activeTab}-${i}`} {...card} />
          ))}
        </div>

        {/* Building Dimension Diagram */}
        <div style={{
          fontFamily: F, fontWeight: 700, fontSize: 18, color: "#E2E8F0", marginBottom: 12,
          borderBottom: "1px solid #1A2A3A", paddingBottom: 8,
        }}>Building Dimensions</div>
        <BuildingDiagram building={buildings[activeTab]} />

        {/* Summary Table */}
        <div style={{
          fontFamily: F, fontWeight: 700, fontSize: 18, color: "#E2E8F0", marginTop: 32, marginBottom: 12,
          borderBottom: "1px solid #1A2A3A", paddingBottom: 8,
        }}>Line Summary</div>
        <div style={{ background: "#111D2E", border: "1px solid #1A2A3A", borderRadius: 8, overflow: "hidden", marginBottom: 24 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, fontFamily: F }}>
            <thead>
              <tr style={{ background: "#0A1018" }}>
                <th style={{ padding: 10, textAlign: "left", fontWeight: 700, color: "#64748B", textTransform: "uppercase", borderBottom: "1px solid #1A2A3A" }}>Parameter</th>
                <th style={{ padding: 10, textAlign: "left", fontWeight: 700, color: "#64748B", textTransform: "uppercase", borderBottom: "1px solid #1A2A3A" }}>Input</th>
                <th style={{ padding: 10, textAlign: "left", fontWeight: 700, color: "#64748B", textTransform: "uppercase", borderBottom: "1px solid #1A2A3A" }}>Output</th>
              </tr>
            </thead>
            <tbody>
              {summaries[activeTab].map(([param, input, output], i) => (
                <tr key={i}>
                  <td style={{ padding: 10, color: "#94A3B8", borderBottom: "1px solid #1A2A3A", fontWeight: 500 }}>{param}</td>
                  <td style={{ padding: 10, color: "#E2E8F0", borderBottom: "1px solid #1A2A3A" }}>{input}</td>
                  <td style={{ padding: 10, color: "#E2E8F0", borderBottom: "1px solid #1A2A3A" }}>{output || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div style={{ background: "#111D2E", border: "1px solid #1A2A3A", borderRadius: 8, padding: 16 }}>
          <div style={{ fontFamily: F, fontWeight: 700, fontSize: 14, color: "#FFFFFF", marginBottom: 10 }}>Legend</div>
          {legends[activeTab].map((item, i) => (
            <div key={i} style={{ fontFamily: F, fontSize: 12, color: "#64748B", marginBottom: 6, paddingLeft: 16, position: "relative" }}>
              <span style={{ position: "absolute", left: 0, color: "#3a4a5a" }}>•</span>
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
