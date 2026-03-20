/**
 * CFI_S0_SectionC.jsx
 * Section C — FFB Soil Origin
 * Reads from: cfi_soil_profiles (6 rows)
 * Writes to:  cfi_sites (soil_type, agronomy_tier, product_value_index)
 * Props: siteId, gpsSoilSuggestion (soil_key string from SectionAB GPS), onSoilConfirmed
 */

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/* ── Design tokens ─────────────────────────────────────── */
const C = {
  navy:    "#0B1422",
  navyMid: "#153352",
  navyLt:  "#1A3A5C",
  navyDk:  "#070D16",
  teal:    "#00C9B1",
  amber:   "#F5A623",
  red:     "#E84040",
  green:   "#3DCB7A",
  white:   "#F0F4F8",
  grey:    "#8BA0B4",
  greyLt:  "#C4D3E0",
};
const Fnt = {
  syne: "'Syne', sans-serif",
  dm:   "'DM Sans', sans-serif",
  mono: "'DM Mono', monospace",
};

/* ── Agronomy tiers ────────────────────────────────────── */
const AGRONOMY_TIERS = [
  { key: "VGAM",      label: "VGAM",      sub: "Very Good Agronomy Management", multiplier: 1.00, color: C.green },
  { key: "GAM",       label: "GAM",       sub: "Good Agronomy Management",      multiplier: 0.85, color: C.teal  },
  { key: "Poor",      label: "Poor",      sub: "Poor Management",               multiplier: 0.65, color: C.amber },
  { key: "Abandoned", label: "Abandoned", sub: "Abandoned / Degraded",          multiplier: 0.40, color: C.red   },
];

/* ── Soil-specific alerts ──────────────────────────────── */
function getSoilAlert(soilKey) {
  if (!soilKey) return null;
  const k = soilKey.toLowerCase();
  if (k.includes("histosol"))
    return { level: "red",   text: "Peat Soil. 80% Less N And 70% Less P Needed. N Over-Application Locked Out. Hard Rule — Cannot Be Overridden." };
  if (k.includes("oxisol"))
    return { level: "amber", text: "High Fe/Al Oxide Content. Synthetic Phosphate Is Rapidly Fixed. CFI Chelated P Significantly Outperforms TSP On This Soil." };
  if (k.includes("spodosol"))
    return { level: "amber", text: "Sandy Soil — Lowest Fertility. CEC 2.0. CFI Humate Provides Critical CEC Improvement. Yield 31% Below Ultisol Baseline." };
  if (k.includes("inceptisol"))
    return { level: "green", text: "Best Baseline Fertility. Standard CFI Rates Apply. 40% Less N And 50% Less P Than Synthetic Programme." };
  return null;
}

