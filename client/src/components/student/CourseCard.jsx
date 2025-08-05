import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../../assets/assets';
import { AppContext } from '../../context/AppContext';

const CourseCard = ({ course }) => {
  const { currency, calculateRating } = useContext(AppContext);

  const rating = calculateRating(course);
  const hasRatings = rating > 0;

  return (
    <Link
      onClick={() => scrollTo(0, 0)}
      to={'/course/' + course._id}
      className="border border-gray-300 pb-6 overflow-hidden rounded-lg hover:shadow-md hover:scale-[1.02] transition-transform duration-200 bg-white"
    >
      <img className="w-full h-40 object-cover" src={course.courseThumbnail} alt="" />
      <div className="p-3 text-left">
        <h3 className="text-base font-semibold text-gray-900">{course.courseTitle}</h3>

        <div className="flex items-center space-x-2 mt-1">
          {hasRatings ? (
            <>
              <p className="text-sm">{rating}</p>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <img
                    key={i}
                    className="w-3.5 h-3.5"
                    src={i < Math.floor(rating) ? assets.star : assets.star_blank}
                    alt=""
                  />
                ))}
              </div>
              <p className="text-sm text-gray-500">({course.courseRatings.length})</p>
            </>
          ) : (
            <p className="text-sm text-gray-500 italic">No ratings yet</p>
          )}
        </div>

        <p className="text-base font-semibold text-gray-800 mt-2">
          {(course.coursePrice - (course.discount * course.coursePrice) / 100).toFixed(2)} MAD
        </p>
      </div>
    </Link>
  );
};

export default CourseCard;
