export function TimeSlotSelector({ duration, price, onChange }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Duration (minutes)</label>
        <select
          value={duration}
          onChange={(e) => onChange('duration', e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          required
        >
          <option value="15">15</option>
          <option value="30">30</option>
          <option value="45">45</option>
          <option value="60">60</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Price (INR)</label>
        <input
          type="number"
          value={price}
          onChange={(e) => onChange('price', e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          placeholder="100"
          required
          min="0"
        />
      </div>
    </div>
  )
}