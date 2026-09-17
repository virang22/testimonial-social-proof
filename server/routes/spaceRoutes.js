import { Router } from 'express';
import { listSpaces, createSpace, getSpace, updateSpace, deleteSpace } from '../controllers/spaceController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = Router(); router.use(protect); router.route('/').get(listSpaces).post(createSpace); router.route('/:id').get(getSpace).put(updateSpace).delete(deleteSpace); export default router;
