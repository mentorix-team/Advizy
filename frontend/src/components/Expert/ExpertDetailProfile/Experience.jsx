import React from 'react';

const Experience = () => {
  const experiences = [
    '10+ Career Transition in amazon',
    '10+ Career Transition in amazon',
    '10+ Career Transition in amazon',
    'Career Transition'
  ];

  return (
    <div className="bg-white rounded-lg p-6 mt-6">
      <h2 class="text-black font-Figtree text-2xl font-semibold leading-9 mb-4"      >Experience</h2>
      <ul className="space-y-2">
        {experiences.map((exp, index) => (
          <li key={index} className="text-gray-600">{exp}</li>
        ))}
      </ul>
    </div>
  );
};

export default Experience;