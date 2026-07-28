/**
 * SSR Route cho Search Engine Bots
 * 
 * MỤC ĐÍCH: Khi Googlebot (hoặc bot tìm kiếm khác) truy cập trang chi tiết
 * bài viết hoặc dự án, route này trả về HTML đầy đủ với nội dung thực từ DB.
 * 
 * LÝ DO: React SPA chỉ trả về <div id="root"></div> — bot không đợi JS render
 * nên Google không thấy nội dung để lập chỉ mục.
 * 
 * CÁCH HOẠT ĐỘNG:
 * 1. Nginx detect User-Agent là bot → proxy request tới route này
 * 2. Route fetch data từ MongoDB
 * 3. Trả về HTML tĩnh đầy đủ (meta tags + nội dung + Schema JSON-LD)
 * 
 * LƯU Ý: Route này KHÔNG ảnh hưởng đến user thường — họ vẫn nhận React SPA.
 */

import express from 'express';
import Blog from '../models/Blog.js';
import Project from '../models/Project.js';
import Content from '../models/Content.js';

const router = express.Router();
const BASE_URL = 'https://truongthanhphatdn.vn';

// =============================================
// HÀM TẠO SLUG (giống y hệt sitemapRoute.js)
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
// HÀM LOẠI BỎ THẺ HTML → LẤY TEXT SẠCH
// =============================================
const stripHtml = (html) => {
  if (!html) return '';
  return html
    .replace(/<[^>]*>?/gm, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
};

// =============================================
// HÀM TẠO META DESCRIPTION TỪ NỘI DUNG
// =============================================
const extractDescription = (htmlContent, maxLength = 155) => {
  const cleanText = stripHtml(htmlContent);
  if (!cleanText) return '';
  return cleanText.substring(0, maxLength) + (cleanText.length > maxLength ? '...' : '');
};

// =============================================
// HÀM ESCAPE KÝ TỰ ĐẶC BIỆT CHO HTML ATTRIBUTE
// =============================================
const escapeHtml = (text) => {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

// =============================================
// ROUTE SSR: TRANG CHI TIẾT BÀI VIẾT TIN TỨC
// URL: /api/ssr/tin-tuc/:slug
// =============================================
router.get('/tin-tuc/:slug', async (req, res) => {
  try {
    const slug = req.params.slug;

    // Trích xuất MongoDB ObjectId từ cuối slug (24 ký tự hex)
    const match = slug.match(/([a-f0-9]{24})$/i);
    const blogId = match ? match[1] : slug;

    // Fetch song song: bài viết chính + bài viết liên quan (để tạo internal links cho SEO)
    const [blog, relatedBlogs] = await Promise.all([
      Blog.findById(blogId),
      Blog.find({ _id: { $ne: blogId } })
        .select('title _id imageUrl')
        .sort({ createdAt: -1 })
        .limit(5)
    ]);
    if (!blog) {
      return res.status(404).send('<!DOCTYPE html><html lang="vi"><head><title>Không tìm thấy</title></head><body><h1>Bài viết không tồn tại</h1></body></html>');
    }

    const canonicalUrl = `${BASE_URL}/tin-tuc/${generateSlug(blog.title)}-${blog._id}`;
    const description = escapeHtml(blog.metaDescription || extractDescription(blog.content));
    const titleEscaped = escapeHtml(blog.title);
    const contentText = stripHtml(blog.content);

    // Schema JSON-LD cho BlogPosting
    const schemaMarkup = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": blog.title,
      "image": blog.imageUrl ? [blog.imageUrl] : [],
      "datePublished": blog.createdAt,
      "dateModified": blog.updatedAt,
      "author": [{
        "@type": "Person",
        "name": blog.author || "TTP Architect",
        "url": BASE_URL
      }],
      "publisher": {
        "@type": "Organization",
        "name": "Trường Thành Phát",
        "logo": {
          "@type": "ImageObject",
          "url": "https://res.cloudinary.com/dia0hytop/image/upload/v1776675604/z7731184451078_e2096bacf215f8b507086b7a6712faa3_bjzvxz.png"
        }
      },
      "description": stripHtml(blog.content).substring(0, 155),
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": canonicalUrl
      }
    };

    // Breadcrumb Schema
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Trang chủ", "item": BASE_URL },
        { "@type": "ListItem", "position": 2, "name": "Tin tức", "item": `${BASE_URL}/tin-tuc` },
        { "@type": "ListItem", "position": 3, "name": blog.title, "item": canonicalUrl }
      ]
    };

    const html = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${titleEscaped} | Trường Thành Phát</title>
  <meta name="description" content="${description}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${canonicalUrl}">

  <!-- Open Graph -->
  <meta property="og:type" content="article">
  <meta property="og:title" content="${titleEscaped}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:site_name" content="Trường Thành Phát">
  <meta property="og:locale" content="vi_VN">
  ${blog.imageUrl ? `<meta property="og:image" content="${escapeHtml(blog.imageUrl)}">` : ''}

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${titleEscaped}">
  <meta name="twitter:description" content="${description}">
  ${blog.imageUrl ? `<meta name="twitter:image" content="${escapeHtml(blog.imageUrl)}">` : ''}

  <!-- Schema JSON-LD -->
  <script type="application/ld+json">${JSON.stringify(schemaMarkup)}</script>
  <script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>
</head>
<body>
  <nav aria-label="Breadcrumb">
    <a href="${BASE_URL}">Trang chủ</a> &gt;
    <a href="${BASE_URL}/tin-tuc">Tin tức</a> &gt;
    <span>${titleEscaped}</span>
  </nav>

  <article>
    <h1>${titleEscaped}</h1>
    <time datetime="${blog.createdAt ? new Date(blog.createdAt).toISOString() : ''}">${blog.createdAt ? new Date(blog.createdAt).toLocaleDateString('vi-VN') : ''}</time>
    <p>Tác giả: ${escapeHtml(blog.author || 'TTP Architect')}</p>
    ${blog.imageUrl ? `<img src="${escapeHtml(blog.imageUrl)}" alt="${titleEscaped}" loading="lazy">` : ''}
    <div>${blog.content || ''}</div>
  </article>

  ${relatedBlogs.length > 0 ? `
  <section>
    <h2>Bài viết liên quan</h2>
    <ul>
      ${relatedBlogs.map(rb => {
        const rbSlug = generateSlug(rb.title);
        return `<li><a href="${BASE_URL}/tin-tuc/${rbSlug}-${rb._id}">${escapeHtml(rb.title)}</a></li>`;
      }).join('\n      ')}
    </ul>
  </section>` : ''}

  <footer>
    <p>© Trường Thành Phát - Thiết kế &amp; Thi công xây dựng tại Đà Nẵng</p>
    <a href="${BASE_URL}">Trang chủ</a> |
    <a href="${BASE_URL}/tin-tuc">Tin tức</a> |
    <a href="${BASE_URL}/hang-muc-cong-trinh">Hạng mục công trình</a> |
    <a href="${BASE_URL}/lien-he">Liên hệ</a>
  </footer>
</body>
</html>`;

    res.set('Content-Type', 'text/html; charset=utf-8');
    res.set('Cache-Control', 'public, max-age=3600'); // Cache 1 giờ
    res.send(html);

  } catch (error) {
    console.error('[SSR] Lỗi render bài viết:', error);
    res.status(500).send('<!DOCTYPE html><html><head><title>Lỗi</title></head><body><h1>Lỗi máy chủ</h1></body></html>');
  }
});

// =============================================
// ROUTE SSR: TRANG CHI TIẾT DỰ ÁN CÔNG TRÌNH
// URL: /api/ssr/hang-muc/cong-trinh-chi-tiet/:slug
// =============================================
router.get('/hang-muc/cong-trinh-chi-tiet/:slug', async (req, res) => {
  try {
    const slug = req.params.slug;

    // Trích xuất MongoDB ObjectId từ cuối slug
    const match = slug.match(/([a-f0-9]{24})$/i);
    const projectId = match ? match[1] : slug;

    // Fetch song song: chi tiết dự án + bài viết content + dự án liên quan (internal links)
    const [project, content, relatedProjects] = await Promise.all([
      Project.findById(projectId),
      Content.findOne({ projectId }),
      Project.find({ _id: { $ne: projectId } })
        .select('title _id mainImage')
        .sort({ createdAt: -1 })
        .limit(5)
    ]);

    if (!project) {
      return res.status(404).send('<!DOCTYPE html><html lang="vi"><head><title>Không tìm thấy</title></head><body><h1>Dự án không tồn tại</h1></body></html>');
    }

    const canonicalUrl = `${BASE_URL}/hang-muc/cong-trinh-chi-tiet/${generateSlug(project.title)}-${project._id}`;
    const titleEscaped = escapeHtml(project.title);

    // Tạo mô tả từ SEO data hoặc thông tin dự án
    const projectDesc = content?.metaDescription
      || project.description
      || `Dự án ${project.title} tại ${project.info?.location || 'Đà Nẵng'}. Thiết kế ${project.info?.floors || ''} tầng, diện tích ${project.info?.buildArea || ''}.`;
    const description = escapeHtml(extractDescription(projectDesc, 155));

    const displayTitle = content?.seoTitle
      ? `${escapeHtml(content.seoTitle)} | Trường Thành Phát`
      : `${titleEscaped} | Trường Thành Phát`;

    // SEO Keywords
    const keywords = [content?.focusKeyword, content?.lsiKeywords].filter(Boolean).join(', ');

    // Schema JSON-LD
    const schemaMarkup = {
      "@context": "https://schema.org",
      "@type": "SingleFamilyResidence",
      "name": project.title,
      "image": project.mainImage ? [project.mainImage] : [],
      "address": {
        "@type": "PostalAddress",
        "addressLocality": project.info?.location || "Đà Nẵng",
        "addressCountry": "VN"
      },
      "description": stripHtml(projectDesc).substring(0, 155)
    };

    // Breadcrumb Schema
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Trang chủ", "item": BASE_URL },
        { "@type": "ListItem", "position": 2, "name": "Hạng mục công trình", "item": `${BASE_URL}/hang-muc-cong-trinh` },
        { "@type": "ListItem", "position": 3, "name": project.title, "item": canonicalUrl }
      ]
    };

    // Render nội dung sections từ Content (nếu có)
    let sectionsHtml = '';
    if (content?.sections && content.sections.length > 0) {
      content.sections.forEach((section, index) => {
        const tag = section.headingType || 'h2';
        if (section.heading) {
          sectionsHtml += `<${tag} id="heading-${index}">${escapeHtml(section.heading)}</${tag}>\n`;
        }
        if (section.paragraph) {
          sectionsHtml += `<div>${section.paragraph}</div>\n`;
        }
        if (section.imageUrl) {
          sectionsHtml += `<img src="${escapeHtml(section.imageUrl)}" alt="${escapeHtml(section.caption || section.heading || project.title)}" loading="lazy">\n`;
          if (section.caption) {
            sectionsHtml += `<p><em>${escapeHtml(section.caption)}</em></p>\n`;
          }
        }
      });
    }

    // Thông tin dự án
    const infoHtml = project.info ? `
    <table>
      ${project.info.location ? `<tr><th>Địa điểm</th><td>${escapeHtml(project.info.location)}</td></tr>` : ''}
      ${project.info.floors ? `<tr><th>Số tầng</th><td>${escapeHtml(project.info.floors)}</td></tr>` : ''}
      ${project.info.landArea ? `<tr><th>Diện tích đất</th><td>${escapeHtml(project.info.landArea)}</td></tr>` : ''}
      ${project.info.buildArea ? `<tr><th>Diện tích xây dựng</th><td>${escapeHtml(project.info.buildArea)}</td></tr>` : ''}
      ${project.info.cost ? `<tr><th>Chi phí</th><td>${escapeHtml(project.info.cost)}</td></tr>` : ''}
    </table>` : '';

    const html = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${displayTitle}</title>
  <meta name="description" content="${description}">
  <meta name="robots" content="index, follow">
  ${keywords ? `<meta name="keywords" content="${escapeHtml(keywords)}">` : ''}
  <link rel="canonical" href="${canonicalUrl}">

  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escapeHtml(content?.seoTitle || project.title)}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:site_name" content="Trường Thành Phát">
  <meta property="og:locale" content="vi_VN">
  ${project.mainImage ? `<meta property="og:image" content="${escapeHtml(project.mainImage)}">` : ''}

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(content?.seoTitle || project.title)}">
  <meta name="twitter:description" content="${description}">
  ${project.mainImage ? `<meta name="twitter:image" content="${escapeHtml(project.mainImage)}">` : ''}

  <!-- Schema JSON-LD -->
  <script type="application/ld+json">${JSON.stringify(schemaMarkup)}</script>
  <script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>
</head>
<body>
  <nav aria-label="Breadcrumb">
    <a href="${BASE_URL}">Trang chủ</a> &gt;
    <a href="${BASE_URL}/hang-muc-cong-trinh">Hạng mục công trình</a> &gt;
    <span>${titleEscaped}</span>
  </nav>

  <article>
    <h1>${titleEscaped}</h1>
    ${project.mainImage ? `<img src="${escapeHtml(project.mainImage)}" alt="${titleEscaped}" loading="lazy">` : ''}

    ${infoHtml}

    ${project.description ? `<p>${escapeHtml(project.description)}</p>` : ''}

    ${sectionsHtml}
  </article>

  ${relatedProjects.length > 0 ? `
  <section>
    <h2>Dự án liên quan</h2>
    <ul>
      ${relatedProjects.map(rp => {
        const rpSlug = generateSlug(rp.title);
        return `<li><a href="${BASE_URL}/hang-muc/cong-trinh-chi-tiet/${rpSlug}-${rp._id}">${escapeHtml(rp.title)}</a></li>`;
      }).join('\n      ')}
    </ul>
  </section>` : ''}

  <footer>
    <p>© Trường Thành Phát - Thiết kế &amp; Thi công xây dựng tại Đà Nẵng</p>
    <a href="${BASE_URL}">Trang chủ</a> |
    <a href="${BASE_URL}/tin-tuc">Tin tức</a> |
    <a href="${BASE_URL}/hang-muc-cong-trinh">Hạng mục công trình</a> |
    <a href="${BASE_URL}/lien-he">Liên hệ</a>
  </footer>
</body>
</html>`;

    res.set('Content-Type', 'text/html; charset=utf-8');
    res.set('Cache-Control', 'public, max-age=3600'); // Cache 1 giờ
    res.send(html);

  } catch (error) {
    console.error('[SSR] Lỗi render dự án:', error);
    res.status(500).send('<!DOCTYPE html><html><head><title>Lỗi</title></head><body><h1>Lỗi máy chủ</h1></body></html>');
  }
});

export default router;
