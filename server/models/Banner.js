import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    imageUrl: { type: String, required: true }
}, { timestamps: true });

export default mongoose.models.Banner || mongoose.model("Banner", bannerSchema);