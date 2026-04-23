import { GraphData, EdgeDef } from "./types";

export const kuwaitGraph: GraphData = {
  nodes: [
    { id: "Kuwait City", x: 390, y: 230 },
    { id: "Salmiya", x: 440, y: 300 },
    { id: "Hawally", x: 420, y: 280 },
    { id: "Farwaniya", x: 330, y: 290 },
    { id: "Jahra", x: 220, y: 200 },
    { id: "Ahmadi", x: 400, y: 430 },
    { id: "Fahaheel", x: 420, y: 480 },
    { id: "Mangaf", x: 390, y: 460 },
    { id: "Sabah Al Salem", x: 430, y: 370 },
    { id: "Mishref", x: 410, y: 340 },
    { id: "Rumaithiya", x: 450, y: 320 },
    { id: "Jabriya", x: 400, y: 310 },
    { id: "Shuwaikh", x: 350, y: 220 },
    { id: "Fintas", x: 400, y: 400 },
    { id: "Abu Halifa", x: 410, y: 450 },
    { id: "Mahboula", x: 380, y: 470 },
    { id: "Jleeb", x: 310, y: 270 },
    { id: "Khaitan", x: 340, y: 310 },
    { id: "Salwa", x: 430, y: 350 },
    { id: "Abdulla Al Mubarak", x: 270, y: 250 },
    { id: "Sulaibikhat", x: 310, y: 200 },
    { id: "Wafra", x: 340, y: 560 },
    { id: "Sabah Al Ahmad", x: 450, y: 520 },
    { id: "Mubarak Al Kabeer", x: 440, y: 360 },
  ],
  edges: [
    { u: "Kuwait City", v: "Shuwaikh", weight: 5 },
    { u: "Kuwait City", v: "Hawally", weight: 6 },
    { u: "Kuwait City", v: "Salmiya", weight: 10 },
    { u: "Kuwait City", v: "Jahra", weight: 30 },
    { u: "Kuwait City", v: "Farwaniya", weight: 12 },
    { u: "Shuwaikh", v: "Jleeb", weight: 7 },
    { u: "Shuwaikh", v: "Sulaibikhat", weight: 6 },
    { u: "Sulaibikhat", v: "Jahra", weight: 15 },
    { u: "Sulaibikhat", v: "Abdulla Al Mubarak", weight: 8 },
    { u: "Jahra", v: "Abdulla Al Mubarak", weight: 12 },
    { u: "Abdulla Al Mubarak", v: "Jleeb", weight: 8 },
    { u: "Jleeb", v: "Farwaniya", weight: 5 },
    { u: "Jleeb", v: "Khaitan", weight: 6 },
    { u: "Farwaniya", v: "Khaitan", weight: 4 },
    { u: "Farwaniya", v: "Jahra", weight: 18 },
    { u: "Khaitan", v: "Hawally", weight: 7 },
    { u: "Khaitan", v: "Jabriya", weight: 6 },
    { u: "Hawally", v: "Salmiya", weight: 4 },
    { u: "Hawally", v: "Jabriya", weight: 3 },
    { u: "Salmiya", v: "Rumaithiya", weight: 3 },
    { u: "Salmiya", v: "Salwa", weight: 8 },
    { u: "Rumaithiya", v: "Mishref", weight: 4 },
    { u: "Rumaithiya", v: "Mubarak Al Kabeer", weight: 6 },
    { u: "Jabriya", v: "Mishref", weight: 4 },
    { u: "Jabriya", v: "Salwa", weight: 5 },
    { u: "Mishref", v: "Salwa", weight: 3 },
    { u: "Salwa", v: "Sabah Al Salem", weight: 4 },
    { u: "Salwa", v: "Mubarak Al Kabeer", weight: 3 },
    { u: "Mubarak Al Kabeer", v: "Sabah Al Salem", weight: 4 },
    { u: "Sabah Al Salem", v: "Fintas", weight: 6 },
    { u: "Fintas", v: "Ahmadi", weight: 5 },
    { u: "Fintas", v: "Abu Halifa", weight: 5 },
    { u: "Ahmadi", v: "Abu Halifa", weight: 4 },
    { u: "Ahmadi", v: "Mangaf", weight: 5 },
    { u: "Abu Halifa", v: "Mangaf", weight: 3 },
    { u: "Mangaf", v: "Mahboula", weight: 3 },
    { u: "Mangaf", v: "Fahaheel", weight: 4 },
    { u: "Mahboula", v: "Fahaheel", weight: 5 },
    { u: "Mahboula", v: "Wafra", weight: 20 },
    { u: "Fahaheel", v: "Sabah Al Ahmad", weight: 15 },
    { u: "Sabah Al Ahmad", v: "Wafra", weight: 25 },
  ],
};

export function getNeighbors(
  nodeId: string,
  edges: EdgeDef[]
): Array<{ dest: string; weight: number }> {
  const result: Array<{ dest: string; weight: number }> = [];
  for (const e of edges) {
    if (e.u === nodeId) result.push({ dest: e.v, weight: e.weight });
    else if (e.v === nodeId) result.push({ dest: e.u, weight: e.weight });
  }
  return result;
}
