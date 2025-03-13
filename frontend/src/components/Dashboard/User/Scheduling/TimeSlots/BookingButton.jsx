import PropTypes from 'prop-types'

function BookingButton({ selectedTime, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`
        w-full py-3 rounded-lg font-medium transition-colors
        ${selectedTime 
          ? 'bg-green-600 text-white hover:bg-green-700' 
          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }
      `}
      disabled={!selectedTime}
    >
      {selectedTime ? 'Book Session' : 'Select Date and Time'}
    </button>
  )
}

BookingButton.propTypes = {
  selectedTime: PropTypes.string,
  onClick: PropTypes.func.isRequired
}

export default BookingButton