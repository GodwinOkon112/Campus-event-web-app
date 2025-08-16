"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function FeaturedEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await axios.get("/api/events");
        setEvents(res.data);
      } catch (err) {
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  if (loading) return <p className="text-center py-10">Loading events...</p>;

  if (!events.length)
    return <p className="text-center py-10">No upcoming events found.</p>;

  return (
    <section id="events" className="max-w-7xl mx-auto px-6 py-12">
      <h2 className="text-3xl font-bold mb-8 text-center">Upcoming Events</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {events.map((event) => (
          <div
            key={event._id}
            className="border rounded-lg shadow p-6 flex flex-col"
          >
            {event.imageUrl && (
              <img
                src={event.imageUrl}
                alt={event.title}
                className="rounded-md mb-4 object-cover h-48 w-full"
              />
            )}
            <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
            <p className="mb-2 text-gray-700">{event.description}</p>
            <p className="text-gray-600 mb-1">
              Date: {new Date(event.date).toLocaleDateString()}
            </p>
            <p className="text-gray-600 mb-3">Time: {event.time}</p>
            <p className="font-semibold mb-4">Price: ₦{event.price}</p>
            <a
              href="#booking-form"
              className="mt-auto inline-block bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition text-center"
            >
              Book Now
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
