import { fetchFavourites } from "@/Redux/Slices/favouritesSlice";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ExpertCard from "./ExpertCard";
import { Heart } from "lucide-react";
import { getfeedbackbyexpertid } from "@/Redux/Slices/meetingSlice";

const Favourites = () => {
  const dispatch = useDispatch();
  const { ids, entities, loading, error } = useSelector((state) => state.favourites);
  const [expertFeedback, setExpertFeedback] = useState({});
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  useEffect(() => {
    if (!ids.length) dispatch(fetchFavourites());
  }, [ids.length, dispatch]);

  const uniqueEntities = useMemo(() => {
    const map = new Map();
    entities.forEach((e) => { if (e?._id && !map.has(e._id)) map.set(e._id, e); });
    return Array.from(map.values());
  }, [entities]);

  // Fetch feedback for each favorite expert
  useEffect(() => {
    const fetchExpertFeedback = async () => {
      if (uniqueEntities.length === 0) return;

      setFeedbackLoading(true);
      const feedbackData = {};

      // Process experts in batches to avoid too many simultaneous requests
      const batchSize = 5;
      for (let i = 0; i < uniqueEntities.length; i += batchSize) {
        const batch = uniqueEntities.slice(i, i + batchSize);
        const batchPromises = batch.map(expert => {
          if (expert._id) {
            return dispatch(getfeedbackbyexpertid({ id: expert._id }))
              .unwrap()
              .then(result => ({ expertId: expert._id, feedback: Array.isArray(result) ? result : (result?.feedback || []) }))
              .catch(error => {
                console.error(`Error fetching feedback for expert ${expert._id}:`, error);
                return { expertId: expert._id, feedback: [] };
              });
          }
          return Promise.resolve({ expertId: expert._id, feedback: [] });
        });

        const batchResults = await Promise.all(batchPromises);
        batchResults.forEach(result => {
          feedbackData[result.expertId] = result.feedback;
        });
      }

      setExpertFeedback(feedbackData);
      setFeedbackLoading(false);
    };

    if (uniqueEntities.length > 0) {
      fetchExpertFeedback();
    }
  }, [uniqueEntities, dispatch]);

  // Calculate rating data for each expert
  const calculateRatingData = (expertId) => {
    const feedback = expertFeedback[expertId] || [];

    if (!Array.isArray(feedback) || feedback.length === 0) {
      return {
        averageRating: 0,
        reviewsCount: 0
      };
    }

    const validRatings = feedback.filter(review =>
      review && review.rating != null && !isNaN(Number(review.rating))
    );

    const totalRating = validRatings.reduce((sum, review) =>
      sum + Number(review.rating), 0
    );

    const averageRating = validRatings.length > 0
      ? parseFloat((totalRating / validRatings.length).toFixed(1))
      : 0;

    return {
      averageRating,
      reviewsCount: feedback.length
    };
  };

  if (loading || feedbackLoading) return <p className="p-8 text-center">Loading favourites...</p>;
  if (error) return <p className="p-8 text-center text-red-600">{error}</p>;

  if (!uniqueEntities.length) {
    return (
      <div className="flex justify-center py-12">
        <div className="text-center max-w-sm p-6 border rounded bg-white">
          <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-green-50 mb-4">
            <Heart className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No Favourite Experts</h3>
          <p className="text-sm text-gray-600">
            Add experts to your favourites to see them here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-10">
      <h1 className="text-2xl font-semibold mb-6 text-green-700">My Favourite Experts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {uniqueEntities.map((ex) => {
          const ratingData = calculateRatingData(ex._id);
          return (
            <ExpertCard
              key={ex._id}
              expert={ex}
              rating={ratingData.averageRating}
              totalRatings={ratingData.reviewsCount}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Favourites;