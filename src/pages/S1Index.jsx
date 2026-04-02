import { useNavigate } from "react-router-dom";
import { Download } from "lucide-react";
import { toast } from "sonner";

const C = {
  navy: '#060C14', navyMid: '#0A1628', navyCard: '#111E33', navyField: '#142030',
  teal: '#40D7C5', tealDim: 'rgba(64,215,197,0.12)', tealBdr: 'rgba(64,215,197,0.60)',
  amber: '#F5A623', amberDim: 'rgba(245,166,35,0.14)',
  green: '#00A249', greenDim: 'rgba(0,162,73,0.13)',
  red: '#E84040', redDim: 'rgba(232,64,64,0.13)',
  grey: '#A8BDD0', greyLt: 'rgba(168,189,208,0.75)', white: '#E8F0FE',
  bdrIdle: 'rgba(255,255,255,0.06)', bdrCalc: 'rgba(139,160,180,0.18)',
};
const Fnt = {
  syne: "'Syne', sans-serif", dm: "'DM Sans', sans-serif",
  mono: "'DM Mono', monospace", brand: "'EB Garamond', serif",
};

const navCards = [
  { title: "CapEx / OpEx / Facility", desc: "Building CAPEX $1.37M \u00b7 Equipment $398K \u00b7 OpEx $37,957/mo", route: "/s1-capex-opex", live: true },
  { title: "Efb Floor Plan", desc: "10-node mechanical line \u00b7 212 kW \u00b7 8 t/h \u00b7 600mm belt", route: "/s1-floor-efb", live: true },
  { title: "Opdc Floor Plan", desc: "10-node mechanical line \u00b7 206 kW \u00b7 5 t/h \u00b7 500mm belt", route: "/s1-floor-opdc", live: true },
  { title: "Pos Floor Plan", desc: "10-node liquid/semi line \u00b7 113 kW \u00b7 6 m\u00b3/h", route: "/s1-floor-pos", live: true },
  { title: "S0 Residue Selector", desc: "S0 exit stage \u2014 select residue for S1 processing", route: "/s0-residue-select", live: true },
  { title: "Efb Ascii Flow", desc: "10-node mechanical line \u00b7 298 kW \u00b7 20 t/h", route: "/s1-efb-ascii", live: true },
  { title: "Opdc Ascii Flow", desc: "10-node mechanical line \u00b7 206 kW \u00b7 5 t/h", route: "/s1-opdc-ascii", live: true },
  { title: "Pos Ascii Flow", desc: "4-node pre-skimming \u00b7 62 kW \u00b7 1.25 t/h", route: "/s1-pos-ascii", live: true },
  { title: "Combined Floor Plans", desc: "Tabbed floor plans \u00b7 Efb \u00b7 Opdc \u00b7 Pos", route: "/s1-combined", live: true },
  { title: "S1 Engineering Complete", desc: "24 equipment nodes \u00b7 3 processing lines \u00b7 Capex + Opex + Greenhouse + Guardrails", route: "/s1-engineering", live: true },
  { title: "Greenhouse Design", desc: "4 greenhouses \u00b7 40m \u00d7 8m \u00b7 2\u00d72 grid layout", route: "/s1-greenhouse", live: false },
];

const streams = [
  { name: "EFB", color: C.teal, fresh: "300 t/day", dm: "112 t/day", mc: "62.5%" },
  { name: "OPDC", color: C.amber, fresh: "45 t/day", dm: "13.5 t/day", mc: "70%" },
  { name: "POS", color: "#3B82F6", fresh: "30 t/day", dm: "6 t/day", mc: "82%" },
];

const canonicalValues = [
  { label: "FFB Capacity", value: "60 TPH" },
  { label: "Operating", value: "20 hr/day" },
  { label: "EFB Yield", value: "22% of FFB" },
  { label: "OPDC Yield", value: "15.2% of EFB" },
  { label: "POS Volume", value: "30 t/day" },
  { label: "Belt Width", value: "600mm (EFB), 500mm (OPDC)" },
  { label: "DM Target", value: "30% wb" },
  { label: "Lignin Gate", value: "ADL <12% DM" },
];

const guardrails = [
  "MC >=40% LOCKED (CLASS A)",
  "Fe <3000 mg/kg DM target",
  "ADL <12% DM for BSF",
  "C:N 15-22 optimal",
  "pH 4.0-5.0 range",
  "CEC >20 cmol/kg target",
  "No Cr >20 mg/kg",
  "Belt speed locked at spec",
  "All temps <85C",
];

