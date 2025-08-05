// models/Course.js
import mongoose from 'mongoose';

// Define lecture schema
const lectureSchema = new mongoose.Schema({
  lectureId: { type: String, required: true },
  lectureTitle: { type: String, required: true },
  lectureDuration: { type: String, required: false },
  lectureUrl: { type: String },
  isPreviewFree: { type: Boolean },
  lectureOrder: { type: Number }
}, { _id: false });

// Define chapter schema
const chapterSchema = new mongoose.Schema({
  chapterId: { type: String, required: true },
  chapterOrder: { type: Number, required: true },
  chapterTitle: { type: String, required: true },
  chapterContent: [lectureSchema]
}, { _id: false });

// Define course schema
const courseSchema = new mongoose.Schema({
  courseTitle: { type: String, required: true },
  courseDescription: { type: String, required: true },
  courseThumbnail: { type: String },
  coursePdf: { type: String },
  coursePrice: { type: Number, required: true },
  isPublished: { type: Boolean, default: true },
  discount: { type: Number, required: true, min: 0, max: 100 },
  category: { type: String, required: false }, // ✅ Added category field
  courseContent: [chapterSchema],
  educator: {
    type: String,
    ref: 'User',
    required: true
  },
  courseRatings: [
    {
      userId: { type: String },
      rating: { type: Number, min: 1, max: 5 }
    }
  ],
  enrolledStudents: [
    {
      type: String,
      ref: 'User'
    }
  ]
}, { timestamps: true, minimize: false });

const Course = mongoose.model('Course', courseSchema);

export default Course;
