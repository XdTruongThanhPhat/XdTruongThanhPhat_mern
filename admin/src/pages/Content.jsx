import React, { useState, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import { compressImageIfNeeded } from '../utils/compressImage';
import SeoScorePanel from '../components/SeoScorePanel';
import ReactQuill, { Quill } from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

// ĐĂNG KÝ SIZE CHỮ THEO SỐ PIXEL (giống ManageBlog)
const Size = Quill.import('attributors/style/size');
Size.whitelist = ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px'];
Quill.register(Size, true);

// Hàm tạo ID ngẫu nhiên cho mỗi section
const generateSectionId = () => Math.random().toString(36).substr(2, 9);

// Hàm tạo section trống
const createEmptySection = () => ({
  id: generateSectionId(),
  heading: '',
  headingType: 'h2',
  paragraph: '',
  caption: '',
  imageUrl: '',
  file: null
});

const Content = () => {
  // Cấu hình ReactQuill cho phần viết bài nội dung dự án
  const quillModules = useMemo(() => ({
    toolbar: [
      [{ 'size': ['12px', '14px', false, '18px', '20px', '24px', '28px', '32px'] }],
      ['bold', 'italic', 'underline'],
      [{ 'align': [] }],
      ['link', 'image', 'video'],
      ['clean']
    ]
  }), []);

  const quillFormats = [
    'size',
    'bold', 'italic', 'underline',
    'align',
    'link', 'image', 'video'
  ];
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  const [selectedProject, setSelectedProject] = useState(null);
  const [sections, setSections] = useState([]);
  const [saving, setSaving] = useState(false);

  // State phục vụ cấu trúc SEO On-page
  const [focusKeyword, setFocusKeyword] = useState('');
  const [lsiKeywords, setLsiKeywords] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');

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
    setFocusKeyword('');
    setLsiKeywords('');
    setSeoTitle('');
    setMetaDescription('');

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/projects/content/${project._id}`);
      const data = await res.json();

      if (data.success && data.content) {
        setFocusKeyword(data.content.focusKeyword || '');
        setLsiKeywords(data.content.lsiKeywords || '');
        setSeoTitle(data.content.seoTitle || '');
        setMetaDescription(data.content.metaDescription || '');

        if (data.content.sections && data.content.sections.length > 0) {
          // Map dữ liệu cũ, thêm 1 cái ID tạm để React dễ render
          const loadedSections = data.content.sections.map(sec => ({
            id: generateSectionId(),
            heading: sec.heading || '',
            headingType: sec.headingType || 'h2',
            paragraph: sec.paragraph || '',
            caption: sec.caption || '',
            imageUrl: sec.imageUrl || '',
            file: null // Để chứa file mới nếu user muốn thay ảnh
          }));
          setSections(loadedSections);
        } else {
          setSections([createEmptySection()]);
        }
      } else {
        // Nếu dự án chưa có bài viết nào, tạo sẵn 1 khối trống
        setSections([createEmptySection()]);
      }
    } catch (error) {
      toast.error("Không thể tải nội dung bài viết cũ");
    }
  };

  // ==============================================================
  // 3. CÁC HÀM XỬ LÝ KHỐI NỘI DUNG (CRUD + Sắp xếp)
  // ==============================================================

  // Thêm khối mới ở CUỐI danh sách
  const handleAddSection = () => {
    setSections(prev => [...prev, createEmptySection()]);
  };

  // Chèn khối mới phía TRÊN 1 khối chỉ định
  const handleInsertAbove = (index) => {
    setSections(prev => {
      const newSections = [...prev];
      newSections.splice(index, 0, createEmptySection());
      return newSections;
    });
  };

  // Chèn khối mới phía DƯỚI 1 khối chỉ định
  const handleInsertBelow = (index) => {
    setSections(prev => {
      const newSections = [...prev];
      newSections.splice(index + 1, 0, createEmptySection());
      return newSections;
    });
  };

  // Di chuyển khối LÊN (đổi vị trí với khối phía trên)
  const handleMoveUp = (index) => {
    if (index === 0) return;
    setSections(prev => {
      const newSections = [...prev];
      [newSections[index - 1], newSections[index]] = [newSections[index], newSections[index - 1]];
      return newSections;
    });
  };

  // Di chuyển khối XUỐNG (đổi vị trí với khối phía dưới)
  const handleMoveDown = (index) => {
    setSections(prev => {
      if (index >= prev.length - 1) return prev;
      const newSections = [...prev];
      [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
      return newSections;
    });
  };

  // Nhân bản 1 khối (copy nội dung, tạo ID mới, chèn ngay dưới)
  const handleDuplicateSection = (index) => {
    setSections(prev => {
      const newSections = [...prev];
      const cloned = { ...prev[index], id: generateSectionId(), file: null };
      newSections.splice(index + 1, 0, cloned);
      return newSections;
    });
  };

  // Xóa 1 khối
  const handleDeleteSection = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa khối nội dung này?")) {
      setSections(prev => prev.filter(s => s.id !== id));
    }
  };

  // Cập nhật 1 field trong 1 khối
  const handleSectionChange = (id, field, value) => {
    setSections(prev => prev.map(sec => sec.id === id ? { ...sec, [field]: value } : sec));
  };

  // ĐÃ FIX BUG: Xóa ảnh — cập nhật cả 2 field (file + imageUrl) trong 1 lần setState
  // để tránh lỗi React state batching (gọi 2 lần handleSectionChange liên tiếp bị stale state)
  const handleRemoveImage = (id) => {
    setSections(prev => prev.map(sec =>
      sec.id === id ? { ...sec, file: null, imageUrl: '', caption: '' } : sec
    ));
  };

  // 4. LƯU BÀI VIẾT LÊN BACKEND
  const handleSaveContent = async () => {
    setSaving(true);
    try {
      const formData = new FormData();

      // Chuẩn bị dữ liệu JSON cho Backend
      // Clean ký tự vô hình từ Quill (giống ManageBlog) để tránh ngắt từ sai
      const cleanParagraph = (html) => {
        if (!html) return '';
        return html
          .replace(/&nbsp;/g, ' ')
          .replace(/\u00a0/g, ' ')
          .replace(/[\u200b\u200c\u200d\ufeff]/g, '')
          .replace(/&shy;|\u00ad/g, '');
      };
      const sectionsData = sections.map(sec => ({
        heading: sec.heading,
        headingType: sec.headingType || 'h2',
        paragraph: cleanParagraph(sec.paragraph),
        caption: sec.caption,
        imageUrl: sec.imageUrl, // Nếu không có file mới, backend sẽ lấy link cũ này
        hasImage: !!sec.file // Cờ báo cho Backend biết có file ảnh mới đính kèm
      }));
      formData.append('sections', JSON.stringify(sectionsData));

      // Đính kèm các thông tin SEO
      formData.append('focusKeyword', focusKeyword);
      formData.append('lsiKeywords', lsiKeywords);
      formData.append('seoTitle', seoTitle);
      formData.append('metaDescription', metaDescription);

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
      <>
        <style dangerouslySetInnerHTML={{
          __html: `
        .content-quill-editor .ql-editor {
          min-height: 120px;
          font-size: 1rem;
          line-height: 1.7;
          color: #374151;
        }
        .content-quill-editor .ql-editor p {
          margin-bottom: 0.5rem;
        }
        .content-quill-editor .ql-editor a {
          color: #16a34a;
          text-decoration: underline;
        }
        .content-quill-editor .ql-toolbar.ql-snow {
          border-radius: 0.375rem 0.375rem 0 0;
          border-color: #d1d5db;
          background: #f9fafb;
        }
        .content-quill-editor .ql-container.ql-snow {
          border-radius: 0 0 0.375rem 0.375rem;
          border-color: #d1d5db;
        }
        .content-quill-editor .ql-editor:focus {
          outline: none;
        }
        .content-quill-editor .ql-container.ql-snow:focus-within {
          border-color: #22c55e;
        }
        `
        }} />
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

          {/* PHẦN CẤU HÌNH SEO ON-PAGE */}
          <div className="bg-green-50/30 p-5 rounded-lg border border-green-100 mb-6 space-y-4">
            <h3 className="font-bold text-green-800 text-base border-b border-green-100 pb-2 flex items-center gap-2">
              <span className="text-xl">🌐</span> Cấu hình SEO On-page cho bài viết
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Tiêu đề SEO (Title Tag - &lt; 65 ký tự)</label>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={e => setSeoTitle(e.target.value.substring(0, 100))}
                  placeholder="VD: Thiết kế biệt thự 3 tầng hiện đại Đà Nẵng"
                  className="w-full border border-gray-300 rounded p-2 focus:border-green-500 outline-none bg-white text-sm"
                />
                <span className={`text-xs block mt-1 text-right ${seoTitle.length > 65 ? 'text-red-500 font-medium' : 'text-gray-400'}`}>
                  {seoTitle.length}/65 ký tự
                </span>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Mô tả SEO (Meta Description - &lt; 160 ký tự)</label>
                <textarea
                  rows="2"
                  value={metaDescription}
                  onChange={e => setMetaDescription(e.target.value.substring(0, 200))}
                  placeholder="Mô tả ngắn gọn hiển thị trên kết quả tìm kiếm Google..."
                  className="w-full border border-gray-300 rounded p-2 focus:border-green-500 outline-none bg-white text-sm resize-none"
                />
                <span className={`text-xs block mt-1 text-right ${metaDescription.length > 160 ? 'text-red-500 font-medium' : 'text-gray-400'}`}>
                  {metaDescription.length}/160 ký tự
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Từ khóa chính (Target Keyword)</label>
                <input
                  type="text"
                  value={focusKeyword}
                  onChange={e => setFocusKeyword(e.target.value)}
                  placeholder="VD: thiết kế biệt thự 3 tầng"
                  className="w-full border border-gray-300 rounded p-2 focus:border-green-500 outline-none bg-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Từ khóa phụ (LSI Keywords - cách nhau bằng dấu phẩy)</label>
                <input
                  type="text"
                  value={lsiKeywords}
                  onChange={e => setLsiKeywords(e.target.value)}
                  placeholder="VD: biệt thự đẹp, xây biệt thự trọn gói, thiết kế nội thất"
                  className="w-full border border-gray-300 rounded p-2 focus:border-green-500 outline-none bg-white text-sm"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {sections.map((sec, index) => (
              <div key={sec.id}>
                {/* ═══ NÚT CHÈN PHÍA TRÊN ═══ */}
                <div className="flex justify-center py-1">
                  <button
                    onClick={() => handleInsertAbove(index)}
                    className="group flex items-center gap-1.5 text-[11px] text-gray-400 hover:text-green-600 font-medium transition px-3 py-1 rounded-full hover:bg-green-50 border border-transparent hover:border-green-200"
                    title="Chèn đoạn mới phía trên"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                    Chèn phía trên
                  </button>
                </div>

                {/* ═══ KHỐI NỘI DUNG ═══ */}
                <div className="p-5 border border-gray-200 rounded-lg bg-gray-50/50 relative group transition hover:border-green-300">

                  {/* ─── THANH CÔNG CỤ (hiện khi hover) ─── */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                    {/* Di chuyển lên */}
                    <button
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                      className="p-1.5 rounded hover:bg-gray-200 text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition"
                      title="Di chuyển lên"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" /></svg>
                    </button>

                    {/* Di chuyển xuống */}
                    <button
                      onClick={() => handleMoveDown(index)}
                      disabled={index === sections.length - 1}
                      className="p-1.5 rounded hover:bg-gray-200 text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition"
                      title="Di chuyển xuống"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </button>

                    {/* Đường ngăn cách */}
                    <div className="w-px h-5 bg-gray-300 mx-0.5"></div>

                    {/* Nhân bản */}
                    <button
                      onClick={() => handleDuplicateSection(index)}
                      className="p-1.5 rounded hover:bg-blue-100 text-gray-500 hover:text-blue-600 transition"
                      title="Nhân bản đoạn này"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                    </button>

                    {/* Xóa khối */}
                    <button
                      onClick={() => handleDeleteSection(sec.id)}
                      className="p-1.5 rounded hover:bg-red-100 text-gray-500 hover:text-red-600 transition"
                      title="Xóa đoạn này"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>

                  <h4 className="font-bold text-green-700 mb-4 uppercase tracking-wider text-sm">Đoạn nội dung #{index + 1}</h4>

                  <div className="space-y-4">
                    {/* Heading & Paragraph */}
                    <div>
                      <div className="flex justify-between items-center mt-1.5">
                        <label className="text-xs font-semibold text-gray-500 uppercase">Tiêu đề đoạn (Không bắt buộc)</label>
                        <div className="flex items-center gap-1">
                          <span className="text-[11px] text-gray-400 font-semibold uppercase">Heading:</span>
                          <select
                            value={sec.headingType || 'h2'}
                            onChange={e => handleSectionChange(sec.id, 'headingType', e.target.value)}
                            className="text-xs border border-gray-300 rounded px-1.5 py-0.5 bg-white focus:border-green-500 outline-none font-bold text-green-700 cursor-pointer"
                          >
                            <option value="h1">H1 (Tiêu đề 1)</option>
                            <option value="h2">H2 (Tiêu đề 2)</option>
                            <option value="h3">H3 (Tiêu đề 3)</option>
                            <option value="h4">H4 (Tiêu đề 4)</option>
                          </select>
                        </div>
                      </div>
                      <input type="text" value={sec.heading} onChange={e => handleSectionChange(sec.id, 'heading', e.target.value)} placeholder="VD: Yêu cầu thiết kế từ gia chủ..." className="w-full border border-gray-300 rounded p-2 focus:border-green-500 outline-none mt-1 font-semibold text-gray-800 bg-white" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase">Nội dung văn bản</label>
                      <div className="content-quill-editor mt-1">
                        <ReactQuill
                          theme="snow"
                          value={sec.paragraph || ''}
                          onChange={(val) => handleSectionChange(sec.id, 'paragraph', val)}
                          modules={quillModules}
                          formats={quillFormats}
                          placeholder="Nhập nội dung chi tiết..."
                        />
                      </div>
                    </div>

                    {/* Xử lý Hình Ảnh Nội Dung */}
                    <div className="bg-white p-4 rounded border border-gray-200">
                      <label className="text-xs font-semibold text-gray-500 uppercase block mb-2">Chèn 1 ảnh minh họa (Tùy chọn)</label>

                      {/* Hiển thị ảnh đang có (ảnh cũ hoặc ảnh mới chọn) */}
                      {(sec.file || sec.imageUrl) && (
                        <div className="mb-3 relative inline-block">
                          <img src={sec.file ? URL.createObjectURL(sec.file) : sec.imageUrl} alt="preview" className="h-32 w-auto object-cover rounded border border-gray-300" />
                          {/* ĐÃ FIX BUG: Dùng handleRemoveImage thay vì gọi 2 lần handleSectionChange */}
                          <button
                            onClick={() => handleRemoveImage(sec.id)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm shadow hover:bg-red-600 transition"
                            title="Xóa ảnh"
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
                          onChange={async (e) => {
                            if (e.target.files && e.target.files[0]) {
                              const compressed = await compressImageIfNeeded(e.target.files[0]);
                              handleSectionChange(sec.id, 'file', compressed);
                            }
                          }}
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

                {/* ═══ NÚT CHÈN PHÍA DƯỚI (chỉ hiện ở khối cuối cùng) ═══ */}
                {index === sections.length - 1 && (
                  <div className="flex justify-center py-1">
                    <button
                      onClick={() => handleInsertBelow(index)}
                      className="group flex items-center gap-1.5 text-[11px] text-gray-400 hover:text-green-600 font-medium transition px-3 py-1 rounded-full hover:bg-green-50 border border-transparent hover:border-green-200"
                      title="Chèn đoạn mới phía dưới"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                      Chèn phía dưới
                    </button>
                  </div>
                )}
              </div>
            ))}

            {/* Nút Thêm Khối */}
            <button
              onClick={handleAddSection}
              className="w-full border-2 border-dashed border-green-400 bg-green-50 text-green-700 py-4 rounded-lg hover:bg-green-100 hover:border-green-500 transition font-bold tracking-wide"
            >
              + THÊM ĐOẠN NỘI DUNG MỚI
            </button>

            {/* SEO SCORE PANEL cho Dự án */}
            <div className="mt-6">
              <SeoScorePanel
                title={seoTitle || selectedProject?.title || ''}
                content={sections.map(s => `${s.heading ? `<${s.headingType || 'h2'}>${s.heading}</${s.headingType || 'h2'}>` : ''}${s.paragraph || ''}`).join('')}
                focusKeyword={focusKeyword}
                metaDescription={metaDescription}
                hasImage={sections.some(s => s.file || s.imageUrl)}
                type="project"
              />
            </div>
          </div>
        </div>
      </>
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