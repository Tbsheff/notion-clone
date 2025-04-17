import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

export const getEvents = query({
  args: {
    startTime: v.optional(v.number()),
    endTime: v.optional(v.number()),
    courseId: v.optional(v.id("courses")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    let eventsQuery = ctx.db
      .query("calendarEvents")
      .withIndex("by_user", (q) => q.eq("userId", userId));

    if (args.startTime && args.endTime) {
      eventsQuery = ctx.db
        .query("calendarEvents")
        .withIndex("by_time_range", (q) =>
          q.eq("userId", userId).gte("startTime", args.startTime as number),
        )
        .filter((q) => q.lte(q.field("startTime"), args.endTime as number));
    }

    let events = await eventsQuery.collect();

    if (args.courseId) {
      events = events.filter((event) => event.courseId === args.courseId);
    }

    return events;
  },
});

export const createEvent = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    startTime: v.number(),
    endTime: v.number(),
    location: v.optional(v.string()),
    courseId: v.optional(v.id("courses")),
    isAllDay: v.boolean(),
    source: v.string(),
    sourceId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const event = await ctx.db.insert("calendarEvents", {
      title: args.title,
      description: args.description,
      startTime: args.startTime,
      endTime: args.endTime,
      location: args.location,
      courseId: args.courseId,
      isAllDay: args.isAllDay,
      source: args.source,
      sourceId: args.sourceId,
      userId,
      createdAt: Date.now(),
    });

    return event;
  },
});

export const updateEvent = mutation({
  args: {
    id: v.id("calendarEvents"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    startTime: v.optional(v.number()),
    endTime: v.optional(v.number()),
    location: v.optional(v.string()),
    courseId: v.optional(v.id("courses")),
    isAllDay: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const { id, ...rest } = args;

    const existingEvent = await ctx.db.get(args.id);

    if (!existingEvent) {
      throw new Error("Event not found");
    }

    if (existingEvent.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const event = await ctx.db.patch(args.id, rest);

    return event;
  },
});

export const deleteEvent = mutation({
  args: { id: v.id("calendarEvents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const existingEvent = await ctx.db.get(args.id);

    if (!existingEvent) {
      throw new Error("Event not found");
    }

    if (existingEvent.userId !== userId) {
      throw new Error("Unauthorized");
    }

    await ctx.db.delete(args.id);

    return { success: true };
  },
});
