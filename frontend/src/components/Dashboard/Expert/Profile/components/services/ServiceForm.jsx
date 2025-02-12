import React from 'react';
import PropTypes from 'prop-types';
import TimeSlotInput from './TimeSlotInput';
import FeatureInput from './FeatureInput';
import { toast } from 'react-hot-toast';

export default function ServiceForm({ onSave, onCancel, initialData }) {
  const [formData, setFormData] = React.useState(initialData || {
    serviceName: '',
    shortDescription: '',
    detailedDescription: '',
    timeSlots: [],
    features: []
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="bg-white rounded-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Add New Service</h2>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="text-left">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Service Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.serviceName}
            onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
            className="w-full p-2 border rounded-lg focus:ring-primary focus:border-primary"
            placeholder="1-on-1 Call"
            required
          />
        </div>

        <div className="text-left">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Short Description <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.shortDescription}
            onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
            className="w-full p-2 border rounded-lg focus:ring-primary focus:border-primary"
            placeholder="Personal consultation session tailored to your specific needs"
            required
          />
        </div>

        <div className="text-left">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Detailed Description (Optional)
          </label>
          <textarea
            value={formData.detailedDescription}
            onChange={(e) => setFormData({ ...formData, detailedDescription: e.target.value })}
            className="w-full p-2 border rounded-lg focus:ring-primary focus:border-primary h-32"
            placeholder="Provide a detailed description of your service..."
          />
        </div>

        <TimeSlotInput
          timeSlots={formData.timeSlots}
          onAdd={(slot) => setFormData({ ...formData, timeSlots: [...formData.timeSlots, slot] })}
          onRemove={(index) => setFormData({
            ...formData,
            timeSlots: formData.timeSlots.filter((_, i) => i !== index)
          })}
        />

        <FeatureInput
          features={formData.features}
          onChange={(features) => setFormData({ ...formData, features })}
        />

        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-600"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

ServiceForm.propTypes = {
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  initialData: PropTypes.object
};