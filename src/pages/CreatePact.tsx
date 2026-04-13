import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from 'framer-motion'
import {
  Calendar,
  Camera,
  Check,
  ChevronRight,
  Link2,
  Lock,
  Plus,
  Shield,
  User,
  Users,
  X,
  Zap,
} from 'lucide-react'
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import confetti from 'canvas-confetti'
import { GlassCard } from '../components/ui/GlassCard'
import { MagneticButton } from '../components/ui/MagneticButton'
import { FlipClock } from '../components/ui/FlipClock'
import { CountUp } from '../components/ui/CountUp'
import { cn } from '../lib/utils'

type Step = 0 | 1 | 2

const steps = ['Define', 'Stake', 'Sign'] as const

const pactSchema = z.object({
  title: z.string().min(3, 'Title is required').max(80, 'Max 80 characters'),
  category: z.string().min(1, 'Pick a category'),
  deadline: z.date(),
  verification: z.string().min(1, 'Select verification'),
  stake: z.number().min(500).max(100000),
  mode: z.enum(['solo', 'group']),
})

type PactForm = z.infer<typeof pactSchema>

type Category = {
  id: string
  title: string
  description: string
  glow: 'teal' | 'gold' | 'violet' | 'danger'
  icon: typeof Users
  area: string
  selectedClass: string
  iconClass: string
}

type VerificationOption = {
  id: string
  title: string
  description: string
  icon: typeof Link2
}

const categories: Category[] = [
  {
    id: 'government',
    title: 'Government',
    description: 'Agency level compliance and delivery',
    glow: 'violet',
    icon: Shield,
    area: 'a',
    selectedClass: 'border-violet/60 bg-violet/10',
    iconClass: 'text-violet',
  },
  {
    id: 'corporate',
    title: 'Corporate',
    description: 'Teams hitting enterprise milestones',
    glow: 'teal',
    icon: Users,
    area: 'b',
    selectedClass: 'border-sky-400/60 bg-sky-400/10',
    iconClass: 'text-sky-300',
  },
  {
    id: 'legal',
    title: 'Legal',
    description: 'Court aligned enforcement workflow',
    glow: 'danger',
    icon: Lock,
    area: 'c',
    selectedClass: 'border-danger/60 bg-danger/10',
    iconClass: 'text-danger',
  },
  {
    id: 'education',
    title: 'Education',
    description: 'Cohort driven accountability',
    glow: 'teal',
    icon: Zap,
    area: 'd',
    selectedClass: 'border-teal/60 bg-teal/10',
    iconClass: 'text-teal',
  },
  {
    id: 'personal',
    title: 'Personal',
    description: 'Self commitments with auto checks',
    glow: 'gold',
    icon: User,
    area: 'e',
    selectedClass: 'border-gold/60 bg-gold/10',
    iconClass: 'text-gold',
  },
]

const verificationOptions: VerificationOption[] = [
  {
    id: 'auto',
    title: 'Auto-verify',
    description: 'GitHub, Strava, or API signals',
    icon: Link2,
  },
  {
    id: 'group',
    title: 'Group Vote',
    description: 'Stakeholders sign off',
    icon: Users,
  },
  {
    id: 'verifier',
    title: 'Designated Verifier',
    description: 'Third-party attestation',
    icon: Shield,
  },
  {
    id: 'ai',
    title: 'AI Analysis',
    description: 'Model-based validation',
    icon: Camera,
  },
]

const paymentMethods = ['UPI', 'GPay', 'PhonePe', 'Paytm', 'Debit Card', 'NetBanking']

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]


