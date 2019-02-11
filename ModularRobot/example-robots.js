// IMPORTS
const {roadGraph} = require("./roads");


// RANDOM ROBOT
// moves to a random reachable place from current position
function randomPick(array) {
  let choice = Math.floor(Math.random()*array.length);
  return array[choice];
}

function randomRobot(state) {
  return {direction: randomPick(roadGraph[state.place])};
}


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


//EXPORTS
exports.randomRobot = randomRobot;
exports.routeRobot = routeRobot;
exports.goalOrientedRobot = goalOrientedRobot;
exports.smartGoalOrientedRobot = smartGoalOrientedRobot;
exports.lazyRobot = lazyRobot;
