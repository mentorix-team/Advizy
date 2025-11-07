import React, { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getfeedbackbyexpertid } from "@/Redux/Slices/meetingSlice";
import ReviewCard from "./ReviewCard";
import Pagination from "./Pagination";
import { Star } from "lucide-react";

const Reviews = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const reviewsPerPage = 4;

  const dispatch = useDispatch();
  const { expertData } = useSelector((state) => state.expert);
  const { feedbackofexpert, loading: feedbackLoading } = useSelector((state) => state.meeting);

  useEffect(() => {
    if (expertData?._id) {
      setLoading(true);
      setError(null);
      dispatch(getfeedbackbyexpertid({ id: expertData._id }))
        .unwrap()
        .then(() => {
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching feedback:", err);
          setError("Failed to load reviews. Please try again.");
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [dispatch, expertData]);

  useEffect(() => {
    if (feedbackofexpert) {
      const feedbackArray = Array.isArray(feedbackofexpert) ? feedbackofexpert : [];

      const mappedTestimonials = feedbackArray.map((feedback) => ({
        id: feedback._id,
        name: feedback.userName || "Anonymous User",
        service: feedback.serviceName || "General Service",
        comment: feedback.feedback || "No comment provided",
        rating: Number(feedback.rating) || 0,
        date: feedback.createdAt || new Date().toISOString(),
        meetingId: feedback.meeting_id,
        userId: feedback.user_id,
      }));

      setTestimonials(mappedTestimonials);
      setLoading(false);
    } else {
      setTestimonials([]);
      setLoading(false);
    }
  }, [feedbackofexpert]);

  // Calculate analytics data
  const analytics = useMemo(() => {
    const totalReviews = testimonials.length;
    const validRatings = testimonials.filter(t => t.rating > 0);
    const totalRating = validRatings.reduce((sum, t) => sum + t.rating, 0);
    const averageRating = validRatings.length > 0 ? (totalRating / validRatings.length).toFixed(1) : '0.0';

    return {
      totalReviews: `${totalReviews}`,
      validReviews: validRatings.length,
      averageRating: Number(averageRating),
    };
  }, [testimonials]);

  // Format reviews for display
  const formattedReviews = useMemo(() => {
    return testimonials.map((review) => ({
      initials: review?.name
        ? review.name
          .split(" ")
          .map((n) => n[0])
          .join("")
        : "N/A",
      name: review?.name || "Anonymous",
      rating: review?.rating ?? 5,
      text: review?.comment || "No review text provided.",
    }));
  }, [testimonials]);

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

  // Render star rating
  const renderStars = (rating) => {
    return (
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            className={index < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
            width="16"
            height="16"
          />
        ))}
      </div>
    );
  };

  // Loading state
  if (loading || feedbackLoading) {
    return (
      <div className="bg-white rounded-[20px] p-6 mt-6">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-1">Ratings and Reviews</h2>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading reviews...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white rounded-[20px] p-6 mt-6">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-1">Ratings and Reviews</h2>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="text-red-500 text-xl mb-4">⚠️</div>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={() => {
                  setError(null);
                  setLoading(true);
                  if (expertData?._id) {
                    dispatch(getfeedbackbyexpertid({ id: expertData._id }));
                  }
                }}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[20px] p-6 mt-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-1">Ratings and Reviews</h2>

        {formattedReviews.length > 0 ? (
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">{analytics.averageRating}</span>
            {renderStars(analytics.averageRating)}
            <span className="text-sm text-gray-500">
              Based on {analytics.validReviews} reviews
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
          </div>
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
        </p>
      )}
    </div>
  );
};

export default Reviews;