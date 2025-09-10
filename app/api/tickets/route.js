import dbConnect from "../../../lib/dbConnect";
import Ticket from "../../../models/Ticket";
import Event from "../../../models/Event";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "POST") {
    const {
      studentName,
      studentEmail,
      studentPhone,
      eventId,
      reference,
      amount,
    } = req.body;

    // ✅ Validate required fields
    if (!studentName || !studentEmail || !eventId || !reference || !amount) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    try {
      // ✅ Check if event exists and is upcoming
      const event = await Event.findById(eventId);
      if (!event || event.status !== "Upcoming") {
        return res
          .status(400)
          .json({ success: false, message: "Invalid or inactive event" });
      }

      // ✅ Optional: check if this email already booked a ticket for the event
      const existingTicket = await Ticket.findOne({
        studentEmail,
        event: eventId,
      });
      if (existingTicket) {
        return res.status(400).json({
          success: false,
          message: "Ticket already booked for this event",
        });
      }

      // ✅ Create new ticket
      const ticket = await Ticket.create({
        studentName,
        studentEmail,
        studentPhone,
        event: eventId,
        reference,
        amount,
        paidAt: new Date(), // or leave null until payment confirmed
      });

      return res.status(201).json({ success: true, ticket });
    } catch (error) {
      console.error("Error creating ticket:", error);
      return res
        .status(500)
        .json({ success: false, message: "Failed to book ticket" });
    }
  }

  if (req.method === "GET") {
    try {
      const tickets = await Ticket.find().populate("event");
      return res.status(200).json({ success: true, tickets });
    } catch (error) {
      console.error("Error fetching tickets:", error);
      return res
        .status(500)
        .json({ success: false, message: "Failed to fetch tickets" });
    }
  }

  return res
    .status(405)
    .json({ success: false, message: "Method not allowed" });
}
