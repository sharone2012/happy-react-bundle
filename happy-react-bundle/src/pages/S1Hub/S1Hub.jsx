import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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
  ┌──────────────────────────────────────────────────────────────────┐
  │  S1C  EFB  PRE-PROCESSING  ·  10 nodes  ·  298 kW  ·  20 t/h  │
  └──────────────────────────────────────────────────────────────────┘

  [RH-EFB-101]──▶[CV-EFB-101]──▶[ETR-01  Trommel 50mm]──▶[OBM-01  Overband Magnet]
  Recip Feeder    Incline Apron   +3.0m · 11 kW             +3.5m · 3 kW
  7.5 kW          7.5 kW · 600mm                                    │
                                                                     ▼
  [BIN-EFB-201]◀──[EVS-01  Vib. Screen 2mm]◀──[EHM-01  Hammer Mill]◀──[EPR-01  Screw Press]
  Buffer 50m³      +4.0m · 7.5 kW · Oversize→HM  +4.0m · 37 kW        +3.2m · 37 kW
  +2.5m · 3 kW                                    SPRING ISO ONLY       ⚠ GATE B.G2
        │
        ▼
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
  ┌─────────────────────────────────────────────────────────────────────┐
  │  S1B  OPDC  PRE-PROCESSING  ·  10 nodes  ·  206 kW  ·  5 t/h    │
  │  Anti-bridging throughout · Paste form handling                   │
  └─────────────────────────────────────────────────────────────────────┘

  [RH-OPDC-101]──▶[CV-OPDC-101]──▶[OPR-01  Screw Press]
  Recip Feeder      Belt +3.5m       ⚠ CLASS A GATE — MC floor ≥ 40% LOCKED
  SS304 · 0.75 kW   1.1 kW · 500mm  Non-negotiable · pore damage above 40%
                                               │
                                               ▼
  [OLB-01  Lump Breaker]──▶[CV-OPDC-201]──▶[OTR-01  Trommel]──▶[ODR-01  Rotary Dryer]
  Twin-roll · 3 kW           Belt +1.5m      2.2 kW              11 kW · ⚠ MC ≤ 35%
  30mm output
                                                                          │
                                                                          ▼
  [OVS-01  Vib. Screen]◀──[OHM-01  Hammer Mill]──▶[BIN-OPDC-301  Product Bin]
  +0.5m · 2.2 kW             +0.8m · 22 kW SPRING ISO   ⚠ 24HR DWELL GATE
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

