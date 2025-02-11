import PropTypes from 'prop-types';
import Modal from './Modal';
import { useState } from 'react';
import './joinMeetingPopup.css'

const JoinMeetingModal = ({ isOpen, onClose, meeting }) => {
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(`https://meet.example.com/${meeting?.client.toLowerCase().replace(' ', '-')}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Join Meeting"
      className="custom-modal"
    >
      <div className="space-y-4 w-fit">
        <p className="text-gray-600">
          Click the button below to join your meeting with {meeting?.client}.
        </p>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={`https://meet.example.com/${meeting?.client?.toLowerCase().replace(' ', '-')}`}
            readOnly
            className="flex-1 p-2 border rounded-md bg-gray-50"
          />
          <button
            onClick={copyLink}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              copied 
                ? 'bg-green-50 text-green-600 border border-green-200' 
                : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
            }`}
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
        <button
          onClick={onClose}
          className="w-full bg-[#169544] text-white py-2 px-4 rounded-md hover:bg-[#388544] flex items-center justify-center space-x-2"
        >
          <span>Open Meeting Room</span>
          <span>↗</span>
        </button>
      </div>
    </Modal>
  );
};

JoinMeetingModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  meeting: PropTypes.shape({
    client: PropTypes.string.isRequired,
  }),
};

export default JoinMeetingModal;