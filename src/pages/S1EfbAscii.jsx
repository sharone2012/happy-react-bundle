import { useNavigate } from "react-router-dom";
import S1SpecPanel from "../components/S1SpecPanel";

const C = {
  navy: '#060C14', navyMid: '#0A1628', navyCard: '#111E33', navyField: '#142030',
  teal: '#40D7C5', tealDim: 'rgba(64,215,197,0.12)', tealBdr: 'rgba(64,215,197,0.60)',
  amber: '#F5A623', amberDim: 'rgba(245,166,35,0.14)',
  green: '#00A249', greenDim: 'rgba(0,162,73,0.13)',
  red: '#E84040', redDim: 'rgba(232,64,64,0.13)',
  grey: '#A8BDD0', greyLt: 'rgba(168,189,208,0.75)', white: '#E8F0FE',
  bdrIdle: 'rgba(255,255,255,0.06)', bdrCalc: 'rgba(139,160,180,0.18)',
};
const Fnt = {
  syne: "'Syne', sans-serif", dm: "'DM Sans', sans-serif",
  mono: "'DM Mono', monospace", brand: "'EB Garamond', serif",
};

const F = Fnt.dm;
const FH = Fnt.brand;

export default function S1EfbAscii() {
  const navigate = useNavigate();
  return (
    <div style={{ background: C.navy, fontFamily: F, minHeight: "100vh" }}>
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
          <span style={{ color: C.white, fontWeight: 700 }}>EFB ASCII Flow</span>
        </div>
        <a href="/s1-capex-opex" style={{ color: C.teal, fontSize: 14, fontWeight: 500, textDecoration: "none", fontFamily: F }} onMouseEnter={e => e.currentTarget.style.opacity = 0.7} onMouseLeave={e => e.currentTarget.style.opacity = 1}>&larr; Back to CapEx / OpEx</a>
      </div>

      <div style={{ display: "flex", justifyContent: "center", padding: "24px 0" }}>
      <div style={{ background: C.navyCard, border: `1px solid ${C.tealBdr}`, borderRadius: 6, width: 1000 }}>
        {/* topbar */}
        <div style={{
          background: C.navyMid, color: C.teal, padding: "7px 18px", fontSize: 10,
          display: "flex", justifyContent: "space-between", fontFamily: F,
          borderBottom: `1px solid ${C.tealBdr}`, borderRadius: "6px 6px 0 0",
        }}>
          <span>CFI S1C — EFB LINE · ASCII PROCESS FLOW</span>
          <span>60 TPH FFB Mill · 20 t/h · 600mm belt · Bogor, West Java · March 2026</span>
        </div>

        <div style={{ display: "flex" }}>
          {/* elevation axis */}
          <div style={{
            width: 76, flexShrink: 0, borderRight: `1px solid ${C.bdrCalc}`,
            padding: "0 8px 0 4px", fontSize: 9, color: C.grey, textAlign: "right",
            fontFamily: F, lineHeight: 1.7,
          }}>
            <div style={{ paddingTop: 68 }}>&plusmn;0.0m</div>
            <div style={{ paddingTop: 52 }}>&plusmn;0.0m</div>
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
            <Pre className="side" style={{ background: C.amberDim }}>{`  │  Press water ──────────────────────────────────────────────────────────────────▶ POME pond ONLY · never to substrate`}</Pre>
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
            <pre style={{ fontFamily: F, fontSize: 11, lineHeight: 1.7, color: C.red, margin: 0, background: C.redDim, whiteSpace: "pre" }}>{`                 │ PASS ≤ 2mm              │ OVERSIZE > 2mm
                 │ → vibrating screen      │ EB-07 return conveyor`}</pre>
            <Pre className="side" style={{ background: C.redDim }}>{`                 │                         └──────────────────────────────────────────▶ ↩ return to EHM-01 ⑦ (re-mill — not back to shredder)`}</Pre>
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
              marginTop: 14, borderTop: `1px solid ${C.bdrCalc}`, paddingTop: 10,
              fontSize: 10, color: C.grey, lineHeight: 1.9, fontFamily: F,
            }}>
              <strong style={{ color: C.white }}>Legend</strong><br />
              ┌───┐  Process unit / vessel<br />
              <span style={{ color: C.teal }}>═════  S2 discharge / final handoff (teal on dark bg)</span><br />
              ─────  Primary EFB solid flow path · 600mm belt<br />
              <span style={{ color: "rgba(168,189,208,0.5)" }}>──▶  Side stream — press water to POME pond · metal/stone to waste skip · oversize return</span><br />
              ↩ EB-07  Oversize return conveyor loop — back into EHM-01 ⑦ hammer mill for re-milling (not back to shredder ⑥)<br />
              <span style={{ color: C.red }}>░░░  Noise zone boundary — spring isolation + flexible mounts mandatory inside</span><br />
              <span style={{ color: C.amber }}>[GATE B.G2]  Amber — operator MC check ≤ 50% before screw press discharge proceeds</span><br />
              <span style={{ color: C.red }}>[GATE B.G1]  Red — shift sieve confirms D90 ≤ 2mm before S2 transfer</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Engineering Specs ── */}
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 0 40px" }}>
        <S1SpecPanel
          title="S1C EFB Line — Engineering Specifications (10 Nodes)"
          totalPower="298"
          totalCapex="$184,000"
          monthlyElec="$14,191/mo"
          monthlyKwh="155,199"
          nodes={[
            { tag:"AF-01", name:"Hydraulic Feeder", tph:20, mcIn:"62.5%", mcOut:"62.5%", elev:"0m", kw:18, gate:null, enforcement:null, capex:"$15,000", supplier:"PT Jayatech Palmindo", description:"Floor-level pusher plate feeder, 20 t/h" },
            { tag:"BC-01/02", name:"Incline Conveyor 600mm", tph:20, mcIn:"62.5%", mcOut:"62.5%", elev:"2m", kw:22, gate:null, enforcement:null, capex:"$18,000", supplier:"PT Sinar Surya Lestari", description:"Heavy-duty apron conveyor, 15m long, 20 t/h" },
            { tag:"TR-2060", name:"Trommel Screen 50mm", tph:19, mcIn:"62.5%", mcOut:"62.5%", elev:"6m", kw:11, gate:null, enforcement:null, capex:"$8,000", supplier:"PT Hans Jaya Utama", description:"Concrete unloading bay with side walls" },
            { tag:"OBM-01", name:"Overband Magnet", tph:19, mcIn:"62.5%", mcOut:"62.5%", elev:"6m", kw:3, gate:null, enforcement:null, capex:null, supplier:null, description:null },
            { tag:"PR-01", name:"Screw Press + PKSA", tph:14, mcIn:"62.5%", mcOut:"47.5%", elev:"6m", kw:30, gate:"B.G2", enforcement:null, capex:null, supplier:null, description:null },
            { tag:"SD-01", name:"Primary Shredder", tph:14, mcIn:"47.5%", mcOut:"47.5%", elev:"6m", kw:75, gate:null, enforcement:null, capex:"$45,000", supplier:"CV Has Engineering", description:"Rotary shredder 50-100mm output, 20 t/h" },
            { tag:"HM-01", name:"Hammer Mill", tph:14, mcIn:"47.5%", mcOut:"47.5%", elev:"6m", kw:110, gate:"SPRING-ISO", enforcement:null, capex:"$35,000", supplier:"Cakrawala Mesin Multindo", description:"High-speed hammer mill to 2mm, 15 t/h" },
            { tag:"VS-01", name:"Vibrating Screen 2mm", tph:13, mcIn:"47.5%", mcOut:"47.5%", elev:"6m", kw:11, gate:"B.G1", enforcement:null, capex:"$12,000", supplier:"CV Has Engineering", description:"2mm screen deck, 15 t/h" },
            { tag:"DC-01", name:"Baghouse (Shared)", tph:13, mcIn:"47.5%", mcOut:"47.5%", elev:"6m", kw:18, gate:null, enforcement:null, capex:null, supplier:null, description:"Shared with S1B" },
            { tag:"BIN-EFB-01", name:"Buffer Bin 50m³", tph:13, mcIn:"47.5%", mcOut:"47.5%", elev:"6m", kw:0, gate:null, enforcement:null, capex:"$25,000", supplier:"PT BSB (Bangun Sarana Baja)", description:"Steel bin 50 m³, live bottom discharge" },
          ]}
        />
      </div>
      </div>
    </div>
  );
}

/* styled pre helper */
function Pre({ children, className, style = {} }) {
  const C = {
    navy: '#060C14', navyMid: '#0A1628', navyCard: '#111E33', navyField: '#142030',
    teal: '#40D7C5', tealDim: 'rgba(64,215,197,0.12)', tealBdr: 'rgba(64,215,197,0.60)',
    amber: '#F5A623', amberDim: 'rgba(245,166,35,0.14)',
    red: '#E84040', redDim: 'rgba(232,64,64,0.13)',
    grey: '#A8BDD0', white: '#E8F0FE',
  };
  const classStyles = {
    side: { color: "rgba(168,189,208,0.5)" },
    noise: { background: C.redDim, color: C.red },
    "gate-amber": { background: C.amberDim, color: C.amber },
    "gate-red": { background: C.redDim, color: C.red },
    final: { background: C.navyMid, color: C.teal },
  };
  return (
    <pre style={{
      fontFamily: "'DM Sans', sans-serif", fontSize: 11, lineHeight: 1.7,
      color: C.teal, margin: 0, padding: 0, background: "none", whiteSpace: "pre",
      ...(className ? classStyles[className] || {} : {}),
      ...style,
    }}>{children}</pre>
  );
}
