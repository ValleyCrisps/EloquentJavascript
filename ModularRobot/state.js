// IMPORTS
const {roadGraph} = require("./roads");


class VillageState {
  constructor(place, parcels) {
    this.place = place;
    this.parcels = parcels;
  }

  random(parcelCount = 5) {
    let parcels = [];
    for (let i = 0; i < parcelCount; i++) {
      let address = randomPick(Object.keys(roadGraph));
      let place;
      // pick a place for the parcel. Choose again if place == address
      do {
        place = randomPick(Object.keys(roadGraph));
      } while (place == address);
      parcels.push({place, address});
    }
    return new VillageState("Post Office", parcels);
  }

  move(destination) {
    // if destination isn't reachable from current position, return curent state
    if (!roadGraph[this.place].includes(destination)) { return this; }
    else {
      // update parcels location
      // map: parcels not at current location stay where they ar.
      //      parcels at current location are picked up and moved to destination
      // filter: parcels whose address is destination are delivered (dropped out)
      let parcels = this.parcels.map(p => {
        if (p.place != this.place) { return p; }
        return {place: destination, address: p.address};
      }).filter(p => p.place != p.address);
      return new VillageState(destination, parcels);
    }
  }
}

function randomPick(array) {
  let choice = Math.floor(Math.random()*array.length);
  return array[choice];
}

// Move robot according to robot's rules until no more parcels to deliver
function runRobot(state, robot, memory) {
  for (let turn = 0; ; turn++) {
    if (state.parcels.length == 0) {
      // console.log(`Finished in ${turn} turns`);
      // break;
      return turn;
    }
    let action = robot(state, memory);
    state = state.move(action.direction);
    memory = action.memory;
    // console.log(`Moved to ${action.direction}`);
  }
}

exports.VillageState = VillageState;
exports.runRobot = runRobot;
