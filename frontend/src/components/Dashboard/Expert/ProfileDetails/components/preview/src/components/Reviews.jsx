import React, { useState } from 'react';
import ReviewCard from './ReviewCard';
import Pagination from './Pagination';

const Reviews = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 4;
  
  const reviews = [
    {
      initials: "GH",
      name: "Guy Hawkins",
      rating: 5,
      text: "Prerna's guidance was instrumental in helping me navigate a challenging career transition. Her insights and strategies were practical and effective."
    },
    {
      initials: "WW",
      name: "Wade Warren",
      rating: 4,
      text: "Prerna's guidance was instrumental in helping me navigate a challenging career transition. Her insights and strategies were practical and effective."
    },
    {
      initials: "EP",
      name: "Eleanor Pena",
      rating: 3,
      text: "Prerna's guidance was instrumental in helping me navigate a challenging career transition. Her insights and strategies were practical and effective."
    },
    {
      initials: "KM",
      name: "Kathryn Murphy",
      rating: 4,
      text: "Prerna's guidance was instrumental in helping me navigate a challenging career transition. Her insights and strategies were practical and effective."
    },
    {
      initials: "JD",
      name: "John Doe",
      rating: 5,
      text: "Exceptional mentor who helped me improve my technical skills significantly. The personalized approach made all the difference."
    },
    {
      initials: "AS",
      name: "Alice Smith",
      rating: 5,
      text: "Great experience working with such a knowledgeable professional. The sessions were well-structured and very helpful."
    }
  ];

  // Calculate pagination
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="bg-white rounded-[20px] p-6 mt-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-1">Ratings and Reviews</h2>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold">4.9</span>
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, index) => (
              <svg
                key={index}
                className="text-yellow-400"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <path d="M8 0L9.79611 5.52786H15.6085L10.9062 8.94427L12.7023 14.4721L8 11.0557L3.29772 14.4721L5.09383 8.94427L0.391548 5.52786H6.20389L8 0Z" />
              </svg>
            ))}
          </div>
          <span className="text-sm text-gray-500">Based on {reviews.length} reviews</span>
        </div>
      </div>

      <h3 className="font-medium mb-4">Client Reviews</h3>
      
      <div className="space-y-4">
        {currentReviews.map((review, index) => (
          <ReviewCard key={index} review={review} />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default Reviews;