import { motion } from 'framer-motion'
import {
  FileText,
  LayoutDashboard,
  Plus,
  Tag,
  User,
  Vote,
} from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { CountUp } from '../ui/CountUp'
import { GlassCard } from '../ui/GlassCard'
import { cn } from '../../lib/utils'

type NavItem = {
  icon: typeof LayoutDashboard
  label: string
  path: string
  isActive: (pathname: string) => boolean
  highlight?: boolean
  badge?: number
}

const navItems: NavItem[] = [
  {
    icon: LayoutDashboard,
    label: 'Overview',
    path: '/dashboard',
    isActive: (pathname) => pathname === '/dashboard',
  },
  {
    icon: FileText,
    label: 'My Pacts',
    path: '/pacts',
    isActive: (pathname) => pathname === '/pacts' || pathname.startsWith('/pact/'),
  },
  {
    icon: Plus,
    label: 'New Pact',
    path: '/create',
    isActive: (pathname) => pathname === '/create',
    highlight: true,
  },
  {
    icon: Tag,
    label: 'Categories',
    path: '/categories',
    isActive: (pathname) => pathname === '/categories',
  },
  {
    icon: Vote,
    label: 'Vote Queue',
    path: '/pact/SPT-4721/vote',
    isActive: (pathname) => pathname.endsWith('/vote'),
    badge: 3,
  },
  {
    icon: User,
    label: 'Profile',
    path: '/profile',
    isActive: (pathname) => pathname === '/profile',
  },
]

export function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <aside className="h-screen w-[240px] border-r border-glass-border bg-glass/50 backdrop-blur-glass">
      <div className="px-6 py-6">
        <Link
          to="/dashboard"
          className="flex items-center gap-2 font-syne text-lg font-bold text-white"
          data-cursor="pointer"
        >
          <span className="text-teal">*</span> StakePact
        </Link>
      </div>

      <GlassCard className="mx-4 p-3">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-full p-[2px] animate-spin-slow bg-[conic-gradient(from_0deg,#00FFD1,#8A5AFF,#F5C842,#00FFD1)]">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-obsidian font-syne text-sm text-teal">
              AM
            </div>
          </div>
          <div>
            <div className="font-syne text-sm font-bold text-white">Arjun Mehta</div>
            <div className="mt-1 flex items-center gap-2 text-xs text-white/50">
              <span className="text-teal text-sm font-bold">847</span>
              <span className="h-1.5 w-1.5 rounded-full bg-teal animate-pulse" />
              CommitScore
            </div>
          </div>
        </div>
        <div className="mt-4">
          <div className="font-syne text-xl text-gold">
            <CountUp end={24500} prefix="INR " />
          </div>
          <div className="mt-2 h-1 rounded-full bg-white/10">
            <div className="h-full w-[60%] rounded-full bg-gold" />
          </div>
        </div>
      </GlassCard>

      <motion.div
        className="mt-6 space-y-1"
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: { staggerChildren: 0.06 },
          },
        }}
      >
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = item.isActive(location.pathname)

          return (
            <motion.div
              key={item.label}
              variants={{
                hidden: { opacity: 0, x: -20 },
                show: { opacity: 1, x: 0, transition: { duration: 0.4 } },
              }}
            >
              <button
                type="button"
                onClick={() => navigate(item.path)}
                data-cursor="pointer"
                className={cn(
                  'relative mx-2 flex w-[calc(100%-1rem)] items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition-all',
                  isActive
                    ? 'bg-teal/10 border-l-2 border-teal text-teal'
                    : item.highlight
                      ? 'bg-gold/10 text-gold'
                      : 'text-white/40 hover:text-white hover:bg-glass',
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
                {item.badge ? (
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-danger px-2 py-0.5 text-[10px] text-white">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            </motion.div>
          )
        })}
      </motion.div>
    </aside>
  )
}
