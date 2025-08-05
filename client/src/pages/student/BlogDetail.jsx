import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import CourseCard from '../../components/student/CourseCard';

const BlogDetail = () => {
  const { id } = useParams();
  const { backendUrl, allCourses, calculateRating } = useContext(AppContext);

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filteredCourses, setFilteredCourses] = useState([]);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/blogs/blog/${id}`);
        const fetchedBlog = data.blog || data;
        setBlog(fetchedBlog);
        setLoading(false);

        if (fetchedBlog.category && allCourses) {
          const filtered = allCourses.filter(
            (course) => course.category === fetchedBlog.category
          );
          setFilteredCourses(filtered);
        } else {
          setFilteredCourses([]);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load blog.');
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id, backendUrl, allCourses]);

  // Calculate average rating only for courses with rating > 0
  const getAverageRating = () => {
    if (!blog?.category || !allCourses) return null;

    const relatedCourses = allCourses.filter(
      (course) =>
        course.category === blog.category && calculateRating(course) > 0
    );

    if (relatedCourses.length === 0) return null;

    const total = relatedCourses.reduce(
      (sum, course) => sum + calculateRating(course),
      0
    );
    return (total / relatedCourses.length).toFixed(1);
  };

  if (loading) return <p className="text-center mt-20">Loading blog...</p>;
  if (error) return <p className="text-center text-red-500 mt-20">{error}</p>;
  if (!blog) return <p className="text-center mt-20">Blog not found.</p>;

  const avgRating = getAverageRating();

  return (
    <div className="w-full max-w-screen-xl mx-auto px-6 py-6">
      {blog.imageUrl && (
        <img
          src={blog.imageUrl}
          alt={blog.title}
          className="w-full h-64 object-cover rounded mb-6"
        />
      )}

      <h1 className="text-3xl font-bold mb-1">{blog.title}</h1>

      {blog.category && (
        <p className="text-indigo-600 font-medium mb-2">
          {blog.category}
          {avgRating && (
            <span className="ml-2 text-sm text-gray-700">
              · ⭐ {avgRating} review
            </span>
          )}
        </p>
      )}

      <p className="text-sm text-gray-500 mb-6">
        Published on {new Date(blog.createdAt).toLocaleDateString()}
      </p>

      <div
        className="prose max-w-full text-gray-800 mb-10"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />

      <h2 className="text-2xl font-semibold mb-4">Articles</h2>

      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">No courses found for this category.</p>
      )}
    </div>
  );
};

export default BlogDetail;
