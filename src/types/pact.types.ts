export type PactStatus = 'draft' | 'active' | 'completed' | 'failed' | 'disputed'

export type Category =
  | 'education'
  | 'corporate'
  | 'legal'
  | 'government'
  | 'personal'

export interface Member {
  memberId: string
  name: string
  role: string
  stakeAmount: number
  hasSubmittedProof: boolean
  joinedAt: string
}

export interface ProofSubmission {
  submissionId: string
  pactId: string
  memberId: string
  submittedAt: string
  evidenceUrl: string
  notes: string
  verdict: 'pending' | 'approved' | 'rejected'
  approvedBy?: string
}

export interface Pact {
  id: string
  title: string
  description: string
  category: Category
  status: PactStatus
  stakeAmount: number
  currency: 'INR'
  deadline: string
  createdAt: string
  creatorId: string
  members: Member[]
  proofSubmissions: ProofSubmission[]
}
