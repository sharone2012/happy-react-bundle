import { useNavigate } from "react-router-dom";
import {
  C, Fnt, S1_CSS, S0Header, S1Breadcrumb, LineHero,
  CollapsibleSection, Pre, SubstrateFlowStrip,
  NodeCard, BuildingDiagram, ConveyorTable, TickerBar,
} from "../components/S1Shared.jsx";

/*
 * S1Efb.jsx — EFB Pre-Processing Line Detail
 * Route: /s1/efb
 * Combines: ASCII Flow + Equipment Register + Floor Plan + CAPEX
 */

const ACCENT = C.teal;

// ── SUBSTRATE FLOW DATA ──
const INFLOWS = [
  { title: 'Monthly Volume', val: '8,262', suffix: ' t', unit: 'FW / month · EFB @ 22% FFB' },
  { title: 'Moisture', val: '62.5', suffix: '%', unit: 'MC wb · Press Discharge' },
  { title: 'Crude Protein', val: '4.75', suffix: '%', unit: 'DM · N × 6.25' },
  { title: 'Lignin ADL', val: '22', suffix: '%', unit: 'DM · EFB Canonical' },
  { title: 'Red. Sugars', val: '—', suffix: '%', unit: 'DM · Pre-PKSA', color: 'rgba(30,107,140,.6)' },
  { title: 'Organic Carbon', val: '41', suffix: '%', unit: 'DM · CHNS' },
  { title: 'C:N Ratio', val: '60', suffix: ':1', unit: 'DM · High Carbon' },
  { title: '', npk: [
    { key: 'N', val: '0.76', dir: 'eq' },
    { key: 'P', val: '0.20', dir: 'eq' },
    { key: 'K', val: '2.20', dir: 'eq' },
  ]},
];
const OUTFLOWS = [
  { title: 'Monthly Volume', val: '5,370', suffix: ' t', unit: 'FW / month · Post-Press', dir: 'dn' },
  { title: 'Moisture', val: '45–50', suffix: '%', unit: 'MC wb · D90 ≤ 2mm', dir: 'dn' },
  { title: 'Particle Size', val: '≤2', suffix: 'mm', unit: 'D90 · Vibrating Screen', dir: 'dn' },
  { title: 'Lignin ADL', val: '22', suffix: '%', unit: 'DM · Unchanged', dir: 'eq' },
  { title: 'Daily Output', val: '~195', suffix: ' t', unit: 'Milled fibre to S2', dir: 'dn' },
  { title: 'Belt Width', val: '600', suffix: 'mm', unit: 'EFB Line Standard', dir: 'eq' },
  { title: 'C:N Ratio', val: '60', suffix: ':1', unit: 'DM · Unchanged', dir: 'eq' },
  { title: '', npk: [
    { key: 'N', val: '582', dir: 'up' },
    { key: 'P', val: '197', dir: 'up' },
    { key: 'K', val: '930', dir: 'up' },
  ]},
];

// ── EQUIPMENT REGISTER ──
const EQUIPMENT = [
  { code: 'AF-01', name: 'Hydraulic Feeder', tph: '20 tph', mcIn: '62.5%', mcOut: '62.5%', elev: '0m', kw: '18 kW', cost: '$15,000', supplier: 'PT Jayatech Palmindo' },
  { code: 'BC-01/02', name: 'Incline Conveyor 600mm', tph: '20 tph', mcIn: '62.5%', mcOut: '62.5%', elev: '2m', kw: '22 kW', cost: '$18,000', supplier: 'PT Sinar Surya Lestari' },
  { code: 'TR-2060', name: 'Trommel Screen 50mm', tph: '19 tph', mcIn: '62.5%', mcOut: '62.5%', elev: '6m', kw: '11 kW', cost: '$8,000', supplier: 'PT Hans Jaya Utama' },
  { code: 'OBM-01', name: 'Overband Magnet', tph: '19 tph', mcIn: '62.5%', mcOut: '62.5%', elev: '6m', kw: '3 kW', cost: '—', supplier: '—' },
  { code: 'PR-01', name: 'Screw Press + PKSA', tph: '14 tph', mcIn: '62.5%', mcOut: '47.5%', elev: '6m', kw: '30 kW', cost: '—', supplier: '— [GATE B.G2]' },
  { code: 'SD-01', name: 'Primary Shredder', tph: '14 tph', mcIn: '47.5%', mcOut: '47.5%', elev: '6m', kw: '75 kW', cost: '$45,000', supplier: 'CV Has Engineering' },
  { code: 'HM-01', name: 'Hammer Mill', tph: '14 tph', mcIn: '47.5%', mcOut: '47.5%', elev: '6m', kw: '110 kW', cost: '$35,000', supplier: 'Cakrawala Mesin Multindo' },
  { code: 'VS-01', name: 'Vibrating Screen 2mm', tph: '13 tph', mcIn: '47.5%', mcOut: '47.5%', elev: '6m', kw: '11 kW', cost: '$12,000', supplier: 'CV Has Engineering' },
  { code: 'DC-01', name: 'Baghouse (Shared)', tph: '13 tph', mcIn: '47.5%', mcOut: '47.5%', elev: '6m', kw: '18 kW', cost: '—', supplier: '—' },
  { code: 'BIN-EFB-01', name: 'Buffer Bin 50m³', tph: '13 tph', mcIn: '47.5%', mcOut: '47.5%', elev: '6m', kw: '0 kW', cost: '$25,000', supplier: 'PT BSB' },
];

