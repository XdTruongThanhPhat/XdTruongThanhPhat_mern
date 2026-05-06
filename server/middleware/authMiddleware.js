import jwt from 'jsonwebtoken';

export const protectRoute = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ success: false, message: "Không có quyền truy cập!" });

        // Giải mã token (Sử dụng chuỗi bí mật, mặc định ở đây là 'TTP_SECRET_KEY')
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'TTP_SECRET_KEY');
        req.admin = decoded; // Lưu thông tin admin vào request
        next(); // Cho phép đi tiếp
    } catch (error) {
        res.status(401).json({ success: false, message: "Token không hợp lệ hoặc đã hết hạn!" });
    }
};