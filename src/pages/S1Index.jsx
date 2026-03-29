import { useNavigate } from "react-router-dom";
import { Download } from "lucide-react";
import { toast } from "sonner";

const F = "'DM Sans', sans-serif";
const FH = "'EB Garamond', serif";

const navCards = [
  { title: "CapEx / OpEx / Facility", desc: "Building CAPEX $1.37M · Equipment $398K · OpEx $37,957/mo", route: "/s1-capex-opex", live: true },
  { title: "EFB ASCII Flow", desc: "10-node mechanical line · 298 kW · 20 t/h", route: "/s1-efb-ascii", live: true },
  { title: "OPDC ASCII Flow", desc: "10-node mechanical line · 206 kW · 5 t/h", route: "/s1-opdc-ascii", live: true },
  { title: "POS ASCII Flow", desc: "4-node pre-skimming · 62 kW · 1.25 t/h", route: "/s1-pos-ascii", live: true },
  { title: "Combined Floor Plans", desc: "Tabbed floor plans for all 3 lines", route: "/s1-combined", live: false },
  { title: "Greenhouse Design", desc: "4 greenhouses · 40m × 8m · 2×2 grid layout", route: "/s1-greenhouse", live: false },
];

const streams = [
  { name: "EFB", color: "#40D7C5", fresh: "300 t/day", dm: "112 t/day", mc: "62.5%" },
  { name: "OPDC", color: "#F5A623", fresh: "45 t/day", dm: "13.5 t/day", mc: "70%" },
  { name: "POS", color: "#3B82F6", fresh: "30 t/day", dm: "6 t/day", mc: "82%" },
];

const canonicalValues = [
  { label: "FFB Capacity", value: "60 TPH" },
  { label: "Operating", value: "20 hr/day" },
  { label: "EFB Yield", value: "22% of FFB" },
  { label: "OPDC Yield", value: "15.2% of EFB" },
  { label: "POS Volume", value: "30 t/day" },
  { label: "Belt Width", value: "600mm (EFB), 500mm (OPDC)" },
  { label: "DM Target", value: "30% wb" },
  { label: "Lignin Gate", value: "ADL <12% DM" },
];

const guardrails = [
  "MC >=40% LOCKED (CLASS A)",
  "Fe <3000 mg/kg DM target",
  "ADL <12% DM for BSF",
  "C:N 15-22 optimal",
  "pH 4.0-5.0 range",
  "CEC >20 cmol/kg target",
  "No Cr >20 mg/kg",
  "Belt speed locked at spec",
  "All temps <85C",
];

