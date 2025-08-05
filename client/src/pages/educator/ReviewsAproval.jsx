import React, { useEffect, useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loading from '../../components/student/Loading';
import { Trash2, CheckCircle2, X } from 'lucide-react';

const ReviewApproval = () => {
  const { backendUrl, token } = useContext(AppContext);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [selectedReview, setSelectedReview] = useState(null);

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/admin/reviews`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setReviews(data.reviews);
      } else {
        toast.error(data.message || 'Failed to load reviews');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch reviews');
      console.error('Fetch Reviews Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const approveReview = async (reviewId) => {
    try {
      const { data } = await axios.put(
        `${backendUrl}/api/user/admin/reviews/approve/${reviewId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success('Review approved successfully');
        setSelectedReview(null);
        fetchReviews();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to approve review');
      console.error('Approve Review Error:', error);
    }
  };

  const deleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;

    try {
      const { data } = await axios.delete(`${backendUrl}/api/user/admin/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        toast.success('Review deleted successfully');
        setSelectedReview(null);
        fetchReviews();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete review');
      console.error('Delete Review Error:', error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen p-4 md:p-8">
      <h2 className="text-2xl font-semibold mb-6">Review Management</h2>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto border rounded-md shadow">
        <table className="w-full table-auto">
          <thead className="bg-gray-100 text-gray-700 text-left">
            <tr>
              <th className="p-3">User</th>
              <th className="p-3">Comment</th>
              <th className="p-3">Rating</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <tr key={review._id} className="border-b">
                  <td className="p-3">
                    {review.user?.name ? (
                      <>
                        <div className="font-medium">{review.user.name}</div>
                        <div className="text-sm text-gray-500">{review.user.email}</div>
                      </>
                    ) : (
                      'Unknown'
                    )}
                  </td>
                  <td className="p-3">{review.content}</td>
                  <td className="p-3">{review.rating} / 5</td>
                  <td className="p-3">
                    {review.approved ? (
                      <span className="text-green-600">Approved</span>
                    ) : (
                      <span className="text-yellow-600">Pending</span>
                    )}
                  </td>
                  <td className="p-3 flex justify-center items-center gap-4">
                    {!review.approved && (
                      <button
                        onClick={() => approveReview(review._id)}
                        className="text-green-600 hover:text-green-800"
                        title="Approve Review"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteReview(review._id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete Review"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-400">
                  No reviews found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile List */}
      <div className="md:hidden">
        {reviews.length > 0 ? (
          <ul className="space-y-3">
            {reviews.map((review) => (
              <li
                key={review._id}
                onClick={() => setSelectedReview(review)}
                className="p-4 border rounded cursor-pointer bg-white shadow-sm hover:bg-gray-50"
              >
                <div className="font-medium">{review.user?.name || 'Unknown'}</div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-6 text-gray-400">No reviews found.</div>
        )}
      </div>

      {/* Modal for review details */}
      {selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full shadow-lg p-6 relative">
            <button
              onClick={() => setSelectedReview(null)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-xl font-semibold mb-3">{selectedReview.user?.name || 'Unknown User'}</h3>
            <p className="mb-2 text-gray-600">
              <strong>Email: </strong> {selectedReview.user?.email || 'N/A'}
            </p>
            <p className="mb-4 whitespace-pre-wrap">{selectedReview.content}</p>
            <p className="mb-4">
              <strong>Rating:</strong> {selectedReview.rating} / 5
            </p>
            <p className="mb-6">
              <strong>Status:</strong>{' '}
              {selectedReview.approved ? (
                <span className="text-green-600 font-semibold">Approved</span>
              ) : (
                <span className="text-yellow-600 font-semibold">Pending</span>
              )}
            </p>

            <div className="flex justify-end gap-4">
              {!selectedReview.approved && (
                <button
                  onClick={() => approveReview(selectedReview._id)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Approve
                </button>
              )}
              <button
                onClick={() => deleteReview(selectedReview._id)}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                <Trash2 className="w-5 h-5" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewApproval;
