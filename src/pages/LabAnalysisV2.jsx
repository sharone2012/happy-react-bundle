import { useState } from "react";

// ─── STREAMS ─────────────────────────────────────────────────────────────────
const STREAMS = ["EFB","OPDC","POS","POME","PKE","PKS","PMF","ASH","OPF","OPT","BSF"];

// ─── BADGE ───────────────────────────────────────────────────────────────────
function Badge({ type, text }) {
  const styles = {
    VERIFIED:      { bg: "rgba(114, 223, 166, 0.15)", color: "#72DFA6" },
    PASS:          { bg: "rgba(114, 223, 166, 0.15)", color: "#72DFA6" },
    PENDING:       { bg: "rgba(245, 166, 35, 0.12)",  color: "#F5A623" },
    "LDE-HIGH":    { bg: "rgba(114, 223, 166, 0.10)", color: "#72DFA6" },
    "LAB-CONFIRMED":{ bg: "rgba(114, 223, 166, 0.15)", color: "#72DFA6" },
    "LDE-MODERATE":{ bg: "rgba(245, 166, 35, 0.10)",  color: "#F5A623" },
    "LDE-LOW":     { bg: "rgba(255, 92, 92, 0.10)",   color: "#FF5C5C" },
  };
  const s = styles[type] || { bg: "rgba(139,160,180,0.10)", color: "#888" };
  return (
    <span style={{
      background: s.bg, color: s.color, fontFamily: "'DM Sans', sans-serif", fontSize: 11,
      padding: "2px 7px", borderRadius: 3, whiteSpace: "nowrap",
    }}>
      {text}
    </span>
  );
}

// ─── COLUMN DEFS ─────────────────────────────────────────────────────────────
const COLS = [
  { key: "parameter",  label: "PARAMETER",  width: 210, align: "left" },
  { key: "unit",        label: "UNIT",       width: 90,  align: "left" },
  { key: "result",      label: "RESULT",     width: 110, align: "left" },
  { key: "range",       label: "RANGE",      width: 120, align: "left" },
  { key: "sni",         label: "SNI",        width: 100, align: "left" },
  { key: "status",      label: "STATUS",     width: 105, align: "left" },
  { key: "confidence",  label: "CONFIDENCE", width: 135, align: "left" },
  { key: "method",      label: "METHOD",     width: 185, align: "left" },
  { key: "edit",        label: "EDIT",       width: 110, align: "center" },
];

