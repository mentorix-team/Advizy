import React from "react";

const ExperienceList = ({ experiences = [] }) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
      <div className="flex items-center gap-2 mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="20"
          viewBox="0 0 24 20"
          fill="none"
        >
          <path
            d="M12 0.181641L0 6.7271L4.36364 9.10528V15.6507L12 19.818L19.6364 15.6507V9.10528L21.8182 7.91619V15.4544H24V6.7271L12 0.181641ZM19.44 6.7271L12 10.7853L4.56 6.7271L12 2.66891L19.44 6.7271ZM17.4545 14.3635L12 17.3307L6.54545 14.3635V10.2944L12 13.2726L17.4545 10.2944V14.3635Z"
            fill="#16A348"
          />
        </svg>
        <h2 className="text-xl font-semibold">Experience</h2>
      </div>

      {experiences.map((experience, index) => (
        <div key={index} className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-black font-medium">{experience.companyName}</h3>
            <p className="text-gray-600">{experience.jobTitle}</p>
          </div>
          <span className="text-gray-500 text-sm">
            {new Date(experience.startDate).toLocaleDateString("en-GB")} -{" "}
            {experience.currentlyWork
              ? "Present"
              : new Date(experience.endDate).toLocaleTimeString("en-GB")}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ExperienceList;
