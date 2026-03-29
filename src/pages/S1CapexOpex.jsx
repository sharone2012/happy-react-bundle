import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const FH = "'EB Garamond', serif";
const F = "'DM Sans', sans-serif";

const C = {
  bg: "#070D16",
  s1: "#0B1422",
  s2: "#153352",
  input: "#1A3A5C",
  black: "#060C14",
  border: "#1E6B8C",
  teal: "#00C9B1",
  teal2: "#40D7C5",
  amber: "#F5A623",
  green: "#3DCB7A",
  red: "#E84040",
  blue: "#4A9EDB",
  white: "#F0F4F8",
  grey: "#8BA0B4",
  greyMd: "#A8B8C7",
};

/* ── tiny reusable bits ── */
function Tag({ text, color = C.teal2 }) {
  return (
    <span style={{
      background: color === C.red ? "rgba(232,64,64,0.08)" : "rgba(64,215,197,0.1)",
      border: `1px solid ${color === C.red ? "rgba(232,64,64,0.28)" : "rgba(64,215,197,0.28)"}`,
      color, fontFamily: F, fontSize: 9, fontWeight: 700,
      padding: "2px 8px", borderRadius: 3,
    }}>{text}</span>
  );
}

function Pill({ letter }) {
  return (
    <span style={{
      background: C.border, color: C.white, fontFamily: F,
      fontSize: 11, fontWeight: 800, padding: "2px 7px", borderRadius: 3,
    }}>{letter}</span>
  );
}

function Chevron({ open }) {
  return (
    <span style={{
      fontFamily: F, fontSize: 12, color: C.teal2,
      display: "inline-block",
      transform: open ? "rotate(180deg)" : "rotate(0deg)",
      transition: "transform 0.3s ease",
    }}>▼</span>
  );
}

/* ── KPI Strip ── */
const kpis = [
  { label: "Total Building CAPEX", value: "$1,374,610", color: C.amber, unit: "S1 Building Only · Indo Rates", dot: C.teal2 },
  { label: "Total Equipment CAPEX", value: "$398,000", color: C.amber, unit: "POS decanter $80K–$150K RFQ pending", dot: C.teal2 },
  { label: "Monthly OPEX", value: "$37,957/mo", color: C.green, unit: "Labour + Electricity + Maintenance + Admin", dot: C.teal2 },
  { label: "Processing Lines", value: "3 Active", color: C.green, unit: "EFB · OPDC · POS", dot: C.teal2 },
  { label: "Facility Area", value: "2,450 m²", unit: "Building footprint", color: C.teal2, dot: C.teal2 },
  { label: "Electricity OPEX", value: "IDR 8.2M/mo", color: C.teal2, unit: "PLN I-3 tariff", dot: C.teal2, pulse: true },
];

