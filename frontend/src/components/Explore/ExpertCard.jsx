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
    <div className="w-full max-w-[492px] mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Profile Section */}
      <div className="p-4">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
          {/* Profile Image */}
          <div className="shrink-0">
            <img
              src={image}
              alt={name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-gray-50"
            />
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">
              <TruncatedText text={name} limit={20} />
            </h2>
            <p className="text-gray-600 text-sm sm:text-base mb-2">
              <TruncatedText text={title} limit={30} />
            </p>

            {/* Ratings & Sessions */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
              <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full">
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                <span className="text-sm font-medium text-gray-900">{rating}/5</span>
              </div>
              <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full">
                <User className="h-4 w-4 text-green-600" />
                <span className="text-sm text-gray-900">{totalRatings} Sessions</span>
              </div>
            </div>

            {/* Experience & Price */}
            <div className="space-y-1 text-sm sm:text-base">
              <p className="text-gray-700">
                <span className="font-medium">{experience}</span> years experience
              </p>
              <p>
                <span className="text-blue-600 font-medium">${startingPrice}</span>
                <span className="text-gray-600"> for {duration}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Expertise Tags */}
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Expertise:</p>
          <div className="flex flex-wrap gap-2">
            {displayedTags.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-50 text-gray-700 rounded-full text-xs"
              >
                <TruncatedText text={skill} limit={15} />
              </span>
            ))}
            {hasMoreTags && !showAllTags && (
              <button
                onClick={() => setShowAllTags(true)}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                +{expertise.length - 3} more
              </button>
            )}
            {showAllTags && (
              <button
                onClick={() => setShowAllTags(false)}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                Show less
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="border-t border-gray-100 p-4 bg-gray-50">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {/* Next Available Slot */}
          <div className="w-full sm:w-auto">
            <p className="text-sm font-medium text-gray-700">Next Available:</p>
            <p className="text-sm text-blue-600">
              {firstAvailableDay
                ? `${firstAvailableDay.day}, ${firstAvailableTime}`
                : "No slots available"}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={() => navigate(`/expert/${redirect_url}`)}
              className="flex-1 sm:w-auto px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              View Profile
            </button>
            <button
              onClick={() => navigate(`/expert/scheduling/${id}`)}
              className="flex-1 sm:w-auto px-6 py-2 bg-green-600 rounded-lg text-sm text-white font-medium hover:bg-green-700 transition-colors"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpertCard;