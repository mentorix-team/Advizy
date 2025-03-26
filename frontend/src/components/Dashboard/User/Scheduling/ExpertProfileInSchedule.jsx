import PropTypes from 'prop-types';
import { useState } from 'react';

function ExpertProfileInSchedule({ expert }) {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 w-full h-fit">
      <div className="flex items-center gap-4 mb-6">
        <img 
          src={expert.image} 
          alt={expert.name}
          className="w-16 sm:w-20 h-16 sm:h-20 rounded-full object-cover"
        />
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">{expert.name}</h2>
          <p className="text-sm sm:text-base text-gray-500">{expert.title}</p>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Career Strategy Session</h3>
          <button 
            onClick={() => setShowMore(!showMore)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg 
              className={`w-5 h-5 transform transition-transform ${showMore ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        <div className="flex items-center gap-2 flex-wrap mt-4">
          <span className="flex items-center text-gray-600 text-sm sm:text-base">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="ml-1">{expert.sessionDuration} min</span>
          </span>
          <span className="ml-auto text-green-600 font-medium">₹{expert.price}</span>
        </div>
      </div>

      {/* Collapsible Content */}
      {showMore && (
        <div className="mt-6 space-y-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Description:</h4>
            <p className="text-gray-600 text-sm leading-relaxed">{expert.description}</p>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-3">What's Included:</h4>
            <ul className="space-y-2">
              {expert.includes.map((item, index) => (
                <li key={index} className="flex items-start text-gray-600 text-sm">
                  <span className="text-green-500 mr-2 mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

ExpertProfileInSchedule.propTypes = {
  expert: PropTypes.shape({
    image: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    sessionDuration: PropTypes.number.isRequired,
    price: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    includes: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
};

export default ExpertProfileInSchedule;