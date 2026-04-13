import Particles from '@tsparticles/react'

export function ParticleBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Particles
        id="particles"
        className="absolute inset-0"
        options={{
          fullScreen: { enable: false },
          fpsLimit: 60,
          particles: {
            number: { value: 26 },
            color: { value: '#00FFD1' },
            opacity: { value: 0.05 },
            size: { value: 1 },
            links: {
              enable: true,
              color: '#00FFD1',
              opacity: 0.025,
              distance: 110,
            },
            move: { enable: true, speed: 0.18 },
          },
          interactivity: {
            events: {
              onHover: { enable: false, mode: 'repulse' },
            },
            modes: {
              repulse: { distance: 80, duration: 0.25 },
            },
          },
          detectRetina: true,
        }}
      />

      <svg
        className="absolute inset-0 z-[1] opacity-[0.012]"
        width="100%"
        height="100%"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="grid"
            width="64"
            height="64"
            patternUnits="userSpaceOnUse"
          >
            <path d="M 64 0 L 0 0 0 64" fill="none" stroke="#00FFD1" strokeWidth="0.45" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  )
}
