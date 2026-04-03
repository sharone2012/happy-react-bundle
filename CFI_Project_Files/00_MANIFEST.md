# CFI Code Export — GitHub Backup Manifest

## Files in this export

| # | File | Description | Size |
|---|------|-------------|------|
| 1 | `1_ROUTING_PAGE_STRUCTURE.jsx` | App.jsx, SiteSetup.jsx, routing, page components, index.html, vite config | 512,698 bytes |
| 2 | `2_CALCULATOR_LOGIC.jsx` | All calculators: EFB, OPDC, POS, POME, GH, S1S2, NPK, Nutrient Ledger, AG Mgmt, Treatment Optimizer, Soil Calculator, Lab Display, Soil Acidity, SoilBio Viz | 784,474 bytes |
| 3 | `3_SUPABASE_INTEGRATION.jsx` | Supabase client, types, SectionAB (company/estate/mill cascade + soil RPC + weather), SectionC, SectionD, Bio Database Manager, Data Upload Pipeline | 356,817 bytes |
| 4 | `4_DESIGN_SYSTEM.jsx` | CSS variables, Tailwind config, colour tokens (C/S/F/T objects from all files), UnitInput, NavLink, utils | 19,610 bytes |
| 5 | `5_STATE_MANAGEMENT.jsx` | CFI_S0_Page.jsx (full), CFI_S0_Redesign.jsx, Soil Science Module, hooks | 159,585 bytes |

## Prompt Documents — Organised by Section

### `docs/s0/` — S0: Site Setup & Landing
| File | Description |
|------|-------------|
| `LOVABLE_S0_REDESIGN.txt` | Design system overhaul rules for S0 layout (8 rules: section card pattern, row layout, typography, inputs, outputs, residue cards, alignment, Section B specifics) |
| `LOVABLE_S0_REDESIGN_src_copy.txt` | Duplicate copy (was in `src/`) |

### `docs/s1/` — S1: Mechanical Engineering & Calculators
| File | Description |
|------|-------------|
| `S1_Mechanical_Calculator_Master_Prompt.docx` | Master prompt for S1 mechanical calculator |
| `S1_Dynamic_Calculator_Hub_v2.docx` | Dynamic calculator hub v2 for S1 |
| `Stage_1_Engineering_Plans_and_Process_flow.docx` | Engineering plans and process flow for Stage 1 |

### `docs/s3/` — S3: Biological & Soil Science
| File | Description |
|------|-------------|
| `LOVABLE_SOIL_SCIENCE_MODULE.md` | Soil science module (SOM, CEC, WHC, microbiome recovery, N-P-K balance) — full JSX component |
| `Biological__s__New_Organisms.md` | Expanded 9-organism stack: consortium compatibility, algae protein addition, master dosing matrix |

### `docs/shared/` — Cross-section (applies to all pages)
| File | Description |
|------|-------------|
| `CFI_Design_System_v3_Lovable.md` | Design system v3 — fonts, colour tokens, section styling (superseded by v4) |
| `CFI_Design_System_v4_WA_Dark.md` | Design system v4 — WhatsApp dark mode, applies to S0–S6, CAPEX, Summary |
| `CFI_Master_AI_Prompt_v4.docx` | Master AI prompt v4 |
| `CFI_System_Architecture_QA_Prompt_v1_1.docx` | System architecture QA prompt |
| `CFI_Lovable_Project_Brief_v4_2.docx` | Lovable project brief v4.2 |
| `First_Prompt_to_Upload.docx` | Initial upload prompt |
| `CFI_Supabase_Guide.docx` | Supabase integration guide |
| `CFI_DATA_LAKE_1_5_26.docx` | Data lake reference |
| `Claude___Supabase___Lovable__Production_Architecture_Guide.md` | Production architecture guide (Claude + Supabase + Lovable) |
| `1__PROMPT_Research_Intensity.docx` | Meta-prompt: research intensity rules |
| `2__PROMPT_Anti-Hallucinatin_-_source_reality_rules.docx` | Meta-prompt: anti-hallucination / source reality rules |
| `3__PROMPT_Guardrails_-_so_AI_doesnt_change_previous_version.docx` | Meta-prompt: guardrails to prevent breaking previous versions |
| `4__PROMPT_Persona_Enanceed.docx` | Meta-prompt: enhanced persona |

## Key Constants & Guardrails (from App.jsx)

- **EFB** = monthly_ffb × 0.225 (22.5% FFB)
- **OPDC** = EFB × 0.152 (15.2% EFB FW — LOCKED)
- **POS** = monthly_ffb × 0.015
- **PMF** = monthly_ffb × 0.145
- **POME** = monthly_ffb × 0.30
- **P2O5** = P × 2.291
- **K2O** = K × 1.205
- **N factor** = 4.67 (never 6.25)
- **OPDC MC floor** = 40% (hard clamp)
- **EFB off → OPDC auto-deselects**
- **PKE cost** = $160/t (purchased)
- **POME** = liquid only, excluded from solid mix

## Supabase Tables Referenced

- `cfi_sites` — main site/session record
- `cfi_mills_60tph` — mill registry (>60 TPH)
- `cfi_mill_owners` — company/owner lookup
- `cfi_estates` — estate/plantation data
- `cfi_province_soil_lookup` — soil by province
- `cfi_mill_soil_acidity` — GPS-based soil acidity cache
- `cfi_soil_profiles` — soil type profiles
- `cfi_feedstreams` — feedstream definitions
- `canonical_lab_data` — lab reference values
- `biological_library` — organism database
- `weather_cache` — weather data cache
- `carbon_credits` — carbon credit calculations
- RPC: `get_soil_acidity_class(lat, lon)`
