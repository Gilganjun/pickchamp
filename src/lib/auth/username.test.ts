import { describe, expect, it } from "vitest";
import {
  normalizeUsername,
  profileNeedsUsernameOnboarding,
  sanitizeEmailUsernameCandidate,
  validateUsername,
} from "./username";

describe("validateUsername", () => {
  it("accepts valid usernames", () => {
    expect(validateUsername("gorguruga")).toBeNull();
    expect(validateUsername("User_12")).toBeNull();
  });

  it("rejects invalid usernames", () => {
    expect(validateUsername("ab")).not.toBeNull();
    expect(validateUsername("bad-name")).not.toBeNull();
  });
});

describe("normalizeUsername", () => {
  it("lowercases and trims", () => {
    expect(normalizeUsername("  GorGuruga ")).toBe("gorguruga");
  });
});

describe("sanitizeEmailUsernameCandidate", () => {
  it("sanitizes email local-part for trigger fallback comparison", () => {
    expect(sanitizeEmailUsernameCandidate("John.Doe+1@example.com")).toBe(
      "johndoe1"
    );
  });
});

describe("profileNeedsUsernameOnboarding", () => {
  it("returns false when metadata username is set", () => {
    expect(
      profileNeedsUsernameOnboarding(
        {
          email: "john@gmail.com",
          user_metadata: { username: "pickfist_john" },
        },
        { username: "john" }
      )
    ).toBe(false);
  });

  it("returns false when profile_complete is true", () => {
    expect(
      profileNeedsUsernameOnboarding(
        {
          email: "john@gmail.com",
          user_metadata: { profile_complete: true },
        },
        { username: "john" }
      )
    ).toBe(false);
  });

  it("returns true for auto-generated email-prefix usernames", () => {
    expect(
      profileNeedsUsernameOnboarding(
        {
          email: "john.doe@gmail.com",
          user_metadata: { oauth_flow: "login" },
        },
        { username: "johndoe" }
      )
    ).toBe(true);
  });

  it("returns false when user already chose a distinct username", () => {
    expect(
      profileNeedsUsernameOnboarding(
        {
          email: "john@gmail.com",
          user_metadata: {},
        },
        { username: "sharpfan_99" }
      )
    ).toBe(false);
  });
});
