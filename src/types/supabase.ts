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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      badges: {
        Row: {
          created_at: string | null
          criteria: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          criteria?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          criteria?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      booking: {
        Row: {
          booking_date: string
          booking_time: string | null
          category: string | null
          created_at: string | null
          id: string
          notes: string | null
          professional_id: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          booking_date: string
          booking_time?: string | null
          category?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          professional_id?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          booking_date?: string
          booking_time?: string | null
          category?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          professional_id?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "booking_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          appointment_date: string | null
          created_at: string | null
          id: string
          notes: string | null
          payment_ref: string | null
          price: number | null
          professional_id: string
          screening_id: string | null
          session_time: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          appointment_date?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          payment_ref?: string | null
          price?: number | null
          professional_id: string
          screening_id?: string | null
          session_time?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          appointment_date?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          payment_ref?: string | null
          price?: number | null
          professional_id?: string
          screening_id?: string | null
          session_time?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_screening_id_fkey"
            columns: ["screening_id"]
            isOneToOne: false
            referencedRelation: "screenings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      care_category: {
        Row: {
          description: string | null
          id: string
          name: string
        }
        Insert: {
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      care_chat_messages: {
        Row: {
          channel_id: string
          created_at: string | null
          id: string
          message: string
          sender_id: string
        }
        Insert: {
          channel_id: string
          created_at?: string | null
          id?: string
          message: string
          sender_id: string
        }
        Update: {
          channel_id?: string
          created_at?: string | null
          id?: string
          message?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "care_chat_messages_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "chat_channels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "care_chat_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_channels: {
        Row: {
          booking_id: string | null
          created_at: string | null
          id: string
          professional_id: string
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          booking_id?: string | null
          created_at?: string | null
          id?: string
          professional_id: string
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          booking_id?: string | null
          created_at?: string | null
          id?: string
          professional_id?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_channels_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_channels_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_channels_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_history: {
        Row: {
          created_at: string | null
          id: string
          message_content: string | null
          message_role: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message_content?: string | null
          message_role?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message_content?: string | null
          message_role?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          sender: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          sender: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          sender?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_usage: {
        Row: {
          chat_count: number | null
          chat_limit: number | null
          created_at: string | null
          id: string
          is_premium: boolean | null
          reset_at: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          chat_count?: number | null
          chat_limit?: number | null
          created_at?: string | null
          id?: string
          is_premium?: boolean | null
          reset_at?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          chat_count?: number | null
          chat_limit?: number | null
          created_at?: string | null
          id?: string
          is_premium?: boolean | null
          reset_at?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_usage_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          content: string | null
          embedding: string | null
          id: number
          metadata: Json | null
        }
        Insert: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Update: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Relationships: []
      }
      insight: {
        Row: {
          ai_comment: string | null
          created_at: string | null
          id: string
          summary: string | null
          user_id: string | null
          week_end: string | null
          week_start: string | null
        }
        Insert: {
          ai_comment?: string | null
          created_at?: string | null
          id?: string
          summary?: string | null
          user_id?: string | null
          week_end?: string | null
          week_start?: string | null
        }
        Update: {
          ai_comment?: string | null
          created_at?: string | null
          id?: string
          summary?: string | null
          user_id?: string | null
          week_end?: string | null
          week_start?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "insight_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      insights: {
        Row: {
          average_mood: number | null
          created_at: string | null
          id: string
          journal_count: number | null
          mood_trend: string | null
          recommendations: string[] | null
          top_emotions: string[] | null
          user_id: string
          week_end: string
          week_start: string
        }
        Insert: {
          average_mood?: number | null
          created_at?: string | null
          id?: string
          journal_count?: number | null
          mood_trend?: string | null
          recommendations?: string[] | null
          top_emotions?: string[] | null
          user_id: string
          week_end: string
          week_start: string
        }
        Update: {
          average_mood?: number | null
          created_at?: string | null
          id?: string
          journal_count?: number | null
          mood_trend?: string | null
          recommendations?: string[] | null
          top_emotions?: string[] | null
          user_id?: string
          week_end?: string
          week_start?: string
        }
        Relationships: [
          {
            foreignKeyName: "insights_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      journal: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          mood_tag: string | null
          title: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          mood_tag?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          mood_tag?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "journal_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      journals: {
        Row: {
          content: string
          created_at: string | null
          id: string
          mood_id: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          mood_id?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          mood_id?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "journals_mood_id_fkey"
            columns: ["mood_id"]
            isOneToOne: false
            referencedRelation: "moods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "journals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      mood_log: {
        Row: {
          created_at: string | null
          date: string | null
          id: string
          mood_score: number | null
          note: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          date?: string | null
          id?: string
          mood_score?: number | null
          note?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string | null
          id?: string
          mood_score?: number | null
          note?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mood_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      moods: {
        Row: {
          created_at: string | null
          id: string
          mood_label: string
          mood_value: number
          note: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          mood_label: string
          mood_value: number
          note?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          mood_label?: string
          mood_value?: number
          note?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "moods_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      n8n_chat: {
        Row: {
          id: number
          message: Json
          session_id: string
        }
        Insert: {
          id?: number
          message: Json
          session_id: string
        }
        Update: {
          id?: number
          message?: Json
          session_id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          metadata: Json | null
          payment_type: string
          qris_link: string | null
          ref_code: string
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          metadata?: Json | null
          payment_type: string
          qris_link?: string | null
          ref_code: string
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          metadata?: Json | null
          payment_type?: string
          qris_link?: string | null
          ref_code?: string
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      plans: {
        Row: {
          created_at: string | null
          description: string | null
          duration_days: number
          features: Json | null
          id: string
          name: string
          price: number
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          duration_days: number
          features?: Json | null
          id?: string
          name: string
          price: number
        }
        Update: {
          created_at?: string | null
          description?: string | null
          duration_days?: number
          features?: Json | null
          id?: string
          name?: string
          price?: number
        }
        Relationships: []
      }
      professionals: {
        Row: {
          bio: string | null
          category: string | null
          category_id: string | null
          contact_email: string | null
          created_at: string | null
          id: string
          is_available: boolean | null
          photo_url: string | null
          price_per_session: number | null
          rating: number | null
          specialization: string | null
          title: string | null
          user_id: string | null
        }
        Insert: {
          bio?: string | null
          category?: string | null
          category_id?: string | null
          contact_email?: string | null
          created_at?: string | null
          id?: string
          is_available?: boolean | null
          photo_url?: string | null
          price_per_session?: number | null
          rating?: number | null
          specialization?: string | null
          title?: string | null
          user_id?: string | null
        }
        Update: {
          bio?: string | null
          category?: string | null
          category_id?: string | null
          contact_email?: string | null
          created_at?: string | null
          id?: string
          is_available?: boolean | null
          photo_url?: string | null
          price_per_session?: number | null
          rating?: number | null
          specialization?: string | null
          title?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "professionals_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "care_category"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "professionals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      rewards: {
        Row: {
          description: string | null
          earned_at: string | null
          id: string
          points: number | null
          title: string
          user_id: string
        }
        Insert: {
          description?: string | null
          earned_at?: string | null
          id?: string
          points?: number | null
          title: string
          user_id: string
        }
        Update: {
          description?: string | null
          earned_at?: string | null
          id?: string
          points?: number | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rewards_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      screening: {
        Row: {
          answers: Json | null
          created_at: string | null
          id: string
          recommendation: string | null
          score: number | null
          type: string
          user_id: string | null
        }
        Insert: {
          answers?: Json | null
          created_at?: string | null
          id?: string
          recommendation?: string | null
          score?: number | null
          type: string
          user_id?: string | null
        }
        Update: {
          answers?: Json | null
          created_at?: string | null
          id?: string
          recommendation?: string | null
          score?: number | null
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "screening_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      screenings: {
        Row: {
          created_at: string | null
          id: string
          responses: Json | null
          result_data: Json | null
          score: number | null
          screening_type: string
          severity_level: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          responses?: Json | null
          result_data?: Json | null
          score?: number | null
          screening_type: string
          severity_level?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          responses?: Json | null
          result_data?: Json | null
          score?: number | null
          screening_type?: string
          severity_level?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "screenings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          created_at: string | null
          end_date: string | null
          id: string
          payment_ref: string | null
          plan_id: string
          start_date: string | null
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          end_date?: string | null
          id?: string
          payment_ref?: string | null
          plan_id: string
          start_date?: string | null
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          end_date?: string | null
          id?: string
          payment_ref?: string | null
          plan_id?: string
          start_date?: string | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      user_badges: {
        Row: {
          badge_id: string | null
          earned_at: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          badge_id?: string | null
          earned_at?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          badge_id?: string | null
          earned_at?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          role: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id?: string
          role?: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_chat_count: { Args: { p_user_id: string }; Returns: undefined }
      match_documents: {
        Args: { filter?: Json; match_count?: number; query_embedding: string }
        Returns: {
          content: string
          id: number
          metadata: Json
          similarity: number
        }[]
      }
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
