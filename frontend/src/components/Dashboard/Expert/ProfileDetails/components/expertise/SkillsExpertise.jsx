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
        <input
          type="text"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          placeholder="Add your skills"
          className="flex-1 p-2 border rounded-lg focus:ring-primary focus:border-primary"
        />
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
       {/* Bio Description */}
       <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Bio Description
        </label>
        <textarea
          value={formData.bio}
          onChange={(e) => handleChange("bio", e.target.value)}
          onBlur={() => onBlur("bio")}
          placeholder="Write a short description about yourself. For Example:
                      I am a certified career coach with 5+ years of experience helping professionals navigate career transitions and achieve their goals. I specialize in resume building, interview preparation, and career planning."
          rows={4}
          className={`w-full p-2.5 border ${
            errors.bio && touched.bio ? "border-red-500" : "border-gray-300"
          } rounded-lg focus:ring-1 focus:ring-primary`}
        />
        <p className="text-sm text-gray-500 mt-1">
          Your bio is your chance to showcase your expertise and personality.
          Make it count!
        </p>
        {errors.bio && touched.bio && (
          <p className="text-red-500 text-sm mt-1">{errors.bio}</p>
        )}
      </div>

    </div>
    
  );
}

SkillsExpertise.propTypes = {
  formData: PropTypes.shape({
    skills: PropTypes.arrayOf(PropTypes.string)
  }).isRequired,
  setFormData: PropTypes.func.isRequired
};