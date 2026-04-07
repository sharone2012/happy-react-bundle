import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { C, Fnt } from "../S1Shared/S1Shared.jsx";

/* ─── static config ─── */
const RESIDUES = [
  {
    key: 'efb',
    name: 'EFB',
    fullName: 'Empty Fruit Bunch',
    accent: '#40D7C5',
    mcIn: '62.5%',
    mcOut: '47.5%',
    nodes: ['Shredder', 'Hammer Mill', 'Screw Press', 'Buffer Silo'],
    nodePower: ['450 kW', '37 kW', '110 kW', '5,000 L'],
    outLabel: '≤35% MC',
    outSub: 'After press',
    asciiHtml: '/CFI_S1_EFB_Process_Engineering_Ascii.html',
    floorHtml: null,
    route: '/s1/efb',
  },
  {
    key: 'opdc',
    name: 'OPDC',
    fullName: 'Oil Palm Decanter Cake',
    accent: '#F5A623',
    mcIn: '70–75%',
    mcOut: '≤35%',
    nodes: ['Screw Press', 'Buffer Silo'],
    nodePower: ['110 kW', '5,000 L'],
    outLabel: '≤35% MC',
    outSub: 'CLASS A gate',
    asciiHtml: '/CFI_S1_OPDC_Process_Engineering_Ascii.html',
    floorHtml: null,
    route: '/s1/opdc',
  },
  {
    key: 'pos',
    name: 'POS',
    fullName: 'Palm Oil Sludge',
    accent: '#3B82F6',
    mcIn: '82%',
    mcOut: '65–70%',
    nodes: ['Centrifuge', 'Decanter', 'POME Sep', 'Buffer Tank'],
    nodePower: ['15 kW', '37 kW', '7.5 kW', '10,000 L'],
    outLabel: '65–70% MC',
    outSub: 'Post-skim',
    asciiHtml: '/CFI_S1_POS_Process_Engineering_Ascii.html',
    floorHtml: null,
    route: '/s1/pos',
  },
];

const TABS = ['Stream Data', 'Machinery', 'Process Engineering', 'Floor Plans', 'ASCII'];

const TAB_BAR_STYLE = {
  display: 'flex',
  gap: 4,
  padding: '12px 20px 0',
  borderBottom: '1px solid rgba(30,107,140,0.3)',
  background: '#0A1628',
};

function TabBtn({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '8px 16px',
        borderRadius: '6px 6px 0 0',
        border: 'none',
        background: active ? '#111E33' : 'transparent',
        color: active ? '#40D7C5' : '#A8BDD0',
        fontFamily: Fnt.dm,
        fontSize: 13,
        fontWeight: active ? 700 : 400,
        cursor: 'pointer',
        borderBottom: active ? '2px solid #40D7C5' : '2px solid transparent',
        transition: 'all .15s',
      }}
    >
      {label}
    </button>
  );
}

