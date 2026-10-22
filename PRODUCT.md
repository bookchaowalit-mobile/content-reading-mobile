# Product: SoloEmpire business tracker (mobile)

> **Name mismatch.** The repository is called `content-reading-mobile`, but
> its code is not a reading app: it has always been the SoloEmpire solo
> business tracker described below (`app.json` name `SoloEmpire`). Renaming
> the repo or replacing the code is an open owner decision
> (`docs/UPGRADE-PLAN.md`, P0). This is **not** a copy of the React Native CLI
> template; it is its own app on React Native 0.73.

Status: personal demo app. Not published to any app store. Lifecycle not
decided by the owner.

## What it is

A React Native 0.73 app for one person to track their small businesses
("ventures") and money goals on the phone.

## Screens (bottom tabs)

| Tab | What it does |
|---|---|
| Dashboard | Total revenue, expenses, profit (with margin when there is revenue), number of active ventures, the first three goals with progress bars, and up to five ventures ordered by profit. Updates as soon as data changes on another tab. |
| Ventures | Add a venture (name, category, revenue, expenses) with form validation; tap the status to cycle active → paused → planning; delete with confirmation. |
| Goals | Money goals with a target, optional `YYYY-MM-DD` deadline (days left / overdue), and +฿1K / +฿5K / +฿10K progress buttons; progress never shows 100% before the goal is reached. |
| Settings | About text and "Clear all data", which removes only this app's own storage keys. |

## Data

- All data is entered by the user and stored only on the device
  (AsyncStorage keys `ventures` and `goals`). Corrupt stored data is ignored
  instead of crashing a screen; after a failed load the app refuses to save,
  so it never overwrites stored data with an empty list.
- No backend, no account, no sync, no analytics, no network calls.
- Amounts are in Thai baht (฿). There is no edit screen and no history: a
  venture's revenue/expenses are single numbers.

## What does not exist yet

- No generated `android/` or `ios/` native projects, so there is no APK/IPA
  build; CI builds the Metro Android JS bundle instead.
- No store listing, no crash reporting, no data export.

## Quality

- Jest: 3 test files — `business.test.ts` (parsing, totals, goal progress,
  deadlines, validation), `store.test.tsx` (tabs stay in sync, clear keeps
  other keys, no overwrite after a failed load) and `DashboardScreen.test.tsx`
  (empty states and the rendered summary of stored data).
- CI (`.github/workflows/ci.yml`): shared `platform-ci-workflows` v1.1.1 —
  `npm ci`, ESLint (0 warnings), `tsc --noEmit` (strict), Jest with a line
  coverage gate, Metro Android bundle, and security scans (Gitleaks, Semgrep,
  OSV-Scanner, Trivy). Reviewed scanner exceptions: `osv-scanner.toml`,
  `.trivyignore`.

Backlog: `docs/UPGRADE-PLAN.md`.
