import type {
  Event,
  Fight,
  FightResult,
  FightWithRelations,
  Prediction,
  Profile,
} from "@/types";

const now = Date.now();
const hours = (h: number) => new Date(now + h * 60 * 60 * 1000).toISOString();
const daysAgo = (d: number) =>
  new Date(now - d * 24 * 60 * 60 * 1000).toISOString();

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
    username: "pickchamp_admin",
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
    name: "Riyadh Season: Heavyweight Clash",
    promotion: "Riyadh Season",
    location: "Riyadh, Saudi Arabia",
    event_date: hours(72),
    created_at: daysAgo(10),
    updated_at: daysAgo(10),
  },
  {
    id: "evt-002",
    name: "UFC Fight Night: London",
    promotion: "UFC",
    location: "London, UK",
    event_date: hours(48),
    created_at: daysAgo(8),
    updated_at: daysAgo(8),
  },
  {
    id: "evt-003",
    name: "World Title Boxing Night",
    promotion: "Top Rank",
    location: "Las Vegas, NV",
    event_date: hours(96),
    created_at: daysAgo(5),
    updated_at: daysAgo(5),
  },
  {
    id: "evt-004",
    name: "Championship Showcase (Settled)",
    promotion: "Matchroom",
    location: "Manchester, UK",
    event_date: daysAgo(14),
    created_at: daysAgo(30),
    updated_at: daysAgo(14),
  },
];

export const mockFights: Fight[] = [
  {
    id: "fight-001",
    event_id: "evt-001",
    sport: "boxing",
    fighter_a_name: "Tyson Fury",
    fighter_b_name: "Oleksandr Usyk",
    scheduled_rounds: 12,
    weight_class: "Heavyweight",
    fight_order: 1,
    lock_time: hours(60),
    status: "upcoming",
    favourite_side: "none",
    favourite_level: "even",
    created_at: daysAgo(10),
    updated_at: daysAgo(10),
  },
  {
    id: "fight-002",
    event_id: "evt-003",
    sport: "boxing",
    fighter_a_name: "Terence Crawford",
    fighter_b_name: "Errol Spence Jr",
    scheduled_rounds: 12,
    weight_class: "Welterweight",
    fight_order: 1,
    lock_time: hours(80),
    status: "upcoming",
    favourite_side: "fighterA",
    favourite_level: "favourite",
    created_at: daysAgo(5),
    updated_at: daysAgo(5),
  },
  {
    id: "fight-003",
    event_id: "evt-003",
    sport: "boxing",
    fighter_a_name: "Prospect A",
    fighter_b_name: "Prospect B",
    scheduled_rounds: 6,
    weight_class: "Lightweight",
    fight_order: 2,
    lock_time: hours(84),
    status: "upcoming",
    favourite_side: "none",
    favourite_level: "even",
    created_at: daysAgo(5),
    updated_at: daysAgo(5),
  },
  {
    id: "fight-004",
    event_id: "evt-002",
    sport: "mma",
    fighter_a_name: "Jon Jones",
    fighter_b_name: "Tom Aspinall",
    scheduled_rounds: 5,
    weight_class: "Heavyweight",
    fight_order: 1,
    lock_time: hours(40),
    status: "upcoming",
    favourite_side: "fighterA",
    favourite_level: "heavy_favourite",
    created_at: daysAgo(8),
    updated_at: daysAgo(8),
  },
  {
    id: "fight-005",
    event_id: "evt-002",
    sport: "mma",
    fighter_a_name: "Islam Makhachev",
    fighter_b_name: "Charles Oliveira",
    scheduled_rounds: 5,
    weight_class: "Lightweight",
    fight_order: 2,
    lock_time: hours(44),
    status: "upcoming",
    favourite_side: "fighterA",
    favourite_level: "favourite",
    created_at: daysAgo(8),
    updated_at: daysAgo(8),
  },
  {
    id: "fight-006",
    event_id: "evt-002",
    sport: "mma",
    fighter_a_name: "Contender A",
    fighter_b_name: "Contender B",
    scheduled_rounds: 3,
    weight_class: "Bantamweight",
    fight_order: 3,
    lock_time: hours(46),
    status: "upcoming",
    favourite_side: "none",
    favourite_level: "even",
    created_at: daysAgo(8),
    updated_at: daysAgo(8),
  },
  {
    id: "fight-007",
    event_id: "evt-004",
    sport: "boxing",
    fighter_a_name: "Champion X",
    fighter_b_name: "Challenger Y",
    scheduled_rounds: 10,
    weight_class: "Middleweight",
    fight_order: 1,
    lock_time: daysAgo(15),
    status: "settled",
    favourite_side: "fighterA",
    favourite_level: "favourite",
    created_at: daysAgo(30),
    updated_at: daysAgo(14),
  },
  {
    id: "fight-008",
    event_id: "evt-004",
    sport: "mma",
    fighter_a_name: "Veteran A",
    fighter_b_name: "Veteran B",
    scheduled_rounds: 3,
    weight_class: "Featherweight",
    fight_order: 2,
    lock_time: daysAgo(16),
    status: "locked",
    favourite_side: "none",
    favourite_level: "even",
    created_at: daysAgo(30),
    updated_at: daysAgo(15),
  },
];

export const mockResults: FightResult[] = [
  {
    id: "res-001",
    fight_id: "fight-007",
    outcome: "fighterA",
    method: "ko_tko",
    result_round: 8,
    official_notes: null,
    settled_at: daysAgo(14),
    created_at: daysAgo(14),
    updated_at: daysAgo(14),
  },
];

export let mockPredictions: Prediction[] = [
  {
    id: "pred-001",
    user_id: MOCK_USER_ID,
    fight_id: "fight-002",
    predicted_outcome: "fighterA",
    predicted_method: "decision",
    predicted_round: null,
    created_at: daysAgo(2),
    updated_at: daysAgo(1),
    locked_at: null,
    graded_at: null,
    rating_change: null,
    main_correct: null,
    method_correct: null,
    round_correct: null,
    perfect_pick: null,
    grading_details: null,
  },
  {
    id: "pred-002",
    user_id: MOCK_USER_ID,
    fight_id: "fight-007",
    predicted_outcome: "fighterA",
    predicted_method: "ko_tko",
    predicted_round: 8,
    created_at: daysAgo(20),
    updated_at: daysAgo(20),
    locked_at: daysAgo(16),
    graded_at: daysAgo(14),
    rating_change: 47,
    main_correct: true,
    method_correct: true,
    round_correct: true,
    perfect_pick: true,
    grading_details: null,
  },
];

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
