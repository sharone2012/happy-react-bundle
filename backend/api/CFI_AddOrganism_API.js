/**
 * CFI BACKEND API HANDLERS — Add Organism Workflow
 * 
 * Three endpoints:
 * 1. POST /api/organism-search — Fuzzy search ATCC/DSMZ/NRRL databases
 * 2. POST /api/research-organism — Execute master prompt research workflow
 * 3. POST /api/insert-organism — Insert to Supabase with approval gate
 * 
 * Tech stack: Node.js + Express + Anthropic Claude API + Supabase
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ============================================================
// ENDPOINT 1: ORGANISM SEARCH (Fuzzy Match)
// ============================================================

export async function searchOrganism(req, res) {
  return res.status(503).json({ error: 'AI search feature is not available in this deployment.' });
}

// ============================================================
// ENDPOINT 2: RESEARCH ORGANISM (Master Prompt Execution)
// ============================================================

export async function researchOrganism(req, res) {
  return res.status(503).json({ error: 'AI research feature is not available in this deployment.' });
}

// ============================================================
// ENDPOINT 3: INSERT ORGANISM (Supabase with Approval Gate)
// ============================================================

export async function insertOrganism(req, res) {
  const { organism_name, generic, soils, citations, guardrail_flag } = req.body;

  if (!organism_name || !generic || !soils) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Insert to biological_library (generic data)
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
        recommended: false, // Awaiting Sharon approval
        guardrail_flag: guardrail_flag || null
      })
      .select()
      .single();

    if (libraryError) {
      throw new Error(`Library insert failed: ${libraryError.message}`);
    }

    // Insert to cfi_soil_organism_performance (6 soil-specific scores)
    const soilInserts = soils.map(soil => ({
      soil_type: soil.soil_type,
      organism_name,
      soil_specific_score: soil.score,
      mechanism: soil.mechanism,
      literature_source: citations.slice(0, 3).join('; '),
      confidence_level: soil.confidence,
      lignin_score_soil: soil.lignin_score_soil || soil.score,
      p_releaser_score_soil: soil.p_score_soil || null,
      constraint_notes: soil.constraints || 'None',
      is_approved: false // Sharon approval required
    }));

    const { error: soilError } = await supabase
      .from('cfi_soil_organism_performance')
      .insert(soilInserts);

    if (soilError) {
      // Rollback library insert if soil insert fails
      await supabase
        .from('biological_library')
        .delete()
        .eq('organism_name', organism_name);
      
      throw new Error(`Soil scores insert failed: ${soilError.message}`);
    }

    return res.json({
      success: true,
      organism_name,
      message: 'Organism added successfully. Awaiting Sharon approval (is_approved = FALSE).'
    });

  } catch (error) {
    console.error('Insert organism error:', error);
    return res.status(500).json({ error: error.message || 'Insert failed' });
  }
}

// ============================================================
// EXPRESS ROUTES
// ============================================================

/*
import express from 'express';
const app = express();

app.use(express.json());

app.post('/api/organism-search', searchOrganism);
app.post('/api/research-organism', researchOrganism);
app.post('/api/insert-organism', insertOrganism);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`CFI Organism API running on port ${PORT}`);
});
*/
