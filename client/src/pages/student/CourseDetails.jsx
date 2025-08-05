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

  // Currency conversion rate (example: 1 MAD = 0.10 USD)
  // You may want to fetch live rates or update manually
  const convertMadToUsd = (madAmount) => {
    const rate = 0.10; // 1 MAD = 0.10 USD (example)
    return (madAmount * rate).toFixed(2);
  };

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

  // Initialize PayPal buttons when modal is shown
  useEffect(() => {
    if (
      showEnrollForm &&
      window.paypal &&
      courseData &&
      userData &&
      (formData.phoneNumber && (formData.name || userData.name))
    ) {
      // Clear container before rendering to avoid duplicates
      const container = document.getElementById('paypal-button-container');
      if (container) container.innerHTML = '';

      // Calculate price in MAD after discount
      const priceMad =
        courseData.coursePrice - (courseData.discount * courseData.coursePrice) / 100;

      // Convert to USD for PayPal
      const priceUsd = convertMadToUsd(priceMad);

      window.paypal
        .Buttons({
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: priceUsd,
                    currency_code: 'USD', // must be USD because we converted
                  },
                  description: courseData.courseTitle,
                },
              ],
            });
          },
          onApprove: async (data, actions) => {
            try {
              const details = await actions.order.capture();
              const token = await getToken();

              const res = await axios.post(
                `${backendUrl}/api/user/purchase`,
                {
                  courseId: courseData._id,
                  name: formData.name || userData.name,
                  phoneNumber: formData.phoneNumber,
                  paypalOrderId: data.orderID,
                },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              if (res.data.success) {
                toast.success('Enrollment successful via PayPal!');
                setShowEnrollForm(false);
                setIsAlreadyEnrolled(true);
                fetchCourseData();
              } else {
                toast.error(res.data.message || 'Enrollment failed');
              }
            } catch (err) {
              console.error('PayPal enrollment error', err);
              toast.error('Error finalizing enrollment.');
            }
          },
          onError: (err) => {
            console.error('PayPal error', err);
            toast.error('Payment could not be processed.');
          },
        })
        .render('#paypal-button-container');
    }
  }, [
    showEnrollForm,
    courseData,
    userData,
    formData.phoneNumber,
    formData.name,
    currency,
    getToken,
    backendUrl,
  ]);

  const enrollCourse = () => {
    if (!userData) {
      toast.warn('Please login to enroll');
      return;
    }
    if (isAlreadyEnrolled) {
      toast.warn('You are already enrolled in this course');
      return;
    }
    setShowEnrollForm(true);
  };

  // Navigate to player page
  const goToPlayer = () => {
    navigate(`/player/${id}`);
  };

  if (!courseData) return <Loading />;

  return (
    <>
      <div className="relative md:px-36 px-6 md:pt-20 pt-12 min-h-screen flex flex-col md:flex-row gap-10 text-gray-700">
        <section className="max-w-5xl mx-auto px-6 py-10 bg-white rounded-3xl shadow-2xl">
          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
            {courseData.courseTitle}
          </h1>

          {/* Subtitle */}
          <p className="text-gray-500 text-sm md:text-base max-w-2xl mb-6">
           Payez en ligne en toute sécurité ou contactez-nous directement pour finaliser votre inscription.
            <br />Nous restons à votre écoute pour toute question ou assistance.
          </p>

          {/* Rating Section */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="flex items-center space-x-3">
              <span className="text-4xl font-bold text-gray-900">
                {calculateRating(courseData).toFixed(1)}
              </span>
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <img
                    key={i}
                    src={
                      i < Math.floor(calculateRating(courseData))
                        ? assets.star
                        : assets.star_blank
                    }
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
                const count = courseData.courseRatings.filter(
                  (r) => Math.round(r.rating) === star
                ).length;
                const total = courseData.courseRatings.length || 1;
                const percent = (count / total) * 100;

                return (
                  <div
                    key={star}
                    className="flex items-center gap-2 text-xs text-gray-600"
                  >
                    <span className="w-4 font-medium">{star}</span>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-2 bg-gray-800 rounded-full"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                    <span className="w-10 text-right">{Math.round(percent)}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Course Structure */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Structure</h2>

            <div className="space-y-6">
              {courseData.courseContent.map((chapter, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-xl border border-gray-200 p-6 shadow-sm"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {chapter.chapterTitle}
                    </h3>
                   
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
                          {/* 
                          <span>
                            {humanizeDuration(lecture.lectureDuration * 60 * 1000, {
                              units: ['h', 'm'],
                              round: true,
                            })}
                          </span>
                          */}
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
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Description</h3>
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
                {(courseData.coursePrice -
                  (courseData.discount * courseData.coursePrice) / 100
                ).toFixed(2)}{' '}
                MAD
              </span>
            </div>

            <div className="flex items-center gap-6 text-gray-600 text-sm md:text-base mb-6">
              <div className="flex items-center gap-1">
                <img src={assets.star} alt="Rating" className="w-5 h-5" />
                <span>{calculateRating(courseData).toFixed(1)}</span>
              </div>
              <div className="w-px h-5 bg-gray-400"></div>
             {/*  <div className="flex items-center gap-1">
                <img
                  src={assets.time_clock_icon}
                  alt="Duration"
                  className="w-5 h-5"
                />
                <span>{calculateCourseDuration(courseData)}</span>
              </div> 
              <div className="w-px h-5 bg-gray-400"></div>*/}
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
                voir l'article
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
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-xl w-full max-w-lg shadow-xl p-4 sm:p-6 relative max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-gray-900 text-center">
              Complete Enrollment
            </h3>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                // No manual submit, payment only
              }}
              className="space-y-4 sm:space-y-5"
            >
              {/* Full Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
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

              {/* Phone Number */}
              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
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

              {/* Enrollment Summary */}
              <div className="bg-gray-50 p-4 rounded border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">
                  Enrollment Summary
                </h4>
                <div className="space-y-2 text-gray-700 text-sm">
                  <div className="flex justify-between">
                    <span>Course:</span>
                    <span className="font-medium">{courseData.courseTitle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Price:</span>
                    <span>
                      {courseData.coursePrice.toFixed(2)} MAD
                    </span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-gray-300 font-semibold text-gray-900">
                    <span>Total Price:</span>
                    <span>
                      {(courseData.coursePrice -
                        (courseData.discount * courseData.coursePrice) / 100
                      ).toFixed(2)}{' '}
                      MAD
                    </span>
                  </div>
                </div>
              </div>

              {/* PayPal Button */}
              <div id="paypal-button-container" className="pt-2 sm:pt-4" />

              {/* Cancel Button */}
              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setShowEnrollForm(false)}
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded border border-gray-300 hover:bg-gray-100 transition font-medium"
                >
                  Cancel
                </button>
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
