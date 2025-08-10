import React, { useContext, useEffect, useState } from 'react';
import { assets } from '../../assets/assets';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loading from '../../components/student/Loading';
import { Trash2 } from 'lucide-react';

const Dashboard = () => {
  const { backendUrl, isEducator, currency, getToken } = useContext(AppContext);

  const [dashboardData, setDashboardData] = useState(null);
  const [users, setUsers] = useState([]);
  const [totalPurchases, setTotalPurchases] = useState(0);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchDashboardData = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(`${backendUrl}/api/educator/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setDashboardData(data.dashboardData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(`${backendUrl}/api/user/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        const filteredUsers = data.users.filter((user) => user.role !== 'admin');
        setUsers(filteredUsers);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Failed to fetch users: ' + error.message);
    }
  };

  const fetchPurchases = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(`${backendUrl}/api/user/purchase`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page: 1, limit: 1 }, // just 1 item needed, total comes in pagination
      });

      if (data.success) {
        setTotalPurchases(data.pagination?.total || 0);
      } else {
        toast.error('Failed to fetch purchases count');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to fetch purchases count');
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      setLoadingDelete(true);
      const token = await getToken();
      const { data } = await axios.delete(`${backendUrl}/api/user/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        toast.success('User deleted successfully');
        fetchUsers();
        setSelectedUser(null);
      } else {
        toast.error(data.message || 'Failed to delete user');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to delete user');
    } finally {
      setLoadingDelete(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    fetchUsers();
    fetchPurchases();
  }, []);

  if (!dashboardData) return <Loading />;

  return (
    <div className="min-h-screen flex flex-col items-start justify-between gap-8 md:p-8 md:pb-0 p-4 pt-8 pb-0">
      <div className="space-y-5 w-full">
        {/* STATS */}
        <div className="flex flex-wrap gap-5 items-center">
          <div className="flex items-center gap-3 shadow-card border border-blue-500 p-4 w-56 rounded-md">
            <img src={assets.patients_icon} alt="users_icon" />
            <div>
              <p className="text-2xl font-medium text-gray-600">{users.length}</p>
              <p className="text-base text-gray-500">Total Users</p>
            </div>
          </div>

          <div className="flex items-center gap-3 shadow-card border border-blue-500 p-4 w-56 rounded-md">
            <img src={assets.appointments_icon} alt="courses_icon" />
            <div>
              <p className="text-2xl font-medium text-gray-600">{dashboardData.totalCourses}</p>
              <p className="text-base text-gray-500">Total Courses</p>
            </div>
          </div>

          <div className="flex items-center gap-3 shadow-card border border-blue-500 p-4 w-56 rounded-md">
            <img src={assets.earning_icon} alt="purchases_icon" />
            <div>
              <p className="text-2xl font-medium text-gray-600">{totalPurchases}</p>
              <p className="text-base text-gray-500">Total Purchases</p>
            </div>
          </div>
        </div>

        {/* ALL USERS */}
        <div>
          <h2 className="pb-4 text-lg font-medium">All Users</h2>
          <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
            <table className="table-fixed md:table-auto w-full overflow-hidden">
              <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold text-center hidden sm:table-cell">#</th>
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold hidden sm:table-cell">Email</th>
                  <th className="px-4 py-3 font-semibold hidden sm:table-cell">Joined On</th>
                  <th className="px-4 py-3 font-semibold text-center hidden sm:table-cell">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-500">
                {users.map((user, index) => (
                  <tr
                    key={user._id}
                    className="border-b border-gray-500/20 cursor-pointer hover:bg-gray-100"
                    onClick={() => setSelectedUser(user)}
                  >
                    <td className="px-4 py-3 text-center hidden sm:table-cell">{index + 1}</td>
                    <td className="md:px-4 px-2 py-3 flex items-center space-x-3">
                      <img
                        src={user.imageUrl || assets.default_profile}
                        alt="User"
                        className="w-9 h-9 rounded-full"
                      />
                      <span className="truncate">{user.name}</span>
                    </td>
                    <td className="px-4 py-3 truncate hidden sm:table-cell">{user.email}</td>
                    <td className="px-4 py-3 truncate hidden sm:table-cell">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td
                      className="px-4 py-3 text-center hidden sm:table-cell"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => deleteUser(user._id)}
                        disabled={loadingDelete}
                        className="text-red-600 hover:underline"
                        title="Delete User"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* User Detail Modal */}
        {selectedUser && (
          <div
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-4"
            onClick={() => setSelectedUser(null)}
          >
            <div
              className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative transform transition-transform scale-100"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 transition-colors text-3xl font-semibold leading-none"
                onClick={() => setSelectedUser(null)}
                aria-label="Close modal"
              >
                &times;
              </button>

              {/* Content */}
              <div className="flex flex-col items-center space-y-5">
                <img
                  src={selectedUser.imageUrl || assets.default_profile}
                  alt="User Avatar"
                  className="w-28 h-28 rounded-full object-cover shadow-md border border-gray-200"
                />
                <h2 className="text-3xl font-bold text-gray-800">{selectedUser.name}</h2>
                <div className="w-full space-y-3 text-gray-700 text-base">
                  <p>
                    <span className="font-semibold text-gray-900">Email:</span> {selectedUser.email}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-900">Joined On:</span>{' '}
                    {new Date(selectedUser.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => {
                    if (window.confirm(`Are you sure you want to delete ${selectedUser.name}?`)) {
                      deleteUser(selectedUser._id);
                    }
                  }}
                  disabled={loadingDelete}
                  className="text-red-600"
                  title="Delete User"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
