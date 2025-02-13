import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Star,User } from "lucide-react";

const ExpertCard = ({
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
  nextSlot,
}) => {
  const [liked, setLiked] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();

  const toggleLike = () => {
    setLiked(!liked);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <div className="w-[656px] h-[330px] bg-[#FDFDFD] rounded-tl-[10px] p-5 border border-[#1D1D1D26] space-y-3">
      {/* Top Section */}
      <div className="flex items-start gap-4">
        {/* Profile Image */}
        <img
          src={image}
          alt={name}
          className="w-36 h-36 rounded-full object-cover"
        />

        {/* Profile Info */}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              {/* Name and Title */}
              <h2 className="text-xl font-semibold text-gray-900">{name}</h2>
              <p className="text-gray-600">{title}</p>

              {/* Rating and Sessions */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-gray-900 font-medium">{rating}/5</span>
                </div>
                <div className="flex items-center bg-green-200 gap-2">
                  <User className="text-gray-700 w-3 h-3" />
                  <span className="text-gray-600">
                    {totalRatings} Sessions done
                  </span>
                </div>
              </div>

              {/* Experience and Price */}
              <p className="text-gray-900">
                Experience: <span className="font-semibold">{experience}</span> in industry
              </p>
              <p className="text-gray-900">
                Starts at{" "}
                <span className="text-blue-800">₹{startingPrice}</span> for{" "}
                <span className="text-blue-800">{duration}</span>
              </p>
            </div>

            {/* Favorite Button */}
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
      <div className="space-y-2">
        <div className="flex flex-wrap gap-2">
          <p className="text-gray-900 font-medium">Expertise:</p>
          {expertise.map((skill) => (
            <span
              key={skill}
              className="px-3 py-1 bg-gray-100 rounded-full text-gray-900 text-sm"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom Row - Next Available Slot and Action Buttons */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-900 w-48">
          Next Available Slot:{" "}
          <span className="text-blue-800 font-semibold">
            {nextSlot.day}, {nextSlot.time}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/expert/${id}`)}
            className="px-5 py-2 bg-white border border-gray-200 font-bold rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors shadow-sm whitespace-nowrap"
          >
            View Profile
          </button>
          <button
            onClick={() => navigate(`/expert/scheduling/${id}`)}
            className="px-5 py-2 bg-[#EDFBF1] rounded-lg text-sm font-bold text-white transition-colors shadow-sm whitespace-nowrap"
          >
            BOOK
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpertCard;
