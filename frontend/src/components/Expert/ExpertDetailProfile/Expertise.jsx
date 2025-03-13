import { ExpertIcon } from "@/icons/Icons";
import React from "react";

// ExpertiseTag component to render individual skills/tags
const ExpertiseTag = ({ text }) => (
  <span className="inline-block px-4 py-2 bg-gray-100 text-black rounded-full text-sm mr-2 mb-2">
    {text}
  </span>
);

const Expertise = ({ skills }) => {
  // If no skills are passed, show a fallback message
  if (!skills || skills.length === 0) {
    return <p>No expertise listed.</p>;
  }

  return (
    <div className="bg-white rounded-lg p-6 mt-6">
      <div className="flex items-center mb-5">
        <ExpertIcon className="w-6 h-6" />
        <h2 className="text-black px-2 font-Figtree text-2xl font-semibold leading-9">
          Expertise
        </h2>
      </div>
      <div className="text-white text-left font-Figtree text-xs font-semibold leading-5">
        {skills.map((skill, index) => (
          <ExpertiseTag key={index} text={skill} />
        ))}
      </div>
    </div>
  );
};

export default Expertise;
