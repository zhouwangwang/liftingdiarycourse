# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## IMPORTANT: Docs-First Rule

**Before generating any code, Claude Code MUST first check the `/docs` directory for relevant documentation.** Always read and follow any applicable docs files before writing or modifying code. The docs files are the authoritative reference for this project's conventions, design decisions, and requirements.

- /docs/ui.md
- /docs/data-fetching.md
- /docs/data-mutations.md
- /docs/auth.md
- /docs/routing.md

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run lint     # Run ESLint
```

## Stack

- **Next.js 16** with App Router (`src/app/`)
- **React 19**
- **TypeScript**
- **Tailwind CSS v4** (configured via `@tailwindcss/postcss`)

## Architecture

This is a Next.js App Router project. All routes live under `src/app/` as `page.tsx` files. The root layout (`src/app/layout.tsx`) sets up Geist fonts and a flex-column body. Tailwind is configured through `postcss.config.mjs` using the v4 PostCSS plugin rather than a `tailwind.config.js`.
