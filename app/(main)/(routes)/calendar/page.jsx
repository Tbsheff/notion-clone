"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  parseISO,
} from "date-fns";
import Spinner from "@/components/Spinner";
import CalendarHeader from "@/app/(main)/_components/calendar/CalendarHeader";
import MonthView from "@/app/(main)/_components/calendar/MonthView";
import CreateEventModal from "../../_components/calendar/CreateEventModal";

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("month"); // month, week, day, agenda
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const startDate =
    view === "month"
      ? startOfMonth(currentDate)
      : view === "week"
        ? startOfWeek(currentDate)
        : view === "day"
          ? currentDate
          : startOfMonth(currentDate);

  const endDate =
    view === "month"
      ? endOfMonth(currentDate)
      : view === "week"
        ? endOfWeek(currentDate)
        : view === "day"
          ? currentDate
          : endOfMonth(addMonths(currentDate, 1));

  const events = useQuery(api.calendar.getEvents, {
    startTime: startDate.getTime(),
    endTime: endDate.getTime(),
  });

  const tasks = useQuery(api.tasks.getTasks);
  const courses = useQuery(api.courses.getCourses);

  const handlePrevious = () => {
    if (view === "month") {
      setCurrentDate(subMonths(currentDate, 1));
    } else if (view === "week") {
      setCurrentDate(addDays(currentDate, -7));
    } else if (view === "day") {
      setCurrentDate(addDays(currentDate, -1));
    }
  };

  const handleNext = () => {
    if (view === "month") {
      setCurrentDate(addMonths(currentDate, 1));
    } else if (view === "week") {
      setCurrentDate(addDays(currentDate, 7));
    } else if (view === "day") {
      setCurrentDate(addDays(currentDate, 1));
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Convert tasks with due dates to calendar events
  const taskEvents = tasks
    ? tasks
        .filter((task) => task.dueDate)
        .map((task) => ({
          _id: task._id,
          title: task.title,
          description: task.description,
          startTime: task.dueDate,
          endTime:
            task.dueDate +
            (task.estimatedTime
              ? task.estimatedTime * 60 * 1000
              : 30 * 60 * 1000),
          courseId: task.courseId,
          isAllDay: false,
          isTask: true,
          status: task.status,
          priority: task.priority,
        }))
    : [];

  // Combine calendar events and task events
  const allEvents = [...(events || []), ...taskEvents];

  return (
    <div className="h-full flex flex-col p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Calendar</h1>
          <p className="text-sm text-muted-foreground">
            Manage your schedule and events
          </p>
        </div>
        <div className="flex items-center gap-x-2">
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-x-2"
          >
            <Plus className="h-4 w-4" />
            Add Event
          </Button>
        </div>
      </div>

      <CalendarHeader
        view={view}
        onViewChange={setView}
        currentDate={currentDate}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onToday={handleToday}
      />

      {events === undefined || tasks === undefined || courses === undefined ? (
        <div className="h-full flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="flex-1 overflow-auto">
          {view === "month" && (
            <MonthView
              currentDate={currentDate}
              events={allEvents}
              courses={courses}
            />
          )}
          {view === "week" && (
            <MonthView
              currentDate={currentDate}
              events={allEvents}
              courses={courses}
            />
          )}
          {view === "day" && (
            <MonthView
              currentDate={currentDate}
              events={allEvents}
              courses={courses}
            />
          )}
          {view === "agenda" && (
            <MonthView
              currentDate={currentDate}
              events={allEvents}
              courses={courses}
            />
          )}
        </div>
      )}

      <CreateEventModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        courses={courses || []}
        initialDate={currentDate}
      />
    </div>
  );
};

export default CalendarPage;
