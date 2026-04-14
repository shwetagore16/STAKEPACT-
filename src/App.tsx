import { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import Lenis from 'lenis'
import { CustomCursor } from './components/ui/CustomCursor'
import { ParticleBackground } from './components/ui/ParticleBackground'
import { AppRoutes } from './router/routes'

function App() {
  useEffect(() => {
    const lenis = new Lenis({ smoothWheel: true, lerp: 0.1 })
    let rafId = 0

    const raf = (time: number) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }

    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [])

  return (
    <BrowserRouter>
      <ParticleBackground />
      <CustomCursor />
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App
