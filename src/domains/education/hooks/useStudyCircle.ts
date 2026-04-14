import { useMemo, useState } from 'react'
import type { EducationMember } from '../types/education.types'

type VerificationStatus = 'complete' | 'partial' | 'pending'

function toNameFromEmail(email: string): string {
  const localPart = email.split('@')[0] ?? email
  const normalized = localPart
    .replace(/[._-]+/g, ' ')
    .trim()

  if (!normalized) return 'New Member'

  return normalized
    .split(' ')
    .filter(Boolean)
    .map((segment) => segment[0].toUpperCase() + segment.slice(1).toLowerCase())
    .join(' ')
}

function toInitials(name: string): string {
  const segments = name.split(' ').filter(Boolean)
  if (segments.length === 0) return 'NM'
  if (segments.length === 1) return segments[0].slice(0, 2).toUpperCase()
  return `${segments[0][0]}${segments[1][0]}`.toUpperCase()
}

export function useStudyCircle(initialStake = 500) {
  const [members, setMembers] = useState<EducationMember[]>([])
  const [stakePerMember, setStakePerMember] = useState<number>(initialStake)

  const addMember = (email: string): void => {
    const trimmed = email.trim()
    if (!trimmed) return

    const name = toNameFromEmail(trimmed)
    const newMember: EducationMember = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
      name,
      initials: toInitials(name),
      proofStatus: 'pending',
    }

    setMembers((prev) => [...prev, newMember])
  }

  const removeMember = (id: string): void => {
    setMembers((prev) => prev.filter((member) => member.id !== id))
  }

  const calculatePot = (): number => members.length * stakePerMember

  const calculateBonus = (failCount: number): number => {
    const validFailCount = Math.max(0, Math.min(failCount, members.length))
    const winners = members.length - validFailCount
    if (winners <= 0) return 0
    return (validFailCount * stakePerMember) / winners
  }

  const getVerificationStatus = (): VerificationStatus => {
    if (members.length === 0) return 'pending'
    const submitted = members.filter((member) => member.proofStatus === 'submitted').length
    if (submitted === 0) return 'pending'
    if (submitted === members.length) return 'complete'
    return 'partial'
  }

  const verificationStatus = useMemo(() => getVerificationStatus(), [members])

  return {
    members,
    stakePerMember,
    setStakePerMember,
    addMember,
    removeMember,
    calculatePot,
    calculateBonus,
    getVerificationStatus,
    verificationStatus,
  }
}
