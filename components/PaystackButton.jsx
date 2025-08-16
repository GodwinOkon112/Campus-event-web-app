"use client";
import React from "react";
import PaystackPop from "@paystack/inline-js";
import toast from "react-hot-toast";

export default function PaystackButton({ email, amount }) {
  const handlePay = () => {
    const paystack = new PaystackPop();
    
    paystack.newTransaction({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
      email,
      amount: amount * 100, // Convert Naira to Kobo
      onSuccess: (transaction) => {
        toast.loading("Verifying payment...");
        fetch("/api/verify-transaction", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reference: transaction.reference }),
        })
          .then((res) => res.json())
          .then((data) => {
            toast.dismiss();
            if (data.status) {
              toast.success("Payment verified successfully!");
            } else {
              toast.error("Verification failed. Please contact support.");
            }
          })
          .catch(() => {
            toast.dismiss();
            toast.error("Verification error.");
          });
      },
      onCancel: () => {
        toast.error("Payment cancelled");
      },
    });
  };

  return (
    <button
      onClick={handlePay}
      className="bg-green-500 text-white px-4 py-2 rounded-lg"
    >
      Pay Now
    </button>
  );
}
