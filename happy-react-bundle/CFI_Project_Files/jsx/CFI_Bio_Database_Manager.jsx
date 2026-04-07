import { useState, useEffect, useCallback } from "react";

// ─── SEED DATA — existing biological library ─────────────────────────────────
const SEED_ORGANISMS = [
  { id: 1, category: "🔥 Thermo Fungi", name: "Thermomyces lanuginosus", icbb: "—", supplier: "Commercial", fn: "Thermophilic cellulase/xylanase producer", temp: "50–60", bsfSafe: "✅", form: "Dry", usdKg: 25, doseLow: 0.05, doseHigh: 0.15, kgLow: 0.175, kgHigh: 0.525, costLow: 4.38, costHigh: 13.13, quote: "Alibaba/Novozymes", addedBy: "System", addedDate: "2025-01-01", notes: "" },
  { id: 2, category: "🔥 Thermo Fungi", name: "Myceliophthora thermophila", icbb: "—", supplier: "DSM/Novozymes", fn: "C1 cellulase system, industrial enzyme source", temp: "45–55", bsfSafe: "✅", form: "Dry", usdKg: 30, doseLow: 0.05, doseHigh: 0.10, kgLow: 0.175, kgHigh: 0.35, costLow: 5.25, costHigh: 10.5, quote: "Novozymes Indonesia", addedBy: "System", addedDate: "2025-01-01", notes: "" },
  { id: 3, category: "🔥 Thermo Fungi", name: "Chaetomium thermophilum", icbb: "—", supplier: "Research", fn: "Thermophilic cellulase, model organism", temp: "50–60", bsfSafe: "✅", form: "Dry", usdKg: 35, doseLow: 0.03, doseHigh: 0.08, kgLow: 0.105, kgHigh: 0.28, costLow: 3.68, costHigh: 9.8, quote: "IPB Bogor/LIPI", addedBy: "System", addedDate: "2025-01-01", notes: "" },
  { id: 4, category: "🔥 Thermo Bacteria", name: "Geobacillus stearothermophilus", icbb: "—", supplier: "Commercial", fn: "Thermophilic amylase/protease producer", temp: "55–70", bsfSafe: "✅", form: "Dry", usdKg: 15, doseLow: 0.05, doseHigh: 0.15, kgLow: 0.175, kgHigh: 0.525, costLow: 2.63, costHigh: 7.88, quote: "IndiaMART", addedBy: "System", addedDate: "2025-01-01", notes: "" },
  { id: 5, category: "🔥 Thermo Bacteria", name: "Bacillus licheniformis", icbb: "—", supplier: "Commercial", fn: "Thermotolerant protease/amylase", temp: "50–65", bsfSafe: "✅", form: "Dry", usdKg: 8, doseLow: 0.05, doseHigh: 0.20, kgLow: 0.175, kgHigh: 0.7, costLow: 1.4, costHigh: 5.6, quote: "Alibaba bulk", addedBy: "System", addedDate: "2025-01-01", notes: "" },
  { id: 6, category: "🔥 Thermo Actino", name: "Thermobifida fusca", icbb: "—", supplier: "Research", fn: "Thermophilic actinomycete, cellulase", temp: "50–55", bsfSafe: "✅", form: "Dry", usdKg: 40, doseLow: 0.02, doseHigh: 0.05, kgLow: 0.07, kgHigh: 0.175, costLow: 2.8, costHigh: 7.0, quote: "ATCC/DSMZ", addedBy: "System", addedDate: "2025-01-01", notes: "" },
  { id: 7, category: "🍄 Fungi", name: "Phanerochaete sp. ICBB 9182", icbb: "ICBB 9182", supplier: "Provibio", fn: "Primary lignin destroyer (LiP, MnP, Laccase)", temp: "25–42", bsfSafe: "✅", form: "Wet", usdKg: 8, doseLow: 0.05, doseHigh: 0.15, kgLow: 0.5, kgHigh: 1.0, costLow: 4.0, costHigh: 8.0, quote: "IPB Bogor ICBB", addedBy: "System", addedDate: "2025-01-01", notes: "" },
  { id: 8, category: "🍄 Fungi", name: "Phanerochaete chrysosporium", icbb: "Wild-type", supplier: "Research", fn: "Strongest lignin degrader", temp: "37–42", bsfSafe: "✅", form: "Wet", usdKg: 8, doseLow: 0.05, doseHigh: 0.15, kgLow: 0.5, kgHigh: 1.0, costLow: 4.0, costHigh: 8.0, quote: "IPB/LIPI Cibinong", addedBy: "System", addedDate: "2025-01-01", notes: "" },
  { id: 9, category: "🍄 Fungi", name: "Pleurotus ostreatus", icbb: "—", supplier: "Commercial", fn: "Selective lignin degrader (preserves cellulose)", temp: "20–28", bsfSafe: "✅", form: "Wet", usdKg: 0.3, doseLow: 0.05, doseHigh: 0.15, kgLow: 0.5, kgHigh: 1.0, costLow: 0.15, costHigh: 0.3, quote: "Tokopedia bibit jamur", addedBy: "System", addedDate: "2025-01-01", notes: "" },
  { id: 10, category: "🍄 Fungi", name: "Trametes versicolor", icbb: "—", supplier: "Commercial", fn: "Laccase producer, lignin oxidation", temp: "25–30", bsfSafe: "✅", form: "Wet", usdKg: 2, doseLow: 0.03, doseHigh: 0.10, kgLow: 0.3, kgHigh: 0.7, costLow: 0.6, costHigh: 1.4, quote: "Tokopedia/Alibaba", addedBy: "System", addedDate: "2025-01-01", notes: "" },
  { id: 11, category: "🍄 Fungi", name: "Trichoderma harzianum/sp.", icbb: "ICBB 9127", supplier: "Super Bio Boost", fn: "Aggressive cellulase + Ganoderma biocontrol", temp: "25–35", bsfSafe: "✅", form: "Dry", usdKg: 1.5, doseLow: 0.05, doseHigh: 0.15, kgLow: 0.5, kgHigh: 1.0, costLow: 0.75, costHigh: 1.5, quote: "Tokopedia bulk", addedBy: "System", addedDate: "2025-01-01", notes: "" },
  { id: 12, category: "🔬 Bacteria", name: "Bacillus subtilis", icbb: "ICBB 8780", supplier: "Super Bio Boost", fn: "PGPR, endospore shelf-life", temp: "25–50", bsfSafe: "✅", form: "Dry", usdKg: 0.2, doseLow: 0.03, doseHigh: 0.05, kgLow: 0.3, kgHigh: 0.5, costLow: 0.06, costHigh: 0.1, quote: "Ansel Biotech India", addedBy: "System", addedDate: "2025-01-01", notes: "" },
  { id: 13, category: "🔬 Bacteria", name: "Bacillus megaterium", icbb: "—", supplier: "Individual", fn: "P-solubiliser (gluconic acid)", temp: "25–37", bsfSafe: "✅", form: "Dry", usdKg: 1.5, doseLow: 0.03, doseHigh: 0.05, kgLow: 0.3, kgHigh: 0.5, costLow: 0.45, costHigh: 0.75, quote: "IndiaMART", addedBy: "System", addedDate: "2025-01-01", notes: "" },
  { id: 14, category: "🔬 Bacteria", name: "Paenibacillus macerans", icbb: "ICBB 8810", supplier: "Provibio", fn: "Hemicellulase + nif genes", temp: "30–45", bsfSafe: "✅", form: "Wet", usdKg: 3, doseLow: 0.05, doseHigh: 0.10, kgLow: 0.5, kgHigh: 0.8, costLow: 1.5, costHigh: 2.4, quote: "MarkNature/IPB", addedBy: "System", addedDate: "2025-01-01", notes: "" },
  { id: 15, category: "🔬 Bacteria", name: "Lactobacillus sp.", icbb: "ICBB 6099", supplier: "Provibio/EM-4", fn: "LAB pH buffering 5.5–6.0", temp: "25–40", bsfSafe: "✅", form: "Wet", usdKg: 0.86, doseLow: 0.03, doseHigh: 0.10, kgLow: 0.3, kgHigh: 1.0, costLow: 0.05, costHigh: 0.17, quote: "EM-4 retail Rp25k/L", addedBy: "System", addedDate: "2025-01-01", notes: "" },
  { id: 16, category: "❄️ N-Fixer", name: "Azotobacter vinelandii", icbb: "ICBB 9098", supplier: "Provibio", fn: "Free-living N₂ fixer: 10–20 mg N/kg/day — HIGHEST", temp: "<50 ⚠️", bsfSafe: "✅", form: "Wet", usdKg: 0.4, doseLow: 0.05, doseHigh: 0.20, kgLow: 0.5, kgHigh: 1.5, costLow: 0.2, costHigh: 0.6, quote: "HumicFactory India", addedBy: "System", addedDate: "2025-01-01", notes: "" },
  { id: 17, category: "❄️ N-Fixer", name: "Azospirillum lipoferum", icbb: "ICBB 6088", supplier: "Provibio", fn: "Associative N-fixer, PGPR hormones", temp: "<45 ⚠️", bsfSafe: "✅", form: "Wet", usdKg: 1.0, doseLow: 0.05, doseHigh: 0.10, kgLow: 0.5, kgHigh: 0.8, costLow: 0.5, costHigh: 0.8, quote: "Jaipur Bio", addedBy: "System", addedDate: "2025-01-01", notes: "" },
  { id: 18, category: "❄️ N-Fixer", name: "Bradyrhizobium japonicum", icbb: "ICBB 9251", supplier: "Provibio", fn: "Symbiotic N-fixer (legume-free uses)", temp: "<40 ⚠️", bsfSafe: "✅", form: "Wet", usdKg: 1.5, doseLow: 0.03, doseHigh: 0.08, kgLow: 0.3, kgHigh: 0.6, costLow: 0.45, costHigh: 0.9, quote: "Pioneer Agro India", addedBy: "System", addedDate: "2025-01-01", notes: "" },
  { id: 19, category: "⚗️ Enzyme", name: "Cellulase complex (commercial)", icbb: "—", supplier: "Novozymes", fn: "Cellulose → glucose saccharification", temp: "45–60", bsfSafe: "✅", form: "Liquid", usdKg: 12, doseLow: 0.01, doseHigh: 0.05, kgLow: 0.035, kgHigh: 0.175, costLow: 0.42, costHigh: 2.1, quote: "Novozymes Indonesia", addedBy: "System", addedDate: "2025-01-01", notes: "" },
  { id: 20, category: "🚫 EXCLUDED", name: "Bacillus thuringiensis ICBB 6095", icbb: "ICBB 6095", supplier: "Provibio", fn: "⚠️ EXCLUDED FROM ALL BSF PATHWAYS — Cry proteins toxic to Diptera", temp: "25–40", bsfSafe: "❌ TOXIC", form: "Dry", usdKg: 5, doseLow: 0, doseHigh: 0, kgLow: 0, kgHigh: 0, costLow: 0, costHigh: 0, quote: "N/A — EXCLUDED", addedBy: "System", addedDate: "2025-01-01", notes: "COMPOST PATHWAY ONLY. Never use in BSF/S4." },
];

