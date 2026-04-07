/**
 * MillContext.tsx â CFI Shared State Provider
 *
 * Reads the active site from cfi_sites in Supabase and makes
 * all S0 inputs available to S1âS6 via React Context.
 *
 * Usage:
 *   Wrap app in <MillProvider> in main.tsx
 *   In any stage component: const { site } = useMill();
 *
 * The site_id is read from URL param ?site=123 or defaults to
 * the most recent confirmed site for the logged-in user.
 */
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

/* ââ Type for a cfi_sites row âââââââââââââââââââââââââ */
export interface CfiSite {
  id: number;
  site_uuid: string | null;
  company_name: string | null;
  estate_name: string | null;
  estate_area_ha: number | null;
  mill_name: string | null;
  district: string | null;
  province: string | null;
  gps_lat: number | null;
  gps_lng: number | null;

  /* Mill capacity (Section B) */
  ffb_capacity_tph: number | null;
  utilisation_pct: number | null;
  operating_hrs_day: number | null;
  operating_days_month: number | null;
  monthly_ffb_t: number | null;
  capacity_confirmed: boolean;

  /* Soil & agronomy (Section C) */
  soil_type: string | null;
  agronomy_tier: string | null;
  product_value_index: number | null;

  /* Residue toggles (Section D) */
  efb_enabled: boolean;
  opdc_enabled: boolean;
  pos_enabled: boolean;
  opf_enabled: boolean;
  opt_enabled: boolean;
  pome_enabled: boolean;
  pke_enabled: boolean;
  pmf_enabled: boolean;

  /* Volumes (monthly tonnes) */
  efb_volume_t: number | null;
  opdc_volume_t: number | null;
  pos_volume_t: number | null;
  opf_volume_t: number | null;
  opt_volume_t: number | null;
  pome_volume_t: number | null;
  pke_volume_t: number | null;
  pmf_volume_t: number | null;

  /* Mix ratios (S2) */
  mix_input_mode: string | null;
  efb_mix_pct: number | null;
  opdc_mix_pct: number | null;
  pos_mix_pct: number | null;
  blend_cn_dm_weighted: number | null;
  cn_status: string | null;

  /* Weather */
  rainfall_mm_yr: number | null;
  temp_avg_c: number | null;

  /* Session metadata */
  streams_confirmed: boolean;
  session_date: string | null;
  user_id: string | null;
  user_email: string | null;
}

/* ââ Derived calculations from S0 inputs ââââââââââââââ */
export interface DerivedMetrics {
  /** Monthly EFB = monthly_ffb Ã 0.225 */
  monthlyEfb: number;
  /** Monthly OPDC = monthlyEfb Ã 0.152 */
  monthlyOpdc: number;
  /** Monthly POS = monthly_ffb Ã 0.015 (approx) */
  monthlyPos: number;
  /** Active processing lines count */
  activeLines: number;
  /** Names of active streams */
  activeStreamNames: string[];
}

export function deriveSiteMetrics(site: CfiSite | null): DerivedMetrics {
  if (!site) {
    return { monthlyEfb: 0, monthlyOpdc: 0, monthlyPos: 0, activeLines: 0, activeStreamNames: [] };
  }
  const ffb = Number(site.monthly_ffb_t) || (Number(site.ffb_capacity_tph || 60) * (Number(site.utilisation_pct || 85) / 100) * Number(site.operating_hrs_day || 24) * Number(site.operating_days_month || 30));
  const efb = Number(site.efb_volume_t) || ffb * 0.225;
  const opdc = Number(site.opdc_volume_t) || efb * 0.152;
  const pos = Number(site.pos_volume_t) || ffb * 0.015;

  const streams: string[] = [];
  if (site.efb_enabled) streams.push("EFB");
  if (site.opdc_enabled) streams.push("OPDC");
  if (site.pos_enabled) streams.push("POS");
  if (site.opf_enabled) streams.push("OPF");
  if (site.opt_enabled) streams.push("OPT");
  if (site.pke_enabled) streams.push("PKE");
  if (site.pmf_enabled) streams.push("PMF");

  return {
    monthlyEfb: Math.round(efb),
    monthlyOpdc: Math.round(opdc),
    monthlyPos: Math.round(pos),
    activeLines: Math.max(streams.filter(s => ["EFB", "OPDC", "POS"].includes(s)).length, 1),
    activeStreamNames: streams.length > 0 ? streams : ["EFB", "OPDC", "POS"],
  };
}

/* ââ Context shape ââââââââââââââââââââââââââââââââââââ */
interface MillContextValue {
  site: CfiSite | null;
  siteId: number | null;
  loading: boolean;
  error: string | null;
  derived: DerivedMetrics;
  setSiteId: (id: number) => void;
  refreshSite: () => Promise<void>;
}

const MillContext = createContext<MillContextValue>({
  site: null,
  siteId: null,
  loading: true,
  error: null,
  derived: { monthlyEfb: 0, monthlyOpdc: 0, monthlyPos: 0, activeLines: 0, activeStreamNames: [] },
  setSiteId: () => {},
  refreshSite: async () => {},
});

export const useMill = () => useContext(MillContext);

/* ââ Provider âââââââââââââââââââââââââââââââââââââââââ */
export function MillProvider({ children }: { children: React.ReactNode }) {
  const [site, setSite] = useState<CfiSite | null>(null);
  const [siteId, setSiteIdState] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* Read site_id from URL on mount */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlSiteId = params.get("site");
    if (urlSiteId) {
      setSiteIdState(Number(urlSiteId));
    } else {
      /* Default: load most recent confirmed site */
      supabase
        .from("cfi_sites")
        .select("id")
        .eq("capacity_confirmed", true)
        .order("updated_at", { ascending: false })
        .limit(1)
        .then(({ data }) => {
          if (data && data.length > 0) {
            setSiteIdState(data[0].id);
          } else {
            setLoading(false);
          }
        });
    }
  }, []);

  /* Fetch site data whenever siteId changes */
  const fetchSite = useCallback(async () => {
    if (!siteId) return;
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from("cfi_sites")
      .select("*")
      .eq("id", siteId)
      .single();
    if (err) {
      setError("Could not load site data.");
      setLoading(false);
      return;
    }
    setSite(data as CfiSite);
    setLoading(false);
  }, [siteId]);

  useEffect(() => {
    fetchSite();
  }, [fetchSite]);

  /* Listen for real-time updates to the active site */
  useEffect(() => {
    if (!siteId) return;
    const channel = supabase
      .channel(`site-${siteId}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "cfi_sites", filter: `id=eq.${siteId}` },
        (payload) => {
          setSite(payload.new as CfiSite);
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [siteId]);

  const derived = deriveSiteMetrics(site);

  const setSiteId = (id: number) => {
    setSiteIdState(id);
    /* Update URL without reload */
    const url = new URL(window.location.href);
    url.searchParams.set("site", String(id));
    window.history.replaceState({}, "", url.toString());
  };

  return (
    <MillContext.Provider value={{ site, siteId, loading, error, derived, setSiteId, refreshSite: fetchSite }}>
      {children}
    </MillContext.Provider>
  );
}

export default MillContext;
