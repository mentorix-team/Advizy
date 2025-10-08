import React from 'react';
import PropTypes from 'prop-types';

export default function ExpertisePreview({ formData }) {
  console.log(formData);

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="border-b border-gray-200 px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900">Expertise Information</h2>
      </div>

      <div className="p-6">
        <div className="space-y-6">
          {/* Professional Title */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <label className="text-sm font-medium text-gray-700">Professional Title</label>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-900 capitalize">
                {formData.professionalTitle || 'Not specified'}
              </p>
            </div>
          </div>

          {/* Domain */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <label className="text-sm font-medium text-gray-700">Domain</label>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-900 capitalize">
                {formData.domain || 'Not specified'}
              </p>
            </div>
          </div>

          {/* Niche */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <label className="text-sm font-medium text-gray-700">Niche</label>
            </div>
            <div className="md:col-span-2">
              {formData.niche && formData.niche.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {formData.niche.map((nicheItem, index) => (
                    <span
                      key={index}
                      className="text-sm text-gray-900 capitalize"
                    >
                      {nicheItem}{index < formData.niche.length - 1 ? ',' : ''}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Not specified</p>
              )}
            </div>
          </div>

          {/* Experience */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <label className="text-sm font-medium text-gray-700">Years of Experience</label>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-900">
                {formData.experienceYears ? `${formData.experienceYears} Years` : 'Not specified'}
              </p>
            </div>
          </div>

          {/* Skills */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <label className="text-sm font-medium text-gray-700">Skills</label>
            </div>
            <div className="md:col-span-2">
              {formData.skills && formData.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="text-sm text-gray-900 capitalize"
                    >
                      {skill}{index < formData.skills.length - 1 ? ',' : ''}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Not specified</p>
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
    skills: PropTypes.arrayOf(PropTypes.string)
  }).isRequired
};