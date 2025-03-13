import PropTypes from 'prop-types';

export default function FeatureInput({ value, onChange, onRemove }) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Add feature one per line"
        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-green-500"
      />
      <button
        type="button"
        onClick={onRemove}
        className="text-gray-400 hover:text-gray-600"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

FeatureInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};