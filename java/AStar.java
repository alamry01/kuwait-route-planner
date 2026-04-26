import java.util.*;

/**
 * Implements the A* shortest path algorithm.
 * Improves on Dijkstra by adding a heuristic function h(n) that estimates
 * the remaining distance to the destination. Sorts the priority queue by
 * f(n) = g(n) + h(n) instead of distance alone, directing the search
 * toward the goal and reducing the number of nodes visited.
 */
public class AStar {

    /**
     * Calculates the heuristic estimate between two nodes.
     * Uses Euclidean distance between their x,y positions, scaled by 0.1
     * to ensure admissibility (never overestimates actual road distance).
     *
     * @param g the graph (used to get node positions)
     * @param a the first node name
     * @param b the second node name
     * @return estimated distance between a and b
     */
    private static double heuristic(Graph g, String a, String b) {
        double[] pa = g.getPos(a), pb = g.getPos(b);
        return Math.sqrt(Math.pow(pa[0] - pb[0], 2) + Math.pow(pa[1] - pb[1], 2)) * 0.1;
    }

    /**
     * Finds the shortest path from start to end using the A* algorithm.
     *
     * Steps:
     * 1. Initialize gScore and fScore of all nodes to infinity, then the starting node gScore to 0
     * 2. Next, Set starting node fScore to heuristic(start, end)
     * 3. Add start to priority queue sorted by fScore
     * 4. Poll the node with smallest fScore
     * 5. Skip it if it had already been visited. If not, mark as visited
     * 6. Stop if destination is the node that was popped
     * 7. Relax all unvisited neighbors (update gScore, fScore, and prev)
     * 8. Reconstruct path repeatedly calling the previous node until it arrive at the starting node
     *
     * @param graph the graph representing Kuwait's road network
     * @param start the starting area name
     * @param end   the destination area name
     * @return PathResult containing the shortest path, distance, and nodes visited
     */
    public static PathResult findPath(Graph graph, String start, String end) {
        PathResult result = new PathResult("A*");

        // gScore: actual distance from start to each node
        Map<String, Double> gScore = new HashMap<>();
        // fScore: gScore + heuristic estimate to destination
        Map<String, Double> fScore = new HashMap<>();
        // prev: stores which node we came from (for path reconstruction)
        Map<String, String> prev = new HashMap<>();
        // visited: tracks nodes already processed
        Set<String> visited = new HashSet<>();

        // Initialize all scores to infinity and prev to null
        for (String n : graph.nodes()) {
            gScore.put(n, Double.MAX_VALUE);
            fScore.put(n, Double.MAX_VALUE);
            prev.put(n, null);
        }
        // Start node: gScore = 0, fScore = heuristic to destination
        gScore.put(start, 0.0);
        fScore.put(start, heuristic(graph, start, end));

        // Priority queue sorted by fScore - prioritizes nodes closer to destination
        PriorityQueue<String> pq = new PriorityQueue<>(
            Comparator.comparingDouble(n -> fScore.getOrDefault(n, Double.MAX_VALUE))
        );
        pq.add(start);

        // Main loop: process nodes until queue is empty or destination reached
        while (!pq.isEmpty()) {
            // Poll the node with the smallest fScore
            String u = pq.poll();

            // Skip if already visited
            if (visited.contains(u)) continue;
            // Mark as visited
            visited.add(u);

            // Early termination: destination reached
            if (u.equals(end)) break;

            // Relaxation: check all neighbors of current node
            for (Edge e : graph.neighbors(u)) {
                // Skip already visited neighbors
                if (visited.contains(e.dest)) continue;

                // Calculate tentative gScore through current node
                double tentG = gScore.get(u) + e.weight;

                // If shorter path found, update scores and predecessor
                if (tentG < gScore.get(e.dest)) {
                    prev.put(e.dest, u);
                    gScore.put(e.dest, tentG);
                    fScore.put(e.dest, tentG + heuristic(graph, e.dest, end));
                    pq.add(e.dest);
                }
            }
        }

        // Store number of nodes visited
        result.nodesVisited = visited.size();

        // Path reconstruction: backtrack from end to start using prev map
        if (gScore.get(end) < Double.MAX_VALUE) {
            result.totalDist = gScore.get(end);
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
