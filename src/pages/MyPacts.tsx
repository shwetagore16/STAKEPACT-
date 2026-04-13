import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  Clock,
  Filter,
  Plus,
  Search,
  TrendingUp,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { CountUp } from '../components/ui/CountUp'
import { FlipClock } from '../components/ui/FlipClock'
import { GlassCard } from '../components/ui/GlassCard'
import { MagneticButton } from '../components/ui/MagneticButton'
import { cn } from '../lib/utils'

type TabKey = 'all' | 'active' | 'proof-pending' | 'vote-required' | 'completed' | 'lost'

type ActivePact = {
  id: string
  pactId: string
  category: 'Corporate' | 'Education' | 'Personal'
  title: string
  deadline: Date
  submitted: number
  members: number
  pot: number
  yours: number
  yourStatus: 'submitted' | 'pending' | 'auto'
  voteRequired: boolean
  stripeClass: string
  categoryClass: string
  memberInitials: string[]
}

type CompletedPact = {
  id: string
  title: string
  category: 'Corporate' | 'Education' | 'Personal' | 'Legal'
  ended: string
  stake: number
  result: 'WON' | 'ALL WON' | 'LOST'
  pnl: number
  stripeClass: string
}

const tabItems: Array<{ key: TabKey; label: string }> = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'proof-pending', label: 'Proof Pending' },
  { key: 'vote-required', label: 'Vote Required' },
  { key: 'completed', label: 'Completed' },
  { key: 'lost', label: 'Lost' },
]

const activePacts: ActivePact[] = [
  {
    id: 'a1',
    pactId: 'SPT-4721',
    category: 'Corporate',
    title: 'Deliver Q3 Sales Dashboard',
    deadline: new Date(Date.now() + (2 * 86400 + 14 * 3600) * 1000),
    submitted: 2,
    members: 4,
    pot: 8000,
    yours: 2000,
    yourStatus: 'submitted',
    voteRequired: true,
    stripeClass: 'bg-blue-500',
    categoryClass: 'bg-blue-500/10 border-blue-500/40 text-blue-200',
    memberInitials: ['AM', 'PS', 'RS', 'SP'],
  },
  {
    id: 'a2',
    pactId: 'SPT-5920',
    category: 'Education',
    title: 'Complete DSA Course',
    deadline: new Date(Date.now() + 18 * 3600 * 1000),
    submitted: 1,
    members: 5,
    pot: 5000,
    yours: 1000,
    yourStatus: 'pending',
    voteRequired: false,
    stripeClass: 'bg-teal',
    categoryClass: 'bg-teal/10 border-teal/40 text-teal',
    memberInitials: ['NS', 'MR', 'ZK', 'AM', 'RK'],
  },
  {
    id: 'a3',
    pactId: 'SPT-6104',
    category: 'Personal',
    title: 'Run 30km this month',
    deadline: new Date(Date.now() + (5 * 86400 + 3 * 3600) * 1000),
    submitted: 3,
    members: 3,
    pot: 3000,
    yours: 1000,
    yourStatus: 'auto',
    voteRequired: false,
    stripeClass: 'bg-amber-400',
    categoryClass: 'bg-amber-400/10 border-amber-400/40 text-amber-200',
    memberInitials: ['AM', 'IB', 'DM'],
  },
]

const completedPacts: CompletedPact[] = [
  {
    id: 'c1',
    title: 'Q3 Sales Report',
    category: 'Corporate',
    ended: 'Jul 2024',
    stake: 5000,
    result: 'WON',
    pnl: 2500,
    stripeClass: 'bg-blue-500',
  },
  {
    id: 'c2',
    title: 'DSA Course',
    category: 'Education',
    ended: 'Jun 2024',
    stake: 2000,
    result: 'WON',
    pnl: 500,
    stripeClass: 'bg-teal',
  },
  {
    id: 'c3',
    title: '30km Running',
    category: 'Personal',
    ended: 'Jun 2024',
    stake: 1000,
    result: 'ALL WON',
    pnl: 0,
    stripeClass: 'bg-amber-400',
  },
  {
    id: 'c4',
    title: 'Contract Filing',
    category: 'Legal',
    ended: 'May 2024',
    stake: 1000,
    result: 'LOST',
    pnl: -1000,
    stripeClass: 'bg-danger',
  },
]

