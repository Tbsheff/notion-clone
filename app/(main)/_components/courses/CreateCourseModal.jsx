"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const COURSE_COLORS = [
  "#FF5733", // Red
  "#FFC300", // Yellow
  "#36D7B7", // Teal
  "#3498DB", // Blue
  "#9B59B6", // Purple
  "#1ABC9C", // Green
  "#F39C12", // Orange
  "#8E44AD", // Violet
  "#2ECC71", // Emerald
  "#E74C3C", // Crimson
];

const CreateCourseModal = ({ isOpen, onClose }) => {
  const createCourse = useMutation(api.courses.createCourse);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState(COURSE_COLORS[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) return;

    setIsSubmitting(true);

    const promise = createCourse({
      name,
      description: description || undefined,
      color,
    });

    toast.promise(promise, {
      loading: "Creating course...",
      success: "Course created!",
      error: "Failed to create course.",
    });

    promise
      .then(() => {
        resetForm();
        onClose();
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setColor(COURSE_COLORS[0]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Course</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Course Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Mathematics 101"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Course description"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex flex-wrap gap-2">
              {COURSE_COLORS.map((colorOption) => (
                <div
                  key={colorOption}
                  onClick={() => setColor(colorOption)}
                  className={`w-8 h-8 rounded-full cursor-pointer transition-all ${color === colorOption ? "ring-2 ring-offset-2 ring-black dark:ring-white" : ""}`}
                  style={{ backgroundColor: colorOption }}
                />
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !name}>
              Create Course
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCourseModal;
