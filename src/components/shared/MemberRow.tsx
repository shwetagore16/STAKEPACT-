import { motion } from 'framer-motion'
import type { Member } from '../../types/pact.types'
import Badge from '../ui/Badge'

type ProofStatus = 'submitted' | 'pending' | 'failed'

type MemberRowProps = {
  member: Member
  showProofStatus?: boolean
}

function getInitials(name: string): string {
  const parts = name
    .split(' ')
    .map((part) => part.trim())
    .filter(Boolean)

  if (parts.length === 0) return 'NA'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
}

function resolveProofStatus(member: Member): ProofStatus {
  const candidate = (member as Member & { proofStatus?: ProofStatus }).proofStatus
  if (candidate === 'submitted' || candidate === 'pending' || candidate === 'failed') {
    return candidate
  }

  return member.hasSubmittedProof ? 'submitted' : 'pending'
}

function renderProofBadge(status: ProofStatus) {
  if (status === 'submitted') {
    return <Badge variant="teal" size="xs">✓ Submitted</Badge>
  }

  if (status === 'failed') {
    return <Badge variant="red" size="xs">✗ Failed</Badge>
  }

  return <Badge variant="gold" size="xs" dot pulse>Pending</Badge>
}

export default function MemberRow({ member, showProofStatus = true }: MemberRowProps) {
  const status = resolveProofStatus(member)

  return (
    <motion.div
      className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 backdrop-blur-xl"
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-[#080C14] text-xs font-semibold text-white">
          {getInitials(member.name)}
        </div>
        <div>
          <p className="text-sm font-medium text-white">{member.name}</p>
          <p className="text-[11px] uppercase tracking-[0.08em] text-white/45">{member.role}</p>
        </div>
      </div>

      {showProofStatus ? renderProofBadge(status) : null}
    </motion.div>
  )
}
