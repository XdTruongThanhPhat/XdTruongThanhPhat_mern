import express from "express";
import { addProject, getProjects, deleteProject, updateProject,toggleFeatured } from "../controllers/projectController.js";
import { upsertContent, getContentByProject } from "../controllers/contentController.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Routes cho Project
router.post("/add", upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'projectImages', maxCount: 20 }
]), addProject);

router.get("/list", getProjects);

router.delete("/:id", deleteProject);

router.patch("/:id/feature", toggleFeatured);

// 🔥 ĐÃ SỬA LỖI 500 TẠI ĐÂY: Thêm 'upload.fields' để server nhận được file ảnh khi Sửa dự án
router.put("/:id", upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'projectImages', maxCount: 20 }
]), updateProject);

// Routes cho Content (Bài viết)
router.post("/content/:projectId", upload.fields([
    { name: 'contentImages', maxCount: 10 }
]), upsertContent);

router.get("/content/:projectId", getContentByProject);

export default router;