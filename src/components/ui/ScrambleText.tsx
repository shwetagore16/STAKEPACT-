import { useEffect, useMemo, useState } from 'react'
import { cn } from '../../lib/utils'

type ScrambleTextProps = {
  text: string
  trigger?: boolean
  delay?: number
  className?: string
}

const SCRAMBLE_CHARS =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

export function ScrambleText({
  text,
  trigger,
  delay = 0,
  className,
}: ScrambleTextProps) {
  const characters = useMemo(() => text.split(''), [text])
  const [output, setOutput] = useState(characters)

  useEffect(() => {
    const shouldRun = trigger ?? true
    if (!shouldRun) return

    const timeouts: number[] = []
    const intervals: number[] = []

    characters.forEach((char, index) => {
      const startDelay = delay + index * 60
      const startTimeout = window.setTimeout(() => {
        const interval = window.setInterval(() => {
          setOutput((prev) => {
            const next = [...prev]
            const randomIndex = Math.floor(
              Math.random() * SCRAMBLE_CHARS.length,
            )
            next[index] = SCRAMBLE_CHARS[randomIndex]
            return next
          })
        }, 40)

        const stopTimeout = window.setTimeout(() => {
          window.clearInterval(interval)
          setOutput((prev) => {
            const next = [...prev]
            next[index] = char
            return next
          })
        }, 600)

        timeouts.push(stopTimeout)
        intervals.push(interval)
      }, startDelay)

      timeouts.push(startTimeout)
    })

    return () => {
      timeouts.forEach((id) => window.clearTimeout(id))
      intervals.forEach((id) => window.clearInterval(id))
    }
  }, [characters, delay, trigger])

  return (
    <span className={cn('inline-flex', className)}>
      {output.map((char, index) => (
        <span key={`${char}-${index}`}>{char}</span>
      ))}
    </span>
  )
}
