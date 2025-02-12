import React from 'react';

const ReviewCard = ({ review }) => {
  return (
    <div className="rounded-[12px] border border-[#bbc0c4a0] p-4">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm">
          {review.initials}
        </div>
        <div>
          <h3 className="text-sm font-medium">{review.name}</h3>
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, index) => (
              <svg
                key={index}
                className={index < review.rating ? 'text-yellow-400' : 'text-gray-200'}
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <path d="M8 0L9.79611 5.52786H15.6085L10.9062 8.94427L12.7023 14.4721L8 11.0557L3.29772 14.4721L5.09383 8.94427L0.391548 5.52786H6.20389L8 0Z" />
              </svg>
            ))}
          </div>
        </div>
      </div>
      <p className="text-sm text-gray-600 mt-2">{review.text}</p>
    </div>
  );
};

export default ReviewCard;