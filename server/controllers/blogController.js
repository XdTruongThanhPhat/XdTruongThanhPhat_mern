import Blog from "../models/Blog.js";
import cloudinary from "../config/cloudinary.js";

export const getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, blogs });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

export const addBlog = async (req, res) => {
    try {
        const { title, category, content, focusKeyword, metaDescription, createdAt } = req.body;
        if (!req.file) return res.status(400).json({ success: false, message: "Cần chọn ảnh bìa!" });
        
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        const dataURI = `data:${req.file.mimetype};base64,${b64}`;
        const uploadResult = await cloudinary.uploader.upload(dataURI, {
            folder: 'TTP_Blogs',
            transformation: [{ quality: 'auto:good', fetch_format: 'auto' }]
        });
        
        const newBlog = await Blog.create({ 
            title, 
            category, 
            content, 
            imageUrl: uploadResult.secure_url, 
            focusKeyword: focusKeyword || '', 
            metaDescription: metaDescription || '',
            ...(createdAt ? { createdAt: new Date(createdAt) } : {})
        });
        if (createdAt) {
            await Blog.collection.updateOne(
                { _id: newBlog._id },
                { $set: { createdAt: new Date(createdAt) } }
            );
            newBlog.createdAt = new Date(createdAt);
        }
        res.status(201).json({ success: true, blog: newBlog });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

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

// API Upload ảnh nhúng trong nội dung Editor
export const uploadBlogImage = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ success: false, message: "Không có file" });
        
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        const dataURI = `data:${req.file.mimetype};base64,${b64}`;
        const uploadResult = await cloudinary.uploader.upload(dataURI, {
            folder: 'TTP_Blogs_Content',
            transformation: [{ quality: 'auto:good', fetch_format: 'auto' }]
        });
        
        res.status(200).json({ success: true, url: uploadResult.secure_url });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateBlog = async (req, res) => {
    try {
        const { title, category, content, focusKeyword, metaDescription, createdAt } = req.body;
        const blog = await Blog.findById(req.params.id);
        
        if (!blog) return res.status(404).json({ success: false, message: "Không tìm thấy bài viết" });

        let imageUrl = blog.imageUrl;

        if (req.file) {
            const b64 = Buffer.from(req.file.buffer).toString("base64");
            const dataURI = `data:${req.file.mimetype};base64,${b64}`;
            const uploadResult = await cloudinary.uploader.upload(dataURI, {
                folder: 'TTP_Blogs',
                transformation: [{ quality: 'auto:good', fetch_format: 'auto' }]
            });
            imageUrl = uploadResult.secure_url;
        }

        blog.title = title || blog.title;
        blog.category = category || blog.category;
        blog.content = content || blog.content;
        blog.imageUrl = imageUrl;
        blog.focusKeyword = focusKeyword !== undefined ? focusKeyword : blog.focusKeyword;
        blog.metaDescription = metaDescription !== undefined ? metaDescription : blog.metaDescription;

        await blog.save();

        if (createdAt) {
            await Blog.collection.updateOne(
                { _id: blog._id },
                { $set: { createdAt: new Date(createdAt) } }
            );
            blog.createdAt = new Date(createdAt);
        }

        res.status(200).json({ success: true, blog });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};