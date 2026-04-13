import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export function CustomCursor() {
  const [isPointer, setIsPointer] = useState(false)
  const [enabled, setEnabled] = useState(false)
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const ringX = useSpring(x, { stiffness: 100, damping: 20 })
  const ringY = useSpring(y, { stiffness: 100, damping: 20 })

  useEffect(() => {
    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)')
    const updateEnabled = () => setEnabled(mediaQuery.matches)
    updateEnabled()

    mediaQuery.addEventListener('change', updateEnabled)
    return () => mediaQuery.removeEventListener('change', updateEnabled)
  }, [])

  useEffect(() => {
    if (!enabled) return

    const handleMove = (event: MouseEvent) => {
      x.set(event.clientX)
      y.set(event.clientY)
    }

    const handleOver = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null
      if (target?.closest('[data-cursor="pointer"]')) {
        setIsPointer(true)
      }
    }

    const handleOut = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null
      const related = event.relatedTarget as HTMLElement | null
      const leftPointer = target?.closest('[data-cursor="pointer"]')
      const stillOnPointer = related?.closest('[data-cursor="pointer"]')
      if (leftPointer && !stillOnPointer) {
        setIsPointer(false)
      }
    }

    window.addEventListener('mousemove', handleMove)
    document.addEventListener('mouseover', handleOver)
    document.addEventListener('mouseout', handleOut)

    return () => {
      window.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseover', handleOver)
      document.removeEventListener('mouseout', handleOut)
    }
  }, [enabled, x, y])

  if (!enabled) return null

  return (
    <>
      <motion.div
        className="fixed left-0 top-0 z-50 h-1.5 w-1.5 rounded-full bg-teal pointer-events-none -translate-x-1/2 -translate-y-1/2"
        style={{ x, y }}
      />
      <motion.div
        className="fixed left-0 top-0 z-50 h-7 w-7 rounded-full border border-teal/30 pointer-events-none -translate-x-1/2 -translate-y-1/2"
        style={{ x: ringX, y: ringY }}
        animate={{ scale: isPointer ? 1.25 : 1, opacity: isPointer ? 0.45 : 0.28 }}
        transition={{ duration: 0.12 }}
      />
    </>
  )
}
