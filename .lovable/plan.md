

## Section A Layout Fixes

### Changes to `src/components/UnitInput.jsx`:
1. **Reduce unit padding** — Change `paddingLeft` from `6` to `3` (50% closer to number)
2. **Reduce unit width** — Change from `48px` to `28px` to tighten the gap and reduce right-side cushion

### Changes to `src/App.jsx`:

1. **Section A card width** — Change grid from `minmax(0, 1fr) minmax(0, 1.4fr) minmax(0, 1.4fr)` to something like `minmax(0, 0.75fr) minmax(0, 1.4fr) minmax(0, 1.4fr)` so Section A's right border aligns with the EFB Monthly hero card above it

2. **Monthly FFB unit** — Change `unit: "t/month"` to `unit: "tonnes"` on the Monthly FFB output row (line 960)

3. **Add right padding/cushion** — Reduce the `UnitInput` box padding from `"4px 8px"` to `"4px 4px 4px 8px"` to trim the right side while keeping a small cushion

These are minimal, targeted changes — UnitInput unit label moves 50% closer to the number, Section A narrows to align with EFB Monthly card, and the "t/month" label on 36,720 becomes "tonnes".

