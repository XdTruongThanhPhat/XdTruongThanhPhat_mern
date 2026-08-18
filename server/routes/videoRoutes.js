import express from "express";
import { getVideos, getVideoById, addVideo, updateVideo, deleteVideo, toggleFeaturedVideo } from "../controllers/videoController.js";

const router = express.Router();

router.get("/", getVideos);
router.get("/:id", getVideoById);
router.post("/", addVideo);
router.put("/:id", updateVideo);
router.delete("/:id", deleteVideo);
router.patch("/:id/feature", toggleFeaturedVideo);

export default router;
