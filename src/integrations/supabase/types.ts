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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          rarity: string
          title: string
          unlocked: boolean
          unlocked_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          rarity?: string
          title: string
          unlocked?: boolean
          unlocked_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          rarity?: string
          title?: string
          unlocked?: boolean
          unlocked_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      finance_transactions: {
        Row: {
          amount: number
          category: string | null
          created_at: string
          currency: string
          date: string
          id: string
          notes: string | null
          title: string
          type: string
          user_id: string
          wallet_id: string | null
        }
        Insert: {
          amount: number
          category?: string | null
          created_at?: string
          currency?: string
          date?: string
          id?: string
          notes?: string | null
          title: string
          type: string
          user_id: string
          wallet_id?: string | null
        }
        Update: {
          amount?: number
          category?: string | null
          created_at?: string
          currency?: string
          date?: string
          id?: string
          notes?: string | null
          title?: string
          type?: string
          user_id?: string
          wallet_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "finance_transactions_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      goals: {
        Row: {
          category: string
          created_at: string
          deadline: string | null
          description: string | null
          id: string
          image_url: string | null
          progress: number
          target: number
          title: string
          updated_at: string
          user_id: string
          xp_reward: number
        }
        Insert: {
          category?: string
          created_at?: string
          deadline?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          progress?: number
          target?: number
          title: string
          updated_at?: string
          user_id: string
          xp_reward?: number
        }
        Update: {
          category?: string
          created_at?: string
          deadline?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          progress?: number
          target?: number
          title?: string
          updated_at?: string
          user_id?: string
          xp_reward?: number
        }
        Relationships: []
      }
      habits: {
        Row: {
          category: string
          completed_today: boolean
          created_at: string
          difficulty: string | null
          icon: string | null
          id: string
          image_url: string | null
          last_completed_at: string | null
          name: string
          repeat_frequency: string | null
          streak: number
          updated_at: string
          user_id: string
          xp_reward: number | null
        }
        Insert: {
          category?: string
          completed_today?: boolean
          created_at?: string
          difficulty?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          last_completed_at?: string | null
          name: string
          repeat_frequency?: string | null
          streak?: number
          updated_at?: string
          user_id: string
          xp_reward?: number | null
        }
        Update: {
          category?: string
          completed_today?: boolean
          created_at?: string
          difficulty?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          last_completed_at?: string | null
          name?: string
          repeat_frequency?: string | null
          streak?: number
          updated_at?: string
          user_id?: string
          xp_reward?: number | null
        }
        Relationships: []
      }
      inventory_items: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          location: string | null
          name: string
          purchase_date: string | null
          purchase_price: number | null
          quantity: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          name: string
          purchase_date?: string | null
          purchase_price?: number | null
          quantity?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          name?: string
          purchase_date?: string | null
          purchase_price?: number | null
          quantity?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notes: {
        Row: {
          category: string | null
          content: string | null
          created_at: string
          id: string
          is_pinned: boolean | null
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          content?: string | null
          created_at?: string
          id?: string
          is_pinned?: boolean | null
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          content?: string | null
          created_at?: string
          id?: string
          is_pinned?: boolean | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      prayers: {
        Row: {
          arabic_text: string | null
          category: string | null
          created_at: string
          id: string
          is_favorite: boolean | null
          title: string
          translation: string | null
          transliteration: string | null
          user_id: string
        }
        Insert: {
          arabic_text?: string | null
          category?: string | null
          created_at?: string
          id?: string
          is_favorite?: boolean | null
          title: string
          translation?: string | null
          transliteration?: string | null
          user_id: string
        }
        Update: {
          arabic_text?: string | null
          category?: string | null
          created_at?: string
          id?: string
          is_favorite?: boolean | null
          title?: string
          translation?: string | null
          transliteration?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          current_xp: number
          id: string
          level: number
          name: string
          title: string | null
          total_xp: number
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          current_xp?: number
          id?: string
          level?: number
          name?: string
          title?: string | null
          total_xp?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          current_xp?: number
          id?: string
          level?: number
          name?: string
          title?: string | null
          total_xp?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      quests: {
        Row: {
          category: string
          completed: boolean
          created_at: string
          description: string | null
          difficulty: string | null
          id: string
          image_url: string | null
          title: string
          updated_at: string
          user_id: string
          xp_reward: number
        }
        Insert: {
          category?: string
          completed?: boolean
          created_at?: string
          description?: string | null
          difficulty?: string | null
          id?: string
          image_url?: string | null
          title: string
          updated_at?: string
          user_id: string
          xp_reward?: number
        }
        Update: {
          category?: string
          completed?: boolean
          created_at?: string
          description?: string | null
          difficulty?: string | null
          id?: string
          image_url?: string | null
          title?: string
          updated_at?: string
          user_id?: string
          xp_reward?: number
        }
        Relationships: []
      }
      second_brain_items: {
        Row: {
          content: string | null
          created_at: string
          id: string
          parent_id: string | null
          status: string | null
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          parent_id?: string | null
          status?: string | null
          title: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          parent_id?: string | null
          status?: string | null
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "second_brain_items_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "second_brain_items"
            referencedColumns: ["id"]
          },
        ]
      }
      user_stats: {
        Row: {
          current_streak: number
          goals_achieved: number
          habits_tracked: number
          id: string
          longest_streak: number
          quests_completed: number
          total_xp_earned: number
          updated_at: string
          user_id: string
        }
        Insert: {
          current_streak?: number
          goals_achieved?: number
          habits_tracked?: number
          id?: string
          longest_streak?: number
          quests_completed?: number
          total_xp_earned?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          current_streak?: number
          goals_achieved?: number
          habits_tracked?: number
          id?: string
          longest_streak?: number
          quests_completed?: number
          total_xp_earned?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      wallets: {
        Row: {
          color: string | null
          created_at: string
          currency: string
          icon: string | null
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          currency?: string
          icon?: string | null
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string
          currency?: string
          icon?: string | null
          id?: string
          name?: string
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
