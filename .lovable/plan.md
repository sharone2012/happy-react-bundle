

# S0 Design System Overhaul

Applying the 8 rules from the uploaded design spec to restructure the entire S0 stage layout and styling.

## Overview

This is a comprehensive visual overhaul of the S0 stage — new card structure, row-based grid layout, sentence case typography, and consistent color system. No logic changes, only how things are rendered.

## Changes (all in `src/App.jsx`)

### 1. New `SectionCard` component
Replace the current `Card` + inner black div pattern with a single reusable component matching Rule 1:
- **Outer**: `#162E45` background, `1px solid teal at 20%`, `border-radius: 10px`
- **Title bar**: Inside grey frame, `padding: 12px 16px`, teal title `13px/800`, `white-space: nowrap`, no black background
- **Input area**: `#070F1A` black rectangle, `margin: 0 12px`, `border-radius: 8px`, `padding: 14px 16px`
- **Results area**: Below black area, still in grey frame, `padding: 10px 16px 14px`, amber values `#F5A623` weight 700, large totals weight 900 size 16px, sub-labels grey `#8BA0B4` size 10px

### 2. Row-based grid layout (Rule 2)
Replace current flex layout with 6 explicit grid rows:
- **Row 1**: `1fr 2fr` → A (site identity) | B (mill capacity + D capture %)
- **Row 2**: `1fr 1fr` → C (choose residues) | D (blend analysis — active streams only)
- **Row 3**: `1fr 1fr` → E (soil type) | AG management tier
- **Row 4**: `1fr` → F (POS)
- **Row 5**: `1fr` → G (PKM optional)
- **Row 6**: `1fr` → H (Combined NPK summary)

This means splitting current combined sections (e.g., Soil + AG into separate cards for E and AG) and reorganizing D content.

### 3. Sentence case everywhere (Rule 3)
- Section titles: `"A — Enter your site details below"` not `"A — Enter Details Below"`
- Field labels: `"Fresh fruit bunches"` not `"FRESH FRUIT BUNCH"`
- Remove all `textTransform: "uppercase"` from labels, headers, sub-labels
- Keep abbreviations uppercase: EFB, OPDC, POS, PMF, PKM, POME, FFB, TPH, DM, NPK

### 4. Input field styling (Rule 4)
Update all editable inputs: `background: #142030`, `border: 1px solid teal at 40%`, `border-radius: 6px`, `color: white`. Must sit inside black input area only.

### 5. Calculated outputs styling (Rule 5)
- Never black background behind results — results sit in grey frame results area
- Result values = amber `#F5A623`
- Large totals = amber, larger font
- Secondary results = teal `#00C9B1`
- Sub-text/units = grey `#8BA0B4`, `9-10px`

### 6. Residue cards in Section C (Rule 6)
Reformat to `3×2` grid (`gridTemplateColumns: "1fr 1fr 1fr"`):
- Active: teal bg tint `#00C9B118`, teal border, teal label, filled teal dot
- Inactive: dark bg, grey border, grey text, hollow dot
- POME = locked/greyed out, sub-label "Liquid — sent to pond"
- Sub-labels: grey, `9px`, sentence case

### 7. Section B specifics (Rule 8)
- 4 inputs (FFB processing, utilisation %, operating hours, operating days) in 2×2 grid inside black input area
- EFB monthly production in results area (grey frame): label "EFB monthly production" sentence case, value amber `#F5A623` weight 900 size 18px, sub-label "Fresh weight" grey 10px

### 8. Global style token updates
- Update `S.label` — remove `textTransform: "uppercase"`
- Update `S.card`, `S.hdr`, `S.input` to match new specs
- Update `CalcField`, `SectionHdr`, `Lbl`, `KPI` components for sentence case and new color rules
- Page container outer padding: `20px 24px`

### Scope
- File: `src/App.jsx` only
- All calculation logic untouched
- State variables untouched
- Only JSX structure, styling, and component wrappers change

