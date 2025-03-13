import PropTypes from 'prop-types';
import Modal from './Modal';
import { useState } from 'react';

const MeetingDetailsModal = ({ isOpen, onClose, meeting }) => {
  const [activeTab, setActiveTab] = useState('details');

  if (!meeting) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Meeting Details"
    >
      <div className="space-y-6">
        <p className="text-gray-600">
          Upcoming meeting information with {meeting.client}.
        </p>
        
        <div className="flex space-x-2 mb-6">
          <button 
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'details' 
                ? 'bg-gray-100 text-gray-900' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('details')}
          >
            Details
          </button>
          <button 
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'notes' 
                ? 'bg-gray-100 text-gray-900' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('notes')}
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
                <span className="inline-flex mt-1 px-3 py-1 rounded-full text-sm font-medium bg-gray-900 text-white">
                  Scheduled
                </span>
              </div>
              <div>
                <h3 className="text-sm text-gray-500">Payment Status</h3>
                <span className="inline-flex mt-1 px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                  {meeting.paymentStatus}
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-sm text-gray-500">Amount</h3>
              <p className="mt-1 text-gray-900">₹{meeting.amount}</p>
            </div>

            <div>
              <h3 className="text-sm text-gray-500">Client Message</h3>
              <p className="mt-1 text-gray-900">I'd like to discuss the project timeline.</p>
            </div>
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

        <div className="flex justify-end space-x-3 pt-6 border-t">
          <button className="px-4 py-2 text-red-600 hover:text-red-700 font-medium">
            Cancel Meeting
          </button>
          <button className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium">
            Reschedule Meeting
          </button>
          <button className="px-4 py-2 bg-[#4CAF50] text-white rounded-md hover:bg-[#43a047] transition-colors">
            Send Follow-up Message
          </button>
        </div>
      </div>
    </Modal>
  );
};

MeetingDetailsModal.propTypes = {
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
  }),
};

export default MeetingDetailsModal;