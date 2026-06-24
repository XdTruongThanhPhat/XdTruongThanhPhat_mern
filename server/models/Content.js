import mongoose from "mongoose";

const contentSchema = new mongoose.Schema({
    projectId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Project', 
        required: true,
        unique: true // Mỗi project thường chỉ có 1 bài viết chi tiết
    },
    sections: [{
        heading: { type: String },
        headingType: { type: String, default: "h2" }, // 'h1', 'h2', 'h3', 'h4'
        paragraph: { type: String },
        imageUrl: { type: String },
        caption: { type: String }
    }],
    focusKeyword: { type: String, default: "" },
    lsiKeywords: { type: String, default: "" },
    seoTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" }
}, { timestamps: true });

const Content = mongoose.models.Content || mongoose.model("Content", contentSchema);
export default Content;