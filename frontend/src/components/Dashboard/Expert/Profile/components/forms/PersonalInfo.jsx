import React from 'react';
import PropTypes from 'prop-types';

const PersonalInfo = ({ formData, setFormData, errors }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
      <div className="text-left">
        <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
        <input
          type="text"
          value={formData.firstName}
          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          className={`w-full p-2 border rounded-lg focus:ring-primary focus:border-primary ${
            errors.firstName ? 'border-red-500' : ''
          }`}
          placeholder="John"
        />
        {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
      </div>
      <div className="text-left">
        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
        <input
          type="text"
          value={formData.lastName}
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          className={`w-full p-2 border rounded-lg focus:ring-primary focus:border-primary ${
            errors.lastName ? 'border-red-500' : ''
          }`}
          placeholder="Doe"
        />
        {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
      </div>
      <div className="text-left">
        <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
        <select
          value={formData.gender}
          onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
          className={`w-full p-2 border rounded-lg focus:ring-primary focus:border-primary ${
            errors.gender ? 'border-red-500' : ''
          }`}
        >
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
      </div>
      <div className="text-left">
        <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
        <input
          type="date"
          value={formData.dateOfBirth}
          onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
          className={`w-full p-2 border rounded-lg focus:ring-primary focus:border-primary ${
            errors.dateOfBirth ? 'border-red-500' : ''
          }`}
        />
        {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
      </div>
      <div className="text-left">
        <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
        <select
          value={formData.nationality}
          onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
          className={`w-full p-2 border rounded-lg focus:ring-primary focus:border-primary ${
            errors.nationality ? 'border-red-500' : ''
          }`}
        >
          <option value="">Select nationality</option>
          <option value="in">Indian</option>
          <option value="us">American</option>
          <option value="uk">British</option>
        </select>
        {errors.nationality && <p className="text-red-500 text-sm mt-1">{errors.nationality}</p>}
      </div>
      <div className="text-left">
        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
        <input
          type="text"
          value={formData.city}
          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          className={`w-full p-2 border rounded-lg focus:ring-primary focus:border-primary ${
            errors.city ? 'border-red-500' : ''
          }`}
          placeholder="New Delhi"
        />
        {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
      </div>
    </div>
  );
};

PersonalInfo.propTypes = {
  formData: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

export default PersonalInfo;