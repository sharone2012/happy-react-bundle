import {
  C, Fnt, SubstrateFlowStrip,
} from "../../components/S1Shared/S1Shared.jsx";

// ── LEADERBOARD DATA ──
export const LEADERBOARD_LINES = [
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
    mcIn: '—', mcOut: '—', mcReduction: '—', linFrac: '—', cn: '—', bf: '—',
    npk: { N: '—', P: '—', K: '—' },
    guardrail: 'Pending specification',
    route: null,
    placeholder: true,
  },
];

// ── LINE DETAIL DATA ──
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

export default function S1LineDetailModal({ lineModal, setLineModal }) {
  if (!lineModal || !LINE_DETAIL[lineModal]) return null;

  const line = LEADERBOARD_LINES.find(l => l.name === lineModal);
  const detail = LINE_DETAIL[lineModal];

  return (
    <div
      className="s1hub-modal-overlay"
      style={{ zIndex: 1000 }}
      onClick={() => setLineModal(null)}
    >
      <div
        className="s1hub-modal-panel"
        style={{ '--modal-accent': line.accent }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="s1hub-modal-hdr">
          <div className="s1hub-modal-title-row">
            <div className="s1hub-modal-accent-bar" />
            <div>
              <div className="s1hub-modal-title-lg">{line.name} Processing Line</div>
              <div className="s1hub-modal-subtitle">{line.guardrail}</div>
            </div>
          </div>
          <button className="s1hub-modal-close-btn" onClick={() => setLineModal(null)}>ESC ✕</button>
        </div>

        {/* Key metrics strip */}
        <div className="s1hub-stats-strip">
          {[
            { lbl: 'T/DAY', val: line.tonnes ?? '—' },
            { lbl: 'MC IN', val: line.mcIn },
            { lbl: 'MC OUT', val: line.mcOut },
            { lbl: 'MC REDUC.', val: line.mcReduction },
            { lbl: 'C:N', val: line.cn },
            { lbl: 'B:F', val: line.bf },
          ].map((m, i) => (
            <div key={i} className="s1hub-stat-chip">
              <div className="s1hub-stat-chip-lbl">{m.lbl}</div>
              <div className="s1hub-stat-chip-val">{m.val}</div>
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
        <div className="s1hub-modal-section" style={{ marginTop: 18 }}>
          <div className="s1hub-modal-section-hdr">
            <div className="s1hub-modal-section-bar" />
            <div className="s1hub-modal-section-title">Equipment Register</div>
          </div>
          <table
            className="s1hub-eq-table"
            style={{ borderBottom: 'none' }}
          >
            <thead>
              <tr style={{ borderBottom: `1px solid ${line.accent}44` }}>
                {['Code', 'Equipment', 't/h', 'kW', 'Cost'].map(h => (
                  <th key={h} className="s1hub-eq-th">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {detail.equipment.map((eq, i) => (
                <tr key={i} className={i % 2 !== 0 ? 's1hub-eq-tr-alt' : ''}>
                  <td className="s1hub-eq-td s1hub-eq-td--code">{eq.code}</td>
                  <td className="s1hub-eq-td s1hub-eq-td--name">{eq.name}</td>
                  <td className="s1hub-eq-td">{eq.tph}</td>
                  <td className="s1hub-eq-td s1hub-eq-td--kw">{eq.kw}</td>
                  <td className="s1hub-eq-td">{eq.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
