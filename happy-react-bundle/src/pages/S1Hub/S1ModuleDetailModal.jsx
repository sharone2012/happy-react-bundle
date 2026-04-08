import { C, Fnt } from "../../components/S1Shared/S1Shared.jsx";

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
        ['■ ICP-OES Fe GATE', 'Fe result sets CaCO₃ dose + S2 inclusion'],
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

export default function S1ModuleDetailModal({ moduleModal, setModuleModal }) {
  if (!moduleModal || !MODULE_DETAIL[moduleModal]) return null;

  const d = MODULE_DETAIL[moduleModal];

  return (
    <div
      className="s1hub-modal-overlay"
      style={{ zIndex: 1002 }}
      onClick={() => setModuleModal(null)}
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
            <div>
              <div className="s1hub-modal-title-num">{d.num}</div>
              <div className="s1hub-modal-title-lg s1hub-modal-title-lg--white" style={{ fontSize: 17 }}>{d.title}</div>
            </div>
          </div>
          <button className="s1hub-modal-close-btn" onClick={() => setModuleModal(null)}>ESC ✕</button>
        </div>

        {/* Stats ticker */}
        <div className="s1hub-stats-strip--flex" style={{ marginBottom: 20 }}>
          {d.stats.map((s, i) => (
            <div key={i} className="s1hub-stat-chip s1hub-stat-chip--sm">
              <div className="s1hub-stat-chip-lbl s1hub-stat-chip-lbl--sm">{s.lbl}</div>
              <div className="s1hub-stat-chip-val s1hub-stat-chip-val--md">{s.val}</div>
            </div>
          ))}
        </div>

        {/* Sections */}
        {d.sections.map((sec, si) => (
          <div key={si} className="s1hub-modal-section">
            <div className="s1hub-modal-section-hdr">
              <div className="s1hub-modal-section-bar" />
              <div className="s1hub-modal-section-title">{sec.title}</div>
            </div>
            <div
              className="s1hub-modal-kv-block"
              style={{ border: `1px solid ${d.accent}22` }}
            >
              {sec.rows.map(([label, val], ri) => (
                <div key={ri} className="s1hub-modal-kv-row">
                  <div className="s1hub-modal-kv-lbl">{label}</div>
                  <div className="s1hub-modal-kv-val">{val}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
