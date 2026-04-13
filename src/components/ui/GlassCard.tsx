import { type MouseEvent, type PropsWithChildren, useCallback, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { cn } from '../../lib/utils'

type GlowColor = 'teal' | 'gold' | 'violet' | 'danger'

type GlassCardProps = PropsWithChildren<{
  className?: string
  glowColor?: GlowColor
  onClick?: () => void
  animate?: boolean
  tilt?: boolean
}>

const glowClasses: Record<GlowColor, string> = {
  teal: 'hover:border-teal/20 hover:shadow-[0_0_18px_rgba(0,255,209,0.08)]',
  gold: 'hover:border-gold/20 hover:shadow-[0_0_18px_rgba(245,200,66,0.08)]',
  violet: 'hover:border-violet/30 hover:shadow-[0_0_18px_rgba(138,90,255,0.1)]',
  danger: 'hover:border-danger/30 hover:shadow-[0_0_18px_rgba(255,59,92,0.1)]',
}

export function GlassCard({
  children,
  className,
  glowColor = 'teal',
  onClick,
  animate: animateIn = false,
  tilt = false,
}: GlassCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null)
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const springX = useSpring(rotateX, { stiffness: 200, damping: 20 })
  const springY = useSpring(rotateY, { stiffness: 200, damping: 20 })

  const handleMove = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (!tilt || !cardRef.current) return
      const rect = cardRef.current.getBoundingClientRect()
      const x = (event.clientX - rect.left) / rect.width - 0.5
      const y = (event.clientY - rect.top) / rect.height - 0.5
      rotateX.set(y * -5)
      rotateY.set(x * 5)
    },
    [rotateX, rotateY, tilt],
  )

  const handleLeave = useCallback(() => {
    if (!tilt) return
    rotateX.set(0)
    rotateY.set(0)
  }, [rotateX, rotateY, tilt])

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={onClick}
      className={cn(
        'bg-glass border border-glass-border/90 rounded-2xl backdrop-blur-[10px] transition-all duration-250 ease-out',
        glowClasses[glowColor],
        className,
      )}
      style={{
        rotateX: tilt ? springX : 0,
        rotateY: tilt ? springY : 0,
        transformPerspective: tilt ? 800 : undefined,
      }}
      initial={
        animateIn
          ? {
              opacity: 0,
              y: 30,
            }
          : undefined
      }
      animate={
        animateIn
          ? {
              opacity: 1,
              y: 0,
            }
          : undefined
      }
      transition={
        animateIn
          ? {
              duration: 0.5,
              ease: [0.25, 0.46, 0.45, 0.94],
            }
          : undefined
      }
    >
      {children}
    </motion.div>
  )
}
