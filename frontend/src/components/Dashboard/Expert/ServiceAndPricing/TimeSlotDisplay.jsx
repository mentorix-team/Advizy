import TimeIcon from './icons/TimeIcon'

export function TimeSlotDisplay({ timeSlots = [] }) {
  if (!timeSlots.length) return null

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {timeSlots.map((slot, index) => (
        <div
          key={index}
          className="flex items-center gap-1 text-sm text-gray-600 bg-green-50 px-3 py-1.5 rounded-full"
        >
          <TimeIcon />
          <span>{slot.duration} min - ₹{slot.price}</span>
        </div>
      ))}
    </div>
  )
}