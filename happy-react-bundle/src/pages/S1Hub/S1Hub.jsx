import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import S1ResidueCards from "../../components/S1ResidueCards/S1ResidueCards.jsx";
import {
  C, Fnt, LINE_COLORS, S1_CSS,
  S0Header, S1Breadcrumb, SubstrateFlowStrip,
} from "../../components/S1Shared/S1Shared.jsx";
import { useMill } from "../../contexts/MillContext";
import S1ResidueModal from "../../components/S1ResidueModal/S1ResidueModal.jsx";

/*
 * S1Hub.jsx — S1 Mechanical Pre-Processing Hub (S3Landing pattern)
 * Route: /s1
 */

// ── S1 SUBSTRATE FLOW DATA ──
const S1_INFLOWS = [
  { title: 'Monthly Volume', val: '8,262', suffix: ' t', unit: 'FW / month · S0 Handoff' },
  { title: 'Moisture', val: '62–82', suffix: '%', unit: 'MC wb · Mixed Residues' },
  { title: 'Crude Protein', val: '4.75–14.5', suffix: '%', unit: 'DM · EFB / OPDC Range' },
  { title: 'Lignin ADL', val: '22–31', suffix: '%', unit: 'DM · EFB / OPDC Range' },
];

const S1_OUTFLOWS = [
  { title: 'Monthly Volume', val: '6,800', suffix: ' t', unit: 'FW / month · Post-Press', dir: 'dn' },
  { title: 'Moisture', val: '35–50', suffix: '%', unit: 'MC wb · Post-Press', dir: 'dn' },
  { title: 'Particle Size', val: '≤2–3', suffix: 'mm', unit: 'D90 · Hammer Mill', dir: 'dn' },
  { title: 'Lignin ADL', val: '22–31', suffix: '%', unit: 'DM · Unchanged', dir: 'eq' },
];

// ── S1 LEADERBOARD — one entry per processing line ──
const LEADERBOARD_LINES = [
  {
    name: 'EFB',
    subTitle: 'EFB Pre-Processing Line',
    desc: '10-node mechanical line · 20 t/h · 600mm belt · 298 kW · Shred → Press → Mill → Screen',
    accent: C.teal,
    tonnes: 275,
    mcIn: '62.5%',
    mcOut: '47.5%',
    mcReduction: '24.0%',
    linFrac: '70.0%',
    cn: '60:1',
    bf: '18:1',
    npk: { N: '0.76–2.32', P: '0.20–0.30', K: '1.90–2.20' },
    guardrail: 'DM < 5mm | MC 63.5%',
    route: '/s1/efb',
  },
  {
    name: 'OPDC',
    subTitle: 'OPDC Pre-Processing Line',
    desc: '10-node mechanical line · 5 t/h · 500mm belt · 206 kW · CLASS A Gate · 24hr Dwell',
    accent: C.amber,
    tonnes: 42,
    mcIn: '70–75%',
    mcOut: '≤35%',
    mcReduction: '54.0%',
    linFrac: '14.5%',
    cn: '20:1',
    bf: '18:1',
    npk: { N: '2.32', P: '0.30', K: '1.90' },
    guardrail: 'MC ≥ 40% CLASS A | pH 8–9',
    route: '/s1/opdc',
  },
  {
    name: 'POS',
    subTitle: 'POS Pre-Skimming Line',
    desc: '4–7 node liquid/semi line · 1.25 t/h · ICP-OES Fe Gate · Decanter · Filter Press',
    accent: '#3B82F6',
    tonnes: 31,
    mcIn: '82%',
    mcOut: '65–70%',
    mcReduction: '18.0%',
    linFrac: '11.0%',
    cn: '19:1',
    bf: '10:1',
    npk: { N: '1.76', P: '—', K: '—' },
    guardrail: 'Fe gated | Decanted 70–75% MC',
    route: '/s1/pos',
  },
  {
    name: 'Block 4',
    subTitle: 'Block 4 — Pending',
    desc: 'Specification pending · Not yet commissioned',
    accent: C.grey,
    tonnes: null,
    mcIn: '—',
    mcOut: '—',
    mcReduction: '—',
    linFrac: '—',
    cn: '—',
    bf: '—',
    npk: { N: '—', P: '—', K: '—' },
    guardrail: 'Pending specification',
    route: null,
    placeholder: true,
  },
];

// ── S1 QUICK-ACCESS LINKS ──
const QUICK_LINKS = [
  { title: 'EFB ASCII Process Flow', sub: '10 nodes · 20 t/h · 600mm belt', accent: C.teal, live: true, key: 'efb-ascii' },
  { title: 'EFB Floor Plan', sub: 'Building dimensions · Node cards', accent: C.teal, live: false, key: 'efb-floor' },
  { title: 'EFB 1-Pager (PL,P)', sub: 'Single-page engineering summary', accent: C.teal, live: true, key: 'efb-1pager' },
  { title: 'OPDC ASCII Process Flow', sub: '10 nodes · 5 t/h · CLASS A gate', accent: C.amber, live: true, key: 'opdc-ascii' },
  { title: 'OPDC Floor Plan', sub: 'Building dimensions · Node cards', accent: C.amber, live: false, key: 'opdc-floor' },
  { title: 'OPDC 1-Page (PL,P)', sub: 'Single-page engineering summary', accent: C.amber, live: true, key: 'opdc-1pager' },
];

