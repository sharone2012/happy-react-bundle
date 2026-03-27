import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

// ─── DESIGN SYSTEM v3 ─────────────────────────────────────────────
const ds = {
  bg:        "#060C14",
  bgInput:   "#1A3A5C",
  bgInfo:    "#153352",
  border:    "1.5px solid #1E6B8C",
  amber:     "#F5A623",
  teal:      "#00C9B1",
  green:     "#A8E6C1",
  white:     "#FFFFFF",
  muted:     "#8BA5BE",
  red:       "#FF6B6B",
};

// Acidity class metadata
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

// CFI frass application modifiers by acidity class
const CFI_MODIFIERS = {
  1: { n_mult: 1.6, p_mult: 2.0, k_mult: 1.0, frass_rate: "High (8–12 t/ha/yr)", lime_rec: "3–5 t/ha dolomite" },
  2: { n_mult: 1.4, p_mult: 1.8, k_mult: 1.0, frass_rate: "High (6–10 t/ha/yr)", lime_rec: "2–4 t/ha dolomite" },
  3: { n_mult: 1.2, p_mult: 1.4, k_mult: 1.0, frass_rate: "Medium-High (5–8 t/ha/yr)", lime_rec: "1–2 t/ha dolomite" },
  4: { n_mult: 1.1, p_mult: 1.2, k_mult: 1.0, frass_rate: "Medium (4–6 t/ha/yr)", lime_rec: "Monitor only" },
  5: { n_mult: 1.0, p_mult: 1.0, k_mult: 1.0, frass_rate: "Standard (3–5 t/ha/yr)", lime_rec: "None required" },
  6: { n_mult: 1.0, p_mult: 1.0, k_mult: 1.0, frass_rate: "Standard (3–4 t/ha/yr)", lime_rec: "None required" },
  7: { n_mult: 1.0, p_mult: 0.9, k_mult: 1.0, frass_rate: "Standard (3–4 t/ha/yr)", lime_rec: "None required" },
  8: { n_mult: 0.9, p_mult: 0.8, k_mult: 1.0, frass_rate: "Low (2–3 t/ha/yr)", lime_rec: "Sulphur amendment possible" },
};

function SectionTitle({ letter, title }) {
  return (
    <div style={{ borderBottom: ds.border, paddingBottom: 8, marginBottom: 16 }}>
      <span style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 18, color: ds.teal }}>
        Section {letter}: {title}
      </span>
    </div>
  );
}

function InfoRow({ label, value, highlight }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
      borderBottom: `1px solid #1E3A5C`, padding: "6px 0" }}>
      <span style={{ fontFamily: "DM Sans", fontSize: 13, color: ds.muted }}>{label}</span>
      <span style={{ fontFamily: "DM Mono", fontSize: 14, color: highlight || ds.white, fontWeight: 600 }}>
        {value}
      </span>
    </div>
  );
}

