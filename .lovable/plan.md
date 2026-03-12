

## Move Section C next to Section B

### Current Layout
- Row 1: A (side-by-side) B
- Row 2: D — Captured % (full width)
- Row 3: Two-column grid — Left: E (Carbon Credits) | Right: C (Choose Residues), then D (Daily DM), then Blend

### Target Layout
- Row 1: A (side-by-side) B + C stacked vertically
- Row 2: D — Captured % (full width)
- Row 3: Two-column grid — Left: E | Right: D (Daily DM), Blend...

### Changes (src/App.jsx)

1. **Move Section C (lines ~2404-2419)** out of the right column grid and into the A & B row (lines ~2296-2363), placing it right after Section B's `</Card>` so B and C sit side-by-side (or B+C share the right side of the A|B row).

2. **Restructure the A & B row**: Make it A on the left, then B and C stacked vertically on the right:
   ```
   <div style="display: flex; gap: 16; align-items: start">
     <Card> A </Card>
     <div style="display: flex; flex-direction: column; gap: 16; flex: 1">
       <Card> B </Card>
       <Card> C </Card>
     </div>
   </div>
   ```

3. **Remove Section C from the right column** (lines ~2404-2419) since it's been moved up.

