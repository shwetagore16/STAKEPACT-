import { create } from 'zustand'
import type { CommitScoreGrade, User } from '../types/user.types'

const COMMIT_SCORE_GRADES: CommitScoreGrade[] = [
  {
    grade: 'A+',
    minScore: 900,
    maxScore: 1000,
    color: '#00FFD1',
    description: 'Elite consistency and verified delivery history.',
  },
  {
    grade: 'A',
    minScore: 800,
    maxScore: 899,
    color: '#7CF5D9',
    description: 'Strong follow-through with minor misses.',
  },
  {
    grade: 'B',
    minScore: 700,
    maxScore: 799,
    color: '#F5C842',
    description: 'Reliable execution with occasional delays.',
  },
  {
    grade: 'C',
    minScore: 600,
    maxScore: 699,
    color: '#FF9C54',
    description: 'Mixed outcomes and incomplete proof history.',
  },
  {
    grade: 'D',
    minScore: 0,
    maxScore: 599,
    color: '#FF3B5C',
    description: 'High risk profile with frequent deadline misses.',
  },
]

const DEFAULT_USER: User = {
  id: 'usr-101',
  fullName: 'Riya Sharma',
  email: 'riya.sharma@stakepact.app',
  walletAddress: 'ALGO-WALLET-1A9C-72F2',
  commitScore: 847,
  totalStakedInr: 420000,
  activePacts: 5,
  joinedAt: '2025-11-05T09:00:00.000Z',
  preferredCategory: 'corporate',
}

const getGradeForScore = (score: number): CommitScoreGrade => {
  return COMMIT_SCORE_GRADES.find((grade) => score >= grade.minScore && score <= grade.maxScore)
    ?? COMMIT_SCORE_GRADES[COMMIT_SCORE_GRADES.length - 1]
}

type UserStoreState = {
  user: User
  commitScoreGrade: CommitScoreGrade
  setUser: (nextUser: Partial<User>) => void
  setCommitScore: (score: number) => void
  resetUser: () => void
}

export const useUserStore = create<UserStoreState>((set) => ({
  user: DEFAULT_USER,
  commitScoreGrade: getGradeForScore(DEFAULT_USER.commitScore),
  setUser: (nextUser) =>
    set((state) => {
      const merged = { ...state.user, ...nextUser }
      return {
        user: merged,
        commitScoreGrade: getGradeForScore(merged.commitScore),
      }
    }),
  setCommitScore: (score) =>
    set((state) => ({
      user: { ...state.user, commitScore: score },
      commitScoreGrade: getGradeForScore(score),
    })),
  resetUser: () => ({
    user: DEFAULT_USER,
    commitScoreGrade: getGradeForScore(DEFAULT_USER.commitScore),
  }),
}))
