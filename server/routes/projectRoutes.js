import express from "express";
import { addProject, getProjects, getProjectById, deleteProject, updateProject, toggleFeatured } from "../controllers/projectController.js";
import { upsertContent, getContentByProject } from "../controllers/contentController.js";
import multer from "multer";

const router = express.Router();
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB per file
        fieldSize: 50 * 1024 * 1024, // 50MB per field (cho existingImages JSON lớn khi có nhiều ảnh)
    }
});

// Routes cho Project
router.post("/add", upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'projectImages', maxCount: 50 }
]), addProject);

router.get("/list", getProjects);

// [GET] Chi tiết 1 Project (trả đầy đủ data bao gồm projectImages)
router.get("/detail/:id", getProjectById);

router.delete("/:id", deleteProject);

router.patch("/:id/feature", toggleFeatured);

// 🔥 ĐÃ SỬA LỖI 500 TẠI ĐÂY: Thêm 'upload.fields' để server nhận được file ảnh khi Sửa dự án
router.put("/:id", upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'projectImages', maxCount: 50 }
]), updateProject);

// Routes cho Content (Bài viết)
router.post("/content/:projectId", upload.fields([
    { name: 'contentImages', maxCount: 10 }
]), upsertContent);

router.get("/content/:projectId", getContentByProject);

export default router;