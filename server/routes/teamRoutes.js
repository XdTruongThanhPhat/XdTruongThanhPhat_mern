import express from "express";
import multer from "multer";
import { getTeamData, updateBanner, addManager, deleteManager, addStaff, deleteStaff } from "../controllers/teamController.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", getTeamData);
router.put("/banner", upload.single("banner"), updateBanner);
router.post("/management", upload.single("image"), addManager);
router.delete("/management/:id", deleteManager);
router.post("/staff", upload.array("images", 10), addStaff);
router.delete("/staff/:id", deleteStaff);

export default router;