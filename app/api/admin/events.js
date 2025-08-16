import dbConnect from "../../../lib/dbConnect";
import Event from "../../../models/Event";
import { getAuth } from "@clerk/nextjs/server";

export default async function handler(req, res) {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // TODO: Add role check here if you have user roles in your system

  await dbConnect();

  switch (req.method) {
    case "GET":
      try {
        const events = await Event.find({}).sort({ date: 1 });
        return res.status(200).json(events);
      } catch (error) {
        return res.status(500).json({ error: "Failed to fetch events" });
      }

    case "POST":
      try {
        const { title, description, date, time, price, status, imageUrl } =
          req.body;

        if (!title || !description || !date || !time || !price) {
          return res.status(400).json({ error: "Missing required fields" });
        }

        const newEvent = await Event.create({
          title,
          description,
          date,
          time,
          price,
          status: status || "Upcoming",
          imageUrl,
        });

        return res.status(201).json(newEvent);
      } catch (error) {
        return res.status(500).json({ error: "Failed to create event" });
      }

    case "PUT":
      try {
        const { id, title, description, date, time, price, status, imageUrl } =
          req.body;

        if (!id) {
          return res.status(400).json({ error: "Event ID is required" });
        }

        const event = await Event.findById(id);
        if (!event) {
          return res.status(404).json({ error: "Event not found" });
        }

        event.title = title || event.title;
        event.description = description || event.description;
        event.date = date || event.date;
        event.time = time || event.time;
        event.price = price || event.price;
        event.status = status || event.status;
        event.imageUrl = imageUrl || event.imageUrl;

        await event.save();

        return res.status(200).json(event);
      } catch (error) {
        return res.status(500).json({ error: "Failed to update event" });
      }

    case "DELETE":
      try {
        const { id } = req.body;

        if (!id) {
          return res.status(400).json({ error: "Event ID is required" });
        }

        const deleted = await Event.findByIdAndDelete(id);

        if (!deleted) {
          return res.status(404).json({ error: "Event not found" });
        }

        return res.status(200).json({ message: "Event deleted successfully" });
      } catch (error) {
        return res.status(500).json({ error: "Failed to delete event" });
      }

    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
}
