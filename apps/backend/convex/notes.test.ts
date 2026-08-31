import { convexTest } from "convex-test";
import { describe, expect, it } from "vitest";

import { api } from "./_generated/api";
import schema from "./schema";
import { modules } from "./test.setup";

describe("notes and comments", () => {
  it("creates and lists a trimmed note", async () => {
    const t = convexTest(schema, modules);

    await t.mutation(api.notes.create, {
      author: "  Robin  ",
      body: "  A shared thought.  ",
      title: "  First note  ",
    });

    await expect(t.query(api.notes.list)).resolves.toMatchObject([
      {
        author: "Robin",
        body: "A shared thought.",
        commentCount: 0,
        title: "First note",
      },
    ]);
  });

  it("adds comments and updates the note count", async () => {
    const t = convexTest(schema, modules);
    const noteId = await t.mutation(api.notes.create, {
      author: "Robin",
      body: "A shared thought.",
      title: "First note",
    });

    await t.mutation(api.comments.add, {
      author: "Sam",
      body: "  I agree.  ",
      noteId,
    });

    await expect(t.query(api.comments.list, { noteId })).resolves.toMatchObject([
      { author: "Sam", body: "I agree.", noteId },
    ]);
    await expect(t.query(api.notes.list)).resolves.toMatchObject([
      { commentCount: 1 },
    ]);
  });

  it("rejects blank notes and comments", async () => {
    const t = convexTest(schema, modules);

    await expect(
      t.mutation(api.notes.create, {
        author: "Robin",
        body: "   ",
        title: "First note",
      }),
    ).rejects.toThrow("Note is required");
  });
});
