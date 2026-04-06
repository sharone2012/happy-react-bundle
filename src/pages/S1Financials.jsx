import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  C, Fnt, S1_CSS, S0Header, S1Breadcrumb,
} from "../components/S1Shared";

// ── BUILDING CAPEX A1–A8 (base $883,880) ──
const BUILDING_CAPEX = [
  { ref: "A1", name: "Site works — clearing, earthworks, drainage", cost: 79540 },
  { ref: "A2", name: "Civil & concrete — slabs, hoppers, bays",     cost: 105900 },
  { ref: "A3", name: "Structural steel — PEB, cladding, platforms", cost: 336790 },
  { ref: "A4", name: "Welfare fit-out — fixtures & finishes",       cost: 107650 },
  { ref: "A5", name: "MEP — power & lighting (500 kVA transformer)", cost: 140000 },
  { ref: "A6", name: "MEP — HVAC & ventilation",                    cost: 28000  },
  { ref: "A7", name: "Plumbing & drainage",                         cost: 42000  },
  { ref: "A8", name: "Process building items (platforms, stairs)",  cost: 44000  },
];

const BASE_BUILDING    = BUILDING_CAPEX.reduce((s, r) => s + r.cost, 0); // 883,880
const TOTAL_BUILDING   = 1374610;  // Base → +8% Contingency → +20% EPC → +20% Dev markup

// ── EQUIPMENT CAPEX ──
const EQUIP_EFB = [
  { item: "AF-01 Hydraulic Feeder",           cost: 15000 },
  { item: "BC-01/02 Incline Conveyor 600mm",  cost: 18000 },
  { item: "TR-2060 Trommel Screen",           cost: 8000  },
  { item: "SD-01 Primary Shredder",           cost: 45000 },
  { item: "HM-01 Hammer Mill",               cost: 35000 },
  { item: "VS-01 Vibrating Screen",           cost: 12000 },
  { item: "BIN-EFB-01 Buffer Bin 50m³",       cost: 25000 },
];
const EQUIP_OPDC = [
  { item: "SF-01 Reciprocating Feeder",         cost: 10000 },
  { item: "BC-10/11 Incline Conveyor 500mm",    cost: 8000  },
  { item: "TR-OPDC-01 Trommel Screen",          cost: 5000  },
  { item: "BIN-OPDC-24HR Buffer Bin 85m³",      cost: 15000 },
];
const EQUIP_SHARED = [
  { item: "Limestone Dosing Station",           cost: 6000  },
  { item: "2× Wheel Loaders (2 × $85K)",        cost: 170000 },
];
const TOTAL_EQUIP =
  EQUIP_EFB.reduce((s,r)=>s+r.cost,0) +
  EQUIP_OPDC.reduce((s,r)=>s+r.cost,0) +
  EQUIP_SHARED.reduce((s,r)=>s+r.cost,0); // 372,000

// ── OPEX ──
const LABOUR_ITEMS = [
  { role: "Plant Operator (×2)",       wage: 800  },
  { role: "Equipment Tech (×1)",       wage: 900  },
  { role: "Lab Technician (×1)",       wage: 700  },
  { role: "Logistics / Loader Op (×1)", wage: 550 },
  { role: "Supervisor (×1)",           wage: 826  },
];
const LABOUR_TOTAL = 3576;

const ELECTRICITY_ITEMS = [
  { line: "S1C EFB line",  kw: 298, monthly: 14191 },
  { line: "S1B OPDC line", kw: 206, monthly: 6651  },
  { line: "S1A POS line",  kw: 62,  monthly: 1806  },
];
const ELECTRICITY_TOTAL = 22648;

const MAINTENANCE_ITEMS = [
  { item: "Equipment maintenance (est. 3% CAPEX/yr ÷12)", monthly: 9300 },
  { item: "Repairs & spare parts contingency",            monthly: 1800 },
  { item: "Consumables (filter bags, oils, belts)",       monthly: 633  },
];
const MAINTENANCE_TOTAL = 11733;
const OPEX_TOTAL = LABOUR_TOTAL + ELECTRICITY_TOTAL + MAINTENANCE_TOTAL; // 37,957

// ── SITE METRICS ──
const SITE_METRICS = [
  { label: "Total Site Area",      val: "5,000 m²",   note: "1.25 acres recommended"              },
  { label: "Building Footprint",   val: "1,260 m²",   note: "36m × 35m × 10m ht · PEB steel"    },
  { label: "Greenhouse Block",     val: "1,920 m²",   note: "4 × 40×8m · 2 rows × 2 cols"       },
  { label: "Truck Receiving Bay",  val: "216 m²",     note: "18m × 12m × 4m ht"                  },
  { label: "Conveyor Gallery",     val: "100 m²",     note: "25m × 4m · covered · +0.5m"         },
  { label: "Outside Space",        val: "2,504 m²",   note: "Roads, service lane, silos, workshop" },
  { label: "Greenhouse Site",      val: "98m × 85m",  note: "2 rows × 2 cols, 6m central access" },
  { label: "Portal Frames",        val: "7",          note: "@ 6m spacing · ASTM A36 PEB"         },
];

