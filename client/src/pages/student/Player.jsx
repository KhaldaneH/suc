import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';
import { useParams } from 'react-router-dom';
import humanizeDuration from 'humanize-duration';
import axios from 'axios';
import { toast } from 'react-toastify';
import Rating from '../../components/student/Rating';
import Footer from '../../components/student/Footer';
import Loading from '../../components/student/Loading';
import { AiFillFilePdf } from 'react-icons/ai';

// Helper: Extract Google Drive file ID
function extractGoogleDriveFileId(url) {
  const regex = /\/d\/([^/]+)|id=([^&]+)/;
  const match = url.match(regex);
  return match?.[1] || match?.[2] || null;
}

// Get Viewable PDF URL
function getViewUrl(driveUrl) {
  const id = extractGoogleDriveFileId(driveUrl);
  return id ? `https://drive.google.com/file/d/${id}/view` : '#';
}

// Get Downloadable PDF URL
function getDownloadUrl(driveUrl) {
  const id = extractGoogleDriveFileId(driveUrl);
  return id ? `https://drive.google.com/uc?export=download&id=${id}` : '#';
}

const Player = () => {
  const { backendUrl, getToken, calculateChapterTime, userData, fetchUserEnrolledCourses } =
    useContext(AppContext);
  const { courseId } = useParams();

  const [courseData, setCourseData] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [initialRating, setInitialRating] = useState(0);

  const fetchCourseData = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(`${backendUrl}/api/course/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success && data.courseData) {
        setCourseData(data.courseData);
        const ratingObj = data.courseData.courseRatings?.find(r => r.userId === userData._id);
        setInitialRating(ratingObj?.rating || 0);
      } else {
        toast.error('Course not found.');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Failed to fetch course');
    }
  };

  const toggleSection = index => {
    setOpenSections(prev => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const getCourseProgress = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        `${backendUrl}/api/user/get-course-progress`,
        { courseId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        setProgressData(data.progressData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleRate = async rating => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        `${backendUrl}/api/user/add-rating`,
        { courseId, rating },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        toast.success(data.message);
        fetchUserEnrolledCourses();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (userData && courseId) {
      fetchCourseData();
      getCourseProgress();
    }
  }, [userData, courseId]);

  if (!courseData) return <Loading />;

  return (
    <>
      <div className="p-4 sm:p-10 flex flex-col-reverse md:grid md:grid-cols-2 gap-10 md:px-36">
        <div className="text-gray-800">
          <h2 className="text-xl font-semibold">Course Structure</h2>
          <div className="pt-5">
            {courseData.courseContent?.map((chapter, index) => (
              <div key={index} className="border border-gray-300 bg-white mb-2 rounded">
                <div
                  className="flex items-center justify-between px-4 py-3 cursor-pointer select-none"
                  onClick={() => toggleSection(index)}
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={assets.down_arrow_icon}
                      alt="arrow icon"
                      className={`transform transition-transform ${openSections[index] ? 'rotate-180' : ''}`}
                    />
                    <p className="font-medium md:text-base text-sm">{chapter.chapterTitle}</p>
                  </div>
                </div>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openSections[index] ? 'max-h-96' : 'max-h-0'
                  }`}
                >
                  <ul className="list-disc md:pl-10 pl-4 pr-4 py-2 text-gray-600 border-t border-gray-300">
                    {chapter.chapterContent.map((lecture, i) => (
                      <li key={i} className="flex items-start gap-2 py-1">
                        <img
                          src={
                            progressData && progressData.lectureCompleted.includes(lecture.lectureId)
                              ? assets.blue_tick_icon
                              : assets.play_icon
                          }
                          alt="bullet icon"
                          className="w-6 h-7 mt-1"
                        />
                        <div className="flex flex-col md:flex-row md:items-center justify-between w-full text-gray-800 text-xs md:text-sm">
                          <p>{lecture.lectureTitle}</p>
                          <div className="flex items-center gap-4 mt-1 md:mt-0 md:ml-2">
                            {lecture.lectureUrl && (
                              <>
                                {/* View PDF */}
                                <a
                                  href={getViewUrl(lecture.lectureUrl)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 text-blue-600 hover:underline"
                                >
                                  <AiFillFilePdf className="text-red-600 text-4xl" />
                                  PDF
                                </a>
                              </>
                            )}

                            {/* Duration */}
                            {lecture.lectureDuration && (
                              <span className="text-gray-700 text-sm">
                                <p>password: {lecture.lectureDuration}</p>
                              </span>
                            )}

                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 py-3 mt-10">
            <h1 className="text-xl font-bold">Rate this Course:</h1>
            <Rating initialRating={initialRating} onRate={handleRate} />
          </div>
        </div>

        <div className="md:mt-10">
          <img src={courseData.courseThumbnail || ''} alt="Course Thumbnail" />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Player;
