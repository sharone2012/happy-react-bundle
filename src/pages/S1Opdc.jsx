import { useNavigate } from "react-router-dom";
import {
  C, Fnt, S1_CSS, S0Header, S1Breadcrumb, LineHero,
  CollapsibleSection, Pre, SubstrateFlowStrip, NodeCard, BuildingDiagram, TickerBar, ConveyorTable,
} from "../components/S1Shared.jsx";

/*
 * S1Opdc.jsx — OPDC Pre-Processing Line Detail
 * Route: /s1/opdc
 * Combines: ASCII Flow + Equipment Register + Floor Plan + CAPEX
 */

const ACCENT = C.amber;

// ── SUBSTRATE FLOW DATA ──
const INFLOWS = [
  { title: 'Monthly Volume', val: '1,256', suffix: ' t', unit: 'FW / month · OPDC @ 15.2% EFB' },
  { title: 'Moisture', val: '70–75', suffix: '%', unit: 'MC wb · Paste Form' },
  { title: 'Crude Protein', val: '14.5', suffix: '%', unit: 'DM · N 2.32% DM' },
  { title: 'Lignin ADL', val: '30.7', suffix: '%', unit: 'DM · OPDC Canonical' },
  { title: 'Red. Sugars', val: '—', suffix: '%', unit: 'DM · Pre-PKSA', color: 'rgba(30,107,140,.6)' },
  { title: 'Organic Carbon', val: '41', suffix: '%', unit: 'DM · CHNS' },
  { title: 'C:N Ratio', val: '20', suffix: ':1', unit: 'DM · Low Ratio' },
  { title: '', npk: [
    { key: 'N', val: '2.32', dir: 'eq' },
    { key: 'P', val: '0.30', dir: 'eq' },
    { key: 'K', val: '1.90', dir: 'eq' },
  ]},
];
const OUTFLOWS = [
  { title: 'Monthly Volume', val: '~830', suffix: ' t', unit: 'FW / month · Post-Press', dir: 'dn' },
  { title: 'Moisture', val: '≤35', suffix: '%', unit: 'MC wb · Post-Dryer', dir: 'dn' },
  { title: 'Particle Size', val: '≤3', suffix: 'mm', unit: 'D90 · Vibrating Screen', dir: 'dn' },
  { title: 'Dwell Time', val: '≥24', suffix: ' hrs', unit: 'Product Bin Hold', dir: 'eq' },
  { title: 'pH', val: '8.0–9.0', suffix: '', unit: 'Post-24hr Dwell', dir: 'eq' },
  { title: 'CLASS A Gate', val: 'MC ≥40%', suffix: '', unit: 'LOCKED · Non-Negotiable', dir: 'eq' },
  { title: 'C:N Ratio', val: '20', suffix: ':1', unit: 'DM · Unchanged', dir: 'eq' },
  { title: '', npk: [
    { key: 'N', val: '2.32', dir: 'eq' },
    { key: 'P', val: '0.30', dir: 'eq' },
    { key: 'K', val: '1.90', dir: 'eq' },
  ]},
];

