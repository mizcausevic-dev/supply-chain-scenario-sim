# Changelog

## v1.0.0-prod — 2026-05-27

Production-readiness hardening on top of v0.1-shipped.

- Verified all CI gates pass on a clean `npm ci`: lint, typecheck, coverage (98.33% statements / 80% branches / 100% functions / 98.33% lines), build, demo, smoke, `npm audit --audit-level=high` (0 vulnerabilities at high/critical).
- Confirmed AGPL-3.0-or-later licensing, `SECURITY.md`, `CODE_OF_CONDUCT.md`, weekly `dependabot.yml` for `npm` + `github-actions`.
- Confirmed CI workflow runs the Node 20 + 22 matrix and the production-status surfaces (CI / License / Deploy badges + `## Production status` block) are intact in the README.
- Live operator surface running at https://supply.kineticgain.com/ via the GitHub Pages deploy rail with HTTPS enforcement enabled.
- No changes to source, README content, docs, or screenshots — those remain the v0.1-shipped surface from the build lane.

## v0.1.0 — 2026-05-30

- Initial release: operator surface for supply-chain scenario simulation and recovery posture.
- Added a public dashboard surface with overview, scenario-lane, constraint-risks, recovery-posture, verification, and docs routes.
- Added prerendered GitHub Pages packaging for `supply.kineticgain.com` with `CNAME`, `robots.txt`, `sitemap.xml`, and OG/meta injection at deploy time.
- Added synthetic README proof screenshots and `docs/KINETIC_GAIN_EMBEDDED.md` tie-back packaging.
- Reads a combined JSON envelope `{ baselines, scenarios }` — each section is optional.
- 8 finding codes covering missing current baselines, stale baselines, inventory buffer breaches, supplier failure risks, carrier capacity shocks, customs hold risks, service-level slips, and stale scenario windows.
- Library API: `analyze(input, opts)` -> `DriftReport`; `toMarkdown(report)` + `toSummary(report)` formatters.
- CLI: `supply-chain-scenario-sim <export.json>` with `--format json|markdown|summary`, `--now <iso>`, `--stale-routing-after-hours N`, `--fail-on-high`, `--out FILE`.
- Wave 7 / logistics lane — opens the supply-chain and operator-simulation track next to the Atlas control-room portfolio.
- Node 20/22 CI (lint, typecheck, coverage, build, demo, smoke, prerender, `npm audit`), AGPL-3.0-or-later, Dependabot.
