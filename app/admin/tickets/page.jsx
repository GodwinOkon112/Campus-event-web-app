"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState([]);
  const [expandedTicket, setExpandedTicket] = useState(null); // For accordion

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

  const toggleAccordion = (id) => {
    setExpandedTicket(expandedTicket === id ? null : id);
  };

  return (
    <div className="mt-[5rem] md:mt-2">
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
      ) : filteredTickets.length === 0 ? (
        <p className="text-center text-muted-foreground py-10">
          No tickets found.
        </p>
      ) : (
        <div className="space-y-3">
          {filteredTickets.map((ticket) => {
            const isExpanded = expandedTicket === ticket._id;
            return (
              <Card key={ticket._id}>
                <CardContent className="p-4">
                  <button
                    onClick={() => toggleAccordion(ticket._id)}
                    className="w-full flex justify-between items-center"
                  >
                    <div className="text-left">
                      <p className="font-semibold">{ticket.studentName}</p>
                      <p className="text-sm text-muted-foreground">
                        {ticket.event?.title || "N/A"}
                      </p>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isExpanded && (
                    <div className="mt-3 space-y-1 text-sm text-gray-200">
                      <p>
                        <span className="font-semibold">Email:</span>{" "}
                        {ticket.studentEmail}
                      </p>
                      <p>
                        <span className="font-semibold">Phone:</span>{" "}
                        {ticket.studentPhone || "-"}
                      </p>
                      <p>
                        <span className="font-semibold">Event:</span>{" "}
                        {ticket.event?.title || "N/A"}
                      </p>
                      <p>
                        <span className="font-semibold">Amount:</span> ₦
                        {ticket.amount.toLocaleString()}
                      </p>
                      <p>
                        <span className="font-semibold">Paid At:</span>{" "}
                        {new Date(ticket.paidAt).toLocaleString()}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
