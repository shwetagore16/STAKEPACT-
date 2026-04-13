import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowRight,
  Bot,
  Briefcase,
  Building2,
  Dumbbell,
  GraduationCap,
  Lock,
  Scale,
  Shield,
  Sparkles,
  Users,
  Zap,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { GlassCard } from '../components/ui/GlassCard'
import { MagneticButton } from '../components/ui/MagneticButton'
import { CountUp } from '../components/ui/CountUp'
import { ScrambleText } from '../components/ui/ScrambleText'

type CategoryKey =
  | 'government'
  | 'corporate'
  | 'legal'
  | 'education'
  | 'personal'

const searchMeta: Record<CategoryKey, string[]> = {
  government: [
    'government',
    'public sector',
    'election filings',
    'rti compliance',
    'tender submissions',
    'official portal api',
    'document hash',
  ],
  corporate: [
    'corporate',
    'b2b',
    'startup',
    'client mvp delivery',
    'vendor sla enforcement',
    'invoice upload',
    'github release',
    'delivery confirmation',
  ],
  legal: [
    'legal',
    'compliance',
    'lawyer verifier',
    'designated verifier',
    'on-chain verifier',
  ],
  education: [
    'education',
    'study circle',
    'exam deadline',
    'coursera',
    'google classroom',
    'notion submit',
  ],
  personal: [
    'personal goals',
    'strava',
    'duolingo',
    'github',
    'headspace',
    'run',
    'read books',
    'side project',
  ],
}

const categoryOrder: CategoryKey[] = [
  'government',
  'corporate',
  'legal',
  'education',
  'personal',
]

function entryDelay(key: CategoryKey, visible: CategoryKey[]) {
  const index = visible.indexOf(key)
  return index === -1 ? 0 : index * 0.1
}

