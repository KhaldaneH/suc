import Course from "../models/Course.js"
import { CourseProgress } from "../models/CourseProgress.js"
import { Purchase } from "../models/Purchase.js"
import User from "../models/User.js"
import Review from "../models/Review.js";
import paypal from '@paypal/checkout-server-sdk';
import { client } from '../utils/paypalClient.js';
import mongoose from 'mongoose';





// Create or Update User (NEW FUNCTION)
export const createOrUpdateUser = async (req, res) => {
    try {
        const { clerkId, email, firstName, lastName, imageUrl } = req.body;
        
        // Validate required fields
        if (!clerkId || !email) {
            return res.status(400).json({
                success: false,
                message: 'clerkId and email are required'
            });
        }

        // Create name from firstName/lastName or use email prefix
        const name = firstName && lastName 
            ? `${firstName} ${lastName}`
            : email.split('@')[0];

        const userData = {
            _id: clerkId,
            email,
            name,
            imageUrl: imageUrl || 'https://example.com/default-avatar.png',
            ...(firstName && { firstName }),
            ...(lastName && { lastName })
        };

        // Find and update or create new user
        const user = await User.findOneAndUpdate(
            { _id: clerkId },
            userData,
            { 
                new: true,
                upsert: true,
                runValidators: true 
            }
        );

        res.status(200).json({
            success: true,
            message: 'User processed successfully',
            user
        });

    } catch (error) {
        console.error('User processing error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to process user',
            error: error.message,
            ...(error.errors && { validationErrors: error.errors })
        });
    }
};

