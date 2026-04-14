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
      users: {
        Row: {
          id: string
          email: string
          name: string
          wallet_address: string | null
          commit_score: number
          grade: string
          total_staked: number
          total_earned: number
          pacts_completed: number
          pacts_failed: number
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          wallet_address?: string | null
          commit_score?: number
          grade?: string
          total_staked?: number
          total_earned?: number
          pacts_completed?: number
          pacts_failed?: number
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          wallet_address?: string | null
          commit_score?: number
          grade?: string
          total_staked?: number
          total_earned?: number
          pacts_completed?: number
          pacts_failed?: number
          created_at?: string
        }
        Relationships: []
      }
      pacts: {
        Row: {
          id: string
          title: string
          description: string | null
          category: 'education' | 'corporate' | 'legal' | 'government' | 'personal'
          status: 'active' | 'proof-pending' | 'voting' | 'completed' | 'failed' | 'disputed'
          stake_per_member: number
          total_stake: number
          deadline: string
          verification_method: string
          creator_id: string
          created_at: string
          blockchain_app_id: string | null
          blockchain_tx_id: string | null
          proof_data: Json | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          category: 'education' | 'corporate' | 'legal' | 'government' | 'personal'
          status?: 'active' | 'proof-pending' | 'voting' | 'completed' | 'failed' | 'disputed'
          stake_per_member: number
          total_stake: number
          deadline: string
          verification_method: string
          creator_id: string
          created_at?: string
          blockchain_app_id?: string | null
          blockchain_tx_id?: string | null
          proof_data?: Json | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          category?: 'education' | 'corporate' | 'legal' | 'government' | 'personal'
          status?: 'active' | 'proof-pending' | 'voting' | 'completed' | 'failed' | 'disputed'
          stake_per_member?: number
          total_stake?: number
          deadline?: string
          verification_method?: string
          creator_id?: string
          created_at?: string
          blockchain_app_id?: string | null
          blockchain_tx_id?: string | null
          proof_data?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: 'pacts_creator_id_fkey'
            columns: ['creator_id']
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      pact_members: {
        Row: {
          id: string
          pact_id: string
          user_id: string
          proof_status: 'pending' | 'submitted' | 'failed'
          joined_at: string
        }
        Insert: {
          id?: string
          pact_id: string
          user_id: string
          proof_status?: 'pending' | 'submitted' | 'failed'
          joined_at?: string
        }
        Update: {
          id?: string
          pact_id?: string
          user_id?: string
          proof_status?: 'pending' | 'submitted' | 'failed'
          joined_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'pact_members_pact_id_fkey'
            columns: ['pact_id']
            referencedRelation: 'pacts'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'pact_members_user_id_fkey'
            columns: ['user_id']
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      proof_submissions: {
        Row: {
          id: string
          pact_id: string
          member_id: string
          proof_type: 'document' | 'github_url' | 'strava_data' | 'api_verified'
          proof_url: string | null
          proof_data: Json | null
          submitted_at: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          id?: string
          pact_id: string
          member_id: string
          proof_type: 'document' | 'github_url' | 'strava_data' | 'api_verified'
          proof_url?: string | null
          proof_data?: Json | null
          submitted_at?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          id?: string
          pact_id?: string
          member_id?: string
          proof_type?: 'document' | 'github_url' | 'strava_data' | 'api_verified'
          proof_url?: string | null
          proof_data?: Json | null
          submitted_at?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'proof_submissions_member_id_fkey'
            columns: ['member_id']
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'proof_submissions_pact_id_fkey'
            columns: ['pact_id']
            referencedRelation: 'pacts'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'proof_submissions_verified_by_fkey'
            columns: ['verified_by']
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      votes: {
        Row: {
          id: string
          pact_id: string
          proof_submission_id: string
          voter_id: string
          vote: 'approve' | 'reject'
          voted_at: string
        }
        Insert: {
          id?: string
          pact_id: string
          proof_submission_id: string
          voter_id: string
          vote: 'approve' | 'reject'
          voted_at?: string
        }
        Update: {
          id?: string
          pact_id?: string
          proof_submission_id?: string
          voter_id?: string
          vote?: 'approve' | 'reject'
          voted_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'votes_pact_id_fkey'
            columns: ['pact_id']
            referencedRelation: 'pacts'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'votes_proof_submission_id_fkey'
            columns: ['proof_submission_id']
            referencedRelation: 'proof_submissions'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'votes_voter_id_fkey'
            columns: ['voter_id']
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      waitlist: {
        Row: {
          id: string
          email: string
          organization: string
          role: string
          use_case: string
          submitted_at: string
        }
        Insert: {
          id?: string
          email: string
          organization: string
          role: string
          use_case: string
          submitted_at?: string
        }
        Update: {
          id?: string
          email?: string
          organization?: string
          role?: string
          use_case?: string
          submitted_at?: string
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

export type TableName = keyof Database['public']['Tables']

export type Tables<T extends TableName> = Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends TableName> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends TableName> = Database['public']['Tables'][T]['Update']

export type UsersRow = Tables<'users'>
export type UsersInsert = TablesInsert<'users'>
export type UsersUpdate = TablesUpdate<'users'>

export type PactsRow = Tables<'pacts'>
export type PactsInsert = TablesInsert<'pacts'>
export type PactsUpdate = TablesUpdate<'pacts'>

export type PactMembersRow = Tables<'pact_members'>
export type PactMembersInsert = TablesInsert<'pact_members'>
export type PactMembersUpdate = TablesUpdate<'pact_members'>

export type ProofSubmissionsRow = Tables<'proof_submissions'>
export type ProofSubmissionsInsert = TablesInsert<'proof_submissions'>
export type ProofSubmissionsUpdate = TablesUpdate<'proof_submissions'>

export type VotesRow = Tables<'votes'>
export type VotesInsert = TablesInsert<'votes'>
export type VotesUpdate = TablesUpdate<'votes'>

export type WaitlistRow = Tables<'waitlist'>
export type WaitlistInsert = TablesInsert<'waitlist'>
export type WaitlistUpdate = TablesUpdate<'waitlist'>
