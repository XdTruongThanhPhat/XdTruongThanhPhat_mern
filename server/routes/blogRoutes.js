import express from "express";
import multer from "multer";
import { getBlogs, addBlog, deleteBlog,toggleFeaturedBlog, uploadBlogImage, updateBlog } from "../controllers/blogController.js";

const router = express.Router();

// Cấu hình multer để nhận file ảnh trên bộ nhớ tạm (memory)
const upload = multer({ storage: multer.memoryStorage() });

// [GET] Lấy danh sách tất cả bài viết
router.get("/", getBlogs);

// [POST] Thêm bài viết mới (Sử dụng 'image' làm key để nhận file từ Frontend)
router.post("/", upload.single("image"), addBlog);

// [DELETE] Xóa bài viết theo ID
router.delete("/:id", deleteBlog);

// [PUT] Cập nhật bài viết
router.put("/:id", upload.single("image"), updateBlog);

router.patch("/:id/feature", toggleFeaturedBlog);

router.post('/upload-image', upload.single('image'), uploadBlogImage);

export default router;