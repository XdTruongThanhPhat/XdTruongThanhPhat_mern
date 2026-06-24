import Team from "../models/Team.js";
import cloudinary from "../config/cloudinary.js";

const uploadToCloudinary = async (file) => {
    const b64 = Buffer.from(file.buffer).toString("base64");
    const dataURI = `data:${file.mimetype};base64,${b64}`;
    const result = await cloudinary.uploader.upload(dataURI, {
        folder: 'TTP_Team',
        transformation: [{ quality: 'auto:good', fetch_format: 'auto' }]
    });
    return result.secure_url;
};

// Hàm Helper: Đảm bảo luôn có 1 tài liệu Team trong DB
const getOrCreateTeamDoc = async () => {
    let team = await Team.findOne();
    if (!team) {
        team = await Team.create({});
    }
    return team;
};

// [GET] Lấy dữ liệu toàn bộ trang Team
export const getTeamData = async (req, res) => {
    try {
        const team = await getOrCreateTeamDoc();
        res.status(200).json({ success: true, team });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// [PUT] Cập nhật Banner
export const updateBanner = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ success: false, message: "Vui lòng chọn ảnh!" });
        const bannerUrl = await uploadToCloudinary(req.file);
        const team = await getOrCreateTeamDoc();
        team.bannerUrl = bannerUrl;
        await team.save();
        res.status(200).json({ success: true, message: "Cập nhật Banner thành công", team });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// [POST] Thêm Quản lý
export const addManager = async (req, res) => {
    try {
        const { name, role } = req.body;
        if (!req.file) return res.status(400).json({ success: false, message: "Vui lòng chọn ảnh quản lý!" });
        const imageUrl = await uploadToCloudinary(req.file);
        
        const team = await getOrCreateTeamDoc();
        team.management.push({ name, role, imageUrl });
        await team.save();
        res.status(200).json({ success: true, message: "Thêm Quản lý thành công", team });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// [DELETE] Xóa Quản lý
export const deleteManager = async (req, res) => {
    try {
        const team = await getOrCreateTeamDoc();
        team.management = team.management.filter(m => m._id.toString() !== req.params.id);
        await team.save();
        res.status(200).json({ success: true, message: "Xóa Quản lý thành công", team });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// [POST] Thêm ảnh Nhân viên (Nhiều ảnh)
export const addStaff = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) return res.status(400).json({ success: false, message: "Chọn ít nhất 1 ảnh!" });
        const team = await getOrCreateTeamDoc();
        
        for (const file of req.files) {
            const imageUrl = await uploadToCloudinary(file);
            team.officeStaff.push({ imageUrl });
        }
        await team.save();
        res.status(200).json({ success: true, message: "Thêm nhân viên thành công", team });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// [DELETE] Xóa ảnh Nhân viên
export const deleteStaff = async (req, res) => {
    try {
        const team = await getOrCreateTeamDoc();
        team.officeStaff = team.officeStaff.filter(s => s._id.toString() !== req.params.id);
        await team.save();
        res.status(200).json({ success: true, message: "Xóa nhân viên thành công", team });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};