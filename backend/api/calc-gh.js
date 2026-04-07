'use strict';

module.exports = function calcGh(req, res) {
  const {
    feedTpd, feedMc, s3Days, s4Days, s3Frac, bedDepth, bulkDen,
    ghW, ghL, laneW, truckPayload, nTrucks, haulDist, truckSpd, tipTime, truckCost,
    miniTph, miniCost, ghStruct, sprRate,
    slab150Mat, slab150Lab, slab200Mat, slab200Lab,
  } = req.body;

  const ghArea      = ghW * ghL;
  const laneArea    = laneW * ghL;
  const bedArea     = ghArea - laneArea;
  const s3BedArea   = bedArea * s3Frac / 100;
  const s4BedArea   = bedArea * (1 - s3Frac / 100);
  const feedTph     = feedTpd / 24;
  const feedDm      = feedTpd * (1 - feedMc / 100);
  const s3Inv       = feedTpd * s3Days;
  const s3Vol       = s3Inv / bulkDen;
  const s3AreaNeed  = s3Vol / bedDepth;
  const s3Util      = s3AreaNeed / s3BedArea * 100;
  const s4Feed      = feedTpd * 0.95;
  const s4Inv       = s4Feed * s4Days;
  const s4Vol       = s4Inv / bulkDen;
  const s4AreaNeed  = s4Vol / bedDepth;
  const s4Util      = s4AreaNeed / s4BedArea * 100;
  const totalAreaNeed = s3AreaNeed + s4AreaNeed;
  const totalAreaUtil = totalAreaNeed / bedArea * 100;

  const haulMin      = (haulDist / 1000) / (truckSpd / 60);
  const cycleMin     = haulMin * 2 + tipTime;
  const tripsPerDay  = (24 * 60) / cycleMin;
  const capPerTruck  = tripsPerDay * truckPayload;
  const trucksNeeded = Math.ceil(feedTpd / capPerTruck);
  const truckUtil    = feedTpd / (nTrucks * capPerTruck) * 100;

  const miniWorking = Math.ceil(feedTph / miniTph);
  const nMinis      = miniWorking + 2;
  const miniUtil    = feedTph / (miniWorking * miniTph) * 100;

  const nFans        = Math.ceil((ghArea * 4 * 20 / 3600) / (35000 / 3600));
  const nSprinklers  = Math.ceil(ghArea / 9);
  const slab150Area  = ghArea - laneArea;
  const aggArea      = ghArea + 10000;

  const clearCost    = 35000 * 0.75;
  const compactCost  = 35000 * 1.25;
  const aggCost      = aggArea * 15;
  const sandCost     = aggArea * 8.5;
  const drainCivil   = aggArea * 18;
  const subtotalSubbase = clearCost + compactCost + aggCost + sandCost + drainCivil;

  const slab150Cost  = slab150Area * (slab150Mat + slab150Lab);
  const slab200Cost  = laneArea * (slab200Mat + slab200Lab);
  const extRoadCost  = 6000 * 4;
  const extApronCost = 4000 * 22;
  const subtotalSlab = slab150Cost + slab200Cost + extRoadCost + extApronCost;

  const ghStructCost   = ghArea * ghStruct;
  const sprinklerCost  = ghArea * sprRate;
  const washdownCost   = 12000;
  const trenchHwCost   = 30000;
  const fanCost        = nFans * 2000;
  const subtotalMEP    = sprinklerCost + washdownCost + trenchHwCost + fanCost;

  const truckFleetCost  = nTrucks * truckCost;
  const miniFleetCost   = nMinis * miniCost;
  const subtotalMobile  = truckFleetCost + miniFleetCost;
  const total = subtotalSubbase + subtotalSlab + ghStructCost + subtotalMEP + subtotalMobile;

  res.json({
    ghArea, laneArea, bedArea, slab150Area, s3BedArea, s4BedArea, aggArea,
    feedTph, feedDm,
    s3Inv, s3Vol, s3AreaNeed, s3Util,
    s4Feed, s4Inv, s4Vol, s4AreaNeed, s4Util,
    totalAreaNeed, totalAreaUtil,
    haulMin, cycleMin, tripsPerDay, capPerTruck, trucksNeeded, truckUtil,
    miniWorking, nMinis, miniUtil,
    nFans, nSprinklers,
    capex: {
      clearCost, compactCost, aggCost, sandCost, drainCivil, subtotalSubbase,
      slab150Cost, slab200Cost, extRoadCost, extApronCost, subtotalSlab,
      ghStructCost, sprinklerCost, washdownCost, trenchHwCost, fanCost, subtotalMEP,
      truckFleetCost, miniFleetCost, subtotalMobile, total,
    },
  });
};
