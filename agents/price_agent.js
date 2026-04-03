// ═══════════════════════════════════════════════════════════════════
// CFI AGENT 6 — FERTILISER PRICE AGENT
// Fetches CIF Indonesia prices for 5 key fertiliser inputs
// Runs: 1st + 16th of each month at 02:00 UTC (15-day cadence)
// Target: Supabase table cfi_fertiliser_prices
// NOTE: AI-powered fetch disabled — configure a data source to re-enable.
// ═══════════════════════════════════════════════════════════════════

const { createClient } = require('@supabase/supabase-js');

// ═══════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// ═══════════════════════════════════════════════════════════════════
// MAIN EXECUTION
// ═══════════════════════════════════════════════════════════════════

async function fetchFertiliserPrices() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('CFI AGENT 6 — FERTILISER PRICE FETCH DISABLED');
  console.log('AI-powered price fetch is not configured in this deployment.');
  console.log('═══════════════════════════════════════════════════════');

  return { success: false, reason: 'disabled' };
}

// ═══════════════════════════════════════════════════════════════════
// EXECUTE
// ═══════════════════════════════════════════════════════════════════

fetchFertiliserPrices()
  .then(result => {
    console.log('Exit: Success');
    process.exit(0);
  })
  .catch(error => {
    console.error('Exit: Failure');
    process.exit(1);
  });
