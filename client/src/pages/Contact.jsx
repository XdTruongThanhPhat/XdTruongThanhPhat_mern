import React, { useState } from 'react';
import toast from 'react-hot-toast'; // Bổ sung thư viện thông báo
import { Helmet } from 'react-helmet-async';

const Contact = () => {
  // ==========================================
  // URL ẢNH NỀN TỪ CLOUDINARY
  // ==========================================
  const heroBgUrl = "https://res.cloudinary.com/dia0hytop/image/upload/v1776675604/z7731184451078_e2096bacf215f8b507086b7a6712faa3_bjzvxz.png";

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    content: ''
  });

  // Trạng thái chờ để hiển thị hiệu ứng trên nút Submit
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ==========================================
  // HÀM XỬ LÝ GỬI THÔNG TIN LIÊN HỆ VỀ EMAIL
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    const toastId = toast.loading("Đang gửi thông tin...");

    try {
      // Gọi API gửi mail ở Backend mà chúng ta đã tạo
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Gửi thành công! TTP Architect sẽ liên hệ lại sớm nhất.", { id: toastId });
        // Xóa trắng form sau khi gửi thành công
        setFormData({ name: '', phone: '', email: '', content: '' });
      } else {
        toast.error("Có lỗi xảy ra, vui lòng thử lại sau.", { id: toastId });
      }
    } catch (error) {
      console.error("Lỗi gửi liên hệ:", error);
      toast.error("Lỗi kết nối đến máy chủ!", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen bg-white">
      <Helmet>
        <title>Liên Hệ | Trường Thành Phát</title>
        <meta name="description" content="Liên hệ Trường Thành Phát để được tư vấn thiết kế và thi công xây dựng chuyên nghiệp tại Đà Nẵng" />
        <link rel="canonical" href="https://truongthanhphatdn.vn/lien-he" />
      </Helmet>

      {/* ==========================================
          PHẦN 1: HERO BANNER (ĐÃ TỐI ƯU MOBILE)
      ========================================== */}
      <div
        className="relative w-full h-[40vh] md:h-[60vh] lg:h-[70vh] flex items-center justify-center bg-cover bg-center bg-no-repeat mt-16 md:mt-0"
        style={{ backgroundImage: `url('${heroBgUrl}')` }}
      >
        {/* Lớp phủ đen mờ */}
        <div className="absolute inset-0 bg-black/60"></div>

        {/* Nội dung Tiêu đề */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8 md:pt-16">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold uppercase tracking-widest text-white drop-shadow-md">
            Liên Hệ <span className="text-green-500">Chúng Tôi</span>
          </h1>
          <div className="w-16 md:w-24 h-1 bg-green-500 mx-auto mt-4 mb-4 md:mt-6 md:mb-6"></div>
          <p className="text-gray-100 max-w-2xl mx-auto text-xs sm:text-sm md:text-base leading-relaxed drop-shadow-sm px-2">
            Hãy để Trường Thành Phát biến ý tưởng không gian sống của bạn thành hiện thực.
            Liên hệ ngay để nhận tư vấn và báo giá chi tiết.
          </p>
        </div>
      </div>

      {/* ==========================================
          PHẦN 2: THÔNG TIN VÀ FORM LIÊN HỆ
      ========================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-start">

          {/* CỘT TRÁI: THÔNG TIN CÔNG TY */}
          <div>
            <h2 className="text-lg md:text-xl font-bold text-black uppercase tracking-widest mb-5 md:mb-6 border-l-4 border-green-500 pl-3 md:pl-4">
              Công Ty TNHH Tư Vấn Kiến Trúc & Xây Dựng TRƯỜNG THÀNH PHÁT
            </h2>

            <ul className="space-y-5 md:space-y-6 text-gray-600 mt-6 md:mt-8">
              {/* Địa chỉ */}
              <li className="flex items-start gap-3 md:gap-4 hover:text-green-500 transition-colors">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-green-50 flex flex-shrink-0 items-center justify-center text-green-500 shadow-sm">
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <div>
                  <p className="font-bold text-black uppercase tracking-wider text-xs md:text-sm mb-0.5 md:mb-1">Trụ sở chính</p>
                  <p className="text-xs md:text-sm leading-relaxed">256 Diên Hồng, Hòa Xuân, TP. Đà Nẵng</p>
                </div>
              </li>

              {/* Điện thoại */}
              <li className="flex items-start gap-3 md:gap-4 hover:text-green-500 transition-colors">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-green-50 flex flex-shrink-0 items-center justify-center text-green-500 shadow-sm">
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                </div>
                <div>
                  <p className="font-bold text-black uppercase tracking-wider text-xs md:text-sm mb-0.5 md:mb-1">Hotline / Zalo tư vấn</p>
                  <p className="text-xs md:text-sm font-medium">0387176793</p>
                </div>
              </li>

              {/* Email */}
              <li className="flex items-start gap-3 md:gap-4 hover:text-green-500 transition-colors">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-green-50 flex flex-shrink-0 items-center justify-center text-green-500 shadow-sm">
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <div>
                  <p className="font-bold text-black uppercase tracking-wider text-xs md:text-sm mb-0.5 md:mb-1">Email</p>
                  <p className="text-xs md:text-sm break-all">Xdtruongthanhphat@gmail.com</p>
                </div>
              </li>

              {/* Mạng xã hội */}
              <li className="flex items-start gap-3 md:gap-4">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-green-50 flex flex-shrink-0 items-center justify-center text-green-500 shadow-sm">
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                </div>
                <div className="flex flex-col gap-2 md:gap-3 w-full mt-0.5 md:mt-1">
                  <p className="font-bold text-black uppercase tracking-wider text-xs md:text-sm mb-0.5 md:mb-1">Kết nối trực tuyến</p>
                  <a href="https://www.facebook.com/XDTRUONGTHANHPHAT" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs md:text-sm text-gray-600 hover:text-green-500 transition-colors">
                    <svg className="w-4 h-4 md:w-5 md:h-5 text-blue-600 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" /></svg>
                    Trường Thành Phát Architect
                  </a>
                  <a href="https://zalo.me/0387176793" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs md:text-sm text-gray-600 hover:text-green-500 transition-colors">
                    <span className="w-4 h-4 md:w-5 md:h-5 bg-blue-500 text-white font-bold text-[8px] md:text-[10px] flex items-center justify-center rounded-sm shrink-0">Zalo</span>
                    Tư Vấn Trường Thành Phát
                  </a>
                </div>
              </li>
            </ul>
          </div>

          {/* CỘT PHẢI: FORM GỬI THÔNG TIN */}
          <div className="bg-white p-6 sm:p-8 md:p-10 rounded-xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <h3 className="text-base md:text-lg font-bold uppercase tracking-widest text-black mb-5 md:mb-6 border-b border-gray-100 pb-3 md:pb-4">
              Gửi tin nhắn cho chúng tôi
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                <div>
                  <label className="block text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 md:mb-2">Họ và tên *</label>
                  <input required type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2.5 md:px-4 md:py-3 bg-gray-50 border border-transparent rounded-sm outline-none focus:border-green-500 focus:bg-white transition-all text-xs md:text-sm" />
                </div>
                <div>
                  <label className="block text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 md:mb-2">Số điện thoại *</label>
                  <input required type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-3 py-2.5 md:px-4 md:py-3 bg-gray-50 border border-transparent rounded-sm outline-none focus:border-green-500 focus:bg-white transition-all text-xs md:text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 md:mb-2">Email</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-3 py-2.5 md:px-4 md:py-3 bg-gray-50 border border-transparent rounded-sm outline-none focus:border-green-500 focus:bg-white transition-all text-xs md:text-sm" />
              </div>

              <div>
                <label className="block text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 md:mb-2">Nội dung yêu cầu *</label>
                <textarea required rows="4" value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} className="w-full px-3 py-2.5 md:px-4 md:py-3 bg-gray-50 border border-transparent rounded-sm outline-none focus:border-green-500 focus:bg-white transition-all text-xs md:text-sm resize-none" placeholder="Bạn cần chúng tôi tư vấn về thiết kế, thi công nhà phố hay biệt thự?"></textarea>
              </div>

              <div className="pt-2 md:pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full text-white font-bold uppercase tracking-widest py-3 md:py-4 rounded-sm shadow-md transition-colors duration-300 text-xs md:text-sm ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-green-500'}`}
                >
                  {isSubmitting ? 'Đang gửi...' : 'Gửi yêu cầu ngay'}
                </button>
              </div>
            </form>
          </div>

        </div>

        {/* ==========================================
            PHẦN 3: BẢN ĐỒ GOOGLE MAPS FULL WIDTH
        ========================================== */}
        <div className="mt-16 md:mt-24">
          <h3 className="text-lg md:text-xl font-bold text-black uppercase tracking-widest mb-6 md:mb-8 border-l-4 border-green-500 pl-3 md:pl-4">Văn phòng</h3>
          <div className="w-full h-[300px] md:h-[450px] rounded-lg md:rounded-xl overflow-hidden shadow-sm border border-gray-200">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d338.9732422958237!2d108.22584900910367!3d16.01120131272239!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31421b1469409ea3%3A0xa0dc072d6c67fbdf!2zQ8O0bmcgVHkgS2nhur9uIFRyw7pjIC0gWMOieSBE4buxbmcgLSBO4buZaSBUaOG6pXQgVHLGsOG7nW5nIFRow6BuaCBQaMOhdA!5e0!3m2!1svi!2s!4v1776498577228!5m2!1svi!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Contact;