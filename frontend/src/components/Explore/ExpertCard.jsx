import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { User, Star, Heart } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
// import { cn } from "../../lib/utils";
// import { Slot } from "@radix-ui/react-slot";
// import { cva } from "class-variance-authority";
import { getAvailabilitybyid } from "@/Redux/Slices/availability.slice";

const ExpertCard = ({
  redirect_url,
  id,
  name,
  image,
  title,
  rating,
  totalRatings,
  experience,
  startingPrice,
  duration,
  expertise,
}) => {
  const [liked, setLiked] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [availability, setAvailability] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const response = await dispatch(getAvailabilitybyid(id)).unwrap();
        setAvailability(response.availability);
      } catch (error) {
        console.error("Error fetching availability:", error);
      }
    };

    fetchAvailability();
  }, [dispatch, id]);

  const firstAvailableDay = availability?.daySpecific?.find(
    (day) => day.slots.length > 0
  );
  const firstAvailableTime = firstAvailableDay?.slots?.[0]?.startTime;

  const toggleLike = () => {
    setLiked(!liked);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <div className="w-full md:w-[491px] min-h-[327px] bg-white rounded-[15px] p-3 sm:p-5 border border-[#1D1D1D26] shadow-sm">
      <div className="flex flex-col gap-4">
        {/* Top Section */}
        <div className="flex items-start gap-3 sm:gap-4">
          <img
            src={image}
            alt={name}
            className="w-[80px] h-[80px] sm:w-[108px] sm:h-[108px] rounded-full object-cover"
          />
          <div className="flex-1 min-w-0">
            {" "}
            {/* Added min-w-0 to prevent text overflow */}
            <div className="flex items-start justify-between">
              <div className="space-y-1 sm:space-y-2">
                <h2 className="text-[18px] sm:text-[22px] font-semibold text-[#1D1D1D] truncate">
                  {name}
                </h2>
                <p className="text-[13px] sm:text-[15px] text-[#1D1F1D] opacity-80">
                  {title}
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <div className="flex items-center gap-1">
                    <Star className="h-[16px] w-[16px] sm:h-[18px] sm:w-[18px] fill-yellow-400 text-yellow-400" />
                    <span className="text-[13px] sm:text-[14px] font-medium text-[#1D1F1D]">
                      {rating}/5
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-[11px] sm:text-[12px] flex gap-1 items-center bg-[#C4F3D34C] px-2 sm:px-3 py-[2px] rounded-[24px] text-[#1D1F1D]">
                      <User className="w-3 h-3" />
                      {totalRatings} Sessions done
                    </span>
                  </div>
                </div>

                <p className="text-[13px] sm:text-[15px] text-[#1D1D1D]">
                  Experience: <span className="font-medium">{experience}</span>{" "}
                  in industry
                </p>
                <p className="text-[13px] sm:text-[15px]">
                  Starts at{" "}
                  <span className="text-[#0049B3] font-medium">
                    Rs. {startingPrice}
                  </span>{" "}
                  for{" "}
                  <span className="text-[#0049B3] font-medium">
                    {duration} min
                  </span>
                </p>
              </div>

              <button
                onClick={toggleLike}
                className={`ml-2 sm:ml-4 ${isAnimating ? "animate-ping" : ""}`}
              >
                <Heart
                  className={`h-5 w-5 sm:h-6 sm:w-6 transition-transform duration-300 ${
                    isAnimating ? "scale-125" : ""
                  }`}
                  fill={liked ? "#EF4444" : "none"}
                  stroke={liked ? "#EF4444" : "currentColor"}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Expertise Tags */}
        <div className="mt-2">
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            <span className="text-[13px] sm:text-[15px] text-[#1D1F1D]">
              Expertise:
            </span>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {expertise.map((skill, index) => (
                <span
                  key={skill}
                  className="px-2 sm:px-3 py-[2px] bg-[#F2F2F2] rounded-[8px] text-[13px] sm:text-[15px] text-[#1D1F1D]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Next Available Slot */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-auto pt-4 gap-3 sm:gap-0">
          <div className="flex flex-col">
            <span className="text-[13px] sm:text-[14px] font-medium text-[#1D1F1D]">
              Next Available Slot:
            </span>
            <span className="text-[13px] sm:text-[14px] text-[#1F409B]">
              {firstAvailableDay
                ? `${firstAvailableDay.day}, ${firstAvailableTime}`
                : "No slots available"}
            </span>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={() => navigate(`/expert/${redirect_url}`)}
              className="flex-1 sm:flex-none px-4 sm:px-5 py-2 bg-white border border-gray-200 rounded-[11px] text-[13px] sm:text-[14px] font-medium text-[#000000CC] hover:bg-gray-50 transition-colors shadow-[0px_2px_5px_rgba(0,0,0,0.1)]"
            >
              View Profile
            </button>
            <button
              onClick={() => {
                navigate(`/expert/${redirect_url}?scrollTo=services-offered`);
              }}
              className="flex-1 sm:flex-none px-4 sm:px-6 py-2 bg-[#EDFBF1] rounded-[11px] text-[13px] sm:text-[14px] font-semibold text-[#169544] hover:bg-[#E5F9EB] transition-colors shadow-[0px_2px_5px_rgba(0,0,0,0.1)]"
            >
              BOOK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpertCard;
