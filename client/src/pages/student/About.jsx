import React from 'react';
import Footer from '../../components/student/Footer';
import { assets } from '../../assets/assets';
import { FaUserGraduate, FaAward, FaHandsHelping, FaLightbulb, FaChartLine, FaGlobe } from 'react-icons/fa';
import { Link } from 'react-router-dom';



const About = () => {
  return (
    <div className="w-full bg-white">
      {/* Header */}
<section
  className="w-full bg-gradient-to-r from-[#0f172a] via-[#0a0f1e] to-[#020617] text-white relative overflow-hidden"
>
  {/* Mobile background image */}
  <div
    className="absolute inset-0 lg:hidden bg-center bg-cover"
    style={{ backgroundImage: `url(${assets.about})` }}
  />
  {/* Dark overlay for readability */}
  <div className="absolute inset-0 lg:hidden bg-black bg-opacity-60" />

  <div className="relative max-w-7xl mx-auto flex flex-col lg:flex-row items-center px-6 pt-16 lg:py-28 gap-12 z-10">
    {/* Left Content */}
    <div className="w-full lg:w-1/2">
      <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight relative">
        Libérez votre potentiel avec{' '}
        <span className="text-blue-400">SUC Consulting Innovation.</span>
      </h1>

      <p className="text-gray-300 mb-6 text-base md:text-lg">
        Nous proposons des formations professionnelles conçues pour répondre à
        vos besoins spécifiques, animées par des experts du secteur. Grâce à
        un contenu interactif et une approche personnalisée, SUC Consulting
        vous accompagne vers la réussite de vos objectifs personnels et
        professionnels.
      </p>
    </div>

    {/* Desktop Image - only shows on large screens */}
    <div className="w-full lg:w-1/2 flex justify-center hidden lg:flex">
      <img
        src={assets.about}
        alt="Course 1"
        className="w-90 h-80 object-cover rounded-lg shadow-lg"
      />
    </div>
  </div>
</section>

      {/* Our Story */}
      <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center md:items-start gap-10">
        <div className="md:w-1/2 text-gray-700">
          <h2 className="text-xl font-bold mb-4">Our Story</h2>
          <p className="mb-4 text-sm md:text-base">
            Founded in 2019, EduTraining Pro started with a simple mission: to make professional educational training accessible to everyone. Our founders, experienced education professionals, recognized the need for personalized, results-driven learning programs.
          </p>
          <p className="mb-4 text-sm md:text-base">
            What began as a small local training center has grown into a premier educational facility serving over 2,500 students. We’ve maintained our commitment to individual attention while expanding our expertise across multiple learning disciplines.
          </p>
          <p className="text-sm md:text-base">
            Today, we’re proud to be recognized as one of the leading educational training providers in the region, with a 98% student satisfaction rate and countless success stories.
          </p>
        </div>
        <div className="md:w-1/2">
          <img
            src={assets.hero2}
            alt=""
            className="rounded-lg shadow-lg w-full object-cover max-h-80"
          />
        </div>
      </div>
      

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
      <Footer/>
    </div>
  );
};

export default About;
