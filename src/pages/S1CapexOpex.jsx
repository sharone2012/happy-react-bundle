import { useState } from "react";
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
      background: color === C.red ? "rgba(232,64,64,0.08)" : `rgba(64,215,197,0.1)`,
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
  { label: "Total Equipment CAPEX", value: "$233,000", color: C.amber, unit: "Confirmed · + POS RFQ pending", dot: C.teal2 },
  { label: "Monthly OPEX", value: "(DATA GAP)", color: C.red, unit: "Labour + Electricity TBC", dot: C.grey },
  { label: "Processing Lines", value: "3 Active", color: C.green, unit: "EFB · OPDC · POS", dot: C.teal2 },
  { label: "Facility Area", value: "2,450 m²", color: C.teal2, unit: "Building footprint", dot: C.teal2 },
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
          borderRight: i < 5 ? `1px solid rgba(30,107,140,0.28)` : "none",
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
  { title: "Site Master Plan", sub: "98m × 85m · All zones · North arrow" },
  { title: "Building Architecture", sub: "Floor · Elevation · Section · 3D · Machinery" },
  { title: "Building Floor Plan", sub: "36×35m · All machines ①–⑳ · Legend" },
  { title: "Greenhouse Design", sub: "Site plan · Section XX · Store" },
  { title: "EFB Floor Plan", sub: "①–⑩ · 20 t/h · 10 machines · 600mm belt" },
  { title: "OPDC Floor Plan", sub: "⑪–⑳ · 5 t/h · CLASS A gate" },
  { title: "EFB ASCII Flow", sub: "Step-by-step · machines · specs · gates" },
  { title: "OPDC ASCII Flow", sub: "Step-by-step · CLASS A gate · 24h dwell" },
  { title: "POS ASCII Flow", sub: "ICP-OES Fe gate · decanter · inclusion rate" },
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

