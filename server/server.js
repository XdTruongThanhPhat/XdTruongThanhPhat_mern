import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/db.js";
import projectRouter from "./routes/projectRoutes.js";
import teamRouter from "./routes/teamRoutes.js";
import testimonialRouter from "./routes/testimonialRoutes.js"
import { setServers } from "dns";
setServers(["8.8.8.8", "8.8.4.4"]);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
// LƯU Ý: Đã xóa app.use(multer().none()) để cho phép nhận file

// Kết nối Database
await connectDB();

// API Routes
app.use("/api/projects", projectRouter);
app.use("/api/team", teamRouter);
app.use("/api/testimonials", testimonialRouter);

app.get("/", (req, res) => res.send("Server is running"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