// ── FLOOR PLAN NODES ──
const NODES = [
  { code: 'RCV-EFB-01', name: 'Efb Receiving Hopper', type: 'Steel hopper with hydraulic gate', spec: '50 m³ · ~20 t capacity · Carbon steel + epoxy · 60° sidewalls', motor: '—', footer: 'To CVB-EFB-01 drag chain conveyor' },
  { code: 'CVB-EFB-01', name: 'Efb Drag Chain Conveyor', type: 'Heavy-duty drag chain', spec: '12m × 600mm · 100mm pitch chain', motor: '7.5 kW · VFD', footer: 'Elevates +2.5m to ESD-01 shredder feed' },
  { code: 'ESD-01', name: 'Efb Primary Shredder', type: 'Twin-shaft low-speed shredder', spec: '20 t/h @ 62.5% MC · 30–40 blades/shaft · 100–150mm output', motor: '2×37 kW (74 kW) · VFD', footer: 'Shredded EFB drops to CVB-EFB-02' },
  { code: 'CVB-EFB-02', name: 'Shredder Discharge Conveyor', type: 'Belt conveyor with cleated belt', spec: '8m × 600mm · 15° incline', motor: '3.7 kW', footer: 'Feeds ETR-EFB-01 trommel screen' },
  { code: 'ETR-EFB-01', name: 'Efb Trommel Screen', type: 'Rotary trommel screen', spec: 'Ø1500mm × 4000mm · 50mm perforations · 20 t/h', motor: '5.5 kW geared', footer: 'Oversize → shredder · undersize → press' },
  { code: 'ESP-EFB-01', name: 'Efb Screw Press', type: 'Single-screw dewatering press', spec: '20 t/h · 62.5% → 55% MC · 3–5 bar · Wedge wire 0.5mm', motor: '15 kW · VFD', footer: 'Pressed EFB to hammer mill' },
  { code: 'EHM-EFB-01', name: 'Efb Hammer Mill', type: 'Hammer mill with 2mm screen', spec: '13 t/h (55% MC) · 24 swing hammers · 1500 RPM', motor: '110 kW direct', footer: 'Noise zone — 85+ dBA · PPE required' },
  { code: 'EVS-EFB-01', name: 'Efb Vibrating Screen', type: 'Single-deck vibrating screen', spec: '13 t/h · 2mm mesh · Oversize return to HM', motor: '2.2 kW vibratory', footer: 'Oversize return loop to EHM-EFB-01' },
  { code: 'EDC-EFB-01', name: 'Efb Baghouse Dust Collector', type: 'Pulse-jet baghouse', spec: '5000 m³/h · 50 m² filter · <50 mg/Nm³ · Polyester', motor: '7.5 kW fan', footer: 'Serves hammer mill + vibrating screen zone' },
  { code: 'BIN-EFB-201', name: 'Efb Buffer Storage Bin', type: 'Steel buffer bin with live-bottom', spec: '80 m³ · ~32 t @ 55% MC · Anti-bridging · 8hr buffer', motor: '2×3.7 kW', footer: 'Feeds S2 Chemical Treatment at controlled rate' },
];

// ── CAPEX ──
const EFB_EQUIP = [
  { code: 'TR-EFB-101', name: 'EFB Truck Receiving Bay', cost: '$8,000' },
  { code: 'RH-EFB-101', name: 'EFB Hydraulic Reciprocating Feeder', cost: '$15,000' },
  { code: 'CV-EFB-101', name: 'EFB Apron Conveyor to Shredder', cost: '$18,000' },
  { code: 'SH-EFB-101', name: 'EFB Primary Shredder', cost: '$45,000' },
  { code: 'CV-EFB-102', name: 'Shredder Discharge Conveyor', cost: '$8,000' },
  { code: 'ML-EFB-101', name: 'EFB Hammer Mill (2mm)', cost: '$35,000' },
  { code: 'SC-EFB-101', name: 'EFB Vibrating Screen', cost: '$12,000' },
  { code: 'CV-EFB-103', name: 'Screen Undersize Conveyor', cost: '$10,000' },
  { code: 'CV-EFB-104', name: 'Screen Oversize Return', cost: '$8,000' },
  { code: 'BIN-EFB-201', name: 'EFB Buffer Storage Bin', cost: '$25,000' },
];

