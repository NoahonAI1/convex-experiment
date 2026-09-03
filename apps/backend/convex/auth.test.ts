import { describe, expect, it } from "vitest";

import authConfig from "./auth.config";

describe("Better Auth configuration", () => {
  it("registers Better Auth as the Convex identity provider", () => {
    expect(authConfig.providers).toHaveLength(1);
  });
});
