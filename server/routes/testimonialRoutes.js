import { Router } from 'express';
import { listTestimonials, moderate, analytics } from '../controllers/testimonialController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = Router(); router.use(protect); router.get('/', listTestimonials); router.get('/analytics', analytics); router.patch('/:id/:action(approve|reject|feature|like)', moderate); export default router;
