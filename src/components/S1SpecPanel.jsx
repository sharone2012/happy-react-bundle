import { useState } from "react";

const F = "'DM Sans', sans-serif";

const GUARDRAILS = [
  { match: ["MC ≥ 40%", "CLASS A"], text: "MC ≥ 40% LOCKED (CLASS A)" },
  { match: ["ICP-OES", "Fe"], text: "Fe < 3,000 mg/kg DM target" },
  { match: ["ADL"], text: "ADL < 12% DM for BSF" },
  { match: ["C:N"], text: "C:N 15–22 optimal" },
  { match: ["pH"], text: "pH 4.0–5.0 range" },
  { match: ["Cr"], text: "No Cr > 20 mg/kg" },
  { match: ["CEC"], text: "CEC > 20 cmol/kg target" },
  { match: ["Belt speed"], text: "Belt speed locked at spec" },
  { match: ["< 85°C", "temp"], text: "All temps < 85°C" },
];

function getGuardrails(node) {
  const badges = [];
  const text = `${node.gate || ""} ${node.enforcement || ""} ${node.name || ""} ${node.description || ""}`.toLowerCase();
  if ((node.gate && node.gate.includes("B.G2")) || text.includes("screw press")) {
    badges.push("MC ≥ 40% LOCKED (CLASS A)");
  }
  if (text.includes("icp") || text.includes("fe result") || text.includes("sludge pit")) {
    badges.push("Fe < 3,000 mg/kg DM target");
    badges.push("No Cr > 20 mg/kg");
  }
  if (text.includes("buffer bin") || text.includes("buffer tank") || node.tag?.includes("BIN")) {
    badges.push("ADL < 12% DM for BSF");
    badges.push("C:N 15–22 optimal");
    badges.push("CEC > 20 cmol/kg target");
  }
  if (node.tag?.includes("BIN-OPDC") && text.includes("24hr")) {
    badges.push("pH 4.0–5.0 range");
  }
  if (text.includes("conveyor") || node.tag?.includes("CV") || node.tag?.includes("BC")) {
    badges.push("Belt speed locked at spec");
  }
  if (text.includes("hammer mill") || text.includes("shredder") || node.tag?.includes("HM") || node.tag?.includes("SD")) {
    badges.push("All temps < 85°C");
  }
  return badges;
}

function AmberBadge({ text }) {
  return (
    <span style={{
      display: "inline-block", background: "#FEF3C7", color: "#92400E",
      fontSize: 11, fontFamily: F, fontWeight: 500, padding: "2px 8px",
      borderRadius: 4, marginRight: 6, marginBottom: 4, whiteSpace: "nowrap",
    }}>{text}</span>
  );
}

