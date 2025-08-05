import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: {
    id: { type: String },    // Changed from ObjectId to String
    name: String,
    email: String,
    imageUrl: String
  },
  content: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  approved: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Review", reviewSchema);
