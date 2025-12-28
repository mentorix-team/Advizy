import PropTypes from 'prop-types'
import TimeSlot from './TimeSlot'
import TimeButton from './TimeButton'
import BookingButton from './BookingButton'
import { useTimeSlots } from '../hooks/useTimeSlots'
import { TIME_ZONES, DATE_FORMAT_OPTIONS } from '../constants/timeConfig'

function TimeSlots({ selectedDate }) {
  const {
    selectedPeriod,
    selectedTime,
    timeSlots,
    handlePeriodSelect,
    handleTimeSelect
  } = useTimeSlots()

  const handleBooking = () => {
    if (selectedTime) {
      // Handle booking logic
      // console.log('Booking for:', selectedDate, selectedTime)
    }
  }

  return (
    <div className="mt-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
        <h3 className="text-[15px] text-gray-900">
          Available Time Slots for {selectedDate.toLocaleDateString('en-US', DATE_FORMAT_OPTIONS.full)}
        </h3>
        <span className="text-[13px] text-gray-600 border border-gray-200 rounded-md px-3 py-1.5 whitespace-nowrap">
          {TIME_ZONES.IST.label}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
        {timeSlots.map((slot) => (
          <TimeSlot
            key={slot.id}
            {...slot}
            isSelected={selectedPeriod === slot.id}
            onSelect={() => handlePeriodSelect(slot.id)}
          />
        ))}
      </div>

      {selectedPeriod && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
          {timeSlots.find(slot => slot.id === selectedPeriod)?.times.map((time) => (
            <TimeButton
              key={time}
              time={time}
              isSelected={selectedTime === time}
              onClick={handleTimeSelect}
            />
          ))}
        </div>
      )}

      <BookingButton
        selectedTime={selectedTime}
        onClick={handleBooking}
      />
    </div>
  )
}

TimeSlots.propTypes = {
  selectedDate: PropTypes.instanceOf(Date).isRequired,
}

export default TimeSlots