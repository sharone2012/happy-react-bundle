// ═══════════════════════════════════════════════════════
// CFI CODE EXPORT — DESIGN SYSTEM
// CSS variables, colour tokens, Tailwind config,
// font definitions, reusable styled components
// ═══════════════════════════════════════════════════════


// ======================================================================
// FILE: src/index.css
// SIZE: 2892 chars / 129 lines
// ======================================================================

@tailwind base;
@tailwind components;
@tailwind utilities;

/* Definition of the design system. All colors, gradients, fonts, etc should be defined here. 
All colors MUST be HSL.
*/

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;

    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;

    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;

    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;

    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;

    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;

    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;

    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;

    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;

    --radius: 0.5rem;

    --sidebar-background: 0 0% 98%;

    --sidebar-foreground: 240 5.3% 26.1%;

    --sidebar-primary: 240 5.9% 10%;

    --sidebar-primary-foreground: 0 0% 98%;

    --sidebar-accent: 240 4.8% 95.9%;

    --sidebar-accent-foreground: 240 5.9% 10%;

    --sidebar-border: 220 13% 91%;

    --sidebar-ring: 217.2 91.2% 59.8%;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;

    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;

    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;

    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;

    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;

    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;

    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;

    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;

    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
    --sidebar-background: 240 5.9% 10%;
    --sidebar-foreground: 240 4.8% 95.9%;
    --sidebar-primary: 224.3 76.3% 48%;
    --sidebar-primary-foreground: 0 0% 100%;
    --sidebar-accent: 240 3.7% 15.9%;
    --sidebar-accent-foreground: 240 4.8% 95.9%;
    --sidebar-border: 240 3.7% 15.9%;
    --sidebar-ring: 217.2 91.2% 59.8%;
  }
}

@layer base {
  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground;
  }
}

/* CFI Slider — amber thumb, teal border, centered on track */
.cfi-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #F5A623;
  border: none;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
  margin-top: calc((3.8px - 20px) / 2);
}
.cfi-slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #F5A623;
  border: none;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
}



// ======================================================================
// FILE: src/App.css
// SIZE: 606 chars / 43 lines
// ======================================================================

#root {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.react:hover {
  filter: drop-shadow(0 0 2em #61dafbaa);
}

@keyframes logo-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: no-preference) {
  a:nth-of-type(2) .logo {
    animation: logo-spin infinite 20s linear;
  }
}

.card {
  padding: 2em;
}

.read-the-docs {
  color: #888;
}



// ======================================================================
// FILE: tailwind.config.ts
// SIZE: 2706 chars / 92 lines
// ======================================================================

import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;



// ======================================================================
// FILE: components.json
// SIZE: 414 chars / 21 lines
// ======================================================================

{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/index.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}



// ======================================================================
// FILE: src/components/UnitInput.jsx
// SIZE: 2260 chars / 99 lines
// ======================================================================

/**
 * UnitInput — Reusable bordered box containing number input + unit label.
 * Global design component used across all stages and calculators.
 *
 * Props:
 *   value       — current numeric value
 *   onChange     — (numericValue) => void
 *   unit        — string like "TPH", "hrs/day", "%", "t/month"
 *   step        — input step (default 1)
 *   placeholder — input placeholder
 *   readOnly    — if true, renders as display-only (no input)
 *   color       — override value color (default white)
 *   width       — override input width (default 44)
 */

const C_UNIT = {
  border: "#1E6B8C",
  bg: "#1A3A5C",
  dimText: "#8899ae",
};

