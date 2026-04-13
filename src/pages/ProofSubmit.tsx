import { type ComponentType, type SVGProps, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useAnimationControls } from 'framer-motion'
import {
  AlertTriangle,
  Brain,
  Camera,
  Check,
  Copy,
  ExternalLink,
  FileText,
  Link2,
  Upload,
  X,
  Zap,
} from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { GlassCard } from '../components/ui/GlassCard'
import { FlipClock } from '../components/ui/FlipClock'
import { MagneticButton } from '../components/ui/MagneticButton'
import { cn } from '../lib/utils'

type ProofTypeId = 'link' | 'document' | 'auto' | 'screenshot'
type UrlValidity = null | boolean
type UploadPhase = 'idle' | 'processing' | 'analyzing' | 'complete'
type AutoPhase = 'connecting' | 'scanning' | 'found'
type SubmitPhase = 'idle' | 'submitting' | 'writing' | 'done'

type FormValues = {
  url: string
  context: string
  declaration: boolean
}

const proofTypes: Array<{
  id: ProofTypeId
  icon: ComponentType<SVGProps<SVGSVGElement>>
  label: string
  desc: string
  accentText: string
  selectedClass: string
}> = [
  {
    id: 'link',
    icon: Link2,
    label: 'Link / URL',
    desc: 'GitHub, website, PR, portfolio',
    accentText: 'text-teal',
    selectedClass: 'border-teal/60 bg-teal/10',
  },
  {
    id: 'document',
    icon: FileText,
    label: 'Document Upload',
    desc: 'PDF, Word, images',
    accentText: 'text-violet',
    selectedClass: 'border-violet/60 bg-violet/10',
  },
  {
    id: 'auto',
    icon: Zap,
    label: 'Auto-Verify',
    desc: 'GitHub OAuth, Strava, Coursera',
    accentText: 'text-gold',
    selectedClass: 'border-gold/60 bg-gold/10',
  },
  {
    id: 'screenshot',
    icon: Camera,
    label: 'Screenshot',
    desc: 'Quick visual proof',
    accentText: 'text-white',
    selectedClass: 'border-white/40 bg-white/5',
  },
]

function Spinner() {
  return <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
}

