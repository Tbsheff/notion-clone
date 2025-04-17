import { useState } from "react";
import {
  format,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameDay,
  parseISO,
} from "date-fns";
import { cn } from "@/lib/utils";
import EventPopover from "./EventPopover";

const WeekView = ({ currentDate, events, courses }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);

  const startDate = startOfWeek(currentDate);
  const endDate = endOfWeek(startDate);
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const days = [];
  let day = startDate;

  while (day <= endDate) {
    days.push(day);
    day = addDays(day, 1);
  }

  const getEventsForDayAndHour = (day, hour) => {
    return events.filter((event) => {
      const eventStart = new Date(event.startTime);
      const eventEnd = new Date(event.endTime);

      return (
        isSameDay(eventStart, day) &&
        eventStart.getHours() <= hour &&
        eventEnd.getHours() > hour
      );
    });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="grid grid-cols-8 border-b">
        <div className="border-r p-2 text-center font-medium">Time</div>
        {days.map((day) => (
          <div
            key={day.toString()}
            className={cn(
              "p-2 text-center font-medium",
              isSameDay(day, new Date()) && "bg-blue-50 dark:bg-blue-900/20",
            )}
          >
            {format(day, "EEE dd")}
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-8">
          {hours.map((hour) => (
            <>
              <div
                key={`hour-${hour}`}
                className="border-r border-b p-2 text-sm"
              >
                {format(new Date().setHours(hour, 0, 0), "h a")}
              </div>

              {days.map((day) => {
                const dayEvents = getEventsForDayAndHour(day, hour);

                return (
                  <div
                    key={`${day}-${hour}`}
                    className="border-b p-1 relative min-h-[60px]"
                  >
                    {dayEvents.map((event) => {
                      const course = event.courseId
                        ? courses.find((c) => c._id === event.courseId)
                        : null;
                      const isTask = event.isTask;
                      const isCompleted =
                        isTask && event.status === "completed";

                      return (
                        <div
                          key={event._id}
                          onClick={() => setSelectedEvent(event)}
                          className={cn(
                            "text-xs p-1 rounded truncate cursor-pointer mb-1",
                            isTask
                              ? `${isCompleted ? "line-through opacity-50" : ""}`
                              : "",
                            course ? "" : "bg-blue-100 dark:bg-blue-800",
                          )}
                          style={
                            course
                              ? { backgroundColor: `${course.color}33` }
                              : {}
                          }
                        >
                          {event.title}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </>
          ))}
        </div>
      </div>

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

export default WeekView;
