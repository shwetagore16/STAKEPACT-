import { motion } from 'framer-motion'
import { GlassCard } from '../../../components/ui/GlassCard'
import { FlipClock } from '../../../components/ui/FlipClock'
import { MagneticButton } from '../../../components/ui/MagneticButton'
import type { StudyCircle } from '../types/education.types'

type StudyCircleCardProps = {
  circle: StudyCircle
  onJoin?: () => void
}

function submittedCount(circle: StudyCircle): number {
  return circle.members.filter((member) => member.proofStatus === 'submitted').length
}

export default function StudyCircleCard({ circle, onJoin }: StudyCircleCardProps) {
  const submitted = submittedCount(circle)
  const total = circle.members.length
  const progress = total > 0 ? (submitted / total) * 100 : 0
  const totalPot = circle.stakePerMember * total

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.35 }}
    >
      <GlassCard glowColor="teal" className="p-5" tilt>
        <div style={{ borderLeft: '4px solid #00FFD1' }} className="pl-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-syne text-xl font-bold text-white">{circle.name}</h3>
              <p className="mt-1 text-sm text-white/70">{circle.subject}</p>
              <p className="text-xs text-white/40">
                Exam Date: {circle.examDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              </p>
            </div>
            <div className="flex -space-x-2">
              {circle.members.map((member) => (
                <div
                  key={member.id}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-[#080C14] text-[10px] font-semibold text-white"
                  title={member.name}
                >
                  {member.initials}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <FlipClock targetDate={circle.examDate} size="sm" />
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-[#F5C842] font-semibold">₹{circle.stakePerMember.toLocaleString('en-IN')}/member</p>
            <p className="text-sm text-[#F5C842] font-semibold">₹{totalPot.toLocaleString('en-IN')} pot</p>
          </div>

          <div className="mt-4">
            <div className="mb-1 flex items-center justify-between text-xs text-white/60">
              <span>{submitted}/{total} submitted</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full bg-[#00FFD1]"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />
            </div>
          </div>

          <div className="mt-4">
            <MagneticButton variant="teal" className="px-3 py-1.5 text-xs" onClick={onJoin}>
              Join Circle →
            </MagneticButton>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  )
}
