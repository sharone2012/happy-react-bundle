/**
 * Vercel Serverless Function — POST /api/insert-organism
 * Insert organism into biological_library + cfi_soil_organism_performance.
 * All records are set is_approved = false pending Sharon approval.
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

  const { organism_name, generic, soils, citations, guardrail_flag } = req.body || {};

  if (!organism_name || !generic || !soils) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const { data: libraryData, error: libraryError } = await supabase
      .from('biological_library')
      .insert({
        organism_name,
        cfi_category: generic.category || 'Bacteria',
        one_nine_score: generic.one_nine_score,
        n_fixer_score: generic.n_fixer_score,
        p_releaser_score: generic.p_releaser_score,
        lignin_score: generic.lignin_score,
        cp_score: generic.cp_score,
        bsf_score: generic.bsf_score,
        cost_per_tonne_fw: generic.cost_per_tonne_fw,
        wave_assignment: generic.wave_assignment,
        how_it_works: generic.mechanism,
        source_references: citations.join('; '),
        warnings: generic.warnings,
        recommended: false,
        guardrail_flag: guardrail_flag || null,
      })
      .select()
      .single();

    if (libraryError) {
      throw new Error(`Library insert failed: ${libraryError.message}`);
    }

    const soilInserts = soils.map((soil) => ({
      soil_type: soil.soil_type,
      organism_name,
      soil_specific_score: soil.score,
      mechanism: soil.mechanism,
      literature_source: citations.slice(0, 3).join('; '),
      confidence_level: soil.confidence,
      lignin_score_soil: soil.lignin_score_soil || soil.score,
      p_releaser_score_soil: soil.p_score_soil || null,
      constraint_notes: soil.constraints || 'None',
      is_approved: false,
    }));

    const { error: soilError } = await supabase
      .from('cfi_soil_organism_performance')
      .insert(soilInserts);

    if (soilError) {
      await supabase
        .from('biological_library')
        .delete()
        .eq('organism_name', organism_name);

      throw new Error(`Soil scores insert failed: ${soilError.message}`);
    }

    return res.status(200).json({
      success: true,
      organism_name,
      message: 'Organism added successfully. Awaiting Sharon approval (is_approved = FALSE).',
    });
  } catch (error) {
    console.error('Insert organism error:', error);
    return res.status(500).json({ error: error.message || 'Insert failed' });
  }
};
