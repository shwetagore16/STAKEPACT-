import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '../components/layout/AppShell'
import { ROUTES } from '../lib/constants'

const Landing = lazy(() => import('../pages/Landing'))
const Dashboard = lazy(() => import('../pages/Dashboard'))
const Categories = lazy(() => import('../pages/Categories'))
const PactDetail = lazy(() => import('../pages/PactDetail'))
const Profile = lazy(() => import('../pages/Profile'))

const EducationHub = lazy(() => import('../domains/education/pages/EducationHub'))
const CorporateHub = lazy(() => import('../domains/corporate/pages/CorporateHub'))
const LegalHub = lazy(() => import('../domains/legal/pages/LegalHub'))
const GovernmentHub = lazy(() => import('../domains/government/pages/GovernmentHub'))
const PersonalHub = lazy(() => import('../domains/personal/pages/PersonalHub'))

const MyPacts = lazy(() => import('../pages/MyPacts'))
const CreatePact = lazy(() => import('../pages/CreatePact'))
const ProofSubmit = lazy(() => import('../pages/ProofSubmit'))
const Vote = lazy(() => import('../pages/Vote'))

function RouteLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-obsidian px-6 text-center text-white">
      <div>
        <p className="font-mono text-[10px] tracking-[0.25em] text-teal">STAKEPACT</p>
        <p className="mt-3 font-syne text-2xl">Loading route...</p>
      </div>
    </div>
  )
}

export function AppRoutes() {
  return (
    <Suspense fallback={<RouteLoader />}>
      <Routes>
        <Route path={ROUTES.landing} element={<Landing />} />

        <Route element={<AppShell />}>
          <Route path={ROUTES.dashboard} element={<Dashboard />} />
          <Route path={ROUTES.categories} element={<Categories />} />
          <Route path={ROUTES.educationHub} element={<EducationHub />} />
          <Route path={ROUTES.corporateHub} element={<CorporateHub />} />
          <Route path={ROUTES.legalHub} element={<LegalHub />} />
          <Route path={ROUTES.governmentHub} element={<GovernmentHub />} />
          <Route path={ROUTES.personalHub} element={<PersonalHub />} />
          <Route path={ROUTES.pactDetail} element={<PactDetail />} />
          <Route path={ROUTES.profile} element={<Profile />} />

          <Route path={ROUTES.myPacts} element={<MyPacts />} />
          <Route path={ROUTES.createPact} element={<CreatePact />} />
          <Route path={ROUTES.proofSubmit} element={<ProofSubmit />} />
          <Route path={ROUTES.vote} element={<Vote />} />
        </Route>

        <Route path="*" element={<Navigate to={ROUTES.landing} replace />} />
      </Routes>
    </Suspense>
  )
}
