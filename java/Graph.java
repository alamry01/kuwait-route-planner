import java.util.*;

public class Graph {
    Map<String, List<Edge>> adj = new LinkedHashMap<>();
    Map<String, double[]> pos = new HashMap<>();

    void addNode(String id, double x, double y) {
        adj.putIfAbsent(id, new ArrayList<>());
        pos.put(id, new double[]{x, y});
    }

    void addEdge(String u, String v, double w) {
        adj.putIfAbsent(u, new ArrayList<>());
        adj.putIfAbsent(v, new ArrayList<>());
        boolean exists = adj.get(u).stream().anyMatch(e -> e.dest.equals(v));
        if (!exists) {
            adj.get(u).add(new Edge(v, w));
            adj.get(v).add(new Edge(u, w));
        }
    }

    List<Edge> neighbors(String node) {
        return adj.getOrDefault(node, Collections.emptyList());
    }

    Set<String> nodes() {
        return adj.keySet();
    }

    double[] getPos(String n) {
        return pos.getOrDefault(n, new double[]{0, 0});
    }
}
