

## Shrink Section A + Title Case for All Section Headers

### Changes (src/App.jsx)

**1. Shrink Section A width** (line 2299)
- Change `flex: 1` → `flex: 0.8` on Section A's Card

**2. Convert all SectionHdr titles to Title Case** (first letter of each word capitalized, rest lowercase):

| Line | Current | New |
|------|---------|-----|
| 2301 | `A — ENTER DETAILS BELOW` | `A — Enter Details Below` |
| 2328 | `B — ENTER MILL CAPACITY` | `B — Enter Mill Capacity` |
| 2374 | `C — Choose Residues` | Already correct |
| 2393 | `D — Captured % of Mill Processing Capacity Used` | Already correct |
| 2410 | `E — Carbon Credits Preview` | Already correct |
| 2433 | `D — Daily Dry Matter Available at Mill` | Already correct |
| 2570 | `E — Soil Type & Fertiliser Requirements` | Already correct |
| 2616 | `F — POME Sludge (Third Waste Stream)` | `F — Pome Sludge (Third Waste Stream)` |
| 2695 | `G — PKE Palm Kernel Expeller (Protein Booster — Optional)` | `G — Pke Palm Kernel Expeller (Protein Booster — Optional)` |
| 2779 | `H — Combined Multi-Stream Daily NPK Summary` | Already correct |
| 500 | `I — BLEND OPTIMISER — REVERSE SOLVER` | `I — Blend Optimiser — Reverse Solver` |

Note: POME and PKE are acronyms — I'll keep them uppercase if preferred. Let me know.

