/// <reference types="bun" />

import { describe, expect, it } from "bun:test";

import authConfig from "./auth.config";

describe("Better Auth configuration", () => {
  it("registers Better Auth as the Convex identity provider", () => {
    expect(authConfig.providers).toHaveLength(1);
  });
});