// ── QUICK LINK POPUP CONTENT ──
const QUICK_LINK_DETAIL = {
  'efb-ascii': {
    title: 'EFB ASCII Process Flow',
    accent: C.teal,
    ticker: [
      { label: 'Daily In', val: '~300 t' }, { label: 'Daily Out', val: '~195 t' },
      { label: 'MC In', val: '62.5%' }, { label: 'MC Out', val: '45–50%' },
      { label: 'Belt', val: '600mm' }, { label: 'Power', val: '298 kW' },
    ],
    ascii: `
  ג”──────────────────────────────────────────────────────────────────ג”
  │  S1C  EFB  PRE-PROCESSING  ·  10 nodes  ·  298 kW  ·  20 t/h  │
  ═──────────────────────────────────────────────────────────────────ג”˜

  [RH-EFB-101]──┤[CV-EFB-101]──┤[ETR-01  Trommel 50mm]──┤[OBM-01  Overband Magnet]
  Recip Feeder    Incline Apron   +3.0m · 11 kW             +3.5m · 3 kW
  7.5 kW          7.5 kW · 600mm                                    │
                                                                     └
  [BIN-EFB-201]───[EVS-01  Vib. Screen 2mm]───[EHM-01  Hammer Mill]───[EPR-01  Screw Press]
  Buffer 50m³      +4.0m · 7.5 kW · Oversize→HM  +4.0m · 37 kW        +3.2m · 37 kW
  +2.5m · 3 kW                                    SPRING ISO ONLY       ■ GATE B.G2
        │
        └
  [EDC-01  Baghouse]  East wall · 15 kW · 99% dust capture

  S2 HANDOFF: 45–50% MC · D90 ≤ 2mm · 20 t/h · NPK: N 582 · P 197 · K 930 kg/day`,
    stats: [
      { lbl: 'Nodes', val: '10' }, { lbl: 'Power', val: '298 kW' },
      { lbl: 'Throughput', val: '20 t/h' }, { lbl: 'Belt', val: '600mm' },
      { lbl: 'Monthly In', val: '8,262 t FW' }, { lbl: 'Monthly Out', val: '5,370 t FW' },
    ],
  },
  'efb-floor': {
    title: 'EFB Floor Plan',
    accent: C.teal,
    ticker: [
      { label: 'Building', val: 'A5' }, { label: 'Size', val: '30×60×12m' },
      { label: 'Area', val: '1,800 m²' }, { label: 'Nodes', val: '10' },
    ],
    nodes: [
      { code: 'RCV-EFB-01', name: 'EFB Receiving Hopper', spec: '50 m³ · Carbon steel · 60° sidewalls · Hydraulic gate' },
      { code: 'CVB-EFB-01', name: 'Apron Conveyor', spec: '15m × 600mm · 15–20° · 7.5 kW VFD · ±0.0 → +3.0m' },
      { code: 'ESD-01', name: 'Primary Shredder', spec: 'Twin-shaft · 20 t/h · 74 kW VFD · 100–150mm output' },
      { code: 'ETR-EFB-01', name: 'Trommel Screen', spec: 'Ø1500mm × 4000mm · 50mm perforations · 5.5 kW' },
      { code: 'ESP-EFB-01', name: 'Screw Press', spec: '20 t/h · 62.5% → 55% MC · 15 kW VFD · 3–5 bar' },
      { code: 'EHM-EFB-01', name: 'Hammer Mill', spec: '13 t/h · 24 swing hammers · 1500 RPM · 110 kW' },
      { code: 'EVS-EFB-01', name: 'Vibrating Screen', spec: '13 t/h · 2mm mesh · Oversize return · 2.2 kW' },
      { code: 'EDC-EFB-01', name: 'Baghouse Dust Collector', spec: '5000 m³/h · 50 m² filter · <50 mg/Nm³ · 7.5 kW fan' },
      { code: 'BIN-EFB-201', name: 'Buffer Storage Bin', spec: '80 m³ · ~32 t @ 55% MC · 8hr buffer · 2×3.7 kW' },
    ],
    building: { label: 'Building A5 — EFB Processing Hall', dim: '30m × 60m × 12m H = 1,800 m²' },
  },
  'efb-1pager': {
    title: 'EFB 1-Pager (PL,P)',
    accent: C.teal,
    ticker: [
      { label: 'CapEx', val: '$184,000' }, { label: 'Power', val: '298 kW' },
      { label: 'Elec/mo', val: '$14,191' }, { label: 'kWh/mo', val: '155,199' },
    ],
    summary: [
      { section: 'Processing Line', items: [
        ['Line ID', 'S1C — EFB Line'], ['Throughput', '20 t/h @ 62.5% MC'],
        ['Daily Input', '~300 t fresh EFB'], ['Daily Output', '~195 t milled fibre'],
        ['Belt Width', '600mm standard'], ['Total Nodes', '10 machines'],
      ]},
      { section: 'Financial', items: [
        ['Installed Power', '298 kW'], ['Monthly kWh', '155,199'],
        ['Electricity/mo', '$14,191 (PLN I-3)'], ['Total CapEx', '$184,000'],
        ['Building', '$45,000 (A5 share)'], ['Maintenance/mo', '~$3,680'],
      ]},
      { section: 'Product Quality', items: [
        ['MC Out', '45–50%'], ['Particle Size', 'D90 ≤ 2mm'],
        ['C:N Ratio', '60:1'], ['Lignin ADL', '22% DM'],
        ['N per day', '582 kg'], ['K per day', '930 kg'],
      ]},
    ],
  },
  'opdc-ascii': {
    title: 'OPDC ASCII Process Flow',
    accent: C.amber,
    ticker: [
      { label: 'Daily In', val: '~42 t' }, { label: 'Daily Out', val: '~28 t' },
      { label: 'MC In', val: '70–75%' }, { label: 'MC Out', val: '≤35%' },
      { label: 'Belt', val: '500mm' }, { label: 'Power', val: '206 kW' },
    ],
    ascii: `
  ג”─────────────────────────────────────────────────────────────────────ג”
  │  S1B  OPDC  PRE-PROCESSING  ·  10 nodes  ·  206 kW  ·  5 t/h    │
  │  Anti-bridging throughout · Paste form handling                   │
  ═─────────────────────────────────────────────────────────────────────ג”˜

  [RH-OPDC-101]──┤[CV-OPDC-101]──┤[OPR-01  Screw Press]
  Recip Feeder      Belt +3.5m       ■ CLASS A GATE — MC floor ≥ 40% LOCKED
  SS304 · 0.75 kW   1.1 kW · 500mm  Non-negotiable · pore damage above 40%
                                               │
                                               └
  [OLB-01  Lump Breaker]──┤[CV-OPDC-201]──┤[OTR-01  Trommel]──┤[ODR-01  Rotary Dryer]
  Twin-roll · 3 kW           Belt +1.5m      2.2 kW              11 kW · ■ MC ≤ 35%
  30mm output
                                                                          │
                                                                          └
  [OVS-01  Vib. Screen]───[OHM-01  Hammer Mill]──┤[BIN-OPDC-301  Product Bin]
  +0.5m · 2.2 kW             +0.8m · 22 kW SPRING ISO   ■ 24HR DWELL GATE
  Oversize → HM               only                       pH 8.0–9.0 required

  S2 HANDOFF: ≤35% MC · D90 ≤ 3mm · pH 8.0–9.0 · dwell ≥ 24hrs`,
    stats: [
      { lbl: 'Nodes', val: '10' }, { lbl: 'Power', val: '206 kW' },
      { lbl: 'Throughput', val: '5 t/h' }, { lbl: 'Belt', val: '500mm' },
      { lbl: 'Monthly In', val: '1,256 t FW' }, { lbl: 'Monthly Out', val: '~830 t FW' },
    ],
  },
  'opdc-floor': {
    title: 'OPDC Floor Plan',
    accent: C.amber,
    ticker: [
      { label: 'Building', val: 'A4' }, { label: 'Size', val: '20×40×10m' },
      { label: 'Area', val: '800 m²' }, { label: 'Nodes', val: '10' },
    ],
    nodes: [
      { code: 'RH-OPDC-101', name: 'Reciprocating Feeder', spec: '10m³ SS304 · Anti-bridging · 5.5 kW VFD · Wet paste' },
      { code: 'CV-OPDC-101', name: 'Feed Belt Conveyor', spec: '8m × 500mm · +1.0 → +3.5m · 1.1 kW' },
      { code: 'OPR-OPDC-01', name: 'Screw Press', spec: '5 t/h · 72.5% → 61% MC · 7.5 kW · CLASS A GATE' },
      { code: 'OLB-OPDC-01', name: 'Lump Breaker', spec: 'Twin-roll · 3 kW · 30mm output' },
      { code: 'OTR-OPDC-01', name: 'Trommel Screen', spec: 'Ø1200mm × 3000mm · 50mm perforations · 2.2 kW' },
      { code: 'ODR-OPDC-01', name: 'Rotary Dryer', spec: '5 t/h · 61% → 35% MC · 11 kW · Air temp <120°C' },
      { code: 'OHM-OPDC-01', name: 'Hammer Mill', spec: '5 t/h · 22 kW SPRING ISO · 3mm screen' },
      { code: 'OVS-OPDC-01', name: 'Vibrating Screen', spec: '5 t/h · 3mm mesh · Oversize return · 2.2 kW' },
      { code: 'BIN-OPDC-301', name: 'Product Bin 85m³', spec: '85m³ · Sealed · Rake agitator · 5.5 kW · 24hr dwell' },
    ],
    building: { label: 'Building A4 — OPDC Processing Hall', dim: '20m × 40m × 10m H = 800 m²' },
  },
  'opdc-1pager': {
    title: 'OPDC 1-Page (PL,P)',
    accent: C.amber,
    ticker: [
      { label: 'CapEx', val: '$38,000' }, { label: 'Power', val: '206 kW' },
      { label: 'Elec/mo', val: '$4,200' }, { label: 'CLASS A', val: 'MC ≥40%' },
    ],
    summary: [
      { section: 'Processing Line', items: [
        ['Line ID', 'S1B — OPDC Line'], ['Throughput', '5 t/h @ 70–75% MC'],
        ['Daily Input', '~42 t OPDC paste'], ['Daily Output', '~28 t dried cake'],
        ['Belt Width', '500mm standard'], ['Total Nodes', '10 machines'],
      ]},
      { section: 'Financial', items: [
        ['Installed Power', '206 kW'], ['Monthly kWh', '~42,000'],
        ['Electricity/mo', '~$4,200 (PLN I-3)'], ['Total CapEx', '$38,000'],
        ['Key Item', 'Buffer Bin $15,000'], ['Maintenance/mo', '~$950'],
      ]},
      { section: 'Product Quality', items: [
        ['MC Out', '≤35%'], ['Particle Size', 'D90 ≤ 3mm'],
        ['C:N Ratio', '20:1'], ['pH Target', '8.0–9.0'],
        ['Dwell Gate', '≥24 hrs'], ['N content', '2.32% DM'],
      ]},
    ],
  },
};

