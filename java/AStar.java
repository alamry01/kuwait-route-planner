import java.util.*;

public class AStar {

    private static double heuristic(Graph g, String a, String b) {
        double[] pa = g.getPos(a), pb = g.getPos(b);
        return Math.sqrt(Math.pow(pa[0] - pb[0], 2) + Math.pow(pa[1] - pb[1], 2)) * 0.3;
    }

    public static PathResult findPath(Graph graph, String start, String end) {
        PathResult result = new PathResult("A*");

        Map<String, Double> gScore = new HashMap<>();
        Map<String, Double> fScore = new HashMap<>();
        Map<String, String> prev = new HashMap<>();
        Set<String> visited = new HashSet<>();

        for (String n : graph.nodes()) {
            gScore.put(n, Double.MAX_VALUE);
            fScore.put(n, Double.MAX_VALUE);
            prev.put(n, null);
        }
        gScore.put(start, 0.0);
        fScore.put(start, heuristic(graph, start, end));

        PriorityQueue<String> pq = new PriorityQueue<>(
            Comparator.comparingDouble(n -> fScore.getOrDefault(n, Double.MAX_VALUE))
        );
        pq.add(start);

        System.out.println("\n[A*] Starting from: " + start + " to " + end);

        while (!pq.isEmpty()) {
            String u = pq.poll();
            if (visited.contains(u)) continue;
            visited.add(u);

            double g = gScore.get(u);
            double h = heuristic(graph, u, end);
            System.out.printf("  Visit: %-22s g=%.0f  h=%.1f  f=%.1f%n", u, g, h, g + h);

            if (u.equals(end)) break;

            for (Edge e : graph.neighbors(u)) {
                if (visited.contains(e.dest)) continue;
                double tentG = gScore.get(u) + e.weight;
                if (tentG < gScore.get(e.dest)) {
                    prev.put(e.dest, u);
                    gScore.put(e.dest, tentG);
                    fScore.put(e.dest, tentG + heuristic(graph, e.dest, end));
                    pq.add(e.dest);
                }
            }
        }

        result.nodesVisited = visited.size();
        if (gScore.get(end) < Double.MAX_VALUE) {
            result.totalDist = gScore.get(end);
            String n = end;
            while (n != null) {
                result.path.add(0, n);
                n = prev.get(n);
            }
        }
        return result;
    }
}
