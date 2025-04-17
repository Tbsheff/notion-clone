"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { BookOpen, Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import EditCourseModal from "./EditCourseModal";

const CourseList = ({ courses }) => {
  const router = useRouter();
  const [editingCourse, setEditingCourse] = useState(null);

  const deleteCourse = useMutation(api.courses.deleteCourse);
  const tasks = useQuery(api.tasks.getTasks);

  const handleDelete = (courseId) => {
    // Check if there are tasks associated with this course
    const courseTasks =
      tasks?.filter((task) => task.courseId === courseId) || [];

    if (courseTasks.length > 0) {
      toast.error(
        `Cannot delete course with ${courseTasks.length} associated tasks. Please reassign or delete these tasks first.`,
      );
      return;
    }

    const promise = deleteCourse({
      id: courseId,
    });

    toast.promise(promise, {
      loading: "Deleting course...",
      success: "Course deleted!",
      error: "Failed to delete course.",
    });
  };

  const getTaskCount = (courseId) => {
    if (!tasks) return 0;
    return tasks.filter((task) => task.courseId === courseId).length;
  };

  if (courses.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <p className="text-muted-foreground text-sm">No courses found</p>
        <p className="text-muted-foreground text-xs mt-1">
          Create a new course to get started
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {courses.map((course) => {
        const taskCount = getTaskCount(course._id);

        return (
          <div
            key={course._id}
            className="p-4 rounded-lg border bg-background hover:shadow-md transition-shadow"
            style={{ borderLeft: `4px solid ${course.color}` }}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium text-lg">{course.name}</h3>
                {course.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {course.description}
                  </p>
                )}
                <div className="flex items-center gap-x-2 mt-4">
                  <div className="flex items-center gap-x-1 text-sm text-muted-foreground">
                    <BookOpen className="h-4 w-4" />
                    {taskCount} {taskCount === 1 ? "task" : "tasks"}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-x-2">
                <Button
                  onClick={() => setEditingCourse(course)}
                  variant="ghost"
                  size="sm"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => handleDelete(course._id)}
                  variant="ghost"
                  size="sm"
                  disabled={taskCount > 0}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="mt-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push(`/tasks?courseId=${course._id}`)}
              >
                View Tasks
              </Button>
            </div>
          </div>
        );
      })}

      {editingCourse && (
        <EditCourseModal
          course={editingCourse}
          isOpen={!!editingCourse}
          onClose={() => setEditingCourse(null)}
        />
      )}
    </div>
  );
};

export default CourseList;
