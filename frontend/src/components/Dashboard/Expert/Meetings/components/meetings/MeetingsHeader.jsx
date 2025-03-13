import PropTypes from 'prop-types';
import { BsFilter } from 'react-icons/bs';

const MeetingsHeader = ({ activeTab }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm mb-6">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {activeTab === 'upcoming' ? 'Upcoming Meetings' : 'Past Meetings'}
          </h2>
          <div className="flex gap-4">
            
          </div>
        </div>
      </div>
    </div>
  );
};

MeetingsHeader.propTypes = {
  activeTab: PropTypes.oneOf(['upcoming', 'past']).isRequired
};

export default MeetingsHeader;