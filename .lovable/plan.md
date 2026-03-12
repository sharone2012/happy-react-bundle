

## Section B — Processing Capacity: Alignment & Visual Hierarchy Fix

### Problem
The Section B card ("B — ENTER PROCESSING CAPACITY") has its content (FFB/Hours row and EFB Monthly Production bar) stretching to fill the full card width (`flex: 1`), but you want everything constrained to the width defined by the header text "B — ENTER PROCESSING CAPACITY" — and all content justified within that width.

### Plan

**1. Measure-based width constraint**
- The SectionHdr renders "B — ENTER PROCESSING CAPACITY" which is roughly ~280–300px wide at fontSize 13.
- Set `maxWidth` on the Card or an inner wrapper so the content area matches the header text width. We'll use `fit-content` on the header and then constrain all child rows to that same max.

**2. Approach: Wrap all Section B content in a constrained container**
- Keep the Card at `flex: 1` for the A/B side-by-side layout.
- Inside the Card, after the SectionHdr, wrap the FFB/Hours row and EFB bar in a `div` with `maxWidth: 280` (matching approximate header text width) and `width: "100%"`.
- This forces both rows to be the same width as the header text area, and they'll be left-aligned within the card.

**3. Tighten inner layout**
- FFB/Hours row: Keep the 50/50 split with `flex: "1 1 0"` but within the constrained width.
- EFB Monthly Production bar: Same 50/50 split, same constrained width — auto-aligns.
- Both rows will now start and end at the same points, justified to the header width.

**4. Files to edit**
- `src/App.jsx` lines ~2327–2360: Add an inner wrapper `div` with `maxWidth` around the two content rows inside Section B's Card.

