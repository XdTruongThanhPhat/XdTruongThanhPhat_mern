# Kế Hoạch Tối Ưu Hóa Mã Nguồn Đạt Điểm SEO 90+ - Trường Thành Phát

Tài liệu này lưu trữ danh sách các điểm cần cải tiến kỹ thuật SEO, cấu trúc code cụ thể và hướng dẫn triển khai để nâng cấp điểm số SEO của website **truongthanhphatdn.vn** từ **38/100** lên **90+/100**.

---

## MỤC LỤC CHỈNH SỬA
1. [Khắc Phục Lỗi Thẻ Canonical URL Động](#1-khắc-phục-lỗi-thẻ-canonical-url-động)
2. [Tối Ưu Hóa Thẻ Meta Description Chi Tiết](#2-tối-ưu-hóa-thẻ-meta-description-chi-tiết)
3. [Tích Hợp Dữ Liệu Cấu Trúc Schema Markup (JSON-LD)](#3-tích-hợp-dữ-liệu-cấu-trúc-schema-markup-json-ld)
4. [Tạo Sitemap.xml Động & File Robots.txt](#4-tạo-sitemapxml-động--file-robotstxt)
5. [Tối Ưu Hóa Lazy Load & Thẻ Alt Hình Ảnh](#5-tối-ưu-hóa-lazy-load--thẻ-alt-hình-ảnh)
6. [Đồng Bộ Hóa Code & Loại Bỏ Trùng Lặp (Slugify)](#6-đồng-bộ-hóa-code--loại-bỏ-trùng-lặp-slugify)
7. [Tích Hợp Widget Chấm Điểm SEO Trực Quan Trong Admin](#7-tích-hợp-widget-chấm-điểm-seo-trực-quan-trong-admin)

---

### 1. Khắc Phục Lỗi Thẻ Canonical URL Động

*   **Mục tiêu:** Đảm bảo mỗi trang chi tiết chỉ có một địa chỉ URL gốc duy nhất được khai báo với Google, tránh việc bị phạt trùng lặp nội dung.
*   **Vị trí sửa đổi:**
    *   [client/src/pages/NewsDetail.jsx](file:///c:/Users/OS/Desktop/Mern-TTP/Mern-TTP/client/src/pages/NewsDetail.jsx)
    *   [client/src/pages/ProjectDetail.jsx](file:///c:/Users/OS/Desktop/Mern-TTP/Mern-TTP/client/src/pages/ProjectDetail.jsx)
*   **Cách triển khai:**
    Thay vì dùng tham số `id` hoặc `slug` trực tiếp từ URL của trình duyệt (user có thể gõ chữ hoa/thường, sai slug, thiếu id,...), hãy sinh canonical URL từ dữ liệu gốc trong Database sau khi fetch thành công:

    ```javascript
    // Trong NewsDetail.jsx
    const canonicalUrl = blog ? `https://truongthanhphatdn.vn/tin-tuc/${generateSlug(blog.title)}-${blog._id}` : '';

    // Cập nhật Helmet:
    <link rel="canonical" href={canonicalUrl} />
    <meta property="og:url" content={canonicalUrl} />
    ```

    ```javascript
    // Trong ProjectDetail.jsx
    const canonicalUrl = projectData ? `https://truongthanhphatdn.vn/hang-muc/cong-trinh-chi-tiet/${generateSlug(projectData.title)}-${projectData._id}` : '';

    // Cập nhật Helmet:
    <link rel="canonical" href={canonicalUrl} />
    <meta property="og:url" content={canonicalUrl} />
    ```

---

### 2. Tối Ưu Hóa Thẻ Meta Description Chi Tiết

*   **Mục tiêu:** Tạo ra một đoạn mô tả hấp dẫn, phản ánh đúng nội dung bài viết/dự án để tăng tỷ lệ nhấp chuột (CTR) trên Google.
*   **Vị trí sửa đổi:**
    *   [client/src/pages/NewsDetail.jsx](file:///c:/Users/OS/Desktop/Mern-TTP/Mern-TTP/client/src/pages/NewsDetail.jsx)
    *   [client/src/pages/ProjectDetail.jsx](file:///c:/Users/OS/Desktop/Mern-TTP/Mern-TTP/client/src/pages/ProjectDetail.jsx)
*   **Cách triển khai:**
    Viết hàm lọc bỏ các thẻ HTML để lấy ra 150 ký tự đầu tiên của nội dung bài viết làm đoạn trích (excerpt):

    ```javascript
    // Hàm loại bỏ thẻ HTML và lấy text sạch:
    const extractDescription = (htmlContent, maxLength = 155) => {
      if (!htmlContent) return '';
      const cleanText = htmlContent
        .replace(/<[^>]*>?/gm, '') // Xóa thẻ tag HTML
        .replace(/&nbsp;/gi, ' ')  // Thay khoảng trắng đặc biệt
        .replace(/\s+/g, ' ')      // Xóa khoảng trắng thừa
        .trim();
      return cleanText.substring(0, maxLength) + (cleanText.length > maxLength ? '...' : '');
    };

    // Áp dụng vào thẻ mô tả:
    const metaDescription = blog ? extractDescription(blog.content) : 'Mô tả bài viết';
    ```

---

### 3. Tích Hợp Dữ Liệu Cấu Trúc Schema Markup (JSON-LD)

*   **Mục tiêu:** Khai báo dữ liệu có cấu trúc định dạng JSON-LD giúp Google nhận diện thực thể doanh nghiệp, bài viết và dự án để hiển thị kết quả tìm kiếm nâng cao (Rich Snippets).
*   **Vị trí sửa đổi:**
    *   [client/src/pages/Home.jsx](file:///c:/Users/OS/Desktop/Mern-TTP/Mern-TTP/client/src/pages/Home.jsx) (Tích hợp Schema `LocalBusiness` và `Organization`)
    *   [client/src/pages/NewsDetail.jsx](file:///c:/Users/OS/Desktop/Mern-TTP/Mern-TTP/client/src/pages/NewsDetail.jsx) (Tích hợp Schema `BlogPosting`)
    *   [client/src/pages/ProjectDetail.jsx](file:///c:/Users/OS/Desktop/Mern-TTP/Mern-TTP/client/src/pages/ProjectDetail.jsx) (Tích hợp Schema `SingleFamilyResidence`)
*   **Cách triển khai:**
    Chèn thẻ script JSON-LD vào trong thẻ `<Helmet>`:

    **Ví dụ cho trang chi tiết tin tức (NewsDetail.jsx):**
    ```javascript
    const schemaMarkup = blog ? {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": blog.title,
      "image": [blog.imageUrl],
      "datePublished": blog.createdAt,
      "dateModified": blog.updatedAt,
      "author": [{
        "@type": "Person",
        "name": blog.author || "TTP Architect",
        "url": "https://truongthanhphatdn.vn"
      }],
      "publisher": {
        "@type": "Organization",
        "name": "Trường Thành Phát",
        "logo": {
          "@type": "ImageObject",
          "url": "https://truongthanhphatdn.vn/logo.png"
        }
      },
      "description": extractDescription(blog.content)
    } : null;

    // Chèn trong Helmet:
    {schemaMarkup && (
      <script type="application/ld+json">
        {JSON.stringify(schemaMarkup)}
      </script>
    )}
    ```

---

### 4. Tạo Sitemap.xml Động & File Robots.txt

*   **Mục tiêu:** Cung cấp danh sách toàn bộ các đường dẫn (URLs) trên website để Googlebot cào và lập chỉ mục tự động ngay khi có bài viết hoặc dự án mới.
*   **Vị trí sửa đổi:**
    *   Tạo mới file route backend: `server/routes/seoRoutes.js`
    *   Tích hợp vào: [server/server.js](file:///c:/Users/OS/Desktop/Mern-TTP/Mern-TTP/server/server.js)
    *   Tạo file tĩnh: `client/public/robots.txt`
*   **Cách triển khai:**
    Viết một controller tạo XML động từ database bài viết và dự án:

    ```javascript
    // server/routes/seoRoutes.js
    import express from 'express';
    import Blog from '../models/Blog.js';
    import Project from '../models/Project.js';
    import { generateSlug } from '../../client/src/utils/slugify.js'; // hoặc viết hàm riêng ở backend

    const router = express.Router();

    router.get('/sitemap.xml', async (req, res) => {
        try {
            const blogs = await Blog.find({}, 'title updatedAt');
            const projects = await Project.find({}, 'title updatedAt');

            let xml = `<?xml version="1.0" encoding="UTF-8"?>`;
            xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
            
            // Các trang tĩnh
            const staticPages = ['', 've-ttp', 've-ttp/doi-ngu-nhan-su', 'hang-muc-cong-trinh', 'bao-gia', 'lien-he', 'tin-tuc'];
            staticPages.forEach(page => {
                xml += `<url><loc>https://truongthanhphatdn.vn/${page}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`;
            });

            // Trang tin tức động
            blogs.forEach(blog => {
                const slug = `${generateSlug(blog.title)}-${blog._id}`;
                xml += `<url><loc>https://truongthanhphatdn.vn/tin-tuc/${slug}</loc><lastmod>${blog.updatedAt.toISOString().split('T')[0]}</lastmod><priority>0.6</priority></url>`;
            });

            // Trang dự án động
            projects.forEach(project => {
                const slug = `${generateSlug(project.title)}-${project._id}`;
                xml += `<url><loc>https://truongthanhphatdn.vn/hang-muc/cong-trinh-chi-tiet/${slug}</loc><lastmod>${project.updatedAt.toISOString().split('T')[0]}</lastmod><priority>0.7</priority></url>`;
            });

            xml += `</urlset>`;

            res.header('Content-Type', 'application/xml');
            res.status(200).send(xml);
        } catch (error) {
            res.status(500).send("Lỗi tạo sitemap");
        }
    });

    export default router;
    ```

    *Đăng ký sitemap trong `robots.txt`*:
    ```text
    User-agent: *
    Allow: /
    
    Sitemap: https://truongthanhphatdn.vn/api/seo/sitemap.xml
    ```

---

### 5. Tối Ưu Hóa Lazy Load & Thẻ Alt Hình Ảnh

*   **Mục tiêu:** Giảm thời gian tải trang ban đầu (cải thiện chỉ số LCP) và giúp hình ảnh bài viết lọt top tìm kiếm Google Images.
*   **Vị trí sửa đổi:** Các thẻ hiển thị hình ảnh trong `News.jsx`, `NewsDetail.jsx`, `CategoryProject.jsx`, `ProjectDetail.jsx`.
*   **Cách triển khai:**
    - Thêm `loading="lazy"` cho tất cả các thẻ `<img>` không thuộc màn hình đầu tiên (below-the-fold).
    - Luôn điền thuộc tính `alt` có ý nghĩa dựa trên tên tiêu đề (nếu ảnh không có alt riêng):
      ```javascript
      <img 
        src={blog.imageUrl} 
        alt={blog.title || "Ảnh bài viết Trường Thành Phát"} 
        loading="lazy" 
        className="..." 
      />
      ```

---

### 6. Đồng Bộ Hóa Code & Loại Bỏ Trùng Lặp (Slugify)

*   **Mục tiêu:** Dọn sạch code thừa, tránh lỗi bất nhất khi sinh đường dẫn chuẩn SEO.
*   **Vị trí sửa đổi:**
    *   [client/src/pages/News.jsx](file:///c:/Users/OS/Desktop/Mern-TTP/Mern-TTP/client/src/pages/News.jsx) (Xóa hàm `generateSlug` khai báo cục bộ)
    *   [client/src/pages/NewsDetail.jsx](file:///c:/Users/OS/Desktop/Mern-TTP/Mern-TTP/client/src/pages/NewsDetail.jsx) (Xóa hàm `generateSlug` khai báo cục bộ)
*   **Cách triển khai:**
    Import trực tiếp từ tiện ích dùng chung:
    ```javascript
    import { generateSlug } from '../utils/slugify';
    ```

---

### 7. Tích Hợp Widget Chấm Điểm SEO Trực Quan Trong Admin

*   **Mục tiêu:** Giúp quản trị viên đo lường chất lượng bài viết chuẩn SEO ngay trong lúc viết bài ở Admin panel.
*   **Vị trí sửa đổi:**
    *   [admin/src/pages/ManageBlog.jsx](file:///c:/Users/OS/Desktop/Mern-TTP/Mern-TTP/admin/src/pages/ManageBlog.jsx)
*   **Gợi ý thuật toán kiểm tra thời gian thực (React state):**
    *   Kiểm tra độ dài tiêu đề (`title.length` từ 40 - 65 kí tự).
    *   Kiểm tra số lượng từ của nội dung soạn thảo (tách text từ HTML và đếm khoảng trắng).
    *   Nhập ô "Từ khóa chính" và kiểm tra sự xuất hiện của từ khóa trong: tiêu đề, đoạn đầu tiên, thẻ H2/H3, mật độ từ khóa (1-2%).
    *   Quét nội dung tìm thẻ `<img>` và kiểm tra xem có thuộc tính `alt` nào bị bỏ trống hay không.