// ── EQUIPMENT REGISTER ──
const EQUIPMENT = [
  { code: 'SF-01', name: 'Reciprocating Feeder', tph: '5 tph', mcIn: '72.5%', mcOut: '72.5%', elev: '0m', kw: '7.5 kW', cost: '$10,000', supplier: 'Local fabricator' },
  { code: 'BC-10/11', name: 'Incline Conveyor 500mm', tph: '5 tph', mcIn: '72.5%', mcOut: '72.5%', elev: '2m', kw: '15 kW', cost: '$8,000', supplier: 'PT Sinar Surya Lestari' },
  { code: 'TR-OPDC-01', name: 'Trommel Screen 50mm', tph: '4.8 tph', mcIn: '72.5%', mcOut: '72.5%', elev: '6m', kw: '9 kW', cost: '$5,000', supplier: 'PT Hans Jaya Utama' },
  { code: 'OBM-02', name: 'Overband Magnet', tph: '4.8 tph', mcIn: '72.5%', mcOut: '72.5%', elev: '6m', kw: '3 kW', cost: '—', supplier: '—' },
  { code: 'DC-PRESS-01', name: 'Screw Press + PKSA', tph: '3.5 tph', mcIn: '72.5%', mcOut: '61%', elev: '6m', kw: '30 kW', cost: '—', supplier: 'B.G2: MC ≥ 40% MIN CLASS A' },
  { code: 'LB-01', name: 'Lump Breaker', tph: '3.5 tph', mcIn: '61%', mcOut: '61%', elev: '6m', kw: '37 kW', cost: '—', supplier: '—' },
  { code: 'HM-02', name: 'Hammer Mill', tph: '3.5 tph', mcIn: '61%', mcOut: '61%', elev: '6m', kw: '90 kW', cost: '—', supplier: 'SPRING-ISO' },
  { code: 'VS-02', name: 'Vibrating Screen 2mm', tph: '3.3 tph', mcIn: '61%', mcOut: '61%', elev: '6m', kw: '9 kW', cost: '—', supplier: 'B.G1' },
  { code: 'DC-01', name: 'Baghouse (Shared)', tph: '3.3 tph', mcIn: '61%', mcOut: '61%', elev: '6m', kw: '0 kW', cost: '—', supplier: 'Shared with S1A' },
  { code: 'BIN-OPDC-24HR', name: 'Buffer Bin 85m³ + Rake', tph: '3.3 tph', mcIn: '61%', mcOut: '61%', elev: '6m', kw: '5.5 kW', cost: '$15,000', supplier: 'C.G2/G3: pH 8.0–9.0' },
];

// ── CAPEX ──
const OPDC_EQUIP = [
  { code: 'TR-OPDC-101', name: 'OPDC Receiving Bay', cost: '$5,000' },
  { code: 'RH-OPDC-101', name: 'OPDC Reciprocating Feeder', cost: '$10,000' },
  { code: 'CV-OPDC-101', name: 'OPDC Feed Conveyor', cost: '$8,000' },
  { code: 'BIN-OPDC-301', name: 'OPDC Buffer Bin', cost: '$15,000' },
];

