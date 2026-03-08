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
      device_info: {
        Row: {
          battery_level: number
          connection_state: string
          created_at: string
          firmware_version: string
          id: string
          last_seen_at: string | null
          last_seen_lat: number | null
          last_seen_lng: number | null
          model: string
          serial_number: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          battery_level?: number
          connection_state?: string
          created_at?: string
          firmware_version?: string
          id?: string
          last_seen_at?: string | null
          last_seen_lat?: number | null
          last_seen_lng?: number | null
          model?: string
          serial_number?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          battery_level?: number
          connection_state?: string
          created_at?: string
          firmware_version?: string
          id?: string
          last_seen_at?: string | null
          last_seen_lat?: number | null
          last_seen_lng?: number | null
          model?: string
          serial_number?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      gesture_configs: {
        Row: {
          action: string
          created_at: string
          enabled: boolean
          gesture_type: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          enabled?: boolean
          gesture_type: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          enabled?: boolean
          gesture_type?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      haptic_profiles: {
        Row: {
          created_at: string
          enabled: boolean
          id: string
          intensity: number
          pattern: string
          profile_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          enabled?: boolean
          id?: string
          intensity?: number
          pattern?: string
          profile_name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          enabled?: boolean
          id?: string
          intensity?: number
          pattern?: string
          profile_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      health_readings: {
        Row: {
          active_mins: number | null
          calories: number | null
          created_at: string
          distance_m: number | null
          heart_rate: number | null
          hrv: number | null
          id: string
          is_manual_stress_event: boolean
          notes: string | null
          readiness_score: number | null
          recorded_at: string
          sleep_awake_mins: number | null
          sleep_deep_mins: number | null
          sleep_duration_mins: number | null
          sleep_light_mins: number | null
          sleep_rem_mins: number | null
          sleep_score: number | null
          steps: number | null
          stress_score: number | null
          user_id: string
        }
        Insert: {
          active_mins?: number | null
          calories?: number | null
          created_at?: string
          distance_m?: number | null
          heart_rate?: number | null
          hrv?: number | null
          id?: string
          is_manual_stress_event?: boolean
          notes?: string | null
          readiness_score?: number | null
          recorded_at?: string
          sleep_awake_mins?: number | null
          sleep_deep_mins?: number | null
          sleep_duration_mins?: number | null
          sleep_light_mins?: number | null
          sleep_rem_mins?: number | null
          sleep_score?: number | null
          steps?: number | null
          stress_score?: number | null
          user_id: string
        }
        Update: {
          active_mins?: number | null
          calories?: number | null
          created_at?: string
          distance_m?: number | null
          heart_rate?: number | null
          hrv?: number | null
          id?: string
          is_manual_stress_event?: boolean
          notes?: string | null
          readiness_score?: number | null
          recorded_at?: string
          sleep_awake_mins?: number | null
          sleep_deep_mins?: number | null
          sleep_duration_mins?: number | null
          sleep_light_mins?: number | null
          sleep_rem_mins?: number | null
          sleep_score?: number | null
          steps?: number | null
          stress_score?: number | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age: number | null
          created_at: string
          display_name: string | null
          id: string
          onboarding_done: boolean
          units: string
          updated_at: string
          user_id: string
        }
        Insert: {
          age?: number | null
          created_at?: string
          display_name?: string | null
          id?: string
          onboarding_done?: boolean
          units?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          age?: number | null
          created_at?: string
          display_name?: string | null
          id?: string
          onboarding_done?: boolean
          units?: string
          updated_at?: string
          user_id?: string
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