// ── DETAILED CAPEX SCHEDULE (41-line indicative) ──
const CAPEX_SCHEDULE = [
  {
    ref: "A1", name: "Site Works — Clearing, Earthworks & Drainage",
    total: 79540, color: C.teal,
    items: [
      { desc: "Site clearance & scrub/vegetation removal",       cost: 8000  },
      { desc: "Cut & fill earthworks + disposal",                cost: 22000 },
      { desc: "Compaction & sub-base preparation",               cost: 11000 },
      { desc: "Site drainage channels (perimeter)",              cost: 10000 },
      { desc: "Storm sumps & retention",                         cost: 4000  },
      { desc: "Access road (compacted laterite + kerbing)",      cost: 12000 },
      { desc: "External POME drainage line (200mm HDPE)",        cost: 8540  },
      { desc: "Transformer pad & MV pole base",                  cost: 4000  },
    ],
  },
  {
    ref: "A2", name: "Civil & Concrete — Slabs, Hoppers & Bays",
    total: 105900, color: C.teal,
    items: [
      { desc: "Main production slab (150mm C25)",                cost: 28000 },
      { desc: "Thickened pads for equipment foundations",        cost: 18000 },
      { desc: "Vibration-isolated machinery foundations",        cost: 8000  },
      { desc: "EFB hopper base & pit",                           cost: 8900  },
      { desc: "OPDC hopper wing wall",                           cost: 5700  },
      { desc: "2× Neutralisation bays (lined)",                  cost: 9000  },
      { desc: "2× Truck ramps (1:8 grade, reinforced)",          cost: 8000  },
      { desc: "Platform foundations (elevated conveyors)",       cost: 6000  },
      { desc: "POME collection sumps (×3)",                      cost: 7500  },
      { desc: "Floor drains & wash-down system",                 cost: 4500  },
      { desc: "Kerbing, hardstand & wheel-wash apron",           cost: 2300  },
    ],
  },
  {
    ref: "A3", name: "Structural Steel — PEB, Cladding & Platforms",
    total: 336790, color: C.amber,
    items: [
      { desc: "PEB Stage 1 — 36×35×10m main hall",              cost: 95000 },
      { desc: "PEB Stage 2 — 20×20×8m secondary bay",           cost: 32000 },
      { desc: "Neutralisation bay roof (poly-carbonate)",        cost: 12000 },
      { desc: "18×12×4m truck bay canopy",                       cost: 22000 },
      { desc: "Insulated roof cladding — Stage 1",               cost: 38000 },
      { desc: "Insulated wall cladding — Stage 1",               cost: 29000 },
      { desc: "Stage 2 roof cladding (Gauge 28 corrugated)",     cost: 18000 },
      { desc: "Covered conveyor gallery — 25×4m",               cost: 16000 },
      { desc: "Equipment access platforms & mezzanines",         cost: 32000 },
      { desc: "Internal stairways (×4, checker plate)",          cost: 12790 },
      { desc: "Lean-to storage / locker bays",                   cost: 18000 },
      { desc: "Structural anchors, baseplates & grouting",       cost: 12000 },
    ],
  },
  {
    ref: "A4", name: "Welfare Fit-Out — Fixtures & Finishes",
    total: 107650, color: C.blue,
    items: [
      { desc: "Office partitions, glazing & doors",              cost: 22000 },
      { desc: "Toilets & ablution blocks (male/female)",         cost: 18000 },
      { desc: "Quality control laboratory fit-out",              cost: 28000 },
      { desc: "Staff canteen, kitchen & utilities",              cost: 16000 },
      { desc: "Security guardhouse & boom gate",                 cost: 8000  },
      { desc: "Floor finishes, painting & signage",              cost: 15650 },
    ],
  },
  {
    ref: "A5", name: "MEP — Power & Lighting (500 kVA Transformer)",
    total: 140000, color: C.amber,
    items: [
      { desc: "500 kVA dry-type transformer (TNB/PLN tariff)",   cost: 45000 },
      { desc: "MV/LV switchboard + MCC panel",                  cost: 28000 },
      { desc: "Power distribution cabling & conduit",            cost: 22000 },
      { desc: "LED industrial luminaires (high-bay + strip)",    cost: 18000 },
      { desc: "Emergency lighting & exit signage",               cost: 8000  },
      { desc: "Earthing network & lightning protection",         cost: 10000 },
      { desc: "Power factor correction bank",                    cost: 9000  },
    ],
  },
  {
    ref: "A6", name: "MEP — HVAC & Ventilation",
    total: 28000, color: C.blue,
    items: [
      { desc: "Exhaust fans ≥300mm (×8, SS duty)",               cost: 14000 },
      { desc: "Air handling units — office/lab (×2)",            cost: 8000  },
      { desc: "Ductwork, dampers & louvres",                     cost: 6000  },
    ],
  },
  {
    ref: "A7", name: "Plumbing & Drainage",
    total: 42000, color: C.blue,
    items: [
      { desc: "Internal stormwater drainage (HDPE 100mm)",       cost: 12000 },
      { desc: "Sewer & sanitary drainage lines",                 cost: 8000  },
      { desc: "Process water reticulation (wash-down)",          cost: 10000 },
      { desc: "Fire hose reels & dry riser",                     cost: 7000  },
      { desc: "POME sump pump & discharge (IP65)",               cost: 5000  },
    ],
  },
  {
    ref: "A8", name: "Process Building Items — Platforms & Stairs",
    total: 44000, color: C.grey,
    items: [
      { desc: "Equipment access platforms (elevated)",           cost: 18000 },
      { desc: "Safety guardrails — all elevated levels",         cost: 12000 },
      { desc: "Safety signage, labelling & MSDS stations",       cost: 4000  },
      { desc: "Sundry structural & miscellaneous items",         cost: 10000 },
    ],
  },
];

// ── FORMATTERS ──
const fmt = (n) =>
  "$" + n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

