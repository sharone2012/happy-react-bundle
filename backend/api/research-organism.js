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
