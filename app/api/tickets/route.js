import dbConnect from "../../../lib/dbConnect";
import Ticket from "../../../models/Ticket";
import Event from "../../../models/Event";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "POST") {
    const { regNumber, studentName, eventId } = req.body;

    if (!regNumber || !studentName || !eventId) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    try {
      // Optional: check if event exists and is upcoming
      const event = await Event.findById(eventId);
      if (!event || event.status !== "Upcoming") {
        return res
          .status(400)
          .json({ success: false, message: "Invalid or inactive event" });
      }

      // Optional: check if ticket already booked by this regNumber for this event
      const existingTicket = await Ticket.findOne({
        regNumber,
        event: eventId,
      });
      if (existingTicket) {
        return res
          .status(400)
          .json({
            success: false,
            message: "Ticket already booked for this event",
          });
      }

      const ticket = await Ticket.create({
        regNumber,
        studentName,
        event: eventId,
        paymentStatus: "Pending",
      });

      // Return ticket info (or payment initiation data here)
      return res.status(201).json({ success: true, ticket });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ success: false, message: "Failed to book ticket" });
    }
  }

  if (req.method === "GET") {
    // Optionally return all tickets (admin only)
    // For now, reject access to keep it secure
    return res.status(403).json({ success: false, message: "Forbidden" });
  }

  return res
    .status(405)
    .json({ success: false, message: "Method not allowed" });
}
