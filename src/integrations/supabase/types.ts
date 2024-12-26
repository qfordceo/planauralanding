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
      contractors: {
        Row: {
          address: string | null
          bbb_certified: boolean | null
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
          bbb_certified?: boolean | null
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
          bbb_certified?: boolean | null
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
      floor_plans: {
        Row: {
          bathrooms: number
          bedrooms: number
          created_at: string
          description: string | null
          foundation_type: string | null
          id: string
          image_url: string | null
          name: string
          plan_price: number
          square_feet: number
          style: string | null
          updated_at: string
        }
        Insert: {
          bathrooms: number
          bedrooms: number
          created_at?: string
          description?: string | null
          foundation_type?: string | null
          id?: string
          image_url?: string | null
          name: string
          plan_price: number
          square_feet: number
          style?: string | null
          updated_at?: string
        }
        Update: {
          bathrooms?: number
          bedrooms?: number
          created_at?: string
          description?: string | null
          foundation_type?: string | null
          id?: string
          image_url?: string | null
          name?: string
          plan_price?: number
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
          last_fetched_at: string | null
          price: number | null
          price_per_acre: number | null
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
          last_fetched_at?: string | null
          price?: number | null
          price_per_acre?: number | null
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
          last_fetched_at?: string | null
          price?: number | null
          price_per_acre?: number | null
          realtor_url?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          id: string
          is_admin: boolean | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id: string
          is_admin?: boolean | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          is_admin?: boolean | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
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