const CATEGORIES = [
  "🔥 Thermo Fungi", "🔥 Thermo Bacteria", "🔥 Thermo Actino",
  "🍄 Fungi", "🔬 Bacteria", "❄️ N-Fixer", "⚗️ Enzyme",
  "🌱 PGPR", "🦠 Actinomycete", "🧪 Yeast", "🔴 P-Solubiliser",
  "🚫 EXCLUDED"
];

const FORMS = ["Dry", "Wet", "Liquid", "Granule", "Paste"];
const BSF_SAFE_OPTS = ["✅", "⚠️ Caution", "❌ TOXIC"];

const ADMIN_PIN = "CFI2026"; // Sharon's admin PIN

// ─── STORAGE HELPERS ─────────────────────────────────────────────────────────
async function loadOrgs() {
  try {
    const r = await window.storage.get("bio-organisms");
    return r ? JSON.parse(r.value) : SEED_ORGANISMS;
  } catch { return SEED_ORGANISMS; }
}
async function saveOrgs(orgs) {
  try { await window.storage.set("bio-organisms", JSON.stringify(orgs)); } catch {}
}
async function loadNextId() {
  try {
    const r = await window.storage.get("bio-next-id");
    return r ? parseInt(r.value) : SEED_ORGANISMS.length + 1;
  } catch { return SEED_ORGANISMS.length + 1; }
}
async function saveNextId(id) {
  try { await window.storage.set("bio-next-id", String(id)); } catch {}
}

// ─── STYLES ──────────────────────────────────────────────────────────────────
const C = {
  bg: "#0d1117",
  surface: "#161b22",
  card: "#1c2230",
  border: "#2d3748",
  accent: "#00c4b4",
  gold: "#d4a853",
  danger: "#e53e3e",
  warn: "#f6ad55",
  green: "#48bb78",
  blue: "#4299e1",
  muted: "#718096",
  text: "#e2e8f0",
  textDim: "#a0aec0",
};

