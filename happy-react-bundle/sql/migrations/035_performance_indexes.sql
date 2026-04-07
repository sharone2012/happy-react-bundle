-- ══════════════════════════════════════════════════════════════════════════
-- MIGRATION 035: Performance Indexes (OPT-1 + OPT-5)
-- Date: April 4, 2026
-- Purpose: Add missing indexes for 10-100x query performance on filtered queries
-- Based on: CFI_DATABASE_SCHEMA_ANALYSIS.md — OPT-1 (HIGH) + OPT-5 (MEDIUM)
-- ══════════════════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────────────────────
-- OPT-1: MISSING STANDARD INDEXES
-- ─────────────────────────────────────────────────────────────────────────

-- biological_library
-- Most common filters: category browsing, approved-only reads, wave assignment
CREATE INDEX IF NOT EXISTS idx_biological_library_category
  ON biological_library (cfi_category);

CREATE INDEX IF NOT EXISTS idx_biological_library_recommended
  ON biological_library (recommended);

CREATE INDEX IF NOT EXISTS idx_biological_library_wave
  ON biological_library (wave_assignment);

-- Composite: is_approved is nearly always paired with category in UI queries
CREATE INDEX IF NOT EXISTS idx_biological_library_approved_category
  ON biological_library (is_approved, cfi_category);

-- cfi_soil_organism_performance
-- Most common filters: soil_type lookup, approval gate, composite join
CREATE INDEX IF NOT EXISTS idx_soil_organism_soil_type
  ON cfi_soil_organism_performance (soil_type);

CREATE INDEX IF NOT EXISTS idx_soil_organism_approved
  ON cfi_soil_organism_performance (is_approved);

-- Composite: ranking queries always filter on both soil_type + is_approved
CREATE INDEX IF NOT EXISTS idx_soil_organism_composite
  ON cfi_soil_organism_performance (soil_type, is_approved);

-- cfi_mills_60tph
-- Most common filters: province browsing, soil type, partial index for 60+ TPH
CREATE INDEX IF NOT EXISTS idx_mills_province
  ON cfi_mills_60tph (province);

CREATE INDEX IF NOT EXISTS idx_mills_soil_type
  ON cfi_mills_60tph (confirmed_soil_type);

-- Partial index: the app only ever queries mills with capacity >= 60 TPH
CREATE INDEX IF NOT EXISTS idx_mills_capacity_60tph
  ON cfi_mills_60tph (capacity_tph)
  WHERE capacity_tph >= 60;

-- canonical_lab_data
-- Most common access: stream+parameter lookup (unique pair = point query)
CREATE INDEX IF NOT EXISTS idx_canonical_stream
  ON canonical_lab_data (stream);

CREATE INDEX IF NOT EXISTS idx_canonical_parameter
  ON canonical_lab_data (parameter);

-- Unique composite: enforces business rule that (stream, parameter) is unique
-- and acts as a covering index for the most common lookup pattern
CREATE UNIQUE INDEX IF NOT EXISTS idx_canonical_stream_parameter
  ON canonical_lab_data (stream, parameter);

-- cfi_feedstock_values
-- Small table but queried by stream type in feedstock calculator
CREATE INDEX IF NOT EXISTS idx_feedstock_stream
  ON cfi_feedstock_values (stream)
  WHERE stream IS NOT NULL;

-- ─────────────────────────────────────────────────────────────────────────
-- OPT-5: FUNCTION-BASED INDEXES
-- ─────────────────────────────────────────────────────────────────────────

-- Case-insensitive organism name search (used in search/autocomplete)
CREATE INDEX IF NOT EXISTS idx_organism_name_lower
  ON biological_library (LOWER(organism_name));

-- Value ratio index: used by rank_organisms_by_objective() to sort affordability
-- Guards against divide-by-zero: only index rows where cost > 0
CREATE INDEX IF NOT EXISTS idx_value_ratio
  ON cfi_soil_organism_performance ((soil_specific_score / cost_per_tonne_fw))
  WHERE cost_per_tonne_fw > 0;
