import PropTypes from 'prop-types';
import TimeButton from './TimeButton';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createMeet, getBookedSlots } from '@/Redux/Slices/meetingSlice';
import { CalendarX } from 'lucide-react';
import toast from 'react-hot-toast';

function TimeSlots({ selectedDate, sessionPrice, sessionDuration, selectedAvailability, expertId, serviceId, userName, serviceName, expertName, title, includes, serviceDescription }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [timeSlots, setTimeSlots] = useState([]);

  // Get booked slots from Redux store
  const { bookedSlots } = useSelector((state) => state.meeting);

  // Fetch booked slots when date or expert changes
  useEffect(() => {
    if (expertId && selectedDate) {
      const formattedDate = selectedDate.toLocaleDateString("en-CA");
      console.log("🔄 Fetching booked slots for:", { expertId, date: formattedDate });
      dispatch(getBookedSlots({ expertId, date: formattedDate }));
    }
  }, [dispatch, expertId, selectedDate]);

  // Debug log for booked slots
  useEffect(() => {
    console.log("📅 Booked slots updated:", bookedSlots);
  }, [bookedSlots]);

  // Helper function to check if two time slots overlap
  const parseTimeToMinutes = (timeStr) => {
    if (!timeStr) return null;

    const trimmed = timeStr.trim();
    const periodMatch = trimmed.match(/(AM|PM)$/i);
    let hoursMinutes = trimmed;
    let period = null;

    if (periodMatch) {
      period = periodMatch[1].toUpperCase();
      hoursMinutes = trimmed.replace(/(AM|PM)$/i, '').trim();
    }

    const [hoursStr, minutesStr] = hoursMinutes.split(':');
    const hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);

    if (Number.isNaN(hours) || Number.isNaN(minutes)) {
      return null;
    }

    let normalizedHours = hours;
    if (period) {
      if (period === 'PM' && normalizedHours !== 12) {
        normalizedHours += 12;
      }
      if (period === 'AM' && normalizedHours === 12) {
        normalizedHours = 0;
      }
    }

    return normalizedHours * 60 + minutes;
  };

  const doTimeSlotsOverlap = (slot1, slot2) => {
    const slot1Start = parseTimeToMinutes(slot1.startTime);
    const slot1End = parseTimeToMinutes(slot1.endTime);
    const slot2Start = parseTimeToMinutes(slot2.startTime);
    const slot2End = parseTimeToMinutes(slot2.endTime);

    if ([slot1Start, slot1End, slot2Start, slot2End].some((value) => value === null)) {
      return false;
    }

    // Check if slots overlap: 
    // Slot1 starts before Slot2 ends AND Slot2 starts before Slot1 ends
    return slot1Start < slot2End && slot2Start < slot1End;
  };



  useEffect(() => {
    if (!selectedAvailability?.availability || !selectedDate) {
      console.warn("Missing availability data or selectedDate");
      setTimeSlots([]);
      return;
    }

    // First, check if the selected date has specific date slots
    const specificDateSlots = getSpecificDateSlots();
    
    if (specificDateSlots && specificDateSlots.length > 0) {
      console.log("📅 Using specific date slots for:", selectedDate.toLocaleDateString());
      processAndGenerateSlots(specificDateSlots);
      return;
    }

    // Otherwise, use weekly availability
    const dayName = selectedDate.toLocaleString("en-US", { weekday: "long" });
    const dayData = selectedAvailability.availability.daySpecific.find(
      (day) => day.day === dayName
    );

    if (!dayData || !dayData.slots || dayData.slots.length === 0) {
      console.warn(`No slots available for ${dayName}`);
      setTimeSlots([]);
      return;
    }

    processAndGenerateSlots(dayData.slots);
  }, [selectedDate, selectedAvailability, sessionDuration, bookedSlots]);

  // Helper function to get specific date slots if the date matches
  const getSpecificDateSlots = () => {
    if (!selectedAvailability?.availability?.specific_dates || !Array.isArray(selectedAvailability.availability.specific_dates)) {
      return null;
    }

    // Format selected date as YYYY-MM-DD
    const selectedDateString = selectedDate.getFullYear() + '-' + 
      String(selectedDate.getMonth() + 1).padStart(2, '0') + '-' + 
      String(selectedDate.getDate()).padStart(2, '0');

    console.log(`🔍 Looking for specific date slots for: ${selectedDateString}`);
    console.log(`📅 Available specific dates:`, selectedAvailability.availability.specific_dates.map(d => ({
      date: typeof d.date === 'string' && d.date.length === 10 ? d.date : (new Date(d.date).toISOString().split('T')[0]),
      slotsCount: d.slots?.length || 0
    })));

    // Find matching specific date
    const matchingSpecificDate = selectedAvailability.availability.specific_dates.find(specificDate => {
      let specificDateValue;
      
      if (typeof specificDate.date === 'string') {
        if (specificDate.date.length === 10) {
          specificDateValue = specificDate.date;
        } else {
          specificDateValue = specificDate.date.split('T')[0];
        }
      } else if (specificDate.date) {
        const dateObj = new Date(specificDate.date);
        specificDateValue = dateObj.getUTCFullYear() + '-' + 
          String(dateObj.getUTCMonth() + 1).padStart(2, '0') + '-' + 
          String(dateObj.getUTCDate()).padStart(2, '0');
      }

      return selectedDateString === specificDateValue;
    });

    if (matchingSpecificDate && matchingSpecificDate.slots && matchingSpecificDate.slots.length > 0) {
      console.log("✅ Found specific date slots:", matchingSpecificDate.slots);
      return matchingSpecificDate.slots;
    }

    return null;
  };

  // Helper function to process and generate time slots from a slots array
  const processAndGenerateSlots = (slotsArray) => {
    const now = new Date();
    const noticePeriodMinutes = parseInt(selectedAvailability.availability.reschedulePolicy?.noticeperiod) || 0;
    const bookingPeriodMonths = parseInt(selectedAvailability.availability.bookingperiod) || 0;
    const maxBookingDate = new Date();
    maxBookingDate.setMonth(maxBookingDate.getMonth() + bookingPeriodMonths);

    if (selectedDate > maxBookingDate) {
      console.warn("Selected date exceeds booking period");
      setTimeSlots([]);
      return;
    }

    const generatedSlots = [];
    const batchSize = sessionDuration;
    const startTimeMap = {};

    slotsArray.forEach(slot => {
      // Handle both 24-hour (04:30) and 12-hour (4:30 AM) formats
      let startHour, startMinute, endHour, endMinute;
      let isStartPM = false, isEndPM = false;

      // Parse start time
      if (slot.startTime.includes(':')) {
        const parts = slot.startTime.split(':');
        startHour = parseInt(parts[0]);
        startMinute = parseInt(parts[1]);
        
        // Check if it's 12-hour format with AM/PM
        if (slot.startTime.includes('AM') || slot.startTime.includes('PM')) {
          isStartPM = slot.startTime.includes('PM');
        }
      }

      // Parse end time
      if (slot.endTime.includes(':')) {
        const parts = slot.endTime.split(':');
        endHour = parseInt(parts[0]);
        endMinute = parseInt(parts[1]);
        
        // Check if it's 12-hour format with AM/PM
        if (slot.endTime.includes('AM') || slot.endTime.includes('PM')) {
          isEndPM = slot.endTime.includes('PM');
        }
      }

      const start = new Date(selectedDate);
      start.setHours(isStartPM && startHour !== 12 ? startHour + 12 : startHour, startMinute, 0, 0);

      const end = new Date(selectedDate);
      end.setHours(isEndPM && endHour !== 12 ? endHour + 12 : endHour, endMinute, 0, 0);

      let currentTime = new Date(start);
      if (selectedDate.toDateString() === now.toDateString()) {
        let minAllowedTime = new Date(now);
        minAllowedTime.setMinutes(now.getMinutes() + noticePeriodMinutes);
        if (currentTime < minAllowedTime) {
          currentTime = new Date(minAllowedTime);
        }
      }

      currentTime.setMinutes(Math.ceil(currentTime.getMinutes() / batchSize) * batchSize, 0, 0);

      while (currentTime < end) {
        const nextTime = new Date(currentTime);
        nextTime.setMinutes(nextTime.getMinutes() + batchSize);
        if (nextTime <= end) {
          const slotKey = currentTime.toTimeString();
          if (!startTimeMap[slotKey]) {
            const timeSlot = {
              startTime: currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              endTime: nextTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };

            console.log(`     🎯 Generated time slot: ${timeSlot.startTime} - ${timeSlot.endTime}`);

            // Check if this slot overlaps with any booked slot
            const isBooked = bookedSlots.some(bookedSlot =>
              doTimeSlotsOverlap(timeSlot, bookedSlot)
            );

            console.log(`🔍 Checking slot ${timeSlot.startTime}-${timeSlot.endTime}: ${isBooked ? 'BLOCKED' : 'AVAILABLE'}`);
            if (isBooked) {
              const overlappingSlot = bookedSlots.find(bookedSlot => doTimeSlotsOverlap(timeSlot, bookedSlot));
              console.log(`   ↳ Overlaps with booked slot: ${overlappingSlot.startTime}-${overlappingSlot.endTime}`);
            }

            // Find the specific booked slot that causes overlap (if any)
            const overlappingBookedSlot = isBooked ?
              bookedSlots.find(bookedSlot => doTimeSlotsOverlap(timeSlot, bookedSlot)) : null;

            // Add slot with booked status and overlap info
            generatedSlots.push({
              ...timeSlot,
              isBooked: isBooked,
              overlappingSlot: overlappingBookedSlot
            });

            startTimeMap[slotKey] = true;
          }
        }
        currentTime = nextTime;
      }
    });

    console.log("📅 Generated slots:", generatedSlots);
    console.log("🔒 Booked slots from server:", bookedSlots);
    console.log("✅ Available slots count:", generatedSlots.filter(slot => !slot.isBooked).length);
    console.log("❌ Unavailable slots count:", generatedSlots.filter(slot => slot.isBooked).length);
    console.log("🔄 Session duration:", sessionDuration, "minutes");

    // Show overlap analysis
    const conflictSlots = generatedSlots.filter(slot => slot.isBooked && slot.overlappingSlot);
    if (conflictSlots.length > 0) {
      console.log("⚠️ Conflict slots due to overlaps:");
      conflictSlots.forEach(slot => {
        console.log(`   ${slot.startTime}-${slot.endTime} conflicts with ${slot.overlappingSlot.startTime}-${slot.overlappingSlot.endTime}`);
      });
    }

    setTimeSlots(generatedSlots);
  };

  const handleBooking = async (time) => {
    if (!userName) {
      toast.error("Please login to book a session", {
        position: "top-right",
        autoClose: 1500,
        pauseOnHover: true,
      });
      return;
    }

    // Prevent booking if slot is already booked
    if (time.isBooked) {
      toast.error("This time slot is already booked. Please select a different time.", {
        position: "top-right",
        autoClose: 3000,
        pauseOnHover: true,
      });
      return;
    }

    try {
      const formattedDate = selectedDate.toLocaleDateString("en-CA");
      const meetData = {
        expertId,
        serviceId,
        daySpecific: {
          date: formattedDate,
          slot: {
            startTime: time.startTime,
            endTime: time.endTime,
          },
        },
        userName,
        serviceName,
        expertName,
      };

      const result = await dispatch(createMeet(meetData)).unwrap();

      if (result) {
        // Refresh booked slots after successful booking
        dispatch(getBookedSlots({ expertId, date: formattedDate }));

        navigate(`/expert/payu-order-summary/`, {
          state: {
            durationforstate: sessionDuration,
            selectedDate: formattedDate,
            selectedTime: time,
            Price: sessionPrice,
            title: title,
            serviceDescription: serviceDescription,
            includes: includes
          },
        });
      }
    } catch (error) {
      console.error("Error during booking:", error);

      // Handle specific duplicate booking error
      if (error?.includes('already booked') || error?.includes('This time slot is already booked')) {
        toast.error("This time slot has already been booked. Please select a different time.", {
          position: "top-right",
          autoClose: 3000,
          pauseOnHover: true,
        });

        // Refresh booked slots to update the UI
        const formattedDate = selectedDate.toLocaleDateString("en-CA");
        dispatch(getBookedSlots({ expertId, date: formattedDate }));
      } else {
        toast.error("Failed to book the session. Please try again.", {
          position: "top-right",
          autoClose: 3000,
          pauseOnHover: true,
        });
      }
    }
  };

  if (timeSlots.length === 0) {
    return <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto p-6 rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="relative mb-4">
        <CalendarX className="w-12 h-12 text-[#16A348]" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1 text-center">No available slots</h3>
      <p className="text-gray-500 text-center">
        There are no available appointment slots for {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}.
        {/* This could be due to invalid time ranges in the expert's availability settings. */}
      </p>
    </div>;
  }

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[15px] text-gray-900">
          Time Slots for {selectedDate.toLocaleDateString('en-US')}
        </h3>
        {timeSlots.length > 0 && (
          <div className="flex items-center gap-4 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-50 border border-green-200 rounded"></div>
              <span>Available ({timeSlots.filter(slot => !slot.isBooked).length})</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-50 border border-red-200 rounded"></div>
              <span>Booked ({timeSlots.filter(slot => slot.isBooked).length})</span>
            </div>
          </div>
        )}
      </div>
      <div className="max-h-60 overflow-y-auto pr-1 mb-6">
        <div className="grid grid-cols-2 gap-3">
          {timeSlots.map((slot, index) => (
            <TimeButton
              key={index}
              time={slot}
              onClick={() => handleBooking(slot)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

TimeSlots.propTypes = {
  triggerAuthPopup: PropTypes.func.isRequired,
  selectedDate: PropTypes.instanceOf(Date).isRequired,
  sessionDuration: PropTypes.number.isRequired,
  selectedAvailability: PropTypes.object,
  expertId: PropTypes.string.isRequired,
  serviceId: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired,
  serviceName: PropTypes.string.isRequired,
  expertName: PropTypes.string.isRequired,
};

export default TimeSlots;