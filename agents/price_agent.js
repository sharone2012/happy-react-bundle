// ═══════════════════════════════════════════════════════════════════
// CFI AGENT 6 — FERTILISER PRICE AGENT
// Fetches CIF Indonesia prices for 5 key fertiliser inputs
// Runs: 1st + 16th of each month at 02:00 UTC (15-day cadence)
// Target: Supabase table cfi_fertiliser_prices
// ═══════════════════════════════════════════════════════════════════

const Anthropic = require('@anthropic-ai/sdk');
const { createClient } = require('@supabase/supabase-js');

// ═══════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// ═══════════════════════════════════════════════════════════════════
// PRICE RESEARCH PROMPT
// ═══════════════════════════════════════════════════════════════════

const PRICE_RESEARCH_PROMPT = `You are Agent 6 — CFI Deep Tech Fertiliser Price Intelligence Agent.

MISSION: Fetch current CIF Indonesia bulk fertiliser prices for 5 key nutrients.

TARGET FERTILISERS (search individually):
1. Urea (46-0-0) — CIF Indonesia bulk, USD/tonne
2. DAP (18-46-0) — CIF Indonesia bulk, USD/tonne  
3. MOP (0-0-60) — CIF Indonesia bulk, USD/tonne
4. Kieserite (0-0-25+25S) — CIF Indonesia bulk, USD/tonne
5. Agricultural lime (CaCO₃ 90%+) — CIF Indonesia bulk, USD/tonne

SEARCH STRATEGY:
- Use web_search for EACH fertiliser independently
- Search terms: "CIF Indonesia [fertiliser name] price USD tonne March 2026"
- Prioritise ICIS, Argus Media, FertilizerWorks, IFA, Green Markets
- Cross-check multiple sources per nutrient
- Flag LOW confidence if sources disagree >15%

OUTPUT REQUIREMENTS:
Return ONLY a JSON array with this structure (no markdown, no preamble):

[
  {
    "nutrient_code": "N",
    "fertiliser_type": "Urea",
    "npk_ratio": "46-0-0",
    "price_usd_per_tonne": 285.00,
    "confidence": "HIGH",
    "source": "ICIS CIF Indonesia March 2026",
    "notes": "Steady demand, regional supply stable"
  },
  {
    "nutrient_code": "P",
    "fertiliser_type": "DAP",
    "npk_ratio": "18-46-0",
    "price_usd_per_tonne": 520.00,
    "confidence": "MODERATE",
    "source": "Argus Media + FertilizerWorks avg",
    "notes": "Price range $510-530, averaged"
  }
]

CONFIDENCE TIERS:
- HIGH: 3+ sources agree within 5%
- MODERATE: 2 sources agree within 10%
- LOW: Single source OR sources disagree >15%

CRITICAL RULES:
- CIF Indonesia prices ONLY (not FOB, not domestic retail)
- Bulk commodity pricing (not bagged/retail)
- USD per metric tonne
- March 2026 or most recent available
- If no data found: price_usd_per_tonne = null, confidence = "NO_DATA"

Execute now. Return JSON only.`;

// ═══════════════════════════════════════════════════════════════════
// MAIN EXECUTION
// ═══════════════════════════════════════════════════════════════════

async function fetchFertiliserPrices() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('CFI AGENT 6 — FERTILISER PRICE FETCH STARTED');
  console.log('═══════════════════════════════════════════════════════');
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log('Target: cfi_fertiliser_prices table');
  console.log('');

  try {
    // ─────────────────────────────────────────────────────────────────
    // STEP 1: Call Claude with web search enabled
    // ─────────────────────────────────────────────────────────────────
    console.log('→ Calling Claude Sonnet 4 with web search tools...');
    
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      messages: [
        {
          role: 'user',
          content: PRICE_RESEARCH_PROMPT
        }
      ],
      tools: [
        {
          type: 'web_search_20250305',
          name: 'web_search'
        }
      ]
    });

    // ─────────────────────────────────────────────────────────────────
    // STEP 2: Extract JSON from response
    // ─────────────────────────────────────────────────────────────────
    const textContent = response.content
      .filter(block => block.type === 'text')
      .map(block => block.text)
      .join('\n');

    console.log('→ Claude response received');
    console.log('Raw response length:', textContent.length, 'chars');
    console.log('');

    // Strip markdown fences if present
    let cleanJson = textContent.trim();
    if (cleanJson.startsWith('```json')) {
      cleanJson = cleanJson.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    } else if (cleanJson.startsWith('```')) {
      cleanJson = cleanJson.replace(/```\n?/g, '').trim();
    }

    const priceData = JSON.parse(cleanJson);
    console.log('→ Parsed', priceData.length, 'fertiliser price records');
    console.log('');

    // ─────────────────────────────────────────────────────────────────
    // STEP 3: Write to Supabase
    // ─────────────────────────────────────────────────────────────────
    console.log('→ Writing to Supabase...');
    
    for (const record of priceData) {
      const { data, error } = await supabase
        .from('cfi_fertiliser_prices')
        .upsert({
          nutrient_code: record.nutrient_code,
          fertiliser_type: record.fertiliser_type,
          npk_ratio: record.npk_ratio,
          price_usd_per_tonne: record.price_usd_per_tonne,
          confidence: record.confidence,
          source: record.source,
          notes: record.notes,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'nutrient_code,fertiliser_type'
        });

      if (error) {
        console.error(`✗ Failed to write ${record.fertiliser_type}:`, error.message);
      } else {
        console.log(`✓ ${record.fertiliser_type} (${record.npk_ratio}): $${record.price_usd_per_tonne}/t [${record.confidence}]`);
      }
    }

    console.log('');
    console.log('═══════════════════════════════════════════════════════');
    console.log('AGENT 6 COMPLETED SUCCESSFULLY');
    console.log('═══════════════════════════════════════════════════════');
    
    return {
      success: true,
      records_processed: priceData.length,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error('');
    console.error('═══════════════════════════════════════════════════════');
    console.error('AGENT 6 FAILED');
    console.error('═══════════════════════════════════════════════════════');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    
    throw error;
  }
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
