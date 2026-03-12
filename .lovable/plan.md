

## Changes to Sections A, B, and C (src/App.jsx)

### 1. Increase "Daily Operating Hours" font size
Line 2348: Change `fontSize: 10` → `fontSize: 13` to match "FRESH FRUIT BUNCH" label.

### 2. Add 10% padding on each side of number input fields (60 and 80)
Lines 2340 and 2352: Change `width: 44` → `width: 52` and add `padding: "6px 4px"` to give ~10% more space on each side of the numbers.

### 3. Stretch Section C to match A+B width
Line 2372: Add `flex: 1` to the C Card so it fills the remaining horizontal space, aligning its right edge with B's right edge. The parent flex row (line 2324) already has `flex: 1`, so C just needs to participate equally.

### 4. Increase gap between EFB row and OPDC row in Section C
Line 2380: Change `marginTop: 10` → `marginTop: 16` (or more) so the OPDC row's bottom aligns with the EFB Monthly Production box in Section B. This may need fine-tuning — I'll start with `marginTop: 20` to push the second row down.

