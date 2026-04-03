# LOVABLE INSTRUCTION — CREATE NEW FILE: CFI_Soil_Science_Module.jsx

## RULE: Do NOT modify App.jsx or any existing file. Create one new file only.

## Action
Create a new file at this exact path:
```
src/components/CFI_Soil_Science_Module.jsx
```

Paste the entire contents below into that file. Do not change anything.

---

import { useState, useEffect, useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, BarChart, Bar, Cell, ReferenceLine
} from "recharts";

// ═══════════════════════════════════════════════════════════════════════════════
// CFI SOIL SCIENCE MODULE
// SOM · CEC · WHC · Microbiome Recovery · N-P-K Balance
// Sources: cfi_soil_profiles · cfi_soil_coefficients · cfi_product_soil_response
// All coefficients are DATA GAP LDE placeholders until Supabase field trials.
// S3 Wave 2 N-fixer term: LOCKED AT ZERO (guardrail). Do not override.
// ═══════════════════════════════════════════════════════════════════════════════

const SUPA_URL = "https://lcpbtnipkvrmuwllymfw.supabase.co";
const SUPA_KEY = "sb_publishable_xJ9N0RaYXbY07m8DvtG_zQ_-m8Zzm23";

const C = {
  navy:"#060e1e", navyMid:"#0a1628", navyLt:"#0f2040",
  teal:"#14b8a6", tealLt:"#5eead4",
  amber:"#f59e0b", amberLt:"#fcd34d",
  green:"#22c55e", greenLt:"#86efac",
  blue:"#3b82f6",  blueLt:"#93c5fd",
  red:"#ef4444",   redLt:"#fca5a5",
  purple:"#a855f7",
  orange:"#f97316",
  grey:"#94a3b8",  greyLt:"#cbd5e1",
  white:"#e8f0fe",
};

const SOIL_COLORS = {
  ultisol: C.amber, inceptisol: C.teal, oxisol: C.orange,
  spodosol: C.grey, andisol: C.blue, histosol: C.purple,
};

// ── Static product parameters (replace with Supabase product table when BF+ loaded) ──
const PRODUCTS = {
  cp_plus: {
    id:"cp_plus", name:"CFI Compost+", tag:"S3·W1",
    color:C.green,
    om_pct:0.60, humic_c_pct:0.08, n_pct:0.020, p_pct:0.004, k_pct:0.018,
    chitin_pct:0.000, has_amf:false, defaultRate:20,
    note:"Bulk OM, humus formation, CEC building, structure & WHC. Apply 15–30 t/ha/yr.",
  },
  bf: {
    id:"bf", name:"CFI Biofertiliser", tag:"S5A·BF",
    color:C.teal,
    om_pct:0.587, humic_c_pct:0.02, n_pct:0.043, p_pct:0.030, k_pct:0.027,
    chitin_pct:0.054, has_amf:false, defaultRate:2,
    note:"BSF frass. Concentrated NPK, microbiome activation, chitin 5.4%. Apply 1–3 t/ha/yr.",
  },
  bf_plus: {
    id:"bf_plus", name:"CFI Biofertiliser+", tag:"S5B·BF+",
    color:C.amber,
    om_pct:0.620, humic_c_pct:0.12, n_pct:0.048, p_pct:0.034, k_pct:0.028,
    chitin_pct:0.080, has_amf:true, defaultRate:2,
    note:"Frass + whole terminated BSF. Higher protein, chitin 8%, BSF lipids 6% + AMF/PGPR inoculum.",
  },
};

const ET_DAILY_MM = 4.0; // oil palm evapotranspiration mm/day

function supaGet(table) {
  return fetch(SUPA_URL + "/rest/v1/" + table + "?order=id.asc", {
    headers:{
      "apikey": SUPA_KEY,
      "Authorization": "Bearer " + SUPA_KEY,
      "Content-Type": "application/json"
    }
  }).then(function(r) {
    if (!r.ok) throw new Error("HTTP " + r.status + " on " + table);
    return r.json();
  });
}

// ── Shared UI ────────────────────────────────────────────────────────────────

function Badge({text, color, size}) {
  var fs = size === "xs" ? 9 : 10;
  return (
    <span style={{
      background: color + "22", border: "1px solid " + color + "55",
      borderRadius: 10, padding: "1px 7px", color: color,
      fontSize: fs, fontWeight: 700, display: "inline-block",
      fontFamily: "'Courier New',monospace",
    }}>{text}</span>
  );
}

function DataGap() {
  return <Badge text="DATA GAP" color={C.grey} size="xs" />;
}

function AmberWarn({text}) {
  return (
    <div style={{
      background: C.amber + "18", border: "1px solid " + C.amber + "55",
      borderRadius: 6, padding: "6px 10px", fontSize: 10,
      color: C.amberLt, display: "flex", gap: 6, alignItems: "flex-start",
      lineHeight: 1.5,
    }}>
      <span style={{fontSize:13, flexShrink:0}}>{"⚠"}</span>
      <span>{text}</span>
    </div>
  );
}

function Card({children, style}) {
  return (
    <div style={Object.assign({}, {
      background: C.navyMid, borderRadius: 8,
      padding: "13px 15px", border: "1px solid " + C.teal + "1a",
    }, style || {})}>
      {children}
    </div>
  );
}

function SecHdr({label, color, sub}) {
  return (
    <div style={{marginBottom: 10}}>
      <div style={{
        fontSize: 11, fontWeight: 800, letterSpacing: "0.08em",
        color: color, textTransform: "uppercase",
      }}>{label}</div>
      {sub && (
        <div style={{fontSize: 9, color: C.grey, marginTop: 2}}>{sub}</div>
      )}
    </div>
  );
}

function KV({k, v, vc}) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems:"center",
      padding: "3px 0", borderBottom: "1px solid " + C.navyLt, fontSize: 10,
    }}>
      <span style={{color: C.grey}}>{k}</span>
      <span style={{color: vc || C.white, fontWeight: 700}}>{v}</span>
    </div>
  );
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────

