import PropTypes from 'prop-types';
import { BsClock} from 'react-icons/bs';
import { CalendarIcon } from '@/icons/Icons';
import NoData from '@/NoData';

const TodaysMeetings = ({ meetings, onStartMeeting, onViewDetails }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg md:text-xl font-medium text-gray-900 flex items-center">
          <CalendarIcon className="w-5 h-5 m-1" />
          Today's Meetings
        </h2>
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-full inline-block align-middle">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-3 md:px-6 py-3 text-left text-xs md:text-sm font-medium text-gray-500">Client</th>
                <th className="hidden sm:table-cell px-3 md:px-6 py-3 text-left text-xs md:text-sm font-medium text-gray-500">Service</th>
                <th className="hidden md:table-cell px-3 md:px-6 py-3 text-left text-xs md:text-sm font-medium text-gray-500">Time Slot</th>
                <th className="px-3 md:px-6 py-3 text-left text-xs md:text-sm font-medium text-gray-500">Status</th>
                <th className="px-3 md:px-6 py-3 text-left text-xs md:text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {meetings.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-3 md:px-6 py-4 text-center text-gray-500 text-sm">
                    <NoData />
                  </td>
                </tr>
              ) : (
                meetings.map((meeting, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-3 md:px-6 py-4">
                      <span className="text-xs md:text-sm font-medium text-gray-900">{meeting.client}</span>
                      <div className="md:hidden text-xs text-gray-500 mt-1">
                        <BsClock className="inline text-[#16A348] mr-1" />
                        {meeting.time}
                      </div>
                    </td>
                    <td className="hidden sm:table-cell px-3 md:px-6 py-4">
                      <span className="text-xs md:text-sm text-gray-900">{meeting.service}</span>
                    </td>
                    <td className="hidden md:table-cell px-3 md:px-6 py-4">
                      <div className="flex items-center text-xs md:text-sm text-gray-900">
                        <BsClock className="text-[#16A348] mr-2" />
                        {meeting.time}
                      </div>
                    </td>
                    <td className="px-3 md:px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs md:text-sm rounded-full font-medium ${
                        meeting.sessionStatus === 'Confirmed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {meeting.sessionStatus}
                      </span>
                    </td>
                    <td className="px-3 md:px-6 py-4">
                      <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                        <button
                          onClick={() => onStartMeeting(meeting)}
                          className="bg-green-600 text-white px-3 md:px-6 py-1.5 md:py-2 rounded-md hover:bg-green-700 transition-colors text-xs md:text-sm font-medium whitespace-nowrap"
                        >
                          Start
                        </button>
                        <button
                          onClick={() => onViewDetails(meeting)}
                          className="text-black border border-gray-300 px-3 md:px-4 py-1.5 md:py-2 rounded-md hover:text-[#16A348] text-xs md:text-sm font-medium whitespace-nowrap hover:border hover:border-[#16A348]"
                        >
                          Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

TodaysMeetings.propTypes = {
  meetings: PropTypes.arrayOf(
    PropTypes.shape({
      client: PropTypes.string.isRequired,
      service: PropTypes.string.isRequired,
      time: PropTypes.string.isRequired,
      sessionStatus: PropTypes.string.isRequired,
    })
  ).isRequired,
  onStartMeeting: PropTypes.func.isRequired,
  onViewDetails: PropTypes.func.isRequired,
};

export default TodaysMeetings;