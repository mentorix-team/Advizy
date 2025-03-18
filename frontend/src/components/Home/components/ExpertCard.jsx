import { getAvailabilitybyid } from "@/Redux/Slices/availability.slice";
import { motion } from "framer-motion";
import { User } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const ExpertCard = ({ expert }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const cardRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);
  const [availability, setAvailability] = useState(null);
  const navigate = useNavigate();
  console.log("Expert: ", expert);
  const calculateTotalExperience = (workExperiences) => {
    if (!Array.isArray(workExperiences) || workExperiences.length === 0)
      return "0 years";

    let totalMonths = 0;

    workExperiences.forEach((job) => {
      if (!job.startDate || !job.endDate) return;

      const start = new Date(job.startDate);
      const end = new Date(job.endDate);

      const yearsDiff = end.getFullYear() - start.getFullYear();
      const monthsDiff = end.getMonth() - start.getMonth();

      totalMonths += yearsDiff * 12 + monthsDiff;
    });

    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;

    return years > 0 ? `${years} years ${months} months` : `${months} months`;
  };

  const firstService = expert.credentials?.services?.[0];
  const startingPrice = firstService?.price || 0;
  const duration = firstService?.duration || "N/A";

  const totalExperience = calculateTotalExperience(
    expert.credentials?.work_experiences
  );
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting);
        });
      },
      { threshold: 0.5 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const response = await dispatch(
          getAvailabilitybyid(expert._id)
        ).unwrap();

        setAvailability(response.availability);
      } catch (error) {
        console.error("Error fetching availability:", error);
      }
    };

    fetchAvailability();
  }, [dispatch, expert._id]);

  const firstAvailableDay = availability?.daySpecific?.find(
    (day) => day.slots.length > 0
  );
  const firstAvailableTime = firstAvailableDay?.slots?.[0]?.startTime;

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    toast.success(
      !isFavorite ? "Added to favorites!" : "Removed from favorites!",
      {
        duration: 2000,
        position: "top-right",
        style: {
          background: "#169544",
          color: "#fff",
          borderRadius: "10px",
        },
      }
    );
  };

  return (
    <div
      ref={cardRef}
      className="w-[445px] h-[300px] rounded-lg border border-gray-300 p-[16px_20px_23px_20px] relative"
    >
      {/* inner container */}
      <div className="w-[378px] h-[270px] flex flex-col gap-[12px]">
        {/* first container */}
        <div className="w-[348px] h-[122px] flex gap-[12px]">
          <div className="relative flex items-center">
            <div className="w-[90px] h-[90px] rounded-full overflow-hidden"></div>
            <img
              src={
                expert?.profileImage?.secure_url ||
                "https://via.placeholder.com/100"
              }
              alt={`${expert.firstName} ${expert.lastName}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold">
                {`${expert.firstName} ${expert.lastName}`}
              </h2>
              <p className="text-gray-700 text-sm">
                {expert.credentials?.domain}
              </p>
              <div className="flex items-center mt-1 text-sm">
                <span className="text-yellow-400">★</span>
                <span className="ml-1 font-medium">
                  {expert.reviews?.length > 0
                    ? expert.reviews.reduce(
                        (acc, review) => acc + review.rating,
                        0
                      ) / expert.reviews.length
                    : 0}
                </span>
                <div className="ml-2 flex gap-1 items-center bg-green-50 rounded-full border p-1">
                  <User className="w-4 h-4" />
                  {expert.reviews} Session done
                </div>
              </div>
            </div>
            {/* <button
          className={`text-gray-400 hover:text-red-500 transition-colors ${
            isFavorite ? "text-red-500" : ""
          }`}
          onClick={handleFavoriteClick}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          animate={
            isFavorite
              ? {
                  scale: [1, 1.2, 1],
                  transition: { duration: 0.3 },
                }
              : {}
          }
        >
          <svg
            className="w-6 h-6"
            fill={isFavorite ? "currentColor" : "none"}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button> */}
            <p className="text-gray-700 text-sm mb-1">
              Experience: <span className="font-medium">{totalExperience}</span>
            </p>
            <p className="text-gray-700 text-sm mb-1">
              Starts at{" "}
              <span className="text-blue-600 font-medium">
                Rs{startingPrice}
              </span>{" "}
              for{" "}
              <span className="font-medium text-blue-600">{duration}mins</span>
            </p>
          </div>
        </div>

        {/* <div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="flex flex-wrap gap-2">
          <p className="text-sm text-gray-600">Expertise:</p>
          {expert.credentials.expertise.map((skill, index) => (
            < span 
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 + 0.5 }}
              whileHover={{ scale: 1.1 }}
              className="text-sm px-3 py-1 bg-gray-100 rounded-full text-gray-700"
            >
              {skill}
            </ span>
          ))}
        </div>
      </div> */}

        <div className="flex gap-3 justify-between">
          <div>
            <p className="text-gray-800 text-sm">Next Available Slot:</p>
            <p className="text-blue-600 text-sm">
              {firstAvailableDay
                ? `${firstAvailableDay.day}, ${firstAvailableTime}`
                : "No slots available"}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              className="px-3 py-0 border border-gray-200 text-sm rounded-md hover:bg-gray-100"
              onClick={() => navigate(`/expert/${expert.redirect_url}`)}
            >
              View Profile
            </button>
            <button
              className="px-7 bg-green-500 text-white text-sm rounded-md hover:bg-green-600"
              onClick={() => navigate(`/expert/${expert.redirect_url}`)}
            >
              Book
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpertCard;
