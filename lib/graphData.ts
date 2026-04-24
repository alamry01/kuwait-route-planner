import { GraphData, EdgeDef } from "./types";

// Governorate groupings for UI dropdowns
export const GOVERNORATES: Record<string, { label: string; areas: string[] }> = {
  capital: {
    label: "Capital (العاصمة)",
    areas: [
      "Sharq", "Mirqab", "Qibla", "Bneid Al-Gar", "Dasman", "Dasma",
      "Rawdah", "Nuzha", "Shamiyah", "Yarmouk", "Shuwaikh", "Kaifan",
      "Sulaibikhat", "NW Sulaibikhat", "Ghornata", "Abdullah Al-Salem",
      "Doha", "Nahdha", "Daiya", "Watiya", "Salhiya", "Khalidiya",
      "Faiha", "Adailiya", "Mansouriya", "Qortuba", "Sawaber",
      "Qairawan", "South Qairawan",
    ],
  },
  hawalli: {
    label: "Hawalli (حولي)",
    areas: [
      "Salmiya", "Hawally", "Rumaithiya", "Bayan", "Mishref", "Jabriya",
      "Salwa", "Surra", "Qadisiya", "Shuhada", "Hitteen", "Zahra",
      "Shab", "Bida", "Siddiq", "Naqra", "South Surra", "Salam",
    ],
  },
  farwaniya: {
    label: "Farwaniya (الفروانية)",
    areas: [
      "Khaitan", "Rai", "Ferdous", "Abdullah Al-Mubarak",
      "South Abdullah Al-Mubarak", "West Abdullah Al-Mubarak",
      "Sabah Al-Nasser", "Ishbiliyah", "Ardiya", "Andalus",
      "Jleeb Al-Shuyoukh", "Omariya", "Riqqai", "Rehab",
      "Abraq Khaitan", "Abbasiya", "Dhajij",
    ],
  },
  ahmadi: {
    label: "Ahmadi (الأحمدي)",
    areas: [
      "Fahaheel", "Mahboula", "Abu Halifa", "Fintas", "Riqqa", "Mangaf",
      "Sabahiya", "Sabah Al-Ahmad", "East Sabah Al-Ahmad",
      "South Sabah Al-Ahmad", "Hadiya", "Ali Sabah Al-Salem", "Wafra",
      "Egaila", "Khairan", "Nuwaiseeb", "Zour", "Miqaa",
    ],
  },
  jahra: {
    label: "Jahra (الجهراء)",
    areas: [
      "Naeem", "Oyoun", "Sulaibiya", "Taima", "Wahah", "Qasr",
      "Amghara", "Abdali", "Naseem", "Mutlaa", "Salimi",
      "Saad Al-Abdullah", "Rahiya", "Kabd",
    ],
  },
  mubarak: {
    label: "Mubarak Al-Kabeer (مبارك الكبير)",
    areas: [
      "Sabah Al-Salem", "Abu Fatira", "Fnaitees", "Qurain", "Qusour",
      "Mseela", "Abu Al-Hasaniya", "Adan", "Subhan",
    ],
  },
};

