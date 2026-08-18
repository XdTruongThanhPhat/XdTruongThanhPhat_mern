import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { generateSlug } from '../utils/slugify';
import Breadcrumb from '../components/Breadcrumb';
import { transformYoutubeLinksToEmbed } from '../utils/embedVideo';

// Hàm extract ID YouTube
const getYoutubeId = (url) => {
  if (!url) return '';
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    return match[2];
  }
  return url.length === 11 ? url : '';
};

const getYoutubeEmbedUrl = (url) => {
  const id = getYoutubeId(url);
  return id ? `https://www.youtube.com/embed/${id}` : url;
};

const extractDescription = (htmlContent, maxLength = 155) => {
  if (!htmlContent) return '';
  const cleanText = htmlContent
    .replace(/<[^>]*>?/gm, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return cleanText.substring(0, maxLength) + (cleanText.length > maxLength ? '...' : '');
};

const decodeHTMLEntities = (text) => {
  if (!text) return '';
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, ' ');
};

const VideoDetail = () => {
  const { id: slug } = useParams();
  const [video, setVideo] = useState(null);
  const [recentVideos, setRecentVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [toc, setToc] = useState([]);
  const [showToc, setShowToc] = useState(true);
  const [contentWithIds, setContentWithIds] = useState("");

  const [formData, setFormData] = useState({ name: '', phone: '', email: '', content: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchVideoData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/videos`);
        const data = await res.json();

        if (data.success) {
          const current = data.videos.find(v => v._id === slug || slug.endsWith(v._id));
          if (current) {
            current.date = new Date(current.createdAt).toLocaleDateString('vi-VN');
            setVideo(current);
          }

          const recents = data.videos
            .filter(v => !current || v._id !== current._id)
            .slice(0, 5)
            .map(v => ({
              ...v,
              date: new Date(v.createdAt).toLocaleDateString('vi-VN')
            }));
          setRecentVideos(recents);
        }
      } catch (error) {
        console.error("Lỗi khi tải chi tiết video:", error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchVideoData();
      window.scrollTo(0, 0);
    }
  }, [slug]);

  // XỬ LÝ MỤC LỤC CHI TIẾT KHI CÓ CONTENT
  useEffect(() => {
    if (video && video.content) {
      let headingIndex = 0;
      const tocItems = [];
      const cleanedContent = video.content
        .replace(/&nbsp;/g, ' ')
        .replace(/\u00a0/g, ' ')
        .replace(/[\u200b\u200c\u200d\ufeff]/g, '')
        .replace(/&shy;|\u00ad/g, '');

      const newContent = cleanedContent.replace(/<(h[23])(.*?)>(.*?)<\/\1>/gi, (match, tag, attributes, innerText) => {
        const id = `video-heading-${headingIndex++}`;
        const cleanText = decodeHTMLEntities(
          innerText.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/gi, ' ').trim()
        );

        tocItems.push({
          id,
          text: cleanText,
          level: tag.toLowerCase()
        });

        return `<${tag} id="${id}"${attributes}>${innerText}</${tag}>`;
      });

      setContentWithIds(transformYoutubeLinksToEmbed(newContent));
      setToc(tocItems);
    }
  }, [video]);

  const scrollToHeading = (headingId) => {
    const element = document.getElementById(headingId);
    if (element) {
      const yOffset = -100;
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    const toastId = toast.loading("Đang gửi thông tin...");

    const payload = {
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      content: `[Từ Video: ${video?.title}]\n\n${formData.content}`
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        toast.success("Gửi thành công! Trường Thành Phát sẽ liên hệ tư vấn lại sớm nhất.", { id: toastId });
        setFormData({ name: '', phone: '', email: '', content: '' });
      } else {
        toast.error("Có lỗi xảy ra, vui lòng thử lại sau.", { id: toastId });
      }
    } catch (error) {
      toast.error("Lỗi kết nối máy chủ!", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-24 md:pt-32 pb-16 min-h-screen flex justify-center items-center bg-gray-50">
        <p className="animate-pulse text-green-600 font-bold text-sm md:text-base">Đang tải video...</p>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="pt-24 md:pt-32 pb-16 min-h-screen flex justify-center items-center bg-gray-50">
        <p className="text-red-500 font-bold text-lg md:text-xl">Không tìm thấy video!</p>
      </div>
    );
  }

  const metaDesc = video.metaDescription || video.description || extractDescription(video.content) || `Video ${video.title} từ Trường Thành Phát`;

  return (
    <section className="pt-24 md:pt-32 pb-10 md:pb-20 bg-gray-50 min-h-screen relative">
      <Helmet>
        <title>{video.title} | Video Trường Thành Phát</title>
        <meta name="description" content={metaDesc} />
        <link rel="canonical" href={`https://truongthanhphatdn.vn/video/${generateSlug(video.title)}-${video._id}`} />

        <meta property="og:type" content="article" />
        <meta property="og:title" content={video.title} />
        <meta property="og:description" content={metaDesc} />
        <meta property="og:url" content={`https://truongthanhphatdn.vn/video/${generateSlug(video.title)}-${video._id}`} />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "VideoObject",
            "name": video.title,
            "description": metaDesc,
            "thumbnailUrl": [
              `https://img.youtube.com/vi/${getYoutubeId(video.youtubeUrl)}/hqdefault.jpg`
            ],
            "uploadDate": video.createdAt,
            "embedUrl": getYoutubeEmbedUrl(video.youtubeUrl)
          })}
        </script>
      </Helmet>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <Breadcrumb items={[
          { label: 'Video', link: '/video' },
          { label: video.title }
        ]} />

        <div className="flex flex-col lg:flex-row gap-6 md:gap-10">
          {/* CỘT TRÁI: KHUNG VIDEO VÀ BÀI VIẾT CHI TIẾT */}
          <div className="w-full lg:w-2/3 xl:w-3/4 min-w-0 bg-white p-4 md:p-10 rounded-lg md:rounded-xl shadow-sm border border-gray-100">
            {/* Header video */}
            <div className="mb-5 border-b border-gray-100 pb-4">
              <span className="inline-block bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-sm mb-3">
                Video Thực Tế
              </span>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-black leading-tight mb-3">
                {video.title}
              </h1>
              <div className="text-xs md:text-sm text-gray-500 font-medium">
                <span>Đăng ngày: {video.date}</span>
              </div>
            </div>

            {/* MÀN HÌNH PLAYER YOUTUBE */}
            <div className="w-full aspect-video rounded-xl overflow-hidden mb-6 bg-black shadow-lg">
              <iframe
                src={getYoutubeEmbedUrl(video.youtubeUrl)}
                title={video.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            {/* MÔ TẢ NGẮN */}
            {video.description && (
              <div className="bg-gray-50 p-4 md:p-5 rounded-lg border-l-4 border-green-500 mb-8">
                <p className="text-sm md:text-base text-gray-700 font-medium leading-relaxed">
                  {video.description}
                </p>
              </div>
            )}

            {/* MỤC LỤC (NẾU CÓ CONTENT) */}
            {toc.length > 0 && (
              <div className="mb-8 bg-gray-50 border border-gray-200 rounded-lg p-5">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-lg text-black uppercase">Mụclục bài viết</h3>
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
                        className={`cursor-pointer hover:text-green-600 transition-colors flex items-start gap-2 ${item.level === 'h3' ? 'ml-6 text-sm' : 'font-medium mt-2 text-base'}`}
                        onClick={() => scrollToHeading(item.id)}
                      >
                        {item.level === 'h2' && <span className="text-green-500">▪</span>}
                        {item.level === 'h3' && <span className="text-gray-400">-</span>}
                        <span className="flex-1 leading-snug">{item.text}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* NỘI DUNG BÀI VIẾT CHI TIẾT HTML */}
            {video.content ? (
              <div
                className="blog-content text-gray-700 text-sm md:text-lg leading-relaxed"
                dangerouslySetInnerHTML={{ __html: contentWithIds || video.content }}
              />
            ) : null}

            {/* FORM LIÊN HỆ TƯ VẤN DƯỚI BÀI VIẾT */}
            <div className="mt-10 bg-gray-50 p-6 md:p-8 rounded-xl border border-gray-200 shadow-sm">
              <div className="text-center mb-6">
                <h3 className="text-lg md:text-xl font-bold uppercase tracking-widest text-black mb-2">
                  Đăng ký tư vấn trực tiếp từ KTS Trường Thành Phát
                </h3>
                <p className="text-xs md:text-sm text-gray-500">
                  Hãy để lại thông tin để được đội ngũ kiến trúc sư liên hệ tư vấn thiết kế và báo giá chi tiết hoàn toàn miễn phí.
                </p>
              </div>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    required
                    type="text"
                    placeholder="Họ và tên *"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-md outline-none focus:border-green-500 text-sm"
                  />
                  <input
                    required
                    type="tel"
                    placeholder="Số điện thoại *"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-md outline-none focus:border-green-500 text-sm"
                  />
                </div>
                <textarea
                  required
                  rows="3"
                  placeholder="Ghi chú nhu cầu thiết kế/thi công của bạn..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-md outline-none focus:border-green-500 text-sm resize-none"
                ></textarea>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full text-white font-bold uppercase tracking-widest py-3 rounded-md shadow-md transition-colors text-sm ${isSubmitting ? 'bg-gray-400' : 'bg-green-600 hover:bg-black'}`}
                >
                  {isSubmitting ? 'Đang gửi thông tin...' : 'Gửi yêu cầu ngay'}
                </button>
              </form>
            </div>
          </div>

          {/* CỘT PHẢI: VIDEO KHÁC */}
          <div className="w-full lg:w-1/3 xl:w-1/4">
            <div className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-20 md:top-28">
              <div className="bg-[#1A1A1A] text-center py-3 border-b-2 border-green-500">
                <h3 className="text-white text-sm md:text-base font-bold uppercase tracking-wider">Video xem nhiều</h3>
              </div>

              <div className="p-3 md:p-4 flex flex-col gap-4">
                {recentVideos.map(item => (
                  <Link
                    to={`/video/${generateSlug(item.title)}-${item._id}`}
                    key={item._id}
                    className="group flex gap-3 items-start border-b border-gray-50 pb-3 last:border-none"
                  >
                    <div className="w-24 h-16 shrink-0 overflow-hidden rounded bg-black relative">
                      <img
                        src={`https://img.youtube.com/vi/${getYoutubeId(item.youtubeUrl)}/hqdefault.jpg`}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <span className="text-white text-xs">▶</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xs font-bold text-gray-800 line-clamp-2 group-hover:text-green-600 transition-colors leading-snug">
                        {item.title}
                      </h4>
                      <span className="text-[10px] text-gray-400 italic block mt-1">{item.date}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .blog-content h1 { font-size: 2rem; font-weight: bold; margin-top: 2rem; margin-bottom: 1rem; color: #111827; }
        .blog-content h2 { font-size: 1.5rem; font-weight: bold; margin-top: 2rem; margin-bottom: 1rem; color: #111827; scroll-margin-top: 100px; }
        .blog-content h3 { font-size: 1.25rem; font-weight: bold; margin-top: 1.5rem; margin-bottom: 0.75rem; color: #1f2937; scroll-margin-top: 100px; }
        .blog-content p { text-align: justify; font-size: 1rem; margin-bottom: 1.5rem; color: #4b5563; line-height: 1.625; }
        .blog-content img { max-width: 100%; height: auto; border-radius: 0.5rem; margin: 1.5rem 0; }
        .blog-content a { color: #16a34a; text-decoration: underline; }
        .blog-content ul { list-style-type: disc; margin-left: 1.5rem; margin-bottom: 1rem; }
        .blog-content ol { list-style-type: decimal; margin-left: 1.5rem; margin-bottom: 1rem; }
        .blog-content iframe.ql-video { width: 100%; aspect-ratio: 16/9; border-radius: 0.5rem; margin: 1.5rem 0; }
      `}} />
    </section>
  );
};

export default VideoDetail;
