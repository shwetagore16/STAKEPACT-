import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertTriangle,
  Brain,
  Check,
  Clock,
  Shield,
  ThumbsDown,
  ThumbsUp,
  Users,
  X,
} from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import confetti from 'canvas-confetti'
import { GlassCard } from '../components/ui/GlassCard'
import { FlipClock } from '../components/ui/FlipClock'
import { MagneticButton } from '../components/ui/MagneticButton'
import { CountUp } from '../components/ui/CountUp'
import { cn } from '../lib/utils'

type VoteStatus = 'approved' | 'rejected' | 'pending' | 'abstained'
type VoteState = 'pending' | 'approving' | 'rejecting' | 'confirmed'

type VoteMember = {
  id: string
  name: string
  initials: string
  isYou?: boolean
  status: VoteStatus
  comment?: string
}

const initialMembers: VoteMember[] = [
  {
    id: 'm1',
    name: 'Arjun Mehta',
    initials: 'AM',
    status: 'approved',
    comment: 'Scope is met and evidence aligns with commitment.',
  },
  {
    id: 'm2',
    name: 'Priya Singh',
    initials: 'PS',
    status: 'approved',
    comment: 'Reviewed artifacts and timeline checks out.',
  },
  { id: 'm3', name: 'Sneha Patil', initials: 'SP', status: 'pending' },
  { id: 'm4', name: 'Dev Sharma', initials: 'DS', status: 'pending' },
  { id: 'm5', name: 'You', initials: 'YO', status: 'pending', isYou: true },
]

