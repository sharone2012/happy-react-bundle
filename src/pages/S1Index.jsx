import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Download } from "lucide-react";

const F = "'DM Sans', sans-serif";
const FH = "'EB Garamond', serif";

export default function S1Index() {
  const navigate = useNavigate();

  const lines = [
    {
      label: "EFB LINE (S1C)", color: "#40D7C5", sub: "8,262 t FW/month · 20 t/h",
      cards: [
        { type: "ASCII PROCESS FLOW", title: "EFB ASCII v2", desc: "10-node elevation profile with oversize return loop, noise zone, and baghouse parallel duct.", route: "/s1-efb-ascii" },
        { type: "CAPEX/OPEX", title: "Building & Equipment Costs", desc: "Building costs, equipment CapEx, and monthly OpEx for EFB line.", route: "/s1-capex-opex" },
        { type: "ENGINEERING SPEC", title: "EFB Engineering Spec", desc: "Detailed equipment specs and datasheets.", route: "/s1-efb-spec" },
      ],
    },
    {
      label: "OPDC LINE (S1B)", color: "#F5A623", sub: "1,256 t FW/month · 5 t/h",
      cards: [
        { type: "ASCII PROCESS FLOW", title: "OPDC ASCII v2", desc: "10-node decanter cake flow with CLASS A gate, 24hr dwell bin, and lump breaker.", route: "/s1-opdc-ascii" },
        { type: "CAPEX/OPEX", title: "Shared with EFB line", desc: "Shared with EFB line — same building and shared equipment.", route: "/s1-capex-opex" },
        { type: "ENGINEERING SPEC", title: "OPDC Engineering Spec", desc: "Detailed equipment specs and datasheets.", route: "/s1-opdc-spec" },
      ],
    },
    {
      label: "POS LINE (S1A)", color: "#4A9EDB", sub: "30 t/day · 1.5 t/h",
      cards: [
        { type: "ASCII PROCESS FLOW", title: "POS ASCII v1", desc: "5-node sludge processing flow with ICP-OES Fe gate and centrate split.", route: "/s1-pos-ascii" },
        { type: "CAPEX/OPEX", title: "POS CapEx/OpEx", desc: "ICP-OES Fe gate pending — costs provisional.", route: "/s1-capex-opex" },
        { type: "ENGINEERING SPEC", title: "POS Engineering Spec", desc: "Detailed equipment specs and datasheets.", route: "/s1-pos-spec" },
      ],
    },
  ];

  const canonicalValues = [
    { label: "FFB Capacity", value: "60 TPH" },
    { label: "Operating", value: "20 hr/day" },
    { label: "EFB Yield", value: "22% of FFB" },
    { label: "OPDC Yield", value: "15.2% of EFB" },
    { label: "POS Volume", value: "30 t/day" },
    { label: "Belt Width", value: "600mm (EFB), 500mm (OPDC)" },
    { label: "DM Target", value: "30% wb" },
    { label: "Lignin Gate", value: "ADL <12% DM" },
  ];

  const guardrails = [
    "MC >=40% LOCKED (CLASS A)",
    "Fe <3000 mg/kg DM target",
    "ADL <12% DM for BSF",
    "C:N 15-22 optimal",
    "pH 4.0-5.0 range",
    "CEC >20 cmol/kg target",
    "No Cr >20 mg/kg",
    "Belt speed locked at spec",
    "All temps <85C",
  ];

  return (
    <div style={{ fontFamily: F, color: "#111" }}>
      {/* ═══ PERSISTENT CFI GLOBAL HEADER ═══ */}
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

      {/* ── Back to S1 Master ── */}
      <div style={{ background: "#060C14", padding: "8px 32px", fontFamily: F }}>
        <a href="/" style={{ color: "#33D4BC", fontSize: 12, fontWeight: 600, textDecoration: "none", fontFamily: F }}
          onMouseEnter={e => e.currentTarget.style.opacity = 0.7}
          onMouseLeave={e => e.currentTarget.style.opacity = 1}>
          ← S1 Master Index
        </a>
      </div>

      {/* ═══ PAGE WRAPPER ═══ */}
      <div style={{ background: "#e0e0e0", display: "flex", justifyContent: "center", padding: "30px 0", minHeight: "calc(100vh - 83px)" }}>
        <div style={{ width: 1000, background: "#FFFFFF", border: "3px solid #111", borderRadius: 0, overflow: "hidden" }}>

          {/* ═══ TOPBAR ═══ */}
          <div style={{
            background: "#0B1422", padding: "10px 20px",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <span style={{ fontFamily: F, fontSize: 10, color: "#40D7C5" }}>CFI S1 Pre-Processing — Master Index</span>
            <span style={{ fontFamily: F, fontSize: 10, color: "#8BA0B4" }}>60 TPH FFB Mill · Bogor, West Java · March 2026 · Rev 01</span>
          </div>

          {/* ═══ HERO CARD ═══ */}
          <div style={{ background: "#060C14", padding: "28px 30px", borderBottom: "3px solid #111" }}>
            <div style={{ fontFamily: F, fontSize: 20, fontWeight: 800, color: "#40D7C5" }}>CFI S1 Master — v3</div>
            <div style={{ fontFamily: F, fontSize: 12, color: "#8BA0B4", marginTop: 4 }}>Pre-Processing Engineering Drawings &amp; Specifications</div>
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              {[
                { text: "LOCKED", bg: "rgba(64,215,197,.12)", border: "rgba(64,215,197,.3)", color: "#40D7C5" },
                { text: "Rev 03", bg: "rgba(64,215,197,.12)", border: "rgba(64,215,197,.3)", color: "#40D7C5" },
                { text: "60 TPH", bg: "rgba(64,215,197,.12)", border: "rgba(64,215,197,.3)", color: "#40D7C5" },
                { text: "3 Lines", bg: "rgba(245,166,35,.12)", border: "rgba(245,166,35,.3)", color: "#F5A623" },
              ].map((b, i) => (
                <span key={i} style={{
                  fontFamily: F, fontSize: 9, fontWeight: 700, padding: "3px 9px",
                  borderRadius: 2, background: b.bg, border: `1px solid ${b.border}`, color: b.color,
                }}>{b.text}</span>
              ))}
            </div>
          </div>

          {/* ═══ LINE GRID ═══ */}
          <div style={{ padding: "24px 30px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
            {lines.map((line, li) => (
              <div key={li}>
                {/* Column header */}
                <div style={{ fontFamily: F, fontSize: 13, fontWeight: 700, color: line.color, marginBottom: 2 }}>{line.label}</div>
                <div style={{ fontFamily: F, fontSize: 10, color: "#888", marginBottom: 10 }}>{line.sub}</div>
                {/* Doc cards */}
                {line.cards.map((card, ci) => (
                  <div
                    key={ci}
                    onClick={() => !card.disabled && card.route && navigate(card.route)}
                    style={{
                      border: "1px solid #ddd", borderRadius: 4, padding: 12, marginBottom: 8,
                      cursor: card.disabled ? "default" : "pointer",
                      opacity: card.disabled ? 0.4 : 1,
                      transition: "border-color 0.15s",
                    }}
                    onMouseEnter={e => { if (!card.disabled) e.currentTarget.style.borderColor = "#40D7C5"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#ddd"; }}
                  >
                    <div style={{ fontFamily: F, fontSize: 9, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 3 }}>{card.type}</div>
                    <div style={{ fontFamily: F, fontSize: 13, fontWeight: 700, color: "#111" }}>{card.title}</div>
                    <div style={{ fontFamily: F, fontSize: 11, color: "#555", marginTop: 2 }}>{card.desc}</div>
                    {!card.disabled && card.route && (
                      <div style={{ fontFamily: F, fontSize: 10, color: "#40D7C5", marginTop: 6 }}>{card.route} →</div>
                    )}
                    {card.disabled && (
                      <div style={{ fontFamily: F, fontSize: 10, color: "#aaa", marginTop: 6 }}>Coming soon</div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* ═══ CANONICAL VALUES REFERENCE ═══ */}
          <div style={{ padding: "20px 30px", borderTop: "1px solid #ddd" }}>
            <div style={{ fontFamily: F, fontSize: 14, fontWeight: 700, color: "#111", marginBottom: 12 }}>Canonical Values Reference</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10 }}>
              {canonicalValues.map((cv, i) => (
                <div key={i} style={{ border: "1px solid #eee", borderRadius: 3, padding: "8px 10px", background: "#fafafa" }}>
                  <div style={{ fontFamily: F, fontSize: 10, color: "#888" }}>{cv.label}</div>
                  <div style={{ fontFamily: F, fontSize: 12, fontWeight: 700, color: "#111", marginTop: 2 }}>{cv.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ═══ S1 ENGINEERING PDF — RFQ PACK ═══ */}
          <div style={{ padding: "20px 30px", borderTop: "1px solid #ddd" }}>
            <div style={{ border: "1.5px solid rgba(51,212,188,0.3)", borderRadius: 6, padding: "20px 24px", background: "#f8fcfb" }}>
              <div style={{ fontFamily: F, fontSize: 10, fontWeight: 700, color: "#33D4BC", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>S1 Engineering PDF</div>
              <div style={{ fontFamily: FH, fontSize: 18, fontWeight: 700, color: "#111", marginBottom: 6 }}>RFQ Pack</div>
              <div style={{ fontFamily: F, fontSize: 12, color: "#555", lineHeight: 1.5, marginBottom: 16 }}>
                22-page complete engineering documentation for all 3 processing lines (EFB, OPDC, POS). Ready for RFQ pack assembly and contractor bidding.
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <a
                  href="https://lcpbtnipkvrmuwllymfw.supabase.co/functions/v1/serve-engineering-pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: F, fontSize: 12, fontWeight: 700, padding: "8px 20px",
                    background: "#33D4BC", color: "#0A1628", borderRadius: 4, textDecoration: "none",
                    display: "inline-flex", alignItems: "center", gap: 6,
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = 0.85}
                  onMouseLeave={e => e.currentTarget.style.opacity = 1}
                >
                  View PDF →
                </a>
                <a
                  href="https://lcpbtnipkvrmuwllymfw.supabase.co/functions/v1/serve-engineering-pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={e => {
                    e.preventDefault();
                    const w = window.open(e.currentTarget.href, '_blank');
                    if (w) { w.onload = () => { w.print(); }; }
                  }}
                  style={{
                    fontFamily: F, fontSize: 12, fontWeight: 700, padding: "8px 20px",
                    background: "transparent", color: "#33D4BC", borderRadius: 4, textDecoration: "none",
                    border: "1.5px solid #33D4BC", display: "inline-flex", alignItems: "center", gap: 6,
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = 0.85}
                  onMouseLeave={e => e.currentTarget.style.opacity = 1}
                >
                  Print
                </a>
              </div>
            </div>
          </div>

          {/* ═══ GUARDRAILS STRIP ═══ */}
          <div style={{ padding: "16px 30px", background: "#fafafa", borderTop: "1px solid #eee" }}>
            <div style={{ fontFamily: F, fontSize: 12, fontWeight: 700, color: "#cc2222", marginBottom: 8 }}>9 Hard Guardrails</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "4px 16px" }}>
              {guardrails.map((g, i) => (
                <div key={i} style={{ fontFamily: F, fontSize: 10, color: "#8b0000", lineHeight: 1.6 }}>⚠ {g}</div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