export default function UnitInput({
  value,
  onChange,
  unit = "",
  step = 1,
  placeholder,
  readOnly = false,
  color = "#ffffff",
  width = 44,
}) {
  const boxStyle = {
    display: "inline-flex",
    alignItems: "center",
    border: `1px solid ${C_UNIT.border}`,
    borderRadius: 4,
    background: C_UNIT.bg,
    padding: "4px 4px 4px 8px",
    width: "auto",
  };

  const inputStyle = {
    width,
    textAlign: "right",
    background: "transparent",
    border: "none",
    outline: "none",
    color,
    fontFamily: "'DM Mono', monospace",
    fontSize: 13,
    padding: 0,
    margin: 0,
    flexShrink: 0,
  };

  // Split compound units like "hrs/day" into stacked lines
  const renderUnit = () => {
    if (!unit) return null;
    if (unit.includes("/")) {
      const parts = unit.split("/");
      return (
        <span style={unitStyle}>
          <div>{parts[0].trim()}</div>
          <div>{"/" + parts[1].trim()}</div>
        </span>
      );
    }
    return <span style={unitStyle}>{unit}</span>;
  };

  const unitStyle = {
    width: 28,
    paddingLeft: 3,
    fontSize: 9,
    color: C_UNIT.dimText,
    whiteSpace: "nowrap",
    lineHeight: 1.2,
    textAlign: "left",
  };

  return (
    <div style={boxStyle}>
      {readOnly ? (
        <div style={{ ...inputStyle, color }}>{value}</div>
      ) : (
        <input
          type="number"
          step={step}
          style={inputStyle}
          value={value}
          onChange={(e) => onChange?.(Number(e.target.value))}
          placeholder={placeholder}
        />
      )}
      {renderUnit()}
    </div>
  );
}



// ======================================================================
// FILE: src/components/NavLink.tsx
// SIZE: 751 chars / 29 lines
// ======================================================================

import { NavLink as RouterNavLink, NavLinkProps } from "react-router-dom";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface NavLinkCompatProps extends Omit<NavLinkProps, "className"> {
  className?: string;
  activeClassName?: string;
  pendingClassName?: string;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  ({ className, activeClassName, pendingClassName, to, ...props }, ref) => {
    return (
      <RouterNavLink
        ref={ref}
        to={to}
        className={({ isActive, isPending }) =>
          cn(className, isActive && activeClassName, isPending && pendingClassName)
        }
        {...props}
      />
    );
  },
);

NavLink.displayName = "NavLink";

export { NavLink };



// ======================================================================
// FILE: src/lib/utils.ts
// SIZE: 169 chars / 7 lines
// ======================================================================

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}



// DESIGN TOKENS from src/App.jsx — C
const C = {
  navy:      "#060C14",
  navyMid:   "#0A1628",
  navyCard:  "#111E33",
  navyField: "#142030",
  navyDeep:  "#0C1E33",
  teal:      "#40D7C5",
  tealDim:   "rgba(64,215,197,0.12)",
  tealBdr:   "rgba(64,215,197,0.60)",
  amber:     "#F5A623",
  green:     "#00A249",
  greenDim:  "rgba(0,162,73,0.13)",
  grey:      "#A8BDD0",
  greyLt:    "rgba(168,189,208,0.55)",
  white:     "#FFFFFF",
  bdrCalc:   "rgba(139,160,180,0.18)",
  // Legacy aliases kept for backward compat
  pageBg:        "#060C14",
  appBg:         "#0A1628",
  inputSectionBg:"#111E33",
  infoSectionBg: "#111E33",
  resultSectionBg:"#111E33",
  alertSectionBg:"#060C14",
  sectionBorder: "rgba(64,215,197,0.13)",
  innerZoneBg:   "#060C14",
  inputBoxBg:    "#142030",
  inputBoxBorder:"rgba(139,160,180,0.22)",
  alertBannerBg: "rgba(232,64,64,0.15)",
  tealDk: "#009E8C",
  tealLt: "#5EEADA",
  amberLt:"#FFD080",
  red:    "#E84040",
  blue:   "#4A9EDB",
  purple: "#9B59B6",
  greyMd: "#A8B8C7",
  greyLtSolid: "#C4D3E0",
  pastelGreen:"#A8E6C1",
  navyLt: "#1A3A5C",
};


