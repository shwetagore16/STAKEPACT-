import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  CheckCircle,
  ChevronDown,
  Clock,
  ExternalLink,
  Github,
  Shield,
} from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { GlassCard } from '../components/ui/GlassCard'
import { FlipClock } from '../components/ui/FlipClock'
import { MagneticButton } from '../components/ui/MagneticButton'
import { cn } from '../lib/utils'

type Proof = {
  type: 'github' | 'document'
  url?: string
  verified: boolean
  time: string
  commitHash?: string
  aiScore: number | null
}

type PactMember = {
  id: number
  name: string
  initials: string
  isYou: boolean
  status: 'submitted' | 'pending' | 'failed'
  proof?: Proof
}

type Pact = {
  id: string
  title: string
  category: string
  deadline: Date
  pot: number
  perMember: number
  members: PactMember[]
}

const pactData: Pact = {
  id: 'pact-4721',
  title: 'Deliver MVP of StakePact Mobile App',
  category: 'Corporate',
  deadline: new Date(Date.now() + (3 * 86400 + 14 * 3600 + 22 * 60) * 1000),
  pot: 25000,
  perMember: 5000,
  members: [
    {
      id: 1,
      name: 'Arjun Mehta',
      initials: 'AM',
      isYou: true,
      status: 'submitted',
      proof: {
        type: 'github',
        url: 'github.com/arjun/stakepact-mobile',
        verified: true,
        time: '2h ago',
        commitHash: 'a3f2b9c',
        aiScore: null,
      },
    },
    {
      id: 2,
      name: 'Priya Singh',
      initials: 'PS',
      isYou: false,
      status: 'submitted',
      proof: {
        type: 'document',
        verified: false,
        aiScore: 94,
        time: '45m ago',
      },
    },
    { id: 3, name: 'Rahul Sharma', initials: 'RS', isYou: false, status: 'pending' },
    { id: 4, name: 'Sneha Patil', initials: 'SP', isYou: false, status: 'pending' },
    { id: 5, name: 'Dev Sharma', initials: 'DS', isYou: false, status: 'pending' },
  ],
}

type CountdownParts = {
  days: number
  hours: number
  minutes: number
  seconds: number
  totalSeconds: number
}

function getRemaining(targetDate: Date): CountdownParts {
  const diffMs = Math.max(0, targetDate.getTime() - Date.now())
  const totalSeconds = Math.floor(diffMs / 1000)

  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    totalSeconds,
  }
}

function formatINR(amount: number): string {
  return `INR ${new Intl.NumberFormat('en-IN').format(amount)}`
}

function hashColor(name: string) {
  const palette = ['#0ea5e9', '#8a5aff', '#00ffd1', '#f59e0b', '#ec4899']
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return palette[hash % palette.length]
}

function pendingEta(deadline: Date): string {
  const diffSeconds = Math.max(0, Math.floor((deadline.getTime() - Date.now()) / 1000))
  const days = Math.floor(diffSeconds / 86400)
  const hours = Math.floor((diffSeconds % 86400) / 3600)
  const minutes = Math.floor((diffSeconds % 3600) / 60)

  if (days > 0) return `${days}d ${hours}h remaining`
  if (hours > 0) return `${hours}h ${minutes}m remaining`
  return `${minutes}m remaining`
}

