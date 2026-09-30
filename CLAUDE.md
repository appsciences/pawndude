# Project Rules

## Git Workflow
- Always use feature branches for new features and bug fixes
- Create a corresponding GitHub issue before starting work
- Reference the issue in commits and PRs

## Testing
- Write tests before implementation (spec-driven development)
- Mobile E2E tests use Maestro (flows in `e2e/mobile/`)
- API/web E2E tests use Playwright (run with `npx playwright test`)
- Pure logic (profit calculator, valuation) gets unit tests with golden cases
- All tests must pass before merging

## Stack
- Mobile app: React Native (Expo) with TypeScript
- Backend/API: Next.js (App Router) route handlers with TypeScript; Tailwind CSS for any web pages (landing page)
- Shared TypeScript package for types and schemas used by app and API
- AI (v1): Claude Vision called directly with structured JSON outputs; no model training until phase two