function KpiStrip() {
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "repeat(6, 1fr)",
      background: C.s1, border: `1.5px solid ${C.border}`, borderRadius: 8,
      margin: "10px 0", overflow: "hidden",
    }}>
      {kpis.map((k, i) => (
        <div key={i} style={{
          padding: "12px 14px", textAlign: "center",
          borderRight: i < 5 ? "1px solid rgba(30,107,140,0.28)" : "none",
          display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 6,
        }}>
          <div style={{ fontFamily: F, fontSize: 9, fontWeight: 700, color: C.grey, textTransform: "uppercase", letterSpacing: "0.07em" }}>{k.label}</div>
          <div style={{ fontFamily: F, fontSize: 20, fontWeight: 700, color: k.color }}>{k.value}</div>
          <div style={{ fontFamily: F, fontSize: 9, color: C.greyMd, display: "flex", alignItems: "center", gap: 5 }}>
            {k.unit}
            <span style={{
              width: 6, height: 6, borderRadius: "50%", background: k.dot, display: "inline-block",
              animation: k.pulse ? "cfi-pulse 2s ease-in-out infinite" : "none",
            }} />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Site & Facility Metrics Card ── */
const visibleTiles = [
  { label: "Total Site Area", value: "5,000 m²", unit: "1.25 acres recommended" },
  { label: "Building Footprint", value: "1,260 m²", unit: "36m × 35m × 10m ht" },
];
const expandedTiles = [
  { label: "Outside Space", value: "2,540 m²", unit: "Roads · silos · workshop" },
  { label: "Truck Bay", value: "216 m²", unit: "18m × 12m × 4m ht" },
  { label: "Conv. Gallery", value: "100 m²", unit: "25m × 4m · covered" },
  { label: "Greenhouse Block", value: "1,920 m²", unit: "4 × 40×8m · separate S3" },
  { label: "EFB Machines", value: "10 units", unit: "① – ⑩ · 20 t/h" },
  { label: "OPDC Machines", value: "8 units", unit: "⑪ – ⑳ · 5 t/h" },
  { label: "Total Conveyors", value: "22", unit: "EFB 9 · OPDC 8 · Gallery 5" },
  { label: "Portal Frames", value: "7", unit: "@ 6m spacing · PEB" },
];

const drawingBtns = [
  { title: "Site Master Plan", sub: "98m × 85m · All zones · North arrow", action: "nav", route: "/s1-combined" },
  { title: "Building Architecture", sub: "Floor · Elevation · Section · 3D · Machinery", action: "toast" },
  { title: "Building Floor Plan", sub: "36×35m · All machines ①–⑳ · Legend", action: "nav", route: "/s1-combined" },
  { title: "Greenhouse Design", sub: "Site plan · Section XX · Store", action: "toast" },
  { title: "EFB Floor Plan", sub: "①–⑩ · 20 t/h · 10 machines · 600mm belt", action: "nav", route: "/s1-combined" },
  { title: "OPDC Floor Plan", sub: "⑪–⑳ · 5 t/h · CLASS A gate", action: "nav", route: "/s1-combined" },
  { title: "EFB ASCII Flow", sub: "Step-by-step · machines · specs · gates", action: "nav", route: "/s1-efb-ascii" },
  { title: "OPDC ASCII Flow", sub: "Step-by-step · CLASS A gate · 24h dwell", action: "nav", route: "/s1-opdc-ascii" },
  { title: "POS ASCII Flow", sub: "ICP-OES Fe gate · decanter · inclusion rate", action: "nav", route: "/s1-pos-ascii" },
];

function MetricTile({ label, value, unit }) {
  return (
    <div style={{
      background: C.black, border: "1px solid rgba(30,107,140,0.25)", borderRadius: 4,
      padding: "8px 10px", textAlign: "center", display: "flex", flexDirection: "column", gap: 2,
    }}>
      <div style={{ fontFamily: F, fontSize: 9, fontWeight: 700, color: C.grey, textTransform: "uppercase" }}>{label}</div>
      <div style={{ fontFamily: F, fontSize: 16, fontWeight: 700, color: C.teal2 }}>{value}</div>
      <div style={{ fontFamily: F, fontSize: 8, color: C.greyMd }}>{unit}</div>
    </div>
  );
}

function SiteFacilityCard({ forceOpen, navigate }) {
  const [open, setOpen] = useState(true);
  const [moreOpen, setMoreOpen] = useState(false);
  const isOpen = forceOpen !== undefined ? forceOpen : open;

  const handleDrawingClick = (btn) => {
    if (btn.action === "nav") {
      navigate(btn.route);
    } else {
      toast("Coming soon", { duration: 2000 });
    }
  };

  return (
    <div style={{ background: C.s1, border: `1.5px solid ${C.border}`, borderRadius: 8, overflow: "hidden" }}>
      <div onClick={() => setOpen(!open)} style={{
        background: C.s1, padding: "10px 14px", display: "flex", justifyContent: "space-between",
        alignItems: "center", borderBottom: "1px solid rgba(30,107,140,0.2)", cursor: "pointer", userSelect: "none",
      }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Pill letter="M" />
          <span style={{ fontFamily: F, fontSize: 13, fontWeight: 700, color: C.teal2 }}>Site & Facility Metrics</span>
          <Tag text="S1 Building Only" />
        </div>
        <Chevron open={isOpen} />
      </div>

      {isOpen && (
        <>
          <div style={{ padding: "8px 14px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {visibleTiles.map((t, i) => <MetricTile key={i} {...t} />)}
          </div>
          <div onClick={() => setMoreOpen(!moreOpen)} style={{
            padding: "6px 14px", borderTop: "1px solid rgba(30,107,140,0.15)",
            display: "flex", justifyContent: "center", cursor: "pointer",
            fontFamily: F, fontSize: 9, fontWeight: 600, color: C.teal2,
          }}>
            {moreOpen ? "Hide Site Metrics" : "More Site Metrics (8 items)"}
          </div>
          {moreOpen && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, padding: "8px 14px", background: "rgba(11,20,34,0.5)" }}>
              {expandedTiles.map((t, i) => <MetricTile key={i} {...t} />)}
            </div>
          )}
          <div style={{
            paddingTop: 10, paddingBottom: 2, paddingLeft: 14,
            fontFamily: F, fontSize: 9, fontWeight: 700, color: C.teal2,
            textTransform: "uppercase", letterSpacing: "0.1em",
            borderBottom: "1px solid rgba(30,107,140,0.15)",
          }}>Open Design Drawings</div>
          <div style={{ padding: "8px 14px 12px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {drawingBtns.map((b, i) => (
              <div key={i} onClick={() => handleDrawingClick(b)} style={{
                background: "#0C1E33", border: "1px solid rgba(139,160,180,0.18)", borderRadius: 6,
                padding: "11px 12px", display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                cursor: "pointer", textAlign: "center", position: "relative", transition: "all 0.2s ease",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(64,215,197,0.05)"; e.currentTarget.style.borderColor = "rgba(139,160,180,0.35)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#0C1E33"; e.currentTarget.style.borderColor = "rgba(139,160,180,0.18)"; }}
              >
                <span style={{ position: "absolute", top: 4, right: 6, fontFamily: F, fontSize: 11, color: "rgba(139,160,180,0.4)" }}>↗</span>
                <span style={{ fontFamily: F, fontSize: 12, fontWeight: 700, color: C.greyMd }}>{b.title}</span>
                <span style={{ fontFamily: F, fontSize: 9, color: "rgba(139,160,180,0.55)" }}>{b.sub}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ── Building CAPEX Card ── */
const lineItems = [
  { ref: "A1", desc: "S1C EFB Processing Hall", val: "$425,000" },
  { ref: "A2", desc: "S1B OPDC Processing Bay", val: "$185,000" },
  { ref: "A3", desc: "Shared Infrastructure", val: "$312,610" },
  { ref: "A4", desc: "Drying Yard & Hardstand", val: "$95,000" },
  { ref: "A5", desc: "Storage & Bagging", val: "$142,000" },
  { ref: "A6", desc: "Office & Laboratory", val: "$78,000" },
  { ref: "A7", desc: "Utilities & Services", val: "$89,000" },
  { ref: "A8", desc: "Contingency (5%)", val: "$48,000" },
];

function BuildingCapexCard({ forceOpen }) {
  const [open, setOpen] = useState(true);
  const isOpen = forceOpen !== undefined ? forceOpen : open;

  return (
    <div style={{ background: C.s1, border: `1.5px solid ${C.border}`, borderRadius: 8, overflow: "hidden" }}>
      <div onClick={() => setOpen(!open)} style={{
        background: C.s1, padding: "10px 14px", display: "flex", justifyContent: "space-between",
        alignItems: "center", borderBottom: "1px solid rgba(30,107,140,0.2)", cursor: "pointer", userSelect: "none",
      }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Pill letter="G" />
          <span style={{ fontFamily: F, fontSize: 13, fontWeight: 700, color: C.teal2 }}>Building CAPEX — S1 Only</span>
          <Tag text="Indonesian Rates" />
        </div>
        <Chevron open={isOpen} />
      </div>

      {isOpen && (
        <>
          <div style={{
            background: "rgba(61,203,122,0.05)", borderBottom: "1px solid rgba(30,107,140,0.2)",
            padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12,
          }}>
            <div>
              <div style={{ fontFamily: F, fontSize: 9, fontWeight: 700, color: C.grey, textTransform: "uppercase", letterSpacing: "0.07em" }}>Total To CFI — S1 Building</div>
              <div style={{ fontFamily: F, fontSize: 28, fontWeight: 700, color: C.green, lineHeight: 1.2 }}>$1,374,610</div>
              <div style={{ fontFamily: F, fontSize: 9, color: C.grey, marginTop: 2 }}>Greenhouse CAPEX budgeted separately under S3</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3 }}>
              <div style={{ fontFamily: F, fontSize: 9, fontWeight: 700, color: C.grey, textTransform: "uppercase" }}>Western equiv.</div>
              <div style={{ fontFamily: F, fontSize: 12, fontWeight: 700, color: C.grey, textDecoration: "line-through" }}>$2,052,586</div>
              <div style={{ fontFamily: F, fontSize: 9, fontWeight: 700, color: C.green }}>Save ~$678K</div>
            </div>
          </div>

          {lineItems.map((li, i) => (
            <div key={i} style={{
              padding: "8px 14px", borderBottom: "1px solid rgba(30,107,140,0.09)",
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{ fontFamily: F, fontSize: 9, fontWeight: 600, color: C.grey, width: 45 }}>{li.ref}</span>
                <span style={{ fontFamily: F, fontSize: 11, fontWeight: 600, color: C.greyMd, paddingLeft: 8 }}>{li.desc}</span>
              </div>
              <span style={{ fontFamily: F, fontSize: 12, fontWeight: 700, color: C.amber, width: 100, textAlign: "right" }}>{li.val}</span>
            </div>
          ))}

          <div style={{ borderTop: "1px dashed rgba(30,107,140,0.3)", padding: "8px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={{ fontFamily: F, fontSize: 9, fontWeight: 600, color: C.grey, width: 45 }}>—</span>
              <span style={{ fontFamily: F, fontSize: 11, fontWeight: 700, color: C.white, paddingLeft: 8 }}>Base subtotal A1–A8</span>
            </div>
            <span style={{ fontFamily: F, fontSize: 13, fontWeight: 700, color: C.white, width: 100, textAlign: "right" }}>$883,880</span>
          </div>

          {[
            { ref: "+8%", desc: "Contingency", val: "$70,710" },
            { ref: "+20%", desc: "EPC overheads & margin", val: "$190,918" },
            { ref: "+20%", desc: "Developer markup", val: "$229,102" },
          ].map((m, i) => (
            <div key={i} style={{
              padding: "8px 14px", borderBottom: "1px solid rgba(30,107,140,0.09)",
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{ fontFamily: F, fontSize: 9, fontWeight: 600, color: C.grey, width: 45 }}>{m.ref}</span>
                <span style={{ fontFamily: F, fontSize: 11, fontWeight: 600, color: C.greyMd, paddingLeft: 8 }}>{m.desc}</span>
              </div>
              <span style={{ fontFamily: F, fontSize: 12, fontWeight: 700, color: C.amber, width: 100, textAlign: "right" }}>{m.val}</span>
            </div>
          ))}

          <div style={{ borderTop: `2px solid ${C.green}`, padding: "8px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={{ fontFamily: F, fontSize: 9, fontWeight: 600, color: C.grey, width: 45 }}>—</span>
              <span style={{ fontFamily: F, fontSize: 12, fontWeight: 700, color: C.white, paddingLeft: 8 }}>Total To CFI — Building</span>
            </div>
            <span style={{ fontFamily: F, fontSize: 20, fontWeight: 700, color: C.green, width: 120, textAlign: "right" }}>$1,374,610</span>
          </div>

          <div style={{
            padding: "10px 14px", borderTop: "1px solid rgba(30,107,140,0.2)",
            display: "flex", justifyContent: "center", cursor: "pointer",
            fontFamily: F, fontSize: 10, fontWeight: 600, color: C.teal2,
          }}>
            + View Detailed CAPEX Schedule — 41 Line Items
          </div>
        </>
      )}
    </div>
  );
}

/* ── Equipment CAPEX Card (Column 3) ── */
const efbEquip = [
  { code: "TR-EFB-101", desc: "EFB Truck Receiving Bay", val: "$8,000" },
  { code: "RH-EFB-101", desc: "EFB Hydraulic Reciprocating Feeder", val: "$15,000" },
  { code: "CV-EFB-101", desc: "EFB Apron Conveyor to Shredder", val: "$18,000" },
  { code: "SH-EFB-101", desc: "EFB Primary Shredder", val: "$45,000" },
  { code: "CV-EFB-102", desc: "Shredder Discharge Conveyor", val: "$8,000" },
  { code: "ML-EFB-101", desc: "EFB Hammer Mill (2mm)", val: "$35,000" },
  { code: "SC-EFB-101", desc: "EFB Vibrating Screen", val: "$12,000" },
  { code: "CV-EFB-103", desc: "Screen Undersize Conveyor", val: "$10,000" },
  { code: "CV-EFB-104", desc: "Screen Oversize Return", val: "$8,000" },
  { code: "BIN-EFB-201", desc: "EFB Buffer Storage Bin", val: "$25,000" },
];
const opdcEquip = [
  { code: "TR-OPDC-101", desc: "OPDC Receiving Bay", val: "$5,000" },
  { code: "RH-OPDC-101", desc: "OPDC Reciprocating Feeder", val: "$10,000" },
  { code: "CV-OPDC-101", desc: "OPDC Feed Conveyor", val: "$8,000" },
  { code: "BIN-OPDC-301", desc: "OPDC Buffer Bin", val: "$15,000" },
];
const posEquip = [
  { code: "DEC-SLD-101", desc: "POS 3-Phase Decanter", val: "RFQ $80K–$150K", rfq: true },
];
const sharedEquip = [
  { code: "S-LIME-01", desc: "Limestone Storage and Dosing", val: "$6,000" },
  { code: "V-LOADER-ROW-A-01", desc: "Wheel Loader — Duty", val: "$85,000" },
  { code: "V-LOADER-ROW-A-02", desc: "Wheel Loader — Standby", val: "$85,000" },
];

function EquipRow({ code, desc, val, rfq }) {
  return (
    <div style={{
      padding: "6px 14px", borderBottom: "1px solid rgba(30,107,140,0.09)",
      display: "flex", justifyContent: "space-between", alignItems: "center",
    }}>
      <div style={{ display: "flex", alignItems: "center", minWidth: 0, flex: 1 }}>
        <span style={{ fontFamily: F, fontSize: 8, fontWeight: 600, color: C.grey, width: 95, flexShrink: 0 }}>{code}</span>
        <span style={{ fontFamily: F, fontSize: 10, fontWeight: 500, color: C.greyMd, paddingLeft: 6, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{desc}</span>
      </div>
      <span style={{ fontFamily: F, fontSize: 11, fontWeight: 700, color: rfq ? C.red : C.amber, width: 110, textAlign: "right", flexShrink: 0 }}>{val}</span>
    </div>
  );
}

function EquipGroup({ title, subtotal, items }) {
  return (
    <>
      <div style={{
        padding: "7px 14px", background: "rgba(30,107,140,0.08)",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        borderBottom: "1px solid rgba(30,107,140,0.15)",
      }}>
        <span style={{ fontFamily: F, fontSize: 10, fontWeight: 700, color: C.teal2 }}>{title}</span>
        {subtotal && <span style={{ fontFamily: F, fontSize: 10, fontWeight: 700, color: C.amber }}>{subtotal}</span>}
      </div>
      {items.map((item, i) => <EquipRow key={i} {...item} />)}
    </>
  );
}

function EquipmentCapexCard({ forceOpen }) {
  const [open, setOpen] = useState(true);
  const isOpen = forceOpen !== undefined ? forceOpen : open;

  return (
    <div style={{ background: C.s1, border: `1.5px solid ${C.border}`, borderRadius: 8, overflow: "hidden" }}>
      <div onClick={() => setOpen(!open)} style={{
        background: C.s1, padding: "10px 14px", display: "flex", justifyContent: "space-between",
        alignItems: "center", borderBottom: "1px solid rgba(30,107,140,0.2)", cursor: "pointer", userSelect: "none",
      }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Pill letter="E" />
          <span style={{ fontFamily: F, fontSize: 13, fontWeight: 700, color: C.teal2 }}>Equipment CAPEX — S1 Only</span>
          <Tag text="Indonesian Rates" />
        </div>
        <Chevron open={isOpen} />
      </div>

      {isOpen && (
        <>
          <div style={{
            background: "rgba(61,203,122,0.05)", borderBottom: "1px solid rgba(30,107,140,0.2)",
            padding: "10px 14px",
          }}>
            <div style={{ fontFamily: F, fontSize: 9, fontWeight: 700, color: C.grey, textTransform: "uppercase", letterSpacing: "0.07em" }}>Total S1 Equipment</div>
            <div style={{ fontFamily: F, fontSize: 28, fontWeight: 700, color: C.green, lineHeight: 1.2 }}>$398,000</div>
            <div style={{ fontFamily: F, fontSize: 9, color: C.red, marginTop: 2 }}>POS decanter: RFQ $80K–$150K (not included)</div>
          </div>

          <EquipGroup title="EFB Line (10 items)" subtotal="$184,000" items={efbEquip} />
          <EquipGroup title="OPDC Line (5 items)" subtotal="$38,000" items={opdcEquip} />
          <EquipGroup title="POS Line (1 item)" subtotal="" items={posEquip} />
          <EquipGroup title="Shared (2 items)" subtotal="$176,000" items={sharedEquip} />

          <div style={{
            padding: "10px 14px", borderTop: "1px solid rgba(30,107,140,0.2)",
            display: "flex", justifyContent: "center", cursor: "pointer",
            fontFamily: F, fontSize: 10, fontWeight: 600, color: C.teal2,
          }}>
            + View Detailed Equipment Schedule — 18 Line Items
          </div>
        </>
      )}
    </div>
  );
}

/* ── Monthly OpEx Section ── */
const labourRows = [
  { role: "S1C EFB Line Operator", hc: 2, cost: "$949" },
  { role: "S1B OPDC Line Operator", hc: 2, cost: "$949" },
  { role: "Maintenance Technician", hc: 1, cost: "$570" },
  { role: "Quality and Gate Checker", hc: 1, cost: "$411" },
  { role: "S1 Shift Supervisor", hc: 1, cost: "$696" },
];
const elecRows = [
  { line: "S1C EFB Pre-Processing", cost: "$14,191" },
  { line: "S1B OPDC Pre-Processing", cost: "$6,651" },
  { line: "S1A POS Pre-Skimming", cost: "$1,806" },
];
const maintRows = [
  { cat: "Preventive Maintenance", cost: "$639" },
  { cat: "EFB Wear Parts", cost: "$271" },
  { cat: "OPDC Wear Parts", cost: "$167" },
  { cat: "Conveyor Maintenance", cost: "$367" },
  { cat: "Breakdown Repairs", cost: "$154" },
  { cat: "Electrical Repairs", cost: "$83" },
  { cat: "Filter Bags", cost: "$83" },
  { cat: "Hydraulic Oil", cost: "$33" },
  { cat: "Bearing Grease", cost: "$25" },
  { cat: "Water and Dust Suppression", cost: "$75" },
  { cat: "Administration", cost: "$833" },
  { cat: "Building Depreciation", cost: "$5,729" },
  { cat: "Equipment Depreciation", cost: "$2,774" },
  { cat: "Utilities Misc", cost: "$200" },
  { cat: "Transport and Logistics", cost: "$300" },
];

function OpexSubTable({ title, subtitle, total, headers, rows }) {
  return (
    <div style={{ background: C.s1, border: `1px solid rgba(30,107,140,0.25)`, borderRadius: 6, overflow: "hidden", flex: 1, minWidth: 0 }}>
      <div style={{ padding: "8px 12px", borderBottom: "1px solid rgba(30,107,140,0.2)", background: "rgba(30,107,140,0.06)" }}>
        <div style={{ fontFamily: F, fontSize: 11, fontWeight: 700, color: C.teal2 }}>{title}</div>
        <div style={{ fontFamily: F, fontSize: 16, fontWeight: 700, color: C.amber }}>{total}</div>
        {subtitle && <div style={{ fontFamily: F, fontSize: 8, color: C.grey, marginTop: 2 }}>{subtitle}</div>}
      </div>
      <div style={{ padding: "4px 12px 2px", display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(30,107,140,0.12)" }}>
        {headers.map((h, i) => (
          <span key={i} style={{ fontFamily: F, fontSize: 8, fontWeight: 700, color: C.grey, textTransform: "uppercase", flex: h.flex || 1, textAlign: h.align || "left" }}>{h.label}</span>
        ))}
      </div>
      {rows}
    </div>
  );
}

function MonthlyOpexSection({ forceOpen }) {
  const [open, setOpen] = useState(true);
  const isOpen = forceOpen !== undefined ? forceOpen : open;

  return (
    <div style={{ background: C.s1, border: `1.5px solid ${C.border}`, borderRadius: 8, overflow: "hidden", marginTop: 10 }}>
      <div onClick={() => setOpen(!open)} style={{
        padding: "10px 14px", display: "flex", justifyContent: "space-between",
        alignItems: "center", borderBottom: "1px solid rgba(30,107,140,0.2)", cursor: "pointer", userSelect: "none",
      }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Pill letter="O" />
          <span style={{ fontFamily: F, fontSize: 13, fontWeight: 700, color: C.teal2 }}>S1 Monthly Operating Expenditure</span>
          <span style={{ fontFamily: F, fontSize: 13, fontWeight: 700, color: C.amber }}>— $37,957/mo</span>
        </div>
        <Chevron open={isOpen} />
      </div>

      {isOpen && (
        <div style={{ padding: "10px 14px", display: "flex", gap: 10 }}>
          {/* Labour */}
          <OpexSubTable
            title="Labour"
            total="$3,576/mo"
            subtitle="7 headcount"
            headers={[{ label: "Role", flex: 3 }, { label: "HC", flex: 0.5, align: "center" }, { label: "Monthly USD", flex: 1.2, align: "right" }]}
            rows={labourRows.map((r, i) => (
              <div key={i} style={{ padding: "4px 12px", display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(30,107,140,0.06)" }}>
                <span style={{ fontFamily: F, fontSize: 9, color: C.greyMd, flex: 3 }}>{r.role}</span>
                <span style={{ fontFamily: F, fontSize: 9, fontWeight: 700, color: C.white, flex: 0.5, textAlign: "center" }}>{r.hc}</span>
                <span style={{ fontFamily: F, fontSize: 9, fontWeight: 700, color: C.amber, flex: 1.2, textAlign: "right" }}>{r.cost}</span>
              </div>
            ))}
          />

          {/* Electricity */}
          <OpexSubTable
            title="Electricity"
            total="$22,648/mo"
            subtitle="PLN I-3 tariff · IDR 1,444.70/kWh"
            headers={[{ label: "Line", flex: 3 }, { label: "Monthly USD", flex: 1.2, align: "right" }]}
            rows={elecRows.map((r, i) => (
              <div key={i} style={{ padding: "4px 12px", display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(30,107,140,0.06)" }}>
                <span style={{ fontFamily: F, fontSize: 9, color: C.greyMd, flex: 3 }}>{r.line}</span>
                <span style={{ fontFamily: F, fontSize: 9, fontWeight: 700, color: C.amber, flex: 1.2, textAlign: "right" }}>{r.cost}</span>
              </div>
            ))}
          />

          {/* Maintenance */}
          <OpexSubTable
            title="Maintenance and Other"
            total="$11,733/mo"
            headers={[{ label: "Category", flex: 3 }, { label: "Monthly USD", flex: 1.2, align: "right" }]}
            rows={
              <div style={{ maxHeight: 260, overflowY: "auto" }}>
                {maintRows.map((r, i) => (
                  <div key={i} style={{ padding: "3px 12px", display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(30,107,140,0.06)" }}>
                    <span style={{ fontFamily: F, fontSize: 9, color: C.greyMd, flex: 3 }}>{r.cat}</span>
                    <span style={{ fontFamily: F, fontSize: 9, fontWeight: 700, color: C.amber, flex: 1.2, textAlign: "right" }}>{r.cost}</span>
                  </div>
                ))}
              </div>
            }
          />
        </div>
      )}
    </div>
  );
}

/* ══════════════ MAIN PAGE ══════════════ */
export default function S1CapexOpex() {
  const [expandAll, setExpandAll] = useState(false);
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: F, color: C.white, background: C.bg, minHeight: "100vh" }}>
      <style>{`@keyframes cfi-pulse { 0%{opacity:1} 50%{opacity:0.3} 100%{opacity:1} }`}</style>

      {/* ── GLOBAL HEADER ── */}
      <div style={{
        background: "#0A1628", height: 83, display: "flex", alignItems: "center",
        padding: "0 32px", borderBottom: "1px solid rgba(51, 212, 188, 0.15)",
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

      <div style={{ height: 83 }} />

      {/* ── Back to S1 Master ── */}
      <div style={{ background: C.s1, padding: "8px 20px", fontFamily: F, borderBottom: "1px solid rgba(30,107,140,0.15)" }}>
        <a href="/s1-index" style={{ color: "#33D4BC", fontSize: 12, fontWeight: 600, textDecoration: "none", fontFamily: F }}
          onMouseEnter={e => e.currentTarget.style.opacity = 0.7} onMouseLeave={e => e.currentTarget.style.opacity = 1}>
          ← S1 Master Index
        </a>
      </div>

      {/* ── CONTEXT BAR / BREADCRUMB ── */}
      <div style={{
        background: C.s1, borderBottom: "1px solid rgba(30,107,140,0.25)",
        padding: "6px 20px", display: "flex", justifyContent: "space-between", alignItems: "center",
        fontFamily: F, fontSize: 9,
      }}>
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          <a href="/" style={{ color: C.teal2, fontWeight: 700, textDecoration: "none", fontFamily: F, fontSize: 9 }}
            onMouseEnter={e => e.currentTarget.style.opacity = 0.7} onMouseLeave={e => e.currentTarget.style.opacity = 1}>CFI Platform</a>
          <span style={{ color: "rgba(30,107,140,0.5)" }}> › </span>
          <a href="/" style={{ color: C.grey, textDecoration: "none", fontFamily: F, fontSize: 9 }}
            onMouseEnter={e => e.currentTarget.style.opacity = 0.7} onMouseLeave={e => e.currentTarget.style.opacity = 1}>S0 Mill Config</a>
          <span style={{ color: "rgba(30,107,140,0.5)" }}> › </span>
          <span style={{ color: C.teal2, fontWeight: 700 }}>S1 Pre-Processing</span>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <span style={{ color: C.grey }}>Mill: </span>
          <span style={{ color: C.teal2, fontWeight: 700 }}>Bogor Test Mill</span>
          <span style={{ color: "rgba(30,107,140,0.5)" }}> · </span>
          <span style={{ color: C.grey }}>FFB: </span>
          <span style={{ color: C.teal2, fontWeight: 700 }}>60 TPH</span>
          <span style={{ color: C.grey }}> · Active: </span>
          <div style={{ display: "flex", gap: 6 }}>
            <Tag text="EFB" />
            <Tag text="OPDC" />
            <Tag text="POS — ICP-OES Pending" color={C.red} />
          </div>
        </div>
        <span style={{ fontFamily: F, fontSize: 9, color: C.grey }}>S1 Rev 01 · March 2026</span>
      </div>

      {/* ── PAGE HEADER ── */}
      <div style={{
        background: C.s1, borderBottom: "1px solid rgba(30,107,140,0.2)",
        padding: "11px 20px", display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Pill letter="S1" />
          <span style={{ fontFamily: F, fontSize: 16, fontWeight: 700, color: C.teal2, marginLeft: 6 }}>
            Pre-Processing — CAPEX · OPEX · Facility
          </span>
        </div>
        <div style={{ display: "flex", gap: 5 }}>
          {[
            { label: "↗ Site Plan", c: "rgba(0,201,177,", tc: C.teal, onClick: () => navigate("/s1-combined") },
            { label: "↗ Architecture", c: "rgba(155,89,182,", tc: "#c090ff", onClick: () => toast("Architecture view coming soon", { duration: 2000 }) },
            { label: expandAll ? "Collapse All" : "Expand All", c: "rgba(245,166,35,", tc: C.amber, onClick: () => setExpandAll(!expandAll) },
          ].map((b, i) => (
            <button key={i} onClick={b.onClick} style={{
              fontFamily: F, fontSize: 10, fontWeight: 700, padding: "5px 11px", borderRadius: 4,
              height: 28, cursor: "pointer", transition: "all 0.2s ease",
              border: `1px solid ${b.c}0.4)`, color: b.tc, background: `${b.c}0.07)`,
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `${b.c}0.6)`; e.currentTarget.style.background = `${b.c}0.12)`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = `${b.c}0.4)`; e.currentTarget.style.background = `${b.c}0.07)`; }}
            >{b.label}</button>
          ))}
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div style={{ padding: "0 20px 20px", maxWidth: 1400, margin: "0 auto" }}>
        <KpiStrip />

        {/* 3-col layout */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          <SiteFacilityCard forceOpen={expandAll ? true : undefined} navigate={navigate} />
          <BuildingCapexCard forceOpen={expandAll ? true : undefined} />
          <EquipmentCapexCard forceOpen={expandAll ? true : undefined} />
        </div>

        {/* Monthly OpEx full-width */}
        <MonthlyOpexSection forceOpen={expandAll ? true : undefined} />
      </div>
    </div>
  );
}
