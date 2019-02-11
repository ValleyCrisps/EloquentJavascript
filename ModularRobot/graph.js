// Build a graph from its edge set.
// the vertices of the graph are the object's properties
// the value of each property is an array representing the adjacent verices
// INPUT edges: array of pairs [[type1, type2], ...]
function buildGraph(edges) {
  let graph = Object.create(null);

  function addEdge(from, to) {
    if (graph[from] == null) {
      graph[from] = [to];
    }
    else {
      graph[from].push(to);
    }
  }

  for (let [from, to] of edges) {
    addEdge(from, to);
    addEdge(to, from);
  }
  return graph;
}

exports.buildGraph = buildGraph;
