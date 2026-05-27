import { describe, expect, test } from "vitest";

import {
  constraintRisks,
  recoveryPosture,
  scenarioLane,
  summary,
  verification
} from "./supplyChainScenarioSimService.js";

describe("supplyChainScenarioSimService", () => {
  test("summary reflects the sample supply posture", () => {
    expect(summary()).toMatchObject({
      baselines: 2,
      currentBaselines: 1,
      scenarios: 6,
      blockedFlows: 5,
      lateLoads: 6,
      recoveryPackets: 4
    });
  });

  test("scenario lane stays mapped to owners", () => {
    const lanes = scenarioLane();
    expect(lanes).toHaveLength(4);
    expect(lanes.some((lane) => lane.lane === "Supplier continuity lane" && lane.owner === "Strategic Sourcing")).toBe(true);
  });

  test("constraint risks sort high severity first", () => {
    const risks = constraintRisks();
    expect(risks[0]?.severity).toBe("high");
    expect(risks.some((risk) => risk.code === "customs-hold-risk")).toBe(true);
  });

  test("recovery posture and verification stay populated", () => {
    expect(recoveryPosture()).toHaveLength(4);
    expect(verification().length).toBeGreaterThan(3);
  });
});
