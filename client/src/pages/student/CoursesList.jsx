import React, { useContext, useEffect, useState } from 'react';
import Footer from '../../components/student/Footer';
import { assets } from '../../assets/assets';
import CourseCard from '../../components/student/CourseCard';
import { AppContext } from '../../context/AppContext';
import { useParams, useNavigate } from 'react-router-dom';
import SearchBar from '../../components/student/SearchBar';

const mobileImages = [assets.formation];

const CoursesList = () => {
  const { input: initialInput } = useParams();
  const { allCourses } = useContext(AppContext);
  const navigateRouter = useNavigate();

  const [input, setInput] = useState(initialInput || '');
  const [filteredCourse, setFilteredCourse] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  // Extract unique categories
  useEffect(() => {
    if (allCourses && allCourses.length > 0) {
      const uniqueCategories = ['All', ...new Set(allCourses.map(c => c.category))];
      setCategories(uniqueCategories);
    }
  }, [allCourses]);

  // Filter logic
  useEffect(() => {
    if (!allCourses || allCourses.length === 0) return;

    let tempCourses = [...allCourses];

    if (input.trim()) {
      tempCourses = tempCourses.filter(course =>
        course.courseTitle.toLowerCase().includes(input.toLowerCase())
      );
    }

    if (selectedCategory !== 'All') {
      tempCourses = tempCourses.filter(course => course.category === selectedCategory);
    }

    setFilteredCourse(tempCourses);
  }, [allCourses, input, selectedCategory]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (input.trim()) {
        navigateRouter(`/course-list/${input.trim()}`);
      } else {
        navigateRouter('/course-list');
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [input, navigateRouter]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex(prev => (prev + 1) % mobileImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
     

      {/* Search and Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-12">
        <nav aria-label="breadcrumb" className="mb-6 text-gray-600 text-sm md:text-base">
          <ol className="list-reset flex gap-2">
            <li
              className="cursor-pointer text-indigo-600 hover:underline"
              onClick={() => navigateRouter('/')}
            >
              Home
            </li>
            <li>/</li>
            <li className="font-semibold text-gray-800">Course List</li>
          </ol>
        </nav>

        <div className="max-w-xl mx-auto">
          <SearchBar value={input} onChange={setInput} />
        </div>

        {/* Active search */}
        {input && (
          <div className="max-w-xl mx-auto mt-6 flex items-center justify-between bg-indigo-100 text-indigo-700 px-4 py-2 rounded-md shadow-sm">
            <span className="font-medium">Searching for: <em>"{input}"</em></span>
            <button
              onClick={() => setInput('')}
              aria-label="Clear search"
              className="text-indigo-600 hover:text-indigo-800 transition"
            >
              <img src={assets.cross_icon} alt="Clear" className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mt-10">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-800 border-gray-300 hover:bg-indigo-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Course List */}
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-12 px-2 md:px-0">
          {filteredCourse.length === 0 ? (
            <p className="col-span-full text-center text-gray-500 italic text-lg mt-12">
              No courses found. Try adjusting your search or filter.
            </p>
          ) : (
            filteredCourse.map((course, index) => (
              <CourseCard
                key={index}
                course={course}
                className="transform hover:-translate-y-1 hover:shadow-xl transition duration-300"
              />
            ))
          )}
        </section>
      </div>

      <br /><br />
      <Footer />
    </>
  );
};

export default CoursesList;
