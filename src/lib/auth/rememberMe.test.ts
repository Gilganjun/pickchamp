import { describe, expect, it } from "vitest";
import {
  getAuthCookieOptions,
  parseRememberMe,
  parseRememberMeParam,
  STAY_SIGNED_IN_MAX_AGE_SECONDS,
} from "@/lib/auth/rememberMe";

describe("rememberMe", () => {
  it("parses stay signed in from form data", () => {
    const on = new FormData();
    on.set("rememberMe", "on");
    expect(parseRememberMe(on)).toBe(true);

    const off = new FormData();
    expect(parseRememberMe(off)).toBe(false);
  });

  it("parses remember query param", () => {
    expect(parseRememberMeParam(null)).toBe(true);
    expect(parseRememberMeParam("1")).toBe(true);
    expect(parseRememberMeParam("0")).toBe(false);
  });

  it("uses long-lived cookies when stay signed in is enabled", () => {
    expect(getAuthCookieOptions(true).maxAge).toBe(
      STAY_SIGNED_IN_MAX_AGE_SECONDS
    );
    expect(getAuthCookieOptions(false).maxAge).toBeUndefined();
  });
});
