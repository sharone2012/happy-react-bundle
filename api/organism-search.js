/**
 * POST /api/organism-search
 * AI-powered organism search — disabled in this deployment.
 */
module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  return res.status(503).json({ error: 'AI search feature is not available in this deployment.' });
};

  const { query } = req.body || {};

  if (!query || query.trim().length < 3) {
    return res.status(400).json({ error: 'Query must be at least 3 characters' });
  }

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      tools: [{ type: 'web_search_20250305', name: 'web_search' }],
      messages: [{
        role: 'user',
        content: `Search for organism: "${query}"

Find matches in:
1. ATCC (American Type Culture Collection) database
2. DSMZ (German Collection of Microorganisms) database
3. NRRL (USDA culture collection) database

For each match, provide:
- Scientific name (exact)
- Common name (if any)
- Category (Fungus, Bacteria, Enzyme, AMF, Other)
- ATCC ID (if available)
- DSMZ ID (if available)
- Confidence score (0-100% how well it matches the query)

Return top 5 matches as JSON array:
[
  {
    "scientific_name": "Thermobifida fusca",
    "common_name": "Thermophilic actinomycete",
    "category": "Bacteria",
    "atcc_id": "27730",
    "dsmz_id": "43792",
    "confidence": 95
  }
]

ONLY return the JSON array, no additional text.`,
      }],
    });

    const responseText = message.content
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('\n');

    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      return res.status(500).json({ error: 'Failed to parse search results' });
    }

    const matches = JSON.parse(jsonMatch[0]);
    return res.status(200).json({ matches });
  } catch (error) {
    console.error('Organism search error:', error);
    return res.status(500).json({ error: 'Search failed' });
  }
};