// ── STREAM METADATA — keyed by activeStreams key ──
const STREAM_META = {
  efb: {
    name: 'Empty Fruit Bunches', abbr: 'EFB', accent: C.teal, route: '/s1/efb',
    specs: [
      { lbl: 'B.1  Inlet MC',            val: '62.5% wb' },
      { lbl: 'B.2  Post-Press MC Target', val: '45–50% wb' },
      { lbl: 'B.3  Particle Size (D90)',  val: '≤ 2 mm' },
      { lbl: 'B.5  Total Press Water',    val: '1,181 t / month' },
      { lbl: 'B.6  Press Water Routing',  val: '→ POME Pond Only' },
      { lbl: 'B.7  Post-Press (FW)',      val: '7,081 t / month', hi: true },
    ],
    gates: [
      { id: 'B.G1', lbl: 'Particle Size Gate',  note: 'D90 ≤ 2mm — enter shift result' },
      { id: 'B.G2', lbl: 'Post-Press MC Gate',   note: 'Operator confirms ≤ 50%' },
    ],
  },
  opdc: {
    name: 'Decanter Cake', abbr: 'OPDC', accent: C.amber, route: '/s1/opdc',
    specs: [
      { lbl: 'C.1  Inlet MC',              val: '70–75% wb' },
      { lbl: 'C.2  Post-Press MC (CLASS A)',val: '≥ 40% wb — LOCKED', warn: true },
      { lbl: 'C.3  Buffer Dwell',           val: '≥ 24 hrs',           warn: true },
      { lbl: 'C.4  Post-Buffer pH Target',  val: '8.0–9.0' },
      { lbl: 'C.5  OPDC Filtrate Out',      val: '180 t / month' },
      { lbl: 'C.6  Filtrate Routing',       val: '→ POME Pond Only' },
      { lbl: 'C.7  Post-Press (FW)',        val: '1,076 t / month', hi: true },
    ],
    gates: [
      { id: 'C.G1', lbl: 'MC Floor — CLASS A',  note: 'Math.max(40, reading)' },
      { id: 'C.G2', lbl: 'pH Gate',              note: 'No blend until 8.0–9.0' },
      { id: 'C.G3', lbl: 'Buffer Dwell Gate',    note: 'Enter actual hours logged' },
    ],
  },
  pos: {
    name: 'Palm Oil Sludge', abbr: 'POS', accent: '#3B82F6', route: '/s1/pos',
    specs: [
      { lbl: 'D.1  Fe (ICP-OES, mg/kg DM)', val: 'Awaiting result',    warn: true },
      { lbl: 'D.2  Inclusion Rate',          val: '— Awaiting Fe',      warn: true },
      { lbl: 'D.3  POS Inlet MC',            val: '82% wb' },
      { lbl: 'D.4  Ash Content',             val: '28% DM' },
      { lbl: 'D.5  Crude Protein',           val: '11% DM' },
      { lbl: 'D.6  Ether Extract (EE)',      val: '10% DM' },
      { lbl: 'D.7  POS To Blend (FW)',       val: 'DATA GAP',           warn: true },
    ],
    gates: [],
  },
  pmf: {
    name: 'Palm Mesocarp Fiber', abbr: 'PMF', accent: '#9B59B6', route: null,
    specs: [
      { lbl: 'Moisture',    val: '35–40% wb' },
      { lbl: 'Lignin ADL',  val: '~20% DM' },
      { lbl: 'C:N Ratio',   val: '~80:1' },
      { lbl: 'Source',      val: 'Zero Cost · S0 Mill' },
    ],
    gates: [],
  },
  pome: {
    name: 'POME (Liquid)', abbr: 'POME', accent: '#00C9B1', route: null,
    specs: [
      { lbl: 'BOD',         val: '~25,000 mg/L' },
      { lbl: 'COD',         val: '~55,000 mg/L' },
      { lbl: 'Total N',     val: '~800 mg/L' },
      { lbl: 'Role',        val: 'Emissions avoidance only' },
    ],
    gates: [],
  },
  pke: {
    name: 'Palm Kernel Expeller', abbr: 'PKE', accent: '#F97316', route: null,
    specs: [
      { lbl: 'Moisture',       val: '12% wb' },
      { lbl: 'Crude Protein',  val: '16–18% DM' },
      { lbl: 'C:N Ratio',      val: '~8:1' },
      { lbl: 'Cost',           val: '$160 / t — Purchased', warn: true },
    ],
    gates: [],
  },
  opf: {
    name: 'Oil Palm Fronds', abbr: 'OPF', accent: '#84CC16', route: null,
    specs: [
      { lbl: 'Moisture',      val: '~65% wb' },
      { lbl: 'C:N Ratio',     val: '~55:1' },
      { lbl: 'Availability',  val: 'Seasonal' },
      { lbl: 'Source',        val: 'Zero Cost · Estate' },
    ],
    gates: [],
  },
  opt: {
    name: 'Oil Palm Trunks', abbr: 'OPT', accent: '#A8A29E', route: null,
    specs: [
      { lbl: 'Moisture',      val: '~60% wb' },
      { lbl: 'Lignin ADL',    val: '~25% DM' },
      { lbl: 'C:N Ratio',     val: '~120:1' },
      { lbl: 'Availability',  val: 'Replanting only' },
    ],
    gates: [],
  },
  pks: {
    name: 'Palm Kernel Shell', abbr: 'PKS', accent: '#78716C', route: null,
    specs: [
      { lbl: 'Moisture',        val: '~15% wb' },
      { lbl: 'Calorific Value', val: '~18 MJ/kg' },
      { lbl: 'Note',            val: 'Primarily fuel use' },
    ],
    gates: [],
  },
};

// ── GUARDRAILS ──
const guardrails = [
  { icon: '🔒', label: 'MC ≥40%', val: 'LOCKED', cls: 'red', note: 'CLASS A · OPDC screw press' },
  { icon: '🧪', label: 'Fe <3,000', val: 'mg/kg DM', cls: 'amber', note: 'POS ICP-OES gate' },
  { icon: '🌿', label: 'ADL <12%', val: 'DM target', cls: 'teal', note: 'For BSF palatability' },
  { icon: '⚖️', label: 'C:N 15–22', val: 'optimal', cls: 'teal', note: 'Post-S2 blend target' },
  { icon: '💧', label: 'pH 4.0–5.0', val: 'range', cls: 'amber', note: 'POS pre-treatment' },
  { icon: '🔬', label: 'CEC >20', val: 'cmol/kg', cls: 'teal', note: 'Soil quality target' },
  { icon: '■', label: 'No Cr >20', val: 'mg/kg', cls: 'red', note: 'Heavy metal limit' },
  { icon: '⚙️', label: 'Belt speed', val: 'locked at spec', cls: 'teal', note: 'Per equipment OEM' },
  { icon: '🌡️', label: 'All temps', val: '<85°C', cls: 'amber', note: 'Motor + bearing limit' },
];

