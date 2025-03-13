import PropTypes from 'prop-types'

function TimeButton({ time, isSelected, onClick }) {
  return (
    <button
      onClick={() => onClick(time)}
      className={`
        w-full py-2 text-[13px] border rounded-md transition-colors
        ${isSelected 
          ? 'border-green-500 bg-green-50 text-green-700' 
          : 'border-gray-200 text-gray-900 hover:border-green-500'
        }
      `}
    >
      {time}
    </button>
  )
}

TimeButton.propTypes = {
  time: PropTypes.string.isRequired,
  isSelected: PropTypes.bool,
  onClick: PropTypes.func.isRequired
}

export default TimeButton