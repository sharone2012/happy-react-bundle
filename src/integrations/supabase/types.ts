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
          guardrail_note: string | null
          id: number
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
          guardrail_note?: string | null
          id?: number
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
          guardrail_note?: string | null
          id?: number
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
          mcf_value: number | null
          method_liquid: string | null
          method_solid: string | null
          notes: string | null
          opdc_capture_pct: number | null
          opdc_t_day: number | null
          pome_capture_pct: number | null
          pome_t_day: number | null
          registry: string | null
          revenue_base_usd: number | null
          revenue_high_usd: number | null
          revenue_low_usd: number | null
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
          mcf_value?: number | null
          method_liquid?: string | null
          method_solid?: string | null
          notes?: string | null
          opdc_capture_pct?: number | null
          opdc_t_day?: number | null
          pome_capture_pct?: number | null
          pome_t_day?: number | null
          registry?: string | null
          revenue_base_usd?: number | null
          revenue_high_usd?: number | null
          revenue_low_usd?: number | null
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
          mcf_value?: number | null
          method_liquid?: string | null
          method_solid?: string | null
          notes?: string | null
          opdc_capture_pct?: number | null
          opdc_t_day?: number | null
          pome_capture_pct?: number | null
          pome_t_day?: number | null
          registry?: string | null
          revenue_base_usd?: number | null
          revenue_high_usd?: number | null
          revenue_low_usd?: number | null
        }
        Relationships: []
      }
      cfi_solutions: {
        Row: {
          agent: string | null
          benefit_usd: number | null
          confidence: string | null
          cost_usd: number | null
          id: number
          last_updated: string | null
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
          benefit_usd?: number | null
          confidence?: string | null
          cost_usd?: number | null
          id?: number
          last_updated?: string | null
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
          benefit_usd?: number | null
          confidence?: string | null
          cost_usd?: number | null
          id?: number
          last_updated?: string | null
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
      equipment_catalogue: {
        Row: {
          annual_maintenance: number | null
          capacity_unit: string | null
          capex_usd: number | null
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
          stage: string | null
        }
        Insert: {
          annual_maintenance?: number | null
          capacity_unit?: string | null
          capex_usd?: number | null
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
          stage?: string | null
        }
        Update: {
          annual_maintenance?: number | null
          capacity_unit?: string | null
          capex_usd?: number | null
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
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
