import { useEffect, useRef, useState } from 'react'
import { animate, useMotionValue } from 'framer-motion'
import { formatINR } from '../../lib/utils'

type CountUpProps = {
  end: number
  duration?: number
  prefix?: string
  suffix?: string
  decimals?: number
  trigger?: boolean
}

export function CountUp({
  end,
  duration = 1.5,
  prefix = '',
  suffix = '',
  decimals = 0,
  trigger,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement | null>(null)
  const [started, setStarted] = useState(false)
  const value = useMotionValue(0)
  const [display, setDisplay] = useState(() => {
    const formatter = new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })
    if (prefix === '₹') return `${formatINR(0)}${suffix}`
    return `${prefix}${formatter.format(0)}${suffix}`
  })

  useEffect(() => {
    const formatter = new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })

    const unsubscribe = value.on('change', (latest) => {
      const rounded = Number(latest.toFixed(decimals))
      const formatted = prefix === '₹' ? formatINR(rounded) : formatter.format(rounded)
      const output = prefix === '₹' ? formatted : `${prefix}${formatted}`
      setDisplay(`${output}${suffix}`)
    })

    return () => unsubscribe()
  }, [decimals, prefix, suffix, value])

  useEffect(() => {
    if (trigger !== undefined) {
      setStarted(trigger)
      return
    }

    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true)
          observer.disconnect()
        }
      },
      { threshold: 0.4 },
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [trigger])

  useEffect(() => {
    if (!started) return
    const controls = animate(value, end, {
      duration,
      ease: [0.22, 1, 0.36, 1],
    })

    return () => controls.stop()
  }, [duration, end, started, value])

  return (
    <span ref={ref}>{display}</span>
  )
}