// ── EXPANDABLE FLOOR NODES ──
const FLOOR_NODES = [
  { id: 1, tag: "RCV-OPDC-01", name: "Opdc Receiving Bay", specs: [["Type", "Concrete receiving bay with push-wall"], ["Volume", "25 m\u00b3 (~12 t)"], ["Material", "Reinforced concrete + epoxy floor"], ["Discharge", "Front-end loader to feeder"]], footer: "Wheel loader feeds RH-OPDC-101" },
  { id: 2, tag: "RH-OPDC-101", name: "Opdc Reciprocating Feeder", specs: [["Type", "Hydraulic reciprocating feeder"], ["Motor", "5.5 kW hydraulic"], ["Throughput", "5 t/h OPDC (70% MC)"], ["Stroke", "600mm"], ["Width", "800mm"], ["Material", "Carbon steel \u00b7 anti-bridging cone + pusher plate"]], footer: "Meters OPDC onto belt conveyor" },
  { id: 3, tag: "CV-OPDC-101", name: "Opdc Belt Conveyor", specs: [["Type", "Enclosed belt conveyor"], ["Length", "15 m"], ["Width", "500 mm"], ["Motor", "3.7 kW \u00b7 3-phase"], ["Throughput", "5 t/h"], ["Incline", "12\u00b0"]], footer: "To OPR-01 screw press" },
  { id: 4, tag: "OPR-01", name: "Opdc Screw Press", specs: [["Type", "Twin-screw dewatering press"], ["Motor", "22 kW \u00b7 VFD"], ["Throughput", "5 t/h @ 70% MC in \u2192 60% MC out"], ["Pressure", "5\u20138 bar"], ["Screen", "Wedge wire 0.75mm"], ["Filtrate", "\u2192 POME pond \u00b7 never to substrate"]], footer: "Class A gate \u2014 moisture sample before release", gate: { label: "CLASS A \u00b7 MC \u2265 40%", bg: "rgba(232,64,64,.1)", color: "#E84040" }, warning: "MC floor \u2265 40% LOCKED \u00b7 Math.max(40, reading) \u00b7 NON-NEGOTIABLE \u2014 Pore damage above 40% kills BSF colonisation" },
  { id: 5, tag: "OTR-01", name: "Opdc Trommel Screen", specs: [["Type", "Rotary trommel"], ["Diameter", "1200 mm"], ["Length", "3000 mm"], ["Motor", "4 kW \u00b7 geared"], ["Screen", "30mm perforations"], ["Throughput", "3.3 t/h (post-press)"]], footer: "Removes oversized contaminants" },
  { id: 6, tag: "ODR-01", name: "Opdc Rotary Dryer", specs: [["Type", "Direct-fired rotary drum dryer"], ["Motor", "15 kW drum + 7.5 kW fan"], ["Throughput", "3.3 t/h @ 60% MC in \u2192 45% MC out"], ["Diameter", "1500 mm"], ["Length", "8000 mm"], ["Fuel", "Palm kernel shell (PKS)"]], footer: "Reduces MC for hammer mill processing", gate: { label: "AMBER \u00b7 MC \u2264 35%", bg: "rgba(245,166,35,.1)", color: "#F5A623" } },
  { id: 7, tag: "OHM-01", name: "Opdc Hammer Mill", specs: [["Type", "Hammer mill with 3mm screen"], ["Motor", "75 kW \u00b7 direct drive"], ["Throughput", "3.3 t/h (45% MC)"], ["Hammer tips", "18 swing hammers"], ["Screen", "3mm perforated plate"], ["Speed", "1500 RPM"]], footer: "Noise zone \u2014 85+ dBA \u00b7 PPE required", warning: "Spring isolation only \u2014 never rigid-anchor to slab" },
  { id: 8, tag: "OVS-01", name: "Opdc Vibrating Screen", specs: [["Type", "Single-deck vibrating screen"], ["Motor", "1.5 kW vibratory"], ["Screen", "3mm mesh"], ["Throughput", "3.3 t/h milled OPDC"], ["Oversize", "Return to hammer mill"], ["Undersize", "To product bin"]], footer: "Oversize loop to OHM-01" },
  { id: 9, tag: "ODC-01", name: "Opdc Dust Collector", specs: [["Type", "Pulse-jet baghouse"], ["Air volume", "3500 m\u00b3/h"], ["Motor", "5.5 kW fan"], ["Filter area", "35 m\u00b2"], ["Emission", "<50 mg/Nm\u00b3"]], footer: "Serves dryer + hammer mill zone" },
  { id: 10, tag: "BIN-OPDC-301", name: "Opdc Product Bin \u2014 24hr Dwell", specs: [["Type", "Steel product bin"], ["Volume", "40 m\u00b3 (~18 t)"], ["Material", "Carbon steel + moisture barrier"], ["Dwell time", "24 hours minimum"], ["Discharge", "Screw conveyor to S2"], ["pH target", "8.0\u20139.0 post-dwell"], ["Instruments", "pH probe \u00b7 monitor every 8hrs"]], footer: "24hr dwell gate \u2014 holds product before S2 release", gate: { label: "24HR DWELL \u00b7 pH 8.0\u20139.0", bg: "rgba(245,166,35,.1)", color: "#F5A623" } },
];

// ── BUILDING ──
const BUILDING = { name: "Building A6 \u2014 Opdc Processing Hall", width: "18m", length: "36m", height: "10m", area: "648 m\u00b2" };

