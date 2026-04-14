import { motion } from 'framer-motion'
import type { Category } from '../../types/pact.types'

type CategoryBadgeProps = {
  category: Category
  className?: string
}

const CATEGORY_META: Record<Category, { color: string; icon: string; label: string }> = {
  education: { color: '#00FFD1', icon: '🎓', label: 'Education' },
  corporate: { color: '#3B82F6', icon: '🏢', label: 'Corporate' },
  legal: { color: '#EF4444', icon: '⚖️', label: 'Legal' },
  government: { color: '#8A5AFF', icon: '🏛️', label: 'Government' },
  personal: { color: '#F5C842', icon: '🏋️', label: 'Personal' },
}

export default function CategoryBadge({ category, className }: CategoryBadgeProps) {
  const meta = CATEGORY_META[category]

  return (
    <motion.span
      className={className}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        padding: '0.32rem 0.68rem',
        borderRadius: '9999px',
        border: `1px solid ${meta.color}66`,
        backgroundColor: `${meta.color}14`,
        color: meta.color,
        fontSize: '0.72rem',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        fontWeight: 600,
      }}
    >
      <span aria-hidden="true">{meta.icon}</span>
      <span>{meta.label}</span>
    </motion.span>
  )
}
