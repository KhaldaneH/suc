import React, { useContext, useEffect, useState } from 'react';
import { assets } from '../../assets/assets';
import { Link, useLocation } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { useClerk, UserButton, useUser, SignIn, SignUp } from '@clerk/clerk-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { LogIn, UserPlus } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const { backendUrl, navigate } = useContext(AppContext);
  const { openSignIn, openSignUp } = useClerk();
  const { user } = useUser();
  const [userRole, setUserRole] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const saveUserToDB = async () => {
      if (!user) return;

      try {
        const response = await axios.post(`${backendUrl}/api/user/data`, {
          clerkId: user.id,
          email:
            user.primaryEmailAddress?.emailAddress || user.emailAddresses[0]?.emailAddress,
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          imageUrl: user.imageUrl || 'https://example.com/default-avatar.png',
        });

        setUserRole(response.data.user?.role || 'user');
      } catch (error) {
        console.error('Save user error:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        toast.error(error.response?.data?.message || 'Failed to save user profile');
      }
    };

    saveUserToDB();
  }, [user, backendUrl]);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <>
      <div className="flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 border-b border-gray-300 py-4 bg-white">
        {/* Logo */}
        <div className="flex-shrink-0">
          <img
            onClick={() => {
              navigate('/');
              closeSidebar();
            }}
            src={assets.logo}
            alt="Logo"
            className="h-14 object-contain cursor-pointer"
          />
        </div>

        {/* Links (Desktop) */}
        <div className="hidden md:flex flex-1 justify-center space-x-12 text-base md:text-lg font-semibold text-gray-700 tracking-wide">
          <Link to="/" className="hover:text-blue-600 transition">Accueil</Link>
          <Link to="/about" className="hover:text-blue-600 transition">À propos</Link>
          <Link to="/formation" className="hover:text-blue-600 transition">Formations</Link>
          <Link to="/course-list" className="hover:text-blue-600 transition">Articles</Link>
          <Link to="/contact" className="hover:text-blue-600 transition">Contact</Link>

        </div>

        {/* User Buttons (Desktop) */}
        <div className="hidden md:flex items-center gap-5">
          {user ? (
            <>
              {userRole === 'admin' && (
                <button
                  onClick={() => {
                    navigate('/educator');
                    closeSidebar();
                  }}
                  className="hover:text-blue-600 text-gray-700 transition"
                >
                  Admin Dashboard
                </button>
              )}
              <Link to="/my-enrollments" className="hover:text-blue-600 text-gray-700 transition" onClick={closeSidebar}>
                Mes formations
              </Link>
              <UserButton />
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  openSignIn();
                  closeSidebar();
                }}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition"
              >
                <LogIn className="w-5 h-5" /> Se connecter
              </button>
              <button
                onClick={() => {
                  openSignUp();
                  closeSidebar();
                }}
                className="flex items-center gap-2 text-white bg-blue-600 px-4 py-2 rounded-full hover:bg-blue-700 transition"
              >
                <UserPlus className="w-5 h-5" /> Registre
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center">
          <button onClick={toggleSidebar} aria-label="Toggle Menu" className="focus:outline-none">
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {sidebarOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div onClick={closeSidebar} className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden" />
      )}

      {/* Sidebar Menu (Mobile) */}
      <aside
        className={`fixed top-0 right-0 bottom-0 w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'} md:hidden`}
      >
        <div className="flex flex-col h-full p-6 space-y-6">
          {/* Close */}
          <button onClick={closeSidebar} aria-label="Close Menu" className="self-end mb-4 focus:outline-none">
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* User Area */}
          <div className="mb-4 border-b border-gray-300 pb-4">
            {user ? (
              <>
                <UserButton />
                <br /><br />
                {userRole === 'admin' && (
                  <button
                    onClick={() => {
                      navigate('/educator');
                      closeSidebar();
                    }}
                    className="block mb-2 text-left text-gray-700 hover:underline"
                  >
                    Admin Dashboard
                  </button>
                )}
                <Link to="/my-enrollments" onClick={closeSidebar} className="block mt-3 text-gray-700 hover:underline">
                  Mes formations
                </Link>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    openSignIn();
                    closeSidebar();
                  }}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition mb-3"
                >
                  <LogIn className="w-5 h-5" /> Se connecter
                </button>
                <button
                  onClick={() => {
                    openSignUp();
                    closeSidebar();
                  }}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition"
                >
                  <UserPlus className="w-5 h-5" /> Registre
                </button>
              </>
            )}
          </div>

          {/* Mobile Navigation Links */}
          <nav className="flex flex-col space-y-4 text-base font-semibold text-gray-700 tracking-wide">
            <Link to="/" onClick={closeSidebar} className="hover:text-blue-600 transition">Accueil</Link>
            <Link to="/about" onClick={closeSidebar} className="hover:text-blue-600 transition">À propos</Link>
            <Link to="/formation" className="hover:text-blue-600 transition">Formations</Link>
            <Link to="/course-list" onClick={closeSidebar} className="hover:text-blue-600 transition">Articles</Link>
            <Link to="/contact" onClick={closeSidebar} className="hover:text-blue-600 transition">Contact</Link>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Navbar;
