import PropTypes from 'prop-types';

export default function DurationToggle({ duration, price, enabled, onChange, onPriceChange, disabled }) {
  return (
    <label className={`relative inline-flex items-center ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
      <input
        type="checkbox"
        checked={enabled}
        onChange={(e) => !disabled && onChange(e.target.checked)}
        className="sr-only peer"
        disabled={disabled}
      />
      <div className="flex items-center gap-2 p-3 border rounded-md peer-checked:border-green-500 peer-checked:bg-green-50">
        <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="10" strokeWidth="2" />
          <path strokeWidth="2" d="M12 6v6l4 2" />
        </svg>
        <div>
          <div className="text-sm font-medium">{duration} min</div>
          {enabled ? (
            <input
              type="number"
              value={price}
              onChange={(e) => onPriceChange(parseInt(e.target.value))}
              className="w-20 text-sm text-gray-500 border rounded px-1"
              min="0"
            />
          ) : (
            <div className="text-sm text-gray-500">₹{price}</div>
          )}
        </div>
      </div>
    </label>
  );
}

DurationToggle.propTypes = {
  duration: PropTypes.number.isRequired,
  price: PropTypes.number.isRequired,
  enabled: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  onPriceChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};