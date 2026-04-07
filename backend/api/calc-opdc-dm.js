'use strict';

const OPDC_CANONICAL = {
  yieldPctFFB: 4.2, yieldPctEFB: 15.2, mcDefault: 70, mcMin: 40,
  lignin: 30.7, protein: 14.5, cn: 20, ash: 4.8,
  ndk: 3.11, pdk: 0.42, kdk: 1.85, cadk: 0.31, mgdk: 0.18,
  selfSuffRatio: 0.38, importRequired: 42,
};
const MC_OPTIONS = [40, 50, 60, 65, 68, 70, 72, 75];

module.exports = function calcOpdcDm(req, res) {
  const { ffb, util, hrs, days, yieldPct, mc, lockedMC } = req.body;

  const effFFB      = +(ffb * util / 100).toFixed(2);
  const ffbDay      = +(effFFB * hrs).toFixed(1);
  const ffbMonth    = +(ffbDay * days).toFixed(0);
  const opdcFWhr    = +(effFFB * yieldPct / 100).toFixed(3);
  const opdcFWday   = +(opdcFWhr * hrs).toFixed(2);
  const opdcFWmonth = +(opdcFWday * days).toFixed(1);
  const dmFrac      = (100 - mc) / 100;
  const opdcDMhr    = +(opdcFWhr * dmFrac).toFixed(4);
  const opdcDMday   = +(opdcFWday * dmFrac).toFixed(3);
  const opdcDMmonth = +(opdcDMday * days).toFixed(2);
  const waterDay    = +(opdcFWday - opdcDMday).toFixed(3);

  const bsfReqDMday = +(opdcDMday / OPDC_CANONICAL.selfSuffRatio).toFixed(2);
  const shortfallDM = +(bsfReqDMday - opdcDMday).toFixed(2);
  const selfSuffPct = +(opdcDMday / bsfReqDMday * 100).toFixed(1);

  const nDay       = +(opdcDMday * 1000 * OPDC_CANONICAL.ndk  / 100).toFixed(1);
  const pDay       = +(opdcDMday * 1000 * OPDC_CANONICAL.pdk  / 100).toFixed(1);
  const kDay       = +(opdcDMday * 1000 * OPDC_CANONICAL.kdk  / 100).toFixed(1);
  const caDay      = +(opdcDMday * 1000 * OPDC_CANONICAL.cadk / 100).toFixed(1);
  const mgDay      = +(opdcDMday * 1000 * OPDC_CANONICAL.mgdk / 100).toFixed(1);
  const ligninDay  = +(opdcDMday * OPDC_CANONICAL.lignin  / 100).toFixed(3);
  const proteinDay = +(opdcDMday * OPDC_CANONICAL.protein / 100).toFixed(3);

  const efbFWday   = +(ffbDay * 22.5 / 100).toFixed(1);
  const opdcPctEFB = +(opdcFWday / efbFWday * 100).toFixed(2);
  const mcBelowFloor = mc < OPDC_CANONICAL.mcMin;

  const rows = MC_OPTIONS.map(mcOpt => {
    const df   = (100 - mcOpt) / 100;
    const fw   = +(opdcDMday / df).toFixed(2);
    const wt   = +(fw - opdcDMday).toFixed(2);
    const pct  = +(fw / ffbDay * 100).toFixed(3);
    const flag = mcOpt < OPDC_CANONICAL.mcMin;
    return { mc: mcOpt, fw, dm: opdcDMday, water: wt, pctFFB: pct, flag };
  });

  const lockedRow = rows.find(r => r.mc === lockedMC) ||
    { mc, fw: opdcFWday, dm: opdcDMday, water: waterDay, pctFFB: +(opdcFWday / ffbDay * 100).toFixed(3), flag: false };

  res.json({
    effFFB, ffbDay, ffbMonth,
    opdcFWhr, opdcFWday, opdcFWmonth,
    opdcDMhr, opdcDMday, opdcDMmonth,
    waterDay, bsfReqDMday, shortfallDM, selfSuffPct,
    nDay, pDay, kDay, caDay, mgDay, ligninDay, proteinDay,
    efbFWday, opdcPctEFB, mcBelowFloor,
    rows, lockedRow,
  });
};
