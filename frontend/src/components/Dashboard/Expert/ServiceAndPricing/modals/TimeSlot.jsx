export function TimeSlot({ duration, price, onChange }) {
  return (
    <div className="flex items-center gap-3 p-3 border rounded-md">
      <div className="flex-shrink-0">
        <select
          value={duration || '15'}
          onChange={(e) => onChange('duration', parseInt(e.target.value))}
          className="block w-24 rounded-md border-gray-300 text-sm"
        >
          <option value="15">15 min</option>
          <option value="30">30 min</option>
          <option value="45">45 min</option>
          <option value="60">60 min</option>
          <option value="90">90 min</option>
        </select>
      </div>
      <div className="flex-1">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
          <input
            type="number"
            value={price || ''}
            onChange={(e) => onChange('price', parseInt(e.target.value) || 0)}
            className="block w-full pl-7 pr-3 py-2 rounded-md border-gray-300 text-sm"
            placeholder="25"
            min="0"
            required
          />
        </div>
      </div>
    </div>
  )
}