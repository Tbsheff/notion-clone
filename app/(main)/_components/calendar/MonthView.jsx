import { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
} from "date-fns";
import { cn } from "@/lib/utils";
import EventPopover from "./EventPopover";

const MonthView = ({ currentDate, events, courses }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const rows = [];
  let days = [];
  let day = startDate;

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      const cloneDay = day;
      const dayEvents = events.filter((event) => {
        const eventDate = new Date(event.startTime);
        return isSameDay(eventDate, cloneDay);
      });

      days.push(
        <div
          key={day.toString()}
          className={cn(
            "border h-32 p-1 overflow-y-auto",
            !isSameMonth(day, monthStart) &&
              "bg-muted/30 text-muted-foreground",
            isSameDay(day, new Date()) && "bg-blue-50 dark:bg-blue-900/20",
          )}
        >
          <div className="font-medium text-sm mb-1">{format(day, "d")}</div>
          <div className="space-y-1">
            {dayEvents.slice(0, 3).map((event) => {
              const course = event.courseId
                ? courses.find((c) => c._id === event.courseId)
                : null;
              const isTask = event.isTask;
              const isCompleted = isTask && event.status === "completed";

              return (
                <div
                  key={event._id}
                  onClick={() => setSelectedEvent(event)}
                  className={cn(
                    "text-xs p-1 rounded truncate cursor-pointer",
                    isTask
                      ? `bg-opacity-70 ${isCompleted ? "line-through opacity-50" : ""}`
                      : "bg-opacity-70",
                    course ? "" : "bg-blue-100 dark:bg-blue-800",
                  )}
                  style={course ? { backgroundColor: `${course.color}33` } : {}}
                >
                  {event.title}
                </div>
              );
            })}
            {dayEvents.length > 3 && (
              <div className="text-xs text-muted-foreground">
                +{dayEvents.length - 3} more
              </div>
            )}
          </div>
        </div>,
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div key={day.toString()} className="grid grid-cols-7">
        {days}
      </div>,
    );
    days = [];
  }

  return (
    <div className="h-full flex flex-col">
      <div className="grid grid-cols-7 text-sm font-medium py-2">
        <div className="text-center">Sun</div>
        <div className="text-center">Mon</div>
        <div className="text-center">Tue</div>
        <div className="text-center">Wed</div>
        <div className="text-center">Thu</div>
        <div className="text-center">Fri</div>
        <div className="text-center">Sat</div>
      </div>
      <div className="flex-1 overflow-y-auto">{rows}</div>

      {selectedEvent && (
        <EventPopover
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          courses={courses}
        />
      )}
    </div>
  );
};

export default MonthView;
