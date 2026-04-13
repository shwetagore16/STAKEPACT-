import { useCallback, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { cn } from '../../lib/utils'

type Variant = 'gold' | 'teal' | 'ghost'

type MagneticButtonProps = {
  children: React.ReactNode
  variant: Variant
  className?: string
  onClick?: () => void
}

const variantClasses: Record<Variant, string> = {
  gold: 'bg-gold/95 border border-gold/30 text-obsidian font-semibold font-syne rounded-sm btn-gold-border hover:bg-gold',
  teal: 'bg-transparent border border-teal/25 text-teal hover:bg-teal/5 rounded-sm',
  ghost: 'bg-transparent border border-white/12 text-white/70 hover:border-white/28 hover:text-white/85 rounded-sm',
}

export function MagneticButton({
  children,
  variant,
  className,
  onClick,
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 300, damping: 25 })
  const springY = useSpring(y, { stiffness: 300, damping: 25 })

  const handleMove = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (!buttonRef.current) return
      const rect = buttonRef.current.getBoundingClientRect()
      const deltaX = event.clientX - (rect.left + rect.width / 2)
      const deltaY = event.clientY - (rect.top + rect.height / 2)
      const distance = Math.hypot(deltaX, deltaY)
      if (distance > 48) return
      x.set(deltaX * 0.14)
      y.set(deltaY * 0.14)
    },
    [x, y],
  )

  const handleLeave = useCallback(() => {
    x.set(0)
    y.set(0)
  }, [x, y])

  return (
    <motion.button
      ref={buttonRef}
      type="button"
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={onClick}
      className={cn(
        'relative inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm tracking-[0.02em] transition-colors duration-200 select-none',
        variantClasses[variant],
        className,
      )}
      style={{ x: springX, y: springY }}
      whileTap={{ scale: 0.97 }}
      data-cursor="pointer"
    >
      <span className="relative z-10">{children}</span>
    </motion.button>
  )
}
