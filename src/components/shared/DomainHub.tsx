import { Link } from 'react-router-dom'
import type { Category } from '../../types/pact.types'
import { CATEGORIES, ROUTES } from '../../lib/constants'
import { usePactStore } from '../../store/usePactStore'

type DomainHubProps = {
  domain: Category
  heading: string
  summary: string
}

function statusBadge(status: string) {
  if (status === 'completed') return 'bg-emerald-500/20 text-emerald-300'
  if (status === 'failed') return 'bg-rose-500/20 text-rose-300'
  if (status === 'disputed') return 'bg-amber-500/20 text-amber-300'
  return 'bg-teal/20 text-teal'
}

export function DomainHub({ domain, heading, summary }: DomainHubProps) {
  const { pacts } = usePactStore()
  const metadata = CATEGORIES.find((category) => category.key === domain)
  const domainPacts = pacts.filter((pact) => pact.category === domain)

  return (
    <div className="app-page bg-obsidian text-white">
      <div className="app-container max-w-6xl">
        <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[11px] tracking-[0.24em] text-white/50">DOMAIN HUB</p>
              <h1 className="mt-2 font-syne text-3xl font-bold sm:text-4xl">{heading}</h1>
              <p className="mt-3 max-w-2xl text-sm text-white/60 sm:text-base">{summary}</p>
            </div>
            {metadata ? (
              <div
                className="rounded-xl border px-4 py-3 text-right"
                style={{ borderColor: `${metadata.color}80` }}
              >
                <p className="font-syne text-lg" style={{ color: metadata.color }}>
                  {metadata.label}
                </p>
                <p className="text-xs text-white/50">{metadata.description}</p>
              </div>
            ) : null}
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {domainPacts.map((pact) => (
            <article key={pact.id} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="font-syne text-lg text-white">{pact.title}</p>
                <span className={`rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] ${statusBadge(pact.status)}`}>
                  {pact.status}
                </span>
              </div>
              <p className="mt-2 text-sm text-white/55">{pact.description}</p>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg border border-white/10 p-3">
                  <p className="text-white/45">Stake</p>
                  <p className="mt-1 font-syne">INR {pact.stakeAmount.toLocaleString('en-IN')}</p>
                </div>
                <div className="rounded-lg border border-white/10 p-3">
                  <p className="text-white/45">Deadline</p>
                  <p className="mt-1 font-syne">{new Date(pact.deadline).toLocaleDateString('en-IN')}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-white/45">
                <span>{pact.members.length} members</span>
                <Link to={ROUTES.pactDetail.replace(':id', pact.id)} className="text-teal transition-colors hover:text-white">
                  View Pact
                </Link>
              </div>
            </article>
          ))}
        </section>

        {domainPacts.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-white/20 p-8 text-center">
            <p className="font-syne text-xl text-white">No pacts in this domain yet.</p>
            <p className="mt-2 text-sm text-white/50">Create your first pact to start accountability tracking.</p>
          </div>
        ) : null}
      </div>
    </div>
  )
}
