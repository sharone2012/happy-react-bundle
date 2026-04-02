import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  C, Fnt, LINE_COLORS, S1_CSS,
  S0Header, S1Breadcrumb, SubstrateFlowStrip,
} from "../components/S1Shared.jsx";

/*
 * S1Hub.jsx — S1 Mechanical Pre-Processing Hub (S3Landing pattern)
 * Route: /s1
 */

// ── S1 SUBSTRATE FLOW DATA ──
const S1_INFLOWS = [
  { title: 'Monthly Volume', val: '8,262', suffix: ' t', unit: 'FW / month · S0 Handoff' },
  { title: 'Moisture', val: '62–82', suffix: '%', unit: 'MC wb · Mixed Residues' },
  { title: 'Crude Protein', val: '4.75–14.5', suffix: '%', unit: 'DM · EFB / OPDC Range' },
  { title: 'Lignin ADL', val: '22–31', suffix: '%', unit: 'DM · EFB / OPDC Range' },
  { title: 'Red. Sugars', val: '—', suffix: '%', unit: 'DM · Pre-PKSA', color: 'rgba(30,107,140,.6)' },
  { title: 'Organic Carbon', val: '41', suffix: '%', unit: 'DM · CHNS Analysis' },
  { title: 'C:N Ratio', val: '20–60', suffix: ':1', unit: 'DM · Per Residue' },
  { title: '', npk: [
    { key: 'N', val: '0.76–2.32', dir: 'eq' },
    { key: 'P', val: '0.20–0.30', dir: 'eq' },
    { key: 'K', val: '1.90–2.20', dir: 'eq' },
  ]},
];

const S1_OUTFLOWS = [
  { title: 'Monthly Volume', val: '6,800', suffix: ' t', unit: 'FW / month · Post-Press', dir: 'dn' },
  { title: 'Moisture', val: '35–50', suffix: '%', unit: 'MC wb · Post-Press', dir: 'dn' },
  { title: 'Particle Size', val: '≤2–3', suffix: 'mm', unit: 'D90 · Hammer Mill', dir: 'dn' },
  { title: 'Lignin ADL', val: '22–31', suffix: '%', unit: 'DM · Unchanged', dir: 'eq' },
  { title: 'Red. Sugars', val: '—', suffix: '%', unit: 'DM · Unchanged', dir: 'eq', color: 'rgba(30,107,140,.6)' },
  { title: 'Fe Content', val: '<3,000', suffix: ' mg/kg', unit: 'DM · POS Gate', dir: 'dn' },
  { title: 'C:N Ratio', val: '20–60', suffix: ':1', unit: 'DM · Unchanged', dir: 'eq' },
  { title: '', npk: [
    { key: 'N', val: '0.76–2.32', dir: 'eq' },
    { key: 'P', val: '0.20–0.30', dir: 'eq' },
    { key: 'K', val: '1.90–2.20', dir: 'eq' },
  ]},
];

// ── KPI DATA ──
const kpis = [
  { label: 'Building CAPEX', val: '$1,374,610', unit: 'S1 Building Only · Indo Rates' },
  { label: 'Equipment CAPEX', val: '$398,000', unit: 'POS decanter RFQ pending' },
  { label: 'Monthly OPEX', val: '$37,957', unit: 'Labour + Electricity + Maint', suffix: '/mo' },
  { label: 'Processing Lines', val: '3', unit: 'EFB · OPDC · POS', color: C.teal },
  { label: 'Facility Area', val: '2,450', unit: 'Building footprint', suffix: ' m²', color: C.teal },
  { label: 'Total Power', val: '617', unit: 'All 3 lines combined', suffix: ' kW', color: C.teal },
];