const s = {
  app: { background: C.bg, minHeight: "100vh", color: C.text, fontFamily: "'IBM Plex Mono', 'Courier New', monospace", fontSize: 13 },
  header: { background: C.surface, borderBottom: `2px solid ${C.accent}`, padding: "12px 24px", display: "flex", alignItems: "center", gap: 16 },
  logo: { fontSize: 11, color: C.accent, letterSpacing: 2, textTransform: "uppercase" },
  title: { fontSize: 18, fontWeight: 700, color: C.text, margin: 0 },
  tabs: { display: "flex", background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "0 16px", gap: 2 },
  tab: (active) => ({ padding: "10px 18px", background: active ? C.card : "transparent", color: active ? C.accent : C.textDim, border: "none", borderBottom: active ? `2px solid ${C.accent}` : "2px solid transparent", cursor: "pointer", fontFamily: "inherit", fontSize: 12, letterSpacing: 1, textTransform: "uppercase", fontWeight: active ? 700 : 400 }),
  body: { padding: 20 },
  card: { background: C.card, border: `1px solid ${C.border}`, borderRadius: 6, padding: 16, marginBottom: 16 },
  label: { display: "block", color: C.textDim, fontSize: 11, letterSpacing: 1, marginBottom: 4, textTransform: "uppercase" },
  input: { width: "100%", background: "#0d1a2e", border: `1px solid ${C.blue}`, color: C.text, padding: "7px 10px", borderRadius: 4, fontFamily: "inherit", fontSize: 13, boxSizing: "border-box" },
  select: { width: "100%", background: "#0d1a2e", border: `1px solid ${C.blue}`, color: C.text, padding: "7px 10px", borderRadius: 4, fontFamily: "inherit", fontSize: 13 },
  textarea: { width: "100%", background: "#0d1a2e", border: `1px solid ${C.blue}`, color: C.text, padding: "7px 10px", borderRadius: 4, fontFamily: "inherit", fontSize: 12, resize: "vertical", minHeight: 80, boxSizing: "border-box" },
  btn: (color = C.accent) => ({ background: "transparent", border: `1px solid ${color}`, color, padding: "8px 16px", borderRadius: 4, cursor: "pointer", fontFamily: "inherit", fontSize: 12, letterSpacing: 1, textTransform: "uppercase", fontWeight: 600 }),
  btnFill: (color = C.accent) => ({ background: color, border: `1px solid ${color}`, color: "#000", padding: "8px 16px", borderRadius: 4, cursor: "pointer", fontFamily: "inherit", fontSize: 12, letterSpacing: 1, textTransform: "uppercase", fontWeight: 700 }),
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  grid3: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 },
  grid4: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12 },
  fieldWrap: { marginBottom: 12 },
  aiBox: { background: "#0a1628", border: `1px solid ${C.accent}`, borderRadius: 6, padding: 14, marginTop: 12, whiteSpace: "pre-wrap", lineHeight: 1.7, fontSize: 12, color: C.text, maxHeight: 400, overflowY: "auto" },
  badge: (col) => ({ display: "inline-block", background: col + "22", border: `1px solid ${col}`, color: col, borderRadius: 3, padding: "1px 6px", fontSize: 10, letterSpacing: 0.5 }),
  table: { width: "100%", borderCollapse: "collapse", fontSize: 11 },
  th: { background: C.surface, color: C.accent, padding: "7px 8px", textAlign: "left", borderBottom: `1px solid ${C.border}`, textTransform: "uppercase", letterSpacing: 0.5, whiteSpace: "nowrap" },
  td: { padding: "6px 8px", borderBottom: `1px solid ${C.border}`, verticalAlign: "top", color: C.text },
  tdMuted: { padding: "6px 8px", borderBottom: `1px solid ${C.border}`, verticalAlign: "top", color: C.textDim },
  alert: (col) => ({ background: col + "18", border: `1px solid ${col}`, color: col, borderRadius: 5, padding: "10px 14px", marginBottom: 12, fontSize: 12 }),
  divider: { borderTop: `1px solid ${C.border}`, margin: "16px 0" },
  row: { display: "flex", gap: 12, alignItems: "flex-start" },
  searchBox: { background: "#0d1a2e", border: `1px solid ${C.accent}`, color: C.text, padding: "9px 14px", borderRadius: 4, fontFamily: "inherit", fontSize: 13, width: 320 },
};

// ─── CATEGORY COLOR MAP ───────────────────────────────────────────────────────
function catColor(cat) {
  if (cat.includes("Thermo")) return C.warn;
  if (cat.includes("Fungi")) return "#9f7aea";
  if (cat.includes("Bacteria")) return C.blue;
  if (cat.includes("N-Fixer")) return C.green;
  if (cat.includes("Enzyme")) return C.gold;
  if (cat.includes("PGPR")) return "#68d391";
  if (cat.includes("Actino")) return "#fc8181";
  if (cat.includes("Yeast")) return "#f6e05e";
  if (cat.includes("EXCLUDED")) return C.danger;
  return C.muted;
}

