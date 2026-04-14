import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { GlassCard } from '../../../components/ui/GlassCard'
import { MagneticButton } from '../../../components/ui/MagneticButton'
import { CountUp } from '../../../components/ui/CountUp'
import { ScrambleText } from '../../../components/ui/ScrambleText'
import { Badge } from '../../../components/ui/Badge'
import StudyCircleCard from '../components/StudyCircleCard'
import CourseVerifier from '../components/CourseVerifier'
import type { StudyCircle } from '../types/education.types'

const revealContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const revealItem = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
}

const commitmentTypes = [
  {
    icon: '🤝',
    title: 'Study Circle',
    body: 'Peer groups stake together for exam and project accountability.',
    badge: 'MOST POPULAR',
  },
  {
    icon: '📝',
    title: 'Assignment',
    body: 'Submit assignment artifacts before cutoff and keep your stake.',
  },
  {
    icon: '🎯',
    title: 'Course Completion',
    body: 'Lock in completion goals and auto-verify with learning platforms.',
  },
  {
    icon: '📚',
    title: 'Thesis',
    body: 'Stake-backed long-form submission with supervisor verification.',
  },
]

const circles: StudyCircle[] = [
  {
    id: 'edu-circle-01',
    name: 'Finals Sprint Cohort',
    subject: 'Computer Networks',
    examDate: new Date('2026-05-30T10:00:00.000Z'),
    stakePerMember: 3000,
    verificationMethod: 'group-vote',
    lmsIntegration: 'google-classroom',
    members: [
      { id: '1', name: 'Ananya Roy', initials: 'AR', proofStatus: 'submitted', courseProgress: 84 },
      { id: '2', name: 'Kabir Jain', initials: 'KJ', proofStatus: 'pending', courseProgress: 72 },
      { id: '3', name: 'Mira Das', initials: 'MD', proofStatus: 'submitted', courseProgress: 88 },
      { id: '4', name: 'Rohan Shah', initials: 'RS', proofStatus: 'pending', courseProgress: 69 },
      { id: '5', name: 'Isha Nair', initials: 'IN', proofStatus: 'failed', courseProgress: 45 },
    ],
  },
  {
    id: 'edu-circle-02',
    name: 'DSA Interview Circle',
    subject: 'Data Structures & Algorithms',
    examDate: new Date('2026-06-12T15:00:00.000Z'),
    stakePerMember: 4500,
    verificationMethod: 'document',
    lmsIntegration: null,
    members: [
      { id: '6', name: 'Priya Menon', initials: 'PM', proofStatus: 'submitted', courseProgress: 90 },
      { id: '7', name: 'Dev Patel', initials: 'DP', proofStatus: 'submitted', courseProgress: 79 },
      { id: '8', name: 'Aman Verma', initials: 'AV', proofStatus: 'pending', courseProgress: 66 },
      { id: '9', name: 'Sara Khan', initials: 'SK', proofStatus: 'pending', courseProgress: 73 },
    ],
  },
  {
    id: 'edu-circle-03',
    name: 'Thesis Deadline Guild',
    subject: 'Machine Learning Thesis',
    examDate: new Date('2026-07-05T09:00:00.000Z'),
    stakePerMember: 7000,
    verificationMethod: 'auto-lms',
    lmsIntegration: 'coursera',
    members: [
      { id: '10', name: 'Nitin S', initials: 'NS', proofStatus: 'submitted', courseProgress: 91 },
      { id: '11', name: 'Lavanya P', initials: 'LP', proofStatus: 'pending', courseProgress: 63 },
      { id: '12', name: 'Harsh K', initials: 'HK', proofStatus: 'pending', courseProgress: 58 },
    ],
  },
]

const testimonials = [
  {
    quote: 'Our finals prep was no longer vague. StakePact kept everyone accountable and on schedule.',
    name: 'Riddhi B., B.Tech Student',
    score: 'CommitScore A+',
    variant: 'teal' as const,
  },
  {
    quote: 'The study circle removed procrastination. Missing one milestone became too expensive to ignore.',
    name: 'Karan M., MBA Candidate',
    score: 'CommitScore A',
    variant: 'gold' as const,
  },
  {
    quote: 'Thesis sprint reviews are now clean and consistent. Proof uploads made progress transparent.',
    name: 'Neha R., M.Sc Researcher',
    score: 'CommitScore B+',
    variant: 'violet' as const,
  },
]