// Get all users (for admin or educator dashboards)
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, 'name email imageUrl role createdAt') // Select only needed fields

        res.json({
            success: true,
            users
        });
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch users',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get User Data
export const getUserData = async (req, res) => {
    try {
        const userId = req.auth.userId;
        
        // Explicitly select the role field and populate if needed
        const user = await User.findById(userId)
            .select('name email role') // Include role in the response
            .lean(); // Convert to plain JS object

        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User Not Found' 
            });
        }

        // Add explicit isAdmin flag to response
        const responseData = {
            ...user,
            isAdmin: user.role === 'admin'
        };

        res.json({ 
            success: true, 
            user: responseData 
        });

    } catch (error) {
        console.error('Error in getUserData:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
}

// Purchase Course 
export const purchaseCourse = async (req, res) => {
    try {
        const { courseId, name, phoneNumber } = req.body;
        const userId = req.auth.userId;

        // Validate inputs
        if (!courseId || !phoneNumber) {
            return res.status(400).json({ 
                success: false,
                message: 'Course ID and phone number are required'
            });
        }

        // Find course with educator details
        const course = await Course.findById(courseId).populate('educator', 'name _id');
        if (!course) {
            return res.status(404).json({ 
                success: false,
                message: 'Course not found' 
            });
        }

        // Find user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: 'User not found' 
            });
        }

        // Check for existing enrollment
        const existingPurchase = await Purchase.findOne({ userId, courseId });
        if (existingPurchase) {
            return res.status(409).json({ 
                success: false,
                message: 'Already enrolled in this course' 
            });
        }

        // Create purchase record with enrolledAt set
        const purchase = await Purchase.create({
            courseId: course._id,
            userId,
            courseDetails: {
                title: course.courseTitle,
                thumbnail: course.courseThumbnail,
                educator: {
                    id: course.educator._id.toString(),
                    name: course.educator.name
                },
                price: course.coursePrice,
                discount: course.discount
            },
            userDetails: {
                name: name || user.name,
                email: user.email,
                imageUrl: user.imageUrl,
                phoneNumber
            },
            amountPaid: parseFloat((course.coursePrice * (1 - course.discount / 100)).toFixed(2)),
            status: 'completed',
            enrolledAt: new Date()  // <<-- set enrollment date here
        });

        // Update user's enrolled courses
        user.enrolledCourses.push(courseId);
        await user.save();

        // Update course's enrolled students
        course.enrolledStudents.push(userId);
        await course.save();

        return res.json({
            success: true,
            message: 'Enrollment successful',
            purchaseId: purchase._id
        });

    } catch (error) {
        console.error('Purchase error:', error);
        return res.status(500).json({
            success: false,
            message: 'Enrollment failed',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get all purchases with optional filters
export const getPurchases = async (req, res) => {
    try {
        const { courseId, userId, status } = req.query;
        const filters = {};
        
        if (courseId) filters.courseId = courseId;
        if (userId) filters.userId = userId;
        if (status) filters.status = status;

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const sortBy = req.query.sortBy || 'enrolledAt';
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
        const sort = { [sortBy]: sortOrder };

        const purchases = await Purchase.find(filters)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await Purchase.countDocuments(filters);

        const totalAmount = await Purchase.aggregate([
            { $match: filters },
            { $group: { _id: null, total: { $sum: "$amountPaid" } } }
        ]);

        res.json({
            success: true,
            data: purchases,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
                totalAmount: totalAmount[0]?.total || 0
            }
        });

    } catch (error) {
        console.error('Get purchases error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch purchases',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get single purchase by ID
export const getPurchaseById = async (req, res) => {
    try {
        const { id } = req.params;
        const purchase = await Purchase.findById(id).lean();

        if (!purchase) {
            return res.status(404).json({
                success: false,
                message: 'Purchase not found'
            });
        }

        res.json({
            success: true,
            data: purchase
        });

    } catch (error) {
        console.error('Get purchase by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch purchase',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Users Enrolled Courses With Lecture Links
export const userEnrolledCourses = async (req, res) => {
    try {
        const userId = req.auth.userId
        const userData = await User.findById(userId)
            .populate('enrolledCourses')

        res.json({ success: true, enrolledCourses: userData.enrolledCourses })

    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

// Update User Course Progress
export const updateUserCourseProgress = async (req, res) => {
    try {
        const userId = req.auth.userId
        const { courseId, lectureId } = req.body

        const progressData = await CourseProgress.findOne({ userId, courseId })

        if (progressData) {
            if (progressData.lectureCompleted.includes(lectureId)) {
                return res.json({ success: true, message: 'Lecture Already Completed' })
            }

            progressData.lectureCompleted.push(lectureId)
            await progressData.save()
        } else {
            await CourseProgress.create({
                userId,
                courseId,
                lectureCompleted: [lectureId]
            })
        }

        res.json({ success: true, message: 'Progress Updated' })

    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

// Get User Course Progress
export const getUserCourseProgress = async (req, res) => {
    try {
        const userId = req.auth.userId
        const { courseId } = req.body

        const progressData = await CourseProgress.findOne({ userId, courseId })

        res.json({ success: true, progressData })

    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

// Add User Ratings to Course
export const addUserRating = async (req, res) => {
    const userId = req.auth.userId
    const { courseId, rating } = req.body

    // Validate inputs
    if (!courseId || !userId || !rating || rating < 1 || rating > 5) {
        return res.status(400).json({ success: false, message: 'Invalid Details' })
    }

    try {
        // Find the course by ID
        const course = await Course.findById(courseId)

        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found.' })
        }

        // Removed enrollment check here

        // Check if user already rated
        const existingRatingIndex = course.courseRatings.findIndex(r => r.userId === userId)

        if (existingRatingIndex > -1) {
            // Update the existing rating
            course.courseRatings[existingRatingIndex].rating = rating
        } else {
            // Add a new rating
            course.courseRatings.push({ userId, rating })
        }

        await course.save()

        return res.json({ success: true, message: 'Rating added' })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const isUserEnrolled = async (req, res) => {
  const userId = req.auth.userId;
  const { courseId } = req.body;

  if (!userId || !courseId) {
    return res.status(400).json({ success: false, message: "Missing userId or courseId" });
  }

  try {
    const isEnrolled = await Purchase.exists({ userId, courseId });

    return res.status(200).json({
      success: true,
      isEnrolled: !!isEnrolled
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    await User.findByIdAndDelete(userId);
    return res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const submitReview = async (req, res) => {
  try {
    const userId = req.auth?.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: "User not authenticated." });
    }

    const { content, rating } = req.body;

    if (!content || !rating) {
      return res.status(400).json({ success: false, message: "Content and rating are required." });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const review = new Review({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        imageUrl: user.imageUrl
      },
      content,
      rating,
      approved: false
    });

    await review.save();

    return res.status(201).json({
      success: true,
      message: "Review submitted successfully. Awaiting approval."
    });

  } catch (error) {
    console.error('Submit review error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get all approved reviews (for display)
export const getApprovedReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ approved: true }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, reviews });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get all reviews (admin)
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    console.log('Reviews found:', reviews.length);
    return res.status(200).json({ success: true, reviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};



// @desc Approve a review (admin)
export const approveReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findByIdAndUpdate(id, { approved: true }, { new: true });

    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    return res.status(200).json({ success: true, message: "Review approved", review });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Delete a review (admin)
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Review.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    return res.status(200).json({ success: true, message: "Review deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Create PayPal Order
export const createPayPalOrder = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { courseId } = req.body;
        const userId = req.auth.userId;

        // Validate inputs
        if (!courseId) {
            await session.abortTransaction();
            return res.status(400).json({
                success: false,
                message: 'Course ID is required',
                errorCode: 'MISSING_COURSE_ID'
            });
        }

        // Get course and user with session
        const course = await Course.findById(courseId)
            .populate('educator', 'name _id')
            .session(session);
        
        const user = await User.findById(userId).session(session);

        if (!course || !user) {
            await session.abortTransaction();
            return res.status(404).json({
                success: false,
                message: !course ? 'Course not found' : 'User not found'
            });
        }

        // Check existing enrollment
        const existingPurchase = await Purchase.findOne({ 
            userId, 
            courseId 
        }).session(session);

        if (existingPurchase) {
            await session.abortTransaction();
            return res.status(409).json({
                success: false,
                message: 'Already enrolled in this course'
            });
        }

        // Calculate amount with proper rounding
        const amount = parseFloat(
            (course.coursePrice * (1 - course.discount/100)).toFixed(2)
        );

        // First create the purchase record in pending state
        const purchase = await Purchase.create([{
            courseId,
            userId,
            courseDetails: {
                title: course.courseTitle,
                thumbnail: course.courseThumbnail,
                educator: {
                    id: course.educator._id,
                    name: course.educator.name
                },
                price: course.coursePrice,
                discount: course.discount
            },
            userDetails: {
                name: user.name,
                email: user.email,
                imageUrl: user.imageUrl
            },
            amountPaid: amount,
            status: 'pending',
            paymentMethod: 'paypal'
        }], { session });

        // Now create PayPal order with the purchase ID
        const request = new paypal.orders.OrdersCreateRequest();
        request.prefer("return=representation");
        request.requestBody({
            intent: 'CAPTURE',
            purchase_units: [{
                amount: {
                    currency_code: 'USD',
                    value: amount
                },
                description: `Course: ${course.courseTitle}`,
                custom_id: courseId,
                invoice_id: `course-${courseId}-${purchase[0]._id}`
            }],
            application_context: {
                shipping_preference: 'NO_SHIPPING',
                user_action: 'PAY_NOW',
                return_url: `${process.env.FRONTEND_URL}/payment/success?purchaseId=${purchase[0]._id}`,
                cancel_url: `${process.env.FRONTEND_URL}/payment/canceled?purchaseId=${purchase[0]._id}`
            }
        });

        // Execute PayPal request
        const paypalResponse = await client().execute(request);

        // Update purchase with PayPal order ID
        purchase[0].paymentDetails = {
            paypalOrderId: paypalResponse.result.id
        };
        await purchase[0].save({ session });

        await session.commitTransaction();

        return res.status(200).json({
            success: true,
            paypalOrderId: paypalResponse.result.id,
            purchaseId: purchase[0]._id,
            approvalUrl: paypalResponse.result.links.find(
                link => link.rel === 'approve').href
        });

    } catch (error) {
        await session.abortTransaction();
        
        console.error('PayPal order creation failed:', {
            error: error.message,
            stack: error.stack,
            userId: req.auth?.userId,
            courseId: req.body?.courseId
        });

        return res.status(500).json({
            success: false,
            message: 'Payment initiation failed',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined,
            paypalDebugId: error.headers?.['paypal-debug-id']
        });
    } finally {
        session.endSession();
    }
};

export const capturePayPalOrder = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { orderID, purchaseId } = req.params;

        // Validate inputs
        if (!orderID || !purchaseId) {
            await session.abortTransaction();
            return res.status(400).json({
                success: false,
                message: 'Order ID and Purchase ID are required'
            });
        }

        // Get the purchase record
        const purchase = await Purchase.findById(purchaseId).session(session);
        if (!purchase) {
            await session.abortTransaction();
            return res.status(404).json({
                success: false,
                message: 'Purchase record not found'
            });
        }

        // Verify the orderID matches the purchase record
        if (purchase.paymentDetails.paypalOrderId !== orderID) {
            await session.abortTransaction();
            return res.status(400).json({
                success: false,
                message: 'Order ID does not match purchase record'
            });
        }

        // Capture PayPal payment
        const captureRequest = new paypal.orders.OrdersCaptureRequest(orderID);
        captureRequest.requestBody({});
        const capture = await client().execute(captureRequest);

        // Update purchase status
        purchase.status = 'completed';
        purchase.enrolledAt = new Date();
        purchase.paymentDetails.paypal = {
            captureId: capture.result.id,
            status: capture.result.status,
            createTime: capture.result.create_time,
            updateTime: capture.result.update_time,
            payer: capture.result.payer,
            details: capture.result
        };

        await purchase.save({ session });

        // Update user's enrolled courses
        await User.findByIdAndUpdate(
            purchase.userId,
            { $addToSet: { enrolledCourses: purchase.courseId } },
            { session }
        );

        // Update course's enrolled students
        await Course.findByIdAndUpdate(
            purchase.courseId,
            { $addToSet: { enrolledStudents: purchase.userId } },
            { session }
        );

        await session.commitTransaction();

        return res.json({
            success: true,
            message: 'Payment captured successfully',
            purchaseId: purchase._id,
            captureId: capture.result.id,
            status: capture.result.status
        });

    } catch (error) {
        await session.abortTransaction();
        
        console.error('PayPal capture failed:', {
            error: error.message,
            orderID: req.params?.orderID,
            purchaseId: req.params?.purchaseId
        });

        // Update purchase as failed
        if (purchaseId) {
            await Purchase.findByIdAndUpdate(
                purchaseId,
                { status: 'failed' }
            );
        }

        return res.status(500).json({
            success: false,
            message: 'Payment capture failed',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined,
            paypalDebugId: error.headers?.['paypal-debug-id']
        });
    } finally {
        session.endSession();
    }
};