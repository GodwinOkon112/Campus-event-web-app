import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import BotLog from "@/models/BotLog";

export async function GET(req) {
  try {
    await dbConnect();

    const url = new URL(req.url);
    const search = url.searchParams.get("search") || "";
    const filter = url.searchParams.get("filter") || "";
    const page = parseInt(url.searchParams.get("page")) || 1;
    const limit = parseInt(url.searchParams.get("limit")) || 20;

    const query = {};
    if (search) {
      query.$or = [
        { ip: { $regex: search, $options: "i" } },
        { userAgent: { $regex: search, $options: "i" } },
      ];
    }
    if (filter) {
      query.detectionResult = filter;
    }

    const total = await BotLog.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    const logs = await BotLog.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return NextResponse.json({ success: true, logs, totalPages });
  } catch (err) {
    console.error("Error fetching bot logs:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
