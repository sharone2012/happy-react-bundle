import { useState } from "react";
import { C, CANONICAL_MC } from "../../components/S1Shared/S1Shared.jsx";

// ── MC Input field: editable with override indicator ──
function McInput({ streamKey, value, canonical, locked, lockedColor, mcOverride, setMcOverride }) {
  if (locked) {
    return (
      <div className="s1hub-mc-locked">
        <div className="s1hub-mc-locked-val" style={{ color: lockedColor || C.red }}>
          {value}% WB
        </div>
        <div className="s1hub-mc-locked-badge">LOCKED</div>
      </div>
    );
  }

  const isOverridden = mcOverride[streamKey] !== null;

  return (
    <div className="s1hub-mc-wrap">
      <div className={`s1hub-mc-input-box${isOverridden ? ' is-overridden' : ''}`}>
        <input
          type="number"
          className="s1hub-mc-input"
          min="0"
          max="95"
          step="0.5"
          value={isOverridden ? mcOverride[streamKey] : canonical}
          onChange={e => {
            const v = parseFloat(e.target.value);
            setMcOverride(prev => ({ ...prev, [streamKey]: isNaN(v) ? null : v }));
          }}
        />
        <div className="s1hub-mc-input-unit">% WB</div>
      </div>
      {isOverridden && (
        <button
          className="s1hub-mc-reset-btn"
          onClick={() => setMcOverride(prev => ({ ...prev, [streamKey]: null }))}
          title="Reset to lab canonical"
        >
          ↺
        </button>
      )}
    </div>
  );
}

// ── Label / value row ──
function CardRow({ label, subNote, value, valueColor, locked }) {
  return (
    <div className={`s1hub-card-row${locked ? ' s1hub-card-row--locked' : ''}`}>
      <div className="s1hub-card-row-lbl-wrap">
        <span className="s1hub-card-row-lbl">{label}</span>
        {subNote && <span className="s1hub-card-row-sub">{subNote}</span>}
      </div>
      <span className="s1hub-card-row-val" style={valueColor ? { color: valueColor } : undefined}>
        {value}
      </span>
    </div>
  );
}

// ── MC editable row (label + McInput) ──
function McRow({ label, subNote, streamKey, value, canonical, locked, lockedColor, mcOverride, setMcOverride }) {
  return (
    <div className="s1hub-mc-input-row">
      <div className="s1hub-card-row-lbl-wrap">
        <span className="s1hub-card-row-lbl">{label}</span>
        {subNote && <span className="s1hub-card-row-sub">{subNote}</span>}
      </div>
      <McInput
        streamKey={streamKey}
        value={value}
        canonical={canonical}
        locked={locked}
        lockedColor={lockedColor}
        mcOverride={mcOverride}
        setMcOverride={setMcOverride}
      />
    </div>
  );
}

// ── Colored gate badge ──
function BadgeChip({ label, chipColor, chipBg, chipBdr }) {
  return (
    <span
      className="s1hub-badge-chip"
      style={{ '--chip-color': chipColor, '--chip-bg': chipBg, '--chip-bdr': chipBdr }}
    >
      <span className="s1hub-badge-chip-dot" />
      {label}
    </span>
  );
}

