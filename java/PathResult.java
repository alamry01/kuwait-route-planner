import java.util.*;

public class PathResult {
    List<String> path = new ArrayList<>();
    double totalDist = Double.MAX_VALUE;
    int nodesVisited;
    String algoName;

    PathResult(String name) {
        this.algoName = name;
    }

    boolean found() {
        return !path.isEmpty() && totalDist < Double.MAX_VALUE;
    }

    void print() {
        System.out.println("\n--- " + algoName + " ---");
        if (found()) {
            System.out.println("Path: " + String.join(" -> ", path));
            System.out.println("Distance: " + (int) totalDist + " km");
            System.out.println("Nodes visited: " + nodesVisited);
        } else {
            System.out.println("No path found!");
        }
    }
}
