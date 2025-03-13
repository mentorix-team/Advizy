import { ClockIcon } from './icons';

export default function TimeSlot({ duration, price }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 rounded-full text-sm text-green-700">
      <ClockIcon />
      <span>{duration} min - ₹{price}</span>
    </div>
  );
}