// ── CONVEYORS ──
const CONVEYORS = [
  { code: 'CV-OPDC-101', type: 'Incline Feed', length: '15m \u00b7 12\u00b0', power: '3.7 kW', route: '\u00b10.0 \u2192 +3.0m \u00b7 500mm belt' },
  { code: 'OB-02', type: 'Level Belt', length: '8m', power: '\u2014', route: '\u2192 Trommel Screen' },
  { code: 'OB-03', type: 'Level Belt', length: '8m', power: '\u2014', route: '\u2192 Overband Magnet' },
  { code: 'OB-04', type: 'Level Belt', length: '10m', power: '\u2014', route: '\u2192 Screw Press' },
  { code: 'OB-05', type: 'Level Belt', length: '10m', power: '\u2014', route: '\u2192 Lump Breaker' },
  { code: 'OB-06', type: 'Level Belt', length: '8m', power: '\u2014', route: '\u2192 Hammer Mill' },
  { code: 'OB-07/08', type: 'Oversize Return', length: 'variable', power: '\u2014', route: 'Recirculation loop' },
  { code: 'OB-08', type: 'Decline Belt', length: '8m \u00b7 -5\u00b0', power: '2.2 kW', route: '\u2192 Buffer Bin' },
  { code: 'BC-11', type: 'Gallery Belt', length: '10m + 25m covered', power: '3.0 kW', route: '\u2192 Conveyor Gallery \u2192 S2 Greenhouse' },
];

// ── TICKER ──
const TICKER = [
  { label: 'Throughput In', val: '5 t/h', color: '#40D7C5' },
  { label: 'Throughput Out', val: '3.3 t/h', color: '#40D7C5' },
  { label: 'MC In', val: '70%', color: '#E8F0FE' },
  { label: 'MC Out', val: '45%', color: '#E8F0FE' },
  { label: 'Installed Power', val: '~206 kW', color: '#F5A623' },
  { label: 'Daily Input', val: '~75 t', color: '#00A249' },
  { label: 'Daily Output', val: '~50 t', color: '#00A249' },
];

