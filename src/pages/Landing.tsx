import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useInView,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import {
  ArrowRight,
  CheckCircle,
  ChevronDown,
  Play,
  Shield,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { CountUp } from '../components/ui/CountUp'
import { FlipClock } from '../components/ui/FlipClock'
import { GlassCard } from '../components/ui/GlassCard'
import { MagneticButton } from '../components/ui/MagneticButton'
import { ScrambleText } from '../components/ui/ScrambleText'
import { cn } from '../lib/utils'

const sections = [
  { id: 'hero', label: 'HERO' },
  { id: 'stats', label: 'STATS' },
  { id: 'how-it-works', label: 'HOW IT WORKS' },
  { id: 'categories', label: 'CATEGORIES' },
  { id: 'enterprise', label: 'ENTERPRISE' },
] as const

type SectionId = (typeof sections)[number]['id']

type StepData = {
  step: string
  title: string
  description: string
  content: React.ReactNode
}

function StepCard({ step, title, description, content, index }: StepData & { index: number }) {
  const ref = useRef<HTMLDivElement | null>(null)
  const inView = useInView(ref, { amount: 0.35, once: true })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className="relative"
    >
      <div className="pointer-events-none absolute right-0 top-0 font-syne text-[160px] font-bold text-white/[0.03]">
        {step}
      </div>
      <div className="text-teal text-[11px] tracking-[4px] font-mono">STEP {step}</div>
      <h3 className="mt-2 font-syne text-2xl font-bold text-white">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-white/50">{description}</p>
      <div className="mt-6">{content}</div>
    </motion.div>
  )
}

