import React from 'react';
import { assets } from '../../assets/assets'; // Make sure assets.compan exists

const CreateCompany = () => {
  return (
    <div
      className="w-full text-white bg-cover bg-center"
      style={{ backgroundImage: `url(${assets.compan})` }}
    >
      <div className="bg-black bg-opacity-70 w-full">
        <div className="max-w-6xl mx-auto px-6 py-16 flex flex-col md:flex-row items-start md:items-start gap-10">
          
          {/* Text Content */}
          <div className="md:w-2/3 text-left">
            <h2 className="text-3xl font-bold mb-6">Créez Votre Entreprise Avec Confiance</h2>
            
            <p className="mb-4 text-sm md:text-base leading-relaxed">
              Vous rêvez de lancer votre propre entreprise, mais vous ne savez pas par où commencer ? Ne vous inquiétez pas, nous sommes là pour vous accompagner à chaque étape.
            </p>

            <p className="mb-4 text-sm md:text-base leading-relaxed">
              Notre service d'accompagnement à la création d'entreprise est conçu pour vous fournir un soutien complet :
              rédaction de business plan, choix du statut juridique, démarches administratives, financement, et plus encore.
            </p>

            <p className="mb-4 text-sm md:text-base leading-relaxed">
              Grâce à notre équipe d'experts, vous éviterez les pièges les plus courants et gagnerez un temps précieux.
              Nous adaptons nos conseils à votre secteur d'activité, à votre budget et à vos ambitions.
            </p>

            <p className="mb-4 text-sm md:text-base leading-relaxed">
              Que vous souhaitiez créer une start-up innovante, une entreprise artisanale ou un commerce local, nous avons l’expérience pour vous guider efficacement.
            </p>

            <p className="text-sm md:text-base leading-relaxed">
              Prenez le contrôle de votre avenir professionnel. Faites confiance à notre savoir-faire et transformez votre idée en une réussite concrète.
              Contactez-nous dès aujourd’hui pour démarrer votre aventure entrepreneuriale.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCompany;
