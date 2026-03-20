/**
 * CFI_S0_SectionC.jsx  — v2 (corrected colours + locked HTML spec)
 * Section C — FFB Soil Origin
 *
 * SUPABASE WIRING (live columns verified 2026-03-20):
 *   Reads:  cfi_soil_profiles — soil_key, soil_group_name, coverage_pct_indonesia,
 *                               ph_degraded_low/high, cec_degraded_cmol_low/high,
 *                               is_peat, p_fix_fraction_baseline, is_active
 *   Writes: cfi_sites         — soil_type, agronomy_tier, product_value_index
 *
 * VISUAL SPEC: locked from CFI_S0_LOCKED_Draft72_7.html
 *   Soil cards   .soil-card  → bg #0C1E33  border rgba(139,160,180,0.18)  padding 20px 24px
 *   Active soil              → bg rgba(64,215,197,0.12)  border rgba(64,215,197,0.60)
 *                               name AMBER #F5A623  ph/cov rgba(245,166,35,0.75/0.60)
 *   Agronomy     .ag-card   → padding 10px 13px  active name TEAL #40D7C5
 *   Hero number              → DM Mono 800 28px AMBER #F5A623  (calculated output)
 */

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/* ── Tokens (locked from HTML) ──────────────────────── */
const T = {
  navyDeep: "#0C1E33",
  navyCard: "#111E33",
  tealDim:  "rgba(64,215,197,0.12)",
  tealBdr:  "rgba(64,215,197,0.60)",
  teal:     "#40D7C5",
  amber:    "#F5A623",
  red:      "#E84040",
  redDim:   "rgba(232,64,64,0.13)",
  green:    "#00A249",
  grey:     "#A8BDD0",
  greyLt:   "rgba(168,189,208,0.75)",
  bdrCalc:  "rgba(139,160,180,0.18)",
  white:    "#E8F0FE",
};
const F = {
  syne: "'Syne', sans-serif",
  dm:   "'DM Sans', sans-serif",
  mono: "'DM Mono', monospace",
  eb:   "'EB Garamond', serif",
};

/* ── Agronomy tiers ─────────────────────────────────── */
const TIERS = [
  { key: "VGAM",      label: "VGAM — Very Good Agronomy Management", pct: "100% Yield Baseline",                  mult: 1.00 },
  { key: "GAM",       label: "GAM — Good Agronomy Management",       pct: "85% Yield Baseline",                   mult: 0.85 },
  { key: "Poor",      label: "Poor Management",                      pct: "65% Yield Baseline",                   mult: 0.65 },
  { key: "Abandoned", label: "Abandoned / Degraded",                 pct: "40% Yield Baseline — Highest CFI Uplift", mult: 0.40 },
];

/* ── Soil-specific alerts ───────────────────────────── */
function getSoilAlert(key) {
  if (!key) return null;
  const k = key.toLowerCase();
  if (k.includes("histosol"))   return { level: "red",   text: "Peat Soil. 80% Less N And 70% Less P Needed. N Over-Application Locked Out. Hard Rule — Cannot Be Overridden." };
  if (k.includes("oxisol"))     return { level: "amber", text: "High Fe/Al Oxide Content. Synthetic Phosphate Rapidly Fixed. CFI Chelated P Significantly Outperforms TSP On This Soil." };
  if (k.includes("spodosol"))   return { level: "amber", text: "Sandy Soil — Lowest Fertility. CEC 2.0. CFI Humate Provides Critical CEC Improvement. Yield 31% Below Ultisol Baseline." };
  if (k.includes("inceptisol")) return { level: "green", text: "Best Baseline Fertility. Standard CFI Rates Apply. 40% Less N And 50% Less P Than Synthetic Programme." };
  return null;
}

/* ── Product Value Index ────────────────────────────── */
function calcPVI(profile, tierKey) {
  if (!profile || !tierKey) return null;
  const soilCoeff = profile.p_fix_fraction_baseline != null
    ? Math.max(0.10, 1 - profile.p_fix_fraction_baseline)
    : 0.50;
  const tier = TIERS.find(t => t.key === tierKey);
  return parseFloat(Math.min(1, Math.max(0, soilCoeff * (tier?.mult ?? 0.85))).toFixed(2));
}

