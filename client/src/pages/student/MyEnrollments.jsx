import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import Footer from '../../components/student/Footer';
import { toast } from 'react-toastify';

const MyEnrollments = () => {
  const { userData, navigate, backendUrl, getToken } = useContext(AppContext);
  const [purchases, setPurchases] = useState([]);

  const fetchUserPurchases = async () => {
    try {
      if (!userData?._id) return;

      const token = await getToken();
      const { data } = await axios.get(`${backendUrl}/api/user/purchase`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { userId: userData._id },
      });

      if (data.success) {
        setPurchases(data.data);
      } else {
        toast.error('Failed to fetch your purchases');
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          'Error fetching your purchases'
      );
    }
  };

  useEffect(() => {
    if (userData) {
      fetchUserPurchases();
    }
  }, [userData]);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow md:px-36 px-8 pt-10">
        <h1 className="text-2xl font-semibold">My Enrollments</h1>

        <table className="md:table-auto table-fixed w-full overflow-hidden border mt-10">
          <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left max-sm:hidden">
            <tr>
              <th className="px-4 py-3 font-semibold truncate">Course</th>
              <th className="px-4 py-3 font-semibold truncate max-sm:hidden">Price</th>
              <th className="px-4 py-3 font-semibold truncate">Status</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {purchases.map((purchase) => {
              const course = purchase.courseDetails || {}; // In case it's populated
              return (
                <tr key={purchase._id} className="border-b border-gray-500/20">
                  <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3">
                    <img
                      src={course.thumbnail || '/default-course.jpg'}
                      alt={course.title || 'Course'}
                      className="w-14 sm:w-24 md:w-28"
                    />
                    <div className="flex-1">
                      <p className="mb-1 max-sm:text-sm">
                        {course.title || 'Untitled Course'}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3 max-sm:hidden">${purchase.amountPaid}</td>
                  <td className="px-4 py-3 max-sm:text-right">
                    <button
                      onClick={() => navigate('/player/' + purchase.courseId)}
                      className="px-3 sm:px-5 py-1.5 sm:py-2 bg-blue-600 max-sm:text-xs text-white"
                    >
                      Enrolled
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </main>

      <Footer />
    </div>
  );
};

export default MyEnrollments;
