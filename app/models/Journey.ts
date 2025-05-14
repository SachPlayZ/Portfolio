import mongoose from "mongoose";

const journeySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    type: {
      type: String,
      required: true,
      enum: ["education", "work", "achievement"],
    },
    location: { type: String },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Journey ||
  mongoose.model("Journey", journeySchema);
