import React from "react";
import PropTypes from "prop-types";

// InfoItem component to display individual information (Experience, Language, etc.)
const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-start gap-3 p-4 bg-white rounded-lg">
    <span className="text-lg">{icon}</span>
    <div>
      <div className="font-medium text-gray-900">{label}</div>
      <div className="text-gray-600">{value}</div>
    </div>
  </div>
);

const ProfileInfo = ({ experience, languages, about, languageOptions }) => {
  return (
    <div className="bg-white rounded-lg p-6">
      <h2 className="text-black font-figtree text-xl font-semibold leading-[150%] mb-4">
        About Me
      </h2>
      <p className="text-black font-figtree text-base font-normal leading-[150%] mb-3">
        {about || "No details provided"} {/* Display dynamic 'about' */}
      </p>

      <div className="grid grid-cols-2 gap-4">
        <InfoItem
          icon="⏱️"
          label="Experience"
          value={`${experience || 0} years`} // Display dynamic 'experience'
        />
        <InfoItem
          icon="🌐"
          label="Language"
          value={languages.join(", ") || "No languages provided"} // Display dynamic 'languages'
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <InfoItem
          icon="⏱️"
          label="Experience"
          value={`${experience || 0} years`} // Display dynamic 'experience'
        />
        <InfoItem
          icon="🌐"
          label="Language"
          value={
            languages
              .map(
                (lang) =>
                  languageOptions.find((option) => option.value === lang)?.label
              )
              .filter(Boolean)
              .join(", ") || "No languages provided"
          } // Display language labels only
        />
      </div>
    </div>
  );
};

// Prop validation for dynamic props
ProfileInfo.propTypes = {
  experience: PropTypes.number.isRequired,
  languages: PropTypes.arrayOf(PropTypes.string).isRequired,
  about: PropTypes.string.isRequired,
};

export default ProfileInfo;
