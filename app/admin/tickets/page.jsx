"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await axios.get("/api/admin/tickets");
        setTickets(res.data);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  const filteredTickets = tickets.filter((ticket) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      ticket.studentName.toLowerCase().includes(searchLower) ||
      ticket.event?.title?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="p-6">
      <h3 className="text-2xl font-bold mb-4">All Tickets</h3>

      <div className="mb-4">
        <Input
          placeholder="Search by student or event..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-3/4 md:w-1/3"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <Card>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b bg-muted/50 ">
                  <th className="p-3 font-bold">Student Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Event</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Paid At</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.length > 0 ? (
                  filteredTickets.map((ticket) => (
                    <tr key={ticket._id} className="border-b hover:bg-muted/30">
                      <td className="p-3">{ticket.studentName}</td>
                      <td className="p-3">{ticket.studentEmail}</td>
                      <td className="p-3">{ticket.studentPhone || "-"}</td>
                      <td className="p-3">{ticket.event?.title || "N/A"}</td>
                      <td className="p-3">₦{ticket.amount.toLocaleString()}</td>
                      <td className="p-3">
                        {new Date(ticket.paidAt).toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="p-6 text-center text-muted-foreground"
                    >
                      No tickets found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
