import { useState } from "react";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;600;700&family=DM+Mono:wght@500;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --navy:#0B1422;--navyMid:#153352;--navyLt:#1A3A5C;--navyDk:#070D16;
  --teal:#00C9B1;--amber:#F5A623;--amberLt:#FFD080;
  --red:#E84040;--green:#3DCB7A;--blue:#4A9EDB;--purple:#9B59B6;
  --white:#F0F4F8;--grey:#8BA0B4;--greyLt:#C4D3E0;--greyMd:#A8B8C7;
  --pastelGreen:#A8E6C1;--border:#1E6B8C;
}
body{font-family:'DM Sans',sans-serif;background:#070D16;color:var(--white);min-height:100vh;font-size:14px;overflow-x:hidden}

.stage-hdr{background:var(--navyMid);border-bottom:1.5px solid var(--border);padding:16px 28px;display:flex;align-items:center;justify-content:space-between;gap:16px;position:sticky;top:0;z-index:300}
.stage-badge{display:flex;align-items:center;gap:14px}
.stage-num{width:48px;height:48px;border-radius:10px;background:rgba(0,201,177,.15);border:2px solid var(--teal);display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-weight:700;font-size:18px;color:var(--teal);flex-shrink:0}
.stage-title{font-family:'Syne',sans-serif;font-weight:700;font-size:18px;color:var(--white);line-height:1.2}
.stage-sub{font-family:'DM Sans',sans-serif;font-size:11px;color:var(--grey);margin-top:3px}
.stage-hdr-right{display:flex;gap:10px;align-items:center;flex-wrap:wrap}
.bdg{font-family:'Syne',sans-serif;font-weight:700;font-size:10px;padding:4px 12px;border-radius:20px;border:1px solid;white-space:nowrap}
.bdg-t{background:rgba(0,201,177,.08);color:var(--teal);border-color:var(--teal)}
.bdg-a{background:rgba(245,166,35,.08);color:var(--amber);border-color:var(--amber)}
.bdg-g{background:rgba(61,203,122,.08);color:var(--green);border-color:var(--green)}
.bdg-r{background:rgba(232,64,64,.08);color:var(--red);border-color:var(--red)}

.breadcrumb{display:flex;align-items:center;gap:0;padding:8px 28px;background:rgba(0,0,0,.3);border-bottom:1px solid rgba(30,107,140,.25);overflow-x:auto;scrollbar-width:none}
.breadcrumb::-webkit-scrollbar{display:none}
.bc-item{display:flex;align-items:center;gap:8px;white-space:nowrap}
.bc-stage{font-family:'DM Mono',monospace;font-size:11px;font-weight:700;padding:3px 10px;border-radius:4px}
.bc-done{background:rgba(61,203,122,.1);color:var(--green);border:1px solid rgba(61,203,122,.3)}
.bc-active{background:rgba(0,201,177,.15);color:var(--teal);border:1px solid var(--teal)}
.bc-pending{background:rgba(139,160,180,.06);color:var(--grey);border:1px solid rgba(139,160,180,.2)}
.bc-arrow{color:rgba(30,107,140,.6);font-size:14px;margin:0 4px}

.handoff-banner{margin:20px 28px 0;padding:14px 18px;background:rgba(61,203,122,.06);border:1.5px solid rgba(61,203,122,.3);border-radius:8px;display:flex;align-items:center;gap:18px;flex-wrap:wrap}
.ho-label{font-family:'DM Sans',sans-serif;font-weight:700;font-size:11px;color:var(--green);text-transform:uppercase;letter-spacing:.5px;white-space:nowrap}
.ho-pills{display:flex;gap:8px;flex-wrap:wrap}
.ho-pill{display:flex;flex-direction:column;align-items:center;background:var(--navyDk);border:1px solid rgba(30,107,140,.4);border-radius:6px;padding:6px 14px}
.ho-val{font-family:'DM Mono',monospace;font-weight:700;font-size:15px;color:var(--amber)}
.ho-unit{font-family:'DM Sans',sans-serif;font-size:9px;color:var(--grey);margin-top:1px}

.content{padding:20px 28px 48px}

.sec-title{font-family:'Syne',sans-serif;font-weight:700;font-size:13px;color:var(--grey);text-transform:uppercase;letter-spacing:.6px;margin:28px 0 12px;display:flex;align-items:center;gap:8px}
.sec-title::before{content:'';width:3px;height:14px;border-radius:2px;display:inline-block}
.st-teal::before{background:var(--teal)}
.st-amber::before{background:var(--amber)}
.st-green::before{background:var(--green)}
.st-red::before{background:var(--red)}

.module-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:14px}
.module-btn{background:var(--navyMid);border:1.5px solid var(--border);border-radius:10px;padding:18px 20px;cursor:pointer;transition:all .2s;display:flex;flex-direction:column;gap:10px;text-align:left;position:relative;overflow:hidden}
.module-btn::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:var(--accent,var(--teal))}
.module-btn:hover{border-color:var(--accent,var(--teal));background:rgba(21,51,82,.9);transform:translateY(-1px);box-shadow:0 6px 24px rgba(0,0,0,.4)}
.mb-icon{width:40px;height:40px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0}
.mb-num{font-family:'DM Mono',monospace;font-weight:700;font-size:11px;color:var(--grey);margin-bottom:2px}
.mb-title{font-family:'Syne',sans-serif;font-weight:700;font-size:14px;color:var(--white);line-height:1.3}
.mb-desc{font-family:'DM Sans',sans-serif;font-size:11px;color:var(--greyMd);line-height:1.6}
.mb-tags{display:flex;gap:5px;flex-wrap:wrap;margin-top:2px}
.mb-tag{font-family:'DM Sans',sans-serif;font-size:9px;font-weight:700;padding:2px 7px;border-radius:20px;border:1px solid rgba(30,107,140,.4);color:var(--grey);background:rgba(30,107,140,.1)}
.mb-status{position:absolute;top:12px;right:14px;font-family:'DM Sans',sans-serif;font-weight:700;font-size:9px;padding:2px 8px;border-radius:20px}
.ms-live{background:rgba(61,203,122,.15);color:var(--green);border:1px solid rgba(61,203,122,.3)}
.ms-db{background:rgba(0,201,177,.1);color:var(--teal);border:1px solid rgba(0,201,177,.3)}
.ms-new{background:rgba(74,158,219,.1);color:var(--blue);border:1px solid rgba(74,158,219,.3)}

