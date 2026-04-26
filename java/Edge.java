/**
 * Represents a weighted edge in the graph.
 * Each edge stores the destination node name and the distance (weight) in km.
 * Used inside the adjacency list to represent a road connection between two areas.
 */
public class Edge {
    /** The destination node name */
    String dest;
    /** The distance in km between the two connected areas */
    double weight;

    /**
     * Creates a new edge with a destination and weight.
     * Negative weights are rejected to ensure Dijkstra's algorithm works correctly.
     *
     * @param dest   the name of the destination area
     * @param weight the distance in km (must be >= 0)
     */
    Edge(String dest, double weight) {
        this.dest = dest;
        if(weight >= 0)
            this.weight = weight;
    }
}
