import express from "express";
import multer from "multer";
import { getTestimonials, addTestimonial, updateTestimonial, deleteTestimonial } from "../controllers/testimonialController.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", getTestimonials);
router.post("/", upload.single("avatar"), addTestimonial);
router.put("/:id", upload.single("avatar"), updateTestimonial);
router.delete("/:id", deleteTestimonial);

export default router;