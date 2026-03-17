-- CFI Migration 17: Indonesia Soil Acidity Raster Database
-- Source: idn_soil_acidity.tif (IFPRI/HarvestChoice 2015)
-- Resolution: 5km grid, EPSG:4326
-- Coverage: Indonesia (108.7°E–141.0°E, 9.1°S–4.4°N)
-- 34,854 valid grid points, 8 acidity classes
-- Purpose: Lookup soil acidity class by mill lat/lon for S0 calculations

-- =====================================================================
-- TABLE 1: Soil acidity class definitions
-- =====================================================================
DROP TABLE IF EXISTS cfi_soil_acidity_classes CASCADE;
CREATE TABLE cfi_soil_acidity_classes (
    class_id        INTEGER PRIMARY KEY,
    class_name      TEXT NOT NULL,
    ph_range        TEXT NOT NULL,
    ph_midpoint     NUMERIC(4,2) NOT NULL,
    ph_min          NUMERIC(4,2),
    ph_max          NUMERIC(4,2),
    cfi_lime_flag   BOOLEAN NOT NULL DEFAULT false,
    cfi_note        TEXT,
    created_at      TIMESTAMPTZ DEFAULT now()
);

INSERT INTO cfi_soil_acidity_classes (class_id, class_name, ph_range, ph_midpoint, ph_min, ph_max, cfi_lime_flag, cfi_note) VALUES
(1, 'Excessively Acid',    '<4.0',     3.70, NULL, 4.00, true,  'Severe liming required; BSF frass + PKSA strongly recommended; P fixation extreme'),
(2, 'Extremely Acid',      '4.0-4.5',  4.25, 4.00, 4.50, true,  'Liming required; frass organic matter critical for CEC improvement'),
(3, 'Very Strongly Acid',  '4.6-5.0',  4.80, 4.60, 5.00, true,  'Most common in Kalimantan/Sumatra palm estates; frass + PKSA target pH 5.5+'),
(4, 'Strongly Acid',       '5.0-5.5',  5.25, 5.00, 5.50, false, 'Acceptable for palm; frass application reduces Al/Fe toxicity'),
(5, 'Moderately Acid',     '5.6-6.0',  5.80, 5.60, 6.00, false, 'Near-optimal for oil palm (pH 5.5-7.0); standard CFI application rates'),
(6, 'Slightly Acid',       '6.1-6.5',  6.30, 6.10, 6.50, false, 'Optimal zone; reduced N/P application vs acid soils'),
(7, 'Neutral',             '6.6-7.3',  6.95, 6.60, 7.30, false, 'Optimal; monitor K leaching on sandy soils'),
(8, 'Slightly Alkaline',   '7.4-7.8',  7.60, 7.40, 7.80, false, 'Rare in Indonesia; P availability may decline; not typical CFI target');

-- =====================================================================
-- TABLE 2: Spatial grid (5km resolution, Indonesia coverage)
-- =====================================================================
DROP TABLE IF EXISTS cfi_soil_acidity_grid CASCADE;
CREATE TABLE cfi_soil_acidity_grid (
    id              BIGSERIAL PRIMARY KEY,
    lat             NUMERIC(8,4) NOT NULL,
    lon             NUMERIC(8,4) NOT NULL,
    acidity_class   INTEGER NOT NULL REFERENCES cfi_soil_acidity_classes(class_id),
    created_at      TIMESTAMPTZ DEFAULT now()
);

-- Spatial index for fast nearest-neighbour lookup
CREATE INDEX idx_soil_acidity_grid_lat_lon ON cfi_soil_acidity_grid (lat, lon);
CREATE INDEX idx_soil_acidity_grid_class ON cfi_soil_acidity_grid (acidity_class);

-- =====================================================================
-- TABLE 3: Mill-specific soil acidity cache (populated when mills added)
-- =====================================================================
DROP TABLE IF EXISTS cfi_mill_soil_acidity CASCADE;
CREATE TABLE cfi_mill_soil_acidity (
    id                  BIGSERIAL PRIMARY KEY,
    mill_name           TEXT NOT NULL,
    mill_lat            NUMERIC(8,4) NOT NULL,
    mill_lon            NUMERIC(8,4) NOT NULL,
    acidity_class       INTEGER NOT NULL REFERENCES cfi_soil_acidity_classes(class_id),
    lookup_distance_km  NUMERIC(6,2),  -- distance to nearest grid point
    override_class      INTEGER REFERENCES cfi_soil_acidity_classes(class_id),
    override_reason     TEXT,
    lab_ph_measured     NUMERIC(4,2),  -- actual lab measurement if available
    created_at          TIMESTAMPTZ DEFAULT now(),
    updated_at          TIMESTAMPTZ DEFAULT now()
);

-- =====================================================================
-- FUNCTION: Lookup soil acidity class for any lat/lon
-- Returns nearest grid point class within 25km radius
-- =====================================================================
CREATE OR REPLACE FUNCTION get_soil_acidity_class(
    p_lat NUMERIC,
    p_lon NUMERIC,
    p_max_distance_km NUMERIC DEFAULT 25
)
RETURNS TABLE (
    acidity_class   INTEGER,
    class_name      TEXT,
    ph_range        TEXT,
    ph_midpoint     NUMERIC,
    cfi_lime_flag   BOOLEAN,
    cfi_note        TEXT,
    distance_km     NUMERIC
)
LANGUAGE sql STABLE AS $$
    SELECT 
        g.acidity_class,
        c.class_name,
        c.ph_range,
        c.ph_midpoint,
        c.cfi_lime_flag,
        c.cfi_note,
        ROUND(CAST(
            111.32 * SQRT(
                POWER(g.lat - p_lat, 2) + 
                POWER((g.lon - p_lon) * COS(RADIANS((g.lat + p_lat) / 2)), 2)
            ) AS NUMERIC
        ), 2) AS distance_km
    FROM cfi_soil_acidity_grid g
    JOIN cfi_soil_acidity_classes c ON c.class_id = g.acidity_class
    WHERE 
        ABS(g.lat - p_lat) < (p_max_distance_km / 111.0)
        AND ABS(g.lon - p_lon) < (p_max_distance_km / 111.0)
    ORDER BY distance_km ASC
    LIMIT 1;
$$;

-- =====================================================================
-- Run 17b through 17f after this for grid data.
