import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const Content = () => {
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  
  const [selectedProject, setSelectedProject] = useState(null);
  const [sections, setSections] = useState([]);
  const [saving, setSaving] = useState(false);

  // 1. TẢI DANH SÁCH DỰ ÁN TỪ MONGODB
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/projects/list`);
        const data = await res.json();
        if (data.success) {
          setProjects(data.projects);
        }
      } catch (error) {
        toast.error("Lỗi khi tải danh sách dự án");
      } finally {
        setLoadingProjects(false);
      }
    };
    fetchProjects();
  }, []);

  // 2. KHI CHỌN 1 DỰ ÁN -> TẢI NỘI DUNG CŨ CỦA NÓ LÊN (NẾU CÓ)
  const handleSelectProject = async (project) => {
    setSelectedProject(project);
    setSections([]); // Reset giao diện
    
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/projects/content/${project._id}`);
      const data = await res.json();
      
      if (data.success && data.content && data.content.sections) {
        // Map dữ liệu cũ, thêm 1 cái ID tạm để React dễ render
        const loadedSections = data.content.sections.map(sec => ({
          id: Math.random().toString(36).substr(2, 9),
          heading: sec.heading || '',
          paragraph: sec.paragraph || '',
          caption: sec.caption || '',
          imageUrl: sec.imageUrl || '',
          file: null // Để chứa file mới nếu user muốn thay ảnh
        }));
        setSections(loadedSections);
      } else {
        // Nếu dự án chưa có bài viết nào, tạo sẵn 1 khối trống
        setSections([{ id: Math.random().toString(36).substr(2, 9), heading: '', paragraph: '', caption: '', imageUrl: '', file: null }]);
      }
    } catch (error) {
      toast.error("Không thể tải nội dung bài viết cũ");
    }
  };

  // 3. CÁC HÀM XỬ LÝ KHỐI NỘI DUNG
  const handleAddSection = () => {
    setSections([...sections, { id: Math.random().toString(36).substr(2, 9), heading: '', paragraph: '', caption: '', imageUrl: '', file: null }]);
  };

  const handleDeleteSection = (id) => {
    if(window.confirm("Bạn có chắc muốn xóa khối nội dung này?")) {
        setSections(sections.filter(s => s.id !== id));
    }
  };

  const handleSectionChange = (id, field, value) => {
    setSections(sections.map(sec => sec.id === id ? { ...sec, [field]: value } : sec));
  };

  // 4. LƯU BÀI VIẾT LÊN BACKEND
  const handleSaveContent = async () => {
    setSaving(true);
    try {
      const formData = new FormData();

      // Chuẩn bị dữ liệu JSON cho Backend
      const sectionsData = sections.map(sec => ({
        heading: sec.heading,
        paragraph: sec.paragraph,
        caption: sec.caption,
        imageUrl: sec.imageUrl, // Nếu không có file mới, backend sẽ lấy link cũ này
        hasImage: !!sec.file // Cờ báo cho Backend biết có file ảnh mới đính kèm
      }));
      formData.append('sections', JSON.stringify(sectionsData));

      // Nhét các file ảnh mới vào FormData (theo đúng tên 'contentImages' backend yêu cầu)
      sections.forEach(sec => {
        if (sec.file) {
          formData.append('contentImages', sec.file);
        }
      });

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/projects/content/${selectedProject._id}`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();

      if (data.success) {
        toast.success("Lưu nội dung bài viết thành công!");
        setSelectedProject(null); // Quay lại trang danh sách
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Lỗi khi lưu bài viết");
    } finally {
      setSaving(false);
    }
  };


  // ================= GIAO DIỆN CHỈNH SỬA BÀI VIẾT =================
  if (selectedProject) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-4xl">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <div>
            <button onClick={() => setSelectedProject(null)} className="text-gray-500 hover:text-green-600 text-sm font-medium mb-2 transition">
              ← Quay lại danh sách
            </button>
            <h2 className="text-2xl font-bold text-gray-800">
              Viết bài cho: <span className="text-green-600">{selectedProject.title}</span>
            </h2>
          </div>
          <button 
            onClick={handleSaveContent} 
            disabled={saving}
            className="bg-green-600 text-white px-8 py-2.5 rounded-lg hover:bg-green-700 font-medium disabled:opacity-50 transition shadow-md"
          >
            {saving ? 'Đang lưu...' : 'Lưu Xuất Bản'}
          </button>
        </div>

        <div className="space-y-6">
          {sections.map((sec, index) => (
            <div key={sec.id} className="p-5 border border-gray-200 rounded-lg bg-gray-50/50 relative group transition hover:border-green-300">
              <button 
                onClick={() => handleDeleteSection(sec.id)} 
                className="absolute top-4 right-4 bg-red-100 text-red-600 px-3 py-1 rounded-md text-xs font-bold opacity-0 group-hover:opacity-100 transition"
              >
                Xóa khối
              </button>
              
              <h4 className="font-bold text-green-700 mb-4 uppercase tracking-wider text-sm">Đoạn nội dung #{index + 1}</h4>
              
              <div className="space-y-4">
                {/* Heading & Paragraph */}
                <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase">Tiêu đề đoạn (Không bắt buộc)</label>
                    <input type="text" value={sec.heading} onChange={e => handleSectionChange(sec.id, 'heading', e.target.value)} placeholder="VD: Yêu cầu thiết kế từ gia chủ..." className="w-full border border-gray-300 rounded p-2 focus:border-green-500 outline-none mt-1 font-semibold text-gray-800 bg-white" />
                </div>
                <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase">Nội dung văn bản</label>
                    <textarea rows="4" value={sec.paragraph} onChange={e => handleSectionChange(sec.id, 'paragraph', e.target.value)} placeholder="Nhập nội dung chi tiết..." className="w-full border border-gray-300 rounded p-2 focus:border-green-500 outline-none mt-1 bg-white"></textarea>
                </div>

                {/* Xử lý Hình Ảnh Nội Dung */}
                <div className="bg-white p-4 rounded border border-gray-200">
                    <label className="text-xs font-semibold text-gray-500 uppercase block mb-2">Chèn 1 ảnh minh họa (Tùy chọn)</label>
                    
                    {/* Hiển thị ảnh đang có (ảnh cũ hoặc ảnh mới chọn) */}
                    {(sec.file || sec.imageUrl) && (
                        <div className="mb-3 relative inline-block">
                            <img src={sec.file ? URL.createObjectURL(sec.file) : sec.imageUrl} alt="preview" className="h-32 w-auto object-cover rounded border border-gray-300" />
                            <button 
                                onClick={() => { handleSectionChange(sec.id, 'file', null); handleSectionChange(sec.id, 'imageUrl', ''); }}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm shadow"
                            >
                                ×
                            </button>
                        </div>
                    )}

                    {/* Nút chọn ảnh */}
                    {!(sec.file || sec.imageUrl) && (
                        <input 
                            type="file" 
                            accept="image/*"
                            onChange={e => handleSectionChange(sec.id, 'file', e.target.files[0])} 
                            className="text-sm file:mr-4 file:py-1.5 file:px-4 file:rounded file:border-0 file:bg-green-100 file:text-green-700 hover:file:bg-green-200 cursor-pointer w-full" 
                        />
                    )}

                    {/* Chỉ hiện ô nhập Caption nếu khối này có ảnh */}
                    {(sec.file || sec.imageUrl) && (
                        <input type="text" value={sec.caption} onChange={e => handleSectionChange(sec.id, 'caption', e.target.value)} placeholder="Ghi chú dưới ảnh (Caption)" className="w-full border border-gray-300 rounded p-2 focus:border-green-500 outline-none mt-3 text-sm text-gray-600 italic bg-gray-50" />
                    )}
                </div>

              </div>
            </div>
          ))}

          {/* Nút Thêm Khối */}
          <button 
            onClick={handleAddSection} 
            className="w-full border-2 border-dashed border-green-400 bg-green-50 text-green-700 py-4 rounded-lg hover:bg-green-100 hover:border-green-500 transition font-bold tracking-wide"
          >
            + THÊM ĐOẠN NỘI DUNG MỚI
          </button>
        </div>
      </div>
    );
  }

  // ================= GIAO DIỆN DANH SÁCH DỰ ÁN =================
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Nội dung dự án</h2>
        <p className="text-gray-500 text-sm mt-1">Chọn một dự án để Thêm/Sửa/Xóa bài viết chi tiết</p>
      </div>

      {loadingProjects ? (
          <div className="py-10 text-center text-gray-500">Đang tải danh sách dự án...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 font-semibold text-gray-700 w-20">Hình ảnh</th>
                <th className="p-4 font-semibold text-gray-700">Tên dự án</th>
                <th className="p-4 font-semibold text-gray-700">Loại hình</th>
                <th className="p-4 font-semibold text-gray-700 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {projects.length === 0 ? (
                <tr><td colSpan="4" className="p-8 text-center text-gray-500">Chưa có dự án nào</td></tr>
              ) : (
                projects.map((proj) => (
                  <tr key={proj._id} className="hover:bg-green-50/50 transition">
                    <td className="p-3">
                        <img src={proj.mainImage} alt="cover" className="w-16 h-10 object-cover rounded border border-gray-200" />
                    </td>
                    <td className="p-4 text-gray-800 font-medium">{proj.title}</td>
                    <td className="p-4 text-gray-600 text-sm">{proj.category}</td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => handleSelectProject(proj)}
                        className="text-green-700 hover:text-white text-sm font-bold bg-green-100 hover:bg-green-600 px-4 py-2 rounded-lg transition"
                      >
                        Viết nội dung ➝
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Content;