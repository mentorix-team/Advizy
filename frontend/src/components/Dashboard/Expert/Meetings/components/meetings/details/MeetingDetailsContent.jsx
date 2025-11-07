import PropTypes from 'prop-types';
import { FaStar, FaRegCalendarCheck, FaClock, FaUserAlt, FaClipboardList } from 'react-icons/fa';
import {
  getMeetingStatusLabel,
  getMeetingStatusPillTone,
} from '@/utils/meetingStatus';

const MeetingDetailsContent = ({ meeting }) => {
  const statusLabel = getMeetingStatusLabel(meeting);
  const statusToneClass = getMeetingStatusPillTone(meeting);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-50 p-6 rounded-xl">
          <div className="flex items-center space-x-3 mb-4">
            <FaUserAlt className="text-blue-500" />
            <h3 className="text-lg font-medium">Client Information</h3>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="text-gray-900 font-medium">{meeting.client}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Service</p>
              <p className="text-gray-900">{meeting.service}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-xl">
          <div className="flex items-center space-x-3 mb-4">
            <FaRegCalendarCheck className="text-green-500" />
            <h3 className="text-lg font-medium">Meeting Details</h3>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Date & Time</p>
              <p className="text-gray-900">{meeting.date} at {meeting.time}</p>
            </div>
            <div className="flex space-x-4">
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span
                  className={`inline-flex mt-1 px-3 py-1 rounded-full text-sm font-medium capitalize ${statusToneClass}`}
                >
                  {statusLabel}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Payment</p>
                <span className="inline-flex mt-1 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {meeting.paymentStatus}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {meeting.rating && (
        <div className="bg-yellow-50 p-6 rounded-xl">
          <div className="flex items-center space-x-3 mb-4">
            <FaStar className="text-yellow-500" />
            <h3 className="text-lg font-medium">Client Feedback</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-2">Rating</p>
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={i < meeting.rating ? 'text-yellow-400' : 'text-gray-200'}
                    size={24}
                  />
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-2">Comments</p>
              <p className="text-gray-900">{meeting.feedback || 'No feedback provided'}</p>
            </div>
          </div>
        </div>
      )}

      {meeting.summary && (
        <div className="bg-gray-50 p-6 rounded-xl">
          <div className="flex items-center space-x-3 mb-4">
            <FaClipboardList className="text-purple-500" />
            <h3 className="text-lg font-medium">Meeting Summary</h3>
          </div>
          <p className="text-gray-900">{meeting.summary}</p>
        </div>
      )}
    </div>
  );
};

MeetingDetailsContent.propTypes = {
  meeting: PropTypes.shape({
    client: PropTypes.string.isRequired,
    service: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    sessionStatus: PropTypes.string.isRequired,
    paymentStatus: PropTypes.string.isRequired,
    amount: PropTypes.number,
    summary: PropTypes.string,
    rating: PropTypes.number,
    feedback: PropTypes.string,
  }).isRequired,
};

export default MeetingDetailsContent;