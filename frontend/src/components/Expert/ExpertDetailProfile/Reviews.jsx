import React, { useState } from "react";
import ReviewCard from "./ReviewCard";
import Pagination from "./Pagination";
import { Star } from "lucide-react";

const Reviews = ({ reviews }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 4;

  // Ensure reviews is an array before mapping
  const safeReviews = Array.isArray(reviews) ? reviews : [];

  // Convert feedbackofexpert to match the expected format
  const formattedReviews = safeReviews.map((review) => ({
    initials: review?.userName
      ? review.userName
          .split(" ")
          .map((n) => n[0])
          .join("")
      : "N/A", // Handle undefined userName
    name: review?.userName || "Anonymous", // Default to 'Anonymous'
    rating: review?.rating ?? 5, // Default rating to 5 if not present
    text: review?.feedback || "No review text provided.", // Default text if missing
  }));

  // Pagination logic
  const totalPages = Math.ceil(formattedReviews.length / reviewsPerPage);
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = formattedReviews.slice(
    indexOfFirstReview,
    indexOfLastReview
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="bg-white rounded-[20px] p-6 mt-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-1">Ratings and Reviews</h2>

        {formattedReviews.length > 0 ? (
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
            <span className="text-sm text-gray-500">
              Based on {formattedReviews.length} reviews
            </span>
          </div>
        ) : (
          <div className="border rounded-lg flex flex-col items-center justify-center p-4 bg-background">
            <div className="mb-3">
              <Star className="w-10 h-10 text-muted-foreground" />
            </div>
            <div className="text-center text-sm text-muted-foreground">
              No reviews available yet
            </div>
          </div> // Show message when no reviews
        )}
      </div>

      {formattedReviews.length > 0 ? (
        <>
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
        </>
      ) : (
        <p className="text-xs mt-1 text-primary">
          Be the first to leave a review
        </p> // Alternative fallback
      )}
    </div>
  );
};

export default Reviews;
