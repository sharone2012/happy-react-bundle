import { useNavigate } from "react-router-dom";
import {
  C, Fnt, S1_CSS, S0Header, S1Breadcrumb, LineHero,
  CollapsibleSection, Pre, SubstrateFlowStrip,
} from "../components/S1Shared.jsx";

/*
 * S1Pos.jsx — POS Pre-Skimming Line Detail
 * Route: /s1/pos
 * Combines: ASCII Flow + Equipment Register + Floor Plan + CAPEX
 */

const ACCENT = '#3B82F6';

// ── SUBSTRATE FLOW DATA ──
const INFLOWS = [
  { title: 'Monthly Volume', val: '900', suffix: ' t', unit: 'FW / month · POS Sludge' },
  { title: 'Moisture', val: '82', suffix: '%', unit: 'MC wb · Liquid/Semi' },
  { title: 'Crude Protein', val: '11', suffix: '%', unit: 'DM · N 1.76% DM' },
  { title: 'Ash Content', val: '28', suffix: '%', unit: 'DM · High Mineral' },
  { title: 'Fe Content', val: 'Variable', suffix: '', unit: 'mg/kg DM · ICP-OES Gate', color: '#3B82F6' },
  { title: 'Organic Carbon', val: '—', suffix: '%', unit: 'DM · Pending Analysis', color: 'rgba(30,107,140,.6)' },
  { title: 'pH', val: '4.4', suffix: '', unit: 'Acidic · Pre-CaCO₃' },
  { title: '', npk: [
    { key: 'N', val: '1.76', dir: 'eq' },
    { key: 'P', val: '—', dir: 'eq' },
    { key: 'K', val: '—', dir: 'eq' },
  ]},
];
const OUTFLOWS = [
  { title: 'Monthly Volume', val: '~405', suffix: ' t', unit: 'Cake / month · Post-Press', dir: 'dn' },
  { title: 'Moisture', val: '65–70', suffix: '%', unit: 'MC wb · Post-Filter Press', dir: 'dn' },
  { title: 'pH', val: '5.5–6.0', suffix: '', unit: 'Post-CaCO₃ Conditioning', dir: 'up' },
  { title: 'Fe Status', val: 'Gated', suffix: '', unit: 'ICP-OES Protocol', dir: 'eq' },
  { title: 'CaCO₃ Dose', val: '5–20', suffix: '% w/w', unit: 'Based on Fe Result', dir: 'eq' },
  { title: 'Screen Reject', val: 'Fibre', suffix: '', unit: '→ EFB Line Recirculate', dir: 'eq' },
  { title: 'Filtrate', val: 'POME', suffix: '', unit: '→ Mill Effluent System', dir: 'eq' },
  { title: '', npk: [
    { key: 'N', val: '1.76', dir: 'eq' },
    { key: 'P', val: '—', dir: 'eq' },
    { key: 'K', val: '—', dir: 'eq' },
  ]},
];

// ── EQUIPMENT REGISTER ──
const EQUIPMENT = [
  { code: 'RH-OPDC-101', name: 'Sludge Pit 15m³', tph: '1.25 tph', mcIn: '82%', mcOut: '82%', elev: '0m', kw: '0 kW', cost: '—', supplier: 'ICP-OES-Fe: Fe result sets S2 inclusion' },
  { code: 'DRS-SLD-01', name: 'Rotary Drum Screen', tph: '1.17 tph', mcIn: '82%', mcOut: '78%', elev: '1.5m', kw: '7 kW', cost: '—', supplier: '—' },
  { code: 'DEC-SLD-101', name: 'Decanter Centrifuge', tph: '0.56 tph', mcIn: '78%', mcOut: '65%', elev: '3m', kw: '55 kW', cost: 'RFQ $80K–$150K', supplier: 'PT Kharismapratama / SCK-Modipalm / Alfa Laval' },
  { code: 'BIN-OPDC-301', name: 'Buffer Tank 15m³', tph: '0.56 tph', mcIn: '65%', mcOut: '65%', elev: '3m', kw: '0 kW', cost: '—', supplier: '—' },
];

