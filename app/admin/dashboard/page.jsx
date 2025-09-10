"use client";

import AdminSidebar from "../../../components/AdminSidebar";
import AdminEvents from "../../../components/AdminEvent";
import AdminQuickStats from "@/components/admin/AdminQuickStats";

export default function AdminDashboard() {
  const statsData = {
    totalEvents: 12,
    upcomingEvents: 5,
    completedEvents: 7,
    ticketsSold: 320,
    revenueGenerated: 150000,
    activeUsers: 80,
  };

  return (
    <main>
      <header className="mb-10 mt-[5rem] md:mt-2">
        <h4 className="text-xl md:text-2xl font-extrabold">
          ⚽ Football Ticketing Admin Dashboard
        </h4>
        <p className="text-gray-600 text-sm mt-1">
          Monitor match schedules, ticket sales, and fan engagement at a glance.
        </p>
      </header>

      {/* Quick Stats */}
      <AdminQuickStats {...statsData} />

      {/* Uncomment if you want to show events (matches) list */}
      {/* <AdminEvents /> */}
    </main>
  );
}
