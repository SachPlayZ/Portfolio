import mongoose from "mongoose";

const TechStackSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  proficiency: { type: Number, min: 0, max: 5, required: true },
});

export default mongoose.models.TechStack || mongoose.model("TechStack", TechStackSchema);

