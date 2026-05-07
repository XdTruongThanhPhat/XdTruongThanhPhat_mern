import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/db.js";
import projectRouter from "./routes/projectRoutes.js";
import teamRouter from "./routes/teamRoutes.js";
import testimonialRouter from "./routes/testimonialRoutes.js"
import blogRouter from "./routes/blogRoutes.js";
import bannerRouter from "./routes/bannerRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import contactRoutes from './routes/contactRoutes.js';
import { setServers } from "dns";
setServers(["8.8.8.8", "8.8.4.4"]);

const app = express();
const PORT = process.env.PORT || 5000;

// CORS - cho phép domain từ biến môi trường
const allowedOrigins = [
  process.env.CLIENT_URL,              // https://hoangitk.io.vn
  process.env.ADMIN_URL,               // https://admin.hoangitk.io.vn
  "http://hoangitk.io.vn",            // HTTP fallback
  "http://www.hoangitk.io.vn",
  "https://www.hoangitk.io.vn",
  "http://admin.hoangitk.io.vn",
  "http://localhost:3000",
  "http://localhost:3001",
].filter(Boolean); // loại bỏ giá trị undefined

app.use(cors({
  origin: function (origin, callback) {
    // Cho phép request không có origin (Postman, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS: " + origin));
  },
  credentials: true,
}));
app.use(express.json());
// LƯU Ý: Đã xóa app.use(multer().none()) để cho phép nhận file

// Kết nối Database
await connectDB();

// API Routes
app.use("/api/projects", projectRouter);
app.use("/api/team", teamRouter);
app.use("/api/testimonials", testimonialRouter);
app.use("/api/blogs", blogRouter);
app.use("/api/banners", bannerRouter);
app.use("/api/auth", authRoutes);
app.use('/api/contact', contactRoutes);

app.get("/", (req, res) => res.send("Server is running"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
