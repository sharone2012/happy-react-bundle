import { useState } from "react";
import { useNavigate } from "react-router-dom";

/*
 * S1Shared.jsx — Shared foundation for all S1 pages
 * Design system: S0-aligned dark navy theme (canonical tokens)
 */

// ── S0 DESIGN TOKENS ──
export const C = {
  navy:      '#060C14',
  navyMid:   '#0A1628',
  navyCard:  '#111E33',
  navyField: '#142030',
  navyDeep:  '#0C1E33',
  teal:      '#40D7C5',
  tealDim:   'rgba(64,215,197,0.12)',
  tealBdr:   'rgba(64,215,197,0.60)',
  amber:     '#F5A623',
  amberDim:  'rgba(245,166,35,0.14)',
  green:     '#00A249',
  greenDim:  'rgba(0,162,73,0.13)',
  red:       '#E84040',
  redDim:    'rgba(232,64,64,0.13)',
  grey:      '#A8BDD0',
  greyLt:    'rgba(168,189,208,0.75)',
  greyMd:    '#A8B8C7',
  white:     '#E8F0FE',
  blue:      '#4A9EDB',
  blueDim:   'rgba(74,158,219,0.12)',
  blueBdr:   'rgba(74,158,219,0.50)',
  bdrIdle:   'rgba(255,255,255,0.06)',
  bdrCalc:   'rgba(139,160,180,0.18)',
  border:    '#1E6B8C',
};

export const Fnt = {
  syne:  "'Syne', sans-serif",
  dm:    "'DM Sans', sans-serif",
  mono:  "'DM Mono', monospace",
  brand: "'EB Garamond', serif",
};

export const LINE_COLORS = {
  EFB:  C.teal,
  OPDC: C.amber,
  POS:  '#3B82F6',
};

