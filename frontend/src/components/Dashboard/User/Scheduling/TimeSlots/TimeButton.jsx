import PropTypes from 'prop-types';

function TimeButton({ time, isSelected, isLatest, onClick }) {
  const { startTime, endTime, isBooked, overlappingSlot } = time;

  return (
    <button
      onClick={() => !isBooked && onClick(time)}
      disabled={isBooked}
      title={isBooked ?
        (overlappingSlot ?
          `Unavailable due to already appointment: ${overlappingSlot.startTime}-${overlappingSlot.endTime}` :
          'This time slot is already booked'
        ) :
        `Book appointment from ${startTime} to ${endTime}`
      }
      className={`
        w-full py-2 text-[13px] border rounded-md transition-colors relative
        ${isBooked
          ? 'border-red-200 bg-red-50 text-red-400 cursor-not-allowed opacity-70 hover:opacity-60'
          : isSelected
            ? 'border-green-500 bg-green-50 text-green-700'
            : isLatest
              ? 'border-green-400 bg-green-100 text-green-800 shadow-lg ring-2 ring-green-200'
              : 'border-gray-200 text-gray-900 hover:border-green-500 hover:bg-green-50 hover:shadow-sm'
        }
      `}
    >
      {isLatest && !isBooked && (
        <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">
          Latest
        </span>
      )}
      {isBooked}
      <div className="flex items-center justify-center">
        {startTime} - {endTime}
        {isBooked && (
          <span className="text-xs text-red-500 ml-2">
          </span>
        )}
      </div>
    </button>
  );
}

TimeButton.propTypes = {
  time: PropTypes.shape({
    startTime: PropTypes.string.isRequired,
    endTime: PropTypes.string.isRequired,
    isBooked: PropTypes.bool,
    overlappingSlot: PropTypes.shape({
      startTime: PropTypes.string,
      endTime: PropTypes.string,
    }),
    _id: PropTypes.string,
  }).isRequired,
  isSelected: PropTypes.bool,
  isLatest: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
};

TimeButton.defaultProps = {
  isSelected: false,
  isLatest: false,
};

export default TimeButton;
