import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const CARD_DATE = "2026-06-06";
const STEEL_CITY_FIRST_BELL = `${CARD_DATE}T16:00:00.000Z`;
const STEEL_CITY_MAIN_LOCK = `${CARD_DATE}T21:00:00.000Z`;
const ZUFFA_BOXING_FIRST_BELL = `${CARD_DATE}T16:00:00.000Z`;
const ZUFFA_BOXING_MAIN_CARD_LOCK = `${CARD_DATE}T18:00:00.000Z`;
const ZUFFA_BOXING_MAIN_LOCK = `${CARD_DATE}T21:00:00.000Z`;
const UFC_PRELIMS_LOCK = `${CARD_DATE}T21:00:00.000Z`;
const UFC_EVENT_START = `${CARD_DATE}T21:00:00.000Z`;
const UFC_MAIN_CARD_LOCK = "2026-06-07T00:00:00.000Z";
const CREATED = "2026-05-15T12:00:00.000Z";
const UPDATED = "2026-06-01T12:00:00.000Z";

const events = [
  [
    "e0000001-0001-4000-a000-000000000001",
    "Steel City King",
    "Matchroom Boxing",
    "Utilita Arena, Sheffield, UK",
    "Europe/London",
    STEEL_CITY_FIRST_BELL,
  ],
  [
    "e0000002-0002-4000-a000-000000000002",
    "UFC Fight Night: Muhammad vs. Bonfim",
    "UFC",
    "Meta APEX, Las Vegas, Nevada, USA",
    "America/Los_Angeles",
    UFC_EVENT_START,
  ],
  [
    "e0000003-0003-4000-a000-000000000003",
    "Zuffa Boxing 7",
    "Zuffa Boxing",
    "Bournemouth International Centre, Bournemouth, UK",
    "Europe/London",
    ZUFFA_BOXING_FIRST_BELL,
  ],
];

