import java.util.*;

/**
 * Stores the result of a pathfinding algorithm (Dijkstra or A*).
 * Contains the shortest path, total distance, number of nodes visited,
 * and the algorithm name for display purposes.
 */
public class PathResult {
    /** The shortest path as a list of area names in order from start to end */
    List<String> path;
    /** The total distance of the shortest path in km */
    double totalDist;
    /** The number of nodes the algorithm visited during the search */
    int nodesVisited;
    /** The name of the algorithm ("Dijkstra" or "A*") */
    String algoName;

    /**
     * Creates a new PathResult with default values.
     * Distance is set to infinity (no path found yet).
     *
     * @param name the algorithm name for display
     */
    PathResult(String name) {
        this.algoName = name;
        path = new ArrayList<>();
        totalDist = Double.MAX_VALUE;
        nodesVisited = 0;
    }

    /**
     * Checks if a valid path was found.
     * Returns true if the path is not empty and distance is less than infinity.
     *
     * @return true if a path exists, false otherwise
     */
    boolean found() {
        return !path.isEmpty() && totalDist < Double.MAX_VALUE;
    }

    /**
     * Prints the result in a formatted output.
     * Shows the path with arrows, total distance in km, and nodes visited.
     * If no path exists, prints "No path found".
     */
    void print() {
        System.out.println("\n--- " + algoName + " ---");
        if (found()) {
            System.out.println("Path: " + String.join(" -> ", path));
            System.out.println("Distance: " + (int) totalDist + " km");
            System.out.println("Nodes visited: " + nodesVisited);
        } else {
            System.out.println("No path found");
        }
    }
}
