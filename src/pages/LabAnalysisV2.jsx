import { useState, useCallback } from "react";

const F = "'DM Sans', sans-serif";
const FH = "'EB Garamond', serif";

const metrics = [
  { label: "Dry Matter", value: "30%", sub: "% wb press floor" },
  { label: "Crude Protein", value: "14.5%", sub: "DM Nx6.25" },
  { label: "Lignin ADL", value: "10.78%", sub: "DM BSF gate PASS" },
  { label: "CEC", value: "Data gap", sub: "cmol/kg pending ICP" },
  { label: "N P K", value: "2.32% 0.30% 1.90%", sub: "% DM ICP-OES" },
  { label: "N P\u2082O\u2085 K\u2082O", value: "2.32% 0.69% 2.29%", sub: "% DM" },
  { label: "Per Tonne DM", value: "N: 23.2kg P: 3.0kg K: 19.0kg", sub: "kg per tonne" },
];

const hiddenMetrics = [
  { label: "Cellulase", value: "2-5 U/g" },
  { label: "Xylanase", value: "1-3 U/g" },
];

const COLS = [
  { key: "parameter", label: "PARAMETER", width: 210, align: "left" },
  { key: "unit", label: "UNIT", width: 90, align: "left" },
  { key: "result", label: "RESULT", width: 110, align: "left" },
  { key: "range", label: "RANGE", width: 120, align: "left" },
  { key: "sni", label: "SNI", width: 100, align: "left" },
  { key: "status", label: "STATUS", width: 105, align: "left" },
  { key: "confidence", label: "CONFIDENCE", width: 135, align: "left" },
  { key: "method", label: "METHOD", width: 185, align: "left" },
  { key: "edit", label: "EDIT", width: 110, align: "center" },
];

const BADGE_STYLES = {
  VERIFIED:       { bg: "rgba(114, 223, 166, 0.15)", color: "#72DFA6" },
  PENDING:        { bg: "rgba(245, 166, 35, 0.12)",  color: "#F5A623" },
  "LDE-HIGH":     { bg: "rgba(114, 223, 166, 0.10)", color: "#72DFA6" },
  "LDE-MODERATE": { bg: "rgba(245, 166, 35, 0.10)",  color: "#F5A623" },
  "LDE-LOW":      { bg: "rgba(255, 92, 92, 0.10)",   color: "#FF5C5C" },
};

function Badge({ type, text }) {
  const s = BADGE_STYLES[type] || { bg: "rgba(139,160,180,0.10)", color: "#888" };
  return (
    <span style={{
      background: s.bg, color: s.color, fontFamily: F, fontSize: 11,
      padding: "2px 7px", borderRadius: 3, whiteSpace: "nowrap",
    }}>{text}</span>
  );
}

const ELE_ROWS = [
  { parameter: "Carbon (C)", unit: "% DM", result: "41.41%", range: "42-48%", sni: "—", status: "VERIFIED", confidence: "LDE-HIGH", method: "CHNS Analyser" },
  { parameter: "Nitrogen (N)", unit: "% DM", result: "2.32%", range: "2.0-2.8%", sni: "—", status: "VERIFIED", confidence: "LDE-HIGH", method: "CHNS Analyser" },
  { parameter: "Phosphorus (P)", unit: "% DM", result: "0.39%", range: "0.3-0.5%", sni: "—", status: "VERIFIED", confidence: "LDE-HIGH", method: "ICP-OES" },
  { parameter: "Potassium (K)", unit: "% DM", result: "1.20%", range: "1.0-1.5%", sni: "—", status: "VERIFIED", confidence: "LDE-HIGH", method: "ICP-OES" },
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
  { parameter: "C:N Ratio", unit: "ratio", result: "17.85", range: "15-22", sni: "—", status: "VERIFIED", confidence: "LDE-HIGH", method: "Derived from CHNS" },
];

