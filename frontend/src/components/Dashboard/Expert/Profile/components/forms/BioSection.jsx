import React from 'react';

const BioSection = ({ formData, setFormData, errors }) => {
  return (
    <div className="mt-6 text-left">
      <label className="block text-sm font-medium text-gray-700 mb-1">Bio Description</label>
      <textarea
        value={formData.bio}
        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
        className={`w-full p-2 border rounded-lg focus:ring-primary focus:border-primary h-32 ${
          errors.bio ? 'border-red-500' : ''
        }`}
        placeholder="Write a short description about yourself"
      ></textarea>
      {errors.bio && <p className="text-red-500 text-sm mt-1">{errors.bio}</p>}
      <p className="text-sm text-gray-500 mt-1">
        Your bio is your chance to showcase your expertise and personality. Make it count!
      </p>
    </div>
  );
};

export default BioSection;