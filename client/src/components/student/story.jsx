import React from 'react';
import { assets } from '../../assets/assets';

const Story = () => {
  return (
    <div className="w-full">
      <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center md:items-start gap-10">
        {/* Text Content */}
        <div className="md:w-1/2">
          <h2 className="text-xl font-bold mb-4">Notre Histoire</h2>
          <p className="mb-4 text-sm md:text-base">
            Fondée en 2019, EduTraining Pro est née d’une mission simple : rendre la formation professionnelle accessible à tous.
            Nos fondateurs, des professionnels expérimentés de l’éducation, ont reconnu le besoin de programmes d’apprentissage personnalisés et axés sur les résultats.
          </p>
          <p className="mb-4 text-sm md:text-base">
            Ce qui a commencé comme un petit centre de formation local est devenu un établissement éducatif de premier plan, accueillant plus de 2 500 étudiants.
            Nous avons su conserver notre engagement envers l’attention individuelle tout en élargissant notre expertise dans plusieurs disciplines.
          </p>
          <p className="text-sm md:text-base">
            Aujourd’hui, nous sommes fiers d’être reconnus comme l’un des principaux fournisseurs de formation éducative de la région,
            avec un taux de satisfaction des étudiants de 98 % et de nombreuses histoires de réussite.
          </p>
        </div>

        {/* Desktop staggered images */}
        <div className="md:w-1/2 hidden lg:flex justify-center relative z-10">
          <div className="flex gap-4 items-start">
            <img
              src={assets.hero2}
              alt="2"
              className="w-56 h-70 object-cover rounded-lg shadow-lg mt-6"
            />
            <img
              src={assets.hero3}
              alt="3"
              className="w-56 h-70 object-cover rounded-lg shadow-lg mt-12"
            />
          </div>
        </div>
      </div>

      {/* Mobile images below text - in row */}
      <div className="block lg:hidden px-6 pb-12 max-w-6xl mx-auto">
        <div className="flex flex-row gap-4 justify-center items-center">
          <img
            src={assets.hero1}
            alt="Mobile 1"
            className="w-1/2 rounded-lg shadow-lg object-cover h-48"
          />
          <img
            src={assets.hero2}
            alt="Mobile 2"
            className="w-1/2 rounded-lg shadow-lg object-cover h-48"
          />
        </div>
      </div>
    </div>
  );
};

export default Story;
