import Content from "../models/Content.js";
import cloudinary from "../config/cloudinary.js";

const uploadToCloudinary = async (file) => {
    const b64 = Buffer.from(file.buffer).toString("base64");
    const dataURI = `data:${file.mimetype};base64,${b64}`;
    const result = await cloudinary.uploader.upload(dataURI, { folder: 'TTP_Contents' });
    return result.secure_url;
};

// [POST/PUT] Thêm hoặc Cập nhật Content cho Project
export const upsertContent = async (req, res) => {
    try {
        const { projectId } = req.params;
        const sectionsData = req.body.sections ? JSON.parse(req.body.sections) : [];

        const contentImages = [];
        if (req.files && req.files['contentImages']) {
            for (const file of req.files['contentImages']) {
                const url = await uploadToCloudinary(file);
                contentImages.push(url);
            }
        }

        let imgIdx = 0;
        const formattedSections = sectionsData.map(sec => ({
            heading: sec.heading || "",
            paragraph: sec.paragraph || "",
            caption: sec.caption || "",
            imageUrl: sec.hasImage ? contentImages[imgIdx++] : (sec.imageUrl || "")
        }));

        const content = await Content.findOneAndUpdate(
            { projectId },
            { sections: formattedSections },
            { upsert: true, new: true }
        );

        res.status(200).json({ success: true, message: "Cập nhật bài viết thành công", content });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// [GET] Lấy Content theo Project ID
export const getContentByProject = async (req, res) => {
    try {
        const content = await Content.findOne({ projectId: req.params.projectId });
        res.status(200).json({ success: true, content });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};