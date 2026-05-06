import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// [POST] Đăng nhập
export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const admin = await Admin.findOne({ username });
        if (!admin) return res.status(400).json({ success: false, message: "Tài khoản không tồn tại!" });

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(400).json({ success: false, message: "Mật khẩu không đúng!" });

        // Tạo token sống trong 1 ngày
        const token = jwt.sign({ id: admin._id, username: admin.username }, process.env.JWT_SECRET || 'TTP_SECRET_KEY', { expiresIn: '1d' });
        
        res.status(200).json({ success: true, message: "Đăng nhập thành công", token, username: admin.username });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// [POST] Tạo Admin mới (Chỉ admin đang đăng nhập mới làm được)
export const createAdmin = async (req, res) => {
    try {
        const { username, password } = req.body;
        const existingAdmin = await Admin.findOne({ username });
        if (existingAdmin) return res.status(400).json({ success: false, message: "Tên đăng nhập đã tồn tại!" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await Admin.create({ username, password: hashedPassword });
        res.status(201).json({ success: true, message: "Tạo tài khoản Admin thành công!" });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// [PUT] Đổi mật khẩu
export const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const admin = await Admin.findById(req.admin.id); // Lấy từ token của authMiddleware

        const isMatch = await bcrypt.compare(oldPassword, admin.password);
        if (!isMatch) return res.status(400).json({ success: false, message: "Mật khẩu cũ không đúng!" });

        const salt = await bcrypt.genSalt(10);
        admin.password = await bcrypt.hash(newPassword, salt);
        await admin.save();

        res.status(200).json({ success: true, message: "Đổi mật khẩu thành công!" });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};