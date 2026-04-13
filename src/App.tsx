import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import Lenis from 'lenis'
import { Sidebar } from './components/layout/Sidebar'
import { CustomCursor } from './components/ui/CustomCursor'
import { ParticleBackground } from './components/ui/ParticleBackground'
import Landing from './pages/Landing'
import CreatePact from './pages/CreatePact'
import Dashboard from './pages/Dashboard'
import MyPacts from './pages/MyPacts'
import Categories from './pages/Categories'
import PactDetail from './pages/PactDetail'
import ProofSubmit from './pages/ProofSubmit'
import Vote from './pages/Vote'
import Profile from './pages/Profile'

function RouteTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
      className="h-full"
    >
      {children}
    </motion.div>
  )
}

function AppLayout() {
  const location = useLocation()
  const showSidebar = location.pathname !== '/'

  return (
    <div className={showSidebar ? 'flex min-h-screen' : 'min-h-screen'}>
      {showSidebar ? <Sidebar /> : null}

      <main className={showSidebar ? 'min-h-screen flex-1 overflow-x-hidden' : 'min-h-screen'}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={(
                <RouteTransition>
                  <Landing />
                </RouteTransition>
              )}
            />
            <Route
              path="/dashboard"
              element={(
                <RouteTransition>
                  <Dashboard />
                </RouteTransition>
              )}
            />
            <Route
              path="/pacts"
              element={(
                <RouteTransition>
                  <MyPacts />
                </RouteTransition>
              )}
            />
            <Route
              path="/categories"
              element={(
                <RouteTransition>
                  <Categories />
                </RouteTransition>
              )}
            />
            <Route
              path="/create"
              element={(
                <RouteTransition>
                  <CreatePact />
                </RouteTransition>
              )}
            />
            <Route
              path="/pact/:id"
              element={(
                <RouteTransition>
                  <PactDetail />
                </RouteTransition>
              )}
            />
            <Route
              path="/pact/:id/submit"
              element={(
                <RouteTransition>
                  <ProofSubmit />
                </RouteTransition>
              )}
            />
            <Route
              path="/pact/:id/vote"
              element={(
                <RouteTransition>
                  <Vote />
                </RouteTransition>
              )}
            />
            <Route
              path="/profile"
              element={(
                <RouteTransition>
                  <Profile />
                </RouteTransition>
              )}
            />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  )
}

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
      <AppLayout />
    </BrowserRouter>
  )
}

export default App