export default function CFISoilScienceModule() {

  var [profiles, setProfiles] = useState([]);
  var [coeffs,   setCoeffs]   = useState([]);
  var [psrData,  setPsrData]  = useState([]);
  var [loading,  setLoading]  = useState(true);
  var [dbError,  setDbError]  = useState(null);

  var [soilKey,   setSoilKey]  = useState("ultisol");
  var [prodId,    setProdId]   = useState("bf_plus");
  var [rateHa,    setRateHa]   = useState(2);
  var [mineralN,  setMineralN] = useState(100);
  var [tab,       setTab]      = useState("som");

  // ── Load 3 Supabase tables ──
  useEffect(function() {
    Promise.all([
      supaGet("cfi_soil_profiles"),
      supaGet("cfi_soil_coefficients"),
      supaGet("cfi_product_soil_response"),
    ]).then(function(results) {
      setProfiles(results[0]);
      setCoeffs(results[1]);
      setPsrData(results[2]);
      setLoading(false);
    }).catch(function(e) {
      setDbError(e.message);
      setLoading(false);
    });
  }, []);

  var profile = useMemo(function() {
    return profiles.find(function(p) { return p.soil_key === soilKey; });
  }, [profiles, soilKey]);

  var coeff = useMemo(function() {
    return coeffs.find(function(c) { return c.soil_key === soilKey; });
  }, [coeffs, soilKey]);

  var psr = useMemo(function() {
    return psrData.find(function(r) {
      return r.soil_key === soilKey && r.product_id === prodId;
    });
  }, [psrData, soilKey, prodId]);

  var product = PRODUCTS[prodId];

  // ── All calculations ──
  var calc = useMemo(function() {
    if (!profile || !coeff || !psr || !product) return null;

    // Parse Supabase numeric strings
    function f(v, def) { return parseFloat(v) || def; }

    var om_ret  = f(coeff["om_retention_1yr_fract_" + prodId],  0.60);
    var hum_frc = f(coeff["humus_formation_fract_"  + prodId],  0.30);
    var decay   = f(coeff.decay_factor_annual,                  0.88);
    var cec_r   = f(coeff.cec_response_per_som_pct,             0.90);
    var humic_f = f(coeff.humic_cec_factor_cmol_kg,             300);
    var whc_r   = f(coeff.whc_response_mm_per_som_pct,          2.30);
    var n_rf    = f(coeff.n_leach_combined_rf,                  0.48);
    var p_rf    = f(coeff.p_fix_combined_rf,                    0.43);
    var k_rf    = f(coeff.k_leach_combined_rf,                  0.72);

    // Soil mass t/ha (0–25 cm)
    var bd = (f(profile.bd_degraded_g_cm3_low, 1.30) + f(profile.bd_degraded_g_cm3_high, 1.50)) / 2;
    var soil_mass = bd * 2500;

    // SOM annual humus addition
    var om_applied  = rateHa * product.om_pct;
    var om_retained = om_applied * om_ret;
    var humus_t_ha  = om_retained * hum_frc;
    var delta_som   = (humus_t_ha / soil_mass) * 100;

    // 5-yr SOM trajectory: SOM_n = SOM_0 + Δ × Σ(D^i, i=0..n-1)
    // (baseline SOM preserved; only added-OM accumulation decays)
    var som_0 = f(profile.som_degraded_pct_high, 1.5);
    var somTraj = [{ year:0, SOM:+som_0.toFixed(2), label:"Yr 0" }];
    var cumulative = 0;
    for (var y = 1; y <= 5; y++) {
      cumulative = cumulative * decay + delta_som;
      somTraj.push({
        year: y,
        SOM: +(som_0 + cumulative).toFixed(2),
        label: "Yr " + y,
      });
    }
    var som_y1 = somTraj[1].SOM;
    var delta_som_y1 = som_y1 - som_0;

    // CEC Year 1
    var cec_base       = f(profile.cec_degraded_cmol_high, 6.0);
    var delta_cec_som  = delta_som_y1 * cec_r;
    var humic_cec_add  = (rateHa * product.humic_c_pct * humic_f) / soil_mass;
    var cec_y1         = cec_base + delta_cec_som + humic_cec_add;

    // WHC
    var whc_ok     = coeff.whc_formula_applies !== false && coeff.whc_formula_applies !== "false";
    var delta_whc  = whc_ok ? delta_som_y1 * whc_r : null;
    var drought_days = delta_whc !== null ? delta_whc / ET_DAILY_MM : null;

    // N balance
    var n_leach_base    = f(profile.n_leach_fract_baseline, 0.35);
    var n_leach_cfi     = n_leach_base * (1 - n_rf);
    var n_from_mineral  = mineralN * (1 - n_leach_cfi);
    var n_from_product  = rateHa * product.n_pct * 1000 * 0.70;
    var n_fix_wave2     = 0.0; // GUARDRAIL LOCKED
    var n_available     = n_from_mineral + n_from_product + n_fix_wave2;

    // P
    var p_fix_base = f(profile.p_fix_fraction_baseline, 0.70);
    var p_fix_cfi  = p_fix_base * (1 - p_rf);

    // K
    var k_leach_base = f(profile.k_leach_fract_baseline, 0.20);
    var k_leach_cfi  = k_leach_base * (1 - k_rf);

    // MBC
    var mbc_r    = f(psr.mbc_response_mg_kg_per_t_ha, 18);
    var syn_f    = f(psr.mbc_synergy_factor, 0.12);
    var mbc_base = f(psr.mrs_mbc_degraded, 180);
    var mbc_tgt  = f(psr.mrs_mbc_target,   800);
    var mbc_y1   = mbc_base + rateHa * mbc_r * (1 + syn_f);
    var mbc_score = Math.min(100, Math.max(0, (mbc_y1 - mbc_base) / (mbc_tgt - mbc_base) * 100));

    // F:B
    var fb_base  = f(psr.mrs_fb_degraded, 0.20);
    var fb_tgt   = f(psr.mrs_fb_target,   0.80);
    var fb_alpha = f(psr.fb_ratio_alpha_coeff, 0.12);
    var fb_beta  = f(psr.fb_ratio_beta_coeff,  0.08);
    var fb_amf   = f(psr.fb_ratio_amf_contribution, 0.00);
    var fb_y1    = fb_base + fb_alpha * delta_som_y1 + fb_beta * product.chitin_pct + fb_amf;
    var fb_score = Math.min(100, Math.max(0, (fb_y1 - fb_base) / (fb_tgt - fb_base) * 100));

    // AMF
    var amf_inoc  = product.has_amf ? f(psr.amf_inoculation_effect_pct, 15) : 0;
    var amf_hab   = f(psr.amf_habitat_response_coeff, 0.08) * delta_som_y1 * 10;
    var amf_base  = f(psr.mrs_amf_degraded, 10);
    var amf_tgt   = f(psr.mrs_amf_target,   60);
    var amf_y1    = amf_base + amf_inoc + amf_hab;
    var amf_score = Math.min(100, Math.max(0, (amf_y1 - amf_base) / (amf_tgt - amf_base) * 100));

    // Enzyme
    var dh_factor  = f(psr.dehydrogenase_response_factor, 1.35);
    var enz_score  = Math.min(100, Math.max(0, (dh_factor - 1.0) / 1.50 * 100));

    // MRS composite (0–100)
    var mrs = 0.30 * mbc_score + 0.25 * fb_score + 0.25 * amf_score + 0.20 * enz_score;

    return {
      om_ret, hum_frc, decay, cec_r, humic_f, whc_r, n_rf, p_rf, k_rf,
      bd, soil_mass,
      om_applied, om_retained, humus_t_ha, delta_som,
      somTraj, som_0, som_y1, delta_som_y1,
      cec_base, delta_cec_som, humic_cec_add, cec_y1,
      whc_ok, delta_whc, drought_days,
      n_leach_base, n_leach_cfi, n_from_mineral, n_from_product,
      n_fix_wave2, n_available,
      p_fix_base, p_fix_cfi,
      k_leach_base, k_leach_cfi,
      mbc_base, mbc_y1, mbc_score,
      fb_base, fb_y1, fb_score,
      amf_base, amf_y1, amf_score,
      dh_factor, enz_score,
      mrs,
      psr_confidence: psr.confidence_overall || "LDE-LOW",
    };
  }, [profile, coeff, psr, product, prodId, rateHa, mineralN]);

  var soilColor = SOIL_COLORS[soilKey] || C.teal;

  // ── Loading / Error ──
  if (loading) {
    return (
      <div style={{
        background: C.navy, minHeight: "100vh",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: C.teal, fontFamily: "'Courier New',monospace", fontSize: 13,
      }}>
        {"⏳ Loading soil science data from Supabase..."}
      </div>
    );
  }

  if (dbError) {
    return (
      <div style={{
        background: C.navy, minHeight: "100vh", padding: 24,
        display: "flex", alignItems: "center", justifyContent: "center",
        color: C.red, fontFamily: "'Courier New',monospace", fontSize: 11,
      }}>
        {"⚠ Supabase error: " + dbError}
      </div>
    );
  }

  var TABS = [
    { id:"som",        label:"SOM · CEC · WHC" },
    { id:"microbiome", label:"Microbiome Recovery" },
    { id:"nutrients",  label:"Nutrient Balance" },
  ];

  return (
    <div style={{
      background: C.navy, minHeight: "100vh",
      fontFamily: "'Courier New',monospace", fontSize: 11, color: C.white,
    }}>

      {/* ── HEADER ── */}
      <div style={{
        background: "linear-gradient(135deg," + C.navyMid + ",#040a14)",
        borderBottom: "2px solid " + soilColor + "66",
        padding: "12px 18px",
      }}>
        <div style={{fontSize:8, color:C.teal, letterSpacing:"0.25em", marginBottom:3}}>
          {"CIRCULAR FERTILISER INDUSTRIES · BOGOR, WEST JAVA · SOIL SCIENCE MODULE · SUPABASE LIVE"}
        </div>
        <div style={{fontSize:17, fontWeight:900, letterSpacing:"-0.01em"}}>
          {"CFI SOIL SCIENCE CALCULATOR"}
        </div>
        <div style={{fontSize:9, color:C.grey, marginTop:2}}>
          {"SOM Trajectories · CEC & WHC Response · Microbiome Recovery Score · N–P–K Balance · S3 Wave 2 Architecture"}
        </div>
      </div>

      <div style={{padding:"14px 16px 0", display:"flex", flexDirection:"column", gap:12}}>

        {/* ── SOIL SELECTOR ── */}
        <div style={{display:"flex", gap:6, flexWrap:"wrap", alignItems:"center"}}>
          {profiles.map(function(p) {
            var sc = SOIL_COLORS[p.soil_key] || C.teal;
            var active = p.soil_key === soilKey;
            return (
              <div key={p.soil_key}
                onClick={function() { setSoilKey(p.soil_key); }}
                style={{
                  padding:"5px 13px", borderRadius:6, cursor:"pointer",
                  background: active ? sc + "33" : C.navyLt,
                  border: "1px solid " + (active ? sc : C.navyLt),
                  color: active ? sc : C.grey,
                  fontSize:10, fontWeight:700, transition:"all 0.1s",
                }}>
                {p.soil_key.toUpperCase()}
                {p.is_peat && (
                  <span style={{marginLeft:4, color:C.amber, fontSize:8}}>{"(PEAT)"}</span>
                )}
              </div>
            );
          })}
          <div style={{marginLeft:"auto", display:"flex", gap:10, alignItems:"center"}}>
            <span style={{fontSize:9, color:C.green}}>{"🟢 Supabase live"}</span>
            <span style={{fontSize:9, color:C.grey}}>
              {profiles.length + " soils · " + coeffs.length + " coeff sets · " + psrData.length + " PSR rows"}
            </span>
          </div>
        </div>

        {/* ── SOIL PROFILE + PRODUCT INPUTS ── */}
        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12}}>

          {profile && (
            <Card>
              <SecHdr label={profile.soil_group_name} color={soilColor}
                sub={(profile.local_name || "") + " · " + (profile.coverage_pct_indonesia || "–") + "% Indonesian palm land"} />
              <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:5, marginBottom:8}}>
                {[
                  ["pH (degraded)", profile.ph_degraded_low + "–" + profile.ph_degraded_high],
                  ["SOM (degraded)", profile.som_degraded_pct_low + "–" + profile.som_degraded_pct_high + "%"],
                  ["CEC (degraded)", profile.cec_degraded_cmol_low + "–" + profile.cec_degraded_cmol_high + " cmol/kg"],
                  ["N leach baseline", (parseFloat(profile.n_leach_fract_baseline) * 100).toFixed(0) + "%"],
                  ["P fixation", (parseFloat(profile.p_fix_fraction_baseline) * 100).toFixed(0) + "%"],
                  ["K leach baseline", (parseFloat(profile.k_leach_fract_baseline) * 100).toFixed(0) + "%"],
                ].map(function(item) {
                  return (
                    <div key={item[0]} style={{background:C.navyLt, borderRadius:4, padding:"5px 8px"}}>
                      <div style={{color:C.grey, fontSize:8}}>{item[0]}</div>
                      <div style={{color:C.white, fontWeight:700, fontSize:11}}>{item[1]}</div>
                    </div>
                  );
                })}
              </div>
              {profile.is_peat && (
                <AmberWarn text={"PEAT SPECIAL CASE: N mechanism = immobilisation (not leaching). WHC formula inactive — water table governs. GHG baseline ~85 t CO₂e/ha/yr. Subsidence 2–3 cm/yr. Lime PROHIBITED. Cu deficiency mandatory."} />
              )}
              {profile.soil_key === "andisol" && (
                <div style={{
                  marginTop:8, background:C.blue+"15", border:"1px solid "+C.blue+"44",
                  borderRadius:5, padding:"5px 8px", fontSize:9, color:C.blueLt,
                }}>
                  {"Andisol v3.2: all 22 gaps closed. CaSiO₃ co-amendment RF=0.15–0.25. BD response loop active. Highest P fixation (90%) in series. NOT previously in React — now loaded."}
                </div>
              )}
              <div style={{marginTop:6, display:"flex", gap:5, flexWrap:"wrap"}}>
                <Badge text={profile.confidence_level || "LDE-LOW"} color={soilColor} size="xs" />
              </div>
            </Card>
          )}

          <Card>
            <SecHdr label="Product & Application Rate" color={C.teal} />
            <div style={{display:"flex", gap:5, marginBottom:10}}>
              {Object.values(PRODUCTS).map(function(p) {
                var active = prodId === p.id;
                return (
                  <div key={p.id}
                    onClick={function() { setProdId(p.id); setRateHa(p.defaultRate); }}
                    style={{
                      flex:1, padding:"7px 5px", borderRadius:6,
                      cursor:"pointer", textAlign:"center",
                      background: active ? p.color + "33" : C.navyLt,
                      border: "1px solid " + (active ? p.color : C.navyLt),
                      color: active ? p.color : C.grey,
                      transition:"all 0.1s",
                    }}>
                    <div style={{fontSize:9, fontWeight:700}}>{p.name}</div>
                    <div style={{fontSize:8, color:C.grey, marginTop:2}}>{p.tag}</div>
                  </div>
                );
              })}
            </div>

            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:8}}>
              <div>
                <div style={{color:C.grey, fontSize:9, marginBottom:3}}>{"Application rate (t/ha/yr wet)"}</div>
                <input type="number" value={rateHa} min={0.5} max={50} step={0.5}
                  onChange={function(e) { setRateHa(parseFloat(e.target.value) || 2); }}
                  style={{
                    background:C.navyLt, border:"1px solid "+C.teal+"44",
                    borderRadius:4, color:C.white, padding:"5px 8px",
                    fontSize:13, fontWeight:700, width:"100%", outline:"none",
                    boxSizing:"border-box",
                  }} />
              </div>
              <div>
                <div style={{color:C.grey, fontSize:9, marginBottom:3}}>{"Mineral N (kg N/ha/yr)"}</div>
                <input type="number" value={mineralN} min={0} max={300} step={10}
                  onChange={function(e) { setMineralN(parseFloat(e.target.value) || 100); }}
                  style={{
                    background:C.navyLt, border:"1px solid "+C.amber+"44",
                    borderRadius:4, color:C.amberLt, padding:"5px 8px",
                    fontSize:13, fontWeight:700, width:"100%", outline:"none",
                    boxSizing:"border-box",
                  }} />
              </div>
            </div>

            {product && (
              <div style={{
                background:C.navyLt, borderRadius:4, padding:"6px 9px",
                fontSize:9, color:C.grey, marginBottom:8, lineHeight:1.5,
              }}>
                {product.note}
                {product.has_amf && (
                  <span style={{color:C.amber, marginLeft:4}}>{"Contains AMF/PGPR inoculum."}</span>
                )}
              </div>
            )}

            <AmberWarn text={"S3 Wave 2 N-Fixer: n_fix_wave2 = 0.0 kg N/ha/yr — LOCKED per guardrails. Structural term enabled, numeric effect disabled. DATA GAP — pending Supabase soil-stratified field trials (all 6 soils)."} />
          </Card>
        </div>

        {/* ── TABS ── */}
        <div style={{display:"flex", gap:4, borderBottom:"1px solid "+C.navyLt}}>
          {TABS.map(function(t) {
            var active = tab === t.id;
            return (
              <div key={t.id}
                onClick={function() { setTab(t.id); }}
                style={{
                  padding:"7px 16px", cursor:"pointer",
                  borderRadius:"6px 6px 0 0",
                  background: active ? C.navyLt : "transparent",
                  borderBottom: "2px solid " + (active ? soilColor : "transparent"),
                  color: active ? soilColor : C.grey,
                  fontSize:10, fontWeight:700, letterSpacing:"0.06em",
                  transition:"all 0.1s",
                }}>
                {t.label.toUpperCase()}
              </div>
            );
          })}
        </div>

        {/* ── TAB PANELS ── */}
        {calc && tab === "som" && (
          <SOMPanel calc={calc} profile={profile} coeff={coeff} soilColor={soilColor} />
        )}
        {calc && tab === "microbiome" && (
          <MicrobiomePanel calc={calc} psr={psr} profile={profile} soilColor={soilColor} />
        )}
        {calc && tab === "nutrients" && (
          <NutrientsPanel calc={calc} profile={profile} coeff={coeff} product={product}
            mineralN={mineralN} rateHa={rateHa} soilColor={soilColor} />
        )}

        {/* ── FOOTER ── */}
        <div style={{
          padding:"8px 10px", background:C.navyLt, borderRadius:6,
          fontSize:8, color:C.grey, lineHeight:1.8, marginBottom:24,
        }}>
          <span style={{color:C.teal, fontWeight:700}}>{"DATA SOURCES — "}</span>
          {"Supabase: cfi_soil_profiles · cfi_soil_coefficients · cfi_product_soil_response. "}
          {"All response coefficients are DATA GAP LDE placeholders until Supabase field trial data loaded. "}
          {"No external claims may be made using placeholder values. "}
          {"S3 Wave 2 N-fixer = 0 for all soils (guardrail locked). "}
          {"F:B alpha/beta = LDE-LOW (no palm-specific PLFA data anywhere). "}
          {"Peat WHC formula inactive — water table model required. "}
          {"Generated under CFI governance prompts 0–9. Expert panel review required before external use."}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB: SOM / CEC / WHC
