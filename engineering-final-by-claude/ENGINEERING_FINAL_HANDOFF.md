# CFI ENGINEERING FINAL — HANDOFF PROMPT

Copy everything below into a new Claude Code session.

---

## TASK: Create "Engineering Final" deliverable package

**Supabase Project ID:** lcpbtnipkvrmuwllymfw  
**GitHub Repos:** sharone2012/happy-react-bundle + sharone2012/cfi  
**Branch:** claude/consolidate-cfi-stages-Afy11

### WHAT TO DELIVER

Create a complete engineering deliverable package in a folder called `engineering-final/` in the happy-react-bundle repo. This folder should contain ALL engineering drawings, documentation, and financial models for the CFI S1/S2 facility.

### STEP 1: Collect all HTML engineering drawings

Clone or pull branch `claude/consolidate-cfi-stages-Afy11` from `sharone2012/happy-react-bundle`.

The following HTML files are in the repo root — copy them all into `engineering-final/html/`:

**NEW drawings (just built):**
1. `CFI_S1_SITE_MASTER_PLAN.html` (24KB) — Bird's eye site layout with all structures, roads, truck turning circle, fire access
2. `CFI_S1_TRUCK_RECEIVING.html` (13KB) — Truck drop-off area, EFB/OPDC receiving bays, feeders, conveyors
3. `CFI_S1_CONVEYOR_ROUTES.html` (22KB) — All 5 conveyors with SVG routes, elevation profile, cost summary
4. `CFI_S1_NEUTRALISATION_BAYS.html` (26KB) — NB-401/NB-402 bays, limestone dosing, wheel loaders, pH guardrails
5. `CFI_S2_MIXING_AREA.html` (22KB) — S2A (6 mixers + 2 belt presses), S2B (2 mixers + 1 belt press), RFQ items
6. `CFI_S1_GREENHOUSE_DETAIL.html` (25KB) — 6 structures, cross-section, specs, DATA GAP costs
7. `CFI_S1_CONVEYOR_GALLERY.html` (26KB) — 25m x 4m gallery, plan/cross-section/longitudinal views

**EXISTING drawings (already in Supabase `html_screenshots` table — pull content from there):**
8. `CFI_S1_FloorPlan_v2.html` (60KB) — Complete S1 layout, 2,800 m²
9. `CFI_S1_EFB_FloorPlan.html` (42KB) — EFB line floor plan
10. `CFI_S1_OPDC_FloorPlan.html` (43KB) — OPDC line floor plan
11. `CFI_S1_ARCH_FloorPlan.html` (42KB) — Architectural floor plan 36m x 35m
12. `CFI_S1_ASCII_FLOWS_COMPLETE.html` (30KB) — All 3 process lines
13. `CFI_S1_EFB_ASCII_v2.html` (14KB) — EFB process flow
14. `CFI_S1_OPDC_ASCII_v2.html` (14KB) — OPDC process flow
15. `CFI_S1_POS_ASCII_v1.html` (10KB) — POS process flow
16. `CFI_S1_Building_Architecture_v4.html` (64KB) — Master building architecture (tabbed)
17. `CFI_S1_ARCH_Elevation.html` (12KB) — Front elevation
18. `CFI_S1_CAPEX_OPEX_Wireframe.html` (18KB) — Cost dashboard
19. `CFI_S1_Combined_v2.html` (27KB) — Combined floor plans
20. `CFI_S1_INDEX.html` (16KB) — Document hub

### STEP 2: Create Markdown documentation for each drawing

For each HTML file, create a matching `.md` file in `engineering-final/docs/` that documents:
- **Title and revision**
- **What it shows** (description)
- **Engineering logic** behind the design (formulas, sizing rationale, standards used)
- **Data sources** (which Supabase tables the data comes from)
- **Key dimensions and specifications**
- **Cost summary** (if applicable)
- **Guardrails and gates** (if applicable)
- **Data gaps** flagged

### STEP 3: Create master engineering logic document

Create `engineering-final/docs/CFI_ENGINEERING_LOGIC.md` documenting ALL formulas and engineering logic:

**Floor Area Calculation:**
```
Total_Area = Receiving_Zone + Processing_Zone + Storage_Zone + Utilities_Zone × Circulation_Factor(1.3)
Receiving: 15 m² per TPH
Storage: 2.5 m² per tonne
EFB requires 50% more area than OPDC (fiber volume expansion)
```

**Hammer Mill Sizing:**
```
Required_Power_kW = (Throughput_tph × Work_Index_kWh_per_t × Safety_Factor) / Equipment_Efficiency
EFB Work Index = 12 kWh/t
OPDC Work Index = 8 kWh/t
Safety Factor = 1.2
```

