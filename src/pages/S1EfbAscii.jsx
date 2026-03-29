import { useNavigate } from "react-router-dom";

const F = "'DM Sans', sans-serif";
const FH = "'EB Garamond', serif";

function NavStrip() {
  const navigate = useNavigate();
  const links = [
    { label: "← S1 INDEX", to: "/s1-index", color: "#40D7C5", weight: 700 },
    { label: "Master (all panes)", to: "/s1-master" },
    { label: "Floor Plans", to: "/s1-combined" },
    { label: "EFB ASCII", to: "/s1-efb-ascii", active: true },
    { label: "OPDC ASCII", to: "/s1-opdc-ascii" },
    { label: "POS ASCII", to: "/s1-pos-ascii" },
  ];
  return (
    <div style={{ width: "100%", background: "#060C14", borderBottom: "2px solid #1E2A3A", fontFamily: F }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", height: 36, padding: "0 12px" }}>
        {links.map((l, i) => (
          <span key={i}
            onClick={() => navigate(l.to)}
            style={{
              color: l.active ? "#40C8C0" : (l.color || "#8BA0B4"),
              fontSize: 10, fontWeight: l.weight || 400, textDecoration: "none",
              padding: "0 12px", borderRight: i < links.length - 1 ? "1px solid #1E2A3A" : "none",
              marginRight: 6, whiteSpace: "nowrap", cursor: "pointer",
              letterSpacing: i === 0 ? ".06em" : undefined,
            }}
            onMouseEnter={e => { if (!l.active) e.currentTarget.style.color = "#40C8C0"; }}
            onMouseLeave={e => { if (!l.active) e.currentTarget.style.color = l.color || "#8BA0B4"; }}
          >{l.label}</span>
        ))}
        <div style={{ flex: 1 }} />
        <span style={{ color: "#3a4a5a", fontSize: 9, fontFamily: F }}>CFI · S1 Pre-Processing · Rev 02 · Mar 2026</span>
      </div>
    </div>
  );
}

export default function S1EfbAscii() {
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

      {/* ── Breadcrumb + Back ── */}
      <div style={{ background: "#060C14", padding: "8px 32px", fontFamily: F }}>
        <div style={{ fontSize: 12, fontFamily: F, marginBottom: 4 }}>
          <a href="/" style={{ color: "#8BA0B4", textDecoration: "none" }}>CFI Platform</a>
          <span style={{ color: "#3a4a5a", margin: "0 6px" }}>›</span>
          <a href="/s1-capex-opex" style={{ color: "#8BA0B4", textDecoration: "none" }}>S1 Pre-Processing</a>
          <span style={{ color: "#3a4a5a", margin: "0 6px" }}>›</span>
          <span style={{ color: "#fff", fontWeight: 700 }}>EFB ASCII Flow</span>
        </div>
        <a href="/s1-capex-opex" style={{ color: "#00C9B1", fontSize: 14, fontWeight: 500, textDecoration: "none", fontFamily: F }} onMouseEnter={e => e.currentTarget.style.opacity = 0.7} onMouseLeave={e => e.currentTarget.style.opacity = 1}>← Back to CapEx / OpEx</a>
      </div>

      <div style={{ display: "flex", justifyContent: "center", padding: "24px 0" }}>
      <div style={{ background: "#fff", border: "3px solid #111", width: 1000 }}>
        {/* topbar */}
        <div style={{
          background: "#0B3A4A", color: "#40C8C0", padding: "7px 18px", fontSize: 10,
          display: "flex", justifyContent: "space-between", fontFamily: F,
        }}>
          <span>CFI S1C — EFB LINE · ASCII PROCESS FLOW</span>
          <span>60 TPH FFB Mill · 20 t/h · 600mm belt · Bogor, West Java · March 2026</span>
        </div>

        <div style={{ display: "flex" }}>
          {/* elevation axis */}
          <div style={{
            width: 76, flexShrink: 0, borderRight: "1px solid #ddd",
            padding: "0 8px 0 4px", fontSize: 9, color: "#888", textAlign: "right",
            fontFamily: F, lineHeight: 1.7,
          }}>
            <div style={{ paddingTop: 68 }}>±0.0m</div>
            <div style={{ paddingTop: 52 }}>±0.0m</div>
            <div style={{ paddingTop: 56 }}>+3.0m</div>
            <div style={{ paddingTop: 44 }}>+3.5m</div>
            <div style={{ paddingTop: 84 }}>+3.2m</div>
            <div style={{ paddingTop: 68 }}>+4.0m</div>
            <div style={{ paddingTop: 84 }}>+4.0m</div>
            <div style={{ paddingTop: 84 }}>+4.0m</div>
            <div style={{ paddingTop: 44 }}>outside</div>
            <div style={{ paddingTop: 56 }}>+2.5m</div>
          </div>

          {/* flow */}
          <div style={{ flex: 1, padding: "14px 20px 20px 14px", overflowX: "auto" }}>
            <Pre>{`  CFI S1C — EFB LINE PROCESS FLOW
  ═══════════════════════════════════════════════════════════════════════════════════

  SOURCE : Mill EFB trucks · truck receiving bay · 15m wide receiving area
           8,262 t FW/month  ·  62.5% MC  ·  22% lignin DM  ·  C:N 60  ·  4.75% CP`}</Pre>

            <Pre>{`  ┌─────────────────────────────────────────────────────────────────────────────────┐
  │  RH-EFB-101   Hydraulic Reciprocating Feeder              ±0.0m                │
  │  Carbon steel · 7.5kW · VFD · anti-bridging design                            │
  │  IN : 62.5% MC  ·  20 t/h  ·  EFB raw bunches from truck bay                 │
  └────────────────────────────┬────────────────────────────────────────────────────┘
                               │  CV-EFB-101 · incline apron conveyor
                               │  15m · 15–20° · 7.5kW · 600mm belt · ±0.0 → +3.0m
                               ▼`}</Pre>

            <Pre>{`  ┌─────────────────────────────────────────────────────────────────────────────────┐
  │  CV-EFB-101   Incline Apron Conveyor                      ±0.0 → +3.0m         │
  │  7.5kW · 600mm belt · 15m · 15–20° inclination · rubber-lined chute at head   │
  │  IN : 62.5% MC  ·  20 t/h                                                     │
  └────────────────────────────┬────────────────────────────────────────────────────┘
                               │  EB-02 · 8m level belt · 3.0kW
                               ▼`}</Pre>

            <Pre>{`  ┌─────────────────────────────────────────────────────────────────────────────────┐
  │  ETR-01   Trommel Screen                                  +3.0m                 │
  │  11kW · 20 t/h · rubber isolators ×4 corners · pad 8m × 3m × 0.4m            │
  │  IN : 62.5% MC  ·  20 t/h  ·  removes stones + tramp metal                   │
  │  OUT: EFB forward  ·  stone/metal reject → waste skip                         │
  └────────────────────────────┬────────────────────────────────────────────────────┘
                               │  EB-03 · 8m level belt · 3.0kW
                               ▼`}</Pre>

            <Pre>{`  ┌─────────────────────────────────────────────────────────────────────────────────┐
  │  OBM-01   Overband Magnet                                 +3.5m suspended       │
  │  3kW · 3m × 2m · suspended from structure · ferrous removal only               │
  │  IN : 62.5% MC  ·  20 t/h  ·  no t/h capacity limit                          │`}</Pre>
            <Pre className="side">{`  │  Ferrous metal ───────────────────────────────────────────────────────────────▶ waste skip`}</Pre>
            <Pre>{`  └────────────────────────────┬────────────────────────────────────────────────────┘
                               │  EB-04 · 10m level belt · 3.0kW
                               ▼`}</Pre>

            <Pre className="gate-amber">{`  ┌─────────────────────────────────────────────────────────────────────────────────┐
  │  EPR-01   Screw Press                                     +3.2m                 │
  │  37kW · M24×8 anchor bolts · 600mm embedment · pad 3m × 2m × 0.5m             │
  │  IN : 70% MC  ·  20 t/h  ·  pressed EFB                                       │
  │  OUT: 45–50% MC cake  +  press water                                           │
  │  [GATE B.G2]  Operator confirms MC ≤ 50% before proceeding to shredder         │`}</Pre>
            <Pre className="side" style={{ background: "rgba(200,134,10,.06)" }}>{`  │  Press water ──────────────────────────────────────────────────────────────────▶ POME pond ONLY · never to substrate`}</Pre>
            <Pre className="gate-amber">{`  └────────────────────────────┬────────────────────────────────────────────────────┘
                               │  EB-05 · 10m level belt · 3.0kW
                               ▼`}</Pre>

            <Pre>{`  ┌─────────────────────────────────────────────────────────────────────────────────┐
  │  ESD-01   Primary Shredder                                +4.0m                 │
  │  37kW · M30×8 anchor bolts · 800mm embedment · pad 4m × 3m × 0.6m             │
  │  IN : 45–50% MC  ·  20 t/h  ·  pressed EFB                                    │
  │  OUT: 50–100mm particle size                                                   │
  └────────────────────────────┬────────────────────────────────────────────────────┘
                               │  EB-06 · 8m level belt · 2.2kW
                               ▼`}</Pre>

            <Pre className="noise">{`  ░░░░░░░░░░░░░░░░░░░░░░  NOISE ZONE  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
  ░  Hearing protection + dust mask mandatory beyond this line                    ░░
  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░`}</Pre>

            <Pre className="gate-red">{`
  ┌─────────────────────────────────────────────────────────────────────────────────┐
  │  EHM-01   Hammer Mill                                     +4.0m                 │
  │  37kW · SPRING ISOLATION ONLY — never rigid-anchor to slab                     │
  │  Pad 3m × 2.5m × 0.6m · spring mounts · flexible exhaust duct                 │
  │  IN : 45–50% MC  ·  15 t/h derated (65% of nameplate · 37kW motor)             │
  │  OUT: target D90 ≤ 2mm · exhaust → EDC-01 baghouse east wall                  │
  │  [GUARDRAIL]  Spring isolation only · flexible duct only · never rigid mount   │`}</Pre>
            <pre style={{ fontFamily: F, fontSize: 11, lineHeight: 1.7, color: "#111", margin: 0, background: "rgba(204,34,34,.06)", whiteSpace: "pre" }}>{`                 │ PASS ≤ 2mm              │ OVERSIZE > 2mm
                 │ → vibrating screen      │ EB-07 return conveyor`}</pre>
            <Pre className="side" style={{ background: "rgba(204,34,34,.06)" }}>{`                 │                         └──────────────────────────────────────────▶ ↩ return to EHM-01 ⑦ (re-mill — not back to shredder)`}</Pre>
            <Pre className="gate-red">{`  │  [GATE B.G1]  Shift sieve confirms D90 ≤ 2mm before S2 transfer               │
  └────────────────────────────┬────────────────────────────────────────────────────┘
                               │  EB-06 pass · 8m · 2.2kW → vibrating screen
                               ▼  (exhaust → EDC-01 ducted separately)`}</Pre>

            <Pre>{`  ┌─────────────────────────────────────────────────────────────────────────────────┐
  │  EVS-01   Vibrating Screen                                +4.0m                 │
  │  7.5kW · FLEXIBLE MOUNT ONLY · pad 2m × 2m × 0.3m · 2mm aperture             │
  │  IN : 45–50% MC  ·  15 t/h  ·  milled EFB                                    │`}</Pre>
            <Pre className="side">{`  │  Reject > 2mm ─────────────────────────────────────────────────────────────────▶ EB-07 return → EHM-01 ⑦ (re-mill cycle)`}</Pre>
            <Pre>{`  │  PASS ≤ 2mm → forward                                                          │
  └────────────────────────────┬────────────────────────────────────────────────────┘
                               │  EB-08 · 8m · -5° slope · 2.2kW → buffer bin
                               ▼`}</Pre>

            <Pre>{`  ┌─────────────────────────────────────────────────────────────────────────────────┐
  │  EDC-01   Baghouse Dust Filter                            outside east wall     │
  │  15kW · 3,000 m³/hr · 99% dust capture · carbon steel housing                 │
  │  Connected by flexible duct from EHM-01 ⑦ hammer mill exhaust                 │
  │  Dust discharge → solid waste skip or back-blend to EFB stream                │
  │  NOTE: parallel unit — operates simultaneously with hammer mill, not in series │
  └──────────────────── (parallel to main flow — duct feed only) ──────────────────┘
                               │  EB-08 · 8m · -5° slope · 2.2kW → buffer bin
                               ▼`}</Pre>

            <Pre>{`  ┌─────────────────────────────────────────────────────────────────────────────────┐
  │  BIN-EFB-201   Buffer Bin — EFB                           +2.5m                 │
  │  50 m³  ·  3kW live-bottom auger  ·  4–6hr buffer at 20 t/h                   │
  │  IN : 45–50% MC  ·  D90 ≤ 2mm  ·  particle size confirmed                    │
  │  OUT: metered feed to S2 conveyor gallery                                      │
  └────────────────────────────┬────────────────────────────────────────────────────┘
                               │  BC-10 · 10m → conveyor gallery (25m × 4m covered)
                               ▼`}</Pre>

            <Pre className="final">{`  ╔═════════════════════════════════════════════════════════════════════════════════╗
  ║  S2 DISCHARGE — EFB MILLED TO S2 CHEMICAL TREATMENT                            ║
  ║  Handoff state:  45–50% MC  ·  D90 ≤ 2mm  ·  20 t/h  ·  600mm belt           ║
  ║  Daily NPK contribution at 60 TPH:  N 582 kg · P 197 kg · K 930 kg (3 streams)║
  ╚═════════════════════════════════════════════════════════════════════════════════╝`}</Pre>

            {/* legend */}
            <div style={{
              marginTop: 14, borderTop: "1px solid #ddd", paddingTop: 10,
              fontSize: 10, color: "#666", lineHeight: 1.9, fontFamily: F,
            }}>
              <strong>Legend</strong><br />
              ┌───┐  Process unit / vessel<br />
              ═════  S2 discharge / final handoff (teal on dark bg)<br />
              ─────  Primary EFB solid flow path · 600mm belt<br />
              <span style={{ color: "#999" }}>──▶  Side stream — press water to POME pond · metal/stone to waste skip · oversize return</span><br />
              ↩ EB-07  Oversize return conveyor loop — back into EHM-01 ⑦ hammer mill for re-milling (not back to shredder ⑥)<br />
              <span style={{ color: "#cc2222" }}>░░░  Noise zone boundary — spring isolation + flexible mounts mandatory inside</span><br />
              <span style={{ color: "#7a4800" }}>[GATE B.G2]  Amber — operator MC check ≤ 50% before screw press discharge proceeds</span><br />
              <span style={{ color: "#8b0000" }}>[GATE B.G1]  Red — shift sieve confirms D90 ≤ 2mm before S2 transfer</span>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

/* styled pre helper */
function Pre({ children, className, style = {} }) {
  const classStyles = {
    side: { color: "#999" },
    noise: { background: "rgba(204,34,34,.05)", color: "#cc2222" },
    "gate-amber": { background: "rgba(200,134,10,.06)", color: "#7a4800" },
    "gate-red": { background: "rgba(204,34,34,.06)", color: "#8b0000" },
    final: { background: "#0B3A4A", color: "#40C8C0" },
  };
  return (
    <pre style={{
      fontFamily: "'DM Sans', sans-serif", fontSize: 11, lineHeight: 1.7,
      color: "#111", margin: 0, padding: 0, background: "none", whiteSpace: "pre",
      ...(className ? classStyles[className] || {} : {}),
      ...style,
    }}>{children}</pre>
  );
}
