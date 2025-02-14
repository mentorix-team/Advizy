import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Star, User } from "lucide-react";

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
    <div className="bg-white p-6 rounded-lg shadow-sm border-2 border-gray-100 w-[491px] sm:w-[408px] mx-auto relative overflow-hidden z-0 transform-gpu">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-start gap-4">
          <div className="relative w-20 h-20 rounded-full overflow-hidden">
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-gray-900">{name}</h3>
            <p className="text-gray-600 text-sm mb-1">{title}</p>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="font-medium text-sm">{rating}/5</span>
              </div>
              <span
                className="text-gray-700 text-sm"
                style={{
                  borderRadius: "25px",
                  background: "rgba(196, 243, 211, 0.30)",
                  display: "inline-flex",
                  padding: "2px 8px",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <User className="w-4 h-4" />
                {totalRatings} Sessions done
              </span>
            </div>
          </div>
        </div>
        <button
          className={`text-gray-400 hover:text-red-500 transition-colors ${
            liked ? "text-red-500" : ""
          }`}
          onClick={toggleLike}
        >
          <Heart className="w-6 h-6" fill={liked ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="space-y-2 mb-4">
        <p className="text-gray-600 text-sm">
          Experience: {experience} in industry
        </p>
        <p className="text-sm">
          Starts at{" "}
          <span className="text-primary font-medium">₹{startingPrice}</span> for{" "}
          {duration}
        </p>
      </div>

      <div>
        <div className="flex flex-wrap gap-2">
          <p className="text-sm text-gray-600">Expertise:</p>
          {expertise.map((skill, index) => (
            <span
              key={index}
              className="text-sm px-3 py-1 bg-gray-100 rounded-full text-gray-700"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div>
          <p className="text-sm text-gray-600">Next Available Slot:</p>
          <p className="text-sm text-primary">
            {nextSlot.day}, {nextSlot.time}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/expert/${id}`)}
            className="px-4 py-2 text-gray-700 text-sm font-medium hover:bg-gray-50 rounded-lg border border-gray-200"
          >
            View Profile
          </button>
          <button
            onClick={() => navigate(`/expert/scheduling/${id}`)}
            className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90"
          >
            Book
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpertCard;