export const nodeLatLngs: Record<string, [number, number]> = {
  // ── Capital (العاصمة) ──────────────────────────────────
  // Ring road latitudes: 1st ~29.372°N, 2nd ~29.355°N, 3rd ~29.342°N, 4th ~29.329°N, 5th ~29.316°N
  "Sharq":                     [29.3747, 47.9840],  // Financial harbour district ✓
  "Mirqab":                    [29.3697, 47.9762],  // Near Grand Mosque ✓
  "Qibla":                     [29.3678, 47.9714],  // National Assembly area ✓
  "Salhiya":                   [29.3718, 47.9687],  // Commercial district ✓
  "Sawaber":                   [29.3700, 47.9730],  // Mixed commercial ✓
  "Dasman":                    [29.3803, 47.9914],  // Dasman Palace coastal ✓
  "Bneid Al-Gar":              [29.3557, 47.9626],  // Between 1st and 2nd ring ✓
  "Dasma":                     [29.3487, 47.9756],  // Between 2nd and 3rd ring
  "Rawdah":                    [29.3517, 47.9881],  // Near 2nd ring, east side ✓
  "Nuzha":                     [29.3427, 47.9862],  // Near 3rd ring, east side ✓
  "Shamiyah":                  [29.3498, 47.9583],  // Between 2nd and 3rd ring (was 29.3627)
  "Yarmouk":                   [29.3440, 47.9468],  // Near 3rd ring, west side (was 29.3527)
  "Shuwaikh":                  [29.3637, 47.9372],  // Industrial port, NW ✓
  "Kaifan":                    [29.3388, 47.9631],  // Between 3rd and 4th ring (was 29.3445)
  "Sulaibikhat":               [29.3753, 47.8984],  // NW coast ✓
  "NW Sulaibikhat":            [29.3913, 47.8784],  // Far NW ✓
  "Ghornata":                  [29.3268, 47.9532],  // Near 4th ring (was 29.3373)
  "Abdullah Al-Salem":         [29.3358, 47.9710],  // Between 3rd and 4th ring (was 29.3405)
  "Doha":                      [29.3573, 47.9255],  // Western coast, near 2nd ring ✓
  "Nahdha":                    [29.3285, 47.9522],  // Near 4th ring (was 29.3372)
  "Daiya":                     [29.3493, 47.9525],  // Between 2nd and 3rd ring (was 29.3563)
  "Watiya":                    [29.3528, 47.9432],  // Between 2nd and 3rd ring (was 29.3598)
  "Khalidiya":                 [29.3300, 47.9635],  // Between 3rd and 4th ring (was 29.3545, -2.7km fix)
  "Faiha":                     [29.3450, 47.9748],  // Near 3rd ring (was 29.3483)
  "Adailiya":                  [29.3500, 47.9828],  // Between 2nd and 3rd ring (was 29.3550)
  "Mansouriya":                [29.3462, 47.9940],  // Near 3rd ring, east ✓
  "Qortuba":                   [29.3228, 47.9558],  // Near 5th ring (was 29.3295)
  "Qairawan":                  [29.3148, 47.9462],  // South of 5th ring (was 29.3218)
  "South Qairawan":            [29.3058, 47.9472],  // Far south (was 29.3126)

  // ── Hawalli (حولي) ─────────────────────────────────────
  "Salmiya":                   [29.3367, 48.0712],  // Coastal commercial
  "Hawally":                   [29.3330, 47.9988],  // Main Hawalli
  "Rumaithiya":                [29.3433, 48.0892],  // Residential coastal
  "Bayan":                     [29.2978, 48.0818],  // Residential
  "Mishref":                   [29.2828, 48.0455],  // Residential
  "Jabriya":                   [29.3105, 48.0249],  // Residential
  "Salwa":                     [29.2837, 48.0762],  // Residential
  "Surra":                     [29.3232, 47.9842],  // Residential
  "Qadisiya":                  [29.3213, 47.9968],  // Residential
  "Shuhada":                   [29.3280, 47.9793],  // Residential
  "Hitteen":                   [29.3197, 47.9870],  // Residential
  "Zahra":                     [29.3147, 47.9912],  // Residential
  "Shab":                      [29.3373, 48.0553],  // Residential
  "Bida":                      [29.3427, 48.0638],  // Residential
  "Siddiq":                    [29.3253, 48.0012],  // Residential
  "Naqra":                     [29.3162, 48.0122],  // Residential
  "South Surra":               [29.3128, 47.9812],  // Residential
  "Salam":                     [29.3072, 48.0002],  // Residential

  // ── Farwaniya (الفروانية) ──────────────────────────────
  "Khaitan":                   [29.2928, 47.9628],  // Residential
  "Rai":                       [29.2852, 47.9738],  // Industrial
  "Ferdous":                   [29.2983, 47.9882],  // Residential
  "Abdullah Al-Mubarak":       [29.3388, 47.8718],  // Residential
  "South Abdullah Al-Mubarak": [29.3255, 47.8688],  // Residential
  "West Abdullah Al-Mubarak":  [29.3315, 47.8533],  // Residential
  "Sabah Al-Nasser":           [29.3163, 47.9432],  // Residential
  "Ishbiliyah":                [29.3082, 47.9518],  // Residential
  "Ardiya":                    [29.3067, 47.9335],  // Industrial/residential
  "Andalus":                   [29.2972, 47.9452],  // Residential
  "Jleeb Al-Shuyoukh":         [29.3075, 47.9468],  // High density residential
  "Omariya":                   [29.2893, 47.9602],  // Residential
  "Riqqai":                    [29.2758, 47.9568],  // Residential
  "Rehab":                     [29.2655, 47.9738],  // Residential
  "Abraq Khaitan":             [29.2742, 47.9802],  // Residential
  "Abbasiya":                  [29.2843, 47.9308],  // Residential
  "Dhajij":                    [29.2672, 47.9518],  // Residential

  // ── Ahmadi (الأحمدي) ───────────────────────────────────
  // Coast runs ~48.14°E at 29.1°N, curving to ~48.17°E at 28.9°N
  // All coordinates verified to be on land (west of coastline)
  "Egaila":                    [29.1923, 48.0728],  // Residential
  "Ali Sabah Al-Salem":        [29.1583, 48.0888],  // Residential (Omer)
  "Fintas":                    [29.1585, 48.1198],  // Coastal residential
  "Riqqa":                     [29.1373, 48.1078],  // Residential
  "Sabahiya":                  [29.1137, 48.0978],  // Residential
  "Abu Halifa":                [29.1097, 48.1268],  // Residential — coast is ~48.14 here ✓
  "Mangaf":                    [29.0965, 48.1095],  // Residential
  "Mahboula":                  [29.0873, 48.1295],  // Coastal residential
  "Fahaheel":                  [29.0745, 48.1348],  // Coastal town
  "Hadiya":                    [29.0553, 48.1035],  // Residential
  "Sabah Al-Ahmad":            [29.0222, 48.0853],  // Planned city — inland ✓
  "East Sabah Al-Ahmad":       [29.0273, 48.1153],  // Eastern district — coast ~48.16 here ✓
  "South Sabah Al-Ahmad":      [28.9882, 48.0832],  // Southern district — inland ✓
  "Zour":                      [29.0173, 48.1553],  // Industrial coastal — on shoreline ✓
  "Khairan":                   [28.9218, 48.2615],  // Marina resort on coast ✓
  "Nuwaiseeb":                 [28.7303, 48.1518],  // Southern port area ✓
  "Wafra":                     [28.6243, 47.9318],  // Agricultural south — inland ✓
  "Miqaa":                     [28.7098, 47.8328],  // SW interior — inland ✓

  // ── Jahra (الجهراء) ────────────────────────────────────
  "Naeem":                     [29.3628, 47.6972],  // Main Jahra area
  "Oyoun":                     [29.3552, 47.6838],  // Residential
  "Sulaibiya":                 [29.2695, 47.8018],  // Farms/industrial
  "Taima":                     [29.3938, 47.6373],  // Residential
  "Wahah":                     [29.3797, 47.6598],  // Residential
  "Qasr":                      [29.3457, 47.6678],  // Residential
  "Amghara":                   [29.1888, 47.7228],  // Industrial
  "Abdali":                    [29.9773, 47.7173],  // Near Iraqi border
  "Naseem":                    [29.3637, 47.7285],  // Residential
  "Mutlaa":                    [29.5083, 47.7453],  // New city, north Kuwait
  "Salimi":                    [29.3247, 47.5303],  // Near Saudi border west
  "Saad Al-Abdullah":          [29.4263, 47.7673],  // Residential city
  "Rahiya":                    [29.2628, 47.6338],  // Farms area
  "Kabd":                      [29.2438, 47.7418],  // Residential

  // ── Mubarak Al-Kabeer (مبارك الكبير) ───────────────────
  "Abu Al-Hasaniya":           [29.2613, 48.0848],  // Residential
  "Sabah Al-Salem":            [29.2468, 48.0585],  // Residential
  "Fnaitees":                  [29.2338, 48.0868],  // Residential
  "Qurain":                    [29.2163, 48.0572],  // Residential
  "Qusour":                    [29.2328, 48.0478],  // Residential
  "Subhan":                    [29.2248, 48.0238],  // Industrial
  "Mseela":                    [29.1963, 48.0838],  // Residential
  "Abu Fatira":                [29.2183, 48.0758],  // Residential
  "Adan":                      [29.1733, 48.0818],  // Residential
};

