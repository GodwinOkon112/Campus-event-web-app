import dbConnect from "../../../lib/dbConnect";
import Ticket from "../../../models/Ticket";
import { getAuth } from "@clerk/nextjs/server";

export default async function handler(req, res) {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // TODO: Add admin role check here

  await dbConnect();

  switch (req.method) {
    case "GET":
      // Optionally support query params for filtering: eventId, regNumber, paymentStatus
      const { eventId, regNumber, paymentStatus } = req.query;

      let filter = {};
      if (eventId) filter.event = eventId;
      if (regNumber) filter.regNumber = regNumber;
      if (paymentStatus) filter.paymentStatus = paymentStatus;

      try {
        const tickets = await Ticket.find(filter)
          .populate("event")
          .sort({ bookedAt: -1 });
        return res.status(200).json(tickets);
      } catch (error) {
        return res.status(500).json({ error: "Failed to fetch tickets" });
      }

    case "PUT":
      // Update paymentStatus or studentName, etc.
      try {
        const { id, paymentStatus, studentName } = req.body;
        if (!id) return res.status(400).json({ error: "Ticket ID required" });

        const ticket = await Ticket.findById(id);
        if (!ticket) return res.status(404).json({ error: "Ticket not found" });

        if (paymentStatus) ticket.paymentStatus = paymentStatus;
        if (studentName) ticket.studentName = studentName;

        await ticket.save();
        return res.status(200).json(ticket);
      } catch (error) {
        return res.status(500).json({ error: "Failed to update ticket" });
      }

    case "DELETE":
      try {
        const { id } = req.body;
        if (!id) return res.status(400).json({ error: "Ticket ID required" });

        const deleted = await Ticket.findByIdAndDelete(id);
        if (!deleted)
          return res.status(404).json({ error: "Ticket not found" });

        return res.status(200).json({ message: "Ticket deleted successfully" });
      } catch (error) {
        return res.status(500).json({ error: "Failed to delete ticket" });
      }

    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
}