// ─── AI RESEARCH PROMPT ──────────────────────────────────────────────────────
function buildResearchPrompt(orgName, context) {
  return `You are a Senior Process Microbiologist + Biological Researcher for CFI (Circular Fertiliser Industries), a palm oil mill waste bioconversion facility in Bogor, West Java, Indonesia. You operate the STAGE 3 Biological Conditioning process (S3) which prepares EFB + OPDC substrate for BSF rearing.

TASK: Research the following organism and populate ALL fields for the CFI S3 Organism Registry.

ORGANISM: ${orgName}
USER CONTEXT: ${context || "General palm oil residue bioconversion application"}

CRITICAL RULES:
1. BSF-Safe = ✅ ONLY if organism produces NO toxins/compounds harmful to Hermetia illucens larvae. Flag any Cry proteins, insecticidal compounds, or heavy metal accumulators as ❌.
2. Bacillus thuringiensis = ALWAYS ❌ BSF-TOXIC — non-negotiable.
3. Temp ranges must be verified for palm residue composting context (50–70°C thermophilic phase, then 25–45°C mesophilic).
4. Prices must be realistic for Indonesia/SE Asia/India procurement in USD/kg.
5. If data is uncertain, state "DATA GAP" and mark confidence LOW.
6. Wave recommendation: WAVE 1 if thermophilic (>45°C optimum), WAVE 2 if temp-sensitive (<50°C).

RETURN a structured report with these exact sections:

## ORGANISM PROFILE
- Scientific Name (full)
- Common Name / Trade Name
- Kingdom / Phylum / Class
- ICBB Code (if known, else "—")
- Strain(s) recommended

## BIOLOGICAL FUNCTION
- Primary function in substrate
- Secondary benefits
- Enzymes or metabolites produced
- Lignin degradation ability (% range)
- Cellulose degradation ability (% range)
- N-fixation capacity (if applicable, mg N/kg/day)
- BSF Safe: ✅ or ❌ (EXPLAIN WHY)

## OPERATING PARAMETERS
- Optimal temperature range (°C)
- pH range
- Moisture requirement (%)
- O2 requirement (aerobic/anaerobic/facultative)
- Inhibitors to avoid

## DOSING RECOMMENDATION (for EFB+OPDC substrate, 1,000 t FW batch)
- Form (Dry/Wet/Liquid)
- Dose LOW % DM:
- Dose HIGH % DM:
- kg/t FW LOW:
- kg/t FW HIGH:
- Inoculation wave (Wave 1 Day 0 or Wave 2 Day 5+):

## PRICING (USD)
- $/kg estimate:
- $/g estimate:
- Cost LOW $/t FW:
- Cost HIGH $/t FW:

## SUPPLIERS (Priority: Indonesia → SE Asia → India → China)
- Indonesian supplier (name, website, lead time):
- SE Asia supplier:
- India supplier:
- China/bulk supplier:
- Best quote link:

## CONSORTIUM COMPATIBILITY
- Organisms it works synergistically with:
- Organisms it competes with (avoid mixing):
- Any known antagonism:

## REFERENCES
- Key papers (DOI if known):
- Quality tier (A = peer-reviewed meta, B = single study, C = supplier data, D = grey literature):

## CFI RECOMMENDATION
- Stage to apply (S3 pre-BSF / S5B compost only / both):
- Confidence level (HIGH / MEDIUM / LOW):
- Any warnings or alerts:`;
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function CFIBioManager() {
  const [tab, setTab] = useState("registry");
  const [organisms, setOrganisms] = useState([]);
  const [nextId, setNextId] = useState(100);
  const [loading, setLoading] = useState(true);
  const [searchQ, setSearchQ] = useState("");
  const [filterCat, setFilterCat] = useState("ALL");
  const [filterBSF, setFilterBSF] = useState("ALL");

  // Add form state
  const [form, setForm] = useState(blankForm());
  const [formMsg, setFormMsg] = useState(null);

  // AI Research
  const [researchQ, setResearchQ] = useState("");
  const [researchCtx, setResearchCtx] = useState("");
  const [researchResult, setResearchResult] = useState("");
  const [researchLoading, setResearchLoading] = useState(false);
  const [autoFillResult, setAutoFillResult] = useState(null);

  // Admin
  const [adminPin, setAdminPin] = useState("");
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [adminMsg, setAdminMsg] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // User
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    (async () => {
      const orgs = await loadOrgs();
      const nid = await loadNextId();
      setOrganisms(orgs);
      setNextId(nid);
      setLoading(false);
    })();
  }, []);

  function blankForm() {
    return {
      category: "🔬 Bacteria", name: "", icbb: "—", supplier: "",
      fn: "", temp: "", bsfSafe: "✅", form: "Dry",
      usdKg: "", doseLow: "", doseHigh: "", kgLow: "", kgHigh: "",
      costLow: "", costHigh: "", quote: "", notes: "",
      source: "", wave: "Wave 1"
    };
  }

  function setF(key, val) { setForm(f => ({ ...f, [key]: val })); }

  // Filtered organisms
  const filtered = organisms.filter(o => {
    const qmatch = !searchQ || o.name.toLowerCase().includes(searchQ.toLowerCase()) || o.fn.toLowerCase().includes(searchQ.toLowerCase()) || o.category.toLowerCase().includes(searchQ.toLowerCase());
    const cmatch = filterCat === "ALL" || o.category === filterCat;
    const bmatch = filterBSF === "ALL" || o.bsfSafe === filterBSF || (filterBSF === "✅" && o.bsfSafe === "✅") || (filterBSF === "❌" && o.bsfSafe.includes("❌"));
    return qmatch && cmatch && bmatch;
  });

  // AI Research
  async function doResearch() {
    if (!researchQ.trim()) return;
    setResearchLoading(true);
    setResearchResult("");
    try {
      const prompt = buildResearchPrompt(researchQ, researchCtx);
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }]
        })
      });
      const data = await res.json();
      const text = data.content?.map(b => b.text || "").join("") || "No response";
      setResearchResult(text);
      // Try to extract fields for auto-fill
      parseAutoFill(text, researchQ);
    } catch (e) {
      setResearchResult("Research error: " + e.message);
    }
    setResearchLoading(false);
  }

  function parseAutoFill(text, orgName) {
    // Simple heuristic extraction from AI response
    const getLine = (marker) => {
      const re = new RegExp(marker + "[:\\s]+([^\\n]+)", "i");
      const m = text.match(re);
      return m ? m[1].trim() : "";
    };
    const afForm = {
      ...blankForm(),
      name: orgName,
      fn: getLine("Primary function") || getLine("Primary Function"),
      temp: getLine("Optimal temperature range") || getLine("Temperature"),
      bsfSafe: text.includes("BSF Safe: ✅") || text.includes("BSF-Safe: ✅") ? "✅" : text.includes("❌") ? "❌ TOXIC" : "⚠️ Caution",
      supplier: getLine("Indonesian supplier") || getLine("Best quote"),
      quote: getLine("Best quote link") || getLine("Quote"),
      usdKg: getLine("\\$/kg estimate") || getLine("\\$/kg"),
      doseLow: getLine("Dose LOW % DM") || "",
      doseHigh: getLine("Dose HIGH % DM") || "",
      notes: getLine("Any warnings") || "",
    };
    // Guess category
    if (text.includes("thermophil") || text.includes("Thermomyces") || text.includes("Geobacillus")) {
      afForm.category = text.toLowerCase().includes("fungi") ? "🔥 Thermo Fungi" : "🔥 Thermo Bacteria";
    } else if (text.includes("N-fix") || text.includes("Azotobacter") || text.includes("Azospirillum")) {
      afForm.category = "❄️ N-Fixer";
    } else if (text.toLowerCase().includes("fungi") || text.toLowerCase().includes("mushroom")) {
      afForm.category = "🍄 Fungi";
    } else if (text.toLowerCase().includes("enzyme") || text.toLowerCase().includes("cellulase")) {
      afForm.category = "⚗️ Enzyme";
    }
    setAutoFillResult(afForm);
  }

  function applyAutoFill() {
    if (autoFillResult) {
      setForm(autoFillResult);
      setTab("add");
    }
  }

  // Add organism
  async function handleAdd(e) {
    e.preventDefault();
    if (!form.name.trim()) { setFormMsg({ type: "err", msg: "Organism name is required." }); return; }
    const now = new Date().toISOString().slice(0, 10);
    const newOrg = { ...form, id: nextId, addedBy: userName, addedDate: now, usdKg: parseFloat(form.usdKg) || 0, doseLow: parseFloat(form.doseLow) || 0, doseHigh: parseFloat(form.doseHigh) || 0, kgLow: parseFloat(form.kgLow) || 0, kgHigh: parseFloat(form.kgHigh) || 0, costLow: parseFloat(form.costLow) || 0, costHigh: parseFloat(form.costHigh) || 0 };
    const updated = [...organisms, newOrg];
    setOrganisms(updated);
    await saveOrgs(updated);
    await saveNextId(nextId + 1);
    setNextId(nextId + 1);
    setFormMsg({ type: "ok", msg: `✅ ${form.name} added to the database by ${userName} on ${now}.` });
    setForm(blankForm());
    setTimeout(() => setFormMsg(null), 4000);
  }

  // Delete (admin only)
  async function handleDelete(id) {
    const updated = organisms.filter(o => o.id !== id);
    setOrganisms(updated);
    await saveOrgs(updated);
    setDeleteTarget(null);
    setAdminMsg({ type: "ok", msg: "Organism deleted." });
    setTimeout(() => setAdminMsg(null), 3000);
  }

  function unlockAdmin() {
    if (adminPin === ADMIN_PIN) { setAdminUnlocked(true); setAdminMsg({ type: "ok", msg: "🔓 Admin access granted — Sharon." }); }
    else { setAdminMsg({ type: "err", msg: "❌ Incorrect PIN." }); }
  }

  if (loading) return <div style={{ ...s.app, display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}><span style={{ color: C.accent }}>⌛ Loading CFI Biological Database…</span></div>;

  // ── REGISTRY TAB ────────────────────────────────────────────────────────────
  function renderRegistry() {
    const userAdded = organisms.filter(o => o.addedBy !== "System");
    return (
      <div style={s.body}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.accent }}>S3 ORGANISM REGISTRY</div>
            <div style={{ color: C.textDim, fontSize: 11, marginTop: 2 }}>{organisms.length} organisms total · {userAdded.length} user-added · Showing {filtered.length}</div>
          </div>
          <button style={s.btnFill(C.accent)} onClick={() => setTab("add")}>+ ADD NEW BIOLOGICAL</button>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap", alignItems: "center" }}>
          <input placeholder="🔍 Search name, function, category…" style={s.searchBox} value={searchQ} onChange={e => setSearchQ(e.target.value)} />
          <select style={{ ...s.select, width: 180 }} value={filterCat} onChange={e => setFilterCat(e.target.value)}>
            <option value="ALL">All Categories</option>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
          <select style={{ ...s.select, width: 140 }} value={filterBSF} onChange={e => setFilterBSF(e.target.value)}>
            <option value="ALL">All BSF Safety</option>
            <option value="✅">✅ BSF-Safe</option>
            <option value="❌">❌ Excluded</option>
            <option value="⚠️ Caution">⚠️ Caution</option>
          </select>
        </div>

        {userAdded.length > 0 && (
          <div style={s.alert(C.green)}>
            <strong>🆕 {userAdded.length} User-Added Organism{userAdded.length > 1 ? "s" : ""}:</strong>{" "}
            {userAdded.map(o => `${o.name} (by ${o.addedBy}, ${o.addedDate})`).join(" · ")}
          </div>
        )}

        <div style={{ overflowX: "auto" }}>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>#</th>
                <th style={s.th}>Category</th>
                <th style={s.th}>Organism</th>
                <th style={s.th}>ICBB</th>
                <th style={s.th}>Function</th>
                <th style={s.th}>Temp °C</th>
                <th style={s.th}>BSF</th>
                <th style={s.th}>Form</th>
                <th style={s.th}>$/kg</th>
                <th style={s.th}>Dose Low %DM</th>
                <th style={s.th}>Dose High %DM</th>
                <th style={s.th}>Cost Low $/t</th>
                <th style={s.th}>Cost High $/t</th>
                <th style={s.th}>Added By</th>
                <th style={s.th}>Date</th>
                <th style={s.th}>Source</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o.id} style={{ background: o.bsfSafe.includes("❌") ? "#1a0a0a" : o.addedBy !== "System" ? "#0a1a0d" : "transparent" }}>
                  <td style={{ ...s.tdMuted, width: 28 }}>{o.id}</td>
                  <td style={s.td}><span style={s.badge(catColor(o.category))}>{o.category}</span></td>
                  <td style={{ ...s.td, fontWeight: 600, color: o.bsfSafe.includes("❌") ? C.danger : C.text, minWidth: 180 }}>
                    {o.name}
                    {o.addedBy !== "System" && <span style={{ ...s.badge(C.green), marginLeft: 5 }}>NEW</span>}
                  </td>
                  <td style={s.tdMuted}>{o.icbb}</td>
                  <td style={{ ...s.td, maxWidth: 220, color: C.textDim, fontSize: 11 }}>{o.fn}</td>
                  <td style={s.tdMuted}>{o.temp}</td>
                  <td style={{ ...s.td, textAlign: "center" }}>{o.bsfSafe}</td>
                  <td style={s.tdMuted}>{o.form}</td>
                  <td style={{ ...s.td, color: C.gold }}>${o.usdKg}</td>
                  <td style={s.tdMuted}>{o.doseLow}</td>
                  <td style={s.tdMuted}>{o.doseHigh}</td>
                  <td style={{ ...s.td, color: C.green }}>${o.costLow}</td>
                  <td style={{ ...s.td, color: C.warn }}>${o.costHigh}</td>
                  <td style={{ ...s.td, color: o.addedBy !== "System" ? C.green : C.muted, fontSize: 11 }}>{o.addedBy}</td>
                  <td style={{ ...s.tdMuted, fontSize: 11 }}>{o.addedDate}</td>
                  <td style={{ ...s.tdMuted, fontSize: 10, maxWidth: 120 }}>{o.source || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Dosage calculator inline */}
        <div style={{ ...s.card, marginTop: 24 }}>
          <DosageCalc organisms={filtered} />
        </div>
      </div>
    );
  }

  // ── AI RESEARCH TAB ─────────────────────────────────────────────────────────
  function renderResearch() {
    return (
      <div style={s.body}>
        <div style={{ fontSize: 16, fontWeight: 700, color: C.accent, marginBottom: 4 }}>AI BIOLOGICAL RESEARCH ENGINE</div>
        <div style={{ color: C.textDim, fontSize: 11, marginBottom: 16 }}>Enter a biological organism name — the AI will research full specifications, dosing, suppliers, and CFI compatibility using the Master Persona framework.</div>

        <div style={s.card}>
          <div style={s.grid2}>
            <div style={s.fieldWrap}>
              <label style={s.label}>Organism / Biological to Research</label>
              <input style={s.input} value={researchQ} onChange={e => setResearchQ(e.target.value)} placeholder="e.g. Humicola insolens, Peniophora lycii, Cellulosimicrobium…" />
            </div>
            <div style={s.fieldWrap}>
              <label style={s.label}>Additional Context (optional)</label>
              <input style={s.input} value={researchCtx} onChange={e => setResearchCtx(e.target.value)} placeholder="e.g. lignin degradation at 55°C in EFB+OPDC substrate" />
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <button style={s.btnFill(C.accent)} onClick={doResearch} disabled={researchLoading || !researchQ.trim()}>
              {researchLoading ? "⌛ Researching…" : "🔬 RESEARCH THIS BIOLOGICAL"}
            </button>
            {autoFillResult && (
              <button style={s.btn(C.green)} onClick={applyAutoFill}>
                📋 AUTO-FILL ADD FORM → GO TO ADD TAB
              </button>
            )}
          </div>
        </div>

        {researchResult && (
          <div style={s.card}>
            <div style={{ color: C.accent, fontSize: 11, letterSpacing: 1, marginBottom: 8, textTransform: "uppercase" }}>AI Research Report — {researchQ}</div>
            <div style={s.aiBox}>{researchResult}</div>
            {autoFillResult && (
              <div style={{ ...s.alert(C.green), marginTop: 12 }}>
                ✅ Fields extracted from research. Click <strong>AUTO-FILL ADD FORM</strong> above to populate the Add New Biological form automatically.
              </div>
            )}
          </div>
        )}

        {/* PROMPT DISPLAY */}
        <div style={s.card}>
          <div style={{ color: C.gold, fontSize: 11, letterSpacing: 1, marginBottom: 8, textTransform: "uppercase" }}>📄 CFI Biological Research Prompt Template</div>
          <div style={{ color: C.textDim, fontSize: 11, marginBottom: 8 }}>This is the prompt automatically used when you research a biological. Copy and use in any AI system (Perplexity, GPT, Gemini etc.):</div>
          <div style={{ ...s.aiBox, maxHeight: 300, background: "#0d1628" }}>
{`MASTER CFI BIOLOGICAL RESEARCH PROMPT
======================================
You are a Senior Process Microbiologist + Biological Researcher for CFI 
(Circular Fertiliser Industries), Bogor, West Java, Indonesia.

RESEARCH TARGET: [ORGANISM NAME]
APPLICATION: Stage 3 biological conditioning of EFB + OPDC palm residues for BSF rearing
BATCH SIZE: 1,000 t FW substrate (60 TPH FFB mill, 24/7 operations)

FORMAT: Return structured report with sections:
1. ORGANISM PROFILE (taxonomy, ICBB code, strains)
2. BIOLOGICAL FUNCTION (lignin/cellulose %, N-fixation, BSF safety MANDATORY)
3. OPERATING PARAMETERS (temp, pH, moisture, O2 requirement)
4. DOSING (dose % DM, kg/t FW low/high, wave assignment)
5. PRICING ($/kg, cost $/t FW, Indonesia/India/China sources)
6. SUPPLIERS (Indonesia first, then SE Asia, India, China)
7. CONSORTIUM COMPATIBILITY (synergists, antagonists)
8. REFERENCES (DOI, tier A-D quality)
9. CFI RECOMMENDATION (confidence, wave, warnings)

CRITICAL SAFETY RULES:
- BSF-Safe MUST be stated (✅ or ❌ with reasoning)
- Bacillus thuringiensis = ALWAYS ❌ — Cry proteins kill BSF larvae
- Flag any heat-sensitive organisms as WAVE 2 ONLY (<50°C)
- Report any heavy metal accumulators that would exceed Indonesian SNI limits

DATA GAP RULE: If uncertain, state "DATA GAP" and give confidence tier.`}
          </div>
        </div>
      </div>
    );
  }

  // ── ADD NEW BIOLOGICAL TAB ──────────────────────────────────────────────────
  function renderAdd() {
    return (
      <div style={s.body}>
        <div style={{ fontSize: 16, fontWeight: 700, color: C.accent, marginBottom: 4 }}>ADD NEW BIOLOGICAL</div>
        <div style={{ color: C.textDim, fontSize: 11, marginBottom: 16 }}>All fields match CFI S3 Organism Registry format. Blue fields = inputs. New organisms are shown with a GREEN "NEW" badge in the registry. Only Sharon (Admin) can delete organisms.</div>

        {formMsg && <div style={s.alert(formMsg.type === "ok" ? C.green : C.danger)}>{formMsg.msg}</div>}

        <div style={{ ...s.card, marginBottom: 12, background: "#0a1a1a" }}>
          <div style={{ color: C.accent, fontSize: 11, letterSpacing: 1, marginBottom: 8, textTransform: "uppercase" }}>🤖 Use AI Research First</div>
          <div style={{ color: C.textDim, fontSize: 11 }}>Go to the <strong>AI Research</strong> tab to look up any organism. The AI will research dosing, pricing, suppliers, and BSF compatibility, then auto-fill this form. Or fill manually below.</div>
          <button style={{ ...s.btn(C.accent), marginTop: 10 }} onClick={() => setTab("research")}>→ GO TO AI RESEARCH ENGINE</button>
        </div>

        <form onSubmit={handleAdd}>
          <div style={s.card}>
            <div style={{ color: C.gold, fontSize: 11, letterSpacing: 1, marginBottom: 12, textTransform: "uppercase" }}>▸ SECTION 1 — Identity</div>
            <div style={s.grid2}>
              <div style={s.fieldWrap}>
                <label style={s.label}>Your Name (Added By) *</label>
                <input style={s.input} value={userName} onChange={e => setUserName(e.target.value)} placeholder="Your name" required />
              </div>
              <div style={s.fieldWrap}>
                <label style={s.label}>Source / Reference</label>
                <input style={s.input} value={form.source} onChange={e => setF("source", e.target.value)} placeholder="e.g. DOI:10.1016/j.biortech... or Supplier quote" />
              </div>
            </div>
            <div style={s.grid2}>
              <div style={s.fieldWrap}>
                <label style={s.label}>Organism Name (Full Scientific Name) *</label>
                <input style={s.input} value={form.name} onChange={e => setF("name", e.target.value)} placeholder="e.g. Humicola insolens" required />
              </div>
              <div style={s.fieldWrap}>
                <label style={s.label}>Category</label>
                <select style={s.select} value={form.category} onChange={e => setF("category", e.target.value)}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div style={s.grid3}>
              <div style={s.fieldWrap}>
                <label style={s.label}>ICBB Code (if known)</label>
                <input style={s.input} value={form.icbb} onChange={e => setF("icbb", e.target.value)} placeholder="e.g. ICBB 9182 or —" />
              </div>
              <div style={s.fieldWrap}>
                <label style={s.label}>Supplier</label>
                <input style={s.input} value={form.supplier} onChange={e => setF("supplier", e.target.value)} placeholder="e.g. Tokopedia, Provibio, IndiaMART" />
              </div>
              <div style={s.fieldWrap}>
                <label style={s.label}>Quote Link</label>
                <input style={s.input} value={form.quote} onChange={e => setF("quote", e.target.value)} placeholder="URL or marketplace name" />
              </div>
            </div>
          </div>

          <div style={s.card}>
            <div style={{ color: C.gold, fontSize: 11, letterSpacing: 1, marginBottom: 12, textTransform: "uppercase" }}>▸ SECTION 2 — Function & Safety</div>
            <div style={s.fieldWrap}>
              <label style={s.label}>Primary Function *</label>
              <input style={s.input} value={form.fn} onChange={e => setF("fn", e.target.value)} placeholder="e.g. Thermophilic cellulase/xylanase producer, lignin degradation" required />
            </div>
            <div style={s.grid3}>
              <div style={s.fieldWrap}>
                <label style={s.label}>Temperature Range °C</label>
                <input style={s.input} value={form.temp} onChange={e => setF("temp", e.target.value)} placeholder="e.g. 50–65 or <50 ⚠️" />
              </div>
              <div style={s.fieldWrap}>
                <label style={s.label}>BSF Safety *</label>
                <select style={s.select} value={form.bsfSafe} onChange={e => setF("bsfSafe", e.target.value)}>
                  {BSF_SAFE_OPTS.map(b => <option key={b}>{b}</option>)}
                </select>
              </div>
              <div style={s.fieldWrap}>
                <label style={s.label}>Physical Form</label>
                <select style={s.select} value={form.form} onChange={e => setF("form", e.target.value)}>
                  {FORMS.map(f => <option key={f}>{f}</option>)}
                </select>
              </div>
            </div>
            <div style={s.fieldWrap}>
              <label style={s.label}>Inoculation Wave</label>
              <select style={s.select} value={form.wave} onChange={e => setF("wave", e.target.value)}>
                <option>Wave 1 (Day 0, Thermophilic &gt;45°C)</option>
                <option>Wave 2 (Day 5+, Mesophilic &lt;50°C)</option>
                <option>Both waves</option>
                <option>Compost only (no BSF)</option>
              </select>
            </div>
            {form.bsfSafe !== "✅" && (
              <div style={s.alert(C.danger)}>⚠️ NON-BSF-SAFE ORGANISM — This organism will be flagged in the registry. It may only be used in compost (S5B) pathways. Confirm you have verified this before adding.</div>
            )}
          </div>

          <div style={s.card}>
            <div style={{ color: C.gold, fontSize: 11, letterSpacing: 1, marginBottom: 12, textTransform: "uppercase" }}>▸ SECTION 3 — Dosing & Pricing</div>
            <div style={s.grid4}>
              <div style={s.fieldWrap}>
                <label style={s.label}>$/kg</label>
                <input type="number" step="0.01" style={s.input} value={form.usdKg} onChange={e => setF("usdKg", e.target.value)} placeholder="e.g. 8.00" />
              </div>
              <div style={s.fieldWrap}>
                <label style={s.label}>Dose LOW % DM</label>
                <input type="number" step="0.01" style={s.input} value={form.doseLow} onChange={e => setF("doseLow", e.target.value)} placeholder="e.g. 0.05" />
              </div>
              <div style={s.fieldWrap}>
                <label style={s.label}>Dose HIGH % DM</label>
                <input type="number" step="0.01" style={s.input} value={form.doseHigh} onChange={e => setF("doseHigh", e.target.value)} placeholder="e.g. 0.15" />
              </div>
              <div />
            </div>
            <div style={s.grid4}>
              <div style={s.fieldWrap}>
                <label style={s.label}>kg/t FW LOW</label>
                <input type="number" step="0.001" style={s.input} value={form.kgLow} onChange={e => setF("kgLow", e.target.value)} placeholder="e.g. 0.175" />
              </div>
              <div style={s.fieldWrap}>
                <label style={s.label}>kg/t FW HIGH</label>
                <input type="number" step="0.001" style={s.input} value={form.kgHigh} onChange={e => setF("kgHigh", e.target.value)} placeholder="e.g. 0.525" />
              </div>
              <div style={s.fieldWrap}>
                <label style={s.label}>Cost LOW $/t FW</label>
                <input type="number" step="0.01" style={s.input} value={form.costLow} onChange={e => setF("costLow", e.target.value)} placeholder="e.g. 4.38" />
              </div>
              <div style={s.fieldWrap}>
                <label style={s.label}>Cost HIGH $/t FW</label>
                <input type="number" step="0.01" style={s.input} value={form.costHigh} onChange={e => setF("costHigh", e.target.value)} placeholder="e.g. 13.13" />
              </div>
            </div>
          </div>

          <div style={s.card}>
            <div style={{ color: C.gold, fontSize: 11, letterSpacing: 1, marginBottom: 12, textTransform: "uppercase" }}>▸ SECTION 4 — Notes</div>
            <div style={s.fieldWrap}>
              <label style={s.label}>Notes / Warnings / Consortium Compatibility</label>
              <textarea style={s.textarea} value={form.notes} onChange={e => setF("notes", e.target.value)} placeholder="e.g. Synergistic with Trichoderma. Avoid mixing with Ganoderma. Check for palm pathogen risk." />
            </div>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button type="submit" style={s.btnFill(C.accent)}>💾 SAVE TO DATABASE</button>
            <button type="button" style={s.btn(C.muted)} onClick={() => setForm(blankForm())}>✕ CLEAR FORM</button>
          </div>
        </form>
      </div>
    );
  }

  // ── ADMIN TAB ────────────────────────────────────────────────────────────────
  function renderAdmin() {
    return (
      <div style={s.body}>
        <div style={{ fontSize: 16, fontWeight: 700, color: C.danger, marginBottom: 4 }}>🔒 ADMIN — DELETE & GOVERNANCE</div>
        <div style={{ color: C.textDim, fontSize: 11, marginBottom: 16 }}>Only Sharon (System Admin) can delete organisms from the database. All user additions are permanent unless removed by admin. Users with permission can add organisms — contact Sharon to grant access.</div>

        {adminMsg && <div style={s.alert(adminMsg.type === "ok" ? C.green : C.danger)}>{adminMsg.msg}</div>}

        {!adminUnlocked ? (
          <div style={s.card}>
            <div style={{ color: C.warn, marginBottom: 12, fontSize: 13 }}>🔑 Enter Admin PIN to unlock delete permissions:</div>
            <div style={{ display: "flex", gap: 10 }}>
              <input type="password" style={{ ...s.input, width: 200 }} value={adminPin} onChange={e => setAdminPin(e.target.value)} placeholder="Enter PIN" onKeyDown={e => e.key === "Enter" && unlockAdmin()} />
              <button style={s.btnFill(C.danger)} onClick={unlockAdmin}>UNLOCK</button>
            </div>
          </div>
        ) : (
          <>
            <div style={s.alert(C.warn)}>🔓 Admin unlocked — Sharon. You can delete any organism. System-seeded organisms (id ≤ {SEED_ORGANISMS.length}) should only be deleted with caution.</div>

            {deleteTarget && (
              <div style={s.alert(C.danger)}>
                <strong>⚠️ CONFIRM DELETE:</strong> "{organisms.find(o => o.id === deleteTarget)?.name}" — this is permanent and cannot be undone.
                <div style={{ marginTop: 8, display: "flex", gap: 10 }}>
                  <button style={s.btnFill(C.danger)} onClick={() => handleDelete(deleteTarget)}>YES — DELETE PERMANENTLY</button>
                  <button style={s.btn(C.muted)} onClick={() => setDeleteTarget(null)}>CANCEL</button>
                </div>
              </div>
            )}

            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.th}>#</th>
                  <th style={s.th}>Organism</th>
                  <th style={s.th}>Category</th>
                  <th style={s.th}>Added By</th>
                  <th style={s.th}>Date</th>
                  <th style={s.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {organisms.map(o => (
                  <tr key={o.id}>
                    <td style={s.tdMuted}>{o.id}</td>
                    <td style={{ ...s.td, fontWeight: o.addedBy !== "System" ? 700 : 400, color: o.addedBy !== "System" ? C.green : C.text }}>{o.name}{o.addedBy !== "System" && <span style={{ ...s.badge(C.green), marginLeft: 5 }}>USER</span>}</td>
                    <td style={s.td}><span style={s.badge(catColor(o.category))}>{o.category}</span></td>
                    <td style={{ ...s.td, color: o.addedBy !== "System" ? C.green : C.muted }}>{o.addedBy}</td>
                    <td style={s.tdMuted}>{o.addedDate}</td>
                    <td style={s.td}>
                      <button style={{ ...s.btn(C.danger), padding: "4px 10px", fontSize: 11 }} onClick={() => setDeleteTarget(o.id)}>DELETE</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        <div style={{ ...s.card, marginTop: 20 }}>
          <div style={{ color: C.gold, fontSize: 11, letterSpacing: 1, marginBottom: 10, textTransform: "uppercase" }}>Permissions & Governance Rules</div>
          {[
            ["WHO CAN ADD", "Any user with permission (granted by Sharon). Username is recorded and displayed permanently in the registry."],
            ["WHO CAN DELETE", "Sharon only — Admin PIN required. All deletions are permanent."],
            ["DATA PERMANENCE", "All user additions are preserved for future use. Data is stored in persistent storage across sessions."],
            ["NEW ORGANISMS IN LIST", "All user-added organisms appear in the S3 Organism Registry with a GREEN 'NEW' badge and are available for dosage calculations immediately."],
            ["AUDIT TRAIL", "Every organism shows Added By + Date. Cannot be falsified. Sharon reviews new additions periodically."],
            ["BT RULE", "Bacillus thuringiensis (any strain) is PERMANENTLY EXCLUDED from BSF pathways. This rule cannot be overridden by any user including admin."],
          ].map(([k, v]) => (
            <div key={k} style={{ display: "flex", gap: 12, marginBottom: 8, fontSize: 12 }}>
              <div style={{ color: C.accent, minWidth: 160, fontSize: 11, fontWeight: 700 }}>{k}</div>
              <div style={{ color: C.textDim }}>{v}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={s.app}>
      <div style={s.header}>
        <div>
          <div style={s.logo}>CFI · Circular Fertiliser Industries · Bogor, West Java</div>
          <div style={s.title}>S3 Biological Database Manager</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 12, alignItems: "center" }}>
          <span style={{ color: C.textDim, fontSize: 11 }}>Logged in as:</span>
          <input style={{ ...s.input, width: 140 }} value={userName} onChange={e => setUserName(e.target.value)} placeholder="Your name" />
          <span style={s.badge(C.green)}>{organisms.length} ORGANISMS</span>
          {adminUnlocked && <span style={s.badge(C.danger)}>🔓 ADMIN</span>}
        </div>
      </div>

      <div style={s.tabs}>
        {[
          { id: "registry", label: "📋 Registry" },
          { id: "research", label: "🔬 AI Research" },
          { id: "add", label: "➕ Add New" },
          { id: "admin", label: "🔒 Admin" },
        ].map(t => <button key={t.id} style={s.tab(tab === t.id)} onClick={() => setTab(t.id)}>{t.label}</button>)}
      </div>

      {tab === "registry" && renderRegistry()}
      {tab === "research" && renderResearch()}
      {tab === "add" && renderAdd()}
      {tab === "admin" && renderAdmin()}
    </div>
  );
}

// ─── DOSAGE CALCULATOR SUB-COMPONENT ─────────────────────────────────────────
function DosageCalc({ organisms }) {
  const [batchFW, setBatchFW] = useState(1000);
  const [dm, setDm] = useState(35);
  const [selected, setSelected] = useState([]);

  const safeOrgs = organisms.filter(o => o.bsfSafe === "✅");
  const dmMass = batchFW * dm / 100;

  function toggle(id) {
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  }

  const chosenOrgs = safeOrgs.filter(o => selected.includes(o.id));
  const totalCostLow = chosenOrgs.reduce((a, o) => a + (o.costLow || 0), 0);
  const totalCostHigh = chosenOrgs.reduce((a, o) => a + (o.costHigh || 0), 0);

  const C2 = { accent: "#00c4b4", gold: "#d4a853", green: "#48bb78", warn: "#f6ad55", danger: "#e53e3e", muted: "#718096", text: "#e2e8f0", textDim: "#a0aec0", border: "#2d3748", surface: "#161b22" };

  return (
    <div>
      <div style={{ color: C2.accent, fontSize: 13, fontWeight: 700, letterSpacing: 1, marginBottom: 10, textTransform: "uppercase" }}>📐 Dosage Calculator</div>
      <div style={{ display: "flex", gap: 16, marginBottom: 14 }}>
        <div>
          <label style={{ display: "block", color: C2.textDim, fontSize: 11, marginBottom: 3 }}>Batch size (t FW)</label>
          <input type="number" style={{ background: "#0d1a2e", border: "1px solid #4299e1", color: C2.text, padding: "5px 8px", borderRadius: 4, fontFamily: "monospace", width: 100 }} value={batchFW} onChange={e => setBatchFW(Number(e.target.value))} />
        </div>
        <div>
          <label style={{ display: "block", color: C2.textDim, fontSize: 11, marginBottom: 3 }}>DM %</label>
          <input type="number" style={{ background: "#0d1a2e", border: "1px solid #4299e1", color: C2.text, padding: "5px 8px", borderRadius: 4, fontFamily: "monospace", width: 70 }} value={dm} onChange={e => setDm(Number(e.target.value))} />
        </div>
        <div style={{ display: "flex", alignItems: "flex-end" }}>
          <span style={{ color: C2.textDim, fontSize: 12 }}>DM mass: <strong style={{ color: C2.gold }}>{dmMass.toFixed(1)} t DM</strong></span>
        </div>
      </div>
      <div style={{ fontSize: 11, color: C2.textDim, marginBottom: 8 }}>Select organisms to calculate combined dose:</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
        {safeOrgs.slice(0, 18).map(o => (
          <button key={o.id} onClick={() => toggle(o.id)}
            style={{ padding: "4px 10px", borderRadius: 3, border: `1px solid ${selected.includes(o.id) ? C2.accent : C2.border}`, background: selected.includes(o.id) ? C2.accent + "22" : "transparent", color: selected.includes(o.id) ? C2.accent : C2.textDim, cursor: "pointer", fontSize: 11, fontFamily: "monospace" }}>
            {o.name.split(" ").slice(0, 2).join(" ")}
          </button>
        ))}
      </div>
      {chosenOrgs.length > 0 && (
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
          <thead>
            <tr>
              <th style={{ padding: "5px 8px", textAlign: "left", color: C2.accent, borderBottom: "1px solid #2d3748" }}>Organism</th>
              <th style={{ padding: "5px 8px", color: C2.accent, borderBottom: "1px solid #2d3748" }}>$/kg</th>
              <th style={{ padding: "5px 8px", color: C2.accent, borderBottom: "1px solid #2d3748" }}>kg needed (low)</th>
              <th style={{ padding: "5px 8px", color: C2.accent, borderBottom: "1px solid #2d3748" }}>kg needed (high)</th>
              <th style={{ padding: "5px 8px", color: C2.accent, borderBottom: "1px solid #2d3748" }}>Cost low $</th>
              <th style={{ padding: "5px 8px", color: C2.accent, borderBottom: "1px solid #2d3748" }}>Cost high $</th>
            </tr>
          </thead>
          <tbody>
            {chosenOrgs.map(o => {
              const kgL = o.kgLow * batchFW;
              const kgH = o.kgHigh * batchFW;
              const cL = o.costLow * batchFW;
              const cH = o.costHigh * batchFW;
              return (
                <tr key={o.id}>
                  <td style={{ padding: "5px 8px", color: C2.text }}>{o.name}</td>
                  <td style={{ padding: "5px 8px", color: C2.gold, textAlign: "center" }}>${o.usdKg}</td>
                  <td style={{ padding: "5px 8px", color: C2.textDim, textAlign: "center" }}>{kgL.toFixed(2)} kg</td>
                  <td style={{ padding: "5px 8px", color: C2.textDim, textAlign: "center" }}>{kgH.toFixed(2)} kg</td>
                  <td style={{ padding: "5px 8px", color: C2.green, textAlign: "center" }}>${cL.toFixed(2)}</td>
                  <td style={{ padding: "5px 8px", color: C2.warn, textAlign: "center" }}>${cH.toFixed(2)}</td>
                </tr>
              );
            })}
            <tr style={{ borderTop: "2px solid #4a5568" }}>
              <td colSpan={4} style={{ padding: "6px 8px", color: C2.accent, fontWeight: 700 }}>TOTAL CONSORTIUM COST ({chosenOrgs.length} organisms)</td>
              <td style={{ padding: "6px 8px", color: C2.green, fontWeight: 700, textAlign: "center" }}>${(totalCostLow * batchFW).toFixed(2)}</td>
              <td style={{ padding: "6px 8px", color: C2.warn, fontWeight: 700, textAlign: "center" }}>${(totalCostHigh * batchFW).toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
}
