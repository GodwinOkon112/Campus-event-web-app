// app/api/admin/overview/route.js
import dbConnect from "@/lib/dbConnect";
import Ticket from "@/models/Ticket";
import Event from "@/models/Event";
import BotLog from "@/models/BotLog";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();

    // --- Stats ---
    const [totalTickets, totalEvents, distinctEmails] = await Promise.all([
      Ticket.countDocuments(),
      Event.countDocuments(),
      Ticket.distinct("studentEmail"),
    ]);
    const totalUsers = distinctEmails.length;

    // --- Recent activity ---
    const [recentBookings, recentEvents, recentBotLogs] = await Promise.all([
      Ticket.find().populate("event").sort({ createdAt: -1 }).limit(5),
      Event.find().sort({ createdAt: -1 }).limit(5),
      BotLog.find().sort({ createdAt: -1 }).limit(5),
    ]);

    // --- Bot trends (last 7 days, grouped daily) ---
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() - 6); // 7-day window
    start.setHours(0, 0, 0, 0);

    const raw = await BotLog.aggregate([
      { $match: { createdAt: { $gte: start } } },
      {
        $project: {
          detectionResult: 1,
          date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        },
      },
      {
        $group: {
          _id: { date: "$date", type: "$detectionResult" }, // group per day + type
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: "$_id.date",
          results: { $push: { type: "$_id.type", count: "$count" } },
        },
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          bots: {
            $sum: {
              $map: {
                input: "$results",
                as: "r",
                in: { $cond: [{ $eq: ["$$r.type", "Bot"] }, "$$r.count", 0] },
              },
            },
          },
          humans: {
            $sum: {
              $map: {
                input: "$results",
                as: "r",
                in: { $cond: [{ $eq: ["$$r.type", "Human"] }, "$$r.count", 0] },
              },
            },
          },
        },
      },
      { $sort: { date: 1 } },
    ]);

    // --- Fill missing days (ensure chart always has 7 entries) ---
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      days.push(d.toISOString().slice(0, 10));
    }
    const map = new Map(raw.map((x) => [x.date, x]));
    const botTrends = days.map((d) => ({
      date: d,
      bots: map.get(d)?.bots || 0,
      humans: map.get(d)?.humans || 0,
    }));

    // --- Response ---
    return NextResponse.json({
      totalTickets,
      totalEvents,
      totalUsers,
      recentBookings,
      recentEvents,
      recentBotLogs,
      botTrends, // ✅ always structured as {date, bots, humans}
    });
  } catch (error) {
    console.error("Error fetching overview:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
