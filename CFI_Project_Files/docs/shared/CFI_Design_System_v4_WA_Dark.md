# CFI Design System v4 — WhatsApp Dark Mode

**March 2026 · Applies to ALL pages: S0, S1, S2, S3, S4, S5, S6, CAPEX, Summary**

This replaces v3. Based on WhatsApp dark mode background hierarchy with CFI brand accents preserved.

---

## 1. BACKGROUND HIERARCHY (WhatsApp Dark)

Five depth levels, darkest to lightest:

| Level | Name | Hex | WA Origin | CFI Use |
|-------|------|-----|-----------|---------|
| **D1** | Page background | `#0B141A` | R2 chat area | Full page bg, empty space |
| **D2** | Card background | `#111B21` | L6a chat row | Section cards, panels, nav cards |
| **D3** | Inner zone | `#1F2C34` | L2 header | Input areas, inner containers, icon boxes |
| **D4** | Header / bar | `#202C33` | R1 header | Global header, compose bars, breadcrumbs |
| **D5** | Hover / active | `#2A3942` | L7 hover | Hover states, focused inputs, selected items |

**v3 → v4 Migration:**

| v3 Token | v3 Hex | v4 Token | v4 Hex |
|----------|--------|----------|--------|
| navyDk (page bg) | `#070D16` | D1 | `#0B141A` |
| navyMid (cards) | `#153352` | D2 | `#111B21` |
| navyLt (inner) | `#1A3A5C` | D3 | `#1F2C34` |
| navy (header) | `#0B1422` | D4 | `#202C33` |
| — | — | D5 (new) | `#2A3942` |
| input black | `#070F1A` | D3 | `#1F2C34` |
| input field bg | `#142030` | D4 | `#202C33` |

---

## 2. BORDER

Single border token for the entire app:

```
border: 1px solid #1B282E
```

**Active / focused border:**
```
border: 1.5px solid #00A884
```

**v3 → v4:** Replace all `#1E6B8C` borders with `#1B282E`.
Replace all teal-opacity borders (`rgba(64,215,197,0.xx)`) with `#1B282E` default or `#00A884` active.

---

## 3. ACCENT COLORS (CFI Brand — Preserved)

| Token | Hex | Use |
|-------|-----|-----|
| **teal** | `#00A884` | Active states, badges, buttons, section titles (input type), live dots, breadcrumb active |
| **tealGlow** | `rgba(0,168,132,0.12)` | Teal-tinted backgrounds (active cards, badges) |
| **amber** | `#F5A623` | ALL numeric values, hero numbers, metric outputs, cost figures |
| **green** | `#25D366` | Success, confirmed, "Live", calculated badge, total rows |
| **red** | `#C62828` | Warnings, guardrails, alerts, blocked states |
| **blue** | `#53BDEB` | Info, links, verified badges, POS stream accent |
| **purple** | `#9B59B6` | CapEx, optional modules |

**v3 → v4:** Teal shifts from `#00C9B1` to `#00A884` (WA green, slightly warmer). If you prefer the original CFI teal, keep `#00C9B1` — both work.

---

## 4. TEXT COLORS

| Token | Hex | WA Origin | Use |
|-------|-----|-----------|-----|
| **textPrimary** | `#E9EDEF` | WA primary | Headings, card titles, contact names, body text |
| **textSecondary** | `#8696A0` | WA secondary | Descriptions, timestamps, message previews, sub-labels |
| **textMuted** | `#AEBAC1` | WA icons | Field labels, unit text, inactive icons, placeholder |

**v3 → v4:**

| v3 | v4 |
|----|-----|
| `#F0F4F8` (white) | `#E9EDEF` (textPrimary) |
| `#8BA0B4` (grey) | `#8696A0` (textSecondary) |
| `#A8B8C7` (greyMd) | `#AEBAC1` (textMuted) |
| `#C4D3E0` (greyLt) | `#AEBAC1` (textMuted) |

