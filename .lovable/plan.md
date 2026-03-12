

## Plan: Fix formula, remove arrow, align Section C

### Changes to `src/App.jsx`

**1. Fix formula to show 24hrs/day at 100% capacity (line 2370-2372)**
Replace the formula text with: `{s0.ffbCapacity} TPH × 0.225 × 24 hrs/day × {s0.daysMonth} days = {(s0.ffbCapacity * 0.225 * 24 * s0.daysMonth).toLocaleString()} t`
This shows the nameplate capacity calculation at full 24hr operation.

**2. Remove the arrow (line 2357-2358)**
Delete the `▼` divider element entirely.

**3. Align Section C black box to same height as A and B (line 2378-2379)**
The C `Card` currently has `marginBottom: 12` on its inner div (line 2379). Add `flex: 1, display: "flex", flexDirection: "column"` to the Card and `flex: 1` to the inner div, matching how B is structured, so the black box stretches to fill the same height as A and B.

