import { useNavigate } from "react-router-dom";
import S1SpecPanel from "../components/S1SpecPanel";

const C = {
  navy: '#060C14', navyMid: '#0A1628', navyCard: '#111E33', navyField: '#142030',
  teal: '#40D7C5', tealDim: 'rgba(64,215,197,0.12)', tealBdr: 'rgba(64,215,197,0.60)',
  amber: '#F5A623', amberDim: 'rgba(245,166,35,0.14)',
  green: '#00A249', greenDim: 'rgba(0,162,73,0.13)',
  red: '#E84040', redDim: 'rgba(232,64,64,0.13)',
  blue: '#4A9EDB', blueDim: 'rgba(74,158,219,0.12)', blueBdr: 'rgba(74,158,219,0.60)',
  grey: '#A8BDD0', greyLt: 'rgba(168,189,208,0.75)', white: '#E8F0FE',
  bdrIdle: 'rgba(255,255,255,0.06)', bdrCalc: 'rgba(139,160,180,0.18)',
};
const Fnt = {
  syne: "'Syne', sans-serif", dm: "'DM Sans', sans-serif",
  mono: "'DM Mono', monospace", brand: "'EB Garamond', serif",
};

const F = Fnt.dm;
const FH = Fnt.brand;

function Pre({ children, className, style = {} }) {
  const classStyles = {
    side: { color: "rgba(168,189,208,0.5)" },
    "gate-blue": { background: C.blueDim, color: C.blue, border: `1px solid ${C.blueBdr}`, borderBottom: "none", padding: "0 8px" },
    "gate-blue-mid": { background: C.blueDim, color: C.blue, borderLeft: `1px solid ${C.blueBdr}`, borderRight: `1px solid ${C.blueBdr}`, padding: "0 8px" },
    "gate-blue-end": { background: C.blueDim, color: C.blue, border: `1px solid ${C.blueBdr}`, borderTop: "none", padding: "0 8px" },
    final: { color: C.teal, background: C.navyMid },
  };
  return (
    <pre style={{ fontFamily: F, fontSize: 11, lineHeight: 1.7, color: C.blue, margin: 0, padding: 0, background: "none", border: "none", whiteSpace: "pre", ...(classStyles[className] || {}), ...style }}>
      {children}
    </pre>
  );
}

