import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    _id: { type: String, required: true },  // Using clerkId as _id
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    imageUrl: { 
        type: String, 
        required: true,
        default: 'https://example.com/default-avatar.png' 
    },
    firstName: { type: String },  // Optional
    lastName: { type: String },   // Optional
    enrolledCourses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course'
        }
    ],
    role: {
        type: String,
        enum: ['user','admin'], // optional: restrict possible values
        default: 'user'
    },
    createdAt: { type: Date, default: Date.now }
}, { 
    timestamps: true,
    _id: false
});

// Pre-save hook to ensure _id is set from clerkId
userSchema.pre('save', function(next) {
    if (!this._id && this.clerkId) {
        this._id = this.clerkId;
    }
    next();
});

const User = mongoose.model("User", userSchema);

export default User;