// ── Stream detail modal ──
const STREAM_CONFIG = {
  efb: {
    label: 'EFB — Empty Fruit Bunch',
    shortLabel: 'EFB Mechanical Downsizing',
    machineryUrl: '/CFI_S1_Machinery_Combined.html#efb',
    engProcessUrl: '/CFI_S1_Mechanical_Flow.html#efb',
    floorPlanUrl:  '/CFI_S1_ARCH_FloorPlan.html',
    processUrl: '/CFI_S1_EFB_Processing_Line_1Pager.html',
    asciiUrl:   '/CFI_S1_EFB_ASCII_v2.html',
    accentColor: C.teal,
    equipNodes: [
      { name: 'Screw Press',       spec: '30 kW' },
      { name: 'Primary Shredder',  spec: '75 kW' },
      { name: 'Hammer Mill',       spec: '110 kW' },
      { name: 'Buffer Bin',        spec: '50,000 L' },
    ],
    // col4Label used in table header
    col3Label: 'Post-Press (Gate B.G2)',
    col4Label: 'Post-Mill (Gate B.G1)',
    streamRows: [
      { param: 'Moisture Content', liveInput: true,  postPress: '45–50% (max 50%)', postMill: '45–50%',       unit: '% wb',   lock: 'A' },
      { param: 'Throughput',       liveFlow:  true,  postPress: '~14 t/h',           postMill: '~14 t/h',      unit: 't/h FW', lock: 'A' },
      { param: 'Particle Size',    input: 'Bale (compressed)',  postPress: '50–100mm post-shred', postMill: 'D90 ≤ 2mm', unit: 'mm',     lock: 'A' },
      { param: 'Nitrogen (N)',     input: '0.76% DM',  postPress: '0.76% DM', postMill: '0.76% DM', unit: '% DM', lock: 'A' },
      { param: 'Lignin (ADL)',     input: '22.0% DM',  postPress: '22.0% DM', postMill: '22.0% DM', unit: '% DM', lock: 'A' },
      { param: 'Potassium (K)',    input: '2.0% DM',   postPress: '2.0% DM',  postMill: '2.0% DM',  unit: '% DM', lock: 'A' },
      { param: 'Phosphorus (P)',   input: '0.06% DM',  postPress: '0.06% DM', postMill: '0.06% DM', unit: '% DM', lock: 'A' },
      { param: 'C:N Ratio',        input: '60',         postPress: '60',        postMill: '60',        unit: 'ratio', lock: 'A' },
      { param: 'Crude Protein',    input: '4.75% DM',  postPress: '4.75% DM', postMill: '4.75% DM', unit: '% DM', lock: 'A' },
      { param: 'Ash',              input: '5.0% DM',   postPress: '5.0% DM',  postMill: '5.0% DM',  unit: '% DM', lock: 'B' },
      { param: 'pH',               input: '5.75',       postPress: '5.75',      postMill: '5.75',      unit: 'pH',   lock: 'B' },
      { param: 'Bulk Density',     input: '140 kg/m³ (bale)', postPress: null,  postMill: '~280 kg/m³ (est.)', unit: 'kg/m³', lock: 'B' },
    ],
  },
  opdc: {
    label: 'OPDC — Oil Palm Decanter Cake',
    shortLabel: 'OPDC Mechanical Processing',
    machineryUrl: '/CFI_S1_Machinery_Combined.html#opdc',
    engProcessUrl: '/CFI_S1_Mechanical_Flow.html#opdc',
    floorPlanUrl:  '/CFI_S1_ARCH_FloorPlan.html',
    processUrl: '/CFI_S1_OPDC_Processing_Line_1Pager.html',
    asciiUrl:   '/CFI_S1_OPDC_ASCII_v2.html',
    accentColor: C.amber,
    equipNodes: [
      { name: 'Screw Press',   spec: '30 kW' },
      { name: 'Lump Breaker',  spec: '37 kW' },
      { name: 'Hammer Mill',   spec: '110 kW' },
      { name: 'Buffer Bin',    spec: '50,000 L' },
    ],
    col3Label: 'Post-Press (Gate B.G2)',
    col4Label: 'Post-24hr Dwell (Gate C.G2/G3)',
    streamRows: [
      { param: 'Moisture Content', liveInput: true,  postPress: '60–62% (floor 40%)', postMill: '60–62%',           unit: '% wb',   lock: 'A' },
      { param: 'Throughput',       liveFlow:  true,  postPress: '~3.5 t/h',            postMill: '~3.5 t/h',         unit: 't/h FW', lock: 'A' },
      { param: 'Particle Size',    input: 'Cake/chunks',        postPress: '50–100mm post-lump', postMill: 'D90 ≤ 2mm', unit: 'mm',   lock: 'A' },
      { param: 'Nitrogen (N)',     input: '2.32% DM',  postPress: '2.32% DM', postMill: '2.32% DM', unit: '% DM', lock: 'A' },
      { param: 'Lignin (ADL)',     input: '10.78% DM', postPress: '10.78% DM', postMill: '10.78% DM', unit: '% DM', lock: 'B' },
      { param: 'Potassium (K)',    input: '1.20% DM',  postPress: '1.20% DM', postMill: '1.20% DM',  unit: '% DM', lock: 'A' },
      { param: 'Phosphorus (P)',   input: null,         postPress: null,        postMill: null,         unit: '% DM', lock: '—' },
      { param: 'C:N Ratio',        input: '17.85',      postPress: '17.85',     postMill: '17.85',      unit: 'ratio', lock: 'B' },
      { param: 'Crude Protein',    input: '14.5% DM',  postPress: '14.5% DM', postMill: '14.5% DM',  unit: '% DM', lock: 'B' },
      { param: 'pH',               input: '4.40',       postPress: '4.40',      postMill: '8.0–9.0 (PKSA)', unit: 'pH', lock: 'A' },
      { param: 'BSF Score',        input: '4.275/5.0 (Cond. Pass)', postPress: '—', postMill: 'Post-PKSA: Pass', unit: '/ 5.0', lock: 'B' },
    ],
  },
  pos: {
    label: 'POS — Palm Oil Sludge',
    shortLabel: 'POS S1A Dewatering',
    machineryUrl: '/CFI_S1_Machinery_Combined.html#pos',
    engProcessUrl: '/CFI_S1_Mechanical_Flow.html#pos',
    floorPlanUrl:  '/CFI_S1_ARCH_FloorPlan.html',
    processUrl: '/CFI_S1_POS_Processing_Line_1Pager.html',
    asciiUrl:   '/CFI_S1_POS_ASCII_v2.html',
    accentColor: '#3B82F6',
    equipNodes: [
      { name: 'Drum Screen',           spec: '2mm mesh' },
      { name: 'Decanter Centrifuge',   spec: '55 kW' },
      { name: 'Buffer Tank',           spec: '15,000 L' },
    ],
    col3Label: 'Post-Dewater (Centrifuge)',
    col4Label: null, // POS has no 4th gate column
    streamRows: [
      { param: 'Moisture Content',          liveInput: true,  postPress: '65% wb',                    unit: '% wb',     lock: 'A' },
      { param: 'Throughput',                liveFlow:  true,  postPress: '~13.5 t/day FW',            unit: 't/day',    lock: 'A' },
      { param: 'Nitrogen (N)',              input: '1.76% DM',  postPress: '1.76% DM',               unit: '% DM',     lock: 'B' },
      { param: 'Phosphorus (P)',            input: null,         postPress: null,                      unit: '% DM',     lock: '—' },
      { param: 'Potassium (K)',             input: null,         postPress: null,                      unit: '% DM',     lock: '—' },
      { param: 'Crude Protein',             input: '11% DM',    postPress: '11% DM',                  unit: '% DM',     lock: 'B' },
      { param: 'Ash',                       input: '28% DM',    postPress: '28% DM',                  unit: '% DM',     lock: 'B' },
      { param: 'Ether Extract (CPO res.)',  input: '10% DM',    postPress: '10% DM',                  unit: '% DM',     lock: 'B' },
      { param: 'C:N Ratio',                 input: null,         postPress: null,                      unit: 'ratio',    lock: '—' },
      { param: 'Fe (ICP-OES required)',     input: '3,000–8,000 mg/kg DM (est.)', postPress: '3,000–8,000 mg/kg DM (est.)', unit: 'mg/kg DM', lock: 'ICP' },
      { param: 'Mn',                        input: '100–475 mg/kg DM (est.)',      postPress: '100–475 mg/kg DM (est.)',      unit: 'mg/kg DM', lock: 'B' },
    ],
  },
};

