export function TimeSlotsList({ timeSlots, onChange }) {
  const addTimeSlot = () => {
    onChange([...timeSlots, { duration: 15, price: 25 }]);
  };

  return (
    <div className="space-y-3">
      {timeSlots.map((slot, index) => (
        <TimeSlot
          key={index}
          duration={slot.duration}
          price={slot.price}
          onRemove={() => {
            const newSlots = timeSlots.filter((_, i) => i !== index);
            onChange(newSlots);
          }}
        />
      ))}
      <button
        type="button"
        onClick={addTimeSlot}
        className="w-full py-2.5 border-2 border-dashed border-gray-300 rounded-lg text-green-600 hover:border-green-500 hover:text-green-700 transition-colors text-sm font-medium"
      >
        + Add Time Slot
      </button>
    </div>
  );
}