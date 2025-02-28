import React from 'react';
import PropTypes from 'prop-types';
import { FaBriefcase } from 'react-icons/fa';
// import { domainOptions, nicheOptions } from './path-to-options-file'; // Adjust the import path accordingly
import { domainOptions, nicheOptions } from '../../../../../../utils/Options'

export default function ProfessionalDetails({ formData, setFormData }) {
  return (
    <div className="bg-white rounded-lg p-6 mb-6">
      <div className="flex items-center gap-2 text-green-700 mb-4 text-left">
        <FaBriefcase />
        <h2 className="text-lg font-semibold">Professional Details</h2>
      </div>

      <div className="space-y-4">
        <div className="text-left">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Domain of Expertise
          </label>
          <select
            value={formData.domain}
            onChange={(e) => setFormData({ ...formData, domain: e.target.value, niche: '' })} // Reset niche when domain changes
            className="w-full p-2 border rounded-lg focus:ring-primary focus:border-primary"
          >
            <option value="">Select domain</option>
            {domainOptions.map((domain) => (
              <option key={domain.value} value={domain.value}>
                {domain.label}
              </option>
            ))}
          </select>
        </div>

        <div className="text-left">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Niche
          </label>
          <select
            value={formData.niche}
            onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
            className="w-full p-2 border rounded-lg focus:ring-primary focus:border-primary"
            disabled={!formData.domain} // Disable if no domain selected
          >
            <option value="">Select your specific niche</option>
            {formData.domain &&
              nicheOptions[formData.domain]?.map((niche) => (
                <option key={niche.value} value={niche.value}>
                  {niche.label}
                </option>
              ))}
          </select>
        </div>

        <div className="text-left">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Professional Title
          </label>
          <input
            type="text"
            value={formData.professionalTitle}
            onChange={(e) => setFormData({ ...formData, professionalTitle: e.target.value })}
            placeholder="e.g. Senior Software Engineer"
            className="w-full p-2 border rounded-lg focus:ring-primary focus:border-primary"
          />
        </div>
      </div>
    </div>
  );
}

ProfessionalDetails.propTypes = {
  formData: PropTypes.shape({
    domain: PropTypes.string,
    niche: PropTypes.string,
    professionalTitle: PropTypes.string
  }).isRequired,
  setFormData: PropTypes.func.isRequired
};
