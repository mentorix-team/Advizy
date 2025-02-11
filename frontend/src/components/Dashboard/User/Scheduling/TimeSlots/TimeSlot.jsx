import PropTypes from 'prop-types';

function TimeSlot({ title, slots, isSelected, onSelect }) {
  return (
    <div
      className={`
        p-4 border rounded-lg cursor-pointer transition-colors
        ${isSelected ? 'border-green-500 bg-green-50' : 'border-gray-200'}
        hover:border-green-500
      `}
      onClick={onSelect}
    >
      <div>
        <h4 className="text-[15px] font-medium text-gray-900">{title}</h4>
        <div className="text-[13px] text-gray-500">
          {slots.map((slot, index) => (
            <p key={index}>
              {slot.startTime} - {slot.endTime} ({slot.isBooked ? 'Booked' : 'Available'})
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

TimeSlot.propTypes = {
  title: PropTypes.string.isRequired,
  slots: PropTypes.arrayOf(
    PropTypes.shape({
      startTime: PropTypes.string.isRequired,
      endTime: PropTypes.string.isRequired,
      isBooked: PropTypes.bool.isRequired,
    })
  ).isRequired,
  isSelected: PropTypes.bool,
  onSelect: PropTypes.func.isRequired,
};

export default TimeSlot;
