import { useNavigate } from "react-router-dom";

const F = "'DM Sans', sans-serif";

/**
 * S0 Exit Stage — Residue Selector
 *
 * This page is the S0 exit point. The user selects a residue
 * and this page routes them to the correct S1 Processing Line
 * 1-Pager (PL1P).
 *
 * Wiring rules:
 * - Each residue card links to: /s1/[residue]
 * - Adding a new residue = add a new card + create the floor plan page
 * - The residue name flows from S0 into S1 via sessionStorage
 *
 * Known residues:
 *   OPDC — Oil Palm Decanter Cake (paste, 70-75% MC)
 *   EFB  — Empty Fruit Bunch (fibre, 65-70% MC)
 *   POS  — Palm Oil Sludge (liquid/semi, 80-85% MC)
 */

const RESIDUES = [
  {
    code: "OPDC",
    name: "Oil Palm Decanter Cake",
    form: "Paste form \u00b7 70\u201375% MC",
    specs: "10 machines \u00b7 5 t/h \u00b7 500mm belt\nBuilding: 18m \u00d7 36m \u00d7 10m\nInstalled: ~206 kW\nClass A: Screw press MC \u2265 40%\nGuardrails: noise zone, flex mount, 24hr dwell",
    route: "/s1/opdc",
  },
  {
    code: "EFB",
    name: "Empty Fruit Bunch",
    form: "Fibre form \u00b7 65\u201370% MC",
    specs: "10 machines \u00b7 8 t/h \u00b7 600mm belt\nBuilding: 18m \u00d7 40m \u00d7 12m\nInstalled: ~212 kW\nClass A: Screw press MC \u2265 45%\nGuardrails: noise zone, flex mount, 24hr dwell",
    route: "/s1/efb",
  },
  {
    code: "POS",
    name: "Palm Oil Sludge",
    form: "Liquid/semi form \u00b7 80\u201385% MC",
    specs: "10 machines \u00b7 6 m\u00b3/h liquid in\nBuilding: 12m \u00d7 30m \u00d7 8m\nInstalled: ~113 kW\nClass A: Decanter centrifuge MC \u2265 35%\nGuardrails: flex mount, lime dosing, 24hr dwell",
    route: "/s1/pos",
  },
];

export default function S0ResidueSelector() {
  const navigate = useNavigate();

  const handleSelect = (residue) => {
    sessionStorage.setItem("cfi-s0-residue", residue.code);
    navigate(residue.route);
  };

  return (
    <div style={{
      fontFamily: F, color: "#F0F4F8", minHeight: "100vh",
      background: "#0B1422", display: "flex", flexDirection: "column",
      alignItems: "center", padding: "40px 20px",
    }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div style={{
          display: "inline-block", background: "#40D7C5", color: "#0B1422",
          fontSize: 11, fontWeight: 700, padding: "3px 12px", borderRadius: 12,
          marginBottom: 12, letterSpacing: ".06em",
        }}>Stage 0 \u2014 Exit</div>
        <h1 style={{
          fontSize: 28, fontWeight: 700, color: "#40D7C5",
          marginBottom: 8, letterSpacing: ".02em",
        }}>Select Residue for S1 Processing</h1>
        <p style={{
          fontSize: 13, color: "#8BA0B4", maxWidth: 600, lineHeight: 1.6, margin: "0 auto",
        }}>
          Choose the residue type to view its S1 Mechanical Pre-Processing Line 1-Pager.
          Each residue has a unique machine sequence, guardrails, and Class A gates tailored to its physical form.
        </p>
      </div>

      {/* Cards */}
      <div style={{ display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center", maxWidth: 960 }}>
        {RESIDUES.map((r) => (
          <div
            key={r.code}
            onClick={() => handleSelect(r)}
            style={{
              background: "#111B2A", border: "1.5px solid rgba(64,215,197,.2)",
              borderRadius: 8, width: 280, padding: 24, cursor: "pointer",
              transition: "all .2s", display: "flex", flexDirection: "column",
              textDecoration: "none", color: "inherit",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#40D7C5";
              e.currentTarget.style.background = "#142233";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(64,215,197,.2)";
              e.currentTarget.style.background = "#111B2A";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div style={{ fontSize: 24, fontWeight: 700, color: "#40D7C5", marginBottom: 4 }}>{r.code}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#F0F4F8", marginBottom: 8 }}>{r.name}</div>
            <div style={{
              fontSize: 11, color: "#8BA0B4", marginBottom: 12,
              paddingBottom: 12, borderBottom: "1px solid rgba(64,215,197,.1)",
            }}>{r.form}</div>
            <div style={{ fontSize: 11, color: "#8BA0B4", lineHeight: 1.7, flex: 1, whiteSpace: "pre-line" }}>
              {r.specs}
            </div>
            <div style={{
              marginTop: 16, background: "#40D7C5", color: "#0B1422",
              fontSize: 12, fontWeight: 700, padding: "8px 16px", borderRadius: 4,
              textAlign: "center", letterSpacing: ".03em",
            }}>Open {r.code} Processing Line \u2192</div>
          </div>
        ))}
      </div>

      {/* 1-PAGER LINK */}
      <div style={{ marginTop: 32, display: 'flex', justifyContent: 'center' }}>
        <a
          href="/CFI_S0_Residue_Selector.html"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '10px 24px', borderRadius: 6,
            border: '1.5px solid #40D7C5',
            background: 'transparent', color: '#40D7C5',
            fontFamily: F, fontSize: 13, fontWeight: 700,
            textDecoration: 'none', letterSpacing: '.02em',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#40D7C5'; e.currentTarget.style.color = '#0B1422'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#40D7C5'; }}
        >
          📄 View S0 Residue Selector 1-Pager
        </a>
      </div>

      {/* Footer */}
      <div style={{
        marginTop: 48, textAlign: "center", fontSize: 11, color: "#4A5A6A",
        maxWidth: 600, lineHeight: 1.6,
      }}>
        S0 selects the residue. S1 processes it. Each processing line page is a template \u2014 the residue name is never hardcoded.
        To add a new residue: duplicate any floor plan page, replace residue content, add a card here.
      </div>
    </div>
  );
}