// ── EXPANDABLE FLOOR NODES (for NodeCard) ──
const FLOOR_NODES = [
  {
    id: 1, tag: 'RCV-EFB-01', name: 'EFB Receiving Hopper',
    imgLabel: 'Hydraulic Recip. Feeder', imgSub: 'Truck tipping bay',
    svg: '<svg width="108" height="108" viewBox="0 0 86 86"><polygon points="8,16 78,16 68,40 18,40" fill="#1a2a3d" stroke="#40D7C5" stroke-width="1.5"/><polygon points="30,40 56,40 49,30" fill="#40D7C5" opacity=".35"/><rect x="16" y="40" width="54" height="12" fill="#40D7C5" stroke="#40D7C5" stroke-width="1"/><rect x="62" y="34" width="16" height="20" fill="#1a2a3d" stroke="#40D7C5" stroke-width="1"/><line x1="62" y1="46" x2="82" y2="46" stroke="#40D7C5" stroke-width="1.5"/><line x1="4" y1="58" x2="82" y2="58" stroke="#40D7C5" stroke-width="1.5"/><text x="43" y="74" font-family="DM Mono" font-size="8" fill="#A8BDD0" text-anchor="middle">7.5kW · VFD · 20 t/h</text></svg>',
    classA: false, noise: false, dwell: false,
    specs: [
      ['Location', 'Ground ±0.0m', 'Power', '7.5 kW'],
      ['Capacity', '50 m³ · ~20 t', 'Material', 'Carbon steel + epoxy'],
      ['Sidewalls', '60° sloped', 'Drive', 'VFD controlled'],
      ['Inputs', 'EFB from truck bay', 'Moisture in', '62.5%'],
    ],
    note: 'Anti-bridging cone + pusher plate · 3-axle or 4-axle trucks',
    warning: null,
    gate: null,
    conn: 'CV-EFB-101 · incline apron conveyor · 15m · 15–20° · ±0.0 → +3.0m',
  },
  {
    id: 2, tag: 'CVB-EFB-01', name: 'EFB Drag Chain / Apron Conveyor',
    imgLabel: 'Incline Apron Conveyor', imgSub: '±0.0 → +3.0m rise',
    svg: '<svg width="108" height="108" viewBox="0 0 86 86"><rect x="6" y="52" width="74" height="10" fill="#1a2a3d" stroke="#40D7C5" stroke-width="1.3" rx="2" transform="rotate(-18,43,57)"/><circle cx="12" cy="62" r="7" fill="#1a2a3d" stroke="#40D7C5" stroke-width="1.3"/><circle cx="74" cy="24" r="7" fill="#1a2a3d" stroke="#40D7C5" stroke-width="1.3"/><line x1="12" y1="55" x2="74" y2="17" stroke="#40D7C5" stroke-width="1"/><line x1="12" y1="69" x2="74" y2="31" stroke="#40D7C5" stroke-width="1"/><text x="43" y="78" font-family="DM Mono" font-size="8" fill="#A8BDD0" text-anchor="middle">15m · 15–20° · 600mm</text></svg>',
    classA: false, noise: false, dwell: false,
    specs: [
      ['Location', '±0.0 → +3.0m', 'Power', '7.5 kW'],
      ['Length', '15 m', 'Inclination', '15–20°'],
      ['Belt width', '600 mm', 'Capacity', '20 t/h'],
      ['Chain', '100mm pitch', 'Drive', 'VFD controlled'],
    ],
    note: null,
    warning: null,
    gate: null,
    conn: 'EB-02 · 8m level belt · 3.0kW → trommel screen',
  },
  {
    id: 3, tag: 'ESD-01', name: 'EFB Primary Shredder',
    imgLabel: 'Primary Shredder', imgSub: '+4.0m · 50–100mm output',
    svg: '<svg width="108" height="108" viewBox="0 0 86 86"><rect x="10" y="18" width="66" height="42" fill="#1a2a3d" stroke="#40D7C5" stroke-width="1.5" rx="2"/><circle cx="43" cy="39" r="16" fill="rgba(64,215,197,.1)" stroke="#40D7C5" stroke-width="1.2"/><rect x="27" y="33" width="12" height="5" fill="#A8BDD0" rx="1" transform="rotate(30,33,35)"/><rect x="45" y="33" width="12" height="5" fill="#A8BDD0" rx="1" transform="rotate(-30,51,35)"/><rect x="27" y="40" width="12" height="5" fill="#A8BDD0" rx="1" transform="rotate(-30,33,42)"/><rect x="45" y="40" width="12" height="5" fill="#A8BDD0" rx="1" transform="rotate(30,51,42)"/><rect x="16" y="60" width="8" height="12" fill="#2a4a5a" rx="1"/><rect x="62" y="60" width="8" height="12" fill="#2a4a5a" rx="1"/><text x="43" y="78" font-family="DM Mono" font-size="8" fill="#A8BDD0" text-anchor="middle">2×37kW · M30×8</text></svg>',
    classA: false, noise: false, dwell: false,
    specs: [
      ['Location', '+4.0m platform', 'Power', '2×37 kW (74 kW)'],
      ['Capacity', '20 t/h', 'Foundation', 'M30×8 · 800mm emb.'],
      ['Output size', '50–100 mm', 'Blades', '30–40 per shaft'],
      ['Moisture in', '45–50%', 'Drive', 'VFD controlled'],
    ],
    note: null,
    warning: 'Noise zone — hearing protection required within 10m radius',
    gate: null,
    conn: 'CVB-EFB-02 · shredder discharge conveyor · 8m · 15° incline',
  },
  {
    id: 4, tag: 'CVB-EFB-02', name: 'Shredder Discharge Conveyor',
    imgLabel: 'Discharge Conveyor', imgSub: '8m · 15° cleated belt',
    svg: '<svg width="108" height="108" viewBox="0 0 86 86"><rect x="6" y="52" width="74" height="10" fill="#1a2a3d" stroke="#40D7C5" stroke-width="1.3" rx="2" transform="rotate(-12,43,57)"/><circle cx="12" cy="60" r="7" fill="#1a2a3d" stroke="#40D7C5" stroke-width="1.3"/><circle cx="74" cy="30" r="7" fill="#1a2a3d" stroke="#40D7C5" stroke-width="1.3"/><line x1="12" y1="53" x2="74" y2="23" stroke="#40D7C5" stroke-width="1"/><line x1="12" y1="67" x2="74" y2="37" stroke="#40D7C5" stroke-width="1"/><rect x="30" y="42" width="6" height="4" fill="#40D7C5" opacity=".5" rx="1" transform="rotate(-12,33,44)"/><rect x="46" y="38" width="6" height="4" fill="#40D7C5" opacity=".5" rx="1" transform="rotate(-12,49,40)"/><rect x="62" y="34" width="6" height="4" fill="#40D7C5" opacity=".5" rx="1" transform="rotate(-12,65,36)"/><text x="43" y="78" font-family="DM Mono" font-size="8" fill="#A8BDD0" text-anchor="middle">8m · 600mm · 3.7kW</text></svg>',
    classA: false, noise: false, dwell: false,
    specs: [
      ['Location', '+4.0 → +3.0m', 'Power', '3.7 kW'],
      ['Length', '8 m', 'Incline', '15°'],
      ['Belt width', '600 mm', 'Type', 'Cleated belt'],
    ],
    note: null,
    warning: null,
    gate: null,
    conn: 'ETR-EFB-01 · trommel screen feed',
  },
  {
    id: 5, tag: 'ETR-EFB-01', name: 'EFB Trommel Screen',
    imgLabel: 'Trommel Screen', imgSub: 'Rubber isolators ×4',
    svg: '<svg width="108" height="108" viewBox="0 0 86 86"><ellipse cx="15" cy="43" rx="9" ry="22" fill="#1a2a3d" stroke="#40D7C5" stroke-width="1.3"/><rect x="15" y="21" width="56" height="44" fill="#1a2a3d" stroke="#40D7C5" stroke-width="1.3"/><ellipse cx="71" cy="43" rx="9" ry="22" fill="rgba(64,215,197,.12)" stroke="#40D7C5" stroke-width="1.3"/><circle cx="29" cy="31" r="2.3" fill="none" stroke="#40D7C5" stroke-width=".9"/><circle cx="43" cy="31" r="2.3" fill="none" stroke="#40D7C5" stroke-width=".9"/><circle cx="57" cy="31" r="2.3" fill="none" stroke="#40D7C5" stroke-width=".9"/><circle cx="29" cy="43" r="2.3" fill="none" stroke="#40D7C5" stroke-width=".9"/><circle cx="43" cy="43" r="2.3" fill="none" stroke="#40D7C5" stroke-width=".9"/><circle cx="57" cy="43" r="2.3" fill="none" stroke="#40D7C5" stroke-width=".9"/><circle cx="29" cy="55" r="2.3" fill="none" stroke="#40D7C5" stroke-width=".9"/><circle cx="43" cy="55" r="2.3" fill="none" stroke="#40D7C5" stroke-width=".9"/><circle cx="57" cy="55" r="2.3" fill="none" stroke="#40D7C5" stroke-width=".9"/><rect x="24" y="65" width="10" height="7" fill="#2a4a5a" rx="2"/><rect x="58" y="65" width="10" height="7" fill="#2a4a5a" rx="2"/></svg>',
    classA: false, noise: false, dwell: false,
    specs: [
      ['Location', '+3.0m platform', 'Power', '11 kW'],
      ['Capacity', '20 t/h', 'Pad size', '8m × 3m × 0.4m'],
      ['Aperture', '50 mm perforations', 'Moisture in', '62.5%'],
      ['Isolation', 'Rubber isolators ×4', 'Function', 'Stone + tramp removal'],
    ],
    note: 'Oversize → return to shredder · Undersize → screw press',
    warning: null,
    gate: null,
    conn: 'EB-03 · 8m level belt · 3.0kW → screw press',
  },
  {
    id: 6, tag: 'ESP-EFB-01', name: 'EFB Screw Press',
    imgLabel: 'Screw Press', imgSub: 'Gate B.G2 — MC ≤ 50%',
    svg: '<svg width="108" height="108" viewBox="0 0 86 86"><rect x="8" y="28" width="60" height="24" fill="#2a2000" stroke="#F5A623" stroke-width="1.5" rx="2"/><path d="M12 40 Q18 32 24 40 Q30 48 36 40 Q42 32 48 40 Q54 48 60 40 Q66 32 68 40" stroke="#F5A623" stroke-width="1.5" fill="none"/><rect x="64" y="33" width="12" height="14" fill="#3a3000" stroke="#F5A623" stroke-width="1"/><line x1="30" y1="52" x2="30" y2="62" stroke="#40D7C5" stroke-width="1" stroke-dasharray="3,2"/><text x="36" y="60" font-family="DM Mono" font-size="7" fill="#40D7C5">→ pond</text><rect x="14" y="52" width="8" height="10" fill="#2a4a5a" rx="1"/><rect x="54" y="52" width="8" height="10" fill="#2a4a5a" rx="1"/><text x="43" y="78" font-family="DM Mono" font-size="8" fill="#F5A623" text-anchor="middle">37kW · M24×8</text></svg>',
    classA: false, noise: false, dwell: false,
    specs: [
      ['Location', '+3.2m platform', 'Power', '37 kW'],
      ['Capacity', '20 t/h in', 'Foundation', 'M24×8 · 600mm emb.'],
      ['Moisture in', '70%', 'Moisture out', '45–50%'],
      ['Screen', 'Wedge wire 0.5mm', 'Drive', 'VFD controlled'],
    ],
    note: 'Press water → POME pond only · never to substrate',
    warning: 'GATE B.G2 — operator confirms MC ≤ 50% before proceeding. Non-negotiable. Pore damage above threshold kills BSF colonisation.',
    gate: { label: 'GATE B.G2', bg: 'rgba(245,166,35,.1)', color: '#F5A623' },
    conn: 'EB-05 · 10m level belt · 3.0kW → primary shredder',
  },
  {
    id: 7, tag: 'EHM-EFB-01', name: 'EFB Hammer Mill',
    imgLabel: 'Hammer Mill', imgSub: 'Gate B.G1 — D90 ≤ 2mm',
    svg: '<svg width="108" height="108" viewBox="0 0 86 86"><rect x="10" y="16" width="66" height="44" fill="#2a1010" stroke="#cc2222" stroke-width="1.5" rx="2"/><circle cx="43" cy="38" r="16" fill="#3a1818" stroke="#cc2222" stroke-width="1.2"/><rect x="27" y="32" width="12" height="5" fill="#8b0000" rx="1"/><rect x="48" y="32" width="12" height="5" fill="#8b0000" rx="1"/><rect x="27" y="39" width="12" height="5" fill="#8b0000" rx="1"/><rect x="48" y="39" width="12" height="5" fill="#8b0000" rx="1"/><path d="M16 60 Q18 65 16 70 Q14 75 16 80" stroke="#A8BDD0" stroke-width="1.5" fill="none"/><path d="M43 60 Q45 65 43 70 Q41 75 43 80" stroke="#A8BDD0" stroke-width="1.5" fill="none"/><path d="M70 60 Q72 65 70 70 Q68 75 70 80" stroke="#A8BDD0" stroke-width="1.5" fill="none"/><line x1="68" y1="22" x2="78" y2="14" stroke="#A8BDD0" stroke-width="1.5"/><text x="43" y="12" font-family="DM Mono" font-size="7" fill="#cc2222" text-anchor="middle" font-weight="700">SPRING ISO ONLY</text></svg>',
    classA: false, noise: true, dwell: false,
    specs: [
      ['Location', '+4.0m platform', 'Power', '37 kW'],
      ['Capacity', '15 t/h derated', 'Pad size', '3m × 2.5m × 0.6m'],
      ['Target output', 'D90 ≤ 2mm', 'Exhaust to', 'EDC-01 baghouse'],
      ['Hammers', '24 swing hammers', 'Speed', '1500 RPM'],
    ],
    note: 'EB-07 oversize return loop',
    warning: 'Noise zone — 85+ dBA · PPE required · Spring isolation mounting ONLY · Never rigid-anchor to slab',
    gate: null,
    conn: 'EB-08 · pass → vibrating screen · EB-07 oversize return → EHM-EFB-01',
  },
  {
    id: 8, tag: 'EVS-EFB-01', name: 'EFB Vibrating Screen',
    imgLabel: 'Vibrating Screen', imgSub: 'Flexible mount only',
    svg: '<svg width="108" height="108" viewBox="0 0 86 86"><rect x="6" y="22" width="74" height="30" fill="#1a2a3d" stroke="#40D7C5" stroke-width="1.5" rx="2" transform="rotate(-4,43,37)"/><line x1="10" y1="28" x2="80" y2="23" stroke="#40D7C5" stroke-width=".8" opacity=".6"/><line x1="10" y1="35" x2="80" y2="30" stroke="#40D7C5" stroke-width=".8" opacity=".6"/><line x1="10" y1="42" x2="80" y2="37" stroke="#40D7C5" stroke-width=".8" opacity=".6"/><path d="M14 52 Q16 57 14 62 Q12 67 14 72" stroke="#A8BDD0" stroke-width="1.5" fill="none"/><path d="M72 50 Q74 55 72 60 Q70 65 72 70" stroke="#A8BDD0" stroke-width="1.5" fill="none"/><text x="43" y="12" font-family="DM Mono" font-size="8" fill="#40D7C5" text-anchor="middle">FLEX MOUNT</text><text x="43" y="78" font-family="DM Mono" font-size="8" fill="#A8BDD0" text-anchor="middle">7.5kW · 2mm aperture</text></svg>',
    classA: false, noise: false, dwell: false,
    specs: [
      ['Location', '+4.0m platform', 'Power', '7.5 kW'],
      ['Size', '2m × 2m × 0.3m', 'Capacity', '15 t/h'],
      ['Aperture', '2 mm', 'Moisture in', '45–50%'],
    ],
    note: 'Pass ≤ 2mm → buffer bin · Reject > 2mm → return to EHM-EFB-01',
    warning: 'Flexible mount only — no rigid anchor permitted',
    gate: null,
    conn: 'EB-08 · 8m · -5° · 2.2kW → buffer bin',
  },
  {
    id: 9, tag: 'EDC-EFB-01', name: 'EFB Baghouse Dust Collector',
    imgLabel: 'Baghouse Filter', imgSub: 'External east wall',
    svg: '<svg width="108" height="108" viewBox="0 0 86 86"><rect x="22" y="12" width="42" height="52" fill="#1a2a3d" stroke="#40D7C5" stroke-width="1.3" rx="2"/><rect x="26" y="16" width="10" height="40" fill="rgba(64,215,197,.08)" stroke="#40D7C5" stroke-width=".8" rx="1"/><rect x="38" y="16" width="10" height="40" fill="rgba(64,215,197,.08)" stroke="#40D7C5" stroke-width=".8" rx="1"/><rect x="50" y="16" width="10" height="40" fill="rgba(64,215,197,.08)" stroke="#40D7C5" stroke-width=".8" rx="1"/><line x1="43" y1="64" x2="43" y2="74" stroke="#40D7C5" stroke-width="2"/><polygon points="43,4 38,14 48,14" fill="#A8BDD0"/><text x="43" y="80" font-family="DM Mono" font-size="8" fill="#A8BDD0" text-anchor="middle">15kW · 3,000 m³/hr</text></svg>',
    classA: false, noise: false, dwell: false,
    specs: [
      ['Location', 'Outside east wall', 'Power', '15 kW'],
      ['Airflow', '3,000 m³/hr', 'Efficiency', '99% dust capture'],
      ['Inputs', 'Hammer mill exhaust', 'Material', 'Carbon steel housing'],
      ['Filter area', '50 m²', 'Emission', '<50 mg/Nm³'],
    ],
    note: 'Exhaust duct from EHM-EFB-01 · serves hammer mill + vibrating screen zone',
    warning: null,
    gate: null,
    conn: null,
  },
  {
    id: 10, tag: 'BIN-EFB-201', name: 'EFB Buffer Storage Bin',
    imgLabel: 'Buffer Bin — EFB', imgSub: '+2.5m · 4–6hr buffer',
    svg: '<svg width="108" height="108" viewBox="0 0 86 86"><rect x="18" y="8" width="50" height="50" fill="#1a2a3d" stroke="#40D7C5" stroke-width="1.3" rx="1"/><polygon points="18,58 68,58 58,74 28,74" fill="rgba(64,215,197,.12)" stroke="#40D7C5" stroke-width="1.3"/><rect x="20" y="24" width="46" height="34" fill="rgba(64,215,197,.06)"/><line x1="43" y1="8" x2="43" y2="56" stroke="#40D7C5" stroke-width="1.1" opacity=".4"/><line x1="30" y1="44" x2="56" y2="50" stroke="#40D7C5" stroke-width="1.1" opacity=".4"/><line x1="30" y1="50" x2="56" y2="44" stroke="#40D7C5" stroke-width="1.1" opacity=".4"/><text x="43" y="82" font-family="DM Mono" font-size="8" fill="#A8BDD0" text-anchor="middle">50 m³ · live-bottom</text></svg>',
    classA: false, noise: false, dwell: false,
    specs: [
      ['Location', '+2.5m platform', 'Power', '3 kW'],
      ['Volume', '50 m³', 'Discharge', 'Live-bottom auger'],
      ['Buffer capacity', '4–6 hrs at 20 t/h', 'Moisture out', '45–50%'],
      ['Inputs', 'Milled EFB ≤ 2mm', 'Anti-bridging', 'Pneumatic vibrators'],
    ],
    note: 'Feeds S2 Chemical Treatment at controlled rate',
    warning: null,
    gate: null,
    conn: 'BC-10 · 10m → conveyor gallery (25m × 4m covered) → S2 greenhouse intake',
  },
];

