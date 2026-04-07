# CFI Code Export — GitHub Backup Manifest

## Files in this export

| # | File | Description | Size |
|---|------|-------------|------|
| 1 | `1_ROUTING_PAGE_STRUCTURE.jsx` | App.jsx, SiteSetup.jsx, routing, page components, index.html, vite config | 512,698 bytes |
| 2 | `2_CALCULATOR_LOGIC.jsx` | All calculators: EFB, OPDC, POS, POME, GH, S1S2, NPK, Nutrient Ledger, AG Mgmt, Treatment Optimizer, Soil Calculator, Lab Display, Soil Acidity, SoilBio Viz | 784,474 bytes |
| 3 | `3_SUPABASE_INTEGRATION.jsx` | Supabase client, types, SectionAB (company/estate/mill cascade + soil RPC + weather), SectionC, SectionD, Bio Database Manager, Data Upload Pipeline | 356,817 bytes |
| 4 | `4_DESIGN_SYSTEM.jsx` | CSS variables, Tailwind config, colour tokens (C/S/F/T objects from all files), UnitInput, NavLink, utils | 19,610 bytes |
| 5 | `5_STATE_MANAGEMENT.jsx` | CFI_S0_Page.jsx (full), CFI_S0_Redesign.jsx, Soil Science Module, hooks | 159,585 bytes |

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
