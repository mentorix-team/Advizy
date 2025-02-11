import { useState } from 'react';
import { useDispatch } from 'react-redux';
import FeaturesList from './FeaturesList';
import { createService } from '@/Redux/Slices/expert.Slice';

export default function ServiceForm({ }) {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    detailedDescription: '',
    duration: '15',
    price: '',
    features: [],
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Service name is required';
    if (!formData.shortDescription.trim()) newErrors.shortDescription = 'Short description is required';
    if (!formData.price) newErrors.price = 'Price is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    const serviceData = {
      ...formData,
      duration: parseInt(formData.duration, 10),
      price: parseInt(formData.price, 10),
    };
  
    try {
      // Dispatch the createService action
      await dispatch(createService(serviceData)).unwrap();
      
    } catch (error) {
      console.error("Error submitting service form:", error);
    }
  };
  

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-1">
          Service Name
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => {
            setFormData({ ...formData, title: e.target.value });
            if (errors.title) setErrors({ ...errors, title: undefined });
          }}
          placeholder="1-on-1 Call"
          className={`w-full px-3 py-2 rounded-lg border ${
            errors.title ? 'border-red-500' : 'border-gray-300'
          } focus:border-green-500 focus:ring-1 focus:ring-green-500`}
        />
        {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-1">
          Short Description
        </label>
        <input
          type="text"
          value={formData.shortDescription}
          onChange={(e) => {
            setFormData({ ...formData, shortDescription: e.target.value });
            if (errors.shortDescription) setErrors({ ...errors, shortDescription: undefined });
          }}
          placeholder="Brief description of your service"
          className={`w-full px-3 py-2 rounded-lg border ${
            errors.shortDescription ? 'border-red-500' : 'border-gray-300'
          } focus:border-green-500 focus:ring-1 focus:ring-green-500`}
        />
        {errors.shortDescription && <p className="mt-1 text-sm text-red-500">{errors.shortDescription}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-1">
          Detailed Description
        </label>
        <textarea
          value={formData.detailedDescription}
          onChange={(e) => setFormData({ ...formData, detailedDescription: e.target.value })}
          placeholder="Detailed information about the service"
          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-1 focus:ring-green-500"
          rows={4}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">
            Duration (minutes)
          </label>
          <select
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-1 focus:ring-green-500"
          >
            <option value="15">15</option>
            <option value="30">30</option>
            <option value="45">45</option>
            <option value="60">60</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">
            Price (₹)
          </label>
          <input
            type="number"
            min="0"
            value={formData.price}
            onChange={(e) => {
              const value = Math.max(0, Number(e.target.value));
              setFormData({ ...formData, price: value.toString() });
              if (errors.price) setErrors({ ...errors, price: undefined });
            }}
            placeholder="25"
            className={`w-full px-3 py-2 rounded-lg border ${
              errors.price ? 'border-red-500' : 'border-gray-300'
            } focus:border-green-500 focus:ring-1 focus:ring-green-500`}
          />
          {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
        </div>
      </div>

      <FeaturesList
        features={formData.features}
        onChange={(features) => setFormData({ ...formData, features })}
      />

      <button
        type="submit"
        className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
      >
        Save Changes
      </button>
    </form>
  );
}
