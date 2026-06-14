import { afterEach, describe, expect, it, vi } from "vitest";

describe("usesLiveSupabase", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("returns false in development when Supabase env is set but override is off", async () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://test.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon-key");
    vi.stubEnv("PICKFIST_USE_SUPABASE", "");
    const { usesLiveSupabase } = await import("./config");
    expect(usesLiveSupabase()).toBe(false);
  });

  it("returns true in development when PICKFIST_USE_SUPABASE is true", async () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://test.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon-key");
    vi.stubEnv("PICKFIST_USE_SUPABASE", "true");
    const { usesLiveSupabase } = await import("./config");
    expect(usesLiveSupabase()).toBe(true);
  });

  it("returns true in production when Supabase env is set", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://test.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon-key");
    const { usesLiveSupabase } = await import("./config");
    expect(usesLiveSupabase()).toBe(true);
  });
});

describe("seedRankingsEnabled", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("returns true when PICKFIST_SEED_RANKINGS is true", async () => {
    vi.stubEnv("PICKFIST_SEED_RANKINGS", "true");
    const { seedRankingsEnabled } = await import("./config");
    expect(seedRankingsEnabled()).toBe(true);
  });

  it("returns false when PICKFIST_SEED_RANKINGS is false", async () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("PICKFIST_SEED_RANKINGS", "false");
    const { seedRankingsEnabled } = await import("./config");
    expect(seedRankingsEnabled()).toBe(false);
  });

  it("returns true in local mock dev when unset", async () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "");
    vi.stubEnv("PICKFIST_USE_SUPABASE", "");
    delete process.env.PICKFIST_SEED_RANKINGS;
    const { seedRankingsEnabled } = await import("./config");
    expect(seedRankingsEnabled()).toBe(true);
  });

  it("returns false in production when unset", async () => {
    vi.stubEnv("NODE_ENV", "production");
    delete process.env.PICKFIST_SEED_RANKINGS;
    const { seedRankingsEnabled } = await import("./config");
    expect(seedRankingsEnabled()).toBe(false);
  });
});