// ── BUILDING ──
const BUILDING = { name: 'Building A5 — EFB Processing Hall', width: '30m', length: '60m', height: '12m', area: '1,800 m²' };

// ── CONVEYORS ──
const CONVEYORS = [
  { code: 'CVB-EFB-01', type: 'Drag chain', length: '12m', power: '7.5 kW', route: 'Hopper → Shredder feed' },
  { code: 'CVB-EFB-02', type: 'Cleated belt 600mm', length: '8m', power: '3.7 kW', route: 'Shredder → Trommel' },
  { code: 'CVB-EFB-03', type: 'Belt 600mm', length: '6m', power: '2.2 kW', route: 'Trommel → Screw Press' },
  { code: 'CVB-EFB-04', type: 'Belt 600mm', length: '5m', power: '2.2 kW', route: 'Press → Hammer Mill' },
  { code: 'CVB-EFB-05', type: 'Screw conveyor', length: '4m', power: '1.5 kW', route: 'Screen → Buffer Bin' },
  { code: 'CVB-EFB-06', type: 'Screw discharge', length: '3m', power: '3.7 kW', route: 'Buffer Bin → S2 Mixer' },
];

export default function S1Efb() {
  return (
    <>
      <style>{S1_CSS}</style>
      <S0Header activeStage={1} />
      <LineHero
        name="S1C — EFB Pre-Processing Line"
        throughput="20 t/h · 600mm Belt"
        power="298 kW Total"
        nodes="10"
        accent={ACCENT}
        badges={[{ text: 'GATE B.G2 · MC ≤ 50%', cls: 'bdg-a' }]}
      />
      <TickerBar items={[
        { label: 'Daily In', val: '~300 t', color: C.amber },
        { label: 'Daily Out', val: '~195 t', color: C.teal },
        { label: 'MC In', val: '62.5%', color: C.amber },
        { label: 'MC Out', val: '45–50%', color: C.teal },
        { label: 'Belt', val: '600mm' },
        { label: 'Power', val: '298 kW' },
        { label: 'Elec/mo', val: '$14,191', color: C.amber },
      ]} />
      <S1Breadcrumb activeLine="EFB Line" />

      <div style={{ marginTop: 10 }}>
        <SubstrateFlowStrip
          stageLabel="Substrate Flow — S0 Raw EFB → S1 Milled Fibre"
          inflows={INFLOWS}
          outflows={OUTFLOWS}
        />
      </div>

      <div className="content">
        {/* SECTION 1: ASCII PROCESS FLOW */}
        <CollapsibleSection title="ASCII Process Flow — EFB Line" number="1" accent={ACCENT} defaultOpen={true}>
          <div style={{ fontFamily: Fnt.dm, fontSize: 10, color: C.grey, marginBottom: 10 }}>
            S1C EFB LINE PROCESS FLOW · 60 TPH FFB Mill · 20 t/h · 600mm belt · Bogor, West Java · March 2026
          </div>
          <div style={{ fontFamily: Fnt.dm, fontSize: 11, color: C.teal, marginBottom: 6 }}>
            Source: 8,262 t FW/month · 62.5% MC · 22% lignin DM · C:N 60 · 4.75% CP
          </div>
          <Pre accent={ACCENT}>{`
  ┌─────────────────────────────────────────────────────────────────────────────────────────────────────────┐
  │  S1C  EFB  PRE-PROCESSING  LINE  ·  10 MACHINES  ·  298 kW  ·  20 t/h  ·  600mm BELT               │
  │  Elevation: ±0.0m → +4.0m → +2.5m                                                                    │
  └─────────────────────────────────────────────────────────────────────────────────────────────────────────┘

  ┌─────────────┐    ┌──────────────────┐    ┌─────────────────┐    ┌──────────────────┐
  │ RH-EFB-101  │───▶│  CV-EFB-101      │───▶│  ETR-01         │───▶│  OBM-01          │
  │ Hydraulic   │    │  Incline Apron   │    │  Trommel Screen │    │  Overband Magnet │
  │ Recip Feeder│    │  Conveyor        │    │  50mm aperture  │    │  Ferrous removal │
  │ ±0.0m       │    │  ±0.0 → +3.0m   │    │  +3.0m          │    │  +3.5m suspended │
  │ 7.5 kW      │    │  7.5 kW · 600mm │    │  11 kW          │    │  3 kW            │
  └─────────────┘    └──────────────────┘    └─────────────────┘    └──────────────────┘
                                                                              │
                                                                              ▼
  ┌─────────────┐    ┌──────────────────┐    ┌─────────────────┐    ┌──────────────────────────────┐
  │ BIN-EFB-201 │◀───│  EVS-01          │◀───│  EHM-01         │◀───│  EPR-01                      │
  │ Buffer Bin  │    │  Vibrating Screen│    │  Hammer Mill    │    │  Screw Press                 │
  │ 50 m³       │    │  2mm aperture    │    │  D90 ≤ 2mm      │    │  +3.2m                       │
  │ +2.5m       │    │  +4.0m           │    │  +4.0m          │    │  37 kW                       │
  │ 3 kW auger  │    │  7.5 kW          │    │  37 kW          │    │  `}<span className="gate-amber">⚠ [GATE B.G2]</span>{`              │
  │             │    │  Oversize→HM     │    │  SPRING ISO ONLY│    │  `}<span className="gate-amber">MC ≤ 50% before shredder</span>{`  │
  └─────────────┘    └──────────────────┘    └─────────────────┘    └──────────────────────────────┘
        │
        ▼
  ┌──────────────────────────────────────────┐
  │  EDC-01  Baghouse Dust Filter            │
  │  Outside east wall · 15 kW · 3000 m³/hr │
  │  99% capture · Carbon steel              │
  └──────────────────────────────────────────┘

  ─── S2 DISCHARGE HANDOFF STATE ───
  `}<span className="gate-teal">45–50% MC · D90 ≤ 2mm · 20 t/h · 600mm belt</span>{`
  `}<span className="gate-green">Daily NPK @ 60 TPH:  N 582 kg · P 197 kg · K 930 kg  (3 streams)</span>
          </Pre>
        </CollapsibleSection>

        {/* SECTION 2: EQUIPMENT REGISTER */}
        <CollapsibleSection title="Equipment Register — 10 Nodes" number="2" accent={ACCENT} defaultOpen={false}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ background: 'rgba(0,0,0,.3)' }}>
                  {['Code','Equipment','Throughput','MC In→Out','Elev','Power','Cost','Supplier'].map(h => (
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
              <div style={{ fontFamily: Fnt.mono, fontSize: 16, fontWeight: 700, color: C.teal }}>298 kW</div>
            </div>
            <div style={{ background: 'rgba(0,0,0,.2)', border: `1px solid ${C.bdrIdle}`, borderRadius: 6, padding: '10px 16px' }}>
              <div style={{ fontFamily: Fnt.dm, fontSize: 10, fontWeight: 700, color: C.grey, textTransform: 'uppercase' }}>Total CapEx</div>
              <div style={{ fontFamily: Fnt.mono, fontSize: 16, fontWeight: 700, color: C.amber }}>$184,000</div>
            </div>
            <div style={{ background: 'rgba(0,0,0,.2)', border: `1px solid ${C.bdrIdle}`, borderRadius: 6, padding: '10px 16px' }}>
              <div style={{ fontFamily: Fnt.dm, fontSize: 10, fontWeight: 700, color: C.grey, textTransform: 'uppercase' }}>Monthly Elec</div>
              <div style={{ fontFamily: Fnt.mono, fontSize: 16, fontWeight: 700, color: C.amber }}>$14,191/mo</div>
            </div>
            <div style={{ background: 'rgba(0,0,0,.2)', border: `1px solid ${C.bdrIdle}`, borderRadius: 6, padding: '10px 16px' }}>
              <div style={{ fontFamily: Fnt.dm, fontSize: 10, fontWeight: 700, color: C.grey, textTransform: 'uppercase' }}>Monthly kWh</div>
              <div style={{ fontFamily: Fnt.mono, fontSize: 16, fontWeight: 700, color: C.white }}>155,199</div>
            </div>
          </div>
        </CollapsibleSection>

        {/* SECTION 3: FLOOR PLAN & DIMENSIONS */}
        <CollapsibleSection title="Floor Plan & Equipment Layout" number="3" accent={ACCENT} defaultOpen={false}>
          <div style={{ background: C.navy, border: `1.5px solid ${C.bdrIdle}`, borderRadius: 8, padding: '20px', marginBottom: 16, textAlign: 'center' }}>
            <div style={{ fontFamily: Fnt.syne, fontSize: 14, fontWeight: 700, color: ACCENT, marginBottom: 8 }}>Building A5 — Efb Processing Hall</div>
            <div style={{ fontFamily: Fnt.mono, fontSize: 13, color: C.amber }}>30m × 60m × 12m H = 1,800 m²</div>
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
                  ['Throughput', '20 t/h @ 62.5% MC', '13 t/h @ 55% MC'],
                  ['Source', 'Mill EFB press discharge', 'Milled fibre to S2'],
                  ['Daily Input', '~300 t fresh', '~195 t milled'],
                  ['Installed Power', '~298 kW total', '—'],
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
        <CollapsibleSection title="Equipment CAPEX — EFB Line" number="4" accent={ACCENT} defaultOpen={false}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(0,0,0,.3)' }}>
                <th style={{ padding: '8px 12px', textAlign: 'left', fontFamily: Fnt.mono, fontSize: 10, fontWeight: 700, color: C.grey, textTransform: 'uppercase' }}>Code</th>
                <th style={{ padding: '8px 12px', textAlign: 'left', fontFamily: Fnt.mono, fontSize: 10, fontWeight: 700, color: C.grey, textTransform: 'uppercase' }}>Equipment</th>
                <th style={{ padding: '8px 12px', textAlign: 'right', fontFamily: Fnt.mono, fontSize: 10, fontWeight: 700, color: C.grey, textTransform: 'uppercase' }}>Cost</th>
              </tr>
            </thead>
            <tbody>
              {EFB_EQUIP.map((eq, i) => (
                <tr key={i} style={{ borderBottom: `1px solid rgba(30,107,140,.15)` }}>
                  <td style={{ padding: '8px 12px', fontFamily: Fnt.mono, fontSize: 11, fontWeight: 700, color: ACCENT }}>{eq.code}</td>
                  <td style={{ padding: '8px 12px', fontFamily: Fnt.dm, fontSize: 11, color: C.white }}>{eq.name}</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', fontFamily: Fnt.mono, fontSize: 13, fontWeight: 700, color: C.amber }}>{eq.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: 12, padding: '12px 16px', background: 'rgba(64,215,197,.06)', border: `1px solid rgba(64,215,197,.25)`, borderRadius: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontFamily: Fnt.syne, fontSize: 13, fontWeight: 700, color: C.white }}>EFB Line Total</div>
            <div style={{ fontFamily: Fnt.mono, fontSize: 18, fontWeight: 700, color: C.amber }}>$184,000</div>
          </div>
          <div style={{ marginTop: 10, fontFamily: Fnt.dm, fontSize: 11, color: C.grey }}>
            Monthly electricity: $14,191/mo · 155,199 kWh · PLN I-3 tariff IDR 1,444.70/kWh
          </div>
        </CollapsibleSection>

        {/* SECTION 5: EXPANDABLE EQUIPMENT NODES */}
        <CollapsibleSection title="Expandable Equipment Nodes — 10 Machines" number="5" accent={ACCENT} defaultOpen={false}>
          <div style={{ fontFamily: Fnt.dm, fontSize: 11, color: C.grey, marginBottom: 12 }}>
            Click any node to expand full specs, motor data, and gate conditions.
          </div>
          {FLOOR_NODES.map((node) => (
            <NodeCard key={node.id} node={node} accent={ACCENT} />
          ))}
        </CollapsibleSection>

        {/* SECTION 6: BUILDING DIMENSIONS & CONVEYOR SYSTEM */}
        <CollapsibleSection title="Building Dimensions & Conveyor Routing" number="6" accent={ACCENT} defaultOpen={false}>
          <BuildingDiagram building={BUILDING} accent={ACCENT} />
          <div style={{ marginTop: 20 }}>
            <div style={{ fontFamily: Fnt.syne, fontSize: 13, fontWeight: 700, color: C.white, marginBottom: 10 }}>Conveyor System — 6 Segments</div>
            <ConveyorTable conveyors={CONVEYORS} accent={ACCENT} />
            <div style={{ marginTop: 12, fontFamily: Fnt.dm, fontSize: 11, color: C.grey }}>
              Total conveyor power: ~20.8 kW · All belt 600mm standard · Cleated on inclines &gt; 12°
            </div>
          </div>
        </CollapsibleSection>

        {/* SECTION 7: MIXING, PKSA NEUTRALISATION & S2 GREENHOUSE HANDOFF */}
        <CollapsibleSection title="Mixing, PKSA Neutralisation & S2 Greenhouse Handoff" number="7" accent={ACCENT} defaultOpen={false}>
          <div style={{ fontFamily: Fnt.dm, fontSize: 11, color: C.grey, marginBottom: 16, lineHeight: 1.7 }}>
            After mechanical pre-processing, the milled EFB fibre exits S1 and enters the S2 mixing and conditioning stage.
            Three residue streams converge into a single combined substrate for composting and BSF colonisation.
          </div>

          <Pre accent={ACCENT}>{`
  ┌─────────────────────────────────────────────────────────────────────────────────┐
  │  S1 → S2 MIXING & NEUTRALISATION FLOW                                         │
  └─────────────────────────────────────────────────────────────────────────────────┘

  BIN-EFB-201 ─────┐
  (Milled EFB       │    ┌──────────────────────┐    ┌──────────────────────┐
   45–50% MC        │───▶│  MIX-S2-01           │───▶│  PKSA-S2-01          │
   D90 ≤ 2mm)       │    │  S2 Substrate Mixer  │    │  PKSA Neutralisation │
                    │    │  Ribbon/paddle type   │    │  Tank                │
  BIN-OPDC-301 ────┤    │  SS304 · 5 m³ batch  │    │  CaO/MgO from PKS   │
  (Dried OPDC       │───▶│  15 kW · VFD         │    │  Ash dosing          │
   ≤35% MC          │    │  3-stream metering   │    │  pH 4.5 → 7.0–7.5   │
   D90 ≤ 3mm)       │    │                      │    │  Residence: 20 min   │
                    │    └──────────────────────┘    └──────────────────────┘
  FP-POS-01 ───────┘                                         │
  (POS conditioned        PKSA = Palm Kernel Shell Ash        │
   cake 65–70% MC         Natural calcium/magnesium source    ▼
   pH 5.5–6.0)
                                                ┌──────────────────────────────┐
                                                │  S2 COMPOSTING GREENHOUSE    │
                                                │  Covered windrow system      │
                                                │  28-day thermophilic cycle   │
                                                │  Target: 55–65°C core temp   │
                                                │  pH 7.0–7.5 · MC 55–60%     │
                                                │  C:N 25–30:1 (blended)       │
                                                │  Aeration: forced air floor  │
                                                └──────────────────────────────┘
          `}</Pre>

          <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}>
            {[
              { label: 'EFB Contribution', val: '~195 t/day', note: '45–50% MC · D90 ≤ 2mm · Carbon source (C:N 60)', color: C.teal },
              { label: 'OPDC Contribution', val: '~50 t/day', note: '≤35% MC · D90 ≤ 3mm · Nitrogen source (C:N 20)', color: C.amber },
              { label: 'POS Contribution', val: '~13.5 t/day', note: '65–70% MC · Conditioned cake · Mineral boost', color: '#3B82F6' },
              { label: 'PKSA Dose', val: '2–5% w/w', note: 'Palm Kernel Shell Ash · pH neutralisation · Ca + Mg', color: C.green },
              { label: 'Blended C:N', val: '25–30:1', note: 'Target for optimal thermophilic composting', color: C.teal },
              { label: 'Greenhouse Temp', val: '55–65°C', note: 'Core temp during 28-day composting cycle', color: C.amber },
            ].map((item, i) => (
              <div key={i} style={{ background: C.navyField, border: `1px solid ${C.bdrIdle}`, borderLeft: `3px solid ${item.color}`, borderRadius: 6, padding: '12px 14px' }}>
                <div style={{ fontFamily: Fnt.dm, fontSize: 10, fontWeight: 700, color: C.grey, textTransform: 'uppercase', marginBottom: 4 }}>{item.label}</div>
                <div style={{ fontFamily: Fnt.mono, fontSize: 16, fontWeight: 700, color: item.color, marginBottom: 4 }}>{item.val}</div>
                <div style={{ fontFamily: Fnt.dm, fontSize: 10, color: C.grey, lineHeight: 1.5 }}>{item.note}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 16, padding: '12px 16px', background: 'rgba(0,162,73,.06)', border: `1px solid rgba(0,162,73,.25)`, borderRadius: 6 }}>
            <div style={{ fontFamily: Fnt.syne, fontSize: 12, fontWeight: 700, color: C.green, marginBottom: 6 }}>S2 Greenhouse Transfer Protocol</div>
            <div style={{ fontFamily: Fnt.dm, fontSize: 11, color: C.grey, lineHeight: 1.7 }}>
              1. Blended substrate discharged from PKSA tank via screw conveyor to covered windrow bay<br/>
              2. Windrow formed: 2.5m wide × 1.5m high × variable length<br/>
              3. Forced-air aeration floor activates on temperature differential controller<br/>
              4. Day 0–7: Mesophilic phase (35–45°C) · Day 7–28: Thermophilic phase (55–65°C)<br/>
              5. Windrow turned every 5–7 days by mechanical turner<br/>
              6. pH monitored: target 7.0–7.5 post-PKSA neutralisation<br/>
              7. Compost maturity test at Day 28 → release to S3 Biological (BSF colonisation)
            </div>
          </div>
        </CollapsibleSection>

        {/* 1-PAGER LINK */}
        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
          <a
            href="/CFI_S1_EFB_Processing_Line_1Pager.html"
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
            📄 View EFB Processing Line 1-Pager
          </a>
        </div>
      </div>
    </>
  );
}
