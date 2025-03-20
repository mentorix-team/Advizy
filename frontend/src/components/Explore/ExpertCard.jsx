import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ChevronDown, LogOut, User, CircleUserRound, Video, BadgeIndianRupee, UserPen, MessageSquareText, LayoutDashboard, Home, UserCheck, Menu, X, Star, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { getAvailabilitybyid } from "@/Redux/Slices/availability.slice";

const TruncatedText = ({ text, limit }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (text.length <= limit) {
    return <span>{text}</span>;
  }

  return (
    <span 
      onClick={() => setIsExpanded(!isExpanded)} 
      className="cursor-pointer"
      title={isExpanded ? "Click to collapse" : "Click to expand"}
    >
      {isExpanded ? text : `${text.slice(0, limit)}...`}
    </span>
  );
};

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
  const [showAllTags, setShowAllTags] = useState(false);
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

  const displayedTags = showAllTags ? expertise : expertise.slice(0, 3);
  const hasMoreTags = expertise.length > 3;

  return (
    <div className="w-full max-w-[492px] min-h-[328px] bg-[#FDFDFD] rounded-[15px] p-4 sm:p-5 border border-[#1D1D1D26] space-y-3">
      {/* Top Section */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
        <img
          src={image}
          alt={name}
          className="w-[90px] h-[90px] sm:w-[108px] sm:h-[108px] rounded-full object-cover"
        />
        <div className="flex-1 w-full">
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-2 sm:gap-0">
            <div className="space-y-1 text-center sm:text-left w-full sm:w-auto">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                <TruncatedText text={name} limit={20} />
              </h2>
              <p className="text-[#1d1f1d] text-sm sm:text-base">
                <TruncatedText text={title} limit={30} />
              </p>

              <div className="flex items-center justify-center sm:justify-start gap-3 flex-wrap">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 sm:h-5 sm:w-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-gray-900 font-medium text-sm sm:text-base">{rating}/5</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-800 text-[11px] sm:text-[12px] flex gap-1 sm:gap-2 items-center bg-[#ecfaf0] px-2 sm:px-3 py-1 rounded-[24px]">
                    <User className="w-3 h-3" />
                    {totalRatings} Sessions done
                  </span>
                </div>
              </div>

              <p className="text-gray-900 text-sm sm:text-base">
                Experience: <span className="font-medium">{experience}</span> in industry
              </p>
              <p className="text-gray-900 text-sm sm:text-base">
                Starts at{" "}
                <span className="text-[#004ab3] font-semibold">
                  ${startingPrice}
                </span>{" "}
                for{" "}
                <span className="text-[#004ab3] font-semibold">{duration}</span>
              </p>
            </div>

            <p className="text-gray-700 text-sm mb-2">
              Experience: <span className="font-medium">{experience}</span> in
              industry
            </p>
            <p className="text-gray-700 text-sm mb-2">
              Starts at{" "}
              <span className="text-blue-600 font-semibold">
                Rs. {startingPrice}
              </span>{" "}
              for{" "}
              <span className="text-[#004ab3] font-semibold">{duration} min</span>
            </p>
          </div>
        </div>

        <div>
          <div className="flex flex-wrap gap-2">
            <p className="text-gray-900 font-medium text-sm">Expertise:</p>
            {expertise.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 bg-gray-100 border border-gray-200 rounded-full text-[13px]"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Next Available Slot */}
        <div className="flex gap-3 justify-between">
          <div>
            <p className="text-gray-800 text-sm">Next Available Slot: </p>
            <span className="text-blue-600 text-sm">
              {firstAvailableDay
                ? `${firstAvailableDay.day}, ${firstAvailableTime}`
                : "No slots available"}
            </span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={toggleLike}
              className={`sm:ml-4 ${isAnimating ? "animate-ping" : ""}`}
            >
              <Heart
                className={`h-5 w-5 sm:h-6 sm:w-6 transition-transform duration-300 ${
                  isAnimating ? "scale-125" : ""
                }`}
                fill={liked ? "#EF4444" : "none"}
                stroke={liked ? "#EF4444" : "currentColor"}
              />
            </button> */}
          </div>
        </div>
      </div>

      {/* Expertise Tags */}
      <div className="mt-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <span className="text-gray-900 font-medium text-sm sm:text-base">Expertise:</span>
          <div className="flex flex-wrap gap-2 w-full">
            {displayedTags.map((skill, index) => (
              <span
                key={index}
                className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-900 rounded-[4px] text-xs sm:text-sm"
              >
                <TruncatedText text={skill} limit={15} />
              </span>
            ))}
            {hasMoreTags && !showAllTags && (
              <button
                onClick={() => setShowAllTags(true)}
                className="px-2 py-1 text-xs sm:text-sm text-blue-600 hover:text-blue-800"
              >
                +{expertise.length - 3} more...
              </button>
            )}
            {showAllTags && (
              <button
                onClick={() => setShowAllTags(false)}
                className="px-2 py-1 text-xs sm:text-sm text-blue-600 hover:text-blue-800"
              >
                Show less
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Next Available Slot */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mt-4">
        <div className="flex flex-col text-xs sm:text-sm text-gray-900 w-full sm:w-auto">
          <span className="font-medium">Next Available Slot:</span>
          <span className="text-[#004ab3]">
            {firstAvailableDay
              ? `${firstAvailableDay.day}, ${firstAvailableTime}`
              : "No slots available"}
          </span>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={() => navigate(`/expert/${redirect_url}`)}
            className="flex-1 sm:flex-none px-3 sm:px-5 py-2 bg-white border border-gray-200 rounded-lg text-xs sm:text-sm text-gray-700 hover:bg-gray-50 transition-colors shadow-sm whitespace-nowrap"
          >
            View Profile
          </button>
          <button
            onClick={() => navigate(`/expert/scheduling/${id}`)}
            className="flex-1 sm:flex-none px-4 sm:px-6 py-2 bg-[#169544] rounded-lg text-xs sm:text-sm text-white hover:bg-[#138539] transition-colors shadow-sm whitespace-nowrap"
          >
            BOOK
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpertCard;