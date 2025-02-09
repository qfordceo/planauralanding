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
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string | null
          id: string
          new_data: Json | null
          old_data: Json | null
          record_id: string
          table_name: string
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string | null
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          record_id: string
          table_name: string
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string | null
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string
          table_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_logs_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bim_file_versions: {
        Row: {
          bim_model_id: string | null
          change_summary: string | null
          checksum: string | null
          created_at: string | null
          created_by: string | null
          file_format: string
          file_path: string
          file_size: number | null
          id: string
          metadata: Json | null
          version_number: number
        }
        Insert: {
          bim_model_id?: string | null
          change_summary?: string | null
          checksum?: string | null
          created_at?: string | null
          created_by?: string | null
          file_format: string
          file_path: string
          file_size?: number | null
          id?: string
          metadata?: Json | null
          version_number: number
        }
        Update: {
          bim_model_id?: string | null
          change_summary?: string | null
          checksum?: string | null
          created_at?: string | null
          created_by?: string | null
          file_format?: string
          file_path?: string
          file_size?: number | null
          id?: string
          metadata?: Json | null
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "bim_file_versions_bim_model_id_fkey"
            columns: ["bim_model_id"]
            isOneToOne: false
            referencedRelation: "bim_models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bim_file_versions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bim_file_versions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bim_material_selections: {
        Row: {
          bim_material_id: string | null
          created_at: string | null
          id: string
          notes: string | null
          quantity: number
          selected_product: Json
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          bim_material_id?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          quantity: number
          selected_product: Json
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          bim_material_id?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          quantity?: number
          selected_product?: Json
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bim_material_selections_bim_material_id_fkey"
            columns: ["bim_material_id"]
            isOneToOne: false
            referencedRelation: "bim_materials"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bim_material_selections_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bim_material_selections_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bim_materials: {
        Row: {
          bim_model_id: string | null
          category: string
          created_at: string | null
          estimated_cost: number | null
          id: string
          material_type: string
          quantity: number
          specifications: Json | null
          unit: string
          updated_at: string | null
        }
        Insert: {
          bim_model_id?: string | null
          category: string
          created_at?: string | null
          estimated_cost?: number | null
          id?: string
          material_type: string
          quantity: number
          specifications?: Json | null
          unit: string
          updated_at?: string | null
        }
        Update: {
          bim_model_id?: string | null
          category?: string
          created_at?: string | null
          estimated_cost?: number | null
          id?: string
          material_type?: string
          quantity?: number
          specifications?: Json | null
          unit?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bim_materials_bim_model_id_fkey"
            columns: ["bim_model_id"]
            isOneToOne: false
            referencedRelation: "bim_models"
            referencedColumns: ["id"]
          },
        ]
      }
      bim_models: {
        Row: {
          as_built_date: string | null
          created_at: string | null
          dwg_file_path: string | null
          file_format: string | null
          floor_plan_id: string | null
          id: string
          ifc_file_path: string | null
          is_as_built: boolean | null
          last_validated: string | null
          metadata: Json | null
          model_data: Json | null
          processing_errors: string[] | null
          processing_status: string | null
          updated_at: string | null
          validation_errors: Json | null
          validation_status: string | null
          version: string | null
        }
        Insert: {
          as_built_date?: string | null
          created_at?: string | null
          dwg_file_path?: string | null
          file_format?: string | null
          floor_plan_id?: string | null
          id?: string
          ifc_file_path?: string | null
          is_as_built?: boolean | null
          last_validated?: string | null
          metadata?: Json | null
          model_data?: Json | null
          processing_errors?: string[] | null
          processing_status?: string | null
          updated_at?: string | null
          validation_errors?: Json | null
          validation_status?: string | null
          version?: string | null
        }
        Update: {
          as_built_date?: string | null
          created_at?: string | null
          dwg_file_path?: string | null
          file_format?: string | null
          floor_plan_id?: string | null
          id?: string
          ifc_file_path?: string | null
          is_as_built?: boolean | null
          last_validated?: string | null
          metadata?: Json | null
          model_data?: Json | null
          processing_errors?: string[] | null
          processing_status?: string | null
          updated_at?: string | null
          validation_errors?: Json | null
          validation_status?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bim_models_floor_plan_id_fkey"
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
            foreignKeyName: "build_line_items_awarded_contractor_id_fkey"
            columns: ["awarded_contractor_id"]
            isOneToOne: false
            referencedRelation: "resource_availability_view"
            referencedColumns: ["contractor_id"]
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
          {
            foreignKeyName: "build_line_items_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "resource_availability_view"
            referencedColumns: ["contractor_id"]
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
      clash_detection_reports: {
        Row: {
          analysis_results: string
          created_at: string
          id: string
          model_data: Json
          resolution_notes: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["clash_report_status"] | null
          updated_at: string
        }
        Insert: {
          analysis_results: string
          created_at?: string
          id?: string
          model_data: Json
          resolution_notes?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["clash_report_status"] | null
          updated_at?: string
        }
        Update: {
          analysis_results?: string
          created_at?: string
          id?: string
          model_data?: Json
          resolution_notes?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["clash_report_status"] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "clash_detection_reports_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clash_detection_reports_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      compliance_checks: {
        Row: {
          checked_at: string
          created_at: string
          details: Json | null
          floor_plan_id: string | null
          id: string
          location_data: Json | null
          rule_id: string | null
          status: Database["public"]["Enums"]["compliance_check_status"] | null
          updated_at: string
        }
        Insert: {
          checked_at?: string
          created_at?: string
          details?: Json | null
          floor_plan_id?: string | null
          id?: string
          location_data?: Json | null
          rule_id?: string | null
          status?: Database["public"]["Enums"]["compliance_check_status"] | null
          updated_at?: string
        }
        Update: {
          checked_at?: string
          created_at?: string
          details?: Json | null
          floor_plan_id?: string | null
          id?: string
          location_data?: Json | null
          rule_id?: string | null
          status?: Database["public"]["Enums"]["compliance_check_status"] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "compliance_checks_floor_plan_id_fkey"
            columns: ["floor_plan_id"]
            isOneToOne: false
            referencedRelation: "floor_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compliance_checks_rule_id_fkey"
            columns: ["rule_id"]
            isOneToOne: false
            referencedRelation: "compliance_rules"
            referencedColumns: ["id"]
          },
        ]
      }
      compliance_reports: {
        Row: {
          created_at: string
          floor_plan_id: string | null
          generated_at: string
          id: string
          pdf_url: string | null
          report_data: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          floor_plan_id?: string | null
          generated_at?: string
          id?: string
          pdf_url?: string | null
          report_data?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          floor_plan_id?: string | null
          generated_at?: string
          id?: string
          pdf_url?: string | null
          report_data?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "compliance_reports_floor_plan_id_fkey"
            columns: ["floor_plan_id"]
            isOneToOne: false
            referencedRelation: "floor_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      compliance_rules: {
        Row: {
          category: string
          check_type: string
          code_reference: string | null
          created_at: string
          description: string
          id: string
          location_specific: boolean | null
          parameters: Json | null
          updated_at: string
        }
        Insert: {
          category: string
          check_type: string
          code_reference?: string | null
          created_at?: string
          description: string
          id?: string
          location_specific?: boolean | null
          parameters?: Json | null
          updated_at?: string
        }
        Update: {
          category?: string
          check_type?: string
          code_reference?: string | null
          created_at?: string
          description?: string
          id?: string
          location_specific?: boolean | null
          parameters?: Json | null
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
          {
            foreignKeyName: "compliance_verification_logs_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "resource_availability_view"
            referencedColumns: ["contractor_id"]
          },
        ]
      }
      construction_task_templates: {
        Row: {
          created_at: string | null
          dependencies: string[] | null
          description: string | null
          estimated_duration: number | null
          id: string
          is_optional: boolean | null
          phase: string
          required_inspections: boolean | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          dependencies?: string[] | null
          description?: string | null
          estimated_duration?: number | null
          id?: string
          is_optional?: boolean | null
          phase: string
          required_inspections?: boolean | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          dependencies?: string[] | null
          description?: string | null
          estimated_duration?: number | null
          id?: string
          is_optional?: boolean | null
          phase?: string
          required_inspections?: boolean | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      contract_signing_notifications: {
        Row: {
          contract_id: string | null
          email_status: string | null
          id: string
          metadata: Json | null
          notification_type: string
          recipient_id: string | null
          sent_at: string | null
        }
        Insert: {
          contract_id?: string | null
          email_status?: string | null
          id?: string
          metadata?: Json | null
          notification_type: string
          recipient_id?: string | null
          sent_at?: string | null
        }
        Update: {
          contract_id?: string | null
          email_status?: string | null
          id?: string
          metadata?: Json | null
          notification_type?: string
          recipient_id?: string | null
          sent_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contract_signing_notifications_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "project_contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contract_signing_notifications_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contract_signing_notifications_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
          {
            foreignKeyName: "contractor_appointments_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "resource_availability_view"
            referencedColumns: ["contractor_id"]
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
          {
            foreignKeyName: "contractor_availability_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "resource_availability_view"
            referencedColumns: ["contractor_id"]
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
          {
            foreignKeyName: "contractor_badges_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "resource_availability_view"
            referencedColumns: ["contractor_id"]
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
            foreignKeyName: "contractor_bids_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "resource_availability_view"
            referencedColumns: ["contractor_id"]
          },
          {
            foreignKeyName: "contractor_bids_project_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_statistics"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "contractor_bids_project_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_statistics_secure"
            referencedColumns: ["project_id"]
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
          {
            foreignKeyName: "contractor_clients_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "resource_availability_view"
            referencedColumns: ["contractor_id"]
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
          last_verification_attempt: string | null
          updated_at: string | null
          verification_notes: string | null
          verification_provider: string | null
          verification_response: Json | null
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
          last_verification_attempt?: string | null
          updated_at?: string | null
          verification_notes?: string | null
          verification_provider?: string | null
          verification_response?: Json | null
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
          last_verification_attempt?: string | null
          updated_at?: string | null
          verification_notes?: string | null
          verification_provider?: string | null
          verification_response?: Json | null
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
            foreignKeyName: "contractor_compliance_documents_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "resource_availability_view"
            referencedColumns: ["contractor_id"]
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
          {
            foreignKeyName: "contractor_day_exceptions_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "resource_availability_view"
            referencedColumns: ["contractor_id"]
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
          {
            foreignKeyName: "contractor_expenses_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "resource_availability_view"
            referencedColumns: ["contractor_id"]
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
            foreignKeyName: "contractor_inspection_defects_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "resource_availability_view"
            referencedColumns: ["contractor_id"]
          },
          {
            foreignKeyName: "contractor_inspection_defects_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_statistics"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "contractor_inspection_defects_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_statistics_secure"
            referencedColumns: ["project_id"]
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
          {
            foreignKeyName: "contractor_inventory_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "resource_availability_view"
            referencedColumns: ["contractor_id"]
          },
        ]
      }
      contractor_liability_waivers: {
        Row: {
          accepted_at: string | null
          confirmation_data: Json | null
          confirmation_type: string | null
          contractor_id: string | null
          created_at: string | null
          dispute_history: Json | null
          id: string
          ip_address: string | null
          last_confirmed_at: string | null
          signature_data: Json | null
          updated_at: string | null
          user_agent: string | null
          waiver_type: string
          waiver_version: string
        }
        Insert: {
          accepted_at?: string | null
          confirmation_data?: Json | null
          confirmation_type?: string | null
          contractor_id?: string | null
          created_at?: string | null
          dispute_history?: Json | null
          id?: string
          ip_address?: string | null
          last_confirmed_at?: string | null
          signature_data?: Json | null
          updated_at?: string | null
          user_agent?: string | null
          waiver_type: string
          waiver_version: string
        }
        Update: {
          accepted_at?: string | null
          confirmation_data?: Json | null
          confirmation_type?: string | null
          contractor_id?: string | null
          created_at?: string | null
          dispute_history?: Json | null
          id?: string
          ip_address?: string | null
          last_confirmed_at?: string | null
          signature_data?: Json | null
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
          {
            foreignKeyName: "contractor_liability_waivers_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "resource_availability_view"
            referencedColumns: ["contractor_id"]
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
          {
            foreignKeyName: "contractor_marketing_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "resource_availability_view"
            referencedColumns: ["contractor_id"]
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
          step_name: Database["public"]["Enums"]["onboarding_step_type"]
          updated_at: string
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          contractor_id: string
          created_at?: string
          id?: string
          last_reminder_sent?: string | null
          step_name: Database["public"]["Enums"]["onboarding_step_type"]
          updated_at?: string
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          contractor_id?: string
          created_at?: string
          id?: string
          last_reminder_sent?: string | null
          step_name?: Database["public"]["Enums"]["onboarding_step_type"]
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
          {
            foreignKeyName: "contractor_onboarding_progress_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "resource_availability_view"
            referencedColumns: ["contractor_id"]
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
            foreignKeyName: "contractor_payment_milestones_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "resource_availability_view"
            referencedColumns: ["contractor_id"]
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
          {
            foreignKeyName: "contractor_portfolio_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "resource_availability_view"
            referencedColumns: ["contractor_id"]
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
          {
            foreignKeyName: "contractor_projects_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "resource_availability_view"
            referencedColumns: ["contractor_id"]
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
          {
            foreignKeyName: "contractor_references_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "resource_availability_view"
            referencedColumns: ["contractor_id"]
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
          difficulty_level: string | null
          estimated_reading_time: number | null
          external_links: Json | null
          id: string
          related_resources: string[] | null
          resource_type: string | null
          tags: string[] | null
          title: string
          updated_at: string
          view_count: number | null
        }
        Insert: {
          category: string
          content: string
          created_at?: string
          description?: string | null
          difficulty_level?: string | null
          estimated_reading_time?: number | null
          external_links?: Json | null
          id?: string
          related_resources?: string[] | null
          resource_type?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
          view_count?: number | null
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          description?: string | null
          difficulty_level?: string | null
          estimated_reading_time?: number | null
          external_links?: Json | null
          id?: string
          related_resources?: string[] | null
          resource_type?: string | null
          tags?: string[] | null
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
          {
            foreignKeyName: "contractor_reviews_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "resource_availability_view"
            referencedColumns: ["contractor_id"]
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
      customer_subscriptions: {
        Row: {
          cancel_at_period_end: boolean
          created_at: string
          current_period_end: string
          current_period_start: string
          id: string
          plan_id: string
          status: string
          stripe_customer_id: string
          stripe_subscription_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean
          created_at?: string
          current_period_end: string
          current_period_start: string
          id?: string
          plan_id: string
          status: string
          stripe_customer_id: string
          stripe_subscription_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean
          created_at?: string
          current_period_end?: string
          current_period_start?: string
          id?: string
          plan_id?: string
          status?: string
          stripe_customer_id?: string
          stripe_subscription_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      customization_options: {
        Row: {
          base_cost: number
          created_at: string
          description: string | null
          id: string
          name: string
          type: Database["public"]["Enums"]["customization_type"]
          unit: string | null
          updated_at: string
        }
        Insert: {
          base_cost?: number
          created_at?: string
          description?: string | null
          id?: string
          name: string
          type: Database["public"]["Enums"]["customization_type"]
          unit?: string | null
          updated_at?: string
        }
        Update: {
          base_cost?: number
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          type?: Database["public"]["Enums"]["customization_type"]
          unit?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      dispute_mediation_sessions: {
        Row: {
          client_accepted: boolean | null
          contractor_accepted: boolean | null
          created_at: string | null
          dispute_id: string | null
          id: string
          mediator_id: string | null
          notes: string | null
          resolution_proposal: string | null
          scheduled_date: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          client_accepted?: boolean | null
          contractor_accepted?: boolean | null
          created_at?: string | null
          dispute_id?: string | null
          id?: string
          mediator_id?: string | null
          notes?: string | null
          resolution_proposal?: string | null
          scheduled_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          client_accepted?: boolean | null
          contractor_accepted?: boolean | null
          created_at?: string | null
          dispute_id?: string | null
          id?: string
          mediator_id?: string | null
          notes?: string | null
          resolution_proposal?: string | null
          scheduled_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dispute_mediation_sessions_dispute_id_fkey"
            columns: ["dispute_id"]
            isOneToOne: false
            referencedRelation: "project_disputes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dispute_mediation_sessions_mediator_id_fkey"
            columns: ["mediator_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dispute_mediation_sessions_mediator_id_fkey"
            columns: ["mediator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      document_versions: {
        Row: {
          created_at: string | null
          created_by: string | null
          document_id: string
          file_path: string
          id: string
          metadata: Json | null
          version_number: number
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          document_id: string
          file_path: string
          id?: string
          metadata?: Json | null
          version_number: number
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          document_id?: string
          file_path?: string
          id?: string
          metadata?: Json | null
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "document_versions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_versions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_versions_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "project_contracts"
            referencedColumns: ["id"]
          },
        ]
      }
      documentation_guides: {
        Row: {
          change_summary: string | null
          content: Json
          created_at: string
          guide_type: string
          id: string
          is_published: boolean | null
          title: string
          updated_at: string
          updated_by: string | null
          version: number
        }
        Insert: {
          change_summary?: string | null
          content: Json
          created_at?: string
          guide_type: string
          id?: string
          is_published?: boolean | null
          title: string
          updated_at?: string
          updated_by?: string | null
          version?: number
        }
        Update: {
          change_summary?: string | null
          content?: Json
          created_at?: string
          guide_type?: string
          id?: string
          is_published?: boolean | null
          title?: string
          updated_at?: string
          updated_by?: string | null
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "documentation_guides_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documentation_guides_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
      file_conversions: {
        Row: {
          conversion_status: string
          converted_file_path: string | null
          created_at: string
          file_type: string
          id: string
          metadata: Json | null
          original_file_path: string
          processing_errors: string[] | null
          updated_at: string
        }
        Insert: {
          conversion_status?: string
          converted_file_path?: string | null
          created_at?: string
          file_type: string
          id?: string
          metadata?: Json | null
          original_file_path: string
          processing_errors?: string[] | null
          updated_at?: string
        }
        Update: {
          conversion_status?: string
          converted_file_path?: string | null
          created_at?: string
          file_type?: string
          id?: string
          metadata?: Json | null
          original_file_path?: string
          processing_errors?: string[] | null
          updated_at?: string
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
      inspection_add_ons: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          price: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          price: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          price?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      inspection_plans: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          inspection_limit: number
          is_active: boolean | null
          name: string
          plan_type: string
          price: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          inspection_limit: number
          is_active?: boolean | null
          name: string
          plan_type: string
          price: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          inspection_limit?: number
          is_active?: boolean | null
          name?: string
          plan_type?: string
          price?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      inspection_videos: {
        Row: {
          contractor_id: string | null
          created_at: string
          duration: number | null
          file_size: number
          format: string | null
          id: string
          keyframes_extracted: boolean | null
          original_filename: string
          processing_error: string | null
          processing_status: string | null
          storage_path: string
          thumbnail_url: string | null
          updated_at: string
        }
        Insert: {
          contractor_id?: string | null
          created_at?: string
          duration?: number | null
          file_size: number
          format?: string | null
          id?: string
          keyframes_extracted?: boolean | null
          original_filename: string
          processing_error?: string | null
          processing_status?: string | null
          storage_path: string
          thumbnail_url?: string | null
          updated_at?: string
        }
        Update: {
          contractor_id?: string | null
          created_at?: string
          duration?: number | null
          file_size?: number
          format?: string | null
          id?: string
          keyframes_extracted?: boolean | null
          original_filename?: string
          processing_error?: string | null
          processing_status?: string | null
          storage_path?: string
          thumbnail_url?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inspection_videos_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "contractors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inspection_videos_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "resource_availability_view"
            referencedColumns: ["contractor_id"]
          },
        ]
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
            foreignKeyName: "license_verification_logs_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "resource_availability_view"
            referencedColumns: ["contractor_id"]
          },
          {
            foreignKeyName: "license_verification_logs_contractor_id_fkey1"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "contractors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "license_verification_logs_contractor_id_fkey1"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "resource_availability_view"
            referencedColumns: ["contractor_id"]
          },
        ]
      }
      maintenance_logs: {
        Row: {
          attachments: Json | null
          created_at: string
          id: string
          maintenance_date: string
          notes: string | null
          performed_by: string | null
          schedule_id: string | null
        }
        Insert: {
          attachments?: Json | null
          created_at?: string
          id?: string
          maintenance_date: string
          notes?: string | null
          performed_by?: string | null
          schedule_id?: string | null
        }
        Update: {
          attachments?: Json | null
          created_at?: string
          id?: string
          maintenance_date?: string
          notes?: string | null
          performed_by?: string | null
          schedule_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_logs_performed_by_fkey"
            columns: ["performed_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_logs_performed_by_fkey"
            columns: ["performed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_logs_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "maintenance_schedules"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_schedules: {
        Row: {
          bim_model_id: string | null
          component_name: string
          created_at: string
          frequency_days: number
          id: string
          last_maintenance_date: string | null
          maintenance_instructions: string | null
          maintenance_type: string
          next_maintenance_date: string | null
          updated_at: string
          warranty_end_date: string | null
          warranty_start_date: string | null
        }
        Insert: {
          bim_model_id?: string | null
          component_name: string
          created_at?: string
          frequency_days: number
          id?: string
          last_maintenance_date?: string | null
          maintenance_instructions?: string | null
          maintenance_type: string
          next_maintenance_date?: string | null
          updated_at?: string
          warranty_end_date?: string | null
          warranty_start_date?: string | null
        }
        Update: {
          bim_model_id?: string | null
          component_name?: string
          created_at?: string
          frequency_days?: number
          id?: string
          last_maintenance_date?: string | null
          maintenance_instructions?: string | null
          maintenance_type?: string
          next_maintenance_date?: string | null
          updated_at?: string
          warranty_end_date?: string | null
          warranty_start_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_schedules_bim_model_id_fkey"
            columns: ["bim_model_id"]
            isOneToOne: false
            referencedRelation: "bim_models"
            referencedColumns: ["id"]
          },
        ]
      }
      market_rate_adjustments: {
        Row: {
          confidence_score: number | null
          data_source: string | null
          id: string
          labor_multiplier: number
          last_updated: string | null
          location: string
          material_multiplier: number
          overhead_multiplier: number
        }
        Insert: {
          confidence_score?: number | null
          data_source?: string | null
          id?: string
          labor_multiplier?: number
          last_updated?: string | null
          location: string
          material_multiplier?: number
          overhead_multiplier?: number
        }
        Update: {
          confidence_score?: number | null
          data_source?: string | null
          id?: string
          labor_multiplier?: number
          last_updated?: string | null
          location?: string
          material_multiplier?: number
          overhead_multiplier?: number
        }
        Relationships: []
      }
      material_order_tracking: {
        Row: {
          actual_delivery: string | null
          carrier: string | null
          created_at: string | null
          estimated_delivery: string | null
          id: string
          order_id: string | null
          status: string
          status_updates: Json[] | null
          tracking_number: string | null
          updated_at: string | null
        }
        Insert: {
          actual_delivery?: string | null
          carrier?: string | null
          created_at?: string | null
          estimated_delivery?: string | null
          id?: string
          order_id?: string | null
          status: string
          status_updates?: Json[] | null
          tracking_number?: string | null
          updated_at?: string | null
        }
        Update: {
          actual_delivery?: string | null
          carrier?: string | null
          created_at?: string | null
          estimated_delivery?: string | null
          id?: string
          order_id?: string | null
          status?: string
          status_updates?: Json[] | null
          tracking_number?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "material_order_tracking_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "material_orders"
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
            foreignKeyName: "material_orders_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "resource_availability_view"
            referencedColumns: ["contractor_id"]
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
      material_price_updates: {
        Row: {
          available_quantity: number | null
          id: string
          last_updated: string | null
          material_id: string | null
          metadata: Json | null
          next_update: string | null
          price: number
          supplier_id: string | null
          unit: string
        }
        Insert: {
          available_quantity?: number | null
          id?: string
          last_updated?: string | null
          material_id?: string | null
          metadata?: Json | null
          next_update?: string | null
          price: number
          supplier_id?: string | null
          unit: string
        }
        Update: {
          available_quantity?: number | null
          id?: string
          last_updated?: string | null
          material_id?: string | null
          metadata?: Json | null
          next_update?: string | null
          price?: number
          supplier_id?: string | null
          unit?: string
        }
        Relationships: [
          {
            foreignKeyName: "material_price_updates_material_id_fkey"
            columns: ["material_id"]
            isOneToOne: false
            referencedRelation: "build_materials"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "material_price_updates_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "material_suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      material_suppliers: {
        Row: {
          api_credentials: Json | null
          api_endpoint: string | null
          categories: string[]
          contact_info: Json | null
          created_at: string
          id: string
          last_sync: string | null
          name: string
          rating: number | null
          updated_at: string
        }
        Insert: {
          api_credentials?: Json | null
          api_endpoint?: string | null
          categories?: string[]
          contact_info?: Json | null
          created_at?: string
          id?: string
          last_sync?: string | null
          name: string
          rating?: number | null
          updated_at?: string
        }
        Update: {
          api_credentials?: Json | null
          api_endpoint?: string | null
          categories?: string[]
          contact_info?: Json | null
          created_at?: string
          id?: string
          last_sync?: string | null
          name?: string
          rating?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      milestone_updates: {
        Row: {
          content: string | null
          created_at: string
          id: string
          milestone_id: string | null
          photos: Json | null
          update_type: string
          updater_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          milestone_id?: string | null
          photos?: Json | null
          update_type: string
          updater_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          milestone_id?: string | null
          photos?: Json | null
          update_type?: string
          updater_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "milestone_updates_milestone_id_fkey"
            columns: ["milestone_id"]
            isOneToOne: false
            referencedRelation: "project_milestones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "milestone_updates_updater_id_fkey"
            columns: ["updater_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "milestone_updates_updater_id_fkey"
            columns: ["updater_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          contract_updates: boolean | null
          created_at: string | null
          email_notifications: boolean | null
          id: string
          milestone_updates: boolean | null
          payment_updates: boolean | null
          project_updates: boolean | null
          sms_notifications: boolean | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          contract_updates?: boolean | null
          created_at?: string | null
          email_notifications?: boolean | null
          id?: string
          milestone_updates?: boolean | null
          payment_updates?: boolean | null
          project_updates?: boolean | null
          sms_notifications?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          contract_updates?: boolean | null
          created_at?: string | null
          email_notifications?: boolean | null
          id?: string
          milestone_updates?: boolean | null
          payment_updates?: boolean | null
          project_updates?: boolean | null
          sms_notifications?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_transactions: {
        Row: {
          amount: number
          created_at: string
          id: string
          quantity: number | null
          status: string
          stripe_payment_intent_id: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          quantity?: number | null
          status: string
          stripe_payment_intent_id: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          quantity?: number | null
          status?: string
          stripe_payment_intent_id?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          account_status: string | null
          address: string | null
          created_at: string
          email: string | null
          id: string
          is_admin: boolean | null
          last_active_at: string | null
          notification_preferences: Json | null
          phone: string | null
          preapproval_amount: number | null
          preapproval_status: string | null
          preferred_contact_method: string | null
          sustainability_preferences: Json | null
          terms_accepted: boolean | null
          timezone: string | null
          updated_at: string
        }
        Insert: {
          account_status?: string | null
          address?: string | null
          created_at?: string
          email?: string | null
          id: string
          is_admin?: boolean | null
          last_active_at?: string | null
          notification_preferences?: Json | null
          phone?: string | null
          preapproval_amount?: number | null
          preapproval_status?: string | null
          preferred_contact_method?: string | null
          sustainability_preferences?: Json | null
          terms_accepted?: boolean | null
          timezone?: string | null
          updated_at?: string
        }
        Update: {
          account_status?: string | null
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_admin?: boolean | null
          last_active_at?: string | null
          notification_preferences?: Json | null
          phone?: string | null
          preapproval_amount?: number | null
          preapproval_status?: string | null
          preferred_contact_method?: string | null
          sustainability_preferences?: Json | null
          terms_accepted?: boolean | null
          timezone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      project_activity_logs: {
        Row: {
          activity_data: Json | null
          activity_type: string
          actor_id: string | null
          created_at: string | null
          id: string
          metadata: Json | null
          project_id: string | null
        }
        Insert: {
          activity_data?: Json | null
          activity_type: string
          actor_id?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          project_id?: string | null
        }
        Update: {
          activity_data?: Json | null
          activity_type?: string
          actor_id?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          project_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_activity_logs_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_activity_logs_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_activity_logs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_statistics"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "project_activity_logs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_statistics_secure"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "project_activity_logs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_contracts: {
        Row: {
          approval_chain: Json | null
          client_signature_data: Json | null
          content: Json
          contract_type: string
          contractor_signature_data: Json | null
          created_at: string
          current_version: number | null
          id: string
          last_action_at: string | null
          last_notification_sent: string | null
          last_reviewed_at: string | null
          project_id: string | null
          review_comments: string | null
          signed_by_client_at: string | null
          signed_by_contractor_at: string | null
          signing_history: Json | null
          signing_status: string
          stage_history: Json[] | null
          status: string
          updated_at: string
          validation_status: Json | null
          version_history: Json | null
          workflow_metadata: Json | null
          workflow_stage: string | null
        }
        Insert: {
          approval_chain?: Json | null
          client_signature_data?: Json | null
          content?: Json
          contract_type: string
          contractor_signature_data?: Json | null
          created_at?: string
          current_version?: number | null
          id?: string
          last_action_at?: string | null
          last_notification_sent?: string | null
          last_reviewed_at?: string | null
          project_id?: string | null
          review_comments?: string | null
          signed_by_client_at?: string | null
          signed_by_contractor_at?: string | null
          signing_history?: Json | null
          signing_status?: string
          stage_history?: Json[] | null
          status?: string
          updated_at?: string
          validation_status?: Json | null
          version_history?: Json | null
          workflow_metadata?: Json | null
          workflow_stage?: string | null
        }
        Update: {
          approval_chain?: Json | null
          client_signature_data?: Json | null
          content?: Json
          contract_type?: string
          contractor_signature_data?: Json | null
          created_at?: string
          current_version?: number | null
          id?: string
          last_action_at?: string | null
          last_notification_sent?: string | null
          last_reviewed_at?: string | null
          project_id?: string | null
          review_comments?: string | null
          signed_by_client_at?: string | null
          signed_by_contractor_at?: string | null
          signing_history?: Json | null
          signing_status?: string
          stage_history?: Json[] | null
          status?: string
          updated_at?: string
          validation_status?: Json | null
          version_history?: Json | null
          workflow_metadata?: Json | null
          workflow_stage?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_contracts_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_statistics"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "project_contracts_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_statistics_secure"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "project_contracts_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_delay_notifications: {
        Row: {
          created_at: string
          delay_days: number
          id: string
          milestone_id: string | null
          project_id: string | null
          resolution_action: string | null
          severity: string
          status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          delay_days: number
          id?: string
          milestone_id?: string | null
          project_id?: string | null
          resolution_action?: string | null
          severity: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          delay_days?: number
          id?: string
          milestone_id?: string | null
          project_id?: string | null
          resolution_action?: string | null
          severity?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_delay_notifications_milestone_id_fkey"
            columns: ["milestone_id"]
            isOneToOne: false
            referencedRelation: "project_milestones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_delay_notifications_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_statistics"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "project_delay_notifications_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_statistics_secure"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "project_delay_notifications_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_disputes: {
        Row: {
          against_id: string | null
          created_at: string
          description: string
          id: string
          mediation_notes: string | null
          mediation_status: string | null
          mediator_id: string | null
          project_id: string | null
          raised_by_id: string | null
          resolution_accepted_by_client: boolean | null
          resolution_accepted_by_contractor: boolean | null
          resolution_date: string | null
          resolution_notes: string | null
          resolution_type: string | null
          status: string | null
          task_id: string | null
          updated_at: string
        }
        Insert: {
          against_id?: string | null
          created_at?: string
          description: string
          id?: string
          mediation_notes?: string | null
          mediation_status?: string | null
          mediator_id?: string | null
          project_id?: string | null
          raised_by_id?: string | null
          resolution_accepted_by_client?: boolean | null
          resolution_accepted_by_contractor?: boolean | null
          resolution_date?: string | null
          resolution_notes?: string | null
          resolution_type?: string | null
          status?: string | null
          task_id?: string | null
          updated_at?: string
        }
        Update: {
          against_id?: string | null
          created_at?: string
          description?: string
          id?: string
          mediation_notes?: string | null
          mediation_status?: string | null
          mediator_id?: string | null
          project_id?: string | null
          raised_by_id?: string | null
          resolution_accepted_by_client?: boolean | null
          resolution_accepted_by_contractor?: boolean | null
          resolution_date?: string | null
          resolution_notes?: string | null
          resolution_type?: string | null
          status?: string | null
          task_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_disputes_against_id_fkey"
            columns: ["against_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_disputes_against_id_fkey"
            columns: ["against_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_disputes_mediator_id_fkey"
            columns: ["mediator_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_disputes_mediator_id_fkey"
            columns: ["mediator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_disputes_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_statistics"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "project_disputes_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_statistics_secure"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "project_disputes_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_disputes_raised_by_id_fkey"
            columns: ["raised_by_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_disputes_raised_by_id_fkey"
            columns: ["raised_by_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_disputes_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "project_tasks"
            referencedColumns: ["id"]
          },
        ]
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
            referencedRelation: "project_statistics"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "project_messages_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_statistics_secure"
            referencedColumns: ["project_id"]
          },
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
          approval_status: string | null
          approved_at: string | null
          approved_by: string | null
          assigned_contractor_id: string | null
          build_estimate_id: string | null
          client_approval_date: string | null
          client_approved: boolean | null
          completion_evidence: Json | null
          completion_percentage: number | null
          contractor_submission_date: string | null
          contractor_submitted: boolean | null
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          photos: Json | null
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          approval_status?: string | null
          approved_at?: string | null
          approved_by?: string | null
          assigned_contractor_id?: string | null
          build_estimate_id?: string | null
          client_approval_date?: string | null
          client_approved?: boolean | null
          completion_evidence?: Json | null
          completion_percentage?: number | null
          contractor_submission_date?: string | null
          contractor_submitted?: boolean | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          photos?: Json | null
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          approval_status?: string | null
          approved_at?: string | null
          approved_by?: string | null
          assigned_contractor_id?: string | null
          build_estimate_id?: string | null
          client_approval_date?: string | null
          client_approved?: boolean | null
          completion_evidence?: Json | null
          completion_percentage?: number | null
          contractor_submission_date?: string | null
          contractor_submitted?: boolean | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          photos?: Json | null
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_milestones_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_milestones_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_milestones_assigned_contractor_id_fkey"
            columns: ["assigned_contractor_id"]
            isOneToOne: false
            referencedRelation: "contractors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_milestones_assigned_contractor_id_fkey"
            columns: ["assigned_contractor_id"]
            isOneToOne: false
            referencedRelation: "resource_availability_view"
            referencedColumns: ["contractor_id"]
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
      project_risk_analysis: {
        Row: {
          ai_confidence_score: number | null
          created_at: string | null
          description: string | null
          id: string
          impact_level: string | null
          mitigation_strategy: string | null
          probability: number | null
          project_id: string | null
          risk_type: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          ai_confidence_score?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          impact_level?: string | null
          mitigation_strategy?: string | null
          probability?: number | null
          project_id?: string | null
          risk_type: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          ai_confidence_score?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          impact_level?: string | null
          mitigation_strategy?: string | null
          probability?: number | null
          project_id?: string | null
          risk_type?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_risk_analysis_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_statistics"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "project_risk_analysis_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_statistics_secure"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "project_risk_analysis_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_roadmaps: {
        Row: {
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string
          project_id: string
          start_date: string | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          project_id: string
          start_date?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          project_id?: string
          start_date?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_roadmaps_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_statistics"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "project_roadmaps_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_statistics_secure"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "project_roadmaps_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_task_templates: {
        Row: {
          category: Database["public"]["Enums"]["task_category"]
          created_at: string
          dependencies: string[] | null
          description: string | null
          estimated_duration: number | null
          id: string
          required_inspections: boolean | null
          title: string
          updated_at: string
        }
        Insert: {
          category: Database["public"]["Enums"]["task_category"]
          created_at?: string
          dependencies?: string[] | null
          description?: string | null
          estimated_duration?: number | null
          id?: string
          required_inspections?: boolean | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: Database["public"]["Enums"]["task_category"]
          created_at?: string
          dependencies?: string[] | null
          description?: string | null
          estimated_duration?: number | null
          id?: string
          required_inspections?: boolean | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      project_tasks: {
        Row: {
          assigned_contractor_id: string | null
          attachments: Json | null
          category: Database["public"]["Enums"]["task_category"]
          completed_date: string | null
          completion_notes: string | null
          created_at: string
          dependencies: string[] | null
          description: string | null
          due_date: string | null
          id: string
          inspection_date: string | null
          inspection_notes: string | null
          inspection_required: boolean | null
          inspection_status: Database["public"]["Enums"]["task_status"] | null
          project_id: string | null
          start_date: string | null
          status: Database["public"]["Enums"]["task_status"] | null
          template_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          assigned_contractor_id?: string | null
          attachments?: Json | null
          category: Database["public"]["Enums"]["task_category"]
          completed_date?: string | null
          completion_notes?: string | null
          created_at?: string
          dependencies?: string[] | null
          description?: string | null
          due_date?: string | null
          id?: string
          inspection_date?: string | null
          inspection_notes?: string | null
          inspection_required?: boolean | null
          inspection_status?: Database["public"]["Enums"]["task_status"] | null
          project_id?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["task_status"] | null
          template_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          assigned_contractor_id?: string | null
          attachments?: Json | null
          category?: Database["public"]["Enums"]["task_category"]
          completed_date?: string | null
          completion_notes?: string | null
          created_at?: string
          dependencies?: string[] | null
          description?: string | null
          due_date?: string | null
          id?: string
          inspection_date?: string | null
          inspection_notes?: string | null
          inspection_required?: boolean | null
          inspection_status?: Database["public"]["Enums"]["task_status"] | null
          project_id?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["task_status"] | null
          template_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_tasks_assigned_contractor_id_fkey"
            columns: ["assigned_contractor_id"]
            isOneToOne: false
            referencedRelation: "contractors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_tasks_assigned_contractor_id_fkey"
            columns: ["assigned_contractor_id"]
            isOneToOne: false
            referencedRelation: "resource_availability_view"
            referencedColumns: ["contractor_id"]
          },
          {
            foreignKeyName: "project_tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_statistics"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "project_tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_statistics_secure"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "project_tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_tasks_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "project_task_templates"
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
          user_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          status?: string | null
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          status?: string | null
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
      resource_allocations: {
        Row: {
          allocation_percentage: number | null
          created_at: string | null
          end_date: string | null
          id: string
          project_id: string
          resource_id: string
          role: string
          start_date: string | null
          updated_at: string | null
        }
        Insert: {
          allocation_percentage?: number | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          project_id: string
          resource_id: string
          role: string
          start_date?: string | null
          updated_at?: string | null
        }
        Update: {
          allocation_percentage?: number | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          project_id?: string
          resource_id?: string
          role?: string
          start_date?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "resource_allocations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_statistics"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "resource_allocations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_statistics_secure"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "resource_allocations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resource_allocations_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resource_allocations_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      roadmap_phases: {
        Row: {
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string
          order_index: number
          roadmap_id: string
          start_date: string | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          order_index: number
          roadmap_id: string
          start_date?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          order_index?: number
          roadmap_id?: string
          start_date?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "roadmap_phases_roadmap_id_fkey"
            columns: ["roadmap_id"]
            isOneToOne: false
            referencedRelation: "project_roadmaps"
            referencedColumns: ["id"]
          },
        ]
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
      stripe_config: {
        Row: {
          key: string
          value: string
        }
        Insert: {
          key: string
          value: string
        }
        Update: {
          key?: string
          value?: string
        }
        Relationships: []
      }
      stripe_products: {
        Row: {
          created_at: string
          description: string | null
          id: number
          name: string
          price_amount: number
          price_currency: string | null
          price_id: string
          price_interval: string | null
          price_type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          name: string
          price_amount: number
          price_currency?: string | null
          price_id: string
          price_interval?: string | null
          price_type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          name?: string
          price_amount?: number
          price_currency?: string | null
          price_id?: string
          price_interval?: string | null
          price_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      stripe_secrets: {
        Row: {
          created_at: string
          key: string
          value: string
        }
        Insert: {
          created_at?: string
          key: string
          value: string
        }
        Update: {
          created_at?: string
          key?: string
          value?: string
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          created_at: string
          features: Json
          id: string
          interval: string
          name: string
          price: number
          stripe_price_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          features?: Json
          id?: string
          interval: string
          name: string
          price: number
          stripe_price_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          features?: Json
          id?: string
          interval?: string
          name?: string
          price?: number
          stripe_price_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          id: string
          metadata: Json | null
          plan_type: string
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          metadata?: Json | null
          plan_type: string
          status: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          metadata?: Json | null
          plan_type?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier_api_configs: {
        Row: {
          api_endpoint: string
          api_key_name: string
          api_type: string
          created_at: string | null
          id: string
          is_active: boolean | null
          last_sync: string | null
          refresh_interval: unknown
          supplier_id: string | null
        }
        Insert: {
          api_endpoint: string
          api_key_name: string
          api_type: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_sync?: string | null
          refresh_interval?: unknown
          supplier_id?: string | null
        }
        Update: {
          api_endpoint?: string
          api_key_name?: string
          api_type?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_sync?: string | null
          refresh_interval?: unknown
          supplier_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "supplier_api_configs_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "material_suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      task_updates: {
        Row: {
          attachments: Json | null
          content: string
          created_at: string
          id: string
          task_id: string | null
          user_id: string | null
        }
        Insert: {
          attachments?: Json | null
          content: string
          created_at?: string
          id?: string
          task_id?: string | null
          user_id?: string | null
        }
        Update: {
          attachments?: Json | null
          content?: string
          created_at?: string
          id?: string
          task_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "task_updates_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "project_tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_updates_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_updates_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      timeline_agreements: {
        Row: {
          agreed_completion_date: string
          contractor_id: string | null
          created_at: string
          delay_threshold_days: number | null
          id: string
          notification_frequency: string | null
          project_id: string | null
          signed_at: string | null
          status: string | null
          terms: Json | null
          updated_at: string
        }
        Insert: {
          agreed_completion_date: string
          contractor_id?: string | null
          created_at?: string
          delay_threshold_days?: number | null
          id?: string
          notification_frequency?: string | null
          project_id?: string | null
          signed_at?: string | null
          status?: string | null
          terms?: Json | null
          updated_at?: string
        }
        Update: {
          agreed_completion_date?: string
          contractor_id?: string | null
          created_at?: string
          delay_threshold_days?: number | null
          id?: string
          notification_frequency?: string | null
          project_id?: string | null
          signed_at?: string | null
          status?: string | null
          terms?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "timeline_agreements_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "contractors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timeline_agreements_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "resource_availability_view"
            referencedColumns: ["contractor_id"]
          },
          {
            foreignKeyName: "timeline_agreements_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_statistics"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "timeline_agreements_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_statistics_secure"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "timeline_agreements_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      user_customizations: {
        Row: {
          created_at: string
          customization_id: string | null
          floor_plan_id: string | null
          id: string
          notes: string | null
          quantity: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          customization_id?: string | null
          floor_plan_id?: string | null
          id?: string
          notes?: string | null
          quantity?: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          customization_id?: string | null
          floor_plan_id?: string | null
          id?: string
          notes?: string | null
          quantity?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_customizations_customization_id_fkey"
            columns: ["customization_id"]
            isOneToOne: false
            referencedRelation: "customization_options"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_customizations_floor_plan_id_fkey"
            columns: ["floor_plan_id"]
            isOneToOne: false
            referencedRelation: "floor_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_customizations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_customizations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_notification_preferences: {
        Row: {
          contract_updates: boolean | null
          created_at: string
          email_enabled: boolean | null
          id: string
          marketing_updates: boolean | null
          payment_updates: boolean | null
          project_updates: boolean | null
          sms_enabled: boolean | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          contract_updates?: boolean | null
          created_at?: string
          email_enabled?: boolean | null
          id?: string
          marketing_updates?: boolean | null
          payment_updates?: boolean | null
          project_updates?: boolean | null
          sms_enabled?: boolean | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          contract_updates?: boolean | null
          created_at?: string
          email_enabled?: boolean | null
          id?: string
          marketing_updates?: boolean | null
          payment_updates?: boolean | null
          project_updates?: boolean | null
          sms_enabled?: boolean | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_notification_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_notification_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      verification_logs: {
        Row: {
          created_at: string
          document_id: string | null
          id: string
          verification_data: Json | null
          verification_provider_id: string | null
          verification_status: string
        }
        Insert: {
          created_at?: string
          document_id?: string | null
          id?: string
          verification_data?: Json | null
          verification_provider_id?: string | null
          verification_status: string
        }
        Update: {
          created_at?: string
          document_id?: string | null
          id?: string
          verification_data?: Json | null
          verification_provider_id?: string | null
          verification_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "verification_logs_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "contractor_compliance_documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "verification_logs_verification_provider_id_fkey"
            columns: ["verification_provider_id"]
            isOneToOne: false
            referencedRelation: "verification_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      verification_providers: {
        Row: {
          api_config: Json | null
          api_endpoint: string | null
          created_at: string
          id: string
          is_active: boolean | null
          provider_name: string
          provider_type: string
          updated_at: string
        }
        Insert: {
          api_config?: Json | null
          api_endpoint?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          provider_name: string
          provider_type: string
          updated_at?: string
        }
        Update: {
          api_config?: Json | null
          api_endpoint?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          provider_name?: string
          provider_type?: string
          updated_at?: string
        }
        Relationships: []
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
      project_statistics: {
        Row: {
          average_bid: number | null
          project_id: string | null
          total_bids: number | null
          total_messages: number | null
          total_tasks: number | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      project_statistics_secure: {
        Row: {
          average_bid: number | null
          project_id: string | null
          total_bids: number | null
          total_messages: number | null
          total_tasks: number | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      resource_allocation_analytics: {
        Row: {
          allocation_percentage: number | null
          contractor_name: string | null
          end_date: string | null
          project_id: string | null
          project_title: string | null
          resource_email: string | null
          resource_id: string | null
          role: string | null
          start_date: string | null
        }
        Relationships: [
          {
            foreignKeyName: "resource_allocations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_statistics"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "resource_allocations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_statistics_secure"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "resource_allocations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resource_allocations_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resource_allocations_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      resource_availability_view: {
        Row: {
          allocation_percentage: number | null
          availability_end: string | null
          availability_start: string | null
          contractor_id: string | null
          day_of_week: number | null
          end_date: string | null
          profile_id: string | null
          project_id: string | null
          resource_email: string | null
          resource_id: string | null
          role: string | null
          start_date: string | null
        }
        Relationships: [
          {
            foreignKeyName: "resource_allocations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_statistics"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "resource_allocations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_statistics_secure"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "resource_allocations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resource_allocations_resource_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resource_allocations_resource_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
      check_maintenance_notifications: {
        Args: Record<PropertyKey, never>
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
      refresh_project_statistics: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      reset_test_data: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      setup_test_contract: {
        Args: {
          p_project_id: string
          p_status: Database["public"]["Enums"]["test_contract_status"]
          p_workflow_stage: Database["public"]["Enums"]["test_workflow_stage"]
        }
        Returns: string
      }
      should_fetch_listings: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      clash_report_status: "pending_review" | "reviewed" | "resolved"
      compliance_check_status: "passed" | "failed" | "warning" | "pending"
      contract_signing_status:
        | "pending"
        | "client_signed"
        | "contractor_signed"
        | "completed"
      contract_status:
        | "draft"
        | "pending_client"
        | "pending_contractor"
        | "signed"
        | "rejected"
      contract_workflow_stage:
        | "draft"
        | "client_review"
        | "contractor_review"
        | "completed"
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
      customization_type: "floorplan" | "material" | "finish"
      inspection_status:
        | "not_required"
        | "scheduled"
        | "passed"
        | "failed"
        | "rescheduled"
      onboarding_step_type:
        | "business_entity"
        | "ein_registration"
        | "insurance_verification"
        | "license_verification"
        | "bbb_verification"
        | "w9_submission"
        | "liability_waiver"
        | "portfolio_setup"
        | "banking_setup"
      resource_category:
        | "safety_guidelines"
        | "legal_templates"
        | "best_practices"
        | "training_materials"
        | "industry_updates"
        | "tools_equipment"
        | "business_management"
        | "marketing_tips"
      task_category:
        | "land_preparation"
        | "permits_and_approvals"
        | "foundation"
        | "framing"
        | "plumbing"
        | "electrical"
        | "hvac"
        | "roofing"
        | "exterior"
        | "interior"
        | "landscaping"
        | "inspections"
        | "final_review"
      task_status:
        | "not_started"
        | "in_progress"
        | "completed"
        | "blocked"
        | "not_applicable"
        | "needs_review"
        | "approved"
      test_contract_status: "draft" | "review" | "signed" | "completed"
      test_workflow_stage:
        | "setup"
        | "client_review"
        | "contractor_review"
        | "completed"
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