export default function S1Index() {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: Fnt.dm, color: C.white, minHeight: "100vh", background: C.navy }}>
      {/* ═══ S0 GLOBAL HEADER ═══ */}
      <div style={{ background:C.navyMid, display:'flex', alignItems:'center', padding:'0 28px', height:80, gap:18, position:'sticky', top:0, zIndex:100 }}>
        <div style={{ display:'flex', alignItems:'center', flexShrink:0, maxWidth:340 }}>
          <div>
            <div style={{ display:'flex', alignItems:'baseline' }}>
              <span style={{ fontFamily:Fnt.brand, fontWeight:700, fontSize:26, color:'#FFF', letterSpacing:'0.02em' }}>CFI</span>
              <span style={{ fontFamily:Fnt.brand, fontSize:22, color:'rgba(255,255,255,0.25)', margin:'0 8px' }}>·</span>
              <span style={{ fontFamily:Fnt.brand, fontWeight:700, fontSize:20, color:C.teal, letterSpacing:'0.10em' }}>DEEP TECH</span>
            </div>
            <div style={{ fontSize:11, color:C.teal, marginTop:4, fontFamily:Fnt.dm }}>Soil Microbiome Engineering &amp; Biofertiliser Production for Closed‑Loop Nutrient Recycling</div>
          </div>
        </div>
        <div style={{ display:'flex', gap:4, marginLeft:'auto', alignItems:'center', flexShrink:0 }}>
          {['S0','S1','S2','S3','S4','S5','S6','CAPEX','\u03A3'].map((s,i)=>(
            <div key={s} style={{ background:i===1?C.teal:'rgba(168,189,208,0.09)', border:`1px solid ${i===1?C.teal:'rgba(168,189,208,0.18)'}`, borderRadius:4, padding:'3px 9px', fontFamily:Fnt.mono, fontSize:11, fontWeight:700, color:i===1?C.navy:C.grey, cursor:'pointer' }}>{s}</div>
          ))}
        </div>
      </div>

      {/* ═══ PAGE CONTENT ═══ */}
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "24px 20px 60px" }}>

        {/* ── Breadcrumb ── */}
        <div style={{ fontSize: 13, fontFamily: Fnt.dm, marginBottom: 20 }}>
          <a href="/" style={{ color: C.grey, textDecoration: "none" }}
            onMouseEnter={e => e.currentTarget.style.color = C.teal}
            onMouseLeave={e => e.currentTarget.style.color = C.grey}>CFI Platform</a>
          <span style={{ color: 'rgba(168,189,208,0.4)', margin: "0 8px" }}>/</span>
          <span style={{ color: C.white, fontWeight: 700 }}>S1 Pre-Processing</span>
        </div>

        {/* ── Page Title ── */}
        <h1 style={{ fontFamily: Fnt.syne, fontSize: 28, fontWeight: 700, color: C.white, margin: "0 0 12px" }}>
          S1 Pre-Processing
        </h1>

        {/* ── Subtitle Bar ── */}
        <div style={{
          background: C.navyCard, borderRadius: 6, padding: "12px 20px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: 8, marginBottom: 20,
          border: `1px solid ${C.bdrIdle}`,
        }}>
          <div style={{ fontFamily: Fnt.dm, fontSize: 14, fontWeight: 500, color: C.greyLt, display: "flex", flexWrap: "wrap", gap: 4 }}>
            <span>Mill Size: <strong style={{ fontWeight: 700, color: C.white }}>60 ton/hour</strong></span>
            <span style={{ color: 'rgba(168,189,208,0.4)' }}>&middot;</span>
            <span>Utilisation: <strong style={{ fontWeight: 700, color: C.white }}>85%</strong></span>
            <span style={{ color: 'rgba(168,189,208,0.4)' }}>&middot;</span>
            <span>Operating: <strong style={{ fontWeight: 700, color: C.white }}>20 hr/day &middot; 30 days/mo</strong></span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontFamily: Fnt.dm, fontSize: 14, fontWeight: 400, color: C.grey }}>Bogor, West Java</span>
            <span style={{
              fontFamily: Fnt.mono, fontSize: 11, fontWeight: 600, color: C.teal,
              background: C.tealDim, padding: "2px 8px", borderRadius: 4,
            }}>Reference Site</span>
          </div>
        </div>

        {/* ── Throughput Cards ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 28 }}>
          {streams.map(s => (
            <div key={s.name} style={{
              background: C.navyCard, border: `1px solid ${C.bdrIdle}`, borderRadius: 8, padding: 16,
              borderLeft: `4px solid ${s.color}`,
            }}>
              <div style={{ fontFamily: Fnt.syne, fontSize: 14, fontWeight: 700, color: C.white, marginBottom: 10 }}>{s.name}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
                {[
                  ["DAILY FRESH", s.fresh],
                  ["DAILY DM", s.dm],
                  ["MC", s.mc],
                ].map(([label, val]) => (
                  <div key={label}>
                    <div style={{ fontFamily: Fnt.dm, fontSize: 11, fontWeight: 500, color: C.grey, textTransform: "uppercase", letterSpacing: ".04em" }}>{label}</div>
                    <div style={{ fontFamily: Fnt.mono, fontSize: 13, fontWeight: 400, color: C.white, marginTop: 2 }}>{val}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ── Quick Nav Cards ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 28 }}>
          {navCards.map(card => (
            <div
              key={card.title}
              onClick={() => {
                if (card.live) navigate(card.route);
                else toast("Coming soon", { duration: 2000 });
              }}
              style={{
                background: C.navyCard, border: `1px solid ${C.bdrIdle}`, borderRadius: 8, padding: 20,
                cursor: card.live ? "pointer" : "default",
                opacity: card.live ? 1 : 0.5,
                display: "flex", justifyContent: "space-between", alignItems: "center",
                transition: "border-color 0.15s, box-shadow 0.15s",
              }}
              onMouseEnter={e => { if (card.live) { e.currentTarget.style.borderColor = C.tealBdr; e.currentTarget.style.boxShadow = `0 2px 12px ${C.tealDim}`; } }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.bdrIdle; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div>
                <div style={{ fontFamily: Fnt.syne, fontSize: 16, fontWeight: 700, color: C.white }}>{card.title}</div>
                <div style={{ fontFamily: Fnt.dm, fontSize: 13, fontWeight: 400, color: C.grey, marginTop: 4 }}>{card.desc}</div>
              </div>
              <span style={{ fontSize: 18, color: C.grey, flexShrink: 0, marginLeft: 12 }}>&rsaquo;</span>
            </div>
          ))}
        </div>

        {/* ═══ CANONICAL VALUES REFERENCE ═══ */}
        <div style={{ background: C.navyCard, border: `1px solid ${C.bdrIdle}`, borderRadius: 8, padding: 20, marginBottom: 14 }}>
          <div style={{ fontFamily: Fnt.syne, fontSize: 14, fontWeight: 700, color: C.white, marginBottom: 12 }}>Canonical Values Reference</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10 }}>
            {canonicalValues.map((cv, i) => (
              <div key={i} style={{ border: `1px solid ${C.bdrCalc}`, borderRadius: 4, padding: "8px 10px", background: C.navyField }}>
                <div style={{ fontFamily: Fnt.dm, fontSize: 10, color: C.grey }}>{cv.label}</div>
                <div style={{ fontFamily: Fnt.mono, fontSize: 12, fontWeight: 700, color: C.white, marginTop: 2 }}>{cv.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ RFQ PACK ═══ */}
        <div style={{ background: C.navyCard, border: `1px solid ${C.bdrIdle}`, borderRadius: 8, padding: 20, marginBottom: 14 }}>
          <div style={{ border: `1.5px solid ${C.tealBdr}`, borderRadius: 6, padding: "20px 24px", background: C.navyField }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <Download size={18} color={C.teal} />
              <div style={{ fontFamily: Fnt.mono, fontSize: 10, fontWeight: 700, color: C.teal, textTransform: "uppercase", letterSpacing: "0.06em" }}>Engineering Specs</div>
            </div>
            <div style={{ fontFamily: Fnt.syne, fontSize: 18, fontWeight: 700, color: C.white, marginBottom: 6 }}>S1 Complete Engineering Specs — RFQ Pack</div>
            <div style={{ fontFamily: Fnt.dm, fontSize: 12, color: C.grey, lineHeight: 1.5, marginBottom: 16 }}>
              22-page complete engineering documentation for all 3 processing lines (EFB, OPDC, POS). Ready for RFQ pack assembly and contractor bidding.
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <a
                href="https://lcpbtnipkvrmuwllymfw.supabase.co/storage/v1/object/public/documents/CFI_S1_Engineering_Complete.pdf"
                target="_blank" rel="noopener noreferrer"
                style={{
                  fontFamily: Fnt.mono, fontSize: 12, fontWeight: 700, padding: "8px 20px",
                  background: C.teal, color: C.navy, borderRadius: 4, textDecoration: "none",
                  display: "inline-flex", alignItems: "center", gap: 6,
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = 0.85}
                onMouseLeave={e => e.currentTarget.style.opacity = 1}
              >
                <Download size={14} /> View PDF &rarr;
              </a>
              <a
                href="https://lcpbtnipkvrmuwllymfw.supabase.co/storage/v1/object/public/documents/CFI_S1_Engineering_Complete.pdf"
                target="_blank" rel="noopener noreferrer"
                onClick={e => {
                  e.preventDefault();
                  const w = window.open(e.currentTarget.href, '_blank');
                  if (w) { w.onload = () => { w.print(); }; }
                }}
                style={{
                  fontFamily: Fnt.mono, fontSize: 12, fontWeight: 700, padding: "8px 20px",
                  background: "transparent", color: C.teal, borderRadius: 4, textDecoration: "none",
                  border: `1.5px solid ${C.tealBdr}`, display: "inline-flex", alignItems: "center", gap: 6,
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = 0.85}
                onMouseLeave={e => e.currentTarget.style.opacity = 1}
              >
                Print
              </a>
            </div>
          </div>
        </div>

        {/* ═══ GUARDRAILS ═══ */}
        <div style={{ background: C.navyCard, border: `1px solid ${C.redDim}`, borderRadius: 8, padding: "16px 20px" }}>
          <div style={{ fontFamily: Fnt.syne, fontSize: 12, fontWeight: 700, color: C.red, marginBottom: 8 }}>9 Hard Guardrails</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "4px 16px" }}>
            {guardrails.map((g, i) => (
              <div key={i} style={{ fontFamily: Fnt.mono, fontSize: 10, color: C.red, lineHeight: 1.6 }}>{g}</div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
