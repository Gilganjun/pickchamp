import { createClient } from "@/lib/supabase/server";
import {
  joinFightsWithRelations,
  mapEvent,
  mapFight,
  mapFightResult,
  mapPrediction,
  mapProfile,
} from "@/lib/supabase/mappers";
import type {
  Event,
  Fight,
  FightResult,
  FightWithRelations,
  Prediction,
  Profile,
} from "@/types";

function throwQueryError(table: string, error: { message: string }) {
  throw new Error(`Supabase ${table} query failed: ${error.message}`);
}

export async function fetchAllProfiles(): Promise<Profile[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("profiles").select("*");
  if (error) throwQueryError("profiles", error);
  return (data ?? []).map((row) => mapProfile(row));
}

export async function fetchProfileById(id: string): Promise<Profile | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throwQueryError("profiles", error);
  return data ? mapProfile(data) : null;
}

export async function fetchProfileByUsername(
  username: string
): Promise<Profile | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username.toLowerCase())
    .maybeSingle();
  if (error) throwQueryError("profiles", error);
  return data ? mapProfile(data) : null;
}

export async function fetchAllEvents(): Promise<Event[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("events").select("*");
  if (error) throwQueryError("events", error);
  return (data ?? []).map((row) => mapEvent(row));
}

export async function fetchAllFights(): Promise<Fight[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("fights").select("*");
  if (error) throwQueryError("fights", error);
  return (data ?? []).map((row) => mapFight(row));
}

export async function fetchFightsByIds(fightIds: string[]): Promise<Fight[]> {
  if (fightIds.length === 0) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("fights")
    .select("*")
    .in("id", fightIds);
  if (error) throwQueryError("fights", error);
  return (data ?? []).map((row) => mapFight(row));
}

export async function fetchAllFightResults(): Promise<FightResult[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("fight_results").select("*");
  if (error) throwQueryError("fight_results", error);
  return (data ?? []).map((row) => mapFightResult(row));
}

export async function fetchPredictionsForUser(
  userId: string
): Promise<Prediction[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("predictions")
    .select("*")
    .eq("user_id", userId);
  if (error) throwQueryError("predictions", error);
  return (data ?? []).map((row) => mapPrediction(row));
}

export async function fetchFightWithRelations(
  userId?: string
): Promise<FightWithRelations[]> {
  const [events, fights, results, predictions] = await Promise.all([
    fetchAllEvents(),
    fetchAllFights(),
    fetchAllFightResults(),
    userId ? fetchPredictionsForUser(userId) : Promise.resolve([]),
  ]);

  return joinFightsWithRelations(fights, events, results, predictions);
}
