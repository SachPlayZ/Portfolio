import mongoose from "mongoose";

const AchievementSchema = new mongoose.Schema(
  {
    position: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String },
    link: { type: String },
    order: {
      type: Number,
      default: () => Date.now(),
      index: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Achievement || mongoose.model("Achievement", AchievementSchema);

