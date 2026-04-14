import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { GlassCard } from '../../../components/ui/GlassCard'
import { MagneticButton } from '../../../components/ui/MagneticButton'
import { useStudyCircle } from '../hooks/useStudyCircle'
import type { EducationPact } from '../types/education.types'

type PactType = EducationPact['type']

type EducationFormData = {
  circleName: string
  subject: string
  examDate: string
  lms: 'google-classroom' | 'coursera' | 'udemy' | ''
  assignmentTitle: string
  assignmentDeadline: string
  assignmentUrl: string
  assignmentMode: 'github' | 'upload'
  courseName: string
  platform: string
  completionDate: string
  thesisTitle: string
  supervisorName: string
  institution: string
  thesisDate: string
  stakeAmount: number
}

const pactTypeCards: Array<{ key: PactType; title: string; icon: string; description: string }> = [
  { key: 'study-circle', title: 'Study Circle', icon: '🤝', description: 'Peer accountability circle for exams and weekly learning goals.' },
  { key: 'assignment', title: 'Assignment', icon: '📝', description: 'Deadline-enforced assignment commitments with proof uploads.' },
  { key: 'course-completion', title: 'Course Completion', icon: '🎯', description: 'Stake-backed online course completion pacts.' },
  { key: 'thesis', title: 'Thesis', icon: '📚', description: 'Submission pact with supervisor as designated verifier.' },
]

const initialForm: EducationFormData = {
  circleName: '',
  subject: '',
  examDate: '',
  lms: '',
  assignmentTitle: '',
  assignmentDeadline: '',
  assignmentUrl: '',
  assignmentMode: 'github',
  courseName: '',
  platform: '',
  completionDate: '',
  thesisTitle: '',
  supervisorName: '',
  institution: '',
  thesisDate: '',
  stakeAmount: 500,
}