// ── COLLAPSIBLE OPEX ROW ──
function OpexSection({ title, total, totalColor = C.amber, children, open, onToggle }) {
  return (
    <div style={{ borderBottom: `1px solid ${C.bdrIdle}` }}>
      {/* Header — always visible with total */}
      <div
        onClick={onToggle}
        style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "13px 18px", cursor: "pointer",
          background: open ? "rgba(255,255,255,0.03)" : "transparent",
          transition: "background .15s",
          userSelect: "none",
        }}
      >
        <span style={{
          fontFamily: Fnt.mono, fontSize: 10, fontWeight: 700,
          color: open ? C.teal : C.grey,
          transition: "color .15s",
          minWidth: 14,
        }}>
          {open ? "▾" : "▸"}
        </span>
        <span style={{ flex: 1, fontFamily: Fnt.syne, fontWeight: 700, fontSize: 13, color: C.white }}>
          {title}
        </span>
        {/* Total always shown */}
        <span style={{
          fontFamily: Fnt.mono, fontWeight: 700, fontSize: 15,
          color: totalColor,
          background: `${totalColor}18`,
          padding: "3px 10px", borderRadius: 6,
        }}>
          {fmt(total)}<span style={{ fontFamily: Fnt.dm, fontSize: 10, color: C.grey, fontWeight: 400, marginLeft: 4 }}>/mo</span>
        </span>
      </div>
      {/* Body — only when expanded */}
      {open && (
        <div style={{ padding: "0 18px 14px 44px" }}>
          {children}
        </div>
      )}
    </div>
  );
}

