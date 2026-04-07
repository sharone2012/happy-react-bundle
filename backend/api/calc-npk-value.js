'use strict';

const SOILS = [
  { id: 'ultisol',    nAdj: 0,     pAdj: 0     },
  { id: 'inceptisol', nAdj: -0.40, pAdj: -0.50 },
  { id: 'oxisol',     nAdj: 0.10,  pAdj: 0.20  },
  { id: 'histosol',   nAdj: -0.80, pAdj: -0.70 },
  { id: 'spodosol',   nAdj: 0.20,  pAdj: 0.15  },
];

const COM = { n: 0.761, p: 0.978, k: 0.633 };
const SM  = { n: 1.50,  p: 1.80,  k: 0.90  };

const STR = {
  efb:  { n: 0.76, p: 0.06, k: 0.74, mc: 62.5, ffbRatio: 0.225,  opdcRatio: null  },
  opdc: { n: 2.32, p: 0.30, k: 0.75, mc: 70.0, ffbRatio: null,   opdcRatio: 0.152 },
  pome: { n: 1.76, p: 0.40, k: 0.70, mc: 82.0, ffbRatio: 0.0245, opdcRatio: null  },
};

module.exports = function calcNpkValue(req, res) {
  const { mill, estate, rec } = req.body;
  const { tph, hrsDay, daysYear, efbCapture, inclOpdc, inclPome, pomeInclPct } = mill;
  const soil = SOILS.find(s => s.id === estate.soilId) || SOILS[0];

  const ffbDay = tph * hrsDay;

  // EFB
  const efbFW = ffbDay * STR.efb.ffbRatio * (efbCapture / 100);
  const efbDM = efbFW  * (1 - STR.efb.mc / 100);
  const efbN  = efbDM  * STR.efb.n / 100 * 1000;
  const efbP  = efbDM  * STR.efb.p / 100 * 1000;
  const efbK  = efbDM  * STR.efb.k / 100 * 1000;

  // OPDC
  const opdcFW = inclOpdc ? efbFW * STR.opdc.opdcRatio : 0;
  const opdcDM = opdcFW * (1 - STR.opdc.mc / 100);
  const opdcN  = opdcDM * STR.opdc.n / 100 * 1000;
  const opdcP  = opdcDM * STR.opdc.p / 100 * 1000;
  const opdcK  = opdcDM * STR.opdc.k / 100 * 1000;

  // POME sludge
  const pomeFW = inclPome ? ffbDay * STR.pome.ffbRatio * (pomeInclPct / 100) : 0;
  const pomeDM = pomeFW * (1 - STR.pome.mc / 100);
  const pomeN  = pomeDM * STR.pome.n / 100 * 1000;
  const pomeP  = pomeDM * STR.pome.p / 100 * 1000;
  const pomeK  = pomeDM * STR.pome.k / 100 * 1000;

  // Raw totals (kg/day)
  const rawN = efbN + opdcN + pomeN;
  const rawP = efbP + opdcP + pomeP;
  const rawK = efbK + opdcK + pomeK;

  // Annual raw (t/yr)
  const annN = rawN * daysYear / 1000;
  const annP = rawP * daysYear / 1000;
  const annK = rawK * daysYear / 1000;

  // Pipeline-recovered (t/yr)
  const rN = annN * rec.n / 100;
  const rP = annP * rec.p / 100;
  const rK = annK * rec.k / 100;

  // Convert to fertiliser equivalent forms
  const rP2O5 = rP * 2.29;
  const rK2O  = rK * 1.20;

  // Soil-adjusted effective values
  const eN = rN    * (1 + soil.nAdj);
  const eP = rP2O5 * (1 + soil.pAdj);
  const eK = rK2O;

  // Value at commodity prices ($/yr)
  const comN   = eN * 1000 * COM.n;
  const comP   = eP * 1000 * COM.p;
  const comK   = eK * 1000 * COM.k;
  const comTot = comN + comP + comK;

  // Value at estate actual prices ($/yr)
  const smN    = eN * 1000 * SM.n;
  const smP    = eP * 1000 * SM.p;
  const smK    = eK * 1000 * SM.k;
  const smTot  = smN + smP + smK;

  // Per-hectare
  const ha    = estate.ha || 1;
  const comHa = comTot / ha;
  const smHa  = smTot / ha;

  // Raw inventory value
  const rawComVal   = annN * 1000 * COM.n + annP * 2.29 * 1000 * COM.p + annK * 1.20 * 1000 * COM.k;
  const rawSmVal    = annN * 1000 * SM.n  + annP * 2.29 * 1000 * SM.p  + annK * 1.20 * 1000 * SM.k;
  const pipelineEff = rawComVal > 0 ? comTot / rawComVal * 100 : 0;

  // All-soils comparison table
  const soilsTable = SOILS.map(s => {
    const sN  = rN    * (1 + s.nAdj);
    const sP  = rP2O5 * (1 + s.pAdj);
    const sK  = rK2O;
    const com = sN * 1000 * COM.n + sP * 1000 * COM.p + sK * 1000 * COM.k;
    const sm  = sN * 1000 * SM.n  + sP * 1000 * SM.p  + sK * 1000 * SM.k;
    return { ...s, com, sm, comHa: com / ha, smHa: sm / ha };
  });

  const streams = [
    { label: 'EFB',  n: efbN,  p: efbP,  k: efbK  },
    ...(inclOpdc ? [{ label: 'OPDC', n: opdcN, p: opdcP, k: opdcK }] : []),
    ...(inclPome ? [{ label: 'POME Sludge', n: pomeN, p: pomeP, k: pomeK }] : []),
  ];

  res.json({
    ffbDay, rawN, rawP, rawK, annN, annP, annK,
    rN, rP2O5, rK2O, eN, eP, eK,
    comN, comP, comK, comTot, smN, smP, smK, smTot,
    comHa, smHa, rawComVal, rawSmVal, pipelineEff,
    soilsTable, streams, soil,
  });
};
