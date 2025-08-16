"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    id: "",
    title: "",
    description: "",
    date: "",
    time: "",
    price: "",
    status: "Upcoming",
    imageUrl: "",
  });
  const [editing, setEditing] = useState(false);

  async function fetchEvents() {
    setLoading(true);
    try {
      const res = await axios.get("/api/admin/events");
      setEvents(res.data);
    } catch (err) {
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchEvents();
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.title || !form.description || !form.date || !form.time || !form.price) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      if (editing) {
        // Update event
        await axios.put("/api/admin/events", form);
        toast.success("Event updated");
      } else {
        // Create new event
        await axios.post("/api/admin/events", form);
        toast.success("Event created");
      }
      setForm({
        id: "",
        title: "",
        description: "",
        date: "",
        time: "",
        price: "",
        status: "Upcoming",
        imageUrl: "",
      });
      setEditing(false);
      fetchEvents();
    } catch {
      toast.error("Failed to save event");
    }
  }

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      await axios.delete("/api/admin/events", { data: { id } });
      toast.success("Event deleted");
      fetchEvents();
    } catch {
      toast.error("Failed to delete event");
    }
  }

  function handleEdit(event) {
    setForm({
      id: event._id,
      title: event.title,
      description: event.description,
      date: event.date.split("T")[0], // YYYY-MM-DD for input date
      time: event.time,
      price: event.price,
      status: event.status,
      imageUrl: event.imageUrl,
    });
    setEditing(true);
  }

  return (
    <div className="max-w-5xl  border  mx-auto p-3">
  
      <h4 className="font-bold ml-3">Manage Events</h4>

      {/* Event Form */}
      <form
        onSubmit={handleSubmit}
        className="mb-0 space-y-4 mt-6 ml-5 bg-white p-3  border"
      >
        <h6 className="text-xl mb-20 font-semibold">
          {editing ? "Edit Event" : "Create New Event"}
        </h6>

        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          className="w-full border rounded px-3 mt-2 mb-2 py-2"
          required
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full border rounded px-3 py-2"
          rows="3"
          required
        />

        <div className="flex gap-x-2 mb-2">
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="border rounded px-3 py-2 flex-1"
            required
          />
          <input
            type="text"
            name="time"
            value={form.time}
            onChange={handleChange}
            placeholder="Time (e.g., 18:00 or 6:00 PM)"
            className="border rounded px-3 py-2 flex-1"
            required
          />
        </div>
<div className="flex gap-2 flex-col">
        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          className="w-full border rounded px-3 py-2"
          min="0"
          required
        />

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full border rounded px-3  py-2"
          required
        >
          <option value="Upcoming">Upcoming</option>
          <option value="Ongoing">Ongoing</option>
          <option value="Completed">Completed</option>
        </select>

        <input
          type="text"
          name="imageUrl"
          value={form.imageUrl}
          onChange={handleChange}
          placeholder="Image URL (Cloudinary)"
          className="w-full border rounded px-3 py-2"
        />

</div>

        <button
          type="submit"
          className="bg-dark text-white py-2 w-full   hover:bg-white border transition font-bold"
        >
          {editing ? "Update Event" : "Create Event"}
        </button>
      </form>

      {/* Events List */}
      {/* Events List */}
      {loading ? (
        <p>Loading events...</p>
      ) : (
        <div className="overflow-x-auto ml-5 mt-3">
          <table className="min-w-full border-collapse border border-gray-300 text-sm sm:text-base">
            <thead>
              <tr>
                <th className="border border-gray-300 px-2 sm:px-3 py-1">
                  Title
                </th>
                <th className="border border-gray-300 px-2 sm:px-3 py-1">
                  Date
                </th>
                <th className="border border-gray-300 px-2 sm:px-3 py-1">
                  Time
                </th>
                <th className="border border-gray-300 px-2 sm:px-3 py-1">
                  Price
                </th>
                <th className="border border-gray-300 px-2 sm:px-3 py-1">
                  Status
                </th>
                <th className="border border-gray-300 px-2 sm:px-3 py-1">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {events.map((evt) => (
                <tr key={evt._id}>
                  <td className="border border-gray-300 px-2 sm:px-3 py-1">
                    {evt.title}
                  </td>
                  <td className="border border-gray-300 px-2 sm:px-3 py-1">
                    {new Date(evt.date).toLocaleDateString()}
                  </td>
                  <td className="border border-gray-300 px-2 sm:px-3 py-1">
                    {evt.time}
                  </td>
                  <td className="border border-gray-300 px-2 sm:px-3 py-1">
                    ₦{evt.price}
                  </td>
                  <td className="border border-gray-300 px-2 sm:px-3 py-1">
                    {evt.status}
                  </td>
                  <td className="border border-gray-300 px-2 sm:px-3 py-1 space-x-2">
                    <button
                      onClick={() => handleEdit(evt)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(evt._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {events.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    No events found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Toaster position="top-right" />
    </div>
  );
}
