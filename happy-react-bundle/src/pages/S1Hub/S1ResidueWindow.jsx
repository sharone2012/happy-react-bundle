import { useState } from "react";
import { C, Fnt } from "../../components/S1Shared/S1Shared.jsx";

/*
 * S1ResidueWindow.jsx
 * Inline (always-visible) residue detail card for the S1 Overview tab.
 * Mirrors the 5 tabs of S1ResidueModal but rendered on-page — no popup.
 *
 * Props:
 *   residueKey   'efb' | 'opdc' | 'pos'
 *   site         mill site object from useMill()
 *   calc         s1Calc computed object
 *   mb           daily mass-balance row (mb.efb / mb.opdc / mb.pos)
 *   equipment    LINE_DETAIL[KEY].equipment array
 *   asciiText    raw ASCII string for this line
 *   asciiHtml    URL for the iframe-based HTML engineering flow
 *   floorHtml    URL for floor plan iframe (or null)
 *   processFlow  array of [label, description] pairs
 *   keySpecs     array of [label, value] pairs
 */

const WINDOW_CONFIG = {
  efb: {
    name: 'EFB',
    fullName: 'Empty Fruit Bunch',
    accent: '#40D7C5',
    subLabel: 'Line S1A — Mechanical Processing',
    mcIn: '62.5%',
    mcOut: '45–50%',
    asciiHtml: '/CFI_S1_EFB_Process_Engineering_Ascii.html',
    floorHtml: null,
  },
  opdc: {
    name: 'OPDC',
    fullName: 'Oil Palm Decanter Cake',
    accent: '#F5A623',
    subLabel: 'Line S1B — Mechanical Processing · CLASS A Gate',
    mcIn: '70–75%',
    mcOut: '≤35%',
    asciiHtml: '/CFI_S1_OPDC_Process_Engineering_Ascii.html',
    floorHtml: null,
  },
  pos: {
    name: 'POS',
    fullName: 'Palm Oil Sludge',
    accent: '#3B82F6',
    subLabel: 'Line S1C — Liquid / Semi-Solid Processing',
    mcIn: '82%',
    mcOut: '65–70%',
    asciiHtml: '/CFI_S1_POS_Process_Engineering_Ascii.html',
    floorHtml: null,
  },
};

const WIN_TABS = [
  { key: 'stream',  label: 'Stream Data' },
  { key: 'mach',   label: 'Machinery' },
  { key: 'flow',   label: 'Process Flow' },
  { key: 'ascii',  label: 'ASCII' },
  { key: 'floor',  label: 'Floor Plan' },
];

