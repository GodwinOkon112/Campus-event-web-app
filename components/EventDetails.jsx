"use client";

import { useState } from "react";
import PaystackPop from "@paystack/inline-js";
import useBotTracking from "../components/useBotTrackings";
import toast from "react-hot-toast";

export default function EventDetails({ event }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [botModal, setBotModal] = useState(null); // 🚨 Store bot detection details
  const getTrackingData = useBotTracking();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handlePayment() {
    if (!form.name || !form.email) {
      toast.error("Name and email are required");
      return;
    }

    setLoading(true);

    // 1️⃣ Gather tracking + form data
    const trackingData = getTrackingData();
    const botCheckPayload = {
      eventId: event._id,
      name: form.name,
      email: form.email,
      phone: form.phone || "",
      submissionTimeMs: trackingData.submissionTimeMs,
      keystrokeIntervals: trackingData.keystrokeIntervals,
      mouseMovements: trackingData.mouseMovements,
      clickCount: trackingData.clickCount,
      userAgent: navigator.userAgent,
      acceptLanguage: navigator.language || navigator.userLanguage || "unknown",
    };

    // 2️⃣ Call bot detection API
    let botData;
    try {
      const botCheckRes = await fetch("/api/admin/check-bot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(botCheckPayload),
      });

      if (!botCheckRes.ok)
        throw new Error(`Bot check failed (${botCheckRes.status})`);

      botData = await botCheckRes.json();
    } catch (err) {
      console.error("Bot check API error:", err);
      toast.error("Error checking for bots.");
      setLoading(false);
      return;
    }

    // 3️⃣ Stop + Show Modal if bot detected
    if (
      botData.isBot ||
      botData.detection?.isBot ||
      botData.detectionResult === "Bot"
    ) {
      setBotModal(botData); // open modal with details
      setLoading(false);
      return;
    }

    // 4️⃣ Proceed with Paystack payment
    try {
      const paystack = new PaystackPop();
      paystack.newTransaction({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
        email: form.email,
        amount: Number(event.price) * 100,
        currency: "NGN",
        reference: `${event._id}-${Date.now()}`,
        metadata: { name: form.name, phone: form.phone },

        onSuccess: async (transaction) => {
          try {
            const res = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                reference: transaction.reference,
                eventId: event._id,
                student: form,
              }),
            });

            const data = await res.json();
            if (data.success) {
              toast.success("Payment successful! Ticket booked.");
              setForm({ name: "", email: "", phone: "" });

              // ✅ FRAUD0 Conversion Tag
              if (typeof window !== "undefined") {
                window.fraud0 = window.fraud0 || [];
                // fraud0’s example: fraud0.push([1]);
                // Better: include unique transaction ref
                window.fraud0.push([transaction.reference]);
                console.log("Fraud0 conversion tag fired:", window.fraud0);
              }
            } else {
              toast.error("Payment verification failed.");
            }
          } catch (err) {
            console.error(err);
            toast.error("Error verifying payment.");
          } finally {
            setLoading(false);
          }
        },

        onCancel: () => {
          setLoading(false);
          toast.error("Payment cancelled.");
        },

        onError: (error) => {
          console.error(error);
          toast.error("Could not initialize payment.");
          setLoading(false);
        },
      });
    } catch (error) {
      console.error(error);
      toast.error("Could not initialize payment.");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {event.image ? (
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-80 object-cover rounded-lg mb-6"
        />
      ) : (
        <div className="w-full h-80 bg-gray-100 flex items-center justify-center text-gray-400 mb-6">
          No Image
        </div>
      )}

      <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
      <p className="text-gray-700 mb-2">{event.description}</p>
      <p className="text-gray-500 mb-2">
        Date: {new Date(event.date).toLocaleDateString()}
      </p>
      <p className="text-gray-500 mb-2">Time: {event.time}</p>
      <p className="text-blue-600 font-bold mb-4">
        Price: {event.price ? `₦${event.price}` : "Free"}
      </p>

      <span
        className={`text-xs px-2 py-1 rounded-full mb-6 inline-block ${
          event.status === "Upcoming"
            ? "bg-green-100 text-green-700"
            : event.status === "Ongoing"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-gray-200 text-gray-600"
        }`}
      >
        {event.status}
      </span>

      <div className="border rounded p-4 shadow">
        <h2 className="text-lg font-semibold mb-4">Book Ticket</h2>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border rounded p-2 mb-3"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full border rounded p-2 mb-3"
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          className="w-full border rounded p-2 mb-3"
        />

        <button
          onClick={handlePayment}
          disabled={loading}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 w-full"
        >
          {loading ? "Checking..." : `Pay ₦${event.price}`}
        </button>
      </div>

      {/* 🚨 Bot Detection Modal */}
      {botModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-red-600 mb-4">
             Booking Blocked: Bot Detected
            </h2>
            <p className="text-gray-700 mb-4">
              Your booking attempt was flagged as a bot.
            </p>

            <ul className="list-disc pl-6 space-y-1 text-sm text-gray-600">
              {botModal.reason && <li>{botModal.reason}</li>}
              {botModal.details &&
                Object.entries(botModal.details).map(([key, value]) => (
                  <li key={key}>
                    <strong>{key}:</strong> {String(value)}
                  </li>
                ))}
            </ul>

            <button
              onClick={() => setBotModal(null)}
              className="mt-6 w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
