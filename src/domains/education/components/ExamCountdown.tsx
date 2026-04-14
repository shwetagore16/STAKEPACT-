import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { FlipClock } from '../../../components/ui/FlipClock'

type ExamCountdownProps = {
  examDate: Date
  label?: string
}

export default function ExamCountdown({ examDate, label }: ExamCountdownProps) {
  const [remainingMs, setRemainingMs] = useState(() => Math.max(0, examDate.getTime() - Date.now()))

  useEffect(() => {
    const interval = window.setInterval(() => {
      setRemainingMs(Math.max(0, examDate.getTime() - Date.now()))
    }, 1000)

    return () => window.clearInterval(interval)
  }, [examDate])

  const lessThan24h = useMemo(() => remainingMs <= 24 * 60 * 60 * 1000, [remainingMs])

  return (
    <motion.div
      className="flex flex-col items-center justify-center gap-3"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.35 }}
    >
      <div className="overflow-x-auto max-w-full">
        <FlipClock targetDate={examDate} size="lg" />
      </div>
      <p className="text-sm tracking-[0.08em] uppercase text-white/60">Until {label || 'Exam'}</p>
      {lessThan24h ? (
        <p className="text-sm font-medium text-[#F5C842]">⚠️ Less than 24 hours remaining</p>
      ) : null}
    </motion.div>
  )
}
