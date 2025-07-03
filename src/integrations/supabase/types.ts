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
      monthly_questionnaires: {
        Row: {
          created_at: string | null
          due_date: string
          employee_id: string
          employee_name: string
          id: string
          manager_id: string
          month: number
          status: Database["public"]["Enums"]["questionnaire_status"] | null
          updated_at: string | null
          year: number
        }
        Insert: {
          created_at?: string | null
          due_date: string
          employee_id: string
          employee_name: string
          id?: string
          manager_id: string
          month: number
          status?: Database["public"]["Enums"]["questionnaire_status"] | null
          updated_at?: string | null
          year: number
        }
        Update: {
          created_at?: string | null
          due_date?: string
          employee_id?: string
          employee_name?: string
          id?: string
          manager_id?: string
          month?: number
          status?: Database["public"]["Enums"]["questionnaire_status"] | null
          updated_at?: string | null
          year?: number
        }
        Relationships: []
      }
      progress_evaluations: {
        Row: {
          ai_suggestions: string | null
          areas_for_improvement: string | null
          created_at: string | null
          employee_message: string | null
          goals_on_track: boolean
          id: string
          manager_comments: string | null
          overall_rating: Database["public"]["Enums"]["progress_evaluation"]
          questionnaire_id: string | null
          slack_message_sent: boolean | null
        }
        Insert: {
          ai_suggestions?: string | null
          areas_for_improvement?: string | null
          created_at?: string | null
          employee_message?: string | null
          goals_on_track: boolean
          id?: string
          manager_comments?: string | null
          overall_rating: Database["public"]["Enums"]["progress_evaluation"]
          questionnaire_id?: string | null
          slack_message_sent?: boolean | null
        }
        Update: {
          ai_suggestions?: string | null
          areas_for_improvement?: string | null
          created_at?: string | null
          employee_message?: string | null
          goals_on_track?: boolean
          id?: string
          manager_comments?: string | null
          overall_rating?: Database["public"]["Enums"]["progress_evaluation"]
          questionnaire_id?: string | null
          slack_message_sent?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "progress_evaluations_questionnaire_id_fkey"
            columns: ["questionnaire_id"]
            isOneToOne: false
            referencedRelation: "monthly_questionnaires"
            referencedColumns: ["id"]
          },
        ]
      }
      questionnaire_responses: {
        Row: {
          created_at: string | null
          id: string
          question: string
          questionnaire_id: string | null
          response: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          question: string
          questionnaire_id?: string | null
          response: string
        }
        Update: {
          created_at?: string | null
          id?: string
          question?: string
          questionnaire_id?: string | null
          response?: string
        }
        Relationships: [
          {
            foreignKeyName: "questionnaire_responses_questionnaire_id_fkey"
            columns: ["questionnaire_id"]
            isOneToOne: false
            referencedRelation: "monthly_questionnaires"
            referencedColumns: ["id"]
          },
        ]
      }
      slack_messages: {
        Row: {
          employee_id: string
          id: string
          message_content: string
          message_type: string
          questionnaire_id: string | null
          sent_at: string | null
          slack_response: Json | null
        }
        Insert: {
          employee_id: string
          id?: string
          message_content: string
          message_type: string
          questionnaire_id?: string | null
          sent_at?: string | null
          slack_response?: Json | null
        }
        Update: {
          employee_id?: string
          id?: string
          message_content?: string
          message_type?: string
          questionnaire_id?: string | null
          sent_at?: string | null
          slack_response?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "slack_messages_questionnaire_id_fkey"
            columns: ["questionnaire_id"]
            isOneToOne: false
            referencedRelation: "monthly_questionnaires"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      progress_evaluation: "excellent" | "good" | "needs_improvement" | "poor"
      questionnaire_status: "pending" | "completed" | "overdue"
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
    Enums: {
      progress_evaluation: ["excellent", "good", "needs_improvement", "poor"],
      questionnaire_status: ["pending", "completed", "overdue"],
    },
  },
} as const
