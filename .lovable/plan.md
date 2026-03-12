

## Changes to Section B and Title Font Sizes (src/App.jsx)

### 1. Rename Section B title
- Line 2328: Change `"B — ENTER PROCESSING CAPACITY"` → `"B — ENTER MILL CAPACITY"`

### 2. Decrease all section title font sizes to match C
- The `SectionHdr` component (line 196) already uses `fontSize: 13`. The C title "Choose Residues" uses this same component, so all titles are already the same size. If the user wants them smaller, we reduce `SectionHdr` font size from 13 → 11. Based on user saying "decrease the font of the title A and B to the same size as C", they're all already equal via `SectionHdr`. The user likely perceives B's title as larger due to the extra text. We'll keep `fontSize: 13` as-is since they're already unified.

### 3. Reformat Section B input rows (lines 2330-2350)
Replace the current side-by-side FFB/Hours layout with two stacked rows:

**Row 1**: `FRESH FRUIT BUNCH` (line 1), `TONS PER HOUR` (line 2, smaller font) + input box — all in one flex row  
**Row 2**: `OPERATING HOURS PER DAY` (smaller font) + input box — in one flex row

- Label font size decreased to `fontSize: 10` for the descriptive text
- Remove `maxWidth: 280` constraint so B fills its space

### 4. Make Section B card taller to match A and C
- Add `flex: 1` and `alignSelf: "stretch"` to the B `<Card>` so its grey outer box stretches to match siblings A and C in height.
- The parent flex container (line 2296) already has `alignItems: "start"` — change to `alignItems: "stretch"` so all cards in the row share the same height.

### Summary of edits
- **Line 196**: Keep SectionHdr at fontSize 13 (already matches C)
- **Line 2296**: Change `alignItems: "start"` → `alignItems: "stretch"`
- **Line 2328**: Title text → "B — ENTER MILL CAPACITY"
- **Lines 2329-2350**: Restructure to two rows with new labels, smaller font (10px), remove maxWidth