// ── LINE DETAIL DATA (popup) ──
const LINE_DETAIL = {
  EFB: {
    inflows: [
      { title: 'Monthly Volume', val: '8,262', suffix: ' t', unit: 'FW / month · EFB @ 22% FFB' },
      { title: 'Moisture', val: '62.5', suffix: '%', unit: 'MC wb · Press Discharge' },
      { title: 'Crude Protein', val: '4.75', suffix: '%', unit: 'DM · N × 6.25' },
      { title: 'Lignin ADL', val: '22', suffix: '%', unit: 'DM · EFB Canonical' },
    ],
    outflows: [
      { title: 'Monthly Volume', val: '5,370', suffix: ' t', unit: 'FW / month · Post-Press', dir: 'dn' },
      { title: 'Moisture', val: '45–50', suffix: '%', unit: 'MC wb · D90 ≤ 2mm', dir: 'dn' },
      { title: 'Particle Size', val: '≤2', suffix: 'mm', unit: 'D90 · Vibrating Screen', dir: 'dn' },
      { title: 'Daily Output', val: '~195', suffix: ' t', unit: 'Milled fibre to S2', dir: 'dn' },
    ],
    equipment: [
      { code: 'AF-01', name: 'Hydraulic Feeder', tph: '20 tph', kw: '18 kW', cost: '$15,000' },
      { code: 'BC-01/02', name: 'Incline Conveyor 600mm', tph: '20 tph', kw: '22 kW', cost: '$18,000' },
      { code: 'TR-2060', name: 'Trommel Screen 50mm', tph: '19 tph', kw: '11 kW', cost: '$8,000' },
      { code: 'OBM-01', name: 'Overband Magnet', tph: '19 tph', kw: '3 kW', cost: '—' },
      { code: 'PR-01', name: 'Screw Press + PKSA', tph: '14 tph', kw: '30 kW', cost: '—' },
      { code: 'SD-01', name: 'Primary Shredder', tph: '14 tph', kw: '75 kW', cost: '$45,000' },
      { code: 'HM-01', name: 'Hammer Mill', tph: '14 tph', kw: '110 kW', cost: '$35,000' },
      { code: 'VS-01', name: 'Vibrating Screen 2mm', tph: '13 tph', kw: '11 kW', cost: '$12,000' },
      { code: 'DC-01', name: 'Baghouse (Shared)', tph: '13 tph', kw: '18 kW', cost: '—' },
      { code: 'BIN-EFB-01', name: 'Buffer Bin 50m³', tph: '13 tph', kw: '0 kW', cost: '$25,000' },
    ],
  },
  OPDC: {
    inflows: [
      { title: 'Monthly Volume', val: '1,256', suffix: ' t', unit: 'FW / month · OPDC @ 15.2% EFB' },
      { title: 'Moisture', val: '70–75', suffix: '%', unit: 'MC wb · Paste Form' },
      { title: 'Crude Protein', val: '14.5', suffix: '%', unit: 'DM · N 2.32% DM' },
      { title: 'Lignin ADL', val: '30.7', suffix: '%', unit: 'DM · OPDC Canonical' },
    ],
    outflows: [
      { title: 'Monthly Volume', val: '~830', suffix: ' t', unit: 'FW / month · Post-Press', dir: 'dn' },
      { title: 'Moisture', val: '≤35', suffix: '%', unit: 'MC wb · Post-Dryer', dir: 'dn' },
      { title: 'Particle Size', val: '≤3', suffix: 'mm', unit: 'D90 · Vibrating Screen', dir: 'dn' },
      { title: 'CLASS A Gate', val: 'MC ≥40%', suffix: '', unit: 'LOCKED · Non-Negotiable', dir: 'eq' },
    ],
    equipment: [
      { code: 'SF-01', name: 'Reciprocating Feeder', tph: '5 tph', kw: '7.5 kW', cost: '$10,000' },
      { code: 'BC-10/11', name: 'Incline Conveyor 500mm', tph: '5 tph', kw: '15 kW', cost: '$8,000' },
      { code: 'TR-OPDC-01', name: 'Trommel Screen 50mm', tph: '4.8 tph', kw: '9 kW', cost: '$5,000' },
      { code: 'OBM-02', name: 'Overband Magnet', tph: '4.8 tph', kw: '3 kW', cost: '—' },
      { code: 'DC-PRESS-01', name: 'Screw Press + PKSA', tph: '3.5 tph', kw: '30 kW', cost: '—' },
      { code: 'LB-01', name: 'Lump Breaker', tph: '3.5 tph', kw: '37 kW', cost: '—' },
      { code: 'HM-02', name: 'Hammer Mill', tph: '3.5 tph', kw: '90 kW', cost: '—' },
      { code: 'VS-02', name: 'Vibrating Screen 2mm', tph: '3.3 tph', kw: '9 kW', cost: '—' },
      { code: 'DC-01', name: 'Baghouse (Shared)', tph: '3.3 tph', kw: '0 kW', cost: '—' },
      { code: 'BIN-OPDC-24HR', name: 'Buffer Bin 85m³ + Rake', tph: '3.3 tph', kw: '5.5 kW', cost: '$15,000' },
    ],
  },
  POS: {
    inflows: [
      { title: 'Monthly Volume', val: '900', suffix: ' t', unit: 'FW / month · POS Sludge' },
      { title: 'Moisture', val: '82', suffix: '%', unit: 'MC wb · Liquid/Semi' },
      { title: 'Crude Protein', val: '11', suffix: '%', unit: 'DM · N 1.76% DM' },
      { title: 'Fe Content', val: 'Variable', suffix: '', unit: 'mg/kg DM · ICP-OES Gate', color: '#3B82F6' },
    ],
    outflows: [
      { title: 'Monthly Volume', val: '~405', suffix: ' t', unit: 'Cake / month · Post-Press', dir: 'dn' },
      { title: 'Moisture', val: '65–70', suffix: '%', unit: 'MC wb · Post-Filter Press', dir: 'dn' },
      { title: 'pH', val: '5.5–6.0', suffix: '', unit: 'Post-CaCOƒ Conditioning', dir: 'up' },
      { title: 'Fe Status', val: 'Gated', suffix: '', unit: 'ICP-OES Protocol', dir: 'eq' },
    ],
    equipment: [
      { code: 'RH-OPDC-101', name: 'Sludge Pit 15m³', tph: '1.25 tph', kw: '0 kW', cost: '—' },
      { code: 'DRS-SLD-01', name: 'Rotary Drum Screen', tph: '1.17 tph', kw: '7 kW', cost: '—' },
      { code: 'DEC-SLD-101', name: 'Decanter Centrifuge', tph: '0.56 tph', kw: '55 kW', cost: '$80K–$150K' },
      { code: 'BIN-OPDC-301', name: 'Buffer Tank 15m³', tph: '0.56 tph', kw: '0 kW', cost: '—' },
    ],
  },
};

