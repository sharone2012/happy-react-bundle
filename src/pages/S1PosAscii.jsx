import { useNavigate } from "react-router-dom";

const F = "'DM Sans', sans-serif";
const FH = "'EB Garamond', serif";

function Pre({ children, className, style = {} }) {
  const classStyles = {
    side: { color: "#999" },
    "gate-blue": { background: "rgba(74,158,219,.08)", color: "#4A9EDB", border: "1px solid #4A9EDB", borderBottom: "none", padding: "0 8px" },
    "gate-blue-mid": { background: "rgba(74,158,219,.08)", color: "#4A9EDB", borderLeft: "1px solid #4A9EDB", borderRight: "1px solid #4A9EDB", padding: "0 8px" },
    "gate-blue-end": { background: "rgba(74,158,219,.08)", color: "#4A9EDB", border: "1px solid #4A9EDB", borderTop: "none", padding: "0 8px" },
    final: { color: "#40D7C5", background: "#0B1422" },
  };
  return (
    <pre style={{ fontFamily: F, fontSize: 11, lineHeight: 1.7, color: "#111", margin: 0, padding: 0, background: "none", border: "none", whiteSpace: "pre", ...(classStyles[className] || {}), ...style }}>
      {children}
    </pre>
  );
}

export default function S1PosAscii() {
  const navigate = useNavigate();
  return (
    <div style={{ fontFamily: F, background: "#f0f0f0", minHeight: "100vh" }}>
      {/* Global Header */}
      <div style={{ position: "sticky", top: 0, zIndex: 100, background: "#0A1628", borderBottom: "1px solid rgba(51,212,188,0.15)", height: 83, display: "flex", alignItems: "center", padding: "0 32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div>
            <span style={{ fontFamily: FH, fontWeight: 700, fontSize: 26, color: "#fff", letterSpacing: ".01em" }}>CFI</span>
            <span style={{ fontFamily: FH, fontWeight: 700, fontSize: 26, color: "#33D4BC", letterSpacing: ".01em", marginLeft: 8 }}>Deep Tech</span>
          </div>
          <div style={{ width: 1, height: 36, background: "rgba(51,212,188,0.3)", margin: "0 10px" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <span style={{ fontFamily: F, fontSize: 12, fontWeight: 700, color: "#8BA0B4", letterSpacing: ".04em" }}>Precision Engineering</span>
            <span style={{ fontFamily: F, fontSize: 12, fontWeight: 700, color: "#8BA0B4", letterSpacing: ".04em" }}>Applied Biology</span>
          </div>
        </div>
        <div style={{ flex: 1 }} />
        <span onClick={() => navigate("/")} style={{ fontFamily: F, fontSize: 11, color: "#4A9EDB", cursor: "pointer" }}>← Home</span>
      </div>

      {/* ── Back to S1 Master ── */}
      <div style={{ background: "#060C14", padding: "8px 32px", fontFamily: F }}>
        <a href="/s1-index" style={{ color: "#33D4BC", fontSize: 12, fontWeight: 600, textDecoration: "none", fontFamily: F }} onMouseEnter={e => e.currentTarget.style.opacity = 0.7} onMouseLeave={e => e.currentTarget.style.opacity = 1}>← S1 Master Index</a>
      </div>

      <div style={{ background: "#fff", border: "3px solid #111", width: 960, margin: "24px auto", padding: 0 }}>
        {/* Topbar */}
        <div style={{ background: "#0B1422", color: "#40D7C5", padding: "8px 18px", fontSize: 10, display: "flex", justifyContent: "space-between", fontFamily: F }}>
          <span>CFI S1A — POS LINE · ASCII PROCESS FLOW</span>
          <span>60 TPH FFB Mill · Bogor, West Java · March 2026 · CFI-S1-POS-ASCII-001 Rev 01</span>
        </div>

        <div style={{ display: "flex" }}>
          {/* Elevation axis */}
          <div style={{ width: 76, flexShrink: 0, borderRight: "1px solid #ddd", padding: "16px 8px 0 4px", fontSize: 9, color: "#888", textAlign: "right", lineHeight: 1.6, fontFamily: F, display: "flex", flexDirection: "column" }}>
            <div style={{ whiteSpace: "nowrap", padding: "2px 0" }}>EL +1.2m</div>
            <div style={{ flex: 1.5 }} />
            <div style={{ whiteSpace: "nowrap", padding: "2px 0" }}>EL +0.8m</div>
            <div style={{ flex: 3 }} />
            <div style={{ whiteSpace: "nowrap", padding: "2px 0" }}>EL 0.0m</div>
            <div style={{ flex: 3 }} />
            <div style={{ whiteSpace: "nowrap", padding: "2px 0" }}>EL +0.5m</div>
            <div style={{ flex: 3 }} />
            <div style={{ whiteSpace: "nowrap", padding: "2px 0" }}>EL +0.3m</div>
            <div style={{ flex: 3 }} />
            <div style={{ whiteSpace: "nowrap", padding: "2px 0" }}>EL 0.0m</div>
            <div style={{ flex: 2 }} />
          </div>

          {/* Flow */}
          <div style={{ flex: 1, padding: "14px 20px 20px 16px", overflowX: "auto" }}>

<Pre>{`  CFI S1A — POS LINE PROCESS FLOW
  ════════════════════════════════════════════════════════════════════════════════

  SOURCE : Mill decanter centrifuge discharge · clarifier sludge pit
           30 t/day FW  ·  82% MC  ·  Ash 28% DM  ·  CP 11% DM  ·  N 1.76% DM
           Truck delivery — tipper bed ramps to EL +1.2m above hopper lip`}</Pre>

<Pre>{`
  ┌──────────────────────────────────────────────────────────────────────────┐
  │  POS-PIT-01   SLUDGE RECEIVER HOPPER               EL +0.8–1.0m       │
  │  Reinforced concrete · epoxy-coated (oil-resistant · NOT stainless)    │
  │  15 m³  ·  3.5m L × 2.5m W × 2.0m H  ·  60° sloped walls             │
  │  Drainage: 150mm bottom valve → POME system                           │
  │  IN :  82% MC  ·  1.5 t/h  (30 t/day ÷ 20 hr/day)                    │
  └────────────────────────────┬───────────────────────────────────────────┘
                               │  PMP-POS-01 · progressive cavity pump
                               │  0.75kW · pipe DN100 · VFD-driven
                               ▼`}</Pre>

<Pre>{`  ┌──────────────────────────────────────────────────────────────────────────┐
  │  T-SLD-101   SLUDGE BUFFER TANK                    EL 0.0m             │
  │  SS304 stainless · sealed dome · vent → biofilter (odour control)      │
  │  5–8 m³ working volume  ·  Ø2.2m × 1.8–2.2m                           │
  │  AGITATOR: 3.7kW top-entry (prevents settling)                        │
  │  Instruments: temp sensor · pH probe · Fe meter                        │
  │  FEED PUMP: 0.75kW · pipe DN100                                        │
  └────────────────────────────┬───────────────────────────────────────────┘
                               │
                               ▼`}</Pre>

<Pre>{`  ┌──────────────────────────────────────────────────────────────────────────┐
  │  SCR-POS-01   ROTARY DRUM SCREEN                   EL +0.5m            │
  │  SS316L drum  ·  1.5kW  ·  2mm aperture                                │
  │  Removes fibrous solids > 2mm                                           │
  │  Throughput: 1.5 t/h at 82% MC                                          │`}</Pre>
<Pre className="side">{`  │  Reject > 2mm  ──────────────────────────────────────────────▶ EFB composting line`}</Pre>
<Pre>{`  └────────────────────────────┬───────────────────────────────────────────┘
                               │
                               ▼`}</Pre>

<Pre className="gate-blue">{`  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
  ┃  === ICP-OES Fe CHECKPOINT (BLUE GATE) ===                             ┃
  ┃                                                                        ┃
  ┃  Fe thresholds determine CaCO₃ dosing:                                 ┃`}</Pre>
<Pre className="gate-blue-mid">{`  ┃  Fe < 3,000 mg/kg   →  CaCO₃ at 20% w/w  (standard dose)              ┃
  ┃  Fe 3,000–5,000     →  CaCO₃ at 10–15% w/w  (moderate)               ┃
  ┃  Fe 5,000–8,000     →  CaCO₃ at 5–10% w/w  (reduced)                 ┃
  ┃  Fe > 8,000         →  CaCO₃ protocol review required                 ┃`}</Pre>
<Pre className="gate-blue-end">{`  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`}</Pre>

<Pre>{`                               │
                               ▼
  ┌──────────────────────────────────────────────────────────────────────────┐
  │  MIX-POS-01   CONDITIONING MIXER                   EL +0.3m            │
  │  SS304 · 2.2kW paddle mixer · 500L batch                                │
  │  CaCO₃ dosing: based on Fe gate result                                  │
  │  pH target: raise from 4.4 → 5.5–6.0                                   │
  │  Residence: 15–20 min per batch                                         │
  │  INSTRUMENTS: pH probe · conductivity · temp                            │
  └────────────────────────────┬───────────────────────────────────────────┘
                               │
                               ▼
  ┌──────────────────────────────────────────────────────────────────────────┐
  │  FP-POS-01   FILTER PRESS                          EL 0.0m             │
  │  Chamber filter press · 15kW hydraulic                                  │
  │  630mm × 630mm plates · 25 chambers                                     │
  │  MC reduction: 82% → 65–70%                                             │
  │  Cycle: 45–60 min per batch                                             │`}</Pre>
<Pre className="side">{`  │  Filtrate ──────────────────────────────────────────────────▶ POME treatment`}</Pre>
<Pre>{`  │  Cake: to S2 composting/BSF line                                        │
  └────────────────────────────┬───────────────────────────────────────────┘
                               │
                               ▼`}</Pre>

<Pre className="final">{`  ╔══════════════════════════════════════════════════════════════════════════╗
  ║  S2 DISCHARGE — POS conditioned cake to S2 Composting/BSF              ║
  ╚══════════════════════════════════════════════════════════════════════════╝`}</Pre>

            {/* Legend */}
            <div style={{ marginTop: 16, borderTop: "1px solid #ddd", paddingTop: 10, fontSize: 10, color: "#666", lineHeight: 1.8, fontFamily: F }}>
              <strong>Legend</strong><br />
              ┌───┐  Process vessel / equipment unit<br />
              ┏━━━┓  <span style={{ color: "#4A9EDB" }}>ICP-OES Fe gate checkpoint (blue)</span><br />
              ═════  S2 discharge / final output<br />
              ─────  Primary flow path<br />
              <span style={{ color: "#999" }}>──▶  Side stream — reject to EFB line · filtrate to POME</span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}