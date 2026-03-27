import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

// Acidity class metadata — mirrors CFI_SoilAcidity_Lookup.jsx
const CLASS_META = {
  1: { label: "Excessively Acid",   range: "<4.0",     lime: true,  palm: "Critical",  color: "#CC0000" },
  2: { label: "Extremely Acid",     range: "4.0–4.5",  lime: true,  palm: "Poor",      color: "#E05000" },
  3: { label: "Very Strongly Acid", range: "4.6–5.0",  lime: true,  palm: "Marginal",  color: "#E08000" },
  4: { label: "Strongly Acid",      range: "5.0–5.5",  lime: false, palm: "Suitable",  color: "#C8A000" },
  5: { label: "Moderately Acid",    range: "5.6–6.0",  lime: false, palm: "Good",      color: "#8CC000" },
  6: { label: "Slightly Acid",      range: "6.1–6.5",  lime: false, palm: "Optimal",   color: "#00A040" },
  7: { label: "Neutral",            range: "6.6–7.3",  lime: false, palm: "Optimal",   color: "#00C060" },
  8: { label: "Slightly Alkaline",  range: "7.4–7.8",  lime: false, palm: "Monitor",   color: "#0060A0" },
};

const CFI_MODIFIERS = {
  1: { n_mult: 1.6, p_mult: 2.0 },
  2: { n_mult: 1.4, p_mult: 1.8 },
  3: { n_mult: 1.2, p_mult: 1.4 },
  4: { n_mult: 1.1, p_mult: 1.2 },
  5: { n_mult: 1.0, p_mult: 1.0 },
  6: { n_mult: 1.0, p_mult: 1.0 },
  7: { n_mult: 1.0, p_mult: 0.9 },
  8: { n_mult: 0.9, p_mult: 0.8 },
};

/**
 * Soil Acidity Profile Card — read-only display.
 * Props:
 *   millName  — if provided, queries by mill_name match
 *               if omitted, fetches the most recent record
 */
export default function CFI_SoilAcidity_ProfileCard({ millName }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        let q = supabase.from("cfi_mill_soil_acidity").select("*");
        if (millName) {
          q = q.eq("mill_name", millName);
        }
        q = q.order("created_at", { ascending: false }).limit(1);
        const { data: rows } = await q;
        if (!cancelled && rows && rows.length > 0) setData(rows[0]);
        else if (!cancelled) setData(null);
      } catch {
        if (!cancelled) setData(null);
      }
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [millName]);

  const cls = data ? CLASS_META[data.acidity_class] : null;
  const mod = data ? CFI_MODIFIERS[data.acidity_class] : null;

  // Card styles
  const cardBg = "#153352";
  const border = "1.5px solid #1E6B8C";
  const amber = "#F5A623";
  const teal = "#00C9B1";
  const muted = "#8BA0B4";
  const white = "#F0F4F8";

  if (loading) {
    return (
      <div style={{ background: cardBg, border, borderRadius: 10, padding: 20, marginBottom: 16 }}>
        <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 18, color: teal }}>
          Soil Acidity Profile
        </div>
        <div style={{ color: muted, fontFamily: "'DM Sans',sans-serif", fontSize: 13, marginTop: 8 }}>
          Loading...
        </div>
      </div>
    );
  }

  if (!data || !cls) {
    return (
      <div style={{ background: cardBg, border, borderRadius: 10, padding: 20, marginBottom: 16 }}>
        <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 18, color: teal }}>
          Soil Acidity Profile
        </div>
        <div style={{ color: muted, fontFamily: "'DM Sans',sans-serif", fontSize: 13, marginTop: 10 }}>
          No soil acidity data available. Run lookup in AG Management Calculator.
        </div>
      </div>
    );
  }

  const items = [
    { label: "Acidity Class", value: `${data.acidity_class} — ${cls.label}` },
    { label: "pH Range", value: cls.range },
    { label: "Lime Required", value: cls.lime ? "YES" : "No", color: cls.lime ? "#E84040" : "#A8E6C1" },
    { label: "N Multiplier", value: `×${mod.n_mult.toFixed(1)}` },
    { label: "P Multiplier", value: `×${mod.p_mult.toFixed(1)}` },
    { label: "Distance", value: `${data.lookup_distance_km ?? "—"} km` },
  ];

  return (
    <div style={{ background: cardBg, border, borderRadius: 10, padding: 20, marginBottom: 16 }}>
      {/* Header */}
      <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 18, color: teal, marginBottom: 14 }}>
        Soil Acidity Profile {data.mill_name ? `— ${data.mill_name}` : ""}
      </div>

      {/* Class badge */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16,
        padding: "10px 14px", background: "#060C14", borderRadius: 6, border }}>
        <div style={{ width: 42, height: 42, borderRadius: "50%", background: cls.color,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'DM Mono',monospace", fontWeight: 700, fontSize: 18, color: "#fff", flexShrink: 0 }}>
          {data.acidity_class}
        </div>
        <div>
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 16, color: amber }}>
            {cls.label}
          </div>
          <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 13, color: white }}>
            pH {cls.range} · Palm: {cls.palm}
          </div>
        </div>
      </div>

      {/* Data rows */}
      {items.map(({ label, value, color }) => (
        <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
          borderBottom: "1px solid #1E3A5C", padding: "5px 0" }}>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: muted }}>{label}</span>
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 14, color: color || amber, fontWeight: 600 }}>
            {value}
          </span>
        </div>
      ))}
    </div>
  );
}
