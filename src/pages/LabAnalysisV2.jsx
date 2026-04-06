import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const F = "'DM Sans', sans-serif";
const FH = "'EB Garamond', serif";

/* ─── PARAMETER DISPLAY NAME MAP ─────────────────────────────────────────── */
const PARAM_DISPLAY = {
  carbon_pct: "Carbon (C)", N_pct: "Nitrogen (N)", P_pct: "Phosphorus (P)",
  K_pct: "Potassium (K)", Ca_pct: "Calcium (Ca)", Mg_pct: "Magnesium (Mg)",
  S_pct: "Sulfur (S)", H_pct: "Hydrogen (H)", O_pct: "Oxygen (O)",
  Cu_mg_kg: "Copper (Cu)", Mn_mg_kg: "Manganese (Mn)", Zn_mg_kg: "Zinc (Zn)",
  Ni_mg_kg_ele: "Nickel (Ni)", Fe_mg_kg: "Iron (Fe)", Cl_pct: "Chlorine (Cl)",
  cn_ratio: "C:N Ratio",
  moisture_pct: "Moisture", ash_pct: "Ash", OM_pct: "Organic Matter",
  VM_pct: "Volatile Matter", FC_pct: "Fixed Carbon", CP_pct: "Crude Protein",
  EE_pct: "Ether Extract", HHV_mj_kg: "HHV (Higher Heating Value)",
  LHV_mj_kg: "LHV (Lower Heating Value)",
  lignin_pct: "Lignin (ADL)", ADF_pct: "ADF (Acid Detergent Fiber)",
  NDF_pct: "NDF (Neutral Detergent Fiber)", cellulose_pct: "Cellulose",
  hemicellulose_pct: "Hemicellulose", ADL_VS_pct: "ADL (Van Soest)",
  pH: "pH", EC_mS_cm: "EC (Electrical Conductivity)",
  CEC_cmol_kg: "CEC (Cation Exchange Capacity)",
  liming_eq_kg_caco3_t_dm: "Liming Equivalency",
  P2O5_pct: "P\u2082O\u2085 (Phosphorus Pentoxide)",
  K2O_pct: "K\u2082O (Potassium Oxide)",
  CaO_pct: "CaO (Calcium Oxide)", MgO_pct: "MgO (Magnesium Oxide)",
  As_mg_kg: "Arsenic (As)", Cd_mg_kg: "Cadmium (Cd)",
  Cr_mg_kg: "Chromium (Cr)", Pb_mg_kg: "Lead (Pb)",
  Hg_mg_kg: "Mercury (Hg)", Ni_mg_kg: "Nickel (Ni)",
  SiO2_ash_pct: "SiO\u2082 (in ash)",
  BSF_score: "BSF Suitability Score", humic_acid_pct: "Humic Acid",
  fulvic_acid_pct: "Fulvic Acid",
  N_agro_usd_t_dm: "Nitrogen Value", P_agro_usd_t_dm: "Phosphorus Value",
  K_agro_usd_t_dm: "Potassium Value", total_agro_usd_t_dm: "Total Agronomic Value",
  yield_pct_EFB: "OPDC Yield from EFB",
  GHG_baseline_t_co2e_t_dm: "GHG Baseline Emissions",
};