// ── S1 CSS (matches S3Landing exactly) ──
export const S1_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;600;700&family=DM+Mono:wght@500;700&family=EB+Garamond:wght@400;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{font-family:'DM Sans',sans-serif;background:#070D16;color:#F0F4F8;min-height:100vh;font-size:14px;overflow-x:hidden}

.s1-hdr{height:80px;background:#0A1628;display:flex;align-items:center;padding:0 28px;position:sticky;top:0;z-index:301;gap:18px}
.s1-brand{display:flex;align-items:baseline}
.s1-brand-cfi{font-family:'EB Garamond',serif;font-weight:700;font-size:26px;color:#FFF;letter-spacing:0.02em;white-space:nowrap}
.s1-brand-dot{font-family:'EB Garamond',serif;font-size:22px;color:rgba(255,255,255,0.25);margin:0 8px}
.s1-brand-dt{font-family:'EB Garamond',serif;font-weight:700;font-size:20px;color:#40D7C5;letter-spacing:0.10em;white-space:nowrap}
.s1-brand-sub{font-size:11px;color:#40D7C5;margin-top:4px;font-family:'DM Sans',sans-serif}
.s1-pills{display:flex;gap:4px;margin-left:auto;align-items:center;flex-shrink:0}
.s1-pill{border-radius:4px;padding:3px 9px;font-family:'DM Mono',monospace;font-size:11px;font-weight:700;cursor:pointer;white-space:nowrap;border:1px solid rgba(168,189,208,0.18);background:rgba(168,189,208,0.09);color:#A8BDD0}
.s1-pill-active{background:#40D7C5;border-color:#40D7C5;color:#060C14}

.stage-hdr{background:#153352;border-bottom:1.5px solid #1E6B8C;padding:16px 28px;display:flex;align-items:center;justify-content:space-between;gap:16px;position:sticky;top:80px;z-index:300}
.stage-badge{display:flex;align-items:center;gap:14px}
.stage-num{width:48px;height:48px;border-radius:10px;background:rgba(0,201,177,.15);border:2px solid #40D7C5;display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-weight:700;font-size:18px;color:#40D7C5;flex-shrink:0}
.stage-title{font-family:'Syne',sans-serif;font-weight:700;font-size:18px;color:#F0F4F8;line-height:1.2}
.stage-sub{font-family:'DM Sans',sans-serif;font-size:11px;color:#8BA0B4;margin-top:3px}
.stage-hdr-right{display:flex;gap:10px;align-items:center;flex-wrap:wrap}
.bdg{font-family:'Syne',sans-serif;font-weight:700;font-size:10px;padding:4px 12px;border-radius:20px;border:1px solid;white-space:nowrap}
.bdg-t{background:rgba(0,201,177,.08);color:#40D7C5;border-color:#40D7C5}
.bdg-a{background:rgba(245,166,35,.08);color:#F5A623;border-color:#F5A623}
.bdg-g{background:rgba(61,203,122,.08);color:#3DCB7A;border-color:#3DCB7A}
.bdg-r{background:rgba(232,64,64,.08);color:#E84040;border-color:#E84040}
.bdg-b{background:rgba(74,158,219,.08);color:#4A9EDB;border-color:#4A9EDB}

.breadcrumb{display:flex;align-items:center;gap:0;padding:8px 28px;background:rgba(0,0,0,.3);border-bottom:1px solid rgba(30,107,140,.25);overflow-x:auto;scrollbar-width:none}
.breadcrumb::-webkit-scrollbar{display:none}
.bc-item{display:flex;align-items:center;gap:8px;white-space:nowrap}
.bc-stage{font-family:'DM Mono',monospace;font-size:11px;font-weight:700;padding:3px 10px;border-radius:4px}
.bc-done{background:rgba(61,203,122,.1);color:#3DCB7A;border:1px solid rgba(61,203,122,.3)}
.bc-active{background:rgba(0,201,177,.15);color:#40D7C5;border:1px solid #40D7C5}
.bc-pending{background:rgba(139,160,180,.06);color:#8BA0B4;border:1px solid rgba(139,160,180,.2)}
.bc-arrow{color:rgba(30,107,140,.6);font-size:14px;margin:0 4px}

.handoff-banner{margin:20px 28px 0;padding:14px 18px;background:rgba(61,203,122,.06);border:1.5px solid rgba(61,203,122,.3);border-radius:8px;display:flex;align-items:center;gap:18px;flex-wrap:wrap}
.ho-label{font-family:'DM Sans',sans-serif;font-weight:700;font-size:11px;color:#3DCB7A;text-transform:uppercase;letter-spacing:.5px;white-space:nowrap}
.ho-pills{display:flex;gap:8px;flex-wrap:wrap}
.ho-pill{display:flex;flex-direction:column;align-items:center;background:#070D16;border:1px solid rgba(30,107,140,.4);border-radius:6px;padding:6px 14px}
.ho-val{font-family:'DM Mono',monospace;font-weight:700;font-size:15px;color:#F5A623}
.ho-unit{font-family:'DM Sans',sans-serif;font-size:9px;color:#8BA0B4;margin-top:1px}

.content{padding:20px 28px 48px}

.sec-title{font-family:'Syne',sans-serif;font-weight:700;font-size:13px;color:#8BA0B4;text-transform:uppercase;letter-spacing:.6px;margin:28px 0 12px;display:flex;align-items:center;gap:8px}
.sec-title::before{content:'';width:3px;height:14px;border-radius:2px;display:inline-block}
.st-teal::before{background:#40D7C5}
.st-amber::before{background:#F5A623}
.st-green::before{background:#3DCB7A}
.st-red::before{background:#E84040}
.st-blue::before{background:#4A9EDB}

.module-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:14px}
.module-btn{background:#153352;border:1.5px solid #1E6B8C;border-radius:10px;padding:18px 20px;cursor:pointer;transition:all .2s;display:flex;flex-direction:column;gap:10px;text-align:left;position:relative;overflow:hidden;text-decoration:none}
.module-btn::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:var(--accent,#40D7C5)}
.module-btn:hover{border-color:var(--accent,#40D7C5);background:rgba(21,51,82,.9);transform:translateY(-1px);box-shadow:0 6px 24px rgba(0,0,0,.4)}
.mb-icon{width:40px;height:40px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0}
.mb-num{font-family:'DM Mono',monospace;font-weight:700;font-size:11px;color:#8BA0B4;margin-bottom:2px}
.mb-title{font-family:'Syne',sans-serif;font-weight:700;font-size:14px;color:#F0F4F8;line-height:1.3}
.mb-desc{font-family:'DM Sans',sans-serif;font-size:11px;color:#A8B8C7;line-height:1.6}
.mb-tags{display:flex;gap:5px;flex-wrap:wrap;margin-top:2px}
.mb-tag{font-family:'DM Sans',sans-serif;font-size:9px;font-weight:700;padding:2px 7px;border-radius:20px;border:1px solid rgba(30,107,140,.4);color:#8BA0B4;background:rgba(30,107,140,.1)}
.mb-status{position:absolute;top:12px;right:14px;font-family:'DM Sans',sans-serif;font-weight:700;font-size:9px;padding:2px 8px;border-radius:20px}
.ms-live{background:rgba(61,203,122,.15);color:#3DCB7A;border:1px solid rgba(61,203,122,.3)}

.metrics-strip{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:10px;margin-bottom:24px}
.metric{background:#153352;border:1.5px solid #1E6B8C;border-radius:8px;padding:12px 16px}
.metric-lbl{font-family:'DM Sans',sans-serif;font-weight:700;font-size:10px;color:#8BA0B4;text-transform:uppercase;letter-spacing:.5px;margin-bottom:5px}
.metric-val{font-family:'DM Mono',monospace;font-weight:700;font-size:18px;color:#F5A623}
.metric-unit{font-family:'DM Sans',sans-serif;font-size:10px;color:#A8B8C7;margin-top:2px}

.guardrail-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:10px;margin-top:10px}
.guardrail{background:#153352;border:1.5px solid #1E6B8C;border-radius:8px;padding:12px 16px;display:flex;align-items:flex-start;gap:10px}
.gr-icon{width:28px;height:28px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0}
.gr-lbl{font-family:'DM Sans',sans-serif;font-weight:700;font-size:11px;color:#F0F4F8;margin-bottom:2px}
.gr-val{font-family:'DM Mono',monospace;font-weight:700;font-size:13px;margin-bottom:2px}
.gr-note{font-family:'DM Sans',sans-serif;font-size:10px;color:#8BA0B4}
`;

// ── S0 HEADER COMPONENT ──
export function S0Header({ activeStage = 1 }) {
  const nav = useNavigate();
  const stages = ['S0','S1','S2','S3','S4','S5','S6','CAPEX','Σ'];
  const routes = ['/','/s1',null,'/s3',null,null,null,null,null];
  return (
    <div className="s1-hdr">
      <div style={{ display:'flex', alignItems:'center', flexShrink:0, maxWidth:340 }}>
        <div>
          <div className="s1-brand">
            <span className="s1-brand-cfi">CFI</span>
            <span className="s1-brand-dot">&middot;</span>
            <span className="s1-brand-dt">DEEP TECH</span>
          </div>
          <div className="s1-brand-sub">Soil Microbiome Engineering &amp; Biofertiliser Production for Closed&#x2011;Loop Nutrient Recycling</div>
        </div>
      </div>
      <div className="s1-pills">
        {stages.map((s, i) => (
          <div
            key={s}
            className={`s1-pill${i === activeStage ? ' s1-pill-active' : ''}`}
            onClick={() => routes[i] && nav(routes[i])}
          >{s}</div>
        ))}
      </div>
    </div>
  );
}

// ── BREADCRUMB ──
export function S1Breadcrumb({ activeLine }) {
  const items = [
    { label: 'S0 · Site Config', status: 'done' },
    { label: 'S1 · Mechanical', status: activeLine ? 'done' : 'active' },
    { label: 'S2 · Chemical (PKSA)', status: 'pending' },
    { label: 'S3 · Biological', status: 'pending' },
    { label: 'S4 · BSF Grow-Out', status: 'pending' },
    { label: 'S5 · Harvest + Separate', status: 'pending' },
    { label: 'S6 · Product + Carbon', status: 'pending' },
  ];
  if (activeLine) {
    items[1] = { label: 'S1 · Mechanical', status: 'done' };
    items.splice(2, 0, { label: `S1 · ${activeLine}`, status: 'active' });
  }
  return (
    <div className="breadcrumb">
      <div className="bc-item">
        {items.map((it, i) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
            {i > 0 && <span className="bc-arrow">→</span>}
            <span className={`bc-stage bc-${it.status}`}>
              {it.status === 'active' ? `${it.label} ← You Are Here` : it.label}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ── COLLAPSIBLE SECTION ──
export function CollapsibleSection({ title, number, accent = C.teal, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ marginBottom: 16 }}>
      <div
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px',
          background: C.navyCard, border: `1.5px solid ${open ? accent : C.bdrIdle}`,
          borderLeft: `4px solid ${accent}`, borderRadius: 11, cursor: 'pointer',
          transition: 'all .2s', userSelect: 'none',
        }}
      >
        <div style={{
          width: 28, height: 28, borderRadius: 6,
          background: `${accent}22`, border: `1px solid ${accent}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: Fnt.mono, fontSize: 12, fontWeight: 700, color: accent,
        }}>{number}</div>
        <div style={{ fontFamily: Fnt.syne, fontSize: 14, fontWeight: 700, color: C.white, flex: 1 }}>{title}</div>
        <div style={{
          fontSize: 14, color: C.grey, transition: 'transform .2s',
          transform: open ? 'rotate(0deg)' : 'rotate(-90deg)',
        }}>▼</div>
      </div>
      {open && (
        <div style={{
          background: C.navyCard, border: `1.5px solid ${C.bdrIdle}`,
          borderTop: 'none', borderRadius: '0 0 11px 11px', padding: '20px 24px',
        }}>
          {children}
        </div>
      )}
    </div>
  );
}

// ── PRE (ASCII ART) ──
export function Pre({ children, accent = C.teal }) {
  return (
    <pre style={{
      background: C.navy, border: `1.5px solid ${C.bdrIdle}`, borderRadius: 8,
      padding: '20px 24px', fontFamily: Fnt.mono, fontSize: 11, lineHeight: 1.6,
      color: C.white, overflowX: 'auto', whiteSpace: 'pre', margin: 0,
    }}>
      <style>{`
        .gate-amber { color: ${C.amber}; font-weight: 700; }
        .gate-red { color: ${C.red}; font-weight: 700; }
        .gate-blue { color: #3B82F6; font-weight: 700; }
        .gate-teal { color: ${C.teal}; font-weight: 700; }
        .gate-green { color: ${C.green}; font-weight: 700; }
        .node-label { color: ${accent}; font-weight: 700; }
        .dim { color: ${C.grey}; }
      `}</style>
      {children}
    </pre>
  );
}

// ── NODE CARD (expandable equipment card from floor plan pages) ──
export function NodeCard({ node, accent = C.teal }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      onClick={() => setExpanded(!expanded)}
      style={{
        background: C.navyCard,
        border: `1px solid ${expanded ? C.tealBdr : C.bdrIdle}`,
        borderLeft: `4px solid ${expanded ? accent : C.bdrCalc}`,
        borderRadius: 6, padding: '14px 18px', marginBottom: 8,
        cursor: 'pointer', transition: 'all .15s',
        boxShadow: expanded ? '0 2px 12px rgba(64,215,197,.10)' : 'none',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 30, height: 30, borderRadius: 6,
          background: accent, color: C.navy,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: Fnt.mono, fontSize: 11, fontWeight: 700, flexShrink: 0,
        }}>{node.id}</div>
        <div style={{ fontFamily: Fnt.mono, fontSize: 12, fontWeight: 700, color: C.amber, minWidth: 100 }}>{node.tag}</div>
        <div style={{ flex: 1, fontFamily: Fnt.syne, fontSize: 13, fontWeight: 600, color: C.white }}>{node.name}</div>
        {node.gate && <span style={{ fontFamily: Fnt.mono, fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: node.gate.bg, color: node.gate.color, border: `1px solid ${node.gate.color}` }}>{node.gate.label}</span>}
        <span style={{ fontFamily: Fnt.dm, fontSize: 11, color: C.grey }}>{expanded ? '▲' : '▼'}</span>
      </div>
      {expanded && (
        <div style={{ marginTop: 12 }}>
          <div style={{
            display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '6px 14px',
            background: C.navyField, padding: 14, borderRadius: 6, fontSize: 12,
            border: `1px solid ${C.bdrIdle}`,
          }}>
            {node.specs.map(([label, value], i) => (
              <div key={i} style={{ display: 'contents' }}>
                <span style={{ fontFamily: Fnt.dm, color: C.grey, fontWeight: 600, fontSize: 11 }}>{label}</span>
                <span style={{ fontFamily: Fnt.mono, fontWeight: 500, color: C.white, fontSize: 11 }}>{value}</span>
              </div>
            ))}
          </div>
          {node.footer && (
            <div style={{ marginTop: 10, paddingTop: 8, borderTop: `1px solid ${C.bdrCalc}`, fontFamily: Fnt.dm, fontSize: 11, color: C.greyLt }}>{node.footer}</div>
          )}
          {node.warning && (
            <div style={{ marginTop: 8, padding: '8px 12px', background: 'rgba(232,64,64,.07)', border: '1px solid rgba(232,64,64,.3)', borderRadius: 5, fontFamily: Fnt.dm, fontSize: 10, color: C.red, lineHeight: 1.6 }}>{node.warning}</div>
          )}
        </div>
      )}
    </div>
  );
}

// ── BUILDING DIAGRAM ──
export function BuildingDiagram({ building, accent = C.teal }) {
  return (
    <div style={{ padding: '24px 0' }}>
      <div style={{ textAlign: 'center', marginBottom: 8 }}>
        <div style={{ fontFamily: Fnt.dm, fontSize: 11, fontWeight: 600, color: accent }}>Width</div>
        <div style={{ height: 2, background: C.bdrCalc, margin: '4px auto', maxWidth: 400, position: 'relative' }}>
          <div style={{ position: 'absolute', left: 0, top: -4, width: 2, height: 10, background: C.tealBdr }} />
          <div style={{ position: 'absolute', right: 0, top: -4, width: 2, height: 10, background: C.tealBdr }} />
        </div>
        <div style={{ fontFamily: Fnt.mono, fontSize: 13, fontWeight: 700, color: accent }}>{building.width}</div>
      </div>
      <div style={{
        border: `2px solid ${C.tealBdr}`, background: C.tealDim,
        padding: 24, position: 'relative', maxWidth: 400, margin: '0 auto', borderRadius: 6,
      }}>
        <div style={{
          position: 'absolute', right: -60, top: 0, bottom: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ width: 2, flex: 1, background: C.bdrCalc, position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: -4, width: 10, height: 2, background: C.tealBdr }} />
            <div style={{ position: 'absolute', bottom: 0, left: -4, width: 10, height: 2, background: C.tealBdr }} />
          </div>
          <div style={{ fontFamily: Fnt.dm, fontSize: 11, fontWeight: 600, color: accent, writingMode: 'vertical-rl', transform: 'rotate(180deg)', margin: '8px 0' }}>Length</div>
          <div style={{ fontFamily: Fnt.mono, fontSize: 13, fontWeight: 700, color: accent, writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>{building.length}</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: Fnt.syne, fontSize: 14, fontWeight: 700, color: C.white, marginBottom: 4 }}>{building.name}</div>
          <div style={{ fontFamily: Fnt.dm, fontSize: 12, color: C.grey }}>S1 Mechanical Equipment Layout</div>
          <div style={{ fontFamily: Fnt.mono, fontSize: 12, color: C.grey, marginTop: 4 }}>Area: {building.area} · Height: {building.height}</div>
        </div>
      </div>
    </div>
  );
}

// ── TICKER BAR ──
export function TickerBar({ items }) {
  return (
    <div style={{
      borderBottom: `1px solid ${C.bdrIdle}`, padding: '8px 24px',
      display: 'flex', gap: 0, overflowX: 'auto', background: C.navyMid,
    }}>
      {items.map((k, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '0 16px',
          borderRight: i < items.length - 1 ? `1px solid ${C.bdrCalc}` : 'none', whiteSpace: 'nowrap',
        }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: C.grey, textTransform: 'uppercase', letterSpacing: '.06em', fontFamily: Fnt.dm }}>{k.label}</span>
          <span style={{ fontFamily: Fnt.mono, fontSize: 14, fontWeight: 700, color: k.color || C.teal }}>{k.val}</span>
        </div>
      ))}
    </div>
  );
}

// ── CONVEYOR TABLE ──
export function ConveyorTable({ conveyors, accent = C.teal }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
        <thead>
          <tr style={{ background: 'rgba(0,0,0,.3)' }}>
            {['Code', 'Type', 'Length', 'Power', 'Route'].map(h => (
              <th key={h} style={{ padding: '8px 10px', textAlign: 'left', fontFamily: Fnt.mono, fontSize: 10, fontWeight: 700, color: C.grey, textTransform: 'uppercase', borderBottom: `1px solid ${C.bdrIdle}` }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {conveyors.map((cv, i) => (
            <tr key={i} style={{ borderBottom: `1px solid rgba(30,107,140,.15)` }}>
              <td style={{ padding: '6px 10px', fontFamily: Fnt.mono, fontSize: 11, fontWeight: 700, color: accent }}>{cv.code}</td>
              <td style={{ padding: '6px 10px', fontFamily: Fnt.dm, fontSize: 11, color: C.white }}>{cv.type}</td>
              <td style={{ padding: '6px 10px', fontFamily: Fnt.mono, fontSize: 11, color: C.amber }}>{cv.length}</td>
              <td style={{ padding: '6px 10px', fontFamily: Fnt.mono, fontSize: 11, color: C.teal }}>{cv.power}</td>
              <td style={{ padding: '6px 10px', fontFamily: Fnt.dm, fontSize: 10, color: C.grey }}>{cv.route}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── LINE HERO BANNER ──
export function LineHero({ name, throughput, power, nodes, accent, badges = [] }) {
  return (
    <div className="stage-hdr">
      <div className="stage-badge">
        <div className="stage-num" style={{ borderColor: accent, color: accent, background: `${accent}22` }}>S1</div>
        <div>
          <div className="stage-title">{name}</div>
          <div className="stage-sub">CFI Deep Tech · 60 TPH FFB Mill · Bogor, West Java · v2.0 Mar 2026</div>
        </div>
      </div>
      <div className="stage-hdr-right">
        {badges.map((b, i) => <span key={i} className={`bdg ${b.cls}`}>{b.text}</span>)}
        <span className="bdg bdg-t">{nodes} Equipment Nodes</span>
        <span className="bdg bdg-a">{throughput}</span>
        <span className="bdg bdg-g">{power}</span>
      </div>
    </div>
  );
}

// ── SUBSTRATE FLOW STRIP ──
export function SubstrateFlowStrip({ stageLabel, inflows, outflows }) {
  const [activeNote, setActiveNote] = useState(null);
  const toggleNote = (key) => setActiveNote((p) => (p === key ? null : key));

  const F = Fnt.dm;
  const s = {
    stripLabel: { background: C.navyField, borderBottom: `1px solid ${C.tealBdr}`, padding: '6px 24px', fontFamily: F, fontSize: 10, fontWeight: 700, color: C.teal, textTransform: 'uppercase', letterSpacing: '.1em', display: 'flex', alignItems: 'center', gap: 12 },
    stripLabelSub: { fontFamily: F, fontWeight: 400, textTransform: 'none', letterSpacing: 0, fontSize: 10, color: C.grey },
    rdWrapper: { display: 'grid', gridTemplateColumns: '64px repeat(4,1fr) 64px 66px repeat(4,1fr)', width: '100%', borderBottom: '2px solid rgba(64,215,197,0.22)', background: C.navy },
    rdLabel: (side) => ({ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', background: C.navyMid, borderRight: side === 'in' ? '1px solid rgba(64,215,197,0.25)' : 'none', borderLeft: side === 'out' ? '1px solid rgba(64,215,197,0.25)' : 'none', padding: '0 10px', width: 64, writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)', whiteSpace: 'nowrap', cursor: 'default' }),
    rdLabelWord: { fontFamily: Fnt.syne, fontSize: 16, fontWeight: 700, color: C.amber, letterSpacing: '.04em' },
    rdField: (isActive) => ({ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '9px 4px', cursor: 'pointer', transition: 'background .15s', position: 'relative', background: isActive ? 'rgba(64,215,197,0.08)' : 'transparent' }),
    rdTitle: { fontFamily: F, fontSize: 10, fontWeight: 700, color: C.grey, textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 3, whiteSpace: 'nowrap' },
    rdNum: (c) => ({ fontFamily: F, fontSize: 14, fontWeight: 700, color: c || C.amber, lineHeight: 1.2, whiteSpace: 'nowrap' }),
    rdUnit: { fontFamily: F, fontSize: 10, color: C.grey, marginTop: 2, whiteSpace: 'nowrap' },
    rdArrow: { display: 'flex', alignItems: 'center', justifyContent: 'center', background: C.navy, fontFamily: F, fontSize: 99, fontWeight: 900, color: C.teal, lineHeight: 1 },
  };

  const Arrow = ({ dir, color }) => {
    const map = { up: '↑', dn: '↓', eq: '=' };
    const cMap = { up: C.green, dn: C.red, eq: C.grey };
    return <span style={{ fontSize: 16, fontWeight: 900, color: color || cMap[dir], lineHeight: 1, fontFamily: F }}>{map[dir]}</span>;
  };

  const SubField = ({ noteKey, title, children, unit, gridCol, gridRow }) => (
    <div
      style={{ ...s.rdField(activeNote === noteKey), gridColumn: gridCol, gridRow }}
      onClick={() => toggleNote(noteKey)}
    >
      <div style={s.rdTitle}>{title}</div>
      {children}
      {unit && <div style={s.rdUnit}>{unit}</div>}
    </div>
  );

  const renderValue = (item, isOut) => {
    if (item.npk) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
          {item.npk.map((row) => (
            <div key={row.key} style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              {isOut && <Arrow dir={row.dir} color={row.dir === 'eq' ? C.grey : C.green} />}
              <span style={{ fontFamily: F, fontSize: 11, fontWeight: 700, color: C.teal, width: 12 }}>{row.key}</span>
              <span style={{ fontFamily: F, fontSize: 14, fontWeight: 700, color: isOut ? C.teal : (row.val === '—' ? C.border : C.amber) }}>{row.val}</span>
              <span style={{ fontFamily: F, fontSize: 10, color: C.grey }}>% DM</span>
            </div>
          ))}
        </div>
      );
    }
    if (isOut && item.dir) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Arrow dir={item.dir} />
          <span style={s.rdNum(C.teal)}>{item.val}<span style={{ fontSize: 11 }}>{item.suffix || ''}</span></span>
        </div>
      );
    }
    return <div style={s.rdNum(item.color)}>{item.val}<span style={{ fontSize: 11 }}>{item.suffix || ''}</span></div>;
  };

  return (
    <>
      <div style={s.stripLabel}>
        {stageLabel}
        <span style={s.stripLabelSub}>Click any Inflow field for source notes</span>
      </div>
      <div style={s.rdWrapper}>
        <div style={{ ...s.rdLabel('in'), gridColumn: 1, gridRow: '1/3' }}>
          <div style={s.rdLabelWord}>Inflows</div>
        </div>
        {inflows.map((item, i) => (
          <SubField key={`in-${i}`} noteKey={`in-${i}`} title={item.title} unit={item.unit} gridCol={(i % 4) + 2} gridRow={Math.floor(i / 4) + 1}>
            {renderValue(item, false)}
          </SubField>
        ))}
        <div style={{ ...s.rdLabel('out'), gridColumn: 6, gridRow: '1/3' }}>
          <div style={s.rdLabelWord}>Outflows</div>
        </div>
        <div style={{ ...s.rdArrow, gridColumn: 7, gridRow: '1/3' }}>→</div>
        {outflows.map((item, i) => (
          <SubField key={`out-${i}`} noteKey={`out-${i}`} title={item.title} unit={item.unit} gridCol={(i % 4) + 8} gridRow={Math.floor(i / 4) + 1}>
            {renderValue(item, true)}
          </SubField>
        ))}
      </div>
    </>
  );
}
