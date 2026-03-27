import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";

// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────
const C = {
  bg:       "#070D16",
  card:     "#153352",
  cardDk:   "#0A1628",
  border:   "#1E6B8C",
  teal:     "#00C9B1",
  amber:    "#F5A623",
  green:    "#3DCB7A",
  red:      "#E84040",
  grey:     "#8BA0B4",
  greyLt:   "#C4D3E0",
  white:    "#F0F4F8",
};
const F = {
  syne: "'Syne', sans-serif",
  dm:   "'DM Sans', sans-serif",
};

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
  { code:"REG", label:"Regulatory & Compliance",     prefixes:["rspo","iscc","ispo","regulation","compliance","standard","permit","snp","permen"] },
  { code:"LAR", label:"Large-Scale & Process",       prefixes:["throughput","retention","temperature","heap","windrow","reactor","composting","ferment","process_"] },
];

function matchSection(paramName, sectionPrefixes) {
  const lower = paramName.toLowerCase();
  return sectionPrefixes.some(p => lower.includes(p.toLowerCase()));
}

// ─── CONFIDENCE BADGE ────────────────────────────────────────────────────────
function ConfBadge({ level }) {
  if (!level) return null;
  const colors = {
    high:     { bg: "rgba(61,203,122,0.18)", text: C.green },
    medium:   { bg: "rgba(245,166,35,0.18)",  text: C.amber },
    low:      { bg: "rgba(232,64,64,0.18)",    text: C.red },
    verified: { bg: "rgba(61,203,122,0.25)",   text: C.green },
  };
  const c = colors[level.toLowerCase()] || { bg: "rgba(139,160,180,0.15)", text: C.grey };
  return (
    <span style={{ background: c.bg, color: c.text, fontFamily: F.dm, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4 }}>
      {level.toUpperCase()}
    </span>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function LabAnalysis() {
  const [activeStream, setActiveStream] = useState("EFB");
  const [showAll, setShowAll] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openSections, setOpenSections] = useState(() => new Set(SECTIONS.map(s => s.code)));

  // Fetch data
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      let query = supabase
        .from("canonical_lab_data")
        .select("parameter, value_numeric, value_text, unit, confidence_level, is_locked")
        .order("parameter");

      if (!showAll) {
        query = query.eq("stream", activeStream);
      }

      const { data: rows, error } = await query;
      if (error) { console.error("Lab fetch error:", error); setData([]); }
      else setData(rows || []);
      setLoading(false);
    };
    fetchData();
  }, [activeStream, showAll]);

  // Group data into sections
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
    // Add unmatched to a catch-all
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

  // ─── RENDER ──────────────────────────────────────────────────────────────────
  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: F.dm, color: C.white, padding: "24px 20px" }}>
      {/* Header */}
      <h1 style={{ fontFamily: F.syne, fontWeight: 800, fontSize: 24, color: C.teal, margin: "0 0 16px 0" }}>
        Lab Analysis — Canonical Data
      </h1>

      {/* Stream bar */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
        <button
          onClick={() => { setShowAll(true); setActiveStream("ALL"); }}
          style={{
            fontFamily: F.syne, fontSize: 11, fontWeight: 700, padding: "5px 14px", borderRadius: 5, cursor: "pointer", border: "1.5px solid " + C.border,
            background: showAll ? C.teal : C.cardDk,
            color: showAll ? "#070D16" : C.grey,
          }}
        >
          Lab Analysis Combined
        </button>
        {STREAMS.map(s => (
          <button
            key={s}
            onClick={() => { setShowAll(false); setActiveStream(s); }}
            style={{
              fontFamily: F.dm, fontSize: 11, fontWeight: 700, padding: "5px 12px", borderRadius: 5, cursor: "pointer", border: "1.5px solid " + C.border,
              background: !showAll && activeStream === s ? C.teal : C.cardDk,
              color: !showAll && activeStream === s ? "#070D16" : C.grey,
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && <div style={{ color: C.grey, fontFamily: F.dm, fontSize: 14, padding: 20 }}>Loading...</div>}

      {/* Sections */}
      {!loading && SECTIONS.map(sec => {
        const rows = grouped[sec.code] || [];
        if (rows.length === 0) return null;
        const isOpen = openSections.has(sec.code);
        return (
          <div key={sec.code} style={{ background: C.card, border: "1.5px solid " + C.border, borderRadius: 8, marginBottom: 12 }}>
            {/* Section header */}
            <div
              onClick={() => toggleSection(sec.code)}
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", cursor: "pointer" }}
            >
              <span style={{ fontFamily: F.syne, fontWeight: 700, fontSize: 16, color: C.amber }}>
                {sec.code} — {sec.label}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontFamily: F.dm, fontSize: 11, color: C.grey }}>{rows.length} params</span>
                <span style={{ color: C.grey, fontSize: 14 }}>{isOpen ? "▲" : "▼"}</span>
              </span>
            </div>

            {/* Section body */}
            {isOpen && (
              <div style={{ padding: "0 16px 12px 16px" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(30,107,140,0.4)" }}>
                      {["Parameter","Value","Unit","Confidence","Locked"].map(h => (
                        <th key={h} style={{ fontFamily: F.dm, fontWeight: 700, fontSize: 11, color: C.greyLt, textAlign: "left", padding: "6px 8px" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r, idx) => {
                      const val = r.value_numeric != null
                        ? r.value_numeric
                        : r.value_text != null
                          ? r.value_text
                          : null;
                      return (
                        <tr key={idx} style={{ borderBottom: "1px solid rgba(30,107,140,0.15)" }}>
                          <td style={{ fontFamily: F.dm, fontSize: 12, color: C.white, padding: "6px 8px" }}>{r.parameter}</td>
                          <td style={{ fontFamily: F.dm, fontSize: 13, fontWeight: 600, color: val != null ? C.amber : C.red, padding: "6px 8px" }}>
                            {val != null ? String(val) : "DATA GAP"}
                          </td>
                          <td style={{ fontFamily: F.dm, fontSize: 11, color: C.grey, padding: "6px 8px" }}>{r.unit || "—"}</td>
                          <td style={{ padding: "6px 8px" }}><ConfBadge level={r.confidence_level} /></td>
                          <td style={{ fontFamily: F.dm, fontSize: 11, color: r.is_locked ? C.green : C.grey, padding: "6px 8px" }}>
                            {r.is_locked ? "Locked" : "—"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })}

      {/* Unmatched parameters */}
      {!loading && grouped["_OTHER"] && grouped["_OTHER"].length > 0 && (
        <div style={{ background: C.card, border: "1.5px solid " + C.border, borderRadius: 8, marginBottom: 12 }}>
          <div
            onClick={() => toggleSection("_OTHER")}
            style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", cursor: "pointer" }}
          >
            <span style={{ fontFamily: F.syne, fontWeight: 700, fontSize: 16, color: C.grey }}>Other Parameters</span>
            <span style={{ color: C.grey, fontSize: 14 }}>{openSections.has("_OTHER") ? "▲" : "▼"}</span>
          </div>
          {openSections.has("_OTHER") && (
            <div style={{ padding: "0 16px 12px 16px" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(30,107,140,0.4)" }}>
                    {["Parameter","Value","Unit","Confidence","Locked"].map(h => (
                      <th key={h} style={{ fontFamily: F.dm, fontWeight: 700, fontSize: 11, color: C.greyLt, textAlign: "left", padding: "6px 8px" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {grouped["_OTHER"].map((r, idx) => {
                    const val = r.value_numeric != null ? r.value_numeric : r.value_text != null ? r.value_text : null;
                    return (
                      <tr key={idx} style={{ borderBottom: "1px solid rgba(30,107,140,0.15)" }}>
                        <td style={{ fontFamily: F.dm, fontSize: 12, color: C.white, padding: "6px 8px" }}>{r.parameter}</td>
                        <td style={{ fontFamily: F.dm, fontSize: 13, fontWeight: 600, color: val != null ? C.amber : C.red, padding: "6px 8px" }}>
                          {val != null ? String(val) : "DATA GAP"}
                        </td>
                        <td style={{ fontFamily: F.dm, fontSize: 11, color: C.grey, padding: "6px 8px" }}>{r.unit || "—"}</td>
                        <td style={{ padding: "6px 8px" }}><ConfBadge level={r.confidence_level} /></td>
                        <td style={{ fontFamily: F.dm, fontSize: 11, color: r.is_locked ? C.green : C.grey, padding: "6px 8px" }}>
                          {r.is_locked ? "Locked" : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {!loading && data.length === 0 && (
        <div style={{ color: C.grey, fontFamily: F.dm, fontSize: 14, padding: 40, textAlign: "center" }}>
          No canonical lab data found for {showAll ? "any stream" : activeStream}.
        </div>
      )}
    </div>
  );
}
