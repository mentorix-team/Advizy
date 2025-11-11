import PropTypes from 'prop-types';
import TimeButton from './TimeButton';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { createMeet, updateMeet, updateMeetDirectly } from '@/Redux/Slices/meetingSlice';
import { CalendarX } from 'lucide-react';

function TimeSlotforRescheduleUser({ selectedDate, sessionDuration, selectedAvailability, expertId, serviceId, userName, serviceName, expertName }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [timeSlots, setTimeSlots] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const location = useLocation();
  const { meeting_id } = location.state || {};

  // Update current time every minute for today's slots
  useEffect(() => {
    const isToday = selectedDate && selectedDate.toDateString() === new Date().toDateString();

    if (!isToday) return;

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [selectedDate]);
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
    const now = new Date();
    const isToday = selectedDate.toDateString() === now.toDateString();

    // Add buffer time (e.g., 30 minutes from now for today's slots)
    const bufferMinutes = 30;
    const earliestBookableTime = isToday ? new Date(now.getTime() + bufferMinutes * 60000) : null;

    dayData.slots.forEach(slot => {
      // console.log("Processing Slot:", slot);

      // Parse time with proper AM/PM handling
      const parseTime = (timeStr) => {
        const parts = timeStr.trim().split(/[\s:]+/);
        let hours = parseInt(parts[0], 10);
        const minutes = parseInt(parts[1], 10);
        const ampm = parts[2]?.toUpperCase();

        if (ampm === 'PM' && hours !== 12) {
          hours += 12;
        } else if (ampm === 'AM' && hours === 12) {
          hours = 0;
        }

        return { hours, minutes };
      };

      const startTime = parseTime(slot.startTime);
      const endTime = parseTime(slot.endTime);

      const start = new Date(selectedDate);
      start.setHours(startTime.hours, startTime.minutes, 0, 0);

      const end = new Date(selectedDate);
      end.setHours(endTime.hours, endTime.minutes, 0, 0);

      let currentTime = new Date(start);

      while (currentTime < end) {
        const nextTime = new Date(currentTime);
        nextTime.setMinutes(nextTime.getMinutes() + sessionDuration);

        if (nextTime <= end) {
          // Filter out past slots for today
          if (!isToday || currentTime >= earliestBookableTime) {
            generatedSlots.push({
              startTime: currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              endTime: nextTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              startDateTime: new Date(currentTime), // Add for sorting
            });
          }
        }

        currentTime = nextTime;
      }
    });

    // Sort slots by start time to show latest available slots
    generatedSlots.sort((a, b) => a.startDateTime - b.startDateTime);

    // console.log("Generated Slots:", generatedSlots);
    // console.log(`${isToday ? 'Today' : 'Selected date'} slots after ${isToday ? earliestBookableTime.toLocaleTimeString() : 'N/A'}`);

    // Set the generated slots to state
    setTimeSlots(generatedSlots);

  }, [selectedDate, selectedAvailability, sessionDuration, currentTime]);

  const handleBooking = async (time) => {
    try {
      const formattedDate = selectedDate.toLocaleDateString("en-CA");

      const meetData = {
        meeting_id,
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

      // console.log("This is meetData", meetData);
      const result = await dispatch(updateMeetDirectly(meetData)).unwrap();

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
        <CalendarX className="w-12 h-12 text-[#16A348]" />
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

TimeSlotforRescheduleUser.propTypes = {
  selectedDate: PropTypes.instanceOf(Date).isRequired,
  sessionDuration: PropTypes.number.isRequired,
  selectedAvailability: PropTypes.object,
  expertId: PropTypes.string.isRequired,
  serviceId: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired,
  serviceName: PropTypes.string.isRequired,
  expertName: PropTypes.string.isRequired,
};

export default TimeSlotforRescheduleUser;