export default function Categories() {
  const [query, setQuery] = useState('')
  const [showAiDemo, setShowAiDemo] = useState(false)

  const visibleCards = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return categoryOrder

    return categoryOrder.filter((key) =>
      searchMeta[key].some((item) => item.toLowerCase().includes(term)),
    )
  }, [query])

  const show = (key: CategoryKey) => visibleCards.includes(key)

  return (
    <div className="app-page bg-obsidian text-white">
      <div className="app-container max-w-7xl">
        <section className="py-20 text-center">
          <p className="font-mono text-[11px] tracking-[4px] text-teal">CHOOSE YOUR ARENA</p>
          <h1 className="mt-4 font-syne text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            <ScrambleText text="Built for Every Industry" />
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-white/40 sm:text-lg">
            Stake INR against your deadlines. Blockchain enforces it. No courts,
            no arguments, no excuses.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-5 text-left sm:gap-12">
            <div>
              <p className="font-syne text-2xl text-white sm:text-3xl">
                <CountUp end={47} />
              </p>
              <p className="text-xs uppercase tracking-[1.8px] text-white/45">Categories</p>
            </div>
            <div>
              <p className="font-syne text-2xl text-white sm:text-3xl">
                <CountUp end={12847} />
              </p>
              <p className="text-xs uppercase tracking-[1.8px] text-white/45">Active Pacts</p>
            </div>
            <div>
              <p className="font-syne text-2xl text-white sm:text-3xl">
                <CountUp end={4.2} decimals={1} prefix="₹" suffix=" Cr" />
              </p>
              <p className="text-xs uppercase tracking-[1.8px] text-white/45">Staked</p>
            </div>
          </div>

          <div className="mx-auto mt-8 max-w-md">
            <GlassCard className="rounded-full border-white/15 bg-white/[0.03] px-5 py-3" glowColor="teal">
              <div className="flex items-center gap-3">
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 text-white/35"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="M20 20L16.65 16.65" />
                </svg>
                <input
                  type="text"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search categories..."
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35"
                />
              </div>
            </GlassCard>
          </div>

          <Link
            to="/create"
            className="mt-5 inline-flex items-center gap-2 text-sm text-teal/80 transition-colors hover:text-teal"
          >
            Go straight to template builder
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>

        <section>
          <div className="grid grid-cols-12 gap-4">
            <AnimatePresence mode="popLayout">
              {show('government') ? (
                <motion.div
                  key="government"
                  className="col-span-12"
                  initial={{ opacity: 0, scale: 0.97, y: 24 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.5, delay: entryDelay('government', visibleCards) }}
                  layout
                >
                  <GlassCard
                    glowColor="violet"
                    tilt
                    className="relative overflow-hidden border-violet/20 p-0"
                  >
                    <motion.div
                      aria-hidden="true"
                      className="pointer-events-none absolute right-8 bottom-8 text-violet"
                      animate={{ opacity: [0.02, 0.06, 0.02] }}
                      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <Building2 className="h-40 w-40 sm:h-52 sm:w-52 lg:h-64 lg:w-64" />
                    </motion.div>

                    <div className="grid gap-8 p-6 lg:grid-cols-5 lg:p-10">
                      <div className="lg:col-span-3">
                        <span className="inline-flex rounded-full border border-violet/30 bg-violet/10 px-3 py-1 font-mono text-[10px] tracking-[1.4px] text-violet">
                          GOVERNMENT & PUBLIC SECTOR
                        </span>
                        <Building2 className="mt-5 h-8 w-8 text-violet" />
                        <h2 className="mt-3 font-syne text-2xl font-bold sm:text-3xl">Public-Sector Accountability Pacts</h2>
                        <p className="mt-2 text-base text-white/50 sm:text-lg">
                          Structured compliance pacts with official verifiers and
                          ledger-backed proof trails.
                        </p>

                        <div className="mt-6 space-y-3">
                          {[
                            'Election Commission: parties file financial disclosure on time and stake is returned.',
                            'RTI compliance: departments respond before deadline and avoid stake burn.',
                            'Tender submissions: bidders submit mandatory docs before close-of-window.',
                          ].map((item) => (
                            <div key={item} className="flex items-start gap-3">
                              <div className="mt-1.5 h-2 w-2 rotate-45 rounded-[2px] bg-violet" />
                              <p className="text-sm text-white/60">{item}</p>
                            </div>
                          ))}
                        </div>

                        <p className="mt-4 text-sm text-white/30">Coming Soon | 0 active pacts</p>

                        <MagneticButton
                          variant="ghost"
                          className="mt-6 border-violet/30 text-violet hover:border-violet/60 hover:bg-violet/10"
                        >
                          Join Waitlist
                          <ArrowRight className="h-4 w-4" />
                        </MagneticButton>
                      </div>

                      <div className="relative lg:col-span-2">
                        <div className="relative h-full overflow-hidden rounded-2xl border border-gold/20 bg-white/[0.02] px-5 py-6 text-center">
                          <motion.div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0"
                            style={{
                              background:
                                'linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent)',
                              backgroundSize: '200% 100%',
                            }}
                            animate={{ backgroundPosition: ['200% 0%', '-200% 0%'] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                          />

                          <div className="relative z-10">
                            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-semibold text-gold">
                              <Lock className="h-3.5 w-3.5" />
                              ENTERPRISE ONLY
                            </div>
                            <p className="mt-8 font-syne text-xl text-white/20">COMING SOON</p>

                            <GlassCard className="mt-8 border-white/10 bg-white/[0.02] p-4 text-left" glowColor="gold">
                              <p className="text-sm text-white/70">
                                Verification: Official portal API + Document hash
                              </p>
                              <p className="mt-2 text-xs text-white/45">
                                Verifier: Government official wallet
                              </p>
                            </GlassCard>
                          </div>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ) : null}

              {show('corporate') ? (
                <motion.div
                  key="corporate"
                  className="col-span-12 lg:col-span-6"
                  initial={{ opacity: 0, scale: 0.97, y: 24 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.5, delay: entryDelay('corporate', visibleCards) }}
                  layout
                >
                  <GlassCard
                    tilt
                    glowColor="teal"
                    className="relative h-full overflow-hidden border-blue-500/20 p-8 hover:border-blue-400/40 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)]"
                  >
                    <motion.div
                      aria-hidden="true"
                      className="pointer-events-none absolute right-4 bottom-4 text-blue-400"
                      animate={{ opacity: [0.02, 0.06, 0.02] }}
                      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <Briefcase className="h-32 w-32 sm:h-40 sm:w-40" />
                    </motion.div>

                    <Briefcase className="h-7 w-7 text-blue-400" />
                    <span className="mt-3 inline-flex rounded-full border border-blue-400/30 bg-blue-400/10 px-3 py-1 font-mono text-[10px] tracking-[1.4px] text-blue-300">
                      CORPORATE & B2B
                    </span>
                    <h3 className="mt-4 font-syne text-2xl font-bold">Commercial Delivery Pacts</h3>
                    <p className="mt-2 text-white/50">For startup teams, agencies, and enterprise workflows.</p>

                    <p className="mt-5 font-syne text-3xl text-blue-300">
                      <CountUp end={2341} />
                      <span className="ml-2 text-base text-white/60">active pacts</span>
                    </p>
                    <p className="text-sm text-white/30">Most used by startups</p>

                    <div className="mt-5 space-y-2 text-sm text-white/65">
                      <p>Startup to Client MVP delivery</p>
                      <p>Vendor SLA enforcement</p>
                    </div>

                    <p className="mt-5 text-xs text-white/45">
                      Verification: Invoice upload | GitHub release | Delivery confirmation
                    </p>

                    <div className="mt-6 flex flex-wrap items-center gap-3">
                      <MagneticButton variant="gold">
                        Create Corporate Pact
                        <ArrowRight className="h-4 w-4" />
                      </MagneticButton>
                      <Link to="/pacts" className="text-sm text-blue-200/80 transition-colors hover:text-blue-200">
                        View examples
                      </Link>
                    </div>
                  </GlassCard>
                </motion.div>
              ) : null}

              {show('legal') ? (
                <motion.div
                  key="legal"
                  className="col-span-12 lg:col-span-6"
                  initial={{ opacity: 0, scale: 0.97, y: 24 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.5, delay: entryDelay('legal', visibleCards) }}
                  layout
                >
                  <GlassCard
                    tilt
                    glowColor="danger"
                    className="relative h-full border-red-500/20 p-8 hover:border-red-400/45 hover:shadow-[0_0_30px_rgba(248,113,113,0.12)]"
                  >
                    <motion.div
                      aria-hidden="true"
                      className="pointer-events-none absolute right-4 bottom-4 text-red-400"
                      animate={{ opacity: [0.02, 0.06, 0.02] }}
                      transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <Scale className="h-32 w-32 sm:h-40 sm:w-40" />
                    </motion.div>

                    <Scale className="h-7 w-7 text-red-400" />
                    <span className="mt-3 inline-flex rounded-full border border-red-400/30 bg-red-400/10 px-3 py-1 font-mono text-[10px] tracking-[1.4px] text-red-300">
                      LEGAL & COMPLIANCE
                    </span>
                    <h3 className="mt-4 font-syne text-2xl font-bold">Litigation-Proof Commitments</h3>
                    <p className="mt-2 text-white/50">Contractual intent plus programmable enforcement for legal timelines.</p>

                    <p className="mt-5 font-syne text-3xl text-red-300">
                      <CountUp end={847} />
                      <span className="ml-2 text-base text-white/60">active pacts</span>
                    </p>

                    <GlassCard className="mt-5 border-red-500/20 bg-red-500/5 p-4" glowColor="danger">
                      <p className="font-medium text-red-200">Designated Verifier System</p>
                      <p className="mt-2 text-sm text-white/65">
                        Your lawyer signs off as an on-chain verifier. Zero trust
                        required. Blockchain enforces it.
                      </p>
                    </GlassCard>

                    <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-red-400/30 px-3 py-1 text-xs text-red-200">
                      <Lock className="h-3.5 w-3.5" />
                      Requires Verified Verifier
                    </div>

                    <div className="mt-6 flex flex-wrap items-center gap-3">
                      <MagneticButton
                        variant="ghost"
                        className="border-red-400/30 text-red-200 hover:border-red-300/60 hover:bg-red-500/10"
                      >
                        Setup Legal Pact
                        <ArrowRight className="h-4 w-4" />
                      </MagneticButton>
                      <Link to="/create" className="text-sm text-red-200/80 transition-colors hover:text-red-200">
                        Invite verifier
                      </Link>
                    </div>
                  </GlassCard>
                </motion.div>
              ) : null}

              {show('education') ? (
                <motion.div
                  key="education"
                  className="col-span-12 lg:col-span-7"
                  initial={{ opacity: 0, scale: 0.97, y: 24 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.5, delay: entryDelay('education', visibleCards) }}
                  layout
                >
                  <GlassCard tilt glowColor="teal" className="relative h-full border-teal/20 p-8">
                    <motion.div
                      aria-hidden="true"
                      className="pointer-events-none absolute right-4 bottom-4 text-teal"
                      animate={{ opacity: [0.02, 0.06, 0.02] }}
                      transition={{ duration: 5.8, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <GraduationCap className="h-32 w-32 sm:h-40 sm:w-40" />
                    </motion.div>

                    <span className="absolute top-4 right-4 rounded-full bg-teal px-3 py-1 text-xs font-semibold text-obsidian">
                      MOST POPULAR
                    </span>
                    <GraduationCap className="h-7 w-7 text-teal" />
                    <span className="mt-3 inline-flex rounded-full border border-teal/30 bg-teal/10 px-3 py-1 font-mono text-[10px] tracking-[1.4px] text-teal">
                      EDUCATION
                    </span>
                    <h3 className="mt-4 font-syne text-2xl font-bold">Study Circle Deadlines</h3>
                    <p className="mt-2 text-white/50">Perfect for cohorts, exam prep squads, and bootcamp accountability circles.</p>

                    <p className="mt-5 font-syne text-3xl text-teal">
                      <CountUp end={8204} />
                      <span className="ml-2 text-base text-white/60">active pacts</span>
                    </p>

                    <GlassCard className="mt-5 border-teal/20 bg-teal/5 p-4" glowColor="teal">
                      <p className="text-sm text-white/70">Study Circle Preview</p>
                      <div className="mt-3 flex items-center gap-1.5">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <div key={`avatar-${index}`} className="flex items-center gap-1.5">
                            <motion.div
                              className="h-7 w-7 rounded-full border border-teal/40 bg-teal/10"
                              animate={{ y: [0, -3, 0] }}
                              transition={{
                                duration: 1.8,
                                repeat: Infinity,
                                delay: index * 0.1,
                                ease: 'easeInOut',
                              }}
                            />
                            {index < 4 ? <div className="h-px w-4 bg-teal/30" /> : null}
                          </div>
                        ))}
                      </div>
                      <p className="mt-3 text-sm text-white/65">You + 4 friends | Same exam deadline | INR 1,000 each</p>
                      <span className="mt-3 inline-flex rounded-full border border-teal/30 bg-teal/10 px-3 py-1 text-xs text-teal">
                        Exam in: 3 days
                      </span>
                    </GlassCard>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {['GitHub', 'Coursera', 'Google Classroom', 'Notion submit'].map((item) => (
                        <span
                          key={item}
                          className="inline-flex items-center gap-1 rounded-full border border-teal/30 bg-teal/10 px-2.5 py-1 text-xs text-teal"
                        >
                          <Sparkles className="h-3 w-3" />
                          {item}
                        </span>
                      ))}
                    </div>

                    <div className="mt-6 flex flex-wrap items-center gap-3">
                      <MagneticButton variant="gold">
                        Start a Study Circle
                        <ArrowRight className="h-4 w-4" />
                      </MagneticButton>
                      <Link to="/create" className="text-sm text-teal/80 transition-colors hover:text-teal">
                        Clone template
                      </Link>
                    </div>
                  </GlassCard>
                </motion.div>
              ) : null}

              {show('personal') ? (
                <motion.div
                  key="personal"
                  className="col-span-12 lg:col-span-5"
                  initial={{ opacity: 0, scale: 0.97, y: 24 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.5, delay: entryDelay('personal', visibleCards) }}
                  layout
                >
                  <GlassCard
                    tilt
                    glowColor="gold"
                    className="h-full border-amber-400/20 p-8 hover:border-amber-300/45 hover:shadow-[0_0_30px_rgba(251,191,36,0.12)]"
                  >
                    <motion.div
                      aria-hidden="true"
                      className="pointer-events-none absolute right-5 bottom-5 text-amber-400"
                      animate={{ opacity: [0.02, 0.06, 0.02] }}
                      transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <Dumbbell className="h-24 w-24" />
                    </motion.div>

                    <Dumbbell className="h-7 w-7 text-amber-400" />
                    <span className="mt-3 inline-flex rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 font-mono text-[10px] tracking-[1.4px] text-amber-300">
                      PERSONAL GOALS
                    </span>
                    <h3 className="mt-4 font-syne text-2xl font-bold">Self-Discipline Pacts</h3>
                    <p className="mt-2 text-white/50">Turn intentions into enforceable outcomes for fitness, learning, and creation.</p>

                    <p className="mt-5 font-syne text-3xl text-amber-300">
                      <CountUp end={1455} />
                      <span className="ml-2 text-base text-white/60">active pacts</span>
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {['Strava', 'Duolingo', 'GitHub', 'Headspace'].map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-amber-300/25 bg-amber-300/5 px-3 py-1 text-xs text-amber-100/90"
                        >
                          {item}
                        </span>
                      ))}
                    </div>

                    <div className="mt-5 space-y-2 text-sm text-white/70">
                      <p>Run 30km this month</p>
                      <p>Read 4 books by December</p>
                      <p>Ship side project by Sunday</p>
                    </div>

                    <div className="mt-6 flex flex-wrap items-center gap-3">
                      <MagneticButton
                        variant="ghost"
                        className="border-amber-300/30 text-amber-200 hover:border-amber-200/60 hover:bg-amber-400/10"
                      >
                        Set Personal Goal
                        <ArrowRight className="h-4 w-4" />
                      </MagneticButton>
                      <Link to="/create" className="text-sm text-amber-100/70 transition-colors hover:text-amber-100">
                        Quick start
                      </Link>
                    </div>
                  </GlassCard>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

          {visibleCards.length === 0 ? (
            <GlassCard className="mt-5 border-white/10 p-8 text-center" glowColor="gold">
              <p className="font-syne text-xl">No matching categories found</p>
              <p className="mt-2 text-sm text-white/50">
                Try searching for education, legal, startup, or personal goals.
              </p>
            </GlassCard>
          ) : null}
        </section>

        <section className="mt-24">
          <h2 className="text-center font-syne text-3xl">How Proof Gets Verified</h2>

          <div className="relative mx-auto mt-10 max-w-4xl pb-2">
            <motion.svg
              className="pointer-events-none absolute inset-0 hidden h-full w-full md:block"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
            >
              <motion.path
                d="M50 17 C50 24, 50 26, 50 33"
                stroke="rgba(95, 251, 241, 0.35)"
                strokeWidth="0.6"
                fill="none"
                strokeDasharray="1 1"
                variants={{ hidden: { pathLength: 0 }, show: { pathLength: 1 } }}
                transition={{ duration: 0.6 }}
              />
              <motion.path
                d="M50 40 C50 46, 50 48, 50 55"
                stroke="rgba(138, 90, 255, 0.35)"
                strokeWidth="0.6"
                fill="none"
                strokeDasharray="1 1"
                variants={{ hidden: { pathLength: 0 }, show: { pathLength: 1 } }}
                transition={{ duration: 0.6, delay: 0.2 }}
              />
              <motion.path
                d="M50 62 C50 68, 50 70, 50 77"
                stroke="rgba(255, 213, 128, 0.35)"
                strokeWidth="0.6"
                fill="none"
                strokeDasharray="1 1"
                variants={{ hidden: { pathLength: 0 }, show: { pathLength: 1 } }}
                transition={{ duration: 0.6, delay: 0.4 }}
              />
            </motion.svg>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.45 }}
            >
              <GlassCard className="mx-auto max-w-sm border-teal/30 p-6" glowColor="teal">
                <div className="flex items-center gap-2 text-teal">
                  <Zap className="h-5 w-5" />
                  <p className="font-syne text-lg">Tier 1: Automated Oracles</p>
                </div>
                <p className="mt-2 text-sm text-white/65">Zero humans needed. APIs verify instantly.</p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs text-white/60">
                  {['GitHub', 'Strava', 'Coursera', 'Google'].map((logo) => (
                    <span key={logo} className="rounded-full border border-teal/20 px-2.5 py-1">
                      {logo}
                    </span>
                  ))}
                </div>
              </GlassCard>
            </motion.div>

            <motion.div
              className="mt-5"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.45, delay: 0.1 }}
            >
              <GlassCard className="mx-auto max-w-md border-violet/30 p-6" glowColor="violet">
                <div className="flex items-center gap-2 text-violet">
                  <Users className="h-5 w-5" />
                  <p className="font-syne text-lg">Tier 2: Group Vote</p>
                </div>
                <p className="mt-2 text-sm text-white/65">Majority of circle members vote on proof.</p>
              </GlassCard>
            </motion.div>

            <motion.div
              className="mt-5"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.45, delay: 0.2 }}
            >
              <GlassCard className="mx-auto max-w-lg border-gold/30 p-6" glowColor="gold">
                <div className="flex items-center gap-2 text-gold">
                  <Shield className="h-5 w-5" />
                  <p className="font-syne text-lg">Tier 3: Trusted Verifier</p>
                </div>
                <p className="mt-2 text-sm text-white/65">Lawyer, CA, or HR signs on-chain.</p>
              </GlassCard>
            </motion.div>

            <motion.div
              className="mt-5"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.45, delay: 0.3 }}
              onMouseEnter={() => setShowAiDemo(true)}
              onMouseLeave={() => setShowAiDemo(false)}
            >
              <GlassCard className="mx-auto max-w-xl border-white/10 p-6" glowColor="teal">
                <div className="flex items-center gap-2 text-white">
                  <Bot className="h-5 w-5" />
                  <p className="font-syne text-lg">Tier 4: AI Proof Analyzer</p>
                </div>
                <p className="mt-2 text-sm text-white/65">Claude reads your document and scores it.</p>

                <AnimatePresence initial={false}>
                  {showAiDemo ? (
                    <motion.div
                      key="ai-demo"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 rounded-xl border border-teal/20 bg-teal/5 p-3 text-sm text-white/75">
                        <p>Sample output: 94% confidence</p>
                        <p className="mt-1">Keywords: pass</p>
                        <p className="mt-1">Timestamp: pass</p>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </GlassCard>
            </motion.div>
          </div>
        </section>

        <section className="mt-20">
          <GlassCard className="mx-0 border-gold/20 p-8 text-center sm:p-12" glowColor="gold" tilt>
            <h3 className="font-syne text-2xl">Don&apos;t see your use case?</h3>
            <p className="mx-auto mt-3 max-w-2xl text-lg text-white/50">
              We build custom pact templates for enterprises.
            </p>
            <MagneticButton
              variant="gold"
              className="mt-7 px-6 py-3 text-base"
              onClick={() => {
                window.location.assign('/create')
              }}
            >
              Request Custom Template
              <ArrowRight className="h-5 w-5" />
            </MagneticButton>
            <p className="mt-4 text-sm text-white/40">
              No-code template builder | Dedicated verifier setup | SLA guarantee
            </p>
          </GlassCard>
        </section>
      </div>
    </div>
  )
}