---

## 5. TYPOGRAPHY (Unchanged from v3)

| Element | Font | Weight | Size | Color |
|---------|------|--------|------|-------|
| Section titles | DM Sans | 700 | 14px | teal `#00A884` (input) / amber `#F5A623` (calculated) |
| Field labels | DM Sans | 600 | 13px | textMuted `#AEBAC1` |
| Sub-labels | DM Sans | 400 | 11px | textSecondary `#8696A0` |
| Hero numbers | DM Mono | 700 | 20px | amber `#F5A623` |
| Data values | DM Mono | 700 | 13px | amber `#F5A623` |
| Table headers | DM Sans | 700 | 12px | textMuted `#AEBAC1` |
| Table data | DM Mono | 400 | 11px | textSecondary `#8696A0` |
| Total row | DM Mono | 700 | 14px | green `#25D366` |
| Buttons | DM Sans | 700 | 12px | D1 `#0B141A` on teal bg |
| Brand "CFI" | EB Garamond | 700 | 26px | textPrimary `#E9EDEF` |
| Brand "Deep Tech" | EB Garamond | 700 | 26px | teal `#00A884` |

**Sentence case everywhere.** Abbreviations stay uppercase (EFB, OPDC, POS, NPK, FFB, DM, BSF, CAPEX, OPEX).

No emoji icons anywhere.

---

## 6. SECTION CARD PATTERN (All Pages)

Every section (A, B, C, D, E, F, G, H etc.) uses this structure:

```
┌──────────────────────────────────────────────────┐
│  OUTER CARD                                      │
│  background: #111B21 (D2)                        │
│  border: 1px solid #1B282E                       │
│  border-radius: 10px                             │
│                                                  │
│  ┌─ TITLE BAR ─────────────────────────────────┐ │
│  │  padding: 12px 16px                         │ │
│  │  title: DM Sans 700 14px                    │ │
│  │  input sections → teal #00A884              │ │
│  │  calculated sections → amber #F5A623        │ │
│  │  alert sections → red #C62828               │ │
│  │  badge (top-right): green "Calculated"      │ │
│  │  border-bottom: 1px solid #1B282E           │ │
│  └─────────────────────────────────────────────┘ │
│                                                  │
│  ┌─ INPUT AREA (if editable) ──────────────────┐ │
│  │  background: #1F2C34 (D3)                   │ │
│  │  margin: 0 12px                             │ │
│  │  border-radius: 8px                         │ │
│  │  padding: 14px 16px                         │ │
│  │                                             │ │
│  │  Input fields inside:                       │ │
│  │    bg: #202C33 (D4)                         │ │
│  │    border: 1px solid #1B282E                │ │
│  │    focus border: 1.5px solid #00A884        │ │
│  │    text: #F5A623 (amber)                    │ │
│  │    font: DM Mono 600 14px                   │ │
│  │    border-radius: 6px                       │ │
│  └─────────────────────────────────────────────┘ │
│                                                  │
│  ┌─ RESULTS AREA (calculated outputs) ─────────┐ │
│  │  padding: 10px 16px 14px                    │ │
│  │  NO black background — sits on D2 card bg   │ │
│  │                                             │ │
│  │  Hero number: DM Mono 700 20px amber        │ │
│  │  Secondary: DM Mono 700 14px teal           │ │
│  │  Sub-label: DM Sans 400 10px #8696A0        │ │
│  └─────────────────────────────────────────────┘ │
│                                                  │
└──────────────────────────────────────────────────┘
```

---

## 7. ROW-BASED GRID LAYOUT

All pages use CSS grid rows:

```css
display: grid;
gap: 16px;
align-items: stretch;  /* cards same height in a row */
margin-bottom: 16px;
```

Page container: `max-width: 1200px; margin: 0 auto; padding: 20px 24px 60px;`

