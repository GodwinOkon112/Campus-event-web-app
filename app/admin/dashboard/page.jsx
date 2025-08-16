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
        <header className="mb-10 mt-[5rem]  md:mt-2">
          <h4 className="  text-[2px] font-extrabold">Admin Dashboard</h4>
        </header>
        {/* <AdminEvents /> */}
        <AdminQuickStats {...statsData} />
      </main>
  
  );
}
