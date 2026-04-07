/**
 * GlobalLayout.jsx — CFI Persistent Navigation Shell
 *
 * Wraps every page with the sticky brand header, NAV TAB ROW, and CONTEXT BAR.
 * Uses React Router v6 <Outlet> so all child routes render below the header.
 *
 * Active tab detection:
 *   /          → 0  "Site Setup"       (stage from sessionStorage)
 *   /s1*       → 1  "Pre-Processing"
 *   ?stage=2   → 2  "Pre-Treatment"
 *   /s3*       → 3  "Biologicals"
 *   ?stage=4   → 4  "BSF"
 *   etc.
 *
 * Context bar data is written to sessionStorage key `cfi-s0-display` by App.jsx
 * each time the S0 form changes. Sub-pages read it here.
 */
import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import CFI_PriceRefreshBadge from "../CFI_PriceRefreshBadge/CFI_PriceRefreshBadge.jsx";

const F  = "'DM Sans', sans-serif";
const FM = "'DM Mono', monospace";

const NAV_TABS = [
  "Site Setup",
  "Pre-Processing",
  "Pre-Treatment",
  "Biologicals",
  "BSF",
  "Biofertiliser / Other",
  "Emissions",
  "Financials",
  "Summary",
];
const SHORT_TABS = ["S0","S1","S2","S3","S4","S5","S6"];

// Determines which NAV_TAB index is active from location
function resolveActiveTab(pathname, search) {
  if (pathname.startsWith("/s1")) return 1;
  if (pathname.startsWith("/s3")) return 3;
  if (pathname === "/lab")        return 8;
  if (pathname === "/") {
    const p = new URLSearchParams(search).get("stage");
    if (p !== null) return parseInt(p, 10);
    try { return parseInt(sessionStorage.getItem("cfi-active-stage") || "0", 10); } catch { return 0; }
  }
  return 0;
}

// Determines which SHORT_TAB (S0-S6) index is active
function resolveShortTab(pathname, activeTab) {
  if (pathname.startsWith("/s1")) return 1;
  if (pathname.startsWith("/s3")) return 3;
  return Math.min(activeTab, 6);
}

const EMPTY_SITE = { plantName:"", estateName:"", millName:"", ffbCapacity:"", soil:"", efbEnabled:false, opdcEnabled:false, posEnabled:false, pomeEnabled:false };

function readSiteInfo() {
  try {
    const raw = sessionStorage.getItem("cfi-s0-display");
    return raw ? JSON.parse(raw) : EMPTY_SITE;
  } catch { return EMPTY_SITE; }
}

