import { useNavigate } from "react-router-dom";

const F = "'DM Sans', sans-serif";

function Badge({ text, bg, border, color }) {
  return (
    <span style={{
      fontFamily: F, fontSize: 9, fontWeight: 700, padding: "3px 9px",
      borderRadius: 2, background: bg, border: `1px solid ${border}`, color,
    }}>{text}</span>
  );
}

function DocCard({ type, typeBg, name, spec, link, disabled }) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => !disabled && link && navigate(link)}
      style={{
        border: "1.5px solid #ddd", borderRadius: 3, padding: "10px 12px",
        background: "#fafafa", display: "flex", justifyContent: "space-between",
        alignItems: "center", cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.4 : 1,
        transition: "border-color 0.15s, background 0.15s",
      }}
      onMouseEnter={e => { if (!disabled) { e.currentTarget.style.borderColor = "#111"; e.currentTarget.style.background = "#f0f0f0"; }}}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "#ddd"; e.currentTarget.style.background = "#fafafa"; }}
    >
      <div>
        <div style={{ fontFamily: F, fontSize: 8, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: typeBg, marginBottom: 3 }}>{type}</div>
        <div style={{ fontFamily: F, fontSize: 10, fontWeight: 700, color: "#111" }}>{name}</div>
        <div style={{ fontFamily: F, fontSize: 8.5, color: "#666", marginTop: 2 }}>{spec}</div>
      </div>
      {!disabled && <span style={{ fontFamily: F, fontSize: 14, color: "#111" }}>→</span>}
    </div>
  );
}

function SectionLabel({ text, mt }) {
  return (
    <div style={{
      fontFamily: F, fontSize: 11, fontWeight: 700, color: "#111",
      textTransform: "uppercase", letterSpacing: ".06em",
      borderLeft: "3px solid #111", paddingLeft: 10,
      marginTop: mt || 24, marginBottom: 12,
    }}>{text}</div>
  );
}

function RefCard({ title, values }) {
  return (
    <div style={{ border: "1.5px solid #ddd", borderRadius: 3, padding: "10px 12px", background: "#fafafa" }}>
      <div style={{ fontFamily: F, fontSize: 9, fontWeight: 700, color: "#111", textTransform: "uppercase", letterSpacing: ".04em", marginBottom: 6 }}>{title}</div>
      {values.map((v, i) => (
        <div key={i} style={{
          fontFamily: F, fontSize: 8.5, color: "#555", lineHeight: 1.7,
          borderBottom: i < values.length - 1 ? "1px solid #f0f0f0" : "none",
          padding: "2px 0",
        }}>{v}</div>
      ))}
    </div>
  );
}

