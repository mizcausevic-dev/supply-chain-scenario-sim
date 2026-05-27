import type { SupplyScenarioExport } from "../types.js";

export const sampleSupplyScenarioPayload: SupplyScenarioExport = {
  baselines: [
    {
      id: "na-network-core",
      name: "North America Core Network",
      scope: "NETWORK",
      scopePath: "networks/north-america-core",
      baselineStatus: "CURRENT",
      owner: "Supply Operations",
      weeklyVolumeUnits: 148000,
      inventoryBufferDays: 11,
      targetServiceLevelPct: 97,
      targetLeadTimeDays: 4,
      collectedAt: "2026-05-30T09:00:00Z"
    },
    {
      id: "emea-cold-chain",
      name: "EMEA Cold Chain Lane",
      scope: "REGION",
      scopePath: "regions/emea-cold-chain",
      baselineStatus: "STALE",
      owner: "Regional Logistics",
      weeklyVolumeUnits: 41200,
      inventoryBufferDays: 8,
      targetServiceLevelPct: 96,
      targetLeadTimeDays: 5,
      collectedAt: "2026-05-27T00:10:00Z"
    }
  ],
  scenarios: [
    {
      id: "scn-dfw-buffer",
      baselineId: "na-network-core",
      scope: "FACILITY",
      scopePath: "facilities/dallas-crossdock",
      family: "Inventory",
      status: "OPEN",
      node: "Dallas crossdock",
      expectedState: "Buffer remains above seven days for outbound kits",
      observedState: "Inventory buffer down to three days after late inbound replenishment",
      estimatedRevenueAtRiskUsd: 18400,
      changeWindowHours: 16,
      owner: "Fulfillment Operations",
      breaksGuardrail: true,
      projectedServiceLevelPct: 88,
      targetServiceLevelPct: 96,
      projectedLeadTimeDays: 6,
      targetLeadTimeDays: 3
    },
    {
      id: "scn-shenzhen-supplier",
      baselineId: "na-network-core",
      scope: "SUPPLIER",
      scopePath: "suppliers/shenzhen-components-cluster",
      family: "Supplier",
      status: "OPEN",
      node: "Supplier cluster",
      expectedState: "Tier-1 supplier confirms the next two weekly component waves",
      observedState: "Supplier shortage flagged on the next production lot with partial confirmation only",
      estimatedRevenueAtRiskUsd: 21300,
      changeWindowHours: 30,
      owner: "Strategic Sourcing",
      breaksGuardrail: true,
      projectedServiceLevelPct: 91,
      targetServiceLevelPct: 97,
      projectedLeadTimeDays: 9,
      targetLeadTimeDays: 5
    },
    {
      id: "scn-long-beach-capacity",
      baselineId: "na-network-core",
      scope: "REGION",
      scopePath: "regions/pacific-import-lane",
      family: "Carrier",
      status: "ACKNOWLEDGED",
      node: "Ocean + drayage network",
      expectedState: "Carrier capacity remains within the committed import window",
      observedState: "Carrier congestion and drayage capacity squeeze are extending port dwell",
      estimatedRevenueAtRiskUsd: 9200,
      changeWindowHours: 19,
      owner: "Transportation Control Tower",
      projectedServiceLevelPct: 93,
      targetServiceLevelPct: 97,
      projectedLeadTimeDays: 7,
      targetLeadTimeDays: 5
    },
    {
      id: "scn-rotterdam-customs",
      baselineId: "emea-cold-chain",
      scope: "REGION",
      scopePath: "regions/rotterdam-pharma-entry",
      family: "Customs",
      status: "OPEN",
      node: "Customs + broker queue",
      expectedState: "Cross-border clearance completes in the normal release window",
      observedState: "Customs hold remains open pending documentation correction",
      estimatedRevenueAtRiskUsd: 7600,
      changeWindowHours: 52,
      owner: "Trade Compliance",
      breaksGuardrail: true,
      projectedServiceLevelPct: 90,
      targetServiceLevelPct: 96,
      projectedLeadTimeDays: 8,
      targetLeadTimeDays: 5
    },
    {
      id: "scn-demand-surge",
      baselineId: "na-network-core",
      scope: "NETWORK",
      scopePath: "networks/northeast-ecommerce-lane",
      family: "Demand",
      status: "ACKNOWLEDGED",
      node: "Demand planning lane",
      expectedState: "Promo-driven demand remains within modeled capacity and buffer tolerance",
      observedState: "Demand surge is running above the modeled ceiling on the current weekly wave",
      estimatedRevenueAtRiskUsd: 5400,
      changeWindowHours: 14,
      owner: "Demand Planning",
      projectedServiceLevelPct: 94,
      targetServiceLevelPct: 95,
      projectedLeadTimeDays: 5,
      targetLeadTimeDays: 4
    },
    {
      id: "scn-weather-reroute",
      baselineId: "na-network-core",
      scope: "NETWORK",
      scopePath: "networks/midwest-weather-reroute",
      family: "Weather",
      status: "ROUTED",
      node: "Midwest regional flow",
      expectedState: "Weather reroute keeps linehaul and delivery posture within tolerance",
      observedState: "Storm reroute still adds one-day lead time variance across the current window",
      estimatedRevenueAtRiskUsd: 3800,
      changeWindowHours: 27,
      owner: "Network Planning",
      projectedServiceLevelPct: 95,
      targetServiceLevelPct: 97,
      projectedLeadTimeDays: 5,
      targetLeadTimeDays: 4
    }
  ]
};

