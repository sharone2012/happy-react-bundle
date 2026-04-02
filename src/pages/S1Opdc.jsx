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
  {
    id: 1,
    tag: 'RH-OPDC-101',
    name: 'Reciprocating Feeder (anti-bridging)',
    imgLabel: 'Recip. Feeder (anti-bridging)',
    imgSub: 'Wet paste handling',
    svg: '<svg width="108" height="108" viewBox="0 0 86 100" xmlns="http://www.w3.org/2000/svg"><polygon points="6,16 80,16 70,42 16,42" fill="#1a2a3d" stroke="#40D7C5" stroke-width="1.5"/><polygon points="30,42 56,42 43,30" fill="#40D7C5" opacity=".35"/><rect x="14" y="42" width="58" height="12" fill="#40D7C5" stroke="#2a9d8f" stroke-width="1"/><rect x="64" y="35" width="16" height="20" fill="#1a2a3d" stroke="#40D7C5" stroke-width="1"/><text x="43" y="70" font-family="DM Sans" font-size="9" fill="#F5A623" text-anchor="middle">5.5kW · VFD · 5 t/h</text><text x="43" y="96" font-family="DM Sans" font-size="9" fill="#A8BDD0" text-anchor="middle">anti-bridging cone</text></svg>',
    classA: false,
    noise: false,
    dwell: false,
    specs: [
      ['Location', 'Ground ±0.0m', 'Power', '5.5 kW'],
      ['Capacity', '5 t/h', 'Drive', 'VFD controlled'],
      ['Inputs', 'OPDC decanter paste', 'Moisture in', '70–75%'],
      ['Material', 'Carbon steel', 'Manufacturer', 'TBC after RFQ'],
    ],
    note: 'Anti-bridging cone + pusher plate — paste blinds standard hoppers',
    conn: 'CV-OPDC-101 · incline feed conveyor · 10m · 15–20° · rises ±0.0 → +3.0m',
  },
  {
    id: 2,
    tag: 'CV-OPDC-101',
    name: 'Incline Feed Conveyor',
    imgLabel: 'Incline Feed Conveyor',
    imgSub: '±0.0 → +3.0m rise',
    svg: '<svg width="108" height="108" viewBox="0 0 86 100" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="52" width="74" height="10" fill="#1a2a3d" stroke="#40D7C5" stroke-width="1.3" rx="2" transform="rotate(-18,43,57)"/><circle cx="12" cy="62" r="7" fill="#1a2a3d" stroke="#40D7C5" stroke-width="1.3"/><circle cx="74" cy="24" r="7" fill="#1a2a3d" stroke="#40D7C5" stroke-width="1.3"/><line x1="12" y1="55" x2="74" y2="17" stroke="#40D7C5" stroke-width="1"/><line x1="12" y1="69" x2="74" y2="31" stroke="#40D7C5" stroke-width="1"/><text x="43" y="94" font-family="DM Sans" font-size="9" fill="#A8BDD0" text-anchor="middle">10m · 15–20° · 500mm</text></svg>',
    classA: false,
    noise: false,
    dwell: false,
    specs: [
      ['Location', '±0.0 → +3.0m', 'Power', '4.5 kW'],
      ['Length', '10 m', 'Inclination', '15–20°'],
      ['Belt width', '500 mm', 'Capacity', '5 t/h'],
      ['Inputs', 'OPDC paste', 'Manufacturer', 'TBC after RFQ'],
    ],
    conn: 'OB-02 · 8m level belt → trommel screen',
  },
  {
    id: 3,
    tag: 'OTR-01',
    name: 'Trommel Screen',
    imgLabel: 'Trommel Screen',
    imgSub: 'Rubber isolators ×4',
    svg: '<svg width="108" height="108" viewBox="0 0 86 100" xmlns="http://www.w3.org/2000/svg"><ellipse cx="15" cy="43" rx="9" ry="22" fill="#1a2a3d" stroke="#40D7C5" stroke-width="1.3"/><rect x="15" y="21" width="56" height="44" fill="#1a2a3d" stroke="#40D7C5" stroke-width="1.3"/><ellipse cx="71" cy="43" rx="9" ry="22" fill="#122234" stroke="#40D7C5" stroke-width="1.3"/><circle cx="29" cy="31" r="2.3" fill="none" stroke="#40D7C5" stroke-width=".9"/><circle cx="43" cy="31" r="2.3" fill="none" stroke="#40D7C5" stroke-width=".9"/><circle cx="57" cy="31" r="2.3" fill="none" stroke="#40D7C5" stroke-width=".9"/><circle cx="29" cy="43" r="2.3" fill="none" stroke="#40D7C5" stroke-width=".9"/><circle cx="43" cy="43" r="2.3" fill="none" stroke="#40D7C5" stroke-width=".9"/><circle cx="57" cy="43" r="2.3" fill="none" stroke="#40D7C5" stroke-width=".9"/><circle cx="29" cy="55" r="2.3" fill="none" stroke="#40D7C5" stroke-width=".9"/><circle cx="43" cy="55" r="2.3" fill="none" stroke="#40D7C5" stroke-width=".9"/><circle cx="57" cy="55" r="2.3" fill="none" stroke="#40D7C5" stroke-width=".9"/><rect x="24" y="65" width="10" height="7" fill="#A8BDD0" rx="2"/><rect x="58" y="65" width="10" height="7" fill="#A8BDD0" rx="2"/></svg>',
    classA: false,
    noise: false,
    dwell: false,
    specs: [
      ['Location', '+3.0m platform', 'Power', '11 kW'],
      ['Capacity', '5 t/h', 'Pad size', '8m × 3m × 0.4m'],
      ['Inputs', 'OPDC post-feeder', 'Moisture in', '70–75%'],
      ['Isolation', 'Rubber isolators ×4', 'Manufacturer', 'TBC after RFQ'],
    ],
    conn: 'OB-03 · 8m level belt → overband magnet',
  },
  {
    id: 4,
    tag: 'OBM-02',
    name: 'Overband Magnet',
    imgLabel: 'Overband Magnet',
    imgSub: '+3.5m · ferrous removal',
    svg: '<svg width="108" height="108" viewBox="0 0 86 100" xmlns="http://www.w3.org/2000/svg"><rect x="18" y="10" width="50" height="22" fill="#1a2a3d" stroke="#40D7C5" stroke-width="1.5" rx="3"/><text x="43" y="24" font-family="DM Sans" font-size="9" fill="#F5A623" text-anchor="middle" font-weight="700">MAGNET</text><path d="M26 32 Q20 46 26 60" stroke="#40D7C5" stroke-width="1.1" fill="none" stroke-dasharray="3,2"/><path d="M43 32 Q37 46 43 60" stroke="#40D7C5" stroke-width="1.1" fill="none" stroke-dasharray="3,2"/><path d="M60 32 Q54 46 60 60" stroke="#40D7C5" stroke-width="1.1" fill="none" stroke-dasharray="3,2"/><circle cx="33" cy="50" r="3" fill="#A8BDD0"/><line x1="24" y1="4" x2="24" y2="10" stroke="#A8BDD0" stroke-width="1.5"/><line x1="62" y1="4" x2="62" y2="10" stroke="#A8BDD0" stroke-width="1.5"/><rect x="6" y="66" width="74" height="10" fill="#122234" stroke="#A8BDD0" stroke-width="1" rx="2"/><text x="43" y="94" font-family="DM Sans" font-size="9" fill="#A8BDD0" text-anchor="middle">3kW · suspended</text></svg>',
    classA: false,
    noise: false,
    dwell: false,
    specs: [
      ['Location', '+3.5m · suspended', 'Power', '3 kW'],
      ['Size', '3m × 2m', 'Capacity', 'No t/h limit'],
      ['Inputs', 'OPDC post-trommel', 'Manufacturer', 'TBC after RFQ'],
    ],
    conn: 'OB-04 · 10m level belt → screw press',
  },
  {
    id: 5,
    tag: 'OPR-01',
    name: 'Screw Press',
    imgLabel: 'Screw Press — CLASS A',
    imgSub: 'Math.max(40, reading)',
    svg: '<svg width="108" height="108" viewBox="0 0 86 100" xmlns="http://www.w3.org/2000/svg"><rect x="8" y="28" width="60" height="24" fill="#1a2a3d" stroke="#A8BDD0" stroke-width="1.5" rx="2"/><path d="M12 40 Q18 32 24 40 Q30 48 36 40 Q42 32 48 40 Q54 48 60 40 Q66 32 68 40" stroke="#40D7C5" stroke-width="1.5" fill="none"/><rect x="64" y="33" width="12" height="14" fill="#122234" stroke="#40D7C5" stroke-width="1"/><line x1="30" y1="52" x2="30" y2="62" stroke="#A8BDD0" stroke-width="1" stroke-dasharray="3,2"/><rect x="4" y="10" width="34" height="12" fill="#E84040" rx="2"/><text x="21" y="19" font-family="DM Sans" font-size="9" fill="#fff" text-anchor="middle" font-weight="700">CLASS A</text><text x="43" y="94" font-family="DM Sans" font-size="9" fill="#E84040" text-anchor="middle">MC ≥ 40% LOCKED</text></svg>',
    classA: true,
    noise: false,
    dwell: false,
    specs: [
      ['Location', '+3.2m platform', 'Power', '37 kW'],
      ['Capacity', '5 t/h in', 'Foundation', 'M24×8 · 600mm emb.'],
      ['Moisture in', '70–75%', 'Moisture out', '60–62%'],
      ['Inputs', 'OPDC post-magnet', 'Manufacturer', 'TBC after RFQ'],
    ],
    note: 'Filtrate → POME pond only · never to substrate',
    warning: 'CLASS A gate — MC floor ≥ 40% locked · Math.max(40, reading) · non-negotiable',
    gate: { label: 'CLASS A', bg: 'rgba(232,64,64,.1)', color: '#E84040' },
    conn: 'OB-05 · 10m level belt → lump breaker',
  },
  {
    id: 6,
    tag: 'OSD-01',
    name: 'Lump Breaker / Finger-Screw',
    imgLabel: 'Lump Breaker',
    imgSub: 'Finger-screw for wet paste',
    svg: '<svg width="108" height="108" viewBox="0 0 86 100" xmlns="http://www.w3.org/2000/svg"><rect x="8" y="22" width="70" height="30" fill="#1a2a3d" stroke="#40D7C5" stroke-width="1.5" rx="2"/><line x1="22" y1="24" x2="22" y2="50" stroke="#40D7C5" stroke-width="2"/><line x1="32" y1="24" x2="32" y2="50" stroke="#40D7C5" stroke-width="2"/><line x1="42" y1="24" x2="42" y2="50" stroke="#40D7C5" stroke-width="2"/><line x1="52" y1="24" x2="52" y2="50" stroke="#40D7C5" stroke-width="2"/><line x1="62" y1="24" x2="62" y2="50" stroke="#40D7C5" stroke-width="2"/><ellipse cx="26" cy="37" rx="5" ry="4" fill="#A8BDD0" opacity=".6"/><ellipse cx="46" cy="32" rx="4" ry="3" fill="#A8BDD0" opacity=".6"/><rect x="14" y="52" width="8" height="10" fill="#A8BDD0" rx="1"/><rect x="64" y="52" width="8" height="10" fill="#A8BDD0" rx="1"/><text x="43" y="94" font-family="DM Sans" font-size="9" fill="#A8BDD0" text-anchor="middle">22kW · M30×8 · +4.0m</text></svg>',
    classA: false,
    noise: false,
    dwell: false,
    specs: [
      ['Location', '+4.0m platform', 'Power', '22 kW'],
      ['Capacity', '5 t/h', 'Foundation', 'M30×8 · 800mm emb.'],
      ['Output size', '10–30 mm crumbles', 'Moisture in', '60–62%'],
      ['Inputs', 'Pressed OPDC cake', 'Manufacturer', 'TBC after RFQ'],
    ],
    note: 'Finger cage design — not a hammer mill · wet paste requires different rotor',
    conn: 'OB-06 · 8m level belt → hammer mill',
  },
  {
    id: 7,
    tag: 'OHM-01',
    name: 'Hammer Mill',
    imgLabel: 'Hammer Mill',
    imgSub: 'Spring isolation · D90 ≤ 2mm',
    svg: '<svg width="108" height="108" viewBox="0 0 86 100" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="16" width="66" height="44" fill="#1a2a3d" stroke="#A8BDD0" stroke-width="1.5" rx="2"/><circle cx="43" cy="38" r="16" fill="#122234" stroke="#A8BDD0" stroke-width="1.2"/><rect x="27" y="32" width="12" height="5" fill="#40D7C5" rx="1"/><rect x="48" y="32" width="12" height="5" fill="#40D7C5" rx="1"/><rect x="27" y="39" width="12" height="5" fill="#40D7C5" rx="1"/><rect x="48" y="39" width="12" height="5" fill="#40D7C5" rx="1"/><path d="M16 60 Q18 65 16 70 Q14 75 16 80" stroke="#A8BDD0" stroke-width="1.5" fill="none"/><path d="M43 60 Q45 65 43 70 Q41 75 43 80" stroke="#A8BDD0" stroke-width="1.5" fill="none"/><path d="M70 60 Q72 65 70 70 Q68 75 70 80" stroke="#A8BDD0" stroke-width="1.5" fill="none"/><text x="43" y="12" font-family="DM Sans" font-size="9" fill="#F5A623" text-anchor="middle" font-weight="700">SPRING ISO ONLY</text></svg>',
    classA: false,
    noise: true,
    dwell: false,
    specs: [
      ['Location', '+4.0m platform', 'Power', '30 kW'],
      ['Capacity', '5 t/h derated', 'Pad size', '3m × 2.5m × 0.6m'],
      ['Target output', 'D90 ≤ 2mm', 'Exhaust to', 'ODC-01 baghouse'],
      ['Inputs', 'OPDC post-lump breaker', 'Manufacturer', 'TBC after RFQ'],
    ],
    warning: 'Noise zone — spring isolation only · never rigid-anchor · OB-07 oversize return loop',
    conn: 'OB-06 level · OB-07 oversize return → OHM-01 · OB-08 pass → vibrating screen',
  },
  {
    id: 8,
    tag: 'OVS-01',
    name: 'Vibrating Screen',
    imgLabel: 'Vibrating Screen',
    imgSub: 'Flexible mount only',
    svg: '<svg width="108" height="108" viewBox="0 0 86 100" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="22" width="74" height="30" fill="#1a2a3d" stroke="#40D7C5" stroke-width="1.5" rx="2" transform="rotate(-4,43,37)"/><line x1="10" y1="28" x2="80" y2="23" stroke="#40D7C5" stroke-width=".8" opacity=".6"/><line x1="10" y1="35" x2="80" y2="30" stroke="#40D7C5" stroke-width=".8" opacity=".6"/><line x1="10" y1="42" x2="80" y2="37" stroke="#40D7C5" stroke-width=".8" opacity=".6"/><path d="M14 52 Q16 57 14 62 Q12 67 14 72" stroke="#A8BDD0" stroke-width="1.5" fill="none"/><path d="M72 50 Q74 55 72 60 Q70 65 72 70" stroke="#A8BDD0" stroke-width="1.5" fill="none"/><text x="43" y="12" font-family="DM Sans" font-size="9" fill="#A8BDD0" text-anchor="middle">FLEX MOUNT</text><text x="43" y="94" font-family="DM Sans" font-size="9" fill="#F5A623" text-anchor="middle">5.5kW · 2mm aperture</text></svg>',
    classA: false,
    noise: false,
    dwell: false,
    specs: [
      ['Location', '+4.0m platform', 'Power', '5.5 kW'],
      ['Size', '2m × 2m × 0.3m', 'Capacity', '5 t/h'],
      ['Aperture', '2 mm', 'Moisture in', '60–62%'],
      ['Inputs', 'Milled OPDC', 'Manufacturer', 'TBC after RFQ'],
    ],
    note: 'Pass ≤ 2mm → buffer bin | reject > 2mm → return to OHM-01',
    warning: 'Flexible mount only — no rigid anchor permitted',
    conn: 'OB-08 · 8m · -5° → buffer bin',
  },
  {
    id: 9,
    tag: 'ODC-01',
    name: 'Baghouse Dust Filter',
    imgLabel: 'Baghouse Filter',
    imgSub: 'External east wall',
    svg: '<svg width="108" height="108" viewBox="0 0 86 100" xmlns="http://www.w3.org/2000/svg"><rect x="22" y="12" width="42" height="52" fill="#1a2a3d" stroke="#40D7C5" stroke-width="1.3" rx="2"/><rect x="26" y="16" width="10" height="40" fill="#122234" stroke="#A8BDD0" stroke-width=".8" rx="1"/><rect x="38" y="16" width="10" height="40" fill="#122234" stroke="#A8BDD0" stroke-width=".8" rx="1"/><rect x="50" y="16" width="10" height="40" fill="#122234" stroke="#A8BDD0" stroke-width=".8" rx="1"/><line x1="43" y1="64" x2="43" y2="74" stroke="#40D7C5" stroke-width="2"/><polygon points="43,4 38,14 48,14" fill="#A8BDD0"/><text x="43" y="96" font-family="DM Sans" font-size="9" fill="#F5A623" text-anchor="middle">15kW · 3,000 m³/hr</text></svg>',
    classA: false,
    noise: false,
    dwell: false,
    specs: [
      ['Location', 'Outside east wall', 'Power', '15 kW'],
      ['Airflow', '3,000 m³/hr', 'Efficiency', '99% dust capture'],
      ['Inputs', 'Hammer mill exhaust', 'Material', 'Carbon steel housing'],
      ['Connection', 'Exhaust duct from OHM-01', 'Manufacturer', 'TBC after RFQ'],
    ],
  },
  {
    id: 10,
    tag: 'BIN-OPDC-301',
    name: 'Buffer Bin — 24hr Dwell',
    imgLabel: 'Buffer Bin — 24hr Dwell',
    imgSub: 'Gate C.G2/G3 — pH 8.0–9.0',
    svg: '<svg width="108" height="108" viewBox="0 0 86 100" xmlns="http://www.w3.org/2000/svg"><rect x="18" y="8" width="50" height="50" fill="#1a2a3d" stroke="#A8BDD0" stroke-width="1.5" rx="1"/><polygon points="18,58 68,58 58,74 28,74" fill="#122234" stroke="#A8BDD0" stroke-width="1.5"/><rect x="20" y="24" width="46" height="34" fill="rgba(245,166,35,.1)"/><line x1="43" y1="8" x2="43" y2="56" stroke="#A8BDD0" stroke-width="1.1"/><line x1="30" y1="44" x2="56" y2="50" stroke="#A8BDD0" stroke-width="1.1"/><line x1="30" y1="50" x2="56" y2="44" stroke="#A8BDD0" stroke-width="1.1"/><line x1="18" y1="22" x2="8" y2="22" stroke="#A8BDD0" stroke-width="1.1"/><circle cx="6" cy="22" r="3.5" fill="none" stroke="#F5A623" stroke-width="1.1"/><text x="6" y="33" font-family="DM Sans" font-size="9" fill="#F5A623" text-anchor="middle">pH</text><circle cx="62" cy="14" r="7" fill="none" stroke="#A8BDD0" stroke-width="1.1"/><line x1="62" y1="8" x2="62" y2="14" stroke="#A8BDD0" stroke-width="1.1"/><line x1="62" y1="14" x2="67" y2="16" stroke="#A8BDD0" stroke-width="1.1"/></svg>',
    classA: false,
    noise: false,
    dwell: true,
    specs: [
      ['Location', '+2.5m platform', 'Power', '2.2 kW'],
      ['Volume', '15 m³ (6–10 t at 45–55% MC)', 'Discharge', 'Live-bottom auger'],
      ['Dwell time', '≥ 24 hours', 'pH target', '8.0–9.0'],
      ['Inputs', 'Milled OPDC ≤ 2mm', 'MC in bin', '45–55%'],
      ['Shell material', 'Concrete or carbon steel', 'Manufacturer', 'TBC after RFQ'],
    ],
    note: 'Instruments: pH probe · monitor every 8hrs · do not blend until gate clears',
    warning: 'Gate C.G2/G3 — dwell ≥ 24hrs · pH 8.0–9.0 required before S2 transfer',
    gate: { label: '24HR DWELL', bg: 'rgba(245,166,35,.1)', color: '#F5A623' },
    conn: 'BC-11 · 10m → conveyor gallery (25m × 4m covered) → S2 greenhouse intake',
  },
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
