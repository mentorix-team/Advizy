import React from 'react';
import PropTypes from 'prop-types';

export default function ExpertisePreview({ formData }) {
  return (
    <div className="bg-green-50 rounded-lg p-6 mb-6">
      <h2 className="text-lg font-semibold text-green-800 mb-4 text-left">Preview</h2>
      
      <div className="bg-white rounded-lg p-4">
        <h3 className="text-xl font-semibold mb-2 text-left">{formData.professionalTitle || 'Professional Title'}</h3>
        <p className="text-gray-600 mb-4 text-left">{formData.domain || 'Domain'}</p>
        
        <div className="flex flex-wrap gap-2">
          {formData.skills.map((skill) => (
            <span
              key={skill}
              className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

ExpertisePreview.propTypes = {
  formData: PropTypes.shape({
    domain: PropTypes.string,
    professionalTitle: PropTypes.string,
    skills: PropTypes.arrayOf(PropTypes.string)
  }).isRequired
};