function StepIndicator({ currentStep }: { currentStep: Step }) {
  return (
    <div className="flex items-center gap-0">
      {steps.map((label, index) => {
        const stepIndex = index as Step
        const isComplete = stepIndex < currentStep
        const isActive = stepIndex === currentStep
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-colors',
                  isComplete && 'bg-teal text-obsidian',
                  isActive && 'border-2 border-teal bg-teal/20 text-teal',
                  !isComplete && !isActive && 'border border-glass-border bg-glass text-white/30',
                )}
              >
                {isComplete ? <Check className="h-4 w-4" /> : index + 1}
              </div>
              <div
                className={cn(
                  'mt-2 font-mono text-[10px] tracking-[3px]',
                  isActive && 'text-teal',
                  isComplete && !isActive && 'text-white/50',
                  !isComplete && !isActive && 'text-white/20',
                )}
              >
                {label.toUpperCase()}
              </div>
            </div>
            {index < steps.length - 1 ? (
              <div className="mx-4 h-px w-16 bg-glass-border">
                <motion.div
                  className="h-px bg-teal"
                  initial={{ width: 0 }}
                  animate={{ width: isComplete ? '100%' : '0%' }}
                  transition={{ duration: 0.6 }}
                />
              </div>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}

function PreviewField({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <motion.div
      key={`${label}-${value}`}
      animate={{ backgroundColor: ['rgba(0,255,209,0.1)', 'rgba(0,0,0,0)'] }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-between border-b border-glass-border py-3"
    >
      <span className="font-mono text-[10px] tracking-[2px] text-white/30">
        {label}
      </span>
      <span className={cn('text-sm text-white', accent)}>{value || '--'}</span>
    </motion.div>
  )
}

function StakeSlider({
  value,
  onChange,
  min,
  max,
}: {
  value: number
  onChange: (value: number) => void
  min: number
  max: number
}) {
  const trackRef = useRef<HTMLDivElement | null>(null)
  const draggingRef = useRef(false)
  const thumbX = useMotionValue(0)
  const springX = useSpring(thumbX, { stiffness: 250, damping: 25 })

  const percent = (value - min) / (max - min)

  const updateFromClientX = useCallback(
    (clientX: number) => {
      if (!trackRef.current) return
      const rect = trackRef.current.getBoundingClientRect()
      const clamped = Math.min(rect.width, Math.max(0, clientX - rect.left))
      const nextPercent = clamped / rect.width
      const nextValue = Math.round(min + nextPercent * (max - min))
      onChange(nextValue)
      thumbX.set(clamped)
    },
    [max, min, onChange, thumbX],
  )

  useEffect(() => {
    if (!trackRef.current) return
    const rect = trackRef.current.getBoundingClientRect()
    thumbX.set(rect.width * percent)
  }, [percent, thumbX])

  useEffect(() => {
    const handleMove = (event: globalThis.MouseEvent) => {
      if (!draggingRef.current) return
      updateFromClientX(event.clientX)
    }

    const handleUp = () => {
      draggingRef.current = false
    }

    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseup', handleUp)

    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseup', handleUp)
    }
  }, [updateFromClientX])

  return (
    <div className="relative mt-6" ref={trackRef}>
      <div
        className="h-1 w-full rounded-full bg-white/10"
        onMouseDown={(event) => {
          draggingRef.current = true
          updateFromClientX(event.clientX)
        }}
      />
      <div
        className="absolute left-0 top-0 h-1 rounded-full bg-gradient-to-r from-teal to-gold"
        style={{ width: `${percent * 100}%` }}
      />
      <motion.div
        className="absolute top-1/2 h-6 w-6 -translate-y-1/2 -translate-x-1/2 rounded-full bg-gold shadow-[0_0_20px_rgba(245,200,66,0.5)]"
        style={{ x: springX }}
        onMouseDown={(event) => {
          draggingRef.current = true
          updateFromClientX(event.clientX)
        }}
        whileTap={{ scale: 1.3 }}
      />
    </div>
  )
}

export default function CreatePact() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState<Step>(0)
  const [direction, setDirection] = useState(1)
  const [mode, setMode] = useState<'solo' | 'group'>('solo')
  const [showCalendar, setShowCalendar] = useState(false)
  const [viewMonth, setViewMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedHour, setSelectedHour] = useState(12)
  const [selectedMinute, setSelectedMinute] = useState(0)
  const [stakeValue, setStakeValue] = useState(5000)
  const [memberStake, setMemberStake] = useState(2000)
  const [members, setMembers] = useState<string[]>([])
  const [memberInput, setMemberInput] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('UPI')
  const [isChecked, setIsChecked] = useState(false)
  const [submitState, setSubmitState] = useState<'idle' | 'writing' | 'confirming' | 'done'>('idle')
  const signatureRef = useRef<SignatureHandle | null>(null)

  const previewId = useMemo(() => Math.floor(10000 + Math.random() * 90000), [])

  const {
    register,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<PactForm>({
    resolver: zodResolver(pactSchema),
    defaultValues: {
      title: '',
      category: '',
      deadline: new Date(),
      verification: '',
      stake: stakeValue,
      mode,
    },
  })

  const title = watch('title')
  const category = watch('category')
  const verification = watch('verification')

  useEffect(() => {
    setValue('stake', mode === 'solo' ? stakeValue : memberStake)
  }, [memberStake, mode, setValue, stakeValue])

  useEffect(() => {
    setValue('mode', mode)
  }, [mode, setValue])

  useEffect(() => {
    if (!selectedDate) return
    const date = new Date(selectedDate)
    date.setHours(selectedHour, selectedMinute, 0, 0)
    setValue('deadline', date)
  }, [selectedDate, selectedHour, selectedMinute, setValue])

  useEffect(() => {
    if (submitState !== 'done') return
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#00FFD1', '#F5C842', '#8A5AFF', '#ffffff'],
    })
  }, [submitState])

  const formattedDeadline = useMemo(() => {
    if (!selectedDate) return ''
    const date = new Date(selectedDate)
    date.setHours(selectedHour, selectedMinute, 0, 0)
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date)
  }, [selectedDate, selectedHour, selectedMinute])

  const relativeDeadline = useMemo(() => {
    if (!selectedDate) return ''
    const now = new Date()
    const target = new Date(selectedDate)
    target.setHours(selectedHour, selectedMinute, 0, 0)
    const diff = Math.max(0, target.getTime() - now.getTime())
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(hours / 24)
    const remainingHours = hours % 24
    return `That's ${days} days, ${remainingHours} hours from now`
  }, [selectedDate, selectedHour, selectedMinute])

  const membersCount = mode === 'group' ? members.length + 1 : 1
  const totalStake = membersCount * memberStake
  const bonus = membersCount > 1 ? Math.round(totalStake / membersCount / 5) : 0

  const selectedCategory = categories.find((item) => item.id === category)?.title || ''
  const selectedVerification =
    verificationOptions.find((item) => item.id === verification)?.title || ''

  const contractValues = {
    commitment: title,
    category: selectedCategory,
    deadline: formattedDeadline,
    stake: mode === 'solo' ? stakeValue : memberStake,
    members: membersCount,
    verification: selectedVerification,
  }

  const previewDeadline = useMemo(() => {
    if (!selectedDate) return null
    const date = new Date(selectedDate)
    date.setHours(selectedHour, selectedMinute, 0, 0)
    return date
  }, [selectedDate, selectedHour, selectedMinute])

  const calendarDays = useMemo(() => {
    const year = viewMonth.getFullYear()
    const month = viewMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const startDay = firstDay.getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const cells = [] as Array<Date | null>

    for (let i = 0; i < 35; i += 1) {
      const dayIndex = i - startDay + 1
      if (dayIndex <= 0 || dayIndex > daysInMonth) {
        cells.push(null)
      } else {
        cells.push(new Date(year, month, dayIndex))
      }
    }

    return cells
  }, [viewMonth])

  const goToStep = (next: Step) => {
    setDirection(next > currentStep ? 1 : -1)
    setCurrentStep(next)
  }

  const handleNext = async () => {
    if (currentStep === 0) {
      const valid = await trigger(['title', 'category', 'verification'])
      if (!valid) return
      if (!selectedDate) return
      goToStep(1)
    } else if (currentStep === 1) {
      goToStep(2)
    }
  }

  const handleCreate = () => {
    if (!isChecked || submitState !== 'idle') return
    setSubmitState('writing')
    setTimeout(() => {
      setSubmitState('confirming')
    }, 1200)
    setTimeout(() => {
      setSubmitState('done')
    }, 2400)
  }

  const addMember = () => {
    const trimmed = memberInput.trim()
    if (!trimmed || !trimmed.includes('@')) return
    setMembers((prev) => [...prev, trimmed])
    setMemberInput('')
  }

  return (
    <div className="app-page bg-obsidian text-white">
      <div className="app-container flex max-w-[1280px] flex-col gap-10 py-4 lg:flex-row">
          <div className="w-full lg:w-[55%]">
            <StepIndicator currentStep={currentStep} />
            <input type="hidden" {...register('category')} />
            <input type="hidden" {...register('verification')} />
            <input type="hidden" {...register('deadline', { valueAsDate: true })} />
            <input type="hidden" {...register('stake', { valueAsNumber: true })} />
            <input type="hidden" {...register('mode')} />

            <AnimatePresence mode="wait">
              {currentStep === 0 && (
                <motion.div
                  key="define"
                  initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="mt-12">
                    <div className="grid gap-4" style={{ gridTemplateAreas: '"a b" "c d" "e e"' }}>
                      {categories.map((item) => {
                        const Icon = item.icon
                        const isSelected = category === item.id
                        return (
                          <motion.div
                            key={item.id}
                            style={{ gridArea: item.area }}
                            animate={{ scale: isSelected ? 1.02 : 1 }}
                          >
                            <GlassCard
                              tilt
                              glowColor={item.glow}
                              className={cn(
                                'relative cursor-pointer p-5 transition-all',
                                isSelected && item.selectedClass,
                              )}
                              onClick={() => setValue('category', item.id, { shouldValidate: true })}
                            >
                              <Icon className={cn('h-10 w-10', item.iconClass)} />
                              <div className="mt-4 font-syne text-lg text-white">{item.title}</div>
                              <div className="mt-2 text-sm text-white/40">{item.description}</div>
                              {isSelected ? (
                                <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-teal/20 text-teal">
                                  <Check className="h-4 w-4" />
                                </span>
                              ) : null}
                            </GlassCard>
                          </motion.div>
                        )
                      })}
                    </div>

                    <div className="mt-10">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder=" "
                          className="peer w-full border-b border-glass-border bg-transparent py-4 text-base text-white outline-none focus:border-teal"
                          {...register('title')}
                        />
                        <label className="pointer-events-none absolute top-4 text-base text-white/30 transition-all duration-200 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-teal peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs">
                          Pact title
                        </label>
                        <span className="absolute bottom-2 right-0 text-xs text-white/20">
                          {title.length}/80
                        </span>
                      </div>
                      {errors.title ? (
                        <p className="mt-2 text-xs text-danger">{errors.title.message}</p>
                      ) : null}
                    </div>

                    <div className="mt-10 relative">
                      <button
                        type="button"
                        onClick={() => setShowCalendar((prev) => !prev)}
                        className="flex w-full items-center justify-between rounded-xl border border-glass-border bg-glass px-4 py-3 text-sm text-white/70"
                        data-cursor="pointer"
                      >
                        <span>{formattedDeadline || 'Select deadline'}</span>
                        <Calendar className="h-4 w-4 text-white/40" />
                      </button>

                      <AnimatePresence>
                        {showCalendar ? (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute left-0 top-full z-50 mt-3"
                          >
                            <GlassCard className="w-72 p-4">
                              <div className="flex items-center justify-between">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setViewMonth(
                                      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
                                    )
                                  }
                                  className="text-white/50"
                                >
                                  <ChevronRight className="h-4 w-4 rotate-180" />
                                </button>
                                <div className="font-syne text-sm">
                                  {monthNames[viewMonth.getMonth()]} {viewMonth.getFullYear()}
                                </div>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setViewMonth(
                                      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
                                    )
                                  }
                                  className="text-white/50"
                                >
                                  <ChevronRight className="h-4 w-4" />
                                </button>
                              </div>

                              <div className="mt-4 grid grid-cols-7 gap-2 text-center text-xs text-white/30">
                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                                  <div key={day}>{day}</div>
                                ))}
                              </div>

                              <div className="mt-3 grid grid-cols-7 gap-2 text-center text-sm">
                                {calendarDays.map((date, index) => {
                                  if (!date) return <div key={`empty-${index}`} />
                                  const isToday =
                                    new Date().toDateString() === date.toDateString()
                                  const isSelected =
                                    selectedDate && date.toDateString() === selectedDate.toDateString()
                                  const isPast =
                                    date < new Date(new Date().setHours(0, 0, 0, 0))
                                  return (
                                    <button
                                      key={date.toISOString()}
                                      type="button"
                                      disabled={isPast}
                                      onClick={() => setSelectedDate(date)}
                                      className={cn(
                                        'relative flex h-8 w-8 items-center justify-center rounded-full',
                                        isSelected && 'bg-teal text-obsidian font-bold',
                                        !isSelected && !isPast && 'hover:bg-glass',
                                        isPast && 'text-white/20 cursor-not-allowed',
                                      )}
                                    >
                                      {date.getDate()}
                                      {isToday ? (
                                        <span className="absolute -bottom-1 h-1 w-1 rounded-full bg-gold" />
                                      ) : null}
                                    </button>
                                  )
                                })}
                              </div>

                              <div className="mt-4 grid grid-cols-2 gap-4">
                                <div className="h-24 overflow-y-scroll snap-y snap-mandatory text-center">
                                  {Array.from({ length: 24 }).map((_, hour) => (
                                    <button
                                      key={hour}
                                      type="button"
                                      onClick={() => setSelectedHour(hour)}
                                      className={cn(
                                        'block w-full snap-center py-1 text-sm',
                                        selectedHour === hour ? 'text-teal font-bold' : 'text-white/30',
                                      )}
                                    >
                                      {hour.toString().padStart(2, '0')}
                                    </button>
                                  ))}
                                </div>
                                <div className="h-24 overflow-y-scroll snap-y snap-mandatory text-center">
                                  {Array.from({ length: 60 }).map((_, minute) => (
                                    <button
                                      key={minute}
                                      type="button"
                                      onClick={() => setSelectedMinute(minute)}
                                      className={cn(
                                        'block w-full snap-center py-1 text-sm',
                                        selectedMinute === minute
                                          ? 'text-teal font-bold'
                                          : 'text-white/30',
                                      )}
                                    >
                                      {minute.toString().padStart(2, '0')}
                                    </button>
                                  ))}
                                </div>
                              </div>
                              {selectedDate ? (
                                <motion.p
                                  initial={{ opacity: 0, y: 4 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="mt-3 text-sm text-teal"
                                >
                                  {relativeDeadline}
                                </motion.p>
                              ) : null}
                            </GlassCard>
                          </motion.div>
                        ) : null}
                      </AnimatePresence>
                    </div>

                    <div className="mt-10 grid gap-4">
                      {verificationOptions.map((option) => {
                        const Icon = option.icon
                        const isSelected = verification === option.id
                        return (
                          <GlassCard
                            key={option.id}
                            tilt
                            glowColor="teal"
                            className={cn(
                              'flex cursor-pointer items-center gap-4 p-4',
                              isSelected && 'border-teal/50 bg-teal/10',
                            )}
                            onClick={() =>
                              setValue('verification', option.id, { shouldValidate: true })
                            }
                          >
                            <Icon className="h-5 w-5 text-teal" />
                            <div>
                              <div className="text-sm text-white">{option.title}</div>
                              <div className="text-xs text-white/40">{option.description}</div>
                            </div>
                            {isSelected ? (
                              <span className="ml-auto text-teal">
                                <Check className="h-4 w-4" />
                              </span>
                            ) : null}
                          </GlassCard>
                        )
                      })}
                    </div>

                    <MagneticButton
                      variant="gold"
                      className="mt-8 w-full"
                      onClick={handleNext}
                    >
                      Next: Set the Stake
                      <ChevronRight className="h-4 w-4" />
                    </MagneticButton>
                  </div>
                </motion.div>
              )}

              {currentStep === 1 && (
                <motion.div
                  key="stake"
                  initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="mt-12">
                    <div className="relative flex w-full max-w-sm rounded-full border border-glass-border bg-glass p-1">
                      <motion.div
                        className="absolute top-1 h-[calc(100%-8px)] rounded-full"
                        layout
                        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                        style={{
                          left: mode === 'solo' ? '4px' : '50%',
                          width: 'calc(50% - 4px)',
                          background:
                            mode === 'solo' ? 'rgba(0,255,209,0.3)' : 'rgba(245,200,66,0.2)',
                        }}
                      />
                      <button
                        type="button"
                        className={cn(
                          'relative flex-1 rounded-full py-2 text-sm',
                          mode === 'solo' ? 'text-teal' : 'text-white/40',
                        )}
                        onClick={() => setMode('solo')}
                        data-cursor="pointer"
                      >
                        Solo Pact
                      </button>
                      <button
                        type="button"
                        className={cn(
                          'relative flex-1 rounded-full py-2 text-sm',
                          mode === 'group' ? 'text-gold' : 'text-white/40',
                        )}
                        onClick={() => setMode('group')}
                        data-cursor="pointer"
                      >
                        Group Circle
                      </button>
                    </div>

                    <AnimatePresence mode="wait">
                      {mode === 'solo' ? (
                        <motion.div
                          key="solo"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          <div className="mt-10 text-center font-syne text-6xl text-gold">
                            INR {new Intl.NumberFormat('en-IN').format(stakeValue)}
                          </div>
                          <StakeSlider
                            value={stakeValue}
                            onChange={setStakeValue}
                            min={500}
                            max={100000}
                          />

                          <div className="mt-6">
                            <div className="text-sm text-white/50">Commitment Intensity</div>
                            <div className="mt-2 flex gap-2">
                              {Array.from({ length: 5 }).map((_, index) => (
                                <motion.div
                                  key={`fire-${index}`}
                                  animate={{ scale: index < Math.ceil(stakeValue / 20000) ? 1.1 : 1 }}
                                  className={cn(
                                    'flex h-8 w-8 items-center justify-center rounded-full border',
                                    index < Math.ceil(stakeValue / 20000)
                                      ? 'border-gold text-gold'
                                      : 'border-white/10 text-white/20',
                                  )}
                                >
                                  <Zap className="h-4 w-4" />
                                </motion.div>
                              ))}
                            </div>
                          </div>

                          <div className="mt-6 grid gap-4 md:grid-cols-2">
                            <GlassCard className="border border-danger/20 bg-danger/5 p-4">
                              <div className="text-xs text-danger">If you miss</div>
                              <div className="mt-2 text-sm text-white">
                                Lose INR {new Intl.NumberFormat('en-IN').format(stakeValue)}
                              </div>
                            </GlassCard>
                            <GlassCard className="border border-teal/20 bg-teal/5 p-4">
                              <div className="text-xs text-teal">If you deliver</div>
                              <div className="mt-2 text-sm text-white">
                                Get INR {new Intl.NumberFormat('en-IN').format(stakeValue)} back
                              </div>
                            </GlassCard>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="group"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          <div className="mt-8">
                            <div className="flex items-center gap-3">
                              <input
                                type="text"
                                value={memberInput}
                                onChange={(event) => setMemberInput(event.target.value)}
                                onKeyDown={(event) => {
                                  if (event.key === 'Enter') {
                                    event.preventDefault()
                                    addMember()
                                  }
                                }}
                                placeholder="Add member email"
                                className="flex-1 rounded-xl border border-glass-border bg-glass px-4 py-2 text-sm text-white/70 outline-none focus:border-teal/50"
                              />
                              <MagneticButton variant="ghost" onClick={addMember}>
                                <Plus className="h-4 w-4" />
                              </MagneticButton>
                            </div>
                            <div className="mt-4 flex flex-wrap gap-2">
                              <AnimatePresence>
                                {members.map((member) => (
                                  <motion.div
                                    key={member}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                                    className="flex items-center gap-2 rounded-full border border-glass-border bg-glass px-3 py-1 text-xs"
                                  >
                                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-obsidian text-[10px] text-teal">
                                      {member.slice(0, 2).toUpperCase()}
                                    </span>
                                    {member}
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setMembers((prev) => prev.filter((value) => value !== member))
                                      }
                                      className="text-white/40"
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  </motion.div>
                                ))}
                              </AnimatePresence>
                            </div>
                          </div>

                          <div className="mt-6">
                            <div className="text-center font-syne text-5xl text-gold">
                              INR {new Intl.NumberFormat('en-IN').format(memberStake)}
                            </div>
                            <StakeSlider
                              value={memberStake}
                              onChange={setMemberStake}
                              min={500}
                              max={100000}
                            />
                          </div>

                          <GlassCard className="mt-6 border border-gold/20 p-4">
                            <div className="font-syne text-xl text-white">
                              <CountUp end={membersCount} trigger /> members x INR{' '}
                              <CountUp end={memberStake} trigger /> = INR{' '}
                              <CountUp end={totalStake} trigger />
                            </div>
                            <div className="mt-2 text-xs text-white/40">
                              If {Math.max(1, membersCount - 1)} deliver and 1 fails: each winner earns
                              INR {new Intl.NumberFormat('en-IN').format(bonus)} bonus
                            </div>
                          </GlassCard>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="mt-8">
                      <div className="text-sm text-white/50">Payment method</div>
                      <div className="mt-3 grid grid-cols-3 gap-3">
                        {paymentMethods.map((method) => {
                          const isSelected = paymentMethod === method
                          return (
                            <GlassCard
                              key={method}
                              className={cn(
                                'flex items-center justify-center py-3 text-xs cursor-pointer',
                                isSelected && 'border-teal/50 text-teal',
                              )}
                              onClick={() => setPaymentMethod(method)}
                            >
                              {method}
                              {isSelected ? <Check className="ml-2 h-3 w-3" /> : null}
                            </GlassCard>
                          )
                        })}
                      </div>
                    </div>

                    <MagneticButton
                      variant="gold"
                      className="mt-8 w-full"
                      onClick={handleNext}
                    >
                      Next: Review and Sign
                      <ChevronRight className="h-4 w-4" />
                    </MagneticButton>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="sign"
                  initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="mt-12">
                    <SignatureCanvas ref={signatureRef} />

                    <div className="mt-3 flex items-center gap-3 text-xs">
                      <button
                        type="button"
                        className="rounded-full border border-glass-border px-3 py-1 text-white/50"
                        onClick={() => signatureRef.current?.clear()}
                      >
                        Clear
                      </button>
                      <span className="text-white/30">OR</span>
                      <button
                        type="button"
                        className="rounded-full border border-teal/40 px-3 py-1 text-teal"
                      >
                        Sign with DigiLocker
                      </button>
                    </div>

                    <div className="mt-6">
                      <GlassCard className="p-5">
                        <div className="grid gap-3 text-sm">
                          <SummaryRow label="Commitment" value={title || '--'} />
                          <SummaryRow label="Category" value={selectedCategory || '--'} />
                          <SummaryRow label="Deadline" value={formattedDeadline || '--'} />
                          <SummaryRow
                            label="Stake"
                            value={`INR ${new Intl.NumberFormat('en-IN').format(
                              mode === 'solo' ? stakeValue : memberStake,
                            )}`}
                          />
                          <SummaryRow label="Members" value={`${membersCount} members`} />
                          <SummaryRow label="Verification" value={selectedVerification || '--'} />
                        </div>
                      </GlassCard>
                    </div>

                    <GlassCard className="mt-6 border border-teal/20 p-5">
                      <div className="flex items-center gap-3 text-sm text-white/70">
                        <span className="text-teal">Linking to Algorand</span>
                        <div className="flex items-end gap-1">
                          {Array.from({ length: 3 }).map((_, index) => (
                            <span
                              key={`block-${index}`}
                              className="h-2 w-2 animate-block-stack rounded-sm bg-teal/60"
                              style={{ animationDelay: `${index * 150}ms` }}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="mt-3 text-xs text-white/40">
                        Smart contract executes automatically on {formattedDeadline || 'your deadline'}.
                      </p>
                      <p className="mt-2 text-xs text-white/40">
                        Your INR never leaves INR - conversion happens invisibly.
                      </p>
                      <div
                        className="mt-4 flex items-start gap-3 cursor-pointer"
                        onClick={() => setIsChecked((prev) => !prev)}
                        data-cursor="pointer"
                      >
                        <div
                          className={cn(
                            'flex h-5 w-5 items-center justify-center rounded border',
                            isChecked ? 'border-teal bg-teal/20 text-teal' : 'border-white/20',
                          )}
                        >
                          {isChecked ? <Check className="h-3 w-3" /> : null}
                        </div>
                        <p className="text-xs text-white/50">
                          I understand this commitment is binding and enforced by code, not courts.
                        </p>
                      </div>
                    </GlassCard>

                    <MagneticButton
                      variant="gold"
                      className="mt-6 w-full"
                      onClick={handleCreate}
                    >
                      {submitState === 'idle' && (
                        <span className="flex items-center gap-2">
                          <Lock className="h-4 w-4" /> Create Pact
                        </span>
                      )}
                      {submitState === 'writing' && (
                        <span className="flex items-center gap-2">
                          <Spinner /> Writing to Algorand...
                        </span>
                      )}
                      {submitState === 'confirming' && (
                        <span className="flex items-center gap-2">
                          <Spinner /> Confirming transaction...
                        </span>
                      )}
                    </MagneticButton>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="w-full lg:w-[45%]">
            <GlassCard className="sticky top-8 min-h-[400px] p-6">
              <div className="relative">
                <div className="font-mono text-[10px] tracking-[4px] text-teal">
                  STAKEPACT CONTRACT
                </div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                  <span className="-rotate-[30deg] font-syne text-6xl text-white/[0.03]">DRAFT</span>
                </div>
                <div className="mt-2 text-right font-mono text-xs text-white/20">
                  #SPT-{previewId}
                </div>
              </div>

              <div className="mt-6">
                <PreviewField label="Commitment" value={contractValues.commitment} />
                <PreviewField
                  label="Category"
                  value={contractValues.category}
                  accent={contractValues.category ? 'text-teal' : ''}
                />
                <PreviewField label="Deadline" value={contractValues.deadline} />
                <PreviewField
                  label="Stake"
                  value={
                    contractValues.stake
                      ? `INR ${new Intl.NumberFormat('en-IN').format(contractValues.stake)}`
                      : ''
                  }
                  accent="text-gold"
                />
                <PreviewField
                  label="Members"
                  value={contractValues.members ? `${contractValues.members} members` : ''}
                />
                <PreviewField
                  label="Verification"
                  value={contractValues.verification}
                  accent="text-teal"
                />
              </div>

              <div className="mt-6">
                <AnimatePresence mode="wait">
                  {currentStep < 2 ? (
                    <motion.div
                      key="draft"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="inline-flex items-center gap-2 rounded-full bg-amber-400/10 px-3 py-1 text-xs text-amber-300"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
                      UNSIGNED DRAFT
                    </motion.div>
                  ) : (
                    <motion.div
                      key="ready"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="inline-flex items-center gap-2 rounded-full bg-teal/10 px-3 py-1 text-xs text-teal"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-teal" />
                      READY TO SIGN
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {previewDeadline ? (
                <div className="mt-6">
                  <FlipClock targetDate={previewDeadline} size="sm" />
                </div>
              ) : null}
            </GlassCard>
          </div>
        </div>

      <AnimatePresence>
        {submitState === 'done' ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian/95"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="flex flex-col items-center text-center"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <motion.svg width="160" height="160" viewBox="0 0 160 160" fill="none">
                <motion.circle
                  cx="80"
                  cy="80"
                  r="60"
                  stroke="#00FFD1"
                  strokeWidth="4"
                  strokeDasharray="380"
                  strokeDashoffset="380"
                  animate={{ strokeDashoffset: 0 }}
                  transition={{ duration: 1 }}
                />
                <motion.path
                  d="M 40 80 L 70 110 L 130 50"
                  stroke="#00FFD1"
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, ease: 'easeInOut' }}
                />
              </motion.svg>
              <motion.h2
                className="mt-6 font-syne text-3xl"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Pact #SPT-2024-08472 Created
              </motion.h2>
              <motion.div
                className="mt-2 flex items-center gap-2 text-sm text-teal"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                TX: 0x3fa...c912
                <button type="button" className="rounded-full border border-teal/40 px-2 py-0.5 text-xs">
                  Copy
                </button>
              </motion.div>
              <motion.p
                className="mt-3 text-sm text-white/50"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                Your INR 5,000 is locked in escrow.
              </motion.p>
              <MagneticButton
                variant="gold"
                className="mt-8"
                onClick={() => navigate('/pact/new')}
              >
                Go to Pact
                <ChevronRight className="h-4 w-4" />
              </MagneticButton>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-glass-border py-2">
      <span className="font-mono text-[10px] tracking-[2px] text-white/30">
        {label.toUpperCase()}
      </span>
      <span className="text-sm text-white">{value}</span>
    </div>
  )
}

function Spinner() {
  return (
    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
  )
}

type SignatureHandle = {
  clear: () => void
}

const SignatureCanvas = forwardRef<SignatureHandle>(function SignatureCanvas(_, ref) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const isDrawing = useRef(false)
  const lastPoint = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const resize = () => {
      const parent = canvas.parentElement
      if (!parent) return
      canvas.width = parent.clientWidth
      canvas.height = 200
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.strokeStyle = '#00FFD1'
      ctx.lineWidth = 2
      ctx.lineCap = 'round'
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  useImperativeHandle(ref, () => ({
    clear: () => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    },
  }))

  const getPoint = (event: ReactMouseEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    }
  }

  const handleDown = (event: ReactMouseEvent<HTMLCanvasElement>) => {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    isDrawing.current = true
    const point = getPoint(event)
    lastPoint.current = point
    ctx.beginPath()
    ctx.moveTo(point.x, point.y)
  }

  const handleMove = (event: ReactMouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx || !lastPoint.current) return
    const point = getPoint(event)
    const midX = (point.x + lastPoint.current.x) / 2
    const midY = (point.y + lastPoint.current.y) / 2
    ctx.quadraticCurveTo(lastPoint.current.x, lastPoint.current.y, midX, midY)
    ctx.stroke()
    lastPoint.current = point
  }

  const endDrawing = () => {
    isDrawing.current = false
    lastPoint.current = null
  }

  return (
    <canvas
      ref={canvasRef}
      className="w-full rounded-xl border border-glass-border bg-glass"
      onMouseDown={handleDown}
      onMouseMove={handleMove}
      onMouseUp={endDrawing}
      onMouseLeave={endDrawing}
    />
  )
})
