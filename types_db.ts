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
      app_config: {
        Row: {
          created_at: string
          hard_paywall_offering_identifier: string | null
          id: string
          queue_drop_chance: number | null
          queue_enabled: boolean | null
          queue_wait_time_minutes: number | null
          spy_pill_paywall_offering_identifier: string | null
        }
        Insert: {
          created_at?: string
          hard_paywall_offering_identifier?: string | null
          id?: string
          queue_drop_chance?: number | null
          queue_enabled?: boolean | null
          queue_wait_time_minutes?: number | null
          spy_pill_paywall_offering_identifier?: string | null
        }
        Update: {
          created_at?: string
          hard_paywall_offering_identifier?: string | null
          id?: string
          queue_drop_chance?: number | null
          queue_enabled?: boolean | null
          queue_wait_time_minutes?: number | null
          spy_pill_paywall_offering_identifier?: string | null
        }
        Relationships: []
      }
      app_versions: {
        Row: {
          android_store_url: string | null
          created_at: string
          force_update_enabled: boolean
          id: string
          ios_store_url: string | null
          is_active: boolean
          latest_android_version: string | null
          latest_ios_version: string | null
          maintenance_message: string | null
          maintenance_mode_enabled: boolean | null
          minimum_android_version: string
          minimum_ios_version: string
          update_message: string | null
          updated_at: string
        }
        Insert: {
          android_store_url?: string | null
          created_at?: string
          force_update_enabled?: boolean
          id?: string
          ios_store_url?: string | null
          is_active?: boolean
          latest_android_version?: string | null
          latest_ios_version?: string | null
          maintenance_message?: string | null
          maintenance_mode_enabled?: boolean | null
          minimum_android_version: string
          minimum_ios_version: string
          update_message?: string | null
          updated_at?: string
        }
        Update: {
          android_store_url?: string | null
          created_at?: string
          force_update_enabled?: boolean
          id?: string
          ios_store_url?: string | null
          is_active?: boolean
          latest_android_version?: string | null
          latest_ios_version?: string | null
          maintenance_message?: string | null
          maintenance_mode_enabled?: boolean | null
          minimum_android_version?: string
          minimum_ios_version?: string
          update_message?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      moderation_logs: {
        Row: {
          action_taken: string | null
          categories: Json | null
          created_at: string
          id: string
          post_id: string | null
          reply_id: string | null
          severity_score: number
        }
        Insert: {
          action_taken?: string | null
          categories?: Json | null
          created_at?: string
          id?: string
          post_id?: string | null
          reply_id?: string | null
          severity_score: number
        }
        Update: {
          action_taken?: string | null
          categories?: Json | null
          created_at?: string
          id?: string
          post_id?: string | null
          reply_id?: string | null
          severity_score?: number
        }
        Relationships: [
          {
            foreignKeyName: "moderation_logs_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "moderation_logs_reply_id_fkey"
            columns: ["reply_id"]
            isOneToOne: false
            referencedRelation: "replies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "moderation_logs_reply_id_fkey"
            columns: ["reply_id"]
            isOneToOne: false
            referencedRelation: "replies_public"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          data: Json | null
          id: string
          user_id: string | null
          user_v2_id: string | null
        }
        Insert: {
          body?: string | null
          created_at?: string
          data?: Json | null
          id?: string
          user_id?: string | null
          user_v2_id?: string | null
        }
        Update: {
          body?: string | null
          created_at?: string
          data?: Json | null
          id?: string
          user_id?: string | null
          user_v2_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_v2_id_fkey"
            columns: ["user_v2_id"]
            isOneToOne: false
            referencedRelation: "users_v2"
            referencedColumns: ["id"]
          },
        ]
      }
      poi_fetch_history: {
        Row: {
          fetched_at: string | null
          geom: unknown | null
          id: string
          lat: number
          lng: number
          radius: number
          source: string
        }
        Insert: {
          fetched_at?: string | null
          geom?: unknown | null
          id?: string
          lat: number
          lng: number
          radius: number
          source: string
        }
        Update: {
          fetched_at?: string | null
          geom?: unknown | null
          id?: string
          lat?: number
          lng?: number
          radius?: number
          source?: string
        }
        Relationships: []
      }
      pois: {
        Row: {
          address: Json | null
          category: string | null
          created_at: string | null
          geom: unknown | null
          google_place_id: string | null
          icon_background_color: string | null
          icon_mask_base_uri: string | null
          id: string
          lat: number
          lng: number
          logo_url: string | null
          name: string
          photos: Json | null
          primary_type: string | null
          primary_type_display_name: string | null
          saved_images: string[] | null
          types: string[] | null
          updated_at: string | null
        }
        Insert: {
          address?: Json | null
          category?: string | null
          created_at?: string | null
          geom?: unknown | null
          google_place_id?: string | null
          icon_background_color?: string | null
          icon_mask_base_uri?: string | null
          id?: string
          lat: number
          lng: number
          logo_url?: string | null
          name: string
          photos?: Json | null
          primary_type?: string | null
          primary_type_display_name?: string | null
          saved_images?: string[] | null
          types?: string[] | null
          updated_at?: string | null
        }
        Update: {
          address?: Json | null
          category?: string | null
          created_at?: string | null
          geom?: unknown | null
          google_place_id?: string | null
          icon_background_color?: string | null
          icon_mask_base_uri?: string | null
          id?: string
          lat?: number
          lng?: number
          logo_url?: string | null
          name?: string
          photos?: Json | null
          primary_type?: string | null
          primary_type_display_name?: string | null
          saved_images?: string[] | null
          types?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      posts: {
        Row: {
          content: string | null
          created_at: string
          geom: unknown | null
          hidden: boolean | null
          hidden_reason: string | null
          id: string
          is_admin_note: boolean | null
          is_pinned: boolean | null
          last_review_at: string | null
          lat: number | null
          lng: number | null
          moderated_at: string | null
          moderation_score: number | null
          poi_id: string | null
          posted_from_poi: boolean | null
          requires_review: boolean | null
          user_id: string | null
          views: number | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          geom?: unknown | null
          hidden?: boolean | null
          hidden_reason?: string | null
          id?: string
          is_admin_note?: boolean | null
          is_pinned?: boolean | null
          last_review_at?: string | null
          lat?: number | null
          lng?: number | null
          moderated_at?: string | null
          moderation_score?: number | null
          poi_id?: string | null
          posted_from_poi?: boolean | null
          requires_review?: boolean | null
          user_id?: string | null
          views?: number | null
        }
        Update: {
          content?: string | null
          created_at?: string
          geom?: unknown | null
          hidden?: boolean | null
          hidden_reason?: string | null
          id?: string
          is_admin_note?: boolean | null
          is_pinned?: boolean | null
          last_review_at?: string | null
          lat?: number | null
          lng?: number | null
          moderated_at?: string | null
          moderation_score?: number | null
          poi_id?: string | null
          posted_from_poi?: boolean | null
          requires_review?: boolean | null
          user_id?: string | null
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_poi_id_fkey"
            columns: ["poi_id"]
            isOneToOne: false
            referencedRelation: "pois"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      posts_v2: {
        Row: {
          content: string | null
          created_at: string
          geom: unknown | null
          hidden: boolean | null
          hidden_reason: string | null
          id: string
          last_review_at: string | null
          lat: number | null
          lng: number | null
          moderated_at: string | null
          moderation_score: number | null
          poi_id: string | null
          posted_from_poi: boolean | null
          requires_review: boolean | null
          user_id: string | null
          views: number | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          geom?: unknown | null
          hidden?: boolean | null
          hidden_reason?: string | null
          id?: string
          last_review_at?: string | null
          lat?: number | null
          lng?: number | null
          moderated_at?: string | null
          moderation_score?: number | null
          poi_id?: string | null
          posted_from_poi?: boolean | null
          requires_review?: boolean | null
          user_id?: string | null
          views?: number | null
        }
        Update: {
          content?: string | null
          created_at?: string
          geom?: unknown | null
          hidden?: boolean | null
          hidden_reason?: string | null
          id?: string
          last_review_at?: string | null
          lat?: number | null
          lng?: number | null
          moderated_at?: string | null
          moderation_score?: number | null
          poi_id?: string | null
          posted_from_poi?: boolean | null
          requires_review?: boolean | null
          user_id?: string | null
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_v2_poi_id_fkey"
            columns: ["poi_id"]
            isOneToOne: false
            referencedRelation: "pois"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_v2_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_v2"
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
          is_author: boolean
          post_id: string | null
          thread_id: number | null
          upvotes: number | null
          user_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          is_author?: boolean
          post_id?: string | null
          thread_id?: number | null
          upvotes?: number | null
          user_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          is_author?: boolean
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
      replies_v2: {
        Row: {
          content: string | null
          created_at: string
          id: string
          is_author: boolean
          post_id: string | null
          thread_id: number | null
          upvotes: number | null
          user_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          is_author?: boolean
          post_id?: string | null
          thread_id?: number | null
          upvotes?: number | null
          user_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          is_author?: boolean
          post_id?: string | null
          thread_id?: number | null
          upvotes?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "replies_v2_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts_v2"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "replies_v2_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_v2"
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
      user_trust_scores: {
        Row: {
          created_at: string
          flagged_posts: number | null
          id: string
          is_restricted: boolean | null
          last_violation_at: string | null
          total_posts: number | null
          trust_score: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          flagged_posts?: number | null
          id?: string
          is_restricted?: boolean | null
          last_violation_at?: string | null
          total_posts?: number | null
          trust_score?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          flagged_posts?: number | null
          id?: string
          is_restricted?: boolean | null
          last_violation_at?: string | null
          total_posts?: number | null
          trust_score?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_trust_scores_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
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
          gender: Database["public"]["Enums"]["gender_type"] | null
          id: string
          is_subscribed: boolean | null
          version: string | null
        }
        Insert: {
          advertising_id?: string | null
          created_at?: string
          email?: string | null
          expo_push_token?: string | null
          full_name?: string | null
          gender?: Database["public"]["Enums"]["gender_type"] | null
          id?: string
          is_subscribed?: boolean | null
          version?: string | null
        }
        Update: {
          advertising_id?: string | null
          created_at?: string
          email?: string | null
          expo_push_token?: string | null
          full_name?: string | null
          gender?: Database["public"]["Enums"]["gender_type"] | null
          id?: string
          is_subscribed?: boolean | null
          version?: string | null
        }
        Relationships: []
      }
      users_v2: {
        Row: {
          advertising_id: string | null
          branch_data: Json | null
          created_at: string
          email: string | null
          expo_push_token: string | null
          gender: Database["public"]["Enums"]["gender_type"] | null
          id: string
          is_subscribed: boolean | null
          last_location_update: string | null
          lat: number | null
          lng: number | null
          version: string | null
        }
        Insert: {
          advertising_id?: string | null
          branch_data?: Json | null
          created_at?: string
          email?: string | null
          expo_push_token?: string | null
          gender?: Database["public"]["Enums"]["gender_type"] | null
          id?: string
          is_subscribed?: boolean | null
          last_location_update?: string | null
          lat?: number | null
          lng?: number | null
          version?: string | null
        }
        Update: {
          advertising_id?: string | null
          branch_data?: Json | null
          created_at?: string
          email?: string | null
          expo_push_token?: string | null
          gender?: Database["public"]["Enums"]["gender_type"] | null
          id?: string
          is_subscribed?: boolean | null
          last_location_update?: string | null
          lat?: number | null
          lng?: number | null
          version?: string | null
        }
        Relationships: []
      }
      viewing_circles: {
        Row: {
          created_at: string
          friend_user_id: string | null
          id: string
          lat: number | null
          lng: number | null
          radius_km: number | null
          type: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          friend_user_id?: string | null
          id?: string
          lat?: number | null
          lng?: number | null
          radius_km?: number | null
          type?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          friend_user_id?: string | null
          id?: string
          lat?: number | null
          lng?: number | null
          radius_km?: number | null
          type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "viewing_circles_friend_user_id_fkey"
            columns: ["friend_user_id"]
            isOneToOne: false
            referencedRelation: "users_v2"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "viewing_circles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_v2"
            referencedColumns: ["id"]
          },
        ]
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
          gender: Database["public"]["Enums"]["gender_type"] | null
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
      check_poi_fetch_needed: {
        Args: {
          check_lat: number
          check_lng: number
          check_radius?: number
          max_age_days?: number
        }
        Returns: boolean
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
          gender: Database["public"]["Enums"]["gender_type"]
        }[]
      }
      confessions_poi_feed: {
        Args: {
          input_poi_id: string
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
          score: number
          gender: Database["public"]["Enums"]["gender_type"]
        }[]
      }
      confessions_range_feed: {
        Args: {
          user_lat: number
          user_lng: number
          range_km: number
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
          gender: Database["public"]["Enums"]["gender_type"]
        }[]
      }
      confessions_range_feed_newest: {
        Args: {
          user_lat: number
          user_lng: number
          range_km: number
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
          gender: Database["public"]["Enums"]["gender_type"]
        }[]
      }
      get_map_posts_in_range: {
        Args: {
          user_lat: number
          user_lng: number
          range_km: number
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
          gender: Database["public"]["Enums"]["gender_type"]
        }[]
      }
      get_poi_stories: {
        Args: {
          user_lat: number
          user_lng: number
        }
        Returns: {
          poi_id: string
          poi_name: string
          poi_logo_url: string
          poi_icon_mask_base_uri: string
          poi_icon_background_color: string
          poi_lat: number
          poi_lng: number
          poi_photos: Json
          distance_km: number
          stories: Json
        }[]
      }
      get_pois_in_radius: {
        Args: {
          center_lat: number
          center_lng: number
          radius_meters?: number
        }
        Returns: {
          id: string
          name: string
          category: string
          lat: number
          lng: number
          logo_url: string
          address: Json
          distance_meters: number
        }[]
      }
      get_pois_in_range: {
        Args: {
          user_lat: number
          user_lng: number
          range_km?: number
        }
        Returns: {
          id: string
          name: string
          logo_url: string
          icon_mask_base_uri: string
          icon_background_color: string
          lat: number
          lng: number
          primary_type: string
          primary_type_display_name: string
          photos: Json
          distance_km: number
        }[]
      }
      get_post_v2: {
        Args: {
          input_post_id: string
        }
        Returns: {
          id: string
          created_at: string
          lat: number
          lng: number
          content: string
          views: number
          poi_id: string
          posted_from_poi: boolean
          gender: string
          reply_count: number
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
      get_posts_v2_by_distance: {
        Args: {
          user_lat: number
          user_lng: number
          max_distance_km?: number
          limit_count?: number
          offset_count?: number
          sort_by?: string
        }
        Returns: {
          id: string
          created_at: string
          lat: number
          lng: number
          content: string
          views: number
          poi_id: string
          posted_from_poi: boolean
          distance_km: number
        }[]
      }
      get_posts_v2_in_viewport: {
        Args: {
          north_lat: number
          south_lat: number
          east_lng: number
          west_lng: number
          limit_count?: number
          offset_count?: number
          sort_by?: string
          sort_direction?: string
        }
        Returns: {
          id: string
          created_at: string
          lat: number
          lng: number
          content: string
          views: number
          poi_id: string
          posted_from_poi: boolean
          distance_from_center_km: number
          gender: Database["public"]["Enums"]["gender_type"]
          total_count: number
        }[]
      }
      get_posts_v2_in_viewport_with_reply_count: {
        Args: {
          north_lat: number
          south_lat: number
          east_lng: number
          west_lng: number
          limit_count?: number
          offset_count?: number
          sort_by?: string
          sort_direction?: string
        }
        Returns: Json
      }
      get_replies_v2_count: {
        Args: {
          input_post_id: string
        }
        Returns: number
      }
      get_replies_v2_for_post: {
        Args: {
          input_post_id: string
          sort_by?: string
          sort_direction?: string
          limit_count?: number
          offset_count?: number
        }
        Returns: {
          id: string
          created_at: string
          post_id: string
          content: string
          upvotes: number
          user_id: string
          is_author: boolean
          thread_id: number
          gender: string
        }[]
      }
      get_top_onboarding_posts: {
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
          gender: Database["public"]["Enums"]["gender_type"]
        }[]
      }
      get_user_posts: {
        Args: {
          input_user_id: string
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
          last_reply_at: string
          my_latest_reply: Json
          recent_replies: Json
        }[]
      }
      get_user_replied_posts: {
        Args: {
          input_user_id: string
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
          last_reply_at: string
          my_latest_reply: Json
          recent_replies: Json
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
          gender: Database["public"]["Enums"]["gender_type"]
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
          gender: Database["public"]["Enums"]["gender_type"]
        }[]
      }
      replies_filtered_feed: {
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
          thread_id: number
          is_author: boolean
        }[]
      }
    }
    Enums: {
      gender_type: "male" | "female" | "other"
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

