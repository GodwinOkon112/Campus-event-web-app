// components/EventCard.jsx
"use client";

import Link from "next/link";
import Image from "next/image";

export default function EventCard({ event }) {
  return (
    <Link href={`/events/${event._id}`} className="block group">
      <div className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition">
        {event.image && (
          <div className="relative w-full h-48">
            <Image
              src={event.image}
              alt={event.title}
              fill
              className="object-cover group-hover:scale-105 transition"
            />
          </div>
        )}
        <div className="p-4">
          <h2 className="text-xl font-semibold">{event.title}</h2>
          <p className="text-gray-600">{event.description?.slice(0, 60)}...</p>
          <div className="mt-2 text-sm text-gray-500">
            <span>{new Date(event.date).toLocaleDateString()}</span> •{" "}
            <span>{event.time}</span>
          </div>
          <div className="mt-1 font-bold">
            ₦{Number(event.price).toLocaleString()}
          </div>
          <div
            className={`mt-2 inline-block px-2 py-1 text-xs rounded ${
              event.status === "Upcoming"
                ? "bg-green-100 text-green-700"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {event.status}
          </div>
        </div>
      </div>
    </Link>
  );
}
