import { useMemo, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  ArrowUpRight,
  Bell,
  ChevronRight,
  Search,
  Shield,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { CountUp } from '../components/ui/CountUp'
import { FlipClock } from '../components/ui/FlipClock'
import { GlassCard } from '../components/ui/GlassCard'
import { MagneticButton } from '../components/ui/MagneticButton'
import { usePactStore } from '../store/usePactStore'
import { cn } from '../lib/utils'

type PactCard = {
  id: string
  category: string
  stripClass: string
  badgeClass: string
  title: string
  members: number
  submitted: number
  totalStake: number
  deadline: Date
  urgent?: boolean
  status: 'pending' | 'submitted' | 'auto'
}

const activityItems = [
  {
    type: 'success',
    text: 'Rahul submitted proof',
    time: '2h ago',
  },
  {
    type: 'vote',
    text: 'Vote required: Meena',
    time: '3h ago',
  },
  {
    type: 'warning',
    text: 'Deadline in 6h: Q3 Report',
    time: 'NOW',
  },
  {
    type: 'reward',
    text: 'You earned INR 2,500',
    time: '1d ago',
  },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const { pacts, user } = usePactStore()
  const activePactsCount = pacts.filter((pact) => pact.status === 'active').length

  const formattedDate = useMemo(() => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date())
  }, [])

  const metricsRef = useRef<HTMLDivElement | null>(null)
  const metricsInView = useInView(metricsRef, { amount: 0.3, once: true })

  const sparklinePath = 'M4 22 L18 16 L30 20 L46 10 L64 12'

  const commitScore = user.score || 847
  const gaugeRadius = 32
  const gaugeCircumference = 2 * Math.PI * gaugeRadius
  const gaugeOffset = gaugeCircumference * (1 - commitScore / 1000)

  const pactsData: PactCard[] = [
    {
      id: 'SPT-4721',
      category: 'Corporate',
      stripClass: 'bg-blue-500',
      badgeClass: 'bg-blue-500/10 border-blue-500/40 text-blue-200',
      title: 'Deliver Q3 Sales Dashboard',
      members: 4,
      submitted: 2,
      totalStake: 8000,
      deadline: new Date(Date.now() + 1000 * 60 * 60 * 62),
      status: 'pending',
    },
    {
      id: 'SPT-5920',
      category: 'Education',
      stripClass: 'bg-teal',
      badgeClass: 'bg-teal/10 border-teal/40 text-teal',
      title: 'Complete DSA Course',
      members: 5,
      submitted: 1,
      totalStake: 5000,
      deadline: new Date(Date.now() + 1000 * 60 * 60 * 18),
      urgent: true,
      status: 'pending',
    },
    {
      id: 'SPT-6104',
      category: 'Personal',
      stripClass: 'bg-amber-400',
      badgeClass: 'bg-amber-400/10 border-amber-400/40 text-amber-200',
      title: 'Run 30km this month',
      members: 3,
      submitted: 3,
      totalStake: 3000,
      deadline: new Date(Date.now() + 1000 * 60 * 60 * 123),
      status: 'submitted',
    },
  ]

  const metricCards = [
    {
      label: 'Active Pacts',
      value: activePactsCount,
      icon: TrendingUp,
      accent: 'text-teal',
      footer: '+1 since last week',
      footerClass: 'text-emerald-400',
    },
    {
      label: 'Total Staked',
      value: 24500,
      icon: Wallet,
      accent: 'text-gold',
      footer: 'INR 8,500 this month',
      footerClass: 'text-white/40',
      prefix: 'INR ',
    },
    {
      label: 'CommitScore',
      value: commitScore,
      icon: Shield,
      accent: 'text-violet',
      footer: 'Grade: A+',
      footerClass: 'text-violet',
      suffix: '/1000',
    },
    {
      label: 'Votes Pending',
      value: 3,
      icon: Users,
      accent: 'text-amber-400',
      footer: '2 expiring today',
      footerClass: 'text-amber-400',
    },
  ]

  return (
    <div className="min-h-screen bg-obsidian p-8 text-white">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="font-syne text-2xl font-bold">Good morning, Arjun</p>
            <p className="text-sm text-white/30">{formattedDate}</p>
          </div>

          <div className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="Search pacts, categories..."
              className="w-full rounded-xl border border-glass-border bg-glass px-4 py-2 pl-10 text-sm text-white/70 outline-none transition-colors focus:border-teal/50"
            />
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              className="relative text-white/50 transition-colors hover:text-white"
              data-cursor="pointer"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -right-2 -top-2 rounded-full bg-danger px-1.5 text-[10px] text-white">
                3
              </span>
            </button>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs text-white/70">
              AM
            </div>
          </div>
        </div>

        <motion.div
          ref={metricsRef}
          className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4"
          initial="hidden"
          animate={metricsInView ? 'show' : 'hidden'}
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.08 },
            },
          }}
        >
          {metricCards.map((card) => {
            const Icon = card.icon
            return (
              <motion.div
                key={card.label}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                }}
              >
                <GlassCard className="p-5" glowColor="teal">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm text-white/40">
                      {card.label === 'Votes Pending' ? (
                        <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                      ) : null}
                      {card.label}
                    </span>
                    <Icon className={cn('h-4 w-4', card.accent)} />
                  </div>
                  <div className="mt-4 font-syne text-5xl font-bold text-white">
                    <CountUp
                      end={card.value}
                      prefix={card.prefix}
                      suffix={card.suffix}
                    />
                  </div>
                  {card.label === 'Active Pacts' ? (
                    <div className="mt-4">
                      <svg width="70" height="24" viewBox="0 0 70 24">
                        <motion.path
                          d={sparklinePath}
                          stroke="#00FFD1"
                          strokeWidth="2"
                          fill="none"
                          initial={{ pathLength: 0 }}
                          animate={metricsInView ? { pathLength: 1 } : { pathLength: 0 }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                        />
                      </svg>
                      <p className="mt-2 text-xs text-emerald-400">+1 since last week</p>
                    </div>
                  ) : card.label === 'CommitScore' ? (
                    <div className="mt-4 flex items-center gap-4">
                      <svg width="80" height="80" viewBox="0 0 80 80">
                        <circle
                          cx="40"
                          cy="40"
                          r={gaugeRadius}
                          stroke="rgba(138,90,255,0.2)"
                          strokeWidth="6"
                          fill="none"
                        />
                        <motion.circle
                          cx="40"
                          cy="40"
                          r={gaugeRadius}
                          stroke="#8A5AFF"
                          strokeWidth="6"
                          fill="none"
                          strokeLinecap="round"
                          strokeDasharray={gaugeCircumference}
                          strokeDashoffset={gaugeCircumference}
                          initial={{ strokeDashoffset: gaugeCircumference }}
                          animate={metricsInView ? { strokeDashoffset: gaugeOffset } : {}}
                          transition={{ duration: 1.2, ease: 'easeOut' }}
                          transform="rotate(-90 40 40)"
                        />
                      </svg>
                      <div>
                        <div className="text-sm text-violet">Grade: A+</div>
                        <div className="text-xs text-white/40">Top 12%</div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 flex items-center gap-2 text-xs">
                      {card.label === 'Votes Pending' ? (
                        <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                      ) : null}
                      <span className={cn('text-xs', card.footerClass)}>{card.footer}</span>
                    </div>
                  )}
                </GlassCard>
              </motion.div>
            )
          })}
        </motion.div>

        <div className="mt-10 flex items-center justify-between">
          <h2 className="font-syne text-xl">Active Pacts</h2>
          <Link
            to="/pacts"
            className="flex items-center gap-1 text-sm text-teal"
            data-cursor="pointer"
          >
            View All <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-4 space-y-4">
            {pactsData.map((pact, index) => {
              const progress = Math.min(1, pact.submitted / pact.members)
              const formattedStake = new Intl.NumberFormat('en-IN').format(
                pact.totalStake,
              )

            return (
              <motion.div
                key={pact.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="rounded-2xl"
                {...(pact.urgent
                  ? {
                      animate: {
                        boxShadow: [
                          '0 0 0px rgba(255,59,92,0)',
                          '0 0 20px rgba(255,59,92,0.25)',
                          '0 0 0px rgba(255,59,92,0)',
                        ],
                      },
                      transition: { duration: 3, repeat: Infinity },
                    }
                  : {})}
              >
                <GlassCard className="p-5">
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
                    <div className="flex items-start gap-4">
                      <div className={cn('h-full w-1 rounded-full', pact.stripClass)} />
                      <div className="min-w-[140px]">
                        <span
                          className={cn(
                            'inline-flex rounded-full border px-3 py-1 text-xs',
                            pact.badgeClass,
                          )}
                        >
                          {pact.category}
                        </span>
                        <div className="mt-2 font-mono text-[11px] text-white/30">{pact.id}</div>
                        <div className="mt-3 flex -space-x-2">
                          {Array.from({ length: pact.members }).map((_, memberIndex) => (
                            <div
                              key={`${pact.id}-member-${memberIndex}`}
                              className="flex h-7 w-7 items-center justify-center rounded-full border border-obsidian bg-white/10 text-[9px] text-white/60"
                            >
                              {`M${memberIndex + 1}`}
                            </div>
                          ))}
                        </div>
                        <div className="mt-1 text-xs text-white/40">
                          {pact.members} members
                        </div>
                      </div>
                    </div>

                    <div className="flex-1">
                      <h3 className="font-syne text-base font-bold text-white truncate">
                        {pact.title}
                      </h3>
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs text-white/40">
                          <span>
                            {pact.submitted}/{pact.members} submitted
                          </span>
                          <span>{Math.round(progress * 100)}%</span>
                        </div>
                        <div className="mt-2 h-1 rounded-full bg-white/10">
                          <div
                            className="h-full rounded-full bg-teal"
                            style={{ width: `${progress * 100}%` }}
                          />
                        </div>
                        <div className="mt-2 text-xs text-white/40">
                          {pact.submitted} of {pact.members} proof submitted
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-center">
                      <FlipClock targetDate={pact.deadline} size="sm" />
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      <div className="text-right">
                        <div className="font-syne text-lg text-gold">
                          INR {formattedStake}
                        </div>
                        <div className="text-xs text-white/30">Total Pot</div>
                      </div>
                      <MagneticButton
                        variant={pact.status === 'submitted' ? 'teal' : 'gold'}
                        onClick={() => navigate('/pact/' + pact.id)}
                      >
                        {pact.status === 'submitted' ? 'View' : 'Submit Proof'}
                        <ArrowUpRight className="h-4 w-4" />
                      </MagneticButton>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            )
          })}
        </div>

        <div className="mt-8 flex flex-col gap-6 lg:flex-row">
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-syne text-lg">Discover Categories</h3>
              <MagneticButton variant="ghost" onClick={() => navigate('/categories')}>
                See all <ChevronRight className="h-4 w-4" />
              </MagneticButton>
            </div>
            <div className="mt-4 flex gap-4 overflow-x-auto pb-2">
              {[
                {
                  label: 'Government',
                  glow: 'violet',
                  icon: Shield,
                  active: 118,
                  hover: 'hover:border-violet/60 hover:shadow-[0_0_30px_rgba(138,90,255,0.2)]',
                },
                {
                  label: 'Corporate',
                  glow: 'teal',
                  icon: Users,
                  active: 2341,
                  hover: 'hover:border-sky-400/60 hover:shadow-[0_0_30px_rgba(56,189,248,0.2)]',
                },
                {
                  label: 'Legal',
                  glow: 'danger',
                  icon: Shield,
                  active: 420,
                  hover: 'hover:border-danger/60 hover:shadow-[0_0_30px_rgba(255,59,92,0.2)]',
                },
                {
                  label: 'Education',
                  glow: 'teal',
                  icon: TrendingUp,
                  active: 1560,
                  hover: 'hover:border-teal/60 hover:shadow-teal-glow',
                },
                {
                  label: 'Personal',
                  glow: 'gold',
                  icon: Wallet,
                  active: 612,
                  hover: 'hover:border-gold/60 hover:shadow-gold-glow',
                },
              ].map((category) => {
                const Icon = category.icon
                return (
                <GlassCard
                  key={category.label}
                  tilt
                  glowColor={category.glow as 'teal' | 'gold' | 'violet' | 'danger'}
                  className={cn('w-44 shrink-0 p-4', category.hover)}
                >
                  <Icon className="h-6 w-6 text-white/70" />
                  <div className="mt-3 font-syne text-base text-white">{category.label}</div>
                  <div className="mt-1 text-xs text-white/40">
                    {category.active} active pacts
                  </div>
                </GlassCard>
                )
              })}
            </div>
          </div>

          <div className="w-full lg:w-72">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-teal animate-pulse" />
              <h3 className="font-syne text-sm">Live Feed</h3>
            </div>
            <motion.div
              className="mt-4 space-y-4"
              initial="hidden"
              animate="show"
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: { staggerChildren: 0.08 },
                },
              }}
            >
              {activityItems.map((item) => (
                <motion.div
                  key={item.text}
                  variants={{
                    hidden: { opacity: 0, x: 20 },
                    show: { opacity: 1, x: 0, transition: { duration: 0.4 } },
                  }}
                  className="flex gap-3"
                >
                  <div className="flex flex-col items-center">
                    <span
                      className={cn(
                        'h-2 w-2 rounded-full',
                        item.type === 'success' && 'bg-teal',
                        item.type === 'reward' && 'bg-gold',
                        item.type === 'vote' && 'bg-violet',
                        item.type === 'warning' && 'bg-danger animate-pulse',
                      )}
                    />
                    <span className="mt-1 h-full w-px bg-glass-border" />
                  </div>
                  <div>
                    <p className="text-sm text-white/70">{item.text}</p>
                    <p className="text-xs text-white/30">{item.time}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
    </div>
  )
}
