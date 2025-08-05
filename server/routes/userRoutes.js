import express from 'express';
import {
  addUserRating,
  getUserCourseProgress,
  getUserData,
  purchaseCourse,
  updateUserCourseProgress,
  userEnrolledCourses,
  createOrUpdateUser,
  getPurchases,
  getPurchaseById,
  getAllUsers,
  isUserEnrolled,
  deleteUser,
  submitReview,
  getApprovedReviews,
  getAllReviews,
  approveReview,
  deleteReview,
  createPayPalOrder,
  capturePayPalOrder,
} from '../controllers/userController.js';

const userRouter = express.Router();

// User data routes
userRouter.get('/users', getAllUsers);
userRouter.get('/data', getUserData);
userRouter.post('/data', createOrUpdateUser);
userRouter.delete('/user/:id', deleteUser);

// Course-related routes
userRouter.post('/purchase', purchaseCourse); // Keep this for non-PayPal purchases
userRouter.get('/purchase', getPurchases);
userRouter.get('/purchase/:id', getPurchaseById);
userRouter.get('/enrolled-courses', userEnrolledCourses);
userRouter.post('/update-course-progress', updateUserCourseProgress);
userRouter.post('/get-course-progress', getUserCourseProgress);
userRouter.post('/add-rating', addUserRating);
userRouter.post('/is-enrolled', isUserEnrolled);

// Review routes
userRouter.post('/reviews', submitReview);
userRouter.get('/reviews', getApprovedReviews);

// Admin-only routes
userRouter.get('/admin/reviews', getAllReviews);
userRouter.put('/admin/reviews/approve/:id', approveReview);
userRouter.delete('/admin/reviews/:id', deleteReview);

// Enhanced PayPal routes with validation middleware
userRouter.post('/paypal/create-order', 
  validatePurchaseData, // Add this middleware
  createPayPalOrder
);

userRouter.post('/paypal/capture-order/:orderID/:purchaseId', 
  validateCaptureData, // Add this middleware
  capturePayPalOrder
);

export default userRouter;

// Middleware functions
function validatePurchaseData(req, res, next) {
  const { courseId, userId, courseDetails, userDetails, amount } = req.body;
  
  if (!courseId || !userId || !amount || !courseDetails || !userDetails) {
    return res.status(400).json({ error: 'Missing required purchase data' });
  }
  
  if (typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ error: 'Invalid amount' });
  }

  next();
}

function validateCaptureData(req, res, next) {
  const { orderID, purchaseId } = req.params;
  
  if (!orderID || !purchaseId) {
    return res.status(400).json({ error: 'Missing order ID or purchase ID' });
  }

  next();
}