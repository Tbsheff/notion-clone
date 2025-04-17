import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

export const getTasks = query({
  args: {
    status: v.optional(v.string()),
    courseId: v.optional(v.id("courses")),
    priority: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    let tasksQuery = ctx.db
      .query("tasks")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isArchived"), false));

    if (args.status) {
      tasksQuery = ctx.db
        .query("tasks")
        .withIndex("by_user_status", (q) =>
          q.eq("userId", userId).eq("status", args.status as string),
        )
        .filter((q) => q.eq(q.field("isArchived"), false));
    }

    if (args.courseId) {
      tasksQuery = ctx.db
        .query("tasks")
        .withIndex("by_user_course", (q) =>
          q.eq("userId", userId).eq("courseId", args.courseId),
        )
        .filter((q) => q.eq(q.field("isArchived"), false));
    }

    let tasks = await tasksQuery.collect();

    if (args.priority) {
      tasks = tasks.filter((task) => task.priority === args.priority);
    }

    return tasks;
  },
});

export const getTaskById = query({
  args: { taskId: v.id("tasks") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const task = await ctx.db.get(args.taskId);

    if (!task) {
      throw new Error("Task not found");
    }

    if (task.userId !== userId) {
      throw new Error("Unauthorized");
    }

    return task;
  },
});

export const createTask = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    priority: v.string(),
    status: v.string(),
    dueDate: v.optional(v.number()),
    estimatedTime: v.optional(v.number()),
    courseId: v.optional(v.id("courses")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const task = await ctx.db.insert("tasks", {
      title: args.title,
      description: args.description,
      priority: args.priority,
      status: args.status,
      dueDate: args.dueDate,
      estimatedTime: args.estimatedTime,
      courseId: args.courseId,
      userId,
      isArchived: false,
      createdAt: Date.now(),
    });

    return task;
  },
});

export const updateTask = mutation({
  args: {
    id: v.id("tasks"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    priority: v.optional(v.string()),
    status: v.optional(v.string()),
    dueDate: v.optional(v.number()),
    estimatedTime: v.optional(v.number()),
    courseId: v.optional(v.id("courses")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const { id, ...rest } = args;

    const existingTask = await ctx.db.get(args.id);

    if (!existingTask) {
      throw new Error("Task not found");
    }

    if (existingTask.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const task = await ctx.db.patch(args.id, rest);

    return task;
  },
});

export const archiveTask = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const existingTask = await ctx.db.get(args.id);

    if (!existingTask) {
      throw new Error("Task not found");
    }

    if (existingTask.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const task = await ctx.db.patch(args.id, {
      isArchived: true,
    });

    return task;
  },
});

export const deleteTask = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const existingTask = await ctx.db.get(args.id);

    if (!existingTask) {
      throw new Error("Task not found");
    }

    if (existingTask.userId !== userId) {
      throw new Error("Unauthorized");
    }

    await ctx.db.delete(args.id);

    return { success: true };
  },
});
