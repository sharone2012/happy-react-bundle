import { useNavigate } from "react-router-dom";
import {
  C, Fnt, S1_CSS, S0Header, S1Breadcrumb, LineHero,
  CollapsibleSection, Pre, SubstrateFlowStrip, NodeCard, BuildingDiagram, TickerBar, ConveyorTable
} from "../../components/S1Shared/S1Shared.jsx";

/*
 * S1Pos.jsx — POS Pre-Skimming Line Detail
 * Route: /s1/pos
 * Combines: ASCII Flow + Equipment Register + Floor Plan + CAPEX
 */

const ACCENT = '#3B82F6';

// ── SUBSTRATE FLOW DATA ──
const INFLOWS = [
  { title: 'Monthly Volume', val: '900', suffix: ' t', unit: 'FW / month \u00b7 POS Sludge' },
  { title: 'Moisture', val: '82', suffix: '%', unit: 'MC wb \u00b7 Liquid/Semi' },
  { title: 'Crude Protein', val: '11', suffix: '%', unit: 'DM \u00b7 N 1.76% DM' },
  { title: 'Ash Content', val: '28', suffix: '%', unit: 'DM \u00b7 High Mineral' },
  { title: 'Fe Content', val: 'Variable', suffix: '', unit: 'mg/kg DM \u00b7 ICP-OES Gate', color: '#3B82F6' },
  { title: 'Organic Carbon', val: '\u2014', suffix: '%', unit: 'DM \u00b7 Pending Analysis', color: 'rgba(30,107,140,.6)' },
  { title: 'pH', val: '4.4', suffix: '', unit: 'Acidic \u00b7 Pre-CaCO\u2083' },
  { title: '', npk: [
    { key: 'N', val: '1.76', dir: 'eq' },
    { key: 'P', val: '\u2014', dir: 'eq' },
    { key: 'K', val: '\u2014', dir: 'eq' },
  ]},
];
const OUTFLOWS = [
  { title: 'Monthly Volume', val: '~405', suffix: ' t', unit: 'Cake / month \u00b7 Post-Press', dir: 'dn' },
  { title: 'Moisture', val: '65\u201370', suffix: '%', unit: 'MC wb \u00b7 Post-Filter Press', dir: 'dn' },
  { title: 'pH', val: '5.5\u20136.0', suffix: '', unit: 'Post-CaCO\u2083 Conditioning', dir: 'up' },
  { title: 'Fe Status', val: 'Gated', suffix: '', unit: 'ICP-OES Protocol', dir: 'eq' },
  { title: 'CaCO\u2083 Dose', val: '5\u201320', suffix: '% w/w', unit: 'Based on Fe Result', dir: 'eq' },
  { title: 'Screen Reject', val: 'Fibre', suffix: '', unit: '\u2192 EFB Line Recirculate', dir: 'eq' },
  { title: 'Filtrate', val: 'POME', suffix: '', unit: '\u2192 Mill Effluent System', dir: 'eq' },
  { title: '', npk: [
    { key: 'N', val: '1.76', dir: 'eq' },
    { key: 'P', val: '\u2014', dir: 'eq' },
    { key: 'K', val: '\u2014', dir: 'eq' },
  ]},
];

// ── EQUIPMENT REGISTER ──
const EQUIPMENT = [
  { code: 'RH-OPDC-101', name: 'Sludge Pit 15m\u00b3', tph: '1.25 tph', mcIn: '82%', mcOut: '82%', elev: '0m', kw: '0 kW', cost: '\u2014', supplier: 'ICP-OES-Fe: Fe result sets S2 inclusion' },
  { code: 'DRS-SLD-01', name: 'Rotary Drum Screen', tph: '1.17 tph', mcIn: '82%', mcOut: '78%', elev: '1.5m', kw: '7 kW', cost: '\u2014', supplier: '\u2014' },
  { code: 'DEC-SLD-101', name: 'Decanter Centrifuge', tph: '0.56 tph', mcIn: '78%', mcOut: '65%', elev: '3m', kw: '55 kW', cost: 'RFQ $80K\u2013$150K', supplier: 'PT Kharismapratama / SCK-Modipalm / Alfa Laval' },
  { code: 'BIN-OPDC-301', name: 'Buffer Tank 15m\u00b3', tph: '0.56 tph', mcIn: '65%', mcOut: '65%', elev: '3m', kw: '0 kW', cost: '\u2014', supplier: '\u2014' },
];

