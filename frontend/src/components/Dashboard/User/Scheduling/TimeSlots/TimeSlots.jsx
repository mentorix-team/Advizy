import PropTypes from 'prop-types';
import TimeButton from './TimeButton';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createMeet, getBookedSlots } from '@/Redux/Slices/meetingSlice';
import { CalendarX } from 'lucide-react';
import toast from 'react-hot-toast';
import { convert24To12Hour } from '@/utils/timeValidation';

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



  // Helper function to check if a date is blocked
  const isDateBlocked = (date) => {
    if (!selectedAvailability?.availability?.blockedDates || !Array.isArray(selectedAvailability.availability.blockedDates)) {
      return false;
    }

    // Get the date in YYYY-MM-DD format in local timezone
    const localDateString = date.getFullYear() + '-' +
      String(date.getMonth() + 1).padStart(2, '0') + '-' +
      String(date.getDate()).padStart(2, '0');

    return selectedAvailability.availability.blockedDates.some(blockedDate => {
      try {
        let blockedDateValue;

        // Handle different blocked date formats
        if (typeof blockedDate === 'string') {
          blockedDateValue = blockedDate;
        } else if (blockedDate && blockedDate.dates) {
          const blockedDateObj = new Date(blockedDate.dates);
          blockedDateValue = blockedDateObj.getUTCFullYear() + '-' +
            String(blockedDateObj.getUTCMonth() + 1).padStart(2, '0') + '-' +
            String(blockedDateObj.getUTCDate()).padStart(2, '0');
        } else if (blockedDate && blockedDate.date) {
          const blockedDateObj = new Date(blockedDate.date);
          blockedDateValue = blockedDateObj.getUTCFullYear() + '-' +
            String(blockedDateObj.getUTCMonth() + 1).padStart(2, '0') + '-' +
            String(blockedDateObj.getUTCDate()).padStart(2, '0');
        } else {
          return false;
        }

        return localDateString === blockedDateValue;
      } catch (error) {
        console.warn('Error parsing blocked date:', blockedDate, error);
        return false;
      }
    });
  };

  // Helper function to get specific date slots for a date
  const getSpecificDateSlots = (date) => {
    if (!selectedAvailability?.availability?.specific_dates || !Array.isArray(selectedAvailability.availability.specific_dates)) {
      return null;
    }

    // Get the date in YYYY-MM-DD format in local timezone
    const localDateString = date.getFullYear() + '-' +
      String(date.getMonth() + 1).padStart(2, '0') + '-' +
      String(date.getDate()).padStart(2, '0');

    const specificDate = selectedAvailability.availability.specific_dates.find(specificDate => {
      try {
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
        } else {
          return false;
        }

        return localDateString === specificDateValue;
      } catch (error) {
        console.warn('Error parsing specific date:', specificDate, error);
        return false;
      }
    });

    return specificDate?.slots && specificDate.slots.length > 0 ? specificDate.slots : null;
  };

  useEffect(() => {
    console.log("📊 [TimeSlots] useEffect triggered");
    console.log("📊 [TimeSlots] selectedAvailability:", selectedAvailability);
    console.log("📊 [TimeSlots] selectedAvailability?.availability:", selectedAvailability?.availability);
    console.log("📊 [TimeSlots] daySpecific:", selectedAvailability?.availability?.daySpecific);
    console.log("📊 [TimeSlots] selectedDate:", selectedDate);

    if (!selectedDate) {
      console.warn("Missing selectedDate");
      setTimeSlots([]);
      return;
    }

    // ⭐ CHECK SPECIFIC DATE SLOTS FIRST (HIGHEST PRIORITY)
    const specificDateSlots = getSpecificDateSlots(selectedDate);
    console.log("📅 [TimeSlots] Specific date slots found?", specificDateSlots);

    if (specificDateSlots) {
      console.log("✨ [TimeSlots] Using specific date slots (highest priority)");
      // Use specific date slots and skip blocked date check
    } else {
      // Only check for blocked dates if there are no specific date slots
      const dateIsBlocked = isDateBlocked(selectedDate);
      console.log("🚫 [TimeSlots] Is selected date blocked?", dateIsBlocked);

      if (dateIsBlocked) {
        console.warn("Selected date is blocked by expert");
        setTimeSlots([]);
        return;
      }
    }

    if (!selectedAvailability?.availability?.daySpecific) {
      console.warn("Missing availability data");
      setTimeSlots([]);
      return;
    }

    // ⭐ DETERMINE WHICH SLOTS TO USE
    let slotsToUse = null;
    let sourceType = null;

    if (specificDateSlots) {
      slotsToUse = specificDateSlots;
      sourceType = 'specific';
      console.log("✨ [TimeSlots] Using SPECIFIC DATE slots");
    } else {
      const dayName = selectedDate.toLocaleString("en-US", { weekday: "long" });
      console.log("📅 [TimeSlots] Looking for WEEKLY day:", dayName);

      const dayData = selectedAvailability.availability.daySpecific.find(
        (day) => day.day === dayName
      );

      console.log("📅 [TimeSlots] Found dayData:", dayData);

      if (!dayData || !dayData.slots || dayData.slots.length === 0) {
        console.warn(`No slots available for ${dayName}`);
        setTimeSlots([]);
        return;
      }

      slotsToUse = dayData.slots;
      sourceType = 'weekly';
      console.log("📅 [TimeSlots] Using WEEKLY slots");
    }

    console.log("⏰ [TimeSlots] Slots to process:", slotsToUse);
    console.log("⏰ [TimeSlots] First slot example:", slotsToUse[0]);
    console.log("⏰ [TimeSlots] First slot startTime type:", typeof slotsToUse[0]?.startTime);
    console.log("⏰ [TimeSlots] First slot startTime value:", slotsToUse[0]?.startTime);

    const now = new Date();
    const noticePeriodMinutes = parseInt(selectedAvailability.availability.reschedulePolicy.noticeperiod) || 0;
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

    slotsToUse.forEach((slot, slotIndex) => {
      console.log(`\n🔄 [TimeSlots] Processing ${sourceType} slot ${slotIndex}:`, slot);

      // Handle both 24-hour format (00:30) and 12-hour format (12:30 AM)
      let startHour24, startMinute, endHour24, endMinute;

      // Check if the time contains AM/PM
      if (slot.startTime && (slot.startTime.includes('AM') || slot.startTime.includes('PM'))) {
        console.log(`⏰ [TimeSlots] Slot ${slotIndex} is in 12-hour format with AM/PM`);
        // Time is in 12-hour format, parse it differently
        const startParts = slot.startTime.split(' ');
        const [startHourStr, startMinStr] = startParts[0].split(':');
        const startModifier = startParts[1];
        startHour24 = parseInt(startHourStr, 10);
        startMinute = parseInt(startMinStr, 10);

        if (startModifier === 'PM' && startHour24 !== 12) {
          startHour24 += 12;
        } else if (startModifier === 'AM' && startHour24 === 12) {
          startHour24 = 0;
        }

        const endParts = slot.endTime.split(' ');
        const [endHourStr, endMinStr] = endParts[0].split(':');
        const endModifier = endParts[1];
        endHour24 = parseInt(endHourStr, 10);
        endMinute = parseInt(endMinStr, 10);

        if (endModifier === 'PM' && endHour24 !== 12) {
          endHour24 += 12;
        } else if (endModifier === 'AM' && endHour24 === 12) {
          endHour24 = 0;
        }
      } else {
        console.log(`⏰ [TimeSlots] Slot ${slotIndex} is in 24-hour format`);
        // Time is in 24-hour format
        const [sh, sm] = slot.startTime.split(':').map(Number);
        const [eh, em] = slot.endTime.split(':').map(Number);
        startHour24 = sh;
        startMinute = sm;
        endHour24 = eh;
        endMinute = em;
      }

      console.log(`⏰ [TimeSlots] Slot ${slotIndex} parsed - Start: ${startHour24}:${String(startMinute).padStart(2, '0')}, End: ${endHour24}:${String(endMinute).padStart(2, '0')}`);

      const start = new Date(selectedDate);
      start.setHours(startHour24, startMinute, 0, 0);

      const end = new Date(selectedDate);
      end.setHours(endHour24, endMinute, 0, 0);

      console.log(`⏰ [TimeSlots] Slot ${slotIndex} start date-time:`, start);
      console.log(`⏰ [TimeSlots] Slot ${slotIndex} end date-time:`, end);

      let currentTime = new Date(start);
      if (selectedDate.toDateString() === now.toDateString()) {
        let minAllowedTime = new Date(now);
        minAllowedTime.setMinutes(now.getMinutes() + noticePeriodMinutes);
        if (currentTime < minAllowedTime) {
          currentTime = new Date(minAllowedTime);
        }
      }

      currentTime.setMinutes(Math.ceil(currentTime.getMinutes() / batchSize) * batchSize, 0, 0);

      let generatedCount = 0;
      while (currentTime < end) {
        const nextTime = new Date(currentTime);
        nextTime.setMinutes(nextTime.getMinutes() + batchSize);
        if (nextTime <= end) {
          const slotKey = currentTime.toTimeString();
          if (!startTimeMap[slotKey]) {
            // Convert 24-hour times to 12-hour format for display
            const start24 = `${String(currentTime.getHours()).padStart(2, '0')}:${String(currentTime.getMinutes()).padStart(2, '0')}`;
            const end24 = `${String(nextTime.getHours()).padStart(2, '0')}:${String(nextTime.getMinutes()).padStart(2, '0')}`;

            const timeSlot = {
              startTime: convert24To12Hour(start24),
              endTime: convert24To12Hour(end24),
            };

            console.log(`   ✅ Generated slot: ${timeSlot.startTime} - ${timeSlot.endTime}`);

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
            generatedCount++;
          }
        }
        currentTime = nextTime;
      }
      console.log(`⏰ [TimeSlots] Slot ${slotIndex} generated ${generatedCount} time slots`);
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
  }, [selectedDate, selectedAvailability, sessionDuration, bookedSlots]);

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
      <h3 className="text-lg font-medium text-gray-900 mb-1 text-center">Not Available</h3>
      <p className="text-gray-500 text-center">There are no available appointment slots for this date. Please select a different date.</p>
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