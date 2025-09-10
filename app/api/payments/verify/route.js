import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Ticket from "@/models/Ticket";
import Event from "@/models/Event";

export async function POST(request) {
  try {
    const { reference, eventId, student } = await request.json();

    if (!reference || !eventId || !student) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify payment with Paystack
    const verifyRes = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const verifyData = await verifyRes.json();

    if (!verifyData.status || verifyData.data.status !== "success") {
      return NextResponse.json({
        success: false,
        message: "Payment verification failed",
        data: verifyData.data,
      });
    }

    // Connect to DB
    await dbConnect();

    // Ensure event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json(
        { success: false, message: "Event not found" },
        { status: 404 }
      );
    }

    // Save ticket in DB
    const ticket = await Ticket.create({
      event: event._id,
      studentName: student.name,
      studentEmail: student.email.toLowerCase(),
      studentPhone: student.phone || "",
      reference,
      amount: verifyData.data.amount / 100, // convert back from kobo
      paidAt: new Date(verifyData.data.paid_at),
    });

    return NextResponse.json({
      success: true,
      message: "Payment verified & ticket booked",
      ticket,
    });
  } catch (error) {
    console.error("Verify error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
