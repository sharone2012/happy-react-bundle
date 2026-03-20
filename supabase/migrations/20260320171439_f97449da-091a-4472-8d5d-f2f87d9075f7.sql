CREATE TABLE IF NOT EXISTS public.weather_cache (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  location_key text NOT NULL UNIQUE,
  gps_lat numeric,
  gps_lng numeric,
  province text,
  temp_jan numeric, temp_feb numeric, temp_mar numeric, temp_apr numeric,
  temp_may numeric, temp_jun numeric, temp_jul numeric, temp_aug numeric,
  temp_sep numeric, temp_oct numeric, temp_nov numeric, temp_dec numeric,
  rain_jan numeric, rain_feb numeric, rain_mar numeric, rain_apr numeric,
  rain_may numeric, rain_jun numeric, rain_jul numeric, rain_aug numeric,
  rain_sep numeric, rain_oct numeric, rain_nov numeric, rain_dec numeric,
  source text DEFAULT 'open-meteo',
  fetched_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.weather_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "weather_cache_select" ON public.weather_cache
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "weather_cache_insert" ON public.weather_cache
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "weather_cache_update" ON public.weather_cache
  FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);