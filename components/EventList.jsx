"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function EventList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/events");
        const data = await res.json();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Filter events based on search term
  const filteredEvents = events.filter(
    (event) =>
      event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <p className="text-center py-10">Loading events...</p>;
  if (!events.length)
    return <p className="text-center py-10 text-gray-500">No events found.</p>;

  return (
    <>
      <div className="flex flex-col sm:flex-row items-center justify-between px-4 pt-[4rem] gap-3">
        <h4 className="text-xl font-bold" id="featured">
          Featured Event
        </h4>
        <input
          type="text"
          placeholder="Search events..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded px-3 py-2 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <hr />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 p-4">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <div
              key={event._id}
              className="border rounded shadow hover:shadow-lg transition p-2 flex flex-col"
            >
              {/* Event Image */}
              {event.image ? (
                <img
                  src={event.image}
                  alt={event.title || "Event Image"}
                  className="rounded rounded-b-none mb-4 w-full h-48 object-cover"
                />
              ) : (
                <div className="rounded-lg mb-4 w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}

              {/* Event Title */}
              <h4 className="text-[2em] font-semibold mb-2">
                {event.title || "Untitled Event"}
              </h4>

              {/* Event description */}
              <p className="mb-2 text-[16px]">
                {event.description
                  ? event.description.slice(0, 100) + "..."
                  : "No description available"}
              </p>

              {/* Event Date & Time */}
              <p className="text-sm text-gray-500 mb-2">
                {event.date
                  ? `${new Date(event.date).toLocaleDateString()} at ${
                      event.time || "TBD"
                    }`
                  : "Date TBD"}
              </p>

              {/* Event Price */}
              <p className="font-bold text-blue-600 mb-2">
                {event.price ? `₦${event.price}` : "Free"}
              </p>

              {/* Event Status */}
              <span
                className={`text-xs px-2 py-1 self-start mb-3 ${
                  event.status === "Upcoming"
                    ? "bg-green-100 text-green-700"
                    : event.status === "Ongoing"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-200 text-gray-600"
                }`}
              >
                {event.status || "Unknown"}
              </span>

              {/* View Event Button */}
              <Link
                href={`/events/${event._id}`}
                className="mt-auto text-center bg-dark text-white px-4 py-2 hover:bg-gray-700 transition"
              >
                View Details
              </Link>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No events match your search.
          </p>
        )}
      </div>
    </>
  );
}
