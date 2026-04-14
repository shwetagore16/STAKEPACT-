import { create } from 'zustand'
import { PLACEHOLDER_PACTS } from '../lib/constants'
import type { Pact, ProofSubmission } from '../types/pact.types'

type PactState = {
  pacts: Pact[]
  selectedPactId: string | null
  setPacts: (pacts: Pact[]) => void
  addPact: (pact: Pact) => void
  updatePactStatus: (pactId: string, status: Pact['status']) => void
  setSelectedPactId: (pactId: string | null) => void
  submitProof: (proof: ProofSubmission) => void
}

export const usePactStore = create<PactState>((set) => ({
  pacts: PLACEHOLDER_PACTS,
  selectedPactId: PLACEHOLDER_PACTS[0]?.id ?? null,
  setPacts: (pacts) => set({ pacts }),
  addPact: (pact) =>
    set((state) => ({
      pacts: [pact, ...state.pacts],
    })),
  updatePactStatus: (pactId, status) =>
    set((state) => ({
      pacts: state.pacts.map((pact) =>
        pact.id === pactId ? { ...pact, status } : pact,
      ),
    })),
  setSelectedPactId: (selectedPactId) => set({ selectedPactId }),
  submitProof: (proof) =>
    set((state) => ({
      pacts: state.pacts.map((pact) => {
        if (pact.id !== proof.pactId) return pact

        return {
          ...pact,
          proofSubmissions: [proof, ...pact.proofSubmissions],
          members: pact.members.map((member) =>
            member.memberId === proof.memberId
              ? { ...member, hasSubmittedProof: true }
              : member,
          ),
        }
      }),
    })),
}))
