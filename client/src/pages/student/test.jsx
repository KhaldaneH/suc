import React, { useContext, useEffect, useState } from 'react';
import Footer from '../../components/student/Footer';
import { assets } from '../../assets/assets';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import humanizeDuration from 'humanize-duration';
import YouTube from 'react-youtube';
import { useAuth } from '@clerk/clerk-react';
import Loading from '../../components/student/Loading';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";


const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [courseData, setCourseData] = useState(null);
  const [playerData, setPlayerData] = useState(null);
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false);
  const [showEnrollForm, setShowEnrollForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkingEnrollment, setCheckingEnrollment] = useState(false);
  const [openSections, setOpenSections] = useState({});
  const [paypalLoading, setPaypalLoading] = useState(false);


  const {
    backendUrl,
    currency,
    userData,
    calculateChapterTime,
    calculateCourseDuration,
    calculateRating,
    calculateNoOfLectures,
  } = useContext(AppContext);
  const { getToken } = useAuth();

  // Fetch course data
  const fetchCourseData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/course/${id}`);
      if (data.success) {
        setCourseData(data.courseData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Check enrollment status
  const checkEnrollmentFromApi = async () => {
    if (!userData) {
      setIsAlreadyEnrolled(false);
      return;
    }
    try {
      setCheckingEnrollment(true);
      const token = await getToken();
      const { data } = await axios.post(
        `${backendUrl}/api/user/is-enrolled`,
        { courseId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsAlreadyEnrolled(data.success && data.isEnrolled);
    } catch (error) {
      console.error('Error checking enrollment:', error);
      setIsAlreadyEnrolled(false);
    } finally {
      setCheckingEnrollment(false);
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, [id]);

  useEffect(() => {
    checkEnrollmentFromApi();
  }, [userData, id]);

  const toggleSection = (index) => {
    setOpenSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const enrollCourse = async () => {
  if (!userData) {
    toast.warn('Please login to enroll');
    return;
  }
  if (isAlreadyEnrolled) {
    toast.warn('You are already enrolled in this course');
    return;
  }

  // For free courses, show the form directly
  if (courseData.coursePrice <= 0) {
    setShowEnrollForm(true);
    return;
  }

  // For paid courses, show payment options
  setShowEnrollForm(true);
};


// Add this new function for PayPal payment
const handlePayPalPayment = async (data, actions) => {
  try {
    setPaypalLoading(true);
    const token = await getToken();
    
    const response = await axios.post(
      `${backendUrl}/api/user/paypal/create-order`,
      {
        courseId: courseData._id,
        userId: userData._id,
        courseDetails: {
          title: courseData.courseTitle,
          thumbnail: courseData.courseThumbnail,
          educator: {
            id: courseData.educator._id,
            name: courseData.educator.name
          },
          price: courseData.coursePrice,
          discount: courseData.discount
        },
        userDetails: {
          name: formData.name || userData.name,
          email: userData.email,
          imageUrl: userData.imageUrl,
          phoneNumber: formData.phoneNumber
        },
        amount: courseData.coursePrice * (1 - courseData.discount / 100)
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    return response.data.paypalOrderId;
  } catch (error) {
    toast.error('Failed to create PayPal order');
    console.error('PayPal error:', error);
    throw error;
  } finally {
    setPaypalLoading(false);
  }
};

// Add this new function for PayPal approval
const onPayPalApprove = async (data, actions) => {
  try {
    setPaypalLoading(true);
    const token = await getToken();
    
    const response = await axios.post(
      `${backendUrl}/api/user/paypal/capture-order/${data.orderID}/${data.purchaseId}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    if (response.data.status === 'success') {
      toast.success('Payment successful! You are now enrolled.');
      setIsAlreadyEnrolled(true);
      setShowEnrollForm(false);
    }
    return response.data;
  } catch (error) {
    toast.error('Payment failed. Please try again.');
    console.error('PayPal capture error:', error);
    throw error;
  } finally {
    setPaypalLoading(false);
  }
};

  const submitEnrollment = async () => {
    if (!formData.phoneNumber || (!formData.name && !userData?.name)) {
      toast.warn('Please fill in all required fields');
      return;
    }
    try {
      setIsSubmitting(true);
      const token = await getToken();

      const { data } = await axios.post(
        `${backendUrl}/api/user/purchase`,
        {
          courseId: courseData._id,
          name: formData.name || userData?.name,
          phoneNumber: formData.phoneNumber,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (data.success) {
        toast.success('Enrollment successful!');
        setShowEnrollForm(false);
        setIsAlreadyEnrolled(true);
        fetchCourseData();
      } else {
        toast.error(data.message || 'Enrollment failed');
      }
    } catch (error) {
      console.error('Enrollment error:', error);
      toast.error(error.response?.data?.message || 'Enrollment failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Navigate to player page
  const goToPlayer = () => {
    navigate(`/player/${id}`);
  };

  if (!courseData) return <Loading />;

  return (
    <>
   
      <div className="relative  md:px-36 px-6 md:pt-20 pt-12 min-h-screen flex flex-col md:flex-row gap-10 text-gray-700">
<section className="max-w-5xl mx-auto px-6 py-10 bg-white rounded-3xl shadow-2xl">
  {/* Title */}
  <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
    {courseData.courseTitle}
  </h1>

  {/* Subtitle */}
  <p className="text-gray-500 text-sm md:text-base max-w-2xl mb-6">
    Master React and build complex web applications with confidence. Learn advanced techniques, state management, and performance optimization.
  </p>

  {/* Rating Section */}
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
    <div className="flex items-center space-x-3">
      <span className="text-4xl font-bold text-gray-900">{calculateRating(courseData).toFixed(1)}</span>
      <div className="flex space-x-1">
        {[...Array(5)].map((_, i) => (
          <img
            key={i}
            src={i < Math.floor(calculateRating(courseData)) ? assets.star : assets.star_blank}
            alt="star"
            className="w-5 h-5"
          />
        ))}
        <span className="text-sm text-gray-500">
        ({courseData.courseRatings.length.toLocaleString()})
      </span>
      </div>
      
    </div>

    {/* Rating Bars */}
    <div className="space-y-1 w-full md:w-2/3">
      {[5, 4, 3, 2, 1].map((star) => {
        const count = courseData.courseRatings.filter(r => Math.round(r.rating) === star).length;
        const total = courseData.courseRatings.length || 1;
        const percent = (count / total) * 100;

        return (
          <div key={star} className="flex items-center gap-2 text-xs text-gray-600">
            <span className="w-4 font-medium">{star}</span>
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-2 bg-gray-800 rounded-full" style={{ width: `${percent}%` }}></div>
            </div>
            <span className="w-10 text-right">{Math.round(percent)}%</span>
          </div>
        );
      })}
    </div>
  </div>

  {/* Course Structure */}
  <div className="mt-12">
    <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Structure</h2>

    <div className="space-y-6">
      {courseData.courseContent.map((chapter, index) => (
        <div
          key={index}
          className="bg-gray-50 rounded-xl border border-gray-200 p-6 shadow-sm"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{chapter.chapterTitle}</h3>
            <span className="text-sm text-gray-500">
              {chapter.chapterContent.length} lecture{chapter.chapterContent.length > 1 ? 's' : ''} — {calculateChapterTime(chapter)}
            </span>
          </div>

          <ul className="space-y-2">
            {chapter.chapterContent.map((lecture, i) => (
              <li
                key={i}
                className="flex justify-between items-center text-sm text-gray-700"
              >
                <div className="flex items-center gap-2">
                  <img src={assets.play_icon} alt="play" className="w-4 h-4" />
                  <span>{lecture.lectureTitle}</span>
                </div>
                

                <div className="flex items-center gap-3 text-xs text-gray-500">
                  {lecture.isPreviewFree && (
                    <button
                      onClick={() =>
                        setPlayerData({
                          videoId: lecture.lectureUrl.split('/').pop(),
                        })
                      }
                      className="text-indigo-600 hover:underline font-medium"
                    >
                      Preview
                    </button>
                  )}
                  <span>
                    {humanizeDuration(lecture.lectureDuration * 60 * 1000, {
                      units: ['h', 'm'],
                      round: true,
                    })}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </div>

  {/* Full Description */}
  <div className="mt-14">
    <h3 className="text-2xl font-bold text-gray-900 mb-4">Course Description</h3>
    <p
      className="prose prose-indigo max-w-none text-gray-700 text-base"
      dangerouslySetInnerHTML={{ __html: courseData.courseDescription }}
    ></p>
  </div>
</section>



        {/* Right Sidebar */}
        <aside className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden sticky top-20 self-start z-10">
          {/* Video or Thumbnail */}
          <div className="w-full bg-black">
            {playerData ? (
              <YouTube
                videoId={playerData.videoId}
                opts={{ playerVars: { autoplay: 1 } }}
                iframeClassName="w-full aspect-video"
              />
            ) : (
              <img
                src={courseData.courseThumbnail}
                alt={courseData.courseTitle}
                className="w-full h-56 object-cover"
              />
            )}
          </div>

          {/* Pricing and Info */}
          <div className="p-6">
            <div className="flex items-center gap-4 mb-3">
              <span className="text-4xl font-extrabold text-darkblue-200">
                
                {(courseData.coursePrice - (courseData.discount * courseData.coursePrice) / 100).toFixed(2)} {currency}
              </span>
             
            </div>

            <div className="flex items-center gap-6 text-gray-600 text-sm md:text-base mb-6">
              <div className="flex items-center gap-1">
                <img src={assets.star} alt="Rating" className="w-5 h-5" />
                <span>{calculateRating(courseData).toFixed(1)}</span>
              </div>
              <div className="w-px h-5 bg-gray-400"></div>
              <div className="flex items-center gap-1">
                <img src={assets.time_clock_icon} alt="Duration" className="w-5 h-5" />
                <span>{calculateCourseDuration(courseData)}</span>
              </div>
              <div className="w-px h-5 bg-gray-400"></div>
              <div className="flex items-center gap-1">
                <img src={assets.lesson_icon} alt="Lessons" className="w-5 h-5" />
                <span>{calculateNoOfLectures(courseData)} lessons</span>
              </div>
            </div>

            {/* Enroll or Go to Player Button */}
            {checkingEnrollment ? (
              <button
                disabled
                className="w-full py-3 rounded bg-gray-400 text-white font-semibold cursor-not-allowed"
              >
                Checking enrollment...
              </button>
            ) : isAlreadyEnrolled ? (
              <button
                onClick={goToPlayer}
                className="w-full py-3 rounded bg-green-600 text-white font-semibold hover:bg-green-700 transition"
                aria-label="Go to course player"
              >
                Go to Player
              </button>
            ) : (
              <button
                onClick={enrollCourse}
                className="w-full py-3 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                aria-label="Enroll in course"
              >
                Enroll Now
              </button>
            )}
          </div>
        </aside>
      </div>

      {/* Enrollment Form Modal */}
      {showEnrollForm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full shadow-lg p-6 md:p-8 relative">
            <h3 className="text-2xl font-semibold mb-6 text-gray-900">Complete Enrollment</h3>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                submitEnrollment();
              }}
              className="space-y-5"
            >
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name || userData?.name || ''}
                  onChange={handleInputChange}
                  className="w-full rounded border border-gray-300 p-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full rounded border border-gray-300 p-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your phone number"
                  pattern="[0-9]{10,15}"
                  title="Please enter 10-15 digit phone number"
                  required
                />
              </div>

              <div className="bg-gray-50 p-4 rounded border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Enrollment Summary</h4>
                <div className="space-y-2 text-gray-700 text-sm">
                  <div className="flex justify-between">
                    <span>Course:</span>
                    <span className="font-medium">{courseData.courseTitle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Price:</span>
                    <span>
                      {courseData.coursePrice.toFixed(2)} {currency}
                    </span>
                  </div>
                  
                  <div className="flex justify-between pt-3 border-t border-gray-300 font-semibold text-gray-900">
                    <span>Total Price:</span>
                    <span>
                      {(courseData.coursePrice - (courseData.discount * courseData.coursePrice) / 100).toFixed(2)} {currency}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
  <button
    type="button"
    onClick={() => setShowEnrollForm(false)}
    disabled={isSubmitting || paypalLoading}
    className="px-5 py-2 rounded border border-gray-300 hover:bg-gray-100 transition font-medium"
  >
    Cancel
  </button>
  
  {courseData.coursePrice > 0 ? (
    <div className="w-full">
      <PayPalScriptProvider 
        options={{ 
          "client-id": "AZJeJmKGdfPEnHd2baaIi-caazCK34pcXGy9Y57xjN-iAc-HIB5QDgnT9CUF827_DPepRjjPL_gC3xP3",
          currency: currency,
          "disable-funding": "credit,card"
        }}
      >
        <PayPalButtons
          style={{ layout: "horizontal" }}
          createOrder={(data, actions) => handlePayPalPayment(data, actions)}
          onApprove={(data, actions) => onPayPalApprove(data, actions)}
          onError={(err) => {
            toast.error("PayPal error occurred");
            console.error("PayPal error:", err);
          }}
          disabled={isSubmitting || paypalLoading || !formData.phoneNumber || (!formData.name && !userData?.name)}
        />
      </PayPalScriptProvider>
    </div>
  ) : (
    <button
      type="submit"
      disabled={isSubmitting || !formData.phoneNumber || (!formData.name && !userData?.name)}
      className={`px-5 py-2 rounded text-white font-semibold transition ${
        isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
      }`}
    >
      {isSubmitting ? (
        <span className="flex items-center justify-center gap-2">
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Processing...
        </span>
      ) : (
        'Confirm Enrollment'
      )}
    </button>
  )}
</div>
            </form>
          </div>
        </div>
      )}
<br /><br />
      <Footer />
    </>
  );
};

export default CourseDetails;
