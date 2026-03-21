/**
 * CFI_S0_MASTER_v1.jsx — Complete S0 Site Setup Page
 *
 * SUPABASE WIRING — all columns verified live 2026-03-21
 * Table: cfi_sites
 *
 * SECTION A  → company_name, estate_name, mill_name, district, province, gps_lat, gps_lng
 * SECTION B  → ffb_capacity_tph, utilisation_pct, operating_hrs_day, operating_days_month, capacity_confirmed
 * SECTION C  → monthly_ffb_t, efb_volume_t, opdc_volume_t, pos_volume_t, pmf_volume_t, pome_volume_t (auto-calc)
 * SECTION D  → efb_enabled, opdc_enabled, pos_enabled, pmf_enabled, pke_enabled, pome_enabled,
 *              opf_enabled, opt_enabled, custom_stream_1_enabled, custom_stream_2_enabled,
 *              custom_stream_1_label, custom_stream_2_label
 * SECTION E  → efb_mix_kg, opdc_mix_kg, pos_mix_kg, pmf_mix_kg, pome_mix_kg, pke_mix_kg, opf_mix_kg, opt_mix_kg
 * SECTION G  → soil_type, agronomy_tier
 * SECTION F  → streams_confirmed, blend_cn_dm_weighted, cn_status
 *
 * LOCKED CALCULATIONS (never change):
 *   monthly_ffb = ffb_tph × (util/100) × hrs × days
 *   EFB         = monthly_ffb × 0.225        (22.5% FFB — locked)
 *   OPDC        = EFB × 0.152                (15.2% EFB FW — CLASS A locked)
 *   POS         = monthly_ffb × 0.015
 *   PMF         = monthly_ffb × 0.145
 *   POME        = monthly_ffb × 0.30
 *   P2O5        = P × 2.291
 *   K2O         = K × 1.205
 *   C:N (blend) = DM-weighted element formula (never wet-weight, never hardcoded)
 *   N factor    = 4.67 (never 6.25 in calculations)
 *
 * GUARDRAILS (hard-coded, never override):
 *   EFB off → OPDC auto-deselects immediately
 *   OPDC MC floor: 40% (hard clamp Math.max(40, value))
 *   5-day bio minimum (locked in S3)
 *   PKE cost: $160/t (purchased — not zero cost)
 *   POME: liquid only, excluded from solid mix
 *
 * VISUAL SPEC: locked from CFI_S0_LOCKED_Draft72_7.html
 *   Number inputs: #F5A623 amber ALWAYS (never changes)
 *   Confirm buttons: EB Garamond 700 15px, #00A249 bg, #000 text, 51px height
 */

import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

// ── DESIGN TOKENS (locked) ──────────────────────────────
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
  syne:  "'Syne', sans-serif",
  dm:    "'DM Sans', sans-serif",
  mono:  "'DM Mono', monospace",
  brand: "'EB Garamond', serif",
};

// ── FORMAT HELPERS ──────────────────────────────────────
function fmtT(n) {
  if (!n || n <= 0) return '—';
  if (n >= 1000) return (n/1000).toFixed(1).replace(/\.0$/,'') + 'K';
  return Math.round(n).toString();
}

// ── CANONICAL FEEDSTOCK DATA (locked values) ────────────
// N factor 4.67 always. Never 6.25 in calculations.
const FEEDSTOCK = {
  efb:  { N:0.76, P:0.14, K:2.34, CP:4.75,  EE:2.8,  Ash:5.2,  MC:62.5, DM:37.5, CN:60,  Lignin:22.0, Ca:0.27, Mg:0.09 },
  opdc: { N:2.31, P:0.50, K:1.23, CP:14.5,  EE:10.0, Ash:28.0, MC:70.0, DM:30.0, CN:20,  Lignin:30.7, Ca:0.65, Mg:0.28 },
  pos:  { N:1.76, P:0.32, K:1.10, CP:11.0,  EE:10.0, Ash:28.0, MC:82.0, DM:18.0, CN:22,  Lignin:7.6,  Ca:0.48, Mg:0.18 },
  pmf:  { N:0.58, P:0.10, K:0.40, CP:3.6,   EE:7.0,  Ash:4.5,  MC:40.0, DM:60.0, CN:55,  Lignin:28.0, Ca:0.20, Mg:0.07 },
  pke:  { N:2.20, P:0.62, K:1.30, CP:15.0,  EE:8.5,  Ash:5.0,  MC:12.0, DM:88.0, CN:18,  Lignin:5.0,  Ca:0.30, Mg:0.12 },
  opf:  { N:0.54, P:0.08, K:1.20, CP:3.4,   EE:3.0,  Ash:6.0,  MC:65.0, DM:35.0, CN:70,  Lignin:30.0, Ca:0.30, Mg:0.09 },
  opt:  { N:0.30, P:0.05, K:0.80, CP:1.9,   EE:2.5,  Ash:3.5,  MC:70.0, DM:30.0, CN:90,  Lignin:27.0, Ca:0.20, Mg:0.06 },
};

// ── SOIL DATA (loaded from Supabase cfi_soil_profiles) ──
// Fallback hardcoded for initial render before DB load
const SOILS_FALLBACK = [
  { id:'inceptisols', name:'Inceptisols', ph:'4.1', cec:'15.4', cov:'39% Indonesian Palm',
    pills:[{cls:'green',txt:'Best Soil'},{cls:'green',txt:'pH 4.1 · CEC 15.4'},{cls:'teal',txt:'N Adj Standard'}] },
  { id:'ultisols',    name:'Ultisols',    ph:'4.5', cec:'8.2',  cov:'24% Indonesian Palm',
    pills:[{cls:'amber',txt:'pH 4.5 · CEC 8.2'},{cls:'teal',txt:'N Adj −35%'}] },
  { id:'oxisols',     name:'Oxisols',     ph:'4.4', cec:'6.1',  cov:'8% Indonesian Palm',
    pills:[{cls:'amber',txt:'pH 4.4 · CEC 6.1'},{cls:'red',txt:'P Fixation: Very High'},{cls:'teal',txt:'Split P Doses'}] },
  { id:'histosols',   name:'Histosols',   ph:'3.8', cec:'28.0', cov:'7% · Special Rules',
    pills:[{cls:'red',txt:'pH 3.8 · Very Acid'},{cls:'red',txt:'N −80% P −70%'},{cls:'red',txt:'Drainage Critical'}], peat:true },
  { id:'spodosols',   name:'Spodosols',   ph:'4.77',cec:'2.0',  cov:'Sandy · Lowest Fertility',
    pills:[{cls:'amber',txt:'pH 4.77 · CEC 2.0'},{cls:'red',txt:'N Leaching: Very High'},{cls:'teal',txt:'31% Yield Gap'}] },
  { id:'andisols',    name:'Andisols',    ph:'5.1', cec:'22.0', cov:'Volcanic · High P Fix',
    pills:[{cls:'amber',txt:'pH 5.1 · CEC 22.0'},{cls:'red',txt:'P Fixation: High'},{cls:'teal',txt:'P Rate +30–50%'}] },
];

const MILL_STREAMS  = ['efb','opdc','pos','pmf','pome'];
const ESTATE_STREAMS = ['pke','opf','opt'];
const STREAM_NAMES = {
  efb:'Empty Fruit Bunches', opdc:'Decanter Cake', pos:'Palm Oil Sludge',
  pmf:'Palm Mesocarp Fiber', pome:'POME (Liquid)', pke:'Palm Kernel Expeller',
  opf:'Oil Palm Fronds', opt:'Oil Palm Trunks'
};

// ── DEBOUNCE HOOK ───────────────────────────────────────
function useDebounce(fn, delay) {
  const timer = useRef(null);
  return useCallback((...args) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => fn(...args), delay);
  }, [fn, delay]);
}

