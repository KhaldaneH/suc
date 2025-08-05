import { Blog } from '../models/Blog.js';
import { v2 as cloudinary } from 'cloudinary';

// Create blog
export const addBlog = async (req, res) => {
  try {
    const { blogData } = req.body;
    const imageFile = req.file;

    if (!imageFile) {
      return res.status(400).json({ success: false, message: 'Blog image not attached' });
    }

    if (!blogData) {
      return res.status(400).json({ success: false, message: 'Blog data is missing' });
    }

    const parsedBlogData = JSON.parse(blogData);

    const imageUpload = await cloudinary.uploader.upload(imageFile.path);
    parsedBlogData.imageUrl = imageUpload.secure_url;

    const newBlog = await Blog.create(parsedBlogData);

    res.status(201).json({ success: true, message: 'Blog Added', blog: newBlog });
  } catch (error) {
    console.error('Add blog failed:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all blogs
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json({ success: true, blogs });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch blogs' });
  }
};

// Get single blog
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching blog', error: err.message });
  }
};

// Delete blog
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    res.json({ message: 'Blog deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting blog', error: err.message });
  }
};

// Update blog
export const updateBlog = async (req, res) => {
  try {
    const { title, content, category, imageUrl } = req.body;

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, content, category, imageUrl },
      { new: true }
    );

    if (!updatedBlog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    res.json({ success: true, blog: updatedBlog }); // ✅ Add success
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error updating blog',
      error: err.message,
    });
  }
};