// ═══════════════════════════════════════════════════════════════════════════════

function SOMPanel({calc, profile, coeff, soilColor}) {
  var somTarget = parseFloat(profile.som_target_pct_low || 2.5);
  var somTarget2 = parseFloat(profile.som_target_pct_high || 4.0);
  var cec_tgt_low  = parseFloat(profile.cec_target_cmol_low  || 10);

  return (
    <div style={{display:"flex", flexDirection:"column", gap:12}}>

      {/* SOM 5-yr Trajectory */}
      <Card>
        <SecHdr label="5-Year SOM Trajectory" color={soilColor}
          sub={"Formula: SOM_n = SOM_0 + ΔSOM × Σ(D^i, i=0..n-1) · Decay_Factor=" + calc.decay.toFixed(2) + " · ΔSOM_annual=" + calc.delta_som.toFixed(4) + "% · Soil_mass=" + calc.soil_mass.toFixed(0) + " t/ha"} />
        <div style={{height:220}}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={calc.somTraj} margin={{top:8, right:16, left:-10, bottom:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.navyLt} />
              <XAxis dataKey="label" tick={{fill:C.grey, fontSize:10}} />
              <YAxis tick={{fill:C.grey, fontSize:10}} domain={["auto","auto"]} />
              <Tooltip
                contentStyle={{background:C.navyMid, border:"1px solid "+soilColor+"44", fontSize:10}}
                formatter={function(v) { return [v.toFixed(2) + "%", "SOM"]; }} />
              <ReferenceLine y={somTarget} stroke={C.green} strokeDasharray="5 3"
                label={{value:"Target min " + somTarget + "%", fill:C.green, fontSize:9, position:"insideTopRight"}} />
              <Line type="monotone" dataKey="SOM" stroke={soilColor} strokeWidth={2.5}
                dot={{fill:soilColor, r:4, strokeWidth:0}} name="SOM %" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div style={{display:"flex", gap:8, marginTop:8, flexWrap:"wrap", alignItems:"center"}}>
          {[
            ["Year 1", calc.somTraj[1].SOM + "%"],
            ["Year 3", calc.somTraj[3].SOM + "%"],
            ["Year 5", calc.somTraj[5].SOM + "%"],
            ["Target range", somTarget + "–" + somTarget2 + "%"],
            ["OM retention", calc.om_ret.toFixed(2)],
            ["Humus fract", calc.hum_frc.toFixed(2)],
          ].map(function(item) {
            return (
              <div key={item[0]} style={{
                background:C.navyLt, borderRadius:4, padding:"4px 10px",
              }}>
                <div style={{color:C.grey, fontSize:8}}>{item[0]}</div>
                <div style={{color:soilColor, fontWeight:700, fontSize:12}}>{item[1]}</div>
              </div>
            );
          })}
          <DataGap />
        </div>
      </Card>

      {/* Formula Breakdown + CEC + WHC */}
      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12}}>

        {/* SOM Formula Breakdown */}
        <Card>
          <SecHdr label="SOM Formula Breakdown" color={soilColor} />
          <KV k="OM applied" v={(calc.om_applied).toFixed(2) + " t/ha"} vc={C.white} />
          <KV k={"× OM_retention (" + calc.om_ret.toFixed(2) + ")"} v={"→ " + calc.om_retained.toFixed(2) + " t/ha"} vc={C.greyLt} />
          <KV k={"× Humus_fract (" + calc.hum_frc.toFixed(2) + ")"} v={"→ " + calc.humus_t_ha.toFixed(3) + " t/ha"} vc={C.greyLt} />
          <KV k={"÷ Soil_mass (BD=" + calc.bd.toFixed(2) + ")"} v={calc.soil_mass.toFixed(0) + " t/ha"} vc={C.grey} />
          <div style={{
            marginTop:6, background:soilColor+"18", border:"1px solid "+soilColor+"44",
            borderRadius:4, padding:"6px 8px", textAlign:"center",
          }}>
            <div style={{color:C.grey, fontSize:8}}>{"ΔSOM Year 1"}</div>
            <div style={{color:soilColor, fontWeight:900, fontSize:16}}>
              {"+" + calc.delta_som.toFixed(4) + "%"}
            </div>
          </div>
          <div style={{marginTop:8}}>
            <DataGap />
            <span style={{marginLeft:6, color:C.grey, fontSize:9}}>{"coefficients pending field trials"}</span>
          </div>
        </Card>

        {/* CEC */}
        <Card>
          <SecHdr label="CEC Response — Year 1" color={C.blue} />
          <KV k="CEC baseline" v={calc.cec_base.toFixed(1) + " cmol/kg"} vc={C.white} />
          <KV k={"ΔCEC from SOM (×" + calc.cec_r.toFixed(2) + ")"} v={"+" + calc.delta_cec_som.toFixed(3) + " cmol/kg"} vc={C.blueLt} />
          <KV k={"ΔCEC from humics (Hf=" + calc.humic_f.toFixed(0) + ")"} v={"+" + calc.humic_cec_add.toFixed(3) + " cmol/kg"} vc={C.blueLt} />
          <div style={{
            marginTop:6, background:C.blue+"18", border:"1px solid "+C.blue+"44",
            borderRadius:4, padding:"6px 8px", textAlign:"center",
          }}>
            <div style={{color:C.grey, fontSize:8}}>{"CEC Year 1"}</div>
            <div style={{color:C.blue, fontWeight:900, fontSize:16}}>
              {calc.cec_y1.toFixed(2) + " cmol/kg"}
            </div>
          </div>
          <div style={{marginTop:6, fontSize:9, color:C.grey, lineHeight:1.5}}>
            {"Target: " + cec_tgt_low + "+ cmol/kg"}
          </div>
          <div style={{marginTop:5}}>
            <Badge text={"CEC_R = " + calc.cec_r.toFixed(2) + " cmol/kg per %SOM"} color={C.blue} size="xs" />
          </div>
        </Card>

        {/* WHC */}
        <Card>
          <SecHdr label="WHC Response — Year 1" color={C.green} />
          {calc.whc_ok ? (
            <div>
              <KV k="WHC_Response" v={parseFloat(coeff.whc_response_mm_per_som_pct || 2.3).toFixed(2) + " mm per %SOM"} vc={C.white} />
              <KV k="ΔSOM Year 1" v={"+" + calc.delta_som_y1.toFixed(4) + "%"} vc={C.greyLt} />
              <div style={{
                marginTop:6, background:C.green+"18", border:"1px solid "+C.green+"44",
                borderRadius:4, padding:"6px 8px", textAlign:"center",
              }}>
                <div style={{color:C.grey, fontSize:8}}>{"ΔWHC"}</div>
                <div style={{color:C.green, fontWeight:900, fontSize:16}}>
                  {calc.delta_whc !== null ? "+" + calc.delta_whc.toFixed(3) + " mm" : "N/A"}
                </div>
              </div>
              <div style={{
                marginTop:6, background:C.navyLt, borderRadius:4, padding:"5px 8px",
              }}>
                <div style={{color:C.grey, fontSize:8}}>{"Drought buffer days (ET=" + ET_DAILY_MM + " mm/d)"}</div>
                <div style={{color:C.greenLt, fontWeight:700, fontSize:13}}>
                  {calc.drought_days !== null ? "+" + calc.drought_days.toFixed(2) + " days" : "N/A"}
                </div>
              </div>
            </div>
          ) : (
            <AmberWarn text={"WHC mm/SOM formula INACTIVE for Peat/Histosol. Soil is already 24.5% organic C. WHC governed by water table depth — use water table management model."} />
          )}
          <div style={{marginTop:6}}>
            <DataGap />
          </div>
        </Card>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB: MICROBIOME RECOVERY
// ═══════════════════════════════════════════════════════════════════════════════

function MicrobiomePanel({calc, psr, profile, soilColor}) {
  var mrsColor = calc.mrs >= 70 ? C.green : calc.mrs >= 40 ? C.amber : C.red;
  var mrsLabel = calc.mrs >= 70 ? "GOOD" : calc.mrs >= 40 ? "RECOVERING" : "DEGRADED";

  var subScores = [
    { name:"MBC",    score:+calc.mbc_score.toFixed(0),  fill:C.teal,   w:"30%",
      from:calc.mbc_base.toFixed(0)+" mg C/kg", to:calc.mbc_y1.toFixed(0)+" mg C/kg", unit:"microbial biomass C" },
    { name:"F:B",    score:+calc.fb_score.toFixed(0),   fill:C.green,  w:"25%",
      from:calc.fb_base.toFixed(2), to:calc.fb_y1.toFixed(2), unit:"fungal:bacterial ratio" },
    { name:"AMF",    score:+calc.amf_score.toFixed(0),  fill:C.blue,   w:"25%",
      from:calc.amf_base.toFixed(0)+"%", to:calc.amf_y1.toFixed(0)+"%", unit:"root colonisation" },
    { name:"Enzyme", score:+calc.enz_score.toFixed(0),  fill:C.purple, w:"20%",
      from:"baseline", to:calc.dh_factor.toFixed(2)+"×", unit:"dehydrogenase" },
  ];

  var barData = subScores.map(function(s) {
    return { name:s.name, score:s.score, fill:s.fill };
  });

  return (
    <div style={{display:"flex", flexDirection:"column", gap:12}}>

      {/* MRS Composite */}
      <div style={{display:"grid", gridTemplateColumns:"180px 1fr", gap:12}}>

        <Card style={{textAlign:"center"}}>
          <SecHdr label="MRS Composite" color={soilColor} sub="0–100 score" />
          <div style={{
            fontSize:58, fontWeight:900, color:mrsColor,
            lineHeight:1.0, marginBottom:4, letterSpacing:"-2px",
          }}>
            {calc.mrs.toFixed(0)}
          </div>
          <div style={{color:C.grey, fontSize:9}}>{"/ 100"}</div>
          <div style={{
            marginTop:8, padding:"4px 10px", borderRadius:6,
            background:mrsColor+"22", color:mrsColor, fontSize:10, fontWeight:700,
          }}>
            {mrsLabel}
          </div>
          <div style={{
            marginTop:10, fontSize:8, color:C.grey, lineHeight:1.6, textAlign:"left",
          }}>
            {"0.30 × MBC"}<br />{"0.25 × F:B"}<br />{"0.25 × AMF"}<br />{"0.20 × Enzyme"}
          </div>
          <div style={{marginTop:6}}>
            <Badge text={calc.psr_confidence} color={mrsColor} size="xs" />
          </div>
        </Card>

        <Card>
          <SecHdr label="Sub-Score Breakdown (Year 1)" color={soilColor}
            sub="DATA GAP: All scores are LDE placeholders. F:B LDE-LOW (no palm PLFA data). Field validation required." />
          <div style={{height:160}}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical"
                margin={{top:0, right:40, left:36, bottom:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.navyLt} horizontal={false} />
                <XAxis type="number" domain={[0,100]} tick={{fill:C.grey, fontSize:9}} />
                <YAxis type="category" dataKey="name" tick={{fill:C.grey, fontSize:10}} width={36} />
                <Tooltip
                  contentStyle={{background:C.navyMid, border:"1px solid "+soilColor+"44", fontSize:10}}
                  formatter={function(v) { return [v.toFixed(0) + " / 100", "Score"]; }} />
                <Bar dataKey="score" radius={[0,4,4,0]} barSize={26}>
                  {barData.map(function(d, i) {
                    return <Cell key={i} fill={d.fill} />;
                  })}
                </Bar>
                <ReferenceLine x={70} stroke={C.green} strokeDasharray="4 2"
                  label={{value:"Good", fill:C.green, fontSize:8, position:"top"}} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Sub-score detail row */}
      <div style={{display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8}}>
        {subScores.map(function(s) {
          return (
            <Card key={s.name}>
              <div style={{
                color:s.fill, fontWeight:800, fontSize:11, marginBottom:6,
                display:"flex", justifyContent:"space-between", alignItems:"center",
              }}>
                <span>{s.name}</span>
                <span style={{
                  background:s.fill+"22", color:s.fill, fontSize:10,
                  padding:"1px 7px", borderRadius:10, fontWeight:700,
                }}>
                  {s.score + "/100"}
                </span>
              </div>
              <div style={{fontSize:9, color:C.grey, marginBottom:6}}>{s.unit}</div>
              <KV k="Degraded" v={s.from} vc={C.grey} />
              <KV k="Year 1"   v={s.to}   vc={s.fill} />
              <div style={{marginTop:7}}>
                <Badge text={s.name === "F:B" ? "LDE-LOW · PLFA required" : "LDE-LOW"} color={s.fill} size="xs" />
              </div>
            </Card>
          );
        })}
      </div>

      {/* S3 Wave 2 structural term */}
      <Card>
        <SecHdr label="S3 Wave 2 N-Fixer — Structural Term (All Soils)" color={C.amber} />
        <AmberWarn text={
          "n_fix_wave2_" + profile.soil_key + " = 0.0 kg N/ha/yr — GUARDRAIL LOCKED. " +
          "Mechanistic potential: " +
          (psr ? (psr.n_fix_wave2_potential_kg_n_ha_yr_low || 20) : 20) + "–" +
          (psr ? (psr.n_fix_wave2_potential_kg_n_ha_yr_high || 60) : 60) + " kg N/ha/yr " +
          "(" + (psr ? (psr.n_fix_wave2_organisms || "Azotobacter, Azospirillum") : "Azotobacter, Azospirillum") + "). " +
          "Wave 2 slot active=" + (psr ? String(psr.wave2_slot_active) : "false") + ". " +
          "Confidence: LDE-LOW. Priority: HIGH (all soils)."
        } />
        <div style={{
          marginTop:8, fontSize:9, color:C.grey, lineHeight:1.7,
          background:C.navyLt, borderRadius:4, padding:"7px 10px",
        }}>
          {"Formula structure (addendum applied — all soils): N_bio_total = N_fix_Wave1 + N_fix_Wave2_[Soil]. "}
          {"N_available = N_mineral × (1−f_leach) × (1−f_volat) + N_organic_CFI × η_organic + N_bio_total. "}
          {"Required actions: (1) Design soil-stratified trials with ¹⁵N or mass-balance tracking. "}
          {"(2) Fit N_fix_Wave2_[Soil] per soil order. (3) Store in Supabase soil_coefficients. "}
          {"(4) Update calculators from 0 to fitted values with full expert-panel sign-off only."}
        </div>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB: NUTRIENT BALANCE
// ═══════════════════════════════════════════════════════════════════════════════

function NutrientsPanel({calc, profile, coeff, product, mineralN, rateHa, soilColor}) {
  var nBarData = [
    { name:"No CFI", lost:+(calc.n_leach_base * 100).toFixed(0), fill:C.red },
    { name:"With CFI", lost:+(calc.n_leach_cfi * 100).toFixed(0), fill:C.green },
  ];
  var pBarData = [
    { name:"No CFI", fixed:+(calc.p_fix_base * 100).toFixed(0), fill:C.red },
    { name:"With CFI", fixed:+(calc.p_fix_cfi * 100).toFixed(0), fill:C.green },
  ];

  var isSandy = profile.soil_key === "spodosol";
  var isAndisol = profile.soil_key === "andisol";
  var isPeat = profile.is_peat;

  return (
    <div style={{display:"flex", flexDirection:"column", gap:12}}>

      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12}}>

        {/* N Balance */}
        <Card>
          <SecHdr label="N Balance — Year 1" color={C.teal}
            sub={"N_avail = N_mineral×(1−f_leach) + N_CFI×0.70 + N_fix_Wave2(=0) · RF=" + calc.n_rf.toFixed(3)} />
          <div style={{height:140}}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={nBarData} margin={{top:5, right:10, left:-10, bottom:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.navyLt} />
                <XAxis dataKey="name" tick={{fill:C.grey, fontSize:9}} />
                <YAxis domain={[0,100]} tick={{fill:C.grey, fontSize:9}} />
                <Tooltip
                  contentStyle={{background:C.navyMid, border:"1px solid "+C.teal+"44", fontSize:10}}
                  formatter={function(v, n, props) { return [v + "% of N applied", "N leached"]; }} />
                <Bar dataKey="lost" radius={[4,4,0,0]} barSize={45}>
                  {nBarData.map(function(d, i) { return <Cell key={i} fill={d.fill} />; })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:5, marginTop:6, fontSize:10}}>
            {[
              ["Mineral N applied",  mineralN + " kg/ha",           C.white],
              ["N leach (baseline)", (calc.n_leach_base*100).toFixed(0)+"%",   C.red],
              ["N leach (with CFI)", (calc.n_leach_cfi*100).toFixed(0)+"%",    C.green],
              ["N from product",     calc.n_from_product.toFixed(0)+" kg/ha",  C.teal],
              ["N_fix_Wave2",        "0.0 kg/ha ⚠",                 C.amber],
              ["N available total",  calc.n_available.toFixed(0)+" kg/ha",     C.tealLt],
            ].map(function(item) {
              return (
                <div key={item[0]} style={{background:C.navyLt, borderRadius:3, padding:"4px 7px"}}>
                  <div style={{color:C.grey, fontSize:8}}>{item[0]}</div>
                  <div style={{color:item[2], fontWeight:700}}>{item[1]}</div>
                </div>
              );
            })}
          </div>
          {isPeat && (
            <div style={{marginTop:8}}>
              <AmberWarn text={"PEAT: N mechanism = immobilisation (not leaching). N reduction factors model immobilisation risk reduction, not leaching. Separate peat N formula required."} />
            </div>
          )}
        </Card>

        {/* P Fixation */}
        <Card>
          <SecHdr label="P Fixation Reduction" color={C.amber}
            sub={isSandy ? "Sandy soils: P LEACHES — fix RFs inactive. Banded application only." : "Eff_P = P_applied × (1 − P_fix × (1 − RF)) · RF=" + calc.p_rf.toFixed(3)} />
          <div style={{height:140}}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pBarData} margin={{top:5, right:10, left:-10, bottom:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.navyLt} />
                <XAxis dataKey="name" tick={{fill:C.grey, fontSize:9}} />
                <YAxis domain={[0,100]} tick={{fill:C.grey, fontSize:9}} />
                <Tooltip
                  contentStyle={{background:C.navyMid, border:"1px solid "+C.amber+"44", fontSize:10}}
                  formatter={function(v) { return [v + "% of P fixed", "P fixation"]; }} />
                <Bar dataKey="fixed" radius={[4,4,0,0]} barSize={45}>
                  {pBarData.map(function(d, i) { return <Cell key={i} fill={d.fill} />; })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:5, marginTop:6}}>
            {[
              ["P fix baseline",  (calc.p_fix_base*100).toFixed(0)+"%",   C.red],
              ["P fix with CFI",  (calc.p_fix_cfi*100).toFixed(0)+"%",    C.green],
              ["Combined P_RF",   parseFloat(coeff.p_fix_combined_rf||0.43).toFixed(3), C.amber],
              [isSandy ? "P leach fract" : isAndisol ? "CaSiO₃ RF@2.5t" : "AMF P_RF",
               isSandy ? (parseFloat(profile.p_leach_fract_baseline||0.20)*100).toFixed(0)+"%" :
               isAndisol ? "0.15 (confirmed)" :
               parseFloat(coeff.p_fix_rf_amf||0.85).toFixed(2),
               C.teal],
            ].map(function(item) {
              return (
                <div key={item[0]} style={{background:C.navyLt, borderRadius:3, padding:"4px 7px", fontSize:10}}>
                  <div style={{color:C.grey, fontSize:8}}>{item[0]}</div>
                  <div style={{color:item[2], fontWeight:700}}>{item[1]}</div>
                </div>
              );
            })}
          </div>
          {isAndisol && (
            <div style={{
              marginTop:8, background:C.blue+"12", border:"1px solid "+C.blue+"33",
              borderRadius:4, padding:"6px 8px", fontSize:9, color:C.blueLt, lineHeight:1.5,
            }}>
              {"Andisol ONLY: CaSiO₃ co-amendment is PRIMARY P intervention. RF=0.15 @2.5 t/ha; RF=0.25 @4.5 t/ha. Lembang study confirmed 12× reduction in P bonding energy. Combined CFI+silicate achieves 47–53% effective P from 10% untreated baseline."}
            </div>
          )}
          {isSandy && (
            <AmberWarn text={"Sandy soils: P LEACHES (not fixes). p_leach_fract_baseline=0.20. P_fix_RF set to 1.0 (inactive). Banded P application ONLY — broadcast loses >50% to leaching."} />
          )}
        </Card>
      </div>

      {/* K Leaching */}
      <Card>
        <SecHdr label="K Leaching Summary" color={C.blue}
          sub={"K_leach_baseline = " + (parseFloat(profile.k_leach_fract_baseline||0.20)*100).toFixed(0) + "% · Combined_RF = " + parseFloat(coeff.k_leach_combined_rf||0.72).toFixed(3) + " · K_leach_with_CFI = " + (calc.k_leach_cfi*100).toFixed(0) + "%"} />
        <div style={{display:"flex", gap:10, flexWrap:"wrap", alignItems:"center"}}>
          {[
            ["K leach baseline", (calc.k_leach_base*100).toFixed(0)+"%",                        C.red],
            ["K leach with CFI", (calc.k_leach_cfi*100).toFixed(0)+"%",                         C.green],
            ["K improvement",    ((calc.k_leach_base - calc.k_leach_cfi)*100).toFixed(0)+"pp",   C.teal],
            ["RF_CP+",           parseFloat(coeff.k_leach_rf_cp||0.85).toFixed(2),              C.greyLt],
            ["RF_BF+",           parseFloat(coeff.k_leach_rf_bfplus||0.80).toFixed(2),          C.amber],
          ].map(function(item) {
            return (
              <div key={item[0]} style={{background:C.navyLt, borderRadius:4, padding:"6px 12px"}}>
                <div style={{color:C.grey, fontSize:8}}>{item[0]}</div>
                <div style={{color:item[2], fontWeight:700, fontSize:13}}>{item[1]}</div>
              </div>
            );
          })}
          <DataGap />
        </div>
        {isPeat && (
          <div style={{marginTop:8}}>
            <AmberWarn text={"PEAT: K demand is highest of all soils. K leaches rapidly on drained peat. K supply and Cu deficiency correction are the PRIMARY CFI value propositions on Histosols — NOT P fixation or N leaching."} />
          </div>
        )}
      </Card>

      {/* Export data block */}
      <Card>
        <SecHdr label="Export Interface" color={C.grey}
          sub="Values ready for AG Management Calculator and Fertiliser Calculator" />
        <div style={{display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8, fontSize:9}}>
          {[
            ["N available (yr1)", calc.n_available.toFixed(0)+" kg/ha",    C.teal],
            ["P fix fraction",    (calc.p_fix_cfi*100).toFixed(0)+"%",     C.amber],
            ["K leach fraction",  (calc.k_leach_cfi*100).toFixed(0)+"%",   C.blue],
            ["SOM year 1",        calc.somTraj[1].SOM+"%",                 soilColor],
            ["CEC year 1",        calc.cec_y1.toFixed(2)+" cmol/kg",       C.blue],
            ["WHC delta",         calc.whc_ok && calc.delta_whc !== null ? "+" + calc.delta_whc.toFixed(3)+" mm" : "N/A", C.green],
            ["MRS score",         calc.mrs.toFixed(0)+" /100",             calc.mrs>=70?C.green:calc.mrs>=40?C.amber:C.red],
            ["Wave2 N-fix",       "0.0 kg/ha ⚠",                          C.amber],
          ].map(function(item) {
            return (
              <div key={item[0]} style={{background:C.navyLt, borderRadius:4, padding:"6px 8px"}}>
                <div style={{color:C.grey, fontSize:8}}>{item[0]}</div>
                <div style={{color:item[2], fontWeight:700, fontSize:11}}>{item[1]}</div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

---
## After creating the file, confirm it exists and compiles with zero errors.
## Do NOT auto-import it into App.jsx — that is a separate instruction.
