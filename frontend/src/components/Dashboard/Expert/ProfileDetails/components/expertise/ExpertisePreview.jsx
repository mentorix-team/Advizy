import React from "react";
import PropTypes from "prop-types";

export default function ExpertisePreview({ formData }) {
  console.log(formData);
<<<<<<< HEAD

=======
  
>>>>>>> new-dev
  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 mb-6 shadow-sm border border-green-100">
      <div className="flex items-center mb-5">
        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center mr-3">
<<<<<<< HEAD
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-white"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
=======
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
>>>>>>> new-dev
          </svg>
        </div>
        <h2 className="text-xl font-bold text-green-800">Expertise Preview</h2>
      </div>
<<<<<<< HEAD

=======
      
>>>>>>> new-dev
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <div className="space-y-4">
          {/* Professional Title */}
          <div className="flex items-center justify-between mb-4">
<<<<<<< HEAD
            <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">
              Professional Title
            </span>
            <span className="text-lg font-semibold text-gray-800 mt-1">
              {formData.professionalTitle || "Not specified"}
            </span>
          </div>

          {/* Domain */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">
              Domain
            </span>
            <span className="text-lg font-medium text-gray-800 mt-1">
              {formData.domain || "Not specified"}
            </span>
          </div>

          {/* Niche */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">
              Niche
            </span>
=======
            <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Professional Title</span>
            <span className="text-lg font-semibold text-gray-800 mt-1">
              {formData.professionalTitle || 'Not specified'}
            </span>
          </div>
          
          {/* Domain */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Domain</span>
            <span className="text-lg font-medium text-gray-800 mt-1">
              {formData.domain || 'Not specified'}
            </span>
          </div>
          
          {/* Niche */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Niche</span>
>>>>>>> new-dev
            <div className="mt-1">
              {formData.niche && formData.niche.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {formData.niche.map((nicheItem) => (
                    <span
                      key={nicheItem}
                      className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium"
                    >
                      {nicheItem}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-gray-500 italic">Not specified</span>
              )}
            </div>
          </div>
<<<<<<< HEAD

          {/* Experience */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">
              Experience
            </span>
            <span className="text-lg font-medium text-gray-800 mt-1">
              {formData.experienceYears
                ? `${formData.experienceYears} years`
                : "Not specified"}
            </span>
          </div>

          {/* Skills */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">
              Skills
            </span>
=======
          
          {/* Experience */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Experience</span>
            <span className="text-lg font-medium text-gray-800 mt-1">
              {formData.experienceYears ? `${formData.experienceYears} years` : 'Not specified'}
            </span>
          </div>
          
          {/* Skills */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Skills</span>
>>>>>>> new-dev
            <div className="mt-1">
              {formData.skills && formData.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-gray-500 italic">Not specified</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

ExpertisePreview.propTypes = {
  formData: PropTypes.shape({
    domain: PropTypes.string,
    niche: PropTypes.arrayOf(PropTypes.string),
    professionalTitle: PropTypes.string,
    experienceYears: PropTypes.number,
<<<<<<< HEAD
    skills: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};
=======
    skills: PropTypes.arrayOf(PropTypes.string)
  }).isRequired
};
>>>>>>> new-dev