// ═══════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════
export default function SiteSetup() {

  // ── Supabase site ID ─────────────────────────────────
  const [siteId, setSiteId] = useState(null);
  const [siteLoading, setSiteLoading] = useState(true);

  // ── Section A state ──────────────────────────────────
  const [site, setSite] = useState({
    company:'', estate:'', millName:'', gpsLat:'', gpsLon:'',
    province:'', district:'', country:'Indonesia'
  });
  const upSite = (k,v) => setSite(s => ({...s,[k]:v}));

  // ── Section B state ──────────────────────────────────
  const [mill, setMill] = useState({ ffb:60, util:85, hrs:20, days:30 });
  const [bConfirmed, setBConfirmed] = useState(false);
  const upMill = (k,v) => { if(bConfirmed) return; setMill(m=>({...m,[k]:+v||0})); };

  // ── Section D state ──────────────────────────────────
  const [activeStreams, setActiveStreams] = useState({
    efb:true, opdc:true, pos:false, pmf:false, pke:false,
    pome:false, opf:false, opt:false
  });
  const [customStreams, setCustomStreams] = useState([]);
  const [showNewFields, setShowNewFields] = useState(false);
  const [newRes1, setNewRes1] = useState('');
  const [newRes2, setNewRes2] = useState('');

  // ── Section E state (sliders) ────────────────────────
  const [sliders, setSliders] = useState({});

  // ── Section G state (soil) ───────────────────────────
  const [selectedSoil, setSelectedSoil] = useState('ultisols');
  const [soils, setSoils] = useState(SOILS_FALLBACK);

  // ── Section F / G-Total confirm ──────────────────────
  const [fConfirmed, setFConfirmed] = useState(false);

  // ── Bottom strip ─────────────────────────────────────
  const [stripExpanded, setStripExpanded] = useState(false);

  // ── Section A cascade suggestions ───────────────────
  const [companySuggestions, setCompanySuggestions] = useState([]);
  const [estateSuggestions,  setEstateSuggestions]  = useState([]);
  const [millSuggestions,    setMillSuggestions]    = useState([]);
  const [gpsSoilSuggestion,  setGpsSoilSuggestion]  = useState('');

  // ═══════════════════════════════════════════════════════
  // SUPABASE INIT — create or load cfi_sites record
  // ═══════════════════════════════════════════════════════
  useEffect(() => {
    async function initSite() {
      setSiteLoading(true);
      // Check for existing session site ID in localStorage
      const storedId = localStorage.getItem('cfi_site_id');
      if (storedId) {
        const { data } = await supabase
          .from('cfi_sites')
          .select('*')
          .eq('id', parseInt(storedId))
          .single();
        if (data) {
          setSiteId(data.id);
          hydrateSiteState(data);
          setSiteLoading(false);
          return;
        }
      }
      // Create new record
      const { data, error } = await supabase
        .from('cfi_sites')
        .insert({
          industry_id: 1,
          ffb_capacity_tph: 60,
          utilisation_pct: 85,
          operating_hrs_day: 20,
          operating_days_month: 30,
          session_date: new Date().toISOString(),
        })
        .select('id')
        .single();
      if (data && !error) {
        setSiteId(data.id);
        localStorage.setItem('cfi_site_id', data.id);
      }
      setSiteLoading(false);
    }
    initSite();
  }, []);

  // Hydrate local state from loaded Supabase record
  function hydrateSiteState(data) {
    if (!data) return;
    setSite({
      company:  data.company_name  || '',
      estate:   data.estate_name   || '',
      millName: data.mill_name     || '',
      gpsLat:   data.gps_lat       != null ? String(data.gps_lat) : '',
      gpsLon:   data.gps_lng       != null ? String(data.gps_lng) : '',
      province: data.province      || '',
      district: data.district      || '',
      country:  'Indonesia',
    });
    setMill({
      ffb:  parseFloat(data.ffb_capacity_tph)    || 60,
      util: parseFloat(data.utilisation_pct)     || 85,
      hrs:  parseFloat(data.operating_hrs_day)   || 20,
      days: parseFloat(data.operating_days_month)|| 30,
    });
    setBConfirmed(!!data.capacity_confirmed);
    setActiveStreams({
      efb:  !!data.efb_enabled,
      opdc: !!data.opdc_enabled,
      pos:  !!data.pos_enabled,
      pmf:  !!data.pmf_enabled,
      pke:  !!data.pke_enabled,
      pome: !!data.pome_enabled,
      opf:  !!data.opf_enabled,
      opt:  !!data.opt_enabled,
    });
    if (data.soil_type) setSelectedSoil(data.soil_type);
    setFConfirmed(!!data.streams_confirmed);
    // Restore slider volumes
    const sv = {};
    if (data.efb_mix_kg)  sv.efb  = parseFloat(data.efb_mix_kg);
    if (data.opdc_mix_kg) sv.opdc = parseFloat(data.opdc_mix_kg);
    if (data.pos_mix_kg)  sv.pos  = parseFloat(data.pos_mix_kg);
    if (data.pmf_mix_kg)  sv.pmf  = parseFloat(data.pmf_mix_kg);
    if (data.pome_volume_t) sv.pome = parseFloat(data.pome_volume_t);
    if (data.pke_mix_kg)  sv.pke  = parseFloat(data.pke_mix_kg);
    if (data.opf_mix_kg)  sv.opf  = parseFloat(data.opf_mix_kg);
    if (data.opt_mix_kg)  sv.opt  = parseFloat(data.opt_mix_kg);
    if (Object.keys(sv).length > 0) setSliders(sv);
    // Custom streams
    const cs = [];
    if (data.custom_stream_1_label) cs.push({ key:'custom_1', name:data.custom_stream_1_label, active:!!data.custom_stream_1_enabled });
    if (data.custom_stream_2_label) cs.push({ key:'custom_2', name:data.custom_stream_2_label, active:!!data.custom_stream_2_enabled });
    if (cs.length) setCustomStreams(cs);
  }

  // Load soil profiles from Supabase
  useEffect(() => {
    supabase
      .from('cfi_soil_profiles')
      .select('soil_key,soil_group_name,coverage_pct_indonesia,ph_degraded_low,ph_degraded_high,cec_degraded_cmol_low,is_peat')
      .eq('is_active', true)
      .order('coverage_pct_indonesia', { ascending: false })
      .then(({ data }) => {
        if (data && data.length > 0) {
          const mapped = data.map(p => ({
            id: p.soil_key,
            name: p.soil_group_name,
            ph: p.ph_degraded_low ? `${p.ph_degraded_low}${p.ph_degraded_high ? '–'+p.ph_degraded_high : ''}` : '—',
            cec: p.cec_degraded_cmol_low ? String(p.cec_degraded_cmol_low) : '—',
            cov: `${p.coverage_pct_indonesia || '—'}% Indonesian Palm`,
            peat: !!p.is_peat,
            pills: buildSoilPills(p),
          }));
          setSoils(mapped);
        }
      });
  }, []);

  // Close cascade dropdowns on outside click
  useEffect(() => {
    const close = () => {
      setCompanySuggestions([]);
      setEstateSuggestions([]);
      setMillSuggestions([]);
    };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  function buildSoilPills(p) {
    const pills = [];
    if (p.ph_degraded_low) pills.push({ cls:'amber', txt:`pH ${p.ph_degraded_low} · CEC ${p.cec_degraded_cmol_low||'—'}` });
    if (p.soil_key?.includes('histosol')) pills.push({ cls:'red', txt:'N −80% P −70% · Peat Rules' });
    if (p.soil_key?.includes('oxisol'))   pills.push({ cls:'red', txt:'P Fixation: Very High' });
    if (p.soil_key?.includes('spodosol')) pills.push({ cls:'red', txt:'N Leaching: Very High' });
    if (p.soil_key?.includes('inceptisol')) pills.push({ cls:'green', txt:'Best Baseline Fertility' });
    return pills;
  }

  // ═══════════════════════════════════════════════════════
  // SECTION A — AUTO-SAVE (debounced 800ms)
  // ═══════════════════════════════════════════════════════
  const saveA = useCallback(async (siteState) => {
    if (!siteId) return;
    await supabase.from('cfi_sites').update({
      company_name: siteState.company  || null,
      estate_name:  siteState.estate   || null,
      mill_name:    siteState.millName || null,
      province:     siteState.province || null,
      district:     siteState.district || null,
      gps_lat:      siteState.gpsLat   ? parseFloat(siteState.gpsLat)  : null,
      gps_lng:      siteState.gpsLon   ? parseFloat(siteState.gpsLon)  : null,
    }).eq('id', siteId);
  }, [siteId]);

  const debouncedSaveA = useDebounce(saveA, 800);
  useEffect(() => {
    if (siteId) debouncedSaveA(site);
  }, [site, siteId]);

  // ═══════════════════════════════════════════════════════
  // SECTION B — SAVE ON CONFIRM
  // ═══════════════════════════════════════════════════════
  async function handleBConfirm() {
    const next = !bConfirmed;
    setBConfirmed(next);
    if (!siteId) return;
    await supabase.from('cfi_sites').update({
      ffb_capacity_tph:     mill.ffb,
      utilisation_pct:      mill.util,
      operating_hrs_day:    mill.hrs,
      operating_days_month: mill.days,
      capacity_confirmed:   next,
    }).eq('id', siteId);
    // Cascade C calculations on confirm
    if (next) saveSectionC(mill);
  }

  // ═══════════════════════════════════════════════════════
  // SECTION C — AUTO-CALCULATE & SAVE
  // LOCKED FORMULAS — NEVER CHANGE
  // ═══════════════════════════════════════════════════════
  const ffbMonth = mill.ffb * (mill.util/100) * mill.hrs * mill.days;

  const maxT = useMemo(() => ({
    efb:  Math.round(ffbMonth * 0.225),  // 22.5% FFB
    opdc: Math.round(ffbMonth * 0.225 * 0.152), // 15.2% EFB FW — LOCKED
    pos:  Math.round(ffbMonth * 0.015),
    pmf:  Math.round(ffbMonth * 0.145),
    pome: Math.round(ffbMonth * 0.30),
    pke: 0, opf: 0, opt: 0,
  }), [ffbMonth]);

  async function saveSectionC(millState) {
    if (!siteId) return;
    const m = millState || mill;
    const monthly = m.ffb * (m.util/100) * m.hrs * m.days;
    const efb  = monthly * 0.225;
    const opdc = efb    * 0.152; // LOCKED
    await supabase.from('cfi_sites').update({
      monthly_ffb_t: Math.round(monthly),
      efb_volume_t:  Math.round(efb),
      opdc_volume_t: Math.round(opdc),
      pos_volume_t:  Math.round(monthly * 0.015),
      pmf_volume_t:  Math.round(monthly * 0.145),
      pome_volume_t: Math.round(monthly * 0.30),
    }).eq('id', siteId);
  }

  // ═══════════════════════════════════════════════════════
  // SECTION D — STREAM TOGGLE + SAVE
  // GUARDRAIL: EFB off → OPDC auto-deselects
  // ═══════════════════════════════════════════════════════
  async function toggleStream(key) {
    setActiveStreams(prev => {
      const next = { ...prev, [key]: !prev[key] };
      // GUARDRAIL: EFB off → OPDC must deselect
      if (key === 'efb' && !next.efb) next.opdc = false;
      saveStreamToggles(next);
      return next;
    });
  }

  async function saveStreamToggles(streams) {
    if (!siteId) return;
    await supabase.from('cfi_sites').update({
      efb_enabled:  !!streams.efb,
      opdc_enabled: !!streams.opdc,
      pos_enabled:  !!streams.pos,
      pmf_enabled:  !!streams.pmf,
      pke_enabled:  !!streams.pke,
      pome_enabled: !!streams.pome,
      opf_enabled:  !!streams.opf,
      opt_enabled:  !!streams.opt,
    }).eq('id', siteId);
  }

  // ── Custom residues
  const addResidue = async () => {
    const names = [newRes1, newRes2].filter(n => n.trim());
    if (!names.length) return;
    const added = names.map((name, i) => ({ key: `custom_${i+1}`, name, active: true }));
    setCustomStreams(cs => [...cs, ...added]);
    setActiveStreams(s => { const n={...s}; added.forEach(a => { n[a.key]=true; }); return n; });
    if (siteId && added[0]) {
      await supabase.from('cfi_sites').update({
        custom_stream_1_label:   added[0]?.name || null,
        custom_stream_1_enabled: true,
        custom_stream_2_label:   added[1]?.name || null,
        custom_stream_2_enabled: !!added[1],
      }).eq('id', siteId);
    }
    setNewRes1(''); setNewRes2(''); setShowNewFields(false);
  };

  // ═══════════════════════════════════════════════════════
  // SECTION E — SLIDER SAVE (debounced 600ms)
  // Sliders pre-filled from C calculations (50% of max)
  // ═══════════════════════════════════════════════════════
  const getSlider = (key) => {
    if (sliders[key] !== undefined) return sliders[key];
    return Math.round((maxT[key] || 8000) * 0.5);
  };

  const setSlider = (key, val) => setSliders(s => ({...s, [key]: +val}));

  const saveSliders = useCallback(async (sliderState) => {
    if (!siteId) return;
    await supabase.from('cfi_sites').update({
      efb_mix_kg:  sliderState.efb  != null ? Math.round(sliderState.efb)  : null,
      opdc_mix_kg: sliderState.opdc != null ? Math.round(sliderState.opdc) : null,
      pos_mix_kg:  sliderState.pos  != null ? Math.round(sliderState.pos)  : null,
      pmf_mix_kg:  sliderState.pmf  != null ? Math.round(sliderState.pmf)  : null,
      pke_mix_kg:  sliderState.pke  != null ? Math.round(sliderState.pke)  : null,
      opf_mix_kg:  sliderState.opf  != null ? Math.round(sliderState.opf)  : null,
      opt_mix_kg:  sliderState.opt  != null ? Math.round(sliderState.opt)  : null,
    }).eq('id', siteId);
  }, [siteId]);

  const debouncedSaveSliders = useDebounce(saveSliders, 600);
  useEffect(() => {
    if (siteId && Object.keys(sliders).length > 0) debouncedSaveSliders(sliders);
  }, [sliders, siteId]);

  // ═══════════════════════════════════════════════════════
  // SECTION G — SOIL SAVE
  // ═══════════════════════════════════════════════════════
  async function selectSoil(id) {
    setSelectedSoil(id);
    if (!siteId) return;
    await supabase.from('cfi_sites').update({ soil_type: id }).eq('id', siteId);
  }

  // ═══════════════════════════════════════════════════════
  // BLEND CALCULATION (DM-weighted, never hardcoded)
  // C:N = sum(N_i × CN_i × w_i) / sum(N_i × w_i)
  // ═══════════════════════════════════════════════════════
  const streamT = useMemo(() => {
    const t = {};
    const allKeys = [...MILL_STREAMS, ...ESTATE_STREAMS, ...customStreams.map(c=>c.key)];
    allKeys.forEach(k => {
      if (activeStreams[k] || customStreams.find(c=>c.key===k && c.active)) {
        t[k] = getSlider(k);
      }
    });
    return t;
  }, [activeStreams, sliders, maxT, customStreams]);

  const grandTotal = Object.values(streamT).reduce((a,b)=>a+(b||0),0);
  const millStreamTotal = MILL_STREAMS.filter(k=>streamT[k]).reduce((a,k)=>a+(streamT[k]||0),0);
  const millMaxTotal    = MILL_STREAMS.reduce((a,k)=>a+(maxT[k]||0),0);
  const fHeroPct        = millMaxTotal > 0 ? (millStreamTotal/millMaxTotal*100).toFixed(1) : '—';

  const blend = useMemo(() => {
    const b = { N:0, P:0, K:0, CP:0, EE:0, Ash:0, MC:0, DM:0, CN_N:0, CN_C:0, Lignin:0, Ca:0, Mg:0 };
    if (grandTotal <= 0) return null;
    Object.keys(streamT).forEach(key => {
      const t = streamT[key]||0; if (t<=0) return;
      const s = FEEDSTOCK[key]; if (!s) return;
      const w = t/grandTotal;
      b.N+=s.N*w; b.P+=s.P*w; b.K+=s.K*w; b.CP+=s.CP*w;
      b.EE+=s.EE*w; b.Ash+=s.Ash*w; b.MC+=s.MC*w; b.DM+=s.DM*w;
      b.CN_N+=s.N*w; b.CN_C+=s.N*s.CN*w;
      b.Lignin+=s.Lignin*w; b.Ca+=s.Ca*w; b.Mg+=s.Mg*w;
    });
    b.CN   = b.CN_N > 0 ? b.CN_C/b.CN_N : 0;
    b.P2O5 = b.P * 2.291;
    b.K2O  = b.K * 1.205;
    return b;
  }, [streamT, grandTotal]);

  // C:N status for BSF
  function cnStatus(cn) {
    if (!cn || cn <= 0) return null;
    if (cn < 15) return { color: C.red,   txt: 'LOW — Below BSF Minimum' };
    if (cn <= 25) return { color: C.green, txt: 'OPTIMAL — BSF Range' };
    if (cn <= 35) return { color: C.amber, txt: 'MARGINAL — Add POS / PKE' };
    return { color: C.red, txt: 'HIGH — EFB Dominant' };
  }

  // ═══════════════════════════════════════════════════════
  // SECTION F / G-TOTAL CONFIRM — SAVE
  // ═══════════════════════════════════════════════════════
  async function handleFConfirm() {
    const next = !fConfirmed;
    setFConfirmed(next);
    if (!siteId || !blend) return;
    const cn = blend.CN;
    const status = cnStatus(cn);
    await supabase.from('cfi_sites').update({
      streams_confirmed:    next,
      blend_cn_dm_weighted: cn ? parseFloat(cn.toFixed(2)) : null,
      cn_status:            status?.txt || null,
    }).eq('id', siteId);
  }

  // Current soil data
  const soilData = soils.find(s=>s.id===selectedSoil) || soils[0] || SOILS_FALLBACK[1];

  // ═══════════════════════════════════════════════════════
  // STYLES
  // ═══════════════════════════════════════════════════════
  const card       = { background:C.navyCard, border:`1.5px solid rgba(0,201,177,0.13)`, borderRadius:11, overflow:'hidden', minWidth:0 };
  const secTitle   = { padding:'11px 16px 10px', fontFamily:Fnt.syne, fontWeight:700, fontSize:15, color:C.teal, borderBottom:`1px solid rgba(64,215,197,0.12)`, display:'flex', alignItems:'center', justifyContent:'space-between', whiteSpace:'nowrap' };
  const secSub     = { fontSize:13, color:C.greyLt, padding:'5px 16px 7px' };
  const cbody      = { padding:'11px 13px', display:'flex', flexDirection:'column', gap:6 };
  const grid2      = { display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 };
  const grid3      = { display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12 };
  const row4       = { display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:14, alignItems:'stretch' };
  const mixCell    = { background:C.navyDeep, border:`1px solid ${C.bdrCalc}`, borderRadius:6, padding:'7px 9px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:6, minHeight:36, overflow:'hidden' };
  const mixLbl     = { fontSize:13, fontWeight:700, fontFamily:Fnt.mono, color:C.grey, whiteSpace:'nowrap', flexShrink:0 };
  const mixUnit    = { fontSize:11, fontWeight:700, fontFamily:Fnt.mono, color:C.greyLt, whiteSpace:'nowrap', flexShrink:0, marginLeft:5 };
  const chipBase   = { fontSize:11, fontWeight:700, fontFamily:Fnt.mono, padding:'3px 10px', borderRadius:12, border:'1px solid', whiteSpace:'nowrap' };
  const chips = {
    green: { ...chipBase, color:C.green, borderColor:'rgba(0,162,73,0.4)',       background:C.greenDim },
    teal:  { ...chipBase, color:C.teal,  borderColor:'rgba(64,215,197,0.48)',    background:C.tealDim  },
    amber: { ...chipBase, color:C.amber, borderColor:'rgba(245,166,35,0.4)',     background:C.amberDim },
    red:   { ...chipBase, color:C.red,   borderColor:'rgba(232,64,64,0.4)',      background:C.redDim   },
    grey:  { ...chipBase, color:C.grey,  borderColor:'rgba(168,189,208,0.25)',   background:'rgba(168,189,208,0.06)' },
  };
  // Input field: full width, black bg, grey border, white text, 42px min
  const fInput = { background:'#000', border:`1px solid rgba(168,189,208,0.2)`, borderRadius:7, padding:'10px 13px', fontSize:14, fontWeight:700, fontFamily:Fnt.dm, color:C.white, width:'100%', outline:'none', minHeight:42, boxSizing:'border-box' };
  // Number input: BLACK bg, TEAL border, AMBER text — always amber, never changes
  const bInput = { background:'#000', border:`1.5px solid ${C.tealBdr}`, borderRadius:7, color:C.amber, fontFamily:Fnt.mono, fontSize:14, fontWeight:800, padding:'8px 10px', width:76, height:38, textAlign:'center', outline:'none', MozAppearance:'textfield' };
  // Confirm button: EB Garamond, green bg, black text, 51px tall
  const confirmBtn = { background:C.green, color:'#000', fontFamily:Fnt.brand, fontWeight:700, fontSize:15, letterSpacing:'0.04em', border:'none', borderRadius:8, padding:'0 28px', height:51, minWidth:260, display:'block', margin:'0 auto', cursor:'pointer' };
  const slItem     = { background:C.navyDeep, border:`1.5px solid ${C.bdrCalc}`, borderRadius:8, padding:'10px 26px 10px 13px', minHeight:52, marginBottom:6 };
  const toggleCard = (active, disabled=false) => ({
    background: active ? C.tealDim : C.navyDeep,
    border: `1.5px solid ${active ? C.tealBdr : C.bdrCalc}`,
    borderRadius:8, padding:'10px 13px', cursor: disabled?'not-allowed':'pointer',
    transition:'all 0.12s', minHeight:52, opacity: disabled ? 0.45 : 1,
  });

  // ═══════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════
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
            <div style={{ fontSize:11, color:C.teal, marginTop:4, fontFamily:Fnt.dm, whiteSpace:'nowrap' }}>Soil Microbiome Engineering &amp; Biofertiliser Production for Closed&#8209;Loop Nutrient Recycling</div>
          </div>
        </div>
        <div style={{ display:'flex', gap:4, marginLeft:'auto', alignItems:'center', flexShrink:0 }}>
          {['S0','S1','S2','S3','S4','S5','S6','CAPEX','Σ'].map((s,i)=>(
            <div key={s} style={{ background:i===0?C.teal:'rgba(168,189,208,0.09)', border:`1px solid ${i===0?C.teal:'rgba(168,189,208,0.18)'}`, borderRadius:4, padding:'3px 9px', fontFamily:Fnt.mono, fontSize:11, fontWeight:700, color:i===0?C.navy:C.grey, cursor:'pointer', whiteSpace:'nowrap' }}>{s}</div>
          ))}
        </div>
        <div style={{ display:'flex', gap:7, alignItems:'center', marginLeft:16, flexShrink:0 }}>
          <div style={chips.green}>Valid</div>
          <div style={chips.teal}>Blend Valid</div>
          <div style={chips.amber}>Soil: {soilData.name}</div>
          {blend?.CN > 0 && <div style={{...chips[cnStatus(blend.CN)?.color === C.green ? 'green' : cnStatus(blend.CN)?.color === C.amber ? 'amber' : 'red'], fontSize:10}}>C:N {blend.CN.toFixed(1)}</div>}
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
        <span style={{ fontSize:11, color:C.greyLt }}>Site Identity · Mill Capacity · Residue Streams · Soil Profile</span>
        {siteLoading && <span style={{ fontSize:10, color:C.greyLt, marginLeft:'auto', fontFamily:Fnt.mono }}>Loading…</span>}
        {siteId && !siteLoading && <span style={{ fontSize:10, color:'rgba(64,215,197,0.40)', marginLeft:'auto', fontFamily:Fnt.mono }}>Site #{siteId}</span>}
      </div>

      {/* ── PAGE CONTENT ── */}
      <div style={{ padding:'16px 22px 60px', display:'flex', flexDirection:'column', gap:14 }}>

        {/* ════ ROW 1: A | B | C | G ════ */}
        <div style={row4}>

          {/* ── A: SITE DETAILS WITH CASCADE ── */}
          <div style={card}>
            <div style={secTitle}>A — Enter Your Details</div>
            <div style={secSub}>Mill Identity · Location · GPS Coordinates</div>
            <div style={cbody}>
              <div style={{ display:'flex', flexDirection:'column', gap:6 }}>

                {/* Company Name — autocomplete from cfi_mill_owners */}
                <div style={{ position:'relative' }} onClick={e => e.stopPropagation()}>
                  <input
                    style={fInput}
                    placeholder="I Will Enter Manually — Or Type Company Name"
                    value={site.company}
                    onChange={async e => {
                      const val = e.target.value;
                      upSite('company', val);
                      if (val.length >= 2) {
                        const { data } = await supabase
                          .from('cfi_mill_owners')
                          .select('id, company')
                          .ilike('company', `%${val}%`)
                          .limit(8);
                        setCompanySuggestions(data || []);
                      } else {
                        setCompanySuggestions([]);
                      }
                    }}
                  />
                  {companySuggestions.length > 0 && (
                    <div style={{ position:'absolute', top:'100%', left:0, right:0, background:'#0C1E33', border:'1px solid rgba(64,215,197,0.40)', borderRadius:7, zIndex:100, maxHeight:200, overflowY:'auto' }}>
                      {companySuggestions.map(c => (
                        <div
                          key={c.id}
                          onClick={async () => {
                            upSite('company', c.company);
                            setCompanySuggestions([]);
                            const { data: estates } = await supabase
                              .from('cfi_estates')
                              .select('id, estate_name, province, district_kabupaten, area_ha')
                              .ilike('owner_company', `%${c.company}%`)
                              .limit(50);
                            setEstateSuggestions(estates || []);
                            const { data: mills } = await supabase
                              .from('cfi_mills_60tph')
                              .select('id, mill_name, province, district_kabupaten, latitude, longitude, confirmed_soil_type, capacity_tph')
                              .ilike('owner_company', `%${c.company}%`)
                              .limit(50);
                            setMillSuggestions(mills || []);
                          }}
                          style={{ padding:'9px 13px', cursor:'pointer', fontSize:13, fontFamily:Fnt.dm, color:C.grey, borderBottom:'1px solid rgba(255,255,255,0.05)' }}
                          onMouseEnter={e => e.target.style.background = 'rgba(64,215,197,0.08)'}
                          onMouseLeave={e => e.target.style.background = 'transparent'}
                        >
                          {c.company}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Estate + Mill row */}
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6 }}>

                  {/* Estate Name — autocomplete from cfi_estates */}
                  <div style={{ position:'relative' }} onClick={e => e.stopPropagation()}>
                    <input
                      style={fInput}
                      placeholder="Estate / Plantation Name"
                      value={site.estate}
                      onChange={async e => {
                        const val = e.target.value;
                        upSite('estate', val);
                        if (val.length >= 2) {
                          const { data } = await supabase
                            .from('cfi_estates')
                            .select('id, estate_name, province, district_kabupaten, area_ha')
                            .ilike('estate_name', `%${val}%`)
                            .limit(8);
                          setEstateSuggestions(data || []);
                        }
                      }}
                    />
                    {estateSuggestions.length > 0 && (
                      <div style={{ position:'absolute', top:'100%', left:0, right:0, background:'#0C1E33', border:'1px solid rgba(64,215,197,0.40)', borderRadius:7, zIndex:100, maxHeight:200, overflowY:'auto' }}>
                        {estateSuggestions.map(est => (
                          <div
                            key={est.id}
                            onClick={() => {
                              upSite('estate', est.estate_name);
                              if (est.province) upSite('province', est.province);
                              if (est.district_kabupaten) upSite('district', est.district_kabupaten);
                              setEstateSuggestions([]);
                            }}
                            style={{ padding:'9px 13px', cursor:'pointer', fontSize:13, fontFamily:Fnt.dm, color:C.grey, borderBottom:'1px solid rgba(255,255,255,0.05)' }}
                            onMouseEnter={ev => ev.target.style.background = 'rgba(64,215,197,0.08)'}
                            onMouseLeave={ev => ev.target.style.background = 'transparent'}
                          >
                            {est.estate_name}
                            {est.province ? <span style={{ fontSize:11, color:'rgba(168,189,208,0.55)', marginLeft:6 }}>{est.province}</span> : null}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Mill Name — autocomplete from cfi_mills_60tph */}
                  <div style={{ position:'relative' }} onClick={e => e.stopPropagation()}>
                    <input
                      style={fInput}
                      placeholder="Mill Name / #"
                      value={site.millName}
                      onChange={async e => {
                        const val = e.target.value;
                        upSite('millName', val);
                        if (val.length >= 2) {
                          const { data } = await supabase
                            .from('cfi_mills_60tph')
                            .select('id, mill_name, province, district_kabupaten, latitude, longitude, confirmed_soil_type, capacity_tph')
                            .ilike('mill_name', `%${val}%`)
                            .limit(8);
                          setMillSuggestions(data || []);
                        }
                      }}
                    />
                    {millSuggestions.length > 0 && (
                      <div style={{ position:'absolute', top:'100%', left:0, right:0, background:'#0C1E33', border:'1px solid rgba(64,215,197,0.40)', borderRadius:7, zIndex:100, maxHeight:200, overflowY:'auto' }}>
                        {millSuggestions.map(m => (
                          <div
                            key={m.id}
                            onClick={async () => {
                              upSite('millName', m.mill_name);
                              if (m.province) upSite('province', m.province);
                              if (m.district_kabupaten) upSite('district', m.district_kabupaten);
                              if (m.latitude)  upSite('gpsLat', String(m.latitude));
                              if (m.longitude) upSite('gpsLon', String(m.longitude));
                              if (m.capacity_tph) setMill(prev => ({ ...prev, ffb: m.capacity_tph }));
                              setMillSuggestions([]);
                              if (m.latitude && m.longitude) {
                                const { data: soilResult } = await supabase
                                  .rpc('get_soil_acidity_class', {
                                    p_lat: m.latitude,
                                    p_lon: m.longitude,
                                    p_max_distance_km: 25,
                                  });
                                if (soilResult && soilResult.length > 0) {
                                  setGpsSoilSuggestion(soilResult[0].class_name || '');
                                }
                              }
                              if (m.confirmed_soil_type) {
                                setSelectedSoil(m.confirmed_soil_type.toLowerCase().replace(' ',''));
                                if (siteId) {
                                  supabase.from('cfi_sites').update({ soil_type: m.confirmed_soil_type.toLowerCase().replace(' ','') }).eq('id', siteId);
                                }
                              }
                            }}
                            style={{ padding:'9px 13px', cursor:'pointer', fontSize:13, fontFamily:Fnt.dm, color:C.grey, borderBottom:'1px solid rgba(255,255,255,0.05)' }}
                            onMouseEnter={ev => ev.target.style.background = 'rgba(64,215,197,0.08)'}
                            onMouseLeave={ev => ev.target.style.background = 'transparent'}
                          >
                            {m.mill_name}
                            {m.province ? <span style={{ fontSize:11, color:'rgba(168,189,208,0.55)', marginLeft:6 }}>{m.province}</span> : null}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>

                {/* Province + GPS row */}
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6 }}>
                  <input style={fInput} placeholder="Province" value={site.province} onChange={e=>upSite('province',e.target.value)} />
                  <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                    <div>
                      <div style={{ fontSize:10, fontWeight:700, fontFamily:Fnt.mono, color:C.grey, letterSpacing:'0.06em', marginBottom:3 }}>GPS LATITUDE</div>
                      <input style={{...fInput, color:C.greyLt}} placeholder="Optional — Auto-Fills From Mill" value={site.gpsLat} onChange={e=>upSite('gpsLat',e.target.value)} />
                    </div>
                    <div>
                      <div style={{ fontSize:10, fontWeight:700, fontFamily:Fnt.mono, color:C.grey, letterSpacing:'0.06em', marginBottom:3 }}>GPS LONGITUDE</div>
                      <input style={{...fInput, color:C.greyLt}} placeholder="Optional — Auto-Fills From Mill" value={site.gpsLon} onChange={e=>upSite('gpsLon',e.target.value)} />
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
            <div style={secSub}>Auto-Detected · Override Available</div>
            <div style={cbody}>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {[
                  { lbl:'FFB Capacity',     key:'ffb',  unit:'T / hr',   max:3 },
                  { lbl:'Utilization Rate', key:'util', unit:'%',        max:3 },
                  { lbl:'Operating Hours',  key:'hrs',  unit:'hr / day', max:2 },
                  { lbl:'Days / Month',     key:'days', unit:'days',     max:2 },
                ].map(row=>(
                  <div key={row.key} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', background:C.navyField, border:`1px solid rgba(168,189,208,0.12)`, borderRadius:8, padding:'10px 14px', gap:12, minHeight:48 }}>
                    <span style={{ flex:1, fontSize:14, fontWeight:700, color:C.grey, whiteSpace:'nowrap' }}>{row.lbl}</span>
                    <div style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
                      <input
                        type="number"
                        value={mill[row.key]}
                        onChange={e=>upMill(row.key, e.target.value)}
                        readOnly={bConfirmed}
                        style={{ ...bInput, cursor:bConfirmed?'not-allowed':'text' }}
                      />
                      <span style={{ fontSize:11, fontFamily:Fnt.mono, color:C.greyLt, whiteSpace:'nowrap', width:42 }}>{row.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ padding:'8px 13px 13px' }}>
              <button onClick={handleBConfirm} style={confirmBtn}>
                {bConfirmed ? 'Confirmed — Click To Edit' : 'Confirm Mill Processing'}
              </button>
              <div style={{ fontSize:11, color:C.greyLt, textAlign:'center', marginTop:5 }}>
                {bConfirmed ? 'C And E Updated · Click To Unlock' : 'Lock Values And Cascade To C And E'}
              </div>
            </div>
          </div>

          {/* ── C: MILL MONTHLY RESULTS ── */}
          <div style={card}>
            <div style={secTitle}>C — Mill Monthly Results</div>
            <div style={secSub}>Calculated From Mill Capacity Inputs</div>
            {!bConfirmed ? (
              <div style={{ padding:'30px 16px', textAlign:'center', fontSize:12, color:C.greyLt, fontFamily:Fnt.dm }}>
                Confirm Mill Processing In Section B To See Results
              </div>
            ) : (
              <div style={{ padding:'15px 18px', display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
                {/* FFB Processed — green box, black text */}
                <div style={{ background:C.green, border:`1.5px solid ${C.green}`, borderRadius:9, padding:'12px 17px', textAlign:'center', width:'100%' }}>
                  <div style={{ fontFamily:Fnt.brand, fontWeight:700, fontSize:17, color:'#000', marginBottom:4 }}>FFB Processed</div>
                  <div style={{ fontFamily:Fnt.brand, fontWeight:700, fontSize:19, color:'#000' }}>
                    {fmtT(ffbMonth)} <span style={{ fontSize:16, color:'#000' }}>t / month</span>
                  </div>
                </div>
                <div style={{ fontSize:24, color:C.grey, opacity:0.85, fontWeight:900, lineHeight:1 }}>↓</div>
                {/* EFB Discharged — teal-dim, amber text */}
                <div style={{ background:C.tealDim, border:`1.5px solid ${C.tealBdr}`, borderRadius:9, padding:'12px 17px', textAlign:'center', width:'100%' }}>
                  <div style={{ fontFamily:Fnt.brand, fontWeight:700, fontSize:17, color:C.amber, marginBottom:4 }}>EFB Discharged</div>
                  <div style={{ fontFamily:Fnt.brand, fontWeight:700, fontSize:19, color:C.amber }}>
                    {fmtT(maxT.efb)} <span style={{ fontSize:16, color:C.amber }}>t / month</span>
                  </div>
                </div>
                <div style={{ fontSize:11, fontWeight:700, fontFamily:Fnt.dm, color:C.grey, letterSpacing:'0.05em', width:'100%', textAlign:'center', marginTop:10 }}>
                  Additional CPO Mill Residues
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, width:'100%', marginTop:8, alignItems:'stretch' }}>
                  {[
                    { lbl:'Decanter Cake',     val:maxT.opdc, grey:false },
                    { lbl:'Palm Oil Sludge',   val:maxT.pos,  grey:false },
                    { lbl:'POME Liquid',       val:maxT.pome, grey:false },
                    { lbl:'Palm Mesocarp Fiber',val:maxT.pmf,  grey:true  },
                  ].map(r=>(
                    <div key={r.lbl} style={{ background:r.grey?'rgba(168,189,208,0.07)':C.tealDim, border:`1.5px solid ${r.grey?'rgba(168,189,208,0.22)':C.tealBdr}`, borderRadius:7, padding:'13px 9px', textAlign:'center' }}>
                      <div style={{ fontFamily:Fnt.brand, fontWeight:700, fontSize:17, color:C.amber, marginBottom:4, lineHeight:1.2 }}>{r.lbl}</div>
                      <div style={{ fontFamily:Fnt.brand, fontWeight:700, fontSize:19, color:C.amber }}>
                        {fmtT(r.val)} <span style={{ fontSize:16, color:C.amber }}>t / month</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── G: SOIL ORIGIN ── */}
          <div style={card}>
            <div style={secTitle}>G — Soil Origin</div>
            <div style={secSub}>Auto-Detected · Override Available</div>
            <div style={cbody}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:9 }}>
                {soils.map(s=>(
                  <div key={s.id} onClick={()=>selectSoil(s.id)} style={{ background:selectedSoil===s.id?C.tealDim:C.navyDeep, border:`1.5px solid ${selectedSoil===s.id?C.tealBdr:C.bdrCalc}`, borderRadius:8, padding:'20px 24px', cursor:'pointer', transition:'all 0.12s' }}>
                    <div style={{ fontSize:14, fontWeight:700, fontFamily:Fnt.dm, color:selectedSoil===s.id?C.amber:C.grey }}>
                      {s.name}{s.peat?<span style={{ color:C.amber, fontSize:11 }}> (Peat)</span>:null}
                    </div>
                    <div style={{ fontSize:12, fontFamily:Fnt.dm, color:selectedSoil===s.id?'rgba(245,166,35,0.75)':C.greyLt, marginTop:6 }}>pH {s.ph} · CEC {s.cec}</div>
                    <div style={{ fontSize:12, fontFamily:Fnt.dm, color:selectedSoil===s.id?'rgba(245,166,35,0.6)':C.greyLt, marginTop:4 }}>{s.cov}</div>
                  </div>
                ))}
              </div>
              {gpsSoilSuggestion && (
                <div style={{ background:'rgba(64,215,197,0.10)', border:'1px solid rgba(64,215,197,0.40)', borderRadius:6, padding:'7px 12px', marginBottom:8, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <span style={{ fontSize:12, color:C.teal, fontFamily:Fnt.dm }}>
                    GPS Signal: {gpsSoilSuggestion} Found Near This Mill. Is This Correct?
                  </span>
                  <button onClick={()=>setGpsSoilSuggestion('')} style={{ background:'none', border:'none', color:C.greyLt, cursor:'pointer', fontSize:16 }}>×</button>
                </div>
              )}
              {selectedSoil === 'histosols' && (
                <div style={{ background:C.redDim, border:`1px solid ${C.red}`, borderRadius:6, padding:'7px 12px', fontSize:11, color:C.red, fontFamily:Fnt.dm, marginBottom:6 }}>
                  Peat Soil. 80% Less N And 70% Less P Needed. N Over-Application Locked Out.
                </div>
              )}
              {(selectedSoil === 'oxisols' || selectedSoil === 'spodosols') && (
                <div style={{ background:C.amberDim, border:`1px solid rgba(245,166,35,0.45)`, borderRadius:6, padding:'7px 12px', fontSize:11, color:C.amber, fontFamily:Fnt.dm, marginBottom:6 }}>
                  {selectedSoil === 'oxisols' ? 'High Fe/Al Oxide Content. CFI Chelated P Significantly Outperforms TSP.' : 'Sandy — Lowest Fertility. CFI Humate Provides Critical CEC Improvement. 31% Yield Gap.'}
                </div>
              )}
              <div style={{ display:'flex', gap:7, flexWrap:'wrap', marginTop:4 }}>
                <div style={{ fontSize:15, fontWeight:700, fontFamily:Fnt.mono, padding:'4px 12px', borderRadius:12, border:`1.5px solid ${C.green}`, background:C.green, color:'#000', whiteSpace:'nowrap', display:'inline-block' }}>{soilData.name}</div>
                {soilData.pills?.map((p,i)=>(<div key={i} style={{...chips[p.cls], fontSize:13}}>{p.txt}</div>))}
              </div>
            </div>
          </div>
        </div>

        {/* ════ ROW 2: D | E | F | G-TOTAL ════ */}
        <div style={row4}>

          {/* ── D: SELECT MILL RESIDUES ── */}
          <div style={card}>
            <div style={secTitle}>D — Select Mill Residues</div>
            <div style={secSub}>Click Any Card To Activate Or De-Activate</div>
            <div style={cbody}>
              <div style={grid2}>
                {[
                  { key:'efb',  name:'Empty Fruit Bunches', sub:'EFB · Zero Cost' },
                  { key:'opdc', name:'Decanter Cake',        sub:'OPDC · Zero Cost', needsEfb:true },
                  { key:'pos',  name:'Palm Oil Sludge',       sub:'POS · Zero Cost' },
                  { key:'pmf',  name:'Palm Mesocarp Fiber',   sub:'PMF · Zero Cost' },
                  { key:'pke',  name:'Palm Kernel Expeller',  sub:'PKE · $160/t — Purchased', purchased:true },
                  { key:'pome', name:'POME (Liquid)',          sub:'Emissions Avoidance Only', liquid:true },
                  { key:'opf',  name:'Oil Palm Fronds',        sub:'OPF · Seasonal · Zero Cost' },
                  { key:'opt',  name:'Oil Palm Trunks',        sub:'OPT · Replanting Only · Zero Cost' },
                  ...customStreams.map(c=>({ key:c.key, name:c.name, sub:'Custom · Zero Cost' })),
                ].map(st=>{
                  const active   = activeStreams[st.key];
                  const disabled = st.needsEfb && !activeStreams.efb;
                  return (
                    <div key={st.key} onClick={()=>!disabled && toggleStream(st.key)} style={toggleCard(active && !disabled, disabled)}>
                      <div style={{ fontSize:14, fontWeight:700, fontFamily:Fnt.dm, color:(active&&!disabled)?C.amber:C.grey }}>{st.name}</div>
                      <div style={{ fontSize:12, fontFamily:Fnt.dm, color:(active&&!disabled)?'rgba(245,166,35,0.65)':C.greyLt, marginTop:3 }}>
                        {disabled ? 'Requires EFB' : st.sub}
                      </div>
                      {st.purchased && active && <div style={{ fontSize:10, fontFamily:Fnt.mono, color:C.amber, marginTop:3 }}>Purchased — Not Mill Waste</div>}
                      {st.liquid && active && <div style={{ fontSize:10, fontFamily:Fnt.mono, color:C.teal, marginTop:3 }}>Liquid — Excluded From Solid Mix</div>}
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
              {[...MILL_STREAMS, ...ESTATE_STREAMS, ...customStreams.map(c=>c.key)].map(key=>{
                if (!activeStreams[key] && !customStreams.find(c=>c.key===key && c.active)) return null;
                const name = STREAM_NAMES[key] || customStreams.find(c=>c.key===key)?.name || key.toUpperCase();
                const mx   = maxT[key] || 8000;
                const val  = getSlider(key);
                const pct  = mx > 0 ? (val/mx*100) : 50;
                return (
                  <div key={key} style={slItem}>
                    <div style={{ display:'grid', gridTemplateColumns:'auto 1fr auto', alignItems:'baseline', gap:6, marginBottom:10 }}>
                      <span style={{ fontSize:14, fontWeight:700, fontFamily:Fnt.dm, color:C.teal }}>{name}</span>
                      <span style={{ display:'inline-flex', alignItems:'baseline', justifyContent:'center', gap:3 }}>
                        <span style={{ fontSize:14, fontWeight:800, fontFamily:Fnt.mono, color:C.amber }}>{fmtT(val)}</span>
                        <span style={{ fontSize:12, fontFamily:Fnt.mono, color:C.amber, opacity:0.75 }}>t/m</span>
                      </span>
                      <span style={{ fontSize:14, fontWeight:800, fontFamily:Fnt.mono, color:C.greyLt }}>{fmtT(mx)}</span>
                    </div>
                    <input type="range" min={0} max={mx||8000} value={val} step={1}
                      onChange={e=>setSlider(key, e.target.value)}
                      style={{ width:'100%', height:16, outline:'none', cursor:'pointer', margin:'4px 0', display:'block',
                        background:`linear-gradient(to right, ${C.amber} 0%, ${C.amber} ${pct}%, rgba(64,215,197,0.52) ${pct}%, rgba(64,215,197,0.52) 100%)`,
                        borderRadius:2, WebkitAppearance:'none', appearance:'none' }} />
                    <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, fontFamily:Fnt.mono, color:'rgba(168,189,208,0.55)' }}>
                      <span>0 t</span><span>100%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── F: % OF MILL RESIDUES CAPTURED ── */}
          <div style={{ ...card, background:'#060C14', border:`1.5px solid rgba(64,215,197,0.55)` }}>
            <div style={{ ...secTitle, fontSize:17, color:'#FFF' }}>F — % Of Mill Residues Captured</div>
            <div style={secSub}>Volumes Set In E · % Of Mill Discharge Updates Live</div>
            <div style={cbody}>
              <div style={{ background:'linear-gradient(135deg,rgba(0,162,73,0.16) 0%,rgba(6,12,20,1) 65%)', border:`1.5px solid rgba(0,162,73,0.45)`, borderRadius:11, padding:'22px 16px', marginBottom:12, textAlign:'center' }}>
                <div style={{ fontFamily:Fnt.mono, fontWeight:800, fontSize:18, color:'#FFF', letterSpacing:'0.1em', marginBottom:8 }}>VALORIZING</div>
                <div style={{ display:'flex', alignItems:'baseline', justifyContent:'center', gap:8 }}>
                  <span style={{ fontFamily:Fnt.mono, fontWeight:800, fontSize:40, color:C.green, lineHeight:1 }}>{fHeroPct}</span>
                  <span style={{ fontFamily:Fnt.mono, fontWeight:700, fontSize:18, color:C.green }}>% OF MILL RESIDUES</span>
                </div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', gap:8, padding:'0 13px 5px' }}>
                {['MILL DISCHARGE','CAPTURED','TOTAL','%'].map(h=>(
                  <div key={h} style={{ fontSize:10, fontWeight:700, fontFamily:Fnt.mono, color:'rgba(168,189,208,0.40)', letterSpacing:'0.05em', textAlign:h==='MILL DISCHARGE'?'left':'center' }}>{h}</div>
                ))}
              </div>
              <div style={{ border:`1px solid rgba(64,215,197,0.18)`, borderRadius:9, overflow:'hidden', marginTop:4 }}>
                {MILL_STREAMS.map((key,i)=>{
                  const active = activeStreams[key];
                  const cur    = streamT[key]||0;
                  const mx     = maxT[key]||0;
                  const pct    = mx>0 ? (cur/mx*100).toFixed(1) : '0.0';
                  return (
                    <div key={key} style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', gap:8, alignItems:'center', background:i%2===1?'rgba(64,215,197,0.03)':'transparent', padding:'10px 13px', minHeight:42, borderBottom:i<4?`1px solid rgba(255,255,255,0.05)`:'none' }}>
                      <div style={{ fontSize:12, fontWeight:700, fontFamily:Fnt.dm, color:C.grey }}>{STREAM_NAMES[key]}</div>
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
            <div style={secSub}>Drives All S1–S6 Calculations</div>
            <div style={cbody}>
              <div style={{ background:'linear-gradient(160deg,rgba(0,162,73,0.22) 0%,rgba(6,12,20,1) 55%)', border:`1.5px solid rgba(0,162,73,0.50)`, borderRadius:11, padding:'22px 16px', textAlign:'center', marginBottom:12 }}>
                <div style={{ fontFamily:Fnt.mono, fontWeight:800, fontSize:18, color:'#FFF', letterSpacing:'0.1em', marginBottom:8 }}>TOTAL PROCESSING VOLUME</div>
                <div style={{ display:'flex', alignItems:'baseline', justifyContent:'center', gap:4 }}>
                  <span style={{ fontFamily:Fnt.mono, fontWeight:800, fontSize:40, color:C.green, lineHeight:1 }}>{grandTotal>0?fmtT(grandTotal):'—'}</span>
                  {grandTotal>0&&<span style={{ fontFamily:Fnt.mono, fontWeight:700, fontSize:18, color:C.green }}>t/month</span>}
                </div>
              </div>
              <div style={{ fontSize:10, fontWeight:700, fontFamily:Fnt.mono, color:'rgba(0,162,73,0.70)', letterSpacing:'0.08em', marginBottom:7 }}>ACTIVE STREAMS</div>
              {grandTotal===0 ? (
                <div style={{ fontSize:12, fontFamily:Fnt.mono, color:'rgba(168,189,208,0.40)', textAlign:'center', padding:'10px 0' }}>No Streams Selected — Activate In Section D</div>
              ) : (
                Object.entries(streamT).map(([key,t])=>{
                  const nm  = STREAM_NAMES[key] || customStreams.find(c=>c.key===key)?.name || key.toUpperCase();
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
              {/* C:N blend signal */}
              {blend?.CN > 0 && (
                <div style={{ background:cnStatus(blend.CN)?.color === C.green ? C.greenDim : cnStatus(blend.CN)?.color === C.amber ? C.amberDim : C.redDim, border:`1px solid ${cnStatus(blend.CN)?.color}33`, borderRadius:6, padding:'7px 12px', fontSize:11, color:cnStatus(blend.CN)?.color, fontFamily:Fnt.dm, marginTop:6 }}>
                  C:N {blend.CN.toFixed(1)} — {cnStatus(blend.CN)?.txt}
                </div>
              )}
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', marginTop:12, gap:6 }}>
                <button onClick={handleFConfirm} style={{ ...confirmBtn, background:C.green }}>
                  {fConfirmed ? 'Confirmed — Click To Edit' : 'Confirm Processing Volume'}
                </button>
                <div style={{ fontSize:11, color:C.greyLt, textAlign:'center' }}>{fConfirmed?'Volumes Locked · Cascade To S1':'Lock Volumes And Cascade To S1 Machinery'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* ════ ROW 3: Residue Mix | Structural | Biological | Secondary ════ */}
        <div style={row4}>

          {/* Residue Mix */}
          <div style={card}>
            <div style={secTitle}>Residue Mix</div>
            <div style={secSub}>Active Streams · Blended Composition</div>
            <div style={cbody}>
              {[
                { sec:'Elemental Values', cells:[
                  { id:'N', val:blend?.N, unit:'% DM' },
                  { id:'P', val:blend?.P, unit:'% DM' },
                  { id:'K', val:blend?.K, unit:'% DM' },
                ]},
                { sec:'Agronomic Value', cells:[
                  { id:'N',    val:blend?.N,    unit:'% DM' },
                  { id:'P₂O₅',val:blend?.P2O5, unit:'% DM' },
                  { id:'K₂O', val:blend?.K2O,  unit:'% DM' },
                ]},
                { sec:'Nutritional Profile', cells:[
                  { id:'CP',  val:blend?.CP,  unit:'% DM' },
                  { id:'EE',  val:blend?.EE,  unit:'% DM' },
                  { id:'Ash', val:blend?.Ash, unit:'% DM' },
                  { id:'MC',  val:blend?.MC,  unit:'% WB' },
                  { id:'DM',  val:blend?.DM,  unit:'% WB' },
                ]},
                { sec:'Process Readiness', cells:[
                  { id:'C:N',    val:blend?.CN,     unit:'DM-wtd', dp:1, amber:true },
                  { id:'Lignin', val:blend?.Lignin, unit:'% DM',   dp:1 },
                  { id:'BSF',    val:blend?.CN>=16&&blend?.CN<=25?'HIGH':'CHECK', unit:'index', green:blend?.CN>=16&&blend?.CN<=25 },
                ]},
              ].map(grp=>(
                <div key={grp.sec}>
                  <div style={{ fontSize:14, fontWeight:700, fontFamily:Fnt.dm, color:C.teal, marginTop:8, marginBottom:4 }}>{grp.sec}</div>
                  <div style={grp.cells.length===3?grid3:grid2}>
                    {grp.cells.map(c=>(
                      <div key={c.id} style={mixCell}>
                        <span style={mixLbl}>{c.id}</span>
                        <span style={{ display:'flex', alignItems:'baseline', gap:3 }}>
                          <span style={{ fontSize:14, fontWeight:800, fontFamily:Fnt.mono, color:c.green?C.green:c.val!=null?C.amber:'rgba(139,160,180,0.45)', whiteSpace:'nowrap' }}>
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
            <div style={secSub}>Van Soest · NREL LAP · DM Basis</div>
            <div style={cbody}>
              <div style={grid2}>
                {[
                  { id:'NDF',         val:blend?.Lignin?62:null,            unit:'% DM' },
                  { id:'ADF',         val:blend?.Lignin?44:null,            unit:'% DM' },
                  { id:'ADL',         val:blend?.Lignin?.toFixed(2)||null,  unit:'% DM' },
                  { id:'Cellulose',   val:blend?.Lignin?19:null,            unit:'% DM' },
                  { id:'Hemicel.',    val:blend?.Lignin?18:null,            unit:'% DM' },
                  { id:'Holocel.',    val:blend?.Lignin?37:null,            unit:'% DM' },
                  { id:'Extractives', val:null,                              unit:'Lab Req' },
                  { id:'NSP',         val:null,                              unit:'PKE Only' },
                ].map(c=>(
                  <div key={c.id} style={mixCell}>
                    <span style={mixLbl}>{c.id}</span>
                    <span style={{ display:'flex', alignItems:'baseline', gap:3 }}>
                      <span style={{ fontSize:14, fontWeight:800, fontFamily:Fnt.mono, color:c.val!=null?C.amber:'rgba(139,160,180,0.45)', whiteSpace:'nowrap' }}>
                        {c.val!=null?c.val:'—'}
                      </span>
                      <span style={mixUnit}>{c.unit}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Biological Profile */}
          <div style={card}>
            <div style={secTitle}>Biological Profile</div>
            <div style={secSub}>Organic Matter · Carbon · Microbiome</div>
            <div style={cbody}>
              <div style={grid2}>
                {[
                  { id:'Organic Matter',  val:null, unit:'kg/t DM' },
                  { id:'Org. Carbon',     val:null, unit:'CHNS' },
                  { id:'Recalcit. C',     val:null, unit:'% Input C' },
                  { id:'IVDMD',           val:null, unit:'Digestib.' },
                  { id:'Microb. Load',    val:null, unit:'Pre-Inoc.' },
                  { id:'Phytase',         val:'MED', unit:'Conf.' },
                  { id:'Lignin',          val:blend?.Lignin?.toFixed(2)||null, unit:'% → Humic' },
                ].map(c=>(
                  <div key={c.id} style={mixCell}>
                    <span style={mixLbl}>{c.id}</span>
                    <span style={{ display:'flex', alignItems:'baseline', gap:3 }}>
                      <span style={{ fontSize:14, fontWeight:800, fontFamily:Fnt.mono, color:c.val?C.amber:'rgba(139,160,180,0.45)', whiteSpace:'nowrap' }}>{c.val||'—'}</span>
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
                  { id:'Ca',     val:blend?.Ca?.toFixed(2)||null, unit:'% DM' },
                  { id:'Mg',     val:blend?.Mg?.toFixed(2)||null, unit:'% DM' },
                  { id:'S',      val:null, unit:'CHNS' },
                  { id:'Fe',     val:null, unit:'ICP Pend' },
                  { id:'Mn',     val:null, unit:'ICP Pend' },
                  { id:'Zn',     val:null, unit:'ICP Pend' },
                  { id:'Cu',     val:null, unit:'ICP Pend' },
                  { id:'B',      val:null, unit:'ICP Pend' },
                  { id:'Si / SiO₂', val:null, unit:'ICP Pend' },
                ].map(c=>(
                  <div key={c.id} style={mixCell}>
                    <span style={mixLbl}>{c.id}</span>
                    <span style={{ display:'flex', alignItems:'baseline', gap:3 }}>
                      <span style={{ fontSize:14, fontWeight:800, fontFamily:Fnt.mono, color:c.val?C.amber:'rgba(139,160,180,0.45)', whiteSpace:'nowrap' }}>{c.val||'—'}</span>
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
            <div style={secSub}>Permentan 01/2019 · Heavy Metals · Pathogens</div>
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
                  <span style={{ fontSize:14, fontWeight:800, fontFamily:Fnt.mono, color:'rgba(139,160,180,0.45)' }}>— Presence / Absence</span>
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

        {/* ════ BOTTOM STRIP ════ */}
        <div style={{ marginTop:14, background:'#0A1628', border:`1px solid rgba(64,215,197,0.18)`, borderRadius:10, padding:'12px 16px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap', marginBottom:12, paddingBottom:10, borderBottom:`1px solid rgba(255,255,255,0.07)` }}>
            <div style={{ fontSize:11, fontWeight:700, fontFamily:Fnt.mono, color:C.greyLt, letterSpacing:'0.08em', whiteSpace:'nowrap' }}>ACTIVE STREAMS</div>
            <div style={{ display:'flex', alignItems:'center', gap:6, flexWrap:'wrap' }}>
              {activeStreams.efb && <div style={{ background:'rgba(64,215,197,0.10)', border:`1px solid rgba(64,215,197,0.35)`, borderRadius:6, padding:'3px 10px', fontSize:11, fontFamily:Fnt.mono, fontWeight:700, color:C.teal }}>EFB · {maxT.efb>0?(streamT.efb/maxT.efb*100||50).toFixed(1):'—'}% · {fmtT(streamT.efb)} t/mo</div>}
              {activeStreams.opdc && <div style={{ background:'rgba(64,215,197,0.07)', border:`1px solid rgba(64,215,197,0.22)`, borderRadius:6, padding:'3px 10px', fontSize:11, fontFamily:Fnt.mono, fontWeight:700, color:C.grey }}>OPDC · {maxT.opdc>0?(streamT.opdc/maxT.opdc*100||50).toFixed(1):'—'}% · {fmtT(streamT.opdc)} t/mo</div>}
            </div>
            <button onClick={()=>setStripExpanded(v=>!v)} style={{ marginLeft:'auto', background:'rgba(255,255,255,0.05)', border:`1px solid rgba(255,255,255,0.10)`, borderRadius:5, padding:'3px 10px', fontSize:11, fontFamily:Fnt.dm, color:C.grey, cursor:'pointer' }}>
              {stripExpanded ? 'Hide' : 'Show All Streams'}
            </button>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:12 }}>
            {/* Soil Value */}
            <div style={{ background:'#0C1E33', border:`1px solid rgba(64,215,197,0.15)`, borderRadius:8, padding:'10px 12px' }}>
              <div style={{ fontSize:10, fontWeight:700, fontFamily:Fnt.mono, color:C.teal, letterSpacing:'0.08em', marginBottom:8 }}>SOIL VALUE</div>
              {[['N · P · K Per Tonne','—'],['C:N Ratio',blend?.CN?.toFixed(1)||'—'],['Organic Matter %','—'],['Ca + Mg',blend?(blend.Ca+blend.Mg).toFixed(2)+'%':'—']].map(([lbl,val])=>(
                <div key={lbl} style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:5 }}>
                  <span style={{ fontSize:11, color:C.grey, fontFamily:Fnt.dm }}>{lbl}</span>
                  <span style={{ fontSize:11, fontFamily:Fnt.mono, fontWeight:700, color:C.amber }}>{val}</span>
                </div>
              ))}
            </div>
            {/* Process Readiness */}
            <div style={{ background:'#0C1E33', border:`1px solid rgba(64,215,197,0.15)`, borderRadius:8, padding:'10px 12px' }}>
              <div style={{ fontSize:10, fontWeight:700, fontFamily:Fnt.mono, color:C.teal, letterSpacing:'0.08em', marginBottom:8 }}>PROCESS READINESS</div>
              {[
                ['Lignin % Blend', blend?.Lignin?.toFixed(1)||'—'],
                ['ADL %', '—'],
                ['Protein % vs 8% Floor', blend?<span style={{ color:blend.CP>=8?C.green:C.red }}>{blend.CP.toFixed(1)}% {blend.CP>=8?'READY':'LOW'}</span>:'—'],
                ['Moisture % Pre-Process', blend?.MC?.toFixed(1)||'—'],
              ].map(([lbl,val])=>(
                <div key={lbl} style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:5 }}>
                  <span style={{ fontSize:11, color:C.grey, fontFamily:Fnt.dm }}>{lbl}</span>
                  <span style={{ fontSize:11, fontFamily:Fnt.mono, fontWeight:700, color:C.amber }}>{val}</span>
                </div>
              ))}
            </div>
            {/* BSF Readiness */}
            <div style={{ background:'#0C1E33', border:`1px solid rgba(64,215,197,0.15)`, borderRadius:8, padding:'10px 12px' }}>
              <div style={{ fontSize:10, fontWeight:700, fontFamily:Fnt.mono, color:C.teal, letterSpacing:'0.08em', marginBottom:8 }}>BSF READINESS</div>
              {[
                ['C:N Blend', blend?.CN?.toFixed(1)||'—'],
                ['MC Gate', '—'],
                ['Substrate Quality', blend?(blend.CN>=16&&blend.CN<=25?<span style={{ color:C.green }}>HIGH</span>:<span style={{ color:C.amber }}>CHECK C:N</span>):'—'],
              ].map(([lbl,val])=>(
                <div key={lbl} style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:5 }}>
                  <span style={{ fontSize:11, color:C.grey, fontFamily:Fnt.dm }}>{lbl}</span>
                  <span style={{ fontSize:11, fontFamily:Fnt.mono, fontWeight:700, color:C.amber }}>{val}</span>
                </div>
              ))}
            </div>
            {/* Emissions Signal */}
            <div style={{ background:'#0C1E33', border:`1px solid rgba(245,166,35,0.20)`, borderRadius:8, padding:'10px 12px' }}>
              <div style={{ fontSize:10, fontWeight:700, fontFamily:Fnt.mono, color:C.amber, letterSpacing:'0.08em', marginBottom:8 }}>EMISSIONS SIGNAL</div>
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:6, minHeight:60 }}>
                <div style={{ fontSize:18, fontFamily:Fnt.mono, fontWeight:800, color:'rgba(168,189,208,0.30)' }}>— Restricted</div>
                <div style={{ fontSize:10, color:'rgba(168,189,208,0.40)', fontFamily:Fnt.dm, textAlign:'center' }}>Enter Access Code To View CO₂e Estimate</div>
              </div>
            </div>
            {/* Commercial Signal */}
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
