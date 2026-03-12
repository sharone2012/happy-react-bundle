
Goal: Restructure the UI so Section D contains only residue selection inputs, and move all non-residue content into a new field placed directly under Section A.

Scope confirmed:
- Keep D as “residues only”
- New moved field location: directly under A card (left column area)

Implementation plan (src/App.jsx):

1) Split the current combined right-side “D — Choose Blend” card into two logical blocks
- Keep in the current D card only:
  - Header + red rule text (“% must total 100%”)
  - Residue rows: EFB, OPDC, POME Sludge, PKE
- Remove from that card:
  - POME auto-fill status banner
  - 100% total warning line
  - Blend metrics (moisture, DM content, C:N, CP, % of total substrate DM, monthly totals)

2) Create a new card under Section A (left column) for moved blend-analysis content
- Place this new card directly beneath “A — Enter Details Below”
- Move into it all content removed in step 1:
  - POME auto-fill status block
  - Blend total warning
  - CalcField metrics and composition summary blocks
- Keep existing formulas/variables unchanged so behavior remains identical

3) Layout refactor for A column to support stacked cards cleanly
- Convert the A area from single Card to a vertical stack container:
  - First card = existing A inputs
  - Second card = new moved blend-analysis field
- Preserve A width and current visual style (black inner panel + grey outer card border/radius language)
- Maintain consistent spacing between A and the new field (matching existing section rhythm)

4) Keep existing right-side flow stable
- Ensure B and C stay in their current row/size behavior
- Ensure D (residues-only) remains in right column below “Daily Dry Matter Available at Mill”
- Do not alter blend calculation logic, only where outputs are rendered

Technical details:
- File: src/App.jsx
- Main edits:
  - Reorganize JSX structure around the “A & B side by side” region and the right-column D area
  - Move existing JSX fragments instead of rewriting logic to avoid regression
  - Keep state hooks and computed values untouched (s0.*, pomeActive, pomePct, pomeSupplyOK, blendMC, blendCN, blendCP, s1_blendWet, s1_blendDM, etc.)
- Styling consistency:
  - Reuse current inline style tokens and helpers (Card, SectionHdr, Warn, CalcField, Divider, color map C, grids g2/g3)
  - Maintain responsive behavior at current viewport by preserving existing parent grid/flex patterns

Validation checklist after implementation:
- D card shows only residue inputs (and the 100% rule text)
- No metrics/status blocks appear in D
- New field appears under A and contains all moved blend-analysis outputs
- Values, warnings, and percentages still update correctly when changing EFB/OPDC captures and residue toggles
- Overall alignment and spacing remain visually balanced