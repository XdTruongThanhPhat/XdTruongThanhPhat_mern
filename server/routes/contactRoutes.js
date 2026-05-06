import express from 'express';
import { sendContactEmail,contactProjectDetails } from '../controllers/contactController.js';

const router = express.Router();

// Route nhận dữ liệu từ Form Client
router.post('/', sendContactEmail);

router.post('/project-details', contactProjectDetails);

export default router;