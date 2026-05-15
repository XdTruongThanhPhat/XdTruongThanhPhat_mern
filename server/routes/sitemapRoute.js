import express from 'express';
import Project from '../models/Project.js';
import Blog from '../models/Blog.js';

const router = express.Router();

// Hàm tạo slug (giống y hệt trên Frontend)
const generateSlug = (text) => {
  if (!text) return '';
  return text.toString().toLowerCase()
    .replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ặ|ẵ|â|ấ|ầ|ẩ|ậ|ẫ/g, "a")
    .replace(/é|è|ẻ|ẹ|ẽ|ê|ế|ề|ể|ệ|ễ/g, "e")
    .replace(/i|í|ì|ỉ|ị|ĩ/g, "i")
    .replace(/ó|ò|ỏ|ọ|õ|ô|ố|ồ|ổ|ộ|ỗ|ơ|ớ|ờ|ở|ợ|ỡ/g, "o")
    .replace(/ú|ù|ủ|ụ|ũ|ư|ứ|ừ|ử|ự|ữ/g, "u")
    .replace(/ý|ỳ|ỷ|ỵ|ỹ/g, "y")
    .replace(/đ/g, "d")
    .replace(/([^0-9a-z-\s])/g, '')
    .replace(/(\s+)/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
};

router.get('/sitemap.xml', async (req, res) => {
  try {
    // 1. Lấy tất cả Dự án và Bài viết từ Database
    const projects = await Project.find({}).select('title updatedAt _id').sort({ createdAt: -1 });
    const blogs = await Blog.find({}).select('title updatedAt _id').sort({ createdAt: -1 });
    
    const baseUrl = 'https://truongthanhphatdn.vn';

    // 2. Khởi tạo cấu trúc XML và thêm các trang tĩnh
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Trang tĩnh -->
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/hang-muc-cong-trinh</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/bao-gia</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/lien-he</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/ve-ttp</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${baseUrl}/ve-ttp/doi-ngu-nhan-su</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${baseUrl}/tin-tuc</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`;

    // 3. Thêm các URL Dự án (Dynamic)
    if (projects && projects.length > 0) {
      xml += `\n  <!-- Dự án -->`;
      projects.forEach((p) => {
        const slug = generateSlug(p.title);
        // Lấy ngày cập nhật (nếu không có thì lấy ngày hiện tại)
        const lastmod = p.updatedAt ? new Date(p.updatedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
        
        xml += `
  <url>
    <loc>${baseUrl}/hang-muc/cong-trinh-chi-tiet/${slug}-${p._id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
      });
    }

    // 4. Thêm các URL Bài viết (Dynamic)
    if (blogs && blogs.length > 0) {
      xml += `\n  <!-- Bài viết Tin tức -->`;
      blogs.forEach((b) => {
        const slug = generateSlug(b.title);
        const lastmod = b.updatedAt ? new Date(b.updatedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
        
        xml += `
  <url>
    <loc>${baseUrl}/tin-tuc/${slug}-${b._id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
      });
    }

    // 5. Đóng thẻ XML
    xml += '\n</urlset>';

    // 6. Trả về đúng định dạng XML
    res.set('Content-Type', 'application/xml');
    res.send(xml);

  } catch (error) {
    console.error("Lỗi tạo sitemap:", error);
    res.status(500).send('Lỗi máy chủ khi tạo sitemap');
  }
});

export default router;