export default function ProofSubmit() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const deadline = useMemo(
    () => new Date(Date.now() + (5 * 3600 + 34 * 60 + 12) * 1000),
    [],
  )

  const shakeControls = useAnimationControls()
  const inputShakeControls = useAnimationControls()

  const [selectedType, setSelectedType] = useState<ProofTypeId>('link')
  const [urlValidity, setUrlValidity] = useState<UrlValidity>(null)

  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadPhase, setUploadPhase] = useState<UploadPhase>('idle')

  const [autoPhase, setAutoPhase] = useState<AutoPhase>('connecting')

  const [declarationChecked, setDeclarationChecked] = useState(false)
  const [submitPhase, setSubmitPhase] = useState<SubmitPhase>('idle')
  const [copied, setCopied] = useState(false)

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const { register, watch, setValue } = useForm<FormValues>({
    defaultValues: {
      url: '',
      context: '',
      declaration: false,
    },
  })

  const urlValue = watch('url')

  useEffect(() => {
    const interval = window.setInterval(() => {
      shakeControls.start({
        x: [-2, 2, -2, 2, 0],
        transition: { duration: 0.4 },
      })
    }, 60000)

    return () => window.clearInterval(interval)
  }, [shakeControls])

  useEffect(() => {
    if (!urlValue) {
      setUrlValidity(null)
      return
    }

    const valid = /^https?:\/\/.+\..+/i.test(urlValue)
    setUrlValidity(valid)

    if (!valid) {
      inputShakeControls.start({
        x: [-6, 6, -4, 4, 0],
        transition: { duration: 0.35 },
      })
    }
  }, [urlValue, inputShakeControls])

  useEffect(() => {
    if (!selectedFile) {
      setUploadProgress(0)
      setUploadPhase('idle')
      return
    }

    setUploadProgress(0)
    setUploadPhase('processing')

    const progressInterval = window.setInterval(() => {
      setUploadProgress((prev) => {
        const next = Math.min(100, prev + 5)
        if (next >= 70) {
          setUploadPhase('analyzing')
        }
        if (next >= 100) {
          window.clearInterval(progressInterval)
          window.setTimeout(() => {
            setUploadPhase('complete')
          }, 250)
        }
        return next
      })
    }, 100)

    return () => window.clearInterval(progressInterval)
  }, [selectedFile])

  useEffect(() => {
    if (selectedType !== 'auto') return

    setAutoPhase('connecting')
    const t1 = window.setTimeout(() => setAutoPhase('scanning'), 1000)
    const t2 = window.setTimeout(() => setAutoPhase('found'), 2000)

    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
    }
  }, [selectedType])

  const confidence = 87
  const radius = 48
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference * (1 - confidence / 100)

  const canSubmit = useMemo(() => {
    if (!declarationChecked) return false
    if (submitPhase !== 'idle') return false

    if (selectedType === 'link') return urlValidity === true
    if (selectedType === 'document') return uploadPhase === 'complete'
    if (selectedType === 'auto') return autoPhase === 'found'
    return true
  }, [autoPhase, declarationChecked, selectedType, submitPhase, uploadPhase, urlValidity])

  const triggerSubmit = () => {
    if (!canSubmit) return

    setSubmitPhase('submitting')
    window.setTimeout(() => {
      setSubmitPhase('writing')
    }, 1200)
    window.setTimeout(() => {
      setSubmitPhase('done')
    }, 2400)
  }

  const copyTx = async () => {
    try {
      await navigator.clipboard.writeText('0xABC...123')
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1200)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="app-page bg-obsidian text-white">
      <div className="flex items-center gap-4 border-b border-danger/30 bg-danger/10 px-8 py-3">
        <Link to={`/pact/${id ?? 'pact-4721'}`} className="text-sm text-white/50 transition-colors hover:text-white" data-cursor="pointer">
          {'<'} Pact #4721
        </Link>
        <div className="flex items-center gap-2 text-sm font-medium text-danger">
          <AlertTriangle className="h-4 w-4 animate-pulse" />
          DEADLINE CRITICAL - Your INR 5,000 is at risk. Submit before the countdown hits zero.
        </div>
      </div>

      <main className="app-container max-w-6xl px-2 pb-16 pt-10 sm:px-4 lg:px-8">
        <section className="py-12 text-center">
          <h1 className="font-syne text-4xl">Submit Your Proof</h1>

          <motion.div
            className="mt-10 inline-block rounded-2xl p-3"
            animate={shakeControls}
            whileInView={{ opacity: 1 }}
          >
            <motion.div
              animate={{
                boxShadow: [
                  '0 0 0px rgba(255,59,92,0)',
                  '0 0 50px rgba(255,59,92,0.3)',
                  '0 0 0px rgba(255,59,92,0)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <FlipClock targetDate={deadline} size="lg" urgentAt={86400} />
            </motion.div>
          </motion.div>

          <p className="mt-5 text-sm text-white/40">Pact: Deliver MVP | Your stake: INR 5,000</p>
        </section>

        <section>
          <h2 className="mb-6 mt-4 font-syne text-xl">Select Proof Type</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {proofTypes.map((type) => {
              const Icon = type.icon
              const selected = selectedType === type.id
              const dimmed = selectedType !== type.id

              return (
                <motion.div key={type.id} layout whileTap={{ scale: 0.97 }}>
                  <GlassCard
                    tilt
                    className={cn(
                      'relative cursor-pointer p-5 transition-all',
                      selected && type.selectedClass,
                      !selected && dimmed && 'opacity-60',
                    )}
                    onClick={() => setSelectedType(type.id)}
                  >
                    <Icon className={cn('h-8 w-8', type.accentText)} />
                    <h3 className="mt-3 font-syne text-lg font-bold">{type.label}</h3>
                    <p className="mt-2 text-sm text-white/40">{type.desc}</p>
                    {selected ? (
                      <motion.span
                        layoutId="proof-type-selected"
                        className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-teal/20 text-teal"
                      >
                        <Check className="h-4 w-4" />
                      </motion.span>
                    ) : null}
                  </GlassCard>
                </motion.div>
              )
            })}
          </div>
        </section>

        <section className="mt-6">
          <AnimatePresence mode="wait">
            {selectedType === 'link' ? (
              <motion.div
                key="link"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <GlassCard className="p-6">
                  <label className="text-sm text-white/70">Paste your proof URL</label>
                  <motion.div animate={inputShakeControls} className="relative mt-3 h-14">
                    <Link2 className="absolute left-2 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
                    <input
                      type="url"
                      placeholder="https://"
                      className={cn(
                        'h-full w-full border-0 border-b-2 bg-transparent pl-10 pr-10 text-base text-white outline-none',
                        urlValidity === true && 'border-b-teal',
                        urlValidity === false && 'border-b-danger',
                        urlValidity === null && 'border-b-glass-border focus:border-b-teal',
                      )}
                      {...register('url')}
                    />
                    <AnimatePresence>
                      {urlValidity === true ? (
                        <motion.span
                          key="valid"
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.5, opacity: 0 }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-teal"
                        >
                          <Check className="h-5 w-5" />
                        </motion.span>
                      ) : null}
                      {urlValidity === false ? (
                        <motion.span
                          key="invalid"
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.5, opacity: 0 }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-danger"
                        >
                          <X className="h-5 w-5" />
                        </motion.span>
                      ) : null}
                    </AnimatePresence>
                  </motion.div>

                  <AnimatePresence>
                    {urlValidity === true ? (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-5"
                      >
                        <GlassCard className="p-4">
                          <div className="flex gap-4">
                            <div className="h-12 w-12 rounded-lg bg-white/10" />
                            <div>
                              <div className="font-mono text-xs text-white/30">github.com</div>
                              <div className="mt-1 text-sm font-semibold text-white">arjun/stakepact-mobile</div>
                              <div className="mt-1 text-sm text-white/50">React Native MVP - StakePact deadline accountability</div>
                              <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-teal/10 px-2 py-1 text-[10px] font-mono tracking-[2px] text-teal">
                                <Check className="h-3 w-3" />
                                Repository is public
                              </div>
                            </div>
                            <a href={urlValue} target="_blank" rel="noreferrer" className="ml-auto text-white/40 hover:text-white" data-cursor="pointer">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </div>
                          <div className="mt-3 font-mono text-xs text-white/30">Last commit: 2h ago</div>
                        </GlassCard>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>

                  <div className="mt-5 relative">
                    <textarea
                      rows={4}
                      placeholder=" "
                      className="peer w-full rounded-xl border border-glass-border bg-glass px-4 py-4 text-sm text-white outline-none focus:border-teal"
                      {...register('context')}
                    />
                    <label className="pointer-events-none absolute left-4 top-4 text-sm text-white/30 transition-all peer-focus:-top-2 peer-focus:bg-obsidian peer-focus:px-1 peer-focus:text-xs peer-focus:text-teal peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:bg-obsidian peer-[:not(:placeholder-shown)]:px-1 peer-[:not(:placeholder-shown)]:text-xs">
                      Describe what this link proves (optional)
                    </label>
                  </div>
                </GlassCard>
              </motion.div>
            ) : null}

            {selectedType === 'document' ? (
              <motion.div
                key="document"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <GlassCard className="p-6">
                  {!selectedFile ? (
                    <motion.div
                      className={cn(
                        'cursor-pointer rounded-2xl border-2 border-dashed border-glass-border px-8 py-16 text-center transition-all duration-300',
                        isDragging && 'border-teal bg-teal/5',
                      )}
                      animate={{ scale: isDragging ? 1.02 : 1 }}
                      onDragOver={(event) => {
                        event.preventDefault()
                        setIsDragging(true)
                      }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={(event) => {
                        event.preventDefault()
                        setIsDragging(false)
                        const file = event.dataTransfer.files?.[0]
                        if (file) setSelectedFile(file)
                      }}
                      onClick={() => fileInputRef.current?.click()}
                      data-cursor="pointer"
                    >
                      <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                        <Upload className="mx-auto h-9 w-9 text-white/70" />
                      </motion.div>
                      <h3 className="mt-4 font-syne text-xl">Drag your proof document here</h3>
                      <p className="mt-2 text-sm text-white/40">or click to browse</p>
                      <p className="mt-3 text-xs text-white/20">PDF, DOCX, PNG, JPG</p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                        onChange={(event) => {
                          const file = event.target.files?.[0]
                          if (file) setSelectedFile(file)
                        }}
                      />
                    </motion.div>
                  ) : (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                      <GlassCard className="p-4">
                        <div className="flex items-center gap-3">
                          <FileText className="h-6 w-6 text-violet" />
                          <div>
                            <p className="text-sm text-white">{selectedFile.name}</p>
                            <p className="text-xs text-white/40">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                        </div>
                        <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/10">
                          <motion.div
                            className="h-full rounded-full bg-gradient-to-r from-teal to-gold"
                            initial={{ width: 0 }}
                            animate={{ width: `${uploadProgress}%` }}
                            transition={{ ease: 'linear', duration: 0.2 }}
                          />
                        </div>
                        <p className="mt-2 text-xs text-white/50">
                          {uploadPhase === 'processing' && 'Processing...'}
                          {uploadPhase === 'analyzing' && 'Analyzing with AI...'}
                          {uploadPhase === 'complete' && 'Complete'}
                        </p>
                      </GlassCard>

                      <AnimatePresence>
                        {uploadPhase === 'complete' ? (
                          <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 8 }}
                            className="mt-5"
                          >
                            <GlassCard className="p-5">
                              <div className="flex items-center gap-2">
                                <Brain className="h-5 w-5 text-teal" />
                                <h4 className="font-syne text-lg">AI Confidence Analysis</h4>
                              </div>

                              <div className="mt-5 flex flex-col gap-6 md:flex-row md:items-center">
                                <div className="relative h-[120px] w-[120px]">
                                  <svg width="120" height="120" viewBox="0 0 120 120">
                                    <defs>
                                      <linearGradient id="aiGaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#00FFD1" />
                                        <stop offset="100%" stopColor="#F5C842" />
                                      </linearGradient>
                                    </defs>
                                    <circle cx="60" cy="60" r={radius} stroke="rgba(255,255,255,0.12)" strokeWidth="10" fill="none" />
                                    <motion.circle
                                      cx="60"
                                      cy="60"
                                      r={radius}
                                      stroke="url(#aiGaugeGradient)"
                                      strokeWidth="10"
                                      fill="none"
                                      strokeLinecap="round"
                                      transform="rotate(-90 60 60)"
                                      strokeDasharray={circumference}
                                      initial={{ strokeDashoffset: circumference }}
                                      animate={{ strokeDashoffset: dashOffset }}
                                      transition={{ duration: 1, ease: 'easeOut' }}
                                    />
                                  </svg>
                                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <div className="font-syne text-3xl text-white">87%</div>
                                    <div className="font-mono text-[10px] tracking-[2px] text-white/40">CONFIDENCE</div>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  {[
                                    ['Commitment keywords found', 'ok'],
                                    ['Timestamp within deadline', 'ok'],
                                    ['App screenshots detected (4)', 'ok'],
                                    ['Client sign-off - optional, not found', 'warn'],
                                  ].map(([label, kind], index) => (
                                    <motion.div
                                      key={label}
                                      initial={{ opacity: 0, x: 8 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: 0.2 + index * 0.2 }}
                                      className={cn('text-sm', kind === 'ok' ? 'text-teal' : 'text-amber-400')}
                                    >
                                      {kind === 'ok' ? (
                                        <Check className="mr-2 inline h-4 w-4" />
                                      ) : (
                                        <AlertTriangle className="mr-2 inline h-4 w-4" />
                                      )}
                                      {label}
                                    </motion.div>
                                  ))}
                                </div>
                              </div>

                              <div className="mt-5 rounded-r-xl border-l-4 border-teal bg-teal/5 p-4">
                                <div className="flex items-center gap-2 text-sm text-teal">
                                  <Brain className="h-4 w-4" />
                                  HIGH CONFIDENCE - AI recommends approval
                                </div>
                              </div>
                            </GlassCard>
                          </motion.div>
                        ) : null}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </GlassCard>
              </motion.div>
            ) : null}

            {selectedType === 'auto' ? (
              <motion.div
                key="auto"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <GlassCard className="p-6">
                  {autoPhase !== 'found' ? (
                    <div className="flex items-center gap-3 text-white/70">
                      <Spinner />
                      {autoPhase === 'connecting' && 'Connecting to GitHub API...'}
                      {autoPhase === 'scanning' && 'Scanning commits in last 7 days...'}
                    </div>
                  ) : (
                    <div className="rounded-xl border border-teal/30 bg-teal/5 p-6">
                      <div className="flex items-center gap-3">
                        <Check className="h-10 w-10 text-teal" />
                        <span className="rounded-full bg-teal/10 px-3 py-1 text-[10px] font-mono tracking-[2px] text-teal">
                          COMMIT FOUND
                        </span>
                      </div>

                      <div className="mt-4 rounded-xl bg-black/30 p-4 font-mono text-xs text-white/70">
                        <p>feat: final MVP release v1.0</p>
                        <p className="mt-2">Repository: arjun/stakepact-mobile (public)</p>
                        <p className="mt-2">SHA: a3f2b9c | 2024-07-23 14:34 IST</p>
                      </div>

                      <div className="mt-4 inline-flex rounded-full bg-gold/15 px-3 py-1 text-[10px] font-mono tracking-[2px] text-gold">
                        THIS SATISFIES YOUR COMMITMENT
                      </div>
                    </div>
                  )}
                </GlassCard>
              </motion.div>
            ) : null}

            {selectedType === 'screenshot' ? (
              <motion.div
                key="screenshot"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <GlassCard className="p-6">
                  <div className="rounded-2xl border border-glass-border bg-glass p-8 text-center">
                    <Camera className="mx-auto h-8 w-8 text-white/70" />
                    <h3 className="mt-3 font-syne text-xl">Screenshot proof</h3>
                    <p className="mt-2 text-sm text-white/40">Drop image evidence to continue.</p>
                    <div className="mt-5">
                      <MagneticButton variant="ghost" onClick={() => fileInputRef.current?.click()}>
                        <Upload className="h-4 w-4" />
                        Upload Screenshot
                      </MagneticButton>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </section>

        <section className="mt-6">
          <GlassCard className="border border-gold/20 bg-gold/5 p-6">
            <p className="text-sm leading-relaxed text-white/60">
              I hereby declare this proof is genuine and accurately represents completion of my commitment.
            </p>

            <div
              className="mt-4 flex cursor-pointer items-start gap-3"
              onClick={() => {
                setDeclarationChecked((prev) => {
                  const next = !prev
                  setValue('declaration', next)
                  return next
                })
              }}
              data-cursor="pointer"
            >
              <div
                className={cn(
                  'flex h-5 w-5 items-center justify-center rounded-sm border-2 border-white/20 transition-colors',
                  declarationChecked && 'border-teal bg-teal text-obsidian',
                )}
              >
                <AnimatePresence>
                  {declarationChecked ? (
                    <motion.span initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.4, opacity: 0 }}>
                      <Check className="h-3.5 w-3.5" />
                    </motion.span>
                  ) : null}
                </AnimatePresence>
              </div>
              <span className="text-sm text-white/60">I confirm this is authentic evidence</span>
            </div>
          </GlassCard>

          <MagneticButton
            variant="gold"
            className="mt-6 w-full py-5 font-syne text-lg"
            onClick={triggerSubmit}
          >
            {submitPhase === 'idle' && 'Lock Submit Proof'}
            {submitPhase === 'submitting' && (
              <span className="flex items-center gap-2">
                <Spinner /> Uploading...
              </span>
            )}
            {submitPhase === 'writing' && (
              <span className="flex items-center gap-2">
                <Spinner /> Writing to Algorand...
              </span>
            )}
          </MagneticButton>
        </section>
      </main>

      <AnimatePresence>
        {submitPhase === 'done' ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian/95"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex flex-col items-center text-center">
              <motion.svg width="140" height="140" viewBox="0 0 140 140" fill="none">
                <motion.circle
                  cx="70"
                  cy="70"
                  r="52"
                  stroke="#00FFD1"
                  strokeWidth="4"
                  strokeDasharray="330"
                  strokeDashoffset="330"
                  animate={{ strokeDashoffset: 0 }}
                  transition={{ duration: 0.7 }}
                />
                <motion.path
                  d="M 44 72 L 62 90 L 98 52"
                  stroke="#00FFD1"
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.65, delay: 0.2 }}
                />
              </motion.svg>

              <h2 className="mt-8 font-syne text-4xl">Proof Submitted</h2>
              <p className="mt-2 text-white/50">Timestamped: July 26, 2024 at 11:34 AM IST</p>

              <div className="mt-4 flex items-center gap-2 font-mono text-teal">
                0xABC...123
                <button type="button" onClick={copyTx} className="text-white/70 hover:text-white" data-cursor="pointer">
                  <Copy className="h-4 w-4" />
                </button>
              </div>

              <AnimatePresence>
                {copied ? (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="mt-2 rounded-full bg-teal/10 px-3 py-1 text-xs text-teal"
                  >
                    Copied!
                  </motion.div>
                ) : null}
              </AnimatePresence>

              <div className="mt-8">
                <MagneticButton variant="gold" onClick={() => navigate(`/pact/${id ?? 'pact-4721'}`)}>
                  Return to Pact
                </MagneticButton>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
