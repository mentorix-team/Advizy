import React, { useState } from "react";
import PropTypes from "prop-types";
import { ArrowBigDown, ArrowBigDownDash, Briefcase, ChevronDown, Info, Lightbulb } from "lucide-react";
import { domainOptions, nicheOptions } from "@/utils/Options";

const Tooltip = ({ text, children }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative inline-flex items-center">
      {children}
      <button
        type="button"
        className="ml-1.5 inline-flex items-center justify-center text-gray-400 hover:text-gray-600 focus:outline-none"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        aria-label="More information"
      >
        <Info size={16} />
      </button>
      {showTooltip && (
        <div className="absolute z-10 w-64 px-4 py-2 mt-1 text-sm text-white bg-gray-800 rounded-md shadow-lg -right-4 top-full">
          {text}
          <div className="absolute -top-1 right-4 w-2 h-2 bg-gray-800 transform rotate-45"></div>
        </div>
      )}
    </div>
  );
};


export default function ProfessionalDetails({ formData, setFormData }) {
  const [showNicheDropdown, setShowNicheDropdown] = useState(false);

  const handleNicheCheckboxChange = (value) => {
    const updatedNiche = formData.niche?.includes(value)
      ? formData.niche.filter((n) => n !== value)
      : [...(formData.niche || []), value];

    setFormData({ ...formData, niche: updatedNiche });
  };

  return (
    <div className="bg-white rounded-lg p-6 mb-6">
      <div className="flex items-center gap-2 text-green-700 mb-4 text-left">
        <Briefcase size={20} />
        <h2 className="text-lg font-semibold">Professional Details</h2>
      </div>

      <div className="space-y-4">
        <div className="text-left">
          <Tooltip text="What's your main field? Select the one that defines your work best.">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Domain of Expertise<span className="text-red-500">*</span>
            </label>
          </Tooltip>
          <select
            value={formData.domain}
            onChange={(e) =>
              setFormData({ ...formData, domain: e.target.value, niche: [] })
            }
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

        <div className="text-left relative">
          <Tooltip text="Pick or add at least two skills that highlight your expertise. (The more relevant, the better!)">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Niche & Skills<span className="text-red-500">*</span>
            </label>
          </Tooltip>

          <button
            type="button"
            onClick={() => setShowNicheDropdown(!showNicheDropdown)}
            disabled={!formData.domain}
            className="w-full flex justify-between items-center text-left p-2 border rounded-lg focus:ring-primary focus:border-primary bg-white"
          >
            {formData.niche?.length
              ? nicheOptions[formData.domain]
                ?.filter((n) => formData.niche.includes(n.value))
                .map((n) => n.label)
                .join(", ")
              : "Select your specific niche"}
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <ChevronDown size={16} className="inline-block ml-1" />
            </label>
          </button>

          {showNicheDropdown && formData.domain && (
            <div className="absolute z-10 mt-1 w-full max-h-60 overflow-y-auto bg-white border rounded-lg shadow-md p-2">
              {!formData.domain ? (
                <div className="text-sm text-gray-500 px-2 py-1 italic">
                  Please Select domain first
                </div>
              ) : (
                nicheOptions[formData.domain]?.map((niche) => (
                  <label
                    key={niche.value}
                    className="flex items-center gap-2 p-1 hover:bg-gray-50 rounded cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-green-600 rounded"
                      checked={formData.niche?.includes(niche.value)}
                      onChange={() => handleNicheCheckboxChange(niche.value)}
                    />
                    <span className="text-sm">{niche.label}</span>
                  </label>
                ))
              )}
            </div>
          )}
        </div>

        <div className="text-left">
          <Tooltip text="This is how clients will see you. Keep it clear and professional. (e.g., Career Strategist | Startup Mentor)">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Professional Title<span className="text-red-500">*</span>
            </label>
          </Tooltip>
          <input
            type="text"
            value={formData.professionalTitle}
            onChange={(e) =>
              setFormData({ ...formData, professionalTitle: e.target.value })
            }
            placeholder="e.g. Senior Software Engineer"
            className="w-full p-2 border rounded-lg focus:ring-primary focus:border-primary"
          />
        </div>

        <div className="text-left">
          <Tooltip text="Showcase your journey—how long have you been in this field?">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Years of Work Experience<span className="text-red-500">*</span>
            </label>
          </Tooltip>
          <input
            type="number"
            value={formData.experienceYears}
            onChange={(e) =>
              setFormData({
                ...formData,
                experienceYears: e.target.value
                  ? Math.max(0, Number(e.target.value))
                  : "",
              })
            }
            placeholder="Enter years of experience"
            min="0"
            className="w-full p-2 border rounded-lg focus:ring-primary focus:border-primary"
          />
        </div>
        <div className="mt-6 flex items-start gap-3 p-4 bg-blue-50 rounded-lg text-blue-700">
          <Lightbulb size={20} className="mt-1 flex-shrink-0" />
          <p className="text-sm">
            Tip: A well-detailed profile gets you noticed faster. Take a moment
            to craft it right!
          </p>
        </div>
      </div>
    </div>
  );
}

Tooltip.propTypes = {
  text: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
};

ProfessionalDetails.propTypes = {
  formData: PropTypes.shape({
    domain: PropTypes.string,
    niche: PropTypes.arrayOf(PropTypes.string),
    professionalTitle: PropTypes.string,
    experienceYears: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  }).isRequired,
  setFormData: PropTypes.func.isRequired
};