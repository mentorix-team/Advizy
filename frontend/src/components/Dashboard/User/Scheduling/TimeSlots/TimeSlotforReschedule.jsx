import PropTypes from 'prop-types';
import TimeButton from './TimeButton';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { createMeet, updateMeet } from '@/Redux/Slices/meetingSlice';

function TimeSlotsforReschedule({ token,selectedDate, sessionDuration, selectedAvailability, expertId, serviceId, userName, serviceName, expertName }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [timeSlots, setTimeSlots] = useState([]);

  useEffect(() => {
    if (!selectedAvailability?.availability?.daySpecific || !selectedDate) {
      console.warn("Missing availability data or selectedDate");
      setTimeSlots([]); // Reset slots when no data
      return;
    }
  
    const dayName = selectedDate.toLocaleString("en-US", { weekday: "long" });
  
    // Find the availability for the selected day
    const dayData = selectedAvailability.availability.daySpecific.find(
      (day) => day.day === dayName
    );
  
    if (!dayData || !dayData.slots || dayData.slots.length === 0) {
      console.warn(`No slots available for ${dayName}`);
      setTimeSlots([]); // Clear slots if no data found
      return;
    }
  
    const generatedSlots = [];
  
    dayData.slots.forEach(slot => {
      console.log("Processing Slot:", slot);
  
      // Parse the time from slot
      const [startHour, startMinute] = slot.startTime.split(/[:\s]/).map((val, i) => i === 2 ? val : Number(val));
      const [endHour, endMinute] = slot.endTime.split(/[:\s]/).map((val, i) => i === 2 ? val : Number(val));
  
      // Convert to 24-hour format if AM/PM exists
      const isStartPM = slot.startTime.includes("PM");
      const isEndPM = slot.endTime.includes("PM");
  
      const start = new Date(selectedDate);
      start.setHours(isStartPM && startHour !== 12 ? startHour + 12 : startHour, startMinute, 0, 0);
  
      const end = new Date(selectedDate);
      end.setHours(isEndPM && endHour !== 12 ? endHour + 12 : endHour, endMinute, 0, 0);
  
      let currentTime = new Date(start);
  
      while (currentTime < end) {
        const nextTime = new Date(currentTime);
        nextTime.setMinutes(nextTime.getMinutes() + sessionDuration);
  
        if (nextTime <= end) {
          generatedSlots.push({
            startTime: currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            endTime: nextTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          });
        }
  
        currentTime = nextTime;
      }
    });
  
    console.log("Generated Slots:", generatedSlots);
  
    // Set the generated slots to state
    setTimeSlots(generatedSlots);
  
  }, [selectedDate, selectedAvailability, sessionDuration]);
  
  const handleBooking = async (time) => {
    try {
      const formattedDate = selectedDate.toLocaleDateString("en-CA");
  
      const meetData = {
        token,
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
  
      console.log("This is meetData", meetData);
      const result = await dispatch(updateMeet(meetData)).unwrap();
  
      if (result) {
        navigate(`/`);
      }
    } catch (error) {
      console.error("Error during booking:", error);
    }
  };
  

  if (timeSlots.length === 0) {
    return <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto p-6 rounded-lg border border-gray-200 bg-white shadow-sm">
    <div className="relative mb-4">
    <CalendarX  className="w-12 h-12 text-[#16A348]" />
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-1 text-center">No available slots</h3>
    <p className="text-gray-500 text-center">There are no available appointment slots for this Date!.</p>
  </div>;
  }

  return (
    <div className="mt-6">
      <h3 className="text-[15px] text-gray-900 mb-4">
        Available Time Slots for {selectedDate.toLocaleDateString('en-US')}
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
        {timeSlots.map((slot, index) => (
          <TimeButton
            key={index}
            time={slot}
            onClick={() => handleBooking(slot)}
          />
        ))}
      </div>
    </div>
  );
}

TimeSlotsforReschedule.propTypes = {
  selectedDate: PropTypes.instanceOf(Date).isRequired,
  sessionDuration: PropTypes.number.isRequired,
  selectedAvailability: PropTypes.object,
  expertId: PropTypes.string.isRequired,
  serviceId: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired,
  serviceName: PropTypes.string.isRequired,
  expertName: PropTypes.string.isRequired,
};

export default TimeSlotsforReschedule;