export default function GlobalLayout() {
  const location = useLocation();
  const navigate  = useNavigate();
  const [site, setSite] = useState(readSiteInfo);

  const activeTab   = resolveActiveTab(location.pathname, location.search);
  const activeShort = resolveShortTab(location.pathname, activeTab);

  // Re-read site info when App.jsx fires the custom event or storage changes
  useEffect(() => {
    const onUpdate = () => setSite(readSiteInfo());
    window.addEventListener("cfi-s0-updated", onUpdate);
    window.addEventListener("storage", onUpdate);
    return () => {
      window.removeEventListener("cfi-s0-updated", onUpdate);
      window.removeEventListener("storage", onUpdate);
    };
  }, []);

  // Re-read when route changes (user may have filled form and navigated)
  useEffect(() => { setSite(readSiteInfo()); }, [location.pathname]);

  const handleTabClick = (i) => {
    if (i === 3) { navigate("/s3"); return; }
    // Stages that live inside App.jsx — pass via sessionStorage then navigate to /
    try { sessionStorage.setItem("cfi-target-stage", String(i)); } catch {}
    navigate("/");
  };

  const sep = (
    <div style={{ width:0.5, height:13, background:"rgba(139,160,180,0.18)", margin:"0 11px", flexShrink:0 }} />
  );

  return (
    <>
      {/* ── STICKY HEADER ── */}
      <div style={{ position:"sticky", top:0, zIndex:1000 }}>

        {/* BRAND HEADER */}
        <div className="global-header">
          <div className="brand-block">
            <span className="brand-name brand-cfi">CFI</span>
            <span className="brand-name brand-deeptech">Deep Tech</span>
          </div>
          <div className="brand-divider" />
          <div className="taglines-block">
            <div className="tagline">
              <span className="tagline-segment tagline-white">Precision Engineering</span>
              <span className="tagline-segment tagline-teal">Circular Nutrient Recovery in Agricultural Systems</span>
            </div>
            <div className="tagline">
              <span className="tagline-segment tagline-white">Applied Biology</span>
              <span className="tagline-segment tagline-teal">Rebalancing Soil's Microbiome &amp; Reducing Synthetic Fertiliser Use</span>
            </div>
          </div>
          {/* Price badge + S0–S6 short tabs */}
          <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:12, flexShrink:0 }}>
            <CFI_PriceRefreshBadge />
            {SHORT_TABS.map((s, i) => (
              <span
                key={s}
                onClick={() => handleTabClick(i)}
                style={{
                  fontFamily:FM, fontSize:10, fontWeight:700, borderRadius:4,
                  padding:"3px 9px", cursor:"pointer", whiteSpace:"nowrap",
                  background: i === activeShort ? "#33D4BC" : "rgba(168,189,208,0.09)",
                  color:      i === activeShort ? "#060C14" : "#A8BDD0",
                  border:     i === activeShort ? "1px solid #33D4BC" : "1px solid rgba(168,189,208,0.18)",
                }}
              >{s}</span>
            ))}
          </div>
        </div>

        {/* NAV TAB ROW */}
        <div style={{ background:"#0A1628", borderBottom:"2px solid rgba(51,212,188,0.18)", display:"flex", alignItems:"flex-end", gap:4, padding:"10px 24px 0 76px" }}>
          {NAV_TABS.map((t, i) => (
            <div
              key={t}
              onClick={() => handleTabClick(i)}
              style={{
                fontFamily:F, fontSize:11, fontWeight:700, borderRadius:"7px 7px 0 0",
                borderTop:    "1.5px solid rgba(51,212,188,0.60)",
                borderLeft:   "1.5px solid rgba(51,212,188,0.60)",
                borderRight:  "1.5px solid rgba(51,212,188,0.60)",
                borderBottom: "none",
                background:   "rgba(64,215,197,0.15)",
                color:        i === activeTab ? "#F5A623" : "#A8BDD0",
                padding:"8px 16px 10px", marginBottom:-2, cursor:"pointer", whiteSpace:"nowrap",
              }}
            >{t}</div>
          ))}
        </div>

        {/* CONTEXT BAR */}
        <div style={{ background:"#0A1628", height:36, display:"flex", alignItems:"center", padding:"0 24px", borderBottom:"1px solid rgba(255,255,255,0.04)", gap:0 }}>
          <span style={{ fontFamily:FM, fontSize:11, color: site.plantName ? "#ffffff" : "rgba(168,189,208,0.25)", whiteSpace:"nowrap" }}>
            {site.plantName || "—"}
          </span>
          {sep}
          <span style={{ fontFamily:FM, fontSize:11, color:"rgba(168,189,208,0.33)", whiteSpace:"nowrap", marginRight:4 }}>Estate</span>
          <span style={{ fontFamily:FM, fontSize:11, color: site.estateName ? "rgba(196,212,227,0.48)" : "rgba(168,189,208,0.25)", whiteSpace:"nowrap" }}>{site.estateName || "—"}</span>
          {sep}
          <span style={{ fontFamily:FM, fontSize:11, color:"rgba(168,189,208,0.33)", whiteSpace:"nowrap", marginRight:4 }}>Mill</span>
          <span style={{ fontFamily:FM, fontSize:11, color: site.millName ? "rgba(196,212,227,0.48)" : "rgba(168,189,208,0.25)", whiteSpace:"nowrap" }}>{site.millName || "—"}</span>
          {sep}
          <span style={{ fontFamily:FM, fontSize:11, color:"rgba(168,189,208,0.33)", whiteSpace:"nowrap", marginRight:4 }}>FFB</span>
          <span style={{ fontFamily:FM, fontSize:11, color: site.ffbCapacity ? "rgba(196,212,227,0.48)" : "rgba(168,189,208,0.25)", whiteSpace:"nowrap" }}>{site.ffbCapacity ? `${site.ffbCapacity} TPH` : "—"}</span>
          {sep}
          <span style={{ fontFamily:FM, fontSize:11, color:"rgba(168,189,208,0.33)", whiteSpace:"nowrap", marginRight:4 }}>Soil</span>
          <span style={{ fontFamily:FM, fontSize:11, color: site.soil ? "rgba(196,212,227,0.48)" : "rgba(168,189,208,0.25)", whiteSpace:"nowrap" }}>{site.soil || "—"}</span>
          {(site.efbEnabled || site.opdcEnabled || site.posEnabled || site.pomeEnabled) && (
            <>
              {sep}
              <span style={{ fontFamily:FM, fontSize:11, color:"rgba(168,189,208,0.33)", whiteSpace:"nowrap", marginRight:4 }}>Streams</span>
              {site.efbEnabled  && <span style={{ fontFamily:FM, fontWeight:700, fontSize:10, color:"#33D4BC", background:"rgba(51,212,188,0.10)", border:"1px solid rgba(51,212,188,0.30)", borderRadius:3, padding:"1px 6px", marginLeft:4 }}>EFB</span>}
              {site.opdcEnabled && <span style={{ fontFamily:FM, fontWeight:700, fontSize:10, color:"#33D4BC", background:"rgba(51,212,188,0.10)", border:"1px solid rgba(51,212,188,0.30)", borderRadius:3, padding:"1px 6px", marginLeft:4 }}>OPDC</span>}
              {site.posEnabled  && <span style={{ fontFamily:FM, fontWeight:700, fontSize:10, color:"#33D4BC", background:"rgba(51,212,188,0.10)", border:"1px solid rgba(51,212,188,0.30)", borderRadius:3, padding:"1px 6px", marginLeft:4 }}>POS</span>}
              {site.pomeEnabled && <span style={{ fontFamily:FM, fontWeight:700, fontSize:10, color:"#33D4BC", background:"rgba(51,212,188,0.10)", border:"1px solid rgba(51,212,188,0.30)", borderRadius:3, padding:"1px 6px", marginLeft:4 }}>POME</span>}
            </>
          )}
        </div>
      </div>

      {/* PAGE CONTENT */}
      <Outlet />
    </>
  );
}
