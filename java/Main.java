import java.util.*;

/**
 * Main class for the Kuwait Route Planner application.
 * Builds the Kuwait road network graph with 105 areas and 181 roads,
 * provides an interactive console menu for running Dijkstra and A* algorithms,
 * and measures execution time using System.nanoTime().
 */
public class Main {

    /**
     * Warms up the JVM by running both algorithms 1000 times.
     * This allows the JIT (Just-In-Time) compiler to optimize the code
     * so that actual timing measurements are accurate and consistent.
     * Output is suppressed during warm-up to avoid flooding the console.
     *
     * @param graph the Kuwait graph to run warm-up on
     */
    static void warmUp(Graph graph) {
        System.out.println("Warming up JVM...");

        // Redirect output to nothing during warm-up
        java.io.PrintStream original = System.out;
        System.setOut(new java.io.PrintStream(new java.io.OutputStream() {
            public void write(int b) {}
        }));

        // Run 1000 times silently
        for (int i = 0; i < 1000; i++) {
            Dijkstra.findPath(graph, "Sharq", "Fahaheel");
            AStar.findPath(graph, "Sharq", "Fahaheel");
        }

        // Restore output back to normal
        System.setOut(original);
        System.out.println("Warm-up done.\n");
    }

    /**
     * Builds the Kuwait road network as a weighted undirected graph.
     * Contains 105 nodes (areas) across 6 governorates:
     * - Capital (Al Asimah): 29 areas
     * - Hawalli: 18 areas
     * - Farwaniya: 17 areas
     * - Ahmadi: 18 areas
     * - Jahra: 14 areas
     * - Mubarak Al-Kabeer: 9 areas
     *
     * Contains 181 edges (roads) with approximate distances in km
     * verified against Google Maps.
     *
     * @return the complete Kuwait Graph
     */
    static Graph createKuwaitGraph() {
        Graph g = new Graph();

        // ── City (العاصمة) ─────────────────────────────
        g.addNode("Sharq", 330, 410);
        g.addNode("Mirqab", 330, 419);
        g.addNode("Qibla", 323, 417);
        g.addNode("Salhiya", 322, 421);
        g.addNode("Sawaber", 330, 413);
        g.addNode("Dasman", 338, 406);
        g.addNode("Bneid Al-Gar", 319, 425);
        g.addNode("Dasma", 339, 419);
        g.addNode("Rawdah", 338, 442);
        g.addNode("Nuzha", 331, 433);
        g.addNode("Shamiyah", 323, 428);
        g.addNode("Yarmouk", 323, 452);
        g.addNode("Shuwaikh", 295, 431);
        g.addNode("Kaifan", 319, 436);
        g.addNode("Sulaibikhat", 256, 450);
        g.addNode("NW Sulaibikhat", 241, 443);
        g.addNode("Ghornata", 315, 443);
        g.addNode("Abdullah Al-Salem", 330, 428);
        g.addNode("Doha", 299, 432);
        g.addNode("Nahdha", 312, 449);
        g.addNode("Daiya", 312, 437);
        g.addNode("Watiya", 319, 421);
        g.addNode("Khalidiya", 317, 442);
        g.addNode("Faiha", 328, 435);
        g.addNode("Adailiya", 330, 442);
        g.addNode("Mansouriya", 336, 424);
        g.addNode("Qortuba", 331, 452);
        g.addNode("Qairawan", 309, 458);
        g.addNode("South Qairawan", 311, 456);

        // ── Hawalli (حولي) ────────────────────────────────
        g.addNode("Salmiya", 382, 435);
        g.addNode("Hawally", 351, 436);
        g.addNode("Rumaithiya", 376, 450);
        g.addNode("Bayan", 365, 461);
        g.addNode("Mishref", 373, 473);
        g.addNode("Jabriya", 352, 448);
        g.addNode("Salwa", 378, 462);
        g.addNode("Surra", 342, 452);
        g.addNode("Qadisiya", 337, 447);
        g.addNode("Shuhada", 356, 478);
        g.addNode("Hitteen", 348, 469);
        g.addNode("Zahra", 340, 477);
        g.addNode("Shab", 367, 437);
        g.addNode("Bida", 385, 448);
        g.addNode("Siddiq", 336, 454);
        g.addNode("Naqra", 345, 450);
        g.addNode("South Surra", 343, 451);
        g.addNode("Salam", 345, 460);

        // ── Farwaniya (الفروانية) ─────────────────────────
        g.addNode("Khaitan", 326, 470);
        g.addNode("Rai", 318, 471);
        g.addNode("Ferdous", 324, 473);
        g.addNode("Abdullah Al-Mubarak", 288, 495);
        g.addNode("South Abdullah Al-Mubarak", 289, 514);
        g.addNode("West Abdullah Al-Mubarak", 271, 493);
        g.addNode("Sabah Al-Nasser", 278, 478);
        g.addNode("Ishbiliyah", 310, 476);
        g.addNode("Ardiya", 290, 467);
        g.addNode("Andalus", 279, 457);
        g.addNode("Jleeb Al-Shuyoukh", 304, 484);
        g.addNode("Omariya", 316, 462);
        g.addNode("Riqqai", 316, 475);
        g.addNode("Rehab", 305, 469);
        g.addNode("Abraq Khaitan", 328, 475);
        g.addNode("Abbasiya", 305, 486);
        g.addNode("Dhajij", 320, 483);

        // ── Ahmadi (الأحمدي) ──────────────────────────────
        g.addNode("Egaila", 390, 540);
        g.addNode("Ali Sabah Al-Salem", 384, 547);
        g.addNode("Fintas", 400, 539);
        g.addNode("Riqqa", 393, 551);
        g.addNode("Sabahiya", 393, 577);
        g.addNode("Abu Halifa", 403, 565);
        g.addNode("Mangaf", 402, 578);
        g.addNode("Mahboula", 400, 552);
        g.addNode("Fahaheel", 407, 593);
        g.addNode("Hadiya", 386, 554);
        g.addNode("Sabah Al-Ahmad", 382, 630);
        g.addNode("East Sabah Al-Ahmad", 398, 627);
        g.addNode("South Sabah Al-Ahmad", 381, 651);
        g.addNode("Zour", 508, 821);
        g.addNode("Khairan", 538, 851);
        g.addNode("Nuwaiseeb", 546, 911);
        g.addNode("Wafra", 303, 874);
        g.addNode("Miqaa", 253, 822);

        // ── Jahra (الجهراء) ───────────────────────────────
        g.addNode("Naeem", 181, 439);
        g.addNode("Oyoun", 163, 441);
        g.addNode("Sulaibiya", 249, 470);
        g.addNode("Taima", 175, 442);
        g.addNode("Wahah", 163, 432);
        g.addNode("Qasr", 182, 434);
        g.addNode("Amghara", 210, 455);
        g.addNode("Abdali", 200, 39);
        g.addNode("Naseem", 173, 447);
        g.addNode("Mutlaa", 128, 360);
        g.addNode("Salimi", 97, 444);
        g.addNode("Saad Al-Abdullah", 194, 451);
        g.addNode("Rahiya", 172, 437);
        g.addNode("Kabd", 196, 583);

        // ── Mubarak Al-Kabeer (مبارك الكبير) ─────────────
        g.addNode("Abu Al-Hasaniya", 397, 527);
        g.addNode("Sabah Al-Salem", 371, 486);
        g.addNode("Fnaitees", 388, 508);
        g.addNode("Qurain", 379, 520);
        g.addNode("Qusour", 360, 508);
        g.addNode("Subhan", 346, 505);
        g.addNode("Mseela", 380, 528);
        g.addNode("Abu Fatira", 392, 523);
        g.addNode("Adan", 373, 500);

        // ── City internal edges ────────────────────────
        g.addEdge("Dasman", "Sharq", 1.8);
        g.addEdge("Sharq", "Salhiya", 2.4);
        g.addEdge("Sharq", "Mirqab", 1.6);
        g.addEdge("Salhiya", "Mirqab", 1.6);
        g.addEdge("Salhiya", "Sawaber", 2);
        g.addEdge("Mirqab", "Sawaber", 1.1);
        g.addEdge("Mirqab", "Qibla", 1.5);
        g.addEdge("Sawaber", "Qibla", 1.5);
        g.addEdge("Dasman", "Bneid Al-Gar", 5.1);
        g.addEdge("Qibla", "Bneid Al-Gar", 1.7);
        g.addEdge("Qibla", "Shamiyah", 2.1);
        g.addEdge("Bneid Al-Gar", "Khalidiya", 3);
        g.addEdge("Bneid Al-Gar", "Dasma", 3.9);
        g.addEdge("Khalidiya", "Shamiyah", 2.7);
        g.addEdge("Khalidiya", "Faiha", 2.4);
        g.addEdge("Khalidiya", "Kaifan", 1.2);
        g.addEdge("Shamiyah", "Daiya", 1.6);
        g.addEdge("Shamiyah", "Yarmouk", 4.2);
        g.addEdge("Daiya", "Watiya", 1.8);
        g.addEdge("Daiya", "Yarmouk", 4.3);
        g.addEdge("Watiya", "Shuwaikh", 4.8);
        g.addEdge("Watiya", "Doha", 3.7);
        g.addEdge("Shuwaikh", "Yarmouk", 6.4);
        g.addEdge("Shuwaikh", "Doha", 1.5);
        g.addEdge("Shuwaikh", "Sulaibikhat", 8.1);
        g.addEdge("Sulaibikhat", "NW Sulaibikhat", 3.2);
        g.addEdge("Dasma", "Rawdah", 4.2);
        g.addEdge("Dasma", "Adailiya", 4.6);
        g.addEdge("Rawdah", "Faiha", 2.3);
        g.addEdge("Rawdah", "Adailiya", 1.4);
        g.addEdge("Rawdah", "Nuzha", 2.2);
        g.addEdge("Faiha", "Adailiya", 1.4);
        g.addEdge("Faiha", "Abdullah Al-Salem", 1.4);
        g.addEdge("Adailiya", "Mansouriya", 3.4);
        g.addEdge("Kaifan", "Abdullah Al-Salem", 2.6);
        g.addEdge("Kaifan", "Ghornata", 1.6);
        g.addEdge("Abdullah Al-Salem", "Ghornata", 4.1);
        g.addEdge("Mansouriya", "Nuzha", 1.8);
        g.addEdge("Nuzha", "Rawdah", 2.2);
        g.addEdge("Yarmouk", "Qortuba", 1.7);
        g.addEdge("Doha", "Nahdha", 4.1);
        g.addEdge("Nahdha", "Qortuba", 3.8);
        g.addEdge("Qortuba", "Ghornata", 3.6);
        g.addEdge("Ghornata", "Qairawan", 1.5);
        g.addEdge("Qairawan", "South Qairawan", 1);

        // ── Capital ↔ other governorates ─────────────────
        g.addEdge("NW Sulaibikhat", "Abdullah Al-Mubarak", 12.9);
        g.addEdge("Shuwaikh", "Abdullah Al-Mubarak", 11.7);
        g.addEdge("South Qairawan", "Sabah Al-Nasser", 7.3);
        g.addEdge("Yarmouk", "Sabah Al-Nasser", 9.5);
        g.addEdge("Ghornata", "Ishbiliyah", 6);
        g.addEdge("Mansouriya", "Hawally", 3.5);
        g.addEdge("Nuzha", "Hawally", 3.9);
        g.addEdge("Abdullah Al-Salem", "Surra", 4.8);
        g.addEdge("Faiha", "Surra", 4);
        g.addEdge("Faiha", "Qadisiya", 2.8);
        g.addEdge("Adailiya", "Surra", 2.7);
        g.addEdge("Naeem", "Sulaibikhat", 14.4);
        g.addEdge("Naseem", "Doha", 24.3);

        // ── Hawalli internal ──────────────────────────────
        g.addEdge("Surra", "Qadisiya", 1.3);
        g.addEdge("Surra", "Shuhada", 5.4);
        g.addEdge("Surra", "South Surra", 0.3);
        g.addEdge("Qadisiya", "Shuhada", 6.6);
        g.addEdge("Qadisiya", "Hawally", 3.2);
        g.addEdge("Shuhada", "Hitteen", 2.1);
        g.addEdge("Hawally", "Siddiq", 2.6);
        g.addEdge("Hawally", "Naqra", 2.6);
        g.addEdge("Hawally", "Jabriya", 2);
        g.addEdge("Hitteen", "Zahra", 2.1);
        g.addEdge("Zahra", "Siddiq", 5.9);
        g.addEdge("Siddiq", "Naqra", 1.5);
        g.addEdge("South Surra", "Salam", 1.7);
        g.addEdge("Naqra", "Salam", 1.9);
        g.addEdge("Salam", "Jabriya", 2.6);
        g.addEdge("Jabriya", "Mishref", 6.1);
        g.addEdge("Salmiya", "Shab", 2.8);
        g.addEdge("Salmiya", "Bida", 2.4);
        g.addEdge("Salmiya", "Rumaithiya", 3);
        g.addEdge("Shab", "Bida", 3.9);
        g.addEdge("Bida", "Rumaithiya", 1.8);
        g.addEdge("Rumaithiya", "Bayan", 2.9);
        g.addEdge("Bayan", "Salwa", 2.5);
        g.addEdge("Salwa", "Mishref", 2.2);
        g.addEdge("Mishref", "Bayan", 2.7);

        // ── Hawalli ↔ other governorates ─────────────────
        g.addEdge("Rumaithiya", "Fnaitees", 10.8);
        g.addEdge("Bayan", "Abu Al-Hasaniya", 13.4);
        g.addEdge("Salwa", "Sabah Al-Salem", 4.6);
        g.addEdge("Mishref", "Sabah Al-Salem", 2.4);
        g.addEdge("Salmiya", "Egaila", 19.2);
        g.addEdge("Salam", "Khaitan", 4.1);
        g.addEdge("South Surra", "Khaitan", 4.6);
        g.addEdge("Zahra", "Khaitan", 2.9);
        g.addEdge("Ferdous", "Salam", 3.8);

        // ── Farwaniya internal ────────────────────────────
        g.addEdge("Sabah Al-Nasser", "Ishbiliyah", 5.9);
        g.addEdge("Sabah Al-Nasser", "Ardiya", 3);
        g.addEdge("Ishbiliyah", "Ardiya", 4);
        g.addEdge("Ishbiliyah", "Jleeb Al-Shuyoukh", 1.8);
        g.addEdge("Ardiya", "Jleeb Al-Shuyoukh", 4.2);
        g.addEdge("Ardiya", "Abbasiya", 4.6);
        g.addEdge("Jleeb Al-Shuyoukh", "Andalus", 6.8);
        g.addEdge("Jleeb Al-Shuyoukh", "Khaitan", 4.9);
        g.addEdge("Andalus", "Khaitan", 9.1);
        g.addEdge("Andalus", "Omariya", 6.9);
        g.addEdge("Khaitan", "Omariya", 2.3);
        g.addEdge("Khaitan", "Rai", 1.4);
        g.addEdge("Omariya", "Riqqai", 2.2);
        g.addEdge("Rai", "Ferdous", 1.7);
        g.addEdge("Rai", "Riqqai", 0.7);
        g.addEdge("Riqqai", "Dhajij", 1.6);
        g.addEdge("Riqqai", "Abraq Khaitan", 2.3);
        g.addEdge("Abraq Khaitan", "Rehab", 4.6);
        g.addEdge("Dhajij", "Rehab", 3.8);
        g.addEdge("Abdullah Al-Mubarak", "West Abdullah Al-Mubarak", 3.1);
        g.addEdge("Abdullah Al-Mubarak", "South Abdullah Al-Mubarak", 3.6);
        g.addEdge("West Abdullah Al-Mubarak", "South Abdullah Al-Mubarak", 5);
        g.addEdge("South Abdullah Al-Mubarak", "Sabah Al-Nasser", 6.9);

        // ── Farwaniya ↔ other governorates ───────────────
        g.addEdge("Abbasiya", "Sulaibiya", 11.1);
        g.addEdge("Rehab", "Subhan", 10.2);
        g.addEdge("Abraq Khaitan", "Subhan", 6.3);

        // ── Ahmadi internal ───────────────────────────────
        g.addEdge("Egaila", "Ali Sabah Al-Salem", 1.6);
        g.addEdge("Ali Sabah Al-Salem", "Riqqa", 1.8);
        g.addEdge("Ali Sabah Al-Salem", "Fintas", 3.3);
        g.addEdge("Fintas", "Riqqa", 2.6);
        g.addEdge("Riqqa", "Sabahiya", 4.7);
        g.addEdge("Sabahiya", "Abu Halifa", 3);
        g.addEdge("Abu Halifa", "Mangaf", 2.3);
        g.addEdge("Abu Halifa", "Mahboula", 2.4);
        g.addEdge("Mangaf", "Mahboula", 4.6);
        g.addEdge("Mangaf", "Fahaheel", 2.8);
        g.addEdge("Mahboula", "Fahaheel", 7.4);
        g.addEdge("Fahaheel", "Hadiya", 8);
        g.addEdge("Hadiya", "Sabah Al-Ahmad", 13.7);
        g.addEdge("Sabah Al-Ahmad", "East Sabah Al-Ahmad", 3);
        g.addEdge("Sabah Al-Ahmad", "South Sabah Al-Ahmad", 3.8);
        g.addEdge("East Sabah Al-Ahmad", "South Sabah Al-Ahmad", 5.3);
        g.addEdge("East Sabah Al-Ahmad", "Zour", 40.7);
        g.addEdge("East Sabah Al-Ahmad", "Khairan", 48.4);
        g.addEdge("Khairan", "Nuwaiseeb", 11);
        g.addEdge("Nuwaiseeb", "Zour", 17.9);
        g.addEdge("South Sabah Al-Ahmad", "Wafra", 43);
        g.addEdge("Wafra", "Miqaa", 13.5);

        // ── Ahmadi ↔ other governorates ──────────────────
        g.addEdge("Egaila", "Sabah Al-Salem", 10.4);
        g.addEdge("Egaila", "Adan", 7.9);
        g.addEdge("Fintas", "Adan", 8.6);
        g.addEdge("Fintas", "Mseela", 4.3);
        g.addEdge("Sabahiya", "Mseela", 9.3);

        // ── Jahra internal ────────────────────────────────
        g.addEdge("Naeem", "Oyoun", 3.5);
        g.addEdge("Naeem", "Naseem", 2);
        g.addEdge("Naeem", "Qasr", 1);
        g.addEdge("Oyoun", "Wahah", 1.6);
        g.addEdge("Oyoun", "Qasr", 3.9);
        g.addEdge("Wahah", "Taima", 2.9);
        g.addEdge("Taima", "Naseem", 0.9);
        g.addEdge("Qasr", "Rahiya", 2.1);
        g.addEdge("Naseem", "Saad Al-Abdullah", 4);
        g.addEdge("Naseem", "Mutlaa", 17.9);
        g.addEdge("Saad Al-Abdullah", "Mutlaa", 20.7);
        g.addEdge("Mutlaa", "Abdali", 59.5);
        g.addEdge("Rahiya", "Amghara", 8);
        g.addEdge("Amghara", "Kabd", 23.3);
        g.addEdge("Kabd", "Sulaibiya", 22.9);
        g.addEdge("Sulaibiya", "Rahiya", 15.7);
        g.addEdge("Salimi", "Rahiya", 14.1);
        g.addEdge("Salimi", "Taima", 14.7);

        // ── Jahra ↔ other governorates ────────────────────
        g.addEdge("Sulaibiya", "Abbasiya", 11.1);
        g.addEdge("Amghara", "Sulaibiya", 7.7);

        // ── Mubarak Al-Kabeer internal ────────────────────
        g.addEdge("Sabah Al-Salem", "Abu Al-Hasaniya", 8.8);
        g.addEdge("Sabah Al-Salem", "Qurain", 6.3);
        g.addEdge("Sabah Al-Salem", "Fnaitees", 5.1);
        g.addEdge("Sabah Al-Salem", "Qusour", 3);
        g.addEdge("Abu Al-Hasaniya", "Fnaitees", 3.8);
        g.addEdge("Qurain", "Qusour", 4.6);
        g.addEdge("Qurain", "Abu Fatira", 2.4);
        g.addEdge("Qusour", "Subhan", 3.3);
        g.addEdge("Fnaitees", "Mseela", 3.8);
        g.addEdge("Mseela", "Abu Fatira", 2.4);
        g.addEdge("Mseela", "Adan", 5.1);
        g.addEdge("Adan", "Abu Fatira", 5.3);
        g.addEdge("Subhan", "Adan", 5.3);

        // ── Mubarak Al-Kabeer ↔ other governorates ────────
        g.addEdge("Abu Al-Hasaniya", "Bayan", 13.4);
        g.addEdge("Fnaitees", "Rumaithiya", 10.8);
        g.addEdge("Subhan", "Rehab", 10.2);

        return g;
    }

