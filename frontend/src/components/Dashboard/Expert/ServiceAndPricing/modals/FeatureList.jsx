export function FeatureList({ features, onFeatureChange, onAddFeature, onRemoveFeature }) {
  return (
    <div>
      <div className="space-y-3">
        {features.map((feature, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              value={feature}
              onChange={(e) => onFeatureChange(index, e.target.value)}
              className="flex-1 rounded-md border border-gray-300 px-3 py-2"
              placeholder="Add feature one per line"
            />
            <button
              type="button"
              onClick={() => onRemoveFeature(index)}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={onAddFeature}
        className="w-full mt-3 py-2.5 border-2 border-dashed border-gray-300 rounded-lg text-green-600 hover:border-green-500 hover:text-green-700 transition-colors text-sm font-medium"
      >
        + Add Feature
      </button>
    </div>
  );
}