import PropTypes from 'prop-types';

function CalendarHeader({ currentDate, onPrevMonth, onNextMonth, canGoPrev, canGoNext }) {
  return (
    <div className="flex items-center justify-between">
      <button
        onClick={onPrevMonth}
        disabled={!canGoPrev}
        className={`
          p-2 rounded-full flex items-center justify-center
          ${canGoPrev ? 'text-gray-600 hover:bg-gray-100' : 'text-gray-300 cursor-not-allowed'}
        `}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <h2 className="flex items-center text-gray-900 font-semibold">
        <span className="text-lg">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </span>
      </h2>

      <button
        onClick={onNextMonth}
        disabled={!canGoNext}
        className={`
          p-2 rounded-full flex items-center justify-center
          ${canGoNext ? 'text-gray-600 hover:bg-gray-100' : 'text-gray-300 cursor-not-allowed'}
        `}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}

CalendarHeader.propTypes = {
  currentDate: PropTypes.instanceOf(Date).isRequired,
  onPrevMonth: PropTypes.func.isRequired,
  onNextMonth: PropTypes.func.isRequired,
  canGoPrev: PropTypes.bool.isRequired,
  canGoNext: PropTypes.bool.isRequired,
};

export default CalendarHeader;