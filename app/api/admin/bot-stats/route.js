// app/api/admin/bot-stats/route.js
import dbConnect from "@/lib/dbConnect";
import BotLog from "@/models/BotLog";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();

    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() - 6);
    start.setHours(0, 0, 0, 0);

    // Aggregate by day + detectionResult
    const raw = await BotLog.aggregate([
      { $match: { createdAt: { $gte: start } } },
      {
        $project: {
          detectionResult: 1,
          date: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
        },
      },
      {
        $group: {
          _id: { date: "$date", type: "$detectionResult" },
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

    // Fill missing days
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      days.push(d.toISOString().slice(0, 10));
    }
    const map = new Map(raw.map((x) => [x.date, x]));
    const trends = days.map((d) => ({
      date: d,
      bots: map.get(d)?.bots || 0,
      humans: map.get(d)?.humans || 0,
    }));

    return NextResponse.json(trends);
  } catch (error) {
    console.error("Error fetching bot stats:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
