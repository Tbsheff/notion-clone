"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { format } from "date-fns";
import { CheckCircle2, Circle, Clock, Edit, Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import EditTaskModal from "./EditTaskModal";

const TaskList = ({ tasks, courses }) => {
  const router = useRouter();
  const [editingTask, setEditingTask] = useState(null);

  const updateTask = useMutation(api.tasks.updateTask);
  const deleteTask = useMutation(api.tasks.deleteTask);

  const handleStatusChange = (taskId, newStatus) => {
    const promise = updateTask({
      id: taskId,
      status: newStatus,
    });

    toast.promise(promise, {
      loading: "Updating task...",
      success: "Task updated!",
      error: "Failed to update task.",
    });
  };

  const handleDelete = (taskId) => {
    const promise = deleteTask({
      id: taskId,
    });

    toast.promise(promise, {
      loading: "Deleting task...",
      success: "Task deleted!",
      error: "Failed to delete task.",
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-500";
      case "medium":
        return "text-yellow-500";
      case "low":
        return "text-green-500";
      default:
        return "";
    }
  };

  const getCourseColor = (courseId) => {
    if (!courseId) return "";
    const course = courses.find((c) => c._id === courseId);
    return course ? course.color : "";
  };

  const getCourseById = (courseId) => {
    if (!courseId) return null;
    return courses.find((c) => c._id === courseId);
  };

  if (tasks.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <p className="text-muted-foreground text-sm">No tasks found</p>
        <p className="text-muted-foreground text-xs mt-1">
          Create a new task to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => {
        const course = getCourseById(task.courseId);
        const isCompleted = task.status === "completed";

        return (
          <div
            key={task._id}
            className={cn(
              "p-4 rounded-lg border flex items-start gap-x-3 transition-colors",
              isCompleted ? "bg-muted/40" : "bg-background",
            )}
          >
            <div
              className="cursor-pointer mt-1"
              onClick={() =>
                handleStatusChange(task._id, isCompleted ? "todo" : "completed")
              }
            >
              {isCompleted ? (
                <CheckCircle2 className="h-5 w-5 text-blue-500" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground" />
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-x-2">
                <h3
                  className={cn(
                    "font-medium",
                    isCompleted && "line-through text-muted-foreground",
                  )}
                >
                  {task.title}
                </h3>
                {course && (
                  <div
                    className="px-2 py-1 rounded-full text-xs"
                    style={{ backgroundColor: course.color + "33" }} // Adding transparency
                  >
                    {course.name}
                  </div>
                )}
                <div
                  className={cn(
                    "text-xs px-2 py-1 rounded-full",
                    getPriorityColor(task.priority),
                  )}
                >
                  {task.priority}
                </div>
              </div>

              {task.description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {task.description}
                </p>
              )}

              <div className="flex items-center gap-x-4 mt-2">
                {task.dueDate && (
                  <div className="flex items-center gap-x-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {format(new Date(task.dueDate), "MMM d, yyyy h:mm a")}
                  </div>
                )}
                {task.estimatedTime && (
                  <div className="text-xs text-muted-foreground">
                    Est: {task.estimatedTime} min
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-x-2">
              <Button
                onClick={() => setEditingTask(task)}
                variant="ghost"
                size="sm"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => handleDelete(task._id)}
                variant="ghost"
                size="sm"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      })}

      {editingTask && (
        <EditTaskModal
          task={editingTask}
          courses={courses}
          isOpen={!!editingTask}
          onClose={() => setEditingTask(null)}
        />
      )}
    </div>
  );
};

export default TaskList;