// ─── SECTION DATA ────────────────────────────────────────────────────────────
const SECTIONS = [
  {
    code: "ELE", title: "Elemental / Nutrient Analysis", meta: "16 parameters · % DM · mg/kg DM", defaultOpen: true,
    rows: [
      { parameter: "Carbon (C)", unit: "% DM", result: "41.41%", range: "42–48%", sni: "—", status: "VERIFIED", confidence: "LDE-HIGH", method: "CHNS Analyser" },
      { parameter: "Nitrogen (N)", unit: "% DM", result: "2.32%", range: "2.0–2.8%", sni: "—", status: "VERIFIED", confidence: "LDE-HIGH", method: "CHNS Analyser" },
      { parameter: "Phosphorus (P)", unit: "% DM", result: "0.39%", range: "0.3–0.5%", sni: "—", status: "VERIFIED", confidence: "LDE-HIGH", method: "ICP-OES" },
      { parameter: "Potassium (K)", unit: "% DM", result: "1.20%", range: "1.0–1.5%", sni: "—", status: "VERIFIED", confidence: "LDE-HIGH", method: "ICP-OES" },
      { parameter: "Calcium (Ca)", unit: "% DM", result: "1.20%", range: "—", sni: "—", status: "VERIFIED", confidence: "LDE-HIGH", method: "ICP-OES" },
      { parameter: "Magnesium (Mg)", unit: "% DM", result: "0.72%", range: "—", sni: "—", status: "VERIFIED", confidence: "LDE-HIGH", method: "ICP-OES" },
      { parameter: "Sulfur (S)", unit: "% DM", result: "0.30%", range: "—", sni: "—", status: "VERIFIED", confidence: "LDE-HIGH", method: "ICP-OES" },
      { parameter: "Hydrogen (H)", unit: "% DM", result: "5.92%", range: "—", sni: "—", status: "VERIFIED", confidence: "LDE-MODERATE", method: "CHNS Analyser" },
      { parameter: "Oxygen (O)", unit: "% DM", result: "47.06%", range: "—", sni: "—", status: "VERIFIED", confidence: "LDE-MODERATE", method: "CHNS Analyser" },
      { parameter: "Copper (Cu)", unit: "mg/kg DM", result: "19.00", range: "—", sni: "—", status: "VERIFIED", confidence: "LDE-HIGH", method: "ICP-OES" },
      { parameter: "Manganese (Mn)", unit: "mg/kg DM", result: "190.00", range: "—", sni: "—", status: "VERIFIED", confidence: "LDE-HIGH", method: "ICP-OES" },
      { parameter: "Zinc (Zn)", unit: "mg/kg DM", result: "37.00", range: "—", sni: "—", status: "VERIFIED", confidence: "LDE-HIGH", method: "ICP-OES" },
      { parameter: "Nickel (Ni)", unit: "mg/kg DM", result: "6.30", range: "—", sni: "—", status: "VERIFIED", confidence: "LDE-HIGH", method: "ICP-MS" },
      { parameter: "Iron (Fe)", unit: "mg/kg DM", result: "DATA GAP", range: "—", sni: "—", status: "PENDING", confidence: "LDE-LOW", method: "ICP-OES" },
      { parameter: "Chlorine (Cl)", unit: "% DM", result: "DATA GAP", range: "—", sni: "SNI Blocker", status: "PENDING", confidence: "LDE-LOW", method: "Ion Chromatography" },
      { parameter: "C:N Ratio", unit: "ratio", result: "17.85", range: "15–22", sni: "—", status: "VERIFIED", confidence: "LDE-HIGH", method: "Derived from CHNS" },
    ],
  },
  {
    code: "PRX", title: "Proximate Analysis", meta: "9 parameters · % wb · % DM · MJ/kg DM", defaultOpen: false,
    rows: [
      { parameter: "Moisture", unit: "% wb", result: "76.70%", range: "70–80%", sni: "—", status: "VERIFIED", confidence: "LDE-HIGH", method: "AOAC 930.15" },
      { parameter: "Ash", unit: "% DM", result: "28.00%", range: "24–32%", sni: "—", status: "VERIFIED", confidence: "LDE-HIGH", method: "AOAC 942.05" },
      { parameter: "Organic Matter", unit: "% DM", result: "78.00%", range: "—", sni: "—", status: "VERIFIED", confidence: "LDE-MODERATE", method: "Derived: 100 − ash%" },
      { parameter: "Volatile Matter", unit: "% DM", result: "64.50%", range: "—", sni: "—", status: "VERIFIED", confidence: "LDE-HIGH", method: "APHA 2540G" },
      { parameter: "Fixed Carbon", unit: "% DM", result: "11.15%", range: "—", sni: "—", status: "VERIFIED", confidence: "LDE-MODERATE", method: "Derived: 100 − VM − ash" },
      { parameter: "Crude Protein", unit: "% DM", result: "14.50%", range: "12–17%", sni: "—", status: "VERIFIED", confidence: "LDE-HIGH", method: "AOAC 984.13 / Kjeldahl" },
      { parameter: "Ether Extract", unit: "% DM", result: "12.50%", range: "—", sni: "—", status: "VERIFIED", confidence: "LDE-HIGH", method: "AOAC 920.39 / Soxhlet" },
      { parameter: "HHV (Higher Heating Value)", unit: "MJ/kg DM", result: "17.68", range: "—", sni: "—", status: "VERIFIED", confidence: "LDE-HIGH", method: "ASTM E711 / Bomb calorimeter" },
      { parameter: "LHV (Lower Heating Value)", unit: "MJ/kg DM", result: "15.96", range: "—", sni: "—", status: "VERIFIED", confidence: "LDE-HIGH", method: "ASTM E711 / Bomb calorimeter" },
    ],
  },
  {
    code: "FIB", title: "Fiber Analysis", meta: "6 parameters · % DM", defaultOpen: false,
    rows: [
      { parameter: "Lignin (ADL)", unit: "% DM", result: "10.78%", range: "8–14%", sni: "—", status: "VERIFIED", confidence: "LDE-HIGH", method: "AOAC 973.18 / Van Soest ADL" },
      { parameter: "ADF (Acid Detergent Fiber)", unit: "% DM", result: "53.19%", range: "—", sni: "—", status: "VERIFIED", confidence: "LDE-HIGH", method: "AOAC 973.18 / Van Soest ADF" },
      { parameter: "NDF (Neutral Detergent Fiber)", unit: "% DM", result: "77.23%", range: "—", sni: "—", status: "VERIFIED", confidence: "LDE-HIGH", method: "AOAC 2002.04 / Van Soest NDF" },
      { parameter: "Cellulose", unit: "% DM", result: "42.41%", range: "—", sni: "—", status: "VERIFIED", confidence: "LDE-MODERATE", method: "Derived: ADF − ADL" },
      { parameter: "Hemicellulose", unit: "% DM", result: "24.04%", range: "—", sni: "—", status: "VERIFIED", confidence: "LDE-MODERATE", method: "Derived: NDF − ADF" },
      { parameter: "ADL (Van Soest)", unit: "% DM", result: "10.78%", range: "—", sni: "—", status: "VERIFIED", confidence: "LDE-HIGH", method: "Van Soest et al. 1991" },
    ],
  },
  {
    code: "PHY", title: "Physicochemical Properties", meta: "8 parameters · various units", defaultOpen: false,
    rows: [
      { parameter: "pH", unit: "—", result: "4.40", range: "4.0–5.0", sni: "—", status: "VERIFIED", confidence: "LDE-HIGH", method: "AOAC 981.12 / pH electrode" },
      { parameter: "EC (Electrical Conductivity)", unit: "mS/cm", result: "2.96", range: "—", sni: "—", status: "VERIFIED", confidence: "LDE-HIGH", method: "ISO 11265 / EC electrode" },
      { parameter: "CEC (Cation Exchange Capacity)", unit: "cmol/kg DM", result: "20–35", range: "—", sni: "—", status: "PENDING", confidence: "LDE-LOW", method: "Standard soil method" },
      { parameter: "Liming Equivalency", unit: "kg CaCO₃/t", result: "29.96", range: "—", sni: "—", status: "VERIFIED", confidence: "LDE-MODERATE", method: "Derived calculation" },
      { parameter: "P₂O₅ (Phosphorus Pentoxide)", unit: "% DM", result: "0.894%", range: "—", sni: "—", status: "VERIFIED", confidence: "LDE-HIGH", method: "Derived: P × 2.2914" },
      { parameter: "K₂O (Potassium Oxide)", unit: "% DM", result: "1.45%", range: "—", sni: "—", status: "VERIFIED", confidence: "LDE-HIGH", method: "Derived: K × 1.2046" },
      { parameter: "CaO (Calcium Oxide)", unit: "% DM", result: "1.68%", range: "—", sni: "—", status: "VERIFIED", confidence: "LDE-HIGH", method: "Derived: Ca × 1.3992" },
      { parameter: "MgO (Magnesium Oxide)", unit: "% DM", result: "1.19%", range: "—", sni: "—", status: "VERIFIED", confidence: "LDE-HIGH", method: "Derived: Mg × 1.6582" },
    ],
  },
  {
    code: "HMT", title: "Heavy Metals & Trace Elements", meta: "7 parameters · mg/kg DM · % ash", defaultOpen: false,
    rows: [
      { parameter: "Arsenic (As)", unit: "mg/kg DM", result: "<LOD", range: "—", sni: "<5.0", status: "PASS", confidence: "LDE-HIGH", method: "ICP-MS / EPA 6020B" },
      { parameter: "Cadmium (Cd)", unit: "mg/kg DM", result: "<LOD–0.20", range: "—", sni: "<1.0", status: "PASS", confidence: "LDE-HIGH", method: "ICP-MS / EPA 6020B" },
      { parameter: "Chromium (Cr)", unit: "mg/kg DM", result: "<LOD–5.0", range: "—", sni: "<20", status: "PASS", confidence: "LDE-MODERATE", method: "ICP-MS / EPA 6020B" },
      { parameter: "Lead (Pb)", unit: "mg/kg DM", result: "<LOD–2.0", range: "—", sni: "<10", status: "PASS", confidence: "LDE-HIGH", method: "ICP-MS / EPA 6020B" },
      { parameter: "Mercury (Hg)", unit: "mg/kg DM", result: "<LOD", range: "—", sni: "<1.0", status: "PASS", confidence: "LDE-HIGH", method: "ICP-MS / EPA 6020B" },
      { parameter: "Nickel (Ni)", unit: "mg/kg DM", result: "6.30", range: "—", sni: "<50", status: "PASS", confidence: "LDE-HIGH", method: "ICP-MS / EPA 6020B" },
      { parameter: "SiO₂ (in ash)", unit: "% ash", result: "30.00%", range: "31–36%", sni: "—", status: "VERIFIED", confidence: "LDE-MODERATE", method: "XRF or ICP-OES" },
    ],
  },
  {
    code: "BIO", title: "Biological Indicators", meta: "3 parameters · score · % DM", defaultOpen: false,
    rows: [
      { parameter: "BSF Suitability Score", unit: "score /5.0", result: "3.75", range: "3.0–4.5", sni: "—", status: "VERIFIED", confidence: "LDE-MODERATE", method: "CFI proprietary scoring" },
      { parameter: "Humic Acid", unit: "% DM", result: "1.80%", range: "—", sni: "—", status: "VERIFIED", confidence: "LDE-MODERATE", method: "Extraction method" },
      { parameter: "Fulvic Acid", unit: "% DM", result: "0.90%", range: "—", sni: "—", status: "VERIFIED", confidence: "LDE-MODERATE", method: "Extraction method" },
    ],
  },
  {
    code: "AGV", title: "Agronomic Value", meta: "5 parameters · USD/t DM · %", defaultOpen: false,
    rows: [
      { parameter: "Nitrogen Value", unit: "USD/t DM", result: "$17.66", range: "—", sni: "—", status: "VERIFIED", confidence: "LDE-MODERATE", method: "Market price × N content" },
      { parameter: "Phosphorus Value", unit: "USD/t DM", result: "$6.03", range: "—", sni: "—", status: "VERIFIED", confidence: "LDE-MODERATE", method: "Market price × P content" },
      { parameter: "Potassium Value", unit: "USD/t DM", result: "$6.66", range: "—", sni: "—", status: "VERIFIED", confidence: "LDE-MODERATE", method: "Market price × K content" },
      { parameter: "Total Agronomic Value", unit: "USD/t DM", result: "$30.35", range: "—", sni: "—", status: "VERIFIED", confidence: "LDE-HIGH", method: "Sum of N + P + K values" },
      { parameter: "OPDC Yield from EFB", unit: "% EFB ww", result: "15.20%", range: "14–17%", sni: "—", status: "VERIFIED", confidence: "LDE-HIGH", method: "Mill pressing data" },
    ],
  },
  {
    code: "LAR", title: "Large Molecule Analysis", meta: "1 parameter · t CO₂e/t DM", defaultOpen: false,
    rows: [
      { parameter: "GHG Baseline Emissions", unit: "t CO₂e/t DM", result: "5.94", range: "—", sni: "—", status: "VERIFIED", confidence: "LDE-HIGH", method: "LCA calculation (GWP100)" },
    ],
  },
];

