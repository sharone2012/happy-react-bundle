/**
 * S1ResidueCards — self-contained residue card grid.
 * Reads S0 Redux state directly. Manages its own modal state.
 * Can be embedded in any page (SiteSetup, S1Hub, etc.) without routing.
 */
import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useMill } from "../../contexts/MillContext";
import S1ResidueModal from "../S1ResidueModal/S1ResidueModal.jsx";
import { C, Fnt } from "../S1Shared/S1Shared.jsx";

const MODAL_KEYS = ['efb', 'opdc', 'pos'];

const STREAM_META = {
  efb: {
    name: 'Empty Fruit Bunches', abbr: 'EFB', accent: C.teal, route: '/s1/efb',
    specs: [
      { lbl: 'B.1  Inlet MC',            val: '62.5% wb' },
      { lbl: 'B.2  Post-Press MC Target', val: '45\u201350% wb' },
      { lbl: 'B.3  Particle Size (D90)',  val: '\u2264 2 mm' },
      { lbl: 'B.5  Total Press Water',    val: '1,181 t / month' },
      { lbl: 'B.6  Press Water Routing',  val: '\u2192 POME Pond Only' },
      { lbl: 'B.7  Post-Press (FW)',      val: '7,081 t / month', hi: true },
    ],
    gates: [
      { id: 'B.G1', lbl: 'Particle Size Gate',  note: 'D90 \u2264 2mm \u2014 enter shift result' },
      { id: 'B.G2', lbl: 'Post-Press MC Gate',   note: 'Operator confirms \u2264 50%' },
    ],
  },
  opdc: {
    name: 'Decanter Cake', abbr: 'OPDC', accent: C.amber, route: '/s1/opdc',
    specs: [
      { lbl: 'C.1  Inlet MC',              val: '70\u201375% wb' },
      { lbl: 'C.2  Post-Press MC (CLASS A)',val: '\u2265 40% wb \u2014 LOCKED', warn: true },
      { lbl: 'C.3  Buffer Dwell',           val: '\u2265 24 hrs',              warn: true },
      { lbl: 'C.4  Post-Buffer pH Target',  val: '8.0\u20139.0' },
      { lbl: 'C.5  OPDC Filtrate Out',      val: '180 t / month' },
      { lbl: 'C.6  Filtrate Routing',       val: '\u2192 POME Pond Only' },
      { lbl: 'C.7  Post-Press (FW)',        val: '1,076 t / month', hi: true },
    ],
    gates: [
      { id: 'C.G1', lbl: 'MC Floor \u2014 CLASS A',  note: 'Math.max(40, reading)' },
      { id: 'C.G2', lbl: 'pH Gate',                   note: 'No blend until 8.0\u20139.0' },
      { id: 'C.G3', lbl: 'Buffer Dwell Gate',          note: 'Enter actual hours logged' },
    ],
  },
  pos: {
    name: 'Palm Oil Sludge', abbr: 'POS', accent: '#3B82F6', route: '/s1/pos',
    specs: [
      { lbl: 'D.1  Fe (ICP-OES, mg/kg DM)', val: 'Awaiting result', warn: true },
      { lbl: 'D.2  Inclusion Rate',          val: '\u2014 Awaiting Fe', warn: true },
      { lbl: 'D.3  POS Inlet MC',            val: '82% wb' },
      { lbl: 'D.4  Ash Content',             val: '28% DM' },
      { lbl: 'D.5  Crude Protein',           val: '11% DM' },
      { lbl: 'D.6  Ether Extract (EE)',      val: '10% DM' },
      { lbl: 'D.7  POS To Blend (FW)',       val: 'DATA GAP', warn: true },
    ],
    gates: [],
  },
  pmf: {
    name: 'Palm Mesocarp Fiber', abbr: 'PMF', accent: '#9B59B6', route: null,
    specs: [
      { lbl: 'Moisture',   val: '35\u201340% wb' },
      { lbl: 'Lignin ADL', val: '~20% DM' },
      { lbl: 'C:N Ratio',  val: '~80:1' },
      { lbl: 'Source',     val: 'Zero Cost \u00b7 S0 Mill' },
    ],
    gates: [],
  },
  pome: {
    name: 'POME (Liquid)', abbr: 'POME', accent: '#00C9B1', route: null,
    specs: [
      { lbl: 'BOD',     val: '~25,000 mg/L' },
      { lbl: 'COD',     val: '~55,000 mg/L' },
      { lbl: 'Total N', val: '~800 mg/L' },
      { lbl: 'Role',    val: 'Emissions avoidance only' },
    ],
    gates: [],
  },
  pke: {
    name: 'Palm Kernel Expeller', abbr: 'PKE', accent: '#F97316', route: null,
    specs: [
      { lbl: 'Moisture',      val: '12% wb' },
      { lbl: 'Crude Protein', val: '16\u201318% DM' },
      { lbl: 'C:N Ratio',     val: '~8:1' },
      { lbl: 'Cost',          val: '$160 / t \u2014 Purchased', warn: true },
    ],
    gates: [],
  },
  opf: {
    name: 'Oil Palm Fronds', abbr: 'OPF', accent: '#84CC16', route: null,
    specs: [
      { lbl: 'Moisture',     val: '~65% wb' },
      { lbl: 'C:N Ratio',    val: '~55:1' },
      { lbl: 'Availability', val: 'Seasonal' },
      { lbl: 'Source',       val: 'Zero Cost \u00b7 Estate' },
    ],
    gates: [],
  },
  opt: {
    name: 'Oil Palm Trunks', abbr: 'OPT', accent: '#A8A29E', route: null,
    specs: [
      { lbl: 'Moisture',     val: '~60% wb' },
      { lbl: 'Lignin ADL',   val: '~25% DM' },
      { lbl: 'C:N Ratio',    val: '~120:1' },
      { lbl: 'Availability', val: 'Replanting only' },
    ],
    gates: [],
  },
  pks: {
    name: 'Palm Kernel Shell', abbr: 'PKS', accent: '#78716C', route: null,
    specs: [
      { lbl: 'Moisture',        val: '~15% wb' },
      { lbl: 'Calorific Value', val: '~18 MJ/kg' },
      { lbl: 'Note',            val: 'Primarily fuel use' },
    ],
    gates: [],
  },
};

