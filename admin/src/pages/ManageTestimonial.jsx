import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { compressImageIfNeeded } from '../utils/compressImage';

const ManageTestimonial = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', content: '', file: null, existingAvatar: '' });

  // 1. Fetch Dữ liệu
  const fetchTestimonials = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/testimonials`);
      const data = await res.json();
      if (data.success) setTestimonials(data.testimonials);
    } catch (error) {
      toast.error("Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { fetchTestimonials(); }, []);

  // 2. Submit Thêm / Sửa
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEditing && !formData.file) return toast.error("Vui lòng chọn ảnh khách hàng!");
    const toastId = toast.loading(isEditing ? "Đang cập nhật..." : "Đang thêm phản hồi...");
    
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('content', formData.content);
      if (formData.file) data.append('avatar', formData.file);
      if (isEditing) data.append('existingAvatar', formData.existingAvatar);

      const url = isEditing ? `${import.meta.env.VITE_API_URL}/api/testimonials/${editingId}` : `${import.meta.env.VITE_API_URL}/api/testimonials`;
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, { method, body: data });
      const result = await res.json();

      if (result.success) {
          toast.success(result.message, { id: toastId });
          setFormData({ name: '', content: '', file: null, existingAvatar: '' });
          setIsEditing(false);
          setEditingId(null);
          fetchTestimonials();
      } else {
          toast.error(result.message, { id: toastId });
      }
    } catch (error) { toast.error("Lỗi hệ thống", { id: toastId }); }
  };

  // 3. Chuẩn bị dữ liệu Sửa
  const handleEdit = (item) => {
    setIsEditing(true);
    setEditingId(item._id);
    setFormData({ name: item.name, content: item.content, existingAvatar: item.avatar, file: null });
  };

  // 4. Xóa
  const handleDelete = async (id) => {
    if(!window.confirm("Xóa phản hồi này?")) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/testimonials/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if(data.success) {
          toast.success("Xóa thành công");
          setTestimonials(testimonials.filter(t => t._id !== id));
      }
    } catch (error) { toast.error("Lỗi khi xóa"); }
  };

  if (loading) return <div className="p-6">Đang tải dữ liệu...</div>;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Quản lý Phản hồi Khách hàng</h2>

        {/* Bảng Form Thêm/Sửa */}
        <form onSubmit={handleSubmit} className="mb-8 bg-green-50/50 p-6 rounded-xl border border-green-100">
            <h3 className="font-bold text-green-700 mb-4">{isEditing ? "Cập nhật phản hồi" : "Thêm phản hồi mới"}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Tên khách hàng</label>
                    <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border p-2.5 rounded-lg outline-none focus:border-green-500 bg-white" placeholder="VD: Mr Thành - Đồng Nai" />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Hình ảnh (Avatar)</label>
                    <input type="file" accept="image/*" onChange={async (e) => {
                        if (e.target.files && e.target.files[0]) {
                            const compressed = await compressImageIfNeeded(e.target.files[0]);
                            setFormData({...formData, file: compressed});
                        }
                    }} className="w-full border p-1.5 rounded-lg bg-white" />
                    {isEditing && formData.existingAvatar && !formData.file && (
                        <p className="text-xs text-gray-500 mt-1">Đang dùng ảnh cũ. Chọn file mới để thay đổi.</p>
                    )}
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-1">Nội dung phản hồi</label>
                    <textarea required rows="3" value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full border p-2.5 rounded-lg outline-none focus:border-green-500 bg-white" placeholder="Khách hàng nói gì..."></textarea>
                </div>
            </div>
            <div className="mt-4 flex gap-3">
                <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700">{isEditing ? "Lưu Cập Nhật" : "Thêm Phản Hồi"}</button>
                {isEditing && <button type="button" onClick={() => { setIsEditing(false); setFormData({name: '', content: '', file: null, existingAvatar: ''})}} className="bg-gray-400 text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-500">Hủy</button>}
            </div>
        </form>

        {/* Danh sách Phản hồi */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map(item => (
                <div key={item._id} className="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <img src={item.avatar} alt="avatar" className="w-12 h-12 rounded-full object-cover border" />
                            <h4 className="font-bold text-gray-800 text-sm">{item.name}</h4>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-4 italic mb-4">"{item.content}"</p>
                    </div>
                    <div className="flex gap-2 border-t pt-3">
                        <button onClick={() => handleEdit(item)} className="bg-blue-50 text-blue-600 text-xs font-bold px-4 py-1.5 rounded hover:bg-blue-100">Sửa</button>
                        <button onClick={() => handleDelete(item._id)} className="bg-red-50 text-red-600 text-xs font-bold px-4 py-1.5 rounded hover:bg-red-100">Xóa</button>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};

export default ManageTestimonial;