# Repository Instructions

## Intent

- This is a playground for testing Convex capabilities and shortening AI-assisted development loops. Treat the current app as a test fixture; do not infer product requirements from it or preserve its semantics unless the task asks for that.
- Prefer the smallest implementation that proves an experiment. Add production hardening or product polish only when it is part of the experiment.

## Boundaries

- Run commands from the repository root. This is a Bun 1.3.14 workspace with `@repo/backend` in `apps/backend` and `@repo/web` in `apps/web`; Node is not required.
- `apps/backend/convex/` owns the schema, server functions, and backend tests. `apps/web/` consumes its generated API and data-model types through `@repo/backend/convex/_generated/*` package exports.
- Treat `apps/backend/convex/_generated/` as generated output. Keep it in sync with `bun --bun run --cwd apps/backend convex codegen`; `convex dev` also regenerates it.
- Load the `convex-expert` skill before editing files under `apps/backend/convex/`; use version-current Convex patterns rather than model memory.
- Use shadcn/ui components for `apps/web` UI whenever an appropriate component exists. Add missing components through the shadcn CLI and compose or style them for product-specific visuals instead of rebuilding their behavior by hand.

## Local Workflow

- On first setup, run `bun run dev:backend` before the web app. Convex setup generates `apps/web/.env.local`; without it the web entrypoint throws for missing `VITE_CONVEX_URL`.
- `bun run dev` runs the backend and web dev servers together. Use `bun run dev:backend` or `bun run dev:web` to isolate one side.
- Tests run with Bun's native test runner. The web test script currently passes with no tests.

## Verification

- Full checks: `bun run typecheck`, `bun run test`, and `bun run build`. There is no lint or formatter script.
- Backend only: `bun run --filter @repo/backend test`.
- One backend file: `bun test apps/backend/convex/auth.test.ts`.
