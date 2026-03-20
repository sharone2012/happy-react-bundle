

## Plan: Replace Section A + B with new SectionAB component

### Overview
Extract the new Supabase-connected Section A + B component from the uploaded file, create it as `src/components/CFI_S0_SectionAB.jsx`, and wire it into the S0 page replacing the current static sections A and B.

### Step 1: Create `src/components/CFI_S0_SectionAB.jsx`
- Copy the JSX code from the uploaded markdown (lines 91–799) exactly as written
- Component imports supabase client, implements company/estate/mill autocomplete cascades, soil acidity RPC, weather cache/fetch, and the Confirm Mill Capacity gate that upserts to `cfi_sites`
- Exports `SectionAB({ onSiteConfirmed, siteId, setSiteId })`

### Step 2: Update `src/pages/SiteSetup.jsx`
- Add `import SectionAB from "../components/CFI_S0_SectionAB"`
- Add state for `siteId` and a `handleSiteData` callback
- In Row 1, replace the current Section A card (lines ~248–275) and Section B card (lines ~278–313) with a single `<SectionAB onSiteConfirmed={handleSiteData} siteId={siteId} setSiteId={setSiteId} />`
- The SectionAB component renders its own 2-column grid (1fr 2fr), so it replaces the first two columns of Row 1. Sections C and G remain in the same row but the grid adjusts.
- No other sections are modified.

### Technical notes
- The new component queries: `cfi_mill_owners`, `cfi_mills_60tph`, `cfi_estates`, `cfi_province_soil_lookup`, `cfi_mill_soil_acidity`, `weather_cache`, `cfi_scenarios`, `cfi_sites`
- Uses RPC `get_soil_acidity_class`
- Supabase client already connected at `@/integrations/supabase/client`
- The `onSiteConfirmed` callback passes `monthlyFFB`, `monthlyEFB`, `monthlyOPDC`, `soilConfirmed`, `soilSuggestion`, `acidityResult`, `weather` to downstream sections