/* ─── Stream Data tab ─── */
function WinStreamData({ cfg, site, calc, mb }) {
  const k = cfg.name.toLowerCase().replace('efb', 'efb').replace('opdc', 'opdc').replace('pos', 'pos');
  const fw  = k === 'efb' ? calc?.efbFW  : k === 'opdc' ? calc?.opdcFW  : calc?.posFW;
  const dm  = k === 'efb' ? calc?.efbDM  : k === 'opdc' ? calc?.opdcDM  : calc?.posDM;
  const tph = k === 'efb' ? calc?.efbTPH : k === 'opdc' ? calc?.opdcTPH : calc?.posTPH;
  const fmt = (n) => n != null && n !== '—' ? (typeof n === 'number' ? Math.round(n).toLocaleString() : n) : '—';
  const enabled = site?.[`${k}_enabled`];

  const rows = [
    { label: 'Fresh Weight / month',   val: site ? `${fmt(fw)} t`    : '—', accent: C.amber },
    { label: 'Dry Matter / month',     val: site ? `${fmt(dm)} t DM` : '—', accent: C.teal  },
    { label: 'Flow rate',              val: site ? `${tph} t/h`      : '—', accent: C.amber },
    { label: 'Moisture IN (canonical)', val: cfg.mcIn,                        accent: C.amber },
    { label: 'Moisture OUT (gate)',     val: cfg.mcOut,                       accent: cfg.accent },
    { label: 'Fresh Weight / day',      val: mb?.fresh ? `${mb.fresh} t/day`  : '—', accent: C.teal  },
    { label: 'DM / day',               val: mb?.dm    ? `${mb.dm} t DM/day`  : '—', accent: C.teal  },
    { label: 'S1 Output / day',        val: mb?.s1Out ? `${mb.s1Out} t/day`  : '—', accent: cfg.accent },
    { label: 'Water Pressed / day',    val: mb?.h2o   ? `${mb.h2o} t H₂O`   : '—', accent: '#3B82F6' },
    { label: 'S0 Status',              val: enabled ? 'ACTIVE' : 'INACTIVE', accent: enabled ? '#00A249' : '#A8BDD0' },
  ];

  return (
    <div className="s1win-panel">
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} style={{ borderBottom: '1px solid rgba(30,107,140,0.15)' }}>
              <td style={{ padding: '9px 0', fontFamily: Fnt.dm, fontSize: 12, color: C.grey, width: '58%' }}>{r.label}</td>
              <td style={{ padding: '9px 0', fontFamily: Fnt.mono, fontSize: 13, fontWeight: 700, color: r.accent, textAlign: 'right' }}>{r.val}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─── Machinery tab ─── */
function WinMachinery({ cfg, equipment }) {
  if (!equipment || equipment.length === 0) {
    return <div className="s1win-panel" style={{ color: C.grey, fontFamily: Fnt.dm, fontSize: 13 }}>No equipment data available.</div>;
  }
  return (
    <div className="s1win-panel" style={{ padding: 0, overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 480 }}>
        <thead>
          <tr style={{ background: 'rgba(0,0,0,.35)', borderBottom: `2px solid ${cfg.accent}44` }}>
            <th style={{ padding: '9px 12px', textAlign: 'left', fontFamily: Fnt.syne, fontSize: 11, fontWeight: 700, color: cfg.accent, letterSpacing: '.05em' }}>Tag</th>
            <th style={{ padding: '9px 12px', textAlign: 'left', fontFamily: Fnt.syne, fontSize: 11, fontWeight: 700, color: C.grey, letterSpacing: '.05em' }}>Equipment</th>
            <th style={{ padding: '9px 12px', textAlign: 'right', fontFamily: Fnt.syne, fontSize: 11, fontWeight: 700, color: C.grey, letterSpacing: '.05em' }}>T/H</th>
            <th style={{ padding: '9px 12px', textAlign: 'right', fontFamily: Fnt.syne, fontSize: 11, fontWeight: 700, color: C.grey, letterSpacing: '.05em' }}>kW</th>
            <th style={{ padding: '9px 12px', textAlign: 'right', fontFamily: Fnt.syne, fontSize: 11, fontWeight: 700, color: C.grey, letterSpacing: '.05em' }}>Unit Cost</th>
          </tr>
        </thead>
        <tbody>
          {equipment.map((row, ri) => (
            <tr key={ri} style={{ borderBottom: '1px solid rgba(30,107,140,0.12)', background: ri % 2 === 1 ? 'rgba(0,0,0,.18)' : 'transparent' }}>
              <td style={{ padding: '8px 12px', fontFamily: Fnt.mono, fontSize: 11, color: cfg.accent, fontWeight: 700 }}>{row.code}</td>
              <td style={{ padding: '8px 12px', fontFamily: Fnt.dm, fontSize: 12, color: '#E2EAF4' }}>{row.name}</td>
              <td style={{ padding: '8px 12px', fontFamily: Fnt.mono, fontSize: 11, color: C.grey, textAlign: 'right' }}>{row.tph}</td>
              <td style={{ padding: '8px 12px', fontFamily: Fnt.mono, fontSize: 11, color: C.amber, textAlign: 'right' }}>{row.kw}</td>
              <td style={{ padding: '8px 12px', fontFamily: Fnt.mono, fontSize: 11, color: '#3DCB7A', textAlign: 'right', fontWeight: 700 }}>{row.cost}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─── Process Flow tab ─── */
function WinProcessFlow({ cfg, processFlow, keySpecs }) {
  return (
    <div className="s1win-panel">
      {/* Process Flow steps */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: Fnt.syne, fontSize: 11, fontWeight: 700, color: cfg.accent, letterSpacing: '.07em', textTransform: 'uppercase', marginBottom: 10 }}>
          Process Flow
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            {processFlow.map(([step, desc], i) => (
              <tr key={i} style={{ borderBottom: '1px solid rgba(30,107,140,0.12)' }}>
                <td style={{
                  padding: '8px 12px 8px 0',
                  fontFamily: Fnt.mono,
                  fontSize: 11,
                  fontWeight: 700,
                  color: step.startsWith('■') ? C.red : cfg.accent,
                  width: '18%',
                  verticalAlign: 'top',
                  whiteSpace: 'nowrap',
                }}>
                  {step}
                </td>
                <td style={{ padding: '8px 0', fontFamily: Fnt.dm, fontSize: 12, color: '#C8D8E8', lineHeight: 1.5 }}>{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Key Specs */}
      <div>
        <div style={{ fontFamily: Fnt.syne, fontSize: 11, fontWeight: 700, color: cfg.accent, letterSpacing: '.07em', textTransform: 'uppercase', marginBottom: 10 }}>
          Key Specs
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '6px 20px' }}>
          {keySpecs.map(([lbl, val], i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(30,107,140,0.12)' }}>
              <span style={{ fontFamily: Fnt.dm, fontSize: 11, color: C.grey }}>{lbl}</span>
              <span style={{ fontFamily: Fnt.mono, fontSize: 11, fontWeight: 700, color: C.amber }}>{val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── ASCII tab ─── */
function WinAscii({ cfg, asciiText }) {
  if (!asciiText) {
    return (
      <div className="s1win-panel" style={{ textAlign: 'center', color: C.grey, fontFamily: Fnt.dm, fontSize: 13 }}>
        ASCII flow not available for this line.
      </div>
    );
  }
  return (
    <div style={{ padding: 0 }}>
      <pre style={{
        margin: 0,
        padding: '16px 20px',
        background: '#060C14',
        color: '#A8D4B0',
        fontFamily: Fnt.mono,
        fontSize: 11,
        lineHeight: 1.6,
        overflowX: 'auto',
        whiteSpace: 'pre',
        border: `1px solid ${cfg.accent}22`,
        borderRadius: '0 0 10px 10px',
      }}>
        {asciiText}
      </pre>
    </div>
  );
}

/* ─── Floor Plan tab ─── */
function WinFloorPlan({ cfg }) {
  if (!cfg.floorHtml) {
    return (
      <div className="s1win-panel" style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: Fnt.mono, fontSize: 12, color: C.grey, marginBottom: 8 }}>{cfg.name} Floor Plan</div>
        <div style={{
          display: 'inline-block',
          padding: '10px 24px',
          background: 'rgba(139,160,180,.06)',
          border: '1px solid rgba(139,160,180,.2)',
          borderRadius: 8,
          fontFamily: Fnt.dm,
          fontSize: 12,
          color: 'rgba(168,189,208,0.5)',
        }}>
          Floor plan coming soon
        </div>
        <div style={{ marginTop: 16 }}>
          <a
            href={cfg.asciiHtml}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: Fnt.dm,
              fontSize: 12,
              color: cfg.accent,
              textDecoration: 'none',
              padding: '8px 18px',
              border: `1.5px solid ${cfg.accent}55`,
              borderRadius: 7,
              background: `${cfg.accent}12`,
            }}
          >
            Open Engineering HTML View ↗
          </a>
        </div>
      </div>
    );
  }
  return (
    <div style={{ padding: '12px 0 0' }}>
      <iframe
        src={cfg.floorHtml}
        title={`${cfg.name} Floor Plan`}
        width="100%"
        height="550"
        style={{ border: 'none', display: 'block', borderRadius: '0 0 10px 10px' }}
      />
    </div>
  );
}

/* ─── Main exported component ─── */
export default function S1ResidueWindow({
  residueKey,
  site,
  calc,
  mb,
  equipment,
  asciiText,
  processFlow,
  keySpecs,
}) {
  const [activeTab, setActiveTab] = useState('stream');
  const cfg = WINDOW_CONFIG[residueKey];
  if (!cfg) return null;

  const enabled = site?.[`${residueKey}_enabled`];

  return (
    <div
      className="s1win-card"
      style={{
        '--s1win-accent': cfg.accent,
        borderLeftColor: cfg.accent,
        opacity: (!site || enabled) ? 1 : 0.5,
      }}
    >
      {/* ── Header ── */}
      <div className="s1win-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="s1win-accent-dot" style={{ background: cfg.accent }} />
          <div>
            <div className="s1win-title" style={{ color: cfg.accent }}>
              S1 Overview: {cfg.name} Mechanics
            </div>
            <div className="s1win-subtitle">{cfg.fullName} · {cfg.subLabel}</div>
          </div>
        </div>
        {site && (
          <div
            className="s1win-status-badge"
            style={{
              background: enabled ? 'rgba(0,162,73,.12)' : 'rgba(139,160,180,.08)',
              border: `1px solid ${enabled ? 'rgba(0,162,73,.3)' : 'rgba(139,160,180,.2)'}`,
              color: enabled ? '#00A249' : C.grey,
            }}
          >
            {enabled ? '● ACTIVE' : '○ INACTIVE'}
          </div>
        )}
      </div>

      {/* ── Tab bar ── */}
      <div className="s1win-tabs">
        {WIN_TABS.map(t => (
          <button
            key={t.key}
            className={`s1win-tab-btn${activeTab === t.key ? ' s1win-tab-btn--active' : ''}`}
            style={activeTab === t.key ? { color: cfg.accent, borderBottomColor: cfg.accent } : {}}
            onClick={() => setActiveTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Tab content ── */}
      {activeTab === 'stream' && <WinStreamData cfg={cfg} site={site} calc={calc} mb={mb} />}
      {activeTab === 'mach'   && <WinMachinery  cfg={cfg} equipment={equipment} />}
      {activeTab === 'flow'   && <WinProcessFlow cfg={cfg} processFlow={processFlow} keySpecs={keySpecs} />}
      {activeTab === 'ascii'  && <WinAscii  cfg={cfg} asciiText={asciiText} />}
      {activeTab === 'floor'  && <WinFloorPlan cfg={cfg} />}
    </div>
  );
}