**Conveyor Belt Length:**
```
Total_Length_m = Distance_Horizontal + (Height_Vertical / sin(Angle_degrees)) + Equipment_Spacing
Standard inclination: 15° for bulk materials
Belt width sized at 80% capacity for peak loads
```

**Mass Balance:**
```
EFB: 100t @ 62.5% MC → via screw press → output @ 47.5% MC
OPDC: input @ 72.5% MC → via screw press → output @ 61% MC
POS: input @ 82% MC → via decanter → output @ 65% MC
```

**CAPEX Scaling:**
```
Scaled_CAPEX = Base_CAPEX × (New_Capacity / Base_Capacity)^0.7
Base: $2.8M @ 60 TPH
Exponent: 0.7 (standard chemical engineering scale factor)
```

**OPEX Formula:**
```
Total_OPEX = Labour + Electricity + Maintenance + Other
OPEX/tonne = $18/t (Labour $8 + Electricity $6 + Maintenance $3 + Consumables $1)
```

**Electricity Cost:**
```
Monthly_kWh = Total_kW × Operating_Hours_per_Day × Operating_Days_per_Month × Load_Factor
Cost = kWh × PLN_Tariff (IDR 1,444.70/kWh) / USD_IDR_Rate (15,800)
= kWh × $0.091437/kWh
Operating: 330 days/year
```

**Neutralisation Logic:**
```
OPDC pH correction: pH 4.8 → 8.0-9.0
Method: CaCO₃ (limestone) manual dosing
Dwell time: ≥ 24 hours in neutralisation bay
Monitoring: pH check every 8 hours
Loader turning: T+8-12h and T+16-20h per bay
```

**9 Hard Guardrails:**
1. MC ≥ 40% LOCKED (CLASS A) — all screw presses
2. Fe < 3,000 mg/kg DM — POS sludge pit (ICP-OES gate)
3. ADL < 12% DM — for BSF feed acceptability
4. C:N 15–22 optimal — microbial balance for S2/S3
5. pH 8.0–9.0 — OPDC buffer bin post-24hr dwell
6. No Cr > 20 mg/kg — chromium contamination gate
7. CEC > 20 cmol/kg — soil amendment quality target
8. Belt speed locked at spec — no operator override
9. All temps < 85°C — prevent organic matter decomposition

### STEP 4: Build COMPLETE CAPEX Excel

Create `engineering-final/CFI_COMPLETE_CAPEX_OPEX.xlsx` using openpyxl (Python).

**Tab 1: Equipment CAPEX (from cfi_equipment_capex_epc — 18 items)**

Query: `SELECT tag, line, stage, equipment_name, description, qty, unit_cost_usd, total_cost_usd, rfq_required, rfq_range_low_usd, rfq_range_high_usd, indonesian_supplier, contact FROM cfi_equipment_capex_epc ORDER BY line, tag`

Known totals:
- EFB Stage 1: 10 items
- OPDC Stage 1: 5 items  
- Shared: 2 items
- Shared/S2: 1 item

**Tab 2: Building CAPEX (from cfi_building_capex — 41 items)**

Query: `SELECT pkg, item_description, unit, qty, western_rate_usd, indo_rate_usd, western_total_usd, indo_total_usd, saving_usd, premium_pct, flag, indo_market_note FROM cfi_building_capex ORDER BY pkg, id`

Summary by package:
| Pkg | Items | Indo Total | Western Total |
|-----|-------|-----------|---------------|
| A1 Site Works | 8 | $79,540 | $159,750 |
| A2 Civil/Concrete | 12 | $105,900 | $191,780 |
| A3 Structural Steel | 16 | $336,790 | $545,376 |
| A4 Welfare | 1 | $107,650 | $107,650 |
| A5 MEP Power | 1 | $140,000 | $169,825 |
| A6 HVAC | 1 | $28,000 | $34,040 |
| A7 Plumbing | 1 | $42,000 | $56,740 |
| A8 Process Items | 1 | $44,000 | $54,660 |
| **Base Total** | 41 | **$883,880** | **$1,319,821** |
| + 8% Contingency | | $70,710 | |
| + 20% EPC Overheads | | $190,918 | |
| + 20% Developer Markup | | $229,102 | |
| **Building CAPEX Total** | | **$1,374,610** | |

**Tab 3: CAPEX Summary**

| Category | Amount |
|----------|--------|
| S1 Equipment CAPEX | $233,000 |
| Shared Equipment | $176,000 |
| POS Decanter (RFQ) | $80,000–$150,000 |
| Building CAPEX (Indo) | $1,374,610 |
| **Total S1 CAPEX** | **$1,773,610–$1,853,610** |

