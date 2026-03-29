import { useNavigate } from "react-router-dom";

const F = "'DM Mono', monospace";

function NavStrip() {
  const navigate = useNavigate();
  const links = [
    { label: "← S1 INDEX", to: "/s1-index", color: "#40D7C5", weight: 700 },
    { label: "Master (all panes)", to: "/s1-master" },
    { label: "Floor Plans", to: "/s1-combined" },
    { label: "EFB ASCII", to: "/s1-efb-ascii" },
    { label: "OPDC ASCII", to: "/s1-opdc-ascii", active: true },
    { label: "POS ASCII", to: "/s1-pos-ascii" },
  ];
  return (
    <div style={{ width: "100%", background: "#060C14", borderBottom: "2px solid #1E2A3A", fontFamily: F }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", height: 36, padding: "0 12px" }}>
        {links.map((l, i) => (
          <span key={i} onClick={() => navigate(l.to)} style={{
            color: l.active ? "#F5A623" : (l.color || "#8BA0B4"),
            fontSize: 10, fontWeight: l.weight || 400, textDecoration: "none",
            padding: "0 12px", borderRight: i < links.length - 1 ? "1px solid #1E2A3A" : "none",
            marginRight: 6, whiteSpace: "nowrap", cursor: "pointer",
            letterSpacing: i === 0 ? ".06em" : undefined,
          }}
            onMouseEnter={e => { if (!l.active) e.currentTarget.style.color = "#F5A623"; }}
            onMouseLeave={e => { if (!l.active) e.currentTarget.style.color = l.color || "#8BA0B4"; }}
          >{l.label}</span>
        ))}
        <div style={{ flex: 1 }} />
        <span style={{ color: "#3a4a5a", fontSize: 9, fontFamily: F }}>CFI · S1 Pre-Processing · Rev 02 · Mar 2026</span>
      </div>
    </div>
  );
}

function Pre({ children, className, style = {} }) {
  const classStyles = {
    side: { color: "#999" },
    noise: { background: "rgba(204,34,34,.05)", color: "#cc2222" },
    classA: { background: "rgba(204,34,34,.07)", color: "#8b0000" },
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
    <div style={{ background: "#f0f0f0", padding: 24, fontFamily: F, minHeight: "100vh" }}>
      <NavStrip />
      <div style={{ background: "#fff", border: "3px solid #111", width: 1000, margin: "0 auto" }}>
        <div style={{
          background: "#2A1800", color: "#F5A623", padding: "7px 18px", fontSize: 10,
          display: "flex", justifyContent: "space-between", fontFamily: F,
        }}>
          <span>CFI S1B — OPDC LINE · ASCII PROCESS FLOW</span>
          <span>60 TPH FFB Mill · 5 t/h · 500mm belt · Bogor, West Java · March 2026 · CFI-S1-OPDC-ASCII-001 Rev 01</span>
        </div>

        <div style={{ display: "flex" }}>
          <div style={{
            width: 76, flexShrink: 0, borderRight: "1px solid #ddd",
            padding: "0 8px 0 4px", fontSize: 9, color: "#888", textAlign: "right",
            fontFamily: F, lineHeight: 1.7,
          }}>
            <div style={{ paddingTop: 68 }}>±0.0m</div>
            <div style={{ paddingTop: 52 }}>±0.0m</div>
            <div style={{ paddingTop: 56 }}>+3.0m</div>
            <div style={{ paddingTop: 44 }}>+3.5m</div>
            <div style={{ paddingTop: 102 }}>+3.2m</div>
            <div style={{ paddingTop: 68 }}>+4.0m</div>
            <div style={{ paddingTop: 68 }}>+4.0m</div>
            <div style={{ paddingTop: 84 }}>+4.0m</div>
            <div style={{ paddingTop: 44 }}>outside</div>
            <div style={{ paddingTop: 84 }}>+2.5m</div>
          </div>

          <div style={{ flex: 1, padding: "14px 20px 20px 14px", overflowX: "auto" }}>

<Pre>{`  CFI S1B — OPDC LINE PROCESS FLOW
  ═══════════════════════════════════════════════════════════════════════════════════════

  SOURCE : Mill OPDC decanter output · paste form · 1,256 t FW/month
           OPDC yield: 15.2% of EFB fresh weight = 4.2% FFB  (CLASS A locked)
           70–75% MC  ·  30.7% lignin DM  ·  C:N 20  ·  14.5% CP  ·  N 2.32% DM
           Paste form — anti-bridging handling required throughout`}</Pre>

<Pre>{`  ┌───────────────────────────────────────────────────────────────────────────────────┐
  │  RH-OPDC-101   Reciprocating Feeder (anti-bridging)       ±0.0m                  │
  │  Carbon steel · 5.5kW · VFD · anti-bridging cone + pusher plate                 │
  │  IN : 70–75% MC  ·  5 t/h  ·  OPDC decanter paste (paste blinds std hoppers)   │
  └─────────────────────────────┬─────────────────────────────────────────────────────┘
                                │  CV-OPDC-101 · incline feed conveyor
                                │  10m · 15–20° · 4.5kW · 500mm belt · ±0.0 → +3.0m
                                ▼
  ┌───────────────────────────────────────────────────────────────────────────────────┐
  │  CV-OPDC-101   Incline Feed Conveyor                      ±0.0 → +3.0m           │
  │  4.5kW · 500mm belt · 10m · 15–20° inclination                                  │
  │  IN : 70–75% MC  ·  5 t/h                                                       │
  └─────────────────────────────┬─────────────────────────────────────────────────────┘
                                │  OB-02 · 8m level belt · 3.0kW
                                ▼
  ┌───────────────────────────────────────────────────────────────────────────────────┐
  │  OTR-01   Trommel Screen                                  +3.0m                   │
  │  11kW · 5 t/h · rubber isolators ×4 · pad 8m × 3m × 0.4m                       │
  │  IN : 70–75% MC  ·  5 t/h  ·  removes stones + tramp metal                     │
  │  OUT: OPDC forward  ·  stone/metal reject → waste skip                          │
  └─────────────────────────────┬─────────────────────────────────────────────────────┘
                                │  OB-03 · 8m level belt · 3.0kW
                                ▼
  ┌───────────────────────────────────────────────────────────────────────────────────┐
  │  OBM-02   Overband Magnet                                 +3.5m suspended         │
  │  3kW · 3m × 2m · suspended from structure · ferrous removal only                │
  │  IN : 70–75% MC  ·  5 t/h  ·  no t/h capacity limit                            │`}</Pre>

<Pre className="side">{`  │  Ferrous metal ──────────────────────────────────────────────────────────────────▶ waste skip`}</Pre>
<Pre>{`  └─────────────────────────────┬─────────────────────────────────────────────────────┘
                                │  OB-04 · 10m level belt · 3.0kW
                                ▼`}</Pre>

<Pre className="classA">{`  ╔═══════════════════════════════════════════════════════════════════════════════════╗
  ║  OPR-01   Screw Press — CLASS A GATE                      +3.2m                  ║
  ║  37kW · M24×8 anchor bolts · 600mm embedment · pad 3m × 2m × 0.5m              ║
  ║  IN : 70–75% MC  ·  5 t/h  ·  OPDC paste                                       ║
  ║  OUT: 60–62% MC cake  +  filtrate                                                ║
  ║`}</Pre>
<Pre className="classA-sub">{`  ║  [CLASS A GATE]  MC floor ≥ 40% LOCKED · Math.max(40, reading) · NON-NEGOTIABLE  ║
  ║  Pore damage above 40% MC kills BSF colonisation — cannot recover downstream    ║`}</Pre>
<Pre className="side" style={{ background: "rgba(204,34,34,.07)" }}>{`  ║  Filtrate ────────────────────────────────────────────────────────────────────────▶ POME pond ONLY · never to substrate`}</Pre>
<Pre className="classA">{`  ╚═════════════════════════════╦═════════════════════════════════════════════════════╝
                                ║  OB-05 · 10m level belt · 3.0kW
                                ▼`}</Pre>

<Pre>{`  ┌───────────────────────────────────────────────────────────────────────────────────┐
  │  OSD-01   Lump Breaker / Finger-Screw                     +4.0m                   │
  │  22kW · M30×8 · 800mm embedment · finger cage design (NOT a hammer mill)         │
  │  Wet paste requires finger cage — hammer rotor at this stage would mat material  │
  │  IN : 60–62% MC  ·  5 t/h  ·  pressed OPDC cake                                │
  │  OUT: 10–30mm crumbles  ·  suitable for hammer mill feed                        │
  └─────────────────────────────┬─────────────────────────────────────────────────────┘
                                │  OB-06 · 8m level belt · 2.2kW
                                ▼`}</Pre>

<Pre className="noise">{`  ░░░░░░░░░░░░░░░░░░░░░░  NOISE ZONE  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
  ░  Hearing protection + dust mask mandatory beyond this line                     ░░
  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░`}</Pre>

<Pre className="gate-red">{`
  ┌───────────────────────────────────────────────────────────────────────────────────┐
  │  OHM-01   Hammer Mill                                     +4.0m                   │
  │  30kW · SPRING ISOLATION ONLY — never rigid-anchor to slab                       │
  │  Pad 3m × 2.5m × 0.6m · spring mounts · flexible exhaust duct                   │
  │  IN : 60–62% MC  ·  5 t/h derated (65% of nameplate)                           │
  │  OUT: target D90 ≤ 2mm · exhaust → ODC-01 baghouse east wall                    │
  │  [GUARDRAIL]  Spring isolation only · flexible duct only · never rigid mount     │`}</Pre>
<pre style={{ fontFamily: F, fontSize: 11, lineHeight: 1.7, color: "#111", margin: 0, background: "rgba(204,34,34,.06)", whiteSpace: "pre" }}>{`                 │ PASS ≤ 2mm              │ OVERSIZE > 2mm
                 │ → vibrating screen      │ OB-07 return conveyor`}</pre>
<Pre className="side" style={{ background: "rgba(204,34,34,.06)" }}>{`                 │                         └────────────────────────────────────────────▶ ↩ return to OHM-01 ⑦ (re-mill — not back to lump breaker ⑥)`}</Pre>
<Pre className="gate-red">{`  └─────────────────────────────┬─────────────────────────────────────────────────────┘
                                │  OB-06 pass · 8m · 2.2kW → vibrating screen
                                ▼  (exhaust → ODC-01 ducted separately)`}</Pre>

<Pre>{`  ┌───────────────────────────────────────────────────────────────────────────────────┐
  │  OVS-01   Vibrating Screen                                +4.0m                   │
  │  5.5kW · FLEXIBLE MOUNT ONLY · pad 2m × 2m × 0.3m · 2mm aperture               │
  │  IN : 60–62% MC  ·  5 t/h  ·  milled OPDC                                      │`}</Pre>
<Pre className="side">{`  │  Reject > 2mm ───────────────────────────────────────────────────────────────────▶ OB-07 return → OHM-01 ⑦ (re-mill cycle)`}</Pre>
<Pre>{`  │  PASS ≤ 2mm → forward                                                            │
  └─────────────────────────────┬─────────────────────────────────────────────────────┘
                                │  OB-08 · 8m · -5° slope · 2.2kW → buffer bin
                                ▼`}</Pre>

<Pre>{`  ┌───────────────────────────────────────────────────────────────────────────────────┐
  │  ODC-01   Baghouse Dust Filter                            outside east wall       │
  │  15kW · 3,000 m³/hr · 99% dust capture · carbon steel housing                   │
  │  Connected by flexible duct from OHM-01 ⑦ hammer mill exhaust                   │
  │  Dust discharge → solid waste skip or back-blend to OPDC stream                 │
  │  NOTE: parallel unit — operates simultaneously with hammer mill, not in series   │
  └──────────────────── (parallel to main flow — duct feed only) ────────────────────┘
                                │  OB-08 · 8m · -5° slope · 2.2kW → buffer bin
                                ▼`}</Pre>

<Pre className="gate-amber">{`
  ┌───────────────────────────────────────────────────────────────────────────────────┐
  │  BIN-OPDC-301   Buffer Bin — 24hr Dwell                   +2.5m                   │
  │  15 m³  ·  2.2kW live-bottom auger  ·  holds 6–10 t at 45–55% MC               │
  │  pH probe · temp sensor · monitor every 8hrs · do not blend until gate clears   │
  │  IN : 60–62% MC  ·  D90 ≤ 2mm  ·  milled OPDC cake                            │
  │  [GATE C.G2/G3]  Dwell ≥ 24hrs · pH 8.0–9.0 required before S2 transfer        │
  │  OUT: metered feed to S2 at confirmed pH + dwell window                         │
  └─────────────────────────────┬─────────────────────────────────────────────────────┘
                                │  BC-11 · 10m → conveyor gallery (25m × 4m covered)
                                ▼`}</Pre>

<Pre className="final">{`  ╔═════════════════════════════════════════════════════════════════════════════════════╗
  ║  S2 DISCHARGE — OPDC MILLED TO S2 CHEMICAL TREATMENT                              ║
  ║  Handoff state:  60–62% MC  ·  D90 ≤ 2mm  ·  pH 8.0–9.0  ·  dwell ≥ 24hrs     ║
  ║  Daily NPK contribution at 60 TPH:  N 582 kg · P 197 kg · K 930 kg (3 streams)  ║
  ╚═════════════════════════════════════════════════════════════════════════════════════╝`}</Pre>

            <div style={{
              marginTop: 14, borderTop: "1px solid #ddd", paddingTop: 10,
              fontSize: 10, color: "#666", lineHeight: 1.9, fontFamily: F,
            }}>
              <strong>Legend</strong><br />
              ┌───┐  Process unit / vessel<br />
              ╔═══╗  Critical CLASS A gate — hard limit, non-negotiable<br />
              ═════  S2 discharge / final handoff (amber on dark bg)<br />
              ─────  Primary OPDC solid flow path · 500mm belt<br />
              <span style={{ color: "#999" }}>──▶  Side stream — filtrate to POME pond · ferrous to waste skip · oversize return</span><br />
              ↩ OB-07  Oversize return conveyor loop — back into OHM-01 ⑦ hammer mill for re-milling (not back to lump breaker ⑥)<br />
              <span style={{ color: "#cc2222" }}>░░░  Noise zone boundary — spring isolation + flexible mounts mandatory inside</span><br />
              <span style={{ color: "#8b0000" }}>[CLASS A GATE]  Red double border — MC ≥ 40% floor · Math.max(40, reading) · BSF colonisation guardrail</span><br />
              <span style={{ color: "#7a4800" }}>[GATE C.G2/G3]  Amber — 24hr dwell + pH 8.0–9.0 confirmed before S2 transfer</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
