import { ClockIcon } from '../icons'

export function SingleTimeSlot({ timeSlot, onChange }) {
  return (
    <div className="flex items-center gap-4 p-4 border rounded-md">
      <div className="flex items-center gap-2">
        <ClockIcon />
        <select
          value={timeSlot.duration}
          onChange={(e) => onChange({ ...timeSlot, duration: parseInt(e.target.value) })}
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
            value={timeSlot.price || ''}
             onChange={(e) => {
               const priceNum = parseInt(e.target.value) || 0;
               // Prevent zero price
               if (priceNum <= 0) {
                 return;
               }
               onChange({ ...timeSlot, price: priceNum });
             }}
            className="block w-full pl-7 pr-3 py-2 rounded-md border-gray-300 text-sm"
            placeholder="25"
            min="1"
            required
          />
        </div>
      </div>
    </div>
  )
}