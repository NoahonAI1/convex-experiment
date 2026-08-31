import { ConvexError, v } from "convex/values";

import { mutation, query } from "./_generated/server";

const comment = v.object({
  _creationTime: v.number(),
  _id: v.id("comments"),
  author: v.string(),
  body: v.string(),
  createdAt: v.number(),
  noteId: v.id("notes"),
});

function requiredText(value: string, field: string, maxLength: number) {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new ConvexError(`${field} is required`);
  }
  if (trimmed.length > maxLength) {
    throw new ConvexError(`${field} must be ${maxLength} characters or fewer`);
  }
  return trimmed;
}

export const list = query({
  args: { noteId: v.id("notes") },
  returns: v.array(comment),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("comments")
      .withIndex("by_note_id_and_created_at", (q) => q.eq("noteId", args.noteId))
      .order("asc")
      .take(200);
  },
});

export const add = mutation({
  args: {
    author: v.string(),
    body: v.string(),
    noteId: v.id("notes"),
  },
  returns: v.id("comments"),
  handler: async (ctx, args) => {
    const note = await ctx.db.get(args.noteId);
    if (!note) {
      throw new ConvexError("Note not found");
    }

    const commentId = await ctx.db.insert("comments", {
      author: requiredText(args.author, "Username", 24),
      body: requiredText(args.body, "Comment", 500),
      createdAt: Date.now(),
      noteId: args.noteId,
    });
    await ctx.db.patch(note._id, { commentCount: note.commentCount + 1 });
    return commentId;
  },
});
