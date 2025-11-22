import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String },
  description: { type: String, required: true },
  content: { type: String, required: true }, // Markdown
  featured: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.Blog || mongoose.model("Blog", BlogSchema);

