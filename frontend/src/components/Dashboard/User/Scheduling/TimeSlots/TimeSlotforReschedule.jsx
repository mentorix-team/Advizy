import PropTypes from 'prop-types';
import TimeButton from './TimeButton';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateMeet } from '@/Redux/Slices/meetingSlice';
import { CalendarX } from 'lucide-react';

function TimeSlotsforReschedule({ token,selectedDate, sessionDuration, selectedAvailability, expertId, serviceId, userName, serviceName, expertName }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [timeSlots, setTimeSlots] = useState([]);
  const [latestAvailableSlot, setLatestAvailableSlot] = useState(null);

  // Helper function to parse time string and convert to minutes
  const parseTime = (timeString) => {
    const [time, period] = timeString.split(/(\s?[AP]M)/i);
    const [hours, minutes] = time.split(':').map(Number);
    let hour24 = hours;
    
    if (period && period.toUpperCase().includes('PM') && hours !== 12) {
      hour24 += 12;
    } else if (period && period.toUpperCase().includes('AM') && hours === 12) {
      hour24 = 0;
    }
    
    return hour24 * 60 + minutes;
  };

  // Function to get the latest (most recent) available slot
  const getLatestAvailableSlot = (slots) => {
    if (!slots || slots.length === 0) return null;

    // Get current time in minutes for today's filtering
    const now = new Date();
    const isToday = selectedDate.toDateString() === now.toDateString();
    const currentTimeMinutes = now.getHours() * 60 + now.getMinutes();
    const bufferMinutes = 30; // 30-minute buffer for booking

    let availableSlots = slots;

    // Filter out past slots if today
    if (isToday) {
      availableSlots = slots.filter(slot => {
        const slotStartMinutes = parseTime(slot.startTime);
        return slotStartMinutes > (currentTimeMinutes + bufferMinutes);
      });
    }

    if (availableSlots.length === 0) return null;

    // Sort by start time and return the latest (last) available slot
    const sortedSlots = availableSlots.sort((a, b) => {
      return parseTime(b.startTime) - parseTime(a.startTime);
    });

    return sortedSlots[0]; // Latest slot (highest time)
  };

  useEffect(() => {
    if (!selectedAvailability?.availability?.daySpecific || !selectedDate) {
      setTimeSlots([]);
      setLatestAvailableSlot(null);
      return;
    }
  
    const dayName = selectedDate.toLocaleString("en-US", { weekday: "long" });
  
    // Find the availability for the selected day
    const dayData = selectedAvailability.availability.daySpecific.find(
      (day) => day.day === dayName
    );
  
    if (!dayData || !dayData.slots || dayData.slots.length === 0) {
      setTimeSlots([]);
      setLatestAvailableSlot(null);
      return;
    }

    const now = new Date();
    const isToday = selectedDate.toDateString() === now.toDateString();
    const currentTimeMinutes = now.getHours() * 60 + now.getMinutes();
    const bufferMinutes = 30;
  
    const generatedSlots = [];
  
    dayData.slots.forEach(slot => {
      const [startHour, startMinute] = slot.startTime.split(/[:\s]/).map((val, i) => i === 2 ? val : Number(val));
      const [endHour, endMinute] = slot.endTime.split(/[:\s]/).map((val, i) => i === 2 ? val : Number(val));
  
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
          const slotStartTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const slotEndTime = nextTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          
          const slotStartMinutes = parseTime(slotStartTime);
          const isSlotAvailable = !isToday || slotStartMinutes > (currentTimeMinutes + bufferMinutes);
          
          if (isSlotAvailable) {
            generatedSlots.push({
              startTime: slotStartTime,
              endTime: slotEndTime,
            });
          }
        }
  
        currentTime = nextTime;
      }
    });
    
    setTimeSlots(generatedSlots);
    setLatestAvailableSlot(getLatestAvailableSlot(generatedSlots));
  
  }, [selectedDate, selectedAvailability, sessionDuration]);

  // Real-time update effect for today's slots
  useEffect(() => {
    const isToday = selectedDate.toDateString() === new Date().toDateString();
    
    if (isToday && timeSlots.length > 0) {
      const intervalId = setInterval(() => {
        const updatedLatestSlot = getLatestAvailableSlot(timeSlots);
        setLatestAvailableSlot(updatedLatestSlot);
      }, 60000); // Update every minute

      return () => clearInterval(intervalId);
    }
  }, [timeSlots, selectedDate]);
  
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

      const result = await dispatch(updateMeet(meetData)).unwrap();      if (result) {
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
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[15px] text-gray-900">
          Available Time Slots for {selectedDate.toLocaleDateString('en-US')}
        </h3>
        {latestAvailableSlot && (
          <div className="text-sm text-green-600 font-medium">
            Latest: {latestAvailableSlot.startTime} - {latestAvailableSlot.endTime}
          </div>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
        {timeSlots.map((slot, index) => (
          <TimeButton
            key={index}
            time={slot}
            onClick={() => handleBooking(slot)}
            isLatest={latestAvailableSlot && 
              slot.startTime === latestAvailableSlot.startTime && 
              slot.endTime === latestAvailableSlot.endTime}
          />
        ))}
      </div>
      {latestAvailableSlot && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-green-700">
              💡 Latest available slot: {latestAvailableSlot.startTime} - {latestAvailableSlot.endTime}
            </span>
            <button
              onClick={() => handleBooking(latestAvailableSlot)}
              className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
            >
              Book Latest
            </button>
          </div>
        </div>
      )}
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
