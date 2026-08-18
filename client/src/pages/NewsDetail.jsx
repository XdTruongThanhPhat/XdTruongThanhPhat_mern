import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { generateSlug, removeAccents } from '../utils/slugify';
import Breadcrumb from '../components/Breadcrumb';
import { optimizeCloudinaryUrl, generateSrcSet, generateSizes } from '../utils/cloudinary';
import { transformYoutubeLinksToEmbed } from '../utils/embedVideo';

// HÀM LOẠI BỎ THẺ HTML VÀ LẤY MÔ TẢ TÓM TẮT CHUẨN SEO
const extractDescription = (htmlContent, maxLength = 155) => {
  if (!htmlContent) return '';
  const cleanText = htmlContent
    .replace(/<[^>]*>?/gm, '') // Xóa các thẻ HTML
    .replace(/&nbsp;/gi, ' ')  // Thay khoảng trắng
    .replace(/\s+/g, ' ')      // Xóa khoảng trắng thừa
    .trim();
  return cleanText.substring(0, maxLength) + (cleanText.length > maxLength ? '...' : '');
};

// HÀM GIẢI MÃ CÁC KÝ TỰ HTML ENTITIES
const decodeHTMLEntities = (text) => {
  if (!text) return '';
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&ldquo;/g, '“')
    .replace(/&rdquo;/g, '”')
    .replace(/&lsquo;/g, '‘')
    .replace(/&rsquo;/g, '’')
    .replace(/&nbsp;/g, ' ');
};

