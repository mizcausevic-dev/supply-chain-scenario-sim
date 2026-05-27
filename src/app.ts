// SPDX-License-Identifier: AGPL-3.0-or-later

import express from "express";
import { fileURLToPath } from "node:url";

import {
  constraintRisks,
  payload,
  recoveryPosture,
  scenarioLane,
  summary,
  verification
} from "./services/supplyChainScenarioSimService.js";
import {
  renderConstraintRisks,
  renderDocs,
  renderOverview,
  renderRecoveryPosture,
  renderScenarioLane,
  renderVerification
} from "./services/render.js";

const app = express();
const port = Number(process.env.PORT ?? 5517);
const host = process.env.HOST || "0.0.0.0";

app.get("/", (_req, res) => res.type("html").send(renderOverview()));
app.get("/scenario-lane", (_req, res) => res.type("html").send(renderScenarioLane()));
app.get("/constraint-risks", (_req, res) => res.type("html").send(renderConstraintRisks()));
app.get("/recovery-posture", (_req, res) => res.type("html").send(renderRecoveryPosture()));
app.get("/verification", (_req, res) => res.type("html").send(renderVerification()));
app.get("/docs", (_req, res) => res.type("html").send(renderDocs()));

app.get("/api/dashboard/summary", (_req, res) => res.json(summary()));
app.get("/api/scenario-lane", (_req, res) => res.json(scenarioLane()));
app.get("/api/constraint-risks", (_req, res) => res.json(constraintRisks()));
app.get("/api/recovery-posture", (_req, res) => res.json(recoveryPosture()));
app.get("/api/verification", (_req, res) => res.json(verification()));
app.get("/api/sample", (_req, res) => res.json(payload()));

const currentFile = fileURLToPath(import.meta.url);
const invokedDirectly = process.argv[1] !== undefined && currentFile === process.argv[1];

if (invokedDirectly) {
  app.listen(port, host, () => {
    console.log(`Supply Chain Scenario Sim listening on http://${host}:${port}`);
  });
}

export default app;
