"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Plus, Filter } from "lucide-react";
import TaskList from "../../_components/tasks/TaskList";
import TaskFilters from "../../_components/tasks/TaskFilters";
import CreateTaskModal from "../../_components/tasks/CreateTaskModal";
import Spinner from "@/components/Spinner";

const TasksPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: undefined,
    priority: undefined,
    courseId: undefined,
  });

  const tasks = useQuery(api.tasks.getTasks, filters);
  const courses = useQuery(api.courses.getCourses);

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  return (
    <div className="h-full flex flex-col p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Tasks</h1>
          <p className="text-sm text-muted-foreground">
            Manage your tasks and assignments
          </p>
        </div>
        <div className="flex items-center gap-x-2">
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-x-2"
          >
            <Plus className="h-4 w-4" />
            Add Task
          </Button>
        </div>
      </div>

      <TaskFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        courses={courses || []}
      />

      {tasks === undefined ? (
        <div className="h-full flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : (
        <TaskList tasks={tasks} courses={courses || []} />
      )}

      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        courses={courses || []}
      />
    </div>
  );
};

export default TasksPage;
