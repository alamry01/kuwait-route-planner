import java.util.*;

public class Main {

    static Graph createKuwaitGraph() {
        Graph g = new Graph();

        g.addNode("Kuwait City", 390, 230);
        g.addNode("Salmiya", 440, 300);
        g.addNode("Hawally", 420, 280);
        g.addNode("Farwaniya", 330, 290);
        g.addNode("Jahra", 220, 200);
        g.addNode("Ahmadi", 400, 430);
        g.addNode("Fahaheel", 420, 480);
        g.addNode("Mangaf", 390, 460);
        g.addNode("Sabah Al Salem", 430, 370);
        g.addNode("Mishref", 410, 340);
        g.addNode("Rumaithiya", 450, 320);
        g.addNode("Jabriya", 400, 310);
        g.addNode("Shuwaikh", 350, 220);
        g.addNode("Fintas", 400, 400);
        g.addNode("Abu Halifa", 410, 450);
        g.addNode("Mahboula", 380, 470);
        g.addNode("Jleeb", 310, 270);
        g.addNode("Khaitan", 340, 310);
        g.addNode("Salwa", 430, 350);
        g.addNode("Abdulla Al Mubarak", 270, 250);
        g.addNode("Sulaibikhat", 310, 200);
        g.addNode("Wafra", 340, 560);
        g.addNode("Sabah Al Ahmad", 450, 520);
        g.addNode("Mubarak Al Kabeer", 440, 360);

        g.addEdge("Kuwait City", "Shuwaikh", 5);
        g.addEdge("Kuwait City", "Hawally", 6);
        g.addEdge("Kuwait City", "Salmiya", 10);
        g.addEdge("Kuwait City", "Jahra", 30);
        g.addEdge("Kuwait City", "Farwaniya", 12);
        g.addEdge("Shuwaikh", "Jleeb", 7);
        g.addEdge("Shuwaikh", "Sulaibikhat", 6);
        g.addEdge("Sulaibikhat", "Jahra", 15);
        g.addEdge("Sulaibikhat", "Abdulla Al Mubarak", 8);
        g.addEdge("Jahra", "Abdulla Al Mubarak", 12);
        g.addEdge("Abdulla Al Mubarak", "Jleeb", 8);
        g.addEdge("Jleeb", "Farwaniya", 5);
        g.addEdge("Jleeb", "Khaitan", 6);
        g.addEdge("Farwaniya", "Khaitan", 4);
        g.addEdge("Farwaniya", "Jahra", 18);
        g.addEdge("Khaitan", "Hawally", 7);
        g.addEdge("Khaitan", "Jabriya", 6);
        g.addEdge("Hawally", "Salmiya", 4);
        g.addEdge("Hawally", "Jabriya", 3);
        g.addEdge("Salmiya", "Rumaithiya", 3);
        g.addEdge("Salmiya", "Salwa", 8);
        g.addEdge("Rumaithiya", "Mishref", 4);
        g.addEdge("Rumaithiya", "Mubarak Al Kabeer", 6);
        g.addEdge("Jabriya", "Mishref", 4);
        g.addEdge("Jabriya", "Salwa", 5);
        g.addEdge("Mishref", "Salwa", 3);
        g.addEdge("Salwa", "Sabah Al Salem", 4);
        g.addEdge("Salwa", "Mubarak Al Kabeer", 3);
        g.addEdge("Mubarak Al Kabeer", "Sabah Al Salem", 4);
        g.addEdge("Sabah Al Salem", "Fintas", 6);
        g.addEdge("Fintas", "Ahmadi", 5);
        g.addEdge("Fintas", "Abu Halifa", 5);
        g.addEdge("Ahmadi", "Abu Halifa", 4);
        g.addEdge("Ahmadi", "Mangaf", 5);
        g.addEdge("Abu Halifa", "Mangaf", 3);
        g.addEdge("Mangaf", "Mahboula", 3);
        g.addEdge("Mangaf", "Fahaheel", 4);
        g.addEdge("Mahboula", "Fahaheel", 5);
        g.addEdge("Mahboula", "Wafra", 20);
        g.addEdge("Fahaheel", "Sabah Al Ahmad", 15);
        g.addEdge("Sabah Al Ahmad", "Wafra", 25);

        return g;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        Graph graph = createKuwaitGraph();

        System.out.println("=============================================");
        System.out.println("        Kuwait Route Planner");
        System.out.println("        Dijkstra & A* Algorithms");
        System.out.println("=============================================");
        System.out.println("\nAvailable areas:");
        for (String node : graph.nodes()) {
            System.out.println("  - " + node);
        }

        while (true) {
            System.out.println("\n---------------------------------------------");
            System.out.println("1. Dijkstra");
            System.out.println("2. A*");
            System.out.println("3. Compare both");
            System.out.println("0. Exit");
            System.out.println("---------------------------------------------");
            System.out.print("Choice: ");
            String ch = sc.nextLine().trim();

            if (ch.equals("0")) {
                System.out.println("Goodbye!");
                break;
            }

            System.out.print("Start area: ");
            String s = sc.nextLine().trim();
            System.out.print("End area: ");
            String e = sc.nextLine().trim();

            if (!graph.adj.containsKey(s) || !graph.adj.containsKey(e)) {
                System.out.println("Invalid area name! Please type it exactly as shown above.");
                continue;
            }

            if (ch.equals("1")) {
                Dijkstra.findPath(graph, s, e).print();
            } else if (ch.equals("2")) {
                AStar.findPath(graph, s, e).print();
            } else if (ch.equals("3")) {
                PathResult d = Dijkstra.findPath(graph, s, e);
                PathResult a = AStar.findPath(graph, s, e);
                d.print();
                a.print();
                System.out.println("\n--- Comparison ---");
                System.out.println("Same path: " + (d.path.equals(a.path) ? "Yes" : "No"));
                System.out.println("Dijkstra visited: " + d.nodesVisited + " nodes");
                System.out.println("A* visited:       " + a.nodesVisited + " nodes");
            } else {
                System.out.println("Invalid choice.");
            }
        }
    }
}
