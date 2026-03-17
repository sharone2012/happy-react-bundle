

## Apply Tab Bar Visibility Fixes

Three targeted edits to `src/App.jsx` to make S4/S5/S6 tabs visible:

### Edit 1 — Add `flexWrap:"wrap"` to tab bar container (line ~2309)
Add `flexWrap:"wrap"` to the flex container so all 11 tabs remain visible when they exceed viewport width.

### Edit 2 — Reduce tab padding (line ~124)
Change `padding:"8px 18px"` to `padding:"8px 12px"` in the `S.tab` style function to help tabs fit on one row.

### Edit 3 — Add `overflowX:"auto"` as fallback (line ~2309)
Add horizontal scroll fallback for very narrow viewports alongside the flexWrap.

All edits are in `src/App.jsx` only.

