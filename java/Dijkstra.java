import java.util.*;

/**
 * Implements Dijkstra's shortest path algorithm.
 * Finds the shortest path between two nodes in a weighted graph
 * by always visiting the unvisited node with the smallest distance first.
 * Uses a PriorityQueue (min-heap) for efficient minimum extraction.
 */
public class Dijkstra {

    /**
     * Finds the shortest path from start to end using Dijkstra's algorithm.
     *
     * Steps:
     * 1. initialize all distances to infinity, except start node initialize it to 0
     * 2. Add start to priority queue sorted by distance (not coordinates)
     * 3. Poll the node with the smallest distance
     * 4. Skip if already visited, else mark the node as visited
     * 5. Stop if we reach to the end node
     * 6. Relax all unvisited neighbors (update if shorter path found)
     * 7. Recreating path using prev map from end to start
     *
     * @param graph the graph representing Kuwait's road network
     * @param start the starting area name
     * @param end   the destination area name
     * @return PathResult containing the shortest path, distance, and nodes visited
     */
    public static PathResult findPath(Graph graph, String start, String end) {
        PathResult result = new PathResult("Dijkstra");

        // dist: stores shortest known distance from start to each node
        Map<String, Double> dist = new HashMap<>();
        // prev: stores which node we came from (for path reconstruction)
        Map<String, String> prev = new HashMap<>();
        // visited: tracks nodes already processed to avoid revisiting
        Set<String> visited = new HashSet<>();

        // Initialize all distances to infinity and prev to null
        for (String n : graph.nodes()) {
            dist.put(n, Double.MAX_VALUE);
            prev.put(n, null);
        }
        // Start node has distance 0
        dist.put(start, 0.0);

        // Priority queue sorted by distance - always polls the closest node
        PriorityQueue<String> pq = new PriorityQueue<>(
                Comparator.comparingDouble(n -> dist.getOrDefault(n, Double.MAX_VALUE)));
        pq.add(start);

        // Main loop: process nodes until queue is empty or destination reached
        while (!pq.isEmpty()) {
            // Poll the node with the smallest distance
            String u = pq.poll();

            // Skip if already visited (handles duplicate entries in PQ)
            if (visited.contains(u)) {
                continue;
            }
            // Mark as visited so we don't process it again
            visited.add(u);

            // Early termination: destination reached
            if (u.equals(end)) {
                break;
            }

            // Relaxation: check all neighbors of current node
            for (Edge e : graph.neighbors(u)) {
                // Skip already visited neighbors
                if (visited.contains(e.dest)) {
                    continue;
                }
                // Calculate new distance through current node
                double alt = dist.get(u) + e.weight;
                // If shorter path found, update distance and predecessor
                if (alt < dist.get(e.dest)) {
                    dist.put(e.dest, alt);
                    prev.put(e.dest, u);
                    pq.add(e.dest);
                }
            }
        }

        // Store number of nodes visited
        result.nodesVisited = visited.size();

        // Path reconstruction: backtrack from end to start using prev map
        if (dist.get(end) < Double.MAX_VALUE) {
            result.totalDist = dist.get(end);
            String n = end;
            // Add each node to the front of the list so path reads start -> end
            while (n != null) {
                result.path.add(0, n);
                n = prev.get(n);
            }
        }
        return result;
    }
}
