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
