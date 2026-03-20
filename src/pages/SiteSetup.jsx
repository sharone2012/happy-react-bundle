import { useState, useMemo, useCallback } from 'react';
import SectionAB from "../components/CFI_S0_SectionAB";

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
  // ── SectionAB state
  const [siteId, setSiteId] = useState(null);
  const handleSiteData = useCallback((data) => {
    // Receive confirmed site data from SectionAB
    if (data.monthlyFFB) {
      // Update mill-derived values when SectionAB confirms
      setMill(m => ({ ...m, ffb: data.ffb_capacity_tph || m.ffb, util: data.utilisation_pct || m.util, hrs: data.operating_hrs_day || m.hrs, days: data.operating_days_month || m.days }));
      setBConfirmed(true);
    }
  }, []);

  // ── Section A state (kept for other sections that reference site)
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
  const card = { background:C.navyCard, border:'1.5px solid rgba(0,201,177,0.13)', borderRadius:11, overflow:'hidden', minWidth:0 };
  const secTitle = { padding:'11px 16px 10px', fontFamily:Fnt.syne, fontWeight:700, fontSize:15, color:C.teal, borderBottom:'1px solid rgba(64,215,197,0.12)', display:'flex', alignItems:'center', justifyContent:'space-between', whiteSpace:'nowrap' };
  const secSub = { fontSize:13, color:C.greyLt, padding:'5px 16px 7px' };
  const cbody = { padding:'11px 13px', display:'flex', flexDirection:'column', gap:6 };
  const grid2 = { display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 };
  const grid3 = { display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12 };
  const row4 = { display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:14, alignItems:'stretch' };
  const mixCell = { background:C.navyDeep, border:'1px solid '+C.bdrCalc, borderRadius:6, padding:'7px 9px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:6, minHeight:36, overflow:'hidden' };
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
  const fInput = { background:'#000', border:'1px solid rgba(168,189,208,0.2)', borderRadius:7, padding:'10px 13px', fontSize:14, fontWeight:700, fontFamily:Fnt.dm, color:C.white, width:'100%', outline:'none', minHeight:42, boxSizing:'border-box' };
  const confirmBtn = { background:C.green, color:'#000', fontFamily:Fnt.brand, fontWeight:700, fontSize:15, letterSpacing:'0.04em', border:'none', borderRadius:8, padding:'0 28px', height:51, minWidth:260, display:'block', margin:'0 auto', cursor:'pointer' };
  const slItem = { background:C.navyDeep, border:'1.5px solid '+C.bdrCalc, borderRadius:8, padding:'10px 26px 10px 13px', minHeight:52, marginBottom:6 };
  const toggleCard = (active) => ({ background:active?C.tealDim:C.navyDeep, border:'1.5px solid '+(active?C.tealBdr:C.bdrCalc), borderRadius:8, padding:'10px 13px', cursor:'pointer', transition:'all 0.12s', minHeight:52 });

  // ── RENDER ─────────────────────────────────────────────
  return (
    <div style={{ background:C.navy, minHeight:'100vh', color:C.white, fontFamily:Fnt.dm }}>

      {/* ── TOP NAV ── */}
      <div style={{ background:C.navyMid, borderBottom:'1px solid rgba(64,215,197,0.12)', padding:'10px 22px', minHeight:90, display:'flex', alignItems:'center', justifyContent:'space-between' }}>

        <div style={{ display:'flex', alignItems:'center', gap:16 }}>

          <div style={{ display:'flex', alignItems:'center', gap:6 }}>

            <div style={{ display:'flex', alignItems:'baseline', gap:4 }}>
              <span style={{ fontFamily:Fnt.brand, fontSize:22, fontWeight:700, color:C.teal, letterSpacing:'0.04em' }}>CFI</span>
              <span style={{ fontSize:10, color:C.grey }}>·</span>
              <span style={{ fontFamily:Fnt.syne, fontSize:10, fontWeight:700, color:C.grey, letterSpacing:'0.1em' }}>DEEP TECH</span>
            </div>

            <div style={{ fontSize:10, color:'rgba(168,189,208,0.5)', maxWidth:320, lineHeight:1.3, marginLeft:12 }}>
              Soil Microbiome Engineering & Biofertiliser Production for Closed‑Loop Nutrient Recycling
            </div>

          </div>

        </div>

        <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:6 }}>
          <div style={{ display:'flex', gap:4 }}>
            {['S0','S1','S2','S3','S4','S5A','S5B','S6','CAPEX','Σ'].map((s,i)=>(
              <div key={s} style={{ padding:'5px 10px', fontSize:11, fontWeight:700, fontFamily:Fnt.mono, color:i===0?C.teal:C.grey, background:i===0?C.tealDim:'transparent', borderRadius:6, cursor:'pointer' }}>{s}</div>
            ))}
          </div>
          <div style={{ display:'flex', gap:12, alignItems:'center' }}>
            <span style={{ fontSize:10, fontFamily:Fnt.mono, color:C.green, fontWeight:700 }}>✓ Valid</span>
            <span style={{ fontSize:10, fontFamily:Fnt.mono, color:C.green, fontWeight:700 }}>✓ Blend Valid</span>
            <span style={{ fontSize:10, fontFamily:Fnt.mono, color:C.teal, fontWeight:700 }}>Soil: {soilData.name}</span>
          </div>
        </div>

      </div>

      {/* ── FULL-NAME TAB BAR ── */}
      <div style={{ display:'flex', gap:0, background:C.navyMid, borderBottom:'1px solid rgba(64,215,197,0.08)', padding:'0 22px' }}>
        {['Site Setup','Pre-Processing','Pre-Treatment','Biologicals','BSF','Biofertiliser / Other','Emissions','Financials','Summary','Lab Analysis','Soil Science'].map((t,i)=>(
          <div key={t} style={{ padding:'7px 12px', fontSize:11, fontWeight:i===0?700:500, color:i===0?C.teal:C.grey, borderBottom:i===0?'2px solid '+C.teal:'2px solid transparent', cursor:'pointer', whiteSpace:'nowrap' }}>{t}</div>
        ))}
      </div>

      {/* ── SUBTAB BAR ── */}
      <div style={{ padding:'8px 22px', background:C.navyMid, borderBottom:'1px solid rgba(64,215,197,0.06)', display:'flex', alignItems:'center', gap:10 }}>
        <span style={{ fontFamily:Fnt.mono, fontSize:12, fontWeight:800, color:C.teal }}>S0</span>
        <span style={{ fontSize:11, color:C.grey }}>Site identity · Mill capacity · Residue streams · Soil profile</span>
      </div>

      {/* ── PAGE CONTENT ── */}
      <div style={{ padding:'16px 22px 80px', minWidth:1400 }}>

        {/* ════ ROW 1: A | B | C | G ════ */}
        <div style={row4}>

          {/* ── A: SITE DETAILS ── */}
          <div style={card}>
            <div style={secTitle}>A — Enter Your Details</div>
            <div style={secSub}>Mill identity · Location · GPS coordinates</div>
            <div style={cbody}>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                <input placeholder="Company name" value={site.company} onChange={e=>upSite('company',e.target.value)} style={fInput} />
                <div style={grid2}>
                  <input placeholder="Estate / Plantation" value={site.estate} onChange={e=>upSite('estate',e.target.value)} style={fInput} />
                  <input placeholder="Mill name #" value={site.millName} onChange={e=>upSite('millName',e.target.value)} style={fInput} />
                </div>
                <div style={grid2}>
                  <input placeholder="Province" value={site.province} onChange={e=>upSite('province',e.target.value)} style={fInput} />
                  <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                    <div>
                      <div style={{ fontSize:9, color:C.grey, marginBottom:3, letterSpacing:'0.06em' }}>GPS LATITUDE</div>
                      <input placeholder="optional" value={site.gpsLat} onChange={e=>upSite('gpsLat',e.target.value)} style={{...fInput, fontSize:12}} />
                    </div>
                    <div>
                      <div style={{ fontSize:9, color:C.grey, marginBottom:3, letterSpacing:'0.06em' }}>GPS LONGITUDE</div>
                      <input placeholder="optional" value={site.gpsLon} onChange={e=>upSite('gpsLon',e.target.value)} style={{...fInput, fontSize:12}} />
                    </div>
                  </div>
                </div>
                <input placeholder="District / Kabupaten" value={site.district} onChange={e=>upSite('district',e.target.value)} style={fInput} />
                <input placeholder="Country" value={site.country} onChange={e=>upSite('country',e.target.value)} style={fInput} />
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
                  <div key={row.key} style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    <span style={{ fontSize:13, color:C.grey, fontWeight:600 }}>{row.lbl}</span>
                    <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                      <input
                        type="number"
                        value={mill[row.key]}
                        onChange={e=>upMill(row.key,e.target.value)}
                        readOnly={bConfirmed}
                        style={{ background:'#000', border:'1.5px solid '+C.tealBdr, borderRadius:7, color:C.teal, fontFamily:Fnt.mono, fontSize:14, fontWeight:800, padding:'8px 10px', width:76, height:38, textAlign:'center', outline:'none', cursor:bConfirmed?'not-allowed':'text', MozAppearance:'textfield' }}
                      />
                      <span style={{ fontSize:11, color:C.grey }}>{row.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ padding:'12px 16px', borderTop:'1px solid rgba(64,215,197,0.08)' }}>
              <button onClick={()=>setBConfirmed(c=>!c)} style={confirmBtn}>
                {bConfirmed ? '✓ Confirmed — Click To Edit' : 'Confirm Mill Processing'}
              </button>
              <div style={{ textAlign:'center', fontSize:10, color:C.grey, marginTop:6 }}>
                {bConfirmed ? 'C and E updated · Click to unlock' : 'Lock values and cascade to C & E'}
              </div>
            </div>
          </div>

          {/* ── C: MILL MONTHLY RESULTS ── */}
          <div style={card}>
            <div style={secTitle}>C — Mill Monthly Results</div>
            <div style={secSub}>Calculated from mill capacity inputs</div>
            <div style={cbody}>
              <div style={{ textAlign:'center', padding:'10px 0' }}>
                <div style={{ fontSize:11, color:C.grey, marginBottom:4 }}>FFB Processed</div>
                <div style={{ fontFamily:Fnt.mono, fontWeight:800, fontSize:22, color:C.amber }}>
                  {fmtT(ffbMonth)} <span style={{ fontSize:12, color:C.grey }}>t/month</span>
                </div>
              </div>
              <div style={{ textAlign:'center', fontSize:16, color:C.grey }}>↓</div>
              <div style={{ textAlign:'center', padding:'6px 0' }}>
                <div style={{ fontSize:11, color:C.grey, marginBottom:4 }}>EFB Discharged</div>
                <div style={{ fontFamily:Fnt.mono, fontWeight:800, fontSize:18, color:C.amber }}>
                  {fmtT(maxT.efb)} <span style={{ fontSize:12, color:C.grey }}>t/month</span>
                </div>
              </div>
              <div style={{ fontSize:11, color:C.grey, fontWeight:700, marginTop:8, marginBottom:4 }}>Additional CPO Mill Residues</div>
              <div style={grid2}>
                {[
                  { lbl:'Decanter Cake', val:maxT.opdc },
                  { lbl:'Palm Oil Sludge', val:maxT.pos },
                ].map(r=>(
                  <div key={r.lbl} style={mixCell}>
                    <span style={{ fontSize:11, color:C.grey }}>{r.lbl}</span>
                    <span style={{ fontFamily:Fnt.mono, fontSize:12, fontWeight:700, color:C.amber }}>{fmtT(r.val)} t/month</span>
                  </div>
                ))}
                <div style={mixCell}>
                  <span style={{ fontSize:11, color:C.grey }}>POME Liquid</span>
                  <span style={{ fontFamily:Fnt.mono, fontSize:12, fontWeight:700, color:C.amber }}>{fmtT(maxT.pome)} t/month</span>
                </div>
                <div style={mixCell}>
                  <div>
                    <span style={{ fontSize:11, color:C.grey }}>Palm Mesocarp Fiber</span>
                    <div style={{ fontFamily:Fnt.mono, fontSize:12, fontWeight:700, color:C.amber }}>{fmtT(maxT.pmf)} t/month</div>
                  </div>
                  <span style={{ fontSize:9, color:C.grey }}>Does Mill Have Boiler?</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── G: SOIL ORIGIN ── */}
          <div style={card}>
            <div style={secTitle}>G — Soil Origin</div>
            <div style={secSub}>Auto-detected · Override available</div>
            <div style={cbody}>
              <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                {SOILS.map(s=>(
                  <div key={s.id} onClick={()=>setSelectedSoil(s.id)} style={{ background:selectedSoil===s.id?C.tealDim:C.navyDeep, border:'1.5px solid '+(selectedSoil===s.id?C.tealBdr:C.bdrCalc), borderRadius:8, padding:'20px 24px', cursor:'pointer', transition:'all 0.12s' }}>
                    <div style={{ fontFamily:Fnt.syne, fontSize:14, fontWeight:700, color:selectedSoil===s.id?C.teal:C.grey }}>
                      {s.name}{s.peat? <span style={{ color:C.red, fontSize:10, marginLeft:6 }}>(Peat)</span>:null}{selectedSoil===s.id?' ✓':''}
                    </div>
                    <div style={{ fontSize:11, color:C.grey, marginTop:2 }}>pH {s.ph} · CEC {s.cec}</div>
                    <div style={{ fontSize:10, color:'rgba(168,189,208,0.5)', marginTop:2 }}>{s.cov}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop:10, padding:'10px 13px', background:C.navyDeep, borderRadius:8, border:'1px solid '+C.bdrCalc }}>
                <div style={{ fontFamily:Fnt.syne, fontSize:13, fontWeight:700, color:C.teal, marginBottom:6 }}>{soilData.name}</div>
                {soilData.pills.map((p,i)=>(<span key={i} style={chips[p.cls]}>{p.txt}</span>))}
              </div>
            </div>
          </div>

        </div>

        {/* ════ ROW 2: D | E | F | G-TOTAL ════ */}
        <div style={{...row4, marginTop:16}}>

          {/* ── D: SELECT MILL RESIDUES ── */}
          <div style={card}>
            <div style={secTitle}>D — Select Mill Residues</div>
            <div style={secSub}>Click any card to activate or de-activate</div>
            <div style={cbody}>
              <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
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
                      <div style={{ fontSize:13, fontWeight:700, color:active&&!disabled?C.teal:C.grey }}>{st.name}</div>
                      <div style={{ fontSize:10, color:C.greyLt }}>{st.sub}{disabled?' (requires EFB)':''}</div>
                    </div>
                  );
                })}
                {showNewFields && (
                  <div style={{ background:C.navyDeep, border:'1.5px solid '+C.tealBdr, borderRadius:8, padding:'10px 13px' }}>
                    <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                      {[{val:newRes1,set:setNewRes1},{val:newRes2,set:setNewRes2}].map((f,i)=>(
                        <div key={i} style={{ background:'#000', border:'1px solid rgba(168,189,208,0.2)', borderRadius:6, padding:'8px 10px' }}>
                          <input value={f.val} onChange={e=>f.set(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addResidue()} placeholder="Enter New Residue" style={{ background:'transparent', border:'none', outline:'none', fontFamily:Fnt.dm, fontSize:14, fontWeight:500, color:C.white, width:'100%' }} />
                        </div>
                      ))}
                    </div>
                    <button onClick={addResidue} style={{ marginTop:8, background:C.tealDim, border:'1px solid '+C.tealBdr, borderRadius:6, color:C.teal, fontFamily:Fnt.dm, fontSize:11, fontWeight:700, padding:'6px 14px', cursor:'pointer' }}>
                      Confirm New Residue
                    </button>
                  </div>
                )}
              </div>
              <div style={{ marginTop:8 }}>
                <button onClick={()=>setShowNewFields(v=>!v)} style={{ background:'transparent', border:'1px solid rgba(64,215,197,0.48)', borderRadius:6, color:C.teal, fontFamily:Fnt.dm, fontSize:11, fontWeight:700, padding:'5px 12px', cursor:'pointer', whiteSpace:'nowrap' }}>Add Residue</button>
              </div>
            </div>
          </div>

          {/* ── E: CHOOSE MONTHLY VOLUME ── */}
          <div style={card}>
            <div style={secTitle}>E — Choose Monthly Volume</div>
            <div style={cbody}>
              <div style={{ fontSize:10, color:C.grey, fontWeight:700, letterSpacing:'0.06em', marginBottom:4 }}>TONNES — AVAILABLE AT CPO MILL</div>
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
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4 }}>
                      <span style={{ fontSize:12, fontWeight:700, color:C.grey }}>{st.name}</span>
                      <span>
                        <span style={{ fontFamily:Fnt.mono, fontSize:13, fontWeight:800, color:C.amber }}>{fmtT(val)}</span>
                        <span style={{ fontSize:10, color:C.grey, marginLeft:3 }}>t/m</span>
                      </span>
                      <span style={{ fontSize:10, color:C.greyLt }}>{fmtT(mx)}</span>
                    </div>
                    <input type="range" min={0} max={mx||1} value={val} onChange={e=>setSlider(st.key,e.target.value)}
                      style={{ width:'100%', height:16, outline:'none', cursor:'pointer', margin:'4px 0', display:'block',
                        background:'linear-gradient(to right, '+C.amber+' 0%, '+C.amber+' '+pct+'%, rgba(64,215,197,0.52) '+pct+'%, rgba(64,215,197,0.52) 100%)',
                        borderRadius:2, WebkitAppearance:'none', appearance:'none' }} />
                    <div style={{ display:'flex', justifyContent:'space-between', fontSize:9, color:C.greyLt }}>
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
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4 }}>
                      <span style={{ fontSize:12, fontWeight:700, color:C.grey }}>{name}</span>
                      <span>
                        <span style={{ fontFamily:Fnt.mono, fontSize:13, fontWeight:800, color:C.amber }}>{fmtT(val)}</span>
                        <span style={{ fontSize:10, color:C.grey, marginLeft:3 }}>t/m</span>
                      </span>
                      <span style={{ fontSize:10, color:C.greyLt }}>10,000</span>
                    </div>
                    <input type="range" min={0} max={mx} value={val} onChange={e=>setSlider(key,e.target.value)}
                      style={{ width:'100%', height:16, outline:'none', cursor:'pointer', margin:'4px 0', display:'block', background:'linear-gradient(to right, '+C.amber+' 0%, '+C.amber+' '+pct+'%, rgba(64,215,197,0.52) '+pct+'%, rgba(64,215,197,0.52) 100%)', borderRadius:2, WebkitAppearance:'none', appearance:'none' }} />
                    <div style={{ display:'flex', justifyContent:'space-between', fontSize:9, color:C.greyLt }}><span>0 t</span><span>100%</span></div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── F: % OF MILL RESIDUES CAPTURED ── */}
          <div style={card}>
            <div style={secTitle}>F — % of Mill Residues Captured</div>
            <div style={secSub}>Volumes set in E · % of mill discharge updates live</div>
            <div style={cbody}>
              {/* Hero */}
              <div style={{ textAlign:'center', padding:'12px 0 8px' }}>
                <div style={{ fontSize:10, color:C.grey, letterSpacing:'0.08em', fontWeight:700 }}>VALORIZING</div>
                <div style={{ fontFamily:Fnt.mono, fontWeight:900, fontSize:28, color:C.amber, marginTop:4 }}>
                  {fHeroPct}
                  <span style={{ fontSize:14, color:C.grey }}>% OF MILL RESIDUES</span>
                </div>
              </div>
              {/* Column headers */}
              <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', gap:4, padding:'6px 0', borderBottom:'1px solid '+C.bdrCalc }}>
                {['MILL DISCHARGE','CAPTURED','TOTAL','%'].map(h=>(
                  <div key={h} style={{ fontSize:9, fontWeight:700, color:C.grey, letterSpacing:'0.06em', textAlign:'center' }}>{h}</div>
                ))}
              </div>
              {/* Rows */}
              <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
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
                    <div key={st.key} style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', gap:4, padding:'5px 0', borderBottom:'1px solid rgba(139,160,180,0.08)' }}>
                      <span style={{ fontSize:11, color:C.grey }}>{st.name}</span>
                      <span style={{ fontSize:11, fontFamily:Fnt.mono, color:active?C.amber:C.grey, textAlign:'center' }}>{active?fmtT(cur):'—'}</span>
                      <span style={{ fontSize:11, fontFamily:Fnt.mono, color:C.grey, textAlign:'center' }}>{fmtT(mx)} t/m</span>
                      <span style={{ textAlign:'center' }}>
                        <span style={{ fontFamily:Fnt.mono, fontSize:12, fontWeight:800, color:active?C.green:C.grey }}>{active?pct:'0.0'}</span>
                        <span style={{ fontSize:9, color:C.grey }}>%</span>
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── G-TOTAL: TOTAL MONTHLY PROCESSING ── */}
          <div style={card}>
            <div style={secTitle}>G — Total</div>
            <div style={secSub}>Drives all S1–S6 calculations</div>
            <div style={cbody}>
              <div style={{ textAlign:'center', padding:'12px 0 8px' }}>
                <div style={{ fontSize:10, color:C.grey, letterSpacing:'0.08em', fontWeight:700 }}>TOTAL PROCESSING VOLUME</div>
                <div style={{ marginTop:4 }}>
                  <span style={{ fontFamily:Fnt.mono, fontWeight:900, fontSize:26, color:C.amber }}>{grandTotal>0?fmtT(grandTotal):'—'}</span>
                  {grandTotal>0&&<span style={{ fontSize:12, color:C.grey, marginLeft:4 }}>t/month</span>}
                </div>
              </div>
              <div style={{ fontSize:10, color:C.grey, fontWeight:700, letterSpacing:'0.06em', marginBottom:4 }}>ACTIVE STREAMS</div>
              {grandTotal===0 ? (
                <div style={{ fontSize:11, color:C.greyLt, textAlign:'center', padding:12 }}>No streams selected — activate in Section D</div>
              ) : (
                Object.entries(streamT).map(([key,t])=>{
                  const nm = ({efb:'Empty Fruit Bunches',opdc:'Decanter Cake',pos:'Palm Oil Sludge',pmf:'Palm Mesocarp Fiber',pome:'POME (Liquid)',pke:'Palm Kernel Expeller',opf:'Oil Palm Fronds',opt:'Oil Palm Trunks'}[key]) || (customStreams.find(c=>c.key===key)?.name) || key.toUpperCase();
                  const pct = grandTotal>0?(t/grandTotal*100).toFixed(1)+' %':'—';
                  return (
                    <div key={key} style={{ ...mixCell, marginBottom:4 }}>
                      <span style={{ fontSize:11, color:C.grey }}>{nm}</span>
                      <span style={{ fontFamily:Fnt.mono, fontSize:11, fontWeight:700, color:C.amber }}>{fmtT(t)} t/m</span>
                      <span style={{ fontSize:10, color:C.greyLt }}>{pct}</span>
                    </div>
                  );
                })
              )}
              <div style={{ marginTop:12, borderTop:'1px solid rgba(64,215,197,0.08)', paddingTop:12 }}>
                <button onClick={()=>setFConfirmed(v=>!v)} style={{ ...confirmBtn, background:C.green }}>
                  {fConfirmed ? '✓ Confirmed — Click To Edit' : 'Confirm Processing Volume'}
                </button>
                <div style={{ textAlign:'center', fontSize:10, color:C.grey, marginTop:6 }}>{fConfirmed?'Volumes locked · cascade to S1':'Lock volumes and cascade to S1 machinery'}</div>
              </div>
            </div>
          </div>

        </div>

        {/* ════ ROW 3: Residue Mix | Structural | Biological | Secondary ════ */}
        <div style={{...row4, marginTop:16}}>

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
                  <div style={{ fontSize:9, color:C.grey, fontWeight:700, letterSpacing:'0.06em', marginBottom:4, marginTop:6 }}>{grp.sec}</div>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:4 }}>
                    {grp.cells.map(c=>(
                      <div key={c.id} style={mixCell}>
                        <span style={mixLbl}>{c.id}</span>
                        <span>
                          <span style={{ fontFamily:Fnt.mono, fontSize:12, fontWeight:700, color:c.green?C.green:c.amber?C.amber:C.white }}>
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
              <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:4 }}>
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
                    <span>
                      <span style={{ fontFamily:Fnt.mono, fontSize:12, fontWeight:700, color:C.white }}>{c.val!=null?c.val:'—'}</span>
                      <span style={mixUnit}>{c.unit}</span>
                    </span>
                  </div>
                ))}
                <div style={{ ...mixCell, gridColumn:'1/-1' }}>
                  <span style={mixLbl}>C:N</span>
                  <span>
                    <span style={{ fontFamily:Fnt.mono, fontSize:12, fontWeight:700, color:C.amber }}>{blend?.CN?.toFixed(1)||'—'}</span>
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
              <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
                <div style={{ ...mixCell, background:'rgba(0,162,73,0.08)' }}>
                  <span style={mixLbl}>Humic Precursor</span>
                  <span>
                    <span style={{ fontFamily:Fnt.mono, fontSize:13, fontWeight:800, color:C.green }}>HIGH</span>
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
                    <span>
                      <span style={{ fontFamily:Fnt.mono, fontSize:12, fontWeight:700, color:C.white }}>{c.val||'—'}</span>
                      <span style={mixUnit}>{c.unit}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Secondary & Micro */}
          <div style={card}>
            <div style={secTitle}>Secondary & Micro</div>
            <div style={secSub}>ICP-OES · CFI-LAB-POME-001 · Pkg B</div>
            <div style={cbody}>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:4 }}>
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
                    <span>
                      <span style={{ fontFamily:Fnt.mono, fontSize:12, fontWeight:700, color:C.white }}>{c.val||'—'}</span>
                      <span style={mixUnit}>{c.unit}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* ════ ROW 4: REGULATORY ════ */}
        <div style={{ marginTop:16 }}>
          <div style={card}>
            <div style={secTitle}>Regulatory & Safety</div>
            <div style={secSub}>Permentan 01/2019 · Heavy metals · Pathogens</div>
            <div style={cbody}>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:4 }}>
                {[
                  { id:'Pb', unit:'mg/kg DM' },{ id:'Cd', unit:'mg/kg DM' },
                  { id:'Hg', unit:'mg/kg DM' },{ id:'As', unit:'mg/kg DM' },
                  { id:'Cr', unit:'mg/kg DM' },{ id:'Coliform', unit:'CFU/g' },
                ].map(c=>(
                  <div key={c.id} style={mixCell}>
                    <span style={mixLbl}>{c.id}</span>
                    <span>
                      <span style={{ fontFamily:Fnt.mono, fontSize:12, fontWeight:700, color:C.white }}>—</span>
                      <span style={mixUnit}>{c.unit}</span>
                    </span>
                  </div>
                ))}
                <div style={{ ...mixCell, gridColumn:'span 2' }}>
                  <span style={mixLbl}>Salmonella</span>
                  <span style={{ fontFamily:Fnt.mono, fontSize:12, fontWeight:700, color:C.white }}>— presence / absence</span>
                </div>
                <div style={{ ...mixCell, gridColumn:'span 2' }}>
                  <span style={mixLbl}>Registration</span>
                  <span>
                    <span style={{ fontFamily:Fnt.mono, fontSize:12, fontWeight:700, color:C.amber }}>Pending</span>
                    <span style={mixUnit}>· Permentan 01/2019</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