export const scenarioLanePackets = [
  {
    id: "supplier-continuity",
    lane: "Supplier continuity lane",
    family: "Supplier",
    owner: "Strategic Sourcing",
    focus: "Tier-1 component continuity and substitute path readiness",
    status: "red",
    note: "Partial supplier confirmation is already pushing recovery work into the commercial window.",
    nextAction: "Confirm substitute capacity and lock the purchase split before the next production cut-off."
  },
  {
    id: "capacity-recovery",
    lane: "Port and capacity lane",
    family: "Carrier",
    owner: "Transportation Control Tower",
    focus: "Port dwell, linehaul capacity, and reroute options",
    status: "yellow",
    note: "Carrier congestion is understood but still needs a cleaner recovery path.",
    nextAction: "Approve alternate drayage and reserve overflow linehaul before the dwell window expands."
  },
  {
    id: "border-clearance",
    lane: "Border clearance lane",
    family: "Customs",
    owner: "Trade Compliance",
    focus: "Broker escalation, document correction, and release timing",
    status: "red",
    note: "The customs hold is still active and is now service-level material.",
    nextAction: "Correct the filing packet and escalate the broker queue before the next dispatch wave."
  },
  {
    id: "buffer-rebalance",
    lane: "Inventory and demand lane",
    family: "Inventory",
    owner: "Fulfillment Operations",
    focus: "Inventory buffer health and demand-driven reallocation",
    status: "red",
    note: "Buffer depth has slipped below the recovery threshold on a high-volume lane.",
    nextAction: "Reallocate inventory and tighten the next inbound plan before service levels degrade further."
  }
] as const;

export const recoveryPackets = [
  {
    packetId: "SIM-11",
    lane: "Supplier substitute packet",
    owner: "Strategic Sourcing",
    status: "red",
    completenessScore: 61,
    decisionNote: "Supplier continuity needs a substitute sourcing path before launch-safe replenishment can be claimed.",
    blocker: "Secondary source approval and component QA sign-off are still open.",
    launchWindowHours: 10
  },
  {
    packetId: "SIM-18",
    lane: "Carrier reroute packet",
    owner: "Transportation Control Tower",
    status: "yellow",
    completenessScore: 73,
    decisionNote: "Capacity is understood, but overflow routing and carrier commitments are not fully locked.",
    blocker: "Alternate drayage confirmation and port-priority slotting are still pending.",
    launchWindowHours: 12
  },
  {
    packetId: "SIM-24",
    lane: "Customs release packet",
    owner: "Trade Compliance",
    status: "red",
    completenessScore: 58,
    decisionNote: "Customs release cannot be called stable until the corrected filing clears broker review.",
    blocker: "Supporting paperwork and broker escalation are incomplete.",
    launchWindowHours: 8
  },
  {
    packetId: "SIM-31",
    lane: "Inventory rebalance packet",
    owner: "Fulfillment Operations",
    status: "red",
    completenessScore: 64,
    decisionNote: "Inventory recovery is mapped, but the lane is still below the required service buffer.",
    blocker: "Outbound allocation and inbound acceleration are not both confirmed yet.",
    launchWindowHours: 6
  }
] as const;