function SiteFacilityCard({ forceOpen }) {
  const [open, setOpen] = useState(true);
  const [moreOpen, setMoreOpen] = useState(false);
  const isOpen = forceOpen !== undefined ? forceOpen : open;

  return (
    <div style={{ background: C.s1, border: `1.5px solid ${C.border}`, borderRadius: 8, overflow: "hidden" }}>
      {/* header */}
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
          {/* visible tiles */}
          <div style={{ padding: "8px 14px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {visibleTiles.map((t, i) => <MetricTile key={i} {...t} />)}
          </div>

          {/* expandable */}
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

          {/* drawing buttons */}
          <div style={{
            paddingTop: 10, paddingBottom: 2, paddingLeft: 14,
            fontFamily: F, fontSize: 9, fontWeight: 700, color: C.teal2,
            textTransform: "uppercase", letterSpacing: "0.1em",
            borderBottom: "1px solid rgba(30,107,140,0.15)",
          }}>Open Design Drawings</div>
          <div style={{ padding: "8px 14px 12px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {drawingBtns.map((b, i) => (
              <div key={i} style={{
                background: "#0C1E33", border: "1px solid rgba(139,160,180,0.18)", borderRadius: 6,
                padding: "11px 12px", display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                cursor: "pointer", textAlign: "center", position: "relative",
                transition: "all 0.2s ease",
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
  { ref: "A1", desc: "Site works — clearing, earthworks, drainage", val: "$79,540" },
  { ref: "A2", desc: "Civil & concrete — slabs, hoppers, bays", val: "$105,900" },
  { ref: "A3", desc: "Structural steel — PEB, cladding, platforms", val: "$336,790" },
  { ref: "A4", desc: "Welfare fit-out — fixtures & finishes", val: "$107,650" },
  { ref: "A5", desc: "MEP — power & lighting", val: "$140,000" },
  { ref: "A6", desc: "MEP — HVAC & ventilation", val: "$28,000" },
  { ref: "A7", desc: "Plumbing & drainage", val: "$42,000" },
  { ref: "A8", desc: "Process building items", val: "$44,000" },
];

function BuildingCapexCard({ forceOpen }) {
  const [open, setOpen] = useState(true);
  const isOpen = forceOpen !== undefined ? forceOpen : open;

  return (
    <div style={{ background: C.s1, border: `1.5px solid ${C.border}`, borderRadius: 8, overflow: "hidden" }}>
      {/* header */}
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
          {/* hero total */}
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

          {/* line items */}
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

          {/* subtotal */}
          <div style={{ borderTop: "1px dashed rgba(30,107,140,0.3)", padding: "8px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={{ fontFamily: F, fontSize: 9, fontWeight: 600, color: C.grey, width: 45 }}>—</span>
              <span style={{ fontFamily: F, fontSize: 11, fontWeight: 700, color: C.white, paddingLeft: 8 }}>Base subtotal A1–A8</span>
            </div>
            <span style={{ fontFamily: F, fontSize: 13, fontWeight: 700, color: C.white, width: 100, textAlign: "right" }}>$883,880</span>
          </div>

          {/* markups */}
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

          {/* final total */}
          <div style={{ borderTop: `2px solid ${C.green}`, padding: "8px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={{ fontFamily: F, fontSize: 9, fontWeight: 600, color: C.grey, width: 45 }}>—</span>
              <span style={{ fontFamily: F, fontSize: 12, fontWeight: 700, color: C.white, paddingLeft: 8 }}>Total To CFI — Building</span>
            </div>
            <span style={{ fontFamily: F, fontSize: 20, fontWeight: 700, color: C.green, width: 120, textAlign: "right" }}>$1,374,610</span>
          </div>

          {/* detailed schedule trigger */}
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

/* ── Column 3 Placeholder ── */
function Col3Placeholder() {
  return (
    <div style={{
      background: C.s1, border: `1.5px solid ${C.border}`, borderRadius: 8,
      padding: "20px 14px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      minHeight: 300, gap: 8,
    }}>
      <div style={{ fontFamily: F, fontSize: 11, fontWeight: 700, color: C.grey, textTransform: "uppercase" }}>Column 3</div>
      <div style={{ fontFamily: F, fontSize: 9, color: C.greyMd }}>Equipment CAPEX · OPEX · Residue — Chunk 2</div>
    </div>
  );
}

/* ══════════════ MAIN PAGE ══════════════ */
export default function S1CapexOpex() {
  const [expandAll, setExpandAll] = useState(false);

  return (
    <div style={{ fontFamily: F, color: C.white, background: C.bg, minHeight: "100vh" }}>
      {/* CSS for pulse animation */}
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

      {/* Spacer */}
      <div style={{ height: 83 }} />

      {/* ── CONTEXT BAR ── */}
      <div style={{
        background: C.s1, borderBottom: "1px solid rgba(30,107,140,0.25)",
        padding: "6px 20px", display: "flex", justifyContent: "space-between", alignItems: "center",
        fontFamily: F, fontSize: 9,
      }}>
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          <span style={{ color: C.teal2, fontWeight: 700 }}>CFI Platform</span>
          <span style={{ color: "rgba(30,107,140,0.5)" }}> › </span>
          <span style={{ color: C.grey }}>S0 Mill Config</span>
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
          <span style={{ fontFamily: F, fontSize: 16, fontWeight: 800, color: C.teal2, marginLeft: 6 }}>
            Pre-Processing — CAPEX · OPEX · Facility
          </span>
        </div>
        <div style={{ display: "flex", gap: 5 }}>
          {[
            { label: "↗ Site Plan", c: "rgba(0,201,177,", tc: C.teal },
            { label: "↗ Architecture", c: "rgba(155,89,182,", tc: "#c090ff" },
            { label: "Expand All", c: "rgba(245,166,35,", tc: C.amber },
          ].map((b, i) => (
            <button key={i} onClick={i === 2 ? () => setExpandAll(!expandAll) : undefined} style={{
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
      <div style={{ padding: "0 20px 20px" }}>
        <KpiStrip />

        {/* 3-col layout */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          <SiteFacilityCard forceOpen={expandAll ? true : undefined} />
          <BuildingCapexCard forceOpen={expandAll ? true : undefined} />
          <Col3Placeholder />
        </div>
      </div>
    </div>
  );
}