export default function S1Index() {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: F, color: "#111", minHeight: "100vh", background: "#F1F5F9" }}>
      {/* ═══ PERSISTENT CFI GLOBAL HEADER ═══ */}
      <div style={{
        height: 83, background: "#0A1628",
        borderBottom: "1px solid rgba(51, 212, 188, 0.15)",
        display: "flex", alignItems: "center", padding: "0 32px",
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
          <span style={{ fontFamily: FH, fontSize: 26, fontWeight: 700, color: "#FFFFFF", letterSpacing: "0.06em" }}>CFI</span>
          <span style={{ fontFamily: FH, fontSize: 26, fontWeight: 700, color: "#33D4BC", letterSpacing: "0.06em", marginLeft: 10 }}>Deep Tech</span>
        </div>
        <div style={{ width: 3, height: 44, background: "#33D4BC", margin: "0 20px 0 14px" }} />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 4, height: 44 }}>
          <div style={{ fontFamily: F, fontSize: 12, fontWeight: 700, lineHeight: 1.3, whiteSpace: "nowrap", display: "flex" }}>
            <span style={{ color: "#FFFFFF", minWidth: 150, display: "inline-block" }}>Precision Engineering</span>
            <span style={{ color: "#33D4BC" }}>Circular Nutrient Recovery in Agricultural Systems</span>
          </div>
          <div style={{ fontFamily: F, fontSize: 12, fontWeight: 700, lineHeight: 1.3, whiteSpace: "nowrap", display: "flex" }}>
            <span style={{ color: "#FFFFFF", minWidth: 150, display: "inline-block" }}>Applied Biology</span>
            <span style={{ color: "#33D4BC" }}>Rebalancing Soil&apos;s Microbiome &amp; Reducing Synthetic Fertiliser Use</span>
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div style={{ height: 83 }} />

      {/* ═══ PAGE CONTENT ═══ */}
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "24px 20px 60px" }}>

        {/* ── Breadcrumb ── */}
        <div style={{ fontSize: 13, fontFamily: F, marginBottom: 20 }}>
          <a href="/" style={{ color: "#64748B", textDecoration: "none" }}
            onMouseEnter={e => e.currentTarget.style.color = "#00C9B1"}
            onMouseLeave={e => e.currentTarget.style.color = "#64748B"}>CFI Platform</a>
          <span style={{ color: "#94A3B8", margin: "0 8px" }}>›</span>
          <span style={{ color: "#0B1422", fontWeight: 700 }}>S1 Pre-Processing</span>
        </div>

        {/* ── Page Title ── */}
        <h1 style={{ fontFamily: F, fontSize: 28, fontWeight: 700, color: "#0B1422", margin: "0 0 12px" }}>
          S1 Pre-Processing
        </h1>

        {/* ── Subtitle Bar ── */}
        <div style={{
          background: "#F1F5F9", borderRadius: 6, padding: "12px 20px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: 8, marginBottom: 20,
          border: "1px solid #E2E8F0",
        }}>
          <div style={{ fontFamily: F, fontSize: 14, fontWeight: 500, color: "#334155", display: "flex", flexWrap: "wrap", gap: 4 }}>
            <span>Mill Size: <strong style={{ fontWeight: 700 }}>60 ton/hour</strong></span>
            <span style={{ color: "#94A3B8" }}>·</span>
            <span>Utilisation: <strong style={{ fontWeight: 700 }}>85%</strong></span>
            <span style={{ color: "#94A3B8" }}>·</span>
            <span>Operating: <strong style={{ fontWeight: 700 }}>20 hr/day · 30 days/mo</strong></span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontFamily: F, fontSize: 14, fontWeight: 400, color: "#64748B" }}>Bogor, West Java</span>
            <span style={{
              fontFamily: F, fontSize: 11, fontWeight: 600, color: "#00C9B1",
              background: "#ECFDF5", padding: "2px 8px", borderRadius: 4,
            }}>Reference Site</span>
          </div>
        </div>

        {/* ── Throughput Cards ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 28 }}>
          {streams.map(s => (
            <div key={s.name} style={{
              background: "#fff", border: "1px solid #E2E8F0", borderRadius: 8, padding: 16,
              borderLeft: `4px solid ${s.color}`,
            }}>
              <div style={{ fontFamily: F, fontSize: 14, fontWeight: 700, color: "#0B1422", marginBottom: 10 }}>{s.name}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
                {[
                  ["DAILY FRESH", s.fresh],
                  ["DAILY DM", s.dm],
                  ["MC", s.mc],
                ].map(([label, val]) => (
                  <div key={label}>
                    <div style={{ fontFamily: F, fontSize: 11, fontWeight: 500, color: "#94A3B8", textTransform: "uppercase", letterSpacing: ".04em" }}>{label}</div>
                    <div style={{ fontFamily: F, fontSize: 13, fontWeight: 400, color: "#0B1422", marginTop: 2 }}>{val}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ── Quick Nav Cards ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 28 }}>
          {navCards.map(card => (
            <div
              key={card.title}
              onClick={() => {
                if (card.live) navigate(card.route);
                else toast("Coming soon", { duration: 2000 });
              }}
              style={{
                background: "#fff", border: "1px solid #E2E8F0", borderRadius: 8, padding: 20,
                cursor: card.live ? "pointer" : "default",
                opacity: card.live ? 1 : 0.7,
                display: "flex", justifyContent: "space-between", alignItems: "center",
                transition: "border-color 0.15s, box-shadow 0.15s",
              }}
              onMouseEnter={e => { if (card.live) { e.currentTarget.style.borderColor = "#00C9B1"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,201,177,0.1)"; } }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#E2E8F0"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div>
                <div style={{ fontFamily: F, fontSize: 16, fontWeight: 700, color: "#0B1422" }}>{card.title}</div>
                <div style={{ fontFamily: F, fontSize: 13, fontWeight: 400, color: "#64748B", marginTop: 4 }}>{card.desc}</div>
              </div>
              <span style={{ fontSize: 18, color: "#94A3B8", flexShrink: 0, marginLeft: 12 }}>›</span>
            </div>
          ))}
        </div>

        {/* ═══ CANONICAL VALUES REFERENCE ═══ */}
        <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 8, padding: 20, marginBottom: 14 }}>
          <div style={{ fontFamily: F, fontSize: 14, fontWeight: 700, color: "#0B1422", marginBottom: 12 }}>Canonical Values Reference</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10 }}>
            {canonicalValues.map((cv, i) => (
              <div key={i} style={{ border: "1px solid #F1F5F9", borderRadius: 4, padding: "8px 10px", background: "#FAFAFA" }}>
                <div style={{ fontFamily: F, fontSize: 10, color: "#94A3B8" }}>{cv.label}</div>
                <div style={{ fontFamily: F, fontSize: 12, fontWeight: 700, color: "#0B1422", marginTop: 2 }}>{cv.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ RFQ PACK ═══ */}
        <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 8, padding: 20, marginBottom: 14 }}>
          <div style={{ border: "1.5px solid rgba(51,212,188,0.3)", borderRadius: 6, padding: "20px 24px", background: "#f8fcfb" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <Download size={18} color="#33D4BC" />
              <div style={{ fontFamily: F, fontSize: 10, fontWeight: 700, color: "#33D4BC", textTransform: "uppercase", letterSpacing: "0.06em" }}>Engineering Specs</div>
            </div>
            <div style={{ fontFamily: F, fontSize: 18, fontWeight: 700, color: "#0B1422", marginBottom: 6 }}>S1 Complete Engineering Specs — RFQ Pack</div>
            <div style={{ fontFamily: F, fontSize: 12, color: "#64748B", lineHeight: 1.5, marginBottom: 16 }}>
              22-page complete engineering documentation for all 3 processing lines (EFB, OPDC, POS). Ready for RFQ pack assembly and contractor bidding.
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <a
                href="https://lcpbtnipkvrmuwllymfw.supabase.co/storage/v1/object/public/documents/CFI_S1_Engineering_Complete.pdf"
                target="_blank" rel="noopener noreferrer"
                style={{
                  fontFamily: F, fontSize: 12, fontWeight: 700, padding: "8px 20px",
                  background: "#33D4BC", color: "#0A1628", borderRadius: 4, textDecoration: "none",
                  display: "inline-flex", alignItems: "center", gap: 6,
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = 0.85}
                onMouseLeave={e => e.currentTarget.style.opacity = 1}
              >
                <Download size={14} /> View PDF →
              </a>
              <a
                href="https://lcpbtnipkvrmuwllymfw.supabase.co/storage/v1/object/public/documents/CFI_S1_Engineering_Complete.pdf"
                target="_blank" rel="noopener noreferrer"
                onClick={e => {
                  e.preventDefault();
                  const w = window.open(e.currentTarget.href, '_blank');
                  if (w) { w.onload = () => { w.print(); }; }
                }}
                style={{
                  fontFamily: F, fontSize: 12, fontWeight: 700, padding: "8px 20px",
                  background: "transparent", color: "#33D4BC", borderRadius: 4, textDecoration: "none",
                  border: "1.5px solid #33D4BC", display: "inline-flex", alignItems: "center", gap: 6,
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = 0.85}
                onMouseLeave={e => e.currentTarget.style.opacity = 1}
              >
                Print
              </a>
            </div>
          </div>
        </div>

        {/* ═══ GUARDRAILS ═══ */}
        <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 8, padding: "16px 20px" }}>
          <div style={{ fontFamily: F, fontSize: 12, fontWeight: 700, color: "#cc2222", marginBottom: 8 }}>9 Hard Guardrails</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "4px 16px" }}>
            {guardrails.map((g, i) => (
              <div key={i} style={{ fontFamily: F, fontSize: 10, color: "#8b0000", lineHeight: 1.6 }}>⚠ {g}</div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
