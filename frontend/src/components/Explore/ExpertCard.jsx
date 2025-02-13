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
    <div className="w-full relative rounded-[12.85px] bg-gray-100 border-gray-600 border-[1.6px] border-solid box-border flex flex-col items-start justify-start pt-[25.7px] px-[32.1px] pb-[37px]">
      <div className="self-stretch relative h-[373.8px]">
        {/* Top Section */}
        <div className="absolute top-0 left-0 w-[591.3px] flex flex-col items-start justify-start gap-[20.9px]">
          <div className="self-stretch relative h-[190.2px]">
            <div className="absolute top-0 left-0 w-[559.2px] h-[190.2px]">
              {/* Profile Image */}
              <div className="absolute top-0 left-0 w-[144.6px] h-[168.7px] flex flex-row items-center justify-start py-[12.9px] px-0 box-border">
                <img 
                  className="w-[144.6px] relative rounded-[50%] h-[144.6px] object-cover" 
                  alt={name} 
                  src={image} 
                />
              </div>

              {/* Profile Info */}
              <div className="absolute top-0 left-[163.9px] w-[395.3px] h-[190.2px]">
                <div className="absolute top-0 left-0 w-[395.3px] h-[114.9px]">
                  <div className="absolute top-0 left-0 w-[395.3px] h-[81.9px]">
                    <div className="absolute top-0 left-0 leading-[140%] font-semibold text-[27.85px] text-gray-900">
                      {name}
                    </div>
                    <div className="absolute top-[38.56px] left-0 text-[20.26px] leading-[150%] text-gray-600 opacity-[0.8]">
                      {title}
                    </div>
                  </div>

                  {/* Rating and Sessions */}
                  <div className="absolute top-[81.95px] left-0 w-[77.4px] h-[32.9px] text-[18.99px]">
                    <Star className="absolute top-[4.7px] left-0 w-[23.5px] h-[23.5px] fill-yellow-400 text-yellow-400" />
                    <div className="absolute top-[2.49px] left-[25.53px] leading-[150%] font-medium">
                      {rating}/5
                    </div>
                  </div>

                  <div className="absolute top-[83.18px] left-[92.64px] rounded-[31.65px] bg-honeydew-200 overflow-hidden flex flex-col items-start justify-start py-[2.5px] px-[12.7px]">
                    <div className="self-stretch flex flex-row items-center justify-start gap-[10.1px] text-[13.93px]">
                      <div className="relative leading-[150%] font-medium">
                        {totalRatings} Sessions done
                      </div>
                    </div>
                  </div>
                </div>

                {/* Experience and Price */}
                <div className="absolute top-[124.51px] left-0 w-[395.3px] flex flex-col items-start justify-start gap-[5.8px] text-[20.26px]">
                  <div className="relative leading-[150%]">
                    <span>Experience: </span>
                    <span className="font-medium">{experience}</span>
                    <span> in industry</span>
                  </div>
                  <div className="self-stretch h-[32.1px] flex flex-col items-start justify-start text-gray-400">
                    <div className="relative leading-[150%]">
                      <span>Starts at </span>
                      <span className="font-medium text-blue-600">${startingPrice}</span>
                      <span> for </span>
                      <span className="font-medium text-blue-600">{duration}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Heart Icon */}
            <button
              onClick={toggleLike}
              className={`absolute top-0 right-0 ${isAnimating ? "animate-ping" : ""}`}
            >
              <Heart
                className={`w-[30.9px] h-[30.9px] transition-transform duration-300 ${
                  isAnimating ? "scale-125" : ""
                }`}
                fill={liked ? "#EF4444" : "none"}
                stroke={liked ? "#EF4444" : "currentColor"}
              />
            </button>
          </div>

          {/* Expertise Tags */}
          <div className="self-stretch flex flex-row items-center justify-center text-[19.62px]">
            <div className="w-[591.3px] relative h-[85.2px]">
              <div className="absolute top-[2.63px] left-0 flex items-center gap-[14.5px]">
                <div className="leading-[150%]">Expertise: </div>
                <div className="flex flex-wrap gap-[14.5px]">
                  {expertise.map((skill) => (
                    <div
                      key={skill}
                      className="rounded-[10.52px] bg-whitesmoke flex flex-row items-center justify-center py-[1.6px] px-[14.5px]"
                    >
                      <div className="relative leading-[150%]">{skill}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Next Available Slot and Buttons */}
        <div className="absolute top-[315.58px] left-0 w-[591.3px] h-[58.2px] text-[18.99px]">
          <div className="absolute top-0 left-0 w-[204.3px] h-14">
            <div className="absolute top-0 left-0 w-[204.3px] flex flex-col items-start justify-start">
              <div className="self-stretch relative leading-[150%] font-medium">
                Next Available Slot:
              </div>
              <div className="self-stretch relative leading-[150%] text-blue-600">
                {nextSlot.day}, {nextSlot.time}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="absolute top-[6.62px] left-[233.75px] flex flex-row items-center justify-start gap-[10.1px]">
            <button
              onClick={() => navigate(`/expert/${id}`)}
              className="w-[173.5px] h-[45.6px] shadow-[0px_3.2px_8.03px_2.81px_rgba(0,_0,_0,_0.1)] rounded-[14.46px] bg-white flex items-center justify-center text-gray-700"
            >
              <span className="leading-[150%] font-medium">View Profile</span>
            </button>
            <button
              onClick={() => navigate(`/expert/scheduling/${id}`)}
              className="w-[170.3px] h-[45px] shadow-[0px_3.2px_8.03px_2.81px_rgba(0,_0,_0,_0.1)] rounded-[14.46px] bg-green-500 flex items-center justify-center text-white hover:bg-green-600"
            >
              <span className="leading-[150%] font-medium">BOOK</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpertCard;