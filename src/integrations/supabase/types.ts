export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      daily_progress: {
        Row: {
          created_at: string
          date: string
          exercise_minutes: number | null
          id: string
          total_calories: number | null
          total_carbs: number | null
          total_fats: number | null
          total_fiber: number | null
          total_proteins: number | null
          updated_at: string
          user_id: string
          water_intake: number | null
          weight: number | null
        }
        Insert: {
          created_at?: string
          date: string
          exercise_minutes?: number | null
          id?: string
          total_calories?: number | null
          total_carbs?: number | null
          total_fats?: number | null
          total_fiber?: number | null
          total_proteins?: number | null
          updated_at?: string
          user_id: string
          water_intake?: number | null
          weight?: number | null
        }
        Update: {
          created_at?: string
          date?: string
          exercise_minutes?: number | null
          id?: string
          total_calories?: number | null
          total_carbs?: number | null
          total_fats?: number | null
          total_fiber?: number | null
          total_proteins?: number | null
          updated_at?: string
          user_id?: string
          water_intake?: number | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "daily_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      meal_images: {
        Row: {
          analysis_data: Json | null
          created_at: string
          id: string
          image_url: string
          meal_id: string
        }
        Insert: {
          analysis_data?: Json | null
          created_at?: string
          id?: string
          image_url: string
          meal_id: string
        }
        Update: {
          analysis_data?: Json | null
          created_at?: string
          id?: string
          image_url?: string
          meal_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "meal_images_meal_id_fkey"
            columns: ["meal_id"]
            isOneToOne: false
            referencedRelation: "meals"
            referencedColumns: ["id"]
          },
        ]
      }
      meals: {
        Row: {
          calories: number
          carbs: number | null
          consumed_at: string
          created_at: string
          fats: number | null
          fiber: number | null
          id: string
          image_url: string | null
          meal_type: string | null
          name: string
          proteins: number | null
          sodium: number | null
          user_id: string
        }
        Insert: {
          calories: number
          carbs?: number | null
          consumed_at?: string
          created_at?: string
          fats?: number | null
          fiber?: number | null
          id?: string
          image_url?: string | null
          meal_type?: string | null
          name: string
          proteins?: number | null
          sodium?: number | null
          user_id: string
        }
        Update: {
          calories?: number
          carbs?: number | null
          consumed_at?: string
          created_at?: string
          fats?: number | null
          fiber?: number | null
          id?: string
          image_url?: string | null
          meal_type?: string | null
          name?: string
          proteins?: number | null
          sodium?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "meals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          activity_level: string | null
          age: number | null
          carb_goal: number | null
          created_at: string
          daily_calorie_goal: number | null
          daily_exercise_goal: number | null
          daily_water_goal: number | null
          email: string | null
          fat_goal: number | null
          full_name: string | null
          goal: string | null
          height: number | null
          id: string
          main_objective: string | null
          protein_goal: number | null
          target_weight: number | null
          updated_at: string
          weekly_weight_goal: number | null
          weight: number | null
        }
        Insert: {
          activity_level?: string | null
          age?: number | null
          carb_goal?: number | null
          created_at?: string
          daily_calorie_goal?: number | null
          daily_exercise_goal?: number | null
          daily_water_goal?: number | null
          email?: string | null
          fat_goal?: number | null
          full_name?: string | null
          goal?: string | null
          height?: number | null
          id: string
          main_objective?: string | null
          protein_goal?: number | null
          target_weight?: number | null
          updated_at?: string
          weekly_weight_goal?: number | null
          weight?: number | null
        }
        Update: {
          activity_level?: string | null
          age?: number | null
          carb_goal?: number | null
          created_at?: string
          daily_calorie_goal?: number | null
          daily_exercise_goal?: number | null
          daily_water_goal?: number | null
          email?: string | null
          fat_goal?: number | null
          full_name?: string | null
          goal?: string | null
          height?: number | null
          id?: string
          main_objective?: string | null
          protein_goal?: number | null
          target_weight?: number | null
          updated_at?: string
          weekly_weight_goal?: number | null
          weight?: number | null
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
