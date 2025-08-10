import React, { useState, useEffect } from 'react';
import { assets } from '../../assets/assets';
import SearchBar2 from '../../components/student/SearchBar2';

const mobileImages = [assets.hero1, assets.hero2, assets.hero3];

const Hero = () => {
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  // Change background image every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prevIndex) => (prevIndex + 1) % mobileImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full bg-gradient-to-r from-[#0f172a] via-[#0a0f1e] to-[#020617] text-white relative overflow-hidden">
      <div
        // Mobile background slideshow div
        className="absolute inset-0 lg:hidden bg-center bg-cover transition-opacity duration-1000"
        style={{ backgroundImage: `url(${mobileImages[currentBgIndex]})` }}
      />
      
      {/* Overlay for dark tint so text is readable */}
      <div className="absolute inset-0 bg-black bg-opacity-50 lg:hidden" />

      <div className="relative max-w-7xl mx-auto flex flex-col-reverse lg:flex-row items-center px-6 py-16 md:py-24 gap-12">
        {/* Left Content */}
        <div className="w-full lg:w-1/2 text-center lg:text-left relative z-10">
          <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight relative">
            Prenez en main votre avenir avec les formations de{' '}
            <span className="text-blue-400">SUC Consulting Innovation.</span>
            <img
              src={assets.sketch}
              alt="sketch"
              className="md:block hidden absolute -bottom-1 right-14 w-20"
            />
          </h1>
          <p className="text-gray-300 mb-6 text-base md:text-lg">
            Nous proposons des formateurs de haut niveau, des contenus interactifs et un environnement bienveillant pour vous aider à atteindre vos objectifs personnels et professionnels.
          </p>
          <div className="w-full max-w-md mx-auto lg:mx-0">
            <SearchBar2 />
          </div>
        </div>

        {/* Right Side - Staggered Images for desktop */}
        <div className="w-full lg:w-1/2 hidden lg:flex justify-center relative z-10">
          <div className="flex gap-4 items-start">
            <img
              src={assets.hero1}
              alt="Course 1"
              className="w-40 h-64 object-cover rounded-lg shadow-lg"
            />
            <img
              src={assets.hero2}
              alt="Course 2"
              className="w-40 h-64 object-cover rounded-lg shadow-lg mt-6"
            />
            <img
              src={assets.hero3}
              alt="Course 3"
              className="w-40 h-64 object-cover rounded-lg shadow-lg mt-12"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