function MechanicalFlipUnit({ value, label, tone }: { value: string; label: string; tone: string }) {
  const [current, setCurrent] = useState(value)
  const [next, setNext] = useState(value)
  const [isFlipping, setIsFlipping] = useState(false)

  useEffect(() => {
    if (value === current) return
    setNext(value)
    setIsFlipping(true)
    const timeout = window.setTimeout(() => {
      setCurrent(value)
      setIsFlipping(false)
    }, 500)

    return () => window.clearTimeout(timeout)
  }, [current, value])

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-[160px] w-[120px] [perspective:600px]">
        <div className="absolute inset-0 overflow-hidden rounded-xl bg-[#0d1420]">
          <div className={cn('absolute inset-x-0 top-0 h-1/2 overflow-hidden border-b border-black/30', tone)}>
            <div className="flex h-full items-end justify-center pb-2 font-syne text-[80px] font-bold leading-none">
              {current}
            </div>
          </div>
          <div className={cn('absolute inset-x-0 bottom-0 h-1/2 overflow-hidden', tone)}>
            <div className="flex h-full items-start justify-center pt-2 font-syne text-[80px] font-bold leading-none">
              {next}
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 top-1/2 z-10 h-px -translate-y-1/2 bg-black/30" />

        <AnimatePresence initial={false}>
          {isFlipping ? (
            <motion.div
              key={`top-${current}-${label}`}
              className={cn(
                'absolute inset-x-0 top-0 h-1/2 origin-bottom overflow-hidden rounded-t-xl bg-[#0d1420] border-b border-black/30',
                tone,
              )}
              initial={{ rotateX: 0 }}
              animate={{ rotateX: -90 }}
              exit={{ rotateX: -90 }}
              transition={{ duration: 0.25, ease: 'easeIn' }}
            >
              <div className="flex h-full items-end justify-center pb-2 font-syne text-[80px] font-bold leading-none">
                {current}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <AnimatePresence initial={false}>
          {isFlipping ? (
            <motion.div
              key={`bottom-${next}-${label}`}
              className={cn(
                'absolute inset-x-0 bottom-0 h-1/2 origin-top overflow-hidden rounded-b-xl bg-[#0d1420]',
                tone,
              )}
              initial={{ rotateX: 90 }}
              animate={{ rotateX: 0 }}
              exit={{ rotateX: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut', delay: 0.25 }}
            >
              <div className="flex h-full items-start justify-center pt-2 font-syne text-[80px] font-bold leading-none">
                {next}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
      <div className="mt-3 font-mono text-[10px] tracking-[3px] text-white/30">{label}</div>
    </div>
  )
}

function MechanicalCountdown({ deadline }: { deadline: Date }) {
  const [remaining, setRemaining] = useState<CountdownParts>(() => getRemaining(deadline))

  useEffect(() => {
    const interval = window.setInterval(() => {
      setRemaining(getRemaining(deadline))
    }, 1000)

    return () => window.clearInterval(interval)
  }, [deadline])

  const tone = remaining.totalSeconds <= 21600 ? 'text-danger' : remaining.totalSeconds <= 86400 ? 'text-amber-400' : 'text-white'
  const showDangerGlow = remaining.totalSeconds <= 21600

  const units = [
    { key: 'DAYS', value: remaining.days },
    { key: 'HOURS', value: remaining.hours },
    { key: 'MINUTES', value: remaining.minutes },
    { key: 'SECONDS', value: remaining.seconds },
  ]

  return (
    <motion.div
      className="mt-12 inline-flex items-end gap-4"
      animate={
        showDangerGlow
          ? {
              boxShadow: [
                '0 0 0px rgba(255,59,92,0)',
                '0 0 30px rgba(255,59,92,0.4)',
                '0 0 0px rgba(255,59,92,0)',
              ],
            }
          : { boxShadow: '0 0 0px rgba(0,0,0,0)' }
      }
      transition={{ duration: 2, repeat: showDangerGlow ? Infinity : 0 }}
    >
      {units.map((unit, index) => (
        <div key={unit.key} className="flex items-end gap-4">
          <MechanicalFlipUnit value={unit.value.toString().padStart(2, '0')} label={unit.key} tone={tone} />
          {index < units.length - 1 ? (
            <span className={cn('pb-8 font-syne text-5xl animate-pulse', tone)}>:</span>
          ) : null}
        </div>
      ))}
    </motion.div>
  )
}

function ProofAccordionItem({
  member,
  open,
  onToggle,
}: {
  member: PactMember
  open: boolean
  onToggle: () => void
}) {
  const proof = member.proof
  if (!proof) return null

  const score = proof.aiScore ?? 0
  const circumference = 2 * Math.PI * 30
  const offset = circumference * (1 - score / 100)

  return (
    <GlassCard className="p-0 overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between px-4 py-4 text-left"
        data-cursor="pointer"
      >
        <div>
          <div className="font-space text-sm text-white">{member.name}</div>
          <div className="mt-1 text-xs text-white/40">{proof.type.toUpperCase()} proof</div>
        </div>
        <div className="flex items-center gap-3">
          <span className={cn(
            'rounded-full px-2 py-1 text-[10px] font-mono tracking-[2px]',
            proof.verified ? 'bg-teal/10 text-teal' : 'bg-amber-400/10 text-amber-300',
          )}>
            {proof.verified ? 'VERIFIED' : 'REVIEWED'}
          </span>
          <ChevronDown className={cn('h-4 w-4 text-white/40 transition-transform', open && 'rotate-180')} />
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="border-t border-glass-border px-4 pb-4 pt-4">
              {member.id === 1 ? (
                <>
                  <div className="rounded-xl bg-black/30 p-4 font-mono text-xs">
                    <p className="text-teal">$ git log --oneline -1</p>
                    <p className="mt-2 text-white">a3f2b9c feat: final MVP release v1.0</p>
                    <p className="mt-2 text-white/40">Author: Arjun Mehta</p>
                    <p className="text-white/40">Date: July 23, 2024 14:34:22 IST</p>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-teal/10 px-3 py-1 text-[10px] font-mono tracking-[2px] text-teal">
                      AUTO-VERIFIED
                    </span>
                    <span className="font-mono text-xs text-white/30">Algorand TX: 0xAB3...F4 OK</span>
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                  <div className="flex items-center gap-4">
                    <svg width="80" height="80" viewBox="0 0 80 80">
                      <circle cx="40" cy="40" r="30" stroke="rgba(138,90,255,0.2)" strokeWidth="6" fill="none" />
                      <motion.circle
                        cx="40"
                        cy="40"
                        r="30"
                        stroke="#8A5AFF"
                        strokeWidth="6"
                        fill="none"
                        strokeLinecap="round"
                        transform="rotate(-90 40 40)"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: offset }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                      />
                    </svg>
                    <div>
                      <p className="font-syne text-2xl text-violet">{score}%</p>
                      <p className="text-xs text-white/40">AI Confidence</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {[
                      ['Commitment keywords found', 'ok'],
                      ['Timestamp within deadline', 'ok'],
                      ['Screenshots detected (4)', 'ok'],
                      ['Client sign-off not found', 'warn'],
                    ].map(([label, type], index) => (
                      <motion.div
                        key={label}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.08 }}
                        className={cn('text-sm', type === 'ok' ? 'text-teal' : 'text-amber-400')}
                      >
                        {type === 'ok' ? 'OK ' : 'WARN '} {label}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </GlassCard>
  )
}

export default function PactDetail() {
  const { id } = useParams<{ id: string }>()
  const pact = id === pactData.id ? pactData : null
  const [expandedProof, setExpandedProof] = useState<number>(1)

  const remaining = useMemo(() => (pact ? getRemaining(pact.deadline) : null), [pact])

  const submittedCount = useMemo(
    () => (pact ? pact.members.filter((member) => member.status === 'submitted').length : 0),
    [pact],
  )

  const elapsedPercent = useMemo(() => {
    if (!pact) return 0
    const end = pact.deadline.getTime()
    const start = end - 7 * 86400 * 1000
    const now = Date.now()
    const progress = ((now - start) / (end - start)) * 100
    return Math.min(100, Math.max(0, progress))
  }, [pact])

  if (!pact || !remaining) {
    return (
      <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-8 text-center">
        <div>
          <h1 className="font-syne text-4xl text-white">Pact Not Found</h1>
          <Link to="/dashboard" className="mt-6 inline-flex text-teal" data-cursor="pointer">
            Back to dashboard
          </Link>
        </div>
      </div>
    )
  }

  const deadlineText = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  }).format(pact.deadline)

  return (
    <div className="app-page bg-obsidian pb-12 text-white">
      <div className="sticky top-0 z-40 flex items-center gap-4 border-b border-glass-border bg-obsidian/80 px-8 py-4 backdrop-blur-glass">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white" data-cursor="pointer">
          <ArrowLeft className="h-4 w-4" />
          My Pacts
        </Link>
        <div className="text-sm text-white/30">My Pacts / Pact #4721</div>
        <div className="ml-auto inline-flex items-center gap-2 rounded-full bg-teal/10 px-3 py-1 text-[11px] font-mono tracking-[2px] text-teal">
          <span className="h-2 w-2 animate-pulse rounded-full bg-teal" />
          ACTIVE
        </div>
      </div>

      <section className="relative px-8 py-16 text-center">
        <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(0,255,209,0.04) 0%, transparent 60%)' }} />

        <div className="relative mx-auto max-w-6xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/40 bg-sky-400/10 px-3 py-1 font-mono text-[10px] tracking-[2px] text-sky-300">
            <Shield className="h-3 w-3" />
            CORPORATE
          </div>
          <div className="mt-3 font-mono text-xs text-white/20">#SPT-2024-08472</div>
          <h1 className="mx-auto mt-4 max-w-3xl font-syne text-5xl font-bold">{pact.title}</h1>

          <MechanicalCountdown deadline={pact.deadline} />

          <div className="mt-8 flex justify-center">
            <div className="origin-top scale-[0.62]">
              <FlipClock targetDate={pact.deadline} size="lg" />
            </div>
          </div>

          <p className="mt-6 text-sm text-white/40">Deadline: {deadlineText}</p>

          <div className="mx-auto mt-6 max-w-2xl">
            <div className="mb-2 flex items-center justify-between text-xs text-white/50">
              <span className="inline-flex items-center gap-2">
                <Clock className="h-3.5 w-3.5" /> Time elapsed
              </span>
              <span>{elapsedPercent.toFixed(0)}%</span>
            </div>
            <div className="h-1 overflow-hidden rounded-full bg-white/5">
              <motion.div
                className={cn(
                  'h-full rounded-full',
                  remaining.totalSeconds <= 21600
                    ? 'bg-danger'
                    : 'bg-gradient-to-r from-teal to-gold',
                )}
                initial={{ width: 0 }}
                animate={{ width: `${elapsedPercent}%` }}
                transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }}
              />
            </div>
          </div>

          <div className="mx-auto mt-12 grid max-w-3xl gap-4 md:grid-cols-3">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
              <GlassCard className="p-5 text-center">
                <div className="font-syne text-3xl text-gold">{formatINR(pact.pot)}</div>
                <div className="mt-2 text-xs text-white/40">Total Pot</div>
              </GlassCard>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} viewport={{ once: true }}>
              <GlassCard className="p-5 text-center">
                <div className="text-lg text-white">{pact.members.length} Members</div>
                <div className="mt-3 flex justify-center -space-x-2">
                  {pact.members.map((member) => (
                    <div
                      key={member.id}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-obsidian text-xs text-white"
                      style={{ backgroundColor: hashColor(member.name) }}
                    >
                      {member.initials}
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} viewport={{ once: true }}>
              <GlassCard className="p-5 text-center">
                <div className="font-syne text-3xl text-white">{submittedCount}/{pact.members.length}</div>
                <div className="mt-3 h-1 rounded-full bg-white/10">
                  <div className="h-1 rounded-full bg-teal" style={{ width: `${(submittedCount / pact.members.length) * 100}%` }} />
                </div>
                <div className="mt-2 text-xs text-white/40">Submitted</div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl px-8">
        <div className="font-mono text-[11px] tracking-[4px] text-teal">COMMITMENT BOARD</div>
        <div className="mt-2 border-b border-glass-border" />

        <div className="mt-4 space-y-3">
          {pact.members.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ x: -30, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.08 }}
              viewport={{ once: true }}
            >
              <GlassCard className={cn('relative p-4', member.isYou && 'border border-teal/30 bg-teal/5')}>
                {member.isYou ? (
                  <span className="absolute right-4 top-3 rounded-full bg-teal/10 px-2 py-1 text-[10px] font-mono tracking-[2px] text-teal">
                    YOUR ROW
                  </span>
                ) : null}
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full text-sm text-white" style={{ backgroundColor: hashColor(member.name) }}>
                      {member.initials}
                    </div>
                    <span
                      className={cn(
                        'absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border border-obsidian',
                        member.status === 'submitted' && 'bg-green-500',
                        member.status === 'pending' && 'bg-amber-400',
                        member.status === 'failed' && 'bg-danger',
                      )}
                    />
                  </div>

                  <div>
                    <div className="font-space text-sm font-semibold text-white">{member.name}</div>
                    <div className="text-xs text-white/40">
                      {member.status === 'submitted'
                        ? `Proof submitted ${member.proof?.time}`
                        : pendingEta(pact.deadline)}
                    </div>
                  </div>

                  <div className="ml-auto text-right">
                    <div className="font-syne font-bold text-gold">{formatINR(pact.perMember)}</div>
                  </div>

                  <div className="ml-4 flex items-center gap-3">
                    {member.status === 'submitted' ? (
                      <>
                        <span className="rounded-full bg-teal/10 px-2 py-1 text-[10px] font-mono tracking-[2px] text-teal">
                          OK SUBMITTED
                        </span>
                        <button type="button" className="inline-flex items-center gap-1 text-sm text-teal" data-cursor="pointer">
                          View Proof <ExternalLink className="h-3.5 w-3.5" />
                        </button>
                      </>
                    ) : (
                      <span className="rounded-full bg-amber-400/10 px-2 py-1 text-[10px] font-mono tracking-[2px] text-amber-300">
                        PENDING
                      </span>
                    )}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-12 max-w-4xl px-8">
        <h3 className="font-syne text-xl">Submitted Proofs</h3>
        <div className="mt-4 space-y-3">
          {pact.members
            .filter((member) => member.status === 'submitted' && member.proof)
            .map((member) => (
              <ProofAccordionItem
                key={member.id}
                member={member}
                open={expandedProof === member.id}
                onToggle={() => setExpandedProof((current) => (current === member.id ? -1 : member.id))}
              />
            ))}
        </div>
      </section>

      <section className="mx-auto mt-12 max-w-4xl px-8">
        <div className="sticky bottom-6">
          <GlassCard className="flex items-center justify-between border border-teal/20 bg-teal/5 p-6">
            <div className="flex items-center gap-2 font-semibold text-teal">
              <CheckCircle className="h-5 w-5" />
              Your proof is submitted and verified
            </div>
            <Link to={`/pact/${pact.id}/vote`} data-cursor="pointer">
              <MagneticButton variant="gold">
                Vote on Others' Proofs
                <ChevronDown className="h-4 w-4 -rotate-90" />
              </MagneticButton>
            </Link>
          </GlassCard>
        </div>
      </section>

      <div className="mt-10 flex justify-center text-xs text-white/30">
        <span className="inline-flex items-center gap-2 font-mono">
          <Github className="h-3.5 w-3.5" /> Proof links and verifier state are mirrored on-chain.
        </span>
      </div>
    </div>
  )
}