export default function Landing() {
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState<SectionId>('hero')

  const heroRef = useRef<HTMLElement | null>(null)
  const statsRef = useRef<HTMLElement | null>(null)
  const howRef = useRef<HTMLElement | null>(null)
  const categoriesRef = useRef<HTMLElement | null>(null)
  const enterpriseRef = useRef<HTMLElement | null>(null)

  const heroInView = useInView(heroRef, { amount: 0.35, once: true })
  const statsInView = useInView(statsRef, { amount: 0.35, once: true })
  const howInView = useInView(howRef, { amount: 0.2, once: true })
  const categoriesInView = useInView(categoriesRef, { amount: 0.2, once: true })
  const enterpriseInView = useInView(enterpriseRef, { amount: 0.2, once: true })

  const { scrollYProgress } = useScroll()
  const heroFloat = useTransform(scrollYProgress, [0, 0.4], [0, -32])
  const heroSpring = useSpring(heroFloat, { stiffness: 70, damping: 22 })

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id as SectionId)
          }
        })
      },
      { threshold: 0.45 },
    )

    sections.forEach((section) => {
      const element = document.getElementById(section.id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [])

  const steps: StepData[] = [
    {
      step: '01',
      title: 'Set Your Commitment',
      description:
        'Define outcomes, attach verifiers, and align every stakeholder before the clock starts.',
      content: (
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Corporate', icon: <Users className="h-4 w-4 text-teal" /> },
            { label: 'Education', icon: <TrendingUp className="h-4 w-4 text-teal" /> },
            { label: 'Legal', icon: <Shield className="h-4 w-4 text-teal" /> },
            { label: 'Personal', icon: <Zap className="h-4 w-4 text-teal" /> },
          ].map((item) => (
            <GlassCard
              key={item.label}
              tilt
              glowColor="teal"
              className="flex items-center gap-2 px-3 py-3 text-xs text-white/70"
            >
              {item.icon}
              {item.label}
            </GlassCard>
          ))}
        </div>
      ),
    },
    {
      step: '02',
      title: 'Stake Your Amount in INR',
      description:
        'Lock your stake and let Algorand handle the enforcement. You always see INR, not crypto.',
      content: (
        <div className="rounded-2xl border border-glass-border bg-glass px-4 py-5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/60">Stake amount</span>
            <span className="font-syne text-lg text-gold">INR 25,000</span>
          </div>
          <div className="mt-4 flex items-center gap-3 text-xs text-white/40">
            <span>INR 500</span>
            <div className="relative h-1 flex-1 rounded-full bg-white/10">
              <div className="absolute left-0 top-0 h-1 w-2/3 rounded-full bg-gradient-to-r from-gold to-teal" />
              <div className="absolute right-8 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border border-teal bg-obsidian" />
            </div>
            <span>INR 1,00,000</span>
          </div>
          <p className="mt-4 text-xs text-white/40">
            Crypto is invisible. You always see INR.
          </p>
        </div>
      ),
    },
    {
      step: '03',
      title: 'Deliver. Prove. Earn.',
      description:
        'Submit proof, trigger verifier checks, and reclaim your stake with bonuses.',
      content: (
        <GlassCard className="p-4" glowColor="teal" tilt>
          <div className="flex items-start gap-3">
            <motion.svg
              width="40"
              height="40"
              viewBox="0 0 52 52"
              fill="none"
              className="text-teal"
            >
              <motion.circle
                cx="26"
                cy="26"
                r="24"
                stroke="currentColor"
                strokeWidth="2"
                opacity="0.3"
              />
              <motion.path
                d="M16 27.5L23 34.5L37 20.5"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="24"
                strokeDashoffset={howInView ? 0 : 24}
                animate={howInView ? { strokeDashoffset: 0 } : {}}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </motion.svg>
            <div>
              <div className="flex items-center gap-2 text-sm text-white">
                <CheckCircle className="h-4 w-4 text-teal" /> Proof verified by GitHub API
              </div>
              <div className="mt-2 text-xs text-white/50">
                INR 5,000 returned + INR 800 bonus
              </div>
            </div>
          </div>
        </GlassCard>
      ),
    },
  ]

  return (
    <div className="relative">
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={cn(
          'fixed top-0 z-50 flex w-full items-center justify-between px-8 py-5 transition-all duration-500',
          scrolled
            ? 'bg-obsidian/80 backdrop-blur-glass border-b border-glass-border'
            : 'bg-transparent',
        )}
      >
        <Link to="/" className="font-syne text-xl font-bold flex items-center gap-2" data-cursor="pointer">
          <span className="text-teal">*</span> StakePact
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          {[
            { label: 'How It Works', id: 'how-it-works' },
            { label: 'Categories', id: 'categories' },
            { label: 'Enterprise', id: 'enterprise' },
            { label: 'CommitScore', id: 'enterprise' },
          ].map((item) => (
            <a
              key={item.label}
              href={`#${item.id}`}
              className="text-sm tracking-wide text-white/50 transition-colors hover:text-white"
              data-cursor="pointer"
            >
              {item.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <MagneticButton variant="ghost">Connect Wallet</MagneticButton>
          <MagneticButton variant="gold" onClick={() => navigate('/create')}>
            Get Started <ArrowRight className="h-4 w-4" />
          </MagneticButton>
        </div>
      </motion.nav>

      <div className="fixed right-4 top-1/2 z-40 -translate-y-1/2 space-y-6">
        {sections.map((section) => {
          const isActive = activeSection === section.id
          return (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="flex items-center gap-3"
              data-cursor="pointer"
            >
              <span
                className={cn(
                  'text-[10px] tracking-[3px] text-white/20',
                  isActive && 'text-teal',
                )}
                style={{ writingMode: 'vertical-rl' }}
              >
                {section.label}
              </span>
              <span
                className={cn(
                  'h-px w-6 bg-transparent transition-colors duration-300',
                  isActive && 'bg-teal',
                )}
              />
            </a>
          )
        })}
      </div>

      <motion.section
        id="hero"
        ref={heroRef}
        initial={{ opacity: 0, y: 40 }}
        animate={heroInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="min-h-screen pt-24"
      >
        <div className="mx-auto flex min-h-screen max-w-7xl flex-col items-center gap-10 px-8 lg:flex-row">
          <div className="w-full lg:w-[55%]">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-6 text-[11px] font-mono tracking-[4px] text-teal"
            >
              POWERED BY ALGORAND
            </motion.p>
            <div className="font-syne text-5xl font-bold leading-none md:text-6xl lg:text-7xl">
              <ScrambleText text="Your Deadline." delay={400} className="block" />
              <ScrambleText text="Your Stake." delay={600} className="block" />
              <ScrambleText
                text="No Excuses."
                delay={800}
                className="block bg-gradient-to-r from-gold to-teal bg-clip-text text-transparent"
              />
            </div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="mt-6 max-w-md text-lg leading-relaxed text-white/50"
            >
              The world's first commitment enforcement protocol. Stake INR against
              deadlines - blockchain enforced, zero bureaucracy.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="mt-10 flex flex-wrap gap-4"
            >
              <MagneticButton variant="gold" onClick={() => navigate('/create')}>
                Create Your First Pact <ArrowRight className="h-4 w-4" />
              </MagneticButton>
              <MagneticButton
                variant="ghost"
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Play className="h-4 w-4" /> Watch How It Works
              </MagneticButton>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
              className="mt-8 flex flex-wrap items-center gap-6 text-sm text-white/30"
            >
              <span className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-teal" /> Algorand Secured
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-teal" /> INR Payments
              </span>
              <span className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-teal" /> INR 4.2 Cr Staked
              </span>
            </motion.div>
          </div>

          <motion.div
            className="flex w-full items-center justify-center lg:w-[45%]"
            style={{ y: heroSpring }}
          >
            <div className="relative h-96 w-96 animate-bob">
              <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full">
                <polygon
                  points="100,10 180,55 180,145 100,190 20,145 20,55"
                  fill="rgba(0,255,209,0.05)"
                  stroke="#00FFD1"
                  strokeWidth="1"
                  className="animate-spin-slow"
                  style={{ transformOrigin: 'center' }}
                />
                <polygon
                  points="100,30 165,67.5 165,132.5 100,170 35,132.5 35,67.5"
                  fill="rgba(8,12,20,0.9)"
                  stroke="rgba(0,255,209,0.3)"
                  strokeWidth="0.5"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <p className="font-mono text-[10px] tracking-[3px] text-teal">PACT #4721</p>
                <p className="mt-1 font-syne text-3xl font-bold text-white">INR 25,000</p>
                <p className="mt-1 text-xs text-white/40">LOCKED IN ESCROW</p>
                <div className="mt-4">
                  <FlipClock targetDate={new Date(Date.now() + 72 * 3600 * 1000)} size="sm" />
                </div>
              </div>

              {[
                { initials: 'AP', pos: 'top-[6%] left-1/2 -translate-x-1/2', status: 'bg-emerald-400' },
                { initials: 'IN', pos: 'top-[20%] right-[6%]', status: 'bg-emerald-400' },
                { initials: 'KM', pos: 'bottom-[20%] right-[8%]', status: 'bg-amber-400' },
                { initials: 'RS', pos: 'bottom-[6%] left-1/2 -translate-x-1/2', status: 'bg-emerald-400' },
                { initials: 'TR', pos: 'bottom-[20%] left-[8%]', status: 'bg-emerald-400' },
                { initials: 'MR', pos: 'top-[20%] left-[6%]', status: 'bg-amber-400' },
              ].map((member) => (
                <div
                  key={member.initials}
                  className={cn(
                    'absolute flex h-10 w-10 items-center justify-center rounded-full border-2 border-teal/30 bg-obsidian text-xs text-white/70',
                    member.pos,
                  )}
                >
                  {member.initials}
                  <span
                    className={cn(
                      'absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full',
                      member.status,
                    )}
                  />
                </div>
              ))}

              {[
                { text: 'Stake: INR 5,000 | 5 members', pos: 'top-4 right-[-20%]', delay: 0 },
                { text: 'Deadline: Friday 5PM', pos: 'left-[-20%] top-1/2 -translate-y-1/2', delay: 0.5 },
                { text: 'GitHub API Verified', pos: 'bottom-8 right-[-15%]', delay: 1 },
              ].map((pill) => (
                <motion.div
                  key={pill.text}
                  className={cn(
                    'absolute rounded-full border border-glass-border bg-glass px-4 py-2 text-xs text-white/70 backdrop-blur-glass',
                    pill.pos,
                  )}
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3 + pill.delay, repeat: Infinity, ease: 'easeInOut' }}
                >
                  {pill.text}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-white/30"
        >
          <ChevronDown className="h-5 w-5" />
          <span className="text-[10px] font-mono tracking-[3px] text-white/20">SCROLL</span>
        </motion.div>
      </motion.section>

      <motion.section
        id="stats"
        ref={statsRef}
        initial={{ opacity: 0, y: 40 }}
        animate={statsInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="mt-20 border-y border-glass-border bg-glass py-10"
      >
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 text-center md:grid-cols-4 md:divide-x md:divide-glass-border">
          {[
            { label: 'TOTAL STAKED', value: 42000000, suffix: ' Cr', prefix: 'INR ' },
            { label: 'PACTS ACTIVE', value: 12847 },
            { label: 'SUCCESS RATE', value: 89.3, suffix: '%', decimals: 1 },
            { label: 'ENTERPRISES', value: 1204 },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-2">
              <span className="font-syne text-4xl text-gold">
                <CountUp
                  end={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  decimals={stat.decimals}
                />
              </span>
              <span className="text-xs font-mono tracking-widest text-white/30">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </motion.section>

      <motion.section
        id="how-it-works"
        ref={howRef}
        initial={{ opacity: 0, y: 40 }}
        animate={howInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="mx-auto max-w-7xl px-8 py-32"
      >
        <div className="text-center">
          <h2 className="font-syne text-4xl text-white">How StakePact Works</h2>
          <p className="mt-4 text-white/40">
            Every pact is time bound, cryptographically enforced, and impossible to ignore.
          </p>
        </div>

        <div className="relative mx-auto mt-12 max-w-3xl">
          <div className="h-px w-full bg-white/10" />
          <motion.div
            className="absolute left-0 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-teal"
            animate={{ x: ['0%', '100%', '0%'] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-3">
          {steps.map((step, index) => (
            <StepCard key={step.step} {...step} index={index} />
          ))}
        </div>
      </motion.section>

      <motion.section
        id="categories"
        ref={categoriesRef}
        initial={{ opacity: 0, y: 40 }}
        animate={categoriesInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="px-8 py-32"
      >
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="font-syne text-4xl text-white">Built for Every Industry</h2>
            <p className="mt-4 text-white/40">
              From government agencies to solo founders, StakePact adapts to your mission.
            </p>
          </div>

          <div className="mt-16 grid auto-rows-[220px] gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'Government',
                glow: 'violet',
                icon: <Shield className="h-10 w-10 text-violet" />,
                description: 'Escrowed compliance deadlines for public-sector programs.',
                badge: 'Coming Soon',
                span: 'row-span-2',
              },
              {
                title: 'Corporate',
                glow: 'teal',
                icon: <Users className="h-10 w-10 text-sky-400" />,
                description: 'Tie delivery KPIs to real financial outcomes.',
                stat: '2,341 active pacts',
                span: 'row-span-1',
              },
              {
                title: 'Legal',
                glow: 'danger',
                icon: <CheckCircle className="h-10 w-10 text-danger" />,
                description: 'Court-aligned enforcement with verifier checkpoints.',
                badge: 'Requires Verifier',
                span: 'row-span-1',
              },
              {
                title: 'Education',
                glow: 'teal',
                icon: <TrendingUp className="h-10 w-10 text-teal" />,
                description: 'Keep cohorts accountable through milestone staking.',
                badge: 'Most Popular',
                span: 'row-span-2',
              },
              {
                title: 'Personal',
                glow: 'gold',
                icon: <Zap className="h-10 w-10 text-gold" />,
                description: 'Solo goals with auto-verification support.',
                badge: 'Auto-verify support',
                span: 'row-span-1',
              },
            ].map((card) => (
              <GlassCard
                key={card.title}
                tilt
                glowColor={card.glow as 'teal' | 'gold' | 'violet' | 'danger'}
                className={cn('flex h-full flex-col justify-between p-6', card.span)}
              >
                <div>
                  {card.icon}
                  <h3 className="mt-4 font-syne text-xl text-white">{card.title}</h3>
                  <p className="mt-2 text-sm text-white/50">{card.description}</p>
                </div>
                <div className="flex items-center justify-between text-xs text-white/40">
                  <span className="rounded-full border border-white/10 px-3 py-1">
                    {card.badge || card.stat}
                  </span>
                  <Link
                    to="/create"
                    className="text-teal/70 transition-colors hover:text-teal"
                    data-cursor="pointer"
                  >
                    Explore
                  </Link>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section
        id="enterprise"
        ref={enterpriseRef}
        initial={{ opacity: 0, y: 40 }}
        animate={enterpriseInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="px-8 py-20"
      >
        <div className="mx-auto max-w-6xl rounded-3xl border border-gold/10 bg-gradient-to-r from-gold/5 to-transparent px-8 py-16 md:px-16">
          <div className="flex flex-col items-start justify-between gap-10 md:flex-row md:items-center">
            <h3 className="max-w-2xl font-syne text-3xl text-white">
              Does your company miss contract deadlines? Make them costly.
            </h3>
            <MagneticButton variant="gold" onClick={() => navigate('/dashboard')}>
              Schedule Enterprise Demo <ArrowRight className="h-4 w-4" />
            </MagneticButton>
          </div>
        </div>
      </motion.section>

      <footer className="border-t border-white/5 px-8 py-12">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="font-syne text-xl font-bold text-white">StakePact</div>
            <p className="mt-2 text-xs text-white/40">
              Powered by Algorand | All amounts in INR
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6 text-sm text-white/40 md:grid-cols-4">
            <div className="space-y-2">
              <div className="text-white/70">Product</div>
              <div>Overview</div>
              <div>Security</div>
              <div>Pricing</div>
            </div>
            <div className="space-y-2">
              <div className="text-white/70">Company</div>
              <div>About</div>
              <div>Careers</div>
              <div>Press</div>
            </div>
            <div className="space-y-2">
              <div className="text-white/70">Resources</div>
              <div>Docs</div>
              <div>Community</div>
              <div>Help</div>
            </div>
            <div className="space-y-2">
              <div className="text-white/70">Legal</div>
              <div>Terms</div>
              <div>Privacy</div>
              <div>Compliance</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