const MODAL_TABS = [
  { key: 'overview',   label: 'Overview' },
  { key: 'machinery',  label: 'Machinery' },
  { key: 'process',    label: 'Eng. Process' },
  { key: 'floorplans', label: 'Floor Plans' },
  { key: 'ascii',      label: 'ASCII' },
];

function StreamModal({ streamKey, mb, site, onClose }) {
  const [tab, setTab] = useState('overview');
  const cfg = STREAM_CONFIG[streamKey];
  const s = mb[streamKey];
  const opsH = site?.operating_hrs_day || 20;

  // Build site query params for ASCII iframe (auto-populated from S0 Section A)
  const asciiSrc = (() => {
    const ffb    = site?.ffb_capacity_tph || 60;
    const opsDay = site?.operating_hrs_day || 20;
    const daysM  = site?.operating_days_month || 30;
    const util   = site?.utilisation_pct || 85;
    // S0 Section B formula: effFFB × hrs × days × (OER/100)
    const monthlyFFB = ffb * (util / 100) * opsDay * daysM;
    const cpoAnn = Math.round(monthlyFFB * 0.21 * 12);
    const loc    = [site?.district, site?.province].filter(Boolean).join(', ') || '';
    const params = new URLSearchParams({
      estate: site?.estate_name || '',
      mill:   site?.mill_name   || '',
      loc,
      ffb:    String(ffb),
      cpo:    cpoAnn > 0 ? String(cpoAnn) : '',
    }).toString();
    return `${cfg.asciiUrl}?${params}`;
  })();

  // Per-row cell renderer
  const renderCell = (val) => {
    if (val === null || val === undefined) return <span className="sdt-cell-gap">DATA GAP</span>;
    return val;
  };

  const renderLock = (lock) => {
    if (lock === 'A') return <span className="sdt-lock-a">CLASS A</span>;
    if (lock === 'B') return <span className="sdt-lock-b">B</span>;
    if (lock === 'ICP') return <span className="sdt-lock-icp">ICP-OES</span>;
    return <span className="sdt-lock-b">{lock}</span>;
  };

  const iframeUrl = tab === 'machinery' ? cfg.machineryUrl
    : tab === 'process' ? cfg.engProcessUrl
    : asciiSrc;

  return (
    <div className="s1hub-modal-overlay" onClick={onClose}>
      <div className="s1hub-modal" onClick={e => e.stopPropagation()}
           style={{ '--modal-accent': cfg.accentColor }}>
        {/* Header */}
        <div className="s1hub-modal-hdr">
          <div>
            <div className="s1hub-modal-title">{cfg.label}</div>
            <div className="s1hub-modal-sub">S1 Mechanical Pre-Processing · Detailed view</div>
          </div>
          <button className="s1hub-modal-close" onClick={onClose}>×</button>
        </div>
        {/* Tab bar */}
        <div className="s1hub-modal-tabs">
          {MODAL_TABS.map(t => (
            <button key={t.key}
                    className={`s1hub-modal-tab${tab === t.key ? ' s1hub-modal-tab--active' : ''}`}
                    onClick={() => setTab(t.key)}>{t.label}</button>
          ))}
        </div>
        {/* Body */}
        <div className="s1hub-modal-body">

          {/* ── OVERVIEW ── */}
          {tab === 'overview' && (
            <div className="s1hub-modal-data">
              {/* Equipment nodes */}
              <div className="sdt-section-hdr">{cfg.label} — Equipment Nodes</div>
              <div className="sdt-equip-row">
                {cfg.equipNodes.map((node, i) => (
                  <div key={node.name} className="sdt-equip-node">
                    {i > 0 && <div className="sdt-equip-arrow">→</div>}
                    <div className="sdt-equip-card">
                      <div className="sdt-equip-name">{node.name}</div>
                      <div className="sdt-equip-spec">{node.spec}</div>
                    </div>
                  </div>
                ))}
              </div>
              <a className="sdt-open-line-btn"
                 href={cfg.processUrl}
                 target="_blank"
                 rel="noopener noreferrer">
                Open Full {streamKey.toUpperCase()} Line →
              </a>

              {/* Data table */}
              <div className="sdt-section-hdr sdt-section-hdr--table">
                S1 Overview: {cfg.shortLabel}
              </div>
              <div className="sdt-table-wrap">
                <table className="sdt-table">
                  <thead>
                    <tr>
                      <th>Parameter</th>
                      <th>Input State</th>
                      <th>{cfg.col3Label}</th>
                      {cfg.col4Label && <th>{cfg.col4Label}</th>}
                      <th>Unit</th>
                      <th>Lock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cfg.streamRows.map((row) => {
                      // Live input state calculation
                      let inputCell;
                      if (row.liveInput) {
                        inputCell = `${parseFloat(s?.mcIn ?? 0).toFixed(1)}%`;
                      } else if (row.liveFlow) {
                        const fw = parseFloat(s?.fresh ?? 0);
                        inputCell = fw > 0 ? `${(fw / opsH).toFixed(1)} t/h` : '—';
                      } else {
                        inputCell = row.input;
                      }
                      const isLocked = row.lock === 'A';
                      return (
                        <tr key={row.param} className={isLocked ? 'sdt-row-locked' : ''}>
                          <td className="sdt-td-param">{row.param}</td>
                          <td>{renderCell(inputCell)}</td>
                          <td>{renderCell(row.postPress)}</td>
                          {cfg.col4Label && <td>{renderCell(row.postMill ?? null)}</td>}
                          <td className="sdt-td-unit">{row.unit}</td>
                          <td>{renderLock(row.lock)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── MACHINERY / ENG. PROCESS / ASCII → iframes ── */}
          {(tab === 'machinery' || tab === 'process' || tab === 'ascii') && (
            <iframe
              className="s1hub-modal-iframe"
              src={iframeUrl}
              title={`${cfg.label} ${tab}`}
              sandbox="allow-same-origin allow-scripts allow-popups allow-popups-to-escape-sandbox"
            />
          )}

          {/* ── FLOOR PLANS → iframe ── */}
          {tab === 'floorplans' && (
            <iframe
              className="s1hub-modal-iframe"
              src={cfg.floorPlanUrl}
              title={`${cfg.label} Floor Plan`}
              sandbox="allow-same-origin allow-scripts allow-popups allow-popups-to-escape-sandbox"
            />
          )}

        </div>
      </div>
    </div>
  );
}

export default function S0ResidueStreamCards({ mb, site, mcOverride, setMcOverride, efbPressDuty = 2, efbMillDuty = 5, opdcPressDuty = 1 }) {
  const [activeModal, setActiveModal] = useState(null);

  const showEfb  = !site || site.efb_enabled  !== false;
  const showOpdc = !site || site.opdc_enabled !== false;
  const showPos  = !site || site.pos_enabled  !== false;

  const mcEfb  = mcOverride.efb  ?? CANONICAL_MC.efb;
  const mcOpdc = mcOverride.opdc ?? CANONICAL_MC.opdc;
  const mcPos  = mcOverride.pos  ?? CANONICAL_MC.pos;

  const cards = [
    showEfb && (
      <div
        key="efb"
        className="s1hub-stream-card"
        style={{ '--card-accent': C.teal, '--card-bdr': 'rgba(64,215,197,0.22)' }}
      >
        <div className="s1hub-card-hdr">
          <div className="s1hub-card-title">EFB LINE &ndash; S1A</div>
          <div className="s1hub-card-badge">20 T/H Design</div>
        </div>
        <CardRow label="S0 Inlet Fresh" value={`${mb.efb.fresh} T/Day`} valueColor={C.amber} />
        <McRow
          label="Moisture In"
          subNote={`Lab: ${CANONICAL_MC.efb}% WB · edit → recalculates ↓`}
          streamKey="efb"
          value={mcEfb.toFixed(1)}
          canonical={CANONICAL_MC.efb}
          mcOverride={mcOverride}
          setMcOverride={setMcOverride}
        />
        <CardRow label="Dry Matter" subNote="← recalcs from MC" value={`${mb.efb.dm} T DM/Day`} />
        <CardRow label="Post-Press Out" subNote="← recalcs from MC" value={`${mb.efb.s1Out} T/Day`} valueColor={C.amber} />
        <CardRow label="MC Out (Target)" value={`${mb.efb.mcOut}% WB`} valueColor={C.amber} />
        <CardRow label="Water Removed" subNote="← recalcs from MC" value={`${mb.efb.h2o} T/Day`} />
        <CardRow label="Particle Size" value="D90 ≤ 2 mm" />
        <CardRow label="Presses (N+1)" value={`${efbPressDuty} Duty + 1 Backup`} />
        <CardRow label="Hammer Mills" value={`${efbMillDuty} Duty + 1 Backup`} />
        <div className="s1hub-badge-chips">
          <BadgeChip label="MC ≤ 45% PASS" chipColor="#3DCB7A" chipBg="rgba(61,203,122,.12)" chipBdr="rgba(61,203,122,.5)" />
          <BadgeChip label="D90 ≤ 2mm PASS" chipColor="#3DCB7A" chipBg="rgba(61,203,122,.12)" chipBdr="rgba(61,203,122,.5)" />
        </div>
        <div className="s1hub-card-actions">
          <button className="s1hub-card-action-btn" onClick={() => setActiveModal('efb')}>Open EFB Details</button>
          <a className="s1hub-card-action-link" href="/CFI_S1_EFB_Processing_Line_1Pager.html" target="_blank" rel="noopener noreferrer">↗ View EFB Process Flow</a>
        </div>
      </div>
    ),

    showOpdc && (
      <div
        key="opdc"
        className="s1hub-stream-card"
        style={{ '--card-accent': C.amber, '--card-bdr': 'rgba(245,166,35,0.22)' }}
      >
        <div className="s1hub-card-hdr">
          <div className="s1hub-card-title">OPDC LINE &ndash; S1B</div>
          <div className="s1hub-card-badge">YIELD LOCKED</div>
        </div>
        <CardRow label="S0 Inlet Fresh" value={`${mb.opdc.fresh} T/Day`} valueColor={C.amber} />
        <CardRow label="Yield Lock" value="15.2% of EFB FW" valueColor={C.grey} />
        <McRow
          label="Moisture In"
          subNote={`Lab: ${CANONICAL_MC.opdc}% WB · edit → recalculates ↓`}
          streamKey="opdc"
          value={mcOpdc.toFixed(1)}
          canonical={CANONICAL_MC.opdc}
          mcOverride={mcOverride}
          setMcOverride={setMcOverride}
        />
        <CardRow label="Dry Matter" subNote="← recalcs from MC" value={`${mb.opdc.dm} T DM/Day`} />
        <CardRow label="Post-Press Out" subNote="← recalcs from MC" value={`${mb.opdc.s1Out} T/Day`} valueColor={C.amber} />
        <McRow
          label="MC Floor (LOCKED)"
          streamKey="opdc_out"
          value="40.0"
          canonical={40.0}
          locked
          lockedColor={C.red}
          mcOverride={mcOverride}
          setMcOverride={setMcOverride}
        />
        <CardRow label="Water Removed" subNote="← recalcs from MC" value={`${mb.opdc.h2o} T/Day`} />
        <CardRow label="Press" value={`${opdcPressDuty} Duty + 1 Backup`} />
        <CardRow label="CP% DM" value="14.5 Unchanged" />
        <div className="s1hub-badge-chips">
          <BadgeChip label="40% FLOOR HARD GATE" chipColor={C.red} chipBg="rgba(232,64,64,.12)" chipBdr="rgba(232,64,64,.5)" />
          <BadgeChip label="PORE SAFE" chipColor="#3DCB7A" chipBg="rgba(61,203,122,.12)" chipBdr="rgba(61,203,122,.5)" />
        </div>
        <div className="s1hub-opdc-note">
          OPDC MC floor = 40%. Below this &rarr; pore damage &rarr; BSF colonisation failure.
        </div>
        <div className="s1hub-card-actions">
          <button className="s1hub-card-action-btn" onClick={() => setActiveModal('opdc')}>Open OPDC Details</button>
          <a className="s1hub-card-action-link" href="/CFI_S1_OPDC_Processing_Line_1Pager.html" target="_blank" rel="noopener noreferrer">↗ View OPDC Process Flow</a>
        </div>
      </div>
    ),

    showPos && (
      <div
        key="pos"
        className="s1hub-stream-card"
        style={{ '--card-accent': '#3B82F6', '--card-bdr': 'rgba(59,130,246,0.22)' }}
      >
        <div className="s1hub-card-hdr">
          <div className="s1hub-card-title">POS LINE &ndash; S1C</div>
          <div className="s1hub-card-badge s1hub-card-badge--grey">3-Phase Decanter</div>
        </div>
        <CardRow label="S0 Inlet Fresh" value={`${mb.pos.fresh} T/Day`} valueColor={C.amber} />
        <CardRow label="Capture Point" value="Mill Exit / Sludge Pit" valueColor={C.grey} />
        <CardRow label="Note" value="POS ≠ POME" valueColor={C.red} />
        <McRow
          label="Moisture In"
          subNote={`Lab: ${CANONICAL_MC.pos}% WB · edit → recalculates ↓`}
          streamKey="pos"
          value={mcPos.toFixed(1)}
          canonical={CANONICAL_MC.pos}
          mcOverride={mcOverride}
          setMcOverride={setMcOverride}
        />
        <CardRow label="Dry Matter" subNote="← recalcs from MC" value={`${mb.pos.dm} T DM/Day`} />
        <CardRow label="Post-Decanter Out" subNote="← recalcs from MC" value={`${mb.pos.s1Out} T/Day`} valueColor={C.amber} />
        <CardRow label="MC Out (Target)" value={`${mb.pos.mcOut}% WB`} valueColor={C.amber} />
        <CardRow label="Water Removed" subNote="← recalcs from MC" value={`${mb.pos.h2o} T/Day`} />
        <CardRow label="Centrate" value="→ Return To Pond" valueColor={C.grey} />
        <div className="s1hub-badge-chips">
          <BadgeChip label="MC ≤ 65% PASS" chipColor="#3DCB7A" chipBg="rgba(61,203,122,.12)" chipBdr="rgba(61,203,122,.5)" />
          <BadgeChip label="Fe CFI-LAB-POME-001" chipColor={C.amber} chipBg="rgba(245,166,35,.10)" chipBdr="rgba(245,166,35,.40)" />
        </div>
        <div className="s1hub-card-actions">
          <button className="s1hub-card-action-btn" onClick={() => setActiveModal('pos')}>Open POS Details</button>
          <a className="s1hub-card-action-link" href="/CFI_S1_POS_Processing_Line_1Pager.html" target="_blank" rel="noopener noreferrer">↗ View POS Process Flow</a>
        </div>
      </div>
    ),
  ].filter(Boolean);

  if (cards.length === 0) return null;

  return (
    <div className="s1hub-section-wrap s1hub-section-wrap--sm">
      {/* Section heading */}
      <div className="s1hub-section-hdr s1hub-section-hdr--left">
        <div className="s1hub-section-bar" />
        <div className="s1hub-section-title">S0 Residue Streams &mdash; S1 Input</div>
        <div className="s1hub-section-note">
          Moisture In &middot; editable &rarr; recalculates mass balance
        </div>
      </div>

      {/* Cards grid */}
      <div className="s1hub-stream-cards-grid" style={{ gridTemplateColumns: `repeat(${Math.min(cards.length, 4)}, 1fr)` }}>
        {cards}
      </div>
      {activeModal && (
        <StreamModal
          streamKey={activeModal}
          mb={mb}
          site={site}
          onClose={() => setActiveModal(null)}
        />
      )}
    </div>
  );
}
