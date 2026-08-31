# Repository Instructions

## Intent

- This is a playground for testing Convex capabilities and shortening AI-assisted development loops. The current notes/comments app is only a test fixture; do not infer product requirements from it or preserve its semantics unless the task asks for that.
- Prefer the smallest implementation that proves an experiment. Add production hardening or product polish only when it is part of the experiment.

## Boundaries

- Run commands from the repository root. This is a pnpm 11.5.2 workspace requiring Node 24+, with `@repo/backend` in `apps/backend` and `@repo/web` in `apps/web`.
- `apps/backend/convex/` owns the schema, server functions, and backend tests. `apps/web/` consumes its generated API and data-model types through `@repo/backend/convex/_generated/*` package exports.
- Treat `apps/backend/convex/_generated/` as generated output. Keep it in sync with `pnpm --filter @repo/backend exec convex codegen`; `convex dev` also regenerates it.
- Load the `convex-expert` skill before editing files under `apps/backend/convex/`; use version-current Convex patterns rather than model memory.

## Local Workflow

- On first setup, run `pnpm dev:backend` before the web app. Convex setup generates `apps/web/.env.local`; without it the web entrypoint throws for missing `VITE_CONVEX_URL`.
- `pnpm dev` runs the backend and web dev servers together. Use `pnpm dev:backend` or `pnpm dev:web` to isolate one side.
- Backend tests run in Vitest's `edge-runtime`. `apps/backend/convex/test.setup.ts` currently loads only top-level Convex modules; extend its glob when adding functions in nested directories. The web test script currently passes with no tests.

## Verification

- Full checks: `pnpm typecheck`, `pnpm test`, and `pnpm build`. There is no lint or formatter script.
- Backend only: `pnpm --filter @repo/backend test`.
- One backend file: `pnpm --filter @repo/backend exec vitest run convex/notes.test.ts`.
- One backend test: `pnpm --filter @repo/backend exec vitest run convex/notes.test.ts -t "adds comments and updates the note count"`.
