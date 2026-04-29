import Banner from "../models/Banner.js";
import cloudinary from "../config/cloudinary.js";

// [GET] Lấy danh sách banner
export const getBanners = async (req, res) => {
    try {
        const banners = await Banner.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, banners });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// [POST] Thêm banner mới
export const addBanner = async (req, res) => {
    try {
        const { title, subtitle } = req.body;
        if (!req.file) return res.status(400).json({ success: false, message: "Vui lòng chọn ảnh!" });
        
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        const dataURI = `data:${req.file.mimetype};base64,${b64}`;
        const uploadResult = await cloudinary.uploader.upload(dataURI, { folder: 'TTP_Banners' });
        
        const newBanner = await Banner.create({ title, subtitle, imageUrl: uploadResult.secure_url });
        res.status(201).json({ success: true, banner: newBanner });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// [DELETE] Xóa banner
export const deleteBanner = async (req, res) => {
    try {
        await Banner.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Đã xóa banner" });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};