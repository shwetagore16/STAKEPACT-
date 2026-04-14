import type { Category } from './pact.types'

export interface CommitScoreGrade {
  grade: 'A+' | 'A' | 'B' | 'C' | 'D'
  minScore: number
  maxScore: number
  color: string
  description: string
}

export interface User {
  id: string
  fullName: string
  email: string
  walletAddress: string
  commitScore: number
  totalStakedInr: number
  activePacts: number
  joinedAt: string
  preferredCategory?: Category
}
