import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

// ─── STREAMS ─────────────────────────────────────────────────────────────────
const STREAMS = ["EFB","OPDC","POS","POME","PKE","PKS","PMF","ASH","OPF","OPT","BSF"];

// ─── PARAMETER NAME MAP ─────────────────────────────────────────────────────
const PARAM_NAMES = {
  carbon_pct: "Carbon (C)", N_pct: "Nitrogen (N)", P_pct: "Phosphorus (P)",
  K_pct: "Potassium (K)", Ca_pct: "Calcium (Ca)", Mg_pct: "Magnesium (Mg)",
  S_pct: "Sulfur (S)", H_pct: "Hydrogen (H)", O_pct: "Oxygen (O)",
  Cu_mg_kg: "Copper (Cu)", Mn_mg_kg: "Manganese (Mn)", Zn_mg_kg: "Zinc (Zn)",
  Ni_mg_kg: "Nickel (Ni)", Fe_mg_kg: "Iron (Fe)", Cl_pct: "Chlorine (Cl)",
  cn_ratio: "C:N Ratio", moisture_pct: "Moisture", ash_pct: "Ash",
  OM_pct: "Organic Matter", VM_pct: "Volatile Matter", FC_pct: "Fixed Carbon",
  protein_pct: "Crude Protein", EE_pct: "Ether Extract",
  HHV_mj_kg: "HHV (Higher Heating Value)", LHV_mj_kg: "LHV (Lower Heating Value)",
  lignin_pct: "Lignin (ADL)", ADF_pct: "ADF (Acid Detergent Fiber)",
  NDF_pct: "NDF (Neutral Detergent Fiber)", cellulose_pct: "Cellulose",
  hemicellulose_pct: "Hemicellulose", ADL_VS_pct: "ADL (Van Soest)",
  pH: "pH", EC_mS_cm: "EC (Electrical Conductivity)",
  CEC_cmol_kg: "CEC (Cation Exchange Capacity)",
  liming_eq_kg_caco3_t_dm: "Liming Equivalency",
  P2O5_pct: "P₂O₅ (Phosphorus Pentoxide)", K2O_pct: "K₂O (Potassium Oxide)",
  CaO_pct: "CaO (Calcium Oxide)", MgO_pct: "MgO (Magnesium Oxide)",
  As_mg_kg: "Arsenic (As)", Cd_mg_kg: "Cadmium (Cd)", Cr_mg_kg: "Chromium (Cr)",
  Pb_mg_kg: "Lead (Pb)", Hg_mg_kg: "Mercury (Hg)", SiO2_ash_pct: "SiO₂ (in ash)",
  BSF_score: "BSF Suitability Score", humic_acid_pct: "Humic Acid",
  fulvic_acid_pct: "Fulvic Acid", N_agro_usd_t_dm: "Nitrogen Value",
  P_agro_usd_t_dm: "Phosphorus Value", K_agro_usd_t_dm: "Potassium Value",
  total_agro_usd_t_dm: "Total Agronomic Value", yield_pct_EFB: "OPDC Yield from EFB",
  GHG_baseline_t_co2e_t_dm: "GHG Baseline Emissions",
};

// ─── SECTION TITLES ──────────────────────────────────────────────────────────
const SECTION_DEFS = {
  ELE: { title: "Elemental / Nutrient Analysis", meta: "% DM · mg/kg DM" },
  PRX: { title: "Proximate Analysis", meta: "% wb · % DM · MJ/kg DM" },
  FIB: { title: "Fiber Analysis", meta: "% DM" },
  PHY: { title: "Physicochemical Properties", meta: "various units" },
  HMT: { title: "Heavy Metals & Trace Elements", meta: "mg/kg DM · % ash" },
  BIO: { title: "Biological Indicators", meta: "score · % DM" },
  AGV: { title: "Agronomic Value", meta: "USD/t DM · %" },
  LAR: { title: "Large Molecule Analysis", meta: "t CO₂e/t DM" },
};

const SECTION_ORDER = ["ELE","PRX","FIB","PHY","HMT","BIO","AGV","LAR"];

