import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
import { getAvailabilitybyid } from "@/Redux/Slices/availability.slice";

const expertCard = ({ expert }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const cardRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);
  const [availability, setAvailability] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  console.log("expert in expert CARD ----", expert);

  const calculateTotalExperience = (workExperiences) => {
    if (!Array.isArray(workExperiences) || workExperiences.length === 0)
      return "0 years";

    let totalMonths = 0;

    workExperiences.forEach((job) => {
      if (!job.startDate || !job.endDate) return;

      const start = new Date(job.startDate);
      const end = new Date(job.endDate);

      const yearsDiff = end.getFullYear() - start.getFullYear();
      const monthsDiff = end.getMonth() - start.getMonth();

      totalMonths += yearsDiff * 12 + monthsDiff;
    });

    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;

    return years > 0 ? `${years} years ${months} months` : `${months} months`;
  };

  const mentoringService = expert.credentials?.services?.find(
    (service) => service.title === "One-on-One Mentoring"
  );

  const firstEnabledSlot = mentoringService?.one_on_one?.find(
    (slot) => slot.enabled
  );

  const startingPrice = firstEnabledSlot?.price || 0;
  const duration = firstEnabledSlot?.duration || "N/A";

  const totalExperience = calculateTotalExperience(
    expert.credentials?.work_experiences
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting);
        });
      },
      { threshold: 0.5 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const response = await dispatch(
          getAvailabilitybyid(expert._id)
        ).unwrap();
        setAvailability(response.availability);
      } catch (error) {
        console.error("Error fetching availability:", error);
      }
    };

    fetchAvailability();
  }, [dispatch, expert]);

  const firstAvailableDay = availability?.daySpecific?.find(
    (day) => day.slots.length > 0
  );
  const firstAvailableTime = firstAvailableDay?.slots?.[0]?.startTime;

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    toast.success(
      !isFavorite ? "Added to favorites!" : "Removed from favorites!",
      {
        duration: 2000,
        position: "top-right",
        style: {
          background: "#169544",
          color: "#fff",
          borderRadius: "10px",
        },
      }
    );
  };

  const averageRating =
    expert.reviews?.length > 0
      ? (
          expert.reviews.reduce((acc, review) => acc + review.rating, 0) /
          expert.reviews.length
        ).toFixed(1)
      : "0.0";

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: isVisible ? 1 : 0.3,
        y: 0,
      }}
      transition={{ duration: 0.5 }}
      className="flex flex-row justify-center w-full"
    >
      <div className="w-[289px] mx-auto mt-[41px] bg-neutral-50 rounded-lg shadow-md border border-solid border-[#00000040] p-5">
        <div className="flex flex-col items-center">
          <div className="py-2.5">
            <div className="w-[120px] h-[120px] rounded-full overflow-hidden">
              <img
                src={
                  expert.image ||
                  "https://via.placeholder.com/100"
                }
                alt={`${expert.name}`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="flex items-center gap-[1.22px] mt-6">
            <Star className="w-[14.64px] h-[14.64px] text-yellow-400 fill-yellow-400" />
            <span className="font-medium text-black text-[13.4px] leading-[20.1px] font-['Figtree']">
              {averageRating}
            </span>
            <span className="font-medium text-gray-700 text-[9.8px] leading-[14.6px] font-['Figtree']">
              ({expert.reviews || 0} reviews)
            </span>
          </div>

          <div className="flex flex-col items-center w-full mt-2">
            <div className="flex items-center gap-2">
              <h3 className="font-['Figtree'] font-semibold text-[#1d1f1d] text-xl leading-7">
                {`${expert.name}`}
              </h3>
              {expert.admin_approved_expert && (
                <img src="/svg-image-65.svg" alt="verified tick" />
              )}
            </div>
            <p className="opacity-80 font-['Figtree'] font-normal text-black text-base text-center leading-6">
              {expert.title || "experts"}
            </p>
          </div>

          <div className="flex w-full items-center justify-between mt-6">
            <div className="flex flex-col">
              <span className="font-['Figtree'] font-medium text-[#1d1f1d] text-xs leading-[18px]">
                Next Available Slot:
              </span>
              <span className="font-['Figtree'] font-normal text-[#1f409b] text-xs leading-[18px]">
                {firstAvailableDay
                  ? `${firstAvailableDay.day}, ${firstAvailableTime}`
                  : "No slots available"}
              </span>
            </div>

            <button
              onClick={() => navigate(`/expert/${expert.redirect_url}`)}
              className="h-[27px] bg-neutral-50 rounded-[9px] border border-[#00000040] shadow-[0px_2px_5px_1.75px_#0000001a] px-3 font-['Figtree'] font-medium text-[#1d1d1fcc] text-[15px] hover:bg-gray-50"
            >
              View Profile
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default expertCard
