import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loading from '../../components/student/Loading';
import { Trash2 } from 'lucide-react';

const MyBlogs = () => {
  const { backendUrl, getToken } = useContext(AppContext);

  const [blogs, setBlogs] = useState(null);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [editData, setEditData] = useState({
    title: '',
    content: '',
    imageUrl: '',
  });

  const fetchBlogs = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(`${backendUrl}/api/blogs/blog`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) setBlogs(data.blogs);
    } catch (error) {
      toast.error(error.message || 'Failed to fetch blogs');
    }
  };

  const deleteBlog = async (blogId) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;

    try {
      setLoadingDelete(true);
      const token = await getToken();
      const { data } = await axios.delete(`${backendUrl}/api/blogs/blog/${blogId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.message === 'Blog deleted') {
        toast.success('Blog deleted successfully', {
          position: 'top-right',
          autoClose: 3000,
          theme: 'colored',
        });
        setBlogs((prev) => prev.filter((b) => b._id !== blogId));
        if (selectedBlog?._id === blogId) setSelectedBlog(null);
      } else {
        toast.error(data.message || 'Failed to delete blog');
      }
    } catch (error) {
      toast.error(error.message || 'Error deleting blog');
    } finally {
      setLoadingDelete(false);
    }
  };

  const updateBlog = async () => {
    try {
      setLoadingUpdate(true);
      const token = await getToken();
      const { data } = await axios.put(
        `${backendUrl}/api/blogs/blog/${selectedBlog._id}`,
        editData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.success) {
        toast.success('Blog updated successfully', {
          position: 'top-right',
          autoClose: 3000,
          theme: 'colored',
        });
        fetchBlogs();
        setSelectedBlog(null);
      } else {
        toast.error(data.message || 'Failed to update blog');
      }
    } catch (error) {
      toast.error(error.message || 'Error updating blog');
    } finally {
      setLoadingUpdate(false);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  if (!blogs) return <Loading />;

  return (
    <div className="min-h-screen flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0">
      <div className="w-full">
        <h2 className="pb-4 text-lg font-medium">Formations</h2>
        <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
          <table className="md:table-auto table-fixed w-full overflow-hidden">
            <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left">
              <tr>
                <th className="px-4 py-3 font-semibold truncate">Title</th>
                <th className="px-4 py-3 font-semibold truncate hidden md:table-cell">Published</th>
                <th className="px-4 py-3 font-semibold truncate text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-500">
              {blogs.map((blog) => (
                <tr
                  key={blog._id}
                  className="border-b border-gray-500/20 cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    setSelectedBlog(blog);
                    setEditData({
                      title: blog.title || '',
                      content: blog.content || '',
                      imageUrl: blog.imageUrl || '',
                    });
                  }}
                >
                  <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                    <img
                      src={blog.imageUrl || '/default-thumbnail.jpg'}
                      alt="Blog"
                      className="w-16 h-16 object-cover rounded"
                    />
                    <span className="truncate">{blog.title}</span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => deleteBlog(blog._id)}
                      disabled={loadingDelete}
                      title="Delete Blog"
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

      {/* Edit Modal */}
      {selectedBlog && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-4"
          onClick={() => setSelectedBlog(null)}
        >
          <div
            className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 text-3xl font-semibold"
              onClick={() => setSelectedBlog(null)}
              aria-label="Close modal"
            >
              &times;
            </button>

            <div className="flex flex-col space-y-4">
              <img
                src={editData.imageUrl || '/default-thumbnail.jpg'}
                alt="Blog Thumbnail"
                className="w-28 h-28 rounded-lg object-cover shadow-md border border-gray-200 mx-auto"
              />

              <input
                type="text"
                name="title"
                value={editData.title}
                onChange={handleEditChange}
                className="w-full border border-gray-300 rounded p-2"
                placeholder="Blog Title"
              />

              <textarea
                name="content"
                value={editData.content}
                onChange={handleEditChange}
                rows={5}
                className="w-full border border-gray-300 rounded p-2"
                placeholder="Blog Content"
              />

              <input
                type="text"
                name="imageUrl"
                value={editData.imageUrl}
                onChange={handleEditChange}
                className="w-full border border-gray-300 rounded p-2"
                placeholder="Image URL"
              />

              <div className="flex justify-between pt-2">
                <button
                  onClick={() => deleteBlog(selectedBlog._id)}
                  disabled={loadingDelete}
                  className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded transition"
                >
                  {loadingDelete ? 'Deleting...' : 'Delete Blog'}
                </button>

                <button
                  onClick={updateBlog}
                  disabled={loadingUpdate}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded transition"
                >
                  {loadingUpdate ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBlogs;
