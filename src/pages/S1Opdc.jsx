import { useNavigate } from "react-router-dom";
import {
  C, Fnt, S1_CSS, S0Header, S1Breadcrumb, LineHero,
  CollapsibleSection, Pre, SubstrateFlowStrip,
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

// ── FLOOR PLAN NODES ──
const NODES = [
  { code: 'RCV-OPDC-01', name: 'Opdc Receiving Bay', type: 'Concrete receiving bay with push-wall', spec: '25 m³ · ~12 t · Reinforced concrete + epoxy floor', motor: 'Wheel loader', footer: 'Wheel loader feeds RH-OPDC-101' },
  { code: 'RH-OPDC-101', name: 'Opdc Reciprocating Feeder', type: 'Hydraulic reciprocating feeder', spec: '5 t/h OPDC (70% MC) · 600mm stroke · 800mm width', motor: '5.5 kW hydraulic', footer: 'Meters OPDC onto belt conveyor' },
  { code: 'CV-OPDC-101', name: 'Opdc Belt Conveyor', type: 'Enclosed belt conveyor', spec: '15m × 500mm · 12° incline · 5 t/h', motor: '3.7 kW', footer: 'To OPR-01 screw press' },
  { code: 'OPR-01', name: 'Opdc Screw Press', type: 'Twin-screw dewatering press', spec: '5 t/h · 70% → 60% MC · 5–8 bar · Wedge wire 0.75mm', motor: '22 kW · VFD', footer: 'Class A gate — moisture sample before release' },
  { code: 'OTR-01', name: 'Opdc Trommel Screen', type: 'Rotary trommel', spec: 'Ø1200mm × 3000mm · 30mm perforations · 3.3 t/h', motor: '4 kW geared', footer: 'Removes oversized contaminants' },
  { code: 'ODR-01', name: 'Opdc Rotary Dryer', type: 'Direct-fired rotary drum dryer', spec: '3.3 t/h · 60% → 45% MC · Ø1500mm × 8000mm · PKS fuel', motor: '15 kW + 7.5 kW fan', footer: 'Reduces MC for hammer mill processing' },
  { code: 'OHM-01', name: 'Opdc Hammer Mill', type: 'Hammer mill with 3mm screen', spec: '3.3 t/h (45% MC) · 18 hammers · 1500 RPM', motor: '75 kW direct', footer: 'Noise zone — 85+ dBA · PPE required' },
  { code: 'OVS-01', name: 'Opdc Vibrating Screen', type: 'Single-deck vibrating screen', spec: '3.3 t/h · 3mm mesh · Oversize return to HM', motor: '1.5 kW vibratory', footer: 'Oversize loop to OHM-01' },
  { code: 'ODC-01', name: 'Opdc Dust Collector', type: 'Pulse-jet baghouse', spec: '3500 m³/h · 35 m² filter · <50 mg/Nm³', motor: '5.5 kW fan', footer: 'Serves dryer + hammer mill zone' },
  { code: 'BIN-OPDC-301', name: 'Opdc Product Bin', type: 'Steel product bin with 24-hour dwell', spec: '40 m³ · ~18 t · Moisture barrier · Screw discharge to S2', motor: '—', footer: '24hr dwell gate — holds product before S2 release' },
];

// ── CAPEX ──
const OPDC_EQUIP = [
  { code: 'TR-OPDC-101', name: 'OPDC Receiving Bay', cost: '$5,000' },
  { code: 'RH-OPDC-101', name: 'OPDC Reciprocating Feeder', cost: '$10,000' },
  { code: 'CV-OPDC-101', name: 'OPDC Feed Conveyor', cost: '$8,000' },
  { code: 'BIN-OPDC-301', name: 'OPDC Buffer Bin', cost: '$15,000' },
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

        {/* SECTION 3: FLOOR PLAN & DIMENSIONS */}
        <CollapsibleSection title="Floor Plan & Equipment Layout" number="3" accent={ACCENT} defaultOpen={false}>
          <div style={{ background: C.navy, border: `1.5px solid ${C.bdrIdle}`, borderRadius: 8, padding: '20px', marginBottom: 16, textAlign: 'center' }}>
            <div style={{ fontFamily: Fnt.syne, fontSize: 14, fontWeight: 700, color: ACCENT, marginBottom: 8 }}>Building A6 — Opdc Processing Hall</div>
            <div style={{ fontFamily: Fnt.mono, fontSize: 13, color: C.amber }}>18m × 36m × 10m H = 648 m²</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10 }}>
            {NODES.map((n, i) => (
              <div key={i} style={{ background: C.navyField, border: `1.5px solid ${C.bdrIdle}`, borderLeft: `3px solid ${ACCENT}`, borderRadius: 8, padding: '14px 16px' }}>
                <div style={{ fontFamily: Fnt.mono, fontSize: 11, fontWeight: 700, color: ACCENT, marginBottom: 4 }}>{n.code}</div>
                <div style={{ fontFamily: Fnt.syne, fontSize: 12, fontWeight: 700, color: C.white, marginBottom: 6 }}>{n.name}</div>
                <div style={{ fontFamily: Fnt.dm, fontSize: 10, color: C.grey, lineHeight: 1.5, marginBottom: 4 }}>{n.type}</div>
                <div style={{ fontFamily: Fnt.dm, fontSize: 10, color: C.greyMd, lineHeight: 1.5 }}>{n.spec}</div>
                <div style={{ fontFamily: Fnt.mono, fontSize: 10, color: C.teal, marginTop: 4 }}>{n.motor}</div>
                <div style={{ fontFamily: Fnt.dm, fontSize: 9, color: C.grey, marginTop: 6, fontStyle: 'italic' }}>{n.footer}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                {[
                  ['Throughput', '5 t/h @ 70% MC', '3.3 t/h @ 45% MC'],
                  ['Source', 'Mill decanter cake', 'Dried/milled cake to S2'],
                  ['Daily Input', '~75 t fresh', '~50 t processed'],
                  ['Installed Power', '~206 kW total', '—'],
                ].map((row, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${C.bdrIdle}` }}>
                    <td style={{ padding: '8px 12px', fontFamily: Fnt.dm, fontSize: 11, fontWeight: 700, color: C.grey }}>{row[0]}</td>
                    <td style={{ padding: '8px 12px', fontFamily: Fnt.mono, fontSize: 12, color: C.teal }}>{row[1]}</td>
                    <td style={{ padding: '8px 12px', fontFamily: Fnt.mono, fontSize: 12, color: C.amber }}>{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CollapsibleSection>

        {/* SECTION 4: CAPEX BREAKDOWN */}
        <CollapsibleSection title="Equipment CAPEX — OPDC Line" number="4" accent={ACCENT} defaultOpen={false}>
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
