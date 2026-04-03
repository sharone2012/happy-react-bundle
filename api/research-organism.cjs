/**
 * POST /api/research-organism
 * AI-powered organism research — disabled in this deployment.
 */
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  return res.status(503).json({ error: 'AI research feature is not available in this deployment.' });
};

// ── stub export satisfies module loader ──
void supabase;

  const { organism_name, common_name, category, atcc_id, dsmz_id } = req.body || {};

  if (!organism_name) {
    return res.status(400).json({ error: 'Organism name required' });
  }

  try {
    const { data: promptData, error: promptError } = await supabase
      .from('cfi_master_prompts')
      .select('full_prompt_text')
      .eq('prompt_code', 'ORGANISM_ONBOARD')
      .eq('is_active', true)
      .single();

    if (promptError || !promptData) {
      return res.status(500).json({ error: 'Master prompt not found' });
    }

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8000,
      tools: [{ type: 'web_search_20250305', name: 'web_search' }],
      messages: [{
        role: 'user',
        content: `${promptData.full_prompt_text}

ORGANISM TO RESEARCH:
- Scientific name: ${organism_name}
- Common name: ${common_name || 'N/A'}
- Category: ${category}
- ATCC ID: ${atcc_id || 'N/A'}
- DSMZ ID: ${dsmz_id || 'N/A'}

Execute the full research workflow:
1. 13-professor expert panel research
2. Tropical palm sources priority (Indonesia/Malaysia)
3. Generic performance scores (1-9 scale)
4. Cost data (commercial inoculant pricing)
5. Soil-specific scores for all 6 soils (Inceptisol, Ultisol, Oxisol, Histosol, Spodosol, Andisol)
6. Mechanisms for each soil
7. Literature sources (>=3 peer-reviewed)
8. Safety assessment (N2O risk, pH constraints, liming conflicts)
9. Guardrail flags if needed

Return results as JSON:
{
  "organism_name": "...",
  "generic": {
    "one_nine_score": 6.0,
    "n_fixer_score": 0.0,
    "p_releaser_score": 1.0,
    "lignin_score": 3.5,
    "cp_score": 2.0,
    "bsf_score": 3.5,
    "cost_per_tonne_fw": 0.675,
    "wave_assignment": "2a",
    "mechanism": "...",
    "warnings": "..."
  },
  "soils": [
    {
      "soil_type": "Inceptisol",
      "score": 4.0,
      "mechanism": "...",
      "confidence": "MEDIUM",
      "constraints": "..."
    }
  ],
  "citations": ["Bugg 2011 Curr Opin Biotechnol"],
  "guardrail_flag": null
}

ONLY return the JSON object, no additional text.`,
      }],
    });

    const responseText = message.content
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('\n');

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return res.status(500).json({ error: 'Failed to parse research results' });
    }

    const results = JSON.parse(jsonMatch[0]);
    return res.status(200).json({ success: true, data: results });
  } catch (error) {
    console.error('Research organism error:', error);
    return res.status(500).json({ error: 'Research failed' });
  }
};
