'use strict';

function calcBayA(pressCakeTpd, bayCapT) {
  return Math.ceil(pressCakeTpd / bayCapT + 3);
}
function calcMixerCount(inputTpd, batchT, cycleMin) {
  return Math.ceil((inputTpd / batchT) / ((24 * 60) / cycleMin));
}

module.exports = function calcS1S2(req, res) {
  const {
    ffbTph, opsH, efbRatio, opdcRatio, pomeTpd, inclPome,
    efbMc, opdcMc, pomeMc, pressMc,
    bayCap, efbBatch, opdcBatch, cycleMin, pressRate, blendRate,
    pksaDose, limeDose, bufferH,
  } = req.body;

  const ffbTpd = ffbTph * opsH;

  // EFB stream
  const efbFresh    = ffbTpd * efbRatio / 100;
  const efbDm       = efbFresh * (1 - efbMc / 100);
  const efbCake     = efbDm / (1 - pressMc / 100);
  const efbTph      = efbCake / 24;
  const efbMixers   = calcMixerCount(efbFresh, efbBatch, cycleMin);
  const efbMixCap   = efbMixers * efbBatch * (24 * 60 / cycleMin);
  const efbMixUtil  = efbFresh / efbMixCap * 100;
  const efbPresses  = Math.ceil(efbTph / pressRate) + 1;
  const efbPressUtil = efbTph / (efbPresses * pressRate) * 100;
  const efbBayA     = calcBayA(efbCake, bayCap);
  const efbRowA     = efbDm / 0.45;
  const efbHopper   = (efbRowA / 24 * bufferH) / 0.40;
  const efbFill     = bayCap / efbTph;

  // OPDC + POME stream
  const opdcFresh    = ffbTpd * opdcRatio / 100;
  const opdcDm       = opdcFresh * (1 - opdcMc / 100);
  const pomeDm       = inclPome ? pomeTpd * (1 - pomeMc / 100) : 0;
  const pomeDecanter = inclPome ? pomeDm / 0.35 : 0;
  const combinedDm   = opdcDm + pomeDm;
  const opdcCake     = combinedDm / (1 - pressMc / 100);
  const opdcTph      = opdcCake / 24;
  const opdcMixInput = opdcFresh + pomeDecanter;
  const opdcMixers   = calcMixerCount(opdcMixInput, opdcBatch, cycleMin);
  const opdcMixCap   = opdcMixers * opdcBatch * (24 * 60 / cycleMin);
  const opdcMixUtil  = opdcMixInput / opdcMixCap * 100;
  const opdcPressUtil = opdcTph / pressRate * 100;
  const opdcBayA     = calcBayA(opdcCake, bayCap);
  const opdcRowA     = combinedDm / 0.45;
  const opdcHopper   = (opdcRowA / 24 * bufferH) / 0.40;
  const opdcFill     = bayCap / opdcTph;

  // Blend
  const blendTpd = efbRowA + opdcRowA;
  const blendTph = blendTpd / 24;
  const efbPct   = efbRowA / blendTpd * 100;
  const loadEach = blendTph / 2;
  const utilEach = loadEach / blendRate * 100;
  const limeKgDay = blendTpd * limeDose;

  // PKSA doses
  const pksa_efb  = efbFresh * pksaDose;
  const pksa_opdc = opdcMixInput * pksaDose;

  // CAPEX delta
  const pressAdd  = (efbPresses - 2) * 65000;
  const blendAdd  = 2 * 45000;
  const hopperAdd = 2 * 18000 + 12000;
  const weighAdd  = 3 * 8000;
  const limeAdd   = 15000;
  const rowBSave  = -8 * 8000;
  const net = pressAdd + blendAdd + hopperAdd + weighAdd + limeAdd + rowBSave;

  res.json({
    ffbTpd,
    efb:  { fresh: efbFresh, dm: efbDm, cake: efbCake, tph: efbTph, mixers: efbMixers, mixUtil: efbMixUtil, presses: efbPresses, pressUtil: efbPressUtil, bayA: efbBayA, rowA: efbRowA, hopper: efbHopper, fill: efbFill, pksa: pksa_efb },
    opdc: { fresh: opdcFresh, dm: opdcDm, cake: opdcCake, tph: opdcTph, mixInput: opdcMixInput, mixers: opdcMixers, mixUtil: opdcMixUtil, pressUtil: opdcPressUtil, bayA: opdcBayA, rowA: opdcRowA, hopper: opdcHopper, fill: opdcFill, pksa: pksa_opdc },
    pome: { dm: pomeDm, decanter: pomeDecanter },
    blend: { tpd: blendTpd, tph: blendTph, efbPct, loadEach, utilEach, limeKgDay },
    capex: { pressAdd, blendAdd, hopperAdd, weighAdd, limeAdd, rowBSave, net },
  });
};
