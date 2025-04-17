import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";

const CreateEventModal = ({ isOpen, onClose, courses = [], initialDate }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState(
    format(initialDate || new Date(), "yyyy-MM-dd"),
  );
  const [startTime, setStartTime] = useState("09:00");
  const [endDate, setEndDate] = useState(
    format(initialDate || new Date(), "yyyy-MM-dd"),
  );
  const [endTime, setEndTime] = useState("10:00");
  const [courseId, setCourseId] = useState("");
  const [isAllDay, setIsAllDay] = useState(false);

  const createEvent = useMutation(api.calendar.createEvent);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const startDateTime = new Date(`${startDate}T${startTime}:00`);
    const endDateTime = new Date(`${endDate}T${endTime}:00`);

    await createEvent({
      title,
      description,
      startTime: startDateTime.getTime(),
      endTime: endDateTime.getTime(),
      courseId: courseId || undefined,
      isAllDay,
    });

    resetForm();
    onClose();
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setStartDate(format(new Date(), "yyyy-MM-dd"));
    setStartTime("09:00");
    setEndDate(format(new Date(), "yyyy-MM-dd"));
    setEndTime("10:00");
    setCourseId("");
    setIsAllDay(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Event title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Event description"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isAllDay"
              checked={isAllDay}
              onChange={(e) => setIsAllDay(e.target.checked)}
              className="h-4 w-4"
            />
            <Label htmlFor="isAllDay" className="cursor-pointer">
              All day event
            </Label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>

            {!isAllDay && (
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>

            {!isAllDay && (
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="course">Course (Optional)</Label>
            <select
              id="course"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="">None</option>
              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Create Event</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEventModal;
