import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loading from '../../components/student/Loading';
import { Trash2 } from 'lucide-react';

const MyCourses = () => {
  const { backendUrl, currency, getToken } = useContext(AppContext);

  const [courses, setCourses] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [editData, setEditData] = useState({
    courseTitle: '',
    courseDescription: '',
    coursePrice: '',
  });

  const fetchAllCourses = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/course/all`);
      if (data.success) setCourses(data.courses);
    } catch (error) {
      toast.error(error.message || 'Failed to fetch courses');
    }
  };

  const deleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;

    try {
      setLoadingDelete(true);
      const token = await getToken();
      const { data } = await axios.delete(`${backendUrl}/api/course/del/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        toast.success('Course deleted successfully');
        fetchAllCourses();
        setSelectedCourse(null);
      } else {
        toast.error(data.message || 'Failed to delete course');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to delete course');
    } finally {
      setLoadingDelete(false);
    }
  };

  const getAverageRating = (ratings = []) => {
    if (!Array.isArray(ratings) || ratings.length === 0) return 'No ratings';
    const avg = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
    return avg.toFixed(1) + ' / 5';
  };

  useEffect(() => {
    fetchAllCourses();
  }, []);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateCourseData = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.put(
        `${backendUrl}/api/course/update/${selectedCourse._id}`,
        editData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.success) {
        toast.success('Course updated successfully');
        fetchAllCourses();
        setSelectedCourse(null);
      } else {
        toast.error(data.message || 'Failed to update course');
      }
    } catch (error) {
      toast.error(error.message || 'Error updating course');
    }
  };

  if (!courses) return <Loading />;

  return (
    <div className="h-screen flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0">
      <div className="w-full">
        <h2 className="pb-4 text-lg font-medium">Articles</h2>
        <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
          <table className="md:table-auto table-fixed w-full overflow-hidden">
            <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left">
              <tr>
                <th className="px-4 py-3 font-semibold truncate">Title</th>
                <th className="px-4 py-3 font-semibold truncate hidden md:table-cell">Price</th>
                <th className="px-4 py-3 font-semibold truncate hidden md:table-cell">Published On</th>
                <th className="px-4 py-3 font-semibold truncate text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-500">
              {courses.map((course) => (
                <tr
                  key={course._id}
                  className="border-b border-gray-500/20 cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    setSelectedCourse(course);
                    setEditData({
                      courseTitle: course.courseTitle || '',
                      courseDescription: course.courseDescription || '',
                      coursePrice: course.coursePrice || '',
                    });
                  }}
                >
                  <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                    <img
                      src={course.courseThumbnail || '/default-thumbnail.jpg'}
                      alt="Course"
                      className="w-16 h-16 object-cover rounded"
                    />
                    <span className="truncate">{course.courseTitle}</span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    {course.coursePrice} {currency}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    {new Date(course.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => deleteCourse(course._id)}
                      disabled={loadingDelete}
                      title="Delete Course"
                      className="text-red-600 hover:text-red-800 transition"
                    >
                      <Trash2 className="inline-block w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Course Details / Edit */}
      {selectedCourse && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-4"
          onClick={() => setSelectedCourse(null)}
        >
          <div
            className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative transform transition-transform scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 text-3xl font-semibold"
              onClick={() => setSelectedCourse(null)}
              aria-label="Close modal"
            >
              &times;
            </button>

            <div className="flex flex-col space-y-5">
              <img
                src={selectedCourse.courseThumbnail || '/default-thumbnail.jpg'}
                alt="Course Thumbnail"
                className="w-28 h-28 rounded-lg object-cover shadow-md border border-gray-200 mx-auto"
              />

              {/* Editable Fields */}
              <input
                type="text"
                name="courseTitle"
                value={editData.courseTitle}
                onChange={handleEditChange}
                className="w-full border border-gray-300 rounded p-2"
                placeholder="Course Title"
              />
              <textarea
                name="courseDescription"
                value={editData.courseDescription}
                onChange={handleEditChange}
                rows={4}
                className="w-full border border-gray-300 rounded p-2"
                placeholder="Course Description"
              />
              <p>Price:</p>
              <input
                type="number"
                name="coursePrice"
                value={editData.coursePrice}
                onChange={handleEditChange}
                className="w-full border border-gray-300 rounded p-2"
                placeholder="Course Price"
              />

              <div className="text-gray-700 text-base space-y-2">
                <p>
                  <span className="font-semibold text-gray-900">Published On:</span>{' '}
                  {new Date(selectedCourse.createdAt).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-semibold text-gray-900">Average Rating:</span>{' '}
                  {getAverageRating(selectedCourse.courseRatings)}
                </p>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => deleteCourse(selectedCourse._id)}
                  disabled={loadingDelete}
                  className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded transition"
                >
                  Delete Course
                </button>

                <button
                  onClick={updateCourseData}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded transition"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCourses;
