import React, { useState, useEffect, useMemo, useRef } from 'react';
import toast from 'react-hot-toast';
import ReactQuill, { Quill } from 'react-quill-new';
import SeoScorePanel from '../components/SeoScorePanel';
import 'react-quill-new/dist/quill.snow.css';

// Đăng ký Size chữ
const Size = Quill.import('attributors/style/size');
Size.whitelist = ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px'];
Quill.register(Size, true);

// Hàm hỗ trợ chuyển đổi URL Youtube sang dạng embed
export const getYoutubeEmbedUrl = (url) => {
  if (!url) return '';
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}`;
  }
  if (url.length === 11) {
    return `https://www.youtube.com/embed/${url}`;
  }
  return url;
};

// Hàm lấy YouTube Thumbnail ID
export const getYoutubeThumbnail = (url) => {
  if (!url) return '';
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    return `https://img.youtube.com/vi/${match[2]}/hqdefault.jpg`;
  }
  if (url.length === 11) {
    return `https://img.youtube.com/vi/${url}/hqdefault.jpg`;
  }
  return '';
};

const ManageVideo = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const quillRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    youtubeUrl: '',
    description: '',
    content: '',
    focusKeyword: '',
    metaDescription: '',
    isFeatured: false,
    order: 0
  });

  const fetchVideos = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/videos`);
      const data = await res.json();
      if (data.success) {
        setVideos(data.videos);
      }
    } catch (error) {
      toast.error("Lỗi khi tải danh sách video!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'size': ['12px', '14px', false, '18px', '20px', '24px', '28px', '32px'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image', 'video'],
      ['clean']
    ]
  }), []);

  const formats = [
    'header', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'align',
    'list', 'bullet',
    'link', 'image', 'video'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return toast.error("Vui lòng nhập tiêu đề video!");
    if (!formData.youtubeUrl.trim()) return toast.error("Vui lòng nhập đường dẫn YouTube!");

    const toastId = toast.loading(editingId ? "Đang cập nhật video..." : "Đang thêm video mới...");

    const cleanedContent = (formData.content || '')
      .replace(/&nbsp;/g, ' ')
      .replace(/\u00a0/g, ' ')
      .replace(/[\u200b\u200c\u200d\ufeff]/g, '')
      .replace(/&shy;|\u00ad/g, '');

    const payload = {
      ...formData,
      content: cleanedContent
    };

    try {
      const url = editingId 
        ? `${import.meta.env.VITE_API_URL}/api/videos/${editingId}`
        : `${import.meta.env.VITE_API_URL}/api/videos`;
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        toast.success(editingId ? "Cập nhật video thành công!" : "Thêm video mới thành công!", { id: toastId });
        handleCancelEdit();
        fetchVideos();
      } else {
        toast.error(data.message || "Có lỗi xảy ra!", { id: toastId });
      }
    } catch (error) {
      toast.error("Lỗi kết nối máy chủ!", { id: toastId });
    }
  };

  const handleEdit = (video) => {
    setEditingId(video._id);
    setFormData({
      title: video.title || '',
      youtubeUrl: video.youtubeUrl || '',
      description: video.description || '',
      content: video.content || '',
      focusKeyword: video.focusKeyword || '',
      metaDescription: video.metaDescription || '',
      isFeatured: video.isFeatured || false,
      order: video.order || 0
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      title: '',
      youtubeUrl: '',
      description: '',
      content: '',
      focusKeyword: '',
      metaDescription: '',
      isFeatured: false,
      order: 0
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa video này?")) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/videos/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast.success("Xóa video thành công!");
        setVideos(videos.filter(v => v._id !== id));
      } else {
        toast.error("Không thể xóa video!");
      }
    } catch (error) {
      toast.error("Lỗi hệ thống!");
    }
  };

  const handleToggleFeature = async (id) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/videos/${id}/feature`, { method: 'PATCH' });
      const data = await res.json();
      if (data.success) {
        toast.success("Đã cập nhật trạng thái nổi bật!");
        fetchVideos();
      }
    } catch (error) {
      toast.error("Lỗi khi cập nhật!");
    }
  };

  const embedPreviewUrl = getYoutubeEmbedUrl(formData.youtubeUrl);

  if (loading) return <div className="p-6">Đang tải danh sách video...</div>;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Quản lý Video YouTube & Bài viết</h2>

      {/* FORM THÊM / SỬA VIDEO */}
      <form onSubmit={handleSubmit} className="mb-10 bg-gray-50 p-6 rounded-xl border border-gray-200">
        <h3 className="font-bold text-lg text-green-700 mb-4">
          {editingId ? "Cập nhật Video & Bài viết" : "Thêm Video mới"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Tiêu đề Video <span className="text-red-500">*</span>
            </label>
            <input
              required
              type="text"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              className="w-full border p-2.5 rounded-lg bg-white outline-none focus:border-green-500"
              placeholder="VD: Video Thi Công Thực Tế Biệt Thự Phố Đà Nẵng"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Đường dẫn Video YouTube <span className="text-red-500">*</span>
            </label>
            <input
              required
              type="text"
              value={formData.youtubeUrl}
              onChange={e => setFormData({...formData, youtubeUrl: e.target.value})}
              className="w-full border p-2.5 rounded-lg bg-white outline-none focus:border-green-500"
              placeholder="VD: https://www.youtube.com/watch?v=XXXXX hoặc https://youtu.be/XXXXX"
            />
          </div>
        </div>

        {/* PREVIEW YOUTUBE VIDEO */}
        {embedPreviewUrl && (
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-2">Xem trước Video Embed:</label>
            <div className="w-full max-w-xl aspect-video rounded-lg overflow-hidden border border-gray-300 bg-black">
              <iframe
                src={embedPreviewUrl}
                title="YouTube Video Preview"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-700 mb-1">Mô tả ngắn về Video</label>
          <textarea
            rows="2"
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
            className="w-full border p-2.5 rounded-lg bg-white outline-none focus:border-green-500 resize-none"
            placeholder="Tóm tắt ngắn nội dung video..."
          ></textarea>
        </div>

        {/* BÀI VIẾT CHI TIẾT KÈM THEO VIDEO */}
        <div className="mb-6">
          <label className="block text-sm font-bold text-gray-700 mb-1">
            Bài viết chi tiết đi kèm Video <span className="text-gray-400 font-normal">(Viết bài tương tự như Dự án / Blog - Tùy chọn)</span>
          </label>
          <div className="bg-white rounded-lg border">
            <ReactQuill
              ref={quillRef}
              theme="snow"
              value={formData.content}
              onChange={(val) => setFormData({...formData, content: val})}
              modules={modules}
              formats={formats}
              className="h-80 mb-12"
              placeholder="Soạn thảo bài viết chi tiết giới thiệu dự án, quy trình thi công hoặc thông tin kiến trúc liên quan đến video này..."
            />
          </div>
        </div>

        {/* SEO FIELDS & CÀI ĐẶT */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Từ khóa SEO chính</label>
            <input
              type="text"
              value={formData.focusKeyword}
              onChange={e => setFormData({...formData, focusKeyword: e.target.value})}
              placeholder="VD: thi công biệt thự đà nẵng"
              className="w-full border p-2 rounded-lg bg-white outline-none focus:border-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Mô tả SEO (Meta Description)</label>
            <input
              type="text"
              value={formData.metaDescription}
              onChange={e => setFormData({...formData, metaDescription: e.target.value})}
              placeholder="Mô tả ngắn hiển thị trên kết quả tìm kiếm Google"
              className="w-full border p-2 rounded-lg bg-white outline-none focus:border-green-500"
              maxLength={160}
            />
          </div>

          <div className="flex items-center gap-6 pt-6">
            <label className="flex items-center gap-2 font-bold text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={e => setFormData({...formData, isFeatured: e.target.checked})}
                className="w-5 h-5 accent-green-600 rounded"
              />
              Đánh dấu Nổi Bật
            </label>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-0.5">Thứ tự</label>
              <input
                type="number"
                value={formData.order}
                onChange={e => setFormData({...formData, order: e.target.value})}
                className="w-20 border p-1.5 rounded-lg bg-white text-center"
              />
            </div>
          </div>
        </div>

        {/* SEO SCORE PANEL */}
        {formData.content && (
          <div className="mb-6">
            <SeoScorePanel
              title={formData.title}
              content={formData.content}
              focusKeyword={formData.focusKeyword}
              metaDescription={formData.metaDescription}
              hasImage={!!embedPreviewUrl}
              type="blog"
            />
          </div>
        )}

        <div className="flex gap-4">
          <button type="submit" className="bg-green-600 text-white font-bold px-8 py-2.5 rounded-lg hover:bg-green-700 transition">
            {editingId ? "Lưu Cập Nhật Video" : "Thêm Video Mới"}
          </button>
          {editingId && (
            <button type="button" onClick={handleCancelEdit} className="bg-gray-400 text-white font-bold px-8 py-2.5 rounded-lg hover:bg-gray-500 transition">
              Hủy
            </button>
          )}
        </div>
      </form>

      {/* DANH SÁCH VIDEO */}
      <h3 className="text-xl font-bold text-gray-800 mb-4">Danh sách Video hiện tại ({videos.length})</h3>
      {videos.length === 0 ? (
        <p className="text-gray-500 italic">Chưa có video nào. Hãy thêm video mới!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map(item => {
            const thumbUrl = getYoutubeThumbnail(item.youtubeUrl);
            return (
              <div key={item._id} className={`border rounded-xl overflow-hidden group relative flex flex-col justify-between transition-all ${item.isFeatured ? 'border-yellow-400 bg-yellow-50/20 shadow-md' : 'border-gray-200 bg-white'}`}>
                {/* BUTTON NỔI BẬT */}
                <button
                  onClick={() => handleToggleFeature(item._id)}
                  className={`absolute top-2 right-2 z-10 text-xl transition-transform hover:scale-125 bg-black/60 backdrop-blur-sm rounded-full w-8 h-8 flex items-center justify-center ${item.isFeatured ? 'text-yellow-400' : 'text-white hover:text-yellow-200'}`}
                  title="Bật/Tắt Nổi Bật"
                >
                  ★
                </button>

                <div>
                  <div className="relative aspect-video bg-black overflow-hidden">
                    {thumbUrl ? (
                      <img src={thumbUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white text-xs">Video Embed</div>
                    )}
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg">
                        ▶
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <h4 className="font-bold text-gray-800 text-base line-clamp-2 mb-2">{item.title}</h4>
                    {item.description && (
                      <p className="text-xs text-gray-600 line-clamp-2 mb-3">{item.description}</p>
                    )}
                    {item.content && (
                      <span className="inline-block bg-blue-50 text-blue-600 text-xs font-semibold px-2 py-0.5 rounded">
                        Có bài viết chi tiết
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4 pt-0 border-t border-gray-100 flex items-center justify-between mt-3">
                  <span className="text-xs text-gray-400">Thứ tự: {item.order}</span>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(item)} className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1.5 rounded hover:bg-blue-100">
                      Sửa
                    </button>
                    <button onClick={() => handleDelete(item._id)} className="bg-red-50 text-red-600 text-xs font-bold px-3 py-1.5 rounded hover:bg-red-100">
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ManageVideo;
