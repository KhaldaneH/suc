import mongoose from "mongoose";

const PurchaseSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },

  userId: {
    type: String,
    required: true
  },

  courseDetails: {
    title: { type: String, required: true },
    thumbnail: { type: String, required: true },
    educator: {
      id: { type: String, required: true },
      name: { type: String, required: true }
    },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 }
  },

  userDetails: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    imageUrl: { type: String },
    phoneNumber: { type: String }
  },

  amountPaid: {
    type: Number,
    required: true,
    min: 0
  },

  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },

  enrolledAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true // includes createdAt and updatedAt
});

PurchaseSchema.index({ userId: 1 });
PurchaseSchema.index({ courseId: 1 });

export const Purchase = mongoose.model('Purchase', PurchaseSchema);
