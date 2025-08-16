"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";

export default function NewEventPage() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);

    const res = await fetch("/api/events", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      toast.success("Event created successfully");
      e.target.reset();
    } else {
      toast.error("Failed to create event");
    }
    setLoading(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto space-y-4 p-4 border rounded-lg"
    >
      <Input name="title" placeholder="Event Title" required />
      <Textarea name="description" placeholder="Description" required />
      <Input type="date" name="date" required />
      <Input type="time" name="time" required />
      <Input type="number" name="price" placeholder="Price" required />

      <Select name="status" required>
        <SelectTrigger>
          <SelectValue placeholder="Select Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Upcoming">Upcoming</SelectItem>
          <SelectItem value="Completed">Completed</SelectItem>
        </SelectContent>
      </Select>

      <Input type="file" name="image" accept="image/*" required />

      <Button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Event"}
      </Button>
    </form>
  );
}