// ─── BADGE COMPONENT ─────────────────────────────────────────────────────────
function Badge({ type, text }) {
  const styles = {
    "VERIFIED":     { bg: "rgba(114, 223, 166, 0.15)", color: "#72DFA6" },
    "PASS":         { bg: "rgba(114, 223, 166, 0.15)", color: "#72DFA6" },
    "PENDING":      { bg: "rgba(245, 166, 35, 0.12)",  color: "#F5A623" },
    "LDE-HIGH":     { bg: "rgba(114, 223, 166, 0.10)", color: "#72DFA6" },
    "LAB-CONFIRMED":{ bg: "rgba(114, 223, 166, 0.15)", color: "#72DFA6" },
    "LDE-MODERATE": { bg: "rgba(245, 166, 35, 0.10)",  color: "#F5A623" },
    "LDE-LOW":      { bg: "rgba(255, 92, 92, 0.10)",   color: "#FF5C5C" },
  };
  const s = styles[type] || { bg: "rgba(139,160,180,0.10)", color: "#888" };
  return (
    <span style={{
      background: s.bg, color: s.color, fontFamily: "'DM Mono', monospace", fontSize: 11,
      padding: "2px 7px", borderRadius: 3, whiteSpace: "nowrap",
    }}>
      {text}
    </span>
  );
}

// ─── COLUMN WIDTHS ───────────────────────────────────────────────────────────
const COLS = [
  { key: "parameter",  label: "PARAMETER",  width: 210, align: "left" },
  { key: "unit",        label: "UNIT",       width: 90,  align: "left" },
  { key: "result",      label: "RESULT",     width: 110, align: "left" },
  { key: "range",       label: "RANGE",      width: 120, align: "left" },
  { key: "sni",         label: "SNI",        width: 100, align: "left" },
  { key: "status",      label: "STATUS",     width: 105, align: "left" },
  { key: "confidence",  label: "CONFIDENCE", width: 135, align: "left" },
  { key: "method",      label: "METHOD",     width: 185, align: "left" },
  { key: "edit",        label: "EDIT",       width: 110, align: "center" },
];

// ─── METRICS (hardcoded per Chunk 1) ─────────────────────────────────────────
const METRICS_VISIBLE = [
  { label: "Dry Matter",      value: "30%",                                    sub: "% wb · press floor" },
  { label: "Crude Protein",   value: "14.5%",                                  sub: "DM · N×6.25" },
  { label: "Lignin ADL",      value: "10.78%",                                 sub: "DM · BSF gate PASS" },
  { label: "CEC",             value: "Data gap",                               sub: "cmol/kg · pending ICP", isGap: true },
  { label: "N · P · K",       value: "2.32%  ·  0.30%  ·  1.90%",             sub: "% DM · ICP-OES" },
  { label: "N · P₂O₅ · K₂O", value: "2.32%  ·  0.69%  ·  2.29%",            sub: "% DM" },
  { label: "Per Tonne DM",    value: "N: 23.2kg  P: 3.0kg  K: 19.0kg",       sub: "kg per tonne" },
];
const METRICS_HIDDEN = [
  { label: "Cellulase", value: "2–5 U/g", sub: "" },
  { label: "Xylanase",  value: "1–3 U/g", sub: "" },
];

