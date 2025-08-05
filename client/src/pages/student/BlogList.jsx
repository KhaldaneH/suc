import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';

const BlogsList = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [input, setInput] = useState('');

  const { backendUrl, allCourses, calculateRating } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/blogs/blog`);
        const blogsArray = Array.isArray(data) ? data : data.blogs || [];
        setBlogs(blogsArray);
        setFilteredBlogs(blogsArray);
      } catch (error) {
        console.error('Failed to fetch blogs:', error);
        setBlogs([]);
        setFilteredBlogs([]);
      }
    };

    fetchBlogs();
  }, [backendUrl]);

  useEffect(() => {
    if (input.trim() === '') {
      setFilteredBlogs(blogs);
    } else {
      const filtered = blogs.filter(blog =>
        blog.title.toLowerCase().includes(input.toLowerCase())
      );
      setFilteredBlogs(filtered);
    }
  }, [input, blogs]);

  // Helper to calculate average rating for a blog's category
  const getAverageRatingForCategory = (category) => {
    if (!category || !allCourses) return null;

    const coursesInCategory = allCourses.filter(course => course.category === category);
    const ratedCourses = coursesInCategory.filter(course => calculateRating(course) > 0);

    if (ratedCourses.length === 0) return null;

    const totalRating = ratedCourses.reduce((sum, course) => sum + calculateRating(course), 0);
    return (totalRating / ratedCourses.length).toFixed(1);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <input
        type="text"
        placeholder="Search blogs by title..."
        value={input}
        onChange={e => setInput(e.target.value)}
        className="border p-2 mb-6 w-full rounded"
      />

      {filteredBlogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredBlogs.map(blog => {
            const avgRating = getAverageRatingForCategory(blog.category);

            return (
              <article
                key={blog._id}
                className="border rounded p-4 shadow cursor-pointer hover:shadow-lg transition"
                onClick={() => navigate(`/formation/${blog._id}`, { state: { category: blog.category } })}
              >
                {blog.imageUrl && (
                  <img
                    src={blog.imageUrl}
                    alt={blog.title}
                    className="w-full h-48 object-cover rounded mb-4"
                  />
                )}

                <h2 className="text-xl font-semibold mb-1">{blog.title}</h2>

                {blog.category && (
                  <p className="text-sm text-indigo-600 font-medium mb-1">
                    {blog.category}
                    {avgRating && (
                      <span className="ml-2 text-sm text-gray-700">· ⭐ {avgRating}</span>
                    )}
                  </p>
                )}

                <div
                  className="text-gray-700 line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                ></div>

                <p className="mt-2 text-sm text-gray-500">
                  Published on {new Date(blog.createdAt).toLocaleDateString()}
                </p>
              </article>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-20">No blogs found.</p>
      )}
    </div>
  );
};

export default BlogsList;
