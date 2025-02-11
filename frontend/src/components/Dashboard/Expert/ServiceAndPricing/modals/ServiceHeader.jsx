import PropTypes from 'prop-types';

export default function ServiceHeader({ onClose }) {
  return (
    <div className="flex justify-between items-center border-b border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900">Add Service Details</h2>
      <button 
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

ServiceHeader.propTypes = {
  onClose: PropTypes.func.isRequired,
};