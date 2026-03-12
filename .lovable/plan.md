

## Align Sections A, B, C on One Row with Consistent Font Size and Layout

### Problem
- Sections A, B, C don't look visually consistent — different font sizes and spacing.
- In Section B, "FFB" and "T/H" are stacked on two lines (same for "HOURS" / "/ DAY") — user wants each on a single row: "FFB T/H" and "HOURS / DAY".
- Font sizes in A and B don't match the ResidueCard abbreviation size in C (fontSize 13).

### Changes (src/App.jsx)

**1. Unify font sizes to 13px (matching C's ResidueCard abbr)**
- Section A header (line ~2302): Change `fontSize: 12` → `fontSize: 13`
- Section B header label sizes (lines ~2335, 2344): Change `fontSize: 12` → `fontSize: 13`

**2. FFB T/H on one line, HOURS / DAY on one line**
- Line ~2336: Change `<div>FFB</div><div>T/H</div>` → `FFB T/H` (single line)
- Line ~2345: Change `<div>HOURS</div><div>/ DAY</div>` → `HOURS / DAY` (single line)

**3. Ensure all three cards align consistently**
- Remove `maxWidth: 280` from Section A's Card (line ~2299) so all three cards share space equally via flex.
- Ensure B and C cards have consistent padding/border treatment matching A.

