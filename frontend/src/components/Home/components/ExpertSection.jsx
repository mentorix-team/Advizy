import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import ExpertCard from "./ExpertCard";
import { useSelector, useDispatch } from "react-redux";
import ExpertHomeCard from "@/components/LoadingSkeleton/ExpertHomeCard";
import { getfeedbackbyexpertid } from "@/Redux/Slices/meetingSlice";

const ExpertSection = ({ title, subtitle, experts, link }) => {
  const sectionRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { loading, error } = useSelector((state) => state.expert);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [expertRatings, setExpertRatings] = useState({});
  useEffect(() => {
    setIsLoading(loading);
  }, [loading]);

  const calculateRatingData = (feedbackArray) => {
    if (!Array.isArray(feedbackArray) || feedbackArray.length === 0) {
      return { averageRating: 0, totalRatings: 0 };
    }

    // Map feedback to normalize ratings, matching Testimonial.jsx logic
    const mappedFeedback = feedbackArray.map((feedback) => ({
      ...feedback,
      rating: Number(feedback.rating) || 0,
    }));

    // Filter for valid ratings (> 0), matching Testimonial.jsx logic
    const validRatings = mappedFeedback.filter(t => t.rating > 0);

    if (validRatings.length === 0) {
      return { averageRating: 0, totalRatings: 0 };
    }

    const totalRating = validRatings.reduce((sum, t) => sum + t.rating, 0);
    const averageRating = validRatings.length > 0 ? (totalRating / validRatings.length).toFixed(1) : '0.0';

    return {
      averageRating: Number(averageRating),
      totalRatings: validRatings.length,
    };
  };

  useEffect(() => {
    const fetchExpertFeedback = async () => {
      if (!experts || experts.length === 0) return;

      console.log('Fetching feedback for experts:', experts.length);
      console.log('Sample expert structure:', experts[0]);
      const ratingsMap = {};

      // Batch fetch feedback for all experts
      const feedbackPromises = experts.map(async (expert) => {
        try {
          console.log(`Fetching feedback for expert ${expert.id}...`);
          const response = await dispatch(getfeedbackbyexpertid({ id: expert.id })).unwrap();
          console.log(`Feedback response for expert ${expert.id}:`, response);

          // Handle the response structure - the feedback is in response.feedback
          const feedback = Array.isArray(response?.feedback) ? response.feedback : Array.isArray(response) ? response : [];
          console.log(`Processed feedback for expert ${expert.id}:`, feedback);

          const ratingData = calculateRatingData(feedback);
          console.log(`Rating data for expert ${expert.id}:`, ratingData);

          ratingsMap[expert.id] = ratingData;
        } catch (error) {
          console.error(`Error fetching feedback for expert ${expert.id}:`, error);
          ratingsMap[expert.id] = { averageRating: 0, totalRatings: 0 };
        }
      });

      await Promise.all(feedbackPromises);
      console.log('Final ratings map:', ratingsMap);
      setExpertRatings(ratingsMap);
    };

    fetchExpertFeedback();
  }, [experts, dispatch]);
  const cardsPerView = {
    mobile: 1,
    desktop: 4, // Changed from 3 to 4
  };

  const getCardsPerView = () => {
    return window.innerWidth < 768 ? cardsPerView.mobile : cardsPerView.desktop;
  };

  const [visibleCards, setVisibleCards] = useState(getCardsPerView());

  useEffect(() => {
    const handleResize = () => {
      setVisibleCards(getCardsPerView());
      // Reset to first card when switching to mobile view
      if (window.innerWidth < 768) {
        setCurrentIndex(0);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + visibleCards;
      if (nextIndex >= experts.length) {
        return 0;
      }
      return nextIndex;
    });
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex - visibleCards;
      if (nextIndex < 0) {
        return Math.max(0, experts.length - visibleCards);
      }
      return nextIndex;
    });
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <motion.div
      ref={sectionRef}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative" // Added padding for better spacing
    >
      <motion.div
        variants={headerVariants}
        className="flex justify-between items-center"
      >
        <div className="flex-grow-0"> 
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-2xl font-bold"
          >
            {title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-sm sm:text-base text-gray-600"
          >
            {subtitle}
          </motion.p>
        </div>
        <div className="ml-4 flex-shrink-0">
        <motion.a
          href={link}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05, x: 5 }}
          className="text-sm sm:text-base text-primary hover:text-green-600 font-medium flex items-center gap-1"
        >
          See All {title}
          <motion.svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            initial={{ x: 0 }}
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </motion.svg>
        </motion.a>
        </div>
      </motion.div>

      <div className="relative">
        {/* Navigation Buttons */}
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 sm:-translate-x-6"
          style={{ transform: "translate(-24px, -50%)" }}
        >
          <motion.button
            onClick={handlePrev}
            className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            disabled={currentIndex === 0}
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </motion.button>
        </div>

        <div
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 sm:translate-x-6"
          style={{ transform: "translate(24px, -50%)" }}
        >
          <motion.button
            onClick={handleNext}
            className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            disabled={currentIndex >= experts.length - visibleCards}
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </motion.button>
        </div>

        <div className="overflow-hidden pb-4 pt-4 -mx-2 px-2">
          {isLoading ? (
            <div className="flex gap-4">
              {[...Array(Math.min(4, visibleCards))].map((_, index) => (
                <ExpertHomeCard key={`skeleton-${index}`} />
              ))}
            </div>
          ) : experts.length === 0 ? (
            <div className="text-center py-10">No experts available</div>
          ) : (
            <motion.div
              className="flex gap-4"
              animate={{
                x: -(currentIndex * (100 / visibleCards)) + "%",
              }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 20,
                mass: 0.5,
              }}
            >
              {experts.map((expert, index) => (
                <motion.div
                  key={`${expert.name}-${index}`}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.8,
                    delay: (index % visibleCards) * 0.1,
                  }}
                  className="relative flex-shrink-0"
                  style={{
                    width: `calc(${100 / visibleCards}% - ${(16 * (visibleCards - 1)) / visibleCards
                      }px)`,
                    margin: window.innerWidth < 768 ? "0 auto" : "initial",
                  }}
                >
                  <ExpertCard
                    expert={expert}
                    displayRating={
                      expertRatings[expert.id]?.averageRating ||
                      expert.averageRating ||
                      0
                    }
                    displayTotalRatings={
                      expertRatings[expert.id]?.totalRatings ||
                      expert.totalRatings ||
                      0
                    }
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ExpertSection;
