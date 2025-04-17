"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CourseList from "../../_components/courses/CourseList";
import CreateCourseModal from "../../_components/courses/CreateCourseModal";
import Spinner from "@/components/Spinner";

const CoursesPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const courses = useQuery(api.courses.getCourses);

  return (
    <div className="h-full flex flex-col p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Courses</h1>
          <p className="text-sm text-muted-foreground">
            Manage your courses and subjects
          </p>
        </div>
        <div className="flex items-center gap-x-2">
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-x-2"
          >
            <Plus className="h-4 w-4" />
            Add Course
          </Button>
        </div>
      </div>

      {courses === undefined ? (
        <div className="h-full flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : (
        <CourseList courses={courses} />
      )}

      <CreateCourseModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};

export default CoursesPage;
