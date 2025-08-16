"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");

  useEffect(() => {
    if (reference) {
      fetch("/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.ticket) {
            alert(`Payment successful! Ticket ID: ${data.ticket._id}`);
          } else {
            alert("Payment verification failed");
          }
        });
    }
  }, [reference]);

  return <p className="text-center py-10">Verifying payment...</p>;
}
