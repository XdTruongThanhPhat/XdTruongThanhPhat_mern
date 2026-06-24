import Testimonial from "../models/Testimonial.js";
import cloudinary from "../config/cloudinary.js";

const uploadToCloudinary = async (file) => {
    const b64 = Buffer.from(file.buffer).toString("base64");
    const dataURI = `data:${file.mimetype};base64,${b64}`;
    const result = await cloudinary.uploader.upload(dataURI, {
        folder: 'TTP_Testimonials',
        transformation: [{ quality: 'auto:good', fetch_format: 'auto' }]
    });
    return result.secure_url;
};

// [GET] Lấy danh sách phản hồi
export const getTestimonials = async (req, res) => {
    try {
        const testimonials = await Testimonial.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, testimonials });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// [POST] Thêm phản hồi mới
export const addTestimonial = async (req, res) => {
    try {
        const { name, content } = req.body;
        if (!req.file) return res.status(400).json({ success: false, message: "Vui lòng tải lên ảnh khách hàng!" });
        
        const avatar = await uploadToCloudinary(req.file);
        const newTestimonial = await Testimonial.create({ name, content, avatar });
        
        res.status(201).json({ success: true, message: "Thêm phản hồi thành công", testimonial: newTestimonial });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// [PUT] Cập nhật phản hồi
export const updateTestimonial = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, content, existingAvatar } = req.body;
        let avatar = existingAvatar;

        if (req.file) {
            avatar = await uploadToCloudinary(req.file);
        }

        const updatedTestimonial = await Testimonial.findByIdAndUpdate(
            id, { name, content, avatar }, { new: true }
        );

        res.status(200).json({ success: true, message: "Cập nhật thành công", testimonial: updatedTestimonial });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// [DELETE] Xóa phản hồi
export const deleteTestimonial = async (req, res) => {
    try {
        await Testimonial.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Xóa phản hồi thành công" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};