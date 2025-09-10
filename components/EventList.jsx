"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function MatchList() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch matches from API
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await fetch("/api/events"); // still using /api/events
        const data = await res.json();
        setMatches(data);
      } catch (error) {
        console.error("Error fetching matches:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  // Filter matches based on search term
  const filteredMatches = matches.filter(
    (match) =>
      match.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <p className="text-center py-10">Loading matches...</p>;
  if (!matches.length)
    return <p className="text-center py-10 text-gray-500">No matches found.</p>;

  return (
    <>
      <div className="flex flex-col sm:flex-row items-center justify-between px-4 pt-[4rem] gap-3">
        <h4 className="text-xl font-bold text-green-700" id="featured">
          Featured Matches
        </h4>
        <input
          type="text"
          placeholder="Search matches..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded px-3 py-2 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-green-600"
        />
      </div>
      <hr className="border-green-200" />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 p-4">
        {filteredMatches.length > 0 ? (
          filteredMatches.map((match) => (
            <div
              key={match._id}
              className="border rounded shadow hover:shadow-lg transition p-2 flex flex-col"
            >
              {/* Match Image */}
              {match.image ? (
                <img
                  src={match.image}
                  alt={match.title || "Match Image"}
                  className="rounded rounded-b-none mb-4 w-full h-48 object-cover"
                />
              ) : (
                <div className="rounded-lg mb-4 w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}

              {/* Match Title */}
              <h4 className="text-[2em] font-semibold mb-2 text-gray-900">
                {match.title || "Untitled Match"}
              </h4>

              {/* Match description */}
              <p className="mb-2 text-[16px] text-gray-700">
                {match.description
                  ? match.description.slice(0, 100) + "..."
                  : "No description available"}
              </p>

              {/* Match Date & Time */}
              <p className="text-sm text-gray-500 mb-2">
                {match.date
                  ? `${new Date(match.date).toLocaleDateString()} at ${
                      match.time || "TBD"
                    }`
                  : "Date TBD"}
              </p>

              {/* Match Ticket Price */}
              <p className="font-bold text-green-600 mb-2">
                {match.price ? `₦${match.price}` : "Free"}
              </p>

              {/* Match Status */}
              <span
                className={`text-xs px-2 py-1 self-start mb-3 rounded ${
                  match.status === "Upcoming"
                    ? "bg-green-100 text-green-700"
                    : match.status === "Ongoing"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-200 text-gray-600"
                }`}
              >
                {match.status || "Unknown"}
              </span>

              {/* View Match Button */}
              <Link
                href={`/events/${match._id}`}
                className="mt-auto text-center bg-green-700 text-white px-4 py-2 hover:bg-green-800 transition rounded"
              >
                View Details
              </Link>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No matches match your search.
          </p>
        )}
      </div>
    </>
  );
}
