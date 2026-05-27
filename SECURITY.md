# Security Policy

`supply-chain-scenario-sim` ships both an offline analyzer and a synthetic public dashboard surface. It reads JSON exports from supply baselines and disruption packets (or synthetic data) and emits structured findings, route JSON, and prerendered HTML. No live carrier credentials, ERP secrets, customs credentials, or execution of user-supplied code is included.

## Supported Versions

The latest release on `main` is supported for security fixes and dependency refreshes.

## Reporting a Vulnerability

Please report vulnerabilities privately through GitHub Security Advisories:

- [Open a security advisory](https://github.com/mizcausevic-dev/supply-chain-scenario-sim/security/advisories/new)

Include:

- affected route or package surface
- sample payload or steps to reproduce
- whether the issue affects the analyzer, CLI, or prerendered dashboard
- expected impact (data disclosure, XSS, SSRF, prototype pollution, supply chain, etc.)

## Scope Notes

- Sample data in this repo is synthetic.
- The public dashboard is a static proof surface, not a live bridge into a production ERP, WMS, TMS, or customs system.
- If future versions ever ingest customer-owned shipment data, supplier records, or operational credentials, threat posture should be re-reviewed before enabling that path publicly.
