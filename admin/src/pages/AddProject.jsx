import React, { useState } from 'react';
import toast from 'react-hot-toast';

const AddProject = () => {
  const [loading, setLoading] = useState(false);
  
  // SỬA LỖI 1: Khởi tạo giá trị mặc định khớp với lựa chọn đầu tiên trong thẻ select
  const [formData, setFormData] = useState({
    title: '', category: 'Nội thất', location: '', floors: '', landArea: '', buildArea: '', cost: ''
  });
  
  const [images, setImages] = useState([]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
    e.target.value = null; 
  };

  const removeImage = (indexToRemove) => {
    setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0) return toast.error("Vui lòng chọn ít nhất 1 hình ảnh!");
    
    setLoading(true);
    try {
        const data = new FormData();
        data.append('title', formData.title);
        data.append('category', formData.category);
        data.append('info', JSON.stringify({
            location: formData.location, floors: formData.floors, landArea: formData.landArea, buildArea: formData.buildArea, cost: formData.cost
        }));

        data.append('mainImage', images[0]);
        
        if (images.length > 1) {
            for (let i = 1; i < images.length; i++) {
                data.append('projectImages', images[i]);
            }
        }

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/projects/add`, {
            method: 'POST',
            body: data
        });
        const result = await response.json();

        if (result.success) {
            toast.success("Thêm dự án thành công!");
            // SỬA LỖI 2: Khi reset form sau khi gửi thành công, cũng phải set về 'Nội thất'
            setFormData({ title: '', category: 'Nội thất', location: '', floors: '', landArea: '', buildArea: '', cost: '' });
            setImages([]);
        } else {
            toast.error(result.message);
        }
    } catch (error) {
        toast.error("Lỗi kết nối Server");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-5xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Thêm Dự Án Mới</h2>
        <p className="text-gray-500 text-sm mt-1">Ảnh đầu tiên bạn chọn sẽ tự động được làm ảnh bìa.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên công trình</label>
              <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-green-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Loại hình</label>
              {/* SỬA LỖI 3: Cập nhật đúng 5 danh mục mà bạn mong muốn */}
              <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-green-500">
                <option value="Nội thất">Nội thất</option>
                <option value="Biệt thự">Biệt thự</option>
                <option value="Căn hộ">Căn hộ</option>
                <option value="Nhà phố">Nhà phố</option>
                <option value="Công trình thực tế">Công trình thực tế</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Vị trí</label><input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-green-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Chi phí XD</label><input type="text" value={formData.cost} onChange={e => setFormData({...formData, cost: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-green-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Số tầng</label><input type="text" value={formData.floors} onChange={e => setFormData({...formData, floors: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-green-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Diện tích xây dựng</label><input type="text" value={formData.buildArea} onChange={e => setFormData({...formData, buildArea: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-green-500" /></div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">Hình ảnh công trình ({images.length})</label>
          
          <label className="flex items-center justify-center w-full h-10 border-2 border-dashed border-green-400 rounded-lg cursor-pointer hover:bg-green-100 transition-colors mb-4 bg-green-50 text-green-600 font-medium text-sm">
            + Chọn thêm ảnh
            <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
          </label>
          
          {images.length > 0 && (
            <div className="mt-4 space-y-2 max-h-[400px] overflow-y-auto pr-2">
                <p className="text-xs font-bold text-green-600">★ Ảnh bìa (Main):</p>
                <div className="relative group">
                    <img src={URL.createObjectURL(images[0])} alt="Cover" className="w-full h-32 object-cover rounded-lg border-2 border-green-500 shadow-sm" />
                    <button 
                      type="button" 
                      onClick={() => removeImage(0)} 
                      className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                    >
                      ×
                    </button>
                </div>
                
                {images.length > 1 && (
                    <>
                        <p className="text-xs font-bold text-gray-600 mt-3">Các ảnh nội dung ({images.length - 1}):</p>
                        <div className="grid grid-cols-3 gap-2">
                            {images.slice(1).map((img, idx) => {
                                const realIndex = idx + 1; 
                                return (
                                  <div key={realIndex} className="relative group">
                                      <img src={URL.createObjectURL(img)} alt="Gallery" className="w-full h-16 object-cover rounded border border-gray-300" />
                                      <button 
                                        type="button" 
                                        onClick={() => removeImage(realIndex)} 
                                        className="absolute -top-1.5 -right-1.5 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                                      >
                                        ×
                                      </button>
                                  </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
          )}
        </div>

        <div className="lg:col-span-3">
            <button type="submit" disabled={loading} className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 font-medium disabled:opacity-50 w-full md:w-auto">
            {loading ? 'Đang tải lên...' : 'Lưu dự án'}
            </button>
        </div>
      </form>
    </div>
  );
};

export default AddProject;