/* ─── Stream Data tab ─── */
function TabStreamData({ residue, site, calc }) {
  const keyMap = { efb: 'efb', opdc: 'opdc', pos: 'pos' };
  const k = keyMap[residue.key] || 'efb';
  const fw  = k === 'efb' ? calc?.efbFW  : k === 'opdc' ? calc?.opdcFW  : calc?.posFW;
  const dm  = k === 'efb' ? calc?.efbDM  : k === 'opdc' ? calc?.opdcDM  : calc?.posDM;
  const tph = k === 'efb' ? calc?.efbTPH : k === 'opdc' ? calc?.opdcTPH : calc?.posTPH;
  const fmt = (n) => n != null && n !== '—' ? (typeof n === 'number' ? Math.round(n).toLocaleString() : n) : '—';

  const rows = [
    { label: 'Fresh Weight / month', val: site ? `${fmt(fw)} t`      : '\u2014', accent: C.amber },
    { label: 'Dry Matter / month',   val: site ? `${fmt(dm)} t DM`   : '\u2014', accent: C.teal  },
    { label: 'Flow rate',            val: site ? `${tph} t/h`        : '\u2014', accent: C.amber },
    { label: 'Moisture IN',          val: residue.mcIn,                           accent: C.amber },
    { label: 'Moisture OUT',         val: residue.mcOut,                          accent: C.amber },
    { label: 'S0 Status',            val: site?.[`${k}_enabled`] ? 'ACTIVE' : 'INACTIVE', accent: site?.[`${k}_enabled`] ? '#00A249' : '#A8BDD0' },
  ];

  return (
    <div style={{ padding: '20px 24px' }}>
      <div style={{ fontFamily: Fnt.syne, fontSize: 14, fontWeight: 700, color: residue.accent, marginBottom: 16 }}>
        {residue.name} — {residue.fullName}
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} style={{ borderBottom: '1px solid rgba(30,107,140,0.15)' }}>
              <td style={{ padding: '10px 0', fontFamily: Fnt.dm, fontSize: 13, color: C.grey, width: '55%' }}>{r.label}</td>
              <td style={{ padding: '10px 0', fontFamily: Fnt.mono, fontSize: 14, fontWeight: 700, color: r.accent, textAlign: 'right' }}>{r.val}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─── Machinery tab ─── */
function TabMachinery({ residue, nav }) {
  return (
    <div style={{ padding: '20px 24px' }}>
      <div style={{ fontFamily: Fnt.syne, fontSize: 14, fontWeight: 700, color: residue.accent, marginBottom: 16 }}>
        {residue.name} — Equipment Nodes
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12, marginBottom: 20 }}>
        {residue.nodes.map((node, i) => (
          <div key={i} style={{
            background: 'rgba(0,0,0,.3)',
            border: `1.5px solid ${residue.accent}44`,
            borderRadius: 8,
            padding: '12px 16px',
          }}>
            <div style={{ fontFamily: Fnt.dm, fontSize: 13, fontWeight: 700, color: C.white }}>{node}</div>
            <div style={{ fontFamily: Fnt.mono, fontSize: 12, color: residue.accent, marginTop: 4 }}>{residue.nodePower[i]}</div>
          </div>
        ))}
      </div>
      <button
        onClick={() => nav(residue.route)}
        style={{
          padding: '9px 20px',
          background: `${residue.accent}18`,
          border: `1.5px solid ${residue.accent}66`,
          borderRadius: 7,
          fontFamily: Fnt.dm,
          fontSize: 13,
          fontWeight: 700,
          color: residue.accent,
          cursor: 'pointer',
        }}
      >
        Open Full {residue.name} Line →
      </button>
    </div>
  );
}

