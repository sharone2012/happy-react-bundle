import { useState, useEffect, useCallback } from "react";

// ─── SEED DATA — full 43-organism registry (v2 Mar 2026) ──────────────────────
const SEED_ORGANISMS = [
  // ── THERMOPHILIC FUNGI ──────────────────────────────────────────────────────
  { id: 1,  category: "🔥 Thermo Fungi",    name: "Thermomyces lanuginosus",        icbb: "—",         supplier: "Commercial / IPB Bogor",       fn: "Thermophilic cellulase/xylanase producer — active during 50-60°C hot phase. Wave 1.", temp: "50–60", bsfSafe: "✅", form: "Dry",    usdKg: 25,   doseLow: 0.05, doseHigh: 0.15,  kgLow: 0.175, kgHigh: 0.525, costLow: 4.38,  costHigh: 13.13, quote: "Alibaba/Novozymes",         addedBy: "System", addedDate: "2025-01-01", notes: "Wave 1 (Day 0). Peak activity 55-60°C. Pair with xylanase enzyme." },
  { id: 2,  category: "🔥 Thermo Fungi",    name: "Myceliophthora thermophila",     icbb: "—",         supplier: "DSM/Novozymes",                fn: "C1 cellulase system, industrial enzyme source. Wave 1.", temp: "45–55", bsfSafe: "✅", form: "Dry",    usdKg: 30,   doseLow: 0.05, doseHigh: 0.10,  kgLow: 0.175, kgHigh: 0.35,  costLow: 5.25,  costHigh: 10.5,  quote: "Novozymes Indonesia",          addedBy: "System", addedDate: "2025-01-01", notes: "Wave 1 (Day 0). Superior C1 cellulase complement to T. reesei." },
  { id: 3,  category: "🔥 Thermo Fungi",    name: "Chaetomium thermophilum",        icbb: "—",         supplier: "Research / IPB Bogor / LIPI",  fn: "Thermophilic cellulase, model organism. Wave 1.", temp: "50–60", bsfSafe: "✅", form: "Dry",    usdKg: 35,   doseLow: 0.03, doseHigh: 0.08,  kgLow: 0.105, kgHigh: 0.28,  costLow: 3.68,  costHigh: 9.8,   quote: "IPB Bogor/LIPI",               addedBy: "System", addedDate: "2025-01-01", notes: "Wave 1 (Day 0). Research-grade; confirm availability IPB." },
  // ── THERMOPHILIC BACTERIA ───────────────────────────────────────────────────
  { id: 4,  category: "🔥 Thermo Bacteria", name: "Geobacillus stearothermophilus", icbb: "—",         supplier: "Commercial / LIPI Cibinong",   fn: "Thermophilic amylase/protease producer. Survives 70°C. Wave 1.", temp: "55–70", bsfSafe: "✅", form: "Dry",    usdKg: 15,   doseLow: 0.05, doseHigh: 0.15,  kgLow: 0.175, kgHigh: 0.525, costLow: 2.63,  costHigh: 7.88,  quote: "IndiaMART",                    addedBy: "System", addedDate: "2025-01-01", notes: "Wave 1 (Day 0). Useful in extreme heat spikes." },
  { id: 5,  category: "🔥 Thermo Bacteria", name: "Bacillus licheniformis",         icbb: "—",         supplier: "Commercial / Indotrading",     fn: "Thermotolerant protease/amylase. Heat-stable. Wave 1.", temp: "50–65", bsfSafe: "✅", form: "Dry",    usdKg: 8,    doseLow: 0.05, doseHigh: 0.20,  kgLow: 0.175, kgHigh: 0.7,   costLow: 1.4,   costHigh: 5.6,   quote: "Alibaba bulk / Indotrading",   addedBy: "System", addedDate: "2025-01-01", notes: "Wave 1 (Day 0). One of 9-org stack. Most cost-effective thermophilic protease." },
  // ── THERMOPHILIC ACTINOMYCETES ──────────────────────────────────────────────
  { id: 6,  category: "🔥 Thermo Actino",   name: "Thermobifida fusca",             icbb: "—",         supplier: "Research / ATCC / DSMZ",      fn: "Thermophilic actinomycete, true cellulase (CelA, CelB). Wave 1.", temp: "50–55", bsfSafe: "✅", form: "Dry",    usdKg: 40,   doseLow: 0.02, doseHigh: 0.05,  kgLow: 0.07,  kgHigh: 0.175, costLow: 2.8,   costHigh: 7.0,   quote: "ATCC/DSMZ",                   addedBy: "System", addedDate: "2025-01-01", notes: "Wave 1 (Day 0). Research-grade. Low dose needed — expensive but effective." },
  // ── WHITE-ROT / LIGNIN FUNGI ────────────────────────────────────────────────
  { id: 7,  category: "🍄 Lignin Fungi",     name: "Phanerochaete sp. ICBB 9182",   icbb: "ICBB 9182", supplier: "Provibio / IPB Bogor ICBB",    fn: "Primary lignin destroyer (LiP, MnP, Laccase). EFB specialist. Wave 1.", temp: "25–42", bsfSafe: "✅", form: "Wet",    usdKg: 8,    doseLow: 0.05, doseHigh: 0.15,  kgLow: 0.5,   kgHigh: 1.0,   costLow: 4.0,   costHigh: 8.0,   quote: "ab2ti.org/provibio",           addedBy: "System", addedDate: "2025-01-01", notes: "Wave 1 (Day 0). IPB-verified for palm residues. Best local lignin degrader." },
  { id: 8,  category: "🍄 Lignin Fungi",     name: "Phanerochaete chrysosporium",   icbb: "Wild-type", supplier: "Research / IPB / LIPI Cibinong",fn: "Strongest white-rot lignin degrader. LiP dominant.", temp: "37–42", bsfSafe: "✅", form: "Wet",    usdKg: 8,    doseLow: 0.05, doseHigh: 0.15,  kgLow: 0.5,   kgHigh: 1.0,   costLow: 4.0,   costHigh: 8.0,   quote: "IPB/LIPI Cibinong",           addedBy: "System", addedDate: "2025-01-01", notes: "Wave 1 (Day 0). Wild-type — confirm IPB availability before ordering." },
  { id: 9,  category: "🍄 Lignin Fungi",     name: "Pleurotus ostreatus",           icbb: "—",         supplier: "Tokopedia (bibit jamur) ✅",   fn: "Selective lignin degrader — preserves cellulose for BSF. Wave 1.", temp: "20–28", bsfSafe: "✅", form: "Wet",    usdKg: 0.3,  doseLow: 0.05, doseHigh: 0.15,  kgLow: 0.5,   kgHigh: 1.0,   costLow: 0.15,  costHigh: 0.3,   quote: "tokopedia.com/bibit-jamur",    addedBy: "System", addedDate: "2025-01-01", notes: "Wave 1 (Day 0). Cheapest effective lignin fungi. Same-day local purchase." },
  { id: 10, category: "🍄 Lignin Fungi",     name: "Trametes versicolor",           icbb: "—",         supplier: "Tokopedia / Alibaba",          fn: "Laccase-dominant lignin oxidizer. Turkey tail fungus.", temp: "25–30", bsfSafe: "✅", form: "Wet",    usdKg: 2,    doseLow: 0.03, doseHigh: 0.10,  kgLow: 0.3,   kgHigh: 0.7,   costLow: 0.6,   costHigh: 1.4,   quote: "Tokopedia/Alibaba",           addedBy: "System", addedDate: "2025-01-01", notes: "Wave 1 (Day 0). Strong laccase — pairs well with Phanerochaete." },
  { id: 11, category: "🍄 Lignin Fungi",     name: "Ganoderma lucidum",             icbb: "—",         supplier: "Tokopedia (commercial)",       fn: "Lignin degrader. ⚠️ CAUTION: closely related to Ganoderma boninense (oil palm pathogen).", temp: "25–30", bsfSafe: "⚠️ Caution", form: "Wet", usdKg: 1.5, doseLow: 0.03, doseHigh: 0.08, kgLow: 0.3, kgHigh: 0.56, costLow: 0.45, costHigh: 0.84, quote: "Tokopedia", addedBy: "System", addedDate: "2025-01-01", notes: "⚠️ Use verified G. lucidum strain only — NOT G. boninense. Confirm supplier speciation before using near palm plantation." },
  // ── CELLULASE/BIOCONTROL FUNGI ──────────────────────────────────────────────
  { id: 12, category: "🍄 Cellulase Fungi",  name: "Trichoderma harzianum/sp.",     icbb: "ICBB 9127", supplier: "Super Bio Boost / Tokopedia",  fn: "Aggressive cellulase + Ganoderma biocontrol (mycoparasite). Wave 2 ONLY in 9-org stack.", temp: "25–35", bsfSafe: "✅", form: "Dry",    usdKg: 1.5,  doseLow: 0.05, doseHigh: 0.15,  kgLow: 0.5,   kgHigh: 1.0,   costLow: 0.75,  costHigh: 1.5,   quote: "tokopedia.com/trichoderma",    addedBy: "System", addedDate: "2025-01-01", notes: "⚠️ 9-ORG STACK: Wave 2 (Day 3+) ONLY — MUST follow Rhizopus by 48-72h. Trichoderma is a mycoparasite — adds before Rhizopus establishes will kill it. Standard stack: Wave 1 OK." },
  { id: 13, category: "🍄 Cellulase Fungi",  name: "Aspergillus niger",             icbb: "—",         supplier: "Commercial / Indotrading",     fn: "Industrial cellulase/pectinase. Deep fiber cleavage. Citric acid producer (pH 4-6). Wave 1.", temp: "30–37", bsfSafe: "✅", form: "Dry",    usdKg: 5,    doseLow: 0.03, doseHigh: 0.10,  kgLow: 0.3,   kgHigh: 0.7,   costLow: 1.5,   costHigh: 3.5,   quote: "Alibaba/IndiaMART",            addedBy: "System", addedDate: "2025-01-01", notes: "Wave 1 (Day 0). One of 9-org stack. Citric acid helps pH. Moderate synergy with Rhizopus (commonly co-cultured)." },
  { id: 14, category: "🍄 Cellulase Fungi",  name: "Aspergillus oryzae",            icbb: "—",         supplier: "Tokopedia (koji starter) ✅",  fn: "Koji mold — amylase/protease. Fermentation substrate softening.", temp: "30–35", bsfSafe: "✅", form: "Dry",    usdKg: 3,    doseLow: 0.05, doseHigh: 0.15,  kgLow: 0.5,   kgHigh: 1.0,   costLow: 1.5,   costHigh: 3.0,   quote: "tokopedia.com/koji",           addedBy: "System", addedDate: "2025-01-01", notes: "Wave 1 (Day 0). Food-grade. Same-day local purchase. Amylase uplift for starchy POME sludge blend." },
  // ── PROTEIN FUNGI (NEW — Mar 2026) ─────────────────────────────────────────
  { id: 41, category: "🍄 Protein Fungi",    name: "Rhizopus oligosporus",          icbb: "—",         supplier: "Tokopedia (ragi tempe) ✅",    fn: "Fast mycelial protein biosynthesis: protease + lipase + phytase. Binds EFB fibres. Amino acid enrichment (Lys, Met). Wave 1A (9-org) — must be established 48-72h before Trichoderma.", temp: "28–37", bsfSafe: "✅", form: "Dry",    usdKg: 0.5,  doseLow: 0.05, doseHigh: 0.15,  kgLow: 0.175, kgHigh: 0.525, costLow: 0.09,  costHigh: 0.26,  quote: "tokopedia.com/ragi-tempe",     addedBy: "System", addedDate: "2026-03-01", notes: "⚠️ 9-ORG CRITICAL TIMING: Wave 1A (Day 0). Trichoderma is a mycoparasite — will kill Rhizopus if added simultaneously. Add Trichoderma Wave 1B (Day 3) ONLY after Rhizopus mycelium is visibly established. Ref: Nout & Kiers 2005; Gupta et al. 2019." },
  // ── YEAST ───────────────────────────────────────────────────────────────────
  { id: 15, category: "🧪 Yeast",            name: "Saccharomyces cerevisiae",      icbb: "ICBB 8808", supplier: "Fermipan retail / Provibio",   fn: "NH₃ retention (50% reduction). N-trap (pulls NH4+ into biomass). Anti-odour. Protein factory at 45-55% CP. Wave 2.", temp: "25–35", bsfSafe: "✅", form: "Dry",    usdKg: 0.3,  doseLow: 0.05, doseHigh: 0.20,  kgLow: 0.4,   kgHigh: 1.5,   costLow: 0.12,  costHigh: 0.45,  quote: "tokopedia.com/fermipan",       addedBy: "System", addedDate: "2025-01-01", notes: "One of 9-org stack. Wave 1 (9-org: Wave 1A Day 0). Synergy: N-Trap with Lactobacillus; Yeast Bloom with Trichoderma. Active 25-35°C — kicks in after thermophilic peak cools. Locked ORG-008." },
  // ── CELLULOLYTIC BACTERIA ───────────────────────────────────────────────────
  { id: 16, category: "🔬 Bacteria",         name: "Microbacterium lactium",        icbb: "ICBB 7125", supplier: "Provibio / Jaipur Bio India",  fn: "Primary cellulose decomposer → glucose. ICBB palm specialist.", temp: "30–40", bsfSafe: "✅", form: "Wet",    usdKg: 3,    doseLow: 0.05, doseHigh: 0.10,  kgLow: 0.5,   kgHigh: 0.8,   costLow: 1.5,   costHigh: 2.4,   quote: "Jaipur Bio India / IPB",       addedBy: "System", addedDate: "2025-01-01", notes: "Wave 1 (Day 0). IPB ICBB strain — verified for EFB substrate." },
  { id: 17, category: "🔬 Bacteria",         name: "Paenibacillus macerans",        icbb: "ICBB 8810", supplier: "Provibio / MarkNature",        fn: "Hemicellulase + nif genes (N-fixation). Bridges cellulase and N-fixer guilds.", temp: "30–45", bsfSafe: "✅", form: "Wet",    usdKg: 3,    doseLow: 0.05, doseHigh: 0.10,  kgLow: 0.5,   kgHigh: 0.8,   costLow: 1.5,   costHigh: 2.4,   quote: "MarkNature/IPB",               addedBy: "System", addedDate: "2025-01-01", notes: "Wave 1 (Day 0). ICBB strain. nif gene provides mild N-fixation even at wave 1 temperatures." },
  { id: 18, category: "🔬 Bacteria",         name: "Bacillus subtilis",             icbb: "ICBB 8780", supplier: "Super Bio Boost / Ansel Biotech",fn: "PGPR, endospore shelf-life, initial cellulase. Extremely robust. Wave 1.", temp: "25–50", bsfSafe: "✅", form: "Dry",    usdKg: 0.2,  doseLow: 0.03, doseHigh: 0.05,  kgLow: 0.3,   kgHigh: 0.5,   costLow: 0.06,  costHigh: 0.1,   quote: "Ansel Biotech India",          addedBy: "System", addedDate: "2025-01-01", notes: "Wave 1 (Day 0). One of 9-org stack. Cheapest reliable bacteria. Endospore survives heat. Neutral-synergy with LAB." },
  { id: 19, category: "🔬 Bacteria",         name: "Bacillus coagulans",            icbb: "—",         supplier: "Commercial / Alibaba",         fn: "Bridging bacteria — lactic acid + spore forming. P-solubiliser. Thermotolerant.", temp: "35–50", bsfSafe: "✅", form: "Dry",    usdKg: 2,    doseLow: 0.03, doseHigh: 0.08,  kgLow: 0.3,   kgHigh: 0.56,  costLow: 0.6,   costHigh: 1.12,  quote: "Alibaba",                      addedBy: "System", addedDate: "2025-01-01", notes: "Wave 1 (Day 0). One of 9-org stack. Acts as bridge between Bacilli and LAB — thermotolerant lactic acid producer." },
  { id: 20, category: "🔬 Bacteria",         name: "Cellulomonas fimi",             icbb: "—",         supplier: "ATCC / IndiaMART",             fn: "Cellulolytic bacterium — cellulose and hemicellulose breakdown.", temp: "30–37", bsfSafe: "✅", form: "Wet",    usdKg: 4,    doseLow: 0.03, doseHigh: 0.08,  kgLow: 0.3,   kgHigh: 0.56,  costLow: 1.2,   costHigh: 2.24,  quote: "ATCC/IndiaMART",               addedBy: "System", addedDate: "2025-01-01", notes: "Wave 1 (Day 0). Strong cellulose degrader. Less studied in palm context — pilot test recommended." },
  { id: 21, category: "🔬 Bacteria",         name: "Lactobacillus sp.",             icbb: "ICBB 6099", supplier: "Provibio / EM-4 retail ✅",    fn: "LAB pH buffering 5.5–6.0. N-trap partner with Saccharomyces. CH₄ suppression. Wave 1.", temp: "25–40", bsfSafe: "✅", form: "Wet",    usdKg: 0.86, doseLow: 0.03, doseHigh: 0.10,  kgLow: 0.3,   kgHigh: 1.0,   costLow: 0.05,  costHigh: 0.17,  quote: "EM-4 retail Rp25k/L",          addedBy: "System", addedDate: "2025-01-01", notes: "Wave 1 (Day 0). One of 9-org stack. EM-4 = locally available everywhere in Indonesia. Creates pH 5.5-6.5 for Rhizopus/Aspergillus. N-Trap synergy: Lactobacillus + Saccharomyces." },
  { id: 22, category: "🔬 Bacteria",         name: "Bacillus megaterium",           icbb: "—",         supplier: "IndiaMART",                    fn: "P-solubiliser (gluconic acid). Optional late-stage dose Day 14.", temp: "25–37", bsfSafe: "✅", form: "Dry",    usdKg: 1.5,  doseLow: 0.03, doseHigh: 0.05,  kgLow: 0.3,   kgHigh: 0.5,   costLow: 0.45,  costHigh: 0.75,  quote: "IndiaMART",                    addedBy: "System", addedDate: "2025-01-01", notes: "Optional Day 14 booster. P-solubilisation enhances frass fertiliser NPK. No conflict with other organisms." },
  // ── N-FIXERS ────────────────────────────────────────────────────────────────
  { id: 23, category: "❄️ N-Fixer",         name: "Azotobacter vinelandii",        icbb: "ICBB 9098", supplier: "Provibio / PT Pupuk Kaltim",   fn: "Free-living N₂ fixer — HIGHEST fixation rate 10–20 mg N/kg/day. ⚠️ Dies above 50°C. Wave 2 only.", temp: "<50 ⚠️", bsfSafe: "✅", form: "Wet",  usdKg: 0.4,  doseLow: 0.05, doseHigh: 0.20,  kgLow: 0.5,   kgHigh: 1.5,   costLow: 0.2,   costHigh: 0.6,   quote: "HumicFactory India / PT Kaltim", addedBy: "System", addedDate: "2025-01-01", notes: "⚠️ HARD GATE: TEMP MUST BE <50°C BEFORE APPLICATION. Wave 2 (Day 3+ in 9-org / Day 5+ standard). One of 9-org stack. Produces alginate cysts — excellent pH tolerance 6.0-8.5." },
  { id: 24, category: "❄️ N-Fixer",         name: "Azospirillum lipoferum",        icbb: "ICBB 6088", supplier: "Provibio / Jaipur Bio India",  fn: "Associative N-fixer + IAA phytohormone. Improves frass agronomic value.", temp: "<50 ⚠️", bsfSafe: "✅", form: "Wet",  usdKg: 1.0,  doseLow: 0.05, doseHigh: 0.10,  kgLow: 0.5,   kgHigh: 0.8,   costLow: 0.5,   costHigh: 0.8,   quote: "Jaipur Bio India",             addedBy: "System", addedDate: "2025-01-01", notes: "⚠️ TEMP GATE <50°C. Wave 2. IAA phytohormone enhances root uptake when frass is applied to soil." },
  { id: 25, category: "❄️ N-Fixer",         name: "Bradyrhizobium japonicum",      icbb: "ICBB 9251", supplier: "Provibio / Pioneer Agro India", fn: "Soil-phase N-fixer — benefits frass fertiliser in-field. Wave 2/Soil.", temp: "<45 ⚠️", bsfSafe: "✅", form: "Wet",  usdKg: 1.5,  doseLow: 0.03, doseHigh: 0.05,  kgLow: 0.3,   kgHigh: 0.5,   costLow: 0.45,  costHigh: 0.75,  quote: "Pioneer Agro India",           addedBy: "System", addedDate: "2025-01-01", notes: "⚠️ TEMP GATE <45°C. Wave 2. Primarily active in soil rather than substrate. Lower priority in substrate vs Azotobacter." },
  // ── P-SOLUBILISERS ──────────────────────────────────────────────────────────
  { id: 26, category: "🔴 P-Solubiliser",   name: "Pseudomonas fluorescens",       icbb: "—",         supplier: "Super Bio Boost / Katyayani",  fn: "P-solubiliser (gluconic/citric acid) + HCN biocontrol vs Ganoderma. Wave 2/Soil.", temp: "25–30", bsfSafe: "✅", form: "Wet",    usdKg: 2.4,  doseLow: 0.05, doseHigh: 0.10,  kgLow: 0.5,   kgHigh: 0.8,   costLow: 1.2,   costHigh: 1.92,  quote: "Katyayani Organics India",    addedBy: "System", addedDate: "2025-01-01", notes: "Wave 2 or optional Day 14+. HCN production doubles as Ganoderma biocontrol. Do not apply in sealed/poorly-ventilated spaces." },
  // ── K-MOBILISERS ────────────────────────────────────────────────────────────
  { id: 27, category: "💊 K-Mobiliser",     name: "Bacillus mucilaginosus",        icbb: "—",         supplier: "IndiaMART / Alibaba",          fn: "K-solubiliser from silicate minerals. Enhances K bioavailability in frass.", temp: "25–37", bsfSafe: "✅", form: "Dry",    usdKg: 3,    doseLow: 0.03, doseHigh: 0.08,  kgLow: 0.3,   kgHigh: 0.56,  costLow: 0.9,   costHigh: 1.68,  quote: "IndiaMART",                    addedBy: "System", addedDate: "2025-01-01", notes: "Optional frass upgrade. Most effective in soil; can be applied at Day 14+ in substrate." },
  { id: 28, category: "💊 K-Mobiliser",     name: "Frateuria aurantia",            icbb: "—",         supplier: "IARI India",                   fn: "K-mobiliser specialist — highest K release rate of any biofertiliser.", temp: "25–30", bsfSafe: "✅", form: "Wet",    usdKg: 4,    doseLow: 0.03, doseHigh: 0.05,  kgLow: 0.3,   kgHigh: 0.4,   costLow: 1.2,   costHigh: 1.6,   quote: "IARI India",                   addedBy: "System", addedDate: "2025-01-01", notes: "Optional. Best applied directly to soil/frass rather than hot substrate. Sensitive to pH >7." },
  // ── ACTINOMYCETES ───────────────────────────────────────────────────────────
  { id: 29, category: "🦠 Actinomycete",    name: "Streptomyces sp. ICBB 9155",   icbb: "ICBB 9155", supplier: "Provibio / IPB ICBB Bogor",    fn: "Lignocellulolytic + antibiotic production (pathogen control). Final dose Day 21.", temp: "25–37", bsfSafe: "✅", form: "Dry",    usdKg: 5,    doseLow: 0.02, doseHigh: 0.05,  kgLow: 0.2,   kgHigh: 0.4,   costLow: 1.0,   costHigh: 2.0,   quote: "ab2ti.org/ICBB",               addedBy: "System", addedDate: "2025-01-01", notes: "Day 21 / BSF handoff. Suppresses pathogens before substrate transfer to S4. ICBB-verified palm strain." },
  { id: 30, category: "🦠 Actinomycete",    name: "Streptomyces sp. ICBB 9469",   icbb: "ICBB 9469", supplier: "Provibio / IPB ICBB Bogor",    fn: "Complementary antibiotic profile to ICBB 9155. Broad-spectrum pathogen control.", temp: "25–37", bsfSafe: "✅", form: "Dry",    usdKg: 5,    doseLow: 0.02, doseHigh: 0.05,  kgLow: 0.2,   kgHigh: 0.4,   costLow: 1.0,   costHigh: 2.0,   quote: "ab2ti.org/ICBB",               addedBy: "System", addedDate: "2025-01-01", notes: "Day 21 / BSF handoff. Use alongside ICBB 9155 for broad-spectrum cover." },
  // ── CONDITIONAL (Bt — UPDATED Mar 2026) ────────────────────────────────────
  { id: 31, category: "⚠️ CONDITIONAL",     name: "Bacillus thuringiensis ICBB 6095", icbb: "ICBB 6095", supplier: "Provibio",               fn: "⚠️ CONDITIONAL — S3 composting phase ONLY, before BSF introduction. Cry protein biopesticide (Diptera-toxic). HARD GATE: confirm titre decay <10⁴ CFU/g before S4 loading. Never use if BSF larvae are present.", temp: "25–45", bsfSafe: "⚠️ Caution", form: "Dry", usdKg: 0.15, doseLow: 0, doseHigh: 0, kgLow: 0, kgHigh: 0, costLow: 0, costHigh: 0, quote: "IPB ICBB — CONDITIONAL USE ONLY", addedBy: "System", addedDate: "2026-03-01", notes: "⚠️ GUARDRAIL UPDATE Mar 2026: Status changed from EXCLUDED → CONDITIONAL. S3 composting phase only (before BSF introduction). Apply only during Wave 1-1B composting. HARD GATE before S4: titre must decay to <10⁴ CFU/g confirmed by lab test. Never apply if BSF larvae are present in substrate. Ref: CFI-BIO-2026-03." },
  // ── ENZYMES ─────────────────────────────────────────────────────────────────
  { id: 32, category: "⚗️ Enzyme",          name: "Cellulase — T. reesei (EC 3.2.1.4)", icbb: "EC 3.2.1.4", supplier: "Novozymes Indonesia",  fn: "β-1,4-glycosidic cleavage → glucose. +35-45% IVDMD uplift. Core Wave 1 enzyme.", temp: "45–55", bsfSafe: "✅", form: "Dry",    usdKg: 15,   doseLow: 0.01, doseHigh: 0.05,  kgLow: 0.105, kgHigh: 0.525, costLow: 1.58,  costHigh: 7.88,  quote: "novozymes.com",                addedBy: "System", addedDate: "2025-01-01", notes: "Wave 1 (Day 0). Industrial gold standard. Pair with xylanase and β-glucosidase for full cellulose cascade." },
  { id: 33, category: "⚗️ Enzyme",          name: "Xylanase (EC 3.2.1.8)",         icbb: "EC 3.2.1.8", supplier: "Commercial / Alibaba",       fn: "β-1,4-xylosidic hemicellulose cleavage → xylose. Strips hemi shield from cellulose.", temp: "40–55", bsfSafe: "✅", form: "Dry",    usdKg: 17,   doseLow: 0.01, doseHigh: 0.05,  kgLow: 0.08,  kgHigh: 0.42,  costLow: 1.36,  costHigh: 7.14,  quote: "Alibaba bulk",                 addedBy: "System", addedDate: "2025-01-01", notes: "Wave 1 (Day 0). Must pair with cellulase — xylan coat blocks cellulase access to cellulose fibres." },
  { id: 34, category: "⚗️ Enzyme",          name: "Laccase (EC 1.10.3.2)",         icbb: "EC 1.10.3.2", supplier: "Commercial / Alibaba",      fn: "Phenolic detoxification — opens lignin surface for fungal attack. Optional booster.", temp: "30–50", bsfSafe: "✅", form: "Dry",    usdKg: 20,   doseLow: 0.01, doseHigh: 0.03,  kgLow: 0.05,  kgHigh: 0.21,  costLow: 1.0,   costHigh: 4.2,   quote: "Alibaba bulk",                 addedBy: "System", addedDate: "2025-01-01", notes: "Optional Wave 1 booster (Day 3-7). Pre-opens lignin surface before white-rot fungi colonise." },
  { id: 35, category: "⚗️ Enzyme",          name: "Pectinase (EC 3.2.1.15)",       icbb: "EC 3.2.1.15", supplier: "Commercial / DSM",          fn: "Pectin breakdown — softens cell walls. Useful for OPDC blend.", temp: "40–50", bsfSafe: "✅", form: "Dry",    usdKg: 12,   doseLow: 0.005,doseHigh: 0.02,  kgLow: 0.035, kgHigh: 0.14,  costLow: 0.42,  costHigh: 1.68,  quote: "DSM Singapore / Alibaba",      addedBy: "System", addedDate: "2025-01-01", notes: "Wave 1 (Day 0). Particularly useful when OPDC content > 30% of blend." },
  { id: 36, category: "⚗️ Enzyme",          name: "Lipase (EC 3.1.1.3)",           icbb: "EC 3.1.1.3", supplier: "Novozymes Indonesia",        fn: "Fat/lipid breakdown. Relevant for OPDC 3-8% lipid content reduction.", temp: "35–45", bsfSafe: "✅", form: "Dry",    usdKg: 18,   doseLow: 0.005,doseHigh: 0.02,  kgLow: 0.035, kgHigh: 0.14,  costLow: 0.63,  costHigh: 2.52,  quote: "novozymes.com",                addedBy: "System", addedDate: "2025-01-01", notes: "Wave 1 (Day 0). Reduces lipid content which can cause BSF FCR issues if substrate is too fatty." },
  { id: 37, category: "⚗️ Enzyme",          name: "Protease (EC 3.4.x.x)",         icbb: "EC 3.4",    supplier: "Commercial / Alibaba",        fn: "Protein accessibility for BSF larvae. Cleaves intact protein structures.", temp: "40–55", bsfSafe: "✅", form: "Dry",    usdKg: 10,   doseLow: 0.005,doseHigh: 0.02,  kgLow: 0.035, kgHigh: 0.14,  costLow: 0.35,  costHigh: 1.4,   quote: "Alibaba bulk",                 addedBy: "System", addedDate: "2025-01-01", notes: "Wave 1 (Day 0). Especially useful for OPDC protein fraction — increases BSF bioavailable N." },
  { id: 38, category: "⚗️ Enzyme",          name: "Amylase (EC 3.2.1.1)",          icbb: "EC 3.2.1.1", supplier: "Commercial / Indotrading",   fn: "Starch → glucose. Relevant for POME sludge blend (starch residue).", temp: "55–70", bsfSafe: "✅", form: "Dry",    usdKg: 8,    doseLow: 0.01, doseHigh: 0.03,  kgLow: 0.07,  kgHigh: 0.21,  costLow: 0.56,  costHigh: 1.68,  quote: "Alibaba bulk",                 addedBy: "System", addedDate: "2025-01-01", notes: "Wave 1 (Day 0). Higher temp optimum — active during early hot phase. Low dose needed." },
  { id: 39, category: "⚗️ Enzyme",          name: "Mannanase (EC 3.2.1.78)",       icbb: "EC 3.2.1.78", supplier: "Alibaba / DSM",             fn: "Mannan breakdown — important for palm kernel substrate (PKM/PKE blends).", temp: "45–55", bsfSafe: "✅", form: "Dry",    usdKg: 22,   doseLow: 0.005,doseHigh: 0.02,  kgLow: 0.035, kgHigh: 0.14,  costLow: 0.77,  costHigh: 3.08,  quote: "Alibaba/DSM",                  addedBy: "System", addedDate: "2025-01-01", notes: "Wave 1 (Day 0). Most relevant when PKM/PKE supplementation is used in BSF substrate blend." },
  { id: 40, category: "⚗️ Enzyme",          name: "β-glucosidase (EC 3.2.1.21)",   icbb: "EC 3.2.1.21", supplier: "Novozymes",                fn: "Final cellulose cascade step — cleaves cellobiose → glucose. Prevents product inhibition.", temp: "45–55", bsfSafe: "✅", form: "Dry",    usdKg: 25,   doseLow: 0.005,doseHigh: 0.015, kgLow: 0.035, kgHigh: 0.105, costLow: 0.88,  costHigh: 2.63,  quote: "novozymes.com",                addedBy: "System", addedDate: "2025-01-01", notes: "Wave 1 (Day 0). Critical pair with cellulase — without β-glucosidase, cellobiose accumulates and inhibits cellulase activity." },
  // ── ALGAE — STREAM B HYDRATOR (NEW — Mar 2026) ─────────────────────────────
  { id: 42, category: "🌿 Algae-B Stream",  name: "Arthrospira platensis (Spirulina)", icbb: "—",      supplier: "CFI On-site POME Raceway ($0 OpEx)", fn: "STREAM B HYDRATION LIQUOR. Grown in POME raceways — free tropical sunlight. 1.25 g DM/L POME. 65% CP (Met + Lys). Delivers 2.31 kg DM algae per tonne EFB DM via 1,850 L hydration. Neonate BSF survival +22%. FCR -0.7. BSF meal 45%→56% CP.", temp: "25–38 tropical", bsfSafe: "✅", form: "Liquid slurry", usdKg: 0, doseLow: 0, doseHigh: 0, kgLow: 2.31, kgHigh: 2.31, costLow: 0, costHigh: 0, quote: "On-site raceway — see ALGAE_HYDRATOR tab in Excel", addedBy: "System", addedDate: "2026-03-01", notes: "⭐ CFI PRIMARY CHOICE. $0 ongoing OpEx — CapEx only (~$32,400 raceway build). Replaces hydration water in S3 substrate prep. Spirulina superior to Chlorella: higher CP, better tropical temp tolerance. At 60 TPH: 207.9 kg algae DM/day, 135 kg Spirulina protein/day. Refs: Holman et al. 2012; Becker 2007; Lam & Lee 2012." },
  { id: 43, category: "🌿 Algae-B Stream",  name: "Chlorella vulgaris",            icbb: "—",         supplier: "CFI On-site POME Raceway ($0 OpEx)", fn: "STREAM B HYDRATION LIQUOR (backup to Spirulina). Grown in POME raceways. 1.1 g DM/L POME. 45% CP (Lys-rich). Delivers 2.03 kg DM algae per tonne EFB DM via 1,850 L hydration. Neonate BSF survival +15%. FCR -0.5. BSF meal 45%→51% CP.", temp: "20–30", bsfSafe: "✅", form: "Liquid slurry", usdKg: 0, doseLow: 0, doseHigh: 0, kgLow: 2.03, kgHigh: 2.03, costLow: 0, costHigh: 0, quote: "On-site raceway — see ALGAE_HYDRATOR tab in Excel", addedBy: "System", addedDate: "2026-03-01", notes: "✅ Backup option to Spirulina. Faster doubling time (2-4 days vs 3-5 days) but lower CP. May require centrifuge for harvest (vs gravity sedimentation for Spirulina). POME BOD removal 35-50%. Refs: Richmond 2004; Becker 2013; Lam & Lee 2012." },
];

