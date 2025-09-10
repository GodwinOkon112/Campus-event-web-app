import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema(
  {
    reference: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    name: String,
    phone: String,
    amount: { type: Number, required: true },
    status: { type: String, required: true },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
  },
  { timestamps: true }
);

export default mongoose.models.Transaction ||
  mongoose.model("Transaction", TransactionSchema);
