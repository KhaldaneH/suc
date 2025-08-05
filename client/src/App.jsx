import React from 'react';
import { Routes, Route, useMatch } from 'react-router-dom';
import Navbar from './components/student/Navbar';
import Home from './pages/student/Home';
import CourseDetails from './pages/student/CourseDetails';
import CoursesList from './pages/student/CoursesList';
import About from './pages/student/About';
import Contact from './pages/student/Contact';
import Dashboard from './pages/educator/Dashboard';
import AddCourse from './pages/educator/AddCourse';
import MyCourses from './pages/educator/MyCourses';
import StudentsEnrolled from './pages/educator/StudentsEnrolled';
import Educator from './pages/educator/Educator';
import Player from './pages/student/Player';
import MyEnrollments from './pages/student/MyEnrollments';
import Loading from './components/student/Loading';
import ReviewApproval from './pages/educator/ReviewsAproval';
import ScrollToTop from './components/student/ScrollToTop';
import BlogsList from './pages/student/BlogList';
import AddBlog from './pages/educator/AddBlog';
import BlogDetail from './pages/student/BlogDetail';
import MyBlogs from './pages/educator/MyBlogs';

import { ToastContainer } from 'react-toastify';
import 'quill/dist/quill.snow.css';
import 'react-toastify/dist/ReactToastify.css';

import { useUser, useAuth } from '@clerk/clerk-react';

const App = () => {
  const isEducatorRoute = useMatch('/educator/*');
  const { isLoaded, isSignedIn, user } = useUser();

  // Wait for Clerk to finish loading auth state
  if (!isLoaded) {
    return <Loading />;
  }

  // Optionally you can guard routes here based on isSignedIn

  return (
    <div className="text-default min-h-screen bg-white">
      <ToastContainer />
       <ScrollToTop />
      {!isEducatorRoute && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/formation" element={<BlogsList />} />
        <Route path="/formation/:id" element={<BlogDetail />} />
        <Route path="/course/:id" element={<CourseDetails />} />
        <Route path="/course-list" element={<CoursesList />} />
        <Route path="/course-list/:input" element={<CoursesList />} />
        <Route path="/my-enrollments" element={<MyEnrollments />} />
        <Route path="/player/:courseId" element={<Player />} />
        <Route path="/loading/:path" element={<Loading />} />
        <Route path="/educator" element={<Educator />}>
        <Route path="/educator" element={<Dashboard />} />
        <Route path="add-course" element={<AddCourse />} />
        <Route path="my-courses" element={<MyCourses />} />
        <Route path="blogs" element={<MyBlogs />} />
        <Route path="reviews" element={<ReviewApproval />} />
        <Route path="student-enrolled" element={<StudentsEnrolled />} />
        <Route path="add-blog" element={<AddBlog />} />


        </Route>
      </Routes>
    </div>
  );
};

export default App;
