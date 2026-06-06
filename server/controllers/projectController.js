import Project from "../models/Project.js";
import cloudinary from "../config/cloudinary.js";

const uploadToCloudinary = async (file) => {
    const b64 = Buffer.from(file.buffer).toString("base64");
    const dataURI = `data:${file.mimetype};base64,${b64}`;
    const result = await cloudinary.uploader.upload(dataURI, { folder: 'TTP_Projects' });
    return result.secure_url;
};

// [POST] Thêm Project mới
export const addProject = async (req, res) => {
    try {
        const { title, category, createdAt } = req.body;
        const info = req.body.info ? JSON.parse(req.body.info) : {};

        let mainImageUrl = "";
        if (req.files && req.files['mainImage']) {
            mainImageUrl = await uploadToCloudinary(req.files['mainImage'][0]);
        }

        const projectImageUrls = [];
        if (req.files && req.files['projectImages']) {
            for (const file of req.files['projectImages']) {
                const url = await uploadToCloudinary(file);
                projectImageUrls.push(url);
            }
        }

        const newProject = new Project({
            title, category, mainImage: mainImageUrl, projectImages: projectImageUrls, info,
            ...(createdAt ? { createdAt: new Date(createdAt) } : {})
        });

        await newProject.save();
        if (createdAt) {
            await Project.collection.updateOne(
                { _id: newProject._id },
                { $set: { createdAt: new Date(createdAt) } }
            );
            newProject.createdAt = new Date(createdAt);
        }
        res.status(201).json({ success: true, message: "Tạo dự án thành công", project: newProject });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// [GET] Danh sách Project
export const getProjects = async (req, res) => {
    try {
        const projects = await Project.find({}).sort({ createdAt: -1 });
        res.status(200).json({ success: true, projects });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// [DELETE] Xóa dự án
export const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        await Project.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Đã xóa dự án thành công" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, category, createdAt } = req.body;
        const info = req.body.info ? JSON.parse(req.body.info) : {};
        
        // Lấy danh sách ảnh cũ mà Admin muốn GIỮ LẠI (Gửi dưới dạng mảng URL từ Frontend)
        let projectImages = req.body.existingImages ? JSON.parse(req.body.existingImages) : [];
        let mainImage = req.body.existingMainImage;

        // 1. Nếu có upload ảnh bìa MỚI
        if (req.files && req.files['mainImage']) {
            mainImage = await uploadToCloudinary(req.files['mainImage'][0]);
        }

        // 2. Nếu có upload thêm ảnh album MỚI
        if (req.files && req.files['projectImages']) {
            for (const file of req.files['projectImages']) {
                const url = await uploadToCloudinary(file);
                projectImages.push(url); // Thêm vào danh sách ảnh
            }
        }

        const updateData = { title, category, info, mainImage, projectImages };
        if (createdAt) {
            updateData.createdAt = new Date(createdAt);
        }

        const updatedProject = await Project.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        if (createdAt && updatedProject) {
            await Project.collection.updateOne(
                { _id: updatedProject._id },
                { $set: { createdAt: new Date(createdAt) } }
            );
            updatedProject.createdAt = new Date(createdAt);
        }

        res.status(200).json({ success: true, message: "Cập nhật dự án thành công", project: updatedProject });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// [PATCH] Bật/Tắt trạng thái Dự án tiêu biểu
export const toggleFeatured = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ success: false, message: "Không tìm thấy dự án" });

        // Đảo ngược trạng thái hiện tại (true thành false, false thành true)
        project.isFeatured = !project.isFeatured;
        await project.save();

        res.status(200).json({ success: true, isFeatured: project.isFeatured });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};