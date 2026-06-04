import type {
  Event,
  Fight,
  FightResult,
  FightWithRelations,
  Prediction,
  Profile,
} from "@/types";

/** Real-world test cards — Saturday 6 June 2026 */
const CARD_DATE = "2026-06-06";

/** 17:00 BST — Steel City King first bell (Utilita Arena, Sheffield) */
const STEEL_CITY_FIRST_BELL = `${CARD_DATE}T16:00:00.000Z`;
/** ~22:00 BST — main event ringwalk window (Padley vs Fiaz) */
const STEEL_CITY_MAIN_LOCK = `${CARD_DATE}T21:00:00.000Z`;

/** 5:00 PM EDT — UFC prelims (Paramount+) */
const UFC_PRELIMS_LOCK = `${CARD_DATE}T21:00:00.000Z`;
/** 5:00 PM EDT — UFC prelims start (Paramount+) */
const UFC_EVENT_START = `${CARD_DATE}T21:00:00.000Z`;
/** 8:00 PM EDT — UFC main card (Paramount+) */
const UFC_MAIN_CARD_LOCK = "2026-06-07T00:00:00.000Z";

const MOCK_DATA_CREATED = "2026-05-15T12:00:00.000Z";
const MOCK_DATA_UPDATED = "2026-06-01T12:00:00.000Z";

const daysAgo = (d: number) =>
  new Date(Date.now() - d * 24 * 60 * 60 * 1000).toISOString();

export const MOCK_USER_ID = "mock-user-001";
export const MOCK_ADMIN_ID = "mock-admin-001";

export const mockProfiles: Profile[] = [
  {
    id: MOCK_USER_ID,
    username: "fightfan42",
    display_name: "Fight Fan",
    avatar_initials: "FF",
    global_rating: 1042,
    boxing_rating: 1088,
    mma_rating: 1012,
    total_picks: 38,
    total_correct: 22,
    boxing_picks: 18,
    boxing_correct: 11,
    mma_picks: 20,
    mma_correct: 11,
    perfect_picks: 3,
    current_streak: 2,
    best_streak: 5,
    is_admin: false,
    created_at: daysAgo(90),
    updated_at: daysAgo(1),
  },
  {
    id: "mock-user-002",
    username: "ko_king",
    display_name: "KO King",
    avatar_initials: "KK",
    global_rating: 1185,
    boxing_rating: 1220,
    mma_rating: 1150,
    total_picks: 62,
    total_correct: 38,
    boxing_picks: 30,
    boxing_correct: 19,
    mma_picks: 32,
    mma_correct: 19,
    perfect_picks: 8,
    current_streak: 4,
    best_streak: 9,
    created_at: daysAgo(120),
    updated_at: daysAgo(2),
  },
  {
    id: "mock-user-003",
    username: "underdog_hunter",
    display_name: null,
    avatar_initials: "UH",
    global_rating: 1098,
    boxing_rating: 1050,
    mma_rating: 1145,
    total_picks: 55,
    total_correct: 31,
    boxing_picks: 12,
    boxing_correct: 6,
    mma_picks: 43,
    mma_correct: 25,
    perfect_picks: 5,
    current_streak: 1,
    best_streak: 7,
    created_at: daysAgo(80),
    updated_at: daysAgo(3),
  },
  {
    id: MOCK_ADMIN_ID,
    username: "pickfist_admin",
    display_name: "Admin",
    avatar_initials: "PA",
    global_rating: 1000,
    boxing_rating: 1000,
    mma_rating: 1000,
    total_picks: 0,
    total_correct: 0,
    boxing_picks: 0,
    boxing_correct: 0,
    mma_picks: 0,
    mma_correct: 0,
    perfect_picks: 0,
    current_streak: 0,
    best_streak: 0,
    is_admin: true,
    created_at: daysAgo(30),
    updated_at: daysAgo(30),
  },
];

export const mockEvents: Event[] = [
  {
    id: "evt-001",
    name: "Steel City King",
    promotion: "Matchroom Boxing",
    location: "Utilita Arena, Sheffield, UK",
    timezone: "Europe/London",
    event_date: STEEL_CITY_FIRST_BELL,
    created_at: MOCK_DATA_CREATED,
    updated_at: MOCK_DATA_UPDATED,
  },
  {
    id: "evt-002",
    name: "UFC Fight Night: Muhammad vs. Bonfim",
    promotion: "UFC",
    location: "Meta APEX, Las Vegas, Nevada, USA",
    timezone: "America/Los_Angeles",
    event_date: UFC_EVENT_START,
    created_at: MOCK_DATA_CREATED,
    updated_at: MOCK_DATA_UPDATED,
  },
];

