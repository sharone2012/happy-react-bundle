import { useState } from "react";

const F = "'DM Sans', sans-serif";
const FH = "'EB Garamond', serif";

function Pre({ children, className, style = {} }) {
  const classStyles = {
    side: { color: "#999" },
    noise: { background: "rgba(204,34,34,.05)", color: "#cc2222" },
    classA: { background: "rgba(204,34,34,.07)", color: "#8b0000", border: "none" },
    "classA-sub": { background: "rgba(204,34,34,.07)", color: "#cc2222" },
    "gate-amber": { background: "rgba(200,134,10,.07)", color: "#7a4800" },
    "gate-red": { background: "rgba(204,34,34,.06)", color: "#8b0000" },
    final: { background: "#2A1800", color: "#F5A623" },
  };
  return (
    <pre style={{
      fontFamily: F, fontSize: 11, lineHeight: 1.7, color: "#111",
      margin: 0, padding: 0, background: "none", whiteSpace: "pre",
      ...(className ? classStyles[className] || {} : {}), ...style,
    }}>{children}</pre>
  );
}

export default function S1OpdcAscii() {
  return (
    <div style={{ background: "#f0f0f0", fontFamily: F, minHeight: "100vh" }}>
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

      <div style={{ display: "flex", justifyContent: "center", padding: "24px 0" }}>
      <div style={{ background: "#fff", border: "3px solid #111", width: 1000 }}>
        {/* topbar */}
        <div style={{
          background: "#2A1800", color: "#F5A623", padding: "8px 12px", fontSize: 10,
          display: "flex", justifyContent: "space-between", fontFamily: F,
        }}>
          <span>CFI S1B — OPDC LINE · ASCII PROCESS FLOW</span>
          <span>60 TPH FFB Mill · 5 t/h · 500mm belt · Bogor, West Java · March 2026 · CFI-S1-OPDC-ASCII-001 Rev 01</span>
        </div>

        <div style={{ display: "flex" }}>
          {/* elevation axis */}
          <div style={{
            width: 76, flexShrink: 0, borderRight: "1px solid #ddd",
            padding: "0 8px 0 4px", fontSize: 9, color: "#888", textAlign: "right",
            fontFamily: F, lineHeight: 1.7,
          }}>
            <div style={{ paddingTop: 68 }}>+1.0m</div>
            <div style={{ paddingTop: 52 }}>+1.0m</div>
            <div style={{ paddingTop: 56 }}>+3.5m</div>
            <div style={{ paddingTop: 44 }}>+3.5m</div>
            <div style={{ paddingTop: 102 }}>+3.5m</div>
            <div style={{ paddingTop: 68 }}>+3.0m</div>
            <div style={{ paddingTop: 68 }}>+1.5m</div>
            <div style={{ paddingTop: 84 }}>+1.0m</div>
            <div style={{ paddingTop: 44 }}>+0.8m</div>
            <div style={{ paddingTop: 84 }}>+0.3m</div>
          </div>

          {/* flow */}
          <div style={{ flex: 1, padding: "14px 20px 20px 14px", overflowX: "auto" }}>

<Pre>{`  CFI S1B — OPDC LINE PROCESS FLOW
  ═══════════════════════════════════════════════════════════════════════════════════════

  SOURCE : Mill OPDC decanter output · paste form · 1,256 t FW/month
           OPDC yield: 15.2% of EFB fresh weight = 4.2% FFB  (CLASS A locked)
           70–75% MC  ·  30.7% lignin DM  ·  C:N 20  ·  14.5% CP  ·  N 2.32% DM
           Paste form — anti-bridging handling required throughout`}</Pre>

<Pre>{`  ┌───────────────────────────────────────────────────────────────────────────────────┐
  │  RH-OPDC-101   Receiving Hopper (anti-bridging)            +1.0m                  │
  │  SS304 · 10m³ · anti-bridging auger · 0.75kW                                     │
  │  IN : 70–75% MC  ·  5 t/h  ·  OPDC decanter paste                               │
  └─────────────────────────────┬─────────────────────────────────────────────────────┘
                                │  CV-OPDC-101 · incline belt conveyor
                                │  500mm · enclosed · 12m · 1.1kW · +1.0 → +3.5m
                                ▼`}</Pre>

<Pre>{`  ┌───────────────────────────────────────────────────────────────────────────────────┐
  │  CV-OPDC-101   Belt Conveyor                               +1.0 → +3.5m           │
  │  1.1kW · 500mm enclosed belt · 12m                                                │
  │  IN : 70–75% MC  ·  5 t/h                                                        │
  └─────────────────────────────┬─────────────────────────────────────────────────────┘
                                │  OB-02 · 8m level belt · 3.0kW
                                ▼`}</Pre>

<Pre className="classA">{`  ╔═══════════════════════════════════════════════════════════════════════════════════╗
  ║  OPR-01   Screw Press — CLASS A GATE                       +3.5m                  ║
  ║  7.5kW · screw press · MC 72% → 45%                                              ║
  ║  IN : 70–75% MC  ·  5 t/h  ·  OPDC paste                                        ║
  ║  OUT: 60–62% MC cake  +  filtrate                                                 ║
  ║`}</Pre>
<Pre className="classA-sub">{`  ║  [CLASS A GATE]  MC floor ≥ 40% LOCKED · Math.max(40, reading) · NON-NEGOTIABLE  ║
  ║  Pore damage above 40% MC kills BSF colonisation — cannot recover downstream    ║`}</Pre>
<Pre className="side" style={{ background: "rgba(204,34,34,.07)" }}>{`  ║  Filtrate ────────────────────────────────────────────────────────────────────────▶ POME pond ONLY · never to substrate`}</Pre>
<Pre className="classA">{`  ╚═════════════════════════════╦═════════════════════════════════════════════════════╝
                                ║  OB-03 · 8m level belt · 3.0kW
                                ▼`}</Pre>

<Pre>{`  ┌───────────────────────────────────────────────────────────────────────────────────┐
  │  OLB-01   Lump Breaker                                     +3.0m                   │
  │  Twin-roll · 3kW · 30mm output                                                    │
  │  IN : 60–62% MC  ·  5 t/h  ·  pressed OPDC cake                                  │
  │  OUT: 30mm crumbles · suitable for trommel screen feed                            │
  └─────────────────────────────┬─────────────────────────────────────────────────────┘
                                │  CV-OPDC-201 · 500mm · 8m decline · +3.0 → +1.5m
                                ▼`}</Pre>

<Pre>{`  ┌───────────────────────────────────────────────────────────────────────────────────┐
  │  CV-OPDC-201   Belt Conveyor 2                             +3.0 → +1.5m            │
  │  500mm · 8m decline belt                                                           │
  │  IN : 60–62% MC  ·  5 t/h                                                        │
  └─────────────────────────────┬─────────────────────────────────────────────────────┘
                                │
                                ▼`}</Pre>

<Pre>{`  ┌───────────────────────────────────────────────────────────────────────────────────┐
  │  OTR-01   Trommel Screen                                   +1.5m                   │
  │  1.8m dia × 4m · 25mm aperture · 2.2kW                                            │
  │  IN : 60–62% MC  ·  5 t/h  ·  removes oversize + tramp material                  │
  │  OUT: OPDC forward  ·  oversize reject → waste skip                               │
  └─────────────────────────────┬─────────────────────────────────────────────────────┘
                                │
                                ▼`}</Pre>

<Pre className="gate-amber">{`  ┌───────────────────────────────────────────────────────────────────────────────────┐
  │  ODR-01   Rotary Dryer                                     +1.0m                   │
  │  Co-current · 11kW · 30min residence time                                         │
  │  IN : 60–62% MC  ·  5 t/h                                                        │
  │  OUT: target MC ≤ 35%                                                              │
  │  [AMBER GATE]  MC ≤ 35% target — operator confirms before hammer mill             │
  └─────────────────────────────┬─────────────────────────────────────────────────────┘
                                │
                                ▼`}</Pre>

<Pre className="noise">{`  ░░░░░░░░░░░░░░░░░░░░░░  NOISE ZONE  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
  ░  Hearing protection + dust mask mandatory — 82+ dBA                             ░░
  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░`}</Pre>

<Pre className="gate-red">{`
  ┌───────────────────────────────────────────────────────────────────────────────────┐
  │  OHM-01   Hammer Mill                                      +0.8m                   │
  │  22kW · 6mm screen · 1500 RPM                                                     │
  │  SPRING ISOLATION ONLY — never rigid-anchor to slab                               │
  │  IN : ≤35% MC  ·  5 t/h derated                                                  │
  │  OUT: target D90 ≤ 2mm                                                             │`}</Pre>
<pre style={{ fontFamily: F, fontSize: 11, lineHeight: 1.7, color: "#111", margin: 0, background: "rgba(204,34,34,.06)", whiteSpace: "pre" }}>{`                 │ PASS ≤ 2mm              │ OVERSIZE > 2mm
                 │ → vibrating screen      │ return conveyor`}</pre>
<Pre className="side" style={{ background: "rgba(204,34,34,.06)" }}>{`                 │                         └────────────────────────────────────────────▶ ↩ return to OHM-01 (re-mill)`}</Pre>
<Pre className="gate-red">{`  └─────────────────────────────┬─────────────────────────────────────────────────────┘
                                │
                                ▼`}</Pre>

<Pre>{`  ┌───────────────────────────────────────────────────────────────────────────────────┐
  │  OVS-01   Vibrating Screen                                 +0.5m                   │
  │  3mm single deck · 2.2kW                                                           │
  │  IN : ≤35% MC  ·  5 t/h  ·  milled OPDC                                          │`}</Pre>
<Pre className="side">{`  │  Reject > 3mm ───────────────────────────────────────────────────────────────────▶ return → OHM-01 (re-mill cycle)`}</Pre>
<Pre>{`  │  PASS ≤ 3mm → forward                                                             │
  └─────────────────────────────┬─────────────────────────────────────────────────────┘
                                │
                                ▼`}</Pre>

<Pre className="gate-amber">{`  ┌───────────────────────────────────────────────────────────────────────────────────┐
  │  BIN-OPDC-301   Product Bin — 24HR DWELL GATE              +0.3m                   │
  │  20m³ · sealed · moisture-controlled                                               │
  │  IN : ≤35% MC  ·  D90 ≤ 3mm  ·  milled OPDC                                     │
  │  [24HR DWELL GATE]  Dwell ≥ 24hrs · pH 8.0–9.0 required before S2 transfer       │
  │  OUT: metered feed to S2 at confirmed pH + dwell window                           │
  └─────────────────────────────┬─────────────────────────────────────────────────────┘
                                │  BC-11 · 10m → conveyor gallery
                                ▼`}</Pre>

<Pre className="final">{`  ╔═════════════════════════════════════════════════════════════════════════════════════╗
  ║  S2 DISCHARGE — OPDC DM product to S2 Composting/BSF                               ║
  ║  Handoff state:  ≤35% MC  ·  D90 ≤ 3mm  ·  pH 8.0–9.0  ·  dwell ≥ 24hrs        ║
  ╚═════════════════════════════════════════════════════════════════════════════════════╝`}</Pre>

            {/* legend */}
            <div style={{
              marginTop: 14, borderTop: "1px solid #ddd", paddingTop: 10,
              fontSize: 10, color: "#666", lineHeight: 1.9, fontFamily: F,
            }}>
              <strong>Legend</strong><br />
              ┌───┐  Process unit / vessel<br />
              ╔═══╗  Critical CLASS A gate — hard limit, non-negotiable (double-border red)<br />
              ═════  S2 discharge / final handoff (amber on dark bg)<br />
              ─────  Primary OPDC solid flow path · 500mm belt<br />
              <span style={{ color: "#999" }}>──▶  Side stream — filtrate to POME pond · metal to waste skip · oversize return</span><br />
              <span style={{ color: "#cc2222" }}>░░░  Noise zone boundary — 82+ dBA — PPE required</span><br />
              <span style={{ color: "#7a4800" }}>[AMBER GATE]  MC ≤ 35% target / 24hr dwell check</span><br />
              <span style={{ color: "#8b0000" }}>[CLASS A]  MC ≥ 40% LOCKED — non-negotiable hard limit</span>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
