import { useState, useMemo, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import './S1Hub.css';
import S1LineDetailModal from './S1LineDetailModal.jsx';
import S1QuickLinkModal from './S1QuickLinkModal.jsx';
import S1ModuleDetailModal from './S1ModuleDetailModal.jsx';
import S1MassBalanceTable from './S1MassBalanceTable.jsx';
import S0ResidueStreamCards from './S0ResidueStreamCards.jsx';
import S1ResidueCards from "../../components/S1ResidueCards/S1ResidueCards.jsx";
import S1ProcessEngineering from "../../components/S1ProcessEngineering/S1ProcessEngineering.jsx";
import {
  C, Fnt, S1_CSS, CANONICAL_MC,
  S1Breadcrumb, SubstrateFlowStrip,
} from "../../components/S1Shared/S1Shared.jsx";
import { useMill } from "../../contexts/MillContext";
import S1ResidueModal from "../../components/S1ResidueModal/S1ResidueModal.jsx";
import S1ResidueWindow from './S1ResidueWindow.jsx';

/*
 * S1Hub.jsx — S1 Mechanical Pre-Processing Hub (S3Landing pattern)
 * Route: /s1
 */

// ── TABS ──
const TABS = [
  { key: 'overview',    label: 'Overview — S0 Selected Residues' },
  { key: 'engineering', label: 'Engineering' },
  { key: 'machinery',   label: 'Machinery' },
  { key: 'handoff',     label: 'Handoff to S2' },
];
const ENG_SUBTABS = [
  { key: 'flow',  label: 'Display Flow' },
  { key: 'ascii', label: 'ASCII Flow' },
];

// ── ASCII FLOW CONTENT ──
const S1_ASCII_FLOWS = {
  efb: `EFB LINE — S1A PRE-PROCESSING
══════════════════════════════════════════════════════════════
 Feed: EFB @ 62.5% MC · 300 t/day fresh weight · 20 t/h

 MILL EXIT ──┐
             │
   ┌─────────▼────────────────────────────────────────────┐
   │  TR-EFB-101  TRUCK RECEIVING BAY                     │
   │  1× unit | No motor                                  │
   └─────────────────────────────────────────────────────┘
             │
   ┌─────────▼────────────────────────────────────────────┐
   │  RH-EFB-101  HYDRAULIC RECIPROCATING FEEDER          │
   │  1×D + 1×Bkp | 7.5 kW                               │
   └─────────────────────────────────────────────────────┘
             │
   ┌─────────▼────────────────────────────────────────────┐
   │  OBM-EFB-201  OVERBAND MAGNET (Tramp Metal Removal)  │
   │  1× pass-through | 2.2 kW                            │
   └─────────────────────────────────────────────────────┘
             │  [300 t/day | MC: 62.5%]
   ┌─────────▼────────────────────────────────────────────┐
   │  PR-EFB-201  EFB SCREW PRESS (CB Series)             │
   │  2×D + 1×Bkp | 15 T/H nameplate | 9.75 T/H derated  │
   │  37 kW each  ■ MC GATE ≤ 45% PASS                    │
   └─────────────────────────────────────────────────────┘
             │  [~195 t/day | MC: 45%]
   ┌─────────▼────────────────────────────────────────────┐
   │  SD-EFB-201  EFB SHREDDER (KH-777)                   │
   │  5×D + 1×Bkp | 8 T/H nameplate | 5.2 T/H derated    │
   │  75 kW each                                          │
   └─────────────────────────────────────────────────────┘
             │
   ┌─────────▼────────────────────────────────────────────┐  ┌─────────────────┐
   │  HM-EFB-201  HAMMER MILL                             │◄─│ OVERSIZE RECYCLE│
   │  5×D + 1×Bkp | 5 T/H nameplate | 3.25 T/H derated   │  │ 10–20% of flow  │
   │  110 kW each  SPRING-ISO ZONE                        │  └─────────────────┘
   └─────────────────────────────────────────────────────┘
             │
   ┌─────────▼────────────────────────────────────────────┐
   │  VS-EFB-201  VIBRATING SCREEN (2mm Aperture — SWECO) │──── OVERSIZE → HM-EFB-201
   │  3×D + 1×Bkp | 10 T/H nameplate | 3 kW each         │
   └─────────────────────────────────────────────────────┘
             │  ■ PARTICLE GATE D90 ≤ 2mm PASS
             │  [EFB PRODUCT | ~195 t/day | ≤ 2mm | 45% MC]
   ┌─────────▼────────────────────────────────────────────┐
   │  BIN-EFB-201  EFB BUFFER SILO (20m³)                 │
   └─────────────────────────────────────────────────────┘
             │
             └──► EFB EXITS TO DISPATCH HOPPERS → BLEND POINT`,

  opdc: `OPDC LINE — S1B PRE-PROCESSING
══════════════════════════════════════════════════════════════
 Feed: OPDC paste @ 70–75% MC · ~42 t/day | Yield: 15.2% of EFB FW

 MILL EXIT ──┐
             │
   ┌─────────▼────────────────────────────────────────────┐
   │  TR-OPDC-101  OPDC RECEIVING BAY                     │
   └─────────────────────────────────────────────────────┘
             │
   ┌─────────▼────────────────────────────────────────────┐
   │  PR-OPDC-301  OPDC SCREW PRESS (CB-15TC) ★ NEW       │
   │  1×D + 1×Bkp | 15 T/H nameplate | 9.75 T/H derated  │
   │  30 kW  ■ MC FLOOR = 40% LOCKED (CLASS A)            │
   └─────────────────────────────────────────────────────┘
             │  [~28 t/day | MC: 40%]  ■ MC FLOOR GATE PASS
   ┌─────────▼────────────────────────────────────────────┐
   │  SD-OPDC-301  OPTIONAL DE-LUMPER / SHREDDER          │
   │  Breaks consolidated paste bricks | 1×D | 11 kW     │
   └─────────────────────────────────────────────────────┘
             │
   ┌─────────▼────────────────────────────────────────────┐
   │  HM-OPDC-301  HAMMER MILL (SPRING-ISO)               │
   │  1×D + 1×Bkp | 5 T/H nameplate | 3.25 T/H derated   │
   │  35 kW each                                          │
   └─────────────────────────────────────────────────────┘
             │
   ┌─────────▼────────────────────────────────────────────┐
   │  VS-OPDC-301  VIBRATING SCREEN (2mm)                 │
   │  1×D + 1×Bkp | 10 T/H nameplate | 3 kW each         │
   └─────────────────────────────────────────────────────┘
             │
   ┌─────────▼────────────────────────────────────────────┐
   │  BIN-OPDC-301  OPDC BUFFER BIN (30m³ Dual Feed)      │
   │  Receives OPDC + POS decanter cake (co-feed)         │
   │  ■ 24HR DWELL GATE  ■ pH 8.0–9.0 required           │
   └─────────────────────────────────────────────────────┘
             │
             └──► OPDC EXITS TO DISPATCH HOPPER → BLEND POINT`,

  pos: `POS LINE — S1C PRE-PROCESSING (SLUDGE)
══════════════════════════════════════════════════════════════
 Feed: POS Sludge @ 82% MC · ~30 t/day  |  NOTE: POS ≠ POME

 MILL EFFLUENT ──┐
                 │
   ┌─────────────▼────────────────────────────────────────┐
   │  P-SLD-101A/B  SLUDGE FEED PUMPS (Duty/Standby)      │
   │  2× Duty + 1×Bkp | 7.5 kW each                      │
   └─────────────────────────────────────────────────────┘
                 │
   ┌─────────────▼────────────────────────────────────────┐
   │  T-SLD-101  SLUDGE BUFFER TANK (5–8m³)               │
   └─────────────────────────────────────────────────────┘
                 │  [~30 t/day | MC: 82%]
   ┌─────────────▼────────────────────────────────────────┐
   │  DEC-SLD-101  3-PHASE DECANTER                       │
   │  1×D + 1×Bkp | 5 T/H DM nameplate | 3.25 T/H derated│
   │  45 kW each                                          │
   └─────────────────────────────────────────────────────┘
                 │                          │
   [~13.5 t/day cake | MC: 65%]    CENTRATE → RETURN TO POND
   ■ MC GATE ≤ 65% PASS
   ■ Fe GATE: ICP-OES CFI-LAB-POME-001
                 │
   ┌─────────────▼────────────────────────────────────────┐
   │  CV-SLD-CAKE-01  SLUDGE CAKE CONVEYOR ★ NEW          │
   │  Transfers cake to BIN-OPDC-301 (co-feed)            │
   └─────────────────────────────────────────────────────┘
                 │
                 └──► JOINS OPDC LINE AT BIN-OPDC-301

   ┌──────────────────────────────────────────────────────┐
   │  P-CENT-101  DECANTER CENTRATE RETURN PUMP ★ NEW     │
   │  Returns centrate to POME pond | 3 kW                │
   └─────────────────────────────────────────────────────┘`,

  blend: `BLEND POINT — END OF S1 / ENTRY TO S2
══════════════════════════════════════════════════════════════
 Three residue streams converge at the Blend Point.

         ┌──────────────────────┐   ┌──────────────────────┐
         │  H-EFB-301/302       │   │  H-OPDC-301          │
         │  EFB DISPATCH HOPPERS│   │  OPDC DISPATCH HOPPER│
         │  ×2  Live Bottom     │   │  Live Bottom         │
         └──────────┬───────────┘   └──────────┬───────────┘
                    │                           │
         ┌──────────▼───────────┐   ┌──────────▼───────────┐
         │  WB-EFB-01           │   │  WB-OPDC-01          │
         │  EFB Weigh Belt      │   │  OPDC Weigh Belt     │
         │  (Ratio Control)     │   │  (Ratio Control)     │
         └──────────┬───────────┘   └──────────┬───────────┘
                    └──────────────┬────────────┘
                                   │
         ┌─────────────────────────▼──────────────────────┐
         │  S-LIME-BLEND-01  LIMESTONE AUTO-AUGER          │
         │  Injects at blender inlet for neutralisation    │
         └─────────────────────────┬──────────────────────┘
                                   │
         ┌─────────────────────────▼──────────────────────┐
         │  B-BLEND-01  PADDLE BLENDER #1                 │
         │  B-BLEND-02  PADDLE BLENDER #2 (N+1)           │
         │  15 T/H rated | 9.75 T/H derated               │
         └─────────────────────────┬──────────────────────┘
                                   │
         ┌─────────────────────────▼──────────────────────┐
         │  pH-SENS-01/02  INLINE pH SENSORS               │
         │  pH 6.5–8.0 → Wave 1 Trigger (S3 Entry)        │
         └─────────────────────────┬──────────────────────┘
                                   │
         ┌─────────────────────────▼──────────────────────┐
         │  COVERED CONVEYOR GALLERY  →  S2               │
         │  Blend spec: ~38% DM | Lignin: ~25% DM         │
         │  C:N ~45:1 | pH 6.5–8.0                        │
         └────────────────────────────────────────────────┘`,
};

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
  const { site, siteId, derived } = useMill();
  const [activeTab, setActiveTab] = useState('overview');
  const [engSubTab, setEngSubTab] = useState('flow');
  const [activeModal, setActiveModal] = useState(null);
  const [lineModal, setLineModal] = useState(null);
  const [quickModal, setQuickModal] = useState(null);
  const [moduleModal, setModuleModal] = useState(null);
  // Per-stream moisture content overrides (null = use canonical lab default)
  const [mcOverride, setMcOverride] = useState({ efb: null, opdc: null, pos: null });
  // ── Sidebar state ─────────────────────────────────────
  const [cpoProd, setCpoProd] = useState(3000);
  const [cpoPeriod, setCpoPeriod] = useState('annual');
  const [ffbTPHEdit, setFfbTPHEdit] = useState('');
  const [opsHEdit, setOpsHEdit] = useState('');
  const [efbYield, setEfbYield] = useState(23);

  // Sync edit fields when site loads / changes from Supabase
  useEffect(() => {
    if (site) {
      setFfbTPHEdit(String(site.ffb_capacity_tph ?? 60));
      setOpsHEdit(String(site.operating_hrs_day ?? 20));
    }
  }, [site?.ffb_capacity_tph, site?.operating_hrs_day]);
  const [posSludge, setPosSludge] = useState(30);
  const [pressNpCap, setPressNpCap] = useState(15);
  const [millNpCap, setMillNpCap] = useState(5);
  const [nPrice, setNPrice] = useState(1.50);
  const [pPrice, setPPrice] = useState(1.80);
  const [kPrice, setKPrice] = useState(0.80);
  const [powerRate, setPowerRate] = useState(0.15);

  const s1Calc = useMemo(() => {
    const ffbTPH  = parseFloat(ffbTPHEdit) || site?.ffb_capacity_tph  || 60;
    const opsH    = parseFloat(opsHEdit)   || site?.operating_hrs_day || 20;
    const efbTPD  = ffbTPH * opsH * (efbYield / 100);
    const opdcTPD = efbTPD * 0.152;     // locked: 15.2% of EFB FW
    const posTPD  = posSludge;           // direct daily t/day input
    const efbFW   = efbTPD  * 30;
    const opdcFW  = opdcTPD * 30;
    const posFW   = posTPD  * 30;
    const totalFW = efbFW + opdcFW + posFW;
    const efbDM   = efbFW  * 0.375 * 0.97;
    const opdcDM  = opdcFW * 0.30  * 0.99;
    const posDM   = posFW  * 0.18  * 0.95;
    const totalDM = efbDM + opdcDM + posDM;
    const waterRemoved = totalFW - totalDM;
    const inputDM = efbFW*0.375 + opdcFW*0.30 + posFW*0.18;
    const dmRecovery = inputDM > 0 ? ((totalDM/inputDM)*100).toFixed(1) : '\u2014';
    const efbTPH  = efbTPD  > 0 ? (efbTPD  / opsH).toFixed(1) : '\u2014';
    const opdcTPH = opdcTPD > 0 ? (opdcTPD / opsH).toFixed(1) : '\u2014';
    const posTPH  = posTPD  > 0 ? (posTPD  / opsH).toFixed(1) : '\u2014';
    return { efbFW, opdcFW, posFW, totalFW, efbDM, opdcDM, posDM, totalDM, waterRemoved, dmRecovery, efbTPH, opdcTPH, posTPH };
  }, [site, ffbTPHEdit, opsHEdit, efbYield, posSludge]);

  // ── Daily mass-balance with per-stream MC override ──
  const mb = useMemo(() => {
    const efbMCIn   = mcOverride.efb  ?? CANONICAL_MC.efb;
    const opdcMCIn  = mcOverride.opdc ?? CANONICAL_MC.opdc;
    const posMCIn   = mcOverride.pos  ?? CANONICAL_MC.pos;
    const efbMCOut  = 45.0;   // gate target
    const opdcMCOut = 40.0;   // CLASS A hard floor — never changes
    const posMCOut  = 65.0;   // post-decanter target

    const _ffbTPH = parseFloat(ffbTPHEdit) || site?.ffb_capacity_tph  || 60;
    const _opsH    = parseFloat(opsHEdit)   || site?.operating_hrs_day || 20;
    const efbFreshTPD  = _ffbTPH * _opsH * (efbYield / 100);
    const opdcFreshTPD = efbFreshTPD * 0.152;    // locked: 15.2% of EFB FW
    const posFreshTPD  = posSludge;               // direct daily t/day input

    const efbDMTPD   = efbFreshTPD  * (1 - efbMCIn  / 100);
    const opdcDMTPD  = opdcFreshTPD * (1 - opdcMCIn / 100);
    const posDMTPD   = posFreshTPD  * (1 - posMCIn  / 100);

    const efbS1Out   = efbDMTPD  / (1 - efbMCOut  / 100);
    const opdcS1Out  = opdcDMTPD / (1 - opdcMCOut / 100);
    const posS1Out   = posDMTPD  / (1 - posMCOut  / 100);

    const efbH2O     = efbFreshTPD  - efbS1Out;
    const opdcH2O    = opdcFreshTPD - opdcS1Out;
    const posH2O     = posFreshTPD  - posS1Out;

    const totalFreshTPD = efbFreshTPD + opdcFreshTPD + posFreshTPD;
    const totalDMTPD    = efbDMTPD   + opdcDMTPD   + posDMTPD;
    const totalS1Out    = efbS1Out   + opdcS1Out   + posS1Out;
    const totalH2O      = efbH2O     + opdcH2O     + posH2O;

    const f1 = v => isFinite(v) && v > 0 ? v.toFixed(1) : '\u2014';
    return {
      efb:  { fresh: f1(efbFreshTPD),  mcIn: efbMCIn.toFixed(1),  dm: f1(efbDMTPD),  s1Out: f1(efbS1Out),  mcOut: efbMCOut.toFixed(1),  h2o: f1(efbH2O),  dmRaw: efbDMTPD  },
      opdc: { fresh: f1(opdcFreshTPD), mcIn: opdcMCIn.toFixed(1), dm: f1(opdcDMTPD), s1Out: f1(opdcS1Out), mcOut: opdcMCOut.toFixed(1), h2o: f1(opdcH2O), dmRaw: opdcDMTPD },
      pos:  { fresh: f1(posFreshTPD),  mcIn: posMCIn.toFixed(1),  dm: f1(posDMTPD),  s1Out: f1(posS1Out),  mcOut: posMCOut.toFixed(1),  h2o: f1(posH2O),  dmRaw: posDMTPD  },
      tot:  { fresh: f1(totalFreshTPD), dm: f1(totalDMTPD), s1Out: f1(totalS1Out), h2o: f1(totalH2O),
              dmConserved: totalDMTPD > 0 && Math.abs(efbDMTPD + opdcDMTPD + posDMTPD - totalDMTPD) < 0.01 },
      efbFreshTPD, opdcFreshTPD, posFreshTPD,
      efbDMTPD, opdcDMTPD, posDMTPD,
      efbS1Out, opdcS1Out, posS1Out,
      efbH2O, opdcH2O, posH2O,
    };
  }, [site, ffbTPHEdit, opsHEdit, efbYield, posSludge, mcOverride]);

  // ── Equipment counts driven by sidebar NP caps (Asian OEM 65% efficiency) ──
  const NP_EFF     = 0.65;
  const _opsHours  = parseFloat(opsHEdit) || site?.operating_hrs_day || 20;
  const efbFlowTPH  = _opsHours > 0 ? mb.efbFreshTPD  / _opsHours : 0;
  const opdcFlowTPH = _opsHours > 0 ? mb.opdcFreshTPD / _opsHours : 0;
  const efbPressDuty  = Math.max(1, Math.ceil(efbFlowTPH  / ((pressNpCap || 15) * NP_EFF)));
  const efbMillDuty   = Math.max(1, Math.ceil(efbFlowTPH  / ((millNpCap  || 5)  * NP_EFF)));
  const opdcPressDuty = Math.max(1, Math.ceil(opdcFlowTPH / ((pressNpCap || 15) * NP_EFF)));

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

      {/* ── ALWAYS-MOUNTED MODALS (outside tabs) ── */}
      <S1LineDetailModal lineModal={lineModal} setLineModal={setLineModal} />
      <S1QuickLinkModal quickModal={quickModal} setQuickModal={setQuickModal} />
      <S1ModuleDetailModal moduleModal={moduleModal} setModuleModal={setModuleModal} />
      {activeModal != null && (
        <S1ResidueModal
          active={activeModal}
          onClose={() => setActiveModal(null)}
          site={site}
          calc={s1Calc}
        />
      )}

      {/* BREADCRUMB */}
      <S1Breadcrumb />

      {/* ── BODY: SIDEBAR + MAIN ── */}
      <div className="s1hub-body">
        {/* ────────── LEFT SIDEBAR ────────── */}
        <aside className="s1hub-sb">
          {/* MILL PARAMETERS */}
          <span className="s1hub-sb-lbl">Mill Parameters</span>
          <div className="s1hub-sb-iw">
            <span className="s1hub-sb-ll">CPO Production</span>
            <div style={{ display:'flex', alignItems:'center', gap:3, flexShrink:0 }}>
              <div className="s1hub-sb-irow">
                <input type="number" className="s1hub-sb-input" value={cpoProd}
                       onChange={e => setCpoProd(+e.target.value || 0)} />
                <span className="s1hub-sb-un">t</span>
              </div>
              <div className="s1hub-sb-toggle-row">
                <button className={`s1hub-sb-toggle${cpoPeriod === 'annual' ? ' s1hub-sb-toggle--active' : ''}`}
                        onClick={() => setCpoPeriod('annual')}>Annual</button>
                <button className={`s1hub-sb-toggle${cpoPeriod === 'month' ? ' s1hub-sb-toggle--active' : ''}`}
                        onClick={() => setCpoPeriod('month')}>Month</button>
              </div>
            </div>
          </div>
          <div className="s1hub-sb-iw">
            <span className="s1hub-sb-ll">FFB Throughput</span>
            <div className="s1hub-sb-irow">
              <input type="number" className="s1hub-sb-input"
                     value={ffbTPHEdit}
                     onChange={e => setFfbTPHEdit(e.target.value)}
                     onBlur={e => {
                       const v = parseFloat(e.target.value);
                       if (siteId && v > 0) supabase.from('cfi_sites').update({ ffb_capacity_tph: v }).eq('id', siteId);
                     }} />
              <span className="s1hub-sb-un">T / hr</span>
            </div>
          </div>
          <div className="s1hub-sb-iw">
            <span className="s1hub-sb-ll">Operating Hours</span>
            <div className="s1hub-sb-irow">
              <input type="number" className="s1hub-sb-input"
                     value={opsHEdit}
                     onChange={e => setOpsHEdit(e.target.value)}
                     onBlur={e => {
                       const v = parseFloat(e.target.value);
                       if (siteId && v > 0) supabase.from('cfi_sites').update({ operating_hrs_day: v }).eq('id', siteId);
                     }} />
              <span className="s1hub-sb-un">hr / day</span>
            </div>
          </div>

          {/* FEEDSTOCK RATIOS */}
          <span className="s1hub-sb-lbl">Feedstock Ratios</span>
          <div className="s1hub-sb-iw">
            <span className="s1hub-sb-ll">EFB Yield</span>
            <div className="s1hub-sb-irow">
              <input type="number" className="s1hub-sb-input" value={efbYield}
                     onChange={e => setEfbYield(+e.target.value || 0)} />
              <span className="s1hub-sb-un">% FFB</span>
            </div>
          </div>
          <div className="s1hub-sb-iw">
            <span className="s1hub-sb-ll">OPDC Yield (CLASS A)</span>
            <div className="s1hub-sb-lkd">
              <span className="s1hub-sb-lv">15.2% EFB</span>
            </div>
          </div>
          <div className="s1hub-sb-iw">
            <span className="s1hub-sb-ll">POS Sludge Input</span>
            <div className="s1hub-sb-irow">
              <input type="number" className="s1hub-sb-input" value={posSludge}
                     onChange={e => setPosSludge(+e.target.value || 0)} />
              <span className="s1hub-sb-un">T / Day</span>
            </div>
          </div>

          {/* INLET MOISTURE */}
          <span className="s1hub-sb-lbl">Inlet Moisture (S0)</span>
          <div className="s1hub-sb-iw">
            <span className="s1hub-sb-ll">EFB MC</span>
            <div className="s1hub-sb-irow">
              <input type="number" className="s1hub-sb-input"
                     value={mcOverride.efb ?? 62.5}
                     onChange={e => setMcOverride(o => ({ ...o, efb: +e.target.value }))} />
              <span className="s1hub-sb-un">%</span>
            </div>
          </div>
          <div className="s1hub-sb-iw">
            <span className="s1hub-sb-ll">OPDC MC</span>
            <div className="s1hub-sb-irow">
              <input type="number" className="s1hub-sb-input"
                     value={mcOverride.opdc ?? 70}
                     onChange={e => setMcOverride(o => ({ ...o, opdc: +e.target.value }))} />
              <span className="s1hub-sb-un">%</span>
            </div>
          </div>
          <div className="s1hub-sb-iw">
            <span className="s1hub-sb-ll">POS MC</span>
            <div className="s1hub-sb-irow">
              <input type="number" className="s1hub-sb-input"
                     value={mcOverride.pos ?? 82}
                     onChange={e => setMcOverride(o => ({ ...o, pos: +e.target.value }))} />
              <span className="s1hub-sb-un">%</span>
            </div>
          </div>

          {/* EQUIPMENT (OEM TYPE) */}
          <span className="s1hub-sb-lbl">Equipment (OEM Type)</span>
          <div className="s1hub-sb-iw">
            <span className="s1hub-sb-ll">Press NP Cap</span>
            <div className="s1hub-sb-irow">
              <input type="number" className="s1hub-sb-input" value={pressNpCap}
                     onChange={e => setPressNpCap(+e.target.value || 0)} />
              <span className="s1hub-sb-un">T / hr</span>
            </div>
          </div>
          <div className="s1hub-sb-iw">
            <span className="s1hub-sb-ll">Mill NP Cap</span>
            <div className="s1hub-sb-irow">
              <input type="number" className="s1hub-sb-input" value={millNpCap}
                     onChange={e => setMillNpCap(+e.target.value || 0)} />
              <span className="s1hub-sb-un">T / hr</span>
            </div>
          </div>
          <div className="s1hub-sb-iw">
            <div className="s1hub-sb-lkd">
              <span className="s1hub-sb-lv">Asian OEM — 65%</span>
              <span className="s1hub-sb-lu">Nameplate</span>
            </div>
            <span className="s1hub-sb-badge s1hub-sb-badge--locked">LOCKED</span>
          </div>
          <div className="s1hub-sb-iw">
            <div className="s1hub-sb-lkd">
              <span className="s1hub-sb-lv">EU / JP OEM — 85%</span>
              <span className="s1hub-sb-lu">Nameplate</span>
            </div>
            <span className="s1hub-sb-badge s1hub-sb-badge--alt">ALT</span>
          </div>

          {/* S1 EXIT GATES (LOCKED) */}
          <span className="s1hub-sb-lbl">S1 Exit Gates (Locked)</span>
          <div className="s1hub-sb-iw">
            <div className="s1hub-sb-lkd"><span className="s1hub-sb-lv">EFB MC ≤ 45.0%</span></div>
          </div>
          <div className="s1hub-sb-iw">
            <div className="s1hub-sb-lkd">
              <span className="s1hub-sb-lv">OPDC MC Floor 40.0%</span>
              <span className="s1hub-sb-lu">FLOOR</span>
            </div>
            <span className="s1hub-sb-badge s1hub-sb-badge--locked">HARD</span>
          </div>
          <div className="s1hub-sb-iw">
            <div className="s1hub-sb-lkd"><span className="s1hub-sb-lv">POS MC ≤ 65.0%</span></div>
          </div>
          <div className="s1hub-sb-iw">
            <div className="s1hub-sb-lkd">
              <span className="s1hub-sb-lv">EFB D90 ≤ 2 mm</span>
              <span className="s1hub-sb-lu">Particle</span>
            </div>
            <span className="s1hub-sb-badge s1hub-sb-badge--locked">HARD GATE</span>
          </div>

          {/* PRICING (S0K) */}
          <span className="s1hub-sb-lbl">Pricing (S0K)</span>
          <div className="s1hub-sb-iw">
            <span className="s1hub-sb-ll">N Replacement</span>
            <div className="s1hub-sb-irow">
              <input type="number" step="0.01" className="s1hub-sb-input" value={nPrice}
                     onChange={e => setNPrice(+e.target.value || 0)} />
              <span className="s1hub-sb-un">$ / kg N</span>
            </div>
          </div>
          <div className="s1hub-sb-iw">
            <span className="s1hub-sb-ll">P₂O₅ Replacement</span>
            <div className="s1hub-sb-irow">
              <input type="number" step="0.01" className="s1hub-sb-input" value={pPrice}
                     onChange={e => setPPrice(+e.target.value || 0)} />
              <span className="s1hub-sb-un">$ / kg</span>
            </div>
          </div>
          <div className="s1hub-sb-iw">
            <span className="s1hub-sb-ll">K₂O Replacement</span>
            <div className="s1hub-sb-irow">
              <input type="number" step="0.01" className="s1hub-sb-input" value={kPrice}
                     onChange={e => setKPrice(+e.target.value || 0)} />
              <span className="s1hub-sb-un">$ / kg</span>
            </div>
          </div>
          <div className="s1hub-sb-iw">
            <span className="s1hub-sb-ll">Power Rate</span>
            <div className="s1hub-sb-irow">
              <input type="number" step="0.01" className="s1hub-sb-input" value={powerRate}
                     onChange={e => setPowerRate(+e.target.value || 0)} />
              <span className="s1hub-sb-un">$ / kWh</span>
            </div>
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <div className="s1hub-main">

      {/* ── PRIMARY TAB BAR ── */}
      <div className="s1hub-tab-bar">
        {TABS.map(t => (
          <button
            key={t.key}
            className={`s1hub-tab-btn${activeTab === t.key ? ' s1hub-tab-btn--active' : ''}`}
            onClick={() => setActiveTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════
          TAB 1 — OVERVIEW (S0 Selected Residues)
      ══════════════════════════════════════════════════════ */}
      {activeTab === 'overview' && (
        <div className="s1hub-tab-content">
          <S1MassBalanceTable mb={mb} site={site} />
          <S0ResidueStreamCards mb={mb} site={site} mcOverride={mcOverride} setMcOverride={setMcOverride} efbPressDuty={efbPressDuty} efbMillDuty={efbMillDuty} opdcPressDuty={opdcPressDuty} />

          <div style={{ marginTop: 20 }}>
            <SubstrateFlowStrip
              stageLabel="Substrate Flow — S0 Feedstock → S1 Mechanical Output"
              inflows={S1_INFLOWS}
              outflows={S1_OUTFLOWS}
            />
          </div>

          <S1ResidueCards />

          <div className="content">
            <div className="sec-title st-teal" style={{ marginTop: 24 }}>Daily Stream Summary</div>
            <div className="s1hub-streams-grid">
              {[
                { name: 'EFB',  fresh: `${mb.efb.fresh} t/day`,  dm: `${mb.efb.dm} t/day`,  mc: `${mb.efb.mcIn}%`,  color: C.teal    },
                { name: 'OPDC', fresh: `${mb.opdc.fresh} t/day`, dm: `${mb.opdc.dm} t/day`, mc: `${mb.opdc.mcIn}%`, color: C.amber   },
                { name: 'POS',  fresh: `${mb.pos.fresh} t/day`,  dm: `${mb.pos.dm} t/day`,  mc: `${mb.pos.mcIn}%`,  color: '#3B82F6' },
              ].map((st, i) => (
                <div key={i} className="s1hub-stream-sm-card" style={{ '--stream-color': st.color }}>
                  <div className="s1hub-stream-sm-name">{st.name}</div>
                  <div className="s1hub-stream-sm-metrics">
                    <div><div className="s1hub-stream-sm-lbl">Fresh</div><div className="s1hub-stream-val-fw">{st.fresh}</div></div>
                    <div><div className="s1hub-stream-sm-lbl">Dry Matter</div><div className="s1hub-stream-val-dm">{st.dm}</div></div>
                    <div><div className="s1hub-stream-sm-lbl">MC</div><div className="s1hub-stream-val-mc">{st.mc}</div></div>
                  </div>
                </div>
              ))}
            </div>

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
          </div>

          {/* ── RESIDUE WINDOWS ── */}
          <div className="s1win-section-title">S1 Residue Windows</div>
          <div className="s1win-row">
            <S1ResidueWindow
              residueKey="efb"
              site={site}
              calc={s1Calc}
              mb={mb.efb}
              equipment={LINE_DETAIL.EFB?.equipment}
              asciiText={S1_ASCII_FLOWS.efb}
              processFlow={[
                ['Feed',    'EFB @ 62.5% MC from mill press discharge'],
                ['Step 1',  'RH-EFB-101 Hydraulic Feeder → Apron Conveyor (7.5 kW)'],
                ['Step 2',  'ETR-01 Trommel Screen 50mm → OBM-01 Overband Magnet'],
                ['Step 3',  'EPR-01 Screw Press + PKSA  ■ GATE B.G2 · MC floor 40%'],
                ['Step 4',  'ESD-01 Primary Shredder (75 kW) → EHM-01 Hammer Mill (110 kW)'],
                ['Step 5',  'EVS-01 Vibrating Screen 2mm → EDC-01 Baghouse'],
                ['Output',  'BIN-EFB-201 Buffer Bin 50m³ → S2 Handoff'],
              ]}
              keySpecs={[
                ['MC In', '62.5%'], ['MC Out', '45–50%'],
                ['Particle Size', 'D90 ≤ 2mm'], ['Belt Width', '600mm'],
                ['Daily In', '~300 t FW'], ['Daily Out', '~195 t FW'],
                ['C:N Ratio', '60:1'], ['Lignin ADL', '22% DM'],
                ['N/day', '582 kg'], ['K/day', '930 kg'],
              ]}
            />
            <S1ResidueWindow
              residueKey="opdc"
              site={site}
              calc={s1Calc}
              mb={mb.opdc}
              equipment={LINE_DETAIL.OPDC?.equipment}
              asciiText={S1_ASCII_FLOWS.opdc}
              processFlow={[
                ['Feed',         'OPDC paste @ 70–75% MC · Anti-bridging throughout'],
                ['Step 1',       'RH-OPDC-101 Reciprocating Feeder (SS304 · anti-bridging)'],
                ['Step 2',       'CV-OPDC-101 Belt Conveyor → OPR-01 Screw Press'],
                ['■ CLASS A',    'MC floor ≥ 40% LOCKED · NON-NEGOTIABLE'],
                ['Step 3',       'OLB-01 Lump Breaker → OTR-01 Trommel → ODR-01 Rotary Dryer'],
                ['Step 4',       'OHM-01 Hammer Mill (SPRING ISO) → OVS-01 Vib. Screen 3mm'],
                ['■ 24HR DWELL', 'BIN-OPDC-301 Product Bin · pH 8.0–9.0 required'],
                ['Output',       '≤35% MC · D90 ≤ 3mm · pH 8.0–9.0 · to S2'],
              ]}
              keySpecs={[
                ['MC In', '70–75%'], ['MC Out', '≤35%'],
                ['Particle Size', 'D90 ≤ 3mm'], ['Belt Width', '500mm'],
                ['Daily In', '~42 t FW'], ['Daily Out', '~28 t FW'],
                ['C:N Ratio', '20:1'], ['pH Gate', '8.0–9.0'],
                ['Dwell Gate', '≥24 hrs'], ['N content', '2.32% DM'],
              ]}
            />
            <S1ResidueWindow
              residueKey="pos"
              site={site}
              calc={s1Calc}
              mb={mb.pos}
              equipment={LINE_DETAIL.POS?.equipment}
              asciiText={S1_ASCII_FLOWS.pos}
              processFlow={[
                ['Feed',           'POS Sludge @ 82% MC from mill effluent stream'],
                ['Step 1',         'Sludge Pit 15m³ → Progressive Cavity Pump'],
                ['Step 2',         'DRS-SLD-01 Rotary Drum Screen (78% MC out)'],
                ['■ ICP-OES Fe',   'Fe result sets CaCO₃ dose + S2 inclusion'],
                ['Step 3',         'DEC-SLD-101 Decanter Centrifuge (55 kW · 65% MC out)'],
                ['Step 4',         'CaCO₃ conditioning · pH 4.4 → 5.5–6.0'],
                ['Output',         'Cake ~405 t/mo · 65–70% MC · Gated · to S2'],
              ]}
              keySpecs={[
                ['MC In', '82%'], ['MC Out', '65–70%'],
                ['pH In', '4.4 (acidic)'], ['pH Out', '5.5–6.0'],
                ['Daily In', '~30 t FW'], ['Daily Out', '~13.5 t cake'],
                ['Fe Gate', 'ICP-OES protocol'], ['CaCO₃ Dose', '5–20% w/w'],
                ['Screen Reject', '→ EFB Line'], ['Filtrate', '→ POME system'],
              ]}
            />
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          TAB 2 — ENGINEERING
      ══════════════════════════════════════════════════════ */}
      {activeTab === 'engineering' && (
        <div className="s1hub-tab-content">
          <div className="s1hub-subtab-bar">
            {ENG_SUBTABS.map(s => (
              <button
                key={s.key}
                className={`s1hub-subtab-btn${engSubTab === s.key ? ' s1hub-subtab-btn--active' : ''}`}
                onClick={() => setEngSubTab(s.key)}
              >
                {s.label}
              </button>
            ))}
          </div>

          {engSubTab === 'flow' && <S1ProcessEngineering />}

          {engSubTab === 'ascii' && (
            <div>
              {[
                { key: 'efb',   label: 'EFB Line — S1A',          color: C.teal    },
                { key: 'opdc',  label: 'OPDC Line — S1B',         color: C.amber   },
                { key: 'pos',   label: 'POS Line — S1C (Sludge)', color: '#3B82F6' },
                { key: 'blend', label: 'Blend Point → S2',        color: '#3DCB7A' },
              ].map(({ key, label, color }) => (
                <div key={key} className="s1hub-ascii-wrap">
                  <div className="s1hub-ascii-section-hdr">
                    <div className="s1hub-ascii-section-bar" style={{ background: color }} />
                    <div className="s1hub-ascii-section-title" style={{ color }}>{label}</div>
                  </div>
                  <pre className="s1hub-ascii-pre">{S1_ASCII_FLOWS[key]}</pre>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          TAB 3 — MACHINERY
      ══════════════════════════════════════════════════════ */}
      {activeTab === 'machinery' && (
        <div className="s1hub-tab-content">
          {[
            { lineKey: 'EFB',  label: 'EFB Line — S1A Equipment Register',  color: C.teal    },
            { lineKey: 'OPDC', label: 'OPDC Line — S1B Equipment Register', color: C.amber   },
            { lineKey: 'POS',  label: 'POS Line — S1C Equipment Register',  color: '#3B82F6' },
          ].map(({ lineKey, label, color }) => {
            const eq = LINE_DETAIL[lineKey]?.equipment || [];
            return (
              <div key={lineKey} className="s1hub-mach-section">
                <div className="s1hub-mach-section-hdr">
                  <div className="s1hub-mach-section-bar" style={{ background: color }} />
                  <div className="s1hub-mach-section-title" style={{ color }}>{label}</div>
                </div>
                <div className="s1hub-mach-table-wrap" style={{ overflowX: 'auto' }}>
                  <table className="s1hub-mach-table">
                    <thead>
                      <tr>
                        <th className="s1hub-mach-th" style={{ color }}>Tag</th>
                        <th className="s1hub-mach-th">Equipment</th>
                        <th className="s1hub-mach-th s1hub-mach-th--right">T/H</th>
                        <th className="s1hub-mach-th s1hub-mach-th--right">kW</th>
                        <th className="s1hub-mach-th s1hub-mach-th--right">Unit Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      {eq.map((row, ri) => (
                        <tr key={ri} className={ri % 2 === 1 ? 's1hub-mach-tr-alt' : ''}>
                          <td className="s1hub-mach-td s1hub-mach-td--code" style={{ color }}>{row.code}</td>
                          <td className="s1hub-mach-td s1hub-mach-td--name">{row.name}</td>
                          <td className="s1hub-mach-td s1hub-mach-td--tph">{row.tph}</td>
                          <td className="s1hub-mach-td s1hub-mach-td--kw">{row.kw}</td>
                          <td className="s1hub-mach-td s1hub-mach-td--cost">{row.cost}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}

          <div className="content" style={{ marginTop: 8 }}>
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

            <div className="s1hub-fp-section">
              <div className="s1hub-fp-hdr">
                <div className="s1hub-section-bar" />
                <div className="s1hub-section-title">Floor Plan Print / PDF</div>
              </div>
              <div className="s1hub-fp-btn-row">
                <button
                  onClick={() => window.open('/s1-floor-plan-print?line=all&print', '_blank')}
                  className="s1hub-fp-btn"
                  style={{ background: 'rgba(0,137,123,.12)', border: '1.5px solid rgba(0,137,123,.45)', color: C.teal }}
                >
                  &#128196; All Residues Combined
                </button>
                {site?.efb_enabled && (
                  <button
                    onClick={() => window.open('/s1-floor-plan-print?line=efb&print', '_blank')}
                    className="s1hub-fp-btn"
                    style={{ background: `${C.teal}14`, border: `1.5px solid ${C.teal}55`, color: C.teal }}
                  >
                    EFB Line
                  </button>
                )}
                {site?.opdc_enabled && (
                  <button
                    onClick={() => window.open('/s1-floor-plan-print?line=opdc&print', '_blank')}
                    className="s1hub-fp-btn"
                    style={{ background: `${C.amber}14`, border: `1.5px solid ${C.amber}55`, color: C.amber }}
                  >
                    OPDC Line
                  </button>
                )}
                {site?.pos_enabled && (
                  <button
                    onClick={() => window.open('/s1-floor-plan-print?line=pos&print', '_blank')}
                    className="s1hub-fp-btn"
                    style={{ background: 'rgba(59,130,246,.12)', border: '1.5px solid rgba(59,130,246,.4)', color: '#3B82F6' }}
                  >
                    POS Line
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          TAB 4 — HANDOFF TO S2
      ══════════════════════════════════════════════════════ */}
      {activeTab === 'handoff' && (
        <div className="s1hub-tab-content">
          <div className="s1hub-handoff-kpi-strip">
            {[
              { lbl: 'Total FW Out',  val: mb.tot.s1Out,         unit: 't/day · All Streams' },
              { lbl: 'Total DM',      val: mb.tot.dm,            unit: 't DM / day' },
              { lbl: 'Water Removed', val: mb.tot.h2o,           unit: 't H₂O / day · Pressed' },
              { lbl: 'EFB MC Out',    val: `${mb.efb.mcOut}%`,   unit: 'Post-Press Gate' },
              { lbl: 'OPDC MC Floor', val: `${mb.opdc.mcOut}%`,  unit: 'CLASS A LOCKED' },
            ].map((k, i) => (
              <div key={i} className="s1hub-handoff-kpi-card">
                <div className="s1hub-handoff-kpi-lbl">{k.lbl}</div>
                <div className="s1hub-handoff-kpi-val">{k.val}</div>
                <div className="s1hub-handoff-kpi-unit">{k.unit}</div>
              </div>
            ))}
          </div>

          <div style={{ margin: '20px 28px 0' }}>
            <SubstrateFlowStrip
              stageLabel="S1 Output → S2 Entry — Substrate Transition"
              inflows={S1_INFLOWS}
              outflows={S1_OUTFLOWS}
            />
          </div>

          <div className="s1hub-mach-section">
            <div className="s1hub-mach-section-hdr">
              <div className="s1hub-mach-section-bar" style={{ background: '#3DCB7A' }} />
              <div className="s1hub-mach-section-title" style={{ color: '#3DCB7A' }}>S1 → S2 Blend Specification</div>
            </div>
            <div className="s1hub-mach-table-wrap" style={{ overflowX: 'auto' }}>
              <table className="s1hub-mach-table">
                <thead>
                  <tr>
                    <th className="s1hub-mach-th">Parameter</th>
                    <th className="s1hub-mach-th" style={{ color: C.teal }}>EFB</th>
                    <th className="s1hub-mach-th" style={{ color: C.amber }}>OPDC</th>
                    <th className="s1hub-mach-th" style={{ color: '#3B82F6' }}>POS</th>
                    <th className="s1hub-mach-th s1hub-mach-th--right" style={{ color: '#3DCB7A' }}>Blend Target</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['MC Out %',      '45–50%',    '40% floor',   '65–70%',    '~45–50%'],
                    ['Particle D90',  '≤ 2mm',     '≤ 3mm',       'Cake',      '≤ 3mm'],
                    ['C:N Ratio',     '60:1',      '20:1',        '19:1',      '~45:1'],
                    ['Lignin ADL',    '22% DM',    '30.7% DM',    '—',         '~25% DM'],
                    ['N content',     '0.76% DM',  '2.32% DM',    '1.76% DM',  '~1.0% DM'],
                    ['pH range',      '6–7',       '8.0–9.0',     '5.5–6.0',   '6.5–8.0'],
                    ['Gate status',   'D90 + MC',  'MC CLASS A',  'Fe ICP-OES','All gates PASS'],
                  ].map(([param, efb, opdc, pos, blend], ri) => (
                    <tr key={ri} className={ri % 2 === 1 ? 's1hub-mach-tr-alt' : ''}>
                      <td className="s1hub-mach-td s1hub-mach-td--name">{param}</td>
                      <td className="s1hub-mach-td s1hub-mach-td--tph">{efb}</td>
                      <td className="s1hub-mach-td s1hub-mach-td--kw">{opdc}</td>
                      <td className="s1hub-mach-td" style={{ color: '#3B82F6', fontFamily: 'var(--fnt-mono)', fontSize: 11 }}>{pos}</td>
                      <td className="s1hub-mach-td s1hub-mach-td--cost" style={{ color: '#3DCB7A', fontWeight: 700 }}>{blend}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {site && (site.efb_enabled || site.opdc_enabled || site.pos_enabled) && (
            <div className="s1hub-actions-wrap" style={{ marginTop: 20 }}>
              <div className="s1hub-actions-row">
                <div className="s1hub-actions-lbl">Open detailed view:</div>
                {[
                  { key: 'efb',  name: 'EFB',  accent: C.teal,    enabledKey: 'efb_enabled'  },
                  { key: 'opdc', name: 'OPDC', accent: C.amber,   enabledKey: 'opdc_enabled' },
                  { key: 'pos',  name: 'POS',  accent: '#3B82F6', enabledKey: 'pos_enabled'  },
                ].filter(r => site?.[r.enabledKey]).map(r => (
                  <button
                    key={r.key}
                    onClick={() => setActiveModal({ residue: r.key, tab: 0 })}
                    className="s1hub-action-btn"
                    style={{ background: `${r.accent}18`, border: `1.5px solid ${r.accent}66`, color: r.accent }}
                  >
                    {r.name} Detail →
                  </button>
                ))}
                <button
                  onClick={() => setActiveModal({ residue: 'combined', tab: 0 })}
                  className="s1hub-action-btn"
                  style={{ background: 'rgba(0,162,73,.1)', border: '1.5px solid rgba(0,162,73,.4)', color: C.green }}
                >
                  All Residues Combined
                </button>
                <button
                  onClick={() => window.open('/s1-engineering-print?print', '_blank')}
                  className="s1hub-action-btn"
                  style={{ background: 'rgba(0,137,123,.1)', border: '1.5px solid rgba(0,137,123,.4)', color: C.teal }}
                >
                  &#128196; Complete Engineering — Print / PDF
                </button>
              </div>
            </div>
          )}

          <div className="s1hub-1pager-row" style={{ margin: '28px 28px 32px' }}>
            <a
              href="/CFI_S0_Residue_Selector.html"
              target="_blank"
              rel="noopener noreferrer"
              className="s1hub-1pager-link"
            >
              &#128196; View S0 Residue Selector 1-Pager
            </a>
          </div>
        </div>
      )}
        </div>{/* /s1hub-main */}
      </div>{/* /s1hub-body */}
    </>
  );
}
