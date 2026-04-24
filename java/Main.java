import java.util.*;

public class Main {

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
        g.addNode("Doha", 300, 424);
        g.addNode("Nahdha", 314, 442);
        g.addNode("Daiya", 314, 429);
        g.addNode("Watiya", 319, 421);
        g.addNode("Khalidiya", 317, 442);
        g.addNode("Faiha", 328, 435);
        g.addNode("Adailiya", 330, 442);
        g.addNode("Mansouriya", 336, 424);
        g.addNode("Qortuba", 331, 452);
        g.addNode("Qairawan", 311, 451);
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
        g.addNode("Siddiq", 339, 444);
        g.addNode("Naqra", 345, 450);
        g.addNode("South Surra", 343, 451);
        g.addNode("Salam", 345, 460);

        // ── Farwaniya (الفروانية) ─────────────────────────
        g.addNode("Khaitan", 326, 470);
        g.addNode("Rai", 318, 471);
        g.addNode("Ferdous", 326, 466);
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
        g.addNode("Qusour", 363, 501);
        g.addNode("Subhan", 346, 505);
        g.addNode("Mseela", 380, 528);
        g.addNode("Abu Fatira", 392, 523);
        g.addNode("Adan", 373, 500);

        // ── Capital internal edges ────────────────────────
        g.addEdge("Dasman", "Sharq");
        g.addEdge("Sharq", "Salhiya");
        g.addEdge("Sharq", "Mirqab");
        g.addEdge("Salhiya", "Mirqab");
        g.addEdge("Salhiya", "Sawaber");
        g.addEdge("Mirqab", "Sawaber");
        g.addEdge("Mirqab", "Qibla");
        g.addEdge("Sawaber", "Qibla");
        g.addEdge("Dasman", "Bneid Al-Gar");
        g.addEdge("Qibla", "Bneid Al-Gar");
        g.addEdge("Qibla", "Shamiyah");
        g.addEdge("Bneid Al-Gar", "Khalidiya");
        g.addEdge("Bneid Al-Gar", "Dasma");
        g.addEdge("Khalidiya", "Shamiyah");
        g.addEdge("Khalidiya", "Faiha");
        g.addEdge("Khalidiya", "Kaifan");
        g.addEdge("Shamiyah", "Daiya");
        g.addEdge("Shamiyah", "Yarmouk");
        g.addEdge("Daiya", "Watiya");
        g.addEdge("Daiya", "Yarmouk");
        g.addEdge("Watiya", "Shuwaikh");
        g.addEdge("Watiya", "Doha");
        g.addEdge("Shuwaikh", "Yarmouk");
        g.addEdge("Shuwaikh", "Doha");
        g.addEdge("Shuwaikh", "Sulaibikhat");
        g.addEdge("Sulaibikhat", "NW Sulaibikhat");
        g.addEdge("Dasma", "Rawdah");
        g.addEdge("Dasma", "Adailiya");
        g.addEdge("Rawdah", "Faiha");
        g.addEdge("Rawdah", "Adailiya");
        g.addEdge("Rawdah", "Nuzha");
        g.addEdge("Faiha", "Adailiya");
        g.addEdge("Faiha", "Abdullah Al-Salem");
        g.addEdge("Adailiya", "Mansouriya");
        g.addEdge("Kaifan", "Abdullah Al-Salem");
        g.addEdge("Kaifan", "Ghornata");
        g.addEdge("Abdullah Al-Salem", "Ghornata");
        g.addEdge("Mansouriya", "Nuzha");
        g.addEdge("Nuzha", "Rawdah");
        g.addEdge("Yarmouk", "Qortuba");
        g.addEdge("Doha", "Nahdha");
        g.addEdge("Nahdha", "Qortuba");
        g.addEdge("Qortuba", "Ghornata");
        g.addEdge("Ghornata", "Qairawan");
        g.addEdge("Qairawan", "South Qairawan");

