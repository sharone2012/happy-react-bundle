# CFI Design System v3 — Lovable Implementation Instructions

Please apply ALL of the following changes to the existing App.jsx. Do not rewrite the app logic. Only update colours, fonts, and visual styling as specified below.

---

## 1. GOOGLE FONTS — Add to index.html

Add this line inside the `<head>` tag of `index.html`:

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;600;700&family=DM+Mono:wght@500;700&display=swap" />
```

---

## 2. COLOUR TOKENS — Replace the C{} constant block

Find the existing `const C = {` block and replace it entirely with:

```javascript
const C = {
  navy:    "#0B1422",
  navyMid: "#153352",
  navyLt:  "#1A3A5C",
  navyDk:  "#070D16",
  teal:    "#00C9B1",
  tealDk:  "#009E8C",
  tealLt:  "#5EEADA",
  amber:   "#F5A623",
  amberLt: "#FFD080",
  red:     "#E84040",
  green:   "#3DCB7A",
  blue:    "#4A9EDB",
  purple:  "#9B59B6",
  white:   "#F0F4F8",
  grey:    "#8BA0B4",
  greyLt:  "#C4D3E0",
  greyMd:  "#A8B8C7",
  pastelGreen: "#A8E6C1",
};
```

---

## 3. GLOBAL FONT — Update main app wrapper

Find the outermost app `<div>` that contains `fontFamily` and update:

- `fontFamily` → `'DM Sans', sans-serif`
- `background` → `#070D16`

---

## 4. SECTION BACKGROUNDS & BORDERS

All sections use the same border: `1.5px solid #1E6B8C`

| Section Type | Background | Border |
|---|---|---|
| User Input (editable fields) | `#1A3A5C` | `1.5px solid #1E6B8C` |
| Calculated Info (read-only) | `#153352` | `1.5px solid #1E6B8C` |
| Result (hero numbers) | `#153352` | `1.5px solid #1E6B8C` |
| Alert / Warning | `#060C14` | `1.5px solid #1E6B8C` |

---

## 5. SECTION TITLES

All section titles (the heading text at the top of each section panel) must:

- Font: `Syne, sans-serif`
- Weight: `700`
- Size: `18px`
- Always start with the section prefix: `Section A:`, `Section B:`, `Section C:`, `Section D:` etc.
- Title Case: Every Letter Of Every Word Capitalised
- No emoji icons anywhere in the app

Colour by section type:
- Input sections → `#00C9B1` (teal)
- Info / Calculated sections → `#F5A623` (orange/amber)
- Result sections → `#F5A623` (orange/amber)
- Alert sections → `#E84040` (red)

---

## 6. SECTION BADGES (top-right of section header)

- Font: `Syne, sans-serif`, `700`, `12px`
- Input sections → no badge
- Info sections → badge text "Calculated", colour `#3DCB7A` (green)
- Result sections → badge text "Calculated Output", colour `#3DCB7A` (green)
- Alert sections → badge text "Action Needed", colour `#E84040` (red)

---

## 7. INPUT FIELDS (inside black inner zone)

The black inner zone background: `#060C14`

Field label (e.g. "Fresh Fruit Bunch"):
- Font: `DM Sans`, `600`, `13px`
- Colour: `#8BA0B4`

Sub-label (e.g. "Tonnes / Hour"):
- Font: `DM Sans`, `400`, `11px`
- Colour: `#8BA0B4`

Number input box (where user types 60, 85 etc):
- Background: `#153352`
- Border: `1.5px solid #1E6B8C`
- Text colour: `#F5A623` (amber)
- Font: `DM Mono`, `600`, `14px`

Calculated inline result (e.g. "Effective FFB — 51 TPH"):
- Label: `DM Sans`, `600`, `16px`, colour `#8BA0B4`
- Value: `DM Mono`, `700`, `16px`, colour `#3DCB7A` (green)

---

## 8. DATA TABLES (inside Info sections)

Header row (Stream, Wet T/Day, N Kg/Day etc):
- Font: `DM Sans`, `700`, `12px`
- Colour: `#A8B8C7`
- Text aligned: centre

Data rows — stream name column (EFB, OPDC, POS):
- Font: `DM Mono`, `700`, `11px`
- Colour: `#F5A623` (orange)
- Aligned: centre

Data rows — all number columns:
- Font: `DM Mono`, `400`, `11px`
- Colour: `#A8B8C7`
- Aligned: centre

Total row (entire row):
- Font: `DM Mono`, `700`, `14px`
- Colour: `#A8E6C1` (pastel green)
- Aligned: centre

---

## 9. HERO NUMBERS (Result sections)

Large output number (e.g. 8,262):
- Font: `DM Mono`, `700`, `20px`
- Colour: `#F5A623` (orange)

Unit text below number (e.g. "Fresh Weight · T/Month"):
- Font: `DM Sans`, `400`, `11px`
- Colour: `#A8B8C7`

Formula text (e.g. "60 × 0.225 × 24 Hrs × 30 Days"):
- Font: `DM Sans`, `400`, `9px`
- Colour: `#A8B8C7`

---

## 10. ALERT BANNERS (inside Alert sections)

Each banner (warning / OK):
- Background: `rgba(232, 64, 64, 0.15)`
- Border: `1.5px solid #1E6B8C`
- Border radius: `6px`
- Padding: `9px 13px`
- Font: `DM Sans`, `13px`

Warning banner text colour: `#E84040` (red)
OK / cleared banner text colour: `#3DCB7A` (green)

---

## 11. REMOVE ALL EMOJI ICONS

Remove all emoji characters from section headers, tab labels, and anywhere else in the UI. No icons of any kind. Text only.

---

## 12. TITLE CASE RULE

Every visible text label throughout the entire application must follow Title Case — Every Letter Of Every Word Capitalised. This includes field labels, sub-labels, table headers, tab names, button text, and section titles.

Abbreviations stay as-is: EFB, OPDC, POS, NPK, FFB, CPO, PKM, DM, BSF, CAPEX, OPEX.

---

*CFI Design System v3 — March 2026. Apply exactly as specified. Do not interpret or simplify.*
