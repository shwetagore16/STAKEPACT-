import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { GlassCard } from '../../../components/ui/GlassCard'
import { MagneticButton } from '../../../components/ui/MagneticButton'
import { CountUp } from '../../../components/ui/CountUp'

const verificationModes = [
  { id: 'group-vote', icon: '👥', title: 'Group Vote', description: 'Circle members vote on proof quality and completion.' },
  { id: 'document', icon: '📄', title: 'Document Upload', description: 'Upload answer sheets, reports, or signed records.' },
  { id: 'auto-lms', icon: '🤖', title: 'LMS Auto-verify', description: 'Sync with learning platform for automated completion checks.' },
] as const

export default function StudyCircle() {
  const [members, setMembers] = useState(5)
  const [stakePerMember, setStakePerMember] = useState(1000)
  const [verificationMethod, setVerificationMethod] = useState<(typeof verificationModes)[number]['id']>('group-vote')

  const totalPot = useMemo(() => members * stakePerMember, [members, stakePerMember])
  const bonusIfOneFails = useMemo(() => (1 * stakePerMember) / Math.max(1, members - 1), [members, stakePerMember])
  const bonusIfTwoFail = useMemo(() => (2 * stakePerMember) / Math.max(1, members - 2), [members, stakePerMember])
  const bonusIfThreeFail = useMemo(() => (3 * stakePerMember) / Math.max(1, members - 3), [members, stakePerMember])

  const key = `${members}-${stakePerMember}`

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#080C14] text-white">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(0,255,209,0.10),rgba(0,255,209,0))]" />

      <div className="relative mx-auto max-w-6xl px-6 py-14">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <p className="text-sm uppercase tracking-[0.2em] text-white/35">Education / Study Circle</p>
          <h1 className="mt-3 font-syne text-5xl font-bold">The Study Circle</h1>
          <p className="mt-3 max-w-3xl text-base text-white/65">
            Create a pledge circle with your peers. Everyone stakes, everyone studies harder, and the reward pool redistributes from missed commitments.
          </p>
        </motion.section>

        <motion.section
          className="mt-10"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
        >
          <GlassCard glowColor="teal" className="p-6">
            <svg viewBox="0 0 620 340" className="h-[280px] w-full">
              <defs>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#00FFD1" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#00FFD1" stopOpacity="0.2" />
                </linearGradient>
              </defs>

              {[
                { x: 310, y: 40, label: 'A' },
                { x: 495, y: 115, label: 'B' },
                { x: 425, y: 275, label: 'C' },
                { x: 195, y: 275, label: 'D' },
                { x: 125, y: 115, label: 'E' },
              ].map((node, index) => (
                <g key={node.label}>
                  <motion.path
                    d={`M ${node.x} ${node.y} L 310 170`}
                    stroke="url(#lineGradient)"
                    strokeWidth="2"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.7, delay: 0.15 * index }}
                  />
                  <motion.circle
                    cx={node.x}
                    cy={node.y}
                    r="24"
                    fill="rgba(255,255,255,0.04)"
                    stroke="#00FFD1"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 + index * 0.08 }}
                  />
                  <text x={node.x} y={node.y + 5} textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="700">
                    {node.label}
                  </text>
                </g>
              ))}

              <motion.circle
                cx="310"
                cy="170"
                r="44"
                fill="rgba(245,200,66,0.18)"
                stroke="#F5C842"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.4, delay: 0.55 }}
              />
              <text x="310" y="165" textAnchor="middle" fill="#F5C842" fontSize="12" fontWeight="600">₹ POT</text>
              <text x="310" y="183" textAnchor="middle" fill="#ffffff" fontSize="10">Shared Pool</text>
            </svg>
          </GlassCard>
        </motion.section>

        <motion.section
          className="mt-10 grid gap-4 md:grid-cols-3"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.35 }}
        >
          {[
            { step: '01', title: 'Form Circle', text: 'Invite focused peers and lock deadline rules.' },
            { step: '02', title: 'Everyone Stakes', text: 'Each member commits money to the shared pot.' },
            { step: '03', title: 'Submit Proof', text: 'Winners recover stake and split penalties.' },
          ].map((item, index) => (
            <motion.div key={item.step} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
              <GlassCard glowColor="teal" className="h-full p-5">
                <p className="text-xs tracking-[0.2em] text-[#00FFD1]">STEP {item.step}</p>
                <p className="mt-2 font-syne text-xl font-bold">{item.title}</p>
                <p className="mt-2 text-sm text-white/60">{item.text}</p>
              </GlassCard>
            </motion.div>
          ))}
        </motion.section>

        <motion.section
          className="mt-12"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.35 }}
        >
          <GlassCard glowColor="gold" className="p-6">
            <h2 className="font-syne text-2xl font-bold">Interactive Stake Calculator</h2>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <div>
                <label className="text-sm text-white/65">Members: {members}</label>
                <input
                  type="range"
                  min={2}
                  max={8}
                  value={members}
                  onChange={(event) => setMembers(Number(event.target.value))}
                  className="mt-2 w-full accent-[#00FFD1]"
                />

                <label className="mt-5 block text-sm text-white/65">Stake per member: ₹{stakePerMember.toLocaleString('en-IN')}</label>
                <input
                  type="range"
                  min={100}
                  max={10000}
                  step={100}
                  value={stakePerMember}
                  onChange={(event) => setStakePerMember(Number(event.target.value))}
                  className="mt-2 w-full accent-[#00FFD1]"
                />
              </div>

              <div key={key} className="grid gap-3">
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                  <p className="text-xs text-white/50">Total Pot</p>
                  <p className="mt-1 font-syne text-2xl text-[#F5C842]"><CountUp end={totalPot} prefix="₹" /></p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                  <p className="text-xs text-white/50">Bonus if 1 fails</p>
                  <p className="mt-1 font-syne text-xl text-[#00FFD1]"><CountUp end={bonusIfOneFails} prefix="₹" /></p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                  <p className="text-xs text-white/50">Bonus if 2 fail</p>
                  <p className="mt-1 font-syne text-xl text-[#00FFD1]"><CountUp end={bonusIfTwoFail} prefix="₹" /></p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                  <p className="text-xs text-white/50">Bonus if 3 fail</p>
                  <p className="mt-1 font-syne text-xl text-[#00FFD1]"><CountUp end={bonusIfThreeFail} prefix="₹" /></p>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.section>

        <motion.section
          className="mt-12"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.35 }}
        >
          <h2 className="font-syne text-2xl font-bold">Verification Method</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {verificationModes.map((mode) => {
              const selected = verificationMethod === mode.id
              return (
                <motion.button
                  key={mode.id}
                  type="button"
                  onClick={() => setVerificationMethod(mode.id)}
                  className={selected
                    ? 'rounded-2xl border border-[#00FFD1]/70 bg-[#00FFD1]/10 p-4 text-left shadow-[0_0_22px_rgba(0,255,209,0.15)]'
                    : 'rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-left'}
                  whileHover={{ y: -2 }}
                >
                  <p className="text-2xl" aria-hidden="true">{mode.icon}</p>
                  <p className="mt-2 font-syne text-lg font-bold">{mode.title}</p>
                  <p className="mt-1 text-sm text-white/60">{mode.description}</p>
                </motion.button>
              )
            })}
          </div>
        </motion.section>

        <motion.section
          className="mt-10"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.35 }}
        >
          <Link to="/categories/education/create">
            <MagneticButton variant="gold" className="px-6 py-3 text-sm font-semibold">
              Create Your Circle →
            </MagneticButton>
          </Link>
        </motion.section>
      </div>
    </div>
  )
}
