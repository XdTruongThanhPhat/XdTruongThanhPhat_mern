import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true }, // VD: Phong thủy, Kinh nghiệm, Mẫu nhà
    content: { type: String, required: true },
    imageUrl: { type: String, required: true },
    author: { type: String, default: "TTP Architect" },
    isFeatured: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.Blog || mongoose.model("Blog", blogSchema);