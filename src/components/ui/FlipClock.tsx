import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '../../lib/utils'

type FlipClockProps = {
  targetDate: Date
  size?: 'lg' | 'sm'
  urgentAt?: number
}

type TimeParts = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

const sizeStyles = {
  lg: {
    container: 'w-[100px] h-[140px] text-[80px]',
    label: 'text-xs tracking-[0.3em]',
  },
  sm: {
    container: 'w-[60px] h-[80px] text-[48px]',
    label: 'text-[10px] tracking-[0.25em]',
  },
}

function getRemaining(targetDate: Date): { seconds: number; parts: TimeParts } {
  const now = Date.now()
  const diff = Math.max(0, targetDate.getTime() - now)
  const seconds = Math.floor(diff / 1000)
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  return {
    seconds,
    parts: {
      days,
      hours,
      minutes,
      seconds: secs,
    },
  }
}

function FlipDigit({ value, size }: { value: string; size: 'lg' | 'sm' }) {
  const [current, setCurrent] = useState(value)
  const [next, setNext] = useState(value)
  const [flipping, setFlipping] = useState(false)

  useEffect(() => {
    if (value === current) return
    setNext(value)
    setFlipping(true)
    const timeout = window.setTimeout(() => {
      setCurrent(value)
      setFlipping(false)
    }, 500)

    return () => window.clearTimeout(timeout)
  }, [current, value])

  return (
    <div
      className={cn(
        'relative bg-glass border border-glass-border rounded-xl overflow-hidden',
        'flex items-center justify-center font-syne',
        sizeStyles[size].container,
      )}
      style={{ perspective: 1000 }}
    >
      <div className="absolute top-0 left-0 right-0 h-1/2 bg-glass/80 border-b border-white/5 flex items-end justify-center">
        <span className="leading-none pb-2">{current}</span>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-glass/90 flex items-start justify-center">
        <span className="leading-none pt-2">{next}</span>
      </div>

      <AnimatePresence initial={false}>
        {flipping && (
          <motion.div
            key={`top-${current}`}
            className="absolute top-0 left-0 right-0 h-1/2 bg-glass/90 border-b border-white/5 flex items-end justify-center origin-bottom"
            initial={{ rotateX: 0 }}
            animate={{ rotateX: -90 }}
            exit={{ rotateX: -90 }}
            transition={{ duration: 0.25, ease: 'easeIn' }}
          >
            <span className="leading-none pb-2">{current}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {flipping && (
          <motion.div
            key={`bottom-${next}`}
            className="absolute bottom-0 left-0 right-0 h-1/2 bg-glass flex items-start justify-center origin-top"
            initial={{ rotateX: 90 }}
            animate={{ rotateX: 0 }}
            exit={{ rotateX: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut', delay: 0.25 }}
          >
            <span className="leading-none pt-2">{next}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function FlipClock({
  targetDate,
  size = 'lg',
  urgentAt = 21600,
}: FlipClockProps) {
  const [{ seconds, parts }, setRemaining] = useState(() =>
    getRemaining(targetDate),
  )

  useEffect(() => {
    const interval = window.setInterval(() => {
      setRemaining(getRemaining(targetDate))
    }, 1000)

    return () => window.clearInterval(interval)
  }, [targetDate])

  const colorClass = useMemo(() => {
    if (seconds <= urgentAt) {
      return 'text-danger'
    }
    if (seconds <= 86400) {
      return 'text-gold'
    }
    return 'text-white'
  }, [seconds, urgentAt])

  const wrapperClass = cn(
    'flex items-center gap-4',
    seconds <= urgentAt ? 'animate-glow-pulse shadow-[0_0_30px_rgba(255,59,92,0.4)]' : '',
    colorClass,
  )

  const segments = [
    { label: 'DAYS', value: parts.days, digits: 2 },
    { label: 'HRS', value: parts.hours, digits: 2 },
    { label: 'MIN', value: parts.minutes, digits: 2 },
    { label: 'SEC', value: parts.seconds, digits: 2 },
  ]

  return (
    <div className={wrapperClass}>
      {segments.map((segment, index) => {
        const str = segment.value.toString().padStart(segment.digits, '0')
        return (
          <div key={segment.label} className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              {str.split('').map((digit, digitIndex) => (
                <FlipDigit
                  key={`${segment.label}-${digitIndex}`}
                  value={digit}
                  size={size}
                />
              ))}
              {index < segments.length - 1 ? (
                <span className="text-teal font-syne text-2xl">:</span>
              ) : null}
            </div>
            <span className={cn('text-white/50 uppercase', sizeStyles[size].label)}>
              {segment.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
