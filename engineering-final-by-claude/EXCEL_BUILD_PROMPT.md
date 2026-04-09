# CFI MASTER CAPEX/OPEX EXCEL — BUILD PROMPT

Paste this into a new Claude Code session.

---

## TASK: Build complete CFI CAPEX/OPEX Excel extending existing workbook

**Supabase Project ID:** lcpbtnipkvrmuwllymfw
**Repo:** sharone2012/happy-react-bundle (branch: claude/consolidate-cfi-stages-Afy11)
**Existing file:** /home/user/CFI/CFI_MASTER_MODEL_COMPLETE.xlsx (21 tabs — preserve ALL existing data)
**Output:** engineering-final-by-claude/CFI_MASTER_CAPEX_OPEX_v5.xlsx

---

## CRITICAL RULES — DO NOT OVERRIDE

1. **Preserve ALL existing tabs and data** in CFI_MASTER_MODEL_COMPLETE.xlsx
2. **PKSA (Palm Kernel Shell Ash) is FREE** — zero cost, it's a waste product from the mill
3. **Organisms use the 5-ORG ONE-SHOT MIX at $0.65/t FW** (NOT the old 9-org at $29K/mo)
4. **Chemical pathways 1A-1F** — keep exactly as-is
5. **Biological pathways 2A-2F** — keep exactly as-is
6. **5 Scenarios** — keep exactly as-is
7. All Indonesian rates (not Western) for building CAPEX

---

## THE 5-ORGANISM ONE-SHOT MIX (replaces all old inoculant costs)

ALL 5 organisms added at same time — ONE inoculation event only.

| # | Organism | Primary Function | Secondary Function | $/kg | Dose %DM | $/t FW | Gas Control |
|---|----------|-----------------|-------------------|------|----------|--------|-------------|
| 1 | Lactobacillus EM-4 | pH buffer (→5.5-6.0) | Pathogen suppression | $0.17 | 0.08% | $0.05 | CH4 ↓70-80% |
| 2 | Saccharomyces cerevisiae | NH3 retention (50%) | Sugar fermentation | $0.30 | 0.10% | $0.11 | NH3 ↓50%, CO2 shift |
| 3 | Bacillus subtilis | Cellulase production | Protease, lipase | $0.20 | 0.03% | $0.02 | Aerobic (anti-CH4) |
| 4 | Azotobacter vinelandii | N-fixation (+5 kg N/t) | BSF protein source | $0.40 | 0.10% | $0.05 | — |
| 5 | Trichoderma harzianum | GANODERMA BIOCONTROL | Cellulase production | $1.50 | 0.08% | $0.42 | — |
| **TOTAL** | | | | | | **$0.65/t FW** | **CH4↓70%, NH3↓50%** |

At 8,157 t FW/month: **$5,302/month** inoculant cost (NOT $29,039)

---

## TABS TO ADD/POPULATE (keep all existing 21 tabs intact)

### NEW TAB: S1_EQUIPMENT_CAPEX
Pull from Supabase `cfi_equipment_capex_epc` (18 items):
```sql
SELECT tag, line, stage, equipment_name, description, qty, unit_cost_usd, total_cost_usd,
       rfq_required, rfq_range_low_usd, rfq_range_high_usd, indonesian_supplier, contact
FROM cfi_equipment_capex_epc ORDER BY line, stage, tag;
```
Summary: EFB $184K, OPDC $38K + POS RFQ $80-150K, Shared $176K = **$398K + RFQ**

### NEW TAB: S1_BUILDING_CAPEX
Pull from Supabase `cfi_building_capex` (41 items):
```sql
SELECT pkg, item_description, unit, qty, indo_rate_usd, indo_total_usd,
       western_rate_usd, western_total_usd, saving_usd, flag, indo_market_note
FROM cfi_building_capex ORDER BY pkg, id;
```
Packages A1-A8 base: $883,880 + 8% contingency + 20% EPC + 20% dev = **$1,374,610**

### NEW TAB: S3_BIOLOGICAL_CAPEX
Pull from Supabase `s3_capex` (9 items):
```sql
SELECT item_code, description, category, quantity, unit_cost_usd, total_cost_usd,
       supplier_region, notes FROM s3_capex ORDER BY id;
```
Total: **$82,970**

