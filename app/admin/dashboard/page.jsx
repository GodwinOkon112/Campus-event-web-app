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
      <main >
        <header className="mb-4">
          <h4 className=" ml-9 text-[2px] font-extrabold">Admin Dashboard</h4>
        </header>
        {/* <AdminEvents /> */}
        <AdminQuickStats {...statsData} />
      </main>
  
  );
}
