import React from "react";
import { C, Fnt } from "../S1Shared/S1Shared.jsx";

/*
 * S1ProcessEngineering.jsx
 * Always renders ALL 3 residue lines (EFB · OPDC · POS) regardless of S0 selection.
 * Layout per row:  [LEFT stats panel] | [circle →] | [scrollable equipment chain]
 */

// ── DATA ──────────────────────────────────────────────────────────────────
const PE_STREAMS = [
  {
    abbr: "EFB",
    full: "Empty Fruit Bunch",
    code: "S1A",
    form: "Long Fibre",
    accent: "#40D7C5",
    dim: "rgba(64,215,197,.10)",
    stats: [
      { lbl: "MC In",      val: "62.5%" },
      { lbl: "MC Out",     val: "45–50%" },
      { lbl: "Daily In",   val: "300 t" },
      { lbl: "Belt",       val: "600mm" },
      { lbl: "Installed",  val: "298 kW" },
      { lbl: "C:N",        val: "60:1" },
      { lbl: "Throughput", val: "20 t/h" },
    ],
    outputLabel: "D90 Target",
    outputVal: "≤ 2mm",
    chain: [
      { n:  1, code: "AF-01",      name: "Hydraulic Feeder",     kw: "18 kW",  tph: "20 t/h",   note: "floor level · bulk fibre",      gate: null },
      { n:  2, code: "BC-01/02",   name: "Incline Conv. 600mm",  kw: "22 kW",  tph: "20 t/h",   note: "+2.0m elevation",               gate: null },
      { n:  3, code: "TR-2060",    name: "Trommel 50mm",         kw: "11 kW",  tph: "19 t/h",   note: "debris removal",                gate: null },
      { n:  4, code: "OBM-01",     name: "Overband Magnet",      kw: "3 kW",   tph: "19 t/h",   note: "tramp metal removal",           gate: null },
      { n:  5, code: "PR-01",      name: "Screw Press + PKSA",   kw: "30 kW",  tph: "14 t/h",   note: "MC floor 40%",                  gate: "B.G2" },
      { n:  6, code: "SD-01",      name: "Primary Shredder",     kw: "75 kW",  tph: "14 t/h",   note: "fibre reduction",               gate: null },
      { n:  7, code: "HM-01",      name: "Hammer Mill",          kw: "110 kW", tph: "14 t/h",   note: "SPRING-ISO zone",               gate: null },
      { n:  8, code: "VS-01",      name: "Vib. Screen 2mm",      kw: "11 kW",  tph: "13 t/h",   note: "particle gate",                 gate: "B.G1" },
      { n:  9, code: "DC-01",      name: "Baghouse",             kw: "18 kW",  tph: "13 t/h",   note: "shared w/ OPDC line",           gate: null },
      { n: 10, code: "BIN-EFB-01", name: "Buffer Bin 50m³",      kw: "0 kW",   tph: "13 t/h",   note: "→ S2 handoff",                  gate: null },
    ],
  },
  {
    abbr: "OPDC",
    full: "Oil Palm Decanter Cake",
    code: "S1B",
    form: "Paste",
    accent: "#F5A623",
    dim: "rgba(245,166,35,.10)",
    stats: [
      { lbl: "MC In",      val: "70–75%" },
      { lbl: "MC Out",     val: "≤ 35%" },
      { lbl: "Daily In",   val: "42 t" },
      { lbl: "Belt",       val: "500mm" },
      { lbl: "Installed",  val: "206 kW" },
      { lbl: "C:N",        val: "20:1" },
      { lbl: "Throughput", val: "5 t/h" },
    ],
    outputLabel: "D90 Target",
    outputVal: "≤ 3mm",
    chain: [
      { n:  1, code: "SF-01",         name: "Recip. Feeder",        kw: "7.5 kW", tph: "5 t/h",    note: "SS304 anti-bridging",           gate: null },
      { n:  2, code: "BC-10/11",      name: "Incline Conv. 500mm",  kw: "15 kW",  tph: "5 t/h",    note: "+2.0m elevation",               gate: null },
      { n:  3, code: "TR-OPDC-01",    name: "Trommel 50mm",         kw: "9 kW",   tph: "4.8 t/h",  note: "debris removal",                gate: null },
      { n:  4, code: "OBM-02",        name: "Overband Magnet",      kw: "3 kW",   tph: "4.8 t/h",  note: "tramp metal removal",           gate: null },
      { n:  5, code: "DC-PRESS-01",   name: "Screw Press + PKSA",   kw: "30 kW",  tph: "3.5 t/h",  note: "MC ≥ 40% locked",              gate: "CLASS A" },
      { n:  6, code: "LB-01",         name: "Lump Breaker",         kw: "37 kW",  tph: "3.5 t/h",  note: "paste de-lumping",              gate: null },
      { n:  7, code: "HM-02",         name: "Hammer Mill",          kw: "90 kW",  tph: "3.5 t/h",  note: "SPRING ISO zone",               gate: null },
      { n:  8, code: "VS-02",         name: "Vib. Screen 3mm",      kw: "9 kW",   tph: "3.3 t/h",  note: "particle gate",                 gate: null },
      { n:  9, code: "DC-01",         name: "Baghouse",             kw: "0 kW",   tph: "3.3 t/h",  note: "shared w/ EFB line",            gate: null },
      { n: 10, code: "BIN-OPDC-301",  name: "Buffer Bin 85m³",      kw: "5.5 kW", tph: "3.3 t/h",  note: "24hr Dwell · pH 8–9",           gate: "DWELL" },
    ],
  },
  {
    abbr: "POS",
    full: "Palm Oil Sludge",
    code: "S1C",
    form: "Slurry",
    accent: "#3B82F6",
    dim: "rgba(59,130,246,.10)",
    stats: [
      { lbl: "MC In",      val: "82%" },
      { lbl: "MC Out",     val: "65–70%" },
      { lbl: "Daily In",   val: "30 t" },
      { lbl: "Form",       val: "Liquid" },
      { lbl: "Installed",  val: "62 kW" },
      { lbl: "C:N",        val: "19:1" },
      { lbl: "Throughput", val: "1.25 t/h" },
    ],
    outputLabel: "Cake Output",
    outputVal: "65–70% MC",
    chain: [
      { n: 1, code: "SPIT-01",     name: "Sludge Pit 15m³",     kw: "0 kW",  tph: "1.25 t/h", note: "RC · epoxy lined · 60° walls",  gate: null },
      { n: 2, code: "DRS-SLD-01",  name: "Rotary Drum Screen",  kw: "7 kW",  tph: "1.17 t/h", note: "solids pre-separation",         gate: null },
      { n: 3, code: "DEC-SLD-101", name: "Decanter Centrifuge", kw: "55 kW", tph: "0.56 t/h", note: "Fe gate · ICP-OES required",    gate: "Fe GATE" },
      { n: 4, code: "BIN-POS-301", name: "Buffer Tank 15m³",    kw: "0 kW",  tph: "0.56 t/h", note: "CaCO3 dosing · pH 5.5–6.0",    gate: null },
    ],
  },
];

