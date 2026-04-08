import { C, Fnt } from "../../components/S1Shared/S1Shared.jsx";

// ── QUICK LINKS LIST ──
export const QUICK_LINKS = [
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
  ┌─────────────────────────────────────────────────────────────────────┐
  │  S1B  OPDC  PRE-PROCESSING  ·  10 nodes  ·  206 kW  ·  5 t/h    │
  │  Anti-bridging throughout · Paste form handling                   │
  └─────────────────────────────────────────────────────────────────────┘

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

export default function S1QuickLinkModal({ quickModal, setQuickModal }) {
  if (!quickModal || !QUICK_LINK_DETAIL[quickModal]) return null;

  const d = QUICK_LINK_DETAIL[quickModal];

  return (
    <div
      className="s1hub-modal-overlay"
      style={{ zIndex: 1001 }}
      onClick={() => setQuickModal(null)}
    >
      <div
        className="s1hub-modal-panel s1hub-modal-panel--wide"
        style={{ '--modal-accent': d.accent }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="s1hub-modal-hdr s1hub-modal-hdr--sm">
          <div className="s1hub-modal-title-row">
            <div className="s1hub-modal-accent-bar s1hub-modal-accent-bar--sm" />
            <div className="s1hub-modal-title-lg" style={{ fontSize: 17 }}>{d.title}</div>
          </div>
          <button className="s1hub-modal-close-btn" onClick={() => setQuickModal(null)}>ESC ✕</button>
        </div>

        {/* Ticker strip */}
        <div className="s1hub-stats-strip--flex">
          {d.ticker.map((t, i) => (
            <div key={i} className="s1hub-stat-chip s1hub-stat-chip--sm">
              <div className="s1hub-stat-chip-lbl s1hub-stat-chip-lbl--sm">{t.label}</div>
              <div className="s1hub-stat-chip-val s1hub-stat-chip-val--md">{t.val}</div>
            </div>
          ))}
        </div>

        {/* ASCII flow */}
        {d.ascii && (
          <>
            <div className="s1hub-modal-section-hdr" style={{ marginBottom: 8 }}>
              <div className="s1hub-modal-section-bar" />
              <div className="s1hub-modal-section-title">Process Flow</div>
            </div>
            <pre
              className="s1hub-modal-pre"
              style={{ border: `1px solid ${d.accent}33` }}
            >{d.ascii}</pre>
            {d.stats && (
              <div className="s1hub-modal-pre-stats">
                {d.stats.map((s, i) => (
                  <div key={i} className="s1hub-stat-chip" style={{ background: 'rgba(0,0,0,.25)' }}>
                    <div className="s1hub-stat-chip-lbl s1hub-stat-chip-lbl--sm">{s.lbl}</div>
                    <div className="s1hub-stat-chip-val s1hub-stat-chip-val--sm">{s.val}</div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Floor plan nodes */}
        {d.nodes && (
          <>
            <div className="s1hub-modal-section-hdr" style={{ marginBottom: 10 }}>
              <div className="s1hub-modal-section-bar" />
              <div className="s1hub-modal-section-title">Equipment Layout</div>
            </div>
            {d.building && (
              <div className="s1hub-building-banner" style={{ border: `1px solid ${d.accent}44` }}>
                <div className="s1hub-building-label">{d.building.label}</div>
                <div className="s1hub-building-dim">{d.building.dim}</div>
              </div>
            )}
            <div className="s1hub-node-grid">
              {d.nodes.map((n, i) => (
                <div key={i} className="s1hub-node-card" style={{ border: `1px solid ${d.accent}33`, borderLeft: `3px solid ${d.accent}` }}>
                  <div className="s1hub-node-code">{n.code}</div>
                  <div className="s1hub-node-name">{n.name}</div>
                  <div className="s1hub-node-spec">{n.spec}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* 1-pager summary */}
        {d.summary && (
          <div className="s1hub-summary-grid">
            {d.summary.map((sec, i) => (
              <div key={i} className="s1hub-summary-block" style={{ border: `1px solid ${d.accent}33` }}>
                <div className="s1hub-summary-title">{sec.section}</div>
                {sec.items.map(([label, val], j) => (
                  <div key={j} className="s1hub-summary-row">
                    <div className="s1hub-summary-row-lbl">{label}</div>
                    <div className="s1hub-summary-row-val">{val}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
