import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Breadcrumb from '../components/Breadcrumb';
import { generateSlug } from '../utils/slugify';

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

// Hàm lấy link embed YouTube
const getYoutubeEmbedUrl = (url) => {
  const id = getYoutubeId(url);
  return id ? `https://www.youtube.com/embed/${id}?autoplay=1` : url;
};

// Hàm lấy thumbnail high-res từ YouTube
const getYoutubeThumbnail = (url) => {
  const id = getYoutubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : '';
};

const Videos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeVideoModal, setActiveVideoModal] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/videos`);
        const data = await res.json();
        if (data.success) {
          const formatted = data.videos.map(v => ({
            ...v,
            date: new Date(v.createdAt).toLocaleDateString('vi-VN', {
              year: 'numeric', month: '2-digit', day: '2-digit'
            })
          }));
          setVideos(formatted);
        }
      } catch (error) {
        console.error("Lỗi tải video:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  const featuredVideo = videos.find(v => v.isFeatured) || videos[0];
  const regularVideos = videos;

  if (loading) {
    return (
      <div className="pt-24 md:pt-32 pb-16 min-h-screen flex justify-center items-center bg-gray-50">
        <p className="animate-pulse text-green-600 font-bold text-sm md:text-base">Đang tải danh sách Video...</p>
      </div>
    );
  }

  return (
    <section className="pt-24 md:pt-32 pb-10 md:pb-20 bg-gray-50 min-h-screen">
      <Helmet>
        <title>Video Công Trình & Thiết Kế Thi Công | Trường Thành Phát</title>
        <meta name="description" content="Tổng hợp video quay thực tế các công trình nhà phố, biệt thự, thiết kế nội thất và quy trình thi công xây dựng của Trường Thành Phát." />
        <link rel="canonical" href="https://truongthanhphatdn.vn/video" />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: 'Video Công Trình' }]} />

        {/* HEADER SECTION */}
        <div className="text-center mb-8 md:mb-12">
          <span className="text-red-600 font-bold uppercase tracking-widest text-xs md:text-sm bg-red-50 px-3 py-1 rounded-full border border-red-100">
            VIDEO NHÀ ĐẸP
          </span>
          <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 mt-2 mb-3 tracking-tight">
            VIDEO DỰ ÁN & THI CÔNG
          </h1>
          <div className="w-16 md:w-24 h-1 bg-green-500 mx-auto rounded-full mb-3"></div>
          <p className="max-w-2xl mx-auto text-xs md:text-base text-gray-600">
            Theo dõi video thực tế quá trình thi công, bàn giao công trình và các xu hướng thiết kế nhà phố, biệt thự đẹp mới nhất từ Trường Thành Phát.
          </p>
        </div>

        {/* FEATURED VIDEO BANNER (NẾU CÓ) */}
        {featuredVideo && (
          <div className="mb-12 bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0">
            <div className="lg:col-span-7 relative aspect-video bg-black group overflow-hidden">
              {activeVideoModal === featuredVideo._id ? (
                <iframe
                  src={getYoutubeEmbedUrl(featuredVideo.youtubeUrl)}
                  title={featuredVideo.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <div
                  className="w-full h-full relative cursor-pointer group"
                  onClick={() => setActiveVideoModal(featuredVideo._id)}
                >
                  <img
                    src={getYoutubeThumbnail(featuredVideo.youtubeUrl)}
                    alt={featuredVideo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-red-600 text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                      <svg className="w-8 h-8 md:w-10 md:h-10 ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                  <span className="absolute bottom-3 left-3 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded">
                    ★ Video Nổi Bật
                  </span>
                </div>
              )}
            </div>

            <div className="lg:col-span-5 p-6 md:p-8 flex flex-col justify-between">
              <div>
                <span className="text-xs text-gray-400 font-semibold">{featuredVideo.date}</span>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-2 mb-3 leading-snug">
                  {featuredVideo.title}
                </h2>
                {featuredVideo.description && (
                  <p className="text-xs md:text-sm text-gray-600 leading-relaxed mb-4 line-clamp-4">
                    {featuredVideo.description}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={() => setActiveVideoModal(featuredVideo._id)}
                  className="bg-red-600 hover:bg-red-700 text-white text-xs md:text-sm font-bold px-5 py-2.5 rounded-lg flex items-center gap-2 shadow-sm transition"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Xem Video
                </button>

                {featuredVideo.content && (
                  <Link
                    to={`/video/${generateSlug(featuredVideo.title)}-${featuredVideo._id}`}
                    className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs md:text-sm font-bold px-5 py-2.5 rounded-lg flex items-center gap-2 shadow-sm transition"
                  >
                    Đọc bài viết chi tiết
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}

        {/* GRID CÁC VIDEO KHÁC */}
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span className="w-2.5 h-6 bg-green-600 rounded-full inline-block"></span>
          Tất cả Video ({videos.length})
        </h2>

        {regularVideos.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <p className="text-gray-500 font-medium">Hiện chưa có video nào được tải lên.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {regularVideos.map((video) => {
              const thumbnail = getYoutubeThumbnail(video.youtubeUrl);
              const isPlaying = activeVideoModal === video._id;

              return (
                <div
                  key={video._id}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 flex flex-col justify-between group"
                >
                  <div>
                    {/* VIDEO CONTAINER */}
                    <div className="relative aspect-video bg-black overflow-hidden">
                      {isPlaying ? (
                        <iframe
                          src={getYoutubeEmbedUrl(video.youtubeUrl)}
                          title={video.title}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      ) : (
                        <div
                          className="w-full h-full relative cursor-pointer"
                          onClick={() => setActiveVideoModal(video._id)}
                        >
                          <img
                            src={thumbnail}
                            alt={video.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                              <svg className="w-6 h-6 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                          </div>
                          {video.isFeatured && (
                            <span className="absolute top-2 left-2 bg-yellow-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                              ★ Nổi Bật
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* CONTENT INFO */}
                    <div className="p-4 md:p-5">
                      <span className="text-[11px] text-gray-400 font-semibold block mb-1">
                        {video.date}
                      </span>
                      <h3 className="font-bold text-gray-900 text-base leading-snug line-clamp-2 group-hover:text-green-600 transition-colors mb-2">
                        {video.title}
                      </h3>
                      {video.description && (
                        <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                          {video.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="p-4 md:p-5 pt-0 border-t border-gray-50 flex items-center justify-between mt-3">
                    <button
                      onClick={() => setActiveVideoModal(isPlaying ? null : video._id)}
                      className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                      {isPlaying ? 'Tắt Video' : 'Phát Video'}
                    </button>

                    {video.content ? (
                      <Link
                        to={`/video/${generateSlug(video.title)}-${video._id}`}
                        className="text-xs font-bold text-green-600 hover:text-green-800 flex items-center gap-1"
                      >
                        Bài viết chi tiết
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    ) : (
                      <span className="text-[11px] text-gray-400">Chỉ có Video</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Videos;
