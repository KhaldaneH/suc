import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import Loading from '../../components/student/Loading';
import { FaWhatsapp } from "react-icons/fa";
import { MdEmail } from 'react-icons/md';

const StudentsEnrolled = () => {
  const { backendUrl, getToken, isEducator, currency } = useContext(AppContext);
  const [purchases, setPurchases] = useState(null);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const fetchPurchases = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(`${backendUrl}/api/user/purchase`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        setPurchases(data.data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Fetch purchases error:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch purchases');
    }
  };

  const openPurchaseDetails = (purchase) => {
    setSelectedPurchase(purchase);
    setShowDetailsModal(true);
  };

  useEffect(() => {
    if (isEducator) {
      fetchPurchases();
    }
  }, [isEducator]);

  // Helper function to parse and format date safely
  const formatDate = (rawDate) => {
    if (!rawDate) return 'Unknown date';

    let dateObj;
    if (typeof rawDate === 'string') {
      dateObj = new Date(rawDate);
    } else if (typeof rawDate === 'number') {
      // Check if timestamp is in seconds (less than 10^12)
      dateObj = rawDate < 1e12 ? new Date(rawDate * 1000) : new Date(rawDate);
    } else {
      return 'Unknown date';
    }

    if (isNaN(dateObj)) return 'Unknown date';

    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
console.log('Selected purchase enrolledAt:', selectedPurchase?.enrolledAt);
console.log('Type:', typeof selectedPurchase?.enrolledAt);
console.log('Date object:', new Date(selectedPurchase?.enrolledAt));

  return (
    <div className="min-h-screen flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0">
      <div className="flex flex-col items-center w-full overflow-hidden rounded-md bg-white border border-gray-200 shadow-sm">
        <table className="table-auto w-full overflow-hidden">
          <thead className="text-gray-900 border-b border-gray-200 text-sm text-left hidden sm:table-header-group">
            <tr>
              <th className="px-4 py-3 font-semibold text-center hidden sm:table-cell">#</th>
              <th className="px-4 py-3 font-semibold">Student</th>
              <th className="px-4 py-3 font-semibold hidden sm:table-cell">Course</th>
              <th className="px-4 py-3 font-semibold hidden sm:table-cell">Enrolled</th>
              <th className="px-4 py-3 font-semibold hidden md:table-cell">Amount</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-600">
            {purchases ? (
              purchases.map((purchase, index) => (
                <tr
                  key={purchase._id}
                  className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer sm:table-row flex flex-col sm:flex-row sm:items-center sm:space-x-0 p-3 sm:p-0"
                  onClick={() => openPurchaseDetails(purchase)}
                >
                  {/* Index - hidden on mobile */}
                  <td className="px-4 py-2 text-center hidden sm:table-cell">{index + 1}</td>

                  {/* Student (Always Visible) */}
                  <td className="px-0 sm:px-4 py-2">
                    <div className="flex items-center space-x-3">
                      <img
                        src={purchase.userDetails.imageUrl || '/default-avatar.png'}
                        alt={purchase.userDetails.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-800">{purchase.userDetails.name}</p>
                        <p className="text-xs text-gray-500">{purchase.userDetails.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Course - hidden on mobile */}
                  <td className="px-4 py-2 hidden sm:table-cell">
                    <div className="flex items-center space-x-2">
                      <img
                        src={purchase.courseDetails.thumbnail}
                        alt={purchase.courseDetails.title}
                        className="w-12 h-8 rounded object-cover hidden sm:block"
                      />
                      <span className="truncate">{purchase.courseDetails.title}</span>
                    </div>
                  </td>

                  {/* Enrolled Date - hidden on mobile */}
                  <td className="px-4 py-2 hidden sm:table-cell">
                    {formatDate(purchase.enrolledAt)}
                  </td>

                  {/* Amount - hidden on < md */}
                  <td className="px-4 py-2 hidden md:table-cell">
                    {purchase.amountPaid.toFixed(2)} {currency}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-8 text-center">
                  <Loading />
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* No data message */}
        {purchases?.length === 0 && (
          <div className="w-full py-12 text-center text-gray-500">
            No purchase records found
          </div>
        )}
      </div>

      {/* Purchase Details Modal */}

      {showDetailsModal && selectedPurchase && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-lg">
            <div className="p-4 sm:p-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-4 sm:mb-6 border-b pb-3">
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900">Purchase Details</h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-700 transition"
                  aria-label="Close modal"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-7 sm:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Student Info */}
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Student Information</h4>
                  <div className="flex items-center space-x-4 mb-5">
                    <img
                      src={selectedPurchase.userDetails.imageUrl || '/default-avatar.png'}
                      alt={selectedPurchase.userDetails.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border border-gray-300"
                    />
                    <div>
                      <p className="text-lg font-medium text-gray-900">{selectedPurchase.userDetails.name}</p>
                      <p className="text-sm text-gray-600">{selectedPurchase.userDetails.email}</p>
                    </div>
                  </div>
                  <p className="text-gray-700">
                    <span className="font-semibold text-gray-600">Phone:</span>{' '}
                    {selectedPurchase.userDetails.phoneNumber || 'N/A'}
                  </p>
                </div>

                {/* Course Info */}
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Course Information</h4>
                  <div className="flex items-start space-x-4 mb-5">
                    <img
                      src={selectedPurchase.courseDetails.thumbnail}
                      alt={selectedPurchase.courseDetails.title}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded object-cover border border-gray-300"
                    />
                    <div>
                      <p className="text-lg font-medium text-gray-900">{selectedPurchase.courseDetails.title}</p>
                    </div>
                  </div>
                  <p className="text-gray-900 font-semibold text-base sm:text-lg border-t pt-3 border-gray-300">
                    Price: {selectedPurchase.amountPaid.toFixed(2)} {currency}
                  </p>
                </div>
              </div>

              {/* Metadata */}
              <div className="mt-6 bg-gray-50 p-4 rounded-lg shadow-sm">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Purchase Metadata</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 text-sm">
                  <div>
                    <p className="font-medium text-gray-600">Enrollment Date</p>
                    <p>{formatDate(selectedPurchase.enrolledAt)}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-600">Status</p>
                    <p className="capitalize">{selectedPurchase.status}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
                <button
                  onClick={() =>
                    window.location.href = `mailto:${selectedPurchase.userDetails.email}?subject=Regarding your course enrollment`
                  }
                  className="flex items-center justify-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  <MdEmail size={20} />
                  Email
                </button>

                <button
                  onClick={() =>
                    window.open(`https://wa.me/${selectedPurchase.userDetails.phoneNumber}`, "_blank")
                  }
                  className="flex items-center justify-center gap-2 px-5 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
                >
                  <FaWhatsapp size={20} />
                  WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsEnrolled;
