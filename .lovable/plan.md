

## Enhance Box B — Visual flow + formula breakdown (no size change)

### Changes to `src/App.jsx` (lines 2326–2369)

#### 1. Add subtle visual separator between inputs and output
Insert a small downward arrow/divider between the two input rows and the EFB Monthly Production output box (~line 2357). Use a centered `▼` character in teal at ~10px with some margin, acting as a visual "inputs flow to output" indicator.

#### 2. Show formula breakdown below the output
Below the EFB Monthly Production box (after line 2366), add a small formula line in muted teal text showing:
```
60 t/hr × 80 hrs/day × 26 days = 124,800 t
```
Using actual values from `s0.ffbCapacity`, `s0.utilisation`, and the working days constant. Font size ~9px, centered, opacity 0.6 — subtle but verifiable.

#### 3. Make output box slightly more prominent
Change the EFB Monthly Production output number font size from `18` → `20` and add a subtle amber glow/border (`border: 1px solid ${C.amber}55`) to distinguish it more clearly from the input rows.

All changes stay within the existing Card dimensions — no flex/width modifications.

