import React from 'react';
import { assets } from '../../assets/assets';
import { FaUserGraduate, FaAward, FaHandsHelping, FaLightbulb, FaChartLine, FaGlobe } from 'react-icons/fa';
import { Link } from 'react-router-dom'; // import Link



const Companies = () => {
  return (
    <div className="pt-16">
     {/* Notre Mission & Nos Valeurs */}
     <div className="max-w-6xl mx-auto px-6 py-12 text-center">
       <h2 className="text-xl font-bold mb-2">Notre Mission & Nos Valeurs</h2>
       <p className="text-gray-600 mb-8 text-sm md:text-base">
         Les principes qui guident tout ce que nous faisons
       </p>
     
       <div className="flex flex-col md:flex-row md:flex-wrap justify-center gap-6">
         {/* Centré sur l’étudiant */}
         <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm w-full md:w-[30%] text-center">
           <div className="flex justify-center items-center mb-4">
             <i className="text-blue-600 text-4xl"><FaUserGraduate /></i>
           </div>
           <h3 className="font-semibold mb-2">Centré sur l’étudiant</h3>
           <p className="text-gray-600 text-sm">
             Chaque décision est prise en pensant au succès et à l’épanouissement de nos apprenants.
           </p>
         </div>
     
         {/* Excellence */}
         <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm w-full md:w-[30%] text-center">
           <div className="flex justify-center items-center mb-4">
             <i className="text-green-600 text-4xl"><FaAward /></i>
           </div>
           <h3 className="font-semibold mb-2">Excellence</h3>
           <p className="text-gray-600 text-sm">
             Nous visons l’excellence dans tous les aspects de notre service.
           </p>
         </div>
     
         {/* Communauté */}
         <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm w-full md:w-[30%] text-center">
           <div className="flex justify-center items-center mb-4">
             <i className="text-yellow-500 text-4xl"><FaHandsHelping /></i>
           </div>
           <h3 className="font-semibold mb-2">Communauté</h3>
           <p className="text-gray-600 text-sm">
             Nous bâtissons une communauté solidaire et motivante pour tous.
           </p>
         </div>
     
         {/* Innovation */}
         <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm w-full md:w-[30%] text-center">
           <div className="flex justify-center items-center mb-4">
             <i className="text-purple-600 text-4xl"><FaLightbulb /></i>
           </div>
           <h3 className="font-semibold mb-2">Innovation</h3>
           <p className="text-gray-600 text-sm">
             Nous encourageons la créativité et l’adoption de solutions modernes.
           </p>
         </div>
     
         {/* Croissance continue */}
         <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm w-full md:w-[30%] text-center">
           <div className="flex justify-center items-center mb-4">
             <i className="text-pink-500 text-4xl"><FaChartLine /></i>
           </div>
           <h3 className="font-semibold mb-2">Croissance continue</h3>
           <p className="text-gray-600 text-sm">
             Nous favorisons l’amélioration constante de nos services et de nos apprenants.
           </p>
         </div>
     
         {/* Accessibilité */}
         <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm w-full md:w-[30%] text-center">
           <div className="flex justify-center items-center mb-4">
             <i className="text-indigo-600 text-4xl"><FaGlobe /></i>
           </div>
           <h3 className="font-semibold mb-2">Accessibilité</h3>
           <p className="text-gray-600 text-sm">
             Nous nous engageons à rendre la formation de qualité accessible à tous.
           </p>
         </div>
       </div>
     </div>
     {/* Nos Services d’Accompagnement */}
      <div className="max-w-6xl mx-auto px-6 py-12 text-center">
        <h2 className="text-xl font-bold mb-2">Nos Services d’Accompagnement</h2>
        <p className="text-gray-600 mb-8 text-sm md:text-base">
          Découvrez les solutions personnalisées que nous proposons aux futurs entrepreneurs et professionnels en reconversion
        </p>

        <div className="flex flex-col md:flex-row justify-center gap-8">
          {/* Service 1 */}
          <Link
            to="/services#creation-entreprise"
            className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm w-full md:w-1/3 text-left hover:shadow-lg transition"
          >
            <img
              src={assets.compace}
              alt="Accompagnement à la création d’entreprise"
              className="rounded-lg w-full h-40 object-cover mb-4"
            />
            <h3 className="text-center font-semibold">Création d’Entreprise</h3>
            <p className="text-gray-600 text-xs md:text-sm">
              De l’idée à l’immatriculation, nous vous guidons dans toutes les démarches administratives, juridiques et financières.
            </p>
          </Link>

          {/* Service 2 */}
          <Link
            to="/services#coaching-mentorat"
            className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm w-full md:w-1/3 text-left hover:shadow-lg transition"
          >
            <img
              src={assets.coashing}
              alt="Coaching professionnel"
              className="rounded-lg w-full h-40 object-cover mb-4"
            />
            <h3 className="text-center font-semibold">Coaching & Mentorat</h3>
            <p className="text-gray-600 text-xs md:text-sm">
              Nos coachs certifiés vous accompagnent dans votre développement personnel et la structuration de votre projet professionnel.
            </p>
          </Link>

          {/* Service 3 */}
          <Link
            to="/services#formations-professionnelles"
            className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm w-full md:w-1/3 text-left hover:shadow-lg transition"
          >
            <img
              src={assets.noformation}
              alt="Formations professionnelles"
              className="rounded-lg w-full h-40 object-cover mb-4"
            />
            <h3 className="text-center font-semibold">Formations Professionnelles</h3>
            <p className="text-gray-600 text-xs md:text-sm">
              Des modules adaptés aux besoins du marché : bureautique, marketing digital, gestion de projet, comptabilité, etc.
            </p>
          </Link>
        </div>
      </div>
     
    </div>
  );
};

export default Companies;
