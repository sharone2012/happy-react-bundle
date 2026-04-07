// ═══════════════════════════════════════════════════════
// CFI CODE EXPORT — STATE MANAGEMENT
// useState declarations, useContext/providers,
// props drilling patterns, hooks
// ═══════════════════════════════════════════════════════


// ======================================================================
// FILE: src/CFI_S0_Page.jsx
// SIZE: 56002 chars / 846 lines
// ======================================================================

import { useState, useMemo, useCallback } from 'react';

// ── DESIGN TOKENS ──────────────────────────────────────────
const C = {
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
  white:     '#E8F0FE',
  bdrIdle:   'rgba(255,255,255,0.06)',
  bdrCalc:   'rgba(139,160,180,0.18)',
};
const Fnt = {
  syne:     "'Syne', sans-serif",
  dm:       "'DM Sans', sans-serif",
  mono:     "'DM Mono', monospace",
  brand:    "'EB Garamond', serif",
};

// ── HELPERS ────────────────────────────────────────────────
function fmtT(n) {
  if (!n) return '—';
  if (n >= 1000) return (n/1000).toFixed(1).replace(/\.0$/,'') + 'K';
  return Math.round(n).toString();
}
function fmtTUnit(n) { return fmtT(n) + (n ? ' t/m' : ''); }

// ── FEEDSTOCK DATA ─────────────────────────────────────────
const FEEDSTOCK = {
  efb:  { N:1.76, P:0.14, K:2.34, CP:4.75, EE:2.8,  Ash:5.2,  MC:62.5, DM:37.5, pH:5.1, CN:60, Lignin:22.0, Ca:0.27, Mg:0.09 },
  opdc: { N:2.31, P:0.50, K:1.23, CP:14.5, EE:10.0, Ash:28.0, MC:70.0, DM:30.0, pH:4.8, CN:20, Lignin:4.0,  Ca:0.65, Mg:0.28 },
  pos:  { N:1.76, P:0.32, K:1.10, CP:11.0, EE:10.0, Ash:28.0, MC:82.0, DM:18.0, pH:4.6, CN:22, Lignin:4.5,  Ca:0.48, Mg:0.18 },
  pmf:  { N:0.58, P:0.10, K:0.40, CP:3.6,  EE:7.0,  Ash:4.5,  MC:40.0, DM:60.0, pH:5.5, CN:55, Lignin:28.0, Ca:0.20, Mg:0.07 },
  pke:  { N:2.20, P:0.62, K:1.30, CP:15.0, EE:8.5,  Ash:5.0,  MC:12.0, DM:88.0, pH:6.0, CN:18, Lignin:5.0,  Ca:0.30, Mg:0.12 },
};

// ── SOIL DATA ──────────────────────────────────────────────
const SOILS = [
  { id:'inceptisols', name:'Inceptisols', ph:'4.1', cec:'15.4', cov:'39 % Indonesian palm',  pills:[{cls:'green',txt:'⭐ Best Soil'},{cls:'green',txt:'pH 4.1 · CEC 15.4'},{cls:'teal',txt:'N adj standard'}] },
  { id:'ultisols',    name:'Ultisols',    ph:'4.5', cec:'8.2',  cov:'24 % Indonesian palm',  pills:[{cls:'amber',txt:'pH 4.5 · CEC 8.2'},{cls:'teal',txt:'N adj −35 %'}] },
  { id:'oxisols',     name:'Oxisols',     ph:'4.4', cec:'6.1',  cov:'8 % Indonesian palm',   pills:[{cls:'amber',txt:'pH 4.4 · CEC 6.1'},{cls:'red',txt:'P fixation: Very High'},{cls:'teal',txt:'Split P doses'}] },
  { id:'histosols',   name:'Histosols',   ph:'3.8', cec:'28.0', cov:'7 % · Special rules',   pills:[{cls:'red',txt:'pH 3.8 · Very Acid'},{cls:'red',txt:'⚠ N −80%  P −70%'},{cls:'red',txt:'Drainage critical'}], peat:true },
  { id:'spodosols',   name:'Spodosols',   ph:'4.77',cec:'2.0',  cov:'Sandy · Lowest fertility',pills:[{cls:'amber',txt:'pH 4.77 · CEC 2.0'},{cls:'red',txt:'N leaching: Very High'},{cls:'teal',txt:'31% yield gap'}] },
  { id:'andisols',    name:'Andisols',    ph:'5.1', cec:'22.0', cov:'Volcanic · High P fix',  pills:[{cls:'amber',txt:'pH 5.1 · CEC 22.0'},{cls:'red',txt:'P fixation: High'},{cls:'teal',txt:'P rate +30–50%'}] },
];

const MILL_STREAMS = ['efb','opdc','pos','pmf','pome'];
const ESTATE_STREAMS = ['pke','opf','opt'];

