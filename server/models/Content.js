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
        paragraph: { type: String },
        imageUrl: { type: String },
        caption: { type: String }
    }]
}, { timestamps: true });

const Content = mongoose.models.Content || mongoose.model("Content", contentSchema);
export default Content;