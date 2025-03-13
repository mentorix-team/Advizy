import { useState } from 'react'
import PropTypes from 'prop-types'
import CalendarHeader from './CalendarHeader'
import CalendarGrid from './CalendarGrid'
import { isCurrentMonth, isNextMonth } from '../../utils/dateUtils'

function Calendar({ selectedDate, onDateSelect }) {
  const today = new Date()
  const [currentDate, setCurrentDate] = useState(today)

  const handlePrevMonth = () => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    if (isCurrentMonth(newDate) || isNextMonth(newDate)) {
      setCurrentDate(newDate)
    }
  }

  const handleNextMonth = () => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    if (isCurrentMonth(newDate) || isNextMonth(newDate)) {
      setCurrentDate(newDate)
    }
  }

  // Disable prev button if current date is current month
  const canGoPrev = !isCurrentMonth(currentDate)
  // Disable next button if current date is next month
  const canGoNext = !isNextMonth(currentDate)

  return (
    <div className="bg-white rounded-lg p-3 sm:p-4">
      <CalendarHeader
        currentDate={currentDate}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        canGoPrev={canGoPrev}
        canGoNext={canGoNext}
      />
      <CalendarGrid
        currentDate={currentDate}
        selectedDate={selectedDate}
        onDateSelect={onDateSelect}
      />
    </div>
  )
}

Calendar.propTypes = {
  selectedDate: PropTypes.instanceOf(Date),
  onDateSelect: PropTypes.func.isRequired,
}

export default Calendar