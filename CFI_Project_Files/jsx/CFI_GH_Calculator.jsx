import { useState, useMemo } from "react";

const C = {
  bg:"#0b0f14", panel:"#111820", border:"#1e2d3d", input:"#0d1f35",
  blue:"#4da6ff", green:"#3ddc84", amber:"#f0a030", red:"#ff5555",
  teal:"#22b89e", purple:"#b06aff", white:"#e8edf2", grey:"#6b8099",
  dimgrey:"#3a4f60", label:"#8ba8c0", gold:"#f5c842",
};
const mono = "'JetBrains Mono','Courier New',monospace";
const sans = "'IBM Plex Sans','Segoe UI',sans-serif";

function uCol(p){return p>85?C.red:p>65?C.amber:C.green;}
function fmt(n,d=1){return n!=null?n.toFixed(d):"—";}
function fmtk(n){return n!=null?"$"+Math.round(n).toLocaleString():"—";}

function Inp({label,unit,value,onChange,min=0,max=99999,step=1,note}){
  return(
    <div style={{marginBottom:9}}>
      <div style={{display:"flex",alignItems:"center",gap:6}}>
        <div style={{width:188,fontSize:11,color:C.label,fontFamily:sans,lineHeight:1.3}}>{label}</div>
        <div style={{display:"flex",alignItems:"center",gap:4,background:C.input,border:"1px solid "+C.blue,borderRadius:4,padding:"3px 8px"}}>
          <input type="number" min={min} max={max} step={step} value={value}
            onChange={e=>onChange(parseFloat(e.target.value)||0)}
            style={{width:66,background:"transparent",border:"none",outline:"none",color:C.blue,fontFamily:mono,fontSize:13,fontWeight:700}}/>
          <span style={{fontFamily:mono,fontSize:10,color:C.dimgrey}}>{unit}</span>
        </div>
      </div>
      {note&&<div style={{fontSize:9,color:C.dimgrey,marginTop:2,paddingLeft:4}}>{note}</div>}
    </div>
  );
}

function KV({k,v,col}){
  return(
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",padding:"5px 0",borderBottom:"1px solid "+C.border}}>
      <span style={{fontSize:11,color:C.label,fontFamily:sans}}>{k}</span>
      <span style={{fontFamily:mono,fontSize:12,color:col||C.green,fontWeight:600,textAlign:"right",marginLeft:8}}>{v}</span>
    </div>
  );
}