export default function CFI_SoilAcidity_Lookup() {
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [millName, setMillName] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);

  const lookup = useCallback(async () => {
    const latN = parseFloat(lat);
    const lonN = parseFloat(lon);
    if (isNaN(latN) || isNaN(lonN)) { setError("Enter valid lat/lon."); return; }
    if (latN < -9.2 || latN > 4.5 || lonN < 108.5 || lonN > 141.1) {
      setError("Coordinates outside Indonesia coverage.");
      return;
    }
    setLoading(true); setError(null); setResult(null); setSaved(false);
    try {
      const { data, error: fnErr } = await supabase.rpc("get_soil_acidity_class", {
        p_lat: latN,
        p_lon: lonN,
        p_max_distance_km: 25,
      });
      if (fnErr) throw fnErr;
      if (!data || data.length === 0) {
        setError("No data within 25km. Location may be outside raster coverage.");
      } else {
        setResult(data[0]);
      }
    } catch (e) {
      setError(e.message || "Lookup failed.");
    }
    setLoading(false);
  }, [lat, lon]);

  const saveToMill = useCallback(async () => {
    if (!result || !millName) return;
    const { error: insertErr } = await supabase
      .from("cfi_mill_soil_acidity")
      .upsert({
        mill_name: millName,
        mill_lat: parseFloat(lat),
        mill_lon: parseFloat(lon),
        acidity_class: result.acidity_class,
        lookup_distance_km: result.distance_km,
      }, { onConflict: "mill_name" });
    if (!insertErr) setSaved(true);
  }, [result, millName, lat, lon]);

  const cls = result ? CLASS_META[result.acidity_class] : null;
  const mod = result ? CFI_MODIFIERS[result.acidity_class] : null;

  return (
    <div style={{ background: ds.bg, minHeight: "100vh", padding: 24, fontFamily: "DM Sans" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 22, color: ds.white }}>
            Soil Acidity Lookup
          </div>
          <div style={{ color: ds.muted, fontSize: 13, marginTop: 4 }}>
            IFPRI/HarvestChoice · Indonesia · 5km grid · 8 pH classes
          </div>
        </div>

        {/* Section A: Inputs */}
        <div style={{ background: ds.bgInput, border: ds.border, borderRadius: 8,
          padding: 20, marginBottom: 16 }}>
          <SectionTitle letter="A" title="Mill Location" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            <div>
              <div style={{ color: ds.teal, fontSize: 12, fontFamily: "DM Sans", marginBottom: 4 }}>
                Latitude (°N / °S negative)
              </div>
              <input
                value={lat}
                onChange={e => setLat(e.target.value)}
                placeholder="-6.5950 (Bogor)"
                style={{ width: "100%", background: ds.bg, border: ds.border, borderRadius: 4,
                  color: ds.white, fontFamily: "DM Mono", fontSize: 14, padding: "8px 10px",
                  boxSizing: "border-box" }}
              />
            </div>
            <div>
              <div style={{ color: ds.teal, fontSize: 12, fontFamily: "DM Sans", marginBottom: 4 }}>
                Longitude (°E)
              </div>
              <input
                value={lon}
                onChange={e => setLon(e.target.value)}
                placeholder="106.8167 (Bogor)"
                style={{ width: "100%", background: ds.bg, border: ds.border, borderRadius: 4,
                  color: ds.white, fontFamily: "DM Mono", fontSize: 14, padding: "8px 10px",
                  boxSizing: "border-box" }}
              />
            </div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ color: ds.teal, fontSize: 12, fontFamily: "DM Sans", marginBottom: 4 }}>
              Mill Name (optional — to save result)
            </div>
            <input
              value={millName}
              onChange={e => setMillName(e.target.value)}
              placeholder="e.g. Bogor Mill #1"
              style={{ width: "100%", background: ds.bg, border: ds.border, borderRadius: 4,
                color: ds.white, fontFamily: "DM Sans", fontSize: 14, padding: "8px 10px",
                boxSizing: "border-box" }}
            />
          </div>
          <button
            onClick={lookup}
            disabled={loading}
            style={{ background: ds.teal, color: "#000", fontFamily: "DM Sans", fontWeight: 700,
              fontSize: 14, border: "none", borderRadius: 6, padding: "10px 24px", cursor: "pointer" }}
          >
            {loading ? "Looking Up..." : "Lookup Soil Acidity"}
          </button>
          {error && (
            <div style={{ marginTop: 10, color: ds.red, fontFamily: "DM Mono", fontSize: 13 }}>
              ⚠ {error}
            </div>
          )}
        </div>

        {/* Section B: Result */}
        {result && cls && (
          <div style={{ background: ds.bgInfo, border: ds.border, borderRadius: 8, padding: 20, marginBottom: 16 }}>
            <SectionTitle letter="B" title="Soil Acidity Classification" />

            {/* Class badge */}
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20,
              padding: "14px 16px", background: ds.bg, borderRadius: 6, border: ds.border }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: cls.color,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "DM Mono", fontWeight: 700, fontSize: 20, color: "#fff", flexShrink: 0 }}>
                {result.acidity_class}
              </div>
              <div>
                <div style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 18, color: ds.amber }}>
                  {cls.label}
                </div>
                <div style={{ fontFamily: "DM Mono", fontSize: 14, color: ds.white }}>
                  pH {cls.range} · Palm Suitability: {cls.palm}
                </div>
              </div>
            </div>

            <InfoRow label="pH Range" value={cls.range} />
            <InfoRow label="pH Midpoint" value={result.ph_midpoint} highlight={ds.amber} />
            <InfoRow label="Nearest Grid Point" value={`${result.distance_km} km`} />
            <InfoRow label="Liming Required" value={cls.lime ? "YES" : "No"} highlight={cls.lime ? ds.red : ds.green} />
            <InfoRow label="Palm Suitability" value={cls.palm} highlight={["Optimal","Good"].includes(cls.palm) ? ds.green : ds.amber} />

            <div style={{ marginTop: 12, padding: "10px 14px", background: ds.bg, borderRadius: 6,
              borderLeft: `3px solid ${ds.teal}` }}>
              <div style={{ fontFamily: "DM Sans", fontSize: 13, color: ds.muted, marginBottom: 4 }}>
                CFI Note
              </div>
              <div style={{ fontFamily: "DM Sans", fontSize: 13, color: ds.white }}>
                {result.cfi_note}
              </div>
            </div>
          </div>
        )}

        {/* Section C: CFI Application Modifiers */}
        {result && mod && (
          <div style={{ background: ds.bgInfo, border: ds.border, borderRadius: 8, padding: 20, marginBottom: 16 }}>
            <SectionTitle letter="C" title="CFI Frass Application Modifiers" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
              {[
                { label: "N Multiplier", val: `×${mod.n_mult.toFixed(1)}`, color: mod.n_mult > 1 ? ds.amber : ds.green },
                { label: "P Multiplier", val: `×${mod.p_mult.toFixed(1)}`, color: mod.p_mult > 1 ? ds.amber : ds.green },
                { label: "K Multiplier", val: `×${mod.k_mult.toFixed(1)}`, color: mod.k_mult > 1 ? ds.amber : ds.green },
              ].map(({ label, val, color }) => (
                <div key={label} style={{ background: ds.bg, border: ds.border, borderRadius: 6,
                  padding: "12px 14px", textAlign: "center" }}>
                  <div style={{ fontFamily: "DM Sans", fontSize: 12, color: ds.muted, marginBottom: 6 }}>{label}</div>
                  <div style={{ fontFamily: "DM Mono", fontSize: 22, fontWeight: 700, color }}>{val}</div>
                </div>
              ))}
            </div>
            <InfoRow label="Recommended Frass Rate" value={mod.frass_rate} highlight={ds.amber} />
            <InfoRow label="Lime Recommendation" value={mod.lime_rec} highlight={cls.lime ? ds.red : ds.muted} />

            {cls.lime && (
              <div style={{ marginTop: 12, padding: "10px 14px", background: "#1A0A00", borderRadius: 6,
                border: "1.5px solid #F5A623" }}>
                <div style={{ fontFamily: "DM Sans", fontWeight: 700, color: ds.amber, fontSize: 13 }}>
                  ⚠ PKSA INTERACTION NOTE
                </div>
                <div style={{ fontFamily: "DM Sans", fontSize: 13, color: ds.white, marginTop: 4 }}>
                  PKSA alkaline pre-treatment (pH 10–12) partially offsets soil acidity in application zone. 
                  Still recommend dolomite at field level per {mod.lime_rec}.
                </div>
              </div>
            )}
          </div>
        )}

        {/* Section D: Save to Mill Registry */}
        {result && millName && (
          <div style={{ background: ds.bgInput, border: ds.border, borderRadius: 8, padding: 20 }}>
            <SectionTitle letter="D" title="Save To Mill Registry" />
            <button
              onClick={saveToMill}
              disabled={saved}
              style={{ background: saved ? "#1A5C3A" : ds.amber, color: "#000", fontFamily: "DM Sans",
                fontWeight: 700, fontSize: 14, border: "none", borderRadius: 6,
                padding: "10px 24px", cursor: saved ? "default" : "pointer" }}
            >
              {saved ? "✓ Saved to cfi_mill_soil_acidity" : `Save: ${millName}`}
            </button>
            <div style={{ marginTop: 10, color: ds.muted, fontSize: 12, fontFamily: "DM Sans" }}>
              Saved records are auto-loaded in S0 Mill Configuration when mill name matches.
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