export default function MyPacts() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<TabKey>('all')
  const [search, setSearch] = useState('')
  const [completedOpen, setCompletedOpen] = useState(true)

  const query = search.trim().toLowerCase()

  const filteredActive = useMemo(() => {
    return activePacts.filter((pact) => {
      if (query && !pact.title.toLowerCase().includes(query)) return false
      if (activeTab === 'all' || activeTab === 'active') return true
      if (activeTab === 'proof-pending') return pact.yourStatus === 'pending'
      if (activeTab === 'vote-required') return pact.voteRequired
      return false
    })
  }, [activeTab, query])

  const filteredCompleted = useMemo(() => {
    return completedPacts.filter((pact) => {
      if (query && !pact.title.toLowerCase().includes(query)) return false
      if (activeTab === 'all' || activeTab === 'completed') return true
      return false
    })
  }, [activeTab, query])

  const showActiveSection = ['all', 'active', 'proof-pending', 'vote-required'].includes(activeTab)
  const showCompletedSection = ['all', 'completed'].includes(activeTab)
  const showLostSection = ['all', 'lost'].includes(activeTab)

  const lostPactVisible = !query || 'Contract Filing'.toLowerCase().includes(query)

  return (
    <div className="app-page bg-obsidian text-white">
      <div className="app-container max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-syne text-2xl sm:text-3xl">My Pacts</h1>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-white/70 hover:border-white/30"
              data-cursor="pointer"
            >
              <Filter className="h-4 w-4" /> Filter
            </button>
            <MagneticButton variant="gold" className="px-3 py-2 text-sm" onClick={() => navigate('/create')}>
              <Plus className="h-4 w-4" /> New Pact
            </MagneticButton>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <GlassCard className="rounded-full px-4 py-2 text-sm text-teal">3 Active</GlassCard>
          <GlassCard className="rounded-full px-4 py-2 text-sm text-white/60">10 Completed</GlassCard>
          <GlassCard className="rounded-full px-4 py-2 text-sm text-danger">1 Lost</GlassCard>
          <GlassCard className="rounded-full px-4 py-2 text-sm text-gold">
            <CountUp end={8500} prefix="INR " trigger /> at stake
          </GlassCard>
        </div>

        <div className="mt-6 overflow-x-auto pb-1">
          <div className="flex min-w-max gap-2">
            {tabItems.map((tab) => {
              const selected = activeTab === tab.key
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    'relative rounded-lg px-4 py-2 text-sm transition-colors',
                    selected
                      ? 'border border-teal/30 bg-teal/10 text-teal'
                      : 'text-white/40 hover:text-white',
                  )}
                  data-cursor="pointer"
                >
                  {tab.label}
                  {selected ? (
                    <motion.div
                      layoutId="pact-tab-indicator"
                      className="absolute inset-0 rounded-lg border border-teal/30"
                      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                    />
                  ) : null}
                </button>
              )
            })}
          </div>
        </div>

        <div className="mt-4 relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search pacts..."
            className="w-full rounded-xl border border-glass-border bg-glass px-4 py-3 pl-10 text-sm text-white outline-none focus:border-teal/40"
          />
        </div>

        {showActiveSection ? (
          <section className="mt-8">
            <h2 className="mb-4 font-syne text-xl">Active Pacts ({filteredActive.length})</h2>
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {filteredActive.length === 0 ? (
                  <GlassCard className="p-6 text-sm text-white/40">
                    No active pacts match your current filters.
                  </GlassCard>
                ) : null}
                {filteredActive.map((pact, index) => {
                  const progress = pact.members > 0 ? (pact.submitted / pact.members) * 100 : 0
                  const isUrgent = pact.deadline.getTime() - Date.now() < 24 * 3600 * 1000
                  return (
                    <motion.div
                      key={pact.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: index * 0.08 }}
                      className="rounded-2xl"
                      whileHover={{ y: -2 }}
                      {...(isUrgent
                        ? {
                            animate: {
                              boxShadow: [
                                '0 0 0px rgba(255,59,92,0)',
                                '0 0 18px rgba(255,59,92,0.25)',
                                '0 0 0px rgba(255,59,92,0)',
                              ],
                            },
                            transition: { duration: 2.8, repeat: Infinity },
                          }
                        : {})}
                    >
                      <GlassCard className="overflow-hidden p-0 transition-all lg:h-32">
                        <div className={cn('h-1.5 w-full flex-shrink-0 lg:h-full lg:w-1.5', isUrgent ? 'bg-danger' : pact.stripeClass)} />

                        <div className="grid gap-4 p-4 lg:grid-cols-[160px_1fr_auto_144px] lg:items-center lg:gap-6 lg:px-6">
                          <div className="lg:w-40 lg:flex-shrink-0">
                            <span className={cn('rounded-full border px-2 py-1 text-xs font-mono', pact.categoryClass)}>
                              {pact.category}
                            </span>
                            <div className="mt-1 font-mono text-[11px] text-white/20">{pact.pactId}</div>
                            <div className="mt-3 flex -space-x-1.5">
                              {pact.memberInitials.map((initials, avatarIndex) => (
                                <motion.div
                                  key={`${pact.id}-${initials}-${avatarIndex}`}
                                  initial={{ scale: 0.85, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  transition={{ delay: index * 0.08 + avatarIndex * 0.06 }}
                                  className="flex h-6 w-6 items-center justify-center rounded-full border border-glass-border bg-glass text-[9px] text-white/80"
                                >
                                  {initials}
                                </motion.div>
                              ))}
                            </div>
                            <div className="mt-1 text-xs text-white/30">{pact.members} members</div>
                          </div>

                          <div className="flex-1">
                            <h3 className="line-clamp-2 font-syne text-base font-bold leading-snug">{pact.title}</h3>
                            <div className="mt-3 h-1 w-full rounded-full bg-white/10">
                              <motion.div
                                className="h-1 rounded-full bg-gradient-to-r from-teal to-gold"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                              />
                            </div>
                            <div className="mt-1 text-xs text-white/30">
                              {pact.yourStatus === 'auto' ? 'auto-verified' : `${pact.submitted}/${pact.members} submitted`}
                            </div>
                            <div className="mt-2">
                              {pact.yourStatus === 'submitted' ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-teal/10 px-2 py-1 text-xs text-teal">
                                  <CheckCircle className="h-3.5 w-3.5" /> Proof submitted
                                </span>
                              ) : pact.yourStatus === 'pending' ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/10 px-2 py-1 text-xs text-amber-300 animate-pulse">
                                  <Clock className="h-3.5 w-3.5" /> Submit before deadline
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 rounded-full bg-teal/10 px-2 py-1 text-xs text-teal">
                                  <CheckCircle className="h-3.5 w-3.5" /> Auto-verified
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="text-left lg:text-center">
                            <div className="origin-left scale-[0.4] sm:scale-[0.5] lg:origin-center lg:scale-[0.62]">
                              <FlipClock
                                targetDate={pact.deadline}
                                size="sm"
                                urgentAt={isUrgent ? 86400 : 21600}
                              />
                            </div>
                            <div className="-mt-6 font-mono text-[10px] text-white/30 lg:-mt-4">remaining</div>
                          </div>

                          <div className="w-full text-left lg:w-36 lg:flex-shrink-0 lg:text-right">
                            <div className="font-syne text-xl font-bold text-gold">INR {new Intl.NumberFormat('en-IN').format(pact.pot)}</div>
                            <div className="text-[10px] text-white/30">total pot</div>
                            <div className="text-xs text-white/40">INR {new Intl.NumberFormat('en-IN').format(pact.yours)} yours</div>
                            <div className="mt-3 flex justify-start lg:justify-end">
                              <MagneticButton
                                variant={pact.yourStatus === 'pending' ? 'gold' : 'teal'}
                                className="px-3 py-2 text-xs"
                                onClick={() => {
                                  if (pact.yourStatus === 'pending') {
                                    navigate(`/pact/${pact.id}/submit`)
                                  } else {
                                    navigate(`/pact/${pact.id}`)
                                  }
                                }}
                              >
                                {pact.yourStatus === 'pending' ? 'Submit' : 'View'} <ArrowRight className="h-3.5 w-3.5" />
                              </MagneticButton>
                            </div>
                          </div>
                        </div>
                      </GlassCard>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          </section>
        ) : null}

        {showCompletedSection ? (
          <section className="mt-8">
            <button
              type="button"
              className="flex w-full items-center justify-between text-left"
              onClick={() => setCompletedOpen((prev) => !prev)}
              data-cursor="pointer"
            >
              <h2 className="font-syne text-xl">Completed (10)</h2>
              <span className="text-white/50">{completedOpen ? 'v' : '>'}</span>
            </button>

            <AnimatePresence initial={false}>
              {completedOpen ? (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 space-y-3">
                    {filteredCompleted.map((pact, index) => (
                      <motion.div
                        key={pact.id}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.06 }}
                      >
                        <GlassCard className="flex h-auto flex-wrap items-center gap-3 px-4 py-3 lg:h-20 lg:flex-nowrap lg:gap-4">
                          <div className={cn('h-10 w-1 rounded-full', pact.stripeClass)} />
                          <span className="rounded-full border border-white/15 px-2 py-1 text-xs text-white/60">{pact.category}</span>
                          <div className="min-w-0 flex-1 text-sm text-white lg:truncate">{pact.title}</div>
                          <div className="text-xs text-white/30">{pact.ended}</div>
                          <div className="text-sm text-white/70">INR {new Intl.NumberFormat('en-IN').format(pact.stake)}</div>
                          <span
                            className={cn(
                              'rounded-full border px-3 py-1 text-xs',
                              pact.result === 'WON' && 'border-teal/20 bg-teal/10 text-teal',
                              pact.result === 'ALL WON' && 'border-sky-400/20 bg-sky-400/10 text-sky-300',
                              pact.result === 'LOST' && 'border-danger/20 bg-danger/10 text-danger',
                            )}
                          >
                            {pact.result}
                          </span>
                          <div className={cn('font-syne font-bold', pact.pnl >= 0 ? 'text-teal' : 'text-danger')}>
                            {pact.pnl >= 0 ? '+' : '-'}INR {new Intl.NumberFormat('en-IN').format(Math.abs(pact.pnl))}
                          </div>
                        </GlassCard>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </section>
        ) : null}

        {showLostSection && lostPactVisible ? (
          <section className="mt-8">
            <h2 className="font-syne text-xl">Lost (1)</h2>
            <GlassCard className="mt-4 rounded-l-none border-l-4 border-danger bg-danger/5 p-5">
              <div className="inline-flex items-center gap-1 rounded-full bg-danger/10 px-2 py-1 text-xs text-danger">
                <AlertTriangle className="h-3.5 w-3.5" /> Missed deadline by 2 hours
              </div>
              <h3 className="mt-3 font-syne text-lg">Contract Filing</h3>
              <div className="mt-1 text-sm text-white/50">Legal</div>
              <div className="mt-3 font-syne text-xl font-bold text-danger">Amount lost: -INR 1,000</div>
              <div className="mt-1 text-xs text-white/40">This cost you 15 CommitScore points</div>
              <div className="mt-4 flex items-center justify-between gap-3">
                <span className="text-sm text-teal">Create a new pact to rebuild your score</span>
                <MagneticButton variant="gold" className="px-3 py-2 text-xs" onClick={() => navigate('/create')}>
                  Create Pact
                </MagneticButton>
              </div>
            </GlassCard>
          </section>
        ) : null}

        <GlassCard className="mt-8 flex flex-wrap gap-6 border border-gold/10 p-6 text-sm">
          <div className="text-white/70">Best category: Education (100%)</div>
          <div className="text-white/70">Needs work: Corporate (80%)</div>
          <div className="inline-flex items-center gap-1 text-teal">
            <TrendingUp className="h-4 w-4" /> Recommended: Create a Personal pact
          </div>
        </GlassCard>

        <div className="mt-8">
          <Link to="/dashboard" className="text-sm text-teal" data-cursor="pointer">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