// ── FLOOR PLAN NODES ──
const NODES = [
  { code: 'PIT-POS-01', name: 'Pos Sludge Hopper', type: 'At-grade hopper (not in-ground)', spec: '8 m³ · Epoxy-coated RC concrete · Submersible pump', motor: '—', footer: 'Receives mill decanter discharge' },
  { code: 'T-SLD-101', name: 'Pos Buffer Tank', type: 'Agitated buffer tank · sealed dome', spec: '5–8 m³ · SS304 · 3.7 kW low-speed agitator · 1.25 t/h @ 82% MC', motor: '3.7 kW', footer: 'Homogenises sludge before screening' },
  { code: 'SCR-POS-01', name: 'Pos Rotary Drum Screen', type: 'Rotary drum screen', spec: '1mm wedge wire · 1.25 t/h · Reject → EFB line', motor: '3.7 kW', footer: 'ICP-OES Fe gate checkpoint — protocol CFI-LAB-POME-001' },
  { code: 'FP-POS-01', name: 'Pos Filter Press', type: 'Plate-and-frame filter press', spec: '40 × 800mm chambers · ~0.56 t/h cake · MC ~65% · 45+15 min cycle', motor: '11 kW hydraulic', footer: 'Dewatered POS cake to S2 conditioning mixer' },
];

// ── CAPEX ──
const POS_EQUIP = [
  { code: 'DEC-SLD-101', name: 'POS 3-Phase Decanter', cost: 'RFQ $80K–$150K' },
];

