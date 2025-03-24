import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Star, User } from "lucide-react";
import { useDispatch } from "react-redux";
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
  // console.log('This is my starting price ',startingPrice);
  // console.log('This is my duration  ',duration);
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
  // Find the first available slot
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
    <div className="w-[492px] h-[328px] bg-[#FDFDFD] rounded-[15px] p-5 border border-[#1D1D1D26] space-y-3">
      {/* Top Section */}
      <div className="flex items-start gap-4">
        <img
          src={image}
          alt={name}
          className="w-[108px] h-[108px] rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-gray-900">{name}</h2>
              <p className="text-[#1d1f1d]">{title}</p>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-gray-900 font-medium">{rating}/5</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-800 text-[12px] flex gap-2 items-start bg-[#ecfaf0] px-3 py-1 rounded-[24px]">
                    <User className="w-3 h-3" />
                    {totalRatings} Sessions done
                  </span>
                </div>
              </div>

              <p className="text-gray-900">
                Experience: <span className="font-medium">{experience}</span> in
                industry
              </p>
              <p className="text-gray-900">
                Starts at{" "}
                <span className="text-[#004ab3] font-semibold">
                  Rs. {startingPrice}
                </span>{" "}
                for{" "}
                <span className="text-[#004ab3] font-semibold">{duration} min</span>
              </p>
            </div>

            <button
              onClick={toggleLike}
              className={`ml-4 ${isAnimating ? "animate-ping" : ""}`}
            >
              <Heart
                className={`h-6 w-6 transition-transform duration-300 ${
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
      <div className="my-8 h-[62px] overflow-hidden">
        <div className="flex flex-wrap gap-2">
          <p className="text-gray-900 font-medium">Expertise:</p>
          {expertise.map((skill) => (
            <span
              key={skill}
              className="px-3 py-1 bg-[#f2f2f2] rounded-[8px] text-gray-900 text-sm"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Next Available Slot */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex flex-col text-sm text-gray-900 w-48">
          Next Available Slot:{" "}
          <span className="text-[#004ab3] font-medium">
            {firstAvailableDay
              ? `${firstAvailableDay.day}, ${firstAvailableTime}`
              : "No slots available"}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            // onClick={() => navigate(`/expert/${id}`)}
            onClick={() => navigate(`/expert/${redirect_url}`)}
            className="px-5 py-2 bg-white border font-bold rounded-lg text-sm text-gray-700 hover:shadow-md hover:bg-gray-50 transition-colors shadow-sm whitespace-nowrap"
            // onClick={() => navigate(`/expert/${id}`)}
            // className="px-5 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:bg-gray-50 transition-colors shadow-sm whitespace-nowrap"
          >
            View Profile
          </button>
          <button
            onClick={() => navigate(`/expert/scheduling/${id}`)}
            className="px-6 py-2 bg-primary rounded-lg text-sm text-white hover:bg-green-600 transition-colors shadow-sm whitespace-nowrap"
          >
            BOOK
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpertCard;
