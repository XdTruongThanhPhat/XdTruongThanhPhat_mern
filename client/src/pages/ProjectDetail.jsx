import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import { generateSlug, removeAccents } from '../utils/slugify';
import Breadcrumb from '../components/Breadcrumb';
import { optimizeCloudinaryUrl, generateSrcSet, generateSizes } from '../utils/cloudinary';
import { transformYoutubeLinksToEmbed } from '../utils/embedVideo';

// Clean ký tự vô hình từ Quill editor và tự động chuyển link YouTube thành iframe player
const cleanRichTextHtml = (html) => {
  if (!html) return '';
  const cleaned = html
    .replace(/&nbsp;/g, ' ')
    .replace(/\u00a0/g, ' ')
    .replace(/[\u200b\u200c\u200d\ufeff]/g, '')
    .replace(/&shy;|\u00ad/g, '');
  return transformYoutubeLinksToEmbed(cleaned);
};

const ProjectDetail = () => {
  const { id } = useParams(); // Lấy ID công trình từ URL

  // Trích xuất MongoDB ObjectId thật từ slug (vd: "ten-ct-69fb0b..." → "69fb0b...")
  const realId = (() => {
    const match = id?.match(/([a-f0-9]{24})$/i);
    return match ? match[1] : id;
  })();

  // ==========================================
  // STATE LƯU TRỮ DỮ LIỆU TỪ BACKEND
  // ==========================================
  const [projectData, setProjectData] = useState(null);
  const [projectContent, setProjectContent] = useState([]);
  const [relatedProjects, setRelatedProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // STATE: THÔNG TIN SEO ON-PAGE TỪ BACKEND
  const [seoData, setSeoData] = useState({
    focusKeyword: '',
    lsiKeywords: '',
    seoTitle: '',
    metaDescription: ''
  });

  // STATE: MỤC LỤC TỰ ĐỘNG (TOC)
  const [toc, setToc] = useState([]);
  const [showToc, setShowToc] = useState(true);

  const [mainImage, setMainImage] = useState(null);
  const [allImages, setAllImages] = useState([]); // Gộp ảnh bìa và album ảnh lại

  // ==========================================
  // FETCH DỮ LIỆU KHI TRANG ĐƯỢC LOAD
  // ==========================================
  useEffect(() => {
    const fetchProjectDetails = async () => {
      setLoading(true);
      try {
        // TỐI ƯU: Gọi 3 API SONG SONG thay vì nối đuôi nhau → giảm ~60% thời gian chờ
        const [detailRes, projRes, contentRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/projects/detail/${realId}`),
          fetch(`${import.meta.env.VITE_API_URL}/api/projects/list`),
          fetch(`${import.meta.env.VITE_API_URL}/api/projects/content/${realId}`)
        ]);

        const [detailData, projData, contentData] = await Promise.all([
          detailRes.json(),
          projRes.json(),
          contentRes.json()
        ]);

        // 1. Xử lý chi tiết dự án hiện tại (API mới - trả đầy đủ projectImages)
        if (detailData.success && detailData.project) {
          const currentProject = detailData.project;
          setProjectData(currentProject);
          setMainImage(currentProject.mainImage);

          // Gộp ảnh bìa và các ảnh dự án vào 1 mảng để đưa vào Gallery
          const imagesArray = [currentProject.mainImage, ...(currentProject.projectImages || [])];
          setAllImages(imagesArray);

          // 2. Xử lý dự án liên quan (API list nhẹ - không có projectImages)
          if (projData.success) {
            // Lọc ra các dự án liên quan: Ưu tiên cùng category, nếu không đủ thì lấy ngẫu nhiên
            const sameCategory = projData.projects.filter(p => p._id !== realId && p.category === currentProject.category);
            const otherProjects = projData.projects.filter(p => p._id !== realId && p.category !== currentProject.category);
            const related = [...sameCategory, ...otherProjects].slice(0, 8);
            setRelatedProjects(related);
          }
        }

        // 3. Xử lý bài viết chi tiết (Content) của dự án này
        if (contentData.success && contentData.content) {
          setProjectContent(contentData.content.sections || []);
          setSeoData({
            focusKeyword: contentData.content.focusKeyword || '',
            lsiKeywords: contentData.content.lsiKeywords || '',
            seoTitle: contentData.content.seoTitle || '',
            metaDescription: contentData.content.metaDescription || ''
          });
        } else {
          setProjectContent([]); // Nếu chưa có bài viết thì mảng rỗng
          setSeoData({ focusKeyword: '', lsiKeywords: '', seoTitle: '', metaDescription: '' });
        }

      } catch (error) {
        console.error("Lỗi khi tải dữ liệu công trình:", error);
      } finally {
        setLoading(false);
      }
    };

    if (realId) {
      fetchProjectDetails();
      // Scroll lên đầu trang khi chuyển đổi giữa các dự án
      window.scrollTo(0, 0);
    }
  }, [id]);

  // LOGIC: BÓC TÁCH MỤC LỤC TỰ ĐỘNG TỪ SECTIONS
  useEffect(() => {
    if (projectContent && projectContent.length > 0) {
      const tocItems = [];
      projectContent.forEach((section, index) => {
        if (section.heading) {
          tocItems.push({
            id: `heading-${index}`,
            text: section.heading,
            level: section.headingType || 'h2'
          });
        }
      });
      setToc(tocItems);
    } else {
      setToc([]);
    }
  }, [projectContent]);

  // HÀM CLICK CUỘN TỚI MỤC LỤC
  const scrollToHeading = (headingId) => {
    const element = document.getElementById(headingId);
    if (element) {
      const yOffset = -100;
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  // Logic xử lý Gallery (Dùng biến allImages lấy từ Database)
  const maxThumbnails = 5;
  const visibleThumbnails = allImages.slice(0, maxThumbnails);
  const remainingCount = allImages.length - maxThumbnails;

  // State & Logic cho Lightbox
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => setIsLightboxOpen(false);
  const nextImage = () => setLightboxIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  const prevImage = () => setLightboxIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));

  // Tải trước (preload) ảnh tiếp theo và ảnh trước đó để tăng độ mượt
  useEffect(() => {
    if (isLightboxOpen && allImages.length > 0) {
      // Tải trước định dạng/chất lượng tối ưu mà không thay đổi kích thước gốc của ảnh chính
      const nextIdx = (lightboxIndex + 1) % allImages.length;
      const nextImg = new Image();
      nextImg.src = optimizeCloudinaryUrl(allImages[nextIdx]);

      const prevIdx = (lightboxIndex - 1 + allImages.length) % allImages.length;
      const prevImg = new Image();
      prevImg.src = optimizeCloudinaryUrl(allImages[prevIdx]);
    }
  }, [lightboxIndex, isLightboxOpen, allImages]);

  // Điều hướng bằng bàn phím (Phím mũi tên & Esc)
  useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        nextImage();
      } else if (e.key === 'ArrowLeft') {
        prevImage();
      } else if (e.key === 'Escape') {
        closeLightbox();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, allImages.length]);

  // Vuốt chạm chuyển ảnh trên Mobile
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
    setTouchEnd(null);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;  // Vuốt sang trái -> Xem ảnh tiếp theo
    const isRightSwipe = distance < -50; // Vuốt sang phải -> Xem ảnh trước đó

    if (isLeftSwipe) {
      nextImage();
    } else if (isRightSwipe) {
      prevImage();
    }
  };

  // ==========================================
  // STATE VÀ LOGIC GỬI FORM TƯ VẤN (BÁO GIÁ)
  // ==========================================
  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', area: '', location: '', type: 'Nhà phố', budget: '1.8 - 2.3 tỷ', details: ''
  });

  // State vô hiệu hóa nút bấm trong lúc đợi phản hồi
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    const toastId = toast.loading("Đang gửi yêu cầu báo giá...");

    try {
      // Bắn dữ liệu về đúng API /project-details
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/contact/project-details`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Gửi yêu cầu thành công! Kiến trúc sư sẽ liên hệ lại sớm nhất.", { id: toastId });
        // Xóa trắng dữ liệu trên form
        setFormData({
          name: '', phone: '', email: '', area: '', location: '', type: 'Nhà phố', budget: '1.8 - 2.3 tỷ', details: ''
        });
      } else {
        toast.error("Có lỗi xảy ra, vui lòng thử lại.", { id: toastId });
      }
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu báo giá:", error);
      toast.error("Lỗi kết nối máy chủ!", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Màn hình Loading trong lúc chờ gọi API
  if (loading) {
    return (
      <div className="pt-32 pb-16 min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl font-bold text-green-600 animate-pulse">Đang tải dữ liệu công trình...</p>
      </div>
    );
  }

  // Nếu ID sai hoặc dự án bị xóa
  if (!projectData) {
    return (
      <div className="pt-32 pb-16 min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl font-bold text-red-500">Không tìm thấy công trình này!</p>
      </div>
    );
  }

  const projectDesc = projectData.description
    ? projectData.description
    : `Dự án ${projectData.title} tại ${projectData.info?.location || 'Đà Nẵng'}. Quy mô thiết kế gồm ${projectData.info?.floors || '-'} tầng, diện tích xây dựng ${projectData.info?.buildArea || '-'}, chi phí ${projectData.info?.cost || 'Liên hệ'}. Khám phá thiết kế và quá trình thi công chi tiết.`;

  const displayTitle = seoData.seoTitle ? `${seoData.seoTitle} | Trường Thành Phát` : `${projectData.title} | Trường Thành Phát`;
  const displayDesc = seoData.metaDescription ? seoData.metaDescription : projectDesc;
  const keywordsContent = [seoData.focusKeyword, seoData.lsiKeywords].filter(Boolean).join(', ');

  const canonicalUrl = `https://truongthanhphatdn.vn/hang-muc/cong-trinh-chi-tiet/${generateSlug(projectData.title)}-${projectData._id}`;

  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "SingleFamilyResidence",
    "name": projectData.title,
    "image": [mainImage],
    "address": {
      "@type": "PostalAddress",
      "addressLocality": projectData.info?.location || "Đà Nẵng",
      "addressCountry": "VN"
    },
    "description": displayDesc
  };

  return (
    <>
      <Helmet>
        <title>{displayTitle}</title>
        <meta name="description" content={displayDesc} />
        {keywordsContent && <meta name="keywords" content={keywordsContent} />}
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={seoData.seoTitle || projectData.title} />
        <meta property="og:description" content={displayDesc} />
        <meta property="og:url" content={canonicalUrl} />
        {mainImage && <meta property="og:image" content={mainImage} />}

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoData.seoTitle || projectData.title} />
        <meta name="twitter:description" content={displayDesc} />
        {mainImage && <meta name="twitter:image" content={mainImage} />}

        {/* Dữ liệu cấu trúc Schema JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify(schemaMarkup)}
        </script>
      </Helmet>
      <section className="pt-32 pb-16 bg-gray-50 min-h-screen relative">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          {/* Breadcrumb SEO */}
          <Breadcrumb items={[
            { label: 'Hạng mục công trình', link: '/hang-muc-cong-trinh' },
            { label: projectData.title }
          ]} />

          {/* TIÊU ĐỀ TRANG CHI TIẾT */}
          <div className="mb-8 border-b border-gray-200 pb-4">
            <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-black">
              {projectData.title}
            </h1>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 relative items-start">

            {/* CỘT TRÁI: NỘI DUNG CÔNG TRÌNH */}
            <div className="lg:w-2/3 xl:w-3/4 flex flex-col gap-10">

              {/* 1. GALLERY HÌNH ẢNH */}
              <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                <div
                  className="w-full rounded-md overflow-hidden mb-4 relative group cursor-pointer bg-gray-100"
                  style={{ maxHeight: '70vh' }}
                  onClick={() => openLightbox(allImages.indexOf(mainImage))}
                >
                  {/* Layer nền mờ: ảnh nhỏ 50px + blur lấp đầy khoảng trống khi ảnh không vừa khung */}
                  <img
                    src={optimizeCloudinaryUrl(mainImage, 50)}
                    alt="" aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover blur-2xl scale-125 pointer-events-none"
                  />
                  {/* Ảnh chính: hiển thị đầy đủ không bị crop */}
                  <img
                    src={optimizeCloudinaryUrl(mainImage, 1200)}
                    srcSet={generateSrcSet(mainImage, [600, 800, 1200, 1600])}
                    sizes={generateSizes('hero')}
                    alt={`${projectData.title} - Ảnh chính công trình`}
                    className="relative z-10 w-full h-full object-contain"
                    style={{ maxHeight: '70vh' }}
                    fetchpriority="high"
                  />
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20">
                    <svg className="w-10 h-10 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                  </div>
                </div>

                {/* Thumbnails */}
                {allImages.length > 1 && (
                  <div className="grid grid-cols-5 gap-2">
                    {visibleThumbnails.map((img, idx) => {
                      const isLast = idx === maxThumbnails - 1;
                      const hasMore = remainingCount > 0;

                      return (
                        <div
                          key={idx}
                          onClick={() => {
                            if (isLast && hasMore) openLightbox(idx);
                            else setMainImage(img);
                          }}
                          className={`relative cursor-pointer aspect-video rounded-sm overflow-hidden border-2 transition-all ${mainImage === img && (!isLast || !hasMore) ? 'border-green-500 opacity-100' : 'border-transparent opacity-70 hover:opacity-100'
                            }`}
                        >
                          <img src={optimizeCloudinaryUrl(img, 300)} srcSet={generateSrcSet(img, [150, 300])} sizes={generateSizes('thumbnail')} alt={`Ảnh dự án ${projectData.title} - Hình ${idx + 1}`} loading="lazy" className="w-full h-full object-cover" />

                          {isLast && hasMore && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-lg font-bold hover:bg-black/80 transition-colors">
                              +{remainingCount}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* 2. BOX THÔNG TIN CÔNG TRÌNH */}
              <div className="rounded-md overflow-hidden shadow-sm">
                <div className="bg-[#1A1A1A] text-center py-4 px-2 border-b border-green-500">
                  <p className="text-green-500 text-sm uppercase tracking-widest font-semibold mb-1">Thông tin công trình</p>
                  <h3 className="text-white text-lg font-medium">{projectData.title}</h3>
                </div>
                {/* Thay đổi md:grid-cols-5 thành md:grid-cols-4 và bỏ các col-span thừa */}
                <div className="bg-green-500 grid grid-cols-2 md:grid-cols-4 divide-x divide-green-600 divide-y md:divide-y-0 text-white">
                  <div className="p-4 flex flex-col items-center text-center">
                    <span className="font-bold mb-1">Vị trí</span>
                    <span className="text-sm text-green-50">{projectData.info?.location || "Đang cập nhật"}</span>
                  </div>
                  <div className="p-4 flex flex-col items-center text-center">
                    <span className="font-bold mb-1">Số tầng</span>
                    <span className="text-sm text-green-50">{projectData.info?.floors || "-"}</span>
                  </div>
                  <div className="p-4 flex flex-col items-center text-center">
                    <span className="font-bold mb-1">Diện tích XD</span>
                    <span className="text-sm text-green-50">{projectData.info?.buildArea || "-"}</span>
                  </div>
                  <div className="p-4 flex flex-col items-center text-center">
                    <span className="font-bold mb-1">Chi phí XD</span>
                    <span className="text-sm text-green-50">{projectData.info?.cost || "Liên hệ"}</span>
                  </div>
                </div>
              </div>

              {/* 3. NỘI DUNG BÀI VIẾT (Render theo mảng sections từ DB) */}
              <div className="bg-white p-6 md:p-8 rounded-md shadow-sm border border-gray-100 text-gray-700 leading-relaxed">

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
                            className={`cursor-pointer hover:text-green-600 transition-colors flex items-start gap-2 font-medium mt-3 text-base ${item.level === 'h3' ? 'pl-4 text-sm' :
                                item.level === 'h4' ? 'pl-8 text-[13px]' : ''
                              }`}
                            onClick={() => scrollToHeading(item.id)}
                          >
                            <span className={item.level === 'h3' || item.level === 'h4' ? 'text-gray-400 mt-1 text-xs' : 'text-green-500 mt-1'}>
                              {item.level === 'h3' || item.level === 'h4' ? '◦' : '▪'}
                            </span>
                            <span className="flex-1 leading-snug">{item.text}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                {projectContent.length > 0 ? (
                  projectContent.map((section, index) => {
                    const HeadingTag = section.headingType || 'h2';

                    // Xác định class CSS tương ứng với từng cấp Heading
                    let headingClass = "font-bold text-black mt-8 mb-4 first:mt-0";
                    if (HeadingTag === 'h1') headingClass += " text-2xl md:text-3xl";
                    else if (HeadingTag === 'h2') headingClass += " text-xl md:text-2xl";
                    else if (HeadingTag === 'h3') headingClass += " text-lg md:text-xl";
                    else if (HeadingTag === 'h4') headingClass += " text-base md:text-lg";

                    return (
                      <div key={index}>
                        {/* Render Heading nếu có */}
                        {section.heading && (
                          <HeadingTag
                            id={`heading-${index}`}
                            className={headingClass}
                            style={{ scrollMarginTop: '100px' }}
                          >
                            {section.heading}
                          </HeadingTag>
                        )}

                        {/* Render Paragraph nếu có */}
                        {section.paragraph && section.paragraph !== '<p><br></p>' && (
                          <div
                            className="rich-text-content text-justify text-base mb-6 text-gray-600"
                            dangerouslySetInnerHTML={{ __html: cleanRichTextHtml(section.paragraph) }}
                          />
                        )}

                        {/* Render Images & Captions (hỗ trợ nhiều ảnh trong 1 section) */}
                        {(() => {
                          const urls = (section.imageUrls && section.imageUrls.length > 0) 
                            ? section.imageUrls 
                            : (section.imageUrl ? [section.imageUrl] : []);
                          const caps = (section.captions && section.captions.length > 0)
                            ? section.captions
                            : (section.caption ? [section.caption] : []);
                          if (urls.length === 0) return null;
                          return (
                            <div className="my-8 space-y-4">
                              {urls.map((imgUrl, imgIdx) => (
                                <div key={imgIdx} className="overflow-hidden rounded-md border border-gray-100/60 shadow-sm bg-[#f8f9fa]">
                                   <img 
                                     src={optimizeCloudinaryUrl(imgUrl, 1000)} 
                                     srcSet={generateSrcSet(imgUrl, [400, 600, 800, 1200])}
                                     sizes={generateSizes('article')}
                                     alt={removeAccents(caps[imgIdx]) || `${removeAccents(projectData.title)} - Anh chi tiet ${index + 1}-${imgIdx + 1}`} 
                                     loading="lazy" 
                                     className="w-full object-cover" 
                                   />
                                  {caps[imgIdx] && (
                                    <div className="text-gray-500 text-center py-2.5 px-4 text-xs sm:text-sm italic font-medium">
                                      {caps[imgIdx]}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          );
                        })()}
                      </div>
                    );
                  })
                ) : (
                  <p className="text-center italic text-gray-500">Nội dung chi tiết đang được cập nhật...</p>
                )}
              </div>
            </div>

            {/* CỘT PHẢI: FORM TƯ VẤN */}
            <div className="lg:w-1/3 xl:w-1/4 sticky top-28 z-10 w-full">
              <div className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
                <div className="bg-[#1A1A1A] text-center py-3 border-b-2 border-green-500">
                  <h3 className="text-green-500 text-lg font-bold uppercase tracking-wider">Nhận tư vấn ngay</h3>
                </div>
                <form onSubmit={handleSubmit} className="p-4 space-y-3">
                  <input required type="text" placeholder="Họ và tên (*)" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all text-sm" />
                  <div className="grid grid-cols-2 gap-2">
                    <input required type="tel" placeholder="SĐT (*)" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-sm" />
                    <input required type="email" placeholder="Email (*)" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-sm" />
                  </div>
                  <input required type="text" placeholder="Diện tích sàn & số tầng (*)" value={formData.area} onChange={(e) => setFormData({ ...formData, area: e.target.value })} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-sm" />
                  <input required type="text" placeholder="Địa phương muốn xây (*)" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-sm" />
                  <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-sm text-gray-600">
                    <option>Loại hình xây dựng (*)</option>
                    <option>Nhà phố</option>
                    <option>Biệt thự</option>
                    <option>Căn hộ</option>
                  </select>
                  <div className="bg-gray-50 p-2 border border-gray-100 rounded-sm">
                    <p className="font-bold text-gray-700 mb-2 text-xs">Ngân sách dự kiến (*)</p>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                      <label className="flex items-center gap-1.5 cursor-pointer"><input type="radio" name="budget" value="1.8 - 2.3 tỷ" checked={formData.budget === '1.8 - 2.3 tỷ'} onChange={(e) => setFormData({ ...formData, budget: e.target.value })} className="accent-green-500" /> 1.8 - 2.3 tỷ</label>
                      <label className="flex items-center gap-1.5 cursor-pointer"><input type="radio" name="budget" value="2.4 - 2.9 tỷ" checked={formData.budget === '2.4 - 2.9 tỷ'} onChange={(e) => setFormData({ ...formData, budget: e.target.value })} className="accent-green-500" /> 2.4 - 2.9 tỷ</label>
                      <label className="flex items-center gap-1.5 cursor-pointer"><input type="radio" name="budget" value="3 - 3.5 tỷ" checked={formData.budget === '3 - 3.5 tỷ'} onChange={(e) => setFormData({ ...formData, budget: e.target.value })} className="accent-green-500" /> 3 - 3.5 tỷ</label>
                      <label className="flex items-center gap-1.5 cursor-pointer"><input type="radio" name="budget" value="> 3.5 tỷ" checked={formData.budget === '> 3.5 tỷ'} onChange={(e) => setFormData({ ...formData, budget: e.target.value })} className="accent-green-500" /> {`> 3.5 tỷ`}</label>
                    </div>
                  </div>
                  <textarea rows="2" placeholder="Yêu cầu chi tiết nếu có!" value={formData.details} onChange={(e) => setFormData({ ...formData, details: e.target.value })} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-sm resize-none"></textarea>
                  <div className="pt-1">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full text-white font-bold uppercase tracking-widest py-2.5 rounded-sm shadow-md transition-colors text-sm ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'}`}
                    >
                      {isSubmitting ? 'Đang gửi...' : 'Gửi yêu cầu ngay'}
                    </button>
                  </div>
                </form>
              </div>
            </div>

          </div>

          {/* 4. CÔNG TRÌNH LIÊN QUAN (Sử dụng dữ liệu fetch từ DB) */}
          {relatedProjects.length > 0 && (
            <div className="mt-16 border-t border-gray-200 pt-10">
              <h2 className="text-lg md:text-xl font-bold uppercase tracking-widest text-black mb-6">
                Công trình liên quan
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {relatedProjects.map((item) => (
                  <Link
                    to={`/hang-muc/cong-trinh-chi-tiet/${generateSlug(item.title)}-${item._id}`} // Dùng slug + _id để SEO
                    key={item._id}
                    className="group block rounded-sm overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                  >
                    <div className="aspect-4/3 w-full overflow-hidden relative bg-gray-100">
                      {/* Layer nền mờ: lấp đầy khoảng trống khi ảnh không vừa khung */}
                      <img
                        src={optimizeCloudinaryUrl(item.mainImage, 50)}
                        alt="" aria-hidden="true"
                        className="absolute inset-0 w-full h-full object-cover blur-2xl scale-125 pointer-events-none"
                      />
                      {/* Ảnh chính: hiển thị đầy đủ không bị crop */}
                      <img
                        src={optimizeCloudinaryUrl(item.mainImage, 600)}
                        srcSet={generateSrcSet(item.mainImage, [300, 400, 600])}
                        sizes={generateSizes('card')}
                        alt={item.title}
                        className="relative w-full h-full object-contain z-10 transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                        loading="lazy"
                      />
                      {/* Lớp phủ mờ (glassmorphism) hiển thị tên công trình */}
                      <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm p-3 text-center transition-all duration-300 border-t border-gray-100/50 z-20">
                        <h3 className="text-xs sm:text-sm font-bold text-gray-800 line-clamp-2 uppercase group-hover:text-green-600 transition-colors duration-300">
                          {item.title}
                        </h3>
                      </div>
                      {/* Lớp phủ nút Xem chi tiết nằm lệch lên trên, không che mất phần chữ mờ */}
                      <div className="absolute inset-x-0 top-0 bottom-12 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
                        <span className="text-white border border-white px-3 py-1 text-[10px] uppercase tracking-widest font-bold bg-black/30 backdrop-blur-sm rounded-sm">
                          Xem chi tiết
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>
      </section>

      {/* =========================================
          LIGHTBOX MODAL (Toàn màn hình) - Giữ nguyên logic
      ========================================= */}
      {isLightboxOpen && allImages.length > 0 && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center select-none backdrop-blur-sm"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <button onClick={closeLightbox} className="absolute top-5 right-5 text-gray-400 hover:text-green-500 z-50 p-2 transition-colors">
            <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>

          <div className="absolute top-5 left-5 text-white text-lg font-bold tracking-widest z-50 bg-black/50 px-4 py-1 rounded-full">
            {lightboxIndex + 1} / {allImages.length}
          </div>

          <button onClick={prevImage} className="absolute left-2 md:left-10 top-1/2 -translate-y-1/2 text-white hover:text-green-500 z-50 p-2 md:p-4 bg-black/50 hover:bg-black/80 rounded-full transition-all">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
          </button>

          <div className="w-full max-w-6xl px-4 md:px-20 flex items-center justify-center h-[70vh]">
            <img
              src={optimizeCloudinaryUrl(allImages[lightboxIndex])} // Tải định dạng tự động tốt nhất (AVIF/WebP) để load nhanh mà giữ nguyên kích thước & chất lượng gốc
              alt={`Gallery ${lightboxIndex}`}
              className="max-w-full max-h-full object-contain shadow-2xl"
            />
          </div>

          <button onClick={nextImage} className="absolute right-2 md:right-10 top-1/2 -translate-y-1/2 text-white hover:text-green-500 z-50 p-2 md:p-4 bg-black/50 hover:bg-black/80 rounded-full transition-all">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
          </button>

          <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-2 px-4 overflow-x-auto pb-4">
            {allImages.map((img, idx) => (
              <img
                key={idx}
                src={optimizeCloudinaryUrl(img, 150)}
                srcSet={generateSrcSet(img, [100, 150, 200])}
                sizes={generateSizes('thumbnail')}
                alt={`Thumb ${idx}`}
                onClick={() => setLightboxIndex(idx)}
                className={`h-16 md:h-20 w-auto object-cover cursor-pointer border-2 transition-all rounded-sm ${lightboxIndex === idx ? 'border-green-500 opacity-100 scale-110' : 'border-transparent opacity-40 hover:opacity-100'}`}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectDetail;