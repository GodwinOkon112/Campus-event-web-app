"use client";
import { useState } from "react";

export default function EventPaymentForm({ event }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handlePayment() {
    if (!form.name || !form.email) {
      alert("Name and email are required");
      return;
    }

    setLoading(true);

    const handler = window.PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_KEY,
      email: form.email,
      amount: event.price * 100, // Paystack expects kobo
      currency: "NGN",
      ref: `${event._id}-${Date.now()}`,
      metadata: { name: form.name, phone: form.phone },
      callback: async function (response) {
        // Verify payment on backend
        const res = await fetch("/api/payments/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reference: response.reference,
            eventId: event._id,
            student: form,
          }),
        });
        const data = await res.json();
        if (data.success) alert("Payment successful! Ticket booked.");
        else alert("Payment verification failed.");
        setLoading(false);
      },
      onClose: function () {
        setLoading(false);
        alert("Payment closed.");
      },
    });

    handler.openIframe();
  }

  return (
    <div className="border rounded p-4 shadow max-w-md mx-auto mt-6">
      <h2 className="text-lg font-semibold mb-4">Book Ticket</h2>
      <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={form.name}
        onChange={handleChange}
        className="w-full border rounded p-2 mb-3"
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        className="w-full border rounded p-2 mb-3"
      />
      <input
        type="text"
        name="phone"
        placeholder="Phone (optional)"
        value={form.phone}
        onChange={handleChange}
        className="w-full border rounded p-2 mb-3"
      />
      <button
        onClick={handlePayment}
        disabled={loading}
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 w-full"
      >
        {loading ? "Processing..." : `Pay ₦${event.price}`}
      </button>
    </div>
  );
}
