import React, { useState } from 'react';
import { BiChevronLeft, BiChevronRight, BiTime } from 'react-icons/bi';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

export default function AvailabilityCalendar({
  meetings = [],
  onDateSelect = () => { },
  onNavigateMonth = () => { }
}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const navigate = useNavigate();

  const onAvailability = () => {
    navigate('/dashboard/expert/availability');
  }

  // console.log("🔹 Received meetings data:", meetings); // LOGGING MEETINGS DATA
  // console.log("🔹 Number of meetings:", meetings?.length || 0);

  const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const { firstDay, daysInMonth } = getDaysInMonth(currentDate);

  const handleMonthChange = (increment) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + increment);
    setCurrentDate(newDate);
    onNavigateMonth(newDate);
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    onDateSelect(date);
  };

  // ✅ FILTER MEETINGS FOR SELECTED DATE WITH IMPROVED LOGS
  const filteredMeetings = meetings.filter((meeting) => {
    // console.log("📋 Checking meeting:", {
    //   id: meeting._id,
    //   userName: meeting.userName,
    //   daySpecific: meeting.daySpecific,
    //   isPayed: meeting.isPayed,
    // });

    let daySpecificData = meeting.daySpecific;

    // Handle different daySpecific formats
    if (!daySpecificData) {
      console.warn("⚠️ No daySpecific data found for meeting:", meeting._id);
      return false;
    }

    // Ensure daySpecific is always an array
    if (!Array.isArray(daySpecificData)) {
      console.warn("⚠️ daySpecific is not an array! Converting to array:", daySpecificData);
      daySpecificData = [daySpecificData]; // Convert object to array
    }

    const hasMatchingDate = daySpecificData.some(daySpec => {
      if (!daySpec || !daySpec.date) {
        console.warn("⚠️ Invalid daySpec data:", daySpec);
        return false;
      }

      try {
        const meetingDate = new Date(daySpec.date).toDateString();
        const selectedDateString = selectedDate.toDateString();

        // console.log(
        //   "🕵️‍♂️ Comparing Dates:",
        //   "Meeting Date:", meetingDate,
        //   "| Selected Date:", selectedDateString,
        //   "| Has Slot:", !!daySpec.slot?.startTime
        // );

        return meetingDate === selectedDateString && daySpec.slot?.startTime;
      } catch (error) {
        console.error("❌ Error parsing date:", daySpec.date, error);
        return false;
      }
    });

    return hasMatchingDate;
  });

  // console.log("✅ Meetings found for", selectedDate.toDateString(), ":", filteredMeetings);

  return (
    <div className="bg-white border rounded-lg shadow-sm p-4 sm:p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Availability Calendar</h2>
        <ArrowUpRight onClick={onAvailability} className='cursor-pointer w-4 h-4 text-gray-800' />
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Calendar Section */}
        <div className="w-full lg:w-[320px]">
          <div className="flex justify-between items-center mb-4">
            <button onClick={() => handleMonthChange(-1)} className="p-2 hover:bg-gray-100 rounded-full">
              <BiChevronLeft size={20} />
            </button>
            <span className="font-medium">
              {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </span>
            <button onClick={() => handleMonthChange(1)} className="p-2 hover:bg-gray-100 rounded-full">
              <BiChevronRight size={20} />
            </button>
          </div>

          <div className="grid grid-cols-7 text-center mb-2">
            {days.map(day => (
              <div key={day} className="text-xs text-gray-500 font-medium py-2">{day}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-[2px] text-center">
            {Array.from({ length: 42 }, (_, i) => {
              const day = i - firstDay + 1;
              const isCurrentMonth = day > 0 && day <= daysInMonth;
              const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);

              const hasMeetings = meetings.some(meeting => {
                if (!meeting.daySpecific) return false;

                let daySpecificData = meeting.daySpecific;

                if (!Array.isArray(daySpecificData)) {
                  daySpecificData = [daySpecificData];
                }

                return daySpecificData.some(daySpec => {
                  if (!daySpec?.date || !daySpec.slot?.startTime) return false;

                  try {
                    return new Date(daySpec.date).toDateString() === date.toDateString();
                  } catch (error) {
                    console.warn("Invalid date in meeting:", daySpec.date);
                    return false;
                  }
                });
              });

              const isToday = new Date().toDateString() === date.toDateString();
              const isSelected = selectedDate.toDateString() === date.toDateString();

              return (
                <div
                  key={i}
                  onClick={() => isCurrentMonth && handleDateClick(date)}
                  className={`py-2 text-sm cursor-pointer transition-colors
                    ${!isCurrentMonth ? 'text-gray-300' : ''}
                    ${isToday ? 'text-[#388544] font-bold border border-gray-400 rounded-md bg-[#F5FEF8]' : ''}
                    ${hasMeetings && isCurrentMonth ? 'font-medium' : ''}
                    ${isSelected ? 'bg-blue-200 rounded-md' : ''}
                    ${isCurrentMonth ? 'hover:bg-gray-50' : ''}`}
                >
                  {isCurrentMonth ? day : ''}
                </div>
              );
            })}
          </div>
        </div>

        {/* Meetings Section */}
        <div className="flex-1">
          <h3 className="font-medium mb-4">
            Meetings for {selectedDate.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })}
          </h3>
          <div className="space-y-3">
            {filteredMeetings.length > 0 ? (
              filteredMeetings.map((meeting) => {
                let daySpecificData = meeting.daySpecific;

                // Ensure daySpecific is always an array
                if (!Array.isArray(daySpecificData)) {
                  daySpecificData = [daySpecificData];
                }

                return daySpecificData
                  .filter(daySpec => daySpec?.slot?.startTime) // Only show slots with valid time
                  .map((daySpec, index) => {
                    const { startTime, endTime } = daySpec.slot || {};

                    return startTime ? (
                      <div key={`${meeting._id}-${index}`} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0">
                            <BiTime className="text-gray-400" size={20} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                {startTime} - {endTime || 'N/A'}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600">
                              {meeting.userName || 'Unknown Client'}
                            </div>
                            <div className="text-xs text-gray-500">
                              {meeting.serviceName || 'Session'}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : null;
                  });
              })
            ) : (
              <p className="text-gray-500 text-sm">No meetings scheduled for this day.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

AvailabilityCalendar.propTypes = {
  meetings: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    daySpecific: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.shape({
        date: PropTypes.string.isRequired,
        slot: PropTypes.shape({
          startTime: PropTypes.string.isRequired,
          endTime: PropTypes.string.isRequired,
          clientName: PropTypes.string
        })
      })),
      PropTypes.object
    ]),
  })),
  onDateSelect: PropTypes.func,
  onNavigateMonth: PropTypes.func
};