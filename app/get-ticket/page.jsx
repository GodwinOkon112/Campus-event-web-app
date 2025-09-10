"use client";

import { useState } from "react";
import jsPDF from "jspdf";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function GetTicketPage() {
  const [form, setForm] = useState({ fanName: "", fanEmail: "" });
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [noTickets, setNoTickets] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Fetch tickets
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setTickets([]);
    setNoTickets(false);

    try {
      const res = await fetch("/api/get-tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Network error, please try again.");
      }

      if (data.tickets.length === 0) {
        setNoTickets(true); // user provided valid info but has no tickets
      } else {
        setTickets(data.tickets);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch tickets");
    } finally {
      setLoading(false);
    }
  };

  // Download ticket as PDF
  const downloadPDF = (ticket) => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("🎟 Football Match Ticket", 20, 20);

    doc.setFontSize(12);
    doc.text(`Fan Name: ${ticket.fanName}`, 20, 40);
    doc.text(`Fan Email: ${ticket.fanEmail}`, 20, 50);
    doc.text(`Phone: ${ticket.fanPhone || "N/A"}`, 20, 60);

    doc.text(`Match: ${ticket.event?.title || "Untitled Match"}`, 20, 80);
    doc.text(
      `Date: ${
        ticket.event?.date
          ? new Date(ticket.event.date).toLocaleDateString()
          : "Date TBD"
      }`,
      20,
      90
    );
    doc.text(`Time: ${ticket.event?.time || "TBD"}`, 20, 100);

    doc.text(`Amount Paid: ₦${ticket.amount}`, 20, 120);
    doc.text(`Reference: ${ticket.reference}`, 20, 130);
    doc.text(`Paid At: ${new Date(ticket.paidAt).toLocaleString()}`, 20, 140);

    doc.setFontSize(10);
    doc.text("Thank you for booking your match ticket with us!", 20, 160);

    doc.save(`MatchTicket_${ticket.reference}.pdf`);
  };

  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h3 className="text-3xl font-bold mb-6 text-center">
          Find Your Match Tickets
        </h3>

        {/* Search Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow p-6 rounded-lg mt-10 space-y-4"
        >
          <div>
            <label className="block text-gray-700">Full Name</label>
            <input
              type="text"
              name="fanName"
              value={form.fanName}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2 mt-1 focus:ring-2 focus:ring-green-600 outline-none"
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="fanEmail"
              value={form.fanEmail}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2 mt-1 focus:ring-2 focus:ring-green-600 outline-none"
              placeholder="Enter your email"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-700 text-white py-2 rounded hover:bg-green-800 transition"
          >
            {loading ? "Fetching Tickets..." : "Get My Tickets"}
          </button>
        </form>

        {/* Error Message */}
        {error && <p className="mt-4 text-red-500 text-center">{error}</p>}

        {/* No Tickets Found */}
        {noTickets && !loading && !error && (
          <p className="mt-4 text-red-600 text-center">
            We couldn’t find any tickets for <b>{form.fanName}</b> with email{" "}
            <b>{form.fanEmail}</b>. It looks like you haven’t booked yet.
          </p>
        )}

        {/* Ticket Results */}
        <div className="mt-8">
          {tickets.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">
                Your Booked Match Tickets:
              </h2>
              {tickets.map((ticket) => (
                <div
                  key={ticket._id}
                  className="border rounded-lg p-4 shadow hover:shadow-md transition"
                >
                  {/* Match Info */}
                  <p className="font-bold">
                    {ticket.event?.title || "Untitled Match"}
                  </p>
                  <p className="text-sm text-gray-600">
                    {ticket.event?.date
                      ? new Date(ticket.event.date).toLocaleDateString()
                      : "Date TBD"}{" "}
                    at {ticket.event?.time || "TBD"}
                  </p>

                  {/* Payment Info */}
                  <p className="text-green-700 font-semibold">
                    Paid: ₦{ticket.amount}
                  </p>
                  <p className="text-sm text-gray-500">
                    Reference: {ticket.reference}
                  </p>
                  <p className="text-sm text-gray-500">
                    Paid At: {new Date(ticket.paidAt).toLocaleString()}
                  </p>

                  {/* Download Ticket */}
                  <button
                    onClick={() => downloadPDF(ticket)}
                    className="mt-3 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                  >
                    Download Ticket (PDF)
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* <Footer /> */}
    </>
  );
}