const NewsDetail = () => {
  const { id: slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // STATE: TOC VÀ NỘI DUNG ĐÃ GẮN ID VĨNH VIỄN
  const [toc, setToc] = useState([]);
  const [showToc, setShowToc] = useState(true);
  const [blogContentWithIds, setBlogContentWithIds] = useState("");

  // ==========================================
  // STATE: QUẢN LÝ FORM LIÊN HỆ GỬI EMAIL
  // ==========================================
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    content: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchBlogData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/blogs`);
        const data = await res.json();

        if (data.success) {
          // TÌM BÀI VIẾT: So khớp _id trực tiếp HOẶC kiểm tra URL kết thúc bằng _id
          // - Từ trang chủ: slug = "682456abc123" (chỉ _id) → khớp điều kiện 1
          // - Từ trang News: slug = "ten-bai-viet-682456abc123" (slug-_id) → khớp điều kiện 2
          const current = data.blogs.find(b => b._id === slug || slug.endsWith(b._id));
          if (current) {
            current.date = new Date(current.createdAt).toLocaleDateString('vi-VN');
            if (current.content) {
              current.content = current.content
                .replace(/&nbsp;/g, ' ')
                .replace(/\u00a0/g, ' ')
                .replace(/[\u200b\u200c\u200d\ufeff]/g, '')
                .replace(/&shy;|\u00ad/g, '');
            }
            setBlog(current);
          }

          const recents = data.blogs
            .filter(b => !current || b._id !== current._id)
            .slice(0, 5)
            .map(b => ({
              ...b,
              date: new Date(b.createdAt).toLocaleDateString('vi-VN')
            }));
          setRecentBlogs(recents);
        }
      } catch (error) { console.error("Lỗi:", error); }
      finally { setLoading(false); }
    };

    if (slug) {
      fetchBlogData();
      window.scrollTo(0, 0);
    }
  }, [slug]);

  // LOGIC: BÓC TÁCH MỤC LỤC & CẤY ID VĨNH VIỄN
  useEffect(() => {
    if (blog && blog.content) {
      let headingIndex = 0;
      const tocItems = [];
      const cleanedBlogContent = blog.content
        .replace(/&nbsp;/g, ' ')
        .replace(/\u00a0/g, ' ')
        .replace(/[\u200b\u200c\u200d\ufeff]/g, '')
        .replace(/&shy;|\u00ad/g, '');

      const newContent = cleanedBlogContent.replace(/<(h[23])(.*?)>(.*?)<\/\1>/gi, (match, tag, attributes, innerText) => {
        const id = `heading-${headingIndex++}`;

        const cleanText = decodeHTMLEntities(
          innerText
            .replace(/<[^>]*>?/gm, '')
            .replace(/&nbsp;/gi, ' ')
            .trim()
        );

        tocItems.push({
          id: id,
          text: cleanText,
          level: tag.toLowerCase()
        });

        return `<${tag} id="${id}"${attributes}>${innerText}</${tag}>`;
      });

      // Phân tích cú pháp HTML của bài viết qua DOMParser để tối ưu hóa SEO & hiển thị ảnh
      const parser = new DOMParser();
      const doc = parser.parseFromString(newContent, 'text/html');
      
      const images = doc.querySelectorAll('img');
      images.forEach((img) => {
        if (!img.getAttribute('loading')) {
          img.setAttribute('loading', 'lazy');
        }
        
        let parent = img.parentElement;
        let imageContainer = parent;
        let captionElement = null;

        // Xác định phần tử container chứa ảnh
        if (parent) {
          if (parent.tagName === 'P' || parent.classList.contains('ql-image-wrapper')) {
            imageContainer = parent;
          }
          
          // Tìm đoạn văn tiếp theo ngay sau container ảnh
          const nextSib = imageContainer.nextElementSibling;
          if (nextSib && nextSib.tagName === 'P') {
            captionElement = nextSib;
          }
        }

        // Tạo thẻ alt không dấu từ nội dung chú thích hoặc tiêu đề bài viết
        if (captionElement) {
          const captionText = captionElement.textContent.trim();
          if (captionText) {
            img.setAttribute('alt', removeAccents(captionText));
            // Gán class đặc biệt cho chú thích và container để CSS gộp thành 1 card
            captionElement.classList.add('blog-image-caption');
            imageContainer.classList.add('blog-image-container');
          } else {
            img.setAttribute('alt', removeAccents(blog.title));
          }
        } else {
          img.setAttribute('alt', removeAccents(blog.title));
        }
      });

      const modifiedContent = transformYoutubeLinksToEmbed(doc.body.innerHTML);
      setBlogContentWithIds(modifiedContent);
      setToc(tocItems);
    }
  }, [blog]);

  // HÀM CLICK CUỘN TỚI MỤC LỤC
  const scrollToHeading = (headingId) => {
    const element = document.getElementById(headingId);
    if (element) {
      const yOffset = -100;
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  // ==========================================
  // HÀM XỬ LÝ SUBMIT FORM LIÊN HỆ
  // ==========================================
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    const toastId = toast.loading("Đang gửi thông tin...");

    // Gán thêm Tên bài viết vào nội dung để bạn dễ theo dõi
    const payload = {
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      content: `[Từ bài viết: ${blog?.title}]\n\n${formData.content}`
    };

    try {
      // SỬA LỖI TẠI ĐÂY: Chuyển URL về đúng cổng /api/contact dành cho form cơ bản
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Gửi thành công!Cảm ơn bạn đã quan tâm đến sản phẩm và dịch vụ của TTP Architect. Chúng tôi sẽ liên hệ lại sớm nhất.", { id: toastId });
        setFormData({ name: '', phone: '', email: '', content: '' });
      } else {
        toast.error("Có lỗi xảy ra, vui lòng thử lại sau.", { id: toastId });
      }
    } catch (error) {
      console.error("Lỗi gửi liên hệ:", error);
      toast.error("Lỗi kết nối đến máy chủ!", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="pt-24 md:pt-32 pb-16 min-h-screen flex justify-center items-center"><p className="animate-pulse text-green-600 font-bold text-sm md:text-base">Đang tải bài viết...</p></div>;
  if (!blog) return <div className="pt-24 md:pt-32 pb-16 min-h-screen flex justify-center items-center"><p className="text-red-500 font-bold text-lg md:text-xl">Không tìm thấy bài viết!</p></div>;

  return (
    <section className="pt-24 md:pt-32 pb-10 md:pb-20 bg-gray-50 min-h-screen relative">
      <Helmet>
        <title>{blog.title} | Trường Thành Phát</title>
        <meta name="description" content={blog.metaDescription || extractDescription(blog.content)} />
        <link rel="canonical" href={`https://truongthanhphatdn.vn/tin-tuc/${generateSlug(blog.title)}-${blog._id}`} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={extractDescription(blog.content)} />
        <meta property="og:url" content={`https://truongthanhphatdn.vn/tin-tuc/${generateSlug(blog.title)}-${blog._id}`} />
        {blog.imageUrl && <meta property="og:image" content={blog.imageUrl} />}

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={blog.title} />
        <meta name="twitter:description" content={extractDescription(blog.content)} />
        {blog.imageUrl && <meta name="twitter:image" content={blog.imageUrl} />}

        {/* Dữ liệu cấu trúc Schema JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify({
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
                "url": "https://res.cloudinary.com/dia0hytop/image/upload/v1776675604/z7731184451078_e2096bacf215f8b507086b7a6712faa3_bjzvxz.png"
              }
            },
            "description": extractDescription(blog.content)
          })}
        </script>
      </Helmet>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Breadcrumb SEO */}
        <Breadcrumb items={[
          { label: 'Tin tức', link: '/tin-tuc' },
          { label: blog.title }
        ]} />
        <div className="flex flex-col lg:flex-row gap-6 md:gap-10">

          {/* CỘT TRÁI: NỘI DUNG */}
          <div className="w-full lg:w-2/3 xl:w-3/4 min-w-0 bg-white p-4 md:p-10 rounded-lg md:rounded-xl shadow-sm border border-gray-100">
            {/* Header bài viết */}
            <div className="mb-5 md:mb-8 border-b border-gray-100 pb-4 md:pb-6">
              <span className="inline-block bg-green-100 text-green-700 text-[10px] md:text-xs font-bold uppercase tracking-wider px-2 py-0.5 md:px-3 md:py-1 rounded-sm mb-3">
                {blog.category}
              </span>
              <h1 className="text-xl sm:text-2xl md:text-4xl font-bold text-black leading-tight mb-3 md:mb-4">
                {blog.title}
              </h1>
              <div className="flex flex-wrap items-center text-xs md:text-sm text-gray-500 font-medium">
                <span className="flex items-center gap-1"><svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> {blog.date}</span>
                <span className="mx-2 md:mx-3">•</span>
                <span className="flex items-center gap-1"><svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> {blog.author}</span>
              </div>
            </div>

            {/* Ảnh bìa */}
            <div className="w-full aspect-video rounded-md md:rounded-lg overflow-hidden mb-5 md:mb-8">
              <img src={optimizeCloudinaryUrl(blog.imageUrl, 1200)} srcSet={generateSrcSet(blog.imageUrl, [400, 600, 800, 1200])} sizes={generateSizes('article')} alt={blog.title} className="w-full h-full object-cover" fetchpriority="high" />
            </div>

            {/* MỤC LỤC BÀI VIẾT */}
            {toc.length > 0 && (
              <div className="mb-8 bg-gray-50 border border-gray-200 rounded-lg p-5">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-lg text-black uppercase">Nội dung chính</h3>
                  <button
                    onClick={() => setShowToc(!showToc)}
                    className="text-sm font-bold text-green-600 hover:text-green-800"
                  >
                    [{showToc ? 'Ẩn' : 'Hiện'}]
                  </button>
                </div>
                {showToc && (
                  <ul className="space-y-2 text-gray-700">
                    {toc.map((item) => (
                      <li
                        key={item.id}
                        className={`cursor-pointer hover:text-green-600 transition-colors flex items-start gap-2 ${item.level === 'h3' ? 'ml-6 text-sm' : 'font-medium mt-3 text-base'}`}
                        onClick={() => scrollToHeading(item.id)}
                      >
                        {item.level === 'h2' && <span className="text-green-500 mt-1">▪</span>}
                        {item.level === 'h3' && <span className="text-gray-400 mt-0.5">-</span>}
                        <span className="flex-1 leading-snug">{item.text}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* NỘI DUNG CHI TIẾT HTML */}
            <div
              className="blog-content text-gray-700 text-sm md:text-lg leading-relaxed"
              dangerouslySetInnerHTML={{ __html: blogContentWithIds || blog?.content }}
            />

            <div className="mt-8 md:mt-10 pt-4 md:pt-6 border-t border-gray-100 flex items-center justify-between">
              <span className="font-bold text-black text-sm md:text-base">Chia sẻ bài viết:</span>
            </div>

            {/* ==========================================
                FORM ĐĂNG KÝ TƯ VẤN NGAY DƯỚI BÀI VIẾT
            ========================================== */}
            <div className="mt-10 bg-gray-50 p-6 md:p-8 rounded-xl border border-gray-200 shadow-sm">
              <div className="text-center mb-6">
                <h3 className="text-lg md:text-xl font-bold uppercase tracking-widest text-black mb-2">
                  Nhận tư vấn từ kiến trúc sư
                </h3>
                <p className="text-xs md:text-sm text-gray-500">
                  Bạn đang có ý tưởng cho ngôi nhà của mình? Hãy để lại thông tin để Trường Thành Phát hỗ trợ tư vấn hoàn toàn miễn phí.
                </p>
              </div>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input required type="text" placeholder="Họ và tên *" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-md outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all text-sm" />
                  <input required type="tel" placeholder="Số điện thoại *" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-md outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all text-sm" />
                </div>
                <textarea required rows="3" placeholder="Ghi chú yêu cầu của bạn (Diện tích, phong cách, số tầng...)" value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-md outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all text-sm resize-none"></textarea>
                <button type="submit" disabled={isSubmitting} className={`w-full text-white font-bold uppercase tracking-widest py-3 rounded-md shadow-md transition-colors duration-300 text-sm ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-black'}`}>
                  {isSubmitting ? 'Đang gửi yêu cầu...' : 'Gửi yêu cầu tư vấn ngay'}
                </button>
              </form>
            </div>

          </div>

          {/* CỘT PHẢI: BÀI VIẾT MỚI NHẤT */}
          <div className="w-full lg:w-1/3 xl:w-1/4">
            <div className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-20 md:top-28">
              <div className="bg-[#1A1A1A] text-center py-3 md:py-4 border-b-2 border-green-500">
                <h3 className="text-white text-sm md:text-lg font-bold uppercase tracking-wider">Bài viết mới nhất</h3>
              </div>

              <div className="p-3 md:p-5 flex flex-col gap-4 md:gap-6">
                {recentBlogs.length === 0 ? (
                  <p className="text-xs md:text-sm text-gray-500 italic text-center">Chưa có bài viết khác.</p>
                ) : (
                  recentBlogs.map(item => (
                    <Link to={`/tin-tuc/${generateSlug(item.title)}-${item._id}`} key={item._id} className="group flex gap-3 md:gap-4 items-start border-b border-gray-50 pb-3 md:pb-0 md:border-none last:border-none">
                      <div className="w-20 h-16 md:w-24 md:h-20 shrink-0 overflow-hidden rounded border border-gray-100">
                        <img src={optimizeCloudinaryUrl(item.imageUrl, 200)} srcSet={generateSrcSet(item.imageUrl, [100, 200])} sizes={generateSizes('thumbnail')} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xs md:text-sm font-bold text-gray-800 line-clamp-2 md:line-clamp-3 leading-snug group-hover:text-green-600 transition-colors mb-1">
                          {item.title}
                        </h4>
                        <span className="text-[10px] md:text-[11px] text-gray-400 italic">{item.date}</span>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .blog-content { word-break: keep-all !important; overflow-wrap: break-word !important; word-wrap: break-word !important; }
        .blog-content * { word-break: keep-all !important; overflow-wrap: break-word !important; word-wrap: break-word !important; }
        
        .blog-content h1 { font-size: 2rem; font-weight: bold; margin-top: 2rem; margin-bottom: 1rem; color: #111827; line-height: 1.2; }
        .blog-content h2 { font-size: 1.5rem; font-weight: bold; margin-top: 2rem; margin-bottom: 1rem; color: #111827; line-height: 1.3; scroll-margin-top: 100px; }
        .blog-content h3 { font-size: 1.25rem; font-weight: bold; margin-top: 1.5rem; margin-bottom: 0.75rem; color: #1f2937; line-height: 1.4; scroll-margin-top: 100px; }
        .blog-content h4 { font-size: 1.125rem; font-weight: bold; margin-top: 1.5rem; margin-bottom: 0.75rem; color: #374151; }
        .blog-content h5, .blog-content h6 { font-size: 1rem; font-weight: bold; margin-top: 1rem; margin-bottom: 0.5rem; color: #4b5563; }
        
        .blog-content p {
          text-align: justify !important;
          font-size: 1rem !important;
          margin-bottom: 1.5rem !important;
          color: #4b5563 !important;
          white-space: pre-line !important;
          line-height: 1.625 !important;
        }
        .blog-content ul { list-style-type: disc; margin-left: 1.5rem; margin-bottom: 1rem; }
        .blog-content ol { list-style-type: decimal; margin-left: 1.5rem; margin-bottom: 1rem; }
        .blog-content li { margin-bottom: 0.5rem; }
        
        .blog-content a { color: #16a34a; text-decoration: underline; }
        .blog-content strong { font-weight: 700; }
        .blog-content em { font-style: italic; }
        .blog-content u { text-decoration: underline; }
        .blog-content s { text-decoration: line-through; }
        
        .blog-content img { max-width: 100%; height: auto; border-radius: 0.5rem; margin-top: 1.5rem; margin-bottom: 0px; }
        
        /* Custom Image Wrapper - hỗ trợ căn lề trái/giữa/phải */
        .blog-content .ql-image-wrapper { display: block; clear: both; margin: 1.5rem 0 0 0; }
        .blog-content .ql-image-wrapper[data-align="center"] { text-align: center; }
        .blog-content .ql-image-wrapper[data-align="center"] img { display: block; margin-left: auto; margin-right: auto; }
        .blog-content .ql-image-wrapper[data-align="left"] { text-align: left; }
        .blog-content .ql-image-wrapper[data-align="left"] img { display: block; margin-left: 0; margin-right: auto; }
        .blog-content .ql-image-wrapper[data-align="right"] { text-align: right; }
        .blog-content .ql-image-wrapper[data-align="right"] img { display: block; margin-left: auto; margin-right: 0; }
        
        /* Legacy: ảnh trong thẻ p (bài viết cũ không có wrapper) */
        .blog-content p > img { display: block; margin-left: auto; margin-right: auto; }

        .blog-content iframe.ql-video { width: 100%; aspect-ratio: 16/9; border-radius: 0.75rem; margin: 1.5rem 0 !important; border: none; }
        .blog-content .blog-video-container { width: 100%; aspect-ratio: 16/9; border-radius: 0.75rem; overflow: hidden; margin: 1.5rem 0; box-shadow: 0 4px 15px rgba(0,0,0,0.1); background-color: #000; }
        .blog-content .blog-video-container iframe { width: 100% !important; height: 100% !important; border: 0 !important; }
        
        .blog-content .blog-image-container {
          margin-bottom: 0px !important;
        }
        .blog-content .blog-image-container img {
          margin-bottom: 0px !important;
          border-bottom-left-radius: 0px !important;
          border-bottom-right-radius: 0px !important;
        }
        
        .blog-content .blog-image-caption {
          background-color: #f8f9fa !important;
          color: #6b7280 !important;
          font-style: italic !important;
          text-align: center !important;
          padding: 10px 16px !important;
          margin-top: 0px !important;
          margin-bottom: 1.5rem !important;
          font-size: 0.875rem !important;
          font-weight: 500 !important;
          border: 1px solid rgba(243, 244, 246, 0.6) !important;
          border-top: none !important;
          border-bottom-left-radius: 0.5rem !important;
          border-bottom-right-radius: 0.5rem !important;
          line-height: 1.5 !important;
        }
        
        .blog-content .ql-align-center { text-align: center !important; }
        .blog-content .ql-align-right { text-align: right !important; }
        .blog-content .ql-align-justify { text-align: justify !important; }


        .blog-content [style*="font-size: 12px"] { font-size: 12px !important; }
        .blog-content [style*="font-size: 14px"] { font-size: 14px !important; }
        .blog-content [style*="font-size: 16px"] { font-size: 16px !important; }
        .blog-content [style*="font-size: 18px"] { font-size: 18px !important; }
        .blog-content [style*="font-size: 20px"] { font-size: 20px !important; }
        .blog-content [style*="font-size: 24px"] { font-size: 24px !important; }
        .blog-content [style*="font-size: 28px"] { font-size: 28px !important; }
        .blog-content [style*="font-size: 32px"] { font-size: 32px !important; }
        
        @media (min-width: 768px) {
          .blog-content h1 { font-size: 2.25rem; }
          .blog-content h2 { font-size: 1.875rem; }
          .blog-content h3 { font-size: 1.5rem; }
        }
      `}} />
    </section>
  );
};

export default NewsDetail;