export default function S1Pos() {
  return (
    <>
      <style>{S1_CSS}</style>
      <S0Header activeStage={1} />
      <LineHero
        name="S1A — POS Pre-Skimming Line"
        throughput="1.25 t/h · Liquid/Semi"
        power="62 kW Total"
        nodes="4–7"
        accent={ACCENT}
        badges={[
          { text: 'ICP-OES Fe Gate', cls: 'bdg-b' },
          { text: 'CaCO₃ Dosing', cls: 'bdg-a' },
        ]}
      />
      <S1Breadcrumb activeLine="POS Line" />

      <div style={{ marginTop: 10 }}>
        <SubstrateFlowStrip
          stageLabel="Substrate Flow — S0 Raw POS Sludge → S1 Conditioned Cake"
          inflows={INFLOWS}
          outflows={OUTFLOWS}
        />
      </div>

      <div className="content">
        {/* SECTION 1: ASCII PROCESS FLOW */}
        <CollapsibleSection title="ASCII Process Flow — POS Line" number="1" accent={ACCENT} defaultOpen={true}>
          <div style={{ fontFamily: Fnt.dm, fontSize: 10, color: C.grey, marginBottom: 10 }}>
            CFI S1A — POS LINE · 60 TPH FFB Mill · Bogor, West Java · March 2026 · CFI-S1-POS-ASCII-001 Rev 01
          </div>
          <div style={{ fontFamily: Fnt.dm, fontSize: 11, color: '#3B82F6', marginBottom: 6 }}>
            Source: 30 t/day FW · 82% MC · Ash 28% DM · CP 11% DM · N 1.76% DM · Truck delivery
          </div>
          <Pre accent={ACCENT}>{`
  ┌─────────────────────────────────────────────────────────────────────────────────────────────────────────┐
  │  S1A  POS  PRE-SKIMMING  LINE  ·  4–7 UNITS  ·  62 kW  ·  1.25 t/h                                 │
  │  Elevation: EL +1.2m → 0.0m                                                                          │
  └─────────────────────────────────────────────────────────────────────────────────────────────────────────┘

  ┌───────────────────────────────────┐    ┌──────────────────────────────────────────┐
  │ POS-PIT-01                        │    │  PMP-POS-01                              │
  │ SLUDGE RECEIVER HOPPER            │───▶│  Progressive Cavity Pump                 │
  │ EL +0.8–1.0m · 15 m³             │    │  0.75 kW · DN100 · VFD                   │
  │ Reinforced concrete · epoxy-coated│    │  Pipe to buffer tank                     │
  │ 3.5m L × 2.5m W × 2.0m H        │    │                                          │
  │ 60° sloped walls · 150mm drain   │    │                                          │
  └───────────────────────────────────┘    └──────────────────────────────────────────┘
                                                        │
                                                        ▼
  ┌───────────────────────────────────┐    ┌──────────────────────────────────────────┐
  │ T-SLD-101                         │    │  SCR-POS-01                              │
  │ SLUDGE BUFFER TANK                │───▶│  ROTARY DRUM SCREEN                      │
  │ EL 0.0m · SS304 · sealed dome    │    │  EL +0.5m · SS316L · 1.5 kW             │
  │ 5–8 m³ · Ø2.2m × 1.8–2.2m      │    │  2mm aperture                            │
  │ AGITATOR: 3.7 kW                 │    │  Reject: fibre + shell → EFB line        │
  │ FEED PUMP: 0.75 kW               │    │                                          │
  └───────────────────────────────────┘    └──────────────────────────────────────────┘
                                                        │
                                                        ▼
  ┌──────────────────────────────────────────────────────────────────────────────────────┐
  │  `}<span className="gate-blue">ICP-OES Fe CHECKPOINT (BLUE GATE)</span>{`                                                    │
  │  Fe thresholds determine CaCO₃ dosing:                                              │
  │  `}<span className="gate-blue">Fe &lt; 3,000 mg/kg  →  CaCO₃ at 20% w/w (standard dose)</span>{`                           │
  │  `}<span className="gate-amber">Fe 3,000–5,000   →  CaCO₃ at 10–15% w/w (moderate)</span>{`                             │
  │  `}<span className="gate-amber">Fe 5,000–8,000   →  CaCO₃ at 5–10% w/w (reduced)</span>{`                               │
  │  `}<span className="gate-red">Fe &gt; 8,000       →  CaCO₃ protocol review required</span>{`                              │
  └──────────────────────────────────────────────────────────────────────────────────────┘
                                                        │
                                                        ▼
  ┌───────────────────────────────────┐    ┌──────────────────────────────────────────┐
  │ MIX-POS-01                        │    │  FP-POS-01                               │
  │ CONDITIONING MIXER                │───▶│  FILTER PRESS                             │
  │ EL +0.3m · SS304 · 2.2 kW        │    │  EL 0.0m · 15 kW hydraulic               │
  │ 500L batch · CaCO₃ dosing        │    │  630mm × 630mm plates · 25 chambers      │
  │ pH target: 4.4 → 5.5–6.0         │    │  MC: 82% → 65–70%                        │
  │ Residence: 15–20 min per batch    │    │  Cycle: 45–60 min per batch              │
  └───────────────────────────────────┘    └──────────────────────────────────────────┘

  ─── S2 DISCHARGE ───
  `}<span className="gate-blue">POS conditioned cake to S2 Composting / BSF</span>
          </Pre>
        </CollapsibleSection>

        {/* SECTION 2: EQUIPMENT REGISTER */}
        <CollapsibleSection title="Equipment Register — 4–7 Nodes" number="2" accent={ACCENT} defaultOpen={false}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ background: 'rgba(0,0,0,.3)' }}>
                  {['Code','Equipment','Throughput','MC In→Out','Elev','Power','Cost','Supplier/Gate'].map(h => (
                    <th key={h} style={{ padding: '8px 10px', textAlign: 'left', fontFamily: Fnt.mono, fontSize: 10, fontWeight: 700, color: C.grey, textTransform: 'uppercase', letterSpacing: '.04em', borderBottom: `1px solid ${C.bdrIdle}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {EQUIPMENT.map((eq, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid rgba(30,107,140,.15)` }}>
                    <td style={{ padding: '8px 10px', fontFamily: Fnt.mono, fontSize: 11, fontWeight: 700, color: ACCENT }}>{eq.code}</td>
                    <td style={{ padding: '8px 10px', fontFamily: Fnt.dm, fontSize: 11, color: C.white }}>{eq.name}</td>
                    <td style={{ padding: '8px 10px', fontFamily: Fnt.mono, fontSize: 11, color: C.amber }}>{eq.tph}</td>
                    <td style={{ padding: '8px 10px', fontFamily: Fnt.mono, fontSize: 11, color: C.white }}>{eq.mcIn} → {eq.mcOut}</td>
                    <td style={{ padding: '8px 10px', fontFamily: Fnt.mono, fontSize: 11, color: C.grey }}>{eq.elev}</td>
                    <td style={{ padding: '8px 10px', fontFamily: Fnt.mono, fontSize: 11, color: C.teal }}>{eq.kw}</td>
                    <td style={{ padding: '8px 10px', fontFamily: Fnt.mono, fontSize: 11, color: C.amber }}>{eq.cost}</td>
                    <td style={{ padding: '8px 10px', fontFamily: Fnt.dm, fontSize: 10, color: C.grey }}>{eq.supplier}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: 16, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ background: 'rgba(0,0,0,.2)', border: `1px solid ${C.bdrIdle}`, borderRadius: 6, padding: '10px 16px' }}>
              <div style={{ fontFamily: Fnt.dm, fontSize: 10, fontWeight: 700, color: C.grey, textTransform: 'uppercase' }}>Total Power</div>
              <div style={{ fontFamily: Fnt.mono, fontSize: 16, fontWeight: 700, color: C.teal }}>62 kW</div>
            </div>
            <div style={{ background: 'rgba(0,0,0,.2)', border: `1px solid ${C.bdrIdle}`, borderRadius: 6, padding: '10px 16px' }}>
              <div style={{ fontFamily: Fnt.dm, fontSize: 10, fontWeight: 700, color: C.grey, textTransform: 'uppercase' }}>Total CapEx</div>
              <div style={{ fontFamily: Fnt.mono, fontSize: 16, fontWeight: 700, color: C.amber }}>RFQ Pending</div>
            </div>
            <div style={{ background: 'rgba(0,0,0,.2)', border: `1px solid ${C.bdrIdle}`, borderRadius: 6, padding: '10px 16px' }}>
              <div style={{ fontFamily: Fnt.dm, fontSize: 10, fontWeight: 700, color: C.grey, textTransform: 'uppercase' }}>Monthly Elec</div>
              <div style={{ fontFamily: Fnt.mono, fontSize: 16, fontWeight: 700, color: C.amber }}>$1,806/mo</div>
            </div>
            <div style={{ background: 'rgba(0,0,0,.2)', border: `1px solid ${C.bdrIdle}`, borderRadius: 6, padding: '10px 16px' }}>
              <div style={{ fontFamily: Fnt.dm, fontSize: 10, fontWeight: 700, color: C.grey, textTransform: 'uppercase' }}>Monthly kWh</div>
              <div style={{ fontFamily: Fnt.mono, fontSize: 16, fontWeight: 700, color: C.white }}>19,747</div>
            </div>
          </div>
        </CollapsibleSection>

        {/* SECTION 3: FLOOR PLAN & DIMENSIONS */}
        <CollapsibleSection title="Floor Plan & Equipment Layout" number="3" accent={ACCENT} defaultOpen={false}>
          <div style={{ background: C.navy, border: `1.5px solid ${C.bdrIdle}`, borderRadius: 8, padding: '20px', marginBottom: 16, textAlign: 'center' }}>
            <div style={{ fontFamily: Fnt.syne, fontSize: 14, fontWeight: 700, color: ACCENT, marginBottom: 8 }}>Building A7 — Utility Building (Pos)</div>
            <div style={{ fontFamily: Fnt.mono, fontSize: 13, color: C.amber }}>12m × 18m = 216 m²</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10 }}>
            {NODES.map((n, i) => (
              <div key={i} style={{ background: C.navyField, border: `1.5px solid ${C.bdrIdle}`, borderLeft: `3px solid ${ACCENT}`, borderRadius: 8, padding: '14px 16px' }}>
                <div style={{ fontFamily: Fnt.mono, fontSize: 11, fontWeight: 700, color: ACCENT, marginBottom: 4 }}>{n.code}</div>
                <div style={{ fontFamily: Fnt.syne, fontSize: 12, fontWeight: 700, color: C.white, marginBottom: 6 }}>{n.name}</div>
                <div style={{ fontFamily: Fnt.dm, fontSize: 10, color: C.grey, lineHeight: 1.5, marginBottom: 4 }}>{n.type}</div>
                <div style={{ fontFamily: Fnt.dm, fontSize: 10, color: C.greyMd, lineHeight: 1.5 }}>{n.spec}</div>
                <div style={{ fontFamily: Fnt.mono, fontSize: 10, color: C.teal, marginTop: 4 }}>{n.motor}</div>
                <div style={{ fontFamily: Fnt.dm, fontSize: 9, color: C.grey, marginTop: 6, fontStyle: 'italic' }}>{n.footer}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                {[
                  ['Throughput', '1.5 t/h @ 82% MC', '~0.55 t/h @ 65% MC'],
                  ['Source', 'Mill decanter sludge discharge', 'Dewatered cake'],
                  ['Daily Input', '~30 t fresh (80–92% MC)', '~13.5 t to S2'],
                  ['Installed Power', '~20 kW total', '—'],
                ].map((row, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${C.bdrIdle}` }}>
                    <td style={{ padding: '8px 12px', fontFamily: Fnt.dm, fontSize: 11, fontWeight: 700, color: C.grey }}>{row[0]}</td>
                    <td style={{ padding: '8px 12px', fontFamily: Fnt.mono, fontSize: 12, color: C.teal }}>{row[1]}</td>
                    <td style={{ padding: '8px 12px', fontFamily: Fnt.mono, fontSize: 12, color: C.amber }}>{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CollapsibleSection>

        {/* SECTION 4: CAPEX BREAKDOWN */}
        <CollapsibleSection title="Equipment CAPEX — POS Line" number="4" accent={ACCENT} defaultOpen={false}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(0,0,0,.3)' }}>
                <th style={{ padding: '8px 12px', textAlign: 'left', fontFamily: Fnt.mono, fontSize: 10, fontWeight: 700, color: C.grey, textTransform: 'uppercase' }}>Code</th>
                <th style={{ padding: '8px 12px', textAlign: 'left', fontFamily: Fnt.mono, fontSize: 10, fontWeight: 700, color: C.grey, textTransform: 'uppercase' }}>Equipment</th>
                <th style={{ padding: '8px 12px', textAlign: 'right', fontFamily: Fnt.mono, fontSize: 10, fontWeight: 700, color: C.grey, textTransform: 'uppercase' }}>Cost</th>
              </tr>
            </thead>
            <tbody>
              {POS_EQUIP.map((eq, i) => (
                <tr key={i} style={{ borderBottom: `1px solid rgba(30,107,140,.15)` }}>
                  <td style={{ padding: '8px 12px', fontFamily: Fnt.mono, fontSize: 11, fontWeight: 700, color: ACCENT }}>{eq.code}</td>
                  <td style={{ padding: '8px 12px', fontFamily: Fnt.dm, fontSize: 11, color: C.white }}>{eq.name}</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', fontFamily: Fnt.mono, fontSize: 13, fontWeight: 700, color: C.amber }}>{eq.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: 12, padding: '12px 16px', background: 'rgba(59,130,246,.06)', border: `1px solid rgba(59,130,246,.25)`, borderRadius: 6 }}>
            <div style={{ fontFamily: Fnt.syne, fontSize: 12, fontWeight: 700, color: C.white, marginBottom: 4 }}>POS Line — Decanter Pricing</div>
            <div style={{ fontFamily: Fnt.dm, fontSize: 11, color: C.grey, lineHeight: 1.6 }}>
              RFQ pending: $80K–$150K for 3-phase decanter centrifuge. Suppliers: PT Kharismapratama, SCK-Modipalm, Alfa Laval.
              Other equipment (hopper, pump, tank, screen, mixer, filter press) pricing TBC from local fabricators.
            </div>
          </div>
          <div style={{ marginTop: 10, fontFamily: Fnt.dm, fontSize: 11, color: C.grey }}>
            Monthly electricity: $1,806/mo · 19,747 kWh · PLN I-3 tariff IDR 1,444.70/kWh
          </div>
        </CollapsibleSection>
      </div>
    </>
  );
}
