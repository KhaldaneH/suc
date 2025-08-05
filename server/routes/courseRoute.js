import express from 'express';
import {
  getAllCourse,
  getCourseId,
  deleteCourseById,
  updateCourse,
} from '../controllers/courseController.js';
import upload from '../configs/multer.js';



const courseRouter = express.Router();

// Get All Courses
courseRouter.get('/all', getAllCourse);

// Get Course Data By Id
courseRouter.get('/:id', getCourseId);

// Delete Course By Id (protected route)
courseRouter.delete('/del/:id', deleteCourseById);

// ✅ Update Course By Id (protected route)
courseRouter.put('/update/:id', updateCourse);



export default courseRouter;
