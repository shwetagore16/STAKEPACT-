import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import type { Pact } from '../../types/pact.types'
import { DOMAIN_COLORS, ROUTES } from '../../lib/constants'
import { formatINR } from '../../lib/utils'
import { FlipClock } from '../ui/FlipClock'
import Badge from '../ui/Badge'
import CategoryBadge from './CategoryBadge'

type PactCardVariant = 'compact' | 'full' | 'mini'

type PactCardProps = {
  pact: Pact
  variant?: PactCardVariant
}

function getInitials(name: string): string {
  const parts = name
    .split(' ')
    .map((item) => item.trim())
    .filter(Boolean)

  if (parts.length === 0) return 'NA'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
}

function statusToVariant(status: Pact['status']): 'teal' | 'gold' | 'violet' | 'danger' | 'gray' {
  if (status === 'active') return 'teal'
  if (status === 'completed') return 'gold'
  if (status === 'disputed') return 'violet'
  if (status === 'failed') return 'danger'
  return 'gray'
}

function deadlineText(deadlineIso: string): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(deadlineIso))
}

function getSubmittedCount(pact: Pact): number {
  return pact.members.filter((member) => member.hasSubmittedProof).length
}

export default function PactCard({ pact, variant = 'full' }: PactCardProps) {
  const submitted = getSubmittedCount(pact)
  const totalMembers = pact.members.length
  const progress = totalMembers > 0 ? submitted / totalMembers : 0
  const categoryColor = DOMAIN_COLORS[pact.category]
  const pactLink = ROUTES.pactDetail.replace(':id', pact.id)
  const showSubmitAction = pact.status === 'active'

  if (variant === 'mini') {
    return (
      <motion.article
        className="flex items-center justify-between rounded-xl border border-white/10 bg-[rgba(255,255,255,0.03)] px-3 py-2 backdrop-blur-xl"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        <div className="min-w-0 flex-1">
          <p className="truncate font-syne text-sm font-bold text-white">{pact.title}</p>
        </div>
        <div className="ml-3 flex items-center gap-2">
          <Badge variant={statusToVariant(pact.status)} size="xs">{pact.status}</Badge>
          <span className="text-xs font-semibold text-[#F5C842]">{formatINR(pact.stakeAmount)}</span>
        </div>
      </motion.article>
    )
  }

  if (variant === 'compact') {
    return (
      <motion.article
        className="rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.03)] p-4 backdrop-blur-xl"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <CategoryBadge category={pact.category} />
            <h3 className="mt-2 truncate font-syne text-base font-bold text-white">{pact.title}</h3>
            <p className="mt-1 text-xs text-white/55">Deadline: {deadlineText(pact.deadline)}</p>
          </div>
          <p className="whitespace-nowrap text-sm font-semibold text-[#F5C842]">{formatINR(pact.stakeAmount)}</p>
        </div>
      </motion.article>
    )
  }

  return (
    <motion.article
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.03)] p-5 backdrop-blur-xl"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24, ease: 'easeOut' }}
      whileHover={{ y: -2 }}
    >
      <span
        className="absolute left-0 top-0 h-full w-1"
        style={{ backgroundColor: categoryColor }}
        aria-hidden="true"
      />

      <div className="ml-2">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <CategoryBadge category={pact.category} />
            <p className="mt-2 font-mono text-xs text-white/30">{pact.id}</p>
            <h3 className="mt-1 font-syne text-lg font-bold text-white">{pact.title}</h3>
          </div>

          <div className="text-right">
            <p className="text-xs uppercase tracking-[0.12em] text-white/45">Total Stake</p>
            <p className="mt-1 font-syne text-xl font-bold text-[#F5C842]">{formatINR(pact.stakeAmount)}</p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-4">
          <div className="flex -space-x-2">
            {pact.members.slice(0, 5).map((member) => (
              <div
                key={member.memberId}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-[#080C14] text-[10px] font-semibold text-white"
                title={member.name}
              >
                {getInitials(member.name)}
              </div>
            ))}
            {pact.members.length > 5 ? (
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10 text-[10px] font-semibold text-white">
                +{pact.members.length - 5}
              </div>
            ) : null}
          </div>

          <Badge variant={statusToVariant(pact.status)} size="sm">{pact.status}</Badge>
        </div>

        <div className="mt-4">
          <div className="mb-1 flex items-center justify-between text-xs text-white/55">
            <span>{submitted}/{totalMembers} submitted</span>
            <span>{Math.round(progress * 100)}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-[#00FFD1]"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            />
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <FlipClock targetDate={new Date(pact.deadline)} size="sm" />
        </div>

        <div className="mt-4 flex justify-end">
          <Link
            to={pactLink}
            className={showSubmitAction
              ? 'inline-flex items-center gap-1 rounded-lg border border-[#F5C842]/40 bg-[#F5C842]/15 px-3 py-2 text-sm font-semibold text-[#F5C842] transition-colors hover:bg-[#F5C842]/25'
              : 'inline-flex items-center gap-1 rounded-lg border border-[#00FFD1]/40 bg-[#00FFD1]/12 px-3 py-2 text-sm font-semibold text-[#00FFD1] transition-colors hover:bg-[#00FFD1]/22'}
          >
            {showSubmitAction ? 'Submit Proof' : 'View'}
            {!showSubmitAction ? <ArrowRight className="h-4 w-4" /> : null}
          </Link>
        </div>
      </div>
    </motion.article>
  )
}
