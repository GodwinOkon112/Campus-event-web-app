import { NextResponse } from "next/server";
import { execFile } from "child_process";
import path from "path";
import dbConnect from "@/lib/dbConnect";
import BotLog from "@/models/BotLog";

export async function POST(req) {
  try {
    await dbConnect();

    const scriptPath = path.join(process.cwd(), "scripts", "bot_detection.py");
    const data = await req.json();

    // Extract IP from headers (for logging/tracking)
    const forwardedFor = req.headers.get("x-forwarded-for");
    const clientIp = forwardedFor?.split(",")[0]?.trim() || "unknown";

    console.log("Incoming bot check data:", data);

    // Run Python bot detection script
    const pythonResult = await new Promise((resolve, reject) => {
      execFile(
        "python", // explicitly use python
        [scriptPath, JSON.stringify(data)],
        (error, stdout, stderr) => {
          if (error) {
            console.error("Python exec error:", error, stderr);
            return reject(stderr || error.message);
          }

          console.log("Python raw stdout:", stdout);

          try {
            // Extract JSON object from mixed output
            const jsonMatch = stdout.match(/\{[\s\S]*\}/);
            if (!jsonMatch) return reject("No JSON output from Python");

            const result = JSON.parse(jsonMatch[0]);
            if (result.error) return reject(result.error);

            resolve(result);
          } catch (err) {
            console.error("JSON parse error:", err);
            reject("Invalid JSON from Python: " + stdout);
          }
        }
      );
    });

    const detectionResult = pythonResult.isBot ? "Bot" : "Human";

    // Save log to DB
    const log = await BotLog.create({
      ip: clientIp,
      userAgent: data.userAgent || "unknown",
      requestData: data,
      detectionResult,
      detectionScore: pythonResult.confidenceScore ?? null,
      detectionReason: pythonResult.reason ?? "No reason provided",
      rawPythonResponse: pythonResult,
    });

    return NextResponse.json({
      success: true,
      message:
        detectionResult === "Bot"
          ? "Bot detected. Booking blocked."
          : "No bot detected. Proceed allowed.",
      detection: {
        isBot: pythonResult.isBot,
        confidenceScore: pythonResult.confidenceScore,
        reason: pythonResult.reason,
      },
      detectionResult,
      logId: log._id,
    });
  } catch (err) {
    console.error("Bot check API error:", err);
    return NextResponse.json(
      { success: false, error: err.toString() },
      { status: 500 }
    );
  }
}