export default function Vote() {
  const { id } = useParams<{ id: string }>()
  const voteDeadline = useMemo(
    () => new Date(Date.now() + (23 * 3600 + 14 * 60) * 1000),
    [],
  )

  const [members, setMembers] = useState<VoteMember[]>(initialMembers)
  const [voteState, setVoteState] = useState<VoteState>('pending')
  const [showApproveModal, setShowApproveModal] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectConfirmText, setRejectConfirmText] = useState('')
  const [rejectReason, setRejectReason] = useState('')

  const approvedCount = members.filter((member) => member.status === 'approved').length
  const rejectedCount = members.filter((member) => member.status === 'rejected').length
  const pendingCount = members.filter((member) => member.status === 'pending').length
  const abstainedCount = 1
  const castCount = approvedCount + rejectedCount
  const totalCount = members.length
  const majorityReached = approvedCount >= 3

  useEffect(() => {
    if (voteState !== 'confirmed') return
    const yourVote = members.find((member) => member.isYou)
    if (!yourVote || yourVote.status !== 'approved') return
    if (!majorityReached) return

    confetti({
      particleCount: 110,
      spread: 74,
      origin: { y: 0.62 },
      colors: ['#00FFD1', '#F5C842', '#8A5AFF', '#ffffff'],
    })
  }, [majorityReached, members, voteState])

  const approveWidth = (approvedCount / totalCount) * 100
  const rejectWidth = (rejectedCount / totalCount) * 100
  const pendingWidth = 100 - approveWidth - rejectWidth

  const confirmApprove = () => {
    setMembers((prev) =>
      prev.map((member) =>
        member.isYou
          ? {
              ...member,
              status: 'approved',
              comment: 'Evidence appears genuine and complete.',
            }
          : member,
      ),
    )
    setVoteState('confirmed')
    setShowApproveModal(false)
  }

  const confirmReject = () => {
    if (rejectConfirmText !== 'REJECT' || !rejectReason.trim()) return

    setMembers((prev) =>
      prev.map((member) =>
        member.isYou
          ? {
              ...member,
              status: 'rejected',
              comment: rejectReason.trim(),
            }
          : member,
      ),
    )
    setVoteState('confirmed')
    setShowRejectModal(false)
  }

  return (
    <div className="min-h-screen bg-obsidian px-8 pb-12 pt-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 border-b border-glass-border pb-6">
          <h1 className="font-syne text-3xl">Vote Required</h1>
          <p className="text-white/50">
            Your vote determines if Rahul&apos;s INR 5,000 stake is returned.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <FlipClock targetDate={voteDeadline} size="sm" />
            <span className="text-sm text-white/40">
              {approvedCount} approved | {pendingCount} pending | {abstainedCount} abstained
            </span>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="h-fit self-start lg:sticky lg:top-24">
            <h2 className="font-syne text-xl">Rahul&apos;s Submitted Proof</h2>
            <div className="mt-2 text-xs text-white/40">
              Document Upload | 2 hours ago | Blockchain timestamped
            </div>

            <GlassCard className="mt-4 overflow-hidden p-0">
              <div className="bg-white/5 px-6 py-4">
                <h3 className="font-syne font-bold">Project Delivery Report - StakePact MVP</h3>
                <p className="mt-1 text-sm text-white/40">Rahul Sharma | July 24, 2024</p>
              </div>

              <div className="space-y-3 px-6 py-8">
                {[
                  'w-full',
                  'w-4/5',
                  'w-3/4',
                  'w-2/3',
                  'w-full',
                  'w-5/6',
                  'w-1/2',
                ].map((width, index) => (
                  <div key={`${width}-${index}`} className={cn('h-3 rounded bg-white/10', width)} />
                ))}

                <div className="mt-4 flex h-32 w-full items-center justify-center rounded-xl border border-glass-border bg-glass">
                  <span className="text-xs text-white/20">App Screenshot - Home Screen</span>
                </div>
              </div>

              <div className="bg-white/5 px-6 py-3">
                <p className="font-mono text-[10px] text-white/30">SHA-256: 8f3a2b9c...</p>
                <p className="font-mono text-[10px] text-teal">Algorand TX: 0xAB3...F4</p>
              </div>
            </GlassCard>

            <GlassCard className="mt-4 p-6">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-violet" />
                <h3 className="font-syne text-lg">AI Confidence Score</h3>
              </div>

              <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-center">
                <div className="relative h-[120px] w-[120px]">
                  <svg width="120" height="120" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="44" stroke="rgba(138,90,255,0.2)" strokeWidth="10" fill="none" />
                    <motion.circle
                      cx="60"
                      cy="60"
                      r="44"
                      stroke="#8A5AFF"
                      strokeWidth="10"
                      fill="none"
                      strokeLinecap="round"
                      transform="rotate(-90 60 60)"
                      strokeDasharray={2 * Math.PI * 44}
                      initial={{ strokeDashoffset: 2 * Math.PI * 44 }}
                      animate={{ strokeDashoffset: 2 * Math.PI * 44 * (1 - 0.91) }}
                      transition={{ duration: 0.9, ease: 'easeOut' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="font-syne text-3xl">91%</div>
                    <div className="font-mono text-[10px] tracking-[2px] text-white/40">CONFIDENCE</div>
                  </div>
                </div>

                <div className="space-y-2">
                  {[
                    ['Mentions required deliverable', 'ok'],
                    ['Timestamp within deadline', 'ok'],
                    ['App screenshots detected', 'ok'],
                    ['Client approval letter - not found (minor)', 'warn'],
                  ].map(([label, status], index) => (
                    <motion.div
                      key={label}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.2 }}
                      className={cn('text-sm', status === 'ok' ? 'text-teal' : 'text-amber-400')}
                    >
                      {status === 'ok' ? (
                        <Check className="mr-2 inline h-4 w-4" />
                      ) : (
                        <AlertTriangle className="mr-2 inline h-4 w-4" />
                      )}
                      {label}
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="mt-6 rounded-r-xl border-l-4 border-teal bg-teal/5 p-4 text-sm text-teal">
                HIGH CONFIDENCE - Proof appears genuine
              </div>
            </GlassCard>
          </div>

          <div>
            <GlassCard className="p-5">
              <h3 className="font-syne text-lg">Member Votes</h3>

              <div className="mt-4 space-y-3">
                {members.map((member, index) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.08 }}
                  >
                    <GlassCard
                      className={cn(
                        'p-4',
                        member.status === 'approved' && 'border-teal/30 bg-teal/5',
                        member.isYou && 'border-violet/30 bg-violet/5',
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-xs text-white">
                          {member.initials}
                        </div>
                        <div>
                          <p className="text-sm text-white">{member.name}</p>
                          {member.isYou ? (
                            <p className="text-[10px] text-violet">Your Vote</p>
                          ) : null}
                        </div>

                        <div className="ml-auto">
                          {member.status === 'approved' ? (
                            <span className="rounded-full bg-teal/10 px-2 py-1 text-[10px] font-mono tracking-[2px] text-teal">
                              APPROVED
                            </span>
                          ) : member.status === 'rejected' ? (
                            <span className="rounded-full bg-danger/10 px-2 py-1 text-[10px] font-mono tracking-[2px] text-danger">
                              REJECTED
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs text-white/30">
                              <Clock className="h-3.5 w-3.5" /> Pending...
                            </span>
                          )}
                        </div>
                      </div>
                      {member.comment ? (
                        <p className="mt-2 text-xs text-white/50">{member.comment}</p>
                      ) : null}
                    </GlassCard>
                  </motion.div>
                ))}
              </div>

              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between text-xs text-white/50">
                  <span>
                    <CountUp end={castCount} trigger /> of {totalCount} votes cast
                  </span>
                  <span>{approvedCount} approved</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    className="h-2 bg-teal"
                    initial={{ width: 0 }}
                    animate={{ width: `${approveWidth}%` }}
                    transition={{ duration: 0.7 }}
                  />
                  <motion.div
                    className="h-2 bg-danger"
                    initial={{ width: 0 }}
                    animate={{ width: `${rejectWidth}%` }}
                    transition={{ duration: 0.7 }}
                  />
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    className="h-2 bg-white/20"
                    initial={{ width: 0 }}
                    animate={{ width: `${pendingWidth}%` }}
                    transition={{ duration: 0.7 }}
                  />
                </div>
              </div>

              <div className="relative mt-6 min-h-[500px]">
                <div className="border-t border-glass-border pt-6">
                  <h4 className="font-syne text-xl">Your Verdict</h4>

                  <AnimatePresence mode="wait">
                    {voteState !== 'confirmed' ? (
                      <motion.div
                        key="vote-actions"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="mt-4"
                      >
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.97 }}
                            className="w-full rounded-xl border-2 border-teal/50 bg-teal/10 px-4 py-6 text-left text-teal"
                            onClick={() => {
                              setVoteState('approving')
                              setShowApproveModal(true)
                            }}
                            data-cursor="pointer"
                          >
                            <div className="flex items-center gap-2 font-syne text-lg font-bold">
                              <Check className="h-6 w-6" /> APPROVE
                            </div>
                            <div className="mt-1 text-xs text-teal/70">Release Rahul&apos;s stake</div>
                          </motion.button>

                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.97 }}
                            className="w-full rounded-xl border-2 border-danger/50 bg-danger/10 px-4 py-6 text-left text-danger"
                            onClick={() => {
                              setVoteState('rejecting')
                              setShowRejectModal(true)
                            }}
                            data-cursor="pointer"
                          >
                            <div className="flex items-center gap-2 font-syne text-lg font-bold">
                              <X className="h-6 w-6" /> REJECT
                            </div>
                            <div className="mt-1 text-xs text-danger/70">Mark proof as insufficient</div>
                          </motion.button>
                        </div>

                        <div className="mt-3 text-center text-xs text-white/20" data-cursor="pointer">
                          or Abstain
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="vote-confirmed"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mt-4"
                      >
                        <motion.div
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="inline-flex items-center gap-2 rounded-full bg-teal/10 px-3 py-1 text-sm text-teal"
                        >
                          <Check className="h-4 w-4" /> Your vote recorded on Algorand
                        </motion.div>

                        <div className="mt-4 text-sm text-white/60">{approvedCount} of {totalCount} approved</div>
                        <div className="mt-2 h-2 rounded-full bg-white/10">
                          <motion.div
                            className="h-2 rounded-full bg-teal"
                            initial={{ width: 0 }}
                            animate={{ width: `${(approvedCount / totalCount) * 100}%` }}
                            transition={{ duration: 0.8 }}
                          />
                        </div>

                        {majorityReached ? (
                          <div className="mt-4 rounded-xl border border-teal/30 bg-teal/10 p-3 text-sm text-teal">
                            Majority reached! Pact will resolve when all votes are cast.
                          </div>
                        ) : null}

                        <Link
                          to={`/pact/${id ?? 'pact-4721'}`}
                          className="mt-4 inline-flex text-sm text-teal"
                          data-cursor="pointer"
                        >
                          Return to Pact
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <AnimatePresence>
                  {showApproveModal ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      className="absolute inset-0 z-20 flex min-h-[500px] items-center justify-center rounded-2xl bg-obsidian/80 p-4 backdrop-blur-sm"
                    >
                      <GlassCard className="w-full max-w-md border border-teal/30 p-8 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-teal/10 text-teal">
                          <Check className="h-8 w-8" />
                        </div>
                        <h5 className="mt-4 font-syne text-2xl">Confirm: APPROVE</h5>
                        <p className="mt-2 text-sm leading-relaxed text-white/50">
                          By approving, you confirm Rahul&apos;s proof is genuine. If majority approves,
                          his INR 5,000 is returned.
                        </p>

                        <MagneticButton variant="gold" className="mt-6 w-full" onClick={confirmApprove}>
                          Confirm Approve <Check className="h-4 w-4" />
                        </MagneticButton>
                        <button
                          type="button"
                          className="mt-3 text-sm text-white/60"
                          onClick={() => {
                            setShowApproveModal(false)
                            setVoteState('pending')
                          }}
                          data-cursor="pointer"
                        >
                          Cancel
                        </button>
                      </GlassCard>
                    </motion.div>
                  ) : null}
                </AnimatePresence>

                <AnimatePresence>
                  {showRejectModal ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      className="absolute inset-0 z-20 flex min-h-[500px] items-center justify-center rounded-2xl bg-obsidian/80 p-4 backdrop-blur-sm"
                    >
                      <GlassCard className="w-full max-w-md border border-danger/30 p-8 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-danger/10 text-danger">
                          <AlertTriangle className="h-8 w-8" />
                        </div>
                        <h5 className="mt-4 font-syne text-2xl text-danger">Confirm: REJECT</h5>

                        <p className="mt-4 text-sm text-white/50">Type REJECT to confirm:</p>
                        <input
                          value={rejectConfirmText}
                          onChange={(event) => setRejectConfirmText(event.target.value)}
                          className="mt-2 w-full rounded-xl border border-danger/30 bg-glass px-3 py-2 text-sm text-white outline-none focus:border-danger"
                        />

                        <textarea
                          value={rejectReason}
                          onChange={(event) => setRejectReason(event.target.value)}
                          rows={3}
                          placeholder="Why are you rejecting this proof? (required)"
                          className="mt-3 w-full rounded-xl border border-danger/30 bg-glass px-3 py-2 text-sm text-white outline-none focus:border-danger"
                        />

                        <button
                          type="button"
                          disabled={rejectConfirmText !== 'REJECT' || !rejectReason.trim()}
                          className={cn(
                            'mt-4 w-full rounded-xl px-4 py-3 text-sm font-semibold transition-colors',
                            rejectConfirmText === 'REJECT' && rejectReason.trim()
                              ? 'bg-danger text-white'
                              : 'bg-danger/30 text-white/60 opacity-50',
                          )}
                          onClick={confirmReject}
                          data-cursor="pointer"
                        >
                          Confirm Rejection
                        </button>
                        <button
                          type="button"
                          className="mt-3 text-sm text-white/60"
                          onClick={() => {
                            setShowRejectModal(false)
                            setVoteState('pending')
                          }}
                          data-cursor="pointer"
                        >
                          Cancel
                        </button>
                      </GlassCard>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </GlassCard>

            <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
              <div className="flex items-start gap-2 text-xs text-white/40">
                <Shield className="h-4 w-4 text-amber-400" />
                StakePact monitors for coordinated voting. Fraudulent patterns result in CommitScore penalties.
              </div>
            </div>

            <div className="mt-4 inline-flex items-center gap-2 text-xs text-white/35">
              <Users className="h-3.5 w-3.5" />
              Group voting on Rahul Sharma - Deliver MVP of StakePact Mobile App
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center gap-3 text-xs text-white/30">
          <ThumbsUp className="h-4 w-4 text-teal" />
          Approve returns stake
          <ThumbsDown className="ml-4 h-4 w-4 text-danger" />
          Reject flags proof for dispute handling
        </div>
      </div>
    </div>
  )
}
