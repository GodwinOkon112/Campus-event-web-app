import mongoose from "mongoose";

const EventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    price: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Upcoming", "Completed"],
      default: "Upcoming",
    },
    image: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Event || mongoose.model("Event", EventSchema);