Cards in the same row share left and right edges. No section title should wrap (`white-space: nowrap`).

---

## 8. GLOBAL HEADER

```
height: 72px
background: #202C33 (D4)
border-bottom: 1px solid #1B282E
position: sticky; top: 0; z-index: 100
```

Brand: `CFI` in `#E9EDEF`, `Deep Tech` in `#00A884`, EB Garamond 700 26px.
Teal divider bar: 2px wide, 36px tall.
Taglines: DM Sans 600 11px, labels `#E9EDEF`, values `#00A884`.

---

## 9. BREADCRUMB / STAGE BAR

```
background: #1F2C34 (D3)
border-bottom: 1px solid #1B282E
padding: 8px 28px
```

Stage pills:
- Done: `bg: rgba(37,211,102,0.1), color: #25D366, border: 1px solid rgba(37,211,102,0.3)`
- Active: `bg: rgba(0,168,132,0.15), color: #00A884, border: 1px solid #00A884`
- Pending: `bg: rgba(134,150,160,0.06), color: #8696A0, border: 1px solid rgba(134,150,160,0.2)`

---

## 10. INTERACTIVE STATES

### Cards (nav cards, module cards, protocol cards)

| State | Background | Border | Text |
|-------|-----------|--------|------|
| Default | `#111B21` (D2) | `1px solid #1B282E` | title: `#E9EDEF`, desc: `#8696A0` |
| Hover | `#2A3942` (D5) | `1px solid #00A884` | arrow/icon → `#00A884` |
| Active / Click | `#1F2C34` (D3) | `1.5px solid #00A884` + `box-shadow: 0 0 0 2px #00A884` | — |
| Disabled | `#111B21` (D2) | `1px solid #1B282E` | opacity: 0.4 |
| Selected | `#111B21` (D2) | `1.5px solid #00A884` | teal glow bg `rgba(0,168,132,0.06)` |

### Toggle cards (residue selectors, protocol buttons)

| State | Background | Border | Label Color |
|-------|-----------|--------|-------------|
| Off | `#111B21` (D2) | `1px solid #1B282E` | `#8696A0` |
| On | `rgba(0,168,132,0.08)` on D2 | `1.5px solid #00A884` | `#00A884` (teal) |
| Locked | `#111B21` (D2) | `1px solid #1B282E` | `#8696A0`, opacity 0.4 |

### Buttons

| Type | Background | Text | Border | Hover |
|------|-----------|------|--------|-------|
| Primary | `#00A884` | `#0B141A` | none | opacity 0.85 |
| Outline | transparent | `#00A884` | `1.5px solid #00A884` | bg `rgba(0,168,132,0.12)` |
| Danger | `#C62828` | `#E9EDEF` | none | opacity 0.85 |

---

## 11. STATUS BADGES

Small pills in top-right of cards:

| Status | Background | Text | Border |
|--------|-----------|------|--------|
| Live | `rgba(37,211,102,0.15)` | `#25D366` | `1px solid rgba(37,211,102,0.3)` |
| DB Ready | `rgba(0,168,132,0.10)` | `#00A884` | `1px solid rgba(0,168,132,0.3)` |
| New | `rgba(83,189,235,0.10)` | `#53BDEB` | `1px solid rgba(83,189,235,0.3)` |
| Warning | `rgba(200,40,40,0.10)` | `#C62828` | `1px solid rgba(200,40,40,0.3)` |
| Cost | `rgba(245,166,35,0.10)` | `#F5A623` | `1px solid rgba(245,166,35,0.3)` |

Font: DM Sans 700 9px, border-radius 20px, padding 2px 8px.

---

## 12. DATA TABLES

```
Table container: sits inside a D2 card
Header row bg: #1F2C34 (D3)
Header text: DM Sans 700 12px #AEBAC1, center-aligned
Data row border-bottom: 1px solid #1B282E
Data stream names: DM Mono 700 11px #F5A623 (amber)
Data numbers: DM Mono 400 11px #8696A0
Total row: DM Mono 700 14px #25D366 (green)
```

