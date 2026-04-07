/**
 * CFI_S0_SectionD.jsx
 * Section D — Residue Selection
 *
 * SUPABASE WIRING (live columns verified 2026-03-20):
 *   Writes: cfi_sites — efb_enabled, opdc_enabled, pos_enabled, opf_enabled,
 *                        opt_enabled, pome_enabled, pke_enabled, pmf_enabled,
 *                        custom_stream_1_enabled, custom_stream_2_enabled,
 *                        custom_stream_1_label, custom_stream_2_label
 *
 * VISUAL SPEC: locked from CFI_S0_LOCKED_Draft72_7.html
 *   Toggle cards .toggle-card → bg #0C1E33  border rgba(139,160,180,0.18)
 *                               borderRadius 8px  padding 10px 13px  minHeight 52px
 *   Active       .toggle-card.active → bg rgba(64,215,197,0.12)  border rgba(64,215,197,0.60)
 *   Name idle    → DM Sans 700 14px  #A8BDD0
 *   Name active  → DM Sans 700 14px  #F5A623 (amber)
 *   Sub idle     → DM Sans 12px  rgba(168,189,208,0.75)
 *   Sub active   → DM Sans 12px  rgba(245,166,35,0.65)
 *   Grid         → 2 columns  gap 12px  (.grid2)
 *   Custom input → bg transparent  border none  DM Sans 14px 500  #E8F0FE
 *
 * GUARDRAILS:
 *   EFB off → OPDC auto-deselects (OPDC yield anchored to EFB FW — no anchor without EFB)
 *   POME → liquid stream only, does NOT appear in D2 solid mix
 *   PKE  → $160/t purchased input (not zero cost)
 *   All streams start OFF
 */

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

/* ── Tokens ─────────────────────────────────────────── */
const T = {
  navyDeep: "#0C1E33",
  navyCard: "#111E33",
  tealDim:  "rgba(64,215,197,0.12)",
  tealBdr:  "rgba(64,215,197,0.60)",
  teal:     "#40D7C5",
  amber:    "#F5A623",
  amberSub: "rgba(245,166,35,0.65)",
  grey:     "#A8BDD0",
  greyLt:   "rgba(168,189,208,0.75)",
  bdrCalc:  "rgba(139,160,180,0.18)",
  bdrDash:  "rgba(139,160,180,0.28)",
  white:    "#E8F0FE",
  red:      "#E84040",
};
const F = {
  syne: "'Syne', sans-serif",
  dm:   "'DM Sans', sans-serif",
  mono: "'DM Mono', monospace",
};

/* ── Stream definitions ─────────────────────────────── */
const STREAMS = [
  { key: "efb",   col: "efb_enabled",   label: "Empty Fruit Bunches", sub: "EFB · Zero Cost",      liquid: false },
  { key: "opdc",  col: "opdc_enabled",  label: "Decanter Cake",       sub: "OPDC · Zero Cost",     liquid: false },
  { key: "pos",   col: "pos_enabled",   label: "Palm Oil Sludge",     sub: "POS · Zero Cost",      liquid: false },
  { key: "pmf",   col: "pmf_enabled",   label: "Palm Mesocarp Fiber", sub: "PMF · Zero Cost",      liquid: false },
  { key: "pke",   col: "pke_enabled",   label: "Palm Kernel Expeller",sub: "PKE · $160 / t",       liquid: false, purchased: true },
  { key: "pome",  col: "pome_enabled",  label: "POME (Liquid)",       sub: "Emissions Avoidance Only — Not A Solid Mix Input", liquid: true  },
  { key: "opf",   col: "opf_enabled",   label: "Oil Palm Fronds",     sub: "OPF · Seasonal · Zero Cost",  liquid: false },
  { key: "opt",   col: "opt_enabled",   label: "Oil Palm Trunks",     sub: "OPT · Replanting Only · Zero Cost", liquid: false },
];

const INITIAL = Object.fromEntries(STREAMS.map(s => [s.key, false]));

