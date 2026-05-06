import nodemailer from 'nodemailer';

export const sendContactEmail = async (req, res) => {
    const { name, phone, email, content } = req.body;

    try {
        // 1. Cấu hình "Người giao thư" (Transporter)
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // 2. Định dạng nội dung Email gửi về cho bạn
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // Gửi về chính email của công ty
            subject: `[TTP Architect] Yêu cầu tư vấn mới từ ${name}`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px; max-width: 600px;">
                    <h2 style="color: #16a34a; border-bottom: 2px solid #16a34a; padding-bottom: 10px;">Có khách hàng mới liên hệ từ Website</h2>
                    <p><strong>Họ và tên:</strong> ${name}</p>
                    <p><strong>Số điện thoại:</strong> <a href="tel:${phone}">${phone}</a></p>
                    <p><strong>Email:</strong> ${email || 'Khách không cung cấp'}</p>
                    <h3 style="margin-top: 20px; color: #333;">Nội dung yêu cầu:</h3>
                    <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; color: #555;">
                        ${content.replace(/\n/g, '<br>')}
                    </div>
                    <p style="margin-top: 30px; font-size: 12px; color: #999;">Email này được gửi tự động từ hệ thống website Trường Thành Phát Architect.</p>
                </div>
            `
        };

        // 3. Thực hiện gửi mail
        await transporter.sendMail(mailOptions);
        
        res.status(200).json({ success: true, message: "Gửi thông tin thành công!" });
    } catch (error) {
        console.error("Lỗi gửi email:", error);
        res.status(500).json({ success: false, message: "Lỗi hệ thống khi gửi email." });
    }
};

// Controller xử lý form Báo giá/Chi tiết dự án
export const contactProjectDetails = async (req, res) => {
    // 1. Phân tách chính xác các trường dữ liệu từ Object mà Client gửi lên
    const { name, phone, email, type, location, area, budget, details } = req.body;

    // 2. Validate cơ bản (Bắt buộc phải có tên và SĐT)
    if (!name || !phone) {
        return res.status(400).json({ success: false, message: "Vui lòng cung cấp Tên và Số điện thoại." });
    }

    try {
        // 3. Cấu hình Nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // 4. Thiết kế giao diện Email chuyên nghiệp cho báo giá
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // Gửi về chính email của bạn/công ty
            subject: `[TTP Architect] - Yêu cầu Báo Giá từ KH: ${name}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                    <div style="background-color: #16a34a; padding: 20px; text-align: center;">
                        <h2 style="color: #ffffff; margin: 0; text-transform: uppercase; letter-spacing: 1px;">YÊU CẦU BÁO GIÁ CHI TIẾT</h2>
                        <p style="color: #dcfce7; margin-top: 5px; font-size: 14px;">Trường Thành Phát Architect</p>
                    </div>
                    
                    <div style="padding: 24px; background-color: #ffffff;">
                        <h3 style="color: #111827; border-bottom: 2px solid #f3f4f6; padding-bottom: 8px; margin-top: 0;">1. Thông tin liên hệ</h3>
                        <p style="margin: 8px 0; color: #4b5563;"><strong>👤 Họ và tên:</strong> ${name}</p>
                        <p style="margin: 8px 0; color: #4b5563;"><strong>📞 Số điện thoại:</strong> <a href="tel:${phone}" style="color: #16a34a; font-weight: bold; text-decoration: none;">${phone}</a></p>
                        <p style="margin: 8px 0; color: #4b5563;"><strong>✉️ Email:</strong> ${email || 'Không cung cấp'}</p>

                        <h3 style="color: #111827; border-bottom: 2px solid #f3f4f6; padding-bottom: 8px; margin-top: 24px;">2. Thông tin dự án</h3>
                        <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
                            ${type ? `<tr><td style="padding: 10px 0; border-bottom: 1px dashed #e5e7eb; color: #6b7280; width: 40%;">Loại công trình:</td><td style="padding: 10px 0; border-bottom: 1px dashed #e5e7eb; font-weight: bold; color: #111827;">${type}</td></tr>` : ''}
                            ${location ? `<tr><td style="padding: 10px 0; border-bottom: 1px dashed #e5e7eb; color: #6b7280;">Địa điểm:</td><td style="padding: 10px 0; border-bottom: 1px dashed #e5e7eb; font-weight: bold; color: #111827;">${location}</td></tr>` : ''}
                            ${area ? `<tr><td style="padding: 10px 0; border-bottom: 1px dashed #e5e7eb; color: #6b7280;">Diện tích:</td><td style="padding: 10px 0; border-bottom: 1px dashed #e5e7eb; font-weight: bold; color: #111827;">${area}</td></tr>` : ''}
                            ${budget ? `<tr><td style="padding: 10px 0; border-bottom: 1px dashed #e5e7eb; color: #6b7280;">Ngân sách dự kiến:</td><td style="padding: 10px 0; border-bottom: 1px dashed #e5e7eb; font-weight: bold; color: #dc2626;">${budget}</td></tr>` : ''}
                        </table>

                        <h3 style="color: #111827; border-bottom: 2px solid #f3f4f6; padding-bottom: 8px; margin-top: 24px;">3. Ghi chú thêm</h3>
                        <div style="background-color: #f9fafb; padding: 16px; border-left: 4px solid #16a34a; color: #4b5563; line-height: 1.5; font-size: 14px; border-radius: 0 4px 4px 0;">
                            ${details ? details.replace(/\n/g, '<br>') : 'Khách hàng không để lại yêu cầu đặc biệt nào khác.'}
                        </div>
                    </div>
                    
                    <div style="background-color: #f3f4f6; padding: 16px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb;">
                        <p style="margin: 0;">Email được gửi tự động từ hệ thống báo giá Website Trường Thành Phát.</p>
                    </div>
                </div>
            `
        };

        // 5. Gửi mail
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: "Gửi thông tin thành công! TTP Architect sẽ liên hệ lại sớm nhất." });
        
    } catch (error) {
        console.error("Lỗi gửi email Project Details:", error);
        res.status(500).json({ success: false, message: "Lỗi hệ thống khi gửi email.", error: error.message });
    }
};