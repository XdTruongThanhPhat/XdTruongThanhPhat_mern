import React, { useState, useEffect, useMemo, useRef } from 'react';
import toast from 'react-hot-toast';
import ReactQuill, { Quill } from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

// ĐĂNG KÝ SIZE CHỮ THEO SỐ PIXEL
const Size = Quill.import('attributors/style/size');
Size.whitelist = ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px'];
Quill.register(Size, true);

// ===================================================
// CUSTOM IMAGE BLOT: Hỗ trợ căn lề trái/giữa/phải
// ===================================================
const BlockEmbed = Quill.import('blots/block/embed');

class ImageBlot extends BlockEmbed {
  static blotName = 'image';
  static tagName = 'div';
  static className = 'ql-image-wrapper';

  static create(value) {
    const node = super.create();

    // value có thể là string (URL) hoặc object { url, align }
    const url = typeof value === 'string' ? value : value.url;
    const align = typeof value === 'string' ? 'center' : (value.align || 'center');

    const img = document.createElement('img');
    img.setAttribute('src', url);
    img.setAttribute('alt', 'blog-image');
    node.appendChild(img);

    // Áp dụng alignment
    ImageBlot.applyAlignment(node, align);
    node.setAttribute('data-align', align);

    return node;
  }

  static applyAlignment(node, align) {
    // Reset styles
    node.style.textAlign = '';
    node.style.display = 'block';
    node.style.clear = 'both';

    const img = node.querySelector('img');
    if (img) {
      img.style.float = '';
      img.style.marginLeft = '';
      img.style.marginRight = '';
      img.style.display = '';
    }

    switch (align) {
      case 'left':
        node.style.textAlign = 'left';
        if (img) {
          img.style.display = 'block';
          img.style.marginLeft = '0';
          img.style.marginRight = 'auto';
        }
        break;
      case 'right':
        node.style.textAlign = 'right';
        if (img) {
          img.style.display = 'block';
          img.style.marginLeft = 'auto';
          img.style.marginRight = '0';
        }
        break;
      case 'center':
      default:
        node.style.textAlign = 'center';
        if (img) {
          img.style.display = 'block';
          img.style.marginLeft = 'auto';
          img.style.marginRight = 'auto';
        }
        break;
    }
  }

  static value(node) {
    const img = node.querySelector('img');
    return {
      url: img ? img.getAttribute('src') : '',
      align: node.getAttribute('data-align') || 'center'
    };
  }

  static formats(node) {
    return {
      align: node.getAttribute('data-align') || 'center'
    };
  }

  format(name, value) {
    if (name === 'align') {
      ImageBlot.applyAlignment(this.domNode, value || 'center');
      this.domNode.setAttribute('data-align', value || 'center');
    } else {
      super.format(name, value);
    }
  }
}

Quill.register(ImageBlot, true);

const ManageBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [formData, setFormData] = useState({ title: '', category: 'Kinh nghiệm xây nhà', content: '', file: null });
  const [editingId, setEditingId] = useState(null);
  const quillRef = useRef(null);

  const fetchBlogs = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/blogs`);
    const data = await res.json();
    if(data.success) setBlogs(data.blogs);
  };
  
  useEffect(() => { fetchBlogs(); }, []);

  // ===================================================
  // CLICK VÀO ẢNH → HIỆN TOOLBAR CĂN LỀ
  // ===================================================
  useEffect(() => {
    const quillEditor = quillRef.current;
    if (!quillEditor) return;

    const editor = quillEditor.getEditor();
    const editorRoot = editor.root;

    const handleImageClick = (e) => {
      const img = e.target.closest('img');
      if (!img) {
        // Click ra ngoài → xóa toolbar cũ
        const existingToolbar = editorRoot.querySelector('.image-align-toolbar');
        if (existingToolbar) existingToolbar.remove();
        editorRoot.querySelectorAll('.ql-image-wrapper.selected').forEach(el => el.classList.remove('selected'));
        return;
      }

      const wrapper = img.closest('.ql-image-wrapper');
      if (!wrapper) return;

      // Xóa toolbar cũ
      const existingToolbar = editorRoot.querySelector('.image-align-toolbar');
      if (existingToolbar) existingToolbar.remove();
      editorRoot.querySelectorAll('.ql-image-wrapper.selected').forEach(el => el.classList.remove('selected'));

      // Đánh dấu wrapper được chọn
      wrapper.classList.add('selected');

      // Tạo floating toolbar
      const toolbar = document.createElement('div');
      toolbar.className = 'image-align-toolbar';

      const currentAlign = wrapper.getAttribute('data-align') || 'center';

      const buttons = [
        { align: 'left', icon: '⬅', title: 'Căn trái' },
        { align: 'center', icon: '⬛', title: 'Căn giữa' },
        { align: 'right', icon: '➡', title: 'Căn phải' }
      ];

      buttons.forEach(({ align, icon, title }) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.innerHTML = icon;
        btn.title = title;
        if (align === currentAlign) btn.classList.add('active');

        btn.addEventListener('click', (ev) => {
          ev.preventDefault();
          ev.stopPropagation();

          // Tìm blot từ wrapper node và format lại alignment
          const blot = Quill.find(wrapper);
          if (blot) {
            blot.format('align', align);
          }

          // Cập nhật trạng thái active của các nút
          toolbar.querySelectorAll('button').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          // Trigger onChange để React cập nhật state
          const content = editor.root.innerHTML;
          setFormData(prev => ({ ...prev, content }));
        });

        toolbar.appendChild(btn);
      });

      wrapper.style.position = 'relative';
      wrapper.appendChild(toolbar);
    };

    editorRoot.addEventListener('click', handleImageClick);

    return () => {
      editorRoot.removeEventListener('click', handleImageClick);
    };
  }, []);


  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;

      const toastId = toast.loading("Đang tải ảnh lên...");
      const formDataUpload = new FormData();
      formDataUpload.append('image', file);

      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/blogs/upload-image`, {
          method: 'POST',
          body: formDataUpload
        });
        const data = await res.json();

        if (data.success) {
          const quill = quillRef.current.getEditor();
          const range = quill.getSelection(true);
          quill.insertEmbed(range.index, 'image', data.url);
          toast.success("Tải ảnh thành công!", { id: toastId });
        } else {
          toast.error("Lỗi tải ảnh", { id: toastId });
        }
      } catch (error) {
        toast.error("Lỗi kết nối", { id: toastId });
      }
    };
  };

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }], 
        [{ 'size': ['12px', '14px', false, '18px', '20px', '24px', '28px', '32px'] }], 
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }], 
        [{ 'align': [] }], 
        [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'indent': '-1'}, { 'indent': '+1' }], 
        ['link', 'image', 'video'],
        ['clean']
      ],
      handlers: { image: imageHandler }
    }
  }), []);

  const formats = [
    'header', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'align',
    'list', 'bullet', 'indent',
    'link', 'image', 'video'
  ];

  const handleToggleFeature = async (id) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/blogs/${id}/feature`, { method: 'PATCH' });
      const data = await res.json();
      if(data.success) {
        fetchBlogs(); 
        toast.success("Đã cập nhật bài nổi bật!");
      }
    } catch (error) { toast.error("Lỗi khi cập nhật"); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editingId && !formData.file) return toast.error("Vui lòng chọn ảnh bìa!");
    if (!formData.content || formData.content === '<p><br></p>') return toast.error("Vui lòng nhập nội dung!");

    const toastId = toast.loading(editingId ? "Đang cập nhật..." : "Đang đăng bài...");
    const data = new FormData();
    data.append('title', formData.title);
    data.append('category', formData.category);
    data.append('content', formData.content); 
    if (formData.file) {
        data.append('image', formData.file);
    }

    try {
      const url = editingId ? `${import.meta.env.VITE_API_URL}/api/blogs/${editingId}` : `${import.meta.env.VITE_API_URL}/api/blogs`;
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, { method, body: data });
      const result = await res.json();
      if (result.success) {
        toast.success(editingId ? "Cập nhật thành công!" : "Đăng bài thành công!", { id: toastId });
        setFormData({ title: '', category: 'Kinh nghiệm xây nhà', content: '', file: null });
        setEditingId(null);
        document.getElementById('cover-image-input').value = '';
        fetchBlogs();
      } else {
        toast.error(result.message || "Có lỗi xảy ra", { id: toastId });
      }
    } catch (error) { toast.error("Lỗi đăng bài", { id: toastId }); }
  };

  const handleEdit = (blog) => {
    setFormData({
        title: blog.title,
        category: blog.category,
        content: blog.content,
        file: null
    });
    setEditingId(blog._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setFormData({ title: '', category: 'Kinh nghiệm xây nhà', content: '', file: null });
    setEditingId(null);
    document.getElementById('cover-image-input').value = '';
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Xóa bài viết này?")) return;
    await fetch(`${import.meta.env.VITE_API_URL}/api/blogs/${id}`, { method: 'DELETE' });
    setBlogs(blogs.filter(b => b._id !== id));
    toast.success("Đã xóa!");
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border max-w-6xl">
      <h2 className="text-2xl font-bold mb-6">Quản lý Tin Tức & Kiến Thức (SEO)</h2>
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
            <label className="block text-sm font-bold mb-1">Ảnh bìa bài viết {editingId && <span className="text-gray-500 font-normal">(Bỏ trống nếu không muốn đổi ảnh)</span>}</label>
            <input id="cover-image-input" type="file" accept="image/*" onChange={e => setFormData({...formData, file: e.target.files[0]})} className="w-full border p-1.5 rounded bg-white" />
        </div>
        <div className="mb-6">
            <label className="block text-sm font-bold mb-1">Nội dung chi tiết (Có thể chèn ảnh, tạo tiêu đề)</label>
            <div className="bg-white rounded border">
                <ReactQuill 
                  ref={quillRef}
                  theme="snow" 
                  value={formData.content} 
                  onChange={(val) => setFormData({...formData, content: val})} 
                  modules={modules}
                  formats={formats}
                  className="h-96 mb-12" 
                />
            </div>
        </div>
        <div className="flex gap-4">
            <button type="submit" className="bg-green-600 text-white font-bold px-8 py-2 rounded hover:bg-green-700">
                {editingId ? "Cập Nhật Bài Viết" : "Xuất Bản Bài Viết"}
            </button>
            {editingId && (
                <button type="button" onClick={handleCancelEdit} className="bg-gray-400 text-white font-bold px-8 py-2 rounded hover:bg-gray-500">
                    Hủy
                </button>
            )}
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogs.map(blog => (
              <div key={blog._id} className={`border rounded-lg overflow-hidden group relative transition-all ${blog.isFeatured ? 'border-yellow-400 shadow-md bg-yellow-50/30' : 'border-gray-200'}`}>
                  <button 
                    onClick={() => handleToggleFeature(blog._id)}
                    className={`absolute top-2 right-2 z-10 text-xl transition-transform hover:scale-125 bg-black/50 backdrop-blur-sm rounded-full w-8 h-8 flex items-center justify-center ${blog.isFeatured ? 'text-yellow-400' : 'text-white hover:text-yellow-200'}`}
                    title="Đánh dấu Nổi Bật"
                  >★</button>
                  <img src={blog.imageUrl} alt="cover" className="w-full h-40 object-cover" />
                  <div className="p-4">
                      <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">{blog.category}</span>
                      <h3 className="font-bold text-lg mt-2 mb-2 line-clamp-2">{blog.title}</h3>
                      <div className="flex justify-between items-center mt-3">
                          <button onClick={() => handleEdit(blog)} className="text-sm text-blue-500 hover:underline font-medium">Sửa bài</button>
                          <button onClick={() => handleDelete(blog._id)} className="text-sm text-red-500 hover:underline font-medium">Xóa bài</button>
                      </div>
                  </div>
              </div>
          ))}
      </div>
    </div>
  );
};
export default ManageBlog;