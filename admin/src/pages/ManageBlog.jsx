import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const ManageBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [formData, setFormData] = useState({ title: '', category: 'Kinh nghiệm xây nhà', content: '', file: null });

  const fetchBlogs = async () => {
    const res = await fetch('http://localhost:5000/api/blogs');
    const data = await res.json();
    if(data.success) setBlogs(data.blogs);
  };
  
  useEffect(() => { fetchBlogs(); }, []);

  // Hàm xử lý Bật/Tắt bài viết nổi bật
  const handleToggleFeature = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/blogs/${id}/feature`, { method: 'PATCH' });
      const data = await res.json();
      
      if(data.success) {
        fetchBlogs(); // Load lại toàn bộ danh sách để cập nhật màu của Ngôi Sao
        toast.success("Đã cập nhật bài nổi bật!");
      }
    } catch (error) {
      toast.error("Lỗi khi cập nhật");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.file) return toast.error("Vui lòng chọn ảnh bìa!");
    const toastId = toast.loading("Đang đăng bài...");
    
    const data = new FormData();
    data.append('title', formData.title);
    data.append('category', formData.category);
    data.append('content', formData.content);
    data.append('image', formData.file);

    try {
      const res = await fetch('http://localhost:5000/api/blogs', { method: 'POST', body: data });
      const result = await res.json();
      if (result.success) {
        toast.success("Đăng bài thành công!", { id: toastId });
        setFormData({ title: '', category: 'Kinh nghiệm xây nhà', content: '', file: null });
        fetchBlogs();
      }
    } catch (error) { toast.error("Lỗi đăng bài", { id: toastId }); }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Xóa bài viết này?")) return;
    await fetch(`http://localhost:5000/api/blogs/${id}`, { method: 'DELETE' });
    setBlogs(blogs.filter(b => b._id !== id));
    toast.success("Đã xóa!");
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border max-w-6xl">
      <h2 className="text-2xl font-bold mb-6">Quản lý Tin Tức & Kiến Thức (SEO)</h2>
      
      {/* Form Đăng Bài */}
      <form onSubmit={handleSubmit} className="mb-10 bg-gray-50 p-6 rounded-lg border border-gray-200">
        <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
                <label className="block text-sm font-bold mb-1">Tiêu đề bài viết</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border p-2 rounded" />
            </div>
            <div>
                <label className="block text-sm font-bold mb-1">Danh mục</label>
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full border p-2 rounded">
                    <option value="Kinh nghiệm xây nhà">Kinh nghiệm xây nhà</option>
                    <option value="Phong thủy nhà ở">Phong thủy nhà ở</option>
                    <option value="Xu hướng thiết kế">Xu hướng thiết kế</option>
                </select>
            </div>
        </div>
        <div className="mb-4">
            <label className="block text-sm font-bold mb-1">Ảnh bìa bài viết</label>
            <input required type="file" accept="image/*" onChange={e => setFormData({...formData, file: e.target.files[0]})} className="w-full border p-1.5 rounded bg-white" />
        </div>
        <div className="mb-4">
            <label className="block text-sm font-bold mb-1">Nội dung chi tiết</label>
            <textarea required rows="6" value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full border p-2 rounded" placeholder="Viết nội dung tại đây..."></textarea>
        </div>
        <button type="submit" className="bg-green-600 text-white font-bold px-8 py-2 rounded hover:bg-green-700">Xuất Bản Bài Viết</button>
      </form>

      {/* Danh sách bài đã đăng */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogs.map(blog => (
              // QUAN TRỌNG: Đã thêm class 'relative' vào đây để Ngôi Sao không bị chạy ra ngoài
              <div key={blog._id} className={`border rounded-lg overflow-hidden group relative transition-all ${blog.isFeatured ? 'border-yellow-400 shadow-md bg-yellow-50/30' : 'border-gray-200'}`}>
                  
                  {/* NÚT NGÔI SAO */}
                  <button 
                    onClick={() => handleToggleFeature(blog._id)}
                    className={`absolute top-2 right-2 z-10 text-xl transition-transform hover:scale-125 bg-black/50 backdrop-blur-sm rounded-full w-8 h-8 flex items-center justify-center ${blog.isFeatured ? 'text-yellow-400' : 'text-white hover:text-yellow-200'}`}
                    title="Đánh dấu Nổi Bật (Chỉ 1 bài duy nhất)"
                  >
                    ★
                  </button>

                  <img src={blog.imageUrl} alt="cover" className="w-full h-40 object-cover" />
                  <div className="p-4">
                      <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">{blog.category}</span>
                      <h3 className="font-bold text-lg mt-2 mb-2 line-clamp-2">{blog.title}</h3>
                      <button onClick={() => handleDelete(blog._id)} className="text-sm text-red-500 hover:underline font-medium">Xóa bài viết</button>
                  </div>
              </div>
          ))}
      </div>
    </div>
  );
};
export default ManageBlog;