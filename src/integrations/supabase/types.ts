export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      biological_library: {
        Row: {
          bsf_introduction_gate: string | null
          bsf_safe: boolean | null
          category: string | null
          cellulose_degradation: boolean | null
          common_name: string | null
          conflict_with: string[] | null
          dose_cfu_per_g: string | null
          guardrail_flag: string | null
          guardrail_note: string | null
          id: number
          last_updated: string | null
          lignin_degradation: boolean | null
          lock_class: string | null
          n_fixation: boolean | null
          optimal_ph_high: number | null
          optimal_ph_low: number | null
          optimal_temp_c_high: number | null
          optimal_temp_c_low: number | null
          organism_name: string
          p_solubilisation: boolean | null
          price_usd_per_kg: number | null
          stage_compatibility: string[] | null
          strain_code: string | null
          supplier_idn: string | null
        }
        Insert: {
          bsf_introduction_gate?: string | null
          bsf_safe?: boolean | null
          category?: string | null
          cellulose_degradation?: boolean | null
          common_name?: string | null
          conflict_with?: string[] | null
          dose_cfu_per_g?: string | null
          guardrail_flag?: string | null
          guardrail_note?: string | null
          id?: number
          last_updated?: string | null
          lignin_degradation?: boolean | null
          lock_class?: string | null
          n_fixation?: boolean | null
          optimal_ph_high?: number | null
          optimal_ph_low?: number | null
          optimal_temp_c_high?: number | null
          optimal_temp_c_low?: number | null
          organism_name: string
          p_solubilisation?: boolean | null
          price_usd_per_kg?: number | null
          stage_compatibility?: string[] | null
          strain_code?: string | null
          supplier_idn?: string | null
        }
        Update: {
          bsf_introduction_gate?: string | null
          bsf_safe?: boolean | null
          category?: string | null
          cellulose_degradation?: boolean | null
          common_name?: string | null
          conflict_with?: string[] | null
          dose_cfu_per_g?: string | null
          guardrail_flag?: string | null
          guardrail_note?: string | null
          id?: number
          last_updated?: string | null
          lignin_degradation?: boolean | null
          lock_class?: string | null
          n_fixation?: boolean | null
          optimal_ph_high?: number | null
          optimal_ph_low?: number | null
          optimal_temp_c_high?: number | null
          optimal_temp_c_low?: number | null
          organism_name?: string
          p_solubilisation?: boolean | null
          price_usd_per_kg?: number | null
          stage_compatibility?: string[] | null
          strain_code?: string | null
          supplier_idn?: string | null
        }
        Relationships: []
      }
      canonical_lab_data: {
        Row: {
          basis: string | null
          confidence_level: string | null
          created_by: string | null
          guardrail_note: string | null
          id: number
          is_ai_generated: boolean | null
          is_approved: boolean | null
          lock_class: string | null
          parameter: string
          source_ref: string | null
          stream: string
          unit: string | null
          value_numeric: number | null
          value_text: string | null
          verified_by: string | null
          verified_date: string | null
        }
        Insert: {
          basis?: string | null
          confidence_level?: string | null
          created_by?: string | null
          guardrail_note?: string | null
          id?: number
          is_ai_generated?: boolean | null
          is_approved?: boolean | null
          lock_class?: string | null
          parameter: string
          source_ref?: string | null
          stream: string
          unit?: string | null
          value_numeric?: number | null
          value_text?: string | null
          verified_by?: string | null
          verified_date?: string | null
        }
        Update: {
          basis?: string | null
          confidence_level?: string | null
          created_by?: string | null
          guardrail_note?: string | null
          id?: number
          is_ai_generated?: boolean | null
          is_approved?: boolean | null
          lock_class?: string | null
          parameter?: string
          source_ref?: string | null
          stream?: string
          unit?: string | null
          value_numeric?: number | null
          value_text?: string | null
          verified_by?: string | null
          verified_date?: string | null
        }
        Relationships: []
      }
      carbon_credits: {
        Row: {
          calculation_date: string | null
          carbon_price_base: number | null
          carbon_price_high: number | null
          carbon_price_low: number | null
          co2e_avoided_annual: number | null
          created_at: string | null
          created_by: string | null
          efb_capture_pct: number | null
          efb_t_day: number | null
          gwp100: number | null
          gwp20: number | null
          id: number
          insetting_price_high_usd: number | null
          insetting_price_low_usd: number | null
          is_verified: boolean | null
          mcf_value: number | null
          method_liquid: string | null
          method_solid: string | null
          notes: string | null
          offsetting_price_high_usd: number | null
          offsetting_price_low_usd: number | null
          opdc_capture_pct: number | null
          opdc_t_day: number | null
          pome_capture_pct: number | null
          pome_t_day: number | null
          registry: string | null
          revenue_base_usd: number | null
          revenue_high_usd: number | null
          revenue_low_usd: number | null
          stream: string | null
          verification_body: string | null
          verification_date: string | null
        }
        Insert: {
          calculation_date?: string | null
          carbon_price_base?: number | null
          carbon_price_high?: number | null
          carbon_price_low?: number | null
          co2e_avoided_annual?: number | null
          created_at?: string | null
          created_by?: string | null
          efb_capture_pct?: number | null
          efb_t_day?: number | null
          gwp100?: number | null
          gwp20?: number | null
          id?: number
          insetting_price_high_usd?: number | null
          insetting_price_low_usd?: number | null
          is_verified?: boolean | null
          mcf_value?: number | null
          method_liquid?: string | null
          method_solid?: string | null
          notes?: string | null
          offsetting_price_high_usd?: number | null
          offsetting_price_low_usd?: number | null
          opdc_capture_pct?: number | null
          opdc_t_day?: number | null
          pome_capture_pct?: number | null
          pome_t_day?: number | null
          registry?: string | null
          revenue_base_usd?: number | null
          revenue_high_usd?: number | null
          revenue_low_usd?: number | null
          stream?: string | null
          verification_body?: string | null
          verification_date?: string | null
        }
        Update: {
          calculation_date?: string | null
          carbon_price_base?: number | null
          carbon_price_high?: number | null
          carbon_price_low?: number | null
          co2e_avoided_annual?: number | null
          created_at?: string | null
          created_by?: string | null
          efb_capture_pct?: number | null
          efb_t_day?: number | null
          gwp100?: number | null
          gwp20?: number | null
          id?: number
          insetting_price_high_usd?: number | null
          insetting_price_low_usd?: number | null
          is_verified?: boolean | null
          mcf_value?: number | null
          method_liquid?: string | null
          method_solid?: string | null
          notes?: string | null
          offsetting_price_high_usd?: number | null
          offsetting_price_low_usd?: number | null
          opdc_capture_pct?: number | null
          opdc_t_day?: number | null
          pome_capture_pct?: number | null
          pome_t_day?: number | null
          registry?: string | null
          revenue_base_usd?: number | null
          revenue_high_usd?: number | null
          revenue_low_usd?: number | null
          stream?: string | null
          verification_body?: string | null
          verification_date?: string | null
        }
        Relationships: []
      }
      cfi_kernel_crushing_plants: {
        Row: {
          associated_mill_owner: string | null
          capacity_t_kernels_day: number | null
          cfi_pkm_opportunity: string | null
          confidence_level: string | null
          created_at: string | null
          est_pkm_output_t_month: number | null
          id: string
          kcp_name: string
          kcp_type: string | null
          kernels_sourced_from: string | null
          location_city_port: string | null
          location_province: string | null
          on_site_at_mill: boolean | null
          operator_company: string
          owner_id: string | null
          parent_group: string | null
          pkm_crude_protein_pct: number | null
          pkm_moisture_pct: number | null
          pkm_price_usd_t: string | null
          pkm_sold_to: string | null
          pkm_type: string | null
          source: string | null
        }
        Insert: {
          associated_mill_owner?: string | null
          capacity_t_kernels_day?: number | null
          cfi_pkm_opportunity?: string | null
          confidence_level?: string | null
          created_at?: string | null
          est_pkm_output_t_month?: number | null
          id?: string
          kcp_name: string
          kcp_type?: string | null
          kernels_sourced_from?: string | null
          location_city_port?: string | null
          location_province?: string | null
          on_site_at_mill?: boolean | null
          operator_company: string
          owner_id?: string | null
          parent_group?: string | null
          pkm_crude_protein_pct?: number | null
          pkm_moisture_pct?: number | null
          pkm_price_usd_t?: string | null
          pkm_sold_to?: string | null
          pkm_type?: string | null
          source?: string | null
        }
        Update: {
          associated_mill_owner?: string | null
          capacity_t_kernels_day?: number | null
          cfi_pkm_opportunity?: string | null
          confidence_level?: string | null
          created_at?: string | null
          est_pkm_output_t_month?: number | null
          id?: string
          kcp_name?: string
          kcp_type?: string | null
          kernels_sourced_from?: string | null
          location_city_port?: string | null
          location_province?: string | null
          on_site_at_mill?: boolean | null
          operator_company?: string
          owner_id?: string | null
          parent_group?: string | null
          pkm_crude_protein_pct?: number | null
          pkm_moisture_pct?: number | null
          pkm_price_usd_t?: string | null
          pkm_sold_to?: string | null
          pkm_type?: string | null
          source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cfi_kernel_crushing_plants_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "cfi_mill_owners"
            referencedColumns: ["id"]
          },
        ]
      }
      cfi_master_prompts: {
        Row: {
          applies_to: string[] | null
          category: string
          full_prompt_text: string
          id: number
          is_active: boolean | null
          last_updated: string | null
          persona_scope: string | null
          priority_order: number
          prompt_code: string
          prompt_name: string
          version: string | null
        }
        Insert: {
          applies_to?: string[] | null
          category: string
          full_prompt_text: string
          id?: number
          is_active?: boolean | null
          last_updated?: string | null
          persona_scope?: string | null
          priority_order: number
          prompt_code: string
          prompt_name: string
          version?: string | null
        }
        Update: {
          applies_to?: string[] | null
          category?: string
          full_prompt_text?: string
          id?: number
          is_active?: boolean | null
          last_updated?: string | null
          persona_scope?: string | null
          priority_order?: number
          prompt_code?: string
          prompt_name?: string
          version?: string | null
        }
        Relationships: []
      }
      cfi_mill_owners: {
        Row: {
          cfi_notes: string | null
          cfi_prospect_tier: string | null
          company: string
          created_at: string | null
          has_kernel_crushing_plant: boolean | null
          id: string
          jv_partners: string | null
          kcp_capacity_tpd: string | null
          kcp_locations: string | null
          kcp_operator: string | null
          mill_capacity_tph: string | null
          number_of_mills: number | null
          ownership_type: string | null
          parent_controlling_group: string | null
          pkm_available_on_site: boolean | null
          pkm_volume_est_t_month: string | null
          planted_area_ha: number | null
          province_locations: string | null
          rank: number | null
          rspo_status: string | null
        }
        Insert: {
          cfi_notes?: string | null
          cfi_prospect_tier?: string | null
          company: string
          created_at?: string | null
          has_kernel_crushing_plant?: boolean | null
          id?: string
          jv_partners?: string | null
          kcp_capacity_tpd?: string | null
          kcp_locations?: string | null
          kcp_operator?: string | null
          mill_capacity_tph?: string | null
          number_of_mills?: number | null
          ownership_type?: string | null
          parent_controlling_group?: string | null
          pkm_available_on_site?: boolean | null
          pkm_volume_est_t_month?: string | null
          planted_area_ha?: number | null
          province_locations?: string | null
          rank?: number | null
          rspo_status?: string | null
        }
        Update: {
          cfi_notes?: string | null
          cfi_prospect_tier?: string | null
          company?: string
          created_at?: string | null
          has_kernel_crushing_plant?: boolean | null
          id?: string
          jv_partners?: string | null
          kcp_capacity_tpd?: string | null
          kcp_locations?: string | null
          kcp_operator?: string | null
          mill_capacity_tph?: string | null
          number_of_mills?: number | null
          ownership_type?: string | null
          parent_controlling_group?: string | null
          pkm_available_on_site?: boolean | null
          pkm_volume_est_t_month?: string | null
          planted_area_ha?: number | null
          province_locations?: string | null
          rank?: number | null
          rspo_status?: string | null
        }
        Relationships: []
      }
      cfi_mills_60tph: {
        Row: {
          capacity_tph: number | null
          cfi_approach_status: string | null
          cfi_contact_email: string | null
          cfi_contact_name: string | null
          cfi_efb_available: boolean | null
          cfi_notes: string | null
          confirmed_soil_type: string | null
          created_at: string | null
          district_kabupaten: string | null
          est_efb_at_60tph_t_yr: number | null
          est_efb_output_t_yr: number | null
          est_ffb_processed_t_yr: number | null
          est_opdc_t_yr: number | null
          est_pkm_t_yr: number | null
          id: string
          latitude: number | null
          longitude: number | null
          mill_id: number | null
          mill_name: string
          nearest_city_port: string | null
          owner_company: string | null
          owner_id: string | null
          province: string | null
          province_soil_id: string | null
          rspo_status: string | null
          soil_confirmed_by: string | null
          soil_confirmed_date: string | null
          updated_at: string | null
        }
        Insert: {
          capacity_tph?: number | null
          cfi_approach_status?: string | null
          cfi_contact_email?: string | null
          cfi_contact_name?: string | null
          cfi_efb_available?: boolean | null
          cfi_notes?: string | null
          confirmed_soil_type?: string | null
          created_at?: string | null
          district_kabupaten?: string | null
          est_efb_at_60tph_t_yr?: number | null
          est_efb_output_t_yr?: number | null
          est_ffb_processed_t_yr?: number | null
          est_opdc_t_yr?: number | null
          est_pkm_t_yr?: number | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          mill_id?: number | null
          mill_name: string
          nearest_city_port?: string | null
          owner_company?: string | null
          owner_id?: string | null
          province?: string | null
          province_soil_id?: string | null
          rspo_status?: string | null
          soil_confirmed_by?: string | null
          soil_confirmed_date?: string | null
          updated_at?: string | null
        }
        Update: {
          capacity_tph?: number | null
          cfi_approach_status?: string | null
          cfi_contact_email?: string | null
          cfi_contact_name?: string | null
          cfi_efb_available?: boolean | null
          cfi_notes?: string | null
          confirmed_soil_type?: string | null
          created_at?: string | null
          district_kabupaten?: string | null
          est_efb_at_60tph_t_yr?: number | null
          est_efb_output_t_yr?: number | null
          est_ffb_processed_t_yr?: number | null
          est_opdc_t_yr?: number | null
          est_pkm_t_yr?: number | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          mill_id?: number | null
          mill_name?: string
          nearest_city_port?: string | null
          owner_company?: string | null
          owner_id?: string | null
          province?: string | null
          province_soil_id?: string | null
          rspo_status?: string | null
          soil_confirmed_by?: string | null
          soil_confirmed_date?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cfi_mills_60tph_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "cfi_mill_owners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cfi_mills_60tph_province_soil_id_fkey"
            columns: ["province_soil_id"]
            isOneToOne: false
            referencedRelation: "cfi_province_soil_lookup"
            referencedColumns: ["id"]
          },
        ]
      }
      cfi_product_soil_response: {
        Row: {
          amf_confidence: string | null
          amf_habitat_response_coeff: number | null
          amf_inoculation_effect_pct: number | null
          amf_p_environment_score_coeff: number | null
          amf_p_uptake_efficiency_mult: number | null
          confidence_overall: string | null
          created_at: string | null
          data_source: string | null
          dehydrogenase_response_factor: number | null
          enzyme_confidence: string | null
          fb_ratio_alpha_coeff: number | null
          fb_ratio_amf_contribution: number | null
          fb_ratio_beta_coeff: number | null
          fb_ratio_confidence: string | null
          fb_ratio_plfa_required: boolean | null
          id: number
          is_active: boolean | null
          mbc_confidence: string | null
          mbc_note: string | null
          mbc_response_mg_kg_per_t_ha: number | null
          mbc_synergy_factor: number | null
          mrs_amf_degraded: number | null
          mrs_amf_target: number | null
          mrs_amf_weight: number | null
          mrs_enzyme_weight: number | null
          mrs_fb_degraded: number | null
          mrs_fb_target: number | null
          mrs_fb_weight: number | null
          mrs_mbc_degraded: number | null
          mrs_mbc_target: number | null
          mrs_mbc_weight: number | null
          n_fix_wave2_organisms: string | null
          n_fix_wave2_potential_kg_n_ha_yr_high: number | null
          n_fix_wave2_potential_kg_n_ha_yr_low: number | null
          phosphatase_response_factor: number | null
          product_id: string
          product_name: string
          soil_key: string
          supabase_reference: string
          updated_at: string | null
          wave2_description: string | null
          wave2_slot_active: boolean | null
        }
        Insert: {
          amf_confidence?: string | null
          amf_habitat_response_coeff?: number | null
          amf_inoculation_effect_pct?: number | null
          amf_p_environment_score_coeff?: number | null
          amf_p_uptake_efficiency_mult?: number | null
          confidence_overall?: string | null
          created_at?: string | null
          data_source?: string | null
          dehydrogenase_response_factor?: number | null
          enzyme_confidence?: string | null
          fb_ratio_alpha_coeff?: number | null
          fb_ratio_amf_contribution?: number | null
          fb_ratio_beta_coeff?: number | null
          fb_ratio_confidence?: string | null
          fb_ratio_plfa_required?: boolean | null
          id?: number
          is_active?: boolean | null
          mbc_confidence?: string | null
          mbc_note?: string | null
          mbc_response_mg_kg_per_t_ha?: number | null
          mbc_synergy_factor?: number | null
          mrs_amf_degraded?: number | null
          mrs_amf_target?: number | null
          mrs_amf_weight?: number | null
          mrs_enzyme_weight?: number | null
          mrs_fb_degraded?: number | null
          mrs_fb_target?: number | null
          mrs_fb_weight?: number | null
          mrs_mbc_degraded?: number | null
          mrs_mbc_target?: number | null
          mrs_mbc_weight?: number | null
          n_fix_wave2_organisms?: string | null
          n_fix_wave2_potential_kg_n_ha_yr_high?: number | null
          n_fix_wave2_potential_kg_n_ha_yr_low?: number | null
          phosphatase_response_factor?: number | null
          product_id: string
          product_name: string
          soil_key: string
          supabase_reference: string
          updated_at?: string | null
          wave2_description?: string | null
          wave2_slot_active?: boolean | null
        }
        Update: {
          amf_confidence?: string | null
          amf_habitat_response_coeff?: number | null
          amf_inoculation_effect_pct?: number | null
          amf_p_environment_score_coeff?: number | null
          amf_p_uptake_efficiency_mult?: number | null
          confidence_overall?: string | null
          created_at?: string | null
          data_source?: string | null
          dehydrogenase_response_factor?: number | null
          enzyme_confidence?: string | null
          fb_ratio_alpha_coeff?: number | null
          fb_ratio_amf_contribution?: number | null
          fb_ratio_beta_coeff?: number | null
          fb_ratio_confidence?: string | null
          fb_ratio_plfa_required?: boolean | null
          id?: number
          is_active?: boolean | null
          mbc_confidence?: string | null
          mbc_note?: string | null
          mbc_response_mg_kg_per_t_ha?: number | null
          mbc_synergy_factor?: number | null
          mrs_amf_degraded?: number | null
          mrs_amf_target?: number | null
          mrs_amf_weight?: number | null
          mrs_enzyme_weight?: number | null
          mrs_fb_degraded?: number | null
          mrs_fb_target?: number | null
          mrs_fb_weight?: number | null
          mrs_mbc_degraded?: number | null
          mrs_mbc_target?: number | null
          mrs_mbc_weight?: number | null
          n_fix_wave2_organisms?: string | null
          n_fix_wave2_potential_kg_n_ha_yr_high?: number | null
          n_fix_wave2_potential_kg_n_ha_yr_low?: number | null
          phosphatase_response_factor?: number | null
          product_id?: string
          product_name?: string
          soil_key?: string
          supabase_reference?: string
          updated_at?: string | null
          wave2_description?: string | null
          wave2_slot_active?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "cfi_product_soil_response_soil_key_fkey"
            columns: ["soil_key"]
            isOneToOne: false
            referencedRelation: "cfi_soil_profiles"
            referencedColumns: ["soil_key"]
          },
        ]
      }
      cfi_province_soil_lookup: {
        Row: {
          cec_max_cmol: number | null
          cec_min_cmol: number | null
          cfi_n_loss_flag: string | null
          cfi_p_fixation_flag: string | null
          cfi_priority_amendment: string | null
          climate_class: string | null
          created_at: string | null
          dominant_soil_local: string
          dominant_soil_wrb: string
          drainage_class: string | null
          id: string
          island: string
          k_leaching_risk: string | null
          liming_required: boolean | null
          mg_leaching_risk: string | null
          n_leaching_base_pct_max: number | null
          n_leaching_base_pct_min: number | null
          n_leaching_high_rain_uplift: string | null
          n_primary_loss_pathway: string | null
          p_1st_yr_recovery_no_mgmt: string | null
          p_1st_yr_recovery_vgam: string | null
          p_fixation_base_pct_max: number | null
          p_fixation_base_pct_min: number | null
          p_fixation_mechanism: string | null
          peat_depth_class: string | null
          peat_present: boolean | null
          ph_max: number | null
          ph_min: number | null
          ph_target_palm: string | null
          province: string
          rainfall_mm_yr_max: number | null
          rainfall_mm_yr_min: number | null
          region: string
          secondary_soil_local: string | null
          secondary_soil_wrb: string | null
          source_1: string | null
          source_2: string | null
          temp_c_avg_max: number | null
          temp_c_avg_min: number | null
        }
        Insert: {
          cec_max_cmol?: number | null
          cec_min_cmol?: number | null
          cfi_n_loss_flag?: string | null
          cfi_p_fixation_flag?: string | null
          cfi_priority_amendment?: string | null
          climate_class?: string | null
          created_at?: string | null
          dominant_soil_local: string
          dominant_soil_wrb: string
          drainage_class?: string | null
          id?: string
          island: string
          k_leaching_risk?: string | null
          liming_required?: boolean | null
          mg_leaching_risk?: string | null
          n_leaching_base_pct_max?: number | null
          n_leaching_base_pct_min?: number | null
          n_leaching_high_rain_uplift?: string | null
          n_primary_loss_pathway?: string | null
          p_1st_yr_recovery_no_mgmt?: string | null
          p_1st_yr_recovery_vgam?: string | null
          p_fixation_base_pct_max?: number | null
          p_fixation_base_pct_min?: number | null
          p_fixation_mechanism?: string | null
          peat_depth_class?: string | null
          peat_present?: boolean | null
          ph_max?: number | null
          ph_min?: number | null
          ph_target_palm?: string | null
          province: string
          rainfall_mm_yr_max?: number | null
          rainfall_mm_yr_min?: number | null
          region: string
          secondary_soil_local?: string | null
          secondary_soil_wrb?: string | null
          source_1?: string | null
          source_2?: string | null
          temp_c_avg_max?: number | null
          temp_c_avg_min?: number | null
        }
        Update: {
          cec_max_cmol?: number | null
          cec_min_cmol?: number | null
          cfi_n_loss_flag?: string | null
          cfi_p_fixation_flag?: string | null
          cfi_priority_amendment?: string | null
          climate_class?: string | null
          created_at?: string | null
          dominant_soil_local?: string
          dominant_soil_wrb?: string
          drainage_class?: string | null
          id?: string
          island?: string
          k_leaching_risk?: string | null
          liming_required?: boolean | null
          mg_leaching_risk?: string | null
          n_leaching_base_pct_max?: number | null
          n_leaching_base_pct_min?: number | null
          n_leaching_high_rain_uplift?: string | null
          n_primary_loss_pathway?: string | null
          p_1st_yr_recovery_no_mgmt?: string | null
          p_1st_yr_recovery_vgam?: string | null
          p_fixation_base_pct_max?: number | null
          p_fixation_base_pct_min?: number | null
          p_fixation_mechanism?: string | null
          peat_depth_class?: string | null
          peat_present?: boolean | null
          ph_max?: number | null
          ph_min?: number | null
          ph_target_palm?: string | null
          province?: string
          rainfall_mm_yr_max?: number | null
          rainfall_mm_yr_min?: number | null
          region?: string
          secondary_soil_local?: string | null
          secondary_soil_wrb?: string | null
          source_1?: string | null
          source_2?: string | null
          temp_c_avg_max?: number | null
          temp_c_avg_min?: number | null
        }
        Relationships: []
      }
      cfi_residue_analysis: {
        Row: {
          analytical_method: string | null
          category: string
          confidence_level: string | null
          created_at: string | null
          direction: string | null
          id: number
          om_quality_index: number | null
          parameter: string
          pathway_type: string | null
          residue_type: string
          source_notes: string | null
          stage_code: string
          stage_label: string
          total_value_usd: number | null
          unit: string | null
          updated_at: string | null
          value_numeric: number | null
          value_text: string | null
          value_usd_per_t_dm: number | null
          vs_stage0_numeric: number | null
          vs_stage0_pct: string | null
        }
        Insert: {
          analytical_method?: string | null
          category: string
          confidence_level?: string | null
          created_at?: string | null
          direction?: string | null
          id?: number
          om_quality_index?: number | null
          parameter: string
          pathway_type?: string | null
          residue_type: string
          source_notes?: string | null
          stage_code: string
          stage_label: string
          total_value_usd?: number | null
          unit?: string | null
          updated_at?: string | null
          value_numeric?: number | null
          value_text?: string | null
          value_usd_per_t_dm?: number | null
          vs_stage0_numeric?: number | null
          vs_stage0_pct?: string | null
        }
        Update: {
          analytical_method?: string | null
          category?: string
          confidence_level?: string | null
          created_at?: string | null
          direction?: string | null
          id?: number
          om_quality_index?: number | null
          parameter?: string
          pathway_type?: string | null
          residue_type?: string
          source_notes?: string | null
          stage_code?: string
          stage_label?: string
          total_value_usd?: number | null
          unit?: string | null
          updated_at?: string | null
          value_numeric?: number | null
          value_text?: string | null
          value_usd_per_t_dm?: number | null
          vs_stage0_numeric?: number | null
          vs_stage0_pct?: string | null
        }
        Relationships: []
      }
      cfi_soil_coefficients: {
        Row: {
          bd_floor_g_cm3: number | null
          bd_positive_feedback_loop: boolean | null
          bd_response_delta_g_cm3_per_som_pct: number | null
          cec_response_confidence: string | null
          cec_response_per_som_pct: number | null
          created_at: string | null
          decay_factor_annual: number | null
          decay_factor_confidence: string | null
          decay_factor_note: string | null
          humic_cec_factor_cmol_kg: number | null
          humic_cec_factor_confidence: string | null
          humus_formation_confidence: string | null
          humus_formation_fract_bf: number | null
          humus_formation_fract_bfplus: number | null
          humus_formation_fract_cp: number | null
          id: number
          is_active: boolean | null
          k_leach_combined_rf: number | null
          k_leach_confidence: string | null
          k_leach_rf_bfplus: number | null
          k_leach_rf_cp: number | null
          n_fix_wave2_confidence: string
          n_fix_wave2_kg_n_ha_yr: number
          n_fix_wave2_organisms: string | null
          n_fix_wave2_potential_kg_n_ha_yr_high: number | null
          n_fix_wave2_potential_kg_n_ha_yr_low: number | null
          n_fix_wave2_status: string
          n_leach_combined_rf: number | null
          n_leach_confidence: string | null
          n_leach_rf_bf: number | null
          n_leach_rf_bfplus: number | null
          n_leach_rf_cp: number | null
          n_leach_rf_vgam: number | null
          om_retention_1yr_fract_bf: number | null
          om_retention_1yr_fract_bfplus: number | null
          om_retention_1yr_fract_cp: number | null
          om_retention_confidence: string | null
          p_casio3_rf_at_2_5_t_ha: number | null
          p_casio3_rf_at_4_5_t_ha: number | null
          p_fix_combined_rf: number | null
          p_fix_confidence: string | null
          p_fix_rf_amf: number | null
          p_fix_rf_bf: number | null
          p_fix_rf_bfplus: number | null
          p_fix_rf_cp: number | null
          p_fix_rf_vgam: number | null
          soil_key: string
          supabase_reference: string
          updated_at: string | null
          version: string | null
          whc_formula_applies: boolean | null
          whc_formula_note: string | null
          whc_response_confidence: string | null
          whc_response_mm_per_som_pct: number | null
        }
        Insert: {
          bd_floor_g_cm3?: number | null
          bd_positive_feedback_loop?: boolean | null
          bd_response_delta_g_cm3_per_som_pct?: number | null
          cec_response_confidence?: string | null
          cec_response_per_som_pct?: number | null
          created_at?: string | null
          decay_factor_annual?: number | null
          decay_factor_confidence?: string | null
          decay_factor_note?: string | null
          humic_cec_factor_cmol_kg?: number | null
          humic_cec_factor_confidence?: string | null
          humus_formation_confidence?: string | null
          humus_formation_fract_bf?: number | null
          humus_formation_fract_bfplus?: number | null
          humus_formation_fract_cp?: number | null
          id?: number
          is_active?: boolean | null
          k_leach_combined_rf?: number | null
          k_leach_confidence?: string | null
          k_leach_rf_bfplus?: number | null
          k_leach_rf_cp?: number | null
          n_fix_wave2_confidence?: string
          n_fix_wave2_kg_n_ha_yr?: number
          n_fix_wave2_organisms?: string | null
          n_fix_wave2_potential_kg_n_ha_yr_high?: number | null
          n_fix_wave2_potential_kg_n_ha_yr_low?: number | null
          n_fix_wave2_status?: string
          n_leach_combined_rf?: number | null
          n_leach_confidence?: string | null
          n_leach_rf_bf?: number | null
          n_leach_rf_bfplus?: number | null
          n_leach_rf_cp?: number | null
          n_leach_rf_vgam?: number | null
          om_retention_1yr_fract_bf?: number | null
          om_retention_1yr_fract_bfplus?: number | null
          om_retention_1yr_fract_cp?: number | null
          om_retention_confidence?: string | null
          p_casio3_rf_at_2_5_t_ha?: number | null
          p_casio3_rf_at_4_5_t_ha?: number | null
          p_fix_combined_rf?: number | null
          p_fix_confidence?: string | null
          p_fix_rf_amf?: number | null
          p_fix_rf_bf?: number | null
          p_fix_rf_bfplus?: number | null
          p_fix_rf_cp?: number | null
          p_fix_rf_vgam?: number | null
          soil_key: string
          supabase_reference: string
          updated_at?: string | null
          version?: string | null
          whc_formula_applies?: boolean | null
          whc_formula_note?: string | null
          whc_response_confidence?: string | null
          whc_response_mm_per_som_pct?: number | null
        }
        Update: {
          bd_floor_g_cm3?: number | null
          bd_positive_feedback_loop?: boolean | null
          bd_response_delta_g_cm3_per_som_pct?: number | null
          cec_response_confidence?: string | null
          cec_response_per_som_pct?: number | null
          created_at?: string | null
          decay_factor_annual?: number | null
          decay_factor_confidence?: string | null
          decay_factor_note?: string | null
          humic_cec_factor_cmol_kg?: number | null
          humic_cec_factor_confidence?: string | null
          humus_formation_confidence?: string | null
          humus_formation_fract_bf?: number | null
          humus_formation_fract_bfplus?: number | null
          humus_formation_fract_cp?: number | null
          id?: number
          is_active?: boolean | null
          k_leach_combined_rf?: number | null
          k_leach_confidence?: string | null
          k_leach_rf_bfplus?: number | null
          k_leach_rf_cp?: number | null
          n_fix_wave2_confidence?: string
          n_fix_wave2_kg_n_ha_yr?: number
          n_fix_wave2_organisms?: string | null
          n_fix_wave2_potential_kg_n_ha_yr_high?: number | null
          n_fix_wave2_potential_kg_n_ha_yr_low?: number | null
          n_fix_wave2_status?: string
          n_leach_combined_rf?: number | null
          n_leach_confidence?: string | null
          n_leach_rf_bf?: number | null
          n_leach_rf_bfplus?: number | null
          n_leach_rf_cp?: number | null
          n_leach_rf_vgam?: number | null
          om_retention_1yr_fract_bf?: number | null
          om_retention_1yr_fract_bfplus?: number | null
          om_retention_1yr_fract_cp?: number | null
          om_retention_confidence?: string | null
          p_casio3_rf_at_2_5_t_ha?: number | null
          p_casio3_rf_at_4_5_t_ha?: number | null
          p_fix_combined_rf?: number | null
          p_fix_confidence?: string | null
          p_fix_rf_amf?: number | null
          p_fix_rf_bf?: number | null
          p_fix_rf_bfplus?: number | null
          p_fix_rf_cp?: number | null
          p_fix_rf_vgam?: number | null
          soil_key?: string
          supabase_reference?: string
          updated_at?: string | null
          version?: string | null
          whc_formula_applies?: boolean | null
          whc_formula_note?: string | null
          whc_response_confidence?: string | null
          whc_response_mm_per_som_pct?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "cfi_soil_coefficients_soil_key_fkey"
            columns: ["soil_key"]
            isOneToOne: false
            referencedRelation: "cfi_soil_profiles"
            referencedColumns: ["soil_key"]
          },
        ]
      }
      cfi_soil_profiles: {
        Row: {
          al_sat_degraded_pct_high: number | null
          al_sat_degraded_pct_low: number | null
          al_sat_target_pct_max: number | null
          amf_colonisation_degraded_pct_high: number | null
          amf_colonisation_degraded_pct_low: number | null
          amf_colonisation_target_pct_high: number | null
          amf_colonisation_target_pct_low: number | null
          avail_p_degraded_mg_kg_high: number | null
          avail_p_degraded_mg_kg_low: number | null
          avail_p_target_mg_kg_high: number | null
          avail_p_target_mg_kg_low: number | null
          base_sat_degraded_pct_high: number | null
          base_sat_degraded_pct_low: number | null
          base_sat_target_pct_high: number | null
          base_sat_target_pct_low: number | null
          bd_degraded_g_cm3_high: number | null
          bd_degraded_g_cm3_low: number | null
          bd_target_g_cm3_high: number | null
          bd_target_g_cm3_low: number | null
          cec_degraded_cmol_high: number | null
          cec_degraded_cmol_low: number | null
          cec_target_cmol_high: number | null
          cec_target_cmol_low: number | null
          confidence_level: string | null
          coverage_pct_indonesia: number | null
          created_at: string | null
          data_source: string | null
          exch_k_degraded_cmol_high: number | null
          exch_k_degraded_cmol_low: number | null
          exch_k_target_cmol_high: number | null
          exch_k_target_cmol_low: number | null
          fb_ratio_degraded_high: number | null
          fb_ratio_degraded_low: number | null
          fb_ratio_target_high: number | null
          fb_ratio_target_low: number | null
          id: number
          is_active: boolean | null
          is_peat: boolean | null
          k_leach_fract_baseline: number
          local_name: string | null
          mbc_degraded_mg_kg_high: number | null
          mbc_degraded_mg_kg_low: number | null
          mbc_target_mg_kg_high: number | null
          mbc_target_mg_kg_low: number | null
          n_leach_fract_baseline: number
          notes: string | null
          p_fix_fraction_baseline: number
          p_leach_fract_baseline: number | null
          peat_ghg_baseline_t_co2e_ha_yr: number | null
          peat_irreversible_dry_risk: boolean | null
          peat_n_mechanism: string | null
          peat_organic_c_pct: number | null
          peat_subsidence_cm_yr: number | null
          ph_degraded_high: number | null
          ph_degraded_low: number | null
          ph_target_high: number | null
          ph_target_low: number | null
          soil_group_name: string
          soil_key: string
          som_degraded_pct_high: number | null
          som_degraded_pct_low: number | null
          som_target_pct_high: number | null
          som_target_pct_low: number | null
          supabase_reference: string
          texture_degraded: string | null
          texture_target: string | null
          updated_at: string | null
        }
        Insert: {
          al_sat_degraded_pct_high?: number | null
          al_sat_degraded_pct_low?: number | null
          al_sat_target_pct_max?: number | null
          amf_colonisation_degraded_pct_high?: number | null
          amf_colonisation_degraded_pct_low?: number | null
          amf_colonisation_target_pct_high?: number | null
          amf_colonisation_target_pct_low?: number | null
          avail_p_degraded_mg_kg_high?: number | null
          avail_p_degraded_mg_kg_low?: number | null
          avail_p_target_mg_kg_high?: number | null
          avail_p_target_mg_kg_low?: number | null
          base_sat_degraded_pct_high?: number | null
          base_sat_degraded_pct_low?: number | null
          base_sat_target_pct_high?: number | null
          base_sat_target_pct_low?: number | null
          bd_degraded_g_cm3_high?: number | null
          bd_degraded_g_cm3_low?: number | null
          bd_target_g_cm3_high?: number | null
          bd_target_g_cm3_low?: number | null
          cec_degraded_cmol_high?: number | null
          cec_degraded_cmol_low?: number | null
          cec_target_cmol_high?: number | null
          cec_target_cmol_low?: number | null
          confidence_level?: string | null
          coverage_pct_indonesia?: number | null
          created_at?: string | null
          data_source?: string | null
          exch_k_degraded_cmol_high?: number | null
          exch_k_degraded_cmol_low?: number | null
          exch_k_target_cmol_high?: number | null
          exch_k_target_cmol_low?: number | null
          fb_ratio_degraded_high?: number | null
          fb_ratio_degraded_low?: number | null
          fb_ratio_target_high?: number | null
          fb_ratio_target_low?: number | null
          id?: number
          is_active?: boolean | null
          is_peat?: boolean | null
          k_leach_fract_baseline: number
          local_name?: string | null
          mbc_degraded_mg_kg_high?: number | null
          mbc_degraded_mg_kg_low?: number | null
          mbc_target_mg_kg_high?: number | null
          mbc_target_mg_kg_low?: number | null
          n_leach_fract_baseline: number
          notes?: string | null
          p_fix_fraction_baseline: number
          p_leach_fract_baseline?: number | null
          peat_ghg_baseline_t_co2e_ha_yr?: number | null
          peat_irreversible_dry_risk?: boolean | null
          peat_n_mechanism?: string | null
          peat_organic_c_pct?: number | null
          peat_subsidence_cm_yr?: number | null
          ph_degraded_high?: number | null
          ph_degraded_low?: number | null
          ph_target_high?: number | null
          ph_target_low?: number | null
          soil_group_name: string
          soil_key: string
          som_degraded_pct_high?: number | null
          som_degraded_pct_low?: number | null
          som_target_pct_high?: number | null
          som_target_pct_low?: number | null
          supabase_reference: string
          texture_degraded?: string | null
          texture_target?: string | null
          updated_at?: string | null
        }
        Update: {
          al_sat_degraded_pct_high?: number | null
          al_sat_degraded_pct_low?: number | null
          al_sat_target_pct_max?: number | null
          amf_colonisation_degraded_pct_high?: number | null
          amf_colonisation_degraded_pct_low?: number | null
          amf_colonisation_target_pct_high?: number | null
          amf_colonisation_target_pct_low?: number | null
          avail_p_degraded_mg_kg_high?: number | null
          avail_p_degraded_mg_kg_low?: number | null
          avail_p_target_mg_kg_high?: number | null
          avail_p_target_mg_kg_low?: number | null
          base_sat_degraded_pct_high?: number | null
          base_sat_degraded_pct_low?: number | null
          base_sat_target_pct_high?: number | null
          base_sat_target_pct_low?: number | null
          bd_degraded_g_cm3_high?: number | null
          bd_degraded_g_cm3_low?: number | null
          bd_target_g_cm3_high?: number | null
          bd_target_g_cm3_low?: number | null
          cec_degraded_cmol_high?: number | null
          cec_degraded_cmol_low?: number | null
          cec_target_cmol_high?: number | null
          cec_target_cmol_low?: number | null
          confidence_level?: string | null
          coverage_pct_indonesia?: number | null
          created_at?: string | null
          data_source?: string | null
          exch_k_degraded_cmol_high?: number | null
          exch_k_degraded_cmol_low?: number | null
          exch_k_target_cmol_high?: number | null
          exch_k_target_cmol_low?: number | null
          fb_ratio_degraded_high?: number | null
          fb_ratio_degraded_low?: number | null
          fb_ratio_target_high?: number | null
          fb_ratio_target_low?: number | null
          id?: number
          is_active?: boolean | null
          is_peat?: boolean | null
          k_leach_fract_baseline?: number
          local_name?: string | null
          mbc_degraded_mg_kg_high?: number | null
          mbc_degraded_mg_kg_low?: number | null
          mbc_target_mg_kg_high?: number | null
          mbc_target_mg_kg_low?: number | null
          n_leach_fract_baseline?: number
          notes?: string | null
          p_fix_fraction_baseline?: number
          p_leach_fract_baseline?: number | null
          peat_ghg_baseline_t_co2e_ha_yr?: number | null
          peat_irreversible_dry_risk?: boolean | null
          peat_n_mechanism?: string | null
          peat_organic_c_pct?: number | null
          peat_subsidence_cm_yr?: number | null
          ph_degraded_high?: number | null
          ph_degraded_low?: number | null
          ph_target_high?: number | null
          ph_target_low?: number | null
          soil_group_name?: string
          soil_key?: string
          som_degraded_pct_high?: number | null
          som_degraded_pct_low?: number | null
          som_target_pct_high?: number | null
          som_target_pct_low?: number | null
          supabase_reference?: string
          texture_degraded?: string | null
          texture_target?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      cfi_solutions: {
        Row: {
          agent: string | null
          applied_to_table: string | null
          benefit_usd: number | null
          confidence: string | null
          cost_usd: number | null
          id: number
          is_approved: boolean | null
          last_updated: string | null
          persona_used: string | null
          process_params: Json | null
          product_metrics_after: Json | null
          product_metrics_before: Json | null
          recommendation: string | null
          roi_ratio: number | null
          soil_metrics_after: Json | null
          soil_metrics_before: Json | null
          soil_type: string | null
          solution_id: string
          source: Json | null
          step: string
          summary: string | null
          title: string
          uplift_pct: number | null
          uploaded_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          agent?: string | null
          applied_to_table?: string | null
          benefit_usd?: number | null
          confidence?: string | null
          cost_usd?: number | null
          id?: number
          is_approved?: boolean | null
          last_updated?: string | null
          persona_used?: string | null
          process_params?: Json | null
          product_metrics_after?: Json | null
          product_metrics_before?: Json | null
          recommendation?: string | null
          roi_ratio?: number | null
          soil_metrics_after?: Json | null
          soil_metrics_before?: Json | null
          soil_type?: string | null
          solution_id: string
          source?: Json | null
          step: string
          summary?: string | null
          title: string
          uplift_pct?: number | null
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          agent?: string | null
          applied_to_table?: string | null
          benefit_usd?: number | null
          confidence?: string | null
          cost_usd?: number | null
          id?: number
          is_approved?: boolean | null
          last_updated?: string | null
          persona_used?: string | null
          process_params?: Json | null
          product_metrics_after?: Json | null
          product_metrics_before?: Json | null
          recommendation?: string | null
          roi_ratio?: number | null
          soil_metrics_after?: Json | null
          soil_metrics_before?: Json | null
          soil_type?: string | null
          solution_id?: string
          source?: Json | null
          step?: string
          summary?: string | null
          title?: string
          uplift_pct?: number | null
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: []
      }
      cfi_traders_refiners_jv: {
        Row: {
          certification: string | null
          cfi_relevance: string | null
          company: string
          created_at: string | null
          hq_country: string | null
          id: string
          indonesia_operations: string | null
          owns_mills: boolean | null
          processes_ffb: boolean | null
          role: string | null
          scale_sourcing: string | null
          status: string | null
        }
        Insert: {
          certification?: string | null
          cfi_relevance?: string | null
          company: string
          created_at?: string | null
          hq_country?: string | null
          id?: string
          indonesia_operations?: string | null
          owns_mills?: boolean | null
          processes_ffb?: boolean | null
          role?: string | null
          scale_sourcing?: string | null
          status?: string | null
        }
        Update: {
          certification?: string | null
          cfi_relevance?: string | null
          company?: string
          created_at?: string | null
          hq_country?: string | null
          id?: string
          indonesia_operations?: string | null
          owns_mills?: boolean | null
          processes_ffb?: boolean | null
          role?: string | null
          scale_sourcing?: string | null
          status?: string | null
        }
        Relationships: []
      }
      change_log: {
        Row: {
          affected_column: string | null
          affected_table: string | null
          change_class: string
          change_type: string
          changed_at: string | null
          changed_by: string | null
          description: string
          id: number
          new_value: Json | null
          notes: string | null
          old_value: Json | null
          verified: boolean | null
        }
        Insert: {
          affected_column?: string | null
          affected_table?: string | null
          change_class: string
          change_type: string
          changed_at?: string | null
          changed_by?: string | null
          description: string
          id?: number
          new_value?: Json | null
          notes?: string | null
          old_value?: Json | null
          verified?: boolean | null
        }
        Update: {
          affected_column?: string | null
          affected_table?: string | null
          change_class?: string
          change_type?: string
          changed_at?: string | null
          changed_by?: string | null
          description?: string
          id?: number
          new_value?: Json | null
          notes?: string | null
          old_value?: Json | null
          verified?: boolean | null
        }
        Relationships: []
      }
      chemical_library: {
        Row: {
          benefits: string | null
          bsf_compatible: boolean | null
          cas_number: string | null
          category: string | null
          chemical_name: string
          contact_time_min: number | null
          dose_kg_per_t: number | null
          drawbacks: string | null
          guardrail_flag: string | null
          guardrail_note: string | null
          id: number
          k_effect_pct: number | null
          last_updated: string | null
          lignin_reduction_pct: number | null
          lock_class: string | null
          n_effect_pct: number | null
          p_effect_pct: number | null
          ph_effect_high: number | null
          ph_effect_low: number | null
          price_usd_per_t: number | null
          supplier_idn: string | null
        }
        Insert: {
          benefits?: string | null
          bsf_compatible?: boolean | null
          cas_number?: string | null
          category?: string | null
          chemical_name: string
          contact_time_min?: number | null
          dose_kg_per_t?: number | null
          drawbacks?: string | null
          guardrail_flag?: string | null
          guardrail_note?: string | null
          id?: number
          k_effect_pct?: number | null
          last_updated?: string | null
          lignin_reduction_pct?: number | null
          lock_class?: string | null
          n_effect_pct?: number | null
          p_effect_pct?: number | null
          ph_effect_high?: number | null
          ph_effect_low?: number | null
          price_usd_per_t?: number | null
          supplier_idn?: string | null
        }
        Update: {
          benefits?: string | null
          bsf_compatible?: boolean | null
          cas_number?: string | null
          category?: string | null
          chemical_name?: string
          contact_time_min?: number | null
          dose_kg_per_t?: number | null
          drawbacks?: string | null
          guardrail_flag?: string | null
          guardrail_note?: string | null
          id?: number
          k_effect_pct?: number | null
          last_updated?: string | null
          lignin_reduction_pct?: number | null
          lock_class?: string | null
          n_effect_pct?: number | null
          p_effect_pct?: number | null
          ph_effect_high?: number | null
          ph_effect_low?: number | null
          price_usd_per_t?: number | null
          supplier_idn?: string | null
        }
        Relationships: []
      }
      dosage_analyser: {
        Row: {
          bio_cost_usd: number | null
          blend_cn_ratio: number | null
          blend_cp_pct: number | null
          blend_moisture: number | null
          bsf_compatible: boolean | null
          chemical_cost_usd: number | null
          created_at: string | null
          created_by: string | null
          efb_pct: number | null
          frass_t_day: number | null
          id: number
          notes: string | null
          npk_floor_usd_t: number | null
          npk_output_k_pct: number | null
          npk_output_n_pct: number | null
          npk_output_p_pct: number | null
          opdc_pct: number | null
          other_pct: number | null
          pke_pct: number | null
          pksa_dose_kg_t: number | null
          pmf_pct: number | null
          pome_pct: number | null
          scenario_name: string
          soil_type: string | null
          vgam_value_usd_t: number | null
        }
        Insert: {
          bio_cost_usd?: number | null
          blend_cn_ratio?: number | null
          blend_cp_pct?: number | null
          blend_moisture?: number | null
          bsf_compatible?: boolean | null
          chemical_cost_usd?: number | null
          created_at?: string | null
          created_by?: string | null
          efb_pct?: number | null
          frass_t_day?: number | null
          id?: number
          notes?: string | null
          npk_floor_usd_t?: number | null
          npk_output_k_pct?: number | null
          npk_output_n_pct?: number | null
          npk_output_p_pct?: number | null
          opdc_pct?: number | null
          other_pct?: number | null
          pke_pct?: number | null
          pksa_dose_kg_t?: number | null
          pmf_pct?: number | null
          pome_pct?: number | null
          scenario_name: string
          soil_type?: string | null
          vgam_value_usd_t?: number | null
        }
        Update: {
          bio_cost_usd?: number | null
          blend_cn_ratio?: number | null
          blend_cp_pct?: number | null
          blend_moisture?: number | null
          bsf_compatible?: boolean | null
          chemical_cost_usd?: number | null
          created_at?: string | null
          created_by?: string | null
          efb_pct?: number | null
          frass_t_day?: number | null
          id?: number
          notes?: string | null
          npk_floor_usd_t?: number | null
          npk_output_k_pct?: number | null
          npk_output_n_pct?: number | null
          npk_output_p_pct?: number | null
          opdc_pct?: number | null
          other_pct?: number | null
          pke_pct?: number | null
          pksa_dose_kg_t?: number | null
          pmf_pct?: number | null
          pome_pct?: number | null
          scenario_name?: string
          soil_type?: string | null
          vgam_value_usd_t?: number | null
        }
        Relationships: []
      }
      emissions_results: {
        Row: {
          ch4_t: number | null
          co2e_100yr_t: number | null
          co2e_20yr_t: number | null
          emissions_result_id: string
          energy_kwh: number | null
          estate_id: string | null
          mill_id: string | null
          n2o_t: number | null
          period: string
          residue_id: string | null
          scenario: string
        }
        Insert: {
          ch4_t?: number | null
          co2e_100yr_t?: number | null
          co2e_20yr_t?: number | null
          emissions_result_id?: string
          energy_kwh?: number | null
          estate_id?: string | null
          mill_id?: string | null
          n2o_t?: number | null
          period: string
          residue_id?: string | null
          scenario: string
        }
        Update: {
          ch4_t?: number | null
          co2e_100yr_t?: number | null
          co2e_20yr_t?: number | null
          emissions_result_id?: string
          energy_kwh?: number | null
          estate_id?: string | null
          mill_id?: string | null
          n2o_t?: number | null
          period?: string
          residue_id?: string | null
          scenario?: string
        }
        Relationships: [
          {
            foreignKeyName: "emissions_results_estate_id_fkey"
            columns: ["estate_id"]
            isOneToOne: false
            referencedRelation: "estates"
            referencedColumns: ["estate_id"]
          },
          {
            foreignKeyName: "emissions_results_mill_id_fkey"
            columns: ["mill_id"]
            isOneToOne: false
            referencedRelation: "mills"
            referencedColumns: ["mill_id"]
          },
          {
            foreignKeyName: "emissions_results_residue_id_fkey"
            columns: ["residue_id"]
            isOneToOne: false
            referencedRelation: "residues"
            referencedColumns: ["residue_id"]
          },
        ]
      }
      equipment_catalogue: {
        Row: {
          annual_maintenance: number | null
          capacity_unit: string | null
          capex_usd: number | null
          capex_usd_high: number | null
          capex_usd_low: number | null
          capex_usd_mid: number | null
          derate_factor: number | null
          derated_capacity: number | null
          guardrail_note: string | null
          id: number
          installation_usd: number | null
          lifespan_years: number | null
          machine_name: string
          manufacturer: string | null
          model: string | null
          nameplate_capacity: number | null
          nameplate_kw: number | null
          notes: string | null
          oem_origin: string | null
          stage: string | null
        }
        Insert: {
          annual_maintenance?: number | null
          capacity_unit?: string | null
          capex_usd?: number | null
          capex_usd_high?: number | null
          capex_usd_low?: number | null
          capex_usd_mid?: number | null
          derate_factor?: number | null
          derated_capacity?: number | null
          guardrail_note?: string | null
          id?: number
          installation_usd?: number | null
          lifespan_years?: number | null
          machine_name: string
          manufacturer?: string | null
          model?: string | null
          nameplate_capacity?: number | null
          nameplate_kw?: number | null
          notes?: string | null
          oem_origin?: string | null
          stage?: string | null
        }
        Update: {
          annual_maintenance?: number | null
          capacity_unit?: string | null
          capex_usd?: number | null
          capex_usd_high?: number | null
          capex_usd_low?: number | null
          capex_usd_mid?: number | null
          derate_factor?: number | null
          derated_capacity?: number | null
          guardrail_note?: string | null
          id?: number
          installation_usd?: number | null
          lifespan_years?: number | null
          machine_name?: string
          manufacturer?: string | null
          model?: string | null
          nameplate_capacity?: number | null
          nameplate_kw?: number | null
          notes?: string | null
          oem_origin?: string | null
          stage?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "equipment_catalogue_manufacturer_fkey"
            columns: ["manufacturer"]
            isOneToOne: false
            referencedRelation: "equipment_manufacturers"
            referencedColumns: ["manufacturer"]
          },
        ]
      }
      equipment_manufacturers: {
        Row: {
          country: string | null
          derating_factor: number | null
          id: number
          manufacturer: string
          notes: string | null
          region: string | null
          tier: string | null
        }
        Insert: {
          country?: string | null
          derating_factor?: number | null
          id?: number
          manufacturer: string
          notes?: string | null
          region?: string | null
          tier?: string | null
        }
        Update: {
          country?: string | null
          derating_factor?: number | null
          id?: number
          manufacturer?: string
          notes?: string | null
          region?: string | null
          tier?: string | null
        }
        Relationships: []
      }
      estate_residue_baseline: {
        Row: {
          application_pattern: string | null
          application_rate_dm_ha_yr: number | null
          baseline_agronomic_fate:
            | Database["public"]["Enums"]["agronomic_fate"]
            | null
          baseline_discard_fate:
            | Database["public"]["Enums"]["discard_fate"]
            | null
          baseline_treatment: Database["public"]["Enums"]["baseline_treatment_type"]
          ef_n2o_baseline: number | null
          estate_id: string | null
          estate_residue_id: string
          mcf_baseline_default: number | null
          mcf_baseline_user: number | null
          pile_height_class: string | null
          residue_id: string | null
        }
        Insert: {
          application_pattern?: string | null
          application_rate_dm_ha_yr?: number | null
          baseline_agronomic_fate?:
            | Database["public"]["Enums"]["agronomic_fate"]
            | null
          baseline_discard_fate?:
            | Database["public"]["Enums"]["discard_fate"]
            | null
          baseline_treatment: Database["public"]["Enums"]["baseline_treatment_type"]
          ef_n2o_baseline?: number | null
          estate_id?: string | null
          estate_residue_id?: string
          mcf_baseline_default?: number | null
          mcf_baseline_user?: number | null
          pile_height_class?: string | null
          residue_id?: string | null
        }
        Update: {
          application_pattern?: string | null
          application_rate_dm_ha_yr?: number | null
          baseline_agronomic_fate?:
            | Database["public"]["Enums"]["agronomic_fate"]
            | null
          baseline_discard_fate?:
            | Database["public"]["Enums"]["discard_fate"]
            | null
          baseline_treatment?: Database["public"]["Enums"]["baseline_treatment_type"]
          ef_n2o_baseline?: number | null
          estate_id?: string | null
          estate_residue_id?: string
          mcf_baseline_default?: number | null
          mcf_baseline_user?: number | null
          pile_height_class?: string | null
          residue_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "estate_residue_baseline_estate_id_fkey"
            columns: ["estate_id"]
            isOneToOne: false
            referencedRelation: "estates"
            referencedColumns: ["estate_id"]
          },
          {
            foreignKeyName: "estate_residue_baseline_residue_id_fkey"
            columns: ["residue_id"]
            isOneToOne: false
            referencedRelation: "residues"
            referencedColumns: ["residue_id"]
          },
        ]
      }
      estates: {
        Row: {
          climate_band: string | null
          estate_id: string
          mill_id: string | null
          name: string
          notes: string | null
          soil_id: string | null
        }
        Insert: {
          climate_band?: string | null
          estate_id?: string
          mill_id?: string | null
          name: string
          notes?: string | null
          soil_id?: string | null
        }
        Update: {
          climate_band?: string | null
          estate_id?: string
          mill_id?: string | null
          name?: string
          notes?: string | null
          soil_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "estates_mill_id_fkey"
            columns: ["mill_id"]
            isOneToOne: false
            referencedRelation: "mills"
            referencedColumns: ["mill_id"]
          },
          {
            foreignKeyName: "estates_soil_id_fkey"
            columns: ["soil_id"]
            isOneToOne: false
            referencedRelation: "soils"
            referencedColumns: ["soil_id"]
          },
        ]
      }
      lab_analyses: {
        Row: {
          adl_frac_dm: number | null
          b0_kg_ch4_per_kg_cod: number | null
          c_frac_dm: number | null
          cf_frac_dm: number | null
          cod_kg_m3: number | null
          dm_fraction: number | null
          ee_frac_dm: number | null
          is_preferred: boolean | null
          lab_id: string
          n_frac_dm: number | null
          ndf_frac_dm: number | null
          residue_id: string | null
          sample_date: string
        }
        Insert: {
          adl_frac_dm?: number | null
          b0_kg_ch4_per_kg_cod?: number | null
          c_frac_dm?: number | null
          cf_frac_dm?: number | null
          cod_kg_m3?: number | null
          dm_fraction?: number | null
          ee_frac_dm?: number | null
          is_preferred?: boolean | null
          lab_id?: string
          n_frac_dm?: number | null
          ndf_frac_dm?: number | null
          residue_id?: string | null
          sample_date: string
        }
        Update: {
          adl_frac_dm?: number | null
          b0_kg_ch4_per_kg_cod?: number | null
          c_frac_dm?: number | null
          cf_frac_dm?: number | null
          cod_kg_m3?: number | null
          dm_fraction?: number | null
          ee_frac_dm?: number | null
          is_preferred?: boolean | null
          lab_id?: string
          n_frac_dm?: number | null
          ndf_frac_dm?: number | null
          residue_id?: string | null
          sample_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "lab_analyses_residue_id_fkey"
            columns: ["residue_id"]
            isOneToOne: false
            referencedRelation: "residues"
            referencedColumns: ["residue_id"]
          },
        ]
      }
      mills: {
        Row: {
          capacity_tph: number
          mill_id: string
          name: string
          operating_days_m: number
          operating_hours_d: number
          utilisation_pct: number
        }
        Insert: {
          capacity_tph: number
          mill_id?: string
          name: string
          operating_days_m: number
          operating_hours_d: number
          utilisation_pct: number
        }
        Update: {
          capacity_tph?: number
          mill_id?: string
          name?: string
          operating_days_m?: number
          operating_hours_d?: number
          utilisation_pct?: number
        }
        Relationships: []
      }
      project_pathways: {
        Row: {
          mcf_project_default: number
          mcf_project_user: number | null
          project_fate: Database["public"]["Enums"]["project_fate"]
          project_pathway_id: string
          residue_id: string | null
        }
        Insert: {
          mcf_project_default: number
          mcf_project_user?: number | null
          project_fate: Database["public"]["Enums"]["project_fate"]
          project_pathway_id?: string
          residue_id?: string | null
        }
        Update: {
          mcf_project_default?: number
          mcf_project_user?: number | null
          project_fate?: Database["public"]["Enums"]["project_fate"]
          project_pathway_id?: string
          residue_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_pathways_residue_id_fkey"
            columns: ["residue_id"]
            isOneToOne: false
            referencedRelation: "residues"
            referencedColumns: ["residue_id"]
          },
        ]
      }
      report_builder: {
        Row: {
          client_name: string | null
          config: Json | null
          created_at: string | null
          created_by: string | null
          currency: string | null
          estate_name: string | null
          id: number
          include_sections: string[] | null
          last_run: string | null
          notes: string | null
          output_format: string | null
          report_name: string
          report_type: string | null
          soil_type: string | null
        }
        Insert: {
          client_name?: string | null
          config?: Json | null
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          estate_name?: string | null
          id?: number
          include_sections?: string[] | null
          last_run?: string | null
          notes?: string | null
          output_format?: string | null
          report_name: string
          report_type?: string | null
          soil_type?: string | null
        }
        Update: {
          client_name?: string | null
          config?: Json | null
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          estate_name?: string | null
          id?: number
          include_sections?: string[] | null
          last_run?: string | null
          notes?: string | null
          output_format?: string | null
          report_name?: string
          report_type?: string | null
          soil_type?: string | null
        }
        Relationships: []
      }
      residues: {
        Row: {
          code: string
          name: string
          residue_id: string
        }
        Insert: {
          code: string
          name: string
          residue_id?: string
        }
        Update: {
          code?: string
          name?: string
          residue_id?: string
        }
        Relationships: []
      }
      residues_mass: {
        Row: {
          dm_t_per_month: number | null
          estate_id: string | null
          ffb_share_pct: number | null
          residue_id: string | null
          residues_mass_id: string
        }
        Insert: {
          dm_t_per_month?: number | null
          estate_id?: string | null
          ffb_share_pct?: number | null
          residue_id?: string | null
          residues_mass_id?: string
        }
        Update: {
          dm_t_per_month?: number | null
          estate_id?: string | null
          ffb_share_pct?: number | null
          residue_id?: string | null
          residues_mass_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "residues_mass_estate_id_fkey"
            columns: ["estate_id"]
            isOneToOne: false
            referencedRelation: "estates"
            referencedColumns: ["estate_id"]
          },
          {
            foreignKeyName: "residues_mass_residue_id_fkey"
            columns: ["residue_id"]
            isOneToOne: false
            referencedRelation: "residues"
            referencedColumns: ["residue_id"]
          },
        ]
      }
      s3_algae_uplift: {
        Row: {
          algae_dm_per_t_efb_kg: number | null
          algae_species: string
          algae_type: string | null
          amino_acid_profile: string | null
          baseline_bsf_meal_cp_pct: number | null
          biomass_yield_g_per_l: number | null
          bsf_fcr_reduction: number | null
          bsf_neonate_survival_uplift_pct: number | null
          capex_raceway_usd: number | null
          cfi_recommendation: string | null
          crude_protein_pct_dm: number | null
          final_bsf_meal_cp_pct: number | null
          hydration_volume_l_per_t_efb_dm: number | null
          id: number
          last_updated: string | null
          notes: string | null
          opex_monthly_usd: number | null
          protein_added_kg_per_t_efb: number | null
        }
        Insert: {
          algae_dm_per_t_efb_kg?: number | null
          algae_species: string
          algae_type?: string | null
          amino_acid_profile?: string | null
          baseline_bsf_meal_cp_pct?: number | null
          biomass_yield_g_per_l?: number | null
          bsf_fcr_reduction?: number | null
          bsf_neonate_survival_uplift_pct?: number | null
          capex_raceway_usd?: number | null
          cfi_recommendation?: string | null
          crude_protein_pct_dm?: number | null
          final_bsf_meal_cp_pct?: number | null
          hydration_volume_l_per_t_efb_dm?: number | null
          id?: number
          last_updated?: string | null
          notes?: string | null
          opex_monthly_usd?: number | null
          protein_added_kg_per_t_efb?: number | null
        }
        Update: {
          algae_dm_per_t_efb_kg?: number | null
          algae_species?: string
          algae_type?: string | null
          amino_acid_profile?: string | null
          baseline_bsf_meal_cp_pct?: number | null
          biomass_yield_g_per_l?: number | null
          bsf_fcr_reduction?: number | null
          bsf_neonate_survival_uplift_pct?: number | null
          capex_raceway_usd?: number | null
          cfi_recommendation?: string | null
          crude_protein_pct_dm?: number | null
          final_bsf_meal_cp_pct?: number | null
          hydration_volume_l_per_t_efb_dm?: number | null
          id?: number
          last_updated?: string | null
          notes?: string | null
          opex_monthly_usd?: number | null
          protein_added_kg_per_t_efb?: number | null
        }
        Relationships: []
      }
      s3_antagonism_matrix: {
        Row: {
          id: number
          last_updated: string | null
          org_a: string
          org_b: string
          relationship: string
          relationship_note: string | null
          resolution: string | null
          safe_to_co_dose: boolean
        }
        Insert: {
          id?: number
          last_updated?: string | null
          org_a: string
          org_b: string
          relationship: string
          relationship_note?: string | null
          resolution?: string | null
          safe_to_co_dose: boolean
        }
        Update: {
          id?: number
          last_updated?: string | null
          org_a?: string
          org_b?: string
          relationship?: string
          relationship_note?: string | null
          resolution?: string | null
          safe_to_co_dose?: boolean
        }
        Relationships: []
      }
      s3_capex: {
        Row: {
          category: string | null
          derate_applied: boolean | null
          description: string
          id: number
          item_code: string
          last_updated: string | null
          notes: string | null
          quantity: number | null
          supplier_region: string | null
          total_cost_usd: number | null
          unit_cost_usd: number | null
        }
        Insert: {
          category?: string | null
          derate_applied?: boolean | null
          description: string
          id?: number
          item_code: string
          last_updated?: string | null
          notes?: string | null
          quantity?: number | null
          supplier_region?: string | null
          total_cost_usd?: number | null
          unit_cost_usd?: number | null
        }
        Update: {
          category?: string | null
          derate_applied?: boolean | null
          description?: string
          id?: number
          item_code?: string
          last_updated?: string | null
          notes?: string | null
          quantity?: number | null
          supplier_region?: string | null
          total_cost_usd?: number | null
          unit_cost_usd?: number | null
        }
        Relationships: []
      }
      s3_inoculation_timeline: {
        Row: {
          action: string
          day_number: number
          gate_pass: string | null
          id: number
          last_updated: string | null
          notes: string | null
          operator_action: string | null
          organisms: string[] | null
          ph_target: string | null
          substrate_check: string | null
          temp_target_c: string | null
          time_window: string | null
        }
        Insert: {
          action: string
          day_number: number
          gate_pass?: string | null
          id?: number
          last_updated?: string | null
          notes?: string | null
          operator_action?: string | null
          organisms?: string[] | null
          ph_target?: string | null
          substrate_check?: string | null
          temp_target_c?: string | null
          time_window?: string | null
        }
        Update: {
          action?: string
          day_number?: number
          gate_pass?: string | null
          id?: number
          last_updated?: string | null
          notes?: string | null
          operator_action?: string | null
          organisms?: string[] | null
          ph_target?: string | null
          substrate_check?: string | null
          temp_target_c?: string | null
          time_window?: string | null
        }
        Relationships: []
      }
      s3_nine_org_dosing: {
        Row: {
          amber_warning: string | null
          bsf_safe: string | null
          c_to_n_impact: string | null
          category: string | null
          cellulose_reduction_pct_max: number | null
          cellulose_reduction_pct_min: number | null
          cost_per_kg_usd: number | null
          cost_per_tonne_fw_usd: number | null
          data_confidence: string | null
          dose_pct_dm: number | null
          id: number
          is_active: boolean | null
          last_updated: string | null
          lignin_reduction_pct_max: number | null
          lignin_reduction_pct_min: number | null
          monthly_kg_required: number | null
          monthly_opex_usd: number | null
          n_fixation_mg_per_kg_per_day: number | null
          notes: string | null
          optimal_ph_high: number | null
          optimal_ph_low: number | null
          optimal_temp_c_high: number | null
          optimal_temp_c_low: number | null
          organism_name: string
          primary_target: string | null
          provibio_icbb: string | null
          references_doi: string | null
          references_dois: string | null
          shelf_life_days_at_4c: number | null
          stack_position: number
          supplier_source: string | null
          wave: string
        }
        Insert: {
          amber_warning?: string | null
          bsf_safe?: string | null
          c_to_n_impact?: string | null
          category?: string | null
          cellulose_reduction_pct_max?: number | null
          cellulose_reduction_pct_min?: number | null
          cost_per_kg_usd?: number | null
          cost_per_tonne_fw_usd?: number | null
          data_confidence?: string | null
          dose_pct_dm?: number | null
          id?: number
          is_active?: boolean | null
          last_updated?: string | null
          lignin_reduction_pct_max?: number | null
          lignin_reduction_pct_min?: number | null
          monthly_kg_required?: number | null
          monthly_opex_usd?: number | null
          n_fixation_mg_per_kg_per_day?: number | null
          notes?: string | null
          optimal_ph_high?: number | null
          optimal_ph_low?: number | null
          optimal_temp_c_high?: number | null
          optimal_temp_c_low?: number | null
          organism_name: string
          primary_target?: string | null
          provibio_icbb?: string | null
          references_doi?: string | null
          references_dois?: string | null
          shelf_life_days_at_4c?: number | null
          stack_position: number
          supplier_source?: string | null
          wave: string
        }
        Update: {
          amber_warning?: string | null
          bsf_safe?: string | null
          c_to_n_impact?: string | null
          category?: string | null
          cellulose_reduction_pct_max?: number | null
          cellulose_reduction_pct_min?: number | null
          cost_per_kg_usd?: number | null
          cost_per_tonne_fw_usd?: number | null
          data_confidence?: string | null
          dose_pct_dm?: number | null
          id?: number
          is_active?: boolean | null
          last_updated?: string | null
          lignin_reduction_pct_max?: number | null
          lignin_reduction_pct_min?: number | null
          monthly_kg_required?: number | null
          monthly_opex_usd?: number | null
          n_fixation_mg_per_kg_per_day?: number | null
          notes?: string | null
          optimal_ph_high?: number | null
          optimal_ph_low?: number | null
          optimal_temp_c_high?: number | null
          optimal_temp_c_low?: number | null
          organism_name?: string
          primary_target?: string | null
          provibio_icbb?: string | null
          references_doi?: string | null
          references_dois?: string | null
          shelf_life_days_at_4c?: number | null
          stack_position?: number
          supplier_source?: string | null
          wave?: string
        }
        Relationships: []
      }
      s3_npk_contribution: {
        Row: {
          annual_total_kg: number | null
          confidence: string | null
          contribution_kg_per_t_dm: number | null
          contribution_mg_kg_dm_day: number | null
          five_day_high_kg: number | null
          five_day_low_kg: number | null
          id: number
          last_updated: string | null
          mechanism: string
          monthly_high_kg: number | null
          monthly_low_kg: number | null
          monthly_total_kg: number | null
          notes: string | null
          nutrient: string
          organism_name: string
          references_dois: string | null
        }
        Insert: {
          annual_total_kg?: number | null
          confidence?: string | null
          contribution_kg_per_t_dm?: number | null
          contribution_mg_kg_dm_day?: number | null
          five_day_high_kg?: number | null
          five_day_low_kg?: number | null
          id?: number
          last_updated?: string | null
          mechanism: string
          monthly_high_kg?: number | null
          monthly_low_kg?: number | null
          monthly_total_kg?: number | null
          notes?: string | null
          nutrient: string
          organism_name: string
          references_dois?: string | null
        }
        Update: {
          annual_total_kg?: number | null
          confidence?: string | null
          contribution_kg_per_t_dm?: number | null
          contribution_mg_kg_dm_day?: number | null
          five_day_high_kg?: number | null
          five_day_low_kg?: number | null
          id?: number
          last_updated?: string | null
          mechanism?: string
          monthly_high_kg?: number | null
          monthly_low_kg?: number | null
          monthly_total_kg?: number | null
          notes?: string | null
          nutrient?: string
          organism_name?: string
          references_dois?: string | null
        }
        Relationships: []
      }
      s3_opex_monthly: {
        Row: {
          basis: string | null
          category: string
          description: string
          id: number
          item_code: string
          last_updated: string | null
          monthly_cost_usd: number | null
          notes: string | null
          quantity_per_month: number | null
          stream: string | null
          unit: string | null
          unit_cost_usd: number | null
        }
        Insert: {
          basis?: string | null
          category: string
          description: string
          id?: number
          item_code: string
          last_updated?: string | null
          monthly_cost_usd?: number | null
          notes?: string | null
          quantity_per_month?: number | null
          stream?: string | null
          unit?: string | null
          unit_cost_usd?: number | null
        }
        Update: {
          basis?: string | null
          category?: string
          description?: string
          id?: number
          item_code?: string
          last_updated?: string | null
          monthly_cost_usd?: number | null
          notes?: string | null
          quantity_per_month?: number | null
          stream?: string | null
          unit?: string | null
          unit_cost_usd?: number | null
        }
        Relationships: []
      }
      s3_procurement: {
        Row: {
          commercial_form: string | null
          commercial_link: string | null
          commercial_price_usd_kg: number | null
          commercial_supplier: string | null
          id: number
          last_updated: string | null
          lead_time_days: number | null
          minimum_order_kg: number | null
          monthly_cost_commercial_usd: number | null
          monthly_cost_provibio_usd: number | null
          monthly_kg_required: number | null
          organism_name: string
          provibio_available: boolean
          provibio_form: string | null
          provibio_icbb: string | null
          provibio_price_usd_kg: number | null
          rationale: string | null
          recommended_source: string | null
          saving_usd_if_provibio: number | null
          stack_position: number | null
        }
        Insert: {
          commercial_form?: string | null
          commercial_link?: string | null
          commercial_price_usd_kg?: number | null
          commercial_supplier?: string | null
          id?: number
          last_updated?: string | null
          lead_time_days?: number | null
          minimum_order_kg?: number | null
          monthly_cost_commercial_usd?: number | null
          monthly_cost_provibio_usd?: number | null
          monthly_kg_required?: number | null
          organism_name: string
          provibio_available: boolean
          provibio_form?: string | null
          provibio_icbb?: string | null
          provibio_price_usd_kg?: number | null
          rationale?: string | null
          recommended_source?: string | null
          saving_usd_if_provibio?: number | null
          stack_position?: number | null
        }
        Update: {
          commercial_form?: string | null
          commercial_link?: string | null
          commercial_price_usd_kg?: number | null
          commercial_supplier?: string | null
          id?: number
          last_updated?: string | null
          lead_time_days?: number | null
          minimum_order_kg?: number | null
          monthly_cost_commercial_usd?: number | null
          monthly_cost_provibio_usd?: number | null
          monthly_kg_required?: number | null
          organism_name?: string
          provibio_available?: boolean
          provibio_form?: string | null
          provibio_icbb?: string | null
          provibio_price_usd_kg?: number | null
          rationale?: string | null
          recommended_source?: string | null
          saving_usd_if_provibio?: number | null
          stack_position?: number | null
        }
        Relationships: []
      }
      soils: {
        Row: {
          drainage: string | null
          name: string
          notes: string | null
          soil_id: string
        }
        Insert: {
          drainage?: string | null
          name: string
          notes?: string | null
          soil_id?: string
        }
        Update: {
          drainage?: string | null
          name?: string
          notes?: string | null
          soil_id?: string
        }
        Relationships: []
      }
      visitor_registry: {
        Row: {
          country: string | null
          email: string
          id: number
          ip_hash: string | null
          notes: string | null
          organisation: string | null
          phone: string | null
          registered_at: string | null
          role: string | null
          source_tab: string | null
          user_agent: string | null
          visitor_name: string
        }
        Insert: {
          country?: string | null
          email: string
          id?: number
          ip_hash?: string | null
          notes?: string | null
          organisation?: string | null
          phone?: string | null
          registered_at?: string | null
          role?: string | null
          source_tab?: string | null
          user_agent?: string | null
          visitor_name: string
        }
        Update: {
          country?: string | null
          email?: string
          id?: number
          ip_hash?: string | null
          notes?: string | null
          organisation?: string | null
          phone?: string | null
          registered_at?: string | null
          role?: string | null
          source_tab?: string | null
          user_agent?: string | null
          visitor_name?: string
        }
        Relationships: []
      }
    }
    Views: {
      v_bsf_performance: {
        Row: {
          parameter: string | null
          residue_type: string | null
          source_notes: string | null
          stage_code: string | null
          unit: string | null
          value_numeric: number | null
          value_text: string | null
        }
        Insert: {
          parameter?: string | null
          residue_type?: string | null
          source_notes?: string | null
          stage_code?: string | null
          unit?: string | null
          value_numeric?: number | null
          value_text?: string | null
        }
        Update: {
          parameter?: string | null
          residue_type?: string | null
          source_notes?: string | null
          stage_code?: string | null
          unit?: string | null
          value_numeric?: number | null
          value_text?: string | null
        }
        Relationships: []
      }
      v_pke_nutrient_journey: {
        Row: {
          direction: string | null
          parameter: string | null
          stage_code: string | null
          stage_label: string | null
          unit: string | null
          value_numeric: number | null
          value_usd_per_t_dm: number | null
          vs_stage0_pct: string | null
        }
        Insert: {
          direction?: string | null
          parameter?: string | null
          stage_code?: string | null
          stage_label?: string | null
          unit?: string | null
          value_numeric?: number | null
          value_usd_per_t_dm?: number | null
          vs_stage0_pct?: string | null
        }
        Update: {
          direction?: string | null
          parameter?: string | null
          stage_code?: string | null
          stage_label?: string | null
          unit?: string | null
          value_numeric?: number | null
          value_usd_per_t_dm?: number | null
          vs_stage0_pct?: string | null
        }
        Relationships: []
      }
      v_pke_value_progression: {
        Row: {
          om_quality_index: number | null
          stage_code: string | null
          stage_label: string | null
          total_value_usd: number | null
          uplift_vs_prev_stage: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      agronomic_fate:
        | "MULCHED_IN_FIELD"
        | "ROW_INTERROW_COMPOSTING"
        | "WINDROW_COMPOSTING_PAD"
        | "INCORPORATED_INTO_SOIL"
        | "OTHER_STRUCTURED_PROGRAM"
      baseline_treatment_type: "DISCARDED_AS_WASTE" | "AGRONOMIC_MANAGEMENT"
      discard_fate:
        | "UNMANAGED_SHALLOW_PILE_LT3M"
        | "UNMANAGED_DEEP_PILE_GE5M"
        | "DUMPED_FIELD_SCATTERED"
        | "OPEN_BURNING"
        | "TO_PONDS"
      project_fate:
        | "CFI_BSF"
        | "CFI_COMPOST"
        | "CFI_BSF_PLUS_COMPOST"
        | "CFI_COVERED_LAGOON_FLARE"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      agronomic_fate: [
        "MULCHED_IN_FIELD",
        "ROW_INTERROW_COMPOSTING",
        "WINDROW_COMPOSTING_PAD",
        "INCORPORATED_INTO_SOIL",
        "OTHER_STRUCTURED_PROGRAM",
      ],
      baseline_treatment_type: ["DISCARDED_AS_WASTE", "AGRONOMIC_MANAGEMENT"],
      discard_fate: [
        "UNMANAGED_SHALLOW_PILE_LT3M",
        "UNMANAGED_DEEP_PILE_GE5M",
        "DUMPED_FIELD_SCATTERED",
        "OPEN_BURNING",
        "TO_PONDS",
      ],
      project_fate: [
        "CFI_BSF",
        "CFI_COMPOST",
        "CFI_BSF_PLUS_COMPOST",
        "CFI_COVERED_LAGOON_FLARE",
      ],
    },
  },
} as const
