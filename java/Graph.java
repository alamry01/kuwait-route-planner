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

    void addEdge(String u, String v) {
        double[] pu = pos.get(u), pv = pos.get(v);
        double w = (pu != null && pv != null)
            ? Math.sqrt(Math.pow(pu[0] - pv[0], 2) + Math.pow(pu[1] - pv[1], 2))
            : 1.0;
        addEdge(u, v, w);
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