export default function EducationHub() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#080C14] text-white">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(0,255,209,0.06),rgba(0,255,209,0))]" />

      <div className="relative mx-auto max-w-7xl px-6 py-14">
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <p className="text-sm text-white/30">Categories → Education</p>

          <motion.div
            className="mt-3 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-[#00FFD1]/25 bg-[#00FFD1]/10 text-2xl"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            aria-hidden="true"
          >
            🎓
          </motion.div>

          <h1 className="mt-4 font-syne text-4xl font-bold sm:text-5xl">
            <ScrambleText text="Education & Learning" />
          </h1>

          <p className="mt-4 max-w-3xl text-base text-white/60">
            Turn exam deadlines into money on the line. Study circles, course completions, thesis submissions.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/categories/education/create">
              <MagneticButton variant="gold">Create Study Circle →</MagneticButton>
            </Link>
            <MagneticButton variant="ghost">Browse Active Pacts</MagneticButton>
          </div>
        </motion.section>

        <motion.section
          className="mt-10 grid gap-4 md:grid-cols-3"
          variants={revealContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div variants={revealItem}>
            <GlassCard glowColor="teal" className="p-5">
              <p className="text-sm text-white/50">Active Pacts</p>
              <p className="mt-2 font-syne text-3xl font-bold text-[#00FFD1]">
                <CountUp end={8204} />
              </p>
            </GlassCard>
          </motion.div>
          <motion.div variants={revealItem}>
            <GlassCard glowColor="gold" className="p-5">
              <p className="text-sm text-white/50">Total Staked</p>
              <p className="mt-2 font-syne text-3xl font-bold text-[#F5C842]">
                <CountUp end={2.1} decimals={1} prefix="₹ " suffix=" Cr" />
              </p>
            </GlassCard>
          </motion.div>
          <motion.div variants={revealItem}>
            <GlassCard glowColor="teal" className="p-5">
              <p className="text-sm text-white/50">Success Rate</p>
              <p className="mt-2 font-syne text-3xl font-bold text-[#00FFD1]">
                <CountUp end={91} suffix="%" />
              </p>
            </GlassCard>
          </motion.div>
        </motion.section>

        <motion.section
          className="mt-14"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.35 }}
        >
          <h2 className="font-syne text-2xl font-bold">Choose Your Commitment Type</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {commitmentTypes.map((item) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.25 }}
              >
                <GlassCard glowColor="teal" className="h-full p-5" tilt>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-2xl" aria-hidden="true">{item.icon}</p>
                      <p className="mt-2 font-syne text-xl font-bold">{item.title}</p>
                      <p className="mt-2 text-sm text-white/60">{item.body}</p>
                    </div>
                    {item.badge ? <Badge variant="teal" size="xs">{item.badge}</Badge> : null}
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          className="mt-14"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.35 }}
        >
          <h2 className="font-syne text-2xl font-bold">Active Study Circles</h2>
          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            {circles.map((circle) => (
              <StudyCircleCard key={circle.id} circle={circle} />
            ))}
          </div>
        </motion.section>

        <motion.section
          className="mt-14"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.35 }}
        >
          <h2 className="font-syne text-2xl font-bold">Connect Your Learning Apps</h2>
          <p className="mt-2 text-sm text-white/55">Sync platform progress for faster and fairer verification.</p>
          <div className="mt-4">
            <CourseVerifier />
          </div>
        </motion.section>

        <motion.section
          className="mt-14"
          variants={revealContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          <h2 className="font-syne text-2xl font-bold">Student Voices</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {testimonials.map((item) => (
              <motion.div key={item.name} variants={revealItem}>
                <GlassCard glowColor="teal" className="h-full p-5">
                  <p className="text-sm leading-relaxed text-white/70">"{item.quote}"</p>
                  <p className="mt-4 text-sm text-white/50">{item.name}</p>
                  <div className="mt-3">
                    <Badge variant={item.variant} size="xs">{item.score}</Badge>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  )
}