export const kuwaitGraph: GraphData = {
  nodes: Object.keys(nodeLatLngs).map((id) => ({ id })),
  edges: [
    // ── Capital internal ─────────────────────────────────
    { u: "Dasman",                    v: "Sharq",                    weight: 2 },
    { u: "Sharq",                     v: "Salhiya",                  weight: 1 },
    { u: "Sharq",                     v: "Mirqab",                   weight: 1 },
    { u: "Salhiya",                   v: "Mirqab",                   weight: 1 },
    { u: "Salhiya",                   v: "Sawaber",                  weight: 1 },
    { u: "Mirqab",                    v: "Sawaber",                  weight: 1 },
    { u: "Mirqab",                    v: "Qibla",                    weight: 1 },
    { u: "Sawaber",                   v: "Qibla",                    weight: 1 },
    { u: "Dasman",                    v: "Bneid Al-Gar",             weight: 3 },
    { u: "Qibla",                     v: "Bneid Al-Gar",             weight: 1 },
    { u: "Qibla",                     v: "Shamiyah",                 weight: 1 },
    { u: "Bneid Al-Gar",              v: "Khalidiya",                weight: 1 },
    { u: "Bneid Al-Gar",              v: "Dasma",                    weight: 1 },
    { u: "Khalidiya",                 v: "Shamiyah",                 weight: 1 },
    { u: "Khalidiya",                 v: "Faiha",                    weight: 1 },
    { u: "Khalidiya",                 v: "Kaifan",                   weight: 1 },
    { u: "Shamiyah",                  v: "Daiya",                    weight: 1 },
    { u: "Shamiyah",                  v: "Yarmouk",                  weight: 1 },
    { u: "Daiya",                     v: "Watiya",                   weight: 1 },
    { u: "Daiya",                     v: "Yarmouk",                  weight: 1 },
    { u: "Watiya",                    v: "Shuwaikh",                 weight: 1 },
    { u: "Watiya",                    v: "Doha",                     weight: 1 },
    { u: "Shuwaikh",                  v: "Yarmouk",                  weight: 1 },
    { u: "Shuwaikh",                  v: "Doha",                     weight: 1 },
    { u: "Shuwaikh",                  v: "Sulaibikhat",              weight: 4 },
    { u: "Sulaibikhat",               v: "NW Sulaibikhat",           weight: 2 },
    { u: "Dasma",                     v: "Rawdah",                   weight: 1 },
    { u: "Dasma",                     v: "Adailiya",                 weight: 1 },
    { u: "Rawdah",                    v: "Faiha",                    weight: 1 },
    { u: "Rawdah",                    v: "Adailiya",                 weight: 1 },
    { u: "Rawdah",                    v: "Nuzha",                    weight: 1 },
    { u: "Faiha",                     v: "Adailiya",                 weight: 1 },
    { u: "Faiha",                     v: "Abdullah Al-Salem",        weight: 1 },
    { u: "Adailiya",                  v: "Mansouriya",               weight: 1 },
    { u: "Kaifan",                    v: "Abdullah Al-Salem",        weight: 1 },
    { u: "Kaifan",                    v: "Ghornata",                 weight: 1 },
    { u: "Abdullah Al-Salem",         v: "Ghornata",                 weight: 1 },
    { u: "Mansouriya",                v: "Nuzha",                    weight: 1 },
    { u: "Nuzha",                     v: "Rawdah",                   weight: 1 },
    { u: "Yarmouk",                   v: "Qortuba",                  weight: 2 },
    { u: "Doha",                      v: "Nahdha",                   weight: 1 },
    { u: "Nahdha",                    v: "Qortuba",                  weight: 1 },
    { u: "Qortuba",                   v: "Ghornata",                 weight: 1 },
    { u: "Ghornata",                  v: "Qairawan",                 weight: 1 },
    { u: "Qairawan",                  v: "South Qairawan",           weight: 1 },

    // ── Capital ↔ other governorates ─────────────────────
    { u: "NW Sulaibikhat",            v: "Abdullah Al-Mubarak",      weight: 3 },
    { u: "Shuwaikh",                  v: "Abdullah Al-Mubarak",      weight: 7 },
    { u: "South Qairawan",            v: "Sabah Al-Nasser",          weight: 1 },
    { u: "Yarmouk",                   v: "Sabah Al-Nasser",          weight: 2 },
    { u: "Ghornata",                  v: "Ishbiliyah",               weight: 1 },
    { u: "Mansouriya",                v: "Hawally",                  weight: 1 },
    { u: "Nuzha",                     v: "Hawally",                  weight: 2 },
    { u: "Abdullah Al-Salem",         v: "Surra",                    weight: 1 },
    { u: "Faiha",                     v: "Surra",                    weight: 1 },
    { u: "Faiha",                     v: "Qadisiya",                 weight: 1 },
    { u: "Adailiya",                  v: "Surra",                    weight: 1 },
    { u: "Naeem",                     v: "Sulaibikhat",              weight: 9 },
    { u: "Naseem",                    v: "Doha",                     weight: 4 },

    // ── Hawalli internal ─────────────────────────────────
    { u: "Surra",                     v: "Qadisiya",                 weight: 1 },
    { u: "Surra",                     v: "Shuhada",                  weight: 1 },
    { u: "Surra",                     v: "South Surra",              weight: 1 },
    { u: "Qadisiya",                  v: "Shuhada",                  weight: 1 },
    { u: "Qadisiya",                  v: "Hawally",                  weight: 1 },
    { u: "Shuhada",                   v: "Hitteen",                  weight: 1 },
    { u: "Hawally",                   v: "Siddiq",                   weight: 1 },
    { u: "Hawally",                   v: "Naqra",                    weight: 1 },
    { u: "Hawally",                   v: "Jabriya",                  weight: 2 },
    { u: "Hitteen",                   v: "Zahra",                    weight: 1 },
    { u: "Zahra",                     v: "Siddiq",                   weight: 1 },
    { u: "Siddiq",                    v: "Naqra",                    weight: 1 },
    { u: "South Surra",               v: "Salam",                    weight: 1 },
    { u: "Naqra",                     v: "Salam",                    weight: 1 },
    { u: "Salam",                     v: "Jabriya",                  weight: 1 },
    { u: "Jabriya",                   v: "Mishref",                  weight: 3 },
    { u: "Salmiya",                   v: "Shab",                     weight: 2 },
    { u: "Salmiya",                   v: "Bida",                     weight: 1 },
    { u: "Salmiya",                   v: "Rumaithiya",               weight: 3 },
    { u: "Shab",                      v: "Bida",                     weight: 1 },
    { u: "Bida",                      v: "Rumaithiya",               weight: 2 },
    { u: "Rumaithiya",                v: "Bayan",                    weight: 4 },
    { u: "Bayan",                     v: "Salwa",                    weight: 1 },
    { u: "Salwa",                     v: "Mishref",                  weight: 4 },
    { u: "Mishref",                   v: "Bayan",                    weight: 3 },

    // ── Hawalli ↔ other governorates ─────────────────────
    { u: "Rumaithiya",                v: "Fnaitees",                 weight: 2 },
    { u: "Bayan",                     v: "Abu Al-Hasaniya",          weight: 2 },
    { u: "Salwa",                     v: "Sabah Al-Salem",           weight: 4 },
    { u: "Mishref",                   v: "Sabah Al-Salem",           weight: 4 },
    { u: "Salmiya",                   v: "Egaila",                   weight: 4 },
    { u: "Salam",                     v: "Khaitan",                  weight: 1 },
    { u: "South Surra",               v: "Khaitan",                  weight: 2 },
    { u: "Zahra",                     v: "Khaitan",                  weight: 2 },
    { u: "Ferdous",                   v: "Salam",                    weight: 2 },

    // ── Farwaniya internal ───────────────────────────────
    { u: "Sabah Al-Nasser",           v: "Ishbiliyah",               weight: 1 },
    { u: "Sabah Al-Nasser",           v: "Ardiya",                   weight: 1 },
    { u: "Ishbiliyah",                v: "Ardiya",                   weight: 1 },
    { u: "Ishbiliyah",                v: "Jleeb Al-Shuyoukh",        weight: 1 },
    { u: "Ardiya",                    v: "Jleeb Al-Shuyoukh",        weight: 1 },
    { u: "Ardiya",                    v: "Abbasiya",                 weight: 1 },
    { u: "Jleeb Al-Shuyoukh",         v: "Andalus",                  weight: 1 },
    { u: "Jleeb Al-Shuyoukh",         v: "Khaitan",                  weight: 1 },
    { u: "Andalus",                   v: "Khaitan",                  weight: 1 },
    { u: "Andalus",                   v: "Omariya",                  weight: 1 },
    { u: "Khaitan",                   v: "Omariya",                  weight: 1 },
    { u: "Khaitan",                   v: "Rai",                      weight: 1 },
    { u: "Omariya",                   v: "Riqqai",                   weight: 2 },
    { u: "Rai",                       v: "Ferdous",                  weight: 1 },
    { u: "Rai",                       v: "Riqqai",                   weight: 1 },
    { u: "Riqqai",                    v: "Dhajij",                   weight: 1 },
    { u: "Riqqai",                    v: "Abraq Khaitan",            weight: 1 },
    { u: "Abraq Khaitan",             v: "Rehab",                    weight: 1 },
    { u: "Dhajij",                    v: "Rehab",                    weight: 1 },
    { u: "Abdullah Al-Mubarak",       v: "West Abdullah Al-Mubarak", weight: 2 },
    { u: "Abdullah Al-Mubarak",       v: "South Abdullah Al-Mubarak",weight: 2 },
    { u: "West Abdullah Al-Mubarak",  v: "South Abdullah Al-Mubarak",weight: 1 },
    { u: "South Abdullah Al-Mubarak", v: "Sabah Al-Nasser",          weight: 2 },

    // ── Farwaniya ↔ other governorates ───────────────────
    { u: "Abbasiya",                  v: "Sulaibiya",                weight: 8 },
    { u: "Rehab",                     v: "Subhan",                   weight: 5 },
    { u: "Abraq Khaitan",             v: "Subhan",                   weight: 5 },

    // ── Ahmadi internal ──────────────────────────────────
    { u: "Egaila",                    v: "Ali Sabah Al-Salem",       weight: 4 },
    { u: "Ali Sabah Al-Salem",        v: "Riqqa",                    weight: 2 },
    { u: "Ali Sabah Al-Salem",        v: "Fintas",                   weight: 1 },
    { u: "Fintas",                    v: "Riqqa",                    weight: 2 },
    { u: "Riqqa",                     v: "Sabahiya",                 weight: 2 },
    { u: "Sabahiya",                  v: "Abu Halifa",               weight: 1 },
    { u: "Abu Halifa",                v: "Mangaf",                   weight: 2 },
    { u: "Abu Halifa",                v: "Mahboula",                 weight: 2 },
    { u: "Mangaf",                    v: "Mahboula",                 weight: 1 },
    { u: "Mangaf",                    v: "Fahaheel",                 weight: 2 },
    { u: "Mahboula",                  v: "Fahaheel",                 weight: 1 },
    { u: "Fahaheel",                  v: "Hadiya",                   weight: 2 },
    { u: "Hadiya",                    v: "Sabah Al-Ahmad",           weight: 13 },
    { u: "Sabah Al-Ahmad",            v: "East Sabah Al-Ahmad",      weight: 3 },
    { u: "Sabah Al-Ahmad",            v: "South Sabah Al-Ahmad",     weight: 4 },
    { u: "East Sabah Al-Ahmad",       v: "South Sabah Al-Ahmad",     weight: 4 },
    { u: "East Sabah Al-Ahmad",       v: "Zour",                     weight: 9 },
    { u: "East Sabah Al-Ahmad",       v: "Khairan",                  weight: 12 },
    { u: "Khairan",                   v: "Nuwaiseeb",                weight: 12 },
    { u: "Nuwaiseeb",                 v: "Zour",                     weight: 14 },
    { u: "South Sabah Al-Ahmad",      v: "Wafra",                    weight: 40 },
    { u: "Wafra",                     v: "Miqaa",                    weight: 13 },

    // ── Ahmadi ↔ other governorates ──────────────────────
    { u: "Egaila",                    v: "Sabah Al-Salem",           weight: 6 },
    { u: "Egaila",                    v: "Adan",                     weight: 2 },
    { u: "Fintas",                    v: "Adan",                     weight: 3 },
    { u: "Fintas",                    v: "Mseela",                   weight: 4 },
    { u: "Sabahiya",                  v: "Mseela",                   weight: 3 },

    // ── Jahra internal ───────────────────────────────────
    { u: "Naeem",                     v: "Oyoun",                    weight: 2 },
    { u: "Naeem",                     v: "Naseem",                   weight: 6 },
    { u: "Naeem",                     v: "Qasr",                     weight: 4 },
    { u: "Oyoun",                     v: "Wahah",                    weight: 3 },
    { u: "Oyoun",                     v: "Qasr",                     weight: 4 },
    { u: "Wahah",                     v: "Taima",                    weight: 3 },
    { u: "Taima",                     v: "Naseem",                   weight: 6 },
    { u: "Qasr",                      v: "Rahiya",                   weight: 5 },
    { u: "Naseem",                    v: "Saad Al-Abdullah",         weight: 7 },
    { u: "Naseem",                    v: "Mutlaa",                   weight: 16 },
    { u: "Saad Al-Abdullah",          v: "Mutlaa",                   weight: 10 },
    { u: "Mutlaa",                    v: "Abdali",                   weight: 52 },
    { u: "Rahiya",                    v: "Amghara",                  weight: 8 },
    { u: "Amghara",                   v: "Kabd",                     weight: 6 },
    { u: "Kabd",                      v: "Sulaibiya",                weight: 5 },
    { u: "Sulaibiya",                 v: "Rahiya",                   weight: 7 },
    { u: "Salimi",                    v: "Rahiya",                   weight: 10 },
    { u: "Salimi",                    v: "Taima",                    weight: 11 },

    // ── Jahra ↔ other governorates ───────────────────────
    { u: "Sulaibiya",                 v: "Abbasiya",                 weight: 8 },
    { u: "Amghara",                   v: "Sulaibiya",                weight: 9 },

    // ── Mubarak Al-Kabeer internal ───────────────────────
    { u: "Sabah Al-Salem",            v: "Abu Al-Hasaniya",          weight: 2 },
    { u: "Sabah Al-Salem",            v: "Qurain",                   weight: 2 },
    { u: "Sabah Al-Salem",            v: "Fnaitees",                 weight: 2 },
    { u: "Sabah Al-Salem",            v: "Qusour",                   weight: 2 },
    { u: "Abu Al-Hasaniya",           v: "Fnaitees",                 weight: 2 },
    { u: "Qurain",                    v: "Qusour",                   weight: 2 },
    { u: "Qurain",                    v: "Abu Fatira",               weight: 1 },
    { u: "Qusour",                    v: "Subhan",                   weight: 3 },
    { u: "Fnaitees",                  v: "Mseela",                   weight: 2 },
    { u: "Mseela",                    v: "Abu Fatira",               weight: 3 },
    { u: "Mseela",                    v: "Adan",                     weight: 3 },
    { u: "Adan",                      v: "Abu Fatira",               weight: 3 },
    { u: "Subhan",                    v: "Adan",                     weight: 4 },

    // ── Mubarak Al-Kabeer ↔ other governorates ────────────
    { u: "Abu Al-Hasaniya",           v: "Bayan",                    weight: 2 },
    { u: "Fnaitees",                  v: "Rumaithiya",               weight: 2 },
    { u: "Subhan",                    v: "Rehab",                    weight: 5 },
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
