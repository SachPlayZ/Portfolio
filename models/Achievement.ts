import mongoose from "mongoose";

const AchievementSchema = new mongoose.Schema({
  position: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String },
  link: { type: String },
}, { timestamps: true });

export default mongoose.models.Achievement || mongoose.model("Achievement", AchievementSchema);

