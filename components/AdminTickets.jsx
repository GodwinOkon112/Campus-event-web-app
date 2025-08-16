"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function AdminTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchTickets() {
    setLoading(true);
    try {
      const res = await axios.get("/api/admin/tickets");
      setTickets(res.data);
    } catch (err) {
      toast.error("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTickets();
  }, []);

  async function updatePaymentStatus(id, status) {
    try {
      await axios.put("/api/admin/tickets", { id, paymentStatus: status });
      toast.success("Payment status updated");
      fetchTickets();
    } catch {
      toast.error("Failed to update payment status");
    }
  }

  async function deleteTicket(id) {
    if (!confirm("Are you sure you want to delete this ticket?")) return;
    try {
      await axios.delete("/api/admin/tickets", { data: { id } });
      toast.success("Ticket deleted");
      fetchTickets();
    } catch {
      toast.error("Failed to delete ticket");
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Tickets</h1>

      {loading ? (
        <p>Loading tickets...</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-3 py-1">Student Name</th>
              <th className="border border-gray-300 px-3 py-1">Reg Number</th>
              <th className="border border-gray-300 px-3 py-1">Event</th>
              <th className="border border-gray-300 px-3 py-1">
                Payment Status
              </th>
              <th className="border border-gray-300 px-3 py-1">Booked At</th>
              <th className="border border-gray-300 px-3 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket._id}>
                <td className="border border-gray-300 px-3 py-1">
                  {ticket.studentName}
                </td>
                <td className="border border-gray-300 px-3 py-1">
                  {ticket.regNumber}
                </td>
                <td className="border border-gray-300 px-3 py-1">
                  {ticket.event?.title}
                </td>
                <td className="border border-gray-300 px-3 py-1">
                  {ticket.paymentStatus}
                </td>
                <td className="border border-gray-300 px-3 py-1">
                  {new Date(ticket.bookedAt).toLocaleString()}
                </td>
                <td className="border border-gray-300 px-3 py-1 space-x-2">
                  {ticket.paymentStatus !== "Completed" && (
                    <button
                      onClick={() =>
                        updatePaymentStatus(ticket._id, "Completed")
                      }
                      className="text-green-600 hover:underline"
                    >
                      Mark Paid
                    </button>
                  )}
                  <button
                    onClick={() => deleteTicket(ticket._id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {tickets.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  No tickets found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      <Toaster position="top-right" />
    </div>
  );
}
