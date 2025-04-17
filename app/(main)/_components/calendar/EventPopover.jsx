import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

const EventPopover = ({ event, onClose, courses }) => {
  const deleteEvent = useMutation(api.calendar.deleteEvent);
  const deleteTask = useMutation(api.tasks.deleteTask);

  const course = event.courseId
    ? courses.find((c) => c._id === event.courseId)
    : null;

  const handleDelete = async () => {
    if (event.isTask) {
      await deleteTask({ id: event._id });
    } else {
      await deleteEvent({ id: event._id });
    }
    onClose();
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return format(date, "h:mm a");
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return format(date, "MMMM d, yyyy");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold">{event.title}</h3>
          <Button variant="ghost" size="sm" onClick={handleDelete}>
            <Trash className="h-4 w-4 text-red-500" />
          </Button>
        </div>

        {course && (
          <div
            className="text-sm mb-2 px-2 py-1 rounded inline-block"
            style={{ backgroundColor: `${course.color}33` }}
          >
            {course.name}
          </div>
        )}

        <div className="text-sm mb-2">
          {formatDate(event.startTime)}
          {!event.isAllDay && (
            <span>
              {" "}
              • {formatTime(event.startTime)} - {formatTime(event.endTime)}
            </span>
          )}
          {event.isAllDay && <span> • All day</span>}
        </div>

        {event.description && (
          <div className="text-sm mt-2">{event.description}</div>
        )}

        {event.isTask && (
          <div className="mt-2 text-sm">
            <div>Status: {event.status}</div>
            {event.priority && <div>Priority: {event.priority}</div>}
          </div>
        )}

        <div className="mt-4 flex justify-end">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EventPopover;
