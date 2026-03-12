

## Move Section C to Same Row as Section B

### Current Layout
Section B and C are stacked vertically (`flexDirection: "column"`) in a column to the right of Section A.

### Target Layout
Section B and C sit **side by side on the same row** — B ends where its content ends, then C follows horizontally.

### Changes (src/App.jsx)

**Line 2327**: Change the B+C wrapper from vertical stack to horizontal row:
```jsx
// FROM:
<div style={{ display: "flex", flexDirection: "column", gap: 16, flex: 1 }}>

// TO:
<div style={{ display: "flex", flexDirection: "row", gap: 16, flex: 1, alignItems: "start" }}>
```

This single change makes B and C sit side by side in the same row. Section B keeps its `maxWidth: 280` constraint, and Section C fills the remaining space.

