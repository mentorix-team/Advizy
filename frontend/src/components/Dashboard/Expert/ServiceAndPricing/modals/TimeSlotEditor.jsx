import PropTypes from 'prop-types';

export default function TimeSlotEditor({ duration, price, onChange }) {
  const durations = [15, 30, 45, 60, 90];

  return (
    <div className="flex flex-col gap-2 p-3 border rounded-md bg-white">
      <div className="flex items-center gap-2">
        <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="10" strokeWidth="2" />
          <path strokeWidth="2" d="M12 6v6l4 2" />
        </svg>
        <select
          value={duration}
          onChange={(e) => onChange({ duration: parseInt(e.target.value), price })}
          className="text-sm border rounded px-2 py-1 w-24"
        >
          {durations.map(d => (
            <option key={d} value={d}>{d} min</option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">₹</span>
        <input
          type="number"
          value={price}
          onChange={(e) => onChange({ duration, price: parseInt(e.target.value) })}
          className="w-20 text-sm border rounded px-2 py-1"
          min="0"
        />
      </div>
    </div>
  );
}

TimeSlotEditor.propTypes = {
  duration: PropTypes.number.isRequired,
  price: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};