// ── FLOOR PLAN NODES (5 nodes — from HTML 1-pager) ──
const FLOOR_NODES = [
  {
    id: 1,
    tag: 'POS-PIT-01',
    name: 'Sludge Receiver Hopper',
    imgLabel: 'Sludge Receiver Hopper',
    imgSub: 'At-grade \u00b7 epoxy-lined concrete',
    svg: '<svg width="108" height="108" viewBox="0 0 86 86" xmlns="http://www.w3.org/2000/svg"><line x1="2" y1="18" x2="84" y2="18" stroke="#3B82F6" stroke-width="1.5"/><polygon points="8,18 78,18 68,58 18,58" fill="#1a2a3d" stroke="#3B82F6" stroke-width="1.3"/><line x1="8" y1="26" x2="18" y2="18" stroke="#3B82F6" stroke-width="0.9" opacity=".5"/><line x1="22" y1="34" x2="38" y2="18" stroke="#3B82F6" stroke-width="0.9" opacity=".5"/><line x1="38" y1="42" x2="60" y2="18" stroke="#3B82F6" stroke-width="0.9" opacity=".5"/><line x1="56" y1="50" x2="78" y2="26" stroke="#3B82F6" stroke-width="0.9" opacity=".5"/><text x="43" y="45" font-family="DM Mono" font-size="7" fill="#A8BDD0" text-anchor="middle">60\u00b0 walls</text><rect x="30" y="58" width="26" height="6" fill="#3B82F6" rx="1"/><text x="43" y="72" font-family="DM Mono" font-size="7.5" fill="#A8BDD0" text-anchor="middle">15 m\u00b3 \u00b7 at-grade</text><text x="43" y="82" font-family="DM Mono" font-size="7" fill="#F5A623" text-anchor="middle">lip EL +0.8\u20131.0m</text></svg>',
    classA: false, noise: false, dwell: false,
    specs: [
      ['Location', 'At-grade \u00b7 EL 0.0m slab', 'Material', 'Reinforced concrete C30'],
      ['Volume', '15 m\u00b3', 'Wall angle', '60\u00b0 sloped (anti-bridging)'],
      ['Dimensions', 'L 3.5m \u00d7 W 2.5m \u00d7 H 2.0m', 'Lining', 'Epoxy (oil-resistant)'],
      ['Drainage', '150mm bottom valve \u2192 POME', 'Moisture in', '82%'],
      ['Inputs', 'Gravity feed \u00b7 truck tip', 'Throughput', '1.5 t/h'],
    ],
    note: 'Truck bed ramps to EL +1.2m above lip',
    conn: 'PMP-POS-01 \u00b7 progressive cavity pump \u00b7 0.75 kW \u00b7 DN100 \u00b7 VFD \u00b7 pipe to buffer tank',
  },
  {
    id: 2,
    tag: 'T-SLD-101',
    name: 'Sludge Buffer Tank',
    imgLabel: 'Sludge Buffer Tank',
    imgSub: 'SS304 \u00b7 sealed dome \u00b7 biofilter vent',
    svg: '<svg width="108" height="108" viewBox="0 0 86 86" xmlns="http://www.w3.org/2000/svg"><ellipse cx="43" cy="10" rx="22" ry="6" fill="#1a2a3d" stroke="#3B82F6" stroke-width="1.3"/><rect x="21" y="10" width="44" height="52" fill="#1a2a3d" stroke="#3B82F6" stroke-width="1.3"/><ellipse cx="43" cy="62" rx="22" ry="6" fill="#152334" stroke="#3B82F6" stroke-width="1.3"/><text x="43" y="38" font-family="DM Mono" font-size="7.5" fill="#A8BDD0" text-anchor="middle">SS304</text><text x="43" y="48" font-family="DM Mono" font-size="7" fill="#F5A623" text-anchor="middle">sealed dome</text><line x1="43" y1="4" x2="58" y2="4" stroke="#3B82F6" stroke-width="1.1"/><line x1="58" y1="4" x2="58" y2="14" stroke="#3B82F6" stroke-width="1.1"/><text x="62" y="11" font-family="DM Mono" font-size="7" fill="#A8BDD0">\u2192 biofilter</text><line x1="21" y1="26" x2="10" y2="26" stroke="#3B82F6" stroke-width="1.1"/><circle cx="8" cy="26" r="3.5" fill="none" stroke="#3B82F6" stroke-width="1.1"/><text x="8" y="36" font-family="DM Mono" font-size="7" fill="#A8BDD0" text-anchor="middle">pH</text><text x="43" y="78" font-family="DM Mono" font-size="7.5" fill="#A8BDD0" text-anchor="middle">5\u20138 m\u00b3 \u00b7 3.7 kW agitator</text></svg>',
    classA: false, noise: false, dwell: false,
    specs: [
      ['Location', 'EL 0.0m \u00b7 ground', 'Material', 'SS304 stainless steel'],
      ['Volume', '5\u20138 m\u00b3 working', 'Geometry', '\u00d82.2m \u00d7 1.8\u20132.2m'],
      ['Agitator', '3.7 kW \u00b7 top-entry', 'Moisture in', '82%'],
      ['Vent', 'Sealed dome \u2192 biofilter', 'Instruments', 'Temp \u00b7 pH \u00b7 Fe meter'],
      ['Manufacturer', 'TBC after RFQ', 'Power', '\u2014'],
    ],
    note: 'POS is high-lipid acid-forming \u2014 odour control via biofilter',
    conn: 'Feed pump \u00b7 0.75 kW \u00b7 DN100 \u00b7 pipe to rotary drum screen',
  },
  {
    id: 3,
    tag: 'SCR-POS-01',
    name: 'Rotary Drum Screen',
    imgLabel: 'Rotary Drum Screen',
    imgSub: '2 mm aperture',
    svg: '<svg width="108" height="108" viewBox="0 0 86 86" xmlns="http://www.w3.org/2000/svg"><ellipse cx="14" cy="43" rx="9" ry="22" fill="#1a2a3d" stroke="#3B82F6" stroke-width="1.3"/><rect x="14" y="21" width="58" height="44" fill="#1a2a3d" stroke="#3B82F6" stroke-width="1.3"/><ellipse cx="72" cy="43" rx="9" ry="22" fill="#152334" stroke="#3B82F6" stroke-width="1.3"/><circle cx="28" cy="31" r="2.3" fill="none" stroke="#A8BDD0" stroke-width="1"/><circle cx="43" cy="31" r="2.3" fill="none" stroke="#A8BDD0" stroke-width="1"/><circle cx="58" cy="31" r="2.3" fill="none" stroke="#A8BDD0" stroke-width="1"/><circle cx="28" cy="43" r="2.3" fill="none" stroke="#A8BDD0" stroke-width="1"/><circle cx="43" cy="43" r="2.3" fill="none" stroke="#A8BDD0" stroke-width="1"/><circle cx="58" cy="43" r="2.3" fill="none" stroke="#A8BDD0" stroke-width="1"/><circle cx="28" cy="55" r="2.3" fill="none" stroke="#A8BDD0" stroke-width="1"/><circle cx="43" cy="55" r="2.3" fill="none" stroke="#A8BDD0" stroke-width="1"/><circle cx="58" cy="55" r="2.3" fill="none" stroke="#A8BDD0" stroke-width="1"/><rect x="23" y="67" width="11" height="8" fill="#3B82F6" rx="2"/><rect x="62" y="67" width="11" height="8" fill="#3B82F6" rx="2"/></svg>',
    classA: false, noise: false, dwell: false,
    specs: [
      ['Location', '+0.5m platform', 'Power', '1.5 kW'],
      ['Aperture', '2 mm', 'Function', 'Gross solids removal'],
      ['Inputs', 'POS slurry', 'Moisture in', '82%'],
      ['Rejects to', 'EFB composting line', 'Throughput', '1.5 t/h'],
      ['Material', 'SS316L drum', 'Manufacturer', 'TBC after RFQ'],
    ],
    gate: { label: 'ICP-OES Fe GATE', bg: 'rgba(59,130,246,.1)', color: '#3B82F6' },
    conn: 'Feed pump \u00b7 0.75 kW \u00b7 DN100 \u00b7 pipe to decanter centrifuge',
  },
  {
    id: 4,
    tag: 'DCN-POS-01',
    name: 'Decanter Centrifuge',
    imgLabel: 'Decanter Centrifuge',
    imgSub: 'Horizontal centrifuge',
    svg: '<svg width="108" height="108" viewBox="0 0 86 86" xmlns="http://www.w3.org/2000/svg"><ellipse cx="18" cy="55" rx="11" ry="22" fill="#1a2a3d" stroke="#3B82F6" stroke-width="1.5"/><rect x="18" y="33" width="44" height="44" fill="#1a2a3d" stroke="#3B82F6" stroke-width="1.5"/><polygon points="62,33 62,77 78,55" fill="#152334" stroke="#3B82F6" stroke-width="1.5"/><line x1="78" y1="55" x2="84" y2="55" stroke="#3B82F6" stroke-width="1.5"/><line x1="43" y1="77" x2="43" y2="83" stroke="#A8BDD0" stroke-width="1" stroke-dasharray="2,2"/><rect x="4" y="9" width="72" height="18" fill="#3B82F6" rx="2"/><text x="40" y="21" font-family="DM Mono" font-size="10.5" fill="#fff" text-anchor="middle" font-weight="700">ICP-OES Fe gate</text></svg>',
    classA: false, noise: false, dwell: false,
    specs: [
      ['Location', '+2.5m platform', 'Power', '11 kW'],
      ['Bowl material', 'SS316L', 'Bowl \u00d8', '500 mm'],
      ['Moisture in', '82%', 'Moisture out', '65%'],
      ['Throughput', '1.5 t/h', 'Centrate to', 'POME pond'],
      ['Manufacturer', 'Alfa Laval preferred', 'Model', 'TBC after RFQ'],
    ],
    warning: 'ICP-OES Fe test determines S2 inclusion rate \u00b7 Protocol CFI-LAB-POME-001',
    gate: { label: 'ICP-OES Fe GATE', bg: 'rgba(59,130,246,.1)', color: '#3B82F6' },
    conn: 'Transfer belt \u00b7 0.75 kW \u00b7 decanted cake \u00b7 65% MC \u00b7 to buffer tank',
  },
  {
    id: 5,
    tag: 'BUF-POS-01',
    name: 'Buffer Holding Tank',
    imgLabel: 'Buffer Holding Tank',
    imgSub: 'Agitator + pH probe',
    svg: '<svg width="108" height="108" viewBox="0 0 86 86" xmlns="http://www.w3.org/2000/svg"><rect x="23" y="8" width="40" height="50" fill="#1a2a3d" stroke="#3B82F6" stroke-width="1.3" rx="1"/><polygon points="23,58 63,58 54,72 32,72" fill="#152334" stroke="#3B82F6" stroke-width="1.3"/><rect x="25" y="22" width="36" height="36" fill="rgba(59,130,246,0.05)"/><line x1="43" y1="8" x2="43" y2="56" stroke="#A8BDD0" stroke-width="1.1"/><line x1="30" y1="44" x2="56" y2="50" stroke="#A8BDD0" stroke-width="1.1"/><line x1="30" y1="50" x2="56" y2="44" stroke="#A8BDD0" stroke-width="1.1"/><line x1="23" y1="26" x2="11" y2="26" stroke="#3B82F6" stroke-width="1.1"/><circle cx="9" cy="26" r="4.5" fill="none" stroke="#3B82F6" stroke-width="1.1"/><text x="9" y="38" font-family="DM Mono" font-size="7" fill="#A8BDD0" text-anchor="middle">pH</text></svg>',
    classA: false, noise: false, dwell: false,
    specs: [
      ['Location', '+1.0m platform', 'Material', 'HDPE / SS316L'],
      ['Volume', '5 m\u00b3', 'Agitator', '1.1 kW'],
      ['Inputs', 'Decanted cake', 'Moisture in', '65%'],
      ['Instruments', 'Temp \u00b7 pH \u00b7 Fe meter', 'Throughput', '1.5 t/h'],
      ['Manufacturer', 'TBC after RFQ', 'Capacity', 'Fe-gated inclusion'],
    ],
    note: 'Fe-gated inclusion \u2014 metered flow to S2',
    conn: 'PMP-POS-02 \u00b7 transfer pump \u00b7 0.75 kW \u00b7 DN80 \u00b7 metered flow to S2',
  },
];