export default function CreateEducationPact() {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [pactType, setPactType] = useState<PactType>('study-circle')
  const [memberEmail, setMemberEmail] = useState('')
  const [formData, setFormData] = useState<EducationFormData>(initialForm)

  const {
    members,
    addMember,
    removeMember,
    stakePerMember,
    setStakePerMember,
    calculatePot,
  } = useStudyCircle(500)

  const totalPot = useMemo(() => {
    if (pactType === 'study-circle') return calculatePot()
    return formData.stakeAmount * Math.max(1, members.length || 1)
  }, [calculatePot, formData.stakeAmount, members.length, pactType])

  const updateField = <K extends keyof EducationFormData>(key: K, value: EducationFormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const nextStep = () => setStep((prev) => (prev < 3 ? ((prev + 1) as 1 | 2 | 3) : prev))
  const previousStep = () => setStep((prev) => (prev > 1 ? ((prev - 1) as 1 | 2 | 3) : prev))

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#080C14] text-white">
      <div className="pointer-events-none absolute -top-36 right-12 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(0,255,209,0.12),rgba(0,255,209,0))]" />

      <div className="relative mx-auto max-w-5xl px-6 py-14">
        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <p className="text-sm uppercase tracking-[0.2em] text-white/35">Education / Create Pact</p>
          <h1 className="mt-3 font-syne text-4xl font-bold">Create Education Pact 🎓</h1>
        </motion.header>

        <div className="mt-6 flex items-center gap-3">
          {[1, 2, 3].map((index) => (
            <div key={index} className="flex items-center gap-2">
              <div className={index <= step ? 'h-3 w-3 rounded-full bg-[#00FFD1]' : 'h-3 w-3 rounded-full bg-white/20'} />
              {index < 3 ? <div className="h-[2px] w-10 bg-white/15" /> : null}
            </div>
          ))}
          <p className="ml-2 text-sm text-white/50">Step {step} / 3</p>
        </div>

        <motion.div
          className="mt-8"
          key={step}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {step === 1 ? (
            <section>
              <h2 className="font-syne text-2xl font-bold">Choose Pact Type</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {pactTypeCards.map((card) => {
                  const selected = pactType === card.key
                  return (
                    <motion.button
                      key={card.key}
                      type="button"
                      onClick={() => setPactType(card.key)}
                      whileHover={{ y: -2 }}
                      className={selected
                        ? 'rounded-2xl border border-[#00FFD1]/75 bg-[#00FFD1]/10 p-5 text-left shadow-[0_0_25px_rgba(0,255,209,0.18)]'
                        : 'rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-left backdrop-blur-xl'}
                    >
                      <p className="text-2xl" aria-hidden="true">{card.icon}</p>
                      <p className="mt-2 font-syne text-xl font-bold">{card.title}</p>
                      <p className="mt-2 text-sm text-white/60">{card.description}</p>
                    </motion.button>
                  )
                })}
              </div>
            </section>
          ) : null}

          {step === 2 ? (
            <section>
              <h2 className="font-syne text-2xl font-bold">Define Commitment Details</h2>
              <GlassCard glowColor="teal" className="mt-4 p-5">
                {pactType === 'study-circle' ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    <input value={formData.circleName} onChange={(event) => updateField('circleName', event.target.value)} placeholder="Circle name" className="rounded-lg border border-white/15 bg-white/[0.03] px-3 py-2 text-sm" />
                    <input value={formData.subject} onChange={(event) => updateField('subject', event.target.value)} placeholder="Subject" className="rounded-lg border border-white/15 bg-white/[0.03] px-3 py-2 text-sm" />
                    <input type="date" value={formData.examDate} onChange={(event) => updateField('examDate', event.target.value)} className="rounded-lg border border-white/15 bg-white/[0.03] px-3 py-2 text-sm" />
                    <select value={formData.lms} onChange={(event) => updateField('lms', event.target.value as EducationFormData['lms'])} className="rounded-lg border border-white/15 bg-white/[0.03] px-3 py-2 text-sm">
                      <option value="">LMS Integration</option>
                      <option value="google-classroom">Google Classroom</option>
                      <option value="coursera">Coursera</option>
                      <option value="udemy">Udemy</option>
                    </select>

                    <div className="md:col-span-2 rounded-lg border border-white/15 p-3">
                      <p className="text-sm text-white/70">Add Members</p>
                      <div className="mt-2 flex gap-2">
                        <input
                          value={memberEmail}
                          onChange={(event) => setMemberEmail(event.target.value)}
                          placeholder="student@email.com"
                          className="flex-1 rounded-lg border border-white/15 bg-white/[0.03] px-3 py-2 text-sm"
                        />
                        <MagneticButton
                          variant="teal"
                          className="px-3 py-2 text-xs"
                          onClick={() => {
                            addMember(memberEmail)
                            setMemberEmail('')
                          }}
                        >
                          Add
                        </MagneticButton>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {members.map((member) => (
                          <button
                            key={member.id}
                            type="button"
                            onClick={() => removeMember(member.id)}
                            className="rounded-full border border-[#00FFD1]/35 bg-[#00FFD1]/10 px-3 py-1 text-xs text-[#00FFD1]"
                          >
                            {member.name} ×
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : null}

                {pactType === 'assignment' ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    <input value={formData.assignmentTitle} onChange={(event) => updateField('assignmentTitle', event.target.value)} placeholder="Assignment title" className="rounded-lg border border-white/15 bg-white/[0.03] px-3 py-2 text-sm" />
                    <input value={formData.subject} onChange={(event) => updateField('subject', event.target.value)} placeholder="Subject" className="rounded-lg border border-white/15 bg-white/[0.03] px-3 py-2 text-sm" />
                    <input type="date" value={formData.assignmentDeadline} onChange={(event) => updateField('assignmentDeadline', event.target.value)} className="rounded-lg border border-white/15 bg-white/[0.03] px-3 py-2 text-sm" />
                    <input value={formData.assignmentUrl} onChange={(event) => updateField('assignmentUrl', event.target.value)} placeholder="GitHub URL" className="rounded-lg border border-white/15 bg-white/[0.03] px-3 py-2 text-sm" />
                    <div className="md:col-span-2 flex gap-2">
                      <button type="button" onClick={() => updateField('assignmentMode', 'github')} className={formData.assignmentMode === 'github' ? 'rounded-lg border border-[#00FFD1]/60 bg-[#00FFD1]/10 px-3 py-2 text-xs text-[#00FFD1]' : 'rounded-lg border border-white/15 px-3 py-2 text-xs text-white/60'}>GitHub URL</button>
                      <button type="button" onClick={() => updateField('assignmentMode', 'upload')} className={formData.assignmentMode === 'upload' ? 'rounded-lg border border-[#00FFD1]/60 bg-[#00FFD1]/10 px-3 py-2 text-xs text-[#00FFD1]' : 'rounded-lg border border-white/15 px-3 py-2 text-xs text-white/60'}>Doc Upload</button>
                    </div>
                  </div>
                ) : null}

                {pactType === 'course-completion' ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    <input value={formData.courseName} onChange={(event) => updateField('courseName', event.target.value)} placeholder="Course name" className="rounded-lg border border-white/15 bg-white/[0.03] px-3 py-2 text-sm" />
                    <select value={formData.platform} onChange={(event) => updateField('platform', event.target.value)} className="rounded-lg border border-white/15 bg-white/[0.03] px-3 py-2 text-sm">
                      <option value="">Select platform</option>
                      <option value="Coursera">Coursera</option>
                      <option value="Udemy">Udemy</option>
                      <option value="LinkedIn Learning">LinkedIn Learning</option>
                    </select>
                    <input type="date" value={formData.completionDate} onChange={(event) => updateField('completionDate', event.target.value)} className="rounded-lg border border-white/15 bg-white/[0.03] px-3 py-2 text-sm" />
                  </div>
                ) : null}

                {pactType === 'thesis' ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    <input value={formData.thesisTitle} onChange={(event) => updateField('thesisTitle', event.target.value)} placeholder="Thesis title" className="rounded-lg border border-white/15 bg-white/[0.03] px-3 py-2 text-sm" />
                    <input value={formData.supervisorName} onChange={(event) => updateField('supervisorName', event.target.value)} placeholder="Supervisor name" className="rounded-lg border border-white/15 bg-white/[0.03] px-3 py-2 text-sm" />
                    <input value={formData.institution} onChange={(event) => updateField('institution', event.target.value)} placeholder="Institution" className="rounded-lg border border-white/15 bg-white/[0.03] px-3 py-2 text-sm" />
                    <input type="date" value={formData.thesisDate} onChange={(event) => updateField('thesisDate', event.target.value)} className="rounded-lg border border-white/15 bg-white/[0.03] px-3 py-2 text-sm" />
                  </div>
                ) : null}
              </GlassCard>
            </section>
          ) : null}

          {step === 3 ? (
            <section>
              <h2 className="font-syne text-2xl font-bold">Finalize Stake</h2>
              <GlassCard glowColor="gold" className="mt-4 p-5">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm text-white/60">Stake amount (per member)</label>
                    <input
                      type="number"
                      min={100}
                      value={pactType === 'study-circle' ? stakePerMember : formData.stakeAmount}
                      onChange={(event) => {
                        const value = Number(event.target.value)
                        if (pactType === 'study-circle') setStakePerMember(value)
                        updateField('stakeAmount', value)
                      }}
                      className="mt-2 w-full rounded-lg border border-white/15 bg-white/[0.03] px-3 py-2"
                    />
                  </div>
                  <div className="rounded-xl border border-white/15 bg-white/[0.02] p-4">
                    <p className="text-sm text-white/50">Total pot (stake × members)</p>
                    <p className="mt-2 font-syne text-3xl font-bold text-[#F5C842]">₹{Math.max(0, totalPot).toLocaleString('en-IN')}</p>
                  </div>
                </div>

                <div className="mt-6">
                  <MagneticButton variant="gold" className="px-6 py-3">
                    Create Education Pact 🎓
                  </MagneticButton>
                </div>
              </GlassCard>
            </section>
          ) : null}
        </motion.div>

        <div className="mt-8 flex items-center justify-between">
          <MagneticButton variant="ghost" className="px-4 py-2" onClick={previousStep}>
            Back
          </MagneticButton>
          {step < 3 ? (
            <MagneticButton variant="teal" className="px-4 py-2" onClick={nextStep}>
              Next
            </MagneticButton>
          ) : null}
        </div>
      </div>
    </div>
  )
}