export const mockFights: Fight[] = [
  {
    id: "fight-001",
    event_id: "evt-001",
    sport: "boxing",
    fighter_a_name: "Josh Padley",
    fighter_b_name: "Aqib Fiaz",
    scheduled_rounds: 12,
    weight_class: "Super Featherweight",
    fight_order: 1,
    lock_time: STEEL_CITY_MAIN_LOCK,
    status: "upcoming",
    favourite_side: "fighterA",
    favourite_level: "favourite",
    created_at: MOCK_DATA_CREATED,
    updated_at: MOCK_DATA_UPDATED,
  },
  {
    id: "fight-002",
    event_id: "evt-001",
    sport: "boxing",
    fighter_a_name: "Ibrahim Nadim",
    fighter_b_name: "Ibraheem Sulaimaan",
    scheduled_rounds: 10,
    weight_class: "Super Featherweight",
    fight_order: 2,
    lock_time: STEEL_CITY_FIRST_BELL,
    status: "upcoming",
    favourite_side: "fighterB",
    favourite_level: "favourite",
    created_at: MOCK_DATA_CREATED,
    updated_at: MOCK_DATA_UPDATED,
  },
  {
    id: "fight-003",
    event_id: "evt-001",
    sport: "boxing",
    fighter_a_name: "Aaron Bowen",
    fighter_b_name: "Troy Coleman",
    scheduled_rounds: 10,
    weight_class: "Middleweight",
    fight_order: 3,
    lock_time: STEEL_CITY_FIRST_BELL,
    status: "upcoming",
    favourite_side: "fighterA",
    favourite_level: "favourite",
    created_at: MOCK_DATA_CREATED,
    updated_at: MOCK_DATA_UPDATED,
  },
  {
    id: "fight-004",
    event_id: "evt-001",
    sport: "boxing",
    fighter_a_name: "Leo Atang",
    fighter_b_name: "Fouad Shaili",
    scheduled_rounds: 6,
    weight_class: "Heavyweight",
    fight_order: 4,
    lock_time: STEEL_CITY_FIRST_BELL,
    status: "upcoming",
    favourite_side: "fighterA",
    favourite_level: "heavy_favourite",
    created_at: MOCK_DATA_CREATED,
    updated_at: MOCK_DATA_UPDATED,
  },
  {
    id: "fight-005",
    event_id: "evt-001",
    sport: "boxing",
    fighter_a_name: "Adam Maca",
    fighter_b_name: "Cesar Ignacio Paredes",
    scheduled_rounds: 6,
    weight_class: "Super Featherweight",
    fight_order: 5,
    lock_time: STEEL_CITY_FIRST_BELL,
    status: "upcoming",
    favourite_side: "fighterA",
    favourite_level: "heavy_favourite",
    created_at: MOCK_DATA_CREATED,
    updated_at: MOCK_DATA_UPDATED,
  },
  {
    id: "fight-006",
    event_id: "evt-001",
    sport: "boxing",
    fighter_a_name: "Connor Mitchell",
    fighter_b_name: "Rodrigo Matias Areco",
    scheduled_rounds: 4,
    weight_class: "Featherweight",
    fight_order: 6,
    lock_time: STEEL_CITY_FIRST_BELL,
    status: "upcoming",
    favourite_side: "fighterA",
    favourite_level: "heavy_favourite",
    created_at: MOCK_DATA_CREATED,
    updated_at: MOCK_DATA_UPDATED,
  },
  {
    id: "fight-007",
    event_id: "evt-001",
    sport: "boxing",
    fighter_a_name: "Edward Hardy",
    fighter_b_name: "Jesus Carrasco Bacchini",
    scheduled_rounds: 6,
    weight_class: "Featherweight",
    fight_order: 7,
    lock_time: STEEL_CITY_FIRST_BELL,
    status: "upcoming",
    favourite_side: "fighterA",
    favourite_level: "favourite",
    created_at: MOCK_DATA_CREATED,
    updated_at: MOCK_DATA_UPDATED,
  },
  {
    id: "fight-008",
    event_id: "evt-001",
    sport: "boxing",
    fighter_a_name: "Chris Mulunda",
    fighter_b_name: "Connor Goulding",
    scheduled_rounds: 4,
    weight_class: "Middleweight",
    fight_order: 8,
    lock_time: STEEL_CITY_FIRST_BELL,
    status: "upcoming",
    favourite_side: "fighterA",
    favourite_level: "favourite",
    created_at: MOCK_DATA_CREATED,
    updated_at: MOCK_DATA_UPDATED,
  },
  {
    id: "fight-009",
    event_id: "evt-002",
    sport: "mma",
    fighter_a_name: "Belal Muhammad",
    fighter_b_name: "Gabriel Bonfim",
    scheduled_rounds: 5,
    weight_class: "Welterweight",
    fight_order: 1,
    lock_time: UFC_MAIN_CARD_LOCK,
    status: "upcoming",
    favourite_side: "fighterA",
    favourite_level: "favourite",
    created_at: MOCK_DATA_CREATED,
    updated_at: MOCK_DATA_UPDATED,
  },
  {
    id: "fight-010",
    event_id: "evt-002",
    sport: "mma",
    fighter_a_name: "Brendan Allen",
    fighter_b_name: "Edmen Shahbazyan",
    scheduled_rounds: 3,
    weight_class: "Middleweight",
    fight_order: 2,
    lock_time: UFC_MAIN_CARD_LOCK,
    status: "upcoming",
    favourite_side: "fighterA",
    favourite_level: "favourite",
    created_at: MOCK_DATA_CREATED,
    updated_at: MOCK_DATA_UPDATED,
  },
  {
    id: "fight-011",
    event_id: "evt-002",
    sport: "mma",
    fighter_a_name: "Farès Ziam",
    fighter_b_name: "Tom Nolan",
    scheduled_rounds: 3,
    weight_class: "Lightweight",
    fight_order: 3,
    lock_time: UFC_MAIN_CARD_LOCK,
    status: "upcoming",
    favourite_side: "fighterA",
    favourite_level: "favourite",
    created_at: MOCK_DATA_CREATED,
    updated_at: MOCK_DATA_UPDATED,
  },
  {
    id: "fight-012",
    event_id: "evt-002",
    sport: "mma",
    fighter_a_name: "Bryce Mitchell",
    fighter_b_name: "Santiago Luna",
    scheduled_rounds: 3,
    weight_class: "Bantamweight",
    fight_order: 4,
    lock_time: UFC_MAIN_CARD_LOCK,
    status: "upcoming",
    favourite_side: "fighterA",
    favourite_level: "favourite",
    created_at: MOCK_DATA_CREATED,
    updated_at: MOCK_DATA_UPDATED,
  },
  {
    id: "fight-013",
    event_id: "evt-002",
    sport: "mma",
    fighter_a_name: "Iwo Baraniewski",
    fighter_b_name: "Junior Tafa",
    scheduled_rounds: 3,
    weight_class: "Light Heavyweight",
    fight_order: 5,
    lock_time: UFC_MAIN_CARD_LOCK,
    status: "upcoming",
    favourite_side: "fighterA",
    favourite_level: "favourite",
    created_at: MOCK_DATA_CREATED,
    updated_at: MOCK_DATA_UPDATED,
  },
  {
    id: "fight-014",
    event_id: "evt-002",
    sport: "mma",
    fighter_a_name: "Matt Schnell",
    fighter_b_name: "Alessandro Costa",
    scheduled_rounds: 3,
    weight_class: "Catchweight (130 lb)",
    fight_order: 6,
    lock_time: UFC_PRELIMS_LOCK,
    status: "upcoming",
    favourite_side: "fighterB",
    favourite_level: "favourite",
    created_at: MOCK_DATA_CREATED,
    updated_at: MOCK_DATA_UPDATED,
  },
  {
    id: "fight-015",
    event_id: "evt-002",
    sport: "mma",
    fighter_a_name: "Marcus McGhee",
    fighter_b_name: "John Yannis",
    scheduled_rounds: 3,
    weight_class: "Bantamweight",
    fight_order: 7,
    lock_time: UFC_PRELIMS_LOCK,
    status: "upcoming",
    favourite_side: "fighterA",
    favourite_level: "favourite",
    created_at: MOCK_DATA_CREATED,
    updated_at: MOCK_DATA_UPDATED,
  },
  {
    id: "fight-016",
    event_id: "evt-002",
    sport: "mma",
    fighter_a_name: "Bruno Gustavo da Silva",
    fighter_b_name: "Edgar Chairez",
    scheduled_rounds: 3,
    weight_class: "Flyweight",
    fight_order: 8,
    lock_time: UFC_PRELIMS_LOCK,
    status: "upcoming",
    favourite_side: "fighterA",
    favourite_level: "favourite",
    created_at: MOCK_DATA_CREATED,
    updated_at: MOCK_DATA_UPDATED,
  },
  {
    id: "fight-017",
    event_id: "evt-002",
    sport: "mma",
    fighter_a_name: "Priscila Cachoeira",
    fighter_b_name: "Chelsea Chandler",
    scheduled_rounds: 3,
    weight_class: "Women's Bantamweight",
    fight_order: 9,
    lock_time: UFC_PRELIMS_LOCK,
    status: "upcoming",
    favourite_side: "fighterB",
    favourite_level: "favourite",
    created_at: MOCK_DATA_CREATED,
    updated_at: MOCK_DATA_UPDATED,
  },
  {
    id: "fight-018",
    event_id: "evt-002",
    sport: "mma",
    fighter_a_name: "Jordan Leavitt",
    fighter_b_name: "Joanderson Brito",
    scheduled_rounds: 3,
    weight_class: "Featherweight",
    fight_order: 10,
    lock_time: UFC_PRELIMS_LOCK,
    status: "upcoming",
    favourite_side: "fighterB",
    favourite_level: "favourite",
    created_at: MOCK_DATA_CREATED,
    updated_at: MOCK_DATA_UPDATED,
  },
  {
    id: "fight-019",
    event_id: "evt-002",
    sport: "mma",
    fighter_a_name: "Jeisla Chaves",
    fighter_b_name: "Yuneisy Duben",
    scheduled_rounds: 3,
    weight_class: "Women's Flyweight",
    fight_order: 11,
    lock_time: UFC_PRELIMS_LOCK,
    status: "upcoming",
    favourite_side: "fighterA",
    favourite_level: "favourite",
    created_at: MOCK_DATA_CREATED,
    updated_at: MOCK_DATA_UPDATED,
  },
  {
    id: "fight-020",
    event_id: "evt-002",
    sport: "mma",
    fighter_a_name: "Ketlen Souza",
    fighter_b_name: "Ariane Carnelossi",
    scheduled_rounds: 3,
    weight_class: "Women's Strawweight",
    fight_order: 12,
    lock_time: UFC_PRELIMS_LOCK,
    status: "upcoming",
    favourite_side: "fighterA",
    favourite_level: "favourite",
    created_at: MOCK_DATA_CREATED,
    updated_at: MOCK_DATA_UPDATED,
  },
];

