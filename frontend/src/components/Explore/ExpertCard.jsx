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
    <div className="w-[492px] h-[328px] rounded-lg border border-gray-300 p-[16px_20px_23px_20px] relative">
      {/* inner container */}
      <div className="w-[443px] h-[280px] flex flex-col gap-[12px]">
        {/* first section */}
        <div className="w-[443px] h-[142px] flex gap-[12px]">
          <div className="relative flex items-center">
            <div className="w-[108px] h-[108px] rounded-full overflow-hidden">
              <img
                src={image}
                alt={name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold">{name}</h2>
                <p className="text-gray-700 text-md">{title}</p>

                <div className="flex items-center my-1 text-sm">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-gray-900 font-medium">{rating}/5</span>
                  <div className="ml-2 flex gap-1 items-center bg-green-50 rounded-full border p-1">
                    {" "}
                    <User className="w-3 h-3" />
                    {totalRatings} Sessions done
                  </div>
                </div>
              </div>
            </div>

            <p className="text-gray-700 text-sm mb-2">
              Experience: <span className="font-medium">{experience}</span> in
              industry
            </p>
            <p className="text-gray-700 text-sm mb-2">
              Starts at{" "}
              <span className="text-blue-600 font-semibold">
                ₹{startingPrice}
              </span>{" "}
              for{" "}
              <span className="text-[#004ab3] font-semibold">{duration}</span>
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
              // onClick={() => navigate(`/expert/${id}`)}
              onClick={() => navigate(`/expert/${redirect_url}`)}
              className="px-3 py-0 border border-gray-200 text-sm rounded-md hover:bg-gray-100"
            >
              View Profile
            </button>
            <button
              onClick={() => navigate(`/expert/scheduling/${id}`)}
              className="px-7 bg-green-500 text-white text-sm rounded-md hover:bg-green-600"
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
