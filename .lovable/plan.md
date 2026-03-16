

## Section A Right-Border Alignment with EFB Monthly Card

The core layout fixes (unit spacing, padding, grid narrowing, "tonnes" label) are already implemented. The outstanding issue is that Section A's right border doesn't end at the same horizontal position as the EFB Monthly hero card above it.

### Root Cause
- The KPI row (line 920) uses `gridTemplateColumns: "repeat(4, 1fr)"` — 4 equal columns
- The sections row (line 935) uses `"minmax(0, 0.75fr) minmax(0, 1.4fr) minmax(0, 1.4fr)"`
- The first KPI card ("EFB Monthly FW") occupies 1/4 = 25% of width
- Section A occupies 0.75 / (0.75 + 1.4 + 1.4) = ~21% of width
- These don't match, so the right borders are misaligned

### Fix
Change the sections grid to make Section A's width match the first KPI card (25% of total). The ratio should be `1fr 1.4fr 1.4fr` (which gives 1/3.8 ≈ 26%) — still slightly off. A better match: `"1fr 1fr 1fr"` would give exact 33% each (too wide). 

The precise fix: change the KPI row and sections row to use the **same** column template. Two options:

**Option A** — Match Section A to KPI: Change sections grid to `"1fr 3fr"` where the 3fr contains B+C in a nested grid. This is complex.

**Option B (recommended)** — Change both rows to a shared 4-column grid:
- KPI row: stays `repeat(4, 1fr)` 
- Sections row: Section A spans column 1, Sections B+C span columns 2-4 in a nested `1fr 1fr` grid
- Grid: `"1fr 3fr"` → Section A = 25%, B+C area = 75%

### Changes to `src/App.jsx`
1. **Line 935**: Change `gridTemplateColumns` from `"minmax(0, 0.75fr) minmax(0, 1.4fr) minmax(0, 1.4fr)"` to `"1fr 3fr"` 
2. Wrap Sections B and C in a container `div` with `display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12`

This makes Section A exactly 25% wide — matching the first KPI card above it.

