// CFI_S0_SectionAB.jsx — COMPLETE REBUILD
// Supabase: cfi_mill_owners, cfi_mills_60tph, cfi_estates, cfi_province_soil_lookup,
//           cfi_mill_soil_acidity, weather_cache, cfi_scenarios, cfi_sites
// RPC: get_soil_acidity_class(lat, lon)
// Design: CFI v3 — Syne 700 titles, DM Sans labels, DM Mono numbers

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────
const C = {
  navyMid: "#153352",
  navyLt:  "#1A3A5C",
  teal:    "#00C9B1",
  amber:   "#F5A623",
  red:     "#E84040",
  green:   "#3DCB7A",
  blue:    "#4A9EDB",
  grey:    "#8BA0B4",
  greyLt:  "#C4D3E0",
  greyMd:  "#A8B8C7",
  border:  "#1E6B8C",
  black:   "#060C14",
};
const T = {
  syne: "'Syne', sans-serif",
  dm:   "'DM Sans', sans-serif",
  mono: "'DM Mono', monospace",
};

const IDN_PROVINCES = [
  "I Will Enter Manually",
  "Aceh","Bali","Banten","Bengkulu","DI Yogyakarta","DKI Jakarta",
  "Gorontalo","Jambi","Jawa Barat","Jawa Tengah","Jawa Timur",
  "Kalimantan Barat","Kalimantan Selatan","Kalimantan Tengah",
  "Kalimantan Timur","Kalimantan Utara","Kepulauan Bangka Belitung",
  "Kepulauan Riau","Lampung","Maluku","Maluku Utara",
  "Nusa Tenggara Barat","Nusa Tenggara Timur","Papua","Papua Barat",
  "Riau","Sulawesi Barat","Sulawesi Selatan","Sulawesi Tengah",
  "Sulawesi Tenggara","Sulawesi Utara","Sumatera Barat",
  "Sumatera Selatan","Sumatera Utara",
];

// ─── STYLES ──────────────────────────────────────────────────────────────────
const S = {
  panel: {
    background: C.navyLt,
    border: `1.5px solid ${C.border}`,
    borderRadius: 8,
    padding: "20px 24px",
  },
  title: {
    fontFamily: T.syne, fontWeight: 700, fontSize: 18,
    color: C.teal, marginBottom: 16, lineHeight: 1.3,
  },
  label: {
    fontFamily: T.dm, fontWeight: 600, fontSize: 13,
    color: C.grey, marginBottom: 4, display: "block",
  },
  sub: {
    fontFamily: T.dm, fontWeight: 400, fontSize: 11,
    color: C.grey, marginTop: 3, display: "block",
  },
  input: {
    background: "#000000", border: "1px solid rgba(168,189,208,0.20)",
    borderRadius: 7, color: "#E8F0FE", fontFamily: "'DM Sans', sans-serif",
    fontWeight: 700, fontSize: 14, padding: "10px 13px",
    width: "100%", boxSizing: "border-box", outline: "none", minHeight: 42,
  },
  zone: {
    background: C.black, borderRadius: 8,
    padding: "16px 18px", marginTop: 12,
  },
  drop: {
    position: "absolute", top: "100%", left: 0, right: 0,
    background: C.navyMid, border: `1px solid ${C.border}`,
    borderRadius: 6, zIndex: 200, maxHeight: 200,
    overflowY: "auto", marginTop: 2,
  },
};

const fmt = (n) => n > 0
  ? n.toLocaleString("en-US", { maximumFractionDigits: 0 }) : "—";

