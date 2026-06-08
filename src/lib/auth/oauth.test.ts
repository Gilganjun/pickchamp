import { describe, expect, it } from "vitest";
import { buildOAuthCallbackUrl } from "./oauth";

describe("buildOAuthCallbackUrl", () => {
  it("includes flow and next destination", () => {
    expect(buildOAuthCallbackUrl("https://pickfist.com", "signup", "/picks")).toBe(
      "https://pickfist.com/auth/callback?flow=signup&next=%2Fpicks"
    );
    expect(buildOAuthCallbackUrl("http://localhost:3000", "login")).toBe(
      "http://localhost:3000/auth/callback?flow=login&next=%2Fpicks"
    );
  });

  it("includes pending username for signup OAuth", () => {
    expect(
      buildOAuthCallbackUrl("https://pickfist.com", "signup", "/picks", "gorguruga")
    ).toBe(
      "https://pickfist.com/auth/callback?flow=signup&next=%2Fpicks&pending_username=gorguruga"
    );
  });

  it("marks session-only OAuth when stay signed in is disabled", () => {
    expect(
      buildOAuthCallbackUrl(
        "https://pickfist.com",
        "login",
        "/picks",
        undefined,
        false
      )
    ).toBe(
      "https://pickfist.com/auth/callback?flow=login&next=%2Fpicks&remember=0"
    );
  });
});
