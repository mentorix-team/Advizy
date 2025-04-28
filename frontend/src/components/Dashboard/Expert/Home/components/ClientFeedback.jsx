import React from 'react';
import { Star } from 'lucide-react';
import PropTypes from 'prop-types';

const ClientFeedback = ({
  feedback = [],
  onViewAll = () => {},
}) => {
  // Limit to maximum 4 feedback items
  const limitedFeedback = feedback.slice(0, 4);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        size={16}
        className={`${
          index < rating 
            ? 'text-yellow-400 fill-yellow-400' 
            : 'text-gray-200'
        } transition-colors`}
      />
    ));
  };

  return (
    <div className="bg-white border rounded-lg shadow-sm p-4 sm:p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg sm:text-xl font-bold">Recent Client Feedback</h2>
        <button 
          onClick={onViewAll}
          className="text-gray-500 hover:text-gray-800 transition-colors p-2 -m-2"
          aria-label="View all feedback"
        >
          <span className="text-xl">→</span>
        </button>
      </div>

      <div className="space-y-6">
        {Array.isArray(limitedFeedback) && limitedFeedback.length > 0 ? (
          limitedFeedback.map((item, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden">
                {item.avatar ? (
                  <img 
                    src={item.avatar} 
                    alt={`${item.userName}'s avatar`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-500 font-medium text-sm">
                    {item.userName.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-medium truncate">{item.userName}</span>
                  <div className="flex">{renderStars(item.rating)}</div>
                </div>
                <p className="text-sm text-gray-600 break-words">{item.feedback}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No feedback available</p>
        )}
      </div>
    </div>
  );
};

ClientFeedback.propTypes = {
  feedback: PropTypes.arrayOf(
    PropTypes.shape({
      userName: PropTypes.string.isRequired,
      rating: PropTypes.number.isRequired,
      feedback: PropTypes.string.isRequired,
      avatar: PropTypes.string
    })
  ),
  onViewAll: PropTypes.func
};

export default ClientFeedback;