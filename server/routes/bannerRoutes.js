import express from "express";
import multer from "multer";
import { getBanners, addBanner, deleteBanner } from "../controllers/bannerController.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", getBanners);
router.post("/", upload.single("image"), addBanner);
router.delete("/:id", deleteBanner);

export default router;