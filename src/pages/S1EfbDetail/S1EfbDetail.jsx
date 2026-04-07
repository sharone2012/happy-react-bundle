import { useNavigate } from "react-router-dom";
import { useMill } from "../../contexts/MillContext";

/* ──────────────────────────────────────────────────────────────
   S1EfbDetail.jsx  —  EFB 1-Pager Floor Plan
   Route: /s1/efb
   White palette · teal gate accents · S0 mill throughput calculator
   ────────────────────────────────────────────────────────────── */

const DM = "'DM Sans', sans-serif";

const MACHINES = [
  {
    num: 1, tag: 'AF-01', fullName: 'Hydraulic Feeder',
    spec: '±0.0m · 18kW · 20 t/h', imgLabel: 'Hydraulic Feeder', imgSub: 'Floor-level · bulk fibre',
    type: 'normal',
    svgHtml: '<svg width="108" height="108" viewBox="0 0 86 100" xmlns="http://www.w3.org/2000/svg"><polygon points="6,12 80,12 74,38 12,38" fill="#e8e8e8" stroke="#666666" stroke-width="1.5"/><rect x="12" y="38" width="62" height="14" fill="#d0d0d0" stroke="#666666" stroke-width="1"/><line x1="20" y1="40" x2="20" y2="50" stroke="#555" stroke-width="1.5"/><line x1="34" y1="40" x2="34" y2="50" stroke="#555" stroke-width="1.5"/><line x1="48" y1="40" x2="48" y2="50" stroke="#555" stroke-width="1.5"/><line x1="62" y1="40" x2="62" y2="50" stroke="#555" stroke-width="1.5"/><rect x="66" y="32" width="16" height="20" fill="#d0d0d0" stroke="#666666" stroke-width="1"/><text x="43" y="70" font-family="DM Sans" font-size="9" fill="#666666" text-anchor="middle">18kW · 20 t/h</text><text x="43" y="96" font-family="DM Sans" font-size="9" fill="#888" text-anchor="middle">hydraulic pusher</text></svg>',
    rows: [['Location','Ground ±0.0m','Power','18 kW'],['Capacity','20 t/h','MC in','62.5%'],['Inputs','EFB whole bunches','Supplier','PT Jayatech Palmindo']],
    conn: 'BC-01/02 · incline conveyor 600mm · rises ±0.0 → +2.0m',
  },
  {
    num: 2, tag: 'BC-01/02', fullName: 'Incline Conveyor 600mm',
    spec: '+2.0m · 22kW · 20 t/h', imgLabel: 'Incline Conveyor 600mm', imgSub: '±0.0 → +2.0m rise',
    type: 'normal',
    svgHtml: '<svg width="108" height="108" viewBox="0 0 86 100" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="52" width="74" height="10" fill="#e8e8e8" stroke="#666666" stroke-width="1.3" rx="2" transform="rotate(-18,43,57)"/><circle cx="12" cy="62" r="7" fill="#d0d0d0" stroke="#666666" stroke-width="1.3"/><circle cx="74" cy="24" r="7" fill="#d0d0d0" stroke="#666666" stroke-width="1.3"/><line x1="12" y1="55" x2="74" y2="17" stroke="#666666" stroke-width="1"/><line x1="12" y1="69" x2="74" y2="31" stroke="#666666" stroke-width="1"/><text x="43" y="94" font-family="DM Sans" font-size="9" fill="#555" text-anchor="middle">22kW · 600mm · 20 t/h</text></svg>',
    rows: [['Location','±0.0 → +2.0m','Power','22 kW'],['Belt width','600 mm','Capacity','20 t/h'],['Inputs','EFB bunches','Supplier','PT Sinar Surya Lestari']],
    conn: 'belt → TR-2060 trommel screen · +6.0m level',
  },
  {
    num: 3, tag: 'TR-2060', fullName: 'Trommel Screen 50mm',
    spec: '+6.0m · 11kW · 19 t/h', imgLabel: 'Trommel Screen 50mm', imgSub: '+6.0m · 50mm aperture',
    type: 'normal',
    svgHtml: '<svg width="108" height="108" viewBox="0 0 86 100" xmlns="http://www.w3.org/2000/svg"><ellipse cx="15" cy="43" rx="9" ry="22" fill="#e8e8e8" stroke="#666666" stroke-width="1.3"/><rect x="15" y="21" width="56" height="44" fill="#e8e8e8" stroke="#666666" stroke-width="1.3"/><ellipse cx="71" cy="43" rx="9" ry="22" fill="#d0d0d0" stroke="#666666" stroke-width="1.3"/><circle cx="29" cy="31" r="2.3" fill="none" stroke="#666666" stroke-width=".9"/><circle cx="43" cy="31" r="2.3" fill="none" stroke="#666666" stroke-width=".9"/><circle cx="57" cy="31" r="2.3" fill="none" stroke="#666666" stroke-width=".9"/><circle cx="29" cy="43" r="2.3" fill="none" stroke="#666666" stroke-width=".9"/><circle cx="43" cy="43" r="2.3" fill="none" stroke="#666666" stroke-width=".9"/><circle cx="57" cy="43" r="2.3" fill="none" stroke="#666666" stroke-width=".9"/><text x="43" y="94" font-family="DM Sans" font-size="9" fill="#555" text-anchor="middle">11kW · 50mm · 19 t/h</text></svg>',
    rows: [['Location','+6.0m platform','Power','11 kW'],['Capacity','19 t/h','MC','62.5%'],['Inputs','EFB post-feeder','Supplier','CV Has Engineering']],
    conn: 'belt → OBM-01 overband magnet',
  },
  {
    num: 4, tag: 'OBM-01', fullName: 'Overband Magnet',
    spec: '+6.0m · 3kW · 19 t/h', imgLabel: 'Overband Magnet', imgSub: '+6.0m · ferrous removal',
    type: 'normal',
    svgHtml: '<svg width="108" height="108" viewBox="0 0 86 100" xmlns="http://www.w3.org/2000/svg"><rect x="18" y="10" width="50" height="22" fill="#e8e8e8" stroke="#666666" stroke-width="1.5" rx="3"/><text x="43" y="24" font-family="DM Sans" font-size="9" fill="#666666" text-anchor="middle" font-weight="700">MAGNET</text><path d="M26 32 Q20 46 26 60" stroke="#666666" stroke-width="1.1" fill="none" stroke-dasharray="3,2"/><path d="M43 32 Q37 46 43 60" stroke="#666666" stroke-width="1.1" fill="none" stroke-dasharray="3,2"/><path d="M60 32 Q54 46 60 60" stroke="#666666" stroke-width="1.1" fill="none" stroke-dasharray="3,2"/><rect x="6" y="66" width="74" height="10" fill="#d0d0d0" stroke="#aaa" stroke-width="1" rx="2"/><text x="43" y="94" font-family="DM Sans" font-size="9" fill="#555" text-anchor="middle">3kW · suspended</text></svg>',
    rows: [['Location','+6.0m · suspended','Power','3 kW'],['Capacity','19 t/h','MC','62.5%'],['Inputs','EFB post-trommel','Supplier','TBC after RFQ']],
    conn: 'belt → PR-01 screw press',
  },
  {
    num: 5, tag: 'PR-01', fullName: 'Screw Press + PKSA',
    spec: '+6.0m · 30kW · MC 62.5→47.5%', imgLabel: 'Screw Press + PKSA — B.G2', imgSub: 'Gate B.G2 · press + PKSA',
    type: 'classA',
    svgHtml: '<svg width="108" height="108" viewBox="0 0 86 100" xmlns="http://www.w3.org/2000/svg"><rect x="8" y="28" width="60" height="24" fill="#e0e0e0" stroke="#444444" stroke-width="1.5" rx="2"/><path d="M12 40 Q18 32 24 40 Q30 48 36 40 Q42 32 48 40 Q54 48 60 40 Q66 32 68 40" stroke="#333333" stroke-width="1.5" fill="none"/><rect x="64" y="33" width="12" height="14" fill="#c8c8c8" stroke="#333333" stroke-width="1"/><rect x="4" y="10" width="24" height="12" fill="#444444" rx="2"/><text x="16" y="19" font-family="DM Sans" font-size="9" fill="#fff" text-anchor="middle" font-weight="700">B.G2</text><text x="43" y="70" font-family="DM Sans" font-size="9" fill="#444444" text-anchor="middle">30kW · 14 t/h out</text><text x="43" y="94" font-family="DM Sans" font-size="9" fill="#444444" text-anchor="middle">MC 62.5→47.5%</text></svg>',
    rows: [['Location','+6.0m platform','Power','30 kW'],['Capacity','14 t/h out','MC in','62.5%'],['MC out','47.5%','Gate','B.G2'],['Inputs','EFB post-magnet','Supplier','TBC after RFQ'],{s:'Gate B.G2 — screw press moisture control · PKSA integrated'}],
    conn: 'belt → SD-01 primary shredder',
  },
  {
    num: 6, tag: 'SD-01', fullName: 'Primary Shredder',
    spec: '+6.0m · 75kW · 14 t/h', imgLabel: 'Primary Shredder', imgSub: '+6.0m · 50–100mm',
    type: 'normal', noiseBandAfter: true,
    svgHtml: '<svg width="108" height="108" viewBox="0 0 86 100" xmlns="http://www.w3.org/2000/svg"><rect x="8" y="18" width="70" height="38" fill="#e8e8e8" stroke="#666666" stroke-width="1.5" rx="2"/><circle cx="30" cy="37" r="12" fill="#d0d0d0" stroke="#666666" stroke-width="1.2"/><circle cx="56" cy="37" r="12" fill="#d0d0d0" stroke="#666666" stroke-width="1.2"/><line x1="22" y1="30" x2="38" y2="44" stroke="#555" stroke-width="2"/><line x1="38" y1="30" x2="22" y2="44" stroke="#555" stroke-width="2"/><line x1="48" y1="30" x2="64" y2="44" stroke="#555" stroke-width="2"/><line x1="64" y1="30" x2="48" y2="44" stroke="#555" stroke-width="2"/><text x="43" y="80" font-family="DM Sans" font-size="9" fill="#666666" text-anchor="middle">75kW · 14 t/h</text><text x="43" y="96" font-family="DM Sans" font-size="9" fill="#888" text-anchor="middle">50–100mm output</text></svg>',
    rows: [['Location','+6.0m platform','Power','75 kW'],['Capacity','14 t/h','MC','47.5%'],['Inputs','Pressed EFB','Supplier','CV Has Engineering']],
    conn: 'belt → HM-01 hammer mill',
  },
  {
    num: 7, tag: 'HM-01', fullName: 'Hammer Mill',
    spec: '+6.0m · 110kW · 14 t/h', imgLabel: 'Hammer Mill ⚡ SPRING-ISO', imgSub: 'Spring isolation · 110kW',
    type: 'noise',
    svgHtml: '<svg width="108" height="108" viewBox="0 0 86 100" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="16" width="66" height="44" fill="#e0e0e0" stroke="#444444" stroke-width="1.5" rx="2"/><circle cx="43" cy="38" r="16" fill="#c8c8c8" stroke="#444444" stroke-width="1.2"/><rect x="27" y="32" width="12" height="5" fill="#333333" rx="1"/><rect x="48" y="32" width="12" height="5" fill="#333333" rx="1"/><rect x="27" y="39" width="12" height="5" fill="#333333" rx="1"/><rect x="48" y="39" width="12" height="5" fill="#333333" rx="1"/><path d="M16 60 Q18 65 16 70 Q14 75 16 80" stroke="#888" stroke-width="1.5" fill="none"/><path d="M43 60 Q45 65 43 70 Q41 75 43 80" stroke="#888" stroke-width="1.5" fill="none"/><path d="M70 60 Q72 65 70 70 Q68 75 70 80" stroke="#888" stroke-width="1.5" fill="none"/><text x="43" y="12" font-family="DM Sans" font-size="9" fill="#444444" text-anchor="middle" font-weight="700">⚡ SPRING ISO ONLY</text></svg>',
    rows: [['Location','+6.0m platform','Power','110 kW'],['Capacity','14 t/h','Gate','SPRING-ISO'],['Inputs','EFB post-shredder','Exhaust','DC-01 baghouse'],{s:'SPRING-ISO — spring isolation only · never rigid-anchor · oversize return loop'}],
    conn: 'belt → VS-01 vibrating screen 2mm',
  },
  {
    num: 8, tag: 'VS-01', fullName: 'Vibrating Screen 2mm',
    spec: '+6.0m · 11kW · 13 t/h', imgLabel: 'Vibrating Screen 2mm (B.G1)', imgSub: 'Gate B.G1 · 2mm screen',
    type: 'normal',
    svgHtml: '<svg width="108" height="108" viewBox="0 0 86 100" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="22" width="74" height="30" fill="#e8e8e8" stroke="#666666" stroke-width="1.5" rx="2" transform="rotate(-4,43,37)"/><line x1="10" y1="28" x2="80" y2="23" stroke="#666666" stroke-width=".8" opacity=".6"/><line x1="10" y1="35" x2="80" y2="30" stroke="#666666" stroke-width=".8" opacity=".6"/><line x1="10" y1="42" x2="80" y2="37" stroke="#666666" stroke-width=".8" opacity=".6"/><path d="M14 52 Q16 57 14 62 Q12 67 14 72" stroke="#888" stroke-width="1.5" fill="none"/><path d="M72 50 Q74 55 72 60 Q70 65 72 70" stroke="#888" stroke-width="1.5" fill="none"/><text x="43" y="94" font-family="DM Sans" font-size="9" fill="#555" text-anchor="middle">11kW · 2mm · 13 t/h</text></svg>',
    rows: [['Location','+6.0m platform','Power','11 kW'],['Capacity','13 t/h','Gate','B.G1'],['Inputs','Milled EFB','MC','47.5%'],{p:'≤ 2mm → buffer bin \u00a0|\u00a0 reject > 2mm → return to ⑦'}],
    conn: 'undersize → BIN-EFB-01 buffer bin',
  },
  {
    num: 9, tag: 'DC-01', fullName: 'Baghouse Dust Filter (Shared)',
    spec: '+6.0m · 18kW · shared w/ S1B', imgLabel: 'Baghouse (Shared w/ S1B)', imgSub: 'Shared with OPDC line',
    type: 'normal',
    svgHtml: '<svg width="108" height="108" viewBox="0 0 86 100" xmlns="http://www.w3.org/2000/svg"><rect x="22" y="12" width="42" height="52" fill="#e0e0e0" stroke="#666" stroke-width="1.3" rx="2"/><rect x="26" y="16" width="10" height="40" fill="#d0d0d0" stroke="#888" stroke-width=".8" rx="1"/><rect x="38" y="16" width="10" height="40" fill="#d0d0d0" stroke="#888" stroke-width=".8" rx="1"/><rect x="50" y="16" width="10" height="40" fill="#d0d0d0" stroke="#888" stroke-width=".8" rx="1"/><line x1="43" y1="64" x2="43" y2="74" stroke="#666" stroke-width="2"/><polygon points="43,4 38,14 48,14" fill="#555"/><text x="43" y="96" font-family="DM Sans" font-size="9" fill="#555" text-anchor="middle">18kW · shared S1A+S1B</text></svg>',
    rows: [['Location','+6.0m · external','Power','18 kW'],['Shared','S1A (EFB) + S1B (OPDC)','Efficiency','99% dust capture'],['Inputs','Hammer mill exhaust ⑦','Supplier','TBC after RFQ']],
    conn: null,
  },
  {
    num: 10, tag: 'BIN-EFB-01', fullName: 'Buffer Bin 50m³',
    spec: '+6.0m · 0kW · 13 t/h', imgLabel: 'Buffer Bin 50m³', imgSub: '+6.0m · live-bottom',
    type: 'normal',
    svgHtml: '<svg width="108" height="108" viewBox="0 0 86 100" xmlns="http://www.w3.org/2000/svg"><rect x="18" y="8" width="50" height="50" fill="#e8e8e8" stroke="#777777" stroke-width="1.5" rx="1"/><polygon points="18,58 68,58 58,74 28,74" fill="#d0d0d0" stroke="#777777" stroke-width="1.5"/><rect x="20" y="24" width="46" height="34" fill="rgba(245,166,35,.1)"/><line x1="43" y1="8" x2="43" y2="56" stroke="#aaa" stroke-width="1.1"/><text x="43" y="94" font-family="DM Sans" font-size="9" fill="#555" text-anchor="middle">50m\u00b3 · 13 t/h · MC 47.5%</text></svg>',
    rows: [['Location','+6.0m platform','Power','0 kW (gravity)'],['Volume','50 m³','Discharge','Live-bottom'],['Inputs','Milled EFB ≤ 2mm','MC in bin','47.5%'],['Supplier','PT BSB (Bangun Sarana Baja)','Throughput','13 t/h']],
    conn: 'conveyor gallery → S2 greenhouse intake',
  },
];

