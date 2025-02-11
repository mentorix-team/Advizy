import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

export default function FeatureInput({ features, onChange }) {
  const [newFeature, setNewFeature] = useState('');

  const handleAdd = () => {
    if (newFeature.trim()) {
      onChange([...features, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const handleRemove = (index) => {
    onChange(features.filter((_, i) => i !== index));
  };

  return (
    <div className="text-left">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Features (Optional)
      </label>
      
      {features.map((feature, index) => (
        <div key={index} className="flex items-center gap-2 mb-2">
          <div className="flex-1 p-2 bg-gray-50 rounded-lg">
            {feature}
          </div>
          <button
            type="button"
            onClick={() => handleRemove(index)}
            className="text-gray-500 hover:text-red-500"
          >
            <FaTimes />
          </button>
        </div>
      ))}

      <div className="flex gap-2">
        <input
          type="text"
          value={newFeature}
          onChange={(e) => setNewFeature(e.target.value)}
          placeholder="Add a feature"
          className="flex-1 p-2 border rounded-lg focus:ring-primary focus:border-primary"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-600"
        >
          + Add
        </button>
      </div>
    </div>
  );
}