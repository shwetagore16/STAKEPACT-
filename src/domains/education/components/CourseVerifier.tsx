import { useState } from 'react'
import { motion } from 'framer-motion'
import { GlassCard } from '../../../components/ui/GlassCard'
import { MagneticButton } from '../../../components/ui/MagneticButton'
import { Badge } from '../../../components/ui/Badge'

type LearningPlatform = {
  id: string
  emoji: string
  name: string
  verifies: string
  connected: boolean
}

const INITIAL_PLATFORMS: LearningPlatform[] = [
  { id: 'coursera', emoji: '🎓', name: 'Coursera', verifies: 'Course completion certificates', connected: true },
  { id: 'github', emoji: '💻', name: 'GitHub', verifies: 'Assignment repo submissions', connected: false },
  { id: 'google-classroom', emoji: '📚', name: 'Google Classroom', verifies: 'Classroom assignment status', connected: true },
  { id: 'notion', emoji: '📝', name: 'Notion', verifies: 'Study plan checkpoints', connected: false },
  { id: 'linkedin-learning', emoji: '🔗', name: 'LinkedIn Learning', verifies: 'Learning path completion', connected: false },
  { id: 'udemy', emoji: '🎯', name: 'Udemy', verifies: 'Module progress and completion', connected: false },
]

export default function CourseVerifier() {
  const [platforms, setPlatforms] = useState<LearningPlatform[]>(INITIAL_PLATFORMS)

  const toggleConnection = (platformId: string) => {
    setPlatforms((prev) =>
      prev.map((platform) =>
        platform.id === platformId
          ? { ...platform, connected: !platform.connected }
          : platform,
      ),
    )
  }

  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex min-w-max gap-4">
        {platforms.map((platform, index) => (
          <motion.div
            key={platform.id}
            initial={{ opacity: 0, x: 18 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.28, delay: index * 0.06 }}
          >
            <GlassCard glowColor="teal" className="w-[250px] p-4">
              <p className="text-2xl" aria-hidden="true">{platform.emoji}</p>
              <p className="mt-2 font-syne text-lg font-bold text-white">{platform.name}</p>
              <p className="mt-1 text-sm text-white/55">{platform.verifies}</p>

              <div className="mt-4">
                {platform.connected ? (
                  <div className="space-y-2">
                    <Badge variant="teal" dot size="xs">✓ Connected</Badge>
                    <p className="text-xs text-white/55">Synced 2h ago</p>
                  </div>
                ) : (
                  <MagneticButton
                    variant="teal"
                    className="px-3 py-1.5 text-xs"
                    onClick={() => toggleConnection(platform.id)}
                  >
                    Connect →
                  </MagneticButton>
                )}
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