        // ── Capital ↔ other governorates ─────────────────
        g.addEdge("NW Sulaibikhat", "Abdullah Al-Mubarak");
        g.addEdge("Shuwaikh", "Abdullah Al-Mubarak");
        g.addEdge("South Qairawan", "Sabah Al-Nasser");
        g.addEdge("Yarmouk", "Sabah Al-Nasser");
        g.addEdge("Ghornata", "Ishbiliyah");
        g.addEdge("Mansouriya", "Hawally");
        g.addEdge("Nuzha", "Hawally");
        g.addEdge("Abdullah Al-Salem", "Surra");
        g.addEdge("Faiha", "Surra");
        g.addEdge("Faiha", "Qadisiya");
        g.addEdge("Adailiya", "Surra");
        g.addEdge("Naeem", "Sulaibikhat");
        g.addEdge("Naseem", "Doha");

        // ── Hawalli internal ──────────────────────────────
        g.addEdge("Surra", "Qadisiya");
        g.addEdge("Surra", "Shuhada");
        g.addEdge("Surra", "South Surra");
        g.addEdge("Qadisiya", "Shuhada");
        g.addEdge("Qadisiya", "Hawally");
        g.addEdge("Shuhada", "Hitteen");
        g.addEdge("Hawally", "Siddiq");
        g.addEdge("Hawally", "Naqra");
        g.addEdge("Hawally", "Jabriya");
        g.addEdge("Hitteen", "Zahra");
        g.addEdge("Zahra", "Siddiq");
        g.addEdge("Siddiq", "Naqra");
        g.addEdge("South Surra", "Salam");
        g.addEdge("Naqra", "Salam");
        g.addEdge("Salam", "Jabriya");
        g.addEdge("Jabriya", "Mishref");
        g.addEdge("Salmiya", "Shab");
        g.addEdge("Salmiya", "Bida");
        g.addEdge("Salmiya", "Rumaithiya");
        g.addEdge("Shab", "Bida");
        g.addEdge("Bida", "Rumaithiya");
        g.addEdge("Rumaithiya", "Bayan");
        g.addEdge("Bayan", "Salwa");
        g.addEdge("Salwa", "Mishref");
        g.addEdge("Mishref", "Bayan");

        // ── Hawalli ↔ other governorates ─────────────────
        g.addEdge("Rumaithiya", "Fnaitees");
        g.addEdge("Bayan", "Abu Al-Hasaniya");
        g.addEdge("Salwa", "Sabah Al-Salem");
        g.addEdge("Mishref", "Sabah Al-Salem");
        g.addEdge("Salmiya", "Egaila");
        g.addEdge("Salam", "Khaitan");
        g.addEdge("South Surra", "Khaitan");
        g.addEdge("Zahra", "Khaitan");
        g.addEdge("Ferdous", "Salam");

        // ── Farwaniya internal ────────────────────────────
        g.addEdge("Sabah Al-Nasser", "Ishbiliyah");
        g.addEdge("Sabah Al-Nasser", "Ardiya");
        g.addEdge("Ishbiliyah", "Ardiya");
        g.addEdge("Ishbiliyah", "Jleeb Al-Shuyoukh");
        g.addEdge("Ardiya", "Jleeb Al-Shuyoukh");
        g.addEdge("Ardiya", "Abbasiya");
        g.addEdge("Jleeb Al-Shuyoukh", "Andalus");
        g.addEdge("Jleeb Al-Shuyoukh", "Khaitan");
        g.addEdge("Andalus", "Khaitan");
        g.addEdge("Andalus", "Omariya");
        g.addEdge("Khaitan", "Omariya");
        g.addEdge("Khaitan", "Rai");
        g.addEdge("Omariya", "Riqqai");
        g.addEdge("Rai", "Ferdous");
        g.addEdge("Rai", "Riqqai");
        g.addEdge("Riqqai", "Dhajij");
        g.addEdge("Riqqai", "Abraq Khaitan");
        g.addEdge("Abraq Khaitan", "Rehab");
        g.addEdge("Dhajij", "Rehab");
        g.addEdge("Abdullah Al-Mubarak", "West Abdullah Al-Mubarak");
        g.addEdge("Abdullah Al-Mubarak", "South Abdullah Al-Mubarak");
        g.addEdge("West Abdullah Al-Mubarak", "South Abdullah Al-Mubarak");
        g.addEdge("South Abdullah Al-Mubarak", "Sabah Al-Nasser");

        // ── Farwaniya ↔ other governorates ───────────────
        g.addEdge("Abbasiya", "Sulaibiya");
        g.addEdge("Rehab", "Subhan");
        g.addEdge("Abraq Khaitan", "Subhan");

