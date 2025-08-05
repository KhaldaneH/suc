import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../../assets/assets'

const CallToAction = () => {
  return (
    <div className='flex flex-col items-center gap-4 pt-10 pb-24 px-8 md:px-0'>
      <h1 className='md:text-4xl text-xl text-gray-800 font-semibold'>
        Apprenez à votre rythme, où que vous soyez
      </h1>
      <p className='text-gray-500 sm:text-sm'>
        Accédez à des cours de qualité à tout moment et développez vos compétences selon votre propre emploi du temps.
      </p>
      <div className='flex items-center font-medium gap-6 mt-4'>
        <Link to="/course-list">
          <button className='px-6 py-2 text-sm md:px-10 md:py-3 md:text-base rounded-md text-white bg-blue-600'>
            Commencer
          </button>
        </Link>
        <Link to="/about">
          <button className='flex items-center gap-2 text-sm md:text-base'>
            En savoir plus
            <img src={assets.arrow_icon} alt="Icône de flèche" className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </Link>
      </div>
    </div>
  )
}

export default CallToAction