### NEW TAB: GREENHOUSE_CAPEX_20K
From Sharon's greenhouse Excel (scaled from 2,000 m² to 20,000 m²):

| # | Category | 2,000 m² | 20,000 m² |
|---|----------|----------|-----------|
| 1 | Greenhouse Manufacturing (60 GH × 8m×40m) | $155,000 | $1,550,000 |
| 2 | Site Prep & Concrete | $89,000 | $712,000 |
| 3 | Equipment/Machinery (dump truck, shredders) | $42,100 | $210,500 |
| 4 | Smart Sensors (CO₂, methane, temp, humidity + Rotterdam shipping) | $19,845 | $198,450 |
| 5 | Electrical Automation (vent motors, panels, wiring) | $14,916 | $149,160 |
| 6 | Cloud Storage | $1,500 | $1,500 |
| 7 | IoT Connectivity (Advantech gateways, Modbus, Belden cable) | $14,926 | $149,260 |
| 8 | Management Software | $20,000 | $30,000 |
| 9 | Reporting Software (EU CSRD/ESRS) | $10,000 | $10,000 |
| | Sub-Total | $323,377 | $3,010,870 |
| | + 10% Local EPC | $32,338 | $301,087 |
| | + 5% PM Travel | $17,786 | $150,544 |
| | **TOTAL** | **$373,500** | **$3,462,501** |

Notes: Excludes BSF mating facility (8m×10m tin structure), warehousing, office.

### POPULATE EXISTING TAB: 3B_GREENHOUSE_SPEC
From Supabase `cfi_greenhouse_design` (6 structures):
- GH-1 through GH-4: 40m × 8m × 2.5m, arched tunnel, MS 42mm×2mm poles
- Store: 11m × 5m × 3m, brick walls, corrugated iron
- Shredder Shade: 6m × 9m × 3m, open 2 sides

### POPULATE EXISTING TAB: 1A_OPEX_REFERENCE
Fill rates from live data:
- Electricity: $0.0914/kWh (PLN tariff IDR 1,444.70 / 15,800 IDR/USD)
- Machine Operators: $475/month (Bogor 2026 skilled rate)
- Greenhouse Operators: $350/month (UMR West Java + 20%)
- Lab Analysis: per QC gate checker $411/month

### NEW TAB: LABOUR_ALL_STAGES
Complete headcount from Supabase:

| Stage | Role | FTE | USD/mo | Source |
|-------|------|-----|--------|--------|
| S1 | EFB Line Operator | 2 | $949 | cfi_s1_opex_labour |
| S1 | OPDC Line Operator | 2 | $949 | cfi_s1_opex_labour |
| S1 | Maintenance Technician | 1 | $570 | cfi_s1_opex_labour |
| S1 | Quality & Gate Checker | 1 | $411 | cfi_s1_opex_labour |
| S1 | Shift Supervisor | 1 | $696 | cfi_s1_opex_labour |
| S3 | Inoculation Operators | 2 | $700 | s3_opex_monthly |
| S3 | QC Technician (0.5 shared) | 0.5 | $350 | s3_opex_monthly |
| S4 | BSF Rearing Operators | 3 | $1,050 | s3_opex_monthly |
| S4 | BSF Colony Technician | 1 | $500 | s3_opex_monthly |
| S5 | Dryer/Granulator Operators | 2 | $700 | s3_opex_monthly |
| S5 | QC / Product Sampling | 0.5 | $175 | s3_opex_monthly |
| S6 | Processing Operators | 2 | $800 | s3_opex_monthly |
| S6 | QC / Food Safety Tech | 0.5 | $200 | s3_opex_monthly |
| **TOTAL** | | **18.5** | **$8,051/mo** | |

### NEW TAB: ELECTRICITY_ALL_STAGES
From Supabase `cfi_electricity_opex` (11 stages):

