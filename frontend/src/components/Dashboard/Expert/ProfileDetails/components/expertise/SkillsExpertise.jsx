import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FaGraduationCap } from 'react-icons/fa';
import SkillTag from './SkillTag';

export default function SkillsExpertise({
  formData,
  setFormData,
  errors = {},
  touched = {},
  onBlur = () => { },
}) {
  const [newSkill, setNewSkill] = useState('');

  const addSkill = () => {
    const trimmedSkill = newSkill.trim();
    if (trimmedSkill && !formData.skills.includes(trimmedSkill)) {
      setFormData({
        ...formData,
        skills: [...formData.skills, trimmedSkill],
      });
      setNewSkill('');
      onBlur('skills');
    } else if (!trimmedSkill) {
      onBlur('skills');
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(skill => skill !== skillToRemove)
    });
    onBlur('skills');
  };

  const skillError = touched.skills && errors.skills ? errors.skills : '';

  return (
    <div className="bg-white rounded-lg p-0 mb-6">
      <div className="flex items-center gap-2 text-green-700 mb-4 text-left">
        <FaGraduationCap />
        <h2 className="text-lg font-semibold">Skills & Expertise <span className="text-red-500">*</span></h2>
      </div>

      <div className="flex gap-2 mb-4">
        <div
          className={`flex-1 p-2 border rounded-lg focus-within:ring-2 focus-within:ring-primary focus-within:border-primary ${skillError ? 'border-red-500 focus-within:ring-red-500 focus-within:border-red-500' : ''
            }`}
        >
          <div className="relative">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addSkill();
                }
              }}
              placeholder="Add your skills."
              className="w-full focus:outline-none peer"
              onBlur={() => onBlur('skills')}
            />
            <div className="absolute left-0 top-0 pointer-events-none text-gray-400 flex gap-2 peer-focus:hidden peer-[:not(:placeholder-shown)]:hidden">
              <span className="opacity-0">Add your skills    </span>
              <span className="inline-flex items-center px-5 py-0.5 rounded-full text-sm bg-gray-100">Business strategy</span>
              <span className="inline-flex items-center px-5 py-0.5 rounded-full text-sm bg-gray-100">Career counselor</span>
            </div>
          </div>
        </div>
        <button
          onClick={addSkill}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-600"
        >
          +
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {formData.skills.map((skill) => (
          <SkillTag key={skill} skill={skill} onRemove={removeSkill} />
        ))}
      </div>

      {skillError && (
        <p className="mt-1 text-sm text-red-600 text-left">{skillError}</p>
      )}

      <p className="text-sm text-gray-500 mt-4 text-left">
        <span className="mr-2">ℹ️</span>
        Add skills that are relevant to your expertise and the services you offer.
      </p>
    </div>
  );
}

SkillsExpertise.propTypes = {
  formData: PropTypes.shape({
    skills: PropTypes.arrayOf(PropTypes.string)
  }).isRequired,
  setFormData: PropTypes.func.isRequired,
  errors: PropTypes.object,
  touched: PropTypes.object,
  onBlur: PropTypes.func,
};

SkillsExpertise.defaultProps = {
  errors: {},
  touched: {},
  onBlur: () => { },
};