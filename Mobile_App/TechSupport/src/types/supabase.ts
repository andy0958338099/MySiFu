export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          email: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          email: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          email?: string
          created_at?: string
          updated_at?: string
        }
      }
      consultations: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          type: string
          status: string
          solution_method: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          type: string
          status?: string
          solution_method?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          type?: string
          status?: string
          solution_method?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Functions: {
      handle_new_user: {
        Args: Record<string, never>
        Returns: unknown
      }
      update_updated_at_column: {
        Args: Record<string, never>
        Returns: unknown
      }
    }
  }
}