| Stage | kWh/mo | USD/mo | USD/yr | Status |
|-------|--------|--------|--------|--------|
| S1C EFB | 155,199 | $14,191 | $170,291 | CONFIRMED |
| S1B OPDC | 72,742 | $6,651 | $79,815 | CONFIRMED |
| S1A POS | 19,747 | $1,806 | $21,667 | CONFIRMED |
| S2A EFB Chemical | 99,178 | $9,069 | $108,822 | CONFIRMED |
| S2B OPDC Chemical | 34,188 | $3,126 | $37,512 | CONFIRMED |
| S3 Blending | 6,930 | $634 | $7,604 | CONFIRMED |
| Shared Utilities | 436 | $40 | $478 | CONFIRMED |
| MEP Building | 23,813 | $2,177 | $26,128 | CONFIRMED |
| S4 BSF Greenhouses | — | — | — | DATA GAP |
| S5 Frass Drying | — | — | — | DATA GAP |
| S6 BSF Processing | — | — | — | DATA GAP |

PLN tariff: IDR 1,444.70/kWh, USD/IDR: 15,800, USD/kWh: $0.091437

### NEW TAB: MAINTENANCE_OPEX
From Supabase `cfi_s1_opex_maintenance` (10 items):
Annual mid total: $22,765 ($1,897/mo)

### NEW TAB: OPEX_SUMMARY
Consolidated monthly OPEX using CORRECTED 5-org mix:

| Category | Monthly | Annual |
|----------|---------|--------|
| Labour (18.5 FTE all stages) | $8,051 | $96,612 |
| Electricity (S1+S2+S3+MEP+SU) | $37,693 | $452,316 |
| S4 Electricity | $1,099 | $13,188 |
| S5 Electricity | $4,702 | $56,424 |
| S6 Electricity | $3,089 | $37,068 |
| Inoculants (5-org @ $0.65/t FW) | **$5,302** | **$63,624** |
| S3 Consumables (molasses, pH, PPE) | $321 | $3,852 |
| S1 Maintenance | $1,897 | $22,765 |
| S1 Other (admin, transport) | $1,333 | $16,000 |
| Depreciation — Building (20yr) | $5,729 | $68,730 |
| Depreciation — Equipment (7yr) | $2,774 | $33,286 |
| **TOTAL OPEX** | **$71,990** | **$863,865** |
| Data gaps: Land lease, Insurance, Working capital | TBD | TBD |

### NEW TAB: CAPEX_SUMMARY
Grand total:

| Component | Amount | Status |
|-----------|--------|--------|
| S1 Building (Indo rates, with markups) | $1,374,610 | CONFIRMED |
| S1 Equipment (15 confirmed) | $222,000 | CONFIRMED |
| Shared Equipment (loaders + limestone) | $176,000 | CONFIRMED |
| POS Decanter (RFQ) | $80,000–$150,000 | RFQ PENDING |
| S3 Biological Equipment | $82,970 | CONFIRMED |
| Greenhouse 20,000 m² | $3,462,501 | FROM SHARON'S XLS |
| S2 Mixer/Press Equipment | TBD | DATA GAP |
| S4/S5/S6 Processing Equipment | TBD | DATA GAP |
| **CONFIRMED TOTAL** | **$5,398,081** | |
| **WITH RFQ** | **$5,478,081–$5,548,081** | |

### POPULATE EXISTING TAB: 10_COST_TRACKING_MASTER
Fill in cost cells for all 5 scenarios using the data above.

---

## EXCEL STYLING

- Header rows: dark navy (#060C14) background, teal (#40D7C5) text
- Currency: USD with comma separator, 2 decimal places
- Data gap cells: amber (#F5A623) background with "DATA GAP" text
- Totals: bold, teal (#40D7C5) top border
- Each new tab: frozen header row, auto-fit column widths
- Source column on every data row citing the Supabase table

## BUILD INSTRUCTIONS

1. Read existing `/home/user/CFI/CFI_MASTER_MODEL_COMPLETE.xlsx`
2. Add new tabs WITHOUT removing or modifying existing ones
3. Populate the empty existing tabs (3B_GREENHOUSE_SPEC, 1A_OPEX_REFERENCE, 10_COST_TRACKING_MASTER)
4. Pull live data from Supabase using execute_sql MCP tool (project lcpbtnipkvrmuwllymfw)
5. Save as `engineering-final-by-claude/CFI_MASTER_CAPEX_OPEX_v5.xlsx`
6. Commit and push to branch claude/consolidate-cfi-stages-Afy11

---
