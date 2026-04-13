import { AnimatePresence, animate, motion, useInView, useMotionValue } from 'framer-motion'
import {
  Award,
  Copy,
  ExternalLink,
  Share2,
  Shield,
  TrendingUp,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { CountUp } from '../components/ui/CountUp'
import { GlassCard } from '../components/ui/GlassCard'
import { MagneticButton } from '../components/ui/MagneticButton'
import { cn } from '../lib/utils'

type HistoryStatus = 'won' | 'lost' | 'active'
type TabKey = 'all' | 'won' | 'lost' | 'active'

type HistoryRow = {
  pact: string
  category: 'Corporate' | 'Education' | 'Personal' | 'Legal'
  ended: string
  stake: number
  result: HistoryStatus
  pnl: number
}

const historyRows: HistoryRow[] = [
  {
    pact: 'Q3 Sales Report',
    category: 'Corporate',
    ended: 'July 2024',
    stake: 5000,
    result: 'won',
    pnl: 1800,
  },
  {
    pact: 'DSA Course',
    category: 'Education',
    ended: 'June 2024',
    stake: 2000,
    result: 'won',
    pnl: 500,
  },
  {
    pact: '30km Running',
    category: 'Personal',
    ended: 'June 2024',
    stake: 1000,
    result: 'won',
    pnl: 0,
  },
  {
    pact: 'Contract Filing',
    category: 'Legal',
    ended: 'May 2024',
    stake: 1000,
    result: 'lost',
    pnl: -1000,
  },
  {
    pact: 'MVP Delivery',
    category: 'Corporate',
    ended: 'April 2024',
    stake: 5000,
    result: 'won',
    pnl: 5000,
  },
]

const earnedBadges = [
  { id: 'b1', name: 'Hex Finisher', earned: 'March 2024', pact: 'Q3 Sales Report', type: 'hex' },
  { id: 'b2', name: 'Circle Closer', earned: 'April 2024', pact: 'MVP Delivery', type: 'rings' },
  { id: 'b3', name: 'Triad Discipline', earned: 'April 2024', pact: 'DSA Course', type: 'triangles' },
  { id: 'b4', name: 'Diamond Consistency', earned: 'May 2024', pact: '30km Running', type: 'diamonds' },
  { id: 'b5', name: 'Star Executor', earned: 'June 2024', pact: 'Q3 Sales Report', type: 'star' },
  { id: 'b6', name: 'Network Clarity', earned: 'July 2024', pact: 'MVP Delivery', type: 'nodes' },
] as const

const lockedBadges = [
  { id: 'l1', name: 'Legal Eagle', hint: 'Complete a Legal pact' },
  { id: 'l2', name: 'Iron Marathon', hint: 'Win 10 pacts in a row' },
]

function formatINR(value: number) {
  return `INR ${new Intl.NumberFormat('en-IN').format(Math.abs(value))}`
}

function BadgePattern({ type }: { type: (typeof earnedBadges)[number]['type'] }) {
  if (type === 'hex') {
    return (
      <svg viewBox="0 0 80 80" className="h-20 w-20 text-teal transition-transform duration-500 group-hover:rotate-6">
        <polygon points="40,6 68,22 68,58 40,74 12,58 12,22" fill="none" stroke="currentColor" strokeWidth="2" />
        <polygon points="40,18 58,28 58,52 40,62 22,52 22,28" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
      </svg>
    )
  }

  if (type === 'rings') {
    return (
      <svg viewBox="0 0 80 80" className="h-20 w-20 text-gold transition-transform duration-500 group-hover:scale-105">
        <circle cx="40" cy="40" r="28" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="40" cy="40" r="18" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.7" />
        <circle cx="40" cy="40" r="8" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.5" />
      </svg>
    )
  }

  if (type === 'triangles') {
    return (
      <svg viewBox="0 0 80 80" className="h-20 w-20 text-violet transition-transform duration-500 group-hover:rotate-3">
        <path d="M10 62 L24 36 L38 62 Z" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M28 44 L42 18 L56 44 Z" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.7" />
        <path d="M46 62 L60 36 L74 62 Z" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.5" />
      </svg>
    )
  }

  if (type === 'diamonds') {
    return (
      <svg viewBox="0 0 80 80" className="h-20 w-20 text-sky-400 transition-transform duration-500 group-hover:rotate-6">
        <rect x="24" y="24" width="32" height="32" transform="rotate(45 40 40)" fill="none" stroke="currentColor" strokeWidth="2" />
        <rect x="30" y="30" width="20" height="20" transform="rotate(45 40 40)" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
      </svg>
    )
  }

  if (type === 'star') {
    return (
      <svg viewBox="0 0 80 80" className="h-20 w-20 text-amber-400 transition-transform duration-500 group-hover:scale-105">
        <path d="M40 10 L47 31 L69 31 L51 44 L58 66 L40 53 L22 66 L29 44 L11 31 L33 31 Z" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="40" cy="40" r="4" fill="currentColor" opacity="0.8" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 80 80" className="h-20 w-20 text-emerald-400 transition-transform duration-500 group-hover:rotate-3">
      <line x1="16" y1="16" x2="40" y2="28" stroke="currentColor" strokeWidth="2" />
      <line x1="40" y1="28" x2="64" y2="20" stroke="currentColor" strokeWidth="2" />
      <line x1="40" y1="28" x2="24" y2="54" stroke="currentColor" strokeWidth="2" />
      <line x1="24" y1="54" x2="56" y2="60" stroke="currentColor" strokeWidth="2" />
      <circle cx="16" cy="16" r="3" fill="currentColor" />
      <circle cx="40" cy="28" r="3" fill="currentColor" />
      <circle cx="64" cy="20" r="3" fill="currentColor" />
      <circle cx="24" cy="54" r="3" fill="currentColor" />
      <circle cx="56" cy="60" r="3" fill="currentColor" />
    </svg>
  )
}

export default function Profile() {
  const [activeTab, setActiveTab] = useState<TabKey>('all')
  const [walletCopied, setWalletCopied] = useState(false)

  const scoreTarget = 847
  const scoreMv = useMotionValue(0)
  const [scoreDisplay, setScoreDisplay] = useState(0)

  const arcRef = useRef<HTMLDivElement | null>(null)
  const arcInView = useInView(arcRef, { once: true, amount: 0.5 })

  useEffect(() => {
    const unsubscribe = scoreMv.on('change', (latest) => {
      setScoreDisplay(Math.round(latest))
    })

    return () => unsubscribe()
  }, [scoreMv])

  useEffect(() => {
    if (!arcInView) return
    const controls = animate(scoreMv, scoreTarget, {
      duration: 1.8,
      ease: [0.22, 1, 0.36, 1],
    })

    return () => controls.stop()
  }, [arcInView, scoreMv])

  const filteredRows = useMemo(() => {
    if (activeTab === 'all') return historyRows
    return historyRows.filter((row) => row.result === activeTab)
  }, [activeTab])

  const categoryClass: Record<HistoryRow['category'], string> = {
    Corporate: 'bg-sky-400/10 border-sky-400/40 text-sky-300',
    Education: 'bg-teal/10 border-teal/40 text-teal',
    Personal: 'bg-amber-400/10 border-amber-400/40 text-amber-200',
    Legal: 'bg-danger/10 border-danger/40 text-danger',
  }

  const radius = 100
  const circumference = Math.PI * radius
  const progress = scoreTarget / 1000
  const offset = circumference * (1 - progress)

  const ticks = useMemo(() => {
    return Array.from({ length: 11 }).map((_, index) => {
      const angle = Math.PI - (index / 10) * Math.PI
      const x1 = 120 + Math.cos(angle) * 88
      const y1 = 120 - Math.sin(angle) * 88
      const x2 = 120 + Math.cos(angle) * 98
      const y2 = 120 - Math.sin(angle) * 98
      return { x1, y1, x2, y2 }
    })
  }, [])

  const copyWallet = async () => {
    try {
      await navigator.clipboard.writeText('0x3f2a...9c4d')
      setWalletCopied(true)
      window.setTimeout(() => setWalletCopied(false), 1200)
    } catch {
      setWalletCopied(false)
    }
  }

  return (
    <div className="min-h-screen bg-obsidian px-8 pb-16 pt-10 text-white">
      <div className="mx-auto max-w-6xl">
        <section className="py-16 text-center">
          <div className="relative mx-auto h-24 w-24">
            <div
              className="absolute -inset-1 rounded-full animate-spin-slow"
              style={{
                animationDuration: '8s',
                background:
                  'conic-gradient(from 0deg, #00FFD1, #F5C842, #8A5AFF, #00FFD1)',
              }}
            />
            <div className="absolute inset-[2px] flex items-center justify-center rounded-full bg-obsidian font-syne text-2xl font-bold text-white">
              AM
            </div>
          </div>

          <h1 className="mt-6 font-syne text-3xl font-bold">Arjun Mehta</h1>
          <p className="mt-2 text-lg text-white/50">The Reliable One</p>

          <div className="mt-3 flex items-center justify-center gap-2 font-mono text-sm text-white/30">
            0x3f2a...9c4d
            <button onClick={copyWallet} className="text-white/50 hover:text-white" data-cursor="pointer">
              <Copy className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-2 text-xs text-white/40">Member since: March 2024</p>

          <div className="mt-5 flex justify-center">
            <MagneticButton variant="ghost" className="px-3 py-2 text-xs">
              <Share2 className="h-4 w-4" />
              Share Profile
            </MagneticButton>
          </div>

          {walletCopied ? (
            <div className="mt-2 text-xs text-teal">Wallet copied</div>
          ) : null}
        </section>

        <section ref={arcRef}>
          <GlassCard className="mx-auto mt-2 max-w-lg border border-violet/20 p-10 text-center">
            <div className="relative mx-auto h-[160px] w-[240px]">
              <svg viewBox="0 0 240 140" className="h-[140px] w-[240px]">
                <defs>
                  <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#F5C842" />
                    <stop offset="100%" stopColor="#00FFD1" />
                  </linearGradient>
                </defs>

                {ticks.map((tick, index) => (
                  <line
                    key={`tick-${index}`}
                    x1={tick.x1}
                    y1={tick.y1}
                    x2={tick.x2}
                    y2={tick.y2}
                    stroke="rgba(255,255,255,0.18)"
                    strokeWidth="1"
                  />
                ))}

                <path
                  d="M 20 120 A 100 100 0 0 1 220 120"
                  fill="none"
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="12"
                  strokeLinecap="round"
                />
                <motion.path
                  d="M 20 120 A 100 100 0 0 1 220 120"
                  fill="none"
                  stroke="url(#scoreGrad)"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={arcInView ? { strokeDashoffset: offset } : { strokeDashoffset: circumference }}
                  transition={{ duration: 2, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
                />
                <motion.path
                  d="M 20 120 A 100 100 0 0 1 220 120"
                  fill="none"
                  stroke="rgba(255,255,255,0.35)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={`${circumference * 0.14} ${circumference}`}
                  animate={arcInView ? { strokeDashoffset: [circumference, -circumference] } : { strokeDashoffset: circumference }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'linear', delay: 1 }}
                  opacity={0.45}
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center pt-6">
                <div className="font-syne text-6xl font-bold text-white">{scoreDisplay}</div>
                <div className="text-lg text-white/30">/1000</div>
                <div className="mt-1 font-syne text-2xl text-teal">A+</div>
              </div>
            </div>

            <p className="mt-3 text-sm text-white/50">Top 12% of all StakePact users</p>
            <p className="mt-1 inline-flex items-center gap-1 text-sm text-teal">
              <TrendingUp className="h-4 w-4" /> +34 this month
            </p>
          </GlassCard>
        </section>

        <section className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: 'Completed Pacts',
              value: 14,
              icon: TrendingUp,
              color: 'text-teal',
              prefix: '',
              suffix: '',
              decimals: 0,
            },
            {
              label: 'Success Rate',
              value: 93.3,
              icon: Shield,
              color: 'text-violet',
              prefix: '',
              suffix: '%',
              decimals: 1,
            },
            {
              label: 'Total Staked',
              value: 124000,
              icon: Award,
              color: 'text-gold',
              prefix: 'INR ',
              suffix: '',
              decimals: 0,
            },
            {
              label: 'Total Earned',
              value: 38500,
              icon: TrendingUp,
              color: 'text-emerald-400',
              prefix: 'INR ',
              suffix: '',
              decimals: 0,
            },
          ].map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-white/40">{stat.label}</div>
                    <Icon className={cn('h-4 w-4', stat.color)} />
                  </div>
                  <div className={cn('mt-3 font-syne text-3xl', stat.color === 'text-emerald-400' ? 'text-gold' : 'text-white')}>
                    <CountUp
                      end={stat.value}
                      prefix={stat.prefix}
                      suffix={stat.suffix}
                      decimals={stat.decimals}
                    />
                  </div>
                </GlassCard>
              </motion.div>
            )
          })}
        </section>

        <section className="mt-16">
          <h2 className="font-syne text-2xl">Your ProofBadges</h2>
          <p className="mt-1 text-sm text-white/40">Non-transferable NFTs minted on Algorand</p>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {earnedBadges.map((badge, index) => (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
              >
                <GlassCard tilt className="group p-4">
                  <BadgePattern type={badge.type} />
                  <div className="mt-3 font-syne text-sm font-bold">{badge.name}</div>
                  <div className="mt-1 text-xs text-white/30">Earned: {badge.earned}</div>
                  <div className="mt-1 truncate text-xs text-white/40">{badge.pact}</div>
                  <button type="button" className="mt-3 inline-flex items-center gap-1 text-xs text-teal" data-cursor="pointer">
                    View on Algorand <ExternalLink className="h-3.5 w-3.5" />
                  </button>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {lockedBadges.map((badge) => (
              <GlassCard key={badge.id} className="relative overflow-hidden p-4 opacity-40 grayscale">
                <div className="absolute inset-0 animate-shimmer" style={{ backgroundImage: 'linear-gradient(110deg, transparent 20%, rgba(255,255,255,0.18) 50%, transparent 80%)', backgroundSize: '200% 100%' }} />
                <div className="relative z-10">
                  <div className="flex h-20 w-20 items-center justify-center rounded-xl border border-white/20 bg-white/5">
                    <Shield className="h-8 w-8 text-white/50" />
                  </div>
                  <div className="mt-3 font-syne text-sm">{badge.name}</div>
                  <div className="mt-1 text-xs text-white/30">{badge.hint}</div>
                </div>
              </GlassCard>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <div className="flex items-center gap-4 border-b border-glass-border">
            {[
              ['all', 'All'],
              ['won', 'Won'],
              ['lost', 'Lost'],
              ['active', 'Active'],
            ].map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveTab(key as TabKey)}
                className={cn(
                  'px-3 py-2 text-sm transition-colors',
                  activeTab === key
                    ? 'border-b-2 border-teal bg-teal/10 text-teal'
                    : 'text-white/40 hover:text-white/70',
                )}
                data-cursor="pointer"
              >
                {label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-4 overflow-x-auto"
            >
              <table className="w-full min-w-[760px] border-separate border-spacing-y-2">
                <thead>
                  <tr className="text-left font-mono text-xs tracking-widest text-white/30">
                    <th className="px-3 py-2">Pact</th>
                    <th className="px-3 py-2">Category</th>
                    <th className="px-3 py-2">Ended</th>
                    <th className="px-3 py-2">Stake</th>
                    <th className="px-3 py-2">Result</th>
                    <th className="px-3 py-2">P&L</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-3 py-5 text-sm text-white/40">
                        No pacts in this tab yet.
                      </td>
                    </tr>
                  ) : (
                    filteredRows.map((row, index) => (
                      <motion.tr
                        key={`${row.pact}-${row.ended}`}
                        initial={{ opacity: 0, y: 6 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.07 }}
                        className={cn(
                          'rounded-xl transition-colors',
                          row.result === 'lost' ? 'hover:bg-danger/10' : 'hover:bg-glass',
                        )}
                      >
                        <td className="rounded-l-xl px-3 py-3 text-sm">{row.pact}</td>
                        <td className="px-3 py-3">
                          <span className={cn('rounded-full border px-2 py-1 text-xs', categoryClass[row.category])}>
                            {row.category}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-sm text-white/50">{row.ended}</td>
                        <td className="px-3 py-3 text-sm">{formatINR(row.stake)}</td>
                        <td className="px-3 py-3">
                          <span
                            className={cn(
                              'rounded-full px-2 py-1 text-xs font-mono tracking-[2px]',
                              row.result === 'won' && 'bg-teal/10 text-teal',
                              row.result === 'lost' && 'bg-danger/10 text-danger',
                              row.result === 'active' && 'bg-gold/10 text-gold',
                            )}
                          >
                            {row.result === 'won' ? 'WON' : row.result === 'lost' ? 'LOST' : 'ACTIVE'}
                          </span>
                        </td>
                        <td className="rounded-r-xl px-3 py-3 text-sm font-semibold">
                          <span className={row.pnl >= 0 ? 'text-teal' : 'text-danger'}>
                            {row.pnl >= 0 ? '+' : '-'}{formatINR(row.pnl)}
                          </span>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </motion.div>
          </AnimatePresence>
        </section>

        <section className="mt-8">
          <GlassCard className="border border-gold/20 p-6">
            <h3 className="font-syne text-lg">What Enterprises See</h3>
            <div className="mt-4 rounded-xl border border-glass-border bg-black/20 p-4 font-mono text-sm">
              <div className="flex justify-between border-b border-glass-border py-2">
                <span className="text-white/50">CommitScore</span>
                <span className="text-teal">847 OK</span>
              </div>
              <div className="flex justify-between border-b border-glass-border py-2">
                <span className="text-white/50">Success Rate</span>
                <span className="text-teal">93.3% OK</span>
              </div>
              <div className="flex justify-between border-b border-glass-border py-2">
                <span className="text-white/50">Active Categories</span>
                <span className="text-white">Corporate, Education</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-white/50">Recommended Limit</span>
                <span className="text-gold">INR 50,000</span>
              </div>
            </div>
            <div className="mt-4 inline-flex rounded-full bg-teal/10 px-3 py-1 text-sm font-mono tracking-[2px] text-teal">
              ELIGIBLE FOR ENTERPRISE PACTS
            </div>
          </GlassCard>

          <GlassCard className="mt-6 p-6">
            <h3 className="font-syne text-lg">Share Your CommitScore</h3>
            <GlassCard className="mt-4 border border-violet/30 bg-gradient-to-br from-obsidian to-violet/10 p-4">
              <div className="font-syne text-lg">StakePact</div>
              <div className="mt-2 text-sm text-white">Arjun Mehta</div>
              <div className="mt-2 font-syne text-3xl text-teal">847</div>
              <div className="text-xs text-white/40">Verified on Algorand</div>
            </GlassCard>

            <div className="mt-4 flex flex-wrap gap-3">
              <MagneticButton variant="ghost" className="px-3 py-2 text-xs">
                Copy Link
              </MagneticButton>
              <MagneticButton variant="ghost" className="px-3 py-2 text-xs">
                LinkedIn
              </MagneticButton>
              <MagneticButton variant="ghost" className="px-3 py-2 text-xs">
                Download Card
              </MagneticButton>
            </div>
          </GlassCard>
        </section>

        <div className="mt-10 text-center">
          <Link to="/dashboard" className="text-sm text-teal" data-cursor="pointer">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
