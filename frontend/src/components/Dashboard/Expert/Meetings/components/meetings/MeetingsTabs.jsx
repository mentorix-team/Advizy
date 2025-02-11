import PropTypes from 'prop-types';

const MeetingsTabs = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex flex-wrap gap-2 sm:gap-4">
      <button 
        onClick={() => onTabChange('upcoming')}
        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
          activeTab === 'upcoming'
            ? 'text-gray-900 bg-white shadow-sm border border-gray-200'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        Upcoming Meetings
      </button>
      <button 
        onClick={() => onTabChange('past')}
        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
          activeTab === 'past'
            ? 'text-gray-900 bg-white shadow-sm border border-gray-200'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        Past Meetings
      </button>
    </div>
  );
};

MeetingsTabs.propTypes = {
  activeTab: PropTypes.oneOf(['upcoming', 'past']).isRequired,
  onTabChange: PropTypes.func.isRequired
};

export default MeetingsTabs;