function EleSection() {
  const [open, setOpen] = useState(true);
  return (
    <div>
      {/* Section Header */}
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          background: "rgba(0, 201, 177, 0.048)", padding: "7px 20px",
          display: "flex", alignItems: "center", gap: 10, cursor: "pointer",
        }}
      >
        <span style={{
          fontSize: 26, color: open ? "#F5A623" : "#FFFFFF",
          transform: open ? "rotate(90deg)" : "rotate(0deg)",
          transition: "transform 0.2s ease, color 0.15s ease",
          display: "inline-block", lineHeight: 1,
        }}>›</span>
        <span style={{ fontFamily: F, fontSize: 10, color: "#F5A623" }}>ELE</span>
        <span style={{ fontFamily: F, fontSize: 13, color: "#40D7C5" }}>Elemental / Nutrient Analysis</span>
        <span style={{ fontFamily: F, fontSize: 12, color: "#666" }}>16 parameters · % DM · mg/kg DM</span>
        <span
          style={{ marginLeft: "auto", color: "#666", cursor: "pointer", fontSize: 14 }}
          onMouseEnter={e => e.currentTarget.style.color = "#FFFFFF"}
          onMouseLeave={e => e.currentTarget.style.color = "#666"}
          onClick={e => e.stopPropagation()}
        >🖨</span>
      </div>
      {open && (
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
            {ELE_ROWS.map((row, idx) => {
              const isEven = idx % 2 === 1;
              const isGap = row.result === "DATA GAP";
              const isSniBlocker = row.sni === "SNI Blocker";
              const isDash = v => v === "—";
              const baseBg = isEven ? "rgba(0, 201, 177, 0.02)" : "#0A1220";
              return (
                <tr
                  key={idx}
                  style={{ background: baseBg }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(0, 201, 177, 0.06)"}
                  onMouseLeave={e => e.currentTarget.style.background = baseBg}
                >
                  <td style={{ fontFamily: F, fontSize: 12, padding: "5px 8px", borderBottom: "1px solid rgba(139,160,180,0.06)", color: "#FFFFFF" }}>{row.parameter}</td>
                  <td style={{ fontFamily: F, fontSize: 12, padding: "5px 8px", borderBottom: "1px solid rgba(139,160,180,0.06)", color: "#888" }}>{row.unit}</td>
                  <td style={{ fontFamily: F, fontSize: 12, padding: "5px 8px", borderBottom: "1px solid rgba(139,160,180,0.06)", color: isGap ? "#FF5C5C" : "#FFFFFF", fontWeight: isGap ? 700 : 400 }}>{row.result}</td>
                  <td style={{ fontFamily: F, fontSize: 12, padding: "5px 8px", borderBottom: "1px solid rgba(139,160,180,0.06)", color: isDash(row.range) ? "#444" : "#FFFFFF" }}>{row.range}</td>
                  <td style={{ fontFamily: F, fontSize: 12, padding: "5px 8px", borderBottom: "1px solid rgba(139,160,180,0.06)", color: isSniBlocker ? "#FF5C5C" : isDash(row.sni) ? "#444" : "#FFFFFF" }}>{row.sni}</td>
                  <td style={{ fontFamily: F, fontSize: 12, padding: "5px 8px", borderBottom: "1px solid rgba(139,160,180,0.06)" }}><Badge type={row.status} text={row.status} /></td>
                  <td style={{ fontFamily: F, fontSize: 12, padding: "5px 8px", borderBottom: "1px solid rgba(139,160,180,0.06)" }}><Badge type={row.confidence} text={row.confidence} /></td>
                  <td style={{ fontFamily: F, fontSize: 12, padding: "5px 8px", borderBottom: "1px solid rgba(139,160,180,0.06)", color: "#888" }}>{row.method}</td>
                  <td style={{ fontFamily: F, fontSize: 12, padding: "5px 8px", borderBottom: "1px solid rgba(139,160,180,0.06)", textAlign: "center" }}><span style={{ cursor: "pointer", color: "#666", fontSize: 12 }}>✎</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default function LabAnalysisV2() {
  const [showEnzymes, setShowEnzymes] = useState(false);

  return (
    <div style={{ fontFamily: F, background: "#060C14", minHeight: "100vh", color: "#FFFFFF" }}>

      {/* ══ HEADER — LOCKED v6 ══ */}
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

      {/* ══ METRICS STRIP ══ */}
      <div style={{
        background: "#0A1220", minHeight: 72,
        display: "flex", alignItems: "center", padding: "8px 17px", gap: 8,
        flexWrap: "wrap",
      }}>
        {metrics.map((m, i) => (
          <div key={i} style={{
            background: "#0D1B2A", border: "1px solid #1A2A3A",
            padding: "8px 12px", flex: "1 1 0", minWidth: 120,
          }}>
            <div style={{ fontFamily: F, fontSize: 13, color: "#888" }}>{m.label}</div>
            <div style={{ fontFamily: F, fontSize: 12, color: "#FFFFFF" }}>{m.value}</div>
            {m.sub && <div style={{ fontFamily: F, fontSize: 10, color: "#666" }}>{m.sub}</div>}
          </div>
        ))}

        {showEnzymes && hiddenMetrics.map((m, i) => (
          <div key={`h${i}`} style={{
            background: "#0D1B2A", border: "1px solid #1A2A3A",
            padding: "8px 12px", flex: "1 1 0", minWidth: 120,
          }}>
            <div style={{ fontFamily: F, fontSize: 13, color: "#888" }}>{m.label}</div>
            <div style={{ fontFamily: F, fontSize: 12, color: "#FFFFFF" }}>{m.value}</div>
          </div>
        ))}

        <div
          onClick={() => setShowEnzymes(!showEnzymes)}
          style={{
            fontFamily: F, fontSize: 12, color: "#00C9B1",
            cursor: "pointer", background: "none", border: "none",
            padding: "8px 12px", whiteSpace: "nowrap",
          }}
        >
          {showEnzymes ? "- Cellulase \u00b7 Xylanase" : "+ Cellulase \u00b7 Xylanase"}
        </div>
      </div>

      {/* ══ BANNER ══ */}
      <div style={{
        background: "#0A1220", fontFamily: F, fontSize: 8, color: "#666",
        textAlign: "center", padding: "4px 0",
      }}>
        Combined S0 Analysis &middot; EFB + OPDC + POS &middot; DM-weighted blend &middot; 60 TPH FFB Mill
      </div>

      {/* ══ MAIN CONTAINER ══ */}
      <div style={{
        height: "calc(100vh - 273px)", overflowY: "auto",
        background: "#060C14", padding: "0 17px",
      }}>
        <EleSection />
      </div>
    </div>
  );
}
