import express from 'express';
import {
  addBlog,
  getAllBlogs,
  getBlogById,
  deleteBlog,
  updateBlog,
} from '../controllers/blogController.js';
import upload from '../configs/multer.js';


const router = express.Router();

router.post('/blog', upload.single('image'), addBlog);
router.get('/blog', getAllBlogs);
router.get('/blog/:id', getBlogById);
router.put('/blog/:id', updateBlog);
router.delete('/blog/:id', deleteBlog);

export default router;