const fights = [
  ["f0000001-0001-4000-b000-000000000001", "e0000001-0001-4000-a000-000000000001", "boxing", "Josh Padley", "Aqib Fiaz", 12, "Super Featherweight", 1, STEEL_CITY_MAIN_LOCK, "upcoming", "fighterA", "favourite"],
  ["f0000002-0002-4000-b000-000000000002", "e0000001-0001-4000-a000-000000000001", "boxing", "Ibrahim Nadim", "Ibraheem Sulaimaan", 10, "Super Featherweight", 2, STEEL_CITY_FIRST_BELL, "upcoming", "fighterB", "favourite"],
  ["f0000003-0003-4000-b000-000000000003", "e0000001-0001-4000-a000-000000000001", "boxing", "Aaron Bowen", "Troy Coleman", 10, "Middleweight", 3, STEEL_CITY_FIRST_BELL, "upcoming", "fighterA", "favourite"],
  ["f0000004-0004-4000-b000-000000000004", "e0000001-0001-4000-a000-000000000001", "boxing", "Leo Atang", "Fouad Shaili", 6, "Heavyweight", 4, STEEL_CITY_FIRST_BELL, "upcoming", "fighterA", "heavy_favourite"],
  ["f0000005-0005-4000-b000-000000000005", "e0000001-0001-4000-a000-000000000001", "boxing", "Adam Maca", "Cesar Ignacio Paredes", 6, "Super Featherweight", 5, STEEL_CITY_FIRST_BELL, "upcoming", "fighterA", "heavy_favourite"],
  ["f0000006-0006-4000-b000-000000000006", "e0000001-0001-4000-a000-000000000001", "boxing", "Connor Mitchell", "Jesus Carrasco", 4, "Featherweight", 6, STEEL_CITY_FIRST_BELL, "upcoming", "fighterA", "heavy_favourite"],
  ["f0000007-0007-4000-b000-000000000007", "e0000001-0001-4000-a000-000000000001", "boxing", "Edward Hardy", "Manolo Bacchini", 6, "Featherweight", 7, STEEL_CITY_FIRST_BELL, "upcoming", "fighterA", "heavy_favourite"],
  ["f0000008-0008-4000-b000-000000000008", "e0000001-0001-4000-a000-000000000001", "boxing", "Chris Mulunda", "Connor Goulding", 4, "Middleweight", 8, STEEL_CITY_FIRST_BELL, "upcoming", "fighterA", "heavy_favourite"],
  ["f0000021-0021-4000-b000-000000000021", "e0000003-0003-4000-a000-000000000003", "boxing", "Chris Billam-Smith", "Ryan Rozicki", 10, "Cruiserweight", 1, ZUFFA_BOXING_MAIN_LOCK, "upcoming", "fighterA", "favourite"],
  ["f0000022-0022-4000-b000-000000000022", "e0000003-0003-4000-a000-000000000003", "boxing", "Jack Massey", "Cheavon Clarke", 10, "Cruiserweight", 2, ZUFFA_BOXING_MAIN_CARD_LOCK, "upcoming", "fighterA", "favourite"],
  ["f0000023-0023-4000-b000-000000000023", "e0000003-0003-4000-a000-000000000003", "boxing", "Lee Cutler", "Aaron Sutton", 10, "Middleweight", 3, ZUFFA_BOXING_MAIN_CARD_LOCK, "upcoming", "none", "even"],
  ["f0000024-0024-4000-b000-000000000024", "e0000003-0003-4000-a000-000000000003", "boxing", "Stephen McKenna", "Casey James Streeter", 8, "Middleweight", 4, ZUFFA_BOXING_MAIN_CARD_LOCK, "upcoming", "fighterB", "favourite"],
  ["f0000025-0025-4000-b000-000000000025", "e0000003-0003-4000-a000-000000000003", "boxing", "Sam Hickey", "Todd Tompkins", 6, "Middleweight", 5, ZUFFA_BOXING_MAIN_CARD_LOCK, "upcoming", "fighterA", "favourite"],
  ["f0000026-0026-4000-b000-000000000026", "e0000003-0003-4000-a000-000000000003", "boxing", "Harvey Dykes", "Ivan Dychko", 10, "Heavyweight", 6, ZUFFA_BOXING_FIRST_BELL, "upcoming", "fighterB", "heavy_favourite"],
  ["f0000027-0027-4000-b000-000000000027", "e0000003-0003-4000-a000-000000000003", "boxing", "Leon Hughes", "Mario Vergiev", 6, "Light Heavyweight", 7, ZUFFA_BOXING_FIRST_BELL, "upcoming", "fighterB", "favourite"],
  ["f0000028-0028-4000-b000-000000000028", "e0000003-0003-4000-a000-000000000003", "boxing", "Alex Macmillan", "Leo Fanthome", 6, "Welterweight", 8, ZUFFA_BOXING_FIRST_BELL, "upcoming", "fighterA", "favourite"],
  ["f0000009-0009-4000-b000-000000000009", "e0000002-0002-4000-a000-000000000002", "mma", "Belal Muhammad", "Gabriel Bonfim", 5, "Welterweight", 1, UFC_MAIN_CARD_LOCK, "upcoming", "fighterA", "favourite"],
  ["f0000010-0010-4000-b000-000000000010", "e0000002-0002-4000-a000-000000000002", "mma", "Brendan Allen", "Edmen Shahbazyan", 3, "Middleweight", 2, UFC_MAIN_CARD_LOCK, "upcoming", "fighterA", "favourite"],
  ["f0000011-0011-4000-b000-000000000011", "e0000002-0002-4000-a000-000000000002", "mma", "Farès Ziam", "Tom Nolan", 3, "Lightweight", 3, UFC_MAIN_CARD_LOCK, "upcoming", "fighterA", "favourite"],
  ["f0000012-0012-4000-b000-000000000012", "e0000002-0002-4000-a000-000000000002", "mma", "Bryce Mitchell", "Santiago Luna", 3, "Bantamweight", 4, UFC_MAIN_CARD_LOCK, "upcoming", "fighterA", "favourite"],
  ["f0000013-0013-4000-b000-000000000013", "e0000002-0002-4000-a000-000000000002", "mma", "Iwo Baraniewski", "Junior Tafa", 3, "Light Heavyweight", 5, UFC_MAIN_CARD_LOCK, "upcoming", "fighterA", "favourite"],
  ["f0000014-0014-4000-b000-000000000014", "e0000002-0002-4000-a000-000000000002", "mma", "Matt Schnell", "Alessandro Costa", 3, "Catchweight (130 lb)", 6, UFC_PRELIMS_LOCK, "upcoming", "fighterB", "favourite"],
  ["f0000015-0015-4000-b000-000000000015", "e0000002-0002-4000-a000-000000000002", "mma", "Marcus McGhee", "John Yannis", 3, "Bantamweight", 7, UFC_PRELIMS_LOCK, "upcoming", "fighterA", "favourite"],
  ["f0000016-0016-4000-b000-000000000016", "e0000002-0002-4000-a000-000000000002", "mma", "Bruno Gustavo da Silva", "Edgar Chairez", 3, "Flyweight", 8, UFC_PRELIMS_LOCK, "upcoming", "fighterA", "favourite"],
  ["f0000017-0017-4000-b000-000000000017", "e0000002-0002-4000-a000-000000000002", "mma", "Priscila Cachoeira", "Chelsea Chandler", 3, "Women's Bantamweight", 9, UFC_PRELIMS_LOCK, "upcoming", "fighterB", "favourite"],
  ["f0000018-0018-4000-b000-000000000018", "e0000002-0002-4000-a000-000000000002", "mma", "Jordan Leavitt", "Joanderson Brito", 3, "Featherweight", 10, UFC_PRELIMS_LOCK, "upcoming", "fighterB", "favourite"],
  ["f0000019-0019-4000-b000-000000000019", "e0000002-0002-4000-a000-000000000002", "mma", "Jeisla Chaves", "Yuneisy Duben", 3, "Women's Flyweight", 11, UFC_PRELIMS_LOCK, "upcoming", "fighterA", "favourite"],
  ["f0000020-0020-4000-b000-000000000020", "e0000002-0002-4000-a000-000000000002", "mma", "Ketlen Souza", "Ariane Carnelossi", 3, "Women's Strawweight", 12, UFC_PRELIMS_LOCK, "upcoming", "fighterA", "favourite"],
];

const esc = (s) => String(s).replace(/'/g, "''");

let sql = `-- PickFist launch seed — real event/fight cards from app data
-- Run AFTER schema.sql on a blank database

insert into public.events (id, name, promotion, location, timezone, event_date, created_at, updated_at) values
${events
  .map(
    (e) =>
      `  ('${e.map(esc).join("','")}','${CREATED}','${UPDATED}')`
  )
  .join(",\n")}
on conflict (id) do nothing;

insert into public.fights (id, event_id, sport, fighter_a_name, fighter_b_name, scheduled_rounds, weight_class, fight_order, lock_time, status, favourite_side, favourite_level, created_at, updated_at) values
${fights
  .map(
    (f) =>
      `  ('${f.map(esc).join("','")}','${CREATED}','${UPDATED}')`
  )
  .join(",\n")}
on conflict (id) do nothing;
`;

writeFileSync(join(__dirname, "..", "supabase", "seed_launch.sql"), sql);
console.log("Wrote supabase/seed_launch.sql");
