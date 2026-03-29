import { useNavigate } from "react-router-dom";

const F = "'DM Sans', sans-serif";
const FM = "'DM Mono', monospace";

function NavStrip() {
  const navigate = useNavigate();
  const links = [
    { label: "← S1 INDEX", to: "/s1-index", color: "#40D7C5", weight: 700 },
    { label: "Master (all panes)", to: "/s1-index" },
    { label: "Floor Plans", to: "/s1-index" },
    { label: "EFB ASCII", to: "/s1-efb-ascii" },
    { label: "OPDC ASCII", to: "/s1-opdc-ascii" },
    { label: "POS ASCII", to: "/s1-pos-ascii", active: true },
  ];
  return (
    <div style={{ width: "100%", background: "#060C14", borderBottom: "2px solid #1E2A3A", fontFamily: FM }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", height: 36, padding: "0 12px", gap: 0 }}>
        {links.map((l, i) => (
          <span key={i} onClick={() => navigate(l.to)} style={{
            color: l.active ? "#40D7C5" : (l.color || "#8BA0B4"), fontSize: 10, fontWeight: l.weight || 400,
            cursor: "pointer", padding: "0 12px", borderRight: i < links.length - 1 ? "1px solid #1E2A3A" : "none",
            marginRight: i < links.length - 1 ? 6 : 0, whiteSpace: "nowrap", letterSpacing: l.weight ? ".06em" : undefined,
          }}>{l.label}</span>
        ))}
        <div style={{ flex: 1 }} />
        <span style={{ color: "#3a4a5a", fontSize: 9 }}>CFI · S1 Pre-Processing · Rev 01 · Mar 2026</span>
      </div>
    </div>
  );
}

function Pre({ children, className, style = {} }) {
  const classStyles = {
    side: { color: "#999" },
    "gate-blue": { background: "rgba(24,95,165,.07)", color: "#0C447C" },
    "gate-blue-sub": { background: "rgba(24,95,165,.07)", color: "#185FA5" },
    final: { color: "#fff", background: "#0B1422" },
  };
  return (
    <pre style={{ fontFamily: FM, fontSize: 11.5, lineHeight: 1.7, color: "#111", margin: 0, padding: 0, background: "none", border: "none", whiteSpace: "pre", ...(classStyles[className] || {}), ...style }}>
      {children}
    </pre>
  );
}

export default function S1PosAscii() {
  return (
    <div style={{ fontFamily: F, background: "#f0f0f0", minHeight: "100vh" }}>
      <NavStrip />
      <div style={{ background: "#fff", border: "3px solid #111", width: 960, margin: "24px auto", padding: 0 }}>
        {/* Topbar */}
        <div style={{ background: "#0B1422", color: "#40D7C5", padding: "7px 18px", fontSize: 10, display: "flex", justifyContent: "space-between", fontFamily: FM }}>
          <span>CFI S1A — POS LINE · ASCII PROCESS FLOW</span>
          <span>60 TPH FFB Mill · Bogor, West Java · March 2026 · CFI-S1-POS-ASCII-001 Rev 01</span>
        </div>

        <div style={{ display: "flex" }}>
          {/* Elevation axis */}
          <div style={{ width: 72, flexShrink: 0, borderRight: "1px solid #ddd", padding: "16px 8px 0 4px", fontSize: 9.5, color: "#888", textAlign: "right", lineHeight: 1.6, display: "flex", flexDirection: "column" }}>
            <div style={{ whiteSpace: "nowrap", padding: "2px 0" }}>EL +0.8m</div>
            <div style={{ flex: 3.2 }} />
            <div style={{ whiteSpace: "nowrap", padding: "2px 0" }}>EL 0.0m</div>
            <div style={{ flex: 3.2 }} />
            <div style={{ whiteSpace: "nowrap", padding: "2px 0" }}>EL +0.5m</div>
            <div style={{ flex: 3.2 }} />
            <div style={{ whiteSpace: "nowrap", padding: "2px 0" }}>EL +2.5m</div>
            <div style={{ flex: 3.2 }} />
            <div style={{ whiteSpace: "nowrap", padding: "2px 0" }}>EL +1.0m</div>
            <div style={{ flex: 2 }} />
          </div>

          {/* Flow */}
          <div style={{ flex: 1, padding: "14px 20px 20px 16px", overflowX: "auto" }}>

<Pre>{`  CFI S1A — POS LINE PROCESS FLOW
  ════════════════════════════════════════════════════════════════════════════════

  SOURCE : Mill decanter centrifuge discharge · clarifier sludge pit
           30 t/day FW  ·  82% MC  ·  Ash 28% DM  ·  CP 11% DM  ·  N 1.76% DM
           Truck delivery — tipper bed ramps to EL +1.2m above hopper lip`}</Pre>

<Pre>{`  ┌──────────────────────────────────────────────────────────────────────────┐
  │  POS-PIT-01   Sludge Receiver Hopper              EL +0.8–1.0m lip      │
  │  Reinforced concrete · epoxy-coated (oil-resistant) · NOT stainless     │
  │  15 m³  ·  3.5m L × 2.5m W × 2.0m H  ·  60° sloped walls              │
  │  Drainage: 150mm bottom valve → leachate / POME system · deep sump      │
  │  IN :  82% MC  ·  1.5 t/h  (30 t/day ÷ 20 hr/day)                     │
  └────────────────────────────┬─────────────────────────────────────────────┘
                               │  PMP-POS-01 · progressive cavity pump
                               │  0.75kW · pipe DN100 · VFD
                               ▼`}</Pre>

<Pre>{`  ┌──────────────────────────────────────────────────────────────────────────┐
  │  T-SLD-101   Sludge Buffer Tank                   EL 0.0m               │
  │  SS304 stainless · sealed dome · vent → biofilter (odour control)       │
  │  5–8 m³ working volume  ·  Ø2.2m × 1.8–2.2m                            │
  │  Agitator: 3.7kW top-entry (prevents settling of slurry)                │
  │  Instruments: temp sensor · pH probe · Fe meter                         │
  │  IN :  82% MC  ·  1.5 t/h                                               │
  └────────────────────────────┬─────────────────────────────────────────────┘
                               │  Feed pump · 0.75kW · pipe DN100
                               ▼`}</Pre>

<Pre>{`  ┌──────────────────────────────────────────────────────────────────────────┐
  │  SCR-POS-01   Rotary Drum Screen                  EL +0.5m              │
  │  SS316L drum  ·  1.5kW  ·  2mm aperture  ·  gross solids removal        │
  │  IN :  82% MC  ·  1.5 t/h                                               │`}</Pre>
<Pre className="side">{`  │  Rejects > 2mm  ─────────────────────────────────────────────────────▶ EFB composting line`}</Pre>
<Pre>{`  │  PASS: slurry ≤ 2mm  →  forward to decanter                             │
  └────────────────────────────┬─────────────────────────────────────────────┘
                               │  Feed pump · 0.75kW · pipe DN100
                               ▼`}</Pre>

<Pre className="gate-blue">{`  ┌──────────────────────────────────────────────────────────────────────────┐
  │  DCN-POS-01   Decanter Centrifuge (3-phase)       EL +2.5m              │
  │  Alfa Laval preferred · SS316L bowl · Ø500mm · 11kW                     │
  │  IN :  82% MC  ·  1.5 t/h  ·  slurry                                    │
  │  OUT:  65% MC solid cake  +  centrate liquid                             │`}</Pre>
<Pre className="gate-blue-sub">{`  │                                                                          │
  │  [ICP-OES GATE]  Fe sampling point · protocol CFI-LAB-POME-001          │
  │  Fe < 3,000 mg/kg DM  →  20% WW inclusion rate in S2                   │
  │  Fe 3,000–5,000        →  10–15% WW inclusion rate                      │
  │  Fe 5,000–8,000        →  5–10% WW inclusion rate                       │
  │  Fe > 8,000            →  CaCO₃ amendment required before S2           │`}</Pre>
<Pre className="gate-blue">{`  └────────────┬───────────────────────────┬──────────────────────────────────┘
               │ SOLID CAKE                │ CENTRATE (liquid)
               │ 65% MC · 0.75kW belt      │`}</Pre>
<Pre className="side">{`               │                           └──────────────────────────────────▶ POME pond (never to substrate)`}</Pre>

<Pre>{`               ▼
  ┌──────────────────────────────────────────────────────────────────────────┐
  │  BUF-POS-01   Buffer Holding Tank                 EL +1.0m              │
  │  HDPE / SS316L  ·  5 m³  ·  1.1kW agitator                             │
  │  Instruments: temp sensor · pH probe · Fe meter                         │
  │  IN :  65% MC decanted cake  ·  1.5 t/h                                 │
  │  OUT:  metered to S2 at ICP-OES Fe-determined inclusion rate            │
  └────────────────────────────┬─────────────────────────────────────────────┘
                               │  PMP-POS-02 · transfer pump
                               │  0.75kW · pipe DN80 · metered flow
                               ▼`}</Pre>

<Pre className="final">{`  ╔══════════════════════════════════════════════════════════════════════════╗
  ║  S2 DISCHARGE  →  S3 BIOLOGICALS                                        ║
  ║  POS inclusion rate determined by ICP-OES Fe result at DCN-POS-01       ║
  ║  Daily NPK contribution at 60 TPH:  N 102 kg · P 24 kg · K 42 kg       ║
  ╚══════════════════════════════════════════════════════════════════════════╝`}</Pre>

            {/* Legend */}
            <div style={{ marginTop: 16, borderTop: "1px solid #ddd", paddingTop: 10, fontSize: 10, color: "#666", lineHeight: 1.8, fontFamily: FM }}>
              <strong>Legend</strong><br />
              ┌───┐  Process vessel / equipment unit<br />
              ═════  S2 discharge / final output (black fill)<br />
              ─────  Primary solid / slurry flow path<br />
              <span style={{ color: "#999" }}>──▶  Side stream — centrate to POME pond · rejects to EFB line</span><br />
              <span style={{ color: "#185FA5" }}>[ICP-OES GATE]  Blue highlight = Fe gate checkpoint · inclusion rate decision point</span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
