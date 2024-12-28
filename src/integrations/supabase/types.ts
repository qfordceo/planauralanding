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
      blog_posts: {
        Row: {
          author_id: string | null
          content: string
          created_at: string
          excerpt: string | null
          id: string
          published: boolean | null
          published_at: string | null
          slug: string
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          content: string
          created_at?: string
          excerpt?: string | null
          id?: string
          published?: boolean | null
          published_at?: string | null
          slug: string
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          content?: string
          created_at?: string
          excerpt?: string | null
          id?: string
          published?: boolean | null
          published_at?: string | null
          slug?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      build_cost_estimates: {
        Row: {
          comp_average_price: number | null
          created_at: string
          floor_plan_id: string | null
          id: string
          land_listing_id: string | null
          target_build_cost: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          comp_average_price?: number | null
          created_at?: string
          floor_plan_id?: string | null
          id?: string
          land_listing_id?: string | null
          target_build_cost?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          comp_average_price?: number | null
          created_at?: string
          floor_plan_id?: string | null
          id?: string
          land_listing_id?: string | null
          target_build_cost?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "build_cost_estimates_floor_plan_id_fkey"
            columns: ["floor_plan_id"]
            isOneToOne: false
            referencedRelation: "floor_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "build_cost_estimates_land_listing_id_fkey"
            columns: ["land_listing_id"]
            isOneToOne: false
            referencedRelation: "land_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "build_cost_estimates_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "build_cost_estimates_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      build_line_items: {
        Row: {
          actual_cost: number | null
          build_estimate_id: string | null
          category: string
          contractor_id: string | null
          created_at: string
          description: string
          estimated_cost: number | null
          id: string
          status: string | null
          updated_at: string
        }
        Insert: {
          actual_cost?: number | null
          build_estimate_id?: string | null
          category: string
          contractor_id?: string | null
          created_at?: string
          description: string
          estimated_cost?: number | null
          id?: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          actual_cost?: number | null
          build_estimate_id?: string | null
          category?: string
          contractor_id?: string | null
          created_at?: string
          description?: string
          estimated_cost?: number | null
          id?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "build_line_items_build_estimate_id_fkey"
            columns: ["build_estimate_id"]
            isOneToOne: false
            referencedRelation: "build_cost_estimates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "build_line_items_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "contractors"
            referencedColumns: ["id"]
          },
        ]
      }
      bulk_purchase_opportunities: {
        Row: {
          bulk_price_per_unit: number
          closing_date: string | null
          created_at: string
          current_participants: number | null
          description: string
          id: string
          material_category: string
          price_per_unit: number
          status: string | null
          target_quantity: number
          updated_at: string
        }
        Insert: {
          bulk_price_per_unit: number
          closing_date?: string | null
          created_at?: string
          current_participants?: number | null
          description: string
          id?: string
          material_category: string
          price_per_unit: number
          status?: string | null
          target_quantity: number
          updated_at?: string
        }
        Update: {
          bulk_price_per_unit?: number
          closing_date?: string | null
          created_at?: string
          current_participants?: number | null
          description?: string
          id?: string
          material_category?: string
          price_per_unit?: number
          status?: string | null
          target_quantity?: number
          updated_at?: string
        }
        Relationships: []
      }
      contractor_appointments: {
        Row: {
          appointment_date: string
          client_id: string | null
          contractor_id: string | null
          created_at: string
          end_time: string
          id: string
          notes: string | null
          start_time: string
          status: string
          updated_at: string
        }
        Insert: {
          appointment_date: string
          client_id?: string | null
          contractor_id?: string | null
          created_at?: string
          end_time: string
          id?: string
          notes?: string | null
          start_time: string
          status?: string
          updated_at?: string
        }
        Update: {
          appointment_date?: string
          client_id?: string | null
          contractor_id?: string | null
          created_at?: string
          end_time?: string
          id?: string
          notes?: string | null
          start_time?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contractor_appointments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contractor_appointments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contractor_appointments_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "contractors"
            referencedColumns: ["id"]
          },
        ]
      }
      contractor_availability: {
        Row: {
          contractor_id: string | null
          created_at: string
          day_of_week: number
          end_time: string
          id: string
          start_time: string
        }
        Insert: {
          contractor_id?: string | null
          created_at?: string
          day_of_week: number
          end_time: string
          id?: string
          start_time: string
        }
        Update: {
          contractor_id?: string | null
          created_at?: string
          day_of_week?: number
          end_time?: string
          id?: string
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "contractor_availability_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "contractors"
            referencedColumns: ["id"]
          },
        ]
      }
      contractor_bids: {
        Row: {
          bid_amount: number
          bid_details: Json | null
          contractor_id: string | null
          created_at: string
          id: string
          outbid: boolean | null
          project_id: string
          status: string | null
          updated_at: string
        }
        Insert: {
          bid_amount: number
          bid_details?: Json | null
          contractor_id?: string | null
          created_at?: string
          id?: string
          outbid?: boolean | null
          project_id: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          bid_amount?: number
          bid_details?: Json | null
          contractor_id?: string | null
          created_at?: string
          id?: string
          outbid?: boolean | null
          project_id?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contractor_bids_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "contractors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contractor_bids_project_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      contractor_day_exceptions: {
        Row: {
          contractor_id: string | null
          created_at: string
          exception_date: string
          id: string
          is_available: boolean | null
        }
        Insert: {
          contractor_id?: string | null
          created_at?: string
          exception_date: string
          id?: string
          is_available?: boolean | null
        }
        Update: {
          contractor_id?: string | null
          created_at?: string
          exception_date?: string
          id?: string
          is_available?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "contractor_day_exceptions_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "contractors"
            referencedColumns: ["id"]
          },
        ]
      }
      contractor_inspection_defects: {
        Row: {
          contractor_id: string | null
          created_at: string
          defect_description: string
          id: string
          inspection_date: string
          project_id: string | null
          resolution_notes: string | null
          resolved: boolean | null
          updated_at: string
        }
        Insert: {
          contractor_id?: string | null
          created_at?: string
          defect_description: string
          id?: string
          inspection_date: string
          project_id?: string | null
          resolution_notes?: string | null
          resolved?: boolean | null
          updated_at?: string
        }
        Update: {
          contractor_id?: string | null
          created_at?: string
          defect_description?: string
          id?: string
          inspection_date?: string
          project_id?: string | null
          resolution_notes?: string | null
          resolved?: boolean | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contractor_inspection_defects_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "contractors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contractor_inspection_defects_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      contractor_portfolio: {
        Row: {
          completed_date: string | null
          contractor_id: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string
          title: string
        }
        Insert: {
          completed_date?: string | null
          contractor_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url: string
          title: string
        }
        Update: {
          completed_date?: string | null
          contractor_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "contractor_portfolio_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "contractors"
            referencedColumns: ["id"]
          },
        ]
      }
      contractor_references: {
        Row: {
          client_name: string
          completion_date: string | null
          contact_info: string
          contractor_id: string | null
          created_at: string
          id: string
          project_description: string | null
        }
        Insert: {
          client_name: string
          completion_date?: string | null
          contact_info: string
          contractor_id?: string | null
          created_at?: string
          id?: string
          project_description?: string | null
        }
        Update: {
          client_name?: string
          completion_date?: string | null
          contact_info?: string
          contractor_id?: string | null
          created_at?: string
          id?: string
          project_description?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contractor_references_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "contractors"
            referencedColumns: ["id"]
          },
        ]
      }
      contractor_reviews: {
        Row: {
          client_id: string | null
          contractor_id: string | null
          created_at: string
          id: string
          rating: number | null
          review_text: string | null
          updated_at: string
        }
        Insert: {
          client_id?: string | null
          contractor_id?: string | null
          created_at?: string
          id?: string
          rating?: number | null
          review_text?: string | null
          updated_at?: string
        }
        Update: {
          client_id?: string | null
          contractor_id?: string | null
          created_at?: string
          id?: string
          rating?: number | null
          review_text?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contractor_reviews_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contractor_reviews_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contractor_reviews_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "contractors"
            referencedColumns: ["id"]
          },
        ]
      }
      contractors: {
        Row: {
          address: string | null
          average_rating: number | null
          bbb_certified: boolean | null
          bid_notifications: boolean | null
          business_name: string
          contact_name: string
          contractor_types: Database["public"]["Enums"]["contractor_type"][]
          created_at: string
          id: string
          insurance_expiry: string | null
          insurance_verified: boolean | null
          phone: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          address?: string | null
          average_rating?: number | null
          bbb_certified?: boolean | null
          bid_notifications?: boolean | null
          business_name: string
          contact_name: string
          contractor_types: Database["public"]["Enums"]["contractor_type"][]
          created_at?: string
          id?: string
          insurance_expiry?: string | null
          insurance_verified?: boolean | null
          phone?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          address?: string | null
          average_rating?: number | null
          bbb_certified?: boolean | null
          bid_notifications?: boolean | null
          business_name?: string
          contact_name?: string
          contractor_types?: Database["public"]["Enums"]["contractor_type"][]
          created_at?: string
          id?: string
          insurance_expiry?: string | null
          insurance_verified?: boolean | null
          phone?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      floor_plan_purchases: {
        Row: {
          commission_amount: number
          commission_paid: boolean | null
          floor_plan_id: string | null
          id: string
          purchase_amount: number
          purchase_date: string | null
          user_id: string | null
        }
        Insert: {
          commission_amount: number
          commission_paid?: boolean | null
          floor_plan_id?: string | null
          id?: string
          purchase_amount: number
          purchase_date?: string | null
          user_id?: string | null
        }
        Update: {
          commission_amount?: number
          commission_paid?: boolean | null
          floor_plan_id?: string | null
          id?: string
          purchase_amount?: number
          purchase_date?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "floor_plan_purchases_floor_plan_id_fkey"
            columns: ["floor_plan_id"]
            isOneToOne: false
            referencedRelation: "floor_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "floor_plan_purchases_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "floor_plan_purchases_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      floor_plans: {
        Row: {
          bathrooms: number
          bedrooms: number
          build_price_per_sqft: number | null
          commission_rate: number | null
          created_at: string
          description: string | null
          foundation_type: string | null
          id: string
          image_url: string | null
          name: string
          plan_price: number
          provider_name: string | null
          provider_url: string | null
          square_feet: number
          style: string | null
          updated_at: string
        }
        Insert: {
          bathrooms: number
          bedrooms: number
          build_price_per_sqft?: number | null
          commission_rate?: number | null
          created_at?: string
          description?: string | null
          foundation_type?: string | null
          id?: string
          image_url?: string | null
          name: string
          plan_price: number
          provider_name?: string | null
          provider_url?: string | null
          square_feet: number
          style?: string | null
          updated_at?: string
        }
        Update: {
          bathrooms?: number
          bedrooms?: number
          build_price_per_sqft?: number | null
          commission_rate?: number | null
          created_at?: string
          description?: string | null
          foundation_type?: string | null
          id?: string
          image_url?: string | null
          name?: string
          plan_price?: number
          provider_name?: string | null
          provider_url?: string | null
          square_feet?: number
          style?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      land_listings: {
        Row: {
          acres: number | null
          address: string | null
          avg_area_price_per_acre: number | null
          created_at: string
          id: string
          image_url: string | null
          is_vetted: boolean | null
          last_fetched_at: string | null
          price: number | null
          price_per_acre: number | null
          qr_code_generated: boolean | null
          qr_code_url: string | null
          realtor_url: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          acres?: number | null
          address?: string | null
          avg_area_price_per_acre?: number | null
          created_at?: string
          id?: string
          image_url?: string | null
          is_vetted?: boolean | null
          last_fetched_at?: string | null
          price?: number | null
          price_per_acre?: number | null
          qr_code_generated?: boolean | null
          qr_code_url?: string | null
          realtor_url?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          acres?: number | null
          address?: string | null
          avg_area_price_per_acre?: number | null
          created_at?: string
          id?: string
          image_url?: string | null
          is_vetted?: boolean | null
          last_fetched_at?: string | null
          price?: number | null
          price_per_acre?: number | null
          qr_code_generated?: boolean | null
          qr_code_url?: string | null
          realtor_url?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          created_at: string
          email: string | null
          id: string
          is_admin: boolean | null
          phone: string | null
          preapproval_amount: number | null
          preapproval_status: string | null
          sustainability_preferences: Json | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          email?: string | null
          id: string
          is_admin?: boolean | null
          phone?: string | null
          preapproval_amount?: number | null
          preapproval_status?: string | null
          sustainability_preferences?: Json | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_admin?: boolean | null
          phone?: string | null
          preapproval_amount?: number | null
          preapproval_status?: string | null
          sustainability_preferences?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      project_milestones: {
        Row: {
          assigned_contractor_id: string | null
          build_estimate_id: string | null
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          assigned_contractor_id?: string | null
          build_estimate_id?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          assigned_contractor_id?: string | null
          build_estimate_id?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_milestones_assigned_contractor_id_fkey"
            columns: ["assigned_contractor_id"]
            isOneToOne: false
            referencedRelation: "contractors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_milestones_build_estimate_id_fkey"
            columns: ["build_estimate_id"]
            isOneToOne: false
            referencedRelation: "build_cost_estimates"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          created_at: string
          description: string | null
          id: string
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      rate_limits: {
        Row: {
          created_at: string
          data: Json
          key: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          data: Json
          key: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          data?: Json
          key?: string
          updated_at?: string
        }
        Relationships: []
      }
      saved_builds: {
        Row: {
          configuration: Json | null
          created_at: string | null
          floor_plan_id: string | null
          id: string
          total_cost: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          configuration?: Json | null
          created_at?: string | null
          floor_plan_id?: string | null
          id?: string
          total_cost?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          configuration?: Json | null
          created_at?: string | null
          floor_plan_id?: string | null
          id?: string
          total_cost?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "saved_builds_floor_plan_id_fkey"
            columns: ["floor_plan_id"]
            isOneToOne: false
            referencedRelation: "floor_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_builds_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_builds_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      admin_users: {
        Row: {
          id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      cleanup_rate_limits: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      should_fetch_listings: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      contractor_type:
        | "electrical"
        | "plumbing"
        | "hvac"
        | "roofing"
        | "foundation"
        | "framing"
        | "drywall"
        | "painting"
        | "landscaping"
        | "general"
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