/* ═══════════════════════════════════════════════════════ */
export default function SectionC({ siteId, gpsSoilSuggestion, onSoilConfirmed }) {

  const [profiles, setProfiles] = useState([]);
  const [selSoil,  setSelSoil]  = useState(null);
  const [selTier,  setSelTier]  = useState(null);
  const [pvi,      setPvi]      = useState(null);
  const [toast,    setToast]    = useState(null);
  const [saving,   setSaving]   = useState(false);
  const [err,      setErr]      = useState(null);

  /* Load soil profiles from live DB */
  useEffect(() => {
    supabase
      .from("cfi_soil_profiles")
      .select("id,soil_key,soil_group_name,coverage_pct_indonesia,ph_degraded_low,ph_degraded_high,cec_degraded_cmol_low,cec_degraded_cmol_high,is_peat,p_fix_fraction_baseline")
      .eq("is_active", true)
      .order("coverage_pct_indonesia", { ascending: false })
      .then(({ data, error }) => {
        if (error) { setErr("Could Not Load Soil Profiles."); return; }
        setProfiles(data || []);
      });
  }, []);

  /* GPS suggestion */
  useEffect(() => {
    if (!gpsSoilSuggestion || profiles.length === 0) return;
    const match = profiles.find(p => p.soil_key.toLowerCase().includes(gpsSoilSuggestion.toLowerCase()));
    if (match) {
      setToast(match.soil_key);
      if (!selSoil) setSelSoil(match.soil_key);
    }
  }, [gpsSoilSuggestion, profiles]);

  /* Recalc PVI on selection change */
  useEffect(() => {
    const profile = profiles.find(p => p.soil_key === selSoil);
    setPvi(calcPVI(profile, selTier));
  }, [selSoil, selTier, profiles]);

  /* Auto-save to cfi_sites */
  useEffect(() => {
    if (!siteId || (!selSoil && !selTier)) return;
    const profile = profiles.find(p => p.soil_key === selSoil);
    const idx = calcPVI(profile, selTier);
    setSaving(true);
    supabase.from("cfi_sites")
      .update({ soil_type: selSoil ?? null, agronomy_tier: selTier ?? null, product_value_index: idx ?? null })
      .eq("id", siteId)
      .then(({ error }) => {
        setSaving(false);
        if (!error && onSoilConfirmed) onSoilConfirmed({ soilType: selSoil, agronomyTier: selTier, productValueIndex: idx });
      });
  }, [selSoil, selTier]);

  const alert = getSoilAlert(selSoil);

  function phStr(p)  { return p.ph_degraded_low  != null ? (p.ph_degraded_high  ? `${p.ph_degraded_low}–${p.ph_degraded_high}`   : `${p.ph_degraded_low}`)  : "—"; }
  function cecStr(p) { return p.cec_degraded_cmol_low != null ? (p.cec_degraded_cmol_high ? `${p.cec_degraded_cmol_low}–${p.cec_degraded_cmol_high}` : `${p.cec_degraded_cmol_low}`) : "—"; }

  return (
    <div style={{ border: "1.5px solid #1E6B8C", borderRadius: 11, background: T.navyCard, overflow: "hidden" }}>

      {/* Section title */}
      <div style={{ padding: "11px 16px 10px", borderBottom: "1px solid rgba(64,215,197,0.12)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontFamily: F.syne, fontWeight: 700, fontSize: 15, color: T.teal }}>C — FFB Soil Origin</span>
        {saving && <span style={{ fontFamily: F.mono, fontSize: 10, color: T.greyLt }}>Saving…</span>}
      </div>
      <div style={{ fontSize: 13, color: T.greyLt, fontFamily: F.dm, padding: "5px 16px 7px" }}>
        CFI Product Value = Soil × Weather × Agronomy — Not A Flat Price
      </div>

      <div style={{ padding: "11px 13px", display: "flex", flexDirection: "column", gap: 6 }}>

        {err && <div style={{ background: T.redDim, border: `1px solid ${T.red}`, borderRadius: 6, padding: "8px 12px", fontSize: 11, color: T.red, fontFamily: F.dm }}>{err}</div>}

        {/* GPS toast */}
        {toast && (
          <div style={{ background: T.tealDim, border: `1px solid ${T.tealBdr}`, borderRadius: 6, padding: "7px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12, color: T.teal, fontFamily: F.dm }}>GPS Signal Found {toast} In Your Area. Is This Correct?</span>
            <button onClick={() => setToast(null)} style={{ background: "none", border: "none", color: T.greyLt, cursor: "pointer", fontSize: 16, lineHeight: 1, padding: "0 4px" }}>×</button>
          </div>
        )}

        {/* Soil cards — 2 col, locked spec */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {profiles.map(p => {
            const active = selSoil === p.soil_key;
            const isGPS  = toast && p.soil_key === toast && !active;
            return (
              <div
                key={p.soil_key}
                onClick={() => setSelSoil(p.soil_key)}
                style={{
                  background:   active ? T.tealDim : T.navyDeep,
                  border:       active ? `1.5px solid ${T.tealBdr}` : isGPS ? "1.5px dashed rgba(245,166,35,0.50)" : `1.5px solid ${T.bdrCalc}`,
                  borderRadius: 8,
                  padding:      "20px 24px",
                  cursor:       "pointer",
                  transition:   "all 0.12s",
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 700, fontFamily: F.dm, color: active ? T.amber : T.grey }}>
                  {p.soil_group_name}
                  {p.is_peat && <span style={{ marginLeft: 5, fontSize: 11, color: T.amber, fontFamily: F.mono }}>(Peat)</span>}
                </div>
                <div style={{ fontSize: 12, fontFamily: F.dm, color: active ? "rgba(245,166,35,0.75)" : T.greyLt, marginTop: 6 }}>
                  pH {phStr(p)} · CEC {cecStr(p)}
                </div>
                <div style={{ fontSize: 12, fontFamily: F.dm, color: active ? "rgba(245,166,35,0.60)" : T.greyLt, marginTop: 4 }}>
                  {p.coverage_pct_indonesia != null ? `${p.coverage_pct_indonesia}% Indonesian Palm` : "—"}
                </div>
                {isGPS && <div style={{ marginTop: 5, fontSize: 10, color: T.amber, fontFamily: F.dm }}>GPS Suggestion</div>}
              </div>
            );
          })}
        </div>

        {/* Soil alert */}
        {alert && (
          <div style={{
            background: alert.level === "red" ? T.redDim : alert.level === "amber" ? "rgba(245,166,35,0.10)" : "rgba(0,162,73,0.12)",
            border: `1px solid ${alert.level === "red" ? T.red : alert.level === "amber" ? T.amber : T.green}`,
            borderRadius: 6, padding: "8px 12px",
            fontSize: 12, fontFamily: F.dm,
            color: alert.level === "red" ? T.red : alert.level === "amber" ? T.amber : T.green,
          }}>
            {alert.text}
          </div>
        )}

        {/* Agronomy tiers — vertical stack, full width each, locked .ag-card spec */}
        <div style={{ fontSize: 11, fontWeight: 700, fontFamily: F.dm, color: T.greyLt, letterSpacing: "0.05em", marginTop: 6 }}>
          Agronomy Management Tier
        </div>
        {TIERS.map((tier, i) => {
          const active = selTier === tier.key;
          return (
            <div
              key={tier.key}
              onClick={() => setSelTier(tier.key)}
              style={{
                background:   active ? T.tealDim : T.navyDeep,
                border:       active ? `1.5px solid ${T.tealBdr}` : `1.5px solid ${T.bdrCalc}`,
                borderRadius: 8,
                padding:      "10px 13px",
                cursor:       "pointer",
                transition:   "all 0.12s",
                marginBottom: i < TIERS.length - 1 ? 5 : 0,
                textAlign:    "left",
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 700, fontFamily: F.dm, color: active ? T.teal : T.grey }}>{tier.label}</div>
              <div style={{ fontSize: 12, fontFamily: F.mono, color: active ? "rgba(0,201,177,0.70)" : T.greyLt, marginTop: 2 }}>{tier.pct}</div>
            </div>
          );
        })}

        {/* Product Value Index */}
        {(selSoil || selTier) && (
          <div style={{
            background: T.navyDeep, border: `1px solid ${T.bdrCalc}`,
            borderRadius: 8, padding: "10px 13px",
            display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 4,
          }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, fontFamily: F.mono, color: T.greyLt, letterSpacing: "0.07em", marginBottom: 2 }}>CFI PRODUCT VALUE INDEX</div>
              <div style={{ fontSize: 11, fontFamily: F.dm, color: T.greyLt, maxWidth: 240 }}>Soil × Weather × Agronomy. Flows into every stage lab report.</div>
              {!selSoil && <div style={{ fontSize: 10, color: T.amber, fontFamily: F.dm, marginTop: 2 }}>Select Soil Type To Refine</div>}
              {!selTier && <div style={{ fontSize: 10, color: T.amber, fontFamily: F.dm, marginTop: 2 }}>Select Agronomy Tier To Refine</div>}
            </div>
            <div style={{ textAlign: "right", minWidth: 70, flexShrink: 0 }}>
              <div style={{ fontFamily: F.mono, fontWeight: 800, fontSize: 28, color: T.amber }}>{pvi != null ? pvi.toFixed(2) : "—"}</div>
              <div style={{ fontSize: 10, fontFamily: F.mono, color: T.greyLt }}>0 – 1 Scale</div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
