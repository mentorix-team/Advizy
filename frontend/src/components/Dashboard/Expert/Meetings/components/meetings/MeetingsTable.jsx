import PropTypes from 'prop-types';
import { BsArrowRight, BsCalendar } from 'react-icons/bs';
import { CalendarIcon } from '@/icons/Icons';

const MeetingsTable = ({ meetings, onViewDetails, activeTab }) => {
  console.log('this is next step ',meetings)
  if (meetings.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <p className="text-gray-500">No results found for your search</p>
      </div>
    );
  }

  // Group meetings by date
  const groupedMeetings = meetings.reduce((groups, meeting) => {
    if (!groups[meeting.daySpecific.date]) {
      groups[meeting.daySpecific.date] = [];
    }
    groups[meeting.daySpecific.date].push(meeting);
    return groups;
  }, {});

  return (
    <div className="space-y-8">
      {Object.entries(groupedMeetings).map(([date, dateMeetings]) => (
        <div key={date} className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 flex items-center gap-2 border-b border-gray-200">
            <CalendarIcon className="w-5 h-5" />
            <h3 className="text-lg font-medium text-gray-900">
              {new Date(date).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              })}
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="hidden md:table-cell text-left py-4 px-3 md:px-6 text-xs md:text-sm font-medium text-gray-500">Time Slot</th>
                  <th className="text-left py-4 px-3 md:px-6 text-xs md:text-sm font-medium text-gray-500">Client</th>
                  <th className="hidden sm:table-cell text-left py-4 px-3 md:px-6 text-xs md:text-sm font-medium text-gray-500">Service</th>
                  <th className="text-left py-4 px-3 md:px-6 text-xs md:text-sm font-medium text-gray-500">Status</th>
                  {activeTab === 'upcoming' && (
                    <th className="text-left py-4 px-3 md:px-6 text-xs md:text-sm font-medium text-gray-500">Amount</th>
                  )}
                  <th className="text-left py-4 px-3 md:px-6 text-xs md:text-sm font-medium text-gray-500">Actions</th>
                  {activeTab === 'past' && (
                    <th className="text-left py-4 px-3 md:px-6 text-xs md:text-sm font-medium text-gray-500">Rating</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {dateMeetings.map((meeting, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="hidden md:table-cell px-3 md:px-6 py-4">
                      <div className="text-xs md:text-sm text-gray-900">{meeting.daySpecific.slot.startTime}</div>
                    </td>
                    <td className="px-3 md:px-6 py-4">
                      <span className="text-xs md:text-sm text-gray-900">{meeting.userName}</span>
                      <div className="md:hidden text-xs text-gray-500 mt-1">{meeting.daySpecific.slot.startTime}</div>
                    </td>
                    <td className="hidden sm:table-cell px-3 md:px-6 py-4">
                      <span className="text-xs md:text-sm text-gray-900">{meeting.serviceName}</span>
                    </td>
                    <td className="px-3 md:px-6 py-4">
                      <SessionStatus status={meeting.sessionStatus} />
                    </td>
                    {activeTab === 'upcoming' && (
                      <td className="px-3 md:px-6 py-4">
                        <span className="text-xs md:text-sm text-gray-900">₹{meeting.amount}</span>
                      </td>
                    )}
                    <td className="px-3 md:px-6 py-4">
                      <button 
                        onClick={() => onViewDetails(meeting)}
                        className="text-[#16A348] px-3 py-1 hover:border hover:border-[#16A348] rounded-md text-xs md:text-sm font-medium flex items-center gap-1"
                      >
                        <span className="hidden sm:inline">View Details</span>
                        <span className="sm:hidden">View</span>
                        <BsArrowRight className="text-lg" />
                      </button>
                    </td>
                    {activeTab === 'past' && (
                      <td className="px-3 md:px-6 py-4">
                        {meeting.rating ? (
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-400">★</span>
                            <span className="text-xs md:text-sm text-gray-900">{meeting.rating}/5</span>
                          </div>
                        ) : (
                          <span className="text-xs md:text-sm text-gray-500">No Rating</span>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

const SessionStatus = ({ status }) => {
  const getStatusStyle = (status) => {
    const statusLower = status.toLowerCase();
    if (statusLower === 'confirmed') {
      return 'text-green-600';
    }
    if (statusLower === 'completed') {
      return 'text-green-600';
    }
    if (statusLower === 'no-show') {
      return 'text-red-600';
    }
    if (statusLower.includes('cancel')) {
      return 'text-red-600';
    }
    if (statusLower.includes('reschedule')) {
      return 'text-orange-600';
    }
    return 'text-gray-600';
  };

  const getStatusText = (status) => {
    const isMobile = window.innerWidth < 640;
    if (status.toLowerCase().includes('reschedule requested')) {
      return (
        <div className="text-orange-600">
          <div>Reschedule</div>
          <div>Requested</div>
        </div>
      );
    }
    if (status.toLowerCase().includes('cancellation requested')) {
      return (
        <div className="text-red-600">
          <div>Cancellation</div>
          <div>Requested</div>
        </div>
      );
    }
    if (status.toLowerCase().includes('cancelled by client')) {
      return (
        <div className="text-red-600">
          <div>Cancelled by</div>
          <div>Client</div>
        </div>
      );
    }
    return <span className={getStatusStyle(status)}>{status}</span>;
  };

  return (
    <div className="text-xs md:text-sm font-medium">
      {getStatusText(status)}
    </div>
  );
};

SessionStatus.propTypes = {
  status: PropTypes.string.isRequired
};

MeetingsTable.propTypes = {
  meetings: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      time: PropTypes.string.isRequired,
      client: PropTypes.string.isRequired,
      service: PropTypes.string.isRequired,
      sessionStatus: PropTypes.string.isRequired,
      amount: PropTypes.number,
      rating: PropTypes.number
    })
  ).isRequired,
  onViewDetails: PropTypes.func.isRequired,
  activeTab: PropTypes.oneOf(['upcoming', 'past']).isRequired
};

export default MeetingsTable;