// ─── HELPER: map DB row to table row ─────────────────────────────────────────
function mapRow(p) {
  const val = p.value_numeric != null ? String(p.value_numeric) : (p.value_text || null);
  return {
    parameter: PARAM_NAMES[p.parameter] || p.parameter,
    unit: p.unit || "—",
    result: val || "DATA GAP",
    range: p.result_range || "—",
    sni: p.sni_standard || "—",
    status: p.status || "PENDING",
    confidence: p.confidence_level || "LDE-LOW",
    method: p.method_code || "—",
  };
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function LabAnalysis() {
  const [activeStream, setActiveStream] = useState("OPDC");
  const [showAll, setShowAll] = useState(false);
  const [showEnzymes, setShowEnzymes] = useState(false);
  const [openSections, setOpenSections] = useState({ ELE: true, PRX: false, FIB: false, PHY: false, HMT: false, BIO: false, AGV: false, LAR: false });
  const [labData, setLabData] = useState([]);
  const [loading, setLoading] = useState(true);

  const toggleSection = (code) => setOpenSections(prev => ({ ...prev, [code]: !prev[code] }));

  // Fetch from Supabase when stream changes
  useEffect(() => {
    if (showAll) return; // Combined mode uses hardcoded for now
    setLoading(true);
    supabase
      .from("canonical_lab_data")
      .select("*")
      .eq("stream", activeStream)
      .order("section_code", { ascending: true })
      .then(({ data, error }) => {
        if (error) console.error("Lab fetch error:", error);
        setLabData(data || []);
        setLoading(false);
      });
  }, [activeStream, showAll]);

  // Group by section_code
  const sections = {};
  SECTION_ORDER.forEach(code => {
    sections[code] = (labData || []).filter(p => p.section_code === code).map(mapRow);
  });

  return (
    <div style={{ background: "#060C14", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", color: "#FFFFFF" }}>

      {/* ═══ 1. HEADER — 83px ═══ */}
      <div style={{
        background: "#0A1628", height: 83, display: "flex", alignItems: "center",
        padding: "0 32px", justifyContent: "space-between",
      }}>
        {/* Left */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontFamily: "'EB Garamond', serif", fontSize: 26, fontWeight: 700, color: "#FFFFFF" }}>CFI</span>
          <span style={{ color: "#FFFFFF", fontSize: 26 }}>|</span>
          <span style={{ fontFamily: "'EB Garamond', serif", fontSize: 26, fontWeight: 700, color: "#33D4BC" }}>Deep Tech</span>
        </div>
        {/* Right — taglines */}
        <div style={{ display: "flex", flexDirection: "column", gap: 2, textAlign: "right" }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#FFFFFF", opacity: 0.7 }}>
            Precision Engineering | Circular Nutrient Recovery in Agricultural Systems
          </span>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#FFFFFF", opacity: 0.7 }}>
            Applied Biology | Rebalancing Soil's Microbiome &amp; Reducing Synthetic Fertiliser Use
          </span>
        </div>
      </div>

      {/* ═══ 2. TOPBAR ═══ */}
      <div style={{
        background: "#0A1220", padding: "14px 17px 4px",
        display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
      }}>
        {/* Left — title */}
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600, color: "#F5A623", marginRight: 8 }}>
          Lab Analysis
        </span>

        {/* Tab buttons row */}
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", flex: 1 }}>
          {/* Lab Analysis Combined */}
          <button
            onClick={() => { setShowAll(true); setActiveStream("ALL"); }}
            style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600,
              padding: "5px 14px", borderRadius: 4, cursor: "pointer",
              background: showAll ? "rgba(245,166,35,0.15)" : "transparent",
              color: showAll ? "#F5A623" : "#7E9EB4",
              border: showAll ? "1px solid #F5A623" : "1px solid rgba(255,255,255,0.07)",
            }}
          >
            Lab Analysis Combined
          </button>
          {/* Individual → */}
          <button
            style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: !showAll ? 600 : 400,
              padding: "5px 14px", borderRadius: 4, cursor: "pointer",
              background: !showAll ? "rgba(245,166,35,0.15)" : "transparent",
              color: !showAll ? "#F5A623" : "#7E9EB4",
              border: !showAll ? "1px solid #F5A623" : "1px solid rgba(255,255,255,0.07)",
            }}
          >
            Individual →
          </button>
          {/* Stream buttons */}
          {STREAMS.map(s => {
            const active = !showAll && activeStream === s;
            return (
              <button
                key={s}
                onClick={() => { setShowAll(false); setActiveStream(s); }}
                style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: 13, padding: "5px 14px",
                  borderRadius: 4, cursor: "pointer",
                  background: active ? "#F5A623" : "transparent",
                  color: active ? "#060C14" : "#7E9EB4",
                  border: active ? "none" : "1px solid rgba(255,255,255,0.07)",
                  fontWeight: active ? 600 : 400,
                }}
              >
                {s}
              </button>
            );
          })}
        </div>

        {/* Right — action buttons */}
        <div style={{ display: "flex", gap: 8 }}>
          <button style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, padding: "5px 14px", borderRadius: 4, cursor: "pointer", background: "transparent", border: "1px solid rgba(255,255,255,0.07)", color: "#7E9EB4" }}>
            Upload Report
          </button>
          <button style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, padding: "5px 14px", borderRadius: 4, cursor: "pointer", background: "transparent", border: "1px solid rgba(255,255,255,0.07)", color: "#7E9EB4" }}>
            Print Report
          </button>
        </div>
      </div>

      {/* ═══ 3. METRICS STRIP — min-height 72px ═══ */}
      <div style={{
        background: "#0A1220", minHeight: 72,
        display: "flex", flexWrap: "wrap", alignItems: "stretch",
      }}>
        {METRICS_VISIBLE.map((m, i) => (
          <div key={i} style={{
            flex: "1 1 0", minWidth: 100, padding: "8px 12px",
            background: "#0D1B2A", border: "1px solid rgba(255,255,255,0.07)",
          }}>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#7E9EB4" }}>{m.label}</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: m.isGap ? "#FF5C5C" : "#C8D8E8", marginTop: 2 }}>{m.value}</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#7E9EB4", marginTop: 1 }}>{m.sub}</div>
          </div>
        ))}
        {showEnzymes && METRICS_HIDDEN.map((m, i) => (
          <div key={`h${i}`} style={{
            flex: "1 1 0", minWidth: 100, padding: "8px 12px",
            background: "#0D1B2A", border: "1px solid rgba(255,255,255,0.07)",
          }}>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#7E9EB4" }}>{m.label}</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: "#C8D8E8", marginTop: 2 }}>{m.value}</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#7E9EB4", marginTop: 1 }}>{m.sub}</div>
          </div>
        ))}
        <div style={{ display: "flex", alignItems: "center", padding: "0 12px" }}>
          <span
            onClick={() => setShowEnzymes(!showEnzymes)}
            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#40D7C5", cursor: "pointer", whiteSpace: "nowrap" }}
          >
            {showEnzymes ? "− Cellulase · Xylanase" : "+ Cellulase · Xylanase"}
          </span>
        </div>
      </div>

      {/* ═══ 4. BANNER ═══ */}
      {showAll && (
        <div style={{
          background: "#0A1220", padding: "4px 20px", textAlign: "center",
          fontFamily: "'DM Sans', sans-serif", fontSize: 8, color: "#7E9EB4",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}>
          <span style={{ fontWeight: 700, color: "#40D7C5" }}>Combined S0 Analysis</span>
          {" · EFB + OPDC + POS · DM-weighted blend · 60 TPH FFB Mill"}
        </div>
      )}

      {/* ═══ 5. MAIN CONTAINER ═══ */}
      <div style={{
        height: "calc(100vh - 273px)", overflowY: "auto",
        background: "#060C14", padding: "0 17px",
      }}>

        {/* ─── ALL SECTIONS ───────────────────────────────────────────── */}
        {[
          { code: "ELE", title: "Elemental / Nutrient Analysis", meta: "16 parameters · % DM · mg/kg DM", rows: ELE_ROWS },
          { code: "PRX", title: "Proximate Analysis",            meta: "9 parameters · % wb · % DM · MJ/kg DM", rows: PRX_ROWS },
          { code: "FIB", title: "Fiber Analysis",                meta: "6 parameters · % DM",              rows: FIB_ROWS },
          { code: "PHY", title: "Physicochemical Properties",    meta: "8 parameters · various units",      rows: PHY_ROWS },
          { code: "HMT", title: "Heavy Metals & Trace Elements", meta: "7 parameters · mg/kg DM · % ash",  rows: HMT_ROWS },
          { code: "BIO", title: "Biological Indicators",         meta: "3 parameters · score · % DM",      rows: BIO_ROWS },
          { code: "AGV", title: "Agronomic Value",               meta: "5 parameters · USD/t DM · %",      rows: AGV_ROWS },
          { code: "LAR", title: "Large Molecule Analysis",       meta: "1 parameter · t CO₂e/t DM",        rows: LAR_ROWS },
        ].map(sec => {
          const isOpen = openSections[sec.code];
          return (
            <div key={sec.code}>
              {/* Section Header */}
              <div
                onClick={() => toggleSection(sec.code)}
                style={{
                  background: "rgba(0, 201, 177, 0.048)", padding: "7px 20px",
                  display: "flex", alignItems: "center", gap: 10, cursor: "pointer",
                }}
              >
                <span style={{
                  fontSize: 26, color: isOpen ? "#F5A623" : "#FFFFFF",
                  transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                  transition: "transform 0.2s ease, color 0.15s ease",
                  display: "inline-block", lineHeight: 1,
                }}>›</span>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#F5A623" }}>{sec.code}</span>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#40D7C5" }}>{sec.title}</span>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: "#666" }}>{sec.meta}</span>
                <span style={{ marginLeft: "auto", color: "#666", cursor: "pointer", fontSize: 14 }}
                  onMouseEnter={e => e.currentTarget.style.color = "#FFFFFF"}
                  onMouseLeave={e => e.currentTarget.style.color = "#666"}
                  onClick={e => e.stopPropagation()}
                >🖨</span>
              </div>

              {/* Table */}
              {isOpen && (
                <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
                  <colgroup>
                    {COLS.map(c => <col key={c.key} style={{ width: c.width }} />)}
                  </colgroup>
                  <thead>
                    <tr>
                      {COLS.map(c => (
                        <th key={c.key} style={{
                          fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#666",
                          textTransform: "uppercase", textAlign: c.align,
                          padding: "6px 8px", borderBottom: "1px solid rgba(139,160,180,0.12)",
                          background: "#0A1220", fontWeight: 400,
                        }}>{c.label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sec.rows.map((row, idx) => {
                      const isEven = idx % 2 === 1;
                      const isDataGap = row.result === "DATA GAP";
                      const isSniBlocker = row.sni === "SNI Blocker";
                      const isDash = (v) => v === "—";
                      const baseBg = isEven ? "rgba(0, 201, 177, 0.02)" : "#0A1220";
                      return (
                        <tr
                          key={idx}
                          style={{ background: baseBg }}
                          onMouseEnter={e => e.currentTarget.style.background = "rgba(0, 201, 177, 0.06)"}
                          onMouseLeave={e => e.currentTarget.style.background = baseBg}
                        >
                          <td style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, padding: "5px 8px", borderBottom: "1px solid rgba(139,160,180,0.06)", color: "#FFFFFF" }}>
                            {row.parameter}
                          </td>
                          <td style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, padding: "5px 8px", borderBottom: "1px solid rgba(139,160,180,0.06)", color: "#888" }}>
                            {row.unit}
                          </td>
                          <td style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, padding: "5px 8px", borderBottom: "1px solid rgba(139,160,180,0.06)", color: isDataGap ? "#FF5C5C" : "#FFFFFF", fontWeight: isDataGap ? 700 : 400 }}>
                            {row.result}
                          </td>
                          <td style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, padding: "5px 8px", borderBottom: "1px solid rgba(139,160,180,0.06)", color: isDash(row.range) ? "#444" : "#FFFFFF" }}>
                            {row.range}
                          </td>
                          <td style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, padding: "5px 8px", borderBottom: "1px solid rgba(139,160,180,0.06)", color: isSniBlocker ? "#FF5C5C" : isDash(row.sni) ? "#444" : "#FFFFFF" }}>
                            {row.sni}
                          </td>
                          <td style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, padding: "5px 8px", borderBottom: "1px solid rgba(139,160,180,0.06)" }}>
                            <Badge type={row.status} text={row.status} />
                          </td>
                          <td style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, padding: "5px 8px", borderBottom: "1px solid rgba(139,160,180,0.06)" }}>
                            <Badge type={row.confidence} text={row.confidence} />
                          </td>
                          <td style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, padding: "5px 8px", borderBottom: "1px solid rgba(139,160,180,0.06)", color: "#888" }}>
                            {row.method}
                          </td>
                          <td style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, padding: "5px 8px", borderBottom: "1px solid rgba(139,160,180,0.06)", textAlign: "center" }}>
                            <span style={{ cursor: "pointer", color: "#666", fontSize: 12 }}>✎</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          );
        })}

      </div>
    </div>
  );
}
