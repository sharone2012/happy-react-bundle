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
