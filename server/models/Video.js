import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    youtubeUrl: { type: String, required: true },
    description: { type: String, default: "" },
    content: { type: String, default: "" },
    focusKeyword: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    isFeatured: { type: Boolean, default: false },
    order: { type: Number, default: 0 }
}, { timestamps: true });

const Video = mongoose.models.Video || mongoose.model("Video", videoSchema);
export default Video;
