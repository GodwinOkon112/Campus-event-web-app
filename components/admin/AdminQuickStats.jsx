"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function AdminOverview() {
  const [overview, setOverview] = useState(null);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const res = await fetch("/api/admin/overview");
        const data = await res.json();
        setOverview(data);
      } catch (error) {
        console.error("Error loading overview:", error);
      }
    };
    fetchOverview();
  }, []);

  if (!overview) {
    return <p className="text-gray-500">Loading overview...</p>;
  }

  // ✅ Always fallback to empty arrays
  const recentBookings = overview.recentBookings || [];
  const recentEvents = overview.recentEvents || [];
  const recentBotLogs = overview.recentBotLogs || [];
  const botTrends = overview.botTrends || [];

  return (
    <div className="p-6 space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-[4rem]">
        <div className="bg-white shadow rounded-lg p-4">
          <h5 className=" font-semibold">Total Tickets</h5>
          <p className="text-2xl">{overview.totalTickets ?? 0}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h5 className="text-lg font-semibold">Total Events</h5>
          <p className="text-2xl">{overview.totalEvents ?? 0}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h5 className="text-lg font-semibold">Total Users</h5>
          <p className="text-2xl">{overview.totalUsers ?? 0}</p>
        </div>
      </div>

      {/* Recent Bot Analysis */}
      <h4 className="text-xl font-semibold mb-3 ">Recent Bot Analysis</h4>
      <div className="bg-white shadow rounded-lg p-6 mb-[4rem]">
        {recentBotLogs.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {recentBotLogs.map((log) => (
              <li key={log._id} className="py-2">
                <p className="font-medium">IP: {log.ip || "Unknown"}</p>
                <p className="text-sm text-gray-500">
                  Status:{" "}
                  {log.detectionResult === "Bot"
                    ? " Bot Detected"
                    : "Human"}{" "}
                  —{" "}
                  {log.createdAt
                    ? new Date(log.createdAt).toLocaleString()
                    : "N/A"}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No recent bot logs.</p>
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Line Chart - Bots vs Humans */}
        <div className="bg-white shadow rounded-lg p-6 ">
          <h5 className="text-xl font-semibold mb-3 ">
            Bot vs Human (Last 7 Days)
          </h5>
          {botTrends.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={botTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="bots"
                  stroke="#ef4444"
                  strokeWidth={2}
                  name="Bots"
                />
                <Line
                  type="monotone"
                  dataKey="humans"
                  stroke="#22c55e"
                  strokeWidth={2}
                  name="Humans"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500">No bot detection data yet.</p>
          )}
        </div>

        {/* Bar Chart - Volume */}
        <div className="bg-white shadow rounded-lg p-6">
          <h5 className="text-xl font-semibold mb-4">Detection Volume</h5>
          {botTrends.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={botTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="bots" fill="#ef4444" name="Bots" />
                <Bar dataKey="humans" fill="#22c55e" name="Humans" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500">No bot detection data yet.</p>
          )}
        </div>
      </div>
      {/* Recent Bookings */}
        <h4 className="text-xl font-semibold mb-3 mt-5">Recent Bookings</h4>
      <div className="bg-white shadow rounded-lg p-6">
        {recentBookings.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {recentBookings.map((booking) => (
              <li key={booking._id} className="py-2">
                <p className="font-medium">
                  {booking.studentName} ({booking.studentEmail})
                </p>
                <p className="text-sm text-gray-500">
                  Event: {booking.event?.title || "Unknown"} —{" "}
                  {booking.createdAt
                    ? new Date(booking.createdAt).toLocaleString()
                    : "N/A"}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No recent bookings.</p>
        )}
      </div>

      {/* Recent Events */}
        <h4 className="text-xl font-semibold mb-4 mt-5">Recent Events</h4>
      <div className="bg-white shadow rounded-lg p-6">
        {recentEvents.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {recentEvents.map((event) => (
              <li key={event._id} className="py-2">
                <p className="font-medium">{event.title}</p>
                <p className="text-sm text-gray-500">
                  Date:{" "}
                  {event.createdAt
                    ? new Date(event.createdAt).toLocaleDateString()
                    : "N/A"}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No recent events.</p>
        )}
      </div>
    </div>
  );
}
