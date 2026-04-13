# StakePact Frontend

StakePact is a premium accountability product UI where users commit money against deadlines, submit proof, and resolve outcomes through automated checks, social voting, or designated verifiers.

This repository contains the complete frontend application built with React, TypeScript, Vite, Tailwind, Framer Motion, and Zustand.

## Highlights

- Multi-page product flow: landing, dashboard, categories, pact creation, detail, proof submission, voting, profile, and pact list
- Persistent app shell with route-aware sidebar and animated page transitions
- Minimalist glass UI system with reusable primitives and motion-driven interactions
- Countdown clocks, animated metrics, interactive cards, and smooth-scroll experience
- Responsive layouts for desktop and mobile

## Tech Stack

- React 18 + TypeScript
- Vite 8
- Tailwind CSS 3
- Framer Motion
- React Router 6
- Zustand
- React Hook Form + Zod
- Lucide icons
- Lenis smooth scrolling

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Install

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

App runs at the local Vite URL shown in terminal, typically http://localhost:5173.

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Available Scripts

- npm run dev: Start Vite development server
- npm run build: Type-check and build production assets
- npm run preview: Preview production build locally
- npm run lint: Run ESLint

## Routes

- /: Landing page (no sidebar)
- /dashboard: App dashboard
- /pacts: My Pacts list
- /categories: Category Hub
- /create: Create Pact wizard
- /pact/:id: Pact detail
- /pact/:id/submit: Proof submission
- /pact/:id/vote: Voting flow
- /profile: User profile

## Project Structure

```text
src/
  components/
    layout/        # Shared app layout components
    ui/            # Reusable UI primitives and effects
  lib/             # Utility helpers
  pages/           # Route-level pages
  store/           # Zustand state store
  styles/          # Global styling tokens and base rules
  App.tsx          # Router, persistent shell, global effects
  main.tsx         # App bootstrap
```

## UI and Motion System

- Global background and cursor effects are mounted once at app root
- Route transitions use AnimatePresence for smooth entry/exit navigation
- Shared components such as GlassCard and MagneticButton control interaction style across pages
- Reduced-motion support is included for accessibility-aware environments

## Notes

- This repository currently focuses on frontend product experience and interaction design.
- If you plug in backend services later, keep API clients isolated by feature domain and avoid coupling UI primitives to network logic.