// ── MODULE POPUP DETAIL ──
const MODULE_DETAIL = {
  'efb': {
    num: 'Line 1', title: 'EFB Pre-Processing Line', accent: C.teal, icon: '🏭',
    stats: [
      { lbl: 'Nodes', val: '10' }, { lbl: 'Power', val: '298 kW' },
      { lbl: 'Throughput', val: '20 t/h' }, { lbl: 'Belt', val: '600mm' },
      { lbl: 'CapEx', val: '$184,000' }, { lbl: 'Elec/mo', val: '$14,191' },
    ],
    sections: [
      { title: 'Process Flow', rows: [
        ['Feed', 'EFB @ 62.5% MC from mill press discharge'],
        ['Step 1', 'RH-EFB-101 Hydraulic Feeder → Apron Conveyor (7.5 kW)'],
        ['Step 2', 'ETR-01 Trommel Screen 50mm → OBM-01 Overband Magnet'],
        ['Step 3', 'EPR-01 Screw Press + PKSA  ■ GATE B.G2 · MC floor 40%'],
        ['Step 4', 'ESD-01 Primary Shredder (75 kW) → EHM-01 Hammer Mill (110 kW)'],
        ['Step 5', 'EVS-01 Vibrating Screen 2mm → EDC-01 Baghouse'],
        ['Output', 'BIN-EFB-201 Buffer Bin 50m³ → S2 Handoff'],
      ]},
      { title: 'Key Specs', rows: [
        ['MC In', '62.5%'], ['MC Out', '45–50%'],
        ['Particle Size', 'D90 ≤ 2mm'], ['Belt Width', '600mm'],
        ['Daily In', '~300 t FW'], ['Daily Out', '~195 t FW'],
        ['C:N Ratio', '60:1'], ['Lignin ADL', '22% DM'],
        ['N/day', '582 kg'], ['K/day', '930 kg'],
      ]},
      { title: 'Equipment & Cost', rows: [
        ['AF-01 Hydraulic Feeder', '$15,000'], ['BC-01/02 Incline Conveyor', '$18,000'],
        ['TR-2060 Trommel Screen', '$8,000'], ['SD-01 Primary Shredder', '$45,000'],
        ['HM-01 Hammer Mill', '$35,000'], ['VS-01 Vibrating Screen', '$12,000'],
        ['BIN-EFB-01 Buffer Bin', '$25,000'], ['Total CapEx', '$184,000'],
      ]},
    ],
  },
  'opdc': {
    num: 'Line 2', title: 'OPDC Pre-Processing Line', accent: C.amber, icon: '🏭',
    stats: [
      { lbl: 'Nodes', val: '10' }, { lbl: 'Power', val: '206 kW' },
      { lbl: 'Throughput', val: '5 t/h' }, { lbl: 'Belt', val: '500mm' },
      { lbl: 'CapEx', val: '$38,000' }, { lbl: 'Elec/mo', val: '$6,651' },
    ],
    sections: [
      { title: 'Process Flow', rows: [
        ['Feed', 'OPDC paste @ 70–75% MC · Anti-bridging throughout'],
        ['Step 1', 'RH-OPDC-101 Reciprocating Feeder (SS304 · anti-bridging)'],
        ['Step 2', 'CV-OPDC-101 Belt Conveyor → OPR-01 Screw Press'],
        ['■ CLASS A GATE', 'MC floor ≥ 40% LOCKED · NON-NEGOTIABLE'],
        ['Step 3', 'OLB-01 Lump Breaker → OTR-01 Trommel → ODR-01 Rotary Dryer'],
        ['Step 4', 'OHM-01 Hammer Mill (SPRING ISO) → OVS-01 Vib. Screen 3mm'],
        ['■ 24HR DWELL', 'BIN-OPDC-301 Product Bin · pH 8.0–9.0 required'],
        ['Output', '≤35% MC · D90 ≤ 3mm · pH 8.0–9.0 · to S2'],
      ]},
      { title: 'Key Specs', rows: [
        ['MC In', '70–75%'], ['MC Out', '≤35%'],
        ['Particle Size', 'D90 ≤ 3mm'], ['Belt Width', '500mm'],
        ['Daily In', '~42 t FW'], ['Daily Out', '~28 t FW'],
        ['C:N Ratio', '20:1'], ['pH Gate', '8.0–9.0'],
        ['Dwell Gate', '≥24 hrs'], ['N content', '2.32% DM'],
      ]},
      { title: 'Equipment & Cost', rows: [
        ['SF-01 Reciprocating Feeder', '$10,000'], ['BC-10/11 Incline Conveyor', '$8,000'],
        ['TR-OPDC-01 Trommel Screen', '$5,000'], ['BIN-OPDC-24HR Buffer Bin', '$15,000'],
        ['OBM-02 Overband Magnet', '—'], ['Screw Press + PKSA', '—'],
        ['Lump Breaker', '—'], ['Total CapEx', '$38,000'],
      ]},
    ],
  },
  'pos': {
    num: 'Line 3', title: 'POS Pre-Skimming Line', accent: '#3B82F6', icon: '🔒',
    stats: [
      { lbl: 'Nodes', val: '4–7' }, { lbl: 'Power', val: '62 kW' },
      { lbl: 'Throughput', val: '1.25 t/h' }, { lbl: 'Type', val: 'Liquid/Semi' },
      { lbl: 'Fe Gate', val: 'ICP-OES' }, { lbl: 'Elec/mo', val: '$1,806' },
    ],
    sections: [
      { title: 'Process Flow', rows: [
        ['Feed', 'POS Sludge @ 82% MC from mill effluent stream'],
        ['Step 1', 'Sludge Pit 15m³ → Progressive Cavity Pump'],
        ['Step 2', 'DRS-SLD-01 Rotary Drum Screen (78% MC out)'],
        ['■ ICP-OES Fe GATE', 'Fe result sets CaCOƒ dose + S2 inclusion'],
        ['Step 3', 'DEC-SLD-101 Decanter Centrifuge (55 kW · 65% MC out)'],
        ['Step 4', 'CaCOƒ conditioning · pH 4.4 → 5.5–6.0'],
        ['Output', 'Cake ~405 t/mo · 65–70% MC · Gated · to S2'],
      ]},
      { title: 'Key Specs', rows: [
        ['MC In', '82%'], ['MC Out', '65–70%'],
        ['pH In', '4.4 (acidic)'], ['pH Out', '5.5–6.0'],
        ['Daily In', '~30 t FW'], ['Daily Out', '~13.5 t cake'],
        ['Fe Gate', 'ICP-OES protocol'], ['CaCOƒ Dose', '5–20% w/w'],
        ['Screen Reject', '→ EFB Line'], ['Filtrate', '→ POME system'],
      ]},
      { title: 'Equipment & Cost', rows: [
        ['Sludge Pit 15m³', '—'], ['Rotary Drum Screen', '—'],
        ['Decanter Centrifuge', '$80K–$150K RFQ'], ['Buffer Tank 15m³', '—'],
        ['Progressive Cavity Pump', '0.75 kW'], ['CaCOƒ Dosing', 'Batch manual'],
        ['ICP-OES Sampling', 'Lab gate'], ['Total CapEx', 'RFQ pending'],
      ]},
    ],
  },
  'eng': {
    num: 'Eng', title: 'Engineering Overview', accent: C.grey, icon: '📐',
    stats: [
      { lbl: 'Total Nodes', val: '24' }, { lbl: 'Lines', val: '3' },
      { lbl: 'Total kW', val: '566 kW' }, { lbl: 'CapEx', val: '$594,000' },
      { lbl: 'Guardrails', val: '9' }, { lbl: 'Status', val: 'Live' },
    ],
    sections: [
      { title: 'Line Summary', rows: [
        ['S1C — EFB Line', '10 nodes · 298 kW · 20 t/h · 600mm belt · $184K'],
        ['S1B — OPDC Line', '10 nodes · 206 kW · 5 t/h · 500mm belt · $38K'],
        ['S1A — POS Line', '4–7 nodes · 62 kW · 1.25 t/h · liquid/semi'],
        ['Total Power', '566 kW installed across all 3 lines'],
        ['Total CAPEX', '~$372,000 equipment (excl. building + Eng)'],
      ]},
      { title: '9 Hard Guardrails', rows: [
        ['B.G1 — Vib. Screen', 'DM particle size ≤ 2mm (EFB) / ≤ 3mm (OPDC)'],
        ['B.G2 — Screw Press', 'MC floor ≥ 40% LOCKED · CLASS A · NON-NEGOTIABLE'],
        ['B.G3 — Dwell', 'OPDC ≥ 24hrs in bin · pH 8.0–9.0 achieved'],
        ['B.G4 — Temp', 'All motors < 85°C · SPRING ISO hammer mills only'],
        ['B.G5 — Fe Gate', 'POS ICP-OES · Fe < 3,000 mg/kg DM for S2'],
        ['B.G6 — Belt', 'Belt speed locked per OEM · No field override'],
        ['B.G7 — ADL', 'Target ADL < 12% DM for BSF palatability'],
        ['B.G8 — C:N', 'C:N 15–22:1 optimal at S2 blending stage'],
        ['B.G9 — CEC', 'CEC > 20 cmol/kg soil target · post-S3 output'],
      ]},
      { title: 'OPEX Summary', rows: [
        ['EFB line elec.', '$14,191/mo · 155,199 kWh'],
        ['OPDC line elec.', '$6,651/mo · ~42,000 kWh'],
        ['POS line elec.', '$1,806/mo · ~11,000 kWh'],
        ['Total electricity', '$22,648/mo'],
        ['Labour (5 roles)', '$3,576/mo'],
        ['Maintenance', '$11,733/mo'],
        ['Total OPEX', '$37,957/mo'],
      ]},
    ],
  },
  'fp': {
    num: 'FP', title: 'Combined Floor Plans', accent: C.teal, icon: '🗺️',
    stats: [
      { lbl: 'Buildings', val: '3' }, { lbl: 'Total Area', val: '~3,200 m²' },
      { lbl: 'EFB Hall', val: '30×60×12m' }, { lbl: 'OPDC Hall', val: '20×40×10m' },
      { lbl: 'POS Bay', val: '12×24×6m' }, { lbl: 'Node Cards', val: '24 total' },
    ],
    sections: [
      { title: 'Building A5 — EFB Hall', rows: [
        ['Dimensions', '30m × 60m × 12m H = 1,800 m²'],
        ['Structure', 'PEB steel · ASTM A36 · 7 portal frames @ 6m'],
        ['Conveyors', '6 segments · 600mm belt · total ~20.8 kW'],
        ['Elevation', 'GFL ±0.0m to +4.0m process platform'],
        ['Noise zone', 'Hammer mill bay: 85+ dBA · PPE mandatory'],
        ['Dust zone', 'Baghouse EDC-EFB-01 · east wall · 7.5 kW fan'],
      ]},
      { title: 'Building A4 — OPDC Hall', rows: [
        ['Dimensions', '20m × 40m × 10m H = 800 m²'],
        ['Structure', 'PEB steel · SS304 contact surfaces'],
        ['Elevation', '+1.0m → +3.5m · anti-bridging throughout'],
        ['Class A Zone', 'Screw press bay · classified process area'],
        ['Dwell bay', 'BIN-OPDC-301 · sealed · moisture-controlled'],
        ['Ventilation', 'Forced ventilation · odour management'],
      ]},
      { title: 'POS Liquid Bay (A-POS)', rows: [
        ['Dimensions', '12m × 24m × 6m H = 288 m²'],
        ['Structure', 'Concrete bund · epoxy-lined · 110% containment'],
        ['Sludge pit', 'At-grade EL 0.0m · 60° walls · 15m³'],
        ['Decanter', 'SS316 · isolated · VFD-controlled'],
        ['ICP-OES', 'Sampling point at DRS outlet · lab submission'],
        ['Drainage', '150mm HDPE → POME system'],
      ]},
    ],
  },
  'cap': {
    num: 'CAP', title: 'Financials — CAPEX / OPEX', accent: C.amber, icon: '💰',
    stats: [
      { lbl: 'Building CapEx', val: '$1.37M' }, { lbl: 'Equip. CapEx', val: '$372K' },
      { lbl: 'Labour/mo', val: '$3,576' }, { lbl: 'Elec/mo', val: '$22,648' },
      { lbl: 'Maint/mo', val: '$11,733' }, { lbl: 'Total OPEX/mo', val: '$37,957' },
    ],
    sections: [
      { title: 'Building CAPEX', rows: [
        ['A1 — Site Works', '$79,540'], ['A2 — Civil & Concrete', '$105,900'],
        ['A3 — Structural Steel', '$336,790'], ['A4 — Welfare Fit-out', '$107,650'],
        ['A5 — MEP Power', '$140,000'], ['A6 — HVAC', '$28,000'],
        ['A7 — Plumbing', '$42,000'], ['A8 — Process Items', '$44,000'],
        ['Sub-total (base)', '$883,880'], ['+8% Contingency +20% EPC +20% Dev', '$1,374,610'],
      ]},
      { title: 'Equipment CAPEX', rows: [
        ['EFB Line (7 items)', '$158,000'], ['OPDC Line (4 items)', '$38,000'],
        ['Shared — Limestone Dosing', '$6,000'], ['2× Wheel Loaders', '$170,000'],
        ['Total Equipment', '$372,000'],
        ['EFB largest item', 'SD-01 Primary Shredder $45,000'],
        ['OPDC largest item', 'BIN-OPDC-301 Buffer Bin $15,000'],
      ]},
      { title: 'Monthly OPEX', rows: [
        ['Plant Operator ×2', '$1,600'], ['Equipment Tech ×1', '$900'],
        ['Lab Technician ×1', '$700'], ['Logistics / Loader ×1', '$550'],
        ['Supervisor ×1', '$826'], ['Labour total', '$3,576'],
        ['EFB + OPDC + POS elec.', '$22,648'], ['Maintenance', '$11,733'],
        ['TOTAL OPEX/month', '$37,957'],
      ]},
    ],
  },
};