// ── Machine Card ─────────────────────────────────────────────
function MachineCard({ m }) {
  const imgBorder = {
    normal:  { border: 'none' },
    classA:  { border: '2px solid rgba(0,0,0,.4)' },
    noise:   { border: '2px dashed rgba(0,0,0,.35)', background: 'rgba(0,0,0,.02)' },
    dwell:   { border: '2px solid rgba(245,166,35,.5)' },
  }[m.type] || {};

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'stretch' }}>
      <div style={{ width: 161, flexShrink: 0, display: 'flex', flexDirection: 'column', alignSelf: 'stretch', background: '#f5f5f5', border: '1.5px solid #999', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: '#111', textAlign: 'center', lineHeight: 1.2, padding: '4px 4px 2px', wordWrap: 'break-word', fontFamily: DM, borderBottom: '1px solid #ccc', background: '#eee' }}>{m.imgLabel}</div>
        <div style={{ width: '100%', flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 4, ...imgBorder }}
          dangerouslySetInnerHTML={{ __html: m.svgHtml }} />
        <div style={{ fontSize: 10, color: '#555', textAlign: 'center', padding: '2px 4px 4px', fontFamily: DM, borderTop: '1px solid #ccc', background: '#eee' }}>{m.imgSub}</div>
      </div>
      <div style={{ flex: 1, border: '1.5px solid #111', borderRadius: 3, display: 'flex', flexDirection: 'column', minWidth: 0, maxWidth: 520 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 8px', borderBottom: '1px solid #e0e0e0' }}>
          <span style={{ background: '#111', color: '#fff', fontSize: 12, fontWeight: 700, padding: '2px 7px', borderRadius: 2, flexShrink: 0, fontFamily: DM }}>{m.num}</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#111', fontFamily: DM }}>{m.tag}</span>
        </div>
        <div style={{ fontFamily: DM, fontSize: 12, fontWeight: 700, color: '#000', padding: '3px 8px', borderBottom: '1px solid #eee', whiteSpace: 'nowrap' }}>{m.fullName}</div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            {m.rows.map((row, i) =>
              row.s !== undefined ? (
                <tr key={i} style={{ background: 'rgba(0,0,0,.04)' }}>
                  <td colSpan={5} style={{ padding: '3px 8px', fontStyle: 'italic', color: '#444444', fontSize: 11, fontFamily: DM }}>{row.s}</td>
                </tr>
              ) : row.p !== undefined ? (
                <tr key={i}>
                  <td style={{ padding: '3px 10px', color: '#666', fontSize: 11, fontFamily: DM, whiteSpace: 'nowrap', width: '1%' }}>Pass</td>
                  <td colSpan={4} style={{ padding: '3px 10px', color: '#111', fontWeight: 700, fontSize: 11, fontFamily: DM }}>{row.p}</td>
                </tr>
              ) : (
                <tr key={i} style={{ borderBottom: i < m.rows.length - 1 ? '1px solid #f2f2f2' : 'none' }}>
                  <td style={{ padding: '3px 8px 3px 10px', color: '#666', fontSize: 11, fontFamily: DM, whiteSpace: 'nowrap', width: '1%' }}>{row[0]}</td>
                  <td style={{ padding: '3px 10px', color: '#111', fontWeight: 700, fontSize: 11, fontFamily: DM, whiteSpace: 'nowrap' }}>{row[1]}</td>
                  <td style={{ borderLeft: '1px solid #e0e0e0', padding: 0, width: 1 }}></td>
                  <td style={{ padding: '3px 8px 3px 6px', color: '#666', fontSize: 11, fontFamily: DM, whiteSpace: 'nowrap', width: '1%' }}>{row[2]}</td>
                  <td style={{ padding: '3px 10px', color: '#111', fontWeight: 700, fontSize: 11, fontFamily: DM, whiteSpace: 'nowrap' }}>{row[3]}</td>
                </tr>
              )
            )}
          </tbody>
        </table>
        {m.conn && (
          <div style={{ padding: '3px 8px 4px', borderTop: '1px dashed #e0e0e0', fontSize: 11, color: '#aaa', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 5, marginTop: 'auto', fontFamily: DM }}>
            <span style={{ color: '#bbb', flexShrink: 0 }}>▾</span>
            <span>{m.conn}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────
export default function S1EfbDetail() {
  const navigate = useNavigate();
  const { site, derived } = useMill();

  const ffb = site?.ffb_capacity_tph ?? null;
  const efbTph = ffb ? (ffb * 0.225).toFixed(1) : null;
  const efbMo = derived.monthlyEfb > 0 ? derived.monthlyEfb.toLocaleString() : '8,262';
  const siteLabel = site ? `${site.mill_name || 'Mill'} · ${[site.district, site.province].filter(Boolean).join(', ')}` : null;

  const navBtn = { background: 'none', border: '1px solid #aaa', borderRadius: 3, padding: '3px 10px', fontFamily: DM, fontSize: 11, cursor: 'pointer', color: '#444' };
  const navBtnActive = { ...navBtn, background: '#111', color: '#fff', border: '1px solid #111', fontWeight: 700 };

  const totals = [
    { l: 'Mill FFB', v: ffb ? `${ffb} t/h` : '— (set in S0)', dynamic: true },
    { l: 'S1A Input', v: efbTph ? `${efbTph} t/h` : '~13.5 t/h', dynamic: !!ffb },
    { l: 'Monthly FW', v: `${efbMo} t`, dynamic: derived.monthlyEfb > 0 },
    { l: 'Installed kW', v: '~298 kW', dynamic: false },
    { l: 'MC in / out', v: '62.5% → 47.5%', dynamic: false },
    { l: 'Floor slab', v: '300mm RC C30', dynamic: false },
    { l: 'Power', v: '3-phase 415V', dynamic: false },
  ];

  return (
    <div style={{ background: '#e0e0e0', minHeight: '100vh', padding: '16px 20px', fontFamily: DM }}>
      {/* Top nav */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 14, alignItems: 'center', flexWrap: 'wrap' }}>
        <button style={navBtn} onClick={() => navigate('/s1')}>← S1 Hub</button>
        <span style={navBtnActive}>EFB Line</span>
        <button style={navBtn} onClick={() => navigate('/s1/opdc')}>OPDC Line</button>
        <button style={navBtn} onClick={() => navigate('/s1/pos')}>POS Line</button>
        <button style={navBtn} onClick={() => navigate('/s1-floor-plan-print?line=efb&print')}>⎙ Print / PDF</button>
        {siteLabel && <span style={{ fontSize: 10, color: '#666', marginLeft: 8 }}>{siteLabel}</span>}
        {!site && <span style={{ fontSize: 10, color: '#bbb', marginLeft: 8 }}>No mill configured — S0 calculator using defaults</span>}
      </div>

      {/* 1-pager frame */}
      <div style={{ background: '#fff', border: '2px solid #40D7C5', padding: 24, width: 'fit-content', maxWidth: '98vw', margin: '0 auto', boxShadow: '0 4px 24px rgba(0,0,0,.15)' }}>
        {/* Title bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, paddingBottom: 8, borderBottom: '2px solid #111', gap: 24, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: DM, fontSize: 14, fontWeight: 700, color: '#111', letterSpacing: '.02em' }}>S1 - CFI - EFB Mechanical Downsizing</span>
          <span style={{ fontSize: 10, color: '#444' }}>
            {siteLabel ? `${siteLabel} · FFB ${ffb} t/h` : 'Residue selected in S0 · Plantation: [Name] · Mill: [Name]'}
          </span>
        </div>

        {/* Body */}
        <div style={{ display: 'flex' }}>
          {/* Left panel */}
          <div style={{ width: 210, flexShrink: 0, borderRight: '1px solid #ccc', paddingTop: 11, paddingBottom: 11, paddingLeft: 13, display: 'flex', flexDirection: 'column', gap: 11 }}>
            {/* Legend */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#111', marginBottom: 6, paddingBottom: 3, borderBottom: '1px solid #ddd', fontFamily: DM }}>Legend</div>
              {[
                { bg: '#f8f8f8', bdr: '1.5px solid #bbb', label: 'Processing equipment' },
                { bg: '#fff', bdr: '2px solid rgba(204,34,34,.55)', label: 'CLASS A gate (B.G2)' },
                { bg: '#f8f8f8', bdr: '2px dashed rgba(204,34,34,.5)', label: 'Noise zone (SPRING-ISO)' },
                { bg: '#fff', bdr: '1.5px solid rgba(245,166,35,.65)', label: 'Screen gate (B.G1)' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 3 }}>
                  <div style={{ width: 9, height: 9, borderRadius: 2, flexShrink: 0, background: item.bg, border: item.bdr }}></div>
                  <span style={{ fontSize: 10, color: '#333', lineHeight: 1.55, fontFamily: DM }}>{item.label}</span>
                </div>
              ))}
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 3 }}>
                <span style={{ fontSize: 10, color: '#bbb', flexShrink: 0 }}>▼</span>
                <span style={{ fontSize: 10, color: '#333', fontFamily: DM }}>EFB flow</span>
              </div>
            </div>

            {/* Machine list */}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#111', marginBottom: 6, paddingBottom: 3, borderBottom: '1px solid #ddd', fontFamily: DM }}>EFB Machinery (S1A)</div>
              {MACHINES.map((m, i) => (
                <div key={i} style={{ padding: '7px 0', borderBottom: i < MACHINES.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                  <span style={{ fontWeight: 700, fontSize: 12, color: '#111', display: 'block', marginBottom: 1, fontFamily: DM }}>
                    <span style={{ background: '#111', color: '#fff', fontSize: 10, fontWeight: 700, padding: '1px 5px', borderRadius: 2, marginRight: 4, fontFamily: DM }}>{m.num}</span>
                    {m.tag}
                  </span>
                  <span style={{ fontSize: 12, color: '#444', display: 'block', lineHeight: 1.4, fontFamily: DM }}>{m.fullName}</span>
                  <span style={{ fontSize: 10, color: '#777', display: 'block', lineHeight: 1.4, fontFamily: DM }}>{m.spec}</span>
                </div>
              ))}
            </div>

            {/* Line totals — S0 calculator */}
            <div style={{ marginTop: 8, paddingTop: 7, borderTop: '1px solid #eee' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#111', marginBottom: 4, paddingBottom: 3, borderBottom: '1px solid #ddd', fontFamily: DM }}>Line totals</div>
              {totals.map((row, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '1.5px 0', borderBottom: '1px solid #f5f5f5' }}>
                  <span style={{ fontSize: 10, color: '#888', fontFamily: DM }}>{row.l}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: row.dynamic ? '#2e7d32' : '#111', fontFamily: DM }}>{row.v}</span>
                </div>
              ))}
              {!site && <div style={{ fontSize: 9, color: '#aaa', marginTop: 4, fontStyle: 'italic', fontFamily: DM }}>Green values auto-scale from S0 mill size</div>}
            </div>
          </div>

          {/* Right content */}
          <div style={{ flex: '0 1 auto', padding: '14px 12px 16px 40px', minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
            <div style={{ fontFamily: DM, fontSize: 14, fontWeight: 700, color: '#111', marginBottom: 2 }}>EFB Mechanical Downsizing Line (S1A)</div>
            <div style={{ fontSize: 12, color: '#555', marginBottom: 7, fontFamily: DM }}>machines ①–⑩ · 600mm belt · {efbTph ? `${efbTph} t/h` : '20 t/h'} · from EFB bunch press receiving · fibre form · MC 62.5% in</div>
            <div style={{ background: '#fafafa', border: '1px solid #bbb', borderRadius: 3, padding: '5px 12px', fontSize: 11, color: '#555', lineHeight: 1.45, marginBottom: 10, fontFamily: DM }}>
              EFB input: 62.5% MC · long fibre form — requires shredding before milling · B.G2 screw press gate · SPRING-ISO hammer mill · B.G1 screen gate · Baghouse shared with OPDC line (S1B)
            </div>

            {/* Width dimension + flow + height ruler */}
            <div style={{ display: 'flex', alignItems: 'stretch' }}>
              <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', gap: 7, padding: '12px 12px 12px 0' }}>
                {/* Width dimension */}
                <div style={{ marginBottom: 8 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#444', fontFamily: DM, textAlign: 'center', marginBottom: 4 }}>Width</div>
                  <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                    <div style={{ width: 1, height: 14, background: '#999', flexShrink: 0 }}></div>
                    <div style={{ flex: 1, height: 1, background: '#999' }}></div>
                    <div style={{ width: 1, height: 14, background: '#999', flexShrink: 0 }}></div>
                    <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', fontSize: 12, fontWeight: 700, color: '#444', background: '#fff', padding: '0 7px', fontFamily: DM, whiteSpace: 'nowrap' }}>18.0 m</div>
                  </div>
                </div>

                {/* Process label */}
                <div style={{ fontSize: 11, fontWeight: 700, color: '#111', marginBottom: 4, fontFamily: DM }}>EFB S1A · 10 machines · {efbTph ? `${efbTph} t/h` : '20 t/h'}</div>

                {/* Machine cards */}
                {MACHINES.map((m) => (
                  <div key={m.num}>
                    <MachineCard m={m} />
                    {m.noiseBandAfter && (
                      <div style={{ background: 'rgba(0,0,0,.04)', border: '1px dashed rgba(0,0,0,.3)', borderRadius: 3, padding: '3px 10px', fontFamily: DM, fontSize: 11, fontWeight: 700, color: '#444', textAlign: 'center', margin: '4px 0' }}>
                        SPRING-ISO zone — hearing protection + dust mask required
                      </div>
                    )}
                  </div>
                ))}

                {/* S2 discharge */}
                <div style={{ borderRadius: 3, padding: '7px 14px', fontFamily: DM, fontSize: 12, fontWeight: 700, textAlign: 'center', flexShrink: 0, background: '#222', color: '#fff', border: '1.5px solid #888', marginTop: 4 }}>
                  S2 discharge — EFB milled ≤ 2mm @ 47.5% MC → S2 chemical treatment
                </div>
              </div>

              {/* Height ruler */}
              <div style={{ width: 32, flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingLeft: 8, paddingTop: 72, alignSelf: 'stretch' }}>
                <div style={{ height: 1, width: 14, background: '#999' }}></div>
                <div style={{ flex: 1, width: 1, background: '#999', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#444', fontFamily: DM, writingMode: 'vertical-rl', background: '#fff', padding: '4px 0', position: 'absolute', whiteSpace: 'nowrap' }}>35.0 m</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#444', fontFamily: DM, writingMode: 'vertical-rl', position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', whiteSpace: 'nowrap' }}>Height</div>
                </div>
                <div style={{ height: 1, width: 14, background: '#999' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