// ── GUARDRAILS ──
const guardrails = [
  { icon: '💧', label: 'MC ≥40%', val: 'LOCKED', cls: 'red', note: 'CLASS A · OPDC screw press' },
  { icon: '🔩', label: 'Fe <3,000', val: 'mg/kg DM', cls: 'amber', note: 'POS ICP-OES gate' },
  { icon: '🌿', label: 'ADL <12%', val: 'DM target', cls: 'teal', note: 'For BSF palatability' },
  { icon: '⚖', label: 'C:N 15–22', val: 'optimal', cls: 'teal', note: 'Post-S2 blend target' },
  { icon: '⚗', label: 'pH 4.0–5.0', val: 'range', cls: 'amber', note: 'POS pre-treatment' },
  { icon: '🧪', label: 'CEC >20', val: 'cmol/kg', cls: 'teal', note: 'Soil quality target' },
  { icon: '⚠', label: 'No Cr >20', val: 'mg/kg', cls: 'red', note: 'Heavy metal limit' },
  { icon: '🔧', label: 'Belt speed', val: 'locked at spec', cls: 'teal', note: 'Per equipment OEM' },
  { icon: '🌡', label: 'All temps', val: '<85°C', cls: 'amber', note: 'Motor + bearing limit' },
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
      { title: 'pH', val: '5.5–6.0', suffix: '', unit: 'Post-CaCO₃ Conditioning', dir: 'up' },
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
    num: 'Line 1', title: 'EFB Pre-Processing Line', accent: C.teal, icon: '⚙',
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
        ['Step 3', 'EPR-01 Screw Press + PKSA  ⚠ GATE B.G2 · MC floor 40%'],
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
    num: 'Line 2', title: 'OPDC Pre-Processing Line', accent: C.amber, icon: '⚙',
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
        ['⚠ CLASS A GATE', 'MC floor ≥ 40% LOCKED · NON-NEGOTIABLE'],
        ['Step 3', 'OLB-01 Lump Breaker → OTR-01 Trommel → ODR-01 Rotary Dryer'],
        ['Step 4', 'OHM-01 Hammer Mill (SPRING ISO) → OVS-01 Vib. Screen 3mm'],
        ['⚠ 24HR DWELL', 'BIN-OPDC-301 Product Bin · pH 8.0–9.0 required'],
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
    num: 'Line 3', title: 'POS Pre-Skimming Line', accent: '#3B82F6', icon: '💧',
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
        ['⚠ ICP-OES Fe GATE', 'Fe result sets CaCO₃ dose + S2 inclusion'],
        ['Step 3', 'DEC-SLD-101 Decanter Centrifuge (55 kW · 65% MC out)'],
        ['Step 4', 'CaCO₃ conditioning · pH 4.4 → 5.5–6.0'],
        ['Output', 'Cake ~405 t/mo · 65–70% MC · Gated · to S2'],
      ]},
      { title: 'Key Specs', rows: [
        ['MC In', '82%'], ['MC Out', '65–70%'],
        ['pH In', '4.4 (acidic)'], ['pH Out', '5.5–6.0'],
        ['Daily In', '~30 t FW'], ['Daily Out', '~13.5 t cake'],
        ['Fe Gate', 'ICP-OES protocol'], ['CaCO₃ Dose', '5–20% w/w'],
        ['Screen Reject', '→ EFB Line'], ['Filtrate', '→ POME system'],
      ]},
      { title: 'Equipment & Cost', rows: [
        ['Sludge Pit 15m³', '—'], ['Rotary Drum Screen', '—'],
        ['Decanter Centrifuge', '$80K–$150K RFQ'], ['Buffer Tank 15m³', '—'],
        ['Progressive Cavity Pump', '0.75 kW'], ['CaCO₃ Dosing', 'Batch manual'],
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
    num: 'FP', title: 'Combined Floor Plans', accent: C.teal, icon: '🏭',
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

// ─────────────────────────────────────────────────────────────────────────────
// S1 RESIDUE ROW — shows residues selected in S0, reads Redux s0.activeStreams
// ─────────────────────────────────────────────────────────────────────────────

const RESIDUE_DEFS = [
  {
    key: 'efb', abbr: 'EFB', label: 'Empty Fruit Bunches', tag: 'Zero Cost',
    accent: C.teal,
    mcIn: '62–82%', mcOut: '45–50%', cn: '60:1', tph: '20 t/h', nodes: 10, power: '298 kW',
    specs: [
      { code: 'B.1', lbl: 'Inlet MC',               val: '62.5 % wb',          flag: null },
      { code: 'B.2', lbl: 'Post-Press MC Target',     val: '45–50 % wb',         flag: null },
      { code: 'B.3', lbl: 'Particle Size Target (D90)',val: '≤ 2 mm',            flag: null },
      { code: 'B.4', lbl: 'Press Water Expelled',     val: '143 kg / t EFB',     flag: null },
      { code: 'B.5', lbl: 'Total Press Water',        val: '1,181 t / month',    flag: null },
      { code: 'B.6', lbl: 'Press Water Routing',      val: '→ POME Pond Only',   flag: null },
      { code: 'B.7', lbl: 'EFB Post-Press (FW)',      val: '7,081 t / month',    flag: 'green' },
      { code: 'B.G1', lbl: 'Particle Size Gate',      val: 'D90 ≤ 2mm — enter shift result', flag: 'amber' },
      { code: 'B.G2', lbl: 'Post-Press MC Gate',      val: 'Operator confirms ≤ 50%',        flag: 'amber' },
    ],
  },
  {
    key: 'opdc', abbr: 'OPDC', label: 'Decanter Cake', tag: 'Zero Cost',
    accent: C.amber,
    mcIn: '70–75%', mcOut: '≤35%', cn: '20:1', tph: '5 t/h', nodes: 10, power: '206 kW',
    specs: [
      { code: 'C.1', lbl: 'Inlet MC',                  val: '70–75 % wb',              flag: null },
      { code: 'C.2', lbl: 'Post-Press MC Floor (CLASS A)', val: '≥ 40 % wb — LOCKED', flag: 'red' },
      { code: 'C.3', lbl: 'Buffer Dwell (Mandatory Min)', val: '≥ 24 hrs',             flag: 'red' },
      { code: 'C.4', lbl: 'Post-Buffer pH Target',      val: '8.0–9.0',               flag: null },
      { code: 'C.5', lbl: 'OPDC Filtrate Out',          val: '180 t / month',          flag: null },
      { code: 'C.6', lbl: 'Filtrate Routing',           val: '→ POME Pond Only',       flag: null },
      { code: 'C.7', lbl: 'OPDC Post-Press (FW)',       val: '1,076 t / month',        flag: 'green' },
      { code: 'C.G1', lbl: 'MC Floor — CLASS A',        val: 'Math.max(40, reading)',  flag: 'amber' },
      { code: 'C.G2', lbl: 'pH Gate',                   val: 'No blend until 8.0–9.0', flag: 'amber' },
      { code: 'C.G3', lbl: 'Buffer Dwell Gate',         val: 'Enter actual hours logged', flag: 'amber' },
    ],
  },
  {
    key: 'pos', abbr: 'POS', label: 'Palm Oil Sludge', tag: 'ICP-OES Required',
    accent: '#3B82F6',
    mcIn: '82%', mcOut: '65–70%', cn: '19:1', tph: '1.25 t/h', nodes: '4–7', power: '62 kW',
    specs: [
      { code: 'D.1', lbl: 'Fe Result (ICP-OES, mg/kg DM)',  val: 'ENTER RESULT',      flag: 'blue' },
      { code: 'D.2', lbl: 'Inclusion Rate (Auto-Calculated)', val: '— Awaiting Fe',   flag: 'blue' },
      { code: 'D.3', lbl: 'POS Inlet MC',                    val: '82 % wb',          flag: null },
      { code: 'D.4', lbl: 'POS Ash Content',                 val: '28 % DM',          flag: null },
      { code: 'D.5', lbl: 'POS Crude Protein',               val: '11 % DM',          flag: null },
      { code: 'D.6', lbl: 'POS Ether Extract (EE)',          val: '10 % DM',          flag: null },
      { code: 'D.7', lbl: 'POS To Blend (FW)',               val: 'DATA GAP',         flag: 'red' },
      { code: 'D.8',  lbl: 'Fe < 3,000 mg/kg',   val: '→ 20% WW inclusion', flag: null },
      { code: 'D.9',  lbl: 'Fe 3,000–5,000',      val: '→ 10–15% WW',       flag: null },
      { code: 'D.10', lbl: 'Fe 5,000–8,000',      val: '→ 5–10% WW',        flag: null },
      { code: 'D.11', lbl: 'Fe > 8,000',          val: '→ CaCO₃ amendment req.', flag: 'red' },
    ],
  },
  {
    key: 'pmf', abbr: 'PMF', label: 'Palm Mesocarp Fibre', tag: 'Zero Cost',
    accent: '#9B59B6',
    mcIn: '35–45%', mcOut: '30–40%', cn: '55:1', tph: '—', nodes: '—', power: '—',
    specs: [
      { code: 'E.1', lbl: 'Inlet MC',         val: '35–45 % wb',    flag: null },
      { code: 'E.2', lbl: 'Lignin ADL',        val: '26–31 % DM',    flag: null },
      { code: 'E.3', lbl: 'Crude Protein',     val: '4.5–5.5 % DM',  flag: null },
      { code: 'E.4', lbl: 'C:N Ratio',         val: '~55:1',         flag: null },
      { code: 'E.5', lbl: 'Pre-Treatment',     val: 'S2 Chemical required', flag: 'amber' },
    ],
  },
  {
    key: 'pome', abbr: 'POME', label: 'POME (Liquid)', tag: 'Emissions Avoidance',
    accent: '#60A5FA',
    mcIn: '95–98%', mcOut: 'n/a', cn: '—', tph: '—', nodes: '—', power: '—',
    specs: [
      { code: 'F.1', lbl: 'Stream Type',     val: 'Liquid only — not in solid blend', flag: null },
      { code: 'F.2', lbl: 'pH',              val: '3.5–4.5 (highly acidic)',          flag: 'red' },
      { code: 'F.3', lbl: 'BOD',             val: '25,000–35,000 mg/L',               flag: null },
      { code: 'F.4', lbl: 'CH₄ Avoidance',  val: 'Primary value pathway',            flag: 'green' },
      { code: 'F.5', lbl: 'Routing',         val: '→ Biogas / Biofertiliser',         flag: null },
    ],
  },
  {
    key: 'pke', abbr: 'PKE', label: 'Palm Kernel Expeller', tag: '$160/t Purchased',
    accent: '#F59E0B',
    mcIn: '10–12%', mcOut: '10–12%', cn: '30:1', tph: '—', nodes: '—', power: '—',
    specs: [
      { code: 'G.1', lbl: 'Cost',           val: '$160 / tonne — purchased', flag: 'amber' },
      { code: 'G.2', lbl: 'Inlet MC',       val: '10–12 % wb (already dry)', flag: null },
      { code: 'G.3', lbl: 'Crude Protein',  val: '14–16 % DM',               flag: null },
      { code: 'G.4', lbl: 'C:N Ratio',      val: '~30:1',                    flag: null },
      { code: 'G.5', lbl: 'Use Case',       val: 'N-supplement when OPDC short', flag: null },
    ],
  },
  {
    key: 'opf', abbr: 'OPF', label: 'Oil Palm Fronds', tag: 'Seasonal · Zero Cost',
    accent: '#34D399',
    mcIn: '60–70%', mcOut: '50–60%', cn: '40:1', tph: '—', nodes: '—', power: '—',
    specs: [
      { code: 'H.1', lbl: 'Inlet MC',      val: '60–70 % wb (seasonal)',   flag: null },
      { code: 'H.2', lbl: 'Lignin ADL',    val: '18–22 % DM',              flag: null },
      { code: 'H.3', lbl: 'C:N Ratio',     val: '~40:1',                   flag: null },
      { code: 'H.4', lbl: 'Availability',  val: 'Pruning schedule only',   flag: 'amber' },
      { code: 'H.5', lbl: 'Pre-Treatment', val: 'Shredding + size reduction required', flag: null },
    ],
  },
  {
    key: 'opt', abbr: 'OPT', label: 'Oil Palm Trunks', tag: 'Replanting Only',
    accent: '#6EE7B7',
    mcIn: '65–75%', mcOut: '—', cn: '80:1', tph: '—', nodes: '—', power: '—',
    specs: [
      { code: 'I.1', lbl: 'Inlet MC',      val: '65–75 % wb',             flag: null },
      { code: 'I.2', lbl: 'Lignin ADL',    val: '28–34 % DM (very high)', flag: 'amber' },
      { code: 'I.3', lbl: 'C:N Ratio',     val: '~80:1 (C-heavy)',        flag: 'amber' },
      { code: 'I.4', lbl: 'Availability',  val: 'Replanting cycle only',  flag: 'amber' },
      { code: 'I.5', lbl: 'Pre-Treatment', val: 'Chipper + extended hydrolysis req.', flag: 'red' },
    ],
  },
];

// Flag colours matching S0 design spec
const FLAG_COLORS = {
  red:   '#E84040',
  amber: '#F5A623',
  green: '#00A249',
  blue:  '#3B82F6',
};

function ResidueCard({ def, volume, selected, expanded, onToggleExpand }) {
  const ac = def.accent;
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* CARD — S0 toggleCard design */}
      <div
        onClick={onToggleExpand}
        style={{
          background: selected ? 'rgba(64,215,197,0.15)' : '#000000',
          border: `1.5px solid ${selected ? 'rgba(64,215,197,0.60)' : '#1E6B8C'}`,
          borderRadius: expanded ? '8px 8px 0 0' : 8,
          borderBottom: expanded ? 'none' : undefined,
          padding: '10px 13px',
          cursor: 'pointer',
          transition: 'all 0.12s',
          opacity: selected ? 1 : 0.55,
          minHeight: 52,
          flex: 1,
        }}
      >
        {/* Top row: abbr + tag + expand arrow */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>
          <span style={{ fontFamily: Fnt.syne, fontWeight: 700, fontSize: 12, color: selected ? ac : '#B0BEC5', letterSpacing: '0.05em' }}>
            {def.abbr}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {selected && (
              <span style={{ fontFamily: Fnt.mono, fontWeight: 700, fontSize: 9, padding: '1px 6px', borderRadius: 3, background: ac + '22', border: `1px solid ${ac}55`, color: ac }}>
                {def.tag}
              </span>
            )}
            <span style={{ color: selected ? 'rgba(64,215,197,0.60)' : '#1E6B8C', fontSize: 10, lineHeight: 1 }}>
              {expanded ? '▲' : '▼'}
            </span>
          </div>
        </div>
        {/* Full name */}
        <div style={{ fontFamily: Fnt.dm, fontWeight: 700, fontSize: 13, color: selected ? '#F5A623' : '#B0BEC5', marginBottom: 4 }}>
          {def.label}
        </div>
        {/* Volume + quick stats */}
        {selected && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 2 }}>
            {volume != null && (
              <span style={{ fontFamily: Fnt.mono, fontWeight: 700, fontSize: 10, color: '#40D7C5', background: 'rgba(64,215,197,0.10)', border: '1px solid rgba(64,215,197,0.25)', borderRadius: 3, padding: '1px 6px' }}>
                {typeof volume === 'number' ? `${Math.round(volume).toLocaleString()} t/mo` : volume}
              </span>
            )}
            {def.mcIn !== '—' && (
              <span style={{ fontFamily: Fnt.mono, fontSize: 9, color: '#A8BDD0', background: 'rgba(168,189,208,0.07)', border: '1px solid rgba(168,189,208,0.18)', borderRadius: 3, padding: '1px 5px' }}>
                MC {def.mcIn}
              </span>
            )}
            {def.cn !== '—' && (
              <span style={{ fontFamily: Fnt.mono, fontSize: 9, color: '#A8BDD0', background: 'rgba(168,189,208,0.07)', border: '1px solid rgba(168,189,208,0.18)', borderRadius: 3, padding: '1px 5px' }}>
                C:N {def.cn}
              </span>
            )}
          </div>
        )}
      </div>

      {/* EXPANDED DETAIL PANEL */}
      {expanded && (
        <div style={{
          background: '#070D1A',
          border: `1.5px solid ${selected ? 'rgba(64,215,197,0.60)' : '#1E6B8C'}`,
          borderTop: 'none',
          borderRadius: '0 0 8px 8px',
          padding: '10px 13px 12px',
        }}>
          {/* Stat chips row */}
          {(def.tph !== '—' || def.power !== '—') && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
              {def.tph   !== '—' && <span style={{ fontFamily: Fnt.mono, fontSize: 9, fontWeight: 700, color: '#40D7C5', background: 'rgba(64,215,197,0.08)', border: '1px solid rgba(64,215,197,0.25)', borderRadius: 3, padding: '2px 7px' }}>{def.tph}</span>}
              {def.nodes !== '—' && <span style={{ fontFamily: Fnt.mono, fontSize: 9, fontWeight: 700, color: '#A8BDD0', background: 'rgba(168,189,208,0.07)', border: '1px solid rgba(168,189,208,0.18)', borderRadius: 3, padding: '2px 7px' }}>{def.nodes} nodes</span>}
              {def.power !== '—' && <span style={{ fontFamily: Fnt.mono, fontSize: 9, fontWeight: 700, color: '#A8BDD0', background: 'rgba(168,189,208,0.07)', border: '1px solid rgba(168,189,208,0.18)', borderRadius: 3, padding: '2px 7px' }}>{def.power}</span>}
              {def.mcOut !== '—' && <span style={{ fontFamily: Fnt.mono, fontSize: 9, fontWeight: 700, color: '#F5A623', background: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.25)', borderRadius: 3, padding: '2px 7px' }}>Out {def.mcOut}</span>}
            </div>
          )}
          {/* Spec table */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {def.specs.map((sp, i) => {
              const flagColor = sp.flag ? FLAG_COLORS[sp.flag] : null;
              return (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8, padding: '2px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <span style={{ fontFamily: Fnt.mono, fontSize: 10, color: '#4A6075', flexShrink: 0, minWidth: 32 }}>{sp.code}</span>
                  <span style={{ fontFamily: Fnt.dm, fontSize: 10, color: '#8BA0B4', flex: 1 }}>{sp.lbl}</span>
                  <span style={{ fontFamily: Fnt.mono, fontWeight: 700, fontSize: 10, color: flagColor || '#A8BDD0', textAlign: 'right', flexShrink: 0 }}>{sp.val}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function S1ResidueRow({ site, derived }) {
  const activeStreams = useSelector(s => s.s0.activeStreams);
  const [showAll, setShowAll] = useState(false);
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (key) => setExpanded(prev => ({ ...prev, [key]: !prev[key] }));

  // Volume lookup from MillContext derived/site
  const volumeFor = (key) => {
    if (key === 'efb')  return derived?.monthlyEfb  ?? null;
    if (key === 'opdc') return derived?.monthlyOpdc ?? null;
    if (key === 'pos')  return derived?.monthlyPos  ?? null;
    const raw = site?.[`${key}_volume_t`];
    return raw != null ? parseFloat(raw) : null;
  };

  const visibleDefs = showAll
    ? RESIDUE_DEFS
    : RESIDUE_DEFS.filter(d => activeStreams[d.key]);

  const selectedCount = RESIDUE_DEFS.filter(d => activeStreams[d.key]).length;

  if (!showAll && selectedCount === 0) return null;

  return (
    <div style={{ margin: '20px 28px 0' }}>
      {/* Section header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 3, height: 14, borderRadius: 2, background: C.teal, flexShrink: 0 }} />
          <div style={{ fontFamily: Fnt.syne, fontWeight: 700, fontSize: 13, color: C.teal, textTransform: 'uppercase', letterSpacing: '.06em' }}>
            S0 Residues Selected
          </div>
          {selectedCount > 0 && (
            <span style={{ fontFamily: Fnt.mono, fontWeight: 700, fontSize: 10, color: C.teal, background: 'rgba(64,215,197,0.12)', border: '1px solid rgba(64,215,197,0.30)', borderRadius: 4, padding: '1px 7px' }}>
              {selectedCount} active
            </span>
          )}
        </div>
        <button
          onClick={() => setShowAll(v => !v)}
          style={{
            fontFamily: Fnt.mono, fontWeight: 700, fontSize: 10,
            background: showAll ? 'rgba(64,215,197,0.15)' : 'rgba(168,189,208,0.07)',
            border: `1px solid ${showAll ? 'rgba(64,215,197,0.60)' : 'rgba(168,189,208,0.25)'}`,
            borderRadius: 5, color: showAll ? C.teal : '#8BA0B4',
            padding: '4px 12px', cursor: 'pointer', transition: 'all 0.12s',
          }}
        >
          {showAll ? 'Selected Only ▲' : 'All Residues ▼'}
        </button>
      </div>

      {/* Residue card grid — auto-fit, max 5 columns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(195px, 1fr))', gap: 10, alignItems: 'start' }}>
        {visibleDefs.map(def => (
          <ResidueCard
            key={def.key}
            def={def}
            selected={!!activeStreams[def.key]}
            expanded={!!expanded[def.key]}
            volume={volumeFor(def.key)}
            onToggleExpand={() => toggleExpand(def.key)}
          />
        ))}
      </div>
    </div>
  );
}

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
    { key: 'efb',  num: 'Line 1', title: 'EFB Pre-Processing Line', desc: '10-node mechanical line · 20 t/h · 600mm belt · 298 kW · Shred → Press → Mill → Screen', accent: C.teal, icon: '⚙', tags: ['10 Machines', '600mm Belt', '20 t/h', 'Trommel + Hammer Mill'] },
    { key: 'opdc', num: 'Line 2', title: 'OPDC Pre-Processing Line', desc: '10-node mechanical line · 5 t/h · 500mm belt · 206 kW · CLASS A Gate · 24hr Dwell', accent: C.amber, icon: '⚙', tags: ['10 Machines', '500mm Belt', 'CLASS A', '24hr Dwell Gate'] },
    { key: 'pos',  num: 'Line 3', title: 'POS Pre-Skimming Line', desc: '4–7 node liquid/semi line · 1.25 t/h · ICP-OES Fe Gate · Decanter · Filter Press', accent: '#3B82F6', icon: '💧', tags: ['4–7 Machines', 'ICP-OES Fe', 'Decanter', 'Filter Press'] },
    { key: 'eng',  num: 'Eng', title: 'Engineering Overview', desc: '24 equipment nodes · 3 processing lines · Full engineering spec with CAPEX + OPEX + Greenhouse + Guardrails', accent: C.grey, icon: '📐', tags: ['24 Nodes', '3 Lines', 'Full Spec'] },
    { key: 'fp',   num: 'FP', title: 'Combined Floor Plans', desc: 'Tabbed floor plans · EFB · OPDC · POS · Building dimensions · Node cards with specs', accent: C.teal, icon: '🏭', tags: ['3 Floor Plans', 'Node Cards', 'Dimensions'] },
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

      {/* S0 RESIDUE ROW — streams selected in S0, wired to Redux */}
      <S1ResidueRow site={site} derived={derived} />

      <div style={{ margin: '20px 28px 0' }}>
        {/* Quick-access link grid (3 × 2) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginTop: 14 }}>
          {QUICK_LINKS.map((lnk, i) => (
            <div
              key={i}
              onClick={() => setQuickModal(lnk.key)}
              style={{
                background: C.navyDeep,
                border: `1.5px solid ${lnk.live ? lnk.accent + '55' : 'rgba(139,160,180,.2)'}`,
                borderRadius: 8,
                padding: '10px 14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
              }}
            >
              <div>
                <div style={{ fontFamily: Fnt.dm, fontSize: 12, fontWeight: 700, color: C.white, marginBottom: 2 }}>{lnk.title}</div>
                <div style={{ fontFamily: Fnt.dm, fontSize: 10, color: C.grey }}>{lnk.sub}</div>
              </div>
              <div style={{
                flexShrink: 0,
                padding: '3px 8px',
                borderRadius: 4,
                fontFamily: Fnt.mono,
                fontSize: 9,
                fontWeight: 700,
                background: lnk.live ? 'rgba(61,203,122,.12)' : 'rgba(245,166,35,.1)',
                border: `1px solid ${lnk.live ? 'rgba(61,203,122,.4)' : 'rgba(245,166,35,.3)'}`,
                color: lnk.live ? '#3DCB7A' : C.amber,
                whiteSpace: 'nowrap',
              }}>
                {lnk.live ? 'LIVE ✓' : 'COMING SOON'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── PROCESS ENGINEERING ROW ── */}
      <div style={{ margin: '20px 28px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div style={{ width: 3, height: 14, borderRadius: 2, background: C.teal, flexShrink: 0 }} />
          <div style={{ fontFamily: Fnt.syne, fontWeight: 700, fontSize: 13, color: C.teal, textTransform: 'uppercase', letterSpacing: '.06em' }}>
            Process Engineering
          </div>
          <div style={{ fontFamily: Fnt.dm, fontSize: 11, color: C.grey, marginLeft: 4 }}>All residues shown · S0 selection dims inactive lines</div>
        </div>
        {[
          {
            key: 'efb', name: 'EFB', accent: C.teal,
            fw: site ? `${Math.round(s1Calc.efbFW).toLocaleString()} t/mo` : '\u2014',
            dm: site ? `${Math.round(s1Calc.efbDM).toLocaleString()} t DM/mo` : '\u2014',
            mcIn: '62.5%', mcOut: '47.5%',
            nodes: ['Shredder', 'Hammer Mill', 'Screw Press', 'Buffer Silo'],
            nodesSub: ['450 kW', '37 kW', '110 kW', '5,000 L'],
            outLabel: '\u226435% MC', outSub: 'After press',
          },
          {
            key: 'opdc', name: 'OPDC', accent: C.amber,
            fw: site ? `${Math.round(s1Calc.opdcFW).toLocaleString()} t/mo` : '\u2014',
            dm: site ? `${Math.round(s1Calc.opdcDM).toLocaleString()} t DM/mo` : '\u2014',
            mcIn: '70\u201375%', mcOut: '\u226435%',
            nodes: ['Screw Press', 'Buffer Silo'],
            nodesSub: ['110 kW', '5,000 L'],
            outLabel: '\u226435% MC', outSub: 'CLASS A gate',
          },
          {
            key: 'pos', name: 'POS', accent: '#3B82F6',
            fw: site ? `${Math.round(s1Calc.posFW).toLocaleString()} t/mo` : '\u2014',
            dm: site ? `${Math.round(s1Calc.posDM).toLocaleString()} t DM/mo` : '\u2014',
            mcIn: '82%', mcOut: '65\u201370%',
            nodes: ['Centrifuge', 'Decanter', 'POME Sep', 'Buffer Tank'],
            nodesSub: ['15 kW', '37 kW', '7.5 kW', '10,000 L'],
            outLabel: '65\u201370% MC', outSub: 'Post-skim',
          },
        ].map((r) => {
          const enabled = site?.[`${r.key}_enabled`] ?? false;
          return (
            <div key={r.key} style={{
              display: 'flex',
              background: C.navyCard,
              border: `1.5px solid ${C.bdrIdle}`,
              borderLeft: `4px solid ${r.accent}`,
              borderRadius: 10,
              overflow: 'hidden',
              marginBottom: 10,
              opacity: enabled ? 1 : 0.45,
              transition: 'opacity .2s',
            }}>
              {/* Zone A: Stream data */}
              <div style={{
                width: 260,
                flexShrink: 0,
                padding: '16px 20px',
                borderRight: '2px solid rgba(30,107,140,0.3)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: 8,
              }}>
                <div style={{ fontFamily: Fnt.syne, fontSize: 14, fontWeight: 700, color: C.white, marginBottom: 2 }}>{r.name}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <div style={{ fontFamily: Fnt.mono, fontSize: 14, fontWeight: 700, color: C.amber }}>{r.fw}</div>
                  <div style={{ fontFamily: Fnt.dm, fontSize: 12, color: 'rgba(168,189,208,0.75)' }}>FW / month</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <div style={{ fontFamily: Fnt.mono, fontSize: 14, fontWeight: 700, color: C.teal }}>{r.dm}</div>
                  <div style={{ fontFamily: Fnt.dm, fontSize: 12, color: 'rgba(168,189,208,0.75)' }}>dry matter</div>
                </div>
                <div style={{ display: 'flex', gap: 20, marginTop: 4 }}>
                  <div>
                    <div style={{ fontFamily: Fnt.dm, fontSize: 9, fontWeight: 700, color: C.grey, textTransform: 'uppercase', marginBottom: 2 }}>MC IN</div>
                    <div style={{ fontFamily: Fnt.mono, fontSize: 13, fontWeight: 700, color: C.amber }}>{r.mcIn}</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: Fnt.dm, fontSize: 9, fontWeight: 700, color: C.grey, textTransform: 'uppercase', marginBottom: 2 }}>MC OUT</div>
                    <div style={{ fontFamily: Fnt.mono, fontSize: 13, fontWeight: 700, color: C.amber }}>{r.mcOut}</div>
                  </div>
                </div>
              </div>
              {/* Zone B: Process flow nodes */}
              <div style={{
                flex: 1,
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                overflowX: 'auto',
              }}>
                {r.nodes.flatMap((node, ni) => {
                  const nodeEl = (
                    <div key={`node-${ni}`} style={{
                      flexShrink: 0,
                      background: 'rgba(0,0,0,.3)',
                      border: `1.5px solid ${r.accent}33`,
                      borderRadius: 8,
                      padding: '10px 16px',
                      textAlign: 'center',
                    }}>
                      <div style={{ fontFamily: Fnt.dm, fontSize: 12, fontWeight: 700, color: C.white, whiteSpace: 'nowrap' }}>{node}</div>
                      <div style={{ fontFamily: Fnt.dm, fontSize: 11, color: 'rgba(168,189,208,0.75)', marginTop: 3, whiteSpace: 'nowrap' }}>{r.nodesSub[ni]}</div>
                    </div>
                  );
                  if (ni < r.nodes.length - 1) {
                    return [nodeEl, (
                      <svg key={`arrow-${ni}`} width="48" height="20" style={{ flexShrink: 0 }}>
                        <path d="M0,10 L44,10 M38,4 L44,10 L38,16" stroke={r.accent} strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )];
                  }
                  return [nodeEl];
                })}
              </div>
              {/* Zone C: Output */}
              <div style={{
                width: 120,
                flexShrink: 0,
                padding: '16px 14px',
                borderLeft: '2px solid rgba(30,107,140,0.3)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'flex-end',
                gap: 4,
              }}>
                <div style={{ fontFamily: Fnt.dm, fontSize: 9, fontWeight: 700, color: C.grey, textTransform: 'uppercase', letterSpacing: '.05em' }}>OUTPUT</div>
                <div style={{ fontFamily: Fnt.mono, fontSize: 14, fontWeight: 700, color: r.accent, textAlign: 'right' }}>{r.outLabel}</div>
                <div style={{ fontFamily: Fnt.dm, fontSize: 11, color: 'rgba(168,189,208,0.75)', textAlign: 'right' }}>{r.outSub}</div>
              </div>
            </div>
          );
        })}
      </div>

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
              <span className="mb-status ms-live">Live ✓</span>
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
            📄 View S0 Residue Selector 1-Pager
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
