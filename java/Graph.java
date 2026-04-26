import java.util.*;

/**
 * Represents an undirected weighted graph using an adjacency list.
 * Stores Kuwait's road network where nodes are areas and edges are roads with distances.
 * Also stores x,y positions for each node, used by the A* heuristic function.
 */
public class Graph {
    /** Adjacency list: maps each area name to its list of edges (neighbors) */
    Map<String, List<Edge>> adj = new LinkedHashMap<>();
    /** Position map: maps each area name to its [x, y] coordinates */
    Map<String, double[]> pos = new HashMap<>();

    /**
     * Adds a node to the graph with its position.
     * If the node already exists, it does nothing (putIfAbsent).
     *
     * @param id the area name
     * @param x  the x coordinate (used for A* heuristic)
     * @param y  the y coordinate (used for A* heuristic)
     */
    void addNode(String id, double x, double y) {
        adj.putIfAbsent(id, new ArrayList<>());
        pos.put(id, new double[]{x, y});
    }

    /**
     * Adds a bidirectional edge between two nodes.
     * Creates the edge in both directions since roads are bidirectional.
     * Checks for duplicates using stream().anyMatch() before adding.
     * Uses putIfAbsent to prevent NullPointerException if nodes weren't added first.
     *
     * @param NodeA  the first area name
     * @param NodeB  the second area name
     * @param weight the distance in km between the two areas
     */
    void addEdge(String NodeA, String NodeB, double weight) {
        adj.putIfAbsent(NodeA, new ArrayList<>());
        adj.putIfAbsent(NodeB, new ArrayList<>());
        boolean exists = adj.get(NodeA).stream().anyMatch(e -> e.dest.equals(NodeB));
        if (!exists) {
            adj.get(NodeA).add(new Edge(NodeB, weight));
            adj.get(NodeB).add(new Edge(NodeA, weight));
        }
    }

    /**
     * Returns the list of edges (neighbors) for a given node.
     * Returns an empty list if the node doesn't exist, preventing NullPointerException.
     *
     * @param node the area name
     * @return list of edges from this node
     */
    List<Edge> neighbors(String node) {
        return adj.getOrDefault(node, Collections.emptyList());
    }

    /**
     * Returns a set of all node names in the graph.
     * Used by both algorithms to initialize distance maps.
     *
     * @return set of all area names
     */
    Set<String> nodes() {
        return adj.keySet();
    }

    /**
     * Returns the [x, y] position of a node.
     * Used by A* to calculate heuristic distance.
     * Returns [0, 0] if the node doesn't exist.
     *
     * @param n the area name
     * @return double array [x, y]
     */
    double[] getPos(String n) {
        return pos.getOrDefault(n, new double[]{0, 0});
    }
}
