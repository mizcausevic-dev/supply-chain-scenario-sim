import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { analyze } from "../src/analyze.js";
import { toMarkdown, toSummary } from "../src/format.js";
import type { SupplyScenarioExport } from "../src/types.js";

const here = fileURLToPath(new URL(".", import.meta.url));
const fixture = (name: string): SupplyScenarioExport =>
  JSON.parse(readFileSync(`${here}/../fixtures/${name}`, "utf8")) as SupplyScenarioExport;

const NOW = "2026-05-30T00:00:00Z";

describe("analyze", () => {
  it("counts baselines and scenarios", () => {
    const report = analyze(fixture("supply-scenarios.json"), { now: NOW });
    expect(report.baselines).toBe(2);
    expect(report.currentBaselines).toBe(1);
    expect(report.scenarios).toBe(6);
  });

  it("flags missing current baseline as high", () => {
    const report = analyze({ baselines: [], scenarios: [] }, { now: NOW });
    expect(report.findingsList.find((finding) => finding.code === "no-current-baseline")?.severity).toBe("high");
  });

  it("flags stale baselines", () => {
    const report = analyze(fixture("supply-scenarios.json"), { now: NOW });
    expect(report.findingsList.find((finding) => finding.code === "stale-baseline")?.subjectName).toContain("regions/");
  });

  it("flags inventory breaches and supplier failure risks", () => {
    const report = analyze(fixture("supply-scenarios.json"), { now: NOW });
    expect(report.findingsList.find((finding) => finding.code === "inventory-buffer-breach")).toBeDefined();
    expect(report.findingsList.find((finding) => finding.code === "supplier-failure-risk")?.service).toBe("Supplier cluster");
  });

  it("flags carrier, customs, and service-level drift", () => {
    const report = analyze(fixture("supply-scenarios.json"), { now: NOW });
    expect(report.findingsList.find((finding) => finding.code === "carrier-capacity-shock")).toBeDefined();
    expect(report.findingsList.find((finding) => finding.code === "customs-hold-risk")).toBeDefined();
    expect(report.findingsList.find((finding) => finding.code === "service-level-slip")).toBeDefined();
  });

  it("flags stale scenario windows", () => {
    const report = analyze(fixture("supply-scenarios.json"), { now: NOW, staleRoutingAfterHours: 24 });
    expect(report.findingsList.find((finding) => finding.code === "stale-scenario-window")).toBeDefined();
  });

  it("ok=true on a clean fixture", () => {
    const report = analyze(fixture("supply-clean.json"), { now: NOW });
    expect(report.ok).toBe(true);
    expect(report.findingsList.filter((finding) => finding.severity === "high")).toEqual([]);
  });
});

describe("formatters", () => {
  it("toMarkdown ranks high findings first", () => {
    const markdown = toMarkdown(analyze(fixture("supply-scenarios.json"), { now: NOW }));
    expect(markdown).toContain("❌");
    expect(markdown.indexOf("🔴")).toBeLessThan(markdown.indexOf("🟠"));
  });

  it("toSummary emits a one-liner", () => {
    const summary = toSummary(analyze(fixture("supply-scenarios.json"), { now: NOW }));
    expect(summary).toMatch(/baselines/);
    expect(summary).toMatch(/scenarios/);
  });
});