const GATE_COLORS = {
  "B.G2":     "#E84040",
  "CLASS A":  "#E84040",
  "B.G1":     "#84CC16",
  "DWELL":    "#F5A623",
  "Fe GATE":  "#5BA3FF",
};

// ── EQUIPMENT NODE ────────────────────────────────────────────────────────
function EqChainNode({ eq, accent }) {
  const gateColor = eq.gate ? (GATE_COLORS[eq.gate] || accent) : null;
  const bdr = gateColor || (accent + "55");
  const bg  = gateColor ? (gateColor + "18") : "rgba(0,0,0,.20)";

  return (
    <div style={{
      position: "relative",
      flexShrink: 0,
      display: "flex",
      flexDirection: "column",
      gap: 3,
      background: bg,
      border: `1.5px solid ${bdr}`,
      borderRadius: 7,
      padding: "16px 14px 9px",
      minWidth: 110,
    }}>
      {/* Step badge */}
      <div style={{
        position: "absolute",
        top: -8,
        left: 10,
        background: gateColor || accent,
        color: "#060C14",
        fontFamily: Fnt.mono,
        fontSize: 8,
        fontWeight: 700,
        padding: "1px 6px",
        borderRadius: 2,
        letterSpacing: ".05em",
        whiteSpace: "nowrap",
      }}>
        {String(eq.n).padStart(2, "0")}
      </div>

      {/* Code */}
      <div style={{
        fontFamily: Fnt.mono,
        fontSize: 9,
        fontWeight: 700,
        color: gateColor || accent,
        whiteSpace: "nowrap",
        letterSpacing: ".05em",
      }}>
        {eq.code}
      </div>

      {/* Name — 12px per spec */}
      <div style={{
        fontFamily: Fnt.dm,
        fontSize: 12,
        fontWeight: 700,
        color: C.white,
        whiteSpace: "nowrap",
      }}>
        {eq.name}
      </div>

      {/* kW · tph — numbers brightness +20% */}
      <div style={{ display: "flex", alignItems: "center", gap: 5, whiteSpace: "nowrap" }}>
        <span style={{ fontFamily: Fnt.mono, fontSize: 10, fontWeight: 700, color: C.amber, filter: "brightness(1.2)", whiteSpace: "nowrap" }}>
          {eq.kw}
        </span>
        <span style={{ color: "rgba(168,189,208,.4)", fontSize: 10 }}>·</span>
        <span style={{ fontFamily: Fnt.mono, fontSize: 10, fontWeight: 700, color: C.teal, filter: "brightness(1.2)", whiteSpace: "nowrap" }}>
          {eq.tph}
        </span>
      </div>

      {/* Note — 11px, brightness +20% per spec */}
      <div style={{
        fontFamily: Fnt.dm,
        fontSize: 11,
        color: C.grey,
        filter: "brightness(1.2)",
        whiteSpace: "nowrap",
      }}>
        {eq.note}
      </div>

      {/* Gate badge */}
      {eq.gate && (
        <div style={{
          marginTop: 3,
          fontFamily: Fnt.mono,
          fontSize: 8,
          fontWeight: 700,
          color: gateColor,
          border: `1px solid ${gateColor}`,
          borderRadius: 2,
          padding: "1px 5px",
          textAlign: "center",
          whiteSpace: "nowrap",
        }}>
          ■ {eq.gate}
        </div>
      )}
    </div>
  );
}

