import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { compressImageIfNeeded } from '../utils/compressImage';

const ManageBanner = () => {
  const [banners, setBanners] = useState([]);
  const [formData, setFormData] = useState({ title: '', subtitle: '', file: null });

  const fetchBanners = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/banners`);
      const data = await res.json();
      if(data.success) setBanners(data.banners);
    } catch (error) { toast.error("Lỗi tải dữ liệu!"); }
  };
  
  useEffect(() => { fetchBanners(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.file) return toast.error("Vui lòng chọn ảnh Banner!");
    const toastId = toast.loading("Đang tải banner lên...");
    
    const data = new FormData();
    data.append('title', formData.title);
    data.append('subtitle', formData.subtitle);
    data.append('image', formData.file);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/banners`, { method: 'POST', body: data });
      const result = await res.json();
      if (result.success) {
        toast.success("Thêm banner thành công!", { id: toastId });
        setFormData({ title: '', subtitle: '', file: null });
        fetchBanners();
      } else {
        toast.error(result.message, { id: toastId });
      }
    } catch (error) { toast.error("Lỗi đăng bài", { id: toastId }); }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Xóa banner này?")) return;
    await fetch(`${import.meta.env.VITE_API_URL}/api/banners/${id}`, { method: 'DELETE' });
    setBanners(banners.filter(b => b._id !== id));
    toast.success("Đã xóa!");
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-6xl">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Quản lý Slide Banner (Trang chủ)</h2>
      
      {/* FORM THÊM BANNER */}
      <form onSubmit={handleSubmit} className="mb-10 bg-green-50 p-6 rounded-lg border border-green-200">
        <h3 className="font-bold text-green-700 mb-4">Thêm Banner Mới</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
                <label className="block text-sm font-bold mb-1 text-gray-700">Tiêu đề chính (Title)</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border p-2.5 rounded bg-white" placeholder="VD: Kiến Tạo Không Gian..." />
            </div>
            <div>
                <label className="block text-sm font-bold mb-1 text-gray-700">Tiêu đề phụ (Subtitle)</label>
                <input required type="text" value={formData.subtitle} onChange={e => setFormData({...formData, subtitle: e.target.value})} className="w-full border p-2.5 rounded bg-white" placeholder="VD: Trường Thành Phát đồng hành..." />
            </div>
        </div>
        <div className="mb-4">
            <label className="block text-sm font-bold mb-1 text-gray-700">Hình ảnh Banner (Nên chọn ảnh tỷ lệ 16:9, độ nét cao)</label>
            <input required type="file" accept="image/*" onChange={async (e) => {
                if (e.target.files && e.target.files[0]) {
                    const compressed = await compressImageIfNeeded(e.target.files[0]);
                    setFormData({...formData, file: compressed});
                }
            }} className="w-full border p-2 rounded bg-white" />
        </div>
        <button type="submit" className="bg-green-600 text-white font-bold px-8 py-2.5 rounded hover:bg-green-700 transition">Tải Banner Lên</button>
      </form>

      {/* DANH SÁCH BANNER */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {banners.map(banner => (
              <div key={banner._id} className="border border-gray-200 rounded-lg overflow-hidden group relative bg-gray-50">
                  <div className="relative aspect-video">
                      <img src={banner.imageUrl} alt="cover" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-center p-4">
                          <h4 className="text-white font-bold text-lg mb-2">{banner.title}</h4>
                          <p className="text-gray-200 text-sm line-clamp-2">{banner.subtitle}</p>
                      </div>
                  </div>
                  <div className="p-3 bg-white flex justify-end">
                      <button onClick={() => handleDelete(banner._id)} className="bg-red-50 text-red-500 font-bold px-4 py-1.5 rounded text-sm hover:bg-red-100 transition">Xóa Banner</button>
                  </div>
              </div>
          ))}
      </div>
    </div>
  );
};

export default ManageBanner;