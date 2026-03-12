

## Plan: Restyle "Choose Blend" section + tighten layout

### Changes to `src/App.jsx`

**1. Rename blend header to "D — Choose Blend" + red subtitle (lines 2467-2469)**
- Change title to use `SectionHdr` with `title="D — Choose Blend"` and `color={C.teal}`
- Add red text below: `<div style={{ color: C.red, fontSize: 10, fontWeight: 700 }}>% must total 100%</div>`
- Remove the old inline header div

**2. Match residue label font sizes to Section C cards (lines 2473-2510)**
- **EFB**: font size `13`, fontWeight `900` (matching ResidueCard abbr style) in amber
- **OPDC, POME Sludge, PKE**: font size `13`, fontWeight `900`, color `C.teal` (matching POS turquoise style)
- Left-justify all labels (`textAlign: "left"`, `alignItems: "flex-start"`)

**3. Tighten input boxes to match B's "60" input width (lines 2475-2509)**
- Change input/display box `width` from `"100%"` to `52` (same as B's FFB input at line 2340)
- Keep inputs left-aligned alongside their labels (horizontal row layout instead of stacked column)

This restructures each blend row as: `[LABEL left-justified] ... [small 52px input box]` — matching the visual rhythm of Section B's rows.