/* ─── Process Engineering tab (inline JSX) ─── */
function TabProcessEngineering({ residue }) {
  return (
    <div style={{ padding: '20px 24px' }}>
      <div style={{ fontFamily: Fnt.syne, fontSize: 14, fontWeight: 700, color: residue.accent, marginBottom: 16 }}>
        {residue.name} — Process Flow
      </div>
      <div style={{
        background: '#0A1628',
        border: `1.5px solid ${residue.accent}33`,
        borderLeft: `4px solid ${residue.accent}`,
        borderRadius: 10,
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        overflowX: 'auto',
        gap: 0,
      }}>
        {residue.nodes.flatMap((node, ni) => {
          const nodeEl = (
            <div key={`node-${ni}`} style={{
              flexShrink: 0,
              background: 'rgba(0,0,0,.35)',
              border: `1.5px solid ${residue.accent}44`,
              borderRadius: 8,
              padding: '12px 20px',
              textAlign: 'center',
            }}>
              <div style={{ fontFamily: Fnt.dm, fontSize: 13, fontWeight: 700, color: C.white, whiteSpace: 'nowrap' }}>{node}</div>
              <div style={{ fontFamily: Fnt.dm, fontSize: 11, color: 'rgba(168,189,208,0.75)', marginTop: 4, whiteSpace: 'nowrap' }}>{residue.nodePower[ni]}</div>
            </div>
          );
          if (ni < residue.nodes.length - 1) {
            return [nodeEl, (
              <svg key={`arrow-${ni}`} width="48" height="20" style={{ flexShrink: 0 }}>
                <path d="M0,10 L44,10 M38,4 L44,10 L38,16" stroke={residue.accent} strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )];
          }
          return [nodeEl];
        })}
        <svg key="final-arrow" width="48" height="20" style={{ flexShrink: 0 }}>
          <path d="M0,10 L44,10 M38,4 L44,10 L38,16" stroke={residue.accent} strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div style={{
          flexShrink: 0,
          background: `${residue.accent}18`,
          border: `1.5px solid ${residue.accent}88`,
          borderRadius: 8,
          padding: '12px 20px',
          textAlign: 'center',
        }}>
          <div style={{ fontFamily: Fnt.mono, fontSize: 14, fontWeight: 700, color: residue.accent, whiteSpace: 'nowrap' }}>{residue.outLabel}</div>
          <div style={{ fontFamily: Fnt.dm, fontSize: 11, color: 'rgba(168,189,208,0.75)', marginTop: 4, whiteSpace: 'nowrap' }}>{residue.outSub}</div>
        </div>
      </div>
    </div>
  );
}

/* ─── Floor Plans tab ─── */
function TabFloorPlans({ residue }) {
  if (!residue.floorHtml) {
    return (
      <div style={{ padding: '40px 24px', textAlign: 'center' }}>
        <div style={{ fontFamily: Fnt.mono, fontSize: 13, color: C.grey, marginBottom: 8 }}>
          {residue.name} Floor Plan
        </div>
        <div style={{
          display: 'inline-block',
          padding: '12px 28px',
          background: 'rgba(139,160,180,.06)',
          border: '1px solid rgba(139,160,180,.2)',
          borderRadius: 8,
          fontFamily: Fnt.dm,
          fontSize: 13,
          color: 'rgba(168,189,208,0.6)',
        }}>
          Floor plan coming soon
        </div>
      </div>
    );
  }
  return (
    <div style={{ padding: '12px 0 0' }}>
      <iframe
        src={residue.floorHtml}
        title={`${residue.name} Floor Plan`}
        width="100%"
        height="600"
        style={{ border: 'none', display: 'block' }}
      />
    </div>
  );
}

/* ─── ASCII tab ─── */
function TabAscii({ residue }) {
  return (
    <div style={{ padding: '12px 0 0' }}>
      <iframe
        src={residue.asciiHtml}
        title={`${residue.name} ASCII Process Engineering`}
        width="100%"
        height="600"
        style={{ border: 'none', display: 'block' }}
      />
    </div>
  );
}

