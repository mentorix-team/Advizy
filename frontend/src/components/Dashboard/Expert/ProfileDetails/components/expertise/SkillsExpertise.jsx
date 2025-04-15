import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FaGraduationCap } from 'react-icons/fa';
import SkillTag from './SkillTag';

export default function SkillsExpertise({ formData, setFormData }) {
  const [newSkill, setNewSkill] = useState('');

  const addSkill = () => {
    if (newSkill && !formData.skills.includes(newSkill)) {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkill]
      });
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(skill => skill !== skillToRemove)
    });
  };

  return (
    <div className="bg-white rounded-lg p-6 mb-6">
      <div className="flex items-center gap-2 text-green-700 mb-4 text-left">
        <FaGraduationCap />
        <h2 className="text-lg font-semibold">Skills & Expertise</h2>
      </div>

      <div className="flex gap-2 mb-4">
        <div className="flex-1 p-2 border rounded-lg focus-within:ring-2 focus-within:ring-primary focus-within:border-primary">
          <div className="relative">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => {
                if(e.key === 'Enter'){
                  e.preventDefault();
                  addSkill();
                }
              }}
              placeholder="Add your skills."
              className="w-full focus:outline-none peer"
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
  setFormData: PropTypes.func.isRequired
};