// Operator surface for supply-chain scenario simulation and recovery posture.
//
// Inputs reflect exported or captured logistics posture:
//   - network baseline snapshots
//   - disruption events across supplier, carrier, customs, inventory, demand, and weather controls

export type ScopeKind = "NETWORK" | "REGION" | "FACILITY" | "SUPPLIER";
export type BaselineStatus = "CURRENT" | "STALE";
export type DriftStatus = "OPEN" | "ACKNOWLEDGED" | "ROUTED";
export type AnomalyFamily = "Demand" | "Inventory" | "Carrier" | "Supplier" | "Customs" | "Weather";

export interface SupplyBaseline {
  id: string;
  name: string;
  scope: ScopeKind;
  scopePath: string;
  baselineStatus: BaselineStatus;
  owner: string;
  weeklyVolumeUnits: number;
  inventoryBufferDays: number;
  targetServiceLevelPct: number;
  targetLeadTimeDays: number;
  collectedAt: string;
}

export interface SupplyScenario {
  id: string;
  baselineId: string;
  scope: ScopeKind;
  scopePath: string;
  family: AnomalyFamily;
  status: DriftStatus;
  node: string;
  expectedState: string;
  observedState: string;
  estimatedRevenueAtRiskUsd: number;
  changeWindowHours: number;
  owner: string;
  breaksGuardrail?: boolean;
  projectedServiceLevelPct?: number;
  targetServiceLevelPct?: number;
  projectedLeadTimeDays?: number;
  targetLeadTimeDays?: number;
  note?: string;
}

export interface SupplyScenarioExport {
  baselines?: SupplyBaseline[];
  scenarios?: SupplyScenario[];
}

export type FindingSeverity = "high" | "medium" | "low" | "info";

export type FindingCode =
  | "no-current-baseline"
  | "stale-baseline"
  | "inventory-buffer-breach"
  | "supplier-failure-risk"
  | "carrier-capacity-shock"
  | "customs-hold-risk"
  | "service-level-slip"
  | "stale-scenario-window";

export interface Finding {
  code: FindingCode;
  severity: FindingSeverity;
  message: string;
  subject: string;
  subjectName?: string;
  scope?: ScopeKind;
  family?: AnomalyFamily;
  service?: string;
}

export interface DriftReport {
  generatedAt: string;
  baselines: number;
  currentBaselines: number;
  scenarios: number;
  blockedFlows: number;
  lateLoads: number;
  recoveryPackets: number;
  findingsList: Finding[];
  ok: boolean;
}

export interface DriftOptions {
  now?: string;
  staleRoutingAfterHours?: number;
}