// ── MAIN COMPONENT ─────────────────────────────────────────
export default function SiteSetup() {
  // ── Section A state
  const [site, setSite] = useState({ company:'', estate:'', millName:'', gpsLat:'', gpsLon:'', province:'', district:'', country:'Indonesia' });
  const upSite = (k,v) => setSite(s => ({...s,[k]:v}));

  // ── Section B state
  const [mill, setMill] = useState({ ffb:60, util:85, hrs:20, days:30 });
  const [bConfirmed, setBConfirmed] = useState(false);
  const upMill = (k,v) => { if(bConfirmed) return; setMill(m=>({...m,[k]:+v||0})); };

  // ── Derived mill values
  const ffbMonth = mill.ffb * (mill.util/100) * mill.hrs * mill.days;
  const maxT = useMemo(()=>({
    efb:  Math.round(ffbMonth * 0.227),
    opdc: Math.round(ffbMonth * 0.042),
    pos:  Math.round(ffbMonth * 0.015),
    pmf:  Math.round(ffbMonth * 0.145),
    pome: Math.round(ffbMonth * 0.30),
    pke:0, opf:0, opt:0
  }),[ffbMonth]);

  // ── Section D state (active streams)
  const [activeStreams, setActiveStreams] = useState({ efb:true, opdc:true, pos:false, pmf:false, pke:false, pome:false, opf:false, opt:false });
  const toggleStream = (key) => {
    setActiveStreams(s => {
      const next = {...s, [key]: !s[key]};
      if (key==='efb' && !next.efb) next.opdc = false;
      return next;
    });
  };
  const [customStreams, setCustomStreams] = useState([]);
  const [showNewFields, setShowNewFields] = useState(false);
  const [newRes1, setNewRes1] = useState('');
  const [newRes2, setNewRes2] = useState('');

  // ── Section E state (sliders)
  const [sliders, setSliders] = useState({});
  const getSlider = (key) => {
    if (sliders[key] !== undefined) return sliders[key];
    const mx = maxT[key] || 8000;
    return Math.round(mx * 0.5);
  };
  const setSlider = (key, val) => setSliders(s=>({...s,[key]:+val}));

  // ── Section G (Soil) state
  const [selectedSoil, setSelectedSoil] = useState('ultisols');

  // ── Section F confirm state
  const [fConfirmed, setFConfirmed] = useState(false);

  // ── Bottom strip expand
  const [stripExpanded, setStripExpanded] = useState(false);

  // ── Compute stream tonnages
  const streamT = useMemo(()=>{
    const t = {};
    const allKeys = [...MILL_STREAMS, ...ESTATE_STREAMS, ...customStreams.map(c=>c.key)];
    allKeys.forEach(k=>{
      if (activeStreams[k] || customStreams.find(c=>c.key===k && c.active)) {
        t[k] = getSlider(k);
      }
    });
    return t;
  },[activeStreams, sliders, maxT, customStreams]);

  const grandTotal = Object.values(streamT).reduce((a,b)=>a+(b||0),0);
  const millStreamTotal = MILL_STREAMS.filter(k=>streamT[k]).reduce((a,k)=>a+(streamT[k]||0),0);
  const millMaxTotal = MILL_STREAMS.reduce((a,k)=>a+(maxT[k]||0),0);
  const fHeroPct = millMaxTotal>0 ? (millStreamTotal/millMaxTotal*100).toFixed(1) : '—';

  // ── Blend calculation
  const blend = useMemo(()=>{
    const b = { N:0, P:0, K:0, CP:0, EE:0, Ash:0, MC:0, DM:0, pH:0, CN_N:0, CN_C:0, Lignin:0, Ca:0, Mg:0 };
    if (grandTotal<=0) return null;
    Object.keys(streamT).forEach(key=>{
      const t = streamT[key]||0; if(t<=0) return;
      const s = FEEDSTOCK[key]; if(!s) return;
      const w = t/grandTotal;
      b.N+=s.N*w; b.P+=s.P*w; b.K+=s.K*w; b.CP+=s.CP*w;
      b.EE+=s.EE*w; b.Ash+=s.Ash*w; b.MC+=s.MC*w; b.DM+=s.DM*w;
      b.pH+=s.pH*w; b.CN_N+=s.N*w; b.CN_C+=s.N*s.CN*w;
      b.Lignin+=s.Lignin*w; b.Ca+=s.Ca*w; b.Mg+=s.Mg*w;
    });
    b.CN   = b.CN_N>0 ? b.CN_C/b.CN_N : 0;
    b.P2O5 = b.P*2.291;
    b.K2O  = b.K*1.205;
    return b;
  },[streamT, grandTotal]);

  const soilData = SOILS.find(s=>s.id===selectedSoil)||SOILS[1];

  // ── Add custom residue
  const addResidue = () => {
    const names = [newRes1, newRes2].filter(n=>n.trim());
    if (!names.length) return;
    const added = names.map(name=>({ key:'custom_'+Date.now()+'_'+Math.random().toString(36).slice(2,5), name, active:true }));
    setCustomStreams(cs=>[...cs,...added]);
    setActiveStreams(s=>{ const n={...s}; added.forEach(a=>{n[a.key]=true;}); return n; });
    setNewRes1(''); setNewRes2(''); setShowNewFields(false);
  };

  // ── Styles ─────────────────────────────────────────────
  const card = { background:C.navyCard, border:`1.5px solid rgba(0,201,177,0.13)`, borderRadius:11, overflow:'hidden', minWidth:0 };
  const secTitle = { padding:'11px 16px 10px', fontFamily:Fnt.syne, fontWeight:700, fontSize:15, color:C.teal, borderBottom:`1px solid rgba(64,215,197,0.12)`, display:'flex', alignItems:'center', justifyContent:'space-between', whiteSpace:'nowrap' };
  const secSub = { fontSize:13, color:C.greyLt, padding:'5px 16px 7px' };
  const cbody = { padding:'11px 13px', display:'flex', flexDirection:'column', gap:6 };
  const grid2 = { display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 };
  const grid3 = { display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12 };
  const row4 = { display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:14, alignItems:'stretch' };
  const mixCell = { background:C.navyDeep, border:`1px solid ${C.bdrCalc}`, borderRadius:6, padding:'7px 9px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:6, minHeight:36, overflow:'hidden' };
  const mixLbl = { fontSize:13, fontWeight:700, fontFamily:Fnt.mono, color:C.grey, whiteSpace:'nowrap', flexShrink:0 };
  const mixUnit = { fontSize:11, fontWeight:700, fontFamily:Fnt.mono, color:C.greyLt, whiteSpace:'nowrap', flexShrink:0, marginLeft:5 };
  const chipBase = { fontSize:11, fontWeight:700, fontFamily:Fnt.mono, padding:'3px 10px', borderRadius:12, border:'1px solid', whiteSpace:'nowrap' };
  const chips = {
    green: { ...chipBase, color:C.green, borderColor:'rgba(0,162,73,0.4)', background:C.greenDim },
    teal:  { ...chipBase, color:C.teal,  borderColor:'rgba(64,215,197,0.48)', background:C.tealDim },
    amber: { ...chipBase, color:C.amber, borderColor:'rgba(245,166,35,0.4)', background:C.amberDim },
    red:   { ...chipBase, color:C.red,   borderColor:'rgba(232,64,64,0.4)', background:C.redDim },
    grey:  { ...chipBase, color:C.grey,  borderColor:'rgba(168,189,208,0.25)', background:'rgba(168,189,208,0.06)' },
  };
  const fInput = { background:'#000', border:`1px solid rgba(168,189,208,0.2)`, borderRadius:7, padding:'10px 13px', fontSize:14, fontWeight:700, fontFamily:Fnt.dm, color:C.white, width:'100%', outline:'none', minHeight:42, boxSizing:'border-box' };
  const confirmBtn = { background:C.green, color:'#000', fontFamily:Fnt.brand, fontWeight:700, fontSize:15, letterSpacing:'0.04em', border:'none', borderRadius:8, padding:'0 28px', height:51, minWidth:260, display:'block', margin:'0 auto', cursor:'pointer' };
  const slItem = { background:C.navyDeep, border:`1.5px solid ${C.bdrCalc}`, borderRadius:8, padding:'10px 26px 10px 13px', minHeight:52, marginBottom:6 };
  const toggleCard = (active) => ({ background:active?C.tealDim:C.navyDeep, border:`1.5px solid ${active?C.tealBdr:C.bdrCalc}`, borderRadius:8, padding:'10px 13px', cursor:'pointer', transition:'all 0.12s', minHeight:52 });

  // ── RENDER ─────────────────────────────────────────────
  return (
    <div style={{ background:C.navy, color:C.white, fontFamily:Fnt.dm, fontSize:14, minWidth:1400 }}>

      {/* ── TOP NAV ── */}
      <div style={{ background:C.navyMid, display:'flex', alignItems:'center', padding:'0 28px', height:80, gap:18, position:'sticky', top:0, zIndex:100 }}>
        <div style={{ display:'flex', alignItems:'center', flexShrink:0, maxWidth:340 }}>
          <div>
            <div style={{ display:'flex', alignItems:'baseline' }}>
              <span style={{ fontFamily:Fnt.brand, fontWeight:700, fontSize:26, color:'#FFF', letterSpacing:'0.02em', whiteSpace:'nowrap' }}>CFI</span>
              <span style={{ fontFamily:Fnt.brand, fontSize:22, color:'rgba(255,255,255,0.25)', margin:'0 8px' }}>·</span>
              <span style={{ fontFamily:Fnt.brand, fontWeight:700, fontSize:20, color:C.teal, letterSpacing:'0.10em', whiteSpace:'nowrap' }}>DEEP TECH</span>
            </div>
            <div style={{ fontSize:11, color:C.teal, marginTop:4, fontFamily:Fnt.dm, whiteSpace:'nowrap' }}>Soil Microbiome Engineering &amp; Biofertiliser Production for Closed‑Loop Nutrient Recycling</div>
          </div>
        </div>
        <div style={{ display:'flex', gap:4, marginLeft:'auto', alignItems:'center', flexShrink:0 }}>
          {['S0','S1','S2','S3','S4','S5','S6','CAPEX','Σ'].map((s,i)=>(
            <div key={s} style={{ background:i===0?C.teal:'rgba(168,189,208,0.09)', border:`1px solid ${i===0?C.teal:'rgba(168,189,208,0.18)'}`, borderRadius:4, padding:'3px 9px', fontFamily:Fnt.mono, fontSize:11, fontWeight:700, color:i===0?C.navy:C.grey, cursor:'pointer', whiteSpace:'nowrap' }}>{s}</div>
          ))}
        </div>
        <div style={{ display:'flex', gap:7, alignItems:'center', marginLeft:16, flexShrink:0 }}>
          <div style={chips.green}>✓ Valid</div>
          <div style={chips.teal}>✓ Blend Valid</div>
          <div style={chips.amber}>Soil: {soilData.name}</div>
        </div>
      </div>

      {/* ── FULL-NAME TAB BAR ── */}
      <div style={{ background:'#0A1628', borderBottom:`2px solid rgba(64,215,197,0.20)`, display:'flex', justifyContent:'center', alignItems:'flex-end', gap:2, padding:'12px 24px 0' }}>
        {['Site Setup','Pre-Processing','Pre-Treatment','Biologicals','BSF','Biofertiliser / Other','Emissions','Financials','Summary'].map((t,i)=>(
          <div key={t} style={{ padding:'8px 18px', cursor:'pointer', borderRadius:'6px 6px 0 0', background:i===0?C.teal:'transparent', color:i===0?C.navy:C.teal, fontSize:12, fontWeight:700, fontFamily:Fnt.mono, border:`1px solid ${i===0?C.teal:'transparent'}`, borderBottom:'none', whiteSpace:'nowrap' }}>{t}</div>
        ))}
      </div>

      {/* ── SUBTAB BAR ── */}
      <div style={{ background:C.navyMid, borderBottom:`1px solid rgba(255,255,255,0.04)`, padding:'0 28px', display:'flex', alignItems:'center', gap:12, height:44 }}>
        <div style={{ background:C.teal, borderRadius:5, width:22, height:22, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:Fnt.syne, fontWeight:800, fontSize:11, color:C.navy }}>S0</div>
        <span style={{ fontSize:11, color:C.greyLt }}>Site identity · Mill capacity · Residue streams · Soil profile</span>
      </div>

      {/* ── PAGE CONTENT ── */}
      <div style={{ padding:'16px 22px 60px', display:'flex', flexDirection:'column', gap:14 }}>

        {/* ════ ROW 1: A | B | C | G ════ */}
        <div style={row4}>

          {/* ── A: SITE DETAILS ── */}
          <div style={card}>
            <div style={secTitle}>A — Enter Your Details</div>
            <div style={secSub}>Mill identity · Location · GPS coordinates</div>
            <div style={cbody}>
              <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                <input style={fInput} placeholder="Company Name" value={site.company} onChange={e=>upSite('company',e.target.value)} />
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6 }}>
                  <input style={fInput} placeholder="Estate / Plantation Name" value={site.estate} onChange={e=>upSite('estate',e.target.value)} />
                  <input style={fInput} placeholder="Mill Name / #" value={site.millName} onChange={e=>upSite('millName',e.target.value)} />
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6 }}>
                  <input style={fInput} placeholder="Province" value={site.province} onChange={e=>upSite('province',e.target.value)} />
                  <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                    <div style={{ position:'relative' }}>
                      <div style={{ fontSize:10, fontWeight:700, fontFamily:Fnt.mono, color:C.grey, letterSpacing:'0.06em', marginBottom:3 }}>GPS LATITUDE</div>
                      <input style={{...fInput, color:C.greyLt}} placeholder="Optional" value={site.gpsLat} onChange={e=>upSite('gpsLat',e.target.value)} />
                    </div>
                    <div>
                      <div style={{ fontSize:10, fontWeight:700, fontFamily:Fnt.mono, color:C.grey, letterSpacing:'0.06em', marginBottom:3 }}>GPS LONGITUDE</div>
                      <input style={{...fInput, color:C.greyLt}} placeholder="Optional" value={site.gpsLon} onChange={e=>upSite('gpsLon',e.target.value)} />
                    </div>
                  </div>
                </div>
                <input style={fInput} placeholder="District / Kabupaten" value={site.district} onChange={e=>upSite('district',e.target.value)} />
                <input style={{...fInput, color:C.teal, borderColor:C.tealBdr, background:C.tealDim}} placeholder="Country" value={site.country} onChange={e=>upSite('country',e.target.value)} />
              </div>
            </div>
          </div>

          {/* ── B: CPO MILL PROCESSING ── */}
          <div style={card}>
            <div style={secTitle}>B — CPO Mill Processing</div>
            <div style={secSub}>Auto-detected · Override available</div>
            <div style={cbody}>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {[
                  { lbl:'FFB Capacity', key:'ffb', unit:'T / hr', max:3 },
                  { lbl:'Utilization Rate', key:'util', unit:'%', max:3 },
                  { lbl:'Operating Hours', key:'hrs', unit:'hr / day', max:2 },
                  { lbl:'Days / month', key:'days', unit:'days', max:2 },
                ].map(row=>(
                  <div key={row.key} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', background:C.navyField, border:`1px solid rgba(168,189,208,0.12)`, borderRadius:8, padding:'10px 14px', gap:12, minHeight:48 }}>
                    <span style={{ flex:1, fontSize:14, fontWeight:700, color:C.grey, whiteSpace:'nowrap' }}>{row.lbl}</span>
                    <div style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
                      <input
                        type="number"
                        value={mill[row.key]}
                        onChange={e=>upMill(row.key,e.target.value)}
                        readOnly={bConfirmed}
                        style={{ background:'#000', border:`1.5px solid ${C.tealBdr}`, borderRadius:7, color:C.teal, fontFamily:Fnt.mono, fontSize:14, fontWeight:800, padding:'8px 10px', width:76, height:38, textAlign:'center', outline:'none', cursor:bConfirmed?'not-allowed':'text', MozAppearance:'textfield' }}
                      />
                      <span style={{ fontSize:11, fontFamily:Fnt.mono, color:C.greyLt, whiteSpace:'nowrap', width:42 }}>{row.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ padding:'8px 13px 13px' }}>
              <button onClick={()=>setBConfirmed(c=>!c)} style={confirmBtn}>
                {bConfirmed ? '✓ Confirmed — Click To Edit' : 'Confirm Mill Processing'}
              </button>
              <div style={{ fontSize:11, color:C.greyLt, textAlign:'center', marginTop:5 }}>
                {bConfirmed ? 'C and E updated · Click to unlock' : 'Lock values and cascade to C & E'}
              </div>
            </div>
          </div>

          {/* ── C: MILL MONTHLY RESULTS ── */}
          <div style={card}>
            <div style={secTitle}>C — Mill Monthly Results</div>
            <div style={secSub}>Calculated from mill capacity inputs</div>
            <div style={{ padding:'15px 18px', display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
              <div style={{ background:C.green, border:`1.5px solid ${C.green}`, borderRadius:9, padding:'12px 17px', textAlign:'center', width:'100%' }}>
                <div style={{ fontSize:17, fontWeight:700, fontFamily:Fnt.brand, color:'#000', marginBottom:4 }}>FFB Processed</div>
                <div style={{ fontSize:19, fontWeight:700, fontFamily:Fnt.brand, color:'#000' }}>
                  {fmtT(ffbMonth)} <span style={{ fontSize:16, color:'#000', fontWeight:800 }}>t/month</span>
                </div>
              </div>
              <div style={{ fontSize:24, color:C.grey, opacity:0.85, fontWeight:900, lineHeight:1 }}>↓</div>
              <div style={{ background:C.tealDim, border:`1.5px solid ${C.tealBdr}`, borderRadius:9, padding:'12px 17px', textAlign:'center', width:'100%' }}>
                <div style={{ fontSize:17, fontWeight:700, fontFamily:Fnt.brand, color:C.amber, marginBottom:4 }}>EFB Discharged</div>
                <div style={{ fontSize:19, fontWeight:700, fontFamily:Fnt.brand, color:C.amber }}>
                  {fmtT(maxT.efb)} <span style={{ fontSize:16, color:C.amber }}>t/month</span>
                </div>
              </div>
              <div style={{ fontSize:11, fontWeight:700, fontFamily:Fnt.dm, color:C.grey, letterSpacing:'0.05em', width:'100%', textAlign:'center', marginTop:10 }}>Additional CPO Mill Residues</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, width:'100%', marginTop:8 }}>
                {[
                  { lbl:'Decanter Cake', val:maxT.opdc },
                  { lbl:'Palm Oil Sludge', val:maxT.pos },
                ].map(r=>(
                  <div key={r.lbl} style={{ background:C.tealDim, border:`1.5px solid ${C.tealBdr}`, borderRadius:7, padding:'13px 9px', textAlign:'center' }}>
                    <div style={{ fontSize:17, fontWeight:700, fontFamily:Fnt.brand, color:C.amber, marginBottom:4, lineHeight:1.2 }}>{r.lbl}</div>
                    <div style={{ fontFamily:Fnt.brand, fontWeight:700, fontSize:19, color:C.amber }}>{fmtT(r.val)} <span style={{ fontSize:16 }}>t/month</span></div>
                  </div>
                ))}
                <div style={{ background:C.tealDim, border:`1.5px solid ${C.tealBdr}`, borderRadius:7, padding:'13px 9px', textAlign:'center' }}>
                  <div style={{ fontSize:17, fontWeight:700, fontFamily:Fnt.brand, color:C.amber, marginBottom:4 }}>POME Liquid</div>
                  <div style={{ fontFamily:Fnt.brand, fontWeight:700, fontSize:19, color:C.amber }}>{fmtT(maxT.pome)} <span style={{ fontSize:16 }}>t/month</span></div>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
                  <div style={{ background:'rgba(168,189,208,0.07)', border:`1.5px solid rgba(168,189,208,0.22)`, borderRadius:7, padding:'13px 9px', textAlign:'center', flex:1 }}>
                    <div style={{ fontSize:17, fontWeight:700, fontFamily:Fnt.brand, color:C.amber, marginBottom:4 }}>Palm Mesocarp Fiber</div>
                    <div style={{ fontFamily:Fnt.brand, fontWeight:700, fontSize:19, color:C.amber }}>{fmtT(maxT.pmf)} <span style={{ fontSize:16 }}>t/month</span></div>
                  </div>
                  <div style={{ fontSize:11, fontFamily:Fnt.mono, fontWeight:700, color:'rgba(245,166,35,0.85)', textAlign:'center', padding:'3px 6px' }}>Does Mill Have Boiler?</div>
                </div>
              </div>
            </div>
          </div>

          {/* ── G: SOIL ORIGIN ── */}
          <div style={card}>
            <div style={secTitle}>G — Soil Origin</div>
            <div style={secSub}>Auto-detected · Override available</div>
            <div style={cbody}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:9 }}>
                {SOILS.map(s=>(
                  <div key={s.id} onClick={()=>setSelectedSoil(s.id)} style={{ background:selectedSoil===s.id?C.tealDim:C.navyDeep, border:`1.5px solid ${selectedSoil===s.id?C.tealBdr:C.bdrCalc}`, borderRadius:8, padding:'20px 24px', cursor:'pointer', transition:'all 0.12s' }}>
                    <div style={{ fontSize:14, fontWeight:700, fontFamily:Fnt.dm, color:selectedSoil===s.id?C.amber:C.grey }}>
                      {s.name}{s.peat?<span style={{ color:C.amber, fontSize:11 }}> (Peat)</span>:null}{selectedSoil===s.id?' ✓':''}
                    </div>
                    <div style={{ fontSize:12, fontFamily:Fnt.dm, color:selectedSoil===s.id?'rgba(245,166,35,0.75)':C.greyLt, marginTop:6 }}>pH {s.ph} · CEC {s.cec}</div>
                    <div style={{ fontSize:12, fontFamily:Fnt.dm, color:selectedSoil===s.id?'rgba(245,166,35,0.6)':C.greyLt, marginTop:4 }}>{s.cov}</div>
                  </div>
                ))}
              </div>
              <div style={{ display:'flex', gap:7, flexWrap:'wrap', marginTop:4 }}>
                <div style={{ fontSize:15, fontWeight:700, fontFamily:Fnt.mono, padding:'4px 12px', borderRadius:12, border:`1.5px solid ${C.green}`, background:C.green, color:'#000', whiteSpace:'nowrap', display:'inline-block' }}>{soilData.name}</div>
                {soilData.pills.map((p,i)=>(<div key={i} style={{...chips[p.cls], fontSize:13}}>{p.txt}</div>))}
              </div>
            </div>
          </div>
        </div>

        {/* ════ ROW 2: D | E | F | G-TOTAL ════ */}
        <div style={row4}>

          {/* ── D: SELECT MILL RESIDUES ── */}
          <div style={card}>
            <div style={secTitle}>D — Select Mill Residues</div>
            <div style={secSub}>Click any card to activate or de-activate</div>
            <div style={cbody}>
              <div style={grid2}>
                {[
                  { key:'efb',  name:'Empty Fruit Bunches', sub:'EFB · Zero cost' },
                  { key:'opdc', name:'Decanter Cake',        sub:'OPDC · Zero cost', needsEfb:true },
                  { key:'pos',  name:'Palm Oil Sludge',       sub:'POS · Zero cost' },
                  { key:'pmf',  name:'Palm Mesocarp Fiber',   sub:'PMF · Zero cost' },
                  { key:'pke',  name:'Palm Kernel Expeller',  sub:'PKE · $160/t' },
                  { key:'pome', name:'POME (Liquid)',          sub:'Emissions only' },
                  { key:'opf',  name:'Oil Palm Fronds',        sub:'OPF · Zero cost' },
                  { key:'opt',  name:'Oil Palm Trunks',        sub:'OPT · Zero cost' },
                  ...customStreams.map(c=>({ key:c.key, name:c.name, sub:'Custom · Zero cost' })),
                ].map(st=>{
                  const active = activeStreams[st.key];
                  const disabled = st.needsEfb && !activeStreams.efb;
                  return (
                    <div key={st.key} onClick={()=>!disabled && toggleStream(st.key)} style={toggleCard(active && !disabled)}>
                      <div style={{ fontSize:14, fontWeight:700, fontFamily:Fnt.dm, color:(active&&!disabled)?C.amber:C.grey }}>{st.name}</div>
                      <div style={{ fontSize:12, fontFamily:Fnt.dm, color:(active&&!disabled)?'rgba(245,166,35,0.65)':C.greyLt, marginTop:3 }}>{st.sub}{disabled?' (requires EFB)':''}</div>
                    </div>
                  );
                })}
                {showNewFields && (
                  <div style={{ gridColumn:'1/-1' }}>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:7, marginTop:2 }}>
                      {[{val:newRes1,set:setNewRes1},{val:newRes2,set:setNewRes2}].map((f,i)=>(
                        <div key={i} style={{ background:C.navyDeep, border:`1.5px dashed rgba(139,160,180,0.28)`, borderRadius:8, padding:'10px 13px', display:'flex', alignItems:'center', minHeight:52 }}>
                          <input value={f.val} onChange={e=>f.set(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addResidue()} placeholder="Enter New Residue" style={{ background:'transparent', border:'none', outline:'none', fontFamily:Fnt.dm, fontSize:14, fontWeight:500, color:C.white, width:'100%' }} />
                        </div>
                      ))}
                    </div>
                    <div style={{ display:'flex', justifyContent:'center', marginTop:6 }}>
                      <button onClick={addResidue} style={confirmBtn}>Confirm New Residue</button>
                    </div>
                  </div>
                )}
              </div>
              <div style={{ display:'flex', justifyContent:'flex-end', marginTop:8 }}>
                <button onClick={()=>setShowNewFields(v=>!v)} style={{ background:'transparent', border:`1px solid rgba(64,215,197,0.48)`, borderRadius:6, color:C.teal, fontFamily:Fnt.dm, fontSize:11, fontWeight:700, padding:'5px 12px', cursor:'pointer', whiteSpace:'nowrap' }}>Add Residue</button>
              </div>
            </div>
          </div>

          {/* ── E: CHOOSE MONTHLY VOLUME ── */}
          <div style={card}>
            <div style={secTitle}>E — Choose Monthly Volume</div>
            <div style={cbody}>
              <div style={{ fontSize:11, color:C.greyLt, fontFamily:Fnt.mono, letterSpacing:'0.06em', marginBottom:6 }}>TONNES — AVAILABLE AT CPO MILL</div>
              {[
                { key:'efb', name:'Empty Fruit Bunches' },
                { key:'opdc', name:'Decanter Cake' },
                { key:'pos', name:'Palm Oil Sludge' },
                { key:'pmf', name:'Palm Mesocarp Fiber' },
                { key:'pome', name:'POME (Liquid)' },
              ].map(st=>{
                if (!activeStreams[st.key]) return null;
                const mx = maxT[st.key] || 0;
                const val = getSlider(st.key);
                const pct = mx>0 ? (val/mx*100) : 50;
                return (
                  <div key={st.key} style={slItem}>
                    <div style={{ display:'grid', gridTemplateColumns:'auto 1fr auto', alignItems:'baseline', gap:6, marginBottom:10 }}>
                      <span style={{ fontSize:14, fontWeight:700, fontFamily:Fnt.dm, color:C.teal }}>{st.name}</span>
                      <span style={{ display:'inline-flex', alignItems:'baseline', justifyContent:'center', gap:3 }}>
                        <span style={{ fontSize:14, fontWeight:800, fontFamily:Fnt.mono, color:C.amber }}>{fmtT(val)}</span>
                        <span style={{ fontSize:12, fontFamily:Fnt.mono, color:C.amber, opacity:0.75 }}>t/m</span>
                      </span>
                      <span style={{ fontSize:14, fontWeight:800, fontFamily:Fnt.mono, color:C.greyLt }}>{fmtT(mx)}</span>
                    </div>
                    <input type="range" min={0} max={mx||8000} value={val} step={1}
                      onChange={e=>setSlider(st.key,e.target.value)}
                      style={{ width:'100%', height:16, outline:'none', cursor:'pointer', margin:'4px 0', display:'block',
                        background:`linear-gradient(to right, ${C.amber} 0%, ${C.amber} ${pct}%, rgba(64,215,197,0.52) ${pct}%, rgba(64,215,197,0.52) 100%)`,
                        borderRadius:2, WebkitAppearance:'none', appearance:'none' }} />
                    <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, fontFamily:Fnt.mono, color:'rgba(168,189,208,0.55)' }}>
                      <span>0 t</span><span>100%</span>
                    </div>
                  </div>
                );
              })}
              {[...ESTATE_STREAMS, ...customStreams.map(c=>c.key)].map(key=>{
                if (!activeStreams[key]) return null;
                const name = customStreams.find(c=>c.key===key)?.name || ({pke:'Palm Kernel Expeller',opf:'Oil Palm Fronds',opt:'Oil Palm Trunks'}[key]) || key.toUpperCase();
                const val = getSlider(key); const mx = 8000; const pct = val/mx*100;
                return (
                  <div key={key} style={slItem}>
                    <div style={{ display:'grid', gridTemplateColumns:'auto 1fr auto', alignItems:'baseline', gap:6, marginBottom:10 }}>
                      <span style={{ fontSize:14, fontWeight:700, fontFamily:Fnt.dm, color:C.teal }}>{name}</span>
                      <span style={{ display:'inline-flex', alignItems:'baseline', justifyContent:'center', gap:3 }}>
                        <span style={{ fontSize:14, fontWeight:800, fontFamily:Fnt.mono, color:C.amber }}>{fmtT(val)}</span>
                        <span style={{ fontSize:12, fontFamily:Fnt.mono, color:C.amber, opacity:0.75 }}>t/m</span>
                      </span>
                      <span style={{ fontSize:14, fontWeight:800, fontFamily:Fnt.mono, color:C.greyLt }}>10,000</span>
                    </div>
                    <input type="range" min={0} max={mx} value={val} step={1} onChange={e=>setSlider(key,e.target.value)}
                      style={{ width:'100%', height:16, outline:'none', cursor:'pointer', margin:'4px 0', display:'block', background:`linear-gradient(to right, ${C.amber} 0%, ${C.amber} ${pct}%, rgba(64,215,197,0.52) ${pct}%, rgba(64,215,197,0.52) 100%)`, borderRadius:2, WebkitAppearance:'none', appearance:'none' }} />
                    <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, fontFamily:Fnt.mono, color:'rgba(168,189,208,0.55)' }}><span>0 t</span><span>100%</span></div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── F: % OF MILL RESIDUES CAPTURED ── */}
          <div style={{ ...card, background:'#060C14', border:`1.5px solid rgba(64,215,197,0.55)` }}>
            <div style={{ ...secTitle, fontSize:17, color:'#FFF' }}>F — % of Mill Residues Captured</div>
            <div style={{ ...secSub }}>Volumes set in E · % of mill discharge updates live</div>
            <div style={cbody}>
              {/* Hero */}
              <div style={{ background:'linear-gradient(135deg,rgba(0,162,73,0.16) 0%,rgba(6,12,20,1) 65%)', border:`1.5px solid rgba(0,162,73,0.45)`, borderRadius:11, padding:'22px 16px', marginBottom:12, textAlign:'center', boxShadow:'0 0 40px rgba(0,162,73,0.08) inset' }}>
                <div style={{ fontFamily:Fnt.mono, fontWeight:800, fontSize:18, color:'#FFF', letterSpacing:'0.1em', marginBottom:8 }}>VALORIZING</div>
                <div style={{ display:'flex', alignItems:'baseline', justifyContent:'center', gap:8 }}>
                  <span style={{ fontFamily:Fnt.mono, fontWeight:800, fontSize:40, color:C.green, lineHeight:1 }}>{fHeroPct}</span>
                  <span style={{ fontFamily:Fnt.mono, fontWeight:700, fontSize:18, color:C.green }}>% OF MILL RESIDUES</span>
                </div>
              </div>
              {/* Column headers */}
              <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', gap:8, padding:'0 13px 5px' }}>
                {['MILL DISCHARGE','CAPTURED','TOTAL','%'].map(h=>(
                  <div key={h} style={{ fontSize:10, fontWeight:700, fontFamily:Fnt.mono, color:'rgba(168,189,208,0.40)', letterSpacing:'0.05em', textAlign:h==='MILL DISCHARGE'?'left':'center' }}>{h}</div>
                ))}
              </div>
              {/* Rows */}
              <div style={{ border:`1px solid rgba(64,215,197,0.18)`, borderRadius:9, overflow:'hidden', marginTop:4 }}>
                {[
                  { key:'efb', name:'Empty Fruit Bunches' },
                  { key:'opdc', name:'Decanter Cake' },
                  { key:'pos', name:'Palm Oil Sludge' },
                  { key:'pmf', name:'Palm Mesocarp Fiber' },
                  { key:'pome', name:'POME (Liquid)' },
                ].map((st,i)=>{
                  const active = activeStreams[st.key];
                  const cur = streamT[st.key]||0;
                  const mx = maxT[st.key]||0;
                  const pct = mx>0 ? (cur/mx*100).toFixed(1) : '0.0';
                  return (
                    <div key={st.key} style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', gap:8, alignItems:'center', background:i%2===1?'rgba(64,215,197,0.03)':'transparent', padding:'10px 13px', minHeight:42, borderBottom:i<4?`1px solid rgba(255,255,255,0.05)`:'none' }}>
                      <div style={{ fontSize:12, fontWeight:700, fontFamily:Fnt.dm, color:C.grey }}>{st.name}</div>
                      <div style={{ fontSize:12, fontWeight:700, fontFamily:Fnt.mono, color:C.amber, textAlign:'center' }}>{active?fmtT(cur):'—'}</div>
                      <div style={{ fontSize:12, fontWeight:700, fontFamily:Fnt.dm, color:C.grey, textAlign:'center' }}>{fmtT(mx)} t/m</div>
                      <div style={{ textAlign:'center' }}>
                        <span style={{ fontFamily:Fnt.mono, fontWeight:800, fontSize:14, color:C.amber }}>{active?pct:'0.0'}</span>
                        <span style={{ fontSize:13, color:C.amber, marginLeft:2 }}>%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── G-TOTAL: TOTAL MONTHLY PROCESSING ── */}
          <div style={{ ...card, background:'#060C14', border:`1.5px solid rgba(0,162,73,0.55)` }}>
            <div style={{ ...secTitle, fontSize:17, color:'#FFF', borderBottomColor:'rgba(0,162,73,0.20)' }}>G — Total</div>
            <div style={secSub}>Drives all S1–S6 calculations</div>
            <div style={cbody}>
              <div style={{ background:'linear-gradient(160deg,rgba(0,162,73,0.22) 0%,rgba(6,12,20,1) 55%)', border:`1.5px solid rgba(0,162,73,0.50)`, borderRadius:11, padding:'22px 16px', textAlign:'center', marginBottom:12, boxShadow:'0 0 40px rgba(0,162,73,0.06) inset' }}>
                <div style={{ fontFamily:Fnt.mono, fontWeight:800, fontSize:18, color:'#FFF', letterSpacing:'0.1em', marginBottom:8 }}>TOTAL PROCESSING VOLUME</div>
                <div style={{ display:'flex', alignItems:'baseline', justifyContent:'center', gap:4, flexWrap:'nowrap' }}>
                  <span style={{ fontFamily:Fnt.mono, fontWeight:800, fontSize:40, color:C.green, lineHeight:1 }}>{grandTotal>0?fmtT(grandTotal):'—'}</span>
                  {grandTotal>0&&<span style={{ fontFamily:Fnt.mono, fontWeight:700, fontSize:18, color:C.green }}>t/month</span>}
                </div>
              </div>
              <div style={{ fontSize:10, fontWeight:700, fontFamily:Fnt.mono, color:'rgba(0,162,73,0.70)', letterSpacing:'0.08em', marginBottom:7 }}>ACTIVE STREAMS</div>
              {grandTotal===0 ? (
                <div style={{ fontSize:12, fontFamily:Fnt.mono, color:'rgba(168,189,208,0.40)', textAlign:'center', padding:'10px 0' }}>No streams selected — activate in Section D</div>
              ) : (
                Object.entries(streamT).map(([key,t])=>{
                  const nm = ({efb:'Empty Fruit Bunches',opdc:'Decanter Cake',pos:'Palm Oil Sludge',pmf:'Palm Mesocarp Fiber',pome:'POME (Liquid)',pke:'Palm Kernel Expeller',opf:'Oil Palm Fronds',opt:'Oil Palm Trunks'}[key]) || (customStreams.find(c=>c.key===key)?.name) || key.toUpperCase();
                  const pct = grandTotal>0?(t/grandTotal*100).toFixed(1)+' %':'—';
                  return (
                    <div key={key} style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr', gap:8, alignItems:'center', background:'rgba(0,162,73,0.06)', borderLeft:`3px solid ${C.green}`, borderRadius:'0 6px 6px 0', padding:'9px 12px', marginBottom:4 }}>
                      <span style={{ fontSize:13, fontWeight:700, fontFamily:Fnt.dm, color:'#FFF' }}>{nm}</span>
                      <span style={{ fontSize:14, fontWeight:800, fontFamily:Fnt.mono, color:C.green, textAlign:'right' }}>{fmtT(t)} t/m</span>
                      <span style={{ fontSize:13, fontWeight:800, fontFamily:Fnt.mono, color:'#FFF', textAlign:'right' }}>{pct}</span>
                    </div>
                  );
                })
              )}
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', marginTop:12, gap:6 }}>
                <button onClick={()=>setFConfirmed(v=>!v)} style={{ ...confirmBtn, background:C.green }}>
                  {fConfirmed ? '✓ Confirmed — Click To Edit' : 'Confirm Processing Volume'}
                </button>
                <div style={{ fontSize:11, color:C.greyLt, textAlign:'center' }}>{fConfirmed?'Volumes locked · cascade to S1':'Lock volumes and cascade to S1 machinery'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* ════ ROW 3: Residue Mix | Structural | Biological | Secondary ════ */}
        <div style={row4}>

          {/* Residue Mix */}
          <div style={card}>
            <div style={secTitle}>Residue Mix</div>
            <div style={secSub}>Active streams · Blended composition</div>
            <div style={cbody}>
              {[
                { sec:'Elemental Values', cells:[
                  { id:'N', val:blend?.N, unit:'% DM' },
                  { id:'P', val:blend?.P, unit:'% DM' },
                  { id:'K', val:blend?.K, unit:'% DM' },
                ]},
                { sec:'Agronomic Value', cells:[
                  { id:'N', val:blend?.N, unit:'% DM' },
                  { id:'P₂O₅', val:blend?.P2O5, unit:'% DM' },
                  { id:'K₂O', val:blend?.K2O, unit:'% DM' },
                ]},
                { sec:'Nutritional Profile', cells:[
                  { id:'CP', val:blend?.CP, unit:'% DM' },
                  { id:'EE', val:blend?.EE, unit:'% DM' },
                  { id:'Ash', val:blend?.Ash, unit:'% DM' },
                  { id:'MC', val:blend?.MC, unit:'% WB' },
                  { id:'DM', val:blend?.DM, unit:'% WB' },
                  { id:'pH', val:blend?.pH, unit:'wet', dp:1 },
                ]},
                { sec:'Process Readiness', cells:[
                  { id:'C:N', val:blend?.CN, unit:'DM-wtd', dp:1, amber:true },
                  { id:'EC', val:null, unit:'µS/cm' },
                  { id:'VS', val:null, unit:'% DM' },
                  { id:'Aw', val:null, unit:'lab req' },
                  { id:'COD', val:null, unit:'POME' },
                  { id:'BSF', val:'HIGH', unit:'index', green:true },
                ]},
              ].map(grp=>(
                <div key={grp.sec}>
                  <div style={{ fontSize:14, fontWeight:700, fontFamily:Fnt.dm, color:C.teal, marginTop:8, marginBottom:4 }}>{grp.sec}</div>
                  <div style={grp.cells.length===3?grid3:grid2}>
                    {grp.cells.map(c=>(
                      <div key={c.id} style={mixCell}>
                        <span style={mixLbl}>{c.id}</span>
                        <span style={{ display:'flex', alignItems:'baseline', gap:3 }}>
                          <span style={{ fontSize:14, fontWeight:800, fontFamily:Fnt.mono, color:c.green?C.green:c.amber?C.amber:c.val!=null?C.amber:'rgba(139,160,180,0.45)', whiteSpace:'nowrap' }}>
                            {c.val!=null?(typeof c.val==='string'?c.val:c.val.toFixed(c.dp||2)):'—'}
                          </span>
                          <span style={mixUnit}>{c.unit}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Structural Composition */}
          <div style={card}>
            <div style={secTitle}>Structural Composition</div>
            <div style={secSub}>Van Soest · NREL LAP · DM basis</div>
            <div style={cbody}>
              <div style={grid2}>
                {[
                  { id:'NDF', val:blend?.Lignin?62:null, unit:'% DM' },
                  { id:'ADF', val:blend?.Lignin?44:null, unit:'% DM' },
                  { id:'ADL', val:blend?.Lignin?.toFixed(2), unit:'% DM' },
                  { id:'Cellulose', val:19, unit:'% DM' },
                  { id:'Hemicel.', val:18, unit:'% DM' },
                  { id:'Holocel.', val:37, unit:'% DM' },
                  { id:'Extractives', val:null, unit:'lab req' },
                  { id:'NSP', val:null, unit:'PKE only' },
                ].map(c=>(
                  <div key={c.id} style={mixCell}>
                    <span style={mixLbl}>{c.id}</span>
                    <span style={{ display:'flex', alignItems:'baseline', gap:3 }}>
                      <span style={{ fontSize:14, fontWeight:800, fontFamily:Fnt.mono, color:c.val!=null?C.amber:'rgba(139,160,180,0.45)' }}>{c.val!=null?c.val:'—'}</span>
                      <span style={mixUnit}>{c.unit}</span>
                    </span>
                  </div>
                ))}
                <div style={{ ...mixCell, gridColumn:'1/-1', flexDirection:'column', alignItems:'flex-start', gap:3 }}>
                  <span style={mixLbl}>C:N</span>
                  <span style={{ display:'flex', alignItems:'baseline', gap:3 }}>
                    <span style={{ fontSize:14, fontWeight:800, fontFamily:Fnt.mono, color:C.amber }}>{blend?.CN?.toFixed(1)||'—'}</span>
                    <span style={mixUnit}>DM-wtd · BSF 16–25 · Compost 25–35</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Biological Value */}
          <div style={card}>
            <div style={secTitle}>Biological Value</div>
            <div style={secSub}>Humic precursors · Carbon fractions · Qualitative</div>
            <div style={cbody}>
              <div style={grid2}>
                <div style={{ ...mixCell, gridColumn:'1/-1', flexDirection:'column', alignItems:'flex-start', gap:3 }}>
                  <span style={mixLbl}>Humic Precursor</span>
                  <span style={{ display:'flex', alignItems:'baseline', gap:3 }}>
                    <span style={{ fontSize:14, fontWeight:800, fontFamily:Fnt.mono, color:C.green }}>HIGH</span>
                    <span style={mixUnit}>· EFB lignin &gt;15 %</span>
                  </span>
                </div>
                {[
                  { id:'Org. Matter', unit:'kg/t DM' },
                  { id:'Org. Carbon', unit:'CHNS' },
                  { id:'Recalcit. C', unit:'% input C' },
                  { id:'IVDMD', unit:'digestib.' },
                  { id:'Microb. Load', unit:'pre-inoc.' },
                  { id:'Phytase', val:'MED', unit:'conf.' },
                  { id:'Lignin', val:blend?.Lignin?.toFixed(2), unit:'% → humic' },
                ].map(c=>(
                  <div key={c.id} style={mixCell}>
                    <span style={mixLbl}>{c.id}</span>
                    <span style={{ display:'flex', alignItems:'baseline', gap:3 }}>
                      <span style={{ fontSize:14, fontWeight:800, fontFamily:Fnt.mono, color:c.val?C.amber:'rgba(139,160,180,0.45)' }}>{c.val||'—'}</span>
                      <span style={mixUnit}>{c.unit}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Secondary & Micro */}
          <div style={card}>
            <div style={secTitle}>Secondary &amp; Micro</div>
            <div style={secSub}>ICP-OES · CFI-LAB-POME-001 · Pkg B</div>
            <div style={cbody}>
              <div style={grid2}>
                {[
                  { id:'Ca', val:blend?.Ca?.toFixed(2), unit:'% DM' },
                  { id:'Mg', val:blend?.Mg?.toFixed(2), unit:'% DM' },
                  { id:'S',  val:null, unit:'CHNS' },
                  { id:'Fe', val:null, unit:'ICP pend' },
                  { id:'Mn', val:null, unit:'ICP pend' },
                  { id:'Zn', val:null, unit:'ICP pend' },
                  { id:'Cu', val:null, unit:'ICP pend' },
                  { id:'B',  val:null, unit:'ICP pend' },
                  { id:'Si / SiO₂', val:null, unit:'ICP pend' },
                ].map(c=>(
                  <div key={c.id} style={mixCell}>
                    <span style={mixLbl}>{c.id}</span>
                    <span style={{ display:'flex', alignItems:'baseline', gap:3 }}>
                      <span style={{ fontSize:14, fontWeight:800, fontFamily:Fnt.mono, color:c.val?C.amber:'rgba(139,160,180,0.45)' }}>{c.val||'—'}</span>
                      <span style={mixUnit}>{c.unit}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ════ ROW 4: REGULATORY ════ */}
        <div style={row4}>
          <div style={card}>
            <div style={secTitle}>Regulatory &amp; Safety</div>
            <div style={secSub}>Permentan 01/2019 · Heavy metals · Pathogens</div>
            <div style={cbody}>
              <div style={grid2}>
                {[
                  { id:'Pb', unit:'mg/kg DM' },{ id:'Cd', unit:'mg/kg DM' },
                  { id:'Hg', unit:'mg/kg DM' },{ id:'As', unit:'mg/kg DM' },
                  { id:'Cr', unit:'mg/kg DM' },{ id:'Coliform', unit:'CFU/g' },
                ].map(c=>(
                  <div key={c.id} style={mixCell}>
                    <span style={mixLbl}>{c.id}</span>
                    <span style={{ display:'flex', alignItems:'baseline', gap:3 }}>
                      <span style={{ fontSize:14, fontWeight:800, fontFamily:Fnt.mono, color:'rgba(139,160,180,0.45)' }}>—</span>
                      <span style={mixUnit}>{c.unit}</span>
                    </span>
                  </div>
                ))}
                <div style={{ ...mixCell, gridColumn:'1/-1' }}>
                  <span style={mixLbl}>Salmonella</span>
                  <span style={{ fontSize:14, fontWeight:800, fontFamily:Fnt.mono, color:'rgba(139,160,180,0.45)' }}>— presence / absence</span>
                </div>
                <div style={{ ...mixCell, gridColumn:'1/-1' }}>
                  <span style={mixLbl}>Registration</span>
                  <span style={{ display:'flex', alignItems:'baseline', gap:3 }}>
                    <span style={{ fontSize:14, fontWeight:800, fontFamily:Fnt.mono, color:C.amber }}>Pending</span>
                    <span style={mixUnit}>· Permentan 01/2019</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ════ BOTTOM STRIP: 5 PANELS ════ */}
        <div style={{ marginTop:14, background:'#0A1628', border:`1px solid rgba(64,215,197,0.18)`, borderRadius:10, padding:'12px 16px' }}>

          {/* Residue summary row */}
          <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap', marginBottom:12, paddingBottom:10, borderBottom:`1px solid rgba(255,255,255,0.07)` }}>
            <div style={{ fontSize:11, fontWeight:700, fontFamily:Fnt.mono, color:C.greyLt, letterSpacing:'0.08em', whiteSpace:'nowrap' }}>ACTIVE STREAMS</div>
            <div style={{ display:'flex', alignItems:'center', gap:6, flexWrap:'wrap' }}>
              {activeStreams.efb && (
                <div style={{ background:'rgba(64,215,197,0.10)', border:`1px solid rgba(64,215,197,0.35)`, borderRadius:6, padding:'3px 10px', fontSize:11, fontFamily:Fnt.mono, fontWeight:700, color:C.teal }}>
                  EFB · {maxT.efb>0?(streamT.efb/maxT.efb*100).toFixed(1):'—'}% · {fmtT(streamT.efb)} t/mo
                </div>
              )}
              {activeStreams.opdc && (
                <div style={{ background:'rgba(64,215,197,0.07)', border:`1px solid rgba(64,215,197,0.22)`, borderRadius:6, padding:'3px 10px', fontSize:11, fontFamily:Fnt.mono, fontWeight:700, color:C.grey }}>
                  OPDC · {maxT.opdc>0?(streamT.opdc/maxT.opdc*100).toFixed(1):'—'}% · {fmtT(streamT.opdc)} t/mo
                </div>
              )}
            </div>
            <button onClick={()=>setStripExpanded(v=>!v)} style={{ marginLeft:'auto', background:'rgba(255,255,255,0.05)', border:`1px solid rgba(255,255,255,0.10)`, borderRadius:5, padding:'3px 10px', fontSize:11, fontFamily:Fnt.dm, color:C.grey, cursor:'pointer' }}>
              {stripExpanded ? 'Hide ▴' : 'Show all streams ▾'}
            </button>
          </div>

          {/* 5 panels */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:12 }}>
            {/* Panel 1: Soil Value */}
            <div style={{ background:'#0C1E33', border:`1px solid rgba(64,215,197,0.15)`, borderRadius:8, padding:'10px 12px' }}>
              <div style={{ fontSize:10, fontWeight:700, fontFamily:Fnt.mono, color:C.teal, letterSpacing:'0.08em', marginBottom:8 }}>SOIL VALUE</div>
              {[['N · P · K per tonne','—'],['C:N Ratio',blend?.CN?.toFixed(1)||'—'],['Organic Matter %','—'],['Ca + Mg',blend?(blend.Ca+blend.Mg).toFixed(2)+'%':'—']].map(([lbl,val])=>(
                <div key={lbl} style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:5 }}>
                  <span style={{ fontSize:11, color:C.grey, fontFamily:Fnt.dm }}>{lbl}</span>
                  <span style={{ fontSize:11, fontFamily:Fnt.mono, fontWeight:700, color:C.amber }}>{val}</span>
                </div>
              ))}
            </div>
            {/* Panel 2: Process Readiness */}
            <div style={{ background:'#0C1E33', border:`1px solid rgba(64,215,197,0.15)`, borderRadius:8, padding:'10px 12px' }}>
              <div style={{ fontSize:10, fontWeight:700, fontFamily:Fnt.mono, color:C.teal, letterSpacing:'0.08em', marginBottom:8 }}>PROCESS READINESS</div>
              {[
                ['Lignin % Blend', blend?.Lignin?.toFixed(1)||'—'],
                ['ADL %', '—'],
                ['Protein % vs 8% Floor', blend?<span style={{ color:blend.CP>=8?C.green:C.red }}>{blend.CP.toFixed(1)}% {blend.CP>=8?'✓ READY':'✕ LOW'}</span>:'—'],
                ['Moisture % Pre-Process', blend?.MC?.toFixed(1)||'—'],
              ].map(([lbl,val])=>(
                <div key={lbl} style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:5 }}>
                  <span style={{ fontSize:11, color:C.grey, fontFamily:Fnt.dm }}>{lbl}</span>
                  <span style={{ fontSize:11, fontFamily:Fnt.mono, fontWeight:700, color:C.amber }}>{val}</span>
                </div>
              ))}
            </div>
            {/* Panel 3: BSF Readiness */}
            <div style={{ background:'#0C1E33', border:`1px solid rgba(64,215,197,0.15)`, borderRadius:8, padding:'10px 12px' }}>
              <div style={{ fontSize:10, fontWeight:700, fontFamily:Fnt.mono, color:C.teal, letterSpacing:'0.08em', marginBottom:8 }}>BSF READINESS</div>
              {[
                ['C:N Blend', blend?.CN?.toFixed(1)||'—'],
                ['MC Gate', '—'],
                ['Substrate Quality', blend?(blend.CN>=16&&blend.CN<=25?<span style={{ color:C.green }}>HIGH ✓</span>:<span style={{ color:C.amber }}>CHECK C:N</span>):'—'],
              ].map(([lbl,val])=>(
                <div key={lbl} style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:5 }}>
                  <span style={{ fontSize:11, color:C.grey, fontFamily:Fnt.dm }}>{lbl}</span>
                  <span style={{ fontSize:11, fontFamily:Fnt.mono, fontWeight:700, color:C.amber }}>{val}</span>
                </div>
              ))}
            </div>
            {/* Panel 4: Emissions Signal */}
            <div style={{ background:'#0C1E33', border:`1px solid rgba(245,166,35,0.20)`, borderRadius:8, padding:'10px 12px' }}>
              <div style={{ fontSize:10, fontWeight:700, fontFamily:Fnt.mono, color:C.amber, letterSpacing:'0.08em', marginBottom:8 }}>EMISSIONS SIGNAL</div>
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:6, minHeight:60 }}>
                <div style={{ fontSize:18, fontFamily:Fnt.mono, fontWeight:800, color:'rgba(168,189,208,0.30)' }}>— restricted</div>
                <div style={{ fontSize:10, color:'rgba(168,189,208,0.40)', fontFamily:Fnt.dm, textAlign:'center' }}>Enter access code to view CO₂e estimate</div>
              </div>
            </div>
            {/* Panel 5: Commercial Signal */}
            <div style={{ background:'#0C1E33', border:`1px solid rgba(0,162,73,0.20)`, borderRadius:8, padding:'10px 12px' }}>
              <div style={{ fontSize:10, fontWeight:700, fontFamily:Fnt.mono, color:C.green, letterSpacing:'0.08em', marginBottom:8 }}>COMMERCIAL SIGNAL</div>
              {[['NPK Replacement Value','—'],['Soil × Weather × Agronomy','—'],['Stream Mix Factor','—']].map(([lbl,val])=>(
                <div key={lbl} style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:5 }}>
                  <span style={{ fontSize:11, color:C.grey, fontFamily:Fnt.dm }}>{lbl}</span>
                  <span style={{ fontSize:11, fontFamily:Fnt.mono, fontWeight:700, color:C.green }}>{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



// ======================================================================
// FILE: src/CFI_S0_Redesign.jsx
// SIZE: 47561 chars / 834 lines
// ======================================================================

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

// ─── COLOUR TOKENS ──────────────────────────────────────────────────────────
const C = {
  navy:    "#0B1929",
  navyMid: "#0F2236",
  navyLt:  "#162E45",
  navyDk:  "#070F1A",
  teal:    "#00C9B1",
  tealDk:  "#009E8C",
  tealLt:  "#5EEADA",
  amber:   "#F5A623",
  amberLt: "#FFD080",
  red:     "#E84040",
  green:   "#3DCB7A",
  blue:    "#4A9EDB",
  purple:  "#9B59B6",
  white:   "#F0F4F8",
  grey:    "#8BA0B4",
  greyLt:  "#C4D3E0",
};

// ─── ATOMS ───────────────────────────────────────────────────────────────────

const LABEL = { display:"block", color:C.grey, fontSize:10, fontWeight:700,
  textTransform:"uppercase", letterSpacing:"0.09em", marginBottom:5 };

const Card = ({children,style={}}) => (
  <div style={{background:C.navyMid, border:"1px solid rgba(255,255,255,0.06)",
    borderRadius:10, padding:20, ...style}}>
    {children}
  </div>
);

const Divider = ({color}) => (
  <hr style={{border:"none", borderTop:`1px solid ${color||C.navyLt}`, margin:"14px 0"}}/>
);

const SectionHdr = ({icon, title, color=C.teal, sub}) => (
  <div style={{background:"#0D1F33", borderLeft:`3px solid ${color}`,
    borderRadius:8, padding:"11px 14px", marginBottom:14,
    display:"flex", alignItems:"center", gap:10}}>
    <span style={{fontSize:17, lineHeight:1}}>{icon}</span>
    <div>
      <div style={{color, fontWeight:800, fontSize:12, letterSpacing:"0.07em", textTransform:"uppercase"}}>{title}</div>
      {sub && <div style={{color:C.grey, fontSize:10, marginTop:2}}>{sub}</div>}
    </div>
  </div>
);

const Lbl = ({t, unit, unitColor}) => (
  <label style={LABEL}>
    {t}
    {unit && <span style={{color:unitColor||C.tealLt, marginLeft:5, fontSize:9, fontWeight:600, letterSpacing:"0.04em"}}>[{unit}]</span>}
  </label>
);

const BluField = ({label, unit, value, onChange, disabled, note}) => (
  <div>
    <Lbl t={label} unit={unit}/>
    <input
      style={{background: disabled?"#0A1820":"#142030",
        border:`1px solid ${disabled?C.teal+"30":C.teal+"55"}`,
        borderRadius:6, color: disabled?C.teal:C.white,
        padding:"8px 12px", fontSize:13, width:"100%", outline:"none",
        boxSizing:"border-box", cursor:disabled?"not-allowed":"text"}}
      value={value}
      onChange={e=>onChange&&onChange(e.target.value)}
      disabled={!!disabled}
    />
    {note && <div style={{color:C.grey, fontSize:10, marginTop:3}}>{note}</div>}
  </div>
);

const AmbField = ({label, unit, value, onChange, note}) => (
  <div>
    <Lbl t={label} unit={unit} unitColor={C.amberLt}/>
    <input
      style={{background:"#1E1608", border:`1px solid ${C.amber}55`,
        borderRadius:6, color:C.amberLt,
        padding:"8px 12px", fontSize:13, width:"100%", outline:"none", boxSizing:"border-box"}}
      value={value}
      onChange={e=>onChange&&onChange(e.target.value)}
    />
    {note && (
      <div style={{color:C.amber+"bb", fontSize:10, marginTop:3, display:"flex", alignItems:"center", gap:4}}>
        <span>⚠</span><span>{note}</span>
      </div>
    )}
  </div>
);

const CalcField = ({label, unit, value, note}) => (
  <div>
    <Lbl t={label} unit={unit} unitColor={C.green+"99"}/>
    <div style={{background:"#0A1F12", border:`1px solid ${C.green}35`,
      borderRadius:6, color:C.green, padding:"8px 12px", fontSize:13,
      fontWeight:700, fontFamily:"'Courier New',monospace", letterSpacing:"0.02em"}}>
      {value}
    </div>
    {note && <div style={{color:C.green+"99", fontSize:10, marginTop:3}}>{note}</div>}
  </div>
);

const KPI = ({label, value, unit, color=C.teal}) => (
  <div style={{background:C.navyDk, border:`1px solid ${color}28`,
    borderTop:`2px solid ${color}`, borderRadius:8, padding:"14px 12px", textAlign:"center"}}>
    <div style={{color:C.grey, fontSize:9, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:6}}>{label}</div>
    <div style={{color, fontSize:20, fontWeight:900, letterSpacing:"-0.01em", lineHeight:1}}>{value}</div>
    {unit && <div style={{color:C.grey, fontSize:9, marginTop:5}}>{unit}</div>}
  </div>
);

const Badge = ({text, color}) => (
  <span style={{background:color+"20", border:`1px solid ${color}50`, borderRadius:10,
    padding:"2px 9px", color, fontSize:10, fontWeight:800, letterSpacing:"0.04em",
    display:"inline-block", whiteSpace:"nowrap"}}>
    {text}
  </span>
);

const Halt = ({msg}) => (
  <div style={{background:C.red+"18", border:`1px solid ${C.red}88`,
    borderLeft:`3px solid ${C.red}`, borderRadius:6, padding:"9px 13px",
    color:C.red, fontSize:12, fontWeight:700,
    display:"flex", alignItems:"center", gap:8, marginTop:8}}>
    <span style={{fontSize:15}}>🛑</span>
    <span>HALT — {msg}</span>
  </div>
);

const Warn = ({msg, type="warn"}) => {
  const col = type==="warn"?C.amber : type==="ok"?C.green : C.red;
  const icon = type==="warn"?"⚠" : type==="ok"?"✓" : "✕";
  return (
    <div style={{background:col+"14", border:`1px solid ${col}44`,
      borderLeft:`3px solid ${col}`, borderRadius:6,
      padding:"8px 13px", color:col, fontSize:11,
      display:"flex", alignItems:"flex-start", gap:8, marginTop:8}}>
      <span style={{fontWeight:800, fontSize:12, marginTop:1, flexShrink:0}}>{icon}</span>
      <span style={{lineHeight:1.5}}>{msg}</span>
    </div>
  );
};

const SelectField = ({label, value, onChange, options}) => (
  <div>
    <Lbl t={label}/>
    <select
      style={{background:"#142030", border:`1px solid ${C.teal}55`,
        borderRadius:6, color:C.white, padding:"8px 28px 8px 12px",
        fontSize:13, width:"100%", outline:"none", cursor:"pointer",
        appearance:"none",
        backgroundImage:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%2300C9B1'/%3E%3C/svg%3E\")",
        backgroundRepeat:"no-repeat", backgroundPosition:"right 10px center", boxSizing:"border-box"}}
      value={value}
      onChange={e=>onChange(e.target.value)}
    >
      {options.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}
    </select>
  </div>
);

const PillToggle = ({options, value, onChange, color=C.teal}) => (
  <div style={{display:"flex", background:C.navyDk, borderRadius:8, padding:3, gap:3}}>
    {options.map(o=>(
      <div key={String(o.v)} onClick={()=>onChange(o.v)}
        style={{flex:1, padding:"6px 10px", borderRadius:6, cursor:"pointer", textAlign:"center",
          background:value===o.v?color+"28":"transparent",
          border:`1px solid ${value===o.v?color+"66":"transparent"}`,
          transition:"all 0.15s"}}>
        <div style={{color:value===o.v?color:C.grey, fontSize:11, fontWeight:700}}>{o.l}</div>
        {o.sub&&<div style={{color:C.grey, fontSize:9, marginTop:2}}>{o.sub}</div>}
      </div>
    ))}
  </div>
);

const ResidueCard = ({label, active, locked, onClick, sublabel}) => (
  <div onClick={locked?undefined:onClick}
    style={{background:active?C.teal+"18":C.navyDk,
      border:`1px solid ${active?C.teal+"66":"rgba(255,255,255,0.07)"}`,
      borderTop:`2px solid ${active?C.teal:"rgba(255,255,255,0.07)"}`,
      borderRadius:8, padding:"10px 14px",
      cursor:locked?"not-allowed":"pointer", transition:"all 0.15s"}}>
    <div style={{display:"flex", alignItems:"center", justifyContent:"space-between"}}>
      <span style={{color:active?C.teal:C.grey, fontWeight:800, fontSize:12}}>{label}</span>
      <div style={{width:14, height:14, borderRadius:"50%",
        background:active?C.teal:"transparent",
        border:`2px solid ${active?C.teal:C.grey+"66"}`, transition:"all 0.15s"}}/>
    </div>
    {sublabel&&<div style={{color:C.grey, fontSize:9, marginTop:4}}>{sublabel}</div>}
    {locked&&<div style={{color:C.grey, fontSize:9, marginTop:3, fontStyle:"italic"}}>locked — always active</div>}
  </div>
);

// ─── DATA ────────────────────────────────────────────────────────────────────
const SOILS = [
  {id:"inceptisol", name:"Inceptisols",  pct:"39%", ph:"4.1", cec:"15.4", desc:"Best fertility, well-drained",       nAdj:-0.40, pAdj:-0.50},
  {id:"ultisol",    name:"Ultisols",     pct:"24%", ph:"4.5", cec:"8.2",  desc:"Clay-rich, acidic, low base sat.",  nAdj:0,     pAdj:0    },
  {id:"oxisol",     name:"Oxisols",      pct:"8%",  ph:"4.4", cec:"5.0",  desc:"Fe/Al oxides, low P retention",    nAdj:0.10,  pAdj:0.20 },
  {id:"histosol",   name:"Histosols",    pct:"7%",  ph:"3.8", cec:"35.0", desc:"Peat/organic, drainage issues",    nAdj:-0.80, pAdj:-0.70},
  {id:"spodosol",   name:"Spodosols",    pct:"22%", ph:"4.77",cec:"2.0",  desc:"Sandy, lowest fertility",          nAdj:0.20,  pAdj:0.15 },
];
const AG_TIERS = [
  {id:"vgam",      name:"VGAM — Very Good Agronomy Management", uplift:1.00},
  {id:"gam",       name:"GAM — Good Agronomy Management",       uplift:0.85},
  {id:"poor",      name:"Poor Management",                       uplift:0.65},
  {id:"abandoned", name:"Abandoned / Degraded",                  uplift:0.40},
];
const FE_COLOR = {LOW:C.green, MODERATE:C.teal, HIGH:C.amber, CRITICAL:C.red, Untested:C.grey};

// ═══════════════════════════════════════════════════════════════════════════

export default function S0InputPage() {
  const [s0,setS0] = useState({
    plantName:"", estateName:"", millName:"", millManual:"", district:"", province:"", provinceManual:"", estateArea:"", gpsCoords:"", rspo:"none",
    ffbCapacity:60, utilisation:85, hrsDay:24, daysMonth:30,
    efbPct:60, opdcPct:40, efbEnabled:true, opdcEnabled:true,
    efbMC:70, opdcMC:70,
    pomeSludgeEnabled:false, pomeSludgeMC:82, pomeSludgeDewatered:false,
    pomeSludgeFeResult:"", pomeSludgeInclPct:15,
    pkeEnabled:false, pkeTPD:5,
    soil:"ultisol", ag:"vgam",
    efbCapturePct:100, opdcCapturePct:100, pomeCapturePct:100,
    carbonPriceScenario:"mid", carbonPriceCustom:25,
  });
  const up = (k,v) => setS0(p=>({...p,[k]:v}));

  // ── SUPABASE LIVE DATA ──
  const [companies, setCompanies] = useState(null);
  const [mills, setMills] = useState(null);
  const [provinces, setProvinces] = useState(null);

  useEffect(() => {
    supabase.from("cfi_mill_owners").select("company").order("company", { ascending: true })
      .then(({ data, error }) => {
        if (error || !data) { setCompanies([]); return; }
        setCompanies([...new Set(data.map(r => r.company).filter(Boolean))]);
      });
    supabase.from("cfi_province_soil_lookup").select("province").order("province", { ascending: true })
      .then(({ data, error }) => {
        if (error || !data) { setProvinces([]); return; }
        setProvinces([...new Set(data.map(r => r.province).filter(Boolean))]);
      });
  }, []);

  useEffect(() => {
    if (!s0.plantName || s0.plantName === "I will enter manually") { setMills([]); return; }
    setMills(null);
    supabase.from("cfi_mills_60tph").select("mill_name,province")
      .eq("owner_company", s0.plantName).order("mill_name", { ascending: true })
      .then(({ data, error }) => { setMills(error || !data ? [] : data); });
  }, [s0.plantName]);

  useEffect(() => {
    if (s0.millName && s0.millName !== "I will enter manually" && mills) {
      const match = mills.find(m => m.mill_name === s0.millName);
      if (match?.province && !s0.province) up("province", match.province);
    }
  }, [s0.millName]);

  // ── DERIVED ─────────────────────────────────────────────────────────────
  const effFFB        = +(s0.ffbCapacity*(s0.utilisation/100)).toFixed(2);
  const monthFFB      = +(effFFB*s0.hrsDay*s0.daysMonth).toFixed(0);
  const efbTPH        = +(effFFB*0.225).toFixed(3);
  const efbTPD        = +(efbTPH*s0.hrsDay).toFixed(1);
  const efbMonthWet   = +(efbTPD*s0.daysMonth).toFixed(0);
  const efbDMpd       = +(efbTPD*((100-s0.efbMC)/100)).toFixed(1);
  const opdcNatTPD    = +(efbTPD*0.152).toFixed(2);
  const opdcNatDM     = +(opdcNatTPD*((100-s0.opdcMC)/100)).toFixed(2);
  const opdcMonthWet  = +(opdcNatTPD*s0.daysMonth).toFixed(0);
  const blendTotal    = +s0.efbPct + +s0.opdcPct;
  const blendOK       = Math.abs(blendTotal-100) < 0.5;
  const opdcDMreq     = +(efbDMpd*(s0.opdcPct/s0.efbPct)).toFixed(1);
  const opdcShortfall = +(opdcDMreq-opdcNatDM).toFixed(1);
  const s1_blendDM    = +(efbDMpd*s0.daysMonth+opdcDMreq*s0.daysMonth).toFixed(0);
  const blendWetPerDM = (s0.efbPct/100)/((100-s0.efbMC)/100) + (s0.opdcPct/100)/((100-s0.opdcMC)/100);
  const blendMC       = +(100*(1-1/blendWetPerDM)).toFixed(1);
  const s1_blendWet   = +(s1_blendDM/((100-blendMC)/100)).toFixed(0);

  const pomeSludgeNatTPD  = +(effFFB*s0.hrsDay*0.0245).toFixed(1);
  const pomeMonthWet      = +(pomeSludgeNatTPD*s0.daysMonth).toFixed(0);
  const pomeSludgeActMC   = s0.pomeSludgeDewatered ? 65 : s0.pomeSludgeMC;
  const pomeSludgeDMfrac  = (100-pomeSludgeActMC)/100;
  const pomeSludgeDMpd    = +(pomeSludgeNatTPD*pomeSludgeDMfrac).toFixed(2);
  const pomeFe            = parseFloat(s0.pomeSludgeFeResult);
  const feStatus          = isNaN(pomeFe)?"Untested":pomeFe<3000?"LOW":pomeFe<5000?"MODERATE":pomeFe<8000?"HIGH":"CRITICAL";
  const pomeSludgeMaxPct  = isNaN(pomeFe)?15:pomeFe<3000?20:pomeFe<5000?15:pomeFe<8000?10:5;
  const inclPctCapped     = Math.min(+s0.pomeSludgeInclPct, pomeSludgeMaxPct);
  const pomeSludgeInclTPD = s0.pomeSludgeEnabled?+(pomeSludgeNatTPD*inclPctCapped/100).toFixed(1):0;
  const pomeSludgeInclDM  = +(pomeSludgeInclTPD*pomeSludgeDMfrac).toFixed(2);
  const pomeN = +(pomeSludgeInclDM*17.6).toFixed(1);
  const pomeP = +(pomeSludgeInclDM*4.0).toFixed(1);
  const pomeK = +(pomeSludgeInclDM*7.0).toFixed(1);

  const efbCapturedMonth  = +(efbMonthWet*(s0.efbCapturePct/100)).toFixed(0);
  const opdcCapturedMonth = +(opdcMonthWet*(s0.opdcCapturePct/100)).toFixed(0);
  const pomeCapturedMonth = +(pomeMonthWet*(s0.pomeCapturePct/100)).toFixed(0);

  const pkeDM   = s0.pkeEnabled?+(s0.pkeTPD*0.88).toFixed(1):0;
  const pkeN    = s0.pkeEnabled?+(pkeDM*29).toFixed(1):0;
  const pkeCost = s0.pkeEnabled?+(+s0.pkeTPD*160).toFixed(0):0;

  const efbN=+(efbDMpd*7.6).toFixed(1), efbP=+(efbDMpd*1.5).toFixed(1), efbK=+(efbDMpd*9.4).toFixed(1);
  const opdcN=+(opdcDMreq*23.2).toFixed(1), opdcP=+(opdcDMreq*3.2).toFixed(1), opdcK=+(opdcDMreq*4.2).toFixed(1);
  const totN=+(+efbN + +opdcN + +pomeN + +pkeN).toFixed(1);
  const totP=+(+efbP + +opdcP + +pomeP).toFixed(1);
  const totK=+(+efbK + +opdcK + +pomeK).toFixed(1);

  const totalDMcn = efbDMpd+opdcDMreq+pomeSludgeInclDM+pkeDM;
  const blendCN = totalDMcn>0
    ? +((efbDMpd*60+opdcDMreq*20+pomeSludgeInclDM*15+pkeDM*15)/totalDMcn).toFixed(1)
    : null;

  const cprice = s0.carbonPriceScenario==="low"?15:s0.carbonPriceScenario==="high"?45:25;
  const co2est = +(monthFFB*0.225*0.3*(s0.efbCapturePct/100)*28/1000).toFixed(0);
  const co2annual = co2est*12;
  const carbRev = +(co2annual*cprice).toFixed(0);

  const soilObj = SOILS.find(s=>s.id===s0.soil)||SOILS[1];
  const siteOK  = s0.plantName&&s0.millName&&s0.district;

  const g2 = {display:"grid", gridTemplateColumns:"1fr 1fr", gap:12};
  const g3 = {display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12};
  const g4 = {display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:12};
  const inputStyle = {background:"#1A3A5C", border:"1px solid #1E6B8C", borderRadius:6,
    color:C.white, padding:"8px 12px", fontSize:13, width:"100%", outline:"none", boxSizing:"border-box"};

  return (
    <div style={{background:C.navy, minHeight:"100vh", fontFamily:"'Inter','Segoe UI',system-ui,sans-serif", color:C.white}}>

      {/* ── STICKY HEADER BAR ── */}
      <div style={{background:C.navyDk, borderBottom:`1px solid ${C.teal}22`,
        padding:"13px 24px", display:"flex", alignItems:"center",
        justifyContent:"space-between", position:"sticky", top:0, zIndex:100}}>
        <div style={{display:"flex", alignItems:"center", gap:12}}>
          <div style={{background:C.teal+"22", border:`1px solid ${C.teal}55`,
            borderRadius:8, padding:"6px 14px", color:C.teal,
            fontWeight:900, fontSize:14, letterSpacing:"0.12em"}}>S0</div>
          <div>
            <div style={{color:C.white, fontWeight:800, fontSize:15}}>Input Parameters</div>
            <div style={{color:C.grey, fontSize:11}}>Site identity · Mill capacity · Residue streams · Soil profile</div>
          </div>
        </div>
        <div style={{display:"flex", alignItems:"center", gap:8, flexWrap:"wrap"}}>
          {siteOK
            ? <Badge text="✓ Site configured" color={C.green}/>
            : <Badge text="Site data incomplete" color={C.amber}/>}
          {blendOK
            ? <Badge text="✓ Blend valid" color={C.green}/>
            : <Badge text="Blend error" color={C.red}/>}
          <Badge text={"Soil: "+soilObj.name} color={C.teal}/>
          {blendCN && <Badge text={"C:N "+blendCN} color={blendCN<=25?C.green:blendCN<=35?C.amber:C.red}/>}
        </div>
      </div>

      {/* ── MAIN GRID ── */}
      <div style={{padding:"20px 24px", maxWidth:1400, margin:"0 auto"}}>

        {/* ── TWO-COLUMN ROW: left = A+B stacked · right = C+Soil/AG stacked ── */}
        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, alignItems:"start"}}>

          {/* ════ LEFT COLUMN ════ */}
          <div style={{display:"flex", flexDirection:"column", gap:16}}>

            {/* ── A: SITE IDENTITY ── */}
            <Card>
              <div style={{color:C.teal, fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:18, marginBottom:14}}>
                A — Enter your site details below
              </div>

              {/* Row 1: Plantation autocomplete + Estate */}
              <div style={g2}>
                <div style={{position:"relative"}}>
                  <input style={inputStyle} value={s0.plantName} onChange={e=>{up("plantName",e.target.value);up("millName","");up("_plantOpen",true);}}
                    onFocus={()=>up("_plantOpen",true)} onBlur={()=>setTimeout(()=>up("_plantOpen",false),150)}
                    placeholder={companies===null?"Loading companies…":"Plantation / Company name"} autoComplete="off"/>
                  {s0._plantOpen && (()=>{
                    const opts = companies || [];
                    const all = ["I will enter manually", ...opts];
                    const q = (s0.plantName||"").toLowerCase();
                    const filtered = all.filter(o=> !q || o.toLowerCase().includes(q));
                    return filtered.length > 0 ? (
                      <div style={{position:"absolute",top:"100%",left:0,right:0,zIndex:50,background:C.navyDk,border:`1px solid ${C.teal}55`,borderRadius:6,maxHeight:200,overflowY:"auto",marginTop:2}}>
                        {filtered.map(o=>(
                          <div key={o} onMouseDown={()=>{up("plantName",o==="I will enter manually"?"":o);up("_plantOpen",false);}}
                            style={{padding:"8px 12px",fontSize:13,color:o==="I will enter manually"?C.amber:C.white,cursor:"pointer",borderBottom:`1px solid rgba(255,255,255,0.04)`}}>
                            {o}
                          </div>
                        ))}
                      </div>
                    ) : null;
                  })()}
                </div>
                <input style={inputStyle} value={s0.estateName} onChange={e=>up("estateName",e.target.value)} placeholder="Estate name"/>
              </div>
              {/* Row 2: Mill dropdown + District */}
              <div style={{...g2, marginTop:10}}>
                <div>
                  <select style={{...inputStyle, appearance:"auto", color: mills===null?C.grey:C.white}} value={s0.millName} onChange={e=>up("millName",e.target.value)}>
                    <option value="">{mills===null?"Loading mills…":"Mill name / Unit"}</option>
                    <option value="I will enter manually">I will enter manually</option>
                    {(mills||[]).map(m=><option key={m.mill_name} value={m.mill_name}>{m.mill_name}</option>)}
                  </select>
                  {s0.millName==="I will enter manually" && (
                    <input style={{...inputStyle,marginTop:6}} value={s0.millManual} onChange={e=>up("millManual",e.target.value)} placeholder="Enter mill name manually"/>
                  )}
                </div>
                <input style={inputStyle} value={s0.district} onChange={e=>up("district",e.target.value)} placeholder="District / Kabupaten"/>
              </div>
              {/* Row 3: Province dropdown + Estate area */}
              <div style={{...g2, marginTop:10}}>
                <div>
                  <select style={{...inputStyle, appearance:"auto", color: provinces===null?C.grey:C.white}} value={s0.province} onChange={e=>up("province",e.target.value)}>
                    <option value="">{provinces===null?"Loading provinces…":"Province"}</option>
                    <option value="I will enter manually">I will enter manually</option>
                    {(provinces||[]).map(o=><option key={o} value={o}>{o}</option>)}
                  </select>
                  {s0.province==="I will enter manually" && (
                    <input style={{...inputStyle,marginTop:6}} value={s0.provinceManual} onChange={e=>up("provinceManual",e.target.value)} placeholder="Enter province manually"/>
                  )}
                </div>
                <input style={inputStyle} value={s0.estateArea} onChange={e=>up("estateArea",e.target.value)} placeholder="Total estate area (ha)"/>
              </div>
              {/* Row 4 — GPS half width */}
              <div style={{...g2, marginTop:10}}>
                <div>
                  <input style={inputStyle} value={s0.gpsCoords} onChange={e=>up("gpsCoords",e.target.value)} placeholder="GPS coordinates"/>
                  <div style={{color:C.grey, fontSize:11, fontStyle:"italic", marginTop:4}}>(Optional)</div>
                </div>
                <div/>
              </div>

              {/* Status row */}
              <div style={{marginTop:14, fontSize:12, fontWeight:700}}>
                {siteOK
                  ? <span style={{color:C.green}}>Site data complete</span>
                  : <span style={{color:C.amber}}>Complete required fields to proceed</span>}
              </div>
            </Card>

            {/* ── B: MILL CAPACITY ── */}
            <Card>
              <SectionHdr icon="⚙" title="B — Oil Palm Mill Fresh Fruit Bunch Processing Capacity" color={C.teal}/>

              {/* 4 inputs: label LEFT of box, unit below label */}
              <div style={{display:"flex", gap:16, flexWrap:"wrap", alignItems:"flex-end"}}>
                {/* FFB Processing */}
                <div style={{display:"flex", alignItems:"center", gap:10}}>
                  <div style={{textAlign:"right", minWidth:90}}>
                    <div style={{color:C.grey, fontSize:11, fontWeight:700, letterSpacing:"0.04em"}}>FFB Processing</div>
                    <div style={{color:C.grey, fontSize:10, marginTop:2}}>Tons per Hour</div>
                  </div>
                  <input style={{background:"#142030", border:`1px solid ${C.teal}55`, borderRadius:6,
                    color:C.white, padding:"10px 12px", fontSize:16, fontWeight:700,
                    width:72, outline:"none", boxSizing:"border-box", textAlign:"center"}}
                    value={s0.ffbCapacity} onChange={e=>up("ffbCapacity",+e.target.value)}/>
                </div>
                {/* Capacity Utilisation */}
                <div style={{display:"flex", alignItems:"center", gap:10}}>
                  <div style={{textAlign:"right", minWidth:70}}>
                    <div style={{color:C.grey, fontSize:11, fontWeight:700, letterSpacing:"0.04em"}}>Capacity</div>
                    <div style={{color:C.grey, fontSize:10, marginTop:2}}>Utilisation %</div>
                  </div>
                  <div>
                    <input style={{background:"#142030", border:`1px solid ${C.teal}55`, borderRadius:6,
                      color:C.white, padding:"10px 12px", fontSize:16, fontWeight:700,
                      width:72, outline:"none", boxSizing:"border-box", textAlign:"center"}}
                      value={s0.utilisation} onChange={e=>up("utilisation",+e.target.value)}/>
                    <div style={{color:C.grey, fontSize:10, marginTop:3}}>Default 85%</div>
                  </div>
                </div>
                {/* Operating Hours */}
                <div style={{display:"flex", alignItems:"center", gap:10}}>
                  <div style={{textAlign:"right", minWidth:80}}>
                    <div style={{color:C.grey, fontSize:11, fontWeight:700, letterSpacing:"0.04em"}}>Operating</div>
                    <div style={{color:C.grey, fontSize:10, marginTop:2}}>Hours / Day</div>
                  </div>
                  <input style={{background:"#142030", border:`1px solid ${C.teal}55`, borderRadius:6,
                    color:C.white, padding:"10px 12px", fontSize:16, fontWeight:700,
                    width:72, outline:"none", boxSizing:"border-box", textAlign:"center"}}
                    value={s0.hrsDay} onChange={e=>up("hrsDay",+e.target.value)}/>
                </div>
                {/* Operating Days */}
                <div style={{display:"flex", alignItems:"center", gap:10}}>
                  <div style={{textAlign:"right", minWidth:80}}>
                    <div style={{color:C.grey, fontSize:11, fontWeight:700, letterSpacing:"0.04em"}}>Operating</div>
                    <div style={{color:C.grey, fontSize:10, marginTop:2}}>Days / Month</div>
                  </div>
                  <input style={{background:"#142030", border:`1px solid ${C.teal}55`, borderRadius:6,
                    color:C.white, padding:"10px 12px", fontSize:16, fontWeight:700,
                    width:72, outline:"none", boxSizing:"border-box", textAlign:"center"}}
                    value={s0.daysMonth} onChange={e=>up("daysMonth",+e.target.value)}/>
                </div>
              </div>

              <Divider/>
              <div style={g4}>
                <KPI label="Effective FFB" value={effFFB} unit="TPH" color={C.green}/>
                <KPI label="Monthly FFB" value={monthFFB.toLocaleString()} unit="t/month" color={C.green}/>
                <KPI label="EFB at Discharge" value={efbTPH} unit="TPH wet" color={C.teal}/>
                <KPI label="EFB Monthly" value={efbMonthWet.toLocaleString()} unit="t/month wet" color={C.teal}/>
              </div>
              <Divider/>

              {/* ── D: Residue capture % ── */}
              <div style={{borderLeft:`3px solid ${C.teal}`, background:"#0D1F33", borderRadius:6, padding:"8px 12px", marginTop:14, marginBottom:10}}>
                <span style={{color:C.teal, fontWeight:800, fontSize:12}}>D — Residue capture %</span>
              </div>
              <div style={{background:C.navyDk, borderRadius:8, padding:"14px 16px", marginBottom:10}}>
                <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12}}>
                  {[
                    {label:"EFB capture", key:"efbCapturePct", base:efbMonthWet, captured:efbCapturedMonth},
                    {label:"OPDC capture", key:"opdcCapturePct", base:opdcMonthWet, captured:opdcCapturedMonth},
                    {label:"POME capture", key:"pomeCapturePct", base:pomeMonthWet, captured:pomeCapturedMonth},
                  ].map(f=>(
                    <div key={f.key}>
                      <div style={{color:C.grey, fontSize:11, fontWeight:700, marginBottom:4}}>{f.label} <span style={{fontWeight:500}}>%</span></div>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={s0[f.key]}
                        onChange={e=>up(f.key, Math.min(100, Math.max(0, +e.target.value)))}
                        style={{background:"#142030", border:`1px solid ${C.teal}66`, borderRadius:6, color:C.white, padding:"8px 12px", fontSize:13, width:"100%", outline:"none", boxSizing:"border-box"}}
                      />
                      <div style={{color:C.grey, fontSize:10, marginTop:4}}>= {f.captured.toLocaleString()} t FW/mo</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, marginBottom:10}}>
                {[
                  {label:"EFB captured", value:efbCapturedMonth},
                  {label:"OPDC captured", value:opdcCapturedMonth},
                  {label:"POME captured", value:pomeCapturedMonth},
                ].map(r=>(
                  <div key={r.label}>
                    <div style={{color:C.amber, fontWeight:700, fontSize:14}}>{r.value.toLocaleString()}</div>
                    <div style={{color:C.grey, fontSize:10}}>{r.label} · t FW/mo</div>
                  </div>
                ))}
              </div>

              {/* ── E: CARBON CREDITS PREVIEW ── */}
              <div style={{background:C.navyDk, border:`1px solid rgba(255,255,255,0.08)`, borderRadius:8, padding:12}}>
                <div style={{marginBottom:6}}>
                  <div style={{color:C.greyLt, fontWeight:800, fontSize:11, letterSpacing:"0.05em"}}>
                    E — 🌿 Carbon Credits Preview
                  </div>
                  <div style={{color:C.grey, fontSize:10, marginTop:3}}>Full methodology available in the CO₂ tab</div>
                </div>
                <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:8}}>
                  {[
                    {l:"Monthly CO₂e",   v:co2est.toLocaleString()+" t",   c:C.green},
                    {l:"Annual CO₂e",    v:co2annual.toLocaleString()+" t", c:C.green},
                    {l:"Annual Revenue", v:"$"+carbRev.toLocaleString(),    c:C.amber},
                    {l:"Carbon Price",   v:"$"+cprice+"/t",                 c:C.amberLt},
                  ].map((k,i)=>(
                    <div key={i} style={{textAlign:"center", minWidth:0}}>
                      <div style={{color:C.grey, fontSize:9, textTransform:"uppercase", letterSpacing:"0.07em", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis"}}>{k.l}</div>
                      <div style={{color:k.c, fontSize:13, fontWeight:900, marginTop:4, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis"}}>{k.v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

          </div>{/* end LEFT COLUMN */}

          {/* ════ RIGHT COLUMN ════ */}
          <div style={{display:"flex", flexDirection:"column", gap:16}}>

            {/* ── C: RESIDUE SELECTION ── */}
            <Card>
              <SectionHdr icon="🌿" title="C — Choose Residues for Biological Processing" color={C.teal}/>
              <div style={g4}>
                <ResidueCard label="EFB"         active={s0.efbEnabled}        onClick={()=>up("efbEnabled",!s0.efbEnabled)}               sublabel="Empty Fruit Bunches"/>
                <ResidueCard label="OPDC"        active={s0.opdcEnabled}       onClick={()=>up("opdcEnabled",!s0.opdcEnabled)}              sublabel="Decanter Cake"/>
            <ResidueCard label="POME SLUDGE"  active={s0.pomeSludgeEnabled}  onClick={()=>up("pomeSludgeEnabled",!s0.pomeSludgeEnabled)} sublabel="Mill Exit / Sludge Pit"/>
            <ResidueCard label="PKE"          active={s0.pkeEnabled}         onClick={()=>up("pkeEnabled",!s0.pkeEnabled)}           sublabel="Purchased Protein Booster"/>
          </div>
          <Divider/>
          <div style={{...g2, marginBottom:12}}>
            <BluField label="EFB Blend Fraction (DM basis)" unit="%" value={s0.efbPct} onChange={v=>up("efbPct",+v)}/>
            <BluField label="OPDC Blend Fraction (DM basis)" unit="%" value={s0.opdcPct} onChange={v=>up("opdcPct",+v)}/>
          </div>
          {!blendOK
            ? <Halt msg={"Blend total = "+blendTotal+"% — must equal 100%"}/>
            : <Warn type="ok" msg={"Blend valid — EFB "+s0.efbPct+"% + OPDC "+s0.opdcPct+"% = 100%"}/>}
          <Divider/>
          <div style={g3}>
            <CalcField label="Blended Moisture" unit="%" value={blendMC}/>
            <CalcField label="Blend DM Content" unit="%" value={(100-blendMC).toFixed(1)}/>
            <CalcField label="Blend C:N (DM-weighted)" unit="ratio" value={blendCN||"—"}
              note={blendCN?blendCN<=25?"✓ Optimal for BSF (15–25)":blendCN<=35?"⚠ Marginal — add POME/PKE":"✕ High — BSF yield penalty":undefined}/>
          </div>
          <div style={{...g2, marginTop:12}}>
            <CalcField label="Monthly Substrate → S3" unit="t FW/month" value={s1_blendWet.toLocaleString()}/>
            <CalcField label="Monthly Substrate DM" unit="t DM/month" value={s1_blendDM.toLocaleString()}/>
          </div>
        </Card>

            {/* ── E: SOIL TYPE & AG MANAGEMENT — below C in right column ── */}
            <Card>
              <SectionHdr icon="🌍" title="E — Soil Type &amp; Agronomy" color={C.teal}/>

              {/* Soil type */}
              <div style={LABEL}>Indonesian Soil Classification</div>
              <div style={{display:"flex", gap:8, flexWrap:"wrap", marginTop:8, marginBottom:4}}>
                {SOILS.map(so=>(
                  <div key={so.id} onClick={()=>up("soil",so.id)}
                    style={{background:s0.soil===so.id?C.teal+"20":C.navyDk,
                      border:`1px solid ${s0.soil===so.id?C.teal+"77":"rgba(255,255,255,0.07)"}`,
                      borderBottom:s0.soil===so.id?`2px solid ${C.teal}`:"2px solid transparent",
                      borderRadius:8, padding:"9px 13px", cursor:"pointer",
                      flex:"1 1 auto", minWidth:120, transition:"all 0.15s"}}>
                    <div style={{color:s0.soil===so.id?C.teal:C.white, fontWeight:700, fontSize:12}}>{so.name}</div>
                    <div style={{color:C.grey, fontSize:10, marginTop:3}}>{so.pct} · pH {so.ph} · CEC {so.cec}</div>
                    <div style={{color:C.grey, fontSize:9, marginTop:2}}>{so.desc}</div>
                  </div>
                ))}
              </div>
              {s0.soil==="histosol" && <Warn msg="Histosol (peat): ~80% less N and ~70% less P needed. CFI fertiliser highly competitive."/>}
              {s0.soil==="inceptisol" && <Warn type="ok" msg="Inceptisol: Best baseline fertility. Standard NPK application rates apply."/>}

              <Divider/>

              {/* AG Management tier */}
              <div style={LABEL}>Agronomy Management Tier</div>
              <div style={{display:"flex", flexDirection:"column", gap:6, marginTop:8}}>
                {AG_TIERS.map(ag=>(
                  <div key={ag.id} onClick={()=>up("ag",ag.id)}
                    style={{background:s0.ag===ag.id?C.amber+"18":C.navyDk,
                      border:`1px solid ${s0.ag===ag.id?C.amber+"66":"rgba(255,255,255,0.07)"}`,
                      borderLeft:s0.ag===ag.id?`3px solid ${C.amber}`:"3px solid transparent",
                      borderRadius:8, padding:"10px 14px", cursor:"pointer",
                      display:"flex", alignItems:"center", justifyContent:"space-between",
                      transition:"all 0.15s"}}>
                    <span style={{color:s0.ag===ag.id?C.amberLt:C.white, fontSize:12, fontWeight:600}}>{ag.name}</span>
                    <Badge text={Math.round(ag.uplift*100)+"% uplift"} color={s0.ag===ag.id?C.amber:C.grey}/>
                  </div>
                ))}
              </div>
            </Card>

          </div>{/* end RIGHT COLUMN */}

        </div>{/* end TWO-COLUMN ROW */}

        {/* ── FULL-WIDTH SECTIONS BELOW ── */}
        <div style={{display:"flex", flexDirection:"column", gap:16, marginTop:16}}>

        {/* ── F: POME SLUDGE ── */}
        <Card>
          <SectionHdr icon="💧" title="F — POME Sludge (Third Waste Stream)" color={C.blue}/>
          <div style={{display:"flex", alignItems:"center", gap:16, marginBottom:16}}>
            <label style={{display:"flex", alignItems:"center", gap:10, cursor:"pointer"}}>
              <input type="checkbox" checked={s0.pomeSludgeEnabled}
                onChange={e=>up("pomeSludgeEnabled",e.target.checked)}
                style={{accentColor:C.blue, width:16, height:16, cursor:"pointer"}}/>
              <span style={{color:s0.pomeSludgeEnabled?C.blue:C.grey, fontWeight:700, fontSize:13}}>
                Include POME Sludge — Mill Exit / Sludge Pit (Centrifuge Discharge)
              </span>
            </label>
            <Badge text="Zero Cost — Mill Waste" color={C.green}/>
          </div>
          <div style={g4}>
            <KPI label="Natural Yield" value={pomeSludgeNatTPD} unit="t/day fresh (at mill exit)" color={C.blue}/>
            <KPI label="DM Content" value={pomeSludgeDMpd+" t/day"} unit={"at "+pomeSludgeActMC+"% MC"} color={C.teal}/>
            <KPI label="Daily Nitrogen" value={pomeN+" kg"} unit="N/day (1.76% DM)" color={C.green}/>
            <KPI label="Fe Status" value={feStatus}
              unit={isNaN(pomeFe)?"ICP-OES pending":pomeFe+" mg/kg DM"}
              color={FE_COLOR[feStatus]||C.grey}/>
          </div>
          <Divider/>
          <div style={{display:"grid", gridTemplateColumns:"1.5fr 1fr 1fr 1.5fr", gap:12}}>
            <div>
              <div style={LABEL}>Moisture State</div>
              <PillToggle
                options={[{v:false,l:"Fresh (mill exit)",sub:"82% MC"},{v:true,l:"Post-dewatered",sub:"65% MC"}]}
                value={s0.pomeSludgeDewatered}
                onChange={v=>up("pomeSludgeDewatered",v)}
                color={C.blue}/>
            </div>
            <AmbField label="ICP-OES Fe Result" unit="mg/kg DM"
              value={s0.pomeSludgeFeResult} onChange={v=>up("pomeSludgeFeResult",v)}
              note="Run CFI-LAB-POME-001 Package A — drives max inclusion rate"/>
            <div>
              <div style={LABEL}>Inclusion Rate <span style={{color:C.blue+"aa", fontSize:9, fontWeight:600, letterSpacing:"0.04em"}}>[% WW of blend]</span></div>
              <input
                style={{background:"#142030",
                  border:`1px solid ${inclPctCapped>=pomeSludgeMaxPct?C.amber+"66":C.teal+"55"}`,
                  borderRadius:6,
                  color:inclPctCapped>=pomeSludgeMaxPct?C.amberLt:C.white,
                  padding:"8px 12px", fontSize:13, width:"100%", outline:"none", boxSizing:"border-box"}}
                value={s0.pomeSludgeInclPct}
                onChange={e=>up("pomeSludgeInclPct",+e.target.value)}/>
              <div style={{color:inclPctCapped>=pomeSludgeMaxPct?C.amber:C.green, fontSize:10, marginTop:3}}>
                Max allowed: {pomeSludgeMaxPct}% WW (Fe: {feStatus})
              </div>
            </div>
            <CalcField label="POME Sludge Added to Blend" unit="t/day"
              value={pomeSludgeInclTPD+" t/day  ("+pomeSludgeInclDM+" t DM)"}/>
          </div>
          {pomeFe>=8000 && <Halt msg="Fe >8,000 mg/kg DM — CaCO₃ amendment required before inclusion. Max 5% WW. Re-run ICP-OES after amendment."/>}
          {pomeFe>=5000&&pomeFe<8000 && <Warn msg="Fe 5,000–8,000 mg/kg DM — HIGH. Limit to 5–10% WW inclusion. Monitor Fe uptake in BSF larvae."/>}
          {pomeFe>=3000&&pomeFe<5000 && <Warn type="warn" msg="Fe 3,000–5,000 mg/kg DM — MODERATE. Max 10–15% WW inclusion. Acceptable for BSF with monitoring."/>}
          {(isNaN(pomeFe)||pomeFe===0)&&s0.pomeSludgeEnabled &&
            <Warn type="warn" msg="No ICP-OES Fe result entered. Using default 15% WW cap. Run CFI-LAB-POME-001 Package A before scale-up."/>}
          {pomeFe>0&&pomeFe<3000 &&
            <Warn type="ok" msg={"Fe LOW ("+pomeFe+" mg/kg DM) — max 20% WW inclusion permitted. POME Sludge cleared for standard use."}/>}
          <Divider/>
          <div style={{background:C.navyDk, borderRadius:6, padding:"10px 14px",
            display:"flex", flexWrap:"wrap", gap:"12px 28px"}}>
            {[
              {label:"Capture point:", text:"Mill Exit / Sludge Pit / Centrifuge Discharge — NOT pond (higher N, lower Fe)", color:C.blue},
              {label:"pH 4–5.5", text:"· neutralised by PKSA S2 at no cost", color:C.teal},
              {label:"CPO 5–20% DM", text:"— BSF energy boost", color:C.amber},
            ].map((item,i)=>(
              <span key={i} style={{color:C.grey, fontSize:11}}>
                <span style={{color:item.color, fontWeight:700}}>{item.label} </span>
                {item.text}
              </span>
            ))}
          </div>
        </Card>

        {/* ── G: PKE ── */}
        <Card>
          <SectionHdr icon="🌾" title="G — PKE Palm Kernel Expeller (Protein Booster — Optional)" color={C.amber}/>
          <div style={{display:"flex", alignItems:"center", gap:16, marginBottom:s0.pkeEnabled?16:0}}>
            <label style={{display:"flex", alignItems:"center", gap:10, cursor:"pointer"}}>
              <input type="checkbox" checked={s0.pkeEnabled}
                onChange={e=>up("pkeEnabled",e.target.checked)}
                style={{accentColor:C.amber, width:16, height:16, cursor:"pointer"}}/>
              <span style={{color:s0.pkeEnabled?C.amber:C.grey, fontWeight:700, fontSize:13}}>
                Include PKE — Purchased Protein Booster (raises substrate CP for BSF)
              </span>
            </label>
            <Badge text="$160 / t wet" color={C.amber}/>
            <Badge text="NOT MILL WASTE — PURCHASED INPUT" color={C.red}/>
          </div>
          {s0.pkeEnabled && (
            <div>
              <div style={{display:"grid", gridTemplateColumns:"1.5fr 1fr 1fr 1fr", gap:12, marginBottom:12}}>
                <BluField label="PKE Addition Rate" unit="t/day wet"
                  value={s0.pkeTPD} onChange={v=>up("pkeTPD",+v)}
                  note="Start at 5 t/day. Adjust by C:N target."/>
                <CalcField label="PKE Dry Matter" unit="t DM/day" value={pkeDM}/>
                <CalcField label="N Contribution (PKE)" unit="kg N/day" value={pkeN}/>
                <CalcField label="Daily PKE Cost" unit="USD/day" value={"$"+pkeCost.toLocaleString()}/>
              </div>
              <div style={{background:C.navyDk, borderRadius:6, padding:"10px 14px",
                display:"flex", flexWrap:"wrap", gap:"12px 28px"}}>
                <span style={{color:C.grey, fontSize:11}}>
                  <span style={{color:C.amber, fontWeight:700}}>PKE profile: </span>
                  CP 18% DM · N 2.9% DM · C:N 15 · Lignin 12.4% ADL · MC 12% · Fat 9% DM
                </span>
                <span style={{color:C.grey, fontSize:11}}>
                  <span style={{color:C.red, fontWeight:700}}>Monthly cost: </span>
                  {"$"+(pkeCost*s0.daysMonth).toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </Card>

        {/* ── H: COMBINED SUMMARY — conditional ── */}
        {(s0.pomeSludgeEnabled||s0.pkeEnabled) && (
          <Card style={{border:`1px solid ${C.green}33`}}>
            <SectionHdr icon="📊" title="H — Combined Multi-Stream Daily NPK Summary" color={C.green}/>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%", borderCollapse:"collapse", fontSize:11}}>
                <thead>
                  <tr style={{background:C.navyDk}}>
                    {["STREAM","t/day FW","t/day DM","N kg/day","P kg/day","K kg/day","C:N"].map((h,i)=>(
                      <td key={i} style={{padding:"9px 12px", color:C.grey, fontWeight:700,
                        letterSpacing:"0.07em", fontSize:10, textTransform:"uppercase",
                        borderBottom:`1px solid ${C.navyLt}`}}>{h}</td>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    {name:"EFB",               fw:efbTPD.toFixed(1),   dm:efbDMpd.toFixed(1),        n:efbN,  p:efbP,  k:efbK,  cn:"60",  col:C.teal},
                    {name:"OPDC (Decanter Cake)",fw:(opdcDMreq/(1-(s0.opdcMC/100))).toFixed(1), dm:opdcDMreq.toFixed(1), n:opdcN, p:opdcP, k:opdcK, cn:"20", col:C.amber},
                    ...(s0.pomeSludgeEnabled?[{name:"POME Sludge", fw:pomeSludgeInclTPD.toFixed(1), dm:pomeSludgeInclDM.toFixed(2), n:pomeN, p:pomeP, k:pomeK, cn:"~15", col:C.blue}]:[]),
                    ...(s0.pkeEnabled?[{name:"PKE (Protein Booster)", fw:(+s0.pkeTPD).toFixed(1), dm:pkeDM.toFixed(1), n:pkeN, p:"—", k:"—", cn:"15", col:C.purple}]:[]),
                  ].map((row,i)=>(
                    <tr key={i} style={{borderBottom:`1px solid ${C.navyLt}33`,
                      background:i%2===0?C.navyDk+"80":"transparent"}}>
                      <td style={{padding:"9px 12px", color:row.col, fontWeight:700}}>{row.name}</td>
                      <td style={{padding:"9px 12px", color:C.greyLt, fontFamily:"monospace"}}>{row.fw}</td>
                      <td style={{padding:"9px 12px", color:C.greyLt, fontFamily:"monospace"}}>{row.dm}</td>
                      <td style={{padding:"9px 12px", color:C.green, fontFamily:"monospace", fontWeight:700}}>{row.n}</td>
                      <td style={{padding:"9px 12px", color:C.teal, fontFamily:"monospace"}}>{row.p}</td>
                      <td style={{padding:"9px 12px", color:C.amber, fontFamily:"monospace"}}>{row.k}</td>
                      <td style={{padding:"9px 12px", color:C.greyLt, fontFamily:"monospace"}}>{row.cn}</td>
                    </tr>
                  ))}
                  <tr style={{background:C.green+"14", borderTop:`2px solid ${C.green}44`}}>
                    <td style={{padding:"10px 12px", color:C.green, fontWeight:900, fontSize:12}}>COMBINED TOTAL</td>
                    <td style={{padding:"10px 12px", color:C.green, fontFamily:"monospace", fontWeight:700}}>—</td>
                    <td style={{padding:"10px 12px", color:C.green, fontFamily:"monospace", fontWeight:700}}>
                      {(efbDMpd+opdcDMreq+pomeSludgeInclDM+pkeDM).toFixed(1)}
                    </td>
                    <td style={{padding:"10px 12px", color:C.green, fontFamily:"monospace", fontWeight:900}}>{totN}</td>
                    <td style={{padding:"10px 12px", color:C.teal, fontFamily:"monospace", fontWeight:700}}>{totP}</td>
                    <td style={{padding:"10px 12px", color:C.amber, fontFamily:"monospace", fontWeight:700}}>{totK}</td>
                    <td style={{padding:"10px 12px", color:C.white, fontFamily:"monospace", fontWeight:700}}>{blendCN||"—"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            {blendCN && (
              <div style={{marginTop:10}}>
                {blendCN<15  && <Warn msg={"C:N "+blendCN+" — BELOW optimum (15–25). Reduce PKE or POME Sludge, or increase EFB fraction."}/>}
                {blendCN>=15&&blendCN<=25 && <Warn type="ok" msg={"C:N "+blendCN+" — OPTIMAL range (15–25). Blend composition confirmed for BSF."}/>}
                {blendCN>25&&blendCN<=35  && <Warn type="warn" msg={"C:N "+blendCN+" — MARGINAL (target 15–25). Add more POME Sludge or PKE to lower."}/>}
                {blendCN>35 && <Warn msg={"C:N "+blendCN+" — HIGH. EFB dominance raising C:N. POME Sludge and PKE additions strongly recommended."}/>}
              </div>
            )}
          </Card>
        )}

        </div>{/* end full-width flex column */}
      </div>{/* end outer padding wrapper */}
    </div>
  );
}



// ======================================================================
// FILE: src/components/CFI_Soil_Science_Module.jsx
// SIZE: 46135 chars / 1009 lines
// ======================================================================

import { useState, useEffect, useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, BarChart, Bar, Cell, ReferenceLine
} from "recharts";

// ═══════════════════════════════════════════════════════════════════════════════
// CFI SOIL SCIENCE MODULE
// SOM · CEC · WHC · Microbiome Recovery · N-P-K Balance
// Sources: cfi_soil_profiles · cfi_soil_coefficients · cfi_product_soil_response
// All coefficients are DATA GAP LDE placeholders until Supabase field trials.
// S3 Wave 2 N-fixer term: LOCKED AT ZERO (guardrail). Do not override.
// ═══════════════════════════════════════════════════════════════════════════════

const SUPA_URL = "https://lcpbtnipkvrmuwllymfw.supabase.co";
const SUPA_KEY = "sb_publishable_xJ9N0RaYXbY07m8DvtG_zQ_-m8Zzm23";

const C = {
  navy:"#060e1e", navyMid:"#0a1628", navyLt:"#0f2040",
  teal:"#14b8a6", tealLt:"#5eead4",
  amber:"#f59e0b", amberLt:"#fcd34d",
  green:"#22c55e", greenLt:"#86efac",
  blue:"#3b82f6",  blueLt:"#93c5fd",
  red:"#ef4444",   redLt:"#fca5a5",
  purple:"#a855f7",
  orange:"#f97316",
  grey:"#94a3b8",  greyLt:"#cbd5e1",
  white:"#e8f0fe",
};

const SOIL_COLORS = {
  ultisol: C.amber, inceptisol: C.teal, oxisol: C.orange,
  spodosol: C.grey, andisol: C.blue, histosol: C.purple,
};

// ── Static product parameters (replace with Supabase product table when BF+ loaded) ──
const PRODUCTS = {
  cp_plus: {
    id:"cp_plus", name:"CFI Compost+", tag:"S3·W1",
    color:C.green,
    om_pct:0.60, humic_c_pct:0.08, n_pct:0.020, p_pct:0.004, k_pct:0.018,
    chitin_pct:0.000, has_amf:false, defaultRate:20,
    note:"Bulk OM, humus formation, CEC building, structure & WHC. Apply 15–30 t/ha/yr.",
  },
  bf: {
    id:"bf", name:"CFI Biofertiliser", tag:"S5A·BF",
    color:C.teal,
    om_pct:0.587, humic_c_pct:0.02, n_pct:0.043, p_pct:0.030, k_pct:0.027,
    chitin_pct:0.054, has_amf:false, defaultRate:2,
    note:"BSF frass. Concentrated NPK, microbiome activation, chitin 5.4%. Apply 1–3 t/ha/yr.",
  },
  bf_plus: {
    id:"bf_plus", name:"CFI Biofertiliser+", tag:"S5B·BF+",
    color:C.amber,
    om_pct:0.620, humic_c_pct:0.12, n_pct:0.048, p_pct:0.034, k_pct:0.028,
    chitin_pct:0.080, has_amf:true, defaultRate:2,
    note:"Frass + whole terminated BSF. Higher protein, chitin 8%, BSF lipids 6% + AMF/PGPR inoculum.",
  },
};

const ET_DAILY_MM = 4.0; // oil palm evapotranspiration mm/day

function supaGet(table) {
  return fetch(SUPA_URL + "/rest/v1/" + table + "?order=id.asc", {
    headers:{
      "apikey": SUPA_KEY,
      "Authorization": "Bearer " + SUPA_KEY,
      "Content-Type": "application/json"
    }
  }).then(function(r) {
    if (!r.ok) throw new Error("HTTP " + r.status + " on " + table);
    return r.json();
  });
}

// ── Shared UI ────────────────────────────────────────────────────────────────

function Badge({text, color, size}) {
  var fs = size === "xs" ? 9 : 10;
  return (
    <span style={{
      background: color + "22", border: "1px solid " + color + "55",
      borderRadius: 10, padding: "1px 7px", color: color,
      fontSize: fs, fontWeight: 700, display: "inline-block",
      fontFamily: "'Courier New',monospace",
    }}>{text}</span>
  );
}

function DataGap() {
  return <Badge text="DATA GAP" color={C.grey} size="xs" />;
}

function AmberWarn({text}) {
  return (
    <div style={{
      background: C.amber + "18", border: "1px solid " + C.amber + "55",
      borderRadius: 6, padding: "6px 10px", fontSize: 10,
      color: C.amberLt, display: "flex", gap: 6, alignItems: "flex-start",
      lineHeight: 1.5,
    }}>
      <span style={{fontSize:13, flexShrink:0}}>{"⚠"}</span>
      <span>{text}</span>
    </div>
  );
}

function Card({children, style}) {
  return (
    <div style={Object.assign({}, {
      background: C.navyMid, borderRadius: 8,
      padding: "13px 15px", border: "1px solid " + C.teal + "1a",
    }, style || {})}>
      {children}
    </div>
  );
}

function SecHdr({label, color, sub}) {
  return (
    <div style={{marginBottom: 10}}>
      <div style={{
        fontSize: 11, fontWeight: 800, letterSpacing: "0.08em",
        color: color, textTransform: "uppercase",
      }}>{label}</div>
      {sub && (
        <div style={{fontSize: 9, color: C.grey, marginTop: 2}}>{sub}</div>
      )}
    </div>
  );
}

function KV({k, v, vc}) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems:"center",
      padding: "3px 0", borderBottom: "1px solid " + C.navyLt, fontSize: 10,
    }}>
      <span style={{color: C.grey}}>{k}</span>
      <span style={{color: vc || C.white, fontWeight: 700}}>{v}</span>
    </div>
  );
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────

export default function CFISoilScienceModule() {

  var [profiles, setProfiles] = useState([]);
  var [coeffs,   setCoeffs]   = useState([]);
  var [psrData,  setPsrData]  = useState([]);
  var [loading,  setLoading]  = useState(true);
  var [dbError,  setDbError]  = useState(null);

  var [soilKey,   setSoilKey]  = useState("ultisol");
  var [prodId,    setProdId]   = useState("bf_plus");
  var [rateHa,    setRateHa]   = useState(2);
  var [mineralN,  setMineralN] = useState(100);
  var [tab,       setTab]      = useState("som");

  // ── Load 3 Supabase tables ──
  useEffect(function() {
    Promise.all([
      supaGet("cfi_soil_profiles"),
      supaGet("cfi_soil_coefficients"),
      supaGet("cfi_product_soil_response"),
    ]).then(function(results) {
      setProfiles(results[0]);
      setCoeffs(results[1]);
      setPsrData(results[2]);
      setLoading(false);
    }).catch(function(e) {
      setDbError(e.message);
      setLoading(false);
    });
  }, []);

  var profile = useMemo(function() {
    return profiles.find(function(p) { return p.soil_key === soilKey; });
  }, [profiles, soilKey]);

  var coeff = useMemo(function() {
    return coeffs.find(function(c) { return c.soil_key === soilKey; });
  }, [coeffs, soilKey]);

  var psr = useMemo(function() {
    return psrData.find(function(r) {
      return r.soil_key === soilKey && r.product_id === prodId;
    });
  }, [psrData, soilKey, prodId]);

  var product = PRODUCTS[prodId];

  // ── All calculations ──
  var calc = useMemo(function() {
    if (!profile || !coeff || !psr || !product) return null;

    // Parse Supabase numeric strings
    function f(v, def) { return parseFloat(v) || def; }

    var om_ret  = f(coeff["om_retention_1yr_fract_" + prodId],  0.60);
    var hum_frc = f(coeff["humus_formation_fract_"  + prodId],  0.30);
    var decay   = f(coeff.decay_factor_annual,                  0.88);
    var cec_r   = f(coeff.cec_response_per_som_pct,             0.90);
    var humic_f = f(coeff.humic_cec_factor_cmol_kg,             300);
    var whc_r   = f(coeff.whc_response_mm_per_som_pct,          2.30);
    var n_rf    = f(coeff.n_leach_combined_rf,                  0.48);
    var p_rf    = f(coeff.p_fix_combined_rf,                    0.43);
    var k_rf    = f(coeff.k_leach_combined_rf,                  0.72);

    // Soil mass t/ha (0–25 cm)
    var bd = (f(profile.bd_degraded_g_cm3_low, 1.30) + f(profile.bd_degraded_g_cm3_high, 1.50)) / 2;
    var soil_mass = bd * 2500;

    // SOM annual humus addition
    var om_applied  = rateHa * product.om_pct;
    var om_retained = om_applied * om_ret;
    var humus_t_ha  = om_retained * hum_frc;
    var delta_som   = (humus_t_ha / soil_mass) * 100;

    // 5-yr SOM trajectory: SOM_n = SOM_0 + Δ × Σ(D^i, i=0..n-1)
    // (baseline SOM preserved; only added-OM accumulation decays)
    var som_0 = f(profile.som_degraded_pct_high, 1.5);
    var somTraj = [{ year:0, SOM:+som_0.toFixed(2), label:"Yr 0" }];
    var cumulative = 0;
    for (var y = 1; y <= 5; y++) {
      cumulative = cumulative * decay + delta_som;
      somTraj.push({
        year: y,
        SOM: +(som_0 + cumulative).toFixed(2),
        label: "Yr " + y,
      });
    }
    var som_y1 = somTraj[1].SOM;
    var delta_som_y1 = som_y1 - som_0;

    // CEC Year 1
    var cec_base       = f(profile.cec_degraded_cmol_high, 6.0);
    var delta_cec_som  = delta_som_y1 * cec_r;
    var humic_cec_add  = (rateHa * product.humic_c_pct * humic_f) / soil_mass;
    var cec_y1         = cec_base + delta_cec_som + humic_cec_add;

    // WHC
    var whc_ok     = coeff.whc_formula_applies !== false && coeff.whc_formula_applies !== "false";
    var delta_whc  = whc_ok ? delta_som_y1 * whc_r : null;
    var drought_days = delta_whc !== null ? delta_whc / ET_DAILY_MM : null;

    // N balance
    var n_leach_base    = f(profile.n_leach_fract_baseline, 0.35);
    var n_leach_cfi     = n_leach_base * (1 - n_rf);
    var n_from_mineral  = mineralN * (1 - n_leach_cfi);
    var n_from_product  = rateHa * product.n_pct * 1000 * 0.70;
    var n_fix_wave2     = 0.0; // GUARDRAIL LOCKED
    var n_available     = n_from_mineral + n_from_product + n_fix_wave2;

    // P
    var p_fix_base = f(profile.p_fix_fraction_baseline, 0.70);
    var p_fix_cfi  = p_fix_base * (1 - p_rf);

    // K
    var k_leach_base = f(profile.k_leach_fract_baseline, 0.20);
    var k_leach_cfi  = k_leach_base * (1 - k_rf);

    // MBC
    var mbc_r    = f(psr.mbc_response_mg_kg_per_t_ha, 18);
    var syn_f    = f(psr.mbc_synergy_factor, 0.12);
    var mbc_base = f(psr.mrs_mbc_degraded, 180);
    var mbc_tgt  = f(psr.mrs_mbc_target,   800);
    var mbc_y1   = mbc_base + rateHa * mbc_r * (1 + syn_f);
    var mbc_score = Math.min(100, Math.max(0, (mbc_y1 - mbc_base) / (mbc_tgt - mbc_base) * 100));

    // F:B
    var fb_base  = f(psr.mrs_fb_degraded, 0.20);
    var fb_tgt   = f(psr.mrs_fb_target,   0.80);
    var fb_alpha = f(psr.fb_ratio_alpha_coeff, 0.12);
    var fb_beta  = f(psr.fb_ratio_beta_coeff,  0.08);
    var fb_amf   = f(psr.fb_ratio_amf_contribution, 0.00);
    var fb_y1    = fb_base + fb_alpha * delta_som_y1 + fb_beta * product.chitin_pct + fb_amf;
    var fb_score = Math.min(100, Math.max(0, (fb_y1 - fb_base) / (fb_tgt - fb_base) * 100));

    // AMF
    var amf_inoc  = product.has_amf ? f(psr.amf_inoculation_effect_pct, 15) : 0;
    var amf_hab   = f(psr.amf_habitat_response_coeff, 0.08) * delta_som_y1 * 10;
    var amf_base  = f(psr.mrs_amf_degraded, 10);
    var amf_tgt   = f(psr.mrs_amf_target,   60);
    var amf_y1    = amf_base + amf_inoc + amf_hab;
    var amf_score = Math.min(100, Math.max(0, (amf_y1 - amf_base) / (amf_tgt - amf_base) * 100));

    // Enzyme
    var dh_factor  = f(psr.dehydrogenase_response_factor, 1.35);
    var enz_score  = Math.min(100, Math.max(0, (dh_factor - 1.0) / 1.50 * 100));

    // MRS composite (0–100)
    var mrs = 0.30 * mbc_score + 0.25 * fb_score + 0.25 * amf_score + 0.20 * enz_score;

    return {
      om_ret, hum_frc, decay, cec_r, humic_f, whc_r, n_rf, p_rf, k_rf,
      bd, soil_mass,
      om_applied, om_retained, humus_t_ha, delta_som,
      somTraj, som_0, som_y1, delta_som_y1,
      cec_base, delta_cec_som, humic_cec_add, cec_y1,
      whc_ok, delta_whc, drought_days,
      n_leach_base, n_leach_cfi, n_from_mineral, n_from_product,
      n_fix_wave2, n_available,
      p_fix_base, p_fix_cfi,
      k_leach_base, k_leach_cfi,
      mbc_base, mbc_y1, mbc_score,
      fb_base, fb_y1, fb_score,
      amf_base, amf_y1, amf_score,
      dh_factor, enz_score,
      mrs,
      psr_confidence: psr.confidence_overall || "LDE-LOW",
    };
  }, [profile, coeff, psr, product, prodId, rateHa, mineralN]);

  var soilColor = SOIL_COLORS[soilKey] || C.teal;

  // ── Loading / Error ──
  if (loading) {
    return (
      <div style={{
        background: C.navy, minHeight: "100vh",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: C.teal, fontFamily: "'Courier New',monospace", fontSize: 13,
      }}>
        {"⏳ Loading soil science data from Supabase..."}
      </div>
    );
  }

  if (dbError) {
    return (
      <div style={{
        background: C.navy, minHeight: "100vh", padding: 24,
        display: "flex", alignItems: "center", justifyContent: "center",
        color: C.red, fontFamily: "'Courier New',monospace", fontSize: 11,
      }}>
        {"⚠ Supabase error: " + dbError}
      </div>
    );
  }

  var TABS = [
    { id:"som",        label:"SOM · CEC · WHC" },
    { id:"microbiome", label:"Microbiome Recovery" },
    { id:"nutrients",  label:"Nutrient Balance" },
  ];

  return (
    <div style={{
      background: C.navy, minHeight: "100vh",
      fontFamily: "'Courier New',monospace", fontSize: 11, color: C.white,
    }}>

      {/* ── HEADER ── */}
      <div style={{
        background: "linear-gradient(135deg," + C.navyMid + ",#040a14)",
        borderBottom: "2px solid " + soilColor + "66",
        padding: "12px 18px",
      }}>
        <div style={{fontSize:8, color:C.teal, letterSpacing:"0.25em", marginBottom:3}}>
          {"CIRCULAR FERTILISER INDUSTRIES · BOGOR, WEST JAVA · SOIL SCIENCE MODULE · SUPABASE LIVE"}
        </div>
        <div style={{fontSize:17, fontWeight:900, letterSpacing:"-0.01em"}}>
          {"CFI SOIL SCIENCE CALCULATOR"}
        </div>
        <div style={{fontSize:9, color:C.grey, marginTop:2}}>
          {"SOM Trajectories · CEC & WHC Response · Microbiome Recovery Score · N–P–K Balance · S3 Wave 2 Architecture"}
        </div>
      </div>

      <div style={{padding:"14px 16px 0", display:"flex", flexDirection:"column", gap:12}}>

        {/* ── SOIL SELECTOR ── */}
        <div style={{display:"flex", gap:6, flexWrap:"wrap", alignItems:"center"}}>
          {profiles.map(function(p) {
            var sc = SOIL_COLORS[p.soil_key] || C.teal;
            var active = p.soil_key === soilKey;
            return (
              <div key={p.soil_key}
                onClick={function() { setSoilKey(p.soil_key); }}
                style={{
                  padding:"5px 13px", borderRadius:6, cursor:"pointer",
                  background: active ? sc + "33" : C.navyLt,
                  border: "1px solid " + (active ? sc : C.navyLt),
                  color: active ? sc : C.grey,
                  fontSize:10, fontWeight:700, transition:"all 0.1s",
                }}>
                {p.soil_key.toUpperCase()}
                {p.is_peat && (
                  <span style={{marginLeft:4, color:C.amber, fontSize:8}}>{"(PEAT)"}</span>
                )}
              </div>
            );
          })}
          <div style={{marginLeft:"auto", display:"flex", gap:10, alignItems:"center"}}>
            <span style={{fontSize:9, color:C.green}}>{"🟢 Supabase live"}</span>
            <span style={{fontSize:9, color:C.grey}}>
              {profiles.length + " soils · " + coeffs.length + " coeff sets · " + psrData.length + " PSR rows"}
            </span>
          </div>
        </div>

        {/* ── SOIL PROFILE + PRODUCT INPUTS ── */}
        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12}}>

          {profile && (
            <Card>
              <SecHdr label={profile.soil_group_name} color={soilColor}
                sub={(profile.local_name || "") + " · " + (profile.coverage_pct_indonesia || "–") + "% Indonesian palm land"} />
              <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:5, marginBottom:8}}>
                {[
                  ["pH (degraded)", profile.ph_degraded_low + "–" + profile.ph_degraded_high],
                  ["SOM (degraded)", profile.som_degraded_pct_low + "–" + profile.som_degraded_pct_high + "%"],
                  ["CEC (degraded)", profile.cec_degraded_cmol_low + "–" + profile.cec_degraded_cmol_high + " cmol/kg"],
                  ["N leach baseline", (parseFloat(profile.n_leach_fract_baseline) * 100).toFixed(0) + "%"],
                  ["P fixation", (parseFloat(profile.p_fix_fraction_baseline) * 100).toFixed(0) + "%"],
                  ["K leach baseline", (parseFloat(profile.k_leach_fract_baseline) * 100).toFixed(0) + "%"],
                ].map(function(item) {
                  return (
                    <div key={item[0]} style={{background:C.navyLt, borderRadius:4, padding:"5px 8px"}}>
                      <div style={{color:C.grey, fontSize:8}}>{item[0]}</div>
                      <div style={{color:C.white, fontWeight:700, fontSize:11}}>{item[1]}</div>
                    </div>
                  );
                })}
              </div>
              {profile.is_peat && (
                <AmberWarn text={"PEAT SPECIAL CASE: N mechanism = immobilisation (not leaching). WHC formula inactive — water table governs. GHG baseline ~85 t CO₂e/ha/yr. Subsidence 2–3 cm/yr. Lime PROHIBITED. Cu deficiency mandatory."} />
              )}
              {profile.soil_key === "andisol" && (
                <div style={{
                  marginTop:8, background:C.blue+"15", border:"1px solid "+C.blue+"44",
                  borderRadius:5, padding:"5px 8px", fontSize:9, color:C.blueLt,
                }}>
                  {"Andisol v3.2: all 22 gaps closed. CaSiO₃ co-amendment RF=0.15–0.25. BD response loop active. Highest P fixation (90%) in series. NOT previously in React — now loaded."}
                </div>
              )}
              <div style={{marginTop:6, display:"flex", gap:5, flexWrap:"wrap"}}>
                <Badge text={profile.confidence_level || "LDE-LOW"} color={soilColor} size="xs" />
              </div>
            </Card>
          )}

          <Card>
            <SecHdr label="Product & Application Rate" color={C.teal} />
            <div style={{display:"flex", gap:5, marginBottom:10}}>
              {Object.values(PRODUCTS).map(function(p) {
                var active = prodId === p.id;
                return (
                  <div key={p.id}
                    onClick={function() { setProdId(p.id); setRateHa(p.defaultRate); }}
                    style={{
                      flex:1, padding:"7px 5px", borderRadius:6,
                      cursor:"pointer", textAlign:"center",
                      background: active ? p.color + "33" : C.navyLt,
                      border: "1px solid " + (active ? p.color : C.navyLt),
                      color: active ? p.color : C.grey,
                      transition:"all 0.1s",
                    }}>
                    <div style={{fontSize:9, fontWeight:700}}>{p.name}</div>
                    <div style={{fontSize:8, color:C.grey, marginTop:2}}>{p.tag}</div>
                  </div>
                );
              })}
            </div>

            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:8}}>
              <div>
                <div style={{color:C.grey, fontSize:9, marginBottom:3}}>{"Application rate (t/ha/yr wet)"}</div>
                <input type="number" value={rateHa} min={0.5} max={50} step={0.5}
                  onChange={function(e) { setRateHa(parseFloat(e.target.value) || 2); }}
                  style={{
                    background:C.navyLt, border:"1px solid "+C.teal+"44",
                    borderRadius:4, color:C.white, padding:"5px 8px",
                    fontSize:13, fontWeight:700, width:"100%", outline:"none",
                    boxSizing:"border-box",
                  }} />
              </div>
              <div>
                <div style={{color:C.grey, fontSize:9, marginBottom:3}}>{"Mineral N (kg N/ha/yr)"}</div>
                <input type="number" value={mineralN} min={0} max={300} step={10}
                  onChange={function(e) { setMineralN(parseFloat(e.target.value) || 100); }}
                  style={{
                    background:C.navyLt, border:"1px solid "+C.amber+"44",
                    borderRadius:4, color:C.amberLt, padding:"5px 8px",
                    fontSize:13, fontWeight:700, width:"100%", outline:"none",
                    boxSizing:"border-box",
                  }} />
              </div>
            </div>

            {product && (
              <div style={{
                background:C.navyLt, borderRadius:4, padding:"6px 9px",
                fontSize:9, color:C.grey, marginBottom:8, lineHeight:1.5,
              }}>
                {product.note}
                {product.has_amf && (
                  <span style={{color:C.amber, marginLeft:4}}>{"Contains AMF/PGPR inoculum."}</span>
                )}
              </div>
            )}

            <AmberWarn text={"S3 Wave 2 N-Fixer: n_fix_wave2 = 0.0 kg N/ha/yr — LOCKED per guardrails. Structural term enabled, numeric effect disabled. DATA GAP — pending Supabase soil-stratified field trials (all 6 soils)."} />
          </Card>
        </div>

        {/* ── TABS ── */}
        <div style={{display:"flex", gap:4, borderBottom:"1px solid "+C.navyLt}}>
          {TABS.map(function(t) {
            var active = tab === t.id;
            return (
              <div key={t.id}
                onClick={function() { setTab(t.id); }}
                style={{
                  padding:"7px 16px", cursor:"pointer",
                  borderRadius:"6px 6px 0 0",
                  background: active ? C.navyLt : "transparent",
                  borderBottom: "2px solid " + (active ? soilColor : "transparent"),
                  color: active ? soilColor : C.grey,
                  fontSize:10, fontWeight:700, letterSpacing:"0.06em",
                  transition:"all 0.1s",
                }}>
                {t.label.toUpperCase()}
              </div>
            );
          })}
        </div>

        {/* ── TAB PANELS ── */}
        {calc && tab === "som" && (
          <SOMPanel calc={calc} profile={profile} coeff={coeff} soilColor={soilColor} />
        )}
        {calc && tab === "microbiome" && (
          <MicrobiomePanel calc={calc} psr={psr} profile={profile} soilColor={soilColor} />
        )}
        {calc && tab === "nutrients" && (
          <NutrientsPanel calc={calc} profile={profile} coeff={coeff} product={product}
            mineralN={mineralN} rateHa={rateHa} soilColor={soilColor} />
        )}

        {/* ── FOOTER ── */}
        <div style={{
          padding:"8px 10px", background:C.navyLt, borderRadius:6,
          fontSize:8, color:C.grey, lineHeight:1.8, marginBottom:24,
        }}>
          <span style={{color:C.teal, fontWeight:700}}>{"DATA SOURCES — "}</span>
          {"Supabase: cfi_soil_profiles · cfi_soil_coefficients · cfi_product_soil_response. "}
          {"All response coefficients are DATA GAP LDE placeholders until Supabase field trial data loaded. "}
          {"No external claims may be made using placeholder values. "}
          {"S3 Wave 2 N-fixer = 0 for all soils (guardrail locked). "}
          {"F:B alpha/beta = LDE-LOW (no palm-specific PLFA data anywhere). "}
          {"Peat WHC formula inactive — water table model required. "}
          {"Generated under CFI governance prompts 0–9. Expert panel review required before external use."}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB: SOM / CEC / WHC
// ═══════════════════════════════════════════════════════════════════════════════

function SOMPanel({calc, profile, coeff, soilColor}) {
  var somTarget = parseFloat(profile.som_target_pct_low || 2.5);
  var somTarget2 = parseFloat(profile.som_target_pct_high || 4.0);
  var cec_tgt_low  = parseFloat(profile.cec_target_cmol_low  || 10);

  return (
    <div style={{display:"flex", flexDirection:"column", gap:12}}>

      {/* SOM 5-yr Trajectory */}
      <Card>
        <SecHdr label="5-Year SOM Trajectory" color={soilColor}
          sub={"Formula: SOM_n = SOM_0 + ΔSOM × Σ(D^i, i=0..n-1) · Decay_Factor=" + calc.decay.toFixed(2) + " · ΔSOM_annual=" + calc.delta_som.toFixed(4) + "% · Soil_mass=" + calc.soil_mass.toFixed(0) + " t/ha"} />
        <div style={{height:220}}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={calc.somTraj} margin={{top:8, right:16, left:-10, bottom:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.navyLt} />
              <XAxis dataKey="label" tick={{fill:C.grey, fontSize:10}} />
              <YAxis tick={{fill:C.grey, fontSize:10}} domain={["auto","auto"]} />
              <Tooltip
                contentStyle={{background:C.navyMid, border:"1px solid "+soilColor+"44", fontSize:10}}
                formatter={function(v) { return [v.toFixed(2) + "%", "SOM"]; }} />
              <ReferenceLine y={somTarget} stroke={C.green} strokeDasharray="5 3"
                label={{value:"Target min " + somTarget + "%", fill:C.green, fontSize:9, position:"insideTopRight"}} />
              <Line type="monotone" dataKey="SOM" stroke={soilColor} strokeWidth={2.5}
                dot={{fill:soilColor, r:4, strokeWidth:0}} name="SOM %" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div style={{display:"flex", gap:8, marginTop:8, flexWrap:"wrap", alignItems:"center"}}>
          {[
            ["Year 1", calc.somTraj[1].SOM + "%"],
            ["Year 3", calc.somTraj[3].SOM + "%"],
            ["Year 5", calc.somTraj[5].SOM + "%"],
            ["Target range", somTarget + "–" + somTarget2 + "%"],
            ["OM retention", calc.om_ret.toFixed(2)],
            ["Humus fract", calc.hum_frc.toFixed(2)],
          ].map(function(item) {
            return (
              <div key={item[0]} style={{
                background:C.navyLt, borderRadius:4, padding:"4px 10px",
              }}>
                <div style={{color:C.grey, fontSize:8}}>{item[0]}</div>
                <div style={{color:soilColor, fontWeight:700, fontSize:12}}>{item[1]}</div>
              </div>
            );
          })}
          <DataGap />
        </div>
      </Card>

      {/* Formula Breakdown + CEC + WHC */}
      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12}}>

        {/* SOM Formula Breakdown */}
        <Card>
          <SecHdr label="SOM Formula Breakdown" color={soilColor} />
          <KV k="OM applied" v={(calc.om_applied).toFixed(2) + " t/ha"} vc={C.white} />
          <KV k={"× OM_retention (" + calc.om_ret.toFixed(2) + ")"} v={"→ " + calc.om_retained.toFixed(2) + " t/ha"} vc={C.greyLt} />
          <KV k={"× Humus_fract (" + calc.hum_frc.toFixed(2) + ")"} v={"→ " + calc.humus_t_ha.toFixed(3) + " t/ha"} vc={C.greyLt} />
          <KV k={"÷ Soil_mass (BD=" + calc.bd.toFixed(2) + ")"} v={calc.soil_mass.toFixed(0) + " t/ha"} vc={C.grey} />
          <div style={{
            marginTop:6, background:soilColor+"18", border:"1px solid "+soilColor+"44",
            borderRadius:4, padding:"6px 8px", textAlign:"center",
          }}>
            <div style={{color:C.grey, fontSize:8}}>{"ΔSOM Year 1"}</div>
            <div style={{color:soilColor, fontWeight:900, fontSize:16}}>
              {"+" + calc.delta_som.toFixed(4) + "%"}
            </div>
          </div>
          <div style={{marginTop:8}}>
            <DataGap />
            <span style={{marginLeft:6, color:C.grey, fontSize:9}}>{"coefficients pending field trials"}</span>
          </div>
        </Card>

        {/* CEC */}
        <Card>
          <SecHdr label="CEC Response — Year 1" color={C.blue} />
          <KV k="CEC baseline" v={calc.cec_base.toFixed(1) + " cmol/kg"} vc={C.white} />
          <KV k={"ΔCEC from SOM (×" + calc.cec_r.toFixed(2) + ")"} v={"+" + calc.delta_cec_som.toFixed(3) + " cmol/kg"} vc={C.blueLt} />
          <KV k={"ΔCEC from humics (Hf=" + calc.humic_f.toFixed(0) + ")"} v={"+" + calc.humic_cec_add.toFixed(3) + " cmol/kg"} vc={C.blueLt} />
          <div style={{
            marginTop:6, background:C.blue+"18", border:"1px solid "+C.blue+"44",
            borderRadius:4, padding:"6px 8px", textAlign:"center",
          }}>
            <div style={{color:C.grey, fontSize:8}}>{"CEC Year 1"}</div>
            <div style={{color:C.blue, fontWeight:900, fontSize:16}}>
              {calc.cec_y1.toFixed(2) + " cmol/kg"}
            </div>
          </div>
          <div style={{marginTop:6, fontSize:9, color:C.grey, lineHeight:1.5}}>
            {"Target: " + cec_tgt_low + "+ cmol/kg"}
          </div>
          <div style={{marginTop:5}}>
            <Badge text={"CEC_R = " + calc.cec_r.toFixed(2) + " cmol/kg per %SOM"} color={C.blue} size="xs" />
          </div>
        </Card>

        {/* WHC */}
        <Card>
          <SecHdr label="WHC Response — Year 1" color={C.green} />
          {calc.whc_ok ? (
            <div>
              <KV k="WHC_Response" v={parseFloat(coeff.whc_response_mm_per_som_pct || 2.3).toFixed(2) + " mm per %SOM"} vc={C.white} />
              <KV k="ΔSOM Year 1" v={"+" + calc.delta_som_y1.toFixed(4) + "%"} vc={C.greyLt} />
              <div style={{
                marginTop:6, background:C.green+"18", border:"1px solid "+C.green+"44",
                borderRadius:4, padding:"6px 8px", textAlign:"center",
              }}>
                <div style={{color:C.grey, fontSize:8}}>{"ΔWHC"}</div>
                <div style={{color:C.green, fontWeight:900, fontSize:16}}>
                  {calc.delta_whc !== null ? "+" + calc.delta_whc.toFixed(3) + " mm" : "N/A"}
                </div>
              </div>
              <div style={{
                marginTop:6, background:C.navyLt, borderRadius:4, padding:"5px 8px",
              }}>
                <div style={{color:C.grey, fontSize:8}}>{"Drought buffer days (ET=" + ET_DAILY_MM + " mm/d)"}</div>
                <div style={{color:C.greenLt, fontWeight:700, fontSize:13}}>
                  {calc.drought_days !== null ? "+" + calc.drought_days.toFixed(2) + " days" : "N/A"}
                </div>
              </div>
            </div>
          ) : (
            <AmberWarn text={"WHC mm/SOM formula INACTIVE for Peat/Histosol. Soil is already 24.5% organic C. WHC governed by water table depth — use water table management model."} />
          )}
          <div style={{marginTop:6}}>
            <DataGap />
          </div>
        </Card>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB: MICROBIOME RECOVERY
// ═══════════════════════════════════════════════════════════════════════════════

function MicrobiomePanel({calc, psr, profile, soilColor}) {
  var mrsColor = calc.mrs >= 70 ? C.green : calc.mrs >= 40 ? C.amber : C.red;
  var mrsLabel = calc.mrs >= 70 ? "GOOD" : calc.mrs >= 40 ? "RECOVERING" : "DEGRADED";

  var subScores = [
    { name:"MBC",    score:+calc.mbc_score.toFixed(0),  fill:C.teal,   w:"30%",
      from:calc.mbc_base.toFixed(0)+" mg C/kg", to:calc.mbc_y1.toFixed(0)+" mg C/kg", unit:"microbial biomass C" },
    { name:"F:B",    score:+calc.fb_score.toFixed(0),   fill:C.green,  w:"25%",
      from:calc.fb_base.toFixed(2), to:calc.fb_y1.toFixed(2), unit:"fungal:bacterial ratio" },
    { name:"AMF",    score:+calc.amf_score.toFixed(0),  fill:C.blue,   w:"25%",
      from:calc.amf_base.toFixed(0)+"%", to:calc.amf_y1.toFixed(0)+"%", unit:"root colonisation" },
    { name:"Enzyme", score:+calc.enz_score.toFixed(0),  fill:C.purple, w:"20%",
      from:"baseline", to:calc.dh_factor.toFixed(2)+"×", unit:"dehydrogenase" },
  ];

  var barData = subScores.map(function(s) {
    return { name:s.name, score:s.score, fill:s.fill };
  });

  return (
    <div style={{display:"flex", flexDirection:"column", gap:12}}>

      {/* MRS Composite */}
      <div style={{display:"grid", gridTemplateColumns:"180px 1fr", gap:12}}>

        <Card style={{textAlign:"center"}}>
          <SecHdr label="MRS Composite" color={soilColor} sub="0–100 score" />
          <div style={{
            fontSize:58, fontWeight:900, color:mrsColor,
            lineHeight:1.0, marginBottom:4, letterSpacing:"-2px",
          }}>
            {calc.mrs.toFixed(0)}
          </div>
          <div style={{color:C.grey, fontSize:9}}>{"/ 100"}</div>
          <div style={{
            marginTop:8, padding:"4px 10px", borderRadius:6,
            background:mrsColor+"22", color:mrsColor, fontSize:10, fontWeight:700,
          }}>
            {mrsLabel}
          </div>
          <div style={{
            marginTop:10, fontSize:8, color:C.grey, lineHeight:1.6, textAlign:"left",
          }}>
            {"0.30 × MBC"}<br />{"0.25 × F:B"}<br />{"0.25 × AMF"}<br />{"0.20 × Enzyme"}
          </div>
          <div style={{marginTop:6}}>
            <Badge text={calc.psr_confidence} color={mrsColor} size="xs" />
          </div>
        </Card>

        <Card>
          <SecHdr label="Sub-Score Breakdown (Year 1)" color={soilColor}
            sub="DATA GAP: All scores are LDE placeholders. F:B LDE-LOW (no palm PLFA data). Field validation required." />
          <div style={{height:160}}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical"
                margin={{top:0, right:40, left:36, bottom:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.navyLt} horizontal={false} />
                <XAxis type="number" domain={[0,100]} tick={{fill:C.grey, fontSize:9}} />
                <YAxis type="category" dataKey="name" tick={{fill:C.grey, fontSize:10}} width={36} />
                <Tooltip
                  contentStyle={{background:C.navyMid, border:"1px solid "+soilColor+"44", fontSize:10}}
                  formatter={function(v) { return [v.toFixed(0) + " / 100", "Score"]; }} />
                <Bar dataKey="score" radius={[0,4,4,0]} barSize={26}>
                  {barData.map(function(d, i) {
                    return <Cell key={i} fill={d.fill} />;
                  })}
                </Bar>
                <ReferenceLine x={70} stroke={C.green} strokeDasharray="4 2"
                  label={{value:"Good", fill:C.green, fontSize:8, position:"top"}} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Sub-score detail row */}
      <div style={{display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8}}>
        {subScores.map(function(s) {
          return (
            <Card key={s.name}>
              <div style={{
                color:s.fill, fontWeight:800, fontSize:11, marginBottom:6,
                display:"flex", justifyContent:"space-between", alignItems:"center",
              }}>
                <span>{s.name}</span>
                <span style={{
                  background:s.fill+"22", color:s.fill, fontSize:10,
                  padding:"1px 7px", borderRadius:10, fontWeight:700,
                }}>
                  {s.score + "/100"}
                </span>
              </div>
              <div style={{fontSize:9, color:C.grey, marginBottom:6}}>{s.unit}</div>
              <KV k="Degraded" v={s.from} vc={C.grey} />
              <KV k="Year 1"   v={s.to}   vc={s.fill} />
              <div style={{marginTop:7}}>
                <Badge text={s.name === "F:B" ? "LDE-LOW · PLFA required" : "LDE-LOW"} color={s.fill} size="xs" />
              </div>
            </Card>
          );
        })}
      </div>

      {/* S3 Wave 2 structural term */}
      <Card>
        <SecHdr label="S3 Wave 2 N-Fixer — Structural Term (All Soils)" color={C.amber} />
        <AmberWarn text={
          "n_fix_wave2_" + profile.soil_key + " = 0.0 kg N/ha/yr — GUARDRAIL LOCKED. " +
          "Mechanistic potential: " +
          (psr ? (psr.n_fix_wave2_potential_kg_n_ha_yr_low || 20) : 20) + "–" +
          (psr ? (psr.n_fix_wave2_potential_kg_n_ha_yr_high || 60) : 60) + " kg N/ha/yr " +
          "(" + (psr ? (psr.n_fix_wave2_organisms || "Azotobacter, Azospirillum") : "Azotobacter, Azospirillum") + "). " +
          "Wave 2 slot active=" + (psr ? String(psr.wave2_slot_active) : "false") + ". " +
          "Confidence: LDE-LOW. Priority: HIGH (all soils)."
        } />
        <div style={{
          marginTop:8, fontSize:9, color:C.grey, lineHeight:1.7,
          background:C.navyLt, borderRadius:4, padding:"7px 10px",
        }}>
          {"Formula structure (addendum applied — all soils): N_bio_total = N_fix_Wave1 + N_fix_Wave2_[Soil]. "}
          {"N_available = N_mineral × (1−f_leach) × (1−f_volat) + N_organic_CFI × η_organic + N_bio_total. "}
          {"Required actions: (1) Design soil-stratified trials with ¹⁵N or mass-balance tracking. "}
          {"(2) Fit N_fix_Wave2_[Soil] per soil order. (3) Store in Supabase soil_coefficients. "}
          {"(4) Update calculators from 0 to fitted values with full expert-panel sign-off only."}
        </div>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB: NUTRIENT BALANCE
// ═══════════════════════════════════════════════════════════════════════════════

function NutrientsPanel({calc, profile, coeff, product, mineralN, rateHa, soilColor}) {
  var nBarData = [
    { name:"No CFI", lost:+(calc.n_leach_base * 100).toFixed(0), fill:C.red },
    { name:"With CFI", lost:+(calc.n_leach_cfi * 100).toFixed(0), fill:C.green },
  ];
  var pBarData = [
    { name:"No CFI", fixed:+(calc.p_fix_base * 100).toFixed(0), fill:C.red },
    { name:"With CFI", fixed:+(calc.p_fix_cfi * 100).toFixed(0), fill:C.green },
  ];

  var isSandy = profile.soil_key === "spodosol";
  var isAndisol = profile.soil_key === "andisol";
  var isPeat = profile.is_peat;

  return (
    <div style={{display:"flex", flexDirection:"column", gap:12}}>

      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12}}>

        {/* N Balance */}
        <Card>
          <SecHdr label="N Balance — Year 1" color={C.teal}
            sub={"N_avail = N_mineral×(1−f_leach) + N_CFI×0.70 + N_fix_Wave2(=0) · RF=" + calc.n_rf.toFixed(3)} />
          <div style={{height:140}}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={nBarData} margin={{top:5, right:10, left:-10, bottom:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.navyLt} />
                <XAxis dataKey="name" tick={{fill:C.grey, fontSize:9}} />
                <YAxis domain={[0,100]} tick={{fill:C.grey, fontSize:9}} />
                <Tooltip
                  contentStyle={{background:C.navyMid, border:"1px solid "+C.teal+"44", fontSize:10}}
                  formatter={function(v, n, props) { return [v + "% of N applied", "N leached"]; }} />
                <Bar dataKey="lost" radius={[4,4,0,0]} barSize={45}>
                  {nBarData.map(function(d, i) { return <Cell key={i} fill={d.fill} />; })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:5, marginTop:6, fontSize:10}}>
            {[
              ["Mineral N applied",  mineralN + " kg/ha",           C.white],
              ["N leach (baseline)", (calc.n_leach_base*100).toFixed(0)+"%",   C.red],
              ["N leach (with CFI)", (calc.n_leach_cfi*100).toFixed(0)+"%",    C.green],
              ["N from product",     calc.n_from_product.toFixed(0)+" kg/ha",  C.teal],
              ["N_fix_Wave2",        "0.0 kg/ha ⚠",                 C.amber],
              ["N available total",  calc.n_available.toFixed(0)+" kg/ha",     C.tealLt],
            ].map(function(item) {
              return (
                <div key={item[0]} style={{background:C.navyLt, borderRadius:3, padding:"4px 7px"}}>
                  <div style={{color:C.grey, fontSize:8}}>{item[0]}</div>
                  <div style={{color:item[2], fontWeight:700}}>{item[1]}</div>
                </div>
              );
            })}
          </div>
          {isPeat && (
            <div style={{marginTop:8}}>
              <AmberWarn text={"PEAT: N mechanism = immobilisation (not leaching). N reduction factors model immobilisation risk reduction, not leaching. Separate peat N formula required."} />
            </div>
          )}
        </Card>

        {/* P Fixation */}
        <Card>
          <SecHdr label="P Fixation Reduction" color={C.amber}
            sub={isSandy ? "Sandy soils: P LEACHES — fix RFs inactive. Banded application only." : "Eff_P = P_applied × (1 − P_fix × (1 − RF)) · RF=" + calc.p_rf.toFixed(3)} />
          <div style={{height:140}}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pBarData} margin={{top:5, right:10, left:-10, bottom:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.navyLt} />
                <XAxis dataKey="name" tick={{fill:C.grey, fontSize:9}} />
                <YAxis domain={[0,100]} tick={{fill:C.grey, fontSize:9}} />
                <Tooltip
                  contentStyle={{background:C.navyMid, border:"1px solid "+C.amber+"44", fontSize:10}}
                  formatter={function(v) { return [v + "% of P fixed", "P fixation"]; }} />
                <Bar dataKey="fixed" radius={[4,4,0,0]} barSize={45}>
                  {pBarData.map(function(d, i) { return <Cell key={i} fill={d.fill} />; })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:5, marginTop:6}}>
            {[
              ["P fix baseline",  (calc.p_fix_base*100).toFixed(0)+"%",   C.red],
              ["P fix with CFI",  (calc.p_fix_cfi*100).toFixed(0)+"%",    C.green],
              ["Combined P_RF",   parseFloat(coeff.p_fix_combined_rf||0.43).toFixed(3), C.amber],
              [isSandy ? "P leach fract" : isAndisol ? "CaSiO₃ RF@2.5t" : "AMF P_RF",
               isSandy ? (parseFloat(profile.p_leach_fract_baseline||0.20)*100).toFixed(0)+"%" :
               isAndisol ? "0.15 (confirmed)" :
               parseFloat(coeff.p_fix_rf_amf||0.85).toFixed(2),
               C.teal],
            ].map(function(item) {
              return (
                <div key={item[0]} style={{background:C.navyLt, borderRadius:3, padding:"4px 7px", fontSize:10}}>
                  <div style={{color:C.grey, fontSize:8}}>{item[0]}</div>
                  <div style={{color:item[2], fontWeight:700}}>{item[1]}</div>
                </div>
              );
            })}
          </div>
          {isAndisol && (
            <div style={{
              marginTop:8, background:C.blue+"12", border:"1px solid "+C.blue+"33",
              borderRadius:4, padding:"6px 8px", fontSize:9, color:C.blueLt, lineHeight:1.5,
            }}>
              {"Andisol ONLY: CaSiO₃ co-amendment is PRIMARY P intervention. RF=0.15 @2.5 t/ha; RF=0.25 @4.5 t/ha. Lembang study confirmed 12× reduction in P bonding energy. Combined CFI+silicate achieves 47–53% effective P from 10% untreated baseline."}
            </div>
          )}
          {isSandy && (
            <AmberWarn text={"Sandy soils: P LEACHES (not fixes). p_leach_fract_baseline=0.20. P_fix_RF set to 1.0 (inactive). Banded P application ONLY — broadcast loses >50% to leaching."} />
          )}
        </Card>
      </div>

      {/* K Leaching */}
      <Card>
        <SecHdr label="K Leaching Summary" color={C.blue}
          sub={"K_leach_baseline = " + (parseFloat(profile.k_leach_fract_baseline||0.20)*100).toFixed(0) + "% · Combined_RF = " + parseFloat(coeff.k_leach_combined_rf||0.72).toFixed(3) + " · K_leach_with_CFI = " + (calc.k_leach_cfi*100).toFixed(0) + "%"} />
        <div style={{display:"flex", gap:10, flexWrap:"wrap", alignItems:"center"}}>
          {[
            ["K leach baseline", (calc.k_leach_base*100).toFixed(0)+"%",                        C.red],
            ["K leach with CFI", (calc.k_leach_cfi*100).toFixed(0)+"%",                         C.green],
            ["K improvement",    ((calc.k_leach_base - calc.k_leach_cfi)*100).toFixed(0)+"pp",   C.teal],
            ["RF_CP+",           parseFloat(coeff.k_leach_rf_cp||0.85).toFixed(2),              C.greyLt],
            ["RF_BF+",           parseFloat(coeff.k_leach_rf_bfplus||0.80).toFixed(2),          C.amber],
          ].map(function(item) {
            return (
              <div key={item[0]} style={{background:C.navyLt, borderRadius:4, padding:"6px 12px"}}>
                <div style={{color:C.grey, fontSize:8}}>{item[0]}</div>
                <div style={{color:item[2], fontWeight:700, fontSize:13}}>{item[1]}</div>
              </div>
            );
          })}
          <DataGap />
        </div>
        {isPeat && (
          <div style={{marginTop:8}}>
            <AmberWarn text={"PEAT: K demand is highest of all soils. K leaches rapidly on drained peat. K supply and Cu deficiency correction are the PRIMARY CFI value propositions on Histosols — NOT P fixation or N leaching."} />
          </div>
        )}
      </Card>

      {/* Export data block */}
      <Card>
        <SecHdr label="Export Interface" color={C.grey}
          sub="Values ready for AG Management Calculator and Fertiliser Calculator" />
        <div style={{display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8, fontSize:9}}>
          {[
            ["N available (yr1)", calc.n_available.toFixed(0)+" kg/ha",    C.teal],
            ["P fix fraction",    (calc.p_fix_cfi*100).toFixed(0)+"%",     C.amber],
            ["K leach fraction",  (calc.k_leach_cfi*100).toFixed(0)+"%",   C.blue],
            ["SOM year 1",        calc.somTraj[1].SOM+"%",                 soilColor],
            ["CEC year 1",        calc.cec_y1.toFixed(2)+" cmol/kg",       C.blue],
            ["WHC delta",         calc.whc_ok && calc.delta_whc !== null ? "+" + calc.delta_whc.toFixed(3)+" mm" : "N/A", C.green],
            ["MRS score",         calc.mrs.toFixed(0)+" /100",             calc.mrs>=70?C.green:calc.mrs>=40?C.amber:C.red],
            ["Wave2 N-fix",       "0.0 kg/ha ⚠",                          C.amber],
          ].map(function(item) {
            return (
              <div key={item[0]} style={{background:C.navyLt, borderRadius:4, padding:"6px 8px"}}>
                <div style={{color:C.grey, fontSize:8}}>{item[0]}</div>
                <div style={{color:item[2], fontWeight:700, fontSize:11}}>{item[1]}</div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}



// ======================================================================
// FILE: src/hooks/use-mobile.tsx
// SIZE: 576 chars / 20 lines
// ======================================================================

import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}



// ======================================================================
// FILE: src/hooks/use-toast.ts
// SIZE: 3935 chars / 187 lines
// ======================================================================

import * as React from "react";

import type { ToastActionElement, ToastProps } from "@/components/ui/toast";

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;

type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

type ActionType = typeof actionTypes;

type Action =
  | {
      type: ActionType["ADD_TOAST"];
      toast: ToasterToast;
    }
  | {
      type: ActionType["UPDATE_TOAST"];
      toast: Partial<ToasterToast>;
    }
  | {
      type: ActionType["DISMISS_TOAST"];
      toastId?: ToasterToast["id"];
    }
  | {
      type: ActionType["REMOVE_TOAST"];
      toastId?: ToasterToast["id"];
    };

interface State {
  toasts: ToasterToast[];
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) => (t.id === action.toast.id ? { ...t, ...action.toast } : t)),
      };

    case "DISMISS_TOAST": {
      const { toastId } = action;

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id);
        });
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t,
        ),
      };
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
  }
};

const listeners: Array<(state: State) => void> = [];

let memoryState: State = { toasts: [] };

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

type Toast = Omit<ToasterToast, "id">;

function toast({ ...props }: Toast) {
  const id = genId();

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    });
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      },
    },
  });

  return {
    id: id,
    dismiss,
    update,
  };
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  };
}

export { useToast, toast };


