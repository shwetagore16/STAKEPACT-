# StakePact Monorepo

StakePact is a domain-driven accountability platform where users stake INR against commitments, submit proof, and resolve outcomes with transparent rules. This repository is structured for parallel development across frontend domains, backend services, and blockchain contracts.

Design system reference:

- Background: `#080C14`
- Teal: `#00FFD1`
- Gold: `#F5C842`
- Violet: `#8A5AFF`
- Danger: `#FF3B5C`
- Fonts: Syne (headings), Space Grotesk (body)

## Tech Stack

| Layer | Stack |
| --- | --- |
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, React Router, Zustand |
| Backend | Node.js, Express, TypeScript, dotenv, cors |
| Blockchain | Python, PyTeal, Algorand deployment scripting |
| Tooling | ESLint, TypeScript compiler, pytest |

## Team Domain Mapping

| Team Member | Ownership |
| --- | --- |
| Shweta | Cross-domain architecture and release coordination |
| Member 1 | Education domain (frontend + backend contracts) |
| Member 2 | Corporate domain (frontend + backend contracts) |
| Member 3 | Legal domain (frontend + backend contracts) |
| Member 4 | Government domain (frontend + backend contracts) |
| Member 5 | Personal domain + shared platform modules |

## Git Workflow

- `main`: production-ready branch, protected, merge via reviewed PR only
- `dev`: integration branch for validated feature branches
- `feat/domain-*`: domain-scoped branches (`feat/domain-education`, `feat/domain-corporate`, etc.)

Suggested merge flow:

1. Create feature branch from `dev`.
2. Open PR into `dev` using `.github/PULL_REQUEST_TEMPLATE.md`.
3. Run build/tests for changed layers.
4. Merge `dev` into `main` for release cut.

## Setup Commands

### Frontend

```bash
npm install
npm run dev
npm run build
```

### Backend

```bash
cd backend
npm install
npm run dev
npm run build
```

### Blockchain

```bash
cd blockchain
python -m venv .venv
.venv\Scripts\activate
pip install pyteal pytest
python deploy/deploy.py
pytest
```

## Folder Structure

```text
STAKEPACT2/
|-- backend/
|   |-- src/
|   |   |-- domains/
|   |   |   |-- education/
|   |   |   |-- corporate/
|   |   |   |-- legal/
|   |   |   |-- government/
|   |   |   `-- personal/
|   |   |-- shared/
|   |   |   |-- middleware/
|   |   |   |-- models/
|   |   |   `-- utils/
|   |   |-- app.ts
|   |   `-- server.ts
|   |-- .env.example
|   |-- package.json
|   `-- tsconfig.json
|-- blockchain/
|   |-- contracts/
|   |   |-- core/
|   |   |   `-- pact_escrow.py
|   |   `-- domains/
|   |       |-- education_pact.py
|   |       |-- corporate_pact.py
|   |       |-- legal_pact.py
|   |       |-- government_pact.py
|   |       `-- personal_pact.py
|   |-- deploy/
|   |   `-- deploy.py
|   |-- tests/
|   |   `-- test_pact.py
|   |-- .env.example
|   `-- README.md
|-- src/
|   |-- components/
|   |   |-- layout/
|   |   |-- shared/
|   |   `-- ui/
|   |-- domains/
|   |   |-- education/{pages,components,hooks,types}
|   |   |-- corporate/{pages,components,hooks,types}
|   |   |-- legal/{pages,components,hooks,types}
|   |   |-- government/{pages,components,hooks,types}
|   |   `-- personal/{pages,components,hooks,types}
|   |-- lib/
|   |-- pages/
|   |-- router/
|   |-- store/
|   `-- types/
`-- .github/
    `-- PULL_REQUEST_TEMPLATE.md
```

## Frontend Routes

- `/` -> Landing
- `/dashboard` -> Dashboard (inside AppShell)
- `/categories` -> Categories (inside AppShell)
- `/categories/education` -> EducationHub
- `/categories/corporate` -> CorporateHub
- `/categories/legal` -> LegalHub
- `/categories/government` -> GovernmentHub
- `/categories/personal` -> PersonalHub
- `/pact/:id` -> PactDetail
- `/profile` -> Profile

All routes are lazy loaded via `React.lazy` + `Suspense` from `src/router/routes.tsx`.
