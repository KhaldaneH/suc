import React from 'react';

const categories = [
  {
    title: "Accès à des formateurs experts",
    image: "https://c4.wallpaperflare.com/wallpaper/907/368/876/triangle-abstract-gradient-soft-gradient-wallpaper-preview.jpg",
  },
  {
    title: "Amélioration des compétences professionnelles",
    image: "https://static.vecteezy.com/system/resources/thumbnails/050/672/423/small_2x/a-vast-expanse-of-cosmic-wonders-showcasing-stars-nebulae-and-intergalactic-clouds-in-the-depths-of-space-during-a-starry-night-photo.jpg",
  },
  {
    title: "Formation axée sur la pratique",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQod8hyVVqp3_xFRetVcYZsBhyXRrICvZJtJpv_G2hsIR3MgCyltp9zZ6zszjx2IwA11Q0&usqp=CAU",
  },
  {
    title: "Accompagnement personnalisé",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm7cmAU2v-i2oNO8Rn8zqO3xS7oOQAYfEvWQ&s",
  },
  {
    title: "Adapté au marché de l'emploi",
    image: "https://e0.pxfuel.com/wallpapers/148/559/desktop-wallpaper-abstract-geometric-background-design-thumbnail.jpg",
  },
  {
    title: "Flexibilité des horaires",
    image: "https://wallpaper.dog/large/20574359.jpg",
  },
  {
    title: "Développement personnel et leadership",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvKwSYrZEPAb6oSE4LJzQq8gmrwANJsIKO1w&s",
  },
  {
    title: "Accès à une plateforme moderne",
    image: "https://wallup.net/wp-content/uploads/2019/09/1004957-matrix-sci-fi-science-fiction-action-fighting-futuristic-thriller-noir-adventure-warrior-hacker-gacking-hack-computer-binary-code-reloaded-revolutions-cyberpunk-cyber-punk-technics-virus-748x561.jpg",
  },
  {
    title: "Suivi post-formation",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhHwBeHx8vOKKBJ603IvQ_d9aqBjwV0i71Fw&s",
  },
  {
    title: "Programmes adaptés à tous les niveaux",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjRtSEXDJF6xmo30pv1VB7avX1YW68LYyBLJKoRfmql8sOqNdruRL9OFXTvwPS81HHfC4&usqp=CAU",
  },
  {
    title: "Investissement rentable pour l’avenir",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRp_jMRRDLJu9Fm3LueHIsoCgD0ff81o1YWcw&s",
  },
];


const CourseCategories = () => {
  return (
    <div className="w-full py-10 px-4">
      <h2 className="text-3xl font-semibold text-center mb-10">Pourquoi choisir SUC Consulting ?</h2>

      {/* Centered container */}
      <div className="flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
          {categories.map((category, index) => (
            <div
              key={index}
              className="flex rounded-lg shadow-md overflow-hidden bg-white hover:shadow-lg transition w-full max-w-xs mx-auto"
            >
              <img
                src={category.image}
                alt={category.title}
                className="w-24 h-24 object-cover"
              />
              <div className="p-4 flex flex-col justify-center">
                <h3 className="font-semibold text-sm">{category.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseCategories;