// DESIGN TOKENS from src/App.jsx — S
const S = {
  // ── Section wrappers (4 types) ──
  secInput:  { background:C.inputSectionBg,  border:`1.5px solid ${C.sectionBorder}`, borderRadius:8, marginBottom:16, overflow:"hidden" },
  secInfo:   { background:C.infoSectionBg,   border:`1.5px solid ${C.sectionBorder}`, borderRadius:8, marginBottom:16, overflow:"hidden" },
  secResult: { background:C.resultSectionBg, border:`1.5px solid ${C.sectionBorder}`, borderRadius:8, marginBottom:16, overflow:"hidden" },
  secAlert:  { background:C.alertSectionBg,  border:`1.5px solid ${C.sectionBorder}`, borderRadius:8, marginBottom:16, overflow:"hidden" },
  // ── Section header ──
  secHeader: { padding:"10px 14px", borderBottom:"1px solid rgba(255,255,255,0.05)", display:"flex", alignItems:"center", justifyContent:"space-between" },
  secTitle:  { fontFamily:"'Syne', sans-serif", fontWeight:700, fontSize:18, letterSpacing:"0.02em" },
  secBadge:  (c) => ({ fontFamily:"'Syne', sans-serif", fontWeight:700, fontSize:12, padding:"2px 8px", borderRadius:4, background:c+"22", color:c }),
  secBody:   { padding:"12px 14px" },
  // ── Inner black input zone (Type A only) ──
  innerZone: { background:C.innerZoneBg, borderRadius:6, padding:"10px 12px", marginBottom:8 },
  // ── Field labels ──
  fldLabel:  { fontFamily:"'DM Sans', sans-serif", fontWeight:600, fontSize:13, color:C.grey },
  fldSub:    { fontFamily:"'DM Sans', sans-serif", fontWeight:400, fontSize:11, color:C.grey, marginTop:2 },
  fldInput:  { background:C.inputBoxBg, border:`1.5px solid ${C.inputBoxBorder}`, borderRadius:5,
               color:C.amber, fontFamily:"'DM Mono', monospace", fontWeight:600, fontSize:14,
               padding:"5px 10px", width:"100%", outline:"none" },
  calcLabel: { fontFamily:"'DM Sans', sans-serif", fontWeight:600, fontSize:16, color:C.grey },
  calcVal:   { fontFamily:"'DM Mono', monospace", fontWeight:700, fontSize:16, color:C.green },
  // ── Hero numbers ──
  heroNum:    { fontFamily:"'DM Mono', monospace", fontWeight:700, fontSize:20, color:C.amber },
  heroUnit:   { fontFamily:"'DM Sans', sans-serif", fontSize:11, color:C.greyMd, marginTop:3 },
  heroFormula:{ fontFamily:"'DM Sans', sans-serif", fontSize:9, color:C.greyMd, marginTop:4 },
  // ── Table styles ──
  tblHeader: { fontFamily:"'DM Sans', sans-serif", fontWeight:700, fontSize:12, color:C.greyMd, textAlign:"center", padding:"5px 6px" },
  tblStream: { fontFamily:"'DM Mono', monospace", fontWeight:700, fontSize:11, color:C.amber, textAlign:"center", padding:"5px 6px" },
  tblData:   { fontFamily:"'DM Mono', monospace", fontWeight:400, fontSize:11, color:C.greyMd, textAlign:"center", padding:"5px 6px" },
  tblTotal:  { fontFamily:"'DM Mono', monospace", fontWeight:700, fontSize:14, color:C.pastelGreen, textAlign:"center", padding:"5px 6px" },
  // ── Alert banners ──
  alertBanner:(c) => ({ background:C.alertBannerBg, border:`1.5px solid ${C.sectionBorder}`, borderRadius:6,
                         padding:"9px 13px", marginBottom:7, fontFamily:"'DM Sans', sans-serif", fontSize:13, color:c }),
  // ── Legacy aliases (backward compat) ──
  card:    { background:C.infoSectionBg, borderRadius:8, padding:"16px", marginBottom:12 },
  hdr:     { background:C.inputSectionBg, borderRadius:6, padding:"10px 14px", marginBottom:10,
             display:"flex", alignItems:"center", gap:8 },
  label:   { color:C.grey, fontSize:11, fontFamily:"'DM Sans', sans-serif", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:2 },
  val:     { color:C.white, fontSize:14, fontWeight:600, fontFamily:"'DM Sans', sans-serif" },
  input:   { background:C.inputBoxBg, border:`1.5px solid ${C.sectionBorder}`, borderRadius:5, color:C.amber,
             padding:"6px 10px", fontSize:13, width:"100%", outline:"none", fontFamily:"'DM Mono', monospace" },
  inputAmb:{ background:C.inputBoxBg, border:`1.5px solid ${C.amber}66`, borderRadius:5, color:C.amberLt,
             padding:"6px 10px", fontSize:13, width:"100%", outline:"none", fontFamily:"'DM Mono', monospace" },
  badge:   (c) => ({ background:c+"22", border:`1px solid ${c}55`, borderRadius:12, padding:"2px 8px",
                     color:c, fontSize:12, fontWeight:700, display:"inline-block", fontFamily:"'Syne', sans-serif" }),
  row:     { display:"flex", gap:10, marginBottom:8 },
  col:     { flex:1 },
  divider: { border:"none", borderTop:`1px solid ${C.sectionBorder}33`, margin:"12px 0" },
  tab:     (active) => ({
    padding:"8px 18px", cursor:"pointer", borderRadius:"6px 6px 0 0",
    background:active ? C.tealDk : C.inputSectionBg,
    color:active ? C.white : C.grey,
    fontSize:12, fontWeight:700, letterSpacing:"0.04em",
    fontFamily:"'Syne', sans-serif",
    border:`1px solid ${active ? C.teal : "transparent"}`,
    borderBottom:"none", transition:"all 0.15s"
  }),
};