        // ── Ahmadi internal ───────────────────────────────
        g.addEdge("Egaila", "Ali Sabah Al-Salem");
        g.addEdge("Ali Sabah Al-Salem", "Riqqa");
        g.addEdge("Ali Sabah Al-Salem", "Fintas");
        g.addEdge("Fintas", "Riqqa");
        g.addEdge("Riqqa", "Sabahiya");
        g.addEdge("Sabahiya", "Abu Halifa");
        g.addEdge("Abu Halifa", "Mangaf");
        g.addEdge("Abu Halifa", "Mahboula");
        g.addEdge("Mangaf", "Mahboula");
        g.addEdge("Mangaf", "Fahaheel");
        g.addEdge("Mahboula", "Fahaheel");
        g.addEdge("Fahaheel", "Hadiya");
        g.addEdge("Hadiya", "Sabah Al-Ahmad");
        g.addEdge("Sabah Al-Ahmad", "East Sabah Al-Ahmad");
        g.addEdge("Sabah Al-Ahmad", "South Sabah Al-Ahmad");
        g.addEdge("East Sabah Al-Ahmad", "South Sabah Al-Ahmad");
        g.addEdge("East Sabah Al-Ahmad", "Zour");
        g.addEdge("East Sabah Al-Ahmad", "Khairan");
        g.addEdge("Khairan", "Nuwaiseeb");
        g.addEdge("Nuwaiseeb", "Zour");
        g.addEdge("South Sabah Al-Ahmad", "Wafra");
        g.addEdge("Wafra", "Miqaa");

        // ── Ahmadi ↔ other governorates ──────────────────
        g.addEdge("Egaila", "Sabah Al-Salem");
        g.addEdge("Egaila", "Adan");
        g.addEdge("Fintas", "Adan");
        g.addEdge("Fintas", "Mseela");
        g.addEdge("Sabahiya", "Mseela");

        // ── Jahra internal ────────────────────────────────
        g.addEdge("Naeem", "Oyoun");
        g.addEdge("Naeem", "Naseem");
        g.addEdge("Naeem", "Qasr");
        g.addEdge("Oyoun", "Wahah");
        g.addEdge("Oyoun", "Qasr");
        g.addEdge("Wahah", "Taima");
        g.addEdge("Taima", "Naseem");
        g.addEdge("Qasr", "Rahiya");
        g.addEdge("Naseem", "Saad Al-Abdullah");
        g.addEdge("Naseem", "Mutlaa");
        g.addEdge("Saad Al-Abdullah", "Mutlaa");
        g.addEdge("Mutlaa", "Abdali");
        g.addEdge("Rahiya", "Amghara");
        g.addEdge("Amghara", "Kabd");
        g.addEdge("Kabd", "Sulaibiya");
        g.addEdge("Sulaibiya", "Rahiya");
        g.addEdge("Salimi", "Rahiya");
        g.addEdge("Salimi", "Taima");

        // ── Jahra ↔ other governorates ────────────────────
        g.addEdge("Sulaibiya", "Abbasiya");
        g.addEdge("Amghara", "Sulaibiya");

        // ── Mubarak Al-Kabeer internal ────────────────────
        g.addEdge("Sabah Al-Salem", "Abu Al-Hasaniya");
        g.addEdge("Sabah Al-Salem", "Qurain");
        g.addEdge("Sabah Al-Salem", "Fnaitees");
        g.addEdge("Sabah Al-Salem", "Qusour");
        g.addEdge("Abu Al-Hasaniya", "Fnaitees");
        g.addEdge("Qurain", "Qusour");
        g.addEdge("Qurain", "Abu Fatira");
        g.addEdge("Qusour", "Subhan");
        g.addEdge("Fnaitees", "Mseela");
        g.addEdge("Mseela", "Abu Fatira");
        g.addEdge("Mseela", "Adan");
        g.addEdge("Adan", "Abu Fatira");
        g.addEdge("Subhan", "Adan");

        // ── Mubarak Al-Kabeer ↔ other governorates ────────
        g.addEdge("Abu Al-Hasaniya", "Bayan");
        g.addEdge("Fnaitees", "Rumaithiya");
        g.addEdge("Subhan", "Rehab");

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