export default function S1Opdc() {
  return (
    <>
      <style>{S1_CSS}</style>
      <S0Header activeStage={1} />
      <LineHero
        name="S1B — OPDC Pre-Processing Line"
        throughput="5 t/h · 500mm Belt"
        power="206 kW Total"
        nodes="10"
        accent={ACCENT}
        badges={[
          { text: 'CLASS A · MC ≥ 40% LOCKED', cls: 'bdg-r' },
          { text: '24HR DWELL GATE', cls: 'bdg-a' },
        ]}
      />
      <S1Breadcrumb activeLine="OPDC Line" />

      <div style={{ marginTop: 10 }}>
        <SubstrateFlowStrip
          stageLabel="Substrate Flow — S0 Raw OPDC → S1 Dried/Milled Cake"
          inflows={INFLOWS}
          outflows={OUTFLOWS}
        />
      </div>

      <TickerBar items={TICKER} />

      <div className="content">
        {/* SECTION 1: ASCII PROCESS FLOW */}
        <CollapsibleSection title="ASCII Process Flow — OPDC Line" number="1" accent={ACCENT} defaultOpen={true}>
          <div style={{ fontFamily: Fnt.dm, fontSize: 10, color: C.grey, marginBottom: 10 }}>
            CFI S1B — OPDC LINE · 60 TPH FFB Mill · 5 t/h · 500mm belt · Bogor, West Java · March 2026 · CFI-S1-OPDC-ASCII-001 Rev 01
          </div>
          <div style={{ fontFamily: Fnt.dm, fontSize: 11, color: C.amber, marginBottom: 6 }}>
            Source: 1,256 t FW/month · 70–75% MC · 30.7% lignin DM · C:N 20 · 14.5% CP · Paste form
          </div>
          <Pre accent={ACCENT}>{`
  ┌─────────────────────────────────────────────────────────────────────────────────────────────────────────┐
  │  S1B  OPDC  PRE-PROCESSING  LINE  ·  10 MACHINES  ·  206 kW  ·  5 t/h  ·  500mm BELT               │
  │  Elevation: +1.0m → +3.5m → +0.3m    Anti-bridging handling throughout (paste form)                  │
  └─────────────────────────────────────────────────────────────────────────────────────────────────────────┘

  ┌─────────────────┐    ┌──────────────────┐    ┌──────────────────────────────────────────────────┐
  │ RH-OPDC-101     │───▶│  CV-OPDC-101     │───▶│  OPR-01  Screw Press — `}<span className="gate-red">CLASS A GATE</span>{`             │
  │ Receiving Hopper │    │  Belt Conveyor   │    │  +3.5m · 7.5 kW                                │
  │ Anti-bridging    │    │  +1.0 → +3.5m   │    │  `}<span className="gate-red">⚠ CRITICAL: MC floor ≥ 40% LOCKED</span>{`            │
  │ +1.0m · SS304   │    │  1.1 kW · 500mm  │    │  `}<span className="gate-red">Math.max(40, reading) · NON-NEGOTIABLE</span>{`       │
  │ 10m³ · 0.75 kW  │    │                  │    │  Pore damage above 40% kills BSF colonisation   │
  └─────────────────┘    └──────────────────┘    └──────────────────────────────────────────────────┘
                                                              │
                                                              ▼
  ┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐    ┌──────────────────┐
  │ OLB-01          │───▶│  CV-OPDC-201     │───▶│  OTR-01         │───▶│  ODR-01          │
  │ Lump Breaker    │    │  Belt Conveyor 2 │    │  Trommel Screen │    │  Rotary Dryer    │
  │ Twin-roll       │    │  +3.0 → +1.5m   │    │  +1.5m          │    │  +1.0m           │
  │ +3.0m · 3 kW   │    │                  │    │  2.2 kW         │    │  11 kW           │
  │ 30mm output     │    │                  │    │                 │    │  `}<span className="gate-amber">⚠ MC ≤ 35%</span>{`     │
  └─────────────────┘    └──────────────────┘    └─────────────────┘    └──────────────────┘
                                                                              │
                                                                              ▼
  ┌─────────────────┐    ┌──────────────────┐    ┌──────────────────────────────────────────────────┐
  │ OVS-01          │◀───│  OHM-01          │    │  BIN-OPDC-301  Product Bin                       │
  │ Vibrating Screen│    │  Hammer Mill     │───▶│  `}<span className="gate-amber">⚠ 24HR DWELL GATE</span>{`                               │
  │ +0.5m · 2.2 kW │    │  +0.8m · 22 kW   │    │  dwell ≥ 24hrs · pH 8.0–9.0                     │
  │ Oversize→HM     │    │  SPRING ISO ONLY │    │  +0.3m · Sealed · Moisture-controlled            │
  └─────────────────┘    └──────────────────┘    └──────────────────────────────────────────────────┘

  ─── S2 DISCHARGE HANDOFF STATE ───
  `}<span className="gate-amber">≤35% MC · D90 ≤ 3mm · pH 8.0–9.0 · dwell ≥ 24hrs</span>
          </Pre>
        </CollapsibleSection>

        {/* SECTION 2: EQUIPMENT REGISTER */}
        <CollapsibleSection title="Equipment Register — 10 Nodes" number="2" accent={ACCENT} defaultOpen={false}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ background: 'rgba(0,0,0,.3)' }}>
                  {['Code','Equipment','Throughput','MC In→Out','Elev','Power','Cost','Supplier/Gate'].map(h => (
                    <th key={h} style={{ padding: '8px 10px', textAlign: 'left', fontFamily: Fnt.mono, fontSize: 10, fontWeight: 700, color: C.grey, textTransform: 'uppercase', letterSpacing: '.04em', borderBottom: `1px solid ${C.bdrIdle}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {EQUIPMENT.map((eq, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid rgba(30,107,140,.15)` }}>
                    <td style={{ padding: '8px 10px', fontFamily: Fnt.mono, fontSize: 11, fontWeight: 700, color: ACCENT }}>{eq.code}</td>
                    <td style={{ padding: '8px 10px', fontFamily: Fnt.dm, fontSize: 11, color: C.white }}>{eq.name}</td>
                    <td style={{ padding: '8px 10px', fontFamily: Fnt.mono, fontSize: 11, color: C.amber }}>{eq.tph}</td>
                    <td style={{ padding: '8px 10px', fontFamily: Fnt.mono, fontSize: 11, color: C.white }}>{eq.mcIn} → {eq.mcOut}</td>
                    <td style={{ padding: '8px 10px', fontFamily: Fnt.mono, fontSize: 11, color: C.grey }}>{eq.elev}</td>
                    <td style={{ padding: '8px 10px', fontFamily: Fnt.mono, fontSize: 11, color: C.teal }}>{eq.kw}</td>
                    <td style={{ padding: '8px 10px', fontFamily: Fnt.mono, fontSize: 11, color: C.amber }}>{eq.cost}</td>
                    <td style={{ padding: '8px 10px', fontFamily: Fnt.dm, fontSize: 10, color: C.grey }}>{eq.supplier}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: 16, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ background: 'rgba(0,0,0,.2)', border: `1px solid ${C.bdrIdle}`, borderRadius: 6, padding: '10px 16px' }}>
              <div style={{ fontFamily: Fnt.dm, fontSize: 10, fontWeight: 700, color: C.grey, textTransform: 'uppercase' }}>Total Power</div>
              <div style={{ fontFamily: Fnt.mono, fontSize: 16, fontWeight: 700, color: C.teal }}>206 kW</div>
            </div>
            <div style={{ background: 'rgba(0,0,0,.2)', border: `1px solid ${C.bdrIdle}`, borderRadius: 6, padding: '10px 16px' }}>
              <div style={{ fontFamily: Fnt.dm, fontSize: 10, fontWeight: 700, color: C.grey, textTransform: 'uppercase' }}>Total CapEx</div>
              <div style={{ fontFamily: Fnt.mono, fontSize: 16, fontWeight: 700, color: C.amber }}>$38,000</div>
            </div>
            <div style={{ background: 'rgba(0,0,0,.2)', border: `1px solid ${C.bdrIdle}`, borderRadius: 6, padding: '10px 16px' }}>
              <div style={{ fontFamily: Fnt.dm, fontSize: 10, fontWeight: 700, color: C.grey, textTransform: 'uppercase' }}>Monthly Elec</div>
              <div style={{ fontFamily: Fnt.mono, fontSize: 16, fontWeight: 700, color: C.amber }}>$6,651/mo</div>
            </div>
            <div style={{ background: 'rgba(0,0,0,.2)', border: `1px solid ${C.bdrIdle}`, borderRadius: 6, padding: '10px 16px' }}>
              <div style={{ fontFamily: Fnt.dm, fontSize: 10, fontWeight: 700, color: C.grey, textTransform: 'uppercase' }}>Monthly kWh</div>
              <div style={{ fontFamily: Fnt.mono, fontSize: 16, fontWeight: 700, color: C.white }}>72,742</div>
            </div>
          </div>
        </CollapsibleSection>

        {/* SECTION 3: EXPANDABLE EQUIPMENT NODES */}
        <CollapsibleSection title="Expandable Equipment Nodes — 10 Machines" number="3" accent={ACCENT} defaultOpen={false}>
          <div style={{ fontFamily: Fnt.dm, fontSize: 11, color: C.grey, marginBottom: 12 }}>
            Click any node to expand full specs, motor data, and gate conditions. Anti-bridging handling throughout (paste form).
          </div>
          {FLOOR_NODES.map((node) => (
            <NodeCard key={node.id} node={node} accent={ACCENT} />
          ))}
        </CollapsibleSection>

        {/* SECTION 4: BUILDING DIMENSIONS & FLOOR PLAN */}
        <CollapsibleSection title="Building Dimensions & Floor Plan" number="4" accent={ACCENT} defaultOpen={false}>
          <BuildingDiagram building={BUILDING} accent={ACCENT} />
        </CollapsibleSection>

        {/* SECTION 5: CONVEYOR SYSTEM */}
        <CollapsibleSection title="Conveyor System" number="5" accent={ACCENT} defaultOpen={false}>
          <ConveyorTable conveyors={CONVEYORS} accent={ACCENT} />
        </CollapsibleSection>

        {/* SECTION 6: MIXING, NEUTRALISATION & S2 HANDOFF */}
        <CollapsibleSection title="Mixing, Neutralisation & S2 Handoff" number="6" accent={ACCENT} defaultOpen={false}>
          <div style={{ fontFamily: Fnt.dm, fontSize: 11, color: C.grey, marginBottom: 16, lineHeight: 1.7 }}>
            After the mandatory 24-hour dwell in BIN-OPDC-301, dried OPDC cake (pH 8.0-9.0) is discharged via screw conveyor
            into the conveyor gallery (BC-11: 25m covered, 4m wide) for transfer to the S2 composting greenhouse.
            PKSA (Palm Kernel Shell Ash) is dosed at 2-5% w/w during the S2 mixing stage to neutralise pH from ~8.0 down to 6.5-7.5,
            the optimal range for BSF colonisation and thermophilic composting.
          </div>

          <div style={{ marginTop: 8, padding: '12px 16px', background: 'rgba(232,64,64,.06)', border: '1px solid rgba(232,64,64,.25)', borderRadius: 6, marginBottom: 16 }}>
            <div style={{ fontFamily: Fnt.syne, fontSize: 12, fontWeight: 700, color: '#E84040', marginBottom: 6 }}>CLASS A Gate Rule</div>
            <div style={{ fontFamily: Fnt.dm, fontSize: 11, color: C.grey, lineHeight: 1.7 }}>
              The CLASS A moisture gate at OPR-01 (Screw Press) enforces an absolute moisture floor of MC {'\u2265'} 40%.
              The control logic is <span style={{ fontFamily: Fnt.mono, color: '#E84040' }}>Math.max(40, reading)</span> — if the press
              produces output below 40% MC, the system clamps to 40%. This is NON-NEGOTIABLE. Over-drying destroys pore structure
              and kills BSF colonisation capacity. The screw press filtrate routes to the POME pond and never contacts the substrate stream.
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10, marginBottom: 16 }}>
            {[
              { label: '24hr Dwell', val: '{"\u2265"}24 hrs', note: 'BIN-OPDC-301 holds product until pH stabilises to 8.0-9.0', color: C.amber },
              { label: 'PKSA Neutralisation', val: 'pH 8 {"\u2192"} 6.5-7.5', note: 'Palm Kernel Shell Ash dosed at 2-5% w/w during S2 mixing', color: C.green },
              { label: 'Conveyor Gallery', val: '25m {"\u00d7"} 4m', note: 'BC-11 covered gallery belt from Building A6 to S2 greenhouse', color: C.teal },
              { label: 'S2 Transfer', val: '~50 t/day', note: 'Dried/milled OPDC cake metered into S2 substrate mixer', color: C.amber },
            ].map((item, i) => (
              <div key={i} style={{ background: C.navyField, border: `1px solid ${C.bdrIdle}`, borderLeft: `3px solid ${item.color}`, borderRadius: 6, padding: '12px 14px' }}>
                <div style={{ fontFamily: Fnt.dm, fontSize: 10, fontWeight: 700, color: C.grey, textTransform: 'uppercase', marginBottom: 4 }}>{item.label}</div>
                <div style={{ fontFamily: Fnt.mono, fontSize: 16, fontWeight: 700, color: item.color, marginBottom: 4 }}>{item.val}</div>
                <div style={{ fontFamily: Fnt.dm, fontSize: 10, color: C.grey, lineHeight: 1.5 }}>{item.note}</div>
              </div>
            ))}
          </div>

          <div style={{ padding: '12px 16px', background: 'rgba(0,162,73,.06)', border: `1px solid rgba(0,162,73,.25)`, borderRadius: 6 }}>
            <div style={{ fontFamily: Fnt.syne, fontSize: 12, fontWeight: 700, color: C.green, marginBottom: 6 }}>S2 Greenhouse Transfer Protocol</div>
            <div style={{ fontFamily: Fnt.dm, fontSize: 11, color: C.grey, lineHeight: 1.7 }}>
              1. OPDC cake exits 24hr dwell bin (BIN-OPDC-301) via screw discharge at pH 8.0-9.0<br/>
              2. Conveyor gallery BC-11 (25m covered, 4m wide) transfers cake to S2 greenhouse<br/>
              3. Metered with EFB fibre and POS cake in S2 mixer to achieve blended C:N 25-30:1<br/>
              4. PKSA dosed at 2-5% w/w for pH neutralisation (pH 8.0 down to 6.5-7.5)<br/>
              5. Blended substrate formed into covered windrows for 28-day thermophilic composting<br/>
              6. Target core temperature: 55-65{'\u00b0'}C with forced-air aeration floor
            </div>
          </div>
        </CollapsibleSection>

        {/* SECTION 7: EQUIPMENT CAPEX */}
        <CollapsibleSection title="Equipment CAPEX — OPDC Line" number="7" accent={ACCENT} defaultOpen={false}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(0,0,0,.3)' }}>
                <th style={{ padding: '8px 12px', textAlign: 'left', fontFamily: Fnt.mono, fontSize: 10, fontWeight: 700, color: C.grey, textTransform: 'uppercase' }}>Code</th>
                <th style={{ padding: '8px 12px', textAlign: 'left', fontFamily: Fnt.mono, fontSize: 10, fontWeight: 700, color: C.grey, textTransform: 'uppercase' }}>Equipment</th>
                <th style={{ padding: '8px 12px', textAlign: 'right', fontFamily: Fnt.mono, fontSize: 10, fontWeight: 700, color: C.grey, textTransform: 'uppercase' }}>Cost</th>
              </tr>
            </thead>
            <tbody>
              {OPDC_EQUIP.map((eq, i) => (
                <tr key={i} style={{ borderBottom: `1px solid rgba(30,107,140,.15)` }}>
                  <td style={{ padding: '8px 12px', fontFamily: Fnt.mono, fontSize: 11, fontWeight: 700, color: ACCENT }}>{eq.code}</td>
                  <td style={{ padding: '8px 12px', fontFamily: Fnt.dm, fontSize: 11, color: C.white }}>{eq.name}</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', fontFamily: Fnt.mono, fontSize: 13, fontWeight: 700, color: C.amber }}>{eq.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: 12, padding: '12px 16px', background: 'rgba(245,166,35,.06)', border: `1px solid rgba(245,166,35,.25)`, borderRadius: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontFamily: Fnt.syne, fontSize: 13, fontWeight: 700, color: C.white }}>OPDC Line Total</div>
            <div style={{ fontFamily: Fnt.mono, fontSize: 18, fontWeight: 700, color: C.amber }}>$38,000</div>
          </div>
          <div style={{ marginTop: 10, fontFamily: Fnt.dm, fontSize: 11, color: C.grey }}>
            Monthly electricity: $6,651/mo · 72,742 kWh · PLN I-3 tariff IDR 1,444.70/kWh
          </div>
        </CollapsibleSection>
      </div>
    </>
  );
}
