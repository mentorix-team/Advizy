import PropTypes from 'prop-types';
import { BsArrowRight, BsCalendar } from 'react-icons/bs';
import { CalendarIcon } from '@/icons/Icons';
import {
  getMeetingStatusLabel,
  getMeetingStatusPillTone,
} from '@/utils/meetingStatus';

const MeetingsTable = ({ meetings, onViewDetails, activeTab }) => {
  console.log('this is next step ', meetings)
  if (meetings.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <p className="text-gray-500">No results found for your search</p>
      </div>
    );
  }

  // Group meetings by date
  const groupedMeetings = meetings.reduce((groups, meeting) => {
    const dateKey = meeting?.daySpecific?.date;
    if (!dateKey) {
      groups.__missing = groups.__missing || [];
      groups.__missing.push(meeting);
      return groups;
    }

    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(meeting);
    return groups;
  }, {});

  return (
    <div className="space-y-8">
      {Object.entries(groupedMeetings)
        .filter(([date]) => date !== "__missing")
        .map(([date, dateMeetings]) => (
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
              <table className="min-w-full table-fixed divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="hidden md:table-cell w-32 text-left py-4 px-3 md:px-6 text-xs md:text-sm font-medium text-gray-500">Time Slot</th>
                    <th className="w-40 text-left py-4 px-3 md:px-6 text-xs md:text-sm font-medium text-gray-500">Client</th>
                    <th className="hidden sm:table-cell w-56 text-left py-4 px-3 md:px-6 text-xs md:text-sm font-medium text-gray-500">Service</th>
                    <th className="w-32 text-left py-4 px-3 md:px-6 text-xs md:text-sm font-medium text-gray-500">Status</th>
                    {activeTab === 'upcoming' && (
                      <th className="w-28 text-left py-4 px-3 md:px-6 text-xs md:text-sm font-medium text-gray-500">Amount</th>
                    )}
                    <th className="w-32 text-left py-4 px-3 md:px-6 text-xs md:text-sm font-medium text-gray-500">Actions</th>
                    {activeTab === 'past' && (
                      <th className="w-28 text-left py-4 px-3 md:px-6 text-xs md:text-sm font-medium text-gray-500">Rating</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {dateMeetings.map((meeting, index) => (
                    <tr key={index} className="hover:bg-blue-50">
                      <td className="hidden md:table-cell w-32 px-3 md:px-6 py-4">
                        <div className="text-xs md:text-sm text-gray-900 whitespace-nowrap">{meeting?.daySpecific?.slot?.startTime || "-"}</div>
                      </td>
                      <td className="w-40 px-3 md:px-6 py-4">
                        <span className="text-xs md:text-sm text-gray-900 whitespace-nowrap">{meeting.userName}</span>
                        <div className="md:hidden text-xs text-gray-500 mt-1 whitespace-nowrap">{meeting?.daySpecific?.slot?.startTime || "-"}</div>
                      </td>
                      <td className="hidden sm:table-cell w-56 px-3 md:px-6 py-4 overflow-hidden">
                        <span className="text-xs md:text-sm text-gray-900 truncate" title={meeting.serviceName}>{meeting.serviceName}</span>
                      </td>
                      <td className="w-32 px-3 md:px-6 py-4">
                        <SessionStatus
                          status={meeting.sessionStatus}
                          normalizedStatus={meeting.normalizedStatus}
                        />
                      </td>
                      {activeTab === 'upcoming' && (
                        <td className="w-28 px-3 md:px-6 py-4">
                          <span className="text-xs md:text-sm text-gray-900 whitespace-nowrap">₹{meeting.amount}</span>
                        </td>
                      )}
                      <td className="w-32 px-3 md:px-6 py-4">
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
                        <td className="w-28 px-3 md:px-6 py-4">
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

const SessionStatus = ({ status, normalizedStatus }) => {
  const rawStatus = normalizedStatus || status;
  const statusLabel = status || getMeetingStatusLabel({ status: rawStatus });
  const toneClass = getMeetingStatusPillTone({ status: rawStatus });

  return (
    <span
      className={`inline-flex px-2 py-1 rounded-full text-xs md:text-sm font-medium capitalize ${toneClass}`}
    >
      {statusLabel}
    </span>
  );
};

SessionStatus.propTypes = {
  status: PropTypes.string.isRequired,
  normalizedStatus: PropTypes.string,
};

MeetingsTable.propTypes = {
  meetings: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      userName: PropTypes.string,
      expertName: PropTypes.string,
      serviceName: PropTypes.string,
      daySpecific: PropTypes.shape({
        date: PropTypes.string,
        slot: PropTypes.shape({
          startTime: PropTypes.string,
          endTime: PropTypes.string,
        }),
      }),
      sessionStatus: PropTypes.string,
      normalizedStatus: PropTypes.string,
      amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      rating: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ).isRequired,
  onViewDetails: PropTypes.func.isRequired,
  activeTab: PropTypes.oneOf(['upcoming', 'past']).isRequired,
};

export default MeetingsTable;