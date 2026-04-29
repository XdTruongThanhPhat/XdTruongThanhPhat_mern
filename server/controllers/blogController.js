import Blog from "../models/Blog.js";
import cloudinary from "../config/cloudinary.js";

// [GET] Danh sách Blog
export const getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, blogs });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// [POST] Thêm Blog
export const addBlog = async (req, res) => {
    try {
        const { title, category, content } = req.body;
        if (!req.file) return res.status(400).json({ success: false, message: "Cần chọn ảnh bìa!" });
        
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        const dataURI = `data:${req.file.mimetype};base64,${b64}`;
        const uploadResult = await cloudinary.uploader.upload(dataURI, { folder: 'TTP_Blogs' });
        
        const newBlog = await Blog.create({ title, category, content, imageUrl: uploadResult.secure_url });
        res.status(201).json({ success: true, blog: newBlog });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// [DELETE] Xóa Blog
export const deleteBlog = async (req, res) => {
    try {
        await Blog.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Đã xóa bài viết" });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};
export const toggleFeaturedBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ success: false, message: "Không tìm thấy bài viết" });

        // Nếu bật sao cho bài này, thì phải tắt sao của TẤT CẢ các bài khác (vì ta chỉ cho phép 1 bài nổi bật)
        if (!blog.isFeatured) {
            await Blog.updateMany({}, { isFeatured: false });
        }

        blog.isFeatured = !blog.isFeatured;
        await blog.save();

        res.status(200).json({ success: true, isFeatured: blog.isFeatured });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};