// ── STREAM ROW ────────────────────────────────────────────────────────────
function StreamRow({ stream, isLast }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      padding: "20px 22px",
      borderBottom: isLast ? "none" : `1px solid ${C.bdrIdle}`,
      minHeight: 130,
    }}>

      {/* LEFT — residue stats */}
      <div style={{ width: 410, flexShrink: 0, paddingRight: 20 }}>

        {/* Row 1: badge · name · code · form */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 12,
          whiteSpace: "nowrap",
        }}>
          <div style={{
            fontFamily: Fnt.mono,
            fontWeight: 700,
            fontSize: 11,
            color: "#060C14",
            background: stream.accent,
            padding: "3px 10px",
            borderRadius: 3,
            letterSpacing: ".05em",
            flexShrink: 0,
          }}>
            {stream.abbr}
          </div>
          <div style={{ fontFamily: Fnt.syne, fontWeight: 700, fontSize: 12, color: C.white, whiteSpace: "nowrap" }}>
            {stream.full}
          </div>
          <div style={{ fontFamily: Fnt.mono, fontSize: 10, color: stream.accent, opacity: 0.75, whiteSpace: "nowrap" }}>
            · {stream.code} · {stream.form}
          </div>
        </div>

        {/* Row 2: all stats on ONE horizontal row — main numbers 14px, brightness +20% */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 20, whiteSpace: "nowrap" }}>
          {stream.stats.map(({ lbl, val }) => (
            <div key={lbl} style={{ display: "flex", flexDirection: "column", gap: 3, flexShrink: 0 }}>
              <div style={{
                fontFamily: Fnt.dm,
                fontSize: 9,
                fontWeight: 700,
                color: C.grey,
                textTransform: "uppercase",
                letterSpacing: ".07em",
                whiteSpace: "nowrap",
              }}>
                {lbl}
              </div>
              <div style={{
                fontFamily: Fnt.mono,
                fontSize: 14,
                fontWeight: 700,
                color: stream.accent,
                filter: "brightness(1.2)",
                whiteSpace: "nowrap",
              }}>
                {val}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CENTER — arrow in circle, 3× wide slot, 5× thick border */}
      <div style={{ width: 96, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{
          width: 62,
          height: 62,
          borderRadius: "50%",
          border: `5px solid ${stream.accent}`,
          background: stream.dim,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: stream.accent,
          fontSize: 28,
          fontWeight: 900,
          filter: "brightness(1.1)",
          userSelect: "none",
        }}>
          →
        </div>
      </div>

      {/* RIGHT — equipment chain, increased padding + 2× gap */}
      <div style={{
        flex: 1,
        overflowX: "auto",
        overflowY: "visible",
        paddingLeft: 32,
        paddingTop: 14,
        paddingBottom: 14,
        display: "flex",
        alignItems: "center",
        gap: 32,
        scrollbarWidth: "thin",
        scrollbarColor: `${stream.accent}55 transparent`,
      }}>
        {stream.chain.map((eq, i) => (
          <React.Fragment key={eq.code}>
            <EqChainNode eq={eq} accent={stream.accent} />
            {i < stream.chain.length - 1 && (
              <div style={{
                flexShrink: 0,
                fontFamily: Fnt.mono,
                fontSize: 16,
                fontWeight: 700,
                color: stream.accent + "88",
                userSelect: "none",
                lineHeight: 1,
              }}>→</div>
            )}
          </React.Fragment>
        ))}

        {/* Terminal output cell — last column at 14px per spec */}
        <div style={{
          flexShrink: 0,
          background: stream.accent + "1A",
          border: `2px solid ${stream.accent}`,
          borderRadius: 7,
          padding: "10px 18px",
          display: "flex",
          flexDirection: "column",
          gap: 4,
          marginLeft: 10,
        }}>
          <div style={{
            fontFamily: Fnt.mono,
            fontSize: 9,
            fontWeight: 700,
            color: stream.accent,
            textTransform: "uppercase",
            letterSpacing: ".07em",
            whiteSpace: "nowrap",
          }}>
            {stream.outputLabel}
          </div>
          <div style={{
            fontFamily: Fnt.mono,
            fontSize: 14,
            fontWeight: 700,
            color: stream.accent,
            filter: "brightness(1.2)",
            whiteSpace: "nowrap",
          }}>
            {stream.outputVal}
          </div>
          <div style={{
            fontFamily: Fnt.dm,
            fontSize: 11,
            color: C.grey,
            filter: "brightness(1.2)",
            whiteSpace: "nowrap",
          }}>
            → S2 Handoff
          </div>
        </div>
      </div>
    </div>
  );
}

// ── MAIN EXPORT ───────────────────────────────────────────────────────────
export default function S1ProcessEngineering() {
  return (
    <div style={{
      margin: "28px 0 0",
      background: C.navyCard,
      border: `1px solid ${C.bdrIdle}`,
      borderRadius: 12,
      overflow: "clip",
    }}>
      {/* Section header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "13px 22px",
        background: C.navyMid,
        borderBottom: `1px solid ${C.bdrIdle}`,
      }}>
        <div style={{ width: 4, height: 20, borderRadius: 2, background: C.teal, flexShrink: 0 }} />
        <div style={{
          fontFamily: Fnt.syne,
          fontWeight: 700,
          fontSize: 13,
          color: C.white,
          textTransform: "uppercase",
          letterSpacing: ".08em",
        }}>
          Process Engineering
        </div>
        <div style={{
          fontFamily: Fnt.mono,
          fontSize: 10,
          fontWeight: 700,
          color: C.teal,
          background: "rgba(64,215,197,.10)",
          border: "1px solid rgba(64,215,197,.30)",
          padding: "3px 10px",
          borderRadius: 4,
          marginLeft: 6,
          whiteSpace: "nowrap",
        }}>
          S1A · S1B · S1C
        </div>
        <div style={{
          marginLeft: "auto",
          fontFamily: Fnt.dm,
          fontSize: 11,
          color: C.grey,
          whiteSpace: "nowrap",
        }}>
          All residues · independent of S0 selection
        </div>
      </div>

      {/* Three stream rows */}
      {PE_STREAMS.map((stream, idx) => (
        <StreamRow
          key={stream.abbr}
          stream={stream}
          isLast={idx === PE_STREAMS.length - 1}
        />
      ))}
    </div>
  );
}