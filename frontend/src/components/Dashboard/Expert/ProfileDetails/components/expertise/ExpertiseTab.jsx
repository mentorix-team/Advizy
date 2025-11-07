import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import ProfessionalDetails from './ProfessionalDetails';
import SkillsExpertise from './SkillsExpertise';

export const validateProfessionalDetailsData = (data = {}) => {
  const errors = {};

  if (!data.domain || data.domain === '') {
    errors.domain = 'Domain of expertise is required';
  }

  const hasNiche = Array.isArray(data.niche)
    ? data.niche.length > 0
    : typeof data.niche === 'string' && data.niche.trim() !== '';

  if (!hasNiche) {
    errors.niche = 'Niche is required';
  }

  if (!data.professionalTitle || data.professionalTitle.trim() === '') {
    errors.professionalTitle = 'Professional title is required';
  }

  const experienceValue = data.experienceYears;
  if (experienceValue === undefined || experienceValue === null || experienceValue === '') {
    errors.experienceYears = 'Experience in years is required';
  } else if (Number.isNaN(Number(experienceValue)) || Number(experienceValue) < 0) {
    errors.experienceYears = 'Please enter a valid number';
  }

  if (!Array.isArray(data.skills) || data.skills.length === 0) {
    errors.skills = 'At least one skill is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

const ExpertiseTab = ({ formData, onUpdate, forceValidationKey }, ref) => {
  const [localFormData, setLocalFormData] = useState(formData);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    setLocalFormData(formData);
  }, [formData]);

  useEffect(() => {
    if (!forceValidationKey) {
      return;
    }

    setTouched((prev) => ({
      ...prev,
      domain: true,
      niche: true,
      professionalTitle: true,
      experienceYears: true,
      skills: true,
    }));

    runValidation();
  }, [forceValidationKey]);

  const runValidation = (dataToValidate = localFormData) => {
    const { errors: validationErrors, isValid } = validateProfessionalDetailsData(dataToValidate);
    setErrors(validationErrors);
    return isValid;
  };

  const handleChange = (newData) => {
    const updatedData = { ...localFormData, ...newData };
    setLocalFormData(updatedData);
    onUpdate(updatedData);
    runValidation(updatedData);
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    runValidation();
  };

  useImperativeHandle(ref, () => ({
    validateAndTouch: () => {
      const requiredFields = {
        domain: true,
        niche: true,
        professionalTitle: true,
        experienceYears: true,
        skills: true,
      };

      setTouched((prev) => ({ ...prev, ...requiredFields }));
      return runValidation();
    },
  }));

  return (
    <div className="py-6">
      <div className="bg-green-50 p-4 rounded-lg mb-6 text-left">
        <h3 className="text-xl font-semibold text-green-800 mb-2">Showcase Your Expertise</h3>
        <p className="text-green-700">
          Your profile is your first impression. Make it count!
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
        errors={errors}
        touched={touched}
        onBlur={handleBlur}
      />
      {/* <ExpertisePreview formData={localFormData} /> */}
    </div>
  );
};

export default forwardRef(ExpertiseTab);