// ─── METRICS ─────────────────────────────────────────────────────────────────
const METRICS_VISIBLE = [
  { label: "Dry Matter", value: "30%", sub: "% wb · press floor" },
  { label: "Crude Protein", value: "14.5%", sub: "DM · N×6.25" },
  { label: "Lignin ADL", value: "10.78%", sub: "DM · BSF gate PASS" },
  { label: "CEC", value: "Data gap", sub: "cmol/kg · pending ICP", isGap: true },
  { label: "N · P · K", value: "2.32%  ·  0.30%  ·  1.90%", sub: "% DM · ICP-OES" },
  { label: "N · P₂O₅ · K₂O", value: "2.32%  ·  0.69%  ·  2.29%", sub: "% DM" },
  { label: "Per Tonne DM", value: "N: 23.2kg  P: 3.0kg  K: 19.0kg", sub: "kg per tonne" },
];
const METRICS_HIDDEN = [
  { label: "Cellulase", value: "2–5 U/g", sub: "" },
  { label: "Xylanase", value: "1–3 U/g", sub: "" },
];

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function LabAnalysisV2() {
  const [activeStream, setActiveStream] = useState("ALL");
  const [showAll, setShowAll] = useState(true);
  const [showEnzymes, setShowEnzymes] = useState(false);
  const [openSections, setOpenSections] = useState(() => {
    const init = {};
    SECTIONS.forEach(s => { init[s.code] = s.defaultOpen; });
    return init;
  });

  const toggleSection = (code) => setOpenSections(prev => ({ ...prev, [code]: !prev[code] }));

  const F = "'DM Sans', sans-serif";

  return (
    <div style={{ background: "#060C14", minHeight: "100vh", fontFamily: F, color: "#FFFFFF" }}>

      {/* ═══ 1. HEADER — 83px ═══ */}
      <div style={{
        background: "#0A1628", height: 83, display: "flex", alignItems: "center",
        padding: "0 32px", justifyContent: "space-between",
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontFamily: F, fontSize: 26, fontWeight: 700, color: "#FFFFFF" }}>CFI</span>
          <span style={{ color: "#FFFFFF", fontSize: 26 }}>|</span>
          <span style={{ fontFamily: F, fontSize: 26, fontWeight: 700, color: "#33D4BC" }}>Deep Tech</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2, textAlign: "right" }}>
          <span style={{ fontFamily: F, fontSize: 13, color: "#FFFFFF", opacity: 0.7 }}>
            Precision Engineering | Circular Nutrient Recovery in Agricultural Systems
          </span>
          <span style={{ fontFamily: F, fontSize: 13, color: "#FFFFFF", opacity: 0.7 }}>
            Applied Biology | Rebalancing Soil's Microbiome &amp; Reducing Synthetic Fertiliser Use
          </span>
        </div>
      </div>

      {/* Spacer for fixed header */}
      <div style={{ height: 83 }} />

      {/* ═══ 2. TOPBAR ═══ */}
      <div style={{
        background: "#0A1220", padding: "14px 17px 4px",
        display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
      }}>
        <span style={{ fontFamily: F, fontSize: 15, fontWeight: 600, color: "#F5A623", marginRight: 8 }}>
          Lab Analysis
        </span>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", flex: 1 }}>
          <button
            onClick={() => { setShowAll(true); setActiveStream("ALL"); }}
            style={{
              fontFamily: F, fontSize: 13, fontWeight: 600,
              padding: "5px 14px", borderRadius: 4, cursor: "pointer",
              background: showAll ? "#F5A623" : "transparent",
              color: showAll ? "#060C14" : "#FFFFFF",
              border: showAll ? "none" : "1px solid #333",
            }}
          >
            Lab Analysis Combined
          </button>
          <button
            style={{
              fontFamily: F, fontSize: 13, fontWeight: !showAll ? 600 : 400,
              padding: "5px 14px", borderRadius: 4, cursor: "pointer",
              background: !showAll ? "rgba(245,166,35,0.15)" : "transparent",
              color: !showAll ? "#F5A623" : "#FFFFFF",
              border: !showAll ? "1px solid #F5A623" : "1px solid #333",
            }}
          >
            Individual →
          </button>
          {STREAMS.map(s => {
            const active = !showAll && activeStream === s;
            return (
              <button
                key={s}
                onClick={() => { setShowAll(false); setActiveStream(s); }}
                style={{
                  fontFamily: F, fontSize: 13, padding: "5px 14px",
                  borderRadius: 4, cursor: "pointer",
                  background: active ? "#F5A623" : "transparent",
                  color: active ? "#060C14" : "#FFFFFF",
                  border: active ? "none" : "1px solid #333",
                  fontWeight: active ? 600 : 400,
                }}
              >
                {s}
              </button>
            );
          })}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={{ fontFamily: F, fontSize: 13, padding: "5px 14px", borderRadius: 4, cursor: "pointer", background: "transparent", border: "1px solid #333", color: "#FFFFFF" }}>
            Upload Report
          </button>
          <button style={{ fontFamily: F, fontSize: 13, padding: "5px 14px", borderRadius: 4, cursor: "pointer", background: "transparent", border: "1px solid #333", color: "#FFFFFF" }}>
            Print Report
          </button>
        </div>
      </div>

      {/* ═══ 3. METRICS STRIP ═══ */}
      <div style={{
        background: "#0A1220", minHeight: 72,
        display: "flex", flexWrap: "wrap", alignItems: "stretch",
      }}>
        {METRICS_VISIBLE.map((m, i) => (
          <div key={i} style={{
            flex: "1 1 0", minWidth: 100, padding: "8px 12px",
            background: "#0D1B2A", border: "1px solid #1A2A3A",
          }}>
            <div style={{ fontFamily: F, fontSize: 13, color: "#888" }}>{m.label}</div>
            <div style={{ fontFamily: F, fontSize: 12, color: m.isGap ? "#FF5C5C" : "#FFFFFF", marginTop: 2 }}>{m.value}</div>
            <div style={{ fontFamily: F, fontSize: 10, color: "#666", marginTop: 1 }}>{m.sub}</div>
          </div>
        ))}
        {showEnzymes && METRICS_HIDDEN.map((m, i) => (
          <div key={`h${i}`} style={{
            flex: "1 1 0", minWidth: 100, padding: "8px 12px",
            background: "#0D1B2A", border: "1px solid #1A2A3A",
          }}>
            <div style={{ fontFamily: F, fontSize: 13, color: "#888" }}>{m.label}</div>
            <div style={{ fontFamily: F, fontSize: 12, color: "#FFFFFF", marginTop: 2 }}>{m.value}</div>
            <div style={{ fontFamily: F, fontSize: 10, color: "#666", marginTop: 1 }}>{m.sub}</div>
          </div>
        ))}
        <div style={{ display: "flex", alignItems: "center", padding: "0 12px" }}>
          <span
            onClick={() => setShowEnzymes(!showEnzymes)}
            style={{ fontFamily: F, fontSize: 12, color: "#00C9B1", cursor: "pointer", whiteSpace: "nowrap", background: "none", border: "none" }}
          >
            {showEnzymes ? "− Cellulase · Xylanase" : "+ Cellulase · Xylanase"}
          </span>
        </div>
      </div>

      {/* ═══ 4. BANNER ═══ */}
      <div style={{
        background: "#0A1220", padding: "4px 0", textAlign: "center",
        fontFamily: F, fontSize: 8, color: "#666",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
      }}>
        Combined S0 Analysis · EFB + OPDC + POS · DM-weighted blend · 60 TPH FFB Mill
      </div>

      {/* ═══ 5. MAIN CONTAINER ═══ */}
      <div style={{
        height: "calc(100vh - 273px)", overflowY: "auto",
        background: "#060C14", padding: "0 17px",
      }}>
        {SECTIONS.map(section => {
          const isOpen = openSections[section.code];
          return (
            <div key={section.code}>
              {/* Section Header */}
              <div
                onClick={() => toggleSection(section.code)}
                style={{
                  background: "rgba(0, 201, 177, 0.048)", padding: "7px 20px",
                  display: "flex", alignItems: "center", gap: 10, cursor: "pointer",
                }}
              >
                <span style={{
                  fontSize: 26, color: isOpen ? "#F5A623" : "#FFFFFF",
                  transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                  transition: "transform 0.2s ease, color 0.15s ease",
                  display: "inline-block", lineHeight: 1,
                }}>›</span>
                <span style={{ fontFamily: F, fontSize: 10, color: "#F5A623" }}>{section.code}</span>
                <span style={{ fontFamily: F, fontSize: 13, color: "#40D7C5" }}>{section.title}</span>
                <span style={{ fontFamily: F, fontSize: 12, color: "#666" }}>{section.meta}</span>
                <span style={{ marginLeft: "auto", color: "#666", cursor: "pointer", fontSize: 14 }}
                  onMouseEnter={e => e.currentTarget.style.color = "#FFFFFF"}
                  onMouseLeave={e => e.currentTarget.style.color = "#666"}
                  onClick={e => e.stopPropagation()}
                >🖨</span>
              </div>

              {/* Table */}
              {isOpen && (
                <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
                  <colgroup>
                    {COLS.map(c => <col key={c.key} style={{ width: c.width }} />)}
                  </colgroup>
                  <thead>
                    <tr>
                      {COLS.map(c => (
                        <th key={c.key} style={{
                          fontFamily: F, fontSize: 11, color: "#666",
                          textTransform: "uppercase", textAlign: c.align,
                          padding: "6px 8px", borderBottom: "1px solid rgba(139,160,180,0.12)",
                          background: "#0A1220", fontWeight: 400,
                        }}>{c.label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {section.rows.map((row, idx) => {
                      const isEven = idx % 2 === 1;
                      const isDataGap = row.result === "DATA GAP";
                      const isSniBlocker = row.sni === "SNI Blocker";
                      const isDash = (v) => v === "—";
                      const baseBg = isEven ? "rgba(0, 201, 177, 0.02)" : "#0A1220";
                      return (
                        <tr
                          key={idx}
                          style={{ background: baseBg }}
                          onMouseEnter={e => e.currentTarget.style.background = "rgba(0, 201, 177, 0.06)"}
                          onMouseLeave={e => e.currentTarget.style.background = baseBg}
                        >
                          <td style={{ fontFamily: F, fontSize: 12, padding: "5px 8px", borderBottom: "1px solid rgba(139,160,180,0.06)", color: "#FFFFFF" }}>
                            {row.parameter}
                          </td>
                          <td style={{ fontFamily: F, fontSize: 12, padding: "5px 8px", borderBottom: "1px solid rgba(139,160,180,0.06)", color: "#888" }}>
                            {row.unit}
                          </td>
                          <td style={{ fontFamily: F, fontSize: 12, padding: "5px 8px", borderBottom: "1px solid rgba(139,160,180,0.06)", color: isDataGap ? "#FF5C5C" : "#FFFFFF", fontWeight: isDataGap ? 700 : 400 }}>
                            {row.result}
                          </td>
                          <td style={{ fontFamily: F, fontSize: 12, padding: "5px 8px", borderBottom: "1px solid rgba(139,160,180,0.06)", color: isDash(row.range) ? "#444" : "#FFFFFF" }}>
                            {row.range}
                          </td>
                          <td style={{ fontFamily: F, fontSize: 12, padding: "5px 8px", borderBottom: "1px solid rgba(139,160,180,0.06)", color: isSniBlocker ? "#FF5C5C" : isDash(row.sni) ? "#444" : "#FFFFFF" }}>
                            {row.sni}
                          </td>
                          <td style={{ fontFamily: F, fontSize: 12, padding: "5px 8px", borderBottom: "1px solid rgba(139,160,180,0.06)" }}>
                            <Badge type={row.status} text={row.status} />
                          </td>
                          <td style={{ fontFamily: F, fontSize: 12, padding: "5px 8px", borderBottom: "1px solid rgba(139,160,180,0.06)" }}>
                            <Badge type={row.confidence} text={row.confidence} />
                          </td>
                          <td style={{ fontFamily: F, fontSize: 12, padding: "5px 8px", borderBottom: "1px solid rgba(139,160,180,0.06)", color: "#888" }}>
                            {row.method}
                          </td>
                          <td style={{ fontFamily: F, fontSize: 12, padding: "5px 8px", borderBottom: "1px solid rgba(139,160,180,0.06)", textAlign: "center" }}>
                            <span style={{ cursor: "pointer", color: "#666", fontSize: 12 }}>✎</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
