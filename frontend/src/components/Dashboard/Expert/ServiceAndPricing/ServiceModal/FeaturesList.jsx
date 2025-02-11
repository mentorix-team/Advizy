import { useState } from "react";

export default function FeaturesList({ features, onChange }) {
  const [newFeature, setNewFeature] = useState("");

  const addFeature = () => {
    if (!newFeature.trim()) return;
    onChange([...features, newFeature.trim()]);
    setNewFeature(""); // Clear the input after adding
  };

  const removeFeature = (index) => {
    onChange(features.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-900 mb-1">Add New Feature</label>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newFeature}
          onChange={(e) => setNewFeature(e.target.value)}
          placeholder="Enter new feature"
          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-1 focus:ring-green-500"
        />
        <button
          type="button"
          onClick={addFeature}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Add Feature
        </button>
      </div>

      <label className="block text-sm font-medium text-gray-900 mb-1">Features List</label>
      <div className="space-y-2">
        {features.map((feature, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              value={feature}
              onChange={(e) => {
                const newFeatures = [...features];
                newFeatures[index] = e.target.value;
                onChange(newFeatures);
              }}
              placeholder="Edit feature"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-1 focus:ring-green-500"
            />
            <button
              type="button"
              onClick={() => removeFeature(index)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
