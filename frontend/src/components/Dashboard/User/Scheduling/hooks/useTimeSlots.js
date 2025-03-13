import { useState, useCallback } from 'react'
import { timeSlotData } from '../components/TimeSlots/timeSlotData'

export function useTimeSlots() {
  const [selectedPeriod, setSelectedPeriod] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)

  const handlePeriodSelect = useCallback((periodId) => {
    setSelectedPeriod(periodId)
    setSelectedTime(null)
  }, [])

  const handleTimeSelect = useCallback((time) => {
    setSelectedTime(time)
  }, [])

  const timeSlots = Object.entries(timeSlotData).map(([key, data]) => ({
    id: key,
    ...data
  }))

  return {
    selectedPeriod,
    selectedTime,
    timeSlots,
    handlePeriodSelect,
    handleTimeSelect
  }
}