/* ─── Combined view (shows all 3 residues in list) ─── */
function CombinedView({ site, calc, nav }) {
  return (
    <div style={{ padding: '20px 24px' }}>
      <div style={{ fontFamily: Fnt.syne, fontSize: 14, fontWeight: 700, color: C.teal, marginBottom: 16 }}>
        All Residues — Combined Overview
      </div>
      {RESIDUES.map((r) => {
        const fw  = r.key === 'efb' ? calc?.efbFW  : r.key === 'opdc' ? calc?.opdcFW  : calc?.posFW;
        const dm  = r.key === 'efb' ? calc?.efbDM  : r.key === 'opdc' ? calc?.opdcDM  : calc?.posDM;
        const tph = r.key === 'efb' ? calc?.efbTPH : r.key === 'opdc' ? calc?.opdcTPH : calc?.posTPH;
        const enabled = site?.[`${r.key}_enabled`] ?? false;
        const fmt = (n) => n != null && n !== '—' ? (typeof n === 'number' ? Math.round(n).toLocaleString() : n) : '—';
        return (
          <div key={r.key} style={{
            background: C.navyCard,
            border: `1.5px solid ${C.bdrIdle}`,
            borderLeft: `4px solid ${r.accent}`,
            borderRadius: 10,
            padding: '14px 18px',
            marginBottom: 12,
            opacity: enabled ? 1 : 0.45,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ fontFamily: Fnt.syne, fontSize: 14, fontWeight: 700, color: r.accent }}>{r.name} — {r.fullName}</div>
              <div style={{
                padding: '2px 8px', borderRadius: 4,
                background: enabled ? 'rgba(0,162,73,.12)' : 'rgba(139,160,180,.08)',
                fontFamily: Fnt.mono, fontSize: 9, fontWeight: 700,
                color: enabled ? '#00A249' : C.grey,
              }}>
                {enabled ? 'ACTIVE' : 'INACTIVE'}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
              {[
                { lbl: 'FW / month', val: site ? `${fmt(fw)} t` : '—' },
                { lbl: 'DM / month', val: site ? `${fmt(dm)} t` : '—' },
                { lbl: 'Flow',       val: site ? `${tph} t/h` : '—' },
                { lbl: 'MC IN',      val: r.mcIn },
                { lbl: 'MC OUT',     val: r.mcOut },
              ].map((m, i) => (
                <div key={i}>
                  <div style={{ fontFamily: Fnt.dm, fontSize: 9, fontWeight: 700, color: C.grey, textTransform: 'uppercase', marginBottom: 2 }}>{m.lbl}</div>
                  <div style={{ fontFamily: Fnt.mono, fontSize: 13, fontWeight: 700, color: C.amber }}>{m.val}</div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Main modal ─── */
export default function S1ResidueModal({ active, onClose, site, calc }) {
  const nav = useNavigate();
  const [tab, setTab] = useState(active?.tab ?? 0);

  useEffect(() => {
    setTab(active?.tab ?? 0);
  }, [active]);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!active) return null;

  const isCombined = active.residue === 'combined';
  const residue = isCombined ? null : RESIDUES.find(r => r.key === active.residue);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,.72)',
        backdropFilter: 'blur(4px)',
        zIndex: 9000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 860,
          maxHeight: '90vh',
          background: '#060C14',
          border: '1.5px solid rgba(30,107,140,0.4)',
          borderRadius: 14,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid rgba(30,107,140,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#0A1628',
          flexShrink: 0,
        }}>
          <div>
            <div style={{ fontFamily: Fnt.syne, fontSize: 15, fontWeight: 700, color: isCombined ? '#40D7C5' : residue?.accent }}>
              {isCombined ? 'All Residues — Combined View' : `${residue?.name} — ${residue?.fullName}`}
            </div>
            <div style={{ fontFamily: Fnt.dm, fontSize: 11, color: C.grey, marginTop: 2 }}>S1 Mechanical Pre-Processing · Detailed view</div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 32, height: 32,
              borderRadius: 6,
              border: '1.5px solid rgba(139,160,180,.25)',
              background: 'transparent',
              color: C.grey,
              fontFamily: Fnt.mono,
              fontSize: 18,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        {/* Tab bar (only for single residue) */}
        {!isCombined && (
          <div style={TAB_BAR_STYLE}>
            {TABS.map((t, i) => (
              <TabBtn key={i} label={t} active={tab === i} onClick={() => setTab(i)} />
            ))}
          </div>
        )}

        {/* Body */}
        <div style={{ overflowY: 'auto', flex: 1 }}>
          {isCombined ? (
            <CombinedView site={site} calc={calc} nav={nav} />
          ) : (
            <>
              {tab === 0 && <TabStreamData residue={residue} site={site} calc={calc} />}
              {tab === 1 && <TabMachinery residue={residue} nav={nav} />}
              {tab === 2 && <TabProcessEngineering residue={residue} />}
              {tab === 3 && <TabFloorPlans residue={residue} />}
              {tab === 4 && <TabAscii residue={residue} />}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
