'use strict';

const PALMS = 143;

// Calc-relevant soil data only
const SOILS = {
  inceptisol: { id: 'inceptisol', name: 'Inceptisols', totalCostHa: 580,  fertReq: { n: { kg: 1.8, uc: 0.35 }, p: { kg: 0.45, uc: 0.45 }, k: { kg: 2.8, uc: 0.38 }, mg: { kg: 0.5, uc: 0.28 }, b: { kg: 0.05, uc: 1.20 }, cu: { kg: 0,    uc: 1.80 }, lime: { kgHa: 1500, cycle: 3.5, uc: 0.08 } } },
  ultisol:    { id: 'ultisol',    name: 'Ultisols',    totalCostHa: 720,  fertReq: { n: { kg: 2.2, uc: 0.35 }, p: { kg: 0.65, uc: 0.45 }, k: { kg: 3.2, uc: 0.38 }, mg: { kg: 0.7, uc: 0.28 }, b: { kg: 0.06, uc: 1.20 }, cu: { kg: 0,    uc: 1.80 }, lime: { kgHa: 2000, cycle: 3,   uc: 0.08 } } },
  oxisol:     { id: 'oxisol',     name: 'Oxisols',     totalCostHa: 920,  fertReq: { n: { kg: 2.5, uc: 0.42 }, p: { kg: 1.0,  uc: 0.52 }, k: { kg: 3.8, uc: 0.38 }, mg: { kg: 0.8, uc: 0.28 }, b: { kg: 0.07, uc: 1.20 }, cu: { kg: 0.02, uc: 1.80 }, lime: { kgHa: 2500, cycle: 2.5, uc: 0.08 } } },
  histosol:   { id: 'histosol',   name: 'Histosols',   totalCostHa: 840,  fertReq: { n: { kg: 0.9, uc: 0.35 }, p: { kg: 0.35, uc: 0.45 }, k: { kg: 4.2, uc: 0.38 }, mg: { kg: 0.6, uc: 0.28 }, b: { kg: 0.07, uc: 1.20 }, cu: { kg: 0.03, uc: 1.80 }, lime: { kgHa: 1200, cycle: 2.5, uc: 0.08 } } },
  spodosol:   { id: 'spodosol',   name: 'Spodosols',   totalCostHa: 1050, fertReq: { n: { kg: 3.0, uc: 0.42 }, p: { kg: 0.6,  uc: 0.45 }, k: { kg: 4.5, uc: 0.38 }, mg: { kg: 0.9, uc: 0.28 }, b: { kg: 0.08, uc: 1.20 }, cu: { kg: 0,    uc: 1.80 }, lime: { kgHa: 1000, cycle: 2,   uc: 0.08 } } },
};

// Calc-relevant band data only
const BAND_FACTORS = {
  nursery: 0.10, immature: 0.35, young: 0.72, peak: 1.00, mature: 0.85, old: 0.70,
};

// Calc-relevant product data only
const PRODUCTS = {
  s3w1: { status: 'live',    moisture: 55, N: 9.00,  P: 0.675, K: 3.825, Ca: 0.585, Mg: 0.45,  OM: 391.5 },
  s3w2: { status: 'pending', moisture: null, N: null, P: null,  K: null,  Ca: null,  Mg: null,  OM: null  },
  s3w3: { status: 'pending', moisture: null, N: null, P: null,  K: null,  Ca: null,  Mg: null,  OM: null  },
  s5a:  { status: 'live',    moisture: 25, N: 22.50, P: 3.15,  K: 7.875, Ca: 8.625, Mg: 1.35,  OM: 577.5 },
  s5b:  { status: 'live',    moisture: 30, N: 29.40, P: 3.85,  K: 8.05,  Ca: 21.00, Mg: 1.75,  OM: 490.0 },
};

