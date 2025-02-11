import PropTypes from 'prop-types';
import Modal from '../../modals/Modal';
import { useState } from 'react';
import { FaStar } from 'react-icons/fa';

const PastMeetingDetailsModal = ({ isOpen, onClose, meeting }) => {
  const [activeTab, setActiveTab] = useState('details');

  if (!meeting) return null;

  const isPastMeeting = meeting.sessionStatus === 'Completed' || meeting.sessionStatus === 'Cancelled';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Meeting Details"
    >
      <div className="space-y-6">
        <p className="text-gray-600">
          {isPastMeeting ? 'Past' : 'Upcoming'} meeting summary with {meeting.client}.
        </p>

        <div className="flex space-x-4 border-b">
          <button
            onClick={() => setActiveTab('details')}
            className={`px-4 py-2 text-sm font-medium -mb-px ${
              activeTab === 'details'
                ? 'border-b-2 border-blue-500 text-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Details
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`px-4 py-2 text-sm font-medium -mb-px ${
              activeTab === 'notes'
                ? 'border-b-2 border-blue-500 text-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Notes
          </button>
        </div>

        {activeTab === 'details' ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-x-6">
              <div>
                <h3 className="text-sm text-gray-500">Client</h3>
                <p className="mt-1 text-gray-900">{meeting.client}</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-500">Service</h3>
                <p className="mt-1 text-gray-900">{meeting.service}</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm text-gray-500">Date & Time</h3>
              <p className="mt-1 text-gray-900">{meeting.date} at {meeting.time}</p>
            </div>

            <div className="grid grid-cols-2 gap-x-6">
              <div>
                <h3 className="text-sm text-gray-500">Status</h3>
                <span className={`inline-flex mt-1 px-3 py-1 rounded-full text-sm font-medium ${
                  meeting.sessionStatus === 'Completed'
                    ? 'bg-black text-white'
                    : meeting.sessionStatus === 'Cancelled'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {meeting.sessionStatus}
                </span>
              </div>
              <div>
                <h3 className="text-sm text-gray-500">Payment Status</h3>
                <span className={`inline-flex mt-1 px-3 py-1 rounded-full text-sm font-medium ${
                  meeting.paymentStatus === 'Paid'
                    ? 'bg-green-100 text-green-800'
                    : meeting.paymentStatus === 'Refunded'
                    ? 'bg-orange-100 text-orange-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {meeting.paymentStatus}
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-sm text-gray-500">Amount</h3>
              <p className="mt-1 text-gray-900">₹{meeting.amount}</p>
            </div>

            {meeting.summary && (
              <div>
                <h3 className="text-sm text-gray-500">Meeting Summary</h3>
                <p className="mt-1 text-gray-900">{meeting.summary}</p>
              </div>
            )}

            {meeting.rating && (
              <div className="grid grid-cols-2 gap-x-6">
                <div>
                  <h3 className="text-sm text-gray-500">Client Rating</h3>
                  <div className="flex mt-1 space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={i < meeting.rating ? 'text-yellow-400' : 'text-gray-200'}
                        size={20}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm text-gray-500">Client Feedback</h3>
                  <p className="mt-1 text-gray-900">{meeting.feedback || 'No feedback provided'}</p>
                </div>
              </div>
            )}

            {meeting.keyPoints?.length > 0 && (
              <div>
                <h3 className="text-sm text-gray-500">Key Points Discussed</h3>
                <ul className="mt-2 space-y-1">
                  {meeting.keyPoints.map((point, index) => (
                    <li key={index} className="text-gray-900">• {point}</li>
                  ))}
                </ul>
              </div>
            )}

            {meeting.actionItems?.length > 0 && (
              <div>
                <h3 className="text-sm text-gray-500">Action Items</h3>
                <ul className="mt-2 space-y-1">
                  {meeting.actionItems.map((item, index) => (
                    <li key={index} className="text-gray-900">• {item}</li>
                  ))}
                </ul>
              </div>
            )}

            {meeting.cancellationReason && (
              <div>
                <h3 className="text-sm text-gray-500">Cancellation Reason</h3>
                <p className="mt-1 text-gray-900">{meeting.cancellationReason}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <textarea
              className="w-full h-32 p-3 border rounded-md"
              placeholder="Add meeting notes..."
            />
            <button className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary/90">
              Save Notes
            </button>
          </div>
        )}

        <div className="flex justify-end pt-6 border-t">
          <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium">
            Schedule Follow-up
          </button>
        </div>
      </div>
    </Modal>
  );
};

PastMeetingDetailsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  meeting: PropTypes.shape({
    client: PropTypes.string,
    service: PropTypes.string,
    date: PropTypes.string,
    time: PropTypes.string,
    sessionStatus: PropTypes.string,
    paymentStatus: PropTypes.string,
    amount: PropTypes.number,
    summary: PropTypes.string,
    rating: PropTypes.number,
    feedback: PropTypes.string,
    keyPoints: PropTypes.arrayOf(PropTypes.string),
    actionItems: PropTypes.arrayOf(PropTypes.string),
    cancellationReason: PropTypes.string,
  }),
};

export default PastMeetingDetailsModal;