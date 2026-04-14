import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

type BadgeVariant = 'teal' | 'gold' | 'violet' | 'danger' | 'blue' | 'red' | 'gray'
type BadgeSize = 'xs' | 'sm' | 'md'

type BadgeProps = {
  children: React.ReactNode
  variant: BadgeVariant
  size?: BadgeSize
  dot?: boolean
  pulse?: boolean
  className?: string
}

const variantClasses: Record<BadgeVariant, { shell: string; dot: string }> = {
  teal: {
    shell: 'bg-[#00FFD1]/10 border border-[#00FFD1]/30 text-[#00FFD1]',
    dot: 'bg-[#00FFD1]',
  },
  gold: {
    shell: 'bg-[#F5C842]/10 border border-[#F5C842]/30 text-[#F5C842]',
    dot: 'bg-[#F5C842]',
  },
  violet: {
    shell: 'bg-[#8A5AFF]/10 border border-[#8A5AFF]/30 text-[#8A5AFF]',
    dot: 'bg-[#8A5AFF]',
  },
  danger: {
    shell: 'bg-[#FF3B5C]/10 border border-[#FF3B5C]/30 text-[#FF3B5C]',
    dot: 'bg-[#FF3B5C]',
  },
  blue: {
    shell: 'bg-[#3B82F6]/10 border border-[#3B82F6]/30 text-[#3B82F6]',
    dot: 'bg-[#3B82F6]',
  },
  red: {
    shell: 'bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444]',
    dot: 'bg-[#EF4444]',
  },
  gray: {
    shell: 'bg-white/10 border border-white/20 text-white/70',
    dot: 'bg-white/60',
  },
}

const sizeClasses: Record<BadgeSize, string> = {
  xs: 'px-2 py-0.5 text-[10px] tracking-[0.14em]',
  sm: 'px-2.5 py-1 text-[11px] tracking-[0.12em]',
  md: 'px-3 py-1.5 text-xs tracking-[0.1em]',
}

export function Badge({
  children,
  variant,
  size = 'sm',
  dot = false,
  pulse = false,
  className,
}: BadgeProps) {
  const variantStyle = variantClasses[variant]

  return (
    <motion.span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-semibold uppercase',
        variantStyle.shell,
        sizeClasses[size],
        className,
      )}
      style={{ fontFamily: 'Space Grotesk, sans-serif' }}
      initial={{ opacity: 0, y: 2 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      {dot ? (
        <span
          className={cn('h-1.5 w-1.5 rounded-full', variantStyle.dot, pulse ? 'animate-pulse' : '')}
          aria-hidden="true"
        />
      ) : null}
      {children}
    </motion.span>
  )
}

export default Badge
