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
    const projects = await Project.find({}).select('title updatedAt _id mainImage').sort({ createdAt: -1 });
    const blogs = await Blog.find({}).select('title updatedAt _id imageUrl').sort({ createdAt: -1 });
    
    const baseUrl = 'https://truongthanhphatdn.vn';
    const today = new Date().toISOString().split('T')[0];

    // Lấy lastmod động: ngày cập nhật mới nhất của dự án/bài viết
    const latestProjectDate = projects.length > 0 && projects[0].updatedAt
      ? new Date(projects[0].updatedAt).toISOString().split('T')[0] : today;
    const latestBlogDate = blogs.length > 0 && blogs[0].updatedAt
      ? new Date(blogs[0].updatedAt).toISOString().split('T')[0] : today;

    // 2. Khởi tạo cấu trúc XML và thêm các trang tĩnh
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <!-- Trang chủ -->
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- Trang Hạng mục công trình (Tất cả) -->
  <url>
    <loc>${baseUrl}/hang-muc-cong-trinh</loc>
    <lastmod>${latestProjectDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>

  <!-- Hạng mục: Nội thất -->
  <url>
    <loc>${baseUrl}/hang-muc-cong-trinh/noi-that</loc>
    <lastmod>${latestProjectDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <!-- Hạng mục: Biệt thự -->
  <url>
    <loc>${baseUrl}/hang-muc-cong-trinh/biet-thu</loc>
    <lastmod>${latestProjectDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <!-- Hạng mục: Căn hộ -->
  <url>
    <loc>${baseUrl}/hang-muc-cong-trinh/can-ho</loc>
    <lastmod>${latestProjectDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <!-- Hạng mục: Nhà phố -->
  <url>
    <loc>${baseUrl}/hang-muc-cong-trinh/nha-pho</loc>
    <lastmod>${latestProjectDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <!-- Hạng mục: Công trình thực tế -->
  <url>
    <loc>${baseUrl}/hang-muc-cong-trinh/cong-trinh-thuc-te</loc>
    <lastmod>${latestProjectDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <!-- Trang Báo giá -->
  <url>
    <loc>${baseUrl}/bao-gia</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

  <!-- Trang Tin tức -->
  <url>
    <loc>${baseUrl}/tin-tuc</loc>
    <lastmod>${latestBlogDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>

  <!-- Trang Về TTP -->
  <url>
    <loc>${baseUrl}/ve-ttp</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>

  <!-- Trang Đội ngũ nhân sự -->
  <url>
    <loc>${baseUrl}/ve-ttp/doi-ngu-nhan-su</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>

  <!-- Trang Liên hệ -->
  <url>
    <loc>${baseUrl}/lien-he</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;

    // 3. Thêm các URL Dự án (Dynamic)
    if (projects && projects.length > 0) {
      xml += `\n\n  <!-- Dự án chi tiết -->`;
      projects.forEach((p) => {
        const slug = generateSlug(p.title);
        const lastmod = p.updatedAt ? new Date(p.updatedAt).toISOString().split('T')[0] : today;
        
        xml += `
  <url>
    <loc>${baseUrl}/hang-muc/cong-trinh-chi-tiet/${slug}-${p._id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>${p.mainImage ? `
    <image:image>
      <image:loc>${p.mainImage}</image:loc>
      <image:title>${p.title}</image:title>
    </image:image>` : ''}
  </url>`;
      });
    }

    // 4. Thêm các URL Bài viết (Dynamic)
    if (blogs && blogs.length > 0) {
      xml += `\n\n  <!-- Bài viết Tin tức -->`;
      blogs.forEach((b) => {
        const slug = generateSlug(b.title);
        const lastmod = b.updatedAt ? new Date(b.updatedAt).toISOString().split('T')[0] : today;
        
        xml += `
  <url>
    <loc>${baseUrl}/tin-tuc/${slug}-${b._id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>${b.imageUrl ? `
    <image:image>
      <image:loc>${b.imageUrl}</image:loc>
      <image:title>${b.title}</image:title>
    </image:image>` : ''}
  </url>`;
      });
    }

    // 5. Đóng thẻ XML
    xml += '\n</urlset>';

    // 6. Trả về đúng định dạng XML với cache 1 giờ
    res.set('Content-Type', 'application/xml');
    res.set('Cache-Control', 'public, max-age=3600');
    res.send(xml);

  } catch (error) {
    console.error("Lỗi tạo sitemap:", error);
    res.status(500).send('Lỗi máy chủ khi tạo sitemap');
  }
});

export default router;