/* ─── METHOD MAP ─────────────────────────────────────────────────────────── */
const PARAM_METHOD = {
  carbon_pct: "CHNS Analyser", N_pct: "CHNS Analyser", H_pct: "CHNS Analyser",
  O_pct: "CHNS Analyser", cn_ratio: "Derived from CHNS",
  P_pct: "ICP-OES", K_pct: "ICP-OES", Ca_pct: "ICP-OES", Mg_pct: "ICP-OES",
  S_pct: "ICP-OES", Cu_mg_kg: "ICP-OES", Mn_mg_kg: "ICP-OES", Zn_mg_kg: "ICP-OES",
  Fe_mg_kg: "ICP-OES", Cl_pct: "Ion Chromatography",
  Ni_mg_kg_ele: "ICP-MS", Ni_mg_kg: "ICP-MS / EPA 6020B",
  moisture_pct: "AOAC 930.15", ash_pct: "AOAC 942.05",
  OM_pct: "Derived: 100 - ash%", VM_pct: "APHA 2540G",
  FC_pct: "Derived: 100 - VM - ash", CP_pct: "AOAC 984.13 / Kjeldahl",
  EE_pct: "AOAC 920.39 / Soxhlet",
  HHV_mj_kg: "ASTM E711 / Bomb calorimeter", LHV_mj_kg: "ASTM E711 / Bomb calorimeter",
  lignin_pct: "AOAC 973.18 / Van Soest ADL", ADF_pct: "AOAC 973.18 / Van Soest ADF",
  NDF_pct: "AOAC 2002.04 / Van Soest NDF",
  cellulose_pct: "Derived: ADF - ADL", hemicellulose_pct: "Derived: NDF - ADF",
  ADL_VS_pct: "Van Soest et al. 1991",
  pH: "AOAC 981.12 / pH electrode", EC_mS_cm: "ISO 11265 / EC electrode",
  CEC_cmol_kg: "Standard soil method", liming_eq_kg_caco3_t_dm: "Derived calculation",
  P2O5_pct: "Derived: P x 2.2914", K2O_pct: "Derived: K x 1.2046",
  CaO_pct: "Derived: Ca x 1.3992", MgO_pct: "Derived: Mg x 1.6582",
  As_mg_kg: "ICP-MS / EPA 6020B", Cd_mg_kg: "ICP-MS / EPA 6020B",
  Cr_mg_kg: "ICP-MS / EPA 6020B", Pb_mg_kg: "ICP-MS / EPA 6020B",
  Hg_mg_kg: "ICP-MS / EPA 6020B", SiO2_ash_pct: "XRF or ICP-OES",
  BSF_score: "CFI proprietary scoring", humic_acid_pct: "Extraction method",
  fulvic_acid_pct: "Extraction method",
  N_agro_usd_t_dm: "Market price x N content", P_agro_usd_t_dm: "Market price x P content",
  K_agro_usd_t_dm: "Market price x K content", total_agro_usd_t_dm: "Sum of N + P + K values",
  yield_pct_EFB: "Mill pressing data",
  GHG_baseline_t_co2e_t_dm: "LCA calculation (GWP100)",
};

/* ─── SECTION ORDER for each section_code ────────────────────────────────── */
const SECTION_ORDER = {
  ELE: ["carbon_pct","N_pct","P_pct","K_pct","Ca_pct","Mg_pct","S_pct","H_pct","O_pct","Cu_mg_kg","Mn_mg_kg","Zn_mg_kg","Ni_mg_kg","Fe_mg_kg","Cl_pct","cn_ratio"],
  PRX: ["moisture_pct","ash_pct","OM_pct","VM_pct","FC_pct","CP_pct","EE_pct","HHV_mj_kg","LHV_mj_kg"],
  FIB: ["lignin_pct","ADF_pct","NDF_pct","cellulose_pct","hemicellulose_pct","ADL_VS_pct"],
  PHY: ["pH","EC_mS_cm","CEC_cmol_kg","liming_eq_kg_caco3_t_dm","P2O5_pct","K2O_pct","CaO_pct","MgO_pct"],
  HMT: ["As_mg_kg","Cd_mg_kg","Cr_mg_kg","Pb_mg_kg","Hg_mg_kg","Ni_mg_kg","SiO2_ash_pct"],
  BIO: ["BSF_score","humic_acid_pct","fulvic_acid_pct"],
  AGV: ["N_agro_usd_t_dm","P_agro_usd_t_dm","K_agro_usd_t_dm","total_agro_usd_t_dm","yield_pct_EFB"],
  LAR: ["GHG_baseline_t_co2e_t_dm"],
};

