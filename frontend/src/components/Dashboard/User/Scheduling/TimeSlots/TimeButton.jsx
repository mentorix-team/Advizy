import PropTypes from 'prop-types';

function TimeButton({ time, isSelected, onClick }) {
  const { startTime, endTime, isBooked } = time;

  return (
    <button
      onClick={() => !isBooked && onClick(time)}
      disabled={isBooked}
      className={`
        w-full py-2 text-[13px] border rounded-md transition-colors
        ${isBooked 
          ? 'border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed' 
          : isSelected 
          ? 'border-green-500 bg-green-50 text-green-700' 
          : 'border-gray-200 text-gray-900 hover:border-green-500'
        }
      `}
    >
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
    _id: PropTypes.string.isRequired,
  }).isRequired,
  isSelected: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
};

TimeButton.defaultProps = {
  isSelected: false, // Default to not selected
};

export default TimeButton;
