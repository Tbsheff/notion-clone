"use client";

import { useState } from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const TaskFilters = ({ filters, onFilterChange, courses }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleStatusChange = (value) => {
    onFilterChange({ status: value === "all" ? undefined : value });
  };

  const handlePriorityChange = (value) => {
    onFilterChange({ priority: value === "all" ? undefined : value });
  };

  const handleCourseChange = (value) => {
    onFilterChange({ courseId: value === "all" ? undefined : value });
  };

  const clearFilters = () => {
    onFilterChange({
      status: undefined,
      priority: undefined,
      courseId: undefined,
    });
    setIsOpen(false);
  };

  return (
    <div className="flex items-center gap-x-2 mb-6">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="flex items-center gap-x-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="start">
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Status</h4>
              <Select
                value={filters.status || "all"}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-sm">Priority</h4>
              <Select
                value={filters.priority || "all"}
                onValueChange={handlePriorityChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All priorities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All priorities</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-sm">Course</h4>
              <Select
                value={filters.courseId || "all"}
                onValueChange={handleCourseChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All courses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All courses</SelectItem>
                  {courses.map((course) => (
                    <SelectItem key={course._id} value={course._id}>
                      {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button onClick={clearFilters} variant="outline" className="w-full">
              Clear filters
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {(filters.status || filters.priority || filters.courseId) && (
        <Button
          onClick={clearFilters}
          variant="ghost"
          className="text-xs text-muted-foreground"
        >
          Clear filters
        </Button>
      )}
    </div>
  );
};

export default TaskFilters;