const SECTION_META = {
  ELE: { title: "Elemental / Nutrient Analysis", meta: "16 parameters · % DM · mg/kg DM" },
  PRX: { title: "Proximate Analysis", meta: "9 parameters · % wb · % DM · MJ/kg DM" },
  FIB: { title: "Fiber Analysis", meta: "6 parameters · % DM" },
  PHY: { title: "Physicochemical Properties", meta: "8 parameters · various units" },
  HMT: { title: "Heavy Metals & Trace Elements", meta: "7 parameters · mg/kg DM · % ash" },
  BIO: { title: "Biological Indicators", meta: "3 parameters · score · % DM" },
  AGV: { title: "Agronomic Value", meta: "5 parameters · USD/t DM · %" },
  LAR: { title: "Large Molecule Analysis", meta: "1 parameter · t CO₂e/t DM" },
};

/* ─── VALUE FORMATTING HELPERS ───────────────────────────────────────────── */
const VALUE_TEXT_OVERRIDES = {
  As_mg_kg: "<LOD", Cd_mg_kg: "<LOD-0.20", Cr_mg_kg: "<LOD-5.0",
  Pb_mg_kg: "<LOD-2.0", Hg_mg_kg: "<LOD", CEC_cmol_kg: "20-35",
};

function formatResult(param, val_numeric, val_text) {
  if (VALUE_TEXT_OVERRIDES[param]) return VALUE_TEXT_OVERRIDES[param];
  if (val_text) return val_text;
  if (val_numeric === null || val_numeric === undefined) return "DATA GAP";
  const unit = (PARAM_DISPLAY[param] || "").toLowerCase();
  if (param.includes("usd")) return `$${val_numeric.toFixed(2)}`;
  if (param.includes("_pct") || param === "moisture_pct") return `${val_numeric.toFixed(2)}%`;
  if (param.includes("mg_kg")) return val_numeric.toFixed(2);
  if (param === "cn_ratio" || param === "pH") return val_numeric.toFixed(2);
  if (param === "EC_mS_cm") return val_numeric.toFixed(2);
  if (param === "BSF_score") return val_numeric.toFixed(2);
  if (param.includes("mj_kg")) return val_numeric.toFixed(2);
  if (param === "liming_eq_kg_caco3_t_dm") return val_numeric.toFixed(2);
  if (param === "GHG_baseline_t_co2e_t_dm") return val_numeric.toFixed(2);
  if (param === "yield_pct_EFB") return `${val_numeric.toFixed(2)}%`;
  return val_numeric.toFixed(2);
}

function formatSni(param, sni) {
  if (param === "Cl_pct") return "SNI Blocker";
  if (sni) return sni;
  return "—";
}

/* ─── BADGE / COLS / SECTION (unchanged styling) ─────────────────────────── */

const COLS = [
  { key: "parameter", label: "PARAMETER", width: 210, align: "left" },
  { key: "unit", label: "UNIT", width: 90, align: "left" },
  { key: "result", label: "RESULT", width: 110, align: "left" },
  { key: "range", label: "RANGE", width: 120, align: "left" },
  { key: "sni", label: "SNI", width: 100, align: "left" },
  { key: "status", label: "STATUS", width: 105, align: "left" },
  { key: "confidence", label: "CONFIDENCE", width: 135, align: "left" },
  { key: "method", label: "METHOD", width: 185, align: "left" },
  { key: "edit", label: "EDIT", width: 110, align: "center" },
];

const BADGE_STYLES = {
  VERIFIED:       { bg: "rgba(114, 223, 166, 0.15)", color: "#72DFA6" },
  PENDING:        { bg: "rgba(245, 166, 35, 0.12)",  color: "#F5A623" },
  "LDE-HIGH":     { bg: "rgba(114, 223, 166, 0.10)", color: "#72DFA6" },
  "LDE-MODERATE": { bg: "rgba(245, 166, 35, 0.10)",  color: "#F5A623" },
  "LDE-LOW":      { bg: "rgba(255, 92, 92, 0.10)",   color: "#FF5C5C" },
  PASS:           { bg: "rgba(114, 223, 166, 0.15)", color: "#72DFA6" },
};