.metrics-strip{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:10px;margin-bottom:24px}
.metric{background:var(--navyMid);border:1.5px solid var(--border);border-radius:8px;padding:12px 16px}
.metric-lbl{font-family:'DM Sans',sans-serif;font-weight:700;font-size:10px;color:var(--grey);text-transform:uppercase;letter-spacing:.5px;margin-bottom:5px}
.metric-val{font-family:'DM Mono',monospace;font-weight:700;font-size:18px;color:var(--amber)}
.metric-unit{font-family:'DM Sans',sans-serif;font-size:10px;color:var(--greyMd);margin-top:2px}

.gate-strip{display:flex;gap:10px;flex-wrap:wrap;padding:14px 18px;background:rgba(0,0,0,.3);border:1.5px solid var(--border);border-radius:8px;margin-top:10px}
.gate-item{display:flex;align-items:center;gap:8px}
.gate-icon{font-size:14px}
.gate-lbl{font-family:'DM Sans',sans-serif;font-size:12px;color:var(--greyLt)}
.gate-val{font-family:'DM Mono',monospace;font-weight:700;font-size:12px;color:var(--grey)}
.gate-sep{width:1px;height:20px;background:rgba(30,107,140,.3)}

.protocol-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:10px}
.protocol-btn{background:var(--navyDk);border:1.5px solid var(--border);border-radius:8px;padding:14px 16px;cursor:pointer;transition:all .18s}
.protocol-btn:hover,.protocol-btn.sel{border-color:var(--teal);background:rgba(0,201,177,.06)}
.pb-name{font-family:'Syne',sans-serif;font-weight:700;font-size:13px;color:var(--white);margin-bottom:4px}
.pb-cost{font-family:'DM Mono',monospace;font-weight:700;font-size:16px;color:var(--amber);margin-bottom:6px}
.pb-desc{font-family:'DM Sans',sans-serif;font-size:11px;color:var(--greyMd);line-height:1.5}

.audit-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:10px;margin-top:10px}
.audit-card{background:var(--navyMid);border:1.5px solid var(--border);border-radius:8px;overflow:hidden}
.audit-hdr{padding:9px 14px;background:var(--navyLt);border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between}
.audit-tbl-name{font-family:'DM Mono',monospace;font-weight:700;font-size:12px;color:var(--teal)}
.audit-row-count{font-family:'DM Mono',monospace;font-size:10px;color:var(--grey)}
.audit-body{padding:10px 14px}
.af-row{display:flex;align-items:center;gap:8px;padding:4px 0;border-bottom:1px solid rgba(30,107,140,.15)}
.af-row:last-child{border-bottom:none}
.af-status{width:8px;height:8px;border-radius:50%;flex-shrink:0}
.af-s-ok{background:var(--green)}
.af-s-empty{background:var(--amber)}
.af-s-missing{background:var(--red)}
.af-name{font-family:'DM Mono',monospace;font-size:11px;color:var(--greyLt);flex:1}
.af-note{font-family:'DM Sans',sans-serif;font-size:10px;color:var(--grey)}

.missing-alert{margin-top:10px;padding:12px 16px;background:rgba(245,166,35,.07);border:1.5px solid rgba(245,166,35,.35);border-radius:8px}
.ma-title{font-family:'Syne',sans-serif;font-weight:700;font-size:12px;color:var(--amber);margin-bottom:8px}
.ma-list{display:grid;grid-template-columns:1fr 1fr;gap:4px 16px}
.ma-item{display:flex;align-items:center;gap:7px;font-family:'DM Sans',sans-serif;font-size:12px;color:var(--greyLt);padding:2px 0}
.ma-dot{width:6px;height:6px;border-radius:50%;background:var(--amber);flex-shrink:0}

