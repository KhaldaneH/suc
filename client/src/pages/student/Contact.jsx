import React from 'react';
import Footer from '../../components/student/Footer';
import { assets } from '../../assets/assets';

import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ClockIcon,
  BuildingLibraryIcon,
} from '@heroicons/react/24/outline';
import OurSocials from '../../components/student/Soc';


const Contact = () => {
  return (
    <div className="w-full bg-white">
      {/* Header */}
<section className="w-full text-white bg-gradient-to-r from-[#0f172a] via-[#0a0f1e] to-[#020617]">
  {/* Mobile background image */}
  <div
    className="lg:hidden bg-cover bg-center"
    style={{
      backgroundImage: `url(${assets.contact})`,
    }}
  >
    <div className="bg-black bg-opacity-60">
      <div className="max-w-7xl mx-auto px-6 pt-28 pb-28">
        <h1 className="text-3xl font-bold mb-4 leading-tight">
          Besoin d’aide ou d’informations ?
        </h1>
        <p className="text-gray-200 text-base">
          Notre équipe est là pour répondre à toutes vos questions concernant nos
          formations, inscriptions ou services. Contactez
          <span className="text-blue-400"> SUC Consulting</span> dès aujourd’hui — nous
          vous répondrons dans les plus brefs délais.
        </p>
      </div>
    </div>
  </div>

  {/* Desktop layout */}
  <div className="hidden lg:flex max-w-7xl mx-auto flex-row items-center px-6 py-28 gap-12">
    {/* Left Content */}
    <div className="w-full lg:w-1/2">
      <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
        Besoin d’aide ou d’informations ?
      </h1>
      <p className="text-gray-300 text-lg">
        Notre équipe est là pour répondre à toutes vos questions concernant nos
        formations, inscriptions ou services. Contactez
        <span className="text-blue-400"> SUC Consulting</span> dès aujourd’hui — nous
        vous répondrons dans les plus brefs délais.
      </p>
    </div>

    {/* Right Image */}
    <div className="w-full lg:w-1/2 flex justify-end">
      <img
        src={assets.contact2}
        alt="Contact"
        className="w-90 h-80 object-cover rounded-lg shadow-lg"
      />
    </div>
  </div>
</section>


        <OurSocials/>
      <div className="max-w-6xl mx-auto px-6 py-16">
  <div className="flex flex-col md:flex-row gap-8 mb-16">
    {/* Contact Information */}
    <div className="w-full md:w-1/2 bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Contact Us</h2>

      {/* Address */}
      <div className="flex items-start gap-4 mb-6">
        <div className="bg-blue-100 p-2 rounded-full">
          <MapPinIcon className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">Address</h3>
          <p className="text-gray-600 leading-relaxed">
            128 Education Avenue<br />
            Learning City, IC 12345
          </p>
        </div>
      </div>

      {/* Phone */}
      <div className="flex items-start gap-4 mb-6">
        <div className="bg-green-100 p-2 rounded-full">
          <PhoneIcon className="h-6 w-6 text-green-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">Phone</h3>
          <p className="text-gray-600 leading-relaxed">
            (358) 133 4677<br />
            (358) 133 4688
          </p>
        </div>
      </div>

      {/* Email */}
      <div className="flex items-start gap-4 mb-6">
        <div className="bg-yellow-100 p-2 rounded-full">
          <EnvelopeIcon className="h-6 w-6 text-yellow-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">Email</h3>
          <p className="text-gray-600 leading-relaxed">
            info@educationgate.com<br />
            support@educationgate.com
          </p>
        </div>
      </div>

      {/* Hours */}
      <div className="flex items-start gap-4">
        <div className="bg-purple-100 p-2 rounded-full">
          <ClockIcon className="h-6 w-6 text-purple-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">Hours</h3>
          <p className="text-gray-600 leading-relaxed">
            Mon - Fri: 8:00 AM - 6:00 PM<br />
            Saturday: 9:00 AM - 4:00 PM
          </p>
        </div>
      </div>
    </div>


         {/* Informations sur le Campus */}
<div className="w-full md:w-1/2 bg-white p-8 rounded-2xl shadow-md border border-gray-200">
  <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
    Visitez Notre Campus
  </h2>

  {/* Carte Google Map */}
  <div className="rounded-xl overflow-hidden mb-6">
   <iframe
  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3203.844087377524!2d-8.018016224559102!3d31.625870244116614!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xdafec5c3e646a77%3A0x8a2f43c889cbe1a!2sSUC%20Consulting!5e0!3m2!1sfr!2sma!4v1721982711035!5m2!1sfr!2sma"
  width="100%"
  height="250"
  allowFullScreen=""
  loading="lazy"
  referrerPolicy="no-referrer-when-downgrade"
  title="Carte SUC Consulting Marrakech"
/>

  </div>

  <div className="flex flex-col gap-6 text-gray-700 text-sm md:text-base">
    <div>
      <h3 className="font-semibold text-lg mb-2 text-gray-800">Caractéristiques du Campus</h3>
      <ul className="space-y-1 list-disc list-inside">
        <li>Salles de classe modernes avec équipements technologiques</li>
        <li>Bibliothèque bien fournie et espaces d’étude</li>
        <li>Laboratoires professionnels pour la formation</li>
        <li>Espaces détente et infrastructures de loisirs</li>
        <li>Parking gratuit pour les étudiants</li>
      </ul>
    </div>

    <div>
      <h3 className="font-semibold text-lg mb-2 text-gray-800">Accès et Transport</h3>
      <p>
        Situé au cœur de Casablanca, notre campus est facilement accessible par les transports en commun.
        Les lignes de bus 12, 34 et 58 s’arrêtent juste devant l’établissement. Parking étudiant gratuit disponible sur place.
      </p>
    </div>
  </div>
</div>
</div>


       {/* Section FAQ */}
<div className="text-center mb-20 px-6 max-w-6xl mx-auto">
  <h2 className="text-2xl font-bold mb-2 text-gray-800">Foire Aux Questions</h2>
  <p className="text-gray-600 mb-10 text-sm md:text-base">
    Réponses rapides aux questions courantes sur nos services de formation et d’accompagnement
  </p>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
    {[
      {
        question: 'Comment puis-je créer mon entreprise avec votre aide ?',
        answer:
          'Nous vous accompagnons de l’idée jusqu’à l’immatriculation de votre entreprise : choix du statut, business plan, démarches administratives, et plus encore.',
      },
      {
        question: 'Proposez-vous des formations à distance ?',
        answer:
          'Oui, nous proposons des formations en ligne, en présentiel et en format hybride pour s’adapter à votre emploi du temps.',
      },
      {
        question: 'Quels types de formations sont disponibles ?',
        answer:
          'Nous offrons des formations en bureautique, marketing digital, développement web, gestion de projet, comptabilité, et bien plus.',
      },
      {
        question: 'Y a-t-il un accompagnement après la formation ?',
        answer:
          'Oui. Nous assurons un suivi personnalisé, des sessions de coaching, ainsi que des conseils pour l’insertion professionnelle ou le lancement de votre entreprise.',
      },
    ].map((faq, index) => (
      <div
        key={index}
        className="bg-white border border-blue-100 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200"
      >
        <h3 className="font-semibold text-lg mb-2 text-blue-700">{faq.question}</h3>
        <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
      </div>
    ))}
  </div>
</div>
</div>

      <Footer />
    </div>
  );
};

export default Contact;