function Badge({ type, text }) {
  const s = BADGE_STYLES[type] || { bg: "rgba(139,160,180,0.10)", color: "#888" };
  return (
    <span style={{
      background: s.bg, color: s.color, fontFamily: F, fontSize: 11,
      padding: "2px 7px", borderRadius: 3, whiteSpace: "nowrap",
    }}>{text}</span>
  );
}

function Section({ code, title, meta, rows, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          background: "rgba(0, 201, 177, 0.048)", padding: "7px 20px",
          display: "flex", alignItems: "center", gap: 10, cursor: "pointer",
        }}
      >
        <span style={{
          fontSize: 26, color: open ? "#F5A623" : "#FFFFFF",
          transform: open ? "rotate(90deg)" : "rotate(0deg)",
          transition: "transform 0.2s ease, color 0.15s ease",
          display: "inline-block", lineHeight: 1,
        }}>›</span>
        <span style={{ fontFamily: F, fontSize: 10, color: "#F5A623" }}>{code}</span>
        <span style={{ fontFamily: F, fontSize: 13, color: "#40D7C5" }}>{title}</span>
        <span style={{ fontFamily: F, fontSize: 12, color: "#666" }}>{meta}</span>
        <span
          style={{ marginLeft: "auto", color: "#666", cursor: "pointer", fontSize: 14 }}
          onMouseEnter={e => e.currentTarget.style.color = "#FFFFFF"}
          onMouseLeave={e => e.currentTarget.style.color = "#666"}
          onClick={e => e.stopPropagation()}
        >🖨</span>
      </div>
      {open && (
        <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
          <colgroup>
            {COLS.map(c => <col key={c.key} style={{ width: c.width }} />)}
          </colgroup>
          <thead>
            <tr>
              {COLS.map(c => (
                <th key={c.key} style={{
                  fontFamily: F, fontSize: 11, color: "#666",
                  textTransform: "uppercase", textAlign: c.align,
                  padding: "6px 8px", borderBottom: "1px solid rgba(139,160,180,0.12)",
                  background: "#0A1220", fontWeight: 400,
                }}>{c.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => {
              const isEven = idx % 2 === 1;
              const isGap = row.result === "DATA GAP";
              const isSniBlocker = row.sni === "SNI Blocker";
              const isDash = v => v === "—";
              const baseBg = isEven ? "rgba(0, 201, 177, 0.02)" : "#0A1220";
              return (
                <tr
                  key={idx}
                  style={{ background: baseBg }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(0, 201, 177, 0.06)"}
                  onMouseLeave={e => e.currentTarget.style.background = baseBg}
                >
                  <td style={{ fontFamily: F, fontSize: 12, padding: "5px 8px", borderBottom: "1px solid rgba(139,160,180,0.06)", color: "#FFFFFF" }}>{row.parameter}</td>
                  <td style={{ fontFamily: F, fontSize: 12, padding: "5px 8px", borderBottom: "1px solid rgba(139,160,180,0.06)", color: "#888" }}>{row.unit}</td>
                  <td style={{ fontFamily: F, fontSize: 12, padding: "5px 8px", borderBottom: "1px solid rgba(139,160,180,0.06)", color: isGap ? "#FF5C5C" : "#FFFFFF", fontWeight: isGap ? 700 : 400 }}>{row.result}</td>
                  <td style={{ fontFamily: F, fontSize: 12, padding: "5px 8px", borderBottom: "1px solid rgba(139,160,180,0.06)", color: isDash(row.range) ? "#444" : "#FFFFFF" }}>{row.range}</td>
                  <td style={{ fontFamily: F, fontSize: 12, padding: "5px 8px", borderBottom: "1px solid rgba(139,160,180,0.06)", color: isSniBlocker ? "#FF5C5C" : isDash(row.sni) ? "#444" : "#FFFFFF" }}>{row.sni}</td>
                  <td style={{ fontFamily: F, fontSize: 12, padding: "5px 8px", borderBottom: "1px solid rgba(139,160,180,0.06)" }}><Badge type={row.status} text={row.status} /></td>
                  <td style={{ fontFamily: F, fontSize: 12, padding: "5px 8px", borderBottom: "1px solid rgba(139,160,180,0.06)" }}><Badge type={row.confidence} text={row.confidence} /></td>
                  <td style={{ fontFamily: F, fontSize: 12, padding: "5px 8px", borderBottom: "1px solid rgba(139,160,180,0.06)", color: "#888" }}>{row.method}</td>
                  <td style={{ fontFamily: F, fontSize: 12, padding: "5px 8px", borderBottom: "1px solid rgba(139,160,180,0.06)", textAlign: "center" }}><span style={{ cursor: "pointer", color: "#666", fontSize: 12 }}>✎</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

/* ─── METRICS STRIP HELPERS ──────────────────────────────────────────────── */
function buildMetrics(dataMap) {
  const get = (p) => dataMap[p]?.value_numeric;
  const N = get("N_pct"), P = get("P_pct"), K = get("K_pct");
  const moisture = get("moisture_pct");
  const dm = moisture != null ? (100 - moisture) : null;
  const cp = get("CP_pct");
  const lignin = get("lignin_pct");
  const cec = get("CEC_cmol_kg");

  return [
    { label: "Dry Matter", value: dm != null ? `${dm.toFixed(0)}%` : "—", sub: "% wb press floor" },
    { label: "Crude Protein", value: cp != null ? `${cp.toFixed(1)}%` : "—", sub: "DM Nx6.25" },
    { label: "Lignin ADL", value: lignin != null ? `${lignin.toFixed(2)}%` : "—", sub: "DM BSF gate PASS" },
    { label: "CEC", value: cec != null ? `${cec}` : "Data gap", sub: "cmol/kg pending ICP" },
    { label: "N P K", value: `${N != null ? N.toFixed(2) : "—"}% ${P != null ? P.toFixed(2) : "—"}% ${K != null ? K.toFixed(2) : "—"}%`, sub: "% DM ICP-OES" },
    { label: "N P\u2082O\u2085 K\u2082O", value: (() => {
      const p2o5 = get("P2O5_pct");
      const k2o = get("K2O_pct");
      return `${N != null ? N.toFixed(2) : "—"}% ${p2o5 != null ? p2o5.toFixed(2) : "—"}% ${k2o != null ? k2o.toFixed(2) : "—"}%`;
    })(), sub: "% DM" },
    { label: "Per Tonne DM", value: (() => {
      const nkg = N != null ? (N * 10).toFixed(1) : "—";
      const pkg = P != null ? (P * 10).toFixed(1) : "—";
      const kkg = K != null ? (K * 10).toFixed(1) : "—";
      return `N: ${nkg}kg P: ${pkg}kg K: ${kkg}kg`;
    })(), sub: "kg per tonne" },
  ];
}

/* ─── MAIN COMPONENT ─────────────────────────────────────────────────────── */
export default function LabAnalysisV2() {
  const [showEnzymes, setShowEnzymes] = useState(false);
  const [labData, setLabData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from("canonical_lab_data")
        .select("*")
        .eq("stream", "OPDC");
      if (error) { console.error("Lab data fetch error:", error); setLoading(false); return; }
      setLabData(data);
      setLoading(false);
    }
    fetchData();
  }, []);

  // Build a lookup: parameter -> row
  const dataMap = {};
  if (labData) {
    labData.forEach(row => { dataMap[row.parameter] = row; });
  }

  // Build section rows from DB data
  function buildSectionRows(sectionCode) {
    const order = SECTION_ORDER[sectionCode] || [];
    return order.map(param => {
      const dbRow = dataMap[param];
      const displayName = PARAM_DISPLAY[param] || param;
      const method = PARAM_METHOD[param] || (dbRow?.method_standard || "—");
      if (!dbRow) {
        return {
          parameter: displayName, unit: "—", result: "DATA GAP",
          range: "—", sni: "—", status: "PENDING", confidence: "LDE-LOW", method,
        };
      }
      return {
        parameter: displayName,
        unit: dbRow.unit || "—",
        result: formatResult(param, dbRow.value_numeric, dbRow.value_text),
        range: dbRow.result_range || "—",
        sni: formatSni(param, dbRow.sni_standard),
        status: dbRow.status || "PENDING",
        confidence: dbRow.confidence_level || "LDE-LOW",
        method,
      };
    });
  }

  const metrics = labData ? buildMetrics(dataMap) : [];
  const hiddenMetrics = [
    { label: "Cellulase", value: "2-5 U/g" },
    { label: "Xylanase", value: "1-3 U/g" },
  ];

  return (
    <div style={{ fontFamily: F, background: "#060C14", minHeight: "100vh", color: "#FFFFFF" }}>

      {loading ? (
        <div style={{ textAlign: "center", padding: 40, color: "#666", fontFamily: F }}>Loading lab data from database…</div>
      ) : (
        <>
          {/* ══ METRICS STRIP ══ */}
          <div style={{
            background: "#0A1220", minHeight: 72,
            display: "flex", alignItems: "center", padding: "8px 17px", gap: 8,
            flexWrap: "wrap",
          }}>
            {metrics.map((m, i) => (
              <div key={i} style={{
                background: "#0D1B2A", border: "1px solid #1A2A3A",
                padding: "8px 12px", flex: "1 1 0", minWidth: 120,
              }}>
                <div style={{ fontFamily: F, fontSize: 13, color: "#888" }}>{m.label}</div>
                <div style={{ fontFamily: F, fontSize: 12, color: "#FFFFFF" }}>{m.value}</div>
                {m.sub && <div style={{ fontFamily: F, fontSize: 10, color: "#666" }}>{m.sub}</div>}
              </div>
            ))}

            {showEnzymes && hiddenMetrics.map((m, i) => (
              <div key={`h${i}`} style={{
                background: "#0D1B2A", border: "1px solid #1A2A3A",
                padding: "8px 12px", flex: "1 1 0", minWidth: 120,
              }}>
                <div style={{ fontFamily: F, fontSize: 13, color: "#888" }}>{m.label}</div>
                <div style={{ fontFamily: F, fontSize: 12, color: "#FFFFFF" }}>{m.value}</div>
              </div>
            ))}

            <div
              onClick={() => setShowEnzymes(!showEnzymes)}
              style={{
                fontFamily: F, fontSize: 12, color: "#00C9B1",
                cursor: "pointer", background: "none", border: "none",
                padding: "8px 12px", whiteSpace: "nowrap",
              }}
            >
              {showEnzymes ? "- Cellulase \u00b7 Xylanase" : "+ Cellulase \u00b7 Xylanase"}
            </div>
          </div>

          {/* ══ BANNER ══ */}
          <div style={{
            background: "#0A1220", fontFamily: F, fontSize: 8, color: "#666",
            textAlign: "center", padding: "4px 0",
          }}>
            Combined S0 Analysis &middot; EFB + OPDC + POS &middot; DM-weighted blend &middot; 60 TPH FFB Mill
          </div>

          {/* ══ MAIN CONTAINER ══ */}
          <div style={{
            height: "calc(100vh - 273px)", overflowY: "auto",
            background: "#060C14", padding: "0 17px",
          }}>
            {["ELE","PRX","FIB","PHY","HMT","BIO","AGV","LAR"].map(code => (
              <Section
                key={code}
                code={code}
                title={SECTION_META[code].title}
                meta={SECTION_META[code].meta}
                rows={buildSectionRows(code)}
                defaultOpen={code === "ELE"}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
