// import React from 'react';
// import PropTypes from 'prop-types';

// // InfoItem component to display individual information (Experience, Language, etc.)
// const InfoItem = ({ icon, label, value }) => (
//   <div className="flex items-start gap-3 p-4 bg-white rounded-lg">
//     <span className="text-lg">{icon}</span>
//     <div>
//       <div className="font-medium text-gray-900">{label}</div>
//       <div className="text-gray-600">{value}</div>
//     </div>
//   </div>
// );

// const ProfileInfo = ({ experience, languages, about }) => {
//   return (
//     <div className="bg-white rounded-lg p-6">
//       <h2 className="text-black font-figtree text-xl font-semibold leading-[150%] mb-4">About Me</h2>
//       <p className="text-black font-figtree text-base font-normal leading-[150%] mb-3">
//         {about || "No details provided"} {/* Display dynamic 'about' */}
//       </p>

//       <div className="grid grid-cols-2 gap-4">
//         <InfoItem
//           icon="⏱️"
//           label="Experience"
//           value={`${experience || 0} years`} // Display dynamic 'experience'
//         />
//         <InfoItem
//           icon="🌐"
//           label="Language"
//           value={languages.join(", ") || "No languages provided"} // Display dynamic 'languages'
//         />
//       </div>
//     </div>
//   );
// };

// // Prop validation for dynamic props
// ProfileInfo.propTypes = {
//   experience: PropTypes.number.isRequired,
//   languages: PropTypes.arrayOf(PropTypes.string).isRequired,
//   about: PropTypes.string.isRequired,
// };

// export default ProfileInfo;

import React from "react";
import PropTypes from "prop-types";
import { BookUser } from "lucide-react";

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
  return (
    <div className="bg-white rounded-lg p-6">
      <h2 className="flex items-center gap-1 text-black font-figtree text-xl font-semibold leading-[150%] mb-4">
      <BookUser className="w-4 h-4 text-primary" />
        About Me
      </h2>
      <p className="text-black font-figtree text-base font-normal leading-[150%] mb-3">
        {about || "No details provided"} {/* Display dynamic 'about' */}
      </p>

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
