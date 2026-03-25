/**
 * CFI Source Registry — Button + Slide-Over Panel
 * Usage: <SourceRegistryButton pageId="soil_profiles" pageName="Soil Profiles" />
 *
 * pageId maps to domain/table entries in cfi_source_registry
 * Shows all references relevant to data displayed on that page
 *
 * Design System: CFI v3.1 — Syne 700 headings, DM Sans body, DM Mono numbers
 * Colors: navy #070D16 bg | teal #00C9B1 | amber #F5A623 | green #3DCB7A
 */

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function SourceRegistryButton({ pageId = "source_registry", pageName = "This Page" }) {
  const [open, setOpen] = useState(false);
  const [refs, setRefs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    async function fetchRefs() {
      setLoading(true);
      try {
        const PAGE_DOMAIN_MAP = {
          soil_profiles: ["soil", "multi_soil", "coverage"],
          ultisol: ["ultisol", "N_leaching", "K_leaching", "P_fixation", "microbiome"],
          andisol: ["andisol", "allophane", "CaSiO3", "N_leaching", "AEC"],
          histosol: ["peat", "GHG", "N_leaching", "K_leaching", "water_table", "N2O", "microbiome"],
          inceptisol: ["inceptisol", "N_leaching", "P_fixation"],
          oxisol: ["oxisol", "P_fixation"],
          spodosol: ["spodosol", "N_leaching"],
          source_registry: null,
          opt_analysis: ["OPT", "silicon", "fibre", "moisture", "starch"],
        };
        const domains = PAGE_DOMAIN_MAP[pageId];
        let query = supabase.from("cfi_source_registry").select("*").order("year", { ascending: false });
        if (domains && domains.length > 0) query = query.overlaps("domain", domains);
        const { data, error } = await query;
        if (!error && data) setRefs(data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    fetchRefs();
  }, [open, pageId]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "#0B1422", border: "1px solid #1E6B8C", borderRadius: 4, padding: "4px 10px", cursor: "pointer", fontFamily: "'DM Mono', monospace", fontSize: 10, fontWeight: 700, color: "#8BA0B4", letterSpacing: "0.03em", transition: "border-color 0.15s, color 0.15s" }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = "#00C9B1"; e.currentTarget.style.color = "#00C9B1"; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = "#1E6B8C"; e.currentTarget.style.color = "#8BA0B4"; }}
      >
        ⬡ SOURCES
      </button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 9998 }} />
          <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: "min(720px, 95vw)", background: "#070D16", border: "1.5px solid #1E6B8C", borderRight: "none", zIndex: 9999, display: "flex", flexDirection: "column", boxShadow: "-8px 0 32px rgba(0,0,0,0.6)" }}>
            <div style={{ background: "#0B1422", borderBottom: "1.5px solid #1E6B8C", padding: "16px 20px 12px", flexShrink: 0 }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 15, color: "#00C9B1" }}>Source Registry</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#8BA0B4", marginTop: 2 }}>{pageName} · {refs.length} references</div>
                </div>
                <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", color: "#8BA0B4", cursor: "pointer", fontSize: 18 }}>×</button>
              </div>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "12px 20px" }}>
              {loading ? (
                <div style={{ color: "#8BA0B4", fontSize: 12, padding: 20, textAlign: "center" }}>Loading references...</div>
              ) : refs.map((ref, i) => (
                <div key={ref.id || i} style={{ background: "#0B1422", border: "1px solid #1A3A5C", borderRadius: 5, padding: "10px 12px", marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, fontWeight: 700, color: "#F5A623", background: "#1A1000", border: "1px solid #F5A623", borderRadius: 3, padding: "0 5px" }}>{ref.ref_code}</span>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: ref.confidence_level === "LAB-CONFIRMED" ? "#3DCB7A" : ref.confidence_level === "LDE-HIGH" ? "#7EE8A2" : ref.confidence_level === "LDE-MODERATE" ? "#F5A623" : "#ff9999" }}>{ref.confidence_level}</span>
                    {ref.is_grey_literature && <span style={{ fontSize: 9, color: "#8BA0B4", fontFamily: "'DM Mono', monospace", background: "#111", border: "1px solid #333", borderRadius: 3, padding: "0 4px" }}>GREY LIT</span>}
                  </div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#C4D3E0", marginBottom: 2 }}><span style={{ fontWeight: 700 }}>{ref.authors}</span> {ref.year && <span style={{ color: "#8BA0B4" }}>({ref.year})</span>}</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#F0F4F8", fontStyle: "italic", marginBottom: 3 }}>{ref.title}</div>
                  {ref.journal_publisher && <div style={{ fontSize: 10, color: "#8BA0B4" }}>{ref.journal_publisher}{ref.impact_factor && <span style={{ color: "#00C9B1" }}> · IF {ref.impact_factor}</span>}</div>}
                  {ref.parameters_covered && <div style={{ fontSize: 10, color: "#5EEADA", marginTop: 3 }}>↳ {ref.parameters_covered}</div>}
                  {ref.notes && <div style={{ fontSize: 10, color: "#F5A623", background: "#150A00", border: "1px solid #3a2000", borderRadius: 3, padding: "3px 6px", marginTop: 4 }}>⚠ {ref.notes}</div>}
                  {ref.doi_url && <a href={ref.doi_url.startsWith("http") ? ref.doi_url : `https://doi.org/${ref.doi_url}`} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", marginTop: 4, fontFamily: "'DM Mono', monospace", fontSize: 9, color: "#4A9EDB", textDecoration: "none", borderBottom: "1px solid #4A9EDB", wordBreak: "break-all" }}>{ref.doi_url}</a>}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}