function UBar({label,pct}){
  const c=uCol(pct);
  return(
    <div style={{marginBottom:7}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
        <span style={{fontSize:10,color:C.label,fontFamily:sans}}>{label}</span>
        <span style={{fontFamily:mono,fontSize:10,color:c,fontWeight:700}}>{fmt(pct,1)}%</span>
      </div>
      <div style={{height:4,background:C.border,borderRadius:2}}>
        <div style={{width:Math.min(pct,100)+"%",height:"100%",background:c,borderRadius:2,transition:"width 0.4s"}}/>
      </div>
    </div>
  );
}

function Panel({title,colour,children,compact}){
  return(
    <div style={{background:C.panel,border:"1px solid "+(colour?colour+"44":C.border),borderTop:colour?"3px solid "+colour:undefined,borderRadius:6,padding:compact?12:16}}>
      {title&&<div style={{fontFamily:mono,fontSize:10,color:colour||C.label,letterSpacing:2,marginBottom:10,textTransform:"uppercase"}}>{title}</div>}
      {children}
    </div>
  );
}

function StatCard({label,value,unit,col}){
  return(
    <div style={{background:C.panel,border:"1px solid "+C.border,borderRadius:6,padding:12}}>
      <div style={{fontSize:9,color:C.label,textTransform:"uppercase",letterSpacing:1,marginBottom:3}}>{label}</div>
      <div style={{fontFamily:mono,fontSize:20,fontWeight:700,color:col||C.green,lineHeight:1}}>{value}</div>
      <div style={{fontFamily:mono,fontSize:9,color:C.grey,marginTop:2}}>{unit}</div>
    </div>
  );
}

function SHead({title,colour}){
  return <div style={{padding:"5px 10px",background:colour+"18",fontFamily:mono,fontSize:9,color:colour,letterSpacing:2,textTransform:"uppercase",borderTop:"1px solid "+colour+"33"}}>── {title}</div>;
}

function ERow({tag,name,qty,cost,note,isNew}){
  return(
    <div style={{display:"grid",gridTemplateColumns:"148px 1fr 36px 90px",gap:6,padding:"5px 10px",borderBottom:"1px solid "+C.border,background:isNew?"#0d2a1a":"transparent",borderLeft:isNew?"2px solid "+C.green:"2px solid transparent"}}>
      <div style={{fontFamily:mono,fontSize:10,color:isNew?C.green:C.teal,wordBreak:"break-all"}}>{tag}</div>
      <div>
        <div style={{fontFamily:sans,fontSize:11,color:C.white}}>{name}</div>
        {note&&<div style={{fontFamily:sans,fontSize:9,color:C.grey,marginTop:1}}>{note}</div>}
      </div>
      <div style={{fontFamily:mono,fontSize:11,color:C.white,textAlign:"center"}}>{qty}</div>
      <div style={{fontFamily:mono,fontSize:11,color:C.amber,textAlign:"right"}}>{cost?fmtk(cost):"TBD"}</div>
    </div>
  );
}

function SLabel({text}){
  return <div style={{fontSize:9,fontFamily:mono,color:C.dimgrey,letterSpacing:2,textTransform:"uppercase",margin:"14px 0 6px",paddingBottom:4,borderBottom:"1px solid "+C.border}}>{text}</div>;
}

export default function CFI_GH(){
  const [feedTpd,setFeedTpd]=useState(326);
  const [feedMc,setFeedMc]=useState(55);
  const [s3Days,setS3Days]=useState(15);
  const [s4Days,setS4Days]=useState(14);
  const [s3Frac,setS3Frac]=useState(60);
  const [bedDepth,setBedDepth]=useState(0.5);
  const [bulkDen,setBulkDen]=useState(0.8);
  const [ghW,setGhW]=useState(100);
  const [ghL,setGhL]=useState(200);
  const [laneW,setLaneW]=useState(5);
  const [truckPayload,setTruckPayload]=useState(8);
  const [nTrucks,setNTrucks]=useState(3);
  const [haulDist,setHaulDist]=useState(400);
  const [truckSpd,setTruckSpd]=useState(15);
  const [tipTime,setTipTime]=useState(20);
  const [truckCost,setTruckCost]=useState(20000);
  const [miniTph,setMiniTph]=useState(5);
  const [miniCost,setMiniCost]=useState(15000);
  const [ghStruct,setGhStruct]=useState(55);
  const [sprRate,setSprRate]=useState(8);
  const [slab150Mat,setSlab150Mat]=useState(13);
  const [slab150Lab,setSlab150Lab]=useState(9);
  const [slab200Mat,setSlab200Mat]=useState(17);
  const [slab200Lab,setSlab200Lab]=useState(10);
  const [tab,setTab]=useState("overview");

  const r=useMemo(()=>{
    const ghArea=ghW*ghL;
    const laneArea=laneW*ghL;
    const bedArea=ghArea-laneArea;
    const s3BedArea=bedArea*s3Frac/100;
    const s4BedArea=bedArea*(1-s3Frac/100);
    const feedTph=feedTpd/24;
    const feedDm=feedTpd*(1-feedMc/100);
    const s3Inv=feedTpd*s3Days;
    const s3Vol=s3Inv/bulkDen;
    const s3AreaNeed=s3Vol/bedDepth;
    const s3Util=s3AreaNeed/s3BedArea*100;
    const s4Feed=feedTpd*0.95;
    const s4Inv=s4Feed*s4Days;
    const s4Vol=s4Inv/bulkDen;
    const s4AreaNeed=s4Vol/bedDepth;
    const s4Util=s4AreaNeed/s4BedArea*100;
    const totalAreaNeed=s3AreaNeed+s4AreaNeed;
    const totalAreaUtil=totalAreaNeed/bedArea*100;
    const haulMin=(haulDist/1000)/(truckSpd/60);
    const cycleMin=haulMin*2+tipTime;
    const tripsPerDay=(24*60)/cycleMin;
    const capPerTruck=tripsPerDay*truckPayload;
    const trucksNeeded=Math.ceil(feedTpd/capPerTruck);
    const truckUtil=feedTpd/(nTrucks*capPerTruck)*100;
    const miniWorking=Math.ceil(feedTph/miniTph);
    const nMinis=miniWorking+2;
    const miniUtil=feedTph/(miniWorking*miniTph)*100;
    const nFans=Math.ceil((ghArea*4*20/3600)/(35000/3600));
    const nSprinklers=Math.ceil(ghArea/9);
    const slab150Area=ghArea-laneArea;
    const aggArea=ghArea+10000;
    const clearCost=35000*0.75;
    const compactCost=35000*1.25;
    const aggCost=aggArea*15;
    const sandCost=aggArea*8.5;
    const drainCivil=aggArea*18;
    const subtotalSubbase=clearCost+compactCost+aggCost+sandCost+drainCivil;
    const slab150Cost=slab150Area*(slab150Mat+slab150Lab);
    const slab200Cost=laneArea*(slab200Mat+slab200Lab);
    const extRoadCost=6000*4;
    const extApronCost=4000*22;
    const subtotalSlab=slab150Cost+slab200Cost+extRoadCost+extApronCost;
    const ghStructCost=ghArea*ghStruct;
    const sprinklerCost=ghArea*sprRate;
    const washdownCost=12000;
    const trenchHwCost=30000;
    const fanCost=nFans*2000;
    const subtotalMEP=sprinklerCost+washdownCost+trenchHwCost+fanCost;
    const truckFleetCost=nTrucks*truckCost;
    const miniFleetCost=nMinis*miniCost;
    const subtotalMobile=truckFleetCost+miniFleetCost;
    const total=subtotalSubbase+subtotalSlab+ghStructCost+subtotalMEP+subtotalMobile;
    return{
      ghArea,laneArea,bedArea,slab150Area,s3BedArea,s4BedArea,aggArea,
      feedTph,feedDm,
      s3Inv,s3Vol,s3AreaNeed,s3Util,
      s4Feed,s4Inv,s4Vol,s4AreaNeed,s4Util,
      totalAreaNeed,totalAreaUtil,
      haulMin,cycleMin,tripsPerDay,capPerTruck,trucksNeeded,truckUtil,
      miniWorking,nMinis,miniUtil,
      nFans,nSprinklers,
      capex:{clearCost,compactCost,aggCost,sandCost,drainCivil,subtotalSubbase,
        slab150Cost,slab200Cost,extRoadCost,extApronCost,subtotalSlab,
        ghStructCost,sprinklerCost,washdownCost,trenchHwCost,fanCost,subtotalMEP,
        truckFleetCost,miniFleetCost,subtotalMobile,total},
    };
  },[feedTpd,feedMc,s3Days,s4Days,s3Frac,bedDepth,bulkDen,ghW,ghL,laneW,
     truckPayload,nTrucks,haulDist,truckSpd,tipTime,truckCost,
     miniTph,miniCost,ghStruct,sprRate,slab150Mat,slab150Lab,slab200Mat,slab200Lab]);

  const overFit=r.totalAreaUtil>100;
  const truckShort=nTrucks<r.trucksNeeded;
  const TABS=["overview","s3-zone","s4-zone","fleet","capex","equipment"];

  return(
    <div style={{background:C.bg,minHeight:"100vh",fontFamily:sans,color:C.white,display:"flex",flexDirection:"column"}}>
      <div style={{background:C.panel,borderBottom:"1px solid "+C.border,padding:"12px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
        <div>
          <div style={{fontFamily:mono,fontSize:9,color:C.teal,letterSpacing:3,textTransform:"uppercase"}}>CFI · Greenhouse Calculator — S3 + S4</div>
          <div style={{fontSize:17,fontWeight:700,color:C.white,marginTop:1}}>Bioconversion Greenhouse — Dynamic CAPEX Model</div>
        </div>
        <div style={{display:"flex",gap:12,alignItems:"center"}}>
          {overFit&&<div style={{background:"#2a0d0d",border:"1px solid "+C.red,borderRadius:4,padding:"4px 10px",fontFamily:mono,fontSize:10,color:C.red}}>⚠ BED AREA OVERFIT</div>}
          {truckShort&&<div style={{background:"#2a0d0d",border:"1px solid "+C.red,borderRadius:4,padding:"4px 10px",fontFamily:mono,fontSize:10,color:C.red}}>⚠ TRUCKS UNDERSIZED</div>}
          <div style={{textAlign:"right"}}>
            <div style={{fontFamily:mono,fontSize:10,color:C.grey}}>{feedTpd} t/day · {feedMc}% MC</div>
            <div style={{fontFamily:mono,fontSize:14,color:C.gold,fontWeight:700}}>{fmtk(r.capex.total)} TOTAL CAPEX</div>
          </div>
        </div>
      </div>

      <div style={{display:"flex",flex:1,overflow:"hidden"}}>
        <div style={{width:284,flexShrink:0,background:C.panel,borderRight:"1px solid "+C.border,overflowY:"auto",padding:"14px 12px"}}>
          <div style={{fontFamily:mono,fontSize:9,color:C.teal,letterSpacing:2,marginBottom:10,textTransform:"uppercase"}}>Master Inputs</div>
          <SLabel text="S2 Feed (from blend point)"/>
          <Inp label="Blended feed rate" unit="t/day" value={feedTpd} onChange={setFeedTpd} min={50} max={2000} step={5} note="Link: S1/S2 calc → r.b.tpd"/>
          <Inp label="Feed moisture" unit="% WB" value={feedMc} onChange={setFeedMc} min={40} max={70} step={0.5} note="Row A exit ≈55% WB"/>
          <SLabel text="Residence Times"/>
          <Inp label="S3 microbial residence" unit="days" value={s3Days} onChange={setS3Days} min={7} max={45}/>
          <Inp label="S4 BSF larval cycle" unit="days" value={s4Days} onChange={setS4Days} min={7} max={21}/>
          <Inp label="S3 share of bed floor" unit="% area" value={s3Frac} onChange={setS3Frac} min={20} max={80} step={5}/>
          <SLabel text="Bed Parameters"/>
          <Inp label="Max bed depth" unit="m" value={bedDepth} onChange={setBedDepth} min={0.3} max={0.5} step={0.05} note="Hard limit 0.5m per spec"/>
          <Inp label="Bulk density (design)" unit="t/m³" value={bulkDen} onChange={setBulkDen} min={0.5} max={1.0} step={0.05} note="0.8 = conservative"/>
          <SLabel text="Greenhouse Geometry"/>
          <Inp label="Width" unit="m" value={ghW} onChange={setGhW} min={50} max={300} step={10}/>
          <Inp label="Length" unit="m" value={ghL} onChange={setGhL} min={100} max={500} step={10}/>
          <Inp label="Truck lane width" unit="m" value={laneW} onChange={setLaneW} min={4} max={8}/>
          <SLabel text="Trucks — Hino Dutro 130HD"/>
          <Inp label="Truck payload" unit="t" value={truckPayload} onChange={setTruckPayload} min={4} max={15}/>
          <Inp label="Number of trucks" unit="units" value={nTrucks} onChange={setNTrucks} min={1} max={10}/>
          <Inp label="One-way haul distance" unit="m" value={haulDist} onChange={setHaulDist} min={50} max={3000} step={50} note="S2 blend → GH door"/>
          <Inp label="Loaded speed" unit="km/h" value={truckSpd} onChange={setTruckSpd} min={5} max={30} step={5}/>
          <Inp label="Load + tip time" unit="min" value={tipTime} onChange={setTipTime} min={10} max={60} step={5}/>
          <Inp label="Truck unit cost" unit="USD" value={truckCost} onChange={setTruckCost} min={10000} max={80000} step={1000}/>
          <SLabel text="Mini Loaders — LTMG LT750D"/>
          <Inp label="Throughput per mini" unit="t/h" value={miniTph} onChange={setMiniTph} min={2} max={10} step={0.5}/>
          <Inp label="Mini unit cost (landed)" unit="USD" value={miniCost} onChange={setMiniCost} min={8000} max={30000} step={1000}/>
          <SLabel text="Civil Unit Rates"/>
          <Inp label="GH structure + film" unit="$/m²" value={ghStruct} onChange={setGhStruct} min={40} max={90} step={5}/>
          <Inp label="Sprinkler system" unit="$/m²" value={sprRate} onChange={setSprRate} min={6} max={12}/>
          <Inp label="150mm slab materials" unit="$/m²" value={slab150Mat} onChange={setSlab150Mat} min={8} max={22}/>
          <Inp label="150mm slab labour" unit="$/m²" value={slab150Lab} onChange={setSlab150Lab} min={5} max={16}/>
          <Inp label="200mm slab materials" unit="$/m²" value={slab200Mat} onChange={setSlab200Mat} min={12} max={28}/>
          <Inp label="200mm slab labour" unit="$/m²" value={slab200Lab} onChange={setSlab200Lab} min={6} max={18}/>
        </div>

        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
          <div style={{display:"flex",borderBottom:"1px solid "+C.border,background:C.panel,flexShrink:0}}>
            {TABS.map(t=>(
              <button key={t} onClick={()=>setTab(t)} style={{background:"transparent",border:"none",
                borderBottom:tab===t?"2px solid "+C.teal:"2px solid transparent",
                color:tab===t?C.white:C.grey,fontFamily:mono,fontSize:10,textTransform:"uppercase",
                letterSpacing:1,padding:"10px 14px",cursor:"pointer"}}>{t.replace("-"," ")}</button>
            ))}
          </div>

          <div style={{flex:1,overflowY:"auto",padding:18}}>

            {tab==="overview"&&(
              <div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:10,marginBottom:18}}>
                  <StatCard label="Feed Rate" value={fmt(r.feedTph,1)} unit="t/h continuous" col={C.white}/>
                  <StatCard label="GH Floor" value={(r.ghArea/1000).toFixed(0)+"k"} unit="m² total" col={C.teal}/>
                  <StatCard label="Bed Area" value={r.bedArea.toLocaleString()} unit="m² available" col={C.teal}/>
                  <StatCard label="Floor Util" value={fmt(r.totalAreaUtil,0)+"%"} unit="beds used" col={uCol(r.totalAreaUtil)}/>
                  <StatCard label="Trucks" value={nTrucks} unit={truckShort?"need "+r.trucksNeeded+" ⚠":"sufficient ✓"} col={truckShort?C.red:C.green}/>
                  <StatCard label="Mini Loaders" value={r.nMinis} unit={r.miniWorking+" working + 2 reserve"} col={C.green}/>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14,marginBottom:14}}>
                  <Panel title="S3 — Microbial Zone" colour={C.teal}>
                    <KV k="Residence" v={s3Days+" days"}/>
                    <KV k="In-house inventory" v={r.s3Inv.toFixed(0)+" t"} col={C.amber}/>
                    <KV k={"Vol @ "+bulkDen+" t/m³"} v={r.s3Vol.toFixed(0)+" m³"}/>
                    <KV k={"Floor @ "+bedDepth+"m"} v={r.s3AreaNeed.toFixed(0)+" m² needed"}/>
                    <KV k="Zone allocated" v={r.s3BedArea.toFixed(0)+" m²"} col={C.teal}/>
                    <div style={{marginTop:8}}><UBar label="S3 zone utilisation" pct={r.s3Util}/></div>
                  </Panel>
                  <Panel title="S4 — BSF Larval Zone" colour={C.purple}>
                    <KV k="Larval cycle" v={s4Days+" days"}/>
                    <KV k="Feed to S4" v={fmt(r.s4Feed,0)+" t/day"} col={C.grey}/>
                    <KV k="In-house inventory" v={r.s4Inv.toFixed(0)+" t"} col={C.amber}/>
                    <KV k={"Floor @ "+bedDepth+"m"} v={r.s4AreaNeed.toFixed(0)+" m² needed"}/>
                    <KV k="Zone allocated" v={r.s4BedArea.toFixed(0)+" m²"} col={C.purple}/>
                    <div style={{marginTop:8}}><UBar label="S4 zone utilisation" pct={r.s4Util}/></div>
                  </Panel>
                  <Panel title="Fleet Summary" colour={C.amber}>
                    <KV k="Cycle time" v={fmt(r.cycleMin,0)+" min"}/>
                    <KV k="Payload/truck/day" v={fmt(r.capPerTruck,0)+" t"}/>
                    <KV k="Trucks needed" v={r.trucksNeeded} col={truckShort?C.red:C.green}/>
                    <KV k="Trucks specified" v={nTrucks} col={C.amber}/>
                    <KV k="Mini loaders" v={r.nMinis+" ("+r.miniWorking+"W | 1C | 1S)"} col={C.green}/>
                    <KV k="Sprinkler heads" v={r.nSprinklers.toLocaleString()}/>
                    <KV k="Exhaust fans" v={r.nFans+" units"}/>
                    <div style={{marginTop:8}}><UBar label="Truck utilisation" pct={r.truckUtil}/></div>
                  </Panel>
                </div>
                <Panel title="Floor Zone Layout — Schematic">
                  <pre style={{fontFamily:mono,fontSize:10,color:C.teal,lineHeight:1.65,margin:0,overflowX:"auto"}}>{
`Y=0m  INBOUND — trucks tip, Wave 1 inoculation at GH entry
┌──────────────────────────────────────────────────────────────────┐
│  INBOUND DOORS              HIGH ROOF 7–8m over central lane     │
│                                                                  │
│  S3 MICROBIAL BEDS  (${s3Frac}% floor = ${r.s3BedArea.toFixed(0)} m²)              │
│  [S3][S3][S3][S3][S3][S3]  ║ ${laneW}m  ║  200mm RC slab        │
│   ·   ·   ·   ·   ·   ·   ║TRUCK║  ${nTrucks}× Hino Dutro 130HD  │
│  Wave 1: pH≤8.0            ║LANE ║  ${truckPayload}t payload each          │
│  Wave 2: T<50°C            ║     ║                               │
│  BSF gate: T≤30°C ────────→ S4   ║                               │
├────────────────────────────╫─────╫───────────────────────────────┤
│  S4 BSF LARVAL BEDS  (${100-s3Frac}% floor = ${r.s4BedArea.toFixed(0)} m²)            │
│  [S4][S4][S4][S4][S4][S4]  ║     ║  ${r.nMinis}× LTMG LT750D        │
│   ·   ·   ·   ·   ·   ·   ║     ║  ${r.miniWorking} working | 1 charge   │
│  5-day bio floor           ║     ║  1 spare                      │
│  CP ≥ 5% DM required       ║     ║                               │
│                             ║     ║                               │
│  FLOOR 1.5% slope → TD-L TRENCH DRAIN → POME/LEACHATE POND      │
└──────────────────────────────────────────────────────────────────┘
Y=${ghL}m  OUTBOUND — conditioned substrate exit to S5

[S3]=microbial beds  [S4]=BSF larval beds  ·=sprinkler heads 3m×3m`
                  }</pre>
                </Panel>
              </div>
            )}

            {tab==="s3-zone"&&(
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                <Panel title="S3 Mass Balance" colour={C.teal}>
                  <KV k="Feed from S2 blend point" v={feedTpd+" t/day"} col={C.white}/>
                  <KV k="Feed moisture" v={feedMc+"% WB"}/>
                  <KV k="Dry matter" v={fmt(r.feedDm,1)+" t DM/day"} col={C.grey}/>
                  <KV k="Throughput" v={fmt(r.feedTph,2)+" t/h"} col={C.teal}/>
                  <KV k="S3 residence" v={s3Days+" days"}/>
                  <KV k="In-house inventory" v={r.s3Inv.toFixed(0)+" t"} col={C.amber}/>
                  <KV k={"Volume @ "+bulkDen+" t/m³"} v={r.s3Vol.toFixed(0)+" m³"}/>
                  <KV k={"Floor @ "+bedDepth+"m depth"} v={r.s3AreaNeed.toFixed(0)+" m² needed"}/>
                  <KV k="Zone allocated" v={r.s3BedArea.toFixed(0)+" m²"} col={r.s3Util>100?C.red:C.teal}/>
                  <KV k="Utilisation" v={fmt(r.s3Util,1)+"%"} col={uCol(r.s3Util)}/>
                  <div style={{marginTop:8}}><UBar label="S3 zone utilisation" pct={r.s3Util}/></div>
                  {r.s3Util>100&&<div style={{background:"#2a0d0d",border:"1px solid "+C.red,borderRadius:4,padding:8,marginTop:8}}><div style={{fontSize:10,color:C.red,fontWeight:700}}>⚠ S3 UNDERSIZED — expand GH, reduce S3 days, or increase S3 floor %</div></div>}
                </Panel>
                <Panel title="S3 Process Gates + Movement" colour={C.teal}>
                  <KV k="Input" v="S2 blended EFB+OPDC+POME @ pH 6.5–8.0"/>
                  <KV k="Wave 1 gate" v="pH ≤ 8.0 on blender discharge" col={C.green}/>
                  <KV k="Wave 2 gate" v="Substrate temp < 50°C" col={C.green}/>
                  <KV k="BSF introduction gate" v="Substrate temp ≤ 30°C" col={C.green}/>
                  <KV k="5-day bio floor" v="Hard minimum — cannot be overridden" col={C.amber}/>
                  <KV k="Moisture target" v="~60% via sprinklers"/>
                  <KV k="Output" v="Conditioned substrate → S4 zone" col={C.teal}/>
                  <div style={{background:"#0d1a2e",border:"1px solid "+C.teal+"44",borderRadius:4,padding:10,marginTop:12}}>
                    <div style={{fontSize:10,color:C.teal,fontWeight:700,marginBottom:5}}>ZONE MOVEMENT PATTERN</div>
                    <pre style={{fontFamily:mono,fontSize:9,color:C.grey,margin:0,lineHeight:1.9}}>{
`Y≈0–40m    INBOUND
  Trucks tip → minis push to S3 beds
  Wave 1 inoculation at GH entry

Y≈40–120m  CONDITIONING
  Sprinklers hold 60% MC
  Minis turn/re-mound periodically
  Wave 2 when T < 50°C

Y≈120m     S3→S4 HANDOVER
  T ≤ 30°C confirmed
  Minis move substrate into S4 zone`}
                    </pre>
                  </div>
                </Panel>
              </div>
            )}

            {tab==="s4-zone"&&(
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                <Panel title="S4 Mass Balance" colour={C.purple}>
                  <KV k="Feed from S3 (5% DM loss)" v={fmt(r.s4Feed,0)+" t/day"} col={C.white}/>
                  <KV k="BSF larval cycle" v={s4Days+" days"}/>
                  <KV k="In-house inventory" v={r.s4Inv.toFixed(0)+" t"} col={C.amber}/>
                  <KV k={"Volume @ "+bulkDen+" t/m³"} v={r.s4Vol.toFixed(0)+" m³"}/>
                  <KV k={"Floor @ "+bedDepth+"m depth"} v={r.s4AreaNeed.toFixed(0)+" m² needed"}/>
                  <KV k="Zone allocated" v={r.s4BedArea.toFixed(0)+" m²"} col={r.s4Util>100?C.red:C.purple}/>
                  <KV k="Utilisation" v={fmt(r.s4Util,1)+"%"} col={uCol(r.s4Util)}/>
                  <div style={{marginTop:8}}><UBar label="S4 zone utilisation" pct={r.s4Util}/></div>
                  {r.s4Util>100&&<div style={{background:"#2a0d0d",border:"1px solid "+C.red,borderRadius:4,padding:8,marginTop:8}}><div style={{fontSize:10,color:C.red,fontWeight:700}}>⚠ S4 UNDERSIZED — increase S4 floor %, reduce BSF days, or expand GH</div></div>}
                </Panel>
                <Panel title="S4 Guardrails + Infrastructure Notes" colour={C.purple}>
                  <KV k="BSF intro gate" v="Substrate T ≤ 30°C" col={C.green}/>
                  <KV k="5-day bio floor" v="Hard-coded — cannot be overridden" col={C.amber}/>
                  <KV k="CP floor" v="≥ 5% CP DM — binding biological constraint" col={C.amber}/>
                  <KV k="Moisture target" v="60–70% for larval activity"/>
                  <KV k="BSF colony" v="Centralised CFI supply — delivery cost = economic floor"/>
                  <KV k="S4 outputs" v="Prepupae (BSF larvae) + frass biofertiliser" col={C.purple}/>
                  <div style={{background:"#1a0d2e",border:"1px solid "+C.purple+"44",borderRadius:4,padding:10,marginTop:12}}>
                    <div style={{fontSize:10,color:C.purple,fontWeight:700,marginBottom:5}}>S4-SPECIFIC CAPEX NOT INCLUDED</div>
                    <div style={{fontSize:10,color:C.grey,lineHeight:1.8}}>
                      Separate S4 CAPEX block required for:<br/>
                      · Larval collection troughs + harvest ramps<br/>
                      · Prepupae separation + washing<br/>
                      · Harvest conveyors to S5 processing<br/>
                      · Frass collection + bagging lines<br/>
                      · Temp/humidity sensor network
                    </div>
                  </div>
                </Panel>
              </div>
            )}

            {tab==="fleet"&&(
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                <Panel title="Truck Fleet — Hino Dutro 130HD" colour={C.amber}>
                  <KV k="Model" v="Hino Dutro 130HD Dump" col={C.white}/>
                  <KV k="Class" v="8-ton GVW light/medium dump"/>
                  <KV k="Indonesian price" v="~$19,922 (Oto.com — Dutro Dump 130HD)" col={C.grey}/>
                  <KV k="Agent" v="Astra/Hino Indonesia dealer network" col={C.grey}/>
                  <KV k="Tipping height @ 60°" v="~5.0–5.5m (clears 7–8m roof)"/>
                  <div style={{height:1,background:C.border,margin:"8px 0"}}/>
                  <KV k="Payload" v={truckPayload+" t"}/>
                  <KV k="One-way haul" v={haulDist+" m"}/>
                  <KV k="Travel time (one-way)" v={fmt(r.haulMin,1)+" min @ "+truckSpd+" km/h"}/>
                  <KV k="Load + tip time" v={tipTime+" min"}/>
                  <KV k="Full cycle" v={fmt(r.cycleMin,0)+" min"} col={C.amber}/>
                  <KV k="Trips/truck/day" v={fmt(r.tripsPerDay,1)}/>
                  <KV k="Capacity/truck/day" v={fmt(r.capPerTruck,0)+" t"}/>
                  <KV k="Trucks NEEDED (calc)" v={r.trucksNeeded} col={truckShort?C.red:C.green}/>
                  <KV k="Trucks SPECIFIED" v={nTrucks} col={C.amber}/>
                  <div style={{marginTop:10}}><UBar label="Fleet utilisation" pct={r.truckUtil}/></div>
                  {truckShort&&<div style={{background:"#2a0d0d",border:"1px solid "+C.red,borderRadius:4,padding:8,marginTop:8}}><div style={{fontSize:10,color:C.red,fontWeight:700}}>⚠ ADD {r.trucksNeeded-nTrucks} TRUCK(S) or reduce haul distance</div></div>}
                </Panel>
                <Panel title="Mini Loader Fleet — LTMG LT750D" colour={C.green}>
                  <KV k="Model" v="LTMG LT750D Electric Mini Skid-Steer" col={C.white}/>
                  <KV k="Manufacturer" v="LTMG Machinery Group, China"/>
                  <KV k="Rated load" v="400 kg"/>
                  <KV k="Bucket volume" v="0.15 m³ (≈0.18–0.20 t wet residue)"/>
                  <KV k="Machine weight" v="1,200 kg"/>
                  <KV k="Working width" v="980 mm — fits 1–2m greenhouse aisles"/>
                  <KV k="Pushing capacity" v="~1.0–1.5 t on concrete"/>
                  <KV k="Runtime per charge" v="~4h moderate duty"/>
                  <KV k="Charge time (220V)" v="6–8h (0→100% SOC)"/>
                  <KV k="Supplier" v="Chinese OEM via Indonesian heavy equipment importer" col={C.grey}/>
                  <KV k="Warranty" v="1yr / 2,000h; CE certified"/>
                  <div style={{height:1,background:C.border,margin:"8px 0"}}/>
                  <KV k="Required throughput" v={fmt(r.feedTph,2)+" t/h"}/>
                  <KV k="Per-mini throughput" v={miniTph+" t/h (25–30 cycles/h)"}/>
                  <KV k="Working simultaneously" v={r.miniWorking+" units"} col={C.amber}/>
                  <KV k="+ 1 on charge" v="1 unit" col={C.grey}/>
                  <KV k="+ 1 spare/maintenance" v="1 unit" col={C.grey}/>
                  <KV k="Total fleet" v={r.nMinis+" units"} col={C.green}/>
                  <div style={{marginTop:10}}><UBar label="Working mini utilisation" pct={r.miniUtil}/></div>
                </Panel>
              </div>
            )}

            {tab==="capex"&&(
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                <div style={{display:"flex",flexDirection:"column",gap:14}}>
                  <Panel title="Civil — Earthworks + Sub-base" colour={C.blue} compact>
                    <KV k="Land clearing + grading (35,000 m²)" v={fmtk(r.capex.clearCost)} col={C.amber}/>
                    <KV k="Compaction 95% Proctor (35,000 m²)" v={fmtk(r.capex.compactCost)} col={C.amber}/>
                    <KV k={"Crushed aggregate 100–200mm ("+r.aggArea.toLocaleString()+" m²)"} v={fmtk(r.capex.aggCost)} col={C.amber}/>
                    <KV k={"Sand bedding 25–50mm ("+r.aggArea.toLocaleString()+" m²)"} v={fmtk(r.capex.sandCost)} col={C.amber}/>
                    <KV k="Drainage earthworks + pipes + manholes" v={fmtk(r.capex.drainCivil)} col={C.amber}/>
                    <KV k="SUBTOTAL" v={fmtk(r.capex.subtotalSubbase)} col={C.white}/>
                  </Panel>
                  <Panel title="Civil — Slabs + External" colour={C.blue} compact>
                    <KV k={"150mm slab beds+aisles ("+r.slab150Area?.toLocaleString()+" m²)"} v={fmtk(r.capex.slab150Cost)} col={C.amber}/>
                    <KV k="200mm slab truck lane (1,000 m²)" v={fmtk(r.capex.slab200Cost)} col={C.amber}/>
                    <KV k="External gravel roads (6,000 m²)" v={fmtk(r.capex.extRoadCost)} col={C.amber}/>
                    <KV k="External concrete aprons (4,000 m²)" v={fmtk(r.capex.extApronCost)} col={C.amber}/>
                    <KV k="SUBTOTAL" v={fmtk(r.capex.subtotalSlab)} col={C.white}/>
                  </Panel>
                  <Panel title="Structure" colour={C.teal} compact>
                    <KV k={"Steel + PVC film ("+r.ghArea.toLocaleString()+" m² @ $"+ghStruct+"/m²)"} v={fmtk(r.capex.ghStructCost)} col={C.amber}/>
                  </Panel>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:14}}>
                  <Panel title="MEP — Water / Drainage / Ventilation" colour={C.green} compact>
                    <KV k={"Sprinklers "+r.nSprinklers.toLocaleString()+" heads ("+r.ghArea.toLocaleString()+" m² @ $"+sprRate+"/m²)"} v={fmtk(r.capex.sprinklerCost)} col={C.amber}/>
                    <KV k="Wash-down ring main + 22 hose stations" v={fmtk(r.capex.washdownCost)} col={C.amber}/>
                    <KV k="Trench drain TD-L + TD-X + HD gratings" v={fmtk(r.capex.trenchHwCost)} col={C.amber}/>
                    <KV k={"Exhaust fans "+r.nFans+"× axial @ $2,000 ea"} v={fmtk(r.capex.fanCost)} col={C.amber}/>
                    <KV k="SUBTOTAL" v={fmtk(r.capex.subtotalMEP)} col={C.white}/>
                  </Panel>
                  <Panel title="Mobile Equipment" colour={C.amber} compact>
                    <KV k={"Hino Dutro 130HD ("+nTrucks+"× @ $"+truckCost.toLocaleString()+")"} v={fmtk(r.capex.truckFleetCost)} col={C.amber}/>
                    <KV k={"LTMG LT750D mini loaders ("+r.nMinis+"× @ $"+miniCost.toLocaleString()+")"} v={fmtk(r.capex.miniFleetCost)} col={C.amber}/>
                    <KV k="SUBTOTAL" v={fmtk(r.capex.subtotalMobile)} col={C.white}/>
                  </Panel>
                  <Panel compact>
                    {[
                      {l:"Earthworks + sub-base",        v:r.capex.subtotalSubbase},
                      {l:"Slabs + external surfacing",    v:r.capex.subtotalSlab},
                      {l:"GH structure + PVC film",       v:r.capex.ghStructCost},
                      {l:"MEP (water/drainage/fans)",     v:r.capex.subtotalMEP},
                      {l:"Mobile equipment",              v:r.capex.subtotalMobile},
                    ].map(row=>(
                      <div key={row.l} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid "+C.border}}>
                        <span style={{fontSize:12,color:C.label,fontFamily:sans}}>{row.l}</span>
                        <span style={{fontFamily:mono,fontSize:12,color:C.amber,fontWeight:700}}>{fmtk(row.v)}</span>
                      </div>
                    ))}
                    <div style={{display:"flex",justifyContent:"space-between",padding:"14px 0 4px",marginTop:4,borderTop:"2px solid "+C.gold}}>
                      <span style={{fontSize:14,fontWeight:700,color:C.white}}>TOTAL GH CAPEX</span>
                      <span style={{fontFamily:mono,fontSize:20,fontWeight:700,color:C.gold}}>{fmtk(r.capex.total)}</span>
                    </div>
                    <div style={{fontSize:10,color:C.dimgrey,marginTop:6,lineHeight:1.6}}>Excludes: advanced controls/SCADA, internal electrical distribution, S4-specific BSF harvest equipment.</div>
                  </Panel>
                </div>
              </div>
            )}

            {tab==="equipment"&&(
              <div>
                <div style={{background:C.panel,border:"1px solid "+C.border,borderRadius:6,overflow:"hidden"}}>
                  <div style={{display:"grid",gridTemplateColumns:"148px 1fr 36px 90px",gap:6,padding:"6px 10px",background:C.border}}>
                    {["TAG","EQUIPMENT","QTY","UNIT COST"].map(h=><div key={h} style={{fontFamily:mono,fontSize:9,color:C.grey,textTransform:"uppercase"}}>{h}</div>)}
                  </div>
                  <SHead title="STRUCTURE" colour={C.blue}/>
                  <ERow tag="GH-STRUCT-01" name={"Multi-span Steel + PVC Film Greenhouse — "+ghW+"×"+ghL+"m = "+r.ghArea.toLocaleString()+" m²"} qty={1} cost={r.capex.ghStructCost} note={"Tropical spec, 4m gutters, 7–8m high-roof central strip over "+laneW+"m truck lane. $"+ghStruct+"/m²"}/>
                  <SHead title="SLABS + EARTHWORKS" colour={C.blue}/>
                  <ERow tag="GH-SLAB-150" name={"150mm RC C25/30 — Beds + Aisles — "+r.slab150Area?.toLocaleString()+" m²"} qty={1} cost={r.capex.slab150Cost} note={"8mm mesh @ 150–200mm ctrs, upper third, 50mm cover. $"+(slab150Mat+slab150Lab)+"/m²"}/>
                  <ERow tag="GH-SLAB-200" name={"200mm RC C25/30 — Truck Lane "+laneW+"m × "+ghL+"m = "+(laneW*ghL).toLocaleString()+" m²"} qty={1} cost={r.capex.slab200Cost} note="10mm mesh, dowel bars at joints, rated 20t GVW truck"/>
                  <ERow tag="GH-EARTH-01" name="Land Clearing + Grading — 35,000 m² @ $0.75/m²" qty={1} cost={r.capex.clearCost}/>
                  <ERow tag="GH-EARTH-02" name="Compaction to 95% Proctor — 35,000 m² @ $1.25/m²" qty={1} cost={r.capex.compactCost}/>
                  <ERow tag="GH-EARTH-03" name={"Crushed Aggregate 100–200mm — "+r.aggArea.toLocaleString()+" m² @ $15/m²"} qty={1} cost={r.capex.aggCost}/>
                  <ERow tag="GH-EARTH-04" name={"Sand Bedding 25–50mm — "+r.aggArea.toLocaleString()+" m² @ $8.50/m²"} qty={1} cost={r.capex.sandCost}/>
                  <ERow tag="GH-DRAIN-CIV" name={"Drainage Earthworks + PVC/HDPE Pipes + Manholes — "+r.aggArea.toLocaleString()+" m² @ $18/m²"} qty={1} cost={r.capex.drainCivil}/>
                  <ERow tag="GH-ROAD-EXT" name="External Gravel Access Roads — 6,000 m² @ $4/m²" qty={1} cost={r.capex.extRoadCost}/>
                  <ERow tag="GH-APRON-EXT" name="External Concrete Truck Aprons 150mm — 4,000 m² @ $22/m²" qty={1} cost={r.capex.extApronCost}/>
                  <SHead title="DRAINAGE — TRENCH SYSTEM" colour={C.teal}/>
                  <ERow tag="TD-L-01" name={"Longitudinal Trench Drain — "+ghL+"m length, 300–400mm wide, 300–500mm deep, 0.5% fall to outlet"} qty={1} cost={r.capex.trenchHwCost} note="Cast-in-place or polymer concrete; HD slip-resistant grating rated for truck wheels; removable for cleaning"/>
                  <ERow tag="TD-X-01/02" name="Cross Trench Drains — inbound + outbound doors, 200–300mm internal, 10–20m each" qty={2} note="0.5–1.0% fall into TD-L; grated flush with slab"/>
                  <ERow tag="GH-SUMP-01" name="Drop Pit / Sump at TD-L low end — buried pipe connection" qty={1}/>
                  <ERow tag="GH-PIPE-01" name="Buried Outfall Pipes 250–400mm PVC/HDPE → leachate pond, 0.5–1.0% slope" qty={1} note="Access manholes every 40–60m"/>
                  <SHead title="WATER + SPRINKLERS" colour={C.green}/>
                  <ERow tag="SPR-GH-01" name={"Overhead Sprinkler System — "+r.nSprinklers.toLocaleString()+" heads @ 3m×3m, 10–20 irrigation zones"} qty={1} cost={r.capex.sprinklerCost} note={"Laterals 32–40mm, cross-mains 63–75mm, header 90–110mm PE/PVC; moisture sensor control. $"+sprRate+"/m²"}/>
                  <ERow tag="WD-RING-01" name="Wash-down Ring Main 50–75mm + 22 Hose Stations @ 20–25m spacing" qty={1} cost={r.capex.washdownCost} note="20–30 L/min per station @ 3–4 bar; backflow prevention; design for 2 simultaneous"/>
                  <SHead title="VENTILATION" colour={C.teal}/>
                  <ERow tag="FAN-EXH-01" name={"Exhaust Axial Fans 1.0–1.2m dia — "+r.nFans+" units for 20 ACH target"} qty={r.nFans} cost={2000} note="35,000 m³/h each; mounted end + side walls; pulls air across beds and out"/>
                  <ERow tag="GH-VENT-RIDGE" name="Ridge Vents Continuous — ~3,000 m² openable (15% of floor)" qty={1} note="Manual or motorised actuators along all span peaks"/>
                  <ERow tag="GH-VENT-SIDE" name="Side Roll-up Film Vents — both long walls, 1.5–2.0m band" qty={1}/>
                  <SHead title="MOBILE — TRUCKS" colour={C.amber}/>
                  {Array.from({length:nTrucks},(_,i)=>(
                    <ERow key={"tr"+i} tag={"TR-GH-0"+(i+1)} name={"Hino Dutro 130HD Dump — "+truckPayload+"t payload, 8-ton GVW class"} qty={1} cost={truckCost} note="Astra/Hino Indonesia dealer; Dutro Dump 130HD ~$19,922 (Oto.com ref)"/>
                  ))}
                  <SHead title="MOBILE — MINI LOADERS" colour={C.green}/>
                  {Array.from({length:r.nMinis},(_,i)=>(
                    <ERow key={"ml"+i} tag={"ML-GH-0"+(i+1)} name={"LTMG LT750D 400kg Electric Mini Skid-Steer — "+(i<r.miniWorking?"WORKING":(i===r.miniWorking?"CHARGING":"SPARE"))} qty={1} cost={miniCost} note="980mm width, 0.15m³ bucket, ~4h runtime, 6–8h charge 220V; imported via Indonesian heavy equipment trader"/>
                  ))}
                </div>
                <div style={{marginTop:8,fontSize:9,color:C.grey,lineHeight:1.7}}>TBD = supplier quote required. S4 BSF harvest equipment (troughs, separation, frass bagging, conveyors to S5) not included — separate CAPEX block required.</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
