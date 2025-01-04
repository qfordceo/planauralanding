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
      ai_floor_plan_analyses: {
        Row: {
          analysis_data: Json
          created_at: string
          electrical_layout: Json
          floor_plan_id: string | null
          id: string
          material_suggestions: Json
          room_dimensions: Json
          updated_at: string
        }
        Insert: {
          analysis_data?: Json
          created_at?: string
          electrical_layout?: Json
          floor_plan_id?: string | null
          id?: string
          material_suggestions?: Json
          room_dimensions?: Json
          updated_at?: string
        }
        Update: {
          analysis_data?: Json
          created_at?: string
          electrical_layout?: Json
          floor_plan_id?: string | null
          id?: string
          material_suggestions?: Json
          room_dimensions?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_floor_plan_analyses_floor_plan_id_fkey"
            columns: ["floor_plan_id"]
            isOneToOne: false
            referencedRelation: "floor_plans"
            referencedColumns: ["id"]
          },
        ]
      }
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
          land_cost: number | null
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
          land_cost?: number | null
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
          land_cost?: number | null
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
          awarded_contractor_id: string | null
          awarded_cost: number | null
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
          awarded_contractor_id?: string | null
          awarded_cost?: number | null
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
          awarded_contractor_id?: string | null
          awarded_cost?: number | null
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
            foreignKeyName: "build_line_items_awarded_contractor_id_fkey"
            columns: ["awarded_contractor_id"]
            isOneToOne: false
            referencedRelation: "contractors"
            referencedColumns: ["id"]
          },
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
      build_materials: {
        Row: {
          actual_cost: number | null
          build_line_item_id: string | null
          created_at: string
          description: string | null
          estimated_cost: number | null
          id: string
          material_type: string
          name: string
          product_url: string | null
          quantity: number
          status: string | null
          updated_at: string
        }
        Insert: {
          actual_cost?: number | null
          build_line_item_id?: string | null
          created_at?: string
          description?: string | null
          estimated_cost?: number | null
          id?: string
          material_type: string
          name: string
          product_url?: string | null
          quantity: number
          status?: string | null
          updated_at?: string
        }
        Update: {
          actual_cost?: number | null
          build_line_item_id?: string | null
          created_at?: string
          description?: string | null
          estimated_cost?: number | null
          id?: string
          material_type?: string
          name?: string
          product_url?: string | null
          quantity?: number
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "build_materials_build_line_item_id_fkey"
            columns: ["build_line_item_id"]
            isOneToOne: false
            referencedRelation: "build_line_items"
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
      compliance_verification_logs: {
        Row: {
          contractor_id: string | null
          created_at: string
          id: string
          last_verified_at: string
          next_verification_date: string | null
          updated_at: string
          verification_data: Json | null
          verification_status: string
          verification_type: string
        }
        Insert: {
          contractor_id?: string | null
          created_at?: string
          id?: string
          last_verified_at?: string
          next_verification_date?: string | null
          updated_at?: string
          verification_data?: Json | null
          verification_status: string
          verification_type: string
        }
        Update: {
          contractor_id?: string | null
          created_at?: string
          id?: string
          last_verified_at?: string
          next_verification_date?: string | null
          updated_at?: string
          verification_data?: Json | null
          verification_status?: string
          verification_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "compliance_verification_logs_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "contractors"
            referencedColumns: ["id"]
          },
        ]
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
      contractor_badges: {
        Row: {
          active: boolean | null
          badge_type: string
          contractor_id: string | null
          created_at: string | null
          criteria_met: Json | null
          earned_at: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          badge_type: string
          contractor_id?: string | null
          created_at?: string | null
          criteria_met?: Json | null
          earned_at?: string | null
          id?: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          badge_type?: string
          contractor_id?: string | null
          created_at?: string | null
          criteria_met?: Json | null
          earned_at?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contractor_badges_contractor_id_fkey"
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
      contractor_clients: {
        Row: {
          address: string | null
          contractor_id: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          opt_in_marketing: boolean | null
          phone: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          contractor_id?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          opt_in_marketing?: boolean | null
          phone?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          contractor_id?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          opt_in_marketing?: boolean | null
          phone?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contractor_clients_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "contractors"
            referencedColumns: ["id"]
          },
        ]
      }
      contractor_compliance_documents: {
        Row: {
          contractor_id: string | null
          created_at: string | null
          document_number: string | null
          document_type: string
          document_url: string | null
          expiration_date: string | null
          id: string
          issue_date: string | null
          issuing_authority: string | null
          updated_at: string | null
          verification_notes: string | null
          verification_status: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          contractor_id?: string | null
          created_at?: string | null
          document_number?: string | null
          document_type: string
          document_url?: string | null
          expiration_date?: string | null
          id?: string
          issue_date?: string | null
          issuing_authority?: string | null
          updated_at?: string | null
          verification_notes?: string | null
          verification_status?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          contractor_id?: string | null
          created_at?: string | null
          document_number?: string | null
          document_type?: string
          document_url?: string | null
          expiration_date?: string | null
          id?: string
          issue_date?: string | null
          issuing_authority?: string | null
          updated_at?: string | null
          verification_notes?: string | null
          verification_status?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contractor_compliance_documents_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "contractors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contractor_compliance_documents_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contractor_compliance_documents_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "profiles"
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
      contractor_expenses: {
        Row: {
          amount: number
          category: string
          contractor_id: string | null
          created_at: string
          date: string
          description: string
          id: string
          receipt_url: string | null
          tax_category: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          category: string
          contractor_id?: string | null
          created_at?: string
          date: string
          description: string
          id?: string
          receipt_url?: string | null
          tax_category?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          category?: string
          contractor_id?: string | null
          created_at?: string
          date?: string
          description?: string
          id?: string
          receipt_url?: string | null
          tax_category?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contractor_expenses_contractor_id_fkey"
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
      contractor_inventory: {
        Row: {
          category: string | null
          contractor_id: string | null
          created_at: string
          id: string
          last_updated: string
          location: string | null
          material_name: string
          quantity: number
          unit: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          contractor_id?: string | null
          created_at?: string
          id?: string
          last_updated?: string
          location?: string | null
          material_name: string
          quantity?: number
          unit: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          contractor_id?: string | null
          created_at?: string
          id?: string
          last_updated?: string
          location?: string | null
          material_name?: string
          quantity?: number
          unit?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contractor_inventory_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "contractors"
            referencedColumns: ["id"]
          },
        ]
      }
      contractor_liability_waivers: {
        Row: {
          accepted_at: string | null
          contractor_id: string | null
          created_at: string | null
          id: string
          ip_address: string | null
          updated_at: string | null
          user_agent: string | null
          waiver_type: string
          waiver_version: string
        }
        Insert: {
          accepted_at?: string | null
          contractor_id?: string | null
          created_at?: string | null
          id?: string
          ip_address?: string | null
          updated_at?: string | null
          user_agent?: string | null
          waiver_type: string
          waiver_version: string
        }
        Update: {
          accepted_at?: string | null
          contractor_id?: string | null
          created_at?: string | null
          id?: string
          ip_address?: string | null
          updated_at?: string | null
          user_agent?: string | null
          waiver_type?: string
          waiver_version?: string
        }
        Relationships: [
          {
            foreignKeyName: "contractor_liability_waivers_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "contractors"
            referencedColumns: ["id"]
          },
        ]
      }
      contractor_marketing: {
        Row: {
          content: string | null
          contractor_id: string | null
          created_at: string
          id: string
          metrics: Json | null
          platform: string | null
          scheduled_date: string | null
          status: string | null
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          content?: string | null
          contractor_id?: string | null
          created_at?: string
          id?: string
          metrics?: Json | null
          platform?: string | null
          scheduled_date?: string | null
          status?: string | null
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          content?: string | null
          contractor_id?: string | null
          created_at?: string
          id?: string
          metrics?: Json | null
          platform?: string | null
          scheduled_date?: string | null
          status?: string | null
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contractor_marketing_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "contractors"
            referencedColumns: ["id"]
          },
        ]
      }
      contractor_onboarding_progress: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          contractor_id: string
          created_at: string
          id: string
          last_reminder_sent: string | null
          step_name: string
          updated_at: string
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          contractor_id: string
          created_at?: string
          id?: string
          last_reminder_sent?: string | null
          step_name: string
          updated_at?: string
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          contractor_id?: string
          created_at?: string
          id?: string
          last_reminder_sent?: string | null
          step_name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contractor_onboarding_progress_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "contractors"
            referencedColumns: ["id"]
          },
        ]
      }
      contractor_payment_milestones: {
        Row: {
          amount: number
          completed_date: string | null
          contractor_id: string | null
          created_at: string | null
          dispute_reason: string | null
          dispute_resolution_notes: string | null
          due_date: string | null
          escrow_funded_at: string | null
          escrow_released_at: string | null
          escrow_status: string | null
          id: string
          invoice_generated: boolean | null
          invoice_url: string | null
          project_id: string | null
          release_conditions: Json | null
          status: string | null
          stripe_payment_intent_id: string | null
          stripe_transfer_id: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          completed_date?: string | null
          contractor_id?: string | null
          created_at?: string | null
          dispute_reason?: string | null
          dispute_resolution_notes?: string | null
          due_date?: string | null
          escrow_funded_at?: string | null
          escrow_released_at?: string | null
          escrow_status?: string | null
          id?: string
          invoice_generated?: boolean | null
          invoice_url?: string | null
          project_id?: string | null
          release_conditions?: Json | null
          status?: string | null
          stripe_payment_intent_id?: string | null
          stripe_transfer_id?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          completed_date?: string | null
          contractor_id?: string | null
          created_at?: string | null
          dispute_reason?: string | null
          dispute_resolution_notes?: string | null
          due_date?: string | null
          escrow_funded_at?: string | null
          escrow_released_at?: string | null
          escrow_status?: string | null
          id?: string
          invoice_generated?: boolean | null
          invoice_url?: string | null
          project_id?: string | null
          release_conditions?: Json | null
          status?: string | null
          stripe_payment_intent_id?: string | null
          stripe_transfer_id?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contractor_payment_milestones_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "contractors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contractor_payment_milestones_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "contractor_projects"
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
      contractor_projects: {
        Row: {
          actual_cost: number | null
          budget: number | null
          client_id: string | null
          contractor_id: string | null
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          start_date: string | null
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          actual_cost?: number | null
          budget?: number | null
          client_id?: string | null
          contractor_id?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          start_date?: string | null
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          actual_cost?: number | null
          budget?: number | null
          client_id?: string | null
          contractor_id?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          start_date?: string | null
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contractor_projects_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "contractor_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contractor_projects_contractor_id_fkey"
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
      contractor_resource_feedback: {
        Row: {
          created_at: string | null
          feedback_text: string | null
          id: string
          rating: number | null
          resource_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          feedback_text?: string | null
          id?: string
          rating?: number | null
          resource_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          feedback_text?: string | null
          id?: string
          rating?: number | null
          resource_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contractor_resource_feedback_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "contractor_resources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contractor_resource_feedback_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contractor_resource_feedback_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      contractor_resources: {
        Row: {
          category: string
          content: string
          created_at: string
          description: string | null
          external_links: Json | null
          id: string
          title: string
          updated_at: string
          view_count: number | null
        }
        Insert: {
          category: string
          content: string
          created_at?: string
          description?: string | null
          external_links?: Json | null
          id?: string
          title: string
          updated_at?: string
          view_count?: number | null
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          description?: string | null
          external_links?: Json | null
          id?: string
          title?: string
          updated_at?: string
          view_count?: number | null
        }
        Relationships: []
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
          business_classification: string | null
          business_name: string
          contact_name: string
          contractor_types: Database["public"]["Enums"]["contractor_type"][]
          created_at: string
          dpa_accepted: boolean | null
          dpa_accepted_at: string | null
          has_workers_comp: boolean | null
          id: string
          insurance_expiry: string | null
          insurance_verified: boolean | null
          liability_waiver_accepted: boolean | null
          liability_waiver_accepted_at: string | null
          notification_preferences: Json | null
          phone: string | null
          stripe_account_created_at: string | null
          stripe_account_enabled: boolean | null
          stripe_account_id: string | null
          stripe_account_requirements: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          average_rating?: number | null
          bbb_certified?: boolean | null
          bid_notifications?: boolean | null
          business_classification?: string | null
          business_name: string
          contact_name: string
          contractor_types: Database["public"]["Enums"]["contractor_type"][]
          created_at?: string
          dpa_accepted?: boolean | null
          dpa_accepted_at?: string | null
          has_workers_comp?: boolean | null
          id?: string
          insurance_expiry?: string | null
          insurance_verified?: boolean | null
          liability_waiver_accepted?: boolean | null
          liability_waiver_accepted_at?: string | null
          notification_preferences?: Json | null
          phone?: string | null
          stripe_account_created_at?: string | null
          stripe_account_enabled?: boolean | null
          stripe_account_id?: string | null
          stripe_account_requirements?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          average_rating?: number | null
          bbb_certified?: boolean | null
          bid_notifications?: boolean | null
          business_classification?: string | null
          business_name?: string
          contact_name?: string
          contractor_types?: Database["public"]["Enums"]["contractor_type"][]
          created_at?: string
          dpa_accepted?: boolean | null
          dpa_accepted_at?: string | null
          has_workers_comp?: boolean | null
          id?: string
          insurance_expiry?: string | null
          insurance_verified?: boolean | null
          liability_waiver_accepted?: boolean | null
          liability_waiver_accepted_at?: string | null
          notification_preferences?: Json | null
          phone?: string | null
          stripe_account_created_at?: string | null
          stripe_account_enabled?: boolean | null
          stripe_account_id?: string | null
          stripe_account_requirements?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      educational_resources: {
        Row: {
          category: string
          content: string
          content_type: string | null
          created_at: string | null
          description: string | null
          difficulty_level: string | null
          estimated_reading_time: number | null
          external_links: Json | null
          id: string
          related_resources: string[] | null
          resource_type: string
          tags: string[] | null
          title: string
          updated_at: string | null
          view_count: number | null
        }
        Insert: {
          category: string
          content: string
          content_type?: string | null
          created_at?: string | null
          description?: string | null
          difficulty_level?: string | null
          estimated_reading_time?: number | null
          external_links?: Json | null
          id?: string
          related_resources?: string[] | null
          resource_type: string
          tags?: string[] | null
          title: string
          updated_at?: string | null
          view_count?: number | null
        }
        Update: {
          category?: string
          content?: string
          content_type?: string | null
          created_at?: string | null
          description?: string | null
          difficulty_level?: string | null
          estimated_reading_time?: number | null
          external_links?: Json | null
          id?: string
          related_resources?: string[] | null
          resource_type?: string
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          view_count?: number | null
        }
        Relationships: []
      }
      floor_plan_analyses: {
        Row: {
          analysis_data: Json
          created_at: string
          customizations: Json
          floor_plan_id: string | null
          id: string
          material_estimates: Json
          updated_at: string
        }
        Insert: {
          analysis_data?: Json
          created_at?: string
          customizations?: Json
          floor_plan_id?: string | null
          id?: string
          material_estimates?: Json
          updated_at?: string
        }
        Update: {
          analysis_data?: Json
          created_at?: string
          customizations?: Json
          floor_plan_id?: string | null
          id?: string
          material_estimates?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "floor_plan_analyses_floor_plan_id_fkey"
            columns: ["floor_plan_id"]
            isOneToOne: false
            referencedRelation: "floor_plans"
            referencedColumns: ["id"]
          },
        ]
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
      insurance_providers: {
        Row: {
          average_rating: number | null
          contact_info: Json | null
          coverage_types: string[]
          created_at: string
          description: string | null
          id: string
          name: string
          review_count: number | null
          updated_at: string
          website_url: string | null
        }
        Insert: {
          average_rating?: number | null
          contact_info?: Json | null
          coverage_types: string[]
          created_at?: string
          description?: string | null
          id?: string
          name: string
          review_count?: number | null
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          average_rating?: number | null
          contact_info?: Json | null
          coverage_types?: string[]
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          review_count?: number | null
          updated_at?: string
          website_url?: string | null
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
      license_verification_logs: {
        Row: {
          contractor_id: string | null
          id: string
          license_number: string
          next_verification_date: string | null
          status: string
          verification_result: Json
          verification_source: string
          verified_at: string
        }
        Insert: {
          contractor_id?: string | null
          id?: string
          license_number: string
          next_verification_date?: string | null
          status?: string
          verification_result: Json
          verification_source: string
          verified_at?: string
        }
        Update: {
          contractor_id?: string | null
          id?: string
          license_number?: string
          next_verification_date?: string | null
          status?: string
          verification_result?: Json
          verification_source?: string
          verified_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "license_verification_logs_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "contractors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "license_verification_logs_contractor_id_fkey1"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "contractors"
            referencedColumns: ["id"]
          },
        ]
      }
      material_orders: {
        Row: {
          contractor_id: string | null
          created_at: string
          id: string
          order_details: Json
          project_id: string | null
          status: string
          supplier_id: string | null
          total_amount: number | null
          tracking_info: Json | null
          updated_at: string
        }
        Insert: {
          contractor_id?: string | null
          created_at?: string
          id?: string
          order_details?: Json
          project_id?: string | null
          status?: string
          supplier_id?: string | null
          total_amount?: number | null
          tracking_info?: Json | null
          updated_at?: string
        }
        Update: {
          contractor_id?: string | null
          created_at?: string
          id?: string
          order_details?: Json
          project_id?: string | null
          status?: string
          supplier_id?: string | null
          total_amount?: number | null
          tracking_info?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "material_orders_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "contractors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "material_orders_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "contractor_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "material_orders_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "material_suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      material_suppliers: {
        Row: {
          categories: string[]
          contact_info: Json | null
          created_at: string
          id: string
          name: string
          rating: number | null
          updated_at: string
        }
        Insert: {
          categories?: string[]
          contact_info?: Json | null
          created_at?: string
          id?: string
          name: string
          rating?: number | null
          updated_at?: string
        }
        Update: {
          categories?: string[]
          contact_info?: Json | null
          created_at?: string
          id?: string
          name?: string
          rating?: number | null
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
          terms_accepted: boolean | null
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
          terms_accepted?: boolean | null
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
          terms_accepted?: boolean | null
          updated_at?: string
        }
        Relationships: []
      }
      project_messages: {
        Row: {
          created_at: string | null
          id: string
          message: string
          project_id: string
          read: boolean | null
          recipient_id: string | null
          sender_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          project_id: string
          read?: boolean | null
          recipient_id?: string | null
          sender_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          project_id?: string
          read?: boolean | null
          recipient_id?: string | null
          sender_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_messages_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_messages_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_messages_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
      visualization_data: {
        Row: {
          camera_positions: Json
          created_at: string
          floor_plan_id: string | null
          id: string
          lighting_data: Json
          materials_data: Json
          model_format: string
          scene_data: Json
          updated_at: string
        }
        Insert: {
          camera_positions?: Json
          created_at?: string
          floor_plan_id?: string | null
          id?: string
          lighting_data?: Json
          materials_data?: Json
          model_format: string
          scene_data?: Json
          updated_at?: string
        }
        Update: {
          camera_positions?: Json
          created_at?: string
          floor_plan_id?: string | null
          id?: string
          lighting_data?: Json
          materials_data?: Json
          model_format?: string
          scene_data?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "visualization_data_floor_plan_id_fkey"
            columns: ["floor_plan_id"]
            isOneToOne: false
            referencedRelation: "floor_plans"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      admin_users: {
        Row: {
          email: string | null
          id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      can_access_admin_users: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      check_and_award_badges: {
        Args: {
          contractor_id: string
        }
        Returns: undefined
      }
      cleanup_rate_limits: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_admin_users: {
        Args: Record<PropertyKey, never>
        Returns: unknown[]
      }
      increment_resource_view_count: {
        Args: {
          resource_id: string
        }
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
      resource_category:
        | "safety_guidelines"
        | "legal_templates"
        | "best_practices"
        | "training_materials"
        | "industry_updates"
        | "tools_equipment"
        | "business_management"
        | "marketing_tips"
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
