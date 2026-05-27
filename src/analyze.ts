import type { DriftOptions, DriftReport, Finding, SupplyBaseline, SupplyScenarioExport } from "./types.js";

function isCurrent(baseline: SupplyBaseline): boolean {
  return baseline.baselineStatus === "CURRENT";
}

export function analyze(payload: SupplyScenarioExport, options: DriftOptions = {}): DriftReport {
  const now = options.now ?? new Date().toISOString();
  const staleRoutingAfterHours = options.staleRoutingAfterHours ?? 24;
  const baselines = payload.baselines ?? [];
  const scenarios = payload.scenarios ?? [];
  const findingsList: Finding[] = [];

  const currentBaselines = baselines.filter(isCurrent).length;
  if (currentBaselines === 0) {
    findingsList.push({
      code: "no-current-baseline",
      severity: "high",
      message: "No current supply baseline is available for simulation and recovery decisions.",
      subject: "baseline-currentness"
    });
  }

  for (const baseline of baselines) {
    if (baseline.baselineStatus === "STALE") {
      findingsList.push({
        code: "stale-baseline",
        severity: "medium",
        message: `Supply baseline for "${baseline.name}" is stale and should be refreshed before certifying recovery posture.`,
        subject: baseline.id,
        subjectName: baseline.scopePath,
        scope: baseline.scope
      });
    }
  }

  for (const scenario of scenarios) {
    const observed = scenario.observedState.toLowerCase();
    const expected = scenario.expectedState.toLowerCase();

    if (scenario.family === "Inventory" && (observed.includes("buffer") || scenario.estimatedRevenueAtRiskUsd >= 4000)) {
      findingsList.push({
        code: "inventory-buffer-breach",
        severity: "high",
        message: `Inventory buffer on "${scenario.scopePath}" is already below the recovery threshold and is exposing $${Math.round(scenario.estimatedRevenueAtRiskUsd).toLocaleString()} in downstream revenue risk.`,
        subject: scenario.id,
        subjectName: scenario.scopePath,
        scope: scenario.scope,
        family: scenario.family,
        service: scenario.node
      });
    }

    if (scenario.family === "Supplier" && (observed.includes("supplier") || observed.includes("shortage") || scenario.estimatedRevenueAtRiskUsd >= 6000)) {
      findingsList.push({
        code: "supplier-failure-risk",
        severity: scenario.breaksGuardrail ? "high" : "medium",
        message: `Supplier continuity risk is active on "${scenario.scopePath}" and should be routed before replenishment and launch commitments slip.`,
        subject: scenario.id,
        subjectName: scenario.scopePath,
        scope: scenario.scope,
        family: scenario.family,
        service: scenario.node
      });
    }

    if (scenario.family === "Carrier" && (observed.includes("capacity") || observed.includes("congestion") || scenario.estimatedRevenueAtRiskUsd >= 5000)) {
      findingsList.push({
        code: "carrier-capacity-shock",
        severity: "medium",
        message: `Carrier capacity shock is active on "${scenario.scopePath}" and should be rerouted before lead-time variance compounds further.`,
        subject: scenario.id,
        subjectName: scenario.scopePath,
        scope: scenario.scope,
        family: scenario.family,
        service: scenario.node
      });
    }

    if (scenario.family === "Customs" && (observed.includes("hold") || expected.includes("clearance"))) {
      findingsList.push({
        code: "customs-hold-risk",
        severity: "medium",
        message: `Customs or cross-border hold is active on "${scenario.scopePath}" and should be cleared before committed delivery windows break.`,
        subject: scenario.id,
        subjectName: scenario.scopePath,
        scope: scenario.scope,
        family: scenario.family,
        service: scenario.node
      });
    }

    if (
      scenario.projectedServiceLevelPct !== undefined &&
      scenario.targetServiceLevelPct !== undefined &&
      scenario.projectedServiceLevelPct < scenario.targetServiceLevelPct
    ) {
      const gap = scenario.targetServiceLevelPct - scenario.projectedServiceLevelPct;
      findingsList.push({
        code: "service-level-slip",
        severity: gap >= 6 ? "high" : "medium",
        message: `Projected service level on "${scenario.scopePath}" is ${scenario.projectedServiceLevelPct}% against a ${scenario.targetServiceLevelPct}% target and needs intervention.`,
        subject: scenario.id,
        subjectName: scenario.scopePath,
        scope: scenario.scope,
        family: scenario.family,
        service: scenario.node
      });
    }

    if (scenario.changeWindowHours > staleRoutingAfterHours) {
      findingsList.push({
        code: "stale-scenario-window",
        severity: scenario.changeWindowHours > staleRoutingAfterHours * 2 ? "medium" : "low",
        message: `Scenario on "${scenario.scopePath}" has remained unresolved for ${scenario.changeWindowHours} hours.`,
        subject: scenario.id,
        subjectName: scenario.scopePath,
        scope: scenario.scope,
        family: scenario.family,
        service: scenario.node
      });
    }
  }

  const blockedFlows = scenarios.filter((scenario) => scenario.breaksGuardrail || scenario.status !== "ROUTED").length;
  const lateLoads = scenarios.filter(
    (scenario) =>
      scenario.projectedServiceLevelPct !== undefined &&
      scenario.targetServiceLevelPct !== undefined &&
      scenario.projectedServiceLevelPct < scenario.targetServiceLevelPct
  ).length;
  const ok = !findingsList.some((finding) => finding.severity === "high");

  return {
    generatedAt: now,
    baselines: baselines.length,
    currentBaselines,
    scenarios: scenarios.length,
    blockedFlows,
    lateLoads,
    recoveryPackets: scenarios.length,
    findingsList,
    ok
  };
}
