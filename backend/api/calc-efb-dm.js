'use strict';

const EFB_CANONICAL = {
  yieldPctFFB: 22.5, mcDefault: 62.5, lignin: 22.0, protein: 4.75,
  cn: 60, ash: 5.5, ndk: 1.02, pdk: 0.15, kdk: 2.90, cadk: 0.23, mgdk: 0.13,
};
const MC_OPTIONS = [55, 58, 60, 62, 62.5, 65, 67];

module.exports = function calcEfbDm(req, res) {
  const { ffb, util, hrs, days, yieldPct, mc, lockedMC } = req.body;

  const effFFB     = +(ffb * util / 100).toFixed(2);
  const ffbDay     = +(effFFB * hrs).toFixed(1);
  const ffbMonth   = +(ffbDay * days).toFixed(0);
  const efbFWhr    = +(effFFB * yieldPct / 100).toFixed(2);
  const efbFWday   = +(efbFWhr * hrs).toFixed(1);
  const efbFWmonth = +(efbFWday * days).toFixed(0);
  const dmFrac     = (100 - mc) / 100;
  const efbDMhr    = +(efbFWhr * dmFrac).toFixed(3);
  const efbDMday   = +(efbFWday * dmFrac).toFixed(2);
  const efbDMmonth = +(efbDMday * days).toFixed(1);
  const waterDay   = +(efbFWday - efbDMday).toFixed(2);

  const nDay       = +(efbDMday * 1000 * EFB_CANONICAL.ndk  / 100).toFixed(1);
  const pDay       = +(efbDMday * 1000 * EFB_CANONICAL.pdk  / 100).toFixed(1);
  const kDay       = +(efbDMday * 1000 * EFB_CANONICAL.kdk  / 100).toFixed(1);
  const caDay      = +(efbDMday * 1000 * EFB_CANONICAL.cadk / 100).toFixed(1);
  const mgDay      = +(efbDMday * 1000 * EFB_CANONICAL.mgdk / 100).toFixed(1);
  const ligninDay  = +(efbDMday * EFB_CANONICAL.lignin  / 100).toFixed(2);
  const proteinDay = +(efbDMday * EFB_CANONICAL.protein / 100).toFixed(2);

  const rows = MC_OPTIONS.map(mcOpt => {
    const df  = (100 - mcOpt) / 100;
    const fw  = +(efbDMday / df).toFixed(1);
    const dm  = efbDMday;
    const wt  = +(fw - dm).toFixed(1);
    const pct = +(fw / ffbDay * 100).toFixed(2);
    return { mc: mcOpt, fw, dm, water: wt, pctFFB: pct };
  });

  const lockedRow = rows.find(r => r.mc === lockedMC) ||
    { mc, fw: efbFWday, dm: efbDMday, water: waterDay, pctFFB: +(efbFWday / ffbDay * 100).toFixed(2) };

  res.json({
    effFFB, ffbDay, ffbMonth,
    efbFWhr, efbFWday, efbFWmonth,
    efbDMhr, efbDMday, efbDMmonth,
    waterDay, nDay, pDay, kDay, caDay, mgDay, ligninDay, proteinDay,
    rows, lockedRow,
  });
};
