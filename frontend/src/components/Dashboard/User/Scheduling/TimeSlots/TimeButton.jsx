import PropTypes from 'prop-types';

function TimeButton({ time, isSelected, isLatest, onClick }) {
  const { startTime, endTime, isBooked } = time;

  return (
    <button
      onClick={() => !isBooked && onClick(time)}
      disabled={isBooked}
      className={`
        w-full py-2 text-[13px] border rounded-md transition-colors relative
        ${isBooked 
          ? 'border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed' 
          : isSelected 
          ? 'border-green-500 bg-green-50 text-green-700' 
          : isLatest
          ? 'border-green-400 bg-green-100 text-green-800 shadow-lg ring-2 ring-green-200'
          : 'border-gray-200 text-gray-900 hover:border-green-500'
        }
      `}
    >
      {isLatest && (
        <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">
          Latest
        </span>
      )}
      {startTime} - {endTime}
      {isBooked && <span className="text-xs text-red-500 ml-2">(Booked)</span>}
    </button>
  );
}

TimeButton.propTypes = {
  time: PropTypes.shape({
    startTime: PropTypes.string.isRequired,
    endTime: PropTypes.string.isRequired,
    isBooked: PropTypes.bool,
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
