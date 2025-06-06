import PropTypes from 'prop-types';
import TimeButton from './TimeButton';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { createMeet } from '@/Redux/Slices/meetingSlice';
import { CalendarX } from 'lucide-react';

function TimeSlots({ selectedDate, sessionPrice, sessionDuration, selectedAvailability, expertId, serviceId, userName, serviceName, expertName ,title,includes,serviceDescription}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [timeSlots, setTimeSlots] = useState([]);

  useEffect(() => {
    if (!selectedAvailability?.availability?.daySpecific || !selectedDate) {
      console.warn("Missing availability data or selectedDate");
      setTimeSlots([]);
      return;
    }

    const dayName = selectedDate.toLocaleString("en-US", { weekday: "long" });
    const dayData = selectedAvailability.availability.daySpecific.find(
      (day) => day.day === dayName
    );

    if (!dayData || !dayData.slots || dayData.slots.length === 0) {
      console.warn(`No slots available for ${dayName}`);
      setTimeSlots([]);
      return;
    }

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
            generatedSlots.push({
              startTime: currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              endTime: nextTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            });
            startTimeMap[slotKey] = true;
          }
        }
        currentTime = nextTime;
      }
    });

    setTimeSlots(generatedSlots);
  }, [selectedDate, selectedAvailability, sessionDuration]);

  const handleBooking = async (time) => {
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

      // if (result) {
      //   navigate(`/expert/order-summary/`, {
      //     state: {
      //       durationforstate:sessionDuration,
      //       selectedDate: formattedDate,
      //       selectedTime: time,
      //       Price: sessionPrice,
      //       title:title,
      //       serviceDescription:serviceDescription,
      //       includes:includes
      //     },
      //   });
      // }

      if (result) {
        navigate(`/expert/payu-order-summary/`, {
          state: {
            durationforstate:sessionDuration,
            selectedDate: formattedDate,
            selectedTime: time,
            Price: sessionPrice,
            title:title,
            serviceDescription:serviceDescription,
            includes:includes
          },
        });
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
      <div className="grid grid-cols-2 gap-3 mb-6">
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

TimeSlots.propTypes = {
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