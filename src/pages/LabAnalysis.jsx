import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";

// ─── STREAMS ─────────────────────────────────────────────────────────────────
const STREAMS = ["EFB","OPDC","POS","POME","PKE","PKS","PMF","ASH","OPF","OPT","BSF"];

// ─── SECTION DEFINITIONS ────────────────────────────────────────────────────
const SECTIONS = [
  { code:"ELE", label:"Elemental Analysis",       prefixes:["C_","H_","N_","S_","O_","ash_","volatile_matter","fixed_carbon","moisture","c_n_ratio","c_h_ratio","total_organic_carbon"] },
  { code:"PRX", label:"Proximate Analysis",        prefixes:["moisture","ash","volatile","fixed_carbon","dry_matter","organic_matter","total_solids"] },
  { code:"AV",  label:"Available Nutrients",        prefixes:["avail_n","avail_p","avail_k","nh4","no3","exchangeable","cec","base_sat"] },
  { code:"AGV", label:"Agronomic Values",           prefixes:["npk","n_total","p_total","k_total","ca_","mg_","na_","fe_","mn_","zn_","cu_","b_","mo_","cl_","si_"] },
  { code:"FIB", label:"Fibre Composition",          prefixes:["cellulose","hemicellulose","lignin","ndf","adf","adl","fibre"] },
  { code:"PHY", label:"Physical Properties",        prefixes:["bulk_density","particle","porosity","water_hold","surface_area","colour","odour","texture","ph","ec_","electrical"] },
  { code:"HMT", label:"Heavy Metals & Toxicology",  prefixes:["pb_","cd_","cr_","hg_","as_","ni_","heavy_metal","dioxin","furan","pcb","pah"] },
  { code:"BIO", label:"Biological Indicators",      prefixes:["microbial","cfu","pathogen","salmonella","e_coli","coliform","fungal","bacterial","respiration","co2_evol"] },
  { code:"SAV", label:"Safety & Viability",          prefixes:["bsf_safe","bsf_viab","germination","phytotox","seed_","stability","maturity"] },
  { code:"BSF", label:"BSF Performance",             prefixes:["bsf_","ivdmd","larval","pupation","bioconversion","frass","prepupae","feed_conv"] },
  { code:"APP", label:"Application & Dosing",        prefixes:["application","dose","rate","spreading","field_rate","timing"] },
  { code:"REG", label:"Regulatory & Compliance",     prefixes:["rspo","iscc","ispo","regulation","compliance","standard","permit","snp","permen"] },
  { code:"LAR", label:"Large-Scale & Process",       prefixes:["throughput","retention","temperature","heap","windrow","reactor","composting","ferment","process_"] },
];

function matchSection(paramName, sectionPrefixes) {
  const lower = paramName.toLowerCase();
  return sectionPrefixes.some(p => lower.includes(p.toLowerCase()));
}

// ─── METRICS KEYS ────────────────────────────────────────────────────────────
const METRIC_KEYS = [
  { key: "dry_matter", label: "Dry Matter", unit: "% wb" },
  { key: "crude_protein", label: "Crude Protein", unit: "% DM" },
  { key: "lignin", label: "Lignin ADL", unit: "% DM", alt: "adl" },
  { key: "ph", label: "pH", unit: "" },
  { key: "cec", label: "CEC", unit: "cmol/kg" },
];

function findMetric(data, key, alt) {
  const lower = key.toLowerCase();
  const altLower = alt ? alt.toLowerCase() : null;
  for (const r of data) {
    const p = r.parameter.toLowerCase();
    if (p.includes(lower) || (altLower && p.includes(altLower))) {
      return r.value_numeric != null ? r.value_numeric : r.value_text;
    }
  }
  return null;
}