function SpecRow({ node, index }) {
  const [open, setOpen] = useState(false);
  const guardrails = getGuardrails(node);
  const fields = [
    ["Equipment Tag", node.tag],
    ["Equipment Name", node.name],
    ["Throughput (t/h)", node.tph],
    ["MC In (%)", node.mcIn],
    ["MC Out (%)", node.mcOut],
    ["Elevation (m)", node.elev],
    ["Power (kW)", node.kw],
    ["Gate Code", node.gate],
    ["Gate Enforcement", node.enforcement],
    ["CAPEX Cost (USD)", node.capex],
    ["Supplier", node.supplier],
    ["Description", node.description],
  ];

  return (
    <div style={{
      background: "#fff", border: "1px solid #E2E8F0", borderRadius: 6,
      marginBottom: 8, fontFamily: F, overflow: "hidden",
    }}>
      <div
        onClick={() => setOpen(!open)}
        style={{
          display: "flex", alignItems: "center", padding: "12px 16px",
          cursor: "pointer", gap: 16, fontSize: 14, userSelect: "none",
        }}
      >
        <span style={{ color: "#64748B", fontWeight: 500, fontSize: 12, minWidth: 28, textAlign: "center" }}>
          {index + 1}
        </span>
        <span style={{ fontWeight: 700, color: "#0B1422", minWidth: 100, fontSize: 13 }}>{node.tag || "—"}</span>
        <span style={{ flex: 1, color: "#0B1422", fontWeight: 400, fontSize: 14 }}>{node.name || "—"}</span>
        <span style={{ color: "#64748B", fontSize: 12, minWidth: 60, textAlign: "right" }}>{node.kw != null ? `${node.kw} kW` : "—"}</span>
        <span style={{ color: "#64748B", fontSize: 12, minWidth: 60, textAlign: "right" }}>{node.tph != null ? `${node.tph} t/h` : "—"}</span>
        <span style={{
          display: "inline-block", transition: "transform 0.2s",
          transform: open ? "rotate(90deg)" : "rotate(0deg)",
          fontSize: 14, color: "#94A3B8",
        }}>▸</span>
      </div>

      {open && (
        <div style={{ borderTop: "1px solid #E2E8F0", padding: "16px 16px 12px 60px" }}>
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 32px",
          }}>
            {fields.map(([label, value]) => (
              <div key={label}>
                <div style={{ fontSize: 12, fontWeight: 500, color: "#64748B", fontFamily: F, marginBottom: 2 }}>{label}</div>
                <div style={{ fontSize: 14, fontWeight: 400, color: "#0B1422", fontFamily: F }}>{value || "—"}</div>
              </div>
            ))}
          </div>
          {guardrails.length > 0 && (
            <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 4 }}>
              {guardrails.map(g => <AmberBadge key={g} text={g} />)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function S1SpecPanel({ title, nodes, totalPower, totalCapex, monthlyElec, monthlyKwh }) {
  const [allOpen, setAllOpen] = useState(false);
  const [key, setKey] = useState(0);

  const toggleAll = () => {
    setAllOpen(!allOpen);
    setKey(k => k + 1);
  };

  return (
    <div style={{
      background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 8,
      padding: 24, marginTop: 32, fontFamily: F,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <span style={{ fontFamily: F, fontWeight: 700, fontSize: 18, color: "#0B1422" }}>{title}</span>
        <span
          onClick={toggleAll}
          style={{ fontFamily: F, fontWeight: 500, fontSize: 14, color: "#00C9B1", cursor: "pointer" }}
          onMouseEnter={e => e.currentTarget.style.opacity = 0.7}
          onMouseLeave={e => e.currentTarget.style.opacity = 1}
        >{allOpen ? "Collapse All" : "Expand All"}</span>
      </div>

      {nodes.map((node, i) => (
        <SpecRowControlled key={`${i}-${key}`} node={node} index={i} forceOpen={allOpen} />
      ))}

      <div style={{ marginTop: 16, borderTop: "1px solid #E2E8F0", paddingTop: 12 }}>
        <div style={{ fontFamily: F, fontWeight: 700, fontSize: 14, color: "#0B1422", marginBottom: 4 }}>
          Total Line Power: {totalPower} kW
        </div>
        <div style={{ fontFamily: F, fontWeight: 700, fontSize: 14, color: "#0B1422", marginBottom: 4 }}>
          Line Equipment CAPEX: {totalCapex}
        </div>
        <div style={{ fontFamily: F, fontWeight: 500, fontSize: 14, color: "#64748B" }}>
          Monthly Electricity: {monthlyElec} ({monthlyKwh} kWh/mo) — PLN I-3 tariff IDR 1,444.70/kWh
        </div>
      </div>
    </div>
  );
}

function SpecRowControlled({ node, index, forceOpen }) {
  const [open, setOpen] = useState(forceOpen);
  const guardrails = getGuardrails(node);
  const fields = [
    ["Equipment Tag", node.tag],
    ["Equipment Name", node.name],
    ["Throughput (t/h)", node.tph],
    ["MC In (%)", node.mcIn],
    ["MC Out (%)", node.mcOut],
    ["Elevation (m)", node.elev],
    ["Power (kW)", node.kw],
    ["Gate Code", node.gate],
    ["Gate Enforcement", node.enforcement],
    ["CAPEX Cost (USD)", node.capex],
    ["Supplier", node.supplier],
    ["Description", node.description],
  ];

  return (
    <div style={{
      background: "#fff", border: "1px solid #E2E8F0", borderRadius: 6,
      marginBottom: 8, fontFamily: F, overflow: "hidden",
    }}>
      <div
        onClick={() => setOpen(!open)}
        style={{
          display: "flex", alignItems: "center", padding: "12px 16px",
          cursor: "pointer", gap: 16, fontSize: 14, userSelect: "none",
        }}
      >
        <span style={{ color: "#64748B", fontWeight: 500, fontSize: 12, minWidth: 28, textAlign: "center" }}>
          {index + 1}
        </span>
        <span style={{ fontWeight: 700, color: "#0B1422", minWidth: 100, fontSize: 13 }}>{node.tag || "—"}</span>
        <span style={{ flex: 1, color: "#0B1422", fontWeight: 400, fontSize: 14 }}>{node.name || "—"}</span>
        <span style={{ color: "#64748B", fontSize: 12, minWidth: 60, textAlign: "right" }}>{node.kw != null ? `${node.kw} kW` : "—"}</span>
        <span style={{ color: "#64748B", fontSize: 12, minWidth: 60, textAlign: "right" }}>{node.tph != null ? `${node.tph} t/h` : "—"}</span>
        <span style={{
          display: "inline-block", transition: "transform 0.2s",
          transform: open ? "rotate(90deg)" : "rotate(0deg)",
          fontSize: 14, color: "#94A3B8",
        }}>▸</span>
      </div>

      {open && (
        <div style={{ borderTop: "1px solid #E2E8F0", padding: "16px 16px 12px 60px" }}>
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 32px",
          }}>
            {fields.map(([label, value]) => (
              <div key={label}>
                <div style={{ fontSize: 12, fontWeight: 500, color: "#64748B", fontFamily: F, marginBottom: 2 }}>{label}</div>
                <div style={{ fontSize: 14, fontWeight: 400, color: "#0B1422", fontFamily: F }}>{value || "—"}</div>
              </div>
            ))}
          </div>
          {guardrails.length > 0 && (
            <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 4 }}>
              {guardrails.map(g => <AmberBadge key={g} text={g} />)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
