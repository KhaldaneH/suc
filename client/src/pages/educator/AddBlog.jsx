import React, { useContext, useEffect, useRef, useState } from 'react';
import { assets } from '../../assets/assets';
import { toast } from 'react-toastify';
import Quill from 'quill';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';

const AddBlog = () => {
  const editorRef = useRef(null);
  const quillRef = useRef(null);

  const { backendUrl, getToken } = useContext(AppContext);

  const [blogTitle, setBlogTitle] = useState('');
  const [category, setCategory] = useState(''); // new category state
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Cleanup URL object on image change/unmount
  useEffect(() => {
    return () => {
      if (image) URL.revokeObjectURL(image);
    };
  }, [image]);

  // Initialize Quill editor once
  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
      });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      toast.error('Blog image not selected');
      return;
    }

    const content = quillRef.current.root.innerHTML;

    if (!blogTitle.trim() || !content.trim() || !category.trim()) {
      toast.error('Blog title, content, and category are required');
      return;
    }

    setLoading(true);

    try {
      const blogData = {
        title: blogTitle.trim(),
        content,
        category: category.trim(),
      };

      const formData = new FormData();
      formData.append('blogData', JSON.stringify(blogData));
      formData.append('image', image);

      const token = await getToken();

      const { data } = await axios.post(`${backendUrl}/api/blogs/blog`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        toast.success(data.message || 'Blog added successfully');
        setBlogTitle('');
        setCategory('');
        quillRef.current.root.innerHTML = '';
        setImage(null);
      } else {
        toast.error(data.message || 'Failed to add blog');
      }
    } catch (error) {
      toast.error(error.response?.data?.error || error.message || 'Error adding blog');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen overflow-scroll flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md w-full text-gray-500">
        {/* Blog Title */}
        <h1>Add Formation</h1>
        <div className="flex flex-col gap-1">
          <p>Title</p>
          <input
            type="text"
            placeholder="Type blog title here"
            value={blogTitle}
            onChange={(e) => setBlogTitle(e.target.value)}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500"
            required
          />
        </div>

        {/* Category */}
        <div className="flex flex-col gap-1">
          <p>Category</p>
          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500"
            required
          />
        </div>

        {/* Blog Content */}
        <div className="flex flex-col gap-1">
          <p>Content</p>
          <div
            ref={editorRef}
            className="border border-gray-300 rounded p-2 min-h-[150px]"
          />
        </div>

        {/* Blog Image */}
        <div className="flex flex-col gap-1">
          <p>Image</p>
          <label htmlFor="blogImage" className="flex items-center gap-3 cursor-pointer">
            <img src={assets.file_upload_icon} alt="upload" className="p-3 bg-blue-500 rounded" />
            <input
              type="file"
              id="blogImage"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              hidden
            />
            {image && (
              <img
                src={URL.createObjectURL(image)}
                alt="preview"
                className="max-h-10"
              />
            )}
          </label>
        </div>

        {/* Submit */}
        {loading ? (
          <div className="flex justify-center my-4">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <button
            type="submit"
            className="bg-black text-white w-max py-2.5 px-8 rounded my-4"
          >
            ADD
          </button>
        )}
      </form>
    </div>
  );
};

export default AddBlog;