// ─── DROPDOWN COMPONENT ──────────────────────────────────────────────────────
function Drop({ opts, onSelect }) {
  const [hov, setHov] = useState(null);
  return (
    <div style={S.drop}>
      {opts.map((o, i) => (
        <div
          key={i}
          style={{
            padding: "8px 12px", cursor: "pointer",
            background: hov === i ? "rgba(0,201,177,0.08)" : "transparent",
            borderBottom: `1px solid rgba(30,107,140,0.3)`,
          }}
          onMouseEnter={() => setHov(i)}
          onMouseLeave={() => setHov(null)}
          onMouseDown={() => onSelect(o)}
        >
          <div style={{ fontFamily: T.dm, fontSize: 13,
            color: hov === i ? C.teal : C.greyLt }}>{o.label}</div>
          {o.sub && (
            <div style={{ fontFamily: T.dm, fontSize: 11,
              color: C.grey, marginTop: 2 }}>{o.sub}</div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function SectionAB({ onSiteConfirmed, siteId, setSiteId }) {

  // ── Section A state ──────────────────────────────────────────────────────
  const [companyName,     setCompanyName]     = useState("");
  const [companyOpts,     setCompanyOpts]     = useState([]);
  const [showCo,          setShowCo]          = useState(false);

  const [estateName,      setEstateName]      = useState("");
  const [estateOpts,      setEstateOpts]      = useState([]);
  const [showEstate,      setShowEstate]      = useState(false);
  const [estateArea,      setEstateArea]      = useState("");

  const [millName,        setMillName]        = useState("");
  const [millOpts,        setMillOpts]        = useState([]);
  const [showMill,        setShowMill]        = useState(false);

  const [district,        setDistrict]        = useState("");
  const [province,        setProvince]        = useState("I Will Enter Manually");
  const [gpsLat,          setGpsLat]          = useState("");
  const [gpsLng,          setGpsLng]          = useState("");

  const [soilConfirmed,   setSoilConfirmed]   = useState(null);  // from cfi_mills_60tph
  const [soilSuggestion,  setSoilSuggestion]  = useState(null);  // from cfi_province_soil_lookup
  const [acidityResult,   setAcidityResult]   = useState(null);  // from get_soil_acidity_class RPC
  const [weather,         setWeather]         = useState(null);
  const [weatherNote,     setWeatherNote]     = useState("");
  const [suggestions,     setSuggestions]     = useState([]);    // from cfi_scenarios
  const [siteOK,          setSiteOK]          = useState(false);

  // ── Section B state ──────────────────────────────────────────────────────
  const [ffb,     setFfb]     = useState("");
  const [util,    setUtil]    = useState("85");
  const [hrs,     setHrs]     = useState("24");
  const [days,    setDays]    = useState("30");
  const [confirmed, setConfirmed] = useState(false);
  const [saving,    setSaving]    = useState(false);

  // ── Computed ─────────────────────────────────────────────────────────────
  const effFFB      = (parseFloat(ffb)  || 0) * ((parseFloat(util) || 0) / 100);
  const monthlyFFB  = effFFB * (parseFloat(hrs) || 0) * (parseFloat(days) || 0);
  const monthlyEFB  = monthlyFFB * 0.225;
  const monthlyOPDC = monthlyEFB  * 0.152;
  const bValid      = ffb && util && hrs && days;

  // ── Site completeness ────────────────────────────────────────────────────
  useEffect(() => {
    setSiteOK(companyName.trim() && millName.trim() && district.trim());
  }, [companyName, millName, district]);

  // ── Load CFI suggestions on mount ────────────────────────────────────────
  // SOURCE: cfi_scenarios WHERE scenario_type = 'cfi_suggestion'
  useEffect(() => {
    supabase
      .from("cfi_scenarios")
      .select("id, suggestion_title, suggestion_reason, projected_npk_uplift_pct, soil_type")
      .eq("scenario_type", "cfi_suggestion")
      .then(({ data }) => setSuggestions(data || []));
  }, []);

  // ── STEP 1: Company autocomplete ─────────────────────────────────────────
  // SOURCE: cfi_mill_owners.company + cfi_mills_60tph.owner_company
  useEffect(() => {
    if (companyName.length < 2) { setCompanyOpts([]); setShowCo(false); return; }
    const t = setTimeout(async () => {
      const [r1, r2] = await Promise.all([
        supabase.from("cfi_mill_owners").select("company")
          .ilike("company", `%${companyName}%`).limit(8),
        supabase.from("cfi_mills_60tph").select("owner_company")
          .ilike("owner_company", `%${companyName}%`).limit(8),
      ]);
      const names = new Set([
        ...((r1.data || []).map(r => r.company)),
        ...((r2.data || []).map(r => r.owner_company)),
      ].filter(Boolean));
      setCompanyOpts([
        { label: "I Will Enter Manually", value: "" },
        ...[...names].map(n => ({ label: n, value: n })),
      ]);
      setShowCo(true);
    }, 300);
    return () => clearTimeout(t);
  }, [companyName]);

  // ── STEP 2: Load estates for selected company ─────────────────────────────
  // SOURCE: cfi_estates WHERE owner_company = company
  const loadEstates = useCallback(async (company) => {
    if (!company) return;
    const { data } = await supabase.from("cfi_estates")
      .select("estate_name, area_ha, district_kabupaten, province, latitude, longitude")
      .eq("owner_company", company).order("estate_name");
    if (data?.length > 0) {
      setEstateOpts([
        { label: "I Will Enter Manually", value: null },
        ...data.map(e => ({
          label: e.estate_name,
          sub: `${e.district_kabupaten || ""} · ${e.area_ha ? e.area_ha + " ha" : ""}`,
          value: e,
        })),
      ]);
    }
  }, []);

  // ── STEP 3: Mill search ──────────────────────────────────────────────────
  // SOURCE: cfi_mills_60tph (filtered by company if known)
  useEffect(() => {
    if (millName.length < 2) { setMillOpts([]); setShowMill(false); return; }
    const t = setTimeout(async () => {
      let q = supabase.from("cfi_mills_60tph")
        .select("mill_name, owner_company, district_kabupaten, province, latitude, longitude, confirmed_soil_type")
        .ilike("mill_name", `%${millName}%`).limit(12);
      if (companyName && companyName !== "I Will Enter Manually")
        q = q.eq("owner_company", companyName);
      const { data } = await q;
      setMillOpts([
        { label: "I Will Enter Manually", value: null },
        ...((data || []).map(m => ({
          label: m.mill_name,
          sub: `${m.district_kabupaten || ""} · ${m.province || ""}`,
          value: m,
        }))),
      ]);
      setShowMill(true);
    }, 300);
    return () => clearTimeout(t);
  }, [millName, companyName]);

  // ── STEP 4: Mill selected — auto-fill all fields ─────────────────────────
  // SOURCE: cfi_mills_60tph row fields
  const selectMill = (opt) => {
    setShowMill(false);
    if (!opt.value) { setMillName(""); return; }
    const m = opt.value;
    setMillName(m.mill_name);
    if (m.district_kabupaten) setDistrict(m.district_kabupaten);
    if (m.province)           setProvince(m.province);
    if (m.latitude)           setGpsLat(String(m.latitude));
    if (m.longitude)          setGpsLng(String(m.longitude));
    if (m.confirmed_soil_type) setSoilConfirmed(m.confirmed_soil_type);
  };

  // ── STEP 5: Soil acidity lookup on GPS ──────────────────────────────────
  // SOURCE 1: cfi_mill_soil_acidity (cache by mill name)
  // SOURCE 2: RPC get_soil_acidity_class(lat, lon) → 35,894 grid points
  // WRITES TO: cfi_mill_soil_acidity
  useEffect(() => {
    const lat = parseFloat(gpsLat), lng = parseFloat(gpsLng);
    if (!lat || !lng || isNaN(lat) || isNaN(lng)) return;
    const run = async () => {
      // Check mill cache first
      if (millName) {
        const { data: cached } = await supabase
          .from("cfi_mill_soil_acidity")
          .select("acidity_class, lookup_distance_km")
          .eq("mill_name", millName).single();
        if (cached) { setAcidityResult(cached); return; }
      }
      // Call RPC
      const { data } = await supabase.rpc("get_soil_acidity_class", {
        p_lat: lat, p_lon: lng, p_max_distance_km: 25,
      });
      if (data?.[0]) {
        setAcidityResult(data[0]);
        // Save to mill cache if mill name known
        if (millName) {
          await supabase.from("cfi_mill_soil_acidity").upsert({
            mill_name: millName, mill_lat: lat, mill_lon: lng,
            acidity_class: data[0].acidity_class,
            lookup_distance_km: data[0].distance_km,
          }, { onConflict: "mill_name" });
        }
      }
    };
    run();
  }, [gpsLat, gpsLng, millName]);

  // ── STEP 6: Weather — cache check then API fetch ─────────────────────────
  // SOURCE: weather_cache (location_key = lat_lon to 2dp)
  // FALLBACK: Open-Meteo API (free, no key)
  // WRITES TO: weather_cache
  useEffect(() => {
    const lat = parseFloat(gpsLat), lng = parseFloat(gpsLng);
    if (!lat || !lng || isNaN(lat) || isNaN(lng)) return;
    const run = async () => {
      const key = `${lat.toFixed(2)}_${lng.toFixed(2)}`;
      // Check cache
      const { data: cached } = await supabase
        .from("weather_cache").select("*").eq("location_key", key).single();
      if (cached) {
        const mo = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"];
        setWeather({
          temp: mo.map(m => cached[`temp_${m}`]),
          rain: mo.map(m => cached[`rain_${m}`]),
        });
        setWeatherNote(`Cached · ${new Date(cached.fetched_at).toLocaleDateString("en-US",{month:"short",year:"numeric"})}`);
        return;
      }
      // Fetch Open-Meteo
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}` +
          `&monthly=temperature_2m_mean,precipitation_sum&timezone=Asia%2FJakarta&forecast_months=12`;
        const json = await (await fetch(url)).json();
        if (!json.monthly) return;
        const wx = {
          temp: json.monthly.temperature_2m_mean,
          rain: json.monthly.precipitation_sum,
        };
        setWeather(wx);
        setWeatherNote(`Live · ${new Date().toLocaleDateString("en-US",{month:"short",year:"numeric"})}`);
        // Save to cache
        const mo = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"];
        const row = {
          location_key: key, gps_lat: lat, gps_lng: lng,
          province: province !== "I Will Enter Manually" ? province : null,
          source: "open-meteo", fetched_at: new Date().toISOString(),
        };
        mo.forEach((m, i) => {
          row[`temp_${m}`] = wx.temp?.[i] ?? null;
          row[`rain_${m}`] = wx.rain?.[i] ?? null;
        });
        await supabase.from("weather_cache").insert(row);
      } catch { /* non-blocking */ }
    };
    run();
  }, [gpsLat, gpsLng]);

  // ── STEP 7: Province → soil suggestion ──────────────────────────────────
  // SOURCE: cfi_province_soil_lookup WHERE province = selected
  useEffect(() => {
    if (!province || province === "I Will Enter Manually") return;
    supabase.from("cfi_province_soil_lookup")
      .select("dominant_soil_wrb, secondary_soil_wrb, peat_present, ph_min, ph_max")
      .eq("province", province).single()
      .then(({ data }) => { if (data) setSoilSuggestion(data); });
  }, [province]);

  // ── STEP 8: CONFIRM — upsert cfi_sites ──────────────────────────────────
  // WRITES ALL S0 A+B fields to cfi_sites
  const handleConfirm = async () => {
    if (!bValid) return;
    setSaving(true);
    const row = {
      industry_id:          1,
      company_name:         companyName || null,
      estate_name:          estateName  || null,
      estate_area_ha:       estateArea ? parseFloat(estateArea) : null,
      mill_name:            millName    || null,
      district:             district    || null,
      province:             province !== "I Will Enter Manually" ? province : null,
      gps_lat:              gpsLat  ? parseFloat(gpsLat)  : null,
      gps_lng:              gpsLng  ? parseFloat(gpsLng)  : null,
      ffb_capacity_tph:     parseFloat(ffb),
      utilisation_pct:      parseFloat(util),
      operating_hrs_day:    parseFloat(hrs),
      operating_days_month: parseFloat(days),
      monthly_ffb_t:        monthlyFFB,
      capacity_confirmed:   true,
      session_date:         new Date().toISOString(),
    };
    const result = siteId
      ? await supabase.from("cfi_sites").update(row).eq("id", siteId).select().single()
      : await supabase.from("cfi_sites").insert(row).select().single();
    setSaving(false);
    if (result?.data) {
      setSiteId?.(result.data.id);
      setConfirmed(true);
      // Fire callback — everything downstream sections need
      onSiteConfirmed?.({
        ...row,
        id:             result.data.id,
        monthlyFFB,     monthlyEFB,     monthlyOPDC,    effFFB,
        soilConfirmed,  // cfi_mills_60tph.confirmed_soil_type → pre-selects Section C
        soilSuggestion, // cfi_province_soil_lookup → suggests Section C
        acidityResult,  // get_soil_acidity_class RPC → adjusts NPK multipliers Section F
        weather,        // 12-month grid → feeds S4 GH, BSF rearing calcs
      });
    }
  };

  // ─── RENDER ──────────────────────────────────────────────────────────────
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 16, marginBottom: 16 }}>

      {/* ═══════════════════════════════════
          SECTION A — SITE IDENTITY
      ═══════════════════════════════════ */}
      <div style={S.panel}>
        <div style={S.title}>A — Enter Your Site Details Below</div>

        <div style={S.zone}>

          {/* 1. Company Name — searches cfi_mill_owners + cfi_mills_60tph */}
          <div style={{ position: "relative", marginBottom: 14 }}>
            <label style={S.label}>Plantation / Company Name</label>
            <input style={S.input} value={companyName}
              placeholder="Type to search or enter manually..."
              onChange={e => setCompanyName(e.target.value)}
              onFocus={() => companyOpts.length > 0 && setShowCo(true)}
              onBlur={() => setTimeout(() => setShowCo(false), 200)} />
            {showCo && companyOpts.length > 0 && (
              <Drop opts={companyOpts} onSelect={opt => {
                setCompanyName(opt.value || "");
                setShowCo(false);
                if (opt.value) loadEstates(opt.value);
              }} />
            )}
          </div>

          {/* 2. Estate Name — populated from cfi_estates after company selected */}
          <div style={{ position: "relative", marginBottom: 14 }}>
            <label style={S.label}>Estate Name</label>
            <input style={S.input} value={estateName}
              placeholder={estateOpts.length > 1 ? "Select or enter manually..." : "Enter estate name..."}
              onChange={e => setEstateName(e.target.value)}
              onFocus={() => estateOpts.length > 1 && setShowEstate(true)}
              onBlur={() => setTimeout(() => setShowEstate(false), 200)} />
            {showEstate && estateOpts.length > 1 && (
              <Drop opts={estateOpts} onSelect={opt => {
                setShowEstate(false);
                if (!opt.value) { setEstateName(""); return; }
                const e = opt.value;
                setEstateName(e.estate_name);
                if (e.area_ha)            setEstateArea(String(e.area_ha));
                if (e.district_kabupaten) setDistrict(e.district_kabupaten);
                if (e.province)           setProvince(e.province);
                if (e.latitude)           setGpsLat(String(e.latitude));
                if (e.longitude)          setGpsLng(String(e.longitude));
              }} />
            )}
          </div>

          {/* 3. Mill Name — searches cfi_mills_60tph (105 mills) */}
          <div style={{ position: "relative", marginBottom: 14 }}>
            <label style={S.label}>
              Mill Name / Unit{" "}
              <span style={{ color: C.red, fontSize: 11, fontWeight: 400 }}>Required</span>
            </label>
            <input style={S.input} value={millName}
              placeholder="Search 105 mills or enter manually..."
              onChange={e => { setMillName(e.target.value); setShowMill(true); }}
              onBlur={() => setTimeout(() => setShowMill(false), 200)} />
            {showMill && millOpts.length > 0 && (
              <Drop opts={millOpts} onSelect={selectMill} />
            )}
          </div>

          {/* 4. District — auto-fills from cfi_mills_60tph or cfi_estates */}
          <div style={{ marginBottom: 14 }}>
            <label style={S.label}>
              District / Kabupaten{" "}
              <span style={{ color: C.red, fontSize: 11, fontWeight: 400 }}>Required</span>
            </label>
            <input style={S.input} value={district}
              placeholder="Auto-fills from mill selection..."
              onChange={e => setDistrict(e.target.value)} />
          </div>

          {/* 5. Province — 34 Indonesian provinces — triggers soil suggestion */}
          <div style={{ marginBottom: 14 }}>
            <label style={S.label}>Province</label>
            <select style={{ ...S.input, appearance: "none", cursor: "pointer" }}
              value={province} onChange={e => setProvince(e.target.value)}>
              {IDN_PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          {/* 6. Estate Area — auto-fills from cfi_estates if known */}
          <div style={{ marginBottom: 14 }}>
            <label style={S.label}>Total Estate Area</label>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input style={{ ...S.input, flex: 1 }} type="number"
                value={estateArea} placeholder="0"
                onChange={e => setEstateArea(e.target.value)} />
              <span style={{ fontFamily: T.dm, fontSize: 12, color: C.grey }}>ha</span>
            </div>
          </div>

          {/* 7. GPS — triggers soil acidity RPC + weather cache/API */}
          <div>
            <label style={{ ...S.label, color: C.greyMd }}>
              GPS Coordinates{" "}
              <em style={{ fontFamily: T.dm, fontSize: 11, fontWeight: 400, fontStyle: "italic" }}>
                Optional — auto-fills from mill
              </em>
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <div>
                <span style={S.sub}>Latitude</span>
                <input style={S.input} type="number" value={gpsLat}
                  placeholder="-2.5000" onChange={e => setGpsLat(e.target.value)} />
              </div>
              <div>
                <span style={S.sub}>Longitude</span>
                <input style={S.input} type="number" value={gpsLng}
                  placeholder="115.0000" onChange={e => setGpsLng(e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        {/* 8–9. Weather Grid — from weather_cache or Open-Meteo API */}
        {weather && (
          <div style={{ ...S.zone, marginTop: 14 }}>
            <div style={{ fontFamily: T.dm, fontWeight: 600, fontSize: 13,
              color: C.amber, marginBottom: 10 }}>Monthly Climate Data</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 4 }}>
              {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
                .map((mo, i) => (
                <div key={mo} style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: T.dm, fontSize: 10, color: C.grey, marginBottom: 2 }}>{mo}</div>
                  <div style={{ fontFamily: T.mono, fontSize: 11, color: C.green }}>
                    {weather.temp?.[i] != null ? `${weather.temp[i].toFixed(1)}°` : "—"}
                  </div>
                  <div style={{ fontFamily: T.mono, fontSize: 10, color: C.blue }}>
                    {weather.rain?.[i] != null ? `${Math.round(weather.rain[i])}mm` : "—"}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ ...S.sub, marginTop: 8 }}>Values Per {weatherNote}</div>
          </div>
        )}

        {/* Soil acidity result — from get_soil_acidity_class RPC */}
        {acidityResult && (
          <div style={{
            marginTop: 12, padding: "10px 14px", borderRadius: 6,
            background: acidityResult.cfi_lime_flag
              ? "rgba(232,64,64,0.08)" : "rgba(61,203,122,0.08)",
            border: `1px solid ${acidityResult.cfi_lime_flag ? C.red : C.green}`,
          }}>
            <div style={{ fontFamily: T.dm, fontWeight: 600, fontSize: 13,
              color: acidityResult.cfi_lime_flag ? C.red : C.green }}>
              Soil Acidity: {acidityResult.class_name} · pH {acidityResult.ph_range}
            </div>
            <div style={{ fontFamily: T.dm, fontSize: 12, color: C.greyMd, marginTop: 4 }}>
              {acidityResult.cfi_note}
            </div>
          </div>
        )}

        {/* Province soil suggestion — from cfi_province_soil_lookup */}
        {soilSuggestion && !soilConfirmed && (
          <div style={{
            marginTop: 10, padding: "8px 12px", borderRadius: 6,
            background: "rgba(74,158,219,0.08)", border: `1px solid ${C.blue}`,
            fontFamily: T.dm, fontSize: 12, color: C.blue,
          }}>
            Soil Suggestion For {province}: {soilSuggestion.dominant_soil_wrb}
            {soilSuggestion.secondary_soil_wrb ? ` / ${soilSuggestion.secondary_soil_wrb}` : ""}
            {soilSuggestion.peat_present ? " · Peat Present" : ""}
            {" "}— Confirm In Section C
          </div>
        )}

        {/* Mill confirmed soil — from cfi_mills_60tph.confirmed_soil_type */}
        {soilConfirmed && (
          <div style={{
            marginTop: 10, padding: "8px 12px", borderRadius: 6,
            background: "rgba(61,203,122,0.08)", border: `1px solid ${C.green}`,
            fontFamily: T.dm, fontSize: 12, color: C.green,
          }}>
            Soil Type From Mill Record: {soilConfirmed} — Pre-Selected In Section C
          </div>
        )}

        {/* CFI Suggestions — from cfi_scenarios WHERE scenario_type = cfi_suggestion */}
        {suggestions.length > 0 && (
          <div style={{ marginTop: 14 }}>
            <div style={{ fontFamily: T.dm, fontWeight: 600, fontSize: 12,
              color: C.amber, marginBottom: 8 }}>CFI Suggestions For This Site</div>
            {suggestions.map(s => (
              <div key={s.id} style={{
                marginBottom: 8, padding: "10px 12px", borderRadius: 6,
                background: C.black, border: `1px solid ${C.border}`,
              }}>
                <div style={{ fontFamily: T.dm, fontWeight: 600, fontSize: 13, color: C.teal }}>
                  {s.suggestion_title}
                  {s.projected_npk_uplift_pct > 0 && (
                    <span style={{ marginLeft: 8, color: C.green, fontFamily: T.mono, fontSize: 12 }}>
                      +{s.projected_npk_uplift_pct}% NPK
                    </span>
                  )}
                </div>
                <div style={{ fontFamily: T.dm, fontSize: 12, color: C.greyMd, marginTop: 4 }}>
                  {s.suggestion_reason}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Status row */}
        <div style={{
          marginTop: 14, padding: "8px 12px", borderRadius: 6,
          background: siteOK ? "rgba(61,203,122,0.10)" : "rgba(245,166,35,0.10)",
          border: `1px solid ${siteOK ? C.green : C.amber}`,
          fontFamily: T.dm, fontSize: 13,
          color: siteOK ? C.green : C.amber,
        }}>
          {siteOK ? "Site Data Complete"
            : "Complete Required Fields: Company Name, Mill Name, District"}
        </div>
      </div>

      {/* ═══════════════════════════════════
          SECTION B — MILL CAPACITY
      ═══════════════════════════════════ */}
      <div style={S.panel}>
        <div style={S.title}>
          B — Oil Palm Mill Fresh Fruit Bunch Processing Capacity
        </div>

        {/* Confirmed banner */}
        {confirmed && (
          <div style={{
            marginBottom: 14, padding: "9px 14px", borderRadius: 6,
            background: "rgba(61,203,122,0.10)", border: `1px solid ${C.green}`,
            fontFamily: T.dm, fontSize: 13, color: C.green,
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <span>{ffb} TPH · {util}% · {hrs} Hrs · {days} Days — CONFIRMED</span>
            <button onClick={() => setConfirmed(false)} style={{
              background: "none", border: `1px solid ${C.amber}`,
              color: C.amber, borderRadius: 4, padding: "2px 10px",
              cursor: "pointer", fontFamily: T.dm, fontSize: 11,
            }}>Edit</button>
          </div>
        )}

        {/* 4 inputs */}
        <div style={S.zone}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 16 }}>
            {[
              { label: "FFB Processing",      val: ffb,  set: setFfb,  unit: "T / hr",  ph: "60"  },
              { label: "Capacity Utilisation", val: util, set: setUtil, unit: "%",        ph: "85"  },
              { label: "Operating Hours",      val: hrs,  set: setHrs,  unit: "hr / day", ph: "24"  },
              { label: "Operating Days",       val: days, set: setDays, unit: "days",     ph: "30"  },
            ].map(f => (
              <div key={f.label}>
                <label style={S.label}>{f.label}</label>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#142030", border: "1px solid rgba(168,189,208,0.12)", borderRadius: 8, padding: "10px 14px", gap: 12, minHeight: 48, marginBottom: 6 }}>
                  <input style={{
                    background: "#000000", border: "1.5px solid rgba(64,215,197,0.75)",
                    borderRadius: 7, color: "#F5A623", fontFamily: "'DM Mono', monospace",
                    fontSize: 14, fontWeight: 800, padding: "8px 10px",
                    width: 76, height: 38, textAlign: "center", outline: "none",
                    MozAppearance: "textfield",
                  }} type="number" value={f.val}
                    placeholder={f.ph} disabled={confirmed}
                    onChange={e => { f.set(e.target.value); setConfirmed(false); }} />
                  <span style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", color: "rgba(168,189,208,0.75)", whiteSpace: "nowrap", width: 42, textAlign: "left" }}>{f.unit}</span>
                </div>
              </div>
            ))}
          </div>

          {/* CONFIRM MILL CAPACITY gate — saves to cfi_sites on click */}
          <button disabled={!bValid || confirmed || saving} onClick={handleConfirm}
            style={{
              background: bValid && !confirmed ? "#00A249" : "#2A4A6A",
              color: bValid && !confirmed ? "#000000" : C.grey,
              fontFamily: "'EB Garamond', serif", fontWeight: 700, fontSize: 15,
              letterSpacing: "0.04em",
              border: "none", borderRadius: 8, padding: "0 28px",
              height: 51, minWidth: 260, display: "block", margin: "12px auto 0",
              cursor: bValid && !confirmed ? "pointer" : "not-allowed",
            }}>
            {saving ? "Saving..." : confirmed ? "✓ Confirmed — Click To Edit" : "Confirm Mill Capacity"}
          </button>
        </div>

        {/* KPI cards — monthly only, NO daily shown */}
        <div style={{ display: "flex", gap: 12, marginTop: 18, flexWrap: "wrap" }}>
          {[
            { label: "Monthly FFB",   val: fmt(monthlyFFB),  unit: "T / Month",     color: C.green  },
            { label: "EFB Monthly",   val: fmt(monthlyEFB),  unit: "T / Month Wet", color: C.amber  },
            { label: "OPDC Monthly",  val: fmt(monthlyOPDC), unit: "T / Month Wet", color: C.teal   },
            { label: "Effective FFB", val: fmt(effFFB),      unit: "TPH",           color: C.greyMd },
          ].map(k => (
            <div key={k.label} style={{
              background: C.navyMid, border: `1.5px solid ${C.border}`,
              borderRadius: 8, padding: "12px 16px", textAlign: "center",
              flex: "1 1 120px", minWidth: 110,
            }}>
              <div style={{ fontFamily: T.dm, fontSize: 12, color: C.greyMd, marginBottom: 4 }}>
                {k.label}
              </div>
              <div style={{ fontFamily: T.mono, fontWeight: 700, fontSize: 22, color: k.color }}>
                {k.val}
              </div>
              <div style={{ fontFamily: T.dm, fontSize: 10, color: C.grey, marginTop: 3 }}>
                {k.unit}
              </div>
            </div>
          ))}
        </div>

        {/* Formula trace — always visible when FFB entered */}
        {monthlyFFB > 0 && (
          <div style={{ marginTop: 10, fontFamily: T.dm, fontSize: 9,
            color: C.grey, lineHeight: 1.8 }}>
            Monthly FFB = {ffb} × {util}% × {hrs} Hrs × {days} Days = {fmt(monthlyFFB)} T
            {" · "}EFB = Monthly FFB × 0.225 = {fmt(monthlyEFB)} T
            {" · "}OPDC = EFB × 0.152 = {fmt(monthlyOPDC)} T
          </div>
        )}
      </div>
    </div>
  );
}