// ── MODAL ──
function CapexScheduleModal({ onClose }) {
  const total = CAPEX_SCHEDULE.reduce((s, g) => s + g.total, 0);

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 9000,
        background: "rgba(4,9,20,0.82)",
        backdropFilter: "blur(4px)",
        display: "flex", alignItems: "flex-start", justifyContent: "center",
        padding: "40px 16px 24px",
        overflowY: "auto",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        width: "100%", maxWidth: 860,
        background: C.navyMid,
        border: `1.5px solid ${C.border}`,
        borderRadius: 14,
        overflow: "hidden",
        boxShadow: "0 24px 64px rgba(0,0,0,.8)",
      }}>
        {/* Modal header */}
        <div style={{
          padding: "20px 24px",
          background: C.navyDeep,
          borderBottom: `1.5px solid ${C.border}`,
          display: "flex", alignItems: "center", gap: 14,
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 8,
            background: `${C.amber}22`, border: `1px solid ${C.amber}55`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, flexShrink: 0,
          }}>📋</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: Fnt.syne, fontWeight: 700, fontSize: 16, color: C.white }}>
              Detailed CAPEX Schedule — Building Works
            </div>
            <div style={{ fontFamily: Fnt.dm, fontSize: 11, color: C.grey, marginTop: 2 }}>
              A1–A8 · 8 packages · Base {fmt(BASE_BUILDING)} · Indicative sub-items
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: Fnt.mono, fontWeight: 700, fontSize: 18, color: C.amber }}>{fmt(total)}</div>
            <div style={{ fontFamily: Fnt.dm, fontSize: 10, color: C.grey }}>base cost</div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.06)",
              border: `1px solid ${C.bdrIdle}`,
              borderRadius: 6, width: 32, height: 32,
              color: C.grey, cursor: "pointer", fontSize: 16,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, lineHeight: 1,
            }}
          >×</button>
        </div>

        {/* Disclaimer banner */}
        <div style={{
          padding: "8px 24px",
          background: "rgba(245,166,35,0.07)",
          borderBottom: `1px solid rgba(245,166,35,0.25)`,
          fontFamily: Fnt.dm, fontSize: 11, color: C.amber,
        }}>
          ⚠ Sub-items are indicative estimates derived from package totals. Final BoQ from quantity surveyor.
        </div>

        {/* Schedule groups */}
        <div style={{ padding: "0 0 8px" }}>
          {CAPEX_SCHEDULE.map((grp) => (
            <CapexGroup key={grp.ref} grp={grp} />
          ))}
        </div>

        {/* Footer totals */}
        <div style={{
          padding: "16px 24px",
          background: C.navyDeep,
          borderTop: `1.5px solid ${C.border}`,
          display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
          gap: 12,
        }}>
          <div>
            <div style={{ fontFamily: Fnt.dm, fontSize: 10, fontWeight: 700, color: C.grey, textTransform: "uppercase", letterSpacing: ".04em", marginBottom: 4 }}>
              Base (before markup)
            </div>
            <div style={{ fontFamily: Fnt.mono, fontWeight: 700, fontSize: 16, color: C.white }}>{fmt(BASE_BUILDING)}</div>
          </div>
          <div>
            <div style={{ fontFamily: Fnt.dm, fontSize: 10, fontWeight: 700, color: C.grey, textTransform: "uppercase", letterSpacing: ".04em", marginBottom: 4 }}>
              +8% Contingency → +20% EPC → +20% Dev
            </div>
            <div style={{ fontFamily: Fnt.mono, fontWeight: 700, fontSize: 16, color: C.amber }}>
              {fmt(TOTAL_BUILDING)}
            </div>
          </div>
          <div>
            <div style={{ fontFamily: Fnt.dm, fontSize: 10, fontWeight: 700, color: C.grey, textTransform: "uppercase", letterSpacing: ".04em", marginBottom: 4 }}>
              Save vs Western comparable
            </div>
            <div style={{ fontFamily: Fnt.mono, fontWeight: 700, fontSize: 16, color: C.green }}>~$678K</div>
          </div>
        </div>

        {/* Modal action bar */}
        <div style={{
          padding: "14px 24px",
          borderTop: `1px solid ${C.bdrIdle}`,
          display: "flex", justifyContent: "flex-end", gap: 10,
        }}>
          <button
            onClick={() => window.print()}
            style={{
              padding: "8px 18px",
              background: "rgba(255,255,255,0.06)",
              border: `1px solid ${C.bdrIdle}`,
              borderRadius: 7, color: C.grey,
              fontFamily: Fnt.dm, fontSize: 12, fontWeight: 600,
              cursor: "pointer",
            }}
          >
            🖨 Print / Export PDF
          </button>
          <button
            onClick={onClose}
            style={{
              padding: "8px 20px",
              background: C.teal, border: "none",
              borderRadius: 7, color: C.navy,
              fontFamily: Fnt.syne, fontSize: 12, fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function CapexGroup({ grp }) {
  const [open, setOpen] = useState(false);
  const lineTotal = grp.items.reduce((s, i) => s + i.cost, 0);
  return (
    <div style={{ borderBottom: `1px solid ${C.bdrIdle}` }}>
      <div
        onClick={() => setOpen(!open)}
        style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "12px 24px", cursor: "pointer",
          background: open ? "rgba(255,255,255,0.025)" : "transparent",
          transition: "background .15s",
        }}
      >
        <span style={{
          fontFamily: Fnt.mono, fontWeight: 700, fontSize: 11,
          color: grp.color, minWidth: 22,
        }}>{grp.ref}</span>
        <span style={{ flex: 1, fontFamily: Fnt.dm, fontSize: 12, fontWeight: 600, color: C.white }}>
          {grp.name}
        </span>
        <span style={{ fontFamily: Fnt.mono, fontWeight: 700, fontSize: 13, color: C.amber }}>
          {fmt(grp.total)}
        </span>
        <span style={{ fontFamily: Fnt.mono, fontSize: 10, color: C.grey, minWidth: 14 }}>
          {open ? "▾" : "▸"}
        </span>
      </div>
      {open && (
        <div style={{ padding: "0 24px 10px 60px" }}>
          {grp.items.map((it, i) => (
            <div key={i} style={{
              display: "flex", justifyContent: "space-between",
              alignItems: "center", padding: "5px 0",
              borderBottom: i < grp.items.length - 1 ? `1px solid rgba(255,255,255,0.04)` : "none",
            }}>
              <span style={{ fontFamily: Fnt.dm, fontSize: 11, color: C.grey }}>
                {it.desc}
              </span>
              <span style={{ fontFamily: Fnt.mono, fontWeight: 700, fontSize: 12, color: C.white, flexShrink: 0, marginLeft: 16 }}>
                {fmt(it.cost)}
              </span>
            </div>
          ))}
          {lineTotal !== grp.total && (
            <div style={{ display: "flex", justifyContent: "space-between", padding: "7px 0 0", borderTop: `1px dashed ${C.bdrIdle}`, marginTop: 2 }}>
              <span style={{ fontFamily: Fnt.dm, fontSize: 10, fontWeight: 700, color: C.grey, textTransform: "uppercase" }}>Subtotal</span>
              <span style={{ fontFamily: Fnt.mono, fontWeight: 700, fontSize: 12, color: C.amber }}>{fmt(grp.total)}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── MAIN PAGE ──
// ── MetricCard helper ──
function MetricCard({ m }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column",
      padding: "8px 10px",
      background: "rgba(255,255,255,0.025)",
      borderRadius: 6,
      borderLeft: `3px solid ${C.teal}44`,
    }}>
      <span style={{ fontFamily: Fnt.dm, fontWeight: 700, fontSize: 10, color: C.grey, textTransform: "uppercase", letterSpacing: ".04em" }}>
        {m.label}
      </span>
      <span style={{ fontFamily: Fnt.mono, fontWeight: 700, fontSize: 13, color: C.teal, margin: "2px 0" }}>
        {m.val}
      </span>
      <span style={{ fontFamily: Fnt.dm, fontSize: 10, color: C.greyLt }}>
        {m.note}
      </span>
    </div>
  );
}

const DESIGN_DRAWINGS = [
  { title: "Site Master Plan",       sub: "98m × 85m · All zones · North arrow",           route: "#" },
  { title: "Building Architecture",  sub: "Floor · Elevation · Section · 3D · Machinery",  route: "#" },
  { title: "Building Floor Plan",    sub: "36×35m · All machines ①–② · Legend",           route: "#" },
  { title: "Greenhouse Design",      sub: "Site plan · Section XX · Store",                 route: "#" },
  { title: "EFB Floor Plan",         sub: "①–② · 20 t/h · 10 machines · 600mm belt",      route: "/s1/efb" },
  { title: "OPDC Floor Plan",        sub: "①–② · 5 t/h · CLASS A gate",                   route: "/s1/opdc" },
  { title: "EFB ASCII Flow",         sub: "Step-by-step · machines · specs · gates",        route: "/s1/efb" },
  { title: "OPDC ASCII Flow",        sub: "Step-by-step · CLASS A gate · 24h dwell",        route: "/s1/opdc" },
  { title: "POS ASCII Flow",         sub: "ICP-OES Fe gate · decanter · inclusion rate",   route: "/s1/pos" },
];

export default function S1Financials() {
  const nav = useNavigate();
  const [modalOpen, setModalOpen]   = useState(false);
  const [siteOpen, setSiteOpen]     = useState(false);
  const [opexSects, setOpexSects]   = useState({ labour: false, electricity: false, maintenance: false });

  const toggleOpex = (key) =>
    setOpexSects((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <>
      <style>{S1_CSS}</style>
      {modalOpen && <CapexScheduleModal onClose={() => setModalOpen(false)} />}

      {/* STAGE HEADER */}
      <div className="stage-hdr">
        <div className="stage-badge">
          <div className="stage-num" style={{ fontSize: 12 }}>CAP</div>
          <div>
            <div className="stage-title">Financials — CAPEX &amp; OPEX</div>
            <div className="stage-sub">S1 Mechanical Pre-Processing · Capital &amp; Operating Cost Summary · v1.0 Apr 2026</div>
          </div>
        </div>
        <div className="stage-hdr-right">
          <span className="bdg bdg-a">Building {fmt(TOTAL_BUILDING)}</span>
          <span className="bdg bdg-b">Equipment {fmt(TOTAL_EQUIP)}</span>
          <span className="bdg bdg-t">OpEx {fmt(OPEX_TOTAL)}/mo</span>
        </div>
      </div>

      <S1Breadcrumb />

      {/* ── KPI TICKER STRIP ── */}
      <div style={{
        display: "flex", gap: 0, background: C.navyDeep,
        borderBottom: `1px solid ${C.border}`,
        overflowX: "auto", scrollbarWidth: "none",
      }}>
        {[
          { lbl: "Building CAPEX",   val: fmt(TOTAL_BUILDING), color: C.amber },
          { lbl: "Equipment CAPEX",  val: fmt(TOTAL_EQUIP),    color: C.blue  },
          { lbl: "Total CAPEX",      val: fmt(TOTAL_BUILDING + TOTAL_EQUIP), color: C.white },
          { lbl: "Labour OpEx",      val: fmt(LABOUR_TOTAL) + "/mo",         color: C.amber },
          { lbl: "Electricity OpEx", val: fmt(ELECTRICITY_TOTAL) + "/mo",    color: C.green },
          { lbl: "Total Monthly OpEx", val: fmt(OPEX_TOTAL) + "/mo",         color: C.amber },
          { lbl: "Site Area",        val: "5,000 m²",                        color: C.teal  },
        ].map((k, i) => (
          <div key={i} style={{
            display: "flex", flexDirection: "column", alignItems: "flex-start",
            padding: "10px 20px",
            borderRight: `1px solid ${C.bdrIdle}`,
            flexShrink: 0,
          }}>
            <div style={{ fontFamily: Fnt.dm, fontWeight: 700, fontSize: 9, color: C.grey, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 4 }}>
              {k.lbl}
            </div>
            <div style={{ fontFamily: Fnt.mono, fontWeight: 700, fontSize: 14, color: k.color, whiteSpace: "nowrap" }}>
              {k.val}
            </div>
          </div>
        ))}
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="content">
        {/* ── 3-PANEL GRID ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr 1.4fr", gap: 20, alignItems: "start" }}>

          {/* ── PANEL M: SITE METRICS ── */}
          <div style={{ background: C.navyCard, border: `1.5px solid ${C.bdrIdle}`, borderRadius: 11, overflow: "hidden" }}>

            {/* ── Title row — collapsible, Lab Analysis style ── */}
            <div
              onClick={() => setSiteOpen(o => !o)}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,201,177,0.09)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(0,201,177,0.048)"; }}
              style={{
                padding: "13px 16px",
                background: "rgba(0,201,177,0.048)",
                borderBottom: `1px solid ${C.teal}22`,
                display: "flex", alignItems: "center", gap: 10,
                cursor: "pointer",
                transition: "background 0.15s ease",
              }}
            >
              {/* Chevron */}
              <span style={{
                fontSize: 22,
                color: siteOpen ? "#F5A623" : "#FFFFFF",
                transform: siteOpen ? "rotate(90deg)" : "rotate(0deg)",
                transition: "transform 0.2s ease, color 0.15s ease",
                display: "inline-block",
                lineHeight: 1,
                flexShrink: 0,
              }}>›</span>
              {/* Badge */}
              <span style={{ fontFamily: Fnt.mono, fontWeight: 700, fontSize: 13, color: C.teal, flexShrink: 0 }}>M</span>
              {/* Label */}
              <span style={{ fontFamily: Fnt.syne, fontWeight: 700, fontSize: 13, color: C.white, flex: 1 }}>
                Site &amp; Facility Metrics
              </span>
              {/* Scope badge + toggle */}
              <div style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "3px 9px", borderRadius: 5,
                background: `${C.teal}18`,
                border: `1px solid ${C.teal}44`,
                fontFamily: Fnt.mono, fontSize: 9, fontWeight: 700, color: C.teal,
                whiteSpace: "nowrap", flexShrink: 0,
              }}>
                S1 Building Only
                <span style={{ marginLeft: 4, color: siteOpen ? "#F5A623" : C.teal, fontSize: 11, transition: "color 0.15s" }}>
                  {siteOpen ? "▲" : "▼"}
                </span>
              </div>
            </div>

            {/* ── Metrics body ── */}
            <div style={{ padding: "12px 14px 6px" }}>
              {/* Always-visible first 2 metrics */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 6 }}>
                {SITE_METRICS.slice(0, 2).map((m, i) => (
                  <MetricCard key={i} m={m} />
                ))}
              </div>

              {/* Expanded metrics */}
              {siteOpen && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 6 }}>
                  {SITE_METRICS.slice(2).map((m, i) => (
                    <MetricCard key={i} m={m} />
                  ))}
                </div>
              )}

              {/* ▼ More / ▲ Less toggle row */}
              <div
                onClick={() => setSiteOpen(o => !o)}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "7px 10px",
                  borderTop: "1px solid rgba(51,212,188,0.10)",
                  background: "rgba(0,0,0,0.15)",
                  borderRadius: "0 0 4px 4px",
                  cursor: "pointer",
                  marginTop: 4,
                }}
              >
                <span style={{ fontFamily: Fnt.mono, fontSize: 10, fontWeight: 700, color: "#A8BDD0" }}>
                  {siteOpen ? "▲ More Site Metrics" : "▼ More Site Metrics"}
                </span>
                {!siteOpen && (
                  <span style={{ fontFamily: Fnt.dm, fontSize: 10, color: "#666" }}>8 more items →</span>
                )}
              </div>
            </div>

            {/* ── OPEN DESIGN DRAWINGS ── */}
            <div style={{ padding: "0 14px 14px" }}>
              <div style={{
                fontFamily: Fnt.mono, fontSize: 10, fontWeight: 700,
                color: C.grey, textTransform: "uppercase", letterSpacing: ".04em",
                padding: "10px 2px 8px",
                borderTop: "1px solid rgba(51,212,188,0.10)",
              }}>
                Open Design Drawings
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 7 }}>
                {DESIGN_DRAWINGS.map((d, i) => (
                  <div
                    key={i}
                    onClick={() => d.route !== "#" ? nav(d.route) : undefined}
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(139,160,180,0.12)",
                      borderRadius: 6,
                      padding: "9px 10px 8px",
                      cursor: d.route !== "#" ? "pointer" : "default",
                      position: "relative",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={e => { if (d.route !== "#") e.currentTarget.style.background = "rgba(51,212,188,0.06)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
                  >
                    {/* Arrow icon */}
                    <span style={{
                      position: "absolute", top: 6, right: 8,
                      fontFamily: Fnt.mono, fontSize: 9,
                      color: d.route !== "#" ? C.teal : "rgba(139,160,180,0.3)",
                    }}>↗</span>
                    <div style={{ fontFamily: Fnt.dm, fontWeight: 700, fontSize: 11, color: C.white, marginBottom: 3, paddingRight: 14 }}>
                      {d.title}
                    </div>
                    <div style={{ fontFamily: Fnt.dm, fontSize: 9, color: C.grey, lineHeight: 1.4 }}>
                      {d.sub}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── PANEL G: BUILDING CAPEX ── */}
          <div style={{ background: C.navyCard, border: `1.5px solid ${C.bdrIdle}`, borderRadius: 11, overflow: "hidden" }}>
            <div style={{
              padding: "14px 18px", background: `${C.amber}0F`,
              borderBottom: `1px solid ${C.amber}30`,
              display: "flex", alignItems: "center", gap: 10,
            }}>
              <span style={{ fontFamily: Fnt.mono, fontWeight: 700, fontSize: 13, color: C.amber }}>G</span>
              <span style={{ fontFamily: Fnt.syne, fontWeight: 700, fontSize: 13, color: C.white, flex: 1 }}>Building CAPEX — A1–A8</span>
              <span style={{ fontFamily: Fnt.mono, fontWeight: 700, fontSize: 14, color: C.amber }}>{fmt(TOTAL_BUILDING)}</span>
            </div>

            {/* Package summary table */}
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "rgba(0,0,0,.2)" }}>
                  <th style={{ padding: "7px 12px", textAlign: "left", fontFamily: Fnt.mono, fontSize: 10, fontWeight: 700, color: C.grey, textTransform: "uppercase" }}>Ref</th>
                  <th style={{ padding: "7px 12px", textAlign: "left", fontFamily: Fnt.mono, fontSize: 10, fontWeight: 700, color: C.grey, textTransform: "uppercase" }}>Package</th>
                  <th style={{ padding: "7px 12px", textAlign: "right", fontFamily: Fnt.mono, fontSize: 10, fontWeight: 700, color: C.grey, textTransform: "uppercase" }}>Base Cost</th>
                </tr>
              </thead>
              <tbody>
                {BUILDING_CAPEX.map((row, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid rgba(30,107,140,.12)` }}>
                    <td style={{ padding: "8px 12px", fontFamily: Fnt.mono, fontSize: 12, fontWeight: 700, color: C.teal }}>{row.ref}</td>
                    <td style={{ padding: "8px 12px", fontFamily: Fnt.dm, fontSize: 11, color: C.greyLt }}>{row.name}</td>
                    <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: Fnt.mono, fontSize: 12, fontWeight: 700, color: C.amber }}>{fmt(row.cost)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Summary footer */}
            <div style={{
              padding: "12px 16px",
              background: "rgba(0,0,0,.2)",
              borderTop: `1px solid ${C.bdrIdle}`,
              display: "flex", flexDirection: "column", gap: 4,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontFamily: Fnt.dm, fontSize: 10, color: C.grey }}>Base ({fmt(BASE_BUILDING)})</span>
                <span style={{ fontFamily: Fnt.mono, fontSize: 10, color: C.grey }}>→ +8% contingency → +20% EPC → +20% dev</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: Fnt.dm, fontSize: 11, fontWeight: 700, color: C.white }}>Total (all-in)</span>
                <span style={{ fontFamily: Fnt.mono, fontSize: 15, fontWeight: 700, color: C.amber }}>{fmt(TOTAL_BUILDING)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <span style={{ fontFamily: Fnt.dm, fontSize: 10, color: C.green }}>Save ~$678K vs Western comparable</span>
              </div>
            </div>

            {/* View Detailed Schedule BUTTON */}
            <div style={{ padding: "12px 16px", borderTop: `1px solid ${C.bdrIdle}` }}>
              <button
                onClick={() => setModalOpen(true)}
                style={{
                  width: "100%", padding: "10px 0",
                  background: `${C.amber}18`,
                  border: `1.5px solid ${C.amber}55`,
                  borderRadius: 8,
                  fontFamily: Fnt.syne, fontWeight: 700, fontSize: 12,
                  color: C.amber, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  transition: "all .18s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = `${C.amber}28`; e.currentTarget.style.borderColor = C.amber; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = `${C.amber}18`; e.currentTarget.style.borderColor = `${C.amber}55`; }}
              >
                <span>📋</span>
                <span>View Detailed CAPEX Schedule</span>
                <span style={{ color: C.grey, fontFamily: Fnt.dm, fontSize: 10, fontWeight: 400 }}>41 line items</span>
              </button>
            </div>

            {/* Equipment CAPEX sub-section */}
            <div style={{ padding: "0 16px 16px" }}>
              <div style={{ fontFamily: Fnt.syne, fontWeight: 700, fontSize: 11, color: C.blue, textTransform: "uppercase", letterSpacing: ".05em", margin: "4px 0 8px" }}>
                Equipment CAPEX
              </div>
              {[
                { label: "S1C EFB Line", items: EQUIP_EFB, color: C.teal },
                { label: "S1B OPDC Line", items: EQUIP_OPDC, color: C.amber },
                { label: "Shared", items: EQUIP_SHARED, color: C.grey },
              ].map((grp, gi) => (
                <div key={gi} style={{ marginBottom: 6 }}>
                  <div style={{ fontFamily: Fnt.dm, fontWeight: 700, fontSize: 10, color: grp.color, textTransform: "uppercase", letterSpacing: ".04em", marginBottom: 3 }}>{grp.label}</div>
                  {grp.items.map((it, ii) => (
                    <div key={ii} style={{ display: "flex", justifyContent: "space-between", padding: "2px 0", borderBottom: ii < grp.items.length - 1 ? `1px solid rgba(255,255,255,0.03)` : "none" }}>
                      <span style={{ fontFamily: Fnt.dm, fontSize: 10, color: C.grey }}>{it.item}</span>
                      <span style={{ fontFamily: Fnt.mono, fontSize: 10, fontWeight: 700, color: C.white }}>{fmt(it.cost)}</span>
                    </div>
                  ))}
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, padding: "8px 0 0", borderTop: `1px solid ${C.border}` }}>
                <span style={{ fontFamily: Fnt.dm, fontWeight: 700, fontSize: 11, color: C.white }}>Equipment Total</span>
                <span style={{ fontFamily: Fnt.mono, fontWeight: 700, fontSize: 13, color: C.blue }}>{fmt(TOTAL_EQUIP)}</span>
              </div>
            </div>
          </div>

          {/* ── PANEL H: MONTHLY OPEX ── */}
          <div style={{ background: C.navyCard, border: `1.5px solid ${C.bdrIdle}`, borderRadius: 11, overflow: "hidden" }}>
            <div style={{
              padding: "14px 18px", background: `${C.green}0F`,
              borderBottom: `1px solid ${C.green}30`,
              display: "flex", alignItems: "center", gap: 10,
            }}>
              <span style={{ fontFamily: Fnt.mono, fontWeight: 700, fontSize: 13, color: C.green }}>H</span>
              <span style={{ fontFamily: Fnt.syne, fontWeight: 700, fontSize: 13, color: C.white, flex: 1 }}>Monthly OPEX</span>
              <span style={{ fontFamily: Fnt.mono, fontWeight: 700, fontSize: 14, color: C.amber }}>{fmt(OPEX_TOTAL)}<span style={{ fontFamily: Fnt.dm, fontSize: 10, color: C.grey, fontWeight: 400 }}>/mo</span></span>
            </div>

            {/* Labour */}
            <OpexSection
              title="Labour"
              total={LABOUR_TOTAL}
              totalColor={C.amber}
              open={opexSects.labour}
              onToggle={() => toggleOpex("labour")}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 5, paddingTop: 4 }}>
                {LABOUR_ITEMS.map((l, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: i < LABOUR_ITEMS.length - 1 ? `1px solid rgba(255,255,255,0.04)` : "none" }}>
                    <span style={{ fontFamily: Fnt.dm, fontSize: 11, color: C.grey }}>{l.role}</span>
                    <span style={{ fontFamily: Fnt.mono, fontWeight: 700, fontSize: 11, color: C.white }}>{fmt(l.wage)}</span>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0 2px", borderTop: `1px solid ${C.bdrCalc}`, marginTop: 2 }}>
                  <span style={{ fontFamily: Fnt.dm, fontWeight: 700, fontSize: 11, color: C.grey }}>7 headcount · base wages</span>
                  <span style={{ fontFamily: Fnt.mono, fontWeight: 700, fontSize: 13, color: C.amber }}>{fmt(LABOUR_TOTAL)}</span>
                </div>
              </div>
            </OpexSection>

            {/* Electricity */}
            <OpexSection
              title="Electricity"
              total={ELECTRICITY_TOTAL}
              totalColor={C.green}
              open={opexSects.electricity}
              onToggle={() => toggleOpex("electricity")}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 5, paddingTop: 4 }}>
                {ELECTRICITY_ITEMS.map((e, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 0", borderBottom: i < ELECTRICITY_ITEMS.length - 1 ? `1px solid rgba(255,255,255,0.04)` : "none" }}>
                    <div>
                      <div style={{ fontFamily: Fnt.dm, fontSize: 11, color: C.grey }}>{e.line}</div>
                      <div style={{ fontFamily: Fnt.mono, fontSize: 10, color: C.greyLt }}>{e.kw} kW</div>
                    </div>
                    <span style={{ fontFamily: Fnt.mono, fontWeight: 700, fontSize: 11, color: C.white }}>{fmt(e.monthly)}</span>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0 2px", borderTop: `1px solid ${C.bdrCalc}`, marginTop: 2 }}>
                  <span style={{ fontFamily: Fnt.dm, fontWeight: 700, fontSize: 11, color: C.grey }}>566 kW combined</span>
                  <span style={{ fontFamily: Fnt.mono, fontWeight: 700, fontSize: 13, color: C.green }}>{fmt(ELECTRICITY_TOTAL)}</span>
                </div>
              </div>
            </OpexSection>

            {/* Maintenance */}
            <OpexSection
              title="Maintenance &amp; Other"
              total={MAINTENANCE_TOTAL}
              totalColor={C.amber}
              open={opexSects.maintenance}
              onToggle={() => toggleOpex("maintenance")}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 5, paddingTop: 4 }}>
                {MAINTENANCE_ITEMS.map((m, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: i < MAINTENANCE_ITEMS.length - 1 ? `1px solid rgba(255,255,255,0.04)` : "none" }}>
                    <span style={{ fontFamily: Fnt.dm, fontSize: 11, color: C.grey }}>{m.item}</span>
                    <span style={{ fontFamily: Fnt.mono, fontWeight: 700, fontSize: 11, color: C.white }}>{fmt(m.monthly)}</span>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0 2px", borderTop: `1px solid ${C.bdrCalc}`, marginTop: 2 }}>
                  <span style={{ fontFamily: Fnt.dm, fontWeight: 700, fontSize: 11, color: C.grey }}>Equipment + Repairs + Consumables</span>
                  <span style={{ fontFamily: Fnt.mono, fontWeight: 700, fontSize: 13, color: C.amber }}>{fmt(MAINTENANCE_TOTAL)}</span>
                </div>
              </div>
            </OpexSection>

            {/* OPEX Grand Total */}
            <div style={{
              padding: "14px 18px",
              background: C.navyDeep,
              borderTop: `1.5px solid ${C.border}`,
              display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
              gap: 8,
            }}>
              {[
                { lbl: "Labour",      val: fmt(LABOUR_TOTAL),       color: C.amber },
                { lbl: "Electricity", val: fmt(ELECTRICITY_TOTAL),  color: C.green },
                { lbl: "Maintenance", val: fmt(MAINTENANCE_TOTAL),  color: C.amber },
              ].map((k, i) => (
                <div key={i}>
                  <div style={{ fontFamily: Fnt.dm, fontSize: 9, fontWeight: 700, color: C.grey, textTransform: "uppercase", letterSpacing: ".04em", marginBottom: 3 }}>{k.lbl}</div>
                  <div style={{ fontFamily: Fnt.mono, fontWeight: 700, fontSize: 12, color: k.color }}>{k.val}</div>
                </div>
              ))}
            </div>
            <div style={{
              padding: "10px 18px 14px",
              background: C.navyDeep,
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <span style={{ fontFamily: Fnt.syne, fontWeight: 700, fontSize: 12, color: C.white }}>Total Monthly OpEx</span>
              <span style={{ fontFamily: Fnt.mono, fontWeight: 700, fontSize: 18, color: C.amber }}>{fmt(OPEX_TOTAL)}<span style={{ fontFamily: Fnt.dm, fontSize: 11, color: C.grey, fontWeight: 400 }}>/mo</span></span>
            </div>

            {/* Data gaps notice */}
            <div style={{ padding: "12px 16px", borderTop: `1px solid ${C.bdrIdle}` }}>
              <div style={{ fontFamily: Fnt.dm, fontWeight: 700, fontSize: 10, color: C.amber, textTransform: "uppercase", letterSpacing: ".04em", marginBottom: 6 }}>
                ⚠ Data Gaps — Not Yet Costed
              </div>
              {[
                "Greenhouse construction (structural specs exist, costs TBC)",
                "Land rental / co-location lease terms",
                "Insurance — assets + public liability",
                "Commissioning & startup costs",
                "Working capital (3-month OpEx buffer)",
              ].map((gap, i) => (
                <div key={i} style={{ fontFamily: Fnt.dm, fontSize: 10, color: C.grey, padding: "2px 0", display: "flex", gap: 6 }}>
                  <span style={{ color: C.amber, flexShrink: 0 }}>·</span>
                  <span>{gap}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── BACK NAVIGATION ── */}
        <div style={{ marginTop: 32, display: "flex", justifyContent: "flex-start", gap: 10 }}>
          <button
            onClick={() => nav("/s1")}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "9px 18px",
              background: "rgba(64,215,197,0.08)",
              border: `1px solid ${C.teal}55`,
              borderRadius: 8,
              fontFamily: Fnt.dm, fontSize: 12, fontWeight: 600,
              color: C.teal, cursor: "pointer",
            }}
          >
            ← Back to S1 Hub
          </button>
          <button
            onClick={() => nav("/s1-engineering")}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "9px 18px",
              background: "rgba(255,255,255,0.04)",
              border: `1px solid ${C.bdrIdle}`,
              borderRadius: 8,
              fontFamily: Fnt.dm, fontSize: 12, fontWeight: 600,
              color: C.grey, cursor: "pointer",
            }}
          >
            Engineering Overview →
          </button>
        </div>
      </div>
    </>
  );
}