export default function S1PosAscii() {
  const navigate = useNavigate();
  return (
    <div style={{ fontFamily: F, background: C.navy, minHeight: "100vh" }}>
      {/* ═══ S0 GLOBAL HEADER (S1 highlighted) ═══ */}
      <div style={{ background: C.navyMid, display:'flex', alignItems:'center', padding:'0 28px', height:80, gap:18, position:'sticky', top:0, zIndex:100 }}>
        <div style={{ display:'flex', alignItems:'center', flexShrink:0, maxWidth:340 }}>
          <div>
            <div style={{ display:'flex', alignItems:'baseline' }}>
              <span style={{ fontFamily:Fnt.brand, fontWeight:700, fontSize:26, color:'#FFF', letterSpacing:'0.02em' }}>CFI</span>
              <span style={{ fontFamily:Fnt.brand, fontSize:22, color:'rgba(255,255,255,0.25)', margin:'0 8px' }}>·</span>
              <span style={{ fontFamily:Fnt.brand, fontWeight:700, fontSize:20, color:C.teal, letterSpacing:'0.10em' }}>DEEP TECH</span>
            </div>
            <div style={{ fontSize:11, color:C.teal, marginTop:4, fontFamily:Fnt.dm }}>Soil Microbiome Engineering &amp; Biofertiliser Production for Closed‑Loop Nutrient Recycling</div>
          </div>
        </div>
        <div style={{ display:'flex', gap:4, marginLeft:'auto', alignItems:'center', flexShrink:0 }}>
          {['S0','S1','S2','S3','S4','S5','S6','CAPEX','\u03A3'].map((s,i)=>(
            <div key={s} style={{ background:i===1?C.teal:'rgba(168,189,208,0.09)', border:`1px solid ${i===1?C.teal:'rgba(168,189,208,0.18)'}`, borderRadius:4, padding:'3px 9px', fontFamily:Fnt.mono, fontSize:11, fontWeight:700, color:i===1?C.navy:C.grey, cursor:'pointer' }}>{s}</div>
          ))}
        </div>
      </div>

      {/* ── Breadcrumb + Back ── */}
      <div style={{ background: C.navy, padding: "8px 32px", fontFamily: F, borderBottom: `1px solid ${C.bdrIdle}` }}>
        <div style={{ fontSize: 12, fontFamily: F, marginBottom: 4 }}>
          <a href="/" style={{ color: C.grey, textDecoration: "none" }}>CFI Platform</a>
          <span style={{ color: "rgba(168,189,208,0.3)", margin: "0 6px" }}>&rsaquo;</span>
          <a href="/s1-capex-opex" style={{ color: C.grey, textDecoration: "none" }}>S1 Pre-Processing</a>
          <span style={{ color: "rgba(168,189,208,0.3)", margin: "0 6px" }}>&rsaquo;</span>
          <span style={{ color: C.white, fontWeight: 700 }}>POS ASCII Flow</span>
        </div>
        <a href="/s1-capex-opex" style={{ color: C.teal, fontSize: 14, fontWeight: 500, textDecoration: "none", fontFamily: F }} onMouseEnter={e => e.currentTarget.style.opacity = 0.7} onMouseLeave={e => e.currentTarget.style.opacity = 1}>&larr; Back to CapEx / OpEx</a>
      </div>

      <div style={{ background: C.navyCard, border: `1px solid ${C.blueBdr}`, borderRadius: 6, width: 960, margin: "24px auto", padding: 0 }}>
        {/* Topbar */}
        <div style={{ background: C.navyMid, color: C.blue, padding: "8px 18px", fontSize: 10, display: "flex", justifyContent: "space-between", fontFamily: F, borderBottom: `1px solid ${C.blueBdr}`, borderRadius: "6px 6px 0 0" }}>
          <span>CFI S1A — POS LINE · ASCII PROCESS FLOW</span>
          <span>60 TPH FFB Mill · Bogor, West Java · March 2026 · CFI-S1-POS-ASCII-001 Rev 01</span>
        </div>

        <div style={{ display: "flex" }}>
          {/* Elevation axis */}
          <div style={{ width: 76, flexShrink: 0, borderRight: `1px solid ${C.bdrCalc}`, padding: "16px 8px 0 4px", fontSize: 9, color: C.grey, textAlign: "right", lineHeight: 1.6, fontFamily: F, display: "flex", flexDirection: "column" }}>
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
            <div style={{ marginTop: 16, borderTop: `1px solid ${C.bdrCalc}`, paddingTop: 10, fontSize: 10, color: C.grey, lineHeight: 1.8, fontFamily: F }}>
              <strong style={{ color: C.white }}>Legend</strong><br />
              ┌───┐  Process vessel / equipment unit<br />
              ┏━━━┓  <span style={{ color: C.blue }}>ICP-OES Fe gate checkpoint (blue)</span><br />
              <span style={{ color: C.teal }}>═════  S2 discharge / final output</span><br />
              ─────  Primary flow path<br />
              <span style={{ color: "rgba(168,189,208,0.5)" }}>──▶  Side stream — reject to EFB line · filtrate to POME</span>
            </div>

          </div>
        </div>

      {/* ── Engineering Specs ── */}
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 0 40px" }}>
        <S1SpecPanel
          title="S1A POS Line — Engineering Specifications (4 Nodes)"
          totalPower="62"
          totalCapex={<span style={{ color: "#92400E" }}>RFQ pending (decanter $80K–$150K only priced item)</span>}
          monthlyElec="$1,806/mo"
          monthlyKwh="19,747"
          nodes={[
            { tag:"RH-OPDC-101", name:"Sludge Pit 15m³", tph:1.25, mcIn:"82%", mcOut:"82%", elev:"0m", kw:0, gate:"ICP-OES-Fe", enforcement:"Fe result sets S2 inclusion", capex:null, supplier:null, description:"Sludge pit receiver" },
            { tag:"DRS-SLD-01", name:"Rotary Drum Screen", tph:1.17, mcIn:"82%", mcOut:"78%", elev:"1.5m", kw:7, gate:null, enforcement:null, capex:null, supplier:null, description:null },
            { tag:"DEC-SLD-101", name:"Decanter Centrifuge", tph:0.56, mcIn:"78%", mcOut:"65%", elev:"3m", kw:55, gate:null, enforcement:"Alfa Laval preferred", capex:"RFQ $80K–$150K", supplier:"PT Kharismapratama / SCK-Modipalm / Alfa Laval", description:"Horizontal 3-phase centrifuge, 3 m³/h, bowl 250-350mm" },
            { tag:"BIN-OPDC-301", name:"Buffer Tank 15m³", tph:0.56, mcIn:"65%", mcOut:"65%", elev:"3m", kw:0, gate:null, enforcement:null, capex:null, supplier:null, description:null },
          ]}
        />
      </div>
      </div>
    </div>
  );
}
