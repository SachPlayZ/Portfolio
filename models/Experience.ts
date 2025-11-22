import mongoose from "mongoose";

const ExperienceSchema = new mongoose.Schema({
  orgName: { type: String, required: true },
  orgIcon: { type: String },
  startDate: { type: String, required: true },
  endDate: { type: String },
  workDone: [{ type: String }],
}, { timestamps: true });

export default mongoose.models.Experience || mongoose.model("Experience", ExperienceSchema);

