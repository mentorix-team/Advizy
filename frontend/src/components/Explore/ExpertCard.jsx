// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Heart, Star } from "lucide-react";

// const ExpertCard = ({
//   id, // Add id to props
//   name,
//   image,
//   title,
//   rating,
//   totalRatings,
//   experience,
//   languages,
//   startingPrice,
//   duration,
//   expertise,
//   nextSlot,
// }) => {
//   const [liked, setLiked] = useState(false);
//   const [isAnimating, setIsAnimating] = useState(false);

//   const navigate = useNavigate();

//   const toggleLike = () => {
//     setLiked(!liked);
//     setIsAnimating(true);
//     setTimeout(() => setIsAnimating(false), 500);
//   };

//   // Pass id dynamically to the route
//   const handleViewProfile = () => {
//     navigate(`/expert/${id}`);
//   };

//   const handleBook = () => {
//     navigate(`/expert/scheduling/${id}`);
//   };

//   return (
//     <div
//       className="relative rounded-lg border border-gray-300 shadow-lg p-4"
//       style={{
//         width: "344px",
//         height: "356px",
//         borderRadius: "10px",
//         margin: "16px auto",
//         padding: "20px",
//       }}
//     >
//       {/* Heart Like Button */}
//       <button
//         className={`absolute top-4 right-4 text-gray-400 ${
//           liked ? "text-red-500" : ""
//         } ${isAnimating ? "animate-ping" : ""}`}
//         onClick={toggleLike}
//         style={{
//           zIndex: 10,
//         }}
//       >
//         <Heart
//           className={`h-6 w-6 transition-transform duration-300 ${
//             isAnimating ? "scale-125" : ""
//           }`}
//           fill={liked ? "currentColor" : "none"}
//         />
//       </button>

//       {/* Header Section */}
//       <div className="flex items-start gap-4 mb-4">
//         <img
//           src={image}
//           alt={name}
//           className="rounded-full object-cover"
//           style={{
//             width: "85px",
//             height: "85px",
//           }}
//         />
//         <div>
//           <h2 className="font-bold text-black text-lg">{name}</h2>
//           <p className="text-sm text-gray-800">{title}</p>
//           <div className="flex items-center gap-1 mt-2">
//             <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
//             <span className="font-medium">{rating.toFixed(1)}/5</span>
//             <span className="text-gray-500 text-sm">({totalRatings})</span>
//           </div>
//         </div>
//       </div>

//       {/* Details Section */}
//       <div className="space-y-2 text-sm mb-4">
//         <p className="text-gray-700">Experience: {experience}</p>
//         <p className="text-gray-700">Languages: {languages.join(", ")}</p>
//         <p className="text-gray-700">
//           Starts at{" "}
//           <span className="font-medium text-black">${startingPrice}</span> for{" "}
//           <span className="font-medium text-black">{duration}</span>
//         </p>
//       </div>

//       {/* Expertise Section */}
//       <div className="mb-4">
//         <div className="flex flex-wrap gap-1">
//           <p className="mb-1 text-sm font-medium">Expertise: </p>
//           {expertise.map((skill) => (
//             <span
//               key={skill}
//               className="rounded-xl bg-gray-200 px-2 py-1 text-xs text-black"
//             >
//               {skill}
//             </span>
//           ))}
//         </div>
//       </div>

//       {/* Next Slot Section */}
//       <div className="mb-4 rounded-md border p-1">
//         <p className="text-sm text-gray-800">
//           Next Available Slot:{" "}
//           <span className="font-medium text-black">
//             {nextSlot.day}, {nextSlot.time}
//           </span>
//         </p>
//       </div>

//       {/* Buttons Section */}
//       <div className="flex gap-3">
//         <button
//           onClick={handleViewProfile}
//           className="flex-1 rounded-2xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
//         >
//           VIEW PROFILE
//         </button>
//         <button
//           onClick={handleBook}
//           className="flex-1 rounded-2xl bg-[#16A348] px-3 py-2 text-sm font-medium text-white hover:bg-[#388544]"
//         >
//           BOOK
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ExpertCard;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Star } from "lucide-react";

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
    <div className="w-[492px] h-[328px] bg-[#FDFDFD] rounded-tl-[10px] p-5 border border-[#1D1D1D26] space-y-3">
      {/* Top Section */}
      <div className="flex items-start gap-4">
        {/* Profile Image */}
        <img
          src={image}
          alt={name}
          className="w-20 h-20 rounded-full object-cover"
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
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 bg-">
                    {totalRatings} Sessions done
                  </span>
                </div>
              </div>

              {/* Experience and Price */}
              <p className="text-gray-900">
                Experience: {experience} in industry
              </p>
              <p className="text-gray-900">
                Starts at{" "}
                <span className="text-blue-600">${startingPrice}</span> for{" "}
                <span className="text-blue-600">{duration}</span>
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

      {/* Next Available Slot
      <div className="border border-gray-200 rounded-lg p-3">
        <p className="text-gray-900">
          Next Available Slot:{" "}
          <span className="text-blue-600">
            {nextSlot.day}, {nextSlot.time}
          </span>
        </p>
      </div>

      Action Buttons 
      <div className="flex gap-4 pt-2">
        <button
          onClick={() => navigate(`/expert/${id}`)}
          className="flex-1 px-6 py-2 border border-gray-300 rounded-full text-gray-700 font-medium hover:bg-gray-50 transition-colors"
        >
          View Profile
        </button>
        <button
          onClick={() => navigate(`/expert/scheduling/${id}`)}
          className="flex-1 px-6 py-2 bg-green-500 text-white rounded-full font-medium hover:bg-green-600 transition-colors"
        >
          BOOK
        </button>
      </div> */}
      {/* Bottom Row - Next Available Slot and Action Buttons */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-900 w-48">
          Next Available Slot:{" "}
          <span className="text-blue-600 font-medium">
            {nextSlot.day}, {nextSlot.time}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/expert/${id}`)}
            className="px-5 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:bg-gray-50 transition-colors shadow-sm whitespace-nowrap"
          >
            View Profile
          </button>
          <button
            onClick={() => navigate(`/expert/scheduling/${id}`)}
            className="px-5 py-2 bg-green-500 rounded-full text-sm text-white hover:bg-green-600 transition-colors shadow-sm whitespace-nowrap"
          >
            BOOK
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpertCard;