---

## 13. METRIC CARDS (KPI strips)

```
background: #111B21 (D2)
border: 1px solid #1B282E
border-radius: 8px
padding: 12px 16px

Label: DM Sans 700 10px #AEBAC1 uppercase letter-spacing 0.5px
Value: DM Mono 700 18px #F5A623 (amber)
Unit: DM Sans 400 10px #8696A0
```

Grid: `repeat(auto-fill, minmax(160px, 1fr))`, gap 10px.

---

## 14. ALERT / WARNING SECTIONS

```
background: #111B21 (D2)
border: 1px solid #1B282E
border-left: 3px solid #C62828 (red)
border-radius: 8px
padding: 14px 20px

Title: DM Sans 700 12px #C62828
Items: DM Sans 400 10px rgba(239,154,154,1) (#EF9A9A)
```

For amber warnings (missing data):
```
border-left: 3px solid #F5A623
Title color: #F5A623
Item dots: #F5A623
```

---

## 15. HANDOFF / SUMMARY BANNERS

```
background: rgba(37,211,102,0.06)
border: 1.5px solid rgba(37,211,102,0.3)
border-radius: 8px
padding: 14px 18px

Label: DM Sans 700 11px #25D366 uppercase
Value pills inside:
  bg: #1F2C34 (D3)
  border: 1px solid #1B282E
  value: DM Mono 700 15px #F5A623
  unit: DM Sans 400 9px #8696A0
```

---

## 16. GUARDRAIL STRIPS

```
background: #111B21 (D2)
border: 1px solid #1B282E
border-radius: 8px
padding: 14px 18px

Gate items: inline-flex with separator bars (#1B282E)
Icon: 14px
Label: DM Sans 400 12px #AEBAC1
Value: DM Mono 700 12px #8696A0
```

---

## 17. MODULE CARDS (S3-style grid)

```
background: #111B21 (D2)
border: 1px solid #1B282E
border-radius: 10px
padding: 18px 20px
top accent stripe: 3px solid [module accent color]

Icon box:
  bg: rgba([accent], 0.12)
  color: [accent]
  40x40px, border-radius 8px

Title: DM Sans 700 14px #E9EDEF
Module number: DM Mono 700 11px #8696A0
Description: DM Sans 400 11px #8696A0
Tags: DM Sans 700 9px #8696A0, bg rgba(27,40,46,0.5), border 1px solid #1B282E

Hover: bg #2A3942 (D5), border-color [accent], translateY(-1px)
```

---

## COMPLETE TOKEN REFERENCE

```javascript
const T = {
  // BACKGROUNDS (WhatsApp dark hierarchy)
  bg:        "#0B141A",   // D1 — page background
  bgCard:    "#111B21",   // D2 — cards, panels
  bgInner:   "#1F2C34",   // D3 — input areas, inner zones
  bgBar:     "#202C33",   // D4 — header, input fields
  bgHover:   "#2A3942",   // D5 — hover, selected

  // BORDER
  border:    "#1B282E",   // default dividers
  borderAct: "#00A884",   // active / focused

  // TEXT
  text:      "#E9EDEF",   // primary
  textSec:   "#8696A0",   // secondary
  textMuted: "#AEBAC1",   // labels, icons

  // ACCENTS (CFI brand)
  teal:      "#00A884",   // primary accent
  tealGlow:  "rgba(0,168,132,0.12)",
  amber:     "#F5A623",   // all numeric values
  green:     "#25D366",   // success, calculated
  red:       "#C62828",   // warnings, alerts
  blue:      "#53BDEB",   // info, links
  purple:    "#9B59B6",   // optional, capex
};
```

---

*CFI Design System v4 — WhatsApp Dark. March 2026.*
*Apply to all pages. Do not mix with v3 tokens.*
