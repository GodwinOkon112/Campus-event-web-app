import mongoose from "mongoose";

const BotLogSchema = new mongoose.Schema({
  ip: { type: String, required: true },
  userAgent: { type: String, required: true },
  requestData: { type: mongoose.Schema.Types.Mixed }, // original payload
  detectionResult: { type: String, required: true }, // "Bot" or "Human"
  detectionScore: { type: Number }, // from Python script
  detectionReason: { type: String }, // optional explanation
  rawPythonResponse: { type: mongoose.Schema.Types.Mixed }, // full Python output
  createdAt: { type: Date, default: Date.now, index: true },
});

export default mongoose.models.BotLog || mongoose.model("BotLog", BotLogSchema);
