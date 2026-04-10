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
    processUrl:  '/CFI_S1_EFB_Processing_Line_1Pager.html',
    asciiUrl:    '/CFI_S1_EFB_Process_Engineering_Ascii.html',
    accentColor: C.teal,
  },
  opdc: {
    label: 'OPDC — Oil Palm Decanter Cake',
    processUrl:  '/CFI_S1_OPDC_Processing_Line_1Pager.html',
    asciiUrl:    '/CFI_S1_OPDC_Process_Engineering_Ascii.html',
    accentColor: C.amber,
  },
  pos: {
    label: 'POS — Palm Oil Sludge',
    processUrl:  '/CFI_S1_POS_Processing_Line_1Pager.html',
    asciiUrl:    '/CFI_S1_POS_Process_Engineering_Ascii.html',
    accentColor: '#3B82F6',
  },
};

const MODAL_TABS = [
  { key: 'data',    label: 'Stream Data' },
  { key: 'process', label: 'Process Engineering' },
  { key: 'ascii',   label: 'ASCII' },
];

function StreamModal({ streamKey, mb, site, onClose }) {
  const [tab, setTab] = useState('data');
  const cfg = STREAM_CONFIG[streamKey];
  const s = mb[streamKey];
  const days = site?.operating_days_month || 30;
  const opsH = site?.operating_hrs_day || 20;

  const fmtM = (tpd) => {
    const v = parseFloat(tpd);
    return isFinite(v) && v > 0 ? (v * days).toFixed(0) : '—';
  };

  return (
    <div className="s1hub-modal-overlay" onClick={onClose}>
      <div className="s1hub-modal" onClick={e => e.stopPropagation()}
           style={{ '--modal-accent': cfg.accentColor }}>
        <div className="s1hub-modal-hdr">
          <div>
            <div className="s1hub-modal-title">{cfg.label}</div>
            <div className="s1hub-modal-sub">S1 Mechanical Pre-Processing · Detailed view</div>
          </div>
          <button className="s1hub-modal-close" onClick={onClose}>×</button>
        </div>
        <div className="s1hub-modal-tabs">
          {MODAL_TABS.map(t => (
            <button key={t.key}
                    className={`s1hub-modal-tab${tab === t.key ? ' s1hub-modal-tab--active' : ''}`}
                    onClick={() => setTab(t.key)}>{t.label}</button>
          ))}
        </div>
        <div className="s1hub-modal-body">
          {tab === 'data' && (
            <div className="s1hub-modal-data">
              <div className="s1hub-modal-section-title">{cfg.label}</div>
              {[
                { lbl: 'Fresh Weight / month', val: `${fmtM(s.fresh)} t` },
                { lbl: 'Dry Matter / month',   val: `${fmtM(s.dm)} t DM` },
                { lbl: 'Flow rate',            val: `${(parseFloat(s.fresh) / opsH).toFixed(1)} t/h` },
                { lbl: 'Moisture IN',          val: `${s.mcIn}%` },
                { lbl: 'Moisture OUT',         val: `${s.mcOut}%` },
                { lbl: 'SO Status',            val: 'ACTIVE', valColor: '#3DCB7A' },
              ].map(row => (
                <div key={row.lbl} className="s1hub-modal-row">
                  <span className="s1hub-modal-row-lbl">{row.lbl}</span>
                  <span className="s1hub-modal-row-val" style={row.valColor ? { color: row.valColor } : undefined}>{row.val}</span>
                </div>
              ))}
            </div>
          )}
          {(tab === 'process' || tab === 'ascii') && (
            <iframe
              className="s1hub-modal-iframe"
              src={tab === 'process' ? cfg.processUrl : cfg.asciiUrl}
              title={`${cfg.label} ${tab}`}
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
