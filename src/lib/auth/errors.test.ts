import { describe, expect, it } from "vitest";
import { getAuthErrorMessage } from "./errors";

describe("getAuthErrorMessage", () => {
  it("maps known OAuth error codes", () => {
    expect(getAuthErrorMessage("auth_callback_failed")).toContain(
      "could not be completed"
    );
    expect(getAuthErrorMessage("oauth_cancelled")).toContain("cancelled");
  });

  it("decodes custom encoded messages", () => {
    expect(getAuthErrorMessage(encodeURIComponent("Username is already taken."))).toBe(
      "Username is already taken."
    );
  });
});
