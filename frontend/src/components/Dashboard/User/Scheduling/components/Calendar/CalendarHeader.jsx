import PropTypes from 'prop-types'

function CalendarHeader({ currentDate, onPrevMonth, onNextMonth, canGoPrev, canGoNext }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <button 
        onClick={onPrevMonth}
        disabled={!canGoPrev}
        className={`p-2 rounded-full ${
          canGoPrev ? 'hover:bg-gray-100' : 'opacity-50 cursor-not-allowed'
        }`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div className="flex items-center gap-2">
        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span className="font-medium">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </span>
      </div>

      <button 
        onClick={onNextMonth}
        disabled={!canGoNext}
        className={`p-2 rounded-full ${
          canGoNext ? 'hover:bg-gray-100' : 'opacity-50 cursor-not-allowed'
        }`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )
}

CalendarHeader.propTypes = {
  currentDate: PropTypes.instanceOf(Date).isRequired,
  onPrevMonth: PropTypes.func.isRequired,
  onNextMonth: PropTypes.func.isRequired,
  canGoPrev: PropTypes.bool.isRequired,
  canGoNext: PropTypes.bool.isRequired,
}

export default CalendarHeader