export default function S1Hub() {
  const nav = useNavigate();
  const { site, derived } = useMill();
  const [activeModal, setActiveModal] = useState(null);
  const [lineModal, setLineModal] = useState(null);
  const [quickModal, setQuickModal] = useState(null);
  const [moduleModal, setModuleModal] = useState(null);

  const s1Calc = useMemo(() => {
    const efbFW  = derived?.monthlyEfb  || 0;
    const opdcFW = derived?.monthlyOpdc || 0;
    const posFW  = derived?.monthlyPos  || 0;
    const totalFW = efbFW + opdcFW + posFW;
    const efbDM   = efbFW  * 0.375 * 0.97;
    const opdcDM  = opdcFW * 0.30  * 0.99;
    const posDM   = posFW  * 0.18  * 0.95;
    const totalDM = efbDM + opdcDM + posDM;
    const waterRemoved = totalFW - totalDM;
    const inputDM = efbFW*0.375 + opdcFW*0.30 + posFW*0.18;
    const dmRecovery = inputDM > 0 ? ((totalDM/inputDM)*100).toFixed(1) : '\u2014';
    const efbTPH  = efbFW  > 0 ? (efbFW  / 30 / 20).toFixed(1) : '\u2014';
    const opdcTPH = opdcFW > 0 ? (opdcFW / 30 / 20).toFixed(1) : '\u2014';
    const posTPH  = posFW  > 0 ? (posFW  / 30 / 20).toFixed(1) : '\u2014';
    return { efbFW, opdcFW, posFW, totalFW, efbDM, opdcDM, posDM, totalDM, waterRemoved, dmRecovery, efbTPH, opdcTPH, posTPH };
  }, [derived]);

  const modules = [
    { key: 'efb',  num: 'Line 1', title: 'EFB Pre-Processing Line', desc: '10-node mechanical line · 20 t/h · 600mm belt · 298 kW · Shred → Press → Mill → Screen', accent: C.teal, icon: '🏭', tags: ['10 Machines', '600mm Belt', '20 t/h', 'Trommel + Hammer Mill'] },
    { key: 'opdc', num: 'Line 2', title: 'OPDC Pre-Processing Line', desc: '10-node mechanical line · 5 t/h · 500mm belt · 206 kW · CLASS A Gate · 24hr Dwell', accent: C.amber, icon: '🏭', tags: ['10 Machines', '500mm Belt', 'CLASS A', '24hr Dwell Gate'] },
    { key: 'pos',  num: 'Line 3', title: 'POS Pre-Skimming Line', desc: '4–7 node liquid/semi line · 1.25 t/h · ICP-OES Fe Gate · Decanter · Filter Press', accent: '#3B82F6', icon: '🔒', tags: ['4–7 Machines', 'ICP-OES Fe', 'Decanter', 'Filter Press'] },
    { key: 'eng',  num: 'Eng', title: 'Engineering Overview', desc: '24 equipment nodes · 3 processing lines · Full engineering spec with CAPEX + OPEX + Greenhouse + Guardrails', accent: C.grey, icon: '📐', tags: ['24 Nodes', '3 Lines', 'Full Spec'] },
    { key: 'fp',   num: 'FP', title: 'Combined Floor Plans', desc: 'Tabbed floor plans · EFB · OPDC · POS · Building dimensions · Node cards with specs', accent: C.teal, icon: '🗺️', tags: ['3 Floor Plans', 'Node Cards', 'Dimensions'] },
    { key: 'cap',  num: 'CAP', title: 'Financials — CAPEX / OPEX', desc: 'Building $1.37M · Equipment $372K · Labour $3,576 · Electricity $22,648 · Maintenance $11,733 · Total $37,957/mo', accent: C.amber, icon: '💰', tags: ['Building CAPEX', 'Equipment', 'OpEx', 'Site Metrics'] },
  ];

  return (
    <>
      <style>{S1_CSS}</style>

      {/* ── LINE DETAIL MODAL ── */}
      {lineModal && LINE_DETAIL[lineModal] && (() => {
        const line = LEADERBOARD_LINES.find(l => l.name === lineModal);
        const detail = LINE_DETAIL[lineModal];
        return (
          <div
            onClick={() => setLineModal(null)}
            style={{
              position: 'fixed', inset: 0, zIndex: 1000,
              background: 'rgba(5,12,25,0.82)', backdropFilter: 'blur(4px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '20px',
            }}
          >
            <div
              onClick={e => e.stopPropagation()}
              style={{
                background: '#0D1E33',
                border: `1.5px solid ${line.accent}44`,
                borderTop: `3px solid ${line.accent}`,
                borderRadius: 14,
                width: '100%', maxWidth: 820,
                maxHeight: '88vh', overflowY: 'auto',
                padding: '24px 28px',
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 4, height: 28, borderRadius: 2, background: line.accent, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontFamily: Fnt.syne, fontWeight: 700, fontSize: 18, color: line.accent }}>{line.name} Processing Line</div>
                    <div style={{ fontFamily: Fnt.dm, fontSize: 11, color: C.grey, marginTop: 2 }}>{line.guardrail}</div>
                  </div>
                </div>
                <button
                  onClick={() => setLineModal(null)}
                  style={{ background: 'rgba(139,160,180,.12)', border: '1px solid rgba(139,160,180,.25)', borderRadius: 6, padding: '4px 12px', color: C.grey, fontFamily: Fnt.mono, fontSize: 11, cursor: 'pointer' }}
                >ESC ✕</button>
              </div>

              {/* Key metrics strip */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8, marginBottom: 20 }}>
                {[
                  { lbl: 'T/DAY', val: line.tonnes ?? '—' },
                  { lbl: 'MC IN', val: line.mcIn },
                  { lbl: 'MC OUT', val: line.mcOut },
                  { lbl: 'MC REDUC.', val: line.mcReduction },
                  { lbl: 'C:N', val: line.cn },
                  { lbl: 'B:F', val: line.bf },
                ].map((m, i) => (
                  <div key={i} style={{ background: 'rgba(0,0,0,.3)', borderRadius: 7, padding: '8px 10px' }}>
                    <div style={{ fontFamily: Fnt.dm, fontSize: 9, fontWeight: 700, color: C.grey, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 3 }}>{m.lbl}</div>
                    <div style={{ fontFamily: Fnt.mono, fontSize: 14, fontWeight: 700, color: C.amber }}>{m.val}</div>
                  </div>
                ))}
              </div>

              {/* Substrate flow */}
              <SubstrateFlowStrip
                stageLabel={`${line.name} Substrate Flow`}
                inflows={detail.inflows}
                outflows={detail.outflows}
              />

              {/* Equipment register */}
              <div style={{ marginTop: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <div style={{ width: 3, height: 13, borderRadius: 2, background: line.accent, flexShrink: 0 }} />
                  <div style={{ fontFamily: Fnt.syne, fontWeight: 700, fontSize: 12, color: line.accent, textTransform: 'uppercase', letterSpacing: '.06em' }}>Equipment Register</div>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: Fnt.dm, fontSize: 11 }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${line.accent}44` }}>
                      {['Code', 'Equipment', 't/h', 'kW', 'Cost'].map(h => (
                        <th key={h} style={{ padding: '6px 10px', textAlign: 'left', fontWeight: 700, fontSize: 9, color: C.grey, textTransform: 'uppercase', letterSpacing: '.05em' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {detail.equipment.map((eq, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid rgba(139,160,180,.08)', background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,.15)' }}>
                        <td style={{ padding: '7px 10px', color: line.accent, fontFamily: Fnt.mono, fontSize: 10, fontWeight: 700 }}>{eq.code}</td>
                        <td style={{ padding: '7px 10px', color: C.white }}>{eq.name}</td>
                        <td style={{ padding: '7px 10px', color: C.grey }}>{eq.tph}</td>
                        <td style={{ padding: '7px 10px', color: C.amber, fontFamily: Fnt.mono }}>{eq.kw}</td>
                        <td style={{ padding: '7px 10px', color: C.grey }}>{eq.cost}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      })()}

      {/* BREADCRUMB */}
      <S1Breadcrumb />

      {/* ── QUICK LINK MODAL ── */}
      {quickModal && QUICK_LINK_DETAIL[quickModal] && (() => {
        const d = QUICK_LINK_DETAIL[quickModal];
        return (
          <div
            onClick={() => setQuickModal(null)}
            style={{ position: 'fixed', inset: 0, zIndex: 1001, background: 'rgba(5,12,25,0.82)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
          >
            <div
              onClick={e => e.stopPropagation()}
              style={{ background: '#0D1E33', border: `1.5px solid ${d.accent}44`, borderTop: `3px solid ${d.accent}`, borderRadius: 14, width: '100%', maxWidth: 860, maxHeight: '88vh', overflowY: 'auto', padding: '24px 28px' }}
            >
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 4, height: 26, borderRadius: 2, background: d.accent, flexShrink: 0 }} />
                  <div style={{ fontFamily: Fnt.syne, fontWeight: 700, fontSize: 17, color: d.accent }}>{d.title}</div>
                </div>
                <button onClick={() => setQuickModal(null)} style={{ background: 'rgba(139,160,180,.12)', border: '1px solid rgba(139,160,180,.25)', borderRadius: 6, padding: '4px 12px', color: C.grey, fontFamily: Fnt.mono, fontSize: 11, cursor: 'pointer' }}>ESC ✕</button>
              </div>

              {/* Ticker strip */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 18 }}>
                {d.ticker.map((t, i) => (
                  <div key={i} style={{ background: 'rgba(0,0,0,.3)', borderRadius: 6, padding: '6px 12px' }}>
                    <div style={{ fontFamily: Fnt.dm, fontSize: 9, fontWeight: 700, color: C.grey, textTransform: 'uppercase', letterSpacing: '.05em' }}>{t.label}</div>
                    <div style={{ fontFamily: Fnt.mono, fontSize: 13, fontWeight: 700, color: C.amber }}>{t.val}</div>
                  </div>
                ))}
              </div>

              {/* ASCII flow */}
              {d.ascii && (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <div style={{ width: 3, height: 13, borderRadius: 2, background: d.accent, flexShrink: 0 }} />
                    <div style={{ fontFamily: Fnt.syne, fontWeight: 700, fontSize: 12, color: d.accent, textTransform: 'uppercase', letterSpacing: '.06em' }}>Process Flow</div>
                  </div>
                  <pre style={{ fontFamily: Fnt.mono, fontSize: 11, color: C.greyMd ?? '#8bafc8', background: 'rgba(0,0,0,.3)', border: `1px solid ${d.accent}33`, borderRadius: 8, padding: '14px 16px', overflowX: 'auto', lineHeight: 1.6, whiteSpace: 'pre', margin: 0 }}>{d.ascii}</pre>
                  {d.stats && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8, marginTop: 12 }}>
                      {d.stats.map((s, i) => (
                        <div key={i} style={{ background: 'rgba(0,0,0,.25)', borderRadius: 6, padding: '7px 10px' }}>
                          <div style={{ fontFamily: Fnt.dm, fontSize: 9, fontWeight: 700, color: C.grey, textTransform: 'uppercase', marginBottom: 2 }}>{s.lbl}</div>
                          <div style={{ fontFamily: Fnt.mono, fontSize: 12, fontWeight: 700, color: C.amber }}>{s.val}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* Floor plan nodes */}
              {d.nodes && (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <div style={{ width: 3, height: 13, borderRadius: 2, background: d.accent, flexShrink: 0 }} />
                    <div style={{ fontFamily: Fnt.syne, fontWeight: 700, fontSize: 12, color: d.accent, textTransform: 'uppercase', letterSpacing: '.06em' }}>Equipment Layout</div>
                  </div>
                  {d.building && (
                    <div style={{ background: 'rgba(0,0,0,.25)', border: `1px solid ${d.accent}44`, borderRadius: 8, padding: '10px 16px', marginBottom: 12, display: 'flex', gap: 16, alignItems: 'center' }}>
                      <div style={{ fontFamily: Fnt.syne, fontWeight: 700, fontSize: 13, color: d.accent }}>{d.building.label}</div>
                      <div style={{ fontFamily: Fnt.mono, fontSize: 13, color: C.amber }}>{d.building.dim}</div>
                    </div>
                  )}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 10 }}>
                    {d.nodes.map((n, i) => (
                      <div key={i} style={{ background: 'rgba(13,30,51,.8)', border: `1px solid ${d.accent}33`, borderLeft: `3px solid ${d.accent}`, borderRadius: 8, padding: '12px 14px' }}>
                        <div style={{ fontFamily: Fnt.mono, fontSize: 10, fontWeight: 700, color: d.accent, marginBottom: 3 }}>{n.code}</div>
                        <div style={{ fontFamily: Fnt.syne, fontSize: 11, fontWeight: 700, color: C.white, marginBottom: 5 }}>{n.name}</div>
                        <div style={{ fontFamily: Fnt.dm, fontSize: 10, color: C.grey, lineHeight: 1.5 }}>{n.spec}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* 1-pager summary */}
              {d.summary && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
                  {d.summary.map((sec, i) => (
                    <div key={i} style={{ background: 'rgba(0,0,0,.25)', border: `1px solid ${d.accent}33`, borderRadius: 8, padding: '14px 16px' }}>
                      <div style={{ fontFamily: Fnt.syne, fontWeight: 700, fontSize: 11, color: d.accent, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 10 }}>{sec.section}</div>
                      {sec.items.map(([label, val], j) => (
                        <div key={j} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 7, borderBottom: '1px solid rgba(139,160,180,.08)', paddingBottom: 7 }}>
                          <div style={{ fontFamily: Fnt.dm, fontSize: 10, color: C.grey }}>{label}</div>
                          <div style={{ fontFamily: Fnt.mono, fontSize: 10, fontWeight: 700, color: C.white, textAlign: 'right' }}>{val}</div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* ── MODULE DETAIL MODAL ── */}
      {moduleModal && MODULE_DETAIL[moduleModal] && (() => {
        const d = MODULE_DETAIL[moduleModal];
        return (
          <div
            onClick={() => setModuleModal(null)}
            style={{ position: 'fixed', inset: 0, zIndex: 1002, background: 'rgba(5,12,25,0.85)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
          >
            <div
              onClick={e => e.stopPropagation()}
              style={{ background: '#0D1E33', border: `1.5px solid ${d.accent}44`, borderTop: `3px solid ${d.accent}`, borderRadius: 14, width: '100%', maxWidth: 860, maxHeight: '88vh', overflowY: 'auto', padding: '24px 28px' }}
            >
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 4, height: 26, borderRadius: 2, background: d.accent, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontFamily: Fnt.mono, fontSize: 10, fontWeight: 700, color: d.accent, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 2 }}>{d.num}</div>
                    <div style={{ fontFamily: Fnt.syne, fontWeight: 700, fontSize: 17, color: '#E8F0F8' }}>{d.title}</div>
                  </div>
                </div>
                <button onClick={() => setModuleModal(null)} style={{ background: 'rgba(139,160,180,.12)', border: '1px solid rgba(139,160,180,.25)', borderRadius: 6, padding: '4px 12px', color: C.grey, fontFamily: Fnt.mono, fontSize: 11, cursor: 'pointer' }}>ESC ✕</button>
              </div>

              {/* Stats ticker */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
                {d.stats.map((s, i) => (
                  <div key={i} style={{ background: 'rgba(0,0,0,.3)', borderRadius: 6, padding: '6px 12px' }}>
                    <div style={{ fontFamily: Fnt.dm, fontSize: 9, fontWeight: 700, color: C.grey, textTransform: 'uppercase', letterSpacing: '.05em' }}>{s.lbl}</div>
                    <div style={{ fontFamily: Fnt.mono, fontSize: 13, fontWeight: 700, color: C.amber }}>{s.val}</div>
                  </div>
                ))}
              </div>

              {/* Sections */}
              {d.sections.map((sec, si) => (
                <div key={si} style={{ marginBottom: 22 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <div style={{ width: 3, height: 13, borderRadius: 2, background: d.accent, flexShrink: 0 }} />
                    <div style={{ fontFamily: Fnt.syne, fontWeight: 700, fontSize: 12, color: d.accent, textTransform: 'uppercase', letterSpacing: '.06em' }}>{sec.title}</div>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,.2)', border: `1px solid ${d.accent}22`, borderRadius: 8, overflow: 'hidden' }}>
                    {sec.rows.map(([label, val], ri) => (
                      <div key={ri} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '8px 14px', borderBottom: ri < sec.rows.length - 1 ? '1px solid rgba(139,160,180,.08)' : 'none', background: ri % 2 === 0 ? 'transparent' : 'rgba(255,255,255,.02)' }}>
                        <div style={{ fontFamily: Fnt.dm, fontSize: 11, color: C.grey, flexShrink: 0 }}>{label}</div>
                        <div style={{ fontFamily: Fnt.mono, fontSize: 11, fontWeight: 700, color: C.white, textAlign: 'right' }}>{val}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* SUBSTRATE FLOW STRIP */}
      <div style={{ marginTop: 20 }}>
        <SubstrateFlowStrip
          stageLabel="Substrate Flow — S0 Feedstock → S1 Mechanical Output"
          inflows={S1_INFLOWS}
          outflows={S1_OUTFLOWS}
        />
      </div>

      <S1ResidueCards />

      {/* ── ACTION BUTTONS ── */}
      {site && (site.efb_enabled || site.opdc_enabled || site.pos_enabled) && (
        <div style={{ margin: '16px 28px 8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <div style={{ fontFamily: Fnt.dm, fontSize: 12, fontWeight: 700, color: C.grey, marginRight: 4 }}>Open detailed view:</div>
            {[
              { key: 'efb',  name: 'EFB',  accent: C.teal,    enabledKey: 'efb_enabled'  },
              { key: 'opdc', name: 'OPDC', accent: C.amber,   enabledKey: 'opdc_enabled' },
              { key: 'pos',  name: 'POS',  accent: '#3B82F6', enabledKey: 'pos_enabled'  },
            ].filter(r => site?.[r.enabledKey]).map(r => (
              <button
                key={r.key}
                onClick={() => setActiveModal({ residue: r.key, tab: 0 })}
                style={{
                  padding: '8px 18px',
                  background: `${r.accent}18`,
                  border: `1.5px solid ${r.accent}66`,
                  borderRadius: 7,
                  fontFamily: Fnt.dm,
                  fontSize: 13,
                  fontWeight: 700,
                  color: r.accent,
                  cursor: 'pointer',
                  letterSpacing: '.02em',
                  transition: 'background .15s',
                }}
              >
                {r.name} Detail \u2192
              </button>
            ))}
            <button
              onClick={() => setActiveModal({ residue: 'combined', tab: 0 })}
              style={{
                padding: '8px 18px',
                background: 'rgba(0,162,73,.1)',
                border: '1.5px solid rgba(0,162,73,.4)',
                borderRadius: 7,
                fontFamily: Fnt.dm,
                fontSize: 13,
                fontWeight: 700,
                color: C.green,
                cursor: 'pointer',
                letterSpacing: '.02em',
              }}
            >
              All Residues Combined
            </button>
            <button
              onClick={() => window.open('/s1-engineering-print?print', '_blank')}
              style={{
                padding: '8px 18px',
                background: 'rgba(0,137,123,.1)',
                border: '1.5px solid rgba(0,137,123,.4)',
                borderRadius: 7,
                fontFamily: Fnt.dm,
                fontSize: 13,
                fontWeight: 700,
                color: C.teal,
                cursor: 'pointer',
                letterSpacing: '.02em',
              }}
            >
              &#128196; Complete Engineering — Print / PDF
            </button>
          </div>
        </div>
      )}

      <div className="content">
        {/* MODULE GRID */}
        <div className="sec-title st-teal">Select A Module</div>
        <div className="module-grid">
          {modules.map((m, i) => (
            <div
              key={i}
              className="module-btn"
              style={{ '--accent': m.accent }}
              onClick={() => m.key && setModuleModal(m.key)}
            >
              <span className="mb-status ms-live">Live ↗</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className="mb-icon" style={{ background: `${m.accent}22`, color: m.accent }}>{m.icon}</div>
                <div>
                  <div className="mb-num">{m.num}</div>
                  <div className="mb-title">{m.title}</div>
                </div>
              </div>
              <div className="mb-desc">{m.desc}</div>
              <div className="mb-tags">{m.tags.map((t, j) => <span key={j} className="mb-tag">{t}</span>)}</div>
            </div>
          ))}
        </div>

        {/* ── FLOOR PLAN PRINT BUTTONS ── */}
        <div style={{ marginTop: 20, marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{ width: 3, height: 14, borderRadius: 2, background: C.teal, flexShrink: 0 }} />
            <div style={{ fontFamily: Fnt.syne, fontWeight: 700, fontSize: 13, color: C.teal, textTransform: 'uppercase', letterSpacing: '.06em' }}>
              Floor Plan Print / PDF
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              onClick={() => window.open('/s1-floor-plan-print?line=all&print', '_blank')}
              style={{
                padding: '8px 18px',
                background: 'rgba(0,137,123,.12)',
                border: '1.5px solid rgba(0,137,123,.45)',
                borderRadius: 7,
                fontFamily: Fnt.dm,
                fontSize: 13,
                fontWeight: 700,
                color: C.teal,
                cursor: 'pointer',
                letterSpacing: '.02em',
              }}
            >
              &#128196; All Residues Combined
            </button>
            {site?.efb_enabled && (
              <button
                onClick={() => window.open('/s1-floor-plan-print?line=efb&print', '_blank')}
                style={{
                  padding: '8px 18px',
                  background: `${C.teal}14`,
                  border: `1.5px solid ${C.teal}55`,
                  borderRadius: 7,
                  fontFamily: Fnt.dm,
                  fontSize: 13,
                  fontWeight: 700,
                  color: C.teal,
                  cursor: 'pointer',
                  letterSpacing: '.02em',
                }}
              >
                EFB Line
              </button>
            )}
            {site?.opdc_enabled && (
              <button
                onClick={() => window.open('/s1-floor-plan-print?line=opdc&print', '_blank')}
                style={{
                  padding: '8px 18px',
                  background: `${C.amber}14`,
                  border: `1.5px solid ${C.amber}55`,
                  borderRadius: 7,
                  fontFamily: Fnt.dm,
                  fontSize: 13,
                  fontWeight: 700,
                  color: C.amber,
                  cursor: 'pointer',
                  letterSpacing: '.02em',
                }}
              >
                OPDC Line
              </button>
            )}
            {site?.pos_enabled && (
              <button
                onClick={() => window.open('/s1-floor-plan-print?line=pos&print', '_blank')}
                style={{
                  padding: '8px 18px',
                  background: 'rgba(59,130,246,.12)',
                  border: '1.5px solid rgba(59,130,246,.4)',
                  borderRadius: 7,
                  fontFamily: Fnt.dm,
                  fontSize: 13,
                  fontWeight: 700,
                  color: '#3B82F6',
                  cursor: 'pointer',
                  letterSpacing: '.02em',
                }}
              >
                POS Line
              </button>
            )}
          </div>
        </div>

        {/* GUARDRAILS */}
        <div className="sec-title st-red" style={{ marginTop: 32 }}>9 Hard Guardrails — S1 Processing</div>
        <div className="guardrail-grid">
          {guardrails.map((g, i) => {
            const colors = { red: C.red, amber: C.amber, teal: C.teal };
            const color = colors[g.cls] || C.teal;
            return (
              <div key={i} className="guardrail">
                <div className="gr-icon" style={{ background: `${color}22`, color }}>{g.icon}</div>
                <div>
                  <div className="gr-lbl">{g.label}</div>
                  <div className="gr-val" style={{ color }}>{g.val}</div>
                  <div className="gr-note">{g.note}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* STREAMS SUMMARY */}
        <div className="sec-title st-teal" style={{ marginTop: 32 }}>Daily Stream Summary</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {[
            { name: 'EFB', fresh: '300 t/day', dm: '112 t/day', mc: '62.5%', color: C.teal },
            { name: 'OPDC', fresh: '45 t/day', dm: '13.5 t/day', mc: '70%', color: C.amber },
            { name: 'POS', fresh: '30 t/day', dm: '6 t/day', mc: '82%', color: '#3B82F6' },
          ].map((st, i) => (
            <div key={i} style={{ background: C.navyCard, border: `1.5px solid ${C.bdrIdle}`, borderLeft: `4px solid ${st.color}`, borderRadius: 8, padding: '16px 20px' }}>
              <div style={{ fontFamily: Fnt.syne, fontSize: 14, fontWeight: 700, color: st.color, marginBottom: 10 }}>{st.name}</div>
              <div style={{ display: 'flex', gap: 16 }}>
                <div><div style={{ fontFamily: Fnt.dm, fontSize: 10, fontWeight: 700, color: C.grey, textTransform: 'uppercase', marginBottom: 3 }}>Fresh</div><div style={{ fontFamily: Fnt.mono, fontSize: 15, fontWeight: 700, color: C.amber }}>{st.fresh}</div></div>
                <div><div style={{ fontFamily: Fnt.dm, fontSize: 10, fontWeight: 700, color: C.grey, textTransform: 'uppercase', marginBottom: 3 }}>Dry Matter</div><div style={{ fontFamily: Fnt.mono, fontSize: 15, fontWeight: 700, color: C.teal }}>{st.dm}</div></div>
                <div><div style={{ fontFamily: Fnt.dm, fontSize: 10, fontWeight: 700, color: C.grey, textTransform: 'uppercase', marginBottom: 3 }}>MC</div><div style={{ fontFamily: Fnt.mono, fontSize: 15, fontWeight: 700, color: C.white }}>{st.mc}</div></div>
              </div>
            </div>
          ))}
        </div>

        {/* 1-PAGER LINK */}
        <div style={{ marginTop: 28, display: 'flex', justifyContent: 'flex-end' }}>
          <a
            href="/CFI_S0_Residue_Selector.html"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '10px 22px', borderRadius: 6,
              border: `1.5px solid ${C.teal}`,
              background: 'transparent', color: C.teal,
              fontFamily: Fnt.dm, fontSize: 13, fontWeight: 700,
              textDecoration: 'none', letterSpacing: '.02em',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = C.teal; e.currentTarget.style.color = C.navy; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.teal; }}
          >
            נ“„ View S0 Residue Selector 1-Pager
          </a>
        </div>
      </div>
      {activeModal != null && (
        <S1ResidueModal
          active={activeModal}
          onClose={() => setActiveModal(null)}
          site={site}
          calc={s1Calc}
        />
      )}
    </>
  );
}
