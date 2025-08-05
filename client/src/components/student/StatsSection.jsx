import React from 'react';
import CountUp from 'react-countup';

const stats = [
  { label: 'Happy Students', end: 2500, suffix: '+', duration: 2 },
  { label: 'Expert Instructors', end: 15, suffix: '+', duration: 1.5 },
  { label: 'Success Rate', end: 98, suffix: '%', duration: 1.5 },
  { label: 'Years Experience', end: 5, duration: 1.5 },
];

const StatsSection = () => {
  return (
    <section className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16 text-center">
        {stats.map((stat, index) => (
          <div key={index}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-blue-600">
              <CountUp
                end={stat.end}
                duration={stat.duration}
                suffix={stat.suffix || ''}
                enableScrollSpy
                scrollSpyDelay={100}
              />
            </h2>
            <p className="mt-2 text-base sm:text-lg md:text-xl text-gray-700 font-medium">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsSection;