// DESIGN TOKENS from src/pages/SiteSetup.jsx — C
const C = {
  navy:      '#060C14',
  navyMid:   '#0A1628',
  navyCard:  '#111E33',
  navyField: '#142030',
  navyDeep:  '#0C1E33',
  teal:      '#40D7C5',
  tealDim:   'rgba(64,215,197,0.12)',
  tealBdr:   'rgba(64,215,197,0.60)',
  amber:     '#F5A623',
  amberDim:  'rgba(245,166,35,0.14)',
  green:     '#00A249',
  greenLt:   '#33B56D',   // 20% lighter — F & G sections only
  greenLt30: '#4DBF82',   // 30% lighter — all other greens outside F & G
  greenDim:  'rgba(0,162,73,0.13)',
  red:       '#E84040',
  redDim:    'rgba(232,64,64,0.13)',
  grey:      '#A8BDD0',
  greyLt:    'rgba(168,189,208,0.75)',
  white:     '#E8F0FE',
  bdrIdle:   'rgba(255,255,255,0.06)',
  bdrCalc:   'rgba(139,160,180,0.18)',
};


// DESIGN TOKENS from src/pages/SiteSetup.jsx — Fnt
const Fnt = {
  syne:  "'Syne', sans-serif",
  dm:    "'DM Sans', sans-serif",
  mono:  "'DM Mono', monospace",
  brand: "'EB Garamond', serif",
};


// DESIGN TOKENS from src/CFI_S0_Page.jsx — C
const C = {
  navy:      '#060C14',
  navyMid:   '#0A1628',
  navyCard:  '#111E33',
  navyField: '#142030',
  navyDeep:  '#0C1E33',
  teal:      '#40D7C5',
  tealDim:   'rgba(64,215,197,0.12)',
  tealBdr:   'rgba(64,215,197,0.60)',
  amber:     '#F5A623',
  amberDim:  'rgba(245,166,35,0.14)',
  green:     '#00A249',
  greenDim:  'rgba(0,162,73,0.13)',
  red:       '#E84040',
  redDim:    'rgba(232,64,64,0.13)',
  grey:      '#A8BDD0',
  greyLt:    'rgba(168,189,208,0.75)',
  white:     '#E8F0FE',
  bdrIdle:   'rgba(255,255,255,0.06)',
  bdrCalc:   'rgba(139,160,180,0.18)',
};


// DESIGN TOKENS from src/CFI_S0_Page.jsx — Fnt
const Fnt = {
  syne:     "'Syne', sans-serif",
  dm:       "'DM Sans', sans-serif",
  mono:     "'DM Mono', monospace",
  brand:    "'EB Garamond', serif",
};

