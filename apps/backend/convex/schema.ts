import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  notes: defineTable({
    author: v.string(),
    body: v.string(),
    commentCount: v.number(),
    createdAt: v.number(),
    title: v.string(),
  }).index("by_created_at", ["createdAt"]),
  comments: defineTable({
    author: v.string(),
    body: v.string(),
    createdAt: v.number(),
    noteId: v.id("notes"),
  }).index("by_note_id_and_created_at", ["noteId", "createdAt"]),
});