function calc(soil, f, product, rateHa, cfiPriceWet, estateHa) {
  const fr = soil.fertReq;

  const req = {
    N:  fr.n.kg  * f,
    P:  fr.p.kg  * f,
    K:  fr.k.kg  * f,
    Mg: fr.mg.kg * f,
    B:  fr.b.kg  * f,
    Cu: fr.cu.kg * f,
  };
  const limeKgTree    = (fr.lime.kgHa / PALMS) / fr.lime.cycle * f;
  const synthCostHa   = soil.totalCostHa * f;
  const synthCostTree = synthCostHa / PALMS;

  if (!product || product.status !== 'live') {
    return { req, limeKgTree, synthCostHa, synthCostTree, pending: true };
  }

  const cfiHa = {
    N:  product.N  * rateHa,
    P:  product.P  * rateHa,
    K:  product.K  * rateHa,
    Ca: product.Ca * rateHa,
    Mg: product.Mg * rateHa,
    OM: product.OM * rateHa,
  };
  const cfiTree = {
    N: cfiHa.N / PALMS, P: cfiHa.P / PALMS, K: cfiHa.K / PALMS,
    Ca: cfiHa.Ca / PALMS, Mg: cfiHa.Mg / PALMS, OM: cfiHa.OM / PALMS,
  };

  const cov = {
    N:  Math.min(100, req.N  > 0 ? cfiTree.N  / req.N  * 100 : 0),
    P:  Math.min(100, req.P  > 0 ? cfiTree.P  / req.P  * 100 : 0),
    K:  Math.min(100, req.K  > 0 ? cfiTree.K  / req.K  * 100 : 0),
    Mg: Math.min(100, req.Mg > 0 ? cfiTree.Mg / req.Mg * 100 : 0),
  };

  const gap = {
    N:  Math.max(0, req.N  - cfiTree.N),
    P:  Math.max(0, req.P  - cfiTree.P),
    K:  Math.max(0, req.K  - cfiTree.K),
    Mg: Math.max(0, req.Mg - cfiTree.Mg),
    B:  req.B,
    Cu: req.Cu,
  };

  const gapCost = {
    N:  gap.N  * fr.n.uc,
    P:  gap.P  * fr.p.uc,
    K:  gap.K  * fr.k.uc,
    Mg: gap.Mg * fr.mg.uc,
    B:  gap.B  * fr.b.uc,
    Cu: gap.Cu * fr.cu.uc,
    lime: limeKgTree * fr.lime.uc * 0.60,
  };
  const totalGapCostTree = Object.values(gapCost).reduce((a, b) => a + b, 0);
  const totalGapCostHa   = totalGapCostTree * PALMS;

  const cfiCostHa       = rateHa * cfiPriceWet;
  const cfiCostTree     = cfiCostHa / PALMS;
  const cfiProgCostHa   = cfiCostHa + totalGapCostHa;
  const cfiProgCostTree = cfiProgCostHa / PALMS;
  const savingHa        = synthCostHa - cfiProgCostHa;
  const savingTree      = savingHa / PALMS;
  const savingEstate    = savingHa * estateHa;
  const savingPct       = synthCostHa > 0 ? savingHa / synthCostHa * 100 : 0;
  const dmHa            = rateHa * (1 - product.moisture / 100);

  return {
    req, limeKgTree, synthCostHa, synthCostTree,
    cfiHa, cfiTree, cov, gap, gapCost,
    totalGapCostHa, totalGapCostTree,
    cfiCostHa, cfiCostTree,
    cfiProgCostHa, cfiProgCostTree,
    savingHa, savingTree, savingEstate, savingPct,
    dmHa, pending: false,
  };
}

module.exports = function calcAgManagement(req, res) {
  const { soilId, bandId, productId, rateHa, cfiPriceWet, estateHa } = req.body;

  const soil    = SOILS[soilId]    || SOILS['ultisol'];
  const f       = BAND_FACTORS[bandId] != null ? BAND_FACTORS[bandId] : 1.00;
  const product = PRODUCTS[productId] || null;

  const result = calc(soil, f, product, rateHa, cfiPriceWet, estateHa);
  res.json(result);
};
