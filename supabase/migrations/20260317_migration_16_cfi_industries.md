# Migration 16 — Industry Interchangeability Infrastructure

**Date:** March 17 2026  
**Applied via:** Supabase MCP (verified — 3 migrations confirmed in supabase_migrations table)  
**Status:** LIVE in Supabase `lcpbtnipkvrmuwllymfw`

## What This Migration Does

Makes the CFI platform industry-agnostic at the data layer.  
Palm Oil = `industry_id = 1` (LIVE). All other industries are placeholder rows.  
Zero impact on existing data — all existing rows default to `industry_id = 1`.

## Tables Created

### `cfi_industries`
Master industry/crop configuration table. 7 industries seeded:

| industry_id | industry_name | is_live |
|-------------|---------------|---------|
| 1 | Palm Oil | ✅ LIVE |
| 2 | Sugarcane | Placeholder |
| 3 | Rice | Placeholder |
| 4 | Cassava | Placeholder |
| 5 | Coffee | Placeholder |
| 6 | Coconut | Placeholder |
| 7 | Banana | Placeholder |

### `cfi_feedstreams`
Feedstream definitions per industry. Palm Oil streams:

| stream_code | stream_label | mc_default | mc_floor | zero_cost |
|-------------|-------------|-----------|---------|----------|
| EFB | Empty Fruit Bunches | 62.5% | — | ✅ |
| OPDC | Oil Palm Decanter Cake | 70.0% | 40% | ✅ |
| POS | Palm Oil Sludge | 82.0% | — | ✅ |
| OPF | Oil Palm Fronds | 75.0% | — | ✅ |
| OPT | Oil Palm Trunk | 75.0% | — | ✅ |
| POME | Palm Oil Mill Effluent | 97.0% | — | ✅ |
| PKE | Palm Kernel Expeller | 12.0% | — | ❌ Purchased |

## Columns Added to Existing Tables

`industry_id INT DEFAULT 1` added to:
- `canonical_lab_data`
- `cfi_soil_profiles`
- `chemical_library`
- `biological_library`
- `equipment_catalogue`

## Supabase Migration Versions Applied

```
20260317105352  migration_16_cfi_industries
20260317105415  migration_16_cfi_feedstreams
20260317105427  migration_16_industry_id_columns
```

## Next Steps

- **Item 17:** Agent 8 skeleton (Industry Expansion Agent) — fires when `is_live` set to `true` for any placeholder industry
- **Item 18:** Industry switcher UI visible to The Professor (science comparison across crops)

Both blocked until Migration 16 confirmed live (it is).

## SQL Reference

```sql
-- Verify industries
SELECT industry_id, industry_name, is_live FROM cfi_industries ORDER BY industry_id;

-- Verify palm feedstreams
SELECT stream_code, stream_label, mc_default, mc_floor, zero_cost
FROM cfi_feedstreams WHERE industry_id = 1 ORDER BY sort_order;

-- Verify industry_id column exists on all 5 tables
SELECT table_name, column_name, column_default
FROM information_schema.columns
WHERE column_name = 'industry_id' AND table_schema = 'public'
ORDER BY table_name;
```

