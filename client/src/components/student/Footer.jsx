import React from 'react';
import { assets } from '../../assets/assets';
import { FaFacebookF, FaYoutube, FaLinkedinIn, FaInstagram } from 'react-icons/fa';


const Footer = () => {
  return (
    <footer className="bg-gray-900 md:px-36 text-left w-full mt-auto">
      <div className="flex flex-col md:flex-row items-start px-8 md:px-0 justify-center gap-10 md:gap-32 py-10 border-b border-white/30">

        <div className="flex flex-col md:items-start items-center w-full">
         <div className="text-2xl font-extrabold text-blue-400 tracking-wide select-none cursor-default">
  SUC <span className="text-white">Consulting</span>
</div>


          <p className="mt-6 text-center md:text-left text-sm text-white/80">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.
          </p>
        </div>

        <div className="flex flex-col md:items-start items-center w-full">
          <h2 className="font-semibold text-white mb-5">Company</h2>
          <ul className="flex md:flex-col w-full justify-between text-sm text-white/80 md:space-y-2">
            <li><a href="/">Home</a></li>
            <li><a href="/course-list">Courses</a></li>
            <li><a href="/about">About us</a></li>
            <li><a href="/contact">Contact us</a></li>
          </ul>
        </div>

        <div className="hidden md:flex flex-col items-start w-full">
  <p className="text-sm text-white/80 mb-4">
    The latest news, articles, and resources, sent to your inbox weekly.
  </p>
  
  <div className="flex space-x-4">
    <a href="https://web.facebook.com/p/SUC-Consulting-100073616642208/?_rdc=1&_rdr#" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition">
      <FaFacebookF size={20} />
    </a>
     <a href="https://www.instagram.com/suc_consulting_/#" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition">
      <FaInstagram size={20} />
    </a>
   <a href="https://www.youtube.com/channel/UCvKaraHFGdT18PEec-Ormkg" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition">
      <FaYoutube size={20} />
    </a>
    <a href="https://www.linkedin.com/in/suc-consulting-131346297/?originalSubdomain=ma" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition">
      <FaLinkedinIn size={20} />
    </a>
  </div>
</div>

      </div>
      <p className="py-4 text-center text-xs md:text-sm text-white/60">
        Copyright 2025 © SUC Consulting. All Right Reserved.
      </p>
    </footer>
  );
};

export default Footer;
