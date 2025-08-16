import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  student: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
  },
  reference: { type: String, required: true, unique: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ["success", "failed"], required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Payment ||
  mongoose.model("Payment", PaymentSchema);
