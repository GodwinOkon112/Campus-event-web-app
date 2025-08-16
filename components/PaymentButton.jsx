"use client";
import { useState } from "react";

export default function PaymentButton({ event }) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/payments/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "customer@example.com", // You can get this from logged-in user
          amount: event.price,
          eventId: event._id,
        }),
      });

      const data = await res.json();

      if (data.status && data.data.authorization_url) {
        window.location.href = data.data.authorization_url; // Redirect to Paystack
      } else {
        alert("Payment initialization failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error initializing payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      disabled={loading}
    >
      {loading ? "Processing..." : `Pay ₦${event.price}`}
    </button>
  );
}