export const mockResults: FightResult[] = [];

export let mockPredictions: Prediction[] = [];

export function getMockEvents(): Event[] {
  return [...mockEvents];
}

export function getMockFights(): Fight[] {
  return [...mockFights];
}

export function getMockProfiles(): Profile[] {
  return [...mockProfiles];
}

export function getMockPredictions(userId?: string): Prediction[] {
  if (!userId) return [...mockPredictions];
  return mockPredictions.filter((p) => p.user_id === userId);
}

export function getMockFightWithRelations(
  userId?: string
): FightWithRelations[] {
  const events = getMockEvents();
  const preds = getMockPredictions(userId);
  return getMockFights().map((fight) => {
    const event = events.find((e) => e.id === fight.event_id)!;
    const result = mockResults.find((r) => r.fight_id === fight.id) ?? null;
    const userPrediction =
      preds.find((p) => p.fight_id === fight.id) ?? null;
    return { ...fight, event, result, userPrediction };
  });
}

export function upsertMockPrediction(
  pred: Omit<Prediction, "id" | "created_at" | "updated_at"> & {
    id?: string;
  }
): Prediction {
  const existing = mockPredictions.find(
    (p) => p.user_id === pred.user_id && p.fight_id === pred.fight_id
  );
  const nowIso = new Date().toISOString();
  if (existing) {
    const updated: Prediction = {
      ...existing,
      ...pred,
      updated_at: nowIso,
    };
    mockPredictions = mockPredictions.map((p) =>
      p.id === existing.id ? updated : p
    );
    return updated;
  }
  const created: Prediction = {
    ...pred,
    id: pred.id ?? `pred-${Date.now()}`,
    created_at: nowIso,
    updated_at: nowIso,
    locked_at: pred.locked_at ?? null,
    graded_at: pred.graded_at ?? null,
    rating_change: pred.rating_change ?? null,
    main_correct: pred.main_correct ?? null,
    method_correct: pred.method_correct ?? null,
    round_correct: pred.round_correct ?? null,
    perfect_pick: pred.perfect_pick ?? null,
    grading_details: pred.grading_details ?? null,
  };
  mockPredictions.push(created);
  return created;
}
