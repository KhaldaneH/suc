import React from 'react';
import { FaFacebookF, FaInstagram, FaYoutube, FaLinkedinIn } from 'react-icons/fa';

const OurSocials = () => {
  return (
    <div className="pt-16 text-center">
      <p className="text-lg text-gray-700 font-semibold mb-6">Follow us on</p>
      <div className="flex flex-wrap items-center justify-center gap-8">
        <a
          href="https://web.facebook.com/p/SUC-Consulting-100073616642208/?_rdc=1&_rdr#"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-transform hover:scale-110"
        >
          <FaFacebookF size={40} color="#1877F2" />
        </a>
        <a
          href="https://www.instagram.com/suc_consulting_/#"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-transform hover:scale-110"
        >
          <FaInstagram size={40} color="#E4405F" />
        </a>
        <a
          href="https://www.youtube.com/channel/UCvKaraHFGdT18PEec-Ormkg"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-transform hover:scale-110"
        >
          <FaYoutube size={40} color="#FF0000" />
        </a>
        <a
          href="https://www.linkedin.com/in/suc-consulting-131346297/?originalSubdomain=ma"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-transform hover:scale-110"
        >
          <FaLinkedinIn size={40} color="#0077B5" />
        </a>
      </div>
    </div>
  );
};

export default OurSocials;
