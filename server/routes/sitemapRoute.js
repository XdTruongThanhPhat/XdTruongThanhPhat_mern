import express from 'express';
import Project from '../models/Project.js';
import Blog from '../models/Blog.js';

const router = express.Router();

const BASE_URL = 'https://truongthanhphatdn.vn';

// =============================================
// HÀM TẠO SLUG (giống y hệt trên Frontend)
// =============================================
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

// =============================================
// HÀM ESCAPE KÝ TỰ ĐẶC BIỆT CHO XML
// =============================================
const escapeXml = (unsafe) => {
  if (!unsafe) return '';
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case "'": return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
};

// =============================================
// HÀM ĐỊNH DẠNG NGÀY ISO (YYYY-MM-DD)
// =============================================
const toISODate = (date) => {
  if (!date) return new Date().toISOString().split('T')[0];
  return new Date(date).toISOString().split('T')[0];
};

// =============================================
// ROUTE 1: ROBOTS.TXT ĐỘNG
// Trả về file robots.txt chuẩn SEO
// =============================================
router.get('/robots.txt', (req, res) => {
  const robotsTxt = `# Trường Thành Phát - robots.txt
# Cập nhật tự động từ server

User-agent: *
Allow: /

# Chặn các đường dẫn không cần index
Disallow: /api/
Disallow: /*.json$

# Sitemap động (tự động cập nhật từ database)
Sitemap: ${BASE_URL}/sitemap.xml
`;

  res.set('Content-Type', 'text/plain');
  res.set('Cache-Control', 'public, max-age=86400'); // Cache 1 ngày
  res.send(robotsTxt);
});

// =============================================
// ROUTE 2: SITEMAP.XML CHÍNH
// Chứa tất cả URL (tĩnh + động từ DB)
// Google sẽ crawl file này để lập chỉ mục
// =============================================
router.get('/sitemap.xml', async (req, res) => {
  try {
    // 1. Lấy tất cả Dự án và Bài viết từ Database
    const [projects, blogs] = await Promise.all([
      Project.find({}).select('title updatedAt _id mainImage').sort({ createdAt: -1 }),
      Blog.find({}).select('title updatedAt _id imageUrl').sort({ createdAt: -1 })
    ]);
    
    const today = toISODate();

    // Lấy lastmod động: ngày cập nhật mới nhất
    const latestProjectDate = projects.length > 0 && projects[0].updatedAt
      ? toISODate(projects[0].updatedAt) : today;
    const latestBlogDate = blogs.length > 0 && blogs[0].updatedAt
      ? toISODate(blogs[0].updatedAt) : today;

    // 2. Khởi tạo cấu trúc XML
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <!-- ==================== TRANG TĨNH ==================== -->

  <!-- Trang chủ -->
  <url>
    <loc>${BASE_URL}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- Trang Hạng mục công trình (Tất cả) -->
  <url>
    <loc>${BASE_URL}/hang-muc-cong-trinh</loc>
    <lastmod>${latestProjectDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>

  <!-- Hạng mục: Nội thất -->
  <url>
    <loc>${BASE_URL}/hang-muc-cong-trinh/noi-that</loc>
    <lastmod>${latestProjectDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <!-- Hạng mục: Biệt thự -->
  <url>
    <loc>${BASE_URL}/hang-muc-cong-trinh/biet-thu</loc>
    <lastmod>${latestProjectDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <!-- Hạng mục: Căn hộ -->
  <url>
    <loc>${BASE_URL}/hang-muc-cong-trinh/can-ho</loc>
    <lastmod>${latestProjectDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <!-- Hạng mục: Nhà phố -->
  <url>
    <loc>${BASE_URL}/hang-muc-cong-trinh/nha-pho</loc>
    <lastmod>${latestProjectDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <!-- Hạng mục: Công trình thi công -->
  <url>
    <loc>${BASE_URL}/hang-muc-cong-trinh/cong-trinh-thuc-te</loc>
    <lastmod>${latestProjectDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <!-- Trang Báo giá -->
  <url>
    <loc>${BASE_URL}/bao-gia</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

  <!-- Trang Tin tức -->
  <url>
    <loc>${BASE_URL}/tin-tuc</loc>
    <lastmod>${latestBlogDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>

  <!-- Trang Về TTP -->
  <url>
    <loc>${BASE_URL}/ve-ttp</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>

  <!-- Trang Đội ngũ nhân sự -->
  <url>
    <loc>${BASE_URL}/ve-ttp/doi-ngu-nhan-su</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>

  <!-- Trang Liên hệ -->
  <url>
    <loc>${BASE_URL}/lien-he</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;

    // 3. THÊM CÁC URL DỰ ÁN (Dynamic từ Database)
    if (projects && projects.length > 0) {
      xml += `\n\n  <!-- ==================== DỰ ÁN CHI TIẾT ==================== -->`;
      projects.forEach((p) => {
        const slug = generateSlug(p.title);
        const lastmod = toISODate(p.updatedAt);
        
        xml += `
  <url>
    <loc>${BASE_URL}/hang-muc/cong-trinh-chi-tiet/${slug}-${p._id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>${p.mainImage ? `
    <image:image>
      <image:loc>${escapeXml(p.mainImage)}</image:loc>
      <image:title>${escapeXml(p.title)}</image:title>
    </image:image>` : ''}
  </url>`;
      });
    }

    // 4. THÊM CÁC URL BÀI VIẾT (Dynamic từ Database)
    if (blogs && blogs.length > 0) {
      xml += `\n\n  <!-- ==================== BÀI VIẾT TIN TỨC ==================== -->`;
      blogs.forEach((b) => {
        const slug = generateSlug(b.title);
        const lastmod = toISODate(b.updatedAt);
        
        xml += `
  <url>
    <loc>${BASE_URL}/tin-tuc/${slug}-${b._id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>${b.imageUrl ? `
    <image:image>
      <image:loc>${escapeXml(b.imageUrl)}</image:loc>
      <image:title>${escapeXml(b.title)}</image:title>
    </image:image>` : ''}
  </url>`;
      });
    }

    // 5. Đóng thẻ XML
    xml += '\n</urlset>';

    // 6. Trả về đúng định dạng XML
    // QUAN TRỌNG: Không cache sitemap để Google luôn nhận bản mới nhất
    res.set('Content-Type', 'application/xml');
    res.set('Cache-Control', 'public, max-age=600, s-maxage=600'); // Cache 10 phút (cân bằng giữa performance và freshness)
    res.send(xml);

  } catch (error) {
    console.error("Lỗi tạo sitemap:", error);
    res.status(500).send('Lỗi máy chủ khi tạo sitemap');
  }
});

export default router;
