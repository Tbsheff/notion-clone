import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

export const getCourses = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const courses = await ctx.db
      .query("courses")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isArchived"), false))
      .collect();

    return courses;
  },
});

export const getCourseById = query({
  args: { courseId: v.id("courses") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const course = await ctx.db.get(args.courseId);

    if (!course) {
      throw new Error("Course not found");
    }

    if (course.userId !== userId) {
      throw new Error("Unauthorized");
    }

    return course;
  },
});

export const createCourse = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    color: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const course = await ctx.db.insert("courses", {
      name: args.name,
      description: args.description,
      color: args.color,
      userId,
      isArchived: false,
      createdAt: Date.now(),
    });

    return course;
  },
});

export const updateCourse = mutation({
  args: {
    id: v.id("courses"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    color: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const { id, ...rest } = args;

    const existingCourse = await ctx.db.get(args.id);

    if (!existingCourse) {
      throw new Error("Course not found");
    }

    if (existingCourse.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const course = await ctx.db.patch(args.id, rest);

    return course;
  },
});

export const archiveCourse = mutation({
  args: { id: v.id("courses") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const existingCourse = await ctx.db.get(args.id);

    if (!existingCourse) {
      throw new Error("Course not found");
    }

    if (existingCourse.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const course = await ctx.db.patch(args.id, {
      isArchived: true,
    });

    return course;
  },
});

export const deleteCourse = mutation({
  args: { id: v.id("courses") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const existingCourse = await ctx.db.get(args.id);

    if (!existingCourse) {
      throw new Error("Course not found");
    }

    if (existingCourse.userId !== userId) {
      throw new Error("Unauthorized");
    }

    await ctx.db.delete(args.id);

    return { success: true };
  },
});
