export interface EducationMember {
  id: string
  name: string
  initials: string
  university?: string
  proofStatus: 'submitted' | 'pending' | 'failed'
  courseProgress?: number
}

export interface StudyCircle {
  id: string
  name: string
  subject: string
  examDate: Date
  members: EducationMember[]
  stakePerMember: number
  verificationMethod: 'group-vote' | 'auto-lms' | 'document'
  lmsIntegration?: 'google-classroom' | 'coursera' | 'udemy' | null
}

export interface EducationPact {
  id: string
  type: 'study-circle' | 'assignment' | 'course-completion' | 'thesis'
  subject: string
  institution?: string
  examDate?: Date
  circle?: StudyCircle
  autoVerify?: {
    platform: string
    verified: boolean
  }
}
