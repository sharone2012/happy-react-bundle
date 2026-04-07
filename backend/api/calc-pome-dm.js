'use strict';

const SCENARIOS = {
  A: { id: 'A', dmLow: 1,  dmMid: 2,   dmHigh: 3  },
  B: { id: 'B', dmLow: 5,  dmMid: 7.5, dmHigh: 10 },
};
const MC_OPTIONS = [65, 70, 75, 78, 80, 82, 85];

module.exports = function calcPomeDm(req, res) {
  const {
    ffb, util, hrs, days,
    scenario, dmPoint, lockedMC,
    dec2Active, dec2TSSin, dec2TSSrem, dec2CakeMC,
  } = req.body;

  const sc    = SCENARIOS[scenario] || SCENARIOS.A;
  const dmVal = dmPoint === 'low' ? sc.dmLow : dmPoint === 'high' ? sc.dmHigh : sc.dmMid;

  const effFFB        = +(ffb * util / 100).toFixed(2);
  const ffbDay        = +(effFFB * hrs).toFixed(1);
  const ffbMonth      = +(ffbDay * days).toFixed(0);
  const pomeDMday     = +(ffbDay * dmVal / 1000).toFixed(3);
  const pomeDMmonth   = +(pomeDMday * days).toFixed(2);
  const pomeM3hr      = +(effFFB * 0.7).toFixed(1);
  const pomeM3day     = +(pomeM3hr * hrs).toFixed(0);
  const biogasDay     = +(pomeM3day * 28).toFixed(0);
  const ch4Day        = +(pomeM3day * 15.4).toFixed(0);
  const ghgAvoidedDay = +(pomeM3day * 378).toFixed(0);

  const dec2WetSolids    = dec2Active ? +(dec2TSSin * (dec2TSSrem / 100) * +pomeM3day / 1000000).toFixed(2) : 0;
  const dec2DM           = dec2Active ? +(dec2WetSolids * (1 - dec2CakeMC / 100)).toFixed(3) : 0;
  const totalPomeDMday   = +(pomeDMday + dec2DM).toFixed(3);
  const totalPomeDMmonth = +(totalPomeDMday * days).toFixed(2);

  const rows = MC_OPTIONS.map(mc => {
    const dmFrac = (100 - mc) / 100;
    const fw     = +(pomeDMday / dmFrac).toFixed(2);
    const water  = +(fw - pomeDMday).toFixed(2);
    const pctFFB = ffbDay > 0 ? +(fw / ffbDay * 100).toFixed(3) : 0;
    return { mc, fw, water, pctFFB };
  });

  const lockedRow = rows.find(r => r.mc === lockedMC) || rows[4] || rows[0];

  const rangeRows = ['A', 'B'].flatMap(sid => {
    const s = SCENARIOS[sid];
    return ['low', 'mid', 'high'].map(pt => {
      const dv = pt === 'low' ? s.dmLow : pt === 'high' ? s.dmHigh : s.dmMid;
      const dm = +(ffbDay * dv / 1000).toFixed(3);
      const fw = +(dm / ((100 - lockedMC) / 100)).toFixed(2);
      return { scenario: sid, point: pt, dmKgFFB: dv, dm, fw };
    });
  });

  res.json({
    effFFB, ffbDay, ffbMonth,
    pomeDMday, pomeDMmonth,
    pomeM3hr, pomeM3day,
    biogasDay, ch4Day, ghgAvoidedDay,
    dec2WetSolids, dec2DM, totalPomeDMday, totalPomeDMmonth,
    rows, lockedRow, rangeRows,
  });
};