const BUILDING = { name: "Building A7 \u2014 Utility Building (Pos)", width: "12m", length: "18m", height: "6m", area: "216 m\u00b2" };

const TICKER = [
  { label: 'Throughput In', val: '1.5 t/h', color: '#40D7C5' },
  { label: 'Throughput Out', val: '~0.55 t/h', color: '#40D7C5' },
  { label: 'MC In', val: '82%', color: '#E8F0FE' },
  { label: 'MC Out', val: '65%', color: '#E8F0FE' },
  { label: 'Installed Power', val: '~20 kW', color: '#F5A623' },
  { label: 'Daily Input', val: '~30 t', color: '#00A249' },
  { label: 'Daily Output', val: '~13.5 t', color: '#00A249' },
];

// ── CAPEX ──
const POS_EQUIP = [
  { code: 'DEC-SLD-101', name: 'POS 3-Phase Decanter', cost: 'RFQ $80K\u2013$150K' },
];

export default function S1Pos() {
  return (
    <>
      <style>{S1_CSS}</style>
      <LineHero
        name="S1A — POS Pre-Skimming Line"
        throughput="1.25 t/h · Liquid/Semi"
        power="62 kW Total"
        nodes="4–7"
        accent={ACCENT}
        badges={[
          { text: 'ICP-OES Fe Gate', cls: 'bdg-b' },
          { text: 'CaCO₃ Dosing', cls: 'bdg-a' },
        ]}
      />
      <S1Breadcrumb activeLine="POS Line" />

      <div style={{ marginTop: 10 }}>
        <SubstrateFlowStrip
          stageLabel="Substrate Flow — S0 Raw POS Sludge → S1 Conditioned Cake"
          inflows={INFLOWS}
          outflows={OUTFLOWS}
        />
      </div>

      <TickerBar items={TICKER} />

      <div className="content">
        {/* SECTION 1: ASCII PROCESS FLOW */}
        <CollapsibleSection title="ASCII Process Flow — POS Line" number="1" accent={ACCENT} defaultOpen={true}>
          <div style={{ fontFamily: Fnt.dm, fontSize: 10, color: C.grey, marginBottom: 10 }}>
            CFI S1A — POS LINE · 60 TPH FFB Mill · Bogor, West Java · March 2026 · CFI-S1-POS-ASCII-001 Rev 01
          </div>
          <div style={{ fontFamily: Fnt.dm, fontSize: 11, color: '#3B82F6', marginBottom: 6 }}>
            Source: 30 t/day FW · 82% MC · Ash 28% DM · CP 11% DM · N 1.76% DM · Truck delivery
          </div>
          <Pre accent={ACCENT}>{`
  ┌─────────────────────────────────────────────────────────────────────────────────────────────────────────┐
  │  S1A  POS  PRE-SKIMMING  LINE  ·  4–7 UNITS  ·  62 kW  ·  1.25 t/h                                 │
  │  Elevation: EL +1.2m → 0.0m                                                                          │
  └─────────────────────────────────────────────────────────────────────────────────────────────────────────┘

  ┌───────────────────────────────────┐    ┌──────────────────────────────────────────┐
  │ POS-PIT-01                        │    │  PMP-POS-01                              │
  │ SLUDGE RECEIVER HOPPER            │───▶│  Progressive Cavity Pump                 │
  │ EL +0.8–1.0m · 15 m³             │    │  0.75 kW · DN100 · VFD                   │
  │ Reinforced concrete · epoxy-coated│    │  Pipe to buffer tank                     │
  │ 3.5m L × 2.5m W × 2.0m H        │    │                                          │
  │ 60° sloped walls · 150mm drain   │    │                                          │
  └───────────────────────────────────┘    └──────────────────────────────────────────┘
                                                    │
                                                    ▼
  ┌───────────────────────────────────┐    ┌──────────────────────────────────────────┐
  │ T-SLD-101                         │    │  SCR-POS-01                              │
  │ SLUDGE BUFFER TANK                │───▶│  ROTARY DRUM SCREEN                      │
  │ EL 0.0m · SS304 · sealed dome    │    │  EL +0.5m · SS316L · 1.5 kW             │
  │ 5–8 m³ · Ø2.2m × 1.8–2.2m      │    │  2mm aperture                            │
  │ AGITATOR: 3.7 kW                 │    │  Reject: fibre + shell → EFB line        │
  │ FEED PUMP: 0.75 kW               │    │                                          │
  └───────────────────────────────────┘    └──────────────────────────────────────────┘
                                                    │
                                                    ▼
  ┌──────────────────────────────────────────────────────────────────────────────────────┐
  │  `}<span className="gate-blue">ICP-OES Fe CHECKPOINT (BLUE GATE)</span>{`                                                    │
  │  Fe thresholds determine CaCO₃ dosing:                                              │
  │  `}<span className="gate-blue">Fe &lt; 3,000 mg/kg  →  CaCO₃ at 20% w/w (standard dose)</span>{`                           │
  │  `}<span className="gate-amber">Fe 3,000–5,000   →  CaCO₃ at 10–15% w/w (moderate)</span>{`                             │
  │  `}<span className="gate-amber">Fe 5,000–8,000   →  CaCO₃ at 5–10% w/w (reduced)</span>{`                               │
  │  `}<span className="gate-red">Fe &gt; 8,000       →  CaCO₃ protocol review required</span>{`                              │
  └──────────────────────────────────────────────────────────────────────────────────────┘
                                                    │
                                                    ▼
  ┌───────────────────────────────────┐    ┌──────────────────────────────────────────┐
  │ MIX-POS-01                        │    │  FP-POS-01                               │
  │ CONDITIONING MIXER                │───▶│  FILTER PRESS                             │
  │ EL +0.3m · SS304 · 2.2 kW        │    │  EL 0.0m · 15 kW hydraulic               │
  │ 500L batch · CaCO₃ dosing        │    │  630mm × 630mm plates · 25 chambers      │
  │ pH target: 4.4 → 5.5–6.0         │    │  MC: 82% → 65–70%                        │
  │ Residence: 15–20 min per batch    │    │  Cycle: 45–60 min per batch              │
  └───────────────────────────────────┘    └──────────────────────────────────────────┘

  ─── S2 DISCHARGE ───
  `}<span className="gate-blue">POS conditioned cake to S2 Composting / BSF</span>
          </Pre>
        </CollapsibleSection>

        {/* SECTION 2: EQUIPMENT REGISTER */}
        <CollapsibleSection title="Equipment Register — 4–7 Nodes" number="2" accent={ACCENT} defaultOpen={false}>
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
              <div style={{ fontFamily: Fnt.mono, fontSize: 16, fontWeight: 700, color: C.teal }}>62 kW</div>
            </div>
            <div style={{ background: 'rgba(0,0,0,.2)', border: `1px solid ${C.bdrIdle}`, borderRadius: 6, padding: '10px 16px' }}>
              <div style={{ fontFamily: Fnt.dm, fontSize: 10, fontWeight: 700, color: C.grey, textTransform: 'uppercase' }}>Total CapEx</div>
              <div style={{ fontFamily: Fnt.mono, fontSize: 16, fontWeight: 700, color: C.amber }}>RFQ Pending</div>
            </div>
            <div style={{ background: 'rgba(0,0,0,.2)', border: `1px solid ${C.bdrIdle}`, borderRadius: 6, padding: '10px 16px' }}>
              <div style={{ fontFamily: Fnt.dm, fontSize: 10, fontWeight: 700, color: C.grey, textTransform: 'uppercase' }}>Monthly Elec</div>
              <div style={{ fontFamily: Fnt.mono, fontSize: 16, fontWeight: 700, color: C.amber }}>$1,806/mo</div>
            </div>
            <div style={{ background: 'rgba(0,0,0,.2)', border: `1px solid ${C.bdrIdle}`, borderRadius: 6, padding: '10px 16px' }}>
              <div style={{ fontFamily: Fnt.dm, fontSize: 10, fontWeight: 700, color: C.grey, textTransform: 'uppercase' }}>Monthly kWh</div>
              <div style={{ fontFamily: Fnt.mono, fontSize: 16, fontWeight: 700, color: C.white }}>19,747</div>
            </div>
          </div>
        </CollapsibleSection>

        {/* SECTION 3: EXPANDABLE EQUIPMENT NODES */}
        <CollapsibleSection title="Expandable Equipment Nodes — 5 Units" number="3" accent={ACCENT} defaultOpen={false}>
          {FLOOR_NODES.map(node => (
            <NodeCard key={node.id} node={node} accent={ACCENT} />
          ))}
        </CollapsibleSection>

        {/* SECTION 4: BUILDING DIMENSIONS & FLOOR PLAN */}
        <CollapsibleSection title="Building Dimensions & Floor Plan" number="4" accent={ACCENT} defaultOpen={false}>
          <BuildingDiagram building={BUILDING} accent={ACCENT} />
          <div style={{ marginTop: 16 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                {[
                  ['Throughput', '1.5 t/h @ 82% MC', '~0.55 t/h @ 65% MC'],
                  ['Source', 'Mill decanter sludge discharge', 'Dewatered cake'],
                  ['Daily Input', '~30 t fresh (80–92% MC)', '~13.5 t to S2'],
                  ['Installed Power', '~20 kW total', '—'],
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

        {/* SECTION 5: ICP-OES Fe GATE PROTOCOL */}
        <CollapsibleSection title="ICP-OES Fe Gate Protocol — CFI-LAB-POME-001" number="5" accent="#3B82F6" defaultOpen={false}>
          <div style={{ padding: '16px 20px', background: 'rgba(59,130,246,.06)', border: '1.5px solid rgba(59,130,246,.25)', borderRadius: 8, marginBottom: 16 }}>
            <div style={{ fontFamily: Fnt.syne, fontSize: 14, fontWeight: 700, color: '#3B82F6', marginBottom: 8 }}>
              Iron (Fe) Threshold Protocol
            </div>
            <div style={{ fontFamily: Fnt.dm, fontSize: 12, color: C.grey, lineHeight: 1.7, marginBottom: 12 }}>
              POS (Palm Oil Sludge) contains variable iron concentrations from mill processing equipment wear.
              Elevated Fe inhibits composting and BSF bioconversion. ICP-OES testing at the rotary drum screen
              and decanter centrifuge stages determines the CaCO₃ conditioning dose and S2 inclusion rate.
            </div>
            <div style={{ display: 'grid', gap: 8 }}>
              {[
                { range: 'Fe < 3,000 mg/kg', dose: 'CaCO₃ at 20% w/w', severity: 'Standard dose', bg: 'rgba(59,130,246,.08)', border: 'rgba(59,130,246,.3)', color: '#3B82F6' },
                { range: 'Fe 3,000–5,000 mg/kg', dose: 'CaCO₃ at 10–15% w/w', severity: 'Moderate', bg: 'rgba(245,166,35,.08)', border: 'rgba(245,166,35,.3)', color: '#F5A623' },
                { range: 'Fe 5,000–8,000 mg/kg', dose: 'CaCO₃ at 5–10% w/w', severity: 'Reduced', bg: 'rgba(245,166,35,.08)', border: 'rgba(245,166,35,.3)', color: '#F5A623' },
                { range: 'Fe > 8,000 mg/kg', dose: 'CaCO₃ protocol review required', severity: 'Hold / Review', bg: 'rgba(232,64,64,.08)', border: 'rgba(232,64,64,.3)', color: '#E84040' },
              ].map((tier, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 16, padding: '10px 16px',
                  background: tier.bg, border: `1px solid ${tier.border}`, borderRadius: 6,
                }}>
                  <div style={{ fontFamily: Fnt.mono, fontSize: 12, fontWeight: 700, color: tier.color, minWidth: 180 }}>{tier.range}</div>
                  <div style={{ fontFamily: Fnt.dm, fontSize: 12, fontWeight: 600, color: C.white, flex: 1 }}>{tier.dose}</div>
                  <div style={{ fontFamily: Fnt.mono, fontSize: 10, fontWeight: 700, padding: '2px 10px', borderRadius: 4, background: tier.bg, color: tier.color, border: `1px solid ${tier.border}` }}>{tier.severity}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 14, fontFamily: Fnt.dm, fontSize: 11, color: C.greyLt, lineHeight: 1.6 }}>
              <strong style={{ color: '#3B82F6' }}>Sampling:</strong> Grab sample at SCR-POS-01 (rotary drum screen) and DCN-POS-01 (decanter centrifuge).
              ICP-OES analysis per protocol CFI-LAB-POME-001. Results determine CaCO₃ dose at MIX-POS-01 conditioning mixer.
              Fe &gt; 8,000 mg/kg triggers management review before S2 inclusion.
            </div>
          </div>
        </CollapsibleSection>

        {/* SECTION 6: CONDITIONING, MIXING & S2 HANDOFF */}
        <CollapsibleSection title="Conditioning, Mixing & S2 Handoff" number="6" accent={ACCENT} defaultOpen={false}>
          <div style={{ display: 'grid', gap: 14 }}>
            <div style={{ background: C.navyCard, border: `1.5px solid ${C.bdrIdle}`, borderLeft: `4px solid ${ACCENT}`, borderRadius: 8, padding: '16px 20px' }}>
              <div style={{ fontFamily: Fnt.syne, fontSize: 13, fontWeight: 700, color: C.white, marginBottom: 8 }}>CaCO₃ Conditioning Mixer (MIX-POS-01)</div>
              <div style={{ fontFamily: Fnt.dm, fontSize: 12, color: C.grey, lineHeight: 1.7 }}>
                SS304 paddle mixer with 500L batch capacity (2.2 kW). CaCO₃ (calcium carbonate / agricultural lime)
                is dosed based on the ICP-OES Fe gate result to raise pH from the raw POS level of ~4.4 up to
                the target range of 5.5–6.0. Residence time is 15–20 minutes per batch to ensure thorough mixing
                and pH equilibration. The acidic nature of POS (high lipid content, rapid acid formation) requires
                consistent conditioning before downstream processing.
              </div>
            </div>
            <div style={{ background: C.navyCard, border: `1.5px solid ${C.bdrIdle}`, borderLeft: `4px solid ${C.amber}`, borderRadius: 8, padding: '16px 20px' }}>
              <div style={{ fontFamily: Fnt.syne, fontSize: 13, fontWeight: 700, color: C.white, marginBottom: 8 }}>Filter Press Dewatering (FP-POS-01)</div>
              <div style={{ fontFamily: Fnt.dm, fontSize: 12, color: C.grey, lineHeight: 1.7 }}>
                Chamber filter press (15 kW hydraulic) with 630mm × 630mm plates across 25 chambers.
                Reduces moisture content from 82% to 65–70% over a 45–60 minute cycle per batch.
                Filtrate is routed to the POME (Palm Oil Mill Effluent) system — never recirculated to substrate lines.
                Dewatered cake drops into the buffer holding tank (BUF-POS-01) for Fe-gated S2 transfer.
              </div>
            </div>
            <div style={{ background: C.navyCard, border: `1.5px solid ${C.bdrIdle}`, borderLeft: `4px solid ${C.green}`, borderRadius: 8, padding: '16px 20px' }}>
              <div style={{ fontFamily: Fnt.syne, fontSize: 13, fontWeight: 700, color: C.white, marginBottom: 8 }}>S2 Transfer & Handoff</div>
              <div style={{ fontFamily: Fnt.dm, fontSize: 12, color: C.grey, lineHeight: 1.7 }}>
                Conditioned and dewatered POS cake at 65% MC is held in the buffer holding tank (BUF-POS-01, 5 m³ HDPE/SS316L)
                with continuous low-speed agitation (1.1 kW). Transfer to S2 greenhouse composting/BSF facility is metered
                via PMP-POS-02 progressive cavity transfer pump (0.75 kW, DN80). Flow rate is controlled by VFD to match
                S2 windrow or BSF bed loading schedules. Fe-gated inclusion rate applies — the ICP-OES result at screening/decanting
                determines what proportion of POS cake enters the S2 substrate blend versus diversion to separate treatment.
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* SECTION 7: EQUIPMENT CAPEX */}
        <CollapsibleSection title="Equipment CAPEX — POS Line" number="7" accent={ACCENT} defaultOpen={false}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(0,0,0,.3)' }}>
                <th style={{ padding: '8px 12px', textAlign: 'left', fontFamily: Fnt.mono, fontSize: 10, fontWeight: 700, color: C.grey, textTransform: 'uppercase' }}>Code</th>
                <th style={{ padding: '8px 12px', textAlign: 'left', fontFamily: Fnt.mono, fontSize: 10, fontWeight: 700, color: C.grey, textTransform: 'uppercase' }}>Equipment</th>
                <th style={{ padding: '8px 12px', textAlign: 'right', fontFamily: Fnt.mono, fontSize: 10, fontWeight: 700, color: C.grey, textTransform: 'uppercase' }}>Cost</th>
              </tr>
            </thead>
            <tbody>
              {POS_EQUIP.map((eq, i) => (
                <tr key={i} style={{ borderBottom: `1px solid rgba(30,107,140,.15)` }}>
                  <td style={{ padding: '8px 12px', fontFamily: Fnt.mono, fontSize: 11, fontWeight: 700, color: ACCENT }}>{eq.code}</td>
                  <td style={{ padding: '8px 12px', fontFamily: Fnt.dm, fontSize: 11, color: C.white }}>{eq.name}</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', fontFamily: Fnt.mono, fontSize: 13, fontWeight: 700, color: C.amber }}>{eq.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: 12, padding: '12px 16px', background: 'rgba(59,130,246,.06)', border: `1px solid rgba(59,130,246,.25)`, borderRadius: 6 }}>
            <div style={{ fontFamily: Fnt.syne, fontSize: 12, fontWeight: 700, color: C.white, marginBottom: 4 }}>POS Line — Decanter Pricing</div>
            <div style={{ fontFamily: Fnt.dm, fontSize: 11, color: C.grey, lineHeight: 1.6 }}>
              RFQ pending: $80K–$150K for 3-phase decanter centrifuge. Suppliers: PT Kharismapratama, SCK-Modipalm, Alfa Laval.
              Other equipment (hopper, pump, tank, screen, mixer, filter press) pricing TBC from local fabricators.
            </div>
          </div>
          <div style={{ marginTop: 10, fontFamily: Fnt.dm, fontSize: 11, color: C.grey }}>
            Monthly electricity: $1,806/mo · 19,747 kWh · PLN I-3 tariff IDR 1,444.70/kWh
          </div>
        </CollapsibleSection>
        {/* 1-PAGER LINK */}
        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
          <a
            href="/CFI_S1_POS_Processing_Line_1Pager.html"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '10px 22px', borderRadius: 6,
              border: `1.5px solid ${ACCENT}`,
              background: 'transparent', color: ACCENT,
              fontFamily: Fnt.dm, fontSize: 13, fontWeight: 700,
              textDecoration: 'none', letterSpacing: '.02em',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = ACCENT; e.currentTarget.style.color = C.navy; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = ACCENT; }}
          >
            📄 View POS Processing Line 1-Pager
          </a>
        </div>      </div>
    </>
  );
}
