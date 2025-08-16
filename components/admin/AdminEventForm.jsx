"use client";
import { useState } from "react";

export default function AdminEventForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("active");
  const [imageUrl, setImageUrl] = useState("");

  const openCloudinaryWidget = () => {
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          setImageUrl(result.info.secure_url);
        }
      }
    );
    widget.open();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageUrl) {
      alert("Please upload an image first");
      return;
    }
    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        date,
        time,
        price,
        status,
        imageUrl,
      }),
    });

    if (res.ok) {
      alert("Event created successfully!");
      setTitle("");
      setDescription("");
      setDate("");
      setTime("");
      setPrice("");
      setImageUrl("");
    } else {
      alert("Error creating event");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow space-y-4"
    >
      <h2 className="text-2xl font-bold">Create New Event</h2>

      <input
        type="text"
        placeholder="Event Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 border rounded"
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 border rounded"
      />

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full p-2 border rounded"
      />

      <input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        className="w-full p-2 border rounded"
      />

      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="w-full p-2 border rounded"
      />

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="w-full p-2 border rounded"
      >
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>

      <div>
        <button
          type="button"
          onClick={openCloudinaryWidget}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Upload Image
        </button>
        {imageUrl && (
          <img src={imageUrl} alt="Event" className="mt-4 w-full rounded" />
        )}
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-green-500 text-white rounded"
      >
        Save Event
      </button>
    </form>
  );
}
