import React from 'react';
import { assets } from '../../assets/assets';


const ResponsiveImage = () => {
  return (
    <div className="w-full">
      {/* Desktop Image */}
       {/*
      <img
        src={assets.canvaD}
        alt="Desktop Version"
        className="hidden md:block w-full h-auto"
      />
      */}

      {/* Mobile Image */}
      <img
        src={assets.canvaM}
        alt="Mobile Version"
        className="block md:hidden w-full h-auto"
      />
    </div>
  );
};

export default ResponsiveImage;
