-- ═══════════════════════════════════════════════════════════════
-- CFI MIGRATION — Dedup cfi_mills_all by lat/lon
-- Run date: March 17 2026
-- Context: Two Claude sessions loaded GFW data simultaneously
--          causing ~217 duplicate rows. This removes them, keeping
--          the highest-confidence version of each mill.
-- Result:  1,489 rows → 1,272 rows (217 duplicates removed)
-- ═══════════════════════════════════════════════════════════════

-- Run in a FRESH Supabase SQL Editor tab

DELETE FROM cfi_mills_all
WHERE id IN (
  SELECT id FROM (
    SELECT id,
           ROW_NUMBER() OVER (
             PARTITION BY mill_name, province,
               ROUND(latitude::NUMERIC, 4),
               ROUND(longitude::NUMERIC, 4)
             ORDER BY
               CASE data_confidence
                 WHEN 'HIGH'   THEN 1
                 WHEN 'MEDIUM' THEN 2
                 WHEN 'LOW'    THEN 3
                 ELSE 4
               END,
               created_at ASC
           ) AS rn
    FROM cfi_mills_all
    WHERE latitude IS NOT NULL
  ) ranked
  WHERE rn > 1
);

-- VERIFY
SELECT COUNT(*) AS total_after_dedup FROM cfi_mills_all;
-- Expected: ~1,272
