import React, { useState, useEffect } from 'react';
import ProfessionalDetails from './ProfessionalDetails';
import SkillsExpertise from './SkillsExpertise';
import ExpertisePreview from './ExpertisePreview';
import { toast } from 'react-hot-toast';

export default function ExpertiseTab({ formData, onUpdate }) {
  const [localFormData, setLocalFormData] = useState(formData);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    setLocalFormData(formData);
  }, [formData]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!localFormData.domain || localFormData.domain === '') {
      newErrors.domain = 'Domain of expertise is required';
    }
    if (!localFormData.niche || localFormData.niche === '') {
      newErrors.niche = 'Niche is required';
    }
    if (!localFormData.professionalTitle || localFormData.professionalTitle === '') {
      newErrors.professionalTitle = 'Professional title is required';
    }
    if (!localFormData.experienceYears) {
      newErrors.experienceYears = 'Experience in years is required';
    } else if (!/^\d+$/.test(localFormData.experienceYears)) {
      newErrors.experienceYears = 'Please enter a valid number';
    }
    if (!localFormData.skills || localFormData.skills.length === 0) {
      newErrors.skills = 'At least one skill is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (newData) => {
    const updatedData = { ...localFormData, ...newData };
    setLocalFormData(updatedData);
    onUpdate(updatedData);
    
    if (validateForm()) {
      toast.success('Expertise updated successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateForm();
  };

  return (
    <div className="py-6">
      <div className="bg-green-50 p-4 rounded-lg mb-6 text-left">
        <h3 className="text-xl font-semibold text-green-800 mb-2">Showcase Your Expertise</h3>
        <p className="text-green-700">
          Highlighting your expertise helps potential clients understand your strengths and increases your chances of getting hired for projects that match your skills.
        </p>
      </div>

      <ProfessionalDetails 
        formData={localFormData} 
        setFormData={handleChange}
        errors={errors}
        touched={touched}
        onBlur={handleBlur}
      />
      <SkillsExpertise 
        formData={localFormData} 
        setFormData={handleChange} 
      />
      <ExpertisePreview formData={localFormData} />
    </div>
  );
}