/* ═══════════════════════════════════════════════════════ */
export default function SectionD({ siteId, onStreamsChanged }) {

  const [active,  setActive]  = useState({ ...INITIAL });
  const [custom1, setCustom1] = useState({ enabled: false, label: "" });
  const [custom2, setCustom2] = useState({ enabled: false, label: "" });
  const [saving,  setSaving]  = useState(false);
  const [showNew, setShowNew] = useState(false);

  /* Save helper */
  const saveToSupabase = useCallback(async (patch) => {
    if (!siteId) return;
    setSaving(true);
    await supabase.from("cfi_sites").update(patch).eq("id", siteId);
    setSaving(false);
  }, [siteId]);

  /* Toggle stream */
  function toggleStream(key) {
    setActive(prev => {
      let next = { ...prev, [key]: !prev[key] };
      // GUARDRAIL: EFB off → OPDC auto-deselects
      if (key === "efb" && !next.efb) next.opdc = false;
      const patch = Object.fromEntries(
        STREAMS.map(s => [s.col, next[s.key]])
      );
      saveToSupabase(patch);
      if (onStreamsChanged) onStreamsChanged(next);
      return next;
    });
  }

  /* Custom stream 1 toggle */
  function toggleCustom1() {
    setCustom1(prev => {
      const next = { ...prev, enabled: !prev.enabled };
      saveToSupabase({ custom_stream_1_enabled: next.enabled, custom_stream_1_label: next.label || null });
      return next;
    });
  }

  /* Custom stream 2 toggle */
  function toggleCustom2() {
    setCustom2(prev => {
      const next = { ...prev, enabled: !prev.enabled };
      saveToSupabase({ custom_stream_2_enabled: next.enabled, custom_stream_2_label: next.label || null });
      return next;
    });
  }

  /* Save custom label on blur */
  function saveCustomLabel(num, val) {
    if (num === 1) {
      setCustom1(p => ({ ...p, label: val }));
      saveToSupabase({ custom_stream_1_label: val || null });
    } else {
      setCustom2(p => ({ ...p, label: val }));
      saveToSupabase({ custom_stream_2_label: val || null });
    }
  }

  /* Active stream count for summary */
  const activeCount = STREAMS.filter(s => active[s.key]).length
    + (custom1.enabled ? 1 : 0)
    + (custom2.enabled ? 1 : 0);

  return (
    <div style={{ border: "1.5px solid #1E6B8C", borderRadius: 11, background: T.navyCard, overflow: "hidden" }}>

      {/* Section title */}
      <div style={{ padding: "11px 16px 10px", borderBottom: "1px solid rgba(64,215,197,0.12)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontFamily: F.syne, fontWeight: 700, fontSize: 15, color: T.teal }}>D — Residue Selection</span>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {activeCount > 0 && (
            <span style={{ fontFamily: F.mono, fontSize: 11, color: T.amber }}>
              {activeCount} Stream{activeCount > 1 ? "s" : ""} Active
            </span>
          )}
          {saving && <span style={{ fontFamily: F.mono, fontSize: 10, color: T.greyLt }}>Saving…</span>}
        </div>
      </div>
      <div style={{ fontSize: 13, color: T.greyLt, fontFamily: F.dm, padding: "5px 16px 7px" }}>
        Click Any Card To Activate Or De-Activate · All Streams Start Off
      </div>

      <div style={{ padding: "11px 13px", display: "flex", flexDirection: "column", gap: 6 }}>

        {/* GUARDRAIL notice — only shown when OPDC is about to be blocked */}
        {!active.efb && active.opdc && (
          <div style={{ background: "rgba(232,64,64,0.10)", border: `1px solid ${T.red}`, borderRadius: 6, padding: "7px 12px", fontSize: 11, color: T.red, fontFamily: F.dm }}>
            OPDC Has Been Deselected — OPDC Yield Is Anchored To EFB Fresh Weight. Enable EFB To Use OPDC.
          </div>
        )}

        {/* 2-column grid — locked .grid2 spec */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {STREAMS.map(s => {
            const isActive = active[s.key];
            const blocked  = s.key === "opdc" && !active.efb;
            return (
              <div
                key={s.key}
                onClick={() => !blocked && toggleStream(s.key)}
                style={{
                  background:   isActive ? T.tealDim : T.navyDeep,
                  border:       isActive ? `1.5px solid ${T.tealBdr}` : `1.5px solid ${T.bdrCalc}`,
                  borderRadius: 8,
                  padding:      "10px 13px",
                  cursor:       blocked ? "not-allowed" : "pointer",
                  transition:   "all 0.12s",
                  minHeight:    52,
                  opacity:      1,
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 700, fontFamily: F.dm, color: isActive ? T.amber : T.grey }}>
                  {s.label}
                </div>
                <div style={{ fontSize: 12, fontFamily: F.dm, color: isActive ? T.amberSub : T.greyLt, marginTop: 3 }}>
                  {blocked ? "Requires EFB" : s.sub}
                </div>
                {s.purchased && !isActive && (
                  <div style={{ fontSize: 10, fontFamily: F.mono, color: T.amber, marginTop: 3 }}>Purchased Input — Not Mill Waste</div>
                )}
                {s.liquid && isActive && (
                  <div style={{ fontSize: 10, fontFamily: F.mono, color: T.teal, marginTop: 3 }}>Emissions Avoidance Only — Excluded From Solid Mix</div>
                )}
              </div>
            );
          })}
        </div>

        {/* Add Custom Residue toggle */}
        {!showNew ? (
          <button
            onClick={() => setShowNew(true)}
            style={{
              background: "transparent", border: `1px solid rgba(64,215,197,0.48)`,
              borderRadius: 6, color: T.teal, fontFamily: F.dm, fontSize: 11, fontWeight: 700,
              padding: "5px 14px", cursor: "pointer", alignSelf: "flex-start", marginTop: 4,
            }}
          >
            + Add Custom Residue
          </button>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 4 }}>

            {/* Custom 1 */}
            <div
              style={{
                background:   custom1.enabled ? T.tealDim : T.navyDeep,
                border:       custom1.enabled ? `1.5px solid ${T.tealBdr}` : `1.5px dashed ${T.bdrDash}`,
                borderRadius: 8, padding: "10px 13px", minHeight: 52,
                display: "flex", alignItems: "center", gap: 8,
              }}
            >
              <input
                value={custom1.label}
                onChange={e => setCustom1(p => ({ ...p, label: e.target.value }))}
                onBlur={e => saveCustomLabel(1, e.target.value)}
                placeholder="Enter New Residue"
                style={{
                  background: "transparent", border: "none", outline: "none",
                  fontFamily: F.dm, fontSize: 14, fontWeight: 500,
                  color: custom1.label ? T.white : undefined,
                  width: "100%",
                }}
              />
              {custom1.label && (
                <button
                  onClick={toggleCustom1}
                  style={{
                    background: custom1.enabled ? T.tealDim : "transparent",
                    border: `1px solid rgba(64,215,197,0.48)`, borderRadius: 4,
                    color: T.teal, fontFamily: F.dm, fontSize: 10, fontWeight: 700,
                    padding: "3px 8px", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0,
                  }}
                >
                  {custom1.enabled ? "Active" : "Activate"}
                </button>
              )}
            </div>

            {/* Custom 2 */}
            <div
              style={{
                background:   custom2.enabled ? T.tealDim : T.navyDeep,
                border:       custom2.enabled ? `1.5px solid ${T.tealBdr}` : `1.5px dashed ${T.bdrDash}`,
                borderRadius: 8, padding: "10px 13px", minHeight: 52,
                display: "flex", alignItems: "center", gap: 8,
              }}
            >
              <input
                value={custom2.label}
                onChange={e => setCustom2(p => ({ ...p, label: e.target.value }))}
                onBlur={e => saveCustomLabel(2, e.target.value)}
                placeholder="Enter New Residue"
                style={{
                  background: "transparent", border: "none", outline: "none",
                  fontFamily: F.dm, fontSize: 14, fontWeight: 500,
                  color: custom2.label ? T.white : undefined,
                  width: "100%",
                }}
              />
              {custom2.label && (
                <button
                  onClick={toggleCustom2}
                  style={{
                    background: custom2.enabled ? T.tealDim : "transparent",
                    border: `1px solid rgba(64,215,197,0.48)`, borderRadius: 4,
                    color: T.teal, fontFamily: F.dm, fontSize: 10, fontWeight: 700,
                    padding: "3px 8px", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0,
                  }}
                >
                  {custom2.enabled ? "Active" : "Activate"}
                </button>
              )}
            </div>

          </div>
        )}

        {/* PKE warning when active */}
        {active.pke && (
          <div style={{ background: "rgba(245,166,35,0.10)", border: `1px solid ${T.amber}`, borderRadius: 6, padding: "7px 12px", fontSize: 11, color: T.amber, fontFamily: F.dm }}>
            PKE Is A Purchased Input At $160 / t — Not Mill Waste. Cost Applied In Financial Model.
          </div>
        )}

        {/* POME note when active */}
        {active.pome && (
          <div style={{ background: T.tealDim, border: `1px solid ${T.tealBdr}`, borderRadius: 6, padding: "7px 12px", fontSize: 11, color: T.teal, fontFamily: F.dm }}>
            POME Enabled — Adds To Emissions Avoidance Calculation Only. Not Included In Solid Residue Mix (D2).
          </div>
        )}

      </div>
    </div>
  );
}
