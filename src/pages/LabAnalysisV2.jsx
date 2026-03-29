import { useState } from "react";

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
      }} />
    </div>
  );
}
