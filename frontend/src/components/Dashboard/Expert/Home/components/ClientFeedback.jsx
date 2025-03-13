import React from 'react';
import { BiStar } from 'react-icons/bi';
import PropTypes from 'prop-types';

export default function ClientFeedback({ 
  feedback = [],
  onViewAll = () => {}
}) {
  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <BiStar
        key={index}
        className={index < rating ? 'text-yellow-400' : 'text-gray-200'}
        size={16}
      />
    ));
  };

  return (
    <div className="bg-white border rounded-lg shadow-sm p-4 sm:p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg sm:text-xl font-bold">Recent Client Feedback</h2>
        <button 
          onClick={onViewAll}
          className="text-gray-400 hover:text-gray-600"
        >
          →
        </button>
      </div>

      <div className="space-y-6">
      {Array.isArray(feedback) && feedback.length > 0 ? (
  feedback.map((item, index) => (
    <div key={index} className="flex items-start gap-4">
      <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0">
        {item.avatar && (
          <img 
            src={item.avatar} 
            alt={item.userName}
            className="w-full h-full rounded-full object-cover"
          />
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
}

ClientFeedback.propTypes = {
  feedback: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
    comment: PropTypes.string.isRequired,
    avatar: PropTypes.string
  })),
  onViewAll: PropTypes.func
};