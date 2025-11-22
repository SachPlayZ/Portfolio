import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  overview: { type: String },
  demoVideoEmbed: { type: String },
  images: [{ type: String }],
  description: { type: String, required: true },
  techStack: [{ type: String }],
  links: [{
     name: String,
     url: String
  }],
  featured: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.Project || mongoose.model("Project", ProjectSchema);

