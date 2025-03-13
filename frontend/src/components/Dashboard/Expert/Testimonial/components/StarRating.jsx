import React from 'react';

const StarRating = ({ rating, size = 'md' }) => {
  const starSize = size === 'lg' ? 'w-6 h-6' : 'w-5 h-5';
  
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`${starSize} ${
            star <= rating ? 'text-yellow-400' : 'text-gray-200'
          }`}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </div>
  );
};

export default StarRating;