"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function TicketBookingForm() {
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    regNumber: "",
    studentName: "",
    eventId: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await axios.get("/api/events");
        setEvents(res.data);
      } catch (err) {
        console.error("Failed to load events", err);
      }
    }
    fetchEvents();
  }, []);

  function handleChange(e) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!formData.regNumber || !formData.studentName || !formData.eventId) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      // Call backend to book ticket
      const res = await axios.post("/api/tickets", formData);
      if (res.data.success) {
        toast.success("Ticket booking initiated. Proceed to payment.");
        // TODO: Redirect to payment page or show payment UI here
      } else {
        toast.error(res.data.message || "Booking failed");
      }
    } catch (error) {
      toast.error("Booking failed. Try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      id="booking-form"
      className="max-w-xl mx-auto p-6 bg-white rounded shadow my-12"
    >
      <h2 className="text-2xl font-bold mb-6 text-center">Book Your Ticket</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="regNumber" className="block font-semibold mb-1">
            Registration Number
          </label>
          <input
            type="text"
            id="regNumber"
            name="regNumber"
            value={formData.regNumber}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-indigo-500"
            placeholder="Enter your registration number"
            required
          />
        </div>

        <div>
          <label htmlFor="studentName" className="block font-semibold mb-1">
            Student Name
          </label>
          <input
            type="text"
            id="studentName"
            name="studentName"
            value={formData.studentName}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-indigo-500"
            placeholder="Enter your full name"
            required
          />
        </div>

        <div>
          <label htmlFor="eventId" className="block font-semibold mb-1">
            Select Event
          </label>
          <select
            id="eventId"
            name="eventId"
            value={formData.eventId}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-indigo-500"
            required
          >
            <option value="">-- Choose an event --</option>
            {events.map((event) => (
              <option key={event._id} value={event._id}>
                {event.title} - ₦{event.price}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 rounded font-semibold hover:bg-indigo-700 transition"
        >
          {loading ? "Booking..." : "Book Ticket"}
        </button>
      </form>
      <Toaster position="top-right" />
    </section>
  );
}
