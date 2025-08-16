"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";

export default function EventForm({ event, onSuccess }) {
  const [form, setForm] = useState(
    event || {
      title: "",
      description: "",
      date: "",
      time: "",
      price: "",
      status: "Upcoming",
      image: "",
    }
  );

  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const uploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
    );

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    setForm({ ...form, image: data.secure_url });
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = event ? "PUT" : "POST";
    const url = event ? `/api/events/${event._id}` : "/api/events";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      toast.success(event ? "Event updated" : "Event created");
      onSuccess();
    } else {
      toast.error("Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <Label>Title</Label>
        <Input
          name="title"
          value={form.title}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label>Description</Label>
        <Input
          name="description"
          value={form.description}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label>Date</Label>
        <Input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label>Time</Label>
        <Input
          type="time"
          name="time"
          value={form.time}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label>Price</Label>
        <Input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label>Status</Label>
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full border rounded p-2"
        >
          <option>Upcoming</option>
          <option>Completed</option>
        </select>
      </div>
      <div>
        <Label>Image</Label>
        <Input type="file" onChange={uploadImage} />
        {uploading && <p>Uploading...</p>}
        {form.image && (
          <img
            src={form.image}
            alt="Preview"
            className="mt-2 w-32 h-32 object-cover"
          />
        )}
      </div>
      <Button type="submit">{event ? "Update Event" : "Create Event"}</Button>
    </form>
  );
}
