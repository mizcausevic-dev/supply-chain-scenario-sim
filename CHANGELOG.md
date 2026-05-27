# Changelog

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
