import { ConvexError, v } from "convex/values";

import { mutation, query } from "./_generated/server";

const note = v.object({
  _creationTime: v.number(),
  _id: v.id("notes"),
  author: v.string(),
  body: v.string(),
  commentCount: v.number(),
  createdAt: v.number(),
  title: v.string(),
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
  args: {},
  returns: v.array(note),
  handler: async (ctx) => {
    return await ctx.db
      .query("notes")
      .withIndex("by_created_at")
      .order("desc")
      .take(50);
  },
});

export const create = mutation({
  args: {
    author: v.string(),
    body: v.string(),
    title: v.string(),
  },
  returns: v.id("notes"),
  handler: async (ctx, args) => {
    return await ctx.db.insert("notes", {
      author: requiredText(args.author, "Username", 24),
      body: requiredText(args.body, "Note", 2_000),
      commentCount: 0,
      createdAt: Date.now(),
      title: requiredText(args.title, "Title", 80),
    });
  },
});