// ─── CONFIDENCE BADGE ────────────────────────────────────────────────────────
function ConfBadge({ level }) {
  if (!level) return <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: "rgba(139,160,180,0.5)" }}>—</span>;
  const l = level.toUpperCase().replace(/[\s_-]+/g, "-");
  let bg, color, text;
  if (l.includes("LAB") || l === "VERIFIED" || l === "HIGH") {
    bg = "rgba(61,203,122,0.16)"; color = "#3DCB7A"; text = l.includes("LAB") ? "LAB-CONFIRMED" : l;
  } else if (l.includes("LDE-H") || l === "LDE-HIGH") {
    bg = "rgba(61,203,122,0.10)"; color = "rgba(61,203,122,0.7)"; text = "LDE-HIGH";
  } else if (l.includes("MODERATE") || l === "MEDIUM" || l.includes("LDE-M")) {
    bg = "rgba(245,166,35,0.15)"; color = "#F5A623"; text = "LDE-MODERATE";
  } else if (l.includes("LOW") || l.includes("LDE-L")) {
    bg = "rgba(255,92,92,0.15)"; color = "#FF5C5C"; text = "LDE-LOW";
  } else {
    bg = "rgba(139,160,180,0.10)"; color = "rgba(139,160,180,0.6)"; text = level;
  }
  return (
    <span style={{
      background: bg, color, fontFamily: "'DM Mono', monospace", fontSize: 9, fontWeight: 700,
      padding: "2px 7px", borderRadius: 3, letterSpacing: "0.5px", whiteSpace: "nowrap",
    }}>
      {text}
    </span>
  );
}

