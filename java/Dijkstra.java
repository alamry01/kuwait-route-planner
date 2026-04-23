import java.util.*;

public class Dijkstra {

    public static PathResult findPath(Graph graph, String start, String end) {
        PathResult result = new PathResult("Dijkstra");

        Map<String, Double> dist = new HashMap<>();
        Map<String, String> prev = new HashMap<>();
        Set<String> visited = new HashSet<>();

        for (String n : graph.nodes()) {
            dist.put(n, Double.MAX_VALUE);
            prev.put(n, null);
        }
        dist.put(start, 0.0);

        PriorityQueue<String> pq = new PriorityQueue<>(
            Comparator.comparingDouble(n -> dist.getOrDefault(n, Double.MAX_VALUE))
        );
        pq.add(start);

        System.out.println("\n[Dijkstra] Starting from: " + start + " to " + end);

        while (!pq.isEmpty()) {
            String u = pq.poll();
            if (visited.contains(u)) continue;
            visited.add(u);

            System.out.printf("  Visit: %-22s dist = %.0f%n", u, dist.get(u));

            if (u.equals(end)) break;

            for (Edge e : graph.neighbors(u)) {
                if (visited.contains(e.dest)) continue;
                double alt = dist.get(u) + e.weight;
                if (alt < dist.get(e.dest)) {
                    dist.put(e.dest, alt);
                    prev.put(e.dest, u);
                    pq.add(e.dest);
                }
            }
        }

        result.nodesVisited = visited.size();
        if (dist.get(end) < Double.MAX_VALUE) {
            result.totalDist = dist.get(end);
            String n = end;
            while (n != null) {
                result.path.add(0, n);
                n = prev.get(n);
            }
        }
        return result;
    }
}
