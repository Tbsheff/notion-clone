import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  documents: defineTable({
    title: v.string(),
    userId: v.string(),
    isArchived: v.boolean(),
    parentDocument: v.optional(v.id("documents")),
    content: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    icon: v.optional(v.string()),
    isPublished: v.boolean(),
  })
    .index("by_user", ["userId"])
    .index("by_user_parent", ["userId", "parentDocument"]),

  tasks: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    userId: v.string(),
    priority: v.string(), // "low", "medium", "high"
    status: v.string(), // "todo", "in_progress", "completed"
    dueDate: v.optional(v.number()), // timestamp
    estimatedTime: v.optional(v.number()), // minutes
    courseId: v.optional(v.id("courses")),
    isArchived: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_status", ["userId", "status"])
    .index("by_user_course", ["userId", "courseId"])
    .index("by_due_date", ["userId", "dueDate"]),

  courses: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    userId: v.string(),
    color: v.string(),
    isArchived: v.boolean(),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  focusSessions: defineTable({
    userId: v.string(),
    startTime: v.number(),
    endTime: v.number(),
    duration: v.number(), // minutes
    taskId: v.optional(v.id("tasks")),
    courseId: v.optional(v.id("courses")),
    notes: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_user_task", ["userId", "taskId"])
    .index("by_user_course", ["userId", "courseId"]),

  goals: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    userId: v.string(),
    targetValue: v.number(),
    currentValue: v.number(),
    unit: v.string(), // "hours", "pages", etc.
    deadline: v.optional(v.number()),
    courseId: v.optional(v.id("courses")),
    isCompleted: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_completed", ["userId", "isCompleted"]),

  calendarEvents: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    userId: v.string(),
    startTime: v.number(),
    endTime: v.number(),
    location: v.optional(v.string()),
    courseId: v.optional(v.id("courses")),
    source: v.string(), // "manual", "google", "canvas", "ics"
    sourceId: v.optional(v.string()), // ID from external source
    isAllDay: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_time_range", ["userId", "startTime"])
    .index("by_source", ["userId", "source", "sourceId"]),
});
