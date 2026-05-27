import { describe, expect, test } from "vitest";

import {
  renderConstraintRisks,
  renderDocs,
  renderOverview,
  renderRecoveryPosture,
  renderScenarioLane,
  renderVerification
} from "./render.js";

describe("render", () => {
  test("overview carries the supply-chain control-plane framing", () => {
    expect(renderOverview()).toContain("Supply-chain scenarios");
  });

  test("secondary routes render their headings", () => {
    expect(renderScenarioLane()).toContain("Scenario Lane");
    expect(renderConstraintRisks()).toContain("Constraint Risks");
    expect(renderRecoveryPosture()).toContain("Recovery Posture");
    expect(renderVerification()).toContain("Verification");
    expect(renderDocs()).toContain("Offline supply scenario analysis");
  });
});