    /**
     * Main method - entry point of the program.
     * Builds the Kuwait graph, runs warm-up, displays available areas,
     * and provides an interactive menu for running algorithms with timing.
     *
     * @param args command line arguments (not used)
     */
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        Graph graph = createKuwaitGraph();
        warmUp(graph);

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

            // Validate that both area names exist in the graph
            if (!graph.adj.containsKey(s) || !graph.adj.containsKey(e)) {
                System.out.println("Invalid area name! Please type it exactly as shown above.");
                continue;
            }

            if (ch.equals("1")) {
                long startTime = System.nanoTime();
                PathResult d = Dijkstra.findPath(graph, s, e);
                long endTime = System.nanoTime();
                d.print();
                System.out.printf("Execution time: %.3f ms%n", (endTime - startTime) / 1_000_000.0);
            } else if (ch.equals("2")) {
                long startTime = System.nanoTime();
                PathResult a = AStar.findPath(graph, s, e);
                long endTime = System.nanoTime();
                a.print();
                System.out.printf("Execution time: %.3f ms%n", (endTime - startTime) / 1_000_000.0);
            } else if (ch.equals("3")) {
                long startDijkstra = System.nanoTime();
                PathResult d = Dijkstra.findPath(graph, s, e);
                long endDijkstra = System.nanoTime();

                long startAStar = System.nanoTime();
                PathResult a = AStar.findPath(graph, s, e);
                long endAStar = System.nanoTime();

                double dijkstraInMs = (endDijkstra - startDijkstra) / 1_000_000.0;
                double aStarInMs = (endAStar - startAStar) / 1_000_000.0;

                d.print();
                System.out.printf("Dijkstra time: %.3f ms%n", dijkstraInMs);
                a.print();
                System.out.printf("A* time: %.3f ms%n", aStarInMs);

                System.out.println("\n--- Comparison ---");
                System.out.println("Same path: " + (d.path.equals(a.path) ? "Yes" : "No"));
                System.out.println("Dijkstra visited: " + d.nodesVisited + " nodes");
                System.out.println("A* visited:       " + a.nodesVisited + " nodes");
                System.out.printf("Dijkstra time: %.3f ms%n", dijkstraInMs);
                System.out.printf("A* time: %.3f ms%n", aStarInMs);
            } else {
                System.out.println("Invalid choice.");
            }
        }
    }
}