export default function S1Index() {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: F, color: "#111" }}>
      {/* ═══ PERSISTENT CFI GLOBAL HEADER ═══ */}
      <div style={{
        background: "#0A1628", height: 83, display: "flex", alignItems: "center",
        padding: "0 32px", justifyContent: "space-between",
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontFamily: F, fontSize: 26, fontWeight: 700, color: "#FFFFFF" }}>CFI</span>
          <span style={{ color: "#FFFFFF", fontSize: 26 }}>|</span>
          <span style={{ fontFamily: F, fontSize: 26, fontWeight: 700, color: "#33D4BC" }}>Deep Tech</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2, textAlign: "right" }}>
          <span style={{ fontFamily: F, fontSize: 13, color: "#FFFFFF", opacity: 0.7 }}>
            Precision Engineering | Circular Nutrient Recovery in Agricultural Systems
          </span>
          <span style={{ fontFamily: F, fontSize: 13, color: "#FFFFFF", opacity: 0.7 }}>
            Applied Biology | Rebalancing Soil's Microbiome &amp; Reducing Synthetic Fertiliser Use
          </span>
        </div>
      </div>

      {/* Spacer */}
      <div style={{ height: 83 }} />

      {/* ═══ PAGE WRAPPER ═══ */}
      <div style={{ background: "#e0e0e0", minHeight: "calc(100vh - 83px)", padding: 20 }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          {/* White card */}
          <div style={{ background: "#FFFFFF", border: "3px solid #111", borderRadius: 3, padding: "28px 32px 36px" }}>

            {/* ═══ TITLE ═══ */}
            <div style={{ fontFamily: F, fontSize: 22, fontWeight: 700, color: "#111" }}>
              S1 Pre-Processing — Engineering Drawing Index
            </div>
            <div style={{ fontFamily: F, fontSize: 10, color: "#555", marginBottom: 28 }}>
              3 lines · 3 drawing types · 9 panes · EFB S1C · OPDC S1B · POS S1A · Rev 02 · March 2026
            </div>

            {/* ═══ HERO CARD ═══ */}
            <SectionLabel text="Primary reference" mt={24} />
            <div style={{
              background: "#060C14", border: "3px solid #111", borderRadius: 3,
              padding: "22px 24px", display: "flex", alignItems: "center",
              justifyContent: "space-between", marginBottom: 24,
            }}>
              <div>
                <div style={{ fontFamily: F, fontSize: 9, fontWeight: 700, color: "#40D7C5", letterSpacing: ".1em" }}>
                  COMPLETE ENGINEERING REFERENCE · ALL 9 PANES
                </div>
                <div style={{ fontFamily: F, fontSize: 20, fontWeight: 700, color: "#FFFFFF", marginTop: 6 }}>
                  CFI S1 Master — v3
                </div>
                <div style={{ fontFamily: F, fontSize: 10, color: "#8BA0B4", lineHeight: 1.7, maxWidth: 540, marginTop: 6 }}>
                  Single unified file containing all 3 lines × 3 drawing types. Fixed dark navy nav bar. Switch line (EFB / OPDC / POS) and drawing type (Floor Plan / ASCII Flow / Process Engineering) without leaving the file. All gap fixes applied. All canonical values locked.
                </div>
                <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                  <Badge text="Floor Plan" bg="#0B3A4A" border="#40C8C0" color="#40C8C0" />
                  <Badge text="ASCII Flow" bg="#2A1800" border="#F5A623" color="#F5A623" />
                  <Badge text="Process Engineering" bg="#0B1422" border="#40D7C5" color="#40D7C5" />
                  <Badge text="Rev 02 · Mar 2026" bg="#1a1a1a" border="#555" color="#888" />
                </div>
              </div>
              <button
                onClick={() => navigate("/s1-master")}
                style={{
                  fontFamily: F, fontSize: 12, fontWeight: 700, color: "#0B1422",
                  background: "#40D7C5", border: "none", borderRadius: 3,
                  padding: "11px 24px", cursor: "pointer", whiteSpace: "nowrap",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "#5ae8d6"}
                onMouseLeave={e => e.currentTarget.style.background = "#40D7C5"}
              >
                Open Master File →
              </button>
            </div>

            {/* ═══ LINE-BY-LINE GRID ═══ */}
            <SectionLabel text="Individual drawing files by line" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 24 }}>
              {/* EFB Column */}
              <div>
                <div style={{ background: "#0B3A4A", color: "#40C8C0", fontFamily: F, fontSize: 10, fontWeight: 700, padding: "8px 14px", borderBottom: "2px solid #111" }}>
                  EFB Line — S1C &nbsp;| &nbsp;20 t/h · 600mm · 10 machines
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
                  <DocCard type="FLOOR PLAN" typeBg="#185FA5" name="Combined v2" spec="All 3 lines · EFB tab active · gap fixes applied" link="/s1-combined" />
                  <DocCard type="ASCII FLOW" typeBg="#006e5a" name="EFB ASCII v2" spec="10 nodes · oversize return ⑦ · noise zone" link="/s1-efb-ascii" />
                  <DocCard type="PROCESS ENG." typeBg="#9a6000" name="EFB PE Sheet" spec="Inside Master v3 only" disabled />
                </div>
              </div>
              {/* OPDC Column */}
              <div>
                <div style={{ background: "#2A1800", color: "#F5A623", fontFamily: F, fontSize: 10, fontWeight: 700, padding: "8px 14px", borderBottom: "2px solid #111" }}>
                  OPDC Line — S1B &nbsp;| &nbsp;5 t/h · 500mm · 10 machines
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
                  <DocCard type="FLOOR PLAN" typeBg="#185FA5" name="Combined v2 — OPDC tab" spec="CLASS A badge · 24hr dwell bin · lump breaker" link="/s1-combined#opdc" />
                  <DocCard type="ASCII FLOW" typeBg="#006e5a" name="OPDC ASCII v2" spec="10 nodes · CLASS A gate · OB-07 return ⑦" link="/s1-opdc-ascii" />
                  <DocCard type="PROCESS ENG." typeBg="#9a6000" name="OPDC PE Sheet" spec="Inside Master v3 only" disabled />
                </div>
              </div>
              {/* POS Column */}
              <div>
                <div style={{ background: "#0B1422", color: "#40D7C5", fontFamily: F, fontSize: 10, fontWeight: 700, padding: "8px 14px", borderBottom: "2px solid #111" }}>
                  POS Line — S1A &nbsp;| &nbsp;1.5 t/h · slurry · 5 machines
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
                  <DocCard type="FLOOR PLAN" typeBg="#185FA5" name="Combined v2 — POS tab" spec="5 cards · T-SLD-101 · DCN +2.5m · ICP-OES" link="/s1-combined#pos" />
                  <DocCard type="ASCII FLOW" typeBg="#006e5a" name="POS ASCII v1" spec="5 nodes · Fe gate thresholds · centrate split" link="/s1-pos-ascii" />
                  <DocCard type="PROCESS ENG." typeBg="#9a6000" name="POS PE Sheet" spec="Inside Master v3 only" disabled />
                </div>
              </div>
            </div>

            {/* ═══ LOCKED CANONICAL VALUES ═══ */}
            <SectionLabel text="Locked canonical values — quick reference" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12, marginBottom: 24 }}>
              <RefCard title="EFB S1C" values={[
                "MC in: 62.5%", "MC out: 45–50%", "Throughput: 20 t/h · 600mm",
                "Monthly: 8,262 t FW", "Particle: D90 ≤ 2mm",
                "Gate B.G2: MC ≤ 50%", "Gate B.G1: D90 ≤ 2mm",
                "Buffer: 50 m³ BIN-EFB-201", "Building: 15m × 35m × 10m", "Installed: ~115 kW",
              ]} />
              <RefCard title="OPDC S1B" values={[
                "MC in: 70–75%", "MC out: 60–62%", "MC floor: ≥40% CLASS A LOCKED",
                "Throughput: 5 t/h · 500mm", "Monthly: 1,256 t FW",
                "Yield: 15.2% EFB FW · 4.2% FFB", "Particle: D90 ≤ 2mm",
                "Dwell: ≥24hr · pH 8.0–9.0", "Buffer: 15 m³ BIN-OPDC-301", "Building: 15m × 35m × 10m",
              ]} />
              <RefCard title="POS S1A" values={[
                "MC in: 82%", "MC out: 65%", "Throughput: 1.5 t/h (20 hr/day)",
                "Daily: 30 t/day FW", "Hopper: 15 m³ · epoxy RC · at-grade",
                "Sludge tank: T-SLD-101 · SS304", "Decanter: DCN-POS-01 · EL +2.5m",
                "Gate: ICP-OES Fe · CFI-LAB-POME-001", "Buffer: 5 m³ BUF-POS-01", "Building: 12m × 18m × 6m",
              ]} />
              <RefCard title="3-Stream NPK at 60 TPH" values={[
                "N: 582 kg/day", "P: 197 kg/day", "K: 930 kg/day",
                "POS N: 102 kg/day", "POS P: 24 kg/day", "POS K: 42 kg/day",
                "N conv: N × 6.25 always", "P conv: P × 2.29 → P₂O₅",
                "K conv: K × 1.20 → K₂O", "Derate: 65% nameplate all equip.",
              ]} />
            </div>

            {/* ═══ HARD GUARDRAILS ═══ */}
            <div style={{
              background: "rgba(204, 34, 34, 0.05)", border: "1px solid rgba(204, 34, 34, 0.3)",
              borderRadius: 3, padding: "12px 16px", marginBottom: 24,
            }}>
              <div style={{ fontFamily: F, fontSize: 10, fontWeight: 700, color: "#cc2222", textTransform: "uppercase", marginBottom: 8 }}>
                Hard Guardrails — Non-Negotiable
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "4px 16px" }}>
                {[
                  "OPDC press MC ≥ 40% — Math.max(40, reading)",
                  "Hammer mills: spring isolation only — never rigid",
                  "Oversize always → hammer mill ⑦ (not shredder)",
                  "Press water → POME pond only — never to substrate",
                  "POS pit: epoxy RC — NOT SS316L lining",
                  "POS: no large liquid storage — near-continuous turnover",
                  "Baghouse: parallel unit — duct-fed, not in series",
                  "Centrate → POME pond — never to substrate",
                  "OPDC C.G2/G3: dwell ≥24hr + pH 8.0–9.0 before S2",
                ].map((g, i) => (
                  <div key={i} style={{ fontFamily: F, fontSize: 9, color: "#8b0000", lineHeight: 1.6 }}>
                    ⚠ {g}
                  </div>
                ))}
              </div>
            </div>

            {/* ═══ FOOTER ═══ */}
            <div style={{
              borderTop: "1px solid #ddd", paddingTop: 14,
              display: "flex", justifyContent: "space-between",
            }}>
              <div style={{ fontFamily: F, fontSize: 9, color: "#888", lineHeight: 1.7 }}>
                CFI Deep Tech · 60 TPH FFB Mill · Bogor, West Java, Indonesia
              </div>
              <div style={{ fontFamily: F, fontSize: 9, color: "#aaa" }}>
                Rev 02 · March 2026 · CFI-S1-INDEX-001
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
