import mongoose from 'mongoose';

const MONGODB_URI = "mongodb+srv://Xuanhoang:Xuanhoang1823@cluster0.lpudegm.mongodb.net/Mern-TTP";

const blogSchema = new mongoose.Schema({
  title: String,
  category: String,
  content: String,
  focusKeyword: String,
  metaDescription: String,
  createdAt: Date
});

const Blog = mongoose.model('Blog', blogSchema, 'blogs');

async function main() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    const blogs = await Blog.find({}).sort({ createdAt: -1 });
    console.log(`Found ${blogs.length} articles:`);

    blogs.forEach((b, idx) => {
      console.log(`\n--- BÀI VIẾT #${idx + 1} ---`);
      console.log(`Tiêu đề: ${b.title}`);
      console.log(`Danh mục: ${b.category}`);
      console.log(`Từ khóa chính: ${b.focusKeyword || 'Chưa thiết lập'}`);
      console.log(`Meta Description: ${b.metaDescription || 'Chưa thiết lập'}`);

      // Lấy đoạn ngắn nội dung
      const cleanText = b.content ? b.content.replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ').substring(0, 200) + '...' : '';
      console.log(`Nội dung tóm tắt: ${cleanText}`);
    });

    await mongoose.disconnect();
  } catch (error) {
    console.error("Lỗi:", error);
  }
}

main();
