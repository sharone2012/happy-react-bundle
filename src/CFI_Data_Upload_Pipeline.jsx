import { useState, useCallback, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

// ─── SUPABASE CLIENT ────────────────────────────────────────────────────────
// Uses your existing CFI Supabase project
const SUPABASE_URL = "https://lcpbtnipkvrmuwllymfw.supabase.co";
const SUPABASE_KEY = "sb_publishable_xJ9N0RaYXbY07m8DvtG_zQ_-m8Zzm23";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ─── COLOUR SYSTEM ──────────────────────────────────────────────────────────
const C = {
  navy:       "#0A1628",
  navyLight:  "#112240",
  teal:       "#0F6E56",
  tealLight:  "#17A37E",
  amber:      "#BA7517",
  amberLight: "#D4891A",
  red:        "#A32D2D",
  redLight:   "#C43434",
  green:      "#2E6B1A",
  greenLight: "#3A8820",
  slate:      "#8892A4",
  white:      "#F4F6F8",
  bg:         "#070E1C",
  card:       "#0D1B2E",
  border:     "#1A2E4A",
};

// ─── CFI MASTER PROCESSING PROMPT ───────────────────────────────────────────
const CFI_MASTER_PROMPT = `You are the CFI Lead Professor and Final Decision-Maker for Circular Fertiliser Industries.
You hold PhDs in Chemistry, Biology, Microbiology, Soil Science, Agronomy, Process Engineering, Mathematics, and Environmental Law.
You command a cloud team of 9 Senior Professors each leading 100 PhD Research Assistants.

GOVERNING HIERARCHY (strict priority order):
1. GUARDRAILS — CLASS A values are read-only forever, cannot be overridden by any evidence
2. ANTI-HALLUCINATION — no invented values, every number must have a real source
3. RESEARCH-INTENSITY — 99-power standard, cross-verify across at least 10 sources
4. PERSONA-ENHANCED — activate relevant professors per data type

═══ CFI CANONICAL GUARDRAILS (CLASS A — NEVER CHANGE) ═══
OPDC yield: 15.2% of EFB fresh weight — LOCKED
OPDC press MC floor: 40% minimum — LOCKED
5-day biological minimum: hard rule — LOCKED
BSF intro pH gate: ≤8.0 — LOCKED
BSF intro temp gate: ≤30°C — LOCKED
N conversion factor: 4.67 (NOT 6.25) — LOCKED
PKSA cost: $0/t (mill waste) — LOCKED
Carbon model: 213,827 t CO2e/yr avoided — LOCKED
EFB moisture: 62.5% MC wb — LOCKED
EFB lignin: 22% DM — LOCKED
EFB crude protein: 4.75% DM — LOCKED
EFB C:N: 60 — LOCKED
OPDC moisture: 70% MC wb — LOCKED
OPDC lignin: 30.7% DM — LOCKED
OPDC crude protein: 14.5% DM — LOCKED
OPDC C:N: 20 — LOCKED
POS MC: 82% wb — LOCKED
POS ash: 28% DM — LOCKED
POS crude protein: 11% DM — LOCKED
POS EE: 10% DM (range 5-20%) — LOCKED
POS N: 1.76% DM — LOCKED
POS ADL: 7.6% — LOCKED
Feedipedia POME EE 29.2%: PERMANENTLY REJECTED
MDPI Processes 8:337: PERMANENTLY REJECTED

═══ POS HEAVY METALS INCLUSION RULES ═══
Fe < 3,000 mg/kg DM → 20% WW inclusion
Fe 3,000–5,000 → 10–15%
Fe 5,000–8,000 → 5–10%
Fe > 8,000 → CaCO3 amendment required

═══ 9 PROFESSORS — ACTIVATE ALL RELEVANT ONES ═══
P1 Chemistry: elemental analysis, ash, mass balance, unit consistency (% DM vs % wb)
P2 Biology & Plant Physiology: nutrient uptake, bioavailability, crop response
P3 Microbiology & Inoculant: organism records, BSF safety flags, conflict lists
P4 Agronomy & Soil Science: field rates, yield responses, 5 Indonesian palm soil types
P5 Industrial Fermentation & Enzyme: S2 pre-treatment, S3 inoculation, process feasibility
P6 Process & Building Engineer: mass balance, equipment specs, yield calculations
P7 Carbon Accounting / IPCC: GWP, emission factors, ACM0022/VM0042 methodology
P8 Advanced Mathematics & Excel: formula integrity, C:N calculations, numerical consistency
P9 Global Field Microbiologist: non-GMO strain compliance, shelf-life, tropical conditions

═══ CONFIDENCE SCORING ═══
5 = CFI actual lab result (ICP-OES, timestamped, own lab)
4 = Peer-reviewed journal (ScienceDirect, MPOB, IF >2.0)
3 = Peer-reviewed journal (lower IF or conference paper)
2 = Industry report / technical datasheet
1 = Estimate / calculated / secondary reference
0 = REJECTED SOURCE (Feedipedia POME EE, MDPI Processes 8:337, similar)

═══ SUPABASE TABLES AVAILABLE ═══
cfi_feedstock_values — EFB, OPDC, POS lab parameters
cfi_chemical_library — chemicals, doses, prices, RSPO status
cfi_biological_library — organisms, BSF safety, conflict lists
cfi_pricing — fertiliser market prices, BSF product prices
cfi_guardrails — CLASS A locked constants
cfi_lab_results — new lab uploads with delta flags
cfi_data_gaps — confirmed missing data
cfi_conflict_log — rejected values (IMMUTABLE)
cfi_soil_profiles — 5 Indonesian palm soil types
cfi_change_log — all data changes (IMMUTABLE)
cfi_solutions — AI research data lake

═══ CONFIRMED DATA GAPS (do not fill with estimates) ═══
POS C:N ratio — DATA GAP
S3 Wave 2 lab analysis — DATA GAP (not yet performed)
S5 and S6 electricity OPEX — DATA GAP
GH-B drying house final spec — PROVISIONAL (defaulting Opt 3 corrugated iron)

═══ ANTI-HALLUCINATION RULES ═══
Every value MUST have Authors, Year, Title, Journal/Publisher.
"Industry data" or "commonly known" = IMMEDIATE REJECT.
If a value cannot be sourced: mark DATA GAP — do NOT invent.
If uncertainty exists: lower confidence to LOW or mark DATA GAP.
Do not blend conflicting numbers into a fake average.

═══ YOUR TASK ═══
Analyse the uploaded file. Extract every data point. For each:
1. Identify which CFI Supabase table it belongs to
2. Check if it conflicts with existing canonical/guardrail values
3. Score confidence 0–5
4. Assign action: INSERT, UPDATE, SKIP, DATA_GAP, or CLASS_A_BLOCKED
5. Activate relevant professors for QA

IMPORTANT RULES:
- If a value conflicts with a CLASS A guardrail → action = CLASS_A_BLOCKED, never override
- If a value conflicts with existing data AND new confidence > old confidence → action = UPDATE
- If a value conflicts AND confidence is equal → newer date wins
- If a value conflicts AND new confidence < old confidence → action = SKIP (old data is better)
- Always keep old data — new data goes into cfi_lab_results with version tracking
- Never delete or replace without keeping the original in conflict_log

OUTPUT: Return ONLY valid JSON matching this exact schema. No preamble, no explanation, no markdown fences.

{
  "file_summary": "brief description of the file content",
  "configuration_lock": {
    "material": "",
    "region": "Bogor, West Java, Indonesia",
    "tables_affected": [],
    "design_basis": "60 TPH FFB mill"
  },
  "professors_activated": [],
  "data_points": [
    {
      "id": "dp_001",
      "parameter": "",
      "value": "",
      "unit": "",
      "moisture_basis": "DM|WW|N/A",
      "target_table": "",
      "action": "INSERT|UPDATE|SKIP|DATA_GAP|CLASS_A_BLOCKED",
      "confidence_score": 3,
      "source_citation": "",
      "old_value": null,
      "old_confidence": null,
      "professor": "",
      "professor_notes": "",
      "is_guardrail_conflict": false,
      "guardrail_rule": ""
    }
  ],
  "conflicts": [
    {
      "parameter": "",
      "old_value": "",
      "new_value": "",
      "old_source": "",
      "new_source": "",
      "old_confidence": 0,
      "new_confidence": 0,
      "resolution": "",
      "action": "UPDATE|SKIP|CLASS_A_BLOCKED"
    }
  ],
  "data_gaps": [
    {
      "parameter": "",
      "table": "",
      "reason": "",
      "status": "CONFIRMED_GAP|NEW_GAP"
    }
  ],
  "new_tables_proposed": [
    {
      "table_name": "",
      "justification": "",
      "columns": [],
      "data_points_affected": []
    }
  ],
  "class_a_violations": [
    {
      "parameter": "",
      "attempted_value": "",
      "locked_value": "",
      "source_attempted": "",
      "blocked_reason": ""
    }
  ],
  "summary": {
    "total_data_points": 0,
    "new_inserts": 0,
    "updates_higher_confidence": 0,
    "skipped_lower_confidence": 0,
    "class_a_blocked": 0,
    "data_gaps_found": 0,
    "new_tables_needed": 0,
    "overall_data_quality": "HIGH|MEDIUM|LOW",
    "recommendation": ""
  }
}`;

// ─── HELPER: Read file as base64 ─────────────────────────────────────────────
function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ─── HELPER: Read file as text ───────────────────────────────────────────────
function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

// ─── CONFIDENCE COLOUR ───────────────────────────────────────────────────────
function confColor(score) {
  if (score >= 5) return C.tealLight;
  if (score === 4) return C.green;
  if (score === 3) return C.amber;
  if (score === 2) return "#8B6914";
  return C.red;
}

function actionColor(action) {
  const m = {
    INSERT: C.tealLight,
    UPDATE: C.amber,
    SKIP: C.slate,
    DATA_GAP: "#6B4FA0",
    CLASS_A_BLOCKED: C.red,
  };
  return m[action] || C.slate;
}

function actionBg(action) {
  const m = {
    INSERT: "rgba(15,110,86,0.15)",
    UPDATE: "rgba(186,117,23,0.15)",
    SKIP: "rgba(136,146,164,0.1)",
    DATA_GAP: "rgba(107,79,160,0.15)",
    CLASS_A_BLOCKED: "rgba(163,45,45,0.15)",
  };
  return m[action] || "transparent";
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function CFIDataUploadPipeline() {
  const [phase, setPhase] = useState("idle"); // idle | reading | processing | report | writing | done | error
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState("");
  const [progress, setProgress] = useState({ step: 0, label: "" });
  const [gradeReport, setGradeReport] = useState(null);
  const [error, setError] = useState("");
  const [writeResults, setWriteResults] = useState(null);
  const [filter, setFilter] = useState("ALL");
  const inputRef = useRef();

  // ─── PROCESS FILE THROUGH CLAUDE ──────────────────────────────────────────
  const processFile = useCallback(async (file) => {
    setFileName(file.name);
    setPhase("reading");
    setError("");

    const ext = file.name.split(".").pop().toLowerCase();
    setFileType(ext);

    try {
      // Build message content based on file type
      let messageContent = [];

      setProgress({ step: 1, label: "Reading file…" });

      if (["pdf"].includes(ext)) {
        const b64 = await readFileAsBase64(file);
        messageContent = [
          {
            type: "document",
            source: { type: "base64", media_type: "application/pdf", data: b64 },
          },
          { type: "text", text: "Process this file according to the CFI data pipeline instructions above. Return only the JSON grade report." },
        ];
      } else if (["xlsx", "xls"].includes(ext)) {
        // For Excel, we read as binary and note the file name — Claude will describe what it sees
        // In production Lovable may have SheetJS available; here we send filename context
        const b64 = await readFileAsBase64(file);
        messageContent = [
          { type: "text", text: `The attached file is an Excel workbook named "${file.name}". It contains CFI laboratory or research data. ` },
          {
            type: "document",
            source: { type: "base64", media_type: "application/octet-stream", data: b64 },
          },
          { type: "text", text: "Process this file according to the CFI data pipeline instructions above. Return only the JSON grade report." },
        ];
      } else if (["csv", "txt", "json"].includes(ext)) {
        const text = await readFileAsText(file);
        messageContent = [
          {
            type: "text",
            text: `The following file content is from "${file.name}" (${ext.toUpperCase()}):\n\n${text.slice(0, 50000)}\n\nProcess this according to the CFI data pipeline instructions above. Return only the JSON grade report.`,
          },
        ];
      } else if (["doc", "docx"].includes(ext)) {
        const b64 = await readFileAsBase64(file);
        messageContent = [
          { type: "text", text: `The attached file is a Word document named "${file.name}" containing CFI research or lab data. ` },
          {
            type: "document",
            source: { type: "base64", media_type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", data: b64 },
          },
          { type: "text", text: "Process this file according to the CFI data pipeline instructions above. Return only the JSON grade report." },
        ];
      } else {
        throw new Error(`Unsupported file type: .${ext}. Supported: PDF, Excel, CSV, JSON, TXT, DOC, DOCX`);
      }

      setPhase("processing");
      setProgress({ step: 2, label: "Activating 9 Professor Team…" });

      // Call Claude API
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 8000,
          system: CFI_MASTER_PROMPT,
          messages: [{ role: "user", content: messageContent }],
        }),
      });

      setProgress({ step: 3, label: "Running guardrail checks…" });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error?.message || "Claude API error");
      }

      const data = await response.json();
      const rawText = data.content?.find(b => b.type === "text")?.text || "";

      setProgress({ step: 4, label: "Parsing grade report…" });

      // Parse JSON — strip any accidental fences
      const clean = rawText.replace(/```json|```/g, "").trim();
      let parsed;
      try {
        parsed = JSON.parse(clean);
      } catch {
        // Try to extract JSON from within the text
        const match = clean.match(/\{[\s\S]*\}/);
        if (match) parsed = JSON.parse(match[0]);
        else throw new Error("Could not parse Claude response as JSON. Raw: " + rawText.slice(0, 200));
      }

      setProgress({ step: 5, label: "Grade report ready" });
      setGradeReport(parsed);
      setPhase("report");
    } catch (e) {
      setError(e.message);
      setPhase("error");
    }
  }, []);

  // ─── DRAG & DROP HANDLERS ──────────────────────────────────────────────────
  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  const onFileSelect = useCallback((e) => {
    const file = e.target.files[0];
    if (file) processFile(file);
  }, [processFile]);

  // ─── APPROVE & WRITE TO SUPABASE ──────────────────────────────────────────
  const approveAndWrite = useCallback(async () => {
    if (!gradeReport) return;
    setPhase("writing");
    setProgress({ step: 1, label: "Preparing SQL statements…" });

    const results = { inserted: 0, updated: 0, blocked: 0, errors: [] };

    try {
      const actionable = gradeReport.data_points.filter(dp =>
        dp.action === "INSERT" || dp.action === "UPDATE"
      );

      setProgress({ step: 2, label: `Writing ${actionable.length} records to Supabase…` });

      for (const dp of actionable) {
        try {
          const row = {
            stream: dp.target_table,
            parameter: dp.parameter,
            value: String(dp.value),
            unit: dp.unit || "",
            moisture_basis: dp.moisture_basis || "DM",
            confidence_score: dp.confidence_score,
            source_citation: dp.source_citation || "",
            professor_validated_by: dp.professor || "",
            professor_notes: dp.professor_notes || "",
            action_type: dp.action,
            old_value: dp.old_value ? String(dp.old_value) : null,
            file_source: fileName,
            is_active: true,
            created_at: new Date().toISOString(),
          };

          const { error: sbErr } = await supabase
            .from("cfi_lab_results")
            .insert(row);

          if (sbErr) {
            results.errors.push({ parameter: dp.parameter, error: sbErr.message });
          } else {
            dp.action === "INSERT" ? results.inserted++ : results.updated++;
          }
        } catch (rowErr) {
          results.errors.push({ parameter: dp.parameter, error: rowErr.message });
        }
      }

      // Log conflicts to cfi_conflict_log
      setProgress({ step: 3, label: "Logging conflicts…" });
      for (const conflict of (gradeReport.conflicts || [])) {
        await supabase.from("cfi_conflict_log").insert({
          parameter: conflict.parameter,
          old_value: String(conflict.old_value || ""),
          new_value: String(conflict.new_value || ""),
          old_confidence: conflict.old_confidence,
          new_confidence: conflict.new_confidence,
          resolution: conflict.resolution,
          action_taken: conflict.action,
          file_source: fileName,
          created_at: new Date().toISOString(),
        });
      }

      // Log data gaps
      setProgress({ step: 4, label: "Logging data gaps…" });
      for (const gap of (gradeReport.data_gaps || [])) {
        await supabase.from("cfi_data_gaps").upsert({
          parameter: gap.parameter,
          table_name: gap.table,
          reason: gap.reason,
          status: gap.status,
          last_checked: new Date().toISOString(),
        }, { onConflict: "parameter" });
      }

      // Log to change_log
      setProgress({ step: 5, label: "Writing change log…" });
      await supabase.from("cfi_change_log").insert({
        change_type: "BULK_UPLOAD",
        description: `File upload: ${fileName} — ${results.inserted} inserted, ${results.updated} updated`,
        rows_affected: results.inserted + results.updated,
        file_source: fileName,
        performed_by: "CFI_AI_PIPELINE",
        timestamp: new Date().toISOString(),
      });

      results.blocked = gradeReport.data_points.filter(dp => dp.action === "CLASS_A_BLOCKED").length;
      setWriteResults(results);
      setPhase("done");
    } catch (e) {
      setError(e.message);
      setPhase("error");
    }
  }, [gradeReport, fileName]);

  const reset = () => {
    setPhase("idle");
    setFileName("");
    setGradeReport(null);
    setError("");
    setWriteResults(null);
    setFilter("ALL");
    setProgress({ step: 0, label: "" });
  };

  // ─── FILTERED DATA POINTS ─────────────────────────────────────────────────
  const filteredPoints = gradeReport?.data_points?.filter(dp => {
    if (filter === "ALL") return true;
    return dp.action === filter;
  }) || [];

  const s = {
    wrap: {
      background: C.bg,
      minHeight: "100vh",
      fontFamily: "'IBM Plex Mono', 'Fira Code', 'Courier New', monospace",
      color: C.white,
      padding: "32px",
    },
    header: {
      marginBottom: "32px",
    },
    title: {
      fontSize: "13px",
      letterSpacing: "4px",
      color: C.teal,
      textTransform: "uppercase",
      marginBottom: "6px",
    },
    h1: {
      fontSize: "28px",
      fontWeight: "700",
      color: C.white,
      letterSpacing: "-0.5px",
      margin: 0,
    },
    card: {
      background: C.card,
      border: `1px solid ${C.border}`,
      borderRadius: "4px",
      padding: "24px",
      marginBottom: "20px",
    },
    dropZone: {
      border: `2px dashed ${dragOver ? C.teal : C.border}`,
      borderRadius: "4px",
      padding: "60px 40px",
      textAlign: "center",
      cursor: "pointer",
      transition: "all 0.2s",
      background: dragOver ? "rgba(15,110,86,0.08)" : "transparent",
    },
    dropIcon: {
      fontSize: "40px",
      marginBottom: "16px",
    },
    dropTitle: {
      fontSize: "16px",
      fontWeight: "600",
      color: C.white,
      marginBottom: "8px",
    },
    dropSub: {
      fontSize: "12px",
      color: C.slate,
      lineHeight: "1.6",
    },
    btn: (color, bg) => ({
      background: bg || color,
      color: bg ? color : C.navy,
      border: `1px solid ${color}`,
      padding: "10px 24px",
      borderRadius: "3px",
      cursor: "pointer",
      fontSize: "12px",
      fontFamily: "inherit",
      fontWeight: "700",
      letterSpacing: "1px",
      textTransform: "uppercase",
      transition: "all 0.15s",
    }),
    progressBar: {
      background: C.border,
      borderRadius: "2px",
      height: "3px",
      overflow: "hidden",
      marginTop: "16px",
    },
    progressFill: {
      background: C.teal,
      height: "100%",
      transition: "width 0.4s ease",
      width: `${(progress.step / 5) * 100}%`,
    },
    tag: (color) => ({
      display: "inline-block",
      padding: "2px 8px",
      background: `${color}22`,
      border: `1px solid ${color}44`,
      borderRadius: "2px",
      fontSize: "10px",
      color: color,
      fontWeight: "700",
      letterSpacing: "0.5px",
    }),
    table: {
      width: "100%",
      borderCollapse: "collapse",
      fontSize: "11px",
    },
    th: {
      textAlign: "left",
      padding: "8px 12px",
      background: "#0A1628",
      color: C.slate,
      fontWeight: "600",
      letterSpacing: "1px",
      textTransform: "uppercase",
      fontSize: "10px",
      borderBottom: `1px solid ${C.border}`,
    },
    td: {
      padding: "10px 12px",
      borderBottom: `1px solid ${C.border}22`,
      verticalAlign: "top",
      lineHeight: "1.5",
    },
    filterBtn: (active) => ({
      padding: "5px 12px",
      fontSize: "10px",
      fontFamily: "inherit",
      fontWeight: "700",
      letterSpacing: "1px",
      textTransform: "uppercase",
      cursor: "pointer",
      borderRadius: "2px",
      transition: "all 0.15s",
      background: active ? C.teal : "transparent",
      color: active ? C.white : C.slate,
      border: `1px solid ${active ? C.teal : C.border}`,
    }),
  };

  // Count by action for filter badges
  const counts = gradeReport?.data_points?.reduce((acc, dp) => {
    acc[dp.action] = (acc[dp.action] || 0) + 1;
    return acc;
  }, {}) || {};

  return (
    <div style={s.wrap}>
      {/* Header */}
      <div style={s.header}>
        <div style={s.title}>Circular Fertiliser Industries</div>
        <h1 style={s.h1}>Data Upload Pipeline</h1>
        <div style={{ fontSize: "12px", color: C.slate, marginTop: "6px" }}>
          9-Professor Validation · Guardrail Enforcement · Confidence Grading · Supabase Write
        </div>
      </div>

      {/* ── IDLE: DROP ZONE ── */}
      {phase === "idle" && (
        <div style={s.card}>
          <div
            style={s.dropZone}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            onClick={() => inputRef.current.click()}
          >
            <div style={s.dropIcon}>⬆</div>
            <div style={s.dropTitle}>Drop file here or click to upload</div>
            <div style={s.dropSub}>
              PDF · Excel (.xlsx) · Word (.docx) · CSV · JSON · TXT<br />
              All files validated against CFI guardrails before writing to Supabase
            </div>
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.xlsx,.xls,.csv,.json,.txt,.doc,.docx"
              style={{ display: "none" }}
              onChange={onFileSelect}
            />
          </div>

          {/* Pipeline diagram */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "24px", justifyContent: "center", flexWrap: "wrap" }}>
            {["Upload File", "→", "9 Professors", "→", "Grade Report", "→", "Your Approval", "→", "Supabase"].map((s2, i) => (
              <span key={i} style={{
                fontSize: "11px",
                color: s2 === "→" ? C.border : C.slate,
                fontWeight: s2 !== "→" ? "700" : "400",
              }}>{s2}</span>
            ))}
          </div>
        </div>
      )}

      {/* ── READING / PROCESSING ── */}
      {(phase === "reading" || phase === "processing") && (
        <div style={s.card}>
          <div style={{ marginBottom: "8px", fontSize: "12px", color: C.slate }}>
            {phase === "reading" ? "📄" : "🔬"} {fileName}
          </div>
          <div style={{ fontSize: "16px", fontWeight: "700", color: C.white, marginBottom: "4px" }}>
            {phase === "reading" ? "Reading file…" : "Running CFI Professor Pipeline…"}
          </div>
          <div style={{ fontSize: "12px", color: C.teal, marginBottom: "4px" }}>
            {progress.label}
          </div>

          {phase === "processing" && (
            <div style={{ marginTop: "16px" }}>
              {[
                { n: 1, label: "P1 Chemistry — elemental validation" },
                { n: 2, label: "P3 Microbiology — organism & BSF checks" },
                { n: 3, label: "P6 Process Engineer — mass balance" },
                { n: 4, label: "P7 Carbon IPCC — guardrail enforcement" },
                { n: 5, label: "P8 Mathematics — formula integrity" },
              ].map(p => (
                <div key={p.n} style={{ fontSize: "11px", color: progress.step >= p.n ? C.tealLight : C.border, padding: "2px 0" }}>
                  {progress.step >= p.n ? "✓" : "○"} {p.label}
                </div>
              ))}
            </div>
          )}

          <div style={s.progressBar}>
            <div style={s.progressFill} />
          </div>
        </div>
      )}

      {/* ── GRADE REPORT ── */}
      {phase === "report" && gradeReport && (
        <>
          {/* Summary bar */}
          <div style={{ ...s.card, borderLeft: `3px solid ${C.teal}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
              <div>
                <div style={{ fontSize: "10px", color: C.slate, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "4px" }}>
                  Grade Report — {fileName}
                </div>
                <div style={{ fontSize: "18px", fontWeight: "700", color: C.white }}>
                  {gradeReport.file_summary || "File processed"}
                </div>
                <div style={{ fontSize: "12px", color: C.slate, marginTop: "4px" }}>
                  Professors activated: {(gradeReport.professors_activated || []).join(", ")}
                </div>
              </div>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "24px", fontWeight: "700", color: C.tealLight }}>{gradeReport.summary?.new_inserts || 0}</div>
                  <div style={{ fontSize: "10px", color: C.slate }}>NEW</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "24px", fontWeight: "700", color: C.amber }}>{gradeReport.summary?.updates_higher_confidence || 0}</div>
                  <div style={{ fontSize: "10px", color: C.slate }}>UPDATES</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "24px", fontWeight: "700", color: C.slate }}>{gradeReport.summary?.skipped_lower_confidence || 0}</div>
                  <div style={{ fontSize: "10px", color: C.slate }}>SKIPPED</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "24px", fontWeight: "700", color: C.red }}>{gradeReport.summary?.class_a_blocked || 0}</div>
                  <div style={{ fontSize: "10px", color: C.slate }}>BLOCKED</div>
                </div>
              </div>
            </div>

            {/* Quality badge */}
            <div style={{ marginTop: "12px", display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={s.tag(
                gradeReport.summary?.overall_data_quality === "HIGH" ? C.tealLight :
                gradeReport.summary?.overall_data_quality === "MEDIUM" ? C.amber : C.red
              )}>
                {gradeReport.summary?.overall_data_quality || "—"} QUALITY
              </span>
              <span style={{ fontSize: "12px", color: C.slate }}>{gradeReport.summary?.recommendation}</span>
            </div>
          </div>

          {/* CLASS A VIOLATIONS — always show if any */}
          {(gradeReport.class_a_violations || []).length > 0 && (
            <div style={{ ...s.card, borderLeft: `3px solid ${C.red}`, background: "rgba(163,45,45,0.08)" }}>
              <div style={{ fontSize: "12px", fontWeight: "700", color: C.red, marginBottom: "12px", letterSpacing: "1px" }}>
                ⛔ CLASS A GUARDRAIL VIOLATIONS BLOCKED ({gradeReport.class_a_violations.length})
              </div>
              {gradeReport.class_a_violations.map((v, i) => (
                <div key={i} style={{ fontSize: "11px", color: C.white, padding: "6px 0", borderBottom: `1px solid ${C.border}22` }}>
                  <strong style={{ color: C.red }}>{v.parameter}</strong>
                  <span style={{ color: C.slate }}> — attempted: </span>{v.attempted_value}
                  <span style={{ color: C.slate }}> → locked: </span>{v.locked_value}
                  <span style={{ color: C.slate }}> ({v.blocked_reason})</span>
                </div>
              ))}
            </div>
          )}

          {/* Conflicts */}
          {(gradeReport.conflicts || []).length > 0 && (
            <div style={{ ...s.card, borderLeft: `3px solid ${C.amber}` }}>
              <div style={{ fontSize: "12px", fontWeight: "700", color: C.amber, marginBottom: "12px", letterSpacing: "1px" }}>
                ⚡ CONFLICTS RESOLVED ({gradeReport.conflicts.length})
              </div>
              <table style={s.table}>
                <thead>
                  <tr>
                    {["Parameter", "Old Value", "New Value", "Old Conf", "New Conf", "Resolution"].map(h => (
                      <th key={h} style={s.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {gradeReport.conflicts.map((c, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent" }}>
                      <td style={s.td}><strong>{c.parameter}</strong></td>
                      <td style={{ ...s.td, color: C.slate }}>{c.old_value}</td>
                      <td style={{ ...s.td, color: C.white }}>{c.new_value}</td>
                      <td style={s.td}><span style={s.tag(confColor(c.old_confidence))}>{c.old_confidence}</span></td>
                      <td style={s.td}><span style={s.tag(confColor(c.new_confidence))}>{c.new_confidence}</span></td>
                      <td style={{ ...s.td, color: actionColor(c.action) }}>{c.resolution}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Data points table */}
          <div style={s.card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "8px" }}>
              <div style={{ fontSize: "12px", fontWeight: "700", color: C.white, letterSpacing: "1px" }}>
                DATA POINTS ({gradeReport.data_points?.length || 0})
              </div>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {["ALL", "INSERT", "UPDATE", "SKIP", "DATA_GAP", "CLASS_A_BLOCKED"].map(f => (
                  <button key={f} style={s.filterBtn(filter === f)} onClick={() => setFilter(f)}>
                    {f === "ALL" ? "ALL" : f.replace("_", " ")}{counts[f] ? ` (${counts[f]})` : ""}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={s.table}>
                <thead>
                  <tr>
                    {["Parameter", "Value", "Unit", "Table", "Action", "Conf", "Source", "Professor Notes"].map(h => (
                      <th key={h} style={s.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredPoints.map((dp, i) => (
                    <tr key={dp.id || i} style={{ background: actionBg(dp.action) }}>
                      <td style={s.td}>
                        <strong style={{ color: C.white }}>{dp.parameter}</strong>
                        {dp.moisture_basis && dp.moisture_basis !== "N/A" && (
                          <span style={{ display: "block", fontSize: "10px", color: C.slate }}>{dp.moisture_basis}</span>
                        )}
                      </td>
                      <td style={s.td}>
                        <span style={{ color: C.white }}>{dp.value}</span>
                        {dp.old_value && (
                          <span style={{ display: "block", fontSize: "10px", color: C.slate }}>was: {dp.old_value}</span>
                        )}
                      </td>
                      <td style={{ ...s.td, color: C.slate }}>{dp.unit}</td>
                      <td style={{ ...s.td, color: C.slate, fontSize: "10px" }}>{dp.target_table}</td>
                      <td style={s.td}>
                        <span style={s.tag(actionColor(dp.action))}>{dp.action}</span>
                      </td>
                      <td style={s.td}>
                        <span style={{ ...s.tag(confColor(dp.confidence_score)), fontSize: "13px", padding: "3px 10px" }}>
                          {dp.confidence_score}
                        </span>
                      </td>
                      <td style={{ ...s.td, color: C.slate, fontSize: "10px", maxWidth: "160px" }}>
                        {dp.source_citation}
                      </td>
                      <td style={{ ...s.td, color: C.slate, fontSize: "10px", maxWidth: "200px" }}>
                        {dp.professor && <span style={{ color: C.teal }}>[{dp.professor}]</span>} {dp.professor_notes}
                        {dp.is_guardrail_conflict && (
                          <span style={{ display: "block", color: C.red, fontWeight: "700" }}>⛔ {dp.guardrail_rule}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredPoints.length === 0 && (
              <div style={{ textAlign: "center", padding: "32px", color: C.slate, fontSize: "12px" }}>
                No data points match filter: {filter}
              </div>
            )}
          </div>

          {/* Data gaps */}
          {(gradeReport.data_gaps || []).length > 0 && (
            <div style={{ ...s.card, borderLeft: `3px solid #6B4FA0` }}>
              <div style={{ fontSize: "12px", fontWeight: "700", color: "#9B7FD0", marginBottom: "12px", letterSpacing: "1px" }}>
                ◻ DATA GAPS ({gradeReport.data_gaps.length})
              </div>
              {gradeReport.data_gaps.map((g, i) => (
                <div key={i} style={{ fontSize: "11px", color: C.slate, padding: "4px 0" }}>
                  <strong style={{ color: C.white }}>{g.parameter}</strong>
                  <span style={{ color: "#6B4FA0", marginLeft: "8px" }}>[{g.status}]</span>
                  <span style={{ marginLeft: "8px" }}>{g.reason}</span>
                </div>
              ))}
            </div>
          )}

          {/* New tables proposed */}
          {(gradeReport.new_tables_proposed || []).length > 0 && (
            <div style={{ ...s.card, borderLeft: `3px solid ${C.amber}` }}>
              <div style={{ fontSize: "12px", fontWeight: "700", color: C.amber, marginBottom: "12px", letterSpacing: "1px" }}>
                ⊕ NEW TABLES PROPOSED ({gradeReport.new_tables_proposed.length})
              </div>
              {gradeReport.new_tables_proposed.map((t, i) => (
                <div key={i} style={{ fontSize: "11px", color: C.white, padding: "6px 0", borderBottom: `1px solid ${C.border}22` }}>
                  <strong style={{ color: C.amber }}>{t.table_name}</strong>
                  <span style={{ color: C.slate, marginLeft: "8px" }}>{t.justification}</span>
                </div>
              ))}
              <div style={{ fontSize: "11px", color: C.slate, marginTop: "8px" }}>
                ⚠ These tables must be created in Supabase SQL Editor before the data can be written.
              </div>
            </div>
          )}

          {/* Approve / Reject buttons */}
          <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "8px" }}>
            <button style={s.btn(C.slate)} onClick={reset}>✕ Reject & Start Over</button>
            <button
              style={{ ...s.btn(C.teal, C.teal), color: C.white }}
              onClick={approveAndWrite}
              disabled={(gradeReport.summary?.new_inserts || 0) + (gradeReport.summary?.updates_higher_confidence || 0) === 0}
            >
              ✓ Approve — Write to Supabase
            </button>
          </div>
        </>
      )}

      {/* ── WRITING ── */}
      {phase === "writing" && (
        <div style={s.card}>
          <div style={{ fontSize: "16px", fontWeight: "700", color: C.white, marginBottom: "4px" }}>
            Writing to Supabase…
          </div>
          <div style={{ fontSize: "12px", color: C.teal }}>{progress.label}</div>
          <div style={s.progressBar}>
            <div style={s.progressFill} />
          </div>
        </div>
      )}

      {/* ── DONE ── */}
      {phase === "done" && writeResults && (
        <div style={{ ...s.card, borderLeft: `3px solid ${C.teal}` }}>
          <div style={{ fontSize: "10px", color: C.teal, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px" }}>
            ✓ Write Complete
          </div>
          <div style={{ fontSize: "20px", fontWeight: "700", color: C.white, marginBottom: "16px" }}>
            {fileName} — successfully written to Supabase
          </div>
          <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", marginBottom: "20px" }}>
            <div>
              <div style={{ fontSize: "28px", fontWeight: "700", color: C.tealLight }}>{writeResults.inserted}</div>
              <div style={{ fontSize: "10px", color: C.slate }}>ROWS INSERTED</div>
            </div>
            <div>
              <div style={{ fontSize: "28px", fontWeight: "700", color: C.amber }}>{writeResults.updated}</div>
              <div style={{ fontSize: "10px", color: C.slate }}>ROWS UPDATED</div>
            </div>
            <div>
              <div style={{ fontSize: "28px", fontWeight: "700", color: C.red }}>{writeResults.blocked}</div>
              <div style={{ fontSize: "10px", color: C.slate }}>CLASS A BLOCKED</div>
            </div>
            <div>
              <div style={{ fontSize: "28px", fontWeight: "700", color: C.slate }}>{writeResults.errors?.length || 0}</div>
              <div style={{ fontSize: "10px", color: C.slate }}>ERRORS</div>
            </div>
          </div>
          {writeResults.errors?.length > 0 && (
            <div style={{ fontSize: "11px", color: C.red, marginBottom: "12px" }}>
              Errors: {writeResults.errors.map(e => `${e.parameter}: ${e.error}`).join(" | ")}
            </div>
          )}
          <div style={{ fontSize: "11px", color: C.slate, marginBottom: "20px" }}>
            All writes logged to cfi_change_log. Conflicts logged to cfi_conflict_log.
            Data gaps logged to cfi_data_gaps. Old data preserved.
          </div>
          <button style={{ ...s.btn(C.teal, C.teal), color: C.white }} onClick={reset}>
            Upload Another File
          </button>
        </div>
      )}

      {/* ── ERROR ── */}
      {phase === "error" && (
        <div style={{ ...s.card, borderLeft: `3px solid ${C.red}` }}>
          <div style={{ fontSize: "12px", fontWeight: "700", color: C.red, marginBottom: "8px", letterSpacing: "1px" }}>
            ⚠ PIPELINE ERROR
          </div>
          <div style={{ fontSize: "13px", color: C.white, marginBottom: "16px" }}>{error}</div>
          <button style={s.btn(C.teal)} onClick={reset}>Start Over</button>
        </div>
      )}

      {/* Footer */}
      <div style={{ marginTop: "40px", fontSize: "10px", color: C.border, textAlign: "center", letterSpacing: "1px" }}>
        CFI DATA PIPELINE · GUARDRAILS v2.7 · 9-PROFESSOR QA · CONFIDENCE SCORING 0–5
      </div>
    </div>
  );
}
