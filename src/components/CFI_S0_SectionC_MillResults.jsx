/**
 * CFI_S0_SectionC_MillResults.jsx
 * Section C — Mill Monthly Results
 *
 * SUPABASE WIRING (live columns verified 2026-03-20):
 *   Reads: cfi_sites —
 *     ffb_capacity_tph, utilisation_pct, operating_hrs_day,
 *     operating_days_month, capacity_confirmed,
 *     monthly_ffb_t, efb_volume_t, opdc_volume_t,
 *     pos_volume_t, pmf_volume_t, pome_volume_t
 *
 *   Writes: cfi_sites —
 *     monthly_ffb_t, efb_volume_t, opdc_volume_t,
 *     pos_volume_t, pmf_volume_t, pome_volume_t
 *     (auto-saved whenever B is confirmed)
 *
 * VISUAL SPEC: locked from CFI_S0_LOCKED_Draft72_7.html
 *   .c-body         → padding 15px 18px, flex col, align center, gap 6px
 *   .c-ffb-box      → bg #00A249, border 1.5px #00A249, borderRadius 9px, padding 12px 17px
 *   .c-ffb-lbl      → EB Garamond 700 17px #000000
 *   .c-ffb-val      → EB Garamond 700 19px #000000, unit 16px #000000
 *   .c-ffb-box.active → bg teal-dim, border teal-bdr, lbl+val AMBER #F5A623
 *   .c-sub-lbl      → DM Sans 700 11px grey, letter-spacing 0.05em, center
 *   .c-res-grid     → grid 2 cols, gap 8px
 *   .c-res-card     → bg teal-dim, border teal-bdr, borderRadius 7px, padding 13px 9px, center
 *   .c-res-card.grey → bg rgba(168,189,208,0.07), border rgba(168,189,208,0.22)
 *   .c-res-name     → EB Garamond 700 17px amber, lineHeight 1.2
 *   .c-res-val      → EB Garamond 700 19px amber, unit 16px amber
 *   .c-arrow        → 24px grey opacity 0.85
 *
 * CALCULATIONS (locked values — never change):
 *   monthly_ffb  = ffb_tph × (util/100) × hrs_day × days_month
 *   EFB          = monthly_ffb × 0.225     (22.5% FFB)
 *   OPDC         = EFB × 0.152             (15.2% EFB FW — locked)
 *   POS          = monthly_ffb × 0.015
 *   PMF          = monthly_ffb × 0.145
 *   POME         = monthly_ffb × 0.30
 */

import { useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";

/* ── Tokens (locked) ─────────────────────────────────── */
const T = {
  navyCard:  "#111E33",
  navyDeep:  "#0C1E33",
  tealDim:   "rgba(64,215,197,0.12)",
  tealBdr:   "rgba(64,215,197,0.60)",
  teal:      "#40D7C5",
  amber:     "#F5A623",
  green:     "#00A249",
  grey:      "#A8BDD0",
  greyLt:    "rgba(168,189,208,0.75)",
  greyCard:  "rgba(168,189,208,0.07)",
  greyBdr:   "rgba(168,189,208,0.22)",
  white:     "#E8F0FE",
};
const F = {
  syne:  "'Syne', sans-serif",
  dm:    "'DM Sans', sans-serif",
  mono:  "'DM Sans', sans-serif",
  brand: "'EB Garamond', serif",
};

/* ── Format helper ───────────────────────────────────── */
function fmt(n) {
  if (!n || n <= 0) return "—";
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  return Math.round(n).toString();
}

/* ═══════════════════════════════════════════════════════ */
export default function SectionC({ siteId, millData, capacityConfirmed }) {
  /**
   * Props:
   *   siteId            — cfi_sites.id (integer)
   *   millData          — { ffb, util, hrs, days } from SectionAB
   *   capacityConfirmed — boolean from SectionAB CONFIRM gate
   */

  /* ── Calculations (locked formulas) ─────────────────── */
  const calc = useMemo(() => {
    if (!millData?.ffb || !capacityConfirmed) return null;
    const ffb   = parseFloat(millData.ffb)  || 0;
    const util  = parseFloat(millData.util) || 85;
    const hrs   = parseFloat(millData.hrs)  || 20;
    const days  = parseFloat(millData.days) || 30;

    const monthly = ffb * (util / 100) * hrs * days;
    const efb     = monthly * 0.225;
    const opdc    = efb    * 0.152;   // LOCKED: 15.2% of EFB FW
    const pos     = monthly * 0.015;
    const pmf     = monthly * 0.145;
    const pome    = monthly * 0.30;

    return { monthly, efb, opdc, pos, pmf, pome };
  }, [millData, capacityConfirmed]);

  /* ── Auto-save calculated volumes to cfi_sites ───────── */
  useEffect(() => {
    if (!siteId || !calc) return;
    supabase.from("cfi_sites").update({
      monthly_ffb_t:  Math.round(calc.monthly),
      efb_volume_t:   Math.round(calc.efb),
      opdc_volume_t:  Math.round(calc.opdc),
      pos_volume_t:   Math.round(calc.pos),
      pmf_volume_t:   Math.round(calc.pmf),
      pome_volume_t:  Math.round(calc.pome),
    }).eq("id", siteId);
  }, [siteId, calc]);

  /* ── Render ──────────────────────────────────────────── */
  return (
    <div style={{
      background: T.navyCard,
      border: "1.5px solid rgba(0,201,177,0.13)",
      borderRadius: 11,
      overflow: "hidden",
      minWidth: 0,
    }}>

      {/* Section title */}
      <div style={{
        padding: "11px 16px 10px",
        fontFamily: F.syne, fontWeight: 700, fontSize: 15, color: T.teal,
        borderBottom: "1px solid rgba(64,215,197,0.12)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        C — Mill Monthly Results
      </div>
      <div style={{ fontSize: 13, color: T.greyLt, fontFamily: F.dm, padding: "5px 16px 7px" }}>
        Calculated From Mill Capacity Inputs
      </div>

      {/* c-body */}
      <div style={{
        padding: "15px 18px",
        display: "flex", flexDirection: "column",
        alignItems: "center", gap: 6,
      }}>

        {!capacityConfirmed ? (
          <div style={{
            fontFamily: F.dm, fontSize: 12, color: T.greyLt,
            textAlign: "center", padding: "20px 0",
          }}>
            Confirm Mill Capacity In Section B To See Results
          </div>
        ) : (
          <>
            {/* FFB Processed — green box, black text */}
            <div style={{
              background: T.green,
              border: `1.5px solid ${T.green}`,
              borderRadius: 9, padding: "12px 17px",
              textAlign: "center", width: "100%",
            }}>
              <div style={{ fontFamily: F.brand, fontWeight: 700, fontSize: 17, color: "#000000", marginBottom: 4 }}>
                FFB Processed
              </div>
              <div style={{ fontFamily: F.brand, fontWeight: 700, fontSize: 19, color: "#000000" }}>
                {fmt(calc?.monthly)}{" "}
                <span style={{ fontSize: 16, color: "#000000" }}>t / month</span>
              </div>
            </div>

            {/* Arrow */}
            <div style={{ fontSize: 24, color: T.grey, opacity: 0.85, fontWeight: 900, lineHeight: 1 }}>↓</div>

            {/* EFB Discharged — teal-dim box, amber text */}
            <div style={{
              background: T.tealDim,
              border: `1.5px solid ${T.tealBdr}`,
              borderRadius: 9, padding: "12px 17px",
              textAlign: "center", width: "100%",
            }}>
              <div style={{ fontFamily: F.brand, fontWeight: 700, fontSize: 17, color: T.amber, marginBottom: 4 }}>
                EFB Discharged
              </div>
              <div style={{ fontFamily: F.brand, fontWeight: 700, fontSize: 19, color: T.amber }}>
                {fmt(calc?.efb)}{" "}
                <span style={{ fontSize: 16, color: T.amber }}>t / month</span>
              </div>
            </div>

            {/* Sub label */}
            <div style={{
              fontSize: 11, fontWeight: 700, fontFamily: F.dm,
              color: T.grey, letterSpacing: "0.05em",
              width: "100%", textAlign: "center", marginTop: 10,
            }}>
              Additional CPO Mill Residues
            </div>

            {/* 2x2 residue grid */}
            <div style={{
              display: "grid", gridTemplateColumns: "1fr 1fr",
              gap: 8, width: "100%", marginTop: 8, alignItems: "stretch",
            }}>

              {/* Decanter Cake */}
              <div style={{
                background: T.tealDim, border: `1.5px solid ${T.tealBdr}`,
                borderRadius: 7, padding: "13px 9px", textAlign: "center",
              }}>
                <div style={{ fontFamily: F.brand, fontWeight: 700, fontSize: 17, color: T.amber, marginBottom: 4, lineHeight: 1.2 }}>
                  Decanter Cake
                </div>
                <div style={{ fontFamily: F.brand, fontWeight: 700, fontSize: 19, color: T.amber }}>
                  {fmt(calc?.opdc)}{" "}
                  <span style={{ fontSize: 16, color: T.amber }}>t / month</span>
                </div>
              </div>

              {/* Palm Oil Sludge */}
              <div style={{
                background: T.tealDim, border: `1.5px solid ${T.tealBdr}`,
                borderRadius: 7, padding: "13px 9px", textAlign: "center",
              }}>
                <div style={{ fontFamily: F.brand, fontWeight: 700, fontSize: 17, color: T.amber, marginBottom: 4, lineHeight: 1.2 }}>
                  Palm Oil Sludge
                </div>
                <div style={{ fontFamily: F.brand, fontWeight: 700, fontSize: 19, color: T.amber }}>
                  {fmt(calc?.pos)}{" "}
                  <span style={{ fontSize: 16, color: T.amber }}>t / month</span>
                </div>
              </div>

              {/* POME Liquid */}
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{
                  background: T.tealDim, border: `1.5px solid ${T.tealBdr}`,
                  borderRadius: 7, padding: "13px 9px", textAlign: "center",
                  flex: 1, display: "flex", flexDirection: "column", justifyContent: "center",
                }}>
                  <div style={{ fontFamily: F.brand, fontWeight: 700, fontSize: 17, color: T.amber, marginBottom: 4, lineHeight: 1.2 }}>
                    POME Liquid
                  </div>
                  <div style={{ fontFamily: F.brand, fontWeight: 700, fontSize: 19, color: T.amber }}>
                    {fmt(calc?.pome)}{" "}
                    <span style={{ fontSize: 16, color: T.amber }}>t / month</span>
                  </div>
                </div>
              </div>

              {/* Palm Mesocarp Fiber — grey card */}
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{
                  background: T.greyCard, border: `1.5px solid ${T.greyBdr}`,
                  borderRadius: 7, padding: "13px 9px", textAlign: "center",
                  flex: 1, display: "flex", flexDirection: "column", justifyContent: "center",
                }}>
                  <div style={{ fontFamily: F.brand, fontWeight: 700, fontSize: 17, color: T.amber, marginBottom: 4, lineHeight: 1.2 }}>
                    Palm Mesocarp Fiber
                  </div>
                  <div style={{ fontFamily: F.brand, fontWeight: 700, fontSize: 19, color: T.amber }}>
                    {fmt(calc?.pmf)}{" "}
                    <span style={{ fontSize: 16, color: T.amber }}>t / month</span>
                  </div>
                </div>
                <div style={{
                  fontSize: 11, fontFamily: F.mono, fontWeight: 700,
                  color: "rgba(245,166,35,0.85)", textAlign: "center", padding: "3px 6px",
                }}>
                  Does Mill Have Boiler?
                </div>
              </div>

            </div>
          </>
        )}
      </div>
    </div>
  );
}
