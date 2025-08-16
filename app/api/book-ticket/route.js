import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import dbConnect from "@/lib/dbConnect";
import BotLog from "@/models/BotLog";
import Ticket from "@/models/Ticket";

export async function POST(req) {
  try {
    const { eventId, userData } = await req.json();

    // Path to Python script
    const scriptPath = path.join(process.cwd(), "bot_detection.py");

    // Run Python script
    const result = await new Promise((resolve, reject) => {
      const process = spawn("python3", [scriptPath]);
      let output = "";

      process.stdout.on("data", (data) => (output += data.toString()));
      process.stderr.on("data", (err) => console.error(err.toString()));

      process.on("close", () => {
        try {
          resolve(JSON.parse(output));
        } catch (e) {
          reject(e);
        }
      });

      process.stdin.write(JSON.stringify(userData));
      process.stdin.end();
    });

    if (result.isBot) {
      await dbConnect();
      await BotLog.create({
        ip:
          req.headers.get("x-forwarded-for") || req.headers.get("remote_addr"),
        userAgent: userData.userAgent,
        detectedAt: new Date(),
      });

      return Response.json(
        { error: "Bot detected. Ticket booking denied." },
        { status: 403 }
      );
    }

    // If passed, book the ticket
    await dbConnect();
    const ticket = await Ticket.create({
      eventId,
      bookedAt: new Date(),
    });

    return Response.json({ success: true, ticket });
  } catch (err) {
    console.error(err);
    return Response.json(
      { error: "Could not process booking" },
      { status: 500 }
    );
  }
}
