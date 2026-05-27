import { constraintRisks, scenarioLane, summary } from "../src/services/supplyChainScenarioSimService.js";

console.log("supply-chain-scenario-sim demo");
console.log(JSON.stringify(summary(), null, 2));
console.log(
  JSON.stringify(
    scenarioLane().map((lane) => ({
      lane: lane.lane,
      owner: lane.owner,
      status: lane.status
    })),
    null,
    2
  )
);
console.log(JSON.stringify(constraintRisks().slice(0, 3), null, 2));