export default function S1ResidueCards() {
  const [activeModal, setActiveModal] = useState(null);
  const { site, derived } = useMill();

  const s0ActiveStreams  = useSelector(s => s.s0.activeStreams);
  const s0StreamVolumes = useSelector(s => s.s0.streamVolumes);
  const s0CustomNames   = useSelector(s => s.s0.customStreamNames);

  const selectedResidueKeys = useMemo(() => {
    const standard = Object.keys(s0ActiveStreams).filter(k => s0ActiveStreams[k]);
    const custom   = Object.keys(s0CustomNames).filter(k => s0ActiveStreams[k]);
    return [...new Set([...standard, ...custom])];
  }, [s0ActiveStreams, s0CustomNames]);

  const s1Calc = useMemo(() => {
    const efbFW  = derived?.monthlyEfb  || 0;
    const opdcFW = derived?.monthlyOpdc || 0;
    const posFW  = derived?.monthlyPos  || 0;
    const efbDM   = efbFW  * 0.375 * 0.97;
    const opdcDM  = opdcFW * 0.30  * 0.99;
    const posDM   = posFW  * 0.18  * 0.95;
    const totalDM = efbDM + opdcDM + posDM;
    const efbTPH  = efbFW  > 0 ? (efbFW  / 30 / 20).toFixed(1) : '\u2014';
    const opdcTPH = opdcFW > 0 ? (opdcFW / 30 / 20).toFixed(1) : '\u2014';
    const posTPH  = posFW  > 0 ? (posFW  / 30 / 20).toFixed(1) : '\u2014';
    return { efbFW, opdcFW, posFW, efbDM, opdcDM, posDM, totalDM, efbTPH, opdcTPH, posTPH };
  }, [derived]);

  return (
    <>
      {activeModal != null && (
        <S1ResidueModal
          active={activeModal}
          onClose={() => setActiveModal(null)}
          site={site}
          calc={s1Calc}
        />
      )}

      <div style={{ margin: '20px 0 0' }}>
        {/* Section heading */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
          <div style={{ width: 3, height: 14, borderRadius: 2, background: C.teal, flexShrink: 0 }} />
          <div style={{ fontFamily: Fnt.syne, fontWeight: 700, fontSize: 13, color: C.teal, textTransform: 'uppercase', letterSpacing: '.06em' }}>
            S0 Selected Residues \u2014 Pre-Processing Input
          </div>
          <div style={{ fontFamily: Fnt.dm, fontSize: 11, color: C.grey, marginLeft: 4 }}>
            {selectedResidueKeys.length > 0
              ? `${selectedResidueKeys.length} residue${selectedResidueKeys.length > 1 ? 's' : ''} confirmed from S0`
              : 'No residues selected in S0'}
          </div>
          <div style={{ flex: 1 }} />
          {selectedResidueKeys.length > 0 && (
            <button
              onClick={() => setActiveModal({ residue: 'combined', tab: 0 })}
              style={{
                padding: '6px 16px',
                background: 'rgba(0,162,73,.1)',
                border: '1.5px solid rgba(0,162,73,.4)',
                borderRadius: 7,
                fontFamily: Fnt.dm,
                fontSize: 12,
                fontWeight: 700,
                color: '#00A249',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              All Residues Combined \u2192
            </button>
          )}
        </div>

        {/* Empty state */}
        {selectedResidueKeys.length === 0 ? (
          <div style={{
            background: C.navyCard,
            border: '1px dashed rgba(139,160,180,.25)',
            borderRadius: 10,
            padding: '24px 20px',
            textAlign: 'center',
            color: C.grey,
            fontFamily: Fnt.dm,
            fontSize: 12,
          }}>
            No residues selected \u2014 configure in S0 Site Setup
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
            gap: 14,
            alignItems: 'stretch',
          }}>
            {selectedResidueKeys.map(key => {
              const meta = STREAM_META[key] ?? {
                name:   s0CustomNames[key] ?? key,
                abbr:   key.toUpperCase().slice(0, 6),
                accent: C.grey,
                route:  null,
                specs:  [],
                gates:  [],
              };
              const volume = s0StreamVolumes[key];
              const volDisplay = volume != null ? Number(volume).toLocaleString() : '\u2014';
              const specs = meta.specs ?? [];
              const gates = meta.gates ?? [];
              const hasModal = MODAL_KEYS.includes(key);

              return (
                <div
                  key={key}
                  style={{
                    background: 'rgba(64,215,197,0.15)',
                    border: '1.5px solid rgba(64,215,197,0.60)',
                    borderLeft: `4px solid ${meta.accent}`,
                    borderRadius: 8,
                    padding: '12px 14px 10px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0,
                    transition: 'box-shadow .15s',
                  }}
                >
                  {/* Header: name + abbr badge */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 6, marginBottom: 10 }}>
                    <div style={{ fontFamily: Fnt.dm, fontSize: 14, fontWeight: 700, color: C.amber, lineHeight: 1.3 }}>
                      {meta.name}
                    </div>
                    <span style={{
                      fontFamily: Fnt.mono, fontSize: 10, fontWeight: 700,
                      padding: '2px 7px', borderRadius: 4,
                      background: `${meta.accent}20`, border: `1px solid ${meta.accent}55`,
                      color: meta.accent, flexShrink: 0, letterSpacing: '.04em',
                    }}>
                      {meta.abbr}
                    </span>
                  </div>

                  {/* S0 volume row */}
                  <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '5px 0', marginBottom: 2,
                    borderBottom: '1px solid rgba(64,215,197,0.20)',
                  }}>
                    <span style={{ fontFamily: Fnt.dm, fontSize: 11, color: C.grey, whiteSpace: 'nowrap' }}>S0 Input Volume</span>
                    <span style={{ fontFamily: Fnt.mono, fontSize: 13, fontWeight: 700, color: C.amber, whiteSpace: 'nowrap' }}>
                      {volDisplay}{volume != null ? ' t/mo' : ''}
                    </span>
                  </div>

                  {/* Spec field rows */}
                  {specs.length > 0 && (
                    <div style={{ marginTop: 4, marginBottom: 6 }}>
                      {specs.map((sp, si) => (
                        <div key={si} style={{
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          gap: 8, padding: '4px 0',
                          borderBottom: si < specs.length - 1 ? '1px solid rgba(30,107,140,0.15)' : 'none',
                        }}>
                          <span style={{
                            fontFamily: Fnt.dm, fontSize: 11, color: C.grey,
                            flex: 1, minWidth: 0,
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          }}>
                            {sp.lbl}
                          </span>
                          <span style={{
                            fontFamily: Fnt.mono, fontSize: 12, fontWeight: 700,
                            whiteSpace: 'nowrap', flexShrink: 0, textAlign: 'right',
                            color: sp.warn ? C.red : sp.hi ? C.green : C.white,
                          }}>
                            {sp.val}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Gate indicators */}
                  {gates.length > 0 && (
                    <div style={{
                      marginTop: 4, marginBottom: 8,
                      padding: '6px 8px',
                      background: 'rgba(0,0,0,0.25)',
                      borderRadius: 6,
                      border: '1px solid rgba(245,166,35,0.20)',
                    }}>
                      {gates.map((g, gi) => (
                        <div key={gi} style={{
                          display: 'flex', alignItems: 'flex-start', gap: 6,
                          marginBottom: gi < gates.length - 1 ? 5 : 0,
                        }}>
                          <span style={{
                            width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
                            background: C.amber, marginTop: 3, display: 'inline-block',
                          }} />
                          <div>
                            <span style={{ fontFamily: Fnt.mono, fontSize: 10, fontWeight: 700, color: C.amber }}>{g.id} </span>
                            <span style={{ fontFamily: Fnt.dm, fontSize: 10, color: C.grey }}>{g.note}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Push buttons to bottom */}
                  <div style={{ flex: 1 }} />

                  {/* Open Details button (EFB / OPDC / POS only) */}
                  {hasModal && (
                    <button
                      onClick={() => setActiveModal({ residue: key, tab: 0 })}
                      style={{
                        marginTop: 6,
                        padding: '5px 0',
                        background: `${meta.accent}10`,
                        border: `1px solid ${meta.accent}44`,
                        borderRadius: 6,
                        fontFamily: Fnt.dm,
                        fontSize: 11,
                        fontWeight: 700,
                        color: meta.accent,
                        cursor: 'pointer',
                        width: '100%',
                        letterSpacing: '.02em',
                      }}
                    >
                      Open {meta.abbr} Details
                    </button>
                  )}

                  {/* View Process Flow button — opens ASCII tab in modal, no navigation */}
                  <button
                    onClick={() => hasModal ? setActiveModal({ residue: key, tab: 4 }) : undefined}
                    disabled={!hasModal}
                    style={{
                      marginTop: 4,
                      padding: '6px 0',
                      background: hasModal ? `${meta.accent}18` : 'rgba(139,160,180,.06)',
                      border: `1px solid ${hasModal ? meta.accent + '55' : 'rgba(139,160,180,.2)'}`,
                      borderRadius: 6,
                      fontFamily: Fnt.dm,
                      fontSize: 12,
                      fontWeight: 700,
                      color: hasModal ? meta.accent : C.grey,
                      cursor: hasModal ? 'pointer' : 'not-allowed',
                      opacity: hasModal ? 1 : 0.5,
                      transition: 'background .15s',
                      width: '100%',
                      letterSpacing: '.02em',
                    }}
                  >
                    {hasModal ? `\u2197 View ${meta.abbr} Process Flow` : 'Detail \u2014 Coming Soon'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
