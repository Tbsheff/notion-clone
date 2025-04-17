import { useState } from "react";
import { format, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";
import EventPopover from "./EventPopover";

const DayView = ({ currentDate, events, courses }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getEventsForHour = (hour) => {
    return events.filter((event) => {
      const eventStart = new Date(event.startTime);
      const eventEnd = new Date(event.endTime);

      return (
        isSameDay(eventStart, currentDate) &&
        eventStart.getHours() <= hour &&
        eventEnd.getHours() > hour
      );
    });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="text-center font-medium py-2">
        {format(currentDate, "EEEE, MMMM d, yyyy")}
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1">
          {hours.map((hour) => {
            const hourEvents = getEventsForHour(hour);

            return (
              <div key={`hour-${hour}`} className="border-b flex">
                <div className="w-20 p-2 text-sm border-r">
                  {format(new Date().setHours(hour, 0, 0), "h a")}
                </div>

                <div className="flex-1 p-1 min-h-[60px]">
                  {hourEvents.map((event) => {
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
                          "text-xs p-2 rounded truncate cursor-pointer mb-1",
                          isTask
                            ? `${isCompleted ? "line-through opacity-50" : ""}`
                            : "",
                          course ? "" : "bg-blue-100 dark:bg-blue-800",
                        )}
                        style={
                          course ? { backgroundColor: `${course.color}33` } : {}
                        }
                      >
                        <div className="font-medium">{event.title}</div>
                        <div>
                          {format(new Date(event.startTime), "h:mm a")} -
                          {format(new Date(event.endTime), "h:mm a")}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
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

export default DayView;
