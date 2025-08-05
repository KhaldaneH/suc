import React from 'react';
import Footer from '../../components/student/Footer';
import Hero from '../../components/student/Hero';
import Companies from '../../components/student/Companies';
import CoursesSection from '../../components/student/CoursesSection';
import TestimonialsSection from '../../components/student/TestimonialsSection';
import CallToAction from '../../components/student/CallToAction';
import Story from '../../components/student/story';
import StatsSection from '../../components/student/StatsSection';
import ExploreCourses from '../../components/student/ExploreCourses';
import CreateCompany from '../../components/student/Companysup';
import OurSocials from '../../components/student/Soc';
import ChatBot from '../../components/student/ChatBot';

const Home = () => {
  return (
    <div className="flex flex-col items-center space-y-7 text-center">
      <Hero />
      <StatsSection />
      <div className="w-full text-left">
        <Story />
      </div>
      <ExploreCourses />
      <CreateCompany />
      <Companies />
      <CoursesSection />
      <TestimonialsSection />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default Home;