/* ── section label ── */
.slbl{position:absolute;top:-9px;left:-5px;min-width:22px;height:18px;padding:0 5px;border-radius:9px;font-family:'DM Mono',monospace;font-weight:700;font-size:9px;line-height:18px;text-align:center;z-index:200;pointer-events:none;white-space:nowrap;background:#FFD600;color:#000}

.toggle-btn{position:fixed;bottom:16px;right:16px;z-index:999;background:var(--navyMid);border:1.5px solid var(--border);border-radius:10px;padding:8px 14px;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:11px;font-weight:700;color:var(--white);display:flex;align-items:center;gap:8px}
.toggle-btn:hover{border-color:var(--teal)}
`;

const S = ({ n }) => <span className="slbl">{n}</span>;

export default function App() {
  const [show, setShow] = useState(true);

  return (
    <>
      <style>{css}{show ? "" : ".slbl{display:none!important}"}</style>

      {/* ① STAGE HEADER */}
      <div className="stage-hdr" style={{ position: "relative" }}>
        {show && <S n="1" />}
        <div className="stage-badge">
          <div className="stage-num">S3</div>
          <div>
            <div className="stage-title">Biological Inoculation Stage</div>
            <div className="stage-sub">CFI Bioconversion Platform · 60 TPH FFB Mill · Bogor, West Java · v2.0 Mar 2026</div>
          </div>
        </div>
        <div className="stage-hdr-right">
          <span className="bdg bdg-t">21 Organisms + Enzymes + Algae</span>
          <span className="bdg bdg-a">8,157 t FW/month</span>
          <span className="bdg bdg-g">5-Day Bio Minimum</span>
          <span className="bdg bdg-r">Bt Conditional</span>
        </div>
      </div>

      {/* ② BREADCRUMB */}
      <div className="breadcrumb" style={{ position: "relative" }}>
        {show && <S n="2" />}
        <div className="bc-item">
          <span className="bc-stage bc-done">S0 · Site Config</span>
          <span className="bc-arrow">→</span>
          <span className="bc-stage bc-done">S1 · Mechanical</span>
          <span className="bc-arrow">→</span>
          <span className="bc-stage bc-done">S2 · Chemical (PKSA)</span>
          <span className="bc-arrow">→</span>
          <span className="bc-stage bc-active">S3 · Biological ← You Are Here</span>
          <span className="bc-arrow">→</span>
          <span className="bc-stage bc-pending">S4 · BSF Grow-Out</span>
          <span className="bc-arrow">→</span>
          <span className="bc-stage bc-pending">S5 · Harvest + Separate</span>
          <span className="bc-arrow">→</span>
          <span className="bc-stage bc-pending">S6 · Product + Carbon</span>
        </div>
      </div>

      {/* ③ S2 HANDOFF BANNER */}
      <div className="handoff-banner" style={{ position: "relative" }}>
        {show && <S n="3" />}
        <div className="ho-label">S2 Handoff Received</div>
        <div className="ho-pills">
          <div className="ho-pill"><div className="ho-val">8,157</div><div className="ho-unit">t FW/month substrate</div></div>
          <div className="ho-pill"><div className="ho-val">2,855</div><div className="ho-unit">t DM/month</div></div>
          <div className="ho-pill"><div className="ho-val">6.5–7.5</div><div className="ho-unit">pH (post-PKSA neutral)</div></div>
          <div className="ho-pill"><div className="ho-val">55–65%</div><div className="ho-unit">moisture (MC wb)</div></div>
          <div className="ho-pill"><div className="ho-val">EFB 60% + OPDC 40%</div><div className="ho-unit">blend by weight</div></div>
          <div className="ho-pill" style={{ borderColor: "rgba(0,201,177,.4)" }}><div className="ho-val" style={{ color: "var(--teal)" }}>PKSA Neutralised ✓</div><div className="ho-unit">24hr drain confirmed</div></div>
        </div>
      </div>

      <div className="content">

        {/* ④ QUICK METRICS */}
        <div className="metrics-strip" style={{ position: "relative" }}>
          {show && <S n="4" />}
          <div className="metric"><div className="metric-lbl">Protocol Cost</div><div className="metric-val">$0.65</div><div className="metric-unit">/ t FW (One-Shot)</div></div>
          <div className="metric"><div className="metric-lbl">Monthly Bio OpEx</div><div className="metric-val">$5,302</div><div className="metric-unit">One-Shot · 8,157 t FW</div></div>
          <div className="metric"><div className="metric-lbl">9-Org Monthly Cost</div><div className="metric-val">$29,035</div><div className="metric-unit">Premium stack</div></div>
          <div className="metric"><div className="metric-lbl">N Retained (Yeast)</div><div className="metric-val" style={{ color: "var(--green)" }}>+50%</div><div className="metric-unit">NH3 suppression</div></div>
          <div className="metric"><div className="metric-lbl">Lignin Reduction</div><div className="metric-val" style={{ color: "var(--teal)" }}>−15–20%</div><div className="metric-unit">ADL by Day 14</div></div>
          <div className="metric"><div className="metric-lbl">BSF Meal CP (9-org+Algae)</div><div className="metric-val">56%</div><div className="metric-unit">from 45% baseline</div></div>
          <div className="metric"><div className="metric-lbl">PKSA Cost</div><div className="metric-val" style={{ color: "var(--green)" }}>$0.00</div><div className="metric-unit">Free mill waste · K₂O 35–45%</div></div>
          <div className="metric"><div className="metric-lbl">BSF Handoff Gate</div><div className="metric-val" style={{ color: "var(--amber)" }}>6 Criteria</div><div className="metric-unit">All must pass before S4</div></div>
        </div>

        {/* ⑤ MODULE GRID */}
        <div className="sec-title st-teal">Select A Module</div>
        <div className="module-grid" style={{ position: "relative" }}>
          {show && <S n="5" />}

          <div className="module-btn" style={{ "--accent": "var(--teal)", position: "relative" }}>
            {show && <S n="5.1" />}
            <span className="mb-status ms-live">Live ✓</span>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div className="mb-icon" style={{ background: "rgba(0,201,177,.12)", color: "var(--teal)" }}>⚗</div>
              <div><div className="mb-num">Module 1</div><div className="mb-title">Organism Library</div></div>
            </div>
            <div className="mb-desc">Full reference table of all 21 organisms, enzymes, and algae. Expandable rows with mechanism, contributions, measurement protocols, and print function.</div>
            <div className="mb-tags"><span className="mb-tag">21 Organisms</span><span className="mb-tag">Expandable Rows</span><span className="mb-tag">Print Per Organism</span><span className="mb-tag">biological_library DB</span></div>
          </div>

          <div className="module-btn" style={{ "--accent": "var(--amber)", position: "relative" }}>
            {show && <S n="5.2" />}
            <span className="mb-status ms-db">DB Ready</span>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div className="mb-icon" style={{ background: "rgba(245,166,35,.12)", color: "var(--amber)" }}>⊞</div>
              <div><div className="mb-num">Module 2</div><div className="mb-title">Protocol Selector + Dosage</div></div>
            </div>
            <div className="mb-desc">Choose One-Shot ($0.65/t), 9-Org Stack ($3.56/t), Thermophilic, or Budget Powerhouse. Auto-calculates monthly kg, cost, and supplier sourcing from s3_nine_org_dosing.</div>
            <div className="mb-tags"><span className="mb-tag">4 Protocols</span><span className="mb-tag">Live Cost Calc</span><span className="mb-tag">s3_nine_org_dosing</span><span className="mb-tag">s3_opex_monthly</span></div>
          </div>

          <div className="module-btn" style={{ "--accent": "var(--green)", position: "relative" }}>
            {show && <S n="5.3" />}
            <span className="mb-status ms-db">DB Ready</span>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div className="mb-icon" style={{ background: "rgba(61,203,122,.12)", color: "var(--green)" }}>📅</div>
              <div><div className="mb-num">Module 3</div><div className="mb-title">Inoculation Timeline</div></div>
            </div>
            <div className="mb-desc">Step-by-step wave schedule — Wave 1A Day 0, Wave 1B Day 3+, Wave 2 Day 5+. Temperature gates, pH checkpoints, visual confirmation checks. Driven by s3_inoculation_timeline.</div>
            <div className="mb-tags"><span className="mb-tag">Day-By-Day</span><span className="mb-tag">Temp Gates</span><span className="mb-tag">s3_inoculation_timeline</span></div>
          </div>

          <div className="module-btn" style={{ "--accent": "var(--red)", position: "relative" }}>
            {show && <S n="5.4" />}
            <span className="mb-status ms-db">DB Ready</span>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div className="mb-icon" style={{ background: "rgba(232,64,64,.12)", color: "var(--red)" }}>⬡</div>
              <div><div className="mb-num">Module 4</div><div className="mb-title">BSF Handoff Gate</div></div>
            </div>
            <div className="mb-desc">Enter live readings — C:N ratio, moisture %, pH, temperature, Bt titre. All 6 criteria must pass green before S4 BSF loading is unlocked. Hard gate — no overrides.</div>
            <div className="mb-tags"><span className="mb-tag">6 Gate Criteria</span><span className="mb-tag">Live Input</span><span className="mb-tag">Bt Titre Check</span><span className="mb-tag">biological_library</span></div>
          </div>

          <div className="module-btn" style={{ "--accent": "var(--green)", position: "relative" }}>
            {show && <S n="5.5" />}
            <span className="mb-status ms-db">DB Ready</span>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div className="mb-icon" style={{ background: "rgba(61,203,122,.12)", color: "var(--green)" }}>📊</div>
              <div><div className="mb-num">Module 5</div><div className="mb-title">NPK Contribution Calculator</div></div>
            </div>
            <div className="mb-desc">N fixed by Azotobacter/Azospirillum, P solubilised by PSB organisms, K mobilised from PKSA. Shows before/after NPK per tonne DM with urea replacement value. Feeds S6 valuation.</div>
            <div className="mb-tags"><span className="mb-tag">N Fixed $/t FW</span><span className="mb-tag">P Bioavailability</span><span className="mb-tag">s3_npk_contribution</span></div>
          </div>

          <div className="module-btn" style={{ "--accent": "var(--green)", position: "relative" }}>
            {show && <S n="5.6" />}
            <span className="mb-status ms-new">New Mar 2026</span>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div className="mb-icon" style={{ background: "rgba(61,203,122,.15)", color: "var(--pastelGreen)" }}>🌿</div>
              <div><div className="mb-num">Module 6</div><div className="mb-title">Algae Hydrator — Stream B</div></div>
            </div>
            <div className="mb-desc">Spirulina or Chlorella grown in POME raceway ponds. Replaces hydration water. 1,850 L/t EFB DM. BSF meal 45%→56% CP. CapEx ~$32,400. $0 OpEx. Full CapEx payback calculator.</div>
            <div className="mb-tags"><span className="mb-tag">$0 OpEx</span><span className="mb-tag">+22% Neonate</span><span className="mb-tag">BSF 56% CP</span><span className="mb-tag">s3_algae_uplift</span></div>
          </div>

          <div className="module-btn" style={{ "--accent": "var(--blue)", position: "relative" }}>
            {show && <S n="5.7" />}
            <span className="mb-status ms-db">DB Ready</span>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div className="mb-icon" style={{ background: "rgba(74,158,219,.1)", color: "var(--blue)" }}>♻</div>
              <div><div className="mb-num">Module 7</div><div className="mb-title">Gas Emissions Control</div></div>
            </div>
            <div className="mb-desc">CH4 ↓70–80% via Lactobacillus pH drop. NH3 ↓50% via Saccharomyces N-capture. N value retained = $4–8/t FW. Emissions phase chart by day. Carbon credit implications.</div>
            <div className="mb-tags"><span className="mb-tag">CH4 Control</span><span className="mb-tag">NH3 Retention</span><span className="mb-tag">$4–8/t FW saved</span></div>
          </div>

          <div className="module-btn" style={{ "--accent": "var(--amber)", position: "relative" }}>
            {show && <S n="5.8" />}
            <span className="mb-status ms-db">DB Ready</span>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div className="mb-icon" style={{ background: "rgba(245,166,35,.1)", color: "var(--amber)" }}>🏭</div>
              <div><div className="mb-num">Module 8</div><div className="mb-title">Supplier + Procurement</div></div>
            </div>
            <div className="mb-desc">Indonesia → SE Asia → India → China sourcing by organism. Lead times, MOQs, best quotes. Tokopedia retail vs Alibaba bulk vs IPB ICBB direct. Powered by s3_procurement.</div>
            <div className="mb-tags"><span className="mb-tag">Indonesia First</span><span className="mb-tag">28 Suppliers</span><span className="mb-tag">s3_procurement</span></div>
          </div>

          <div className="module-btn" style={{ "--accent": "var(--red)", position: "relative" }}>
            {show && <S n="5.9" />}
            <span className="mb-status ms-db">DB Ready</span>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div className="mb-icon" style={{ background: "rgba(232,64,64,.1)", color: "var(--red)" }}>⚠</div>
              <div><div className="mb-num">Module 9</div><div className="mb-title">Antagonism + Compatibility Matrix</div></div>
            </div>
            <div className="mb-desc">Trichoderma vs Rhizopus timing conflict. Bt titre gate vs BSF. Ganoderma vs beneficials. Visual organism-pair compatibility checker. All conflicts from s3_antagonism_matrix.</div>
            <div className="mb-tags"><span className="mb-tag">Wave Timing</span><span className="mb-tag">Pair Conflicts</span><span className="mb-tag">s3_antagonism_matrix</span></div>
          </div>

          <div className="module-btn" style={{ "--accent": "var(--teal)", position: "relative" }}>
            {show && <S n="5.10" />}
            <span className="mb-status ms-db">DB Ready</span>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div className="mb-icon" style={{ background: "rgba(0,201,177,.1)", color: "var(--teal)" }}>🔬</div>
              <div><div className="mb-num">Module 10</div><div className="mb-title">Lab Analysis — S3 Output</div></div>
            </div>
            <div className="mb-desc">End-of-S3 substrate characterisation. CP 12.5–13.8% DM, ADL 14–16% DM, N 1.80–2.20% DM, pH 6.5–7.5, C:N 18–25. Cellulase 20–35 U/g peak. BSF readiness score. Feeds S4.</div>
            <div className="mb-tags"><span className="mb-tag">Proximate Analysis</span><span className="mb-tag">Enzyme Activity</span><span className="mb-tag">lab_analysis schema</span></div>
          </div>

          <div className="module-btn" style={{ "--accent": "var(--amber)", position: "relative" }}>
            {show && <S n="5.11" />}
            <span className="mb-status ms-live">$0 Cost</span>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div className="mb-icon" style={{ background: "rgba(245,166,35,.1)", color: "var(--amber)" }}>⚡</div>
              <div><div className="mb-num">Module 11</div><div className="mb-title">PKSA Potassium Calculator</div></div>
            </div>
            <div className="mb-desc">294 t/month boiler ash at 60 TPH. K₂O 35–45% DM. Free. Final compost K₂O 2.0–5.4%. SNI 19-7030-2004 compliance check. Dose 6–10 kg/t EFB. pH 10–12 guardrail.</div>
            <div className="mb-tags"><span className="mb-tag">$0/kg PKSA</span><span className="mb-tag">294 t/month</span><span className="mb-tag">SNI Check</span></div>
          </div>

          <div className="module-btn" style={{ "--accent": "var(--purple)", position: "relative" }}>
            {show && <S n="5.12" />}
            <span className="mb-status ms-db">DB Ready</span>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div className="mb-icon" style={{ background: "rgba(155,89,182,.1)", color: "var(--purple)" }}>💰</div>
              <div><div className="mb-num">Module 12</div><div className="mb-title">S3 CapEx Calculator</div></div>
            </div>
            <div className="mb-desc">Inoculation equipment, mixing tanks, aeration, PKSA dosing system, raceway ponds (Stream B), automated sprayers. Full S3 CapEx from s3_capex table with payback period.</div>
            <div className="mb-tags"><span className="mb-tag">Equipment Sizing</span><span className="mb-tag">Payback Period</span><span className="mb-tag">s3_capex</span></div>
          </div>
        </div>

        {/* ⑥ BSF HANDOFF GATE STATUS */}
        <div className="sec-title st-red" style={{ marginTop: 32 }}>BSF Handoff Gate — Current Batch Status</div>
        <div className="gate-strip" style={{ position: "relative" }}>
          {show && <S n="6" />}
          <div className="gate-item"><span className="gate-icon">🌡</span><span className="gate-lbl">Temp</span>&nbsp;<span className="gate-val">— Pending</span></div>
          <div className="gate-sep" />
          <div className="gate-item"><span className="gate-icon">⚗</span><span className="gate-lbl">pH</span>&nbsp;<span className="gate-val">— Pending</span></div>
          <div className="gate-sep" />
          <div className="gate-item"><span className="gate-icon">💧</span><span className="gate-lbl">Moisture</span>&nbsp;<span className="gate-val">— Pending</span></div>
          <div className="gate-sep" />
          <div className="gate-item"><span className="gate-icon">🔬</span><span className="gate-lbl">C:N Ratio</span>&nbsp;<span className="gate-val">— Pending</span></div>
          <div className="gate-sep" />
          <div className="gate-item"><span className="gate-icon" style={{ color: "var(--red)" }}>⚠</span><span className="gate-lbl">Bt Titre</span>&nbsp;<span className="gate-val">— Pending</span></div>
          <div className="gate-sep" />
          <div className="gate-item"><span className="gate-icon">👁</span><span className="gate-lbl">Visual Texture</span>&nbsp;<span className="gate-val">— Pending</span></div>
          <div className="gate-sep" />
          <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 12, color: "var(--grey)", marginLeft: "auto" }}>Overall: <span className="gate-val">Awaiting measurements</span></span>
        </div>

        {/* ⑦ PROTOCOL QUICK-SELECT */}
        <div className="sec-title st-amber" style={{ marginTop: 32 }}>Quick Protocol Selection — This Batch</div>
        <div className="protocol-grid" style={{ position: "relative" }}>
          {show && <S n="7" />}
          <div className="protocol-btn sel" style={{ position: "relative" }}>{show && <S n="7.1" />}<div className="pb-name">One-Shot (Default)</div><div className="pb-cost">$0.65 / t FW</div><div className="pb-desc">5 organisms · Day 0 · $5,302/month · Ganoderma compliant · Standard operations</div></div>
          <div className="protocol-btn" style={{ position: "relative" }}>{show && <S n="7.2" />}<div className="pb-name">9-Org Premium Stack</div><div className="pb-cost">$3.56 / t FW</div><div className="pb-desc">9 organisms · 3-wave timing · BSF meal 52–56% CP · $29,035/month</div></div>
          <div className="protocol-btn" style={{ position: "relative" }}>{show && <S n="7.3" />}<div className="pb-name">9-Org + Spirulina</div><div className="pb-cost">$3.56 / t FW</div><div className="pb-desc">All 9 + algae hydration · BSF CP 56% · $4,500–6,500/t petfood grade</div></div>
          <div className="protocol-btn" style={{ position: "relative" }}>{show && <S n="7.4" />}<div className="pb-name">Budget Powerhouse</div><div className="pb-cost">$0.32 / t FW</div><div className="pb-desc">Pleurotus + Azotobacter + Saccharomyces · Proof-of-concept pilots</div></div>
        </div>

        {/* ⑧ DB FIELD AUDIT */}
        <div className="sec-title st-teal" style={{ marginTop: 32 }}>Supabase Database Tables — S3 Status</div>
        <div className="audit-grid" style={{ position: "relative" }}>
          {show && <S n="8" />}

          <div className="audit-card" style={{ position: "relative" }}>{show && <S n="8.1" />}
            <div className="audit-hdr"><span className="audit-tbl-name">biological_library</span><span className="audit-row-count">19 rows · 25 columns</span></div>
            <div className="audit-body">
              <div className="af-row"><div className="af-status af-s-ok" /><span className="af-name">organism_name, category, icbb</span><span className="af-note">✓ populated</span></div>
              <div className="af-row"><div className="af-status af-s-ok" /><span className="af-name">bsf_safe, guardrail_flag</span><span className="af-note">✓ populated</span></div>
              <div className="af-row"><div className="af-status af-s-empty" /><span className="af-name">price_usd_per_kg</span><span className="af-note">⚠ sparse — needs full fill</span></div>
              <div className="af-row"><div className="af-status af-s-empty" /><span className="af-name">dose_cfu_per_g</span><span className="af-note">⚠ sparse</span></div>
              <div className="af-row"><div className="af-status af-s-missing" /><span className="af-name">wave_number, wave_day_start</span><span className="af-note">✗ not in schema</span></div>
              <div className="af-row"><div className="af-status af-s-missing" /><span className="af-name">cp_uplift_pct, ndf_reduction_pct</span><span className="af-note">✗ not in schema</span></div>
              <div className="af-row"><div className="af-status af-s-missing" /><span className="af-name">dose_pct_dm_low/high</span><span className="af-note">✗ not in schema</span></div>
              <div className="af-row"><div className="af-status af-s-missing" /><span className="af-name">cost_per_t_fw_low/high</span><span className="af-note">✗ not in schema</span></div>
            </div>
          </div>

          <div className="audit-card" style={{ position: "relative" }}>{show && <S n="8.2" />}
            <div className="audit-hdr"><span className="audit-tbl-name">s3_nine_org_dosing</span><span className="audit-row-count">schema only</span></div>
            <div className="audit-body">
              <div className="af-row"><div className="af-status af-s-empty" /><span className="af-name">organism_id, protocol_name</span><span className="af-note">⚠ no data rows yet</span></div>
              <div className="af-row"><div className="af-status af-s-missing" /><span className="af-name">one_shot vs 9_org vs budget flag</span><span className="af-note">✗ protocol selector field</span></div>
              <div className="af-row"><div className="af-status af-s-missing" /><span className="af-name">monthly_kg_at_60tph</span><span className="af-note">✗ pre-calculated value</span></div>
            </div>
          </div>

          <div className="audit-card" style={{ position: "relative" }}>{show && <S n="8.3" />}
            <div className="audit-hdr"><span className="audit-tbl-name">s3_inoculation_timeline</span><span className="audit-row-count">schema · 12 columns</span></div>
            <div className="audit-body">
              <div className="af-row"><div className="af-status af-s-ok" /><span className="af-name">day_number, time_window</span><span className="af-note">✓ schema ready</span></div>
              <div className="af-row"><div className="af-status af-s-ok" /><span className="af-name">organisms[], ph_target, temp_target_c</span><span className="af-note">✓ schema ready</span></div>
              <div className="af-row"><div className="af-status af-s-empty" /><span className="af-name">Data rows</span><span className="af-note">⚠ 0 rows — needs seeding</span></div>
              <div className="af-row"><div className="af-status af-s-missing" /><span className="af-name">wave_label (W1A/W1B/W2)</span><span className="af-note">✗ not in schema</span></div>
            </div>
          </div>

          <div className="audit-card" style={{ position: "relative" }}>{show && <S n="8.4" />}
            <div className="audit-hdr"><span className="audit-tbl-name">s3_antagonism_matrix</span><span className="audit-row-count">7 columns</span></div>
            <div className="audit-body">
              <div className="af-row"><div className="af-status af-s-ok" /><span className="af-name">org_a, org_b, relationship, safe_to_co_dose</span><span className="af-note">✓ schema complete</span></div>
              <div className="af-row"><div className="af-status af-s-empty" /><span className="af-name">Data rows</span><span className="af-note">⚠ needs seeding (Tricho vs Rhizopus, Bt gate)</span></div>
            </div>
          </div>

          <div className="audit-card" style={{ position: "relative" }}>{show && <S n="8.5" />}
            <div className="audit-hdr"><span className="audit-tbl-name">s3_npk_contribution</span><span className="audit-row-count">needs schema check</span></div>
            <div className="audit-body">
              <div className="af-row"><div className="af-status af-s-empty" /><span className="af-name">n_fixed_mg_kg_day</span><span className="af-note">⚠ by organism — needs data</span></div>
              <div className="af-row"><div className="af-status af-s-missing" /><span className="af-name">p_released_pct_dm</span><span className="af-note">✗ per PSB organism per wave</span></div>
              <div className="af-row"><div className="af-status af-s-missing" /><span className="af-name">n_value_usd_per_t_fw</span><span className="af-note">✗ urea replacement calc</span></div>
            </div>
          </div>

          <div className="audit-card" style={{ position: "relative" }}>{show && <S n="8.6" />}
            <div className="audit-hdr"><span className="audit-tbl-name">s3_algae_uplift</span><span className="audit-row-count">New Mar 2026</span></div>
            <div className="audit-body">
              <div className="af-row"><div className="af-status af-s-empty" /><span className="af-name">spirulina vs chlorella comparison</span><span className="af-note">⚠ needs seeding</span></div>
              <div className="af-row"><div className="af-status af-s-missing" /><span className="af-name">bsf_neonate_survival_boost_pct</span><span className="af-note">✗ +22% / +15% not stored</span></div>
              <div className="af-row"><div className="af-status af-s-missing" /><span className="af-name">bsf_meal_cp_after</span><span className="af-note">✗ 56% / 51% not stored</span></div>
              <div className="af-row"><div className="af-status af-s-missing" /><span className="af-name">raceway_capex_usd</span><span className="af-note">✗ $32,400 not stored</span></div>
            </div>
          </div>

          <div className="audit-card" style={{ position: "relative" }}>{show && <S n="8.7" />}
            <div className="audit-hdr"><span className="audit-tbl-name">s3_procurement</span><span className="audit-row-count">needs seeding</span></div>
            <div className="audit-body">
              <div className="af-row"><div className="af-status af-s-empty" /><span className="af-name">supplier rows</span><span className="af-note">⚠ all 28 suppliers need inserting</span></div>
              <div className="af-row"><div className="af-status af-s-missing" /><span className="af-name">priority_region (IDN/SEA/IND/CHN)</span><span className="af-note">✗ procurement priority not stored</span></div>
            </div>
          </div>

          <div className="audit-card" style={{ position: "relative", borderColor: "rgba(245,166,35,.4)" }}>{show && <S n="8.8" />}
            <div className="audit-hdr" style={{ background: "rgba(245,166,35,.08)" }}><span className="audit-tbl-name" style={{ color: "var(--amber)" }}>Missing — Not In DB Yet</span><span className="audit-row-count" style={{ color: "var(--amber)" }}>7 tables needed</span></div>
            <div className="audit-body">
              <div className="af-row"><div className="af-status af-s-missing" /><span className="af-name">s3_bsf_handoff_gate</span><span className="af-note">✗ 6 criteria + live batch readings</span></div>
              <div className="af-row"><div className="af-status af-s-missing" /><span className="af-name">s3_batch_log</span><span className="af-note">✗ per-batch inoculation record</span></div>
              <div className="af-row"><div className="af-status af-s-missing" /><span className="af-name">s3_lab_output</span><span className="af-note">✗ end-of-S3 substrate lab values</span></div>
              <div className="af-row"><div className="af-status af-s-missing" /><span className="af-name">s3_gas_emissions</span><span className="af-note">✗ CH4/NH3 by phase by organism</span></div>
              <div className="af-row"><div className="af-status af-s-missing" /><span className="af-name">s3_pksa_calculator</span><span className="af-note">✗ K₂O contribution, dose calc</span></div>
              <div className="af-row"><div className="af-status af-s-missing" /><span className="af-name">s3_consortium_groups</span><span className="af-note">✗ 18 pre-built stacks not stored</span></div>
              <div className="af-row"><div className="af-status af-s-missing" /><span className="af-name">s3_capex (schema ok — needs data)</span><span className="af-note">✗ equipment list + costs</span></div>
            </div>
          </div>
        </div>

        {/* ⑨ WHAT'S MISSING */}
        <div className="sec-title st-amber" style={{ marginTop: 32 }}>What Is Missing From Today's Data Upload</div>
        <div className="missing-alert" style={{ position: "relative" }}>
          {show && <S n="9" />}
          <div className="ma-title">Fields / Tables Built Today But Not Yet In Supabase</div>
          <div className="ma-list">
            <div className="ma-item"><span className="ma-dot" />biological_library: wave_number, wave_day_start, dose_pct_dm_low/high, cost_per_t_fw, cp_uplift_pct, ndf_reduction_pct, lignin_reduction_pct, n_fixed_mg_kg_day, p_released_pct_dm</div>
            <div className="ma-item"><span className="ma-dot" />s3_algae_uplift: bsf_neonate_survival_boost_pct, bsf_meal_cp_after, fcr_improvement, direct_protein_added_kg_per_t, bsf_market_value_range, raceway_capex_usd, pome_bod_reduction_pct</div>
            <div className="ma-item"><span className="ma-dot" />s3_inoculation_timeline: 0 data rows — 21 timeline entries from today's Excel need inserting</div>
            <div className="ma-item"><span className="ma-dot" />s3_antagonism_matrix: 0 data rows — Trichoderma/Rhizopus timing conflict, Bt/BSF block, Pleurotus/BSF caution all need inserting</div>
            <div className="ma-item"><span className="ma-dot" />s3_nine_org_dosing: 0 data rows — all 9 organisms + One-Shot stack + Budget stack need inserting</div>
            <div className="ma-item"><span className="ma-dot" />s3_procurement: 0 data rows — all 28 supplier rows from today's compiled Excel need inserting</div>
            <div className="ma-item"><span className="ma-dot" />s3_bsf_handoff_gate: TABLE MISSING — create + seed 6 criteria rows (C:N 15–25:1, Moisture 60–70%, pH 6.5–7.5, Temp &lt;40°C, Bt &lt;10⁴ CFU/g, Visual crumbly)</div>
            <div className="ma-item"><span className="ma-dot" />s3_batch_log: TABLE MISSING — per-batch record with protocol chosen, organism doses, dates, gate results, BSF transfer timestamp</div>
            <div className="ma-item"><span className="ma-dot" />s3_lab_output: TABLE MISSING — end-of-S3 substrate analysis (CP 12.5–13.8% DM, ADL 14–16% DM, N 1.80–2.20% DM, cellulase 20–35 U/g, Salmonella ND, E. coli &lt;1000 MPN/g)</div>
            <div className="ma-item"><span className="ma-dot" />s3_gas_emissions: TABLE MISSING — CH4/CO2/NH3 by phase (PKSA soak / neutralisation / thermophilic / mesophilic / maturation)</div>
          </div>
        </div>

      </div>

      {/* ── TOGGLE ── */}
      <button className="toggle-btn" onClick={() => setShow(!show)}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#FFD600", display: "inline-block" }} />
        Section Labels&nbsp;|&nbsp;{show ? "Hide" : "Show"}
      </button>
    </>
  );
}