import PropTypes from 'prop-types'

function TimeSlot({ title, timeRange, slots, isSelected, onSelect }) {
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
        <p className="text-[13px] text-gray-500">{timeRange}</p>
        <span className="text-[13px] text-gray-500">({slots} slots)</span>
      </div>
    </div>
  )
}

TimeSlot.propTypes = {
  title: PropTypes.string.isRequired,
  timeRange: PropTypes.string.isRequired,
  slots: PropTypes.number.isRequired,
  isSelected: PropTypes.bool,
  onSelect: PropTypes.func.isRequired,
}

export default TimeSlot