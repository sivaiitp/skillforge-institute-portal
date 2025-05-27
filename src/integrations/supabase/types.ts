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
      assessment_attempts: {
        Row: {
          answers: Json | null
          assessment_id: string
          completed_at: string | null
          created_at: string
          id: string
          passed: boolean
          score: number
          started_at: string
          status: string
          time_spent: number | null
          total_marks: number
          user_id: string
        }
        Insert: {
          answers?: Json | null
          assessment_id: string
          completed_at?: string | null
          created_at?: string
          id?: string
          passed?: boolean
          score?: number
          started_at?: string
          status?: string
          time_spent?: number | null
          total_marks: number
          user_id: string
        }
        Update: {
          answers?: Json | null
          assessment_id?: string
          completed_at?: string | null
          created_at?: string
          id?: string
          passed?: boolean
          score?: number
          started_at?: string
          status?: string
          time_spent?: number | null
          total_marks?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessment_attempts_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          },
        ]
      }
      assessment_history: {
        Row: {
          answers: Json | null
          assessment_id: string
          attempt_number: number
          completed_at: string
          created_at: string
          id: string
          passed: boolean
          score: number
          started_at: string
          time_spent: number | null
          total_marks: number
          user_id: string
        }
        Insert: {
          answers?: Json | null
          assessment_id: string
          attempt_number?: number
          completed_at: string
          created_at?: string
          id?: string
          passed?: boolean
          score?: number
          started_at: string
          time_spent?: number | null
          total_marks: number
          user_id: string
        }
        Update: {
          answers?: Json | null
          assessment_id?: string
          attempt_number?: number
          completed_at?: string
          created_at?: string
          id?: string
          passed?: boolean
          score?: number
          started_at?: string
          time_spent?: number | null
          total_marks?: number
          user_id?: string
        }
        Relationships: []
      }
      assessment_questions: {
        Row: {
          assessment_id: string
          correct_answer: string
          created_at: string
          difficulty_level: string | null
          explanation: string | null
          id: string
          options: Json | null
          points: number
          question_text: string
          question_type: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          assessment_id: string
          correct_answer: string
          created_at?: string
          difficulty_level?: string | null
          explanation?: string | null
          id?: string
          options?: Json | null
          points?: number
          question_text: string
          question_type?: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          assessment_id?: string
          correct_answer?: string
          created_at?: string
          difficulty_level?: string | null
          explanation?: string | null
          id?: string
          options?: Json | null
          points?: number
          question_text?: string
          question_type?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessment_questions_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          },
        ]
      }
      assessment_results: {
        Row: {
          assessment_id: string | null
          id: string
          passed: boolean | null
          score: number
          taken_at: string | null
          total_marks: number
          user_id: string | null
        }
        Insert: {
          assessment_id?: string | null
          id?: string
          passed?: boolean | null
          score: number
          taken_at?: string | null
          total_marks: number
          user_id?: string | null
        }
        Update: {
          assessment_id?: string | null
          id?: string
          passed?: boolean | null
          score?: number
          taken_at?: string | null
          total_marks?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assessment_results_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          },
        ]
      }
      assessments: {
        Row: {
          course_id: string | null
          created_at: string | null
          description: string | null
          duration_minutes: number | null
          id: string
          is_active: boolean | null
          passing_marks: number | null
          title: string
          total_marks: number | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_active?: boolean | null
          passing_marks?: number | null
          title: string
          total_marks?: number | null
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_active?: boolean | null
          passing_marks?: number | null
          title?: string
          total_marks?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "assessments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      certificates: {
        Row: {
          certificate_number: string
          course_id: string
          created_at: string
          id: string
          is_valid: boolean
          issued_date: string
          issuer_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          certificate_number?: string
          course_id: string
          created_at?: string
          id?: string
          is_valid?: boolean
          issued_date?: string
          issuer_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          certificate_number?: string
          course_id?: string
          created_at?: string
          id?: string
          is_valid?: boolean
          issued_date?: string
          issuer_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "certificates_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "certificates_issuer_id_fkey"
            columns: ["issuer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "certificates_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_inquiries: {
        Row: {
          created_at: string | null
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          status?: string | null
        }
        Relationships: []
      }
      courses: {
        Row: {
          brochure_url: string | null
          category: string | null
          certification: string | null
          created_at: string | null
          description: string | null
          detailed_description: string | null
          duration: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          is_featured: boolean | null
          learning_outcomes: string | null
          level: string | null
          prerequisites: string | null
          price: number | null
          syllabus: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          brochure_url?: string | null
          category?: string | null
          certification?: string | null
          created_at?: string | null
          description?: string | null
          detailed_description?: string | null
          duration?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          learning_outcomes?: string | null
          level?: string | null
          prerequisites?: string | null
          price?: number | null
          syllabus?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          brochure_url?: string | null
          category?: string | null
          certification?: string | null
          created_at?: string | null
          description?: string | null
          detailed_description?: string | null
          duration?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          learning_outcomes?: string | null
          level?: string | null
          prerequisites?: string | null
          price?: number | null
          syllabus?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      enrollments: {
        Row: {
          course_id: string | null
          enrollment_date: string | null
          id: string
          progress: number | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          course_id?: string | null
          enrollment_date?: string | null
          id?: string
          progress?: number | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          course_id?: string | null
          enrollment_date?: string | null
          id?: string
          progress?: number | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      event_management: {
        Row: {
          action: string
          admin_id: string
          created_at: string
          details: Json | null
          event_id: string
          id: string
        }
        Insert: {
          action: string
          admin_id: string
          created_at?: string
          details?: Json | null
          event_id: string
          id?: string
        }
        Update: {
          action?: string
          admin_id?: string
          created_at?: string
          details?: Json | null
          event_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_management_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_registrations: {
        Row: {
          created_at: string
          event_id: string
          id: string
          notes: string | null
          payment_amount: number | null
          payment_status: string | null
          registration_date: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          notes?: string | null
          payment_amount?: number | null
          payment_status?: string | null
          registration_date?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          notes?: string | null
          payment_amount?: number | null
          payment_status?: string | null
          registration_date?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string | null
          current_participants: number | null
          description: string | null
          duration: string | null
          event_date: string
          id: string
          is_active: boolean | null
          location: string | null
          max_participants: number | null
          registration_fee: number | null
          title: string
        }
        Insert: {
          created_at?: string | null
          current_participants?: number | null
          description?: string | null
          duration?: string | null
          event_date: string
          id?: string
          is_active?: boolean | null
          location?: string | null
          max_participants?: number | null
          registration_fee?: number | null
          title: string
        }
        Update: {
          created_at?: string | null
          current_participants?: number | null
          description?: string | null
          duration?: string | null
          event_date?: string
          id?: string
          is_active?: boolean | null
          location?: string | null
          max_participants?: number | null
          registration_fee?: number | null
          title?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          course_id: string | null
          currency: string
          description: string | null
          id: string
          payment_date: string
          payment_method: string | null
          status: string
          transaction_id: string | null
          user_id: string
        }
        Insert: {
          amount: number
          course_id?: string | null
          currency?: string
          description?: string | null
          id?: string
          payment_date?: string
          payment_method?: string | null
          status?: string
          transaction_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          course_id?: string | null
          currency?: string
          description?: string | null
          id?: string
          payment_date?: string
          payment_method?: string | null
          status?: string
          transaction_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          bio: string | null
          city: string | null
          company: string | null
          country: string | null
          created_at: string | null
          education_level: string | null
          email: string | null
          field_of_study: string | null
          full_name: string | null
          graduation_year: number | null
          id: string
          institution: string | null
          occupation: string | null
          phone: string | null
          postal_code: string | null
          role: string | null
          state: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          bio?: string | null
          city?: string | null
          company?: string | null
          country?: string | null
          created_at?: string | null
          education_level?: string | null
          email?: string | null
          field_of_study?: string | null
          full_name?: string | null
          graduation_year?: number | null
          id: string
          institution?: string | null
          occupation?: string | null
          phone?: string | null
          postal_code?: string | null
          role?: string | null
          state?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          bio?: string | null
          city?: string | null
          company?: string | null
          country?: string | null
          created_at?: string | null
          education_level?: string | null
          email?: string | null
          field_of_study?: string | null
          full_name?: string | null
          graduation_year?: number | null
          id?: string
          institution?: string | null
          occupation?: string | null
          phone?: string | null
          postal_code?: string | null
          role?: string | null
          state?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      study_materials: {
        Row: {
          course_id: string
          created_at: string
          description: string | null
          duration: string | null
          file_extension: string | null
          file_size: number | null
          file_url: string | null
          id: string
          is_active: boolean | null
          is_downloadable: boolean | null
          material_type: string
          mime_type: string | null
          sort_order: number | null
          title: string
          updated_at: string
        }
        Insert: {
          course_id: string
          created_at?: string
          description?: string | null
          duration?: string | null
          file_extension?: string | null
          file_size?: number | null
          file_url?: string | null
          id?: string
          is_active?: boolean | null
          is_downloadable?: boolean | null
          material_type: string
          mime_type?: string | null
          sort_order?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          course_id?: string
          created_at?: string
          description?: string | null
          duration?: string | null
          file_extension?: string | null
          file_size?: number | null
          file_url?: string | null
          id?: string
          is_active?: boolean | null
          is_downloadable?: boolean | null
          material_type?: string
          mime_type?: string | null
          sort_order?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "study_materials_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      user_study_progress: {
        Row: {
          completed: boolean
          completed_at: string | null
          course_id: string
          created_at: string
          id: string
          study_material_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          course_id: string
          created_at?: string
          id?: string
          study_material_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          course_id?: string
          created_at?: string
          id?: string
          study_material_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_study_progress_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_study_progress_study_material_id_fkey"
            columns: ["study_material_id"]
            isOneToOne: false
            referencedRelation: "study_materials"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
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
