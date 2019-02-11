// IMPORTS
const {roads} = require("./roads");
const {VillageState, runRobot} = require("./state");
const {randomRobot, routeRobot, goalOrientedRobot, smartGoalOrientedRobot, lazyRobot} = require("./example-robots");


// COMPARE ROBOT SPEED
function compareRobots(robot1, memory1, robot2, memory2, num_runs=100) {
  // randomly distribute parcels
  let village = new VillageState(roads);
  let total_turns = {robot1: 0, robot2: 0};
  // run both robots num_runs times, add up turns to finish for each robot
  for (let run = 0; run < num_runs; run++) {
    let village_with_parcels = village.random();
    total_turns.robot1 += runRobot(village_with_parcels, robot1, memory1);
    total_turns.robot2 += runRobot(village_with_parcels, robot2, memory2);
  }
  console.log(`Average turns taken:
    robot1: ${total_turns.robot1/num_runs}, robot2: ${total_turns.robot2/num_runs}`);
}

compareRobots(smartGoalOrientedRobot, [], lazyRobot, []);