// ─── TABLE COLUMNS ───────────────────────────────────────────────────────────
const COLUMNS = [
  { key: "parameter", label: "Parameter", width: 210, align: "left" },
  { key: "unit", label: "Unit", width: 80, align: "center" },
  { key: "result", label: "Result", width: 105, align: "center" },
  { key: "range", label: "Range", width: 110, align: "center" },
  { key: "sni", label: "SNI", width: 95, align: "center" },
  { key: "status", label: "Status", width: 105, align: "center" },
  { key: "confidence", label: "Confidence", width: 120, align: "center" },
  { key: "method", label: "Method", width: 200, align: "left" },
  { key: "edit", label: "Edit", width: 55, align: "center" },
];

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function LabAnalysis() {
  const [activeStream, setActiveStream] = useState("EFB");
  const [showAll, setShowAll] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openSections, setOpenSections] = useState(() => new Set(SECTIONS.map(s => s.code)));

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      let query = supabase
        .from("canonical_lab_data")
        .select("parameter, value_numeric, value_text, unit, confidence_level, is_locked, guardrail_note")
        .order("parameter");
      if (!showAll) query = query.eq("stream", activeStream);
      const { data: rows, error } = await query;
      if (error) { console.error("Lab fetch error:", error); setData([]); }
      else setData(rows || []);
      setLoading(false);
    };
    fetchData();
  }, [activeStream, showAll]);

  const grouped = useMemo(() => {
    const result = {};
    const unmatched = [];
    SECTIONS.forEach(s => { result[s.code] = []; });
    (data || []).forEach(row => {
      let placed = false;
      for (const sec of SECTIONS) {
        if (matchSection(row.parameter, sec.prefixes)) {
          result[sec.code].push(row);
          placed = true;
          break;
        }
      }
      if (!placed) unmatched.push(row);
    });
    if (unmatched.length > 0) result["_OTHER"] = unmatched;
    return result;
  }, [data]);

  const toggleSection = (code) => {
    setOpenSections(prev => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code); else next.add(code);
      return next;
    });
  };

  const today = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

  // ─── STYLES ──────────────────────────────────────────────────────────────────
  const S = {
    page: { background: "#060C14", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", color: "#C4D3E0" },
    headerBar: {
      background: "#080F1A", borderBottom: "1px solid rgba(255,255,255,0.12)",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "10px 24px", flexWrap: "wrap", gap: 8,
    },
    headerTitle: { fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 15, color: "#40D7C5", letterSpacing: "1.5px", textTransform: "uppercase" },
    headerBtn: (color) => ({
      fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600, padding: "5px 14px", borderRadius: 4,
      cursor: "pointer", border: `1.5px solid ${color}`, background: `${color}18`, color,
    }),
    headerMeta: { fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: "rgba(139,160,180,0.55)", textAlign: "right" },
    streamBar: {
      display: "flex", flexWrap: "wrap", gap: 5, padding: "10px 24px",
      borderBottom: "1px solid rgba(64,215,197,0.12)", background: "transparent",
    },
    streamBtn: (active) => ({
      fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700, padding: "5px 14px", borderRadius: 4, cursor: "pointer",
      border: active ? "1.5px solid rgba(64,215,197,0.5)" : "1.5px solid rgba(168,189,208,0.10)",
      background: active ? "rgba(64,215,197,0.12)" : "transparent",
      color: active ? "#40D7C5" : "rgba(168,189,208,0.55)",
      transition: "all 0.15s ease",
    }),
    newStreamBtn: {
      fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600, padding: "5px 14px", borderRadius: 4,
      cursor: "pointer", border: "1.5px dashed rgba(168,189,208,0.2)", background: "transparent",
      color: "rgba(168,189,208,0.35)",
    },
    metricsStrip: {
      display: "flex", flexWrap: "wrap", gap: 0, padding: "8px 24px",
      background: "rgba(64,215,197,0.05)", borderBottom: "2px solid rgba(64,215,197,0.20)",
    },
    metricBox: {
      flex: "1 1 auto", minWidth: 90, padding: "6px 14px", textAlign: "center",
      borderRight: "1px solid rgba(139,160,180,0.08)",
    },
    metricLabel: { fontFamily: "'DM Sans', sans-serif", fontSize: 9, color: "rgba(139,160,180,0.55)", textTransform: "uppercase", letterSpacing: "0.5px" },
    metricValue: { fontFamily: "'DM Mono', monospace", fontSize: 16, fontWeight: 700, color: "#F5A623", marginTop: 2 },
    metricUnit: { fontFamily: "'DM Sans', sans-serif", fontSize: 9, color: "rgba(139,160,180,0.4)", marginTop: 1 },
    sectionCard: { marginBottom: 3, borderRadius: 0 },
    sectionHeader: (isOpen) => ({
      background: isOpen ? "rgba(64,215,197,0.08)" : "#0D1B2A",
      borderBottom: isOpen ? "1px solid rgba(64,215,197,0.25)" : "1px solid rgba(139,160,180,0.08)",
      padding: "7px 20px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between",
      transition: "background 0.15s ease",
    }),
    sectionCode: { fontFamily: "'DM Mono', monospace", fontSize: 10, fontWeight: 700, color: "#F5A623", letterSpacing: "1.5px", width: 36, flexShrink: 0 },
    sectionTitle: { fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 700, color: "#40D7C5", flex: 1, marginLeft: 8 },
    sectionMeta: { fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: "rgba(139,160,180,0.5)", marginRight: 10 },
    sectionPrint: {
      fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 3,
      cursor: "pointer", border: "1px solid rgba(64,215,197,0.3)", background: "rgba(64,215,197,0.08)", color: "#40D7C5",
      marginRight: 10,
    },
    arrow: (isOpen) => ({
      fontSize: 22, color: isOpen ? "#F5A623" : "rgba(139,160,180,0.4)",
      transform: isOpen ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s ease, color 0.15s ease",
      lineHeight: 1,
    }),
    table: { width: "100%", borderCollapse: "collapse", tableLayout: "fixed" },
    th: {
      background: "#070E1C", fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 700,
      color: "rgba(139,160,180,0.5)", textTransform: "uppercase", letterSpacing: "0.5px",
      padding: "6px 8px", borderBottom: "1px solid rgba(139,160,180,0.12)",
    },
    td: {
      fontFamily: "'DM Sans', sans-serif", fontSize: 12, padding: "5px 8px",
      borderBottom: "1px solid rgba(139,160,180,0.06)", background: "#060C14",
    },
    tdHover: { background: "#0D1B2A" },
  };

  // ─── RENDER ──────────────────────────────────────────────────────────────────
  const renderRow = (r, idx) => {
    const val = r.value_numeric != null ? r.value_numeric : r.value_text != null ? r.value_text : null;
    return (
      <tr key={idx} style={{ cursor: "default" }}
        onMouseEnter={e => { e.currentTarget.querySelectorAll("td").forEach(td => td.style.background = "#0D1B2A"); }}
        onMouseLeave={e => { e.currentTarget.querySelectorAll("td").forEach(td => td.style.background = "#060C14"); }}
      >
        <td style={{ ...S.td, textAlign: "left", color: "#40D7C5", fontWeight: 500 }}>{r.parameter}</td>
        <td style={{ ...S.td, textAlign: "center", color: "rgba(139,160,180,0.6)", fontFamily: "'DM Sans', sans-serif", fontSize: 11 }}>{r.unit || "—"}</td>
        <td style={{ ...S.td, textAlign: "center", fontFamily: "'DM Mono', monospace", fontWeight: 700, fontSize: 13, color: val != null ? "#F5A623" : "#FF5C5C" }}>
          {val != null ? String(val) : "DATA GAP"}
        </td>
        <td style={{ ...S.td, textAlign: "center", color: "rgba(139,160,180,0.35)", fontSize: 11 }}>—</td>
        <td style={{ ...S.td, textAlign: "center", color: "rgba(139,160,180,0.35)", fontSize: 11 }}>—</td>
        <td style={{ ...S.td, textAlign: "center" }}>
          {r.is_locked
            ? <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 600, color: "#3DCB7A", background: "rgba(61,203,122,0.12)", padding: "2px 7px", borderRadius: 3 }}>Locked</span>
            : <span style={{ color: "rgba(139,160,180,0.35)", fontSize: 10 }}>—</span>
          }
        </td>
        <td style={{ ...S.td, textAlign: "center" }}><ConfBadge level={r.confidence_level} /></td>
        <td style={{ ...S.td, textAlign: "left", color: "rgba(139,160,180,0.35)", fontSize: 10 }}>{r.guardrail_note || "—"}</td>
        <td style={{ ...S.td, textAlign: "center" }}>
          <span style={{ cursor: "pointer", fontSize: 12, color: "rgba(139,160,180,0.3)" }}>✎</span>
        </td>
      </tr>
    );
  };

  const renderTable = (rows) => (
    <table style={S.table}>
      <colgroup>
        {COLUMNS.map(c => <col key={c.key} style={{ width: c.width }} />)}
      </colgroup>
      <thead>
        <tr>
          {COLUMNS.map(c => (
            <th key={c.key} style={{ ...S.th, textAlign: c.align }}>{c.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, idx) => renderRow(r, idx))}
      </tbody>
    </table>
  );

  const renderSection = (sec, rows) => {
    if (rows.length === 0) return null;
    const isOpen = openSections.has(sec.code);
    return (
      <div key={sec.code} style={S.sectionCard}>
        <div style={S.sectionHeader(isOpen)} onClick={() => toggleSection(sec.code)}>
          <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
            <span style={S.sectionCode}>{sec.code}</span>
            <span style={S.sectionTitle}>{sec.label}</span>
          </div>
          <span style={S.sectionMeta}>{rows.length} params</span>
          <button style={S.sectionPrint} onClick={e => { e.stopPropagation(); }}>Print Section</button>
          <span style={S.arrow(isOpen)}>›</span>
        </div>
        {isOpen && <div style={{ padding: 0 }}>{renderTable(rows)}</div>}
      </div>
    );
  };

  return (
    <div style={S.page}>
      {/* ─── HEADER BAR ─────────────────────────────────────────────── */}
      <div style={S.headerBar}>
        <span style={S.headerTitle}>CFI Bioconversion — Lab Analysis</span>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={S.headerBtn("#40D7C5")}>↑ Upload Lab Report</button>
          <button style={S.headerBtn("#F5A623")}>🖨 Print Full Report</button>
        </div>
        <div style={S.headerMeta}>
          <div>{showAll ? "All Streams" : activeStream}</div>
          <div>{today}</div>
        </div>
      </div>

      {/* ─── STREAM BAR ─────────────────────────────────────────────── */}
      <div style={S.streamBar}>
        <button
          onClick={() => { setShowAll(true); setActiveStream("ALL"); }}
          style={S.streamBtn(showAll)}
        >
          Lab Analysis Combined
        </button>
        {STREAMS.map(s => (
          <button
            key={s}
            onClick={() => { setShowAll(false); setActiveStream(s); }}
            style={S.streamBtn(!showAll && activeStream === s)}
          >
            {s}
          </button>
        ))}
        <button style={S.newStreamBtn}>+ New Stream</button>
      </div>

      {/* ─── METRICS STRIP ──────────────────────────────────────────── */}
      <div style={S.metricsStrip}>
        {METRIC_KEYS.map(m => {
          const val = findMetric(data, m.key, m.alt);
          return (
            <div key={m.key} style={S.metricBox}>
              <div style={S.metricLabel}>{m.label}</div>
              <div style={S.metricValue}>{val != null ? String(val) : "—"}</div>
              <div style={S.metricUnit}>{m.unit}</div>
            </div>
          );
        })}
        <div style={S.metricBox}>
          <div style={S.metricLabel}>N · P · K</div>
          <div style={{ ...S.metricValue, fontSize: 13 }}>
            {findMetric(data, "n_total") ?? "—"} · {findMetric(data, "p_total") ?? "—"} · {findMetric(data, "k_total") ?? "—"}
          </div>
          <div style={S.metricUnit}>% DM</div>
        </div>
        <div style={S.metricBox}>
          <div style={S.metricLabel}>N · P₂O₅ · K₂O</div>
          <div style={{ ...S.metricValue, fontSize: 13 }}>—</div>
          <div style={S.metricUnit}>kg / t DM</div>
        </div>
        <div style={{ ...S.metricBox, borderRight: "none" }}>
          <div style={S.metricLabel}>vs. Synthetic $</div>
          <div style={S.metricValue}>—</div>
          <div style={S.metricUnit}>per tonne DM</div>
        </div>
      </div>

      {/* ─── LOADING ────────────────────────────────────────────────── */}
      {loading && (
        <div style={{ color: "rgba(139,160,180,0.5)", fontFamily: "'DM Sans', sans-serif", fontSize: 13, padding: "40px 24px", textAlign: "center" }}>
          Loading canonical lab data…
        </div>
      )}

      {/* ─── SECTIONS ───────────────────────────────────────────────── */}
      {!loading && (
        <div style={{ padding: "0" }}>
          {SECTIONS.map(sec => renderSection(sec, grouped[sec.code] || []))}
          {grouped["_OTHER"] && grouped["_OTHER"].length > 0 && renderSection({ code: "_OTH", label: "Other Parameters" }, grouped["_OTHER"])}
        </div>
      )}

      {/* ─── EMPTY STATE ────────────────────────────────────────────── */}
      {!loading && data.length === 0 && (
        <div style={{ color: "rgba(139,160,180,0.5)", fontFamily: "'DM Sans', sans-serif", fontSize: 13, padding: "60px 24px", textAlign: "center" }}>
          No canonical lab data found for {showAll ? "any stream" : activeStream}.
        </div>
      )}
    </div>
  );
}