// ── GUARDRAILS ──
const guardrails = [
  { icon: '💧', label: 'MC ≥40%', val: 'LOCKED', cls: 'red', note: 'CLASS A · OPDC screw press' },
  { icon: '🔩', label: 'Fe <3,000', val: 'mg/kg DM', cls: 'amber', note: 'POS ICP-OES gate' },
  { icon: '🌿', label: 'ADL <12%', val: 'DM target', cls: 'teal', note: 'For BSF palatability' },
  { icon: '⚖', label: 'C:N 15–22', val: 'optimal', cls: 'teal', note: 'Post-S2 blend target' },
  { icon: '⚗', label: 'pH 4.0–5.0', val: 'range', cls: 'amber', note: 'POS pre-treatment' },
  { icon: '🧪', label: 'CEC >20', val: 'cmol/kg', cls: 'teal', note: 'Soil quality target' },
  { icon: '⚠', label: 'No Cr >20', val: 'mg/kg', cls: 'red', note: 'Heavy metal limit' },
  { icon: '🔧', label: 'Belt speed', val: 'locked at spec', cls: 'teal', note: 'Per equipment OEM' },
  { icon: '🌡', label: 'All temps', val: '<85°C', cls: 'amber', note: 'Motor + bearing limit' },
];

export default function S1Hub() {
  const nav = useNavigate();
  const [capexOpen, setCapexOpen] = useState(false);

  const modules = [
    { num: 'Line 1', title: 'EFB Pre-Processing Line', desc: '10-node mechanical line · 20 t/h · 600mm belt · 298 kW · Shred → Press → Mill → Screen', accent: C.teal, icon: '⚙', tags: ['10 Machines', '600mm Belt', '20 t/h', 'Trommel + Hammer Mill'], route: '/s1/efb' },
    { num: 'Line 2', title: 'OPDC Pre-Processing Line', desc: '10-node mechanical line · 5 t/h · 500mm belt · 206 kW · CLASS A Gate · 24hr Dwell', accent: C.amber, icon: '⚙', tags: ['10 Machines', '500mm Belt', 'CLASS A', '24hr Dwell Gate'], route: '/s1/opdc' },
    { num: 'Line 3', title: 'POS Pre-Skimming Line', desc: '4–7 node liquid/semi line · 1.25 t/h · ICP-OES Fe Gate · Decanter · Filter Press', accent: '#3B82F6', icon: '💧', tags: ['4–7 Machines', 'ICP-OES Fe', 'Decanter', 'Filter Press'], route: '/s1/pos' },
    { num: 'Eng', title: 'Engineering Overview', desc: '24 equipment nodes · 3 processing lines · Full engineering spec with CAPEX + OPEX + Greenhouse + Guardrails', accent: C.grey, icon: '📐', tags: ['24 Nodes', '3 Lines', 'Full Spec'], route: '/s1-engineering' },
    { num: 'FP', title: 'Combined Floor Plans', desc: 'Tabbed floor plans · EFB · OPDC · POS · Building dimensions · Node cards with specs', accent: C.teal, icon: '🏭', tags: ['3 Floor Plans', 'Node Cards', 'Dimensions'], route: '/s1-combined' },
    { num: 'CAPEX', title: 'Facility CAPEX Breakdown', desc: 'Building $1.37M · Equipment $398K · Labour + Electricity + Maintenance + Admin OpEx', accent: C.amber, icon: '💰', tags: ['Building CAPEX', 'Equipment', 'OpEx', 'IDR Rates'], action: 'capex' },
  ];

  // Building CAPEX line items
  const buildingCapex = [
    { code: 'A1', name: 'S1C EFB Processing Hall', cost: '$425,000' },
    { code: 'A2', name: 'S1B OPDC Processing Bay', cost: '$185,000' },
    { code: 'A3', name: 'Shared Infrastructure', cost: '$312,610' },
    { code: 'A4', name: 'Drying Yard & Hardstand', cost: '$95,000' },
    { code: 'A5', name: 'Storage & Bagging', cost: '$142,000' },
    { code: 'A6', name: 'Office & Laboratory', cost: '$78,000' },
    { code: 'A7', name: 'Utilities & Services', cost: '$89,000' },
    { code: 'A8', name: 'Contingency (5%)', cost: '$48,000' },
  ];

  return (
    <>
      <style>{S1_CSS}</style>
      <S0Header activeStage={1} />

      {/* STAGE HEADER */}
      <div className="stage-hdr">
        <div className="stage-badge">
          <div className="stage-num">S1</div>
          <div>
            <div className="stage-title">Mechanical Pre-Processing</div>
            <div className="stage-sub">CFI Deep Tech · 60 TPH FFB Mill · Bogor, West Java · v2.0 Mar 2026</div>
          </div>
        </div>
        <div className="stage-hdr-right">
          <span className="bdg bdg-t">3 Processing Lines</span>
          <span className="bdg bdg-a">617 kW Total</span>
          <span className="bdg bdg-g">24 Equipment Nodes</span>
          <span className="bdg bdg-r">9 Hard Guardrails</span>
        </div>
      </div>

      {/* BREADCRUMB */}
      <S1Breadcrumb />

      {/* S0 HANDOFF BANNER */}
      <div className="handoff-banner">
        <div className="ho-label">S0 Handoff Received</div>
        <div className="ho-pills">
          <div className="ho-pill"><div className="ho-val">60</div><div className="ho-unit">TPH FFB Mill</div></div>
          <div className="ho-pill"><div className="ho-val">20</div><div className="ho-unit">hr/day Operating</div></div>
          <div className="ho-pill"><div className="ho-val">22%</div><div className="ho-unit">EFB Yield</div></div>
          <div className="ho-pill"><div className="ho-val">15.2%</div><div className="ho-unit">OPDC Yield (of EFB)</div></div>
          <div className="ho-pill"><div className="ho-val">30</div><div className="ho-unit">t/day POS Volume</div></div>
          <div className="ho-pill"><div className="ho-val">Ultisol</div><div className="ho-unit">Soil Type</div></div>
        </div>
      </div>

      {/* SUBSTRATE FLOW STRIP */}
      <div style={{ marginTop: 20 }}>
        <SubstrateFlowStrip
          stageLabel="Substrate Flow — S0 Feedstock → S1 Mechanical Output"
          inflows={S1_INFLOWS}
          outflows={S1_OUTFLOWS}
        />
      </div>

      <div className="content">
        {/* KPI METRICS */}
        <div className="metrics-strip">
          {kpis.map((k, i) => (
            <div key={i} className="metric">
              <div className="metric-lbl">{k.label}</div>
              <div className="metric-val" style={k.color ? { color: k.color } : {}}>{k.val}{k.suffix || ''}</div>
              <div className="metric-unit">{k.unit}</div>
            </div>
          ))}
        </div>

        {/* MODULE GRID */}
        <div className="sec-title st-teal">Select A Module</div>
        <div className="module-grid">
          {modules.map((m, i) => (
            <div
              key={i}
              className="module-btn"
              style={{ '--accent': m.accent }}
              onClick={() => m.route ? nav(m.route) : m.action === 'capex' && setCapexOpen(!capexOpen)}
            >
              <span className="mb-status ms-live">Live ✓</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className="mb-icon" style={{ background: `${m.accent}22`, color: m.accent }}>{m.icon}</div>
                <div>
                  <div className="mb-num">{m.num}</div>
                  <div className="mb-title">{m.title}</div>
                </div>
              </div>
              <div className="mb-desc">{m.desc}</div>
              <div className="mb-tags">{m.tags.map((t, j) => <span key={j} className="mb-tag">{t}</span>)}</div>
            </div>
          ))}
        </div>

        {/* INLINE CAPEX SECTION */}
        {capexOpen && (
          <div style={{ marginTop: 20, background: C.navyCard, border: `1.5px solid ${C.bdrIdle}`, borderRadius: 11, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.bdrIdle}`, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ fontFamily: Fnt.syne, fontSize: 14, fontWeight: 700, color: C.amber }}>BUILDING CAPEX BREAKDOWN</div>
              <div style={{ marginLeft: 'auto', fontFamily: Fnt.mono, fontSize: 16, fontWeight: 700, color: C.amber }}>$1,374,610</div>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(0,0,0,.3)' }}>
                  <th style={{ padding: '8px 16px', textAlign: 'left', fontFamily: Fnt.mono, fontSize: 10, fontWeight: 700, color: C.grey, textTransform: 'uppercase', letterSpacing: '.04em' }}>Code</th>
                  <th style={{ padding: '8px 16px', textAlign: 'left', fontFamily: Fnt.mono, fontSize: 10, fontWeight: 700, color: C.grey, textTransform: 'uppercase' }}>Item</th>
                  <th style={{ padding: '8px 16px', textAlign: 'right', fontFamily: Fnt.mono, fontSize: 10, fontWeight: 700, color: C.grey, textTransform: 'uppercase' }}>Cost</th>
                </tr>
              </thead>
              <tbody>
                {buildingCapex.map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(30,107,140,.15)' }}>
                    <td style={{ padding: '8px 16px', fontFamily: Fnt.mono, fontSize: 12, fontWeight: 700, color: C.teal }}>{row.code}</td>
                    <td style={{ padding: '8px 16px', fontFamily: Fnt.dm, fontSize: 12, color: C.white }}>{row.name}</td>
                    <td style={{ padding: '8px 16px', textAlign: 'right', fontFamily: Fnt.mono, fontSize: 13, fontWeight: 700, color: C.amber }}>{row.cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ padding: '12px 20px', background: 'rgba(0,0,0,.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontFamily: Fnt.dm, fontSize: 11, color: C.grey }}>
                Base $883,880 → +8% Contingency → +20% EPC → +20% Developer Markup
              </div>
              <div style={{ fontFamily: Fnt.mono, fontSize: 11, color: C.green }}>
                Save ~$678K vs Western
              </div>
            </div>
          </div>
        )}

        {/* GUARDRAILS */}
        <div className="sec-title st-red" style={{ marginTop: 32 }}>9 Hard Guardrails — S1 Processing</div>
        <div className="guardrail-grid">
          {guardrails.map((g, i) => {
            const colors = { red: C.red, amber: C.amber, teal: C.teal };
            const color = colors[g.cls] || C.teal;
            return (
              <div key={i} className="guardrail">
                <div className="gr-icon" style={{ background: `${color}22`, color }}>{g.icon}</div>
                <div>
                  <div className="gr-lbl">{g.label}</div>
                  <div className="gr-val" style={{ color }}>{g.val}</div>
                  <div className="gr-note">{g.note}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* STREAMS SUMMARY */}
        <div className="sec-title st-teal" style={{ marginTop: 32 }}>Daily Stream Summary</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {[
            { name: 'EFB', fresh: '300 t/day', dm: '112 t/day', mc: '62.5%', color: C.teal },
            { name: 'OPDC', fresh: '45 t/day', dm: '13.5 t/day', mc: '70%', color: C.amber },
            { name: 'POS', fresh: '30 t/day', dm: '6 t/day', mc: '82%', color: '#3B82F6' },
          ].map((st, i) => (
            <div key={i} style={{ background: C.navyCard, border: `1.5px solid ${C.bdrIdle}`, borderLeft: `4px solid ${st.color}`, borderRadius: 8, padding: '16px 20px' }}>
              <div style={{ fontFamily: Fnt.syne, fontSize: 14, fontWeight: 700, color: st.color, marginBottom: 10 }}>{st.name}</div>
              <div style={{ display: 'flex', gap: 16 }}>
                <div><div style={{ fontFamily: Fnt.dm, fontSize: 10, fontWeight: 700, color: C.grey, textTransform: 'uppercase', marginBottom: 3 }}>Fresh</div><div style={{ fontFamily: Fnt.mono, fontSize: 15, fontWeight: 700, color: C.amber }}>{st.fresh}</div></div>
                <div><div style={{ fontFamily: Fnt.dm, fontSize: 10, fontWeight: 700, color: C.grey, textTransform: 'uppercase', marginBottom: 3 }}>Dry Matter</div><div style={{ fontFamily: Fnt.mono, fontSize: 15, fontWeight: 700, color: C.teal }}>{st.dm}</div></div>
                <div><div style={{ fontFamily: Fnt.dm, fontSize: 10, fontWeight: 700, color: C.grey, textTransform: 'uppercase', marginBottom: 3 }}>MC</div><div style={{ fontFamily: Fnt.mono, fontSize: 15, fontWeight: 700, color: C.white }}>{st.mc}</div></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
