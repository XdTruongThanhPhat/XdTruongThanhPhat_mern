import express from "express";
import { login, createAdmin, changePassword } from "../controllers/authController.js";
import { protectRoute } from "../middleware/authMiddleware.js";
import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";

const router = express.Router();

// TỰ ĐỘNG TẠO TÀI KHOẢN MẶC ĐỊNH NẾU CHƯA CÓ
const initAdmin = async () => {
    const count = await Admin.countDocuments();
    if (count === 0) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("admin123", salt);
        await Admin.create({ username: "admin", password: hashedPassword });
        console.log("✅ Đã tạo tài khoản mặc định: admin / admin123");
    }
};
initAdmin();

router.post("/login", login);
router.post("/create", protectRoute, createAdmin); // Phải có token mới được tạo
router.put("/change-password", protectRoute, changePassword); // Phải có token mới đổi pass được

export default router;