export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      notifications: {
        Row: {
          body: string | null
          created_at: string
          data: Json | null
          id: string
          user_id: string | null
        }
        Insert: {
          body?: string | null
          created_at?: string
          data?: Json | null
          id?: string
          user_id?: string | null
        }
        Update: {
          body?: string | null
          created_at?: string
          data?: Json | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          content: string | null
          created_at: string
          id: string
          is_admin_note: boolean | null
          is_pinned: boolean | null
          lat: number | null
          lng: number | null
          user_id: string | null
          views: number | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          is_admin_note?: boolean | null
          is_pinned?: boolean | null
          lat?: number | null
          lng?: number | null
          user_id?: string | null
          views?: number | null
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          is_admin_note?: boolean | null
          is_pinned?: boolean | null
          lat?: number | null
          lng?: number | null
          user_id?: string | null
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          expo_push_token: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          expo_push_token?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          expo_push_token?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      replies: {
        Row: {
          content: string | null
          created_at: string
          id: string
          post_id: string | null
          thread_id: number | null
          upvotes: number | null
          user_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          post_id?: string | null
          thread_id?: number | null
          upvotes?: number | null
          user_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          post_id?: string | null
          thread_id?: number | null
          upvotes?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "replies_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "replies_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          created_at: string
          details: string | null
          id: string
          is_user_flagged: boolean | null
          post_id: string | null
          reason: Database["public"]["Enums"]["report_reason"]
          reply_id: string | null
          reporter_id: string
          resolved_at: string | null
          status: Database["public"]["Enums"]["report_status"] | null
        }
        Insert: {
          created_at?: string
          details?: string | null
          id?: string
          is_user_flagged?: boolean | null
          post_id?: string | null
          reason: Database["public"]["Enums"]["report_reason"]
          reply_id?: string | null
          reporter_id: string
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["report_status"] | null
        }
        Update: {
          created_at?: string
          details?: string | null
          id?: string
          is_user_flagged?: boolean | null
          post_id?: string | null
          reason?: Database["public"]["Enums"]["report_reason"]
          reply_id?: string | null
          reporter_id?: string
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["report_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "reports_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_reply_id_fkey"
            columns: ["reply_id"]
            isOneToOne: false
            referencedRelation: "replies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_reply_id_fkey"
            columns: ["reply_id"]
            isOneToOne: false
            referencedRelation: "replies_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          advertising_id: string | null
          created_at: string
          email: string | null
          expo_push_token: string | null
          full_name: string | null
          id: string
          is_subscribed: boolean | null
        }
        Insert: {
          advertising_id?: string | null
          created_at?: string
          email?: string | null
          expo_push_token?: string | null
          full_name?: string | null
          id?: string
          is_subscribed?: boolean | null
        }
        Update: {
          advertising_id?: string | null
          created_at?: string
          email?: string | null
          expo_push_token?: string | null
          full_name?: string | null
          id?: string
          is_subscribed?: boolean | null
        }
        Relationships: []
      }
      watchlists: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "watchlists_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "watchlists_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      posts_public: {
        Row: {
          content: string | null
          created_at: string | null
          id: string | null
          is_admin_note: boolean | null
          is_pinned: boolean | null
          lat: number | null
          lng: number | null
          reply_count: number | null
          sort_order: number | null
          views: number | null
        }
        Relationships: []
      }
      replies_public: {
        Row: {
          content: string | null
          created_at: string | null
          id: string | null
          post_id: string | null
          upvotes: number | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string | null
          post_id?: string | null
          upvotes?: number | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string | null
          post_id?: string | null
          upvotes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "replies_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      calculate_distance: {
        Args: {
          lat1: number
          lon1: number
          lat2: number
          lon2: number
        }
        Returns: number
      }
      calculate_post_score: {
        Args: {
          post_lat: number
          post_lng: number
          post_created_at: string
          post_views: number
          reply_count: number
          user_lat: number
          user_lng: number
        }
        Returns: number
      }
      confessions_personalized_feed: {
        Args: {
          user_lat: number
          user_lng: number
          input_user_id?: string
        }
        Returns: {
          id: string
          created_at: string
          content: string
          lat: number
          lng: number
          views: number
          is_pinned: boolean
          is_admin_note: boolean
          reply_count: number
          sort_order: number
          score: number
        }[]
      }
      get_posts_by_distance: {
        Args: {
          input_lat: number
          input_lng: number
        }
        Returns: {
          id: string
          created_at: string
          content: string
          lat: number
          lng: number
          views: number
          distance: number
          reply_count: number
        }[]
      }
      increment_multiple_views: {
        Args: {
          post_ids: string[]
        }
        Returns: undefined
      }
      increment_view: {
        Args: {
          post_id: string
        }
        Returns: undefined
      }
      posts_filtered_feed: {
        Args: {
          user_lat: number
          user_lng: number
          input_user_id?: string
        }
        Returns: {
          id: string
          created_at: string
          content: string
          lat: number
          lng: number
          views: number
          is_pinned: boolean
          is_admin_note: boolean
          reply_count: number
          sort_order: number
        }[]
      }
      posts_localized_feed: {
        Args: {
          user_lat: number
          user_lng: number
        }
        Returns: {
          id: string
          created_at: string
          content: string
          lat: number
          lng: number
          views: number
          is_pinned: boolean
          is_admin_note: boolean
          reply_count: number
          sort_order: number
          score: number
        }[]
      }
      replies_filtered_feed:
      | {
        Args: {
          input_user_id?: string
        }
        Returns: {
          id: string
          created_at: string
          content: string
          post_id: string
          upvotes: number
        }[]
      }
      | {
        Args: {
          input_user_id?: string
          input_post_id?: string
        }
        Returns: {
          id: string
          created_at: string
          content: string
          post_id: string
          upvotes: number
        }[]
      }
    }
    Enums: {
      report_reason:
      | "inappropriate"
      | "spam"
      | "harassment"
      | "misinformation"
      | "other"
      report_status: "pending" | "resolved" | "dismissed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
  | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
  ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
    Database[PublicTableNameOrOptions["schema"]]["Views"])
  : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
    Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
  ? R
  : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
    PublicSchema["Views"])
  ? (PublicSchema["Tables"] &
    PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
  ? R
  : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
  | keyof PublicSchema["Tables"]
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
  ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Insert: infer I
  }
  ? I
  : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
    Insert: infer I
  }
  ? I
  : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
  | keyof PublicSchema["Tables"]
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
  ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Update: infer U
  }
  ? U
  : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
    Update: infer U
  }
  ? U
  : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
  | keyof PublicSchema["Enums"]
  | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
  ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
  : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
  | keyof PublicSchema["CompositeTypes"]
  | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
  ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
  : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
  ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

