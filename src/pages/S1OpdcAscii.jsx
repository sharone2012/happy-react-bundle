import { useState } from "react";
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

function Pre({ children, className, style = {} }) {
  const classStyles = {
    side: { color: "rgba(168,189,208,0.5)" },
    noise: { background: C.redDim, color: C.red },
    classA: { background: C.redDim, color: C.red, border: "none" },
    "classA-sub": { background: C.redDim, color: "#FF6B6B" },
    "gate-amber": { background: C.amberDim, color: C.amber },
    "gate-red": { background: C.redDim, color: C.red },
    final: { background: C.navyMid, color: C.amber },
  };
  return (
    <pre style={{
      fontFamily: F, fontSize: 11, lineHeight: 1.7, color: C.amber,
      margin: 0, padding: 0, background: "none", whiteSpace: "pre",
      ...(className ? classStyles[className] || {} : {}), ...style,
    }}>{children}</pre>
  );
}

export default function S1OpdcAscii() {
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
          <span style={{ color: C.white, fontWeight: 700 }}>OPDC ASCII Flow</span>
        </div>
        <a href="/s1-capex-opex" style={{ color: C.teal, fontSize: 14, fontWeight: 500, textDecoration: "none", fontFamily: F }} onMouseEnter={e => e.currentTarget.style.opacity = 0.7} onMouseLeave={e => e.currentTarget.style.opacity = 1}>&larr; Back to CapEx / OpEx</a>
      </div>

      <div style={{ display: "flex", justifyContent: "center", padding: "24px 0" }}>
      <div style={{ background: C.navyCard, border: `1px solid rgba(245,166,35,0.5)`, borderRadius: 6, width: 1000 }}>
        {/* topbar */}
        <div style={{
          background: C.navyMid, color: C.amber, padding: "8px 12px", fontSize: 10,
          display: "flex", justifyContent: "space-between", fontFamily: F,
          borderBottom: `1px solid rgba(245,166,35,0.5)`, borderRadius: "6px 6px 0 0",
        }}>
          <span>CFI S1B — OPDC LINE · ASCII PROCESS FLOW</span>
          <span>60 TPH FFB Mill · 5 t/h · 500mm belt · Bogor, West Java · March 2026 · CFI-S1-OPDC-ASCII-001 Rev 01</span>
        </div>

        <div style={{ display: "flex" }}>
          {/* elevation axis */}
          <div style={{
            width: 76, flexShrink: 0, borderRight: `1px solid ${C.bdrCalc}`,
            padding: "0 8px 0 4px", fontSize: 9, color: C.grey, textAlign: "right",
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
<Pre className="side" style={{ background: C.redDim }}>{`  ║  Filtrate ────────────────────────────────────────────────────────────────────────▶ POME pond ONLY · never to substrate`}</Pre>
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
<pre style={{ fontFamily: F, fontSize: 11, lineHeight: 1.7, color: C.red, margin: 0, background: C.redDim, whiteSpace: "pre" }}>{`                 │ PASS ≤ 2mm              │ OVERSIZE > 2mm
                 │ → vibrating screen      │ return conveyor`}</pre>
<Pre className="side" style={{ background: C.redDim }}>{`                 │                         └────────────────────────────────────────────▶ ↩ return to OHM-01 (re-mill)`}</Pre>
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
              marginTop: 14, borderTop: `1px solid ${C.bdrCalc}`, paddingTop: 10,
              fontSize: 10, color: C.grey, lineHeight: 1.9, fontFamily: F,
            }}>
              <strong style={{ color: C.white }}>Legend</strong><br />
              ┌───┐  Process unit / vessel<br />
              <span style={{ color: C.red }}>╔═══╗  Critical CLASS A gate — hard limit, non-negotiable (double-border red)</span><br />
              <span style={{ color: C.amber }}>═════  S2 discharge / final handoff (amber on dark bg)</span><br />
              ─────  Primary OPDC solid flow path · 500mm belt<br />
              <span style={{ color: "rgba(168,189,208,0.5)" }}>──▶  Side stream — filtrate to POME pond · metal to waste skip · oversize return</span><br />
              <span style={{ color: C.red }}>░░░  Noise zone boundary — 82+ dBA — PPE required</span><br />
              <span style={{ color: C.amber }}>[AMBER GATE]  MC ≤ 35% target / 24hr dwell check</span><br />
              <span style={{ color: C.red }}>[CLASS A]  MC ≥ 40% LOCKED — non-negotiable hard limit</span>
            </div>
          </div>
        </div>

      </div>
      </div>

      {/* ── Engineering Specs ── */}
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 0 40px" }}>
        <S1SpecPanel
          title="S1B OPDC Line — Engineering Specifications (10 Nodes)"
          totalPower="206"
          totalCapex="$38,000"
          monthlyElec="$6,651/mo"
          monthlyKwh="72,742"
          nodes={[
            { tag:"SF-01", name:"Reciprocating Feeder", tph:5, mcIn:"72.5%", mcOut:"72.5%", elev:"0m", kw:7.5, gate:null, enforcement:null, capex:"$10,000", supplier:"Local fabricator", description:"Pusher feeder 5 t/h" },
            { tag:"BC-10/11", name:"Incline Conveyor 500mm", tph:5, mcIn:"72.5%", mcOut:"72.5%", elev:"2m", kw:15, gate:null, enforcement:null, capex:"$8,000", supplier:"PT Sinar Surya Lestari", description:"Belt or screw conveyor 10m" },
            { tag:"TR-OPDC-01", name:"Trommel Screen 50mm", tph:4.8, mcIn:"72.5%", mcOut:"72.5%", elev:"6m", kw:9, gate:null, enforcement:null, capex:"$5,000", supplier:"PT Hans Jaya Utama", description:"Concrete bay for decanter cake reception" },
            { tag:"OBM-02", name:"Overband Magnet", tph:4.8, mcIn:"72.5%", mcOut:"72.5%", elev:"6m", kw:3, gate:null, enforcement:null, capex:null, supplier:null, description:null },
            { tag:"DC-PRESS-01", name:"Screw Press + PKSA", tph:3.5, mcIn:"72.5%", mcOut:"61%", elev:"6m", kw:30, gate:"B.G2", enforcement:"MC ≥ 40% MIN CLASS A", capex:null, supplier:null, description:null },
            { tag:"LB-01", name:"Lump Breaker", tph:3.5, mcIn:"61%", mcOut:"61%", elev:"6m", kw:37, gate:null, enforcement:null, capex:null, supplier:null, description:null },
            { tag:"HM-02", name:"Hammer Mill", tph:3.5, mcIn:"61%", mcOut:"61%", elev:"6m", kw:90, gate:"SPRING-ISO", enforcement:null, capex:null, supplier:null, description:null },
            { tag:"VS-02", name:"Vibrating Screen 2mm", tph:3.3, mcIn:"61%", mcOut:"61%", elev:"6m", kw:9, gate:"B.G1", enforcement:null, capex:null, supplier:null, description:null },
            { tag:"DC-01", name:"Baghouse (Shared)", tph:3.3, mcIn:"61%", mcOut:"61%", elev:"6m", kw:0, gate:null, enforcement:"Shared with S1A", capex:null, supplier:null, description:"Shared with S1A" },
            { tag:"BIN-OPDC-24HR", name:"Buffer Bin 85m³ + Rake", tph:3.3, mcIn:"61%", mcOut:"61%", elev:"6m", kw:5.5, gate:"C.G2/G3", enforcement:"pH 8.0–9.0 post-24hr dwell", capex:"$15,000", supplier:"PT BSB", description:"Steel bin 20 m³" },
          ]}
        />
      </div>
    </div>
  );
}
