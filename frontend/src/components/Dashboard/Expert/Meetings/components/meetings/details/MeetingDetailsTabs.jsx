import PropTypes from 'prop-types';

const MeetingDetailsTabs = ({ activeTab, onTabChange }) => {
  return (
    <div className="inline-flex bg-gray-100 rounded-lg p-1">
      <button 
        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
          activeTab === 'details' 
            ? 'bg-white shadow-sm' 
            : 'text-gray-500 hover:text-gray-700'
        }`}
        onClick={() => onTabChange('details')}
      >
        Details
      </button>
      <button 
        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
          activeTab === 'notes' 
            ? 'bg-white shadow-sm' 
            : 'text-gray-500 hover:text-gray-700'
        }`}
        onClick={() => onTabChange('notes')}
      >
        Notes
      </button>
    </div>
  );
};

MeetingDetailsTabs.propTypes = {
  activeTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
};

export default MeetingDetailsTabs;