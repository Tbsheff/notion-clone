import { useState } from "react";
import { format, isSameDay, isAfter } from "date-fns";
import { cn } from "@/lib/utils";
import EventPopover from "./EventPopover";

const AgendaView = ({ currentDate, events, courses }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Sort events by start time
  const sortedEvents = [...events].sort((a, b) => a.startTime - b.startTime);

  // Group events by date
  const eventsByDate = sortedEvents.reduce((acc, event) => {
    const eventDate = new Date(event.startTime);
    const dateKey = format(eventDate, "yyyy-MM-dd");

    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }

    acc[dateKey].push(event);
    return acc;
  }, {});

  // Get dates with events, starting from current date
  const dates = Object.keys(eventsByDate)
    .map((dateStr) => new Date(dateStr))
    .filter(
      (date) =>
        isAfter(date, new Date(currentDate.setHours(0, 0, 0, 0))) ||
        isSameDay(date, currentDate),
    )
    .sort((a, b) => a - b);

  return (
    <div className="h-full overflow-y-auto p-4">
      {dates.length === 0 ? (
        <div className="text-center text-muted-foreground py-8">
          No upcoming events
        </div>
      ) : (
        dates.map((date) => {
          const dateKey = format(date, "yyyy-MM-dd");
          const dateEvents = eventsByDate[dateKey] || [];

          return (
            <div key={dateKey} className="mb-6">
              <h3 className="font-medium mb-2">
                {format(date, "EEEE, MMMM d, yyyy")}
              </h3>

              <div className="space-y-2">
                {dateEvents.map((event) => {
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
                        "p-3 rounded cursor-pointer border",
                        isTask
                          ? `${isCompleted ? "line-through opacity-50" : ""}`
                          : "",
                        course
                          ? ""
                          : "hover:bg-blue-50 dark:hover:bg-blue-900/20",
                      )}
                      style={
                        course ? { backgroundColor: `${course.color}15` } : {}
                      }
                    >
                      <div className="font-medium">{event.title}</div>

                      {!event.isAllDay && (
                        <div className="text-sm text-muted-foreground">
                          {format(new Date(event.startTime), "h:mm a")} -
                          {format(new Date(event.endTime), "h:mm a")}
                        </div>
                      )}

                      {event.isAllDay && (
                        <div className="text-sm text-muted-foreground">
                          All day
                        </div>
                      )}

                      {course && (
                        <div
                          className="text-xs mt-1 px-2 py-1 rounded inline-block"
                          style={{ backgroundColor: `${course.color}33` }}
                        >
                          {course.name}
                        </div>
                      )}

                      {event.description && (
                        <div className="text-sm mt-1 text-muted-foreground">
                          {event.description}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })
      )}

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

export default AgendaView;
