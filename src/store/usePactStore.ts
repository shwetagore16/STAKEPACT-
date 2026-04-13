import { create } from 'zustand'

type PactStatus = 'active' | 'completed' | 'failed'

type MemberStatus = 'submitted' | 'pending' | 'failed'

export type Member = {
  id: string
  name: string
  initials: string
  stake: number
  status: MemberStatus
}

export type Pact = {
  id: string
  title: string
  category: string
  deadline: Date
  members: Member[]
  totalStake: number
  status: PactStatus
}

type UserProfile = {
  name: string
  score: number
  totalStaked: number
}

type PactState = {
  pacts: Pact[]
  activePage: string
  user: UserProfile
  setPacts: (pacts: Pact[]) => void
  addPact: (pact: Pact) => void
  setActivePage: (page: string) => void
}

const demoPacts: Pact[] = [
  {
    id: 'pact-001',
    title: 'Quarterly Vendor Audit',
    category: 'Corporate',
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 36),
    members: [
      { id: 'm1', name: 'Aarav Patel', initials: 'AP', stake: 5000, status: 'submitted' },
      { id: 'm2', name: 'Isha Nair', initials: 'IN', stake: 5000, status: 'pending' },
      { id: 'm3', name: 'Kabir Mehta', initials: 'KM', stake: 5000, status: 'pending' },
      { id: 'm4', name: 'Rhea Singh', initials: 'RS', stake: 5000, status: 'submitted' },
      { id: 'm5', name: 'Tara Rao', initials: 'TR', stake: 5000, status: 'pending' },
    ],
    totalStake: 25000,
    status: 'active',
  },
  {
    id: 'pact-002',
    title: 'Data Science Capstone',
    category: 'Education',
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 72),
    members: [
      { id: 'm6', name: 'Neel Shah', initials: 'NS', stake: 3000, status: 'submitted' },
      { id: 'm7', name: 'Maya Roy', initials: 'MR', stake: 3000, status: 'submitted' },
      { id: 'm8', name: 'Zara Khan', initials: 'ZK', stake: 3000, status: 'pending' },
    ],
    totalStake: 9000,
    status: 'active',
  },
  {
    id: 'pact-003',
    title: 'Half-Marathon Prep',
    category: 'Personal',
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 18),
    members: [
      { id: 'm9', name: 'Dev Malhotra', initials: 'DM', stake: 2000, status: 'submitted' },
      { id: 'm10', name: 'Ira Bose', initials: 'IB', stake: 2000, status: 'failed' },
    ],
    totalStake: 4000,
    status: 'active',
  },
]

export const usePactStore = create<PactState>((set) => ({
  pacts: demoPacts,
  activePage: 'landing',
  user: {
    name: 'Riya Sharma',
    score: 847,
    totalStaked: 420000,
  },
  setPacts: (pacts) => set({ pacts }),
  addPact: (pact) =>
    set((state) => ({
      pacts: [pact, ...state.pacts],
    })),
  setActivePage: (page) => set({ activePage: page }),
}))
