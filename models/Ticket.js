import mongoose from "mongoose";

const TicketSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    studentName: { type: String, required: true },
    studentEmail: { type: String, required: true },
    studentPhone: { type: String },
    reference: { type: String, required: true },
    amount: { type: Number, required: true },
    paidAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Ticket || mongoose.model("Ticket", TicketSchema);
