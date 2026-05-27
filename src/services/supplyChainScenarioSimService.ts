// SPDX-License-Identifier: AGPL-3.0-or-later

import { analyze } from "../analyze.js";
import { recoveryPackets, sampleSupplyScenarioPayload, scenarioLanePackets } from "../data/sampleSupplyScenarios.js";
import type { Finding } from "../types.js";

const NOW = "2026-05-30T00:00:00Z";
const report = analyze(sampleSupplyScenarioPayload, {
  now: NOW,
  staleRoutingAfterHours: 24
});

function severityRank(finding: Finding): number {
  return finding.severity === "high"
    ? 0
    : finding.severity === "medium"
      ? 1
      : finding.severity === "low"
        ? 2
        : 3;
}

export function summary() {
  return {
    baselines: report.baselines,
    currentBaselines: report.currentBaselines,
    scenarios: report.scenarios,
    blockedFlows: report.blockedFlows,
    lateLoads: report.lateLoads,
    recoveryPackets: recoveryPackets.length,
    highFindings: report.findingsList.filter((finding) => finding.severity === "high").length,
    recommendation:
      "Protect supplier continuity, clear customs blockers, rebalance inventory buffers, and reroute carrier capacity before service-level commitments slip further."
  };
}

export function scenarioLane() {
  return scenarioLanePackets.map((lane) => ({
    ...lane,
    relatedFindings: report.findingsList.filter((finding) => finding.family === lane.family).length
  }));
}

export function constraintRisks() {
  return [...report.findingsList].sort((left, right) => severityRank(left) - severityRank(right));
}

export function recoveryPosture() {
  return recoveryPackets;
}

export function verification() {
  return [
    "The dashboard is backed by a real offline analyzer and CLI, not static copy alone.",
    "Baselines, scenarios, and recovery packets are synthetic sample data only; no live ERP, WMS, TMS, or customs credentials are published.",
    "The control plane keeps supplier, carrier, customs, inventory, and service-level pressure visible for operations and fulfillment teams.",
    "This surface demonstrates supply-chain scenario simulation and operator routing, not a generic logistics keyword page.",
    "It complements the industrial, commerce, and field workflow Atlas lanes with a direct logistics operator proof surface."
  ];
}

export function payload() {
  return {
    summary: summary(),
    scenarioLane: scenarioLane(),
    constraintRisks: constraintRisks(),
    recoveryPosture: recoveryPosture(),
    verification: verification(),
    sample: sampleSupplyScenarioPayload
  };
}
