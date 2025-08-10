import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { assets } from '../../assets/assets'; 
import Footer from './Footer';

const Service = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [hash]);

  return (
    <>
    <div className="max-w-6xl mx-auto px-6 py-16 space-y-24">
      <h1 className="text-3xl font-bold text-center mb-12">Nos Services</h1>

      <section id="creation-entreprise" className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm flex flex-col md:flex-row items-center gap-8">
        <img
          src={assets.compace}
          alt="Création d’Entreprise"
          className="w-full md:w-1/3 rounded-lg object-cover h-48"
        />
        <div>
          <h2 className="text-2xl font-semibold mb-6">Création d’Entreprise</h2>
          <p className="text-gray-700 mb-6">
            La création d’entreprise est une étape cruciale qui nécessite une préparation minutieuse et un accompagnement adapté.
            Chez SUC Consulting, nous mettons à votre disposition notre expertise pour vous guider à chaque étape, de la conception de votre projet jusqu’à son lancement officiel.
            Nous vous aidons à définir le statut juridique le plus approprié selon vos besoins et objectifs, et à monter un business plan solide qui convaincra vos partenaires financiers.
          </p>
          <p className="text-gray-700 mb-6">
            Notre accompagnement couvre également toutes les démarches administratives, fiscales et juridiques afin que vous puissiez vous concentrer sur le développement de votre activité.
            Que vous soyez un entrepreneur débutant ou expérimenté, nous sommes là pour vous fournir un support personnalisé et pragmatique, garantissant ainsi le succès de votre création d’entreprise.
          </p>
          <ul className="list-disc list-inside text-gray-600">
            <li>Analyse approfondie du marché et étude de faisabilité</li>
            <li>Choix du statut juridique adapté à votre projet</li>
            <li>Montage complet du business plan avec projections financières</li>
            <li>Assistance dans les formalités d’immatriculation et d’enregistrement</li>
            <li>Conseils en fiscalité et gestion comptable initiale</li>
          </ul>
        </div>
      </section>

      <section id="coaching-mentorat" className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm flex flex-col md:flex-row items-center gap-8">
        <img
          src={assets.coashing}
          alt="Coaching & Mentorat"
          className="w-full md:w-1/3 rounded-lg object-cover h-48"
        />
        <div>
          <h2 className="text-2xl font-semibold mb-6">Coaching & Mentorat</h2>
          <p className="text-gray-700 mb-6">
            Le coaching et le mentorat sont des outils puissants pour accompagner les professionnels dans leur développement personnel et la réussite de leurs projets.
            Nos coachs certifiés vous offrent un espace d’écoute, de réflexion et de challenge qui vous permet de prendre du recul, clarifier vos objectifs et déployer pleinement vos compétences.
          </p>
          <p className="text-gray-700 mb-6">
            Que vous soyez en phase de reconversion professionnelle, en quête de leadership ou souhaitant améliorer votre efficacité au travail, nous adaptons nos méthodes à vos besoins spécifiques.
            Grâce à un accompagnement individualisé ou en groupe, vous apprendrez à gérer votre temps, vos priorités, et à renforcer votre confiance en vous pour relever tous les défis.
          </p>
          <ul className="list-disc list-inside text-gray-600">
            <li>Séances de coaching individuel axées sur vos objectifs personnels</li>
            <li>Programmes de mentorat pour entrepreneurs en création ou croissance</li>
            <li>Ateliers collectifs sur la gestion du stress et leadership</li>
            <li>Techniques de communication efficace et résolution de conflits</li>
            <li>Développement de soft skills clés pour l’évolution professionnelle</li>
          </ul>
        </div>
      </section>

      <section id="formations-professionnelles" className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm flex flex-col md:flex-row items-center gap-8">
        <img
          src={assets.noformation}
          alt="Formations Professionnelles"
          className="w-full md:w-1/3 rounded-lg object-cover h-48"
        />
        <div>
          <h2 className="text-2xl font-semibold mb-6">Formations Professionnelles</h2>
          <p className="text-gray-700 mb-6">
            Nos formations professionnelles sont conçues pour répondre aux exigences du marché actuel et aux besoins spécifiques des entreprises et des individus.
            Elles vous permettent d’acquérir des compétences pratiques et immédiatement applicables, renforçant ainsi votre employabilité et votre performance.
          </p>
          <p className="text-gray-700 mb-6">
            Que vous souhaitiez maîtriser les outils bureautiques, développer vos stratégies marketing digital, ou approfondir vos connaissances en gestion de projet, notre catalogue vous offre une diversité de modules adaptés à tous les niveaux.
            Nos formateurs experts utilisent des méthodes pédagogiques innovantes et interactives pour garantir un apprentissage efficace et motivant.
          </p>
          <ul className="list-disc list-inside text-gray-600">
            <li>Maîtrise avancée des logiciels Microsoft Office (Excel, Word, PowerPoint)</li>
            <li>Stratégies et outils de marketing digital et réseaux sociaux</li>
            <li>Gestion de projet agile avec les meilleures pratiques industrielles</li>
            <li>Comptabilité générale, analyse financière et contrôle de gestion</li>
            <li>Communication professionnelle, négociation et relation client</li>
            <li>Modules personnalisés en fonction des besoins spécifiques de votre secteur</li>
          </ul>
        </div>
      </section>
    </div>
     <Footer/>
    </>
  );
};

export default Service;
