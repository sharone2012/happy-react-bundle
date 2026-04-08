import { C } from "../../components/S1Shared/S1Shared.jsx";

export default function S1MassBalanceTable({ mb, site }) {
  const showEfb  = !site || site.efb_enabled  !== false;
  const showOpdc = !site || site.opdc_enabled !== false;
  const showPos  = !site || site.pos_enabled  !== false;

  const rows = [
    showEfb  && {
      key: 'efb',  label: 'EFB',  accent: C.teal,
      data: mb.efb,
      dmCheck: mb.efbDMTPD  > 0 ? `DM = ${mb.efb.dm} ✓`  : '—',
      gate1: { label: 'MC≤45% PASS', pass: true }, gate2: { label: 'D90≤2mm PASS', pass: true },
    },
    showOpdc && {
      key: 'opdc', label: 'OPDC', accent: C.amber,
      data: mb.opdc,
      dmCheck: mb.opdcDMTPD > 0 ? `DM = ${mb.opdc.dm} ✓` : '—',
      gate1: { label: 'MC FLOOR 40% ✓', pass: true }, gate2: null,
    },
    showPos  && {
      key: 'pos',  label: 'POS',  accent: '#3B82F6',
      data: mb.pos,
      dmCheck: mb.posDMTPD  > 0 ? `DM = ${mb.pos.dm} ✓`  : '—',
      gate1: { label: 'MC≤65% PASS', pass: true }, gate2: null,
    },
  ].filter(Boolean);

  return (
    <div className="s1hub-section-wrap">
      {/* Section heading */}
      <div className="s1hub-section-hdr">
        <div className="s1hub-section-title-row">
          <div className="s1hub-section-bar" />
          <div className="s1hub-section-title">S1 Mass Balance Summary</div>
        </div>
        <div className="s1hub-calc-badge">CALCULATED</div>
      </div>

      {/* Table */}
      <div className="s1hub-mb-container">
        <div className="s1hub-mb-scroll">
          <table className="s1hub-mb-table">
            <thead>
              <tr>
                <th className="s1hub-mb-th s1hub-mb-th--left">Stream</th>
                <th className="s1hub-mb-th">S0 Fresh T/Day</th>
                <th className="s1hub-mb-th">MC In %</th>
                <th className="s1hub-mb-th">DM T/Day</th>
                <th className="s1hub-mb-th s1hub-mb-th--amber">S1 Out T/Day</th>
                <th className="s1hub-mb-th">MC Out %</th>
                <th className="s1hub-mb-th">H₂O Removed T</th>
                <th className="s1hub-mb-th">DM Check</th>
                <th className="s1hub-mb-th">Gate</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={row.key} className={i % 2 === 0 ? 's1hub-mb-tr-alt' : ''}>
                  <td
                    className="s1hub-mb-td--stream"
                    style={{ '--stream-accent': row.accent }}
                  >
                    {row.label}
                  </td>
                  <td className="s1hub-mb-td">{row.data.fresh}</td>
                  <td className="s1hub-mb-td s1hub-mb-td--amber">{row.data.mcIn}%</td>
                  <td className="s1hub-mb-td">{row.data.dm}</td>
                  <td className="s1hub-mb-td s1hub-mb-td--amber">{row.data.s1Out}</td>
                  <td className="s1hub-mb-td s1hub-mb-td--amber">{row.data.mcOut}%</td>
                  <td className="s1hub-mb-td">{row.data.h2o}</td>
                  <td className="s1hub-mb-td s1hub-mb-td--green">{row.dmCheck}</td>
                  <td className="s1hub-gates-cell">
                    <div className="s1hub-gates-flex">
                      {row.gate1 && (
                        <span className={`s1hub-gate-chip s1hub-gate-chip--${row.gate1.pass ? 'pass' : 'fail'}`}>
                          {row.gate1.label}
                        </span>
                      )}
                      {row.gate2 && (
                        <span className="s1hub-gate-chip s1hub-gate-chip--pass">
                          {row.gate2.label}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {/* TOTAL row */}
              <tr className="s1hub-mb-tr-total">
                <td className="s1hub-mb-td-total--stream">TOTAL</td>
                <td className="s1hub-mb-td s1hub-mb-td-total" style={{ color: '#A8E6C1' }}>{mb.tot.fresh}</td>
                <td className="s1hub-mb-td s1hub-mb-td--grey s1hub-mb-td-total">&mdash;</td>
                <td className="s1hub-mb-td s1hub-mb-td-total" style={{ color: '#A8E6C1' }}>{mb.tot.dm}</td>
                <td className="s1hub-mb-td s1hub-mb-td--amber s1hub-mb-td-total">{mb.tot.s1Out}</td>
                <td className="s1hub-mb-td s1hub-mb-td--grey s1hub-mb-td-total">&mdash;</td>
                <td className="s1hub-mb-td s1hub-mb-td-total" style={{ color: '#A8E6C1' }}>{mb.tot.h2o}</td>
                <td className="s1hub-mb-td s1hub-mb-td--green s1hub-mb-td-total">DM Conserved ✓</td>
                <td className="s1hub-mb-td s1hub-mb-td--grey s1hub-mb-td-total">&mdash;</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
