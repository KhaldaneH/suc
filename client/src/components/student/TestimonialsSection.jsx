import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useUser, useAuth } from '@clerk/clerk-react';
import { assets } from '../../assets/assets';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import Rating from './Rating';

function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [breakpoint]);

  return isMobile;
}

const TestimonialsSection = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const { backendUrl } = useContext(AppContext);
  const isMobile = useIsMobile();

  const [testimonials, setTestimonials] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/user/reviews`);
        setTestimonials(res.data?.reviews || []);
      } catch {
        toast.error('Failed to load reviews.');
      }
    };
    fetchTestimonials();
  }, [backendUrl]);

  const handleSubmit = async () => {
    if (!feedback || rating === 0) return toast.warn('Please provide both rating and feedback');
    if (!user) return toast.warn('Login required to submit a review');

    try {
      setLoading(true);
      const token = await getToken();
      await axios.post(
        `${backendUrl}/api/user/reviews`,
        { content: feedback, rating },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Review submitted!');
      setFeedback('');
      setRating(0);
      setCurrentSlide(0);
      const res = await axios.get(`${backendUrl}/api/user/reviews`);
      setTestimonials(res.data?.reviews || []);
    } catch {
      toast.error('Failed to submit review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const cardsPerSlideDesktop = 4;
  const cardsPerSlideMobile = 2;

  // Calculate slides count for mobile and desktop
  const totalSlidesDesktop = Math.ceil(testimonials.length / cardsPerSlideDesktop);
  const totalSlidesMobile = Math.ceil(testimonials.length / cardsPerSlideMobile);

  // Slice testimonials based on currentSlide and device
  const visibleTestimonialsDesktop = testimonials.slice(
    currentSlide * cardsPerSlideDesktop,
    currentSlide * cardsPerSlideDesktop + cardsPerSlideDesktop
  );

  const visibleTestimonialsMobile = testimonials.slice(
    currentSlide * cardsPerSlideMobile,
    currentSlide * cardsPerSlideMobile + cardsPerSlideMobile
  );

  // Disable prev if on first slide
  const disablePrev = currentSlide === 0;

  // Disable next if on last slide depending on device
  const disableNext = isMobile
    ? currentSlide >= totalSlidesMobile - 1
    : currentSlide >= totalSlidesDesktop - 1;

  return (
    <section className="py-16 px-6  text-center max-w-7xl mx-auto">
      <p className="text-sm text-gray-600 uppercase tracking-wider mb-2">SUC Consulting</p>
      <h2 className="text-2xl font-extrabold mb-12">
        <span className="text-gray-900">Avis des </span>
        <span className="text-blue-600">Utilisateurs</span>
      </h2>
      <br />

      {/* Desktop View */}
      <div className="hidden sm:grid grid-cols-4 gap-8">
        {visibleTestimonialsDesktop.length > 0 ? (
          visibleTestimonialsDesktop.map((testimonial, index) => (
            <div
              key={testimonial._id}
              className={`bg-white rounded-2xl p-6 shadow-xl flex flex-col items-center justify-start text-center
                ${index % 4 === 0 || index % 4 === 2 ? 'translate-y-[-20px]' : 'translate-y-[20px]'}`}
              style={{ height: '260px', overflow: 'hidden' }}
            >
              <img
                src={testimonial.user?.imageUrl || assets.user}
                alt="user"
                className="w-20 h-20 rounded-full border-4 border-white shadow-md object-cover mb-2"
              />
              <div className="flex justify-center mb-1">
                {[...Array(5)].map((_, idx) => (
                  <img
                    key={idx}
                    src={idx < Math.floor(testimonial.rating) ? assets.star : assets.star_blank}
                    alt="star"
                    className="w-4 h-4"
                  />
                ))}
              </div>
              <h4 className="text-sm font-semibold text-gray-900 truncate w-full">{testimonial.user?.name || 'Anonymous'}</h4>
              <p className="text-sm text-gray-600 mt-1 leading-snug px-2 break-words line-clamp-4">
                "{testimonial.content}"
              </p>
            </div>
          ))
        ) : (
          <p className="col-span-4 text-gray-600">Aucun témoignage pour le moment. Soyez le premier à en laisser un !</p>
        )}
      </div>

      {/* Mobile View */}
      <div className="sm:hidden grid grid-rows-2 gap-6 mt-4">
        {visibleTestimonialsMobile.length > 0 ? (
          visibleTestimonialsMobile.map((testimonial) => (
            <div
              key={testimonial._id + '-mobile'}
              className="bg-white rounded-2xl p-4 shadow-xl flex flex-col items-center justify-start text-center"
              style={{ height: '260px', overflow: 'hidden' }}
            >
              <img
                src={testimonial.user?.imageUrl || assets.user}
                alt="user"
                className="w-20 h-20 rounded-full border-4 border-white shadow-md object-cover mb-2"
              />
              <div className="flex justify-center mb-1">
                {[...Array(5)].map((_, idx) => (
                  <img
                    key={idx}
                    src={idx < Math.floor(testimonial.rating) ? assets.star : assets.star_blank}
                    alt="star"
                    className="w-4 h-4"
                  />
                ))}
              </div>
              <h4 className="text-sm font-semibold text-gray-900 truncate w-full">{testimonial.user?.name || 'Anonymous'}</h4>
              <p className="text-sm text-gray-600 mt-1 leading-snug px-2 break-words line-clamp-4">
                "{testimonial.content}"
              </p>
            </div>
          ))
        ) : (
          <p className="col-span-2 text-gray-600">Aucun témoignage pour le moment. Soyez le premier à en laisser un !</p>
        )}
      </div>

      {/* Navigation Buttons */}
      {testimonials.length > Math.min(cardsPerSlideDesktop, cardsPerSlideMobile) && (
        <div className="mt-10 flex justify-center gap-4">
          <button
            onClick={() => setCurrentSlide((prev) => Math.max(0, prev - 1))}
            disabled={disablePrev}
            className="text-white bg-blue-600 px-4 py-2 rounded-full disabled:opacity-50 hover:bg-blue-700 transition font-bold text-lg"
          >
            ‹
          </button>
          <button
            onClick={() =>
              !disableNext && setCurrentSlide((prev) => prev + 1)
            }
            disabled={disableNext}
            className="text-white bg-blue-600 px-4 py-2 rounded-full disabled:opacity-50 hover:bg-blue-700 transition font-bold text-lg"
          >
            ›
          </button>
        </div>
      )}

      {/* Submit Section */}
      <div className="mt-16 max-w-3xl mx-auto bg-white p-8 shadow-lg rounded-2xl">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Partagez votre expérience</h3>
        <Rating rating={rating} onRate={setRating} />
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Type your valuable feedback here..."
          rows={5}
          className="mt-4 w-full border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-blue-400 resize-none text-gray-700 placeholder-gray-400 text-base"
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-6 bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 text-lg"
        >
          {loading ? 'Submitting…' : 'Submit Review'}
        </button>
      </div>
    </section>
  );
};

export default TestimonialsSection;
