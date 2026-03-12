

## Fix Section B styling and font consistency

### Issues identified
1. **Section B lacks a black box wrapper** like Section C has (`background: "#000000"`, `borderRadius: 10`, `padding: 16`, `border: "1px solid rgba(255,255,255,0.1)"`)
2. **"FRESH WEIGHT" text** uses `fontSize: 9` vs "EFB MONTHLY PRODUCTION" at `fontSize: 11` — inconsistent sizes
3. **"FRESH WEIGHT"** uses `C.amber` color, same as "EFB MONTHLY PRODUCTION" — but user sees them as different (likely the `opacity: 0.85` on FRESH WEIGHT making it appear different)

### Changes (src/App.jsx)

**1. Add black box wrapper to Section B** (lines 2330-2363)
Wrap the content inside Section B's Card with a black box div matching Section C's style:
```jsx
<Card>
  <div style={{ background: "#000000", borderRadius: 10, padding: 16, marginBottom: 12, border: "1px solid rgba(255,255,255,0.1)" }}>
    <SectionHdr title="B — ENTER PROCESSING CAPACITY" color={C.teal} />
    {/* existing FFB/Hours and EFB Monthly content */}
  </div>
</Card>
```

**2. Fix "FRESH WEIGHT" font size** (line 2360)
Change `fontSize: 9` → `fontSize: 11` to match "EFB MONTHLY PRODUCTION"

**3. Fix "FRESH WEIGHT" opacity** (line 2360)
Remove `opacity: 0.85` so the amber color matches exactly