const CATEGORIES = [
  "Thermo Fungi", "Thermo Bacteria", "Thermo Actino",
  "Lignin Fungi", "Cellulase Fungi", "Protein Fungi",
  "Bacteria", "Yeast",
  "N-Fixer", "P-Solubiliser", "K-Mobiliser",
  "Actinomycete", "Enzyme",
  "Algae-B Stream", "CONDITIONAL"
];

const FORMS = ["Dry", "Wet", "Liquid", "Liquid slurry", "Granule", "Paste"];
const BSF_SAFE_OPTS = ["OK", "Warning Caution", "Fail TOXIC"];

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
  if (cat.includes("Lignin Fungi")) return "#9f7aea";
  if (cat.includes("Cellulase Fungi")) return "#b794f4";
  if (cat.includes("Protein Fungi")) return "#e879f9";
  if (cat.includes("Fungi")) return "#9f7aea";
  if (cat.includes("Bacteria")) return C.blue;
  if (cat.includes("Yeast")) return "#f6e05e";
  if (cat.includes("N-Fixer")) return C.green;
  if (cat.includes("P-Solubiliser")) return "#fc8181";
  if (cat.includes("K-Mobiliser")) return "#68d391";
  if (cat.includes("Actino")) return "#fbd38d";
  if (cat.includes("Enzyme")) return C.gold;
  if (cat.includes("Algae")) return "#38a169";
  if (cat.includes("CONDITIONAL")) return "#f6ad55";
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

  // ── BSF Handoff Gate state ────────────────────────────────────────────────
  const [gateVals, setGateVals] = useState({ ph: "", temp: "", mc: "", hrs: "", visual: "Pass", bioDone: "Pass" });
  function setGV(k, v) { setGateVals(g => ({ ...g, [k]: v })); }

  // ── Protocol / Inoculation Options state ─────────────────────────────────
  const [inocOption, setInocOption] = useState("A");
  const [batchFWProt, setBatchFWProt] = useState(100);
  const [batchesDay, setBatchesDay] = useState(2);

  // ── Calculators state (Gas + PKSA) ────────────────────────────────────────
  const [calcBatch, setCalcBatch] = useState(100);
  const [calcMC, setCalcMC]     = useState(62);
  const [pksaKg, setPksaKg]     = useState(20);
  const [pksaBatch, setPksaBatch] = useState(100);

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
      category: "Bacteria", name: "", icbb: "—", supplier: "",
      fn: "", temp: "", bsfSafe: "OK", form: "Dry",
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
    const bmatch = filterBSF === "ALL" || o.bsfSafe === filterBSF || (filterBSF === "OK" && o.bsfSafe === "OK") || (filterBSF === "Fail" && o.bsfSafe.includes("Fail"));
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
      bsfSafe: text.includes("BSF Safe: OK") || text.includes("BSF-Safe: OK") || text.includes("BSF Safe: ✅") || text.includes("BSF-Safe: ✅") ? "OK" : text.includes("❌") || text.includes("Fail") ? "Fail TOXIC" : "Warning Caution",
      supplier: getLine("Indonesian supplier") || getLine("Best quote"),
      quote: getLine("Best quote link") || getLine("Quote"),
      usdKg: getLine("\\$/kg estimate") || getLine("\\$/kg"),
      doseLow: getLine("Dose LOW % DM") || "",
      doseHigh: getLine("Dose HIGH % DM") || "",
      notes: getLine("Any warnings") || "",
    };
    // Guess category
    if (text.includes("Spirulina") || text.includes("Chlorella") || text.includes("algae") || text.includes("microalgae")) {
      afForm.category = "Algae-B Stream";
    } else if (text.includes("Rhizopus") || text.includes("tempeh") || (text.toLowerCase().includes("protein fungi") || (text.toLowerCase().includes("fungi") && text.includes("protease") && text.includes("lipase")))) {
      afForm.category = "Protein Fungi";
    } else if (text.includes("thermophil") || text.includes("Thermomyces") || text.includes("Geobacillus")) {
      afForm.category = text.toLowerCase().includes("fungi") ? "Thermo Fungi" : "Thermo Bacteria";
    } else if (text.includes("N-fix") || text.includes("Azotobacter") || text.includes("Azospirillum")) {
      afForm.category = "N-Fixer";
    } else if (text.toLowerCase().includes("lignin") && (text.toLowerCase().includes("fungi") || text.toLowerCase().includes("mushroom"))) {
      afForm.category = "Lignin Fungi";
    } else if (text.toLowerCase().includes("cellulas") && (text.toLowerCase().includes("fungi"))) {
      afForm.category = "Cellulase Fungi";
    } else if (text.toLowerCase().includes("fungi") || text.toLowerCase().includes("mushroom")) {
      afForm.category = "Lignin Fungi";
    } else if (text.toLowerCase().includes("enzyme") || text.toLowerCase().includes("cellulase")) {
      afForm.category = "Enzyme";
    } else if (text.includes("Streptomyces") || text.toLowerCase().includes("actinomycete")) {
      afForm.category = "Actinomycete";
    } else if (text.includes("Yeast") || text.includes("Saccharomyces") || text.includes("yeast")) {
      afForm.category = "Yeast";
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
    setFormMsg({ type: "ok", msg: `OK ${form.name} added to the database by ${userName} on ${now}.` });
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
    if (adminPin === ADMIN_PIN) { setAdminUnlocked(true); setAdminMsg({ type: "ok", msg: "Unlocked Admin access granted — Sharon." }); }
    else { setAdminMsg({ type: "err", msg: "Fail Incorrect PIN." }); }
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
            <div style={{ color: C.textDim, fontSize: 11, marginTop: 2 }}>{organisms.length} organisms total · {userAdded.length} user-added · Showing {filtered.length} · <span style={{ color: "#f6e05e" }}>v2 Mar 2026</span></div>
          </div>
          <button style={s.btnFill(C.accent)} onClick={() => setTab("add")}>+ ADD NEW BIOLOGICAL</button>
        </div>

        <div style={{ ...s.alert("#38a169"), marginBottom: 12, fontSize: 11 }}>
          <strong>v2 Mar 2026 UPDATES:</strong> Added Rhizopus oligosporus (#41) · Arthrospira platensis/Spirulina (#42) · Chlorella vulgaris (#43) · Bt ICBB 6095 updated EXCLUDED → ⚠️ CONDITIONAL (S3 timing-critical). Full 43-organism registry now loaded. 9 new enzyme rows. All categories updated.
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
                <tr key={o.id} style={{ background: o.bsfSafe.includes("❌") ? "#1a0a0a" : o.category.includes("CONDITIONAL") ? "#1a150a" : o.category.includes("Algae") ? "#0a1a0d" : o.addedBy !== "System" ? "#0a1a0d" : "transparent" }}>
                  <td style={{ ...s.tdMuted, width: 28 }}>{o.id}</td>
                  <td style={s.td}><span style={s.badge(catColor(o.category))}>{o.category}</span></td>
                  <td style={{ ...s.td, fontWeight: 600, color: o.bsfSafe.includes("❌") ? C.danger : o.category.includes("CONDITIONAL") ? C.warn : o.category.includes("Algae") ? C.green : C.text, minWidth: 180 }}>
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
            ["BT RULE (Updated Mar 2026)", "Bacillus thuringiensis (Bt) ICBB 6095 is now CONDITIONAL — S3 composting phase ONLY, before BSF introduction. HARD GATE before S4: titre must decay to below 10⁴ CFU/g (confirmed by lab test). Never apply when BSF larvae are present. This rule cannot be overridden by any user including admin."],
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

  // ── WB4 S3 BIO TAB (placeholder) ──────────────────────────────────────────
  function renderWB4() {
    return (
      <div style={s.body}>
        <div style={{ background: "#1A3A5C", border: "1.5px solid #1E6B8C", borderRadius: 8, padding: "32px 24px", textAlign: "center" }}>
          <h3 style={{ color: "#F5A623", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 20, margin: "0 0 8px" }}>WB4 S3 Bio</h3>
          <p style={{ color: "#8BA0B4", fontFamily: "'DM Sans', sans-serif", fontSize: 14, margin: 0 }}>Coming Soon</p>
        </div>
      </div>
    );
  }

  // ── PERSONAS TAB (placeholder) ────────────────────────────────────────────
  function renderPersonas() {
    return (
      <div style={s.body}>
        <div style={{ background: "#1A3A5C", border: "1.5px solid #1E6B8C", borderRadius: 8, padding: "32px 24px", textAlign: "center" }}>
          <h3 style={{ color: "#F5A623", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 20, margin: "0 0 8px" }}>Personas</h3>
          <p style={{ color: "#8BA0B4", fontFamily: "'DM Sans', sans-serif", fontSize: 14, margin: 0 }}>Coming Soon</p>
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
          { id: "registry",    label: "📋 Registry" },
          { id: "protocol",    label: "🧪 Protocol" },
          { id: "gate",        label: "🚦 BSF Gate" },
          { id: "calculators", label: "📊 Calculators" },
          { id: "research",    label: "🔬 AI Research" },
          { id: "add",         label: "➕ Add New" },
          { id: "admin",       label: "🔒 Admin" },
          { id: "wb4",         label: "WB4 S3 Bio" },
          { id: "personas",    label: "Personas" },
        ].map(t => <button key={t.id} style={s.tab(tab === t.id)} onClick={() => setTab(t.id)}>{t.label}</button>)}
      </div>

      {tab === "registry"    && renderRegistry()}
      {tab === "protocol"    && renderProtocol()}
      {tab === "gate"        && renderGate()}
      {tab === "calculators" && renderCalculators()}
      {tab === "research"    && renderResearch()}
      {tab === "add"         && renderAdd()}
      {tab === "admin"       && renderAdmin()}
      {tab === "wb4"         && renderWB4()}
      {tab === "personas"    && renderPersonas()}
    </div>
  );

  // ─────────────────────────────────────────────────────────────────────────
  // PROTOCOL TAB — One-Shot Protocol + Inoculation Options
  // ─────────────────────────────────────────────────────────────────────────
  function renderProtocol() {
    const ONE_SHOT = [
      { no: 1, name: "Lactobacillus EM-4",       fn: "pH buffer + CH4 control",         benefit: "70-80% CH4 reduction",      dose: "10 mL/kg", costPerT: 0.05, mandatory: false },
      { no: 2, name: "Saccharomyces cerevisiae",  fn: "NH3 retention + fermentation",    benefit: "50% NH3 reduction",         dose: "5 mL/kg",  costPerT: 0.11, mandatory: false },
      { no: 3, name: "Bacillus subtilis",         fn: "Cellulase (replaces enzyme)",     benefit: "79x cheaper than Novozymes", dose: "1 g/kg",  costPerT: 0.02, mandatory: false },
      { no: 4, name: "Azotobacter vinelandii",    fn: "N2-fixer, BSF protein source",    benefit: "+0.5% N/DM enrichment",    dose: "2 g/kg",  costPerT: 0.05, mandatory: false },
      { no: 5, name: "Trichoderma harzianum",     fn: "Ganoderma biocontrol + cellulase", benefit: "MANDATORY for plantations", dose: "2 g/kg", costPerT: 0.42, mandatory: true },
    ];
    const OPTS = {
      A: { name: "ONE-SHOT (Default)", desc: "Day 1 only — all 5 organisms", totalMin: 0.65, totalMax: 0.65, day7: null, day14: null },
      B: { name: "TWO INOCULATIONS",  desc: "Day 1 + Day 7 Azotobacter boost", totalMin: 0.70, totalMax: 0.70, day7: "Azotobacter boost — $0.05/t FW", day14: null },
      C: { name: "THREE INOCULATIONS", desc: "Day 1 + Day 7 + Day 14 maturation", totalMin: 1.20, totalMax: 2.20, day7: "Azotobacter boost — $0.05/t FW", day14: "Trichoderma + optional enzyme — $0.50-$1.50/t FW" },
    };
    const opt = OPTS[inocOption];
    const dailyFW = batchFWProt * batchesDay;
    const monthlyFW = dailyFW * 30;
    const hcell = { padding: "7px 10px", color: C.accent, fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", borderBottom: "1px solid #1e3a5c", textAlign: "center" };
    const dcell = (clr) => ({ padding: "6px 10px", color: clr || C.text, fontSize: 11, fontFamily: "monospace", textAlign: "center" });

    return (
      <div style={s.panel}>
        <div style={{ background: "#0a1628", border: "1px solid #1e3a5c", borderRadius: 8, padding: 14, marginBottom: 16 }}>
          <div style={{ color: C.gold, fontWeight: 700, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>Inoculation Conditions — ALL Must Pass Before Adding Organisms</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
            {[
              ["pH", "6.5 - 8.0", ">9.0 kills microbes"],
              ["Temperature", "35 - 45 C", ">50C kills fungi"],
              ["Moisture", "50 - 65%", "< 40% or >70% = fail"],
              ["Time after PKSA", ">= 24 hours", "< 24h = alkaline shock"],
            ].map(([label, range, kill]) => (
              <div key={label} style={{ background: "#060e1c", borderRadius: 6, padding: "8px 10px", borderLeft: "2px solid " + C.accent }}>
                <div style={{ color: C.accent, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</div>
                <div style={{ color: C.green, fontFamily: "monospace", fontSize: 13, fontWeight: 700, margin: "3px 0" }}>{range}</div>
                <div style={{ color: C.danger, fontSize: 9 }}>Kill: {kill}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: 16, marginBottom: 16, alignItems: "flex-end" }}>
          <div>
            <div style={{ color: C.textDim, fontSize: 10, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>Batch size (t FW)</div>
            <input type="number" style={{ ...s.input, width: 90, background: "#0d1a2e", border: "1.5px solid #4299e1", color: C.gold, fontFamily: "monospace", fontWeight: 700 }} value={batchFWProt} onChange={e => setBatchFWProt(Number(e.target.value))} />
          </div>
          <div>
            <div style={{ color: C.textDim, fontSize: 10, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>Batches/day</div>
            <input type="number" style={{ ...s.input, width: 70, background: "#0d1a2e", border: "1.5px solid #4299e1", color: C.gold, fontFamily: "monospace", fontWeight: 700 }} value={batchesDay} onChange={e => setBatchesDay(Number(e.target.value))} />
          </div>
          <div style={{ color: C.textDim, fontSize: 12 }}>
            Daily: <strong style={{ color: C.accent }}>{dailyFW.toFixed(0)} t FW</strong>
            {"   "}Monthly: <strong style={{ color: C.accent }}>{monthlyFW.toFixed(0)} t FW</strong>
          </div>
        </div>

        <div style={{ color: C.accent, fontWeight: 700, fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>
          One-Shot Protocol — Day 1 (24h post-PKSA) — Total: <span style={{ color: C.green }}>$0.65 / t FW</span>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 20, fontSize: 11 }}>
          <thead>
            <tr style={{ background: "#060e1c" }}>
              {["#", "Organism", "Key Function", "Verified Benefit", "Dose", "$/t FW", "Mandatory?"].map(h => (
                <th key={h} style={hcell}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ONE_SHOT.map((o, i) => (
              <tr key={o.no} style={{ background: i % 2 === 0 ? "#060e1c" : "#070f1e", borderBottom: "1px solid #0d1e3a" }}>
                <td style={dcell(C.textDim)}>{o.no}</td>
                <td style={{ ...dcell(), textAlign: "left", fontWeight: 600 }}>{o.name}</td>
                <td style={{ ...dcell(), textAlign: "left", color: C.textDim }}>{o.fn}</td>
                <td style={{ ...dcell(), textAlign: "left", color: C.textDim }}>{o.benefit}</td>
                <td style={dcell(C.accent)}>{o.dose}</td>
                <td style={dcell(C.gold)}>${o.costPerT.toFixed(2)}</td>
                <td style={dcell()}>{o.mandatory ? <span style={{ color: C.danger, fontWeight: 700 }}>YES (plantation)</span> : <span style={{ color: C.textDim }}>Optional</span>}</td>
              </tr>
            ))}
            <tr style={{ background: "#0a1628", borderTop: "2px solid " + C.accent }}>
              <td colSpan={5} style={{ padding: "8px 10px", color: C.accent, fontWeight: 700, fontSize: 12 }}>TOTAL — One-Shot Day 1</td>
              <td style={{ padding: "8px 10px", color: C.green, fontWeight: 700, fontFamily: "monospace", fontSize: 13, textAlign: "center" }}>$0.65</td>
              <td style={{ padding: "8px 10px", color: C.textDim, fontSize: 10, textAlign: "center" }}>
                ${(0.65 * batchFWProt).toFixed(0)} total / batch
              </td>
            </tr>
          </tbody>
        </table>

        <div style={{ color: C.gold, fontWeight: 700, fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 10 }}>Inoculation Strategy</div>
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          {["A", "B", "C"].map(k => {
            const o2 = OPTS[k];
            return (
              <button key={k} onClick={() => setInocOption(k)} style={{ flex: 1, padding: "10px 8px", borderRadius: 7, border: "1.5px solid " + (inocOption === k ? C.accent : "#1e3a5c"), background: inocOption === k ? "#0b2a4a" : "#060e1c", cursor: "pointer", textAlign: "left" }}>
                <div style={{ color: inocOption === k ? C.accent : C.textDim, fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3 }}>Option {k} — {o2.name}</div>
                <div style={{ color: C.textDim, fontSize: 10, marginBottom: 4 }}>{o2.desc}</div>
                <div style={{ color: C.green, fontFamily: "monospace", fontWeight: 700, fontSize: 13 }}>${o2.totalMin.toFixed(2)}{o2.totalMin !== o2.totalMax ? " - $" + o2.totalMax.toFixed(2) : ""} /t FW</div>
              </button>
            );
          })}
        </div>
        <div style={{ background: "#060e1c", border: "1px solid #1e3a5c", borderRadius: 8, padding: 14 }}>
          <div style={{ color: C.accent, fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Option {inocOption} Schedule</div>
          {[
            { day: "Day 1 — 24h post-PKSA", detail: "All 5 core organisms", cost: "$0.65/t FW", show: true },
            { day: "Day 7 — N-fixer boost",  detail: opt.day7 || "—", cost: "", show: !!opt.day7 },
            { day: "Day 14 — Maturation",    detail: opt.day14 || "—", cost: "", show: !!opt.day14 },
          ].map((row, i) => (
            <div key={i} style={{ display: "flex", gap: 16, padding: "6px 0", borderBottom: "1px solid #0d1e3a", opacity: row.show ? 1 : 0.3 }}>
              <div style={{ color: C.gold, fontWeight: 700, fontSize: 11, minWidth: 180 }}>{row.day}</div>
              <div style={{ color: C.textDim, fontSize: 11, flex: 1 }}>{row.detail}</div>
              {row.cost && <div style={{ color: C.green, fontFamily: "monospace", fontSize: 11 }}>{row.cost}</div>}
            </div>
          ))}
          <div style={{ marginTop: 10, color: C.textDim, fontSize: 11 }}>
            Monthly at {monthlyFW.toFixed(0)} t FW/month:
            <strong style={{ color: C.green, marginLeft: 6 }}>${(opt.totalMin * monthlyFW).toFixed(0)}</strong>
            {opt.totalMin !== opt.totalMax && <span> - <strong style={{ color: C.warn }}>${(opt.totalMax * monthlyFW).toFixed(0)}</strong></span>}
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // GATE TAB — BSF Handoff Gate 6-criteria pass/fail
  // ─────────────────────────────────────────────────────────────────────────
  function renderGate() {
    const CRITERIA = [
      { key: "ph",      label: "1. pH",                    type: "num",    min: 6.5,  max: 8.0,  unit: "pH",  kill: ">9.0 kills microbes; <5.5 too acidic for BSF",          action: "Wait 24-48h; do NOT add more PKSA." },
      { key: "temp",    label: "2. Temperature",           type: "num",    min: 35,   max: 45,   unit: "C",   kill: ">50C kills fungi; <30C too cold for BSF",               action: "Turn pile; add water; shade from direct sun." },
      { key: "mc",      label: "3. Moisture",              type: "num",    min: 50,   max: 65,   unit: "%",   kill: "<40% desiccates; >70% anaerobic zones",                 action: "Add water if <50%; turn/aerate if >65%." },
      { key: "hrs",     label: "4. Hours since PKSA",      type: "num",    min: 24,   max: null, unit: "hrs", kill: "<24h alkaline shock still active",                      action: "Wait until 24h elapsed; re-measure pH first." },
      { key: "visual",  label: "5. Visual / Odour",        type: "sel",    opts: ["Pass", "Fail"], kill: "Strong NH3; black/green mould",                                   action: "Aerate; re-dose Saccharomyces; remove mould." },
      { key: "bioDone", label: "6. Biology pre-treatment", type: "sel",    opts: ["Pass", "Fail"], kill: "BSF before inoculants activated",                                  action: "Apply missing organisms; wait 24h minimum." },
    ];

    function getRes(c) {
      const v = gateVals[c.key];
      if (v === "" || v === null || v === undefined) return "?";
      if (c.type === "sel") return v === "Pass" ? "PASS" : "FAIL";
      const n = Number(v);
      if (isNaN(n)) return "?";
      if (c.min !== null && n < c.min) return "FAIL";
      if (c.max !== null && n > c.max) return "FAIL";
      return "PASS";
    }

    const results = CRITERIA.map(c => getRes(c));
    const allPass = results.every(r => r === "PASS");
    const anyFail = results.some(r => r === "FAIL");
    const overallColor = allPass ? C.green : anyFail ? C.danger : C.gold;
    const overallLabel = allPass ? "ALL PASS — BSF LARVAE CAN BE INTRODUCED" : anyFail ? "GATE FAIL — DO NOT INTRODUCE BSF" : "INCOMPLETE — ENTER ALL VALUES";

    return (
      <div style={s.panel}>
        <div style={{ color: C.accent, fontWeight: 700, fontSize: 13, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 4 }}>BSF Handoff Gate</div>
        <div style={{ color: C.textDim, fontSize: 11, marginBottom: 16 }}>All 6 criteria must PASS before introducing BSF larvae. Enter measured substrate values.</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
          {CRITERIA.map((c, idx) => {
            const res = getRes(c);
            const rc = res === "PASS" ? C.green : res === "FAIL" ? C.danger : C.gold;
            return (
              <div key={c.key} style={{ background: "#060e1c", borderRadius: 8, padding: 14, border: "1.5px solid " + (res === "PASS" ? "#1a4a2e" : res === "FAIL" ? "#4a1a1a" : "#1e3a5c") }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div style={{ color: C.gold, fontWeight: 700, fontSize: 11 }}>{c.label}</div>
                  <div style={{ color: rc, fontWeight: 800, fontSize: 12, fontFamily: "monospace", background: rc + "22", padding: "2px 8px", borderRadius: 4 }}>{res}</div>
                </div>
                {c.type === "num" ? (
                  <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                    <input type="number" placeholder="Enter" style={{ background: "#0d1a2e", border: "1.5px solid #4299e1", color: C.gold, padding: "5px 8px", borderRadius: 4, fontFamily: "monospace", fontWeight: 700, width: 90, fontSize: 14 }}
                      value={gateVals[c.key]} onChange={e => setGV(c.key, e.target.value)} />
                    <span style={{ color: C.textDim, fontSize: 11 }}>{c.unit}</span>
                    <span style={{ color: C.accent, fontSize: 10 }}>
                      {c.min !== null ? c.min : ""}
                      {c.min !== null && c.max !== null ? " - " : ""}
                      {c.max !== null ? c.max : "+"} {c.unit}
                    </span>
                  </div>
                ) : (
                  <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                    {c.opts.map(opt => (
                      <button key={opt} onClick={() => setGV(c.key, opt)} style={{ padding: "4px 14px", borderRadius: 4, border: "1.5px solid " + (gateVals[c.key] === opt ? (opt === "Pass" ? C.green : C.danger) : "#1e3a5c"), background: gateVals[c.key] === opt ? (opt === "Pass" ? "#1a4a2e" : "#4a1a1a") : "transparent", color: gateVals[c.key] === opt ? (opt === "Pass" ? C.green : C.danger) : C.textDim, cursor: "pointer", fontWeight: 700, fontSize: 11 }}>{opt}</button>
                    ))}
                  </div>
                )}
                <div style={{ color: C.danger, fontSize: 9, marginBottom: 3 }}>Kill zone: {c.kill}</div>
                {res === "FAIL" && <div style={{ color: C.warn, fontSize: 10, marginTop: 4, fontStyle: "italic" }}>Action: {c.action}</div>}
              </div>
            );
          })}
        </div>
        <div style={{ background: overallColor + "18", border: "2px solid " + overallColor, borderRadius: 10, padding: "16px 20px", textAlign: "center", marginBottom: 14 }}>
          <div style={{ color: overallColor, fontWeight: 800, fontSize: 15, letterSpacing: "0.04em" }}>{overallLabel}</div>
          <div style={{ color: C.textDim, fontSize: 11, marginTop: 6 }}>{results.filter(r => r === "PASS").length} / 6 criteria passing</div>
        </div>
        <div style={{ background: "#060e1c", border: "1px solid #4a1a1a", borderRadius: 8, padding: 12 }}>
          <div style={{ color: C.danger, fontWeight: 700, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Excluded Organisms — Never Use in BSF Pathways</div>
          <div style={{ color: C.warn, fontFamily: "monospace", fontSize: 11 }}>
            Bt ICBB 6095 — Bt delta-endotoxin is lethal to BSF larvae. S3 composting phase ONLY (amber guardrail). Titre must decay to less than 10 to the 4 CFU/g before S4 BSF loading.
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // CALCULATORS TAB — Gas Emissions + PKSA K2O
  // ─────────────────────────────────────────────────────────────────────────
  function renderCalculators() {
    const dmCalc = calcBatch * (1 - calcMC / 100);
    const ch4Red = dmCalc * 3.5 * 0.75;
    const nh3Red = dmCalc * 1.2 * 0.50;
    const co2Red = dmCalc * 8.0 * 0.15;
    const pksaApplied = pksaBatch * pksaKg;
    const k2oMin = pksaApplied * 0.35;
    const k2oMax = pksaApplied * 0.45;

    function KPI({ label, value, unit, color, sub }) {
      return (
        <div style={{ background: "#060e1c", borderRadius: 7, padding: "10px 12px", textAlign: "center", borderTop: "2px solid " + (color || C.accent) }}>
          <div style={{ color: C.textDim, fontSize: 9, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3 }}>{label}</div>
          <div style={{ color: color || C.accent, fontFamily: "monospace", fontWeight: 800, fontSize: 18 }}>{value}</div>
          <div style={{ color: C.textDim, fontSize: 9, marginTop: 2 }}>{unit}</div>
          {sub && <div style={{ color: C.textDim, fontSize: 9, marginTop: 3, fontStyle: "italic" }}>{sub}</div>}
        </div>
      );
    }

    return (
      <div style={s.panel}>
        <div style={{ display: "flex", gap: 16, marginBottom: 20, alignItems: "flex-end" }}>
          {[
            { label: "Batch (t FW)", val: calcBatch, set: setCalcBatch, w: 100 },
            { label: "Moisture (%)", val: calcMC, set: setCalcMC, w: 80 },
          ].map(f => (
            <div key={f.label}>
              <div style={{ color: C.textDim, fontSize: 10, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>{f.label}</div>
              <input type="number" style={{ ...s.input, width: f.w, background: "#0d1a2e", border: "1.5px solid #4299e1", color: C.gold, fontFamily: "monospace", fontWeight: 700 }} value={f.val} onChange={e => f.set(Number(e.target.value))} />
            </div>
          ))}
          <div style={{ color: C.textDim, fontSize: 12 }}>DM: <strong style={{ color: C.accent }}>{dmCalc.toFixed(1)} t DM</strong></div>
        </div>

        <div style={{ background: "#0a1628", border: "1px solid #1e3a5c", borderRadius: 8, padding: 16, marginBottom: 18 }}>
          <div style={{ color: C.accent, fontWeight: 700, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 14 }}>Gas Emissions Reduction — Biological Effect</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 12 }}>
            <KPI label="CH4 Reduction" value={ch4Red.toFixed(1)} unit="kg / batch" color={C.green} sub="Lactobacillus EM-4 | 75% mean" />
            <KPI label="NH3 Reduction" value={nh3Red.toFixed(1)} unit="kg / batch" color="#9b59b6" sub="Saccharomyces | 50% reduction" />
            <KPI label="Batch DM" value={dmCalc.toFixed(1)} unit="t DM" color={C.accent} sub="Auto-calculated" />
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
            <thead>
              <tr style={{ background: "#060e1c" }}>
                {["Gas", "Mechanism", "Organism", "Reduction", "Emission Factor", "kg Reduced / batch", "Source"].map(h => (
                  <th key={h} style={{ padding: "6px 8px", color: C.accent, fontSize: 9, textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "1px solid #1e3a5c", textAlign: "left" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { gas: "CH4", mech: "Methanogen inhibition — pH drop to 4-5", org: "Lactobacillus EM-4",       pct: "75%", ef: "3.5 kg/t FW", red: ch4Red.toFixed(1),  src: "CFI verified", sc: C.green },
                { gas: "NH3", mech: "NH4+ assimilation by yeast biomass",       org: "Saccharomyces cerevisiae", pct: "50%", ef: "1.2 kg/t FW", red: nh3Red.toFixed(1),  src: "CFI verified", sc: C.green },
                { gas: "CO2", mech: "Aerobic decomposition (partial offset)",   org: "All aerobic organisms",   pct: "15%", ef: "8.0 kg/t FW", red: co2Red.toFixed(1), src: "DATA GAP",     sc: C.warn },
              ].map((r, i) => (
                <tr key={r.gas} style={{ background: i % 2 === 0 ? "#060e1c" : "#070f1e", borderBottom: "1px solid #0d1e3a" }}>
                  <td style={{ padding: "6px 8px", color: C.text, fontWeight: 600 }}>{r.gas}</td>
                  <td style={{ padding: "6px 8px", color: C.textDim }}>{r.mech}</td>
                  <td style={{ padding: "6px 8px", color: C.accent }}>{r.org}</td>
                  <td style={{ padding: "6px 8px", color: C.gold, fontFamily: "monospace", textAlign: "center" }}>{r.pct}</td>
                  <td style={{ padding: "6px 8px", color: C.textDim, fontFamily: "monospace", textAlign: "center" }}>{r.ef}</td>
                  <td style={{ padding: "6px 8px", color: C.green, fontFamily: "monospace", fontWeight: 700, textAlign: "center" }}>{r.red} kg</td>
                  <td style={{ padding: "6px 8px", color: r.sc, fontSize: 10, fontWeight: 600, textAlign: "center" }}>{r.src}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ color: C.textDim, fontSize: 9, marginTop: 8 }}>Emission factors are literature estimates (kg gas/t FW). Replace with site-measured values when available. CO2 = DATA GAP — no peer-reviewed DOI confirmed.</div>
        </div>

        <div style={{ background: "#0a1628", border: "1px solid #1e3a5c", borderRadius: 8, padding: 16 }}>
          <div style={{ color: C.gold, fontWeight: 700, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 14 }}>PKSA K2O Contribution — FREE Potassium</div>
          <div style={{ display: "flex", gap: 16, marginBottom: 14, alignItems: "flex-end" }}>
            {[
              { label: "Batch (t FW)", val: pksaBatch, set: setPksaBatch, w: 100 },
              { label: "PKSA rate (kg/t FW)", val: pksaKg, set: setPksaKg, w: 80 },
            ].map(f => (
              <div key={f.label}>
                <div style={{ color: C.textDim, fontSize: 10, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>{f.label}</div>
                <input type="number" style={{ ...s.input, width: f.w, background: "#0d1a2e", border: "1.5px solid #4299e1", color: C.gold, fontFamily: "monospace", fontWeight: 700 }} value={f.val} onChange={e => f.set(Number(e.target.value))} />
              </div>
            ))}
            <div style={{ color: C.textDim, fontSize: 11 }}>Typical: <strong style={{ color: C.accent }}>6-30 kg PKSA / t FW</strong></div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10, marginBottom: 12 }}>
            <KPI label="PKSA Applied" value={pksaApplied.toFixed(0)} unit="kg / batch" color={C.gold} />
            <KPI label="K2O Min" value={k2oMin.toFixed(0)} unit="kg K2O / batch" color={C.green} sub="35% K2O content" />
            <KPI label="K2O Max" value={k2oMax.toFixed(0)} unit="kg K2O / batch" color={C.green} sub="45% K2O content" />
            <KPI label="Cost" value="$0.00" unit="/ t FW" color={C.accent} sub="Mill waste — always free" />
          </div>
          <div style={{ background: "#060e1c", borderRadius: 6, padding: "8px 12px", fontSize: 11, color: C.textDim }}>
            PKSA locked at <strong style={{ color: C.accent }}>$0 cost</strong> (CLASS A guardrail). K2O content 35-45%: CFI Confirmed.
            At {pksaKg} kg/t FW, each tonne receives <strong style={{ color: C.green }}>{(pksaKg * 0.35).toFixed(1)} - {(pksaKg * 0.45).toFixed(1)} kg K2O free</strong>.
          </div>
        </div>
      </div>
    );
  }
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
        {safeOrgs.map(o => (
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
