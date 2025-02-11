import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Star } from "lucide-react";

const ExpertCard = ({
  id, // Add id to props
  name,
  image,
  title,
  rating,
  totalRatings,
  experience,
  languages,
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

  // Pass id dynamically to the route
  const handleViewProfile = () => {
    navigate(`/expert/${id}`);
  };

  const handleBook = () => {
    navigate(`/expert/scheduling/${id}`);
  };

  return (
    <div
      className="relative rounded-lg border border-gray-300 shadow-lg p-4"
      style={{
        width: "344px",
        height: "356px",
        borderRadius: "10px",
        margin: "16px auto",
        padding: "20px",
      }}
    >
      {/* Heart Like Button */}
      <button
        className={`absolute top-4 right-4 text-gray-400 ${
          liked ? "text-red-500" : ""
        } ${isAnimating ? "animate-ping" : ""}`}
        onClick={toggleLike}
        style={{
          zIndex: 10,
        }}
      >
        <Heart
          className={`h-6 w-6 transition-transform duration-300 ${
            isAnimating ? "scale-125" : ""
          }`}
          fill={liked ? "currentColor" : "none"}
        />
      </button>

      {/* Header Section */}
      <div className="flex items-start gap-4 mb-4">
        <img
          src={image}
          alt={name}
          className="rounded-full object-cover"
          style={{
            width: "85px",
            height: "85px",
          }}
        />
        <div>
          <h2 className="font-bold text-black text-lg">{name}</h2>
          <p className="text-sm text-gray-800">{title}</p>
          <div className="flex items-center gap-1 mt-2">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{rating.toFixed(1)}/5</span>
            <span className="text-gray-500 text-sm">({totalRatings})</span>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="space-y-2 text-sm mb-4">
        <p className="text-gray-700">Experience: {experience}</p>
        <p className="text-gray-700">Languages: {languages.join(", ")}</p>
        <p className="text-gray-700">
          Starts at{" "}
          <span className="font-medium text-black">${startingPrice}</span> for{" "}
          <span className="font-medium text-black">{duration}</span>
        </p>
      </div>

      {/* Expertise Section */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-1">
          <p className="mb-1 text-sm font-medium">Expertise: </p>
          {expertise.map((skill) => (
            <span
              key={skill}
              className="rounded-xl bg-gray-200 px-2 py-1 text-xs text-black"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Next Slot Section */}
      <div className="mb-4 rounded-md border p-1">
        <p className="text-sm text-gray-800">
          Next Available Slot:{" "}
          <span className="font-medium text-black">
            {nextSlot.day}, {nextSlot.time}
          </span>
        </p>
      </div>

      {/* Buttons Section */}
      <div className="flex gap-3">
        <button
          onClick={handleViewProfile}
          className="flex-1 rounded-2xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          VIEW PROFILE
        </button>
        <button
          onClick={handleBook}
          className="flex-1 rounded-2xl bg-[#16A348] px-3 py-2 text-sm font-medium text-white hover:bg-[#388544]"
        >
          BOOK
        </button>
      </div>
    </div>
  );
};

export default ExpertCard;