/* ── Product Value Index calculation ───────────────────── */
function calcProductValueIndex(soilProfile, agronomyTier) {
  if (!soilProfile || !agronomyTier) return null;
  // Soil coefficient: use p_fix_fraction_baseline as soil quality proxy
  // Reference soil = Ultisols (p_fix = 0.60). Index = (1 - p_fix) normalised × agronomy multiplier
  const soilCoeff = soilProfile.p_fix_fraction_baseline != null
    ? Math.max(0.1, 1 - soilProfile.p_fix_fraction_baseline)
    : 0.5;
  const tier = AGRONOMY_TIERS.find(t => t.key === agronomyTier);
  const agMult = tier ? tier.multiplier : 0.85;
  const raw = soilCoeff * agMult;
  return Math.min(1, Math.max(0, parseFloat(raw.toFixed(3))));
}

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════ */
export default function SectionC({ siteId, gpsSoilSuggestion, onSoilConfirmed }) {

  const [soilProfiles, setSoilProfiles]   = useState([]);
  const [selectedSoil, setSelectedSoil]   = useState(null);   // soil_key string
  const [selectedTier, setSelectedTier]   = useState(null);   // tier key string
  const [productIndex, setProductIndex]   = useState(null);   // 0–1
  const [toast, setToast]                 = useState(null);   // GPS suggestion toast
  const [saving, setSaving]               = useState(false);
  const [error, setError]                 = useState(null);

  /* Load soil profiles */
  useEffect(() => {
    supabase
      .from("cfi_soil_profiles")
      .select("id, soil_key, soil_group_name, local_name, coverage_pct_indonesia, ph_degraded_low, ph_degraded_high, cec_degraded_cmol_low, cec_degraded_cmol_high, is_peat, p_fix_fraction_baseline, notes")
      .eq("is_active", true)
      .order("coverage_pct_indonesia", { ascending: false })
      .then(({ data, error }) => {
        if (error) setError("Could not load soil profiles.");
        else setSoilProfiles(data || []);
      });
  }, []);

  /* Show GPS suggestion toast when prop arrives */
  useEffect(() => {
    if (gpsSoilSuggestion && soilProfiles.length > 0) {
      const match = soilProfiles.find(p =>
        p.soil_key.toLowerCase().includes(gpsSoilSuggestion.toLowerCase())
      );
      if (match) {
        setToast(match.soil_key);
        // Auto-select suggestion if user has not already picked
        if (!selectedSoil) setSelectedSoil(match.soil_key);
      }
    }
  }, [gpsSoilSuggestion, soilProfiles]);

  /* Recalculate Product Value Index whenever soil or tier changes */
  useEffect(() => {
    const profile = soilProfiles.find(p => p.soil_key === selectedSoil);
    const idx = calcProductValueIndex(profile, selectedTier);
    setProductIndex(idx);
  }, [selectedSoil, selectedTier, soilProfiles]);

  /* Save to cfi_sites whenever soil or tier changes */
  useEffect(() => {
    if (!siteId || (!selectedSoil && !selectedTier)) return;
    const profile = soilProfiles.find(p => p.soil_key === selectedSoil);
    const idx = calcProductValueIndex(profile, selectedTier);
    setSaving(true);
    supabase
      .from("cfi_sites")
      .update({
        soil_type:           selectedSoil  || null,
        agronomy_tier:       selectedTier  || null,
        product_value_index: idx           ?? null,
      })
      .eq("id", siteId)
      .then(({ error }) => {
        setSaving(false);
        if (!error && onSoilConfirmed) {
          onSoilConfirmed({ soilType: selectedSoil, agronomyTier: selectedTier, productValueIndex: idx });
        }
      });
  }, [selectedSoil, selectedTier]);

  /* ── Helpers ── */
  const activeProfile  = soilProfiles.find(p => p.soil_key === selectedSoil);
  const soilAlert      = getSoilAlert(selectedSoil);
  const activeTier     = AGRONOMY_TIERS.find(t => t.key === selectedTier);

  /* ── pH display ── */
  function phDisplay(profile) {
    if (profile.ph_degraded_low == null) return "—";
    return profile.ph_degraded_high != null
      ? `${profile.ph_degraded_low}–${profile.ph_degraded_high}`
      : `${profile.ph_degraded_low}`;
  }
  function cecDisplay(profile) {
    if (profile.cec_degraded_cmol_low == null) return "—";
    return profile.cec_degraded_cmol_high != null
      ? `${profile.cec_degraded_cmol_low}–${profile.cec_degraded_cmol_high}`
      : `${profile.cec_degraded_cmol_low}`;
  }

  /* ══════════════ RENDER ══════════════════════════════════ */
  return (
    <div style={{
      border:       "1.5px solid #1E6B8C",
      borderRadius: 10,
      background:   C.navy,
      padding:      "18px 20px",
      marginBottom: 16,
    }}>

      {/* Section Title */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <span style={{
          fontFamily: Fnt.syne, fontWeight: 700, fontSize: 13,
          color: C.teal, letterSpacing: "0.06em",
        }}>C — FFB Soil Origin</span>
        <span style={{
          fontFamily: Fnt.dm, fontSize: 11, color: C.grey,
        }}>CFI Product Value = Soil × Weather × Agronomy. Not A Flat Price.</span>
        {saving && (
          <span style={{ marginLeft: "auto", fontFamily: Fnt.mono, fontSize: 10, color: C.grey }}>
            Saving…
          </span>
        )}
      </div>

      {error && (
        <div style={{ background: "#2A1010", border: `1px solid ${C.red}`, borderRadius: 6,
          padding: "8px 12px", fontFamily: Fnt.dm, fontSize: 11, color: C.red, marginBottom: 12 }}>
          {error}
        </div>
      )}

      {/* GPS Suggestion Toast */}
      {toast && (
        <div style={{
          background: "#0C2035", border: `1px solid ${C.teal}`,
          borderRadius: 6, padding: "8px 12px", marginBottom: 14,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <span style={{ fontFamily: Fnt.dm, fontSize: 11, color: C.teal }}>
            GPS Signal Found {toast} In Your Area. Is This Correct?
          </span>
          <button
            onClick={() => setToast(null)}
            style={{ background: "none", border: "none", color: C.grey, cursor: "pointer", fontSize: 14, lineHeight: 1 }}
          >×</button>
        </div>
      )}

      {/* ── Soil Type Cards ── */}
      <div style={{
        fontFamily: Fnt.dm, fontSize: 11, fontWeight: 600,
        color: C.teal, letterSpacing: "0.06em", marginBottom: 8,
      }}>Soil Classification</div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
        gap: 8, marginBottom: 16,
      }}>
        {soilProfiles.map(profile => {
          const isSelected = selectedSoil === profile.soil_key;
          const isGPS      = toast && profile.soil_key === toast;
          return (
            <button
              key={profile.soil_key}
              onClick={() => setSelectedSoil(profile.soil_key)}
              style={{
                background:   isSelected ? C.navyLt : C.navyMid,
                border:       isSelected
                  ? `1.5px solid ${C.teal}`
                  : isGPS
                    ? `1.5px dashed ${C.amber}`
                    : "1.5px solid #1E6B8C",
                borderRadius: 7,
                padding:      "10px 12px",
                cursor:       "pointer",
                textAlign:    "left",
                transition:   "border 0.15s",
              }}
            >
              {/* Soil name */}
              <div style={{
                fontFamily: Fnt.dm, fontWeight: 700, fontSize: 12,
                color: isSelected ? C.teal : C.white, marginBottom: 4,
              }}>
                {profile.soil_group_name}
                {profile.is_peat && (
                  <span style={{ marginLeft: 4, fontSize: 9, color: C.amber,
                    fontFamily: Fnt.mono, letterSpacing: "0.05em" }}>PEAT</span>
                )}
              </div>
              {/* Coverage */}
              <div style={{ fontFamily: Fnt.mono, fontSize: 11, color: C.amber, marginBottom: 4 }}>
                {profile.coverage_pct_indonesia != null
                  ? `${profile.coverage_pct_indonesia}% IDN`
                  : "—"}
              </div>
              {/* pH and CEC */}
              <div style={{ display: "flex", gap: 8 }}>
                <div>
                  <div style={{ fontFamily: Fnt.dm, fontSize: 9, color: C.grey }}>pH</div>
                  <div style={{ fontFamily: Fnt.mono, fontSize: 11, color: C.greyLt }}>
                    {phDisplay(profile)}
                  </div>
                </div>
                <div>
                  <div style={{ fontFamily: Fnt.dm, fontSize: 9, color: C.grey }}>CEC</div>
                  <div style={{ fontFamily: Fnt.mono, fontSize: 11, color: C.greyLt }}>
                    {cecDisplay(profile)}
                  </div>
                </div>
              </div>
              {/* GPS tag */}
              {isGPS && !isSelected && (
                <div style={{ marginTop: 5, fontFamily: Fnt.dm, fontSize: 9,
                  color: C.amber, letterSpacing: "0.04em" }}>GPS Suggestion</div>
              )}
              {/* Selected tick */}
              {isSelected && (
                <div style={{ marginTop: 5, fontFamily: Fnt.dm, fontSize: 9,
                  color: C.teal, letterSpacing: "0.04em" }}>Selected</div>
              )}
            </button>
          );
        })}
      </div>

      {/* Soil Alert */}
      {soilAlert && (
        <div style={{
          background: soilAlert.level === "red"   ? "#2A1010"
                    : soilAlert.level === "amber" ? "#2A1A00"
                    : "#0A2A14",
          border: `1px solid ${
            soilAlert.level === "red"   ? C.red   :
            soilAlert.level === "amber" ? C.amber : C.green}`,
          borderRadius: 6, padding: "8px 12px", marginBottom: 16,
          fontFamily: Fnt.dm, fontSize: 11,
          color: soilAlert.level === "red"   ? C.red   :
                 soilAlert.level === "amber" ? C.amber : C.green,
        }}>
          {soilAlert.text}
        </div>
      )}

      {/* ── Agronomy Management Tier ── */}
      <div style={{
        fontFamily: Fnt.dm, fontSize: 11, fontWeight: 600,
        color: C.teal, letterSpacing: "0.06em", marginBottom: 8,
      }}>Agronomy Management Tier</div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 8, marginBottom: 16,
      }}>
        {AGRONOMY_TIERS.map(tier => {
          const isSelected = selectedTier === tier.key;
          return (
            <button
              key={tier.key}
              onClick={() => setSelectedTier(tier.key)}
              style={{
                background:   isSelected ? C.navyLt : C.navyMid,
                border:       isSelected
                  ? `1.5px solid ${tier.color}`
                  : "1.5px solid #1E6B8C",
                borderRadius: 7,
                padding:      "10px 12px",
                cursor:       "pointer",
                textAlign:    "left",
                transition:   "border 0.15s",
              }}
            >
              <div style={{
                fontFamily: Fnt.dm, fontWeight: 700, fontSize: 12,
                color: isSelected ? tier.color : C.white, marginBottom: 2,
              }}>{tier.label}</div>
              <div style={{
                fontFamily: Fnt.dm, fontSize: 10,
                color: C.grey, marginBottom: 6,
              }}>{tier.sub}</div>
              <div style={{
                fontFamily: Fnt.mono, fontSize: 11,
                color: isSelected ? tier.color : C.grey,
              }}>{Math.round(tier.multiplier * 100)}% Yield Baseline</div>
              {tier.key === "Abandoned" && (
                <div style={{ marginTop: 4, fontFamily: Fnt.dm, fontSize: 9,
                  color: C.teal, letterSpacing: "0.04em" }}>Highest CFI Uplift</div>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Product Value Index ── */}
      {(selectedSoil || selectedTier) && (
        <div style={{
          background:   "#060C14",
          border:       `1px solid rgba(61,203,122,0.30)`,
          borderRadius: 8,
          padding:      "12px 16px",
          display:      "flex",
          alignItems:   "center",
          justifyContent: "space-between",
        }}>
          <div>
            <div style={{
              fontFamily: Fnt.dm, fontSize: 10, fontWeight: 600,
              color: C.grey, letterSpacing: "0.07em", marginBottom: 3,
            }}>CFI Product Value Index</div>
            <div style={{
              fontFamily: Fnt.dm, fontSize: 10, color: C.grey, maxWidth: 380,
            }}>
              Soil × Weather × Agronomy. Same product worth a different amount on every estate.
              Flows into every stage lab report value column.
            </div>
          </div>
          <div style={{ textAlign: "right", minWidth: 80 }}>
            {productIndex != null ? (
              <>
                <div style={{
                  fontFamily: Fnt.mono, fontWeight: 700, fontSize: 28, color: C.green,
                }}>
                  {productIndex.toFixed(2)}
                </div>
                <div style={{
                  fontFamily: Fnt.dm, fontSize: 10, color: C.grey,
                }}>0 – 1 Scale</div>
                {!selectedSoil && (
                  <div style={{ fontFamily: Fnt.dm, fontSize: 9, color: C.amber, marginTop: 3 }}>
                    Select Soil Type To Refine
                  </div>
                )}
                {!selectedTier && (
                  <div style={{ fontFamily: Fnt.dm, fontSize: 9, color: C.amber, marginTop: 3 }}>
                    Select Agronomy Tier To Refine
                  </div>
                )}
              </>
            ) : (
              <div style={{ fontFamily: Fnt.mono, fontSize: 16, color: C.grey }}>—</div>
            )}
          </div>
        </div>
      )}

      {/* Pending selection prompt */}
      {!selectedSoil && !selectedTier && (
        <div style={{
          fontFamily: Fnt.dm, fontSize: 11, color: C.grey,
          padding: "10px 0", textAlign: "center",
        }}>
          Select A Soil Type And Agronomy Tier To Calculate The Product Value Index.
        </div>
      )}

    </div>
  );
}
