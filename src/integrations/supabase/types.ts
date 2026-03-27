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
      biological_consortium_validation: {
        Row: {
          benefits_detailed: Json | null
          benefits_summary: string | null
          bsf_ivdmd_uplift_pct: number | null
          bsf_safe: boolean | null
          bsf_safety_notes: string | null
          confidence_level: string | null
          conflicts: string | null
          cp_uplift_pct: number | null
          created_at: string | null
          hard_gates: string | null
          id: number
          lignin_reduction_pct: number | null
          must_pair_with: string[] | null
          n_benefit_kg_per_t_dm: number | null
          organism_id: number | null
          organism_name: string
          p_benefit_pct_uplift: number | null
          synergies_with: string[] | null
          timing_rules: string | null
          updated_at: string | null
          validated_by: string | null
          validation_date: string | null
          wave_assignment: string
        }
        Insert: {
          benefits_detailed?: Json | null
          benefits_summary?: string | null
          bsf_ivdmd_uplift_pct?: number | null
          bsf_safe?: boolean | null
          bsf_safety_notes?: string | null
          confidence_level?: string | null
          conflicts?: string | null
          cp_uplift_pct?: number | null
          created_at?: string | null
          hard_gates?: string | null
          id?: number
          lignin_reduction_pct?: number | null
          must_pair_with?: string[] | null
          n_benefit_kg_per_t_dm?: number | null
          organism_id?: number | null
          organism_name: string
          p_benefit_pct_uplift?: number | null
          synergies_with?: string[] | null
          timing_rules?: string | null
          updated_at?: string | null
          validated_by?: string | null
          validation_date?: string | null
          wave_assignment: string
        }
        Update: {
          benefits_detailed?: Json | null
          benefits_summary?: string | null
          bsf_ivdmd_uplift_pct?: number | null
          bsf_safe?: boolean | null
          bsf_safety_notes?: string | null
          confidence_level?: string | null
          conflicts?: string | null
          cp_uplift_pct?: number | null
          created_at?: string | null
          hard_gates?: string | null
          id?: number
          lignin_reduction_pct?: number | null
          must_pair_with?: string[] | null
          n_benefit_kg_per_t_dm?: number | null
          organism_id?: number | null
          organism_name?: string
          p_benefit_pct_uplift?: number | null
          synergies_with?: string[] | null
          timing_rules?: string | null
          updated_at?: string | null
          validated_by?: string | null
          validation_date?: string | null
          wave_assignment?: string
        }
        Relationships: [
          {
            foreignKeyName: "biological_consortium_validation_organism_id_fkey"
            columns: ["organism_id"]
            isOneToOne: false
            referencedRelation: "biological_library"
            referencedColumns: ["id"]
          },
        ]
      }
      biological_library: {
        Row: {
          activity_day_end: number | null
          activity_day_peak: number | null
          activity_day_start: number | null
          bsf_introduction_gate: string | null
          bsf_meal_cp: string | null
          bsf_safe: boolean | null
          bsf_score: number | null
          category: string | null
          cellulose_degradation: boolean | null
          cfi_category: string | null
          common_name: string | null
          conflict_with: string[] | null
          cost_high_usd: number | null
          cost_low_usd: number | null
          cost_per_tonne_fw: number | null
          cp_score: number | null
          cp_uplift_pct: string | null
          dose_cfu_per_g: string | null
          dose_high_pct: number | null
          dose_low_pct: number | null
          dose_pct_dm: number | null
          form: string | null
          guardrail_flag: string | null
          guardrail_note: string | null
          how_it_works: string | null
          icbb_code: string | null
          id: number
          industry_id: number | null
          is_conditional: boolean | null
          last_updated: string | null
          lignin_degradation: boolean | null
          lignin_reduction_pct: string | null
          lignin_score: number | null
          lock_class: string | null
          n_added_kg_t: string | null
          n_fixation: boolean | null
          n_fixer_score: number | null
          nine_org: boolean | null
          notes: string | null
          one_nine_score: number | null
          one_shot: boolean | null
          optimal_ph_high: number | null
          optimal_ph_low: number | null
          optimal_temp_c_high: number | null
          optimal_temp_c_low: number | null
          organism_name: string
          outcomes: string | null
          p_effect: string | null
          p_releaser_score: number | null
          p_solubilisation: boolean | null
          price_usd_per_kg: number | null
          primary_function: string | null
          recommended: boolean | null
          short_name: string | null
          source_references: string | null
          stage_compatibility: string[] | null
          strain_code: string | null
          supplier_idn: string | null
          timing_notes: string | null
          warnings: string | null
          wave: string | null
          wave_assignment: string | null
          wave_note: string | null
          what_it_does: string | null
        }
        Insert: {
          activity_day_end?: number | null
          activity_day_peak?: number | null
          activity_day_start?: number | null
          bsf_introduction_gate?: string | null
          bsf_meal_cp?: string | null
          bsf_safe?: boolean | null
          bsf_score?: number | null
          category?: string | null
          cellulose_degradation?: boolean | null
          cfi_category?: string | null
          common_name?: string | null
          conflict_with?: string[] | null
          cost_high_usd?: number | null
          cost_low_usd?: number | null
          cost_per_tonne_fw?: number | null
          cp_score?: number | null
          cp_uplift_pct?: string | null
          dose_cfu_per_g?: string | null
          dose_high_pct?: number | null
          dose_low_pct?: number | null
          dose_pct_dm?: number | null
          form?: string | null
          guardrail_flag?: string | null
          guardrail_note?: string | null
          how_it_works?: string | null
          icbb_code?: string | null
          id?: number
          industry_id?: number | null
          is_conditional?: boolean | null
          last_updated?: string | null
          lignin_degradation?: boolean | null
          lignin_reduction_pct?: string | null
          lignin_score?: number | null
          lock_class?: string | null
          n_added_kg_t?: string | null
          n_fixation?: boolean | null
          n_fixer_score?: number | null
          nine_org?: boolean | null
          notes?: string | null
          one_nine_score?: number | null
          one_shot?: boolean | null
          optimal_ph_high?: number | null
          optimal_ph_low?: number | null
          optimal_temp_c_high?: number | null
          optimal_temp_c_low?: number | null
          organism_name: string
          outcomes?: string | null
          p_effect?: string | null
          p_releaser_score?: number | null
          p_solubilisation?: boolean | null
          price_usd_per_kg?: number | null
          primary_function?: string | null
          recommended?: boolean | null
          short_name?: string | null
          source_references?: string | null
          stage_compatibility?: string[] | null
          strain_code?: string | null
          supplier_idn?: string | null
          timing_notes?: string | null
          warnings?: string | null
          wave?: string | null
          wave_assignment?: string | null
          wave_note?: string | null
          what_it_does?: string | null
        }
        Update: {
          activity_day_end?: number | null
          activity_day_peak?: number | null
          activity_day_start?: number | null
          bsf_introduction_gate?: string | null
          bsf_meal_cp?: string | null
          bsf_safe?: boolean | null
          bsf_score?: number | null
          category?: string | null
          cellulose_degradation?: boolean | null
          cfi_category?: string | null
          common_name?: string | null
          conflict_with?: string[] | null
          cost_high_usd?: number | null
          cost_low_usd?: number | null
          cost_per_tonne_fw?: number | null
          cp_score?: number | null
          cp_uplift_pct?: string | null
          dose_cfu_per_g?: string | null
          dose_high_pct?: number | null
          dose_low_pct?: number | null
          dose_pct_dm?: number | null
          form?: string | null
          guardrail_flag?: string | null
          guardrail_note?: string | null
          how_it_works?: string | null
          icbb_code?: string | null
          id?: number
          industry_id?: number | null
          is_conditional?: boolean | null
          last_updated?: string | null
          lignin_degradation?: boolean | null
          lignin_reduction_pct?: string | null
          lignin_score?: number | null
          lock_class?: string | null
          n_added_kg_t?: string | null
          n_fixation?: boolean | null
          n_fixer_score?: number | null
          nine_org?: boolean | null
          notes?: string | null
          one_nine_score?: number | null
          one_shot?: boolean | null
          optimal_ph_high?: number | null
          optimal_ph_low?: number | null
          optimal_temp_c_high?: number | null
          optimal_temp_c_low?: number | null
          organism_name?: string
          outcomes?: string | null
          p_effect?: string | null
          p_releaser_score?: number | null
          p_solubilisation?: boolean | null
          price_usd_per_kg?: number | null
          primary_function?: string | null
          recommended?: boolean | null
          short_name?: string | null
          source_references?: string | null
          stage_compatibility?: string[] | null
          strain_code?: string | null
          supplier_idn?: string | null
          timing_notes?: string | null
          warnings?: string | null
          wave?: string | null
          wave_assignment?: string | null
          wave_note?: string | null
          what_it_does?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "biological_library_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "cfi_industries"
            referencedColumns: ["industry_id"]
          },
          {
            foreignKeyName: "biological_library_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "v_industry_switcher"
            referencedColumns: ["industry_id"]
          },
        ]
      }
      canonical_lab_data: {
        Row: {
          authority_score: number | null
          basis: string | null
          confidence_level: string | null
          created_by: string | null
          guardrail_note: string | null
          id: number
          industry_id: number | null
          is_ai_generated: boolean | null
          is_approved: boolean | null
          is_locked: boolean | null
          lock_class: string | null
          locked_by: string | null
          locked_date: string | null
          method_code: string | null
          method_standard: string | null
          parameter: string
          research_intensity: string | null
          source_count: number | null
          source_ref: string | null
          stream: string
          unit: string | null
          value_numeric: number | null
          value_text: string | null
          verified_by: string | null
          verified_date: string | null
        }
        Insert: {
          authority_score?: number | null
          basis?: string | null
          confidence_level?: string | null
          created_by?: string | null
          guardrail_note?: string | null
          id?: number
          industry_id?: number | null
          is_ai_generated?: boolean | null
          is_approved?: boolean | null
          is_locked?: boolean | null
          lock_class?: string | null
          locked_by?: string | null
          locked_date?: string | null
          method_code?: string | null
          method_standard?: string | null
          parameter: string
          research_intensity?: string | null
          source_count?: number | null
          source_ref?: string | null
          stream: string
          unit?: string | null
          value_numeric?: number | null
          value_text?: string | null
          verified_by?: string | null
          verified_date?: string | null
        }
        Update: {
          authority_score?: number | null
          basis?: string | null
          confidence_level?: string | null
          created_by?: string | null
          guardrail_note?: string | null
          id?: number
          industry_id?: number | null
          is_ai_generated?: boolean | null
          is_approved?: boolean | null
          is_locked?: boolean | null
          lock_class?: string | null
          locked_by?: string | null
          locked_date?: string | null
          method_code?: string | null
          method_standard?: string | null
          parameter?: string
          research_intensity?: string | null
          source_count?: number | null
          source_ref?: string | null
          stream?: string
          unit?: string | null
          value_numeric?: number | null
          value_text?: string | null
          verified_by?: string | null
          verified_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "canonical_lab_data_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "cfi_industries"
            referencedColumns: ["industry_id"]
          },
          {
            foreignKeyName: "canonical_lab_data_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "v_industry_switcher"
            referencedColumns: ["industry_id"]
          },
        ]
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
      cfi_access_codes: {
        Row: {
          code: string
          created_at: string | null
          expires_at: string | null
          id: number
          issued_to: string | null
          max_uses: number | null
          module: string
          used_count: number | null
        }
        Insert: {
          code: string
          created_at?: string | null
          expires_at?: string | null
          id?: number
          issued_to?: string | null
          max_uses?: number | null
          module: string
          used_count?: number | null
        }
        Update: {
          code?: string
          created_at?: string | null
          expires_at?: string | null
          id?: number
          issued_to?: string | null
          max_uses?: number | null
          module?: string
          used_count?: number | null
        }
        Relationships: []
      }
      cfi_access_rules: {
        Row: {
          can_edit: boolean
          can_export: boolean
          can_view: boolean
          created_at: string | null
          id: number
          is_enforced: boolean
          module_key: string
          module_label: string | null
          notes: string | null
          role_code: string
          updated_at: string | null
        }
        Insert: {
          can_edit?: boolean
          can_export?: boolean
          can_view?: boolean
          created_at?: string | null
          id?: number
          is_enforced?: boolean
          module_key: string
          module_label?: string | null
          notes?: string | null
          role_code: string
          updated_at?: string | null
        }
        Update: {
          can_edit?: boolean
          can_export?: boolean
          can_view?: boolean
          created_at?: string | null
          id?: number
          is_enforced?: boolean
          module_key?: string
          module_label?: string | null
          notes?: string | null
          role_code?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      cfi_agent8_queue: {
        Row: {
          agent_notes: string | null
          analytical_method: string | null
          assigned_run: string | null
          confidence: string | null
          created_at: string | null
          id: number
          industry_id: number
          parameter: string
          parameter_category: string | null
          source_ref: string | null
          status: string
          stream_code: string
          unit: string | null
          updated_at: string | null
          value_numeric: number | null
        }
        Insert: {
          agent_notes?: string | null
          analytical_method?: string | null
          assigned_run?: string | null
          confidence?: string | null
          created_at?: string | null
          id?: number
          industry_id: number
          parameter: string
          parameter_category?: string | null
          source_ref?: string | null
          status?: string
          stream_code: string
          unit?: string | null
          updated_at?: string | null
          value_numeric?: number | null
        }
        Update: {
          agent_notes?: string | null
          analytical_method?: string | null
          assigned_run?: string | null
          confidence?: string | null
          created_at?: string | null
          id?: number
          industry_id?: number
          parameter?: string
          parameter_category?: string | null
          source_ref?: string | null
          status?: string
          stream_code?: string
          unit?: string | null
          updated_at?: string | null
          value_numeric?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "cfi_agent8_queue_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "cfi_industries"
            referencedColumns: ["industry_id"]
          },
          {
            foreignKeyName: "cfi_agent8_queue_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "v_industry_switcher"
            referencedColumns: ["industry_id"]
          },
        ]
      }
      cfi_agro_residues: {
        Row: {
          annual_waste_mt_m: number | null
          bsf_eligible: boolean | null
          bsf_score: number | null
          bsf_score_notes: string | null
          carbon_credit_pathway: string | null
          cfi_target_priority: string | null
          created_at: string | null
          crop_name: string
          industry_id: number | null
          key_companies: string | null
          key_producing_countries: string | null
          methane_risk: string | null
          moisture_pct_wb: number | null
          notes: string | null
          pretreatment_required: string | null
          primary_disposal: string | null
          primary_nutrients: string | null
          residue_abbr: string | null
          residue_category: string | null
          residue_id: number
          residue_name: string
          source_ref: string | null
          waste_pct_of_crop: number | null
        }
        Insert: {
          annual_waste_mt_m?: number | null
          bsf_eligible?: boolean | null
          bsf_score?: number | null
          bsf_score_notes?: string | null
          carbon_credit_pathway?: string | null
          cfi_target_priority?: string | null
          created_at?: string | null
          crop_name: string
          industry_id?: number | null
          key_companies?: string | null
          key_producing_countries?: string | null
          methane_risk?: string | null
          moisture_pct_wb?: number | null
          notes?: string | null
          pretreatment_required?: string | null
          primary_disposal?: string | null
          primary_nutrients?: string | null
          residue_abbr?: string | null
          residue_category?: string | null
          residue_id?: number
          residue_name: string
          source_ref?: string | null
          waste_pct_of_crop?: number | null
        }
        Update: {
          annual_waste_mt_m?: number | null
          bsf_eligible?: boolean | null
          bsf_score?: number | null
          bsf_score_notes?: string | null
          carbon_credit_pathway?: string | null
          cfi_target_priority?: string | null
          created_at?: string | null
          crop_name?: string
          industry_id?: number | null
          key_companies?: string | null
          key_producing_countries?: string | null
          methane_risk?: string | null
          moisture_pct_wb?: number | null
          notes?: string | null
          pretreatment_required?: string | null
          primary_disposal?: string | null
          primary_nutrients?: string | null
          residue_abbr?: string | null
          residue_category?: string | null
          residue_id?: number
          residue_name?: string
          source_ref?: string | null
          waste_pct_of_crop?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "cfi_agro_residues_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "cfi_industries"
            referencedColumns: ["industry_id"]
          },
          {
            foreignKeyName: "cfi_agro_residues_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "v_industry_switcher"
            referencedColumns: ["industry_id"]
          },
        ]
      }
      cfi_build_deploy: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id: string
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
        }
        Relationships: []
      }
      cfi_building_capex: {
        Row: {
          created_at: string | null
          display_rate: string | null
          flag: string | null
          id: number
          indo_market_note: string | null
          indo_rate_usd: number | null
          indo_total_usd: number | null
          item_description: string
          pkg: string
          premium_pct: number | null
          qty: number | null
          saving_usd: number | null
          source_file: string | null
          unit: string | null
          western_rate_usd: number | null
          western_total_usd: number | null
        }
        Insert: {
          created_at?: string | null
          display_rate?: string | null
          flag?: string | null
          id?: number
          indo_market_note?: string | null
          indo_rate_usd?: number | null
          indo_total_usd?: number | null
          item_description: string
          pkg: string
          premium_pct?: number | null
          qty?: number | null
          saving_usd?: number | null
          source_file?: string | null
          unit?: string | null
          western_rate_usd?: number | null
          western_total_usd?: number | null
        }
        Update: {
          created_at?: string | null
          display_rate?: string | null
          flag?: string | null
          id?: number
          indo_market_note?: string | null
          indo_rate_usd?: number | null
          indo_total_usd?: number | null
          item_description?: string
          pkg?: string
          premium_pct?: number | null
          qty?: number | null
          saving_usd?: number | null
          source_file?: string | null
          unit?: string | null
          western_rate_usd?: number | null
          western_total_usd?: number | null
        }
        Relationships: []
      }
      cfi_chemical_treatments: {
        Row: {
          best_bsf_rank: number | null
          best_compost_rank: number | null
          best_value_rank: number | null
          bsf_safe: boolean
          bsf_viability_score: number | null
          cellulose_access_pct_max: number | null
          cellulose_access_pct_min: number | null
          cost_max_usd_per_t: number | null
          cost_min_usd_per_t: number | null
          created_at: string | null
          dose_max_kg_per_t: number | null
          dose_min_kg_per_t: number | null
          dose_unit: string | null
          efb_ph_effect: string | null
          fatal_risk: boolean | null
          final_ph_max: number | null
          final_ph_min: number | null
          hemicellulose_effect: string | null
          lignin_reduction_pct_max: number | null
          lignin_reduction_pct_min: number | null
          literature_source: string | null
          mechanism: string | null
          microbe_safe: boolean
          microbial_viability_score: number | null
          neutralisation_agent: string | null
          neutralisation_cost_max_usd: number | null
          neutralisation_cost_min_usd: number | null
          neutralisation_days: number | null
          neutralisation_required: boolean
          notes: string | null
          opdc_ph_effect: string | null
          overall_rank: number | null
          pathway_a_compost_score: number | null
          pathway_b_bsf_score: number | null
          rspo_concern: string | null
          rspo_status: string
          treatment_id: number
          treatment_name: string
          type_group: string
          updated_at: string | null
        }
        Insert: {
          best_bsf_rank?: number | null
          best_compost_rank?: number | null
          best_value_rank?: number | null
          bsf_safe: boolean
          bsf_viability_score?: number | null
          cellulose_access_pct_max?: number | null
          cellulose_access_pct_min?: number | null
          cost_max_usd_per_t?: number | null
          cost_min_usd_per_t?: number | null
          created_at?: string | null
          dose_max_kg_per_t?: number | null
          dose_min_kg_per_t?: number | null
          dose_unit?: string | null
          efb_ph_effect?: string | null
          fatal_risk?: boolean | null
          final_ph_max?: number | null
          final_ph_min?: number | null
          hemicellulose_effect?: string | null
          lignin_reduction_pct_max?: number | null
          lignin_reduction_pct_min?: number | null
          literature_source?: string | null
          mechanism?: string | null
          microbe_safe: boolean
          microbial_viability_score?: number | null
          neutralisation_agent?: string | null
          neutralisation_cost_max_usd?: number | null
          neutralisation_cost_min_usd?: number | null
          neutralisation_days?: number | null
          neutralisation_required?: boolean
          notes?: string | null
          opdc_ph_effect?: string | null
          overall_rank?: number | null
          pathway_a_compost_score?: number | null
          pathway_b_bsf_score?: number | null
          rspo_concern?: string | null
          rspo_status: string
          treatment_id?: number
          treatment_name: string
          type_group: string
          updated_at?: string | null
        }
        Update: {
          best_bsf_rank?: number | null
          best_compost_rank?: number | null
          best_value_rank?: number | null
          bsf_safe?: boolean
          bsf_viability_score?: number | null
          cellulose_access_pct_max?: number | null
          cellulose_access_pct_min?: number | null
          cost_max_usd_per_t?: number | null
          cost_min_usd_per_t?: number | null
          created_at?: string | null
          dose_max_kg_per_t?: number | null
          dose_min_kg_per_t?: number | null
          dose_unit?: string | null
          efb_ph_effect?: string | null
          fatal_risk?: boolean | null
          final_ph_max?: number | null
          final_ph_min?: number | null
          hemicellulose_effect?: string | null
          lignin_reduction_pct_max?: number | null
          lignin_reduction_pct_min?: number | null
          literature_source?: string | null
          mechanism?: string | null
          microbe_safe?: boolean
          microbial_viability_score?: number | null
          neutralisation_agent?: string | null
          neutralisation_cost_max_usd?: number | null
          neutralisation_cost_min_usd?: number | null
          neutralisation_days?: number | null
          neutralisation_required?: boolean
          notes?: string | null
          opdc_ph_effect?: string | null
          overall_rank?: number | null
          pathway_a_compost_score?: number | null
          pathway_b_bsf_score?: number | null
          rspo_concern?: string | null
          rspo_status?: string
          treatment_id?: number
          treatment_name?: string
          type_group?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      cfi_company_config: {
        Row: {
          config_key: string
          config_value: string
          description: string | null
          last_updated: string | null
          locked: boolean | null
        }
        Insert: {
          config_key: string
          config_value: string
          description?: string | null
          last_updated?: string | null
          locked?: boolean | null
        }
        Update: {
          config_key?: string
          config_value?: string
          description?: string | null
          last_updated?: string | null
          locked?: boolean | null
        }
        Relationships: []
      }
      cfi_consumer_brands: {
        Row: {
          annual_waste_t: number | null
          brand_id: number
          bsf_substrate_eligible: boolean | null
          cfi_target_priority: string | null
          co2eq_t_yr: number | null
          company_name: string
          created_at: string | null
          key_locations: string | null
          methane_t_yr: number | null
          notes: string | null
          source_ref: string | null
          sustainability_budget_m_usd: string | null
          waste_type: string | null
        }
        Insert: {
          annual_waste_t?: number | null
          brand_id?: number
          bsf_substrate_eligible?: boolean | null
          cfi_target_priority?: string | null
          co2eq_t_yr?: number | null
          company_name: string
          created_at?: string | null
          key_locations?: string | null
          methane_t_yr?: number | null
          notes?: string | null
          source_ref?: string | null
          sustainability_budget_m_usd?: string | null
          waste_type?: string | null
        }
        Update: {
          annual_waste_t?: number | null
          brand_id?: number
          bsf_substrate_eligible?: boolean | null
          cfi_target_priority?: string | null
          co2eq_t_yr?: number | null
          company_name?: string
          created_at?: string | null
          key_locations?: string | null
          methane_t_yr?: number | null
          notes?: string | null
          source_ref?: string | null
          sustainability_budget_m_usd?: string | null
          waste_type?: string | null
        }
        Relationships: []
      }
      cfi_crop_intelligence: {
        Row: {
          ag_inputs_vol_m3_m: number | null
          annual_methane_t_m: number | null
          annual_production_mt_m: number | null
          annual_waste_mt_m: number | null
          co2eq_t_m: number | null
          created_at: string | null
          crop_id: number
          crop_name: string
          industry_id: number | null
          notes: string | null
          source_ref: string | null
          waste_pct: number | null
          waste_type: string | null
        }
        Insert: {
          ag_inputs_vol_m3_m?: number | null
          annual_methane_t_m?: number | null
          annual_production_mt_m?: number | null
          annual_waste_mt_m?: number | null
          co2eq_t_m?: number | null
          created_at?: string | null
          crop_id?: number
          crop_name: string
          industry_id?: number | null
          notes?: string | null
          source_ref?: string | null
          waste_pct?: number | null
          waste_type?: string | null
        }
        Update: {
          ag_inputs_vol_m3_m?: number | null
          annual_methane_t_m?: number | null
          annual_production_mt_m?: number | null
          annual_waste_mt_m?: number | null
          co2eq_t_m?: number | null
          created_at?: string | null
          crop_id?: number
          crop_name?: string
          industry_id?: number | null
          notes?: string | null
          source_ref?: string | null
          waste_pct?: number | null
          waste_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cfi_crop_intelligence_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "cfi_industries"
            referencedColumns: ["industry_id"]
          },
          {
            foreignKeyName: "cfi_crop_intelligence_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "v_industry_switcher"
            referencedColumns: ["industry_id"]
          },
        ]
      }
      cfi_electricity_opex: {
        Row: {
          cost_idr_per_month: number | null
          cost_usd_per_month: number | null
          cost_usd_per_year: number | null
          created_at: string | null
          data_status: string | null
          id: number
          kwh_per_month: number | null
          kwh_per_year: number | null
          notes: string | null
          operating_days_yr: number | null
          pln_tariff_idr_kwh: number | null
          source_file: string | null
          stage_code: string
          stage_name: string
          usd_idr_rate: number | null
          usd_kwh_rate: number | null
        }
        Insert: {
          cost_idr_per_month?: number | null
          cost_usd_per_month?: number | null
          cost_usd_per_year?: number | null
          created_at?: string | null
          data_status?: string | null
          id?: number
          kwh_per_month?: number | null
          kwh_per_year?: number | null
          notes?: string | null
          operating_days_yr?: number | null
          pln_tariff_idr_kwh?: number | null
          source_file?: string | null
          stage_code: string
          stage_name: string
          usd_idr_rate?: number | null
          usd_kwh_rate?: number | null
        }
        Update: {
          cost_idr_per_month?: number | null
          cost_usd_per_month?: number | null
          cost_usd_per_year?: number | null
          created_at?: string | null
          data_status?: string | null
          id?: number
          kwh_per_month?: number | null
          kwh_per_year?: number | null
          notes?: string | null
          operating_days_yr?: number | null
          pln_tariff_idr_kwh?: number | null
          source_file?: string | null
          stage_code?: string
          stage_name?: string
          usd_idr_rate?: number | null
          usd_kwh_rate?: number | null
        }
        Relationships: []
      }
      cfi_engineering_documents: {
        Row: {
          created_at: string | null
          created_by: string | null
          document_code: string
          document_title: string
          document_type: string
          file_format: string | null
          file_path: string | null
          file_size_kb: number | null
          id: number
          industry_id: number | null
          is_confidential: boolean | null
          is_published: boolean | null
          keywords: string[] | null
          page_count: number | null
          published_date: string | null
          stage: string | null
          stream: string | null
          summary: string | null
          updated_at: string | null
          version: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          document_code: string
          document_title: string
          document_type: string
          file_format?: string | null
          file_path?: string | null
          file_size_kb?: number | null
          id?: number
          industry_id?: number | null
          is_confidential?: boolean | null
          is_published?: boolean | null
          keywords?: string[] | null
          page_count?: number | null
          published_date?: string | null
          stage?: string | null
          stream?: string | null
          summary?: string | null
          updated_at?: string | null
          version: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          document_code?: string
          document_title?: string
          document_type?: string
          file_format?: string | null
          file_path?: string | null
          file_size_kb?: number | null
          id?: number
          industry_id?: number | null
          is_confidential?: boolean | null
          is_published?: boolean | null
          keywords?: string[] | null
          page_count?: number | null
          published_date?: string | null
          stage?: string | null
          stream?: string | null
          summary?: string | null
          updated_at?: string | null
          version?: string
        }
        Relationships: []
      }
      cfi_equipment_capex_epc: {
        Row: {
          ai_tag: string | null
          area: string | null
          contact: string | null
          created_at: string | null
          description: string | null
          equipment_name: string
          id: number
          indonesian_supplier: string | null
          line: string | null
          qty: number | null
          rfq_range_high_usd: number | null
          rfq_range_low_usd: number | null
          rfq_required: boolean | null
          source_file: string | null
          stage: string | null
          tag: string
          total_cost_usd: number | null
          unit_cost_usd: number | null
        }
        Insert: {
          ai_tag?: string | null
          area?: string | null
          contact?: string | null
          created_at?: string | null
          description?: string | null
          equipment_name: string
          id?: number
          indonesian_supplier?: string | null
          line?: string | null
          qty?: number | null
          rfq_range_high_usd?: number | null
          rfq_range_low_usd?: number | null
          rfq_required?: boolean | null
          source_file?: string | null
          stage?: string | null
          tag: string
          total_cost_usd?: number | null
          unit_cost_usd?: number | null
        }
        Update: {
          ai_tag?: string | null
          area?: string | null
          contact?: string | null
          created_at?: string | null
          description?: string | null
          equipment_name?: string
          id?: number
          indonesian_supplier?: string | null
          line?: string | null
          qty?: number | null
          rfq_range_high_usd?: number | null
          rfq_range_low_usd?: number | null
          rfq_required?: boolean | null
          source_file?: string | null
          stage?: string | null
          tag?: string
          total_cost_usd?: number | null
          unit_cost_usd?: number | null
        }
        Relationships: []
      }
      cfi_estates: {
        Row: {
          area_ha: number | null
          cfi_notes: string | null
          created_at: string | null
          data_confidence: string | null
          district_kabupaten: string | null
          estate_name: string
          id: string
          industry_id: number | null
          latitude: number | null
          longitude: number | null
          owner_company: string
          owner_id: string | null
          palm_age_range: string | null
          province: string | null
          rspo_certified: string | null
          source_url: string | null
          updated_at: string | null
        }
        Insert: {
          area_ha?: number | null
          cfi_notes?: string | null
          created_at?: string | null
          data_confidence?: string | null
          district_kabupaten?: string | null
          estate_name: string
          id?: string
          industry_id?: number | null
          latitude?: number | null
          longitude?: number | null
          owner_company: string
          owner_id?: string | null
          palm_age_range?: string | null
          province?: string | null
          rspo_certified?: string | null
          source_url?: string | null
          updated_at?: string | null
        }
        Update: {
          area_ha?: number | null
          cfi_notes?: string | null
          created_at?: string | null
          data_confidence?: string | null
          district_kabupaten?: string | null
          estate_name?: string
          id?: string
          industry_id?: number | null
          latitude?: number | null
          longitude?: number | null
          owner_company?: string
          owner_id?: string | null
          palm_age_range?: string | null
          province?: string | null
          rspo_certified?: string | null
          source_url?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cfi_estates_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "cfi_industries"
            referencedColumns: ["industry_id"]
          },
          {
            foreignKeyName: "cfi_estates_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "v_industry_switcher"
            referencedColumns: ["industry_id"]
          },
          {
            foreignKeyName: "cfi_estates_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "cfi_mill_owners"
            referencedColumns: ["id"]
          },
        ]
      }
      cfi_fb_companies: {
        Row: {
          annual_ag_waste_t: number | null
          annual_methane_t: number | null
          annual_revenue_b_usd: number | null
          cfi_opportunity: string | null
          cfi_tier: string | null
          co2eq_t_yr: number | null
          company_id: number
          company_name: string
          company_type: string | null
          created_at: string | null
          csrd_obligated: boolean | null
          eudr_obligated: boolean | null
          hq_country: string | null
          key_locations: string | null
          palm_volume_t_yr: number | null
          primary_waste_types: string | null
          sbti_committed: boolean | null
          sector: string | null
          source_ref: string | null
          sustainability_budget_m_usd: number | null
          sustainability_fund_name: string | null
        }
        Insert: {
          annual_ag_waste_t?: number | null
          annual_methane_t?: number | null
          annual_revenue_b_usd?: number | null
          cfi_opportunity?: string | null
          cfi_tier?: string | null
          co2eq_t_yr?: number | null
          company_id?: number
          company_name: string
          company_type?: string | null
          created_at?: string | null
          csrd_obligated?: boolean | null
          eudr_obligated?: boolean | null
          hq_country?: string | null
          key_locations?: string | null
          palm_volume_t_yr?: number | null
          primary_waste_types?: string | null
          sbti_committed?: boolean | null
          sector?: string | null
          source_ref?: string | null
          sustainability_budget_m_usd?: number | null
          sustainability_fund_name?: string | null
        }
        Update: {
          annual_ag_waste_t?: number | null
          annual_methane_t?: number | null
          annual_revenue_b_usd?: number | null
          cfi_opportunity?: string | null
          cfi_tier?: string | null
          co2eq_t_yr?: number | null
          company_id?: number
          company_name?: string
          company_type?: string | null
          created_at?: string | null
          csrd_obligated?: boolean | null
          eudr_obligated?: boolean | null
          hq_country?: string | null
          key_locations?: string | null
          palm_volume_t_yr?: number | null
          primary_waste_types?: string | null
          sbti_committed?: boolean | null
          sector?: string | null
          source_ref?: string | null
          sustainability_budget_m_usd?: number | null
          sustainability_fund_name?: string | null
        }
        Relationships: []
      }
      cfi_fb_company_crops: {
        Row: {
          annual_crop_volume_t: number | null
          annual_waste_t: number | null
          cfi_contact_angle: string | null
          cfi_insetting_potential: string | null
          company_name: string
          company_type: string | null
          created_at: string | null
          crop_input: string
          eudr_relevant: boolean | null
          hq_country: string | null
          id: number
          industry_id: number | null
          key_locations: string | null
          notes: string | null
          sbti_flag_committed: boolean | null
          scope3_cat1_tco2e_yr: number | null
          source_ref: string | null
          sustainability_budget_m_usd: number | null
          sustainability_programme: string | null
          waste_stream_codes: string | null
        }
        Insert: {
          annual_crop_volume_t?: number | null
          annual_waste_t?: number | null
          cfi_contact_angle?: string | null
          cfi_insetting_potential?: string | null
          company_name: string
          company_type?: string | null
          created_at?: string | null
          crop_input: string
          eudr_relevant?: boolean | null
          hq_country?: string | null
          id?: number
          industry_id?: number | null
          key_locations?: string | null
          notes?: string | null
          sbti_flag_committed?: boolean | null
          scope3_cat1_tco2e_yr?: number | null
          source_ref?: string | null
          sustainability_budget_m_usd?: number | null
          sustainability_programme?: string | null
          waste_stream_codes?: string | null
        }
        Update: {
          annual_crop_volume_t?: number | null
          annual_waste_t?: number | null
          cfi_contact_angle?: string | null
          cfi_insetting_potential?: string | null
          company_name?: string
          company_type?: string | null
          created_at?: string | null
          crop_input?: string
          eudr_relevant?: boolean | null
          hq_country?: string | null
          id?: number
          industry_id?: number | null
          key_locations?: string | null
          notes?: string | null
          sbti_flag_committed?: boolean | null
          scope3_cat1_tco2e_yr?: number | null
          source_ref?: string | null
          sustainability_budget_m_usd?: number | null
          sustainability_programme?: string | null
          waste_stream_codes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cfi_fb_company_crops_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "cfi_industries"
            referencedColumns: ["industry_id"]
          },
          {
            foreignKeyName: "cfi_fb_company_crops_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "v_industry_switcher"
            referencedColumns: ["industry_id"]
          },
        ]
      }
      cfi_feedstock_values: {
        Row: {
          basis: string | null
          confidence: string | null
          created_at: string | null
          guardrail_note: string | null
          id: number
          is_ai_generated: boolean | null
          is_approved: boolean | null
          is_canonical: boolean | null
          key: string
          last_updated: string | null
          source_ref: string | null
          stage_code: string
          stream: string
          unit: string | null
          value_numeric: number | null
          value_text: string | null
        }
        Insert: {
          basis?: string | null
          confidence?: string | null
          created_at?: string | null
          guardrail_note?: string | null
          id?: number
          is_ai_generated?: boolean | null
          is_approved?: boolean | null
          is_canonical?: boolean | null
          key: string
          last_updated?: string | null
          source_ref?: string | null
          stage_code?: string
          stream: string
          unit?: string | null
          value_numeric?: number | null
          value_text?: string | null
        }
        Update: {
          basis?: string | null
          confidence?: string | null
          created_at?: string | null
          guardrail_note?: string | null
          id?: number
          is_ai_generated?: boolean | null
          is_approved?: boolean | null
          is_canonical?: boolean | null
          key?: string
          last_updated?: string | null
          source_ref?: string | null
          stage_code?: string
          stream?: string
          unit?: string | null
          value_numeric?: number | null
          value_text?: string | null
        }
        Relationships: []
      }
      cfi_feedstreams: {
        Row: {
          always_active: boolean | null
          conversion_basis: string | null
          conversion_factor: number | null
          created_at: string | null
          feedstream_id: number
          industry_id: number
          is_liquid: boolean | null
          is_placeholder: boolean | null
          is_seasonal: boolean | null
          mc_default: number | null
          mc_floor: number | null
          sort_order: number | null
          stream_abbr: string
          stream_code: string
          stream_description: string | null
          stream_label: string
          zero_cost: boolean | null
        }
        Insert: {
          always_active?: boolean | null
          conversion_basis?: string | null
          conversion_factor?: number | null
          created_at?: string | null
          feedstream_id?: number
          industry_id: number
          is_liquid?: boolean | null
          is_placeholder?: boolean | null
          is_seasonal?: boolean | null
          mc_default?: number | null
          mc_floor?: number | null
          sort_order?: number | null
          stream_abbr: string
          stream_code: string
          stream_description?: string | null
          stream_label: string
          zero_cost?: boolean | null
        }
        Update: {
          always_active?: boolean | null
          conversion_basis?: string | null
          conversion_factor?: number | null
          created_at?: string | null
          feedstream_id?: number
          industry_id?: number
          is_liquid?: boolean | null
          is_placeholder?: boolean | null
          is_seasonal?: boolean | null
          mc_default?: number | null
          mc_floor?: number | null
          sort_order?: number | null
          stream_abbr?: string
          stream_code?: string
          stream_description?: string | null
          stream_label?: string
          zero_cost?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "cfi_feedstreams_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "cfi_industries"
            referencedColumns: ["industry_id"]
          },
          {
            foreignKeyName: "cfi_feedstreams_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "v_industry_switcher"
            referencedColumns: ["industry_id"]
          },
        ]
      }
      cfi_fertiliser_prices: {
        Row: {
          display_name: string
          notes: string | null
          nutrient_id: string
          price_date: string | null
          price_usd_per_tonne: number
          source: string | null
          updated_at: string | null
        }
        Insert: {
          display_name: string
          notes?: string | null
          nutrient_id: string
          price_date?: string | null
          price_usd_per_tonne: number
          source?: string | null
          updated_at?: string | null
        }
        Update: {
          display_name?: string
          notes?: string | null
          nutrient_id?: string
          price_date?: string | null
          price_usd_per_tonne?: number
          source?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      cfi_gps_submissions: {
        Row: {
          created_at: string | null
          id: string
          mill_id: string | null
          mill_name: string
          notes: string | null
          submission_source: string | null
          submitted_by_user: string | null
          submitted_district: string | null
          submitted_latitude: number
          submitted_longitude: number
          verified: boolean | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          mill_id?: string | null
          mill_name: string
          notes?: string | null
          submission_source?: string | null
          submitted_by_user?: string | null
          submitted_district?: string | null
          submitted_latitude: number
          submitted_longitude: number
          verified?: boolean | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          mill_id?: string | null
          mill_name?: string
          notes?: string | null
          submission_source?: string | null
          submitted_by_user?: string | null
          submitted_district?: string | null
          submitted_latitude?: number
          submitted_longitude?: number
          verified?: boolean | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cfi_gps_submissions_mill_id_fkey"
            columns: ["mill_id"]
            isOneToOne: false
            referencedRelation: "cfi_mills_60tph"
            referencedColumns: ["id"]
          },
        ]
      }
      cfi_greenhouse_design: {
        Row: {
          brace_spec: string | null
          cladding_type: string | null
          created_at: string | null
          foundation_depth_mm: number | null
          foundation_type: string | null
          height_mm: number | null
          id: number
          length_mm: number | null
          main_pole_spec: string | null
          notes: string | null
          purlin_spec: string | null
          quantity: number | null
          slab_spec: string | null
          source_slide: number | null
          structure_code: string
          structure_name: string
          width_mm: number | null
        }
        Insert: {
          brace_spec?: string | null
          cladding_type?: string | null
          created_at?: string | null
          foundation_depth_mm?: number | null
          foundation_type?: string | null
          height_mm?: number | null
          id?: number
          length_mm?: number | null
          main_pole_spec?: string | null
          notes?: string | null
          purlin_spec?: string | null
          quantity?: number | null
          slab_spec?: string | null
          source_slide?: number | null
          structure_code: string
          structure_name: string
          width_mm?: number | null
        }
        Update: {
          brace_spec?: string | null
          cladding_type?: string | null
          created_at?: string | null
          foundation_depth_mm?: number | null
          foundation_type?: string | null
          height_mm?: number | null
          id?: number
          length_mm?: number | null
          main_pole_spec?: string | null
          notes?: string | null
          purlin_spec?: string | null
          quantity?: number | null
          slab_spec?: string | null
          source_slide?: number | null
          structure_code?: string
          structure_name?: string
          width_mm?: number | null
        }
        Relationships: []
      }
      cfi_greenhouse_site: {
        Row: {
          access_road_width_mm: number | null
          created_at: string | null
          gh_layout: string | null
          gh_spacing_mm: number | null
          id: number
          main_access_road: string | null
          notes: string | null
          num_greenhouses: number | null
          site_total_length_mm: number | null
          site_total_width_mm: number | null
        }
        Insert: {
          access_road_width_mm?: number | null
          created_at?: string | null
          gh_layout?: string | null
          gh_spacing_mm?: number | null
          id?: number
          main_access_road?: string | null
          notes?: string | null
          num_greenhouses?: number | null
          site_total_length_mm?: number | null
          site_total_width_mm?: number | null
        }
        Update: {
          access_road_width_mm?: number | null
          created_at?: string | null
          gh_layout?: string | null
          gh_spacing_mm?: number | null
          id?: number
          main_access_road?: string | null
          notes?: string | null
          num_greenhouses?: number | null
          site_total_length_mm?: number | null
          site_total_width_mm?: number | null
        }
        Relationships: []
      }
      cfi_industries: {
        Row: {
          agent_data_seeded: boolean | null
          created_at: string | null
          crop_name: string
          estate_label: string
          industry_id: number
          industry_name: string
          is_live: boolean | null
          notes: string | null
          operator_label: string
          primary_country: string | null
          processing_label: string
          processing_unit: string
          regulatory_body: string | null
          updated_at: string | null
        }
        Insert: {
          agent_data_seeded?: boolean | null
          created_at?: string | null
          crop_name: string
          estate_label: string
          industry_id?: number
          industry_name: string
          is_live?: boolean | null
          notes?: string | null
          operator_label: string
          primary_country?: string | null
          processing_label: string
          processing_unit: string
          regulatory_body?: string | null
          updated_at?: string | null
        }
        Update: {
          agent_data_seeded?: boolean | null
          created_at?: string | null
          crop_name?: string
          estate_label?: string
          industry_id?: number
          industry_name?: string
          is_live?: boolean | null
          notes?: string | null
          operator_label?: string
          primary_country?: string | null
          processing_label?: string
          processing_unit?: string
          regulatory_body?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      cfi_industry_switcher_config: {
        Row: {
          config_key: string
          config_value: string
          description: string | null
          id: number
          professor_only: boolean | null
          updated_at: string | null
        }
        Insert: {
          config_key: string
          config_value: string
          description?: string | null
          id?: number
          professor_only?: boolean | null
          updated_at?: string | null
        }
        Update: {
          config_key?: string
          config_value?: string
          description?: string | null
          id?: number
          professor_only?: boolean | null
          updated_at?: string | null
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
      cfi_lab_display_mapping: {
        Row: {
          created_at: string | null
          current_stage: string
          display_label: string
          display_stage: string
          id: number
          is_final_output: boolean | null
        }
        Insert: {
          created_at?: string | null
          current_stage: string
          display_label: string
          display_stage: string
          id?: number
          is_final_output?: boolean | null
        }
        Update: {
          created_at?: string | null
          current_stage?: string
          display_label?: string
          display_stage?: string
          id?: number
          is_final_output?: boolean | null
        }
        Relationships: []
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
          prompt_part2: string | null
          prompt_part3: string | null
          prompt_part4: string | null
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
          prompt_part2?: string | null
          prompt_part3?: string | null
          prompt_part4?: string | null
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
          prompt_part2?: string | null
          prompt_part3?: string | null
          prompt_part4?: string | null
          version?: string | null
        }
        Relationships: []
      }
      cfi_microbe_compatibility: {
        Row: {
          compatibility_id: number
          compatibility_score: number | null
          notes: string | null
          source: string | null
          strain_a: string | null
          strain_b: string | null
        }
        Insert: {
          compatibility_id?: number
          compatibility_score?: number | null
          notes?: string | null
          source?: string | null
          strain_a?: string | null
          strain_b?: string | null
        }
        Update: {
          compatibility_id?: number
          compatibility_score?: number | null
          notes?: string | null
          source?: string | null
          strain_a?: string | null
          strain_b?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cfi_microbe_compatibility_strain_a_fkey"
            columns: ["strain_a"]
            isOneToOne: false
            referencedRelation: "cfi_microbial_strains"
            referencedColumns: ["strain_code"]
          },
          {
            foreignKeyName: "cfi_microbe_compatibility_strain_b_fkey"
            columns: ["strain_b"]
            isOneToOne: false
            referencedRelation: "cfi_microbial_strains"
            referencedColumns: ["strain_code"]
          },
        ]
      }
      cfi_microbe_field_trials: {
        Row: {
          amf_improvement_pct: number | null
          created_at: string | null
          location: string | null
          mbc_improvement_pct: number | null
          notes: string | null
          publication_reference: string | null
          soil_type: string | null
          strains_used: string[] | null
          trial_code: string
          trial_duration_days: number | null
          trial_id: number
          trial_start_date: string | null
          yield_improvement_pct: number | null
        }
        Insert: {
          amf_improvement_pct?: number | null
          created_at?: string | null
          location?: string | null
          mbc_improvement_pct?: number | null
          notes?: string | null
          publication_reference?: string | null
          soil_type?: string | null
          strains_used?: string[] | null
          trial_code: string
          trial_duration_days?: number | null
          trial_id?: number
          trial_start_date?: string | null
          yield_improvement_pct?: number | null
        }
        Update: {
          amf_improvement_pct?: number | null
          created_at?: string | null
          location?: string | null
          mbc_improvement_pct?: number | null
          notes?: string | null
          publication_reference?: string | null
          soil_type?: string | null
          strains_used?: string[] | null
          trial_code?: string
          trial_duration_days?: number | null
          trial_id?: number
          trial_start_date?: string | null
          yield_improvement_pct?: number | null
        }
        Relationships: []
      }
      cfi_microbial_strains: {
        Row: {
          created_at: string | null
          genus: string | null
          icbb_number: string | null
          notes: string | null
          optimal_ph_max: number | null
          optimal_ph_min: number | null
          salinity_tolerance: string | null
          source: string | null
          species: string | null
          strain_code: string
          strain_id: number
          strain_name: string
          strain_type: string
          temperature_max_c: number | null
          temperature_min_c: number | null
        }
        Insert: {
          created_at?: string | null
          genus?: string | null
          icbb_number?: string | null
          notes?: string | null
          optimal_ph_max?: number | null
          optimal_ph_min?: number | null
          salinity_tolerance?: string | null
          source?: string | null
          species?: string | null
          strain_code: string
          strain_id?: number
          strain_name: string
          strain_type: string
          temperature_max_c?: number | null
          temperature_min_c?: number | null
        }
        Update: {
          created_at?: string | null
          genus?: string | null
          icbb_number?: string | null
          notes?: string | null
          optimal_ph_max?: number | null
          optimal_ph_min?: number | null
          salinity_tolerance?: string | null
          source?: string | null
          species?: string | null
          strain_code?: string
          strain_id?: number
          strain_name?: string
          strain_type?: string
          temperature_max_c?: number | null
          temperature_min_c?: number | null
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
      cfi_mill_registry: {
        Row: {
          alternative_name: string | null
          cfi_notes: string | null
          confidence: string | null
          country: string | null
          created_at: string | null
          district: string | null
          gfw_area_ha: number | null
          gfw_date: string | null
          gfw_fid: number | null
          gfw_geostorage: string | null
          group_name: string | null
          id: number
          is_cfi_prospect: boolean | null
          is_indonesia: boolean | null
          is_rspo_certified: boolean | null
          iso: string | null
          latitude: number | null
          longitude: number | null
          mill_name: string
          parent_company: string | null
          province: string | null
          rspo_status: string | null
          rspo_type: string | null
          uml_id: string | null
        }
        Insert: {
          alternative_name?: string | null
          cfi_notes?: string | null
          confidence?: string | null
          country?: string | null
          created_at?: string | null
          district?: string | null
          gfw_area_ha?: number | null
          gfw_date?: string | null
          gfw_fid?: number | null
          gfw_geostorage?: string | null
          group_name?: string | null
          id?: number
          is_cfi_prospect?: boolean | null
          is_indonesia?: boolean | null
          is_rspo_certified?: boolean | null
          iso?: string | null
          latitude?: number | null
          longitude?: number | null
          mill_name: string
          parent_company?: string | null
          province?: string | null
          rspo_status?: string | null
          rspo_type?: string | null
          uml_id?: string | null
        }
        Update: {
          alternative_name?: string | null
          cfi_notes?: string | null
          confidence?: string | null
          country?: string | null
          created_at?: string | null
          district?: string | null
          gfw_area_ha?: number | null
          gfw_date?: string | null
          gfw_fid?: number | null
          gfw_geostorage?: string | null
          group_name?: string | null
          id?: number
          is_cfi_prospect?: boolean | null
          is_indonesia?: boolean | null
          is_rspo_certified?: boolean | null
          iso?: string | null
          latitude?: number | null
          longitude?: number | null
          mill_name?: string
          parent_company?: string | null
          province?: string | null
          rspo_status?: string | null
          rspo_type?: string | null
          uml_id?: string | null
        }
        Relationships: []
      }
      cfi_mill_soil_acidity: {
        Row: {
          acidity_class: number
          created_at: string | null
          id: number
          lab_ph_measured: number | null
          lookup_distance_km: number | null
          mill_lat: number
          mill_lon: number
          mill_name: string
          override_class: number | null
          override_reason: string | null
          updated_at: string | null
        }
        Insert: {
          acidity_class: number
          created_at?: string | null
          id?: number
          lab_ph_measured?: number | null
          lookup_distance_km?: number | null
          mill_lat: number
          mill_lon: number
          mill_name: string
          override_class?: number | null
          override_reason?: string | null
          updated_at?: string | null
        }
        Update: {
          acidity_class?: number
          created_at?: string | null
          id?: number
          lab_ph_measured?: number | null
          lookup_distance_km?: number | null
          mill_lat?: number
          mill_lon?: number
          mill_name?: string
          override_class?: number | null
          override_reason?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cfi_mill_soil_acidity_acidity_class_fkey"
            columns: ["acidity_class"]
            isOneToOne: false
            referencedRelation: "cfi_soil_acidity_classes"
            referencedColumns: ["class_id"]
          },
          {
            foreignKeyName: "cfi_mill_soil_acidity_override_class_fkey"
            columns: ["override_class"]
            isOneToOne: false
            referencedRelation: "cfi_soil_acidity_classes"
            referencedColumns: ["class_id"]
          },
        ]
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
          gps_confidence: string | null
          id: string
          industry_id: number | null
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
          gps_confidence?: string | null
          id?: string
          industry_id?: number | null
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
          gps_confidence?: string | null
          id?: string
          industry_id?: number | null
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
            foreignKeyName: "cfi_mills_60tph_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "cfi_industries"
            referencedColumns: ["industry_id"]
          },
          {
            foreignKeyName: "cfi_mills_60tph_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "v_industry_switcher"
            referencedColumns: ["industry_id"]
          },
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
      cfi_mills_all: {
        Row: {
          capacity_tph: number | null
          cfi_notes: string | null
          created_at: string | null
          data_confidence: string | null
          district_kabupaten: string | null
          estate_name: string | null
          has_kernel_crushing_plant: boolean | null
          id: string
          industry_id: number | null
          ispo_status: string | null
          latitude: number | null
          longitude: number | null
          mill_name: string
          nearest_city: string | null
          owner_company: string
          owner_id: string | null
          province: string | null
          rspo_status: string | null
          source_url: string | null
          year_commissioned: number | null
        }
        Insert: {
          capacity_tph?: number | null
          cfi_notes?: string | null
          created_at?: string | null
          data_confidence?: string | null
          district_kabupaten?: string | null
          estate_name?: string | null
          has_kernel_crushing_plant?: boolean | null
          id?: string
          industry_id?: number | null
          ispo_status?: string | null
          latitude?: number | null
          longitude?: number | null
          mill_name: string
          nearest_city?: string | null
          owner_company: string
          owner_id?: string | null
          province?: string | null
          rspo_status?: string | null
          source_url?: string | null
          year_commissioned?: number | null
        }
        Update: {
          capacity_tph?: number | null
          cfi_notes?: string | null
          created_at?: string | null
          data_confidence?: string | null
          district_kabupaten?: string | null
          estate_name?: string | null
          has_kernel_crushing_plant?: boolean | null
          id?: string
          industry_id?: number | null
          ispo_status?: string | null
          latitude?: number | null
          longitude?: number | null
          mill_name?: string
          nearest_city?: string | null
          owner_company?: string
          owner_id?: string | null
          province?: string | null
          rspo_status?: string | null
          source_url?: string | null
          year_commissioned?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "cfi_mills_all_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "cfi_industries"
            referencedColumns: ["industry_id"]
          },
          {
            foreignKeyName: "cfi_mills_all_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "v_industry_switcher"
            referencedColumns: ["industry_id"]
          },
          {
            foreignKeyName: "cfi_mills_all_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "cfi_mill_owners"
            referencedColumns: ["id"]
          },
        ]
      }
      cfi_peat_parameters: {
        Row: {
          age_class: string | null
          confidence_level: string | null
          created_at: string | null
          id: number
          notes: string | null
          parameter_group: string
          parameter_key: string
          parameter_label: string | null
          source: string | null
          unit: string | null
          value_numeric: number | null
          value_text: string | null
        }
        Insert: {
          age_class?: string | null
          confidence_level?: string | null
          created_at?: string | null
          id?: number
          notes?: string | null
          parameter_group: string
          parameter_key: string
          parameter_label?: string | null
          source?: string | null
          unit?: string | null
          value_numeric?: number | null
          value_text?: string | null
        }
        Update: {
          age_class?: string | null
          confidence_level?: string | null
          created_at?: string | null
          id?: number
          notes?: string | null
          parameter_group?: string
          parameter_key?: string
          parameter_label?: string | null
          source?: string | null
          unit?: string | null
          value_numeric?: number | null
          value_text?: string | null
        }
        Relationships: []
      }
      cfi_personas: {
        Row: {
          active: boolean | null
          contact_email: string | null
          country: string | null
          created_at: string | null
          full_title: string | null
          governance_layer: string | null
          id: number
          institution: string | null
          key_contributions: string[] | null
          persona_code: string
          persona_name: string
          prompt_priority: number | null
          role_in_cfi: string | null
          short_title: string | null
          sort_order: number | null
          specialisations: string[] | null
        }
        Insert: {
          active?: boolean | null
          contact_email?: string | null
          country?: string | null
          created_at?: string | null
          full_title?: string | null
          governance_layer?: string | null
          id?: number
          institution?: string | null
          key_contributions?: string[] | null
          persona_code: string
          persona_name: string
          prompt_priority?: number | null
          role_in_cfi?: string | null
          short_title?: string | null
          sort_order?: number | null
          specialisations?: string[] | null
        }
        Update: {
          active?: boolean | null
          contact_email?: string | null
          country?: string | null
          created_at?: string | null
          full_title?: string | null
          governance_layer?: string | null
          id?: number
          institution?: string | null
          key_contributions?: string[] | null
          persona_code?: string
          persona_name?: string
          prompt_priority?: number | null
          role_in_cfi?: string | null
          short_title?: string | null
          sort_order?: number | null
          specialisations?: string[] | null
        }
        Relationships: []
      }
      cfi_product_nutrients: {
        Row: {
          b_g_per_t_wet: number | null
          ca_kg_per_t_wet: number | null
          confidence: string | null
          created_at: string | null
          cu_g_per_t_wet: number | null
          default_rate_t_ha_yr: number | null
          dm_fraction: number | null
          fe_g_per_t_wet: number | null
          id: number
          k_kg_per_t_wet: number | null
          lab_confirmed: boolean | null
          mg_kg_per_t_wet: number | null
          mn_g_per_t_wet: number | null
          moisture_pct_wb: number | null
          n_kg_per_t_wet: number | null
          n_leach_reduction_pct: number | null
          notes: string | null
          om_kg_per_t_wet: number | null
          p_availability_multiplier: number | null
          p_kg_per_t_wet: number | null
          product_key: string
          product_name: string
          s_kg_per_t_wet: number | null
          source: string | null
          stage: string
          updated_at: string | null
          value_usd_per_t_dm: number | null
          value_usd_per_t_wet: number | null
          zn_g_per_t_wet: number | null
        }
        Insert: {
          b_g_per_t_wet?: number | null
          ca_kg_per_t_wet?: number | null
          confidence?: string | null
          created_at?: string | null
          cu_g_per_t_wet?: number | null
          default_rate_t_ha_yr?: number | null
          dm_fraction?: number | null
          fe_g_per_t_wet?: number | null
          id?: number
          k_kg_per_t_wet?: number | null
          lab_confirmed?: boolean | null
          mg_kg_per_t_wet?: number | null
          mn_g_per_t_wet?: number | null
          moisture_pct_wb?: number | null
          n_kg_per_t_wet?: number | null
          n_leach_reduction_pct?: number | null
          notes?: string | null
          om_kg_per_t_wet?: number | null
          p_availability_multiplier?: number | null
          p_kg_per_t_wet?: number | null
          product_key: string
          product_name: string
          s_kg_per_t_wet?: number | null
          source?: string | null
          stage: string
          updated_at?: string | null
          value_usd_per_t_dm?: number | null
          value_usd_per_t_wet?: number | null
          zn_g_per_t_wet?: number | null
        }
        Update: {
          b_g_per_t_wet?: number | null
          ca_kg_per_t_wet?: number | null
          confidence?: string | null
          created_at?: string | null
          cu_g_per_t_wet?: number | null
          default_rate_t_ha_yr?: number | null
          dm_fraction?: number | null
          fe_g_per_t_wet?: number | null
          id?: number
          k_kg_per_t_wet?: number | null
          lab_confirmed?: boolean | null
          mg_kg_per_t_wet?: number | null
          mn_g_per_t_wet?: number | null
          moisture_pct_wb?: number | null
          n_kg_per_t_wet?: number | null
          n_leach_reduction_pct?: number | null
          notes?: string | null
          om_kg_per_t_wet?: number | null
          p_availability_multiplier?: number | null
          p_kg_per_t_wet?: number | null
          product_key?: string
          product_name?: string
          s_kg_per_t_wet?: number | null
          source?: string | null
          stage?: string
          updated_at?: string | null
          value_usd_per_t_dm?: number | null
          value_usd_per_t_wet?: number | null
          zn_g_per_t_wet?: number | null
        }
        Relationships: []
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
      cfi_reports: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: number
          is_published: boolean | null
          report_content: string
          report_date: string
          report_title: string
          report_type: string
          updated_at: string | null
          version: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          is_published?: boolean | null
          report_content: string
          report_date?: string
          report_title: string
          report_type: string
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          is_published?: boolean | null
          report_content?: string
          report_date?: string
          report_title?: string
          report_type?: string
          updated_at?: string | null
          version?: string | null
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
      cfi_roles: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          role_code: string
          role_name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          role_code: string
          role_name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          role_code?: string
          role_name?: string
        }
        Relationships: []
      }
      cfi_s0_pages: {
        Row: {
          created_at: string | null
          html_content: string | null
          id: number
          is_published: boolean | null
          page_code: string
          page_title: string
          page_type: string
          updated_at: string | null
          view_order: number | null
        }
        Insert: {
          created_at?: string | null
          html_content?: string | null
          id?: number
          is_published?: boolean | null
          page_code: string
          page_title: string
          page_type: string
          updated_at?: string | null
          view_order?: number | null
        }
        Update: {
          created_at?: string | null
          html_content?: string | null
          id?: number
          is_published?: boolean | null
          page_code?: string
          page_title?: string
          page_type?: string
          updated_at?: string | null
          view_order?: number | null
        }
        Relationships: []
      }
      cfi_s1_opex_labour: {
        Row: {
          created_at: string | null
          estimated_idr: number | null
          estimated_usd: number | null
          headcount: number | null
          id: number
          machines_operated: string | null
          min_wage_idr: number | null
          notes: string | null
          role_code: string
          role_title: string
          shift_pattern: string | null
          skill_level: string | null
        }
        Insert: {
          created_at?: string | null
          estimated_idr?: number | null
          estimated_usd?: number | null
          headcount?: number | null
          id?: number
          machines_operated?: string | null
          min_wage_idr?: number | null
          notes?: string | null
          role_code: string
          role_title: string
          shift_pattern?: string | null
          skill_level?: string | null
        }
        Update: {
          created_at?: string | null
          estimated_idr?: number | null
          estimated_usd?: number | null
          headcount?: number | null
          id?: number
          machines_operated?: string | null
          min_wage_idr?: number | null
          notes?: string | null
          role_code?: string
          role_title?: string
          shift_pattern?: string | null
          skill_level?: string | null
        }
        Relationships: []
      }
      cfi_s1_opex_maintenance: {
        Row: {
          annual_usd_high: number | null
          annual_usd_low: number | null
          annual_usd_mid: number | null
          basis: string | null
          category: string
          created_at: string | null
          description: string
          frequency: string | null
          id: number
          item_code: string
          notes: string | null
        }
        Insert: {
          annual_usd_high?: number | null
          annual_usd_low?: number | null
          annual_usd_mid?: number | null
          basis?: string | null
          category: string
          created_at?: string | null
          description: string
          frequency?: string | null
          id?: number
          item_code: string
          notes?: string | null
        }
        Update: {
          annual_usd_high?: number | null
          annual_usd_low?: number | null
          annual_usd_mid?: number | null
          basis?: string | null
          category?: string
          created_at?: string | null
          description?: string
          frequency?: string | null
          id?: number
          item_code?: string
          notes?: string | null
        }
        Relationships: []
      }
      cfi_s1_opex_other: {
        Row: {
          basis: string | null
          category: string
          created_at: string | null
          description: string
          id: number
          is_data_gap: boolean | null
          item_code: string
          notes: string | null
          usd_per_month: number | null
          usd_per_year: number | null
        }
        Insert: {
          basis?: string | null
          category: string
          created_at?: string | null
          description: string
          id?: number
          is_data_gap?: boolean | null
          item_code: string
          notes?: string | null
          usd_per_month?: number | null
          usd_per_year?: number | null
        }
        Update: {
          basis?: string | null
          category?: string
          created_at?: string | null
          description?: string
          id?: number
          is_data_gap?: boolean | null
          item_code?: string
          notes?: string | null
          usd_per_month?: number | null
          usd_per_year?: number | null
        }
        Relationships: []
      }
      cfi_s1_process_nodes: {
        Row: {
          color_code: string | null
          created_at: string | null
          elevation_m: number | null
          equipment_name: string
          equipment_tag: string
          gate_code: string | null
          gate_enforcement: string | null
          id: number
          line_code: string
          mc_in_pct: number | null
          mc_out_pct: number | null
          node_number: number
          power_kw: number | null
          throughput_th: number | null
        }
        Insert: {
          color_code?: string | null
          created_at?: string | null
          elevation_m?: number | null
          equipment_name: string
          equipment_tag: string
          gate_code?: string | null
          gate_enforcement?: string | null
          id?: number
          line_code: string
          mc_in_pct?: number | null
          mc_out_pct?: number | null
          node_number: number
          power_kw?: number | null
          throughput_th?: number | null
        }
        Update: {
          color_code?: string | null
          created_at?: string | null
          elevation_m?: number | null
          equipment_name?: string
          equipment_tag?: string
          gate_code?: string | null
          gate_enforcement?: string | null
          id?: number
          line_code?: string
          mc_in_pct?: number | null
          mc_out_pct?: number | null
          node_number?: number
          power_kw?: number | null
          throughput_th?: number | null
        }
        Relationships: []
      }
      cfi_s3_component_registry: {
        Row: {
          component_name: string
          component_version: string | null
          created_at: string | null
          description: string | null
          file_reference: string | null
          id: number
          lovable_deployed: boolean | null
          notes: string | null
          status: string | null
          supabase_tables: string[] | null
        }
        Insert: {
          component_name: string
          component_version?: string | null
          created_at?: string | null
          description?: string | null
          file_reference?: string | null
          id?: number
          lovable_deployed?: boolean | null
          notes?: string | null
          status?: string | null
          supabase_tables?: string[] | null
        }
        Update: {
          component_name?: string
          component_version?: string | null
          created_at?: string | null
          description?: string | null
          file_reference?: string | null
          id?: number
          lovable_deployed?: boolean | null
          notes?: string | null
          status?: string | null
          supabase_tables?: string[] | null
        }
        Relationships: []
      }
      cfi_s3_design_sessions: {
        Row: {
          created_at: string | null
          design_decisions: Json | null
          id: number
          session_date: string
          session_label: string
          status: string | null
          ux_principles: Json | null
          widget_description: string | null
          widget_title: string | null
        }
        Insert: {
          created_at?: string | null
          design_decisions?: Json | null
          id?: number
          session_date?: string
          session_label: string
          status?: string | null
          ux_principles?: Json | null
          widget_description?: string | null
          widget_title?: string | null
        }
        Update: {
          created_at?: string | null
          design_decisions?: Json | null
          id?: number
          session_date?: string
          session_label?: string
          status?: string | null
          ux_principles?: Json | null
          widget_description?: string | null
          widget_title?: string | null
        }
        Relationships: []
      }
      cfi_s3_ux_prompts: {
        Row: {
          created_at: string | null
          design_system: string | null
          id: number
          is_active: boolean | null
          prompt_body: string
          prompt_title: string
          prompt_version: string
          target_component: string | null
        }
        Insert: {
          created_at?: string | null
          design_system?: string | null
          id?: number
          is_active?: boolean | null
          prompt_body: string
          prompt_title: string
          prompt_version: string
          target_component?: string | null
        }
        Update: {
          created_at?: string | null
          design_system?: string | null
          id?: number
          is_active?: boolean | null
          prompt_body?: string
          prompt_title?: string
          prompt_version?: string
          target_component?: string | null
        }
        Relationships: []
      }
      cfi_scenarios: {
        Row: {
          agronomy_tier: string | null
          created_at: string | null
          efb_enabled: boolean | null
          efb_mix_pct: number | null
          ffb_capacity_tph: number | null
          id: number
          is_active: boolean | null
          mix_input_mode: string | null
          notes: string | null
          opdc_enabled: boolean | null
          opdc_mix_pct: number | null
          operating_days_month: number | null
          operating_hrs_day: number | null
          opf_enabled: boolean | null
          opf_mix_pct: number | null
          opt_enabled: boolean | null
          opt_mix_pct: number | null
          pke_enabled: boolean | null
          pke_mix_pct: number | null
          pos_enabled: boolean | null
          pos_mix_pct: number | null
          projected_npk_uplift_pct: number | null
          scenario_name: string
          scenario_type: string | null
          site_id: number | null
          soil_type: string | null
          suggestion_reason: string | null
          suggestion_title: string | null
          updated_at: string | null
          user_id: string | null
          utilisation_pct: number | null
        }
        Insert: {
          agronomy_tier?: string | null
          created_at?: string | null
          efb_enabled?: boolean | null
          efb_mix_pct?: number | null
          ffb_capacity_tph?: number | null
          id?: number
          is_active?: boolean | null
          mix_input_mode?: string | null
          notes?: string | null
          opdc_enabled?: boolean | null
          opdc_mix_pct?: number | null
          operating_days_month?: number | null
          operating_hrs_day?: number | null
          opf_enabled?: boolean | null
          opf_mix_pct?: number | null
          opt_enabled?: boolean | null
          opt_mix_pct?: number | null
          pke_enabled?: boolean | null
          pke_mix_pct?: number | null
          pos_enabled?: boolean | null
          pos_mix_pct?: number | null
          projected_npk_uplift_pct?: number | null
          scenario_name: string
          scenario_type?: string | null
          site_id?: number | null
          soil_type?: string | null
          suggestion_reason?: string | null
          suggestion_title?: string | null
          updated_at?: string | null
          user_id?: string | null
          utilisation_pct?: number | null
        }
        Update: {
          agronomy_tier?: string | null
          created_at?: string | null
          efb_enabled?: boolean | null
          efb_mix_pct?: number | null
          ffb_capacity_tph?: number | null
          id?: number
          is_active?: boolean | null
          mix_input_mode?: string | null
          notes?: string | null
          opdc_enabled?: boolean | null
          opdc_mix_pct?: number | null
          operating_days_month?: number | null
          operating_hrs_day?: number | null
          opf_enabled?: boolean | null
          opf_mix_pct?: number | null
          opt_enabled?: boolean | null
          opt_mix_pct?: number | null
          pke_enabled?: boolean | null
          pke_mix_pct?: number | null
          pos_enabled?: boolean | null
          pos_mix_pct?: number | null
          projected_npk_uplift_pct?: number | null
          scenario_name?: string
          scenario_type?: string | null
          site_id?: number | null
          soil_type?: string | null
          suggestion_reason?: string | null
          suggestion_title?: string | null
          updated_at?: string | null
          user_id?: string | null
          utilisation_pct?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "cfi_scenarios_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "cfi_sites"
            referencedColumns: ["id"]
          },
        ]
      }
      cfi_sites: {
        Row: {
          agronomy_tier: string | null
          baseline_site_id: number | null
          blend_cn_dm_weighted: number | null
          capacity_confirmed: boolean | null
          cn_status: string | null
          company_name: string | null
          created_at: string | null
          custom_stream_1_enabled: boolean | null
          custom_stream_1_label: string | null
          custom_stream_1_mix_kg: number | null
          custom_stream_1_mix_pct: number | null
          custom_stream_2_enabled: boolean | null
          custom_stream_2_label: string | null
          custom_stream_2_mix_kg: number | null
          custom_stream_2_mix_pct: number | null
          district: string | null
          efb_enabled: boolean | null
          efb_mix_kg: number | null
          efb_mix_pct: number | null
          efb_volume_t: number | null
          estate_area_ha: number | null
          estate_name: string | null
          ffb_capacity_tph: number | null
          gps_lat: number | null
          gps_lng: number | null
          id: number
          industry_id: number | null
          is_scenario: boolean | null
          mill_name: string | null
          mix_input_mode: string | null
          monthly_ffb_t: number | null
          opdc_enabled: boolean | null
          opdc_mix_kg: number | null
          opdc_mix_pct: number | null
          opdc_volume_t: number | null
          operating_days_month: number | null
          operating_hrs_day: number | null
          opf_enabled: boolean | null
          opf_mix_kg: number | null
          opf_mix_pct: number | null
          opf_volume_t: number | null
          opt_enabled: boolean | null
          opt_mix_kg: number | null
          opt_mix_pct: number | null
          opt_volume_t: number | null
          pke_enabled: boolean | null
          pke_mix_kg: number | null
          pke_mix_pct: number | null
          pke_volume_t: number | null
          pmf_enabled: boolean | null
          pmf_volume_t: number | null
          pome_enabled: boolean | null
          pome_volume_t: number | null
          pos_enabled: boolean | null
          pos_mix_kg: number | null
          pos_mix_pct: number | null
          pos_volume_t: number | null
          product_value_index: number | null
          province: string | null
          rainfall_mm_yr: number | null
          scenario_name: string | null
          session_count: number | null
          session_date: string | null
          site_uuid: string | null
          soil_type: string | null
          streams_confirmed: boolean | null
          temp_avg_c: number | null
          updated_at: string | null
          user_email: string | null
          user_id: string | null
          user_name: string | null
          utilisation_pct: number | null
        }
        Insert: {
          agronomy_tier?: string | null
          baseline_site_id?: number | null
          blend_cn_dm_weighted?: number | null
          capacity_confirmed?: boolean | null
          cn_status?: string | null
          company_name?: string | null
          created_at?: string | null
          custom_stream_1_enabled?: boolean | null
          custom_stream_1_label?: string | null
          custom_stream_1_mix_kg?: number | null
          custom_stream_1_mix_pct?: number | null
          custom_stream_2_enabled?: boolean | null
          custom_stream_2_label?: string | null
          custom_stream_2_mix_kg?: number | null
          custom_stream_2_mix_pct?: number | null
          district?: string | null
          efb_enabled?: boolean | null
          efb_mix_kg?: number | null
          efb_mix_pct?: number | null
          efb_volume_t?: number | null
          estate_area_ha?: number | null
          estate_name?: string | null
          ffb_capacity_tph?: number | null
          gps_lat?: number | null
          gps_lng?: number | null
          id?: number
          industry_id?: number | null
          is_scenario?: boolean | null
          mill_name?: string | null
          mix_input_mode?: string | null
          monthly_ffb_t?: number | null
          opdc_enabled?: boolean | null
          opdc_mix_kg?: number | null
          opdc_mix_pct?: number | null
          opdc_volume_t?: number | null
          operating_days_month?: number | null
          operating_hrs_day?: number | null
          opf_enabled?: boolean | null
          opf_mix_kg?: number | null
          opf_mix_pct?: number | null
          opf_volume_t?: number | null
          opt_enabled?: boolean | null
          opt_mix_kg?: number | null
          opt_mix_pct?: number | null
          opt_volume_t?: number | null
          pke_enabled?: boolean | null
          pke_mix_kg?: number | null
          pke_mix_pct?: number | null
          pke_volume_t?: number | null
          pmf_enabled?: boolean | null
          pmf_volume_t?: number | null
          pome_enabled?: boolean | null
          pome_volume_t?: number | null
          pos_enabled?: boolean | null
          pos_mix_kg?: number | null
          pos_mix_pct?: number | null
          pos_volume_t?: number | null
          product_value_index?: number | null
          province?: string | null
          rainfall_mm_yr?: number | null
          scenario_name?: string | null
          session_count?: number | null
          session_date?: string | null
          site_uuid?: string | null
          soil_type?: string | null
          streams_confirmed?: boolean | null
          temp_avg_c?: number | null
          updated_at?: string | null
          user_email?: string | null
          user_id?: string | null
          user_name?: string | null
          utilisation_pct?: number | null
        }
        Update: {
          agronomy_tier?: string | null
          baseline_site_id?: number | null
          blend_cn_dm_weighted?: number | null
          capacity_confirmed?: boolean | null
          cn_status?: string | null
          company_name?: string | null
          created_at?: string | null
          custom_stream_1_enabled?: boolean | null
          custom_stream_1_label?: string | null
          custom_stream_1_mix_kg?: number | null
          custom_stream_1_mix_pct?: number | null
          custom_stream_2_enabled?: boolean | null
          custom_stream_2_label?: string | null
          custom_stream_2_mix_kg?: number | null
          custom_stream_2_mix_pct?: number | null
          district?: string | null
          efb_enabled?: boolean | null
          efb_mix_kg?: number | null
          efb_mix_pct?: number | null
          efb_volume_t?: number | null
          estate_area_ha?: number | null
          estate_name?: string | null
          ffb_capacity_tph?: number | null
          gps_lat?: number | null
          gps_lng?: number | null
          id?: number
          industry_id?: number | null
          is_scenario?: boolean | null
          mill_name?: string | null
          mix_input_mode?: string | null
          monthly_ffb_t?: number | null
          opdc_enabled?: boolean | null
          opdc_mix_kg?: number | null
          opdc_mix_pct?: number | null
          opdc_volume_t?: number | null
          operating_days_month?: number | null
          operating_hrs_day?: number | null
          opf_enabled?: boolean | null
          opf_mix_kg?: number | null
          opf_mix_pct?: number | null
          opf_volume_t?: number | null
          opt_enabled?: boolean | null
          opt_mix_kg?: number | null
          opt_mix_pct?: number | null
          opt_volume_t?: number | null
          pke_enabled?: boolean | null
          pke_mix_kg?: number | null
          pke_mix_pct?: number | null
          pke_volume_t?: number | null
          pmf_enabled?: boolean | null
          pmf_volume_t?: number | null
          pome_enabled?: boolean | null
          pome_volume_t?: number | null
          pos_enabled?: boolean | null
          pos_mix_kg?: number | null
          pos_mix_pct?: number | null
          pos_volume_t?: number | null
          product_value_index?: number | null
          province?: string | null
          rainfall_mm_yr?: number | null
          scenario_name?: string | null
          session_count?: number | null
          session_date?: string | null
          site_uuid?: string | null
          soil_type?: string | null
          streams_confirmed?: boolean | null
          temp_avg_c?: number | null
          updated_at?: string | null
          user_email?: string | null
          user_id?: string | null
          user_name?: string | null
          utilisation_pct?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "cfi_sites_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "cfi_industries"
            referencedColumns: ["industry_id"]
          },
          {
            foreignKeyName: "cfi_sites_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "v_industry_switcher"
            referencedColumns: ["industry_id"]
          },
        ]
      }
      cfi_soil_acidity_classes: {
        Row: {
          cfi_lime_flag: boolean
          cfi_note: string | null
          class_id: number
          class_name: string
          created_at: string | null
          ph_max: number | null
          ph_midpoint: number
          ph_min: number | null
          ph_range: string
        }
        Insert: {
          cfi_lime_flag?: boolean
          cfi_note?: string | null
          class_id: number
          class_name: string
          created_at?: string | null
          ph_max?: number | null
          ph_midpoint: number
          ph_min?: number | null
          ph_range: string
        }
        Update: {
          cfi_lime_flag?: boolean
          cfi_note?: string | null
          class_id?: number
          class_name?: string
          created_at?: string | null
          ph_max?: number | null
          ph_midpoint?: number
          ph_min?: number | null
          ph_range?: string
        }
        Relationships: []
      }
      cfi_soil_acidity_grid: {
        Row: {
          acidity_class: number
          created_at: string | null
          id: number
          lat: number
          lon: number
        }
        Insert: {
          acidity_class: number
          created_at?: string | null
          id?: number
          lat: number
          lon: number
        }
        Update: {
          acidity_class?: number
          created_at?: string | null
          id?: number
          lat?: number
          lon?: number
        }
        Relationships: [
          {
            foreignKeyName: "cfi_soil_acidity_grid_acidity_class_fkey"
            columns: ["acidity_class"]
            isOneToOne: false
            referencedRelation: "cfi_soil_acidity_classes"
            referencedColumns: ["class_id"]
          },
        ]
      }
      cfi_soil_amendments: {
        Row: {
          amendment_category: string
          amendment_key: string
          applicable_soils: string[] | null
          application_frequency_yr: number | null
          application_rate_kg_ha: number | null
          confidence_tier: string | null
          cost_usd_per_kg: number | null
          cost_usd_per_t: number | null
          created_at: string | null
          id: number
          k_availability_pct: number | null
          mandatory_soils: string[] | null
          micronutrient_content: Json | null
          n_leach_reduction_pct: number | null
          not_recommended_soils: string[] | null
          notes: string | null
          p_fix_bypass_pct: number | null
          product_name: string
          product_type: string | null
          regulatory_status: string | null
          residual_effect_years: number | null
          source: string | null
          updated_at: string | null
        }
        Insert: {
          amendment_category: string
          amendment_key: string
          applicable_soils?: string[] | null
          application_frequency_yr?: number | null
          application_rate_kg_ha?: number | null
          confidence_tier?: string | null
          cost_usd_per_kg?: number | null
          cost_usd_per_t?: number | null
          created_at?: string | null
          id?: number
          k_availability_pct?: number | null
          mandatory_soils?: string[] | null
          micronutrient_content?: Json | null
          n_leach_reduction_pct?: number | null
          not_recommended_soils?: string[] | null
          notes?: string | null
          p_fix_bypass_pct?: number | null
          product_name: string
          product_type?: string | null
          regulatory_status?: string | null
          residual_effect_years?: number | null
          source?: string | null
          updated_at?: string | null
        }
        Update: {
          amendment_category?: string
          amendment_key?: string
          applicable_soils?: string[] | null
          application_frequency_yr?: number | null
          application_rate_kg_ha?: number | null
          confidence_tier?: string | null
          cost_usd_per_kg?: number | null
          cost_usd_per_t?: number | null
          created_at?: string | null
          id?: number
          k_availability_pct?: number | null
          mandatory_soils?: string[] | null
          micronutrient_content?: Json | null
          n_leach_reduction_pct?: number | null
          not_recommended_soils?: string[] | null
          notes?: string | null
          p_fix_bypass_pct?: number | null
          product_name?: string
          product_type?: string | null
          regulatory_status?: string | null
          residual_effect_years?: number | null
          source?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      cfi_soil_coefficients: {
        Row: {
          acid_phosphatase_mature_baseline: number | null
          acid_phosphatase_young_baseline: number | null
          amf_baseline_pct: number | null
          amf_habitat_alpha_bf: number | null
          amf_habitat_alpha_bfplus: number | null
          amf_habitat_alpha_cp: number | null
          amf_inoculation_bfplus_pct: number | null
          amf_p_uptake_multiplier: number | null
          amf_target_pct: number | null
          bd_floor_g_cm3: number | null
          bd_positive_feedback_loop: boolean | null
          bd_response_delta_g_cm3_per_som_pct: number | null
          beta_glucosidase_baseline: number | null
          cec_baseline_cmol_kg: number | null
          cec_response_confidence: string | null
          cec_response_per_som_pct: number | null
          created_at: string | null
          decay_factor_annual: number | null
          decay_factor_confidence: string | null
          decay_factor_note: string | null
          dehydrogenase_response_bf: number | null
          dehydrogenase_response_bfplus: number | null
          dehydrogenase_response_cp: number | null
          effective_cec_nh4_cmol: number | null
          fb_ratio_alpha_som_bf: number | null
          fb_ratio_alpha_som_bfplus: number | null
          fb_ratio_alpha_som_cp: number | null
          fb_ratio_amf_direct_bfplus: number | null
          fb_ratio_beta_chitin_bf: number | null
          fb_ratio_beta_chitin_bfplus: number | null
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
          k_leach_rf_bf: number | null
          k_leach_rf_bfplus: number | null
          k_leach_rf_cp: number | null
          k_n_leaching_amplification: number | null
          laccase_activity_baseline: number | null
          mbc_baseline_mg_kg: number | null
          mbc_increment_bf_mg_kg_per_t: number | null
          mbc_increment_bfplus_mg_kg_per_t: number | null
          mbc_increment_cp_mg_kg_per_t: number | null
          mbc_synergy_factor: number | null
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
          n_volatilisation_pct: number | null
          n2o_emission_factor_pct: number | null
          om_retention_1yr_fract_bf: number | null
          om_retention_1yr_fract_bfplus: number | null
          om_retention_1yr_fract_cp: number | null
          om_retention_confidence: string | null
          p_casio3_rf_at_2_5_t_ha: number | null
          p_casio3_rf_at_4_5_t_ha: number | null
          p_fert_correction_factor: number | null
          p_fix_combined_rf: number | null
          p_fix_confidence: string | null
          p_fix_rf_amf: number | null
          p_fix_rf_bf: number | null
          p_fix_rf_bfplus: number | null
          p_fix_rf_cp: number | null
          p_fix_rf_vgam: number | null
          pawc_baseline_mm: number | null
          phosphatase_response_bf: number | null
          phosphatase_response_bfplus: number | null
          phosphatase_response_cp: number | null
          soil_key: string
          supabase_reference: string
          updated_at: string | null
          urease_activity_baseline: number | null
          version: string | null
          whc_formula_applies: boolean | null
          whc_formula_note: string | null
          whc_response_confidence: string | null
          whc_response_mm_per_som_pct: number | null
        }
        Insert: {
          acid_phosphatase_mature_baseline?: number | null
          acid_phosphatase_young_baseline?: number | null
          amf_baseline_pct?: number | null
          amf_habitat_alpha_bf?: number | null
          amf_habitat_alpha_bfplus?: number | null
          amf_habitat_alpha_cp?: number | null
          amf_inoculation_bfplus_pct?: number | null
          amf_p_uptake_multiplier?: number | null
          amf_target_pct?: number | null
          bd_floor_g_cm3?: number | null
          bd_positive_feedback_loop?: boolean | null
          bd_response_delta_g_cm3_per_som_pct?: number | null
          beta_glucosidase_baseline?: number | null
          cec_baseline_cmol_kg?: number | null
          cec_response_confidence?: string | null
          cec_response_per_som_pct?: number | null
          created_at?: string | null
          decay_factor_annual?: number | null
          decay_factor_confidence?: string | null
          decay_factor_note?: string | null
          dehydrogenase_response_bf?: number | null
          dehydrogenase_response_bfplus?: number | null
          dehydrogenase_response_cp?: number | null
          effective_cec_nh4_cmol?: number | null
          fb_ratio_alpha_som_bf?: number | null
          fb_ratio_alpha_som_bfplus?: number | null
          fb_ratio_alpha_som_cp?: number | null
          fb_ratio_amf_direct_bfplus?: number | null
          fb_ratio_beta_chitin_bf?: number | null
          fb_ratio_beta_chitin_bfplus?: number | null
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
          k_leach_rf_bf?: number | null
          k_leach_rf_bfplus?: number | null
          k_leach_rf_cp?: number | null
          k_n_leaching_amplification?: number | null
          laccase_activity_baseline?: number | null
          mbc_baseline_mg_kg?: number | null
          mbc_increment_bf_mg_kg_per_t?: number | null
          mbc_increment_bfplus_mg_kg_per_t?: number | null
          mbc_increment_cp_mg_kg_per_t?: number | null
          mbc_synergy_factor?: number | null
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
          n_volatilisation_pct?: number | null
          n2o_emission_factor_pct?: number | null
          om_retention_1yr_fract_bf?: number | null
          om_retention_1yr_fract_bfplus?: number | null
          om_retention_1yr_fract_cp?: number | null
          om_retention_confidence?: string | null
          p_casio3_rf_at_2_5_t_ha?: number | null
          p_casio3_rf_at_4_5_t_ha?: number | null
          p_fert_correction_factor?: number | null
          p_fix_combined_rf?: number | null
          p_fix_confidence?: string | null
          p_fix_rf_amf?: number | null
          p_fix_rf_bf?: number | null
          p_fix_rf_bfplus?: number | null
          p_fix_rf_cp?: number | null
          p_fix_rf_vgam?: number | null
          pawc_baseline_mm?: number | null
          phosphatase_response_bf?: number | null
          phosphatase_response_bfplus?: number | null
          phosphatase_response_cp?: number | null
          soil_key: string
          supabase_reference: string
          updated_at?: string | null
          urease_activity_baseline?: number | null
          version?: string | null
          whc_formula_applies?: boolean | null
          whc_formula_note?: string | null
          whc_response_confidence?: string | null
          whc_response_mm_per_som_pct?: number | null
        }
        Update: {
          acid_phosphatase_mature_baseline?: number | null
          acid_phosphatase_young_baseline?: number | null
          amf_baseline_pct?: number | null
          amf_habitat_alpha_bf?: number | null
          amf_habitat_alpha_bfplus?: number | null
          amf_habitat_alpha_cp?: number | null
          amf_inoculation_bfplus_pct?: number | null
          amf_p_uptake_multiplier?: number | null
          amf_target_pct?: number | null
          bd_floor_g_cm3?: number | null
          bd_positive_feedback_loop?: boolean | null
          bd_response_delta_g_cm3_per_som_pct?: number | null
          beta_glucosidase_baseline?: number | null
          cec_baseline_cmol_kg?: number | null
          cec_response_confidence?: string | null
          cec_response_per_som_pct?: number | null
          created_at?: string | null
          decay_factor_annual?: number | null
          decay_factor_confidence?: string | null
          decay_factor_note?: string | null
          dehydrogenase_response_bf?: number | null
          dehydrogenase_response_bfplus?: number | null
          dehydrogenase_response_cp?: number | null
          effective_cec_nh4_cmol?: number | null
          fb_ratio_alpha_som_bf?: number | null
          fb_ratio_alpha_som_bfplus?: number | null
          fb_ratio_alpha_som_cp?: number | null
          fb_ratio_amf_direct_bfplus?: number | null
          fb_ratio_beta_chitin_bf?: number | null
          fb_ratio_beta_chitin_bfplus?: number | null
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
          k_leach_rf_bf?: number | null
          k_leach_rf_bfplus?: number | null
          k_leach_rf_cp?: number | null
          k_n_leaching_amplification?: number | null
          laccase_activity_baseline?: number | null
          mbc_baseline_mg_kg?: number | null
          mbc_increment_bf_mg_kg_per_t?: number | null
          mbc_increment_bfplus_mg_kg_per_t?: number | null
          mbc_increment_cp_mg_kg_per_t?: number | null
          mbc_synergy_factor?: number | null
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
          n_volatilisation_pct?: number | null
          n2o_emission_factor_pct?: number | null
          om_retention_1yr_fract_bf?: number | null
          om_retention_1yr_fract_bfplus?: number | null
          om_retention_1yr_fract_cp?: number | null
          om_retention_confidence?: string | null
          p_casio3_rf_at_2_5_t_ha?: number | null
          p_casio3_rf_at_4_5_t_ha?: number | null
          p_fert_correction_factor?: number | null
          p_fix_combined_rf?: number | null
          p_fix_confidence?: string | null
          p_fix_rf_amf?: number | null
          p_fix_rf_bf?: number | null
          p_fix_rf_bfplus?: number | null
          p_fix_rf_cp?: number | null
          p_fix_rf_vgam?: number | null
          pawc_baseline_mm?: number | null
          phosphatase_response_bf?: number | null
          phosphatase_response_bfplus?: number | null
          phosphatase_response_cp?: number | null
          soil_key?: string
          supabase_reference?: string
          updated_at?: string | null
          urease_activity_baseline?: number | null
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
      cfi_soil_fertility_by_mgmt: {
        Row: {
          confidence: string | null
          created_at: string | null
          id: number
          k_leach_pct_high: number | null
          k_leach_pct_low: number | null
          k_recommended_amendments: string[] | null
          lime_application_cycle_yrs: number | null
          lime_cost_usd_per_kg: number | null
          lime_kg_ha: number | null
          management_level: string
          n_leach_pct_high: number | null
          n_leach_pct_low: number | null
          n_leach_recommended_amendments: string[] | null
          notes: string | null
          p_fix_pct_high: number | null
          p_fix_pct_low: number | null
          p_fix_recommended_amendments: string[] | null
          p_industry_overapplication_multiplier: number | null
          soil_key: string
          source: string | null
          updated_at: string | null
        }
        Insert: {
          confidence?: string | null
          created_at?: string | null
          id?: number
          k_leach_pct_high?: number | null
          k_leach_pct_low?: number | null
          k_recommended_amendments?: string[] | null
          lime_application_cycle_yrs?: number | null
          lime_cost_usd_per_kg?: number | null
          lime_kg_ha?: number | null
          management_level: string
          n_leach_pct_high?: number | null
          n_leach_pct_low?: number | null
          n_leach_recommended_amendments?: string[] | null
          notes?: string | null
          p_fix_pct_high?: number | null
          p_fix_pct_low?: number | null
          p_fix_recommended_amendments?: string[] | null
          p_industry_overapplication_multiplier?: number | null
          soil_key: string
          source?: string | null
          updated_at?: string | null
        }
        Update: {
          confidence?: string | null
          created_at?: string | null
          id?: number
          k_leach_pct_high?: number | null
          k_leach_pct_low?: number | null
          k_recommended_amendments?: string[] | null
          lime_application_cycle_yrs?: number | null
          lime_cost_usd_per_kg?: number | null
          lime_kg_ha?: number | null
          management_level?: string
          n_leach_pct_high?: number | null
          n_leach_pct_low?: number | null
          n_leach_recommended_amendments?: string[] | null
          notes?: string | null
          p_fix_pct_high?: number | null
          p_fix_pct_low?: number | null
          p_fix_recommended_amendments?: string[] | null
          p_industry_overapplication_multiplier?: number | null
          soil_key?: string
          source?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cfi_soil_fertility_by_mgmt_soil_key_fkey"
            columns: ["soil_key"]
            isOneToOne: false
            referencedRelation: "cfi_soil_profiles"
            referencedColumns: ["soil_key"]
          },
        ]
      }
      cfi_soil_microbe_recommendations: {
        Row: {
          application_stage: string | null
          created_at: string | null
          dosage_cfu_per_g: number | null
          expected_benefit: string | null
          field_trial_verified: boolean | null
          frequency: string | null
          recommendation_id: number
          soil_type: string
          source: string | null
          strain_code: string | null
        }
        Insert: {
          application_stage?: string | null
          created_at?: string | null
          dosage_cfu_per_g?: number | null
          expected_benefit?: string | null
          field_trial_verified?: boolean | null
          frequency?: string | null
          recommendation_id?: number
          soil_type: string
          source?: string | null
          strain_code?: string | null
        }
        Update: {
          application_stage?: string | null
          created_at?: string | null
          dosage_cfu_per_g?: number | null
          expected_benefit?: string | null
          field_trial_verified?: boolean | null
          frequency?: string | null
          recommendation_id?: number
          soil_type?: string
          source?: string | null
          strain_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cfi_soil_microbe_recommendations_strain_code_fkey"
            columns: ["strain_code"]
            isOneToOne: false
            referencedRelation: "cfi_microbial_strains"
            referencedColumns: ["strain_code"]
          },
        ]
      }
      cfi_soil_microbiome: {
        Row: {
          amf_baseline_degraded: number
          amf_bf_plus_inoculation: number
          amf_source: string | null
          amf_target_natural: number
          created_at: string | null
          diversity_source: string | null
          mbc_baseline_degraded: number
          mbc_bf_plus_increment: number
          mbc_source: string | null
          mbc_target_natural: number
          microbiome_id: number
          nitrification_normal: number | null
          nitrification_poor: number | null
          nitrification_source: string | null
          nitrification_vgam: number | null
          phosphatase_multiplier: number
          phosphatase_source: string | null
          respiration_baseline: number | null
          respiration_bf_plus: number | null
          respiration_source: string | null
          shannon_index_baseline: number | null
          shannon_index_bf_plus: number | null
          simpson_index_baseline: number | null
          simpson_index_bf_plus: number | null
          soil_type: string
          updated_at: string | null
        }
        Insert: {
          amf_baseline_degraded: number
          amf_bf_plus_inoculation: number
          amf_source?: string | null
          amf_target_natural: number
          created_at?: string | null
          diversity_source?: string | null
          mbc_baseline_degraded: number
          mbc_bf_plus_increment: number
          mbc_source?: string | null
          mbc_target_natural: number
          microbiome_id?: number
          nitrification_normal?: number | null
          nitrification_poor?: number | null
          nitrification_source?: string | null
          nitrification_vgam?: number | null
          phosphatase_multiplier?: number
          phosphatase_source?: string | null
          respiration_baseline?: number | null
          respiration_bf_plus?: number | null
          respiration_source?: string | null
          shannon_index_baseline?: number | null
          shannon_index_bf_plus?: number | null
          simpson_index_baseline?: number | null
          simpson_index_bf_plus?: number | null
          soil_type: string
          updated_at?: string | null
        }
        Update: {
          amf_baseline_degraded?: number
          amf_bf_plus_inoculation?: number
          amf_source?: string | null
          amf_target_natural?: number
          created_at?: string | null
          diversity_source?: string | null
          mbc_baseline_degraded?: number
          mbc_bf_plus_increment?: number
          mbc_source?: string | null
          mbc_target_natural?: number
          microbiome_id?: number
          nitrification_normal?: number | null
          nitrification_poor?: number | null
          nitrification_source?: string | null
          nitrification_vgam?: number | null
          phosphatase_multiplier?: number
          phosphatase_source?: string | null
          respiration_baseline?: number | null
          respiration_bf_plus?: number | null
          respiration_source?: string | null
          shannon_index_baseline?: number | null
          shannon_index_bf_plus?: number | null
          simpson_index_baseline?: number | null
          simpson_index_bf_plus?: number | null
          soil_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      cfi_soil_optimized_stacks: {
        Row: {
          confidence_level: string | null
          covers_bsf_ivdmd: boolean | null
          covers_cp_uplift: boolean | null
          covers_lignin: boolean | null
          covers_n_fixation: boolean | null
          covers_p_release: boolean | null
          created_at: string | null
          created_by: string | null
          field_trial_verified: boolean | null
          id: number
          is_approved: boolean | null
          is_default: boolean | null
          organisms: string[]
          predicted_amf_uplift_pct: number | null
          predicted_mbc_uplift_pct: number | null
          predicted_p_availability_pct: number | null
          rationale: string
          soil_constraints: string | null
          soil_type: string
          stack_name: string
          total_cost_usd_per_t_fw: number | null
          total_organisms: number
        }
        Insert: {
          confidence_level?: string | null
          covers_bsf_ivdmd?: boolean | null
          covers_cp_uplift?: boolean | null
          covers_lignin?: boolean | null
          covers_n_fixation?: boolean | null
          covers_p_release?: boolean | null
          created_at?: string | null
          created_by?: string | null
          field_trial_verified?: boolean | null
          id?: number
          is_approved?: boolean | null
          is_default?: boolean | null
          organisms: string[]
          predicted_amf_uplift_pct?: number | null
          predicted_mbc_uplift_pct?: number | null
          predicted_p_availability_pct?: number | null
          rationale: string
          soil_constraints?: string | null
          soil_type: string
          stack_name: string
          total_cost_usd_per_t_fw?: number | null
          total_organisms: number
        }
        Update: {
          confidence_level?: string | null
          covers_bsf_ivdmd?: boolean | null
          covers_cp_uplift?: boolean | null
          covers_lignin?: boolean | null
          covers_n_fixation?: boolean | null
          covers_p_release?: boolean | null
          created_at?: string | null
          created_by?: string | null
          field_trial_verified?: boolean | null
          id?: number
          is_approved?: boolean | null
          is_default?: boolean | null
          organisms?: string[]
          predicted_amf_uplift_pct?: number | null
          predicted_mbc_uplift_pct?: number | null
          predicted_p_availability_pct?: number | null
          rationale?: string
          soil_constraints?: string | null
          soil_type?: string
          stack_name?: string
          total_cost_usd_per_t_fw?: number | null
          total_organisms?: number
        }
        Relationships: []
      }
      cfi_soil_organism_performance: {
        Row: {
          bsf_score_soil: number | null
          confidence_level: string | null
          constraint_notes: string | null
          cp_score_soil: number | null
          created_at: string | null
          id: number
          is_approved: boolean | null
          lignin_score_soil: number | null
          literature_source: string
          mechanism: string
          n_fixer_score_soil: number | null
          organism_name: string
          p_releaser_score_soil: number | null
          soil_specific_score: number | null
          soil_type: string
          source_doi: string | null
          updated_at: string | null
          validated_by: string | null
          validation_date: string | null
        }
        Insert: {
          bsf_score_soil?: number | null
          confidence_level?: string | null
          constraint_notes?: string | null
          cp_score_soil?: number | null
          created_at?: string | null
          id?: number
          is_approved?: boolean | null
          lignin_score_soil?: number | null
          literature_source: string
          mechanism: string
          n_fixer_score_soil?: number | null
          organism_name: string
          p_releaser_score_soil?: number | null
          soil_specific_score?: number | null
          soil_type: string
          source_doi?: string | null
          updated_at?: string | null
          validated_by?: string | null
          validation_date?: string | null
        }
        Update: {
          bsf_score_soil?: number | null
          confidence_level?: string | null
          constraint_notes?: string | null
          cp_score_soil?: number | null
          created_at?: string | null
          id?: number
          is_approved?: boolean | null
          lignin_score_soil?: number | null
          literature_source?: string
          mechanism?: string
          n_fixer_score_soil?: number | null
          organism_name?: string
          p_releaser_score_soil?: number | null
          soil_specific_score?: number | null
          soil_type?: string
          source_doi?: string | null
          updated_at?: string | null
          validated_by?: string | null
          validation_date?: string | null
        }
        Relationships: []
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
          avail_b_degraded_mg_kg_high: number | null
          avail_b_degraded_mg_kg_low: number | null
          avail_b_target_mg_kg_high: number | null
          avail_b_target_mg_kg_low: number | null
          avail_cu_degraded_mg_kg_high: number | null
          avail_cu_degraded_mg_kg_low: number | null
          avail_cu_target_mg_kg_high: number | null
          avail_cu_target_mg_kg_low: number | null
          avail_fe_degraded_mg_kg_high: number | null
          avail_fe_degraded_mg_kg_low: number | null
          avail_fe_target_mg_kg_high: number | null
          avail_fe_target_mg_kg_low: number | null
          avail_mn_degraded_mg_kg_high: number | null
          avail_mn_degraded_mg_kg_low: number | null
          avail_mn_target_mg_kg_high: number | null
          avail_mn_target_mg_kg_low: number | null
          avail_p_degraded_mg_kg_high: number | null
          avail_p_degraded_mg_kg_low: number | null
          avail_p_target_mg_kg_high: number | null
          avail_p_target_mg_kg_low: number | null
          avail_zn_degraded_mg_kg_high: number | null
          avail_zn_degraded_mg_kg_low: number | null
          avail_zn_target_mg_kg_high: number | null
          avail_zn_target_mg_kg_low: number | null
          b_confidence_tier: string | null
          b_deficiency_threshold_mg_kg: number | null
          b_notes: string | null
          b_source: string | null
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
          cn_ratio_peat: number | null
          confidence_level: string | null
          coverage_pct_indonesia: number | null
          created_at: string | null
          cu_confidence_tier: string | null
          cu_deficiency_notes: string | null
          cu_deficiency_threshold_mg_kg: number | null
          cu_notes: string | null
          cu_source: string | null
          data_source: string | null
          drainage_class: string | null
          exch_al_degraded_cmol: number | null
          exch_ca_degraded_cmol_high: number | null
          exch_ca_degraded_cmol_low: number | null
          exch_k_degraded_cmol_high: number | null
          exch_k_degraded_cmol_low: number | null
          exch_k_target_cmol_high: number | null
          exch_k_target_cmol_low: number | null
          exch_mg_degraded_cmol_high: number | null
          exch_mg_degraded_cmol_low: number | null
          fb_ratio_degraded_high: number | null
          fb_ratio_degraded_low: number | null
          fb_ratio_target_high: number | null
          fb_ratio_target_low: number | null
          fe_confidence_tier: string | null
          fe_source: string | null
          id: number
          industry_id: number | null
          is_active: boolean | null
          is_peat: boolean | null
          k_leach_pct_baseline: number | null
          k_leach_pct_normal: number | null
          k_leach_pct_poor: number | null
          k_leach_pct_vgam: number | null
          k_leach_ranges_confidence: string | null
          k_leach_ranges_source: string | null
          key_regions: string | null
          local_name: string | null
          mbc_degraded_mg_kg_high: number | null
          mbc_degraded_mg_kg_low: number | null
          mbc_target_mg_kg_high: number | null
          mbc_target_mg_kg_low: number | null
          micronutrient_sources: string[] | null
          mn_confidence_tier: string | null
          mn_source: string | null
          n_leach_pct_baseline: number | null
          n_leach_pct_normal_high: number | null
          n_leach_pct_normal_low: number | null
          n_leach_pct_poor_high: number | null
          n_leach_pct_poor_low: number | null
          n_leach_pct_vgam_high: number | null
          n_leach_pct_vgam_low: number | null
          n_leach_ranges_confidence: string | null
          n_leach_ranges_source: string | null
          notes: string | null
          p_fix_mgmt_independent: boolean | null
          p_fix_pct_baseline: number | null
          p_fix_pct_normal_high: number | null
          p_fix_pct_normal_low: number | null
          p_fix_pct_poor_high: number | null
          p_fix_pct_poor_low: number | null
          p_fix_pct_vgam_high: number | null
          p_fix_pct_vgam_low: number | null
          p_fix_pct_vgam_target: number | null
          p_fix_ranges_confidence: string | null
          p_fix_ranges_source: string | null
          p_leach_pct_baseline: number | null
          pawc_baseline_mm: number | null
          peat_bd_mature_g_cm3: number | null
          peat_fiber_content_pct: number | null
          peat_ghg_baseline_t_co2e_ha_yr: number | null
          peat_hydraulic_conductivity_m_day: number | null
          peat_irreversible_dry_risk: boolean | null
          peat_n_mechanism: string | null
          peat_organic_c_pct: number | null
          peat_subsidence_cm_yr: number | null
          peat_total_organic_c_pct: number | null
          peat_whc_pct: number | null
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
          total_n_pct: number | null
          updated_at: string | null
          zn_confidence_tier: string | null
          zn_deficiency_threshold_mg_kg: number | null
          zn_notes: string | null
          zn_source: string | null
        }
        Insert: {
          al_sat_degraded_pct_high?: number | null
          al_sat_degraded_pct_low?: number | null
          al_sat_target_pct_max?: number | null
          amf_colonisation_degraded_pct_high?: number | null
          amf_colonisation_degraded_pct_low?: number | null
          amf_colonisation_target_pct_high?: number | null
          amf_colonisation_target_pct_low?: number | null
          avail_b_degraded_mg_kg_high?: number | null
          avail_b_degraded_mg_kg_low?: number | null
          avail_b_target_mg_kg_high?: number | null
          avail_b_target_mg_kg_low?: number | null
          avail_cu_degraded_mg_kg_high?: number | null
          avail_cu_degraded_mg_kg_low?: number | null
          avail_cu_target_mg_kg_high?: number | null
          avail_cu_target_mg_kg_low?: number | null
          avail_fe_degraded_mg_kg_high?: number | null
          avail_fe_degraded_mg_kg_low?: number | null
          avail_fe_target_mg_kg_high?: number | null
          avail_fe_target_mg_kg_low?: number | null
          avail_mn_degraded_mg_kg_high?: number | null
          avail_mn_degraded_mg_kg_low?: number | null
          avail_mn_target_mg_kg_high?: number | null
          avail_mn_target_mg_kg_low?: number | null
          avail_p_degraded_mg_kg_high?: number | null
          avail_p_degraded_mg_kg_low?: number | null
          avail_p_target_mg_kg_high?: number | null
          avail_p_target_mg_kg_low?: number | null
          avail_zn_degraded_mg_kg_high?: number | null
          avail_zn_degraded_mg_kg_low?: number | null
          avail_zn_target_mg_kg_high?: number | null
          avail_zn_target_mg_kg_low?: number | null
          b_confidence_tier?: string | null
          b_deficiency_threshold_mg_kg?: number | null
          b_notes?: string | null
          b_source?: string | null
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
          cn_ratio_peat?: number | null
          confidence_level?: string | null
          coverage_pct_indonesia?: number | null
          created_at?: string | null
          cu_confidence_tier?: string | null
          cu_deficiency_notes?: string | null
          cu_deficiency_threshold_mg_kg?: number | null
          cu_notes?: string | null
          cu_source?: string | null
          data_source?: string | null
          drainage_class?: string | null
          exch_al_degraded_cmol?: number | null
          exch_ca_degraded_cmol_high?: number | null
          exch_ca_degraded_cmol_low?: number | null
          exch_k_degraded_cmol_high?: number | null
          exch_k_degraded_cmol_low?: number | null
          exch_k_target_cmol_high?: number | null
          exch_k_target_cmol_low?: number | null
          exch_mg_degraded_cmol_high?: number | null
          exch_mg_degraded_cmol_low?: number | null
          fb_ratio_degraded_high?: number | null
          fb_ratio_degraded_low?: number | null
          fb_ratio_target_high?: number | null
          fb_ratio_target_low?: number | null
          fe_confidence_tier?: string | null
          fe_source?: string | null
          id?: number
          industry_id?: number | null
          is_active?: boolean | null
          is_peat?: boolean | null
          k_leach_pct_baseline?: number | null
          k_leach_pct_normal?: number | null
          k_leach_pct_poor?: number | null
          k_leach_pct_vgam?: number | null
          k_leach_ranges_confidence?: string | null
          k_leach_ranges_source?: string | null
          key_regions?: string | null
          local_name?: string | null
          mbc_degraded_mg_kg_high?: number | null
          mbc_degraded_mg_kg_low?: number | null
          mbc_target_mg_kg_high?: number | null
          mbc_target_mg_kg_low?: number | null
          micronutrient_sources?: string[] | null
          mn_confidence_tier?: string | null
          mn_source?: string | null
          n_leach_pct_baseline?: number | null
          n_leach_pct_normal_high?: number | null
          n_leach_pct_normal_low?: number | null
          n_leach_pct_poor_high?: number | null
          n_leach_pct_poor_low?: number | null
          n_leach_pct_vgam_high?: number | null
          n_leach_pct_vgam_low?: number | null
          n_leach_ranges_confidence?: string | null
          n_leach_ranges_source?: string | null
          notes?: string | null
          p_fix_mgmt_independent?: boolean | null
          p_fix_pct_baseline?: number | null
          p_fix_pct_normal_high?: number | null
          p_fix_pct_normal_low?: number | null
          p_fix_pct_poor_high?: number | null
          p_fix_pct_poor_low?: number | null
          p_fix_pct_vgam_high?: number | null
          p_fix_pct_vgam_low?: number | null
          p_fix_pct_vgam_target?: number | null
          p_fix_ranges_confidence?: string | null
          p_fix_ranges_source?: string | null
          p_leach_pct_baseline?: number | null
          pawc_baseline_mm?: number | null
          peat_bd_mature_g_cm3?: number | null
          peat_fiber_content_pct?: number | null
          peat_ghg_baseline_t_co2e_ha_yr?: number | null
          peat_hydraulic_conductivity_m_day?: number | null
          peat_irreversible_dry_risk?: boolean | null
          peat_n_mechanism?: string | null
          peat_organic_c_pct?: number | null
          peat_subsidence_cm_yr?: number | null
          peat_total_organic_c_pct?: number | null
          peat_whc_pct?: number | null
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
          total_n_pct?: number | null
          updated_at?: string | null
          zn_confidence_tier?: string | null
          zn_deficiency_threshold_mg_kg?: number | null
          zn_notes?: string | null
          zn_source?: string | null
        }
        Update: {
          al_sat_degraded_pct_high?: number | null
          al_sat_degraded_pct_low?: number | null
          al_sat_target_pct_max?: number | null
          amf_colonisation_degraded_pct_high?: number | null
          amf_colonisation_degraded_pct_low?: number | null
          amf_colonisation_target_pct_high?: number | null
          amf_colonisation_target_pct_low?: number | null
          avail_b_degraded_mg_kg_high?: number | null
          avail_b_degraded_mg_kg_low?: number | null
          avail_b_target_mg_kg_high?: number | null
          avail_b_target_mg_kg_low?: number | null
          avail_cu_degraded_mg_kg_high?: number | null
          avail_cu_degraded_mg_kg_low?: number | null
          avail_cu_target_mg_kg_high?: number | null
          avail_cu_target_mg_kg_low?: number | null
          avail_fe_degraded_mg_kg_high?: number | null
          avail_fe_degraded_mg_kg_low?: number | null
          avail_fe_target_mg_kg_high?: number | null
          avail_fe_target_mg_kg_low?: number | null
          avail_mn_degraded_mg_kg_high?: number | null
          avail_mn_degraded_mg_kg_low?: number | null
          avail_mn_target_mg_kg_high?: number | null
          avail_mn_target_mg_kg_low?: number | null
          avail_p_degraded_mg_kg_high?: number | null
          avail_p_degraded_mg_kg_low?: number | null
          avail_p_target_mg_kg_high?: number | null
          avail_p_target_mg_kg_low?: number | null
          avail_zn_degraded_mg_kg_high?: number | null
          avail_zn_degraded_mg_kg_low?: number | null
          avail_zn_target_mg_kg_high?: number | null
          avail_zn_target_mg_kg_low?: number | null
          b_confidence_tier?: string | null
          b_deficiency_threshold_mg_kg?: number | null
          b_notes?: string | null
          b_source?: string | null
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
          cn_ratio_peat?: number | null
          confidence_level?: string | null
          coverage_pct_indonesia?: number | null
          created_at?: string | null
          cu_confidence_tier?: string | null
          cu_deficiency_notes?: string | null
          cu_deficiency_threshold_mg_kg?: number | null
          cu_notes?: string | null
          cu_source?: string | null
          data_source?: string | null
          drainage_class?: string | null
          exch_al_degraded_cmol?: number | null
          exch_ca_degraded_cmol_high?: number | null
          exch_ca_degraded_cmol_low?: number | null
          exch_k_degraded_cmol_high?: number | null
          exch_k_degraded_cmol_low?: number | null
          exch_k_target_cmol_high?: number | null
          exch_k_target_cmol_low?: number | null
          exch_mg_degraded_cmol_high?: number | null
          exch_mg_degraded_cmol_low?: number | null
          fb_ratio_degraded_high?: number | null
          fb_ratio_degraded_low?: number | null
          fb_ratio_target_high?: number | null
          fb_ratio_target_low?: number | null
          fe_confidence_tier?: string | null
          fe_source?: string | null
          id?: number
          industry_id?: number | null
          is_active?: boolean | null
          is_peat?: boolean | null
          k_leach_pct_baseline?: number | null
          k_leach_pct_normal?: number | null
          k_leach_pct_poor?: number | null
          k_leach_pct_vgam?: number | null
          k_leach_ranges_confidence?: string | null
          k_leach_ranges_source?: string | null
          key_regions?: string | null
          local_name?: string | null
          mbc_degraded_mg_kg_high?: number | null
          mbc_degraded_mg_kg_low?: number | null
          mbc_target_mg_kg_high?: number | null
          mbc_target_mg_kg_low?: number | null
          micronutrient_sources?: string[] | null
          mn_confidence_tier?: string | null
          mn_source?: string | null
          n_leach_pct_baseline?: number | null
          n_leach_pct_normal_high?: number | null
          n_leach_pct_normal_low?: number | null
          n_leach_pct_poor_high?: number | null
          n_leach_pct_poor_low?: number | null
          n_leach_pct_vgam_high?: number | null
          n_leach_pct_vgam_low?: number | null
          n_leach_ranges_confidence?: string | null
          n_leach_ranges_source?: string | null
          notes?: string | null
          p_fix_mgmt_independent?: boolean | null
          p_fix_pct_baseline?: number | null
          p_fix_pct_normal_high?: number | null
          p_fix_pct_normal_low?: number | null
          p_fix_pct_poor_high?: number | null
          p_fix_pct_poor_low?: number | null
          p_fix_pct_vgam_high?: number | null
          p_fix_pct_vgam_low?: number | null
          p_fix_pct_vgam_target?: number | null
          p_fix_ranges_confidence?: string | null
          p_fix_ranges_source?: string | null
          p_leach_pct_baseline?: number | null
          pawc_baseline_mm?: number | null
          peat_bd_mature_g_cm3?: number | null
          peat_fiber_content_pct?: number | null
          peat_ghg_baseline_t_co2e_ha_yr?: number | null
          peat_hydraulic_conductivity_m_day?: number | null
          peat_irreversible_dry_risk?: boolean | null
          peat_n_mechanism?: string | null
          peat_organic_c_pct?: number | null
          peat_subsidence_cm_yr?: number | null
          peat_total_organic_c_pct?: number | null
          peat_whc_pct?: number | null
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
          total_n_pct?: number | null
          updated_at?: string | null
          zn_confidence_tier?: string | null
          zn_deficiency_threshold_mg_kg?: number | null
          zn_notes?: string | null
          zn_source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cfi_soil_profiles_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "cfi_industries"
            referencedColumns: ["industry_id"]
          },
          {
            foreignKeyName: "cfi_soil_profiles_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "v_industry_switcher"
            referencedColumns: ["industry_id"]
          },
        ]
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
      cfi_source_registry: {
        Row: {
          authors: string
          confidence_level: string | null
          created_at: string | null
          display_order: number | null
          display_section: string | null
          doi_url: string | null
          domain: string[] | null
          id: number
          impact_factor: number | null
          is_grey_literature: boolean | null
          is_indexed: boolean | null
          journal_publisher: string | null
          locked_version: string | null
          notes: string | null
          parameters_covered: string | null
          ref_code: string
          soils_applicable: string[] | null
          title: string
          used_in_tables: string[] | null
          weight: string | null
          year: number | null
        }
        Insert: {
          authors: string
          confidence_level?: string | null
          created_at?: string | null
          display_order?: number | null
          display_section?: string | null
          doi_url?: string | null
          domain?: string[] | null
          id?: number
          impact_factor?: number | null
          is_grey_literature?: boolean | null
          is_indexed?: boolean | null
          journal_publisher?: string | null
          locked_version?: string | null
          notes?: string | null
          parameters_covered?: string | null
          ref_code: string
          soils_applicable?: string[] | null
          title: string
          used_in_tables?: string[] | null
          weight?: string | null
          year?: number | null
        }
        Update: {
          authors?: string
          confidence_level?: string | null
          created_at?: string | null
          display_order?: number | null
          display_section?: string | null
          doi_url?: string | null
          domain?: string[] | null
          id?: number
          impact_factor?: number | null
          is_grey_literature?: boolean | null
          is_indexed?: boolean | null
          journal_publisher?: string | null
          locked_version?: string | null
          notes?: string | null
          parameters_covered?: string | null
          ref_code?: string
          soils_applicable?: string[] | null
          title?: string
          used_in_tables?: string[] | null
          weight?: string | null
          year?: number | null
        }
        Relationships: []
      }
      cfi_subsidiary_companies: {
        Row: {
          cfi_notes: string | null
          created_at: string | null
          data_confidence: string | null
          district_kabupaten: string | null
          estate_name_in_cfi_estates: string | null
          id: string
          is_estate_operator: boolean | null
          ispo_status: string | null
          latitude: number | null
          longitude: number | null
          mill_name: string | null
          parent_company: string
          planted_area_ha: number | null
          province: string | null
          rspo_status: string | null
          source_url: string | null
          subsidiary_name: string
          subsidiary_role: string | null
        }
        Insert: {
          cfi_notes?: string | null
          created_at?: string | null
          data_confidence?: string | null
          district_kabupaten?: string | null
          estate_name_in_cfi_estates?: string | null
          id?: string
          is_estate_operator?: boolean | null
          ispo_status?: string | null
          latitude?: number | null
          longitude?: number | null
          mill_name?: string | null
          parent_company: string
          planted_area_ha?: number | null
          province?: string | null
          rspo_status?: string | null
          source_url?: string | null
          subsidiary_name: string
          subsidiary_role?: string | null
        }
        Update: {
          cfi_notes?: string | null
          created_at?: string | null
          data_confidence?: string | null
          district_kabupaten?: string | null
          estate_name_in_cfi_estates?: string | null
          id?: string
          is_estate_operator?: boolean | null
          ispo_status?: string | null
          latitude?: number | null
          longitude?: number | null
          mill_name?: string | null
          parent_company?: string
          planted_area_ha?: number | null
          province?: string | null
          rspo_status?: string | null
          source_url?: string | null
          subsidiary_name?: string
          subsidiary_role?: string | null
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
      cfi_users: {
        Row: {
          approved: boolean | null
          approved_at: string | null
          approved_by: string | null
          auth_user_id: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: number
          industry_id: number | null
          last_login: string | null
          organisation: string | null
          professor_pin: string | null
          role_code: string | null
          user_uuid: string | null
        }
        Insert: {
          approved?: boolean | null
          approved_at?: string | null
          approved_by?: string | null
          auth_user_id?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id?: number
          industry_id?: number | null
          last_login?: string | null
          organisation?: string | null
          professor_pin?: string | null
          role_code?: string | null
          user_uuid?: string | null
        }
        Update: {
          approved?: boolean | null
          approved_at?: string | null
          approved_by?: string | null
          auth_user_id?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: number
          industry_id?: number | null
          last_login?: string | null
          organisation?: string | null
          professor_pin?: string | null
          role_code?: string | null
          user_uuid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cfi_users_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "cfi_industries"
            referencedColumns: ["industry_id"]
          },
          {
            foreignKeyName: "cfi_users_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "v_industry_switcher"
            referencedColumns: ["industry_id"]
          },
          {
            foreignKeyName: "cfi_users_role_code_fkey"
            columns: ["role_code"]
            isOneToOne: false
            referencedRelation: "cfi_roles"
            referencedColumns: ["role_code"]
          },
        ]
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
          industry_id: number | null
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
          industry_id?: number | null
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
          industry_id?: number | null
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
        Relationships: [
          {
            foreignKeyName: "chemical_library_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "cfi_industries"
            referencedColumns: ["industry_id"]
          },
          {
            foreignKeyName: "chemical_library_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "v_industry_switcher"
            referencedColumns: ["industry_id"]
          },
        ]
      }
      consortium_master_rules: {
        Row: {
          affected_organisms: string[] | null
          consequences: string | null
          created_at: string | null
          expert_panel: string | null
          id: number
          rule_description: string | null
          rule_name: string
          rule_type: string
          severity: string | null
          validation_method: string | null
        }
        Insert: {
          affected_organisms?: string[] | null
          consequences?: string | null
          created_at?: string | null
          expert_panel?: string | null
          id?: number
          rule_description?: string | null
          rule_name: string
          rule_type: string
          severity?: string | null
          validation_method?: string | null
        }
        Update: {
          affected_organisms?: string[] | null
          consequences?: string | null
          created_at?: string | null
          expert_panel?: string | null
          id?: number
          rule_description?: string | null
          rule_name?: string
          rule_type?: string
          severity?: string | null
          validation_method?: string | null
        }
        Relationships: []
      }
      consortium_validation_summary: {
        Row: {
          bsf_safe_count: number | null
          bsf_toxic_count: number | null
          conditional_count: number | null
          confidence_level: string | null
          critical_conflicts: number | null
          hard_gates: number | null
          id: number
          mandatory_pairings: number | null
          pre_wave_count: number | null
          total_organisms: number | null
          validated_by: string | null
          validation_date: string | null
          wave_1a_count: number | null
          wave_1b_count: number | null
          wave_2_count: number | null
        }
        Insert: {
          bsf_safe_count?: number | null
          bsf_toxic_count?: number | null
          conditional_count?: number | null
          confidence_level?: string | null
          critical_conflicts?: number | null
          hard_gates?: number | null
          id?: number
          mandatory_pairings?: number | null
          pre_wave_count?: number | null
          total_organisms?: number | null
          validated_by?: string | null
          validation_date?: string | null
          wave_1a_count?: number | null
          wave_1b_count?: number | null
          wave_2_count?: number | null
        }
        Update: {
          bsf_safe_count?: number | null
          bsf_toxic_count?: number | null
          conditional_count?: number | null
          confidence_level?: string | null
          critical_conflicts?: number | null
          hard_gates?: number | null
          id?: number
          mandatory_pairings?: number | null
          pre_wave_count?: number | null
          total_organisms?: number | null
          validated_by?: string | null
          validation_date?: string | null
          wave_1a_count?: number | null
          wave_1b_count?: number | null
          wave_2_count?: number | null
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
          industry_id: number | null
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
          industry_id?: number | null
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
          industry_id?: number | null
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
            foreignKeyName: "equipment_catalogue_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "cfi_industries"
            referencedColumns: ["industry_id"]
          },
          {
            foreignKeyName: "equipment_catalogue_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "v_industry_switcher"
            referencedColumns: ["industry_id"]
          },
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
          model_notes: string | null
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
          model_notes?: string | null
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
          model_notes?: string | null
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
          custom_stream_1_enabled: boolean | null
          custom_stream_1_label: string | null
          custom_stream_2_enabled: boolean | null
          custom_stream_2_label: string | null
          industry_id: number | null
          mill_id: string
          name: string
          operating_days_m: number
          operating_hours_d: number
          session_count: number | null
          session_date: string | null
          utilisation_pct: number
        }
        Insert: {
          capacity_tph: number
          custom_stream_1_enabled?: boolean | null
          custom_stream_1_label?: string | null
          custom_stream_2_enabled?: boolean | null
          custom_stream_2_label?: string | null
          industry_id?: number | null
          mill_id?: string
          name: string
          operating_days_m: number
          operating_hours_d: number
          session_count?: number | null
          session_date?: string | null
          utilisation_pct: number
        }
        Update: {
          capacity_tph?: number
          custom_stream_1_enabled?: boolean | null
          custom_stream_1_label?: string | null
          custom_stream_2_enabled?: boolean | null
          custom_stream_2_label?: string | null
          industry_id?: number | null
          mill_id?: string
          name?: string
          operating_days_m?: number
          operating_hours_d?: number
          session_count?: number | null
          session_date?: string | null
          utilisation_pct?: number
        }
        Relationships: [
          {
            foreignKeyName: "mills_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "cfi_industries"
            referencedColumns: ["industry_id"]
          },
          {
            foreignKeyName: "mills_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "v_industry_switcher"
            referencedColumns: ["industry_id"]
          },
        ]
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
          fw_t_per_month: number | null
          mass_basis: string | null
          notes: string | null
          residue_id: string | null
          residues_mass_id: string
        }
        Insert: {
          dm_t_per_month?: number | null
          estate_id?: string | null
          ffb_share_pct?: number | null
          fw_t_per_month?: number | null
          mass_basis?: string | null
          notes?: string | null
          residue_id?: string | null
          residues_mass_id?: string
        }
        Update: {
          dm_t_per_month?: number | null
          estate_id?: string | null
          ffb_share_pct?: number | null
          fw_t_per_month?: number | null
          mass_basis?: string | null
          notes?: string | null
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
      weather_cache: {
        Row: {
          fetched_at: string | null
          gps_lat: number | null
          gps_lng: number | null
          id: number
          location_key: string | null
          province: string | null
          rain_apr: number | null
          rain_aug: number | null
          rain_dec: number | null
          rain_feb: number | null
          rain_jan: number | null
          rain_jul: number | null
          rain_jun: number | null
          rain_mar: number | null
          rain_may: number | null
          rain_nov: number | null
          rain_oct: number | null
          rain_sep: number | null
          source: string | null
          temp_apr: number | null
          temp_aug: number | null
          temp_dec: number | null
          temp_feb: number | null
          temp_jan: number | null
          temp_jul: number | null
          temp_jun: number | null
          temp_mar: number | null
          temp_may: number | null
          temp_nov: number | null
          temp_oct: number | null
          temp_sep: number | null
        }
        Insert: {
          fetched_at?: string | null
          gps_lat?: number | null
          gps_lng?: number | null
          id?: number
          location_key?: string | null
          province?: string | null
          rain_apr?: number | null
          rain_aug?: number | null
          rain_dec?: number | null
          rain_feb?: number | null
          rain_jan?: number | null
          rain_jul?: number | null
          rain_jun?: number | null
          rain_mar?: number | null
          rain_may?: number | null
          rain_nov?: number | null
          rain_oct?: number | null
          rain_sep?: number | null
          source?: string | null
          temp_apr?: number | null
          temp_aug?: number | null
          temp_dec?: number | null
          temp_feb?: number | null
          temp_jan?: number | null
          temp_jul?: number | null
          temp_jun?: number | null
          temp_mar?: number | null
          temp_may?: number | null
          temp_nov?: number | null
          temp_oct?: number | null
          temp_sep?: number | null
        }
        Update: {
          fetched_at?: string | null
          gps_lat?: number | null
          gps_lng?: number | null
          id?: number
          location_key?: string | null
          province?: string | null
          rain_apr?: number | null
          rain_aug?: number | null
          rain_dec?: number | null
          rain_feb?: number | null
          rain_jan?: number | null
          rain_jul?: number | null
          rain_jun?: number | null
          rain_mar?: number | null
          rain_may?: number | null
          rain_nov?: number | null
          rain_oct?: number | null
          rain_sep?: number | null
          source?: string | null
          temp_apr?: number | null
          temp_aug?: number | null
          temp_dec?: number | null
          temp_feb?: number | null
          temp_jan?: number | null
          temp_jul?: number | null
          temp_jun?: number | null
          temp_mar?: number | null
          temp_may?: number | null
          temp_nov?: number | null
          temp_oct?: number | null
          temp_sep?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      cfi_capex_stage_summary: {
        Row: {
          confirmed_cost_usd: number | null
          equipment_count: number | null
          rfq_high_usd: number | null
          rfq_items: number | null
          rfq_low_usd: number | null
          stage: string | null
        }
        Relationships: []
      }
      cfi_kcp_map: {
        Row: {
          capacity_t_kernels_day: number | null
          cfi_pkm_opportunity: string | null
          cfi_prospect_tier: string | null
          confidence_level: string | null
          est_pkm_output_t_month: number | null
          kcp_name: string | null
          location_city_port: string | null
          location_province: string | null
          on_site_at_mill: boolean | null
          operator_company: string | null
          owner_company: string | null
          pkm_price_usd_t: string | null
          pkm_type: string | null
        }
        Relationships: []
      }
      cfi_mill_full_profile: {
        Row: {
          capacity_tph: number | null
          cfi_approach_status: string | null
          cfi_n_loss_flag: string | null
          cfi_notes: string | null
          cfi_p_fixation_flag: string | null
          cfi_priority_amendment: string | null
          cfi_prospect_tier: string | null
          dominant_soil_local: string | null
          efb_t_yr: number | null
          has_kernel_crushing_plant: boolean | null
          island: string | null
          latitude: number | null
          liming_required: boolean | null
          longitude: number | null
          mill_id: number | null
          mill_name: string | null
          n_loss_pct_max: number | null
          n_loss_pct_min: number | null
          opdc_t_yr: number | null
          owner_company: string | null
          p_fix_pct_max: number | null
          p_fix_pct_min: number | null
          peat_present: boolean | null
          ph_max: number | null
          ph_min: number | null
          pkm_available_on_site: boolean | null
          pkm_t_yr_est: number | null
          province: string | null
          rainfall_mm_yr_max: number | null
          rainfall_mm_yr_min: number | null
          region: string | null
          rspo_status: string | null
          soil_confidence: string | null
          soil_type: string | null
        }
        Relationships: []
      }
      cfi_tier1_targets: {
        Row: {
          cfi_prospect_tier: string | null
          company: string | null
          has_kernel_crushing_plant: boolean | null
          mills_in_database: number | null
          number_of_mills: number | null
          pkm_available_on_site: boolean | null
          planted_area_ha: number | null
          province_locations: string | null
          rspo_status: string | null
          total_efb_t_yr: number | null
          total_opdc_t_yr: number | null
        }
        Relationships: []
      }
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
      v_industry_switcher: {
        Row: {
          agent_data_seeded: boolean | null
          crop_name: string | null
          estate_label: string | null
          feedstreams: Json | null
          industry_id: number | null
          industry_name: string | null
          is_live: boolean | null
          notes: string | null
          operator_label: string | null
          primary_country: string | null
          processing_label: string | null
          processing_unit: string | null
          regulatory_body: string | null
          stream_count: number | null
          tasks_complete: number | null
          tasks_total: number | null
        }
        Relationships: []
      }
      v_lab_display_current: {
        Row: {
          "Display as": string | null
          "Is final product": boolean | null
          "Show lab data from": string | null
          "User is on page": string | null
        }
        Insert: {
          "Display as"?: string | null
          "Is final product"?: boolean | null
          "Show lab data from"?: string | null
          "User is on page"?: string | null
        }
        Update: {
          "Display as"?: string | null
          "Is final product"?: boolean | null
          "Show lab data from"?: string | null
          "User is on page"?: string | null
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
      v_soil_recommendation_summary: {
        Row: {
          approved_count: number | null
          avg_score: number | null
          data_gap_count: number | null
          high_confidence_count: number | null
          low_confidence_count: number | null
          max_score: number | null
          medium_confidence_count: number | null
          soil_type: string | null
          total_organisms_scored: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      generate_1wave_economical: {
        Args: { p_max_cost?: number; p_soil_type: string }
        Returns: {
          benefit_category: string
          cost_per_tonne_fw: number
          cumulative_cost: number
          organism_name: string
          soil_score: number
          wave_assignment: string
        }[]
      }
      generate_2wave_economical: {
        Args: { p_max_cost?: number; p_soil_type: string }
        Returns: {
          application_day: number
          benefit_category: string
          cost_per_tonne_fw: number
          cumulative_cost: number
          organism_name: string
          wave_assignment: string
        }[]
      }
      generate_3wave_economical: {
        Args: {
          p_current_temp?: number
          p_max_cost?: number
          p_soil_type: string
        }
        Returns: {
          application_day: number
          benefit_category: string
          cost_per_tonne_fw: number
          cumulative_cost: number
          organism_name: string
          temp_gate_status: string
          wave_assignment: string
        }[]
      }
      generate_soil_optimized_stack: {
        Args: { p_max_cost?: number; p_soil_type: string }
        Returns: {
          benefit_category: string
          cost_per_tonne_fw: number
          organism_name: string
          soil_score: number
          wave_assignment: string
        }[]
      }
      get_lab_display_stage: { Args: { page_stage: string }; Returns: string }
      get_soil_acidity_class: {
        Args: { p_lat: number; p_lon: number; p_max_distance_km?: number }
        Returns: {
          acidity_class: number
          cfi_lime_flag: boolean
          cfi_note: string
          class_name: string
          distance_km: number
          ph_midpoint: number
          ph_range: string
        }[]
      }
      get_top_organisms_for_soil: {
        Args: { p_limit?: number; p_min_score?: number; p_soil_type: string }
        Returns: {
          confidence_level: string
          lignin_score: number
          literature_source: string
          mechanism: string
          organism_name: string
          p_releaser_score: number
          soil_specific_score: number
        }[]
      }
      rank_organisms_by_objective: {
        Args: { p_limit?: number; p_objective: string; p_soil_type: string }
        Returns: {
          constraint_notes: string
          cost_per_tonne_fw: number
          mechanism: string
          objective_score: number
          organism_name: string
          rank: number
          soil_specific_score: number
          value_ratio: number
          wave_assignment: string
        }[]
      }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
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
