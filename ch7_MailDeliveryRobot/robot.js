const roads = [
  "Alice's House-Bob's House",   "Alice's House-Cabin",
  "Alice's House-Post Office",   "Bob's House-Town Hall",
  "Daria's House-Ernie's House", "Daria's House-Town Hall",
  "Ernie's House-Grete's House", "Grete's House-Farm",
  "Grete's House-Shop",          "Marketplace-Farm",
  "Marketplace-Post Office",     "Marketplace-Shop",
  "Marketplace-Town Hall",       "Shop-Town Hall"
];

// Build a graph that encodes the roads information
function buildGraph(edges) {
  let graph = Object.create(null);

  // the vertices of the graph are the object's properties
  // the value of each property is an arrayrepresenting the adjacent verices
  function addEdge(from, to) {
    if (graph[from] == null) {
      graph[from] = [to];
    }
    else {
      graph[from].push(to);
    }
  }

  for (let [from, to] of edges.map(road => road.split("-"))) {
    addEdge(from, to);
    addEdge(to, from);
  }
  return graph;
}

const roadGraph = buildGraph(roads);

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

let first = new VillageState(
  "Post Office",
  [{place:"Post Office", address: "Alice's House"}]
);

// console.log(first.parcels);
//
// let next = first.move("Alice's House");
//
// console.log(next.place);
// console.log(next.parcels);

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


let village = new VillageState;

// RANDOM ROBOT
// moves to a random reachable place from current position
function randomPick(array) {
  let choice = Math.floor(Math.random()*array.length);
  return array[choice];
}

function randomRobot(state) {
  return {direction: randomPick(roadGraph[state.place])};
}

// runRobot(village.random(), randomRobot);

// RUN CIRCUIT TWICE
const mailRoute = [
  "Alice's House", "Cabin", "Alice's House", "Bob's House",
  "Town Hall", "Daria's House", "Ernie's House",
  "Grete's House", "Shop", "Grete's House", "Farm",
  "Marketplace", "Post Office"
];

function routeRobot(state, memory) {
  if (memory.length == 0) { memory = mailRoute; }
  return {direction: memory[0], memory: memory.slice(1)};
}

// runRobot(village.random(), routeRobot, []);


// FIND SHORTEST ROUTE TO COLLECT/DELIVER THE NEXT PARCEL
// shortest route from "from" to "to"
// WARNING: assume connected graph or infinite loop
function findRoute(graph, from, to) {
  // work: array of {places that should be explored next, the route up to place}
  let work = [{at: from, route: []}];
  for (let i = 0; i < work.length; i++) {
    let {at, route} = work[i];
    for (let place of graph[at]) {
      if (place == to) return route.concat(place);
      if(!work.some(w => w.at == place)) {
        work.push({at: place, route: route.concat(place)})
      }
    }
  }
}

function goalOrientedRobot({place, parcels}, route) {
  if (route.length == 0) {
    // look at first parcel
    let parcel = parcels[0];
    // if not already at parcel's place, go pick it up
    if (parcel.place != place) {
      route = findRoute(roadGraph, place, parcel.place);
    } else {
      // pick up parcel and deliver it
      route = findRoute(roadGraph, place, parcel.address);
    }
  }
  return {direction: route[0], memory: route.slice(1)};
}

// runRobot(village.random(), goalOrientedRobot, []);


function smartGoalOrientedRobot({place, parcels}, route) {
  // improves goalOrientedRobot by going to pick up the closest parcel first
  if (route.length == 0) {
    let parcelsToFetch = parcels.filter(p => p.place != place);
    let routes = [];
    // pick up all parcels first
    if (parcelsToFetch.length != 0) {
      for (let i = 0; i < parcelsToFetch.length; i++) {
        routes.push(findRoute(roadGraph, place, parcelsToFetch[i].place));
      }
      // find the closest parcel
      let distances = routes.map(r => r.length);
      route = routes[distances.indexOf(Math.min(...distances))];
    } else {
      // if the robot has already picked up all parcels, look for closest delivery
      for (let i = 0; i < parcels.length; i++) {
        routes.push(findRoute(roadGraph, place, parcels[i].address));
      }
      // compute distances
      let distances = routes.map(r => r.length);
      route = routes[distances.indexOf(Math.min(...distances))];
    }
  }
  return {direction: route[0], memory: route.slice(1)};
}


// runRobot(village.random(), smartGoalOrientedRobot, []);

// solution provided in the book
function lazyRobot({place, parcels}, route) {
  if (route.length == 0) {
    // Describe a route for every parcel
    let routes = parcels.map(parcel => {
      if (parcel.place != place) {
        return {route: findRoute(roadGraph, place, parcel.place),
                pickUp: true};
      } else {
        return {route: findRoute(roadGraph, place, parcel.address),
                pickUp: false};
      }
    });

    // This determines the precedence a route gets when choosing.
    // Route length counts negatively, routes that pick up a package
    // get a small bonus.
    function score({route, pickUp}) {
      return (pickUp ? 0.5 : 0) - route.length;
    }
    route = routes.reduce((a, b) => score(a) > score(b) ? a : b).route;
  }

  return {direction: route[0], memory: route.slice(1)};
}



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
