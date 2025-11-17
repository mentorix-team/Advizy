import React from "react";
import PropTypes from "prop-types";
import { BookUser } from "lucide-react";
import { useState } from "react";

// InfoItem component to display individual information
const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-start gap-3 p-4 bg-white rounded-lg">
    <span className="text-lg">{icon}</span>
    <div>
      <div className="font-medium text-gray-900">{label}</div>
      <div className="text-gray-600">{value}</div>
    </div>
  </div>
);



const ProfileInfo = ({
  experience,
  languages,
  about,

  languageOptions = [],
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const CHARACTER_LIMIT = 200;
  const shouldTruncate = about && about.length > CHARACTER_LIMIT;

  return (
    <div className="bg-white rounded-lg p-6">
      <h2 className="flex items-center gap-1 text-black font-figtree text-xl font-semibold leading-[150%] mb-4">
        <BookUser className="w-4 h-4 text-primary" />
        About Me
      </h2>
      <div className="text-black font-figtree text-base font-normal leading-[150%] mb-3">
        {shouldTruncate && !isExpanded ? (
          <>
            {about.slice(0, CHARACTER_LIMIT)}...
            <button
              onClick={() => setIsExpanded(true)}
              className="text-primary hover:text-green-700 font-medium ml-2"
            >
              Read More
            </button>
          </>
        ) : (
          <>
            {about || "No details provided"}
            {shouldTruncate && isExpanded && (
              <button
                onClick={() => setIsExpanded(false)}
                className="text-primary hover:text-green-700 font-medium ml-2"
              >
                Show Less
              </button>
            )}
          </>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <InfoItem
          icon="⏱️"
          label="Experience"
          value={
            experience === 0 ? "Less than one year" : `${experience} years`
          }
        />
        <InfoItem
          icon="🌐"
          label="Language"
          value={
            languages.length > 0
              ? languages
                .map(
                  (lang) =>
                    languageOptions.find((option) => option.value === lang)
                      ?.label || lang
                )
                .join(", ")
              : "No languages provided"
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
  languageOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
};

export default ProfileInfo;
