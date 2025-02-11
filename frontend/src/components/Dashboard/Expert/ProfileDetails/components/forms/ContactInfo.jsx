import React from 'react';

const ContactInfo = ({ formData, setFormData, errors }) => {
  return (
    <div className="grid grid-cols-2 gap-6 mt-6">
      <div className="text-left">
        <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
        <div className="flex">
          <input
            type="tel"
            value={formData.mobile}
            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
            className={`w-full p-2 border rounded-lg focus:ring-primary focus:border-primary ${
              errors.mobile ? 'border-red-500' : ''
            }`}
            placeholder="+91 98765 43210"
          />
          <button className="ml-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-600">
            Verify
          </button>
        </div>
        {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
      </div>
      <div className="text-left">
        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
        <div className="flex">
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className={`w-full p-2 border rounded-lg focus:ring-primary focus:border-primary ${
              errors.email ? 'border-red-500' : ''
            }`}
            placeholder="john@example.com"
          />
          <button className="ml-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-600">
            Verify
          </button>
        </div>
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
      </div>
    </div>
  );
};

export default ContactInfo;