**Tab 4: Labour OPEX (from cfi_s1_opex_labour — 5 roles)**

Query: `SELECT role_code, role_title, headcount, machines_operated, skill_level, estimated_idr, estimated_usd, shift_pattern, notes FROM cfi_s1_opex_labour ORDER BY id`

| Role | Headcount | USD/month |
|------|-----------|-----------|
| OP-EFB EFB Operator | 2 | $474.68 ea |
| OP-OPDC OPDC Operator | 2 | $474.68 ea |
| MAINT Maintenance Tech | 1 | $569.62 |
| QC-GATE Quality Checker | 1 | $411.39 |
| SUPVSR Shift Supervisor | 1 | $696.20 |
| **Total** | **7** | **$3,576/mo** |

**Tab 5: Electricity OPEX (from cfi_electricity_opex — S1 stages)**

Query: `SELECT stage_code, stage_name, kwh_per_month, cost_usd_per_month, cost_usd_per_year, notes, data_status FROM cfi_electricity_opex WHERE stage_code LIKE 'S1%' OR stage_code IN ('S2A','S2B','SU','MEP') ORDER BY id`

| Stage | kWh/month | USD/month | USD/year |
|-------|-----------|-----------|----------|
| S1C EFB | 155,199 | $14,191 | $170,291 |
| S1B OPDC | 72,742 | $6,651 | $79,815 |
| S1A POS | 19,747 | $1,806 | $21,667 |
| S2A EFB Chemical | 99,178 | $9,069 | $108,822 |
| S2B OPDC Chemical | 34,188 | $3,126 | $37,512 |
| Shared Utilities | 436 | $40 | $478 |
| MEP Building | 23,813 | $2,177 | $26,128 |
| **Total** | **405,303** | **$37,060** | **$444,713** |

**Tab 6: Maintenance OPEX (from cfi_s1_opex_maintenance — 10 items)**

Query: `SELECT category, item_code, description, basis, annual_usd_low, annual_usd_mid, annual_usd_high, frequency, notes FROM cfi_s1_opex_maintenance ORDER BY id`

**Tab 7: Other OPEX (from cfi_s1_opex_other — 10 items)**

Query: `SELECT category, item_code, description, usd_per_month, usd_per_year, basis, is_data_gap, notes FROM cfi_s1_opex_other ORDER BY id`

**Tab 8: OPEX Summary**

| Category | Monthly | Annual |
|----------|---------|--------|
| Labour (7 headcount) | $3,576 | $42,912 |
| Electricity (all stages) | $37,060 | $444,713 |
| Maintenance (mid) | $1,905 | $22,865 |
| Admin | $833 | $10,000 |
| Other utilities | $500 | $6,000 |
| Depreciation (non-cash) | $8,503 | $102,016 |
| **Total OPEX** | **$52,377** | **$628,506** |
| Data gaps: Land, Insurance, Working Capital | TBD | TBD |

**Tab 9: Data Gaps**

List all items with is_data_gap=true plus:
- Greenhouse construction costs (6 structures have specs, no costs)
- S2 mixer/belt press equipment CAPEX (know power/count, no cost)
- ROI / IRR / Payback (no revenue model linked)

### STEP 5: Styling for the Excel

- Header rows: dark navy (#060C14) with teal (#40D7C5) text
- Currency cells: formatted as USD with comma separator
- Data gap cells: amber (#F5A623) background
- Totals: bold with teal border
- Each tab should have a frozen header row
- Column widths auto-fitted

### STEP 6: Commit and push

1. Add all files in `engineering-final/` to git
2. Commit with message: "feat: engineering final deliverable — 20 HTML drawings + MD docs + CAPEX/OPEX Excel"
3. Push to branch `claude/consolidate-cfi-stages-Afy11` in sharone2012/happy-react-bundle

### STEP 7: Upload new HTML files to Supabase

Upload the 7 new HTML files to the `html_screenshots` table in Supabase project lcpbtnipkvrmuwllymfw using the execute_sql MCP tool. Use dollar-quoting ($html$...$html$) for the content column.

Files: CFI_S1_SITE_MASTER_PLAN.html, CFI_S1_TRUCK_RECEIVING.html, CFI_S1_CONVEYOR_ROUTES.html, CFI_S1_NEUTRALISATION_BAYS.html, CFI_S2_MIXING_AREA.html, CFI_S1_GREENHOUSE_DETAIL.html, CFI_S1_CONVEYOR_GALLERY.html

Gallery URL pattern: https://lcpbtnipkvrmuwllymfw.supabase.co/functions/v1/serve-html?file=FILENAME

---
