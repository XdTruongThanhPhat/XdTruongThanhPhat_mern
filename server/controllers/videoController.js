import Video from "../models/Video.js";

// [GET] Lấy tất cả video
export const getVideos = async (req, res) => {
    try {
        const videos = await Video.find().sort({ order: 1, createdAt: -1 });
        res.status(200).json({ success: true, videos });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// [GET] Lấy chi tiết 1 video
export const getVideoById = async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) {
            return res.status(404).json({ success: false, message: "Không tìm thấy video" });
        }
        res.status(200).json({ success: true, video });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// [POST] Thêm video mới
export const addVideo = async (req, res) => {
    try {
        const { title, youtubeUrl, description, content, focusKeyword, metaDescription, isFeatured, order } = req.body;

        if (!title || !youtubeUrl) {
            return res.status(400).json({ success: false, message: "Vui lòng nhập tiêu đề và đường dẫn YouTube!" });
        }

        const newVideo = await Video.create({
            title,
            youtubeUrl,
            description: description || "",
            content: content || "",
            focusKeyword: focusKeyword || "",
            metaDescription: metaDescription || "",
            isFeatured: isFeatured === true || isFeatured === 'true',
            order: order ? Number(order) : 0
        });

        res.status(201).json({ success: true, message: "Thêm video thành công", video: newVideo });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// [PUT] Cập nhật video
export const updateVideo = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, youtubeUrl, description, content, focusKeyword, metaDescription, isFeatured, order } = req.body;

        const updatedVideo = await Video.findByIdAndUpdate(
            id,
            {
                title,
                youtubeUrl,
                description: description || "",
                content: content || "",
                focusKeyword: focusKeyword || "",
                metaDescription: metaDescription || "",
                isFeatured: isFeatured === true || isFeatured === 'true',
                order: order !== undefined ? Number(order) : 0
            },
            { new: true }
        );

        if (!updatedVideo) {
            return res.status(404).json({ success: false, message: "Không tìm thấy video để cập nhật" });
        }

        res.status(200).json({ success: true, message: "Cập nhật video thành công", video: updatedVideo });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// [DELETE] Xóa video
export const deleteVideo = async (req, res) => {
    try {
        const { id } = req.params;
        await Video.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Xóa video thành công" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// [PATCH] Bật/tắt trạng thái nổi bật
export const toggleFeaturedVideo = async (req, res) => {
    try {
        const { id } = req.params;
        const video = await Video.findById(id);
        if (!video) return res.status(404).json({ success: false, message: "Không tìm thấy video" });

        video.isFeatured = !video.isFeatured;
        await video.save();

        res.status(200).json({ success: true, message: "Đã cập nhật trạng thái nổi bật", video });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
