import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, default: "" }, // Thêm dòng này để lưu mô tả ngắn
    isFeatured: { type: Boolean, default: false }, // Thêm dòng này (Mặc định là ko nổi bật)
    mainImage: { type: String, required: true }, // Ảnh bìa đại diện
    projectImages: [{ type: String }],
    info: {
        location: { type: String },
        floors: { type: String },
        landArea: { type: String },
        buildArea: { type: String },
        cost: { type: String }
    }
}, { timestamps: true });

const Project = mongoose.models.Project || mongoose.model("Project", projectSchema);
export default Project;