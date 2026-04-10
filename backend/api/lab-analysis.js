'use strict';
/**
 * GET /api/lab/latest
 *
 * Returns the latest laboratory analysis records from Supabase
 * lab_analysis schema — sorted newest-first by analysis_date.
 *
 * Query params (all optional):
 *   residue  — filter by residue_code  e.g. ?residue=EFB
 *   status   — filter by status        e.g. ?status=Active
 *   limit    — max rows returned        e.g. ?limit=5  (default 20)
 *
 * Response shape:
 * {
 *   catalogue: [...cfi_file_catalogue rows],
 *   registry:  [...cfi_residue_registry rows matched by file_code],
 *   fetched_at: ISO timestamp
 * }
 */

const { createClient } = require('@supabase/supabase-js');

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set');
  return createClient(url, key);
}

module.exports = async function labAnalysisHandler(req, res) {
  try {
    const supabase = getSupabase();

    const residueFilter = req.query.residue ? String(req.query.residue).toUpperCase() : null;
    const statusFilter  = req.query.status  ? String(req.query.status)               : null;
    const limit         = Math.min(parseInt(req.query.limit, 10) || 20, 100);

    // ── 1. Query cfi_file_catalogue ──────────────────────────────
    let catQuery = supabase
      .schema('lab_analysis')
      .from('cfi_file_catalogue')
      .select(`
        file_code,
        display_title,
        residue_type,
        residue_code,
        file_format,
        filename,
        analysis_date,
        version,
        status,
        data_quality,
        parameters_count,
        sheets_count,
        analytical_methods,
        lab_provider,
        peer_reviewed,
        confidence_overall,
        supabase_table,
        cfi_notes
      `)
      .order('analysis_date', { ascending: false })
      .limit(limit);

    if (residueFilter) catQuery = catQuery.eq('residue_code', residueFilter);
    if (statusFilter)  catQuery = catQuery.ilike('status', `%${statusFilter}%`);

    const { data: catalogue, error: catErr } = await catQuery;
    if (catErr) throw catErr;

    // ── 2. Query cfi_residue_registry for the returned file_codes ──
    const fileCodes = catalogue.map(r => r.file_code);
    let registry = [];

    if (fileCodes.length > 0) {
      let regQuery = supabase
        .schema('lab_analysis')
        .from('cfi_residue_registry')
        .select(`
          residue_code,
          residue_name,
          residue_name_id,
          category,
          cfi_pipeline_stage,
          yield_basis,
          yield_pct_ffb,
          moisture_at_mill,
          monthly_volume_60tph,
          cfi_primary_pathway,
          locked_parameters,
          file_code
        `)
        .in('file_code', fileCodes)
        .order('residue_code', { ascending: true });

      const { data: regData, error: regErr } = await regQuery;
      if (regErr) throw regErr;
      registry = regData;
    }

    res.json({
      catalogue,
      registry,
      fetched_at: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[lab-analysis]', err.message);
    res.status(500).json({ error: err.message });
  }
};
